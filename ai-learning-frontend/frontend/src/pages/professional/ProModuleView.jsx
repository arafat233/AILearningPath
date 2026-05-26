/**
 * ProModuleView — /pro/:trackSlug/:moduleId
 *
 * Shows the topics inside one module with difficulty pip + completion state.
 * Click a topic → ProTopicView.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetModule, proGetProgress } from "../../services/api";

// Map normalised difficulty (0..1) to an UI label + accent. The backend stores
// difficulty as a float between 0 and 1 (e.g. M1-T1 = 0.2, M14-T1 = 0.7).
function difficultyMeta(d) {
  const v = typeof d === "number" ? d : 0.3;
  if (v <= 0.25) return { label: "Easy",  color: "#16a34a" };  // green
  if (v <= 0.5)  return { label: "Medium", color: "#2563eb" }; // blue
  if (v <= 0.75) return { label: "Hard",   color: "#ea580c" }; // orange
  return                     { label: "Expert", color: "#dc2626" }; // red
}

export default function ProModuleView() {
  const { trackSlug, moduleId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    proGetModule(trackSlug, moduleId)
      .then((r) => {
        const m = r.data?.data;
        setData(m);
        if (m?.trackKey) {
          proGetProgress(m.trackKey).then((p) => setProgress(p.data?.data)).catch(() => {});
        }
      })
      .catch((err) => setError(err?.response?.data?.error || "Could not load module."));
  }, [trackSlug, moduleId]);

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-[15px] font-semibold text-apple-red">{error}</p>
        <button onClick={() => navigate(`/pro/${trackSlug}`)} className="btn-secondary text-[13px] mt-4">
          ← Back to track
        </button>
      </div>
    );
  }
  if (!data) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  const completedSet = new Set(progress?.completedTopics || []);
  const topicCount = data.topics?.length || 0;
  const doneCount = data.topics?.filter((t) => completedSet.has(t.topicId)).length || 0;
  const pct = topicCount ? Math.round((doneCount / topicCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(`/pro/${trackSlug}`)} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
        ← Back to track
      </button>

      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93]">Module {data.moduleNumber}</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)] mt-1">{data.name}</h1>
        {data.description && (
          <p className="text-[14px] text-apple-gray mt-1.5 max-w-xl">{data.description}</p>
        )}

        {/* Module progress strip — only renders once topics are loaded so the
            denominator is meaningful. */}
        {topicCount > 0 && (
          <div className="mt-4 max-w-md">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[11px] font-medium text-apple-gray">
                {doneCount} / {topicCount} topic{topicCount !== 1 ? "s" : ""} done
              </span>
              <span className="text-[11px] font-semibold text-[var(--label)]">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#e5e5ea] overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: "#7c3aed" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {data.topics?.map((t) => {
          const done = completedSet.has(t.topicId);
          const dm = difficultyMeta(t.difficulty);
          return (
            <button
              key={t.topicId}
              onClick={() => navigate(`/pro/${trackSlug}/${moduleId}/${t.topicId}`)}
              className="card p-4 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group flex items-center gap-4"
            >
              {/* Topic number bubble — fills with a check mark once done */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 transition-colors ${
                  done ? "bg-[#16a34a]/15 text-[#16a34a]" : "bg-[#7c3aed]/12 text-[#7c3aed]"
                }`}
                aria-label={done ? "Completed" : `Topic ${t.topicNumber}`}
              >
                {done ? "✓" : t.topicNumber}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--label)] truncate group-hover:text-apple-blue transition-colors">
                  {t.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${dm.color}15`, color: dm.color }}
                  >
                    {dm.label}
                  </span>
                  {t.estimatedMinutes > 0 && (
                    <span className="text-apple-gray">· ~{t.estimatedMinutes} min</span>
                  )}
                  {t.xpReward > 0 && (
                    <span className="text-apple-gray">· {t.xpReward} XP</span>
                  )}
                </div>
              </div>
              <span className="text-apple-gray3 text-[18px] group-hover:text-apple-blue transition-colors">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
