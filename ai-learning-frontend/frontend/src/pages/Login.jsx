import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [form, setForm]         = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading]   = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsNewUser(false);
    setLoading(true);
    try {
      const { data } = await login(form);
      setAuth(data.token, data.user);
      navigate("/");
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.error || "Login failed";
      setIsNewUser(status === 404);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        {/* Logo mark */}
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
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="btn-primary w-full mt-2 py-3" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

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
