/**
 * ProTopicView — /pro/:trackSlug/:moduleId/:topicId
 *
 * Renders the teaching content for one ProTopic and the list of exercises
 * underneath. The source JSON is freeform (Schema.Types.Mixed) so we render
 * defensively — missing blocks simply don't show.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetTopic, proListExercises } from "../../services/api";

function Section({ label, children }) {
  return (
    <section>
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">{label}</p>
      {children}
    </section>
  );
}

// Stringify whatever shape the source JSON gave us. Some blocks are
// strings, some are nested objects with sub-keys. Render the best version.
function renderBlock(block) {
  if (!block) return null;
  if (typeof block === "string") {
    return <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{block}</p>;
  }
  if (Array.isArray(block)) {
    return (
      <ul className="space-y-1.5 list-disc pl-5">
        {block.map((b, i) => <li key={i} className="text-[14px] text-[var(--label)]">{typeof b === "string" ? b : JSON.stringify(b)}</li>)}
      </ul>
    );
  }
  return (
    <div className="space-y-3">
      {Object.entries(block).map(([k, v]) => (
        <div key={k}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-gray mb-1">{k.replace(/_/g, " ")}</p>
          {typeof v === "string"
            ? <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{v}</p>
            : <pre className="text-[12px] text-[var(--label)] bg-[var(--fill)] rounded-lg p-3 overflow-x-auto"><code>{JSON.stringify(v, null, 2)}</code></pre>}
        </div>
      ))}
    </div>
  );
}

export default function ProTopicView() {
  const { trackSlug, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      proGetTopic(topicId),
      proListExercises(topicId).catch(() => ({ data: { data: [] } })),
    ])
      .then(([t, ex]) => {
        setTopic(t.data?.data);
        setExercises(ex.data?.data || []);
      })
      .catch((err) => setError(err?.response?.data?.error || "Could not load topic."));
  }, [topicId]);

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-[15px] font-semibold text-apple-red">{error}</p>
        <button onClick={() => navigate(`/pro/${trackSlug}/${moduleId}`)} className="btn-secondary text-[13px] mt-4">
          ← Back to module
        </button>
      </div>
    );
  }
  if (!topic) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate(`/pro/${trackSlug}/${moduleId}`)} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
        ← Back to module
      </button>

      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93]">Topic {topic.topicNumber}</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)] mt-1">{topic.name}</h1>
        {topic.metadata?.career_relevance && (
          <p className="text-[14px] text-apple-gray italic mt-2">{topic.metadata.career_relevance}</p>
        )}
      </div>

      {/* Teaching blocks. Source JSON is loose, render whichever exist. */}
      <div className="card p-6 space-y-6">
        {topic.hook && Object.keys(topic.hook).length > 0 && (
          <Section label="Hook">{renderBlock(topic.hook)}</Section>
        )}
        {topic.teaching && Object.keys(topic.teaching).length > 0 && (
          <Section label="Teaching">{renderBlock(topic.teaching)}</Section>
        )}
        {topic.industryApplications && Object.keys(topic.industryApplications).length > 0 && (
          <Section label="Industry applications">{renderBlock(topic.industryApplications)}</Section>
        )}
        {topic.interviewRelevance && Object.keys(topic.interviewRelevance).length > 0 && (
          <Section label="Interview relevance">{renderBlock(topic.interviewRelevance)}</Section>
        )}
        {topic.commonGaps && Object.keys(topic.commonGaps).length > 0 && (
          <Section label="Common gaps">{renderBlock(topic.commonGaps)}</Section>
        )}
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">Exercises ({exercises.length})</p>
        <div className="flex flex-col gap-2.5">
          {exercises.map((ex) => (
            <button
              key={ex.exerciseId}
              onClick={() => navigate(`/pro/exercise/${ex.exerciseId}`)}
              className="card p-4 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group flex items-center gap-4"
            >
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray shrink-0">
                {ex.level}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--label)] truncate group-hover:text-apple-blue transition-colors">
                  {ex.title || ex.exerciseId}
                </p>
                {ex.scenario && (
                  <p className="text-[12px] text-apple-gray mt-0.5 line-clamp-1">{ex.scenario}</p>
                )}
              </div>
              <span className="text-[11px] text-apple-gray font-medium shrink-0">{ex.xpReward || 0} XP</span>
              <span className="text-apple-gray3 text-[18px] group-hover:text-apple-blue transition-colors">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
