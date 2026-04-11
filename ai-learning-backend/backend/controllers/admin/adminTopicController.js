import { Topic } from "../../models/index.js";
import { AppError } from "../../utils/AppError.js";

export const listTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find().sort({ subject: 1, name: 1 }).lean();
    res.json(topics);
  } catch (err) { next(err); }
};

export const createTopic = async (req, res, next) => {
  try {
    const t = await Topic.create(req.body);
    res.status(201).json(t);
  } catch (err) { next(err); }
};

export const updateTopic = async (req, res, next) => {
  try {
    const t = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return next(new AppError("Topic not found", 404));
    res.json(t);
  } catch (err) { next(err); }
};

export const deleteTopic = async (req, res, next) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};
