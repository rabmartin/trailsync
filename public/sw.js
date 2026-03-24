// TrailSync Service Worker
// Caches app shell and static assets for offline use

const CACHE_VERSION = "trailsync-v1";
const TILE_CACHE = "trailsync-tiles-v1";

// App shell — these files are always cached on install
const APP_SHELL = [
  "/",
  "/manifest.json",
];

// ── Install: cache app shell ──
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: clear old caches ──
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION && k !== TILE_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: serve from cache, fall back to network ──
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Map tiles — cache as user browses, serve cached if offline
  const isTile =
    url.hostname.includes("mapbox.com") ||
    url.hostname.includes("api.mapbox.com") ||
    url.pathname.includes("/tiles/");

  if (isTile) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        } catch {
          return cached || new Response("", { status: 503 });
        }
      })
    );
    return;
  }

  // GPX files — cache when fetched
  const isGpx = url.pathname.endsWith(".gpx") || url.hostname.includes("supabase.co");
  if (isGpx) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        } catch {
          return cached || new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }
      })
    );
    return;
  }

  // App shell — network first, fall back to cache
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
