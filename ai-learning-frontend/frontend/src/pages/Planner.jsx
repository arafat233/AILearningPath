import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlan, markDayComplete } from "../services/api";

const GOAL_LABEL = {
  pass:        "Pass the exam",
  distinction: "Score 75%+",
  top:         "Top 90%+",
  scholarship: "Scholarship rank",
};

export default function Planner() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    getPlan()
      .then((r) => setPlan(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (day) => {
    setCompleting(day);
    try {
      await markDayComplete(day);
      setPlan((p) => ({
        ...p,
        dailyPlan: p.dailyPlan.map((d) =>
          d.day === day ? { ...d, completed: true } : d
        ),
      }));
    } catch {}
    setCompleting(null);
  };

  if (loading) return <div className="text-gray-400 text-sm">Building your study plan…</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Study Planner</h1>
          <p className="text-sm text-gray-500">
            {plan?.daysLeft != null
              ? `${plan.daysLeft} days until your exam. Your personalised plan is below.`
              : "Set your exam date in your profile to get a tailored plan."}
            {plan?.goal && (
              <span className="ml-2 text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                Goal: {GOAL_LABEL[plan.goal] || plan.goal}
              </span>
            )}
          </p>
        </div>
        {/* Start today's session */}
        {plan?.dailyPlan?.[0]?.topics?.length > 0 && !plan.dailyPlan[0].completed && (
          <button
            onClick={() => navigate("/practice", { state: { topic: plan.dailyPlan[0].topics[0], mixTopics: plan.dailyPlan[0].topics } })}
            className="btn-primary shrink-0 ml-4"
          >
            Start today →
          </button>
        )}
      </div>

      {/* Top row: priorities + skip suggestions */}
      <div className="grid md:grid-cols-2 gap-5 mb-7">
        {/* Priority topics */}
        <div className="card p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Priority Topics</p>
          {plan?.priorityTopics?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {plan.priorityTopics.map((t, i) => (
                <div key={t.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 w-4">#{i + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{t.topic}</span>
                    {t.isWeak && <span className="badge bg-red-50 text-red-600 text-xs">Weak</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-brand-500 rounded-full"
                        style={{ width: `${Math.round(t.priority * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{Math.round(t.priority * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Complete some practice to generate priorities.</p>
          )}
        </div>

        {/* Skip suggestions */}
        <div className="card p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Skip Suggestions</p>
          {plan?.skipSuggestions?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {plan.skipSuggestions.map((s) => (
                <div key={s.topic} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-900">{s.topic}</span>
                    <span className="badge bg-amber-100 text-amber-700 text-xs">−{s.marksLost} marks</span>
                  </div>
                  <p className="text-xs text-amber-700">{s.reason}</p>
                  <p className="text-xs text-amber-600 mt-1">Effort: {s.effort}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No skip suggestions — all topics are worthwhile!</p>
          )}
        </div>
      </div>

      {/* Daily plan */}
      <div className="card p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
          Daily Schedule ({plan?.dailyPlan?.length ?? 0} days planned)
        </p>
        {plan?.dailyPlan?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {plan.dailyPlan.map((d) => (
              <div
                key={d.day}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  d.completed
                    ? "border-green-200 bg-green-50"
                    : "border-surface-border hover:border-brand-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center w-10">
                    <p className="text-xs text-gray-400">Day</p>
                    <p className="text-lg font-semibold text-gray-800">{d.day}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {d.topics.map((t) => (
                        <span key={t} className="badge bg-brand-50 text-brand-600 text-xs">{t}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">~{d.estimatedHours}h estimated</p>
                  </div>
                </div>
                {d.completed ? (
                  <span className="text-green-600 font-medium text-sm">✓ Done</span>
                ) : (
                  <button
                    onClick={() => handleComplete(d.day)}
                    disabled={completing === d.day}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    {completing === d.day ? "…" : "Mark done"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            No plan generated yet. Make sure your exam date is set in your profile.
          </p>
        )}
      </div>
    </div>
  );
}
