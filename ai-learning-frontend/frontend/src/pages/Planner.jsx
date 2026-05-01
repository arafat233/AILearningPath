import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPlan, markDayComplete, saveTopicOrder } from "../services/api";

const GOAL_LABEL = {
  pass:        "Pass the exam",
  distinction: "Score 75%+",
  top:         "Top 90%+",
  scholarship: "Scholarship rank",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const dayToDate = (dayNum) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayNum - 1);
  return d;
};
const fmtShort = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;

/* ── Topic colour palette ── */
const TOPIC_COLORS = [
  "#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30",
  "#5AC8FA","#5856D6","#FF2D55","#30B0C7","#E3A900",
];
const topicColor = (() => {
  const cache = {};
  let idx = 0;
  return (t) => { if (!cache[t]) cache[t] = TOPIC_COLORS[idx++ % TOPIC_COLORS.length]; return cache[t]; };
})();

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function ViewTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-[13px] font-medium rounded-apple-lg transition-all ${
        active
          ? "bg-white shadow-apple text-[var(--label)]"
          : "text-apple-gray hover:text-[var(--label)]"
      }`}
    >
      {label}
    </button>
  );
}

function TopicBadge({ topic, small }) {
  const color = topicColor(topic);
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${small ? "text-[10px] px-1.5 py-0.5" : "text-[12px] px-2.5 py-1"}`}
      style={{ background: color + "18", color }}
    >
      {topic}
    </span>
  );
}

/* ── Daily View ── */
function DailyView({ plan, completing, onComplete, navigate }) {
  if (!plan?.dailyPlan?.length) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-1">No plan yet</p>
        <p className="text-[13px] text-apple-gray">Set your exam date in Settings to generate a daily plan.</p>
      </div>
    );
  }

  const completedCount = plan.dailyPlan.filter(d => d.completed).length;
  const totalDays = plan.dailyPlan.length;
  const progress = Math.round((completedCount / totalDays) * 100);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-medium text-[var(--label)]">Overall progress</p>
          <span className="text-[13px] font-semibold text-apple-blue">{completedCount}/{totalDays} days</span>
        </div>
        <div className="h-2 bg-apple-gray5 rounded-full overflow-hidden">
          <div
            className="h-full bg-apple-blue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-apple-gray3 mt-1.5">{progress}% complete</p>
      </div>

      {/* Days list */}
      <div className="card p-5">
        <p className="section-label mb-4">
          Daily Schedule — {totalDays} day{totalDays !== 1 ? "s" : ""} planned
        </p>
        <div className="flex flex-col gap-2.5">
          {plan.dailyPlan.map((d) => {
            const date = dayToDate(d.day);
            const isToday = d.day === 1;
            return (
              <div
                key={d.day}
                className={`flex items-center justify-between p-4 rounded-apple-xl border transition-all ${
                  d.completed
                    ? "border-apple-green/25 bg-apple-green/6"
                    : isToday
                    ? "border-apple-blue/30 bg-apple-blue/4 shadow-apple"
                    : "border-apple-gray5 hover:border-apple-blue/25 hover:bg-apple-blue/3"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Day number + date */}
                  <div className="text-center w-12 shrink-0">
                    <p className="text-[9px] mono uppercase text-apple-gray3">{DAY_NAMES[date.getDay()]}</p>
                    <p className="text-[20px] font-bold text-[var(--label)] leading-tight">{d.day}</p>
                    <p className="text-[9px] text-apple-gray3">{fmtShort(date)}</p>
                  </div>
                  {/* Topics + meta */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {d.topics.map(t => <TopicBadge key={t} topic={t} />)}
                    </div>
                    <p className="text-[12px] text-apple-gray">~{d.estimatedHours}h estimated</p>
                  </div>
                </div>
                {/* Action */}
                <div className="shrink-0 ml-3">
                  {d.completed ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-apple-green flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[12px] font-medium text-apple-green">Done</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {isToday && (
                        <button
                          onClick={() => navigate("/practice", {
                            state: { topic: d.topics[0], mixTopics: d.topics }
                          })}
                          className="btn-primary text-[12px] py-1.5 px-3"
                        >
                          Start →
                        </button>
                      )}
                      <button
                        onClick={() => onComplete(d.day)}
                        disabled={completing === d.day}
                        className="btn-secondary text-[12px] py-1.5 px-3"
                      >
                        {completing === d.day ? "…" : "Mark done"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Monthly Calendar View ── */
function MonthlyView({ plan }) {
  if (!plan?.dailyPlan?.length) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[13px] text-apple-gray">No plan to display. Set your exam date in Settings.</p>
      </div>
    );
  }

  const days = plan.dailyPlan;
  const maxDay = Math.max(...days.map(d => d.day));
  const dayMap = Object.fromEntries(days.map(d => [d.day, d]));

  // Build calendar rows of 7
  const totalCells = Math.ceil(maxDay / 7) * 7;
  const weeks = [];
  for (let start = 1; start <= totalCells; start += 7) {
    weeks.push(Array.from({ length: 7 }, (_, i) => start + i));
  }

  return (
    <div className="card p-5">
      <p className="section-label mb-1">Monthly Overview</p>
      <p className="text-[13px] text-apple-gray mb-5">
        {maxDay}-day plan · Day 1 starts today
      </p>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DAY_NAMES.map(n => (
          <p key={n} className="text-center text-[10px] mono uppercase text-apple-gray3 tracking-wider">{n}</p>
        ))}
      </div>

      {/* Weeks */}
      <div className="space-y-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map(dayNum => {
              const d = dayMap[dayNum];
              const date = dayToDate(dayNum);
              const isToday = dayNum === 1;
              const isPast = dayNum < 1;
              const isOutOfRange = dayNum > maxDay && !d;

              return (
                <div
                  key={dayNum}
                  className={`rounded-apple-lg p-2 min-h-[76px] border transition-colors ${
                    d?.completed  ? "bg-apple-green/8 border-apple-green/20" :
                    isToday       ? "bg-apple-blue/8 border-apple-blue/30" :
                    d             ? "bg-white border-apple-gray5" :
                    isOutOfRange  ? "bg-transparent border-transparent" :
                    "bg-apple-gray6 border-apple-gray5/50"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-[14px] font-bold leading-none ${
                        isToday ? "text-apple-blue" :
                        d ? "text-[var(--label)]" : "text-apple-gray3"
                      }`}>
                        {isOutOfRange ? "" : dayNum}
                      </p>
                      {!isOutOfRange && (
                        <p className="text-[8px] text-apple-gray3 mt-0.5">{fmtShort(date)}</p>
                      )}
                    </div>
                    {d?.completed && (
                      <div className="w-4 h-4 rounded-full bg-apple-green flex items-center justify-center shrink-0">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l1.5 1.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Topics */}
                  {d && (
                    <div className="mt-1.5 space-y-0.5">
                      {d.topics.slice(0, 2).map(t => (
                        <div
                          key={t}
                          className="text-[8px] px-1.5 py-0.5 rounded-full truncate font-medium"
                          style={{ background: topicColor(t) + "20", color: topicColor(t) }}
                        >
                          {t}
                        </div>
                      ))}
                      {d.topics.length > 2 && (
                        <p className="text-[8px] text-apple-gray3">+{d.topics.length - 2}</p>
                      )}
                      <p className="text-[8px] text-apple-gray3 mt-0.5">{d.estimatedHours}h</p>
                    </div>
                  )}
                  {!d && !isOutOfRange && (
                    <p className="text-[8px] text-apple-gray3 mt-1.5">Rest</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-apple-gray5">
        {[...new Set(plan.dailyPlan.flatMap(d => d.topics))].map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: topicColor(t) }} />
            <span className="text-[11px] text-apple-gray">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Topic Order Editor ── */
function TopicEditor({ plan, onSaved }) {
  const allTopics = [...new Set((plan?.dailyPlan || []).flatMap(d => d.topics))];
  const initial = plan?.customTopicOrder?.length
    ? [
        ...plan.customTopicOrder.filter(t => allTopics.includes(t)),
        ...allTopics.filter(t => !plan.customTopicOrder.includes(t)),
      ]
    : allTopics;

  const [order, setOrder]   = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const move = (i, dir) => {
    const arr = [...order];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setOrder(arr);
    setSaved(false);
  };

  const moveToTop = (i) => {
    const arr = [...order];
    const [item] = arr.splice(i, 1);
    arr.unshift(item);
    setOrder(arr);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTopicOrder(order);
      setSaved(true);
      setTimeout(() => { setSaved(false); onSaved(); }, 800);
    } catch {}
    setSaving(false);
  };

  const handleReset = () => {
    setOrder([...allTopics]);
    setSaved(false);
  };

  if (!allTopics.length) {
    return <p className="text-[13px] text-apple-gray p-5">No topics in plan yet.</p>;
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="section-label">Customize Topic Order</p>
          <p className="text-[13px] text-apple-gray mt-1">
            Choose which topics you want to cover first. Your plan will regenerate with this order.
          </p>
        </div>
        <button onClick={handleReset} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors shrink-0 ml-4">
          Reset to AI order
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {order.map((topic, i) => {
          const inPlan = allTopics.includes(topic);
          const color = topicColor(topic);
          return (
            <div
              key={topic}
              className="flex items-center gap-3 p-3 rounded-apple-xl border border-apple-gray5 bg-apple-gray6/50 hover:bg-white hover:shadow-apple transition-all group"
            >
              {/* Rank */}
              <span className="text-[12px] mono font-bold text-apple-gray3 w-6 text-center shrink-0">
                {i + 1}
              </span>

              {/* Color dot */}
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />

              {/* Topic name */}
              <span className="flex-1 text-[14px] font-medium text-[var(--label)] truncate">{topic}</span>

              {/* Priority badge if top 3 */}
              {i < 3 && (
                <span className="text-[10px] mono px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: color + "18", color }}>
                  {i === 0 ? "First" : i === 1 ? "Second" : "Third"}
                </span>
              )}

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveToTop(i)}
                  disabled={i === 0}
                  title="Move to top"
                  className="w-7 h-7 rounded-apple flex items-center justify-center text-[11px] text-apple-gray hover:bg-apple-blue/10 hover:text-apple-blue disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  ⇈
                </button>
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="w-7 h-7 rounded-apple flex items-center justify-center text-[12px] text-apple-gray hover:bg-apple-blue/10 hover:text-apple-blue disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="w-7 h-7 rounded-apple flex items-center justify-center text-[12px] text-apple-gray hover:bg-apple-blue/10 hover:text-apple-blue disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  ↓
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-apple-gray5">
        <p className="text-[12px] text-apple-gray flex-1">
          {plan?.hasCustomOrder ? "You have a custom order saved." : "Using AI-generated order."}
        </p>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`btn-primary text-[13px] py-2 px-5 transition-all ${saved ? "bg-apple-green hover:bg-apple-green" : ""}`}
        >
          {saved ? "✓ Saved! Regenerating…" : saving ? "Saving…" : "Save & regenerate plan"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Planner() {
  const navigate = useNavigate();
  const [plan,       setPlan]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [completing, setCompleting] = useState(null);
  const [view,       setView]       = useState("daily");   // "daily" | "monthly"
  const [showEditor, setShowEditor] = useState(false);

  const loadPlan = useCallback(() => {
    setLoading(true);
    getPlan()
      .then(r => setPlan(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPlan(); }, [loadPlan]);

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

  const handleOrderSaved = () => {
    setShowEditor(false);
    loadPlan();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Building your study plan…</p>
      </div>
    </div>
  );

  const completedCount = plan?.dailyPlan?.filter(d => d.completed).length || 0;
  const totalDays      = plan?.dailyPlan?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Study Planner</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">
            {plan?.daysLeft != null
              ? `${plan.daysLeft} day${plan.daysLeft !== 1 ? "s" : ""} until your exam.`
              : "Set your exam date in Settings to get a plan."}
            {plan?.goal && (
              <span className="ml-2 badge bg-apple-blue/10 text-apple-blue">
                Goal: {GOAL_LABEL[plan.goal] || plan.goal}
              </span>
            )}
            {plan?.hasCustomOrder && (
              <span className="ml-2 badge bg-apple-purple/10 text-apple-purple">Custom order</span>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View switcher */}
          {totalDays > 0 && (
            <div className="flex bg-apple-gray6 rounded-apple-xl p-1 gap-0.5">
              <ViewTab label="Daily"   active={view === "daily"}   onClick={() => setView("daily")} />
              <ViewTab label="Monthly" active={view === "monthly"} onClick={() => setView("monthly")} />
            </div>
          )}

          {/* Edit topics */}
          {totalDays > 0 && (
            <button
              onClick={() => setShowEditor(v => !v)}
              className={`text-[13px] font-medium px-4 py-2 rounded-apple-xl border transition-all ${
                showEditor
                  ? "bg-apple-blue text-white border-apple-blue"
                  : "bg-white border-apple-gray5 text-[var(--label)] hover:border-apple-blue/40 shadow-apple"
              }`}
            >
              {showEditor ? "✕ Close editor" : "✏ Edit topic order"}
            </button>
          )}
        </div>
      </div>

      {/* ── Topic editor (toggled) ── */}
      {showEditor && (
        <TopicEditor plan={plan} onSaved={handleOrderSaved} />
      )}

      {/* ── Priority Topics + Skip suggestions ── */}
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
                        <div className="h-1.5 bg-apple-blue rounded-full" style={{ width: `${Math.round(t.priority * 100)}%` }} />
                      </div>
                      <span className="text-[11px] mono text-apple-gray w-8 text-right">{Math.round(t.priority * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-apple-gray mt-3">Do some practice to generate priorities.</p>
            )}
          </div>

          <div className="card p-5">
            <p className="section-label">Skip Suggestions</p>
            {plan?.skipSuggestions?.length > 0 ? (
              <div className="flex flex-col gap-3 mt-3">
                {plan.skipSuggestions.map(s => (
                  <div key={s.topic} className="p-3 bg-apple-yellow/6 border border-apple-yellow/20 rounded-apple-lg">
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
              <p className="text-[13px] text-apple-gray mt-3">No skip suggestions — all topics are worthwhile!</p>
            )}
          </div>
        </div>
      )}

      {/* ── Plan view ── */}
      {view === "daily" && (
        <DailyView
          plan={plan}
          completing={completing}
          onComplete={handleComplete}
          navigate={navigate}
        />
      )}
      {view === "monthly" && <MonthlyView plan={plan} />}

    </div>
  );
}
