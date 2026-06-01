/**
 * InterviewLanding — /pro/interview
 *
 * Problem picker. Shows the 25-problem bank filterable by difficulty + topic.
 * Clicking a problem creates a session and navigates to the simulator.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { interviewListProblems, interviewCreateSession, interviewListHistory } from "../../services/api";

const DIFFICULTY_COLOR = {
  easy:   "text-apple-green bg-apple-green/10 border-apple-green/30",
  medium: "text-apple-orange bg-apple-orange/10 border-apple-orange/30",
  hard:   "text-apple-red bg-apple-red/10 border-apple-red/30",
};

const TOPIC_ICON = {
  arrays:  "⬜",
  strings: "🔤",
  trees:   "🌲",
  graphs:  "🕸",
  dp:      "◫",
};

export default function InterviewLanding() {
  const navigate = useNavigate();
  const [problems,    setProblems]    = useState([]);
  const [history,     setHistory]     = useState([]);
  const [filter,      setFilter]      = useState({ difficulty: "", topic: "" });
  const [starting,    setStarting]    = useState(null); // problemId being started
  const [error,       setError]       = useState("");

  useEffect(() => {
    interviewListProblems().then(r => setProblems(r.data?.data || [])).catch(() => {});
    interviewListHistory().then(r => setHistory(r.data?.data || [])).catch(() => {});
  }, []);

  const filtered = problems.filter(p =>
    (!filter.difficulty || p.difficulty === filter.difficulty) &&
    (!filter.topic      || p.topic      === filter.topic)
  );

  const handleStart = async (problemId) => {
    setError("");
    setStarting(problemId);
    try {
      const r = await interviewCreateSession(problemId);
      const sessionId = r.data?.data?._id;
      if (!sessionId) throw new Error("No session ID returned");
      navigate(`/pro/interview/${sessionId}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not start session. Try again.");
      setStarting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)]">Interview Simulator</h1>
          <p className="text-[14px] text-apple-gray mt-1">
            45-minute mock interview with an AI interviewer. Pick a problem and start.
          </p>
        </div>
        <button
          onClick={() => navigate("/pro/interview/history")}
          className="btn-secondary text-[12px] shrink-0"
        >
          History →
        </button>
      </div>

      {error && (
        <div className="card p-3 border-l-4 border-apple-red">
          <p className="text-[12px] text-apple-red font-medium">{error}</p>
        </div>
      )}

      {/* Recent sessions */}
      {history.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Recent sessions</p>
          <div className="flex gap-2 flex-wrap">
            {history.slice(0, 3).map(s => (
              <button key={s._id}
                onClick={() => navigate(`/pro/interview/${s._id}`)}
                className="card px-3 py-2 text-left hover:border-apple-blue transition-colors"
              >
                <p className="text-[12px] font-semibold text-[var(--label)]">{s.problemTitle}</p>
                <p className="text-[10px] text-apple-gray mt-0.5">
                  {s.status === "ended" ? `${s.durationMinutes}m · Score ${s.rubric?.overall ?? "—"}/5` : "In progress"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["", "easy", "medium", "hard"].map(d => (
          <button key={d}
            onClick={() => setFilter(f => ({ ...f, difficulty: d }))}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
              filter.difficulty === d
                ? "bg-apple-blue text-white border-apple-blue"
                : "bg-[var(--fill)] text-apple-gray border-apple-gray5 hover:border-apple-gray3"
            }`}
          >
            {d || "All difficulties"}
          </button>
        ))}
        <span className="text-apple-gray3 self-center">·</span>
        {["", "arrays", "strings", "trees", "graphs", "dp"].map(t => (
          <button key={t}
            onClick={() => setFilter(f => ({ ...f, topic: t }))}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
              filter.topic === t
                ? "bg-apple-purple text-white border-apple-purple"
                : "bg-[var(--fill)] text-apple-gray border-apple-gray5 hover:border-apple-gray3"
            }`}
          >
            {t ? `${TOPIC_ICON[t]} ${t}` : "All topics"}
          </button>
        ))}
      </div>

      {/* Problem grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="card p-4 flex flex-col gap-3 hover:shadow-apple-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] font-bold text-[var(--label)]">{p.title}</p>
                <p className="text-[11px] text-apple-gray mt-0.5">
                  {TOPIC_ICON[p.topic]} {p.topic}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${DIFFICULTY_COLOR[p.difficulty]}`}>
                {p.difficulty}
              </span>
            </div>
            <p className="text-[12px] text-apple-gray leading-relaxed line-clamp-2">{p.description}</p>
            <button
              onClick={() => handleStart(p.id)}
              disabled={!!starting}
              className="mt-auto btn-primary text-[12px] py-2 disabled:opacity-50"
            >
              {starting === p.id ? "Starting…" : "Start interview →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
