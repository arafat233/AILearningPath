import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { Attempt, Badge, DoubtThread, ErrorMemory, Question, Streak, Topic, User, UserProfile } from "../models/index.js";
import { LessonProgress } from "../models/lessonModel.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
import { getDailyBrief } from "../services/dailyBriefService.js";
import { getStreakStatus } from "../services/streakService.js";
import { getCachedBoard } from "../services/adaptiveService.js";

const updateMeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many profile updates. Try again in an hour." },
});

const r = express.Router();

const updateMeSchema = Joi.object({
  name:       Joi.string().trim().min(2).max(80).optional(),
  examDate:   Joi.date().iso().optional(),
  grade:      Joi.string().optional(),
  subject:    Joi.string().optional(),
  subjects:   Joi.array().items(Joi.string().max(100)).max(10).optional(),
  goal:       Joi.string().optional(),
  weakTopics: Joi.array().items(Joi.string().max(200)).max(20).optional(),
  childName:  Joi.string().trim().max(80).optional().allow(""),
  examBoard:  Joi.string().valid("CBSE","ICSE","AP_SSC","IB","SSC","State Board").optional(),
  schoolName: Joi.string().trim().max(120).optional().allow(""),
  location:   Joi.string().trim().max(100).optional().allow(""),
});

// SEC-16: requires auth — topics list is product IP, not public data
r.get("/topics", auth, async (req, res, next) => {
  try {
    const board  = await getCachedBoard(req.user.id);
    const filter = { deletedAt: null, examBoard: board };
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.grade)   filter.grade   = req.query.grade;
    if (req.query.q) {
      const escaped = req.query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escaped, $options: "i" };
    }
    const topics = await Topic.find(filter).sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

// Toggle bookmark: adds if absent, removes if already present
r.post("/bookmarks/:questionId", auth, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId.match(/^[0-9a-fA-F]{24}$/)) {
      const { AppError } = await import("../utils/AppError.js");
      return next(new AppError("Invalid question ID", 400));
    }
    const user = await User.findById(req.user.id).select("savedQuestions");
    if (!user) return next(new AppError("User not found", 404));
    const already = user.savedQuestions.some((id) => id.toString() === questionId);
    if (already) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { savedQuestions: questionId } });
      return res.json({ bookmarked: false });
    }
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedQuestions: questionId } });
    res.json({ bookmarked: true });
  } catch (err) {
    next(err);
  }
});

r.get("/bookmarks", auth, async (req, res, next) => {
  try {
    const [user, board] = await Promise.all([
      User.findById(req.user.id).select("savedQuestions").lean(),
      getCachedBoard(req.user.id),
    ]);
    if (!user) return next(new AppError("User not found", 404));
    const questions = await Question.find({
      _id: { $in: user.savedQuestions || [] },
      examBoard: board,
      deletedAt: null,
    })
      .select("questionText subject grade conceptTested difficultyScore options")
      .lean();
    // Strip option types before sending to client
    const safe = questions.map((q) => ({
      ...q,
      options: (q.options || []).map(({ text, logicTag }) => ({ text, logicTag })),
    }));
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

r.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.json({ data: { user, profile } });
  } catch (err) {
    next(err);
  }
});

r.put("/me", auth, updateMeLimiter, validate(updateMeSchema), async (req, res, next) => {
  try {
    const { name, examDate, grade, subject, subjects, goal, weakTopics,
            childName, examBoard, schoolName, location } = req.body;
    const updates = {};
    if (name)       updates.name       = name.trim();
    if (examDate)   updates.examDate   = new Date(examDate);
    if (grade)      updates.grade      = grade;
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      updates.subjects = subjects;
      updates.subject  = subjects[0];
    } else if (subject) {
      updates.subject  = subject;
      updates.subjects = [subject];
    }
    if (goal)       updates.goal       = goal;
    if (childName  !== undefined) updates.childName  = childName.trim();
    if (examBoard)               updates.examBoard  = examBoard;
    if (schoolName !== undefined) updates.schoolName = schoolName.trim();
    if (location   !== undefined) updates.location   = location.trim();
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select("-password");

    if (Array.isArray(weakTopics)) {
      await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { weakAreas: weakTopics } },
        { upsert: true }
      );
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GDPR / PDPB: account + all personal data deletion
r.delete("/me", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Promise.all([
      User.findByIdAndDelete(userId),
      UserProfile.deleteOne({ userId }),
      Attempt.deleteMany({ userId }),
      ErrorMemory.deleteMany({ userId }),
      Streak.deleteOne({ userId }),
      Badge.deleteMany({ userId }),
      DoubtThread.deleteMany({ userId }),
      LessonProgress?.deleteMany({ userId }),
    ]);
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json({ data: { message: "Account and all personal data deleted." } });
  } catch (err) {
    next(err);
  }
});

r.get("/streak-status", auth, async (req, res, next) => {
  try {
    const status = await getStreakStatus(req.user.id);
    res.json({ data: status });
  } catch (err) { next(err); }
});

r.get("/daily-brief", auth, async (req, res, next) => {
  try {
    const brief = await getDailyBrief(req.user.id);
    res.json({ data: brief });
  } catch (err) {
    next(err);
  }
});

// ── Children (multi-child per parent account) ────────────────────────────────

const childSchema = Joi.object({
  childName:  Joi.string().trim().min(1).max(80).required(),
  grade:      Joi.string().required(),
  examBoard:  Joi.string().valid("CBSE","ICSE","AP_SSC","IB","SSC","State Board").required(),
  schoolName: Joi.string().trim().max(120).optional().allow(""),
  location:   Joi.string().trim().max(100).optional().allow(""),
});

r.post("/children", auth, validate(childSchema), async (req, res, next) => {
  try {
    const { childName, grade, examBoard, schoolName, location } = req.body;
    const randomPwd     = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10);
    const syntheticEmail = `child_${req.user.id}_${Date.now()}@stellar.child`;

    const child = await User.create({
      name:       childName.trim(),
      email:      syntheticEmail,
      password:   randomPwd,
      role:       "student",
      grade,
      examBoard,
      schoolName: schoolName?.trim() || null,
      location:   location?.trim()   || null,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { linkedStudents: child._id.toString() },
    });

    res.json({ data: { child: _childView(child) } });
  } catch (err) { next(err); }
});

r.get("/children", auth, async (req, res, next) => {
  try {
    const parent   = await User.findById(req.user.id).select("linkedStudents").lean();
    const children = await User.find({ _id: { $in: parent.linkedStudents || [] } })
      .select("_id name grade examBoard schoolName location createdAt")
      .lean();
    res.json({ data: { children } });
  } catch (err) { next(err); }
});

r.delete("/children/:childId", auth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { linkedStudents: req.params.childId },
    });
    res.json({ data: { message: "Child removed" } });
  } catch (err) { next(err); }
});

// Update a linked student's profile (board/grade/school/location).
// Only the parent who has this student in linkedStudents may update them.
// Used by /start onboarding when a parent is viewing-as-child and the
// child's record is missing examBoard or grade.
const updateChildSchema = Joi.object({
  grade:      Joi.string().optional(),
  examBoard:  Joi.string().valid("CBSE","ICSE","AP_SSC","IB","SSC","State Board").optional(),
  schoolName: Joi.string().trim().max(120).optional().allow(""),
  location:   Joi.string().trim().max(100).optional().allow(""),
  subject:    Joi.string().optional(),
  examDate:   Joi.date().optional(),
}).min(1);

r.put("/children/:childId", auth, validate(updateChildSchema), async (req, res, next) => {
  try {
    const { childId } = req.params;
    const parent = await User.findById(req.user.id).select("linkedStudents").lean();
    const owns = parent?.linkedStudents?.map(String).includes(String(childId));
    if (!owns) return next(new AppError("Not authorized to update this student", 403));

    const updated = await User.findByIdAndUpdate(childId, { $set: req.body }, { new: true })
      .select("_id name grade examBoard schoolName location subject examDate")
      .lean();
    if (!updated) return next(new AppError("Student not found", 404));

    res.json({ data: { child: updated } });
  } catch (err) { next(err); }
});

function _childView(u) {
  return { _id: u._id, name: u.name, grade: u.grade, examBoard: u.examBoard, schoolName: u.schoolName, location: u.location };
}

export default r;
