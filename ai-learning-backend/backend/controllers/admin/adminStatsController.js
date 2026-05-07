import { User, Question, Attempt, PaymentRecord, AIUsageStats } from "../../models/index.js";
import { getCacheStats } from "../../services/aiRouter.js";

// Claude Haiku 4.5 pricing (USD)
const HAIKU_INPUT_PER_M  = 0.80;
const HAIKU_OUTPUT_PER_M = 4.00;
// We track output tokens only; use output price for cost estimate
const costUSD = (tokens) => parseFloat(((tokens / 1_000_000) * HAIKU_OUTPUT_PER_M).toFixed(4));

export const getAdminStats = async (req, res, next) => {
  try {
    const now   = new Date();
    const today = now.toISOString().split("T")[0];
    const d7    = new Date(now - 7 * 86400_000);

    const [
      totalUsers,
      paidUsers,
      totalQuestions,
      totalAttempts,
      aiStats,
      planBreakdown,
      revenueAgg,
      claudeAgg,
      revTrend7,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPaid: true }),
      Question.countDocuments(),
      Attempt.countDocuments(),
      getCacheStats(),
      User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
      // All-time captured revenue in paise
      PaymentRecord.aggregate([
        { $match: { status: "captured" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      // All-time Claude API usage
      AIUsageStats.aggregate([
        { $group: { _id: null, calls: { $sum: "$callsMade" }, tokens: { $sum: "$tokensUsed" } } },
      ]),
      // Revenue per day for last 7 days (sparkline)
      PaymentRecord.aggregate([
        { $match: { createdAt: { $gte: d7 }, status: "captured" } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, rev: { $sum: "$amount" } } },
      ]),
    ]);

    const activeToday = await User.countDocuments({ lastActiveDate: today });

    // Build 7-day sparkline slots
    const revMap = Object.fromEntries(revTrend7.map((r) => [r._id, r.rev]));
    const revenueSparkline = Array.from({ length: 7 }, (_, i) => {
      const d    = new Date(now - (6 - i) * 86400_000);
      const date = d.toISOString().split("T")[0];
      return { date, value: Math.round((revMap[date] || 0) / 100) };
    });

    const totalRevenuePaise = revenueAgg[0]?.total  || 0;
    const totalPayments     = revenueAgg[0]?.count  || 0;
    const claudeCalls       = claudeAgg[0]?.calls   || 0;
    const claudeTokens      = claudeAgg[0]?.tokens  || 0;

    res.json({
      totalUsers,
      paidUsers,
      freeUsers:    totalUsers - paidUsers,
      activeToday,
      totalQuestions,
      totalAttempts,
      planBreakdown: planBreakdown.reduce((acc, p) => { acc[p._id || "free"] = p.count; return acc; }, {}),
      revenue: {
        totalPaise:   totalRevenuePaise,
        totalRupees:  Math.round(totalRevenuePaise / 100),
        totalPayments,
      },
      claude: {
        totalCalls:         claudeCalls,
        totalTokens:        claudeTokens,
        estimatedCostUSD:   costUSD(claudeTokens),
        callsSaved:         aiStats.totalClaudeCallsSaved,
        estimatedSavedUSD:  parseFloat(((aiStats.totalClaudeCallsSaved / 1_000_000) * HAIKU_OUTPUT_PER_M * 300).toFixed(4)),
      },
      aiCache: aiStats,
      revenueSparkline,
    });
  } catch (err) { next(err); }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const now   = new Date();
    const d30   = new Date(now - 30 * 86400_000);
    const d7    = new Date(now - 7  * 86400_000);
    const today = now.toISOString().split("T")[0];

    const dateStr = (d) => d.toISOString().split("T")[0];

    // Build last 30 day slots so gaps show as 0
    const slots30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now - (29 - i) * 86400_000);
      return dateStr(d);
    });

    const [
      totalUsers,
      paidUsers,
      dau,
      mau,
      newUsersTrend,
      revenueTrend,
      totalRevenue,
      retention7d,
      attemptsTrend,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPaid: true }),
      User.countDocuments({ lastActiveDate: today }),
      User.countDocuments({ lastActiveDate: { $gte: dateStr(d30) } }),

      // New registrations per day, last 30 days
      User.aggregate([
        { $match: { createdAt: { $gte: d30 } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Revenue per day, last 30 days
      PaymentRecord.aggregate([
        { $match: { createdAt: { $gte: d30 }, status: "captured" } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$amount" } } },
        { $sort: { _id: 1 } },
      ]),

      // Total revenue all-time
      PaymentRecord.aggregate([
        { $match: { status: "captured" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // 7-day retention: users created before 7 days ago who were active in last 7 days
      User.countDocuments({
        createdAt:      { $lt: d7 },
        lastActiveDate: { $gte: dateStr(d7) },
      }),

      // Practice attempts per day, last 30 days
      Attempt.aggregate([
        { $match: { createdAt: { $gte: d30 } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Merge aggregation results into slot arrays (fill gaps with 0)
    const fillSlots = (rows, key, divisor = 1) => {
      const map = Object.fromEntries(rows.map((r) => [r._id, r[key]]));
      return slots30.map((d) => ({ date: d, value: Math.round((map[d] || 0) / divisor) }));
    };

    const usersBeforeD7 = await User.countDocuments({ createdAt: { $lt: d7 } });

    res.json({
      summary: {
        dau,
        mau,
        totalUsers,
        paidUsers,
        conversionRate: totalUsers > 0 ? parseFloat(((paidUsers / totalUsers) * 100).toFixed(1)) : 0,
        retention7d:    usersBeforeD7 > 0 ? parseFloat(((retention7d / usersBeforeD7) * 100).toFixed(1)) : 0,
        totalRevenue:   Math.round((totalRevenue[0]?.total || 0) / 100),
      },
      trends: {
        newUsers:  fillSlots(newUsersTrend,  "count"),
        revenue:   fillSlots(revenueTrend,   "revenue", 100), // paise → rupees
        attempts:  fillSlots(attemptsTrend,  "count"),
      },
    });
  } catch (err) { next(err); }
};
