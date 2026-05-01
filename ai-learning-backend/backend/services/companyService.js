import { User, AIResponseCache } from "../models/index.js";

const todayStr = () => new Date().toISOString().split("T")[0];

const startOf = (unit) => {
  const d = new Date();
  if (unit === "day")   { d.setHours(0, 0, 0, 0); }
  if (unit === "week")  { d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); }
  if (unit === "month") { d.setDate(1); d.setHours(0, 0, 0, 0); }
  return d;
};

export async function getDashboardStats() {
  const today         = todayStr();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const sevenDaysAgo  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000);

  const [
    totalStudents, paidStudents, activeToday,
    freeMaxed, paidMaxed,
    newToday, newThisWeek, newThisMonth, inactive30d,
    planBreakdown, gradeBreakdown, subjectBreakdown, goalBreakdown, roleBreakdown,
    cacheAgg, aiCallsTodayAgg,
    recentSignups, signupTrend,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "student", isPaid: true }),
    User.countDocuments({ role: "student", aiCallsDate: today }),

    // Students who exhausted their free daily AI limit (10 calls)
    User.countDocuments({ role: "student", isPaid: false, aiCallsDate: today, aiCallsToday: { $gte: 10 } }),
    // Students who exhausted their paid daily AI limit (100 calls)
    User.countDocuments({ role: "student", isPaid: true,  aiCallsDate: today, aiCallsToday: { $gte: 100 } }),

    User.countDocuments({ role: "student", createdAt: { $gte: startOf("day") } }),
    User.countDocuments({ role: "student", createdAt: { $gte: startOf("week") } }),
    User.countDocuments({ role: "student", createdAt: { $gte: startOf("month") } }),

    // Dormant: registered >7 days ago, no AI activity in 30 days
    User.countDocuments({
      role: "student",
      createdAt: { $lt: sevenDaysAgo },
      $or: [{ aiCallsDate: "" }, { aiCallsDate: { $lt: thirtyDaysAgo } }],
    }),

    User.aggregate([{ $match: { role: "student" } }, { $group: { _id: "$plan", count: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$grade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    User.aggregate([{ $match: { role: "student" } }, { $group: { _id: "$goal", count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),

    AIResponseCache.aggregate([{
      $group: {
        _id: null,
        total:      { $sum: 1 },
        totalHits:  { $sum: "$hitCount" },
        totalSaved: { $sum: "$savedCalls" },
      },
    }]),

    // Total AI calls made today across all users
    User.aggregate([
      { $match: { aiCallsDate: today } },
      { $group: { _id: null, total: { $sum: "$aiCallsToday" } } },
    ]),

    User.find({ role: "student" })
      .select("name email plan isPaid grade subject createdAt aiCallsToday aiCallsDate")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    // Signup trend: last 7 days, one bucket per day
    User.aggregate([
      { $match: { role: "student", createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const planMap = Object.fromEntries(planBreakdown.map(p => [p._id, p.count]));
  const revenueEstimate = (planMap.pro || 0) * 199 + (planMap.premium || 0) * 499;

  return {
    overview: {
      totalStudents,
      paid: paidStudents,
      free: totalStudents - paidStudents,
      activeToday,
      conversionRate: totalStudents > 0 ? ((paidStudents / totalStudents) * 100).toFixed(1) : "0.0",
    },
    ai: {
      callsToday:      aiCallsTodayAgg[0]?.total || 0,
      maxedToday:      freeMaxed + paidMaxed,
      freeMaxed,
      paidMaxed,
      cachedResponses: cacheAgg[0]?.total      || 0,
      totalCacheHits:  cacheAgg[0]?.totalHits  || 0,
      totalSaved:      cacheAgg[0]?.totalSaved || 0,
    },
    growth: { newToday, newThisWeek, newThisMonth, inactive30d },
    plans: planBreakdown,
    grades: gradeBreakdown,
    subjects: subjectBreakdown,
    goals: goalBreakdown,
    roles: roleBreakdown,
    revenue: {
      estimate: revenueEstimate,
      pro: planMap.pro || 0,
      premium: planMap.premium || 0,
    },
    recentSignups,
    signupTrend,
  };
}
