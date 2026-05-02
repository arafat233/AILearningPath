import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe, getTopicsMeta, getSubscription, deleteMe, validateCoupon, createOrder } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { usePushNotifications } from "../hooks/usePushNotifications";

const GOALS = [
  { value: "pass",        label: "Pass the exam"           },
  { value: "distinction", label: "Score 75%+ (Distinction)" },
  { value: "top",         label: "Top 90%+"                 },
  { value: "scholarship", label: "Scholarship rank"         },
];

export default function Settings() {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: "", examDate: "", grade: "10", subject: "Math", goal: "distinction", weakTopics: [] });
  const [weakInput, setWeakInput] = useState("");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]       = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm]     = useState("");
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
        const profile = meRes.data.data.profile;
        setForm({
          name:        u.name     || "",
          examDate:    u.examDate ? u.examDate.split("T")[0] : "",
          grade:       u.grade    || "10",
          subject:     u.subject  || "Math",
          goal:        u.goal     || "distinction",
          weakTopics:  profile?.weakAreas || [],
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
      const { data } = await updateMe({ ...form, weakTopics: form.weakTopics });
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

      {/* Coupon code */}
      {subscription && !subscription.isActive && <CouponInput />}

      {/* Referral link */}
      <ReferralCard user={user} subscription={subscription} />

      {/* Revision reminders */}
      <NotificationsCard />

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

          <Field label="Weak Topics" hint="Topics you find difficult — used to prioritise practice and AI explanations">
            <div className="flex gap-2">
              <input
                className="input flex-1"
                value={weakInput}
                onChange={(e) => setWeakInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const t = weakInput.trim();
                    if (t && !form.weakTopics.includes(t)) {
                      setForm({ ...form, weakTopics: [...form.weakTopics, t] });
                    }
                    setWeakInput("");
                  }
                }}
                placeholder="Type a topic and press Enter"
              />
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-[13px] shrink-0"
                onClick={() => {
                  const t = weakInput.trim();
                  if (t && !form.weakTopics.includes(t)) {
                    setForm({ ...form, weakTopics: [...form.weakTopics, t] });
                  }
                  setWeakInput("");
                }}
              >
                Add
              </button>
            </div>
            {form.weakTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.weakTopics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-apple-red/10 text-apple-red text-[12px] font-medium"
                  >
                    {t}
                    <button
                      type="button"
                      className="opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                      onClick={() => setForm({ ...form, weakTopics: form.weakTopics.filter((x) => x !== t) })}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
          onClick={() => { setShowDeleteModal(true); setDeleteConfirm(""); }}
          disabled={deleting}
        >
          Delete my account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-[var(--bg)] rounded-apple-xl shadow-apple-xl w-full max-w-sm p-6 space-y-4">
            <p className="text-[17px] font-bold text-[var(--label)]">Delete account?</p>
            <p className="text-[13px] text-apple-gray leading-relaxed">
              This will permanently delete your account and all practice data. This action <strong>cannot be undone</strong>.
            </p>
            <div>
              <p className="text-[12px] text-apple-gray mb-1.5">Type <strong>DELETE</strong> to confirm:</p>
              <input
                className="input w-full text-[14px]"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                autoFocus
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                className="btn-secondary flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-apple-red text-white text-[13px] font-semibold py-2 rounded-apple disabled:opacity-40 transition-opacity"
                disabled={deleteConfirm !== "DELETE" || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteMe();
      logout();
      navigate("/login");
    } catch {
      setError("Could not delete account. Please try again.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }
}

function NotificationsCard() {
  const { supported, subscribed, permission, loading, error, subscribe, unsubscribe } = usePushNotifications();

  if (!supported) return null;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[var(--label)] mb-0.5">Revision reminders</p>
          <p className="text-[12px] text-apple-gray">
            {subscribed
              ? "You'll get a push notification each day you have topics due for revision."
              : permission === "denied"
              ? "Notifications blocked in browser settings. Update site permissions to enable."
              : "Get notified when topics are due for spaced-repetition revision."}
          </p>
          {error && <p className="text-[12px] text-apple-red mt-1">{error}</p>}
        </div>
        <button
          type="button"
          onClick={subscribed ? unsubscribe : subscribe}
          disabled={loading || permission === "denied"}
          className={`shrink-0 px-4 py-2 rounded-apple text-[13px] font-medium transition-colors disabled:opacity-50
            ${subscribed
              ? "bg-apple-gray5 text-[var(--label)] hover:bg-apple-gray4"
              : "btn-primary"}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              {subscribed ? "Disabling…" : "Enabling…"}
            </span>
          ) : subscribed ? "Turn off" : "Enable"}
        </button>
      </div>
    </div>
  );
}

function CouponInput() {
  const [code,    setCode]    = useState("");
  const [planKey, setPlanKey] = useState("pro");
  const [result,  setResult]  = useState(null);  // { discountLabel, finalPrice, originalPrice }
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const check = async () => {
    if (!code.trim()) return;
    setErr(""); setResult(null); setLoading(true);
    try {
      const { data } = await validateCoupon(code.trim(), planKey);
      setResult(data);
    } catch (e) {
      setErr(e.response?.data?.error || "Invalid coupon");
    } finally { setLoading(false); }
  };

  const apply = async () => {
    if (!result) return;
    try {
      const { data } = await createOrder(planKey, code.trim());
      // Hand off to Razorpay checkout — stored in window so the pricing page can pick it up
      window._pendingOrder = data;
      navigate("/pricing");
    } catch (e) {
      setErr(e.response?.data?.error || "Could not create order");
    }
  };

  return (
    <div className="card p-5 border border-apple-blue/20">
      <p className="text-[13px] font-semibold text-[var(--label)] mb-3">Have a coupon code?</p>
      <div className="flex gap-2 mb-2">
        <select
          value={planKey}
          onChange={(e) => { setPlanKey(e.target.value); setResult(null); setErr(""); }}
          className="input text-[13px] w-40"
        >
          <option value="pro">Pro Monthly</option>
          <option value="pro_annual">Pro Annual</option>
          <option value="premium">Premium Monthly</option>
          <option value="premium_annual">Premium Annual</option>
        </select>
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="COUPON CODE"
          className="input flex-1 text-[13px] font-mono tracking-wider"
          maxLength={32}
        />
        <button
          onClick={check}
          disabled={loading || !code.trim()}
          className="btn-secondary px-4 py-2 text-[13px] shrink-0 disabled:opacity-40"
        >
          {loading ? "…" : "Check"}
        </button>
      </div>

      {err && <p className="text-[12px] text-apple-red mb-2">{err}</p>}

      {result && (
        <div className="flex items-center justify-between bg-apple-green/8 border border-apple-green/20 rounded-apple px-3 py-2.5">
          <div>
            <p className="text-[13px] font-semibold text-apple-green">
              {result.discountLabel} applied
            </p>
            <p className="text-[12px] text-apple-gray">
              ₹{(result.finalPrice / 100).toFixed(0)} instead of ₹{(result.originalPrice / 100).toFixed(0)}
            </p>
          </div>
          <button onClick={apply} className="btn-primary text-[12px] px-3 py-1.5">
            Pay now →
          </button>
        </div>
      )}
    </div>
  );
}

function ReferralCard({ user, subscription }) {
  const [copied, setCopied] = useState(false);
  const referralLink = user?.inviteCode
    ? `${window.location.origin}/register?ref=${user.inviteCode}`
    : null;

  if (!referralLink) return null;

  const copy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card p-5 border border-apple-purple/20">
      <p className="text-[13px] font-semibold text-[var(--label)] mb-0.5">Refer a friend</p>
      <p className="text-[12px] text-apple-gray mb-3">
        Share your link. When your friend upgrades to a paid plan, you get 30 free days added to your subscription.
        {user?.referralCount > 0 && (
          <span className="ml-1 font-semibold text-apple-purple">
            {user.referralCount} successful referral{user.referralCount !== 1 ? "s" : ""} so far!
          </span>
        )}
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={referralLink}
          className="input flex-1 text-[12px] font-mono bg-apple-gray6 text-apple-gray"
        />
        <button onClick={copy} className="btn-secondary px-4 py-2 text-[13px] shrink-0">
          {copied ? "Copied!" : "Copy"}
        </button>
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
