// Service Worker — PWA offline support + push notifications
// v2: stale-while-revalidate for static assets,
//     network-first + cache fallback for key API GETs,
//     shell fallback for navigation.

const CACHE_VERSION  = "v2";
const STATIC_CACHE   = `stellar-static-${CACHE_VERSION}`;
const API_CACHE      = `stellar-api-${CACHE_VERSION}`;
const ALL_CACHES     = new Set([STATIC_CACHE, API_CACHE]);

// API paths whose GET responses are worth caching for offline use.
// Session-based routes (practice, exam, auth) are intentionally excluded.
const CACHEABLE_API_PREFIXES = [
  "/api/topics",
  "/api/lessons",
  "/api/v1/ncert",
  "/api/v1/curriculum",
  "/api/badges",
  "/api/analysis",
  "/api/revision",
  "/api/planner",
  "/api/user/me",
];

const isCacheableApi = (pathname) =>
  CACHEABLE_API_PREFIXES.some((p) => pathname.startsWith(p));

const isStaticAsset = (url) =>
  url.origin === self.location.origin && !url.pathname.startsWith("/api/");

// ── Install: pre-cache app shell ─────────────────────────────────────
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(STATIC_CACHE).then((c) =>
      c.addAll(["/", "/index.html"]).catch(() => {})
    )
  );
});

// ── Activate: delete stale caches ────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !ALL_CACHES.has(k)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return; // never intercept writes

  let url;
  try { url = new URL(request.url); } catch { return; }
  if (!url.protocol.startsWith("http")) return; // skip chrome-extension etc.

  // 1. Navigation — network-first; fall back to cached shell so the SPA loads
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches.open(STATIC_CACHE)
              .then((c) => c.put(request, res.clone()))
              .catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match("/index.html").then(
            (cached) => cached || new Response("Offline", { status: 503 })
          )
        )
    );
    return;
  }

  // 2. Cacheable API GETs — network-first, serve stale cache on failure
  if (url.origin === self.location.origin && isCacheableApi(url.pathname)) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches.open(API_CACHE)
              .then((c) => c.put(request, res.clone()))
              .catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              new Response(
                JSON.stringify({ error: "Offline", offline: true }),
                { status: 503, headers: { "Content-Type": "application/json" } }
              )
          )
        )
    );
    return;
  }

  // 3. Same-origin static assets (JS/CSS/images) — stale-while-revalidate:
  //    serve the cached copy immediately; refresh in the background.
  if (isStaticAsset(url)) {
    e.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone()).catch(() => {});
            return res;
          });
          return cached || networkFetch; // instant if cached, fresh if not
        })
      )
    );
  }
});

// ── Push: show notification ───────────────────────────────────────────
self.addEventListener("push", (e) => {
  let data = { title: "Stellar", body: "You have a new update!", icon: "/icon-192.png" };
  try { data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    data.icon || "/icon-192.png",
      badge:   "/icon-192.png",
      tag:     data.tag || "stellar",
      data:    data.url ? { url: data.url } : {},
      actions: data.action ? [{ action: "open", title: data.action }] : [],
    })
  );
});

// ── Notification click: focus or open app ────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
