import express from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { User } from "../models/index.js";
import logger from "../utils/logger.js";

const r = express.Router();

// NPS (0-10) + optional free-text comment
const feedbackSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  score:     { type: Number, min: 0, max: 10, required: true }, // NPS 0-10
  comment:   { type: String, default: "" },
  context:   { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", feedbackSchema);

const submitSchema = Joi.object({
  score:   Joi.number().integer().min(0).max(10).required(),
  comment: Joi.string().max(1000).allow("").optional(),
  context: Joi.string().max(50).allow("").optional(),
});

// Submit NPS feedback
r.post("/", auth, validate(submitSchema), async (req, res, next) => {
  try {
    const { score, comment, context } = req.body;
    await Feedback.create({ userId: req.user.id, score, comment: comment || "", context: context || "nps" });
    // Mark user so we don't resurface the survey for 30 days
    await User.findByIdAndUpdate(req.user.id, { $set: { npsLastShownAt: new Date() } });
    logger.info("NPS feedback received", { userId: req.user.id, score, context });
    res.json({ data: { message: "Thank you for your feedback!" } });
  } catch (err) { next(err); }
});

// Check if this user should be shown the NPS survey
// Eligible if: 5+ attempts AND (never shown OR last shown > 30 days ago)
r.get("/nps-eligible", auth, async (req, res, next) => {
  try {
    const { Attempt, User: UserModel } = await import("../models/index.js");
    const [user, attempts] = await Promise.all([
      UserModel.findById(req.user.id).select("npsLastShownAt createdAt").lean(),
      Attempt.countDocuments({ userId: req.user.id }),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000);
    const sevenDaysAgo  = new Date(Date.now() -  7 * 86400_000);
    const accountAgeOk  = !user?.createdAt || new Date(user.createdAt) < sevenDaysAgo;

    const eligible =
      attempts >= 20 &&
      accountAgeOk &&
      (!user?.npsLastShownAt || new Date(user.npsLastShownAt) < thirtyDaysAgo);

    res.json({ data: { eligible } });
  } catch (err) { next(err); }
});

// Admin: NPS stats + raw responses
r.get("/", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    const items = await Feedback.find().sort({ createdAt: -1 }).limit(500).lean();
    if (!items.length) return res.json({ data: { nps: null, avg: null, total: 0, items: [] } });

    const avg = parseFloat((items.reduce((s, f) => s + f.score, 0) / items.length).toFixed(2));

    // NPS = %promoters (9-10) - %detractors (0-6)
    const promoters  = items.filter((f) => f.score >= 9).length;
    const detractors = items.filter((f) => f.score <= 6).length;
    const nps = Math.round(((promoters - detractors) / items.length) * 100);

    res.json({ data: { nps, avg, total: items.length, promoters, detractors, items } });
  } catch (err) { next(err); }
});

export default r;
