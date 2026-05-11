import { getPYQTopics, getPYQs, getPYQById, getPYQYears, getPYQChapters } from "../services/pyqService.js";
import { User } from "../models/index.js";

// Always use the authenticated user's examBoard — ignore any client-supplied value
async function userBoard(req) {
  if (!req.user?.id) return "CBSE";
  const u = await User.findById(req.user.id).select("examBoard").lean();
  return (u?.examBoard || "CBSE").toUpperCase();
}

export const listTopics = async (req, res, next) => {
  try {
    const { subject, grade, year, years } = req.query;
    const examBoard = await userBoard(req);
    const topics = await getPYQTopics({ subject, grade, examBoard, year, years });
    res.json({ topics });
  } catch (err) {
    next(err);
  }
};

export const listYears = async (req, res, next) => {
  try {
    const { subject, grade } = req.query;
    const examBoard = await userBoard(req);
    const years = await getPYQYears({ subject, grade, examBoard });
    res.json({ years });
  } catch (err) {
    next(err);
  }
};

export const listQuestions = async (req, res, next) => {
  try {
    const { topic, topics, year, years, chapter, chapters, subject, grade, difficulty, page, limit } = req.query;
    const examBoard = await userBoard(req);
    const result = await getPYQs({ topic, topics, year, years, chapter, chapters, subject, grade, examBoard, difficulty, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const listChapters = async (req, res, next) => {
  try {
    const { subject, grade, year, years } = req.query;
    const examBoard = await userBoard(req);
    const chapters = await getPYQChapters({ subject, grade, examBoard, year, years });
    res.json({ chapters });
  } catch (err) {
    next(err);
  }
};

export const getQuestion = async (req, res, next) => {
  try {
    const q = await getPYQById(req.params.id);
    if (!q) return res.status(404).json({ error: "Question not found" });
    res.json({ question: q });
  } catch (err) {
    next(err);
  }
};
