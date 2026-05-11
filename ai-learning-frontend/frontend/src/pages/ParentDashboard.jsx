import { useEffect, useMemo, useState } from "react";
import {
  getLinkedStudents, getStudyReminders, setStudyReminder, deleteStudyReminder,
  parentDashboardV2, parentSetControls, parentSendMessage, parentCosignGoal,
} from "../services/api";

/* ─── helpers ─────────────────────────────────────────── */
const SUBJECT_COLOR = {
  Math:    "#007AFF",
  Maths:   "#007AFF",
  Science: "#34C759",
  English: "#FF9500",
  "Social Science": "#AF52DE",
  Social:  "#AF52DE",
  Hindi:   "#FF3B30",
};
const initials = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
const fmtDate = (d) => {
  if (!d) return null;
  const x = new Date(d);
  return x.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
};
const daysUntil = (d) => {
  if (!d) return null;
  const t = new Date(d); t.setHours(0,0,0,0);
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((t - now) / 86400000);
};

/* ─── Dots palette for Aria notes ─────────────────────── */
const DOT = { green: "#34C759", blue: "#007AFF", orange: "#FF9500", red: "#FF3B30", pink: "#f0a4cc" };

/* ─── Main ────────────────────────────────────────────── */
export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("overview"); // overview | weekly_digest | privacy | billing
  const [message, setMessage]   = useState("");
  const [goalDraft, setGoalDraft] = useState("");
  const [toast, setToast]       = useState(null);

  // Load linked children
  useEffect(() => {
    getLinkedStudents().then((r) => {
      const list = r.data?.data || r.data || [];
      setChildren(list);
      if (list.length > 0) setActiveId(String(list[0]._id || list[0].id));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Load active child dashboard
  useEffect(() => {
    if (!activeId) return;
    setLoading(true);
    parentDashboardV2(activeId).then((r) => setData(r.data?.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [activeId]);

  const showToast = (msg, kind = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeId) return;
    try {
      await parentSendMessage(activeId, message);
      setMessage("");
      showToast("Message sent");
    } catch { showToast("Send failed", "err"); }
  };

  const handleControl = async (patch) => {
    try {
      const r = await parentSetControls(activeId, patch);
      setData((d) => ({ ...d, parentalControls: r.data?.data?.parentalControls || patch }));
      showToast("Updated");
    } catch { showToast("Update failed", "err"); }
  };

  const handleCosignGoal = async () => {
    if (!goalDraft.trim()) return;
    try { await parentCosignGoal(activeId, goalDraft); setGoalDraft(""); showToast("Goal co-signed"); }
    catch { showToast("Failed", "err"); }
  };

  const exportPdf = () => window.print();

  if (loading && !data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[#7c3aed] rounded-full animate-spin" />
    </div>
  );

  if (children.length === 0) return (
    <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}>
      <p className="text-[16px] font-bold text-[#7c3aed] mb-2">No linked students</p>
      <p className="text-[13px] text-[#8e8e93]">Search a student and link to view their progress.</p>
    </div>
  );

  return (
    <div className="flex gap-6 items-start">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 space-y-5">
        <div>
          <div className="mb-3">
            <p className="text-[14px] font-bold text-[#1c1c1e] leading-tight">Stellar · Family</p>
            <p className="text-[10px] text-[#8e8e93]">parent view</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8e8e93] mb-2">My Children</p>
          <div className="space-y-1">
            {children.map((c) => {
              const id = String(c._id || c.id);
              const isActive = id === activeId;
              return (
                <button key={id} onClick={() => setActiveId(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                    isActive ? "bg-white shadow-sm" : "hover:bg-white/60"
                  }`}>
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                      style={{ background: id.charCodeAt(0) % 2 === 0
                        ? "linear-gradient(135deg, #c8b4f0, #a78bfa)"
                        : "linear-gradient(135deg, #f9a8d4, #f472b6)" }}>
                      {initials(c.name)}
                    </div>
                    {/* Online dot — derived heuristically; real-time presence is a future hook */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34C759] ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{c.name?.split(" ")[0]}</p>
                    <p className="text-[10px] text-[#8e8e93]">Class {c.grade || "—"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8e8e93] mb-2">Settings</p>
          <div className="space-y-0.5">
            {[
              { id: "overview",       label: "Overview" },
              { id: "weekly_digest",  label: "Weekly digest" },
              { id: "controls",       label: "Parental controls" },
              { id: "privacy",        label: "Privacy" },
              { id: "billing",        label: "Billing" },
            ].map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                  tab === s.id ? "bg-white text-[#1c1c1e]" : "text-[#8e8e93] hover:text-[#1c1c1e]"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 space-y-5">
        {tab === "overview" && data && <OverviewPanel data={data} onMessage={handleSendMessage} message={message} setMessage={setMessage} onExport={exportPdf} />}
        {tab === "weekly_digest" && <WeeklyDigestPanel />}
        {tab === "controls" && data && <ControlsPanel controls={data.parentalControls || {}} onUpdate={handleControl} goalDraft={goalDraft} setGoalDraft={setGoalDraft} onCosign={handleCosignGoal} />}
        {tab === "privacy" && <PrivacyPanel />}
        {tab === "billing" && <BillingPanel />}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-[12px] font-semibold text-white ${
          toast.kind === "err" ? "bg-[#FF3B30]" : "bg-[#34C759]"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Overview panel (matches mockup) ────────────────── */
function OverviewPanel({ data, onMessage, message, setMessage, onExport }) {
  const exam = data.child.examDate ? fmtDate(data.child.examDate) : null;
  const days = data.child.examDate ? daysUntil(data.child.examDate) : null;
  const onTrack = (data.predicted?.score || 0) >= 70 && data.concerns.length === 0;

  return (
    <>
      {/* Hero */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-2">
            {data.child.name} · Class {data.child.grade} · This week
          </p>
          <h1 className="text-[34px] sm:text-[40px] font-bold leading-[1.05] text-[#1c1c1e] tracking-tight">
            {onTrack ? "On track for" : "Heads-up for"}{" "}
            <em className="not-italic" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontWeight: 700 }}>
              {exam || (days != null ? `${days} days` : "boards")}.
            </em>
          </h1>
          {days != null && exam && (
            <p className="text-[13px] text-[#8e8e93] mt-2">{days} days remaining</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onExport} className="px-4 py-2 rounded-full bg-white shadow-sm border border-[#f0f0f5] text-[12px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">
            Export PDF
          </button>
          <MessageButton message={message} setMessage={setMessage} onSend={onMessage} childName={data.child.name} />
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" iconBg="#7c3aed14" iconColor="#7c3aed" label="Hours this week" value={data.hours.thisWeek}
          sub={data.hours.delta != null
            ? <span className={data.hours.delta >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"}>{data.hours.delta >= 0 ? "↑" : "↓"} {Math.abs(data.hours.delta)} vs last</span>
            : null} />
        <StatCard icon="🏆" iconBg="#34C75914" iconColor="#34C759" label="Predicted score" value={data.predicted.score}
          sub={`boards · ±${data.predicted.margin}`} />
        <StatCard icon="✨" iconBg="#FF950014" iconColor="#FF9500" label="Concept mastery" value={data.conceptMastery.pct != null ? `${data.conceptMastery.pct}%` : "—"}
          sub={`across ${data.conceptMastery.subjectCount} subjects`} />
        <StatCard icon="✓" iconBg={data.concerns.length === 0 ? "#34C75914" : "#FF3B3014"} iconColor={data.concerns.length === 0 ? "#34C759" : "#FF3B30"}
          label="Concerns" value={data.concerns.length} sub="system flagged" />
      </div>

      {/* Concerns detail */}
      {data.concerns.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-[#FF3B30]/20">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#FF3B30] mb-2">⚠ Flagged this week</p>
          <ul className="space-y-1">
            {data.concerns.map((c) => (
              <li key={c.id} className="text-[12px] text-[#3A3A3C]">• {c.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily study time + Mastery by subject (2 cards) */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Daily study time bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Daily study time</p>
            <p className="text-[10px] text-[#C7C7CC]">min/day · last 7</p>
          </div>
          <DailyStudyChart days={data.dailyStudyTime} />
        </div>

        {/* Mastery by subject */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-4">Mastery by subject</p>
          <div className="space-y-3">
            {data.masteryBySubject.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-[#1c1c1e]">{s.subject === "Math" ? "Maths" : s.subject}</span>
                  <span className="text-[13px] font-bold" style={{ color: SUBJECT_COLOR[s.subject] || "#8E8E93" }}>
                    {s.pct != null ? `${s.pct}%` : "—"}
                  </span>
                </div>
                <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct || 0}%`, background: SUBJECT_COLOR[s.subject] || "#8E8E93" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aria's week timeline */}
      <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
        <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-4">
          {data.child.name?.split(" ")[0]}'s week — what Aria noticed
        </p>
        {data.ariaNotes.length === 0 ? (
          <p className="text-[12px] text-[#8e8e93] py-4 text-center">Not enough activity yet to summarize.</p>
        ) : (
          <div className="space-y-3">
            {data.ariaNotes.map((n, i) => {
              const d = new Date(n.at);
              const day = ["SUN","MON","TUE","WED","THU","FRI","SAT"][d.getDay()];
              const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 shrink-0 text-right">
                    <p className="text-[10px] font-bold tracking-wider text-[#8e8e93]">{day}</p>
                    <p className="text-[10px] text-[#C7C7CC]">{time}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: DOT[n.dot] || DOT.blue }} />
                  <p className="flex-1 text-[13px] text-[#1c1c1e] leading-relaxed">{n.message}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 8-week trend + Time of day */}
      <div className="grid lg:grid-cols-2 gap-4">
        <TrendCard trend={data.trendByWeek} />
        <TimeOfDayCard timeOfDay={data.timeOfDay} />
      </div>

      {/* Mood aggregate */}
      {data.moodHistory.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">Mood this week</p>
          <div className="flex gap-1.5 flex-wrap">
            {data.moodHistory.map((m, i) => (
              <span key={i} className="text-[22px]" title={m.date}>
                {m.mood === "great" ? "😊" : m.mood === "ok" ? "😐" : "😫"}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────── */
function StatCard({ icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8e8e93]">{label}</p>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px]" style={{ background: iconBg, color: iconColor }}>{icon}</span>
      </div>
      <p className="text-[36px] font-bold leading-none text-[#1c1c1e] tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-[#8e8e93] mt-2">{sub}</p>}
    </div>
  );
}

function DailyStudyChart({ days }) {
  const max = Math.max(...days.map((d) => d.minutes), 1);
  return (
    <div className="flex items-end justify-between gap-3 h-44">
      {days.map((d, i) => {
        const h = (d.minutes / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end">
              <div className="w-full rounded-xl transition-all"
                style={{
                  height: `${Math.max(h, 3)}%`,
                  background: d.isToday
                    ? "linear-gradient(180deg, #fbcfe8, #c8b4f0, #fad4a4)"
                    : d.minutes > 0
                      ? "linear-gradient(180deg, #a78bfa, #8b5cf6)"
                      : "transparent",
                  border: d.minutes === 0 ? "1px dashed #E5E5EA" : "none",
                }} />
            </div>
            <div className="text-center">
              <p className={`text-[11px] font-bold ${d.isToday ? "text-[#1c1c1e]" : "text-[#3A3A3C]"}`}>{d.label}</p>
              <p className="text-[10px] text-[#8e8e93]">{d.minutes}m</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrendCard({ trend }) {
  const values = trend.filter((w) => w.accuracy != null);
  if (values.length < 2) return (
    <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">8-week trend</p>
      <p className="text-[12px] text-[#8e8e93] py-6 text-center">Not enough data yet.</p>
    </div>
  );
  const max = Math.max(...values.map((v) => v.accuracy));
  const min = Math.min(...values.map((v) => v.accuracy));
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">8-week accuracy trend</p>
      <div className="flex items-end gap-1 h-20">
        {trend.map((w, i) => {
          const h = w.accuracy != null ? ((w.accuracy - 30) / 70) * 100 : 0;
          return (
            <div key={i} className="flex-1 rounded-t-sm bg-[#7c3aed]/40 transition-all"
              style={{ height: `${Math.max(h, 5)}%`, opacity: w.accuracy != null ? 1 : 0.2 }}
              title={`${w.weekStart}: ${w.accuracy || 0}%`} />
          );
        })}
      </div>
      <p className="text-[11px] text-[#8e8e93] mt-2">Min {min}% · Max {max}%</p>
    </div>
  );
}

function TimeOfDayCard({ timeOfDay }) {
  if (!timeOfDay?.length) return null;
  const max = Math.max(...timeOfDay.map((b) => b.minutes), 1);
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">Time-of-day study pattern</p>
      <div className="flex items-end gap-1 h-20">
        {[0,3,6,9,12,15,18,21].map((h) => {
          const b = timeOfDay.find((x) => x.hour === h);
          const min = b?.minutes || 0;
          const ht = (min / max) * 100;
          return (
            <div key={h} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex-1 w-full flex items-end">
                <div className="w-full rounded-t-sm bg-[#FF9500]/50" style={{ height: `${Math.max(ht, 4)}%` }} title={`${min}m at ${h}:00`} />
              </div>
              <span className="text-[8px] text-[#C7C7CC]">{h}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MessageButton({ message, setMessage, onSend, childName }) {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold hover:bg-[#3A3A3C]">
      Message {childName?.split(" ")[0]}
    </button>
  );
  return (
    <div className="absolute right-4 mt-12 bg-white rounded-2xl shadow-2xl border border-[#f0f0f5] p-4 w-80 z-30">
      <p className="text-[12px] font-bold text-[#1c1c1e] mb-2">Send to {childName?.split(" ")[0]}</p>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Quick encouragement…"
        maxLength={500} rows={3}
        className="w-full text-[13px] px-3 py-2 rounded-lg border border-[#E5E5EA] resize-none focus:outline-none focus:border-[#7c3aed]" />
      <div className="flex gap-2 mt-2">
        <button onClick={() => setOpen(false)} className="flex-1 py-1.5 rounded-lg border border-[#E5E5EA] text-[11px] font-semibold">Cancel</button>
        <button onClick={() => { onSend(); setOpen(false); }} disabled={!message.trim()}
          className="flex-1 py-1.5 rounded-lg bg-[#1c1c1e] text-white text-[11px] font-bold disabled:opacity-50">Send</button>
      </div>
    </div>
  );
}

/* ─── Weekly digest ─────────────────────────────────── */
function WeeklyDigestPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#f0f0f5]">
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-2">Weekly digest</p>
      <h2 className="text-[18px] font-bold text-[#1c1c1e] mb-2">Email every Sunday</h2>
      <p className="text-[13px] text-[#3A3A3C] leading-relaxed mb-4">
        Stellar sends a weekly summary email with study time, accuracy, mood trends, and Aria's insights.
        You can also send one on demand from the Planner page → "Send weekly digest now".
      </p>
      <p className="text-[11px] text-[#8e8e93]">Toggle subscription in Profile → Notifications.</p>
    </div>
  );
}

/* ─── Parental controls panel ───────────────────────── */
function ControlsPanel({ controls, onUpdate, goalDraft, setGoalDraft, onCosign }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] space-y-4">
        <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Parental controls</p>

        <ToggleRow label="Pause AI access" desc="Temporarily disable Aria + voice tutor"
          value={controls.pauseAI} onChange={(v) => onUpdate({ pauseAI: v })} />
        <ToggleRow label="Approve AI doubt threads" desc="Review before child starts a chat"
          value={controls.approveAIThreads} onChange={(v) => onUpdate({ approveAIThreads: v })} />
        <ToggleRow label="Vacation mode" desc="Pause streaks + reminders during holidays"
          value={controls.vacationMode} onChange={(v) => onUpdate({ vacationMode: v })} />

        <div>
          <p className="text-[12px] font-semibold text-[#1c1c1e]">Daily screen-time cap</p>
          <p className="text-[10px] text-[#8e8e93] mb-2">App locks after this many minutes per day. 0 = no cap.</p>
          <input type="number" min={0} max={720} value={controls.screenTimeCapMin || 0}
            onChange={(e) => onUpdate({ screenTimeCapMin: parseInt(e.target.value) || 0 })}
            className="w-24 px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[13px]" /> min/day
        </div>

        <div>
          <p className="text-[12px] font-semibold text-[#1c1c1e]">Quiet hours</p>
          <p className="text-[10px] text-[#8e8e93] mb-2">No notifications during this window.</p>
          <div className="flex items-center gap-2">
            <input type="time" defaultValue={controls.quietHours?.start || "21:00"}
              onBlur={(e) => onUpdate({ quietHours: { ...controls.quietHours, start: e.target.value } })}
              className="px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[12px]" />
            <span className="text-[12px] text-[#8e8e93]">to</span>
            <input type="time" defaultValue={controls.quietHours?.end || "07:00"}
              onBlur={(e) => onUpdate({ quietHours: { ...controls.quietHours, end: e.target.value } })}
              className="px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[12px]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
        <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-2">Co-sign weekly goal</p>
        <p className="text-[12px] text-[#8e8e93] mb-3">A shared commitment between you and your child for this week.</p>
        <div className="flex gap-2">
          <input value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)}
            placeholder="e.g. Finish Trigonometry by Sunday"
            className="flex-1 px-3 py-2 rounded-lg border border-[#E5E5EA] text-[13px]" />
          <button onClick={onCosign} disabled={!goalDraft.trim()}
            className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-[12px] font-bold disabled:opacity-50">Co-sign</button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[#F2F2F7] last:border-0">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[#1c1c1e]">{label}</p>
        <p className="text-[11px] text-[#8e8e93]">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)} className="w-11 h-6 rounded-full relative transition-colors shrink-0"
        style={{ background: value ? "#34C759" : "#E5E5EA" }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }} />
      </button>
    </div>
  );
}

/* ─── Privacy / Billing placeholders ─────────────────── */
function PrivacyPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#f0f0f5] space-y-3">
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Privacy</p>
      <p className="text-[13px] text-[#3A3A3C] leading-relaxed">
        Only data you've been granted access to via your child's Profile → Linked Parents is visible here.
        The child controls visibility per category (scores, streaks, chats) and can revoke at any time.
      </p>
      <p className="text-[12px] text-[#8e8e93]">
        Stellar is GDPR / India-DPDP compliant. We never sell student data.
      </p>
    </div>
  );
}

function BillingPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#f0f0f5]">
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-2">Billing</p>
      <p className="text-[14px] text-[#1c1c1e] font-semibold">Family plan</p>
      <p className="text-[12px] text-[#8e8e93] mt-1">Multi-child access included. Manage subscription in Profile → Plan.</p>
    </div>
  );
}
