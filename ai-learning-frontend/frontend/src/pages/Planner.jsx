import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPlan, markDayComplete, saveTopicOrder, markRevised } from "../services/api";

const GOAL_LABEL = {
  pass:        "Pass the exam",
  distinction: "Score 75%+",
  top:         "Top 90%+",
  scholarship: "Scholarship rank",
};

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
function DailyView({ plan, completing, onComplete, navigate }) {
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
              <div key={d.day} className={`flex items-center justify-between p-4 rounded-apple-xl border transition-all ${
                d.completed  ? "border-apple-green/25 bg-apple-green/6" :
                isToday      ? "border-apple-blue/30 bg-apple-blue/4 shadow-apple" :
                               "border-apple-gray5 hover:border-apple-blue/25 hover:bg-apple-blue/3"
              }`}>
                <div className="flex items-center gap-4">
                  <div className="text-center w-12 shrink-0">
                    <p className="text-[9px] mono uppercase text-apple-gray3">{DAY_NAMES[date.getDay()]}</p>
                    <p className="text-[20px] font-bold text-[var(--label)] leading-tight">{d.day}</p>
                    <p className="text-[9px] text-apple-gray3">{fmtShort(date)}</p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {d.topics.map(t => <TopicBadge key={t} topic={t} />)}
                    </div>
                    <p className="text-[12px] text-apple-gray">~{d.estimatedHours}h</p>
                  </div>
                </div>
                <DayActions day={d} isToday={isToday} completing={completing}
                  onComplete={onComplete} navigate={navigate} topics={d.topics} />
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

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function Planner() {
  const navigate = useNavigate();
  const [plan,         setPlan]         = useState(null);
  const [revisionDue,  setRevisionDue]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [completing,   setCompleting]   = useState(null);
  const [view,         setView]         = useState("daily");   // daily | weekly | monthly
  const [showEditor,   setShowEditor]   = useState(false);

  const loadPlan = useCallback(() => {
    setLoading(true);
    getPlan()
      .then(r => { setPlan(r.data); setRevisionDue(r.data.revisionDue || []); })
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

  const handleOrderSaved = () => { setShowEditor(false); loadPlan(); };

  /* ── loading ── */
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Building your study plan…</p>
      </div>
    </div>
  );

  const totalDays = plan?.dailyPlan?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Study Planner</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">
            {plan?.daysLeft != null
              ? `${plan.daysLeft} days until your exam.`
              : "Set your exam date in Settings for a personalised plan."}
            {plan?.goal && (
              <span className="ml-2 badge bg-apple-blue/10 text-apple-blue">
                Goal: {GOAL_LABEL[plan.goal] || plan.goal}
              </span>
            )}
            {plan?.hasCustomOrder && (
              <span className="ml-2 badge bg-[#AF52DE]/10 text-[#AF52DE]">Custom order</span>
            )}
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
              className={`text-[13px] font-medium px-4 py-2 rounded-apple-xl border transition-all ${
                showEditor
                  ? "bg-apple-blue text-white border-apple-blue"
                  : "bg-white border-apple-gray5 text-[var(--label)] hover:border-apple-blue/40 shadow-apple"
              }`}>
              {showEditor ? "✕ Close editor" : "✏ Edit topic order"}
            </button>
          )}
        </div>
      </div>

      {/* ── Summary bar ── */}
      <SummaryBar plan={plan} />

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
      {view === "daily"   && <DailyView   plan={plan} completing={completing} onComplete={handleComplete} navigate={navigate} />}
      {view === "weekly"  && <WeeklyView  plan={plan} completing={completing} onComplete={handleComplete} navigate={navigate} />}
      {view === "monthly" && <MonthlyView plan={plan} />}

    </div>
  );
}
