import express from "express";
import Joi from "joi";
import { Topic, User, UserProfile } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

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
    const topics = await Topic.find().sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

r.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.json({ user, profile });
  } catch (err) {
    next(err);
  }
});

r.put("/me", auth, validate(updateMeSchema), async (req, res, next) => {
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

export default r;
