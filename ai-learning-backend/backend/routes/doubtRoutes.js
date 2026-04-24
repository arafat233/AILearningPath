import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
import { DoubtThread, User } from "../models/index.js";
import { getChatResponse } from "../services/aiService.js";

const r = Router();
const MAX_MESSAGES = 20;

// SEC-15: max 2000 chars on message to cap AI token costs
const messageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required(),
  topic:   Joi.string().optional().allow(""),
  subject: Joi.string().optional().allow(""),
});

// Get or create thread for a question
r.get("/:questionId", auth, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    let thread = await DoubtThread.findOne({ userId: req.user.id, questionId }).lean();
    if (!thread) thread = { userId: req.user.id, questionId, messages: [] };
    res.json(thread);
  } catch (err) { next(err); }
});

// Send a message in the thread
r.post("/:questionId/message", auth, validate(messageSchema), async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { message, topic, subject } = req.body;

    if (questionId === "ai-generated")
      return next(new AppError("Doubt chat not available for AI-generated questions", 400));

    const FREE_LIMIT = 10;
    const PRO_LIMIT  = 100;
    const today      = new Date().toISOString().split("T")[0];

    // SEC-13: Atomic counter update — prevents race condition where two concurrent
    // requests both pass the limit check and both increment, exceeding the cap
    const user = await User.findById(req.user.id).select("isPaid").lean();
    const limit = user?.isPaid ? PRO_LIMIT : FREE_LIMIT;

    const updated = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        $or: [
          { aiCallsDate: { $ne: today } },
          { aiCallsToday: { $lt: limit } },
        ],
      },
      [{
        $set: {
          aiCallsToday: {
            $cond: [{ $eq: ["$aiCallsDate", today] }, { $add: ["$aiCallsToday", 1] }, 1],
          },
          aiCallsDate: today,
        },
      }],
      { new: true, select: "subject aiCallsToday" }
    );

    if (!updated) {
      return next(new AppError(`Daily AI limit reached (${limit}/day). Upgrade for more.`, 429));
    }

    let thread = await DoubtThread.findOne({ userId: req.user.id, questionId });
    if (!thread) {
      thread = new DoubtThread({
        userId: req.user.id,
        questionId,
        topic,
        subject: subject || updated?.subject || "Math",
      });
    }

    const history = thread.messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
    const reply   = await getChatResponse(history, message, topic, subject || thread.subject || updated?.subject || "Math");
    if (!reply) return next(new AppError("AI response failed. Try again.", 500));

    thread.messages.push({ role: "user",      content: message });
    thread.messages.push({ role: "assistant", content: reply });
    if (thread.messages.length > MAX_MESSAGES) {
      thread.messages = thread.messages.slice(-MAX_MESSAGES);
    }
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply, threadId: thread._id });
  } catch (err) { next(err); }
});

// Clear thread
r.delete("/:questionId", auth, async (req, res, next) => {
  try {
    await DoubtThread.findOneAndUpdate(
      { userId: req.user.id, questionId: req.params.questionId },
      { messages: [], updatedAt: new Date() }
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default r;
