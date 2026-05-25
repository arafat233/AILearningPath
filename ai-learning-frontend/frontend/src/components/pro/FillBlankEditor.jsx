/**
 * FillBlankEditor — inline-input editor for fill_blank exercises.
 *
 * Renders the exercise's starterCode as static monospaced text with
 * literal `______` (six underscores) replaced by real <input> fields.
 * The student types into the inputs; the component reconstructs the
 * full source on every keystroke and emits it via onChange so the rest
 * of the submission flow (proSubmitExercise → backend → Judge0) is
 * unchanged.
 *
 * Why not Monaco for this case:
 *   - Monaco red-squiggles `______` as syntax errors and offers spurious
 *     completions.
 *   - The student doesn't need to manipulate the surrounding code; only
 *     the blanks should be editable.
 *   - Per-blank tooltips with hints are easier on a real <input>.
 *
 * Convention: blanks in starterCode are exactly six underscores ______.
 * blanks[] array carries optional `hint` per blank, in source order.
 *
 * Submission shape: when the student leaves a blank empty, the
 * reconstructed source keeps `______` there — so the backend's
 * must_contain / must_compile tests will fail with a clear stderr
 * about an unexpected identifier, telling the student which blank
 * they missed.
 */
import React, { useEffect, useMemo, useState } from "react";

export default function FillBlankEditor({ skeleton, blanks = [], onChange, height = "420px" }) {
  const segments = useMemo(() => (skeleton || "").split("______"), [skeleton]);
  const blankCount = Math.max(0, segments.length - 1);
  const [values, setValues] = useState(() => Array(blankCount).fill(""));

  // Reset blank values when the exercise (skeleton) changes.
  useEffect(() => {
    setValues(Array(blankCount).fill(""));
  }, [skeleton, blankCount]);

  // Emit the reconstructed source upstream on every keystroke. Empty
  // blanks stay as literal `______` so the user sees the same shape if
  // they peek at the raw submission.
  useEffect(() => {
    let out = "";
    for (let i = 0; i < segments.length; i++) {
      out += segments[i];
      if (i < blankCount) out += values[i].length > 0 ? values[i] : "______";
    }
    onChange(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, segments]);

  const setAt = (i, v) =>
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  if (blankCount === 0) {
    // Defensive fallback — exercise marked fill_blank but no ______ markers.
    // Render the skeleton read-only so the user at least sees the code.
    return (
      <pre className="m-0 bg-[#1e1e1e] text-[#d4d4d4] p-4 overflow-x-auto font-mono text-[13px] leading-[1.6]"
           style={{ height, fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}>
        <code>{skeleton}</code>
      </pre>
    );
  }

  return (
    <div
      className="bg-[#1e1e1e] text-[#d4d4d4] p-4 overflow-x-auto overflow-y-auto"
      style={{
        height,
        fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <pre className="m-0 whitespace-pre">
        <code>
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              <span>{seg}</span>
              {i < blankCount && (
                <BlankInput
                  index={i}
                  value={values[i]}
                  onChange={(v) => setAt(i, v)}
                  hint={blanks?.[i]?.hint}
                />
              )}
            </React.Fragment>
          ))}
        </code>
      </pre>
    </div>
  );
}

function BlankInput({ index, value, onChange, hint }) {
  // Auto-size: ~9px per monospace char, floor 80px, ceiling ~340px.
  const width = Math.min(340, Math.max(80, value.length * 9 + 28));
  const filled = value.length > 0;
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={hint || `Blank ${index + 1}`}
      placeholder={`blank ${index + 1}`}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      style={{
        display: "inline-block",
        background: filled ? "rgba(0, 122, 255, 0.12)" : "rgba(255,255,255,0.04)",
        border: "none",
        borderBottom: filled ? "2px solid #007AFF" : "2px dashed #007AFF",
        color: "#d4d4d4",
        fontFamily: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        padding: "0 6px",
        margin: "0 2px",
        width: `${width}px`,
        verticalAlign: "baseline",
        outline: "none",
        borderRadius: "3px",
        transition: "background 120ms ease",
      }}
    />
  );
}
