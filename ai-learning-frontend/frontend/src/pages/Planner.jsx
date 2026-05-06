import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPlan, listStudyPlans, getPlanById, createStudyPlan, activatePlan, updatePlanSettings, deleteStudyPlan, reschedulePlan, generateShareToken, markDayComplete, saveTopicOrder, saveDayNote, markRevised, listNcertChapters, getStudiedTopics, getTopics } from "../services/api";
import { useAuthStore } from "../store/authStore";

const GOAL_LABEL = {
  pass:        "Pass the exam",
  distinction: "Score 75%+",
  top:         "Top 90%+",
  scholarship: "Scholarship rank",
};

const GOALS = [
  { value: "pass",        label: "Pass the exam" },
  { value: "distinction", label: "Score 75%+ (Distinction)" },
  { value: "top",         label: "Top 90%+" },
  { value: "scholarship", label: "Scholarship rank" },
];
const CBSE_SUBJECTS = ["Math", "Science", "English", "Social Science", "Hindi"];
const GRADES        = ["8","9","10","11","12"];

const PHASE_COLORS = {
  foundation: { bg: "#EEF4FF", color: "#007AFF", label: "Foundation" },
  practice:   { bg: "#FFF4E0", color: "#FF9500", label: "Practice"   },
  revision:   { bg: "#F3EEFF", color: "#AF52DE", label: "Revision"   },
  mock:       { bg: "#FFE5E5", color: "#FF3B30", label: "Mock"       },
};

/* ─── PLAN SWITCHER ──────────────────────────────────────── */
function PlanSwitcher({ plans, activePlanId, onSwitch, onCreate }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {plans.map(p => (
        <button key={p.planId} onClick={() => onSwitch(p.planId)} style={{
          fontSize: "13px", fontWeight: 600, padding: "6px 14px", borderRadius: "20px",
          background: p.planId === activePlanId ? "#007AFF" : "transparent",
          color: p.planId === activePlanId ? "#fff" : "#86868B",
          border: p.planId === activePlanId ? "none" : "1.5px solid #E5E5EA",
          cursor: "pointer", transition: "all 0.15s",
        }}>
          {p.name || "Study Plan"}
          {p.progress > 0 && <span style={{ marginLeft: "5px", opacity: 0.75, fontSize: "11px" }}>{p.progress}%</span>}
        </button>
      ))}
      <button onClick={onCreate} style={{
        fontSize: "13px", fontWeight: 600, padding: "6px 14px", borderRadius: "20px",
        border: "1.5px dashed #C8C8CE", color: "#86868B", background: "transparent", cursor: "pointer",
      }}>+ New plan</button>
    </div>
  );
}

/* ─── CATCH-UP BANNER ────────────────────────────────────── */
function CatchUpBanner({ missedCount, rescheduling, onReschedule }) {
  return (
    <div style={{ padding: "14px 20px", background: "#FFF4E0", borderRadius: "14px", border: "1px solid rgba(255,149,0,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#CC6600" }}>
          {missedCount} missed day{missedCount !== 1 ? "s" : ""} — your plan is behind
        </p>
        <p style={{ fontSize: "12px", color: "#86868B", marginTop: "2px" }}>
          Reschedule to redistribute missed topics across remaining days.
        </p>
      </div>
      <button onClick={onReschedule} disabled={rescheduling} style={{
        fontSize: "13px", fontWeight: 600, padding: "9px 18px", borderRadius: "10px",
        background: "#FF9500", color: "#fff", border: "none", cursor: "pointer",
        opacity: rescheduling ? 0.6 : 1, flexShrink: 0,
      }}>
        {rescheduling ? "Rescheduling…" : "Catch up now"}
      </button>
    </div>
  );
}

/* ─── DAY NOTE ───────────────────────────────────────────── */
function DayNote({ dayNum, initialNote, planId, onSaved }) {
  const [open,   setOpen]   = useState(!!initialNote);
  const [text,   setText]   = useState(initialNote || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await saveDayNote(dayNum, text, planId); onSaved(dayNum, text); }
    catch {}
    setSaving(false);
  };

  return (
    <div style={{ marginTop: "6px" }}>
      <button onClick={() => setOpen(o => !o)} style={{ fontSize: "11px", color: "#86868B", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        {open ? "▾ Hide note" : `📝 ${initialNote ? "Edit note" : "Add note"}`}
      </button>
      {open && (
        <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="input text-[12px]"
            style={{ flex: 1, resize: "vertical", minHeight: "52px" }}
            maxLength={500}
            placeholder="Add a note for this day…"
          />
          <button onClick={save} disabled={saving} className="btn-secondary" style={{ fontSize: "12px", padding: "6px 12px", alignSelf: "flex-start", flexShrink: 0 }}>
            {saving ? "…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── PLAN FORM (shared by Create + Edit) ────────────────── */
function PlanForm({ initial, submitting, submitLabel, onSubmit, onCancel }) {
  const [form,           setForm]           = useState(initial);
  const [offDayInput,    setOffDayInput]    = useState("");
  const [availTopics,    setAvailTopics]    = useState([]);
  const [showTopics,     setShowTopics]     = useState(false);
  const [loadingTopics,  setLoadingTopics]  = useState(false);

  useEffect(() => {
    if (!showTopics || !form.subjects.length) return;
    setLoadingTopics(true);
    Promise.all(form.subjects.map(s => getTopics({ subject: s, grade: form.grade }).catch(() => ({ data: [] }))))
      .then(results => setAvailTopics(results.flatMap((r, i) => (r.data || []).map(t => ({ name: t.name, subject: form.subjects[i] })))))
      .finally(() => setLoadingTopics(false));
  }, [showTopics, form.subjects.join(","), form.grade]);

  const toggleSubject = (s) => {
    const next = form.subjects.includes(s) ? form.subjects.filter(x => x !== s) : [...form.subjects, s];
    if (next.length) setForm({ ...form, subjects: next, topicFilter: [] });
  };

  const toggleTopic = (name) => {
    const cur = form.topicFilter || [];
    setForm({ ...form, topicFilter: cur.includes(name) ? cur.filter(x => x !== name) : [...cur, name] });
  };

  const addOffDay = () => {
    if (!offDayInput) return;
    const cur = form.offDays || [];
    if (!cur.includes(offDayInput)) setForm({ ...form, offDays: [...cur, offDayInput] });
    setOffDayInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.examDate) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Plan name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Plan Name <span className="font-normal normal-case">(optional)</span></label>
        <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Board Exam 2025" maxLength={100} />
      </div>

      {/* Grade + Exam date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Grade</label>
          <select className="input" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
            {GRADES.map(g => <option key={g} value={g}>Class {g}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Exam Date <span className="text-apple-red">*</span></label>
          <input className="input" type="date" value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} required />
        </div>
      </div>

      {/* Goal + Hours/day */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Study Goal</label>
          <select className="input" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
            {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Hours / day</label>
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={10} step={0.5} value={form.hoursPerDay || 2}
              onChange={e => setForm({ ...form, hoursPerDay: parseFloat(e.target.value) })}
              className="flex-1" />
            <span className="text-[14px] font-bold text-apple-blue w-10 text-center">{form.hoursPerDay || 2}h</span>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Subjects</label>
        <div className="flex flex-wrap gap-2">
          {CBSE_SUBJECTS.map(s => {
            const sel = form.subjects.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSubject(s)} style={{
                fontSize: "13px", fontWeight: 600, padding: "7px 16px", borderRadius: "20px",
                border: sel ? "none" : "1.5px solid #E5E5EA",
                background: sel ? "#007AFF" : "transparent",
                color: sel ? "#fff" : "#86868B", cursor: "pointer", transition: "all 0.15s",
              }}>{s}</button>
            );
          })}
        </div>
      </div>

      {/* Off-days */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">Off Days <span className="font-normal normal-case">(holidays, weekends)</span></label>
        <div className="flex gap-2">
          <input type="date" className="input flex-1" value={offDayInput} onChange={e => setOffDayInput(e.target.value)} />
          <button type="button" onClick={addOffDay} className="btn-secondary px-4 shrink-0">Add</button>
        </div>
        {(form.offDays || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {form.offDays.map(d => (
              <span key={d} style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "#F5F5F7", color: "#86868B", display: "flex", alignItems: "center", gap: "6px" }}>
                {d}
                <button type="button" onClick={() => setForm({ ...form, offDays: form.offDays.filter(x => x !== d) })} style={{ background: "none", border: "none", cursor: "pointer", color: "#86868B", fontSize: "14px", lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Topic filter */}
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => setShowTopics(v => !v)} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#007AFF", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {showTopics ? "▾" : "▸"} Choose specific topics
          {(form.topicFilter || []).length > 0 && <span style={{ fontSize: "11px", background: "#007AFF", color: "#fff", padding: "2px 8px", borderRadius: "20px" }}>{form.topicFilter.length} selected</span>}
        </button>
        {showTopics && (
          <div style={{ border: "1px solid #E5E5EA", borderRadius: "12px", padding: "14px", maxHeight: "240px", overflowY: "auto" }}>
            {loadingTopics ? (
              <p style={{ fontSize: "13px", color: "#86868B", textAlign: "center" }}>Loading topics…</p>
            ) : availTopics.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#86868B" }}>No topics found. Select a subject first.</p>
            ) : (
              <>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setForm({ ...form, topicFilter: availTopics.map(t => t.name) })} style={{ fontSize: "11px", color: "#007AFF", background: "none", border: "none", cursor: "pointer" }}>Select all</button>
                  <span style={{ color: "#C8C8CE" }}>·</span>
                  <button type="button" onClick={() => setForm({ ...form, topicFilter: [] })} style={{ fontSize: "11px", color: "#86868B", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
                </div>
                <div className="flex flex-col gap-2">
                  {availTopics.map(t => (
                    <label key={t.name} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#1D1D1F" }}>
                      <input type="checkbox" checked={(form.topicFilter || []).includes(t.name)}
                        onChange={() => toggleTopic(t.name)} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                      {t.name}
                      <span style={{ fontSize: "11px", color: "#86868B" }}>{t.subject}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>}
        <button type="submit" disabled={submitting || !form.examDate} className="btn-primary flex-1 py-3">
          {submitting
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{submitLabel}…</span>
            : submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ─── EMPTY STATE / CREATE PLAN ──────────────────────────── */
function CreatePlanCard({ user, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const initial = {
    name: "", grade: user?.grade || "10",
    subjects:    user?.subjects?.length ? user.subjects : [user?.subject || "Math"],
    examDate: "", goal: "distinction", hoursPerDay: 2, offDays: [], topicFilter: [],
  };

  const handleCreate = async (form) => {
    setError(""); setSubmitting(true);
    try {
      const { data } = await createStudyPlan(form);
      onCreated(data);
    } catch (e) {
      setError(e.response?.data?.error || "Could not create plan. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--label)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Create your study plan
        </h1>
        <p style={{ fontSize: "15px", color: "#86868B", maxWidth: "440px", margin: "0 auto", lineHeight: 1.6 }}>
          Tell us your exam date and subjects — we'll build a day-by-day schedule that adapts to your weak areas and study goal.
        </p>
      </div>

      <div className="card p-8">
        {error && (
          <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg mb-5">{error}</div>
        )}
        <PlanForm
          initial={initial}
          submitting={submitting}
          submitLabel="Generate plan"
          onSubmit={handleCreate}
        />
      </div>

      <p style={{ textAlign: "center", fontSize: "12px", color: "#8E8E93", marginTop: "16px" }}>
        You can edit or delete your plan at any time from the Planner page.
      </p>
    </div>
  );
}

/* ─── EDIT SETTINGS MODAL ────────────────────────────────── */
function PlanSettingsModal({ plan, onSaved, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const initial = {
    name:        plan.planName     || "",
    grade:       plan.planGrade    || "10",
    subjects:    plan.planSubjects || ["Math"],
    examDate:    plan.planExamDate ? new Date(plan.planExamDate).toISOString().split("T")[0] : "",
    goal:        plan.planGoal     || "distinction",
    hoursPerDay: plan.hoursPerDay  || 2,
    offDays:     plan.offDays      || [],
    topicFilter: plan.topicFilter  || [],
  };

  const handleSave = async (form) => {
    setError(""); setSubmitting(true);
    try {
      const { data } = await updatePlanSettings(plan.planId, form);
      onSaved(data);
    } catch (e) {
      setError(e.response?.data?.error || "Could not update plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-[var(--bg)] rounded-apple-xl shadow-apple-xl w-full max-w-lg p-7 space-y-5 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold text-[var(--label)]">Edit plan settings</p>
          <button onClick={onClose} className="text-apple-gray hover:text-[var(--label)] transition-colors text-[20px] leading-none">×</button>
        </div>
        {error && (
          <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg">{error}</div>
        )}
        <PlanForm
          initial={initial}
          submitting={submitting}
          submitLabel="Save changes"
          onSubmit={handleSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const dayToDate = (n) => {
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + n - 1); return d;
};
const fmtShort  = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
const fmtFull   = (d) => `${DAY_NAMES[d.getDay()]}, ${fmtShort(d)}`;

/* streak = consecutive completed days from day 1 */
const calcStreak = (dailyPlan = []) => {
  let s = 0;
  for (const d of [...dailyPlan].sort((a,b) => a.day - b.day)) {
    if (d.completed) s++; else break;
  }
  return s;
};

const remainingHours = (dailyPlan = []) =>
  dailyPlan.filter(d => !d.completed).reduce((s, d) => s + (d.estimatedHours || 0), 0);

const urgencyColor = (n) => n > 30 ? "#34C759" : n > 15 ? "#FF9500" : n > 7 ? "#FF6B00" : "#FF3B30";
const urgencyLabel = (n) => n > 30 ? "On track" : n > 15 ? "Getting close" : n > 7 ? "Hurry up!" : "Urgent!";

/* stable topic→colour map */
const TOPIC_COLORS = [
  "#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30",
  "#5AC8FA","#5856D6","#FF2D55","#30B0C7","#E3A900",
];
const colorCache = {};
let colorIdx = 0;
const topicColor = (t) => {
  if (!colorCache[t]) colorCache[t] = TOPIC_COLORS[colorIdx++ % TOPIC_COLORS.length];
  return colorCache[t];
};

/* ─── shared primitives ──────────────────────────────────── */
function ViewTab({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 text-[13px] font-medium rounded-apple-lg transition-all ${
        active ? "bg-white shadow-apple text-[var(--label)]" : "text-apple-gray hover:text-[var(--label)]"
      }`}>
      {label}
    </button>
  );
}

function TopicBadge({ topic, small }) {
  const c = topicColor(topic);
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${
      small ? "text-[10px] px-1.5 py-0.5" : "text-[12px] px-2.5 py-1"
    }`} style={{ background: c + "18", color: c }}>
      {topic}
    </span>
  );
}

function CheckIcon({ size = 10 }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 10 8" fill="none">
      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DayActions({ day, isToday, completing, onComplete, navigate, topics }) {
  if (day.completed) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-5 h-5 rounded-full bg-apple-green flex items-center justify-center">
          <CheckIcon />
        </div>
        <span className="text-[12px] font-medium text-apple-green">Done</span>
      </div>
    );
  }
  return (
    <div className="flex gap-2 shrink-0">
      {isToday && (
        <button onClick={() => navigate("/practice", { state: { topic: topics[0], mixTopics: topics } })}
          className="btn-primary text-[12px] py-1.5 px-3">
          Start →
        </button>
      )}
      <button onClick={() => onComplete(day.day)} disabled={completing === day.day}
        className="btn-secondary text-[12px] py-1.5 px-3">
        {completing === day.day ? "…" : "Mark done"}
      </button>
    </div>
  );
}

/* ─── SUMMARY BAR ────────────────────────────────────────── */
function SummaryBar({ plan }) {
  if (!plan) return null;
  const dp       = plan.dailyPlan || [];
  const done     = dp.filter(d => d.completed).length;
  const total    = dp.length;
  const hoursLeft= Math.round(remainingHours(dp) * 10) / 10;
  const streak   = calcStreak(dp);
  const daysLeft = plan.daysLeft ?? null;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
  const rec      = daysLeft > 0 && total > done
    ? Math.ceil((hoursLeft / Math.max(daysLeft, 1)) * 10) / 10
    : null;

  const cards = [
    {
      icon: "📅",
      value: daysLeft != null ? `${daysLeft}d` : "—",
      label: "until exam",
      sub: daysLeft != null ? urgencyLabel(daysLeft) : "Set exam date",
      color: daysLeft != null ? urgencyColor(daysLeft) : "#8E8E93",
    },
    {
      icon: "✅",
      value: `${done}/${total}`,
      label: "days done",
      sub: `${pct}% complete`,
      color: "#34C759",
    },
    {
      icon: "⏱",
      value: `${hoursLeft}h`,
      label: "remaining",
      sub: rec ? `~${rec}h/day recommended` : "All done!",
      color: "#007AFF",
    },
    {
      icon: "🔥",
      value: streak,
      label: "day streak",
      sub: streak > 0 ? "Keep it up!" : "Start your streak",
      color: streak > 0 ? "#FF9500" : "#8E8E93",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="card p-4 flex items-center gap-3">
          <span className="text-[22px]">{c.icon}</span>
          <div className="min-w-0">
            <p className="text-[22px] font-bold leading-tight" style={{ color: c.color }}>{c.value}</p>
            <p className="text-[11px] text-apple-gray">{c.label}</p>
            <p className="text-[10px] text-apple-gray3 truncate">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── TODAY'S FOCUS CARD ─────────────────────────────────── */
function TodayFocus({ plan, completing, onComplete, navigate }) {
  const today = plan?.dailyPlan?.find(d => d.day === 1);
  if (!today) return null;

  const date  = dayToDate(1);
  const done  = today.completed;

  // If today done, show tomorrow
  const next  = plan.dailyPlan.find(d => d.day === 2);

  return (
    <div className={`rounded-apple-2xl border p-5 transition-all ${
      done
        ? "border-apple-green/30 bg-apple-green/6"
        : "border-apple-blue/30 bg-gradient-to-br from-apple-blue/6 to-apple-blue/3 shadow-apple"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] mono uppercase tracking-widest font-semibold ${done ? "text-apple-green" : "text-apple-blue"}`}>
              {done ? "✓ Today complete" : "Today's focus"}
            </span>
            <span className="text-[11px] text-apple-gray3">·</span>
            <span className="text-[11px] text-apple-gray3">{fmtFull(date)} · Day 1</span>
          </div>

          {done ? (
            <div>
              <p className="text-[18px] font-bold text-[var(--label)] mb-1">Great work today! 🎉</p>
              {next ? (
                <p className="text-[13px] text-apple-gray">
                  Tomorrow: {next.topics.join(", ")} &nbsp;·&nbsp; ~{next.estimatedHours}h
                </p>
              ) : (
                <p className="text-[13px] text-apple-gray">That's the whole plan done!</p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {today.topics.map(t => <TopicBadge key={t} topic={t} />)}
              </div>
              <p className="text-[12px] text-apple-gray">~{today.estimatedHours}h estimated today</p>
            </div>
          )}
        </div>

        {!done && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate("/practice", { state: { topic: today.topics[0], mixTopics: today.topics } })}
              className="btn-primary text-[14px] py-2.5 px-5">
              Start today →
            </button>
            <button onClick={() => onComplete(1)} disabled={completing === 1}
              className="btn-secondary text-[13px] py-2.5 px-4">
              {completing === 1 ? "…" : "Mark done"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DAILY VIEW ─────────────────────────────────────────── */
function DailyView({ plan, completing, onComplete, navigate, onNoteUpdate }) {
  if (!plan?.dailyPlan?.length) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-1">No plan yet</p>
        <p className="text-[13px] text-apple-gray">Set your exam date in Settings to generate a daily plan.</p>
      </div>
    );
  }

  const done  = plan.dailyPlan.filter(d => d.completed).length;
  const total = plan.dailyPlan.length;
  const pct   = Math.round((done / total) * 100);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-medium text-[var(--label)]">Overall progress</p>
          <span className="text-[13px] font-semibold text-apple-blue">{done}/{total} days · {pct}%</span>
        </div>
        <div className="h-2.5 bg-apple-gray5 rounded-full overflow-hidden">
          <div className="h-full bg-apple-blue rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Day list */}
      <div className="card p-5">
        <p className="section-label mb-4">Daily Schedule — {total} days planned</p>
        <div className="flex flex-col gap-2">
          {plan.dailyPlan.map((d) => {
            const date    = dayToDate(d.day);
            const isToday = d.day === 1;
            return (
              <div key={d.day} className={`p-4 rounded-apple-xl border transition-all ${
                d.completed  ? "border-apple-green/25 bg-apple-green/6" :
                d.isMockTest ? "border-[#AF52DE]/30 bg-gradient-to-r from-[#AF52DE]/6 to-[#007AFF]/6" :
                isToday      ? "border-apple-blue/30 bg-apple-blue/4 shadow-apple" :
                               "border-apple-gray5 hover:border-apple-blue/25 hover:bg-apple-blue/3"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center w-12 shrink-0">
                      <p className="text-[9px] mono uppercase text-apple-gray3">{DAY_NAMES[date.getDay()]}</p>
                      <p className="text-[20px] font-bold text-[var(--label)] leading-tight">{d.day}</p>
                      <p className="text-[9px] text-apple-gray3">{fmtShort(date)}</p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {d.phase && PHASE_COLORS[d.phase] && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: PHASE_COLORS[d.phase].bg, color: PHASE_COLORS[d.phase].color }}>
                            {PHASE_COLORS[d.phase].label}
                          </span>
                        )}
                        {d.isMockTest && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: "#F3EEFF", color: "#AF52DE" }}>📝 Mock Test</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {d.topics.map(t => (
                          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: topicColor(t) + "18", color: topicColor(t), fontWeight: 500 }}>
                            {t}
                            {plan?.topicAccuracy?.[t] != null && (
                              <span style={{ fontSize: "10px", opacity: 0.7 }}>{plan.topicAccuracy[t]}%</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <p className="text-[12px] text-apple-gray">~{d.estimatedHours}h</p>
                    </div>
                  </div>
                  {d.isMockTest ? (
                    <button onClick={() => navigate("/exam")} className="btn-primary text-[12px] py-1.5 px-4 shrink-0">Take test →</button>
                  ) : (
                    <DayActions day={d} isToday={isToday} completing={completing} onComplete={onComplete} navigate={navigate} topics={d.topics} />
                  )}
                </div>
                <DayNote dayNum={d.day} initialNote={d.note} planId={plan?.planId}
                  onSaved={onNoteUpdate} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── WEEKLY VIEW ────────────────────────────────────────── */
function WeeklyView({ plan, completing, onComplete, navigate }) {
  const [weekIdx, setWeekIdx] = useState(0);

  if (!plan?.dailyPlan?.length) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[13px] text-apple-gray">No plan to display. Set your exam date in Settings.</p>
      </div>
    );
  }

  const dp       = plan.dailyPlan;
  const maxDay   = Math.max(...dp.map(d => d.day));
  const maxWeeks = Math.ceil(maxDay / 7);
  const dayMap   = Object.fromEntries(dp.map(d => [d.day, d]));

  const startDay = weekIdx * 7 + 1;
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dayNum = startDay + i;
    return { dayNum, date: dayToDate(dayNum), data: dayMap[dayNum] || null };
  });

  const weekDone = weekDays.filter(w => w.data?.completed).length;
  const weekHrs  = weekDays.reduce((s, w) => s + (w.data?.estimatedHours || 0), 0);

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="card p-4 flex items-center justify-between">
        <button onClick={() => setWeekIdx(w => w - 1)} disabled={weekIdx === 0}
          className="flex items-center gap-1.5 text-[13px] font-medium text-apple-gray hover:text-apple-blue disabled:opacity-30 transition-colors px-3 py-1.5 rounded-apple-lg hover:bg-apple-blue/6">
          ← Prev week
        </button>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[var(--label)]">
            Week {weekIdx + 1} of {maxWeeks}
          </p>
          <p className="text-[11px] text-apple-gray3">
            {fmtShort(dayToDate(startDay))} – {fmtShort(dayToDate(Math.min(startDay + 6, maxDay)))}
            &nbsp;·&nbsp;{weekDone}/7 done&nbsp;·&nbsp;~{weekHrs}h
          </p>
        </div>
        <button onClick={() => setWeekIdx(w => w + 1)} disabled={weekIdx >= maxWeeks - 1}
          className="flex items-center gap-1.5 text-[13px] font-medium text-apple-gray hover:text-apple-blue disabled:opacity-30 transition-colors px-3 py-1.5 rounded-apple-lg hover:bg-apple-blue/6">
          Next week →
        </button>
      </div>

      {/* Week days */}
      <div className="card p-5 space-y-2">
        {weekDays.map(({ dayNum, date, data }) => {
          const isToday    = dayNum === 1;
          const isFuture   = dayNum > maxDay;
          const isRestDay  = !data && !isFuture;

          return (
            <div key={dayNum} className={`flex items-center gap-4 p-4 rounded-apple-xl border transition-all ${
              data?.completed ? "border-apple-green/25 bg-apple-green/6" :
              isToday         ? "border-apple-blue/30 bg-apple-blue/4 shadow-apple" :
              isFuture        ? "border-transparent bg-apple-gray6/40 opacity-40" :
              isRestDay       ? "border-apple-gray5/50 bg-apple-gray6/30" :
                                "border-apple-gray5 hover:border-apple-blue/25 hover:bg-apple-blue/3"
            }`}>
              {/* Date column */}
              <div className="w-16 shrink-0 text-center">
                <p className={`text-[11px] mono font-semibold uppercase ${
                  isToday ? "text-apple-blue" : "text-apple-gray3"
                }`}>{DAY_NAMES[date.getDay()]}</p>
                <p className="text-[18px] font-bold text-[var(--label)] leading-none mt-0.5">{date.getDate()}</p>
                <p className="text-[10px] text-apple-gray3">{MONTH_NAMES[date.getMonth()]}</p>
                {isToday && (
                  <span className="inline-block mt-1 text-[9px] bg-apple-blue text-white px-1.5 py-0.5 rounded-full font-semibold">Today</span>
                )}
              </div>

              {/* Day number */}
              <div className="w-10 shrink-0 text-center">
                {!isFuture && <p className="text-[10px] mono text-apple-gray3 uppercase">Day</p>}
                {!isFuture && <p className="text-[16px] font-bold text-[var(--label)]">{dayNum}</p>}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {data ? (
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {data.topics.map(t => <TopicBadge key={t} topic={t} />)}
                    </div>
                    <p className="text-[11px] text-apple-gray">~{data.estimatedHours}h estimated</p>
                  </div>
                ) : isFuture ? (
                  <p className="text-[12px] text-apple-gray3 italic">Outside plan range</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-gray3" />
                    <p className="text-[12px] text-apple-gray3">Rest day</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {data && (
                <DayActions day={data} isToday={isToday} completing={completing}
                  onComplete={onComplete} navigate={navigate} topics={data.topics} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MONTHLY VIEW ───────────────────────────────────────── */
function MonthlyView({ plan }) {
  if (!plan?.dailyPlan?.length) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[13px] text-apple-gray">No plan to display. Set your exam date in Settings.</p>
      </div>
    );
  }

  const dp     = plan.dailyPlan;
  const maxDay = Math.max(...dp.map(d => d.day));
  const dayMap = Object.fromEntries(dp.map(d => [d.day, d]));
  const total  = Math.ceil(maxDay / 7) * 7;
  const weeks  = [];
  for (let s = 1; s <= total; s += 7) {
    weeks.push(Array.from({ length: 7 }, (_, i) => s + i));
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">Monthly Overview</p>
          <p className="text-[12px] text-apple-gray mt-0.5">{maxDay}-day plan · Day 1 = today</p>
        </div>
        <div className="flex gap-4 text-[11px] text-apple-gray3 mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-apple-blue/15 border border-apple-blue/30 inline-block"/> Today</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-apple-green/15 border border-apple-green/25 inline-block"/> Done</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-apple-gray5 inline-block"/> Planned</span>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DAY_NAMES.map(n => (
          <p key={n} className="text-center text-[10px] mono uppercase text-apple-gray3">{n}</p>
        ))}
      </div>

      {/* Calendar */}
      <div className="space-y-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map(dayNum => {
              const d     = dayMap[dayNum];
              const date  = dayToDate(dayNum);
              const oor   = dayNum > maxDay && !d;
              const today = dayNum === 1;
              return (
                <div key={dayNum} className={`rounded-apple-lg p-2 min-h-[80px] border transition-colors ${
                  d?.completed ? "bg-apple-green/8 border-apple-green/20" :
                  today        ? "bg-apple-blue/8 border-apple-blue/30" :
                  d            ? "bg-white border-apple-gray5" :
                  oor          ? "bg-transparent border-transparent" :
                                 "bg-apple-gray6/40 border-apple-gray5/40"
                }`}>
                  {!oor && (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-[13px] font-bold leading-none ${
                            today ? "text-apple-blue" : d ? "text-[var(--label)]" : "text-apple-gray3"
                          }`}>{dayNum}</p>
                          <p className="text-[8px] text-apple-gray3 mt-0.5">{fmtShort(date)}</p>
                        </div>
                        {d?.completed && (
                          <div className="w-4 h-4 rounded-full bg-apple-green flex items-center justify-center shrink-0">
                            <CheckIcon size={8} />
                          </div>
                        )}
                      </div>
                      {d ? (
                        <div className="mt-1.5 space-y-0.5">
                          {d.topics.slice(0, 2).map(t => (
                            <div key={t} className="text-[8px] px-1.5 py-0.5 rounded-full truncate font-medium"
                              style={{ background: topicColor(t) + "20", color: topicColor(t) }}>
                              {t}
                            </div>
                          ))}
                          {d.topics.length > 2 && <p className="text-[8px] text-apple-gray3">+{d.topics.length - 2}</p>}
                          <p className="text-[8px] text-apple-gray3">{d.estimatedHours}h</p>
                        </div>
                      ) : (
                        <p className="text-[8px] text-apple-gray3 mt-2">Rest</p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Topic legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-4 border-t border-apple-gray5">
        {[...new Set(dp.flatMap(d => d.topics))].map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: topicColor(t) }} />
            <span className="text-[11px] text-apple-gray">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── TOPIC ORDER EDITOR ─────────────────────────────────── */
function TopicEditor({ plan, onSaved }) {
  const allTopics = [...new Set((plan?.dailyPlan || []).flatMap(d => d.topics))];

  // Count how many days each topic appears
  const topicDays = {};
  (plan?.dailyPlan || []).forEach(d => d.topics.forEach(t => {
    topicDays[t] = (topicDays[t] || 0) + 1;
  }));

  const initial = plan?.customTopicOrder?.length
    ? [
        ...plan.customTopicOrder.filter(t => allTopics.includes(t)),
        ...allTopics.filter(t => !plan.customTopicOrder.includes(t)),
      ]
    : allTopics;

  const [order,  setOrder]  = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const move = (i, dir) => {
    const arr = [...order];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setOrder(arr); setSaved(false);
  };
  const moveToTop = (i) => {
    const arr = [...order];
    const [item] = arr.splice(i, 1);
    arr.unshift(item);
    setOrder(arr); setSaved(false);
  };
  const handleReset  = () => { setOrder([...allTopics]); setSaved(false); };
  const handleSave   = async () => {
    setSaving(true);
    try {
      await saveTopicOrder(order);
      setSaved(true);
      setTimeout(() => { setSaved(false); onSaved(); }, 800);
    } catch {}
    setSaving(false);
  };

  if (!allTopics.length) return <p className="text-[13px] text-apple-gray p-5">No topics in plan yet.</p>;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="section-label">Customize Topic Order</p>
          <p className="text-[13px] text-apple-gray mt-1">
            Drag topics into the order you want to cover them. Your plan regenerates automatically when you save.
          </p>
        </div>
        <button onClick={handleReset}
          className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors shrink-0 ml-4 px-3 py-1.5 rounded-apple-lg hover:bg-apple-blue/6">
          ↺ Reset to AI order
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {order.map((topic, i) => {
          const color = topicColor(topic);
          const days  = topicDays[topic] || 0;
          return (
            <div key={topic}
              className="flex items-center gap-3 p-3 rounded-apple-xl border border-apple-gray5 bg-apple-gray6/50 hover:bg-white hover:shadow-apple transition-all">
              {/* Rank */}
              <span className="text-[12px] mono font-bold text-apple-gray3 w-6 text-center shrink-0">{i + 1}</span>
              {/* Colour dot */}
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
              {/* Name */}
              <span className="flex-1 text-[14px] font-medium text-[var(--label)] truncate">{topic}</span>
              {/* Days count */}
              <span className="text-[11px] mono text-apple-gray3 shrink-0">{days}d</span>
              {/* Priority badge */}
              {i < 3 && (
                <span className="text-[10px] mono px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: color + "18", color }}>
                  {["First","Second","Third"][i]}
                </span>
              )}
              {/* Controls */}
              <div className="flex items-center gap-0.5 shrink-0">
                {[["⇈","Move to top", () => moveToTop(i), i === 0],
                  ["↑","Move up",    () => move(i,-1),    i === 0],
                  ["↓","Move down",  () => move(i, 1),    i === order.length - 1],
                ].map(([icon, title, fn, disabled]) => (
                  <button key={icon} title={title} onClick={fn} disabled={disabled}
                    className="w-7 h-7 rounded-apple flex items-center justify-center text-[12px] text-apple-gray hover:bg-apple-blue/10 hover:text-apple-blue disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-apple-gray5">
        <p className="text-[12px] text-apple-gray">
          {plan?.hasCustomOrder ? "✏ Custom order active." : "Using AI-generated order."}
          &nbsp;The number after each topic is how many days it takes to cover.
        </p>
        <button onClick={handleSave} disabled={saving || saved}
          className={`btn-primary text-[13px] py-2 px-5 transition-all ${saved ? "!bg-apple-green" : ""}`}>
          {saved ? "✓ Saved! Regenerating…" : saving ? "Saving…" : "Save & regenerate plan"}
        </button>
      </div>
    </div>
  );
}

/* ─── REVISION DUE ───────────────────────────────────────── */
function RevisionDue({ topics, onRevised, navigate }) {
  const [marking, setMarking] = useState(null);

  if (!topics?.length) return null;

  const stageLabel = (stage) => {
    const labels = ["1st rev.", "2nd rev.", "3rd rev.", "4th rev.", "Final rev."];
    return labels[stage] || "Revision";
  };

  const stageColor = (stage) => {
    const colors = ["#FF3B30", "#FF9500", "#FF6B00", "#007AFF", "#34C759"];
    return colors[stage] || "#FF9500";
  };

  const handleMark = async (topic) => {
    setMarking(topic);
    try {
      await markRevised(topic);
      onRevised(topic);
    } catch {}
    setMarking(null);
  };

  return (
    <div className="card p-5 border-l-4" style={{ borderLeftColor: "#FF9500" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[16px]">🔁</span>
          <p className="text-[14px] font-semibold text-[var(--label)]">Revision Due</p>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF9500] text-white text-[11px] font-bold">
            {topics.length}
          </span>
        </div>
        <p className="text-[11px] text-apple-gray">Spaced repetition — review these today</p>
      </div>

      <div className="flex flex-col gap-2">
        {topics.map((t) => (
          <div key={t.topic}
            className="flex items-center gap-3 p-3 rounded-apple-xl border border-apple-gray5 bg-apple-gray6/40 hover:bg-white hover:shadow-apple transition-all">

            {/* stage dot */}
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stageColor(t.revisionStage) }} />

            {/* topic + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-medium text-[var(--label)] truncate">{t.topic}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: stageColor(t.revisionStage) + "18", color: stageColor(t.revisionStage) }}>
                  {stageLabel(t.revisionStage)}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {/* accuracy bar */}
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-1.5 bg-apple-gray5 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${t.accuracy}%`, background: t.accuracy >= 70 ? "#34C759" : t.accuracy >= 50 ? "#FF9500" : "#FF3B30" }} />
                  </div>
                  <span className="text-[11px] text-apple-gray">{t.accuracy}%</span>
                </div>
                <span className="text-[11px] text-apple-gray3">
                  {t.daysSince === 0 ? "today" : `${t.daysSince}d ago`}
                </span>
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => navigate("/practice", { state: { topic: t.topic } })}
                className="btn-primary text-[12px] py-1.5 px-3">
                Revise →
              </button>
              <button
                onClick={() => handleMark(t.topic)}
                disabled={marking === t.topic}
                className="btn-secondary text-[12px] py-1.5 px-3">
                {marking === t.topic ? "…" : "Done"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NCERT CHAPTER PROGRESS ─────────────────────────────── */
function NcertProgress({ chapters, studiedSet, navigate }) {
  if (!chapters.length) return null;
  const totalTopics   = chapters.reduce((s, c) => s + c.total, 0);
  const studiedTopics = chapters.reduce((s, c) => s + c.studied, 0);
  const overallPct    = totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0;

  // Group by subject when multiple subjects present
  const subjectGroups = chapters.reduce((acc, ch) => {
    const sub = ch.subject || "Mathematics";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(ch);
    return acc;
  }, {});
  const subjectKeys    = Object.keys(subjectGroups);
  const multiSubject   = subjectKeys.length > 1;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="section-label">NCERT Chapter Progress</p>
        <span className="text-[13px] font-bold" style={{ color: overallPct === 100 ? "#34C759" : "#007AFF" }}>
          {studiedTopics}/{totalTopics} topics · {overallPct}%
        </span>
      </div>
      {/* Overall bar */}
      <div className="h-2 bg-apple-gray5 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${overallPct}%`, background: overallPct === 100 ? "#34C759" : "linear-gradient(90deg,#007AFF,#5AC8FA)" }} />
      </div>
      {/* Per-chapter rows, optionally grouped by subject */}
      <div className="flex flex-col gap-4">
        {subjectKeys.map((sub) => (
          <div key={sub}>
            {multiSubject && (
              <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-2">{sub}</p>
            )}
            <div className="flex flex-col gap-3">
              {subjectGroups[sub].map((ch) => {
                const pct = ch.total > 0 ? Math.round((ch.studied / ch.total) * 100) : 0;
                return (
                  <div key={ch.chapterId}>
                    <div className="flex items-center justify-between mb-1">
                      <button
                        onClick={() => navigate(`/ncert/chapters/${ch.chapterId}`)}
                        className="text-[13px] font-medium text-[var(--label)] truncate text-left hover:text-apple-blue transition-colors flex-1 mr-2"
                      >
                        Ch {ch.number}. {ch.title}
                      </button>
                      <span className="text-[11px] font-semibold shrink-0" style={{ color: pct === 100 ? "#34C759" : "#86868B" }}>
                        {ch.studied}/{ch.total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-apple-gray5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: pct === 100 ? "#34C759" : "#007AFF" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function Planner() {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);
  const [plan,             setPlan]             = useState(null);
  const [revisionDue,      setRevisionDue]      = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [completing,       setCompleting]       = useState(null);
  const [view,             setView]             = useState("daily");
  const [showEditor,       setShowEditor]       = useState(false);
  const [showSettings,     setShowSettings]     = useState(false);
  const [showDeleteConfirm,setShowDeleteConfirm]= useState(false);
  const [deleting,         setDeleting]         = useState(false);
  const [rescheduling,     setRescheduling]     = useState(false);
  const [sharing,          setSharing]          = useState(false);
  const [shareMsg,         setShareMsg]         = useState("");
  const [showCreateNew,    setShowCreateNew]    = useState(false);
  const [allPlans,         setAllPlans]         = useState([]);
  const [ncertChapters,    setNcertChapters]    = useState([]);
  const [studiedSet,       setStudiedSet]       = useState(new Set());

  const applyPlan = (data) => {
    setPlan(data);
    setRevisionDue(data.revisionDue || []);
  };

  const loadPlan = useCallback(() => {
    setLoading(true);
    Promise.all([getPlan(), listStudyPlans()])
      .then(([planRes, listRes]) => {
        applyPlan(planRes.data);
        setAllPlans(listRes.data?.data || []);
      })
      .catch(() => { setPlan({ empty: true }); setAllPlans([]); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  // Load NCERT chapter list + studied topics in parallel (supports multiple subjects)
  useEffect(() => {
    const SUBJECT_MAP = { Math: "Mathematics", Science: "Science", English: "English", "Social Science": "Social Science", Hindi: "Hindi" };
    const grade    = user?.grade || "10";
    const rawSubs  = user?.subjects?.length ? user.subjects : [user?.subject || "Math"];
    const subjects = rawSubs.map((s) => SUBJECT_MAP[s] || s);
    Promise.all([
      ...subjects.map((s) => listNcertChapters(s, grade).catch(() => ({ data: { data: [] } }))),
      getStudiedTopics().catch(() => ({ data: { data: [] } })),
    ]).then((results) => {
      const stRes   = results[results.length - 1];
      const studied = new Set(stRes.data?.data || []);
      setStudiedSet(studied);
      const allChapterResults = results.slice(0, -1);
      const chapters = allChapterResults.flatMap((chRes) =>
        (chRes.data?.data || []).map((ch) => {
          const allTopicIds = (ch.subchapters || []).flatMap((sc) =>
            (sc.concepts || []).flatMap((c) => (c.topics || []).map((t) => t.id))
          );
          return {
            chapterId: ch.chapterId,
            number:    ch.number,
            title:     ch.title,
            subject:   ch.subject,
            total:     allTopicIds.length,
            studied:   allTopicIds.filter((id) => studied.has(id)).length,
          };
        })
      ).filter((ch) => ch.total > 0);
      setNcertChapters(chapters);
    });
  }, [user?.subjects, user?.subject, user?.grade]);

  const handleComplete = async (day) => {
    setCompleting(day);
    try {
      await markDayComplete(day);
      setPlan(p => ({
        ...p,
        dailyPlan: p.dailyPlan.map(d => d.day === day ? { ...d, completed: true } : d),
      }));
    } catch {}
    setCompleting(null);
  };

  const handleOrderSaved = () => { setShowEditor(false); loadPlan(); };

  const handleReschedule = async () => {
    setRescheduling(true);
    try { const { data } = await reschedulePlan(); applyPlan(data); }
    catch {}
    setRescheduling(false);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const { data } = await generateShareToken();
      const url = `${window.location.origin}/shared-plan/${data.data.shareToken}`;
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied!");
      setTimeout(() => setShareMsg(""), 3000);
    } catch { setShareMsg("Could not copy link"); }
    setSharing(false);
  };

  const handleSwitchPlan = async (planId) => {
    setLoading(true);
    try {
      const { data } = await getPlanById(planId);
      applyPlan(data);
      setAllPlans(prev => prev.map(p => ({ ...p, isActive: p.planId === planId })));
      await activatePlan(planId).catch(() => {});
    } catch {}
    setLoading(false);
  };

  const handleDeletePlan = async () => {
    setDeleting(true);
    try {
      await deleteStudyPlan(plan.planId);
      setAllPlans(prev => prev.filter(p => p.planId !== plan.planId));
      const remaining = allPlans.filter(p => p.planId !== plan.planId);
      if (remaining.length > 0) {
        const { data } = await getPlanById(remaining[0].planId);
        applyPlan(data);
        await activatePlan(remaining[0].planId).catch(() => {});
      } else {
        setPlan({ empty: true });
      }
      setShowDeleteConfirm(false);
    } catch {}
    setDeleting(false);
  };

  /* ── loading ── */
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading your study plan…</p>
      </div>
    </div>
  );

  /* ── no plan yet OR creating new ── */
  if (plan?.empty || showCreateNew) return (
    <CreatePlanCard user={user} onCreated={(data) => {
      applyPlan(data);
      setShowCreateNew(false);
      setAllPlans(prev => [...prev.filter(p => !p.isActive), { planId: data.planId, name: data.planName, subjects: data.planSubjects, grade: data.planGrade, goal: data.planGoal, examDate: data.planExamDate, isActive: true, progress: 0, totalDays: data.dailyPlan?.length || 0 }]);
    }} />
  );

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const missedDays = (plan?.dailyPlan || []).filter(d => !d.completed && new Date(d.date) < today).length;

  const totalDays = plan?.dailyPlan?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── Plan switcher ── */}
      {allPlans.length > 0 && (
        <PlanSwitcher
          plans={allPlans}
          activePlanId={plan?.planId}
          onSwitch={handleSwitchPlan}
          onCreate={() => setShowCreateNew(true)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">
            {plan?.planName || "Study Plan"}
          </h1>
          <p className="text-[14px] text-apple-gray mt-0.5 flex items-center flex-wrap gap-2">
            {plan?.daysLeft != null ? `${plan.daysLeft} days until exam` : ""}
            {plan?.planGoal && <span className="badge bg-apple-blue/10 text-apple-blue">{GOAL_LABEL[plan.planGoal] || plan.planGoal}</span>}
            {plan?.planSubjects?.length > 0 && <span className="badge bg-apple-gray5 text-apple-gray">{plan.planSubjects.join(", ")}</span>}
            {plan?.hoursPerDay && <span className="badge bg-apple-gray5 text-apple-gray">{plan.hoursPerDay}h/day</span>}
            {plan?.hasCustomOrder && <span className="badge bg-[#AF52DE]/10 text-[#AF52DE]">Custom order</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {totalDays > 0 && (
            <div className="flex bg-apple-gray6 rounded-apple-xl p-1 gap-0.5">
              <ViewTab label="Daily"   active={view === "daily"}   onClick={() => setView("daily")} />
              <ViewTab label="Weekly"  active={view === "weekly"}  onClick={() => setView("weekly")} />
              <ViewTab label="Monthly" active={view === "monthly"} onClick={() => setView("monthly")} />
            </div>
          )}
          {totalDays > 0 && (
            <button onClick={() => setShowEditor(v => !v)}
              className={`text-[13px] font-medium px-4 py-2 rounded-apple-xl border transition-all ${showEditor ? "bg-apple-blue text-white border-apple-blue" : "bg-white border-apple-gray5 text-[var(--label)] hover:border-apple-blue/40 shadow-apple"}`}>
              {showEditor ? "✕ Topic order" : "✏ Topic order"}
            </button>
          )}
          <button onClick={handleShare} disabled={sharing}
            className="text-[13px] font-medium px-4 py-2 rounded-apple-xl border border-apple-gray5 bg-white text-[var(--label)] hover:border-apple-blue/40 shadow-apple transition-all">
            {shareMsg || (sharing ? "…" : "🔗 Share")}
          </button>
          <button onClick={() => setShowSettings(true)}
            className="text-[13px] font-medium px-4 py-2 rounded-apple-xl border border-apple-gray5 bg-white text-[var(--label)] hover:border-apple-blue/40 shadow-apple transition-all">
            ⚙ Edit plan
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="text-[13px] font-medium px-3 py-2 rounded-apple-xl border border-apple-red/30 text-apple-red hover:bg-apple-red/6 transition-all">
            Delete
          </button>
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-[var(--bg)] rounded-apple-xl shadow-apple-xl w-full max-w-sm p-6 space-y-4">
            <p className="text-[17px] font-bold text-[var(--label)]">Delete study plan?</p>
            <p className="text-[13px] text-apple-gray leading-relaxed">
              This will remove your plan and all progress data. You can create a new one any time.
            </p>
            <div className="flex gap-2 pt-1">
              <button className="btn-secondary flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button
                className="flex-1 bg-apple-red text-white text-[13px] font-semibold py-2 rounded-apple disabled:opacity-40"
                disabled={deleting}
                onClick={handleDeletePlan}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit settings modal ── */}
      {showSettings && (
        <PlanSettingsModal
          plan={plan}
          onSaved={(data) => { applyPlan(data); setShowSettings(false); }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* ── Catch-up banner ── */}
      {missedDays > 0 && !showEditor && (
        <CatchUpBanner missedCount={missedDays} rescheduling={rescheduling} onReschedule={handleReschedule} />
      )}

      {/* ── Phase legend ── */}
      {totalDays > 0 && (
        <div className="flex gap-3 flex-wrap">
          {Object.entries(PHASE_COLORS).map(([key, val]) => (
            <span key={key} style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: val.bg, color: val.color }}>
              {val.label}
            </span>
          ))}
        </div>
      )}

      {/* ── Summary bar ── */}
      <SummaryBar plan={plan} />

      {/* ── NCERT chapter progress ── */}
      <NcertProgress chapters={ncertChapters} studiedSet={studiedSet} navigate={navigate} />

      {/* ── Revision due ── */}
      {!showEditor && (
        <RevisionDue
          topics={revisionDue}
          navigate={navigate}
          onRevised={(topic) => setRevisionDue(prev => prev.filter(t => t.topic !== topic))}
        />
      )}

      {/* ── Today's focus ── */}
      {!showEditor && (
        <TodayFocus plan={plan} completing={completing} onComplete={handleComplete} navigate={navigate} />
      )}

      {/* ── Topic editor ── */}
      {showEditor && <TopicEditor plan={plan} onSaved={handleOrderSaved} />}

      {/* ── Priority topics + skip suggestions (when editor closed) ── */}
      {!showEditor && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="section-label">Priority Topics</p>
            {plan?.priorityTopics?.length > 0 ? (
              <div className="flex flex-col gap-3 mt-3">
                {plan.priorityTopics.map((t, i) => (
                  <div key={t.topic} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[12px] font-bold text-apple-gray3 w-5 shrink-0">#{i + 1}</span>
                      <span className="text-[13px] font-medium text-[var(--label)] truncate">{t.topic}</span>
                      {t.isWeak && <span className="badge bg-apple-red/10 text-apple-red shrink-0">Weak</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 bg-apple-gray5 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-apple-blue rounded-full"
                          style={{ width: `${Math.round(t.priority * 100)}%` }} />
                      </div>
                      <span className="text-[11px] mono text-apple-gray w-8 text-right">
                        {Math.round(t.priority * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-apple-gray mt-3">
                Complete some practice to generate priorities.
              </p>
            )}
          </div>

          <div className="card p-5">
            <p className="section-label">Skip Suggestions</p>
            {plan?.skipSuggestions?.length > 0 ? (
              <div className="flex flex-col gap-3 mt-3">
                {plan.skipSuggestions.map(s => (
                  <div key={s.topic}
                    className="p-3 bg-apple-yellow/6 border border-apple-yellow/20 rounded-apple-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-[var(--label)]">{s.topic}</span>
                      <span className="badge bg-apple-yellow/10 text-apple-yellow">−{s.marksLost} marks</span>
                    </div>
                    <p className="text-[12px] text-apple-gray">{s.reason}</p>
                    <p className="text-[11px] text-apple-gray3 mt-1">Effort: {s.effort}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-apple-gray mt-3">
                No skip suggestions — all topics are worthwhile!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Plan view ── */}
      {view === "daily"   && <DailyView   plan={plan} completing={completing} onComplete={handleComplete} navigate={navigate} onNoteUpdate={(dayN, note) => setPlan(p => ({ ...p, dailyPlan: p.dailyPlan.map(x => x.day === dayN ? { ...x, note } : x) }))} />}
      {view === "weekly"  && <WeeklyView  plan={plan} completing={completing} onComplete={handleComplete} navigate={navigate} />}
      {view === "monthly" && <MonthlyView plan={plan} />}

    </div>
  );
}
