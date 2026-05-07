import { User, UserProfile, Attempt } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";
import { sessionDel } from "../../utils/redisClient.js";

const CHILD_EMAIL_SUFFIX = "@stellar.child";

export const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    // Always exclude synthetic child sub-accounts
    const base = { email: { $not: /stellar\.child$/ } };
    const filter = search
      ? { ...base, $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : base;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    // For each user, attach their parent name if they're a child account linked by a parent
    const userIds = users.map((u) => u._id.toString());
    const parents = await User.find(
      { linkedStudents: { $in: userIds } },
      { name: 1, email: 1, linkedStudents: 1 }
    ).lean();

    const childToParent = {};
    for (const p of parents) {
      for (const cid of p.linkedStudents) {
        childToParent[cid] = { name: p.name, email: p.email };
      }
    }

    const enriched = users.map((u) => ({
      ...u,
      parentInfo: childToParent[u._id.toString()] || null,
    }));

    res.json({ users: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return next(new AppError("User not found", 404));

    // Immediately bust the role cache so demotion takes effect on the next request
    await sessionDel(`admin_role:${req.params.id}`).catch(() => {});

    res.json(user);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      UserProfile.findOneAndDelete({ userId: req.params.id }).catch(() => {}),
    ]);
    res.json({ data: { message: "User deleted" } });
  } catch (err) { next(err); }
};

export const getUserDetail = async (req, res, next) => {
  try {
    const [user, profile, attemptAgg] = await Promise.all([
      User.findById(req.params.id).select("-password").lean(),
      UserProfile.findOne({ userId: req.params.id }).lean(),
      Attempt.aggregate([
        { $match: { userId: req.params.id } },
        { $group: { _id: null, total: { $sum: 1 }, correct: { $sum: { $cond: ["$isCorrect", 1, 0] } } } },
      ]),
    ]);
    if (!user) return next(new AppError("User not found", 404));
    res.json({ data: { user, profile, attemptStats: attemptAgg[0] || { total: 0, correct: 0 } } });
  } catch (err) { next(err); }
};

export const updateUserPlan = async (req, res, next) => {
  try {
    const { plan, isPaid, daysToAdd = 30 } = req.body;
    const update = { plan, isPaid };
    if (isPaid && daysToAdd > 0) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + daysToAdd);
      update.planExpiry = expiry;
    } else if (!isPaid) {
      update.planExpiry = null;
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return next(new AppError("User not found", 404));
    res.json({ data: user });
  } catch (err) { next(err); }
};
