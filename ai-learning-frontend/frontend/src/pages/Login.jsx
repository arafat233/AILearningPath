import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuthStore } from "../store/authStore";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login() {
  const [form, setForm]           = useState({ email: "", password: "" });
  const [error, setError]         = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsNewUser(false);
    setLoading(true);
    try {
      const { data } = await login(form);
      setAuth(null, data.data.user);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
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
          <h1 className="text-[22px] font-bold text-[var(--label)] mb-1 text-center">Welcome back</h1>
          <p className="text-[13px] text-apple-gray text-center mb-7">Sign in to your learning dashboard</p>

          {error && (
            <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple mb-5">
              {error}
              {isNewUser && (
                <div className="mt-2">
                  <Link
                    to={`/register?email=${encodeURIComponent(form.email)}`}
                    className="font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Create an account →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password + show/hide */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[var(--label2)]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[12px] text-apple-blue hover:opacity-70 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
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
            </div>

            <button type="submit" className="btn-primary w-full mt-2 py-3" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--separator)]" />
            <span className="text-[11px] text-apple-gray uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-[var(--separator)]" />
          </div>

          <GoogleSignInButton redirectTo="/" />

          <div className="divider my-5" />

          <p className="text-[13px] text-apple-gray text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-apple-blue font-medium hover:opacity-70 transition-opacity">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
