import { Router } from "express";
import auth from "../middleware/auth.js";
import { DoubtThread, User } from "../models/index.js";
import { getChatResponse } from "../services/aiService.js";
import { checkAndIncrementUsage } from "../services/aiRouter.js";

const r = Router();
const MAX_MESSAGES = 20; // cap thread size to prevent unbounded growth

// Get or create thread for a question
r.get("/:questionId", auth, async (req, res) => {
  try {
    const { questionId } = req.params;
    let thread = await DoubtThread.findOne({ userId: req.user.id, questionId }).lean();
    if (!thread) thread = { userId: req.user.id, questionId, messages: [] };
    res.json(thread);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Send a message in the thread
r.post("/:questionId/message", auth, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { message, topic, subject } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "message required" });

    // Only allow doubt chat for real DB questions (not ephemeral AI-generated ones)
    if (questionId === "ai-generated")
      return res.status(400).json({ error: "Doubt chat not available for AI-generated questions" });

    // Check daily AI limit
    const user = await User.findById(req.user.id).select("isPaid plan aiCallsToday aiCallsDate subject").lean();
    const FREE_LIMIT = 10, PRO_LIMIT = 100;
    const today = new Date().toISOString().split("T")[0];
    const callsToday = user?.aiCallsDate === today ? (user?.aiCallsToday || 0) : 0;
    const limit = user?.isPaid ? PRO_LIMIT : FREE_LIMIT;
    if (callsToday >= limit) {
      return res.status(429).json({ error: `Daily AI limit reached (${limit}/day). Upgrade for more.` });
    }

    let thread = await DoubtThread.findOne({ userId: req.user.id, questionId });
    if (!thread) {
      thread = new DoubtThread({ userId: req.user.id, questionId, topic, subject: subject || user?.subject || "Math" });
    }

    // Build history for context (last 8 messages)
    const history = thread.messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
    const reply = await getChatResponse(history, message, topic, subject || thread.subject || user?.subject || "Math");
    if (!reply) return res.status(500).json({ error: "AI response failed. Try again." });

    // Add both messages, cap at MAX_MESSAGES
    thread.messages.push({ role: "user", content: message });
    thread.messages.push({ role: "assistant", content: reply });
    if (thread.messages.length > MAX_MESSAGES) {
      thread.messages = thread.messages.slice(-MAX_MESSAGES);
    }
    thread.updatedAt = new Date();

    await thread.save();

    // Increment usage (non-blocking)
    User.findByIdAndUpdate(req.user.id, {
      aiCallsToday: callsToday + 1,
      aiCallsDate: today,
    }).catch(() => {});

    res.json({ reply, threadId: thread._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Clear thread
r.delete("/:questionId", auth, async (req, res) => {
  try {
    await DoubtThread.findOneAndUpdate(
      { userId: req.user.id, questionId: req.params.questionId },
      { messages: [], updatedAt: new Date() }
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default r;
