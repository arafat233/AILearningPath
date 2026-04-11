import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-[22px] bg-apple-blue shadow-apple-md flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
        </div>

        <div className="card p-8">
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-apple-green/10 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-apple-green">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="text-[20px] font-bold text-[var(--label)] mb-2">Check your email</h1>
              <p className="text-[13px] text-apple-gray mb-1">
                If <strong>{email}</strong> is registered, a reset link has been sent.
              </p>
              <p className="text-[12px] text-apple-gray3 mb-6">
                The link expires in 1 hour. Check your spam folder if you don't see it.
              </p>
              <Link to="/login" className="btn-secondary text-[13px] py-2.5 px-6 inline-block">
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 className="text-[22px] font-bold text-[var(--label)] mb-1 text-center">Forgot password?</h1>
              <p className="text-[13px] text-apple-gray text-center mb-7">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button className="btn-primary w-full mt-2 py-3" disabled={loading}>
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <div className="divider my-5" />

              <p className="text-[13px] text-apple-gray text-center">
                Remembered it?{" "}
                <Link to="/login" className="text-apple-blue font-medium hover:opacity-70 transition-opacity">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
