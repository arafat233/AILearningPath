import { useEffect, useRef, useState } from "react";
import { adminGetStats, adminRunOnboardingEmails, adminRunWeeklyParentEmails, getAIMetrics } from "../../services/api";

const REFRESH_INTERVAL = 60_000;

function StatCard({ label, value, sub, color = "text-[var(--label)]" }) {
  return (
    <div className="card p-5">
      <p className="text-[12px] text-apple-gray">{label}</p>
      <p className={`text-[28px] font-bold tabular-nums mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-apple-gray mt-0.5">{sub}</p>}
    </div>
  );
}

function UserSplitBar({ paid, free, total }) {
  if (!total) return null;
  const paidPct = Math.round((paid / total) * 100);
  const freePct = 100 - paidPct;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-apple-gray">
        <span>Free ({freePct}%)</span>
        <span>Paid ({paidPct}%)</span>
      </div>
      <div className="h-2.5 rounded-full bg-apple-gray5 overflow-hidden flex">
        <div className="h-full bg-apple-gray3 transition-all" style={{ width: `${freePct}%` }} />
        <div className="h-full bg-apple-green flex-1 transition-all" />
      </div>
      <div className="flex justify-between text-[12px] font-semibold">
        <span className="text-[var(--label)]">{free.toLocaleString()} free</span>
        <span className="text-apple-green">{paid.toLocaleString()} paid</span>
      </div>
    </div>
  );
}

function Sparkline7Day({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: 52 }}>
      {data.map((d, i) => {
        const h   = d.value > 0 ? Math.max(Math.round((d.value / max) * 44), 4) : 2;
        const day = new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" });
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              title={`${day}: ₹${d.value.toLocaleString("en-IN")}`}
              className="w-full rounded-sm bg-apple-green/70 group-hover:bg-apple-green transition-colors cursor-default"
              style={{ height: h }}
            />
            <p className="text-[8px] text-apple-gray leading-none">{day}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOverview() {
  const [stats,        setStats]        = useState(null);
  const [aiMetrics,    setAiMetrics]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [emailMsg,     setEmailMsg]     = useState("");
  const [emailRunning, setEmailRunning] = useState("");
  const intervalRef = useRef(null);

  const loadStats = (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    Promise.all([adminGetStats(), getAIMetrics()])
      .then(([statsRes, metricsRes]) => {
        setStats(statsRes.data);
        setAiMetrics(metricsRes.data?.data || null);
        setLastUpdated(new Date());
      })
      .catch(() => {})
      .finally(() => { if (showSpinner) setLoading(false); });
  };

  useEffect(() => {
    loadStats(true);
    intervalRef.current = setInterval(() => loadStats(false), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  const runEmails = async (type) => {
    setEmailRunning(type);
    setEmailMsg("");
    try {
      const fn = type === "onboarding" ? adminRunOnboardingEmails : adminRunWeeklyParentEmails;
      const { data } = await fn();
      const d = data.data;
      setEmailMsg(
        type === "onboarding"
          ? `Onboarding: ${d.day2 ?? 0} day-2 + ${d.day7 ?? 0} day-7 emails sent.`
          : `Parent digest: ${d.sent ?? 0} of ${d.total ?? 0} emails sent.`
      );
    } catch {
      setEmailMsg("Failed — check server logs.");
    } finally {
      setEmailRunning("");
    }
  };

  if (loading) return <p className="text-apple-gray text-[14px]">Loading…</p>;
  if (!stats)  return <p className="text-apple-red text-[14px]">Failed to load stats.</p>;

  const { revenue, claude, planBreakdown, revenueSparkline } = stats;

  const revenueUSD   = (revenue?.totalRupees || 0) / 84;
  const claudeCost   = claude?.estimatedCostUSD || 0;
  const netMarginUSD = revenueUSD - claudeCost;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">Admin Overview</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="text-[11px] text-apple-gray">
              Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          <button onClick={() => loadStats(false)}
            className="btn-ghost text-[12px] border border-apple-gray4 px-3 py-1.5">
            Refresh
          </button>
        </div>
      </div>

      {/* ── Student breakdown ─────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">Students</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Students"   value={stats.totalUsers.toLocaleString()}  sub={`${stats.activeToday} active today`} />
          <StatCard label="Free Users"       value={(stats.freeUsers ?? 0).toLocaleString()} sub="no active paid plan" />
          <StatCard label="Paid Users"       value={(stats.paidUsers ?? 0).toLocaleString()} sub="active subscription" color="text-apple-green" />
          <StatCard label="Conversion Rate"  value={stats.totalUsers > 0 ? `${Math.round(((stats.paidUsers ?? 0) / stats.totalUsers) * 100)}%` : "—"} sub="free → paid" color="text-apple-blue" />
        </div>

        <div className="card p-5">
          <p className="text-[13px] font-semibold text-[var(--label)] mb-3">Free vs Paid Split</p>
          <UserSplitBar paid={stats.paidUsers ?? 0} free={stats.freeUsers ?? 0} total={stats.totalUsers} />
        </div>

        <div className="card p-5">
          <p className="text-[13px] font-semibold text-[var(--label)] mb-3">Plan Breakdown</p>
          <div className="flex gap-6 flex-wrap">
            {Object.entries(planBreakdown || {}).map(([plan, count]) => (
              <div key={plan}>
                <p className="text-[11px] text-apple-gray capitalize">{plan}</p>
                <p className="text-[22px] font-bold text-[var(--label)]">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Revenue ───────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">Revenue</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Revenue Collected"
            value={`₹${(revenue?.totalRupees || 0).toLocaleString("en-IN")}`}
            sub={`${revenue?.totalPayments || 0} payments all-time`}
            color="text-apple-green"
          />
          <StatCard
            label="Avg Revenue per Payment"
            value={revenue?.totalPayments
              ? `₹${Math.round((revenue.totalRupees || 0) / revenue.totalPayments).toLocaleString("en-IN")}`
              : "—"}
            sub="across all captured payments"
          />
          <StatCard
            label="Paid Users × Avg Plan"
            value={(stats.paidUsers ?? 0) > 0
              ? `₹${Math.round((revenue?.totalRupees || 0) / (stats.paidUsers ?? 1)).toLocaleString("en-IN")}`
              : "—"}
            sub="lifetime value per paid user"
          />
        </div>

        {/* 7-day revenue sparkline */}
        {revenueSparkline?.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[var(--label)]">Revenue — Last 7 Days</p>
              <p className="text-[12px] text-apple-green font-semibold">
                ₹{revenueSparkline.reduce((s, d) => s + d.value, 0).toLocaleString("en-IN")} total
              </p>
            </div>
            <Sparkline7Day data={revenueSparkline} />
          </div>
        )}
      </section>

      {/* ── Claude API Cost ───────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">Claude API Usage &amp; Cost</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total API Calls Made"
            value={(claude?.totalCalls || 0).toLocaleString()}
            sub="actual Claude API calls"
          />
          <StatCard
            label="Tokens Used"
            value={(claude?.totalTokens || 0).toLocaleString()}
            sub="output tokens tracked"
          />
          <StatCard
            label="Estimated API Cost"
            value={`$${(claude?.estimatedCostUSD || 0).toFixed(2)}`}
            sub="Haiku $4/M output tokens"
            color="text-apple-red"
          />
          <StatCard
            label="API Calls Saved by Cache"
            value={(claude?.callsSaved || 0).toLocaleString()}
            sub={`~$${(claude?.estimatedSavedUSD || 0).toFixed(2)} avoided`}
            color="text-apple-green"
          />
        </div>

        <div className="card p-5 grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold mb-1">Revenue (USD est.)</p>
            <p className="text-[24px] font-bold text-apple-green">${revenueUSD.toFixed(0)}</p>
            <p className="text-[10px] text-apple-gray mt-0.5">₹{(revenue?.totalRupees || 0).toLocaleString("en-IN")} ÷ 84</p>
          </div>
          <div className="text-center border-x border-apple-gray5">
            <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold mb-1">Claude API Cost</p>
            <p className="text-[24px] font-bold text-apple-red">${claudeCost.toFixed(2)}</p>
            <p className="text-[10px] text-apple-gray mt-0.5">estimated at Haiku pricing</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold mb-1">Net (after API cost)</p>
            <p className={`text-[24px] font-bold ${netMarginUSD >= 0 ? "text-apple-green" : "text-apple-red"}`}>
              {netMarginUSD >= 0 ? "+" : ""}${netMarginUSD.toFixed(0)}
            </p>
            <p className="text-[10px] text-apple-gray mt-0.5">revenue − Claude cost</p>
          </div>
        </div>

        <div className="card p-4 bg-apple-blue/4 border border-apple-blue/20">
          <p className="text-[12px] text-apple-gray leading-relaxed">
            <span className="font-semibold text-[var(--label)]">Cost note:</span> Tokens tracked are output tokens only.
            Actual cost includes input tokens too — real cost is ~20–30% higher. Model: claude-haiku-4-5 at $4.00/M output tokens.
            INR→USD uses ₹84 = $1. Auto-refreshes every 60 seconds.
          </p>
        </div>
      </section>

      {/* ── Platform stats ────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">Platform</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Questions"  value={stats.totalQuestions.toLocaleString()} sub="in question bank" />
          <StatCard label="Total Attempts"   value={stats.totalAttempts.toLocaleString()}  sub="across all students" />
          <StatCard label="Cached Responses" value={(stats.aiCache?.totalCachedResponses || 0).toLocaleString()} sub="unique AI explanations stored" />
          <StatCard label="Cache Hits"       value={(stats.aiCache?.totalCacheHits || 0).toLocaleString()} sub="served from cache, $0 cost" color="text-apple-blue" />
        </div>
      </section>

      {/* ── AI Intelligence (7 days) ─────────────────────────── */}
      {aiMetrics && (
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">AI Intelligence — Last 7 Days</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="AI Calls"       value={(aiMetrics.totalCalls || 0).toLocaleString()}    sub={`${aiMetrics.failedCalls || 0} failed`} />
            <StatCard label="Cache Hit Rate" value={aiMetrics.cacheHitRate || "0%"}                  sub="Redis + DB hits"  color="text-apple-green" />
            <StatCard label="RAG Hit Rate"   value={aiMetrics.ragHitRate   || "0%"}                  sub="NCERT context injected" color="text-apple-blue" />
            <StatCard label="Avg Latency"    value={`${aiMetrics.avgLatencyMs || 0}ms`}              sub="per Claude call" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Tokens (7d)"    value={(aiMetrics.totalTokens || 0).toLocaleString()}   sub="input + output" />
            <StatCard label="Guardrail Blocks" value={(aiMetrics.failedCalls || 0).toLocaleString()} sub="output blocked before student" color="text-apple-orange" />
            <StatCard label="👍 Helpful"      value={(aiMetrics.feedback?.thumbsUp   || 0).toLocaleString()} sub="student ratings" color="text-apple-green" />
            <StatCard label="👎 Not Helpful"  value={(aiMetrics.feedback?.thumbsDown || 0).toLocaleString()} sub="needs improvement"  color="text-apple-red" />
          </div>
          {aiMetrics.byType?.length > 0 && (
            <div className="card p-5">
              <p className="text-[13px] font-semibold text-[var(--label)] mb-3">Calls by AI Type</p>
              <div className="flex gap-6 flex-wrap">
                {aiMetrics.byType.map((t) => (
                  <div key={t._id}>
                    <p className="text-[11px] text-apple-gray capitalize">{t._id}</p>
                    <p className="text-[20px] font-bold text-[var(--label)]">{t.calls.toLocaleString()}</p>
                    <p className="text-[10px] text-apple-gray">{(t.tokens || 0).toLocaleString()} tokens</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Email triggers ────────────────────────────────────── */}
      <section className="card p-5 space-y-3">
        <h2 className="text-[15px] font-semibold text-[var(--label)]">Email Triggers</h2>
        <p className="text-[12px] text-apple-gray">Manually fire email sequences (auto-run on server start).</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => runEmails("onboarding")} disabled={!!emailRunning}
            className="btn-ghost text-[13px] border border-apple-gray4">
            {emailRunning === "onboarding" ? "Running…" : "Run Onboarding Emails"}
          </button>
          <button onClick={() => runEmails("parent")} disabled={!!emailRunning}
            className="btn-ghost text-[13px] border border-apple-gray4">
            {emailRunning === "parent" ? "Running…" : "Run Weekly Parent Digest"}
          </button>
        </div>
        {emailMsg && <p className="text-[13px] text-apple-green font-medium">{emailMsg}</p>}
      </section>
    </div>
  );
}
