/**
 * ProTopicPublic — /pro/preview/:topicId
 *
 * Free-tier topic view (D5.1). No auth required — only renders topics with
 * freeAccess:true. Identical teaching content to ProTopicView but:
 *   - Standalone layout (no sidebar) so it's shareable / SEO-friendly
 *   - Exercise submission gated behind a sign-up CTA
 *   - Sign-up banner at the top
 *   - Visualizer still works (it's entirely client-side)
 */
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { proGetTopicPublic, proListExercisesPublic } from "../../services/api";

const VisualizerShell = lazy(() => import("../../components/dsa/VisualizerShell.jsx"));

// ── Tiny reusable renderers (mirrors ProTopicView helpers) ───────────────────

function GenericBlock({ value }) {
  if (!value) return null;
  if (typeof value === "string") return <p className="text-[14px] text-[var(--label)] leading-relaxed">{value}</p>;
  if (Array.isArray(value)) return (
    <ul className="space-y-1.5 list-disc pl-5">
      {value.map((item, i) => <li key={i} className="text-[14px] text-[var(--label)]">{typeof item === "string" ? item : JSON.stringify(item)}</li>)}
    </ul>
  );
  if (typeof value === "object") {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            {k !== "explanation" && k !== "content" && (
              <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1">{k.replace(/_/g, " ")}</p>
            )}
            <GenericBlock value={v} />
          </div>
        ))}
      </div>
    );
  }
  return <p className="text-[14px] text-[var(--label)]">{String(value)}</p>;
}

const LEVEL_COLOR = {
  warmup: "text-apple-green bg-apple-green/10",
  easy:   "text-apple-blue bg-apple-blue/10",
  medium: "text-apple-orange bg-apple-orange/10",
  hard:   "text-apple-red bg-apple-red/10",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProTopicPublic() {
  const { topicId } = useParams();
  const navigate    = useNavigate();
  const [topic,     setTopic]     = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error,     setError]     = useState("");

  useEffect(() => {
    import("../../components/dsa/VisualizerShell.jsx").catch(() => {});
    Promise.all([
      proGetTopicPublic(topicId),
      proListExercisesPublic(topicId).catch(() => ({ data: { data: [] } })),
    ])
      .then(([t, ex]) => {
        setTopic(t.data?.data);
        setExercises(ex.data?.data || []);
      })
      .catch(() => setError("This topic isn't available for free preview."));
  }, [topicId]);

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[40px]">🔒</p>
      <p className="text-[18px] font-bold text-[var(--label)]">{error}</p>
      <Link to="/" className="btn-primary text-[14px]">Sign in to access all topics →</Link>
    </div>
  );

  if (!topic) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[13px] text-apple-gray">Loading…</div>
    </div>
  );

  const t = topic.teaching || {};

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-apple-gray5 bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-[15px] font-bold text-[var(--label)]">
            <span className="text-apple-blue">⚡</span> Stellar
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-apple-gray hidden sm:block">Free preview</span>
            <Link to="/" className="btn-primary text-[12px] py-1.5 px-4">Sign up free →</Link>
          </div>
        </div>
      </header>

      {/* ── Sign-up banner ── */}
      <div className="bg-apple-blue/8 border-b border-apple-blue/20">
        <div className="max-w-4xl mx-auto px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[13px] text-apple-blue font-medium">
            You're viewing a free preview — all 232 topics + 3,311 exercises are available after sign-up.
          </p>
          <Link to="/" className="text-[12px] font-bold text-apple-blue hover:underline shrink-0">
            Get full access →
          </Link>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-4xl mx-auto px-5 py-8 space-y-8">

        {/* Header */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-apple-gray">
            Java · Topic {topic.topicNumber}
          </p>
          <h1 className="text-[32px] font-bold tracking-tight text-[var(--label)] mt-1">{topic.name}</h1>
          {topic.metadata?.career_relevance && (
            <p className="text-[15px] text-apple-gray italic mt-2">{topic.metadata.career_relevance}</p>
          )}
        </div>

        {/* Hook */}
        {topic.hook && Object.keys(topic.hook).length > 0 && (
          <section className="card p-5 border-l-4 border-apple-blue space-y-2">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Why this topic</p>
            <GenericBlock value={topic.hook} />
          </section>
        )}

        {/* Concept */}
        {t.concept_explanation && (
          <section className="space-y-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Concept</p>
            <GenericBlock value={t.concept_explanation} />
          </section>
        )}

        {/* Other teaching blocks */}
        {Object.entries(t)
          .filter(([k]) => !["concept_explanation", "visual_aid"].includes(k))
          .map(([k, v]) => v ? (
            <section key={k} className="space-y-3">
              <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">
                {k.replace(/_/g, " ")}
              </p>
              <GenericBlock value={v} />
            </section>
          ) : null)}

        {/* Visualizer */}
        {topic.visualizer?.kind && (
          <section className="space-y-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Visualize</p>
            <Suspense fallback={<div className="card p-6 text-center text-[13px] text-apple-gray">Loading visualizer…</div>}>
              <VisualizerShell kind={topic.visualizer.kind} config={topic.visualizer.config || {}} />
            </Suspense>
          </section>
        )}

        {/* Interview relevance */}
        {topic.interviewRelevance && Object.keys(topic.interviewRelevance).length > 0 && (
          <section className="card p-5 border-l-4 border-apple-purple space-y-2">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Interview relevance</p>
            <GenericBlock value={topic.interviewRelevance} />
          </section>
        )}

        {/* Exercises — shown as list, submission requires sign-up */}
        {exercises.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">
                Exercises ({exercises.length})
              </p>
              <span className="text-[11px] text-apple-gray3">Sign in to submit</span>
            </div>
            <div className="space-y-2">
              {exercises.map(ex => (
                <div key={ex.exerciseId}
                  className="card p-4 flex items-center gap-4 opacity-90">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${LEVEL_COLOR[ex.level] || "text-apple-gray bg-[var(--fill)]"}`}>
                    {ex.level}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--label)] truncate">{ex.title}</p>
                    {ex.scenario && <p className="text-[12px] text-apple-gray mt-0.5 line-clamp-1">{ex.scenario}</p>}
                  </div>
                  <span className="text-[11px] text-apple-gray shrink-0">🔒 Sign in</span>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div className="card p-6 bg-apple-blue/5 border-apple-blue/20 text-center space-y-3">
              <p className="text-[16px] font-bold text-[var(--label)]">Ready to practice?</p>
              <p className="text-[13px] text-apple-gray max-w-sm mx-auto">
                Sign up free to submit code, get AI hints from the Socratic tutor, and track your progress.
              </p>
              <Link to="/" className="btn-primary inline-block text-[14px] px-8">
                Get started — it's free →
              </Link>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
