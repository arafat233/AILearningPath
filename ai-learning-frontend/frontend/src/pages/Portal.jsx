import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { sgCreateAssignment, sgMyAssignments, sgAssignmentReport, sgGenerateWorksheet, sgTeacherContent, sgClassHeatmap } from "../services/api";

// Open the worksheet in a new tab as printable HTML (questions first, answer key on its own page)
function openPrintableWorksheet(ws) {
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const qHtml = ws.questions.map((q) => `
    <div class="q">
      <p><b>Q${q.number}.</b> ${esc(q.questionText)} <span class="diff">[${esc(q.difficulty)}]</span></p>
      <ol type="a">${q.options.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>
    </div>`).join("");
  const aHtml = ws.questions.map((q) => `<p><b>Q${q.number}.</b> ${esc(q.answer)}</p>`).join("");
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>Worksheet — ${esc(ws.topic)}</title>
    <style>
      body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#111}
      h1{font-size:1.4rem} .q{margin-bottom:1.1rem} ol{margin:.3rem 0 0 1.2rem}
      .diff{color:#888;font-size:.8rem} .key{page-break-before:always}
      @media print{.noprint{display:none}}
    </style></head><body>
    <button class="noprint" onclick="window.print()">🖨 Print</button>
    <h1>Worksheet — ${esc(ws.topic)}</h1>
    <p style="color:#666;font-size:.85rem">Name: ______________________ &nbsp;&nbsp; Date: ____________</p>
    ${qHtml}
    <div class="key"><h1>Answer Key — ${esc(ws.topic)}</h1>${aHtml}</div>
    </body></html>`);
  w.document.close();
}

function TeacherAssignments() {
  const [form, setForm] = useState({ classCode: "", topic: "", title: "", questionCount: 10, dueAt: "" });
  const [assignments, setAssignments] = useState([]);
  const [report, setReport] = useState(null); // { id, data }
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => sgMyAssignments().then(({ data }) => setAssignments(data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setMsg(null);
    setBusy(true);
    try {
      await sgCreateAssignment({
        classCode: form.classCode.trim(),
        topic: form.topic.trim(),
        ...(form.title.trim() && { title: form.title.trim() }),
        questionCount: Number(form.questionCount) || 10,
        dueAt: new Date(`${form.dueAt}T23:59:59`).toISOString(), // due end-of-day
      });
      setMsg({ ok: true, text: "Assignment created — students will see it in School Groups." });
      setForm({ classCode: form.classCode, topic: "", title: "", questionCount: 10, dueAt: "" });
      load();
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error || "Could not create assignment" });
    } finally {
      setBusy(false);
    }
  };

  const toggleReport = async (id) => {
    if (report?.id === id) return setReport(null);
    try {
      const { data } = await sgAssignmentReport(id);
      setReport({ id, data: data.data });
    } catch { /* ignore */ }
  };

  const canSubmit = form.classCode.trim() && form.topic.trim() && form.dueAt;

  return (
    <div className="card p-6 space-y-4">
      <div>
        <p className="text-[13px] font-semibold text-[var(--label)]">Assign practice to your class</p>
        <p className="text-[12px] text-apple-gray mt-0.5">
          Enter your class code, pick a topic and due date — questions are auto-selected. Completion is tracked automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input value={form.classCode} onChange={(e) => setForm({ ...form, classCode: e.target.value })}
          placeholder="Class code" className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
          placeholder="Topic (exact name)" className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title (optional)" className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        <input type="number" min="1" max="30" value={form.questionCount}
          onChange={(e) => setForm({ ...form, questionCount: e.target.value })}
          placeholder="Questions" className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        <input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
          className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none col-span-2" />
      </div>

      {msg && <p className={`text-[12px] font-medium ${msg.ok ? "text-[#34C759]" : "text-[#FF3B30]"}`}>{msg.text}</p>}

      <button onClick={handleCreate} disabled={!canSubmit || busy} className="btn-primary w-full disabled:opacity-40">
        {busy ? "Creating…" : "Create assignment"}
      </button>

      {assignments.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#F2F2F7]">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-apple-gray">Your assignments</p>
          {assignments.map((a) => (
            <div key={a.id}>
              <button onClick={() => toggleReport(a.id)} className="w-full flex items-center gap-2 text-left py-1.5">
                <p className="text-[13px] font-medium text-[var(--label)] flex-1 truncate">{a.title}</p>
                <span className="text-[11px] text-apple-gray shrink-0">
                  {a.total} Qs · due {new Date(a.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </button>
              {report?.id === a.id && (
                <div className="rounded-xl bg-[#F2F2F7] px-3 py-2 space-y-1 mb-1">
                  <p className="text-[11px] font-semibold text-apple-gray">
                    {report.data.completedCount}/{report.data.students.length} students completed
                  </p>
                  {report.data.students.map((s) => (
                    <div key={s.userId} className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--label)]">{s.name}</span>
                      <span className={s.completed ? "text-[#34C759] font-semibold" : "text-apple-gray"}>
                        {s.correct}/{s.total} correct{s.completed ? " ✓" : ` · ${s.attempted} tried`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeacherWorksheet() {
  const [form, setForm] = useState({ topic: "", questionCount: 10, difficulty: "" });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleGenerate = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const { data } = await sgGenerateWorksheet({
        topic: form.topic.trim(),
        questionCount: Number(form.questionCount) || 10,
        ...(form.difficulty && { difficulty: form.difficulty }),
      });
      openPrintableWorksheet(data.data);
    } catch (err) {
      setMsg(err.response?.data?.error || "Could not generate worksheet");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-6 space-y-3">
      <div>
        <p className="text-[13px] font-semibold text-[var(--label)]">Generate a worksheet</p>
        <p className="text-[12px] text-apple-gray mt-0.5">
          Pick a topic — get a printable worksheet with an answer key on a separate page.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
          placeholder="Topic (exact name)" className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none col-span-3" />
        <input type="number" min="1" max="30" value={form.questionCount}
          onChange={(e) => setForm({ ...form, questionCount: e.target.value })}
          className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none col-span-2">
          <option value="">Mixed difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      {msg && <p className="text-[12px] font-medium text-[#FF3B30]">{msg}</p>}
      <button onClick={handleGenerate} disabled={!form.topic.trim() || busy} className="btn-primary w-full disabled:opacity-40">
        {busy ? "Generating…" : "Generate worksheet"}
      </button>
    </div>
  );
}

function heatColor(v) {
  if (v === null || v === undefined) return "#E5E5EA"; // not attempted
  if (v >= 70) return "#34C759";
  if (v >= 40) return "#FF9500";
  return "#FF3B30";
}

function TeacherHeatmap() {
  const [classCode, setClassCode] = useState("");
  const [grid, setGrid] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const { data } = await sgClassHeatmap(classCode.trim());
      setGrid(data.data);
    } catch (err) {
      setGrid(null);
      setMsg(err.response?.data?.error || "Could not load heatmap");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-6 space-y-3">
      <div>
        <p className="text-[13px] font-semibold text-[var(--label)]">Class heatmap</p>
        <p className="text-[12px] text-apple-gray mt-0.5">
          Students × topics accuracy grid — spot who's weak where at a glance.
        </p>
      </div>
      <div className="flex gap-2">
        <input value={classCode} onChange={(e) => setClassCode(e.target.value)}
          placeholder="Class code" className="flex-1 px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        <button onClick={load} disabled={!classCode.trim() || busy} className="btn-primary px-4 disabled:opacity-40">
          {busy ? "…" : "Load"}
        </button>
      </div>
      {msg && <p className="text-[12px] font-medium text-[#FF3B30]">{msg}</p>}
      {grid && grid.topics.length === 0 && (
        <p className="text-[12px] text-apple-gray">No practice data in this class yet.</p>
      )}
      {grid && grid.topics.length > 0 && (
        <div className="overflow-x-auto">
          <table className="text-[11px]">
            <thead>
              <tr>
                <th className="text-left pr-2 font-semibold text-apple-gray">Student</th>
                {grid.topics.map((t) => (
                  <th key={t} className="px-0.5 font-normal">
                    <div className="w-6 h-16 flex items-end justify-center" title={t}>
                      <span className="text-apple-gray" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                        {t.length > 14 ? t.slice(0, 13) + "…" : t}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.rows.map((r) => (
                <tr key={r.userId}>
                  <td className="pr-2 py-0.5 font-medium text-[var(--label)] whitespace-nowrap">{r.name}</td>
                  {r.cells.map((v, i) => (
                    <td key={i} className="px-0.5 py-0.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: heatColor(v) }}
                        title={`${grid.topics[i]}: ${v === null ? "not attempted" : v + "%"}`}>
                        {v === null ? "" : v}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const DOC_KINDS = [
  ["class_summary", "Class summary"],
  ["remedial_plan", "Remedial plan"],
  ["parent_note",   "Parent note"],
];

function TeacherAIDocs() {
  const [form, setForm] = useState({ kind: "class_summary", classCode: "", studentName: "" });
  const [output, setOutput] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setMsg(null);
    setOutput("");
    setBusy(true);
    try {
      const { data } = await sgTeacherContent({
        kind: form.kind,
        classCode: form.classCode.trim(),
        ...(form.kind === "parent_note" && { studentName: form.studentName.trim() }),
      });
      setOutput(data.data.text);
    } catch (err) {
      setMsg(err.response?.data?.error || "Generation failed — try again");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const canSubmit = form.classCode.trim() && (form.kind !== "parent_note" || form.studentName.trim());

  return (
    <div className="card p-6 space-y-3">
      <div>
        <p className="text-[13px] font-semibold text-[var(--label)]">AI teacher tools</p>
        <p className="text-[12px] text-apple-gray mt-0.5">
          Generate a class summary, 2-week remedial plan, or a parent note from your class's real practice data.
        </p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {DOC_KINDS.map(([k, label]) => (
          <button key={k} onClick={() => setForm({ ...form, kind: k })}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
              form.kind === k ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "bg-white text-[#8E8E93] border-[#F2F2F7]"
            }`}>{label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={form.classCode} onChange={(e) => setForm({ ...form, classCode: e.target.value })}
          placeholder="Class code" className={`px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none ${form.kind === "parent_note" ? "" : "col-span-2"}`} />
        {form.kind === "parent_note" && (
          <input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })}
            placeholder="Student's exact name" className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] focus:outline-none" />
        )}
      </div>
      {msg && <p className="text-[12px] font-medium text-[#FF3B30]">{msg}</p>}
      <button onClick={handleGenerate} disabled={!canSubmit || busy} className="btn-primary w-full disabled:opacity-40">
        {busy ? "Generating…" : "Generate"}
      </button>
      {output && (
        <div className="space-y-2">
          <textarea readOnly value={output} rows={8}
            className="w-full px-3 py-2 rounded-xl bg-[#F2F2F7] text-[13px] leading-relaxed focus:outline-none resize-y" />
          <button onClick={handleCopy} className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E5EA] text-[12px] font-semibold text-[#3A3A3C]">
            {copied ? "Copied ✓" : "📋 Copy (paste into WhatsApp/email)"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Portal() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[var(--label)]">Parent / Teacher Access</h1>
        <p className="text-[13px] text-apple-gray mt-1">
          Parents and teachers can view any student's progress directly — no invite code needed.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent,#007AFF)]/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent,#007AFF)" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="5.5" cy="5" r="2.5"/><path d="M1 13.5a4.5 4.5 0 019 0"/>
              <circle cx="12" cy="6" r="2"/><path d="M10 13.5a3 3 0 016 0"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--label)]">Go to Parent Dashboard</p>
            <p className="text-[12px] text-apple-gray mt-0.5">
              Search for a student by name and instantly view their accuracy, streak, weekly practice, and more.
            </p>
          </div>
        </div>

        <button onClick={() => navigate("/parent")} className="btn-primary w-full">
          Open Parent Dashboard
        </button>
      </div>

      {(user?.role === "teacher" || user?.role === "admin") && (
        <>
          <TeacherAssignments />
          <TeacherWorksheet />
          <TeacherAIDocs />
          <TeacherHeatmap />
        </>
      )}

      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-apple-gray">
          <rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/>
        </svg>
        <p className="text-[11px] text-apple-gray">Read-only view · private chats and notes are never shared</p>
      </div>
    </div>
  );
}
