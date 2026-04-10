import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getLesson, saveProgress, markRevised } from "../services/api";

const SLIDE_ICON = {
  concept:         "💡",
  visual:          "👁",
  example:         "✏️",
  shortcut:        "⚡",
  mistake_warning: "⚠️",
};

export default function LessonView() {
  const { topic }            = useParams();
  const [params]             = useSearchParams();
  const navigate             = useNavigate();
  const mode                 = params.get("mode") || "short";

  const [lesson, setLesson]  = useState(null);
  const [idx, setIdx]        = useState(0);
  const [done, setDone]      = useState(false);
  const [loading, setLoading]= useState(true);
  const [error, setError]    = useState("");

  useEffect(() => {
    getLesson(decodeURIComponent(topic))
      .then(({ data }) => {
        if (!data.lesson) {
          setError("Lesson not found. Run npm run seed:lessons in the backend.");
        } else {
          setLesson(data.lesson);
          const allSlides =
            (mode === "short"
              ? data.lesson.shortLesson?.slides
              : data.lesson.longLesson?.slides) || [];
          const saved = data.progress?.slideIndex ?? 0;
          // clamp so we never land on an out-of-bounds index
          setIdx(Math.min(saved, Math.max(allSlides.length - 1, 0)));
        }
      })
      .catch(() => setError("Lesson not found. Run npm run seed:lessons in the backend."))
      .finally(() => setLoading(false));
  }, [topic, mode]);

  const slides = lesson
    ? (mode === "short" ? lesson.shortLesson?.slides : lesson.longLesson?.slides) || []
    : [];

  const current = slides[idx] ?? slides[0];
  const isLast  = idx >= slides.length - 1;

  const handleNext = async () => {
    await saveProgress({ topic: decodeURIComponent(topic), mode, slideIndex: idx + 1 }).catch(() => {});
    if (isLast) {
      await markRevised(decodeURIComponent(topic)).catch(() => {});
      setDone(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const handlePrev = () => { if (idx > 0) setIdx(idx - 1); };

  // ── States ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading lesson…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-apple-orange/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-apple-orange text-xl">📖</span>
        </div>
        <p className="text-[15px] font-semibold text-[var(--label)] mb-2">Lesson Not Found</p>
        <p className="text-[13px] text-apple-gray mb-4">{error}</p>
        <code className="text-[12px] bg-apple-gray6 text-apple-gray px-3 py-1.5 rounded-apple font-mono block mb-6">
          npm run seed:lessons
        </code>
        <button onClick={() => navigate("/lessons", { replace: true })} className="btn-secondary">
          ← Back to Lessons
        </button>
      </div>
    </div>
  );

  if (slides.length === 0) return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card p-10 text-center">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-2">No slides found</p>
        <p className="text-[13px] text-apple-gray mb-5">
          This lesson has no content for <strong>{mode}</strong> mode.
        </p>
        <button
          onClick={() => navigate(`/lessons/${encodeURIComponent(topic)}?mode=${mode === "short" ? "long" : "short"}`, { replace: true })}
          className="btn-primary"
        >
          Try {mode === "short" ? "deep dive" : "short"} mode
        </button>
      </div>
    </div>
  );

  // ── Completion screen ────────────────────────────────────────────
  if (done) return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card p-10 text-center">
        <p className="text-5xl mb-5">🎉</p>
        <h2 className="text-[22px] font-bold text-[var(--label)] mb-2">Lesson Complete!</h2>
        <p className="text-[13px] text-apple-gray mb-4">Key idea to remember:</p>
        <div className="bg-apple-blue/8 border border-apple-blue/15 rounded-apple-lg px-5 py-4 mb-8">
          <p className="text-[14px] font-medium text-apple-blue leading-relaxed">
            {lesson.shortLesson?.keyIdea}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/practice", { state: { topic: lesson.topic } })}
            className="btn-primary"
          >
            Practice questions →
          </button>
          <button onClick={() => navigate("/lessons", { replace: true })} className="btn-secondary">
            Back to Lessons
          </button>
        </div>
      </div>
    </div>
  );

  // ── Lesson view ──────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/lessons", { replace: true })}
            className="btn-ghost text-[13px] mb-1 flex items-center gap-1"
          >
            ← Lessons
          </button>
          <h1 className="text-[22px] font-bold text-[var(--label)] tracking-tight">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-3 mt-1 shrink-0">
          <button
            onClick={() => navigate(`/lessons/${encodeURIComponent(topic)}?mode=${mode === "short" ? "long" : "short"}`, { replace: true })}
            className="btn-ghost text-[13px]"
          >
            {mode === "short" ? "Deep dive ↗" : "Short mode ↗"}
          </button>
          <div className="card px-3 py-1.5 shadow-none border border-apple-gray5">
            <span className="text-[12px] font-semibold text-[var(--label)]">{idx + 1}</span>
            <span className="text-[12px] text-apple-gray">/{slides.length}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-apple-gray5 rounded-full overflow-hidden">
        <div
          className="h-full bg-apple-blue rounded-full transition-all duration-300"
          style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide card */}
      <div className="card p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-[22px]">{SLIDE_ICON[current.type] || "📄"}</span>
          <h2 className="text-[18px] font-bold text-[var(--label)]">{current.title}</h2>
        </div>

        {current.body && (
          <p className="text-[15px] text-[var(--label2)] leading-relaxed mb-5">{current.body}</p>
        )}

        {current.visual && (
          <div className="bg-apple-gray6 rounded-apple-lg px-5 py-4 mb-5 font-mono text-[13px] text-[var(--label2)] whitespace-pre-line">
            {current.visual}
          </div>
        )}

        {current.formula && (
          <div className="bg-apple-blue/8 border border-apple-blue/15 rounded-apple-lg px-5 py-4 mb-5 font-mono text-[14px] text-apple-blue font-semibold">
            {current.formula}
          </div>
        )}

        {current.example && (
          <div className="bg-apple-gray6 rounded-apple-lg p-5 mb-5">
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-3">Example</p>
            <p className="font-mono text-[14px] font-semibold text-[var(--label)] mb-4">{current.example.problem}</p>
            <ol className="space-y-2 mb-4">
              {current.example.steps?.map((s, i) => (
                <li key={i} className="text-[13px] text-[var(--label2)] flex gap-2.5">
                  <span className="text-apple-gray shrink-0 font-mono">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-2 pt-3 border-t border-apple-gray5">
              <span className="text-[12px] text-apple-gray font-medium">Answer:</span>
              <span className="text-[14px] font-bold text-apple-green">{current.example.answer}</span>
            </div>
          </div>
        )}

        {current.shortcut && (
          <div className="bg-apple-orange/8 border border-apple-orange/15 rounded-apple-lg px-5 py-4 mb-5">
            <p className="text-[11px] font-semibold text-apple-orange uppercase tracking-wider mb-2">⚡ Shortcut</p>
            <p className="text-[13px] text-[var(--label2)]">{current.shortcut}</p>
          </div>
        )}

        {current.warning && (
          <div className="bg-apple-red/8 border border-apple-red/15 rounded-apple-lg px-5 py-4">
            <p className="text-[11px] font-semibold text-apple-red uppercase tracking-wider mb-2">⚠️ Common Mistake</p>
            <p className="text-[13px] text-[var(--label2)]">{current.warning}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={idx === 0}
          className="btn-secondary flex-1 disabled:opacity-30 py-3"
        >
          ← Previous
        </button>
        <button onClick={handleNext} className="btn-primary flex-1 py-3">
          {isLast ? "Complete Lesson 🎉" : "Next →"}
        </button>
      </div>
    </div>
  );
}
