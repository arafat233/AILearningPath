import { useState, useMemo } from "react";
import IDIOMS from "../data/javaIdioms";

const CATEGORIES = [...new Set(IDIOMS.map((i) => i.category))];

export default function Idioms() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [copied, setCopied] = useState(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return IDIOMS.filter((i) => {
      if (cat && i.category !== cat) return false;
      if (!needle) return true;
      return (
        i.title.toLowerCase().includes(needle) ||
        i.explanation.toLowerCase().includes(needle) ||
        i.code.toLowerCase().includes(needle) ||
        (i.tags || []).some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [q, cat]);

  const copy = (id, code) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200);
    });
  };

  return (
    <div className="space-y-5 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--label)]">Java Idioms</h1>
        <p className="text-[14px] text-apple-gray mt-1">{IDIOMS.length} interview-ready code-tricks & gotchas — copy and go.</p>
      </div>

      <div className="card p-4 space-y-3">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search idioms… (e.g. heap, overflow, anagram)"
          className="w-full text-[14px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-2 outline-none focus:border-apple-blue text-[var(--label)]"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(cat === c ? "" : c)}
              className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${cat === c ? "bg-apple-blue text-white border-apple-blue" : "border-apple-gray5 text-apple-gray hover:border-apple-blue"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[15px] font-semibold text-[var(--label)]">No idioms match</p>
          <p className="text-[13px] text-apple-gray mt-1">Try a different keyword or clear the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {results.map((i) => (
            <div key={i.id} className="card p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--label)] leading-snug">{i.title}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-apple-gray">{i.category}</span>
                </div>
                <button onClick={() => copy(i.id, i.code)}
                  className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20 transition-colors">
                  {copied === i.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <pre className="text-[12px] leading-[1.55] rounded-lg bg-[#1e1e1e] text-[#d4d4d4] p-3 overflow-x-auto"><code>{i.code}</code></pre>
              <p className="text-[13px] text-[var(--label)] leading-relaxed mt-2.5">{i.explanation}</p>
              <p className="text-[12px] text-apple-gray mt-1.5"><span className="font-semibold">When:</span> {i.whenToUse}</p>
              {i.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {i.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">#{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
