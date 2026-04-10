import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", grade:"10", examDate:"" });
  const [error, setError]   = useState("");
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
      navigate("/onboarding"); // → go through onboarding first
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Start your adaptive learning journey</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Full name</label>
            <input className="input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} required /></div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} /></div>
          <button className="btn-primary w-full mt-1" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-5">
          Have an account? <Link to="/login" className="text-brand-500 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
