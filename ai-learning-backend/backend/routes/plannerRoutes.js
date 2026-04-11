import express from "express";
import Joi from "joi";
import { getPlan, markDayComplete } from "../controllers/plannerController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

const completeDaySchema = Joi.object({
  day: Joi.number().integer().min(1).required(),
});

r.get("/",        auth, getPlan);
r.post("/complete", auth, validate(completeDaySchema), markDayComplete);

export default r;
