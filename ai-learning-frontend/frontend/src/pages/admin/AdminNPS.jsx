import { useEffect, useState } from "react";
import { adminGetFeedback } from "../../services/api";
import { exportCsv } from "../../utils/exportCsv";

function ScoreBadge({ score }) {
  const color =
    score >= 9 ? "bg-apple-green/10 text-apple-green" :
    score >= 7 ? "bg-apple-blue/10 text-apple-blue" :
    score >= 0 ? "bg-apple-red/10 text-apple-red" :
                 "bg-apple-gray5 text-apple-gray";
  return (
    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  );
}

function NPSGauge({ nps }) {
  const clamped = Math.max(-100, Math.min(100, nps ?? 0));
  const pct     = ((clamped + 100) / 200) * 100;
  const color   = clamped >= 50 ? "text-apple-green" : clamped >= 0 ? "text-apple-orange" : "text-apple-red";
  return (
    <div className="flex flex-col items-center gap-1">
      <p className={`text-[48px] font-bold tabular-nums ${color}`}>{clamped > 0 ? "+" : ""}{clamped}</p>
      <p className="text-[12px] text-apple-gray">NPS Score</p>
      <div className="w-48 h-2 rounded-full bg-apple-gray5 mt-1 overflow-hidden">
        <div className="h-full rounded-full bg-apple-blue transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-apple-gray mt-0.5">−100 ··· 0 ··· +100</p>
    </div>
  );
}

export default function AdminNPS() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("all"); // all | promoters | passives | detractors

  useEffect(() => {
    adminGetFeedback()
      .then((r) => setData(r.data.data))
      .catch(() => setError("Failed to load NPS data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );
  if (error) return <p className="text-apple-red text-[14px]">{error}</p>;
  if (!data?.total) return (
    <div className="space-y-4">
      <h1 className="text-[24px] font-bold text-[var(--label)]">NPS Feedback</h1>
      <div className="card p-10 text-center">
        <p className="text-[15px] font-semibold text-[var(--label)] mb-1">No responses yet</p>
        <p className="text-[13px] text-apple-gray">
          The NPS survey appears to users after 20+ practice attempts and a 7-day account age.
        </p>
      </div>
    </div>
  );

  const { nps, avg, total, promoters, detractors, items } = data;
  const passives = total - promoters - detractors;

  const filtered = filter === "promoters"  ? items.filter((i) => i.score >= 9) :
                   filter === "passives"   ? items.filter((i) => i.score >= 7 && i.score <= 8) :
                   filter === "detractors" ? items.filter((i) => i.score <= 6) :
                   items;

  const doExport = () => {
    exportCsv(`nps_${Date.now()}.csv`, filtered, [
      { label: "Date",    value: (i) => new Date(i.createdAt).toLocaleDateString("en-IN") },
      { label: "Score",   value: (i) => i.score },
      { label: "Segment", value: (i) => i.score >= 9 ? "Promoter" : i.score >= 7 ? "Passive" : "Detractor" },
      { label: "Comment", value: (i) => i.comment || "" },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">NPS Feedback</h1>
        <button onClick={doExport} className="btn-ghost text-[13px] border border-apple-gray4">Export CSV</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 flex flex-col items-center justify-center">
          <NPSGauge nps={nps} />
        </div>
        <div className="card p-5">
          <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold">Avg Score</p>
          <p className="text-[32px] font-bold text-[var(--label)] tabular-nums mt-1">{avg?.toFixed(1)}</p>
          <p className="text-[11px] text-apple-gray mt-0.5">out of 10</p>
        </div>
        <div className="card p-5">
          <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold">Responses</p>
          <p className="text-[32px] font-bold text-[var(--label)] tabular-nums mt-1">{total}</p>
          <p className="text-[11px] text-apple-gray mt-0.5">total submissions</p>
        </div>
        <div className="card p-5 space-y-2">
          <p className="text-[11px] text-apple-gray uppercase tracking-wider font-semibold">Breakdown</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-apple-green" />
            <span className="text-[12px] text-[var(--label)]">Promoters (9–10)</span>
            <span className="ml-auto font-semibold text-[13px]">{promoters}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-apple-blue" />
            <span className="text-[12px] text-[var(--label)]">Passives (7–8)</span>
            <span className="ml-auto font-semibold text-[13px]">{passives}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-apple-red" />
            <span className="text-[12px] text-[var(--label)]">Detractors (0–6)</span>
            <span className="ml-auto font-semibold text-[13px]">{detractors}</span>
          </div>
        </div>
      </div>

      {/* Segment filter */}
      <div className="flex gap-2">
        {[
          { key: "all",        label: `All (${total})` },
          { key: "promoters",  label: `Promoters (${promoters})` },
          { key: "passives",   label: `Passives (${passives})` },
          { key: "detractors", label: `Detractors (${detractors})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-[12px] px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === key ? "bg-apple-blue text-white" : "bg-apple-gray6 text-[var(--label2)]"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Responses table */}
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-apple-gray6 border-b border-apple-gray5">
            <tr>
              {["Date", "Score", "Segment", "Comment"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-apple-gray text-center">No responses in this segment.</td></tr>
            ) : filtered.map((item) => {
              const segment = item.score >= 9 ? "Promoter" : item.score >= 7 ? "Passive" : "Detractor";
              const segColor = item.score >= 9 ? "text-apple-green" : item.score >= 7 ? "text-apple-blue" : "text-apple-red";
              return (
                <tr key={item._id} className="hover:bg-apple-gray6/50">
                  <td className="px-4 py-3 text-apple-gray whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3"><ScoreBadge score={item.score} /></td>
                  <td className={`px-4 py-3 font-medium text-[12px] ${segColor}`}>{segment}</td>
                  <td className="px-4 py-3 text-apple-gray max-w-sm">
                    {item.comment ? (
                      <span className="italic">"{item.comment}"</span>
                    ) : (
                      <span className="text-apple-gray3">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card p-4 border border-apple-blue/20 bg-apple-blue/4">
        <p className="text-[12px] text-apple-gray leading-relaxed">
          <span className="font-semibold text-[var(--label)]">NPS methodology:</span> Score = % Promoters (9–10) minus % Detractors (0–6).
          Passives (7–8) are excluded. Range is −100 to +100. World-class SaaS NPS is typically 40–70.
          Survey shown after 20+ attempts, 7-day account age, and 30-day cooldown.
        </p>
      </div>
    </div>
  );
}
