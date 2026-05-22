import type { NextConfig } from "next";

// NEXT_BUILD_TARGET=native → static export for Capacitor (produces out/)
// Default (Vercel) → standard Next.js deployment, API routes work as serverless functions
const isNativeBuild = process.env.NEXT_BUILD_TARGET === "native";

const nextConfig: NextConfig = {
  ...(isNativeBuild ? { output: "export" } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
