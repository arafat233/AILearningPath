import { generateStudyPlan } from "../services/plannerService.js";
import { getRevisionTopics } from "../services/revisionService.js";
import { StudyPlan, User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

const buildPlanResponse = async (userId, saved) => {
  const subjects         = saved.subjects?.length ? saved.subjects : [saved.subject || "Math"];
  const customTopicOrder = saved.customTopicOrder || [];

  const [plan, revisionDue] = await Promise.all([
    generateStudyPlan(userId, saved.examDate, saved.goal || "distinction", customTopicOrder, subjects, saved.grade || "10"),
    getRevisionTopics(userId),
  ]);

  if (saved.dailyPlan?.length) {
    const completedDays = new Set(saved.dailyPlan.filter(d => d.completed).map(d => d.day));
    plan.dailyPlan = plan.dailyPlan.map(d => ({ ...d, completed: completedDays.has(d.day) }));
  }

  plan.hasCustomOrder   = customTopicOrder.length > 0;
  plan.customTopicOrder = customTopicOrder;
  plan.revisionDue      = revisionDue.slice(0, 8);
  plan.planName         = saved.name || "";
  plan.planSubjects     = subjects;
  plan.planGrade        = saved.grade || "10";
  plan.planGoal         = saved.goal  || "distinction";
  plan.planExamDate     = saved.examDate;

  return plan;
};

export const getPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const saved  = await StudyPlan.findOne({ userId }).lean();

    if (!saved || !saved.examDate) {
      return res.json({ empty: true });
    }

    res.json(await buildPlanResponse(userId, saved));
  } catch (err) {
    next(err);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, subjects, grade, examDate, goal } = req.body;

    const saved = await StudyPlan.findOneAndUpdate(
      { userId },
      { $set: { name: name || "", subjects, grade, examDate: new Date(examDate), goal, customTopicOrder: [], dailyPlan: [] } },
      { upsert: true, new: true }
    ).lean();

    res.json(await buildPlanResponse(userId, saved));
  } catch (err) {
    next(err);
  }
};

export const updatePlanSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, subjects, grade, examDate, goal } = req.body;

    const saved = await StudyPlan.findOneAndUpdate(
      { userId },
      { $set: { name: name || "", subjects, grade, examDate: new Date(examDate), goal } },
      { new: true }
    ).lean();

    if (!saved) return next(new AppError("No study plan found", 404));

    res.json(await buildPlanResponse(userId, saved));
  } catch (err) {
    next(err);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    await StudyPlan.deleteOne({ userId: req.user.id });
    res.json({ data: { message: "Study plan deleted." } });
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
    await StudyPlan.findOneAndUpdate(
      { userId, "dailyPlan.day": { $ne: day } },
      { $push: { dailyPlan: { day, completed: true } } },
      { upsert: true }
    ).catch(() => {});
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
