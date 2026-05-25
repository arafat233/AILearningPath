/**
 * ProDashboardSnapshot — compact pro-track view rendered by Dashboard.jsx
 * when ?track=pro_<lang>.
 *
 * Five widgets per PRO_TRACK_PLAN.md §10 Phase 9:
 *   1. Continue learning (last topic visited from localStorage)
 *   2. Total XP earned (server-truth from ProProgress)
 *   3. Streak (server-truth)
 *   4. Today's exercise (browse modules CTA — placeholder until
 *      Phase 10 wires real recommendations)
 *   5. Browse all modules (track landing)
 *
 * Layout intentionally mirrors Dashboard.jsx's card density so the user
 * doesn't get a visual jolt switching tabs.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proGetProgress, proGetTrack } from "../../services/api";

function lastTopicFromLocalStorage(trackKey) {
  try {
    const raw = localStorage.getItem(`stellar_pro_last_topic_${trackKey}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function ProDashboardSnapshot({ trackKey }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [track, setTrack]       = useState(null);
  const [error, setError]       = useState("");

  // trackKey is "pro_java" — strip the prefix to get the URL slug.
  const slug = trackKey.startsWith("pro_") ? trackKey.slice(4) : trackKey;
  const lastTopic = lastTopicFromLocalStorage(trackKey);

  useEffect(() => {
    Promise.all([
      proGetProgress(trackKey).catch(() => ({ data: { data: null } })),
      proGetTrack(slug).catch(() => ({ data: { data: null } })),
    ]).then(([p, t]) => {
      setProgress(p.data?.data);
      setTrack(t.data?.data);
    }).catch((err) => setError(err?.response?.data?.error || "Could not load pro dashboard."));
  }, [trackKey, slug]);

  if (error) {
    return (
      <div className="card p-6 border-l-4 border-apple-red">
        <p className="text-[14px] font-semibold text-apple-red">{error}</p>
        <p className="text-[12px] text-apple-gray mt-1">
          Make sure you're enrolled and your email is in PRO_TRACKS_ENABLED_FOR_EMAILS.
        </p>
      </div>
    );
  }

  const xp = progress?.totalXp || 0;
  const streak = progress?.currentStreak || 0;
  const done = progress?.completedExercises?.length || 0;
  const totalEx = track?.totalExercises || 0;
  const pct = totalEx > 0 ? Math.min(100, Math.round((done / totalEx) * 100)) : 0;

  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <div className="rounded-3xl p-6 text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-80">Your pro track</p>
        <h1 className="text-[28px] font-bold tracking-tight mt-1">{track?.name || "Loading…"}</h1>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mt-4 text-[12px] font-medium">
          <div>
            <span className="text-[24px] font-bold leading-none block">{xp}</span>
            <span className="opacity-80">XP earned</span>
          </div>
          <div>
            <span className="text-[24px] font-bold leading-none block">{streak}</span>
            <span className="opacity-80">day streak</span>
          </div>
          <div>
            <span className="text-[24px] font-bold leading-none block">{done}/{totalEx || "—"}</span>
            <span className="opacity-80">exercises</span>
          </div>
          <div>
            <span className="text-[24px] font-bold leading-none block">{pct}%</span>
            <span className="opacity-80">progress</span>
          </div>
        </div>
      </div>

      {/* ── Continue learning + Browse ── */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate(lastTopic?.path || `/pro/${slug}`)}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">
            {lastTopic ? "Continue learning" : "Start here"}
          </p>
          <h3 className="text-[16px] font-bold text-[var(--label)] group-hover:text-apple-blue transition-colors">
            {lastTopic?.label || "Module 1 — Java Fundamentals"}
          </h3>
          {lastTopic?.subtitle && (
            <p className="text-[12px] text-apple-gray mt-1">{lastTopic.subtitle}</p>
          )}
          <span className="text-[12px] text-apple-blue font-semibold mt-3 inline-block">Resume →</span>
        </button>

        <button
          onClick={() => navigate(`/pro/${slug}`)}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Browse</p>
          <h3 className="text-[16px] font-bold text-[var(--label)] group-hover:text-apple-blue transition-colors">
            All {track?.totalModules || ""} modules
          </h3>
          <p className="text-[12px] text-apple-gray mt-1">
            {track?.totalTopics || 0} topics · {track?.totalExercises || 0} exercises
          </p>
          <span className="text-[12px] text-apple-blue font-semibold mt-3 inline-block">Open course →</span>
        </button>
      </div>

      {/* ── Today's nudge (placeholder until Phase 10 wires recommendations) ── */}
      <div className="card p-5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Today's nudge</p>
        <p className="text-[14px] text-[var(--label)]">
          {done === 0
            ? "Run your first exercise today — even 10 minutes of code on a sandbox counts."
            : `You're ${pct}% through ${track?.name || "your track"}. One exercise today keeps the streak alive.`}
        </p>
      </div>
    </div>
  );
}
