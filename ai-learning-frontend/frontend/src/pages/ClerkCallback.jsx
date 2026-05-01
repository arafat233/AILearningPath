import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

const EXCHANGE_TIMEOUT_MS = 30_000;

function getStoredRedirect() {
  try { return sessionStorage.getItem("postGoogleRedirect"); } catch { return null; }
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
  const setAuth = useAuthStore((s) => s.setAuth);
  const [searchParams] = useSearchParams();

  const rawToParam = searchParams.get("to");
  const decodedToParam = rawToParam
    ? (() => { try { return decodeURIComponent(rawToParam); } catch { return rawToParam; } })()
    : null;
  const redirectTo = normalizeRedirect(getStoredRedirect() || decodedToParam);

  const [error, setError] = useState("");
  const didHandle   = useRef(false);
  const didExchange = useRef(false);

  // Step 1: Process the OAuth code exactly once.
  // Clerk is blocked from navigating away (see ClerkWrapper in main.jsx), so
  // the session is established here and isSignedIn becomes true on this page.
  useEffect(() => {
    if (didHandle.current) return;
    didHandle.current = true;
    handleRedirectCallback().catch((err) => {
      const msg = err.errors?.[0]?.longMessage || err.message || "";
      if (!msg.toLowerCase().includes("already")) {
        setError(msg || "Google sign-in failed");
      }
    });
  }, [handleRedirectCallback]);

  // Step 2: Exchange as soon as Clerk marks the session active.
  // isSignedIn only becomes true after Clerk has fully established the session,
  // so getToken() is reliable at this point.
  useEffect(() => {
    if (!isLoaded || !isSignedIn || didExchange.current || error) return;
    didExchange.current = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) { didExchange.current = false; return; }
        const { data } = await clerkLogin(token);
        setAuth(null, data.data.user);
        const dest = authedRedirectTarget(redirectTo, data.data.needsOnboarding);
        try { sessionStorage.removeItem("postGoogleRedirect"); } catch { /* ignore */ }
        window.location.href = dest;
      } catch (err) {
        didExchange.current = false;
        setError(err.response?.data?.error || err.message || "Sign-in failed");
      }
    })();
  }, [isLoaded, isSignedIn, error]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timeout: show an error if the session never becomes active.
  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => {
      if (!didExchange.current) {
        setError("Google sign-in did not complete. Please try again.");
      }
    }, EXCHANGE_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isLoaded]);

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
