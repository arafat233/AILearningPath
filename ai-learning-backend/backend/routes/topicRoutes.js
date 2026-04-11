import express from "express";
import { Topic } from "../models/index.js";

const r = express.Router();

// Public — no auth required so onboarding (pre-login) can call it too.
// Supports ?grade=10&subject=Math query filters.
r.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.grade)   filter.grade   = req.query.grade;
    if (req.query.subject) filter.subject = req.query.subject;

    const topics = await Topic.find(filter).sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

// Public — returns unique subjects and grades present in the DB.
r.get("/meta", async (req, res, next) => {
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
    next(err);
  }
});

export default r;
