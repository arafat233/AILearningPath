import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookmarks, toggleBookmark } from "../services/api";

const SUBJECT_COLOR = {
  "Math":           "#007AFF",
  "Science":        "#34C759",
  "English":        "#FF9500",
  "Social Science": "#AF52DE",
  "Hindi":          "#FF3B30",
};

export default function Bookmarks() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [removing, setRemoving]   = useState(null);

  useEffect(() => {
    getBookmarks()
      .then((r) => setQuestions(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    setRemoving(id);
    try {
      await toggleBookmark(id);
      setQuestions((q) => q.filter((x) => x._id !== id));
    } catch {}
    setRemoving(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Bookmarks</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">
          {questions.length} saved question{questions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[32px] mb-3">☆</p>
          <p className="text-[15px] font-semibold text-[var(--label)]">No bookmarks yet</p>
          <p className="text-[13px] text-apple-gray mt-1 mb-5">
            Tap the ☆ Bookmark button after answering a question to save it here.
          </p>
          <button onClick={() => navigate("/practice")} className="btn-primary px-6">
            Go to Practice
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => {
            const color = SUBJECT_COLOR[q.subject] || "#007AFF";
            return (
              <div key={q._id} className="card p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: color + "1a", color }}>
                        {q.subject}
                      </span>
                      {q.conceptTested && (
                        <span className="badge bg-apple-gray6 text-apple-gray">{q.conceptTested}</span>
                      )}
                    </div>
                    <p className="text-[14px] font-medium text-[var(--label)] leading-snug">{q.questionText}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(q._id)}
                    disabled={removing === q._id}
                    className="text-[11px] text-apple-orange hover:opacity-60 transition-opacity shrink-0 mt-0.5 disabled:opacity-40"
                  >
                    ★ Remove
                  </button>
                </div>

                {/* Options preview */}
                {q.options?.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5">
                    {q.options.map((opt, i) => (
                      <div key={i} className="bg-apple-gray6 rounded-apple-lg px-3 py-2 text-[12px] text-[var(--label2)]">
                        <span className="text-apple-gray mr-1.5">{String.fromCharCode(65 + i)}.</span>
                        {opt.text}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => navigate("/practice", { state: { topic: q.conceptTested || q.subject } })}
                  className="text-[12px] font-medium text-apple-blue hover:opacity-70 transition-opacity"
                >
                  Practice this topic →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
