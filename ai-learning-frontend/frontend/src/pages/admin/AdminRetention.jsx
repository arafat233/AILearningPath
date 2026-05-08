import { useEffect, useState } from "react";
import { adminGetRetention } from "../../services/api";

function StatCard({ label, value, sub, color = "text-[var(--label)]" }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className={`text-[28px] font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-apple-gray mt-0.5">{sub}</p>}
    </div>
  );
}

function RetentionBar({ label, rate, cohortSize, retained }) {
  const color = rate >= 40 ? "#34C759" : rate >= 20 ? "#FF9500" : "#FF3B30";
  return (
    <div className="flex items-center gap-4">
      <span className="text-[13px] font-semibold text-[var(--label)] w-8">{label}</span>
      <div className="flex-1 bg-apple-gray6 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(rate, 100)}%`, background: color }}
        />
      </div>
      <span className="text-[13px] font-bold tabular-nums w-16 text-right" style={{ color }}>
        {rate}%
      </span>
      <span className="text-[11px] text-apple-gray w-24 text-right">
        {retained}/{cohortSize} users
      </span>
    </div>
  );
}

function FunnelStep({ step, label, count, rate, prevCount, color }) {
  const pct = prevCount > 0 ? Math.round((count / prevCount) * 100) : 100;
  return (
    <div className="relative">
      <div className="flex items-center gap-3 py-3 px-4 rounded-apple" style={{ background: `${color}12` }}>
        <span className="text-[11px] font-bold text-apple-gray w-5">{step}</span>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[var(--label)]">{label}</p>
          {prevCount > 0 && (
            <p className="text-[11px] text-apple-gray">{pct}% of previous step</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[20px] font-bold tabular-nums" style={{ color }}>{count.toLocaleString()}</p>
          <p className="text-[11px] text-apple-gray">{rate}% of signups</p>
        </div>
      </div>
      {step < 4 && (
        <div className="flex justify-center my-1">
          <div className="w-px h-4 bg-apple-gray5" />
        </div>
      )}
    </div>
  );
}

function TopicRow({ rank, topic, attempts, accuracy }) {
  const accColor = accuracy >= 70 ? "text-apple-green" : accuracy >= 50 ? "text-apple-orange" : "text-apple-red";
  return (
    <div className="flex items-center gap-3 py-2 border-b border-apple-gray6 last:border-0">
      <span className="text-[11px] text-apple-gray w-5 tabular-nums">{rank}</span>
      <span className="flex-1 text-[13px] text-[var(--label)] truncate">{topic}</span>
      <span className="text-[12px] text-apple-gray tabular-nums">{attempts.toLocaleString()} attempts</span>
      <span className={`text-[12px] font-semibold tabular-nums w-12 text-right ${accColor}`}>{accuracy}%</span>
    </div>
  );
}

export default function AdminRetention() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    adminGetRetention()
      .then((r) => setData(r.data.data))
      .catch(() => setError("Failed to load retention data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );
  if (error) return <p className="text-apple-red text-[14px]">{error}</p>;

  const { retention, funnel, topTopics, aiRetry } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[var(--label)]">Retention & Funnel</h1>
        <p className="text-[13px] text-apple-gray mt-0.5">
          D1 · D7 · D30 cohort retention · conversion funnel · AI tutor effectiveness
        </p>
      </div>

      {/* Retention cohorts */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[15px] font-semibold text-[var(--label)]">Cohort Retention</p>
          <p className="text-[11px] text-apple-gray">30-day signup window · practice attempt as signal</p>
        </div>
        <RetentionBar
          label="D1"
          rate={retention.d1.rate}
          cohortSize={retention.d1.cohortSize}
          retained={retention.d1.retained}
        />
        <RetentionBar
          label="D7"
          rate={retention.d7.rate}
          cohortSize={retention.d7.cohortSize}
          retained={retention.d7.retained}
        />
        <RetentionBar
          label="D30"
          rate={retention.d30.rate}
          cohortSize={retention.d30.cohortSize}
          retained={retention.d30.retained}
        />
        <div className="pt-2 border-t border-apple-gray6">
          <p className="text-[11px] text-apple-gray leading-relaxed">
            D1 ≥ 40% · D7 ≥ 20% · D30 ≥ 10% are healthy benchmarks for EdTech.
            Retention = had ≥1 practice attempt in a ±36h window around day N after signup.
          </p>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="card p-5">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-4">
          30-Day Acquisition Funnel
        </p>
        <FunnelStep step={1} label="Signed Up"        count={funnel.signups}   rate={100}                    prevCount={0}              color="#007AFF" />
        <FunnelStep step={2} label="Activated (≥1 Q)" count={funnel.activated} rate={funnel.activationRate}  prevCount={funnel.signups} color="#34C759" />
        <FunnelStep step={3} label="AI Engaged"       count={funnel.aiEngaged} rate={funnel.aiEngagementRate} prevCount={funnel.activated} color="#FF9500" />
        <FunnelStep step={4} label="Converted (Paid)" count={funnel.converted} rate={funnel.conversionRate}  prevCount={funnel.signups} color="#AF52DE" />
      </div>

      {/* AI tutor effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          label="AI Explanations (30d)"
          value={aiRetry.explanations.toLocaleString()}
          sub="wrong answers that triggered AI help"
          color="text-apple-orange"
        />
        <StatCard
          label="Topic Retry Rate"
          value={`${aiRetry.rate}%`}
          sub="retried same topic within 24h of explanation"
          color={aiRetry.rate >= 50 ? "text-apple-green" : aiRetry.rate >= 30 ? "text-apple-orange" : "text-apple-red"}
        />
        <StatCard
          label="Retried Topics"
          value={aiRetry.retried.toLocaleString()}
          sub="students acted on AI guidance"
          color="text-apple-blue"
        />
      </div>

      {/* Top practiced topics */}
      <div className="card p-5">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-3">
          Top 10 Practiced Topics (Last 30 Days)
        </p>
        {topTopics.length === 0 ? (
          <p className="text-[13px] text-apple-gray">No practice data yet.</p>
        ) : (
          <div>
            {topTopics.map((t, i) => (
              <TopicRow
                key={t.topic}
                rank={i + 1}
                topic={t.topic}
                attempts={t.attempts}
                accuracy={t.accuracy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Methodology note */}
      <div className="card p-4 border border-apple-blue/20 bg-apple-blue/4">
        <p className="text-[12px] text-apple-gray leading-relaxed">
          <span className="font-semibold text-[var(--label)]">Methodology: </span>
          Cohort retention uses practice Attempts as the activity signal.
          Funnel uses signups from the last 30 days.
          AI retry rate counts practice_start events on the same topicId within 24h of an AI explanation.
          All metrics exclude child sub-accounts.
        </p>
      </div>
    </div>
  );
}
