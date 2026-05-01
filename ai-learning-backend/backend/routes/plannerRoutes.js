import express from "express";
import Joi from "joi";
import { getPlan, markDayComplete, saveTopicOrder } from "../controllers/plannerController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

const completeDaySchema = Joi.object({
  day: Joi.number().integer().min(1).required(),
});

const topicOrderSchema = Joi.object({
  topicOrder: Joi.array().items(Joi.string().trim().max(200)).max(100).required(),
});

r.get("/",             auth, getPlan);
r.post("/complete",    auth, validate(completeDaySchema), markDayComplete);
r.patch("/reorder",    auth, validate(topicOrderSchema),  saveTopicOrder);

export default r;
