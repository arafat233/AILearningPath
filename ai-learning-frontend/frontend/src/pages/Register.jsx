import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { register } from "../services/api";
import { useAuthStore } from "../store/authStore";

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

export default function Register() {
  const [searchParams]  = useSearchParams();
  const prefillEmail    = searchParams.get("email") || "";

  const [form, setForm]             = useState({ name: "", email: prefillEmail, password: "", grade: "10", examDate: "" });
  const [error, setError]           = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailExists(false);
    setLoading(true);
    try {
      const { data } = await register(form);
      setAuth(null, data.data.user);
      navigate("/onboarding");
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.error || "Registration failed";
      setEmailExists(status === 409);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
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
              {emailExists && (
                <div className="mt-2">
                  <Link
                    to="/login"
                    className="font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Sign in instead →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Name */}
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Full Name</label>
              <input className="input" placeholder="Your name" value={form.name}
                onChange={(e) => set("name", e.target.value)} required />
            </div>

            {/* Email */}
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => set("email", e.target.value)} required />
            </div>

            {/* Password + strength */}
            <div>
              <label className="text-[13px] font-medium text-[var(--label2)] block mb-1.5">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
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

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength.score ? strength.color : "bg-apple-gray5"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-apple-gray">{strength.label} password</p>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full mt-2 py-3" disabled={loading}>
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
