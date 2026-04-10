import { useEffect, useState, useRef } from "react";
import { getMe, updateMe } from "../services/api";
import { useAuthStore } from "../store/authStore";

const GRADES   = ["8","9","10","11","12"];
const SUBJECTS = ["Math","Science","English","Social Science","Hindi","Sanskrit","Computer Science"];
const GOALS = [
  { value: "pass",        label: "Pass the exam",           emoji: "🎯" },
  { value: "distinction", label: "Score distinction (75%+)", emoji: "⭐" },
  { value: "top",         label: "Top of class (90%+)",     emoji: "🏆" },
  { value: "scholarship", label: "Scholarship rank",         emoji: "🎓" },
];

const PLAN_STYLE = {
  free:    { label: "Free",    bg: "bg-apple-gray5",    text: "text-apple-gray"   },
  pro:     { label: "Pro",     bg: "bg-apple-blue/10",  text: "text-apple-blue"   },
  premium: { label: "Premium", bg: "bg-apple-yellow/10",text: "text-apple-yellow" },
};

function Avatar({ name = "", size = 72 }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  return (
    <div
      className="rounded-full bg-apple-blue flex items-center justify-center shrink-0 shadow-apple"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.32 }}>{initials || "?"}</span>
    </div>
  );
}

function PlanBadge({ plan }) {
  const s = PLAN_STYLE[plan] || PLAN_STYLE.free;
  return (
    <span className={`badge ${s.bg} ${s.text} font-semibold text-[11px] px-2.5 py-1`}>
      {plan === "premium" ? "⚡ " : ""}{s.label}
    </span>
  );
}

export default function Profile() {
  const { user, setAuth, token } = useAuthStore();
  const [profile, setProfile]   = useState(null);
  const [form, setForm]         = useState({ name: "", examDate: "", grade: "10", subject: "Math", goal: "pass" });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [editMode, setEditMode] = useState(false);
  const timerRef                = useRef(null);

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        const u = data.user;
        setProfile(data.profile);
        setForm({
          name:     u.name     || "",
          examDate: u.examDate ? u.examDate.split("T")[0] : "",
          grade:    u.grade    || "10",
          subject:  u.subject  || "Math",
          goal:     u.goal     || "pass",
        });
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleSave = async () => {
    setError(""); setSuccess(false); setSaving(true);
    try {
      const { data } = await updateMe(form);
      setAuth(token, { ...user, name: data.user.name });
      setSuccess(true);
      setEditMode(false);
      timerRef.current = setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const daysToExam = () => {
    if (!form.examDate) return null;
    const d = Math.ceil((new Date(form.examDate) - new Date()) / 86400000);
    return d > 0 ? d : null;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading profile…</p>
      </div>
    </div>
  );

  const days    = daysToExam();
  const goalObj = GOALS.find((g) => g.value === form.goal);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">My Profile</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">Manage your account and learning preferences</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="bg-apple-green/8 border border-apple-green/20 text-apple-green text-[13px] px-4 py-3 rounded-apple-lg flex items-center gap-2">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Hero card */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <Avatar name={form.name} size={72} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-[20px] font-bold text-[var(--label)] truncate">{form.name || "—"}</h2>
              <PlanBadge plan={user?.plan || "free"} />
            </div>
            <p className="text-[13px] text-apple-gray">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="badge bg-apple-gray6 text-apple-gray">Class {form.grade}</span>
              <span className="badge bg-apple-gray6 text-apple-gray">{form.subject}</span>
              {goalObj && (
                <span className="badge bg-apple-gray6 text-apple-gray">{goalObj.emoji} {goalObj.label}</span>
              )}
            </div>
          </div>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="btn-secondary text-[13px] px-4 py-2 shrink-0">
              Edit
            </button>
          )}
        </div>

        {/* Exam countdown */}
        {days && (
          <div className="mt-5 flex items-center gap-4 bg-apple-blue/6 border border-apple-blue/15 rounded-apple-lg px-5 py-4">
            <p className="text-[36px] font-black text-apple-blue leading-none">{days}</p>
            <div>
              <p className="text-[13px] font-semibold text-apple-blue">days to exam</p>
              <p className="text-[12px] text-apple-blue/60">
                {new Date(form.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit form */}
      {editMode ? (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[var(--label)]">Edit Profile</h3>
            <button onClick={() => { setEditMode(false); setError(""); }} className="btn-ghost text-[13px]">✕ Cancel</button>
          </div>

          <Field label="Full Name">
            <input className="input" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </Field>

          <Field label="Exam Date" hint="Used to build your study plan and countdown">
            <input className="input" type="date" value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Grade">
              <select className="input" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                {GRADES.map((g) => <option key={g} value={g}>Class {g}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Study Goal">
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button key={g.value} type="button" onClick={() => setForm({ ...form, goal: g.value })}
                  className={`flex items-center gap-2 px-3 py-3 rounded-apple-lg border text-[13px] text-left transition-all
                    ${form.goal === g.value
                      ? "border-apple-blue bg-apple-blue/8 text-apple-blue font-semibold"
                      : "border-apple-gray5 bg-apple-gray6 text-[var(--label2)] hover:border-apple-gray4"
                    }`}>
                  <span>{g.emoji}</span> {g.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : "Save changes"}
            </button>
            <button onClick={() => { setEditMode(false); setError(""); }} className="btn-secondary px-5">Cancel</button>
          </div>
        </div>
      ) : (
        /* Read-only details */
        <div className="card p-6">
          <h3 className="text-[13px] font-semibold text-[var(--label)] mb-4">Profile Details</h3>
          <dl className="space-y-0">
            {[
              { label: "Full Name",       value: form.name || "—" },
              { label: "Email",           value: user?.email || "—" },
              { label: "Grade",           value: `Class ${form.grade}` },
              { label: "Primary Subject", value: form.subject || "—" },
              { label: "Study Goal",      value: goalObj ? `${goalObj.emoji} ${goalObj.label}` : "—" },
              { label: "Exam Date",       value: form.examDate ? new Date(form.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Not set" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-apple-gray5 last:border-0">
                <dt className="text-[13px] text-apple-gray">{label}</dt>
                <dd className="text-[13px] font-medium text-[var(--label)]">{value}</dd>
              </div>
            ))}
          </dl>
          <button onClick={() => setEditMode(true)} className="btn-secondary w-full mt-4 text-[13px]">
            Edit Profile
          </button>
        </div>
      )}

      {/* Learning stats */}
      {profile && (
        <div className="card p-6">
          <h3 className="text-[13px] font-semibold text-[var(--label)] mb-4">Learning Stats</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Attempts",  value: profile.totalAttempts ?? 0,                           accent: "blue"   },
              { label: "Accuracy",  value: `${Math.round((profile.accuracy ?? 0) * 100)}%`,      accent: "green"  },
              { label: "Avg Time",  value: profile.avgTime ? `${Math.round(profile.avgTime)}s` : "—", accent: "orange" },
            ].map(({ label, value, accent }) => {
              const colors = { blue: "text-apple-blue", green: "text-apple-green", orange: "text-apple-orange" };
              return (
                <div key={label} className="bg-apple-gray6 rounded-apple-lg p-4 text-center">
                  <p className={`text-[24px] font-black ${colors[accent]}`}>{value}</p>
                  <p className="text-[11px] text-apple-gray mt-1">{label}</p>
                </div>
              );
            })}
          </div>

          {profile.thinkingProfile && (
            <div className="bg-apple-blue/6 border border-apple-blue/15 rounded-apple-lg px-4 py-3 mb-3">
              <p className="text-[11px] font-semibold text-apple-blue uppercase tracking-wider">Thinking Profile</p>
              <p className="text-[14px] font-bold text-[var(--label)] mt-1">{profile.thinkingProfile}</p>
            </div>
          )}

          {(profile.strongAreas?.length > 0 || profile.weakAreas?.length > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {profile.strongAreas?.length > 0 && (
                <div className="bg-apple-green/6 border border-apple-green/15 rounded-apple-lg px-3 py-3">
                  <p className="text-[11px] font-semibold text-apple-green mb-2">💪 Strong Areas</p>
                  {profile.strongAreas.slice(0, 3).map((a) => (
                    <p key={a} className="text-[12px] text-[var(--label2)]">{a}</p>
                  ))}
                </div>
              )}
              {profile.weakAreas?.length > 0 && (
                <div className="bg-apple-orange/6 border border-apple-orange/15 rounded-apple-lg px-3 py-3">
                  <p className="text-[11px] font-semibold text-apple-orange mb-2">📈 Needs Work</p>
                  {profile.weakAreas.slice(0, 3).map((a) => (
                    <p key={a} className="text-[12px] text-[var(--label2)]">{a}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Account */}
      <div className="card p-6">
        <h3 className="text-[13px] font-semibold text-[var(--label)] mb-4">Account</h3>
        <div className="flex items-center justify-between py-3 border-b border-apple-gray5">
          <span className="text-[13px] text-apple-gray">Plan</span>
          <PlanBadge plan={user?.plan || "free"} />
        </div>
        {user?.planExpiry && (
          <div className="flex items-center justify-between py-3 border-b border-apple-gray5">
            <span className="text-[13px] text-apple-gray">Plan expires</span>
            <span className="text-[13px] font-medium text-[var(--label)]">
              {new Date(user.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between py-3">
          <span className="text-[13px] text-apple-gray">Member since</span>
          <span className="text-[13px] font-medium text-[var(--label)]">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-apple-gray3">{hint}</p>}
    </div>
  );
}
