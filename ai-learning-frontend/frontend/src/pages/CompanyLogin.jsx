import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "../store/companyStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function CompanyLogin() {
  const navigate   = useNavigate();
  const setToken   = useCompanyStore((s) => s.setToken);
  const token      = useCompanyStore((s) => s.token);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // Already logged in
  if (token) { navigate("/company", { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/company/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Login failed"); return; }
      setToken(json.data.token);
      navigate("/company", { replace: true });
    } catch {
      setError("Could not reach server. Check the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
            <span className="text-white font-bold text-[18px]">S</span>
          </div>
          <span className="text-white font-semibold text-[20px] tracking-tight">Stellar</span>
          <span className="text-[11px] mono uppercase tracking-widest text-white/30 ml-1 mt-0.5">Internal</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-white font-bold text-[22px] tracking-tight">Company Dashboard</h1>
          <p className="text-white/40 text-[13px] mt-1">Internal access only. Not for students or parents.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block text-[11px] mono uppercase tracking-widest text-white/40 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] outline-none focus:border-[#007AFF]/60 focus:bg-white/10 transition placeholder-white/20"
                placeholder="admin@stellar.app"
              />
            </div>
            <div>
              <label className="block text-[11px] mono uppercase tracking-widest text-white/40 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] outline-none focus:border-[#007AFF]/60 focus:bg-white/10 transition placeholder-white/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-[13px]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#007AFF] hover:bg-[#0071EB] text-white font-semibold text-[14px] transition disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-[12px] mono mt-6">
          Stellar · Confidential · Internal use only
        </p>
      </div>
    </div>
  );
}
