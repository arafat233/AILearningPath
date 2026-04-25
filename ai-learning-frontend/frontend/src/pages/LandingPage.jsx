import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const ACCENT = "#007AFF";

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="w-7 h-7 rounded-[9px] flex items-center justify-center"
         style={{ background: `linear-gradient(135deg, ${ACCENT}, #5856D6)` }}>
      <span className="text-white text-[13px] font-black">A</span>
    </div>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [["Demo", "#tour"], ["Features", "#features"], ["How it works", "#how"],
                 ["Goals", "#goals"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "backdrop-blur-xl bg-paper/75 border-b hairline border-b" : ""}`}
            style={{ background: scrolled ? "rgba(251,251,253,0.75)" : "transparent" }}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold tracking-tight text-[15px] text-ink">AILearn</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-ink-3">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="hover:text-ink transition-colors">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex text-[13px] text-ink-2 hover:text-ink px-3 py-1.5 transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-all hover:brightness-105"
                style={{ background: ACCENT }}>
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const PROFILES = [
  { key: "Deep Thinker",       color: "#34C759", blurb: "Methodical, slow, high accuracy.", stat: "+28% retention" },
  { key: "Pattern Recognizer", color: "#007AFF", blurb: "Sees structure fast.",              stat: "92% on analogies" },
  { key: "Surface Learner",    color: "#FF9500", blurb: "Memorises, skips reasoning.",       stat: "Risk flagged" },
  { key: "Overthinker",        color: "#AF52DE", blurb: "Knows it — doubts it.",             stat: "+40% confidence" },
  { key: "Guesser",            color: "#FF3B30", blurb: "Fast + wrong pattern.",             stat: "Auto-corrected" },
];

function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PROFILES.length), 2400);
    return () => clearInterval(t);
  }, []);
  const p = PROFILES[idx];

  return (
    <section id="top" className="relative overflow-hidden" style={{ background: "#FBFBFD" }}>
      <div className="absolute inset-0 dot-bg opacity-60 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-40 pointer-events-none"
           style={{ background: "radial-gradient(closest-side, #007AFF55, transparent)" }} />
      <div className="absolute top-40 -left-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-30 pointer-events-none"
           style={{ background: "radial-gradient(closest-side, #AF52DE55, transparent)" }} />

      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-12 gap-10 items-center relative">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 text-[12px] mono text-ink-3 bg-white/80 backdrop-blur border hairline border rounded-full px-3 py-1"
               style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-apple-green pulse-ring relative" />
            Every child is a unique learner
          </div>
          <h1 className="display text-[44px] md:text-[64px] leading-[0.98] mt-5 tracking-tight text-ink">
            Every child is a star.{" "}
            <span className="gradient-text">We build the sky around them.</span>
          </h1>
          <p className="text-[18px] md:text-[20px] text-ink-2 mt-6 max-w-[560px] leading-relaxed">
            No two stars shine the same — and no two children learn the same. So why do they all sit through the same class, at the same speed, on the same page?
            <br /><br />
            AILearn reads <em>how</em> your child thinks, then builds a study path just for them. From Class 1 to Class 10, across every major board.
          </p>

          <div className="mt-8 flex items-center gap-6 text-[12px] text-ink-3">
            <TrustMetric n="48k+" l="students practising" />
            <div className="w-px h-8" style={{ background: "rgba(110,110,115,0.2)" }} />
            <TrustMetric n="2.1M" l="AI hints served" />
            <div className="w-px h-8" style={{ background: "rgba(110,110,115,0.2)" }} />
            <TrustMetric n="A1" l="avg predicted grade" />
          </div>

          <div className="mt-10 flex items-center gap-3 flex-wrap">
            <Link to="/register" className="font-semibold text-[15px] px-7 py-4 rounded-full text-white shadow-apple-md transition-all hover:brightness-105 hover:-translate-y-0.5"
                  style={{ background: ACCENT }}>
              Start free diagnostic →
            </Link>
            <a href="#features" className="text-[14px] font-medium text-ink px-6 py-4 rounded-full border bg-white hover:bg-paper-2 transition-colors"
               style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              See how it works
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] blur-2xl opacity-60 pointer-events-none"
                 style={{ background: `radial-gradient(closest-side, ${p.color}33, transparent)` }} />
            <div className="relative bg-white rounded-apple-2xl shadow-apple-xl border floaty p-6"
                 style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <div className="flex items-center justify-between text-[11px] mono text-ink-3">
                <span>LIVE · analysing</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-red animate-pulse" /> Rec
                </span>
              </div>
              <p className="text-[12px] text-ink-3 mt-4">Thinking profile detected</p>
              <div key={p.key} className="fade-in mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                   style={{ background: p.color + "1A", color: p.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                <span className="text-[13px] font-semibold">{p.key}</span>
              </div>
              <p key={p.key + "b"} className="fade-in text-[15px] text-ink mt-3 leading-snug">{p.blurb}</p>

              <div className="mt-5 p-4 rounded-apple-lg bg-paper-2 border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <p className="text-[11px] mono text-ink-3">Q · Quadratic equations</p>
                <p className="text-[14px] text-ink mt-1 leading-snug">If x² − 5x + 6 = 0, which is a root?</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[["A", "x = 1", false], ["B", "x = 2", true], ["C", "x = 4", false], ["D", "x = 5", false]].map(([k, t, correct]) => (
                    <div key={k} className={`text-[12px] px-3 py-2 rounded-apple border transition-all ${
                      correct ? "bg-apple-green/8 text-apple-green" : "bg-white text-ink-2"
                    }`} style={{ borderColor: correct ? "rgba(52,199,89,0.3)" : "rgba(0,0,0,0.08)" }}>
                      <span className="mono mr-1.5">{k}</span>{t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-ink-3 mono">
                <span>confidence: high · 14s</span>
                <span className="font-semibold" style={{ color: p.color }}>{p.stat}</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-apple-lg border shadow-apple-md px-3 py-2.5 hidden sm:flex items-center gap-2"
                 style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-[11px] mono text-ink-3">STREAK</p>
                <p className="text-[13px] font-semibold text-ink">27 days</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-3 bg-white rounded-apple-lg border shadow-apple-md px-3 py-2"
                 style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <p className="text-[10px] mono text-ink-3">PREDICTED</p>
              <p className="text-[16px] font-bold gradient-text">Grade A1</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustMetric({ n, l }) {
  return (
    <div>
      <p className="text-[18px] font-bold text-ink tracking-tight">{n}</p>
      <p className="text-[11px] mono uppercase">{l}</p>
    </div>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["DPS · Delhi", "La Martiniere", "Ryan International", "Kendriya Vidyalaya",
    "Modern School", "DAV Public", "Bal Bharati", "Sanskriti", "Cambridge",
    "Army Public", "Mount Carmel", "St. Xavier's"];
  return (
    <section className="relative border-y py-8" style={{ background: "#FBFBFD", borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1200px] mx-auto px-6 marquee-fade">
        <p className="text-center text-[11px] mono text-ink-3 uppercase mb-4">Used by students at</p>
        <div className="flex gap-12 ticker whitespace-nowrap w-max">
          {[...items, ...items].map((s, i) => (
            <span key={i} className="text-[15px] font-semibold" style={{ color: "rgba(60,60,67,0.7)" }}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="py-24 md:py-32" style={{ background: "#FBFBFD" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionEyebrow>The system</SectionEyebrow>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[800px] mt-3 text-ink">
          Six engines, one student.<br />
          <span className="text-ink-3">Everything listens, everything adapts.</span>
        </h2>
        <div className="mt-14 grid grid-cols-12 gap-4">
          <BentoCard span="col-span-12 md:col-span-7" height="md:h-[420px]" accent="#007AFF">
            <CardHeader tag="ADAPTIVE ENGINE" title="Questions that meet your mind."
              body="Our adaptive router picks the next question based on target difficulty, recent errors, and topic decay — 0 duplicates, ever." />
            <AdaptiveViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-5" height="md:h-[420px]" accent="#AF52DE">
            <CardHeader tag="THINKING PROFILE" title="It's not WHAT you got wrong."
              body="We classify every mistake — guessing, concept gap, calculation slip, misinterpretation — and tune the next 5 questions to the pattern." />
            <ProfileViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[360px]" accent="#34C759">
            <CardHeader tag="SPACED REVISION" title="Never forget what you've learned."
              body="Built on [1, 3, 7, 15, 30]-day intervals per topic. We tell you exactly when to revise." />
            <RevisionViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[360px]" accent="#FF9500">
            <CardHeader tag="VOICE TUTOR" title="Ask aloud. In Hindi, too."
              body="Tap the mic, ask anything — subject-aware Claude answers with TTS. हिंदी में भी।" />
            <VoiceViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[360px]" accent="#FF2D55">
            <CardHeader tag="LIVE ROOMS" title="Compete in real time."
              body="Challenge friends to a live quiz. Socket-powered, ranked, leaderboarded." />
            <LiveRoomViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-8" height="md:h-[340px]" accent="#5856D6">
            <CardHeader tag="EXAM PREDICTION" title="We forecast your board grade."
              body="Weighted by chapter marks × historical exam frequency, we predict your CBSE grade — A1 through E — and show you the path to move up." />
            <PredictionViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[340px]" accent="#5AC8FA">
            <CardHeader tag="SMART PLANNER" title="A daily plan that knows the date."
              body="Goal-aware — pass, distinction, top-ranker or scholarship — it re-weights priorities every night." />
            <PlannerViz />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }) {
  return <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">{children}</p>;
}

function BentoCard({ children, span, height, accent }) {
  return (
    <div className={`${span} ${height || ""} relative rounded-apple-2xl bg-white border shadow-apple overflow-hidden group`}
         style={{ borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
           style={{ background: `radial-gradient(400px circle at 30% 0%, ${accent}10, transparent 60%)` }} />
      <div className="relative h-full flex flex-col p-7">{children}</div>
    </div>
  );
}

function CardHeader({ tag, title, body }) {
  return (
    <div>
      <p className="text-[11px] mono uppercase text-ink-3 tracking-[0.18em]">{tag}</p>
      <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight mt-2 leading-tight text-ink">{title}</h3>
      <p className="text-[14px] text-ink-2 mt-2 leading-relaxed max-w-[420px]">{body}</p>
    </div>
  );
}

function AdaptiveViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1200);
    return () => clearInterval(t);
  }, []);
  const rows = [
    { t: "Linear eq.",      d: 0.32, correct: true  },
    { t: "Polynomials",     d: 0.55, correct: false },
    { t: "Quadratic roots", d: 0.74, correct: true  },
    { t: "Coord. geometry", d: 0.68, correct: true  },
  ];
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="space-y-2.5">
        {rows.map((r, i) => {
          const active = i <= step;
          return (
            <div key={r.t} className={`flex items-center gap-3 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
              <span className={`text-[12px] w-36 truncate ${active ? "text-ink" : "text-ink-3"}`}>{r.t}</span>
              <div className="flex-1 h-2 rounded-full bg-apple-gray6 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: active ? `${r.d * 100}%` : "4%", background: r.correct ? "#34C759" : "#FF9500" }} />
              </div>
              <span className="text-[11px] mono text-ink-3 w-8 text-right">{Math.round(r.d * 100)}%</span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] mono text-ink-3 mt-4">target difficulty → <span className="text-apple-blue">0.74</span></p>
    </div>
  );
}

function ProfileViz() {
  const LABELS = ["Deep Thinker", "Pattern Rec.", "Surface", "Overthinker", "Guesser"];
  function pentPoint(cx, cy, r, i) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
  function pentPoints(cx, cy, r) {
    return [...Array(5)].map((_, i) => { const { x, y } = pentPoint(cx, cy, r, i); return `${x},${y}`; }).join(" ");
  }
  return (
    <div className="mt-auto pt-6 flex-1 flex items-end justify-center">
      <svg viewBox="0 0 260 200" className="w-full max-w-[280px]">
        <defs>
          <radialGradient id="pg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#AF52DE" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#AF52DE" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[30, 55, 80].map((r, i) => <polygon key={i} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" points={pentPoints(130, 100, r)} />)}
        <polygon fill="url(#pg)" stroke="#AF52DE" strokeWidth="2"
          points={`${130},${100 - 75} ${130 + 60},${100 - 20} ${130 + 45},${100 + 55} ${130 - 50},${100 + 40} ${130 - 68},${100 - 10}`} />
        {LABELS.map((l, i) => {
          const { x, y } = pentPoint(130, 100, 95, i);
          return <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="mono" fontSize="9" fill="#6E6E73">{l}</text>;
        })}
      </svg>
    </div>
  );
}

function RevisionViz() {
  const days = [1, 3, 7, 15, 30];
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="flex items-end gap-2 h-24">
        {days.map((d, i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="bar-grow w-full rounded-t-md"
                 style={{ height: `${20 + i * 18}%`, background: "#34C75988", animationDelay: `${i * 120}ms` }} />
            <span className="text-[10px] mono text-ink-3">{d}d</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] mono">
        <span className="text-ink-3">next revision</span>
        <span className="px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green">Quadratics · today</span>
      </div>
    </div>
  );
}

function VoiceViz() {
  const [bars, setBars] = useState(Array(14).fill(0.3));
  useEffect(() => {
    const t = setInterval(() => setBars(Array.from({ length: 14 }, () => 0.2 + Math.random() * 0.8)), 140);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-apple-orange flex items-center justify-center shadow-apple">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 10a7 7 0 0 1-14 0h2a5 5 0 0 0 10 0h2zM11 19h2v3h-2z" />
          </svg>
        </div>
        <div className="flex items-center gap-[3px] h-10 flex-1">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-full transition-[height] duration-150"
                 style={{ height: `${b * 100}%`, background: "#FF9500" }} />
          ))}
        </div>
      </div>
      <p className="text-[12px] text-ink-2 mt-3 leading-snug">
        <span className="mono text-ink-3">EN·</span> "Explain Thevenin's theorem simply"
      </p>
      <p className="text-[12px] text-ink-2 leading-snug">
        <span className="mono text-ink-3">HI·</span> "प्रकाश संश्लेषण क्या है?"
      </p>
    </div>
  );
}

function LiveRoomViz() {
  const players = [{ name: "Aarav", score: 84 }, { name: "You", score: 92, me: true }, { name: "Priya", score: 78 }, { name: "Kabir", score: 61 }]
    .sort((a, b) => b.score - a.score);
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="space-y-1.5">
        {players.map((p, i) => (
          <div key={p.name} className={`flex items-center gap-3 px-3 py-2 rounded-apple ${p.me ? "ring-1 ring-apple-pink/30" : ""}`}
               style={{ background: p.me ? "rgba(255,45,85,0.08)" : "#F5F5F7" }}>
            <span className="mono text-[11px] w-4 text-ink-3">#{i + 1}</span>
            <span className={`text-[13px] flex-1 ${p.me ? "font-semibold text-apple-pink" : "text-ink"}`}>{p.name}</span>
            <span className="mono text-[12px] font-semibold text-ink">{p.score}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] mono text-ink-3 mt-3">Q 8/10 · 00:14</p>
    </div>
  );
}

function PredictionViz() {
  const grades = [["A1", 92, true], ["A2", 88, false], ["B1", 80, false], ["B2", 72, false],
                  ["C1", 64, false], ["C2", 56, false], ["D", 40, false], ["E", 0, false]];
  return (
    <div className="mt-auto pt-6 flex-1 flex items-center gap-6 justify-between">
      <div className="flex flex-col gap-1 min-w-[100px]">
        <p className="text-[11px] mono text-ink-3">predicted</p>
        <p className="text-[58px] font-bold leading-none gradient-text">A1</p>
        <p className="text-[12px] mono text-ink-3">78–86 / 80</p>
      </div>
      <div className="flex-1 grid grid-cols-8 gap-1.5 items-end h-32">
        {grades.map(([g, h, active]) => (
          <div key={g} className="flex flex-col items-center gap-1.5">
            <div className="w-full rounded-t-sm transition-all"
                 style={{ height: `${h}%`, background: active ? "#5856D6" : "rgba(209,209,214,0.33)" }} />
            <span className={`text-[10px] mono ${active ? "text-apple-indigo font-semibold" : "text-ink-3"}`}>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlannerViz() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const loads = [3, 5, 2, 4, 6, 1, 2];
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] mono text-ink-3">{d}</span>
            <div className="w-full rounded-md bar-grow"
                 style={{ height: `${loads[i] * 10 + 10}px`, background: i === 4 ? "#5AC8FA" : "#5AC8FA55", animationDelay: `${i * 80}ms` }} />
          </div>
        ))}
      </div>
      <p className="text-[11px] mono text-ink-3 mt-3">today · 3 topics · 2h 10m</p>
    </div>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", t: "Pick your class & board",   d: "Class 1 to 10 · CBSE, ICSE, IB PYP/MYP, or your state board. We match the syllabus exactly.", a: "#007AFF" },
    { n: "02", t: "Take a 10-min diagnostic",  d: "Age-appropriate mixed questions. We measure speed, accuracy, and confidence at once.", a: "#AF52DE" },
    { n: "03", t: "Get your thinking profile", d: "One of five — Deep Thinker, Pattern Recognizer, Surface Learner, Overthinker, Guesser.", a: "#34C759" },
    { n: "04", t: "Practise & see progress",   d: "Adaptive questions, AI explanations, predicted grade — updated live as your child practises.", a: "#FF9500" },
  ];
  return (
    <section id="how" className="py-24 md:py-32 border-y" style={{ background: "#F5F5F7", borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionEyebrow>The loop</SectionEyebrow>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[800px] mt-3 text-ink">
          Built as a loop, not a feed.
        </h2>
        <p className="text-[16px] text-ink-2 mt-5 max-w-[620px]">
          Every answer re-shapes the next question, the next lesson, and tonight's plan. No scroll, no dead ends.
        </p>
        <div className="mt-14 grid md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative bg-white rounded-apple-2xl border p-6 shadow-apple overflow-hidden"
                 style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: s.a }} />
              <p className="mono text-[40px] font-bold tracking-tight" style={{ color: s.a }}>{s.n}</p>
              <h3 className="text-[17px] font-semibold mt-3 leading-tight text-ink">{s.t}</h3>
              <p className="text-[13px] text-ink-2 mt-2 leading-relaxed">{s.d}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px z-10" style={{ background: "rgba(110,110,115,0.2)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Subjects ──────────────────────────────────────────────────────────────────
const BOARDS = [
  { key: "CBSE",  name: "CBSE",         tag: "Central Board",   count: "25K+ schools" },
  { key: "ICSE",  name: "ICSE / ISC",   tag: "CISCE",           count: "2.3K+ schools" },
  { key: "IB",    name: "IB",           tag: "PYP · MYP",       count: "210+ schools" },
  { key: "STATE", name: "State Boards", tag: "All 28 states",   count: "400K+ schools" },
];
const CLASSES = [
  { grade: 1,  stage: "Primary",   color: "#FF9500" }, { grade: 2,  stage: "Primary",   color: "#FF9500" },
  { grade: 3,  stage: "Primary",   color: "#FF9500" }, { grade: 4,  stage: "Primary",   color: "#34C759" },
  { grade: 5,  stage: "Primary",   color: "#34C759" }, { grade: 6,  stage: "Middle",    color: "#5AC8FA" },
  { grade: 7,  stage: "Middle",    color: "#5AC8FA" }, { grade: 8,  stage: "Middle",    color: "#5AC8FA" },
  { grade: 9,  stage: "Secondary", color: "#AF52DE" }, { grade: 10, stage: "Secondary", color: "#AF52DE" },
];

function subjectsFor(board, grade) {
  const isPrimary = grade <= 5, isMiddle = grade >= 6 && grade <= 8;
  if (board === "CBSE") {
    if (isPrimary) return ["English", "Hindi", "Mathematics", "EVS", "Art & Craft"];
    if (isMiddle)  return ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit", "Computer"];
    return ["English", "Hindi", "Mathematics", "Science", "Social Science"];
  }
  if (board === "ICSE") {
    if (isPrimary) return ["English", "2nd Language", "Mathematics", "EVS", "Computer Studies"];
    if (isMiddle)  return ["English", "Maths", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "2nd Language"];
    return ["English", "Maths", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "2nd Language", "Computer Applications"];
  }
  if (board === "IB") {
    if (isPrimary) return ["Language", "Mathematics", "Social Studies", "Sciences", "Arts", "PSPE", "UOI"];
    return ["Language & Lit", "Language Acquisition", "Individuals & Societies", "Sciences", "Mathematics", "Arts", "Design", "PHE"];
  }
  if (isPrimary) return ["English", "Regional Language", "Mathematics", "EVS"];
  if (isMiddle)  return ["English", "Regional Language", "Mathematics", "Science", "Social Science", "Hindi / 3rd Lang"];
  return ["English", "Regional Language", "Mathematics", "Science", "Social Science", "Hindi / 3rd Lang"];
}

function sampleTopicsFor(grade, subject) {
  const key = subject.toLowerCase();
  if (key.includes("math")) {
    if (grade <= 2) return ["Numbers 1–100", "Shapes & patterns", "Addition", "Subtraction", "Time & money", "Measurement"];
    if (grade <= 5) return ["Place value", "Fractions", "Decimals", "Area & perimeter", "Factors & multiples", "Data handling"];
    if (grade <= 8) return ["Integers", "Rational numbers", "Algebraic expressions", "Linear equations", "Mensuration", "Probability"];
    return ["Real numbers", "Polynomials", "Quadratic equations", "Trigonometry", "Coordinate geometry", "Statistics"];
  }
  if (key.includes("science") || key.includes("physics") || key.includes("biology") || key.includes("chemistry")) {
    if (grade <= 5) return ["Plants & animals", "Food & nutrition", "Water cycle", "Weather", "Our body", "Force & motion"];
    if (grade <= 8) return ["Cell structure", "Light & reflection", "Acids & bases", "Crop production", "Microorganisms", "Force & pressure"];
    return ["Chemical reactions", "Life processes", "Electricity", "Human eye", "Carbon compounds", "Heredity"];
  }
  if (key.includes("social") || key.includes("history") || key.includes("individuals")) {
    if (grade <= 5) return ["Our neighbourhood", "Landforms", "Festivals", "Transport", "Maps basics", "Communities"];
    if (grade <= 8) return ["Medieval India", "Resources", "Democracy", "Climate", "Civics basics", "Public facilities"];
    return ["Nationalism", "Globalisation", "Federalism", "Resources & development", "Power sharing", "Development"];
  }
  if (key.includes("english") || key.includes("language") || key.includes("lit")) {
    if (grade <= 5) return ["Phonics", "Simple stories", "Nouns & verbs", "Picture comprehension", "Short poems", "Writing sentences"];
    if (grade <= 8) return ["Comprehension", "Tenses", "Prose excerpts", "Poetry forms", "Letter writing", "Grammar"];
    return ["Prose", "Poetry", "Drama", "Essay writing", "Grammar", "Literary analysis"];
  }
  if (key.includes("hindi") || key.includes("regional")) return ["वर्णमाला", "कहानी", "कविता", "व्याकरण", "निबंध", "अनुच्छेद"];
  return ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"];
}

function statsFor(grade, subject) {
  const k = subject.toLowerCase();
  if (grade <= 5) return [["Stories", "24"], ["Activities", "60"], ["Worksheets", "80"]];
  if (k.includes("math")) return [["Concepts", "86"], ["Formulas", grade >= 9 ? "42" : "24"], ["Practice Q", "1,200+"]];
  if (k.includes("science") || k.includes("physics") || k.includes("biology") || k.includes("chemistry"))
    return [["Diagrams", "64"], ["Experiments", "28"], ["Practice Q", "900+"]];
  if (k.includes("social") || k.includes("history"))
    return [["Key dates", "120"], ["Maps", "38"], ["Practice Q", "700+"]];
  if (k.includes("english") || k.includes("language"))
    return [["Prose", "17"], ["Poems", "11"], ["Practice Q", "650+"]];
  if (k.includes("hindi") || k.includes("regional")) return [["कविताएँ", "18"], ["गद्य", "14"], ["अभ्यास", "600+"]];
  return [["Topics", "60"], ["Lessons", "30"], ["Practice Q", "500+"]];
}

function Subjects() {
  const [board, setBoard] = useState("CBSE");
  const [grade, setGrade] = useState(8);
  const subjects = useMemo(() => subjectsFor(board, grade), [board, grade]);
  const [subject, setSubject] = useState(subjects[0]);
  useEffect(() => setSubject(subjects[0]), [board, grade]);
  const gradeMeta = CLASSES.find((c) => c.grade === grade);
  const topics = sampleTopicsFor(grade, subject);

  return (
    <section id="subjects" className="py-24 md:py-32" style={{ background: "#FBFBFD" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionEyebrow>Coverage</SectionEyebrow>
        <div className="flex items-end justify-between flex-wrap gap-6 mt-3">
          <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[900px] text-ink">
            Every class. Every board. One study partner.
          </h2>
          <p className="text-[13px] mono text-ink-3">Classes 1–10 · CBSE · ICSE · IB · State Boards · 10,000+ topics</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {BOARDS.map((b) => {
            const on = b.key === board;
            return (
              <button key={b.key} onClick={() => setBoard(b.key)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-apple-xl border transition-all ${on ? "bg-white shadow-apple-md" : "bg-white/60 hover:bg-white"}`}
                      style={{ borderColor: on ? "transparent" : "rgba(0,0,0,0.08)" }}>
                <div className={`w-8 h-8 rounded-apple flex items-center justify-center text-[11px] mono font-bold ${on ? "bg-ink text-white" : "bg-paper-2 text-ink-2"}`}>
                  {b.key.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className={`text-[13px] font-semibold ${on ? "text-ink" : "text-ink-2"}`}>{b.name}</p>
                  <p className="text-[10px] mono text-ink-3 uppercase">{b.tag} · {b.count}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 overflow-x-auto no-scrollbar -mx-6 px-6">
          <div className="flex gap-2 min-w-max">
            {CLASSES.map((c) => {
              const on = c.grade === grade;
              return (
                <button key={c.grade} onClick={() => setGrade(c.grade)}
                        className={`flex flex-col items-center justify-center w-[68px] h-[68px] rounded-apple-lg border transition-all ${on ? "text-white shadow-apple-md" : "bg-white text-ink-2 hover:bg-paper-2"}`}
                        style={on ? { background: c.color, borderColor: "transparent" } : { borderColor: "rgba(0,0,0,0.08)" }}>
                  <span className="text-[10px] mono uppercase tracking-wider opacity-80">Class</span>
                  <span className="text-[22px] font-bold leading-none mt-0.5">{c.grade}</span>
                  <span className="text-[9px] mono opacity-70 mt-1">{c.stage}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-2">
            {subjects.map((sub) => {
              const on = sub === subject;
              return (
                <button key={sub} onClick={() => setSubject(sub)}
                        className={`w-full text-left p-4 rounded-apple-xl border transition-all flex items-center gap-3 ${on ? "bg-white shadow-apple-md" : "bg-white/50 hover:bg-white"}`}
                        style={{ borderColor: on ? "transparent" : "rgba(0,0,0,0.08)" }}>
                  <div className="w-9 h-9 rounded-apple flex items-center justify-center font-bold text-white text-[12px]"
                       style={{ background: gradeMeta.color }}>
                    {sub[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate text-ink">{sub}</p>
                    <p className="text-[11px] text-ink-3">{board} · Class {grade}</p>
                  </div>
                  {on && <span className="w-1.5 h-1.5 rounded-full" style={{ background: gradeMeta.color }} />}
                </button>
              );
            })}
          </div>

          <div className="md:col-span-7">
            <div className="h-full rounded-apple-2xl border bg-white p-7 shadow-apple" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] mono text-ink-3 uppercase">NOW VIEWING</p>
                <span className="text-[11px] mono px-2 py-0.5 rounded-full"
                      style={{ background: gradeMeta.color + "18", color: gradeMeta.color }}>
                  {board} · Class {grade}
                </span>
              </div>
              <h3 className="text-[28px] font-bold tracking-tight mt-2 text-ink">{subject}</h3>
              <p className="text-[13px] text-ink-3">{gradeMeta.stage} stage</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {topics.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-apple bg-paper-2 border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <span className="mono text-[11px] text-ink-3 w-6">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[13px] text-ink flex-1 truncate">{t}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: gradeMeta.color }} />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {statsFor(grade, subject).map(([l, v]) => (
                  <div key={l} className="p-3 rounded-apple bg-paper-2 border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <p className="text-[11px] mono text-ink-3 uppercase">{l}</p>
                    <p className="text-[22px] font-bold tracking-tight mt-0.5" style={{ color: gradeMeta.color }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Learning Goals ────────────────────────────────────────────────────────────
const GOAL_TABS = [
  { key: "Math",         color: "#FF9500", courses: ["Arithmetic Thinking","Proportional Reasoning","Probability & Chance","Visual Algebra","Solving Equations","Quadratics","Mensuration"] },
  { key: "Science",      color: "#34C759", courses: ["States of Matter","Energy & Motion","Cells & Life","Light and Optics","Chemistry Basics","Human Body","Environment"] },
  { key: "Language",     color: "#AF52DE", courses: ["Phonics","Comprehension","Grammar & Tenses","Poetry","Essay Writing","Hindi व्याकरण","Regional Language"] },
  { key: "Logic",        color: "#007AFF", courses: ["Patterns & Sequences","Logical Puzzles","Coding Thinking","Spatial Reasoning","Data Handling","Problem Strategy"] },
  { key: "Social Studies",color:"#FF2D55", courses: ["Our Neighbourhood","Civics","Indian History","World Geography","Economics","Government"] },
];

function useStep(steps, interval = 900) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((x) => (x + 1) % steps), interval);
    return () => clearInterval(id);
  }, [steps, interval]);
  return s;
}

function LearningGoals() {
  const [tab, setTab] = useState(0);
  const [courseIdx, setCourseIdx] = useState(5);
  const t = GOAL_TABS[tab];
  useEffect(() => setCourseIdx(Math.min(5, t.courses.length - 1)), [tab]);
  const activeCourse = t.courses[courseIdx] || t.courses[0];

  return (
    <section id="goals" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#1D1D1F" }}>
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
           style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-center" style={{ color: "rgba(255,255,255,0.5)" }}>Learning goals</p>
        <h2 className="display text-[44px] md:text-[68px] leading-[1] text-center mt-4 text-white">
          Reach big learning goals.
        </h2>
        <p className="text-[16px] text-center mt-5 max-w-[580px] mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          Pick a goal. We'll pick the next question. Thousands of bite-sized courses — tuned to your child's class and board.
        </p>

        <div className="mt-10 flex items-center justify-center flex-wrap gap-2">
          {GOAL_TABS.map((g, i) => {
            const on = i === tab;
            return (
              <button key={g.key} onClick={() => setTab(i)}
                      className={`text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all ${on ? "bg-white text-ink" : "text-white/70 hover:text-white border border-white/10"}`}
                      style={on ? { boxShadow: "0 0 0 4px rgba(255,255,255,0.1)" } : { background: "rgba(255,255,255,0.05)" }}>
                {g.key}
              </button>
            );
          })}
        </div>

        <div className="mt-12 rounded-apple-2xl p-4 md:p-5 shadow-apple-xl" style={{ background: "#0f0f11", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-5 p-5 md:p-7">
              <p className="text-[15px] font-bold text-white">{t.key} Courses</p>
              <ul className="mt-5 space-y-3.5">
                {t.courses.map((c, i) => {
                  const on = i === courseIdx;
                  return (
                    <li key={c}>
                      <button onClick={() => setCourseIdx(i)} className="group flex items-center gap-3 text-[14px] w-full text-left transition-colors">
                        <span className="w-1 h-1 rounded-full transition-colors" style={{ background: on ? t.color : "rgba(255,255,255,0.3)" }} />
                        <span style={on ? { color: t.color, fontWeight: 600 } : { color: "rgba(255,255,255,0.75)" }}>{c}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="md:col-span-7 rounded-apple-xl bg-white text-ink p-6 md:p-8 min-h-[360px] flex flex-col justify-between">
              <div key={t.key + courseIdx} className="fade-in flex-1 flex flex-col">
                <GoalPreviewSimple color={t.color} course={activeCourse} />
              </div>
              <p className="text-[15px] font-bold text-ink mt-6">{activeCourse}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Link to="/register" className="font-semibold text-[14px] px-6 py-3 rounded-full text-white hover:brightness-110 transition-all"
                style={{ background: "#34C759" }}>
            Get started
          </Link>
          <a href="#subjects" className="text-[13px] font-medium px-5 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
             style={{ color: "rgba(255,255,255,0.7)" }}>
            Browse all courses
          </a>
        </div>
      </div>
    </section>
  );
}

function GoalPreviewSimple({ color, course }) {
  const step = useStep(5, 900);
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-[28px]"
             style={{ background: color + "18" }}>
          {["📐","🔬","📖","🧩","🗺️"][["Math","Science","Language","Logic","Social Studies"].indexOf(course.split(" ")[0])] || "📚"}
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-2 rounded-full mx-auto transition-all duration-700"
                 style={{
                   width: `${[90, 70, 80, 60][i]}%`,
                   background: step > i ? color : color + "22",
                   opacity: step > i ? 1 : 0.4,
                 }} />
          ))}
        </div>
        <p className="text-[13px] mono text-ink-3">{step >= 4 ? "✓ Complete" : `Step ${step + 1} of 5`}</p>
      </div>
    </div>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const [yearly, setYearly] = useState(false);
  const plans = [
    {
      name: "Free", badge: "Start here", priceM: 0, priceY: 0, accent: "#8E8E93",
      features: ["Math subject only", "10 AI explanations / day", "Study planner", "Basic practice", "Streaks & badges"],
      cta: "Start free",
    },
    {
      name: "Pro", badge: "Most popular", priceM: 199, priceY: 1990, accent: "#007AFF", featured: true,
      features: ["All 5 subjects", "100 AI explanations / day", "Voice Tutor (EN + HI)", "Live competition rooms", "Full analytics + prediction", "Doubt chat per question"],
      cta: "Go Pro",
    },
    {
      name: "Premium", badge: "For toppers", priceM: 499, priceY: 4990, accent: "#AF52DE",
      features: ["Everything in Pro", "500 AI explanations / day", "AI-generated practice tests", "Parent/teacher portal", "Priority question review", "Early access features"],
      cta: "Go Premium",
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 border-y" style={{ background: "#F5F5F7", borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <div className="flex items-end justify-between flex-wrap gap-6 mt-3">
          <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[700px] text-ink">
            A price you can say yes to.
          </h2>
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            {["Monthly", "Yearly −17%"].map((label, i) => {
              const on = (i === 1) === yearly;
              return (
                <button key={label} onClick={() => setYearly(i === 1)}
                        className={`text-[12px] font-semibold px-4 py-1.5 rounded-full transition-all ${on ? "bg-ink text-white" : "text-ink-3"}`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const price = yearly ? p.priceY : p.priceM;
            const suffix = yearly ? "/yr" : "/mo";
            return (
              <div key={p.name}
                   className={`relative rounded-apple-2xl p-7 flex flex-col ${p.featured ? "shadow-apple-xl scale-[1.02]" : "bg-white border shadow-apple"}`}
                   style={p.featured ? { background: "#1D1D1F", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } : { borderColor: "rgba(0,0,0,0.08)" }}>
                <div className="flex items-center justify-between">
                  <p className={`text-[12px] mono uppercase ${p.featured ? "text-white/60" : "text-ink-3"}`}>{p.name}</p>
                  {p.featured && <span className="text-[10px] mono px-2 py-0.5 rounded-full text-white" style={{ background: "#007AFF" }}>POPULAR</span>}
                </div>
                <div className="mt-4">
                  <span className={`text-[12px] ${p.featured ? "text-white/60" : "text-ink-3"}`}>₹</span>
                  <span className="text-[56px] font-bold tracking-tight leading-none" style={{ color: p.featured ? "#fff" : p.accent }}>{price}</span>
                  <span className={`text-[14px] ml-1 ${p.featured ? "text-white/60" : "text-ink-3"}`}>{suffix}</span>
                </div>
                <p className={`text-[13px] mt-1 ${p.featured ? "text-white/70" : "text-ink-3"}`}>{p.badge}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-[13px] ${p.featured ? "text-white/90" : "text-ink-2"}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 shrink-0">
                        <circle cx="7" cy="7" r="7" fill={p.accent} />
                        <path d="M4 7.5L6 9.5L10 5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                      className={`mt-7 py-3 rounded-full font-semibold text-[14px] text-center block transition-all hover:brightness-105 ${p.featured ? "bg-white text-ink hover:bg-white/90" : "text-white"}`}
                      style={!p.featured ? { background: p.accent } : {}}>
                  {p.cta}
                </Link>
                <p className={`text-[11px] mono text-center mt-3 ${p.featured ? "text-white/50" : "text-ink-3"}`}>
                  {p.name === "Free" ? "No card needed" : "Cancel anytime · via Razorpay"}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-center text-[12px] text-ink-3 mt-10">
          All plans include offline access · 30-day money-back guarantee · GST extra where applicable.
        </p>
      </div>
    </section>
  );
}

// ── Parents ───────────────────────────────────────────────────────────────────
function Parents() {
  return (
    <section id="parents" className="py-24 md:py-32" style={{ background: "#FBFBFD" }}>
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5">
          <SectionEyebrow>For parents &amp; teachers</SectionEyebrow>
          <h2 className="display text-[40px] md:text-[56px] leading-[1] mt-3 text-ink">
            Watch the work, not the screen.
          </h2>
          <p className="text-[16px] text-ink-2 mt-5 leading-relaxed">
            Your child generates an 8-character invite code. You link once, then see accuracy, streaks, weak topics, and badges — read-only, no nudging over the shoulder.
          </p>
          <ul className="mt-6 space-y-2 text-[14px] text-ink-2">
            {["Weekly digest in your inbox", "Link multiple children from one account", "Teacher dashboard for up to 40 students", "Never shows your child's private chats or notes"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-ink-2" />{x}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-7">
          <div className="relative rounded-apple-2xl border bg-white shadow-apple-lg p-7" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] mono text-ink-3">PARENT VIEW · Aarav, Class 6</p>
              <span className="text-[11px] mono px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green">ACTIVE TODAY</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[["Accuracy", "76%", "#007AFF"], ["Streak", "27d", "#FF9500"], ["Predicted", "A1", "#AF52DE"]].map(([l, v, c]) => (
                <div key={l} className="p-4 rounded-apple-lg bg-paper-2 border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <p className="text-[11px] mono text-ink-3 uppercase">{l}</p>
                  <p className="text-[28px] font-bold tracking-tight mt-1" style={{ color: c }}>{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-[11px] mono text-ink-3 uppercase mb-2">Weekly practice</p>
              <div className="flex items-end gap-2 h-20">
                {[3, 5, 4, 6, 7, 5, 8].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bar-grow" style={{ height: `${h * 10}%`, background: "#007AFF88", animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[["Weak", "Trigonometry", "#FF3B30"], ["Mastered", "Linear Eq.", "#34C759"]].map(([l, v, c]) => (
                <div key={l} className="p-3 rounded-apple border bg-paper-2" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <p className="text-[10px] mono uppercase" style={{ color: c }}>{l}</p>
                  <p className="text-[14px] font-semibold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  const t = [
    { q: "It caught my son guessing in Class 4 maths. Two weeks later he's actually reasoning — not memorising.", a: "Neha · Parent of Class 4, CBSE, Mumbai" },
    { q: "The voice tutor in Hindi works flawlessly. My daughter asks questions the way she speaks, not the way a form demands.", a: "Sunita · Parent of Class 7, State Board, Jaipur" },
    { q: "I teach IB MYP across Grades 6–10. First tool that doesn't drown me in vanity metrics.", a: "Mr. Ranjan · Coordinator, IB School, Bengaluru" },
  ];
  return (
    <section id="testimonials" className="py-24 border-y" style={{ background: "#F5F5F7", borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionEyebrow>From students &amp; parents</SectionEyebrow>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {t.map((x, i) => (
            <div key={i} className="bg-white rounded-apple-2xl p-7 border shadow-apple" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <svg width="24" height="18" viewBox="0 0 24 18" className="text-apple-blue mb-4">
                <path fill="currentColor" d="M0 18V9q0-4 2.5-6.5T9 0v3Q6 3 4.5 4.5T3 9h3v9Zm15 0V9q0-4 2.5-6.5T24 0v3q-3 0-4.5 1.5T18 9h3v9Z" />
              </svg>
              <p className="text-[16px] leading-snug text-ink">"{x.q}"</p>
              <p className="text-[12px] mono text-ink-3 mt-5">{x.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const qs = [
    ["Which classes and boards do you cover?", "Class 1 through Class 10, across CBSE, ICSE/ISC, IB (PYP and MYP), and every major Indian state board. Syllabi are matched chapter-by-chapter to the board your child's school follows."],
    ["How does the AI actually help?", "Every wrong answer is classified (guessing, concept gap, calculation slip, misinterpretation). We then route a free static explanation, a cached response, or — only if genuinely novel — a fresh Claude AI call. You get instant, specific feedback."],
    ["Can parents see my private work?", "No. Parents see aggregate metrics — accuracy, streak, weak topics, badges. They do not see your doubt chats, notes, or individual answers."],
    ["What's the difference between Pro and Premium?", "Pro gives you 100 AI calls/day and all 5 subjects. Premium gives 500/day, AI-generated practice tests, and the parent/teacher portal."],
    ["Does it work offline?", "Today's plan, current lesson, and queued attempts work offline. Changes sync when you're back online."],
    ["Is there a free tier forever?", "Yes. Free covers Math, the planner, streaks, and 10 AI calls/day — enough to commit to a habit before paying."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 md:py-32" style={{ background: "#FBFBFD" }}>
      <div className="max-w-[880px] mx-auto px-6">
        <SectionEyebrow>Questions</SectionEyebrow>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] mt-3 text-ink">The small print, without the print.</h2>
        <div className="mt-10 divide-y" style={{ borderTop: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          {qs.map(([q, a], i) => {
            const on = open === i;
            return (
              <button key={q} onClick={() => setOpen(on ? -1 : i)}
                      className="w-full text-left py-5 flex items-start gap-5"
                      style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <span className="mono text-[12px] text-ink-3 pt-1 w-8">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <p className="text-[17px] font-semibold text-ink">{q}</p>
                  {on && <p className="text-[14px] text-ink-2 leading-relaxed mt-2 fade-in">{a}</p>}
                </div>
                <span className="mono text-[18px] text-ink-3 pt-0.5">{on ? "−" : "+"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="cta" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#FBFBFD" }}>
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="max-w-[880px] mx-auto px-6 text-center relative">
        <div className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.2em] text-ink-3 bg-white border rounded-full px-3 py-1"
             style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          From Class 1 to Class 10 · every major board
        </div>
        <h2 className="display text-[48px] md:text-[80px] leading-[0.95] mt-6 text-ink">
          Stop revising. <br /><span className="gradient-text">Start thinking.</span>
        </h2>
        <p className="text-[17px] text-ink-2 mt-6 max-w-[560px] mx-auto">
          Sign up in 30 seconds. No card. 10 minutes and you'll know where you actually stand.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/register"
                className="font-semibold text-[15px] px-7 py-4 rounded-full text-white shadow-apple-md hover:brightness-105 hover:-translate-y-0.5 transition-all"
                style={{ background: ACCENT }}>
            Start free diagnostic →
          </Link>
          <a href="#pricing" className="text-[14px] font-medium text-ink px-6 py-4 rounded-full border bg-white hover:bg-paper-2 transition-colors"
             style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            See pricing
          </a>
        </div>
        <p className="text-[12px] mono text-ink-3 mt-6">48,203 students practising this week</p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    ["Product",   ["Features", "Subjects", "Voice Tutor", "Live Rooms", "Planner", "Pricing"]],
    ["For you",   ["Students", "Parents", "Teachers", "Coaching centres", "Schools"]],
    ["Company",   ["About", "Careers", "Press", "Contact"]],
    ["Resources", ["Syllabus library", "PYQ archive", "Blog", "Status"]],
  ];
  return (
    <footer className="border-t pt-20 pb-10" style={{ background: "#FBFBFD", borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold text-[15px] text-ink">AILearn</span>
            </div>
            <p className="text-[13px] text-ink-2 mt-4 max-w-[320px] leading-relaxed">
              A study partner built for how your child actually thinks. Class 1 to 10, CBSE · ICSE · IB · State Boards.
            </p>
            <p className="text-[11px] mono text-ink-3 mt-5">Made in India · 🇮🇳</p>
          </div>
          {cols.map(([h, items]) => (
            <div key={h} className="md:col-span-2">
              <p className="text-[11px] mono uppercase text-ink-3 tracking-wider">{h}</p>
              <ul className="mt-4 space-y-2.5">
                {items.map((x) => (
                  <li key={x}><a href="#" className="text-[13px] text-ink-2 hover:text-ink transition-colors">{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-6 flex items-center justify-between flex-wrap gap-3 text-[12px] text-ink-3"
             style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <p>© 2026 AILearn Pvt. Ltd.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Refund policy", "Responsible AI"].map((x) => (
              <a key={x} href="#" className="hover:text-ink transition-colors">{x}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Sticky CTA ────────────────────────────────────────────────────────────────
function StickyCta() {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const h = () => setSeen(window.scrollY > 800);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!seen) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full shadow-apple-xl px-2 py-2 flex items-center gap-3 fade-in"
         style={{ background: "#1D1D1F" }}>
      <span className="text-[12px] pl-3 text-white">Ready to think sharper?</span>
      <Link to="/register" className="text-[12px] font-semibold px-4 py-1.5 rounded-full text-white transition-all hover:brightness-110"
            style={{ background: ACCENT }}>
        Start free →
      </Link>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="scroll-smooth" style={{ background: "#FBFBFD", color: "#1D1D1F" }}>
      <TopBar />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Subjects />
      <LearningGoals />
      <Pricing />
      <Parents />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyCta />
    </div>
  );
}
