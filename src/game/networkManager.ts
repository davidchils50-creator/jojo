import PeerJS, { DataConnection, Peer } from 'peerjs';
import { InputState, Fighter, GameMode, BossType, LobbyPlayer, MatchConfig, Projectile, Particle, TimeStopState } from '../types';
import { getApiUrl, safeFetchJson } from '../utils/api';
import { getSupabaseClient, SupabaseRoomRow } from '../utils/supabaseClient';
import { publishPublicRoom, unpublishPublicRoom, fetchActivePublicRooms } from '../utils/publicRoomRegistry';

export type NetworkRole = 'host' | 'client' | 'offline';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Helper to safely retrieve Peer constructor regardless of bundler ESM/CJS interop
const getPeerConstructor = (): any => {
  console.log("getPeerConstructor diagnostics:");
  try {
    if (typeof window !== 'undefined' && typeof (window as any).Peer === 'function') {
      console.log("-> Using window.Peer (CDN loaded)");
      return (window as any).Peer;
    }
  } catch (e) {
    console.warn("Error accessing window.Peer:", e);
  }

  try {
    if (typeof Peer === 'function') {
      console.log("-> Using imported Peer class");
      return Peer;
    }
  } catch (e) {
    console.warn("Error checking Peer:", e);
  }

  try {
    if (typeof PeerJS === 'function') {
      console.log("-> Using PeerJS class default");
      return PeerJS;
    }
  } catch (e) {
    console.warn("Error checking PeerJS:", e);
  }

  try {
    if (PeerJS && typeof (PeerJS as any).Peer === 'function') {
      console.log("-> Using PeerJS.Peer property");
      return (PeerJS as any).Peer;
    }
  } catch (e) {
    console.warn("Error checking PeerJS.Peer:", e);
  }

  try {
    if (PeerJS && typeof (PeerJS as any).default === 'function') {
      console.log("-> Using PeerJS.default property");
      return (PeerJS as any).default;
    }
  } catch (e) {
    console.warn("Error checking PeerJS.default:", e);
  }

  console.log("-> Falling back to raw PeerJS module reference:", PeerJS);
  return PeerJS;
};

export interface GamePacket {
  type: 
    | 'input' 
    | 'state' 
    | 'sync' 
    | 'start_match' 
    | 'rematch' 
    | 'ping'
    | 'pong'
    | 'lobby_state'
    | 'lobby_action'
    | 'multi_state'
    | 'multi_input'
    | 'cutscene_skip_vote';
  sender: 'host' | 'client';
  slotId?: number;
  input?: InputState;
  inputs?: Record<number, InputState>;
  playerState?: Partial<Fighter>;
  aiState?: Partial<Fighter>;
  teammateState?: Partial<Fighter> | null;
  projectiles?: Projectile[];
  particles?: Particle[];
  timeStopState?: TimeStopState;
  activeGravityAxis?: 'down' | 'right' | 'up' | 'left';
  screenShake?: number;
  fightersState?: Array<Partial<Fighter>>;
  matchTime?: number;
  isGameOver?: boolean;
  winner?: string | null;
  charId?: string;
  hostCharId?: string;
  clientCharId?: string;
  mapId?: string;
  gameMode?: GameMode;
  bossType?: BossType;
  lobbyPlayers?: LobbyPlayer[];
  matchConfig?: MatchConfig;
  assignedSlot?: number;
  isReady?: boolean;
  skipVoted?: boolean;
  timestamp?: number;
}

class NetworkManager {
  public peer: Peer | null = null;
  // For host: track all active client connections mapped by peer id
  public clientConnections: Map<string, { conn: DataConnection; slotId: number }> = new Map();
  // For client: single connection to host
  public hostConn: DataConnection | null = null;
  public role: NetworkRole = 'offline';
  public status: ConnectionStatus = 'disconnected';
  public roomId: string = '';
  public localSlotId: number = 0; // 0 for host, 1..4 for clients

  // Signaling & WebRTC fields
  public connectionMode: 'supabase' | 'peerjs' = 'peerjs';
  public supabasePC: RTCPeerConnection | null = null;
  public supabaseDC: RTCDataChannel | null = null;
  public supabaseChannel: any = null;
  public activeSupabaseRoomId: string | null = null;
  public relayPC: RTCPeerConnection | null = null;
  public relayDC: RTCDataChannel | null = null;
  private relayPollInterval: any = null;

  // Active Lobby Configuration
  public lobbyPlayers: LobbyPlayer[] = [
    { slotId: 0, isHost: true, name: 'Player 1 (Host)', charId: 'jotaro', isReady: true, team: 'teamA', isConnected: true },
    { slotId: 1, isHost: false, name: 'Player 2', charId: 'dio', isReady: false, team: 'teamB', isConnected: false },
    { slotId: 2, isHost: false, name: 'Player 3', charId: 'crazy_diamond', isReady: false, team: 'teamA', isConnected: false },
    { slotId: 3, isHost: false, name: 'Player 4', charId: 'king_crimson', isReady: false, team: 'teamB', isConnected: false },
    { slotId: 4, isHost: false, name: 'Player 5', charId: 'silver_chariot', isReady: false, team: 'teamA', isConnected: false },
  ];
  public selectedMode: GameMode = 'arcade';
  public selectedBossType: BossType = 'boss_dio';
  public selectedMapId: string = 'cairo_bridge';

  public remoteCharId: string = 'dio';
  public hostCharId: string = 'jotaro';
  public clientCharId: string = 'dio';
  public mapId: string = 'cairo_bridge';

  public onStatusChange?: (status: ConnectionStatus, message?: string) => void;
  public onDataReceived?: (packet: GamePacket) => void;
  public onRemoteConnected?: (slotId?: number) => void;
  public onDisconnected?: (slotId?: number) => void;
  public onLobbyUpdated?: (players: LobbyPlayer[], mode: GameMode, mapId: string, bossType: BossType) => void;
  public pingMs: number = 0;
  public onPingUpdated?: (ping: number) => void;
  private packetListeners: Array<(packet: GamePacket) => void> = [];
  private heartbeatInterval: any = null;

  private startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval = setInterval(() => {
      if (this.status === 'connected') {
        try {
          this.send({
            type: 'ping',
            sender: this.role === 'host' ? 'host' : 'client',
            timestamp: performance.now()
          });
        } catch (e) {
          // ignore
        }
      }
    }, 2000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public addPacketListener(fn: (packet: GamePacket) => void): () => void {
    this.packetListeners.push(fn);
    return () => {
      this.removePacketListener(fn);
    };
  }

  public removePacketListener(fn: (packet: GamePacket) => void) {
    this.packetListeners = this.packetListeners.filter(l => l !== fn);
  }

  public emitPacket(packet: GamePacket) {
    // Handle Ping & Pong automatically for realtime latency measurement
    if (packet.type === 'ping' && packet.timestamp) {
      this.send({
        type: 'pong',
        sender: this.role === 'host' ? 'host' : 'client',
        timestamp: packet.timestamp
      });
      return;
    }

    if (packet.type === 'pong' && packet.timestamp) {
      const rtt = Math.max(1, Math.round(performance.now() - packet.timestamp));
      this.pingMs = rtt;
      if (this.onPingUpdated) {
        this.onPingUpdated(rtt);
      }
      return;
    }

    if (this.onDataReceived) {
      try {
        this.onDataReceived(packet);
      } catch (e) {
        console.error('Error in onDataReceived:', e);
      }
    }
    for (let i = 0; i < this.packetListeners.length; i++) {
      try {
        this.packetListeners[i](packet);
      } catch (e) {
        console.error('Error in packet listener:', e);
      }
    }
  }

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (this.role === 'host' && this.activeSupabaseRoomId) {
          try {
            const supabase = getSupabaseClient();
            supabase.from('rooms').delete().eq('id', this.activeSupabaseRoomId).then(() => {});
          } catch (e) {
            // ignore
          }
        }
      });
    }
  }

  private createPeerOptions() {
    let isSecure = true;
    try {
      if (typeof window !== 'undefined' && window.location && window.location.protocol) {
        isSecure = window.location.protocol === 'https:';
      }
    } catch (e) {
      console.warn("Could not check window.location.protocol in sandbox environment, defaulting to secure: true.", e);
    }
    return {
      host: '0.peerjs.com',
      port: 443,
      path: '/',
      key: 'peerjs',
      secure: isSecure,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { urls: 'stun:stun.cloudflare.com:3478' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
        iceCandidatePoolSize: 10,
      },
      debug: 1,
    };
  }

  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'JJ';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private waitForIceGathering(pc: RTCPeerConnection, maxMs: number = 1500): Promise<void> {
    return new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
        return;
      }
      const timer = setTimeout(() => {
        resolve();
      }, maxMs);
      const checkState = () => {
        if (pc.iceGatheringState === 'complete') {
          clearTimeout(timer);
          pc.removeEventListener('icegatheringstatechange', checkState);
          resolve();
        }
      };
      pc.addEventListener('icegatheringstatechange', checkState);
    });
  }

  private publicRoomHeartbeatInterval: ReturnType<typeof setInterval> | null = null;

  public startPublicRoomHeartbeat(roomName: string, hostCharId: string) {
    this.stopPublicRoomHeartbeat();
    const sendHeartbeat = () => {
      if (this.role === 'host' && this.roomId && this.status !== 'disconnected' && this.status !== 'error') {
        publishPublicRoom({
          id: this.roomId,
          room_name: roomName,
          host_char: hostCharId,
          status: 'waiting',
          connection_mode: this.connectionMode,
          created_at: new Date().toISOString(),
        });
      }
    };
    sendHeartbeat();
    this.publicRoomHeartbeatInterval = setInterval(sendHeartbeat, 2500);
  }

  public stopPublicRoomHeartbeat() {
    if (this.publicRoomHeartbeatInterval) {
      clearInterval(this.publicRoomHeartbeatInterval);
      this.publicRoomHeartbeatInterval = null;
    }
  }

  public async fetchPublicSupabaseRooms(): Promise<SupabaseRoomRow[]> {
    try {
      const activeRooms = await fetchActivePublicRooms();
      return activeRooms.map(r => ({
        id: r.id,
        room_name: r.room_name || `Room ${r.id}`,
        host_offer: '',
        host_char: r.host_char || 'jotaro',
        status: r.status,
        connection_mode: r.connection_mode || 'peerjs',
        created_at: r.created_at,
      }));
    } catch (e) {
      console.warn("Public rooms fetch error:", e);
      return [];
    }
  }

  public initHostSupabase(customRoomId?: string, hostCharId: string = 'jotaro', roomName?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.close();
      this.role = 'host';
      this.localSlotId = 0;
      this.roomId = customRoomId || this.generateRoomCode();
      this.activeSupabaseRoomId = this.roomId;
      this.updateStatus('connecting', `Membuat Room Supabase ${this.roomId}...`);

      this.lobbyPlayers = [
        { slotId: 0, isHost: true, name: 'Player 1 (Host)', charId: hostCharId, isReady: true, team: 'teamA', isConnected: true },
        { slotId: 1, isHost: false, name: 'Player 2', charId: 'dio', isReady: false, team: 'teamB', isConnected: false },
        { slotId: 2, isHost: false, name: 'Player 3', charId: 'crazy_diamond', isReady: false, team: 'teamA', isConnected: false },
        { slotId: 3, isHost: false, name: 'Player 4', charId: 'king_crimson', isReady: false, team: 'teamB', isConnected: false },
        { slotId: 4, isHost: false, name: 'Player 5', charId: 'silver_chariot', isReady: false, team: 'teamA', isConnected: false },
      ];

      const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' },
      ];

      try {
        const pc = new RTCPeerConnection({ iceServers });
        this.supabasePC = pc;

        // Create pre-negotiated DataChannel
        const dc = pc.createDataChannel("game-channel", { negotiated: true, id: 1 });
        this.supabaseDC = dc;
        this.setupDataChannel(dc, 1);

        // Auto clean up database row once connected
        pc.oniceconnectionstatechange = () => {
          console.log(`Host ICE Connection State: ${pc.iceConnectionState}`);
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
            this.cleanupSupabaseRoomRow(this.roomId);
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await this.waitForIceGathering(pc, 1200);

        const supabase = getSupabaseClient();
        const finalOfferStr = JSON.stringify(pc.localDescription || offer);
        const finalRoomName = roomName?.trim() || `Room ${this.roomId}`;

        const { error: insertErr } = await supabase.from('rooms').upsert({
          id: this.roomId,
          room_name: finalRoomName,
          host_offer: finalOfferStr,
          joiner_answer: null,
          host_char: hostCharId,
          status: 'waiting',
          created_at: new Date().toISOString(),
        });

        if (insertErr) {
          console.warn("Supabase upsert room warning:", insertErr.message);
        }

        this.updateStatus('connecting', `Room ${this.roomId} Aktif di Supabase! Menunggu Joiner...`);
        this.startPublicRoomHeartbeat(finalRoomName, hostCharId);
        resolve(this.roomId);

        // Listen for Joiner Answer via Supabase Realtime Channel
        let answerApplied = false;
        const channel = supabase
          .channel(`room_${this.roomId}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${this.roomId}` },
            async (payload: any) => {
              const row = payload?.new as SupabaseRoomRow;
              if (row && row.joiner_answer && !answerApplied) {
                answerApplied = true;
                try {
                  const answerDesc = JSON.parse(row.joiner_answer);
                  await pc.setRemoteDescription(new RTCSessionDescription(answerDesc));
                  console.log("Host setRemoteDescription from joiner_answer via Supabase!");
                } catch (err) {
                  console.error("Error setting Joiner answer on Host:", err);
                }
              }
            }
          )
          .subscribe();

        this.supabaseChannel = channel;

      } catch (e: any) {
        this.updateStatus('error', e.message || 'Gagal membuat room via Supabase.');
        reject(e);
      }
    });
  }

  public initClientSupabase(roomId: string, clientCharId: string = 'dio'): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.close();
      this.role = 'client';
      this.roomId = roomId.trim().toUpperCase();
      this.activeSupabaseRoomId = this.roomId;
      this.updateStatus('connecting', `Mencari Room ${this.roomId} di Supabase...`);

      const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' },
      ];

      let isSettled = false;
      const timeoutTimer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          this.close();
          const errMsg = `Koneksi Timeout! Room '${this.roomId}' tidak merespons atau sudah penuh.`;
          this.updateStatus('error', errMsg);
          reject(new Error(errMsg));
        }
      }, 15000);

      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', this.roomId)
          .single();

        if (error || !data) {
          throw new Error(`Room '${this.roomId}' tidak ditemukan di Supabase.`);
        }

        if (data.status !== 'waiting' && data.status !== 'connected') {
          throw new Error(`Room '${this.roomId}' sudah tidak aktif.`);
        }

        if (!data.host_offer) {
          throw new Error(`Room '${this.roomId}' belum memiliki host_offer.`);
        }

        const hostOffer = JSON.parse(data.host_offer);
        const pc = new RTCPeerConnection({ iceServers });
        this.supabasePC = pc;

        // Create matched pre-negotiated DataChannel
        const dc = pc.createDataChannel("game-channel", { negotiated: true, id: 1 });
        this.supabaseDC = dc;
        this.setupDataChannel(dc, 1);

        pc.oniceconnectionstatechange = () => {
          console.log(`Joiner ICE Connection State: ${pc.iceConnectionState}`);
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
            this.cleanupSupabaseRoomRow(this.roomId);
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(hostOffer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await this.waitForIceGathering(pc, 1200);

        const finalAnswerStr = JSON.stringify(pc.localDescription || answer);
        const { error: updateErr } = await supabase
          .from('rooms')
          .update({
            joiner_answer: finalAnswerStr,
            joiner_char: clientCharId,
            status: 'connected',
          })
          .eq('id', this.roomId);

        if (updateErr) {
          console.warn("Supabase update joiner_answer notice:", updateErr.message);
        }

        this.updateStatus('connecting', `Answer terkirim ke Room ${this.roomId}! Menghubungkan P2P...`);
        isSettled = true;
        clearTimeout(timeoutTimer);
        resolve();

      } catch (e: any) {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeoutTimer);
          this.updateStatus('error', e.message || 'Gagal terhubung via Supabase.');
          reject(e);
        }
      }
    });
  }

  private cleanupSupabaseRoomRow(roomId: string) {
    if (!roomId) return;
    try {
      const supabase = getSupabaseClient();
      supabase.from('rooms').delete().eq('id', roomId).then(({ error }) => {
        if (error) console.warn("Notice on deleting room from Supabase:", error.message);
        else console.log(`[Supabase Clean-up] Room ${roomId} row deleted from database to save quota.`);
      });
    } catch (e) {
      // ignore
    }
  }

  private setupDataChannel(dc: RTCDataChannel, assignedSlot: number) {
    dc.onopen = () => {
      console.log(`Relay WebRTC DataChannel opened (Slot ${assignedSlot})`);
      this.updateStatus('connected', this.role === 'host' ? `Pemain terhubung via Server Relay! (2/5)` : `Terhubung ke Lobby via Server Relay!`);

      if (this.role === 'host') {
        this.lobbyPlayers[assignedSlot].isConnected = true;
        this.lobbyPlayers[assignedSlot].name = `Player ${assignedSlot + 1}`;

        dc.send(JSON.stringify({
          type: 'lobby_state',
          sender: 'host',
          assignedSlot: assignedSlot,
          lobbyPlayers: this.lobbyPlayers,
          gameMode: this.selectedMode,
          mapId: this.selectedMapId,
          bossType: this.selectedBossType,
        }));
        this.broadcastLobbyState();
      } else {
        this.send({
          type: 'sync',
          sender: 'client',
          charId: this.clientCharId,
          slotId: this.localSlotId,
        });
      }

      if (this.onRemoteConnected) this.onRemoteConnected(assignedSlot);
    };

    dc.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data) as GamePacket;
        if (!packet) return;

        if (packet.type === 'lobby_state') {
          if (packet.assignedSlot !== undefined) {
            this.localSlotId = packet.assignedSlot;
          }
          if (packet.lobbyPlayers) {
            this.lobbyPlayers = packet.lobbyPlayers;
          }
          if (packet.gameMode) this.selectedMode = packet.gameMode;
          if (packet.mapId) this.selectedMapId = packet.mapId;
          if (packet.bossType) this.selectedBossType = packet.bossType;

          if (this.onLobbyUpdated) {
            this.onLobbyUpdated(this.lobbyPlayers, this.selectedMode, this.selectedMapId, this.selectedBossType);
          }
        }

        if (packet.type === 'lobby_action') {
          if (packet.slotId !== undefined && this.lobbyPlayers[packet.slotId]) {
            if (packet.charId) this.lobbyPlayers[packet.slotId].charId = packet.charId;
            if (packet.sender === 'client') {
              if (packet.charId) this.lobbyPlayers[packet.slotId].charId = packet.charId;
              if (packet.gameMode) this.lobbyPlayers[packet.slotId].team = packet.gameMode as unknown as 'teamA' | 'teamB';
              if (packet.isReady !== undefined) this.lobbyPlayers[packet.slotId].isReady = packet.isReady;
            }
            if (this.role === 'host') {
              this.broadcastLobbyState();
            }
          }
        }

        if (packet.type === 'sync' && packet.charId) {
          if (this.role === 'host') {
            this.lobbyPlayers[assignedSlot].charId = packet.charId;
            this.broadcastLobbyState();
          } else {
            this.remoteCharId = packet.charId;
          }
        }

        this.emitPacket(packet);
      } catch (e) {
        console.error("Error parsing RTC message:", e);
      }
    };

    dc.onclose = () => {
      console.log(`Relay WebRTC DataChannel closed`);
      if (this.role === 'host') {
        this.lobbyPlayers[assignedSlot].isConnected = false;
        this.lobbyPlayers[assignedSlot].isReady = false;
        this.updateStatus('connected', `Pemain ${assignedSlot + 1} meninggalkan room.`);
        this.broadcastLobbyState();
      } else {
        this.updateStatus('disconnected', 'Terputus dari Room Lobby.');
        this.close();
      }
      if (this.onDisconnected) this.onDisconnected(assignedSlot);
    };
  }

  public initHost(customRoomId?: string, hostCharId: string = 'jotaro', roomName?: string, retryCount: number = 0): Promise<string> {
    if (this.connectionMode === 'supabase') {
      return this.initHostSupabase(customRoomId, hostCharId, roomName);
    }
    return new Promise((resolve, reject) => {
      this.close();
      this.role = 'host';
      this.localSlotId = 0;
      this.roomId = customRoomId || this.generateRoomCode();
      this.updateStatus('connecting', `Membuat Room ${this.roomId}...`);

      // Initialize Lobby Slots
      this.lobbyPlayers = [
        { slotId: 0, isHost: true, name: 'Player 1 (Host)', charId: hostCharId, isReady: true, team: 'teamA', isConnected: true },
        { slotId: 1, isHost: false, name: 'Player 2', charId: 'dio', isReady: false, team: 'teamB', isConnected: false },
        { slotId: 2, isHost: false, name: 'Player 3', charId: 'crazy_diamond', isReady: false, team: 'teamA', isConnected: false },
        { slotId: 3, isHost: false, name: 'Player 4', charId: 'king_crimson', isReady: false, team: 'teamB', isConnected: false },
        { slotId: 4, isHost: false, name: 'Player 5', charId: 'silver_chariot', isReady: false, team: 'teamA', isConnected: false },
      ];

      try {
        const Peer = getPeerConstructor();
        if (!Peer || typeof Peer !== 'function') {
          throw new Error('PeerJS WebRTC library failed to initialize.');
        }
        const peerId = this.roomId.toLowerCase();
        this.peer = new Peer(peerId, this.createPeerOptions());

        this.peer.on('open', (id) => {
          this.roomId = id.toUpperCase();
          this.updateStatus('connecting', `Room ${this.roomId} Aktif! Menunggu pemain...`);
          const name = roomName?.trim() || `Room ${this.roomId}`;
          this.startPublicRoomHeartbeat(name, hostCharId);
          resolve(this.roomId);
        });

        this.peer.on('connection', (connection) => {
          this.handleIncomingClientConnection(connection);
        });

        this.peer.on('error', (err: any) => {
          console.error('PeerJS Host Error:', err);
          const errType = err && typeof err === 'object' ? err.type : null;
          const errMsg = err && typeof err === 'object' ? (err.message || String(err)) : String(err || 'Unknown PeerJS error');
          
          if (errType === 'unavailable-id' && retryCount < 3 && !customRoomId) {
            console.log(`Room ID ${this.roomId} sudah dipakai, mencoba membuat kode baru...`);
            this.close();
            resolve(this.initHost(undefined, hostCharId, undefined, retryCount + 1));
            return;
          }
          this.updateStatus('error', errMsg || 'Gagal membuat room P2P');
          reject(new Error(errMsg || 'Gagal membuat room. Silakan coba lagi.'));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private handleIncomingClientConnection(connection: DataConnection) {
    // Find next available slot (1 to 4)
    let assignedSlot = -1;
    for (let i = 1; i <= 4; i++) {
      if (!this.lobbyPlayers[i].isConnected) {
        assignedSlot = i;
        break;
      }
    }

    if (assignedSlot === -1) {
      console.warn('Room is full (max 5 players). Rejecting connection.');
      try {
        connection.send({ type: 'sync', sender: 'host', charId: 'ROOM_FULL' });
        setTimeout(() => connection.close(), 500);
      } catch (e) {
        // ignore
      }
      return;
    }

    // Assign slot to client
    this.clientConnections.set(connection.peer, { conn: connection, slotId: assignedSlot });
    this.lobbyPlayers[assignedSlot].isConnected = true;
    this.lobbyPlayers[assignedSlot].peerId = connection.peer;
    this.lobbyPlayers[assignedSlot].name = `Player ${assignedSlot + 1}`;

    connection.on('open', () => {
      this.updateStatus('connected', `Player ${assignedSlot + 1} connected! (${this.getConnectedCount()}/5)`);
      if (this.onRemoteConnected) this.onRemoteConnected(assignedSlot);

      // Send initial lobby sync & assigned slot
      connection.send({
        type: 'lobby_state',
        sender: 'host',
        assignedSlot: assignedSlot,
        lobbyPlayers: this.lobbyPlayers,
        gameMode: this.selectedMode,
        mapId: this.selectedMapId,
        bossType: this.selectedBossType,
      });

      this.broadcastLobbyState();
    });

    connection.on('data', (data: unknown) => {
      const packet = data as GamePacket;
      if (!packet) return;

      if (packet.type === 'lobby_action') {
        if (packet.slotId !== undefined && this.lobbyPlayers[packet.slotId]) {
          if (packet.charId) this.lobbyPlayers[packet.slotId].charId = packet.charId;
          if (packet.input !== undefined) {
            // ready or team toggle payload
          }
          if (packet.sender === 'client') {
            if (packet.charId) this.lobbyPlayers[packet.slotId].charId = packet.charId;
            if (packet.gameMode) this.lobbyPlayers[packet.slotId].team = packet.gameMode as unknown as 'teamA' | 'teamB';
            if (packet.isReady !== undefined) this.lobbyPlayers[packet.slotId].isReady = packet.isReady;
          }
          this.broadcastLobbyState();
        }
      }

      if (packet.type === 'sync' && packet.charId) {
        this.lobbyPlayers[assignedSlot].charId = packet.charId;
        this.broadcastLobbyState();
      }

      this.emitPacket(packet);
    });

    connection.on('close', () => {
      this.clientConnections.delete(connection.peer);
      this.lobbyPlayers[assignedSlot].isConnected = false;
      this.lobbyPlayers[assignedSlot].isReady = false;
      this.updateStatus('connected', `Player ${assignedSlot + 1} left. (${this.getConnectedCount()}/5)`);
      if (this.onDisconnected) this.onDisconnected(assignedSlot);
      this.broadcastLobbyState();
    });

    connection.on('error', (err) => {
      console.error(`Client ${assignedSlot} connection error:`, err);
    });
  }

  public async initClient(roomId: string, clientCharId: string = 'dio'): Promise<void> {
    if (this.connectionMode === 'supabase') {
      try {
        await this.initClientSupabase(roomId, clientCharId);
        return;
      } catch (e) {
        console.warn("Koneksi Supabase gagal/timeout, mencoba fallback otomatis via PeerJS P2P...", e);
        this.connectionMode = 'peerjs';
        return this.initClient(roomId, clientCharId);
      }
    }
    return new Promise((resolve, reject) => {
      this.close();
      this.role = 'client';
      this.roomId = roomId.trim().toUpperCase();
      this.updateStatus('connecting', `Menghubungkan ke Room ${this.roomId}...`);

      let isSettled = false;
      const cleanTargetId = this.roomId.toLowerCase();

      const timeoutTimer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          this.close();
          const errMsg = `Koneksi Timeout! Room '${this.roomId}' tidak ditemukan atau Host sedang offline/penuh.`;
          this.updateStatus('error', errMsg);
          reject(new Error(errMsg));
        }
      }, 12000);

      try {
        const Peer = getPeerConstructor();
        if (!Peer || typeof Peer !== 'function') {
          throw new Error('PeerJS WebRTC library failed to initialize.');
        }
        this.peer = new Peer(this.createPeerOptions());

        this.peer.on('open', () => {
          if (!this.peer || isSettled) return;

          try {
            this.hostConn = this.peer.connect(cleanTargetId, { reliable: true });

            if (!this.hostConn) {
              if (!isSettled) {
                isSettled = true;
                clearTimeout(timeoutTimer);
                reject(new Error('Gagal menginisiasi koneksi WebRTC ke host.'));
              }
              return;
            }

            this.hostConn.on('open', () => {
              if (isSettled) return;
              isSettled = true;
              clearTimeout(timeoutTimer);
              this.updateStatus('connected', `Terhubung ke Lobby Room ${this.roomId}!`);
              resolve();
              if (this.onRemoteConnected) this.onRemoteConnected(this.localSlotId);

              // Announce character
              this.send({
                type: 'sync',
                sender: 'client',
                charId: clientCharId,
                slotId: this.localSlotId,
              });
            });

            this.hostConn.on('data', (data: unknown) => {
              const packet = data as GamePacket;
              if (!packet) return;

              if (packet.type === 'lobby_state') {
                if (packet.assignedSlot !== undefined) {
                  this.localSlotId = packet.assignedSlot;
                }
                if (packet.lobbyPlayers) {
                  this.lobbyPlayers = packet.lobbyPlayers;
                }
                if (packet.gameMode) this.selectedMode = packet.gameMode;
                if (packet.mapId) this.selectedMapId = packet.mapId;
                if (packet.bossType) this.selectedBossType = packet.bossType;

                if (this.onLobbyUpdated) {
                  this.onLobbyUpdated(this.lobbyPlayers, this.selectedMode, this.selectedMapId, this.selectedBossType);
                }
              }

              if (packet.type === 'sync') {
                if (packet.charId) this.remoteCharId = packet.charId;
                if (packet.mapId) this.mapId = packet.mapId;
              }

              this.emitPacket(packet);
            });

            this.hostConn.on('close', () => {
              this.updateStatus('disconnected', 'Terputus dari Room Lobby.');
              if (this.onDisconnected) this.onDisconnected();
              this.close();
            });

            this.hostConn.on('error', (err) => {
              console.error('Host connection error:', err);
              if (!isSettled) {
                isSettled = true;
                clearTimeout(timeoutTimer);
                reject(new Error(`Gagal terhubung ke host room: ${err.message || 'Error WebRTC'}`));
              } else {
                this.updateStatus('error', 'Koneksi ke host terputus.');
              }
            });

          } catch (e: unknown) {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeoutTimer);
              reject(e as Error);
            }
          }
        });

        this.peer.on('error', (err: any) => {
          console.error('PeerJS Client Error:', err);
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timeoutTimer);
            const errType = err && typeof err === 'object' ? err.type : null;
            const errMsg = err && typeof err === 'object' ? (err.message || String(err)) : String(err || 'Unknown PeerJS error');
            let friendlyMsg = errMsg || 'Error koneksi PeerJS';
            if (errType === 'peer-unavailable') {
              friendlyMsg = `Kode Room '${this.roomId}' tidak ditemukan. Pastikan Host sudah membuka Room Lobby.`;
            }
            this.updateStatus('error', friendlyMsg);
            reject(new Error(friendlyMsg));
          }
        });

      } catch (e) {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeoutTimer);
          reject(e as Error);
        }
      }
    });
  }

  public getConnectedCount(): number {
    return this.lobbyPlayers.filter(p => p.isConnected).length;
  }

  public updateHostLobby(mode: GameMode, mapId: string, bossType: BossType) {
    this.selectedMode = mode;
    this.selectedMapId = mapId;
    this.selectedBossType = bossType;
    this.broadcastLobbyState();
  }

  public updateSlotCharacter(slotId: number, charId: string) {
    if (this.lobbyPlayers[slotId]) {
      this.lobbyPlayers[slotId].charId = charId;
      if (this.role === 'host') {
        this.broadcastLobbyState();
      } else if (this.role === 'client') {
        this.send({
          type: 'lobby_action',
          sender: 'client',
          slotId: this.localSlotId,
          charId: charId,
        });
      }
    }
  }

  public toggleSlotTeam(slotId: number) {
    if (this.lobbyPlayers[slotId]) {
      const nextTeam = this.lobbyPlayers[slotId].team === 'teamA' ? 'teamB' : 'teamA';
      this.lobbyPlayers[slotId].team = nextTeam;
      if (this.role === 'host') {
        this.broadcastLobbyState();
      } else {
        this.send({
          type: 'lobby_action',
          sender: 'client',
          slotId: this.localSlotId,
          gameMode: nextTeam as unknown as GameMode,
        });
      }
    }
  }

  public toggleSlotReady(slotId: number) {
    if (this.lobbyPlayers[slotId]) {
      this.lobbyPlayers[slotId].isReady = !this.lobbyPlayers[slotId].isReady;
      if (this.role === 'host') {
        this.broadcastLobbyState();
      } else {
        this.send({
          type: 'lobby_action',
          sender: 'client',
          slotId: this.localSlotId,
          charId: this.lobbyPlayers[slotId].charId,
          isReady: this.lobbyPlayers[slotId].isReady,
        });
      }
    }
  }

  public broadcastLobbyState() {
    if (this.role !== 'host') return;
    const packet: GamePacket = {
      type: 'lobby_state',
      sender: 'host',
      lobbyPlayers: this.lobbyPlayers,
      gameMode: this.selectedMode,
      mapId: this.selectedMapId,
      bossType: this.selectedBossType,
    };
    this.broadcast(packet);
    if (this.onLobbyUpdated) {
      this.onLobbyUpdated(this.lobbyPlayers, this.selectedMode, this.selectedMapId, this.selectedBossType);
    }
  }

  public broadcast(packet: GamePacket) {
    if (this.connectionMode === 'supabase') {
      const dc = this.supabaseDC || this.relayDC;
      if (this.role === 'host' && dc && dc.readyState === 'open') {
        try {
          dc.send(JSON.stringify(packet));
        } catch (e) {
          console.error('Supabase/WebRTC broadcast error:', e);
        }
      }
      return;
    }
    if (this.role === 'host') {
      this.clientConnections.forEach(({ conn }) => {
        if (conn && conn.open) {
          try {
            conn.send(packet);
          } catch (e) {
            console.error('Broadcast error:', e);
          }
        }
      });
    }
  }

  public send(packet: GamePacket) {
    if (this.connectionMode === 'supabase') {
      if (this.role === 'host') {
        this.broadcast(packet);
      } else if (this.role === 'client') {
        const dc = this.supabaseDC || this.relayDC;
        if (dc && dc.readyState === 'open') {
          try {
            dc.send(JSON.stringify(packet));
          } catch (e) {
            console.error('WebRTC send error:', e);
          }
        }
      }
      return;
    }
    if (this.role === 'host') {
      this.broadcast(packet);
    } else if (this.role === 'client' && this.hostConn && this.hostConn.open) {
      try {
        this.hostConn.send(packet);
      } catch (e) {
        console.error('Failed to send packet to host:', e);
      }
    }
  }

  public updateStatus(status: ConnectionStatus, message?: string) {
    this.status = status;
    if (status === 'connected') {
      this.startHeartbeat();
    } else if (status === 'disconnected' || status === 'error') {
      this.stopHeartbeat();
    }
    if (this.onStatusChange) {
      this.onStatusChange(status, message);
    }
  }

  public close() {
    this.stopHeartbeat();
    this.stopPublicRoomHeartbeat();
    if (this.supabaseChannel) {
      try {
        const supabase = getSupabaseClient();
        supabase.removeChannel(this.supabaseChannel);
      } catch (e) {}
      this.supabaseChannel = null;
    }
    if (this.role === 'host' && this.roomId) {
      unpublishPublicRoom(this.roomId);
    }
    if (this.role === 'host' && this.activeSupabaseRoomId) {
      this.cleanupSupabaseRoomRow(this.activeSupabaseRoomId);
      this.activeSupabaseRoomId = null;
    }
    if (this.supabaseDC) {
      try {
        this.supabaseDC.close();
      } catch (e) {}
      this.supabaseDC = null;
    }
    if (this.supabasePC) {
      try {
        this.supabasePC.close();
      } catch (e) {}
      this.supabasePC = null;
    }
    if (this.relayPollInterval) {
      clearInterval(this.relayPollInterval);
      this.relayPollInterval = null;
    }
    if (this.relayDC) {
      try {
        this.relayDC.close();
      } catch (e) {}
      this.relayDC = null;
    }
    if (this.relayPC) {
      try {
        this.relayPC.close();
      } catch (e) {}
      this.relayPC = null;
    }
    if (this.clientConnections) {
      this.clientConnections.forEach(({ conn }) => {
        try {
          conn.close();
        } catch (e) {
          // ignore
        }
      });
      this.clientConnections.clear();
    }
    if (this.hostConn) {
      try {
        this.hostConn.close();
      } catch (e) {
        // ignore
      }
      this.hostConn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {
        // ignore
      }
      this.peer = null;
    }
    this.role = 'offline';
    this.status = 'disconnected';
    this.localSlotId = 0;
  }
}

export const networkManager = new NetworkManager();

