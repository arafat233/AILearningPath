import { useEffect, useState } from "react";
import {
  adminGetUsers, adminUpdateRole, adminUpdateUserPlan,
  adminDeleteUser, adminGetUserDetail,
} from "../../services/api";
import { exportCsv } from "../../utils/exportCsv";

const ROLES        = ["student", "admin", "parent", "teacher"];
const PLANS        = ["free", "pro", "pro_annual", "premium", "premium_annual"];
const DAYS_OPTIONS = [7, 30, 90, 180, 365];

function UserDrawer({ userId, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminGetUserDetail(userId)
      .then((r) => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const u       = data?.user;
  const profile = data?.profile;
  const stats   = data?.attemptStats;
  const acc     = stats?.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
  const topTopics = (profile?.topicProgress || [])
    .sort((a, b) => (b.attempts || 0) - (a.attempts || 0))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20" onClick={onClose} />
      <div className="w-[400px] bg-white dark:bg-[var(--bg)] border-l border-apple-gray5 shadow-2xl overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-apple-gray5">
          <h2 className="text-[17px] font-bold text-[var(--label)]">User Detail</h2>
          <button onClick={onClose} className="text-apple-gray hover:text-[var(--label)] text-xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
          </div>
        ) : !u ? (
          <p className="p-6 text-apple-red text-[13px]">Failed to load user.</p>
        ) : (
          <div className="p-6 space-y-6">
            {/* Identity */}
            <section className="space-y-1">
              <p className="text-[18px] font-bold text-[var(--label)]">{u.name}</p>
              <p className="text-[13px] text-apple-gray">{u.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  u.plan?.includes("premium") ? "bg-apple-yellow/15 text-apple-yellow" :
                  u.plan !== "free"            ? "bg-apple-blue/10 text-apple-blue" :
                  "bg-apple-gray5 text-apple-gray"
                }`}>{u.plan || "free"}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-apple-gray5 text-apple-gray capitalize">{u.role}</span>
                {u.isPaid && u.planExpiry && (
                  <span className="text-[11px] text-apple-gray">
                    expires {new Date(u.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </section>

            {/* Account info */}
            <section className="space-y-2">
              <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider">Account</p>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div><p className="text-apple-gray">Subject</p><p className="font-medium text-[var(--label)]">{u.subject || "—"}</p></div>
                <div><p className="text-apple-gray">Grade</p><p className="font-medium text-[var(--label)]">{u.grade || "—"}</p></div>
                <div><p className="text-apple-gray">Joined</p><p className="font-medium text-[var(--label)]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}</p></div>
                <div><p className="text-apple-gray">Last Active</p><p className="font-medium text-[var(--label)]">{u.lastActiveDate || "—"}</p></div>
              </div>
            </section>

            {/* Practice stats */}
            {stats && (
              <section className="space-y-2">
                <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider">Practice Stats</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="card p-3 text-center">
                    <p className="text-[22px] font-bold text-[var(--label)]">{stats.total}</p>
                    <p className="text-[10px] text-apple-gray">attempts</p>
                  </div>
                  <div className="card p-3 text-center">
                    <p className="text-[22px] font-bold text-apple-green">{stats.correct}</p>
                    <p className="text-[10px] text-apple-gray">correct</p>
                  </div>
                  <div className="card p-3 text-center">
                    <p className={`text-[22px] font-bold ${acc !== null && acc >= 70 ? "text-apple-green" : "text-apple-orange"}`}>
                      {acc !== null ? `${acc}%` : "—"}
                    </p>
                    <p className="text-[10px] text-apple-gray">accuracy</p>
                  </div>
                </div>
                {profile?.thinkingProfile && (
                  <p className="text-[12px] text-apple-gray">
                    Profile: <span className="font-medium text-[var(--label)]">{profile.thinkingProfile}</span>
                  </p>
                )}
              </section>
            )}

            {/* Top topics */}
            {topTopics.length > 0 && (
              <section className="space-y-2">
                <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider">Top Topics</p>
                <div className="space-y-1.5">
                  {topTopics.map((t) => (
                    <div key={t.topic} className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--label)] truncate max-w-[200px]">{t.topic}</span>
                      <span className="text-apple-gray ml-2">
                        {t.attempts} att · {t.accuracy != null ? `${Math.round(t.accuracy * 100)}%` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Weak / Strong */}
            {(profile?.weakAreas?.length > 0 || profile?.strongAreas?.length > 0) && (
              <section className="space-y-2">
                {profile.weakAreas?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-apple-red uppercase tracking-wider mb-1">Weak Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.weakAreas.slice(0, 6).map((a) => (
                        <span key={a} className="text-[10px] px-2 py-0.5 bg-apple-red/8 text-apple-red rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.strongAreas?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-apple-green uppercase tracking-wider mb-1">Strong Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.strongAreas.slice(0, 6).map((a) => (
                        <span key={a} className="text-[10px] px-2 py-0.5 bg-apple-green/8 text-apple-green rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users,       setUsers]       = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [planTarget,  setPlanTarget]  = useState(null);
  const [planForm,    setPlanForm]    = useState({ plan: "pro", daysToAdd: 30 });
  const [planSaving,  setPlanSaving]  = useState(false);
  const [drawerUser,  setDrawerUser]  = useState(null); // userId string

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

  const delUser = async (id, name) => {
    if (!confirm(`Delete "${name}"? This permanently removes the user and their profile.`)) return;
    await adminDeleteUser(id).catch(() => {});
    setUsers((prev) => prev.filter((u) => u._id !== id));
    setTotal((t) => t - 1);
    if (drawerUser === id) setDrawerUser(null);
  };

  const doExport = () => {
    exportCsv(`users_${Date.now()}.csv`, users, [
      { label: "Name",    value: (u) => u.name },
      { label: "Email",   value: (u) => u.email },
      { label: "Plan",    value: (u) => u.plan || "free" },
      { label: "isPaid",  value: (u) => u.isPaid ? "yes" : "no" },
      { label: "Role",    value: (u) => u.role || "student" },
      { label: "Subject", value: (u) => u.subject || "" },
      { label: "Grade",   value: (u) => u.grade || "" },
      { label: "Joined",  value: (u) => u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "" },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">Users ({total})</h1>
        <button onClick={doExport} className="btn-ghost text-[13px] border border-apple-gray4">Export CSV</button>
      </div>

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
                  <td className="px-4 py-3 font-medium text-[var(--label)]">
                    <button
                      onClick={() => setDrawerUser(drawerUser === u._id ? null : u._id)}
                      className="hover:text-apple-blue hover:underline text-left"
                    >
                      {u.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-apple-gray">
                    <p>{u.email}</p>
                    {u.parentInfo && (
                      <p className="text-[10px] text-apple-purple mt-0.5">
                        ↳ parent: {u.parentInfo.name}
                      </p>
                    )}
                  </td>
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
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => planTarget === u._id ? setPlanTarget(null) : openPlanPanel(u)}
                        className="text-[11px] text-apple-blue hover:underline"
                      >
                        {planTarget === u._id ? "Close" : "Plan"}
                      </button>
                      {u.isPaid && (
                        <button onClick={() => revokePlan(u._id)} disabled={planSaving}
                          className="text-[11px] text-apple-orange hover:underline">
                          Revoke
                        </button>
                      )}
                      <button onClick={() => delUser(u._id, u.name)}
                        className="text-[11px] text-apple-red hover:underline">
                        Delete
                      </button>
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

      {drawerUser && <UserDrawer userId={drawerUser} onClose={() => setDrawerUser(null)} />}
    </div>
  );
}
