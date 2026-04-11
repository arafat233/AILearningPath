// Service Worker — PWA push notifications + offline shell caching
const CACHE_NAME = "ai-learn-v1";
const OFFLINE_URLS = ["/", "/index.html"];

// Install: cache shell
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS).catch(() => {}))
  );
});

// Activate: clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache for navigation
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match("/index.html").then((r) => r || new Response("Offline", { status: 503 }))
      )
    );
  }
});

// Push: show notification
self.addEventListener("push", (e) => {
  let data = { title: "AI Learning", body: "You have a new update!", icon: "/icon-192.png" };
  try { data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    data.icon || "/icon-192.png",
      badge:   "/icon-192.png",
      tag:     data.tag || "ai-learn",
      data:    data.url ? { url: data.url } : {},
      actions: data.action ? [{ action: "open", title: data.action }] : [],
    })
  );
});

// Notification click: open app
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
