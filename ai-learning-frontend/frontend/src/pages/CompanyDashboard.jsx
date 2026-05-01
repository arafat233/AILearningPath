import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "../store/companyStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

/* ── tiny helpers ───────────────────────────────────────── */
const fmt  = (n) => n == null ? "—" : Number(n).toLocaleString("en-IN");
const pct  = (n, total) => total > 0 ? ((n / total) * 100).toFixed(1) : "0.0";
const ago  = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};
const planLabel = { free: "Free", pro: "Pro", premium: "Premium" };
const goalLabel = { pass: "Pass", distinction: "Distinction", "top-ranker": "Top Ranker", scholarship: "Scholarship" };
const roleColor = { student: "#007AFF", parent: "#34C759", teacher: "#FF9500", admin: "#AF52DE" };

/* ── sub-components ─────────────────────────────────────── */
function StatCard({ label, value, sub, accent = "#007AFF", icon }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] mono uppercase tracking-[0.18em] text-gray-400">{label}</p>
        {icon && <span className="text-[18px]">{icon}</span>}
      </div>
      <p className="text-[32px] font-bold tracking-tight leading-none mt-1" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-[12px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function BarRow({ label, count, total, color }) {
  const w = total > 0 ? Math.max(2, (count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-gray-600 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: color }} />
      </div>
      <span className="text-[12px] mono text-gray-400 w-10 text-right shrink-0">{fmt(count)}</span>
      <span className="text-[11px] text-gray-300 w-10 text-right shrink-0">{pct(count, total)}%</span>
    </div>
  );
}

function Section({ title, tag, children }) {
  return (
    <div>
      {tag && <p className="text-[10px] mono uppercase tracking-[0.22em] text-gray-400 mb-1">{tag}</p>}
      <h2 className="text-[17px] font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-black/5 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function MiniTrend({ data }) {
  if (!data?.length) return <p className="text-gray-300 text-[12px]">No data yet</p>;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-14">
      {data.map(d => (
        <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm"
            style={{ height: `${Math.max(8, (d.count / max) * 100)}%`, background: "#007AFF" }}
          />
          <span className="text-[9px] mono text-gray-300">{d._id?.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── main dashboard ─────────────────────────────────────── */
export default function CompanyDashboard() {
  const navigate  = useNavigate();
  const token     = useCompanyStore((s) => s.token);
  const logout    = useCompanyStore((s) => s.logout);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [updated, setUpdated] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res  = await fetch(`${API}/api/company/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); navigate("/company-login", { replace: true }); return; }
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Failed to load stats"); return; }
      setStats(json.data);
      setUpdated(new Date());
      setError("");
    } catch {
      setError("Cannot reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    if (!token) { navigate("/company-login", { replace: true }); return; }
    fetchStats();
    const t = setInterval(fetchStats, 30_000);
    return () => clearInterval(t);
  }, [token, fetchStats, navigate]);

  const handleLogout = () => { logout(); navigate("/company-login", { replace: true }); };

  /* ── loading / error states ── */
  if (!token) return null;
  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[14px] text-gray-400">Loading dashboard…</p>
      </div>
    </div>
  );
  if (error && !stats) return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <p className="text-[16px] font-semibold text-gray-700 mb-2">Could not load stats</p>
        <p className="text-[13px] text-gray-400 mb-6">{error}</p>
        <button onClick={fetchStats} className="px-5 py-2.5 bg-[#007AFF] text-white rounded-xl text-[14px] font-semibold">Retry</button>
      </div>
    </div>
  );

  const { overview, ai, growth, plans, grades, subjects, goals, roles, revenue, recentSignups, signupTrend } = stats;
  const totalPlanCount = plans.reduce((s, p) => s + p.count, 0);
  const totalGoalCount = goals.reduce((s, g) => s + g.count, 0);
  const totalSubCount  = subjects.reduce((s, g) => s + g.count, 0);

  /* sort helper */
  const sorted = (arr, key = "count") => [...arr].sort((a, b) => b[key] - a[key]);

  const planColors = { free: "#8E8E93", pro: "#007AFF", premium: "#AF52DE" };
  const gradeColors = ["#FF9500","#FF9500","#FF9500","#34C759","#34C759","#5AC8FA","#5AC8FA","#5AC8FA","#AF52DE","#AF52DE"];

  return (
    <div className="min-h-screen bg-[#F2F2F7]">

      {/* ── TOP NAV ── */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
              <span className="text-white font-bold text-[12px]">S</span>
            </div>
            <span className="font-semibold text-gray-800 text-[15px]">Stellar</span>
            <span className="text-[11px] mono text-gray-300 uppercase tracking-widest">/ Company Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {updated && (
              <span className="text-[11px] mono text-gray-400">
                Updated {updated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
            <button
              onClick={fetchStats}
              className="text-[12px] px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition font-medium"
            >↻ Refresh</button>
            <button
              onClick={handleLogout}
              className="text-[12px] px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition font-medium"
            >Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-10">

        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
            <p className="text-orange-600 text-[13px]">⚠ {error} — showing last cached data</p>
          </div>
        )}

        {/* ── STUDENT OVERVIEW ── */}
        <section>
          <p className="text-[10px] mono uppercase tracking-[0.22em] text-gray-400 mb-1">Student Overview</p>
          <h2 className="text-[17px] font-bold text-gray-800 mb-4">Who is on Stellar right now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Students"   value={fmt(overview.totalStudents)}  sub="all registered"              accent="#007AFF" icon="👥" />
            <StatCard label="Paid"             value={fmt(overview.paid)}           sub={`${overview.conversionRate}% conversion`} accent="#34C759" icon="💳" />
            <StatCard label="Free"             value={fmt(overview.free)}           sub="no active plan"              accent="#FF9500" icon="🆓" />
            <StatCard label="Active Today"     value={fmt(overview.activeToday)}    sub="used AI today"               accent="#5AC8FA" icon="⚡" />
          </div>
        </section>

        {/* ── AI USAGE ── */}
        <section>
          <p className="text-[10px] mono uppercase tracking-[0.22em] text-gray-400 mb-1">AI Engine · Today</p>
          <h2 className="text-[17px] font-bold text-gray-800 mb-4">How hard the AI is working</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="AI Calls Today"       value={fmt(ai.callsToday)}         sub="across all students"          accent="#007AFF" icon="🤖" />
            <StatCard label="Maxed Out Today"      value={fmt(ai.maxedToday)}          sub={`${fmt(ai.freeMaxed)} free · ${fmt(ai.paidMaxed)} paid`} accent="#FF3B30" icon="🔴" />
            <StatCard label="Cached Responses"     value={fmt(ai.cachedResponses)}     sub="in the global cache"          accent="#AF52DE" icon="💾" />
            <StatCard label="API Calls Saved"      value={fmt(ai.totalSaved)}          sub={`${fmt(ai.totalCacheHits)} total cache hits`} accent="#34C759" icon="💰" />
          </div>
          {ai.maxedToday > 0 && (
            <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-red-400 text-[18px]">⚠</span>
              <p className="text-[13px] text-red-600">
                <span className="font-semibold">{fmt(ai.maxedToday)} students</span> hit their daily AI limit today and were blocked.
                Consider promoting the Pro plan or raising free-tier limits.
              </p>
            </div>
          )}
        </section>

        {/* ── GROWTH ── */}
        <section>
          <p className="text-[10px] mono uppercase tracking-[0.22em] text-gray-400 mb-1">Growth</p>
          <h2 className="text-[17px] font-bold text-gray-800 mb-4">Signups &amp; retention</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="New Today"       value={fmt(growth.newToday)}     sub="registered today"          accent="#007AFF" icon="✨" />
            <StatCard label="New This Week"   value={fmt(growth.newThisWeek)}  sub="since Sunday"              accent="#5AC8FA" icon="📅" />
            <StatCard label="New This Month"  value={fmt(growth.newThisMonth)} sub="since the 1st"             accent="#34C759" icon="📈" />
            <StatCard label="Dormant (30d)"   value={fmt(growth.inactive30d)}  sub="no AI use in 30 days"      accent="#8E8E93" icon="😴" />
          </div>

          {/* 7-day trend */}
          <Card className="mt-3">
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-3">7-Day Signup Trend</p>
            <MiniTrend data={signupTrend} />
          </Card>
        </section>

        {/* ── PLAN BREAKDOWN + REVENUE ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-1">Plan Breakdown</p>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">Free vs Paid</h3>
            <div className="space-y-3">
              {sorted(plans).map(p => (
                <BarRow
                  key={p._id}
                  label={planLabel[p._id] || p._id || "Unknown"}
                  count={p.count}
                  total={totalPlanCount}
                  color={planColors[p._id] || "#8E8E93"}
                />
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-1">Revenue Estimate</p>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">Monthly recurring (approx.)</h3>
            <div className="mt-1">
              <p className="text-[42px] font-bold tracking-tight text-[#34C759] leading-none">
                ₹{fmt(revenue.estimate)}
              </p>
              <p className="text-[12px] text-gray-400 mt-1">per month</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] mono uppercase text-gray-400">Pro × ₹199</p>
                <p className="text-[20px] font-bold text-[#007AFF] mt-0.5">{fmt(revenue.pro)}</p>
                <p className="text-[11px] text-gray-400">students</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] mono uppercase text-gray-400">Premium × ₹499</p>
                <p className="text-[20px] font-bold text-[#AF52DE] mt-0.5">{fmt(revenue.premium)}</p>
                <p className="text-[11px] text-gray-400">students</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ── GRADE + SUBJECT ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-1">Grade Distribution</p>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">Which classes are most active</h3>
            <div className="space-y-2.5">
              {grades.map((g, i) => (
                <BarRow
                  key={g._id}
                  label={`Class ${g._id}`}
                  count={g.count}
                  total={overview.totalStudents}
                  color={gradeColors[Number(g._id) - 1] || "#8E8E93"}
                />
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-1">Top Subjects</p>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">What students are studying</h3>
            <div className="space-y-2.5">
              {sorted(subjects).map((s, i) => (
                <BarRow
                  key={s._id}
                  label={s._id || "Unknown"}
                  count={s.count}
                  total={totalSubCount}
                  color={`hsl(${(i * 47) % 360}, 70%, 55%)`}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* ── GOALS + ROLES ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-1">Study Goals</p>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">What students are aiming for</h3>
            <div className="space-y-2.5">
              {sorted(goals).map((g, i) => (
                <BarRow
                  key={g._id}
                  label={goalLabel[g._id] || g._id || "Unknown"}
                  count={g.count}
                  total={totalGoalCount}
                  color={["#007AFF","#34C759","#FF9500","#AF52DE"][i % 4]}
                />
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[11px] mono uppercase tracking-widest text-gray-400 mb-1">All Users by Role</p>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">Students, parents, teachers, admins</h3>
            <div className="space-y-3">
              {roles.map(r => (
                <div key={r._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: roleColor[r._id] || "#8E8E93" }} />
                    <span className="text-[14px] text-gray-700 capitalize">{r._id || "unknown"}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-gray-800 mono">{fmt(r.count)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── RECENT SIGNUPS ── */}
        <section>
          <p className="text-[10px] mono uppercase tracking-[0.22em] text-gray-400 mb-1">Latest Activity</p>
          <h2 className="text-[17px] font-bold text-gray-800 mb-4">10 most recent student signups</h2>
          <Card className="!p-0 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">Name</th>
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">Email</th>
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">Plan</th>
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">Grade</th>
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">Subject</th>
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">AI Today</th>
                  <th className="text-left px-5 py-3 text-[10px] mono uppercase tracking-widest text-gray-400 font-normal">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-300">No students yet</td></tr>
                )}
                {recentSignups.map((u, i) => {
                  const today = new Date().toISOString().split("T")[0];
                  const aiToday = u.aiCallsDate === today ? u.aiCallsToday : 0;
                  return (
                    <tr key={u._id} className={`border-b border-black/[0.04] ${i % 2 === 0 ? "" : "bg-gray-50/60"} hover:bg-blue-50/40 transition-colors`}>
                      <td className="px-5 py-3 font-medium text-gray-800">{u.name || "—"}</td>
                      <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">{u.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            background: (planColors[u.plan] || "#8E8E93") + "18",
                            color:       planColors[u.plan] || "#8E8E93",
                          }}
                        >
                          {planLabel[u.plan] || u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{u.grade ? `Class ${u.grade}` : "—"}</td>
                      <td className="px-5 py-3 text-gray-500">{u.subject || "—"}</td>
                      <td className="px-5 py-3 mono text-gray-500">
                        {aiToday > 0
                          ? <span className="text-[#007AFF] font-semibold">{aiToday}</span>
                          : <span className="text-gray-300">0</span>
                        }
                      </td>
                      <td className="px-5 py-3 text-gray-400">{ago(u.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </section>

        <p className="text-center text-[11px] text-gray-300 mono pb-8">
          Stellar Company Dashboard · Auto-refreshes every 30s · Internal only
        </p>
      </main>
    </div>
  );
}
