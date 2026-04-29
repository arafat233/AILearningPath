import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNcertTopicContent } from "../services/api";

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-apple-gray6/40 transition-colors"
      >
        <h2 className="text-[15px] font-semibold text-[var(--label)]">{title}</h2>
        <span className={`text-apple-gray3 text-[14px] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[var(--separator)]">
          {children}
        </div>
      )}
    </div>
  );
}

function WorkedExample({ example }) {
  if (!example) return null;
  return (
    <div className="space-y-3 mt-3">
      {Object.values(example).map((ex, i) => (
        <div key={i} className="bg-apple-gray6/50 rounded-apple p-4 space-y-2">
          {ex.problem && (
            <p className="text-[13px] font-semibold text-[var(--label)]">{ex.problem}</p>
          )}
          {ex.solution_steps?.map((step, si) => (
            <div key={si} className="flex gap-2">
              <span className="text-[11px] font-mono text-apple-gray3 mt-[2px] shrink-0">Step {si + 1}</span>
              <p className="text-[13px] text-[var(--secondary-label)] leading-relaxed">{step}</p>
            </div>
          ))}
          {ex.solution && (
            <p className="text-[13px] text-[var(--secondary-label)] leading-relaxed">{ex.solution}</p>
          )}
          {ex.answer && (
            <p className="text-[13px] font-semibold text-apple-green">{ex.answer}</p>
          )}
          {ex.what_to_notice && (
            <p className="text-[12px] text-apple-blue italic">{ex.what_to_notice}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NcertTopicView() {
  const { topicId } = useParams();
  const navigate    = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNcertTopicContent(topicId)
      .then((r) => setTopic(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  if (!topic) return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-10 text-center">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-2">Teaching content not found</p>
        <p className="text-[13px] text-apple-gray mb-3">Run the import command to load topic content:</p>
        <code className="text-[12px] bg-apple-gray6 text-apple-gray px-3 py-1.5 rounded-apple font-mono">
          npm run import:ncert
        </code>
        <br />
        <button onClick={() => navigate(-1)} className="btn-secondary text-[13px] mt-4">
          ← Go Back
        </button>
      </div>
    </div>
  );

  const tc = topic.teaching_content ?? {};
  const intuition = tc.intuition ?? {};

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-[13px] text-apple-gray hover:text-apple-blue transition-colors flex items-center gap-1"
      >
        ‹ Back
      </button>

      {/* Header */}
      <div className="card p-6">
        <p className="text-[11px] text-apple-gray uppercase tracking-wider mb-1">{topicId}</p>
        <h1 className="text-[20px] font-bold text-[var(--label)] tracking-tight leading-snug">{topic.name}</h1>
        {tc.key_takeaway && (
          <div className="mt-4 bg-apple-blue/6 border border-apple-blue/15 rounded-apple p-4">
            <p className="text-[13px] font-semibold text-apple-blue mb-1">Key Takeaway</p>
            <p className="text-[13px] text-[var(--label)] leading-relaxed">{tc.key_takeaway}</p>
          </div>
        )}
        {topic.prerequisite_knowledge?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[11px] text-apple-gray mr-1">Prerequisites:</span>
            {topic.prerequisite_knowledge.map((p, i) => (
              <span key={i} className="text-[11px] bg-apple-gray6 text-apple-gray px-2 py-0.5 rounded-full">{p}</span>
            ))}
          </div>
        )}
      </div>

      {/* Intuition */}
      {intuition.hook && (
        <Section title="The Hook">
          <p className="text-[14px] text-[var(--label)] leading-relaxed mt-3">{intuition.hook}</p>
        </Section>
      )}

      {intuition.elevator_pitch && (
        <Section title="In Plain English">
          <p className="text-[14px] text-[var(--secondary-label)] leading-relaxed mt-3">{intuition.elevator_pitch}</p>
        </Section>
      )}

      {intuition.real_world_anchors?.length > 0 && (
        <Section title="Real-World Examples">
          <div className="space-y-3 mt-3">
            {intuition.real_world_anchors.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-apple-blue mt-[7px] shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[var(--label)]">{a.scenario}</p>
                  <p className="text-[13px] text-apple-gray leading-relaxed">{a.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {intuition.the_pivot_idea && (
        <Section title="The Key Insight">
          <p className="text-[14px] text-[var(--label)] leading-relaxed mt-3">{intuition.the_pivot_idea}</p>
        </Section>
      )}

      {/* SVG Diagrams */}
      {tc.svg_diagrams?.length > 0 && (
        <Section title="Diagrams">
          <div className="space-y-5 mt-3">
            {tc.svg_diagrams.map((d) => (
              <div key={d.id} className="space-y-2">
                {d.title && (
                  <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">{d.title}</p>
                )}
                <div
                  className="w-full overflow-x-auto rounded-apple border border-[var(--separator)] bg-white [&>svg]:w-full [&>svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: d.svg }}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Worked examples */}
      {tc.worked_example && Object.keys(tc.worked_example).length > 0 && (
        <Section title="Worked Examples">
          <WorkedExample example={tc.worked_example} />
        </Section>
      )}

      {/* Common misconceptions */}
      {tc.common_misconceptions?.length > 0 && (
        <Section title="Common Mistakes">
          <div className="space-y-3 mt-3">
            {tc.common_misconceptions.map((m, i) => (
              <div key={i} className="bg-apple-red/5 border border-apple-red/15 rounded-apple p-3">
                {m.misconception && (
                  <p className="text-[13px] font-semibold text-apple-red mb-1">{m.misconception}</p>
                )}
                {m.correction && (
                  <p className="text-[13px] text-[var(--label)] leading-relaxed">{m.correction}</p>
                )}
                {m.example_of_error && (
                  <p className="text-[12px] text-apple-gray mt-1 font-mono">{m.example_of_error}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Shortcuts */}
      {tc.shortcuts_and_tricks?.length > 0 && (
        <Section title="Shortcuts & Tricks">
          <div className="space-y-2 mt-3">
            {tc.shortcuts_and_tricks.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-apple-green text-[14px] shrink-0">✓</span>
                <div>
                  {s.trick && <p className="text-[13px] font-semibold text-[var(--label)]">{s.trick}</p>}
                  {s.how && <p className="text-[13px] text-apple-gray leading-relaxed">{s.how}</p>}
                  {typeof s === "string" && <p className="text-[13px] text-[var(--label)]">{s}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Historical context */}
      {intuition.historical_context && (
        <Section title="Historical Context">
          <p className="text-[13px] text-[var(--secondary-label)] leading-relaxed mt-3">{intuition.historical_context}</p>
        </Section>
      )}

      {/* Why it matters */}
      {intuition.why_it_matters && (
        <Section title="Why This Matters">
          <p className="text-[13px] text-[var(--secondary-label)] leading-relaxed mt-3">{intuition.why_it_matters}</p>
        </Section>
      )}

      {/* Key formulas */}
      {topic.key_formulas?.length > 0 && (
        <Section title="Key Formulas">
          <ul className="space-y-2 mt-3">
            {topic.key_formulas.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-apple-blue/10 text-apple-blue text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <code className="text-[13px] text-[var(--label)] font-mono leading-relaxed">
                  {typeof f === "string" ? f : JSON.stringify(f)}
                </code>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Practice CTA */}
      <div className="card p-5 flex items-center justify-between gap-4">
        <p className="text-[14px] font-semibold text-[var(--label)]">Ready to test yourself?</p>
        <button
          onClick={() => navigate("/practice", { state: { topic: topic.name } })}
          className="btn-primary text-[13px] py-2 px-5 shrink-0"
        >
          Practice Questions →
        </button>
      </div>
    </div>
  );
}
