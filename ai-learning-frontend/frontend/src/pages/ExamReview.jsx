import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BEHAVIOR_BORDER = {
  correct:           "border-apple-green/25",
  concept_error:     "border-apple-red/25",
  calculation_error: "border-apple-yellow/25",
  partial_logic:     "border-apple-purple/25",
  guessing:          "border-apple-orange/25",
  misinterpretation: "border-apple-blue/25",
};

const BEHAVIOR_LABEL = {
  correct:           { text: "Correct",            bg: "bg-apple-green/10",  text_c: "text-apple-green"  },
  concept_error:     { text: "Concept error",       bg: "bg-apple-red/10",    text_c: "text-apple-red"    },
  calculation_error: { text: "Calculation mistake", bg: "bg-apple-yellow/10", text_c: "text-apple-yellow" },
  partial_logic:     { text: "Incomplete logic",    bg: "bg-apple-purple/10", text_c: "text-apple-purple" },
  guessing:          { text: "Guessing",            bg: "bg-apple-orange/10", text_c: "text-apple-orange" },
  misinterpretation: { text: "Misread question",    bg: "bg-apple-blue/10",   text_c: "text-apple-blue"   },
};

export default function ExamReview() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const review  = state?.review  || [];
  const score   = state?.score   || 0;
  const rank    = state?.rank;
  const pct     = state?.percentile;
  const total   = state?.total;

  const correct  = review.filter((r) => r.isCorrect).length;
  const accuracy = review.length ? Math.round((correct / review.length) * 100) : 0;

  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? review : review.slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Summary */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Exam Review</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">Full solutions and breakdown</p>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Score"      value={score?.toFixed ? score.toFixed(2) : score} accent="blue"   />
          <StatCard label="Accuracy"   value={`${accuracy}%`}                             accent="green"  />
          {rank && <StatCard label="Rank"       value={`#${rank} / ${total}`}             accent="purple" />}
          {pct  && <StatCard label="Percentile" value={`${pct}%`}                         accent="orange" />}
        </div>
      </div>

      {/* Per-question review */}
      <div className="flex flex-col gap-3">
        {displayed.map((q, i) => {
          const bInfo = BEHAVIOR_LABEL[q.selectedType] || BEHAVIOR_LABEL.concept_error;
          return (
            <div
              key={i}
              className={`card p-5 border ${BEHAVIOR_BORDER[q.selectedType] || "border-apple-gray5"}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] text-apple-gray">Q{i + 1}</p>
                <div className="flex items-center gap-2">
                  <span className={`badge ${bInfo.bg} ${bInfo.text_c}`}>{bInfo.text}</span>
                  <span className={`text-[13px] font-semibold ${q.isCorrect ? "text-apple-green" : "text-apple-red"}`}>
                    {q.isCorrect ? "✓ Correct" : "✗ Wrong"}
                    {q.marksAwarded !== undefined && (
                      <span className="ml-1 text-[11px] font-normal">
                        ({q.marksAwarded > 0 ? `+${q.marksAwarded}` : q.marksAwarded})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <p className="text-[14px] font-semibold text-[var(--label)] mb-3">{q.questionText}</p>

              {/* Your answer vs correct */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`p-3 rounded-apple-lg text-[12px] ${
                  q.isCorrect
                    ? "bg-apple-green/8 border border-apple-green/20"
                    : "bg-apple-red/8 border border-apple-red/20"
                }`}>
                  <p className="font-semibold text-apple-gray mb-0.5">Your answer</p>
                  <p className={q.isCorrect ? "text-apple-green" : "text-apple-red"}>
                    {q.selectedText || "Not answered"}
                  </p>
                </div>
                {!q.isCorrect && (
                  <div className="p-3 rounded-apple-lg bg-apple-green/8 border border-apple-green/20 text-[12px]">
                    <p className="font-semibold text-apple-gray mb-0.5">Correct answer</p>
                    <p className="text-apple-green">{q.correctText}</p>
                  </div>
                )}
              </div>

              {/* Solution steps */}
              {q.solutionSteps?.length > 0 && (
                <div className="bg-apple-gray6 rounded-apple-lg p-4 mb-3">
                  <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-2">
                    Step-by-step solution
                  </p>
                  <ol className="flex flex-col gap-1.5">
                    {q.solutionSteps.map((s, si) => (
                      <li key={si} className="text-[13px] text-[var(--label2)] flex gap-2">
                        <span className="text-apple-gray shrink-0 font-mono">{si + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Shortcut */}
              {q.shortcut && (
                <div className="bg-apple-orange/6 border border-apple-orange/15 rounded-apple-lg px-4 py-2.5 text-[13px] text-apple-orange">
                  ⚡ {q.shortcut}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {review.length > 5 && (
        <button onClick={() => setShowAll((s) => !s)} className="btn-secondary w-full">
          {showAll ? "Show fewer" : `Show all ${review.length} questions`}
        </button>
      )}

      <div className="flex gap-3">
        <button onClick={() => navigate("/competition")} className="btn-secondary flex-1">
          ← Back to Exams
        </button>
        <button onClick={() => navigate("/practice")} className="btn-primary flex-1">
          Practice weak areas →
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accents = {
    blue:   { ring: "ring-apple-blue/20",   text: "text-apple-blue"   },
    green:  { ring: "ring-apple-green/20",  text: "text-apple-green"  },
    purple: { ring: "ring-apple-purple/20", text: "text-apple-purple" },
    orange: { ring: "ring-apple-orange/20", text: "text-apple-orange" },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`card p-4 ring-1 ${a.ring} shadow-none`}>
      <p className="text-[11px] text-apple-gray mb-1">{label}</p>
      <p className={`text-[20px] font-bold ${a.text}`}>{value}</p>
    </div>
  );
}
