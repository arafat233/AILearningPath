import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLessons, getRevisionDue } from "../services/api";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [revisionDue, setRevisionDue] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="text-gray-400 text-sm">Loading lessons…</div>;

  const dueTopic = new Set(revisionDue.map((r) => r.topic));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Learn</h1>
      <p className="text-sm text-gray-500 mb-6">
        Start with the short lesson (5–10 min), then practice questions.
      </p>

      {/* Revision due alert */}
      {revisionDue.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-medium text-amber-800 mb-2">
            📅 {revisionDue.length} topic{revisionDue.length > 1 ? "s" : ""} due for revision
          </p>
          <div className="flex flex-wrap gap-2">
            {revisionDue.map((r) => (
              <button
                key={r.topic}
                onClick={() => navigate(`/lessons/${encodeURIComponent(r.topic)}`)}
                className={`badge text-xs px-3 py-1 cursor-pointer ${
                  r.urgency === "overdue"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {r.topic} ({r.urgency})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lesson cards */}
      {lessons.length === 0 ? (
        <div className="card p-8 text-center text-sm text-gray-400">
          No lessons found. Run <code className="font-mono bg-gray-100 px-1 rounded">npm run seed</code> in the backend.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className={`card p-5 flex items-center justify-between transition-all hover:border-brand-300 ${
                dueTopic.has(lesson.topic) ? "border-amber-300 bg-amber-50" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{lesson.title}</p>
                  {dueTopic.has(lesson.topic) && (
                    <span className="badge bg-amber-100 text-amber-700 text-xs">Revision due</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{lesson.tagline}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Short: ~{lesson.shortLesson?.estimatedMinutes} min
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => navigate(`/lessons/${encodeURIComponent(lesson.topic)}?mode=short`)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Learn →
                </button>
                <button
                  onClick={() => navigate(`/practice?topic=${encodeURIComponent(lesson.topic)}`)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
