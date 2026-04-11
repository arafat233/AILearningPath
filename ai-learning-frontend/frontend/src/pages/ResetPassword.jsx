import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/api";

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-apple-red" };
  if (score <= 3) return { score, label: "Fair",   color: "bg-apple-orange" };
  if (score === 4) return { score, label: "Good",   color: "bg-apple-yellow" };
  return               { score, label: "Strong", color: "bg-apple-green" };
}

export default function ResetPassword() {
  const { token }  = useParams();
  const navigate   = useNavigate();

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const strength = passwordStrength(password);
  const mismatch = confirm && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. The link may have expired.");
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
          {done ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-apple-green/10 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-apple-green">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="text-[20px] font-bold text-[var(--label)] mb-2">Password updated!</h1>
              <p className="text-[13px] text-apple-gray mb-6">
                Redirecting you to sign in…
              </p>
              <Link to="/login" className="btn-primary text-[13px] py-2.5 px-6 inline-block">
                Sign In Now
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 className="text-[22px] font-bold text-[var(--label)] mb-1 text-center">Set new password</h1>
              <p className="text-[13px] text-apple-gray text-center mb-7">
                Choose a strong password for your account.
              </p>

              {error && (
                <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple mb-5">
                  {error}
                  {error.toLowerCase().includes("expired") && (
                    <div className="mt-2">
                      <Link to="/forgot-password"
                        className="font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity">
                        Request a new link →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* New password */}
                <div>
                  <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showPass ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray hover:text-[var(--label)] transition-colors text-[12px]"
                      tabIndex={-1}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength.score ? strength.color : "bg-apple-gray5"
                          }`} />
                        ))}
                      </div>
                      <p className="text-[11px] text-apple-gray">{strength.label} password</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Confirm Password</label>
                  <input
                    className={`input ${mismatch ? "border-apple-red/60 ring-1 ring-apple-red/30" : ""}`}
                    type={showPass ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                  {mismatch && (
                    <p className="text-[11px] text-apple-red mt-1">Passwords don't match</p>
                  )}
                </div>

                <button
                  className="btn-primary w-full mt-2 py-3"
                  disabled={loading || mismatch || !password}
                >
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
