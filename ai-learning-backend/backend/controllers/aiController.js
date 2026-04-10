import { getStudyAdvice, getChatResponse } from "../services/aiService.js";
import { smartStudyAdvice, getUsageCount, getCacheStats } from "../services/aiRouter.js";
import { UserProfile } from "../models/index.js";

// ── Personalised study advice (cached) ────────────────────────────
export const studyAdvice = async (req, res) => {
  try {
    const userId  = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.json({ advice: "Complete some practice questions first to get personalised advice." });
    }
    const advice = await smartStudyAdvice(userId, profile);
    const usage  = await getUsageCount(userId);
    res.json({ advice, usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── AI usage info for current user ────────────────────────────────
export const usageInfo = async (req, res) => {
  try {
    const usage = await getUsageCount(req.user.id);
    res.json(usage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Multi-turn tutor chat ─────────────────────────────────────────
export const tutorChat = async (req, res) => {
  try {
    const { message, history = [], topic } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "message is required" });
    const reply = await getChatResponse(
      history.map((m) => ({ role: m.role, content: m.content })),
      message,
      topic
    );
    res.json({ reply: reply || "I'm here to help! Could you rephrase that?" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Cache stats (shows how much Claude spending is being saved) ───
export const cacheStats = async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
