import { useEffect, useState } from "react";
import { getMe, updateMe } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Settings() {
  const { user, setAuth } = useAuthStore();
  const token = useAuthStore((s) => s.token);

  const [form, setForm]       = useState({ name: "", examDate: "", grade: "10", subject: "Math", goal: "distinction" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        const u = data.user;
        setForm({
          name:     u.name     || "",
          examDate: u.examDate ? u.examDate.split("T")[0] : "",
          grade:    u.grade    || "10",
          subject:  u.subject  || "Math",
          goal:     u.goal     || "distinction",
        });
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const { data } = await updateMe(form);
      // Update the auth store so the sidebar name updates instantly
      setAuth(token, { ...user, name: data.user.name });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading profile…</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Update your profile and exam details</p>

      <div className="card p-6">
        {error   && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">Profile updated successfully.</div>}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Full name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Exam date</label>
            <input
              className="input"
              type="date"
              value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">Used to build your study plan and countdown</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Grade / Class</label>
            <select
              className="input"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            >
              {["8","9","10","11","12"].map((g) => (
                <option key={g} value={g}>Class {g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
            <select
              className="input"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              {["Math", "Science", "English", "Social Studies", "Hindi"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">My target</label>
            <select
              className="input"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            >
              <option value="pass">Pass the exam</option>
              <option value="distinction">Score 75%+ (Distinction)</option>
              <option value="top">Top 90%+</option>
              <option value="scholarship">Scholarship rank</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Used to calibrate difficulty and study priorities</p>
          </div>

          <button className="btn-primary mt-2" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
