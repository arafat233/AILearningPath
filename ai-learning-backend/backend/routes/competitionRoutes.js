import express from "express";
import { auth } from "../middleware/auth.js";
import { Question } from "../models/index.js";

const r = express.Router();

// Get questions for a live room (host calls this)
r.post("/room-questions", auth, async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
});

export default r;
