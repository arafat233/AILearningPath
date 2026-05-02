import { User, Question, Attempt, PaymentRecord } from "../../models/index.js";
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
    const activeToday = await User.countDocuments({ lastActiveDate: today });

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
