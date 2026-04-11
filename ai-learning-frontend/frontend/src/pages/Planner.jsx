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
  const [plan, setPlan]         = useState(null);
  const [loading, setLoading]   = useState(true);
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Building your study plan…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Study Planner</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">
            {plan?.daysLeft != null
              ? `${plan.daysLeft} days until your exam. Your personalised plan is below.`
              : "Set your exam date in your profile to get a tailored plan."}
            {plan?.goal && (
              <span className="ml-2 badge bg-apple-blue/10 text-apple-blue">
                Goal: {GOAL_LABEL[plan.goal] || plan.goal}
              </span>
            )}
          </p>
        </div>
        {plan?.dailyPlan?.[0]?.topics?.length > 0 && !plan.dailyPlan[0].completed && (
          <button
            onClick={() => navigate("/practice", { state: { topic: plan.dailyPlan[0].topics[0], mixTopics: plan.dailyPlan[0].topics } })}
            className="btn-primary shrink-0 ml-4"
          >
            Start today →
          </button>
        )}
      </div>

      {/* Priority topics + skip suggestions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Priority topics */}
        <div className="card p-5">
          <p className="section-label">Priority Topics</p>
          {plan?.priorityTopics?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {plan.priorityTopics.map((t, i) => (
                <div key={t.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-apple-gray w-4">#{i + 1}</span>
                    <span className="text-[13px] font-medium text-[var(--label)]">{t.topic}</span>
                    {t.isWeak && (
                      <span className="badge bg-apple-red/10 text-apple-red">Weak</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-apple-gray5 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-apple-blue rounded-full"
                        style={{ width: `${Math.round(t.priority * 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-apple-gray">{Math.round(t.priority * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-apple-gray">Complete some practice to generate priorities.</p>
          )}
        </div>

        {/* Skip suggestions */}
        <div className="card p-5">
          <p className="section-label">Skip Suggestions</p>
          {plan?.skipSuggestions?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {plan.skipSuggestions.map((s) => (
                <div key={s.topic} className="p-3 bg-apple-yellow/6 border border-apple-yellow/20 rounded-apple-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-[var(--label)]">{s.topic}</span>
                    <span className="badge bg-apple-yellow/10 text-apple-yellow">−{s.marksLost} marks</span>
                  </div>
                  <p className="text-[12px] text-apple-gray">{s.reason}</p>
                  <p className="text-[11px] text-apple-gray3 mt-1">Effort: {s.effort}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-apple-gray">No skip suggestions — all topics are worthwhile!</p>
          )}
        </div>
      </div>

      {/* Daily plan */}
      <div className="card p-5">
        <p className="section-label">
          Daily Schedule{plan?.dailyPlan?.length ? ` — ${plan.dailyPlan.length} days planned` : ""}
        </p>
        {plan?.dailyPlan?.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {plan.dailyPlan.map((d) => (
              <div
                key={d.day}
                className={`flex items-center justify-between p-4 rounded-apple-lg border transition-all duration-150 ${
                  d.completed
                    ? "border-apple-green/25 bg-apple-green/6"
                    : "border-apple-gray5 hover:border-apple-blue/25 hover:bg-apple-blue/4"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center w-10">
                    <p className="text-[10px] text-apple-gray">Day</p>
                    <p className="text-[18px] font-semibold text-[var(--label)]">{d.day}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {d.topics.map((t) => (
                        <span key={t} className="badge bg-apple-blue/10 text-apple-blue">{t}</span>
                      ))}
                    </div>
                    <p className="text-[12px] text-apple-gray">~{d.estimatedHours}h estimated</p>
                  </div>
                </div>
                {d.completed ? (
                  <span className="text-[13px] font-medium text-apple-green">✓ Done</span>
                ) : (
                  <button
                    onClick={() => handleComplete(d.day)}
                    disabled={completing === d.day}
                    className="btn-secondary text-[12px] py-1.5 px-3"
                  >
                    {completing === d.day ? "…" : "Mark done"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-apple-gray">
            No plan generated yet. Make sure your exam date is set in your profile.
          </p>
        )}
      </div>
    </div>
  );
}
