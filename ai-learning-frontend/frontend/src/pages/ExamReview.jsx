import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BEHAVIOR_COLOR = {
  correct:           "border-green-300 bg-green-50",
  concept_error:     "border-red-300 bg-red-50",
  calculation_error: "border-yellow-300 bg-yellow-50",
  partial_logic:     "border-purple-300 bg-purple-50",
  guessing:          "border-orange-300 bg-orange-50",
  misinterpretation: "border-blue-300 bg-blue-50",
};

const BEHAVIOR_LABEL = {
  correct:           { text: "Correct",                color: "bg-green-100 text-green-800" },
  concept_error:     { text: "Concept error",          color: "bg-red-100 text-red-800" },
  calculation_error: { text: "Calculation mistake",    color: "bg-yellow-100 text-yellow-800" },
  partial_logic:     { text: "Incomplete logic",       color: "bg-purple-100 text-purple-800" },
  guessing:          { text: "Guessing",               color: "bg-orange-100 text-orange-800" },
  misinterpretation: { text: "Misread question",       color: "bg-blue-100 text-blue-800" },
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
    <div className="max-w-3xl mx-auto">
      {/* Summary */}
      <div className="card p-6 mb-6">
        <h1 className="text-xl font-semibold mb-4">Exam Review — Full Solutions</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Score"      value={score?.toFixed ? score.toFixed(2) : score} />
          <Stat label="Accuracy"   value={`${accuracy}%`} />
          {rank    && <Stat label="Rank"       value={`#${rank} / ${total}`} />}
          {pct     && <Stat label="Percentile" value={`${pct}%`} />}
        </div>
      </div>

      {/* Per-question review */}
      <div className="flex flex-col gap-4 mb-6">
        {displayed.map((q, i) => {
          const bInfo = BEHAVIOR_LABEL[q.selectedType] || BEHAVIOR_LABEL.concept_error;
          return (
            <div key={i} className={`card p-5 border ${BEHAVIOR_COLOR[q.selectedType] || "border-surface-border"}`}>
              {/* Question header */}
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-400">Q{i + 1}</p>
                <div className="flex items-center gap-2">
                  <span className={`badge text-xs ${bInfo.color}`}>{bInfo.text}</span>
                  <span className={`text-sm font-semibold ${q.isCorrect ? "text-green-700" : "text-red-600"}`}>
                    {q.isCorrect ? "✓ Correct" : "✗ Wrong"}
                    {q.marksAwarded !== undefined && (
                      <span className="ml-1 text-xs font-normal">({q.marksAwarded > 0 ? `+${q.marksAwarded}` : q.marksAwarded})</span>
                    )}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-900 mb-3">{q.questionText}</p>

              {/* Your answer vs correct */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`p-2.5 rounded-lg text-xs ${q.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <p className="font-medium mb-0.5 text-gray-600">Your answer</p>
                  <p className={q.isCorrect ? "text-green-800" : "text-red-800"}>{q.selectedText || "Not answered"}</p>
                </div>
                {!q.isCorrect && (
                  <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-xs">
                    <p className="font-medium mb-0.5 text-gray-600">Correct answer</p>
                    <p className="text-green-800">{q.correctText}</p>
                  </div>
                )}
              </div>

              {/* Solution steps */}
              {q.solutionSteps?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Step-by-step solution</p>
                  <ol className="flex flex-col gap-1">
                    {q.solutionSteps.map((s, si) => (
                      <li key={si} className="text-xs text-gray-700 flex gap-1.5">
                        <span className="text-gray-400 shrink-0">{si + 1}.</span>{s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Shortcut */}
              {q.shortcut && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-900">
                  ⚡ {q.shortcut}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {review.length > 5 && (
        <button onClick={() => setShowAll((s) => !s)} className="btn-secondary w-full mb-6">
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

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
