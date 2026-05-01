import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ACCENT = "#AF52DE";

/* ============================================================ LOGO */
function Logo({ size = 28 }) {
  return (
    <span className="inline-block rounded-[9px] overflow-hidden shrink-0"
          style={{ width: size, height: size, background: "linear-gradient(135deg,#9D50BB,#3A1C71)" }}
          aria-label="Stellar">
      <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="logo-glow" x="80" y="80" width="360" height="320" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
        </defs>
        <g filter="url(#logo-glow)">
          <path d="M310 255 L350 310" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" className="logo-line logo-line-a" />
          <path d="M310 255 L260 320" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" className="logo-line logo-line-b" />
          <path d="M190 190 L310 255" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" className="logo-line logo-line-c" />
          <circle cx="310" cy="255" r="18" fill="white" className="logo-star logo-star-1" />
          <circle cx="350" cy="310" r="18" fill="white" className="logo-star logo-star-2" />
          <circle cx="260" cy="320" r="18" fill="white" className="logo-star logo-star-3" />
          <path d="M190 155 C190 175 175 190 155 190 C175 190 190 205 190 225 C190 205 205 190 225 190 C205 190 190 175 190 155Z"
                fill="white" className="logo-sparkle" />
        </g>
      </svg>
    </span>
  );
}

/* ============================================================ TOPBAR */
function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [["Demo","#tour"],["Features","#features"],["How it works","#how"],["Goals","#goals"],["Pricing","#pricing"],["FAQ","#faq"]];
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "backdrop-blur-xl bg-paper/75 border-b hairline" : ""}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo size={40} />
          <span className="font-semibold tracking-tight text-[20px]">Stellar</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-ink-2">
          {links.map(([l, h]) => <a key={l} href={h} className="hover:text-ink transition-colors">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex text-[13px] text-ink-2 hover:text-ink px-3 py-1.5">Sign in</Link>
          <Link to="/start" className="btn-primary text-[13px] font-semibold px-4 py-2 rounded-full">Start free</Link>
        </div>
      </div>
    </header>
  );
}

/* ============================================================ HERO */
const PROFILES = [
  { key: "Deep Thinker",       color: "#34C759", blurb: "Methodical, slow, high accuracy.", stat: "+28% retention" },
  { key: "Pattern Recognizer", color: "#007AFF", blurb: "Sees structure fast.",              stat: "92% on analogies" },
  { key: "Surface Learner",    color: "#FF9500", blurb: "Memorises, skips reasoning.",       stat: "Risk flagged" },
  { key: "Overthinker",        color: "#AF52DE", blurb: "Knows it — doubts it.",             stat: "+40% confidence" },
  { key: "Guesser",            color: "#FF3B30", blurb: "Fast + wrong pattern.",             stat: "Auto-corrected" },
];

function TrustMetric({ n, l }) {
  return (
    <div>
      <p className="text-[18px] font-bold text-ink tracking-tight">{n}</p>
      <p className="text-[11px] mono uppercase">{l}</p>
    </div>
  );
}

function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PROFILES.length), 2400);
    return () => clearInterval(t);
  }, []);
  const p = PROFILES[idx];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-60 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-40 pointer-events-none"
           style={{ background: "radial-gradient(closest-side, #007AFF55, transparent)" }} />
      <div className="absolute top-40 -left-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-30 pointer-events-none"
           style={{ background: "radial-gradient(closest-side, #AF52DE55, transparent)" }} />
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-12 gap-10 items-center relative">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 text-[12px] mono text-ink-3 bg-white/80 backdrop-blur border hairline rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-green pulse-ring relative" />
            Every child is a unique star
          </div>
          <h1 className="display text-[44px] md:text-[64px] leading-[0.98] mt-5 tracking-tight">
            Every child is a star. <span className="landing-gradient-text">We build the sky around them.</span>
          </h1>
          <p className="text-[18px] md:text-[20px] text-ink-2 mt-6 max-w-[560px] leading-relaxed">
            No two stars shine the same — and no two children learn the same. So why do they all sit through the same class, at the same speed, on the same page?
            <br /><br />
            Stellar reads <em>how</em> your child thinks, then builds a study path just for them. From Class 1 to Class 10, across every major board.
          </p>
          <div className="mt-8 flex items-center gap-6 text-[12px] text-ink-3">
            <TrustMetric n="0" l="students practising" />
            <div className="w-px h-8 bg-ink-3/20" />
            <TrustMetric n="0" l="AI hints served" />
            <div className="w-px h-8 bg-ink-3/20" />
            <TrustMetric n="—" l="avg predicted grade" />
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] blur-2xl opacity-60"
                 style={{ background: `radial-gradient(closest-side, ${p.color}33, transparent)` }} />
            <div className="relative bg-white rounded-apple-2xl shadow-apple-xl border hairline p-6 floaty">
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
              <div className="mt-5 p-4 rounded-apple-lg bg-paper-2 border hairline">
                <p className="text-[11px] mono text-ink-3">Q · Quadratic equations</p>
                <p className="text-[14px] text-ink mt-1 leading-snug">If x² − 5x + 6 = 0, which is a root?</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[["A","x = 1","concept_error"],["B","x = 2","correct"],["C","x = 4","calculation_error"],["D","x = 5","guessing"]].map(([k, t, type]) => (
                    <div key={k} className={`text-[12px] px-3 py-2 rounded-apple border transition-all ${type === "correct" ? "bg-apple-green/8 border-apple-green/30 text-apple-green" : "bg-white hairline text-ink-2"}`}>
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
            <div className="absolute -bottom-6 -left-6 bg-white rounded-apple-lg border hairline shadow-apple-md px-3 py-2.5 hidden sm:flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-[11px] mono text-ink-3">STREAK</p>
                <p className="text-[13px] font-semibold">27 days</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-3 bg-white rounded-apple-lg border hairline shadow-apple-md px-3 py-2">
              <p className="text-[10px] mono text-ink-3">PREDICTED</p>
              <p className="text-[16px] font-bold landing-gradient-text">Grade A1</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ MANIFESTO */
const STARS_DATA = [
  { id: 0, name: "Aarav", trait: "Quick",      color: "#FFD166", x: 14, y: 32, r: 6 },
  { id: 1, name: "Diya",  trait: "Methodical", color: "#7CC4FF", x: 30, y: 18, r: 4.5 },
  { id: 2, name: "Kabir", trait: "Pattern",    color: "#C8A0FF", x: 50, y: 40, r: 8 },
  { id: 3, name: "Meera", trait: "Visual",     color: "#77DDA0", x: 68, y: 22, r: 5.5 },
  { id: 4, name: "Rohan", trait: "Slow-burn",  color: "#FF9E7A", x: 82, y: 48, r: 5 },
  { id: 5, name: "Aisha", trait: "Asks why",   color: "#FFA8D9", x: 40, y: 68, r: 4.5 },
  { id: 6, name: "Arjun", trait: "Overthinks", color: "#9FE6E6", x: 72, y: 74, r: 5.5 },
];
const STAR_EDGES = { 0:[[0,1],[0,2],[1,3]], 1:[[1,0],[1,2],[1,3]], 2:[[2,0],[2,1],[2,3],[2,5],[2,6]], 3:[[3,1],[3,2],[3,4]], 4:[[4,2],[4,3],[4,6]], 5:[[5,2],[5,0],[5,6]], 6:[[6,2],[6,4],[6,5]] };

function Manifesto() {
  const [active, setActive] = useState(2);
  const a = STARS_DATA[active];
  const edges = STAR_EDGES[active];
  return (
    <section id="unique" className="relative py-24 md:py-32 bg-ink text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.35] pointer-events-none"
           style={{ backgroundImage: "radial-gradient(1px 1px at 12% 18%, #fff 40%, transparent 41%),radial-gradient(1px 1px at 72% 82%, #fff 40%, transparent 41%),radial-gradient(1.5px 1.5px at 84% 12%, #fff 40%, transparent 41%),radial-gradient(1px 1px at 22% 64%, #fff 40%, transparent 41%),radial-gradient(1px 1px at 48% 28%, #fff 40%, transparent 41%),radial-gradient(1px 1px at 92% 54%, #fff 40%, transparent 41%),radial-gradient(1px 1px at 36% 90%, #fff 40%, transparent 41%),radial-gradient(1px 1px at 60% 46%, #fff 40%, transparent 41%)" }} />
      <div className="absolute -left-40 top-20 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: "radial-gradient(closest-side, #AF52DE, transparent)" }} />
      <div className="absolute -right-40 bottom-0 w-[480px] h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(closest-side, #007AFF, transparent)" }} />
      <div className="max-w-[1200px] mx-auto px-6 relative grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5">
          <p className="text-[11px] mono uppercase tracking-[0.2em] text-white/50">The Stellar way</p>
          <h2 className="display text-[38px] md:text-[52px] leading-[1.02] mt-3 tracking-tight">
            Every child is a <span style={{ color: a.color }}>unique&nbsp;star.</span>
          </h2>
          <p className="text-[16px] md:text-[18px] text-white/70 mt-5 leading-relaxed max-w-[460px]">
            Some burn bright and fast. Some shine slow and steady. Some see patterns. Some ask <em>why</em>.
          </p>
          <p className="text-[16px] md:text-[18px] text-white/70 mt-4 leading-relaxed max-w-[460px]">
            And yet — 40 of them sit in one room, at one speed, on one page. The ones ahead get bored. The ones behind get left behind.
          </p>
          <p className="text-[16px] md:text-[18px] text-white mt-4 leading-relaxed max-w-[460px] font-medium">
            Stellar treats each child like the unique star they are — one study path, shaped around how they actually learn.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {STARS_DATA.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`text-[12px] px-3 py-1.5 rounded-full border transition ${active === s.id ? "bg-white text-ink border-white" : "border-white/20 text-white/70 hover:text-white hover:border-white/40"}`}>
                <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: s.color }} />
                {s.name} <span className="opacity-60">· {s.trait}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <g stroke="rgba(255,255,255,0.05)" strokeWidth="0.15">
                {[...Array(9)].map((_,i) => <line key={`v${i}`} x1={(i+1)*10} y1="0" x2={(i+1)*10} y2="100" />)}
                {[...Array(9)].map((_,i) => <line key={`h${i}`} x1="0" y1={(i+1)*10} x2="100" y2={(i+1)*10} />)}
              </g>
              {edges.map(([i, j], k) => {
                const s1 = STARS_DATA[i], s2 = STARS_DATA[j];
                return <line key={k} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke={a.color} strokeOpacity="0.5" strokeWidth="0.25" style={{ transition: "all .5s ease" }} />;
              })}
              {STARS_DATA.map(s => {
                const isActive = s.id === active;
                return (
                  <g key={s.id} style={{ cursor: "pointer", transition: "all .4s ease" }} onClick={() => setActive(s.id)}>
                    <circle cx={s.x} cy={s.y} r={isActive ? s.r * 2.2 : s.r * 1.3} fill={s.color} opacity={isActive ? 0.22 : 0.1} style={{ transition: "all .4s ease" }} />
                    <circle cx={s.x} cy={s.y} r={isActive ? s.r * 0.55 : s.r * 0.35} fill={s.color} style={{ transition: "all .4s ease" }} />
                    <text x={s.x} y={s.y + s.r * 1.2 + 3} fontSize="2.2" fill={isActive ? "#fff" : "rgba(255,255,255,0.5)"} textAnchor="middle" style={{ transition: "all .4s ease", fontFamily: "ui-sans-serif, system-ui" }}>{s.name}</text>
                  </g>
                );
              })}
            </svg>
            <div key={active} className="absolute bottom-5 left-5 right-5 md:left-6 md:right-auto md:max-w-[320px] rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 p-4 caption-fade">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 12px ${a.color}` }} />
                <p className="text-[11px] mono uppercase tracking-[0.2em] text-white/60">{a.name}'s Sky</p>
              </div>
              <p className="text-[15px] mt-2 leading-snug text-white">
                {a.trait} learner — Stellar re-shapes the constellation around {a.name}'s way of thinking. Different path. Same destination.
              </p>
            </div>
          </div>
          <p className="text-[12px] mono text-white/40 mt-3 text-center md:text-left">Click any star to see how their study path re-maps.</p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ FEATURES */
function SectionEyebrow({ children }) {
  return <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">{children}</p>;
}
function BentoCard({ children, span, height, accent }) {
  return (
    <div className={`${span} ${height || ""} relative rounded-apple-2xl bg-white border hairline shadow-apple overflow-hidden group`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
           style={{ background: `radial-gradient(400px circle at 30% 0%, ${accent}10, transparent 60%)` }} />
      <div className="relative h-full flex flex-col p-5 md:p-7">{children}</div>
    </div>
  );
}
function CardHeader({ tag, title, body }) {
  return (
    <div>
      <p className="text-[11px] mono uppercase text-ink-3 tracking-[0.18em]">{tag}</p>
      <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight mt-2 leading-tight">{title}</h3>
      <p className="text-[14px] text-ink-2 mt-2 leading-relaxed max-w-[420px]">{body}</p>
    </div>
  );
}

const PROFILE_LABELS = ["Deep Thinker","Pattern Rec.","Surface","Overthinker","Guesser"];
function pentPoint(cx, cy, r, i) {
  const a = -Math.PI/2 + (i*2*Math.PI)/5;
  return { x: cx + r*Math.cos(a), y: cy + r*Math.sin(a) };
}
function pentPoints(cx, cy, r) {
  return [...Array(5)].map((_, i) => { const { x, y } = pentPoint(cx, cy, r, i); return `${x},${y}`; }).join(" ");
}

function AdaptiveViz() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(s => (s + 1) % 4), 1200); return () => clearInterval(t); }, []);
  const rows = [{ t:"Linear eq.", d:0.32, correct:true },{ t:"Polynomials", d:0.55, correct:false },{ t:"Quadratic roots", d:0.74, correct:true },{ t:"Coord. geometry", d:0.68, correct:true }];
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="space-y-2.5">
        {rows.map((r, i) => {
          const active = i <= step;
          return (
            <div key={r.t} className={`flex items-center gap-3 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
              <span className={`text-[12px] w-36 truncate ${active ? "text-ink" : "text-ink-3"}`}>{r.t}</span>
              <div className="flex-1 h-2 rounded-full bg-apple-gray6 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: active ? `${r.d * 100}%` : "4%", background: r.correct ? "#34C759" : "#FF9500" }} />
              </div>
              <span className="text-[11px] mono text-ink-3 w-8 text-right">{Math.round(r.d*100)}%</span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] mono text-ink-3 mt-4">target difficulty → <span className="text-apple-blue">0.74</span></p>
    </div>
  );
}

function ProfileViz() {
  return (
    <div className="mt-auto pt-6 flex-1 flex items-end justify-center">
      <svg viewBox="0 0 260 200" className="w-full max-w-[280px]">
        <defs>
          <radialGradient id="pg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#AF52DE" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#AF52DE" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {[30,55,80].map((r, i) => <polygon key={i} fill="none" stroke="#00000010" strokeWidth="1" points={pentPoints(130, 100, r)} />)}
        <polygon fill="url(#pg)" stroke="#AF52DE" strokeWidth="2" points={`${130},${100-75} ${130+60},${100-20} ${130+45},${100+55} ${130-50},${100+40} ${130-68},${100-10}`} />
        {PROFILE_LABELS.map((l, i) => {
          const { x, y } = pentPoint(130, 100, 95, i);
          return <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="mono" fontSize="9" fill="#6E6E73">{l}</text>;
        })}
      </svg>
    </div>
  );
}

function RevisionViz() {
  const days = [1,3,7,15,30];
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="flex items-end gap-2 h-24">
        {days.map((d, i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="bar-grow w-full rounded-t-md" style={{ height:`${20+i*18}%`, background:"#34C75988", animationDelay:`${i*120}ms` }} />
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
  useEffect(() => { const t = setInterval(() => setBars(Array.from({length:14}, () => 0.2 + Math.random() * 0.8)), 140); return () => clearInterval(t); }, []);
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-apple-orange flex items-center justify-center shadow-apple">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 10a7 7 0 0 1-14 0h2a5 5 0 0 0 10 0h2zM11 19h2v3h-2z"/></svg>
        </div>
        <div className="flex items-center gap-[3px] h-10 flex-1">
          {bars.map((b, i) => <div key={i} className="flex-1 rounded-full transition-[height] duration-150" style={{ height:`${b*100}%`, background:"#FF9500" }} />)}
        </div>
      </div>
      <p className="text-[12px] text-ink-2 mt-3 leading-snug"><span className="mono text-ink-3">EN·</span> "Explain Thevenin's theorem simply"</p>
      <p className="text-[12px] text-ink-2 leading-snug"><span className="mono text-ink-3">HI·</span> "प्रकाश संश्लेषण क्या है?"</p>
    </div>
  );
}

function LiveRoomViz() {
  const players = [{ name:"Aarav", score:84, me:false },{ name:"You", score:92, me:true },{ name:"Priya", score:78, me:false },{ name:"Kabir", score:61, me:false }].sort((a,b) => b.score - a.score);
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="space-y-1.5">
        {players.map((p, i) => (
          <div key={p.name} className={`flex items-center gap-3 px-3 py-2 rounded-apple ${p.me ? "bg-apple-pink/8 ring-1 ring-apple-pink/30" : "bg-paper-2"}`}>
            <span className="mono text-[11px] w-4 text-ink-3">#{i+1}</span>
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
  const grades = [["A1",92,true],["A2",88,false],["B1",80,false],["B2",72,false],["C1",64,false],["C2",56,false],["D",40,false],["E",0,false]];
  return (
    <div className="mt-auto pt-6 flex-1 flex items-center gap-6 justify-between">
      <div className="flex flex-col gap-1 min-w-[100px]">
        <p className="text-[11px] mono text-ink-3">predicted</p>
        <p className="text-[58px] font-bold leading-none landing-gradient-text">A1</p>
        <p className="text-[12px] mono text-ink-3">78–86 / 80</p>
      </div>
      <div className="flex-1 grid grid-cols-8 gap-1.5 items-end h-32">
        {grades.map(([g, h, active]) => (
          <div key={g} className="flex flex-col items-center gap-1.5">
            <div className="w-full rounded-t-sm transition-all" style={{ height:`${h}%`, background: active ? "#5856D6" : "#D1D1D622" }} />
            <span className={`text-[10px] mono ${active ? "text-apple-indigo font-semibold" : "text-ink-3"}`}>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlannerViz() {
  const days = ["M","T","W","T","F","S","S"];
  const loads = [3,5,2,4,6,1,2];
  return (
    <div className="mt-auto pt-6 flex-1 flex flex-col justify-end">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] mono text-ink-3">{d}</span>
            <div className="w-full rounded-md bar-grow" style={{ height:`${loads[i]*10+10}px`, background: i===4 ? "#5AC8FA" : "#5AC8FA55", animationDelay:`${i*80}ms` }} />
          </div>
        ))}
      </div>
      <p className="text-[11px] mono text-ink-3 mt-3">today · 3 topics · 2h 10m</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionEyebrow>The system</SectionEyebrow>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[800px] mt-3">
          Six engines, one student.<br/><span className="text-ink-3">Everything listens, everything adapts.</span>
        </h2>
        <div className="mt-14 grid grid-cols-12 gap-4">
          <BentoCard span="col-span-12 md:col-span-7" height="md:h-[420px]" accent="#007AFF">
            <CardHeader tag="ADAPTIVE ENGINE" title="Questions that meet your mind." body="Our adaptive router picks the next question based on target difficulty, recent errors, and topic decay — 0 duplicates, ever."/>
            <AdaptiveViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-5" height="md:h-[420px]" accent="#AF52DE">
            <CardHeader tag="THINKING PROFILE" title="It's not WHAT you got wrong." body="We classify every mistake — guessing, concept gap, calculation slip, misinterpretation — and tune the next 5 questions to the pattern."/>
            <ProfileViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[360px]" accent="#34C759">
            <CardHeader tag="SPACED REVISION" title="Never forget what you've learned." body="Built on [1, 3, 7, 15, 30]-day intervals per topic. We tell you exactly when to revise."/>
            <RevisionViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[360px]" accent="#FF9500">
            <CardHeader tag="VOICE TUTOR" title="Ask aloud. In Hindi, too." body="Tap the mic, ask anything — subject-aware Claude answers with TTS. हिंदी में भी।"/>
            <VoiceViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[360px]" accent="#FF2D55">
            <CardHeader tag="LIVE ROOMS" title="Compete in real time." body="Challenge friends to a live quiz. Socket-powered, ranked, leaderboarded."/>
            <LiveRoomViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-8" height="md:h-[340px]" accent="#5856D6">
            <CardHeader tag="EXAM PREDICTION" title="We forecast your board grade." body="Weighted by chapter marks × historical exam frequency, we predict your CBSE grade — A1 through E — and show you the path to move up."/>
            <PredictionViz />
          </BentoCard>
          <BentoCard span="col-span-12 md:col-span-4" height="md:h-[340px]" accent="#5AC8FA">
            <CardHeader tag="SMART PLANNER" title="A daily plan that knows the date." body="Goal-aware — pass, distinction, top-ranker or scholarship — it re-weights priorities every night."/>
            <PlannerViz />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ HOW IT WORKS */
function HowItWorks() {
  const steps = [
    { n:"01", t:"Pick your class & board",   d:"Class 1 to 10 · CBSE, ICSE, IB PYP/MYP, or your state board. We match the syllabus exactly.", a:"#007AFF" },
    { n:"02", t:"Take a 10-min diagnostic",  d:"Age-appropriate mixed questions. We measure speed, accuracy, and confidence at once.", a:"#AF52DE" },
    { n:"03", t:"Get your thinking profile", d:"One of five — Deep Thinker, Pattern Recognizer, Surface Learner, Overthinker, Guesser.", a:"#34C759" },
    { n:"04", t:"Practise & see progress",   d:"Adaptive questions, AI explanations, predicted grade — updated live as your child practises.", a:"#FF9500" },
  ];
  return (
    <section id="how" className="py-24 md:py-32 bg-paper-2 border-y hairline">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">The loop</p>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[800px] mt-3">Built as a loop, not a feed.</h2>
        <p className="text-[16px] text-ink-2 mt-5 max-w-[620px]">Every answer re-shapes the next question, the next lesson, and tonight's plan. No scroll, no dead ends.</p>
        <div className="mt-14 grid md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative bg-white rounded-apple-2xl border hairline p-6 shadow-apple overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: s.a }} />
              <p className="mono text-[40px] font-bold tracking-tight" style={{ color: s.a }}>{s.n}</p>
              <h3 className="text-[17px] font-semibold mt-3 leading-tight">{s.t}</h3>
              <p className="text-[13px] text-ink-2 mt-2 leading-relaxed">{s.d}</p>
              {i < steps.length - 1 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-ink-3/20 z-10" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ PRODUCT TOUR */
const TOUR_SCENES = [
  { t:0,     dur:5.55,  key:"sky",       eyebrow:"Prologue — Stars",   title:"Every child is a unique star.",         sub:"No two learn the same way" },
  { t:5.55,  dur:6.45,  key:"classroom", eyebrow:"Prologue — Problem", title:"40 stars. One class. One speed.",       sub:"Bored. Lost. Drifting." },
  { t:12,    dur:5.35,  key:"reshape",   eyebrow:"Prologue — Answer",  title:"Stellar shapes a sky around each child.", sub:"Their pace. Their path." },
  { t:17.35, dur:5.2,   key:"promise",   eyebrow:"Prologue — Promise", title:"No star left dim.",                     sub:"No child left behind" },
  { t:22.55, dur:3.45,  key:"signin",    eyebrow:"Step 01 — Open",     title:"Your child opens the app",              sub:"Grade 5 · CBSE · Aarav" },
  { t:26,    dur:7.8,   key:"teach",     eyebrow:"Step 02 — Teach",    title:"A short animated lesson.",              sub:"Not a wall of text" },
  { t:33.8,  dur:4.05,  key:"question",  eyebrow:"Step 03 — Test",     title:"One question at a time.",               sub:"No overwhelm" },
  { t:37.85, dur:4.95,  key:"guess",     eyebrow:"Step 04 — Read",     title:"The AI reads behaviour.",               sub:"Guess · concept gap · slip" },
  { t:42.8,  dur:7.05,  key:"simpler",   eyebrow:"Step 05 — Adapt",    title:"If he's stuck, go smaller.",            sub:"Break it into tinier steps" },
  { t:49.85, dur:6.15,  key:"retest",    eyebrow:"Step 06 — Re-test",  title:"Master the smaller step.",              sub:"Before moving on" },
  { t:56,    dur:6.4,   key:"levelup",   eyebrow:"Step 07 — Level up", title:"Crushing it? We push harder.",          sub:"Deeper concepts, faster" },
  { t:62.4,  dur:5.75,  key:"voice",     eyebrow:"Step 08 — Ask",      title:"Stuck? Ask the voice tutor.",           sub:"English · हिंदी" },
  { t:68.15, dur:6.98,  key:"parent",    eyebrow:"Step 09 — Parents",  title:"Parents see real progress.",            sub:"Private. Aggregate. Honest." },
  { t:75.13, dur:8.87,  key:"cta",       eyebrow:"For parents",        title:"Give your child their own sky.",        sub:"Join Stellar today" },
];
const TOUR_BASE_DURATION = 84;

const easeOutCubic = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
const easeInOutCubic = x => { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2; };
const tourPhase = p => {
  const intro = Math.min(1, p / 0.18);
  const outro = p > 0.82 ? Math.min(1, (p - 0.82) / 0.18) : 0;
  const hold  = Math.max(0, Math.min(1, (p - 0.18) / 0.64));
  return { intro, hold, outro };
};
const reveal = (p, start, end = start + 0.18) => {
  const k = Math.max(0, Math.min(1, (p - start) / (end - start)));
  return { opacity: k, transform: `translateY(${(1-k)*10}px)`, transition: "opacity .2s" };
};

function useAmbientMusic(enabled, duckedLevel) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) {
      if (ref.current) {
        const { ctx, master } = ref.current;
        try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4); } catch(e){}
        const saved = ref.current;
        setTimeout(() => { try { saved.stop(); } catch(e){} try { saved.ctx.close(); } catch(e){} }, 500);
        ref.current = null;
      }
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    ctx.resume().catch(() => {});
    const master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200; lp.Q.value = 0.3;
    master.connect(lp).connect(ctx.destination);
    const delay = ctx.createDelay(1.2); delay.delayTime.value = 0.42;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    const wet = ctx.createGain(); wet.gain.value = 0.45;
    delay.connect(fb).connect(delay); delay.connect(wet).connect(master);
    const c1 = [220.0, 277.18, 329.63, 440.0];
    const c2 = [246.94, 293.66, 369.99, 440.0];
    const voices = c1.map(f => {
      const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = "triangle"; o2.frequency.value = f * 1.005;
      const g = ctx.createGain(); g.gain.value = 0.05;
      o1.connect(g); o2.connect(g); g.connect(master); g.connect(delay);
      o1.start(); o2.start();
      return { o1, o2 };
    });
    let morphId = setInterval(() => {
      const now = ctx.currentTime;
      voices.forEach((v, i) => {
        const tgt = (Math.random() > 0.5 ? c1 : c2)[i];
        v.o1.frequency.linearRampToValueAtTime(tgt, now + 6);
        v.o2.frequency.linearRampToValueAtTime(tgt * 1.005, now + 6);
      });
    }, 6000);
    const arp = [523.25, 587.33, 659.25, 783.99, 880.0];
    let arpI = 0, arpId;
    const tick = () => {
      const now = ctx.currentTime;
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = arp[arpI++ % arp.length];
      const g = ctx.createGain(); g.gain.value = 0;
      o.connect(g); g.connect(master); g.connect(delay);
      g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.03, now+0.03); g.gain.exponentialRampToValueAtTime(0.0001, now+1.2);
      o.start(now); o.stop(now+1.4);
      arpId = setTimeout(tick, 1600 + Math.random() * 500);
    };
    arpId = setTimeout(tick, 800);
    master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 1.2);
    ref.current = { ctx, master, stop: () => { clearInterval(morphId); clearTimeout(arpId); voices.forEach(v => { try{v.o1.stop(); v.o2.stop();}catch(e){} }); } };
    return () => { clearInterval(morphId); clearTimeout(arpId); try { voices.forEach(v => { v.o1.stop(); v.o2.stop(); }); } catch(e){} try { ctx.close(); } catch(e){} ref.current = null; };
  }, [enabled]);
  useEffect(() => {
    if (!ref.current) return;
    const { ctx, master } = ref.current;
    try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(duckedLevel, ctx.currentTime + 0.4); } catch(e){}
  }, [duckedLevel]);
}

function IntroScene_Sky({ p }) {
  const stars = [{ x:15,y:25,r:2.4,c:"#FFD166",d:0.0 },{ x:30,y:16,r:1.8,c:"#7CC4FF",d:0.2 },{ x:46,y:42,r:3.2,c:"#C8A0FF",d:0.4 },{ x:62,y:22,r:2.0,c:"#77DDA0",d:0.15 },{ x:78,y:34,r:2.2,c:"#FF9E7A",d:0.35 },{ x:36,y:62,r:1.8,c:"#FFA8D9",d:0.5 },{ x:68,y:68,r:2.4,c:"#9FE6E6",d:0.25 },{ x:22,y:50,r:1.6,c:"#FFD166",d:0.45 },{ x:84,y:56,r:1.6,c:"#7CC4FF",d:0.55 },{ x:52,y:78,r:1.8,c:"#C8A0FF",d:0.3 }];
  const scale = 1 + p * 0.08;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ transform:`scale(${scale})`, transition:"transform 5s linear" }}>
      {stars.map((s, i) => (
        <g key={i} style={{ opacity: p > s.d ? 1 : 0, transition:"opacity .8s ease" }}>
          <circle cx={s.x} cy={s.y} r={s.r*1.8} fill={s.c} opacity="0.18" style={{ animation:`twinkle ${2.5+(i%3)*0.4}s ease-in-out ${i*0.2}s infinite alternate` }} />
          <circle cx={s.x} cy={s.y} r={s.r*0.5} fill={s.c} />
        </g>
      ))}
      {p > 0.2 && <text x="50" y="90" textAnchor="middle" fill="#fff" fontSize="4" style={{ fontFamily:"ui-sans-serif,system-ui", fontWeight:600, letterSpacing:"0.3em", opacity:0.6 }}>STELLAR</text>}
    </svg>
  );
}

function IntroScene_Classroom({ p }) {
  const cols = 8, rows = 5;
  const state = (r, c) => {
    const i = r*cols + c;
    if ([3,9,22,31].includes(i)) return "ahead";
    if ([6,14,19,27,33,37].includes(i)) return "behind";
    return "stuck";
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="mx-auto mb-6 w-[60%] min-w-[300px] h-12 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center">
          <p className="mono text-[11px] tracking-[0.25em] text-white/60 uppercase">Today · Fractions · Page 42</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns:`repeat(${cols}, 24px)`, gap:"10px" }}>
          {[...Array(rows)].map((_,r) => [...Array(cols)].map((_,c) => {
            const idx = r*cols + c;
            const s = state(r, c);
            const visible = p > idx * 0.012;
            const color = s === "ahead" ? "#7CC4FF" : s === "behind" ? "#FF9E7A" : "rgba(255,255,255,0.3)";
            return <div key={`${r}-${c}`} style={{ width:24, height:24, borderRadius:6, background:color, opacity:visible?(s==="stuck"?0.35:0.9):0, transform:visible?"translateY(0)":"translateY(4px)", transition:"all .5s ease", boxShadow:s!=="stuck"&&visible?`0 0 10px ${color}`:"none" }} />;
          }))}
        </div>
        {p > 0.5 && (
          <div className="flex gap-5 justify-center mt-6 text-[11px] text-white/70" style={{ animation:"captionFade .6s ease" }}>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background:"#7CC4FF"}}/> Bored · ahead</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background:"rgba(255,255,255,0.3)"}}/> Stuck · on-pace</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background:"#FF9E7A"}}/> Lost · behind</span>
          </div>
        )}
      </div>
    </div>
  );
}

function IntroScene_Reshape({ p }) {
  const tracks = [
    { y:25, color:"#FFD166", name:"Aarav", nodes:[10,30,55,85] },
    { y:45, color:"#7CC4FF", name:"Diya",  nodes:[10,20,35,55,75,90] },
    { y:65, color:"#C8A0FF", name:"Kabir", nodes:[10,28,42,48,60,80,88] },
    { y:85, color:"#77DDA0", name:"Meera", nodes:[10,40,62,80] },
  ];
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full px-8 md:px-16">
        <div className="relative w-full" style={{ height:260 }}>
          {tracks.map((tk, i) => {
            const delay = i * 0.12;
            const visible = Math.max(0, Math.min(1, (p - delay) / 0.55));
            return (
              <div key={i} className="absolute left-0 right-0" style={{ top:`${tk.y-10}%` }}>
                <div className="relative h-[2px] rounded-full" style={{ background:"rgba(255,255,255,0.08)" }}>
                  <div className="absolute top-0 left-0 h-full rounded-full" style={{ width:`${visible*100}%`, background:tk.color, opacity:0.8, transition:"width .6s ease" }} />
                  {tk.nodes.map((n, k) => (
                    <span key={k} className="absolute -top-[5px] w-3 h-3 rounded-full" style={{ left:`calc(${n}% - 6px)`, background:visible*100>n?tk.color:"rgba(255,255,255,0.15)", boxShadow:visible*100>n?`0 0 8px ${tk.color}`:"none", transition:"all .4s ease" }} />
                  ))}
                  <span className="absolute -top-[10px] w-5 h-5 rounded-full flex items-center justify-center" style={{ left:`calc(${visible*100}% - 10px)`, background:tk.color, boxShadow:`0 0 16px ${tk.color}, 0 0 30px ${tk.color}80`, transition:"left .6s ease" }} />
                </div>
                <p className="mt-2 text-[11px] mono text-white/60">{tk.name} <span className="opacity-50">· {tk.nodes.length} steps · own pace</span></p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IntroScene_Promise({ p }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full" style={{ background:"radial-gradient(closest-side, rgba(255,209,102,0.9), rgba(175,82,222,0.4) 60%, transparent)", transform:`scale(${1+p*0.3})`, transition:"transform 5s linear" }} />
        <div className="absolute inset-[38%] rounded-full bg-white" />
      </div>
      <h3 className="display text-[34px] md:text-[54px] leading-[1.02] tracking-tight max-w-[820px]" style={{ opacity:p>0.05?1:0, transform:p>0.05?"translateY(0)":"translateY(8px)", transition:"all .7s cubic-bezier(.22,1,.36,1)" }}>No star left dim.</h3>
      <p className="text-[16px] md:text-[20px] text-white/70 mt-5 max-w-[540px] leading-relaxed" style={{ opacity:p>0.25?1:0, transform:p>0.25?"translateY(0)":"translateY(8px)", transition:"all .7s cubic-bezier(.22,1,.36,1)" }}>
        Stellar reads how each child thinks and builds a study path shaped around them — so no one is bored, no one is lost, no one is left behind.
      </p>
      <p className="mono text-[11px] uppercase tracking-[0.3em] text-white/40 mt-10" style={{ opacity:p>0.55?1:0, transition:"opacity .6s ease" }}>Now watch how it works ↓</p>
    </div>
  );
}

function AnimatedStellarMark({ p, className: cls }) {
  const REVEAL_END = 0.16;
  const r = Math.max(0, Math.min(1, p / REVEAL_END));
  const seg = (s, e) => Math.max(0, Math.min(1, (r - s) / (e - s)));
  const overshoot = k => k < 0.7 ? (k/0.7)*1.3 : 1.3 - ((k-0.7)/0.3)*0.3;
  const star1 = seg(0.00, 0.20), star2 = seg(0.10, 0.30), star3 = seg(0.20, 0.40);
  const line1 = seg(0.40, 0.62), line2 = seg(0.55, 0.77), line3 = seg(0.70, 0.92);
  const sparkle = seg(0.80, 1.00);
  const DASH = 220;
  return (
    <div className={cls} style={{ overflow:"hidden", background:"linear-gradient(135deg,#9D50BB,#3A1C71)" }}>
      <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="cta-glow" x="100" y="100" width="320" height="280" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter></defs>
        <g filter="url(#cta-glow)">
          <path d="M310 255 L350 310" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" strokeDasharray={DASH} strokeDashoffset={DASH*(1-line1)} />
          <path d="M310 255 L260 320" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" strokeDasharray={DASH} strokeDashoffset={DASH*(1-line2)} />
          <path d="M190 190 L310 255" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" strokeDasharray={DASH} strokeDashoffset={DASH*(1-line3)} />
          <circle cx="310" cy="255" r="18" fill="white" style={{ opacity:star1, transform:`scale(${overshoot(star1)})`, transformOrigin:"310px 255px", transformBox:"fill-box" }} />
          <circle cx="350" cy="310" r="18" fill="white" style={{ opacity:star2, transform:`scale(${overshoot(star2)})`, transformOrigin:"350px 310px", transformBox:"fill-box" }} />
          <circle cx="260" cy="320" r="18" fill="white" style={{ opacity:star3, transform:`scale(${overshoot(star3)})`, transformOrigin:"260px 320px", transformBox:"fill-box" }} />
          <path d="M190 155 C190 175 175 190 155 190 C175 190 190 205 190 225 C190 205 205 190 225 190 C205 190 190 175 190 155Z" fill="white" style={{ opacity:sparkle, transform:`scale(${overshoot(sparkle)}) rotate(${(1-sparkle)*-20}deg)`, transformOrigin:"190px 190px", transformBox:"fill-box" }} />
        </g>
      </svg>
    </div>
  );
}

function IntroScene_CTA({ p }) {
  const show = (start, end = start + 0.18) => { const k = Math.max(0, Math.min(1, (p-start)/(end-start))); return { opacity:k, transform:`translateY(${(1-k)*10}px)` }; };
  const stars = [{ x:12,y:28,r:1.4,d:0.05 },{ x:22,y:18,r:1.0,d:0.08 },{ x:30,y:42,r:1.6,d:0.10 },{ x:38,y:22,r:1.1,d:0.12 },{ x:48,y:35,r:1.3,d:0.14 },{ x:58,y:18,r:1.2,d:0.16 },{ x:66,y:38,r:1.5,d:0.18 },{ x:74,y:24,r:1.0,d:0.20 },{ x:82,y:32,r:1.3,d:0.22 },{ x:90,y:20,r:1.1,d:0.24 },{ x:18,y:70,r:1.2,d:0.26 },{ x:28,y:78,r:1.4,d:0.28 },{ x:42,y:72,r:1.0,d:0.30 },{ x:56,y:82,r:1.3,d:0.32 },{ x:70,y:74,r:1.5,d:0.34 },{ x:84,y:80,r:1.1,d:0.36 }];
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center text-center px-8 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-70" aria-hidden>
        {stars.map((s, i) => (
          <g key={i} style={{ opacity:p>s.d?1:0, transition:"opacity .6s ease" }}>
            <circle cx={s.x} cy={s.y} r={s.r*1.6} fill="#FFD166" opacity="0.18" style={{ animation:`twinkle ${2.4+(i%3)*0.5}s ease-in-out ${i*0.18}s infinite alternate` }} />
            <circle cx={s.x} cy={s.y} r={s.r*0.55} fill="#fff" />
          </g>
        ))}
      </svg>
      <div className="relative mb-10" style={show(0.0, 0.06)}>
        <div className="absolute inset-0 rounded-[40px] -z-10" style={{ background:"radial-gradient(closest-side, rgba(157,80,187,0.55), rgba(58,28,113,0.3) 55%, transparent)", transform:`scale(${1.6+p*0.2})`, filter:"blur(20px)" }} />
        <AnimatedStellarMark p={p} className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-[36px] shadow-[0_30px_80px_rgba(157,80,187,0.45)]" />
      </div>
      <h3 className="display text-[40px] md:text-[68px] leading-[1] tracking-tight max-w-[940px] relative" style={show(0.18, 0.42)}>
        Give your child <span style={{ background:"linear-gradient(120deg,#FFD166,#AF52DE 55%,#007AFF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>their own sky.</span>
      </h3>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="relative" style={{ width:240, height:480 }}>
      <div className="absolute inset-0 rounded-[38px] bg-ink" style={{ boxShadow:"0 30px 60px -20px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.15), inset 0 0 0 2px rgba(255,255,255,.06)" }} />
      <div className="absolute inset-[6px] rounded-[32px] overflow-hidden bg-white">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[72px] h-[22px] bg-ink rounded-full z-30" />
        <div className="absolute top-0 left-0 right-0 h-[32px] flex items-center justify-between px-5 text-[10px] font-semibold text-ink z-20">
          <span>9:41</span><span className="opacity-70">•••</span>
        </div>
        <div className="absolute inset-0 pt-[32px]">{children}</div>
      </div>
    </div>
  );
}

function UI_SignIn({ p }) {
  const r1 = reveal(p, 0.05), r2 = reveal(p, 0.18), r3 = reveal(p, 0.32);
  const day = Math.min(14, Math.round(1 + p * 14));
  return (
    <div className="h-full flex flex-col items-center justify-center px-5 text-center">
      <div className="w-16 h-16 rounded-[18px] flex items-center justify-center text-[30px] shadow-apple-lg" style={{ background:"linear-gradient(135deg,#AF52DE,#007AFF)", color:"#fff", ...r1 }}>🧠</div>
      <p className="mono text-[9px] text-ink-3 uppercase tracking-[0.25em] mt-4" style={r2}>Welcome back</p>
      <p className="text-[26px] font-bold tracking-tight mt-0.5 text-ink" style={r2}>Aarav</p>
      <p className="text-[11px] text-ink-3 mt-0.5" style={r3}>Grade 5 · CBSE · Day {day}</p>
      <div className="mt-5 w-full rounded-xl border hairline bg-paper-2 p-3 text-left" style={r3}>
        <p className="mono text-[9px] uppercase tracking-[0.2em] text-ink-3">Today</p>
        <p className="text-[12px] text-ink mt-0.5 font-semibold">Fractions · Lesson 3 of 7</p>
        <div className="h-1 rounded-full bg-black/10 mt-2 overflow-hidden">
          <div className="h-full rounded-full" style={{ width:`${28+p*6}%`, background:"var(--accent,#007AFF)" }} />
        </div>
      </div>
      <button className="mt-4 w-full rounded-xl py-2.5 text-white text-[12px] font-semibold" style={{ background:"var(--accent,#007AFF)", ...reveal(p, 0.45) }}>Start today's lesson →</button>
    </div>
  );
}

function UI_Teach({ p }) {
  const eaten = p < 0.22 ? 0 : p < 0.38 ? 1 : p < 0.54 ? 2 : 3;
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <p className="mono text-[10px] text-ink-3 uppercase tracking-[0.25em]" style={reveal(p,0.03)}>Lesson · Fractions</p>
      <p className="text-[18px] font-bold tracking-tight text-ink mt-1" style={reveal(p,0.08)}>A pizza, cut into 5 slices</p>
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="-110 -110 220 220" className="w-[220px] h-[220px]" style={{ filter:"drop-shadow(0 16px 24px rgba(255,149,0,.28))" }}>
          {[0,1,2,3,4].map(i => {
            const a0=(i/5)*Math.PI*2-Math.PI/2, a1=((i+1)/5)*Math.PI*2-Math.PI/2, r=92;
            const x0=Math.cos(a0)*r, y0=Math.sin(a0)*r, x1=Math.cos(a1)*r, y1=Math.sin(a1)*r;
            const isEaten = i < eaten;
            return <path key={i} d={`M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={isEaten?"#E5E5EA":"#FF9500"} stroke="#fff" strokeWidth="3" style={{ opacity:isEaten?0.3:1, transform:isEaten?`translate(${(i-2)*24}px, -${46-i*8}px) rotate(${(i-2)*10}deg)`:"none", transformOrigin:"center", transition:"all .6s cubic-bezier(.4,0,.2,1)" }} />;
          })}
        </svg>
      </div>
      <div className="rounded-xl bg-paper-2 p-3 border hairline" style={reveal(p,0.18)}>
        <p className="text-[13px] text-ink-2 text-center">
          {p<0.22?"5 slices total":p<0.54?<>Aarav eats <span className="font-bold text-ink">{eaten}</span>…</>:<span className="font-bold" style={{color:"#FF9500"}}>3 eaten · 2 slices left</span>}
        </p>
      </div>
    </div>
  );
}

function UI_Question({ p }) {
  const options = ["2/5","3/5","4/5","5/5"];
  const tapped = p > 0.62;
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <div className="flex items-center justify-between" style={reveal(p,0.02)}>
        <p className="mono text-[10px] text-ink-3 uppercase tracking-wider">Quick test</p>
        <p className="mono text-[10px] text-apple-green">● LIVE</p>
      </div>
      <p className="text-[17px] text-ink mt-2 font-semibold leading-snug tracking-tight" style={reveal(p,0.08)}>
        Pizza has 5 slices. Aarav eats 3. What fraction is{" "}
        <span style={{ textDecoration:"underline", textDecorationColor:"#FF9500", textDecorationThickness:"3px" }}>left</span>?
      </p>
      <div className="grid grid-cols-2 gap-2 mt-5">
        {options.map((o, i) => {
          const rv = reveal(p, 0.16 + i*0.06);
          const selected = tapped && i === 1;
          return (
            <div key={o} className="rounded-xl border px-3 py-3 text-[15px] font-semibold text-center transition-all"
                 style={{ ...rv, background:selected?"var(--accent,#007AFF)":"#fff", color:selected?"#fff":"#1D1D1F", borderColor:selected?"var(--accent,#007AFF)":"#D1D1D6", boxShadow:selected?"0 8px 20px rgba(0,122,255,.28)":"none", transform:`${rv.transform} scale(${selected?1.04:1})` }}>
              {o}
            </div>
          );
        })}
      </div>
      {p > 0.55 && p < 0.72 && (
        <div className="absolute" style={{ right:72, top:250, pointerEvents:"none" }}>
          <div className="w-10 h-10 rounded-full border-[3px] border-ink/80 bg-white/70 shadow-apple-md" style={{ transform:`scale(${1+(0.72-p)*3})`, opacity:(0.72-p)*6 }} />
        </div>
      )}
      <div className="flex-1" />
      <p className="mono text-[10px] text-ink-3 text-center" style={reveal(p,0.4)}>{tapped?"Answer locked · analysing":"Tap to answer"}</p>
    </div>
  );
}

function UI_Guess({ p }) {
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <p className="mono text-[10px] text-ink-3 uppercase tracking-wider" style={reveal(p,0.02)}>Answer detected</p>
      <div className="flex items-center gap-2 mt-2" style={reveal(p,0.08)}>
        <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-[12px]">✕</span>
        <p className="text-[15px] font-semibold tracking-tight text-ink">Picked "3/5" · 2.1s</p>
      </div>
      <div className="mt-4 rounded-xl p-3.5 border hairline bg-paper-2" style={reveal(p,0.22)}>
        <p className="mono text-[9px] uppercase tracking-[0.2em] text-ink-3">AI read</p>
        <p className="text-[13px] mt-1.5 text-ink-2">Looks like a <span className="font-bold text-ink">guess</span> — eaten vs left confusion, not a concept gap.</p>
      </div>
      <div className="flex gap-2 mt-3" style={reveal(p,0.36)}>
        {[{ t:"guess",on:true,col:"#FF9500" },{ t:"concept gap",on:false,col:"#8E8E93" },{ t:"slip",on:false,col:"#8E8E93" }].map(tag => (
          <span key={tag.t} className="text-[10px] mono rounded-full px-2.5 py-1 font-semibold" style={{ background:tag.on?tag.col:"#F5F5F7", color:tag.on?"#fff":tag.col }}>{tag.t}</span>
        ))}
      </div>
      <div className="flex-1 flex items-end">
        <div className="w-full rounded-xl border hairline bg-white p-3 flex items-center gap-2" style={reveal(p,0.55)}>
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] text-white" style={{ background:"var(--accent,#007AFF)" }}>→</span>
          <p className="text-[12px] text-ink-2">Breaking this concept smaller…</p>
        </div>
      </div>
    </div>
  );
}

function UI_Simpler({ p }) {
  const steps = [{ q:"TOTAL slices?",a:"5" },{ q:"EATEN slices?",a:"3" },{ q:"Left = Total − Eaten =",a:"2" }];
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <p className="mono text-[10px] text-ink-3 uppercase tracking-[0.25em]" style={reveal(p,0.02)}>Let's go smaller</p>
      <p className="text-[17px] font-bold tracking-tight text-ink mt-1" style={reveal(p,0.08)}>One tiny step at a time.</p>
      <div className="flex-1 flex flex-col justify-center space-y-2.5">
        {steps.map((s, i) => {
          const rv = reveal(p, 0.18 + i*0.18);
          return (
            <div key={i} className="bg-white border hairline rounded-xl p-3 flex items-center gap-3" style={{ ...rv, transform:`translateX(${(1-(rv.opacity||0))*-14}px)` }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ background:"var(--accent,#007AFF)" }}>{i+1}</span>
              <p className="text-[13px] text-ink">{s.q} <span className="font-bold mono" style={{ color:"var(--accent,#007AFF)" }}>{s.a}</span></p>
              {p > 0.18+i*0.18+0.12 && <span className="text-apple-green text-[14px]">✓</span>}
            </div>
          );
        })}
      </div>
      <p className="mono text-[10px] text-ink-3 text-center mt-3" style={reveal(p,0.78)}>Mastery before moving on</p>
    </div>
  );
}

function UI_Retest({ p }) {
  const correct = p > 0.5;
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <p className="mono text-[10px] text-ink-3 uppercase tracking-wider" style={reveal(p,0.02)}>Re-test · tiny step</p>
      <p className="text-[16px] text-ink mt-2 font-bold tracking-tight" style={reveal(p,0.08)}>Write "2 out of 5" as a fraction.</p>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[22px] font-bold" style={{ background:"var(--accent,#007AFF)22", color:"var(--accent,#007AFF)", ...reveal(p,0.18) }}>2</div>
            <p className="mono text-[9px] text-ink-3 mt-1">top</p>
          </div>
          <div className="w-8 h-0.5 bg-ink-3/30" style={reveal(p,0.24)} />
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[22px] font-bold" style={{ background:"var(--accent,#007AFF)22", color:"var(--accent,#007AFF)", ...reveal(p,0.3) }}>5</div>
            <p className="mono text-[9px] text-ink-3 mt-1">bottom</p>
          </div>
          <span className="text-[18px] text-ink-3 mx-1" style={reveal(p,0.38)}>=</span>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[22px] font-bold transition-all" style={{ background:correct?"#34C75922":"#F5F5F7", color:correct?"#34C759":"#8E8E93", transform:correct?"scale(1.06)":"scale(1)", ...reveal(p,0.42) }}>
            {correct?"2/5":"?"}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center" style={{ opacity:correct?1:0, transition:"opacity .4s" }}>
        <span className="text-[10px] mono rounded-full px-3 py-1 bg-apple-green/10 text-apple-green font-semibold">✓ Mastered this step</span>
      </div>
    </div>
  );
}

function UI_LevelUp({ p }) {
  const filled = p < 0.18 ? 1 : p < 0.34 ? 2 : 3;
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <p className="mono text-[10px] text-ink-3 uppercase tracking-[0.25em]" style={reveal(p,0.02)}>3 in a row correct</p>
      <div className="flex items-center gap-1.5 mt-3" style={reveal(p,0.06)}>
        {[1,2,3].map(i => <div key={i} className="flex-1 h-2.5 rounded-full transition-all duration-500" style={{ background:i<=filled?"#34C759":"#E5E5EA", boxShadow:i<=filled?"0 3px 10px rgba(52,199,89,.35)":"none" }} />)}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-[64px]" style={{ ...reveal(p,0.4), transform:`${reveal(p,0.4).transform} scale(${1+Math.min(1,p*1.2)*0.1})` }}>🚀</div>
          <p className="mono text-[10px] uppercase tracking-wider text-apple-green mt-2" style={reveal(p,0.48)}>Levelling up</p>
          <p className="text-[16px] font-bold text-ink tracking-tight mt-0.5" style={reveal(p,0.54)}>Adding fractions</p>
          <div className="mt-4 font-mono text-[20px] text-ink tracking-tight" style={reveal(p,0.66)}>
            <span style={{color:"var(--accent,#007AFF)"}}>2/5</span><span className="text-ink-3"> + </span><span style={{color:"#AF52DE"}}>1/5</span><span className="text-ink-3"> = </span><span className="text-ink">?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UI_Voice({ p }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:"linear-gradient(180deg,#1a1328 0%,#2a1a3a 100%)" }}>
      <p className="mono text-[10px] text-white/60 uppercase tracking-[0.25em]" style={reveal(p,0.02)}>Voice tutor · हिंदी</p>
      <div className="relative mt-4 w-24 h-24 rounded-full flex items-center justify-center text-[38px] shadow-2xl" style={{ background:"linear-gradient(135deg,#AF52DE,#007AFF)", ...reveal(p,0.08) }}>
        <div className="absolute inset-0 rounded-full" style={{ background:"rgba(175,82,222,.3)", transform:`scale(${1+Math.abs(Math.sin(p*12))*0.4})`, transition:"transform .1s" }} />
        <span className="relative">🎙</span>
      </div>
      <div className="flex items-end justify-center gap-1 mt-6 h-10" style={reveal(p,0.16)}>
        {[...Array(20)].map((_,i) => <span key={i} className="w-1 rounded-full bg-white/85" style={{ height:`${15+Math.abs(Math.sin(i*0.5+p*12))*80}%`, transition:"height .12s linear" }} />)}
      </div>
      <p className="text-[18px] mt-5 font-medium tracking-tight text-white" style={reveal(p,0.3)}>"भिन्न कैसे जोड़ें?"</p>
      <p className="text-[11px] text-white/55 mt-1" style={reveal(p,0.4)}>Asked in Hindi · reply in Hindi</p>
      <div className="mt-5 rounded-xl bg-white/10 backdrop-blur border border-white/10 px-3 py-2 text-left max-w-[260px]" style={reveal(p,0.55)}>
        <p className="mono text-[9px] text-white/50 uppercase tracking-wider">Reply</p>
        <p className="text-[12px] text-white/90 mt-0.5">"हरों को जोड़ें नहीं — बस अंश जोड़ो…"</p>
      </div>
    </div>
  );
}

function UI_Parent({ p }) {
  const streak = Math.round(p * 14), acc = 62 + Math.round(p * 16);
  return (
    <div className="h-full flex flex-col px-5 py-4">
      <div className="flex items-center justify-between" style={reveal(p,0.02)}>
        <div>
          <p className="mono text-[10px] text-ink-3 uppercase tracking-wider">Parent view</p>
          <p className="text-[14px] font-bold text-ink">Aarav's week</p>
        </div>
        <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green font-semibold">● ACTIVE</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[{ label:"Accuracy",val:`${acc}%`,col:"var(--accent,#007AFF)",d:0.1 },{ label:"Streak",val:`${streak}d`,col:"#FF9500",d:0.18 },{ label:"Topics",val:"18",col:"#34C759",d:0.26 }].map(s => (
          <div key={s.label} className="rounded-xl bg-paper-2 p-2.5 text-center" style={reveal(p,s.d)}>
            <p className="text-[20px] font-bold mono tracking-tight" style={{color:s.col}}>{s.val}</p>
            <p className="mono text-[9px] text-ink-3 uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border hairline p-3 flex-1" style={reveal(p,0.38)}>
        <p className="mono text-[9px] uppercase tracking-[0.2em] text-ink-3">This week</p>
        <div className="flex items-end gap-1 h-full max-h-[120px] mt-2">
          {[3,5,4,7,6,8,9].map((h, i) => {
            const rv = reveal(p, 0.44 + i*0.04);
            return <div key={i} className="flex-1 rounded-t" style={{ height:`${Math.min(100,h*10+p*10)}%`, background:"var(--accent,#007AFF)", opacity:(0.4+i*0.08)*(rv.opacity||0), transition:"height .5s, opacity .3s" }} />;
          })}
        </div>
      </div>
      <div className="mt-3 rounded-xl border hairline p-2.5 flex items-center gap-2" style={reveal(p,0.8)}>
        <span className="w-6 h-6 rounded-full bg-apple-green/15 text-apple-green flex items-center justify-center text-[11px]">↑</span>
        <p className="text-[11px] text-ink-2"><span className="font-bold text-ink">+16%</span> accuracy vs last week</p>
      </div>
    </div>
  );
}

function SceneUI({ scene, p }) {
  if (scene === "signin")   return <UI_SignIn   p={p} />;
  if (scene === "teach")    return <UI_Teach    p={p} />;
  if (scene === "question") return <UI_Question p={p} />;
  if (scene === "guess")    return <UI_Guess    p={p} />;
  if (scene === "simpler")  return <UI_Simpler  p={p} />;
  if (scene === "retest")   return <UI_Retest   p={p} />;
  if (scene === "levelup")  return <UI_LevelUp  p={p} />;
  if (scene === "voice")    return <UI_Voice    p={p} />;
  if (scene === "parent")   return <UI_Parent   p={p} />;
  return null;
}

function SceneLayout({ scene, p }) {
  const PROLOGUE = { sky:IntroScene_Sky, classroom:IntroScene_Classroom, reshape:IntroScene_Reshape, promise:IntroScene_Promise, cta:IntroScene_CTA };
  if (PROLOGUE[scene.key]) {
    const P = PROLOGUE[scene.key];
    return (
      <div className="absolute inset-0 bg-ink text-white overflow-hidden">
        <div className="absolute -left-32 top-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-30" style={{ background:"radial-gradient(closest-side, #AF52DE, transparent)" }} />
        <div className="absolute -right-32 bottom-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-25" style={{ background:"radial-gradient(closest-side, #007AFF, transparent)" }} />
        <div className="absolute inset-0"><P p={p} /></div>
        <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center pointer-events-none">
          <p key={scene.key} className="text-[18px] md:text-[26px] text-white text-center max-w-[760px] leading-snug tracking-tight caption-fade font-medium">{scene.title}</p>
        </div>
        <div className="absolute top-5 left-5 z-40 mono text-[10px] uppercase tracking-[0.3em] text-white/50">{scene.eyebrow}</div>
      </div>
    );
  }
  const { intro, hold } = tourPhase(p);
  const titleBlur = (1 - intro) * 10, titleScale = 1 + (1 - intro) * 0.08, titleOp = Math.min(1, intro * 1.3), titleY = (1 - intro) * 10;
  const ebIntro = Math.min(1, p / 0.08);
  const phoneIntro = Math.min(1, Math.max(0, (p - 0.05) / 0.22));
  const phoneLift = (1 - easeOutCubic(phoneIntro)) * 18, phoneOp = easeOutCubic(phoneIntro);
  const pushIn = 1 + easeInOutCubic(hold) * 0.06;
  return (
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-4 md:px-10 py-6 md:py-0">
      <div className="md:col-span-7 relative z-10 text-center md:text-left">
        <p className="mono text-[11px] uppercase tracking-[0.28em]" style={{ color:"var(--accent,#007AFF)", opacity:ebIntro, transform:`translateY(${(1-ebIntro)*6}px)`, transition:"opacity .3s, transform .3s" }}>{scene.eyebrow}</p>
        <h3 className="display text-[22px] md:text-[40px] leading-[1.04] mt-2 md:mt-2.5 text-ink" style={{ opacity:titleOp, transform:`translateY(${titleY}px) scale(${titleScale})`, filter:`blur(${titleBlur}px)`, transformOrigin:"0% 50%", letterSpacing:"-0.035em", transition:"filter .1s" }}>{scene.title}</h3>
        <p className="text-[12px] md:text-[15px] text-ink-2 mt-2 md:mt-3 max-w-[380px] mx-auto md:mx-0 hidden sm:block" style={{ opacity:intro*0.85, transform:`translateY(${(1-intro)*8}px)`, transition:"opacity .2s" }}>{scene.sub}</p>
      </div>
      <div className="md:col-span-5 relative flex items-center justify-center">
        <div className="scale-[0.55] sm:scale-75 md:scale-100" style={{ transformOrigin:"50% 50%" }}>
          <div style={{ transform:`translateY(${phoneLift}px) scale(${pushIn})`, opacity:phoneOp, transformOrigin:"50% 50%", transition:"transform .08s linear", willChange:"transform" }}>
            <PhoneFrame><SceneUI scene={scene.key} p={p} /></PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTour() {
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  useEffect(() => { tRef.current = t; }, [t]);
  const wallRef = useRef(0);
  const total = TOUR_BASE_DURATION;
  const [playing, setPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.muted = !soundOn;
    if (playing) {
      if (a.duration && tRef.current < a.duration - 0.05) {
        if (Math.abs(a.currentTime - tRef.current) > 0.2) a.currentTime = tRef.current;
        a.play().catch(() => {});
      } else { a.pause(); }
    } else { a.pause(); }
  }, [playing, soundOn]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    wallRef.current = tRef.current;
    const loop = now => {
      const dt = (now - last) / 1000; last = now;
      wallRef.current += dt;
      const a = audioRef.current;
      let next;
      const audioOk = a && !a.paused && !a.ended && a.currentTime > 0.05 && Math.abs(a.currentTime - wallRef.current) < 0.6 && a.currentTime < (a.duration || total);
      if (audioOk) { next = a.currentTime; wallRef.current = a.currentTime; } else { next = wallRef.current; }
      if (next >= total) { setPlaying(false); if (a) { a.pause(); a.currentTime = 0; } wallRef.current = 0; setT(0); return; }
      setT(next);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, total]);

  const duckLevel = (soundOn && playing) ? 0.12 : 0.45;
  useAmbientMusic(playing, duckLevel);

  const active = Math.max(0, TOUR_SCENES.findIndex(s => t >= s.t && t < s.t + s.dur));
  const scene = TOUR_SCENES[active];
  const localP = Math.min(1, (t - scene.t) / scene.dur);
  const progress = (t / total) * 100;

  const seekTo = sec => {
    const nt = Math.max(0, Math.min(total - 0.01, sec));
    setT(nt); wallRef.current = nt;
    const a = audioRef.current; if (a) a.currentTime = nt;
  };
  const trackRef = useRef(null);
  const [scrubbing, setScrubbing] = useState(false);
  const wasPlayingRef = useRef(false);
  const seekFromClientX = clientX => {
    const el = trackRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    seekTo(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * total);
  };
  useEffect(() => {
    if (!scrubbing) return;
    const onMove = e => seekFromClientX(e.touches ? e.touches[0].clientX : e.clientX);
    const onUp = () => { setScrubbing(false); if (wasPlayingRef.current) setPlaying(true); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive:false }); window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [scrubbing, total]);
  const startScrub = e => { e.preventDefault(); wasPlayingRef.current = playing; setPlaying(false); setScrubbing(true); seekFromClientX(e.touches ? e.touches[0].clientX : e.clientX); };
  const fmtTime = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

  return (
    <section id="tour" className="py-24 md:py-32 bg-paper-2 border-y hairline overflow-hidden">
      <audio ref={audioRef} src="/audio/voiceover.mp3" preload="auto" />
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">How it learns with your child</p>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] mt-3 max-w-[820px]">Teach. Test. Adapt. Repeat.</h2>
        <p className="text-[15px] text-ink-2 mt-4 max-w-[640px]">A full product tour in under a minute — the same loop we run every day with your child.</p>
        <div className="mt-12">
          <div className="relative rounded-apple-2xl overflow-hidden shadow-apple-xl aspect-[3/4] md:aspect-[14/11]" style={{ background:"linear-gradient(180deg,#F6F7FB 0%,#EEF0F7 60%,#E8EBF3 100%)" }}>
            <div className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full" style={{ background:"radial-gradient(closest-side, rgba(0,122,255,0.12), transparent)" }} />
            <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full" style={{ background:"radial-gradient(closest-side, rgba(175,82,222,0.10), transparent)" }} />
            {TOUR_SCENES.map((s, i) => {
              const isActive = i === active, isPrev = i === active-1, isNext = i === active+1;
              if (!isActive && !isPrev && !isNext) return null;
              let scale = 1, blur = 0, op = 1, ty = 0;
              if (isActive) {
                const { intro, outro } = tourPhase(localP);
                scale = 0.96 + intro*0.04 + outro*0.04; blur = (1-intro)*10 + outro*12; ty = (1-intro)*12 - outro*10; op = Math.min(1, intro*1.15) * (1 - outro*0.95);
              } else if (isPrev) { scale = 1.04; blur = 14; ty = -10; op = 0; } else if (isNext) { scale = 0.96; blur = 14; ty = 12; op = 0; }
              return (
                <div key={s.key} className="absolute inset-0" style={{ transform:`translate3d(0,${ty}px,0) scale(${scale})`, transformOrigin:"50% 50%", filter:`blur(${blur}px)`, opacity:op, transition:"transform .7s cubic-bezier(.22,1,.36,1), filter .55s cubic-bezier(.22,1,.36,1), opacity .55s ease", pointerEvents:isActive?"auto":"none", willChange:"transform, filter, opacity" }}>
                  <SceneLayout scene={s} p={isActive ? localP : 0} />
                </div>
              );
            })}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button onClick={() => setSoundOn(s => !s)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur text-ink hover:bg-white flex items-center justify-center text-[13px] shadow-apple" title={soundOn?"Mute":"Unmute"}>{soundOn?"🔊":"🔇"}</button>
              <button onClick={() => setPlaying(p => !p)} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur text-ink hover:bg-white flex items-center justify-center shadow-apple">{playing?"❚❚":"▶"}</button>
            </div>
            <div className="absolute bottom-4 left-4 z-20 mono text-[10px] uppercase tracking-[0.25em] text-ink-3 bg-white/70 backdrop-blur rounded-full px-3 py-1.5 shadow-apple">
              {String(active+1).padStart(2,"0")} / {String(TOUR_SCENES.length).padStart(2,"0")} · {scene.eyebrow.replace(/^Step \d+ — /,"")}
            </div>
            {!playing && (
              <button onClick={() => { setPlaying(true); setSoundOn(true); }} className="absolute inset-0 z-30 flex items-center justify-center group bg-white/30 backdrop-blur-[2px]">
                <span className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-ink/90 text-white flex items-center justify-center text-[28px] shadow-2xl transition-transform group-hover:scale-105">▶</span>
                <span className="absolute bottom-8 text-ink-2 mono text-[11px] uppercase tracking-[0.25em]">Play product demo · {Math.round(total)}s · sound on</span>
              </button>
            )}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/5 z-20">
              <div className="h-full" style={{ width:`${progress}%`, background:"var(--accent,#007AFF)", transition:scrubbing?"none":"width .12s linear" }} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-4 select-none">
            <button onClick={() => setPlaying(p => !p)} className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center shadow-apple hover:scale-105 transition-transform shrink-0"><span className="text-[14px]">{playing?"❚❚":"▶"}</span></button>
            <span className="mono text-[11px] text-ink-3 tabular-nums w-10 text-right">{fmtTime(t)}</span>
            <div ref={trackRef} onMouseDown={startScrub} onTouchStart={startScrub} className="relative flex-1 h-8 flex items-center cursor-pointer group">
              <div className="absolute left-0 right-0 h-1.5 rounded-full bg-black/10 group-hover:h-2 transition-[height]" />
              {TOUR_SCENES.map((s, i) => i === 0 ? null : <div key={s.key} className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-black/20" style={{ left:`${(s.t/total)*100}%` }} />)}
              <div className="absolute left-0 h-1.5 rounded-full group-hover:h-2 transition-[height]" style={{ width:`${progress}%`, background:"var(--accent,#007AFF)", transition:scrubbing?"none":"width .12s linear" }} />
              <div className="absolute -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-apple border hairline group-hover:scale-110 transition-transform" style={{ left:`${progress}%`, top:"50%", marginTop:"-8px" }} />
            </div>
            <span className="mono text-[11px] text-ink-3 tabular-nums w-10">{fmtTime(total)}</span>
            <button onClick={() => setSoundOn(s => !s)} className="w-9 h-9 rounded-full bg-white border hairline text-ink hover:bg-paper-2 flex items-center justify-center text-[12px] shrink-0">{soundOn?"🔊":"🔇"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LEARNING GOALS
   ========================================================= */
const GOAL_TABS = [
  { key:"Math",         color:"#FF9500", courses:["Arithmetic Thinking","Proportional Reasoning","Probability & Chance","Visual Algebra","Solving Equations","Quadratics","Mensuration"], more:"19 additional courses", preview:"quadratics" },
  { key:"Science",      color:"#34C759", courses:["States of Matter","Energy & Motion","Cells & Life","Light and Optics","Chemistry Basics","Human Body","Environment"],                 more:"22 additional courses", preview:"science"    },
  { key:"Language",     color:"#AF52DE", courses:["Phonics","Comprehension","Grammar & Tenses","Poetry","Essay Writing","Hindi व्याकरण","Regional Language"],                           more:"16 additional courses", preview:"language"   },
  { key:"Logic",        color:"#007AFF", courses:["Patterns & Sequences","Logical Puzzles","Coding Thinking","Spatial Reasoning","Data Handling","Problem Strategy"],                   more:"12 additional courses", preview:"logic"      },
  { key:"Social Studies",color:"#FF2D55",courses:["Our Neighbourhood","Civics","Indian History","World Geography","Economics","Government"],                                             more:"14 additional courses", preview:"social"     },
];

function useStep(steps, interval = 900) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS(x => (x + 1) % steps), interval);
    return () => clearInterval(id);
  }, [steps, interval]);
  return s;
}

function Center({ children }) {
  return <div className="flex-1 flex items-center justify-center">{children}</div>;
}

function PreviewQuadratics({ color }) {
  const step = useStep(5, 900);
  const cells = [["y²",0],["4y",1],["2y",2],["8",3]];
  return (
    <Center>
      <div className="relative">
        <div className="text-center font-mono text-[13px] text-ink-3 absolute -top-5 left-1/2 -translate-x-1/2">(y + 4)</div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2 text-[12px] mono text-ink-3 items-end pt-2">
            <span className="h-10 flex items-center">y</span>
            <span className="h-10 flex items-center">2</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cells.map(([label,i]) => (
              <div key={i} className="w-16 h-10 rounded-md flex items-center justify-center text-[15px] font-semibold text-white shadow-sm transition-all"
                   style={{ background: color, opacity: step > i ? 1 : 0.15, transform: step > i ? "scale(1)" : "scale(.85)" }}>{label}</div>
            ))}
          </div>
        </div>
        <p className="text-center text-[11px] mono text-ink-3 mt-6 transition-opacity" style={{ opacity: step === 4 ? 1 : 0.3 }}>(y+2)(y+4) = y² + 6y + 8</p>
      </div>
    </Center>
  );
}

function PreviewArithmetic({ color }) {
  const step = useStep(6, 700);
  const show = step >= 5 ? "12" : "?";
  const items = [7,"+",5,"=",show];
  return (
    <Center>
      <div className="flex items-center gap-3 text-[28px] font-bold">
        {items.map((x,i) => (
          <span key={i} className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: i === 4 && step >= 5 ? color : (typeof x === "number" || x === "?" ? color+"15" : "transparent"),
                  color: x === "?" ? "#8E8E93" : (i === 4 && step >= 5 ? "#fff" : color),
                  transform: i === 4 && step === 5 ? "scale(1.1)" : "scale(1)"
                }}>{x}</span>
        ))}
      </div>
    </Center>
  );
}

function PreviewProportional({ color }) {
  const step = useStep(4, 1000);
  return (
    <Center>
      <div className="text-center">
        <div className="flex items-center gap-4 justify-center text-[22px] font-semibold">
          <span>2</span><span className="mono text-[11px] text-ink-3">:</span><span>6</span>
          <span className="text-ink-3 mx-2">as</span>
          <span>5</span><span className="mono text-[11px] text-ink-3">:</span>
          <span className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                style={{ background: step >= 3 ? color : "transparent", color: step >= 3 ? "#fff" : "#8E8E93", border: step >= 3 ? "none" : "2px dashed rgba(142,142,147,.4)" }}>
            {step >= 3 ? "15" : "?"}
          </span>
        </div>
        <p className="mt-5 text-[12px] mono transition-all" style={{ color: step >= 2 ? color : "#8E8E93" }}>
          {step === 0 && "Find the ratio…"}
          {step === 1 && "2 → 6 means × 3"}
          {step === 2 && "So 5 × 3 = 15"}
          {step >= 3 && "✓ Answer: 15"}
        </p>
      </div>
    </Center>
  );
}

function PreviewProbability({ color }) {
  const [roll, setRoll] = useState(4);
  useEffect(() => {
    const id = setInterval(() => setRoll(Math.floor(Math.random()*6)+1), 650);
    return () => clearInterval(id);
  }, []);
  return (
    <Center>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[15px] transition-all"
                 style={{ background: n===roll?color:color+"20", color: n===roll?"#fff":color, transform: n===roll?"scale(1.15)":"scale(1)" }}>{n}</div>
          ))}
        </div>
        <p className="mono text-[11px] text-ink-3">P(any face) = <span style={{color}}>1/6</span></p>
      </div>
    </Center>
  );
}

function PreviewVisualAlgebra({ color }) {
  const step = useStep(4, 1100);
  return (
    <Center>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-10 h-10 rounded-lg shadow-sm lg-pulse" style={{ background: color, animationDelay: `${i*.15}s` }} />
          ))}
          <span className="mono text-[13px] text-ink-3 mx-1">+ 3 = 12</span>
        </div>
        <div className="mono text-[13px] transition-all" style={{ color: step >= 2 ? color : "#8E8E93" }}>
          {step === 0 && "3x + 3 = 12"}
          {step === 1 && "3x = 9"}
          {step >= 2 && <>x = <span className="font-bold text-[18px]">3</span></>}
        </div>
      </div>
    </Center>
  );
}

function PreviewSolving({ color }) {
  const step = useStep(5, 850);
  const lines = [
    {t:"3x + 4 = 19", hint:""},
    {t:"3x + 4 = 19", hint:"subtract 4"},
    {t:"3x = 15",     hint:"divide by 3"},
    {t:"x = 5",       hint:"✓ solved"},
    {t:"x = 5",       hint:"✓ solved"},
  ];
  const L = lines[step];
  return (
    <Center>
      <div className="text-center mono space-y-2">
        <p key={L.t} className="text-[22px] lg-slide" style={{ color: step >= 3 ? color : "#1D1D1F", fontWeight: step >= 3 ? 700 : 400 }}>{L.t}</p>
        <p className="text-[12px] text-ink-3 h-4">{L.hint && `↓ ${L.hint}`}</p>
      </div>
    </Center>
  );
}

function PreviewMensuration({ color }) {
  const step = useStep(3, 1200);
  return (
    <Center>
      <svg viewBox="0 0 200 140" className="w-[60%] max-w-[260px]">
        <rect x="30" y="30" width="140" height="80" fill={color+"22"} stroke={color} strokeWidth="2" className="lg-dash" pathLength="300"/>
        <text x="100" y="25" textAnchor="middle" fontSize="11" fill="#6E6E73" className="mono">l = 14</text>
        <text x="20" y="75" textAnchor="middle" fontSize="11" fill="#6E6E73" className="mono">b = 8</text>
        <text x="100" y="78" textAnchor="middle" fontSize="15" fontWeight="bold" fill={color}>
          {step === 0 && "A = ?"}
          {step === 1 && "14 × 8"}
          {step >= 2 && "A = 112"}
        </text>
      </svg>
    </Center>
  );
}

function PreviewScience({ color }) {
  return (
    <Center>
      <svg viewBox="0 0 200 160" className="w-[70%] max-w-[280px]">
        <defs>
          <linearGradient id="lg-waterg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.25"/>
            <stop offset="1" stopColor={color} stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        <rect x="20" y="50" width="160" height="100" rx="6" fill="url(#lg-waterg)" stroke={color} strokeWidth="2"/>
        <g className="lg-float">
          <rect x="70" y="35" width="60" height="40" rx="4" fill="#fff" stroke="#1D1D1F" strokeWidth="2"/>
          <text x="100" y="60" textAnchor="middle" className="mono" fontSize="10" fill="#1D1D1F">ice</text>
        </g>
      </svg>
    </Center>
  );
}

function PreviewStates({ color }) {
  const step = useStep(3, 1400);
  const labels = ["solid","liquid","gas"];
  return (
    <Center>
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-3 gap-0.5" style={{ width: 90 }}>
          {[...Array(9)].map((_,i) => {
            const jitter = step === 0 ? 0 : step === 1 ? 2 : 6;
            const tx = (Math.sin(i*1.7 + step*3) * jitter);
            const ty = (Math.cos(i*0.9 + step*3) * jitter);
            return (
              <div key={i} className="w-4 h-4 rounded-full transition-all" style={{ background: color, opacity: 0.55 + step*0.15, transform: `translate(${tx}px, ${ty}px)`, transitionDuration: "700ms" }} />
            );
          })}
        </div>
        <div className="flex gap-4">
          {labels.map((l,i) => (
            <span key={l} className="mono text-[11px] transition-all" style={{ color: step === i ? color : "#8E8E93", fontWeight: step === i ? 700 : 400 }}>{l}</span>
          ))}
        </div>
      </div>
    </Center>
  );
}

function PreviewEnergy({ color }) {
  return (
    <Center>
      <div className="relative" style={{ width: 260, height: 160 }}>
        <svg viewBox="0 0 260 160" className="absolute inset-0">
          <line x1="130" y1="10" x2="130" y2="70" stroke="#8E8E93" strokeWidth="1"/>
        </svg>
        <div style={{ position:"absolute", left:130, top:70, width:2, height:0, transformOrigin:"top center", animation: "lg-swing 2.2s ease-in-out infinite" }}>
          <div style={{ width:2, height:70, background:"#8E8E93", margin:"0 auto" }} />
          <div style={{ width:22, height:22, borderRadius:"50%", background:color, position:"absolute", left:"50%", top:68, transform:"translateX(-50%)" }} />
        </div>
        <p className="mono text-[11px] text-ink-3 absolute bottom-0 left-0">max KE at bottom</p>
        <p className="mono text-[11px] text-ink-3 absolute top-0 right-0">max PE at sides</p>
      </div>
    </Center>
  );
}

function PreviewCells({ color }) {
  return (
    <Center>
      <svg viewBox="0 0 200 160" className="w-[60%] max-w-[260px]">
        <ellipse cx="100" cy="80" rx="85" ry="55" fill={color+"18"} stroke={color} strokeWidth="2"/>
        <circle cx="110" cy="75" r="16" fill={color+"55"} stroke={color} strokeWidth="2" className="lg-pulse"/>
        <g style={{ transformOrigin: "100px 80px" }} className="lg-orbit">
          <circle cx="165" cy="80" r="5" fill={color}/>
        </g>
        <g style={{ transformOrigin: "100px 80px", animationDuration: "11s" }} className="lg-orbit">
          <circle cx="30" cy="80" r="4" fill={color} opacity=".7"/>
        </g>
        <text x="110" y="78" textAnchor="middle" fontSize="9" fill="#fff" className="mono">nucleus</text>
      </svg>
    </Center>
  );
}

function PreviewLight({ color }) {
  return (
    <Center>
      <svg viewBox="0 0 240 120" className="w-[70%] max-w-[300px]">
        <line x1="20" y1="60" x2="110" y2="60" stroke={color} strokeWidth="2" className="lg-dash"/>
        <polygon points="110,30 140,90 80,90" fill={color+"33"} stroke={color} strokeWidth="2"/>
        <line x1="140" y1="60" x2="230" y2="35" stroke="#FF3B30" strokeWidth="2" className="lg-dash" style={{animationDelay:".6s"}}/>
        <line x1="140" y1="60" x2="230" y2="50" stroke="#FF9500" strokeWidth="2" className="lg-dash" style={{animationDelay:".7s"}}/>
        <line x1="140" y1="60" x2="230" y2="65" stroke="#FFCC00" strokeWidth="2" className="lg-dash" style={{animationDelay:".8s"}}/>
        <line x1="140" y1="60" x2="230" y2="80" stroke="#34C759" strokeWidth="2" className="lg-dash" style={{animationDelay:".9s"}}/>
        <line x1="140" y1="60" x2="230" y2="95" stroke="#AF52DE" strokeWidth="2" className="lg-dash" style={{animationDelay:"1s"}}/>
      </svg>
    </Center>
  );
}

function PreviewChemistry({ color }) {
  const step = useStep(3, 1100);
  return (
    <Center>
      <div className="flex items-center gap-4 text-[22px] font-mono font-semibold">
        <span className="lg-pulse" style={{animationDelay:"0s"}}>2H₂</span>
        <span className="text-ink-3">+</span>
        <span className="lg-pulse" style={{animationDelay:".3s"}}>O₂</span>
        <span style={{color, transform: step >= 1 ? "translateX(4px)" : "none", transition:"transform .6s"}}>→</span>
        <span className="transition-all" style={{ opacity: step >= 2 ? 1 : 0.3, transform: step >= 2 ? "scale(1)" : "scale(.85)", color }}>2H₂O</span>
      </div>
    </Center>
  );
}

function PreviewBody({ color }) {
  return (
    <Center>
      <svg viewBox="0 0 120 180" className="w-[50%] max-w-[180px]">
        <circle cx="60" cy="30" r="18" fill={color+"22"} stroke={color} strokeWidth="2"/>
        <rect x="42" y="50" width="36" height="60" rx="8" fill={color+"18"} stroke={color} strokeWidth="2"/>
        <circle cx="60" cy="78" r="8" fill="#FF3B3055" stroke="#FF3B30"/>
        <rect x="48" y="110" width="10" height="50" rx="4" fill={color+"18"} stroke={color} strokeWidth="2"/>
        <rect x="62" y="110" width="10" height="50" rx="4" fill={color+"18"} stroke={color} strokeWidth="2"/>
      </svg>
    </Center>
  );
}

function PreviewLanguage({ color }) {
  const step = useStep(5, 900);
  const words = [
    { w: "The", c: "#8E8E93" },{ w: "quick", c: color },{ w: "fox", c: "#1D1D1F" },{ w: "jumps", c: color }
  ];
  const answer = "high";
  return (
    <Center>
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {words.map((x, i) => (
            <span key={i} className="px-3 py-2 rounded-md font-semibold text-[14px] border"
                  style={{ borderColor: x.c + "55", color: x.c, background: x.c + "0d" }}>{x.w}</span>
          ))}
          <span className="w-20 h-10 rounded-md flex items-center justify-center text-[13px] font-semibold transition-all"
                style={{
                  border: step >= 4 ? `2px solid ${color}` : "2px dashed rgba(142,142,147,.4)",
                  background: step >= 4 ? color+"15" : "transparent",
                  color: step >= 4 ? color : "#8E8E93"
                }}>
            {step >= 4 ? answer : "_____"}
          </span>
        </div>
        <div className="flex gap-2">
          {["high","fast","loud"].map((w,i) => (
            <span key={w} className="px-2.5 py-1.5 rounded-md text-[12px] mono transition-all"
                  style={{
                    background: step === 2 && w === answer ? color+"22" : "#F5F5F7",
                    color: step === 2 && w === answer ? color : "#6E6E73",
                    transform: step === 3 && w === answer ? "translateY(-20px) scale(.9)" : "none",
                    opacity: step >= 4 && w === answer ? 0 : 1
                  }}>{w}</span>
          ))}
        </div>
      </div>
    </Center>
  );
}

function PreviewPhonics({ color }) {
  const step = useStep(4, 700);
  return (
    <Center>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          {["c","a","t"].map((l,i) => (
            <div key={l} className="w-16 h-16 rounded-xl flex items-center justify-center text-[32px] font-bold transition-all"
                 style={{ background: step === i ? color : color+"15", color: step === i ? "#fff" : color, transform: step === i ? "scale(1.1)" : "scale(1)" }}>{l}</div>
          ))}
        </div>
        <p className="mono text-[12px] text-ink-3">
          {step < 3 ? ["/k/","/æ/","/t/"][step] : <span style={{color, fontWeight:700}}>"cat" 🐱</span>}
        </p>
      </div>
    </Center>
  );
}

function PreviewComprehension({ color }) {
  return (
    <Center>
      <div className="max-w-[300px]">
        <p className="text-[13px] text-ink-2 leading-relaxed">
          "Ria watered the <span className="px-1 rounded font-semibold" style={{background:color+"22",color}}>mango</span> tree every evening…"
        </p>
        <p className="mt-5 text-[12px] mono text-ink-3">What did Ria do every evening?</p>
      </div>
    </Center>
  );
}

function PreviewPoetry({ color }) {
  return (
    <Center>
      <div className="text-center italic text-[15px] leading-relaxed text-ink">
        <p>Twinkle, twinkle, little star…</p>
        <p className="mt-3 mono text-[11px] text-ink-3 not-italic">Rhyme scheme: <span style={{color}}>AABB</span></p>
      </div>
    </Center>
  );
}

function PreviewEssay({ color }) {
  return (
    <Center>
      <div className="space-y-1.5 w-[70%] max-w-[280px]">
        {["Intro","Point 1","Point 2","Point 3","Conclusion"].map((l,i) => (
          <div key={l} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] mono font-bold text-white" style={{background:color}}>{i+1}</span>
            <span className="text-[13px]">{l}</span>
          </div>
        ))}
      </div>
    </Center>
  );
}

function PreviewHindi({ color }) {
  return (
    <Center>
      <div className="text-center">
        <p className="text-[28px] font-bold" style={{color}}>क्रिया</p>
        <p className="mt-3 text-[13px] text-ink-2">वह दौड़ता है।</p>
        <p className="mt-1 mono text-[11px] text-ink-3">verb · present tense</p>
      </div>
    </Center>
  );
}

function PreviewLogic({ color }) {
  const step = useStep(6, 700);
  const vals = [1,3,6,10, step >= 5 ? 15 : "?"];
  return (
    <Center>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {vals.map((n,i) => (
            <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center text-[18px] font-bold transition-all ${n==="?"?"border-2 border-dashed border-ink-3/40 text-ink-3":""}`}
                 style={n!=="?" ? { background: step >= i+1 ? color+"22" : "#F5F5F7", color, transform: step === i ? "scale(1.15)" : "scale(1)" } : {}}>{n}</div>
          ))}
        </div>
        <p className="mono text-[11px]" style={{color: step>=5?color:"#8E8E93"}}>
          {step < 5 ? "+2, +3, +4, +5 …" : "✓ next is 15"}
        </p>
      </div>
    </Center>
  );
}

function PreviewPuzzle({ color }) {
  return (
    <Center>
      <div className="grid grid-cols-3 gap-1.5">
        {[1,2,3,4,5,6,7,8,null].map((n,i) => (
          <div key={i} className="w-12 h-12 rounded-md flex items-center justify-center font-bold text-[16px]"
               style={{ background: n==null?"transparent":color+"18", color, border: n==null?"2px dashed "+color+"55":"none" }}>{n}</div>
        ))}
      </div>
    </Center>
  );
}

function PreviewCoding({ color }) {
  const step = useStep(4, 650);
  return (
    <Center>
      <div className="flex items-center gap-6">
        <div className="space-y-1.5 font-mono text-[13px]">
          {["repeat 4 times:","  move forward","  turn right","end"].map((l,i) => (
            <div key={i} className="px-3 py-1.5 rounded-md transition-all" style={{
              background: step === i ? color : (i%2===0?color+"12":"#F5F5F7"),
              color: step === i ? "#fff" : (i%2===0?color:"#1D1D1F")
            }}>{l}</div>
          ))}
        </div>
        <svg viewBox="0 0 80 80" className="w-20 h-20">
          <rect x="10" y="10" width="60" height="60" fill="none" stroke={color} strokeWidth="2" className="lg-dash"/>
          <circle cx={[10,70,70,10][step]} cy={[10,10,70,70][step]} r="5" fill={color} style={{transition:"all .5s"}}/>
        </svg>
      </div>
    </Center>
  );
}

function PreviewSpatial({ color }) {
  return (
    <Center>
      <svg viewBox="0 0 200 140" className="w-[60%]">
        <polygon points="50,30 90,10 90,80 50,100" fill={color+"33"} stroke={color} strokeWidth="2"/>
        <polygon points="90,10 130,30 130,100 90,80" fill={color+"55"} stroke={color} strokeWidth="2"/>
        <polygon points="50,30 90,10 130,30 90,50" fill={color} opacity="0.9"/>
      </svg>
    </Center>
  );
}

function PreviewData({ color }) {
  const [heights, setHeights] = useState([3,5,4,7,6,8]);
  useEffect(() => {
    const id = setInterval(() => setHeights(h => h.map(() => Math.floor(Math.random()*7)+2)), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <Center>
      <div className="flex items-end gap-2 h-28">
        {heights.map((h,i) => (
          <div key={i} className="w-6 rounded-t-md" style={{height:`${h*10}%`, background:color, transition:"height .9s cubic-bezier(.2,.8,.2,1)"}}/>
        ))}
      </div>
    </Center>
  );
}

function PreviewCivics({ color }) {
  const step = useStep(4, 1100);
  const rights = ["Equality","Freedom","Education","Speech"];
  return (
    <Center>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-[26px] transition-all"
                 style={{ background: color+"20", color, transform: step < 2 ? "rotate(-8deg)" : step === 2 ? "rotate(8deg)" : "rotate(0deg)" }}>⚖︎</div>
            <span className="mono text-[10px] text-ink-3">balance</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {rights.map((r,i) => (
              <div key={r} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: step >= i ? color : color+"33" }}/>
                <span className="text-[13px] transition-all" style={{ color: step >= i ? color : "#8E8E93", fontWeight: step === i ? 700 : 400 }}>
                  Fundamental Right · {r}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Center>
  );
}

function PreviewGovernment({ color }) {
  const step = useStep(4, 1000);
  const branches = [
    { k: "Legislature", icon: "🏛", desc: "makes laws" },
    { k: "Executive",   icon: "👤", desc: "enforces laws" },
    { k: "Judiciary",   icon: "§",  desc: "interprets laws" },
  ];
  return (
    <Center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-[13px] font-bold transition-all"
             style={{ background: color, color: "#fff", transform: step === 3 ? "scale(1.1)" : "scale(1)" }}>We</div>
        <svg viewBox="0 0 240 40" className="w-[260px]">
          <line x1="120" y1="0" x2="40"  y2="40" stroke={color} strokeWidth="2" opacity={step >= 1 ? 1 : 0.2} className={step >= 1 ? "lg-dash" : ""}/>
          <line x1="120" y1="0" x2="120" y2="40" stroke={color} strokeWidth="2" opacity={step >= 2 ? 1 : 0.2} className={step >= 2 ? "lg-dash" : ""}/>
          <line x1="120" y1="0" x2="200" y2="40" stroke={color} strokeWidth="2" opacity={step >= 3 ? 1 : 0.2} className={step >= 3 ? "lg-dash" : ""}/>
        </svg>
        <div className="flex gap-3">
          {branches.map((b,i) => (
            <div key={b.k} className="flex flex-col items-center gap-1.5 transition-all"
                 style={{ opacity: step >= i ? 1 : 0.3, transform: step === i+1 ? "translateY(-4px)" : "none" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px]" style={{ background: color+"18", color }}>{b.icon}</div>
              <span className="mono text-[10px] font-semibold" style={{color}}>{b.k}</span>
              <span className="mono text-[9px] text-ink-3">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </Center>
  );
}

function PreviewGeography({ color }) {
  const step = useStep(4, 1000);
  return (
    <Center>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 220 160" className="w-[200px]">
          <circle cx="110" cy="80" r="70" fill="#F5F5F7" stroke="#D1D1D6"/>
          <path d="M55 60 Q80 45 100 55 T140 60 Q155 70 150 90 T110 105 Q80 110 65 95 Z" fill={color} opacity="0.35"/>
          <path d="M130 105 Q150 100 160 115 T155 130 Q140 135 125 120 Z" fill={color} opacity="0.35"/>
          <line x1="40" y1="80" x2="180" y2="80" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={step >= 2 ? 0.8 : 0.25}/>
          <g style={{ transformOrigin: "110px 80px" }} className="lg-orbit">
            <circle cx="180" cy="80" r="3" fill={color}/>
          </g>
          <circle cx="95" cy="70" r="4" fill={color} className="lg-pulse"/>
        </svg>
        <div className="flex flex-col gap-1.5">
          {["Continents","Countries","Climate","Economy"].map((l,i) => (
            <div key={l} className="flex items-center gap-2 transition-all" style={{ opacity: step >= i ? 1 : 0.35 }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}/>
              <span className="text-[12px] mono" style={{ color: step === i ? color : "#1D1D1F", fontWeight: step === i ? 700 : 500 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </Center>
  );
}

function PreviewSocial({ color }) {
  const step = useStep(4, 900);
  const pins = [
    { x: 70,  y: 70, label: "school" },
    { x: 150, y: 95, label: "park"   },
    { x: 180, y: 50, label: "market" },
  ];
  return (
    <Center>
      <svg viewBox="0 0 220 160" className="w-[80%] max-w-[320px]">
        <rect x="10" y="10" width="200" height="140" rx="8" fill="#F5F5F7" stroke="#D1D1D6"/>
        <g stroke="#D1D1D6" strokeWidth="0.5">
          <line x1="10" y1="50"  x2="210" y2="50"/>
          <line x1="10" y1="110" x2="210" y2="110"/>
          <line x1="70" y1="10"  x2="70"  y2="150"/>
          <line x1="150" y1="10" x2="150" y2="150"/>
        </g>
        <path d="M30 130 L70 130 L70 70 L150 70 L150 95 L180 95 L180 50"
              stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
              className="lg-dash" pathLength="300"/>
        <rect x="24" y="120" width="14" height="14" fill={color} rx="2"/>
        <text x="31" y="148" fontSize="8" textAnchor="middle" fill="#6E6E73" className="mono">home</text>
        {pins.map((p,i) => (
          <g key={p.label} style={{ opacity: step >= i ? 1 : 0.3, transition: "opacity .4s" }}>
            <circle cx={p.x} cy={p.y} r="5" fill={color} className={step === i ? "lg-pulse" : ""}/>
            <text x={p.x} y={p.y - 10} fontSize="8" textAnchor="middle" fill="#1D1D1F" className="mono">{p.label}</text>
          </g>
        ))}
      </svg>
    </Center>
  );
}

function PreviewHistory({ color }) {
  const step = useStep(4, 900);
  const events = [["1857",5,"Revolt"],["1919",35,"J. Bagh"],["1947",70,"Indep."],["1950",90,"Constitution"]];
  return (
    <Center>
      <div className="w-full max-w-[340px] relative h-20">
        <div className="h-1 rounded-full absolute top-4 left-0 right-0" style={{background:color+"33"}}/>
        <div className="h-1 rounded-full absolute top-4 left-0" style={{background:color, width: `${[5,35,70,90][step]}%`, transition:"width 1s ease-out"}}/>
        {events.map(([y,p,label],i) => (
          <div key={y} className="absolute top-2" style={{left:`${p}%`, transform:"translateX(-50%)"}}>
            <div className="w-3 h-3 rounded-full transition-all" style={{background: step >= i ? color : color+"44", transform: step === i ? "scale(1.4)" : "scale(1)"}}/>
            <p className="mono text-[10px] mt-1.5 text-center transition-all" style={{color: step === i ? color : "#8E8E93", fontWeight: step === i ? 700 : 400}}>{y}</p>
            <p className="mono text-[9px] text-ink-3 text-center">{label}</p>
          </div>
        ))}
      </div>
    </Center>
  );
}

function GoalPreview({ kind, color, course }) {
  const c = (course || "").toLowerCase();
  if (c.includes("arithmetic"))    return <PreviewArithmetic color={color} />;
  if (c.includes("proportional"))  return <PreviewProportional color={color} />;
  if (c.includes("probability") || c.includes("chance")) return <PreviewProbability color={color} />;
  if (c.includes("visual algebra")) return <PreviewVisualAlgebra color={color} />;
  if (c.includes("solving"))       return <PreviewSolving color={color} />;
  if (c.includes("quadratic"))     return <PreviewQuadratics color={color} />;
  if (c.includes("mensuration"))   return <PreviewMensuration color={color} />;
  if (c.includes("states of matter")) return <PreviewStates color={color} />;
  if (c.includes("energy"))        return <PreviewEnergy color={color} />;
  if (c.includes("cell"))          return <PreviewCells color={color} />;
  if (c.includes("light"))         return <PreviewLight color={color} />;
  if (c.includes("chemistry"))     return <PreviewChemistry color={color} />;
  if (c.includes("human body"))    return <PreviewBody color={color} />;
  if (c.includes("environment"))   return <PreviewScience color={color} />;
  if (c.includes("phonics"))       return <PreviewPhonics color={color} />;
  if (c.includes("comprehension")) return <PreviewComprehension color={color} />;
  if (c.includes("grammar") || c.includes("tenses")) return <PreviewLanguage color={color} />;
  if (c.includes("poetry"))        return <PreviewPoetry color={color} />;
  if (c.includes("essay"))         return <PreviewEssay color={color} />;
  if (c.includes("व्याकरण") || c.includes("hindi")) return <PreviewHindi color={color} />;
  if (c.includes("regional"))      return <PreviewLanguage color={color} />;
  if (c.includes("pattern") || c.includes("sequence")) return <PreviewLogic color={color} />;
  if (c.includes("puzzle"))        return <PreviewPuzzle color={color} />;
  if (c.includes("coding"))        return <PreviewCoding color={color} />;
  if (c.includes("spatial"))       return <PreviewSpatial color={color} />;
  if (c.includes("data handling")) return <PreviewData color={color} />;
  if (c.includes("strategy"))      return <PreviewPuzzle color={color} />;
  if (c.includes("neighbour"))     return <PreviewSocial color={color} />;
  if (c.includes("civics"))        return <PreviewCivics color={color} />;
  if (c.includes("history"))       return <PreviewHistory color={color} />;
  if (c.includes("geography"))     return <PreviewGeography color={color} />;
  if (c.includes("econom"))        return <PreviewData color={color} />;
  if (c.includes("government"))    return <PreviewGovernment color={color} />;
  if (kind === "quadratics") return <PreviewQuadratics color={color} />;
  if (kind === "science")    return <PreviewScience color={color} />;
  if (kind === "language")   return <PreviewLanguage color={color} />;
  if (kind === "logic")      return <PreviewLogic color={color} />;
  return <PreviewSocial color={color} />;
}

function LearningGoals() {
  const [tab, setTab] = useState(0);
  const [courseIdx, setCourseIdx] = useState(5);
  const t = GOAL_TABS[tab];
  useEffect(() => { setCourseIdx(Math.min(5, t.courses.length - 1)); }, [tab]);
  const activeCourse = t.courses[courseIdx] || t.courses[0];

  return (
    <section id="goals" className="py-24 md:py-32 bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
           style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-white/50 text-center">Learning goals</p>
        <h2 className="display text-[44px] md:text-[68px] leading-[1] text-center mt-4 text-white">
          Reach big learning goals.
        </h2>
        <p className="text-[16px] text-white/60 text-center mt-5 max-w-[580px] mx-auto">
          Pick a goal. We'll pick the next question. Thousands of bite-sized, interactive courses — tuned to your child's class and board.
        </p>

        <div className="mt-10 flex items-center justify-center flex-wrap gap-2">
          {GOAL_TABS.map((g, i) => {
            const on = i === tab;
            return (
              <button key={g.key} onClick={() => setTab(i)}
                      className={`text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all ${on
                        ? "bg-white text-ink shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"}`}>
                {g.key}
              </button>
            );
          })}
        </div>

        <div className="mt-12 rounded-apple-2xl bg-[#0f0f11] border border-white/5 p-4 md:p-5 shadow-apple-xl">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-5 p-5 md:p-7">
              <p className="text-[15px] font-bold text-white">{t.key} Courses</p>
              <ul className="mt-5 space-y-3.5">
                {t.courses.map((c, i) => {
                  const on = i === courseIdx;
                  return (
                    <li key={c}>
                      <button onClick={() => setCourseIdx(i)}
                              className="group flex items-center gap-3 text-[14px] w-full text-left transition-colors">
                        <span className="w-1 h-1 rounded-full transition-colors"
                              style={{ background: on ? t.color : "rgba(255,255,255,0.3)" }} />
                        <span className={on ? "font-semibold" : "text-white/75 group-hover:text-white"}
                              style={on ? { color: t.color } : {}}>{c}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="md:col-span-7 rounded-apple-xl bg-white text-ink p-6 md:p-8 min-h-[360px] flex flex-col justify-between">
              <div key={t.key + courseIdx} className="fade-in flex-1 flex flex-col">
                <GoalPreview kind={t.preview} color={t.color} course={activeCourse} />
              </div>
              <p className="text-[15px] font-bold text-ink mt-6">{activeCourse}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <a href="#cta" className="bg-apple-green hover:brightness-110 text-white font-semibold text-[14px] px-6 py-3 rounded-full">
            Get started
          </a>
          <a href="#subjects" className="text-[13px] text-white/70 hover:text-white font-medium px-5 py-3 rounded-full border border-white/10 hover:bg-white/5">
            Browse all courses
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PRICING
   ========================================================= */
function Pricing() {
  const [yearly, setYearly] = useState(false);
  const plans = [
    {
      name: "Free", badge: "Start here", priceM: 0, priceY: 0, accent: "#8E8E93",
      features: ["Math subject only","10 AI explanations / day","Study planner","Basic practice","Streaks & badges"],
      cta: "Start free",
    },
    {
      name: "Pro", badge: "Most popular", priceM: 199, priceY: 1990, accent: "#007AFF",
      features: ["All 5 subjects","100 AI explanations / day","Voice Tutor (EN + HI)","Live competition rooms","Full analytics + prediction","Doubt chat per question"],
      cta: "Go Pro", featured: true,
    },
    {
      name: "Premium", badge: "For toppers", priceM: 499, priceY: 4990, accent: "#AF52DE",
      features: ["Everything in Pro","500 AI explanations / day","AI-generated practice tests","Parent/teacher portal","Priority question review","Early access features"],
      cta: "Go Premium",
    },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 bg-paper-2 border-y hairline">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">Pricing</p>
        <div className="flex items-end justify-between flex-wrap gap-6 mt-3">
          <h2 className="display text-[40px] md:text-[56px] leading-[1] max-w-[700px]">
            A price you can say yes to.
          </h2>
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border hairline">
            {["Monthly","Yearly −17%"].map((t, i) => {
              const on = (i === 1) === yearly;
              return (
                <button key={t} onClick={() => setYearly(i===1)}
                        className={`text-[12px] font-semibold px-4 py-1.5 rounded-full transition-all ${on ? "bg-ink text-white" : "text-ink-3"}`}>{t}</button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {plans.map(p => {
            const price = yearly ? p.priceY : p.priceM;
            const suffix = yearly ? "/yr" : "/mo";
            return (
              <div key={p.name}
                   className={`relative rounded-apple-2xl p-5 md:p-7 flex flex-col ${p.featured
                     ? "bg-ink text-white shadow-apple-xl md:scale-[1.02] border border-white/10"
                     : "bg-white border hairline shadow-apple"}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-[12px] mono uppercase ${p.featured ? "text-white/60" : "text-ink-3"}`}>{p.name}</p>
                  {p.featured && <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-apple-blue text-white">POPULAR</span>}
                </div>
                <div className="mt-4">
                  <span className={`text-[12px] ${p.featured ? "text-white/60" : "text-ink-3"}`}>₹</span>
                  <span className="text-[56px] font-bold tracking-tight leading-none" style={{ color: p.featured ? "#fff" : p.accent }}>{price}</span>
                  <span className={`text-[14px] ml-1 ${p.featured ? "text-white/60" : "text-ink-3"}`}>{suffix}</span>
                </div>
                <p className={`text-[13px] mt-1 ${p.featured ? "text-white/70" : "text-ink-3"}`}>{p.badge}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-[13px] ${p.featured ? "text-white/90" : "text-ink-2"}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 shrink-0">
                        <circle cx="7" cy="7" r="7" fill={p.accent}/>
                        <path d="M4 7.5L6 9.5L10 5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-7 py-3 rounded-full font-semibold text-[14px] ${p.featured ? "bg-white text-ink hover:bg-white/90" : "btn-primary"}`}>
                  {p.cta}
                </button>
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

/* =========================================================
   PARENT PORTAL
   ========================================================= */
function Parents() {
  const week = [
    { d:"M", min:24, on:false },{ d:"T", min:38, on:false },{ d:"W", min:12, on:false },
    { d:"T", min:45, on:false },{ d:"F", min:32, on:false },{ d:"S", min:58, on:false },
    { d:"S", min:28, on:true  },
  ];
  const maxMin = Math.max(...week.map(w=>w.min));
  const totalMin = week.reduce((a,w)=>a+w.min,0);
  const activity = [
    { time:"2m ago",  icon:"✓", color:"#34C759", text:"Mastered ", topic:"Decimals → Place value", meta:"+3 stars" },
    { time:"18m ago", icon:"⚡", color:"#FF9500", text:"Beat ",     topic:"Riya in Live Quiz · Algebra",  meta:"rank #2" },
    { time:"1h ago",  icon:"❓", color:"#FF3B30", text:"Stuck on ", topic:"Fractions → Like / unlike",   meta:"asked tutor" },
    { time:"yest.",   icon:"📖", color:"#007AFF", text:"Finished ", topic:"Chapter 4 · Integers",        meta:"18 min" },
  ];

  return (
    <section id="parents" className="py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-5 md:sticky md:top-24">
          <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">For parents &amp; teachers</p>
          <h2 className="display text-[40px] md:text-[56px] leading-[1] mt-3">
            Watch the work, not the screen.
          </h2>
          <p className="text-[16px] text-ink-2 mt-5 leading-relaxed">
            Your child generates an 8-character invite code. You link once, then see accuracy, streaks, weak topics, and badges — read-only, no nudging over the shoulder.
          </p>
          <ul className="mt-6 space-y-2 text-[14px] text-ink-2">
            {[
              "Weekly digest in your inbox",
              "Link multiple children from one account",
              "Teacher dashboard for up to 40 students",
              "Never shows your child's private chats or notes",
            ].map(x => (
              <li key={x} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-ink-2" />{x}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-7">
          <div className="relative rounded-apple-2xl border hairline bg-white shadow-apple-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b hairline bg-paper-2/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                     style={{ background:"linear-gradient(135deg,#007AFF,#AF52DE)" }}>A</div>
                <div>
                  <p className="text-[13px] font-semibold leading-tight">Aarav Sharma</p>
                  <p className="text-[11px] text-ink-3 mono">Class 6 · CBSE · invited 14 days ago</p>
                </div>
              </div>
              <span className="text-[10px] mono px-2.5 py-1 rounded-full bg-apple-green/10 text-apple-green flex items-center gap-1.5">
                <span className="relative w-1.5 h-1.5 rounded-full bg-apple-green">
                  <span className="absolute inset-0 rounded-full bg-apple-green animate-ping opacity-60" />
                </span>
                LEARNING NOW
              </span>
            </div>

            <div className="p-5 md:p-7">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l:"Accuracy",  v:"82", suffix:"%", c:"#007AFF", trend:"+6 vs last wk", up:true },
                  { l:"Streak",    v:"27", suffix:"d", c:"#FF9500", trend:"personal best", up:true },
                  { l:"Predicted", v:"A1", suffix:"",  c:"#AF52DE", trend:"82–88 / 80",   up:true },
                ].map(k => (
                  <div key={k.l} className="p-4 rounded-apple-lg bg-paper-2 border hairline">
                    <p className="text-[10px] mono text-ink-3 uppercase tracking-wider">{k.l}</p>
                    <p className="text-[26px] md:text-[32px] font-bold tracking-tight mt-1 leading-none" style={{color:k.c}}>
                      {k.v}<span className="text-[14px] font-semibold">{k.suffix}</span>
                    </p>
                    <p className="text-[10px] mono mt-1 flex items-center gap-1" style={{color: k.up ? "#34C759" : "#FF3B30"}}>
                      <span>{k.up ? "▲" : "▼"}</span> <span className="text-ink-3">{k.trend}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] mono text-ink-3 uppercase tracking-wider">Weekly practice</p>
                  <p className="text-[11px] mono text-ink-3"><span className="text-ink font-semibold">{Math.floor(totalMin/60)}h {totalMin%60}m</span> this week</p>
                </div>
                <div className="flex items-end gap-2 h-24 mt-3">
                  {week.map((w,i) => {
                    const pct = (w.min / maxMin) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="relative w-full flex-1 flex items-end">
                          <div className="w-full rounded-t-md transition-all duration-700 bar-grow"
                               style={{ height: `${pct}%`, background: w.on ? "linear-gradient(180deg,#007AFF,#5856D6)" : "#007AFF33", animationDelay: `${i*70}ms` }}/>
                          {w.on && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] mono font-semibold text-apple-blue whitespace-nowrap">
                              {w.min}m
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] mono ${w.on ? "text-apple-blue font-bold" : "text-ink-3"}`}>{w.d}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[11px] mono text-ink-3 uppercase tracking-wider mb-2.5">Subject mastery</p>
                <div className="space-y-2">
                  {[
                    { s:"Mathematics", pct:84, col:"#007AFF" },
                    { s:"Science",     pct:71, col:"#34C759" },
                    { s:"English",     pct:62, col:"#FF9500" },
                    { s:"Social Std.", pct:48, col:"#AF52DE" },
                  ].map((x,i) => (
                    <div key={x.s} className="flex items-center gap-3">
                      <span className="text-[12px] w-24 text-ink truncate">{x.s}</span>
                      <div className="flex-1 h-2 rounded-full bg-apple-gray6 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width:`${x.pct}%`, background: x.col, animationDelay:`${i*80}ms` }}/>
                      </div>
                      <span className="text-[11px] mono font-semibold text-ink-2 w-9 text-right">{x.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-apple-lg border hairline bg-paper-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] mono uppercase tracking-wider text-apple-red">Weak topics</p>
                    <span className="text-[10px] mono text-ink-3">3</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["Fractions","Long division","Tenses"].map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-apple-red/10 text-apple-red font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-apple-lg border hairline bg-paper-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] mono uppercase tracking-wider text-apple-green">Mastered this week</p>
                    <span className="text-[10px] mono text-ink-3">5</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["Place value","Integers","Photosynthesis","Verbs","Maps"].map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[11px] mono text-ink-3 uppercase tracking-wider mb-2.5">Today's activity</p>
                <div className="rounded-apple-lg border hairline overflow-hidden">
                  {activity.map((a,i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i!==0 ? "border-t hairline" : ""} bg-white`}>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] shrink-0"
                            style={{ background: a.color + "1A", color: a.color }}>{a.icon}</span>
                      <p className="text-[13px] text-ink-2 leading-snug flex-1 min-w-0">
                        <span className="text-ink-3">{a.text}</span>
                        <span className="text-ink font-semibold">{a.topic}</span>
                      </p>
                      <span className="text-[10px] mono text-ink-3 shrink-0">{a.meta}</span>
                      <span className="text-[10px] mono text-ink-3 shrink-0 hidden sm:inline">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[11px] mono text-ink-3">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5V3.5a3 3 0 016 0V5m-7 0h8v5a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" stroke="currentColor" strokeWidth="1"/>
                </svg>
                Read-only view · private chats and notes are never shared
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TESTIMONIALS
   ========================================================= */
function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-paper-2 border-y hairline">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">From students &amp; parents</p>
        <h2 className="display text-[36px] md:text-[48px] leading-[1.05] mt-4 max-w-[680px] mx-auto">
          Real stories, coming soon.
        </h2>
        <p className="text-[15px] text-ink-2 mt-5 max-w-[560px] mx-auto leading-relaxed">
          We're just getting started. Once families begin building their own skies with Stellar, their words will live here — unfiltered, unscripted, and only when they're ready to share.
        </p>
        <a href="#cta" className="btn-primary inline-flex font-semibold text-[14px] px-6 py-3 rounded-full shadow-apple-md mt-8">
          Be one of the first families →
        </a>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
   ========================================================= */
function FAQ() {
  const qs = [
    ["Which classes and boards do you cover?", "Class 1 through Class 10, across CBSE, ICSE/ISC, IB (PYP and MYP), and every major Indian state board. Syllabi are matched chapter-by-chapter to the board your child's school follows — so the practice your child sees is exactly what their school teacher assigns."],
    ["How does the AI actually help?", "Every wrong answer is classified (guessing, concept gap, calculation slip, misinterpretation). We then route a free static explanation, a cached response, or — only if genuinely novel — a fresh Claude Haiku 4.5 call. You get instant, specific feedback; we keep costs honest."],
    ["Can parents see my private work?", "No. Parents see aggregate metrics — accuracy, streak, weak topics, badges. They do not see your doubt chats, notes, or individual answers."],
    ["What's the difference between Pro and Premium?", "Pro gives you 100 AI calls/day and all 5 subjects. Premium gives 500/day, AI-generated practice tests, and the parent/teacher portal — useful if you're preparing with a coach."],
    ["Does it work offline?", "Today's plan, current lesson, and queued attempts work offline. Changes sync when you're back online."],
    ["Is there a free tier forever?", "Yes. Free covers Math, the planner, streaks, and 10 AI calls/day — enough to commit to a habit before paying."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-[880px] mx-auto px-6">
        <p className="text-[11px] mono uppercase tracking-[0.2em] text-ink-3">Questions</p>
        <h2 className="display text-[40px] md:text-[56px] leading-[1] mt-3">The small print, without the print.</h2>
        <div className="mt-10 divide-y hairline border-y hairline">
          {qs.map(([q,a], i) => {
            const on = open === i;
            return (
              <button key={q} onClick={() => setOpen(on ? -1 : i)} className="w-full text-left py-5 flex items-start gap-5">
                <span className="mono text-[12px] text-ink-3 pt-1 w-8">{String(i+1).padStart(2,"0")}</span>
                <div className="flex-1">
                  <p className="text-[17px] font-semibold">{q}</p>
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

/* =========================================================
   FINAL CTA
   ========================================================= */
function FinalCTA({ accent }) {
  return (
    <section id="cta" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="max-w-[880px] mx-auto px-6 text-center relative">
        <div className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.2em] text-ink-3 bg-white border hairline rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{background:accent}} /> From Class 1 to Class 10 · every major board
        </div>
        <h2 className="display text-[48px] md:text-[80px] leading-[0.95] mt-6">
          Stop revising. <br/><span className="gradient-text">Start thinking.</span>
        </h2>
        <p className="text-[17px] text-ink-2 mt-6 max-w-[560px] mx-auto">
          Sign up in 30 seconds. No card. 10 minutes and you'll know where you actually stand.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/start" className="btn-primary font-semibold text-[15px] px-7 py-4 rounded-full shadow-apple-md">
            Start free diagnostic →
          </Link>
          <a href="#pricing" className="text-[14px] font-medium text-ink px-6 py-4 rounded-full border hairline bg-white hover:bg-paper-2">
            See pricing
          </a>
        </div>
        <p className="text-[12px] mono text-ink-3 mt-6">Be among the first to join.</p>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */
function Footer({ accent }) {
  const cols = [
    ["Product",   ["Features","Subjects","Voice Tutor","Live Rooms","Planner","Pricing"]],
    ["For you",   ["Students","Parents","Teachers","Coaching centres","Schools"]],
    ["Company",   ["About","Manifesto","Careers","Press","Contact"]],
    ["Resources", ["Syllabus library","PYQ archive","Blog","Status","API"]],
  ];
  return (
    <footer className="bg-paper border-t hairline pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <Logo accent={accent} />
              <span className="font-semibold text-[15px]">Stellar</span>
            </div>
            <p className="text-[13px] text-ink-2 mt-4 max-w-[320px] leading-relaxed">
              Building stars — a study partner built for how your child actually thinks. Class 1 to 10, CBSE · ICSE · IB · State Boards.
            </p>
          </div>
          {cols.map(([h, items]) => (
            <div key={h} className="md:col-span-2">
              <p className="text-[11px] mono uppercase text-ink-3 tracking-wider">{h}</p>
              <ul className="mt-4 space-y-2.5">
                {items.map(x => <li key={x}><a href="#" className="text-[13px] text-ink-2 hover:text-ink">{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-6 border-t hairline flex items-center justify-between flex-wrap gap-3 text-[12px] text-ink-3">
          <p></p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Refund policy</a>
            <a href="#" className="hover:text-ink">Responsible AI</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   STICKY BOTTOM CTA
   ========================================================= */
function StickyCta({ show }) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const h = () => setSeen(window.scrollY > 800);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show || !seen) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-ink text-white rounded-full shadow-apple-xl pl-5 pr-2 py-2 flex items-center gap-4 fade-in">
      <span className="text-[12px]">Ready to think sharper?</span>
      <Link to="/start" className="btn-primary text-[12px] font-semibold px-4 py-1.5 rounded-full">Start free →</Link>
    </div>
  );
}

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */
export default function Landing() {
  return (
    <div>
      <style>{`
        .gradient-text {
          background: linear-gradient(120deg, ${ACCENT}, #5856D6 60%, #AF52DE);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @keyframes lg-swing { 0%,100%{transform:rotate(-35deg)} 50%{transform:rotate(35deg)} }
      `}</style>
      <TopBar accent={ACCENT} />
      <Hero />
      <Manifesto />
      <ProductTour />
      <Features />
      <HowItWorks />
      <LearningGoals />
      <Pricing />
      <Parents />
      <Testimonials />
      <FAQ />
      <FinalCTA accent={ACCENT} />
      <Footer accent={ACCENT} />
      <StickyCta show={true} />
    </div>
  );
}
