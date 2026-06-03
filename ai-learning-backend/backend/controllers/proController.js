/**
 * proController — thin HTTP handlers for /api/v1/pro/* routes.
 *
 * Pure delegation: every handler validates that auth has populated
 * req.user.id, calls the matching proService function, and either returns
 * `res.json({ data })` or hands the error to `next()` (the global error
 * handler turns it into the right status code).
 *
 * NO business logic lives here.
 */

import * as svc from "../services/proService.js";
import * as tutorSvc from "../services/tutorService.js";
import * as discussionSvc from "../services/discussionService.js";
import { AppError } from "../utils/AppError.js";

const userId = (req) => req.user?.id;

export const listTracks = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.listTracks(userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const getTrack = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getTrack(req.params.trackSlug, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const practiceList = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getPracticeList(
      req.params.trackSlug,
      { priority: req.query.priority, pattern: req.query.pattern },
      userId(req),
    );
    res.json({ data });
  } catch (err) { next(err); }
};

export const patternQuiz = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const n = Math.min(20, Math.max(1, parseInt(req.query.n, 10) || 10));
    const data = await svc.getPatternQuiz(req.params.trackSlug, n, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const getModule = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getModule(req.params.trackSlug, req.params.moduleId, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const getTopic = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getTopic(req.params.topicId, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const listExercisesForTopic = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.listExercisesForTopic(req.params.topicId, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const getExercise = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getExercise(req.params.exerciseId, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const submitExercise = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.submitExercise({
      userId:     userId(req),
      exerciseId: req.params.exerciseId,
      code:       req.body.code,
    });
    res.json({ data });
  } catch (err) { next(err); }
};

export const getProgress = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getProgress(userId(req), req.params.trackKey);
    res.json({ data });
  } catch (err) { next(err); }
};

export const enroll = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.enroll(userId(req), req.body.trackKey);
    res.json({ data });
  } catch (err) { next(err); }
};

// ── Projects ─────────────────────────────────────────────────────────────────

export const getProject = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getProject(req.params.projectId, userId(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const submitProject = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.submitProject({
      userId:      userId(req),
      projectId:   req.params.projectId,
      code:        req.body.code,
      checkedReqs: req.body.checkedReqs || [],
    });
    res.json({ data });
  } catch (err) { next(err); }
};

export const toggleExerciseBookmark = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.toggleBookmark(userId(req), "exercise", req.params.exerciseId);
    res.json({ data });
  } catch (err) { next(err); }
};

export const toggleTopicBookmark = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.toggleBookmark(userId(req), "topic", req.params.topicId);
    res.json({ data });
  } catch (err) { next(err); }
};

export const toggleProjectBookmark = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.toggleBookmark(userId(req), "project", req.params.projectId);
    res.json({ data });
  } catch (err) { next(err); }
};

export const listBookmarks = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const trackKey = req.query.trackKey || "pro_java";
    const data = await svc.listBookmarks(userId(req), trackKey);
    res.json({ data });
  } catch (err) { next(err); }
};

// ── Spaced repetition (ROADMAP F) ─────────────────────────────────────────────

export const getDueReviews = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const trackKey = req.query.trackKey || "pro_java";
    const data = await svc.getDueReviews(userId(req), trackKey);
    res.json({ data });
  } catch (err) { next(err); }
};

export const recordReview = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.recordReview(userId(req), req.body.trackKey, req.params.topicId, req.body.rating);
    res.json({ data });
  } catch (err) { next(err); }
};

export const recordReveal = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.recordReveal(userId(req), req.params.topicId);
    res.json({ data });
  } catch (err) { next(err); }
};

// ── Discussions (D5.3) ───────────────────────────────────────────────────────

export const listDiscussions = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await discussionSvc.listThreads(userId(req), req.params.topicId);
    res.json({ data });
  } catch (err) { next(err); }
};

export const createDiscussion = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await discussionSvc.createThread(userId(req), req.params.topicId, req.body.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

export const replyDiscussion = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await discussionSvc.addReply(userId(req), req.params.threadId, req.body.body);
    res.json({ data });
  } catch (err) { next(err); }
};

export const upvoteDiscussion = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await discussionSvc.toggleUpvote(userId(req), req.params.threadId);
    res.json({ data });
  } catch (err) { next(err); }
};

export const deleteDiscussion = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await discussionSvc.deleteThread(userId(req), req.params.threadId);
    res.json({ data });
  } catch (err) { next(err); }
};

// ── Pattern Atlas (D3.4) ─────────────────────────────────────────────────────

export const getPatternAtlas = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const trackKey = req.query.trackKey || "pro_java";
    const data = await svc.getPatternAtlas(trackKey);
    res.json({ data });
  } catch (err) { next(err); }
};

// ── Tutor ────────────────────────────────────────────────────────────────────

export const tutorAsk = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const { exerciseId, studentCode, question } = req.body;
    const data = await tutorSvc.ask({ userId: userId(req), exerciseId, studentCode, question });
    res.json({ data });
  } catch (err) { next(err); }
};

export const tutorGetSession = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const data = await tutorSvc.getSession({ userId: userId(req), exerciseId: req.params.exerciseId });
    res.json({ data });
  } catch (err) { next(err); }
};

export const tutorRateMessage = async (req, res, next) => {
  try {
    if (!userId(req)) return next(new AppError("Authentication required.", 401));
    const { messageIndex, rating } = req.body;
    const data = await tutorSvc.rateMessage({
      userId:       userId(req),
      sessionId:    req.params.sessionId,
      messageIndex,
      rating,
    });
    res.json({ data });
  } catch (err) { next(err); }
};
