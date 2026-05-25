import express from "express";
import { Topic, Question } from "../models/index.js";
import { optionalAuth } from "../middleware/auth.js";
import { boardIdFilter, questionBoardFilter } from "../utils/boardFilter.js";
import { getCachedBoard } from "../services/adaptiveService.js";

const r = express.Router();

// Supports ?grade=10&subject=Math&board=CBSE query filters.
// When the user is logged in their board is read from Redis/DB and overrides the query param.
//
// Merges two sources so newer boards/grades aren't invisible to Practice:
//   1. Legacy `Topic` collection — has explicit examBoard/grade/subject fields.
//      Populated mainly for CBSE Class 10 from earlier seed work.
//   2. `NcertTopicContent` — newer architecture where board+grade are encoded
//      in the topicId prefix (e.g. ap_ssc_math9_ch1_irrational_numbers).
// Without the merge, AP_SSC / ICSE / and any non-CBSE-10 user gets an empty
// Practice topic picker.
r.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { grade, subject } = req.query;

    // Board: prefer user's stored board (auth), else query param, else default CBSE
    let board = (req.query.board || "CBSE").toUpperCase();
    if (req.user?.id) {
      try { board = await getCachedBoard(req.user.id); } catch { /* keep default */ }
    }

    // Source 1 — legacy Topic (mostly CBSE Class 10; populated by earlier seeds)
    const legacyFilter = { deletedAt: null, examBoard: board };
    if (grade)   legacyFilter.grade   = grade;
    if (subject) legacyFilter.subject = subject;
    const legacy = await Topic.find(legacyFilter).sort({ examFrequency: -1 }).lean();

    // Source 2 — distinct chapter names from the Question collection, scoped
    // to the user's board (so Practice always shows topics that actually have
    // questions to serve). This covers AP_SSC / ICSE / and any future board
    // whose content hasn't been backfilled into the legacy Topic collection.
    let fromQuestions = [];
    if (subject) {
      // Question.subject uses long-form names (Mathematics, Social Science)
      // while Topic.subject + frontend use short forms (Math, Social).
      const subjectFull =
        subject === "Math"   ? "Mathematics"   :
        subject === "Social" ? "Social Science" :
        subject;
      const qConditions = [
        { subject: { $in: [subject, subjectFull] } },
        questionBoardFilter(board),
        boardIdFilter(board, "topicId"),
      ];
      // For Math, encode grade via the topicId pattern (math9_, cbse_math9_,
      // icse_math9_, ap_ssc_math9_) so Class 9 questions don't mix with 10.
      if (subject === "Math" && grade) {
        qConditions.push({
          $or: [
            { topicId: new RegExp(`_math${grade}_`) },
            { topicId: new RegExp(`^math${grade}_`) },
          ],
        });
      }
      const distinctTopics = await Question.distinct("topic", { $and: qConditions });
      fromQuestions = distinctTopics
        .filter(Boolean)
        .map((name) => ({ name, examBoard: board, grade, subject }));
    }

    // Merge — dedupe by `name`. Legacy first so its richer metadata
    // (examFrequency etc.) wins for any names that exist in both.
    const seenNames = new Set(legacy.map((t) => t.name));
    const merged = [
      ...legacy,
      ...fromQuestions.filter((t) => !seenNames.has(t.name)),
    ];
    res.json(merged);
  } catch (err) {
    next(err);
  }
});

// Returns unique subjects and grades for a given board (?board=CBSE or ICSE).
r.get("/meta", optionalAuth, async (req, res, next) => {
  try {
    let board = (req.query.board || "CBSE").toUpperCase();
    if (req.user?.id) {
      try { board = await getCachedBoard(req.user.id); } catch { /* keep default */ }
    }
    const [subjects, grades] = await Promise.all([
      Topic.distinct("subject", { examBoard: board }),
      Topic.distinct("grade",   { examBoard: board }),
    ]);
    res.json({
      subjects: subjects.filter(Boolean).sort(),
      grades:   grades.filter(Boolean).sort(),
    });
  } catch (err) {
    next(err);
  }
});

export default r;
