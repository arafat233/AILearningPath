import express from "express";
import Joi from "joi";
import { getLesson, listLessons, saveProgress } from "../controllers/lessonController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

const progressSchema = Joi.object({
  topic:      Joi.string().required(),
  mode:       Joi.string().optional(),
  slideIndex: Joi.number().integer().min(0).optional(),
  completed:  Joi.boolean().optional(),
});

r.get("/",         auth, listLessons);
r.get("/:topic",   auth, getLesson);
r.post("/progress", auth, validate(progressSchema), saveProgress);

export default r;
