import mongoose from "mongoose";
import { User, UserProfile, Streak, Badge, LinkRequest, Attempt, Question } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { getStudentDashboard } from "../services/portalService.js";

// Any authenticated user can view any student they've added to their list.
const verifyOwnership = async (requesterId, studentId) => {
  const user = await User.findById(requesterId).select("linkedStudents role").lean();
  return user?.role === "admin" || user?.linkedStudents?.includes(studentId);
};

// Escape special regex chars to prevent ReDoS / injection
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Search students by name (min 2 chars). Returns safe subset of fields only.
export const searchStudents = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (q.length < 2) return res.json([]);

    const students = await User.find({
      _id:  { $ne: req.user.id },
      role: { $in: ["student"] },
      name: { $regex: escapeRegex(q), $options: "i" },
    })
      .select("name grade subject")
      .limit(10)
      .lean();

    res.json(students.map((s) => ({ id: s._id, name: s.name, grade: s.grade, subject: s.subject })));
  } catch (err) { next(err); }
};

// Creates a pending link request — student must accept before the requester gains access.
export const linkStudentDirect = async (req, res, next) => {
  try {
    const allowedRoles = ["parent", "teacher", "admin"];
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Only parents, teachers, or admins can link students", 403));
    }

    const { studentId } = req.body;
    if (!mongoose.isValidObjectId(studentId))
      return next(new AppError("Invalid student ID", 400));

    const student = await User.findById(studentId).select("_id name grade subject role");
    if (!student) return next(new AppError("Student not found", 404));
    if (student._id.toString() === req.user.id)
      return next(new AppError("Cannot add yourself", 400));

    // Idempotent: return existing pending request if one already exists
    const existing = await LinkRequest.findOne({
      requesterId: req.user.id,
      studentId:   student._id,
      status:      "pending",
    }).lean();
    if (existing) {
      return res.json({ status: "pending", requestId: existing._id, student: { id: student._id, name: student.name, grade: student.grade, subject: student.subject } });
    }

    const me = await User.findById(req.user.id).select("name linkedStudents").lean();

    // Already accepted — student already in linkedStudents
    if (me?.linkedStudents?.includes(student._id.toString())) {
      return res.json({ status: "linked", student: { id: student._id, name: student.name, grade: student.grade, subject: student.subject } });
    }

    const request = await LinkRequest.create({
      requesterId:   req.user.id,
      requesterName: me?.name || req.user.role,
      requesterRole: req.user.role,
      studentId:     student._id,
    });

    res.json({ status: "pending", requestId: request._id, student: { id: student._id, name: student.name, grade: student.grade, subject: student.subject } });
  } catch (err) { next(err); }
};

// Parent/teacher: paginated list of a student's recent attempts with question snippets
export const getStudentAttempts = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.isValidObjectId(studentId))
      return next(new AppError("Invalid student ID", 400));
    if (!(await verifyOwnership(req.user.id, studentId)))
      return next(new AppError("Not authorized", 403));

    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      Attempt.find({ userId: studentId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Attempt.countDocuments({ userId: studentId }),
    ]);

    // Enrich with question text (single batch lookup)
    const qIds = [...new Set(attempts.map((a) => a.questionId).filter(Boolean))];
    const questions = await Question.find({ _id: { $in: qIds } }).select("questionText topic subject").lean();
    const qMap = {};
    questions.forEach((q) => { qMap[q._id.toString()] = q; });

    const enriched = attempts.map((a) => {
      const q = qMap[a.questionId?.toString()];
      return {
        _id:          a._id,
        topic:        a.topic,
        subject:      a.subject,
        isCorrect:    a.isCorrect,
        timeTaken:    a.timeTaken,
        confidence:   a.confidence,
        createdAt:    a.createdAt,
        questionText: q?.questionText ? q.questionText.slice(0, 120) : null,
      };
    });

    res.json({ attempts: enriched, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// Teacher/admin: aggregate class-level stats across all linked students
export const getClassStats = async (req, res, next) => {
  try {
    if (!["teacher", "admin"].includes(req.user.role))
      return next(new AppError("Only teachers and admins can view class stats", 403));

    const me = await User.findById(req.user.id).select("linkedStudents").lean();
    const studentIds = me?.linkedStudents || [];
    if (studentIds.length === 0) return res.json({ students: 0, classAccuracy: 0, topicStats: [], weakStudents: [] });

    const [profiles, streaks] = await Promise.all([
      UserProfile.find({ userId: { $in: studentIds } }).lean(),
      Streak.find({ userId: { $in: studentIds } }).lean(),
    ]);

    const students = await User.find({ _id: { $in: studentIds } }).select("name grade subject").lean();

    // Class-level accuracy
    const accuracies = profiles.map((p) => p.accuracy || 0);
    const classAccuracy = accuracies.length > 0
      ? Math.round((accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 100)
      : 0;

    // Per-topic aggregates
    const topicMap = {};
    profiles.forEach((p) => {
      (p.topicProgress || []).forEach((tp) => {
        if (!topicMap[tp.topic]) topicMap[tp.topic] = { topic: tp.topic, totalAcc: 0, count: 0 };
        topicMap[tp.topic].totalAcc += (tp.accuracy || 0) * 100;
        topicMap[tp.topic].count++;
      });
    });
    const topicStats = Object.values(topicMap)
      .map((t) => ({ topic: t.topic, accuracy: Math.round(t.totalAcc / t.count), count: t.count }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    // Students struggling (accuracy < 50%)
    const weakStudents = profiles
      .filter((p) => (p.accuracy || 0) < 0.5)
      .map((p) => {
        const s = students.find((u) => u._id.toString() === p.userId);
        return s ? { id: p.userId, name: s.name, grade: s.grade, accuracy: Math.round((p.accuracy || 0) * 100) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.accuracy - b.accuracy);

    // Streak distribution
    const streakMap = {};
    streaks.forEach((s) => { streakMap[s.userId] = s.currentStreak || 0; });
    const avgStreak = studentIds.length > 0
      ? Math.round(studentIds.reduce((sum, id) => sum + (streakMap[id] || 0), 0) / studentIds.length)
      : 0;

    res.json({ students: studentIds.length, classAccuracy, topicStats, weakStudents, avgStreak });
  } catch (err) { next(err); }
};

// Student fetches their pending link requests (inbox)
export const getLinkRequests = async (req, res, next) => {
  try {
    const requests = await LinkRequest.find({ studentId: req.user.id, status: "pending" }).lean();
    res.json(requests);
  } catch (err) { next(err); }
};

// Student accepts or rejects a specific link request
export const respondToLinkRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!mongoose.isValidObjectId(id))
      return next(new AppError("Invalid request ID", 400));
    if (!["accept", "reject"].includes(action))
      return next(new AppError("Action must be 'accept' or 'reject'", 400));

    const request = await LinkRequest.findById(id);
    if (!request) return next(new AppError("Request not found", 404));
    if (request.studentId.toString() !== req.user.id)
      return next(new AppError("Not authorized", 403));
    if (request.status !== "pending")
      return next(new AppError("Request already responded to", 400));

    request.status      = action === "accept" ? "accepted" : "rejected";
    request.respondedAt = new Date();
    await request.save();

    if (action === "accept") {
      await User.findByIdAndUpdate(request.requesterId, {
        $addToSet: { linkedStudents: request.studentId.toString() },
      });
    }

    res.json({ success: true, status: request.status });
  } catch (err) { next(err); }
};

export const removeLinkedStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { linkedStudents: studentId },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const getLinkedStudents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("linkedStudents").lean();
    if (!user?.linkedStudents?.length) return res.json([]);

    const students = await User.find({ _id: { $in: user.linkedStudents } })
      .select("name grade subject goal")
      .lean();
    res.json(students.map((s) => ({ ...s, id: s._id })));
  } catch (err) { next(err); }
};

export const getStudentAnalytics = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.isValidObjectId(studentId))
      return next(new AppError("Invalid student ID", 400));
    if (!(await verifyOwnership(req.user.id, studentId)))
      return next(new AppError("Not authorized", 403));

    const [profile, streak, badges] = await Promise.all([
      UserProfile.findOne({ userId: studentId }).lean(),
      Streak.findOne({ userId: studentId }).lean(),
      Badge.find({ userId: studentId }).sort({ awardedAt: -1 }).lean(),
    ]);
    res.json({ profile, streak, badges });
  } catch (err) { next(err); }
};

export const getStudentDashboardCtrl = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.isValidObjectId(studentId))
      return next(new AppError("Invalid student ID", 400));
    if (!(await verifyOwnership(req.user.id, studentId)))
      return next(new AppError("Not authorized", 403));

    const data = await getStudentDashboard(studentId);
    res.json(data);
  } catch (err) { next(err); }
};

// Parent sets/updates a study reminder for one of their linked students.
// Days is optional; if omitted the reminder fires every day.
export const setStudyReminder = async (req, res, next) => {
  try {
    const { studentId, time, days } = req.body;
    if (!mongoose.isValidObjectId(studentId))
      return next(new AppError("Invalid student ID", 400));
    if (!(await verifyOwnership(req.user.id, studentId)))
      return next(new AppError("Not authorized", 403));

    // Remove any existing reminder for this student, then push new one
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { studyReminders: { studentId } },
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { studyReminders: { studentId, time, days: days || [] } },
    });

    res.json({ success: true });
  } catch (err) { next(err); }
};

// Returns all study reminders set by the current parent.
export const getStudyReminders = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("studyReminders").lean();
    res.json(user?.studyReminders || []);
  } catch (err) { next(err); }
};

// Delete a study reminder for a specific student.
export const deleteStudyReminder = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { studyReminders: { studentId } },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};
