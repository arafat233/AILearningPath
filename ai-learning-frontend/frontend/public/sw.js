// Cache name is bumped on every deploy so service workers auto-invalidate stale assets.
// Format: stellar-v{N}-{YYYY-MM-DD}
// Bumped to fix: chrome-extension:// caching errors + network fetch failures
const CACHE = "stellar-v3-2026-05-30";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE)
            .map((k) =>
              caches.delete(k).catch((err) => {
                console.error(`Failed to delete cache ${k}:`, err);
              })
            )
        )
      )
      .then(() => self.clients.claim())
      .catch((err) => console.error("Service worker activation error:", err))
  );
});

// Network-first for all GET non-API requests.
// On network success → update the cache for offline fallback.
// Safely handles caching errors and non-http schemes.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).pathname.startsWith("/api/")) return;

  // Skip non-http(s) schemes (chrome-extension://, data:, blob:, etc.)
  if (!e.request.url.startsWith("http")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Only cache successful responses (200-299)
        if (res.ok && res.status >= 200 && res.status < 300) {
          try {
            const clone = res.clone();
            caches.open(CACHE)
              .then((c) => {
                c.put(e.request, clone).catch((err) => {
                  // Silently fail if cache.put fails (quota, corrupt cache, etc)
                  console.debug("Cache write failed (non-critical):", err.message);
                });
              })
              .catch((err) => {
                // Silently fail if caches.open fails
                console.debug("Cache open failed (non-critical):", err.message);
              });
          } catch (err) {
            // Silently fail on clone/cache errors
            console.debug("Cache operation failed (non-critical):", err.message);
          }
        }
        return res;
      })
      .catch((err) => {
        // Network failed, try to return cached version
        return caches.match(e.request)
          .catch(() => {
            // Cache miss - return null to let browser handle 404
            console.debug("Cache miss and network failed:", e.request.url);
            return null;
          });
      })
  );
});
