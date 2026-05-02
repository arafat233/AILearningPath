import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurriculumChapter } from "../services/api";

function SectionCard({ section }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="border border-[var(--separator)] rounded-apple overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-apple-gray6/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-apple-gray3 w-8 shrink-0">{section.sectionNumber}</span>
          <span className="text-[14px] font-medium text-[var(--label)]">{section.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate("/practice", { state: { topic: section.title } }); }}
            className="text-[11px] text-apple-blue font-medium px-2 py-0.5 rounded bg-apple-blue/10 hover:bg-apple-blue/20 transition-colors"
          >
            Practice →
          </button>
          <span className={`text-apple-gray3 text-[12px] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
        </div>
      </button>
      {open && section.microConcepts?.length > 0 && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--separator)] bg-apple-gray6/30">
          <ul className="space-y-2 mt-2">
            {section.microConcepts.map((mc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-apple-blue mt-[6px] shrink-0" />
                <span className="text-[13px] text-[var(--secondary-label)]">{mc.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ChapterView() {
  const { chapterNumber } = useParams();
  const navigate          = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sections");

  useEffect(() => {
    getCurriculumChapter(chapterNumber)
      .then((r) => setChapter(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [chapterNumber]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  if (!chapter) return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-10 text-center">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-2">Chapter not found</p>
        <button onClick={() => navigate("/lessons")} className="btn-secondary text-[13px] mt-3">
          ← Back to Lessons
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: "sections",  label: "Sections" },
    { id: "formulas",  label: "Key Formulas" },
    { id: "theorems",  label: "Theorems" },
    { id: "tips",      label: "Exam Tips" },
    { id: "exercises", label: "Exercises" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate("/lessons")}
        className="text-[13px] text-apple-gray hover:text-apple-blue transition-colors flex items-center gap-1"
      >
        ‹ Back to Learn
      </button>

      {/* Chapter header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-apple-blue/10 text-apple-blue text-[18px] font-bold flex items-center justify-center shrink-0">
            {chapter.chapterNumber}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-apple-gray uppercase tracking-wider mb-0.5">
              {chapter.board} · Class {chapter.grade} · {chapter.subject}
            </p>
            <h1 className="text-[22px] font-bold text-[var(--label)] tracking-tight">{chapter.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {chapter.unit && (
                <span className="text-[11px] px-2 py-0.5 bg-apple-blue/8 text-apple-blue rounded-full font-medium">
                  {chapter.unit}
                </span>
              )}
              {chapter.examMarks > 0 && (
                <span className="text-[11px] px-2 py-0.5 bg-apple-green/10 text-apple-green rounded-full font-medium">
                  {chapter.examMarks} marks
                </span>
              )}
              {chapter.estimatedWeeks > 0 && (
                <span className="text-[11px] px-2 py-0.5 bg-apple-gray6 text-apple-gray rounded-full font-medium">
                  ~{chapter.estimatedWeeks} week{chapter.estimatedWeeks > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {chapter.overview && (
              <p className="text-[13px] text-apple-gray mt-3 leading-relaxed">{chapter.overview}</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-2 mt-5 pt-5 border-t border-[var(--separator)]">
          <button
            onClick={() => navigate("/practice", { state: { topic: chapter.title } })}
            className="btn-primary text-[13px] py-2 px-5"
          >
            Practice Questions
          </button>
          <button
            onClick={() => navigate(`/lessons/${encodeURIComponent(chapter.title)}`)}
            className="btn-secondary text-[13px] py-2 px-5"
          >
            AI Lesson
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-apple text-[13px] font-medium whitespace-nowrap transition-colors
              ${activeTab === t.id
                ? "bg-apple-blue text-white"
                : "bg-apple-gray6 text-apple-gray hover:text-[var(--label)]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sections tab */}
      {activeTab === "sections" && (
        <div className="space-y-2">
          {chapter.sections?.map((s) => (
            <SectionCard key={s.sectionNumber} section={s} />
          ))}
        </div>
      )}

      {/* Formulas tab */}
      {activeTab === "formulas" && (
        <div className="card p-5">
          {chapter.keyFormulas?.length > 0 ? (
            <ul className="space-y-3">
              {chapter.keyFormulas.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-apple-blue/10 text-apple-blue text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <code className="text-[13px] text-[var(--label)] font-mono leading-relaxed">{f}</code>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-apple-gray text-center py-4">No formulas recorded for this chapter.</p>
          )}
        </div>
      )}

      {/* Theorems tab */}
      {activeTab === "theorems" && (
        <div className="space-y-3">
          {chapter.theorems?.length > 0 ? (
            chapter.theorems.map((t, i) => (
              <div key={i} className="card p-4">
                <p className="text-[13px] font-semibold text-apple-blue mb-1">{t.name}</p>
                {t.statement && (
                  <p className="text-[13px] text-[var(--secondary-label)] leading-relaxed">{t.statement}</p>
                )}
              </div>
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-[13px] text-apple-gray">No theorems recorded for this chapter.</p>
            </div>
          )}
        </div>
      )}

      {/* Exam Tips tab */}
      {activeTab === "tips" && (
        <div className="card p-5">
          {chapter.examTips?.length > 0 ? (
            <ul className="space-y-3">
              {chapter.examTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[16px] shrink-0">💡</span>
                  <p className="text-[13px] text-[var(--label)] leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-apple-gray text-center py-4">No exam tips recorded.</p>
          )}
        </div>
      )}

      {/* Exercises tab */}
      {activeTab === "exercises" && (
        <div className="space-y-2.5">
          {chapter.exercises?.length > 0 ? (
            chapter.exercises.map((ex, i) => (
              <div key={i} className="card p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-medium text-[var(--label)]">{ex.exerciseNumber}</p>
                  <p className="text-[12px] text-apple-gray mt-0.5">
                    {ex.questionCount} question{ex.questionCount !== 1 ? "s" : ""}
                    {ex.types?.length > 0 ? ` · ${ex.types.join(", ")}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/practice", { state: { topic: `${chapter.title} — ${ex.exerciseNumber}` } })}
                  className="btn-secondary text-[12px] py-1.5 px-3 shrink-0"
                >
                  Practice
                </button>
              </div>
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-[13px] text-apple-gray">No exercise data recorded.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
