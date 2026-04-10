import express from "express";
import { Topic } from "../models/index.js";

const r = express.Router();

// Public — no auth required so onboarding (pre-login) can call it too.
// Supports ?grade=10&subject=Math query filters.
r.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.grade)   filter.grade   = req.query.grade;
    if (req.query.subject) filter.subject = req.query.subject;

    const topics = await Topic.find(filter).sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public — returns unique subjects and grades present in the DB.
// Used by Settings/Profile to build dropdowns from real data.
r.get("/meta", async (req, res) => {
  try {
    const [subjects, grades] = await Promise.all([
      Topic.distinct("subject"),
      Topic.distinct("grade"),
    ]);
    res.json({
      subjects: subjects.filter(Boolean).sort(),
      grades:   grades.filter(Boolean).sort(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
