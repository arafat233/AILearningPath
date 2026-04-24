import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateMe, getTopics, getTopicsMeta } from "../services/api";
import { useAuthStore } from "../store/authStore";

const STEPS = ["grade", "examDate", "weakTopics", "done"];

export default function Onboarding() {
  const [step, setStep]         = useState(0);
  const [grade, setGrade]       = useState("10");
  const [examDate, setExamDate] = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const [saving, setSaving]     = useState(false);
  const [grades, setGrades]     = useState(["8","9","10","11","12"]);
  const [topicList, setTopicList] = useState([]);
  const { setAuth, token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getTopicsMeta().then((r) => {
      if (r.data.grades?.length) setGrades(r.data.grades.sort());
    }).catch(() => {});
  }, []);

  useEffect(() => {
    getTopics({ grade })
      .then((r) => setTopicList(r.data.map((t) => t.name)))
      .catch(() => {});
  }, [grade]);

  const toggleTopic = (t) =>
    setWeakTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const finish = async () => {
    setSaving(true);
    try {
      const { data } = await updateMe({ grade, examDate });
      setAuth(token, { ...user, name: data.user.name });
    } catch {}
    setSaving(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-7">
          {STEPS.slice(0, -1).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-[background-color] duration-300 ${i <= step ? "bg-brand-500" : "bg-gray-200"}`} />
          ))}
        </div>

        {/* Step 0: Grade */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">What class are you in?</h2>
            <p className="text-sm text-gray-500 mb-5">We'll set up your syllabus and study plan.</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {grades.map((g) => (
                <button key={g} onClick={() => setGrade(g)}
                  className={`py-3 rounded-xl border font-medium transition-[background-color,border-color,color,transform] active:scale-[0.97] ${grade === g ? "border-brand-500 bg-brand-50 text-brand-600" : "border-surface-border text-gray-700"}`}>
                  Class {g}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">Continue →</button>
          </div>
        )}

        {/* Step 1: Exam date */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">When is your exam?</h2>
            <p className="text-sm text-gray-500 mb-5">We'll build a day-by-day plan to cover everything in time.</p>
            <input className="input mb-6" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">← Back</button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Weak topics */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">Which topics feel difficult?</h2>
            <p className="text-sm text-gray-500 mb-4">Select all that apply — we'll prioritise these.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {topicList.map((t) => (
                <button key={t} onClick={() => toggleTopic(t)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-[background-color,border-color,color,transform] active:scale-[0.97] ${weakTopics.includes(t) ? "border-brand-500 bg-brand-50 text-brand-600" : "border-surface-border text-gray-600"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="text-center">
            <p className="text-4xl mb-3">🚀</p>
            <h2 className="text-xl font-semibold mb-2">Your plan is ready!</h2>
            <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1">
              <p>✓ Class {grade} syllabus loaded</p>
              {examDate && <p>✓ Exam countdown: {Math.ceil((new Date(examDate) - new Date()) / 86400000)} days</p>}
              {weakTopics.length > 0 && <p>✓ Priority topics: {weakTopics.slice(0, 3).join(", ")}{weakTopics.length > 3 ? "…" : ""}</p>}
              <p>✓ AI teacher activated</p>
            </div>
            <button onClick={finish} disabled={saving} className="btn-primary w-full">
              {saving ? "Setting up…" : "Go to Dashboard →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
