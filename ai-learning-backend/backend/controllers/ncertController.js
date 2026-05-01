import { NcertChapter } from "../models/ncertChapterModel.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
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
