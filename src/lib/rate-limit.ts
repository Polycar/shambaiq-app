// Distributed rate limiter using Upstash Redis + @upstash/ratelimit.
// @upstash/ratelimit uses atomic Lua scripts — no INCR/expire race conditions.
//
// Env vars accepted (both naming conventions):
//   UPSTASH_REDIS_REST_URL  or  KV_REST_API_URL
//   UPSTASH_REDIS_REST_TOKEN  or  KV_REST_API_TOKEN
//
// Falls back to an ephemeral in-memory limiter for local dev only.
// In-memory is NOT suitable for Vercel production — each cold start resets it.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSecs: number;
}

// Accept both the Upstash-direct and Vercel-integration naming conventions.
const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

let redis: Redis | null = null;
if (redisUrl && redisToken) {
  redis = new Redis({ url: redisUrl, token: redisToken });
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] Neither UPSTASH_REDIS_REST_URL nor KV_REST_API_URL is set. " +
    "Rate limiting is DISABLED in production — set one of these env vars in Vercel."
  );
}

// Cache one Ratelimit instance per window config so we don't create a new one per request.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;
  const key = `${limit}:${windowMs}`;
  if (!limiterCache.has(key)) {
    limiterCache.set(
      key,
      new Ratelimit({
        redis,
        // slidingWindow gives smooth per-second bursting; fixedWindow is simpler.
        limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
        prefix: "rl",
      })
    );
  }
  return limiterCache.get(key)!;
}

async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(limit, windowMs)!;
  const { success, remaining, reset } = await limiter.limit(key);
  const retryAfterSecs = success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { allowed: success, remaining, retryAfterSecs };
}

// ── In-memory fallback (local dev only) ──────────────────────────────────────

interface Entry { timestamps: number[] }
const store = new Map<string, Entry>();

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

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
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
