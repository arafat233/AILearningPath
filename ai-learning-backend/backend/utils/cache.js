// Redis-backed cache — shared across all instances, survives restarts.
// Falls back to Redis in-memory fallback (redisClient.js) when Redis is unavailable.
import { sessionGet, sessionSet } from "./redisClient.js";

const PREFIX = "cache:";

// TTL is in milliseconds (matches old API) — converted to seconds for Redis.
export const getCached = async (key) => {
  return sessionGet(`${PREFIX}${key}`);
};

export const setCache = async (key, value, ttlMs = 60 * 60 * 1000) => {
  const ttlSeconds = Math.max(1, Math.round(ttlMs / 1000));
  await sessionSet(`${PREFIX}${key}`, value, ttlSeconds);
};
