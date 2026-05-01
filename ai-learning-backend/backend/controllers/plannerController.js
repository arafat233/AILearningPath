import { generateStudyPlan } from "../services/plannerService.js";
import { getRevisionTopics } from "../services/revisionService.js";
import { StudyPlan, User } from "../models/index.js";

export const getPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const examDate = user?.examDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    const saved = await StudyPlan.findOne({ userId }).lean();
    const customTopicOrder = saved?.customTopicOrder || [];

    const [plan, revisionDue] = await Promise.all([
      generateStudyPlan(userId, examDate, user?.goal || "distinction", customTopicOrder),
      getRevisionTopics(userId),
    ]);

    // Merge completion state from DB into generated plan
    if (saved?.dailyPlan?.length) {
      const completedDays = new Set(saved.dailyPlan.filter(d => d.completed).map(d => d.day));
      plan.dailyPlan = plan.dailyPlan.map(d => ({
        ...d,
        completed: completedDays.has(d.day),
      }));
    }

    plan.hasCustomOrder = customTopicOrder.length > 0;
    plan.customTopicOrder = customTopicOrder;
    plan.revisionDue = revisionDue.slice(0, 8);
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

export const markDayComplete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { day } = req.body;
    await StudyPlan.findOneAndUpdate(
      { userId },
      { $set: { "dailyPlan.$[el].completed": true } },
      { arrayFilters: [{ "el.day": day }], upsert: false }
    );
    // Also upsert the day entry if it doesn't exist
    await StudyPlan.findOneAndUpdate(
      { userId, "dailyPlan.day": { $ne: day } },
      { $push: { dailyPlan: { day, completed: true } } },
      { upsert: true }
    ).catch(() => {}); // ignore if day already exists (updated above)
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const saveTopicOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicOrder } = req.body;
    await StudyPlan.findOneAndUpdate(
      { userId },
      { $set: { customTopicOrder: topicOrder } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
