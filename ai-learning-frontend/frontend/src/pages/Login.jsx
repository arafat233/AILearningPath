import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuthStore } from "../store/authStore";
import GoogleSignInButton from "../components/GoogleSignInButton";
import StellarLogo from "../components/StellarLogo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/* ── Data ───────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  { initials: "PS", name: "Priya S.",  meta: "Class 10 · Mumbai · scored 97",    quote: "I stopped panicking about boards once Stellar showed me exactly what I was weak at." },
  { initials: "AK", name: "Arjun K.", meta: "Class 10 · Bangalore · scored 91", quote: "The step-by-step worked examples finally made Algebra click. I wish I had this in Class 9." },
  { initials: "SM", name: "Sara M.",  meta: "Class 10 · Chennai · scored 95",   quote: "I did 20 minutes a day for 3 months. That's it. Scored 95 in Science." },
  { initials: "RV", name: "Rahul V.", meta: "Class 10 · Hyderabad · scored 89", quote: "The misconception cards are underrated. Fixed 3 bad habits I didn't even know I had." },
  { initials: "NK", name: "Neha K.",  meta: "Class 10 · Pune · scored 98",      quote: "Stellar told me I was strong in Biology but weak in Chemistry. I focused there and it paid off." },
  { initials: "DM", name: "Dev M.",   meta: "Class 10 · Kolkata · scored 92",   quote: "The adaptive practice kept me honest. No more skipping hard topics." },
  { initials: "TR", name: "Tanvi R.", meta: "Class 10 · Delhi · scored 96",     quote: "My tutor used to say 'just practice more.' Stellar showed me which practice actually matters." },
];

const QUOTES = [
  "Consistency beats cramming. Every time.",
  "Every question you answer is a step closer to the board exam.",
  "You're not studying. You're building certainty.",
  "The student who reviews daily never panics in the exam hall.",
  "One topic a day keeps the backlog away.",
  "Board exam? You've already answered hundreds of questions just like it.",
  "Small sessions beat long marathons. Show up daily.",
];

// Math & science formulas — pool of 24, shown 5 at a time in rotating sets
const ALL_FORMULAS = [
  "E = mc²",         "F = ma",            "a² + b² = c²",
  "v = u + at",      "PV = nRT",          "sin²θ + cos²θ = 1",
  "λ = h/mv",        "KE = ½mv²",         "E = hf",
  "F = Gm₁m₂/r²",   "pH = −log[H⁺]",    "p = mv",
  "W = Fd·cosθ",     "V = IR",            "Q = mcΔT",
  "T = 2π√(L/g)",    "ΔG = ΔH − TΔS",    "s = ut + ½at²",
  "n = c/v",         "Fnet = ma",         "ε = −dΦ/dt",
  "d = v·t",         "A = πr²",           "C = 2πr",
];

// Fixed anchor positions in the left panel (edges / corners — away from main content)
const FORMULA_SLOTS = [
  { top: "8%",  right: "8%",  rotate: "9deg",   size: "10px" },
  { top: "18%", left:  "5%",  rotate: "-11deg",  size: "10px" },
  { top: "34%", right: "6%",  rotate: "14deg",  size: "11px" },
  { top: "62%", left:  "4%",  rotate: "-8deg",   size: "10px" },
  { top: "76%", right: "9%",  rotate: "7deg",   size: "11px" },
];

// Chunk ALL_FORMULAS into sets of 5
const FORMULA_SETS = Array.from(
  { length: Math.ceil(ALL_FORMULAS.length / 5) },
  (_, i) => ALL_FORMULAS.slice(i * 5, i * 5 + 5)
);

/* ── Hooks ──────────────────────────────────────────────────────── */

// Rotating content with optional start-delay so items cascade in sequence
function useRotating(items, intervalMs = 15000, startDelay = 0) {
  const [idx, setIdx]         = useState(() => Math.floor(Math.random() * items.length));
  const [visible, setVisible] = useState(true);
  const timerRef  = useRef(null);
  const delayRef  = useRef(null);

  useEffect(() => {
    const startInterval = () => {
      timerRef.current = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setIdx((i) => (i + 1) % items.length);
          setVisible(true);
        }, 420);
      }, intervalMs);
    };

    delayRef.current = setTimeout(startInterval, startDelay);
    return () => {
      clearTimeout(delayRef.current);
      clearInterval(timerRef.current);
    };
  }, [items.length, intervalMs, startDelay]);

  return { item: items[idx], visible };
}

// Canvas: twinkling falling stars + rotating asteroids
function useSpaceCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Stars */
    const stars = Array.from({ length: 85 }, () => ({
      x:          Math.random() * canvas.width,
      y:          Math.random() * canvas.height,
      r:          Math.random() * 1.5 + 0.25,
      speed:      Math.random() * 0.22 + 0.06,
      opacity:    Math.random(),
      tSpd:       Math.random() * 0.017 + 0.004,
      tDir:       Math.random() > 0.5 ? 1 : -1,
    }));

    /* Asteroids — irregular jagged polygons */
    const mkAsteroid = () => {
      const sides   = 7 + Math.floor(Math.random() * 4);   // 7-10 sides
      const baseR   = 11 + Math.random() * 13;              // 11–24 px
      return {
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        baseR,
        sides,
        offsets: Array.from({ length: sides }, () => 0.52 + Math.random() * 0.48),
        speed:   Math.random() * 0.18 + 0.07,
        rotSpd:  (Math.random() * 0.007 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        rot:     Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.18 + 0.07,
      };
    };
    const asteroids = Array.from({ length: 5 }, mkAsteroid);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Draw stars */
      for (const s of stars) {
        s.opacity += s.tSpd * s.tDir;
        if (s.opacity >= 1)    { s.opacity = 1;    s.tDir = -1; }
        if (s.opacity <= 0.06) { s.opacity = 0.06; s.tDir =  1; }
        s.y += s.speed;
        if (s.y > canvas.height + 3) { s.y = -3; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(3)})`;
        ctx.fill();
      }

      /* Draw asteroids */
      for (const a of asteroids) {
        a.rot += a.rotSpd;
        a.y   += a.speed;
        if (a.y - a.baseR > canvas.height) {
          a.y = -a.baseR;
          a.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        for (let i = 0; i < a.sides; i++) {
          const angle = (i / a.sides) * Math.PI * 2 + a.rot;
          const r     = a.baseR * a.offsets[i];
          const px    = a.x + Math.cos(angle) * r;
          const py    = a.y + Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,${a.opacity.toFixed(3)})`;
        ctx.lineWidth   = 0.9;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);
}

/* ── Component ──────────────────────────────────────────────────── */

export default function Login() {
  const [form, setForm]                 = useState({ email: "", password: "" });
  const [error, setError]               = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [studentCount, setStudentCount] = useState(null);
  const canvasRef = useRef(null);
  const setAuth   = useAuthStore((s) => s.setAuth);
  const navigate  = useNavigate();

  useSpaceCanvas(canvasRef);

  // Cascade: quote first → formulas 700ms later → testimonial 1400ms later
  const quote       = useRotating(QUOTES,        15000,    0);
  const formulas    = useRotating(FORMULA_SETS,  15000,  700);
  const testimonial = useRotating(TESTIMONIALS,  15000, 1400);

  useEffect(() => {
    fetch(`${API_URL}/public/stats`)
      .then((r) => r.json())
      .then((d) => setStudentCount(d.totalUsers ?? null))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login(form);
      const u = data.data.user;
      setAuth(null, u);
      if (u.role === "admin") { navigate("/"); return; }
      const kids = u.linkedStudents || [];
      if (kids.length === 0) navigate("/onboarding");
      else navigate("/child-picker");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fadeStyle = (vis) => ({
    opacity:    vis ? 1 : 0,
    transform:  vis ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 0.42s ease, transform 0.42s ease",
  });

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ───────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #c8b4f0 0%, #f0a0cc 45%, #fad0a0 100%)" }}
      >
        {/* Canvas: stars + asteroids */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* Floating formula layer — z:1 sits between canvas and text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          {FORMULA_SLOTS.map((slot, i) => (
            <div
              key={i}
              className="absolute font-mono text-[#1a1040] select-none whitespace-nowrap"
              style={{
                top:       slot.top,
                left:      slot.left,
                right:     slot.right,
                fontSize:  slot.size,
                transform: `rotate(${slot.rotate})`,
                opacity:   formulas.visible ? 0.2 : 0,
                transition: "opacity 0.42s ease",
              }}
            >
              {(formulas.item ?? [])[i] ?? ""}
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <StellarLogo size={44} />
          <span className="text-[#1a1040] text-[20px] font-bold tracking-tight">Stellar</span>
        </div>

        {/* Main content */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-[52px] font-bold leading-[1.1] text-[#1a1040]">
            Welcome{" "}
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 400 }}>
              back.
            </span>
          </h1>

          {/* Rotating quote */}
          <p
            className="text-[17px] font-medium text-[#1a1040]/75 leading-snug max-w-[300px]"
            style={fadeStyle(quote.visible)}
          >
            {quote.item}
          </p>

          <p className="text-[13px] text-[#2d1a60]/60 leading-relaxed max-w-[320px] pt-1">
            Your AI tutor is ready. Pick up where you left off and keep the streak alive.
          </p>

          {/* Rotating testimonial */}
          <div
            className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 max-w-[340px] mt-4"
            style={fadeStyle(testimonial.visible)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#1a1040] flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-bold">{testimonial.item.initials}</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1a1040]">{testimonial.item.name}</p>
                <p className="text-[11px] text-[#2d1a60]/70">{testimonial.item.meta}</p>
              </div>
            </div>
            <p className="text-[13px] text-[#1a1040]/80 italic leading-relaxed">
              "{testimonial.item.quote}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[12px] text-[#2d1a60]/60 relative z-10">
          {studentCount !== null ? studentCount.toLocaleString() : "—"} students learning today
        </p>
      </div>

      {/* ── Right panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: "#f5f4f0" }}>
        <div className="w-full max-w-[380px]">

          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8e8e93] mb-3">
            Sign In
          </p>
          <h2 className="text-[28px] font-bold text-[#1a1040] mb-8 tracking-tight">
            Continue your run.
          </h2>

          <div className="mb-5">
            <GoogleSignInButton redirectTo="/" />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#d1d1d6]" />
            <span className="text-[12px] text-[#8e8e93]">or</span>
            <div className="flex-1 h-px bg-[#d1d1d6]" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-[#3a3a3c] block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e5e5ea] bg-white text-[14px] text-[#1c1c1e] placeholder:text-[#c7c7cc] focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#3a3a3c]">Password</label>
                <Link to="/forgot-password" className="text-[12px] text-[#007AFF] hover:opacity-70 transition-opacity">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 pr-16 rounded-xl border border-[#e5e5ea] bg-white text-[14px] text-[#1c1c1e] placeholder:text-[#c7c7cc] focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#8e8e93] hover:text-[#3a3a3c] transition-colors"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 mt-1"
              style={{ background: "#1a1040" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-[13px] text-[#8e8e93] text-center mt-6">
            New here?{" "}
            <Link
              to="/register"
              className="text-[#1a1040] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
