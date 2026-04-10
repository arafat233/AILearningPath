import express from "express";
import { getReport } from "../controllers/analysisController.js";
import { ErrorMemory, WeeklyLeaderboard } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

r.get("/report", auth, getReport);

r.get("/errors", auth, async (req, res) => {
  try {
    const errors = await ErrorMemory.find({ userId: req.user.id })
      .sort({ count: -1 })
      .limit(10)
      .lean();
    res.json(errors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

r.get("/weekly-leaderboard", auth, async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    const weekStr = `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;

    const board = await WeeklyLeaderboard.find({ week: weekStr })
      .sort({ score: -1 })
      .limit(20)
      .lean();

    const userEntry = board.find((b) => b.userId === req.user.id);
    res.json({ board, userEntry, week: weekStr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
