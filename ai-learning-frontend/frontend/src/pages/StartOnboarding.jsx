import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { updateMe } from "../services/api";
import { useAuthStore } from "../store/authStore";

// ─── Constants ──────────────────────────────────────────────────────
const GRADES = ["8", "9", "10", "11", "12"];

const GOALS = [
  { value: "pass",        label: "Pass the exam",            emoji: "🎯", sub: "Clear boards comfortably" },
  { value: "distinction", label: "Score 75%+",               emoji: "⭐", sub: "Distinction level" },
  { value: "top",         label: "Top 90%+",                 emoji: "🏆", sub: "Top of class" },
  { value: "scholarship", label: "Scholarship rank",          emoji: "🎓", sub: "Highest achievers" },
];

const TOPICS = [
  "Real Numbers", "Polynomials", "Linear Equations",
  "Quadratic Equations", "Arithmetic Progressions",
  "Triangles", "Coordinate Geometry", "Trigonometry",
  "Circles", "Surface Areas & Volumes", "Statistics", "Probability",
];

const ANALYZE_MESSAGES = [
  "Analyzing your learning profile…",
  "Identifying knowledge gaps…",
  "Building your personalized plan…",
  "Activating AI coach…",
  "Almost ready…",
];

const TOTAL_STEPS = 6; // 0–6 (7 screens, entry doesn't count)

// ─── Main component ──────────────────────────────────────────────────
export default function StartOnboarding() {
  const [step, setStep]           = useState(0);
  const [grade, setGrade]         = useState("10");
  const [goal, setGoal]           = useState("distinction");
  const [examDate, setExamDate]   = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const [analyzeIdx, setAnalyzeIdx] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [form, setForm]           = useState({ name: "", email: "", password: "" });
  const [error, setError]         = useState("");
  const [saving, setSaving]       = useState(false);
  const { setAuth }               = useAuthStore();
  const navigate                  = useNavigate();

  // Auto-run analysis animation on step 5
  useEffect(() => {
    if (step !== 5) return;
    setAnalyzeIdx(0);
    setAnalyzeProgress(0);

    const total = 2800;
    const tick  = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += tick;
      setAnalyzeProgress(Math.min(100, Math.round((elapsed / total) * 100)));
      setAnalyzeIdx(Math.min(ANALYZE_MESSAGES.length - 1, Math.floor((elapsed / total) * ANALYZE_MESSAGES.length)));
      if (elapsed >= total) {
        clearInterval(interval);
        setStep(6);
      }
    }, tick);

    return () => clearInterval(interval);
  }, [step]);

  const toggleTopic = (t) =>
    setWeakTopics((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate) - new Date()) / 86400000))
    : null;

  const todayFocus = weakTopics.length > 0 ? weakTopics[0] : TOPICS[7]; // default Trig

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { data } = await register({ ...form, grade, examDate });
      setAuth(data.token, data.user);
      // Save onboarding data to profile
      await updateMe({ grade, examDate, goal, weakTopics }).catch(() => {});
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Could not create account. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── STEP 0: Entry ────────────────────────────────────────────────
  if (step === 0) {
    return (
      <Screen center>
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-20 h-20 rounded-[28px] bg-apple-blue shadow-apple-lg flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-3xl font-black">A</span>
          </div>
          <h1 className="text-[32px] font-black text-[var(--label)] tracking-tight leading-tight mb-3">
            Your personal<br />AI study coach
          </h1>
          <p className="text-[15px] text-apple-gray leading-relaxed mb-10">
            Builds a plan around your weak spots, tracks your progress, and explains every mistake — like a private tutor.
          </p>
          <button onClick={() => setStep(1)} className="btn-primary w-full py-4 text-[16px] rounded-apple-xl mb-4">
            Start my learning journey →
          </button>
          <p className="text-[13px] text-apple-gray">
            Already have an account?{" "}
            <Link to="/login" className="text-apple-blue font-medium">Sign in</Link>
          </p>
        </div>
      </Screen>
    );
  }

  // ── STEP 5: AI Analyzing (auto) ──────────────────────────────────
  if (step === 5) {
    return (
      <Screen center>
        <div className="text-center max-w-xs mx-auto px-6">
          {/* Pulsing orb */}
          <div className="relative w-24 h-24 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full bg-apple-blue/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-apple-blue/30 animate-pulse" />
            <div className="w-24 h-24 rounded-full bg-apple-blue flex items-center justify-center relative shadow-apple-lg">
              <span className="text-white text-3xl">🧠</span>
            </div>
          </div>
          <h2 className="text-[22px] font-bold text-[var(--label)] mb-2">
            {ANALYZE_MESSAGES[analyzeIdx]}
          </h2>
          <p className="text-[14px] text-apple-gray mb-8">Setting up your personalized experience</p>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-apple-gray5 rounded-full overflow-hidden">
            <div
              className="h-full bg-apple-blue rounded-full transition-all duration-100"
              style={{ width: `${analyzeProgress}%` }}
            />
          </div>
          <p className="text-[12px] text-apple-gray3 mt-2">{analyzeProgress}%</p>
        </div>
      </Screen>
    );
  }

  // ── STEPS 1-4, 6, 7: Stepped flow ────────────────────────────────
  const progressStep = step <= 4 ? step : step - 1; // skip step 5 from progress

  return (
    <Screen>
      {/* Progress bar */}
      {step < 7 && (
        <div className="fixed top-0 left-0 right-0 z-10">
          <div className="h-1 bg-apple-gray5">
            <div
              className="h-1 bg-apple-blue transition-all duration-500"
              style={{ width: `${(progressStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="max-w-sm mx-auto px-6 pt-14 pb-10">

        {/* ── STEP 1: Class ──────────────────────────────────────── */}
        {step === 1 && (
          <>
            <StepLabel step={1} total={TOTAL_STEPS} />
            <h2 className="text-[26px] font-black text-[var(--label)] tracking-tight mb-1">Which class are you in?</h2>
            <p className="text-[14px] text-apple-gray mb-7">We'll load your exact syllabus and exam pattern.</p>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {GRADES.map((g) => (
                <button key={g} onClick={() => setGrade(g)}
                  className={`py-4 rounded-apple-lg font-bold text-[15px] transition-all
                    ${grade === g
                      ? "bg-apple-blue text-white shadow-apple"
                      : "bg-apple-gray6 text-[var(--label)] hover:bg-apple-gray5"
                    }`}>
                  {g}
                </button>
              ))}
            </div>
            <NavRow onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </>
        )}

        {/* ── STEP 2: Goal ───────────────────────────────────────── */}
        {step === 2 && (
          <>
            <StepLabel step={2} total={TOTAL_STEPS} />
            <h2 className="text-[26px] font-black text-[var(--label)] tracking-tight mb-1">What's your target?</h2>
            <p className="text-[14px] text-apple-gray mb-7">Be honest — we'll calibrate difficulty to match your goal.</p>
            <div className="flex flex-col gap-2.5 mb-8">
              {GOALS.map((g) => (
                <button key={g.value} onClick={() => setGoal(g.value)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-apple-lg border text-left transition-all
                    ${goal === g.value
                      ? "border-apple-blue bg-apple-blue/8 shadow-apple"
                      : "border-apple-gray5 bg-white hover:border-apple-gray4"
                    }`}>
                  <span className="text-2xl">{g.emoji}</span>
                  <div>
                    <p className={`text-[14px] font-bold ${goal === g.value ? "text-apple-blue" : "text-[var(--label)]"}`}>{g.label}</p>
                    <p className="text-[12px] text-apple-gray">{g.sub}</p>
                  </div>
                  {goal === g.value && <span className="ml-auto text-apple-blue text-lg">✓</span>}
                </button>
              ))}
            </div>
            <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </>
        )}

        {/* ── STEP 3: Exam date ──────────────────────────────────── */}
        {step === 3 && (
          <>
            <StepLabel step={3} total={TOTAL_STEPS} />
            <h2 className="text-[26px] font-black text-[var(--label)] tracking-tight mb-1">When is your exam?</h2>
            <p className="text-[14px] text-apple-gray mb-7">We'll build a day-by-day plan so nothing is left uncovered.</p>

            <input
              className="input text-[16px] py-4 mb-3"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
            {daysLeft !== null && daysLeft > 0 && (
              <div className="flex items-center gap-3 bg-apple-orange/8 border border-apple-orange/20 rounded-apple-lg px-4 py-3 mb-6">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-[14px] font-bold text-apple-orange">{daysLeft} days left</p>
                  <p className="text-[12px] text-apple-orange/70">Your plan will be built around this</p>
                </div>
              </div>
            )}

            <NavRow onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel={examDate ? "Continue →" : "Skip for now →"} />
          </>
        )}

        {/* ── STEP 4: Weak topics ────────────────────────────────── */}
        {step === 4 && (
          <>
            <StepLabel step={4} total={TOTAL_STEPS} />
            <h2 className="text-[26px] font-black text-[var(--label)] tracking-tight mb-1">Which topics feel hard?</h2>
            <p className="text-[14px] text-apple-gray mb-6">Select all that apply — we'll focus here first.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {TOPICS.map((t) => (
                <button key={t} onClick={() => toggleTopic(t)}
                  className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-all
                    ${weakTopics.includes(t)
                      ? "bg-apple-blue text-white border-apple-blue shadow-apple"
                      : "bg-apple-gray6 border-apple-gray5 text-[var(--label2)] hover:border-apple-gray4"
                    }`}>
                  {weakTopics.includes(t) && <span className="mr-1">✓</span>}{t}
                </button>
              ))}
            </div>
            {weakTopics.length > 0 && (
              <p className="text-[12px] text-apple-gray mb-4">{weakTopics.length} topic{weakTopics.length > 1 ? "s" : ""} selected</p>
            )}
            <NavRow
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
              nextLabel="Build my plan →"
              nextDisabled={false}
            />
          </>
        )}

        {/* ── STEP 6: Plan preview ───────────────────────────────── */}
        {step === 6 && (
          <>
            <div className="text-center mb-7">
              <p className="text-4xl mb-3">🎉</p>
              <h2 className="text-[26px] font-black text-[var(--label)] tracking-tight mb-1">Your plan is ready!</h2>
              <p className="text-[14px] text-apple-gray">Here's what your first day looks like</p>
            </div>

            {/* Plan card */}
            <div className="card p-5 mb-4">
              <p className="section-label mb-3">Today's Focus</p>
              <div className="flex flex-col gap-3">
                <PlanItem icon="📖" label="Start with" value={todayFocus} accent="blue" />
                <PlanItem icon="✏️" label="Practice"
                  value={`${weakTopics.length > 2 ? 15 : 10} adaptive questions`}
                  accent="green" />
                <PlanItem icon="⚡" label="Mini test"
                  value={`${weakTopics.length > 0 ? weakTopics.length * 2 + 3 : 5}-question speed round`}
                  accent="orange" />
                {daysLeft && <PlanItem icon="📅" label="Time left" value={`${daysLeft} days to exam`} accent="purple" />}
                {goal === "scholarship" || goal === "top"
                  ? <PlanItem icon="🏆" label="Target" value="Hard questions today" accent="purple" />
                  : null}
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-2 mb-7">
              {[
                { val: weakTopics.length || "All",  label: "Weak topics" },
                { val: `Class ${grade}`,             label: "Your class"  },
                { val: GOALS.find(g => g.value === goal)?.emoji || "🎯", label: GOALS.find(g => g.value === goal)?.label || "Your goal" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-apple-gray6 rounded-apple-lg p-3 text-center">
                  <p className="text-[16px] font-black text-[var(--label)]">{val}</p>
                  <p className="text-[11px] text-apple-gray mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(7)} className="btn-primary w-full py-4 text-[15px]">
              Save my plan →
            </button>
            <p className="text-[12px] text-apple-gray text-center mt-3">Free forever · No card required</p>
          </>
        )}

        {/* ── STEP 7: Create account ─────────────────────────────── */}
        {step === 7 && (
          <>
            <div className="text-center mb-7">
              <h2 className="text-[26px] font-black text-[var(--label)] tracking-tight mb-1">Save your progress</h2>
              <p className="text-[14px] text-apple-gray">Create a free account to keep your plan and streak</p>
            </div>

            {error && (
              <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider block mb-1.5">Your name</label>
                <input className="input py-3.5 text-[15px]" placeholder="e.g. Arjun Sharma"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider block mb-1.5">Email</label>
                <input className="input py-3.5 text-[15px]" type="email" placeholder="you@gmail.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider block mb-1.5">Password</label>
                <input className="input py-3.5 text-[15px]" type="password" placeholder="Min 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <button className="btn-primary w-full py-4 text-[15px] mt-2" disabled={saving}>
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up your account…
                  </span>
                ) : "Start learning for free →"}
              </button>
            </form>

            <div className="divider my-5" />
            <p className="text-[13px] text-apple-gray text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-apple-blue font-medium">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </Screen>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function Screen({ children, center = false }) {
  return (
    <div className={`min-h-screen bg-apple-gray6 ${center ? "flex items-center justify-center" : ""}`}>
      {children}
    </div>
  );
}

function StepLabel({ step, total }) {
  return <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider mb-3">Step {step} of {total}</p>;
}

function NavRow({ onBack, onNext, nextLabel = "Continue →", nextDisabled = false }) {
  return (
    <div className="flex gap-3">
      <button onClick={onBack} className="btn-secondary flex-none px-5 py-3">←</button>
      <button onClick={onNext} disabled={nextDisabled} className="btn-primary flex-1 py-3">{nextLabel}</button>
    </div>
  );
}

function PlanItem({ icon, label, value, accent }) {
  const colors = {
    blue:   "bg-apple-blue/8 text-apple-blue",
    green:  "bg-apple-green/8 text-apple-green",
    orange: "bg-apple-orange/8 text-apple-orange",
    purple: "bg-apple-purple/8 text-apple-purple",
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-apple flex items-center justify-center shrink-0 text-lg ${colors[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-apple-gray">{label}</p>
        <p className="text-[13px] font-semibold text-[var(--label)]">{value}</p>
      </div>
    </div>
  );
}
