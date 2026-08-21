import express from "express";
import { auth } from "../middleware/auth.js";
import { getMistakes } from "../services/mistakeService.js";

const r = express.Router();

// GET /api/v1/mistakes?topic=...  — derived mistake notebook.
// Retrying uses the existing POST /api/practice/start-bookmarks {questionIds}.
r.get("/", auth, async (req, res, next) => {
  try {
    const topic = typeof req.query.topic === "string" ? req.query.topic.slice(0, 200) : null;
    const mistakes = await getMistakes(req.user.id, { topic });
    res.json({ data: mistakes });
  } catch (err) {
    next(err);
  }
});

export default r;
