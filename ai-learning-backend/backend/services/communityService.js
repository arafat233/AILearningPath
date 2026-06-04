/**
 * communityService — the Newsletter / Community engine (GAP #8).
 *
 * Unified, user-generated CommunityPost (kind "article" | "question") with
 * embedded comments, upvotes, reporting, and admin moderation. Open to any
 * authenticated user (NOT enrollment-gated — it's a global, cross-track surface).
 *
 * Authorisation:
 *   - Any authed user: read published posts, create, comment, upvote, report.
 *   - Author only: edit / delete their own post or comment.
 *   - Admin (via adminAuth routes): moderate — remove/restore/pin/unpin, and
 *     delete any post/comment.
 */
import { CommunityPost } from "../models/communityModels.js";
import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { trackEvent } from "../utils/eventTracker.js";

const FEED_LIMIT_MAX = 50;

function cleanTags(tags) {
  if (!Array.isArray(tags)) return [];
  const seen = new Set();
  for (const t of tags) {
    if (typeof t !== "string") continue;
    const v = t.trim().toLowerCase().replace(/^#/, "").slice(0, 40);
    if (v) seen.add(v);
  }
  return [...seen].slice(0, 8);
}

async function authorName(userId) {
  const u = await User.findById(userId).select("name").lean();
  return u?.name || "Learner";
}

// Shape for a feed row (no body, no comments — light).
function shapeSummary(doc, userId) {
  return {
    id:          String(doc._id),
    kind:        doc.kind,
    title:       doc.title,
    excerpt:     (doc.body || "").slice(0, 240),
    tags:        doc.tags || [],
    authorName:  doc.authorName,
    userId:      doc.userId,
    upvotes:     doc.upvoteCount ?? (doc.upvoters?.length || 0),
    upvotedByMe: (doc.upvoters || []).includes(userId),
    commentCount: doc.commentCount ?? (doc.comments?.length || 0),
    views:       doc.views || 0,
    pinned:      !!doc.pinned,
    status:      doc.status,
    isMine:      doc.userId === userId,
    createdAt:   doc.createdAt,
  };
}

// Shape for a detail view (full body + comments). Never leaks the upvoter list
// or reporter identities to the client.
function shapeFull(doc, userId) {
  return {
    ...shapeSummary(doc, userId),
    body: doc.body,
    reportCount: doc.reports?.length || 0,
    comments: (doc.comments || []).map((c) => ({
      id:         String(c._id),
      userId:     c.userId,
      authorName: c.authorName,
      body:       c.body,
      isMine:     c.userId === userId,
      createdAt:  c.createdAt,
    })),
  };
}

// ── Feed: list + filter + search + paginate ──
export async function listPosts(userId, opts = {}) {
  const { kind, tag, q, sort } = opts;
  const limit = Math.min(FEED_LIMIT_MAX, Math.max(1, parseInt(opts.limit, 10) || 20));
  const skip = Math.max(0, parseInt(opts.skip, 10) || 0);

  const filter = { status: "published" };
  if (kind) filter.kind = kind;
  if (tag) filter.tags = tag.trim().toLowerCase().replace(/^#/, "");
  if (q && q.trim()) {
    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    filter.$or = [{ title: rx }, { body: rx }, { tags: rx }];
  }

  const order = sort === "top"
    ? { pinned: -1, upvoteCount: -1, createdAt: -1 }
    : { pinned: -1, createdAt: -1 };

  const [docs, total] = await Promise.all([
    CommunityPost.find(filter).sort(order).skip(skip).limit(limit).lean(),
    CommunityPost.countDocuments(filter),
  ]);
  return { items: docs.map((d) => shapeSummary(d, userId)), total, limit, skip };
}

export async function getPost(userId, id) {
  const doc = await CommunityPost.findOneAndUpdate(
    { _id: id, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).lean().catch(() => null);
  if (!doc) throw new AppError("Post not found.", 404);
  return shapeFull(doc, userId);
}

export async function createPost(userId, payload) {
  const kind = payload.kind;
  if (!["article", "question"].includes(kind)) throw new AppError("Invalid post kind.", 400);
  const title = (payload.title || "").trim();
  const body = (payload.body || "").trim();
  if (!title) throw new AppError("A title is required.", 400);
  if (!body) throw new AppError("A body is required.", 400);

  const doc = await CommunityPost.create({
    userId,
    authorName: await authorName(userId),
    kind, title, body,
    tags: cleanTags(payload.tags),
  });
  trackEvent(userId, "community.post_created", { kind });
  return shapeFull(doc.toObject(), userId);
}

export async function editPost(userId, id, patch) {
  const doc = await CommunityPost.findById(id);
  if (!doc) throw new AppError("Post not found.", 404);
  if (doc.userId !== userId) throw new AppError("You can only edit your own post.", 403);
  if (patch.title !== undefined) {
    const t = String(patch.title).trim();
    if (!t) throw new AppError("Title cannot be empty.", 400);
    doc.title = t;
  }
  if (patch.body !== undefined) {
    const b = String(patch.body).trim();
    if (!b) throw new AppError("Body cannot be empty.", 400);
    doc.body = b;
  }
  if (patch.tags !== undefined) doc.tags = cleanTags(patch.tags);
  await doc.save();
  return shapeFull(doc.toObject(), userId);
}

export async function deletePost(userId, id) {
  const doc = await CommunityPost.findById(id).select("userId").lean();
  if (!doc) throw new AppError("Post not found.", 404);
  if (doc.userId !== userId) throw new AppError("You can only delete your own post.", 403);
  await CommunityPost.deleteOne({ _id: id });
  return { deleted: true };
}

export async function toggleUpvote(userId, id) {
  const doc = await CommunityPost.findById(id);
  if (!doc || doc.status !== "published") throw new AppError("Post not found.", 404);
  const i = doc.upvoters.indexOf(userId);
  if (i === -1) doc.upvoters.push(userId);
  else doc.upvoters.splice(i, 1);
  doc.upvoteCount = doc.upvoters.length;
  await doc.save();
  return { upvotes: doc.upvoteCount, upvotedByMe: i === -1 };
}

export async function addComment(userId, id, body) {
  const text = (body || "").trim();
  if (!text) throw new AppError("Comment body is required.", 400);
  const doc = await CommunityPost.findById(id);
  if (!doc || doc.status !== "published") throw new AppError("Post not found.", 404);
  doc.comments.push({ userId, authorName: await authorName(userId), body: text });
  doc.commentCount = doc.comments.length;
  await doc.save();
  trackEvent(userId, "community.comment_added", { postId: id });
  return shapeFull(doc.toObject(), userId);
}

export async function deleteComment(userId, id, commentId) {
  const doc = await CommunityPost.findById(id);
  if (!doc) throw new AppError("Post not found.", 404);
  const c = doc.comments.id(commentId);
  if (!c) throw new AppError("Comment not found.", 404);
  if (c.userId !== userId) throw new AppError("You can only delete your own comment.", 403);
  c.deleteOne();
  doc.commentCount = doc.comments.length;
  await doc.save();
  return shapeFull(doc.toObject(), userId);
}

export async function reportPost(userId, id, reason) {
  const doc = await CommunityPost.findById(id);
  if (!doc) throw new AppError("Post not found.", 404);
  if (doc.reports.some((r) => r.userId === userId)) return { reported: true, already: true };
  doc.reports.push({ userId, reason: (reason || "").slice(0, 300) });
  await doc.save();
  trackEvent(userId, "community.post_reported", { postId: id });
  return { reported: true };
}

export async function listTags() {
  const tags = await CommunityPost.distinct("tags", { status: "published" });
  return tags.filter(Boolean).sort();
}

// ── Admin moderation (routes gated by adminAuth) ──
export async function listReported() {
  const docs = await CommunityPost.find({ "reports.0": { $exists: true } })
    .sort({ updatedAt: -1 }).limit(100).lean();
  return docs.map((d) => ({
    id: String(d._id), kind: d.kind, title: d.title, authorName: d.authorName,
    status: d.status, reportCount: d.reports.length,
    reasons: d.reports.map((r) => r.reason).filter(Boolean).slice(0, 10),
    createdAt: d.createdAt,
  }));
}

export async function moderate(adminId, id, action) {
  const doc = await CommunityPost.findById(id);
  if (!doc) throw new AppError("Post not found.", 404);
  switch (action) {
    case "remove":  doc.status = "removed"; break;
    case "restore": doc.status = "published"; break;
    case "pin":     doc.pinned = true; break;
    case "unpin":   doc.pinned = false; break;
    case "clear-reports": doc.reports = []; break;
    default: throw new AppError(`Unknown moderation action: ${action}`, 400);
  }
  await doc.save();
  trackEvent(adminId, "community.moderated", { postId: id, action });
  return { id: String(doc._id), status: doc.status, pinned: doc.pinned, reportCount: doc.reports.length };
}

export async function adminDelete(adminId, id) {
  const r = await CommunityPost.deleteOne({ _id: id });
  if (r.deletedCount === 0) throw new AppError("Post not found.", 404);
  trackEvent(adminId, "community.admin_deleted", { postId: id });
  return { deleted: true };
}
