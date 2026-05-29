/**
 * ProPractice — "/practice" for pro_* learners.
 *
 * Pro practice is sandboxed code exercises, not board-style MCQs. Rather
 * than mirror Practice.jsx (subject pickers, MCQ runner), this page just
 * routes the learner to the real practice surface — the pro track module
 * tree — plus a couple of quick-pick CTAs. Keeps the URL valid and avoids
 * the "Maths/Science/Hindi" UX leak.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proGetTrack } from "../../services/api";

function lastTopicFromLocalStorage(trackKey) {
  try {
    const raw = localStorage.getItem(`stellar_pro_last_topic_${trackKey}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function ProPractice({ trackKey = "pro_java" }) {
  const navigate = useNavigate();
  const slug = trackKey.startsWith("pro_") ? trackKey.slice(4) : trackKey;
  const [track, setTrack] = useState(null);
  const lastTopic = lastTopicFromLocalStorage(trackKey);

  useEffect(() => {
    proGetTrack(slug).then((r) => setTrack(r.data?.data)).catch(() => {});
  }, [slug]);

  return (
    <div className="space-y-5 max-w-4xl">
      <header>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-apple-gray">Practice</p>
        <h1 className="text-[24px] font-bold text-[var(--label)] tracking-tight mt-1">
          {track?.name ? `${track.name} practice` : "Code practice"}
        </h1>
        <p className="text-[13px] text-[var(--label2)] mt-1">
          Pick up where you left off, jump into a module, or talk through a problem with the tutor.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {lastTopic && (
          <button
            onClick={() => navigate(lastTopic.path)}
            className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all"
          >
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Resume</p>
            <h3 className="text-[16px] font-bold text-[var(--label)]">{lastTopic.label}</h3>
            {lastTopic.subtitle && <p className="text-[12px] text-apple-gray mt-1">{lastTopic.subtitle}</p>}
            <span className="text-[12px] text-apple-blue font-semibold mt-3 inline-block">Continue →</span>
          </button>
        )}

        <button
          onClick={() => navigate(`/pro/${slug}`)}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Browse</p>
          <h3 className="text-[16px] font-bold text-[var(--label)]">
            All {track?.totalModules || ""} modules
          </h3>
          <p className="text-[12px] text-apple-gray mt-1">
            {track?.totalTopics || 0} topics · {track?.totalExercises || 0} exercises
          </p>
          <span className="text-[12px] text-apple-blue font-semibold mt-3 inline-block">Open course →</span>
        </button>

        <button
          onClick={() => navigate("/voice-tutor")}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Tutor</p>
          <h3 className="text-[16px] font-bold text-[var(--label)]">Voice tutor · {track?.language || "Java"}</h3>
          <p className="text-[12px] text-apple-gray mt-1">Talk through a stack trace or concept out loud.</p>
        </button>

        <button
          onClick={() => navigate("/bookmarks")}
          className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">Review</p>
          <h3 className="text-[16px] font-bold text-[var(--label)]">Bookmarked exercises</h3>
          <p className="text-[12px] text-apple-gray mt-1">Re-attempt anything you saved earlier.</p>
        </button>
      </div>

      {/* Modules quick picks */}
      {track?.modules?.length > 0 && (
        <div className="card p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">Jump to a module</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {track.modules.slice(0, 6).map((m) => (
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
          {track.modules.length > 6 && (
            <button
              onClick={() => navigate(`/pro/${slug}`)}
              className="text-[12px] text-apple-blue font-semibold mt-4 hover:opacity-70 transition-opacity"
            >
              See all {track.modules.length} modules →
            </button>
          )}
        </div>
      )}

      <p className="text-[12px] text-apple-gray">
        MCQ-style practice is for school tracks. Pro practice is code submissions, run in a sandboxed JVM.
      </p>
    </div>
  );
}
