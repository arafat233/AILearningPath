import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as svc from "../services/dashboardV2Service.js";

const r = express.Router();

// One-shot dashboard payload
r.get("/dashboard", auth, async (req, res, next) => {
  try {
    const [streakStrip, commitment, streakRisk, peer, rank, friends, recent, nextBadge, tomorrow, snoozes, widget, nba] = await Promise.all([
      svc.getStreakStrip(req.user.id),
      svc.getCommitment(req.user.id),
      svc.getStreakRisk(req.user.id),
      svc.getPeerActivity(req.user.id),
      svc.getRankWidget(req.user.id),
      svc.getFriendActivity(req.user.id),
      svc.getRecentSessions(req.user.id),
      svc.getNextBadgePreview(req.user.id),
      svc.getTomorrowPreview(req.user.id),
      svc.listActiveSnoozes(req.user.id),
      svc.getWidgetOrder(req.user.id),
      svc.getNBA(req.user.id),
    ]);
    res.json({ data: {
      streakStrip, commitment, streakRisk, peer, rank, friends, recent,
      nextBadge, tomorrow, snoozes, widget, nba,
    } });
  } catch (e) { next(e); }
});

const commitmentSchema = Joi.object({
  goalMinutes: Joi.number().integer().min(5).max(480).required(),
});
r.post("/commitment", auth, validate(commitmentSchema), async (req, res, next) => {
  try { res.json({ data: await svc.setCommitment(req.user.id, req.body.goalMinutes) }); } catch (e) { next(e); }
});

const snoozeSchema = Joi.object({
  taskId: Joi.string().min(1).max(120).required(),
  reason: Joi.string().valid("later_today", "tomorrow", "this_week", "not_relevant").required(),
});
r.post("/snooze", auth, validate(snoozeSchema), async (req, res, next) => {
  try { res.json({ data: await svc.snoozeTask(req.user.id, req.body.taskId, req.body.reason) }); } catch (e) { next(e); }
});

const widgetSchema = Joi.object({
  order:   Joi.array().items(Joi.string().max(60)).max(30).optional(),
  hidden:  Joi.array().items(Joi.string().max(60)).max(30).optional(),
  density: Joi.string().valid("comfortable", "compact").optional(),
});
r.patch("/widget", auth, validate(widgetSchema), async (req, res, next) => {
  try { res.json({ data: await svc.setWidgetOrder(req.user.id, req.body) }); } catch (e) { next(e); }
});

export default r;
