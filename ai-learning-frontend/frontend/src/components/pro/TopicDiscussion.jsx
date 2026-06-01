/**
 * TopicDiscussion — community Q&A thread list for a Pro topic (D5.3).
 *
 * Mounted at the bottom of ProTopicView. Lists threads (most-upvoted-pinned
 * first), lets the learner post a new thread, reply inline, upvote, and
 * delete their own posts. All calls are auth-scoped to the enrolled track.
 */
import { useEffect, useState } from "react";
import {
  proListDiscussions, proCreateDiscussion, proReplyDiscussion,
  proUpvoteDiscussion, proDeleteDiscussion,
} from "../../services/api";

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Avatar({ name }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <span className="w-7 h-7 rounded-full bg-apple-blue/15 text-apple-blue text-[12px] font-bold flex items-center justify-center shrink-0">
      {initial}
    </span>
  );
}

function ReplyComposer({ onSubmit }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    try { await onSubmit(text.trim()); setText(""); }
    finally { setBusy(false); }
  };
  return (
    <div className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Write a reply…"
        className="flex-1 rounded-lg border border-apple-gray5 bg-[var(--fill)] px-3 py-1.5 text-[12px] text-[var(--label)] placeholder:text-apple-gray4 outline-none focus:border-apple-blue"
      />
      <button onClick={submit} disabled={busy || !text.trim()}
        className="btn-secondary text-[12px] px-3 py-1.5 disabled:opacity-40">Reply</button>
    </div>
  );
}

function Thread({ thread, onReply, onUpvote, onDelete }) {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className="card p-4 space-y-2">
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <Avatar name={thread.authorName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[var(--label)]">{thread.authorName}</span>
            {thread.pinned && <span className="text-[9px] font-bold uppercase text-apple-orange bg-apple-orange/10 px-1.5 py-0.5 rounded-full">Pinned</span>}
            <span className="text-[11px] text-apple-gray3">{timeAgo(thread.createdAt)}</span>
          </div>
          <p className="text-[13px] text-[var(--label)] leading-relaxed mt-1 whitespace-pre-wrap">{thread.body}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pl-9 text-[12px]">
        <button onClick={() => onUpvote(thread.id)}
          className={`flex items-center gap-1 transition-colors ${thread.upvotedByMe ? "text-apple-blue font-semibold" : "text-apple-gray hover:text-apple-blue"}`}>
          ▲ {thread.upvotes > 0 ? thread.upvotes : ""} <span className="text-[11px]">{thread.upvotedByMe ? "upvoted" : "upvote"}</span>
        </button>
        <button onClick={() => setShowReply((s) => !s)} className="text-apple-gray hover:text-apple-blue transition-colors">
          💬 Reply{thread.replies.length > 0 ? ` (${thread.replies.length})` : ""}
        </button>
        {thread.isMine && (
          <button onClick={() => onDelete(thread.id)} className="text-apple-gray hover:text-apple-red transition-colors ml-auto">
            Delete
          </button>
        )}
      </div>

      {/* Replies */}
      {thread.replies.length > 0 && (
        <div className="pl-9 space-y-2 mt-1 border-l-2 border-apple-gray5 ml-3">
          {thread.replies.map((r) => (
            <div key={r.id} className="flex items-start gap-2 pl-3">
              <Avatar name={r.authorName} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[var(--label)]">{r.authorName}</span>
                  <span className="text-[10px] text-apple-gray3">{timeAgo(r.createdAt)}</span>
                </div>
                <p className="text-[12px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReply && (
        <div className="pl-9">
          <ReplyComposer onSubmit={(body) => onReply(thread.id, body).then(() => setShowReply(false))} />
        </div>
      )}
    </div>
  );
}

export default function TopicDiscussion({ topicId }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [body,    setBody]    = useState("");
  const [posting, setPosting] = useState(false);

  const load = () => {
    proListDiscussions(topicId)
      .then((r) => setThreads(r.data?.data || []))
      .catch((e) => setError(e?.response?.data?.error || "Could not load discussions."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setLoading(true); load(); /* eslint-disable-next-line */ }, [topicId]);

  const post = async () => {
    if (!body.trim() || posting) return;
    setPosting(true);
    try {
      const r = await proCreateDiscussion(topicId, body.trim());
      setThreads((prev) => [r.data.data, ...prev]);
      setBody("");
    } catch (e) {
      setError(e?.response?.data?.error || "Could not post.");
    } finally { setPosting(false); }
  };

  const reply = async (threadId, text) => {
    const r = await proReplyDiscussion(threadId, text);
    setThreads((prev) => prev.map((t) => (t.id === threadId ? r.data.data : t)));
  };

  const upvote = async (threadId) => {
    // optimistic
    setThreads((prev) => prev.map((t) => t.id === threadId
      ? { ...t, upvotedByMe: !t.upvotedByMe, upvotes: t.upvotes + (t.upvotedByMe ? -1 : 1) } : t));
    try { await proUpvoteDiscussion(threadId); }
    catch { load(); } // revert by reloading on failure
  };

  const remove = async (threadId) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    try { await proDeleteDiscussion(threadId); }
    catch { load(); }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93]">Community</p>
        <span className="text-[11px] text-apple-gray3">{threads.length} {threads.length === 1 ? "thread" : "threads"}</span>
      </div>
      <h2 className="text-[20px] font-bold tracking-tight text-[var(--label)]">Discussion</h2>

      {/* Composer */}
      <div className="card p-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ask a question or share an insight about this topic…"
          rows={2}
          className="w-full resize-none rounded-lg border border-apple-gray5 bg-[var(--fill)] px-3 py-2 text-[13px] text-[var(--label)] placeholder:text-apple-gray4 outline-none focus:border-apple-blue"
        />
        <div className="flex justify-end mt-2">
          <button onClick={post} disabled={posting || !body.trim()}
            className="btn-primary text-[12px] px-4 py-1.5 disabled:opacity-40">
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      {error && <p className="text-[12px] text-apple-red">{error}</p>}

      {loading ? (
        <p className="text-[13px] text-apple-gray">Loading…</p>
      ) : threads.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[24px] mb-1">💬</p>
          <p className="text-[13px] text-apple-gray">No discussion yet — be the first to ask or share.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {threads.map((t) => (
            <Thread key={t.id} thread={t} onReply={reply} onUpvote={upvote} onDelete={remove} />
          ))}
        </div>
      )}
    </section>
  );
}
