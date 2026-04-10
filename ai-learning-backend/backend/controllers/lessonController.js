import { Lesson, LessonProgress } from "../models/lessonModel.js";
import { generateLesson } from "../services/aiService.js";
import { Topic } from "../models/index.js";

export const getLesson = async (req, res) => {
  try {
    const { topic } = req.params;
    const userId = req.user.id;

    let lesson = await Lesson.findOne({ topic });

    if (!lesson) {
      // DB-first: generate once with AI, save permanently
      const topicDoc = await Topic.findOne({ name: topic }).lean();
      const subject  = topicDoc?.subject || "Math";
      const grade    = topicDoc?.grade   || "10";

      const generated = await generateLesson(topic, subject, grade);
      if (!generated) {
        return res.status(404).json({ error: "Lesson not available for this topic yet." });
      }

      lesson = await Lesson.create({
        topic,
        subject,
        grade,
        title:       generated.title,
        tagline:     generated.tagline,
        shortLesson: generated.shortLesson,
        longLesson:  generated.longLesson,
        prerequisites: generated.prerequisites || [],
      });
    }

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
