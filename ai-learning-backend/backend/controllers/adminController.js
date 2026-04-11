import { User, Question, Topic, AIResponseCache, Attempt, Badge } from "../models/index.js";
import { getCacheStats } from "../services/aiRouter.js";
import { AppError } from "../utils/AppError.js";

// ── Users ──────────────────────────────────────────────────────────
export const listUsers = async (req, res, next) => {
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
  } catch (err) { next(err); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return next(new AppError("User not found", 404));
    res.json(user);
  } catch (err) { next(err); }
};

// ── Questions ──────────────────────────────────────────────────────
export const listQuestions = async (req, res, next) => {
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
  } catch (err) { next(err); }
};

export const createQuestion = async (req, res, next) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) { next(err); }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return next(new AppError("Question not found", 404));
    res.json(q);
  } catch (err) { next(err); }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

export const unflagQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, { isFlagged: false }, { new: true });
    if (!q) return next(new AppError("Question not found", 404));
    res.json(q);
  } catch (err) { next(err); }
};

export const getFlaggedQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ isFlagged: true }).sort({ createdAt: -1 }).lean();
    res.json(questions);
  } catch (err) { next(err); }
};

// ── Topics ─────────────────────────────────────────────────────────
export const listTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find().sort({ subject: 1, name: 1 }).lean();
    res.json(topics);
  } catch (err) { next(err); }
};

export const createTopic = async (req, res, next) => {
  try {
    const t = await Topic.create(req.body);
    res.status(201).json(t);
  } catch (err) { next(err); }
};

export const updateTopic = async (req, res, next) => {
  try {
    const t = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return next(new AppError("Topic not found", 404));
    res.json(t);
  } catch (err) { next(err); }
};

export const deleteTopic = async (req, res, next) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

// ── Stats ──────────────────────────────────────────────────────────
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalQuestions, totalAttempts, aiStats, planBreakdown] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Attempt.countDocuments(),
      getCacheStats(),
      User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
    ]);

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
  } catch (err) { next(err); }
};
