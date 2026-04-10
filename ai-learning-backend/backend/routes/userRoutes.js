import express from "express";
import { Topic, User, UserProfile } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

r.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

r.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

r.put("/me", auth, async (req, res) => {
  try {
    const { name, examDate, grade } = req.body;
    const updates = {};
    if (name)     updates.name     = name.trim();
    if (examDate) updates.examDate = new Date(examDate);
    if (grade)    updates.grade    = grade;
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
