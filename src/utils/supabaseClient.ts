import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for JoJo Stickman Game
// Players can also configure their own Supabase project in the Multiplayer Settings
export const DEFAULT_SUPABASE_URL = 'https://gyzbaxdv2zhkcu6tdiyq.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5emJheGR2Mnpoa2N1NnRkaXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDAwMDAsImV4cCI6MjA1NTAwMDAwMH0.placeholder';

const SUPABASE_URL_KEY = 'jojo_supabase_url';
const SUPABASE_ANON_KEY = 'jojo_supabase_anon_key';

export function getStoredSupabaseConfig(): { url: string; key: string } {
  let url = (typeof window !== 'undefined' && localStorage.getItem(SUPABASE_URL_KEY)) || (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
  let key = (typeof window !== 'undefined' && localStorage.getItem(SUPABASE_ANON_KEY)) || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, key };
}

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const { url, key } = getStoredSupabaseConfig();
  return { url, anonKey: key };
}

export function saveStoredSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_ANON_KEY, key.trim());
    supabaseInstance = null; // reset cached instance
  }
}

export function setCustomSupabaseConfig(url: string, key: string) {
  saveStoredSupabaseConfig(url, key);
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const { url, key } = getStoredSupabaseConfig();
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (e) {
      console.warn("Error creating Supabase client:", e);
      // Fallback instance
      supabaseInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      });
    }
  }
  return supabaseInstance;
}

export interface SupabaseRoomRow {
  id: string;
  room_name: string;
  host_offer: string;
  joiner_answer?: string | null;
  host_char?: string;
  joiner_char?: string | null;
  status: 'waiting' | 'connected' | 'closed';
  connection_mode?: 'peerjs' | 'supabase';
  created_at?: string;
}
