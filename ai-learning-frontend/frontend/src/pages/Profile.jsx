import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe, getBadges, getReport, getStreakStatus, getPrediction, getMyGuardians } from "../services/api";
import { useAuthStore } from "../store/authStore";

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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function badgeMeta(type) {
  const catalog = BADGE_CATALOG.find((b) => b.type === type);
  if (catalog) return catalog;
  if (type.startsWith("concept_master_")) {
    const topic = type.replace("concept_master_", "").replace(/_/g, " ");
    return { icon: "🎓", label: `Mastered: ${topic}`, desc: "Consistently correct" };
  }
  return { icon: "🏅", label: type, desc: "Achievement unlocked" };
}

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
}

function weeksAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const weeks = Math.floor(diff / (7 * 86400000));
  if (weeks < 1) return "this week";
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  return d > 0 ? d : null;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function PlanBadge({ plan }) {
  const s = PLAN_STYLE[plan] || PLAN_STYLE.free;
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      {plan === "premium" ? "⚡ " : ""}{s.label}
    </span>
  );
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
  const colorMap = {
    blue:   "text-[#007AFF]",
    green:  "text-[#34C759]",
    purple: "text-[#AF52DE]",
    orange: "text-[#FF9500]",
  };
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5] flex flex-col gap-1">
      <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">{label}</p>
      <p className={`text-[36px] font-bold leading-none tracking-tight mt-1 ${colorMap[color] || "text-[#1c1c1e]"}`}>
        {value}
      </p>
      <p className="text-[12px] text-[#8e8e93] mt-1">{sub}</p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Profile() {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [profile,    setProfile]    = useState(null);
  const [badges,     setBadges]     = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");
  const [editMode,   setEditMode]   = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [guardians,  setGuardians]  = useState([]);

  const [form, setForm] = useState({
    name: "", examDate: "", grade: "10", subject: "Math", goal: "pass",
  });

  const timerRef = useRef(null);
  const copyTimerRef = useRef(null);

  /* referral code */
  const firstName    = user?.name?.split(" ")[0]?.toUpperCase() || "USER";
  const suffix       = user?._id ? user._id.toString().slice(-4).toUpperCase() : "XXXX";
  const referralCode = `${firstName}·${suffix}`;
  const referralUrl  = `https://app.stellar.com/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl).catch(() => {});
    setCopied(true);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const promises = [
      getMe(),
      getBadges().catch(() => ({ data: [] })),
      getStreakStatus().catch(() => ({ data: { data: { streak: 0, longestStreak: 0 } } })),
      getPrediction().catch(() => null),
      getMyGuardians().catch(() => ({ data: [] })),
    ];

    Promise.all(promises)
      .then(([meRes, badgesRes, streakRes, predRes, guardianRes]) => {
        const u = meRes.data.data.user;
        setProfile(meRes.data.data.profile);
        setForm({
          name:     u.name     || "",
          examDate: u.examDate ? u.examDate.split("T")[0] : "",
          grade:    u.grade    || "10",
          subject:  u.subject  || "Math",
          goal:     u.goal     || "pass",
        });
        setBadges(badgesRes.data || []);
        const sd = streakRes.data?.data || streakRes.data || {};
        setStreakData(sd);
        if (predRes) setPrediction(predRes);
        setGuardians(guardianRes.data?.data || guardianRes.data || []);
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleSave = async () => {
    setError(""); setSuccess(false); setSaving(true);
    try {
      const { data } = await updateMe(form);
      setAuth(null, { ...user, name: data.user?.name || form.name });
      setSuccess(true);
      setEditMode(false);
      timerRef.current = setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
        <p className="text-[14px] text-[#8e8e93]">Loading profile…</p>
      </div>
    </div>
  );

  /* ── Derived values ── */
  const goalObj       = GOALS.find((g) => g.value === form.goal);
  const accuracy      = profile?.accuracy ?? 0;
  const totalAttempts = profile?.totalAttempts ?? 0;
  const avgTime       = profile?.avgTime ?? 60;
  const streak        = streakData?.streak        ?? 0;
  const longestStreak = streakData?.longestStreak ?? 0;
  const hours         = Math.round((totalAttempts * avgTime) / 3600);
  const joinedAgo     = weeksAgo(user?.createdAt);
  const examDays      = daysUntil(form.examDate);
  const thinkingProfile = profile?.thinkingProfile || null;

  /* predicted score mid-point */
  let predictedDisplay = "—";
  let predictedSub     = "not enough data";
  if (prediction && prediction.confidence && prediction.predictedMin != null && prediction.predictedMax != null) {
    const mid = Math.round((prediction.predictedMin + prediction.predictedMax) / 2);
    predictedDisplay = `${mid}%`;
    predictedSub     = prediction.predictedGrade || "predicted";
  }

  /* badges display */
  const earnedSet     = new Set(badges);
  const visibleCount  = showAllBadges ? BADGE_CATALOG.length : 8;
  const catalogSlice  = BADGE_CATALOG.slice(0, visibleCount);

  /* extra concept_master badges earned but not in catalog */
  const extraEarned = badges.filter(
    (b) => b.startsWith("concept_master_") && b !== "concept_master_any"
  );

  return (
    <div className="w-full space-y-5">

      {/* ── Alerts ── */}
      {error && (
        <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-2xl flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="bg-[#34C759]/8 border border-[#34C759]/20 text-[#34C759] text-[13px] px-4 py-3 rounded-2xl flex items-center gap-2">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(130deg, #ddd6fe 0%, #fbcfe8 50%, #fde68a 100%)" }}
      >
        {/* Top-right buttons */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-full border border-[#1c1c1e]/20 text-[12px] font-semibold text-[#1c1c1e] bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors"
          >
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={() => { setEditMode(true); setError(""); }}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white bg-[#1c1c1e] hover:bg-[#333] transition-colors"
          >
            Edit profile
          </button>
        </div>

        {/* Avatar + info */}
        <div className="flex items-center gap-4 pt-2">
          <div
            className="rounded-full bg-[#1c1c1e] flex items-center justify-center shrink-0"
            style={{ width: 80, height: 80 }}
          >
            <span className="text-white font-bold text-[28px]">{getInitials(form.name)}</span>
          </div>
          <div className="min-w-0 pr-28">
            <h1 className="text-[32px] font-bold leading-none text-[#1c1c1e] tracking-tight truncate mb-1">
              {form.name || "—"}
            </h1>
            <p className="text-[13px] font-medium text-[#1c1c1e]/70">
              Class {form.grade} · CBSE · {form.subject}
            </p>
            <p className="text-[12px] text-[#1c1c1e]/55 mt-0.5">
              {joinedAgo ? `Joined ${joinedAgo}` : "New member"} · {totalAttempts} sessions · {thinkingProfile || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Streak"
          value={streak}
          sub={`days · longest ${longestStreak}`}
          color="blue"
        />
        <StatCard
          label="Accuracy"
          value={`${Math.round(accuracy * 100)}%`}
          sub="↑ since start"
          color="green"
        />
        <StatCard
          label="Predicted"
          value={predictedDisplay}
          sub={predictedSub}
          color="purple"
        />
        <StatCard
          label="Hours"
          value={hours || "—"}
          sub="across all time"
          color="orange"
        />
      </div>

      {/* ── Two-column main area ── */}
      <div className="grid md:grid-cols-3 gap-5">

        {/* Left col (span 2) */}
        <div className="md:col-span-2 space-y-5">

          {/* Badges card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Achievements</p>
                <p className="text-[14px] font-semibold text-[#1c1c1e] mt-0.5">
                  {badges.length} of {BADGE_CATALOG.length} earned
                </p>
              </div>
              <button
                onClick={() => setShowAllBadges((v) => !v)}
                className="text-[12px] font-semibold text-[#007AFF] hover:opacity-70 transition-opacity"
              >
                {showAllBadges ? "Show less" : "View all →"}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {catalogSlice.map((badge) => {
                const earned = earnedSet.has(badge.type);
                return (
                  <div key={badge.type} className="group relative flex flex-col items-center gap-1.5 w-16 cursor-default">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-[22px] border transition-opacity
                        ${earned
                          ? "bg-[#FF9500]/10 border-[#FF9500]/20"
                          : "bg-[#f2f2f7] border-[#e5e5ea] opacity-40 grayscale"
                        }`}
                    >
                      {badge.icon}
                    </div>
                    <p className="text-[10px] text-[#8e8e93] text-center leading-tight">{badge.label}</p>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-40 pointer-events-none">
                      <div className="bg-[#1c1c1e] text-white text-[11px] rounded-xl px-2.5 py-1.5 text-center shadow-lg">
                        {badge.desc}
                        {!earned && <span className="block text-[#8e8e93] text-[10px] mt-0.5">Not yet earned</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Extra concept_master badges earned (dynamic) */}
              {showAllBadges && extraEarned.map((type) => {
                const m = badgeMeta(type);
                return (
                  <div key={type} className="group relative flex flex-col items-center gap-1.5 w-16 cursor-default">
                    <div className="w-12 h-12 rounded-full bg-[#AF52DE]/10 border border-[#AF52DE]/20 flex items-center justify-center text-[22px]">
                      {m.icon}
                    </div>
                    <p className="text-[10px] text-[#8e8e93] text-center leading-tight">{m.label}</p>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-40 pointer-events-none">
                      <div className="bg-[#1c1c1e] text-white text-[11px] rounded-xl px-2.5 py-1.5 text-center shadow-lg">
                        {m.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Edit form OR Profile details card */}
          {editMode ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Edit Profile</p>
                  <p className="text-[14px] font-semibold text-[#1c1c1e] mt-0.5">Update your details</p>
                </div>
                <button
                  onClick={() => { setEditMode(false); setError(""); }}
                  className="text-[13px] text-[#8e8e93] hover:text-[#1c1c1e] transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>

              <Field label="Full Name">
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px] text-[#1c1c1e] bg-white focus:outline-none focus:border-[#007AFF] transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </Field>

              <Field label="Exam Date" hint="Used to build your study plan and countdown">
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px] text-[#1c1c1e] bg-white focus:outline-none focus:border-[#007AFF] transition-colors"
                  type="date"
                  value={form.examDate}
                  onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Grade">
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px] text-[#1c1c1e] bg-white focus:outline-none focus:border-[#007AFF] transition-colors"
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  >
                    {GRADES.map((g) => <option key={g} value={g}>Class {g}</option>)}
                  </select>
                </Field>
                <Field label="Subject">
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] text-[14px] text-[#1c1c1e] bg-white focus:outline-none focus:border-[#007AFF] transition-colors"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Study Goal">
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setForm({ ...form, goal: g.value })}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-[13px] text-left transition-all active:scale-[0.97]
                        ${form.goal === g.value
                          ? "border-[#007AFF] bg-[#007AFF]/8 text-[#007AFF] font-semibold"
                          : "border-[#e5e5ea] bg-[#f9f9fb] text-[#1c1c1e] hover:border-[#c7c7cc]"
                        }`}
                    >
                      <span>{g.emoji}</span> {g.label}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#007AFF] text-white text-[14px] font-semibold hover:bg-[#0066d6] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : "Save changes"}
                </button>
                <button
                  onClick={() => { setEditMode(false); setError(""); }}
                  className="px-5 py-3 rounded-xl border border-[#e5e5ea] text-[14px] font-semibold text-[#1c1c1e] hover:bg-[#f2f2f7] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Profile Details</p>
              </div>
              <dl className="space-y-0">
                {[
                  { label: "Full Name",       value: form.name || "—" },
                  { label: "Email",           value: user?.email || "—" },
                  { label: "Grade",           value: `Class ${form.grade}` },
                  { label: "Primary Subject", value: form.subject || "—" },
                  { label: "Study Goal",      value: goalObj ? `${goalObj.emoji} ${goalObj.label}` : "—" },
                  {
                    label: "Exam Date",
                    value: form.examDate
                      ? new Date(form.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      : "Not set",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-[#f0f0f5] last:border-0">
                    <dt className="text-[12px] text-[#8e8e93]">{label}</dt>
                    <dd className="text-[14px] font-medium text-[#1c1c1e]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Strong / Weak areas */}
          {(profile?.strongAreas?.length > 0 || profile?.weakAreas?.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {profile?.strongAreas?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#34C759] mb-3">💪 Strong Areas</p>
                  <div className="space-y-1.5">
                    {profile.strongAreas.slice(0, 3).map((a) => (
                      <p key={a} className="text-[13px] text-[#1c1c1e]">{a}</p>
                    ))}
                  </div>
                </div>
              )}
              {profile?.weakAreas?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0f0f5]">
                  <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#FF9500] mb-3">📈 Needs Work</p>
                  <div className="space-y-1.5">
                    {profile.weakAreas.slice(0, 3).map((a) => (
                      <p key={a} className="text-[13px] text-[#1c1c1e]">{a}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="md:col-span-1 space-y-5">

          {/* Invite a Friend */}
          <div
            className="rounded-2xl p-6 shadow-sm border border-[#e8e0f8]"
            style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}
          >
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#7c3aed] mb-1">Invite a Friend</p>
            <p className="text-[12px] text-[#6b21a8]/70 mb-4">
              Both get a free month of Pro when they sign up.
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 mb-4 text-center">
              <p className="font-mono text-[22px] font-bold tracking-widest text-[#1c1c1e]">
                {referralCode}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-[#1c1c1e] text-white text-[13px] font-semibold hover:bg-[#333] transition-colors"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>

          {/* Account */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-4">Account</p>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-[#f0f0f5]">
                <span className="text-[12px] text-[#8e8e93]">Plan</span>
                <PlanBadge plan={user?.plan || "free"} />
              </div>
              {user?.planExpiry && (
                <div className="flex items-center justify-between py-3 border-b border-[#f0f0f5]">
                  <span className="text-[12px] text-[#8e8e93]">Expires</span>
                  <span className="text-[13px] font-medium text-[#1c1c1e]">
                    {new Date(user.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-3">
                <span className="text-[12px] text-[#8e8e93]">Member since</span>
                <span className="text-[13px] font-medium text-[#1c1c1e]">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Exam countdown */}
          {examDays && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Exam Countdown</p>
              <div className="flex items-center gap-4">
                <p className="text-[36px] font-bold leading-none tracking-tight text-[#007AFF]">{examDays}</p>
                <div>
                  <p className="text-[13px] font-semibold text-[#007AFF]">days remaining</p>
                  <p className="text-[12px] text-[#8e8e93]">
                    {new Date(form.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Linked parents / teachers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-4">Linked Parents</p>

            {guardians.length === 0 ? (
              <p className="text-[13px] text-[#8e8e93] text-center py-3">
                No parents linked yet — share your invite code with a parent or teacher.
              </p>
            ) : (
              <div className="space-y-0">
                {guardians.map((g) => {
                  const initials = g.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
                  return (
                    <div key={g._id || g.email} className="flex items-center gap-3 py-3 border-b border-[#f0f0f5] last:border-0">
                      <div className="w-9 h-9 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-[#007AFF]">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{g.name}</p>
                        <p className="text-[11px] text-[#8e8e93] capitalize">{g.role} · weekly digest on</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#34C759]/10 text-[#34C759] shrink-0">
                        active
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleCopy}
              className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-[#c7c7cc] text-[13px] font-medium text-[#8e8e93] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
            >
              {copied ? "Link copied!" : "+ Invite a teacher"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
