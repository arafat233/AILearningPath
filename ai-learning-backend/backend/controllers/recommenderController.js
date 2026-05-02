import { UserTopicMastery } from "../models/index.js";
import { nextQuestion, nextTopic, recordAttempt } from "../services/adaptiveRecommenderService.js";
import { AppError } from "../utils/AppError.js";

// GET /api/v1/recommender/next-topic
export const getNextTopic = async (req, res, next) => {
  try {
    const result = await nextTopic(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/v1/recommender/next-question/:topicId
export const getNextQuestion = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    if (!topicId) return next(new AppError("topicId is required", 400));
    const result = await nextQuestion(req.user.id, topicId);
    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/v1/recommender/mastery/:topicId
export const getTopicMastery = async (req, res, next) => {
  try {
    const tm = await UserTopicMastery.findOne({ userId: req.user.id, topicId: req.params.topicId }).lean();
    if (!tm) return res.json({ topicId: req.params.topicId, mastery: { easy: false, medium: false, hard: false }, currentDifficulty: "easy", secondsOnTopic: 0 });
    res.json({
      topicId:           tm.topicId,
      mastery:           tm.mastery,
      currentDifficulty: tm.currentDifficulty,
      secondsOnTopic:    tm.secondsOnTopic,
      totalAttempts:     tm.attempts.length,
    });
  } catch (err) { next(err); }
};

// POST /api/v1/recommender/record-attempt
// Body: { topicId, questionId, correct, timeSec, selectedOptionIndex?, hintsUsed? }
export const postRecordAttempt = async (req, res, next) => {
  try {
    const { topicId, questionId, correct, timeSec, selectedOptionIndex, hintsUsed } = req.body;
    if (!topicId || !questionId || correct == null || !timeSec) {
      return next(new AppError("topicId, questionId, correct, timeSec are required", 400));
    }
    const result = await recordAttempt(req.user.id, topicId, questionId, correct, timeSec, selectedOptionIndex ?? null, hintsUsed ?? 0);
    res.json(result);
  } catch (err) { next(err); }
};
