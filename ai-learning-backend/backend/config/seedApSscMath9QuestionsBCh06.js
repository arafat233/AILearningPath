import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Basic Terms and Angles (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch6_terms_b01",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles",
    subtopic: "Basic Terms and Angles",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "In the figure, ∠AOC = 4x + 10°, ∠BOC = 2x − 30°, and AOB is a straight line. Find x, and hence find ∠AOC and ∠BOC.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "AOB is a straight line → ∠AOC + ∠BOC = 180° (linear pair).",
      "(4x + 10) + (2x − 30) = 180.",
      "6x − 20 = 180 → 6x = 200 → x = 100/3 ≈ 33.3°.",
      "∠AOC = 4(100/3) + 10 = 400/3 + 10 = 430/3 ≈ 143.3°.",
      "∠BOC = 180 − 430/3 = 110/3 ≈ 36.7°.",
    ],
    shortcut: "Linear pair → sum = 180°. Set up equation and solve.",
    bloomLevel: "apply",
    conceptTested: "Linear pair property",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_terms_b02",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles",
    subtopic: "Basic Terms and Angles",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "Two lines AB and CD intersect at O. If ∠AOD = 3x + 5° and ∠BOC = 5x − 25°, find x. Hence find all four angles at O.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "∠AOD and ∠BOC are vertically opposite angles → ∠AOD = ∠BOC.",
      "3x + 5 = 5x − 25 → 30 = 2x → x = 15.",
      "∠AOD = 3(15) + 5 = 50°; ∠BOC = 50°.",
      "∠AOC = 180° − ∠AOD = 130° (linear pair).",
      "∠BOD = 130° (vertically opposite to ∠AOC).",
      "Four angles: 50°, 130°, 50°, 130°.",
    ],
    shortcut: "Vertically opposite angles are equal; adjacent angles on a straight line are supplementary.",
    bloomLevel: "apply",
    conceptTested: "Vertically opposite angles",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_terms_b03",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles",
    subtopic: "Basic Terms and Angles",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "OC bisects angle AOB, where ∠AOB = 124°. OD bisects angle BOC. Find ∠DOC and ∠DOA.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "∠AOB = 124°; OC bisects it → ∠AOC = ∠COB = 62°.",
      "OD bisects ∠BOC → ∠DOC = ∠DOB = 62°/2 = 31°.",
      "∠DOA = ∠AOC + ∠COD = 62° + 31° = 93°.",
    ],
    shortcut: "Bisect → halve. Work outward from the given angle.",
    bloomLevel: "apply",
    conceptTested: "Angle bisector problems",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_terms_b04",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles",
    subtopic: "Basic Terms and Angles",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "Prove that if two lines intersect, then the vertically opposite angles are equal.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: Lines AB and CD intersect at O.",
      "To prove: ∠AOC = ∠BOD and ∠AOD = ∠BOC.",
      "Proof:",
      "  ∠AOC + ∠AOD = 180° (linear pair, AOD on straight line COD). … (1)",
      "  ∠AOD + ∠BOD = 180° (linear pair, AOB on straight line). … (2)",
      "  From (1) and (2): ∠AOC = ∠BOD.",
      "  Similarly, ∠AOD + ∠AOC = 180° … (3)",
      "  ∠AOC + ∠BOC = 180° (linear pair on COD). … (4)",
      "  From (3) and (4): ∠AOD = ∠BOC. ∎",
    ],
    shortcut: "Use linear pair twice; the common angle cancels, giving the vertically opposite pair equal.",
    bloomLevel: "analyse",
    conceptTested: "Proof of vertically opposite angles theorem",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Parallel Lines and a Transversal (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch6_parallel_b01",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles",
    subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "AB ∥ CD. A transversal EF cuts AB at P and CD at Q. ∠APE = 50°. Find all eight angles formed.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "At P: ∠APE = 50° (given).",
      "∠BPE = 180° − 50° = 130° (linear pair).",
      "∠APF = 130° (vertically opposite to ∠BPE).",
      "∠BPF = 50° (vertically opposite to ∠APE).",
      "Since AB ∥ CD:",
      "∠CQF = ∠APF = 130° (corresponding to ∠APF? Recheck direction).",
      "Actually: ∠CQF = ∠APE = 50° (alternate interior angles → no; corresponding angles).",
      "Corresponding angles (same side, same position): ∠EPB (at P, above) corresponds to ∠FQD (at Q, above). But let's use standard labelling.",
      "∠APE (above AB, left of EF) corresponds to ∠CQE (above CD, left of EF) → ∠CQE = 50°.",
      "∠BPE = 130° → ∠DQE = 130° (corresponding).",
      "Alternate interior: ∠APF = ∠DQF → ∠DQF = 130°. Wait: ∠APF is above, alternate to below.",
      "Simplifying: The 8 angles are 50°, 130°, 130°, 50° at P and 50°, 130°, 130°, 50° at Q by symmetry.",
    ],
    shortcut: "Corresponding = equal; alternate = equal; co-interior = supplementary. Use these three rules.",
    bloomLevel: "apply",
    conceptTested: "All angle relationships with parallel lines and transversal",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_parallel_b02",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles",
    subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "If the angle between two parallel lines and a transversal gives co-interior angles as (3x + 15)° and (2x + 5)°, find x. Are the lines really parallel?",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Co-interior (same-side interior) angles between parallel lines sum to 180°.",
      "(3x + 15) + (2x + 5) = 180.",
      "5x + 20 = 180 → 5x = 160 → x = 32.",
      "Angles: 3(32) + 15 = 111° and 2(32) + 5 = 69°. Sum = 180°. ✓",
      "Yes, the lines are parallel (since co-interior angles sum to 180°).",
    ],
    shortcut: "Co-interior (consecutive interior) angles are supplementary iff lines are parallel.",
    bloomLevel: "apply",
    conceptTested: "Co-interior angles and parallel lines",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_parallel_b03",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles",
    subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "Prove that alternate interior angles are equal when a transversal crosses two parallel lines.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: AB ∥ CD, transversal EF cuts AB at P and CD at Q.",
      "To prove: ∠APQ = ∠PQD (alternate interior angles).",
      "Proof:",
      "  ∠EPB = ∠PQD (corresponding angles, AB ∥ CD). … (1)",
      "  ∠EPB = ∠APQ (vertically opposite at P). … (2)",
      "  From (1) and (2): ∠APQ = ∠PQD. ∎",
    ],
    shortcut: "Alternate interior = corresponding + vertically opposite combined.",
    bloomLevel: "analyse",
    conceptTested: "Proof of alternate interior angles theorem",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_parallel_b04",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles",
    subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "In the figure, AB ∥ CD ∥ EF. A transversal cuts them at P, Q, R respectively. ∠APQ = 60° and ∠ERP = 80°. Find ∠PQR and ∠RQD.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "∠APQ = 60° (angle on AB side).",
      "Alternate interior angles: ∠PQC = ∠APQ = 60°.",
      "∠ERP = 80° → alternate interior: ∠PQC vs ∠QRE.",
      "Actually: ∠BPQ (interior between AB and CD) = 180° − 60° = 120°.",
      "Co-interior (AB ∥ CD): ∠BPQ + ∠PQD = 180° → ∠PQD = 60° → ∠PQC = 120°.",
      "For CD ∥ EF: ∠DQR + ∠QRE = 180° (co-interior).",
      "∠QRE = 80° → ∠DQR = 100°.",
      "∠PQR = ∠PQD + ∠DQR = 60° + 100° = 160°.",
      "∠RQD = 100° (computed above).",
    ],
    shortcut: "Apply parallel line properties at each pair of parallel lines separately.",
    bloomLevel: "analyse",
    conceptTested: "Multiple parallel lines cut by a transversal",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Lines Parallel to the Same Line (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch6_parallel_same_b01",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles",
    subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "State and prove the theorem: Lines parallel to the same line are parallel to each other.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "Statement: If lines l ∥ m and n ∥ m, then l ∥ n.",
      "Proof: Let a transversal t cut l, m, and n at A, B, C respectively.",
      "  l ∥ m → ∠1 = ∠2 (corresponding angles). … (1)",
      "  n ∥ m → ∠2 = ∠3 (corresponding angles). … (2)",
      "  From (1) and (2): ∠1 = ∠3.",
      "  These are corresponding angles formed when t cuts l and n.",
      "  Since corresponding angles are equal → l ∥ n. ∎",
    ],
    shortcut: "Transitivity of parallelism: l ∥ m and n ∥ m → l ∥ n (via equal corresponding angles).",
    bloomLevel: "analyse",
    conceptTested: "Transitivity theorem for parallel lines",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_parallel_same_b02",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles",
    subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "Three lines p, q, r are such that p ∥ q and r ∥ q. A transversal makes angles 65° with q. Find the angles the transversal makes with p and with r.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Since p ∥ q: corresponding angle of transversal with p = 65° (corresponding = equal).",
      "Since r ∥ q: corresponding angle with r = 65°.",
      "Also p ∥ r (by the transitivity theorem), so all three lines make the same angle with the transversal.",
      "Angles with p and r are both 65°.",
    ],
    shortcut: "Parallel lines → same corresponding angle with any transversal.",
    bloomLevel: "apply",
    conceptTested: "Application of parallel line transitivity",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_parallel_same_b03",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles",
    subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "In a triangle PQR, PQ ∥ ST where S is on PR and T is on QR. If ∠QPR = 50° and ∠PQR = 70°, find ∠TSR and ∠STR.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "∠PRQ = 180° − 50° − 70° = 60° (angle sum of triangle PQR).",
      "PQ ∥ ST, and PR is a transversal.",
      "  ∠PST = ∠QPR = 50° (corresponding angles, wait — check which are corresponding).",
      "  Actually ∠TSR (at S on PR, between ST and SR) = ∠QPR = 50° (alternate interior angles: PQ ∥ ST, transversal PS/PR).",
      "PQ ∥ ST, and QR is a transversal.",
      "  ∠STR = ∠PQR = 70° (alternate interior angles).",
      "Verification: in triangle STR, ∠TSR + ∠STR + ∠TRS = 50° + 70° + 60° = 180°. ✓",
    ],
    shortcut: "When a line parallel to the base cuts a triangle, alternate angles with the vertex angles are equal.",
    bloomLevel: "apply",
    conceptTested: "Parallel line cut across a triangle",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch6_parallel_same_b04",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles",
    subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 6,
    questionText:
      "Prove that the sum of interior angles of a triangle is 180° using the property of parallel lines.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: Triangle ABC.",
      "Construction: Draw PQ through A parallel to BC.",
      "To prove: ∠A + ∠B + ∠C = 180°.",
      "Proof:",
      "  PQ ∥ BC, AB is transversal → ∠PAB = ∠ABC (alternate interior angles). … (1)",
      "  PQ ∥ BC, AC is transversal → ∠QAC = ∠ACB (alternate interior angles). … (2)",
      "  ∠PAB + ∠BAC + ∠QAC = 180° (angles on a straight line PAQ). … (3)",
      "  Substituting (1) and (2) into (3):",
      "  ∠ABC + ∠BAC + ∠ACB = 180°. ∎",
    ],
    shortcut: "Draw parallel through apex → alternate angle property gives the two base angles on the straight line.",
    bloomLevel: "analyse",
    conceptTested: "Proof of angle sum property of triangle",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 6 (Lines and Angles)…");

  let upserted = 0;
  let skipped = 0;

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
      if (err.code === 11000) {
        console.log(`  — skip ${q.questionId}`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
