import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
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

export default r;
