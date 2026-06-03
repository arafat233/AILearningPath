/**
 * ProPatternQuiz — /pro/:trackSlug/pattern-quiz
 *
 * Track-2 "which pattern fits?" quick-fire quiz. Shows a real (LeetCode-tagged)
 * problem and asks the learner to pick its DSA pattern from 4 choices, with
 * instant feedback and a running score. Reinforces the pattern-recognition skill
 * the `pattern` tag (config/seedProExerciseMetadata.js) unlocks.
 */
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetPatternQuiz } from "../../services/api";

const humanize = (p) => (p || "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function ProPatternQuiz() {
  const { trackSlug } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState("");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null); // the choice the user clicked (locks the question)
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const load = useCallback(() => {
    setQuestions(null); setError(""); setIdx(0); setPicked(null); setScore(0); setFinished(false);
    proGetPatternQuiz(trackSlug, 10)
      .then((res) => setQuestions(res.data?.data?.questions || []))
      .catch(() => setError("Couldn't load the quiz. Are you enrolled in this track?"));
  }, [trackSlug]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(`/pro/${trackSlug}/patterns`)} className="text-[12px] text-apple-gray hover:text-apple-blue">← Patterns</button>
        <div className="card p-6 text-center text-[14px] text-apple-gray">{error}</div>
      </div>
    );
  }
  if (!questions) return <div className="card p-6 text-center text-[14px] text-apple-gray">Loading quiz…</div>;
  if (questions.length === 0) return <div className="card p-6 text-center text-[14px] text-apple-gray">No quiz questions available yet.</div>;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-5">
        <div className="card p-8 text-center space-y-3">
          <p className="text-[11px] font-bold tracking-wider uppercase text-apple-gray">Pattern Quiz · Result</p>
          <p className="text-[48px] font-bold tracking-tight text-[var(--label)]">{score}<span className="text-apple-gray3 text-[28px]">/{questions.length}</span></p>
          <p className="text-[15px] text-apple-gray">{pct >= 80 ? "Sharp pattern recognition 🎯" : pct >= 50 ? "Solid — keep drilling." : "Worth a review of the Pattern Atlas."}</p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button onClick={load} className="px-4 py-2 rounded-full bg-apple-blue text-white text-[13px] font-semibold hover:opacity-90">Try again</button>
            <button onClick={() => navigate(`/pro/${trackSlug}/patterns`)} className="px-4 py-2 rounded-full bg-[var(--fill)] text-[var(--label)] text-[13px] font-semibold hover:opacity-80">Pattern Atlas</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const answered = picked !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`/pro/${trackSlug}/patterns`)} className="text-[12px] text-apple-gray hover:text-apple-blue">← Patterns</button>
        <span className="text-[12px] text-apple-gray font-medium">Question {idx + 1} / {questions.length} · Score {score}</span>
      </div>

      {/* progress bar */}
      <div className="h-1.5 rounded-full bg-[var(--fill)] overflow-hidden">
        <div className="h-full bg-apple-blue transition-all" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      <div className="card p-6 space-y-1">
        <p className="text-[11px] font-bold tracking-wider uppercase text-apple-gray">Which pattern fits this problem?</p>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--label)] leading-snug">{q.title}</h1>
        {q.leetcodeId && <p className="text-[12px] text-apple-gray3 font-mono">LC #{q.leetcodeId}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {q.choices.map((choice) => {
          const isAnswer = choice === q.answer;
          const isPicked = choice === picked;
          let cls = "border-apple-gray5 hover:border-apple-blue";
          if (answered && isAnswer) cls = "border-apple-green bg-apple-green/10";
          else if (answered && isPicked) cls = "border-apple-red bg-apple-red/10";
          else if (answered) cls = "border-apple-gray5 opacity-60";
          return (
            <button
              key={choice}
              disabled={answered}
              onClick={() => { setPicked(choice); if (isAnswer) setScore((s) => s + 1); }}
              className={`card p-4 text-left text-[14px] font-semibold text-[var(--label)] border transition-all ${cls}`}
            >
              {humanize(choice)}
              {answered && isAnswer && <span className="float-right text-apple-green">✓</span>}
              {answered && isPicked && !isAnswer && <span className="float-right text-apple-red">✗</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={() => { if (isLast) setFinished(true); else { setIdx((i) => i + 1); setPicked(null); } }}
            className="px-5 py-2 rounded-full bg-apple-blue text-white text-[13px] font-semibold hover:opacity-90"
          >
            {isLast ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
