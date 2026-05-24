import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Chords of a Circle (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch9_chords_b01",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles",
    subtopic: "Chords of a Circle",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "Prove that the perpendicular from the centre of a circle to a chord bisects the chord.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: Circle with centre O. Chord AB. OM ⊥ AB.",
      "To prove: AM = MB.",
      "In △OMA and △OMB:",
      "  OA = OB (radii).",
      "  OM = OM (common).",
      "  ∠OMA = ∠OMB = 90° (OM ⊥ AB).",
      "By RHS: △OMA ≅ △OMB.",
      "By CPCT: AM = MB. ∎",
    ],
    shortcut: "RHS congruence using equal radii and the perpendicular as common side.",
    bloomLevel: "analyse",
    conceptTested: "Perpendicular from centre bisects chord — proof",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_chords_b02",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles",
    subtopic: "Chords of a Circle",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "A chord of a circle is 8 cm long and its distance from the centre is 3 cm. Find the radius of the circle.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "The perpendicular from the centre bisects the chord.",
      "Half-chord = 8/2 = 4 cm. Distance from centre = 3 cm.",
      "By Pythagoras: radius² = 4² + 3² = 16 + 9 = 25.",
      "Radius = 5 cm.",
    ],
    shortcut: "r² = (half-chord)² + (distance)².",
    bloomLevel: "apply",
    conceptTested: "Finding radius using chord-distance relationship",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_chords_b03",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles",
    subtopic: "Chords of a Circle",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "Two chords AB and CD of a circle of radius 10 cm are equidistant from the centre. If AB = 12 cm, find CD.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Theorem: Equal chords of a circle are equidistant from the centre (and vice versa).",
      "AB and CD are equidistant from the centre → AB = CD.",
      "Therefore CD = 12 cm.",
    ],
    shortcut: "Equal distance from centre ⟺ equal chord length.",
    bloomLevel: "apply",
    conceptTested: "Equal chords equidistant from centre",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_chords_b04",
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    topic: "Circles",
    subtopic: "Chords of a Circle",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "In a circle of radius 13 cm, chord PQ is at a distance of 5 cm from the centre. Another chord RS has RS = 2PQ. Find the distance of RS from the centre.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "For chord PQ: half-PQ = √(13² − 5²) = √(169 − 25) = √144 = 12. So PQ = 24 cm.",
      "RS = 2PQ = 48 cm → half-RS = 24 cm.",
      "Distance of RS from centre = √(13² − 24²) = √(169 − 576) — this is negative!",
      "RS = 48 > diameter = 26. A chord cannot be longer than the diameter.",
      "Therefore RS = 2PQ = 48 cm is impossible in a circle of radius 13 cm. The question data is inconsistent.",
      "Note to student: The maximum chord length equals the diameter (2 × 13 = 26 cm).",
    ],
    shortcut: "Always check chord ≤ diameter before computing. If chord > diameter, the chord cannot exist.",
    bloomLevel: "evaluate",
    conceptTested: "Chord-distance relationship — critical thinking",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Angle Subtended by an Arc (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch9_arc_angle_b01",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles",
    subtopic: "Angle Subtended by an Arc at the Centre",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "Prove that the angle subtended by an arc at the centre is double the angle subtended by it at any point on the remaining part of the circle.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 6,
    options: [],
    solutionSteps: [
      "Given: Arc PQ of a circle with centre O. R is any point on the remaining arc.",
      "To prove: ∠POQ = 2∠PRQ.",
      "Construction: Join RO and extend to a point A.",
      "Case 1 (O inside ∠PRQ): In △OPR: OP = OR (radii) → isosceles → ∠ORP = ∠OPR.",
      "Exterior angle ∠POA = ∠ORP + ∠OPR = 2∠ORP. … (1)",
      "Similarly in △OQR: ∠QOA = 2∠ORQ. … (2)",
      "Adding (1) and (2): ∠POA + ∠QOA = 2(∠ORP + ∠ORQ) → ∠POQ = 2∠PRQ. ∎",
      "Case 2 (O outside ∠PRQ): ∠QOA − ∠POA = 2∠ORQ − 2∠ORP → ∠POQ = 2∠PRQ. ∎",
    ],
    shortcut: "Join to centre and extend: exterior angle of isosceles △ = twice inscribed angle half.",
    bloomLevel: "analyse",
    conceptTested: "Inscribed angle theorem — proof",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_arc_angle_b02",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles",
    subtopic: "Angle Subtended by an Arc at the Centre",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "In the given circle with centre O, ∠AOB = 100°. Find ∠ACB where C is on the major arc. Also find the reflex ∠AOB and the angle subtended by major arc at C.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "∠AOB = 100° (central angle for minor arc AB).",
      "∠ACB = (1/2) × reflex ∠AOB (angle in major segment = half the reflex central angle).",
      "Wait: the inscribed angle theorem states: angle at centre = 2 × angle at remaining arc.",
      "C is on the major arc → ∠ACB subtends the minor arc → ∠ACB = ∠AOB / 2 = 50°.",
      "Reflex ∠AOB = 360° − 100° = 260°.",
      "Angle in the minor segment (at point on minor arc) = 260°/2 = 130°.",
    ],
    shortcut: "Inscribed angle = half the central angle subtending the same arc.",
    bloomLevel: "apply",
    conceptTested: "Inscribed angle theorem — numerical",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_arc_angle_b03",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles",
    subtopic: "Angle Subtended by an Arc at the Centre",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "P and Q are points on a circle. R and S are two other points on the same side of PQ. If ∠PRQ = 40°, what is ∠PSQ? State the theorem used.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "R and S are on the same arc (same side of PQ) → they subtend the same arc PQ.",
      "By the theorem: Angles in the same segment of a circle are equal.",
      "Therefore ∠PSQ = ∠PRQ = 40°.",
    ],
    shortcut: "Same arc → same inscribed angle, regardless of the position of the point on that arc.",
    bloomLevel: "understand",
    conceptTested: "Angles in the same segment",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_arc_angle_b04",
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    topic: "Circles",
    subtopic: "Angle Subtended by an Arc at the Centre",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "AB is a diameter of a circle. C is any point on the circle. Prove that ∠ACB = 90°.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Given: AB is a diameter of the circle with centre O. C is on the circle.",
      "To prove: ∠ACB = 90°.",
      "∠AOB (central angle) = 180° (AB is a straight line through O = diameter).",
      "By the inscribed angle theorem: ∠ACB = (1/2) × ∠AOB = (1/2) × 180° = 90°. ∎",
    ],
    shortcut: "Angle in a semicircle = 90° (direct consequence of inscribed angle theorem).",
    bloomLevel: "apply",
    conceptTested: "Angle in a semicircle = 90°",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Cyclic Quadrilaterals (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch9_cyclic_b01",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles",
    subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "Prove that opposite angles of a cyclic quadrilateral are supplementary.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: Cyclic quadrilateral ABCD inscribed in a circle with centre O.",
      "To prove: ∠A + ∠C = 180° and ∠B + ∠D = 180°.",
      "Arc BCD subtends ∠BAD at A and ∠BOD at centre.",
      "∠BAD = (1/2) × ∠BOD. … (1)",
      "Arc BAD subtends ∠BCD at C and reflex ∠BOD at centre.",
      "∠BCD = (1/2) × reflex ∠BOD. … (2)",
      "Adding (1) and (2):",
      "∠BAD + ∠BCD = (1/2)(∠BOD + reflex ∠BOD) = (1/2)(360°) = 180°.",
      "So ∠A + ∠C = 180°.",
      "Similarly ∠B + ∠D = 360° − (∠A + ∠C) = 180°. ∎",
    ],
    shortcut: "Opposite inscribed angles subtend supplementary arcs; half of 360° = 180°.",
    bloomLevel: "analyse",
    conceptTested: "Proof that cyclic quad opposite angles are supplementary",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_b02",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles",
    subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "In cyclic quadrilateral PQRS, ∠P = 95° and ∠Q = 85°. Find ∠R and ∠S.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Opposite angles of cyclic quadrilateral are supplementary.",
      "∠P + ∠R = 180° → ∠R = 180° − 95° = 85°.",
      "∠Q + ∠S = 180° → ∠S = 180° − 85° = 95°.",
    ],
    shortcut: "Each opposite pair sums to 180°.",
    bloomLevel: "apply",
    conceptTested: "Cyclic quadrilateral — finding missing angles",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_b03",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles",
    subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "ABCD is a cyclic quadrilateral. If its diagonals are also diameters of the circle, what kind of quadrilateral is it? Justify.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "If AC is a diameter, then ∠ABC = ∠ADC = 90° (angles in semicircle).",
      "If BD is a diameter, then ∠BAD = ∠BCD = 90°.",
      "All four angles are 90° → ABCD is a rectangle.",
      "Also, since both diagonals are diameters of the same circle, they are equal in length and bisect each other (at the centre).",
      "A quadrilateral with all right angles and equal, bisecting diagonals is a rectangle.",
    ],
    shortcut: "Both diagonals = diameters → all four vertices subtend 90° angles → rectangle.",
    bloomLevel: "analyse",
    conceptTested: "Properties of cyclic quadrilateral with diameter diagonals",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch9_cyclic_b04",
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    topic: "Circles",
    subtopic: "Cyclic Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 9,
    questionText:
      "In cyclic quadrilateral ABCD, side AB is extended to E. Show that ∠CBE = ∠ADC.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "∠CBE is the exterior angle of cyclic quadrilateral ABCD at vertex B.",
      "∠ABC + ∠CBE = 180° (linear pair). … (1)",
      "ABCD is cyclic → ∠ABC + ∠ADC = 180° (opposite angles supplementary). … (2)",
      "From (1) and (2): ∠CBE = ∠ADC. ∎",
    ],
    shortcut: "Exterior angle of cyclic quad = opposite interior angle. Follows directly from supplementary property.",
    bloomLevel: "analyse",
    conceptTested: "Exterior angle of cyclic quadrilateral",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 9 (Circles)…");

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
