import { mockSearchResult, SearchResult } from "@/data/mockProducts";

// Set this in .env.local (see .env.local.example). Falls back to localhost
// for local development against the FastAPI backend in ../backend.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetches comparison results for a query from the FastAPI backend.
 * If the backend is unreachable (e.g. during early frontend-only
 * development, or if the free Render instance is asleep/cold-starting),
 * this falls back to bundled mock data so the UI never breaks.
 */
export async function fetchSearchResults(
  query: string
): Promise<{ data: SearchResult; isLive: boolean }> {
  try {
    const res = await fetch(
      `${API_URL}/api/search?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    const data: SearchResult = await res.json();
    return { data, isLive: true };
  } catch (err) {
    console.warn("Falling back to mock data — backend unreachable:", err);
    return {
      data: { ...mockSearchResult, query },
      isLive: false,
    };
  }
}
