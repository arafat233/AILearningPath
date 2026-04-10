import express from "express";
import { getReport } from "../controllers/analysisController.js";
import { ErrorMemory } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

r.get("/report", auth, getReport);

r.get("/errors", auth, async (req, res) => {
  try {
    const errors = await ErrorMemory.find({ userId: req.user.id })
      .sort({ count: -1 })
      .limit(10)
      .lean();
    res.json(errors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
