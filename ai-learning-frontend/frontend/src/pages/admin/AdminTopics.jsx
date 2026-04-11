import { useEffect, useState } from "react";
import { adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic } from "../../services/api";

const BLANK = { name: "", subject: "Math", grade: "10", examFrequency: 0.5, estimatedHours: 2, examMarks: 5 };

export default function AdminTopics() {
  const [topics, setTopics]   = useState([]);
  const [editing, setEditing] = useState(null); // null | topic object | "new"
  const [form, setForm]       = useState(BLANK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminGetTopics().then((r) => setTopics(r.data)).catch(() => {});
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      if (editing === "new") {
        const { data } = await adminCreateTopic(form);
        setTopics((t) => [...t, data]);
      } else {
        const { data } = await adminUpdateTopic(editing._id, form);
        setTopics((t) => t.map((x) => x._id === data._id ? data : x));
      }
      setEditing(null);
    } catch (err) { alert(err.response?.data?.error || "Save failed"); }
    finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this topic?")) return;
    await adminDeleteTopic(id).catch(() => {});
    setTopics((t) => t.filter((x) => x._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">Topics ({topics.length})</h1>
        <button onClick={() => { setEditing("new"); setForm(BLANK); }} className="btn-primary">+ Add Topic</button>
      </div>

      {editing && (
        <div className="card p-5 space-y-3">
          <h2 className="text-[15px] font-semibold text-[var(--label)]">{editing === "new" ? "New Topic" : "Edit Topic"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[["name","Name"],["subject","Subject"],["grade","Grade"]].map(([k, label]) => (
              <div key={k}>
                <label className="text-[12px] text-apple-gray">{label}</label>
                <input className="input w-full mt-1" value={form[k] || ""} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            {[["examFrequency","Exam Frequency (0-1)"],["estimatedHours","Est. Hours"],["examMarks","Exam Marks"]].map(([k, label]) => (
              <div key={k}>
                <label className="text-[12px] text-apple-gray">{label}</label>
                <input type="number" step="0.1" className="input w-full mt-1" value={form[k] || ""} onChange={(e) => setForm((f) => ({ ...f, [k]: parseFloat(e.target.value) || 0 }))} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={loading || !form.name} className="btn-primary">{loading ? "Saving…" : "Save"}</button>
            <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-apple-gray6 border-b border-apple-gray5">
            <tr>
              {["Name", "Subject", "Grade", "Exam Freq", "Marks", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--label2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray5">
            {topics.map((t) => (
              <tr key={t._id} className="hover:bg-apple-gray6/50">
                <td className="px-4 py-3 font-medium text-[var(--label)]">{t.name}</td>
                <td className="px-4 py-3 text-apple-gray">{t.subject}</td>
                <td className="px-4 py-3 text-apple-gray">{t.grade}</td>
                <td className="px-4 py-3 text-apple-gray">{t.examFrequency}</td>
                <td className="px-4 py-3 text-apple-gray">{t.examMarks}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => { setEditing(t); setForm(t); }} className="text-[12px] text-apple-blue hover:underline">Edit</button>
                    <button onClick={() => del(t._id)} className="text-[12px] text-apple-red hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
