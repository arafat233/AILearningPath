import { Question } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";

export const listQuestions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, topic, subject, flagged } = req.query;
    const filter = { deletedAt: { $exists: false } }; // exclude soft-deleted
    if (topic)              filter.topic    = new RegExp(topic, "i");
    if (subject)            filter.subject  = subject;
    if (flagged === "true") filter.isFlagged = true;
    const [questions, total] = await Promise.all([
      Question.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
      Question.countDocuments(filter),
    ]);
    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const getFlaggedQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ isFlagged: true, deletedAt: { $exists: false } }).sort({ createdAt: -1 }).lean();
    res.json(questions);
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
    // Soft-delete: set deletedAt so records can be recovered
    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: { deletedAt: new Date(), isFlagged: false } },
      { new: true }
    );
    if (!q) return next(new AppError("Question not found", 404));
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
