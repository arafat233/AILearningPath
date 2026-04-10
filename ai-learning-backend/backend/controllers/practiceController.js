import { Attempt, ErrorMemory } from "../models/index.js";
import { analyzeAnswer } from "../services/analysisService.js";
import { getNextQuestion } from "../services/adaptiveService.js";
import { updateUserProfile } from "../services/profileService.js";
import { checkFoundation } from "../services/foundationService.js";
import { updateQuestionStats } from "../services/selfLearningService.js";
import { updateStreak } from "../services/streakService.js";
import { smartAIExplanation, getUsageCount } from "../services/aiRouter.js";
import { resolveDoubt } from "../services/autoDoubtService.js";
import { generateTeacherMessage } from "../services/aiTeacherService.js";
import { UserProfile } from "../models/index.js";

// In-memory session store (use Redis in production)
const sessions = {};

export const startTopic = async (req, res) => {
  try {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ error: "topicId is required" });
    const userId = req.user.id;

    // Foundation check
    const foundationCheck = await checkFoundation(userId, topicId);
    if (foundationCheck.redirect) {
      sessions[userId] = { topic: foundationCheck.foundationTopic };
      return res.json({
        foundationRedirect: true,
        message: foundationCheck.message,
        foundationTopic: foundationCheck.foundationTopic,
        question: foundationCheck.question,
      });
    }

    sessions[userId] = { topic: topicId, sessionCorrect: 0, sessionTotal: 0 };
    const question = await getNextQuestion(userId, topicId);
    if (!question) return res.status(404).json({ error: "No questions found for this topic yet." });

    sessions[userId].currentQuestion = question;

    // Get AI teacher guidance for this session start
    const profile = await UserProfile.findOne({ userId });
    const teacherMsg = profile
      ? generateTeacherMessage(profile, { questionsAnswered: 0, sessionCorrect: 0 })
      : null;

    res.json({ ...question.toObject?.() ?? question, teacherMessage: teacherMsg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { selectedType, timeTaken, confidence } = req.body;
    if (!selectedType) return res.status(400).json({ error: "selectedType is required" });

    const userId = req.user.id;
    const session = sessions[userId];
    if (!session?.currentQuestion) {
      return res.status(400).json({ error: "No active question. Call /practice/start first." });
    }

    const question = session.currentQuestion;
    const safeTime = Math.max(1, Math.min(Number(timeTaken) || 15, 600));
    const result = analyzeAnswer(question, selectedType, safeTime, confidence);

    // Update session stats
    session.sessionTotal = (session.sessionTotal || 0) + 1;
    if (result.isCorrect) session.sessionCorrect = (session.sessionCorrect || 0) + 1;

    // Persist attempt
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

    // Non-blocking background updates
    if (question._id) updateQuestionStats(question._id, result.isCorrect, safeTime, selectedType).catch(() => {});
    updateUserProfile(userId).catch(() => {});
    updateStreak(userId).catch(() => {});

    // Log to ErrorMemory on wrong answers
    if (!result.isCorrect) {
      ErrorMemory.findOneAndUpdate(
        { userId, topic: session.topic, mistakeType: selectedType },
        {
          $inc: { count: 1 },
          $set: { lastSeen: new Date() },
          $push: { questionSnippets: { $each: [question.questionText.slice(0, 60)], $slice: -5 } },
        },
        { upsert: true }
      ).catch(() => {});
    }

    // ── SMART AI ROUTER (cost-optimized) ──────────────────────────
    let aiExplanation = null;
    let doubtResolution = null;

    if (!result.isCorrect) {
      const correct = question.options?.find((o) => o.type === "correct");

      // Auto doubt detection runs first (classifies the mistake)
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

      // Smart AI explanation — checks DB cache before calling Claude
      aiExplanation = doubtResolution?.aiHelp ||
        await smartAIExplanation(
          userId, question.questionText, selectedType,
          correct?.text, question.solutionSteps || []
        ).catch(() => null);
    }

    // Capture difficulty level before background update settles
    const profileBefore = await UserProfile.findOne({ userId }).catch(() => null);
    const prevLevel = profileBefore?.difficultyLevels?.get?.(session.topic) || 1;

    // AI teacher message based on session progress
    const profile = profileBefore;
    const teacherMessage = profile
      ? generateTeacherMessage(profile, {
          questionsAnswered: session.sessionTotal,
          sessionCorrect: session.sessionCorrect,
        })
      : null;

    // AI usage remaining (awaited properly)
    const aiUsage = await getUsageCount(userId).catch(() => null);

    // Preload next question
    const nextQuestion = await getNextQuestion(userId, session.topic).catch(() => null);
    sessions[userId].currentQuestion = nextQuestion;

    res.json({
      isCorrect: result.isCorrect,
      behavior: result.behavior,
      speedProfile: result.speedProfile,
      confidenceInsight: result.confidenceInsight,
      message: result.message,
      // Auto doubt detection
      doubtType: doubtResolution?.doubtType || null,
      doubtInsight: doubtResolution?.insight || null,
      suggestedAction: doubtResolution?.suggestedAction || null,
      // AI explanation (cost-optimized)
      aiExplanation,
      // Question details
      shortcut: question.shortcut || null,
      solutionSteps: question.solutionSteps || [],
      // Teacher guidance
      teacherMessage,
      // AI usage info
      aiUsage,
      aiFromCache: !!(aiExplanation && question.solutionSteps?.length === 0),
      // Next question
      nextQuestion,
      // Difficulty level for this topic
      difficultyLevel: prevLevel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Teacher message endpoint (for dashboard) ─────────────────────
export const getTeacherMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) return res.json({ message: "Start practicing to get personalised guidance!", type: "welcome" });

    const msg = generateTeacherMessage(profile);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
