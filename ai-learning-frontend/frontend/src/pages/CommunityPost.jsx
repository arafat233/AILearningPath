import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  communityGet, communityUpvote, communityComment, communityDeleteComment,
  communityDelete, communityReport,
} from "../services/api";

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function CommunityPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    communityGet(id)
      .then((r) => setPost(r.data.data))
      .catch((e) => setError(e?.response?.data?.error || "Post not found."));
  }, [id]);

  const upvote = async () => {
    try {
      const r = await communityUpvote(id);
      setPost((p) => ({ ...p, upvotes: r.data.data.upvotes, upvotedByMe: r.data.data.upvotedByMe }));
    } catch { /* ignore */ }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setBusy(true);
    try {
      const r = await communityComment(id, comment.trim());
      setPost(r.data.data);
      setComment("");
    } catch (e) {
      setError(e?.response?.data?.error || "Could not comment.");
    } finally { setBusy(false); }
  };

  const removeComment = async (cid) => {
    try { const r = await communityDeleteComment(id, cid); setPost(r.data.data); } catch { /* ignore */ }
  };

  const report = async () => {
    const reason = window.prompt("Why are you reporting this post? (optional)") ?? null;
    if (reason === null) return;
    try { await communityReport(id, reason); window.alert("Reported. Thanks — our team will review it."); } catch { /* ignore */ }
  };

  const del = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try { await communityDelete(id); navigate("/community"); } catch { /* ignore */ }
  };

  if (error) return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={() => navigate("/community")} className="text-[12px] text-apple-gray hover:text-apple-blue">← Back to Community</button>
      <div className="card p-6 mt-4 text-center"><p className="text-[14px] text-apple-red">{error}</p></div>
    </div>
  );
  if (!post) return <div className="px-4 sm:px-6 lg:px-8 py-6 text-[13px] text-apple-gray">Loading…</div>;

  return (
    <div className="space-y-5 px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={() => navigate("/community")} className="text-[12px] text-apple-gray hover:text-apple-blue">← Back to Community</button>

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <button onClick={upvote}
            className={`shrink-0 flex flex-col items-center w-12 rounded-lg py-2 transition-colors ${post.upvotedByMe ? "bg-apple-blue/10 text-apple-blue" : "bg-[var(--fill)] text-apple-gray hover:text-apple-blue"}`}
            title="Upvote">
            <span className="text-[16px] leading-none">▲</span>
            <span className="text-[15px] font-bold tabular-nums mt-1">{post.upvotes}</span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${post.kind === "article" ? "bg-apple-purple/15 text-apple-purple" : "bg-apple-green/15 text-apple-green"}`}>
                {post.kind}
              </span>
              {post.pinned && <span className="text-[10px] font-bold uppercase tracking-wider text-apple-orange">📌 pinned</span>}
            </div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--label)] leading-snug">{post.title}</h1>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[12px] text-apple-gray">
              <span className="font-medium">{post.authorName}</span>
              <span>· {timeAgo(post.createdAt)}</span>
              <span>· 👁 {post.views}</span>
              {(post.tags || []).map((t) => <span key={t} className="px-1.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">#{t}</span>)}
            </div>
            <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap mt-4">{post.body}</p>
            <div className="flex items-center gap-3 mt-5">
              {!post.isMine && (
                <button onClick={report} className="text-[12px] text-apple-gray hover:text-apple-red transition-colors">Report</button>
              )}
              {post.isMine && (
                <button onClick={del} className="text-[12px] text-apple-gray hover:text-apple-red transition-colors">Delete</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <p className="text-[15px] font-semibold text-[var(--label)]">{post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}</p>

        <div className="card p-4 space-y-2">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} maxLength={5000}
            placeholder="Add a comment…"
            className="w-full text-[14px] rounded-lg border border-apple-gray5 bg-transparent px-3 py-2 outline-none focus:border-apple-blue text-[var(--label)] resize-y" />
          <button onClick={addComment} disabled={busy || !comment.trim()}
            className="px-4 py-1.5 rounded-lg bg-apple-blue text-white text-[13px] font-semibold hover:bg-apple-blue/90 transition-colors disabled:opacity-60">
            {busy ? "Posting…" : "Comment"}
          </button>
        </div>

        {post.comments.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[12px] font-semibold text-[var(--label)]">{c.authorName}</span>
              <span className="text-[11px] text-apple-gray">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="text-[13px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{c.body}</p>
            {c.isMine && (
              <button onClick={() => removeComment(c.id)} className="text-[11px] text-apple-gray hover:text-apple-red transition-colors mt-2">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
