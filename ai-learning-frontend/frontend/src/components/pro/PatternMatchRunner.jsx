/**
 * PatternMatchRunner — full exercise runner for pattern_match exercises.
 *
 * No code editor, no sandbox. The learner picks the right algorithm pattern
 * from a list, clicks Check, and sees an explanation. Options come from
 * exercise.blanks[0].options (returned by the API; testCases are server-only).
 *
 * Props:
 *   exercise  — ProExercise doc (blanks, scenario, instructions, title, etc.)
 *   navigate  — react-router navigate fn (for ← Back)
 *   tutorOpen / setTutorOpen — forwarded from ProExerciseRunner
 */
import { useState } from "react";
import { proSubmitExercise } from "../../services/api";
import TutorPanel from "./TutorPanel";

// Human-readable labels for the 14 canonical pattern IDs.
export const PATTERN_LABELS = {
  two_pointer:          "Two Pointers",
  sliding_window:       "Sliding Window",
  prefix_sum:           "Prefix Sum",
  binary_search:        "Binary Search",
  hash_map:             "Hash Map / Set",
  monotonic_stack:      "Monotonic Stack",
  dfs:                  "DFS",
  bfs:                  "BFS",
  topological_sort:     "Topological Sort",
  dynamic_programming:  "Dynamic Programming",
  greedy:               "Greedy",
  backtracking:         "Backtracking",
  divide_and_conquer:   "Divide & Conquer",
  union_find:           "Union Find",
  bit_manipulation:     "Bit Manipulation",
};

export default function PatternMatchRunner({ exercise, navigate, tutorOpen, setTutorOpen }) {
  const options  = exercise.blanks?.[0]?.options || [];
  const [selected,   setSelected]   = useState(null);
  const [result,     setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  const handleCheck = async () => {
    if (!selected) { setError("Pick a pattern first."); return; }
    setSubmitting(true);
    setError("");
    try {
      const r = await proSubmitExercise(exercise.exerciseId, selected);
      const d  = r.data?.data;
      setResult({
        passed:  d?.passed,
        message: d?.testResults?.[0]?.message || "",
        xp:      d?.xpAwarded || 0,
      });
    } catch (err) {
      setError(err?.response?.data?.error || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TutorPanel
        exerciseId={exercise.exerciseId}
        studentCode={selected || ""}
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
      />

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors mb-3 block">
            ← Back
          </button>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray">
                {exercise.level} · pattern recognition
              </span>
              <h1 className="text-[24px] font-bold tracking-tight text-[var(--label)] mt-2">{exercise.title}</h1>
            </div>
            <button
              onClick={() => setTutorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-blue/10 hover:bg-apple-blue/20 transition-colors text-apple-blue text-[12px] font-semibold shrink-0"
            >
              <span>💬</span>
              <span>Ask tutor</span>
            </button>
          </div>
        </div>

        {/* Problem description */}
        {exercise.scenario && (
          <div className="card p-5">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-2">Problem</p>
            <p className="text-[15px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{exercise.scenario}</p>
          </div>
        )}
        {exercise.instructions && (
          <div className="card p-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-2">Constraints / Notes</p>
            <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{exercise.instructions}</p>
          </div>
        )}

        {/* Pattern picker */}
        {!result && (
          <div className="card p-5 space-y-4">
            <p className="text-[13px] font-bold text-[var(--label)]">Which algorithm pattern solves this most efficiently?</p>
            <div className="grid grid-cols-2 gap-2.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelected(opt); setError(""); }}
                  className={`text-left px-4 py-3 rounded-xl border-2 text-[14px] font-medium transition-all ${
                    selected === opt
                      ? "border-apple-blue bg-apple-blue/8 text-apple-blue"
                      : "border-[#E5E5EA] text-[var(--label)] hover:border-apple-blue/40 hover:bg-[var(--fill)]"
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
              className="btn-primary w-full text-[14px] font-semibold disabled:opacity-50"
            >
              {submitting ? "Checking…" : "Check answer →"}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`card p-6 border-l-4 space-y-3 ${result.passed ? "border-apple-green" : "border-apple-red"}`}>
            <div className="flex items-center gap-3">
              <span className={`text-[22px] ${result.passed ? "text-apple-green" : "text-apple-red"}`}>
                {result.passed ? "✓" : "✗"}
              </span>
              <p className={`text-[18px] font-bold ${result.passed ? "text-apple-green" : "text-apple-red"}`}>
                {result.passed ? "Correct!" : "Not quite"}
              </p>
              {result.passed && result.xp > 0 && (
                <span className="ml-auto text-[13px] font-bold text-apple-green">+{result.xp} XP</span>
              )}
            </div>
            <p className="text-[14px] text-[var(--label)] leading-relaxed">{result.message}</p>
            <p className="text-[12px] text-apple-gray">
              Your answer: <span className="font-semibold">{PATTERN_LABELS[selected] || selected}</span>
            </p>
            {exercise.hints?.length > 0 && !result.passed && (
              <div className="pt-3 border-t border-[var(--separator)]">
                <p className="text-[11px] font-bold text-apple-gray uppercase tracking-wider mb-1.5">Hint</p>
                <p className="text-[13px] text-[var(--label)]">{exercise.hints[0]}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
