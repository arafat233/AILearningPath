import { Link } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Tooltip, ResponsiveContainer,
} from "recharts";

export default function AnalyticsProView({ proData, printRef }) {
  const { persona, radar, stats, thisWeek, skills, insights, moduleProgress } = proData || {};

  return (
    <div className="space-y-5">
      {/* Hero: persona + radar */}
      <div className="rounded-3xl p-7 lg:p-9 relative overflow-hidden grid md:grid-cols-2 gap-6 items-center"
        style={{ background: "linear-gradient(130deg, #ddd6fe 0%, #fbcfe8 50%, #fde68a 100%)" }}>
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1c1c1e]/60 mb-3">Your coding persona</p>
          <h1 className="text-[42px] md:text-[56px] font-bold text-[#1c1c1e] leading-[0.95] tracking-tight mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
            {persona?.name || "Java · Pro"}
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#1c1c1e]/75 leading-relaxed max-w-md">
            {persona?.tagline || "Complete exercises to unlock your coding persona."}
          </p>
        </div>
        {radar?.me ? (
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={[
                { axis: "Depth",       you: radar.me.depth,       peer: radar.peer?.depth },
                { axis: "Speed",       you: radar.me.speed,       peer: radar.peer?.speed },
                { axis: "Pattern",     you: radar.me.pattern,     peer: radar.peer?.pattern },
                { axis: "Recall",     you: radar.me.recall,      peer: radar.peer?.recall },
                { axis: "Calibration", you: radar.me.calibration, peer: radar.peer?.calibration },
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
        ) : (
          <div className="flex items-center justify-center h-[280px]">
            <p className="text-[13px] text-[#1c1c1e]/50 italic">Complete 3+ exercises to unlock your radar.</p>
          </div>
        )}
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-5 text-center">
            <p className="text-[36px] font-bold text-apple-blue">{stats.totalXp}</p>
            <p className="text-[11px] text-apple-gray font-semibold mt-1">Total XP</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-[36px] font-bold text-apple-green">{stats.currentStreak}</p>
            <p className="text-[11px] text-apple-gray font-semibold mt-1">Day streak</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-[36px] font-bold text-apple-purple">{stats.completedExercises} / {stats.totalExercises}</p>
            <p className="text-[11px] text-apple-gray font-semibold mt-1">Exercises</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-[36px] font-bold text-apple-orange">{stats.passRate}%</p>
            <p className="text-[11px] text-apple-gray font-semibold mt-1">Pass rate</p>
          </div>
        </div>
      )}

      {/* This week */}
      {thisWeek?.byDay ? (
        <div className="card p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-apple-gray mb-3">This week</p>
          <div className="flex items-end justify-between gap-1.5 h-20 mb-2">
            {thisWeek.byDay.map((d, i) => {
              const max = Math.max(...thisWeek.byDay.map((x) => x.count), 1);
              const h = (d.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-md transition-all" style={{
                    height: `${Math.max(h, 6)}%`,
                    background: d.count > 0 ? "linear-gradient(180deg, #7c3aed, #ec4899)" : "#F2F2F7",
                  }} />
                  <span className="text-[9px] font-semibold text-apple-gray">{d.dayLabel}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-apple-gray">{thisWeek.activeDays} of 7 days · {thisWeek.totalXp} XP</span>
            {thisWeek.wow != null && (
              <span className={thisWeek.wow >= 0 ? "text-apple-green font-bold" : "text-apple-red font-bold"}>
                {thisWeek.wow >= 0 ? "↑" : "↓"} {Math.abs(thisWeek.wow)}% wow
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-apple-gray mb-3">This week</p>
          <p className="text-[13px] text-apple-gray">Start practicing to see your weekly activity.</p>
        </div>
      )}

      {/* Module progress */}
      {moduleProgress?.length > 0 && (
        <div className="card p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-apple-gray mb-3">Module progress</p>
          <div className="space-y-3">
            {moduleProgress.map((m) => (
              <div key={m.moduleId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold text-[var(--label)]">Module {m.moduleNumber} · {m.name}</span>
                  <span className="text-[11px] text-apple-gray font-medium">{m.pct}%</span>
                </div>
                <div className="h-2 bg-apple-gray6 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${m.pct}%`, background: m.pct === 100 ? "#34C759" : m.pct >= 50 ? "#7c3aed" : "#007AFF" }} />
                </div>
                <p className="text-[10px] text-apple-gray mt-0.5">{m.completedTopics} / {m.totalTopics} topics · {m.completedExercises} exercises</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy by module */}
      {skills?.length > 0 && (
        <div className="card p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-apple-gray mb-3">Accuracy by module</p>
          <div className="space-y-2.5">
            {skills.slice(0, 6).map((s) => (
              <div key={s.moduleId} className="flex items-center gap-3">
                <span className="text-[11px] text-apple-gray w-8 text-center">{s.moduleNumber}</span>
                <div className="flex-1 h-2 bg-apple-gray6 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-apple-blue" style={{ width: `${s.accuracy}%` }} />
                </div>
                <span className="text-[11px] text-apple-gray w-16 text-right">{s.accuracy}% · {s.total}</span>
                <span className="text-[10px] text-apple-green font-semibold">+{s.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights?.length > 0 && (
        <div className="card p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-apple-gray mb-3">Aria's read on you</p>
          <div className="space-y-2">
            {insights.map((i, idx) => (
              <div key={idx} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-apple-gray6">
                <span className="text-[18px] shrink-0">{i.icon}</span>
                <p className="text-[13px] text-[var(--label)] leading-relaxed">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate CTA */}
      {stats?.totalXp > 0 && (
        <Link to="/certificate" className="card p-5 flex items-center gap-4 hover:border-apple-orange transition-colors group block">
          <div className="w-12 h-12 rounded-full bg-apple-orange/10 flex items-center justify-center shrink-0">
            <span className="text-[24px]">🏆</span>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--label)]">Pro certificate</p>
            <p className="text-[12px] text-apple-gray">{stats.completedExercises} exercises · {stats.totalXp} XP earned</p>
          </div>
          <span className="ml-auto text-apple-blue text-[13px] font-semibold group-hover:opacity-70 transition-opacity">View →</span>
        </Link>
      )}
    </div>
  );
}
