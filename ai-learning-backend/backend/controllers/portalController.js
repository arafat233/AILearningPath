import crypto from "crypto";
import { User, UserProfile, Streak, Badge } from "../models/index.js";

// Generate a short invite code for a student
export const generateInvite = async (req, res) => {
  try {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A3F2B1C4"
    await User.findByIdAndUpdate(req.user.id, { inviteCode: code });
    res.json({ inviteCode: code });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Parent/teacher links a student by invite code
export const linkStudent = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) return res.status(400).json({ error: "inviteCode required" });

    const student = await User.findOne({ inviteCode: inviteCode.toUpperCase() }).select("_id name email grade subject");
    if (!student) return res.status(404).json({ error: "No student found with that code" });
    if (student._id.toString() === req.user.id)
      return res.status(400).json({ error: "Cannot link yourself" });

    // Add to linkedStudents if not already there
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { linkedStudents: student._id.toString() },
    });
    res.json({ student: { id: student._id, name: student.name, email: student.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// List all linked students (basic info)
export const getLinkedStudents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("linkedStudents").lean();
    if (!user?.linkedStudents?.length) return res.json([]);

    const students = await User.find({ _id: { $in: user.linkedStudents } })
      .select("name email grade subject goal aiCallsToday aiCallsDate")
      .lean();
    res.json(students.map((s) => ({ ...s, id: s._id })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Verify the requesting user has this student linked
const verifyOwnership = async (requesterId, studentId) => {
  const user = await User.findById(requesterId).select("linkedStudents role").lean();
  return user?.role === "admin" || user?.linkedStudents?.includes(studentId);
};

// Get a student's analytics (read-only for parent/teacher)
export const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!(await verifyOwnership(req.user.id, studentId)))
      return res.status(403).json({ error: "Student not linked to your account" });

    const [profile, streak, badges] = await Promise.all([
      UserProfile.findOne({ userId: studentId }).lean(),
      Streak.findOne({ userId: studentId }).lean(),
      Badge.find({ userId: studentId }).sort({ awardedAt: -1 }).lean(),
    ]);
    res.json({ profile, streak, badges });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
