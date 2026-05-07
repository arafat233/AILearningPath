import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateMock, submitExam } from "../services/api";
import { useAuthStore } from "../store/authStore";

const SUBJECTS = ["Math", "Science", "English", "Social Science", "Hindi"];
const Q_COUNTS  = [10, 20, 30];
const DURATIONS = [30, 45, 60];

function fmt(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Config screen ────────────────────────────────────────────────
function ConfigScreen({ onStart, loading }) {
  const { user, activeChild } = useAuthStore();
  const child = activeChild || user;
  const [questionCount, setQuestionCount] = useState(20);
  const [duration,      setDuration]      = useState(45);
  const [subject,       setSubject]       = useState(child?.subjects?.[0] || child?.subject || "Math");

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">AI Mock Paper</h1>
        <p className="text-[14px] text-apple-gray mt-1">
          Questions are selected from your weak areas to maximise your improvement.
        </p>
      </div>

      <div className="card p-6 space-y-5">
        {/* Subject */}
        <div>
          <label className="block text-[13px] font-semibold text-[var(--label2)] mb-2">Subject</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button key={s} onClick={() => setSubject(s)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                  subject === s
                    ? "bg-apple-blue text-white border-apple-blue"
                    : "border-apple-gray4 text-[var(--label2)] hover:border-apple-blue"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div>
          <label className="block text-[13px] font-semibold text-[var(--label2)] mb-2">Number of questions</label>
          <div className="flex gap-2">
            {Q_COUNTS.map((n) => (
              <button key={n} onClick={() => setQuestionCount(n)}
                className={`flex-1 py-2 rounded-apple text-[14px] font-semibold border transition-colors ${
                  questionCount === n
                    ? "bg-apple-blue text-white border-apple-blue"
                    : "border-apple-gray4 text-[var(--label2)] hover:border-apple-blue"
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-[13px] font-semibold text-[var(--label2)] mb-2">Time limit</label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button key={d} onClick={() => setDuration(d)}
                className={`flex-1 py-2 rounded-apple text-[14px] font-semibold border transition-colors ${
                  duration === d
                    ? "bg-apple-blue text-white border-apple-blue"
                    : "border-apple-gray4 text-[var(--label2)] hover:border-apple-blue"
                }`}>
                {d} min
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={() => onStart({ questionCount, duration, subject })}
        className="btn-primary w-full py-3 text-[15px] flex items-center justify-center gap-2"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
        ) : (
          "Generate Mock Paper →"
        )}
      </button>
    </div>
  );
}

// ── Exam screen ──────────────────────────────────────────────────
function ExamScreen({ session, onSubmit, submitting }) {
  const [answers,  setAnswers]  = useState({});
  const [current,  setCurrent]  = useState(0);
  const [timeLeft, setTimeLeft] = useState(session.durationSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); onSubmit(answers); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const q   = session.questions[current];
  const sel = answers[q._id];
  const answered = Object.keys(answers).length;
  const urgent = timeLeft < 60;

  const pick = (idx) => setAnswers((prev) => ({ ...prev, [q._id]: idx }));

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    onSubmit(answers);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--label)] truncate max-w-xs">{session.title}</h1>
          <p className="text-[12px] text-apple-gray">{answered}/{session.questions.length} answered</p>
        </div>
        <div className={`text-[20px] font-mono font-bold tabular-nums ${urgent ? "text-apple-red animate-pulse" : "text-[var(--label)]"}`}>
          {fmt(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-apple-gray5 rounded-full overflow-hidden">
        <div className="h-full bg-apple-blue transition-all"
             style={{ width: `${((current + 1) / session.questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-apple-blue/10 text-apple-blue text-[12px] font-bold flex items-center justify-center">
            {current + 1}
          </span>
          <p className="text-[15px] text-[var(--label)] leading-relaxed flex-1">{q.questionText}</p>
        </div>

        <div className="space-y-2 pl-10">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)}
              className={`w-full text-left px-4 py-3 rounded-apple text-[14px] border transition-colors ${
                sel === i
                  ? "bg-apple-blue/10 border-apple-blue text-apple-blue font-medium"
                  : "border-apple-gray5 text-[var(--label2)] hover:border-apple-blue/40 hover:bg-apple-blue/5"
              }`}>
              <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}
          className="btn-secondary px-4 py-2 disabled:opacity-40">← Prev</button>

        {current < session.questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary px-6 py-2">Next →</button>
        ) : (
          <button disabled={submitting} onClick={handleSubmit}
            className="btn-primary px-6 py-2 bg-emerald-600 border-emerald-700 flex items-center gap-2">
            {submitting
              ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              : "Submit Paper"}
          </button>
        )}
      </div>

      {/* Question grid */}
      <div className="card p-4">
        <p className="text-[11px] font-semibold text-[var(--label2)] uppercase tracking-wider mb-3">Jump to question</p>
        <div className="flex flex-wrap gap-1.5">
          {session.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded text-[11px] font-semibold transition-colors ${
                i === current
                  ? "bg-apple-blue text-white"
                  : answers[session.questions[i]._id] !== undefined
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-apple-gray5 text-[var(--label2)] hover:bg-apple-gray4"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Results screen ───────────────────────────────────────────────
function ResultsScreen({ result, session, onRetry }) {
  const navigate = useNavigate();
  const correct  = result.review.filter((r) => r.isCorrect).length;
  const total    = result.review.length;
  const pct      = total > 0 ? Math.round((correct / total) * 100) : 0;
  const grade    = pct >= 91 ? "A1" : pct >= 81 ? "A2" : pct >= 71 ? "B1" : pct >= 61 ? "B2" : pct >= 51 ? "C1" : "C2";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-apple-blue/10 flex items-center justify-center mx-auto">
          <span className="text-[32px] font-bold text-apple-blue">{grade}</span>
        </div>
        <h2 className="text-[24px] font-bold text-[var(--label)]">{pct}% — {correct}/{total} correct</h2>
        <p className="text-[14px] text-apple-gray">{session.title}</p>
        {session.weakAreas?.length > 0 && (
          <p className="text-[13px] text-apple-gray">Focused on: {session.weakAreas.slice(0, 3).join(", ")}</p>
        )}

        <div className="flex gap-3 justify-center pt-2">
          <button onClick={onRetry} className="btn-secondary px-5 py-2">Try Another</button>
          <button onClick={() => navigate("/analytics")} className="btn-primary px-5 py-2">View Analytics</button>
        </div>
      </div>

      {/* Review */}
      <div className="space-y-3">
        <h3 className="text-[16px] font-bold text-[var(--label)]">Question Review</h3>
        {result.review.map((r, i) => (
          <div key={i} className={`card p-4 border-l-4 ${r.isCorrect ? "border-emerald-500" : "border-apple-red"}`}>
            <p className="text-[13px] font-medium text-[var(--label)] mb-2">{i + 1}. {r.questionText}</p>
            <p className={`text-[12px] ${r.isCorrect ? "text-emerald-600" : "text-apple-red"}`}>
              {r.isCorrect ? "✓ Correct" : `✗ You chose: ${r.selectedText || "Not answered"}`}
            </p>
            {!r.isCorrect && (
              <p className="text-[12px] text-emerald-700 mt-0.5">Correct: {r.correctText}</p>
            )}
            {r.solutionSteps?.length > 0 && (
              <ul className="mt-2 space-y-0.5 pl-3 border-l-2 border-apple-gray4">
                {r.solutionSteps.map((s, j) => (
                  <li key={j} className="text-[12px] text-[var(--label2)]">{s}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page root ────────────────────────────────────────────────────
export default function MockPaper() {
  const [phase,     setPhase]     = useState("config");   // config | exam | results
  const [session,   setSession]   = useState(null);
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [submitting,setSubmitting]= useState(false);
  const [error,     setError]     = useState("");

  const handleStart = async (opts) => {
    setLoading(true);
    setError("");
    try {
      const res = await generateMock(opts);
      setSession(res.data);
      setPhase("exam");
    } catch (e) {
      setError(e.response?.data?.error || "Could not generate a mock paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async (answers) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = session.questions.map((q) => ({
        questionId:          q._id,
        selectedOptionIndex: answers[q._id] ?? null,
        timeTaken:           0,
      }));
      const res = await submitExam({ answers: payload });
      setResult(res.data);
      setPhase("results");
    } catch (e) {
      setError(e.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [session, submitting]);

  const handleRetry = () => { setPhase("config"); setSession(null); setResult(null); setError(""); };

  return (
    <div className="max-w-2xl mx-auto py-2">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-apple bg-apple-red/10 border border-apple-red/20 text-apple-red text-[13px]">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-bold">✕</button>
        </div>
      )}

      {phase === "config"  && <ConfigScreen  onStart={handleStart}  loading={loading}    />}
      {phase === "exam"    && <ExamScreen    session={session}       onSubmit={handleSubmit} submitting={submitting} />}
      {phase === "results" && <ResultsScreen result={result}         session={session}    onRetry={handleRetry} />}
    </div>
  );
}
