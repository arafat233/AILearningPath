import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Euclid's Definitions, Axioms, Postulates (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch5_euclid_b01",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "State any five of Euclid's postulates. Which postulate has given rise to non-Euclidean geometries and how?",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "Postulate 1: A straight line may be drawn from any one point to any other point.",
      "Postulate 2: A terminated line can be produced indefinitely.",
      "Postulate 3: A circle can be drawn with any centre and any radius.",
      "Postulate 4: All right angles are equal to one another.",
      "Postulate 5 (Parallel Postulate): If a straight line falling on two straight lines makes the interior angles on the same side less than two right angles, the two lines, if produced indefinitely, meet on that side.",
      "The 5th postulate is the controversial one. Mathematicians could not prove it from the other four.",
      "By assuming its negation (zero or more than one parallel through an external point), two non-Euclidean geometries arise: Spherical (Riemannian) and Hyperbolic (Lobachevsky–Bolyai) geometry.",
    ],
    shortcut: "The 5th postulate (parallel postulate) is the key one — it is not provable from the first four.",
    bloomLevel: "understand",
    conceptTested: "Euclid's postulates and non-Euclidean geometry",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch5_euclid_b02",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "Distinguish between an axiom and a postulate, giving an example of each from Euclid's Elements.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "Axiom: A general self-evident truth applicable to all branches of mathematics (not restricted to geometry).",
      "Example: 'Things which are equal to the same thing are also equal to one another' (Euclid's Axiom 1).",
      "Postulate: A self-evident truth specific to geometry.",
      "Example: 'A straight line may be drawn from any one point to any other point' (Postulate 1).",
      "In modern mathematics, the distinction is blurred — both are called axioms.",
    ],
    shortcut: "Axiom = universal truth; Postulate = geometric truth. Both are accepted without proof.",
    bloomLevel: "understand",
    conceptTested: "Axiom vs. postulate distinction",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch5_euclid_b03",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "Using Euclid's axioms, prove that an equilateral triangle can be constructed on a given line segment. Describe the steps.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given line segment AB.",
      "Step 1: Draw a circle with centre A and radius AB (Postulate 3).",
      "Step 2: Draw a circle with centre B and radius BA (Postulate 3).",
      "Step 3: Let C be a point where the two circles intersect (two such points exist).",
      "Step 4: Join CA and CB (Postulate 1).",
      "Step 5: AB = AC (radii of circle centred at A). AB = BC (radii of circle centred at B).",
      "       By Axiom 1: things equal to the same are equal → AC = BC = AB.",
      "Step 6: Therefore triangle ABC is equilateral. ∎",
    ],
    shortcut: "Use two circles of same radius as adjacent sides; intersection gives the apex.",
    bloomLevel: "apply",
    conceptTested: "Euclidean construction of equilateral triangle",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch5_euclid_b04",
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Euclid's Definitions, Axioms and Postulates",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "If C is the midpoint of AB and D is the midpoint of AC, show that AD = (1/4) AB. State the Euclid axioms used.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "C is midpoint of AB → AC = CB = AB/2.",
      "D is midpoint of AC → AD = DC = AC/2 = (AB/2)/2 = AB/4.",
      "Therefore AD = AB/4. ✓",
      "Axioms used:",
      "  Axiom 7: Things which are halves of the same things are equal to one another.",
      "  Axiom 6: Things which are double of the same things are equal to one another.",
    ],
    shortcut: "Midpoint halves; apply halving twice to get (1/4).",
    bloomLevel: "analyse",
    conceptTested: "Application of Euclid's axioms to segment relationships",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Equivalent Versions of Fifth Postulate (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch5_fifth_b01",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Equivalent Versions of the Fifth Postulate",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "State Playfair's Axiom. Prove that it is equivalent to Euclid's fifth postulate (assume the equivalence directions are separately justifiable; state both directions clearly).",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Playfair's Axiom: For every line l and for every point P not on l, there exists a unique line through P parallel to l.",
      "Direction 1 (Euclid's 5th → Playfair):",
      "  Euclid's 5th says: if the two interior angles on one side sum to < 180°, the lines meet on that side.",
      "  If both pairs of interior angles sum to exactly 180°, the lines never meet → parallel lines exist.",
      "  Uniqueness follows: if two parallels through P existed, one would make interior angles ≠ 180° and must meet — contradiction.",
      "Direction 2 (Playfair → Euclid's 5th):",
      "  If interior angles sum to < 180° on one side, assume the lines do NOT meet on that side.",
      "  Then they meet on the other side or are parallel.",
      "  If parallel, by Playfair uniqueness, no other parallel exists; but a line making angles summing to 180° is also parallel — contradiction.",
      "  Therefore the lines must meet on the side where the angles sum to < 180°. ∎",
    ],
    shortcut: "Playfair's axiom: 'through external point, exactly one parallel' — the unique-parallel version of the 5th postulate.",
    bloomLevel: "evaluate",
    conceptTested: "Equivalence of Playfair's axiom and Euclid's fifth postulate",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch5_fifth_b02",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Equivalent Versions of the Fifth Postulate",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "Lines PQ and RS are cut by a transversal at T and U respectively. If ∠PTU = 70° and ∠RUT = 110°, use Euclid's fifth postulate to determine whether PQ and RS are parallel.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "The two interior angles on the same side of the transversal are ∠PTU and ∠TUR (co-interior angles).",
      "But we are given ∠PTU = 70° (which is interior on side of RS) and ∠RUT = 110° (interior on side of PQ).",
      "Sum of interior angles on the same side = 70° + 110° = 180°.",
      "By Euclid's fifth postulate: if the sum equals exactly 180°, the lines will never meet → they are parallel.",
      "Therefore PQ ∥ RS.",
    ],
    shortcut: "Sum of co-interior angles = 180° ⟺ lines are parallel.",
    bloomLevel: "apply",
    conceptTested: "Applying Euclid's fifth postulate to parallel lines",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch5_fifth_b03",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Equivalent Versions of the Fifth Postulate",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "What are the main differences between Euclidean and non-Euclidean geometries? Give one real-world example where each applies.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Euclidean geometry: flat surface; exactly one parallel through external point; sum of angles in a triangle = 180°.",
      "  Real-world: floor plans, construction, everyday engineering on flat surfaces.",
      "Spherical (Riemannian) geometry: curved surface (sphere); no parallel lines (all great circles meet); sum of triangle angles > 180°.",
      "  Real-world: navigation on Earth's surface (GPS, flight paths).",
      "Hyperbolic geometry: saddle-shaped surface; infinitely many parallels through external point; sum of triangle angles < 180°.",
      "  Real-world: models in physics (special relativity spacetime, coral reef shapes).",
    ],
    shortcut: "Flat → Euclidean; sphere → Riemannian; saddle → Hyperbolic.",
    bloomLevel: "understand",
    conceptTested: "Euclidean vs. non-Euclidean geometries",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch5_fifth_b04",
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    topic: "Introduction to Euclid's Geometry",
    subtopic: "Equivalent Versions of the Fifth Postulate",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 5,
    questionText:
      "Why was Euclid's fifth postulate considered unsatisfactory by later mathematicians? What attempts were made to resolve this and what was the outcome?",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "The fifth postulate is more complex and less 'self-evident' than the first four.",
      "Mathematicians felt it should be provable from the other postulates (i.e., it is a theorem, not an axiom).",
      "Over 2000 years, many tried to prove it using the other four postulates — all failed.",
      "In the 19th century, Bolyai, Lobachevsky, and Riemann showed that consistent geometries can be built by replacing the fifth postulate with alternatives.",
      "Outcome: the fifth postulate is independent — it cannot be derived from the other four. Non-Euclidean geometries are logically valid.",
    ],
    shortcut: "2000 years of failed proofs → it's genuinely independent → gave birth to non-Euclidean geometry.",
    bloomLevel: "understand",
    conceptTested: "History and significance of the fifth postulate",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 5 (Euclid's Geometry)…");

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
