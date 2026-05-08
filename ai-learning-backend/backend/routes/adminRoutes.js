import { Router } from "express";
import Joi from "joi";
import { adminAuth } from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.js";

import { listUsers, updateUserRole, updateUserPlan,
         deleteUser, getUserDetail }                                        from "../controllers/admin/adminUserController.js";
import { listQuestions, getFlaggedQuestions, createQuestion,
         updateQuestion, deleteQuestion, unflagQuestion }                  from "../controllers/admin/adminQuestionController.js";
import { listTopics, createTopic, updateTopic, deleteTopic }              from "../controllers/admin/adminTopicController.js";
import { getAdminStats, getAnalytics, getRagHealth }                       from "../controllers/admin/adminStatsController.js";
import { runOnboardingEmails, runTrialExpirySoonEmails }                   from "../services/onboardingEmailService.js";
import { runWeeklyParentEmails }                                           from "../services/weeklyParentEmailService.js";
import { Coupon, PaymentRecord, UserProfile, User }                        from "../models/index.js";

const r = Router();
r.use(adminAuth);

const roleSchema = Joi.object({
  role: Joi.string().valid("student", "admin", "parent", "teacher").required(),
});

// SEC-10: No .unknown(true) — only explicitly listed fields are allowed through
const questionSchema = Joi.object({
  questionText:    Joi.string().required(),
  topic:           Joi.string().required(),
  subject:         Joi.string().optional(),
  grade:           Joi.string().optional(),
  examBoard:       Joi.string().optional(),
  options:         Joi.array().required(),
  solutionSteps:   Joi.array().optional(),
  shortcut:        Joi.string().optional().allow(""),
  difficultyScore: Joi.number().min(0).max(1).optional(),
  expectedTime:    Joi.number().positive().optional(),
  marks:           Joi.number().min(0).optional(),
  isPYQ:           Joi.boolean().optional(),
  pyqYear:         Joi.number().integer().min(2000).max(2030).optional(),
  questionType:    Joi.string().valid("mcq","case_based","assertion_reason","pyq").optional(),
  difficulty:      Joi.string().valid("easy","medium","hard").optional(),
});

const topicSchema = Joi.object({
  name:          Joi.string().required(),
  subject:       Joi.string().required(),
  grade:         Joi.string().optional(),
  examFrequency: Joi.number().min(0).max(1).optional(),
  estimatedHours: Joi.number().positive().optional(),
  examMarks:     Joi.number().min(0).optional(),
});

// Stats & Analytics
r.get("/stats",                      getAdminStats);
r.get("/analytics",                  getAnalytics);
r.get("/rag-health",                 getRagHealth);

// Onboarding email sequence — call daily via external cron or manually
r.post("/run-onboarding-emails", async (req, res, next) => {
  try {
    const result = await runOnboardingEmails();
    res.json({ data: result });
  } catch (err) { next(err); }
});

// Trial-expiry-soon email — can be called independently or runs inside runOnboardingEmails
r.post("/run-trial-expiry-soon-emails", async (req, res, next) => {
  try {
    const count = await runTrialExpirySoonEmails();
    res.json({ data: { trialExpirySoon: count } });
  } catch (err) { next(err); }
});

// Test email — confirm SMTP is working
r.post("/send-test-email", async (req, res, next) => {
  try {
    const { to } = req.body;
    if (!to) return res.status(400).json({ error: "to email required" });
    const { sendEmail } = await import("../utils/email.js");
    await sendEmail({
      to,
      subject: "Stellar — test email ✓",
      html: `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1c1e"><h2 style="margin:0 0 12px;font-size:20px;font-weight:700">Email delivery confirmed ✓</h2><p style="color:#636366;font-size:15px">This is a test email sent from the Stellar admin panel at ${new Date().toISOString()}. SMTP is working correctly.</p></div>`,
    });
    res.json({ data: { sent: true, to } });
  } catch (err) { next(err); }
});

// Weekly parent digest — call weekly via external cron or manually
r.post("/run-weekly-parent-emails", async (req, res, next) => {
  try {
    const result = await runWeeklyParentEmails();
    res.json({ data: result });
  } catch (err) { next(err); }
});

// Users
r.get("/users",                      listUsers);
r.put("/users/:id/role",             validate(roleSchema),     updateUserRole);

const userPlanSchema = Joi.object({
  plan:      Joi.string().valid("free", "pro", "pro_annual", "premium", "premium_annual").required(),
  isPaid:    Joi.boolean().required(),
  daysToAdd: Joi.number().integer().min(0).max(3650).optional(),
});
r.put("/users/:id/plan",             validate(userPlanSchema), updateUserPlan);
r.delete("/users/:id",               deleteUser);
r.get("/users/:id/detail",           getUserDetail);

// Payments (read-only audit log with optional plan/date filters)
r.get("/payments", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, plan, from, to } = req.query;
    const filter = {};
    if (plan) filter.planKey = plan;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to + "T23:59:59.999Z");
    }
    const [records, total] = await Promise.all([
      PaymentRecord.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("userId", "name email")
        .lean(),
      PaymentRecord.countDocuments(filter),
    ]);
    res.json({ data: { records, total, page: Number(page) } });
  } catch (err) { next(err); }
});

// Questions — SEC-09: validate() added to PUT route
r.get("/questions",                  listQuestions);
r.get("/questions/flagged",          getFlaggedQuestions);
r.post("/questions",                 validate(questionSchema), createQuestion);
r.put("/questions/:id",              validate(questionSchema), updateQuestion);
r.delete("/questions/:id",           deleteQuestion);
r.put("/questions/:id/unflag",       unflagQuestion);

// Topics — SEC-09: validate() added to PUT route
r.get("/topics",                     listTopics);
r.post("/topics",                    validate(topicSchema),    createTopic);
r.put("/topics/:id",                 validate(topicSchema),    updateTopic);
r.delete("/topics/:id",              deleteTopic);

// Coupons
const couponSchema = Joi.object({
  code:          Joi.string().max(32).uppercase().trim().required(),
  discountType:  Joi.string().valid("percent", "fixed").required(),
  discountValue: Joi.number().positive().required(),
  planFilter:    Joi.array().items(Joi.string()).optional(),
  validUntil:    Joi.date().iso().optional().allow(null),
  maxUses:       Joi.number().integer().min(0).optional(),
  isActive:      Joi.boolean().optional(),
});

r.get("/coupons", async (_req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ data: coupons });
  } catch (err) { next(err); }
});

r.post("/coupons", validate(couponSchema), async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ data: coupon });
  } catch (err) { next(err); }
});

r.put("/coupons/:id", validate(couponSchema), async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json({ data: coupon });
  } catch (err) { next(err); }
});

r.delete("/coupons/:id", async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ data: { message: "Coupon deleted" } });
  } catch (err) { next(err); }
});

// Certificates — users who have earned a certificate (≥1 attempt)
r.get("/certificates", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, minAttempts = 1, minAccuracy = 0 } = req.query;
    const skip       = (Number(page) - 1) * Number(limit);
    const accFilter  = Number(minAccuracy) / 100;

    const filter = {
      totalAttempts: { $gte: Number(minAttempts) },
      ...(accFilter > 0 ? { accuracy: { $gte: accFilter } } : {}),
    };

    const [profiles, total] = await Promise.all([
      UserProfile.find(filter).sort({ accuracy: -1 }).skip(skip).limit(Number(limit)).lean(),
      UserProfile.countDocuments(filter),
    ]);

    const userIds = profiles.map((p) => p.userId?.toString()).filter(Boolean);
    const users   = await User.find(
      { _id: { $in: userIds }, email: { $not: /stellar\.child$/ } }
    ).select("name email grade plan isPaid createdAt").lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const results = profiles
      .map((p) => {
        const user = userMap[p.userId?.toString()];
        if (!user) return null;
        return {
          userId:          p.userId,
          user,
          accuracy:        Math.round((p.accuracy || 0) * 100),
          totalAttempts:   p.totalAttempts,
          topicsMastered:  (p.topicProgress || []).filter((t) => t.accuracy >= 0.7).length,
          strongAreas:     (p.strongAreas || []).slice(0, 3),
          thinkingProfile: p.thinkingProfile,
        };
      })
      .filter(Boolean);

    res.json({ data: { results, total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (err) { next(err); }
});

r.get("/coupons/:id/redemptions", async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).lean();
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    const records = await PaymentRecord.find({ couponCode: coupon.code })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .lean();
    res.json({ data: records });
  } catch (err) { next(err); }
});

export default r;
