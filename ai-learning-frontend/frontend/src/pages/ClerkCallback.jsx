import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

export default function ClerkCallback() {
  const { handleRedirectCallback } = useClerk();
  const { session, isLoaded }      = useSession();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [searchParams]                  = useSearchParams();
  const redirectTo                      = searchParams.get("to") || "/dashboard";
  const [callbackDone, setCallbackDone] = useState(false);
  const [error, setError]               = useState("");

  // Step 1 — complete the OAuth redirect
  useEffect(() => {
    handleRedirectCallback()
      .then(() => setCallbackDone(true))
      .catch((err) => {
        const code = err.errors?.[0]?.code || "";
        // "session_exists" means Clerk already has a valid session — just proceed
        if (code === "session_exists" || err.message?.toLowerCase().includes("session")) {
          setCallbackDone(true);
        } else {
          setError(err.errors?.[0]?.message || err.message || "Sign-in failed");
        }
      });
  }, []);

  // Step 2 — once session is loaded and callback is done, exchange with backend
  useEffect(() => {
    if (!callbackDone || !isLoaded || !session) return;

    session.getToken().then(async (token) => {
      if (!token) { setError("No session token — please try again"); return; }
      const { data } = await clerkLogin(token);
      setAuth(null, data.data.user);
      navigate(redirectTo);
    }).catch((err) => {
      setError(err.response?.data?.error || err.message || "Sign-in failed");
    });
  }, [callbackDone, isLoaded, session]);

  if (error) {
    return (
      <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <p className="text-apple-red mb-4">{error}</p>
          <a href="/login" className="btn-primary px-6 py-2">Back to Login</a>
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
