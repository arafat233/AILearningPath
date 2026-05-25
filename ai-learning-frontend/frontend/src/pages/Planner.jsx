import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPlan, listStudyPlans, createStudyPlan, activatePlan, updatePlanSettings,
  deleteStudyPlan, reschedulePlan, smartRebalancePlan, generateShareToken, markDayComplete,
  saveTopicOrder, saveDayNote, getRevisionDue, markRevised,
  getPlannerClassStats, sendPlannerDigestNow,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useActiveProfile } from "../hooks/useActiveProfile";

/* ─── constants ─────────────────────────────────────────── */
const SUBJECT_COLORS = {
  Math:             { bg: "#7c3aed33", text: "#7c3aed", solid: "#7c3aed" },
  Science:          { bg: "#34C75933", text: "#34C759", solid: "#34C759" },
  English:          { bg: "#FF950033", text: "#FF9500", solid: "#FF9500" },
  "Social Science": { bg: "#AF52DE33", text: "#AF52DE", solid: "#AF52DE" },
  Social:           { bg: "#AF52DE33", text: "#AF52DE", solid: "#AF52DE" },
  Hindi:            { bg: "#FF3B3033", text: "#FF3B30", solid: "#FF3B30" },
  default:          { bg: "#8E8E9333", text: "#8E8E93", solid: "#8E8E93" },
};

// Map a topic string to its subject by keyword heuristics
function topicToSubject(t = "") {
  const s = t.toLowerCase();
  if (/math|polynomi|quadrati|trig|geometr|algebra|statisti|probabil|number|fraction|integer|equation/.test(s)) return "Math";
  if (/scien|electr|chem|biolog|physic|reflect|light|reaction|life|magnet|energy/.test(s)) return "Science";
  if (/english|essay|tense|grammar|comprehens|reading|writing|story/.test(s)) return "English";
  if (/social|civic|geogra|histor|economi|polit|nationalism|federali|democra|globali/.test(s)) return "Social Science";
  if (/hindi|vyakar|kavita|patra|nibandh/.test(s)) return "Hindi";
  return "default";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS_FULL = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const fmtDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  const day = x.getDay() || 7; // Mon=1..Sun=7
  x.setDate(x.getDate() - (day - 1));
  return x;
};

const daysUntil = (target) => {
  if (!target) return null;
  const t = new Date(target); t.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((t - today) / 86400000);
};

const weekKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/* ─── Sub-components ──────────────────────────────────── */
function SubjectPill({ topic, completed, pinned, onToggle, onPin, fromDay, onDragStart, onDragEnd, isDragging, draggable = true }) {
  const subj = topicToSubject(topic);
  const c = SUBJECT_COLORS[subj] || SUBJECT_COLORS.default;
  return (
    <div className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium cursor-grab active:cursor-grabbing transition-all ${completed ? "opacity-50 line-through" : ""} ${isDragging ? "opacity-30 scale-95" : ""}`}
      draggable={draggable && !completed}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ topic, fromDay }));
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.({ topic, fromDay });
      }}
      onDragEnd={onDragEnd}
      style={{ background: c.bg, color: c.text }}>
      {pinned && <span className="text-[8px]" title="Pinned (won't move on rebalance)">📌</span>}
      <span className="truncate flex-1">{topic}</span>
      {completed && <span className="text-[10px]">✓</span>}
      <button onClick={(e) => { e.stopPropagation(); onToggle?.(); }} title={completed ? "Unmark" : "Mark done"} className="opacity-0 group-hover:opacity-100 text-[9px]">
        {completed ? "↻" : "✓"}
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPin?.(); }} title={pinned ? "Unpin" : "Pin"} className="opacity-0 group-hover:opacity-100 text-[9px]">
        {pinned ? "📍" : "📌"}
      </button>
    </div>
  );
}

function MiniWeekBars({ dailyPlan }) {
  const start = startOfWeek(new Date());
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const slot = (dailyPlan || []).find((s) => s.date && sameDay(new Date(s.date), d));
    return {
      date: d,
      isFuture: d > new Date(),
      completed: slot?.completed,
      hours: slot?.estimatedHours || 0,
    };
  });
  return (
    <div className="flex gap-1.5">
      {days.map((d, i) => (
        <div key={i} className="flex-1 h-12 rounded-md transition-all"
          title={`${MONTHS[d.date.getMonth()]} ${d.date.getDate()}: ${d.hours}h`}
          style={{
            background: d.completed
              ? "linear-gradient(135deg, #c8b4f0, #f0a4cc, #fad4a4)"
              : d.isFuture ? "#F2EBFE" : "#E5E5EA",
            opacity: d.completed ? 1 : d.isFuture ? 0.6 : 0.4,
          }} />
      ))}
    </div>
  );
}

function PlanCreateModal({ onCreate, onClose, defaultSubjects, defaultGrade, defaultExamDate }) {
  const [name, setName] = useState("Board prep");
  const [subjects, setSubjects] = useState(defaultSubjects?.length ? defaultSubjects : ["Math","Science","English","Social Science","Hindi"]);
  const [grade, setGrade] = useState(defaultGrade || "10");
  const [examDate, setExamDate] = useState(defaultExamDate ? new Date(defaultExamDate).toISOString().slice(0,10) : "");
  const [goal, setGoal] = useState("distinction");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!examDate || !subjects.length) return;
    setSubmitting(true);
    try {
      await onCreate({ name, subjects, grade, examDate, goal, hoursPerDay });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold text-[#1c1c1e] mb-4">Create study plan</h3>
        <label className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">Plan name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-[#E5E5EA] text-[14px]" />
        <label className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">Exam date</label>
        <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-[#E5E5EA] text-[14px]" />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E5E5EA] text-[12px]">
              <option value="pass">Pass</option><option value="distinction">75%+</option><option value="top">90%+</option><option value="scholarship">Scholarship</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">Hours / day</label>
            <select value={hoursPerDay} onChange={(e) => setHoursPerDay(parseFloat(e.target.value))} className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E5E5EA] text-[12px]">
              {[1, 1.5, 2, 2.5, 3, 4, 5].map((h) => <option key={h} value={h}>{h}h</option>)}
            </select>
          </div>
        </div>
        <label className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">Subjects</label>
        <div className="grid grid-cols-2 gap-1.5 mt-1 mb-4">
          {["Math","Science","English","Social Science","Hindi"].map((s) => (
            <label key={s} className="flex items-center gap-2 text-[12px] text-[#3A3A3C]">
              <input type="checkbox" checked={subjects.includes(s)} onChange={(e) => setSubjects((x) => e.target.checked ? [...x, s] : x.filter((y) => y !== s))} className="accent-[#7c3aed]" />
              {s}
            </label>
          ))}
        </div>
        {/* Templates */}
        <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">Quick templates</p>
        <div className="flex gap-1.5 mt-1 mb-4">
          {[
            { id: "exam", label: "Exam-prep · 6mo", days: 180, hpd: 3 },
            { id: "found",label: "Foundation · 1y", days: 365, hpd: 2 },
            { id: "vac",  label: "Vacation · 2mo", days: 60,  hpd: 4 },
          ].map((t) => (
            <button key={t.id} onClick={() => {
              const d = new Date(); d.setDate(d.getDate() + t.days);
              setExamDate(d.toISOString().slice(0, 10)); setHoursPerDay(t.hpd);
            }} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#3A3A3C]">
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold">Cancel</button>
          <button onClick={submit} disabled={submitting || !examDate || !subjects.length} className="flex-1 py-2.5 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-bold disabled:opacity-50">
            {submitting ? "Creating…" : "Create →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────── */
export default function Planner() {
  const { user } = useAuthStore();
  const profile = useActiveProfile();
  const navigate = useNavigate();

  const [plan, setPlan]         = useState(null);
  const [revision, setRevision] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [view, setView]         = useState("week"); // week | month
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [showCreate, setShowCreate] = useState(false);
  const [confettiAt, setConfettiAt] = useState(null); // dayNum → triggers burst
  const [pinned, setPinned]     = useState(() => new Set(JSON.parse(localStorage.getItem("planner_pinned") || "[]")));
  const [shareUrl, setShareUrl] = useState(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState({ open: null, text: "" }); // open=dayNum
  const [reschedling, setReschedling] = useState(false);
  const [rebalanceMsg, setRebalanceMsg] = useState(null); // toast after smart rebalance
  const [classStats, setClassStats] = useState(null);
  const [draggingTopic, setDraggingTopic] = useState(null); // { topic, fromDay }
  const [dropTargetDay, setDropTargetDay] = useState(null);
  const [digestStatus, setDigestStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, kind = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const [planRes, revRes] = await Promise.all([
        getPlan().catch(() => null),
        getRevisionDue().catch(() => ({ data: [] })),
      ]);
      setPlan(planRes?.data?.data || planRes?.data || null);
      setRevision(revRes.data || []);
    } catch (e) { setError("Could not load plan"); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  useEffect(() => { localStorage.setItem("planner_pinned", JSON.stringify([...pinned])); }, [pinned]);

  useEffect(() => {
    getPlannerClassStats().then((r) => setClassStats(r.data?.data)).catch(() => {});
  }, []);

  const examDate = plan?.examDate || user?.examDate;
  const dUntilExam = daysUntil(examDate);
  const dailyPlan = plan?.dailyPlan || [];

  // Subject status: on-track vs behind
  const subjectStatus = useMemo(() => {
    if (!dailyPlan.length) return { onTrack: [], behind: [] };
    const subjLastSlot = {};
    const today = new Date(); today.setHours(0,0,0,0);
    for (const slot of dailyPlan) {
      if (!slot.date || !slot.topics) continue;
      const isFuture = new Date(slot.date) > today;
      for (const t of slot.topics) {
        const s = topicToSubject(t);
        if (!subjLastSlot[s]) subjLastSlot[s] = { total: 0, done: 0, recentMissed: false };
        subjLastSlot[s].total++;
        if (slot.completed) subjLastSlot[s].done++;
        if (!slot.completed && !isFuture) subjLastSlot[s].recentMissed = true;
      }
    }
    const onTrack = [], behind = [];
    for (const [s, info] of Object.entries(subjLastSlot)) {
      if (s === "default") continue;
      if (info.recentMissed) behind.push(s);
      else onTrack.push(s);
    }
    return { onTrack, behind };
  }, [dailyPlan]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      const slot = dailyPlan.find((s) => s.date && sameDay(new Date(s.date), d));
      return { date: d, slot, isToday: sameDay(d, new Date()) };
    });
  }, [weekStart, dailyPlan]);

  const weekStats = useMemo(() => {
    const completed = weekDays.filter((d) => d.slot?.completed).length;
    const totalMin = weekDays.reduce((s, d) => s + (d.slot?.estimatedHours || 0) * 60, 0);
    return { completed, totalMin };
  }, [weekDays]);

  const navigateWeek = (delta) => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + delta * 7);
    setWeekStart(next);
  };

  const handleToggleDay = async (dayNum) => {
    try {
      await markDayComplete(dayNum, plan?._id);
      const wasComplete = dailyPlan.find((d) => d.day === dayNum)?.completed;
      if (!wasComplete) { setConfettiAt(dayNum); setTimeout(() => setConfettiAt(null), 1500); }
      refresh();
    } catch {}
  };

  const handlePinTopic = (topic) => {
    setPinned((p) => { const np = new Set(p); np.has(topic) ? np.delete(topic) : np.add(topic); return np; });
  };

  const handleQuickAdd = async (dayNum) => {
    const text = quickAdd.text.trim();
    if (!text || !plan) return;
    const day = dailyPlan.find((d) => d.day === dayNum);
    if (!day) return;
    try {
      await saveTopicOrder([...day.topics, text], plan._id);
      setQuickAdd({ open: null, text: "" });
      refresh();
    } catch {}
  };

  const handleReschedule = async () => {
    setReschedling(true);
    try {
      const r = await smartRebalancePlan([...pinned]);
      const data = r.data?.data || {};
      if (data.message) showToast(`✨ ${data.message}`, "ok");
      await refresh();
    } catch (e) {
      showToast(e.response?.data?.error || "Rebalance failed", "err");
    } finally { setReschedling(false); }
  };

  const handleSendDigest = async () => {
    setDigestStatus("sending");
    try {
      const r = await sendPlannerDigestNow();
      const d = r.data?.data || {};
      showToast(d.message || `Digest sent to ${d.sent || 0} parent(s).`, d.sent > 0 ? "ok" : "warn");
      setDigestStatus("sent");
    } catch (e) {
      showToast(e.response?.data?.error || "Could not send digest", "err");
      setDigestStatus(null);
    }
  };

  const handleCreate = async (body) => {
    try { await createStudyPlan(body); setShowCreate(false); refresh(); } catch {}
  };

  const handleShare = async () => {
    try { const r = await generateShareToken(); setShareUrl(`${window.location.origin}/shared-plan/${r.data?.data?.token || r.data?.token}`); } catch {}
  };

  const exportPdf = () => window.print();

  const exportIcal = () => {
    const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Stellar//Planner//EN"];
    for (const slot of dailyPlan) {
      if (!slot.date) continue;
      const d = new Date(slot.date);
      const ymd = d.toISOString().slice(0,10).replace(/-/g, "");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:stellar-${slot.day}@stellar`);
      lines.push(`DTSTART;VALUE=DATE:${ymd}`);
      lines.push(`DTEND;VALUE=DATE:${ymd}`);
      lines.push(`SUMMARY:${(slot.isMockTest ? "Mock test · " : "") + (slot.topics || []).join(", ").slice(0, 100)}`);
      if (slot.note) lines.push(`DESCRIPTION:${slot.note.replace(/\n/g, " ")}`);
      lines.push("END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "stellar-plan.ics"; a.click();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[#7c3aed] rounded-full animate-spin" />
    </div>
  );

  // No plan → onboarding card + create modal trigger
  if (!plan) return (
    <div className="space-y-5">
      <div className="rounded-3xl p-8 lg:p-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}>
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1c1c1e]/60 mb-3">Your study plan</p>
        <h1 className="text-[42px] sm:text-[56px] font-bold leading-[0.95] text-[#1c1c1e] tracking-tight mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
          No plan yet.
        </h1>
        <p className="text-[14px] text-[#1c1c1e]/70 mb-5 max-w-md">Create one in 30 seconds — Stellar will distribute topics across your remaining days.</p>
        <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-full bg-[#1c1c1e] text-white text-[14px] font-bold">Create plan →</button>
      </div>
      {showCreate && <PlanCreateModal onCreate={handleCreate} onClose={() => setShowCreate(false)}
        defaultSubjects={profile?.subjects || user?.subjects} defaultGrade={profile?.grade || user?.grade} defaultExamDate={profile?.examDate || user?.examDate} />}
    </div>
  );

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes confettiPop { 0%{transform:scale(0); opacity:1} 100%{transform:scale(1.5) translateY(-40px); opacity:0} }
      `}</style>

      {/* ── HERO + this-week ── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Hero */}
        <div className="lg:col-span-2 rounded-3xl p-7 lg:p-9 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1c1c1e]/60 mb-3">Your study plan</p>
          <h1 className="text-[44px] sm:text-[56px] font-bold leading-[0.95] text-[#1c1c1e] tracking-tight mb-5">
            <em className="not-italic" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontWeight: 700 }}>
              {dUntilExam != null ? `${dUntilExam} days` : "Set exam date"}
            </em> until boards.
          </h1>
          <div className="flex gap-8 flex-wrap">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#1c1c1e]/60 mb-1">On track</p>
              <p className="text-[18px] font-bold text-[#1c1c1e]">{subjectStatus.onTrack.length} / {subjectStatus.onTrack.length + subjectStatus.behind.length} subjects</p>
            </div>
            {subjectStatus.behind.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#1c1c1e]/60 mb-1">Behind</p>
                <p className="text-[18px] font-bold" style={{ color: "#FF3B30" }}>{subjectStatus.behind.join(", ")}</p>
              </div>
            )}
          </div>
          {subjectStatus.behind.length > 0 && (
            <button onClick={handleReschedule} disabled={reschedling}
              className="absolute bottom-5 right-5 px-3.5 py-1.5 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold hover:bg-[#3A3A3C] disabled:opacity-50">
              {reschedling ? "Rebalancing…" : "⚡ Auto-rebalance"}
            </button>
          )}
        </div>

        {/* This week mini bars */}
        <div className="bg-white rounded-3xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8E8E93] mb-3">This week</p>
          <MiniWeekBars dailyPlan={dailyPlan} />
          <p className="text-[12px] text-[#8E8E93] mt-3">
            {weekStats.completed} of 7 days complete · {Math.floor(weekStats.totalMin / 60)}h {weekStats.totalMin % 60}m total
          </p>
        </div>
      </div>

      {/* ── Week-strip header ── */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8E8E93]">
          THIS WEEK · {fmtDate(weekStart)} — {fmtDate(new Date(weekStart.getTime() + 6 * 86400000))}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => navigateWeek(-1)} className="w-7 h-7 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[12px] text-[#3A3A3C] hover:shadow-md transition-all">‹</button>
          <button onClick={() => setWeekStart(startOfWeek(new Date()))} className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[11px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">Today</button>
          <button onClick={() => navigateWeek(1)} className="w-7 h-7 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[12px] text-[#3A3A3C] hover:shadow-md transition-all">›</button>
          <div className="ml-2 flex gap-0.5 bg-white shadow-sm border border-[#f0f0f5] rounded-full overflow-hidden">
            <button onClick={() => setView("week")}  className={`px-3 py-1.5 text-[11px] font-semibold ${view === "week"  ? "bg-[#1c1c1e] text-white" : "text-[#3A3A3C]"}`}>Week</button>
            <button onClick={() => setView("month")} className={`px-3 py-1.5 text-[11px] font-semibold ${view === "month" ? "bg-[#1c1c1e] text-white" : "text-[#3A3A3C]"}`}>Month</button>
          </div>
          <button onClick={handleShare} className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[11px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">↗ Share</button>
          <button onClick={exportPdf} className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[11px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">🖨 PDF</button>
          <button onClick={exportIcal} className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[11px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">📅 iCal</button>
        </div>
      </div>

      {/* ── Week strip / month grid ── */}
      {view === "week" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {weekDays.map((wd, i) => {
            const slot = wd.slot;
            const isToday = wd.isToday;
            const isMock = slot?.isMockTest;
            const isOverloaded = (slot?.topics?.length || 0) > 4;
            const phase = slot?.phase;
            return (
              <div key={i}
                onDragOver={(e) => { e.preventDefault(); if (slot && !isMock) setDropTargetDay(slot.day); }}
                onDragLeave={() => setDropTargetDay(null)}
                onDrop={async (e) => {
                  setDropTargetDay(null);
                  const data = e.dataTransfer.getData("text/plain");
                  if (!data || !slot) return;
                  try {
                    const { topic, fromDay } = JSON.parse(data);
                    if (!topic || fromDay === slot.day) return;
                    // Remove from source
                    const sourceSlot = dailyPlan.find((d) => d.day === fromDay);
                    if (sourceSlot) {
                      await saveTopicOrder(sourceSlot.topics.filter((t) => t !== topic), plan._id);
                    }
                    // Add to target
                    if (!slot.topics.includes(topic)) {
                      await saveTopicOrder([...slot.topics, topic], plan._id);
                    }
                    showToast(`Moved "${topic}" → ${MONTHS[wd.date.getMonth()]} ${wd.date.getDate()}`);
                    refresh();
                  } catch { showToast("Move failed", "err"); }
                }}
                className={`relative rounded-2xl p-4 border-2 min-h-[200px] transition-all ${
                  dropTargetDay === slot?.day ? "border-[#7c3aed] bg-[#7c3aed]/5 scale-[1.02] shadow-lg" :
                  isToday ? "border-[#7c3aed] bg-white shadow-md" :
                  isMock  ? "border-transparent bg-[#1c1c1e] text-white" :
                  "border-transparent bg-white hover:border-[#E5E5EA]"
                }`}>
                {/* Confetti */}
                {confettiAt === slot?.day && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <span key={j} className="absolute text-[16px]"
                        style={{ left: `${10 + j * 12}%`, top: "50%", animation: `confettiPop 1.2s ease-out forwards`, animationDelay: `${j * 0.05}s` }}>
                        {["✨","🎉","⭐"][j % 3]}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-baseline justify-between mb-2">
                  <p className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isMock ? "text-white/60" : "text-[#8E8E93]"}`}>{DAY_LABELS_FULL[wd.date.getDay()]}</p>
                  <p className={`${isMock ? "text-white" : "text-[#1c1c1e]"} text-[20px] font-bold`} style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
                    {wd.date.getDate()}
                  </p>
                </div>

                {isToday && <p className="text-[10px] font-bold text-[#7c3aed] mb-2">• TODAY</p>}

                {/* Mock paper special card */}
                {isMock ? (
                  <div className="mt-4">
                    <p className="text-[15px] font-bold leading-snug">Mock paper #{slot?.day || ""}</p>
                    <p className="text-[11px] text-white/60 mt-1">{Math.round((slot?.estimatedHours || 1.5) * 60)} min · graded</p>
                    <button onClick={() => navigate("/competition")} className="mt-3 w-full py-1.5 rounded-lg bg-white text-[#1c1c1e] text-[11px] font-bold">Start →</button>
                  </div>
                ) : (
                  <>
                    {phase && <span className="inline-block text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded mb-2"
                      style={{ background: phase === "foundation" ? "#7c3aed14" : phase === "practice" ? "#FF950014" : phase === "revision" ? "#34C75914" : "#FF3B3014",
                               color:      phase === "foundation" ? "#7c3aed"   : phase === "practice" ? "#FF9500"   : phase === "revision" ? "#34C759"   : "#FF3B30" }}>
                      {phase}
                    </span>}
                    {/* Topics */}
                    <div className="space-y-1.5">
                      {(slot?.topics || []).map((t) => (
                        <SubjectPill key={t} topic={t} completed={slot?.completed} pinned={pinned.has(t)}
                          fromDay={slot.day} isDragging={draggingTopic?.topic === t && draggingTopic?.fromDay === slot.day}
                          onDragStart={setDraggingTopic} onDragEnd={() => setDraggingTopic(null)}
                          onToggle={() => handleToggleDay(slot.day)} onPin={() => handlePinTopic(t)} />
                      ))}
                      {(!slot || slot.topics?.length === 0) && (
                        <p className="text-[11px] text-[#C7C7CC] italic">No tasks</p>
                      )}
                    </div>
                    {isOverloaded && <p className="text-[9px] text-[#FF3B30] font-bold mt-2">⚠ over-scheduled</p>}
                    {/* Quick add */}
                    {slot && quickAdd.open === slot.day ? (
                      <div className="mt-2 flex gap-1">
                        <input autoFocus value={quickAdd.text} onChange={(e) => setQuickAdd({ ...quickAdd, text: e.target.value })}
                          onKeyDown={(e) => { if (e.key === "Enter") handleQuickAdd(slot.day); if (e.key === "Escape") setQuickAdd({ open: null, text: "" }); }}
                          placeholder="topic…" className="flex-1 text-[11px] px-2 py-1 rounded bg-[#FAFAFB] border border-[#E5E5EA] outline-none" />
                        <button onClick={() => handleQuickAdd(slot.day)} className="text-[#7c3aed] text-[12px] font-bold px-1">↵</button>
                      </div>
                    ) : slot && (
                      <button onClick={() => setQuickAdd({ open: slot.day, text: "" })}
                        className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-[#E5E5EA] text-[11px] text-[#8E8E93] hover:border-[#7c3aed] hover:text-[#7c3aed]">
                        + add
                      </button>
                    )}
                  </>
                )}

                {/* Day completion toggle */}
                {slot && !isMock && (
                  <button onClick={() => handleToggleDay(slot.day)}
                    className={`mt-3 w-full py-1.5 rounded-lg text-[11px] font-bold transition-colors ${slot.completed ? "bg-[#34C759]/10 text-[#34C759]" : "bg-[#1c1c1e] text-white"}`}>
                    {slot.completed ? "✓ Done · undo" : "Mark day done"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <MonthView dailyPlan={dailyPlan} pinned={pinned} onTogglePin={handlePinTopic} onToggleDay={handleToggleDay} />
      )}

      {/* ── Due for revision ── */}
      <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] font-bold text-[#1c1c1e]">Due for revision <span className="text-[#8E8E93] font-normal">· spaced repetition</span></p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fbcfe8]/50 text-[#7c3aed]">{revision.length} cards</span>
        </div>
        {revision.length === 0 ? (
          <p className="text-[12px] text-[#8E8E93] text-center py-4">Nothing due — practice topics to fill the queue.</p>
        ) : (
          <div className="space-y-1">
            {revision.slice(0, 8).map((r) => {
              const subj = topicToSubject(r.topic);
              const c = SUBJECT_COLORS[subj] || SUBJECT_COLORS.default;
              const isToday = (r.urgency || "").toLowerCase().includes("overdue") || r.dueIn === 0;
              return (
                <div key={r.topic} className="flex items-center gap-3 py-2.5 border-b border-[#F2F2F7] last:border-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.solid }} />
                  <p className="flex-1 text-[13px] font-semibold text-[#1c1c1e] truncate">{r.topic}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ background: c.bg, color: c.text, borderColor: c.solid + "55" }}>{subj === "default" ? "Topic" : subj}</span>
                  <span className={`text-[10px] font-medium w-16 text-right ${isToday ? "text-[#FF3B30] font-bold" : "text-[#8E8E93]"}`}>
                    {isToday ? "today" : r.urgency || "soon"}
                  </span>
                  <button onClick={() => navigate("/practice", { state: { topic: r.topic } })}
                    className="px-3 py-1.5 rounded-full bg-[#1c1c1e] text-white text-[11px] font-bold hover:bg-[#3A3A3C]">Review</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom row: Plan management + share ── */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mb-2">Plan</p>
          <p className="text-[14px] font-bold text-[#1c1c1e]">{plan.name || "Study plan"}</p>
          <p className="text-[11px] text-[#8E8E93] mt-1">{plan.hoursPerDay}h/day · goal: {plan.goal}</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-[11px] font-semibold text-[#7c3aed]">+ New plan</button>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mb-2">Parent share</p>
          {shareUrl ? (
            <div className="text-[11px] text-[#3A3A3C]">
              <p className="truncate font-mono">{shareUrl}</p>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); showToast("Link copied"); }} className="mt-2 text-[#7c3aed] font-semibold">Copy link</button>
            </div>
          ) : (
            <button onClick={handleShare} className="text-[11px] font-semibold text-[#7c3aed]">Generate parent share link →</button>
          )}
          <button onClick={handleSendDigest} disabled={digestStatus === "sending"}
            className="block mt-2 text-[11px] font-semibold text-[#7c3aed] hover:opacity-70 disabled:opacity-50">
            {digestStatus === "sending" ? "Sending…" : digestStatus === "sent" ? "✓ Digest sent — send again" : "📧 Send weekly digest now"}
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8E8E93] mb-2">Compare with grade {profile?.grade || "10"}</p>
          {classStats?.peerCount > 0 ? (
            <>
              <p className="text-[12px] text-[#3A3A3C]">Class avg: <span className="font-bold">{classStats.avgHoursPerDay}h/day</span> · {classStats.avgCompletionPct}% completion</p>
              <p className="text-[12px] text-[#3A3A3C]">You: <span className="font-bold">{plan.hoursPerDay}h/day</span></p>
              <p className={`text-[11px] mt-1 font-bold ${plan.hoursPerDay >= classStats.avgHoursPerDay ? "text-[#34C759]" : "text-[#FF9500]"}`}>
                {plan.hoursPerDay >= classStats.avgHoursPerDay ? "↑ above class avg" : "↓ below class avg"}
              </p>
              <p className="text-[10px] text-[#C7C7CC] mt-1">{classStats.peerCount.toLocaleString()} peers</p>
            </>
          ) : (
            <p className="text-[12px] text-[#8E8E93]">Not enough peer plans yet to compare.</p>
          )}
        </div>
      </div>

      {showCreate && <PlanCreateModal onCreate={handleCreate} onClose={() => setShowCreate(false)}
        defaultSubjects={profile?.subjects || user?.subjects} defaultGrade={profile?.grade || user?.grade} defaultExamDate={profile?.examDate || user?.examDate} />}

      {/* Toast (drag-confirm, rebalance status, digest status) */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-[12px] font-semibold ${
          toast.kind === "ok"   ? "bg-[#34C759] text-white" :
          toast.kind === "warn" ? "bg-[#FF9500] text-white" :
                                  "bg-[#FF3B30] text-white"
        }`} style={{ animation: "slideUp .3s ease-out" }}>
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }`}</style>
    </div>
  );
}

/* Month view — compact 6×7 grid */
function MonthView({ dailyPlan, pinned, onTogglePin, onToggleDay }) {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const start = startOfWeek(first);
  const cells = Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const slot = dailyPlan.find((s) => s.date && sameDay(new Date(s.date), d));
    return { date: d, slot, inMonth: d.getMonth() === today.getMonth(), isToday: sameDay(d, today) };
  });
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5]">
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DAY_LABELS_FULL.map((d) => <p key={d} className="text-[10px] font-bold text-[#8E8E93] text-center">{d}</p>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c, i) => (
          <div key={i} className={`min-h-[80px] rounded-lg p-2 border ${c.isToday ? "border-[#7c3aed]" : "border-transparent"} ${c.inMonth ? "bg-[#FAFAFB]" : "bg-transparent opacity-40"}`}>
            <p className="text-[11px] font-semibold text-[#1c1c1e]">{c.date.getDate()}</p>
            {c.slot?.topics?.slice(0, 2).map((t) => {
              const c2 = SUBJECT_COLORS[topicToSubject(t)] || SUBJECT_COLORS.default;
              return <p key={t} className="text-[9px] truncate mt-0.5 px-1 rounded" style={{ background: c2.bg, color: c2.text }}>{t}</p>;
            })}
            {(c.slot?.topics?.length || 0) > 2 && <p className="text-[9px] text-[#8E8E93] mt-0.5">+{c.slot.topics.length - 2}</p>}
            {c.slot?.completed && <span className="text-[10px] text-[#34C759]">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
