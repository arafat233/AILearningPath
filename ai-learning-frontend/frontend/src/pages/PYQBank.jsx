import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPYQTopics, getPYQYears, getPYQs, getPYQDashboard, getPYQChapters, enrichPYQs, buildPYQMock,
  toggleBookmark, getHint, getBookmarks,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useActiveProfile } from "../hooks/useActiveProfile";
import MathText from "../components/MathText";

const SUBJECTS = [
  { id: "Mathematics",      label: "Math" },
  { id: "Science",          label: "Science" },
  { id: "Social Science",   label: "Social" },
  { id: "English",          label: "English" },
  { id: "Hindi",            label: "Hindi" },
];

const TYPE_LABEL = { mcq: "MCQ", case_based: "Case", assertion_reason: "A-R", numeric: "Num", fill_blank: "Fill", free_text: "Long" };
const typeFor = (q) => {
  const m = q.marks || 1;
  if (q.questionType === "mcq") return "MCQ";
  if (m <= 1) return "Short";
  if (m <= 3) return "Short";
  return "Long";
};

const fmtMarks = (m) => `${m} mk`;

export default function PYQBank() {
  const { user } = useAuthStore();
  const profile = useActiveProfile();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("Mathematics");
  const [grade]   = useState(profile?.grade || user?.grade || "10");
  const [selectedYears, setSelectedYears] = useState(() => new Set()); // multi-select
  const [years, setYears]     = useState([]);
  const [topics, setTopics]   = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState(() => new Set()); // multi-select chapter numbers
  const [selectedTopics,   setSelectedTopics]   = useState(() => new Set()); // multi-select topic strings — single source of truth
  const [questions, setQuestions] = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // v2 enriched data
  const [highFreq, setHighFreq] = useState([]);
  // Default to actual number of PYQ years to avoid "N of 15" flash before dashboard responds
  const [yearCount, setYearCount] = useState(0);
  const [solveRates, setSolveRates] = useState({});
  const [solvedMap, setSolvedMap] = useState({});
  const [appearances, setAppearances] = useState({});
  const [topicProgress, setTopicProgress] = useState([]);

  // UI state
  const [sortBy, setSortBy] = useState("year"); // year | marks | frequency | difficulty
  const [savedFilterSets, setSavedFilterSets] = useState(() => JSON.parse(localStorage.getItem("pyq_filter_sets") || "[]"));
  const [openId, setOpenId] = useState(null);
  const [revealed, setRevealed] = useState({}); // {qId: optionIdx}
  const [showSolution, setShowSolution] = useState({}); // {qId: bool}
  const [bookmarked, setBookmarked] = useState({}); // {qId: bool}
  const [hint, setHint] = useState({}); // {qId: text}
  const [hintLoading, setHintLoading] = useState(null);
  const [building, setBuilding] = useState(false);
  const [streak, setStreak] = useState(0);
  const searchRef = useRef(null);

  // Hydrate bookmarked state from server (so ★ survives page refresh)
  useEffect(() => {
    getBookmarks().then((r) => {
      const arr = Array.isArray(r.data) ? r.data : r.data?.data || [];
      const map = {};
      for (const q of arr) map[String(q._id)] = true;
      setBookmarked(map);
    }).catch(() => {});
  }, []);

  // Load years + dashboard
  useEffect(() => {
    getPYQYears({ subject, grade }).then((r) => {
      const ys = r.data?.years || [];
      setYears(ys);
      // Fallback yearCount if dashboard fails or isn't loaded yet
      setYearCount((prev) => prev > 0 ? prev : ys.length);
    }).catch(() => {});
    getPYQDashboard({ subject, grade }).then((r) => {
      const d = r.data?.data || {};
      setHighFreq(d.highFrequency?.topics || []);
      if (d.highFrequency?.yearCount > 0) setYearCount(d.highFrequency.yearCount);
      setTopicProgress(d.progress || []);
      setAppearances(d.appearances || {});
    }).catch(() => {});
  }, [subject, grade]);

  // Reset subject-scoped selections when subject changes
  useEffect(() => {
    setSelectedChapters(new Set());
    setSelectedTopics(new Set());
    setSelectedYears(new Set());
  }, [subject, grade]);

  // Load topics + chapters — year-aware so counts reflect the current year filter
  useEffect(() => {
    const params = { subject, grade };
    if (selectedYears.size > 0) params.years = [...selectedYears].join(",");
    getPYQTopics(params).then((r) => setTopics(r.data?.topics || [])).catch(() => {});
    getPYQChapters(params).then((r) => setChapters(r.data?.chapters || [])).catch(() => {});
  }, [subject, grade, selectedYears]);

  // Load questions — supports multi-year + multi-chapter + multi-topic fallback
  useEffect(() => {
    setLoading(true);
    const params = { subject, grade, page: 1, limit: 50 };
    if (selectedYears.size > 0)    params.years    = [...selectedYears].join(",");
    if (selectedChapters.size > 0) params.chapters = [...selectedChapters].join(",");
    if (selectedTopics.size > 0)   params.topics   = [...selectedTopics].join(",");
    getPYQs(params).then((r) => {
      const list = r.data?.questions || [];
      setQuestions(list);
      setTotal(r.data?.total || list.length);
      // Enrich
      if (list.length > 0) {
        enrichPYQs({ questionIds: list.map((q) => String(q._id)), subject, grade }).then((er) => {
          const d = er.data?.data || {};
          setSolveRates(d.solveRates || {});
          setSolvedMap(d.solved || {});
          if (d.appearances) setAppearances(d.appearances);
        }).catch(() => {});
      }
    }).catch(() => setQuestions([])).finally(() => setLoading(false));
  }, [subject, grade, selectedYears, selectedChapters, selectedTopics]);

  // Repeat-likelihood per question
  const likelihood = (q) => {
    const tApp = appearances[q.topic] || 0;
    if (!q.pyqYear || tApp === 0 || yearCount === 0) return null;
    const topicFactor = tApp / yearCount;
    const yearsSince = new Date().getFullYear() - q.pyqYear;
    const recencyFactor = yearsSince < 2 ? 0.4 : yearsSince < 4 ? 0.7 : 1.0;
    return Math.min(85, Math.max(10, Math.round(topicFactor * recencyFactor * 100)));
  };

  // Filtered / sorted
  const visible = useMemo(() => {
    let list = questions;
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((q) => q.questionText.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s));
    }
    const arr = [...list];
    if (sortBy === "year")       arr.sort((a, b) => (b.pyqYear || 0) - (a.pyqYear || 0));
    if (sortBy === "marks")      arr.sort((a, b) => (b.marks || 0) - (a.marks || 0));
    if (sortBy === "frequency")  arr.sort((a, b) => (appearances[b.topic] || 0) - (appearances[a.topic] || 0));
    if (sortBy === "difficulty") arr.sort((a, b) => (b.difficultyScore || 0) - (a.difficultyScore || 0));
    return arr;
  }, [questions, search, sortBy, appearances]);

  const thisPaper = useMemo(() => {
    const total = visible.length;
    const marks = visible.reduce((s, q) => s + (q.marks || 1), 0);
    const minutes = visible.reduce((s, q) => s + (q.marks || 1) * 3, 0);
    return { total, marks, hours: (minutes / 60).toFixed(1) };
  }, [visible]);

  const handleBuildMock = async () => {
    setBuilding(true);
    try {
      // Pass full filter state — backend builds a balanced sample
      const body = {
        subject, grade, limit: 20,
        years:    [...selectedYears].map((y) => parseInt(y)),
        topics:   [...selectedTopics],
        chapters: [...selectedChapters],
      };
      const r = await buildPYQMock(body);
      const d = r.data?.data || {};
      const ids = (d.questions || []).map((q) => String(q._id));
      navigate("/practice", { state: { retryWrongIds: ids, autoStart: true } });
    } catch {} finally { setBuilding(false); }
  };

  const saveFilterSet = () => {
    const yrLabel = selectedYears.size ? [...selectedYears].sort((a, b) => b - a).join(",") : "";
    const chLabel = selectedChapters.size ? `Ch ${[...selectedChapters].sort((a, b) => a - b).join("/")}` : "";
    const tpLabel = selectedTopics.size ? [...selectedTopics].slice(0, 2).join("/") + (selectedTopics.size > 2 ? "…" : "") : "";
    const def = [SUBJECTS.find((s) => s.id === subject)?.label || subject, tpLabel, chLabel, yrLabel].filter(Boolean).join(" · ");
    const name = prompt("Name this filter set:", def);
    if (!name) return;
    const set = { name, subject, years: [...selectedYears], chapters: [...selectedChapters], topics: [...selectedTopics], sortBy };
    const next = [...savedFilterSets, set];
    setSavedFilterSets(next);
    localStorage.setItem("pyq_filter_sets", JSON.stringify(next));
  };
  const loadFilterSet = (s) => {
    setSubject(s.subject);
    setSelectedYears(new Set(s.years || (s.year ? [s.year] : [])));
    setSelectedChapters(new Set(s.chapters || []));
    setSelectedTopics(new Set(s.topics || (s.topic ? [s.topic] : [])));
    setSortBy(s.sortBy || "year");
  };
  const deleteFilterSet = (i) => {
    const next = savedFilterSets.filter((_, j) => j !== i);
    setSavedFilterSets(next);
    localStorage.setItem("pyq_filter_sets", JSON.stringify(next));
  };

  const handleBookmark = async (qId) => {
    setBookmarked((b) => ({ ...b, [qId]: !b[qId] }));
    try { await toggleBookmark(qId); } catch {}
  };

  const handleHint = async (q) => {
    if (hint[q._id]) return;
    setHintLoading(q._id);
    try { const r = await getHint(q.questionText, q.topic); setHint((h) => ({ ...h, [q._id]: r.data?.hint || "Think step by step…" })); }
    catch { setHint((h) => ({ ...h, [q._id]: "Think step by step." })); }
    finally { setHintLoading(null); }
  };

  const exportPdf = () => window.print();

  // Keyboard search
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "/") { e.preventDefault(); setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 50); }
      if (e.key === "Escape") { setShowSearch(false); setSearch(""); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8E8E93] mb-2">
            PYQ BANK · CBSE Class {grade}
          </p>
          <h1 className="text-[36px] sm:text-[44px] font-bold leading-[1.05] text-[#1c1c1e] tracking-tight">
            <em className="not-italic" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontWeight: 700 }}>
              Past papers,
            </em> ranked by what comes back.
          </h1>
          <p className="text-[13px] text-[#8E8E93] mt-3 max-w-md">
            We've tagged every question by topic and tracked how often it reappears. Start with the high-frequency ones — that's where your marks live.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showSearch ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c3aed]/40 bg-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="text-[12px] outline-none w-40" />
              <button onClick={() => { setShowSearch(false); setSearch(""); }} className="text-[14px] text-[#C7C7CC]">×</button>
            </div>
          ) : (
            <button onClick={() => { setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 50); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5E5EA] text-[12px] font-semibold text-[#3A3A3C] hover:bg-[#F2F2F7]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search
            </button>
          )}
          <button onClick={handleBuildMock} disabled={building || thisPaper.total === 0}
            className="px-4 py-2 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold hover:bg-[#3A3A3C] disabled:opacity-40 disabled:cursor-not-allowed"
            title={thisPaper.total === 0 ? "No questions to build from" : ""}>
            {building ? "Building…" : "Mock paper from filters →"}
          </button>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5] space-y-3">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Year — multi-select. Hidden entirely when no years available for this subject */}
          {years.length > 0 && (
            <div className="flex items-start gap-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mt-1.5">Year</p>
              <div className="flex gap-1 flex-wrap">
                {[...years].sort((a, b) => b - a).slice(0, 8).map((y) => {
                  const on = selectedYears.has(String(y));
                  return (
                    <button key={y} onClick={() => setSelectedYears((s) => {
                      const ns = new Set(s); ns.has(String(y)) ? ns.delete(String(y)) : ns.add(String(y)); return ns;
                    })}
                      className={`px-2.5 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                        on ? "bg-[#1c1c1e] text-white" : "bg-[#F2F2F7] text-[#3A3A3C] hover:bg-[#E5E5EA]"
                      }`}>
                      {y}
                    </button>
                  );
                })}
                {selectedYears.size > 0 && (
                  <button onClick={() => setSelectedYears(new Set())}
                    className="px-2 py-1 text-[10px] text-[#FF3B30] font-bold hover:opacity-70">Clear</button>
                )}
              </div>
            </div>
          )}
          {/* Subject */}
          <div className="flex items-start gap-2">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mt-1.5">Subject</p>
            <div className="flex gap-1 flex-wrap">
              {SUBJECTS.map((s) => (
                <button key={s.id} onClick={() => setSubject(s.id)}
                  className={`px-2.5 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    subject === s.id ? "bg-[#7c3aed]/12 text-[#7c3aed]" : "text-[#8E8E93] hover:bg-[#F2F2F7]"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1" />
          {/* This paper */}
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">This paper</p>
            {thisPaper.total > 0 ? (
              <p className="text-[12px] text-[#1c1c1e] font-semibold">{thisPaper.total} questions · {thisPaper.marks} marks · {thisPaper.hours}h</p>
            ) : (
              <p className="text-[12px] text-[#8E8E93] italic">No questions match these filters</p>
            )}
          </div>
        </div>
        {/* Chapter / Topic — multi-select. Uses chapters when chapter numbers exist, else topics */}
        {(chapters.length > 0 || topics.length > 0) && (
          <div className="flex items-start gap-2 pt-3 border-t border-[#F2F2F7]">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mt-1.5 shrink-0">
              {chapters.length > 0 ? "Chapter" : "Topic"}
            </p>
            <div className="flex gap-1 flex-wrap">
              {chapters.length > 0 ? (
                chapters.map((c) => {
                  const on = selectedChapters.has(c.chapterNumber);
                  return (
                    <button key={c.chapterNumber} onClick={() => setSelectedChapters((s) => {
                      const ns = new Set(s); ns.has(c.chapterNumber) ? ns.delete(c.chapterNumber) : ns.add(c.chapterNumber); return ns;
                    })}
                      title={c.title}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        on ? "bg-[#7c3aed] text-white" : "bg-[#7c3aed]/8 text-[#7c3aed] hover:bg-[#7c3aed]/15"
                      }`}>
                      Ch {c.chapterNumber} <span className={`text-[9px] ${on ? "opacity-80" : "opacity-60"}`}>· {c.count}</span>
                    </button>
                  );
                })
              ) : (
                topics.map((t) => {
                  const on = selectedTopics.has(t.topic);
                  return (
                    <button key={t.topic} onClick={() => setSelectedTopics((s) => {
                      const ns = new Set(s); ns.has(t.topic) ? ns.delete(t.topic) : ns.add(t.topic); return ns;
                    })}
                      title={`${t.count} questions across ${t.years.length} years`}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        on ? "bg-[#7c3aed] text-white" : "bg-[#7c3aed]/8 text-[#7c3aed] hover:bg-[#7c3aed]/15"
                      }`}>
                      {t.topic} <span className={`text-[9px] ${on ? "opacity-80" : "opacity-60"}`}>· {t.count}</span>
                    </button>
                  );
                })
              )}
              {(selectedChapters.size > 0 || selectedTopics.size > 0) && (
                <button onClick={() => { setSelectedChapters(new Set()); setSelectedTopics(new Set()); }}
                  className="px-2 py-1 text-[10px] text-[#FF3B30] font-bold hover:opacity-70">Clear</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sort + filter sets row */}
      <div className="flex items-center gap-2 flex-wrap text-[11px]">
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#C7C7CC]">Sort</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2.5 py-1 rounded-full border border-[#E5E5EA] bg-white text-[#3A3A3C] outline-none">
          <option value="year">Most recent year</option>
          <option value="marks">Highest marks</option>
          <option value="frequency">Most frequent topic</option>
          <option value="difficulty">Hardest first</option>
        </select>
        {[...selectedTopics].map((t) => (
          <button key={t} onClick={() => setSelectedTopics((s) => { const ns = new Set(s); ns.delete(t); return ns; })}
            className="px-2.5 py-1 rounded-full bg-[#7c3aed]/12 text-[#7c3aed] font-semibold">
            {t} ×
          </button>
        ))}
        <button onClick={saveFilterSet} className="text-[#7c3aed] font-semibold hover:opacity-70">+ Save filter set</button>
        {savedFilterSets.length > 0 && (
          <div className="flex gap-1">
            {savedFilterSets.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-[#F2F2F7] text-[#3A3A3C] font-semibold">
                <button onClick={() => loadFilterSet(s)}>{s.name}</button>
                <button onClick={() => deleteFilterSet(i)} className="text-[#C7C7CC] hover:text-[#FF3B30]">×</button>
              </span>
            ))}
          </div>
        )}
        <button onClick={exportPdf} className="ml-auto px-2.5 py-1 rounded-full border border-[#E5E5EA] font-semibold text-[#3A3A3C] hover:bg-[#F2F2F7]">🖨 Export PDF</button>
      </div>

      {/* ── HIGH FREQUENCY banner (mockup) ── */}
      {highFreq.length > 0 ? (
        <div className="rounded-3xl px-8 py-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7"
          style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}>
          {highFreq.slice(0, 4).map((t) => {
            const pct = Math.round((t.yearsAppeared / yearCount) * 100);
            return (
              <button key={t.topic} onClick={() => setSelectedTopics((s) => {
                const ns = new Set(s); ns.has(t.topic) ? ns.delete(t.topic) : ns.add(t.topic); return ns;
              })} className="text-left group">
                <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-[#1c1c1e]/55 mb-2.5">HIGH FREQUENCY</p>
                <p className="text-[34px] sm:text-[36px] font-bold text-[#1c1c1e] leading-[0.95] group-hover:opacity-80 transition-opacity"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700 }}>
                  {t.topic}
                </p>
                <p className="text-[12px] text-[#1c1c1e]/65 mt-2.5 leading-snug">
                  appeared in <span className="font-bold text-[#1c1c1e]">{t.yearsAppeared} of last {yearCount}</span> papers
                </p>
                <div className="h-[2px] mt-3 rounded-full bg-white/40 overflow-hidden max-w-[90%]">
                  <div className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #f472b6, #fb923c)" }} />
                </div>
              </button>
            );
          })}
        </div>
      ) : !loading && (
        // Empty state — subject-specific, friendly, with a way out
        <div className="rounded-3xl px-8 py-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
          style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}>
          <div className="text-[64px] leading-none">📚</div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-[#1c1c1e]/55 mb-2">{subject.toUpperCase()} · PYQ BANK</p>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#1c1c1e] leading-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700 }}>
              No past papers yet for {SUBJECTS.find((s) => s.id === subject)?.label || subject}.
            </h2>
            <p className="text-[13px] text-[#1c1c1e]/70 mt-2 max-w-md">
              We're tagging questions year-by-year. <span className="font-bold">Mathematics</span> is fully indexed — start there while we finish the rest.
            </p>
          </div>
          {subject !== "Mathematics" && (
            <button onClick={() => setSubject("Mathematics")}
              className="px-5 py-2.5 rounded-full bg-[#1c1c1e] text-white text-[13px] font-bold whitespace-nowrap hover:bg-[#3A3A3C]">
              Switch to Math →
            </button>
          )}
        </div>
      )}

      {/* ── Question table ── */}
      <div className="bg-white rounded-2xl border border-[#f0f0f5] overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_70px_60px_120px_90px] gap-3 px-5 py-2 border-b border-[#F2F2F7] text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">
          <span>Q</span>
          <span>Question · Topic</span>
          <span>Type</span>
          <span>Marks</span>
          <span>Frequency</span>
          <span className="text-right">Status</span>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-[#E5E5EA] border-t-[#7c3aed] rounded-full animate-spin mx-auto" /></div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-[13px] text-[#8E8E93]">No questions for these filters.</p>
            <button onClick={() => { setSelectedYears(new Set()); setSelectedChapters(new Set()); setSelectedTopics(new Set()); setSearch(""); }}
              className="px-4 py-2 rounded-full bg-[#7c3aed] text-white text-[12px] font-bold hover:bg-[#6d28d9]">
              Reset filters
            </button>
          </div>
        ) : (
          visible.map((q, i) => {
            const qid = String(q._id);
            const lk = likelihood(q);
            const sr = solveRates[qid];
            const status = solvedMap[qid];
            const tApp = appearances[q.topic] || 0;
            const isOpen = openId === qid;
            return (
              <div key={qid} className="border-b border-[#F2F2F7] last:border-0">
                <div className="grid grid-cols-[40px_1fr_70px_60px_120px_90px] gap-3 px-5 py-4 items-center hover:bg-[#FAFAFB] transition-colors">
                  <span className="text-[13px] font-bold text-[#8E8E93]">Q{i + 1}</span>
                  <button onClick={() => setOpenId(isOpen ? null : qid)} className="text-left min-w-0">
                    <p className="text-[14px] text-[#1c1c1e] leading-snug truncate">
                      <MathText text={q.questionText} />
                    </p>
                    <p className="text-[11px] text-[#8E8E93] mt-1 flex flex-wrap items-center gap-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#7c3aed]/10 text-[#7c3aed] font-semibold">{q.topic}</span>
                      <span>· {q.pyqYear}</span>
                      {lk != null && <span>· <span className={lk >= 50 ? "text-[#7c3aed] font-semibold" : ""}>{lk}% likely {new Date().getFullYear()}</span></span>}
                      {sr != null && <span>· <span className={sr < 50 ? "text-[#FF3B30] font-semibold" : "text-[#34C759] font-semibold"}>{sr}% solve rate</span></span>}
                    </p>
                  </button>
                  <span className="text-[11px] text-[#8E8E93]">{typeFor(q)}</span>
                  <span className="text-[11px] text-[#1c1c1e] font-semibold">{fmtMarks(q.marks || 1)}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7c3aed]" style={{ width: `${(tApp / yearCount) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#8E8E93] tabular-nums">{tApp}/{yearCount}</span>
                  </div>
                  <div className="text-right">
                    {status?.correct ? (
                      <span className="text-[11px] text-[#34C759] font-semibold">✓ done</span>
                    ) : status?.attempted ? (
                      <button onClick={() => setOpenId(qid)} className="text-[11px] text-[#FF9500] font-semibold">retry →</button>
                    ) : (
                      <button onClick={() => setOpenId(qid)} className="text-[11px] text-[#7c3aed] font-semibold">solve →</button>
                    )}
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-5 pb-4 space-y-3 bg-[#FAFAFB]">
                    {/* MCQ options */}
                    {q.options?.length > 0 && (
                      <div className="space-y-1.5">
                        {q.options.map((opt, oi) => {
                          const correct = opt.type === "correct";
                          const picked = revealed[qid] === oi;
                          const showResult = revealed[qid] !== undefined;
                          let style = "border-[#E5E5EA] bg-white";
                          if (showResult && correct) style = "border-[#34C759] bg-[#34C759]/8";
                          else if (showResult && picked && !correct) style = "border-[#FF3B30] bg-[#FF3B30]/8";
                          return (
                            <button key={oi} onClick={() => {
                              setRevealed((r) => ({ ...r, [qid]: oi }));
                              if (correct) {
                                setStreak((s) => s + 1);
                                // Optimistically mark this question as solved (Status column updates instantly)
                                setSolvedMap((m) => ({ ...m, [qid]: { attempted: true, correct: true } }));
                              } else {
                                setStreak(0);
                                setSolvedMap((m) => ({ ...m, [qid]: { attempted: true, correct: m[qid]?.correct || false } }));
                              }
                            }} disabled={showResult}
                              className={`w-full text-left px-3 py-2 rounded-lg border text-[13px] ${style}`}>
                              <span className="font-semibold text-[#8E8E93] mr-2">{String.fromCharCode(65 + oi)}.</span>
                              <MathText text={opt.text} />
                              {showResult && correct && <span className="ml-2 text-[#34C759] font-bold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {/* Hint + solution + bookmark + share */}
                    <div className="flex items-center gap-3 flex-wrap text-[11px]">
                      <button onClick={() => handleHint(q)} disabled={hintLoading === qid || hint[qid]}
                        className="font-semibold text-[#FF9500] hover:opacity-70 disabled:opacity-40">
                        {hintLoading === qid ? "Loading…" : hint[qid] ? "Hint shown" : "💡 Get hint"}
                      </button>
                      <button onClick={() => setShowSolution((s) => ({ ...s, [qid]: !s[qid] }))}
                        className="font-semibold text-[#007AFF]">
                        {showSolution[qid] ? "Hide solution" : "Show solution"}
                      </button>
                      <button onClick={() => handleBookmark(qid)} className={`font-semibold ${bookmarked[qid] ? "text-[#FF9500]" : "text-[#8E8E93] hover:text-[#FF9500]"}`}>
                        {bookmarked[qid] ? "★ Bookmarked" : "☆ Bookmark"}
                      </button>
                      <button onClick={() => navigator.clipboard.writeText(`${window.location.href}#q-${qid}`)}
                        className="font-semibold text-[#8E8E93] hover:text-[#007AFF]">↗ Share</button>
                    </div>
                    {hint[qid] && (
                      <div className="bg-[#FF9500]/8 border border-[#FF9500]/20 rounded-lg p-3 text-[12px] text-[#3A3A3C]">
                        <span className="font-bold text-[#FF9500]">Hint: </span>{hint[qid]}
                      </div>
                    )}
                    {showSolution[qid] && q.solutionSteps?.length > 0 && (
                      <ol className="bg-white border border-[#E5E5EA] rounded-lg p-3 space-y-1 text-[12px] list-decimal list-inside">
                        {q.solutionSteps.map((s, j) => <li key={j} className="text-[#3A3A3C]"><MathText text={s} /></li>)}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Topic progress strip ── */}
      {topicProgress.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mb-3">Your progress per topic</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topicProgress.slice(0, 8).map((tp) => {
              const isSelected = selectedTopics.has(tp.topic);
              return (
                <button
                  key={tp.topic}
                  onClick={() => setSelectedTopics((s) => {
                    const ns = new Set(s); ns.has(tp.topic) ? ns.delete(tp.topic) : ns.add(tp.topic); return ns;
                  })}
                  className={`text-left p-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "bg-[#34C759]/10 border-[#34C759]/40"
                      : "bg-[#FAFAFB] border-[#f0f0f5] hover:bg-white hover:border-[#E5E5EA]"
                  }`}
                >
                  <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{tp.topic}</p>
                  <p className="text-[10px] text-[#8E8E93] mt-0.5">{tp.solved}/{tp.total} solved</p>
                  <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-[#34C759] transition-all duration-500" style={{ width: `${(tp.solved / Math.max(tp.total, 1)) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Streak indicator */}
      {streak >= 2 && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-[#FF9500] text-white text-[12px] font-bold shadow-lg">
          🔥 {streak} in a row
        </div>
      )}
    </div>
  );
}
