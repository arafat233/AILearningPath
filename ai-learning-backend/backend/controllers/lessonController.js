import { Lesson, LessonProgress } from "../models/lessonModel.js";

export const getLesson = async (req, res) => {
  try {
    const { topic } = req.params;
    const lesson = await Lesson.findOne({ topic });
    if (!lesson) return res.status(404).json({ error: "Lesson not found for this topic" });

    // Attach user progress if available
    const userId = req.user.id;
    const progress = await LessonProgress.findOne({ userId, topic });

    res.json({ lesson, progress: progress || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({}, "topic title tagline subject grade shortLesson.estimatedMinutes");
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveProgress = async (req, res) => {
  try {
    const { topic, mode, slideIndex, completed } = req.body;
    const userId = req.user.id;

    const update = { slideIndex, mode };
    if (completed) update.completedAt = new Date();

    await LessonProgress.findOneAndUpdate(
      { userId, topic },
      update,
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
