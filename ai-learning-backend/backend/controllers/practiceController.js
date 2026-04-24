import { Attempt, ErrorMemory, User } from "../models/index.js";
import { analyzeAnswer } from "../services/analysisService.js";
import { getNextQuestion } from "../services/adaptiveService.js";
import { updateUserProfile } from "../services/profileService.js";
import { checkFoundation } from "../services/foundationService.js";
import { updateQuestionStats } from "../services/selfLearningService.js";
import { updateStreak } from "../services/streakService.js";
import { smartAIExplanation, getUsageCount } from "../services/aiRouter.js";
import { resolveDoubt } from "../services/autoDoubtService.js";
import { generateTeacherMessage } from "../services/aiTeacherService.js";
import { checkAndAwardBadges } from "../services/badgeService.js";
import { UserProfile, Streak } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { sessionGet, sessionSet } from "../utils/redisClient.js";

const SESSION_TTL = 7200; // 2 hours — max length of a practice session
const sessionKey  = (userId) => `practice:${userId}`;

export const startTopic = async (req, res, next) => {
  try {
    const { topicId } = req.body;
    const userId = req.user.id;

    // Foundation check
    const foundationCheck = await checkFoundation(userId, topicId);
    if (foundationCheck.redirect) {
      await sessionSet(sessionKey(userId), { topic: foundationCheck.foundationTopic }, SESSION_TTL);
      return res.json({
        foundationRedirect: true,
        message: foundationCheck.message,
        foundationTopic: foundationCheck.foundationTopic,
        question: foundationCheck.question,
      });
    }

    const question = await getNextQuestion(userId, topicId);
    if (!question) return next(new AppError("No questions found for this topic yet.", 404));

    await sessionSet(sessionKey(userId), {
      topic: topicId,
      sessionCorrect: 0,
      sessionTotal: 0,
      currentQuestion: question.toObject?.() ?? question,
    }, SESSION_TTL);

    const profile = await UserProfile.findOne({ userId });
    const teacherMsg = profile
      ? generateTeacherMessage(profile, { questionsAnswered: 0, sessionCorrect: 0 })
      : null;

    res.json({ ...question.toObject?.() ?? question, teacherMessage: teacherMsg });
  } catch (err) {
    next(err);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { selectedType, timeTaken, confidence } = req.body;

    const userId = req.user.id;
    const session = await sessionGet(sessionKey(userId));
    if (!session?.currentQuestion) {
      return next(new AppError("No active question. Call /practice/start first.", 400));
    }

    const question = session.currentQuestion;
    const safeTime = Math.max(1, Math.min(Number(timeTaken) || 15, 600));
    const result = analyzeAnswer(question, selectedType, safeTime, confidence);

    session.sessionTotal  = (session.sessionTotal  || 0) + 1;
    if (result.isCorrect) session.sessionCorrect = (session.sessionCorrect || 0) + 1;

    await Attempt.create({
      userId,
      questionId: question._id?.toString() || "ai-generated",
      topic: session.topic,
      isCorrect: result.isCorrect,
      selectedType,
      timeTaken: safeTime,
      confidence: confidence || "medium",
      difficulty: question.difficultyScore || 0.5,
    });

    if (question._id) updateQuestionStats(question._id, result.isCorrect, safeTime, selectedType).catch((err) => logger.warn("updateQuestionStats failed", { err: err.message, questionId: question._id }));
    updateUserProfile(userId).catch((err) => logger.warn("updateUserProfile failed", { err: err.message, userId }));
    await updateStreak(userId).catch((err) => logger.warn("updateStreak failed", { err: err.message, userId }));

    if (!result.isCorrect) {
      ErrorMemory.findOneAndUpdate(
        { userId, topic: session.topic, mistakeType: selectedType },
        {
          $inc: { count: 1 },
          $set: { lastSeen: new Date() },
          $push: { questionSnippets: { $each: [question.questionText.slice(0, 60)], $slice: -5 } },
        },
        { upsert: true }
      ).catch((err) => logger.warn("ErrorMemory update failed", { err: err.message, userId }));
    }

    let aiExplanation = null;
    let doubtResolution = null;

    if (!result.isCorrect) {
      const correct = question.options?.find((o) => o.type === "correct");

      doubtResolution = await resolveDoubt(
        userId,
        question.questionText,
        selectedType,
        correct?.text,
        question.solutionSteps || [],
        safeTime,
        question.expectedTime,
        session.topic
      ).catch(() => null);

      const userDoc2 = await User.findById(userId).select("subject").catch(() => null);
      aiExplanation = doubtResolution?.aiHelp ||
        await smartAIExplanation(
          userId, question.questionText, selectedType,
          correct?.text, question.solutionSteps || [],
          userDoc2?.subject || "Math"
        ).catch(() => null);
    }

    const profileBefore = await UserProfile.findOne({ userId }).catch(() => null);
    const prevLevel = profileBefore?.difficultyLevels?.get?.(session.topic) || 1;

    const profile = profileBefore;
    const userDoc = await User.findById(userId).select("goal").catch(() => null);
    const teacherMessage = profile
      ? generateTeacherMessage(
          profile,
          { questionsAnswered: session.sessionTotal, sessionCorrect: session.sessionCorrect },
          userDoc?.goal || "distinction"
        )
      : null;

    const aiUsage = await getUsageCount(userId).catch(() => null);

    const streakDoc = await Streak.findOne({ userId }).lean().catch(() => null);
    const newBadges = await checkAndAwardBadges(userId, {
      streak:       streakDoc?.currentStreak || 0,
      totalAttempts: (profileBefore?.totalAttempts || 0) + 1,
      topic:        session.topic,
      topicAccuracy: profileBefore?.topicProgress?.find((t) => t.topic === session.topic)?.accuracy,
      topicAttempts: profileBefore?.topicProgress?.find((t) => t.topic === session.topic)?.attempts,
    }).catch(() => []);

    const nextQuestion = await getNextQuestion(userId, session.topic).catch(() => null);
    await sessionSet(sessionKey(userId), {
      ...session,
      currentQuestion: nextQuestion?.toObject?.() ?? nextQuestion ?? null,
    }, SESSION_TTL);

    res.json({
      isCorrect: result.isCorrect,
      behavior: result.behavior,
      speedProfile: result.speedProfile,
      confidenceInsight: result.confidenceInsight,
      message: result.message,
      doubtType: doubtResolution?.doubtType || null,
      doubtInsight: doubtResolution?.insight || null,
      suggestedAction: doubtResolution?.suggestedAction || null,
      aiExplanation,
      shortcut: question.shortcut || null,
      solutionSteps: question.solutionSteps || [],
      teacherMessage,
      aiUsage,
      aiFromCache: !!(aiExplanation && question.solutionSteps?.length === 0),
      newBadges,
      nextQuestion,
      difficultyLevel: prevLevel,
    });
  } catch (err) {
    next(err);
  }
};

export const getTeacherMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) return res.json({ message: "Start practicing to get personalised guidance!", type: "welcome" });

    const msg = generateTeacherMessage(profile);
    res.json(msg);
  } catch (err) {
    next(err);
  }
};
