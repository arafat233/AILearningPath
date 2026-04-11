import { User, Question, Topic, AIResponseCache, Attempt, Badge } from "../models/index.js";
import { getCacheStats } from "../services/aiRouter.js";

// ── Users ──────────────────────────────────────────────────────────
export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "admin", "parent", "teacher"].includes(role))
      return res.status(400).json({ error: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Questions ──────────────────────────────────────────────────────
export const listQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20, topic, subject, flagged } = req.query;
    const filter = {};
    if (topic)   filter.topic   = new RegExp(topic, "i");
    if (subject) filter.subject = subject;
    if (flagged === "true") filter.isFlagged = true;
    const [questions, total] = await Promise.all([
      Question.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
      Question.countDocuments(filter),
    ]);
    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createQuestion = async (req, res) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ error: "Question not found" });
    res.json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const unflagQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, { isFlagged: false }, { new: true });
    if (!q) return res.status(404).json({ error: "Question not found" });
    res.json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getFlaggedQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isFlagged: true }).sort({ createdAt: -1 }).lean();
    res.json(questions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Topics ─────────────────────────────────────────────────────────
export const listTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ subject: 1, name: 1 }).lean();
    res.json(topics);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createTopic = async (req, res) => {
  try {
    const t = await Topic.create(req.body);
    res.status(201).json(t);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateTopic = async (req, res) => {
  try {
    const t = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ error: "Topic not found" });
    res.json(t);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Stats ──────────────────────────────────────────────────────────
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalQuestions, totalAttempts, aiStats, planBreakdown] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Attempt.countDocuments(),
      getCacheStats(),
      User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
    ]);

    // Active today = users who have aiCallsDate === today
    const today = new Date().toISOString().split("T")[0];
    const activeToday = await User.countDocuments({ aiCallsDate: today, aiCallsToday: { $gt: 0 } });

    res.json({
      totalUsers,
      activeToday,
      totalQuestions,
      totalAttempts,
      planBreakdown: planBreakdown.reduce((acc, p) => { acc[p._id || "free"] = p.count; return acc; }, {}),
      aiCache: aiStats,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
