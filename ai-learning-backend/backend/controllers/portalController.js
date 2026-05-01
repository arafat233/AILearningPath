import mongoose from "mongoose";
import { User, UserProfile, Streak, Badge } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { getStudentDashboard } from "../services/portalService.js";

// Any authenticated user can view any student they've added to their list.
const verifyOwnership = async (requesterId, studentId) => {
  const user = await User.findById(requesterId).select("linkedStudents role").lean();
  return user?.role === "admin" || user?.linkedStudents?.includes(studentId);
};

// Search students by name (min 2 chars). Returns safe subset of fields only.
export const searchStudents = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (q.length < 2) return res.json([]);

    const students = await User.find({
      _id:  { $ne: req.user.id },           // exclude self
      role: { $in: ["student"] },           // students only
      name: { $regex: q, $options: "i" },
    })
      .select("name grade subject")
      .limit(10)
      .lean();

    res.json(students.map((s) => ({ id: s._id, name: s.name, grade: s.grade, subject: s.subject })));
  } catch (err) { next(err); }
};

// Directly add a student to the parent's linked list — no invite code required.
export const linkStudentDirect = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    if (!mongoose.isValidObjectId(studentId))
      return next(new AppError("Invalid student ID", 400));

    const student = await User.findById(studentId).select("_id name grade subject role");
    if (!student) return next(new AppError("Student not found", 404));
    if (student._id.toString() === req.user.id)
      return next(new AppError("Cannot add yourself", 400));

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { linkedStudents: student._id.toString() },
    });
    res.json({ student: { id: student._id, name: student.name, grade: student.grade, subject: student.subject } });
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
