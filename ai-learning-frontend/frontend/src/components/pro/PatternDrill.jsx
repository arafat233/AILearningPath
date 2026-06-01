/**
 * PatternDrill — quick-fire mode for pattern_match exercises on a topic.
 *
 * Shows all pattern_match exercises for a topic sequentially with no page
 * transitions. At the end displays a score card.
 *
 * Props:
 *   exercises — array of pattern_match ProExercise docs (must include blanks)
 *   onClose   — called when the user dismisses the drill
 */
import { useState } from "react";
import { proSubmitExercise } from "../../services/api";
import { PATTERN_LABELS } from "./PatternMatchRunner";

export default function PatternDrill({ exercises, onClose, onComplete, title = "Pattern Drills" }) {
  const [idx,       setIdx]       = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [result,    setResult]    = useState(null); // { passed, message }
  const [submitting,setSubmitting]= useState(false);
  const [error,     setError]     = useState("");
  const [score,     setScore]     = useState(0);   // cumulative correct count
  const [done,      setDone]      = useState(false);

  const ex      = exercises[idx];
  const options = ex?.blanks?.[0]?.options || [];
  const total   = exercises.length;

  const handleCheck = async () => {
    if (!selected) { setError("Pick a pattern first."); return; }
    setSubmitting(true);
    setError("");
    try {
      const r = await proSubmitExercise(ex.exerciseId, selected);
      const d  = r.data?.data;
      const passed = d?.passed ?? false;
      setResult({ passed, message: d?.testResults?.[0]?.message || "" });
      if (passed) setScore((s) => s + 1);
    } catch (err) {
      setError(err?.response?.data?.error || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= total) {
      setDone(true);
      // Surface the final score so callers (e.g. the spaced-repetition review
      // flow) can derive a rating. `score` is current here because the last
      // answer was graded in handleCheck before this click.
      onComplete?.({ score, total });
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setResult(null);
      setError("");
    }
  };

  // ── Done screen ──
  if (done) {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 80 ? "Great instincts!" : pct >= 60 ? "Getting there!" : "Keep practising";
    const color = pct >= 80 ? "text-apple-green" : pct >= 60 ? "text-apple-orange" : "text-apple-red";
    return (
      <DrillOverlay onClose={onClose} title={title}>
        <div className="text-center space-y-4 py-4">
          <p className="text-[44px] font-bold tabular-nums" style={{ color: pct >= 80 ? "#34C759" : pct >= 60 ? "#FF9500" : "#FF3B30" }}>
            {score}/{total}
          </p>
          <p className={`text-[18px] font-bold ${color}`}>{grade}</p>
          <p className="text-[13px] text-apple-gray">{pct}% correct in this drill</p>
          <div className="h-2 bg-[var(--fill)] rounded-full overflow-hidden mx-auto max-w-xs">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: pct >= 80 ? "#34C759" : pct >= 60 ? "#FF9500" : "#FF3B30" }} />
          </div>
          <button onClick={onClose} className="btn-primary mt-4">Done</button>
        </div>
      </DrillOverlay>
    );
  }

  // ── Exercise screen ──
  return (
    <DrillOverlay onClose={onClose} title={title}>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex gap-1">
          {exercises.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < idx ? "bg-apple-blue" : i === idx ? "bg-apple-blue/40" : "bg-[var(--fill)]"
            }`} />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-apple-gray tabular-nums">{idx + 1}/{total}</span>
      </div>

      {/* Problem */}
      <div className="space-y-3 mb-5">
        <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">
          {ex.level} · pattern recognition
        </p>
        {ex.scenario && (
          <p className="text-[15px] text-[var(--label)] leading-relaxed">{ex.scenario}</p>
        )}
        {ex.instructions && (
          <p className="text-[13px] text-apple-gray leading-relaxed">{ex.instructions}</p>
        )}
      </div>

      {/* Options */}
      {!result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSelected(opt); setError(""); }}
                className={`text-left px-3.5 py-2.5 rounded-xl border-2 text-[13px] font-medium transition-all ${
                  selected === opt
                    ? "border-apple-blue bg-apple-blue/8 text-apple-blue"
                    : "border-[#E5E5EA] text-[var(--label)] hover:border-apple-blue/40"
                }`}
              >
                {PATTERN_LABELS[opt] || opt}
              </button>
            ))}
          </div>
          {error && <p className="text-[12px] text-apple-red">{error}</p>}
          <button
            onClick={handleCheck}
            disabled={!selected || submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? "Checking…" : "Check →"}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className={`card p-4 border-l-4 ${result.passed ? "border-apple-green" : "border-apple-red"}`}>
            <p className={`text-[15px] font-bold mb-1 ${result.passed ? "text-apple-green" : "text-apple-red"}`}>
              {result.passed ? "✓ Correct!" : "✗ Not quite"}
            </p>
            <p className="text-[13px] text-[var(--label)] leading-relaxed">{result.message}</p>
          </div>
          <button onClick={handleNext} className="btn-primary w-full">
            {idx + 1 < total ? "Next →" : "See score →"}
          </button>
        </div>
      )}
    </DrillOverlay>
  );
}

function DrillOverlay({ children, onClose, title = "Pattern Drills" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg)] rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-2 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-bold text-[var(--label)]">{title}</p>
          <button onClick={onClose} className="text-apple-gray hover:text-[var(--label)] text-[20px] leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
