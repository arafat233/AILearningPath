import { Chapter } from "../models/chapterModel.js";
import { AppError } from "../utils/AppError.js";

// GET /api/v1/curriculum?subject=Mathematics&grade=10&board=CBSE
export async function listChapters(req, res, next) {
  try {
    const { subject = "Mathematics", grade = "10", board = "CBSE" } = req.query;
    const chapters = await Chapter.find({ subject, grade, board })
      .select("-sections.microConcepts.explanation") // keep list lightweight
      .sort({ chapterNumber: 1 })
      .lean();
    res.json({ data: chapters });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/curriculum/:chapterNumber?subject=Mathematics&grade=10&board=CBSE
export async function getChapter(req, res, next) {
  try {
    const { subject = "Mathematics", grade = "10", board = "CBSE" } = req.query;
    const chapterNumber = parseInt(req.params.chapterNumber, 10);
    if (isNaN(chapterNumber)) return next(new AppError("Invalid chapter number", 400));

    const chapter = await Chapter.findOne({ subject, grade, board, chapterNumber }).lean();
    if (!chapter) return next(new AppError("Chapter not found", 404));
    res.json({ data: chapter });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/curriculum/subjects — distinct subjects+grades in DB (for future expansion)
export async function listSubjects(req, res, next) {
  try {
    const subjects = await Chapter.aggregate([
      { $group: { _id: { subject: "$subject", grade: "$grade", board: "$board" }, chapterCount: { $sum: 1 } } },
      { $sort: { "_id.grade": 1, "_id.subject": 1 } },
    ]);
    res.json({ data: subjects.map((s) => ({ ...s._id, chapterCount: s.chapterCount })) });
  } catch (err) {
    next(err);
  }
}
