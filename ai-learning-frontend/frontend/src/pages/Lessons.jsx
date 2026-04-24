import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLessons, getRevisionDue, listCurriculumChapters } from "../services/api";

const UNIT_COLORS = {
  "Number Systems":           "bg-blue-50 text-blue-700 border-blue-200",
  "Algebra":                  "bg-purple-50 text-purple-700 border-purple-200",
  "Geometry":                 "bg-green-50 text-green-700 border-green-200",
  "Coordinate Geometry":      "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Trigonometry":             "bg-orange-50 text-orange-700 border-orange-200",
  "Mensuration":              "bg-rose-50 text-rose-700 border-rose-200",
  "Statistics and Probability": "bg-amber-50 text-amber-700 border-amber-200",
};

function unitBadgeClass(unit) {
  return UNIT_COLORS[unit] || "bg-apple-gray6 text-apple-gray border-apple-gray5";
}

export default function Lessons() {
  const [tab, setTab]               = useState("curriculum"); // "curriculum" | "ai-lessons"
  const [lessons, setLessons]       = useState([]);
  const [revisionDue, setRevisionDue] = useState([]);
  const [chapters, setChapters]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      listLessons().catch(() => ({ data: [] })),
      getRevisionDue().catch(() => ({ data: [] })),
      listCurriculumChapters().catch(() => ({ data: [] })),
    ]).then(([l, r, c]) => {
      setLessons(l.data);
      setRevisionDue(r.data);
      setChapters(c.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading…</p>
      </div>
    </div>
  );

  const dueTopic = new Set(revisionDue.map((r) => r.topic));

  // Group chapters by unit
  const unitGroups = chapters.reduce((acc, ch) => {
    const u = ch.unit || "Other";
    if (!acc[u]) acc[u] = [];
    acc[u].push(ch);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Learn</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">
          CBSE Class 10 Mathematics — complete textbook curriculum.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-apple-gray6 rounded-apple w-fit">
        {[
          { id: "curriculum", label: "Textbook Chapters" },
          { id: "ai-lessons", label: "AI Lessons" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-[background-color,color,box-shadow]
              ${tab === t.id
                ? "bg-white text-[var(--label)] shadow-apple-sm"
                : "text-apple-gray hover:text-[var(--label)]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Textbook Chapters tab ─────────────────────────────── */}
      {tab === "curriculum" && (
        <div className="space-y-6">
          {chapters.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-[15px] font-semibold text-[var(--label)] mb-2">No chapters found</p>
              <p className="text-[13px] text-apple-gray mb-3">Run the seed command in your backend folder:</p>
              <code className="text-[12px] bg-apple-gray6 text-apple-gray px-3 py-1.5 rounded-apple font-mono">
                npm run seed:curriculum
              </code>
            </div>
          ) : (
            Object.entries(unitGroups).map(([unit, unitChapters]) => (
              <div key={unit}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${unitBadgeClass(unit)}`}>
                    {unit}
                  </span>
                  <span className="text-[11px] text-apple-gray3">
                    {unitChapters.reduce((s, c) => s + (c.examMarks || 0), 0)} marks
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {unitChapters.map((ch) => (
                    <div
                      key={ch._id}
                      onClick={() => navigate(`/chapters/${ch.chapterNumber}`)}
                      className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-apple-md transition-[box-shadow,transform] active:scale-[0.99] group"
                    >
                      {/* Chapter number bubble */}
                      <div className="w-10 h-10 rounded-full bg-apple-blue/10 text-apple-blue text-[14px] font-bold flex items-center justify-center shrink-0">
                        {ch.chapterNumber}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[var(--label)] truncate group-hover:text-apple-blue transition-colors">
                          {ch.title}
                        </p>
                        <p className="text-[12px] text-apple-gray mt-0.5 line-clamp-1">
                          {ch.sections?.length ?? 0} sections
                          {ch.estimatedWeeks ? ` · ~${ch.estimatedWeeks} week${ch.estimatedWeeks > 1 ? "s" : ""}` : ""}
                          {ch.examMarks ? ` · ${ch.examMarks} marks` : ""}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate("/practice", { state: { topic: ch.title } }); }}
                          className="btn-secondary text-[12px] py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Practice
                        </button>
                        <span className="text-apple-gray3 text-[18px] group-hover:text-apple-blue transition-colors">›</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── AI Lessons tab ───────────────────────────────────── */}
      {tab === "ai-lessons" && (
        <div className="space-y-4">
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

          {lessons.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-[15px] font-semibold text-[var(--label)] mb-2">No AI lessons yet</p>
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
                    className={`card p-5 flex items-center justify-between gap-4 transition-[box-shadow,background-color,border-color]
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
      )}
    </div>
  );
}
