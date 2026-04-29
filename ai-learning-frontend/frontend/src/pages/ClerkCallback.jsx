import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

// 15 seconds to wait for isSignedIn before giving up
const SIGN_IN_TIMEOUT_MS = 15_000;

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
  const doExchange = async () => {
    if (didExchange.current) return false;
    const token = await getToken().catch(() => null);
    if (!token) return false;
    didExchange.current = true;
    try {
      const { data } = await clerkLogin(token);
      setAuth(null, data.data.user);
      const finalRedirect = authedRedirectTarget(redirectTo, data.data.needsOnboarding);
      try { sessionStorage.removeItem("postGoogleRedirect"); } catch { /* ignore */ }
      window.location.href = finalRedirect;
      return true;
    } catch (err) {
      console.error("[ClerkCallback] exchange error:", err);
      didExchange.current = false; // allow fallback to retry
      setError(err.response?.data?.error || err.message || "Sign-in failed");
      return false;
    }
  };

  // Step 1 (no-stage page only): complete OAuth redirect, then immediately attempt the
  // backend exchange while the Clerk session is still live in THIS page's memory.
  // All previous approaches tried to exchange on the stage=exchange page (after Clerk
  // navigates away), where the session may not yet be readable — this is the root cause
  // of the "click twice" bug. Exchanging in the .then() of handleRedirectCallback()
  // runs as a microtask before any browser navigation can take effect.
  useEffect(() => {
    if (stage === "exchange") return;
    if (didHandle.current) return;
    didHandle.current = true;

    handleRedirectCallback()
      .then(async () => {
        await doExchange();        // best-effort: session is fresh in memory here
      })
      .catch((err) => {
        console.error("[ClerkCallback] handleRedirectCallback error:", err);
        setError(err.errors?.[0]?.longMessage || err.message || "Google sign-in failed");
      })
      .finally(() => setCallbackDone(true));
  }, [handleRedirectCallback, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2 fallback: if Clerk navigated to stage=exchange before the .then() exchange
  // could complete, wait for isSignedIn to become true on this page and retry.
  useEffect(() => {
    if (!callbackDone || !isLoaded || !isSignedIn || didExchange.current || error) return;
    doExchange();
  }, [callbackDone, isLoaded, isSignedIn, error]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timeout fallback: if isSignedIn never becomes true, show error after 15 seconds.
  useEffect(() => {
    if (!callbackDone || !isLoaded || didExchange.current || error) return;
    const t = setTimeout(() => {
      if (!didExchange.current) {
        setError("Google sign-in did not complete. Please try again.");
      }
    }, SIGN_IN_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [callbackDone, isLoaded, error]);

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
      </div>
    </div>
  );
}
