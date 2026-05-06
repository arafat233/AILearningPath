import { NcertChapter } from "../models/ncertChapterModel.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { User, NcertNote } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// GET /api/v1/ncert/chapters
export async function listNcertChapters(req, res, next) {
  try {
    const { board = "CBSE", grade = "10", subject = "Mathematics" } = req.query;
    const chapters = await NcertChapter.find({ board, grade, subject })
      .select("chapterId number title overview subchapters.id subchapters.number subchapters.title subchapters.concepts.id subchapters.concepts.name")
      .sort({ number: 1 })
      .lean();
    res.json({ data: chapters });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/ncert/chapters/:chapterId
export async function getNcertChapter(req, res, next) {
  try {
    const { chapterId } = req.params;
    const chapter = await NcertChapter.findOne({ chapterId }).lean();
    if (!chapter) return next(new AppError("Chapter not found", 404));
    res.json({ data: chapter });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/ncert/topics?chapterNumber=1
export async function listNcertTopics(req, res, next) {
  try {
    const { chapterNumber } = req.query;
    const filter = chapterNumber ? { chapterNumber: Number(chapterNumber) } : {};
    const topics = await NcertTopicContent.find(filter)
      .select("topicId name chapterNumber")
      .sort({ topicId: 1 })
      .lean();
    res.json({ data: topics });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/ncert/topics/:topicId
export async function getNcertTopicContent(req, res, next) {
  try {
    const { topicId } = req.params;
    const content = await NcertTopicContent.findOne({ topicId }).lean();
    if (!content) return next(new AppError("Topic content not found", 404));
    res.json({ data: content });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/ncert/studied
export async function getStudiedTopics(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("studiedNcertTopics").lean();
    res.json({ data: user?.studiedNcertTopics || [] });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/ncert/studied/:topicId  — toggle on/off
export async function toggleStudiedTopic(req, res, next) {
  try {
    const { topicId } = req.params;
    const user = await User.findById(req.user.id).select("studiedNcertTopics").lean();
    const already = (user?.studiedNcertTopics || []).includes(topicId);
    if (already) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { studiedNcertTopics: topicId } });
    } else {
      await User.findByIdAndUpdate(req.user.id, { $addToSet: { studiedNcertTopics: topicId } });
    }
    res.json({ data: { studied: !already, topicId } });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/ncert/notes/:topicId
export async function getNcertNote(req, res, next) {
  try {
    const note = await NcertNote.findOne({ userId: req.user.id, topicId: req.params.topicId }).lean();
    res.json({ data: { text: note?.text || "" } });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/ncert/notes/:topicId  — upsert
export async function saveNcertNote(req, res, next) {
  try {
    const { text } = req.body;
    if (typeof text !== "string") return next(new AppError("text must be a string", 400));
    await NcertNote.findOneAndUpdate(
      { userId: req.user.id, topicId: req.params.topicId },
      { text: text.slice(0, 5000), updatedAt: new Date() },
      { upsert: true }
    );
    res.json({ data: { saved: true } });
  } catch (err) {
    next(err);
  }
}
