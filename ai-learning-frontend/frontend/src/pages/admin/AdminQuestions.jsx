import { useEffect, useState } from "react";
import { adminGetQuestions, adminGetFlagged, adminDeleteQuestion, adminUnflagQuestion } from "../../services/api";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [filter, setFilter]       = useState({ topic: "", subject: "", flagged: false });
  const [loading, setLoading]     = useState(false);
  const [tab, setTab]             = useState("all"); // all | flagged

  const load = (p = 1) => {
    setLoading(true);
    const fn = tab === "flagged" ? adminGetFlagged : adminGetQuestions;
    const params = tab === "flagged" ? {} : { page: p, limit: 20, ...filter };
    fn(params)
      .then((r) => {
        if (tab === "flagged") { setQuestions(r.data); setTotal(r.data.length); }
        else                   { setQuestions(r.data.questions); setTotal(r.data.total); }
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [tab]);

  const del = async (id) => {
    if (!confirm("Delete this question permanently?")) return;
    await adminDeleteQuestion(id).catch(() => {});
    setQuestions((q) => q.filter((x) => x._id !== id));
    setTotal((t) => t - 1);
  };

  const unflag = async (id) => {
    await adminUnflagQuestion(id).catch(() => {});
    setQuestions((q) => q.map((x) => x._id === id ? { ...x, isFlagged: false } : x));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">Questions ({total})</h1>
        <div className="flex gap-2">
          {["all", "flagged"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-[13px] px-3 py-1.5 rounded-full font-medium capitalize ${
                tab === t ? "bg-apple-blue text-white" : "bg-apple-gray6 text-[var(--label2)]"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "all" && (
        <div className="flex gap-3">
          <input className="input max-w-[200px]" placeholder="Topic filter…" value={filter.topic}
            onChange={(e) => setFilter((f) => ({ ...f, topic: e.target.value }))} />
          <select className="input max-w-[180px]" value={filter.subject}
            onChange={(e) => setFilter((f) => ({ ...f, subject: e.target.value }))}>
            <option value="">All subjects</option>
            {["Math","Science","English","Social Science","Hindi"].map((s) =>
              <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => load(1)} className="btn-primary">Filter</button>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-apple-gray6 border-b border-apple-gray5">
            <tr>
              {["Question", "Topic", "Type", "Difficulty", "AI?", "Flagged?", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-apple-gray text-center">Loading…</td></tr>
            ) : questions.map((q) => (
              <tr key={q._id} className="hover:bg-apple-gray6/50">
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-[var(--label)] truncate">{q.questionText?.slice(0, 80)}…</p>
                </td>
                <td className="px-4 py-3 text-apple-gray">{q.topic}</td>
                <td className="px-4 py-3 text-apple-gray">{q.questionType}</td>
                <td className="px-4 py-3 text-apple-gray">{q.difficulty}</td>
                <td className="px-4 py-3">{q.isAIGenerated ? <span className="text-apple-blue text-[11px]">AI</span> : "—"}</td>
                <td className="px-4 py-3">{q.isFlagged ? <span className="text-apple-red text-[11px]">Flagged</span> : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {q.isFlagged && (
                      <button onClick={() => unflag(q._id)} className="text-[11px] text-apple-blue hover:underline">Unflag</button>
                    )}
                    <button onClick={() => del(q._id)} className="text-[11px] text-apple-red hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tab === "all" && total > 20 && (
        <div className="flex gap-2">
          <button onClick={() => load(page - 1)} disabled={page <= 1} className="btn-ghost text-[13px]">← Prev</button>
          <span className="text-[13px] text-apple-gray py-2">Page {page} of {Math.ceil(total / 20)}</span>
          <button onClick={() => load(page + 1)} disabled={page >= Math.ceil(total / 20)} className="btn-ghost text-[13px]">Next →</button>
        </div>
      )}
    </div>
  );
}
