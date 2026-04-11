"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const safariFallbackStorage = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

const storageAdapter = (() => {
  if (typeof window === "undefined") return safariFallbackStorage;
  try {
    localStorage.setItem("_ts_test", "1");
    localStorage.removeItem("_ts_test");
    return localStorage;
  } catch {
    return safariFallbackStorage;
  }
})();

function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const hashParams = new URLSearchParams(hash.slice(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    const supabase = createClient(
      "https://mferkdgzpaaxixqlanzm.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
      {
        auth: {
          storage: storageAdapter,
          flowType: "pkce",
          detectSessionInUrl: false,
        },
      }
    );

    async function handleCallback() {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else if (accessToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? "",
        });
      }
      window.location.href = "/";
    }

    handleCallback();
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
