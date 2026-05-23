import type { NextConfig } from "next";

// Always use static export — the app is a client-side SPA served from Vercel's
// edge CDN and bundled into Capacitor for native iOS/Android.
// API routes are not compatible with static export; any server-side needs are
// handled via external services (Supabase, Open-Meteo, etc.).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
