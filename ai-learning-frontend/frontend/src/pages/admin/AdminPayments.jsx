import { useEffect, useState } from "react";
import { adminGetPayments } from "../../services/api";
import { exportCsv } from "../../utils/exportCsv";

const PLAN_LABELS = {
  pro:            "Pro",
  pro_annual:     "Pro Annual",
  premium:        "Premium",
  premium_annual: "Premium Annual",
};
const PLAN_OPTIONS = ["", "pro", "pro_annual", "premium", "premium_annual"];

export default function AdminPayments() {
  const [records, setRecords] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [filters, setFilters] = useState({ plan: "", from: "", to: "" });

  const load = (p = 1, f = filters) => {
    setLoading(true);
    const params = { page: p, limit: 20 };
    if (f.plan) params.plan = f.plan;
    if (f.from) params.from = f.from;
    if (f.to)   params.to   = f.to;
    adminGetPayments(params)
      .then((r) => {
        setRecords(r.data.data.records);
        setTotal(r.data.data.total);
        setPage(p);
      })
      .catch(() => setError("Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(1), []);

  const applyFilters = () => load(1, filters);
  const clearFilters = () => {
    const blank = { plan: "", from: "", to: "" };
    setFilters(blank);
    load(1, blank);
  };

  const pageRevenue = records.reduce((sum, r) => sum + (r.amount || 0), 0);

  const doExport = () => {
    exportCsv(`payments_${Date.now()}.csv`, records, [
      { label: "Date",       value: (r) => new Date(r.createdAt).toLocaleDateString("en-IN") },
      { label: "Name",       value: (r) => r.userId?.name || "" },
      { label: "Email",      value: (r) => r.userId?.email || "" },
      { label: "Plan",       value: (r) => PLAN_LABELS[r.planKey] || r.planKey },
      { label: "Amount",     value: (r) => `₹${(r.amount / 100).toLocaleString("en-IN")}` },
      { label: "Status",     value: (r) => r.status },
      { label: "Coupon",     value: (r) => r.couponCode || "" },
      { label: "Payment ID", value: (r) => r.razorpayPaymentId },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[var(--label)]">Payments ({total})</h1>
          {records.length > 0 && (
            <p className="text-[13px] text-apple-gray mt-0.5">
              Page total: <span className="font-semibold text-apple-green">₹{(pageRevenue / 100).toLocaleString("en-IN")}</span>
            </p>
          )}
        </div>
        <button onClick={doExport} className="btn-ghost text-[13px] border border-apple-gray4">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[11px] text-apple-gray block mb-1">Plan</label>
          <select className="input text-[13px]" value={filters.plan}
            onChange={(e) => setFilters((f) => ({ ...f, plan: e.target.value }))}>
            <option value="">All plans</option>
            {PLAN_OPTIONS.filter(Boolean).map((p) => (
              <option key={p} value={p}>{PLAN_LABELS[p] || p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-apple-gray block mb-1">From</label>
          <input type="date" className="input text-[13px]" value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} />
        </div>
        <div>
          <label className="text-[11px] text-apple-gray block mb-1">To</label>
          <input type="date" className="input text-[13px]" value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} />
        </div>
        <button onClick={applyFilters} className="btn-primary">Apply</button>
        {(filters.plan || filters.from || filters.to) && (
          <button onClick={clearFilters} className="btn-ghost text-[13px]">Clear</button>
        )}
      </div>

      {error && <p className="text-apple-red text-[13px]">{error}</p>}

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-apple-gray6 border-b border-apple-gray5">
            <tr>
              {["Date", "User", "Plan", "Amount", "Coupon", "Status", "Razorpay Payment ID"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-apple-gray text-center">Loading…</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-apple-gray text-center">No payments recorded yet.</td></tr>
            ) : records.map((r) => (
              <tr key={r._id} className="hover:bg-apple-gray6/50">
                <td className="px-4 py-3 text-apple-gray whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--label)]">{r.userId?.name || "—"}</p>
                  <p className="text-[11px] text-apple-gray">{r.userId?.email || String(r.userId)}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    r.planKey?.includes("premium")
                      ? "bg-apple-yellow/15 text-apple-yellow"
                      : "bg-apple-blue/10 text-apple-blue"
                  }`}>
                    {PLAN_LABELS[r.planKey] || r.planKey}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-apple-green">
                  ₹{(r.amount / 100).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-apple-gray">
                  {r.couponCode ? (
                    <span className="font-mono text-[11px] bg-apple-blue/8 text-apple-blue px-1.5 py-0.5 rounded">{r.couponCode}</span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    r.status === "captured"
                      ? "bg-apple-green/10 text-apple-green"
                      : "bg-apple-orange/10 text-apple-orange"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-apple-gray">
                  {r.razorpayPaymentId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex items-center gap-2">
          <button onClick={() => load(page - 1)} disabled={page <= 1} className="btn-ghost text-[13px]">← Prev</button>
          <span className="text-[13px] text-apple-gray py-2">Page {page} of {Math.ceil(total / 20)}</span>
          <button onClick={() => load(page + 1)} disabled={page >= Math.ceil(total / 20)} className="btn-ghost text-[13px]">Next →</button>
        </div>
      )}
    </div>
  );
}
