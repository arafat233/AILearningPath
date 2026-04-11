import { User, Question, Attempt } from "../../models/index.js";
import { getCacheStats } from "../../services/aiRouter.js";

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
