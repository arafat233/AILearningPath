/**
 * Pro onboarding — /onboarding/pro
 *
 * PRO_TRACK_PLAN.md Phase 7 — captures language + experience + goal +
 * optional current role from the user, then enrols them in pro_java (the
 * only live language for the pilot). On success → /pro/java.
 *
 * The "experience" + "goal" + "currentRole" fields are saved client-side
 * for now (session storage) so analytics can pick them up when Phase 10
 * wires events. We deliberately don't bloat the User schema yet — these
 * become part of the ProProfile model once we extend beyond the pilot.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { proEnroll, getMe } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

const LANGUAGES = [
  { value: "java",       label: "Java",       enabled: true,  hint: "Pilot — fully wired" },
  { value: "python",     label: "Python",     enabled: false, hint: "Coming soon" },
  { value: "javascript", label: "JavaScript", enabled: false, hint: "Coming soon" },
  { value: "cpp",        label: "C++",        enabled: false, hint: "Coming soon" },
];

const EXPERIENCES = [
  { value: "beginner",    label: "Beginner",       blurb: "Brand new to programming" },
  { value: "some_coding", label: "Some coding",    blurb: "Built a few small things" },
  { value: "experienced", label: "Experienced",    blurb: "Already shipped real software" },
];

const GOALS = [
  { value: "first_job",        label: "Land my first job" },
  { value: "switch_jobs",      label: "Switch jobs / roles" },
  { value: "hobby",            label: "Hobby / learn for fun" },
  { value: "personal_project", label: "Build a personal project" },
];

export default function ProOnboarding() {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);

  const [language, setLanguage]       = useState("java");
  const [experience, setExperience]   = useState("beginner");
  const [goal, setGoal]               = useState("first_job");
  const [currentRole, setCurrentRole] = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language) { setError("Pick a language."); return; }
    setSaving(true);
    setError("");
    try {
      // Stash the soft fields locally — we'll persist them via ProProgress
      // metadata in a follow-up. For the pilot the only DB write is enroll.
      try {
        sessionStorage.setItem("stellar_pro_onboarding", JSON.stringify({ language, experience, goal, currentRole }));
      } catch {}
      await proEnroll(`pro_${language}`);
      // Refresh authStore so user.tracks reflects the new enrolment — otherwise
      // OnboardingGate sees empty tracks and bounces back to /welcome.
      try {
        const { data } = await getMe();
        const fresh = data?.data?.user;
        if (fresh) useAuthStore.getState().setAuth(null, fresh);
      } catch {}
      navigate(`/pro/${language}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not enroll. Try again.");
      setSaving(false);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
               style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--label)] mb-1">
            Set up your professional track
          </h1>
          <p className="text-[14px] text-[var(--label2)] max-w-md mx-auto">
            Hi {firstName} — a few quick questions so we can route you to the right starting topic.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-7">
          {/* ── Language ── */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[var(--label2)] mb-2.5">
              Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => l.enabled && setLanguage(l.value)}
                  disabled={!l.enabled}
                  className={[
                    "py-3 px-2 rounded-xl text-[13px] font-semibold border transition-all text-center",
                    !l.enabled ? "opacity-40 cursor-not-allowed border-[var(--separator)]" :
                      language === l.value
                        ? "bg-apple-blue text-white border-apple-blue shadow-sm"
                        : "bg-[var(--fill)] text-[var(--label)] border-[var(--separator)] hover:border-apple-blue/60",
                  ].join(" ")}
                >
                  <div>{l.label}</div>
                  <div className="text-[10px] font-normal opacity-70 mt-0.5">{l.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Experience ── */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[var(--label2)] mb-2.5">
              Experience
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {EXPERIENCES.map((x) => (
                <button
                  key={x.value}
                  type="button"
                  onClick={() => setExperience(x.value)}
                  className={[
                    "py-3 px-3 rounded-xl text-[13px] font-semibold border transition-all text-left",
                    experience === x.value
                      ? "bg-apple-blue text-white border-apple-blue shadow-sm"
                      : "bg-[var(--fill)] text-[var(--label)] border-[var(--separator)] hover:border-apple-blue/60",
                  ].join(" ")}
                >
                  <div>{x.label}</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">{x.blurb}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Goal ── */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[var(--label2)] mb-2.5">
              Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={[
                    "py-3 px-3 rounded-xl text-[13px] font-semibold border transition-all text-left",
                    goal === g.value
                      ? "bg-apple-blue text-white border-apple-blue shadow-sm"
                      : "bg-[var(--fill)] text-[var(--label)] border-[var(--separator)] hover:border-apple-blue/60",
                  ].join(" ")}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Current role (optional) ── */}
          <div>
            <label htmlFor="currentRole" className="block text-[12px] font-bold uppercase tracking-wider text-[var(--label2)] mb-2.5">
              Current role <span className="font-normal normal-case text-apple-gray">(optional)</span>
            </label>
            <input
              id="currentRole"
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              maxLength={80}
              placeholder="e.g. Student · QA engineer · Mechanical engineer"
              className="input w-full"
            />
          </div>

          {error && <p className="text-[13px] text-apple-red">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-3 text-[15px] font-semibold rounded-xl disabled:opacity-40"
          >
            {saving ? "Enrolling…" : "Start learning →"}
          </button>
        </form>

        <p className="text-center text-[12px] text-[var(--label3)] mt-6">
          You can change these later in Settings.
        </p>
      </div>
    </div>
  );
}
