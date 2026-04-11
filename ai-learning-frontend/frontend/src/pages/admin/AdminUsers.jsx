import { useEffect, useState } from "react";
import { adminGetUsers, adminUpdateRole } from "../../services/api";

const ROLES = ["student", "admin", "parent", "teacher"];

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(false);

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
    setUsers((u) => u.map((x) => x._id === id ? { ...x, role } : x));
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
              {["Name", "Email", "Subject / Grade", "Plan", "Role", "Joined"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-apple-gray text-center">Loading…</td></tr>
            ) : users.map((u) => (
              <tr key={u._id} className="hover:bg-apple-gray6/50">
                <td className="px-4 py-3 font-medium text-[var(--label)]">{u.name}</td>
                <td className="px-4 py-3 text-apple-gray">{u.email}</td>
                <td className="px-4 py-3 text-apple-gray">{u.subject} / {u.grade}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    u.plan === "premium" ? "bg-apple-yellow/15 text-apple-yellow" :
                    u.plan === "pro"     ? "bg-apple-blue/10 text-apple-blue" :
                    "bg-apple-gray5 text-apple-gray"
                  }`}>{u.plan || "free"}</span>
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
              </tr>
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
