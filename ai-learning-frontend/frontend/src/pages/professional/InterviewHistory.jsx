/**
 * InterviewHistory — /pro/interview/history
 * Lists the user's past interview sessions with rubric scores.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { interviewListHistory } from "../../services/api";

const SCORE_COLOR = (s) =>
  s >= 4 ? "text-apple-green" : s >= 3 ? "text-apple-orange" : "text-apple-red";

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewListHistory()
      .then(r => setHistory(r.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[24px] font-bold tracking-tight text-[var(--label)]">Interview History</h1>
        <button onClick={() => navigate("/pro/interview")} className="btn-primary text-[12px]">
          New interview →
        </button>
      </div>

      {loading && <p className="text-[13px] text-apple-gray">Loading…</p>}

      {!loading && history.length === 0 && (
        <div className="card p-8 text-center space-y-3">
          <p className="text-[32px]">🎯</p>
          <p className="text-[15px] font-semibold text-[var(--label)]">No sessions yet</p>
          <p className="text-[13px] text-apple-gray">Complete your first mock interview to see your history.</p>
          <button onClick={() => navigate("/pro/interview")} className="btn-primary text-[13px]">
            Start interview →
          </button>
        </div>
      )}

      <div className="space-y-3">
        {history.map(s => {
          const overall = s.rubric?.overall;
          const date    = new Date(s.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
          return (
            <button
              key={s._id}
              onClick={() => navigate(`/pro/interview/${s._id}`)}
              className="card p-4 w-full text-left hover:shadow-apple-md hover:border-apple-blue transition-all flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[var(--label)] truncate">{s.problemTitle}</p>
                <p className="text-[11px] text-apple-gray mt-0.5">
                  {date} · {s.difficulty} · {s.topic} · {s.durationMinutes ?? "?"}m
                </p>
              </div>
              {s.status === "ended" && overall != null ? (
                <div className="text-right shrink-0">
                  <p className={`text-[20px] font-bold ${SCORE_COLOR(overall)}`}>{overall}/5</p>
                  <p className="text-[10px] text-apple-gray">overall</p>
                </div>
              ) : (
                <span className="text-[11px] text-apple-orange font-semibold shrink-0">In progress →</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
