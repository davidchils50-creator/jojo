import { getSupabaseClient, SupabaseRoomRow } from './supabaseClient';
import { getApiUrl, safeFetchJson } from './api';

export interface PublicRoomInfo {
  id: string;
  room_name: string;
  host_char: string;
  status: 'waiting' | 'connected' | 'closed';
  connection_mode: 'peerjs' | 'supabase';
  created_at: string;
  updated_at?: number;
}

const PUBLIC_TOPIC = 'jojo_stickman_public_rooms_v3';
const NTFY_PUB_URL = `https://ntfy.sh/${PUBLIC_TOPIC}`;

// In-memory cache & BroadcastChannel for same-device multi-tab fast sync
let memoryRoomsMap = new Map<string, PublicRoomInfo>();

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('jojo_public_rooms_channel_v3');
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'room_update') {
        const room = event.data.room as PublicRoomInfo;
        if (room.status === 'closed') {
          memoryRoomsMap.delete(room.id);
        } else {
          memoryRoomsMap.set(room.id, room);
        }
      }
    };
  }
} catch (e) {
  console.warn("BroadcastChannel not supported or threw error:", e);
}

/**
 * Publish a new or updated room to the global public directory (Server API + ntfy + Supabase + BroadcastChannel)
 */
export async function publishPublicRoom(room: PublicRoomInfo): Promise<void> {
  const roomPayload: PublicRoomInfo = {
    ...room,
    id: room.id.toUpperCase(),
    updated_at: Date.now(),
  };

  memoryRoomsMap.set(roomPayload.id, roomPayload);

  // 1. Same-device / tab broadcast
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'room_update', room: roomPayload });
    } catch (e) {
      // ignore
    }
  }

  // 2. Server API (if full-stack)
  try {
    const apiUrl = getApiUrl('/api/rooms/publish');
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomPayload),
    }).catch(() => {});
  } catch (e) {
    // ignore
  }

  // 3. Global public ntfy relay (works across 2 different phones on cellular or separate WiFi)
  try {
    // Post as structured ntfy message
    fetch(NTFY_PUB_URL, {
      method: 'POST',
      headers: {
        'Title': `Jojo Room ${roomPayload.id}`,
        'Tags': 'game,jojo',
      },
      body: JSON.stringify(roomPayload),
    }).catch(() => {});

    // Secondary JSON formatted post
    fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: PUBLIC_TOPIC,
        message: JSON.stringify(roomPayload),
        title: `Room ${roomPayload.id}`,
      }),
    }).catch(() => {});
  } catch (e) {
    console.warn("Error publishing to ntfy signaling:", e);
  }

  // 4. Supabase fallback database (if configured/reachable)
  try {
    const supabase = getSupabaseClient();
    supabase.from('rooms').upsert({
      id: roomPayload.id,
      room_name: roomPayload.room_name,
      host_char: roomPayload.host_char,
      status: roomPayload.status,
      created_at: roomPayload.created_at,
    }).then(({ error }) => {
      if (error) console.warn("Supabase upsert public room notice:", error.message);
    });
  } catch (e) {
    // ignore
  }
}

/**
 * Remove a public room when host disconnects or room closes
 */
export async function unpublishPublicRoom(roomId: string): Promise<void> {
  if (!roomId) return;
  const cleanId = roomId.trim().toUpperCase();
  const closedRoom: PublicRoomInfo = {
    id: cleanId,
    room_name: '',
    host_char: 'jotaro',
    status: 'closed',
    connection_mode: 'peerjs',
    created_at: new Date().toISOString(),
    updated_at: Date.now(),
  };

  memoryRoomsMap.delete(cleanId);

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'room_update', room: closedRoom });
    } catch (e) {
      // ignore
    }
  }

  try {
    const apiUrl = getApiUrl('/api/rooms/unpublish');
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cleanId }),
    }).catch(() => {});
  } catch (e) {}

  try {
    fetch(NTFY_PUB_URL, {
      method: 'POST',
      body: JSON.stringify(closedRoom),
    }).catch(() => {});
  } catch (e) {}

  try {
    const supabase = getSupabaseClient();
    supabase.from('rooms').delete().eq('id', cleanId).then(() => {});
  } catch (e) {}
}

/**
 * Fetch all active public rooms from Server API + global relay (ntfy) + Supabase + local cache
 */
export async function fetchActivePublicRooms(): Promise<PublicRoomInfo[]> {
  const roomsMap = new Map<string, PublicRoomInfo>();
  const now = Date.now();
  const ROOM_TTL_MS = 45 * 1000; // 45 seconds active TTL for heartbeats

  // 1. Load from local memory cache first
  for (const [id, room] of memoryRoomsMap.entries()) {
    if (room.status === 'waiting' && room.updated_at && (now - room.updated_at < ROOM_TTL_MS)) {
      roomsMap.set(id, room);
    }
  }

  // 2. Fetch from Server API
  try {
    const apiUrl = getApiUrl('/api/rooms');
    const res = await safeFetchJson<{ rooms: PublicRoomInfo[] }>(apiUrl);
    if (res && Array.isArray(res.rooms)) {
      for (const r of res.rooms) {
        if (r && r.id && r.status === 'waiting') {
          roomsMap.set(r.id.toUpperCase(), {
            ...r,
            id: r.id.toUpperCase(),
            updated_at: r.updated_at || Date.now(),
          });
          memoryRoomsMap.set(r.id.toUpperCase(), r);
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // 3. Fetch from global public relay (ntfy)
  try {
    const ntfyRes = await fetch(`${NTFY_PUB_URL}/json?poll=1&since=5m`, { signal: AbortSignal.timeout(3500) });
    if (ntfyRes.ok) {
      const text = await ntfyRes.text();
      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (!line || !line.trim()) continue;
        try {
          const item = JSON.parse(line);
          let roomData: PublicRoomInfo | null = null;

          if (item && item.message) {
            if (typeof item.message === 'string') {
              try {
                roomData = JSON.parse(item.message);
              } catch {
                // Not JSON string
              }
            } else if (typeof item.message === 'object') {
              roomData = item.message;
            }
          }

          if (!roomData && item && item.id && (item.host_char || item.room_name)) {
            roomData = item;
          }

          if (roomData && roomData.id) {
            const cleanId = String(roomData.id).trim().toUpperCase();
            const itemAge = roomData.updated_at ? (now - roomData.updated_at) : 0;

            if (roomData.status === 'closed') {
              roomsMap.delete(cleanId);
              memoryRoomsMap.delete(cleanId);
            } else if (roomData.status === 'waiting' && itemAge < ROOM_TTL_MS) {
              const existing = roomsMap.get(cleanId);
              if (!existing || (roomData.updated_at || 0) >= (existing.updated_at || 0)) {
                const normalized: PublicRoomInfo = {
                  id: cleanId,
                  room_name: roomData.room_name || `Room ${cleanId}`,
                  host_char: roomData.host_char || 'jotaro',
                  status: 'waiting',
                  connection_mode: roomData.connection_mode || 'peerjs',
                  created_at: roomData.created_at || new Date().toISOString(),
                  updated_at: roomData.updated_at || now,
                };
                roomsMap.set(cleanId, normalized);
                memoryRoomsMap.set(cleanId, normalized);
              }
            }
          }
        } catch (e) {
          // ignore invalid json line
        }
      }
    }
  } catch (e) {
    console.warn("Global ntfy room poll notice:", e);
  }

  // 4. Fetch from Supabase as secondary source
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data && Array.isArray(data)) {
      for (const row of data as SupabaseRoomRow[]) {
        if (row.id && row.status === 'waiting') {
          const cleanId = String(row.id).trim().toUpperCase();
          if (!roomsMap.has(cleanId)) {
            roomsMap.set(cleanId, {
              id: cleanId,
              room_name: row.room_name || `Room ${cleanId}`,
              host_char: row.host_char || 'jotaro',
              status: 'waiting',
              connection_mode: 'supabase',
              created_at: row.created_at || new Date().toISOString(),
              updated_at: Date.now(),
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn("Supabase public room fetch notice:", e);
  }

  return Array.from(roomsMap.values()).sort((a, b) => {
    return (b.updated_at || 0) - (a.updated_at || 0);
  });
}
