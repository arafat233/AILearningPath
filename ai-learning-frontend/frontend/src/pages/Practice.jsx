import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startTopic, submitAnswer, evaluateExplanation, flagQuestion, getTopics, getHint } from "../services/api";
import { useAuthStore } from "../store/authStore";

const BEHAVIOR = {
  guessing:          { text: "Guessing detected",    bg: "bg-apple-orange/10", text_c: "text-apple-orange" },
  concept_error:     { text: "Concept misunderstood",bg: "bg-apple-red/10",    text_c: "text-apple-red"    },
  calculation_error: { text: "Calculation mistake",  bg: "bg-apple-yellow/10", text_c: "text-apple-yellow" },
  partial_logic:     { text: "Missed a step",        bg: "bg-apple-purple/10", text_c: "text-apple-purple" },
  misinterpretation: { text: "Misread question",     bg: "bg-apple-blue/10",   text_c: "text-apple-blue"   },
  correct:           { text: "Correct",              bg: "bg-apple-green/10",  text_c: "text-apple-green"  },
};

const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };
const DIFF_COLOR = {
  easy:   "bg-apple-green/10 text-apple-green",
  medium: "bg-apple-orange/10 text-apple-orange",
  hard:   "bg-apple-red/10 text-apple-red",
};

function diffLevel(score) {
  return score < 0.4 ? "easy" : score < 0.7 ? "medium" : "hard";
}

export default function Practice() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const user       = useAuthStore((s) => s.user);
  const mixTopics  = location.state?.mixTopics || null; // from Planner "Start today"
  const [topics, setTopics]           = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(location.state?.topic || "");
  const [question, setQuestion]     = useState(null);
  const [feedback, setFeedback]     = useState(null);
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading]       = useState(false);
  const [answering, setAnswering]   = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [foundationMsg, setFoundationMsg] = useState(null);
  const [showSteps, setShowSteps]   = useState(false);
  const [recallMode, setRecallMode] = useState(true);
  const [recallAttempt, setRecallAttempt] = useState("");
  const [evalFeedback, setEvalFeedback] = useState(null);
  const [evalLoading, setEvalLoading]   = useState(false);
  const [flagged, setFlagged]           = useState(false);
  const [hint, setHint]                 = useState(null);
  const [hintLoading, setHintLoading]   = useState(false);
  const startTimeRef = useRef(null);
  const [elapsed, setElapsed]       = useState(0);
  const [timeLimit, setTimeLimit]   = useState(null);
  const [timeWarning, setTimeWarning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (question && !feedback) {
      startTimeRef.current = Date.now();
      setElapsed(0);
      setTimeWarning(false);
      const limit = question.expectedTime ? question.expectedTime * 2 : null;
      setTimeLimit(limit);
      timerRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(secs);
        if (limit) {
          if (secs >= limit - 5) setTimeWarning(true);
          if (secs >= limit) {
            clearInterval(timerRef.current);
            handleAnswer("guessing");
          }
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [question, feedback]);

  const handleStart = async () => {
    // For mixed practice: pick a random topic from the day's topics
    const topic = mixTopics?.length
      ? mixTopics[Math.floor(Math.random() * mixTopics.length)]
      : selectedTopic;
    if (!topic) return;
    setLoading(true);
    setFeedback(null);
    setFoundationMsg(null);
    setFlagged(false);
    try {
      const { data } = await startTopic(topic);
      if (data.foundationRedirect) {
        setFoundationMsg(data.message);
        setQuestion(data.question);
      } else {
        setQuestion(data);
      }
      if (mixTopics) setSelectedTopic(topic);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start topic");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (optionType) => {
    if (answering || !question) return;
    clearInterval(timerRef.current);
    const timeTaken = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    setAnswering(true);
    try {
      const { data } = await submitAnswer({
        selectedType: optionType,
        timeTaken,
        confidence: confidence || "medium",
      });
      setFeedback(data);
      setSessionStats((s) => ({
        correct: s.correct + (data.isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
    } catch (err) {
      alert(err.response?.data?.error || "Submit failed");
    } finally {
      setAnswering(false);
    }
  };

  const handleEvaluate = async () => {
    if (!recallAttempt.trim() || evalLoading) return;
    setEvalLoading(true);
    try {
      const concept = question?.conceptTested || selectedTopic;
      const { data } = await evaluateExplanation(concept, recallAttempt);
      setEvalFeedback(data.feedback);
    } catch {
      setEvalFeedback("Could not evaluate — try showing the solution directly.");
    } finally {
      setEvalLoading(false);
    }
  };

  const handleHint = async () => {
    if (hintLoading || hint || !question) return;
    setHintLoading(true);
    try {
      const { data } = await getHint(question.questionText, selectedTopic);
      setHint(data.hint);
    } catch {
      setHint("Think step by step — which formula or concept applies here?");
    } finally {
      setHintLoading(false);
    }
  };

  const handleFlag = async () => {
    if (!question?._id || flagged) return;
    try {
      await flagQuestion(question._id);
      setFlagged(true);
    } catch {}
  };

  const handleNext = () => {
    setRecallMode(true);
    setRecallAttempt("");
    setEvalFeedback(null);
    setShowSteps(false);
    setFlagged(false);
    setHint(null);
    setHintLoading(false);
    if (feedback?.nextQuestion) {
      setQuestion(feedback.nextQuestion);
      setFeedback(null);
      setConfidence("");
    } else {
      handleStart();
    }
  };

  // Load topics from DB (filtered by user's grade + subject if available)
  useEffect(() => {
    const params = {};
    if (user?.grade)   params.grade   = user.grade;
    if (user?.subject) params.subject = user.subject;
    getTopics(params)
      .then((r) => setTopics(r.data.map((t) => t.name)))
      .catch(() => {});
  }, [user?.grade, user?.subject]);

  // ── Auto-start mixed practice if coming from Planner ───────────
  useEffect(() => {
    if (mixTopics?.length && !question) handleStart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Topic selector ──────────────────────────────────────────────
  if (!question) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Practice</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">
            {mixTopics ? `Mixed session: ${mixTopics.join(", ")}` : "Choose a topic to begin"}
          </p>
        </div>

        <div className="card p-6">
          <p className="section-label">Select Topic</p>
          {topics.length === 0 ? (
            <p className="text-[13px] text-apple-gray">Loading topics…</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`p-3.5 rounded-apple-lg text-[13px] font-medium text-left transition-all duration-150
                    ${selectedTopic === t
                      ? "bg-apple-blue text-white shadow-apple"
                      : "bg-apple-gray6 text-[var(--label)] hover:bg-apple-gray5"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedTopic || loading}
          className="btn-primary w-full py-3 text-[15px]"
        >
          {loading ? "Loading…" : "Start Practice →"}
        </button>
      </div>
    );
  }

  const diff = diffLevel(question.difficultyScore);
  const behaviorInfo = feedback ? BEHAVIOR[feedback.behavior] || BEHAVIOR.concept_error : null;

  // ── Question screen ─────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setQuestion(null); setFeedback(null); setFoundationMsg(null); setEvalFeedback(null); navigate("/practice", { replace: true }); }}
            className="btn-ghost flex items-center gap-1"
          >
            ← Topics
          </button>
          <span className="text-apple-gray5">|</span>
          <span className="text-[13px] font-semibold text-[var(--label)]">{selectedTopic}</span>
          {question.isAIGenerated && (
            <span className="badge bg-apple-purple/10 text-apple-purple">AI Generated</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 text-[13px] ${timeWarning ? "text-apple-red animate-pulse" : "text-apple-gray"}`}>
            <span>⏱</span>
            <span className="font-mono">{elapsed}s{timeLimit ? ` / ${timeLimit}s` : ""}</span>
          </div>
          <div className="card px-3 py-1.5 shadow-none border border-apple-gray5">
            <span className="text-[12px] font-semibold text-[var(--label)]">
              {sessionStats.correct}/{sessionStats.total}
            </span>
            <span className="text-[11px] text-apple-gray ml-1">correct</span>
          </div>
        </div>
      </div>

      {/* Foundation warning */}
      {foundationMsg && (
        <div className="flex items-start gap-3 bg-apple-orange/8 border border-apple-orange/20 rounded-apple-lg px-4 py-3">
          <span className="text-apple-orange mt-0.5">⚠️</span>
          <p className="text-[13px] text-apple-orange">{foundationMsg}</p>
        </div>
      )}

      {/* Question card */}
      <div className="card p-6">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`badge text-[11px] ${DIFF_COLOR[diff]}`}>
            {DIFF_LABEL[diff]}
          </span>
          {question.conceptTested && (
            <span className="badge bg-apple-gray6 text-apple-gray">{question.conceptTested}</span>
          )}
        </div>

        {/* Case-based passage */}
        {question.caseContext && (
          <div className="bg-apple-gray6 border border-apple-gray5 rounded-apple-lg px-4 py-3 mb-4">
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-1">Read the passage</p>
            <p className="text-[13px] text-[var(--label2)] leading-relaxed">{question.caseContext}</p>
          </div>
        )}

        {/* Assertion-Reason special rendering */}
        {question.questionType === "assertion_reason" ? (
          <AssertionReasonText text={question.questionText} />
        ) : (
          <h2 className="text-[17px] font-semibold text-[var(--label)] leading-snug mb-6">
            {question.questionText}
          </h2>
        )}

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options?.map((opt, i) => {
            let cls = "bg-apple-gray6 border-transparent text-[var(--label)] hover:bg-apple-blue/8 hover:border-apple-blue/30";
            if (feedback) {
              if (opt.type === "correct")
                cls = "bg-apple-green/10 border-apple-green/30 text-apple-green";
              else if (opt.type === feedback.behavior && !feedback.isCorrect)
                cls = "bg-apple-red/10 border-apple-red/30 text-apple-red";
              else
                cls = "bg-apple-gray6 border-transparent text-apple-gray cursor-default";
            }
            return (
              <button
                key={i}
                onClick={() => !feedback && handleAnswer(opt.type)}
                disabled={!!feedback || answering}
                className={`w-full text-left px-4 py-3.5 rounded-apple-lg border text-[14px] font-medium
                            transition-all duration-150 ${cls}`}
              >
                <span className="mr-3 text-apple-gray text-[13px]">{String.fromCharCode(65 + i)}.</span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Confidence + Hint — only before answering */}
        {!feedback && (
          <div className="mt-5 pt-4 border-t border-apple-gray5 space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-[12px] text-apple-gray mr-1">Confidence</p>
              {["low", "medium", "high"].map((c) => (
                <button
                  key={c}
                  onClick={() => setConfidence(c)}
                  className={`text-[12px] font-medium px-3 py-1 rounded-full border transition-all capitalize
                    ${confidence === c
                      ? "bg-apple-blue text-white border-apple-blue"
                      : "bg-apple-gray6 border-apple-gray5 text-apple-gray hover:border-apple-gray3"
                    }`}
                >
                  {c}
                </button>
              ))}
              <button
                onClick={handleHint}
                disabled={hintLoading || !!hint}
                className="ml-auto text-[12px] font-medium text-apple-orange hover:opacity-70 transition-opacity disabled:opacity-40"
              >
                {hintLoading ? "Getting hint…" : hint ? "Hint shown" : "💡 Get Hint"}
              </button>
            </div>
            {hint && (
              <div className="bg-apple-orange/6 border border-apple-orange/20 rounded-apple-lg px-4 py-3">
                <p className="text-[11px] font-semibold text-apple-orange uppercase tracking-wider mb-1">Hint</p>
                <p className="text-[13px] text-[var(--label2)] leading-relaxed">{hint}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback card */}
      {feedback && (
        <div className="card p-6 space-y-4">
          {/* Result header */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${feedback.isCorrect ? "bg-apple-green/10" : "bg-apple-red/10"}`}>
              <span className={`font-bold text-[15px] ${feedback.isCorrect ? "text-apple-green" : "text-apple-red"}`}>
                {feedback.isCorrect ? "✓" : "✗"}
              </span>
            </div>
            <div>
              <p className={`text-[15px] font-bold ${feedback.isCorrect ? "text-apple-green" : "text-apple-red"}`}>
                {feedback.isCorrect ? "Correct" : "Incorrect"}
              </p>
              {behaviorInfo && (
                <span className={`text-[11px] font-medium ${behaviorInfo.text_c}`}>{behaviorInfo.text}</span>
              )}
            </div>
          </div>

          <p className="text-[14px] text-[var(--label2)] leading-relaxed">{feedback.message}</p>

          {/* AI Explanation */}
          {feedback.aiExplanation && (
            <div className="bg-apple-blue/6 border border-apple-blue/15 rounded-apple-lg p-4">
              <p className="text-[11px] font-semibold text-apple-blue uppercase tracking-wider mb-2">AI Explanation</p>
              <p className="text-[13px] text-[var(--label2)] leading-relaxed">{feedback.aiExplanation}</p>
            </div>
          )}

          {/* Shortcut */}
          {feedback.shortcut && (
            <div className="bg-apple-orange/6 border border-apple-orange/15 rounded-apple-lg p-4">
              <p className="text-[11px] font-semibold text-apple-orange uppercase tracking-wider mb-2">💡 Shortcut</p>
              <p className="text-[13px] text-[var(--label2)]">{feedback.shortcut}</p>
            </div>
          )}

          {/* Solution steps — active recall gate for wrong answers */}
          {feedback.solutionSteps?.length > 0 && !feedback.isCorrect && (
            recallMode ? (
              <div className="bg-apple-orange/6 border border-apple-orange/15 rounded-apple-lg p-4">
                <p className="text-[12px] font-semibold text-apple-orange mb-2">
                  Try it yourself first — write how you'd solve this:
                </p>
                <textarea
                  className="w-full bg-[var(--fill)] border border-apple-gray5 rounded-apple-lg px-3 py-2 text-[13px] text-[var(--label)] resize-none focus:outline-none focus:border-apple-blue"
                  rows={2}
                  value={recallAttempt}
                  onChange={(e) => setRecallAttempt(e.target.value)}
                  placeholder="Write your approach before seeing the solution…"
                />
                {/* AI evaluation feedback */}
                {evalFeedback && (
                  <div className="mt-3 bg-apple-purple/6 border border-apple-purple/15 rounded-apple-lg px-3 py-2">
                    <p className="text-[11px] font-semibold text-apple-purple mb-1">AI Feedback on your answer</p>
                    <p className="text-[13px] text-[var(--label2)] leading-relaxed">{evalFeedback}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleEvaluate}
                    disabled={recallAttempt.trim().length < 5 || evalLoading}
                    className="btn-secondary text-[13px] disabled:opacity-40"
                  >
                    {evalLoading ? "Evaluating…" : "Evaluate my answer"}
                  </button>
                  <button
                    onClick={() => setRecallMode(false)}
                    disabled={recallAttempt.trim().length < 5}
                    className="btn-primary text-[13px] disabled:opacity-40"
                  >
                    Show Solution →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowSteps((s) => !s)}
                  className="btn-ghost text-[13px]"
                >
                  {showSteps ? "Hide" : "Show"} solution steps
                </button>
                {showSteps && (
                  <ol className="mt-3 space-y-1.5 list-decimal list-inside">
                    {feedback.solutionSteps.map((step, i) => (
                      <li key={i} className="text-[13px] text-[var(--label2)]">{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            )
          )}
          {/* Solution steps for correct answers — show directly */}
          {feedback.solutionSteps?.length > 0 && feedback.isCorrect && (
            <div>
              <button
                onClick={() => setShowSteps((s) => !s)}
                className="btn-ghost text-[13px]"
              >
                {showSteps ? "Hide" : "Show"} solution steps
              </button>
              {showSteps && (
                <ol className="mt-3 space-y-1.5 list-decimal list-inside">
                  {feedback.solutionSteps.map((step, i) => (
                    <li key={i} className="text-[13px] text-[var(--label2)]">{step}</li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Dangerous misconception */}
          {feedback.confidenceInsight === "dangerous_misconception" && (
            <div className="bg-apple-red/6 border border-apple-red/20 rounded-apple-lg p-4">
              <p className="text-[12px] font-semibold text-apple-red mb-1">⚠️ Dangerous Misconception</p>
              <p className="text-[12px] text-apple-red/80">You were highly confident but wrong. Revisit this concept carefully.</p>
            </div>
          )}

          {/* Auto-doubt */}
          {feedback.doubtInsight && !feedback.aiExplanation && (
            <div className="bg-apple-purple/6 border border-apple-purple/15 rounded-apple-lg p-4">
              <p className="text-[11px] font-semibold text-apple-purple uppercase tracking-wider mb-1">🧠 Auto-doubt detected</p>
              <p className="text-[13px] text-[var(--label2)]">{feedback.doubtInsight}</p>
            </div>
          )}

          {/* AI Teacher */}
          {feedback.teacherMessage?.message && (
            <div className="bg-apple-blue/6 border border-apple-blue/15 rounded-apple-lg p-4">
              <p className="text-[11px] font-semibold text-apple-blue uppercase tracking-wider mb-1">🤖 AI Teacher</p>
              <p className="text-[13px] text-[var(--label2)]">{feedback.teacherMessage.message}</p>
            </div>
          )}

          {/* Difficulty level */}
          {feedback.difficultyLevel && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-apple-gray">
                Difficulty Level: {["", "Basic", "Application", "Tricky", "Exam-level"][feedback.difficultyLevel] || feedback.difficultyLevel}
              </span>
              <div className="flex gap-0.5">
                {[1,2,3,4].map((l) => (
                  <div key={l} className={`w-2 h-2 rounded-full ${l <= feedback.difficultyLevel ? "bg-apple-blue" : "bg-apple-gray5"}`} />
                ))}
              </div>
            </div>
          )}

          {/* Usage counter */}
          {feedback.aiUsage && (
            <div className="flex items-center gap-2 pt-1">
              <p className="text-[11px] text-apple-gray">
                AI calls today: {feedback.aiUsage.used}/{feedback.aiUsage.limit}
              </p>
              {feedback.aiFromCache && (
                <span className="badge bg-apple-green/10 text-apple-green">⚡ from cache</span>
              )}
            </div>
          )}

          {/* Flag question */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleFlag}
              disabled={flagged}
              className={`text-[11px] transition-colors ${flagged ? "text-apple-red cursor-default" : "text-apple-gray hover:text-apple-red"}`}
            >
              {flagged ? "⚑ Reported — thanks" : "⚑ Report this question"}
            </button>
          </div>

          <button onClick={handleNext} className="btn-primary w-full py-3 text-[15px] mt-2">
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Assertion-Reason formatter ──────────────────────────────────────
function AssertionReasonText({ text }) {
  // Try to split on "Assertion" and "Reason" keywords
  const aMatch = text.match(/assertion\s*(?:\(A\))?\s*[:\-]\s*(.*?)(?=reason|$)/is);
  const rMatch = text.match(/reason\s*(?:\(R\))?\s*[:\-]\s*(.*)/is);

  if (aMatch && rMatch) {
    return (
      <div className="mb-6 space-y-3">
        <div className="bg-apple-blue/6 border border-apple-blue/15 rounded-apple-lg px-4 py-3">
          <p className="text-[11px] font-semibold text-apple-blue uppercase tracking-wider mb-1">Assertion (A)</p>
          <p className="text-[15px] font-semibold text-[var(--label)] leading-snug">{aMatch[1].trim()}</p>
        </div>
        <div className="bg-apple-purple/6 border border-apple-purple/15 rounded-apple-lg px-4 py-3">
          <p className="text-[11px] font-semibold text-apple-purple uppercase tracking-wider mb-1">Reason (R)</p>
          <p className="text-[15px] font-semibold text-[var(--label)] leading-snug">{rMatch[1].trim()}</p>
        </div>
        <p className="text-[12px] text-apple-gray">Choose the correct relation between A and R:</p>
      </div>
    );
  }

  // Fallback — render as plain text
  return (
    <h2 className="text-[17px] font-semibold text-[var(--label)] leading-snug mb-6">{text}</h2>
  );
}
