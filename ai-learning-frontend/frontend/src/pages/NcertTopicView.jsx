import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNcertTopicContent } from "../services/api";

/* Collapsible card — used for text-heavy sections */
function Section({ title, accent, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[18px] overflow-hidden"
      style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-9 py-5 text-left"
      >
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]"
          style={{ color: accent || "#1D1D1F" }}>
          {title}
        </h2>
        <span className="text-[14px] transition-transform shrink-0"
          style={{ color: "#86868B", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
          ›
        </span>
      </button>
      {open && (
        <div className="px-9 pb-7 border-t" style={{ borderColor: "#E5E5EA" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* Exactly mirrors the HTML .diagram card */
function DiagramCard({ diagram }) {
  return (
    <div style={{
      background: "#FFFFFF",
      padding: "36px",
      borderRadius: "18px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    }}>
      <h3 style={{
        margin: "0 0 4px 0",
        color: "#1D1D1F",
        fontWeight: 600,
        fontSize: "19px",
        letterSpacing: "-0.01em",
      }}>
        {diagram.title}
      </h3>
      <div style={{
        color: "#86868B",
        fontSize: "13px",
        marginBottom: "24px",
        fontFamily: "'SF Mono', ui-monospace, monospace",
      }}>
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

function BulletList({ items, color }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2 mt-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
            style={{ background: color || "#007AFF" }} />
          <p className="text-[14px] leading-relaxed" style={{ color: "#1D1D1F" }}>
            {typeof item === "string" ? item : item.text || JSON.stringify(item)}
          </p>
        </li>
      ))}
    </ul>
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
        <p className="text-[15px] font-semibold mb-2" style={{ color: "#1D1D1F" }}>Teaching content not found</p>
        <p className="text-[13px] mb-3" style={{ color: "#86868B" }}>
          Run <code className="font-mono bg-gray-100 px-2 py-0.5 rounded">npm run import:ncert</code> in the backend folder.
        </p>
        <button onClick={() => navigate(-1)} className="btn-secondary text-[13px] mt-4">← Go Back</button>
      </div>
    </div>
  );

  const tc        = topic.teaching_content ?? {};
  const intuition = tc.intuition ?? {};
  const derivation = tc.derivation ?? {};

  return (
    <div className="max-w-3xl mx-auto space-y-7" style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="text-[13px] flex items-center gap-1 transition-colors hover:opacity-70"
        style={{ color: "#86868B" }}>
        ‹ Back
      </button>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: "18px", padding: "36px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <p style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#86868B", marginBottom: "8px" }}>
          {topicId}
        </p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "#1D1D1F", lineHeight: 1.2, margin: "0 0 16px" }}>
          {topic.name}
        </h1>

        {/* Key takeaway pill */}
        {tc.key_takeaway && (
          <div style={{ background: "#F5F5F7", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#86868B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
              Key Takeaway
            </p>
            <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6 }}>{tc.key_takeaway}</p>
          </div>
        )}

        {/* Prerequisites */}
        {topic.prerequisite_knowledge?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span style={{ fontSize: "12px", color: "#86868B" }}>Prerequisites:</span>
            {topic.prerequisite_knowledge.map((p, i) => (
              <span key={i} style={{ fontSize: "12px", background: "#F5F5F7", color: "#86868B", padding: "2px 10px", borderRadius: "20px" }}>
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Key formulas */}
        {topic.key_formulas?.length > 0 && (
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E5E5EA" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#86868B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
              Key Formulas
            </p>
            <ul className="space-y-2">
              {topic.key_formulas.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#E5F2FF", color: "#007AFF", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <code style={{ fontSize: "13px", fontFamily: "ui-monospace, monospace", color: "#1D1D1F", lineHeight: 1.6 }}>
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
        <div style={{ background: "#fff", borderRadius: "18px", padding: "36px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#007AFF", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
            The Hook
          </p>
          <p style={{ fontSize: "17px", color: "#1D1D1F", lineHeight: 1.7, fontWeight: 400 }}>{intuition.hook}</p>
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
          <div className="space-y-4 mt-4">
            {intuition.real_world_anchors.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div style={{ width: "6px", borderRadius: "3px", background: "#007AFF", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1D1D1F", marginBottom: "4px" }}>{a.scenario}</p>
                  <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.6 }}>{a.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── THE KEY INSIGHT ────────────────────────────────────── */}
      {intuition.the_pivot_idea && (
        <div style={{ background: "#fff", borderRadius: "18px", padding: "36px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", borderLeft: "4px solid #007AFF" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#007AFF", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
            The Central Idea
          </p>
          <p style={{ fontSize: "15px", color: "#1D1D1F", lineHeight: 1.7 }}>{intuition.the_pivot_idea}</p>
        </div>
      )}

      {/* ── DIAGRAMS — styled exactly like the HTML preview ────── */}
      {tc.svg_diagrams?.length > 0 && (
        <div className="space-y-7">
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#86868B", letterSpacing: "2.5px", textTransform: "uppercase" }}>
            Diagrams
          </p>
          {tc.svg_diagrams.map((d) => (
            <DiagramCard key={d.id} diagram={d} />
          ))}
        </div>
      )}

      {/* ── WORKED EXAMPLES ────────────────────────────────────── */}
      {tc.worked_example && Object.keys(tc.worked_example).length > 0 && (
        <Section title="Worked Examples" defaultOpen={true}>
          <div className="space-y-6 mt-4">
            {Object.values(tc.worked_example).map((ex, i) => (
              <div key={i} style={{ background: "#F5F5F7", borderRadius: "14px", padding: "20px 24px" }}>
                {/* Example number + problem */}
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#86868B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
                  Example {i + 1}
                </p>
                {ex.problem && (
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1D1D1F", marginBottom: "12px", lineHeight: 1.5 }}>{ex.problem}</p>
                )}

                {/* Thought process before starting */}
                {ex.thought_process_before_starting && (
                  <div style={{ background: "#EEF4FF", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#007AFF", marginBottom: "4px" }}>How to approach this</p>
                    <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.6 }}>{ex.thought_process_before_starting}</p>
                  </div>
                )}

                {/* Steps — actual field name is `steps`, each has action + computation + students_internal_voice */}
                {ex.steps?.map((step, si) => (
                  <div key={si} style={{ marginBottom: "14px", paddingLeft: "12px", borderLeft: "2px solid #E5E5EA" }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                      <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#007AFF", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {step.step_number ?? si + 1}
                      </span>
                      <p style={{ fontSize: "13px", color: "#86868B" }}>{step.action}</p>
                    </div>
                    {step.computation && (
                      <p style={{ fontSize: "16px", fontFamily: "ui-monospace, 'SF Mono', monospace", color: "#1D1D1F", margin: "6px 0 6px 30px", fontWeight: 500 }}>
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

                {/* Verification */}
                {ex.verification_after && (
                  <div style={{ background: "#F0FFF4", borderRadius: "10px", padding: "10px 14px", marginTop: "10px" }}>
                    <p style={{ fontSize: "13px", color: "#34C759", fontWeight: 600, marginBottom: "2px" }}>Verify</p>
                    <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.5 }}>{ex.verification_after}</p>
                  </div>
                )}

                {/* Answer */}
                {ex.answer && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E5EA", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#34C759", letterSpacing: "1px" }}>ANS</span>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#1D1D1F" }}>{ex.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── DERIVATION ─────────────────────────────────────────── */}
      {Object.keys(derivation).length > 0 && (
        <Section title="How It's Derived (Proof Sketch)">
          <div className="space-y-4 mt-4">
            {Object.entries(derivation).map(([key, val], i) => {
              if (!val || typeof val !== "string") return null;
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div key={i}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#86868B", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                    {label}
                  </p>
                  <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.7 }}>{val}</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── COMMON MISTAKES ────────────────────────────────────── */}
      {tc.common_misconceptions?.length > 0 && (
        <Section title="Common Mistakes" accent="#FF3B30">
          <div className="space-y-3 mt-4">
            {tc.common_misconceptions.map((m, i) => (
              <div key={i} style={{ background: "#FFF5F5", border: "1px solid #FFD5D5", borderRadius: "12px", padding: "16px 20px" }}>
                {m.misconception && (
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#FF3B30", marginBottom: "6px" }}>{m.misconception}</p>
                )}
                {m.correction && (
                  <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6 }}>{m.correction}</p>
                )}
                {m.example_of_error && (
                  <p style={{ fontSize: "13px", fontFamily: "ui-monospace, monospace", color: "#86868B", marginTop: "6px" }}>{m.example_of_error}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── SHORTCUTS ──────────────────────────────────────────── */}
      {tc.shortcuts_and_tricks?.length > 0 && (
        <Section title="Shortcuts & Tricks" accent="#34C759">
          <div className="space-y-3 mt-4">
            {tc.shortcuts_and_tricks.map((s, i) => (
              <div key={i} style={{ background: "#F0FFF4", border: "1px solid #C6F0D1", borderRadius: "12px", padding: "16px 20px" }}>
                {s.shortcut && <p style={{ fontSize: "14px", fontWeight: 600, color: "#34C759", marginBottom: "4px" }}>{s.shortcut}</p>}
                {s.trick && <p style={{ fontSize: "14px", fontWeight: 600, color: "#34C759", marginBottom: "4px" }}>{s.trick}</p>}
                {s.rule && <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6, marginBottom: "4px" }}>{s.rule}</p>}
                {s.how && <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6 }}>{s.how}</p>}
                {s.example && <p style={{ fontSize: "13px", fontFamily: "ui-monospace, monospace", color: "#86868B", marginTop: "6px" }}>{s.example}</p>}
                {s.when_to_use && <p style={{ fontSize: "12px", color: "#007AFF", marginTop: "6px", fontStyle: "italic" }}>{s.when_to_use}</p>}
                {typeof s === "string" && <p style={{ fontSize: "14px", color: "#1D1D1F" }}>{s}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── WHEN TO USE ────────────────────────────────────────── */}
      {tc.when_to_use_this_method && (
        <Section title="When to Use This Method">
          <div className="space-y-4 mt-4">
            {tc.when_to_use_this_method.use_euclids_algorithm_when?.length > 0 && (
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#34C759", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Use this when:
                </p>
                <BulletList items={tc.when_to_use_this_method.use_euclids_algorithm_when} color="#34C759" />
              </div>
            )}
            {tc.when_to_use_this_method.use_prime_factorisation_instead_when?.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#FF9500", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Use prime factorisation instead when:
                </p>
                <BulletList items={tc.when_to_use_this_method.use_prime_factorisation_instead_when} color="#FF9500" />
              </div>
            )}
            {/* Fallback: render any plain string lists */}
            {typeof tc.when_to_use_this_method === "object" &&
              Object.entries(tc.when_to_use_this_method)
                .filter(([k]) => !["use_euclids_algorithm_when", "use_prime_factorisation_instead_when"].includes(k))
                .map(([k, v]) => (
                  <div key={k} style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#86868B", marginBottom: "6px" }}>
                      {k.replace(/_/g, " ")}
                    </p>
                    {Array.isArray(v)
                      ? <BulletList items={v} />
                      : <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6 }}>{v}</p>}
                  </div>
                ))
            }
          </div>
        </Section>
      )}

      {/* ── EDGE CASES ─────────────────────────────────────────── */}
      {tc.edge_cases?.length > 0 && (
        <Section title="Edge Cases">
          <div className="space-y-3 mt-4">
            {tc.edge_cases.map((e, i) => (
              <div key={i} style={{ background: "#F5F5F7", borderRadius: "12px", padding: "16px 20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#1D1D1F", marginBottom: "4px" }}>
                  {e.case} <span style={{ color: "#007AFF" }}>= {e.value}</span>
                </p>
                {e.reasoning && (
                  <p style={{ fontSize: "13px", color: "#86868B", lineHeight: 1.6 }}>{e.reasoning}</p>
                )}
                {e.where_it_appears && (
                  <p style={{ fontSize: "12px", color: "#007AFF", marginTop: "6px", fontStyle: "italic" }}>{e.where_it_appears}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── HISTORICAL CONTEXT ─────────────────────────────────── */}
      {intuition.historical_context && (
        <Section title="Historical Context">
          <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.8, marginTop: "12px" }}>
            {intuition.historical_context}
          </p>
        </Section>
      )}

      {/* ── WHY IT MATTERS ─────────────────────────────────────── */}
      {intuition.why_it_matters && (
        <Section title="Why This Matters">
          <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.8, marginTop: "12px" }}>
            {intuition.why_it_matters}
          </p>
        </Section>
      )}

      {/* ── WRONG INTUITIONS TO REPLACE ────────────────────────── */}
      {intuition.wrong_intuitions_to_replace?.length > 0 && (
        <Section title="Wrong Intuitions to Replace">
          <div className="space-y-2 mt-4">
            {intuition.wrong_intuitions_to_replace.map((w, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span style={{ color: "#FF3B30", fontWeight: 700, fontSize: "16px", flexShrink: 0, marginTop: "-2px" }}>×</span>
                <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6 }}>{w}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── ANALOGY ────────────────────────────────────────────── */}
      {intuition.analogy_from_other_domain && (
        <Section title="Analogy from Another Domain">
          <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.8, marginTop: "12px", fontStyle: "italic" }}>
            {intuition.analogy_from_other_domain}
          </p>
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
