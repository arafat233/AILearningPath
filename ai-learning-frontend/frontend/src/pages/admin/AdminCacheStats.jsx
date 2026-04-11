import { useEffect, useState } from "react";
import { adminGetStats } from "../../services/api";

export default function AdminCacheStats() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats()
      .then((r) => setData(r.data.aiCache))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-apple-gray">Loading…</p>;
  if (!data)   return <p className="text-apple-red">Failed to load cache stats.</p>;

  const hitRate = data.totalCachedResponses > 0
    ? Math.round((data.totalCacheHits / Math.max(1, data.totalCacheHits + data.totalCachedResponses)) * 100)
    : 0;
  const savedCost = ((data.totalClaudeCallsSaved || 0) * 0.00025).toFixed(2); // Haiku ~$0.25 per 1k output tokens avg

  const stats = [
    { label: "Cached Responses",        value: data.totalCachedResponses || 0,   note: "unique question+mistake combos stored" },
    { label: "Total Cache Hits",         value: data.totalCacheHits || 0,         note: "times a cached response was served" },
    { label: "Claude Calls Saved",       value: data.totalClaudeCallsSaved || 0,  note: "API calls avoided" },
    { label: "Estimated Cost Saved",     value: `$${savedCost}`,                  note: "at Haiku pricing" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-bold text-[var(--label)]">AI Cache Stats</h1>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-[12px] text-apple-gray">{s.label}</p>
            <p className="text-[28px] font-bold text-[var(--label)] mt-1">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
            <p className="text-[11px] text-apple-gray mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="text-[15px] font-semibold text-[var(--label)] mb-2">How the 7-layer cache works</h2>
        <ol className="text-[13px] text-apple-gray space-y-1 list-decimal ml-4">
          <li>Correct answer → null immediately (0 cost)</li>
          <li>Has solution steps → return steps + tip (0 cost)</li>
          <li>Simple mistake pattern → static message (0 cost)</li>
          <li>In-memory cache hit → RAM lookup (0 cost, microseconds)</li>
          <li>DB cache hit → MongoDB lookup (0 cost, shared all users)</li>
          <li>Daily limit check → enforce free/pro quota</li>
          <li>Call Claude → store in DB + RAM for all future users</li>
        </ol>
        <p className="text-[12px] text-apple-blue mt-3">After the first student triggers a question+mistake combo, every future student gets the response for free.</p>
      </div>
    </div>
  );
}
