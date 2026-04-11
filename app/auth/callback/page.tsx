"use client";
import { Suspense, useEffect, useState } from "react";
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

function CallbackHandler({ onError }: { onError: (msg: string) => void }) {
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
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            onError(`Exchange failed: ${error.message}`);
            return;
          }
        } else if (accessToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? "",
          });
          if (error) {
            onError(`Session failed: ${error.message}`);
            return;
          }
        } else {
          onError(`No code or token in URL\n\nFull URL: ${window.location.href}`);
          return;
        }
      } catch (e: unknown) {
        onError(`Unexpected: ${e instanceof Error ? e.message : String(e)}`);
        return;
      }
      window.location.href = "/";
    }

    handleCallback();
  }, []);

  return null;
}

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ background: "#041e3d", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: "0 24px", maxWidth: "360px" }}>
        {error ? (
          <>
            <div style={{ color: "#E85D3A", fontSize: "14px", marginBottom: "12px", fontWeight: 600 }}>Sign-in failed</div>
            <div style={{ color: "#BDD6F4", fontSize: "12px", background: "rgba(232,93,58,0.1)", border: "1px solid rgba(232,93,58,0.3)", borderRadius: "8px", padding: "12px", marginBottom: "16px", wordBreak: "break-word" }}>{error}</div>
            <a href="/" style={{ color: "#5A98E3", fontSize: "13px" }}>← Back to sign in</a>
          </>
        ) : (
          <>
            <div style={{ width: "40px", height: "40px", border: "3px solid rgba(90,152,227,0.2)", borderTop: "3px solid #5A98E3", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ color: "#BDD6F4", fontSize: "14px" }}>Signing in…</div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Suspense fallback={null}>
        <CallbackHandler onError={setError} />
      </Suspense>
    </div>
  );
}
