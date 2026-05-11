import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnalyticsSkeleton } from "../components/Skeleton";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { getReport, getErrorMemory, getWeeklyLeaderboard, getPrediction, analyticsV2Dashboard } from "../services/api";

const SUBJECTS = [
  { id: "all",      label: "All",     color: "#1c1c1e" },
  { id: "Math",     label: "Math",    color: "#007AFF" },
  { id: "Science",  label: "Science", color: "#34C759" },
  { id: "English",  label: "English", color: "#FF9500" },
  { id: "Social Science", label: "Social", color: "#AF52DE" },
];

const RANGES = [
  { id: 7,   label: "7d" },
  { id: 30,  label: "30d" },
  { id: 90,  label: "90d" },
  { id: null,label: "All" },
];

const fmtTime = (s) => {
  if (!s) return "—";
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
};

export default function Analytics() {
  const [subject, setSubject] = useState("all");
  const [range, setRange]     = useState(30);
  const [v2, setV2]           = useState(null);
  const [report, setReport]   = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weekly, setWeekly]   = useState(null);
  const [errors, setErrors]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");
  const printRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsV2Dashboard(subject === "all" ? undefined : subject).then((r) => setV2(r.data?.data)).catch(() => {}),
      getReport().then((r) => setReport(r.data)).catch(() => {}),
      getPrediction().then((r) => setPrediction(r)).catch(() => {}),
      getErrorMemory().then((r) => setErrors(r.data || [])).catch(() => {}),
      getWeeklyLeaderboard().then((r) => setWeekly(r.data)).catch(() => {}),
    ]).catch(() => setErr("Could not load analytics.")).finally(() => setLoading(false));
  }, [subject]);

  const handlePrint = () => window.print();
  const handleShare = async () => {
    const node = printRef.current;
    if (!node) return;
    try {
      // Native share with screenshot fallback to text
      if (navigator.share) {
        await navigator.share({
          title: `My Stellar fingerprint — ${v2?.persona?.name || "Learner"}`,
          text: `${v2?.persona?.tagline || ""} · Predicted ${prediction?.predictedMin}-${prediction?.predictedMax}/80`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${v2?.persona?.name} — ${window.location.href}`);
      }
    } catch {}
  };

  if (loading) return <AnalyticsSkeleton />;
  if (err) return <div className="card p-10 text-center text-[#FF3B30] text-[13px]">{err}</div>;

  const hasData = (report?.totalAttempts ?? 0) > 0;

  return (
    <div ref={printRef} className="space-y-5">
      {/* ── Subject + range tabs + share ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-0.5 p-1 bg-white shadow-sm border border-[#f0f0f5] rounded-full">
            {SUBJECTS.map((s) => (
              <button key={s.id} onClick={() => setSubject(s.id)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${subject === s.id ? "bg-[#1c1c1e] text-white" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5 p-1 bg-white shadow-sm border border-[#f0f0f5] rounded-full">
            {RANGES.map((r) => (
              <button key={r.id ?? "all"} onClick={() => setRange(r.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${range === r.id ? "bg-[#1c1c1e] text-white" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="px-3 py-1.5 rounded-xl bg-white shadow-sm border border-[#f0f0f5] text-[12px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">↗ Share</button>
          <button onClick={handlePrint} className="px-3 py-1.5 rounded-xl bg-white shadow-sm border border-[#f0f0f5] text-[12px] font-semibold text-[#3A3A3C] hover:shadow-md transition-all">🖨 PDF</button>
          {hasData && (
            <Link to="/certificate" className="px-3 py-1.5 rounded-xl border border-[#c9aa71]/50 bg-[#faf7f0] text-[12px] font-semibold text-[#8b6914]">★ Certificate</Link>
          )}
        </div>
      </div>

      {/* ── Anomalies / interventions ── */}
      {(v2?.anomalies?.length || 0) > 0 && (
        <div className="space-y-2">
          {v2.anomalies.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-[12px] ${
              a.type === "low_accuracy" ? "bg-[#FF3B30]/8 border-[#FF3B30]/20 text-[#FF3B30]" :
              a.type === "slow_session" ? "bg-[#FF9500]/8 border-[#FF9500]/20 text-[#FF9500]" :
              "bg-[#007AFF]/8 border-[#007AFF]/20 text-[#007AFF]"
            }`}>
              <span className="text-[16px]">{a.type === "low_accuracy" ? "⚠️" : a.type === "slow_session" ? "🐢" : "🎯"}</span>
              <p className="flex-1 font-medium">{a.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── HERO: persona + radar ── */}
      <div className="rounded-3xl p-7 lg:p-9 relative overflow-hidden grid md:grid-cols-2 gap-6 items-center"
        style={{ background: "linear-gradient(130deg, #ddd6fe 0%, #fbcfe8 50%, #fde68a 100%)" }}>
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1c1c1e]/60 mb-3">Your thinking profile</p>
          <h1 className="text-[42px] md:text-[56px] font-bold text-[#1c1c1e] leading-[0.95] tracking-tight mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
            {v2?.persona?.name || "The Learner."}
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#1c1c1e]/75 leading-relaxed max-w-md">
            {v2?.persona?.tagline || "Practice 10+ questions to unlock your persona."}
          </p>
          {/* #3 Strength annotation */}
          {v2?.radar?.me && (
            (() => {
              const m = v2.radar.me;
              const arr = [["Depth", m.depth], ["Speed", m.speed], ["Pattern", m.pattern], ["Recall", m.recall], ["Calibration", m.calibration]];
              const sharp = arr.reduce((a, b) => a[1] > b[1] ? a : b);
              const soft  = arr.reduce((a, b) => a[1] < b[1] ? a : b);
              return (
                <p className="text-[12px] text-[#1c1c1e]/60 mt-4">
                  Sharpest axis: <span className="font-bold text-[#1c1c1e]">{sharp[0]} ({sharp[1]})</span> · Soft axis: <span className="font-bold text-[#1c1c1e]">{soft[0]} ({soft[1]})</span>
                </p>
              );
            })()
          )}
        </div>
        {/* Radar */}
        {v2?.radar?.me && (
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={[
                { axis: "Depth",       you: v2.radar.me.depth,       peer: v2.radar.peer.depth },
                { axis: "Speed",       you: v2.radar.me.speed,       peer: v2.radar.peer.speed },
                { axis: "Pattern",     you: v2.radar.me.pattern,     peer: v2.radar.peer.pattern },
                { axis: "Recall",      you: v2.radar.me.recall,      peer: v2.radar.peer.recall },
                { axis: "Calibration", you: v2.radar.me.calibration, peer: v2.radar.peer.calibration },
              ]}>
                <PolarGrid stroke="rgba(28,28,30,0.18)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#1c1c1e" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Peer median" dataKey="peer" stroke="rgba(28,28,30,0.35)" fill="rgba(28,28,30,0.08)" strokeDasharray="3 3" strokeWidth={1} />
                <Radar name="You" dataKey="you" stroke="#1c1c1e" fill="rgba(28,28,30,0.35)" strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {!hasData && (
        <div className="card p-10 text-center">
          <p className="text-[14px] font-semibold text-[#1c1c1e] mb-1">No practice data yet</p>
          <p className="text-[13px] text-[#8E8E93]">Go to Practice, answer some questions, then come back here.</p>
        </div>
      )}

      {hasData && (
        <>
          {/* ── 3 stat cards: Predicted · Behaviour Fingerprint · This Week ── */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Predicted */}
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-2">Predicted Board Score</p>
              {prediction ? (
                <>
                  <p className="text-[44px] font-bold text-[#7c3aed] leading-none">{Math.round(((prediction.predictedMin || 0) + (prediction.predictedMax || 0)) / 2)}</p>
                  <p className="text-[12px] text-[#8e8e93] mt-1">± {Math.round(((prediction.predictedMax || 0) - (prediction.predictedMin || 0)) / 2)} · grade {prediction.predictedGrade}</p>
                  {/* mini sparkline */}
                  <div className="mt-2 h-8">
                    <ResponsiveContainer width="100%" height={32}>
                      <LineChart data={(report?.accuracyHistory || []).slice(-12).map((p, i) => ({ x: i, y: p.accuracy }))}>
                        <Line type="monotone" dataKey="y" stroke="#7c3aed" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {prediction.confidence && <p className="text-[11px] text-[#8e8e93] mt-1">↑ {report?.totalAttempts || 0} attempts · {prediction.confidence} confidence</p>}
                </>
              ) : <p className="text-[13px] text-[#8e8e93]">Practice more to predict</p>}
            </div>

            {/* Behaviour Fingerprint */}
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Behaviour Fingerprint</p>
              {v2?.fingerprint ? (
                <div className="space-y-2.5">
                  <Row label="avg time / q" value={fmtTime(v2.fingerprint.avgTimeSeconds)} />
                  <Row label="consistency"  value={v2.fingerprint.consistency.toFixed(2)} />
                  <Row label="overconfidence" value={`${v2.fingerprint.overconfidence}%`} color={v2.fingerprint.overconfidence > 15 ? "#FF3B30" : undefined} />
                  <Row label="underconfidence" value={`${v2.fingerprint.underconfidence}%`} color={v2.fingerprint.underconfidence > 15 ? "#FF9500" : undefined} />
                </div>
              ) : <p className="text-[13px] text-[#8e8e93]">Not enough data yet</p>}
            </div>

            {/* This Week */}
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">This Week</p>
              {v2?.thisWeek?.byDay && (
                <>
                  <div className="flex items-end justify-between gap-1.5 h-20 mb-2">
                    {v2.thisWeek.byDay.map((d, i) => {
                      const max = Math.max(...v2.thisWeek.byDay.map((x) => x.count), 1);
                      const h = (d.count / max) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-md transition-all" style={{
                            height: `${Math.max(h, 6)}%`,
                            background: d.count > 0
                              ? "linear-gradient(180deg, #fbcfe8 0%, #ddd6fe 100%)"
                              : "#F2F2F7",
                          }} title={`${d.count} questions on ${d.date}`} />
                          <span className="text-[9px] font-semibold text-[#8e8e93]">{d.dayLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8e8e93]">{v2.thisWeek.activeDays} of 7 days · {Math.floor(v2.thisWeek.totalMinutes / 60)}h {v2.thisWeek.totalMinutes % 60}m</span>
                    {v2.thisWeek.wow != null && <span className={v2.thisWeek.wow >= 0 ? "text-[#34C759] font-bold" : "text-[#FF3B30] font-bold"}>{v2.thisWeek.wow >= 0 ? "↑" : "↓"} {Math.abs(v2.thisWeek.wow)}% wow</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Why You Got Things Wrong ── */}
          {(report?.weakness?.length || 0) > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-1">Why You Got Things Wrong</p>
              <p className="text-[11px] text-[#8e8e93] mb-4">Last {report.totalAttempts || 0} attempts · classified by Aria</p>
              <div className="space-y-3">
                {report.weakness.slice(0, 6).map((w) => {
                  const pct = Math.min(100, (w.count / Math.max(...report.weakness.map((x) => x.count))) * 100);
                  const color = w.level === "high" ? "#FF3B30" : w.level === "medium" ? "#FF9500" : "#34C759";
                  return (
                    <div key={w.skill}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] text-[#1c1c1e] capitalize">{w.skill.replace(/_/g, " ")}</span>
                        <span className="text-[12px] font-bold text-[#1c1c1e]">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
                        <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Counterfactual ── */}
          {v2?.predicted?.counterfactual && (
            <div className="rounded-2xl p-5 border border-[#7c3aed]/20" style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}>
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#7c3aed] mb-2">If you mastered your top 3 weak areas…</p>
              <div className="flex items-end gap-3 mb-2">
                <p className="text-[36px] font-bold text-[#7c3aed] leading-none">{v2.predicted.counterfactual.projectedScore}</p>
                <p className="text-[14px] text-[#8e8e93] mb-1">predicted (from {v2.predicted.counterfactual.currentScore})</p>
              </div>
              <p className="text-[12px] text-[#1c1c1e]/70">
                Focus areas: <span className="font-bold">{v2.predicted.counterfactual.weakest.join(" · ")}</span> · ~{v2.predicted.counterfactual.hoursNeeded} hrs of focused practice
              </p>
            </div>
          )}

          {/* ── Predicted score chapter breakdown ── */}
          {(v2?.predicted?.byChapter?.length || 0) > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">What's lifting / dragging your score</p>
              <div className="space-y-2">
                {v2.predicted.byChapter.slice(0, 8).map((c) => (
                  <div key={c.chapter} className="flex items-center gap-3">
                    <span className="w-7 text-[11px] text-[#8e8e93] font-mono">Ch {c.chapter}</span>
                    <span className="flex-1 text-[13px] text-[#1c1c1e] truncate">{c.topic || `Chapter ${c.chapter}`}</span>
                    <span className="text-[12px] text-[#8e8e93]">{c.accuracy}%</span>
                    <span className={`text-[12px] font-bold w-14 text-right ${c.contribution > 0 ? "text-[#34C759]" : c.contribution < 0 ? "text-[#FF3B30]" : "text-[#8E8E93]"}`}>
                      {c.contribution > 0 ? "+" : ""}{c.contribution} marks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Calibration curve + Time-of-day ── */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Calibration */}
            {(v2?.calibration?.length || 0) > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-1">Calibration curve</p>
                <p className="text-[11px] text-[#8e8e93] mb-3">Diagonal = perfect calibration</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={[{ stated: 0, actual: 0 }, ...v2.calibration.map((c) => ({ stated: c.stated, actual: c.actual })), { stated: 100, actual: 100 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="stated" type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" label={{ value: "stated confidence", fontSize: 10, position: "bottom" }} />
                    <YAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }} />
                    <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#8E8E93" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4, fill: "#7c3aed" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {/* Time of day */}
            {(v2?.timeOfDay?.length || 0) > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Accuracy by time of day</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={v2.timeOfDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickFormatter={(h) => `${h}:00`} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }} />
                    <Bar dataKey="accuracy" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ── Per-topic mistake fingerprint ── */}
          {(v2?.mistakeByTopic?.length || 0) > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Mistakes by topic — different topics fail differently</p>
              <div className="space-y-3">
                {v2.mistakeByTopic.slice(0, 5).map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-[#1c1c1e]">{t.topic}</span>
                      <span className="text-[11px] text-[#8E8E93]">{t.total} wrong</span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden">
                      {t.breakdown.map((b, i) => {
                        const colors = { concept_error: "#FF3B30", calculation_error: "#FF9500", partial_logic: "#AF52DE", guessing: "#FFCC02", misinterpretation: "#5AC8FA" };
                        return (
                          <div key={i} title={`${b.type.replace(/_/g, " ")}: ${b.pct}%`}
                            style={{ width: `${b.pct}%`, background: colors[b.type] || "#8E8E93" }} />
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-[#8E8E93] mt-1">{t.breakdown.slice(0, 3).map((b) => `${b.type.replace(/_/g, " ")} ${b.pct}%`).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Question type + Difficulty ── */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Question type */}
            {(v2?.qTypes?.length || 0) > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">By question type</p>
                <div className="space-y-2">
                  {v2.qTypes.map((q) => (
                    <div key={q.type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-[#1c1c1e] capitalize">{q.type.replace(/_/g, " ")}</span>
                        <span className="text-[11px] text-[#8e8e93]"><span className="font-bold text-[#1c1c1e]">{q.accuracy}%</span> · {q.total}</span>
                      </div>
                      <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#007AFF]" style={{ width: `${q.accuracy}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Difficulty distribution */}
            {(v2?.difficulty?.length || 0) > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">By difficulty (last 30d)</p>
                <div className="space-y-2">
                  {v2.difficulty.map((d) => (
                    <div key={d.level} className="flex items-center gap-3">
                      <span className="w-16 text-[12px] capitalize text-[#3A3A3C]">{d.level}</span>
                      <div className="flex-1 h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${d.accuracy}%`, background: d.level === "easy" ? "#34C759" : d.level === "medium" ? "#FF9500" : "#FF3B30" }} />
                      </div>
                      <span className="text-[11px] text-[#8e8e93] w-20 text-right">{d.accuracy}% of {d.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Mock paper readiness ── */}
          {v2?.mockPaper?.sections && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Mock paper readiness</p>
              <div className="grid grid-cols-5 gap-3">
                {v2.mockPaper.sections.map((s) => (
                  <div key={s.name} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-1">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#F2F2F7" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none"
                          stroke={s.readiness >= 75 ? "#34C759" : s.readiness >= 50 ? "#FF9500" : "#FF3B30"}
                          strokeWidth="3" strokeDasharray={`${s.readiness} 100`} strokeLinecap="round" />
                      </svg>
                      <p className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-[#1c1c1e]">{s.readiness}%</p>
                    </div>
                    <p className="text-[10px] font-semibold text-[#3A3A3C]">{s.name}</p>
                  </div>
                ))}
              </div>
              {v2.mockPaper.history?.length > 1 && (
                <div className="mt-4 pt-4 border-t border-[#F2F2F7]">
                  <p className="text-[11px] text-[#8E8E93] mb-2">Mock paper history</p>
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart data={v2.mockPaper.history}>
                      <Area type="monotone" dataKey="score" stroke="#7c3aed" fill="rgba(124,58,237,0.15)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* ── Re-test recommendations ── */}
          {(v2?.retest?.length || 0) > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-1">Re-test recommendations</p>
              <p className="text-[11px] text-[#8e8e93] mb-3">SM-2 says it's time to revisit these</p>
              <div className="space-y-2">
                {v2.retest.map((r) => (
                  <Link key={r.questionId} to="/bookmarks" className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAFAFB] hover:bg-[#F2F2F7] transition-colors">
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#1c1c1e] truncate">Question {r.questionId.slice(-6)}</p>
                      <p className="text-[10px] text-[#8E8E93]">Last {r.intervalDays}d ago{r.wrongCount > 0 ? ` · ${r.wrongCount} previous wrong` : ""}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#007AFF]">Review →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Smart insights feed (Aria) ── */}
          {(v2?.insights?.length || 0) > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">✨ Aria's read on you</p>
              <div className="space-y-2">
                {v2.insights.map((i, idx) => (
                  <div key={idx} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-[#FAFAFB]">
                    <span className="text-[18px] shrink-0">{i.icon}</span>
                    <p className="text-[13px] text-[#1c1c1e] leading-relaxed">{i.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Repeated mistakes ── */}
          {errors.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93] mb-3">Repeated mistakes</p>
              <div className="space-y-2">
                {errors.slice(0, 5).map((e) => (
                  <div key={`${e.topic}-${e.mistakeType}`} className="flex items-start justify-between gap-3 px-3 py-2 rounded-xl bg-[#FAFAFB]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-[#1c1c1e] capitalize">{e.mistakeType.replace(/_/g, " ")}</span>
                        <span className="text-[10px] font-bold text-[#8E8E93] bg-[#F2F2F7] px-1.5 py-0.5 rounded">{e.topic}</span>
                      </div>
                      {e.questionSnippets?.length > 0 && (
                        <p className="text-[11px] text-[#8E8E93] truncate">e.g. "{e.questionSnippets[e.questionSnippets.length - 1]}…"</p>
                      )}
                    </div>
                    <span className="text-[14px] font-bold text-[#FF3B30] shrink-0">{e.count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Weekly leaderboard / classmate compare ── */}
          {weekly?.board?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">Where you stand</p>
                <span className="text-[11px] text-[#8e8e93]">{weekly.week}</span>
              </div>
              {weekly.userEntry && (
                <div className="bg-[#007AFF]/8 border border-[#007AFF]/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#007AFF]">Your rank: #{weekly.userEntry.rank}</span>
                  <span className="text-[12px] text-[#007AFF]/70">{weekly.userEntry.percentile}% percentile</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#8e8e93]">{label}</span>
      <span
        className={`text-[13px] font-bold tabular-nums ${color ? "" : "text-[#1c1c1e]"}`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
