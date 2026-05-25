/**
 * Welcome — /welcome
 *
 * Lands here right after registration (PRO_TRACK_PLAN.md decision #6 +
 * Phase 7). Asks the user which path they're here for and routes:
 *
 *   School      → /start          (board + grade picker — existing flow)
 *   Professional→ /onboarding/pro (language + experience + goal)
 *   Competitive → disabled        (Coming soon)
 *
 * Layout follows the Dashboard / StartOnboarding visual baseline:
 * card + apple-blue accent, generous spacing, no max-w cap on the page
 * root (per memory feedback_no_max_width).
 */
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const OPTIONS = [
  {
    key:        "school",
    label:      "School (K-12)",
    blurb:      "CBSE, ICSE, AP SSC and other board curricula — class 1 to class 12.",
    bullets:    ["Chapter-by-chapter lessons", "PYQs + mock papers", "Daily practice + AI tutor"],
    cta:        "Set up board & grade",
    target:     "/start",
    enabled:    true,
    gradient:   "linear-gradient(135deg,#0ea5e9,#22d3ee)",
  },
  {
    key:        "professional",
    label:      "Professional",
    blurb:      "Industrial-strength curriculum for first jobs, internships, and interviews.",
    bullets:    ["Java pilot live now", "Sandboxed code submissions", "Project portfolio at the end"],
    cta:        "Continue to professional",
    target:     "/onboarding/pro",
    enabled:    true,
    gradient:   "linear-gradient(135deg,#7c3aed,#ec4899)",
  },
  {
    key:        "competitive",
    label:      "Competitive (JEE / NEET)",
    blurb:      "Concept depth, problem-solving stamina, and exam strategy for the big two.",
    bullets:    ["Coming soon"],
    cta:        "Coming soon",
    target:     null,
    enabled:    false,
    gradient:   "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const handlePick = (opt) => {
    if (!opt.enabled || !opt.target) return;
    // Remember intent so the next screen can know where we came from.
    try { sessionStorage.setItem("stellar_intended_track", opt.key); } catch {}
    navigate(opt.target);
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-apple-blue flex items-center justify-center mx-auto mb-5">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)] mb-2">
            Welcome to Stellar, {firstName}.
          </h1>
          <p className="text-[15px] text-[var(--label2)] max-w-xl mx-auto">
            What are you here for? You can add more tracks later from Settings.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handlePick(opt)}
              disabled={!opt.enabled}
              className="card p-6 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:shadow-apple-md enabled:hover:border-apple-blue"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-[18px] font-bold mb-3"
                   style={{ background: opt.gradient }}>
                {opt.label[0]}
              </div>
              <h3 className="text-[16px] font-bold text-[var(--label)] mb-1.5">
                {opt.label}
              </h3>
              <p className="text-[12px] text-apple-gray mb-3 leading-relaxed min-h-[48px]">
                {opt.blurb}
              </p>
              <ul className="space-y-1 mb-4">
                {opt.bullets.map((b, i) => (
                  <li key={i} className="text-[12px] text-[var(--label)] flex items-start gap-1.5">
                    <span className={opt.enabled ? "text-apple-blue" : "text-apple-gray"}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <span className={`text-[12px] font-semibold ${opt.enabled ? "text-apple-blue group-enabled:group-hover:opacity-70" : "text-apple-gray"}`}>
                {opt.cta} {opt.enabled && "→"}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-[12px] text-[var(--label3)] mt-8">
          Not sure? Pick School to start — you can always come back here from Settings.
        </p>
      </div>
    </div>
  );
}
