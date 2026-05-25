/**
 * ProCourseLanding — /pro/:trackSlug
 *
 * Shows the modules grid for one track. Click a module → ProModuleView.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetTrack, proGetProgress } from "../../services/api";

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

        <div className="flex items-center gap-5 mt-5 text-[12px] font-medium">
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
            <span className="opacity-80">done</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">Modules</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {track.modules?.map((m) => (
            <button
              key={m.moduleId}
              onClick={() => navigate(`/pro/${trackSlug}/${m.moduleId}`)}
              className="card p-5 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group"
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Module {m.moduleNumber}</span>
                {m.estimatedHours > 0 && (
                  <span className="text-[10px] text-apple-gray">· ~{m.estimatedHours}h</span>
                )}
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--label)] group-hover:text-apple-blue transition-colors">
                {m.name}
              </h3>
              {m.description && (
                <p className="text-[12px] text-apple-gray mt-1 line-clamp-2">{m.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
