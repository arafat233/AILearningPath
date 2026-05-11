import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as svc from "../services/parentV2Service.js";

const r = express.Router();

const objId = Joi.string().pattern(/^[a-f\d]{24}$/i);

r.get("/dashboard/:childId", auth, async (req, res, next) => {
  try { res.json({ data: await svc.getParentDashboard(req.user.id, req.params.childId) }); } catch (e) { next(e); }
});

const controlsSchema = Joi.object({
  screenTimeCapMin: Joi.number().integer().min(0).max(720).optional(),
  pauseAI:          Joi.boolean().optional(),
  approveAIThreads: Joi.boolean().optional(),
  vacationMode:     Joi.boolean().optional(),
  quietHours:       Joi.object({
    start: Joi.string().allow("").optional(),
    end:   Joi.string().allow("").optional(),
  }).optional(),
});
r.patch("/controls/:childId", auth, validate(controlsSchema), async (req, res, next) => {
  try { res.json({ data: await svc.updateParentalControls(req.user.id, req.params.childId, req.body) }); } catch (e) { next(e); }
});

const messageSchema = Joi.object({
  childId: objId.required(),
  message: Joi.string().min(1).max(500).required(),
});
r.post("/message", auth, validate(messageSchema), async (req, res, next) => {
  try { res.json({ data: await svc.sendParentMessage(req.user.id, req.body.childId, req.body.message) }); } catch (e) { next(e); }
});

const goalSchema = Joi.object({
  childId: objId.required(),
  goal:    Joi.string().min(1).max(200).required(),
});
r.post("/cosign-goal", auth, validate(goalSchema), async (req, res, next) => {
  try { res.json({ data: await svc.cosignGoal(req.user.id, req.body.childId, req.body.goal) }); } catch (e) { next(e); }
});

export default r;
