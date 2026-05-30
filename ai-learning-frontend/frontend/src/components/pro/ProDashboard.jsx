/**
 * ProDashboard — full "/" page replacement when activeTrack is pro_*.
 *
 * Sections (per "fix the dashboard for pro learners" discussion):
 *   1. Hero — XP, streak, exercises done, %, with track name
 *   2. Continue learning + Browse all modules
 *   3. Up next — quick picks (Resume / Module 1 / Browse)
 *   4. Recent activity — placeholder until a /pro/submissions endpoint exists
 *   5. Practice CTAs — code submissions sandbox + Voice Tutor (pro mode)
 *   6. Today's nudge — copy varies by progress
 *
 * Hidden compared to school dashboard: boards countdown, subject bars,
 * classmates · grade-N widget, placement quiz banner, mock paper banner.
 *
 * Uses existing endpoints only — no new backend required for the empty
 * state. (b) chosen for empty state: render every section with placeholders.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proGetProgress, proGetTrack } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import ProLeaderboard from "./ProLeaderboard";

function lastTopicFromLocalStorage(trackKey) {
  try {
    const raw = localStorage.getItem(`stellar_pro_last_topic_${trackKey}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function ProDashboard({ trackKey = "pro_java" }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [progress, setProgress] = useState(null);
  const [track, setTrack]       = useState(null);
  const [error, setError]       = useState("");

  const slug = trackKey.startsWith("pro_") ? trackKey.slice(4) : trackKey;
  const lastTopic = lastTopicFromLocalStorage(trackKey);
  const firstName = user?.name?.split(" ")[0] || "there";

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

  const xp       = progress?.totalXp || 0;
  const streak   = progress?.currentStreak || 0;
  const done     = progress?.completedExercises?.length || 0;
  const totalEx  = track?.totalExercises || 0;
  const pct      = totalEx > 0 ? Math.min(100, Math.round((done / totalEx) * 100)) : 0;
  const isBlank  = done === 0 && !lastTopic;
  const firstModule = track?.modules?.[0];

  return (
    <div className="space-y-5">
      {/* ── Greeting strip ── */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-apple-gray">
          {new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()} · LET'S CODE
        </p>
        <h1 className="text-[26px] font-bold text-[var(--label)] tracking-tight mt-1">
          {isBlank
            ? `Welcome to Java, ${firstName}.`
            : `Hey ${firstName} — pick up where you left off.`}
        </h1>
        <p className="text-[14px] text-[var(--label2)] mt-1">
          {isBlank
            ? "Start with Module 1 — every minute on a sandbox counts."
            : `You're ${pct}% through ${track?.name || "the track"}. Keep the streak alive.`}
        </p>
      </div>

      {/* ── Hero / KPI strip ── */}
      <div className="rounded-3xl p-6 text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-80">Your pro track</p>
        <h2 className="text-[26px] font-bold tracking-tight mt-1">{track?.name || "Java — Loading…"}</h2>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mt-4 text-[12px] font-medium">
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

      {/* ── Continue + Browse ── */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate(lastTopic?.path || `/pro/${slug}`)}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">
            {lastTopic ? "Continue learning" : "Start here"}
          </p>
          <h3 className="text-[16px] font-bold text-[var(--label)] group-hover:text-apple-blue transition-colors">
            {lastTopic?.label || firstModule?.name || "Module 1 — Java Fundamentals"}
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

      {/* ── Up next — three quick picks ── */}
      <div className="card p-5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">Up next</p>
        {track?.modules?.slice(0, 3).length ? (
          <div className="grid sm:grid-cols-3 gap-3">
            {track.modules.slice(0, 3).map((m) => (
              <button
                key={m.moduleId}
                onClick={() => navigate(`/pro/${slug}/${m.moduleId}`)}
                className="text-left p-3 rounded-apple border border-apple-gray5 hover:border-apple-blue hover:bg-apple-blue/5 transition-all"
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-apple-gray font-semibold">Module {m.moduleNumber}</p>
                <h4 className="text-[13px] font-bold text-[var(--label)] mt-1 line-clamp-2">{m.name}</h4>
                <p className="text-[11px] text-apple-gray mt-1.5">{m.topicsCount ?? 0} topics</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-apple-gray">Loading modules…</p>
        )}
      </div>

      {/* ── Recent activity ── */}
      <div className="card p-5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Recent activity</p>
        <p className="text-[13px] text-[var(--label)]">
          {done === 0
            ? "Your submissions will appear here once you run your first exercise."
            : `You've completed ${done} exercise${done === 1 ? "" : "s"}. A timeline view is coming soon.`}
        </p>
      </div>

      {/* ── Leaderboard ── */}
      <div className="card p-5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">Leaderboard</p>
        <ProLeaderboard trackKey={trackKey} limit={5} compact />
      </div>

      {/* ── Practice CTAs ── */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/practice")}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Sandbox</p>
          <h3 className="text-[15px] font-bold text-[var(--label)]">Code practice</h3>
          <p className="text-[12px] text-apple-gray mt-1">Run code against the sandboxed JVM.</p>
        </button>
        <button
          onClick={() => navigate("/voice-tutor")}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Tutor</p>
          <h3 className="text-[15px] font-bold text-[var(--label)]">Voice tutor · Java</h3>
          <p className="text-[12px] text-apple-gray mt-1">Talk through a stack trace or concept.</p>
        </button>
      </div>

      {/* ── Today's nudge ── */}
      <div className="card p-5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Today's nudge</p>
        <p className="text-[14px] text-[var(--label)]">
          {done === 0
            ? "Run your first exercise today — even 10 minutes of code counts."
            : `One exercise today keeps the streak alive (currently ${streak} day${streak === 1 ? "" : "s"}).`}
        </p>
      </div>
    </div>
  );
}
