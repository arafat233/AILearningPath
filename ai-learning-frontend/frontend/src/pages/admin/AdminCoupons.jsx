import { useEffect, useState } from "react";
import {
  adminGetCoupons, adminCreateCoupon, adminUpdateCoupon,
  adminDeleteCoupon, adminGetCouponRedemptions,
} from "../../services/api";

const BLANK = { code: "", discountType: "percent", discountValue: 10, planFilter: [], validUntil: "", maxUses: 0, isActive: true };
const PLANS  = ["pro", "pro_annual", "premium", "premium_annual"];

export default function AdminCoupons() {
  const [coupons,      setCoupons]      = useState([]);
  const [editing,      setEditing]      = useState(null);
  const [form,         setForm]         = useState(BLANK);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");

  // Redemptions drawer
  const [redemptionId,      setRedemptionId]      = useState(null); // coupon _id
  const [redemptions,       setRedemptions]       = useState([]);
  const [redemptionsLoading,setRedemptionsLoading]= useState(false);

  const load = () => {
    setLoading(true);
    adminGetCoupons()
      .then((r) => setCoupons(r.data.data))
      .catch(() => setError("Failed to load coupons"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew  = () => { setForm(BLANK); setEditing("new"); setError(""); };
  const openEdit = (c) => {
    setForm({ ...c, validUntil: c.validUntil ? new Date(c.validUntil).toISOString().split("T")[0] : "" });
    setEditing(c);
    setError("");
  };

  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const togglePlan = (plan) =>
    setForm((prev) => ({
      ...prev,
      planFilter: prev.planFilter.includes(plan)
        ? prev.planFilter.filter((p) => p !== plan)
        : [...prev.planFilter, plan],
    }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, validUntil: form.validUntil || null };
      if (editing === "new") {
        const { data } = await adminCreateCoupon(payload);
        setCoupons((prev) => [data.data, ...prev]);
      } else {
        const { data } = await adminUpdateCoupon(editing._id, payload);
        setCoupons((prev) => prev.map((x) => x._id === data.data._id ? data.data : x));
      }
      setEditing(null);
    } catch (e) {
      setError(e.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this coupon permanently?")) return;
    await adminDeleteCoupon(id).catch(() => {});
    setCoupons((prev) => prev.filter((x) => x._id !== id));
    if (redemptionId === id) setRedemptionId(null);
  };

  const toggleRedemptions = async (id) => {
    if (redemptionId === id) { setRedemptionId(null); return; }
    setRedemptionId(id);
    setRedemptionsLoading(true);
    adminGetCouponRedemptions(id)
      .then((r) => setRedemptions(r.data.data))
      .catch(() => setRedemptions([]))
      .finally(() => setRedemptionsLoading(false));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">Coupons ({coupons.length})</h1>
        <button onClick={openNew} className="btn-primary">+ New Coupon</button>
      </div>

      {error && <p className="text-apple-red text-[13px]">{error}</p>}

      {editing && (
        <div className="card p-5 space-y-4 border border-apple-blue/20">
          <h2 className="text-[15px] font-semibold text-[var(--label)]">
            {editing === "new" ? "Create Coupon" : `Edit — ${editing.code}`}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-apple-gray">Code</label>
              <input className="input w-full mt-1 uppercase" placeholder="SAVE20"
                value={form.code} onChange={(e) => f("code", e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Discount Type</label>
              <select className="input w-full mt-1" value={form.discountType} onChange={(e) => f("discountType", e.target.value)}>
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed amount (paise)</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">
                {form.discountType === "percent" ? "Discount %" : "Amount in paise (5000 = ₹50)"}
              </label>
              <input type="number" className="input w-full mt-1" value={form.discountValue}
                onChange={(e) => f("discountValue", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Max Uses (0 = unlimited)</label>
              <input type="number" className="input w-full mt-1" value={form.maxUses}
                onChange={(e) => f("maxUses", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Valid Until (blank = no expiry)</label>
              <input type="date" className="input w-full mt-1" value={form.validUntil}
                onChange={(e) => f("validUntil", e.target.value)} />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={(e) => f("isActive", e.target.checked)} />
              <label htmlFor="isActive" className="text-[13px] text-[var(--label)] select-none">Active</label>
            </div>
          </div>

          <div>
            <label className="text-[12px] text-apple-gray">Plan Filter (empty = valid for all plans)</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {PLANS.map((plan) => (
                <button key={plan} type="button" onClick={() => togglePlan(plan)}
                  className={`text-[12px] px-3 py-1 rounded-full border font-medium transition-colors ${
                    form.planFilter.includes(plan)
                      ? "bg-apple-blue text-white border-apple-blue"
                      : "bg-white text-apple-gray border-apple-gray4 hover:border-apple-blue"
                  }`}>
                  {plan}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={save} disabled={saving || !form.code} className="btn-primary">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-apple-gray6 border-b border-apple-gray5">
            <tr>
              {["Code", "Type", "Value", "Plans", "Uses", "Expiry", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-apple-gray text-center">Loading…</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-apple-gray text-center">No coupons yet.</td></tr>
            ) : coupons.map((c) => (
              <>
                <tr key={c._id} className="hover:bg-apple-gray6/50">
                  <td className="px-4 py-3 font-mono font-bold text-apple-blue tracking-wide">{c.code}</td>
                  <td className="px-4 py-3 text-apple-gray capitalize">{c.discountType}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--label)]">
                    {c.discountType === "percent" ? `${c.discountValue}%` : `₹${(c.discountValue / 100).toLocaleString("en-IN")}`}
                  </td>
                  <td className="px-4 py-3 text-apple-gray text-[12px]">
                    {c.planFilter?.length ? c.planFilter.join(", ") : "All plans"}
                  </td>
                  <td className="px-4 py-3 text-apple-gray">
                    <span className={c.usedCount > 0 ? "font-semibold text-apple-green" : ""}>
                      {c.usedCount}
                    </span>
                    {" "}/ {c.maxUses === 0 ? "∞" : c.maxUses}
                  </td>
                  <td className="px-4 py-3 text-apple-gray">
                    {c.validUntil ? new Date(c.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      c.isActive ? "bg-apple-green/10 text-apple-green" : "bg-apple-gray5 text-apple-gray"
                    }`}>
                      {c.isActive ? "Active" : "Off"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => toggleRedemptions(c._id)}
                        className={`text-[12px] hover:underline ${redemptionId === c._id ? "text-apple-orange" : "text-apple-gray"}`}>
                        {redemptionId === c._id ? "Hide" : "Redemptions"}
                      </button>
                      <button onClick={() => openEdit(c)} className="text-[12px] text-apple-blue hover:underline">Edit</button>
                      <button onClick={() => del(c._id)}  className="text-[12px] text-apple-red hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>

                {redemptionId === c._id && (
                  <tr key={`${c._id}-redemptions`}>
                    <td colSpan={8} className="px-4 py-4 bg-apple-gray6/60 border-b border-apple-gray5">
                      {redemptionsLoading ? (
                        <p className="text-[13px] text-apple-gray">Loading redemptions…</p>
                      ) : redemptions.length === 0 ? (
                        <p className="text-[13px] text-apple-gray">No redemptions yet for <span className="font-mono font-bold">{c.code}</span>.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[12px] font-semibold text-[var(--label)] mb-2">
                            {redemptions.length} redemption{redemptions.length !== 1 ? "s" : ""} — total revenue:&nbsp;
                            <span className="text-apple-green">
                              ₹{(redemptions.reduce((s, r) => s + r.amount, 0) / 100).toLocaleString("en-IN")}
                            </span>
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[12px]">
                              <thead>
                                <tr className="text-apple-gray">
                                  <th className="text-left pr-6 pb-1">Date</th>
                                  <th className="text-left pr-6 pb-1">User</th>
                                  <th className="text-left pr-6 pb-1">Plan</th>
                                  <th className="text-left pb-1">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {redemptions.map((r) => (
                                  <tr key={r._id} className="border-t border-apple-gray5/50">
                                    <td className="pr-6 py-1 text-apple-gray">
                                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    <td className="pr-6 py-1">
                                      <p className="text-[var(--label)]">{r.userId?.name || "—"}</p>
                                      <p className="text-[10px] text-apple-gray">{r.userId?.email || ""}</p>
                                    </td>
                                    <td className="pr-6 py-1 text-apple-gray">{r.planKey}</td>
                                    <td className="py-1 font-semibold text-apple-green">
                                      ₹{(r.amount / 100).toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
