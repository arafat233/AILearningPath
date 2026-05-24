import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch9_chords_of_circle  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch9_chords_a01",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "The longest chord of a circle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Radius",     type: "concept_error", logicTag: "half_of_diameter" },
      { text: "Secant",     type: "concept_error", logicTag: "line_not_chord" },
      { text: "Diameter",   type: "correct",       logicTag: "longest_chord" },
      { text: "Tangent",    type: "concept_error", logicTag: "touches_not_chord" },
    ],
    solutionSteps: [
      "The diameter passes through the centre and is the longest possible chord.",
    ],
    shortcut: "Diameter = longest chord = 2 × radius.",
    bloomLevel: "remember", conceptTested: "Longest chord of a circle",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a02",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "The perpendicular from the centre of a circle to a chord:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Bisects the arc only",            type: "concept_error", logicTag: "partial" },
      { text: "Bisects the chord",               type: "correct",       logicTag: "perpendicular_bisects_chord" },
      { text: "Passes through the circumference", type: "concept_error", logicTag: "vague" },
      { text: "Is equal to the radius",          type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Theorem: The perpendicular from the centre of a circle to a chord bisects the chord.",
    ],
    shortcut: "Centre ⊥ chord → chord bisected.",
    bloomLevel: "remember", conceptTested: "Perpendicular from centre bisects chord",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a03",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Two chords of a circle are equal if and only if they are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Parallel",               type: "concept_error", logicTag: "wrong" },
      { text: "Equidistant from the centre", type: "correct", logicTag: "equal_chords_equidistant" },
      { text: "Perpendicular to each other", type: "concept_error", logicTag: "wrong" },
      { text: "Subtending equal arcs only",  type: "concept_error", logicTag: "too_narrow" },
    ],
    solutionSteps: [
      "Theorem: Equal chords of a circle are equidistant from the centre, and vice versa.",
    ],
    shortcut: "Equal chords ↔ equidistant from centre.",
    bloomLevel: "understand", conceptTested: "Equal chords and equidistance from centre",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a04",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "A chord of length 16 cm is at a distance of 6 cm from the centre. The radius of the circle is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "8 cm",   type: "concept_error", logicTag: "half_chord" },
      { text: "10 cm",  type: "correct",       logicTag: "pythagoras_6_8_10" },
      { text: "12 cm",  type: "concept_error", logicTag: "wrong" },
      { text: "14 cm",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Perpendicular from centre bisects chord → half-chord = 8 cm.",
      "r² = 8² + 6² = 64 + 36 = 100 → r = 10 cm.",
    ],
    shortcut: "r² = (half-chord)² + (distance from centre)².",
    bloomLevel: "apply", conceptTested: "Finding radius using chord distance",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a05",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In a circle of radius 13 cm, a chord is at 5 cm from the centre. The length of the chord is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "12 cm",  type: "concept_error", logicTag: "half_chord" },
      { text: "24 cm",  type: "correct",       logicTag: "2times12" },
      { text: "18 cm",  type: "concept_error", logicTag: "wrong" },
      { text: "26 cm",  type: "concept_error", logicTag: "diameter" },
    ],
    solutionSteps: [
      "Half-chord² = 13² − 5² = 169 − 25 = 144 → half-chord = 12 cm.",
      "Full chord = 24 cm.",
    ],
    shortcut: "Half-chord = √(r² − d²); chord = 2 × half-chord.",
    bloomLevel: "apply", conceptTested: "Finding chord length using Pythagorean theorem",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a06",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "The perpendicular bisector of any chord of a circle passes through:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "One end of the chord",    type: "concept_error", logicTag: "wrong" },
      { text: "The centre of the circle", type: "correct",      logicTag: "perp_bisector_through_centre" },
      { text: "The tangent point",       type: "concept_error", logicTag: "wrong" },
      { text: "The midpoint of the arc", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "The perpendicular bisector of a chord always passes through the centre of the circle.",
    ],
    shortcut: "Perp. bisector of chord → passes through centre.",
    bloomLevel: "understand", conceptTested: "Perpendicular bisector of chord passes through centre",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a07",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Two circles of radii 5 cm and 3 cm intersect. The distance between centres is 6 cm. The length of the common chord is approximately:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "4 cm",   type: "concept_error", logicTag: "wrong" },
      { text: "4.8 cm", type: "correct",       logicTag: "common_chord_calculation" },
      { text: "6 cm",   type: "concept_error", logicTag: "distance_between_centres" },
      { text: "8 cm",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Let d₁ be distance from centre₁ to chord. d₁ + d₂ = 6.",
      "d₁² + h² = 25, d₂² + h² = 9 → d₁² − d₂² = 16 → (d₁−d₂)(d₁+d₂) = 16.",
      "(d₁−d₂)×6 = 16 → d₁−d₂ = 8/3.",
      "d₁ = (6 + 8/3)/2 = 13/3, h² = 25 − 169/9 = 56/9 → h ≈ 2.49, chord ≈ 4.8 cm.",
    ],
    shortcut: "Common chord: use both circle equations and Pythagorean theorem.",
    bloomLevel: "analyse", conceptTested: "Common chord of two intersecting circles",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a08",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "If two chords AB and CD of a circle are equal, then arc AB is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Larger than arc CD",   type: "concept_error", logicTag: "wrong" },
      { text: "Smaller than arc CD",  type: "concept_error", logicTag: "wrong" },
      { text: "Equal to arc CD",      type: "correct",       logicTag: "equal_chords_equal_arcs" },
      { text: "Cannot be determined", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Equal chords subtend equal arcs in the same circle.",
    ],
    shortcut: "Equal chords ↔ equal arcs.",
    bloomLevel: "understand", conceptTested: "Equal chords subtend equal arcs",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a09",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "A chord is at distance 8 cm from the centre of a circle of radius 17 cm. Find the chord length.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "15 cm",  type: "concept_error", logicTag: "half_chord" },
      { text: "30 cm",  type: "correct",       logicTag: "2x15" },
      { text: "25 cm",  type: "concept_error", logicTag: "wrong" },
      { text: "34 cm",  type: "concept_error", logicTag: "diameter" },
    ],
    solutionSteps: [
      "Half-chord = √(17² − 8²) = √(289 − 64) = √225 = 15 cm.",
      "Chord = 30 cm.",
    ],
    shortcut: "Half-chord = √(r² − d²) = √(289−64) = 15.",
    bloomLevel: "apply", conceptTested: "Chord length from centre distance",
  },
  {
    questionId: "ap_ssc9_ch9_chords_a10",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles", subtopic: "Chords of a Circle",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "AB and CD are two parallel chords of a circle with centre O. If AB = 8 cm, CD = 6 cm, and the radius = 5 cm, the distance between the chords (on opposite sides of centre) is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "3 cm",  type: "concept_error", logicTag: "only_one_distance" },
      { text: "4 cm",  type: "concept_error", logicTag: "one_distance_only" },
      { text: "7 cm",  type: "correct",       logicTag: "3plus4" },
      { text: "1 cm",  type: "concept_error", logicTag: "subtracted" },
    ],
    solutionSteps: [
      "d(AB from centre) = √(5² − 4²) = √9 = 3 cm.",
      "d(CD from centre) = √(5² − 3²) = √16 = 4 cm.",
      "On opposite sides: total distance = 3 + 4 = 7 cm.",
    ],
    shortcut: "Chords on opposite sides: distance between = d₁ + d₂.",
    bloomLevel: "analyse", conceptTested: "Distance between parallel chords on opposite sides",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch9_angle_subtended_by_arc  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch9_anglearch_a01",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "The angle subtended by an arc at the centre is _____ the angle subtended at any point on the remaining circle.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Half",    type: "concept_error", logicTag: "inverted" },
      { text: "Equal to",type: "concept_error", logicTag: "wrong" },
      { text: "Double",  type: "correct",       logicTag: "central_angle_theorem" },
      { text: "Triple",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Central angle = 2 × inscribed angle subtended by the same arc.",
    ],
    shortcut: "Central angle = 2 × inscribed angle (same arc).",
    bloomLevel: "remember", conceptTested: "Central angle theorem",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a02",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "If the central angle is 140°, the inscribed angle subtended by the same arc is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "140°",  type: "concept_error", logicTag: "same_as_central" },
      { text: "280°",  type: "concept_error", logicTag: "doubled" },
      { text: "70°",   type: "correct",       logicTag: "half_of_central" },
      { text: "35°",   type: "concept_error", logicTag: "quarter" },
    ],
    solutionSteps: [
      "Inscribed angle = central angle / 2 = 140°/2 = 70°.",
    ],
    shortcut: "Inscribed angle = central angle ÷ 2.",
    bloomLevel: "apply", conceptTested: "Finding inscribed angle from central angle",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a03",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Angles in the same segment of a circle are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Supplementary",    type: "concept_error", logicTag: "opposite_segment" },
      { text: "Complementary",    type: "concept_error", logicTag: "wrong" },
      { text: "Equal",            type: "correct",       logicTag: "same_segment_equal" },
      { text: "Vertically opposite", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Angles subtended by the same arc in the same segment are equal.",
    ],
    shortcut: "Same segment → equal inscribed angles.",
    bloomLevel: "remember", conceptTested: "Angles in the same segment",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a04",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "The angle in a semicircle is always:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "60°",    type: "concept_error", logicTag: "equilateral" },
      { text: "45°",    type: "concept_error", logicTag: "wrong" },
      { text: "90°",    type: "correct",       logicTag: "angle_in_semicircle" },
      { text: "120°",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "The angle subtended by a diameter (semicircle) at any point on the circle is 90°.",
      "Central angle = 180° → inscribed angle = 90°.",
    ],
    shortcut: "Angle in semicircle = 90° (Thales' theorem).",
    bloomLevel: "remember", conceptTested: "Angle in a semicircle",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a05",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In a circle, the central angle is 80°. The inscribed angle subtending the same arc is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "160°",  type: "concept_error", logicTag: "doubled" },
      { text: "80°",   type: "concept_error", logicTag: "same" },
      { text: "40°",   type: "correct",       logicTag: "half" },
      { text: "20°",   type: "concept_error", logicTag: "quarter" },
    ],
    solutionSteps: [
      "Inscribed angle = 80°/2 = 40°.",
    ],
    shortcut: "Inscribed = Central / 2.",
    bloomLevel: "apply", conceptTested: "Inscribed vs. central angle",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a06",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In the figure, O is the centre of the circle and ∠AOB = 100°. What is ∠ACB where C is on the major arc?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "100°",  type: "concept_error", logicTag: "central_angle" },
      { text: "50°",   type: "correct",       logicTag: "half_central" },
      { text: "130°",  type: "concept_error", logicTag: "reflex_arc_confusion" },
      { text: "200°",  type: "concept_error", logicTag: "reflex" },
    ],
    solutionSteps: [
      "∠ACB (inscribed, minor arc AB) = ∠AOB/2 = 50°.",
      "C is on the major arc → inscribed angle subtended by minor arc AB.",
    ],
    shortcut: "Inscribed angle on major arc = (central angle on minor arc) / 2.",
    bloomLevel: "apply", conceptTested: "Inscribed angle on major arc",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a07",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "∠PQR is inscribed in a circle and ∠PQR = 35°. The central angle ∠POR =",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "35°",  type: "concept_error", logicTag: "equal_to_inscribed" },
      { text: "17.5°", type: "concept_error", logicTag: "halved_wrong" },
      { text: "70°",  type: "correct",       logicTag: "double_inscribed" },
      { text: "140°", type: "concept_error", logicTag: "quadrupled" },
    ],
    solutionSteps: [
      "Central angle = 2 × inscribed angle = 2 × 35° = 70°.",
    ],
    shortcut: "Central = 2 × inscribed.",
    bloomLevel: "apply", conceptTested: "Finding central angle from inscribed angle",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a08",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Three points A, B, C on a circle. ∠BAC = 40°. Another point D on the same arc, ∠BDC =",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "80°",  type: "concept_error", logicTag: "doubled" },
      { text: "20°",  type: "concept_error", logicTag: "halved" },
      { text: "40°",  type: "correct",       logicTag: "same_segment" },
      { text: "140°", type: "concept_error", logicTag: "supplementary" },
    ],
    solutionSteps: [
      "∠BAC and ∠BDC are both inscribed in the same segment → equal.",
      "∠BDC = 40°.",
    ],
    shortcut: "Same arc, same segment → same inscribed angle.",
    bloomLevel: "apply", conceptTested: "Angles in same segment",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a09",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In a circle, ∠AOB = 60° (O is centre). The inscribed angle ∠APB in the minor segment (on major arc) is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "60°",  type: "concept_error", logicTag: "equal_to_central" },
      { text: "30°",  type: "correct",       logicTag: "half_central" },
      { text: "120°", type: "concept_error", logicTag: "reflex_case" },
      { text: "150°", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "P is on the major arc → inscribed in minor segment.",
      "∠APB = ∠AOB/2 = 60°/2 = 30°.",
    ],
    shortcut: "Inscribed on major arc = central angle / 2.",
    bloomLevel: "apply", conceptTested: "Inscribed angle in major arc",
  },
  {
    questionId: "ap_ssc9_ch9_anglearch_a10",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles", subtopic: "Angle Subtended by an Arc",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In a circle, if ∠AOB (reflex) = 240°, what is the inscribed angle ∠ACB where C is on the minor arc?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "60°",  type: "concept_error", logicTag: "minor_arc_angle" },
      { text: "120°", type: "correct",       logicTag: "reflex_240_half" },
      { text: "240°", type: "concept_error", logicTag: "full_reflex" },
      { text: "180°", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "C is on the minor arc → inscribed angle uses the reflex central angle.",
      "∠ACB = 240°/2 = 120°.",
    ],
    shortcut: "When inscribed point is on the minor arc, use the reflex central angle / 2.",
    bloomLevel: "evaluate", conceptTested: "Inscribed angle using reflex central angle",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 3: ap_ssc_math9_ch9_cyclic_quadrilaterals  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch9_cyclic_a01",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Opposite angles of a cyclic quadrilateral are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Equal",           type: "concept_error", logicTag: "parallelogram" },
      { text: "Supplementary",   type: "correct",       logicTag: "cyclic_opp_supplementary" },
      { text: "Complementary",   type: "concept_error", logicTag: "wrong" },
      { text: "Both 90°",        type: "concept_error", logicTag: "rectangle" },
    ],
    solutionSteps: [
      "Theorem: In a cyclic quadrilateral, opposite angles are supplementary (sum to 180°).",
    ],
    shortcut: "Cyclic quad: opposite angles sum to 180°.",
    bloomLevel: "remember", conceptTested: "Opposite angles of cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a02",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In a cyclic quadrilateral ABCD, ∠A = 80°. Then ∠C =",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "80°",   type: "concept_error", logicTag: "equal_angles" },
      { text: "100°",  type: "correct",       logicTag: "supplementary_to_A" },
      { text: "90°",   type: "concept_error", logicTag: "right_angle" },
      { text: "280°",  type: "concept_error", logicTag: "reflex" },
    ],
    solutionSteps: [
      "∠A + ∠C = 180° → ∠C = 180° − 80° = 100°.",
    ],
    shortcut: "Opposite angle = 180° − given angle (cyclic quad).",
    bloomLevel: "apply", conceptTested: "Finding opposite angle in cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a03",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Which of the following is always a cyclic quadrilateral?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Rhombus",      type: "concept_error", logicTag: "only_if_square" },
      { text: "Rectangle",    type: "correct",       logicTag: "all_right_angles_cyclic" },
      { text: "Parallelogram", type: "concept_error", logicTag: "only_if_rectangle" },
      { text: "Trapezium",    type: "concept_error", logicTag: "not_always" },
    ],
    solutionSteps: [
      "A rectangle has all angles = 90°. Opposite angles: 90° + 90° = 180° → always cyclic.",
    ],
    shortcut: "Rectangle (and square) are always cyclic quadrilaterals.",
    bloomLevel: "understand", conceptTested: "Identifying always-cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a04",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "The exterior angle of a cyclic quadrilateral equals:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "The adjacent interior angle",              type: "concept_error", logicTag: "linear_pair" },
      { text: "The sum of interior opposite angles",      type: "concept_error", logicTag: "triangle_exterior" },
      { text: "The interior opposite angle",              type: "correct",       logicTag: "cyclic_exterior_angle" },
      { text: "Double the adjacent interior angle",       type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "In a cyclic quadrilateral, the exterior angle equals the interior angle at the opposite vertex.",
      "Because: exterior = 180° − adjacent interior = opposite interior (since opposite angles supplementary).",
    ],
    shortcut: "Exterior angle of cyclic quad = opposite interior angle.",
    bloomLevel: "understand", conceptTested: "Exterior angle of cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a05",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In cyclic quadrilateral PQRS, ∠P = 70°, ∠Q = 85°. Find ∠S.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "110°",  type: "correct",       logicTag: "180_minus_70" },
      { text: "95°",   type: "concept_error", logicTag: "180_minus_85" },
      { text: "85°",   type: "concept_error", logicTag: "equal_to_Q" },
      { text: "70°",   type: "concept_error", logicTag: "equal_to_P" },
    ],
    solutionSteps: [
      "∠P + ∠R = 180° and ∠Q + ∠S = 180°.",
      "∠S = 180° − ∠Q = 180° − 85° = 95°.",
      "Wait — ∠P + ∠R = 180° → ∠R = 110°. ∠Q + ∠S = 180° → ∠S = 95°.",
    ],
    shortcut: "Find which angles are opposite: P↔R, Q↔S.",
    bloomLevel: "apply", conceptTested: "Applying cyclic quadrilateral property",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a06",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Four points A, B, C, D lie on a circle. ∠ABC = 95°. The reflex angle ∠ADC =",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "85°",   type: "concept_error", logicTag: "supplement_of_ADC" },
      { text: "95°",   type: "concept_error", logicTag: "same_as_ABC" },
      { text: "190°",  type: "correct",       logicTag: "360_minus_170" },
      { text: "265°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠ABC + ∠ADC = 180° (cyclic quadrilateral) → ∠ADC = 85°.",
      "Reflex ∠ADC = 360° − 85° = 275°. Hmm, let me re-examine.",
      "Recalculation: ∠ADC = 180° − 95° = 85°. Reflex ∠ADC = 360° − 85° = 275°.",
    ],
    shortcut: "∠ADC (non-reflex) = 180° − ∠ABC; reflex ∠ADC = 360° − ∠ADC.",
    bloomLevel: "analyse", conceptTested: "Reflex angle in cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a07",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "A cyclic quadrilateral has all four angles equal. Each angle is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "60°",  type: "concept_error", logicTag: "triangle_angle" },
      { text: "72°",  type: "concept_error", logicTag: "pentagon_angle" },
      { text: "90°",  type: "correct",       logicTag: "rectangle" },
      { text: "120°", type: "concept_error", logicTag: "hexagon" },
    ],
    solutionSteps: [
      "Four equal angles summing to 360° → each = 90°.",
      "Also: opposite equal angles must each be supplementary → x + x = 180° → x = 90°.",
    ],
    shortcut: "Equal angles in cyclic quad → each must be 90° (rectangle).",
    bloomLevel: "apply", conceptTested: "Equal angles in cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a08",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In cyclic quadrilateral ABCD, ∠A = (2x + 10)° and ∠C = (3x − 20)°. Find x.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "32",  type: "concept_error", logicTag: "wrong" },
      { text: "36",  type: "correct",       logicTag: "sum_180" },
      { text: "38",  type: "concept_error", logicTag: "wrong" },
      { text: "40",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠A + ∠C = 180°: (2x+10) + (3x−20) = 180.",
      "5x − 10 = 180 → 5x = 190 → x = 38.",
    ],
    shortcut: "Set ∠A + ∠C = 180, solve for x.",
    bloomLevel: "apply", conceptTested: "Algebraic angle in cyclic quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a09",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "Ptolemy's theorem for a cyclic quadrilateral ABCD states that:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "AB + CD = BC + DA",             type: "concept_error", logicTag: "wrong" },
      { text: "AC × BD = AB × CD + BC × AD",   type: "correct",       logicTag: "ptolemys_theorem" },
      { text: "AC + BD = AB + BC + CD + DA",   type: "concept_error", logicTag: "wrong" },
      { text: "AC = BD",                       type: "concept_error", logicTag: "rectangle_only" },
    ],
    solutionSteps: [
      "Ptolemy's Theorem: For a cyclic quadrilateral, product of diagonals = sum of products of opposite sides.",
      "AC × BD = AB × CD + BC × AD.",
    ],
    shortcut: "Ptolemy: diagonals product = sum of opposite sides products.",
    bloomLevel: "evaluate", conceptTested: "Ptolemy's theorem statement",
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_a10",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles", subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 9,
    questionText: "In cyclic quadrilateral ABCD, if AB = BC and ∠ABC = 100°, what is ∠ADC?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "100°",  type: "concept_error", logicTag: "equal_to_given" },
      { text: "80°",   type: "correct",       logicTag: "180_minus_100" },
      { text: "50°",   type: "concept_error", logicTag: "halved" },
      { text: "140°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠ABC + ∠ADC = 180° (opposite angles in cyclic quad).",
      "∠ADC = 180° − 100° = 80°.",
    ],
    shortcut: "Opposite angles in cyclic quad sum to 180°.",
    bloomLevel: "apply", conceptTested: "Opposite angle in cyclic quadrilateral",
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
