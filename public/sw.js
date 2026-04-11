// TrailSync Service Worker v5
// Network-first for app shell, cache-first for map tiles

const CACHE_NAME = "trailsync-v5";
const TILE_CACHE = "trailsync-tiles-v5";

// Minimal app shell — only static public files
const APP_SHELL = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

// Never cache these — auth, API calls, analytics
const NEVER_CACHE = [
  "supabase.co",
  "supabase.in",
  "googleapis.com",
  "vercel-analytics",
  "vercel-insights",
  "vercel.live",
  "mapbox.com/events",
  "api.mapbox.com/events",
];

const shouldNeverCache = (url) =>
  NEVER_CACHE.some((domain) => url.href.includes(domain));

// ── Install ──────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== TILE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests entirely — never intercept POST/PATCH/DELETE
  if (request.method !== "GET") return;

  // Never cache auth, API, analytics
  if (shouldNeverCache(url)) return;

  // Map tiles — cache as user browses (cache-first)
  const isTile =
    (url.hostname.includes("mapbox.com") ||
      url.hostname.includes("api.mapbox.com")) &&
    !url.pathname.includes("/events");

  if (isTile) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 503 });
        }
      })
    );
    return;
  }

  // GPX files — cache when fetched
  if (url.pathname.endsWith(".gpx")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return cached || new Response("", { status: 503 });
        }
      })
    );
    return;
  }

  // App navigation (same origin, HTML) — network first, cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
});
