import { useState, useEffect, useCallback } from "react";
import { getPYQTopics, getPYQYears, getPYQs } from "../services/api";

// ── helpers ────────────────────────────────────────────────────────────────
const difficultyColor = {
  easy:   "bg-[#34C759]/15 text-[#1a7a32]",
  medium: "bg-[#FF9500]/15 text-[#a85f00]",
  hard:   "bg-[#FF3B30]/15 text-[#c0221a]",
};

const typeLabel = {
  mcq:              "MCQ",
  pyq:              "Descriptive",
  case_based:       "Case Based",
  assertion_reason: "Assertion Reason",
};

function MarksChip({ marks }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent,#007AFF)]/10 text-[var(--accent,#007AFF)] text-[11px] font-semibold">
      {marks} {marks === 1 ? "mark" : "marks"}
    </span>
  );
}

function YearChip({ year }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-apple-gray6 text-apple-gray text-[11px] font-medium border border-apple-gray5">
      {year}
    </span>
  );
}

// ── single question card ───────────────────────────────────────────────────
function QuestionCard({ q }) {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [revealed, setRevealed] = useState(null); // index of selected MCQ option

  const correctIdx = q.options?.findIndex((o) => o.type === "correct");

  return (
    <div className="card p-0 overflow-hidden">
      {/* header row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-apple-gray6/50 transition-colors"
        onClick={() => { setOpen((x) => !x); if (!open) { setRevealed(null); setShowSolution(false); } }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <YearChip year={q.pyqYear} />
            <MarksChip marks={q.marks} />
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${difficultyColor[q.difficulty] || ""}`}>
              {q.difficulty}
            </span>
            {q.questionType && q.questionType !== "mcq" && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700">
                {typeLabel[q.questionType] || q.questionType}
              </span>
            )}
          </div>
          <p className="text-[13px] text-[var(--label)] leading-relaxed">{q.questionText}</p>
        </div>
        <svg
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`w-4 h-4 text-apple-gray shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 6l5 5 5-5" />
        </svg>
      </div>

      {/* expanded body */}
      {open && (
        <div className="border-t border-apple-gray5 px-4 pb-4 pt-3 space-y-3">

          {/* MCQ options */}
          {q.options?.length > 0 && (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrect = opt.type === "correct";
                const isSelected = revealed === i;
                let bg = "bg-apple-gray6 border-apple-gray5";
                if (revealed !== null && isCorrect) bg = "bg-[#34C759]/15 border-[#34C759]";
                else if (isSelected && !isCorrect)  bg = "bg-[#FF3B30]/15 border-[#FF3B30]";
                return (
                  <button
                    key={i}
                    onClick={() => setRevealed(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-[13px] transition-all ${bg}`}
                  >
                    <span className="font-medium text-apple-gray mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt.text}
                    {revealed !== null && isCorrect && (
                      <span className="ml-2 text-[#34C759] font-semibold">✓</span>
                    )}
                  </button>
                );
              })}
              {revealed === null && (
                <p className="text-[11px] text-apple-gray">Click an option to check your answer</p>
              )}
            </div>
          )}

          {/* solution toggle */}
          {q.solutionSteps?.length > 0 && (
            <div>
              <button
                onClick={() => setShowSolution((x) => !x)}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent,#007AFF)] hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                     strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/>
                </svg>
                {showSolution ? "Hide Solution" : "Show Solution"}
              </button>

              {showSolution && (
                <div className="mt-2 bg-apple-gray6 rounded-xl p-3 space-y-1.5">
                  <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-2">Step-by-step solution</p>
                  {q.solutionSteps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-[11px] font-semibold text-[var(--accent,#007AFF)] shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <p className="text-[12px] text-[var(--label)] leading-relaxed">{step}</p>
                    </div>
                  ))}
                  {q.shortcut && (
                    <div className="mt-2 pt-2 border-t border-apple-gray5 flex gap-2">
                      <span className="text-[11px]">💡</span>
                      <p className="text-[11px] text-[#FF9500] font-medium">{q.shortcut}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
export default function PYQBank() {
  const [topics, setTopics]       = useState([]);
  const [years, setYears]         = useState([]);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal]         = useState(0);

  const [activeTopic,  setActiveTopic]  = useState("");
  const [activeYear,   setActiveYear]   = useState("");
  const [activeDiff,   setActiveDiff]   = useState("");
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [sideLoading,  setSideLoading]  = useState(true);

  const LIMIT = 15;

  // load sidebar data once
  useEffect(() => {
    setSideLoading(true);
    Promise.all([
      getPYQTopics({ subject: "Mathematics", grade: "10" }),
      getPYQYears({ subject: "Mathematics", grade: "10" }),
    ])
      .then(([t, y]) => { setTopics(t.data.topics); setYears(y.data.years); })
      .catch(() => {})
      .finally(() => setSideLoading(false));
  }, []);

  // load questions whenever filters change
  const loadQuestions = useCallback(() => {
    setLoading(true);
    getPYQs({
      subject: "Mathematics",
      grade: "10",
      topic:      activeTopic  || undefined,
      year:       activeYear   || undefined,
      difficulty: activeDiff   || undefined,
      page,
      limit: LIMIT,
    })
      .then(({ data }) => { setQuestions(data.questions); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTopic, activeYear, activeDiff, page]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // reset page when filters change
  const setFilter = (fn) => { fn(); setPage(1); };

  const filtered = search.trim()
    ? questions.filter((q) =>
        q.questionText.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase())
      )
    : questions;

  const pages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* page header */}
      <div>
        <h1 className="text-[22px] font-bold text-[var(--label)]">Previous Year Questions</h1>
        <p className="text-[13px] text-apple-gray mt-1">
          CBSE Class 10 Mathematics — sorted by topic with year, marks & step-by-step solutions
        </p>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── sidebar ───────────────────────────────────────── */}
        <aside className="w-52 shrink-0 space-y-4">

          {/* year filter */}
          <div className="card p-3">
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-2">Year</p>
            <div className="space-y-0.5">
              <button
                onClick={() => setFilter(() => setActiveYear(""))}
                className={`w-full text-left px-2 py-1 rounded-lg text-[12px] transition-colors ${
                  activeYear === "" ? "bg-[var(--accent,#007AFF)] text-white font-medium" : "hover:bg-apple-gray6 text-[var(--label)]"
                }`}
              >
                All years
              </button>
              {sideLoading
                ? [1,2,3].map((i) => <div key={i} className="h-6 bg-apple-gray5 rounded-lg animate-pulse" />)
                : years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setFilter(() => setActiveYear(String(y)))}
                      className={`w-full text-left px-2 py-1 rounded-lg text-[12px] transition-colors ${
                        activeYear === String(y) ? "bg-[var(--accent,#007AFF)] text-white font-medium" : "hover:bg-apple-gray6 text-[var(--label)]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
            </div>
          </div>

          {/* difficulty filter */}
          <div className="card p-3">
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-2">Difficulty</p>
            <div className="space-y-0.5">
              {["", "easy", "medium", "hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter(() => setActiveDiff(d))}
                  className={`w-full text-left px-2 py-1 rounded-lg text-[12px] transition-colors ${
                    activeDiff === d ? "bg-[var(--accent,#007AFF)] text-white font-medium" : "hover:bg-apple-gray6 text-[var(--label)]"
                  }`}
                >
                  {d === "" ? "All levels" : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* topics */}
          <div className="card p-3">
            <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-2">Topics</p>
            <div className="space-y-0.5 max-h-80 overflow-y-auto">
              <button
                onClick={() => setFilter(() => setActiveTopic(""))}
                className={`w-full text-left px-2 py-1 rounded-lg text-[12px] transition-colors ${
                  activeTopic === "" ? "bg-[var(--accent,#007AFF)] text-white font-medium" : "hover:bg-apple-gray6 text-[var(--label)]"
                }`}
              >
                All topics
              </button>
              {sideLoading
                ? [1,2,3,4,5].map((i) => <div key={i} className="h-7 bg-apple-gray5 rounded-lg animate-pulse" />)
                : topics.map((t) => (
                    <button
                      key={t.topic}
                      onClick={() => setFilter(() => setActiveTopic(t.topic))}
                      className={`w-full text-left px-2 py-1 rounded-lg text-[12px] transition-colors ${
                        activeTopic === t.topic ? "bg-[var(--accent,#007AFF)] text-white font-medium" : "hover:bg-apple-gray6 text-[var(--label)]"
                      }`}
                    >
                      <span className="block truncate">{t.topic}</span>
                      <span className={`text-[10px] ${activeTopic === t.topic ? "text-white/70" : "text-apple-gray"}`}>
                        {t.count}q · {t.years.slice(0,3).join(", ")}
                      </span>
                    </button>
                  ))}
            </div>
          </div>
        </aside>

        {/* ── main panel ────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* search + count */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round"
                   className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-apple-gray pointer-events-none">
                <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3"/>
              </svg>
              <input
                type="text"
                placeholder="Search questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-apple-gray5 text-[13px] text-[var(--label)] placeholder:text-apple-gray focus:outline-none focus:border-[var(--accent,#007AFF)]"
              />
            </div>
            {!loading && (
              <span className="text-[12px] text-apple-gray whitespace-nowrap">
                {total} question{total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* active filters chips */}
          {(activeTopic || activeYear || activeDiff) && (
            <div className="flex flex-wrap gap-1.5">
              {activeTopic && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent,#007AFF)]/10 text-[var(--accent,#007AFF)] text-[11px] font-medium">
                  {activeTopic}
                  <button onClick={() => setFilter(() => setActiveTopic(""))} className="hover:opacity-70">×</button>
                </span>
              )}
              {activeYear && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent,#007AFF)]/10 text-[var(--accent,#007AFF)] text-[11px] font-medium">
                  {activeYear}
                  <button onClick={() => setFilter(() => setActiveYear(""))} className="hover:opacity-70">×</button>
                </span>
              )}
              {activeDiff && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent,#007AFF)]/10 text-[var(--accent,#007AFF)] text-[11px] font-medium">
                  {activeDiff}
                  <button onClick={() => setFilter(() => setActiveDiff(""))} className="hover:opacity-70">×</button>
                </span>
              )}
              <button
                onClick={() => { setActiveTopic(""); setActiveYear(""); setActiveDiff(""); setPage(1); }}
                className="text-[11px] text-apple-gray hover:text-[var(--accent,#007AFF)] transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* question list */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 w-12 bg-apple-gray5 rounded-full" />
                    <div className="h-5 w-14 bg-apple-gray5 rounded-full" />
                    <div className="h-5 w-12 bg-apple-gray5 rounded-full" />
                  </div>
                  <div className="h-4 bg-apple-gray5 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-apple-gray5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-[13px] text-apple-gray">No questions found for the selected filters.</p>
              <button
                onClick={() => { setActiveTopic(""); setActiveYear(""); setActiveDiff(""); setSearch(""); setPage(1); }}
                className="mt-3 text-[12px] text-[var(--accent,#007AFF)] hover:opacity-80"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((q) => <QuestionCard key={q._id} q={q} />)}
            </div>
          )}

          {/* pagination */}
          {pages > 1 && !search.trim() && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-[12px] border border-apple-gray5 disabled:opacity-40 hover:bg-apple-gray6 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-[12px] text-apple-gray px-2">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg text-[12px] border border-apple-gray5 disabled:opacity-40 hover:bg-apple-gray6 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
