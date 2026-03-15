/* Verity Service Worker — App Shell Cache + Push Notifications */

const CACHE_VERSION = "verity-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// ---------- Install: pre-cache app shell ----------
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ---------- Activate: purge old caches ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ---------- Fetch: cache-first for static, network-first for API ----------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API / Supabase calls
  if (
    url.pathname.startsWith("/rest/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/functions/") ||
    url.hostname.includes("supabase")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) return response;
          return caches.match(request).then((cached) => cached || response);
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for same-origin static assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
  }
});

self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "Verity", body: "You have a new notification" };

  const options = {
    body: data.body,
    icon: data.icon || "/favicon.png",
    badge: data.badge || "/favicon.png",
    data: { url: data.url || "/" },
    vibrate: [100, 50, 100],
    tag: data.tag || "verity-notification",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Open new window
        return self.clients.openWindow(url);
      })
  );
});
