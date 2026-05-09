import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReport, getAIAdvice, getAIUsage, getAICacheStats,
  getLinkRequests, respondToLinkRequest,
  submitFeedback, getNpsEligibility, getDailyBrief, getPrediction,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import { DashboardSkeleton } from "../components/Skeleton";

/* ── Constants ───────────────────────────────────────────────────── */

const SUBJECTS = [
  { id: "Math",           label: "Maths",   color: "#007AFF" },
  { id: "Science",        label: "Science", color: "#34C759" },
  { id: "English",        label: "English", color: "#FF9500" },
  { id: "Social Science", label: "Social",  color: "#AF52DE" },
  { id: "Hindi",          label: "Hindi",   color: "#FF3B30" },
];


const PROFILE_STYLE = {
  "Deep Thinker":       { bg: "bg-apple-green/10",  text: "text-apple-green",  dot: "bg-apple-green",  hex: "#34C759" },
  "Pattern Recognizer": { bg: "bg-apple-blue/10",   text: "text-apple-blue",   dot: "bg-apple-blue",   hex: "#007AFF" },
  "Surface Learner":    { bg: "bg-apple-orange/10", text: "text-apple-orange", dot: "bg-apple-orange", hex: "#FF9500" },
  "Overthinker":        { bg: "bg-apple-purple/10", text: "text-apple-purple", dot: "bg-apple-purple", hex: "#AF52DE" },
  "Guesser":            { bg: "bg-apple-red/10",    text: "text-apple-red",    dot: "bg-apple-red",    hex: "#FF3B30" },
};

const PROFILE_DESCRIPTIONS = {
  "Deep Thinker":       "You reason carefully before answering. Work on speed — your accuracy is already strong.",
  "Pattern Recognizer": "You spot shortcuts fast. Spend more time on edge cases and conceptual depth.",
  "Surface Learner":    "You skim through quickly. Slow down and try explaining ideas back in your own words.",
  "Overthinker":        "You second-guess correct answers. Trust your first instinct — it's usually right.",
  "Guesser":            "Too many random attempts skew your data. Build topic foundations before timed practice.",
};

/* ── Helpers ─────────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

function getTimeLabel(hasActivePlan) {
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const h    = new Date().getHours();
  const day  = days[new Date().getDay()];
  const part = h < 12 ? "MORNING" : h < 17 ? "AFTERNOON" : "EVENING";
  const status = hasActivePlan ? "PLAN READY" : "LET'S GO";
  return `${day} ${part} · ${status}`;
}

function heroTopic(brief) {
  const raw = brief?.weakTopics?.[0]?.topic
           || brief?.planProgress?.todayTopics?.[0]
           || null;
  if (!raw) return "today's goals";
  const words = raw.replace(/^(Introduction to|Understanding|Chapter \d+:?)/i, "").trim().split(" ");
  return (words.length > 3 ? words.slice(0, 2).join(" ") : words.join(" ")).toLowerCase();
}

function buildTodayTasks(brief) {
  const tasks = [];
  (brief?.weakTopics || []).slice(0, 2).forEach((t, i) => {
    tasks.push({
      id: `weak-${i}`, title: t.topic,
      detail: `12 questions · ~15 min`, subject: t.subject, topicName: t.topic,
      type: i === 0 ? "practice" : "voice",
    });
  });
  (brief?.revisionDue || []).slice(0, 1).forEach((t) => {
    tasks.push({
      id: `rev-0`, title: `${t.topic} — quick recap`,
      detail: `8 questions · ~10 min`, subject: t.subject, topicName: t.topic,
      type: "revision",
    });
  });
  if (tasks.length < 4) {
    tasks.push({
      id: "spaced", title: "Daily revision (spaced)",
      detail: "4 cards · 6 min", subject: null, topicName: null, type: "spaced",
    });
  }
  return tasks.slice(0, 4);
}

function subjectColor(subjectId) {
  return SUBJECTS.find((s) => s.id === subjectId)?.color || "#8e8e93";
}

function subjectLabel(subjectId) {
  return SUBJECTS.find((s) => s.id === subjectId)?.label || subjectId || "Mixed";
}

/* ── SVG Icons ───────────────────────────────────────────────────── */

const IconFlame = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c0 0-6 5-6 11a6 6 0 0012 0c0-2.5-1.5-4.5-2-6-1 1-1.5 2-1 3-1.5-1-2.5-3-1-5-1 .5-2 2-2 3.5C10.5 6 11 4 12 2z" />
  </svg>
);
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);
const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H3V4h3M18 9h3V4h-3M6 4h12v7a6 6 0 01-12 0V4z"/><path d="M12 15v6M9 21h6"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);
const AriaDot = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
    style={{ background: "linear-gradient(135deg, #c8b4f0, #f0a0cc)" }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>
  </div>
);

/* ── Main Component ──────────────────────────────────────────────── */

export default function Dashboard() {
  const { user, activeChild } = useAuthStore();
  const navigate = useNavigate();
  const child    = activeChild || user;

  const [report,     setReport]     = useState(null);
  const [advice,     setAdvice]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [aiUsage,    setAiUsage]    = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [brief,          setBrief]          = useState(null);
  const [prediction,     setPrediction]     = useState(null);
  const [completedTasks, setCompletedTasks] = useState(() => new Set());

  useEffect(() => {
    getDailyBrief().then((r) => setBrief(r.data?.data)).catch(() => {});
    getPrediction().then((r) => setPrediction(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([getReport(), getAIAdvice(), getAIUsage()])
      .then(([r, a, u]) => {
        setReport(r.data);
        setAdvice(a.data?.advice || null);
        setAiUsage(u.data);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          useAuthStore.getState().logout();
          navigate("/login", { replace: true });
        } else {
          setError("Could not connect to backend. Is it running?");
        }
      })
      .finally(() => setLoading(false));

    if (user?.role === "admin") {
      getAICacheStats().then((r) => setCacheStats(r.data)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const isParentOrTeacher = user?.role === "parent" || user?.role === "teacher";
    if (isParentOrTeacher && !activeChild) navigate("/child-picker", { replace: true });
  }, [activeChild, user]);

  if (loading) return <DashboardSkeleton />;

  if (error) return (
    <div className="card p-10 text-center max-w-md mx-auto mt-16">
      <div className="w-12 h-12 rounded-full bg-apple-red/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-apple-red text-xl">!</span>
      </div>
      <p className="text-[15px] font-semibold text-[var(--label)] mb-1">Connection Error</p>
      <p className="text-[13px] text-apple-gray">{error}</p>
    </div>
  );

  const streak      = report?.streak ?? 0;
  const score       = report?.score  ?? 0;
  const strong      = report?.strongAreas?.length ?? 0;
  const weak        = report?.weakAreas?.length   ?? 0;
  const mastery     = Math.round((strong / Math.max(strong + weak, 1)) * 100);
  const predScore   = prediction?.predictedMin != null
    ? Math.round((prediction.predictedMin + prediction.predictedMax) / 2)
    : null;
  const predMargin  = prediction?.predictedMin != null
    ? Math.round((prediction.predictedMax - prediction.predictedMin) / 2)
    : null;

  const todayTasks     = buildTodayTasks(brief);
  const name           = (child?.name || user?.name || "").split(" ")[0];
  const profile        = PROFILE_STYLE[report?.thinkingProfile];
  const todayPractised = (aiUsage?.used ?? 0) > 0;
  const doneCount      = todayTasks.filter(t => completedTasks.has(t.id)).length;
  const isNewUser      = !report?.totalAttempts;

  const markDone = (id, path, state) => {
    setCompletedTasks(prev => new Set([...prev, id]));
    if (path) navigate(path, state ? { state } : undefined);
  };

  return (
    <div className="space-y-5">

      {/* ── Hero Card ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}
      >
        <p className="text-[11px] font-bold tracking-[0.18em] text-[#1a1040]/60 mb-3 uppercase">
          {getTimeLabel(!!brief?.planProgress)}
        </p>
        <h1 className="text-[44px] sm:text-[52px] font-bold leading-[1.1] text-[#1a1040] mb-3 tracking-tight">
          Hey {name} — let's clear{" "}
          <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontWeight: 400 }}>
            {heroTopic(brief)}
          </span>{" "}
          today.
        </h1>
        <p className="text-[15px] text-[#1a1040]/65 mb-6 max-w-[480px] leading-relaxed">
          {todayTasks.length > 0
            ? `${todayTasks.length} focused ${todayTasks.length === 1 ? "set" : "sets"}. ~${todayTasks.reduce((s,t) => { const m = t.detail.match(/~?(\d+)\s*min/); return s + (m ? +m[1] : 0); }, 0)} minutes. Stellar has spotted your next improvement zone.`
            : "Practice a few topics to let Stellar build your daily plan."}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(brief?.weakTopics?.[0]?.topic ? "/practice" : "/lessons")}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#1a1040" }}
          >
            <IconPlay /> Begin plan
          </button>
        </div>
      </div>

      {/* ── Placement quiz nudge ──────────────────────────────────── */}
      {!user?.placementCompletedAt && (
        <div className="rounded-xl border border-apple-blue/30 bg-apple-blue/5 px-5 py-4 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-apple-blue/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-apple-blue">Take your Placement Quiz</p>
            <p className="text-[12px] text-apple-gray mt-0.5">A 20-question diagnostic that sets your practice difficulty. ~15 min.</p>
          </div>
          <button onClick={() => navigate("/placement-quiz")} className="shrink-0 px-4 py-2 bg-apple-blue text-white rounded-apple text-[13px] font-medium hover:bg-apple-blue/90 transition-colors">
            Start
          </button>
        </div>
      )}

      {/* ── Link requests ─────────────────────────────────────────── */}
      {user?.role === "student" && <LinkRequestsCard />}
      <NPSSurveyBanner />

      {/* ── Jump back in ──────────────────────────────────────────── */}
      {brief?.weakTopics?.[0] && (
        <button
          onClick={() => navigate("/practice", { state: { topic: brief.weakTopics[0].topic } })}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-[#f0f0f5] shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: subjectColor(brief.weakTopics[0].subject) + "18" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: subjectColor(brief.weakTopics[0].subject) }}>
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#8e8e93] mb-0.5">Jump back in</p>
            <p className="text-[15px] font-semibold text-[#1c1c1e] truncate">{brief.weakTopics[0].topic}</p>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold mr-1"
            style={{ background: subjectColor(brief.weakTopics[0].subject) + "18", color: subjectColor(brief.weakTopics[0].subject) }}>
            {subjectLabel(brief.weakTopics[0].subject)}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="shrink-0 group-hover:translate-x-0.5 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      )}

      {/* ── Today's Plan + Revise Today + Aria ───────────────────── */}
      <div className="grid md:grid-cols-3 gap-4">

        {/* Today's Plan */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Today's Plan</p>
            <div className="flex items-center gap-3">
              {todayTasks.length > 0 && (
                <span className="text-[12px] text-[#8e8e93]">{doneCount} / {todayTasks.length} done</span>
              )}
              <button onClick={() => navigate("/study-planner")}
                className="text-[11px] font-medium text-apple-blue hover:opacity-70 transition-opacity">
                Reschedule
              </button>
            </div>
          </div>

          {/* Day progress bar */}
          {todayTasks.length > 0 && (
            <div className="h-1 rounded-full bg-[#f0f0f5] mb-5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((doneCount / todayTasks.length) * 100)}%`, background: "linear-gradient(90deg,#34C759,#30D158)" }} />
            </div>
          )}

          {todayTasks.length === 0 ? (
            <div className="py-6 text-center">
              {isNewUser ? (
                <>
                  <p className="text-[14px] font-semibold text-[#1c1c1e] mb-1">Start your first session</p>
                  <p className="text-[12px] text-[#8e8e93] mb-4">10 questions builds your personalised plan.</p>
                  <button onClick={() => navigate("/practice")} className="px-4 py-2 rounded-full bg-apple-blue text-white text-[13px] font-medium">
                    Begin now
                  </button>
                </>
              ) : (
                <p className="text-[13px] text-[#8e8e93]">Plan refreshes tomorrow. You're done for today.</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {todayTasks.map((task) => {
                const color = task.subject ? subjectColor(task.subject) : "#8e8e93";
                const label = task.subject ? subjectLabel(task.subject) : "Mixed";
                const done  = completedTasks.has(task.id);
                return (
                  <button
                    key={task.id}
                    onClick={() => markDone(task.id, task.topicName ? "/practice" : null, task.topicName ? { topic: task.topicName } : null)}
                    className={`flex items-center gap-4 px-2 py-3.5 rounded-xl transition-colors text-left w-full ${done ? "opacity-45" : "hover:bg-[#f5f5fa]"}`}
                  >
                    <div className="w-[3px] h-10 rounded-full shrink-0" style={{ background: done ? "#8e8e93" : color }} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold truncate ${done ? "line-through text-[#8e8e93]" : "text-[#1c1c1e]"}`}>{task.title}</p>
                      <p className="text-[12px] text-[#8e8e93] mt-0.5">{task.detail}</p>
                    </div>
                    {done ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#34C759]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: color + "18", color }}>{label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Revise Today */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Revise Today</p>
            {(brief?.revisionDue?.length ?? 0) > 0 && (
              <span className="text-[12px] font-semibold text-apple-orange">{brief.revisionDue.length} due</span>
            )}
          </div>

          {!brief?.revisionDue?.length ? (
            <div className="py-6 text-center">
              {isNewUser ? (
                <>
                  <p className="text-[14px] font-semibold text-[#1c1c1e] mb-1">No revisions yet</p>
                  <p className="text-[12px] text-[#8e8e93]">Topics you practice will appear here for spaced review.</p>
                </>
              ) : (
                <>
                  <p className="text-[14px] font-semibold text-[#34C759] mb-1">You're ahead of schedule</p>
                  <p className="text-[12px] text-[#8e8e93]">Nothing due today. Keep the momentum.</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {brief.revisionDue.map((item) => {
                const color = item.subject ? subjectColor(item.subject) : "#8e8e93";
                const label = item.subject ? subjectLabel(item.subject) : "Mixed";
                const done  = completedTasks.has(`rev:${item.topic}`);
                return (
                  <button
                    key={item.topic}
                    onClick={() => markDone(`rev:${item.topic}`, "/practice", { topic: item.topic })}
                    className={`flex items-center gap-4 px-2 py-3.5 rounded-xl transition-colors text-left w-full ${done ? "opacity-45" : "hover:bg-[#f5f5fa]"}`}
                  >
                    <div className="w-[3px] h-10 rounded-full shrink-0" style={{ background: done ? "#8e8e93" : color }} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold truncate ${done ? "line-through text-[#8e8e93]" : "text-[#1c1c1e]"}`}>{item.topic}</p>
                      <p className="text-[12px] text-[#8e8e93] mt-0.5">
                        {item.daysSince ? `${item.daysSince}d ago · due today` : "Due for revision"}
                      </p>
                    </div>
                    {done ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#34C759]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: color + "18", color }}>{label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Aria Coach */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5] flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <AriaDot />
            <p className="text-[13px] font-semibold text-[#1c1c1e]">Stellar · your AI coach</p>
          </div>
          <p className="text-[15px] text-[#1c1c1e] leading-relaxed flex-1">
            {advice
              ? `"${advice.replace(/^["']|["']$/g, "")}"`
              : '"Practice a few questions and I\'ll have personalised feedback ready for you."'}
          </p>
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => navigate("/analytics")}
              className="px-4 py-2 rounded-full text-[13px] font-medium bg-[#f0f0f5] text-[#3a3a3c] hover:bg-[#e5e5ea] transition-colors"
            >
              See full analysis
            </button>
          </div>
        </div>
      </div>

      {/* ── Up Next ──────────────────────────────────────────────── */}
      {(() => {
        const seen = new Set();
        const upNext = [];
        for (const t of (brief?.weakTopics || [])) {
          if (upNext.length >= 3) break;
          if (!seen.has(t.topic)) { seen.add(t.topic); upNext.push({ ...t, reason: "weak" }); }
        }
        for (const t of (brief?.revisionDue || [])) {
          if (upNext.length >= 3) break;
          if (!seen.has(t.topic)) { seen.add(t.topic); upNext.push({ ...t, reason: "revision" }); }
        }

        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Up Next</p>
              <button onClick={() => navigate("/lessons")}
                className="text-[12px] font-medium text-[#007AFF] hover:opacity-70 transition-opacity">
                Browse all →
              </button>
            </div>

            {upNext.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#f0f0f5] text-center">
                {isNewUser ? (
                  <>
                    <p className="text-[15px] font-semibold text-[#1c1c1e] mb-1">No topics surfaced yet</p>
                    <p className="text-[13px] text-[#8e8e93]">Practice 10 questions and Stellar will build your focus queue.</p>
                  </>
                ) : (
                  <>
                    <p className="text-[15px] font-semibold text-[#1c1c1e] mb-1">You're all caught up!</p>
                    <p className="text-[13px] text-[#8e8e93]">Strong across all active topics. Stellar will surface new ones soon.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {upNext.map((item) => {
                  const color = subjectColor(item.subject);
                  const label = subjectLabel(item.subject);
                  const acc   = item.accuracy ?? 0;
                  return (
                    <button
                      key={item.topic}
                      onClick={() => navigate("/practice", { state: { topic: item.topic } })}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] text-left hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: color }} />
                      <div className="pl-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mb-2.5"
                          style={{ background: color + "18", color }}>
                          {label}
                        </span>
                        <p className="text-[15px] font-semibold text-[#1c1c1e] leading-snug mb-1">{item.topic}</p>
                        <p className="text-[12px] text-[#8e8e93] mb-3">
                          {item.reason === "weak"
                            ? `${acc}% accuracy · needs work`
                            : `${item.daysSince}d since last practice · due today`}
                        </p>
                        <div className="h-1.5 rounded-full bg-[#f0f0f5] overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${acc}%`, background: color }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── 4 Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard2
          label="STREAK" icon={<IconFlame />} iconColor="#FF9500"
          value={streak} unit=""
          sub={streak > 0
            ? (todayPractised ? "days · streak safe today ✓" : "days · practice to keep it alive")
            : "start your streak today"}
        />
        <StatCard2
          label="ACCURACY" icon={<IconTarget />} iconColor="#AF52DE"
          value={score} unit="%" sub={`${report?.totalAttempts ?? 0} questions done`}
        />
        <StatCard2
          label="TOPICS MASTERED" icon={<IconSparkle />} iconColor="#34C759"
          value={strong} unit=""
          sub={strong + weak > 0 ? `${strong} of ${strong + weak} topics` : "practice to unlock"}
        />
        <StatCard2
          label="PREDICTED" icon={<IconTrophy />} iconColor="#007AFF"
          value={predScore ?? "—"} unit=""
          sub={predScore ? `board score · ±${predMargin}` : "practice more to unlock"}
        />
      </div>

      {/* ── Admin: AI cache stats ─────────────────────────────────── */}
      {user?.role === "admin" && cacheStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="AI Calls Today"
            value={`${aiUsage?.used ?? 0}/${aiUsage?.limit ?? 10}`}
            sub={aiUsage?.used >= aiUsage?.limit ? "limit reached" : `${aiUsage?.remaining ?? 0} remaining`}
            accent={aiUsage?.used >= aiUsage?.limit ? "red" : "blue"}
          />
          <StatCard label="Cached Responses"   value={cacheStats.totalCachedResponses} sub="stored in DB"          accent="teal" />
          <StatCard label="Cache Hits"          value={cacheStats.totalCacheHits}        sub="free responses served" accent="teal" />
          <StatCard label="Claude Calls Saved"  value={cacheStats.totalClaudeCallsSaved} sub="across all users"      accent="green" />
        </div>
      )}

      {/* ── Performance Overview ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-5">Performance Overview</p>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">

          {/* Left — Thinking Profile (38%) */}
          <div className="md:w-[38%] flex flex-col gap-5 shrink-0">
            {report?.thinkingProfile ? (
              <>
                <div className="flex items-start gap-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 ${profile?.bg || "bg-[#f5f5fa]"}`}>
                    <span className={`w-2 h-2 rounded-full ${profile?.dot || "bg-[#8e8e93]"}`} />
                    <span className={`text-[13px] font-semibold ${profile?.text || "text-[#8e8e93]"}`}>{report.thinkingProfile}</span>
                  </div>
                  <p className="text-[13px] text-[#3a3a3c] leading-relaxed">
                    {PROFILE_DESCRIPTIONS[report.thinkingProfile]}
                  </p>
                </div>

                {(strong > 0 || weak > 0) && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-[#34C759]">{strong} strong</span>
                      <span className="text-[11px] font-semibold text-[#FF3B30]">{weak} weak</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#f0f0f5] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((strong / Math.max(strong + weak, 1)) * 100)}%`, background: "linear-gradient(90deg,#34C759,#30D158)" }} />
                    </div>
                  </div>
                )}

                {(() => {
                  // Build topic → subject map from brief data
                  const topicSubjectMap = {};
                  (brief?.weakTopics  || []).forEach(t => { topicSubjectMap[t.topic] = t.subject; });
                  (brief?.revisionDue || []).forEach(t => { topicSubjectMap[t.topic] = t.subject; });

                  const groupBySubject = (names) => {
                    const groups = {};
                    names.forEach(name => {
                      const subj = topicSubjectMap[name] || "Other";
                      if (!groups[subj]) groups[subj] = [];
                      groups[subj].push(name);
                    });
                    return Object.entries(groups);
                  };

                  const weakGroups   = groupBySubject(report?.weakAreas   || []);
                  const strongGroups = groupBySubject(report?.strongAreas  || []);

                  return (
                    <div className="flex flex-col gap-4">
                      {weakGroups.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF3B30] mb-2">Weak Areas</p>
                          <div className="flex flex-col gap-2.5">
                            {weakGroups.map(([subj, topics]) => (
                              <div key={subj}>
                                <p className="text-[10px] font-semibold mb-1.5" style={{ color: subjectColor(subj) }}>
                                  {subjectLabel(subj)}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {topics.map(t => (
                                    <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FF3B30]/10 text-[#FF3B30]">{t}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {strongGroups.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#34C759] mb-2">Strong Areas</p>
                          <div className="flex flex-col gap-2.5">
                            {strongGroups.map(([subj, topics]) => (
                              <div key={subj}>
                                <p className="text-[10px] font-semibold mb-1.5" style={{ color: subjectColor(subj) }}>
                                  {subjectLabel(subj)}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {topics.map(t => (
                                    <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#34C759]/10 text-[#34C759]">{t}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <p className="text-[13px] text-[#8e8e93]">Complete some practice questions to reveal your thinking profile.</p>
            )}
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-[#f0f0f5] self-stretch shrink-0" />

          {/* Right — Subjects (flex-1) */}
          <div className="flex-1 flex flex-col gap-1">
            {SUBJECTS.map(({ id, label, color }) => {
              const breakdown = report?.subjectBreakdown?.find((s) => s.subject === id);
              const acc = breakdown?.accuracy ?? 0;
              const due = breakdown?.dueCount ?? 0;
              return (
                <button
                  key={id}
                  onClick={() => navigate("/lessons")}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#f5f5fa] transition-colors text-left w-full group"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[13px] font-semibold text-[#1c1c1e]">{label}</span>
                      {due > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: color + "18", color }}>{due} due</span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full bg-[#f0f0f5] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${acc}%`, background: color }} />
                    </div>
                  </div>
                  <span className="text-[22px] font-bold leading-none shrink-0" style={{ color }}>
                    {acc}<span className="text-[13px] font-semibold">%</span>
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function StatCard2({ label, icon, iconColor, value, unit, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">{label}</p>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <p className="text-[36px] font-bold leading-none text-[#1c1c1e] tracking-tight">
        {value}<span className="text-[20px]">{unit}</span>
      </p>
      <p className="text-[11px] text-[#8e8e93] mt-2">{sub}</p>
    </div>
  );
}

function LinkRequestsCard() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(null);

  const load = useCallback(() => {
    getLinkRequests().then(({ data }) => setRequests(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handle = async (id, action) => {
    setActing(id);
    try { await respondToLinkRequest(id, action); setRequests((p) => p.filter((r) => r._id !== id)); }
    catch { /* leave visible for retry */ }
    finally { setActing(null); }
  };

  if (loading || requests.length === 0) return null;
  return (
    <div className="card p-5 border-l-4 border-apple-orange">
      <p className="section-label text-apple-orange">Link Requests</p>
      <div className="flex flex-col gap-3">
        {requests.map((r) => (
          <div key={r._id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[var(--label)]">{r.requesterName}</p>
              <p className="text-[12px] text-apple-gray capitalize">{r.requesterRole} wants to view your progress</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button disabled={acting === r._id} onClick={() => handle(r._id, "reject")} className="btn-secondary text-[12px] px-3 py-1.5">Decline</button>
              <button disabled={acting === r._id} onClick={() => handle(r._id, "accept")} className="btn-primary text-[12px] px-3 py-1.5">{acting === r._id ? "…" : "Allow"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NPSSurveyBanner() {
  const [eligible,   setEligible]   = useState(false);
  const [score,      setScore]      = useState(null);
  const [comment,    setComment]    = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [dismissed,  setDismissed]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getNpsEligibility().then(({ data }) => setEligible(data?.eligible === true)).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (score === null) return;
    setSubmitting(true);
    try { await submitFeedback({ score, comment: comment.trim(), context: "nps" }); setSubmitted(true); }
    catch { /* ignore */ } finally { setSubmitting(false); }
  };

  if (!eligible || dismissed) return null;
  if (submitted) return (
    <div className="card p-4 border-l-4 border-apple-green flex items-center gap-3">
      <span className="text-apple-green text-lg">✓</span>
      <p className="text-[13px] text-[var(--label)]">Thanks for your feedback!</p>
    </div>
  );

  return (
    <div className="card p-5 border-l-4 border-apple-purple">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[13px] font-semibold text-[var(--label)]">How likely are you to recommend us?</p>
          <p className="text-[11px] text-apple-gray mt-0.5">0 = Not at all likely · 10 = Extremely likely</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-apple-gray hover:text-apple-gray2 text-lg leading-none shrink-0 -mt-0.5" aria-label="Dismiss">×</button>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} onClick={() => setScore(i)}
            className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all ${score === i ? "bg-apple-purple text-white" : "bg-apple-gray6 text-[var(--label)] hover:bg-apple-purple/20"}`}>
            {i}
          </button>
        ))}
      </div>
      {score !== null && (
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Any comments? (optional)"
          rows={2} maxLength={1000}
          className="w-full text-[13px] bg-apple-gray6 border border-apple-gray5 rounded-apple px-3 py-2 focus:outline-none focus:border-apple-purple resize-none mb-3" />
      )}
      <button disabled={score === null || submitting} onClick={handleSubmit} className="btn-primary disabled:opacity-40">
        {submitting ? "Submitting…" : "Submit feedback"}
      </button>
    </div>
  );
}


function StatCard({ label, value, sub, accent }) {
  const accents = {
    blue:   { ring: "ring-apple-blue/20",   text: "text-apple-blue",   bg: "bg-apple-blue/8"   },
    green:  { ring: "ring-apple-green/20",  text: "text-apple-green",  bg: "bg-apple-green/8"  },
    orange: { ring: "ring-apple-orange/20", text: "text-apple-orange", bg: "bg-apple-orange/8" },
    purple: { ring: "ring-apple-purple/20", text: "text-apple-purple", bg: "bg-apple-purple/8" },
    red:    { ring: "ring-apple-red/20",    text: "text-apple-red",    bg: "bg-apple-red/8"    },
    teal:   { ring: "ring-apple-teal/20",   text: "text-apple-teal",   bg: "bg-apple-teal/8"   },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`card p-5 ring-1 ${a.ring} hover:-translate-y-0.5 hover:shadow-apple-lg transition-[transform,box-shadow] duration-200`}>
      <p className="text-[11px] font-medium text-apple-gray mb-2">{label}</p>
      <p className={`text-[26px] font-bold tracking-tight ${a.text}`}>{value}</p>
      <p className="text-[11px] text-apple-gray mt-1">{sub}</p>
    </div>
  );
}
