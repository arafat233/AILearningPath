import { generateStudyPlan } from "../services/plannerService.js";
import { StudyPlan, User } from "../models/index.js";

export const getPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const examDate = user?.examDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    const plan = await generateStudyPlan(userId, examDate, user?.goal || "distinction");
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
      { userId, "dailyPlan.day": day },
      { $set: { "dailyPlan.$.completed": true } }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
