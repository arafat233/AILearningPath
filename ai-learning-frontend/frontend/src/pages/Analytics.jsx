import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnalyticsSkeleton } from "../components/Skeleton";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { getReport, getErrorMemory, getWeeklyLeaderboard, getLastDayRevision, getPrediction } from "../services/api";

export default function Analytics() {
  const [data, setData]           = useState(null);
  const [errors, setErrors]       = useState([]);
  const [weekly, setWeekly]       = useState(null);
  const [lastDay, setLastDay]     = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    Promise.all([
      getReport().then((r) => setData(r.data)),
      getErrorMemory().then((r) => setErrors(r.data || [])).catch(() => {}),
      getWeeklyLeaderboard().then((r) => setWeekly(r.data)).catch(() => {}),
      getLastDayRevision().then((r) => setLastDay(r.data)).catch(() => {}),
      getPrediction().then((r) => setPrediction(r.data)).catch(() => {}),
    ])
      .catch(() => setError("Could not load analytics. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  if (error) return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight mb-6">Analytics</h1>
      <div className="card p-10 text-center">
        <p className="text-[13px] text-apple-red">{error}</p>
      </div>
    </div>
  );

  const hasData = (data?.totalAttempts ?? 0) > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Analytics</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">Your thinking patterns and performance breakdown</p>
        </div>
        {hasData && (
          <Link
            to="/certificate"
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-apple border border-[#c9aa71]/50 bg-[#faf7f0] text-[13px] font-medium text-[#8b6914] hover:bg-[#f5f0e4] transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M8 1l1.8 5.5H15l-4.6 3.4 1.8 5.5L8 12l-4.2 3.4 1.8-5.5L1 6.5h5.2z"/>
            </svg>
            Certificate
          </Link>
        )}
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Accuracy"         value={`${data?.score ?? 0}%`}               accent="blue"   />
        <StatCard label="Total Attempts"   value={data?.totalAttempts ?? 0}              accent="green"  />
        <StatCard label="Thinking Profile" value={data?.thinkingProfile && data.thinkingProfile !== "Unclassified" ? data.thinkingProfile : "10+ attempts needed"} accent="purple" small />
        <StatCard label="Weak Topics"      value={data?.weakAreas?.length ?? 0}          accent="orange" />
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="card p-10 text-center">
          <p className="text-[14px] font-semibold text-[var(--label)] mb-1">No practice data yet</p>
          <p className="text-[13px] text-apple-gray">Go to Practice, answer some questions, then come back here.</p>
        </div>
      )}

      {/* Accuracy over time */}
      {hasData && (data?.accuracyHistory?.length ?? 0) >= 2 && (
        <div className="card p-5">
          <p className="section-label">Accuracy Over Time</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.accuracyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--label3)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--label3)" }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="accuracy" stroke="#0071e3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Topic performance */}
      {hasData && (data?.topicStats?.length ?? 0) > 0 && (
        <div className="card p-5">
          <p className="section-label">Topic Performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.topicStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="topic" tick={{ fontSize: 10, fill: "var(--label3)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--label3)" }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="accuracy" fill="#0071e3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Exam Score Prediction */}
      {hasData && prediction && (
        <div className="card p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="section-label">Predicted Board Score</p>
              <p className="text-[12px] text-apple-gray mt-0.5">Based on your practice performance across topics</p>
            </div>
            <span className={`badge text-[11px] capitalize ${
              prediction.confidence === "high"   ? "bg-apple-green/10 text-apple-green" :
              prediction.confidence === "medium" ? "bg-apple-yellow/10 text-apple-yellow" :
                                                   "bg-apple-gray5 text-apple-gray"
            }`}>
              {prediction.confidence} confidence
            </span>
          </div>

          <div className="flex items-end gap-3 mb-4">
            <span className="text-[42px] font-bold text-[var(--label)] leading-none">
              {prediction.predictedMin}–{prediction.predictedMax}
            </span>
            <span className="text-[16px] text-apple-gray mb-1">/ 80</span>
            <span className="ml-2 text-[22px] font-semibold text-apple-blue mb-0.5">
              {prediction.predictedGrade}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-apple-gray5 rounded-full overflow-hidden mb-4">
            <div
              className="h-2.5 rounded-full bg-apple-blue transition-all"
              style={{ width: `${prediction.pctMax ?? 0}%` }}
            />
          </div>

          {/* Disclaimer — prominent, always shown */}
          <div className="flex items-start gap-2 bg-apple-yellow/8 border border-apple-yellow/20 rounded-apple p-3">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round"
                 className="w-3.5 h-3.5 text-apple-yellow shrink-0 mt-0.5">
              <path d="M8 2L1 14h14L8 2z"/><path d="M8 6v4M8 11.5v.5"/>
            </svg>
            <p className="text-[11px] text-apple-yellow leading-relaxed">
              This is a <strong>statistical estimate</strong> based solely on in-app practice data —
              not a guarantee of actual CBSE board results. Actual marks depend on examination
              conditions, syllabus changes, and many other factors.
            </p>
          </div>
        </div>
      )}

      {/* Weakness + Confidence */}
      {hasData && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="section-label">Mistake Breakdown</p>
            {data?.weakness?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {data.weakness.map((w) => (
                  <div key={w.skill} className="flex items-center justify-between">
                    <span className="text-[13px] text-[var(--label)] capitalize">{w.skill}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-apple-gray5 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            w.level === "high" ? "bg-apple-red" :
                            w.level === "medium" ? "bg-apple-yellow" : "bg-apple-green"
                          }`}
                          style={{ width: `${Math.min(100, w.count * 10)}%` }}
                        />
                      </div>
                      <span className={`badge text-[11px] ${
                        w.level === "high" ? "bg-apple-red/10 text-apple-red" :
                        w.level === "medium" ? "bg-apple-yellow/10 text-apple-yellow" :
                        "bg-apple-green/10 text-apple-green"
                      }`}>{w.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-apple-gray">No mistake patterns detected yet.</p>
            )}
          </div>

          <div className="card p-5">
            <p className="section-label">Confidence Analysis</p>
            {data?.confidenceAccuracy ? (
              <div className="flex flex-col gap-4">
                <ConfRow
                  label="High confidence → wrong"
                  value={data.confidenceAccuracy.highConfidenceWrong}
                  color="red"
                  hint="Dangerous misconceptions — review carefully"
                />
                <ConfRow
                  label="Low confidence → right"
                  value={data.confidenceAccuracy.lowConfidenceRight}
                  color="orange"
                  hint="Unstable knowledge — needs reinforcement"
                />
              </div>
            ) : (
              <p className="text-[13px] text-apple-gray">Use the confidence selector in Practice to unlock this.</p>
            )}
          </div>
        </div>
      )}

      {/* Confidence vs Reality */}
      {hasData && data?.confidenceAccuracy && (
        <div className="card p-5">
          <p className="section-label">Confidence vs Reality</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-apple-red/8 border border-apple-red/15 rounded-apple-lg p-4">
              <p className="text-[30px] font-bold text-apple-red">
                {data.confidenceAccuracy.highConfidenceWrong}
              </p>
              <p className="text-[12px] text-apple-gray mt-1">
                High confidence → wrong (dangerous misconceptions)
              </p>
            </div>
            <div className="bg-apple-orange/8 border border-apple-orange/15 rounded-apple-lg p-4">
              <p className="text-[30px] font-bold text-apple-orange">
                {data.confidenceAccuracy.lowConfidenceRight}
              </p>
              <p className="text-[12px] text-apple-gray mt-1">
                Low confidence → correct (unstable knowledge)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Memory — repeated mistakes */}
      {errors.length > 0 && (
        <div className="card p-5">
          <p className="section-label">Repeated Mistakes</p>
          <div className="flex flex-col gap-3">
            {errors.map((e, i) => (
              <div key={i} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-[var(--label)] capitalize">
                      {e.mistakeType.replace(/_/g, " ")}
                    </span>
                    <span className="badge bg-apple-gray6 text-apple-gray">{e.topic}</span>
                  </div>
                  {e.questionSnippets?.length > 0 && (
                    <p className="text-[12px] text-apple-gray truncate">
                      e.g. "{e.questionSnippets[e.questionSnippets.length - 1]}…"
                    </p>
                  )}
                </div>
                <span className="text-[13px] font-bold text-apple-red shrink-0">{e.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last-day trouble spots */}
      {lastDay && (lastDay.topMistakes?.length > 0 || lastDay.recentWrong?.length > 0) && (
        <div className="card p-5">
          <p className="section-label">Recent Trouble Spots</p>
          {lastDay.topMistakes?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {lastDay.topMistakes.map((m) => (
                <span key={m.type} className="badge bg-apple-red/10 text-apple-red font-medium capitalize">
                  {m.type.replace(/_/g, " ")} — {m.count}×
                </span>
              ))}
            </div>
          )}
          {lastDay.weakTopics?.length > 0 && (
            <p className="text-[12px] text-apple-gray mb-3">
              Weak areas:{" "}
              <span className="font-medium text-[var(--label)]">{lastDay.weakTopics.join(", ")}</span>
            </p>
          )}
          {lastDay.recentWrong?.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] font-medium text-apple-gray mb-1">
                Last {lastDay.recentWrong.length} wrong answers:
              </p>
              {lastDay.recentWrong.slice(0, 5).map((a, i) => (
                <p key={i} className="text-[12px] text-apple-gray truncate">• {a.topic}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly leaderboard */}
      {weekly?.board?.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label mb-0">Weekly Leaderboard</p>
            <span className="text-[12px] text-apple-gray">{weekly.week}</span>
          </div>
          {weekly.userEntry && (
            <div className="bg-apple-blue/8 border border-apple-blue/20 rounded-apple-lg px-4 py-2.5 mb-3 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-apple-blue">Your rank: #{weekly.userEntry.rank}</span>
              <span className="text-[12px] text-apple-blue/70">{weekly.userEntry.percentile}% percentile</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {weekly.board.slice(0, 10).map((row, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-1.5 ${
                  weekly.userEntry?.userId === row.userId ? "font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] w-6">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <span className="text-[12px] text-apple-gray font-mono">{String(row.userId).slice(-6)}</span>
                  {row.topic && (
                    <span className="badge bg-apple-gray6 text-apple-gray">{row.topic}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[13px] font-medium text-[var(--label)]">{row.score?.toFixed(2)}</span>
                  <span className="text-[12px] text-apple-gray ml-2">{Math.round((row.accuracy || 0) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI advice */}
      {data?.aiAdvice && (
        <div className="card p-5 border-l-4 border-apple-blue">
          <p className="section-label">AI Coach Recommendation</p>
          <p className="text-[14px] text-[var(--label2)] leading-relaxed">{data.aiAdvice}</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, small }) {
  const accents = {
    blue:   { ring: "ring-apple-blue/20",   text: "text-apple-blue",   bg: "bg-apple-blue/8"   },
    green:  { ring: "ring-apple-green/20",  text: "text-apple-green",  bg: "bg-apple-green/8"  },
    orange: { ring: "ring-apple-orange/20", text: "text-apple-orange", bg: "bg-apple-orange/8" },
    purple: { ring: "ring-apple-purple/20", text: "text-apple-purple", bg: "bg-apple-purple/8" },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`card p-5 ring-1 ${a.ring}`}>
      <p className="text-[11px] font-medium text-apple-gray mb-2">{label}</p>
      <p className={`font-bold tracking-tight ${a.text} ${small ? "text-[15px] mt-1" : "text-[26px]"}`}>{value}</p>
    </div>
  );
}

function ConfRow({ label, value, color, hint }) {
  const colorClass = color === "red" ? "text-apple-red" : "text-apple-orange";
  return (
    <div>
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[13px] text-[var(--label)]">{label}</span>
        <span className={`text-[13px] font-semibold ${colorClass}`}>{value ?? 0}×</span>
      </div>
      <p className="text-[12px] text-apple-gray">{hint}</p>
    </div>
  );
}
