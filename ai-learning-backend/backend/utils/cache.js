// In-memory cache with TTL
const store = new Map();

export const getCached = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { store.delete(key); return null; }
  return entry.value;
};

export const setCache = (key, value, ttlMs = 60 * 60 * 1000) => {
  store.set(key, { value, expires: Date.now() + ttlMs });
};

export const cacheSize = () => store.size;
