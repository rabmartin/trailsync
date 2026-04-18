// SAIS (Scottish Avalanche Information Service) proxy
// Fetches the main sais.gov.uk page server-side (no CORS issues) and parses
// the current hazard level for each of the 6 forecast areas.
// Cached for 1 hour via ISR — SAIS only updates once per day.

export const revalidate = 3600;

const SAIS_AREAS = [
  { name: "Northern Cairngorms", lat: 57.12, lng: -3.68, slug: "northern-cairngorms" },
  { name: "Southern Cairngorms", lat: 56.88, lng: -3.42, slug: "southern-cairngorms" },
  { name: "Creag Meagaidh",      lat: 56.96, lng: -4.52, slug: "creag-meagaidh" },
  { name: "Glencoe",             lat: 56.68, lng: -4.87, slug: "glencoe" },
  { name: "Lochaber",            lat: 56.80, lng: -5.10, slug: "lochaber" },
  { name: "Torridon",            lat: 57.55, lng: -5.50, slug: "torridon" },
];

// Ordered highest → lowest so "Very High" is matched before "High"
const LEVELS = ["very high", "high", "considerable", "moderate", "low"];
const LEVEL_LABELS = {
  "very high":  "Very High",
  "high":       "High",
  "considerable": "Considerable",
  "moderate":   "Moderate",
  "low":        "Low",
};

function findHazardLevel(snippet) {
  const lower = snippet.toLowerCase();
  // Explicit "no forecast" text → no active hazard
  if (
    lower.includes("no hazard category") ||
    lower.includes("no forecast") ||
    lower.includes("finished issuing") ||
    lower.includes("season has ended")
  ) return null;

  for (const level of LEVELS) {
    // Use word-boundary-equivalent: space or start/end around the phrase
    const escaped = level.replace(" ", "\\s+");
    if (new RegExp(`(^|[\\s>])${escaped}([\\s<,.]|$)`).test(lower)) {
      return LEVEL_LABELS[level];
    }
  }
  return null;
}

export async function GET() {
  try {
    // One request to the main SAIS page gets all 6 areas' statuses
    const res = await fetch("https://www.sais.gov.uk/", {
      headers: {
        "User-Agent": "TrailSync/1.0 (+https://trailsync.app)",
        Accept: "text/html",
      },
      // Next.js fetch cache tag for on-demand revalidation if needed
      next: { revalidate: 3600, tags: ["sais"] },
    });

    if (!res.ok) throw new Error(`SAIS fetch failed: ${res.status}`);
    const html = await res.text();

    const areas = SAIS_AREAS.map((area) => {
      let level = null;

      // Try to find the area name in the page and inspect surrounding text
      const idx = html.indexOf(area.name);
      if (idx !== -1) {
        // Look at up to 1000 chars after the area name for hazard level text
        const snippet = html.slice(idx, idx + 1000);
        level = findHazardLevel(snippet);
      }

      return {
        name: area.name,
        lat: area.lat,
        lng: area.lng,
        level,                                          // null = no active forecast
        url: `https://www.sais.gov.uk/${area.slug}/`,
      };
    });

    return Response.json({ areas, fetched: Date.now() });
  } catch (err) {
    console.error("SAIS proxy error:", err.message);
    // Return empty gracefully — app hides the widget when areas = []
    return Response.json({ areas: [], fetched: Date.now(), error: true });
  }
}
