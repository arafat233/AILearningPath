import mongoose from "mongoose";

/**
 * Community engine (COMPETITIVE_GAP_ANALYSIS.md GAP #8 — Newsletter / content /
 * community). One unified, user-generated post model with two `kind`s:
 *   - "article"  → long-form content (title + markdown body + tags): the
 *                  newsletter / blog surface.
 *   - "question" → a discussion/Q&A thread (title + body): a GLOBAL community
 *                  feed, complementing the existing per-topic ProTopicDiscussion.
 *
 * Both support embedded comments, upvotes, reporting, and admin moderation.
 * Author display name + denormalized upvote/comment counts are stored on the
 * doc so feed reads never need a User join or an aggregation.
 */

const commentSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  authorName: { type: String, default: "Learner" },
  body:       { type: String, required: true, maxlength: 5000 },
  createdAt:  { type: Date, default: Date.now },
  // subdocs get an _id automatically (used to delete/moderate a single comment)
});

const reportSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  reason:    { type: String, default: "", maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
  _id: false,
});

const communityPostSchema = new mongoose.Schema({
  userId:     { type: String, required: true, index: true },   // author
  authorName: { type: String, default: "Learner" },

  kind:  { type: String, enum: ["article", "question"], required: true, index: true },
  title: { type: String, required: true, maxlength: 200 },
  body:  { type: String, default: "", maxlength: 20000 },       // markdown
  tags:  [{ type: String, maxlength: 40 }],

  // ── engagement (denormalized counts kept in sync for cheap feed sorting) ──
  upvoters:     [{ type: String }],
  upvoteCount:  { type: Number, default: 0, index: true },
  comments:     [commentSchema],
  commentCount: { type: Number, default: 0 },
  views:        { type: Number, default: 0 },

  // ── moderation ──
  status:  { type: String, enum: ["published", "removed"], default: "published", index: true },
  pinned:  { type: Boolean, default: false },
  reports: [reportSchema],
}, { timestamps: true });

// Feed: list a kind, newest/pinned first or by score; filter by tag.
communityPostSchema.index({ status: 1, kind: 1, pinned: -1, createdAt: -1 });
communityPostSchema.index({ status: 1, kind: 1, upvoteCount: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ userId: 1, createdAt: -1 });
// Full-text search across the feed
communityPostSchema.index({ title: "text", body: "text", tags: "text" });

export const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
