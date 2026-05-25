import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChild } from "../services/api";
import { useAuthStore } from "../store/authStore";

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
      setActiveChild(data.data.child);
      setAuth(null, { ...user, linkedStudents: [...(user?.linkedStudents || []), data.data.child._id] });
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[18px] mb-4"
               style={{ background: "linear-gradient(135deg,#9D50BB,#3A1C71)" }}>
            <svg viewBox="0 0 500 500" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M310 255 L350 310" stroke="white" strokeWidth="16" strokeLinecap="round" fill="none"/>
              <path d="M310 255 L260 320" stroke="white" strokeWidth="16" strokeLinecap="round" fill="none"/>
              <path d="M190 190 L310 255" stroke="white" strokeWidth="16" strokeLinecap="round" fill="none"/>
              <circle cx="310" cy="255" r="22" fill="white"/>
              <circle cx="350" cy="310" r="22" fill="white"/>
              <circle cx="260" cy="320" r="22" fill="white"/>
            </svg>
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
