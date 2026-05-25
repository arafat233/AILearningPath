import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { User, NcertNote, Question } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { boardIdFilter, boardFromTopicId } from "../utils/boardFilter.js";

// GET /api/v1/ncert/chapters
export async function listNcertChapters(req, res, next) {
  try {
    const { board = "CBSE", grade = "10", subject = "Mathematics" } = req.query;
    const chapters = await NcertChapter.find({ board, grade, subject })
      .select("chapterId number title overview subchapters.id subchapters.number subchapters.title subchapters.concepts.id subchapters.concepts.name subchapters.concepts.topics.id")
      .sort({ number: 1 })
      .lean();
    res.json({ data: chapters });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/ncert/available-subjects?board=X&grade=Y
// Returns the subjects that actually have at least one chapter seeded for the
// given board + grade. Used by the Lessons page to hide subjects we don't yet
// have content for (e.g. AP_SSC Class 10 currently has Math only — Science /
// English / Social / Hindi tiles must NOT appear for that user).
export async function listAvailableSubjects(req, res, next) {
  try {
    const board = String(req.query.board || "CBSE").toUpperCase();
    const grade = String(req.query.grade || "10");
    const rows = await NcertChapter.aggregate([
      { $match: { board, grade } },
      { $group: { _id: "$subject", chapterCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const data = rows.map((r) => ({ subject: r._id, chapterCount: r.chapterCount }));
    res.json({ data });
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

// GET /api/v1/ncert/topics?chapterNumber=1&subject=Science[&chapterId=ap_ssc_math9_ch1]
//
// When `chapterId` is provided (e.g. "ap_ssc_math9_ch1"), the result is
// restricted to topics whose topicId starts with that chapter id. This is
// the only way to disambiguate between, say, ap_ssc_math9_ch1_* and
// ap_ssc_math10_ch1_* — both share chapterNumber=1 and subject=Mathematics.
// Callers rendering a specific chapter MUST pass chapterId.
export async function listNcertTopics(req, res, next) {
  try {
    const { chapterNumber, subject, chapterId } = req.query;

    // Resolve the user's board so we never leak cross-board content
    const userDoc = req.user?.id
      ? await User.findById(req.user.id).select("examBoard").lean()
      : null;
    const userBoard = (userDoc?.examBoard || "CBSE").toUpperCase();

    const conditions = [];
    if (chapterNumber) conditions.push({ chapterNumber: Number(chapterNumber) });
    if (chapterId) {
      const escaped = String(chapterId).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      conditions.push({ topicId: new RegExp(`^${escaped}_`) });
    }
    if (subject) {
      // Safety net: also catch legacy Math Class 10 records where subject was
      // never written (imported before the field existed). They use the
      // ch{n}_s{n}_c{n}_t{n} topicId pattern, distinct from all other subjects.
      if (subject === "Mathematics") {
        conditions.push({
          $or: [
            { subject: "Mathematics" },
            { subject: { $in: [null, ""] }, topicId: /^ch\d+_/ },
          ],
        });
      } else {
        conditions.push({ subject });
      }
    }

    // Board scoping: use boardIdFilter so icse_math10_* and icse10_* (legacy) are both handled
    conditions.push(boardIdFilter(userBoard, "topicId"));

    const filter = conditions.length === 1 ? conditions[0] : { $and: conditions };
    const topics = await NcertTopicContent.find(filter)
      .select("topicId name chapterNumber subject")
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

    // Board access check
    const userDoc = req.user?.id
      ? await User.findById(req.user.id).select("examBoard").lean()
      : null;
    const userBoard = (userDoc?.examBoard || "CBSE").toUpperCase();
    // Use boardFromTopicId so icse_math10_* and icse10_* (legacy) are both detected
    const topicBoard = boardFromTopicId(topicId) || "CBSE";
    if (topicBoard !== userBoard) {
      return next(new AppError("Topic content not found", 404));
    }

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

// GET /api/v1/ncert/topics/:topicId/paper-questions
export async function getPaperQuestions(req, res, next) {
  try {
    const { topicId } = req.params;
    const questions = await Question.find({
      topicId,
      questionType: { $in: ["free_text", "numeric", "numeric_range", "fill_blank"] },
      isFlagged: { $ne: true },
      deletedAt: null,
    })
      .select("questionText questionType difficulty marks expectedTime conceptTested bloomLevel correctAnswer solutionSteps stepByStep")
      .sort({ difficulty: 1 })
      .lean();
    res.json({ data: questions });
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

// GET /api/v1/ncert/topics/:topicId/mastery-test
// Returns 3 easy + 4 medium + 3 hard MCQs for the topic, excluding any ids in
// req.query.excludeIds (comma-separated). Used by the spaced mastery flow.
// SECURITY: options are stripped of their "correct" flag and shuffled before
// sending so the client cannot see which option is correct. Grading happens
// server-side via submitMasteryTest.
function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getMasteryTest(req, res, next) {
  try {
    const { topicId } = req.params;
    const exclude = (req.query.excludeIds || "")
      .split(",")
      .filter(Boolean)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const pull = async (difficulty, count) => Question.aggregate([
      { $match: {
          topicId,
          questionType: "mcq",
          difficulty,
          isFlagged: { $ne: true },
          deletedAt: null,
          ...(exclude.length ? { _id: { $nin: exclude } } : {}),
      }},
      { $sample: { size: count } },
      { $project: { questionText: 1, options: 1, difficulty: 1, expectedTime: 1, marks: 1 } },
    ]);

    const [easy, medium, hard] = await Promise.all([
      pull("easy", 3),
      pull("medium", 4),
      pull("hard", 3),
    ]);

    // Strip correct-flag, shuffle options, keep only safe fields
    const sanitise = (q) => ({
      _id: q._id,
      questionText: q.questionText,
      difficulty: q.difficulty,
      expectedTime: q.expectedTime,
      marks: q.marks,
      options: shuffleArr((q.options || []).map((o) => ({ text: o.text }))),
    });

    res.json({
      data: {
        questions: [...easy, ...medium, ...hard].map(sanitise),
        counts: { easy: easy.length, medium: medium.length, hard: hard.length },
        target: { easy: 3, medium: 4, hard: 3 },
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/ncert/topics/:topicId/mastery-test/submit
// Body: { answers: [{ questionId, selectedText }] }
// Returns: { score, total, perQuestion: [{ questionId, correct, correctText }] }
export async function submitMasteryTest(req, res, next) {
  try {
    const { topicId } = req.params;
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return next(new AppError("answers must be a non-empty array", 400));
    }
    const ids = answers
      .map((a) => a.questionId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const questions = await Question.find({ _id: { $in: ids }, topicId }).select("options").lean();
    const byId = Object.fromEntries(questions.map((q) => [String(q._id), q]));

    const perQuestion = answers.map((a) => {
      const q = byId[String(a.questionId)];
      if (!q) return { questionId: a.questionId, correct: false, correctText: null };
      const correctOpt = (q.options || []).find((o) => o.type === "correct");
      const correctText = correctOpt?.text || null;
      const correct = correctText != null && a.selectedText === correctText;
      return { questionId: a.questionId, correct, correctText };
    });
    const score = perQuestion.filter((p) => p.correct).length;
    res.json({ data: { score, total: answers.length, perQuestion } });
  } catch (err) {
    next(err);
  }
}
