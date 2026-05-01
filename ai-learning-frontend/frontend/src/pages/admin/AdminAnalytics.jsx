import { useEffect, useState } from "react";
import { adminGetAnalytics } from "../../services/api";

function MiniBar({ data, color = "#007AFF", valueKey = "value", height = 80 }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-px" style={{ height }}>
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d.date}: ${d[valueKey]}`}
          className="flex-1 rounded-sm transition-all cursor-default"
          style={{
            height: `${Math.max(2, (d[valueKey] / max) * height)}px`,
            background: color,
            opacity: 0.7 + (d[valueKey] / max) * 0.3,
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, color = "text-[var(--label)]" }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className={`text-[28px] font-bold ${color} tabular-nums`}>{value}</p>
      {sub && <p className="text-[11px] text-apple-gray mt-0.5">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, data, color, valueKey = "value", unit = "" }) {
  const total = data?.reduce((s, d) => s + d[valueKey], 0) ?? 0;
  const last7  = data?.slice(-7).reduce((s, d) => s + d[valueKey], 0) ?? 0;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[14px] font-semibold text-[var(--label)]">{title}</p>
          <p className="text-[12px] text-apple-gray mt-0.5">
            Last 7d: <span className="font-semibold text-[var(--label)]">{unit}{last7.toLocaleString()}</span>
            &nbsp;·&nbsp;30d total: <span className="font-semibold text-[var(--label)]">{unit}{total.toLocaleString()}</span>
          </p>
        </div>
        <span className="text-[11px] text-apple-gray">30 days</span>
      </div>
      <MiniBar data={data} color={color} valueKey={valueKey} height={72} />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-apple-gray">{data?.[0]?.date?.slice(5)}</span>
        <span className="text-[10px] text-apple-gray">{data?.[data.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    adminGetAnalytics()
      .then((r) => setData(r.data))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );
  if (error) return <p className="text-apple-red text-[14px]">{error}</p>;

  const { summary, trends } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[var(--label)]">Analytics</h1>
        <p className="text-[13px] text-apple-gray mt-0.5">DAU · MAU · Revenue · Retention</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="DAU (Today)"
          value={summary.dau.toLocaleString()}
          sub="users active today"
          color="text-apple-blue"
        />
        <StatCard
          label="MAU (30d)"
          value={summary.mau.toLocaleString()}
          sub="unique active users"
        />
        <StatCard
          label="Paid Conversion"
          value={`${summary.conversionRate}%`}
          sub={`${summary.paidUsers} of ${summary.totalUsers} users`}
          color="text-apple-green"
        />
        <StatCard
          label="7-Day Retention"
          value={`${summary.retention7d}%`}
          sub="returned after signup"
          color={summary.retention7d >= 40 ? "text-apple-green" : summary.retention7d >= 20 ? "text-apple-orange" : "text-apple-red"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${(summary.totalRevenue / 100).toLocaleString("en-IN")}`}
          sub="all-time captured payments"
          color="text-apple-green"
        />
        <StatCard
          label="Total Users"
          value={summary.totalUsers.toLocaleString()}
          sub={`${summary.paidUsers} paid · ${summary.totalUsers - summary.paidUsers} free`}
        />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="New Registrations"
          data={trends.newUsers}
          color="#007AFF"
        />
        <ChartCard
          title="Practice Attempts"
          data={trends.attempts}
          color="#34C759"
        />
        <ChartCard
          title="Daily Revenue"
          data={trends.revenue}
          color="#FF9500"
          valueKey="value"
          unit="₹"
        />
      </div>

      {/* Retention note */}
      <div className="card p-5 border border-apple-blue/20 bg-apple-blue/4">
        <p className="text-[13px] font-semibold text-[var(--label)] mb-1">Retention methodology</p>
        <p className="text-[12px] text-apple-gray leading-relaxed">
          7-day retention = users created more than 7 days ago who made at least one AI call in the last 7 days,
          divided by all users created before that 7-day window. DAU/MAU use AI call activity as proxy.
        </p>
      </div>
    </div>
  );
}
