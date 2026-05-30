import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe, updateMe, getBadges, getReport, getStreakStatus, getPrediction, getMyGuardians,
  profileGetHeatmap, profileGetSubjects, profileGetLevel, profileGetGoalProgress,
  profileGetActivity, profileGetNextBadge, profileGetBestWindow, profileGetTimeline,
  profileGetSessions, profileRevokeSession, profileGetCertificates, profileGetClassmateCompare,
  profileGetMood, profileSetMood, profileUpdateSettings, profileSetPublic,
  profileSetParentVisibility, profileExportUrl,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { useTrackStore } from "../store/trackStore";

/* ─── Constants ─────────────────────────────────────────────────────────── */
const GRADES   = ["8","9","10","11","12"];
const SUBJECTS = ["Math","Science","English","Social Science","Hindi","Sanskrit","Computer Science"];
const GOALS = [
  { value: "pass",        label: "Pass the exam",            emoji: "🎯" },
  { value: "distinction", label: "Score distinction (75%+)", emoji: "⭐" },
  { value: "top",         label: "Top of class (90%+)",      emoji: "🏆" },
  { value: "scholarship", label: "Scholarship rank",          emoji: "🎓" },
];
const BADGE_CATALOG = [
  { type: "streak_7",           icon: "🔥", label: "Streak Spark",   desc: "7 days in a row"            },
  { type: "streak_30",          icon: "🔥", label: "Streak Master",  desc: "30 days in a row"           },
  { type: "streak_100",         icon: "🏅", label: "Streak Legend",  desc: "100 days in a row"          },
  { type: "first_perfect_exam", icon: "💯", label: "Sharp Shooter",  desc: "100% on a competition exam" },
  { type: "questions_100",      icon: "🤿", label: "Deep Diver",     desc: "100 questions answered"     },
  { type: "questions_500",      icon: "🏆", label: "500 Questions",  desc: "500 questions answered"     },
  { type: "top10_leaderboard",  icon: "⭐", label: "Night Owl",      desc: "Top 10 weekly leaderboard"  },
  { type: "concept_master_any", icon: "🎓", label: "Concept Master", desc: "Mastered a topic"           },
];
const PLAN_STYLE = {
  free:    { label: "Free",    bg: "bg-[#f2f2f7]",        text: "text-[#8e8e93]"   },
  pro:     { label: "Pro",     bg: "bg-[#007AFF]/10",     text: "text-[#007AFF]"   },
  premium: { label: "Premium", bg: "bg-[#FF9500]/10",     text: "text-[#FF9500]"   },
};

const SUBJECT_COLOR = { "Math": "#007AFF", "Science": "#34C759", "English": "#FF9500", "Social Science": "#AF52DE", "Hindi": "#FF3B30" };

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function badgeMeta(type) {
  const c = BADGE_CATALOG.find((b) => b.type === type);
  if (c) return c;
  if (type.startsWith("concept_master_")) {
    const t = type.replace("concept_master_", "").replace(/_/g, " ");
    return { icon: "🎓", label: `Mastered: ${t}`, desc: "Consistently correct" };
  }
  return { icon: "🏅", label: type, desc: "Achievement unlocked" };
}
function getInitials(name = "") { return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?"; }
function weeksAgo(d) { if (!d) return null; const w = Math.floor((Date.now() - new Date(d).getTime()) / (7 * 86400000)); if (w < 1) return "this week"; return w === 1 ? "1 week ago" : `${w} weeks ago`; }
function daysUntil(d) { if (!d) return null; const x = Math.ceil((new Date(d) - new Date()) / 86400000); return x > 0 ? x : null; }
function fmtTime(s) { if (!s) return "—"; const m = Math.floor(s / 60); return m ? `${m}m` : `${s}s`; }

/* ─── Avatar with upload ─────────────────────────────────────────────────── */
function AvatarUpload({ name, dataUrl, size = 80, onUpload }) {
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        const target = 192; c.width = target; c.height = target;
        const ratio = Math.min(target / img.width, target / img.height);
        const w = img.width * ratio, h = img.height * ratio;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#1c1c1e"; ctx.fillRect(0, 0, target, target);
        ctx.drawImage(img, (target - w) / 2, (target - h) / 2, w, h);
        let q = 0.85;
        let url = c.toDataURL("image/jpeg", q);
        while (url.length > 90 * 1024 && q > 0.4) { q -= 0.1; url = c.toDataURL("image/jpeg", q); }
        onUpload(url);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="relative group shrink-0" style={{ width: size, height: size }}>
      <button onClick={() => inputRef.current?.click()} className="block w-full h-full rounded-full overflow-hidden bg-[#1c1c1e] flex items-center justify-center cursor-pointer">
        {dataUrl ? <img src={dataUrl} alt={name} className="w-full h-full object-cover" /> : <span className="text-white font-bold" style={{ fontSize: size * 0.35 }}>{getInitials(name)}</span>}
      </button>
      <button onClick={() => inputRef.current?.click()} className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-[#1c1c1e] text-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md" title="Change photo">📷</button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
    </div>
  );
}

/* ─── Activity Heatmap ───────────────────────────────────────────────────── */
function ActivityHeatmap({ cells }) {
  if (!cells?.length) return null;
  // build 53 columns of 7 rows
  const cols = [];
  let col = [];
  for (const c of cells) {
    if (col.length === 0 && c.weekday !== 0) {
      for (let i = 0; i < c.weekday; i++) col.push(null);
    }
    col.push(c);
    if (col.length === 7) { cols.push(col); col = []; }
  }
  if (col.length) { while (col.length < 7) col.push(null); cols.push(col); }
  const max = Math.max(1, ...cells.map((c) => c.count));
  const intensity = (n) => {
    if (!n) return "#F2F2F7";
    const t = n / max;
    if (t < 0.25) return "#9be9a8";
    if (t < 0.5)  return "#40c463";
    if (t < 0.75) return "#30a14e";
    return "#216e39";
  };
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-[3px]">
        {cols.map((c, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {c.map((d, j) => (
              <div key={j} className="w-[10px] h-[10px] rounded-[2px]"
                style={{ background: d ? intensity(d.count) : "transparent" }}
                title={d ? `${d.count} on ${d.date}` : ""} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function PlanBadge({ plan }) {
  const s = PLAN_STYLE[plan] || PLAN_STYLE.free;
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>{plan === "premium" ? "⚡ " : ""}{s.label}</span>;
}
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-[#8e8e93]">{hint}</p>}
    </div>
  );
}
function StatCard({ label, value, sub, color }) {
  const colorMap = { blue: "text-[#007AFF]", green: "text-[#34C759]", purple: "text-[#AF52DE]", orange: "text-[#FF9500]" };
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5] flex flex-col gap-1">
      <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">{label}</p>
      <p className={`text-[36px] font-bold leading-none tracking-tight mt-1 ${colorMap[color] || "text-[#1c1c1e]"}`}>{value}</p>
      <p className="text-[12px] text-[#8e8e93] mt-1">{sub}</p>
    </div>
  );
}

/* Inline-editable field (#17) */
function InlineField({ label, value, onSave, type = "text", options }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  const save = async () => { setEditing(false); if (draft !== value) await onSave(draft); };
  if (editing) {
    if (options) return (
      <select autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={save}
        className="w-full text-[14px] px-2 py-1 rounded-lg border border-[#007AFF] outline-none bg-white">
        {options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    );
    return (
      <input autoFocus type={type} value={draft || ""} onChange={(e) => setDraft(e.target.value)} onBlur={save}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setEditing(false); setDraft(value); } }}
        className="w-full text-[14px] px-2 py-1 rounded-lg border border-[#007AFF] outline-none" />
    );
  }
  return (
    <button onClick={() => setEditing(true)} className="text-[14px] font-medium text-[#1c1c1e] hover:bg-[#F2F2F7] px-2 py-1 rounded-lg -mx-2 transition-colors text-right">
      {value || "—"} <span className="text-[10px] text-[#C7C7CC] ml-1">✎</span>
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Profile() {
  const { user, setAuth } = useAuthStore();
  const activeProfile = useActiveProfile();
  const navigate = useNavigate();
  const activeTrack = useTrackStore((s) => s.activeTrack);
  const isProTrack = activeTrack?.startsWith("pro_") ?? false;

  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [guardians, setGuardians] = useState([]);

  // v2 state
  const [heatmap, setHeatmap] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);
  const [goalProg, setGoalProg] = useState(null);
  const [activity, setActivity] = useState([]);
  const [nextBadge, setNextBadge] = useState(null);
  const [bestWin, setBestWin] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [certs, setCerts] = useState([]);
  const [compare, setCompare] = useState(null);
  const [mood, setMood] = useState([]);
  const [me, setMe] = useState(null); // full /me response with new fields

  const [view, setView] = useState("overview"); // overview | settings | privacy
  const [badgeView, setBadgeView] = useState("grid"); // grid | timeline
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const referralCode = useMemo(() => {
    const fn = user?.name?.split(" ")[0]?.toUpperCase() || "USER";
    const sx = user?._id ? user._id.toString().slice(-4).toUpperCase() : "XXXX";
    return `${fn}·${sx}`;
  }, [user]);
  const referralUrl = `https://app.stellar.com/join?ref=${referralCode}`;

  const handleCopy = (text, setter) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  useEffect(() => {
    // Skip K-12-specific data (subjects) for Pro track users
    const isProView = isProTrack;
    Promise.all([
      getMe(),
      getBadges().catch(() => ({ data: [] })),
      getStreakStatus().catch(() => ({ data: { data: {} } })),
      getPrediction().catch(() => null),
      getMyGuardians().catch(() => ({ data: [] })),
      profileGetHeatmap().catch(() => ({ data: { data: [] } })),
      isProView ? Promise.resolve({ data: { data: [] } }) : profileGetSubjects().catch(() => ({ data: { data: [] } })),
      profileGetLevel().catch(() => ({ data: { data: null } })),
      profileGetGoalProgress().catch(() => ({ data: { data: null } })),
      profileGetActivity().catch(() => ({ data: { data: [] } })),
      profileGetNextBadge().catch(() => ({ data: { data: null } })),
      profileGetBestWindow().catch(() => ({ data: { data: null } })),
      profileGetTimeline().catch(() => ({ data: { data: [] } })),
      profileGetSessions().catch(() => ({ data: { data: [] } })),
      profileGetCertificates().catch(() => ({ data: { data: [] } })),
      profileGetClassmateCompare().catch(() => ({ data: { data: null } })),
      profileGetMood().catch(() => ({ data: { data: [] } })),
    ]).then(([m, b, s, p, g, hm, sb, lv, gp, ac, nb, bw, tl, ss, ce, cm, mo]) => {
      setMe(m.data?.data?.user);
      setProfile(m.data?.data?.profile);
      setBadges(b.data || []);
      setStreakData(s.data?.data || s.data || {});
      if (p) setPrediction(p);
      setGuardians(g.data?.data || g.data || []);
      setHeatmap(hm.data?.data || []);
      setSubjects(sb.data?.data || []);
      setLevelInfo(lv.data?.data);
      setGoalProg(gp.data?.data);
      setActivity(ac.data?.data || []);
      setNextBadge(nb.data?.data);
      setBestWin(bw.data?.data);
      setTimeline(tl.data?.data || []);
      setSessions(ss.data?.data || []);
      setCerts(ce.data?.data || []);
      setCompare(cm.data?.data);
      setMood(mo.data?.data || []);
    }).catch(() => setError("Could not load profile.")).finally(() => setLoading(false));
  }, [isProTrack]);

  /* Inline-edit field savers */
  const saveField = async (field, val) => {
    setSaving(true);
    try {
      const upd = { [field]: val };
      const { data } = await updateMe(upd);
      setAuth(null, { ...user, ...upd, name: data.user?.name || (field === "name" ? val : user?.name) });
      setMe((prev) => ({ ...prev, [field]: val }));
      setSuccess("Saved"); setTimeout(() => setSuccess(""), 1500);
    } catch (e) { setError(e.response?.data?.error || "Save failed"); }
    finally { setSaving(false); }
  };

  const saveSetting = async (patch) => {
    try {
      const r = await profileUpdateSettings(patch);
      const upd = r.data?.data || {};
      setMe((prev) => ({ ...prev, ...upd }));
      if (patch.theme) {
        const isDark = patch.theme === "dark" ||
          (patch.theme === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("stellar_theme", patch.theme);
      }
    } catch {}
  };

  const setMoodToday = async (m) => {
    try { await profileSetMood(m); const r = await profileGetMood(); setMood(r.data?.data || []); } catch {}
  };

  const setPublicProfile = async (patch) => {
    try {
      const r = await profileSetPublic(patch);
      const upd = r.data?.data || {};
      setMe((prev) => ({ ...prev, ...upd }));
    } catch (e) { setError(e.response?.data?.error || "Couldn't update public profile"); }
  };

  const setParentVis = async (parentId, vis) => {
    try { await profileSetParentVisibility(parentId, vis); } catch {}
  };

  const exportData = () => {
    const url = profileExportUrl();
    fetch(url, { credentials: "include" })
      .then((r) => r.blob())
      .then((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `stellar-data-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
      });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
    </div>
  );

  const accuracy = profile?.accuracy ?? 0;
  const totalAttempts = profile?.totalAttempts ?? 0;
  const avgTime = profile?.avgTime ?? 60;
  const streak = streakData?.streak ?? 0;
  const longestStreak = streakData?.longestStreak ?? 0;
  const hours = Math.round((totalAttempts * avgTime) / 3600);
  const joinedAgo = weeksAgo(user?.createdAt);
  const examDays = daysUntil(me?.examDate);
  const goalObj = GOALS.find((g) => g.value === me?.goal);
  const todayMood = mood.find((m) => m.date === new Date().toISOString().slice(0, 10));

  let predictedDisplay = "—", predictedSub = "not enough data";
  if (prediction?.confidence && prediction.predictedMin != null) {
    const mid = Math.round((prediction.predictedMin + prediction.predictedMax) / 2);
    predictedDisplay = `${mid}%`; predictedSub = prediction.predictedGrade || "predicted";
  }

  const earnedSet = new Set(badges);
  const visibleBadges = showAllBadges ? BADGE_CATALOG : BADGE_CATALOG.slice(0, 8);

  return (
    <div className="w-full space-y-5">
      {error && <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-2xl">{error}</div>}
      {success && <div className="bg-[#34C759]/8 border border-[#34C759]/20 text-[#34C759] text-[13px] px-4 py-3 rounded-2xl">✓ {success}</div>}

      {/* ── View tabs ── */}
      <div className="flex items-center gap-1 border-b border-[#F2F2F7]">
        {[
          { id: "overview", label: "Overview" },
          { id: "settings", label: "Settings" },
          { id: "privacy",  label: "Privacy & data" },
        ].map((t) => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-colors border-b-2 -mb-px ${view === t.id ? "border-[#007AFF] text-[#007AFF]" : "border-transparent text-[#8E8E93] hover:text-[#1c1c1e]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <>
          {/* ── Hero ── */}
          <div className="rounded-2xl p-6 relative overflow-hidden light-on-gradient" style={{ background: "linear-gradient(130deg, #ddd6fe 0%, #fbcfe8 50%, #fde68a 100%)" }}>
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <button onClick={() => handleCopy(referralUrl, setCopied)} className="px-3.5 py-1.5 rounded-full border border-[#1c1c1e]/20 text-[12px] font-semibold text-[#1c1c1e] bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors">{copied ? "Copied!" : "Share"}</button>
              {me?.publicProfileEnabled && me?.publicSlug && (
                <button onClick={() => navigate(`/u/${me.publicSlug}`)} className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white bg-[#1c1c1e] hover:bg-[#333] transition-colors">View public →</button>
              )}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <AvatarUpload name={me?.name || user?.name} dataUrl={me?.avatarDataUrl} size={80}
                onUpload={(url) => saveSetting({ avatarDataUrl: url })} />
              <div className="min-w-0 pr-28">
                <h1 className="text-[32px] font-bold leading-none text-[#1c1c1e] tracking-tight truncate mb-1 capitalize">{me?.name || user?.name || "—"}</h1>
                <p className="text-[13px] font-medium text-[#1c1c1e]/70">
                  {isProTrack
                    ? `${(activeTrack || "").replace("pro_", "").replace(/^\w/, (c) => c.toUpperCase())} · Professional`
                    : (me?.grade || me?.examBoard)
                      ? [me?.grade ? `Class ${me.grade}` : null, me?.examBoard || null, me?.subject || activeProfile?.subject || null].filter(Boolean).join(" · ")
                      : null}
                </p>
                {!isProTrack && !me?.grade && !me?.examBoard && (
                  <button onClick={() => setView("settings")} className="text-[12px] text-[#7c3aed] font-semibold hover:opacity-70">
                    Complete your profile →
                  </button>
                )}
                <p className="text-[12px] text-[#1c1c1e]/55 mt-0.5">{joinedAgo ? `Joined ${joinedAgo}` : "New member"} · {totalAttempts} sessions · {profile?.thinkingProfile || "—"}</p>
                {/* #23 Manifesto */}
                {me?.manifesto ? (
                  <p className="text-[13px] italic text-[#1c1c1e]/80 mt-2 max-w-md">"{me.manifesto}"</p>
                ) : (
                  <button onClick={() => setView("settings")} className="text-[12px] text-[#7c3aed] font-semibold mt-2 hover:opacity-70">+ Add why you learn</button>
                )}
              </div>
            </div>

            {/* #4 Level + XP bar */}
            {levelInfo && (
              <div className="mt-5 px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[12px] font-bold text-[#1c1c1e]">Level {levelInfo.level}</p>
                  <p className="text-[11px] text-[#1c1c1e]/70">{levelInfo.xp} XP · {levelInfo.nextLevelXp - levelInfo.xp} to next</p>
                </div>
                <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7c3aed] rounded-full transition-all duration-500" style={{ width: `${levelInfo.progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* ── 4 Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Streak" value={streak} sub={`days · longest ${longestStreak}`} color="blue" />
            <StatCard label="Accuracy" value={`${Math.round(accuracy * 100)}%`} sub={compare?.percentile != null ? `Top ${100 - compare.percentile}% in your grade` : "↑ since start"} color="green" />
            <StatCard label="Predicted" value={predictedDisplay} sub={predictedSub} color="purple" />
            <StatCard label="Hours" value={hours || "—"} sub="across all time" color="orange" />
          </div>

          {/* #5 Goal progress diagnosis */}
          {goalProg && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Goal progress</p>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  goalProg.status === "on_track" ? "bg-[#34C759]/10 text-[#34C759]" :
                  goalProg.status === "behind" ? "bg-[#FF9500]/10 text-[#FF9500]" :
                  "bg-[#FF3B30]/10 text-[#FF3B30]"
                }`}>{goalProg.status === "on_track" ? "On track" : goalProg.status === "behind" ? "Behind" : "Off track"}</span>
              </div>
              <div className="flex items-end gap-3 mb-2">
                <p className="text-[36px] font-bold text-[#1c1c1e] leading-none">{goalProg.currentAccuracy}%</p>
                <p className="text-[14px] text-[#8E8E93] mb-1">of {goalProg.goalTarget}% goal</p>
              </div>
              <div className="relative h-2 bg-[#F2F2F7] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#007AFF]" style={{ width: `${Math.min(100, (goalProg.currentAccuracy / goalProg.goalTarget) * 100)}%` }} />
                <div className="absolute top-0 h-full w-0.5 bg-[#1c1c1e]" style={{ left: "100%" }} />
              </div>
              <p className="text-[12px] text-[#8e8e93]">
                {goalProg.gap > 0
                  ? `Gap: ${goalProg.gap}% · ~${goalProg.hoursToClose} hrs of focused practice closes it.`
                  : "You've already met your goal — push higher? 🚀"}
              </p>
            </div>
          )}

          {/* ── Two-column ── */}
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-5">

              {/* #2 Activity heatmap */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Last 365 days</p>
                  <p className="text-[11px] text-[#8e8e93]">{heatmap.filter((c) => c.count > 0).length} active days</p>
                </div>
                <ActivityHeatmap cells={heatmap} />
              </div>

              {/* #3 Subject breakdown — K-12 only (skip for Pro track users) */}
              {subjects.length > 0 && !isProTrack && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">By subject</p>
                  <div className="space-y-3">
                    {subjects.map((s) => (
                      <div key={s.subject}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[13px] font-semibold text-[#1c1c1e]">{s.subject}</p>
                          <p className="text-[12px] text-[#8e8e93]"><span className="font-bold text-[#1c1c1e]">{s.accuracy}%</span> · {s.total} qs</p>
                        </div>
                        <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.accuracy}%`, background: SUBJECT_COLOR[s.subject] || "#007AFF" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Achievements</p>
                    <p className="text-[14px] font-semibold text-[#1c1c1e] mt-0.5">{badges.length} of {BADGE_CATALOG.length} earned</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* #7 Badge view toggle */}
                    <div className="flex border border-[#E5E5EA] rounded-full overflow-hidden text-[11px]">
                      <button onClick={() => setBadgeView("grid")} className={`px-2.5 py-1 ${badgeView === "grid" ? "bg-[#1c1c1e] text-white" : "text-[#8E8E93]"}`}>Grid</button>
                      <button onClick={() => setBadgeView("timeline")} className={`px-2.5 py-1 ${badgeView === "timeline" ? "bg-[#1c1c1e] text-white" : "text-[#8E8E93]"}`}>Timeline</button>
                    </div>
                    <button onClick={() => setShowAllBadges((v) => !v)} className="text-[12px] font-semibold text-[#007AFF] hover:opacity-70">{showAllBadges ? "Show less" : "View all →"}</button>
                  </div>
                </div>

                {/* #8 Next badge progress */}
                {nextBadge && (
                  <div className="px-3.5 py-2.5 mb-3 rounded-xl bg-[#007AFF]/8 border border-[#007AFF]/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[12px] font-semibold text-[#007AFF]">Next: {nextBadge.label}</p>
                      <p className="text-[11px] text-[#007AFF]/70 font-bold">{nextBadge.current}/{nextBadge.target} · {nextBadge.remaining} to go</p>
                    </div>
                    <div className="h-1 bg-[#007AFF]/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#007AFF]" style={{ width: `${(nextBadge.current / nextBadge.target) * 100}%` }} />
                    </div>
                  </div>
                )}

                {badgeView === "grid" ? (
                  <div className="flex flex-wrap gap-3">
                    {visibleBadges.map((b) => {
                      const earned = earnedSet.has(b.type);
                      return (
                        <div key={b.type} className="group relative flex flex-col items-center gap-1.5 w-16">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[22px] border ${earned ? "bg-[#FF9500]/10 border-[#FF9500]/20" : "bg-[#f2f2f7] border-[#e5e5ea] opacity-40 grayscale"}`}>{b.icon}</div>
                          <p className="text-[10px] text-[#8e8e93] text-center leading-tight">{b.label}</p>
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-40 pointer-events-none">
                            <div className="bg-[#1c1c1e] text-white text-[11px] rounded-xl px-2.5 py-1.5 text-center shadow-lg">{b.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : timeline.length === 0 ? (
                  <p className="text-[13px] text-[#8E8E93] text-center py-4">No badges earned yet — practice to unlock your first.</p>
                ) : (
                  <div className="space-y-2">
                    {timeline.map((t, i) => {
                      const m = badgeMeta(t.type);
                      return (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAFAFB]">
                          <div className="w-9 h-9 rounded-full bg-[#FF9500]/10 flex items-center justify-center text-[18px]">{m.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1c1c1e]">{m.label}</p>
                            <p className="text-[11px] text-[#8e8e93]">{m.desc}</p>
                          </div>
                          <p className="text-[11px] text-[#C7C7CC]">{new Date(t.awardedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* #6 Recent activity feed */}
              {activity.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">This week</p>
                  <div className="space-y-2">
                    {activity.slice(0, 6).map((a, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FAFAFB]">
                        <div className={`w-2 h-2 rounded-full ${a.accuracy >= 70 ? "bg-[#34C759]" : a.accuracy >= 40 ? "bg-[#FF9500]" : "bg-[#FF3B30]"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{a.topic}</p>
                          <p className="text-[11px] text-[#8e8e93]">{a.date} · {a.count} qs · {a.accuracy}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* #17 Inline-editable Profile Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Profile details · click any field to edit</p>
                <dl className="space-y-0">
                  {[
                    { label: "Full Name", value: me?.name || user?.name, save: (v) => saveField("name", v) },
                    ...(!isProTrack ? [
                      { label: "Grade", value: me?.grade, save: (v) => saveField("grade", v), options: GRADES },
                      { label: "Primary Subject", value: me?.subject, save: (v) => saveField("subject", v), options: SUBJECTS },
                      { label: "Exam Board", value: me?.examBoard, save: (v) => saveField("examBoard", v), options: [
                          { value: "CBSE", label: "CBSE" }, { value: "ICSE", label: "ICSE" },
                          { value: "AP SSC", label: "AP SSC" }, { value: "State Board", label: "State Board" },
                        ]
                      },
                    ] : []),
                    { label: "Study Goal", value: me?.goal, save: (v) => saveField("goal", v), options: GOALS },
                    { label: isProTrack ? "Target Date" : "Exam Date", value: me?.examDate?.split("T")[0] || "", save: (v) => saveField("examDate", v), type: "date" },
                  ].map(({ label, value, save, options, type }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[#f0f0f5] last:border-0">
                      <dt className="text-[12px] text-[#8e8e93]">{label}</dt>
                      <dd className="flex-1 max-w-[60%]"><div className="flex justify-end"><InlineField value={value} type={type} options={options} onSave={save} /></div></dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Strong / Weak */}
              {(profile?.strongAreas?.length > 0 || profile?.weakAreas?.length > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {profile?.strongAreas?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                      <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#34C759] mb-3">💪 Strong</p>
                      <div className="space-y-1.5">{profile.strongAreas.slice(0, 3).map((a) => <p key={a} className="text-[13px] text-[#1c1c1e]">{a}</p>)}</div>
                    </div>
                  )}
                  {profile?.weakAreas?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                      <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#FF9500] mb-3">📈 Needs work</p>
                      <div className="space-y-1.5">{profile.weakAreas.slice(0, 3).map((a) => <p key={a} className="text-[13px] text-[#1c1c1e]">{a}</p>)}</div>
                    </div>
                  )}
                </div>
              )}

              {/* #22 Certificates */}
              {certs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Certificates</p>
                  <div className="space-y-2">
                    {certs.map((c) => (
                      <div key={c._id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFCC02]/8 border border-[#FFCC02]/20">
                        <div className="text-[24px]">📜</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1c1c1e]">{c.title}</p>
                          <p className="text-[11px] text-[#8e8e93]">{c.subject} · awarded {new Date(c.awardedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                        </div>
                        <button className="text-[11px] font-semibold text-[#007AFF] hover:opacity-70">Download →</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="md:col-span-1 space-y-5">

              {/* #21 Plan / Upgrade */}
              {(!user?.plan || user.plan === "free") ? (
                <div className="rounded-2xl p-5 border border-[#FF9500]/30" style={{ background: "linear-gradient(135deg, #FFF7E6, #FFE9CC)" }}>
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#FF9500] mb-1">Free plan</p>
                  <p className="text-[15px] font-bold text-[#1c1c1e] mb-1">Unlock unlimited AI</p>
                  <p className="text-[12px] text-[#8e8e93] mb-3">Pro: unlimited explanations, priority hints, ad-free.</p>
                  <button onClick={() => navigate("/pricing")} className="w-full py-2.5 rounded-xl bg-[#FF9500] text-white text-[13px] font-bold hover:bg-[#e68500] transition-colors">Upgrade to Pro →</button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-4">Account</p>
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-3 border-b border-[#f0f0f5]">
                      <span className="text-[12px] text-[#8e8e93]">Plan</span>
                      <PlanBadge plan={user.plan} />
                    </div>
                    {user?.planExpiry && (
                      <div className="flex items-center justify-between py-3 border-b border-[#f0f0f5]">
                        <span className="text-[12px] text-[#8e8e93]">Expires</span>
                        <span className="text-[13px] font-medium text-[#1c1c1e]">{new Date(user.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* #24 Mood check-in */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-2">How are you today?</p>
                {todayMood ? (
                  <p className="text-[13px] text-[#1c1c1e]">Today: <span className="text-[20px]">{todayMood.mood === "great" ? "😊" : todayMood.mood === "ok" ? "😐" : "😫"}</span></p>
                ) : (
                  <div className="flex gap-2">
                    {[
                      { id: "great", emoji: "😊", color: "#34C759" },
                      { id: "ok", emoji: "😐", color: "#FF9500" },
                      { id: "low", emoji: "😫", color: "#FF3B30" },
                    ].map((m) => (
                      <button key={m.id} onClick={() => setMoodToday(m.id)} className="flex-1 py-2 rounded-xl text-[24px] hover:bg-[#F2F2F7] transition-colors">{m.emoji}</button>
                    ))}
                  </div>
                )}
                {/* Mini history */}
                {mood.length > 1 && (
                  <div className="flex gap-0.5 mt-3">
                    {mood.slice(-14).map((m, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: m.mood === "great" ? "#34C759" : m.mood === "ok" ? "#FF9500" : "#FF3B30" }} title={`${m.date}: ${m.mood}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* #25 Best learning window */}
              {bestWin && bestWin.lift > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#AF52DE] mb-2">⏰ Your best window</p>
                  <p className="text-[14px] text-[#1c1c1e] leading-snug">
                    You learn best around <span className="font-bold">{bestWin.bestHour}:00</span> — accuracy <span className="font-bold text-[#34C759]">+{bestWin.lift}%</span> vs your average.
                  </p>
                </div>
              )}

              {/* #12 Classmate compare */}
              {compare?.percentile != null && compare.peerCount > 5 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-2">Where you rank</p>
                  <p className="text-[14px] text-[#1c1c1e]">
                    Top <span className="text-[24px] font-bold text-[#007AFF]">{100 - compare.percentile}%</span> of {compare.peerCount.toLocaleString()} peers
                  </p>
                </div>
              )}

              {/* Invite friend */}
              <div className="rounded-2xl p-5 shadow-sm invite-card">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase invite-eyebrow mb-1">Invite a friend</p>
                <p className="text-[12px] invite-subtle mb-3">Both get a free month of Pro.</p>
                <div className="backdrop-blur-sm rounded-xl px-3 py-2 mb-3 text-center invite-code-tile">
                  <p className="font-mono text-[18px] font-bold tracking-widest invite-code-text">{referralCode}</p>
                </div>
                <button onClick={() => handleCopy(referralUrl, setShareCopied)} className="w-full py-2 rounded-xl bg-[#1c1c1e] text-white text-[12px] font-semibold hover:bg-[#333] transition-colors">{shareCopied ? "Copied!" : "Copy invite link"}</button>
              </div>

              {/* Exam countdown */}
              {examDays && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-2">Exam countdown</p>
                  <div className="flex items-center gap-3">
                    <p className="text-[32px] font-bold leading-none text-[#007AFF]">{examDays}</p>
                    <div>
                      <p className="text-[12px] font-semibold text-[#007AFF]">days</p>
                      <p className="text-[11px] text-[#8e8e93]">{new Date(me.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Linked parents */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Linked parents</p>
                {guardians.length === 0 ? (
                  <p className="text-[13px] text-[#8e8e93] text-center py-3">None linked yet</p>
                ) : (
                  <div className="space-y-3">
                    {guardians.map((g) => {
                      const initials = g.name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
                      const vis = me?.parentVisibility?.[g._id] || { scores: true, streak: true, chats: false };
                      return (
                        <div key={g._id || g.email} className="space-y-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 flex items-center justify-center"><span className="text-[11px] font-bold text-[#007AFF]">{initials}</span></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{g.name}</p>
                              <p className="text-[10px] text-[#8e8e93]">{g.role}</p>
                            </div>
                          </div>
                          {/* #13 Per-parent privacy */}
                          <div className="flex gap-1 pl-10 flex-wrap">
                            {[
                              { k: "scores", label: "Scores" },
                              { k: "streak", label: "Streak" },
                              { k: "chats",  label: "Chats" },
                            ].map((p) => (
                              <button key={p.k}
                                onClick={() => setParentVis(g._id, { ...vis, [p.k]: !vis[p.k] })}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${vis[p.k] ? "bg-[#34C759]/10 text-[#34C759]" : "bg-[#F2F2F7] text-[#C7C7CC]"}`}>
                                {vis[p.k] ? "✓" : ""} {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* #9 Weekly digest preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">What your parent sees this week</p>
              <span className="text-[11px] text-[#C7C7CC]">Weekly digest preview</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-[20px] font-bold text-[#007AFF]">{streak}</p><p className="text-[10px] text-[#8e8e93]">Streak</p></div>
              <div><p className="text-[20px] font-bold text-[#34C759]">{Math.round(accuracy * 100)}%</p><p className="text-[10px] text-[#8e8e93]">Accuracy</p></div>
              <div><p className="text-[20px] font-bold text-[#FF9500]">{activity.reduce((a, x) => a + (x.count || 0), 0)}</p><p className="text-[10px] text-[#8e8e93]">Questions</p></div>
            </div>
          </div>
        </>
      )}

      {/* ── SETTINGS view ── */}
      {view === "settings" && (
        <div className="grid md:grid-cols-2 gap-5">
          {/* #18 Theme + density */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] space-y-4">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Appearance</p>
            <div>
              <p className="text-[12px] font-semibold text-[#1c1c1e] mb-2">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {[{id:"light",label:"☀️ Light"},{id:"dark",label:"🌙 Dark"},{id:"system",label:"⚙️ System"}].map((t) => (
                  <button key={t.id} onClick={() => saveSetting({ theme: t.id })}
                    className={`px-3 py-2 rounded-xl text-[12px] font-semibold border ${me?.theme === t.id ? "border-[#007AFF] bg-[#007AFF]/5 text-[#007AFF]" : "border-[#E5E5EA] text-[#3A3A3C]"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1c1c1e] mb-2">Density</p>
              <div className="grid grid-cols-2 gap-2">
                {[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}].map((d) => (
                  <button key={d.id} onClick={() => saveSetting({ density: d.id })}
                    className={`px-3 py-2 rounded-xl text-[12px] font-semibold border ${me?.density === d.id ? "border-[#007AFF] bg-[#007AFF]/5 text-[#007AFF]" : "border-[#E5E5EA] text-[#3A3A3C]"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* #19 Notification quick toggles */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] space-y-3">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Notifications</p>
            {[
              { k: "push", label: "Push notifications" },
              { k: "email", label: "Email digest" },
              { k: "streak", label: "Streak reminders" },
              { k: "exam", label: "Exam reminders" },
            ].map((n) => {
              const on = me?.notifPrefs?.[n.k] !== false;
              return (
                <div key={n.k} className="flex items-center justify-between">
                  <p className="text-[13px] text-[#1c1c1e]">{n.label}</p>
                  <button onClick={() => saveSetting({ notifPrefs: { ...me?.notifPrefs, [n.k]: !on } })}
                    className="w-11 h-6 rounded-full transition-all relative" style={{ background: on ? "#34C759" : "#E5E5EA" }}>
                    <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all" style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* #20 Language + Timezone */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] space-y-4">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Language & timezone</p>
            <Field label="Language">
              <select value={me?.locale || "en"} onChange={(e) => saveSetting({ locale: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px]">
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select value={me?.timezone || "Asia/Kolkata"} onChange={(e) => saveSetting({ timezone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px]">
                {["Asia/Kolkata","Asia/Dubai","Asia/Singapore","Europe/London","America/New_York","America/Los_Angeles"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          {/* #23 Manifesto */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-2">Your manifesto</p>
            <p className="text-[11px] text-[#8e8e93] mb-3">One line about why you learn — shows on your profile.</p>
            <textarea value={me?.manifesto || ""} onChange={(e) => setMe((m) => ({ ...m, manifesto: e.target.value }))}
              onBlur={(e) => saveSetting({ manifesto: e.target.value })}
              maxLength={200} rows={2} placeholder="e.g. I want to study at IIT and build robots that help farmers."
              className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px] resize-none focus:outline-none focus:border-[#007AFF]" />
            <p className="text-[10px] text-[#C7C7CC] mt-1">{(me?.manifesto || "").length}/200</p>
          </div>

          {/* #10 Public profile toggle */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Public profile</p>
              <button onClick={() => setPublicProfile({ enabled: !me?.publicProfileEnabled })}
                className="w-11 h-6 rounded-full transition-all relative" style={{ background: me?.publicProfileEnabled ? "#34C759" : "#E5E5EA" }}>
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all" style={{ left: me?.publicProfileEnabled ? "calc(100% - 22px)" : "2px" }} />
              </button>
            </div>
            {me?.publicProfileEnabled && (
              <>
                <Field label="Public URL">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#8e8e93]">stellar.com/u/</span>
                    <input value={me?.publicSlug || ""} onChange={(e) => setMe((m) => ({ ...m, publicSlug: e.target.value }))}
                      onBlur={(e) => setPublicProfile({ slug: e.target.value })}
                      placeholder="your-name" className="flex-1 px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[13px]" />
                  </div>
                </Field>
                {me?.publicSlug && (
                  <button onClick={() => navigate(`/u/${me.publicSlug}`)} className="text-[12px] font-semibold text-[#007AFF] hover:opacity-70">View your public profile →</button>
                )}
              </>
            )}
          </div>

          {/* #15 2FA */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Two-factor auth</p>
              <p className="text-[12px] text-[#8e8e93] mt-0.5">{me?.twoFactorEnabled ? "Enabled" : "Adds an extra layer at login"}</p>
            </div>
            <button onClick={() => saveSetting({ twoFactorEnabled: !me?.twoFactorEnabled })}
              className="px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-[#E5E5EA] text-[#3A3A3C] hover:border-[#007AFF] hover:text-[#007AFF]">
              {me?.twoFactorEnabled ? "Disable" : "Enable (preview)"}
            </button>
          </div>
        </div>
      )}

      {/* ── PRIVACY view ── */}
      {view === "privacy" && (
        <div className="grid md:grid-cols-2 gap-5">
          {/* #14 Data export + delete */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5] space-y-4">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Your data</p>
            <button onClick={exportData} className="w-full py-3 rounded-xl bg-[#1c1c1e] text-white text-[13px] font-semibold hover:bg-[#3A3A3C]">
              ⬇ Download my data (JSON)
            </button>
            <button onClick={() => navigate("/settings")} className="w-full py-3 rounded-xl border border-[#FF3B30] text-[#FF3B30] text-[13px] font-semibold hover:bg-[#FF3B30]/8">
              Delete account
            </button>
            <p className="text-[11px] text-[#8e8e93]">
              GDPR/PDPB compliant. Includes attempts, bookmarks, badges, profile.
            </p>
          </div>

          {/* #16 Active sessions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Active sessions</p>
            {sessions.length === 0 ? (
              <p className="text-[12px] text-[#8e8e93] py-3 text-center">Just this one — no other devices.</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAFB]">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1c1c1e]">{s.device}</p>
                      <p className="text-[11px] text-[#8e8e93]">Last seen {weeksAgo(s.lastSeenAt) || "recently"}</p>
                    </div>
                    {!s.current && <button onClick={async () => { await profileRevokeSession(s.id); setSessions((p) => p.filter((x) => x.id !== s.id)); }} className="text-[11px] font-semibold text-[#FF3B30]">Sign out</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
