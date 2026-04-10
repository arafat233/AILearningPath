import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listExams, startExam, submitExam, getLeaderboard } from "../services/api";

const STATES = { LIST: "list", EXAM: "exam", RESULT: "result", BOARD: "board" };

export default function Competition() {
  const navigate                    = useNavigate();
  const [state, setState]           = useState(STATES.LIST);
  const [exams, setExams]           = useState([]);
  const [activeExam, setActiveExam] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected]     = useState(null);
  const [result, setResult]         = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeExamId, setActiveExamId] = useState(null);
  const [timeLeft, setTimeLeft]     = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  // FIX: use a ref to accumulate answers — avoids stale closure bug
  const answersRef      = useRef([]);
  const timerRef        = useRef(null);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    listExams().then((r) => setExams(r.data)).catch(() => setError("Could not load exams."));
  }, []);

  // Countdown
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
    setLoading(true);
    setError("");
    try {
      const { data } = await startExam(exam._id);
      setActiveExam(data);
      setActiveExamId(exam._id);
      setCurrentIdx(0);
      setSelected(null);
      answersRef.current = [];           // reset accumulated answers
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

    // FIX: push directly into ref — no stale state
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Competition</h1>
      <p className="text-sm text-gray-500 mb-6">
        Opt-in weekly exams. Scores are difficulty-weighted and Z-score ranked.
      </p>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      <div className="flex flex-col gap-4">
        {exams.length === 0 && !error && (
          <div className="card p-6 text-center text-sm text-gray-400">No active exams right now.</div>
        )}
        {exams.map((exam) => (
          <div key={exam._id} className="card p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{exam.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {exam.topic} · {exam.totalQuestions} questions · {exam.duration} min
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {exam.questionDistribution.easy} easy · {exam.questionDistribution.medium} medium · {exam.questionDistribution.hard} hard
              </p>
            </div>
            <button onClick={() => handleJoin(exam)} disabled={loading} className="btn-primary shrink-0 ml-4">
              {loading ? "…" : "Join →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── EXAM ─────────────────────────────────────────────────
  if (state === STATES.EXAM) {
    const q = activeExam?.questions[currentIdx];
    const progress = (currentIdx / activeExam.questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium text-gray-900">{activeExam.title}</p>
            <p className="text-sm text-gray-400">Question {currentIdx + 1} of {activeExam.questions.length}</p>
          </div>
          <div className={`text-lg font-mono font-semibold ${timeLeft < 60 ? "text-red-500" : "text-gray-700"}`}>
            {fmt(timeLeft)}
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
          <div className="h-1.5 bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="card p-6 mb-4">
          <p className="text-xs text-gray-400 mb-3">
            Difficulty: {q.difficultyScore < 0.4 ? "Easy" : q.difficultyScore < 0.7 ? "Medium" : "Hard"}
          </p>
          <h2 className="text-lg font-medium text-gray-900 mb-5">{q.questionText}</h2>
          <div className="flex flex-col gap-2">
            {q.options?.map((opt, i) => (
              <button key={i} onClick={() => setSelected(opt.type)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selected === opt.type
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-surface-border hover:border-brand-300 text-gray-800"
                }`}>
                <span className="mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleConfirm} disabled={!selected || loading} className="btn-primary w-full">
          {currentIdx + 1 < activeExam.questions.length ? "Confirm & Next →" : "Submit Exam →"}
        </button>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────
  if (state === STATES.RESULT && result) {
    const pct = result.percentile ?? 0;
    return (
      <div className="max-w-xl mx-auto">
        <div className="card p-8 text-center mb-5">
          <p className="text-4xl font-bold text-brand-500 mb-1">#{result.rank}</p>
          <p className="text-gray-500 text-sm mb-6">out of {result.totalParticipants} participants</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div><p className="text-xs text-gray-400">Percentile</p><p className="text-xl font-semibold">{pct}%</p></div>
            <div><p className="text-xs text-gray-400">Raw score</p><p className="text-xl font-semibold">{result.rawScore?.toFixed(2)}</p></div>
            <div><p className="text-xs text-gray-400">Normalised</p><p className="text-xl font-semibold">{result.normalizedScore?.toFixed(2)}</p></div>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {pct >= 90 ? "🔥 Outstanding — top 10%!" : pct >= 70 ? "💪 Strong performance!" : pct >= 50 ? "📈 Above average!" : "📚 Keep practising!"}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/exam-review", { state: { review: result.review, score: result.rawScore, rank: result.rank, percentile: result.percentile, total: result.totalParticipants } })}
              className="btn-primary w-full"
            >
              View Full Solutions →
            </button>
            <div className="flex gap-3">
              <button onClick={handleViewBoard} className="btn-secondary flex-1">Leaderboard</button>
              <button onClick={() => setState(STATES.LIST)} className="btn-secondary flex-1">Back to Exams</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD ───────────────────────────────────────────
  if (state === STATES.BOARD) return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold">Leaderboard</h1>
        <button onClick={() => setState(STATES.LIST)} className="btn-secondary text-sm">← Back</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Rank</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">User</th>
              <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Score</th>
              <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Percentile</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <tr key={row._id} className={`border-b border-surface-border last:border-0 ${i < 3 ? "bg-brand-50" : ""}`}>
                <td className="px-4 py-3 font-semibold text-gray-700">
                  {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}
                </td>
                <td className="px-4 py-3 text-gray-700 font-mono text-xs">{String(row.userId).slice(-6)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{row.rawScore?.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-brand-600 font-medium">{row.percentile}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return null;
}
