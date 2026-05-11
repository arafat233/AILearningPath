import express from "express";
import Joi from "joi";
import {
  getPlan, listPlans, getPlanById, createPlan, activatePlan,
  updatePlanSettings, deletePlan, reschedulePlan,
  generateShareToken, getSharedPlan,
  markDayComplete, saveTopicOrder, saveDayNote,
} from "../controllers/plannerController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { smartRedistribute, getClassStats } from "../services/plannerSmartService.js";
import { sendWeeklyParentEmailForUser } from "../services/weeklyParentEmailService.js";

const r = express.Router();

const planSchema = Joi.object({
  name:        Joi.string().trim().max(100).optional().allow(""),
  subjects:    Joi.array().items(Joi.string().trim().max(100)).min(1).max(10).required(),
  grade:       Joi.string().required(),
  examDate:    Joi.date().iso().required(),
  goal:        Joi.string().valid("pass","distinction","top","scholarship").required(),
  hoursPerDay: Joi.number().min(1).max(12).optional(),
  offDays:     Joi.array().items(Joi.string()).optional(),
  topicFilter: Joi.array().items(Joi.string().max(200)).optional(),
});

const completeDaySchema = Joi.object({
  day:    Joi.number().integer().min(1).required(),
  planId: Joi.string().optional(),
});

const topicOrderSchema = Joi.object({
  topicOrder: Joi.array().items(Joi.string().trim().max(200)).max(100).required(),
  planId:     Joi.string().optional(),
});

const noteSchema = Joi.object({
  day:    Joi.number().integer().min(1).required(),
  note:   Joi.string().max(500).optional().allow(""),
  planId: Joi.string().optional(),
});

// Public (no auth) — must come before /:planId to avoid conflict
r.get("/share/:token", getSharedPlan);

// Authenticated fixed routes — must come before /:planId
r.get("/all",           auth, listPlans);
r.post("/reschedule",   auth, reschedulePlan);
r.post("/share",        auth, generateShareToken);
r.post("/complete",     auth, validate(completeDaySchema), markDayComplete);
r.patch("/reorder",     auth, validate(topicOrderSchema),  saveTopicOrder);
r.patch("/note",        auth, validate(noteSchema),        saveDayNote);

// ── New: smart redistribute, class stats, parent digest ─────────────
const smartRebalanceSchema = Joi.object({
  pinnedTopics: Joi.array().items(Joi.string().max(200)).max(50).optional(),
});
r.post("/smart-rebalance", auth, validate(smartRebalanceSchema), async (req, res, next) => {
  try { res.json({ data: await smartRedistribute(req.user.id, req.body) }); } catch (e) { next(e); }
});

r.get("/class-stats",  auth, async (req, res, next) => {
  try { res.json({ data: await getClassStats(req.user.id) }); } catch (e) { next(e); }
});

r.post("/digest-now",  auth, async (req, res, next) => {
  try {
    const result = await sendWeeklyParentEmailForUser(req.user.id);
    res.json({ data: result });
  } catch (e) { next(e); }
});

// Active plan
r.get("/",              auth, getPlan);
r.post("/",             auth, validate(planSchema), createPlan);

// Per-plan (planId param) — must come LAST
r.get("/:planId",              auth, getPlanById);
r.put("/:planId/settings",     auth, validate(planSchema), updatePlanSettings);
r.put("/:planId/activate",     auth, activatePlan);
r.delete("/:planId",           auth, deletePlan);

export default r;
