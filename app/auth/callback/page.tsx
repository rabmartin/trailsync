"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Mirror the same storage adapter as the main app so both share the same
// localStorage keys (including the PKCE code-verifier).
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

    // Also handle implicit-flow tokens delivered via URL hash fragment
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
          // Disable auto-detection so we control the exchange ourselves and
          // avoid the "code already used" race condition.
          detectSessionInUrl: false,
        },
      }
    );

    async function handleCallback() {
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) console.error("[auth/callback] exchangeCodeForSession error:", error.message);
        } else if (accessToken) {
          // Implicit-flow: tokens arrived in the hash fragment
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? "",
          });
          if (error) console.error("[auth/callback] setSession error:", error.message);
        } else {
          console.warn("[auth/callback] No code or access_token in URL — redirecting anyway");
        }
      } catch (e) {
        console.error("[auth/callback] Unexpected error:", e);
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
