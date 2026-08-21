import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
import { checkAndIncrementUsage } from "../services/aiRouter.js";
import * as svc from "../services/schoolGroupV2Service.js";

const r = express.Router();

r.get("/dashboard", auth, async (req, res, next) => {
  try { res.json({ data: await svc.getClassDashboard(req.user.id) }); } catch (e) { next(e); }
});

const kudosSchema = Joi.object({
  toId:    Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
  schoolGroupId: Joi.string().required(),
  emoji:   Joi.string().max(4).optional(),
  message: Joi.string().allow("").max(120).optional(),
});
r.post("/kudos", auth, validate(kudosSchema), async (req, res, next) => {
  try { res.json({ data: await svc.sendKudos(req.user.id, req.body.toId, req.body.schoolGroupId, req.body.emoji, req.body.message) }); } catch (e) { next(e); }
});

const challengeSchema = Joi.object({
  schoolGroupId: Joi.string().required(),
  title:         Joi.string().min(3).max(120).required(),
  description:   Joi.string().allow("").max(500).optional(),
  targetCount:   Joi.number().integer().min(1).max(10000).required(),
  metric:        Joi.string().valid("questions", "topics", "hours", "papers").optional(),
  subjectFocus:  Joi.string().allow(null, "").optional(),
  rewardText:    Joi.string().allow("").max(200).optional(),
  deadline:      Joi.date().iso().required(),
});
r.post("/challenge", auth, validate(challengeSchema), async (req, res, next) => {
  try { res.json({ data: await svc.createChallenge(req.user.id, req.body.schoolGroupId, req.body) }); } catch (e) { next(e); }
});

const postSchema = Joi.object({
  schoolGroupId: Joi.string().required(),
  message:       Joi.string().min(1).max(500).required(),
  role:          Joi.string().max(60).optional(),
});
r.post("/teacher-post", auth, validate(postSchema), async (req, res, next) => {
  try { res.json({ data: await svc.postTeacherUpdate(req.user.id, req.body.schoolGroupId, req.body) }); } catch (e) { next(e); }
});

r.post("/teacher-post/:id/react", auth, async (req, res, next) => {
  try { res.json({ data: await svc.reactToTeacherPost(req.user.id, req.params.id, req.body.emoji || "👍") }); } catch (e) { next(e); }
});

const commentSchema = Joi.object({ text: Joi.string().min(1).max(280).required() });
r.post("/teacher-post/:id/comment", auth, validate(commentSchema), async (req, res, next) => {
  try { res.json({ data: await svc.commentOnTeacherPost(req.user.id, req.params.id, req.body.text) }); } catch (e) { next(e); }
});

const focusSchema = Joi.object({
  schoolGroupId: Joi.string().required(),
  subject:       Joi.string().required(),
  topic:         Joi.string().allow("").optional(),
});
r.post("/subject-focus", auth, validate(focusSchema), async (req, res, next) => {
  try { res.json({ data: await svc.setSubjectFocus(req.user.id, req.body.schoolGroupId, req.body.subject, req.body.topic) }); } catch (e) { next(e); }
});

r.get("/prefs", auth, async (req, res, next) => {
  try { res.json({ data: await svc.getMyClassPrefs(req.user.id) }); } catch (e) { next(e); }
});

const prefsSchema = Joi.object({
  anonymousMode: Joi.boolean().optional(),
  hideRank:      Joi.boolean().optional(),
  blockedIds:    Joi.array().items(Joi.string()).max(50).optional(),
  mutedIds:      Joi.array().items(Joi.string()).max(50).optional(),
});
r.patch("/prefs", auth, validate(prefsSchema), async (req, res, next) => {
  try { res.json({ data: await svc.updateMyClassPrefs(req.user.id, req.body) }); } catch (e) { next(e); }
});

const reportSchema = Joi.object({
  targetId:      Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
  schoolGroupId: Joi.string().required(),
  reason:        Joi.string().valid("harassment","spam","inappropriate","cheating","other").required(),
  note:          Joi.string().allow("").max(500).optional(),
});
r.post("/report", auth, validate(reportSchema), async (req, res, next) => {
  try { res.json({ data: await svc.reportClassmate(req.user.id, req.body.targetId, req.body.schoolGroupId, req.body.reason, req.body.note) }); } catch (e) { next(e); }
});

// ── Assignments (teacher assigns by class join code) ──────────────
const assignmentSchema = Joi.object({
  classCode:     Joi.string().trim().min(3).max(20).required(),
  topic:         Joi.string().trim().min(2).max(200).required(),
  title:         Joi.string().trim().max(120).optional().allow(""),
  questionCount: Joi.number().integer().min(1).max(30).optional(),
  dueAt:         Joi.date().iso().greater("now").required(),
});
r.post("/assignments", auth, validate(assignmentSchema), async (req, res, next) => {
  try { res.json({ data: await svc.createAssignment(req.user.id, req.body) }); } catch (e) { next(e); }
});

r.get("/assignments/mine", auth, async (req, res, next) => {
  try { res.json({ data: await svc.listTeacherAssignments(req.user.id) }); } catch (e) { next(e); }
});

r.get("/assignments/:id/report", auth, async (req, res, next) => {
  try { res.json({ data: await svc.getAssignmentReport(req.user.id, req.params.id) }); } catch (e) { next(e); }
});

// Class heatmap — students × topics accuracy grid (teacher-only)
r.get("/class-heatmap", auth, async (req, res, next) => {
  try { res.json({ data: await svc.getClassHeatmap(req.user.id, req.query.classCode) }); } catch (e) { next(e); }
});

// AI teacher docs — remedial plan / parent note / class summary (costs AI tokens)
const teacherContentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI generations. Try again in an hour." },
});
const teacherContentSchema = Joi.object({
  kind:        Joi.string().valid("remedial_plan", "parent_note", "class_summary").required(),
  classCode:   Joi.string().trim().min(3).max(20).required(),
  studentName: Joi.string().trim().max(80).optional().allow(""),
});
r.post("/teacher-content", auth, teacherContentLimiter, validate(teacherContentSchema), async (req, res, next) => {
  try {
    const allowed = await checkAndIncrementUsage(req.user.id);
    if (!allowed) return next(new AppError("Daily AI limit reached. Upgrade for more.", 429));
    res.json({ data: await svc.generateTeacherContent(req.user.id, req.body) });
  } catch (e) { next(e); }
});

// Worksheet generator (teacher-only; includes answer key)
const worksheetSchema = Joi.object({
  topic:         Joi.string().trim().min(2).max(200).required(),
  questionCount: Joi.number().integer().min(1).max(30).optional(),
  difficulty:    Joi.string().valid("easy", "medium", "hard").optional(),
});
r.post("/worksheet", auth, validate(worksheetSchema), async (req, res, next) => {
  try { res.json({ data: await svc.generateWorksheet(req.user.id, req.body) }); } catch (e) { next(e); }
});

export default r;
