import express from "express";
import { getRevisionTopics, markRevised } from "../services/revisionService.js";
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
    await markRevised(req.user.id, topic);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
