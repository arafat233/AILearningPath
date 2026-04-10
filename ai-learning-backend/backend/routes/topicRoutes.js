import express from "express";
import { auth } from "../middleware/auth.js";
import { Topic } from "../models/index.js";

const r = express.Router();

r.get("/", auth, async (req, res) => {
  try {
    const topics = await Topic.find().sort({ examFrequency: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;
