import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getLesson, saveProgress, markRevised } from "../services/api";

const SLIDE_ICON = {
  concept: "💡", visual: "👁", example: "✏️",
  shortcut: "⚡", mistake_warning: "⚠️",
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
        setLesson(data.lesson);
        // resume from saved progress
        if (data.progress?.slideIndex) setIdx(data.progress.slideIndex);
      })
      .catch(() => setError("Lesson not found. Make sure you ran npm run seed:lessons"))
      .finally(() => setLoading(false));
  }, [topic]);

  const slides = lesson
    ? (mode === "short" ? lesson.shortLesson?.slides : lesson.longLesson?.slides) || []
    : [];

  const current = slides[idx];
  const isLast  = idx === slides.length - 1;

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

  if (loading) return <div className="text-gray-400 text-sm">Loading lesson…</div>;
  if (error)   return <div className="max-w-xl mx-auto"><div className="card p-8 text-center text-red-500 text-sm">{error}</div></div>;
  if (!lesson) return null;

  if (done) return (
    <div className="max-w-xl mx-auto">
      <div className="card p-10 text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-xl font-semibold mb-2">Lesson complete!</h2>
        <p className="text-sm text-gray-500 mb-2">Key idea to remember:</p>
        <p className="text-sm font-medium text-brand-600 bg-brand-50 px-4 py-3 rounded-xl mb-6">
          {lesson.shortLesson?.keyIdea}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(`/practice`, { state: { topic: lesson.topic } })}
            className="btn-primary"
          >
            Practice questions →
          </button>
          <button onClick={() => navigate("/lessons")} className="btn-secondary">
            Back to lessons
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate("/lessons")} className="text-xs text-gray-400 hover:text-gray-700 mb-1 block">
            ← Lessons
          </button>
          <h1 className="text-xl font-semibold">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/lessons/${encodeURIComponent(topic)}?mode=${mode === "short" ? "long" : "short"}`)}
            className="text-xs text-brand-500 hover:underline"
          >
            Switch to {mode === "short" ? "deep dive" : "short"} mode
          </button>
          <span className="text-xs text-gray-400">
            {idx + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-6">
        <div
          className="h-1 bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide card */}
      {current && (
        <div className="card p-7 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{SLIDE_ICON[current.type] || "📄"}</span>
            <h2 className="text-lg font-semibold text-gray-900">{current.title}</h2>
          </div>

          {current.body && (
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{current.body}</p>
          )}

          {current.visual && (
            <div className="bg-gray-50 border border-surface-border rounded-xl px-5 py-4 mb-4 font-mono text-sm text-gray-700 whitespace-pre-line">
              {current.visual}
            </div>
          )}

          {current.formula && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 mb-4 font-mono text-sm text-brand-800">
              {current.formula}
            </div>
          )}

          {current.example && (
            <div className="bg-gray-50 border border-surface-border rounded-xl p-5 mb-4">
              <p className="text-xs font-medium text-gray-400 mb-2">EXAMPLE</p>
              <p className="font-mono text-sm font-medium text-gray-800 mb-3">{current.example.problem}</p>
              <ol className="flex flex-col gap-1.5 mb-3">
                {current.example.steps?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-gray-300 shrink-0">{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
              <p className="text-sm font-semibold text-green-700">Answer: {current.example.answer}</p>
            </div>
          )}

          {current.shortcut && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 mb-4">
              <p className="text-xs font-medium text-amber-600 mb-1">⚡ SHORTCUT</p>
              <p className="text-sm text-amber-900">{current.shortcut}</p>
            </div>
          )}

          {current.warning && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3">
              <p className="text-xs font-medium text-red-500 mb-1">⚠️ COMMON MISTAKE</p>
              <p className="text-sm text-red-900">{current.warning}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={idx === 0}
          className="btn-secondary flex-1 disabled:opacity-30"
        >
          ← Previous
        </button>
        <button onClick={handleNext} className="btn-primary flex-1">
          {isLast ? "Complete lesson 🎉" : "Next →"}
        </button>
      </div>
    </div>
  );
}
