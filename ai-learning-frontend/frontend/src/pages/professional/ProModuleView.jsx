/**
 * ProModuleView — /pro/:trackSlug/:moduleId
 *
 * Shows the topics inside one module. Click a topic → ProTopicView.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetModule } from "../../services/api";

export default function ProModuleView() {
  const { trackSlug, moduleId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    proGetModule(trackSlug, moduleId)
      .then((r) => setData(r.data?.data))
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
      </div>

      <div className="flex flex-col gap-2.5">
        {data.topics?.map((t) => (
          <button
            key={t.topicId}
            onClick={() => navigate(`/pro/${trackSlug}/${moduleId}/${t.topicId}`)}
            className="card p-4 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group flex items-center gap-4"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 bg-[#7c3aed]/12 text-[#7c3aed]">
              {t.topicNumber}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[var(--label)] truncate group-hover:text-apple-blue transition-colors">
                {t.name}
              </p>
              <p className="text-[11px] text-apple-gray mt-0.5">
                {t.estimatedMinutes > 0 && <>~{t.estimatedMinutes} min · </>}
                {t.xpReward > 0 && <>{t.xpReward} XP</>}
              </p>
            </div>
            <span className="text-apple-gray3 text-[18px] group-hover:text-apple-blue transition-colors">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
