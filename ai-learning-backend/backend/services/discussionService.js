/**
 * discussionService — community Q&A threads per Pro topic (ROADMAP D5.3).
 *
 * One ProTopicDiscussion doc = one thread (top-level question/comment) with
 * embedded replies. Author display name is denormalised onto each post at
 * write time so reads never need a User join.
 *
 * Authorisation:
 *   - Any enrolled user can read + post + reply + upvote.
 *   - Only the author can delete their own thread.
 */
import { ProTopicDiscussion, ProTopic } from "../models/proModels.js";
import { User } from "../models/index.js";
import { isEnrolled } from "../middleware/trackFilter.js";
import { AppError } from "../utils/AppError.js";
import { trackEvent } from "../utils/eventTracker.js";

async function resolveTrackKey(topicId) {
  const topic = await ProTopic.findOne({ topicId }).select("trackKey").lean();
  if (!topic) throw new AppError("Topic not found.", 404);
  return topic.trackKey;
}

async function authorName(userId) {
  const u = await User.findById(userId).select("name").lean();
  return u?.name || "Learner";
}

// Shape a thread doc for the client (computed counts, never raw upvoter list).
function shape(doc, userId) {
  return {
    id:         String(doc._id),
    topicId:    doc.topicId,
    userId:     doc.userId,
    authorName: doc.authorName,
    body:       doc.body,
    pinned:     !!doc.pinned,
    upvotes:    doc.upvoters?.length || 0,
    upvotedByMe: (doc.upvoters || []).includes(userId),
    isMine:     doc.userId === userId,
    createdAt:  doc.createdAt,
    replies: (doc.replies || []).map((r) => ({
      id:         String(r._id),
      userId:     r.userId,
      authorName: r.authorName,
      body:       r.body,
      isMine:     r.userId === userId,
      createdAt:  r.createdAt,
    })),
  };
}

export async function listThreads(userId, topicId) {
  const trackKey = await resolveTrackKey(topicId);
  if (!(await isEnrolled(userId, trackKey))) throw new AppError("Not enrolled in this track.", 403);

  const docs = await ProTopicDiscussion.find({ topicId })
    .sort({ pinned: -1, createdAt: -1 })
    .limit(100)
    .lean();
  return docs.map((d) => shape(d, userId));
}

export async function createThread(userId, topicId, body) {
  const trackKey = await resolveTrackKey(topicId);
  if (!(await isEnrolled(userId, trackKey))) throw new AppError("Not enrolled in this track.", 403);
  const text = (body || "").trim();
  if (!text) throw new AppError("Post body is required.", 400);

  const doc = await ProTopicDiscussion.create({
    topicId, trackKey, userId,
    authorName: await authorName(userId),
    body: text,
  });
  trackEvent(userId, "pro.discussion.thread_created", { topicId, trackKey });
  return shape(doc.toObject(), userId);
}

export async function addReply(userId, threadId, body) {
  const text = (body || "").trim();
  if (!text) throw new AppError("Reply body is required.", 400);

  const doc = await ProTopicDiscussion.findById(threadId);
  if (!doc) throw new AppError("Thread not found.", 404);
  if (!(await isEnrolled(userId, doc.trackKey))) throw new AppError("Not enrolled in this track.", 403);

  doc.replies.push({ userId, authorName: await authorName(userId), body: text });
  doc.updatedAt = new Date();
  await doc.save();
  trackEvent(userId, "pro.discussion.reply_added", { topicId: doc.topicId, threadId });
  return shape(doc.toObject(), userId);
}

export async function toggleUpvote(userId, threadId) {
  const doc = await ProTopicDiscussion.findById(threadId);
  if (!doc) throw new AppError("Thread not found.", 404);
  if (!(await isEnrolled(userId, doc.trackKey))) throw new AppError("Not enrolled in this track.", 403);

  const i = doc.upvoters.indexOf(userId);
  if (i === -1) doc.upvoters.push(userId);
  else doc.upvoters.splice(i, 1);
  await doc.save();
  return { upvotes: doc.upvoters.length, upvotedByMe: i === -1 };
}

export async function deleteThread(userId, threadId) {
  const doc = await ProTopicDiscussion.findById(threadId);
  if (!doc) throw new AppError("Thread not found.", 404);
  if (doc.userId !== userId) throw new AppError("You can only delete your own posts.", 403);
  await doc.deleteOne();
  return { ok: true };
}
