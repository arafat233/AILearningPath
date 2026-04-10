import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", grade: "10", examDate: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await register(form);
      setAuth(data.token, data.user);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px]">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-[22px] bg-apple-blue shadow-apple-md flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
        </div>

        <div className="card p-8">
          <h1 className="text-[22px] font-bold text-[var(--label)] mb-1 text-center">Create Account</h1>
          <p className="text-[13px] text-apple-gray text-center mb-7">Start your adaptive learning journey</p>

          {error && (
            <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Full Name</label>
              <input className="input" placeholder="Your name" value={form.name}
                onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => set("email", e.target.value)} required />
            </div>
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={form.password}
                onChange={(e) => set("password", e.target.value)} required minLength={6} />
            </div>
            <button className="btn-primary w-full mt-2 py-3" disabled={loading}>
              {loading ? "Creating…" : "Create Account"}
            </button>
          </form>

          <div className="divider my-5" />

          <p className="text-[13px] text-apple-gray text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-apple-blue font-medium hover:opacity-70 transition-opacity">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
