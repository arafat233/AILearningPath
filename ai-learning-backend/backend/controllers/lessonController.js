import { Lesson, LessonProgress } from "../models/lessonModel.js";
import { generateLesson } from "../services/aiService.js";
import { Topic } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

export const getLesson = async (req, res, next) => {
  try {
    const { topic } = req.params;
    const userId = req.user.id;

    let lesson = await Lesson.findOne({ topic });

    if (!lesson) {
      const topicDoc = await Topic.findOne({ name: topic }).lean();
      const subject  = topicDoc?.subject || "Math";
      const grade    = topicDoc?.grade   || "10";

      const generated = await generateLesson(topic, subject, grade);
      if (!generated) return next(new AppError("Lesson not available for this topic yet.", 404));

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
    next(err);
  }
};

export const listLessons = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.grade)   filter.grade   = req.query.grade;
    const lessons = await Lesson.find(filter, "topic title tagline subject grade shortLesson.estimatedMinutes");
    res.json(lessons);
  } catch (err) {
    next(err);
  }
};

export const saveProgress = async (req, res, next) => {
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
    next(err);
  }
};

export const getCompletedLessons = async (req, res, next) => {
  try {
    const records = await LessonProgress.find(
      { userId: req.user.id, completedAt: { $ne: null } },
      "topic completedAt -_id"
    ).lean();
    res.json({ data: records });
  } catch (err) {
    next(err);
  }
};
