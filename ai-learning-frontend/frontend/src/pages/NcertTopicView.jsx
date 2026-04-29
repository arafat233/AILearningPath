import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNcertTopicContent } from "../services/api";

const S = {
  card:    { background: "#FFFFFF", borderRadius: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" },
  label:   { fontSize: "12px", fontWeight: 600, color: "#86868B", letterSpacing: "1.5px", textTransform: "uppercase" },
  body:    { fontSize: "14px", color: "#1D1D1F", lineHeight: 1.7 },
  mono:    { fontFamily: "ui-monospace, 'SF Mono', monospace" },
  blue:    { color: "#007AFF" },
  green:   { color: "#34C759" },
  orange:  { color: "#FF9500" },
  red:     { color: "#FF3B30" },
};

function Section({ title, accent, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...S.card, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", textAlign: "left", cursor: "pointer", background: "none", border: "none" }}
      >
        <h2 style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em", color: accent || "#1D1D1F", margin: 0 }}>
          {title}
        </h2>
        <span style={{ color: "#86868B", fontSize: "14px", flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
      </button>
      {open && (
        <div style={{ padding: "0 32px 28px", borderTop: "1px solid #E5E5EA" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DiagramCard({ diagram }) {
  return (
    <div style={{ background: "#FFFFFF", padding: "36px", borderRadius: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ margin: "0 0 4px", color: "#1D1D1F", fontWeight: 600, fontSize: "19px", letterSpacing: "-0.01em" }}>
        {diagram.title}
      </h3>
      <div style={{ color: "#86868B", fontSize: "13px", marginBottom: "24px", fontFamily: "'SF Mono', ui-monospace, monospace" }}>
        id: {diagram.id}
      </div>
      <div
        style={{ lineHeight: 0 }}
        dangerouslySetInnerHTML={{
          __html: diagram.svg.replace(/<svg /, '<svg style="max-width:100%;height:auto;display:block;margin:0 auto" '),
        }}
      />
    </div>
  );
}

function BulletList({ items, color = "#007AFF" }) {
  if (!items?.length) return null;
  return (
    <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0, marginTop: "7px" }} />
          <p style={{ ...S.body, margin: 0 }}>
            {typeof item === "string" ? item : item.text || JSON.stringify(item)}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* Worked example — handles both steps[] (objects) and steps_compressed[] (strings) */
function WorkedExample({ ex, index }) {
  return (
    <div style={{ background: "#F5F5F7", borderRadius: "14px", padding: "20px 24px" }}>
      <p style={{ ...S.label, marginBottom: "8px" }}>Example {index + 1}</p>

      {ex.problem && (
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1D1D1F", lineHeight: 1.5, marginBottom: "14px" }}>
          {ex.problem}
        </p>
      )}

      {/* Approach box */}
      {ex.thought_process_before_starting && (
        <div style={{ background: "#EEF4FF", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#007AFF", marginBottom: "4px" }}>How to approach</p>
          <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.6 }}>{ex.thought_process_before_starting}</p>
        </div>
      )}

      {/* Detailed steps (object array) */}
      {ex.steps?.map((step, si) => (
        <div key={si} style={{ marginBottom: "14px", paddingLeft: "12px", borderLeft: "2px solid #E5E5EA" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#007AFF", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {step.step_number ?? si + 1}
            </span>
            <p style={{ fontSize: "13px", color: "#86868B", margin: 0 }}>{step.action}</p>
          </div>
          {step.computation && (
            <p style={{ fontSize: "16px", ...S.mono, color: "#1D1D1F", margin: "6px 0 6px 30px", fontWeight: 500 }}>
              {step.computation}
            </p>
          )}
          {step.students_internal_voice && (
            <p style={{ fontSize: "13px", color: "#86868B", fontStyle: "italic", margin: "4px 0 0 30px", lineHeight: 1.5 }}>
              "{step.students_internal_voice}"
            </p>
          )}
          {step.lemma_validity_check && (
            <p style={{ fontSize: "12px", color: "#34C759", margin: "4px 0 0 30px" }}>{step.lemma_validity_check}</p>
          )}
        </div>
      ))}

      {/* Compressed steps (string array — example 3 style) */}
      {!ex.steps && ex.steps_compressed?.map((step, si) => (
        <div key={si} style={{ marginBottom: "10px", paddingLeft: "12px", borderLeft: "2px solid #E5E5EA" }}>
          <p style={{ fontSize: "14px", ...S.mono, color: "#1D1D1F", lineHeight: 1.6, margin: 0 }}>{step}</p>
        </div>
      ))}

      {/* Verification */}
      {ex.verification_after && (
        <div style={{ background: "#F0FFF4", borderRadius: "10px", padding: "10px 14px", marginTop: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#34C759", marginBottom: "4px" }}>Verify</p>
          <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.5 }}>{ex.verification_after}</p>
        </div>
      )}

      {/* Lesson learned */}
      {ex.lesson_from_this_example && (
        <div style={{ background: "#EEF4FF", borderRadius: "10px", padding: "10px 14px", marginTop: "10px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#007AFF", marginBottom: "4px" }}>Lesson</p>
          <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.5 }}>{ex.lesson_from_this_example}</p>
        </div>
      )}

      {/* Answer */}
      {ex.answer && (
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #E5E5EA", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#34C759", letterSpacing: "1px" }}>ANS</span>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#1D1D1F", margin: 0 }}>{ex.answer}</p>
        </div>
      )}
    </div>
  );
}

/* Derivation part — handles both plain strings and {claim, proof_walkthrough, concrete_example, key_insight, why_this_matters} objects */
function DerivationPart({ label, val }) {
  if (!val) return null;

  if (typeof val === "string") {
    return (
      <div>
        <p style={{ ...S.label, marginBottom: "6px" }}>{label}</p>
        <p style={{ ...S.body }}>{val}</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F5F7", borderRadius: "12px", padding: "16px 20px" }}>
      <p style={{ ...S.label, marginBottom: "12px" }}>{label}</p>
      {val.claim && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, ...S.blue, marginBottom: "4px" }}>Claim</p>
          <p style={{ ...S.body, fontStyle: "italic" }}>{val.claim}</p>
        </div>
      )}
      {val.proof_walkthrough && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#86868B", marginBottom: "4px" }}>Proof</p>
          <p style={{ ...S.body }}>{val.proof_walkthrough}</p>
        </div>
      )}
      {val.concrete_example && (
        <div style={{ background: "#EEF4FF", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, ...S.blue, marginBottom: "4px" }}>Concrete Example</p>
          <p style={{ fontSize: "13px", ...S.mono, color: "#1D1D1F", lineHeight: 1.6 }}>{val.concrete_example}</p>
        </div>
      )}
      {val.key_insight && (
        <div style={{ borderLeft: "3px solid #007AFF", paddingLeft: "12px", marginBottom: "8px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, ...S.blue, margin: 0 }}>{val.key_insight}</p>
        </div>
      )}
      {val.why_this_matters && (
        <p style={{ fontSize: "13px", color: "#86868B", fontStyle: "italic", margin: 0 }}>{val.why_this_matters}</p>
      )}
    </div>
  );
}

/* Misconception card — uses actual field names from JSON */
function MisconceptionCard({ m, index }) {
  return (
    <div style={{ background: "#FFF5F5", border: "1px solid #FFD5D5", borderRadius: "12px", padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#FF3B30", flexShrink: 0 }}>✗</span>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#FF3B30", margin: 0, lineHeight: 1.5 }}>{m.wrong_idea}</p>
      </div>

      {m.why_students_fall_for_this && (
        <p style={{ fontSize: "13px", color: "#86868B", fontStyle: "italic", marginBottom: "10px", paddingLeft: "24px" }}>
          {m.why_students_fall_for_this}
        </p>
      )}

      {m.concrete_wrong_example && (
        <div style={{ background: "#FFE5E5", borderRadius: "8px", padding: "8px 12px", marginBottom: "10px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#FF3B30", marginBottom: "3px" }}>Wrong example</p>
          <p style={{ fontSize: "13px", ...S.mono, color: "#1D1D1F" }}>{m.concrete_wrong_example}</p>
        </div>
      )}

      {m.correction && (
        <div style={{ borderLeft: "3px solid #34C759", paddingLeft: "12px", marginBottom: "8px" }}>
          <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.6, margin: 0 }}>{m.correction}</p>
        </div>
      )}

      {m.how_to_spot_mid_problem && (
        <p style={{ fontSize: "12px", ...S.blue, fontStyle: "italic", margin: 0, paddingLeft: "15px" }}>
          💡 {m.how_to_spot_mid_problem}
        </p>
      )}
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px" }}>
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  if (!topic) return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-10 text-center">
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1D1D1F", marginBottom: "8px" }}>Teaching content not found</p>
        <p style={{ fontSize: "13px", color: "#86868B", marginBottom: "12px" }}>
          Run <code style={{ ...S.mono, background: "#F5F5F7", padding: "2px 8px", borderRadius: "6px" }}>npm run import:ncert</code> in the backend folder.
        </p>
        <button onClick={() => navigate(-1)} className="btn-secondary text-[13px]">← Go Back</button>
      </div>
    </div>
  );

  const tc        = topic.teaching_content ?? {};
  const intuition = tc.intuition ?? {};
  const derivation = tc.derivation ?? {};
  const whenToUse = tc.when_to_use_this_method ?? {};
  const videoHooks = tc.video_script_hooks ?? {};

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ fontSize: "13px", color: "#86868B", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", background: "none", border: "none", padding: 0, alignSelf: "flex-start" }}>
        ‹ Back
      </button>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ ...S.card, padding: "36px" }}>
        <p style={{ ...S.mono, fontSize: "12px", color: "#86868B", marginBottom: "8px" }}>{topicId}</p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "#1D1D1F", lineHeight: 1.2, margin: "0 0 16px" }}>
          {topic.name}
        </h1>

        {/* Video opening hook — great one-liner to set the stage */}
        {videoHooks.opening_hook_5_sec && (
          <div style={{ background: "#1D1D1F", borderRadius: "12px", padding: "14px 18px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#86868B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>Opening Hook</p>
            <p style={{ fontSize: "14px", color: "#FFFFFF", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>{videoHooks.opening_hook_5_sec}</p>
          </div>
        )}

        {/* Key takeaway */}
        {tc.key_takeaway && (
          <div style={{ background: "#F5F5F7", borderRadius: "12px", padding: "14px 18px", marginBottom: "16px" }}>
            <p style={{ ...S.label, marginBottom: "6px" }}>Key Takeaway</p>
            <p style={{ ...S.body }}>{tc.key_takeaway}</p>
          </div>
        )}

        {/* Prerequisites */}
        {topic.prerequisite_knowledge?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "#86868B" }}>Prerequisites:</span>
            {topic.prerequisite_knowledge.map((p, i) => (
              <span key={i} style={{ fontSize: "12px", background: "#F5F5F7", color: "#86868B", padding: "2px 10px", borderRadius: "20px" }}>{p}</span>
            ))}
          </div>
        )}

        {/* Key formulas */}
        {topic.key_formulas?.length > 0 && (
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E5EA" }}>
            <p style={{ ...S.label, marginBottom: "10px" }}>Key Formulas</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {topic.key_formulas.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#EEF4FF", color: "#007AFF", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <code style={{ fontSize: "13px", ...S.mono, color: "#1D1D1F", lineHeight: 1.6 }}>
                    {typeof f === "string" ? f : JSON.stringify(f)}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── HOOK ───────────────────────────────────────────────── */}
      {intuition.hook && (
        <div style={{ ...S.card, padding: "36px" }}>
          <p style={{ ...S.label, ...S.blue, marginBottom: "12px" }}>The Hook</p>
          <p style={{ fontSize: "17px", color: "#1D1D1F", lineHeight: 1.7, margin: 0 }}>{intuition.hook}</p>
        </div>
      )}

      {/* ── IN PLAIN ENGLISH ───────────────────────────────────── */}
      {intuition.elevator_pitch && (
        <Section title="In Plain English" defaultOpen={true}>
          <p style={{ fontSize: "15px", color: "#1D1D1F", lineHeight: 1.7, marginTop: "16px" }}>{intuition.elevator_pitch}</p>
        </Section>
      )}

      {/* ── REAL-WORLD EXAMPLES ────────────────────────────────── */}
      {intuition.real_world_anchors?.length > 0 && (
        <Section title="Real-World Examples" defaultOpen={true}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            {intuition.real_world_anchors.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "4px", borderRadius: "2px", background: "#007AFF", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1D1D1F", marginBottom: "4px" }}>{a.scenario}</p>
                  <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.6, margin: 0 }}>{a.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── THE CENTRAL IDEA ───────────────────────────────────── */}
      {intuition.the_pivot_idea && (
        <div style={{ ...S.card, padding: "36px", borderLeft: "4px solid #007AFF" }}>
          <p style={{ ...S.label, ...S.blue, marginBottom: "12px" }}>The Central Idea</p>
          <p style={{ fontSize: "15px", color: "#1D1D1F", lineHeight: 1.7, margin: 0 }}>{intuition.the_pivot_idea}</p>
        </div>
      )}

      {/* ── DIAGRAMS ───────────────────────────────────────────── */}
      {tc.svg_diagrams?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ ...S.label, color: "#86868B" }}>Diagrams</p>
          {tc.svg_diagrams.map((d) => (
            <DiagramCard key={d.id} diagram={d} />
          ))}
        </div>
      )}

      {/* ── WORKED EXAMPLES ────────────────────────────────────── */}
      {tc.worked_example && Object.keys(tc.worked_example).length > 0 && (
        <Section title="Worked Examples" defaultOpen={true}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
            {Object.values(tc.worked_example).map((ex, i) => (
              <WorkedExample key={i} ex={ex} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* ── DERIVATION ─────────────────────────────────────────── */}
      {Object.keys(derivation).length > 0 && (
        <Section title="How It Works (Proof Walkthrough)">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            {Object.entries(derivation).map(([key, val], i) => {
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return <DerivationPart key={i} label={label} val={val} />;
            })}
          </div>
        </Section>
      )}

      {/* ── COMMON MISTAKES ────────────────────────────────────── */}
      {tc.common_misconceptions?.length > 0 && (
        <Section title={`Common Mistakes (${tc.common_misconceptions.length})`} accent="#FF3B30">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            {tc.common_misconceptions.map((m, i) => (
              <MisconceptionCard key={i} m={m} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* ── SHORTCUTS & TRICKS ─────────────────────────────────── */}
      {tc.shortcuts_and_tricks?.length > 0 && (
        <Section title={`Shortcuts & Tricks (${tc.shortcuts_and_tricks.length})`} accent="#34C759">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
            {tc.shortcuts_and_tricks.map((s, i) => (
              <div key={i} style={{ background: "#F0FFF4", border: "1px solid #C6F0D1", borderRadius: "12px", padding: "14px 18px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#34C759", marginBottom: "4px" }}>{s.shortcut}</p>
                {s.rule && <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6, marginBottom: "4px" }}>{s.rule}</p>}
                {s.example && <p style={{ fontSize: "13px", ...S.mono, color: "#86868B", marginBottom: "4px" }}>{s.example}</p>}
                {s.when_to_use && <p style={{ fontSize: "12px", ...S.blue, fontStyle: "italic", margin: 0 }}>{s.when_to_use}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── WHEN TO USE ────────────────────────────────────────── */}
      {Object.keys(whenToUse).length > 0 && (
        <Section title="When to Use This Method">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            {whenToUse.use_euclids_algorithm_when?.length > 0 && (
              <div>
                <p style={{ ...S.label, color: "#34C759", marginBottom: "4px" }}>Use this method when:</p>
                <BulletList items={whenToUse.use_euclids_algorithm_when} color="#34C759" />
              </div>
            )}
            {whenToUse.use_prime_factorisation_instead_when?.length > 0 && (
              <div>
                <p style={{ ...S.label, color: "#FF9500", marginBottom: "4px" }}>Use prime factorisation instead when:</p>
                <BulletList items={whenToUse.use_prime_factorisation_instead_when} color="#FF9500" />
              </div>
            )}
            {whenToUse.key_decision_question && (
              <div style={{ background: "#EEF4FF", borderRadius: "10px", padding: "12px 16px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, ...S.blue, marginBottom: "4px" }}>Key Decision Question</p>
                <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6, margin: 0 }}>{whenToUse.key_decision_question}</p>
              </div>
            )}
            {whenToUse.speed_intuition && (
              <div>
                <p style={{ ...S.label, marginBottom: "4px" }}>Speed Intuition</p>
                <p style={{ ...S.body }}>{whenToUse.speed_intuition}</p>
              </div>
            )}
            {whenToUse.when_neither_method_alone_is_enough && (
              <div>
                <p style={{ ...S.label, marginBottom: "4px" }}>When Neither Method Alone Is Enough</p>
                <p style={{ ...S.body }}>{whenToUse.when_neither_method_alone_is_enough}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── EDGE CASES ─────────────────────────────────────────── */}
      {tc.edge_cases?.length > 0 && (
        <Section title={`Edge Cases (${tc.edge_cases.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
            {tc.edge_cases.map((e, i) => (
              <div key={i} style={{ background: "#F5F5F7", borderRadius: "12px", padding: "14px 18px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#1D1D1F", marginBottom: "4px" }}>
                  {e.case} <span style={{ ...S.blue }}>→ {e.value}</span>
                </p>
                {e.reasoning && <p style={{ fontSize: "13px", color: "#86868B", lineHeight: 1.6, marginBottom: "4px" }}>{e.reasoning}</p>}
                {e.where_it_appears && <p style={{ fontSize: "12px", ...S.blue, fontStyle: "italic", margin: 0 }}>{e.where_it_appears}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── WRONG INTUITIONS ───────────────────────────────────── */}
      {intuition.wrong_intuitions_to_replace?.length > 0 && (
        <Section title="Wrong Intuitions to Replace">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
            {intuition.wrong_intuitions_to_replace.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#FF3B30", flexShrink: 0 }}>×</span>
                <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6, margin: 0 }}>{w}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── ANALOGY ────────────────────────────────────────────── */}
      {intuition.analogy_from_other_domain && (
        <Section title="Analogy from Another Domain">
          <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.8, marginTop: "16px", fontStyle: "italic" }}>
            {intuition.analogy_from_other_domain}
          </p>
        </Section>
      )}

      {/* ── HISTORICAL CONTEXT ─────────────────────────────────── */}
      {intuition.historical_context && (
        <Section title="Historical Context">
          <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.8, marginTop: "16px" }}>
            {intuition.historical_context}
          </p>
        </Section>
      )}

      {/* ── WHY IT MATTERS ─────────────────────────────────────── */}
      {intuition.why_it_matters && (
        <Section title="Why This Matters">
          <p style={{ ...S.body, marginTop: "16px" }}>{intuition.why_it_matters}</p>
        </Section>
      )}

      {/* ── PRACTICE CTA ───────────────────────────────────────── */}
      <div style={{ background: "#007AFF", borderRadius: "18px", padding: "28px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <p style={{ fontSize: "17px", fontWeight: 600, color: "#fff", margin: 0 }}>Ready to test yourself?</p>
        <button
          onClick={() => navigate("/practice", { state: { topic: topic.name } })}
          style={{ background: "#fff", color: "#007AFF", fontWeight: 600, fontSize: "14px", padding: "10px 24px", borderRadius: "22px", border: "none", cursor: "pointer", flexShrink: 0 }}
        >
          Practice Questions →
        </button>
      </div>
    </div>
  );
}
