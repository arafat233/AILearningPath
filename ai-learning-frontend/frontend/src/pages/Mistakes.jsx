import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMistakes } from "../services/api";

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Mistakes() {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState(null);
  const [error, setError] = useState(null);
  const [topicFilter, setTopicFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMistakes()
      .then(({ data }) => setMistakes(data.data || data))
      .catch((err) => setError(err.response?.data?.error || "Could not load mistakes"));
  }, []);

  const topics = useMemo(
    () => [...new Set((mistakes || []).map((m) => m.topic))],
    [mistakes]
  );
  const visible = useMemo(
    () => (mistakes || []).filter((m) => topicFilter === "all" || m.topic === topicFilter),
    [mistakes, topicFilter]
  );
  const dueIds = visible.filter((m) => m.dueForRetry).map((m) => m.questionId);

  const retry = (ids, label) =>
    navigate("/practice", { state: { retryWrongIds: ids, autoStart: true, retryLabel: label } });

  if (error) {
    return <div className="max-w-3xl mx-auto p-6 text-[14px] text-red-500">{error}</div>;
  }
  if (!mistakes) {
    return <div className="max-w-3xl mx-auto p-6 text-[14px] text-apple-gray">Loading your mistakes…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#1c1c1e]">Mistake Notebook</h1>
          <p className="text-[13px] text-apple-gray mt-1">
            Every wrong answer lands here automatically. Answer it correctly in a retry and it clears itself.
          </p>
        </div>
        {dueIds.length > 0 && (
          <button
            onClick={() => retry(dueIds, `Retrying ${dueIds.length} mistake${dueIds.length !== 1 ? "s" : ""} due today`)}
            className="px-4 py-2.5 rounded-full text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "#1a1040" }}
          >
            Retry {dueIds.length} due now
          </button>
        )}
      </div>

      {topics.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          {["all", ...topics].map((t) => (
            <button
              key={t}
              onClick={() => setTopicFilter(t)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                topicFilter === t
                  ? "bg-[#1a1040] text-white border-[#1a1040]"
                  : "bg-white text-[#3A3A3C] border-[#f0f0f5] hover:border-[#d0d0d8]"
              }`}
            >
              {t === "all" ? `All (${mistakes.length})` : t}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#f0f0f5] px-6 py-10 text-center">
          <p className="text-[15px] font-semibold text-[#1c1c1e]">No mistakes here 🎉</p>
          <p className="text-[13px] text-apple-gray mt-1">
            Wrong answers from practice and exams will appear automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((m) => (
            <div key={m.questionId} className="rounded-2xl bg-white border border-[#f0f0f5] shadow-sm">
              <button
                onClick={() => setExpanded(expanded === m.questionId ? null : m.questionId)}
                className="w-full text-left px-5 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-medium text-[#1c1c1e] flex-1">{m.questionText}</p>
                  {m.dueForRetry ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[11px] font-semibold">
                      Retry due
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#f5f5fa] text-apple-gray text-[11px] font-semibold">
                      Retry {fmtDate(m.retryDate)}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-apple-gray mt-1.5">
                  {m.topic}{m.subject ? ` · ${m.subject}` : ""} · wrong on {fmtDate(m.wrongAt)}
                </p>
              </button>

              {expanded === m.questionId && (
                <div className="px-5 pb-4 space-y-2 border-t border-[#f5f5fa] pt-3">
                  {m.selectedAnswer && (
                    <p className="text-[13px]">
                      <span className="text-apple-gray">Your answer: </span>
                      <span className="text-red-500 font-medium">{m.selectedAnswer}</span>
                    </p>
                  )}
                  {m.correctAnswer && (
                    <p className="text-[13px]">
                      <span className="text-apple-gray">Correct answer: </span>
                      <span className="text-green-600 font-medium">{m.correctAnswer}</span>
                    </p>
                  )}
                  <p className="text-[13px]">
                    <span className="text-apple-gray">Why: </span>
                    <span className="text-[#1c1c1e]">{m.whyWrong}</span>
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => retry([m.questionId], "Retrying 1 question from your Mistake Notebook")}
                      className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-white hover:opacity-90"
                      style={{ background: "#1a1040" }}
                    >
                      Retry now
                    </button>
                    {m.similarQuestionIds?.length > 0 && (
                      <button
                        onClick={() =>
                          retry(m.similarQuestionIds, `Practicing ${m.similarQuestionIds.length} similar questions`)
                        }
                        className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-white border border-[#f0f0f5] text-[#3A3A3C] hover:border-[#d0d0d8]"
                      >
                        Practice {m.similarQuestionIds.length} similar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
