import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNcertChapter } from "../services/api";

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const diffColor = q.difficulty === "easy"
    ? "bg-apple-green/10 text-apple-green"
    : q.difficulty === "hard"
      ? "bg-apple-red/10 text-apple-red"
      : "bg-apple-orange/10 text-apple-orange";

  return (
    <div className="border border-[var(--separator)] rounded-apple overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left hover:bg-apple-gray6/50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-[11px] font-mono text-apple-gray3 shrink-0 mt-[2px]">Q{index + 1}</span>
          <p className="text-[13px] text-[var(--label)] leading-snug">{q.question}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diffColor}`}>
            {q.difficulty}
          </span>
          {q.marks && (
            <span className="text-[10px] text-apple-gray3">{q.marks}m</span>
          )}
          <span className={`text-apple-gray3 text-[12px] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--separator)] bg-apple-gray6/30 space-y-2">
          <div>
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-1">Answer</p>
            <p className="text-[13px] text-[var(--secondary-label)] leading-relaxed">{q.answer}</p>
          </div>
          {q.skill_tested && (
            <p className="text-[12px] text-apple-gray">
              <span className="font-medium">Skill: </span>{q.skill_tested}
            </p>
          )}
          {q.why_students_miss && (
            <p className="text-[12px] text-apple-orange">
              <span className="font-medium">Common mistake: </span>{q.why_students_miss}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TopicSection({ topic, chapterId, navigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-4 border-l-2 border-[var(--separator)] pl-3">
      <div className="flex items-center justify-between gap-2 py-1.5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-left flex-1"
        >
          <span className={`text-apple-gray3 text-[11px] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
          <span className="text-[13px] text-[var(--label)] font-medium">{topic.name}</span>
          <span className="text-[11px] text-apple-gray3">· {topic.questions?.length ?? 0} Q</span>
        </button>
        <button
          onClick={() => navigate(`/ncert/topics/${topic.id}`)}
          className="text-[11px] text-apple-blue hover:underline shrink-0"
        >
          Study →
        </button>
      </div>
      {open && topic.questions?.length > 0 && (
        <div className="mt-2 space-y-2">
          {topic.questions.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConceptSection({ concept, chapterId, navigate }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="ml-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 py-1 text-left w-full"
      >
        <span className={`text-apple-gray3 text-[12px] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
        <span className="text-[13px] font-semibold text-apple-blue">{concept.name}</span>
      </button>
      {open && concept.topics?.map((t) => (
        <TopicSection key={t.id} topic={t} chapterId={chapterId} navigate={navigate} />
      ))}
    </div>
  );
}

export default function NcertChapterView() {
  const { chapterId } = useParams();
  const navigate      = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNcertChapter(chapterId)
      .then((r) => setChapter(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [chapterId]);

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
          ← Back to Learn
        </button>
      </div>
    </div>
  );

  const totalTopics = chapter.subchapters?.reduce(
    (s, sc) => s + sc.concepts?.reduce((cs, c) => cs + (c.topics?.length ?? 0), 0), 0
  ) ?? 0;

  const totalQuestions = chapter.subchapters?.reduce(
    (s, sc) => s + sc.concepts?.reduce(
      (cs, c) => cs + c.topics?.reduce((ts, t) => ts + (t.questions?.length ?? 0), 0), 0
    ), 0
  ) ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
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
            {chapter.number}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-apple-gray uppercase tracking-wider mb-0.5">
              {chapter.board} · Class {chapter.grade} · {chapter.subject}
            </p>
            <h1 className="text-[22px] font-bold text-[var(--label)] tracking-tight">{chapter.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] px-2 py-0.5 bg-apple-gray6 text-apple-gray rounded-full font-medium">
                {chapter.subchapters?.length ?? 0} sections
              </span>
              <span className="text-[11px] px-2 py-0.5 bg-apple-blue/8 text-apple-blue rounded-full font-medium">
                {totalTopics} topics
              </span>
              <span className="text-[11px] px-2 py-0.5 bg-apple-green/10 text-apple-green rounded-full font-medium">
                {totalQuestions} questions
              </span>
            </div>
            {chapter.overview && (
              <p className="text-[13px] text-apple-gray mt-3 leading-relaxed">{chapter.overview}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-5 pt-5 border-t border-[var(--separator)]">
          <button
            onClick={() => navigate("/practice", { state: { topic: chapter.title } })}
            className="btn-primary text-[13px] py-2 px-5"
          >
            Practice Questions
          </button>
        </div>
      </div>

      {/* Subchapters */}
      <div className="space-y-3">
        {chapter.subchapters?.map((sc) => (
          <div key={sc.id} className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono text-apple-gray3 w-8 shrink-0">{sc.number}</span>
              <h2 className="text-[15px] font-semibold text-[var(--label)]">{sc.title}</h2>
            </div>
            <div className="space-y-2">
              {sc.concepts?.map((c) => (
                <ConceptSection key={c.id} concept={c} chapterId={chapterId} navigate={navigate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
