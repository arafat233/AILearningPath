import { useEffect, useState } from "react";
import { adminGetCertificates } from "../../services/api";

const GRADE_MAP = (acc) =>
  acc >= 91 ? "A1" : acc >= 81 ? "A2" : acc >= 71 ? "B1" : acc >= 61 ? "B2" : acc >= 51 ? "C1" : "C2";

const GRADE_COLOR = { A1: "text-emerald-600 bg-emerald-50", A2: "text-emerald-500 bg-emerald-50",
  B1: "text-blue-600 bg-blue-50", B2: "text-blue-500 bg-blue-50",
  C1: "text-amber-600 bg-amber-50", C2: "text-red-500 bg-red-50" };

export default function AdminCertificates() {
  const [rows,    setRows]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [minAcc,  setMinAcc]  = useState(0);
  const [minAtt,  setMinAtt]  = useState(1);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    adminGetCertificates({ page, limit, minAccuracy: minAcc, minAttempts: minAtt })
      .then((r) => { setRows(r.data.data.results); setTotal(r.data.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, minAcc, minAtt]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--label)]">Certificates</h1>
          <p className="text-[13px] text-apple-gray mt-0.5">{total} student{total !== 1 ? "s" : ""} have earned a certificate</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <label className="text-[12px] text-apple-gray">Min accuracy %</label>
          <select
            value={minAcc}
            onChange={(e) => { setMinAcc(Number(e.target.value)); setPage(1); }}
            className="text-[13px] border border-apple-gray5 rounded-apple px-2 py-1.5 bg-white"
          >
            {[0, 50, 60, 70, 80, 90].map((v) => <option key={v} value={v}>{v === 0 ? "Any" : `≥${v}%`}</option>)}
          </select>
          <label className="text-[12px] text-apple-gray">Min attempts</label>
          <select
            value={minAtt}
            onChange={(e) => { setMinAtt(Number(e.target.value)); setPage(1); }}
            className="text-[13px] border border-apple-gray5 rounded-apple px-2 py-1.5 bg-white"
          >
            {[1, 10, 25, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-[13px] text-apple-gray">No certificates match the current filters.</div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-apple-gray5 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-apple-gray6 border-b border-apple-gray5">
                <tr>
                  {["Student", "Grade", "Plan", "Accuracy", "Attempts", "Topics Mastered", "Strong Areas", "Profile"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-semibold text-[var(--label2)] text-[11px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-gray5">
                {rows.map((r) => {
                  const grade = GRADE_MAP(r.accuracy);
                  return (
                    <tr key={r.userId} className="hover:bg-apple-gray6 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--label)]">{r.user?.name || "—"}</p>
                        <p className="text-[11px] text-apple-gray">{r.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-apple-gray">{r.user?.grade ? `Class ${r.user.grade}` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${r.user?.isPaid ? "bg-emerald-50 text-emerald-700" : "bg-apple-gray5 text-apple-gray"}`}>
                          {r.user?.plan || "free"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${GRADE_COLOR[grade] || ""}`}>
                          {grade} · {r.accuracy}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--label2)]">{r.totalAttempts.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[var(--label2)]">{r.topicsMastered}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.strongAreas.length > 0
                            ? r.strongAreas.map((a) => (
                                <span key={a} className="px-1.5 py-0.5 rounded bg-apple-gray6 text-[10px] text-[var(--label2)]">{a}</span>
                              ))
                            : <span className="text-apple-gray">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--label2)]">{r.thinkingProfile || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-apple-gray">Page {page} of {pages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="btn-secondary px-3 py-1.5 disabled:opacity-40">← Prev</button>
                <button disabled={page === pages} onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary px-3 py-1.5 disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
