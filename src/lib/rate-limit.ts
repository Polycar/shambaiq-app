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

// Accept every common Upstash / Vercel-KV naming convention. Vercel's Upstash
// marketplace integration provisions UPSTASH_REDIS_REST_*; the legacy KV
// integration provisions KV_REST_API_*. We resolve whichever pair is present
// (including prefixed ones e.g. UPSTASH_REDIS_CYAN_REST_URL) and remember 
// WHICH names matched so /api/health/ratelimit can report it.
const URL_ENV_VARS = ["UPSTASH_REDIS_REST_URL", "KV_REST_API_URL"] as const;
const TOKEN_ENV_VARS = ["UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN"] as const;

interface EnvPair {
  urlName: string;
  urlValue: string;
  tokenName: string;
  tokenValue: string;
}

function resolveEnv(): EnvPair | null {
  const keys = Object.keys(process.env);
  const configs = [
    { url: "_REST_URL", token: "_REST_TOKEN" },
    { url: "_REST_API_URL", token: "_REST_API_TOKEN" },
    { url: "_URL", token: "_TOKEN" }
  ];

  for (const config of configs) {
    const urlKey = keys.find(k => 
      (k.endsWith(config.url) || k === config.url.substring(1)) && 
      /UPSTASH|KV|REDIS/i.test(k) && 
      process.env[k]?.trim()
    );
    
    if (urlKey) {
      const urlValue = process.env[urlKey]!.trim();
      const prefix = urlKey.endsWith(config.url) 
        ? urlKey.slice(0, urlKey.length - config.url.length) 
        : "";
      
      let tokenKey = prefix + config.token;
      let tokenValue = process.env[tokenKey]?.trim();
      
      if (!tokenValue) {
        const tokenSuffixes = ["_REST_TOKEN", "_REST_API_TOKEN", "_TOKEN"];
        for (const suffix of tokenSuffixes) {
          const testKey = prefix + suffix;
          const val = process.env[testKey]?.trim();
          if (val) {
            tokenKey = testKey;
            tokenValue = val;
            break;
          }
        }
      }
      
      if (tokenValue) {
        return {
          urlName: urlKey,
          urlValue,
          tokenName: tokenKey,
          tokenValue
        };
      }
    }
  }
  return null;
}

const resolvedPair = resolveEnv();
const resolvedUrl = resolvedPair ? { name: resolvedPair.urlName, value: resolvedPair.urlValue } : null;
const resolvedToken = resolvedPair ? { name: resolvedPair.tokenName, value: resolvedPair.tokenValue } : null;

let redis: Redis | null = null;
let redisInitError: string | null = null;
if (resolvedUrl && resolvedToken) {
  try {
    redis = new Redis({ url: resolvedUrl.value, token: resolvedToken.value });
  } catch (err) {
    redisInitError = err instanceof Error ? err.message : String(err);
    console.error(
      "[rate-limit] Failed to construct Upstash Redis client:",
      redisInitError
    );
  }
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] No Upstash credentials found (checked " +
      [...URL_ENV_VARS, ...TOKEN_ENV_VARS].join(", ") +
      " and prefixes). Rate limiting falls back to in-memory and is INEFFECTIVE on serverless."
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
  try {
    const { success, remaining, reset } = await limiter.limit(key);
    const retryAfterSecs = success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return { allowed: success, remaining, retryAfterSecs };
  } catch (err) {
    // Fail OPEN (never 500 a real request over a limiter hiccup), but make the
    // failure loud so a misconfigured Redis can't masquerade as "working".
    console.error(
      "[rate-limit] Upstash limit() failed — falling back to in-memory for this call:",
      err
    );
    return memoryRateLimit(key, limit, windowMs);
  }
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

// ── Diagnostics ───────────────────────────────────────────────────────────────
// Surfaced via GET /api/health/ratelimit so you can see, in the *deployed*
// environment, exactly why Upstash is or isn't active. Reports env-var NAMES
// only (never values/secrets) plus a live PING + probe against Redis.
export interface RateLimitDiagnostics {
  activeBackend: "upstash-redis" | "in-memory";
  healthy: boolean;
  matchedUrlVar: string | null;
  matchedTokenVar: string | null;
  redisInitError: string | null;
  // All env var names (no values) that look Redis-related, so you can spot a
  // name mismatch — e.g. credentials present under a name the code doesn't read.
  redisRelatedEnvVarsPresent: string[];
  nodeEnv: string | null;
  ping?: string;
  liveProbe?: RateLimitResult;
  error?: string;
  hint?: string;
}

export async function getRateLimitDiagnostics(): Promise<RateLimitDiagnostics> {
  const redisRelatedEnvVarsPresent = Object.keys(process.env)
    .filter((k) => /UPSTASH|KV_REST|REDIS/i.test(k))
    .sort();

  const diag: RateLimitDiagnostics = {
    activeBackend: redis ? "upstash-redis" : "in-memory",
    healthy: false,
    matchedUrlVar: resolvedUrl?.name ?? null,
    matchedTokenVar: resolvedToken?.name ?? null,
    redisInitError,
    redisRelatedEnvVarsPresent,
    nodeEnv: process.env.NODE_ENV ?? null,
  };

  if (redis) {
    try {
      diag.ping = await redis.ping();
      diag.liveProbe = await rateLimit(`__diag__:${Date.now()}`, 2, 60_000);
      diag.healthy = true;
    } catch (err) {
      diag.error = err instanceof Error ? err.message : String(err);
      diag.hint =
        "Redis client built but the connection failed — the URL/token are " +
        "probably wrong, swapped, or from a deleted database.";
    }
  } else {
    diag.hint =
      "Redis client is null — no credentials detected. Confirm the env var names " +
      "above include one of [" +
      [...URL_ENV_VARS, ...TOKEN_ENV_VARS].join(", ") +
      "], that they're set for THIS environment (Production vs Preview vs " +
      "Development), and that you redeployed AFTER adding them (env changes need " +
      "a fresh deploy).";
  }

  return diag;
}
