"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const supabase = createClient(
      "https://mferkdgzpaaxixqlanzm.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
    );
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(() => router.replace("/"))
        .catch(() => router.replace("/"));
    } else {
      router.replace("/");
    }
  }, []);

  return null;
}

export default function AuthCallback() {
  return (
    <div style={{ background: "#041e3d", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(90,152,227,0.2)", borderTop: "3px solid #5A98E3", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: "#BDD6F4", fontSize: "14px" }}>Signing in…</div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
