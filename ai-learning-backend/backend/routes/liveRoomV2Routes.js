import express from "express";
import { auth } from "../middleware/auth.js";
import { User } from "../models/index.js";

const r = express.Router();

const THEMES = [
  { day: 0, topic: "Algebra Power Hour",      subject: "Math",    icon: "📐" },
  { day: 1, topic: "Mind-Bending Geometry",   subject: "Math",    icon: "📏" },
  { day: 2, topic: "Light & Reflection",      subject: "Science", icon: "🔬" },
  { day: 3, topic: "Acids, Bases & Salts",    subject: "Science", icon: "⚗️" },
  { day: 4, topic: "Reading Comprehension",   subject: "English", icon: "📖" },
  { day: 5, topic: "Indian Geography Sprint", subject: "Social Science", icon: "🗺" },
  { day: 6, topic: "Mixed Champions",         subject: "Math",    icon: "👑" },
];

r.get("/theme", auth, (_req, res) => {
  const theme = THEMES[new Date().getDay()];
  res.json({ data: theme });
});

// List linked friends user can invite
r.get("/friends", auth, async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id).select("linkedStudents").lean();
    const ids = (me?.linkedStudents || []).slice(0, 20);
    if (!ids.length) return res.json({ data: [] });
    const friends = await User.find({ _id: { $in: ids } }).select("_id name grade").lean();
    res.json({ data: friends.map((f) => ({ id: String(f._id), name: f.name, grade: f.grade })) });
  } catch (e) { next(e); }
});

export default r;
