import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as api from "../services/api";

const COLORS = { yellow: "rgba(255,214,10,0.40)", green: "rgba(48,209,88,0.32)", blue: "rgba(10,132,255,0.28)", pink: "rgba(255,55,95,0.28)" };
const KIND_LABEL = { exercise: "Exercise", topic: "Topic", lesson: "Lesson", question: "Question", project: "Project" };

export default function Notebook() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState("");
  const [type, setType] = useState("");
  const [tag, setTag] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (q.trim()) params.q = q.trim();
      if (scope) params.scope = scope;
      if (type) params.type = type;
      if (tag) params.tag = tag;
      const [nb, st] = await Promise.all([api.notesNotebook(params), api.notesStats()]);
      setItems(nb.data.data.items || []);
      setStats(st.data.data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [q, scope, type, tag]);

  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  useEffect(() => { api.notesTags().then(({ data }) => setTags(data.data || [])).catch(() => {}); }, []);

  const del = async (id) => {
    try { await api.notesDelete(id); setItems((n) => n.filter((x) => x._id !== id)); } catch { /* noop */ }
  };

  const Filter = ({ value, set, opts }) => (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((o) => (
        <button key={o.v} onClick={() => set(value === o.v ? "" : o.v)}
          className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${value === o.v ? "bg-apple-blue text-white border-apple-blue" : "border-apple-gray5 text-apple-gray hover:border-apple-blue"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-5 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--label)]">Notebook</h1>
        <p className="text-[14px] text-apple-gray mt-1">
          {stats ? `${stats.notes} notes · ${stats.highlights} highlights${stats.pinned ? ` · ${stats.pinned} pinned` : ""}` : "Your saved notes & highlights, searchable."}
        </p>
      </div>

      {/* Search + filters */}
      <div className="card p-4 space-y-3">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search your notes & highlights…"
          className="w-full text-[14px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-2 outline-none focus:border-apple-blue text-[var(--label)]"
        />
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Filter value={scope} set={setScope} opts={[{ v: "pro", label: "Pro" }, { v: "k12", label: "K-12" }]} />
          <Filter value={type} set={setType} opts={[{ v: "note", label: "Notes" }, { v: "highlight", label: "Highlights" }]} />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.slice(0, 24).map((t) => (
              <button key={t} onClick={() => setTag(tag === t ? "" : t)}
                className={`text-[11px] px-2 py-0.5 rounded-full ${tag === t ? "bg-apple-blue text-white" : "bg-apple-blue/10 text-apple-blue"}`}>#{t}</button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-[13px] text-apple-gray">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[15px] font-semibold text-[var(--label)]">Nothing here yet</p>
          <p className="text-[13px] text-apple-gray mt-1">Write a note or highlight text on any lesson or exercise — it shows up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map((n) => (
            <div key={n._id} className="card p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray">
                  {n.type === "highlight" ? "Highlight" : "Note"}
                </span>
                <span className="text-[10px] text-apple-gray3">{KIND_LABEL[n.kind] || n.kind}{n.subject ? ` · ${n.subject}` : ""}{n.trackKey ? " · Pro" : ""}</span>
                {n.pinned && <span className="text-[10px] text-apple-orange ml-auto">★</span>}
              </div>

              {n.title && <p className="text-[13px] font-semibold text-[var(--label)] leading-snug mb-1">{n.title}</p>}

              {n.type === "highlight" ? (
                <p className="text-[13px] text-[var(--label)] leading-relaxed border-l-2 pl-2.5"
                  style={{ borderColor: COLORS[n.color] || COLORS.yellow }}>“{n.quote}”</p>
              ) : (
                <p className="text-[13px] text-[var(--label)] leading-relaxed whitespace-pre-wrap line-clamp-6">{n.body}</p>
              )}
              {n.type === "highlight" && n.body && (
                <p className="text-[12px] text-apple-gray mt-1.5 whitespace-pre-wrap">{n.body}</p>
              )}

              {n.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {n.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">#{t}</span>)}
                </div>
              )}

              <div className="flex items-center gap-3 mt-auto pt-2.5 text-[11px]">
                {n.url && <Link to={n.url} className="text-apple-blue font-semibold hover:opacity-70">Open source →</Link>}
                <button onClick={() => del(n._id)} className="text-apple-gray hover:text-apple-red ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
