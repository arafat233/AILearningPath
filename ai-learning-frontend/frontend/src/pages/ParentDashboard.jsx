import { useState, useEffect, useCallback, useRef } from "react";
import { getLinkedStudents, getStudentDashboard, searchStudents, linkStudentDirect, removeLinkedStudent } from "../services/api";

// ── helpers ────────────────────────────────────────────────────────────────
const daysSince = (iso) => {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso)) / 86400000);
};

const hoursMinutes = (totalMin) => {
  if (!totalMin) return "0m";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const gradeColor = { A1: "#AF52DE", A2: "#AF52DE", B1: "#007AFF", B2: "#007AFF", C1: "#FF9500", C2: "#FF9500", D: "#FF3B30" };

// ── activity icon ──────────────────────────────────────────────────────────
function ActivityIcon({ type }) {
  const configs = {
    mastered:   { bg: "#34C759", label: "✓" },
    practiced:  { bg: "#007AFF", label: "▶" },
    practicing: { bg: "#007AFF", label: "▶" },
    struggling: { bg: "#FF3B30", label: "?" },
    doubt:      { bg: "#FF3B30", label: "?" },
    lesson:     { bg: "#5856D6", label: "📖" },
    exam:       { bg: "#AF52DE", label: "★" },
    competition:{ bg: "#FF9500", label: "⚡" },
  };
  const cfg = configs[type] || configs.practiced;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
      style={{ background: cfg.bg }}
    >
      {cfg.label}
    </div>
  );
}

// ── weekly bar chart ───────────────────────────────────────────────────────
function WeeklyChart({ weeklyPractice, totalWeeklyMinutes }) {
  const maxMin = Math.max(...weeklyPractice.map((d) => d.minutes), 1);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide">Weekly Practice</p>
        <p className="text-[13px] font-semibold text-[var(--label)]">
          <span className="text-[var(--accent,#007AFF)] font-bold">{hoursMinutes(totalWeeklyMinutes)}</span>
          <span className="text-apple-gray font-normal"> this week</span>
        </p>
      </div>
      <div className="flex items-end gap-1 h-16">
        {weeklyPractice.map((d) => {
          const pct = maxMin > 0 ? (d.minutes / maxMin) * 100 : 0;
          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
              {d.minutes > 0 && (
                <span className="text-[10px] font-medium" style={{ color: d.isToday ? "var(--accent,#007AFF)" : "transparent" }}>
                  {d.minutes}m
                </span>
              )}
              <div className="w-full flex flex-col justify-end" style={{ height: 40 }}>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: pct > 0 ? `${Math.max(pct, 8)}%` : "2px",
                    background: d.isToday
                      ? "var(--accent,#007AFF)"
                      : d.minutes > 0
                      ? "#CBD5E1"
                      : "#E2E8F0",
                  }}
                />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: d.isToday ? "var(--accent,#007AFF)" : "#94A3B8" }}
              >
                {d.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── subject mastery bars ───────────────────────────────────────────────────
function SubjectMastery({ subjectMastery }) {
  if (!subjectMastery?.length) return null; // fallback only
  return (
    <div className="card p-5">
      <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-4">Subject Mastery</p>
      <div className="space-y-3">
        {subjectMastery.map((s) => (
          <div key={s.subject} className="flex items-center gap-3">
            <span className="text-[13px] text-[var(--label)] w-28 shrink-0">{s.subject}</span>
            <div className="flex-1 bg-apple-gray5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.accuracy}%`, background: s.color }}
              />
            </div>
            <span className="text-[12px] font-semibold text-[var(--label)] w-8 text-right">
              {s.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main dashboard ─────────────────────────────────────────────────────────
function StudentView({ data }) {
  const joined = daysSince(data.student?.createdAt);

  return (
    <div className="space-y-4">
      {/* child header */}
      <div className="card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent,#007AFF)] flex items-center justify-center shrink-0">
          <span className="text-white text-[18px] font-bold">
            {data.student.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[17px] font-bold text-[var(--label)]">{data.student.name}</h2>
            {data.isLearningNow && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#34C759]/15 text-[#1a7a32] text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                LEARNING NOW
              </span>
            )}
          </div>
          <p className="text-[13px] text-apple-gray mt-0.5">
            Class {data.student.grade} · CBSE
            {joined !== null && ` · linked ${joined} day${joined !== 1 ? "s" : ""} ago`}
          </p>
        </div>
      </div>

      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-[10px] font-semibold text-apple-gray uppercase tracking-wide mb-1">Accuracy</p>
          <p className="text-[28px] font-bold" style={{ color: "var(--accent,#007AFF)" }}>
            {data.accuracy}<span className="text-[18px]">%</span>
          </p>
          <p className="text-[11px] text-apple-gray mt-1">
            {data.totalAttempts} questions answered
          </p>
        </div>

        <div className="card p-4">
          <p className="text-[10px] font-semibold text-apple-gray uppercase tracking-wide mb-1">Streak</p>
          <p className="text-[28px] font-bold text-[#FF9500]">
            {data.streak.current}<span className="text-[18px]">d</span>
          </p>
          <p className="text-[11px] text-apple-gray mt-1">
            {data.streak.current >= data.streak.longest
              ? "▲ personal best"
              : `best: ${data.streak.longest}d`}
          </p>
        </div>

        <div className="card p-4">
          <p className="text-[10px] font-semibold text-apple-gray uppercase tracking-wide mb-1">Predicted</p>
          <p
            className="text-[28px] font-bold"
            style={{ color: gradeColor[data.predicted?.grade] || "#007AFF" }}
          >
            {data.predicted?.grade}
          </p>
          <p className="text-[11px] text-apple-gray mt-1">
            ▲ {data.predicted?.range} / 100
          </p>
        </div>
      </div>

      {/* weekly chart */}
      {data.weeklyPractice?.length > 0 && (
        <WeeklyChart weeklyPractice={data.weeklyPractice} totalWeeklyMinutes={data.totalWeeklyMinutes} />
      )}

      {/* subject mastery — always shown, 0% when no practice data yet */}
      <SubjectMastery subjectMastery={data.subjectMastery} />

      {/* weak topics + mastered this week */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#FF3B30]">Weak Topics</p>
            <span className="text-[12px] font-semibold text-apple-gray">{data.weakTopics?.length || 0}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.weakTopics?.length > 0 ? (
              data.weakTopics.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#FF3B30]/10 text-[#FF3B30]"
                >
                  {t}
                </span>
              ))
            ) : (
              <p className="text-[12px] text-apple-gray">No weak topics yet</p>
            )}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#34C759]">Mastered This Week</p>
            <span className="text-[12px] font-semibold text-apple-gray">{data.masteredThisWeek?.length || 0}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.masteredThisWeek?.length > 0 ? (
              data.masteredThisWeek.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#34C759]/10 text-[#1a7a32]"
                >
                  {t}
                </span>
              ))
            ) : (
              <p className="text-[12px] text-apple-gray">Keep practicing to master topics</p>
            )}
          </div>
        </div>
      </div>

      {/* today's activity — always shown */}
      <div className="card p-5">
        <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-4">Today's Activity</p>
        {data.recentActivity?.length > 0 ? (
          <div className="divide-y divide-apple-gray5">
            {data.recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <ActivityIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--label)]">{item.text}</p>
                  <p className="text-[11px] text-apple-gray mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-[13px] text-apple-gray">No activity in the last 48 hours</p>
            <p className="text-[11px] text-apple-gray mt-1">Activity will appear here once your child starts practicing</p>
          </div>
        )}
      </div>

      {/* privacy note */}
      <div className="flex items-center gap-1.5 justify-center py-2">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-apple-gray">
          <rect x="3" y="7" width="10" height="7" rx="1.5"/>
          <path d="M5 7V5a3 3 0 016 0v2"/>
        </svg>
        <p className="text-[11px] text-apple-gray">
          Read-only view · private chats and notes are never shared
        </p>
      </div>
    </div>
  );
}

// ── page root ──────────────────────────────────────────────────────────────
// ── search panel ──────────────────────────────────────────────────────────
function AddChildPanel({ onAdded }) {
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [adding,      setAdding]      = useState(null); // id being added
  const debounceRef = useRef(null);

  const handleSearch = (val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    debounceRef.current = setTimeout(() => {
      searchStudents(val.trim())
        .then(({ data }) => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 350);
  };

  const handleAdd = async (student) => {
    setAdding(student.id);
    try {
      await linkStudentDirect(student.id);
      onAdded(student);
      setQuery("");
      setResults([]);
    } catch {
      // already linked or error — still navigate
      onAdded(student);
    } finally { setAdding(null); }
  };

  return (
    <div className="card p-5 space-y-3">
      <div>
        <p className="text-[14px] font-semibold text-[var(--label)]">Find your child</p>
        <p className="text-[12px] text-apple-gray mt-0.5">Type their name to search — no code needed</p>
      </div>

      <div className="relative">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round"
             className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-apple-gray pointer-events-none">
          <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3"/>
        </svg>
        <input
          autoFocus
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-apple-gray6 border border-apple-gray5 text-[13px] text-[var(--label)] placeholder:text-apple-gray focus:outline-none focus:border-[var(--accent,#007AFF)] transition-colors"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-[var(--accent,#007AFF)] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* results */}
      {results.length > 0 && (
        <div className="space-y-1.5">
          {results.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-apple-gray6 border border-apple-gray5">
              <div className="w-8 h-8 rounded-full bg-[var(--accent,#007AFF)] flex items-center justify-center shrink-0">
                <span className="text-white text-[12px] font-bold">{s.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[var(--label)]">{s.name}</p>
                <p className="text-[11px] text-apple-gray">Class {s.grade} · {s.subject}</p>
              </div>
              <button
                onClick={() => handleAdd(s)}
                disabled={adding === s.id}
                className="btn-primary text-[12px] px-3 py-1.5"
              >
                {adding === s.id ? "Adding…" : "Add"}
              </button>
            </div>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && !searching && results.length === 0 && (
        <p className="text-[12px] text-apple-gray text-center py-2">No students found for "{query}"</p>
      )}
    </div>
  );
}

// ── page root ──────────────────────────────────────────────────────────────
export default function ParentDashboard() {
  const [students,    setStudents]    = useState([]);
  const [selectedId,  setSelectedId]  = useState(null);
  const [dashboard,   setDashboard]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [dashLoading, setDashLoading] = useState(false);
  const [showSearch,  setShowSearch]  = useState(false);

  // load already-linked students on mount
  useEffect(() => {
    getLinkedStudents()
      .then(({ data }) => {
        setStudents(data);
        if (data.length > 0) setSelectedId(data[0]._id || data[0].id);
        if (data.length === 0) setShowSearch(true);
      })
      .catch(() => { setShowSearch(true); })
      .finally(() => setLoading(false));
  }, []);

  // load dashboard whenever selected child changes
  const loadDashboard = useCallback((id) => {
    if (!id) return;
    setDashLoading(true);
    setDashboard(null);
    getStudentDashboard(id)
      .then(({ data }) => setDashboard(data))
      .catch(() => setDashboard(null))
      .finally(() => setDashLoading(false));
  }, []);

  useEffect(() => { loadDashboard(selectedId); }, [selectedId, loadDashboard]);

  const handleAdded = (student) => {
    const id = student.id || student._id;
    setStudents((prev) => {
      const already = prev.find((s) => (s._id || s.id) === id);
      return already ? prev : [...prev, student];
    });
    setSelectedId(id);
    setShowSearch(false);
  };

  const handleRemove = async (sid) => {
    await removeLinkedStudent(sid).catch(() => {});
    setStudents((prev) => prev.filter((s) => (s._id || s.id) !== sid));
    if (selectedId === sid) {
      const remaining = students.filter((s) => (s._id || s.id) !== sid);
      setSelectedId(remaining[0]?._id || remaining[0]?.id || null);
      setDashboard(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-48 bg-apple-gray5 rounded-xl animate-pulse" />
        <div className="card h-20 animate-pulse bg-apple-gray5" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map((i) => <div key={i} className="card h-24 animate-pulse bg-apple-gray5" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--label)]">Parent Dashboard</h1>
          <p className="text-[13px] text-apple-gray mt-0.5">Read-only view of your child's learning progress</p>
        </div>
        {students.length > 0 && !showSearch && (
          <button onClick={() => setShowSearch(true)} className="btn-secondary text-[12px]">
            + Add child
          </button>
        )}
      </div>

      {/* search panel */}
      {showSearch && (
        <AddChildPanel onAdded={handleAdded} />
      )}
      {showSearch && students.length > 0 && (
        <button onClick={() => setShowSearch(false)} className="text-[12px] text-apple-gray hover:text-[var(--label)] transition-colors">
          ← Back to dashboard
        </button>
      )}

      {/* child tabs — shown when ≥1 child tracked */}
      {!showSearch && students.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {students.map((s) => {
            const sid = s._id || s.id;
            const isActive = selectedId === sid;
            return (
              <div key={sid} className="relative group">
                <button
                  onClick={() => setSelectedId(sid)}
                  className={`flex items-center gap-2 pl-3 pr-7 py-2 rounded-xl border text-[13px] transition-all ${
                    isActive
                      ? "border-[var(--accent,#007AFF)] bg-[var(--accent,#007AFF)]/8 text-[var(--accent,#007AFF)] font-semibold"
                      : "border-apple-gray5 bg-white text-[var(--label)] hover:border-apple-gray4"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: isActive ? "var(--accent,#007AFF)" : "#94A3B8" }}
                  >
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  {s.name}
                  <span className={`text-[11px] ${isActive ? "text-[var(--accent,#007AFF)]/70" : "text-apple-gray"}`}>
                    Gr.{s.grade}
                  </span>
                </button>
                {/* remove × */}
                <button
                  onClick={() => handleRemove(sid)}
                  title="Remove"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-apple-gray hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 text-[10px] transition-colors"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* dashboard content */}
      {!showSearch && (
        students.length === 0 ? (
          <div className="card p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-apple-gray6 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-apple-gray">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[var(--label)]">No children added yet</p>
            <p className="text-[13px] text-apple-gray">Search for your child by name to get started.</p>
            <button onClick={() => setShowSearch(true)} className="btn-primary mx-auto">
              Find my child
            </button>
          </div>
        ) : dashLoading ? (
          <div className="space-y-4">
            <div className="card h-20 animate-pulse bg-apple-gray5" />
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map((i) => <div key={i} className="card h-24 animate-pulse bg-apple-gray5" />)}
            </div>
            <div className="card h-36 animate-pulse bg-apple-gray5" />
            <div className="card h-48 animate-pulse bg-apple-gray5" />
          </div>
        ) : dashboard ? (
          <StudentView data={dashboard} />
        ) : null
      )}
    </div>
  );
}
