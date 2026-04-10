import express from "express";
import { studyAdvice, usageInfo, cacheStats, tutorChat } from "../controllers/aiController.js";
import { getChatResponse } from "../services/aiService.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

r.get("/advice",      auth, studyAdvice);
r.get("/usage",       auth, usageInfo);
r.get("/cache-stats", auth, cacheStats);
r.post("/chat",       auth, tutorChat);

r.post("/evaluate-explanation", auth, async (req, res) => {
  try {
    const { concept, userExplanation } = req.body;
    if (!concept || !userExplanation) {
      return res.status(400).json({ error: "concept and userExplanation are required" });
    }
    const reply = await getChatResponse(
      [],
      `A student is explaining "${concept}" in their own words. Evaluate if they understood it correctly.
Their explanation: "${userExplanation}"

In 2-3 sentences: (1) Did they get it right? (2) What's missing or wrong? (3) One improvement.
Be encouraging but honest.`,
      concept
    );
    res.json({ feedback: reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
