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
