import crypto from "crypto";
import mongoose from "mongoose";
import { User, UserProfile, Streak, Badge } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// SEC-14: Retry loop to guarantee uniqueness
async function generateUniqueCode(maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const code = crypto.randomBytes(6).toString("hex").toUpperCase().slice(0, 8);
    const exists = await User.exists({ inviteCode: code });
    if (!exists) return code;
  }
  throw new AppError("Could not generate a unique invite code. Please try again.", 500);
}

export const generateInvite = async (req, res, next) => {
  try {
    const code = await generateUniqueCode();
    await User.findByIdAndUpdate(req.user.id, { inviteCode: code });
    res.json({ inviteCode: code });
  } catch (err) { next(err); }
};

export const linkStudent = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    const student = await User.findOne({ inviteCode: inviteCode.toUpperCase() }).select("_id name email grade subject");
    if (!student) return next(new AppError("No student found with that code", 404));
    if (student._id.toString() === req.user.id)
      return next(new AppError("Cannot link yourself", 400));

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { linkedStudents: student._id.toString() },
    });
    res.json({ student: { id: student._id, name: student.name, email: student.email } });
  } catch (err) { next(err); }
};

export const getLinkedStudents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("linkedStudents").lean();
    if (!user?.linkedStudents?.length) return res.json([]);

    const students = await User.find({ _id: { $in: user.linkedStudents } })
      .select("name email grade subject goal aiCallsToday aiCallsDate")
      .lean();
    res.json(students.map((s) => ({ ...s, id: s._id })));
  } catch (err) { next(err); }
};

const verifyOwnership = async (requesterId, studentId) => {
  const user = await User.findById(requesterId).select("linkedStudents role").lean();
  return user?.role === "admin" || user?.linkedStudents?.includes(studentId);
};

export const getStudentAnalytics = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // SEC-11: Validate studentId before hitting the DB
    if (!mongoose.isValidObjectId(studentId)) {
      return next(new AppError("Invalid student ID", 400));
    }

    if (!(await verifyOwnership(req.user.id, studentId)))
      return next(new AppError("Student not linked to your account", 403));

    const [profile, streak, badges] = await Promise.all([
      UserProfile.findOne({ userId: studentId }).lean(),
      Streak.findOne({ userId: studentId }).lean(),
      Badge.find({ userId: studentId }).sort({ awardedAt: -1 }).lean(),
    ]);
    res.json({ profile, streak, badges });
  } catch (err) { next(err); }
};
