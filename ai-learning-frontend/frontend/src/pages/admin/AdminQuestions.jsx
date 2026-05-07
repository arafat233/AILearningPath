import { useEffect, useState } from "react";
import {
  adminGetQuestions, adminGetFlagged,
  adminCreateQuestion, adminUpdateQuestion,
  adminDeleteQuestion, adminUnflagQuestion,
} from "../../services/api";

const BLANK_Q = {
  questionText: "", topic: "", subject: "Math", grade: "10",
  difficulty: "medium", questionType: "mcq", marks: 1, solutionSteps: "",
};
const BLANK_OPTS = [
  { text: "", isCorrect: true  },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [filter,    setFilter]    = useState({ topic: "", subject: "" });
  const [loading,   setLoading]   = useState(false);
  const [tab,       setTab]       = useState("all");

  // Create / edit form
  const [editing,  setEditing]  = useState(null); // null | "new" | question
  const [qForm,    setQForm]    = useState(BLANK_Q);
  const [opts,     setOpts]     = useState(BLANK_OPTS);
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState("");

  const load = (p = 1) => {
    setLoading(true);
    const fn     = tab === "flagged" ? adminGetFlagged : adminGetQuestions;
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

  const openNew = () => {
    setQForm(BLANK_Q);
    setOpts(BLANK_OPTS.map((o) => ({ ...o })));
    setEditing("new");
    setFormErr("");
  };

  const openEdit = (q) => {
    setQForm({
      questionText: q.questionText || "",
      topic:        q.topic        || "",
      subject:      q.subject      || "Math",
      grade:        q.grade        || "10",
      difficulty:   q.difficulty   || "medium",
      questionType: q.questionType || "mcq",
      marks:        q.marks        ?? 1,
      solutionSteps: (q.solutionSteps || []).join("\n"),
    });
    // Rebuild options: 4 slots, mark first "correct" type as correct
    const existing = q.options || [];
    const mapped = Array.from({ length: 4 }, (_, i) => ({
      text:      existing[i]?.text || "",
      isCorrect: existing[i]?.type === "correct",
    }));
    // ensure exactly one correct
    if (!mapped.some((o) => o.isCorrect) && mapped.length > 0) mapped[0].isCorrect = true;
    setOpts(mapped);
    setEditing(q);
    setFormErr("");
  };

  const markCorrect = (idx) =>
    setOpts((prev) => prev.map((o, i) => ({ ...o, isCorrect: i === idx })));

  const setOptText = (idx, text) =>
    setOpts((prev) => prev.map((o, i) => i === idx ? { ...o, text } : o));

  const save = async () => {
    if (!qForm.questionText.trim()) return setFormErr("Question text is required.");
    if (!qForm.topic.trim())        return setFormErr("Topic is required.");
    if (!opts.some((o) => o.isCorrect)) return setFormErr("Mark one option as correct.");
    setSaving(true);
    setFormErr("");
    try {
      const payload = {
        ...qForm,
        solutionSteps: qForm.solutionSteps.trim()
          ? qForm.solutionSteps.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        options: opts.map((o) => ({
          text: o.text,
          type: o.isCorrect ? "correct" : "concept_error",
        })),
      };
      if (editing === "new") {
        const { data } = await adminCreateQuestion(payload);
        setQuestions((prev) => [data, ...prev]);
        setTotal((t) => t + 1);
      } else {
        const { data } = await adminUpdateQuestion(editing._id, payload);
        setQuestions((prev) => prev.map((x) => x._id === data._id ? data : x));
      }
      setEditing(null);
    } catch (e) {
      setFormErr(e.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
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
          <button onClick={openNew} className="btn-primary ml-2">+ New Question</button>
        </div>
      </div>

      {/* Create / Edit form */}
      {editing && (
        <div className="card p-5 space-y-4 border border-apple-blue/20">
          <h2 className="text-[15px] font-semibold text-[var(--label)]">
            {editing === "new" ? "New Question" : "Edit Question"}
          </h2>

          {formErr && <p className="text-apple-red text-[13px]">{formErr}</p>}

          <div>
            <label className="text-[12px] text-apple-gray">Question Text *</label>
            <textarea rows={3} className="input w-full mt-1 resize-none" placeholder="Enter the question…"
              value={qForm.questionText}
              onChange={(e) => setQForm((f) => ({ ...f, questionText: e.target.value }))} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] text-apple-gray">Topic *</label>
              <input className="input w-full mt-1" placeholder="e.g. Quadratic Equations"
                value={qForm.topic} onChange={(e) => setQForm((f) => ({ ...f, topic: e.target.value }))} />
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Subject</label>
              <select className="input w-full mt-1" value={qForm.subject}
                onChange={(e) => setQForm((f) => ({ ...f, subject: e.target.value }))}>
                {["Math","Science","English","Social Science","Hindi"].map((s) =>
                  <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Grade</label>
              <select className="input w-full mt-1" value={qForm.grade}
                onChange={(e) => setQForm((f) => ({ ...f, grade: e.target.value }))}>
                {["8","9","10","11","12"].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Difficulty</label>
              <select className="input w-full mt-1" value={qForm.difficulty}
                onChange={(e) => setQForm((f) => ({ ...f, difficulty: e.target.value }))}>
                {["easy","medium","hard"].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Type</label>
              <select className="input w-full mt-1" value={qForm.questionType}
                onChange={(e) => setQForm((f) => ({ ...f, questionType: e.target.value }))}>
                {["mcq","case_based","assertion_reason","pyq"].map((t) =>
                  <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-apple-gray">Marks</label>
              <input type="number" min={0} className="input w-full mt-1" value={qForm.marks}
                onChange={(e) => setQForm((f) => ({ ...f, marks: Number(e.target.value) }))} />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-apple-gray mb-2 block">
              Options — click the radio to mark the correct answer
            </label>
            <div className="space-y-2">
              {opts.map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input type="radio" name="correct" checked={o.isCorrect}
                    onChange={() => markCorrect(i)}
                    className="accent-apple-green w-4 h-4 shrink-0" />
                  <span className="text-[12px] font-semibold text-apple-gray w-5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input className="input flex-1" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={o.text} onChange={(e) => setOptText(i, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] text-apple-gray">Solution Steps (one per line, optional)</label>
            <textarea rows={3} className="input w-full mt-1 resize-none text-[12px]"
              placeholder={"Step 1: …\nStep 2: …"}
              value={qForm.solutionSteps}
              onChange={(e) => setQForm((f) => ({ ...f, solutionSteps: e.target.value }))} />
          </div>

          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save Question"}
            </button>
            <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

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
                    <button onClick={() => openEdit(q)} className="text-[11px] text-apple-blue hover:underline">Edit</button>
                    {q.isFlagged && (
                      <button onClick={() => unflag(q._id)} className="text-[11px] text-apple-orange hover:underline">Unflag</button>
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
