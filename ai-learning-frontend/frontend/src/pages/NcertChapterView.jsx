import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNcertChapter } from "../services/api";

const DIFF_STYLE = {
  easy:   { background: "#E8F9EE", color: "#34C759" },
  medium: { background: "#FFF4E0", color: "#FF9500" },
  hard:   { background: "#FFE5E5", color: "#FF3B30" },
};

function QuestionCard({ q, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const diff = DIFF_STYLE[q.difficulty] || DIFF_STYLE.medium;

  return (
    <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E5E5EA", overflow: "hidden", marginBottom: "10px" }}>
      {/* Question */}
      <div style={{ padding: "16px 20px" }}>
        <div className="flex items-start gap-3">
          <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "#86868B", marginTop: "2px", flexShrink: 0, minWidth: "24px" }}>
            Q{index + 1}
          </span>
          <p style={{ fontSize: "14px", color: "#1D1D1F", lineHeight: 1.6, flex: 1 }}>{q.question}</p>
        </div>

        <div className="flex items-center gap-2 mt-3 ml-9">
          <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: "20px", ...diff }}>
            {q.difficulty}
          </span>
          {q.marks && (
            <span style={{ fontSize: "11px", color: "#86868B" }}>{q.marks} marks</span>
          )}
          {q.skill_tested && (
            <span style={{ fontSize: "11px", color: "#86868B" }}>· {q.skill_tested}</span>
          )}
        </div>
      </div>

      {/* Show answer toggle */}
      <button
        onClick={() => setShowAnswer((s) => !s)}
        style={{ width: "100%", padding: "10px 20px", borderTop: "1px solid #F5F5F7", background: showAnswer ? "#F5F5F7" : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      >
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#007AFF" }}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </span>
        <span style={{ color: "#007AFF", fontSize: "14px", transform: showAnswer ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>›</span>
      </button>

      {showAnswer && (
        <div style={{ padding: "14px 20px 16px", background: "#F9F9FB", borderTop: "1px solid #E5E5EA" }}>
          <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.7 }}>{q.answer}</p>
          {q.why_students_miss && (
            <div style={{ marginTop: "10px", padding: "8px 12px", background: "#FFF4E0", borderRadius: "8px", borderLeft: "3px solid #FF9500" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#FF9500", marginBottom: "2px" }}>Common mistake</p>
              <p style={{ fontSize: "12px", color: "#1D1D1F" }}>{q.why_students_miss}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TopicBlock({ topic, navigate }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Topic header */}
      <div className="flex items-center justify-between gap-2" style={{ marginBottom: "12px" }}>
        <div className="flex items-center gap-2">
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#007AFF", flexShrink: 0 }} />
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1D1D1F" }}>{topic.name}</p>
        </div>
        <button
          onClick={() => navigate(`/ncert/topics/${topic.id}`)}
          style={{ fontSize: "12px", fontWeight: 600, color: "#007AFF", background: "#EEF4FF", padding: "5px 14px", borderRadius: "20px", border: "none", cursor: "pointer", flexShrink: 0 }}
        >
          Study →
        </button>
      </div>

      {/* Questions */}
      {topic.questions?.length > 0 ? (
        <div>
          {topic.questions.map((q, i) => (
            <QuestionCard key={q.id || i} q={q} index={i} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "#86868B", marginLeft: "14px" }}>No questions for this topic.</p>
      )}
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
        <p className="text-[15px] font-semibold" style={{ color: "#1D1D1F" }}>Chapter not found</p>
        <button onClick={() => navigate("/lessons")} className="btn-secondary text-[13px] mt-4">← Back to Learn</button>
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
    <div className="max-w-3xl mx-auto space-y-5" style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      <button
        onClick={() => navigate("/lessons")}
        style={{ fontSize: "13px", color: "#86868B", display: "flex", alignItems: "center", gap: "4px" }}
        className="hover:opacity-70 transition-opacity"
      >
        ‹ Back to Learn
      </button>

      {/* Chapter header */}
      <div style={{ background: "#fff", borderRadius: "18px", padding: "28px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <div className="flex items-start gap-4">
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#EEF4FF", color: "#007AFF", fontSize: "20px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {chapter.number}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "11px", color: "#86868B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
              {chapter.board} · Class {chapter.grade} · {chapter.subject}
            </p>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              {chapter.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span style={{ fontSize: "11px", background: "#F5F5F7", color: "#86868B", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>
                {chapter.subchapters?.length ?? 0} sections
              </span>
              <span style={{ fontSize: "11px", background: "#EEF4FF", color: "#007AFF", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>
                {totalTopics} topics
              </span>
              <span style={{ fontSize: "11px", background: "#E8F9EE", color: "#34C759", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>
                {totalQuestions} questions
              </span>
            </div>
            {chapter.overview && (
              <p style={{ fontSize: "13px", color: "#86868B", marginTop: "12px", lineHeight: 1.6 }}>{chapter.overview}</p>
            )}
          </div>
        </div>
      </div>

      {/* Subchapters — each as a card showing all questions directly */}
      {chapter.subchapters?.map((sc) => (
        <div key={sc.id} style={{ background: "#fff", borderRadius: "18px", padding: "28px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          {/* Section heading */}
          <div className="flex items-center gap-2" style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: "#86868B", background: "#F5F5F7", padding: "2px 8px", borderRadius: "6px" }}>
              {sc.number}
            </span>
            <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#1D1D1F", letterSpacing: "-0.01em" }}>{sc.title}</h2>
          </div>

          {/* Concepts → Topics → Questions */}
          {sc.concepts?.map((concept) => (
            <div key={concept.id} style={{ marginBottom: "8px" }}>
              {/* Concept label */}
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#007AFF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
                {concept.name}
              </p>

              {concept.topics?.map((topic) => (
                <TopicBlock key={topic.id} topic={topic} navigate={navigate} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
