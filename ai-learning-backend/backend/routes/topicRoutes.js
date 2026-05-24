import express from "express";
import { Topic } from "../models/index.js";
import { optionalAuth } from "../middleware/auth.js";
import { User } from "../models/index.js";
import { getCachedBoard } from "../services/adaptiveService.js";

const r = express.Router();

// Supports ?grade=10&subject=Math&board=CBSE query filters.
// When the user is logged in their board is read from Redis/DB and overrides the query param.
r.get("/", optionalAuth, async (req, res, next) => {
  try {
    const filter = { deletedAt: null };
    if (req.query.grade)   filter.grade   = req.query.grade;
    if (req.query.subject) filter.subject = req.query.subject;

    // Board filter: prefer user's stored board (auth), else query param, else default CBSE
    let board = (req.query.board || "CBSE").toUpperCase();
    if (req.user?.id) {
      try { board = await getCachedBoard(req.user.id); } catch { /* keep default */ }
    }
    filter.examBoard = board;

    const topics = await Topic.find(filter).sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

// Returns unique subjects and grades for a given board (?board=CBSE or ICSE).
r.get("/meta", optionalAuth, async (req, res, next) => {
  try {
    let board = (req.query.board || "CBSE").toUpperCase();
    if (req.user?.id) {
      try { board = await getCachedBoard(req.user.id); } catch { /* keep default */ }
    }
    const [subjects, grades] = await Promise.all([
      Topic.distinct("subject", { examBoard: board }),
      Topic.distinct("grade",   { examBoard: board }),
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
