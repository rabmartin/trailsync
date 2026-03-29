"use client";
import dynamic from "next/dynamic";

const TrailSync = dynamic(() => import("./trailsync"), { ssr: false });

export default function Page() {
  return <TrailSync />;
}
