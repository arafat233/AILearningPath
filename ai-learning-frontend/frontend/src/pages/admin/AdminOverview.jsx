import { useEffect, useState } from "react";
import { adminGetStats, adminRunOnboardingEmails, adminRunWeeklyParentEmails } from "../../services/api";

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

export default function AdminOverview() {
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [emailMsg,     setEmailMsg]     = useState("");
  const [emailRunning, setEmailRunning] = useState("");

  useEffect(() => {
    adminGetStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const { revenue, claude, planBreakdown } = stats;

  // Net margin estimate (revenue minus Claude cost, converted to same currency)
  const revenueUSD   = (revenue?.totalRupees || 0) / 84;  // rough INR→USD
  const claudeCost   = claude?.estimatedCostUSD || 0;
  const netMarginUSD = revenueUSD - claudeCost;

  return (
    <div className="space-y-7">
      <h1 className="text-[24px] font-bold text-[var(--label)]">Admin Overview</h1>

      {/* ── Student breakdown ─────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">Students</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Students"   value={stats.totalUsers.toLocaleString()}  sub={`${stats.activeToday} active today`} />
          <StatCard label="Free Users"       value={(stats.freeUsers ?? 0).toLocaleString()} sub="no active paid plan" color="text-[var(--label)]" />
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
            <span className="font-semibold text-[var(--label)]">Cost note:</span> Tokens tracked are output tokens only (Claude's responses).
            Actual cost includes input tokens too — real cost is ~20–30% higher. Model: claude-haiku-4-5 at $4.00/M output tokens.
            INR→USD conversion uses ₹84 = $1 (update as needed).
          </p>
        </div>
      </section>

      {/* ── Platform stats ────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">Platform</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Questions"    value={stats.totalQuestions.toLocaleString()} sub="in question bank" />
          <StatCard label="Total Attempts"     value={stats.totalAttempts.toLocaleString()}  sub="across all students" />
          <StatCard label="Cached Responses"   value={(stats.aiCache?.totalCachedResponses || 0).toLocaleString()} sub="unique AI explanations stored" />
          <StatCard label="Cache Hits"         value={(stats.aiCache?.totalCacheHits || 0).toLocaleString()} sub="served from cache, $0 cost" color="text-apple-blue" />
        </div>
      </section>

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
