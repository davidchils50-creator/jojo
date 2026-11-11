import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface LobbySignal {
  roomCode: string;
  hostId: string;
  hostCharId: string;
  hostOffer?: any;
  hostIceCandidates: any[];
  clientId?: string;
  clientAnswer?: any;
  clientIceCandidates: any[];
  status: 'empty' | 'waiting' | 'connected';
  lastActive: number;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS Middleware to allow requests from GitHub Pages or any origin
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // In-memory lobby database for WebRTC signaling
  const lobbies = new Map<string, LobbySignal>();

  // In-memory public rooms directory for lobby listing
  interface PublicRoomRecord {
    id: string;
    room_name: string;
    host_char: string;
    status: 'waiting' | 'connected' | 'closed';
    connection_mode: 'peerjs' | 'supabase';
    created_at: string;
    updated_at: number;
  }
  const publicRoomsMap = new Map<string, PublicRoomRecord>();

  // Clean up inactive rooms (> 10 minutes old) and stale public rooms (> 45s no heartbeat)
  setInterval(() => {
    const now = Date.now();
    for (const [code, lobby] of lobbies.entries()) {
      if (now - lobby.lastActive > 10 * 60 * 1000) {
        lobbies.delete(code);
      }
    }
    for (const [id, room] of publicRoomsMap.entries()) {
      if (now - room.updated_at > 45 * 1000) {
        publicRoomsMap.delete(id);
      }
    }
  }, 10 * 1000);

  // --- API Routes for WebRTC Signaling Relay & Public Room Directory ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", activeRooms: lobbies.size, publicRooms: publicRoomsMap.size });
  });

  // Public Rooms API
  app.get("/api/rooms", (req, res) => {
    const now = Date.now();
    const active = Array.from(publicRoomsMap.values())
      .filter(r => r.status === 'waiting' && now - r.updated_at < 45 * 1000)
      .sort((a, b) => b.updated_at - a.updated_at);
    res.json({ rooms: active });
  });

  app.post("/api/rooms/publish", (req, res) => {
    const { id, room_name, host_char, status, connection_mode } = req.body;
    if (!id) {
      res.status(400).json({ error: "Missing room id" });
      return;
    }
    const cleanId = String(id).trim().toUpperCase();
    if (status === 'closed') {
      publicRoomsMap.delete(cleanId);
    } else {
      publicRoomsMap.set(cleanId, {
        id: cleanId,
        room_name: room_name || `Room ${cleanId}`,
        host_char: host_char || 'jotaro',
        status: status || 'waiting',
        connection_mode: connection_mode || 'peerjs',
        created_at: new Date().toISOString(),
        updated_at: Date.now(),
      });
    }
    res.json({ success: true, count: publicRoomsMap.size });
  });

  app.post("/api/rooms/unpublish", (req, res) => {
    const { id } = req.body;
    if (id) {
      publicRoomsMap.delete(String(id).trim().toUpperCase());
    }
    res.json({ success: true });
  });

  // 1. Host creates a room
  app.post("/api/relay/create", (req, res) => {
    const { hostId, offer, hostCharId } = req.body;
    if (!hostId || !offer) {
      res.status(400).json({ error: "Missing hostId or offer" });
      return;
    }

    // Generate room code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let roomCode = "JJ";
    for (let i = 0; i < 4; i++) {
      roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newLobby: LobbySignal = {
      roomCode,
      hostId,
      hostCharId: hostCharId || 'jotaro',
      hostOffer: offer,
      hostIceCandidates: [],
      clientIceCandidates: [],
      status: 'waiting',
      lastActive: Date.now()
    };

    lobbies.set(roomCode, newLobby);
    res.json({ roomCode });
  });

  // 1b. Get all active rooms waiting for players
  app.get("/api/relay/list", (req, res) => {
    const activeRooms = Array.from(lobbies.values())
      .filter(lobby => lobby.status === 'waiting')
      .map(lobby => ({
        roomCode: lobby.roomCode,
        hostCharId: lobby.hostCharId,
        lastActive: lobby.lastActive
      }));
    res.json({ rooms: activeRooms });
  });

  // 2. Client joins a room
  app.post("/api/relay/join", (req, res) => {
    const { roomCode, clientId } = req.body;
    if (!roomCode || !clientId) {
      res.status(400).json({ error: "Missing roomCode or clientId" });
      return;
    }

    const cleanCode = roomCode.trim().toUpperCase();
    const lobby = lobbies.get(cleanCode);

    if (!lobby) {
      res.status(404).json({ error: "Room tidak ditemukan atau Host offline." });
      return;
    }

    lobby.clientId = clientId;
    lobby.status = 'connected';
    lobby.lastActive = Date.now();

    res.json({
      hostOffer: lobby.hostOffer,
      hostId: lobby.hostId
    });
  });

  // 3. Either party sends signals (SDP answers or ICE Candidates)
  app.post("/api/relay/signal", (req, res) => {
    const { roomCode, senderId, answer, candidate } = req.body;
    if (!roomCode || !senderId) {
      res.status(400).json({ error: "Missing roomCode or senderId" });
      return;
    }

    const cleanCode = roomCode.trim().toUpperCase();
    const lobby = lobbies.get(cleanCode);

    if (!lobby) {
      res.status(404).json({ error: "Room tidak ditemukan." });
      return;
    }

    lobby.lastActive = Date.now();

    if (senderId === lobby.hostId) {
      if (candidate) {
        lobby.hostIceCandidates.push(candidate);
      }
    } else if (senderId === lobby.clientId) {
      if (answer) {
        lobby.clientAnswer = answer;
      }
      if (candidate) {
        lobby.clientIceCandidates.push(candidate);
      }
    }

    res.json({ success: true });
  });

  // 4. Poll signals
  app.get("/api/relay/poll", (req, res) => {
    const { roomCode, myId } = req.query;
    if (!roomCode || !myId) {
      res.status(400).json({ error: "Missing roomCode or myId" });
      return;
    }

    const cleanCode = (roomCode as string).trim().toUpperCase();
    const lobby = lobbies.get(cleanCode);

    if (!lobby) {
      res.status(404).json({ error: "Room tidak ditemukan." });
      return;
    }

    lobby.lastActive = Date.now();

    if (myId === lobby.hostId) {
      // Host wants client's answer and candidates
      res.json({
        clientAnswer: lobby.clientAnswer,
        clientIceCandidates: lobby.clientIceCandidates
      });
    } else if (myId === lobby.clientId) {
      // Client wants host's candidates
      res.json({
        hostIceCandidates: lobby.hostIceCandidates
      });
    } else {
      res.status(403).json({ error: "Unauthorized access to room signal" });
    }
  });

  // --- End of Signaling Routes ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
