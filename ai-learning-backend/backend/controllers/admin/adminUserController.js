import { User } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";
import { sessionDel } from "../../utils/redisClient.js";

export const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
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
