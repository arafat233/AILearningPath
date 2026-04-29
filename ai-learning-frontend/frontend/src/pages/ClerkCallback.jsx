import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

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
  const { isLoaded, getToken } = useAuth();
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

  // Step 1: complete the OAuth redirect (no-stage page only)
  useEffect(() => {
    if (stage === "exchange") return;
    if (didHandle.current) return;
    didHandle.current = true;
    handleRedirectCallback()
      .catch((err) => {
        console.error("[ClerkCallback] handleRedirectCallback error:", err);
        setError(err.errors?.[0]?.longMessage || err.message || "Google sign-in failed");
      })
      .finally(() => setCallbackDone(true));
  }, [handleRedirectCallback, stage]);

  // Step 2: exchange Clerk session for backend JWT
  //
  // We poll getToken() instead of waiting for isSignedIn React state, because on the
  // first-ever sign-in Clerk needs a cold network round-trip to verify the session —
  // this can take longer than the old 5-second hard timeout, causing a false failure.
  // getToken() resolves as soon as the session is usable, before isSignedIn updates.
  useEffect(() => {
    if (!callbackDone || !isLoaded || didExchange.current || error) return;

    let cancelled = false;
    let attempts  = 0;
    const MAX_ATTEMPTS = 30; // 30 × 500 ms = 15 seconds max

    const tryExchange = async () => {
      if (cancelled || didExchange.current || error) return;

      const token = await getToken().catch(() => null);

      if (token) {
        if (didExchange.current || cancelled) return;
        didExchange.current = true;
        try {
          const { data } = await clerkLogin(token);
          setAuth(null, data.data.user);
          const finalRedirect = authedRedirectTarget(redirectTo, data.data.needsOnboarding);
          try { sessionStorage.removeItem("postGoogleRedirect"); } catch { /* ignore */ }
          window.location.href = finalRedirect;
        } catch (err) {
          console.error("[ClerkCallback] backend exchange error:", err);
          if (!cancelled) setError(err.response?.data?.error || err.message || "Sign-in failed");
        }
        return;
      }

      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        if (!cancelled && !didExchange.current) {
          setError("Google sign-in did not complete. Please try again.");
        }
        return;
      }

      setTimeout(tryExchange, 500);
    };

    tryExchange();
    return () => { cancelled = true; };
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
