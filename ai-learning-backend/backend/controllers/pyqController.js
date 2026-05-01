import { getPYQTopics, getPYQs, getPYQById, getPYQYears } from "../services/pyqService.js";

export const listTopics = async (req, res, next) => {
  try {
    const { subject, grade, examBoard } = req.query;
    const topics = await getPYQTopics({ subject, grade, examBoard });
    res.json({ topics });
  } catch (err) {
    next(err);
  }
};

export const listYears = async (req, res, next) => {
  try {
    const { subject, grade, examBoard } = req.query;
    const years = await getPYQYears({ subject, grade, examBoard });
    res.json({ years });
  } catch (err) {
    next(err);
  }
};

export const listQuestions = async (req, res, next) => {
  try {
    const { topic, year, subject, grade, examBoard, difficulty, page, limit } = req.query;
    const result = await getPYQs({ topic, year, subject, grade, examBoard, difficulty, page, limit });
    res.json(result);
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
