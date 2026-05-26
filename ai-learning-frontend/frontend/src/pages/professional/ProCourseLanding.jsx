/**
 * ProCourseLanding — /pro/:trackSlug
 *
 * Shows the modules grouped by tier (Foundation / Intermediate / Industry /
 * DSA / Interview). Click a module → ProModuleView.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetTrack, proGetProgress } from "../../services/api";

// Tier boundaries map module number → tier label + accent color.
// Designed for the Java track (46 modules); other languages may need
// their own tier config but the shape is identical.
const TIERS = [
  { id: "foundation",  label: "Foundation",      blurb: "Java essentials — syntax, OOP, collections",                    min: 1,  max: 6,  color: "#7c3aed" },
  { id: "intermediate", label: "Intermediate",   blurb: "Exceptions, lambdas, generics, concurrency, I/O, testing",     min: 7,  max: 12, color: "#2563eb" },
  { id: "industry",     label: "Industry & Frameworks", blurb: "Spring Boot, microservices, Kafka, databases, AI, gRPC", min: 13, max: 28, color: "#0891b2" },
  { id: "dsa",          label: "DSA",            blurb: "Data structures + algorithms for interviews",                  min: 29, max: 41, color: "#ea580c" },
  { id: "interview",    label: "Interview Prep", blurb: "Mock rounds, system design, behavioral, company-specific",     min: 42, max: 46, color: "#dc2626" },
];

function tierFor(moduleNumber) {
  return TIERS.find((t) => moduleNumber >= t.min && moduleNumber <= t.max) || null;
}

export default function ProCourseLanding() {
  const { trackSlug } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    proGetTrack(trackSlug)
      .then((r) => {
        const t = r.data?.data;
        setTrack(t);
        if (t?.key) proGetProgress(t.key).then((p) => setProgress(p.data?.data)).catch(() => {});
      })
      .catch((err) => setError(err?.response?.data?.error || "Could not load track."));
  }, [trackSlug]);

  // Group modules by tier once when the modules list is loaded.
  const tieredModules = useMemo(() => {
    if (!track?.modules) return [];
    const groups = new Map();
    for (const m of track.modules) {
      const tier = tierFor(m.moduleNumber);
      if (!tier) continue;
      if (!groups.has(tier.id)) groups.set(tier.id, { tier, modules: [] });
      groups.get(tier.id).modules.push(m);
    }
    // Return in tier-order, not insertion-order, so an out-of-order modules
    // array still renders correctly.
    return TIERS.map((t) => groups.get(t.id)).filter(Boolean);
  }, [track]);

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-[15px] font-semibold text-apple-red">{error}</p>
        <button onClick={() => navigate("/pro")} className="btn-secondary text-[13px] mt-4">
          ← Back to tracks
        </button>
      </div>
    );
  }
  if (!track) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  const completedCount = progress?.completedExercises?.length || 0;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/pro")} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
        ← All tracks
      </button>

      <div className="rounded-3xl p-6 text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-80">{track.language?.toUpperCase()}</p>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight mt-1">{track.name}</h1>
        <p className="text-[13px] opacity-90 mt-1.5 max-w-xl">{track.description}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5 text-[12px] font-medium">
          <div>
            <span className="text-[24px] font-bold block leading-none">{track.totalModules || 0}</span>
            <span className="opacity-80">modules</span>
          </div>
          <div>
            <span className="text-[24px] font-bold block leading-none">{track.totalTopics || 0}</span>
            <span className="opacity-80">topics</span>
          </div>
          <div>
            <span className="text-[24px] font-bold block leading-none">{track.totalExercises || 0}</span>
            <span className="opacity-80">exercises</span>
          </div>
          <div>
            <span className="text-[24px] font-bold block leading-none">{progress?.totalXp || 0}</span>
            <span className="opacity-80">XP earned</span>
          </div>
          <div>
            <span className="text-[24px] font-bold block leading-none">{completedCount}</span>
            <span className="opacity-80">exercises done</span>
          </div>
        </div>
      </div>

      {/* Tier-grouped module sections. Each tier is its own visual block so
          users can mentally chunk 46 modules into 5 phases of the journey. */}
      {tieredModules.map(({ tier, modules }) => (
        <section key={tier.id} className="scroll-mt-4">
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="inline-block w-1.5 h-5 rounded-sm"
              style={{ backgroundColor: tier.color }}
              aria-hidden
            />
            <h2 className="text-[15px] font-bold tracking-tight text-[var(--label)]">
              {tier.label}
            </h2>
            <span className="text-[11px] text-apple-gray font-medium">
              M{tier.min}{tier.max > tier.min ? `–M${tier.max}` : ""} · {modules.length} module{modules.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[12px] text-apple-gray mb-3 -mt-1 ml-4">{tier.blurb}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((m) => (
              <button
                key={m.moduleId}
                onClick={() => navigate(`/pro/${trackSlug}/${m.moduleId}`)}
                className="card p-4 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: tier.color }}
                  >
                    Module {m.moduleNumber}
                  </span>
                  {m.estimatedHours > 0 && (
                    <span className="text-[10px] text-apple-gray">· ~{m.estimatedHours}h</span>
                  )}
                  {m.topicsCount > 0 && (
                    <span className="text-[10px] text-apple-gray">· {m.topicsCount} topic{m.topicsCount !== 1 ? "s" : ""}</span>
                  )}
                </div>
                <h3 className="text-[14px] font-semibold text-[var(--label)] group-hover:text-apple-blue transition-colors leading-snug">
                  {m.name}
                </h3>
                {m.description && (
                  <p className="text-[12px] text-apple-gray mt-1.5 line-clamp-2">{m.description}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
