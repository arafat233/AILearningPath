/**
 * interviewController — thin HTTP handlers for /api/v1/pro/interview/*.
 * All business logic lives in interviewService.js.
 */
import * as svc from "../services/interviewService.js";
import { AppError } from "../utils/AppError.js";

const uid = (req) => req.user?.id;

export const listProblems = async (req, res, next) => {
  try {
    const data = svc.listProblems({
      difficulty: req.query.difficulty,
      topic:      req.query.topic,
    });
    res.json({ data });
  } catch (err) { next(err); }
};

export const createSession = async (req, res, next) => {
  try {
    if (!uid(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.createSession({ userId: uid(req), problemId: req.body.problemId });
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

export const getSession = async (req, res, next) => {
  try {
    if (!uid(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.getSession({ userId: uid(req), sessionId: req.params.sessionId });
    res.json({ data });
  } catch (err) { next(err); }
};

export const listHistory = async (req, res, next) => {
  try {
    if (!uid(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.listHistory(uid(req));
    res.json({ data });
  } catch (err) { next(err); }
};

export const sendMessage = async (req, res, next) => {
  try {
    if (!uid(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.sendMessage({
      userId:       uid(req),
      sessionId:    req.params.sessionId,
      content:      req.body.content,
      silenceProbe: req.body.silenceProbe === true,
    });
    res.json({ data });
  } catch (err) { next(err); }
};

export const endSession = async (req, res, next) => {
  try {
    if (!uid(req)) return next(new AppError("Authentication required.", 401));
    const data = await svc.endSession({
      userId:     uid(req),
      sessionId:  req.params.sessionId,
      code:       req.body.code || "",
      scratchpad: req.body.scratchpad || "",
    });
    res.json({ data });
  } catch (err) { next(err); }
};
