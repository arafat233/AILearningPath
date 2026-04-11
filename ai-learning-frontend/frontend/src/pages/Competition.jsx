import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listExams, startExam, submitExam, getLeaderboard } from "../services/api";

const STATES = { LIST: "list", EXAM: "exam", RESULT: "result", BOARD: "board" };

export default function Competition() {
  const navigate                      = useNavigate();
  const [state, setState]             = useState(STATES.LIST);
  const [exams, setExams]             = useState([]);
  const [activeExam, setActiveExam]   = useState(null);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selected, setSelected]       = useState(null);
  const [result, setResult]           = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeExamId, setActiveExamId] = useState(null);
  const [timeLeft, setTimeLeft]       = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const answersRef       = useRef([]);
  const timerRef         = useRef(null);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    listExams().then((r) => setExams(r.data)).catch(() => setError("Could not load exams."));
  }, []);

  useEffect(() => {
    if (state !== STATES.EXAM) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); doSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [state]);

  const handleJoin = async (exam) => {
    setLoading(true); setError("");
    try {
      const { data } = await startExam(exam._id);
      setActiveExam(data);
      setActiveExamId(exam._id);
      setCurrentIdx(0);
      setSelected(null);
      answersRef.current = [];
      setTimeLeft(data.duration * 60);
      questionStartRef.current = Date.now();
      setState(STATES.EXAM);
    } catch (err) {
      setError(err.response?.data?.error || "Could not start exam.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selected || !activeExam) return;
    const q = activeExam.questions[currentIdx];
    const timeTaken = Math.floor((Date.now() - questionStartRef.current) / 1000);
    answersRef.current.push({
      questionId: q._id,
      isCorrect:  selected === "correct",
      difficulty: q.difficultyScore ?? 0.5,
      selectedType: selected,
      timeTaken,
    });
    const next = currentIdx + 1;
    if (next < activeExam.questions.length) {
      setCurrentIdx(next);
      setSelected(null);
      questionStartRef.current = Date.now();
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    clearInterval(timerRef.current);
    setLoading(true);
    try {
      const { data } = await submitExam(answersRef.current);
      setResult(data);
      setState(STATES.RESULT);
    } catch (err) {
      setError(err.response?.data?.error || "Submission failed.");
      setState(STATES.LIST);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBoard = async () => {
    try {
      const { data } = await getLeaderboard(activeExamId);
      setLeaderboard(data);
      setState(STATES.BOARD);
    } catch {
      setError("Could not load leaderboard.");
    }
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── LIST ─────────────────────────────────────────────────
  if (state === STATES.LIST) return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Competition</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">
          Opt-in weekly exams. Scores are difficulty-weighted and Z-score ranked.
        </p>
      </div>

      {error && (
        <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {exams.length === 0 && !error && (
          <div className="card p-8 text-center">
            <p className="text-[13px] text-apple-gray">No active exams right now.</p>
          </div>
        )}
        {exams.map((exam) => (
          <div key={exam._id} className="card p-5 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-[var(--label)]">{exam.title}</p>
              <p className="text-[13px] text-apple-gray mt-0.5">
                {exam.topic} · {exam.totalQuestions} questions · {exam.duration} min
              </p>
              <p className="text-[12px] text-apple-gray3 mt-1">
                {exam.questionDistribution.easy} easy · {exam.questionDistribution.medium} medium · {exam.questionDistribution.hard} hard
              </p>
            </div>
            <button
              onClick={() => handleJoin(exam)}
              disabled={loading}
              className="btn-primary shrink-0 ml-4"
            >
              {loading ? "…" : "Join →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── EXAM ─────────────────────────────────────────────────
  if (state === STATES.EXAM) {
    const q        = activeExam?.questions[currentIdx];
    const progress = (currentIdx / activeExam.questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-[var(--label)]">{activeExam.title}</p>
            <p className="text-[13px] text-apple-gray">
              Question {currentIdx + 1} of {activeExam.questions.length}
            </p>
          </div>
          <div className={`text-[18px] font-mono font-semibold ${timeLeft < 60 ? "text-apple-red animate-pulse" : "text-[var(--label)]"}`}>
            {fmt(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-apple-gray5 rounded-full overflow-hidden">
          <div
            className="h-full bg-apple-blue rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`badge ${
              q.difficultyScore < 0.4 ? "bg-apple-green/10 text-apple-green" :
              q.difficultyScore < 0.7 ? "bg-apple-orange/10 text-apple-orange" :
              "bg-apple-red/10 text-apple-red"
            }`}>
              {q.difficultyScore < 0.4 ? "Easy" : q.difficultyScore < 0.7 ? "Medium" : "Hard"}
            </span>
          </div>
          <h2 className="text-[17px] font-semibold text-[var(--label)] leading-snug mb-5">
            {q.questionText}
          </h2>
          <div className="flex flex-col gap-2">
            {q.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(opt.type)}
                className={`w-full text-left px-4 py-3.5 rounded-apple-lg border text-[14px] font-medium transition-all duration-150 ${
                  selected === opt.type
                    ? "border-apple-blue bg-apple-blue/8 text-apple-blue"
                    : "border-apple-gray5 bg-apple-gray6 hover:border-apple-blue/30 text-[var(--label)]"
                }`}
              >
                <span className="mr-3 text-apple-gray text-[13px]">{String.fromCharCode(65 + i)}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="btn-primary w-full py-3 text-[15px]"
        >
          {currentIdx + 1 < activeExam.questions.length ? "Confirm & Next →" : "Submit Exam →"}
        </button>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────
  if (state === STATES.RESULT && result) {
    const pct = result.percentile ?? 0;
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="card p-8 text-center">
          <p className="text-[44px] font-black text-apple-blue mb-1">#{result.rank}</p>
          <p className="text-[13px] text-apple-gray mb-6">out of {result.totalParticipants} participants</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-apple-gray6 rounded-apple-lg p-3">
              <p className="text-[11px] text-apple-gray mb-1">Percentile</p>
              <p className="text-[20px] font-bold text-[var(--label)]">{pct}%</p>
            </div>
            <div className="bg-apple-gray6 rounded-apple-lg p-3">
              <p className="text-[11px] text-apple-gray mb-1">Raw score</p>
              <p className="text-[20px] font-bold text-[var(--label)]">{result.rawScore?.toFixed(2)}</p>
            </div>
            <div className="bg-apple-gray6 rounded-apple-lg p-3">
              <p className="text-[11px] text-apple-gray mb-1">Normalised</p>
              <p className="text-[20px] font-bold text-[var(--label)]">{result.normalizedScore?.toFixed(2)}</p>
            </div>
          </div>

          <p className="text-[14px] text-apple-gray mb-6">
            {pct >= 90 ? "🔥 Outstanding — top 10%!" :
             pct >= 70 ? "💪 Strong performance!" :
             pct >= 50 ? "📈 Above average!" : "📚 Keep practising!"}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/exam-review", {
                state: {
                  review:     result.review,
                  score:      result.rawScore,
                  rank:       result.rank,
                  percentile: result.percentile,
                  total:      result.totalParticipants,
                },
              })}
              className="btn-primary w-full"
            >
              View Full Solutions →
            </button>
            <div className="flex gap-3">
              <button onClick={handleViewBoard}        className="btn-secondary flex-1">Leaderboard</button>
              <button onClick={() => setState(STATES.LIST)} className="btn-secondary flex-1">Back to Exams</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD ───────────────────────────────────────────
  if (state === STATES.BOARD) return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[var(--label)] tracking-tight">Leaderboard</h1>
        <button onClick={() => setState(STATES.LIST)} className="btn-secondary text-[13px]">← Back</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-apple-gray5">
              <th className="text-left px-4 py-3 text-[11px] text-apple-gray font-semibold uppercase tracking-wider">Rank</th>
              <th className="text-left px-4 py-3 text-[11px] text-apple-gray font-semibold uppercase tracking-wider">User</th>
              <th className="text-right px-4 py-3 text-[11px] text-apple-gray font-semibold uppercase tracking-wider">Score</th>
              <th className="text-right px-4 py-3 text-[11px] text-apple-gray font-semibold uppercase tracking-wider">Percentile</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <tr
                key={row._id}
                className={`border-b border-apple-gray5 last:border-0 ${i < 3 ? "bg-apple-blue/4" : ""}`}
              >
                <td className="px-4 py-3 font-semibold text-[var(--label)]">
                  {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}
                </td>
                <td className="px-4 py-3 text-apple-gray font-mono text-[12px]">{String(row.userId).slice(-6)}</td>
                <td className="px-4 py-3 text-right text-[var(--label)]">{row.rawScore?.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-apple-blue font-medium">{row.percentile}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return null;
}
