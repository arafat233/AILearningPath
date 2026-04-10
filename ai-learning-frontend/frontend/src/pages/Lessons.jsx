import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLessons, getRevisionDue } from "../services/api";

export default function Lessons() {
  const [lessons, setLessons]         = useState([]);
  const [revisionDue, setRevisionDue] = useState([]);
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([listLessons(), getRevisionDue()])
      .then(([l, r]) => {
        setLessons(l.data);
        setRevisionDue(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading lessons…</p>
      </div>
    </div>
  );

  const dueTopic = new Set(revisionDue.map((r) => r.topic));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Learn</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">
          Start with the short lesson (5–10 min), then practice questions.
        </p>
      </div>

      {/* Revision due alert */}
      {revisionDue.length > 0 && (
        <div className="bg-apple-orange/8 border border-apple-orange/20 rounded-apple-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span>📅</span>
            <p className="text-[14px] font-semibold text-apple-orange">
              {revisionDue.length} topic{revisionDue.length > 1 ? "s" : ""} due for revision
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {revisionDue.map((r) => (
              <button
                key={r.topic}
                onClick={() => navigate(`/lessons/${encodeURIComponent(r.topic)}`)}
                className={`badge text-[12px] px-3 py-1.5 cursor-pointer font-medium transition-opacity hover:opacity-80
                  ${r.urgency === "overdue"
                    ? "bg-apple-red/10 text-apple-red"
                    : "bg-apple-orange/10 text-apple-orange"
                  }`}
              >
                {r.topic}
                <span className="ml-1 opacity-60">· {r.urgency}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lesson cards */}
      {lessons.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[15px] font-semibold text-[var(--label)] mb-2">No lessons found</p>
          <p className="text-[13px] text-apple-gray mb-3">Run the seed command in your backend folder:</p>
          <code className="text-[12px] bg-apple-gray6 text-apple-gray px-3 py-1.5 rounded-apple font-mono">
            npm run seed:lessons
          </code>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lessons.map((lesson) => {
            const isDue = dueTopic.has(lesson.topic);
            return (
              <div
                key={lesson._id}
                className={`card p-5 flex items-center justify-between gap-4 transition-all
                  ${isDue ? "ring-1 ring-apple-orange/30 bg-apple-orange/4" : "hover:shadow-apple-md"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[15px] font-semibold text-[var(--label)] truncate">{lesson.title}</p>
                    {isDue && (
                      <span className="badge bg-apple-orange/10 text-apple-orange text-[11px] shrink-0">
                        Revision due
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-apple-gray truncate">{lesson.tagline}</p>
                  <p className="text-[11px] text-apple-gray3 mt-1">
                    Short: ~{lesson.shortLesson?.estimatedMinutes} min
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/lessons/${encodeURIComponent(lesson.topic)}?mode=short`)}
                    className="btn-primary text-[13px] py-2 px-4"
                  >
                    Learn →
                  </button>
                  <button
                    onClick={() => navigate("/practice", { state: { topic: lesson.topic } })}
                    className="btn-secondary text-[13px] py-2 px-4"
                  >
                    Practice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
