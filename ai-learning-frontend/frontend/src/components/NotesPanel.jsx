import { useEffect, useState, useCallback, useRef } from "react";
import * as api from "../services/api";

/**
 * NotesPanel — per-item notes & highlights (GAP #3).
 *
 * Props:
 *   item       { scope, kind, refId, trackKey?, subject?, title, url } — the source
 *   contentRef (optional) ref to the content container; enables select-to-highlight
 *              and paints saved highlights inline via the CSS Custom Highlight API
 *   sectionKey (optional) tags new highlights with the active content section
 *
 * Highlights never mutate the DOM React owns — they paint with CSS.highlights,
 * so they coexist safely with re-renders. Where the API is unsupported, the
 * highlight still appears in this panel and the Notebook, just not inline.
 */

const HL_SUPPORTED = typeof window !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined";

// Char offset of (node, offset) within container.textContent.
function charOffset(container, node, offset) {
  const r = document.createRange();
  r.selectNodeContents(container);
  try { r.setEnd(node, offset); } catch { return -1; }
  return r.toString().length;
}

// Build a DOM Range for `quote` inside container, using prefix/suffix to
// disambiguate repeats. Returns null if the text can't be found (content drifted).
function findRange(container, quote, prefix = "", suffix = "") {
  if (!container || !quote) return null;
  const full = container.textContent || "";
  let start = -1;
  const probe = prefix + quote + suffix;
  const pIdx = probe !== quote ? full.indexOf(probe) : -1;
  if (pIdx >= 0) start = pIdx + prefix.length;
  else start = full.indexOf(quote);
  if (start < 0) return null;
  const end = start + quote.length;

  // Map char offsets → (textNode, offset)
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let acc = 0, range = document.createRange(), setS = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = n.nodeValue.length;
    if (!setS && start <= acc + len) { range.setStart(n, start - acc); setS = true; }
    if (setS && end <= acc + len) { range.setEnd(n, end - acc); return range; }
    acc += len;
  }
  return null;
}

const COLORS = { yellow: "rgba(255,214,10,0.40)", green: "rgba(48,209,88,0.32)", blue: "rgba(10,132,255,0.28)", pink: "rgba(255,55,95,0.28)" };

export default function NotesPanel({ item, contentRef, sectionKey = "" }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [tagStr, setTagStr] = useState("");
  const [editId, setEditId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [sel, setSel] = useState(null); // {x, y, quote, prefix, suffix}
  const [err, setErr] = useState("");
  const rootRef = useRef(null);

  const load = useCallback(async () => {
    if (!item?.refId) return;
    setLoading(true);
    try {
      const { data } = await api.notesForItem(item.kind, item.refId);
      setNotes(data.data || []);
    } catch { /* unauth / offline — leave empty */ }
    finally { setLoading(false); }
  }, [item?.kind, item?.refId]);

  useEffect(() => { load(); }, [load]);

  // ── Paint saved highlights inline via CSS Custom Highlight API ──
  useEffect(() => {
    if (!HL_SUPPORTED || !contentRef?.current) return;
    const container = contentRef.current;
    const hls = notes.filter((n) => n.type === "highlight");
    if (!hls.length) { CSS.highlights.delete("stellar-note"); return; }
    const t = setTimeout(() => {
      const ranges = [];
      for (const h of hls) {
        const rg = findRange(container, h.quote, h.prefix, h.suffix);
        if (rg) ranges.push(rg);
      }
      if (ranges.length) CSS.highlights.set("stellar-note", new Highlight(...ranges));
      else CSS.highlights.delete("stellar-note");
    }, 60); // let content render first
    return () => { clearTimeout(t); CSS.highlights.delete("stellar-note"); };
  }, [notes, contentRef]);

  // ── Capture text selection inside the content container ──
  useEffect(() => {
    const container = contentRef?.current;
    if (!container) return;
    const onUp = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed || s.rangeCount === 0) { setSel(null); return; }
      const range = s.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) { setSel(null); return; }
      const quote = s.toString().trim();
      if (quote.length < 2 || quote.length > 2000) { setSel(null); return; }
      const full = container.textContent || "";
      const start = charOffset(container, range.startContainer, range.startOffset);
      const end = start + quote.length;
      const rect = range.getBoundingClientRect();
      setSel({
        x: rect.left + rect.width / 2, y: rect.top,
        quote,
        prefix: start > 0 ? full.slice(Math.max(0, start - 40), start) : "",
        suffix: full.slice(end, end + 40),
      });
    };
    container.addEventListener("mouseup", onUp);
    return () => container.removeEventListener("mouseup", onUp);
  }, [contentRef]);

  const ctx = () => ({
    scope: item.scope, kind: item.kind, refId: item.refId,
    trackKey: item.trackKey ?? null, subject: item.subject || "",
    title: item.title || "", url: item.url || "",
  });
  const parseTags = (s) => s.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);

  const addNote = async () => {
    if (!draft.trim()) return;
    setErr("");
    try {
      const { data } = await api.notesCreate({ ...ctx(), type: "note", body: draft.trim(), tags: parseTags(tagStr) });
      setNotes((n) => [...n, data.data]); setDraft(""); setTagStr("");
    } catch (e) { setErr(e?.response?.data?.error || "Could not save the note."); }
  };

  const addHighlight = async (color = "yellow") => {
    if (!sel) return;
    try {
      const { data } = await api.notesCreate({ ...ctx(), type: "highlight", quote: sel.quote, prefix: sel.prefix, suffix: sel.suffix, sectionKey, color });
      setNotes((n) => [...n, data.data]);
      setSel(null); window.getSelection()?.removeAllRanges();
    } catch (e) { setErr(e?.response?.data?.error || "Could not save the highlight."); }
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await api.notesUpdate(id, { body: editBody });
      setNotes((n) => n.map((x) => (x._id === id ? data.data : x))); setEditId(null);
    } catch (e) { setErr(e?.response?.data?.error || "Could not update."); }
  };
  const togglePin = async (n) => {
    try { const { data } = await api.notesUpdate(n._id, { pinned: !n.pinned }); setNotes((p) => p.map((x) => (x._id === n._id ? data.data : x))); } catch { /* noop */ }
  };
  const del = async (id) => {
    try { await api.notesDelete(id); setNotes((n) => n.filter((x) => x._id !== id)); CSS.highlights?.delete?.("stellar-note"); } catch { /* noop */ }
  };

  const noteItems = notes.filter((n) => n.type === "note");
  const hlItems = notes.filter((n) => n.type === "highlight");

  return (
    <div ref={rootRef} className="card p-4">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">My notes & highlights</p>
        <span className="text-[11px] text-apple-gray3">{notes.length || ""}</span>
      </div>

      {/* Composer */}
      <textarea
        value={draft} onChange={(e) => setDraft(e.target.value)}
        placeholder="Write a note… (markdown ok)"
        className="w-full text-[13px] rounded-lg border border-apple-gray5 bg-transparent p-2.5 outline-none focus:border-apple-blue resize-y min-h-[64px] text-[var(--label)]"
      />
      <div className="flex items-center gap-2 mt-2">
        <input
          value={tagStr} onChange={(e) => setTagStr(e.target.value)}
          placeholder="tags, comma separated"
          className="flex-1 text-[12px] rounded-lg border border-apple-gray5 bg-transparent px-2.5 py-1.5 outline-none focus:border-apple-blue text-[var(--label)]"
        />
        <button onClick={addNote} disabled={!draft.trim()}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-apple-blue text-white disabled:opacity-40">Add note</button>
      </div>
      {err && <p className="text-[11px] text-apple-red mt-1.5">{err}</p>}
      {contentRef && (
        <p className="text-[11px] text-apple-gray3 mt-2">
          {HL_SUPPORTED ? "Tip: select any text above to highlight it." : "Select text above to save it as a highlight."}
        </p>
      )}

      {/* Notes */}
      {!loading && noteItems.length > 0 && (
        <ul className="mt-3 space-y-2">
          {noteItems.map((n) => (
            <li key={n._id} className="rounded-lg border border-apple-gray5 p-2.5">
              {editId === n._id ? (
                <>
                  <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)}
                    className="w-full text-[13px] rounded border border-apple-gray5 bg-transparent p-2 outline-none resize-y min-h-[56px] text-[var(--label)]" />
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={() => saveEdit(n._id)} className="text-[11px] font-semibold text-apple-blue">Save</button>
                    <button onClick={() => setEditId(null)} className="text-[11px] text-apple-gray">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[13px] text-[var(--label)] whitespace-pre-wrap leading-relaxed">{n.body}</p>
                  {n.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {n.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">#{t}</span>)}
                    </div>
                  )}
                  <div className="flex gap-3 mt-1.5 text-[11px]">
                    <button onClick={() => togglePin(n)} className={n.pinned ? "text-apple-orange font-semibold" : "text-apple-gray"}>{n.pinned ? "★ Pinned" : "☆ Pin"}</button>
                    <button onClick={() => { setEditId(n._id); setEditBody(n.body); }} className="text-apple-gray hover:text-apple-blue">Edit</button>
                    <button onClick={() => del(n._id)} className="text-apple-gray hover:text-apple-red">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Highlights */}
      {!loading && hlItems.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1.5">Highlights</p>
          <ul className="space-y-1.5">
            {hlItems.map((h) => (
              <li key={h._id} className="flex items-start gap-2 group">
                <span className="mt-1 w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[h.color] || COLORS.yellow }} />
                <p className="text-[12px] text-[var(--label)] leading-snug flex-1">“{h.quote}”</p>
                <button onClick={() => del(h._id)} className="text-[11px] text-apple-gray hover:text-apple-red opacity-0 group-hover:opacity-100">✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Floating highlight button when text is selected */}
      {sel && (
        <div className="fixed z-50 -translate-x-1/2 -translate-y-full" style={{ left: sel.x, top: sel.y - 6 }}>
          <div className="flex items-center gap-1 rounded-full bg-[var(--label)] text-[var(--bg)] shadow-lg px-1.5 py-1">
            <button onClick={() => addHighlight("yellow")} className="text-[12px] font-semibold px-2 py-0.5">✏️ Highlight</button>
            {["yellow", "green", "blue", "pink"].map((cl) => (
              <button key={cl} onClick={() => addHighlight(cl)} title={cl}
                className="w-4 h-4 rounded-full border border-white/30" style={{ background: COLORS[cl] }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
