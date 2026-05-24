import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch5_euclid_definitions_axioms  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch5_euclid_a01",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "According to Euclid, a point is that which has:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Length only",          type: "concept_error", logicTag: "line_not_point" },
      { text: "No part",              type: "correct",       logicTag: "euclid_def_1" },
      { text: "Length and breadth",   type: "concept_error", logicTag: "surface" },
      { text: "Three dimensions",     type: "concept_error", logicTag: "solid" },
    ],
    solutionSteps: [
      "Euclid's Definition 1: A point is that which has no part.",
    ],
    shortcut: "Point → no part; Line → length only; Surface → length and breadth.",
    bloomLevel: "remember", conceptTested: "Euclid's definition of a point",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a02",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "According to Euclid, a line is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Breadthless length",   type: "correct",       logicTag: "euclid_def_line" },
      { text: "That which has no part", type: "concept_error", logicTag: "definition_of_point" },
      { text: "A set of planes",      type: "concept_error", logicTag: "wrong" },
      { text: "An area without depth", type: "concept_error", logicTag: "surface" },
    ],
    solutionSteps: [
      "Euclid's Definition 2: A line is breadthless length.",
    ],
    shortcut: "Line = breadthless length = only dimension is length.",
    bloomLevel: "remember", conceptTested: "Euclid's definition of a line",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a03",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Euclid's axioms are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Statements specific to geometry only",        type: "concept_error", logicTag: "postulates" },
      { text: "General truths common to all branches of mathematics", type: "correct", logicTag: "axioms" },
      { text: "Theorems that require proof",                 type: "concept_error", logicTag: "wrong" },
      { text: "Definitions of geometric shapes",            type: "concept_error", logicTag: "definitions" },
    ],
    solutionSteps: [
      "Axioms are universal self-evident truths not specific to geometry.",
      "Postulates are specific to geometry.",
    ],
    shortcut: "Axiom = universal truth; Postulate = geometry-specific truth.",
    bloomLevel: "understand", conceptTested: "Difference between axioms and postulates",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a04",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Which of Euclid's postulates states that a terminated line (line segment) can be extended indefinitely?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "First postulate",   type: "concept_error", logicTag: "draw_line" },
      { text: "Second postulate",  type: "correct",       logicTag: "extend_indefinitely" },
      { text: "Third postulate",   type: "concept_error", logicTag: "circle" },
      { text: "Fifth postulate",   type: "concept_error", logicTag: "parallel" },
    ],
    solutionSteps: [
      "Euclid's Second Postulate: A terminated line can be produced indefinitely.",
    ],
    shortcut: "P1: draw line segment; P2: extend line; P3: draw circle; P4: right angles equal; P5: parallel lines.",
    bloomLevel: "remember", conceptTested: "Euclid's second postulate",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a05",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "The Euclid's axiom 'Things which are equal to the same thing are equal to one another' is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "First axiom",   type: "correct",       logicTag: "euclid_axiom_1" },
      { text: "Second axiom",  type: "concept_error", logicTag: "equals_added_equals" },
      { text: "Third axiom",   type: "concept_error", logicTag: "wrong" },
      { text: "Fourth axiom",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Euclid's First Axiom: Things which are equal to the same thing are equal to one another.",
      "This is the transitive property: if a=b and b=c then a=c.",
    ],
    shortcut: "First axiom = transitivity of equality.",
    bloomLevel: "remember", conceptTested: "Euclid's first axiom",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a06",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "How many lines can pass through two distinct points?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "No line",          type: "concept_error", logicTag: "impossible" },
      { text: "Exactly one line", type: "correct",       logicTag: "euclid_first_postulate" },
      { text: "Two lines",        type: "concept_error", logicTag: "wrong" },
      { text: "Infinitely many",  type: "concept_error", logicTag: "through_one_point" },
    ],
    solutionSteps: [
      "Euclid's First Postulate: Given two distinct points, there is one and only one line through them.",
    ],
    shortcut: "2 distinct points → exactly 1 line.",
    bloomLevel: "remember", conceptTested: "Euclid's first postulate",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a07",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Euclid's third postulate concerns drawing a:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Straight line",      type: "concept_error", logicTag: "first_postulate" },
      { text: "Right angle",        type: "concept_error", logicTag: "fourth" },
      { text: "Circle",             type: "correct",       logicTag: "third_postulate" },
      { text: "Perpendicular line", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Third Postulate: A circle can be drawn with any centre and any radius.",
    ],
    shortcut: "P3 → circle with given centre and radius.",
    bloomLevel: "remember", conceptTested: "Euclid's third postulate",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a08",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "If AB = CD and CD = EF, then AB = EF. This follows from:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Euclid's second axiom",  type: "concept_error", logicTag: "addition_axiom" },
      { text: "Euclid's first axiom",   type: "correct",       logicTag: "transitivity" },
      { text: "Euclid's fifth postulate", type: "concept_error", logicTag: "parallel" },
      { text: "Euclid's third postulate", type: "concept_error", logicTag: "circle" },
    ],
    solutionSteps: [
      "First axiom: things equal to the same thing are equal to one another.",
      "AB = CD = EF → AB = EF.",
    ],
    shortcut: "Transitivity of equality = Euclid's first axiom.",
    bloomLevel: "apply", conceptTested: "Applying Euclid's first axiom",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a09",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "In Euclid's system, which of the following is taken as undefined?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Angle",     type: "concept_error", logicTag: "defined" },
      { text: "Triangle",  type: "concept_error", logicTag: "defined" },
      { text: "Point",     type: "correct",       logicTag: "undefined_primitive" },
      { text: "Circle",    type: "concept_error", logicTag: "defined" },
    ],
    solutionSteps: [
      "In modern mathematics, point, line, and plane are taken as undefined (primitive) terms.",
      "Euclid gave descriptions (not rigorous definitions) of these.",
    ],
    shortcut: "Undefined primitives: point, line, plane.",
    bloomLevel: "evaluate", conceptTested: "Undefined terms in Euclidean geometry",
  },
  {
    questionId: "ap_ssc9_ch5_euclid_a10",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Euclid's geometry is based on how many postulates?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "3",   type: "concept_error", logicTag: "wrong" },
      { text: "4",   type: "concept_error", logicTag: "wrong" },
      { text: "5",   type: "correct",       logicTag: "five_postulates" },
      { text: "10",  type: "concept_error", logicTag: "confusing_with_axioms" },
    ],
    solutionSteps: [
      "Euclid's Elements begins with 5 definitions (often listed as many more),",
      "5 common notions (axioms), and 5 postulates.",
      "The geometry is built on these 5 postulates.",
    ],
    shortcut: "5 postulates form the foundation of Euclidean geometry.",
    bloomLevel: "remember", conceptTested: "Number of Euclid's postulates",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch5_fifth_postulate  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch5_fifth_a01",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Playfair's axiom (equivalent to the fifth postulate) states that through a given point NOT on a given line, how many lines can be drawn parallel to the given line?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "None",             type: "concept_error", logicTag: "elliptic_geometry" },
      { text: "Exactly one",      type: "correct",       logicTag: "playfair_axiom" },
      { text: "Exactly two",      type: "concept_error", logicTag: "wrong" },
      { text: "Infinitely many",  type: "concept_error", logicTag: "hyperbolic_geometry" },
    ],
    solutionSteps: [
      "Playfair's Axiom: Through a point not on a line, exactly one parallel line can be drawn.",
      "This is equivalent to Euclid's Fifth Postulate in Euclidean geometry.",
    ],
    shortcut: "Euclid/Playfair: exactly 1 parallel through external point.",
    bloomLevel: "remember", conceptTested: "Playfair's axiom",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a02",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Euclid's fifth postulate is also known as the:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Point postulate",     type: "concept_error", logicTag: "wrong" },
      { text: "Circle postulate",    type: "concept_error", logicTag: "third_postulate" },
      { text: "Parallel postulate",  type: "correct",       logicTag: "fifth_parallel" },
      { text: "Extension postulate", type: "concept_error", logicTag: "second" },
    ],
    solutionSteps: [
      "The fifth postulate is known as the Parallel Postulate because it describes the condition for two lines to meet (and by equivalence, when they are parallel).",
    ],
    shortcut: "Fifth postulate = Parallel Postulate.",
    bloomLevel: "remember", conceptTested: "Alternative name for fifth postulate",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a03",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Non-Euclidean geometry arises when:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "We reject all of Euclid's postulates",          type: "concept_error", logicTag: "too_extreme" },
      { text: "We modify or replace Euclid's fifth postulate", type: "correct",       logicTag: "fifth_modified" },
      { text: "We add a sixth postulate",                      type: "concept_error", logicTag: "wrong" },
      { text: "We use more than two dimensions",               type: "concept_error", logicTag: "dimension_wrong" },
    ],
    solutionSteps: [
      "Non-Euclidean geometries (hyperbolic, elliptic) arise when the fifth postulate is replaced with alternatives.",
    ],
    shortcut: "Non-Euclidean = different fifth postulate.",
    bloomLevel: "understand", conceptTested: "Origin of non-Euclidean geometry",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a04",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Two distinct lines cannot have more than ___ point(s) in common.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "0",   type: "concept_error", logicTag: "they_can_intersect" },
      { text: "1",   type: "correct",       logicTag: "intersect_at_most_once" },
      { text: "2",   type: "concept_error", logicTag: "wrong" },
      { text: "Infinitely many", type: "concept_error", logicTag: "coincident_not_distinct" },
    ],
    solutionSteps: [
      "Two distinct lines intersect at most once.",
      "If they share two points, they would be the same line (not distinct).",
    ],
    shortcut: "Distinct lines: at most 1 common point.",
    bloomLevel: "understand", conceptTested: "Maximum common points of two distinct lines",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a05",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "According to Euclid's fifth postulate, if a transversal makes interior angles summing to less than 180° on one side, the lines will:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Be parallel",                        type: "concept_error", logicTag: "sum_180_parallel" },
      { text: "Meet on the side where sum > 180°",  type: "concept_error", logicTag: "wrong_side" },
      { text: "Meet on the side where sum < 180°",  type: "correct",       logicTag: "fifth_postulate_statement" },
      { text: "Never meet",                         type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Fifth postulate: if the two interior angles on the same side sum to less than two right angles (< 180°), the lines will eventually meet on that side.",
    ],
    shortcut: "Lines meet on the side where interior angles sum < 180°.",
    bloomLevel: "understand", conceptTested: "Statement of fifth postulate",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a06",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "If a transversal cuts two lines making co-interior angles summing to exactly 180°, the lines are:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Intersecting",     type: "concept_error", logicTag: "wrong" },
      { text: "Parallel",         type: "correct",       logicTag: "co_interior_180_parallel" },
      { text: "Perpendicular",    type: "concept_error", logicTag: "90_degrees" },
      { text: "Coincident",       type: "concept_error", logicTag: "same_line" },
    ],
    solutionSteps: [
      "When co-interior angles (same-side interior angles) sum to 180°, lines are parallel (by converse of fifth postulate).",
    ],
    shortcut: "Co-interior angles = 180° ↔ parallel lines.",
    bloomLevel: "apply", conceptTested: "Co-interior angles and parallel lines",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a07",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Euclid's fifth postulate is considered special because:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "It is the simplest of all postulates",          type: "concept_error", logicTag: "opposite_true" },
      { text: "It cannot be used to prove any theorem",        type: "concept_error", logicTag: "wrong" },
      { text: "Mathematicians tried for centuries to prove it from the other four", type: "correct", logicTag: "historical_uniqueness" },
      { text: "It defines parallel lines",                     type: "concept_error", logicTag: "too_specific" },
    ],
    solutionSteps: [
      "Unlike the other four postulates, the fifth postulate seems less obvious.",
      "Mathematicians tried for 2000+ years to prove it from P1–P4, leading eventually to non-Euclidean geometries.",
    ],
    shortcut: "Fifth postulate's independence from the rest is historically significant.",
    bloomLevel: "evaluate", conceptTested: "Historical significance of fifth postulate",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a08",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "How many points do two parallel lines have in common?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "One",          type: "concept_error", logicTag: "they_intersect_at_one" },
      { text: "Two",          type: "concept_error", logicTag: "wrong" },
      { text: "Infinitely many", type: "concept_error", logicTag: "coincident" },
      { text: "Zero",         type: "correct",       logicTag: "parallel_never_meet" },
    ],
    solutionSteps: [
      "By definition, parallel lines never meet → 0 common points.",
    ],
    shortcut: "Parallel lines → 0 intersection points.",
    bloomLevel: "understand", conceptTested: "Common points of parallel lines",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a09",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "In hyperbolic geometry (non-Euclidean), through a point not on a line, how many parallels exist?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "None",             type: "concept_error", logicTag: "elliptic" },
      { text: "Exactly one",      type: "concept_error", logicTag: "euclidean" },
      { text: "Infinitely many",  type: "correct",       logicTag: "hyperbolic_many_parallels" },
      { text: "Exactly two",      type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "In hyperbolic geometry, through an external point, infinitely many lines can be drawn parallel to the given line.",
      "This replaces Euclid's 5th postulate with a different one.",
    ],
    shortcut: "Hyperbolic: ∞ parallels. Elliptic: 0 parallels. Euclidean: 1 parallel.",
    bloomLevel: "evaluate", conceptTested: "Non-Euclidean geometries and parallels",
  },
  {
    questionId: "ap_ssc9_ch5_fifth_a10",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry", subtopic: "Euclid's Fifth Postulate",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 5,
    questionText: "Which of the following is equivalent to Euclid's fifth postulate?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "The angle sum of a triangle can be any value",        type: "concept_error", logicTag: "non_euclidean" },
      { text: "The angle sum of a triangle is always 180°",          type: "correct",       logicTag: "triangle_angle_sum" },
      { text: "Two perpendicular lines always intersect",            type: "concept_error", logicTag: "unrelated" },
      { text: "A line segment has two endpoints",                    type: "concept_error", logicTag: "definition" },
    ],
    solutionSteps: [
      "One of the important consequences and equivalents of the fifth postulate is: the sum of angles in a triangle = 180°.",
      "In non-Euclidean geometries, this sum differs from 180°.",
    ],
    shortcut: "Angle sum = 180° ↔ fifth postulate (in Euclidean geometry).",
    bloomLevel: "evaluate", conceptTested: "Equivalent statement of fifth postulate",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  let upserted = 0, skipped = 0;
  for (const q of questions) {
    try {
      await Question.findOneAndUpdate(
        { questionId: q.questionId },
        { $set: q },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${q.questionId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) { console.log(`  — skip ${q.questionId}`); skipped++; }
      else throw err;
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
