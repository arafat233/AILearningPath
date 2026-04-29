import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

const POLL_INTERVAL_MS  = 500;
const POLL_MAX_ATTEMPTS = 90;  // 90 × 500 ms = 45 seconds

function getStoredRedirect() {
  try {
    return sessionStorage.getItem("postGoogleRedirect");
  } catch {
    return null;
  }
}

function normalizeRedirect(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function authedRedirectTarget(requestedRedirect, needsOnboarding) {
  if (needsOnboarding) return "/onboarding";
  return ["/login", "/register", "/start", "/clerk-callback"].includes(requestedRedirect)
    ? "/"
    : requestedRedirect;
}

export default function ClerkCallback() {
  const { handleRedirectCallback } = useClerk();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const [searchParams]      = useSearchParams();
  const stage               = searchParams.get("stage");

  // Prefer sessionStorage — Clerk can double-encode query params in redirectUrlComplete,
  // causing %2Fonboarding (doesn't start with "/") to silently fall back to "/".
  const rawToParam = searchParams.get("to");
  const decodedToParam = rawToParam
    ? (() => { try { return decodeURIComponent(rawToParam); } catch { return rawToParam; } })()
    : null;
  const redirectTo = normalizeRedirect(getStoredRedirect() || decodedToParam);

  const [error, setError]         = useState("");
  const [callbackDone, setCallbackDone] = useState(stage === "exchange");
  const didHandle   = useRef(false);
  const didExchange = useRef(false);

  // Helper: exchange Clerk session token for a backend JWT and redirect.
  const doExchange = async (label) => {
    if (didExchange.current) { console.log(`[CB:${label}] skip — already exchanged`); return false; }
    console.log(`[CB:${label}] calling getToken()...`);
    const token = await getToken().catch((e) => { console.log(`[CB:${label}] getToken threw`, e); return null; });
    console.log(`[CB:${label}] getToken result:`, token ? "GOT TOKEN" : "NULL");
    if (!token) return false;
    didExchange.current = true;
    try {
      const { data } = await clerkLogin(token);
      setAuth(null, data.data.user);
      const finalRedirect = authedRedirectTarget(redirectTo, data.data.needsOnboarding);
      try { sessionStorage.removeItem("postGoogleRedirect"); } catch { /* ignore */ }
      console.log(`[CB:${label}] exchange OK, navigating to`, finalRedirect);
      window.location.href = finalRedirect;
      return true;
    } catch (err) {
      console.error(`[CB:${label}] backend exchange error:`, err);
      didExchange.current = false;
      setError(err.response?.data?.error || err.message || "Sign-in failed");
      return false;
    }
  };

  useEffect(() => {
    if (stage === "exchange") return;
    if (didHandle.current) return;
    didHandle.current = true;
    console.log("[CB] Step1: calling handleRedirectCallback()...");

    handleRedirectCallback()
      .then(async () => {
        console.log("[CB] Step1: handleRedirectCallback resolved. isSignedIn=", isSignedIn, "isLoaded=", isLoaded);
        await doExchange("then");
      })
      .catch((err) => {
        console.error("[CB] Step1: handleRedirectCallback ERROR:", err);
        setError(err.errors?.[0]?.longMessage || err.message || "Google sign-in failed");
      })
      .finally(() => { console.log("[CB] Step1: finally → callbackDone=true"); setCallbackDone(true); });
  }, [handleRedirectCallback, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Log every render so we can see state transitions
  console.log("[CB] render — stage:", stage, "callbackDone:", callbackDone, "isLoaded:", isLoaded, "isSignedIn:", isSignedIn, "error:", error);

  useEffect(() => {
    if (!callbackDone || !isLoaded || didExchange.current || error) return;
    let cancelled = false;
    const poll = async () => {
      for (let i = 0; i < POLL_MAX_ATTEMPTS && !cancelled && !didExchange.current; i++) {
        const token = await getToken().catch(() => null);
        console.log(`[CB] poll attempt ${i + 1}/${POLL_MAX_ATTEMPTS}: ${token ? "GOT TOKEN" : "null"}`);
        if (token && !cancelled && !didExchange.current) {
          didExchange.current = true;
          try {
            const { data } = await clerkLogin(token);
            setAuth(null, data.data.user);
            const dest = authedRedirectTarget(redirectTo, data.data.needsOnboarding);
            try { sessionStorage.removeItem("postGoogleRedirect"); } catch { /* ignore */ }
            console.log("[CB] poll exchange OK, navigating to", dest);
            window.location.href = dest;
          } catch (err) {
            didExchange.current = false;
            setError(err.response?.data?.error || err.message || "Sign-in failed");
          }
          return;
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
      if (!cancelled && !didExchange.current) {
        console.log("[CB] poll exhausted — session never became available");
        setError("Google sign-in did not complete. Please try again.");
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [callbackDone, isLoaded, error]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <p className="text-apple-red mb-4 text-[14px]">{error}</p>
          <a href="/login" className="btn-primary px-6 py-2 text-[14px]">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--label2)] text-[14px]">Finishing sign-in…</p>
        {/* DEBUG — remove after diagnosis */}
        <p className="text-[10px] text-apple-gray mt-3 font-mono leading-relaxed">
          stage: {stage ?? "none"}<br/>
          isLoaded: {String(isLoaded)}<br/>
          isSignedIn: {String(isSignedIn)}<br/>
          callbackDone: {String(callbackDone)}<br/>
          exchanged: {String(didExchange.current)}
        </p>
      </div>
    </div>
  );
}
