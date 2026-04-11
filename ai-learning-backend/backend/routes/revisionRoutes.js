import express from "express";
import Joi from "joi";
import { getRevisionTopics, markRevised } from "../services/revisionService.js";
import { Attempt, UserProfile } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";

const r = express.Router();

const markSchema = Joi.object({
  topic: Joi.string().required(),
});

r.get("/due", auth, async (req, res, next) => {
  try {
    const topics = await getRevisionTopics(req.user.id);
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

r.post("/mark", auth, validate(markSchema), async (req, res, next) => {
  try {
    const { topic } = req.body;
    const result = await markRevised(req.user.id, topic);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

r.get("/last-day", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ userId });

    const topMistakes = Object.entries(profile?.behaviorStats || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));

    const weakTopics = profile?.weakAreas || [];

    const recentWrong = await Attempt.find({ userId, isCorrect: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ topMistakes, weakTopics, recentWrong, mode: "last_day" });
  } catch (err) {
    next(err);
  }
});

export default r;
