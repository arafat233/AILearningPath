import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe, getTopicsMeta, getSubscription, deleteMe } from "../services/api";
import { useAuthStore } from "../store/authStore";

const GOALS = [
  { value: "pass",        label: "Pass the exam"           },
  { value: "distinction", label: "Score 75%+ (Distinction)" },
  { value: "top",         label: "Top 90%+"                 },
  { value: "scholarship", label: "Scholarship rank"         },
];

export default function Settings() {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: "", examDate: "", grade: "10", subject: "Math", goal: "distinction" });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState(false);
  const { logout } = useAuthStore();
  const [meta, setMeta]           = useState({ subjects: ["English","Hindi","Math","Science","Social Science"], grades: ["8","9","10","11","12"] });
  const [subscription, setSub]    = useState(null);

  useEffect(() => {
    getTopicsMeta().then((r) => setMeta(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([getMe(), getSubscription()])
      .then(([meRes, subRes]) => {
        const u = meRes.data.data.user;
        setForm({
          name:     u.name     || "",
          examDate: u.examDate ? u.examDate.split("T")[0] : "",
          grade:    u.grade    || "10",
          subject:  u.subject  || "Math",
          goal:     u.goal     || "distinction",
        });
        setSub(subRes.data.data);
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setSaving(true);
    try {
      const { data } = await updateMe(form);
      setAuth(null, {
        ...user,
        name:     data.user.name,
        grade:    data.user.grade    ?? user.grade,
        subject:  data.user.subject  ?? user.subject,
        goal:     data.user.goal     ?? user.goal,
        examDate: data.user.examDate ?? user.examDate,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading settings…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Settings</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">Update your profile and exam details</p>
      </div>

      {/* Trial banner */}
      {subscription?.trialActive && (
        <div className="card p-4 flex items-center justify-between gap-4 border border-apple-purple/30 bg-apple-purple/5">
          <div>
            <p className="text-[13px] font-semibold text-apple-purple">
              🎉 Free Trial Active — Pro features unlocked
            </p>
            <p className="text-[12px] text-apple-gray mt-0.5">
              {subscription.trialDaysLeft} day{subscription.trialDaysLeft !== 1 ? "s" : ""} remaining. Upgrade to keep access.
            </p>
          </div>
          <button className="btn-primary px-4 py-2 text-[13px] whitespace-nowrap" onClick={() => navigate("/pricing")}>
            Upgrade
          </button>
        </div>
      )}

      {/* Subscription card */}
      {subscription && (
        <div className={`card p-5 flex items-center justify-between gap-4 ${
          subscription.isActive
            ? "border border-apple-green/30 bg-apple-green/5"
            : "border border-apple-gray4"
        }`}>
          <div>
            <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider mb-0.5">
              Current Plan
            </p>
            <p className="text-[16px] font-bold text-[var(--label)] capitalize">
              {subscription.isActive ? subscription.plan.replace("_", " ") : "Free"}
              {subscription.isActive && (
                <span className="ml-2 text-[11px] font-normal text-apple-green">Active</span>
              )}
            </p>
            {subscription.isActive && subscription.planExpiry && (
              <p className="text-[12px] text-apple-gray mt-0.5">
                Renews {new Date(subscription.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
            {!subscription.isActive && !subscription.trialActive && (
              <p className="text-[12px] text-apple-gray mt-0.5">
                {subscription.aiCallsToday}/10 AI explanations used today
              </p>
            )}
          </div>
          {!subscription.isActive ? (
            <button
              className="btn-primary px-4 py-2 text-[13px] whitespace-nowrap"
              onClick={() => navigate("/pricing")}
            >
              Upgrade
            </button>
          ) : (
            <button
              className="text-[13px] text-apple-blue font-medium whitespace-nowrap"
              onClick={() => navigate("/pricing")}
            >
              Manage
            </button>
          )}
        </div>
      )}

      <div className="card p-6">
        {error && (
          <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-apple-green/8 border border-apple-green/20 text-apple-green text-[13px] px-4 py-3 rounded-apple-lg mb-4">
            ✅ Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <Field label="Full Name">
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Your full name"
            />
          </Field>

          <Field label="Exam Date" hint="Used to build your study plan and countdown">
            <input
              className="input"
              type="date"
              value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Grade">
              <select
                className="input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                {meta.grades.map((g) => (
                  <option key={g} value={g}>Class {g}</option>
                ))}
              </select>
            </Field>

            <Field label="Subject">
              <select
                className="input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {meta.subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Study Goal" hint="Used to calibrate difficulty and study priorities">
            <select
              className="input"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            >
              {GOALS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </Field>

          <button className="btn-primary py-3 mt-1" disabled={saving}>
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : "Save changes"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border border-apple-red/20">
        <p className="text-[13px] font-semibold text-apple-red mb-1">Danger Zone</p>
        <p className="text-[12px] text-apple-gray mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button
          className="text-[13px] font-medium text-apple-red border border-apple-red/30 px-4 py-2 rounded-apple hover:bg-apple-red/8 transition-colors disabled:opacity-50"
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Delete my account"}
        </button>
      </div>
    </div>
  );

  async function handleDeleteAccount() {
    if (!window.confirm("This will permanently delete your account and all data. This cannot be undone.")) return;
    const input = window.prompt("Type DELETE to confirm:");
    if (input !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteMe();
      logout();
      navigate("/login");
    } catch {
      setError("Could not delete account. Please try again.");
      setDeleting(false);
    }
  }
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
