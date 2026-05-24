/**
 * AP SSC Class 9 Mathematics — Chapter 6: Lines and Angles
 * 3 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch06.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     6-A  Basic Terms and Types of Angles
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Basic Terms and Types of Angles",
    prerequisite_knowledge: [
      "Concept of a point, line, line segment, ray",
      "Measuring angles with a protractor",
      "Basic angle types from primary school: acute, right, obtuse",
      "Adjacent angles and their properties"
    ],
    key_formulas: [
      "Acute angle: 0° < θ < 90°",
      "Right angle: θ = 90°",
      "Obtuse angle: 90° < θ < 180°",
      "Straight angle: θ = 180°",
      "Reflex angle: 180° < θ < 360°",
      "Complementary angles: two angles summing to 90°",
      "Supplementary angles: two angles summing to 180°",
      "Vertically opposite angles: equal (formed when two lines intersect)",
      "Linear pair: adjacent angles on a straight line; sum = 180°"
    ],
    teaching_content: {
      intuition: "An angle measures how much one ray has been rotated from another about a common point. Two intersecting lines create four angles at the intersection point. The opposite angles (across the vertex) are always equal — these are vertically opposite angles. Adjacent angles on a straight line are supplementary (add to 180°). These two basic results — vertically opposite = equal, linear pair = 180° — are used in virtually every geometry proof.",
      derivation: "Proof: Vertically opposite angles are equal.\n\nLet lines AB and CD intersect at point O. This creates four angles: ∠AOC, ∠COB, ∠BOD, ∠DOA.\n\n∠AOC + ∠COB = 180° (linear pair on line AB) … (1)\n∠COB + ∠BOD = 180° (linear pair on line CD) … (2)\n\nSubtracting (2) from (1):\n∠AOC − ∠BOD = 0\n∴ ∠AOC = ∠BOD\n\nSimilarly, ∠COB = ∠DOA.\n\nVertically opposite angles are equal. □",
      worked_example: "Two lines intersect. One angle formed is 65°. Find all four angles.\n\nLet the angles be ∠1 = 65°.\n∠2 = 180° − 65° = 115° (linear pair with ∠1)\n∠3 = 65° (vertically opposite to ∠1)\n∠4 = 115° (vertically opposite to ∠2)\n\nCheck: ∠1 + ∠2 + ∠3 + ∠4 = 65+115+65+115 = 360° ✓ (angles around a point)\n\nIf ∠AOB = (2x+30)° and ∠COD = (3x−10)° are vertically opposite:\n2x+30 = 3x−10 → x = 40 → ∠AOB = 110°",
      visual_description: "Draw two straight lines intersecting at point O. Label the four angles 1, 2, 3, 4 going clockwise. Mark angles 1 and 3 (opposite) with the same arc (equal). Mark angles 2 and 4 (opposite) with the same double arc (equal). Show with arrows that angles 1+2 form a linear pair (lie on a straight line AB).",
      svg_diagrams: [
        {
          title: "Two intersecting lines forming vertically opposite and linear pair angles",
          svg_code: "<svg viewBox='0 0 280 200' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='100' x2='260' y2='100' stroke='#1565C0' stroke-width='2'/><line x1='140' y1='20' x2='140' y2='180' stroke='#E91E63' stroke-width='2'/><circle cx='140' cy='100' r='3' fill='#333'/><text x='165' y='85' font-size='13' fill='#4CAF50' font-weight='bold'>∠1</text><text x='105' y='85' font-size='13' fill='#FF9800' font-weight='bold'>∠2</text><text x='105' y='122' font-size='13' fill='#4CAF50' font-weight='bold'>∠3</text><text x='165' y='122' font-size='13' fill='#FF9800' font-weight='bold'>∠4</text><text x='10' y='96' font-size='11' fill='#1565C0'>A</text><text x='252' y='96' font-size='11' fill='#1565C0'>B</text><text x='135' y='16' font-size='11' fill='#E91E63'>C</text><text x='135' y='190' font-size='11' fill='#E91E63'>D</text><text x='155' y='160' font-size='10' fill='#333'>∠1=∠3 (vert. opp.)</text><text x='155' y='174' font-size='10' fill='#333'>∠2=∠4 (vert. opp.)</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking supplementary angles must be adjacent — supplementary only means their sum is 180°; they can be anywhere.",
        "Confusing complementary (90°) with supplementary (180°) — mnemonic: Complementary → Corner (right angle = 90°). Supplementary → Straight line (180°).",
        "Assuming vertically opposite angles are adjacent — vertically opposite angles are across the intersection, NOT next to each other.",
        "Writing linear pair sum = 90° — linear pair angles lie on a straight line, so they sum to 180°, not 90°."
      ],
      shortcuts_and_tricks: [
        "Memory: 'C' in Complementary = Corner (right angle, 90°). 'S' in Supplementary = Straight line (180°).",
        "Vertically opposite angles: just cross-multiply the labels. If you know one angle, immediately write the opposite one equal to it.",
        "Four angles at an intersection: find two (one pair or a linear pair), then the other two are determined. Don't solve all four independently.",
        "Angles around a point sum to 360°. Use this to check: all four angles at an intersection should sum to 360°."
      ],
      when_to_use_this_method: "Apply vertically opposite angles whenever two straight lines cross. Apply linear pair whenever angles sit on one side of a straight line. These two properties are the first tools in any geometry proof involving intersecting lines.",
      edge_cases: [
        "If two lines are perpendicular, all four vertically-opposite pairs are both equal AND right angles (90° each).",
        "A straight angle (180°) can be seen as a linear pair where one angle is 0° — but 0° angles have no physical meaning in this context.",
        "Reflex angles (>180°) are rarely tested in Class 9 proofs but appear in circle geometry (major arc angle).",
        "When three or more lines pass through a single point, the angles around the point still sum to 360°."
      ],
      key_takeaway: "Two intersecting lines make two pairs of vertically opposite angles (equal) and two pairs of linear angles (summing to 180°). These two facts — plus angle sum rules — drive most of Class 9 geometry. Memorise: linear pair = 180°, vertically opposite = equal.",
      video_script_hooks: [
        "Opening: 'Two straight lines cross. Four angles appear. Without measuring a single one, can you find all four if you know just one? Yes — and you will do it in your head by the end of this topic.'",
        "Mid-lesson: 'Vertically opposite: one angle is 65°. Its neighbour on the line is 115° (linear pair). The one across is 65° (same as the first). The last is 115°. Four angles from one measurement.'",
        "Closing: 'Linear pair: 180°. Vertically opposite: equal. Two facts. Everything else in this chapter is built on them.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     6-B  Parallel Lines and a Transversal
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Parallel Lines and a Transversal",
    prerequisite_knowledge: [
      "Parallel lines: lines that never intersect",
      "Transversal: a line cutting two or more lines",
      "Types of angles: alternate, co-interior, corresponding",
      "Linear pair and vertically opposite angles"
    ],
    key_formulas: [
      "Corresponding angles (parallel lines): ∠1 = ∠5, ∠2 = ∠6, ∠3 = ∠7, ∠4 = ∠8  (F-shape)",
      "Alternate interior angles (parallel lines): ∠3 = ∠6, ∠4 = ∠5  (Z-shape)",
      "Alternate exterior angles (parallel lines): ∠1 = ∠8, ∠2 = ∠7",
      "Co-interior (same-side interior) angles: ∠3 + ∠5 = 180°, ∠4 + ∠6 = 180°  (C-shape)",
      "Converse: if corresponding angles are equal → lines are parallel",
      "Converse: if alternate interior angles are equal → lines are parallel",
      "Converse: if co-interior angles are supplementary → lines are parallel"
    ],
    teaching_content: {
      intuition: "Imagine train tracks (two parallel lines) crossed by a road (transversal). The road makes angles with each track. Because the tracks are parallel and identical in direction, the angles the road makes with each track are the same. Corresponding angles are like mirror images (F-shape): same position at each intersection. Alternate angles are on opposite sides of the transversal (Z-shape). Co-interior angles are on the same side and add up to 180° (C-shape). All these properties vanish the moment the lines stop being parallel.",
      derivation: "Proof: Alternate interior angles are equal when lines are parallel.\n\nLet AB ∥ CD, transversal PQ crossing AB at E and CD at F.\nAlternate interior angles: ∠AEF and ∠EFD.\n\n∠AEF = ∠GEB (vertically opposite) … (1)\n∠GEB = ∠EFD (corresponding angles, AB ∥ CD) … (2)\n\nFrom (1) and (2): ∠AEF = ∠EFD. □\n\nAlternatively, using Euclid's Postulate 5 directly: if alternate angles were unequal, the transversal would cause the lines to meet — contradicting them being parallel.",
      worked_example: "Two parallel lines are cut by a transversal. One interior angle is 110°. Find all eight angles.\n\nAt intersection 1:\n  ∠1 = 70° (supplement of 110°, linear pair)\n  ∠2 = 110° (given)\n  ∠3 = 110° (vertically opposite to ∠2)\n  ∠4 = 70° (vertically opposite to ∠1)\n\nAt intersection 2 (corresponding angles):\n  ∠5 = ∠1 = 70°\n  ∠6 = ∠2 = 110°\n  ∠7 = ∠3 = 110°\n  ∠8 = ∠4 = 70°\n\nCheck alternates: ∠3 = ∠6 = 110° ✓. Co-interior: ∠3 + ∠5 = 110°+70° = 180° ✓.",
      visual_description: "Draw two horizontal parallel lines l₁ and l₂ with a diagonal transversal crossing both. Label the eight angles 1-8 at the two intersection points (1-4 at top intersection, 5-8 at bottom). Use coloured arcs to show: corresponding pairs (same colour, F-pattern), alternate interior pairs (striped arc, Z-pattern), co-interior pairs (double arc, C-pattern).",
      svg_diagrams: [
        {
          title: "Parallel lines with transversal: 8 angles, F/Z/C angle relationships",
          svg_code: "<svg viewBox='0 0 280 220' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='70' x2='260' y2='70' stroke='#1565C0' stroke-width='2'/><text x='8' y='68' font-size='10' fill='#1565C0'>l₁</text><line x1='20' y1='150' x2='260' y2='150' stroke='#1565C0' stroke-width='2'/><text x='8' y='148' font-size='10' fill='#1565C0'>l₂</text><line x1='80' y1='15' x2='200' y2='210' stroke='#E91E63' stroke-width='2'/><circle cx='120' cy='70' r='3' fill='#333'/><circle cx='160' cy='150' r='3' fill='#333'/><text x='128' y='60' font-size='10' fill='#4CAF50'>∠1</text><text x='100' y='62' font-size='10' fill='#FF9800'>∠2</text><text x='100' y='82' font-size='10' fill='#FF9800'>∠3</text><text x='128' y='82' font-size='10' fill='#4CAF50'>∠4</text><text x='168' y='142' font-size='10' fill='#4CAF50'>∠5</text><text x='140' y='142' font-size='10' fill='#FF9800'>∠6</text><text x='140' y='160' font-size='10' fill='#FF9800'>∠7</text><text x='168' y='160' font-size='10' fill='#4CAF50'>∠8</text><text x='10' y='200' font-size='9' fill='#4CAF50'>Corr: ∠1=∠5, ∠2=∠6</text><text x='10' y='212' font-size='9' fill='#FF9800'>Alt int: ∠3=∠6, ∠4=∠5</text></svg>"
        }
      ],
      common_misconceptions: [
        "Confusing corresponding angles (F-shape, equal) with co-interior angles (C-shape, supplementary) — the shapes of F and C help: F=equal, C=add to 180°.",
        "Applying angle rules to non-parallel lines — all these rules ONLY hold when the lines are parallel. If the lines are not parallel, corresponding angles are not equal.",
        "Thinking alternate angles are always interior — there are also alternate EXTERIOR angles (outside both parallel lines), which are also equal.",
        "Labelling angles incorrectly: alternate interior angles are between the two parallel lines, on opposite sides of the transversal."
      ],
      shortcuts_and_tricks: [
        "F-shape → Corresponding → Equal. Z-shape → Alternate interior → Equal. C-shape → Co-interior → Supplementary. Draw the letter in the figure to identify the type.",
        "If you know any one of the eight angles, you know all eight: find its supplement (linear pair) and use corresponding/alternate rules.",
        "Converse test for parallel lines: measure one pair of alternate interior angles. If equal, lines are parallel. Fastest proof without a protractor.",
        "Co-interior = 'C' = also called 'consecutive interior' or 'same-side interior' angles — all three names refer to the same pair."
      ],
      when_to_use_this_method: "Use transversal angle rules whenever a diagram contains two parallel lines cut by another line. These rules appear in triangle angle proofs, quadrilateral proofs, and circle geometry. Always check if lines are stated parallel before applying.",
      edge_cases: [
        "If the transversal is perpendicular to the parallel lines, all eight angles are right angles (90°) — alternate, corresponding, and co-interior angles are all trivially equal or supplementary.",
        "Non-parallel lines cut by a transversal: corresponding angles are unequal; their difference reveals how much the lines deviate from parallel.",
        "Multiple transversals: each transversal creates its own set of eight angles with the two parallel lines; the angle sets are independent.",
        "If the transversal is parallel to one of the other lines, it creates a different geometric configuration entirely."
      ],
      key_takeaway: "When a transversal cuts two parallel lines: corresponding angles are equal (F), alternate interior angles are equal (Z), co-interior angles are supplementary/180° (C). The converses all hold — use them to prove lines are parallel. F=equal, C=180°, Z=equal.",
      video_script_hooks: [
        "Opening: 'Two parallel train tracks, one crossing road. The road makes angles with each track. Because the tracks point the same way, the road makes the same angles with both. That symmetry is the entire chapter.'",
        "Mid-lesson: 'F for Corresponding — equal. Z for Alternate — equal. C for Co-interior — add to 180°. Draw the letter in your diagram. The letter tells you the rule.'",
        "Closing: 'Corresponding equal means parallel. Alternate equal means parallel. Co-interior supplementary means parallel. The rules work in reverse too — that is what makes them powerful for proofs.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     6-C  Lines Parallel to the Same Line
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Lines Parallel to the Same Line and Angle Sum in Triangles",
    prerequisite_knowledge: [
      "Parallel lines and transversal angle properties",
      "Euclid's parallel postulate (Playfair's Axiom)",
      "Vertically opposite and linear pair angles",
      "Concept of a triangle and its interior angles"
    ],
    key_formulas: [
      "Theorem: If two lines are parallel to the same line, they are parallel to each other",
      "Theorem: The sum of the three interior angles of a triangle = 180°",
      "Exterior angle of a triangle = sum of the two non-adjacent interior angles",
      "If l ∥ m and m ∥ n, then l ∥ n  (transitivity of parallel lines)"
    ],
    teaching_content: {
      intuition: "If road A is parallel to road B, and road B is parallel to road C, must A be parallel to C? Intuitively yes — if A and C both run the same direction as B, they run the same direction as each other. This is transitivity of parallel lines, and it follows directly from Euclid's Postulate 5. The triangle angle sum (180°) is one of the most beautiful consequences — proved using a single parallel line drawn through one vertex.",
      derivation: "Proof: Angle sum of a triangle = 180°.\n\nGiven triangle ABC. Draw line PQ through vertex A parallel to BC.\n\n∠PAB = ∠ABC (alternate interior angles, PQ ∥ BC, transversal AB) … (1)\n∠QAC = ∠ACB (alternate interior angles, PQ ∥ BC, transversal AC) … (2)\n\nAngles on a straight line at A:\n∠PAB + ∠BAC + ∠QAC = 180° (linear pair / straight line PAQ)\n\nSubstituting from (1) and (2):\n∠ABC + ∠BAC + ∠ACB = 180°\n\nTherefore, the sum of all three interior angles of a triangle is 180°. □",
      worked_example: "Applications of angle sum of triangle:\n\n(i) In △ABC, ∠A = 60°, ∠B = 70°. Find ∠C.\n    ∠C = 180° − 60° − 70° = 50°\n\n(ii) In △PQR, ∠P = ∠Q = ∠R (equilateral).\n    3∠P = 180° → ∠P = 60°. All angles 60°.\n\n(iii) Exterior angle theorem:\n    In △ABC, side BC is extended to D. Prove ∠ACD = ∠A + ∠B.\n    ∠ACD + ∠ACB = 180° (linear pair)\n    ∠A + ∠B + ∠ACB = 180° (angle sum of triangle)\n    ∴ ∠ACD = ∠A + ∠B ✓\n\n(iv) Transitivity: l ∥ m and m ∥ n.\n    Through any point P, by Playfair's Axiom there is only one line parallel to n.\n    Since l ∥ m ∥ n, l must be parallel to n.",
      visual_description: "Draw triangle ABC. Through A, draw a dashed horizontal line parallel to BC. Mark angles: ∠1 (between AB and the parallel line, left side) = ∠B (alternate interior). ∠3 (between AC and the parallel line, right side) = ∠C (alternate interior). ∠2 = ∠A. Show ∠1+∠2+∠3 = 180° (straight line). Conclude ∠A+∠B+∠C = 180°.",
      svg_diagrams: [
        {
          title: "Proof of triangle angle sum using parallel line through vertex A",
          svg_code: "<svg viewBox='0 0 300 180' xmlns='http://www.w3.org/2000/svg'><polygon points='150,20 50,150 250,150' fill='none' stroke='#1565C0' stroke-width='2'/><line x1='20' y1='20' x2='280' y2='20' stroke='#4CAF50' stroke-width='2' stroke-dasharray='6,3'/><text x='225' y='15' font-size='10' fill='#4CAF50'>PQ ∥ BC</text><text x='143' y='18' font-size='11' fill='#333'>A</text><text x='38' y='162' font-size='11' fill='#333'>B</text><text x='248' y='162' font-size='11' fill='#333'>C</text><text x='100' y='28' font-size='10' fill='#E91E63'>∠1=∠B</text><text x='178' y='28' font-size='10' fill='#E91E63'>∠3=∠C</text><text x='140' y='38' font-size='10' fill='#FF9800'>∠2=∠A</text><text x='20' y='170' font-size='10' fill='#555'>∠1+∠2+∠3=180° ⟹ ∠A+∠B+∠C=180°</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking angle sum applies only to right triangles — it applies to ALL triangles: acute, obtuse, right, equilateral, isosceles.",
        "Applying exterior angle theorem to an interior angle — the exterior angle is formed by EXTENDING a side, not by measuring inside the triangle.",
        "Assuming the angle sum is 180° in non-Euclidean geometry — on a sphere, the angle sum of a triangle is GREATER than 180°.",
        "Transitivity of parallels: students sometimes think l ∥ m and n ∥ m means l ∥ n always — this is true, but students need to justify it using Playfair's Axiom, not just state it."
      ],
      shortcuts_and_tricks: [
        "Third angle of triangle: just subtract the two known angles from 180°. Never forget: ∠C = 180° − ∠A − ∠B.",
        "Exterior angle shortcut: exterior angle = sum of the other two interior angles. No need to find all three angles first.",
        "Isosceles triangle: two equal angles. If base angles are x each, vertex angle = 180° − 2x.",
        "Equilateral triangle: all angles = 60°. If one angle equals 60° and the triangle is equilateral, all sides are equal — auto-conclude."
      ],
      when_to_use_this_method: "Use the triangle angle sum in every triangle problem to find missing angles. Use the exterior angle theorem as a faster route when an exterior angle is involved. Apply transitivity of parallels when multiple parallel lines are mentioned.",
      edge_cases: [
        "A degenerate triangle (three collinear points) has one angle = 180° and the other two = 0°. Sum still = 180° but no real triangle exists.",
        "An obtuse triangle has one angle > 90° — the other two must both be acute (their sum = 180° − obtuse < 90°).",
        "Exterior angle theorem: each vertex has an exterior angle. The triangle has three exterior angles (one at each vertex) — each equals the sum of the two remote interior angles.",
        "The sum of all three exterior angles of a triangle (one at each vertex, all going the same rotational direction) = 360°."
      ],
      key_takeaway: "Lines parallel to the same line are parallel to each other (transitivity). Triangle angle sum = 180° — proved using a parallel line through one vertex. Exterior angle of a triangle = sum of the two non-adjacent interior angles. These three results underpin almost all of Class 9 and 10 geometry.",
      video_script_hooks: [
        "Opening: 'Three angles of a triangle. Different triangles, different shapes, different sizes. But the angles always add to exactly 180°. Every single time. How is that possible? Because of one cleverly placed parallel line.'",
        "Mid-lesson: 'Draw a line through the top vertex, parallel to the base. The left angle equals the bottom-left angle (alternate). The right equals bottom-right. The middle is the top angle. Three angles, straight line: 180°.'",
        "Closing: 'Exterior angle = sum of the two opposite interior angles. That shortcut eliminates a step in almost every triangle problem. Memorise it.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 6: Lines and Angles…");
  let upserted = 0, skipped = 0;
  for (const t of TOPICS) {
    try {
      await NcertTopicContent.findOneAndUpdate(
        { topicId: t.topicId },
        { $set: t },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${t.topicId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  ↩ ${t.topicId} (already exists, skipped)`);
        skipped++;
      } else {
        throw err;
      }
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}  Total: ${TOPICS.length}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
