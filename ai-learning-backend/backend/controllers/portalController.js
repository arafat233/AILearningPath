import crypto from "crypto";
import { User, UserProfile, Streak, Badge } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

export const generateInvite = async (req, res, next) => {
  try {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
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
