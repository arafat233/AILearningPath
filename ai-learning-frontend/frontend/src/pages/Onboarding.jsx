import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChild } from "../services/api";
import { useAuthStore } from "../store/authStore";
import StellarLogo from "../components/StellarLogo";

const CLASSES = ["1","2","3","4","5","6","7","8","9","10","11","12"];
const BOARDS  = ["CBSE","ICSE","AP_SSC","IB","SSC","State Board"];

export default function Onboarding() {
  const { user, setAuth, setActiveChild } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    childName:  "",
    grade:      "10",
    examBoard:  "CBSE",
    schoolName: "",
    location:   "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.childName.trim()) { setError("Please enter the student name."); return; }
    setSaving(true);
    setError("");
    try {
      const { data } = await createChild(form);
      const child = data.data.child;
      // createChild seeds the school track server-side. If the response shape
      // omits tracks (legacy), top up locally so the onboarding gate doesn't
      // bounce us through /welcome → /start to re-enter board+grade.
      const enrolled = child.tracks?.length
        ? child
        : { ...child, tracks: [{ key: "school" }], activeTrack: child.activeTrack || "school" };
      setActiveChild(enrolled);
      setAuth(null, { ...user, linkedStudents: [...(user?.linkedStudents || []), child._id] });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <StellarLogo size={56} />
          </div>
          <h1 className="text-[24px] font-bold text-[var(--label)] tracking-tight">Tell us about your child</h1>
          <p className="text-[14px] text-apple-gray mt-1">We'll personalise their study experience</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {/* Student name */}
          <div>
            <label className="text-[12px] font-medium text-apple-gray block mb-1.5">Student name</label>
            <input
              className="input w-full"
              placeholder="e.g. Ayaan Khan"
              value={form.childName}
              onChange={(e) => f("childName", e.target.value)}
              autoFocus
            />
          </div>

          {/* Class + Board row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-apple-gray block mb-1.5">Class</label>
              <select className="input w-full" value={form.grade} onChange={(e) => f("grade", e.target.value)}>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-apple-gray block mb-1.5">Board</label>
              <select className="input w-full" value={form.examBoard} onChange={(e) => f("examBoard", e.target.value)}>
                {BOARDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* School name */}
          <div>
            <label className="text-[12px] font-medium text-apple-gray block mb-1.5">School name</label>
            <input
              className="input w-full"
              placeholder="e.g. Delhi Public School"
              value={form.schoolName}
              onChange={(e) => f("schoolName", e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[12px] font-medium text-apple-gray block mb-1.5">Location</label>
            <input
              className="input w-full"
              placeholder="e.g. Mumbai, Maharashtra"
              value={form.location}
              onChange={(e) => f("location", e.target.value)}
            />
          </div>

          {error && <p className="text-[13px] text-apple-red">{error}</p>}

          <button type="submit" disabled={saving} className="btn-primary w-full mt-2">
            {saving ? "Setting up…" : "Continue to Dashboard →"}
          </button>

          <button type="button" onClick={() => navigate("/")}
            className="w-full text-center text-[12px] text-apple-gray hover:text-[var(--label)] transition-colors">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
