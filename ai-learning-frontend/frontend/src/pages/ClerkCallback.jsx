import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";
import { clerkLogin } from "../services/api";

export default function ClerkCallback() {
  const { handleRedirectCallback, session } = useClerk();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finish() {
      try {
        // Complete the OAuth redirect
        await handleRedirectCallback();

        // Get the active session token and exchange it with our backend
        const token = await session?.getToken();
        if (!token) throw new Error("No session token after Clerk callback");

        const { data } = await clerkLogin(token);
        setAuth(null, data.data.user);

        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Sign-in failed");
      }
    }
    finish();
  }, []);

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
