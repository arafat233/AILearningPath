import { useEffect, useState } from "react";
import { adminGetStats, adminRunOnboardingEmails, adminRunWeeklyParentEmails } from "../../services/api";

export default function AdminOverview() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailMsg, setEmailMsg] = useState("");
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
      if (type === "onboarding") {
        setEmailMsg(`Onboarding: ${d.day2 ?? 0} day-2 + ${d.day7 ?? 0} day-7 emails sent.`);
      } else {
        setEmailMsg(`Parent digest: ${d.sent ?? 0} of ${d.total ?? 0} emails sent.`);
      }
    } catch {
      setEmailMsg("Failed — check server logs.");
    } finally {
      setEmailRunning("");
    }
  };

  if (loading) return <p className="text-apple-gray text-[14px]">Loading…</p>;
  if (!stats)  return <p className="text-apple-red text-[14px]">Failed to load stats.</p>;

  const cards = [
    { label: "Total Users",      value: stats.totalUsers,     sub: `${stats.activeToday} active today` },
    { label: "Total Questions",  value: stats.totalQuestions, sub: "in question bank" },
    { label: "Total Attempts",   value: stats.totalAttempts,  sub: "across all students" },
    { label: "Cached Responses", value: stats.aiCache?.totalCachedResponses || 0, sub: `${stats.aiCache?.totalClaudeCallsSaved || 0} Claude calls saved` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-bold text-[var(--label)]">Admin Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-[12px] text-apple-gray">{c.label}</p>
            <p className="text-[28px] font-bold text-[var(--label)] mt-1">{c.value.toLocaleString()}</p>
            <p className="text-[11px] text-apple-gray mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="text-[16px] font-semibold text-[var(--label)] mb-3">Plan Breakdown</h2>
        <div className="flex gap-6">
          {Object.entries(stats.planBreakdown || {}).map(([plan, count]) => (
            <div key={plan}>
              <p className="text-[12px] text-apple-gray capitalize">{plan}</p>
              <p className="text-[20px] font-bold text-[var(--label)]">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email triggers */}
      <div className="card p-5 space-y-3">
        <h2 className="text-[16px] font-semibold text-[var(--label)]">Email Triggers</h2>
        <p className="text-[12px] text-apple-gray">Manually run email sequences (normally run automatically on server start).</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => runEmails("onboarding")}
            disabled={!!emailRunning}
            className="btn-ghost text-[13px] border border-apple-gray4"
          >
            {emailRunning === "onboarding" ? "Running…" : "Run Onboarding Emails"}
          </button>
          <button
            onClick={() => runEmails("parent")}
            disabled={!!emailRunning}
            className="btn-ghost text-[13px] border border-apple-gray4"
          >
            {emailRunning === "parent" ? "Running…" : "Run Weekly Parent Digest"}
          </button>
        </div>
        {emailMsg && (
          <p className="text-[13px] text-apple-green font-medium">{emailMsg}</p>
        )}
      </div>
    </div>
  );
}
