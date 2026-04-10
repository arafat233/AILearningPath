import express from "express";
import { getRevisionTopics, markRevised } from "../services/revisionService.js";
import { Attempt, UserProfile } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

r.get("/due", auth, async (req, res) => {
  try {
    const topics = await getRevisionTopics(req.user.id);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

r.post("/mark", auth, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "topic is required" });
    const result = await markRevised(req.user.id, topic);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

r.get("/last-day", auth, async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
});

export default r;
