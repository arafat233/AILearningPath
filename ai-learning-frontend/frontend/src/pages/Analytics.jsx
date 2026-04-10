import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { getReport } from "../services/api";

const LEVEL_COLOR = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-green-100 text-green-700",
};

export default function Analytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    getReport()
      .then((r) => setData(r.data))
      .catch(() => setError("Could not load analytics. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 text-sm">Loading analytics…</div>;

  // FIX: proper empty state — no crash on zero attempts
  if (error) return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <div className="card p-8 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    </div>
  );

  const hasData = (data?.totalAttempts ?? 0) > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Analytics</h1>
      <p className="text-sm text-gray-500 mb-6">Your thinking patterns and performance breakdown</p>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard label="Accuracy"        value={`${data?.score ?? 0}%`} />
        <StatCard label="Total Attempts"  value={data?.totalAttempts ?? 0} />
        <StatCard label="Thinking Profile" value={data?.thinkingProfile ?? "—"} small />
        <StatCard label="Weak Topics"     value={data?.weakAreas?.length ?? 0} />
      </div>

      {/* FIX: empty state shown cleanly */}
      {!hasData && (
        <div className="card p-8 text-center mb-6">
          <p className="text-gray-400 text-sm mb-1">No practice data yet.</p>
          <p className="text-gray-300 text-xs">Go to Practice, answer some questions, then come back here.</p>
        </div>
      )}

      {/* Accuracy over time — only render when enough data */}
      {hasData && (data?.accuracyHistory?.length ?? 0) >= 2 && (
        <div className="card p-5 mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Accuracy Over Time</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.accuracyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="accuracy" stroke="#4361ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Topic performance */}
      {hasData && (data?.topicStats?.length ?? 0) > 0 && (
        <div className="card p-5 mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Topic Performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.topicStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="topic" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="accuracy" fill="#4361ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weakness + Confidence */}
      {hasData && (
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="card p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Mistake Breakdown</p>
            {data?.weakness?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {data.weakness.map((w) => (
                  <div key={w.skill} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{w.skill}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${w.level === "high" ? "bg-red-400" : w.level === "medium" ? "bg-yellow-400" : "bg-green-400"}`}
                          style={{ width: `${Math.min(100, w.count * 10)}%` }}
                        />
                      </div>
                      <span className={`badge text-xs ${LEVEL_COLOR[w.level]}`}>{w.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No mistake patterns detected yet.</p>
            )}
          </div>

          <div className="card p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Confidence Analysis</p>
            {data?.confidenceAccuracy ? (
              <div className="flex flex-col gap-4">
                <ConfRow label="High confidence → wrong" value={data.confidenceAccuracy.highConfidenceWrong} color="red" hint="Dangerous misconceptions — review carefully" />
                <ConfRow label="Low confidence → right"  value={data.confidenceAccuracy.lowConfidenceRight}  color="amber" hint="Unstable knowledge — needs reinforcement" />
              </div>
            ) : (
              <p className="text-sm text-gray-400">Use the confidence selector in Practice to unlock this.</p>
            )}
          </div>
        </div>
      )}

      {/* AI advice */}
      {data?.aiAdvice && (
        <div className="card p-5 border-l-4 border-brand-500">
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wide mb-2">AI Coach Recommendation</p>
          <p className="text-sm text-gray-700 leading-relaxed">{data.aiAdvice}</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, small }) {
  return (
    <div className="stat-card">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`font-semibold text-gray-900 ${small ? "text-base mt-1" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function ConfRow({ label, value, color, hint }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-sm text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${color === "red" ? "text-red-600" : "text-amber-600"}`}>{value ?? 0}×</span>
      </div>
      <p className="text-xs text-gray-400">{hint}</p>
    </div>
  );
}
