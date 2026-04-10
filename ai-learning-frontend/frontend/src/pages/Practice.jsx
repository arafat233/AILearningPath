import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startTopic, submitAnswer } from "../services/api";

const TOPICS = [
  "Algebra Basics", "Linear Equations", "Quadratic Equations",
  "Factorization", "Trigonometry", "Probability",
];

const BEHAVIOR_LABEL = {
  guessing: { text: "Guessing detected", color: "text-orange-600 bg-orange-50" },
  concept_error: { text: "Concept misunderstood", color: "text-red-600 bg-red-50" },
  calculation_error: { text: "Calculation mistake", color: "text-yellow-700 bg-yellow-50" },
  partial_logic: { text: "Missed a step", color: "text-purple-600 bg-purple-50" },
  misinterpretation: { text: "Misread question", color: "text-blue-600 bg-blue-50" },
  correct: { text: "Correct", color: "text-green-700 bg-green-50" },
};

export default function Practice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(location.state?.topic || "");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [foundationMsg, setFoundationMsg] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const startTimeRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (question && !feedback) {
      startTimeRef.current = Date.now();
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [question, feedback]);

  const handleStart = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setFeedback(null);
    setFoundationMsg(null);
    try {
      const { data } = await startTopic(selectedTopic);
      if (data.foundationRedirect) {
        setFoundationMsg(data.message);
        setQuestion(data.question);
      } else {
        setQuestion(data);
      }
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

  const handleNext = () => {
    if (feedback?.nextQuestion) {
      setQuestion(feedback.nextQuestion);
      setFeedback(null);
      setConfidence("");
      setShowSteps(false);
    } else {
      handleStart();
    }
  };

  // Topic selector screen
  if (!question) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Practice</h1>
        <p className="text-sm text-gray-500 mb-6">Choose a topic to begin</p>

        <div className="card p-5 mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Select Topic</p>
          <div className="grid grid-cols-2 gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                  selectedTopic === t
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-surface-border hover:border-brand-300 text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedTopic || loading}
          className="btn-primary w-full"
        >
          {loading ? "Loading…" : "Start Practice →"}
        </button>
      </div>
    );
  }

  const behaviorInfo = feedback ? BEHAVIOR_LABEL[feedback.behavior] || BEHAVIOR_LABEL.concept_error : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setQuestion(null); setFeedback(null); setFoundationMsg(null); }}
            className="text-sm text-gray-400 hover:text-gray-700"
          >
            ← Topics
          </button>
          <span className="text-sm font-medium text-gray-700">{selectedTopic}</span>
          {question.isAIGenerated && (
            <span className="badge bg-purple-50 text-purple-600 text-xs">AI Generated</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>⏱ {elapsed}s</span>
          <span className="font-medium text-gray-700">
            {sessionStats.correct}/{sessionStats.total} correct
          </span>
        </div>
      </div>

      {/* Foundation warning */}
      {foundationMsg && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-800">
          ⚠️ {foundationMsg}
        </div>
      )}

      {/* Question card */}
      <div className="card p-6 mb-4">
        <p className="text-xs text-gray-400 mb-3">
          Difficulty:{" "}
          <span className="font-medium text-gray-600">
            {question.difficultyScore < 0.4 ? "Easy" : question.difficultyScore < 0.7 ? "Medium" : "Hard"}
          </span>
          {question.conceptTested && (
            <span className="ml-3 text-gray-400">· {question.conceptTested}</span>
          )}
        </p>

        <h2 className="text-lg font-medium text-gray-900 mb-5 leading-snug">
          {question.questionText}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options?.map((opt, i) => {
            let style = "border-surface-border hover:border-brand-400 hover:bg-brand-50 text-gray-800";
            if (feedback) {
              if (opt.type === "correct") style = "border-green-400 bg-green-50 text-green-800";
              else if (opt.type === feedback.behavior && !feedback.isCorrect)
                style = "border-red-300 bg-red-50 text-red-800";
              else style = "border-surface-border text-gray-400 cursor-default";
            }
            return (
              <button
                key={i}
                onClick={() => !feedback && handleAnswer(opt.type)}
                disabled={!!feedback || answering}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${style}`}
              >
                <span className="mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Confidence selector — only before answering */}
        {!feedback && (
          <div className="mt-5 flex items-center gap-3">
            <p className="text-xs text-gray-400">Confidence:</p>
            {["low", "medium", "high"].map((c) => (
              <button
                key={c}
                onClick={() => setConfidence(c)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  confidence === c
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-surface-border text-gray-500"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feedback card */}
      {feedback && (
        <div className="card p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-base font-semibold ${feedback.isCorrect ? "text-green-700" : "text-red-600"}`}>
                {feedback.isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </span>
              {behaviorInfo && (
                <span className={`badge text-xs ${behaviorInfo.color}`}>{behaviorInfo.text}</span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3">{feedback.message}</p>

          {/* AI Explanation */}
          {feedback.aiExplanation && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3">
              <p className="text-xs font-medium text-blue-600 mb-1">AI Explanation</p>
              <p className="text-sm text-blue-900 leading-relaxed">{feedback.aiExplanation}</p>
            </div>
          )}

          {/* Shortcut */}
          {feedback.shortcut && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-3">
              <p className="text-xs font-medium text-amber-700 mb-1">💡 Shortcut</p>
              <p className="text-sm text-amber-900">{feedback.shortcut}</p>
            </div>
          )}

          {/* Solution steps toggle */}
          {feedback.solutionSteps?.length > 0 && (
            <div>
              <button
                onClick={() => setShowSteps((s) => !s)}
                className="text-xs text-brand-500 hover:underline mb-2"
              >
                {showSteps ? "Hide" : "Show"} solution steps
              </button>
              {showSteps && (
                <ol className="list-decimal list-inside flex flex-col gap-1">
                  {feedback.solutionSteps.map((step, i) => (
                    <li key={i} className="text-sm text-gray-700">{step}</li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Confidence mismatch warning */}
          {feedback.confidenceInsight === "dangerous_misconception" && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-medium text-red-700">⚠️ Dangerous misconception detected</p>
              <p className="text-xs text-red-600 mt-0.5">You were highly confident but wrong. Revisit this concept carefully.</p>
            </div>
          )}

          {/* Auto-doubt insight */}
          {feedback.doubtInsight && !feedback.aiExplanation && (
            <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
              <p className="text-xs font-medium text-purple-600 mb-1">🧠 Auto-doubt detected</p>
              <p className="text-sm text-purple-900">{feedback.doubtInsight}</p>
            </div>
          )}

          {/* AI usage counter */}
          {feedback.aiUsageToday !== undefined && (
            <p className="text-xs text-gray-400 mt-2">AI calls today: {feedback.aiUsageToday}/15</p>
          )}

          {/* Teacher message */}
          {feedback.teacherMessage?.message && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-medium text-blue-600 mb-1">🤖 AI Teacher</p>
              <p className="text-sm text-blue-900">{feedback.teacherMessage.message}</p>
            </div>
          )}

          <button onClick={handleNext} className="btn-primary mt-4 w-full">
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
}
