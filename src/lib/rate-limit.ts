// Distributed rate limiter using Upstash Redis (HTTP-based, safe for Vercel serverless).
// Falls back to a module-level in-memory Map when UPSTASH_REDIS_REST_URL is not set,
// so local dev and preview deployments work without any extra config.

import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSecs: number;
}

// ── Upstash path ──────────────────────────────────────────────────────────────

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const r = redis!;
  const windowSecs = Math.ceil(windowMs / 1000);
  const redisKey = `rl:${key}`;

  // INCR is atomic — safe under concurrent Vercel instances
  const count = await r.incr(redisKey);
  if (count === 1) {
    // First request in this window — set TTL
    await r.expire(redisKey, windowSecs);
  }

  if (count > limit) {
    const ttl = await r.ttl(redisKey);
    return { allowed: false, remaining: 0, retryAfterSecs: Math.max(ttl, 1) };
  }

  return { allowed: true, remaining: limit - count, retryAfterSecs: 0 };
}

// ── In-memory fallback ────────────────────────────────────────────────────────

interface Entry { timestamps: number[] }
const store = new Map<string, Entry>();
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

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  maybeCleanup(windowMs);
  const now = Date.now();
  const cutoff = now - windowMs;
  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter(t => t > cutoff);

  if (entry.timestamps.length >= limit) {
    const retryAfterSecs = Math.ceil((entry.timestamps[0] + windowMs - now) / 1000);
    store.set(key, entry);
    return { allowed: false, remaining: 0, retryAfterSecs };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true, remaining: limit - entry.timestamps.length, retryAfterSecs: 0 };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (redis) return redisRateLimit(key, limit, windowMs);
  return memoryRateLimit(key, limit, windowMs);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
