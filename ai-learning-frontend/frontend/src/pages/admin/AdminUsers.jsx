import { useEffect, useState } from "react";
import { adminGetUsers, adminUpdateRole, adminUpdateUserPlan } from "../../services/api";

const ROLES = ["student", "admin", "parent", "teacher"];
const PLANS = ["free", "pro", "pro_annual", "premium", "premium_annual"];
const DAYS_OPTIONS = [7, 30, 90, 180, 365];

export default function AdminUsers() {
  const [users,       setUsers]       = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [planTarget,  setPlanTarget]  = useState(null); // userId of row with open plan panel
  const [planForm,    setPlanForm]    = useState({ plan: "pro", daysToAdd: 30 });
  const [planSaving,  setPlanSaving]  = useState(false);

  const load = (p = page, s = search) => {
    setLoading(true);
    adminGetUsers({ page: p, limit: 20, search: s })
      .then((r) => { setUsers(r.data.users); setTotal(r.data.total); setPage(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, ""); }, []);

  const changeRole = async (id, role) => {
    await adminUpdateRole(id, role).catch(() => {});
    setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
  };

  const openPlanPanel = (u) => {
    setPlanTarget(u._id);
    setPlanForm({ plan: u.plan || "pro", daysToAdd: 30 });
  };

  const grantPlan = async (userId) => {
    setPlanSaving(true);
    try {
      const { data } = await adminUpdateUserPlan(userId, { ...planForm, isPaid: planForm.plan !== "free" });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, ...data.data } : u));
      setPlanTarget(null);
    } catch { /* silent */ }
    finally { setPlanSaving(false); }
  };

  const revokePlan = async (userId) => {
    setPlanSaving(true);
    try {
      const { data } = await adminUpdateUserPlan(userId, { plan: "free", isPaid: false, daysToAdd: 0 });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, ...data.data } : u));
      setPlanTarget(null);
    } catch { /* silent */ }
    finally { setPlanSaving(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[24px] font-bold text-[var(--label)]">Users ({total})</h1>

      <div className="flex gap-3">
        <input
          className="input flex-1 max-w-xs"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") load(1, search); }}
        />
        <button onClick={() => load(1, search)} className="btn-primary">Search</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-apple-gray6 border-b border-apple-gray5">
            <tr>
              {["Name", "Email", "Subject / Grade", "Plan", "Role", "Joined", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-apple-gray text-center">Loading…</td></tr>
            ) : users.map((u) => (
              <>
                <tr key={u._id} className="hover:bg-apple-gray6/50">
                  <td className="px-4 py-3 font-medium text-[var(--label)]">{u.name}</td>
                  <td className="px-4 py-3 text-apple-gray">{u.email}</td>
                  <td className="px-4 py-3 text-apple-gray">{u.subject} / {u.grade}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      u.plan === "premium" || u.plan === "premium_annual" ? "bg-apple-yellow/15 text-apple-yellow" :
                      u.plan === "pro"     || u.plan === "pro_annual"     ? "bg-apple-blue/10 text-apple-blue" :
                      "bg-apple-gray5 text-apple-gray"
                    }`}>{u.plan || "free"}</span>
                    {u.isPaid && u.planExpiry && (
                      <p className="text-[10px] text-apple-gray mt-0.5">
                        exp {new Date(u.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role || "student"}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                      className="text-[12px] border border-apple-gray5 rounded px-2 py-1 bg-white"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-apple-gray">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => planTarget === u._id ? setPlanTarget(null) : openPlanPanel(u)}
                        className="text-[11px] text-apple-blue hover:underline"
                      >
                        {planTarget === u._id ? "Close" : "Manage Plan"}
                      </button>
                      {u.isPaid && (
                        <button onClick={() => revokePlan(u._id)} disabled={planSaving}
                          className="text-[11px] text-apple-red hover:underline">
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {planTarget === u._id && (
                  <tr key={`${u._id}-plan`}>
                    <td colSpan={7} className="px-4 py-3 bg-apple-blue/4 border-b border-apple-blue/10">
                      <div className="flex items-end gap-3 flex-wrap">
                        <div>
                          <label className="text-[11px] text-apple-gray">Plan</label>
                          <select className="input mt-1 text-[12px]" value={planForm.plan}
                            onChange={(e) => setPlanForm((f) => ({ ...f, plan: e.target.value }))}>
                            {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-apple-gray">Duration</label>
                          <select className="input mt-1 text-[12px]" value={planForm.daysToAdd}
                            onChange={(e) => setPlanForm((f) => ({ ...f, daysToAdd: Number(e.target.value) }))}>
                            {DAYS_OPTIONS.map((d) => <option key={d} value={d}>{d} days</option>)}
                          </select>
                        </div>
                        <button
                          onClick={() => grantPlan(u._id)}
                          disabled={planSaving || planForm.plan === "free"}
                          className="btn-primary text-[12px] py-1.5"
                        >
                          {planSaving ? "Saving…" : "Grant Plan"}
                        </button>
                        <p className="text-[11px] text-apple-gray">
                          Sets isPaid=true, plan, expiry = today + {planForm.daysToAdd} days
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex gap-2">
          <button onClick={() => load(page - 1)} disabled={page <= 1} className="btn-ghost text-[13px]">← Prev</button>
          <span className="text-[13px] text-apple-gray py-2">Page {page} of {Math.ceil(total / 20)}</span>
          <button onClick={() => load(page + 1)} disabled={page >= Math.ceil(total / 20)} className="btn-ghost text-[13px]">Next →</button>
        </div>
      )}
    </div>
  );
}
