import express from "express";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { getInterleavedQuestion } from "../services/adaptiveService.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

// In-memory session store shared with controller (re-use same object)
// The controller exports sessions implicitly via the module — we need our own here
const sessions = {};

r.post("/start",   auth, startTopic);
r.post("/submit",  auth, submitAnswer);
r.get("/teacher",  auth, getTeacherMessage);

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

export default r;
