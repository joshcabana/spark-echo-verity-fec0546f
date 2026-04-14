/**
 * In-memory sliding-window rate limiter for edge-function isolates.
 * Complements the database-backed rate_limits table by catching bursts
 * before they hit Postgres.
 */

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

/**
 * Returns `true` if the request is allowed, `false` if rate-limited.
 *
 * @param key      Unique key (e.g. `find-match:${userId}`)
 * @param max      Max requests allowed in the window
 * @param windowMs Window size in milliseconds (default 60 000 = 1 min)
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number = 60_000,
): boolean {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Evict timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= max) {
    return false; // rate-limited
  }

  entry.timestamps.push(now);
  return true;
}

/**
 * Helper that returns a 429 Response when rate-limited, or null if allowed.
 * Usage:
 *   const limited = rateLimitOrResponse(key, max, windowMs, corsHeaders);
 *   if (limited) return limited;
 */
export function rateLimitOrResponse(
  key: string,
  max: number,
  windowMs: number,
  corsHeaders: Record<string, string>,
): Response | null {
  if (!rateLimit(key, max, windowMs)) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  return null;
}
