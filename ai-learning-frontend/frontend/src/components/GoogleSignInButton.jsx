import { useSignIn, useClerk, useAuth } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkReady = CLERK_KEY && !CLERK_KEY.startsWith("YOUR_");

function GoogleButton({ redirectTo }) {
  const { signIn, isLoaded }  = useSignIn();
  const { signOut }           = useClerk();
  const { isSignedIn }        = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  // Tracks a pending OAuth request that was blocked by an active Clerk session.
  // We sign out first, then this effect re-runs with the fresh signIn instance.
  const pendingOAuth = useRef(false);

  if (!isLoaded) return null;

  // When signOut completes, isSignedIn flips to false and this effect fires with
  // a fresh signIn instance — avoids the "stale signIn after signOut" race.
  useEffect(() => {
    if (!isLoaded || !signIn || isSignedIn || !pendingOAuth.current) return;
    pendingOAuth.current = false;

    const destination     = sessionStorage.getItem("postGoogleRedirect") || redirectTo || "/";
    const encoded         = encodeURIComponent(destination);
    const callbackUrl     = `${window.location.origin}/clerk-callback?to=${encoded}`;
    const exchangeUrl     = `${window.location.origin}/clerk-callback?stage=exchange&to=${encoded}`;

    signIn.authenticateWithRedirect({
      strategy:            "oauth_google",
      redirectUrl:         callbackUrl,
      redirectUrlComplete: exchangeUrl,
      oidcPrompt:          "select_account",
    }).catch((err) => {
      setError(err.errors?.[0]?.message || "Google sign-in failed");
      setLoading(false);
    });
  }, [isLoaded, isSignedIn, signIn, redirectTo]);

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const destination = redirectTo || "/";
    try { sessionStorage.setItem("postGoogleRedirect", destination); } catch { /* ignore */ }

    if (isSignedIn) {
      // Active Clerk session — sign out first so the OAuth flow can start cleanly.
      // The useEffect above will fire once isSignedIn flips to false.
      pendingOAuth.current = true;
      try {
        await signOut();
      } catch {
        pendingOAuth.current = false;
        setError("Sign-out failed. Please try again.");
        setLoading(false);
      }
      return;
    }

    // No active session — start OAuth directly.
    const encoded     = encodeURIComponent(destination);
    const callbackUrl = `${window.location.origin}/clerk-callback?to=${encoded}`;
    const exchangeUrl = `${window.location.origin}/clerk-callback?stage=exchange&to=${encoded}`;
    try {
      await signIn.authenticateWithRedirect({
        strategy:            "oauth_google",
        redirectUrl:         callbackUrl,
        redirectUrlComplete: exchangeUrl,
        oidcPrompt:          "select_account",
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-apple-red text-[12px] mb-2 text-center">{error}</p>}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 border border-[var(--separator)]
                   bg-[var(--card)] text-[var(--label)] text-[14px] font-medium
                   rounded-apple px-4 py-2.5 hover:bg-apple-gray6 transition-colors disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
    </div>
  );
}

export default function GoogleSignInButton({ redirectTo = "/" }) {
  if (!clerkReady) return null;
  return <GoogleButton redirectTo={redirectTo} />;
}
