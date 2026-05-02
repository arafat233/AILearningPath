// Redis singleton using ioredis.
// If REDIS_URL is not set or the connection fails, all operations
// fall back to a local Map so development works without Redis running.
// In production always set REDIS_URL — the fallback is not safe for
// multi-instance deployments.
import Redis from "ioredis";
import logger from "./logger.js";

let client = null;
let usingFallback = false;

// In-memory fallback (dev only)
const fallbackStore = new Map();

function createClient() {
  if (!process.env.REDIS_URL) {
    usingFallback = true;
    return null;
  }

  const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  redis.on("connect",   () => logger.info("Redis connected"));
  redis.on("error",     (err) => logger.error("Redis error", { err: err.message }));
  redis.on("reconnecting", () => logger.warn("Redis reconnecting"));

  return redis;
}

export async function connectRedis() {
  client = createClient();
  if (!client) {
    logger.warn("Redis disabled — using in-memory session fallback");
    return;
  }
  try {
    await client.connect();
  } catch (err) {
    logger.error("Redis connection failed — falling back to in-memory", { err: err.message });
    client = null;
    usingFallback = true;
  }
}

// ── Session helpers used by practiceController + examController ───

export async function sessionSet(key, value, ttlSeconds = 7200) {
  const serialised = JSON.stringify(value);
  if (client) {
    await client.set(key, serialised, "EX", ttlSeconds);
  } else {
    fallbackStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}

export async function sessionGet(key) {
  if (client) {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  }
  const entry = fallbackStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { fallbackStore.delete(key); return null; }
  return entry.value;
}

export async function sessionDel(key) {
  if (client) {
    await client.del(key);
  } else {
    fallbackStore.delete(key);
  }
}

export function isUsingFallback() { return usingFallback || !client; }

export async function pingRedis() {
  if (!client) return false;
  try {
    const pong = await client.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}

// Distributed cron lock — prevents duplicate cron runs in multi-pod deployments.
// Returns true if this pod acquired the lock (should run the cron).
// Returns false if another pod already holds the lock (skip this run).
// When using the in-memory fallback (single process), always returns true.
export async function acquireCronLock(name, ttlSeconds = 3600) {
  if (!client) return true; // single-process dev mode — always run
  const key = `cron_lock:${name}`;
  // SET key value NX EX ttl — atomic acquire, expires automatically
  const result = await client.set(key, "1", "NX", "EX", ttlSeconds);
  return result === "OK"; // null means another pod already holds it
}
