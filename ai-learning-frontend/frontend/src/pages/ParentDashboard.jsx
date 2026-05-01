import { useState, useEffect, useCallback } from "react";
import { getLinkedStudents, getStudentDashboard, linkStudent } from "../services/api";

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
    mastered:   { bg: "#34C759", icon: "✓" },
    practicing: { bg: "#007AFF", icon: "▶" },
    practiced:  { bg: "#007AFF", icon: "▶" },
    struggling: { bg: "#FF3B30", icon: "?" },
  };
  const cfg = configs[type] || configs.practiced;
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
      style={{ background: cfg.bg }}
    >
      {cfg.icon}
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
  if (!subjectMastery?.length) return null;
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

      {/* subject mastery */}
      {data.subjectMastery?.length > 0 && (
        <SubjectMastery subjectMastery={data.subjectMastery} />
      )}

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

      {/* today's activity */}
      {data.recentActivity?.length > 0 && (
        <div className="card p-5">
          <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wide mb-4">Today's Activity</p>
          <div className="space-y-3">
            {data.recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <ActivityIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[var(--label)]">{item.text}</p>
                  <p className="text-[11px] text-apple-gray">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
export default function ParentDashboard() {
  const [students,     setStudents]     = useState([]);
  const [selectedId,   setSelectedId]   = useState(null);
  const [dashboard,    setDashboard]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [dashLoading,  setDashLoading]  = useState(false);
  const [linkInput,    setLinkInput]    = useState("");
  const [linkLoading,  setLinkLoading]  = useState(false);
  const [linkMsg,      setLinkMsg]      = useState("");

  // load linked students — any logged-in user can be a parent/guardian
  useEffect(() => {
    getLinkedStudents()
      .then(({ data }) => {
        setStudents(data);
        if (data.length === 1) setSelectedId(data[0]._id || data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // load dashboard when selection changes
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

  const handleLink = async () => {
    if (!linkInput.trim()) return;
    setLinkLoading(true);
    setLinkMsg("");
    try {
      const { data } = await linkStudent(linkInput.trim());
      const newStudent = data.student;
      setStudents((prev) => [...prev, newStudent]);
      setSelectedId(newStudent._id || newStudent.id);
      setLinkInput("");
      setLinkMsg(`Linked ${newStudent.name} successfully!`);
    } catch (err) {
      setLinkMsg(err.response?.data?.error || "Invalid invite code.");
    } finally { setLinkLoading(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 bg-apple-gray5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map((i) => <div key={i} className="card h-24 animate-pulse bg-apple-gray5" />)}
        </div>
        <div className="card h-40 animate-pulse bg-apple-gray5" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--label)]">Parent Dashboard</h1>
          <p className="text-[13px] text-apple-gray mt-0.5">Read-only view of your child's learning progress</p>
        </div>
        {students.length > 0 && (
          <button
            onClick={() => { setLinkInput(""); setLinkMsg(""); }}
            className="btn-secondary text-[12px]"
          >
            + Add child
          </button>
        )}
      </div>

      {/* link a new child */}
      {(students.length === 0 || linkInput !== "" || linkMsg.includes("success") === false && linkMsg !== "") && (
        <div className="card p-4 space-y-3">
          <p className="text-[13px] font-semibold text-[var(--label)]">
            {students.length === 0 ? "Link your child's account" : "Link another child"}
          </p>
          <p className="text-[12px] text-apple-gray">
            Ask your child to go to <strong>Portal → Share Your Progress</strong> and generate an invite code.
          </p>
          <div className="flex gap-2">
            <input
              className="input flex-1 uppercase tracking-widest text-[13px]"
              placeholder="Enter invite code (e.g. A3F2B1C4)"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value.toUpperCase())}
              maxLength={8}
              onKeyDown={(e) => e.key === "Enter" && handleLink()}
            />
            <button
              onClick={handleLink}
              disabled={linkLoading || !linkInput}
              className="btn-primary"
            >
              {linkLoading ? "Linking…" : "Link"}
            </button>
          </div>
          {linkMsg && (
            <p className={`text-[12px] ${linkMsg.includes("success") ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
              {linkMsg}
            </p>
          )}
        </div>
      )}

      {/* child selector (only shown when >1 child) */}
      {students.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {students.map((s) => {
            const sid = s._id || s.id;
            const isActive = selectedId === sid;
            return (
              <button
                key={sid}
                onClick={() => setSelectedId(sid)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] transition-all ${
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
            );
          })}
        </div>
      )}

      {/* dashboard content */}
      {students.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-apple-gray5 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-apple-gray">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <p className="text-[14px] font-semibold text-[var(--label)] mb-1">No children linked yet</p>
          <p className="text-[12px] text-apple-gray">Enter your child's invite code above to get started.</p>
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
      ) : selectedId ? (
        <div className="card p-8 text-center">
          <p className="text-[13px] text-apple-gray">Unable to load student data. Please try again.</p>
        </div>
      ) : null}
    </div>
  );
}
