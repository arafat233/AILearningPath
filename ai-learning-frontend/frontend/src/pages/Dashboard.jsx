import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReport, getAIAdvice, getTopics } from "../services/api";
import { useAuthStore } from "../store/authStore";

const PROFILE_COLOR = {
  "Deep Thinker":       "bg-green-100 text-green-800",
  "Pattern Recognizer": "bg-blue-100 text-blue-800",
  "Surface Learner":    "bg-yellow-100 text-yellow-800",
  "Overthinker":        "bg-purple-100 text-purple-800",
  "Guesser":            "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate  = useNavigate();
  const [report, setReport]   = useState(null);
  const [advice, setAdvice]   = useState(null);
  const [topics, setTopics]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    Promise.all([getReport(), getAIAdvice(), getTopics()])
      .then(([r, a, t]) => {
        setReport(r.data);
        setAdvice(a.data.advice);
        setTopics(t.data);
      })
      .catch(() => setError("Could not connect to backend. Is it running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 text-sm">Loading dashboard…</div>;

  if (error) return (
    <div className="max-w-5xl mx-auto">
      <div className="card p-8 text-center">
        <p className="text-red-500 text-sm mb-1">{error}</p>
        <p className="text-gray-400 text-xs">Run <code className="bg-gray-100 px-1 rounded">npm run dev</code> in the backend folder.</p>
      </div>
    </div>
  );

  const streak = report?.streak ?? 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's your performance overview</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl">
            <span className="text-base">🔥</span>
            <span className="text-sm font-semibold text-orange-700">{streak} day streak</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard label="Accuracy"       value={`${report?.score ?? 0}%`}    sub="overall" />
        <StatCard label="Questions done" value={report?.totalAttempts ?? 0}  sub="total attempts" />
        <StatCard label="Weak areas"     value={report?.weakAreas?.length ?? 0} sub="need attention" />
        <StatCard label="Strong areas"   value={report?.strongAreas?.length ?? 0} sub="mastered" />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-7">
        {/* Thinking profile */}
        <div className="card p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Thinking Profile</p>
          <span className={`badge ${PROFILE_COLOR[report?.thinkingProfile] ?? "bg-gray-100 text-gray-700"} text-sm px-3 py-1 mb-3 inline-block`}>
            {report?.thinkingProfile ?? "Not determined yet"}
          </span>

          {report?.weakAreas?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1.5">Weak areas</p>
              <div className="flex flex-wrap gap-2">
                {report.weakAreas.map((a) => <span key={a} className="badge bg-red-50 text-red-700">{a}</span>)}
              </div>
            </div>
          )}
          {report?.strongAreas?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Strong areas</p>
              <div className="flex flex-wrap gap-2">
                {report.strongAreas.map((a) => <span key={a} className="badge bg-green-50 text-green-700">{a}</span>)}
              </div>
            </div>
          )}
          {!report?.totalAttempts && (
            <p className="text-sm text-gray-400">Complete some practice to see your profile.</p>
          )}
        </div>

        {/* AI advice */}
        <div className="card p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">AI Coach Advice</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {advice ?? "Complete some practice questions to get personalised advice."}
          </p>
        </div>
      </div>

      {/* Topic selector — FIX: loaded from API, not hardcoded */}
      <div className="card p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Start Practice</p>
        {topics.length === 0 ? (
          <p className="text-sm text-gray-400">No topics found. Run <code className="bg-gray-100 px-1 rounded">npm run seed</code> in the backend.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((t) => {
              const isWeak   = report?.weakAreas?.includes(t.name);
              const isStrong = report?.strongAreas?.includes(t.name);
              return (
                <button
                  key={t._id}
                  onClick={() => navigate("/practice", { state: { topic: t.name } })}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border hover:border-brand-500 hover:bg-brand-50 transition-all text-left group"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-brand-600 block">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.subject} · Grade {t.grade}</span>
                  </div>
                  {isWeak   && <span className="badge bg-red-50 text-red-600 text-xs shrink-0 ml-1">Weak</span>}
                  {isStrong && <span className="badge bg-green-50 text-green-600 text-xs shrink-0 ml-1">Strong</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}
