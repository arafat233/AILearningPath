import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

export default function ClerkCallback() {
  const clerk    = useClerk();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo     = searchParams.get("to") || "/";
  const [error, setError] = useState("");
  const didRun = useRef(false); // StrictMode guard — prevent double execution

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    async function process() {
      // 1. Complete the OAuth redirect — establishes the Clerk session
      try {
        await clerk.handleRedirectCallback();
      } catch (err) {
        const msg = (err.errors?.[0]?.message || err.message || "").toLowerCase();
        // "session already exists" is fine — there's already a valid session
        if (!msg.includes("session") && !msg.includes("already") && !msg.includes("exists")) {
          setError(err.errors?.[0]?.message || err.message || "Google sign-in failed");
          return;
        }
      }

      // 2. clerk.session is the active session immediately after the callback
      const session = clerk.session;
      if (!session) {
        setError("Sign-in failed — no session found. Please try again.");
        return;
      }

      // 3. Exchange the Clerk session token for our backend JWT cookie
      try {
        const token = await session.getToken();
        if (!token) throw new Error("Clerk returned no token");
        const { data } = await clerkLogin(token);
        setAuth(null, data.data.user);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Sign-in failed");
      }
    }

    process();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
