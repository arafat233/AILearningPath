import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSharedPlan } from "../services/api";

const PHASE_COLORS = {
  foundation: { bg: "#EEF4FF", color: "#007AFF", label: "Foundation" },
  practice:   { bg: "#FFF4E0", color: "#FF9500", label: "Practice"   },
  revision:   { bg: "#F3EEFF", color: "#AF52DE", label: "Revision"   },
  mock:       { bg: "#FFE5E5", color: "#FF3B30", label: "Mock"       },
};

const TOPIC_COLORS = [
  "#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30",
  "#5AC8FA","#5856D6","#FF2D55","#30B0C7","#E3A900",
];
const colorCache = {};
let colorIdx = 0;
const topicColor = (t) => {
  if (!colorCache[t]) colorCache[t] = TOPIC_COLORS[colorIdx++ % TOPIC_COLORS.length];
  return colorCache[t];
};

const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtShort = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;

export default function SharedPlan() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [plan,     setPlan]    = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getSharedPlan(token)
      .then(r => setPlan(r.data))
      .catch(() => setError("Plan not found or link has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading shared plan…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray6 px-4">
      <div className="text-center max-w-sm">
        <div className="text-[48px] mb-4">🔗</div>
        <h1 className="text-[20px] font-bold text-[var(--label)] mb-2">Link not found</h1>
        <p className="text-[14px] text-apple-gray mb-6">{error}</p>
        <button onClick={() => navigate("/")} className="btn-primary px-6 py-2.5">Go home</button>
      </div>
    </div>
  );

  const dp    = plan?.dailyPlan || [];
  const done  = dp.filter(d => d.completed).length;
  const total = dp.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-apple-gray6">
      {/* Header banner */}
      <div style={{ background: "linear-gradient(135deg,#007AFF,#5856D6)", padding: "28px 24px 24px" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
            Shared Study Plan
          </p>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
            {plan?.planName || "Study Plan"}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {plan?.planGoal && (
              <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                {plan.planGoal}
              </span>
            )}
            {plan?.planSubjects?.length > 0 && (
              <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                {plan.planSubjects.join(", ")}
              </span>
            )}
            {plan?.daysLeft != null && (
              <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                {plan.daysLeft} days until exam
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Progress bar */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] font-semibold text-[var(--label)]">Plan Progress</p>
            <span className="text-[13px] font-semibold text-apple-blue">{done}/{total} days · {pct}%</span>
          </div>
          <div className="h-2.5 bg-apple-gray5 rounded-full overflow-hidden">
            <div className="h-full bg-apple-blue rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[12px] text-apple-gray mt-2">
            {plan?.hoursPerDay}h/day · {total} total study days
          </p>
        </div>

        {/* Phase legend */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PHASE_COLORS).map(([key, val]) => (
            <span key={key} style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: val.bg, color: val.color }}>
              {val.label}
            </span>
          ))}
        </div>

        {/* Daily plan */}
        <div className="card p-5">
          <p className="section-label mb-4">Daily Schedule — {total} days</p>
          <div className="flex flex-col gap-2">
            {dp.map((d) => {
              const date = new Date(d.date);
              const dayName = DAY_NAMES[date.getDay()];
              return (
                <div key={d.day} className={`p-4 rounded-apple-xl border transition-all ${
                  d.completed  ? "border-apple-green/25 bg-apple-green/6" :
                  d.isMockTest ? "border-[#AF52DE]/30 bg-gradient-to-r from-[#AF52DE]/6 to-[#007AFF]/6" :
                                 "border-apple-gray5"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-center w-12 shrink-0">
                      <p className="text-[9px] mono uppercase text-apple-gray3">{dayName}</p>
                      <p className="text-[18px] font-bold text-[var(--label)] leading-tight">{d.day}</p>
                      <p className="text-[9px] text-apple-gray3">{fmtShort(date)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {d.phase && PHASE_COLORS[d.phase] && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: PHASE_COLORS[d.phase].bg, color: PHASE_COLORS[d.phase].color }}>
                            {PHASE_COLORS[d.phase].label}
                          </span>
                        )}
                        {d.isMockTest && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: "#F3EEFF", color: "#AF52DE" }}>📝 Mock Test</span>
                        )}
                        {d.completed && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: "#E8FAF0", color: "#34C759" }}>✓ Done</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {d.topics.map(t => (
                          <span key={t} style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: topicColor(t) + "18", color: topicColor(t), fontWeight: 500 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-apple-gray mt-1">~{d.estimatedHours}h</p>
                      {d.note && (
                        <p className="text-[12px] text-apple-gray3 mt-1 italic">"{d.note}"</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA footer */}
        <div className="card p-6 text-center">
          <p className="text-[15px] font-semibold text-[var(--label)] mb-1">Want your own study plan?</p>
          <p className="text-[13px] text-apple-gray mb-4">StellarEdu builds a personalised daily schedule based on your weak areas and exam date.</p>
          <button onClick={() => navigate("/")} className="btn-primary px-8 py-2.5 text-[14px]">
            Get started free →
          </button>
        </div>
      </div>
    </div>
  );
}
