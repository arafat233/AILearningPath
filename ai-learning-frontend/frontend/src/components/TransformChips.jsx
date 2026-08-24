import { useState } from "react";
import { getTransformation } from "../services/api";

/**
 * TransformChips — one-click AI transformations of a topic (Open-Notebook-inspired).
 * Flashcards / likely exam questions / ELI5 / one-page revision sheet.
 * Results are cross-user cached server-side, so repeat clicks are instant and free.
 *
 * Props: topic (name string, required) · subject · grade
 */

const CHIPS = [
  { kind: "flashcards", label: "⚡ Flashcards" },
  { kind: "examqs",     label: "📝 Likely Exam Qs" },
  { kind: "eli5",       label: "🧒 Explain Simply" },
  { kind: "revision",   label: "📄 Revision Sheet" },
];

function Flashcards({ cards }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards?.length) return null;
  const card = cards[idx];
  const go = (d) => { setFlipped(false); setIdx((idx + d + cards.length) % cards.length); };
  return (
    <div>
      <div onClick={() => setFlipped(f => !f)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setFlipped(f => !f); }}
        style={{ minHeight: "120px", borderRadius: "14px", padding: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
          background: flipped ? "linear-gradient(135deg,#1C1C1E,#2C1D3E)" : "#F5F5F7", color: flipped ? "#FFFFFF" : "#1D1D1F", transition: "background 0.25s" }}>
        <p style={{ fontSize: "15px", lineHeight: 1.6, margin: 0, fontWeight: flipped ? 400 : 600 }}>
          {flipped ? card.back : card.front}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "12px" }}>
        <button onClick={() => go(-1)} style={btnStyle}>‹ Prev</button>
        <span style={{ fontSize: "12px", color: "#86868B" }}>{idx + 1}/{cards.length} · tap card to flip</span>
        <button onClick={() => go(1)} style={btnStyle}>Next ›</button>
      </div>
    </div>
  );
}

function ExamQs({ questions }) {
  const [shown, setShown] = useState({});
  if (!questions?.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {questions.map((q, i) => (
        <div key={i} style={{ background: "#F5F5F7", borderRadius: "12px", padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1D1D1F", margin: 0, lineHeight: 1.5 }}>{i + 1}. {q.question}</p>
            {q.marks != null && <span style={{ fontSize: "11px", fontWeight: 700, color: "#007AFF", flexShrink: 0 }}>[{q.marks} mark{q.marks > 1 ? "s" : ""}]</span>}
          </div>
          {shown[i] ? (
            <div style={{ marginTop: "10px" }}>
              <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{q.answer}</p>
              {q.examTip && <p style={{ fontSize: "12px", color: "#FF9500", margin: "8px 0 0", fontWeight: 600 }}>💡 {q.examTip}</p>}
            </div>
          ) : (
            <button onClick={() => setShown(s => ({ ...s, [i]: true }))} style={{ ...btnStyle, marginTop: "8px" }}>Show answer</button>
          )}
        </div>
      ))}
    </div>
  );
}

function Eli5({ explanation, analogy }) {
  return (
    <div>
      <p style={{ fontSize: "15px", color: "#1D1D1F", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{explanation}</p>
      {analogy && (
        <div style={{ background: "#FFF7E6", borderRadius: "12px", padding: "12px 16px", marginTop: "12px" }}>
          <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.7, margin: 0 }}>🪁 {analogy}</p>
        </div>
      )}
    </div>
  );
}

function RevisionSheet({ sections, formulas, mnemonic }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {(sections || []).map((s, i) => (
        <div key={i}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#007AFF", margin: "0 0 6px" }}>{s.heading}</p>
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {(s.points || []).map((p, j) => <li key={j} style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.7 }}>{p}</li>)}
          </ul>
        </div>
      ))}
      {formulas?.length > 0 && (
        <div style={{ background: "#F5F5F7", borderRadius: "12px", padding: "12px 16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#86868B", margin: "0 0 6px" }}>FORMULAS</p>
          {formulas.map((f, i) => <p key={i} style={{ fontSize: "13px", fontFamily: "'SF Mono',Menlo,monospace", color: "#1D1D1F", margin: "4px 0" }}>{f}</p>)}
        </div>
      )}
      {mnemonic && <p style={{ fontSize: "13px", color: "#BF5AF2", fontWeight: 600, margin: 0 }}>🧠 {mnemonic}</p>}
    </div>
  );
}

const btnStyle = { padding: "6px 14px", borderRadius: "8px", border: "1px solid #E5E5EA", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#007AFF" };

export default function TransformChips({ topic, subject = "Math", grade = "10" }) {
  const [active, setActive]   = useState(null);   // kind currently shown
  const [loading, setLoading] = useState(null);   // kind currently fetching
  const [results, setResults] = useState({});     // kind -> data
  const [error, setError]     = useState(null);

  if (!topic) return null;

  const load = async (kind) => {
    if (active === kind) { setActive(null); return; }          // toggle off
    if (results[kind])   { setActive(kind); return; }          // already fetched
    setLoading(kind); setError(null);
    try {
      const r = await getTransformation(topic, kind, subject, grade);
      setResults(prev => ({ ...prev, [kind]: r.data?.data }));
      setActive(kind);
    } catch (e) {
      setError(e.response?.data?.error || e.response?.data?.message || "Couldn't generate that right now — try again in a minute.");
    } finally {
      setLoading(null);
    }
  };

  const data = active ? results[active] : null;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {CHIPS.map(({ kind, label }) => (
          <button key={kind} onClick={() => load(kind)} disabled={loading !== null}
            style={{ padding: "7px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: loading ? "wait" : "pointer",
              border: active === kind ? "1.5px solid #007AFF" : "1.5px solid #E5E5EA",
              background: active === kind ? "rgba(0,122,255,0.08)" : "#fff",
              color: "#007AFF", opacity: loading && loading !== kind ? 0.5 : 1 }}>
            {loading === kind ? "Generating…" : label}
          </button>
        ))}
      </div>
      {error && <p style={{ fontSize: "12px", color: "#FF3B30", margin: "10px 0 0" }}>{error}</p>}
      {data && (
        <div style={{ background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 22px", marginTop: "12px" }}>
          {active === "flashcards" && <Flashcards cards={data.cards} />}
          {active === "examqs"     && <ExamQs questions={data.questions} />}
          {active === "eli5"       && <Eli5 explanation={data.explanation} analogy={data.analogy} />}
          {active === "revision"   && <RevisionSheet sections={data.sections} formulas={data.formulas} mnemonic={data.mnemonic} />}
          {data.citation && <p style={{ fontSize: "11px", color: "#AEAEB2", margin: "14px 0 0" }}>{data.citation}</p>}
        </div>
      )}
    </div>
  );
}
