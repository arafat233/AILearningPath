import express from "express";
import Joi from "joi";
import { getPlan, createPlan, updatePlanSettings, deletePlan, markDayComplete, saveTopicOrder } from "../controllers/plannerController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

const planSettingsSchema = Joi.object({
  name:     Joi.string().trim().max(100).optional().allow(""),
  subjects: Joi.array().items(Joi.string().trim().max(100)).min(1).max(10).required(),
  grade:    Joi.string().required(),
  examDate: Joi.date().iso().required(),
  goal:     Joi.string().valid("pass", "distinction", "top", "scholarship").required(),
});

const completeDaySchema = Joi.object({
  day: Joi.number().integer().min(1).required(),
});

const topicOrderSchema = Joi.object({
  topicOrder: Joi.array().items(Joi.string().trim().max(200)).max(100).required(),
});

r.get("/",          auth, getPlan);
r.post("/",         auth, validate(planSettingsSchema),  createPlan);
r.put("/settings",  auth, validate(planSettingsSchema),  updatePlanSettings);
r.delete("/",       auth, deletePlan);
r.post("/complete", auth, validate(completeDaySchema),   markDayComplete);
r.patch("/reorder", auth, validate(topicOrderSchema),    saveTopicOrder);

export default r;
