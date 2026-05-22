// TrailSync Service Worker v7
// Cache-first for map tiles + pre-cache on route download

const CACHE_NAME = "trailsync-v7";
const TILE_CACHE = "trailsync-tiles-v7";

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

// ── Tile math ─────────────────────────────────────────────
function lon2tile(lon, z) { return Math.floor((lon + 180) / 360 * Math.pow(2, z)); }
function lat2tile(lat, z) {
  return Math.floor(
    (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z)
  );
}
function tilesForBbox([minLng, minLat, maxLng, maxLat], zoom) {
  const x0 = lon2tile(minLng, zoom), x1 = lon2tile(maxLng, zoom);
  const y0 = lat2tile(maxLat, zoom), y1 = lat2tile(minLat, zoom); // lat is inverted in tile coords
  const tiles = [];
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      tiles.push([x, y, zoom]);
  return tiles;
}

// ── Pre-cache tiles for a route (triggered by download button) ──
// event.data: { type, bbox, token, styles: [{ url, minZoom, maxZoom }] }
self.addEventListener("message", async (event) => {
  if (event.data?.type !== "PRECACHE_TILES") return;
  const { bbox, token, styles } = event.data;
  const client = event.source;

  // Build full tile URL list across all requested styles + zoom ranges
  const allTiles = [];
  for (const { url: styleUrl, minZoom = 8, maxZoom = 13 } of (styles || [])) {
    for (let z = minZoom; z <= maxZoom; z++) {
      for (const [x, y] of tilesForBbox(bbox, z)) {
        allTiles.push(`${styleUrl}/${z}/${x}/${y}?access_token=${token}`);
      }
    }
  }

  const cache = await caches.open(TILE_CACHE);
  const BATCH = 8; // parallel fetches — polite to Mapbox rate limits

  for (let i = 0; i < allTiles.length; i += BATCH) {
    await Promise.allSettled(
      allTiles.slice(i, i + BATCH).map(async (url) => {
        const hit = await cache.match(url);
        if (hit) return; // already cached — skip
        try {
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res);
        } catch { /* offline during pre-cache — skip gracefully */ }
      })
    );
    if (client) {
      client.postMessage({
        type: "TILE_PROGRESS",
        done: Math.min(i + BATCH, allTiles.length),
        total: allTiles.length,
      });
    }
  }

  if (client) client.postMessage({ type: "TILE_PRECACHE_DONE" });
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
