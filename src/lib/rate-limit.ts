// Sliding-window in-memory rate limiter.
// Per-instance on Vercel serverless — stops casual and automated abuse.
// For distributed enforcement across many instances, swap the store for Upstash Redis.

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

// Periodically purge stale keys to prevent unbounded memory growth.
// Runs at most once per 10 minutes per module instance.
let lastCleanup = 0;
function maybeCleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 10 * 60 * 1000) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, entry] of store.entries()) {
    if (entry.timestamps.every(t => t < cutoff)) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSecs: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  maybeCleanup(windowMs);
  const now = Date.now();
  const cutoff = now - windowMs;
  const entry = store.get(key) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter(t => t > cutoff);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const retryAfterSecs = Math.ceil((oldest + windowMs - now) / 1000);
    store.set(key, entry);
    return { allowed: false, remaining: 0, retryAfterSecs };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true, remaining: limit - entry.timestamps.length, retryAfterSecs: 0 };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
