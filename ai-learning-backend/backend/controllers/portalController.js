import mongoose from "mongoose";
import { User, UserProfile, Streak, Badge, LinkRequest } from "../models/index.js";
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
