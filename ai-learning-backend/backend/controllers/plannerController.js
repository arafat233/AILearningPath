import { generateStudyPlan } from "../services/plannerService.js";
import { getRevisionTopics } from "../services/revisionService.js";
import { StudyPlan } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import crypto from "crypto";

const buildPlanResponse = async (userId, saved) => {
  const subjects         = saved.subjects?.length ? saved.subjects : ["Math"];
  const customTopicOrder = saved.customTopicOrder || [];

  const [plan, revisionDue] = await Promise.all([
    generateStudyPlan(userId, {
      examDate:        saved.examDate,
      goal:            saved.goal        || "distinction",
      customTopicOrder,
      subjects,
      grade:           saved.grade       || "10",
      hoursPerDay:     saved.hoursPerDay || 2,
      offDays:         saved.offDays     || [],
      topicFilter:     saved.topicFilter || [],
    }),
    getRevisionTopics(userId),
  ]);

  if (saved.dailyPlan?.length) {
    const completedSet = new Set(saved.dailyPlan.filter(d => d.completed).map(d => d.day));
    const noteMap = {};
    saved.dailyPlan.forEach(d => { if (d.note) noteMap[d.day] = d.note; });
    plan.dailyPlan = plan.dailyPlan.map(d => ({
      ...d,
      completed: completedSet.has(d.day),
      note:      noteMap[d.day] || "",
    }));
  }

  plan.hasCustomOrder   = customTopicOrder.length > 0;
  plan.customTopicOrder = customTopicOrder;
  plan.revisionDue      = revisionDue.slice(0, 8);
  plan.planId           = saved._id.toString();
  plan.planName         = saved.name        || "";
  plan.planSubjects     = subjects;
  plan.planGrade        = saved.grade       || "10";
  plan.planGoal         = saved.goal        || "distinction";
  plan.planExamDate     = saved.examDate;
  plan.hoursPerDay      = saved.hoursPerDay || 2;
  plan.offDays          = (saved.offDays || []).map(d => new Date(d).toISOString().split("T")[0]);
  plan.topicFilter      = saved.topicFilter || [];
  plan.shareToken       = saved.shareToken  || null;
  plan.isActive         = saved.isActive;

  return plan;
};

export const getPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const saved  = await StudyPlan.findOne({ userId, isActive: true }).lean()
                || await StudyPlan.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (!saved || !saved.examDate) return res.json({ empty: true });
    res.json(await buildPlanResponse(userId, saved));
  } catch (err) { next(err); }
};

export const listPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user.id })
      .select("name subjects grade goal examDate isActive createdAt dailyPlan hoursPerDay")
      .sort({ createdAt: -1 }).lean();
    const summaries = plans.map(p => ({
      planId:    p._id.toString(),
      name:      p.name || "Study Plan",
      subjects:  p.subjects || [],
      grade:     p.grade,
      goal:      p.goal,
      examDate:  p.examDate,
      hoursPerDay: p.hoursPerDay || 2,
      isActive:  p.isActive,
      progress:  p.dailyPlan?.length > 0
        ? Math.round((p.dailyPlan.filter(d => d.completed).length / p.dailyPlan.length) * 100) : 0,
      totalDays: p.dailyPlan?.length || 0,
      createdAt: p.createdAt,
    }));
    res.json({ data: summaries });
  } catch (err) { next(err); }
};

export const getPlanById = async (req, res, next) => {
  try {
    const saved = await StudyPlan.findOne({ _id: req.params.planId, userId: req.user.id }).lean();
    if (!saved) return next(new AppError("Plan not found", 404));
    res.json(await buildPlanResponse(req.user.id, saved));
  } catch (err) { next(err); }
};

export const createPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, subjects, grade, examDate, goal, hoursPerDay, offDays, topicFilter } = req.body;
    await StudyPlan.updateMany({ userId }, { $set: { isActive: false } });
    const saved = await StudyPlan.create({
      userId, name: name || "", subjects, grade,
      examDate: new Date(examDate), goal,
      hoursPerDay: hoursPerDay || 2,
      offDays: (offDays || []).map(d => new Date(d)),
      topicFilter: topicFilter || [],
      isActive: true, customTopicOrder: [], dailyPlan: [],
    });
    res.json(await buildPlanResponse(userId, saved.toObject()));
  } catch (err) { next(err); }
};

export const activatePlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await StudyPlan.updateMany({ userId }, { $set: { isActive: false } });
    const saved = await StudyPlan.findOneAndUpdate(
      { _id: req.params.planId, userId },
      { $set: { isActive: true } }, { new: true }
    ).lean();
    if (!saved) return next(new AppError("Plan not found", 404));
    res.json(await buildPlanResponse(userId, saved));
  } catch (err) { next(err); }
};

export const updatePlanSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, subjects, grade, examDate, goal, hoursPerDay, offDays, topicFilter } = req.body;
    const saved = await StudyPlan.findOneAndUpdate(
      { _id: req.params.planId, userId },
      { $set: { name: name || "", subjects, grade, examDate: new Date(examDate), goal,
          hoursPerDay: hoursPerDay || 2,
          offDays: (offDays || []).map(d => new Date(d)),
          topicFilter: topicFilter || [] } },
      { new: true }
    ).lean();
    if (!saved) return next(new AppError("Plan not found", 404));
    res.json(await buildPlanResponse(userId, saved));
  } catch (err) { next(err); }
};

export const deletePlan = async (req, res, next) => {
  try {
    await StudyPlan.deleteOne({ _id: req.params.planId, userId: req.user.id });
    res.json({ data: { message: "Plan deleted." } });
  } catch (err) { next(err); }
};

export const reschedulePlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const plan   = await StudyPlan.findOne({ userId, isActive: true }).lean()
                || await StudyPlan.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (!plan) return next(new AppError("No active plan", 404));

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const completedDays    = plan.dailyPlan.filter(d => d.completed);
    const incompleteTopics = plan.dailyPlan
      .filter(d => !d.completed)
      .sort((a, b) => a.day - b.day)
      .flatMap(d => d.topics.filter(t => t !== "Mock Test"));

    if (!incompleteTopics.length) {
      return res.json(await buildPlanResponse(userId, plan));
    }

    const offDayKeys  = new Set((plan.offDays || []).map(d => new Date(d).toISOString().split("T")[0]));
    const examDt      = new Date(plan.examDate);
    const hoursPerDay = plan.hoursPerDay || 2;
    const studyDates  = [];

    for (let i = 0; studyDates.length < incompleteTopics.length + 30 && i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      if (d >= examDt) break;
      if (!offDayKeys.has(d.toISOString().split("T")[0])) studyDates.push(d);
    }

    let topicPtr = 0;
    const maxDay = completedDays.length > 0 ? Math.max(...completedDays.map(d => d.day)) : 0;
    let dayNum = maxDay + 1;
    const newDays = [];

    for (let i = 0; i < studyDates.length && topicPtr < incompleteTopics.length; i++) {
      const dayTopics = [];
      let hours = 0;
      while (topicPtr < incompleteTopics.length && hours < hoursPerDay) {
        dayTopics.push(incompleteTopics[topicPtr++]);
        hours += 2;
      }
      newDays.push({ day: dayNum++, date: studyDates[i], topics: dayTopics,
        estimatedHours: Math.min(hours, hoursPerDay + 2), completed: false, isMockTest: false, phase: "revision", note: "" });
    }

    const newDailyPlan = [...completedDays, ...newDays];
    await StudyPlan.findOneAndUpdate({ _id: plan._id }, { $set: { dailyPlan: newDailyPlan } });
    const updated = await StudyPlan.findById(plan._id).lean();
    res.json(await buildPlanResponse(userId, updated));
  } catch (err) { next(err); }
};

export const generateShareToken = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const plan  = await StudyPlan.findOneAndUpdate(
      { userId: req.user.id, isActive: true },
      { $set: { shareToken: token } }, { new: true }
    ).lean();
    if (!plan) return next(new AppError("No active plan", 404));
    res.json({ data: { shareToken: token } });
  } catch (err) { next(err); }
};

export const getSharedPlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ shareToken: req.params.token }).lean();
    if (!plan) return next(new AppError("Shared plan not found", 404));
    const result = await buildPlanResponse(plan.userId, plan);
    delete result.revisionDue;
    res.json(result);
  } catch (err) { next(err); }
};

export const markDayComplete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { day, planId } = req.body;
    const q = planId ? { _id: planId, userId } : { userId, isActive: true };
    await StudyPlan.findOneAndUpdate(q, { $set: { "dailyPlan.$[el].completed": true } }, { arrayFilters: [{ "el.day": day }] });
    await StudyPlan.findOneAndUpdate({ ...q, "dailyPlan.day": { $ne: day } }, { $push: { dailyPlan: { day, completed: true } } }, { upsert: true }).catch(() => {});
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const saveTopicOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicOrder, planId } = req.body;
    const q = planId ? { _id: planId, userId } : { userId, isActive: true };
    await StudyPlan.findOneAndUpdate(q, { $set: { customTopicOrder: topicOrder } }, { upsert: true });
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const saveDayNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { day, note, planId } = req.body;
    const q = planId ? { _id: planId, userId } : { userId, isActive: true };
    await StudyPlan.findOneAndUpdate(q, { $set: { "dailyPlan.$[el].note": note || "" } }, { arrayFilters: [{ "el.day": day }] });
    res.json({ success: true });
  } catch (err) { next(err); }
};
