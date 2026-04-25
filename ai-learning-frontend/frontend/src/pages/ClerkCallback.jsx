import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

export default function ClerkCallback() {
  const { handleRedirectCallback } = useClerk();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [searchParams]  = useSearchParams();
  const redirectTo      = searchParams.get("to") || "/";
  const [error, setError]           = useState("");
  const [callbackDone, setCallbackDone] = useState(false);
  const didHandle   = useRef(false); // StrictMode: only run handleRedirectCallback once
  const didExchange = useRef(false); // only run the backend exchange once

  // Step 1: complete the OAuth callback (exactly once, even in React StrictMode)
  useEffect(() => {
    if (didHandle.current) return;
    didHandle.current = true;

    handleRedirectCallback()
      .catch((err) => {
        // Any error here is treated as "maybe the session is already valid"
        // We rely on isSignedIn (step 2) to determine the real outcome
        console.error("[ClerkCallback] handleRedirectCallback error:", err);
      })
      .finally(() => setCallbackDone(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2: once Clerk's reactive state confirms sign-in, exchange for backend JWT
  useEffect(() => {
    if (!callbackDone || !isLoaded || !isSignedIn || didExchange.current) return;
    didExchange.current = true;

    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Clerk returned no token — please try again");
        const { data } = await clerkLogin(token);
        setAuth(null, data.data.user);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        console.error("[ClerkCallback] backend exchange error:", err);
        setError(err.response?.data?.error || err.message || "Sign-in failed");
      }
    })();
  }, [callbackDone, isLoaded, isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2b: if callback is done, Clerk loaded, but NOT signed in — show error
  useEffect(() => {
    if (!callbackDone || !isLoaded || isSignedIn || error || didExchange.current) return;
    const t = setTimeout(() => {
      if (!isSignedIn && !error) {
        setError("Google sign-in did not complete. Please try again.");
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [callbackDone, isLoaded, isSignedIn, error]);

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
