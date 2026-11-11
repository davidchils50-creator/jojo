/**
 * Utility to dynamically resolve the signaling server URL.
 * When hosted on GitHub Pages or other static hosting, it will automatically point to the live Cloud Run backend.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.endsWith('.run.app'))
  ) {
    return cleanPath;
  }
  
  // Static host fallback (e.g. github.io) -> Point to our production Cloud Run container
  return `https://ais-pre-gyzbaxdv2zhkcu6tdiyqs5-431386380240.asia-southeast1.run.app${cleanPath}`;
}

/**
 * Safely fetches and parses JSON, preventing "Unexpected token <" crash on HTML redirect pages
 */
export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  
  // Detect if the server returned HTML (redirect/auth page) instead of JSON
  if (text.trim().startsWith('<') || text.includes('<!DOCTYPE') || text.includes('<html')) {
    throw new Error(
      "Server Relay diproteksi oleh Google AI Studio. Silakan gunakan tab 'PeerJS P2P' di kanan atas untuk bermain mabar 100% lancar di GitHub Pages!"
    );
  }
  
  if (!res.ok) {
    try {
      const errData = JSON.parse(text);
      throw new Error(errData.error || `HTTP ${res.status}`);
    } catch {
      throw new Error(`Koneksi gagal (HTTP ${res.status}). Silakan gunakan 'PeerJS P2P'.`);
    }
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      "Format respon server tidak valid. Silakan gunakan 'PeerJS P2P' untuk mabar di GitHub Pages."
    );
  }
}

