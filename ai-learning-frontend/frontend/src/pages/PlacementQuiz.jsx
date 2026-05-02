import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPlacementQuiz, getPlacementStatus, scorePlacementQuiz } from "../services/api";
import { useAuthStore } from "../store/authStore";

const CHAPTER_NAMES = {
  1: "Real Numbers", 2: "Polynomials", 3: "Pair of Linear Equations",
  4: "Quadratic Equations", 5: "Arithmetic Progressions", 6: "Triangles",
  7: "Coordinate Geometry", 8: "Introduction to Trigonometry", 9: "Applications of Trigonometry",
  10: "Circles", 11: "Areas Related to Circles", 12: "Surface Areas and Volumes",
  13: "Statistics", 14: "Probability",
};

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── Intro Screen ─────────────────────────────────────────────────────────────
function IntroScreen({ total, duration, onStart }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-apple-blue/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h1 className="text-[22px] font-bold text-[var(--label)] mb-2">Placement Quiz</h1>
        <p className="text-[14px] text-apple-gray mb-6 leading-relaxed">
          A quick diagnostic test that personalises your study path. We'll figure out what you already know
          so you don't waste time on topics you've mastered.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-7">
          {[
            { label: "Questions", value: total },
            { label: "Duration", value: `${duration} min` },
            { label: "One-time", value: "Only once" },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--fill)] rounded-apple-lg p-3">
              <p className="text-[17px] font-bold text-[var(--label)]">{s.value}</p>
              <p className="text-[11px] text-apple-gray mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <ul className="text-left space-y-2 mb-7">
          {[
            "Covers all 14 CBSE Class 10 Math chapters",
            "Takes about 15–20 minutes to complete",
            "Your practice starts at the right difficulty automatically",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-[13px] text-apple-gray">
              <svg className="w-4 h-4 text-apple-green mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {tip}
            </li>
          ))}
        </ul>

        <button onClick={onStart} className="btn-primary w-full py-3 text-[15px]">
          Start Placement Quiz
        </button>
        <p className="text-[12px] text-apple-gray3 mt-3">This can only be taken once. Your results will be saved.</p>
      </div>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ summary, onContinue }) {
  const pct = summary.totalQuestions > 0 ? Math.round((summary.totalCorrect / summary.totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-lg p-8">
        {/* Score ring */}
        <div className="text-center mb-7">
          <div className="w-24 h-24 rounded-full border-4 border-apple-blue flex items-center justify-center mx-auto mb-4">
            <span className="text-[28px] font-bold text-apple-blue">{pct}%</span>
          </div>
          <h2 className="text-[20px] font-bold text-[var(--label)]">Quiz Complete!</h2>
          <p className="text-[14px] text-apple-gray mt-1">
            {summary.totalCorrect} of {summary.totalQuestions} correct
          </p>
        </div>

        {/* Chapter breakdown */}
        <div className="space-y-3 mb-6">
          {summary.chaptersAced.length > 0 && (
            <div className="rounded-apple-lg bg-apple-green/10 p-3.5">
              <p className="text-[12px] font-semibold text-apple-green mb-1.5">Chapters mastered ({summary.chaptersAced.length})</p>
              <p className="text-[13px] text-apple-green/80">
                {summary.chaptersAced.map((ch) => CHAPTER_NAMES[ch] || `Ch ${ch}`).join(" · ")}
              </p>
            </div>
          )}
          {summary.chaptersStarted.length > 0 && (
            <div className="rounded-apple-lg bg-apple-orange/10 p-3.5">
              <p className="text-[12px] font-semibold text-apple-orange mb-1.5">Chapters to practise ({summary.chaptersStarted.length})</p>
              <p className="text-[13px] text-apple-orange/80">
                {summary.chaptersStarted.map((ch) => CHAPTER_NAMES[ch] || `Ch ${ch}`).join(" · ")}
              </p>
            </div>
          )}
          {summary.chaptersNovice.length > 0 && (
            <div className="rounded-apple-lg bg-apple-red/10 p-3.5">
              <p className="text-[12px] font-semibold text-apple-red mb-1.5">Chapters to start from basics ({summary.chaptersNovice.length})</p>
              <p className="text-[13px] text-apple-red/80">
                {summary.chaptersNovice.map((ch) => CHAPTER_NAMES[ch] || `Ch ${ch}`).join(" · ")}
              </p>
            </div>
          )}
        </div>

        {summary.recommendedFirstTopic && (
          <div className="rounded-apple-lg bg-apple-blue/10 p-4 mb-6">
            <p className="text-[12px] font-semibold text-apple-blue mb-0.5">Your personalised start point</p>
            <p className="text-[14px] font-medium text-apple-blue">{summary.recommendedFirstTopic}</p>
          </div>
        )}

        <button onClick={onContinue} className="btn-primary w-full py-3 text-[15px]">
          Go to Practice
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlacementQuiz() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  const [phase, setPhase]         = useState("loading"); // loading | already_taken | intro | quiz | submitting | results
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration]   = useState(25);
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [timeLeft, setTimeLeft]   = useState(0);
  const [qStart, setQStart]       = useState(Date.now());
  const [summary, setSummary]     = useState(null);
  const [submitErr, setSubmitErr] = useState("");

  const timerRef = useRef(null);

  // Check if already taken
  useEffect(() => {
    if (user?.placementCompletedAt) { setPhase("already_taken"); return; }
    getPlacementStatus()
      .then(({ data }) => {
        if (data.taken) { setPhase("already_taken"); return; }
        return getPlacementQuiz();
      })
      .then((res) => {
        if (!res) return;
        setQuestions(res.data.questions);
        setDuration(res.data.duration ?? 25);
        setPhase("intro");
      })
      .catch(() => setPhase("intro")); // fallback: try anyway
  }, []); // eslint-disable-line

  const startQuiz = useCallback(() => {
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setTextAnswer("");
    setTimeLeft((duration ?? 25) * 60);
    setQStart(Date.now());
    setPhase("quiz");
  }, [duration]);

  // Global countdown timer
  useEffect(() => {
    if (phase !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line

  const recordAnswer = useCallback(() => {
    const q = questions[current];
    const timeTaken = Math.round((Date.now() - qStart) / 1000);
    const ans = { questionId: q._id, timeTaken };

    if (q.questionType === "mcq" || q.questionType === "assertion_reason") {
      ans.selectedOptionIndex = selected ?? null;
    } else {
      ans.answer = textAnswer.trim();
    }

    return ans;
  }, [questions, current, selected, textAnswer, qStart]);

  const goNext = useCallback(() => {
    const ans = recordAnswer();
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    setSelected(null);
    setTextAnswer("");
    setQStart(Date.now());

    if (current + 1 >= questions.length) {
      handleSubmit(false, newAnswers);
    } else {
      setCurrent((c) => c + 1);
    }
  }, [recordAnswer, answers, current, questions.length]); // eslint-disable-line

  const handleSubmit = useCallback(async (timedOut = false, finalAnswers = null) => {
    clearInterval(timerRef.current);
    const payload = finalAnswers ?? answers;

    // If timed out mid-question, record a blank for the current question
    if (timedOut && current < questions.length) {
      const q = questions[current];
      payload.push({ questionId: q._id, timeTaken: 0, selectedOptionIndex: null });
    }

    setPhase("submitting");
    try {
      const { data } = await scorePlacementQuiz(payload);
      setSummary(data.summary);
      // Mark placement as done in auth store so gate doesn't re-trigger
      setAuth(null, { ...user, placementCompletedAt: new Date().toISOString() });
      setPhase("results");
    } catch (err) {
      const msg = err.response?.data?.error || "Submission failed. Please try again.";
      setSubmitErr(msg);
      setPhase("quiz");
    }
  }, [answers, current, questions, user, setAuth]); // eslint-disable-line

  const skipQuestion = useCallback(() => {
    const q = questions[current];
    const newAnswers = [...answers, { questionId: q._id, timeTaken: 0, selectedOptionIndex: null }];
    setAnswers(newAnswers);
    setSelected(null);
    setTextAnswer("");
    setQStart(Date.now());

    if (current + 1 >= questions.length) {
      handleSubmit(false, newAnswers);
    } else {
      setCurrent((c) => c + 1);
    }
  }, [answers, current, questions, handleSubmit]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (phase === "already_taken") {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-apple-green/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-apple-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-[17px] font-bold text-[var(--label)] mb-2">Already Completed</h2>
          <p className="text-[13px] text-apple-gray mb-5">You've already taken the placement quiz. Your practice path is personalised.</p>
          <button onClick={() => navigate("/practice")} className="btn-primary w-full">Go to Practice</button>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return <IntroScreen total={questions.length || 20} duration={duration} onStart={startQuiz} />;
  }

  if (phase === "submitting") {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-apple-gray">Calculating your results…</p>
        </div>
      </div>
    );
  }

  if (phase === "results" && summary) {
    return <ResultsScreen summary={summary} onContinue={() => navigate("/practice")} />;
  }

  // ── Quiz Phase ────────────────────────────────────────────────────────────
  const q         = questions[current];
  const isMcq     = q?.questionType === "mcq" || q?.questionType === "assertion_reason";
  const progress  = ((current) / questions.length) * 100;
  const isWarning = timeLeft <= 120; // last 2 min

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--separator)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-apple-gray">
              {current + 1} / {questions.length}
            </span>
            {q?.chapterNumber && (
              <span className="text-[11px] bg-apple-blue/10 text-apple-blue px-2 py-0.5 rounded-full">
                Ch {q.chapterNumber}
              </span>
            )}
          </div>
          <div className={`text-[15px] font-mono font-semibold tabular-nums ${isWarning ? "text-apple-red" : "text-[var(--label)]"}`}>
            {fmtTime(timeLeft)}
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="h-1 bg-[var(--fill)] rounded-full overflow-hidden">
            <div
              className="h-full bg-apple-blue rounded-full transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {submitErr && (
            <div className="mb-4 rounded-apple-lg bg-apple-red/10 border border-apple-red/20 px-4 py-3 text-[13px] text-apple-red">
              {submitErr}
            </div>
          )}

          <div className="card p-6 mb-4">
            {q?.marks && (
              <span className="text-[11px] bg-[var(--fill)] text-apple-gray px-2 py-0.5 rounded-full mb-3 inline-block">
                {q.marks} mark{q.marks !== 1 ? "s" : ""}
              </span>
            )}
            <p className="text-[16px] font-medium text-[var(--label)] leading-relaxed">
              {q?.questionText}
            </p>
          </div>

          {isMcq ? (
            <div className="space-y-2.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left rounded-apple-lg border px-4 py-3.5 text-[14px] transition-all duration-150 ${
                    selected === i
                      ? "border-apple-blue bg-apple-blue/10 text-apple-blue font-medium"
                      : "border-[var(--separator)] bg-[var(--card)] text-[var(--label)] hover:border-apple-blue/40"
                  }`}
                >
                  <span className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-[11px] font-bold mr-2.5 ${
                    selected === i ? "bg-apple-blue text-white" : "bg-[var(--fill)] text-apple-gray"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="card p-4">
              <label className="text-[12px] font-medium text-apple-gray mb-2 block">Your answer</label>
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goNext()}
                placeholder="Type your answer…"
                className="w-full bg-[var(--fill)] rounded-apple px-3 py-2.5 text-[14px] text-[var(--label)] outline-none focus:ring-2 focus:ring-apple-blue/40"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 bg-[var(--bg)] border-t border-[var(--separator)] px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={skipQuestion}
            className="flex-1 py-3 rounded-apple-lg border border-[var(--separator)] text-[14px] font-medium text-apple-gray hover:bg-[var(--fill)] transition-colors"
          >
            Skip
          </button>
          <button
            onClick={goNext}
            disabled={isMcq && selected === null}
            className="flex-[2] py-3 btn-primary text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {current + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
