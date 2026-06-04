import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { communityList, communityCreate, communityUpvote } from "../services/api";

const KINDS = [
  { key: "", label: "All" },
  { key: "article", label: "Articles" },
  { key: "question", label: "Questions" },
];

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Composer({ onCreated, onClose }) {
  const [kind, setKind] = useState("question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!title.trim() || !body.trim()) { setErr("Title and body are required."); return; }
    setBusy(true); setErr("");
    try {
      const r = await communityCreate({
        kind, title: title.trim(), body: body.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onCreated(r.data.data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Could not post.");
    } finally { setBusy(false); }
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-[var(--label)]">New post</p>
        <button onClick={onClose} className="text-[12px] text-apple-gray hover:text-apple-blue">Cancel</button>
      </div>
      <div className="flex gap-1.5">
        {[["question", "Question"], ["article", "Article"]].map(([k, l]) => (
          <button key={k} onClick={() => setKind(k)}
            className={`text-[12px] px-3 py-1 rounded-full border transition-colors ${kind === k ? "bg-apple-blue text-white border-apple-blue" : "border-apple-gray5 text-apple-gray hover:border-apple-blue"}`}>
            {l}
          </button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
        placeholder={kind === "article" ? "Article title" : "Your question, in one line"}
        className="w-full text-[14px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-2 outline-none focus:border-apple-blue text-[var(--label)]" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={kind === "article" ? 8 : 4} maxLength={20000}
        placeholder={kind === "article" ? "Write your article (markdown supported)…" : "Add details…"}
        className="w-full text-[14px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-2 outline-none focus:border-apple-blue text-[var(--label)] resize-y" />
      <input value={tags} onChange={(e) => setTags(e.target.value)}
        placeholder="tags, comma, separated (max 8)"
        className="w-full text-[13px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-2 outline-none focus:border-apple-blue text-[var(--label)]" />
      {err && <p className="text-[12px] text-apple-red">{err}</p>}
      <button onClick={submit} disabled={busy}
        className="px-4 py-2 rounded-lg bg-apple-blue text-white text-[13px] font-semibold hover:bg-apple-blue/90 transition-colors disabled:opacity-60">
        {busy ? "Posting…" : "Post"}
      </button>
    </div>
  );
}

function PostCard({ p, onUpvote, onOpen }) {
  return (
    <div className="card p-4 flex gap-3 hover:border-apple-blue transition-colors cursor-pointer" onClick={() => onOpen(p.id)}>
      <button
        onClick={(e) => { e.stopPropagation(); onUpvote(p.id); }}
        className={`shrink-0 flex flex-col items-center justify-start w-11 rounded-lg py-1.5 transition-colors ${p.upvotedByMe ? "bg-apple-blue/10 text-apple-blue" : "bg-[var(--fill)] text-apple-gray hover:text-apple-blue"}`}
        title="Upvote">
        <span className="text-[14px] leading-none">▲</span>
        <span className="text-[13px] font-bold tabular-nums mt-0.5">{p.upvotes}</span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${p.kind === "article" ? "bg-apple-purple/15 text-apple-purple" : "bg-apple-green/15 text-apple-green"}`}>
            {p.kind}
          </span>
          {p.pinned && <span className="text-[10px] font-bold uppercase tracking-wider text-apple-orange">📌 pinned</span>}
        </div>
        <p className="text-[15px] font-semibold text-[var(--label)] leading-snug truncate">{p.title}</p>
        <p className="text-[13px] text-apple-gray mt-1 line-clamp-2">{p.excerpt}</p>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-apple-gray">
          <span className="font-medium">{p.authorName}</span>
          <span>· {timeAgo(p.createdAt)}</span>
          <span>· 💬 {p.commentCount}</span>
          <span>· 👁 {p.views}</span>
          {(p.tags || []).slice(0, 4).map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const [kind, setKind] = useState("");
  const [sort, setSort] = useState("new");
  const [q, setQ] = useState("");
  const [items, setItems] = useState(null);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (reset = true) => {
    try {
      const nextSkip = reset ? 0 : skip + 20;
      const r = await communityList({ kind: kind || undefined, sort, q: q || undefined, limit: 20, skip: nextSkip });
      const data = r.data.data;
      setTotal(data.total);
      setSkip(nextSkip);
      setItems((prev) => (reset ? data.items : [...(prev || []), ...data.items]));
    } catch (e) {
      setError(e?.response?.data?.error || "Could not load the feed.");
    }
  }, [kind, sort, q, skip]);

  // Reload whenever filters change.
  useEffect(() => { load(true); /* eslint-disable-next-line */ }, [kind, sort]);

  const upvote = async (id) => {
    try {
      const r = await communityUpvote(id);
      setItems((prev) => prev.map((p) => p.id === id ? { ...p, upvotes: r.data.data.upvotes, upvotedByMe: r.data.data.upvotedByMe } : p));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-5 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[var(--label)]">Community</h1>
          <p className="text-[14px] text-apple-gray mt-1">Ask questions, share articles, and learn together.</p>
        </div>
        <button onClick={() => setComposing((v) => !v)}
          className="px-4 py-2 rounded-lg bg-apple-blue text-white text-[13px] font-semibold hover:bg-apple-blue/90 transition-colors">
          {composing ? "Close" : "+ New post"}
        </button>
      </div>

      {composing && (
        <Composer
          onClose={() => setComposing(false)}
          onCreated={(post) => { setComposing(false); navigate(`/community/${post.id}`); }}
        />
      )}

      <div className="card p-3 flex items-center gap-2 flex-wrap">
        <div className="flex gap-1.5">
          {KINDS.map((k) => (
            <button key={k.key} onClick={() => setKind(k.key)}
              className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${kind === k.key ? "bg-apple-blue text-white border-apple-blue" : "border-apple-gray5 text-apple-gray hover:border-apple-blue"}`}>
              {k.label}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-apple-gray5 mx-1" />
        <div className="flex gap-1.5">
          {["new", "top"].map((s) => (
            <button key={s} onClick={() => setSort(s)}
              className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors capitalize ${sort === s ? "bg-apple-blue text-white border-apple-blue" : "border-apple-gray5 text-apple-gray hover:border-apple-blue"}`}>
              {s}
            </button>
          ))}
        </div>
        <form className="flex-1 min-w-[160px]" onSubmit={(e) => { e.preventDefault(); load(true); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full text-[13px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-1.5 outline-none focus:border-apple-blue text-[var(--label)]" />
        </form>
      </div>

      {error && <div className="card p-4 border-l-4 border-apple-red"><p className="text-[13px] text-apple-red">{error}</p></div>}

      {items === null ? (
        <p className="text-[13px] text-apple-gray">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[15px] font-semibold text-[var(--label)]">Nothing here yet</p>
          <p className="text-[13px] text-apple-gray mt-1">Be the first to post in this view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => <PostCard key={p.id} p={p} onUpvote={upvote} onOpen={(id) => navigate(`/community/${id}`)} />)}
          {items.length < total && (
            <button onClick={() => load(false)} className="w-full py-2.5 rounded-lg border border-apple-gray5 text-[13px] font-semibold text-apple-gray hover:border-apple-blue hover:text-apple-blue transition-colors">
              Load more ({total - items.length} more)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
