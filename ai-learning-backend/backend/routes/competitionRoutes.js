import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Question } from "../models/index.js";

const r = express.Router();

const roomQuestionsSchema = Joi.object({
  topic: Joi.string().optional().allow(""),
  count: Joi.number().integer().min(1).max(50).optional(),
});

// Get questions for a live room (host calls this)
r.post("/room-questions", auth, validate(roomQuestionsSchema), async (req, res, next) => {
  try {
    const { topic, count = 10 } = req.body;
    const filter = topic ? { topic } : {};
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: Number(count) } },
      { $project: { questionText: 1, options: 1, difficultyScore: 1, expectedTime: 1 } },
    ]);
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

export default r;
