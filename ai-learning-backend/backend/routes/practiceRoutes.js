import express from "express";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { getInterleavedQuestion } from "../services/adaptiveService.js";
import { Question } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

r.post("/start",   auth, startTopic);
r.post("/submit",  auth, submitAnswer);
r.get("/teacher",  auth, getTeacherMessage);

// Weakness-weighted question from multiple topics (for mixed/planner sessions)
r.post("/mixed", auth, async (req, res) => {
  try {
    const { topics } = req.body;
    if (!topics?.length) return res.status(400).json({ error: "topics array required" });
    const question = await getInterleavedQuestion(req.user.id, topics);
    if (!question) return res.status(404).json({ error: "No questions found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Flag a question as bad/incorrect
r.post("/flag", auth, async (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) return res.status(400).json({ error: "questionId required" });
    await Question.findByIdAndUpdate(questionId, { $set: { isFlagged: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
