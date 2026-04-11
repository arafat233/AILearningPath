import express from "express";
import Joi from "joi";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { getInterleavedQuestion } from "../services/adaptiveService.js";
import { Question } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";

const r = express.Router();

const startSchema = Joi.object({
  topicId: Joi.string().required(),
});

const submitSchema = Joi.object({
  selectedType: Joi.string().required(),
  timeTaken:    Joi.number().min(1).max(600).optional(),
  confidence:   Joi.string().valid("low", "medium", "high").optional(),
});

const mixedSchema = Joi.object({
  topics: Joi.array().items(Joi.string()).min(1).required(),
});

const flagSchema = Joi.object({
  questionId: Joi.string().required(),
});

r.post("/start",   auth, validate(startSchema),  startTopic);
r.post("/submit",  auth, validate(submitSchema), submitAnswer);
r.get("/teacher",  auth, getTeacherMessage);

r.post("/mixed", auth, validate(mixedSchema), async (req, res, next) => {
  try {
    const { topics } = req.body;
    const question = await getInterleavedQuestion(req.user.id, topics);
    if (!question) return next(new AppError("No questions found", 404));
    res.json(question);
  } catch (err) {
    next(err);
  }
});

r.post("/flag", auth, validate(flagSchema), async (req, res, next) => {
  try {
    const { questionId } = req.body;
    await Question.findByIdAndUpdate(questionId, { $set: { isFlagged: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default r;
