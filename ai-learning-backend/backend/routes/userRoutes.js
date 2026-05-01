import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { Attempt, Badge, DoubtThread, ErrorMemory, Streak, Topic, User, UserProfile } from "../models/index.js";
import { LessonProgress } from "../models/lessonModel.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const updateMeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many profile updates. Try again in an hour." },
});

const r = express.Router();

const updateMeSchema = Joi.object({
  name:       Joi.string().trim().min(2).max(80).optional(),
  examDate:   Joi.date().iso().optional(),
  grade:      Joi.string().optional(),
  subject:    Joi.string().optional(),
  goal:       Joi.string().optional(),
  weakTopics: Joi.array().items(Joi.string()).optional(),
});

// SEC-16: requires auth — topics list is product IP, not public data
r.get("/topics", auth, async (req, res, next) => {
  try {
    const filter = { deletedAt: null };
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.grade)   filter.grade   = req.query.grade;
    const topics = await Topic.find(filter).sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

r.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.json({ data: { user, profile } });
  } catch (err) {
    next(err);
  }
});

r.put("/me", auth, updateMeLimiter, validate(updateMeSchema), async (req, res, next) => {
  try {
    const { name, examDate, grade, subject, goal, weakTopics } = req.body;
    const updates = {};
    if (name)     updates.name     = name.trim();
    if (examDate) updates.examDate = new Date(examDate);
    if (grade)    updates.grade    = grade;
    if (subject)  updates.subject  = subject;
    if (goal)     updates.goal     = goal;
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select("-password");

    if (Array.isArray(weakTopics)) {
      await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { weakAreas: weakTopics } },
        { upsert: true }
      );
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GDPR / PDPB: account + all personal data deletion
r.delete("/me", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Promise.all([
      User.findByIdAndDelete(userId),
      UserProfile.deleteOne({ userId }),
      Attempt.deleteMany({ userId }),
      ErrorMemory.deleteMany({ userId }),
      Streak.deleteOne({ userId }),
      Badge.deleteMany({ userId }),
      DoubtThread.deleteMany({ userId }),
      LessonProgress?.deleteMany({ userId }),
    ]);
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json({ data: { message: "Account and all personal data deleted." } });
  } catch (err) {
    next(err);
  }
});

export default r;
