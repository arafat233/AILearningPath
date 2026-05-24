/**
 * AP SSC Class 9 Mathematics — Chapter 8: Quadrilaterals
 * 3 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch08.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     8-A  Angle Sum Property of a Quadrilateral
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Angle Sum Property of a Quadrilateral",
    prerequisite_knowledge: [
      "Angle sum of a triangle = 180°",
      "Types of quadrilaterals: square, rectangle, parallelogram, rhombus, trapezium",
      "Concept of a diagonal dividing a polygon",
      "Interior and exterior angles"
    ],
    key_formulas: [
      "Sum of all interior angles of a quadrilateral = 360°",
      "For any polygon with n sides: angle sum = (n−2) × 180°",
      "For n=4: (4−2) × 180° = 360°",
      "Exterior angle sum of any convex polygon = 360°",
      "Each interior angle of a regular n-gon = (n−2)×180°/n"
    ],
    teaching_content: {
      intuition: "A quadrilateral is just two triangles glued along a diagonal. Each triangle contributes 180°, giving 2 × 180° = 360° for the quadrilateral. This works for any quadrilateral — regular or irregular, convex or concave — as long as it doesn't self-intersect. The 360° rule is so universal that it applies to squares (4×90°=360°), rectangles, trapezoids, and any four-sided shape you can draw.",
      derivation: "Proof: Sum of angles of a quadrilateral = 360°.\n\nLet ABCD be a quadrilateral. Draw diagonal AC, dividing it into △ABC and △ACD.\n\nIn △ABC: ∠BAC + ∠ABC + ∠BCA = 180° … (1)\nIn △ACD: ∠DAC + ∠ACD + ∠CDA = 180° … (2)\n\nAdding (1) and (2):\n(∠BAC+∠DAC) + ∠ABC + (∠BCA+∠ACD) + ∠CDA = 360°\n∠DAB + ∠ABC + ∠BCD + ∠CDA = 360° □\n\n(∠BAC+∠DAC = ∠DAB and ∠BCA+∠ACD = ∠BCD, as AC is a diagonal)",
      worked_example: "(i) Three angles of a quadrilateral are 70°, 110°, 85°. Find the fourth.\n    Fourth = 360° − (70°+110°+85°) = 360° − 265° = 95°.\n\n(ii) In a parallelogram PQRS, ∠P = 75°. Find all angles.\n    ∠P + ∠Q = 180° (co-interior, PQ∥RS) → ∠Q = 105°\n    ∠R = ∠P = 75° (opposite angles of parallelogram)\n    ∠S = ∠Q = 105° (opposite angles)\n    Check: 75+105+75+105 = 360° ✓\n\n(iii) Each angle of a regular hexagon:\n    (6−2)×180°/6 = 4×180°/6 = 720°/6 = 120°.",
      visual_description: "Draw quadrilateral ABCD. Draw diagonal AC as a dashed line, dividing the figure into two triangles. Shade one triangle pink, the other blue. Label all four angles of the quadrilateral (∠A, ∠B, ∠C, ∠D) and show how ∠A = ∠BAC + ∠DAC and ∠C = ∠BCA + ∠ACD. Write 180° + 180° = 360° below.",
      svg_diagrams: [
        {
          title: "Quadrilateral split by diagonal into two triangles, each 180°, total 360°",
          svg_code: "<svg viewBox='0 0 280 180' xmlns='http://www.w3.org/2000/svg'><polygon points='50,30 230,50 200,160 30,140' fill='#E3F2FD' stroke='#1565C0' stroke-width='2'/><line x1='50' y1='30' x2='200' y2='160' stroke='#E91E63' stroke-width='2' stroke-dasharray='6,3'/><text x='38' y='25' font-size='11' fill='#1565C0'>A</text><text x='232' y='48' font-size='11' fill='#1565C0'>B</text><text x='200' y='172' font-size='11' fill='#1565C0'>C</text><text x='18' y='148' font-size='11' fill='#1565C0'>D</text><text x='110' y='75' font-size='12' fill='#1565C0' font-weight='bold'>180°</text><text x='95' y='140' font-size='12' fill='#E91E63' font-weight='bold'>180°</text><text x='90' y='170' font-size='11' fill='#333'>Total = 360°</text></svg>"
        }
      ],
      common_misconceptions: [
        "Applying the 360° rule to pentagons or hexagons — each polygon has its own angle sum: pentagon = 540°, hexagon = 720°. Use the formula (n−2)×180°.",
        "Thinking all four angles of a quadrilateral must be less than 180° — in a concave quadrilateral, one interior angle can exceed 180° (reflex angle). The sum is still 360°.",
        "Confusing interior angles with exterior angles — the exterior angle sum of any convex polygon is always 360°, independent of n.",
        "In a parallelogram: opposite angles are equal, NOT all angles equal. Students sometimes write all four angles equal."
      ],
      shortcuts_and_tricks: [
        "Missing angle: 360° minus the sum of the other three. Simple arithmetic, no formula needed.",
        "Polygon angle sum shortcut: draw all diagonals from one vertex. Count the triangles formed = n−2. Multiply by 180°.",
        "Regular polygon: each interior angle = (n−2)×180°/n. For regular hexagon: 120°. For regular octagon: 135°.",
        "Parallelogram shortcut: opposite angles equal, adjacent angles supplementary. Know one angle, know all four."
      ],
      when_to_use_this_method: "Apply the 360° rule whenever one angle of a quadrilateral is unknown and the other three are given. Apply (n−2)×180° for any polygon. Use it as a check after computing all angles of a quadrilateral — they must sum to 360°.",
      edge_cases: [
        "A triangle is a degenerate quadrilateral? No — the formula gives (3−2)×180° = 180° for triangles, consistent.",
        "A quadrilateral where one side collapses (two vertices coincide) degenerates to a triangle — not a proper quadrilateral.",
        "Concave (re-entrant) quadrilateral: one interior angle > 180° (reflex). Sum still = 360°.",
        "Self-intersecting quadrilateral (butterfly shape): the angle sum formula does NOT apply — the shape is not a simple polygon."
      ],
      key_takeaway: "Sum of interior angles of a quadrilateral = 360°, proved by splitting into two triangles. General formula: (n−2)×180° for n-sided polygon. For a parallelogram: opposite angles equal, adjacent angles supplementary (sum 180°). Always verify: all four angles must add to 360°.",
      video_script_hooks: [
        "Opening: 'Draw any four-sided shape — messy, lopsided, asymmetric. Add all four interior angles. You will always get 360°. How? Slice it diagonally: two triangles, each 180°, total 360°. That is the proof.'",
        "Mid-lesson: 'The formula (n−2)×180° works for all polygons. Triangle: n=3, gives 180°. Quadrilateral: n=4, gives 360°. Pentagon: n=5, gives 540°. One formula, every polygon.'",
        "Closing: 'If three angles of a quadrilateral are known, the fourth is locked in: 360° minus the sum of the three. No simultaneous equations, no guessing — just subtraction.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     8-B  Properties of a Parallelogram
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Properties of a Parallelogram",
    prerequisite_knowledge: [
      "Parallel lines and transversal angle properties (alternate, co-interior)",
      "Triangle congruence criteria (SAS, ASA, SSS)",
      "Angle sum of a quadrilateral = 360°",
      "Diagonal definition: line segment joining non-adjacent vertices"
    ],
    key_formulas: [
      "In a parallelogram: opposite sides are equal and parallel (AB=CD, BC=AD, AB∥CD, BC∥AD)",
      "Opposite angles are equal: ∠A=∠C, ∠B=∠D",
      "Consecutive angles are supplementary: ∠A+∠B=180°",
      "Diagonals bisect each other: AO=OC, BO=OD (O = intersection of diagonals)",
      "Converse 1: Both pairs of opposite sides equal → parallelogram",
      "Converse 2: Both pairs of opposite sides parallel → parallelogram",
      "Converse 3: Diagonals bisect each other → parallelogram",
      "Converse 4: One pair of sides both equal AND parallel → parallelogram"
    ],
    teaching_content: {
      intuition: "A parallelogram is a quadrilateral where both pairs of opposite sides are parallel. This single condition produces a cascade of beautiful properties: opposite sides become equal, opposite angles become equal, and the diagonals bisect each other. These properties all follow from the parallel lines making identical angles with the diagonals (alternate angle pairs). Special parallelograms — rectangles, rhombuses, squares — inherit all these properties and add extras of their own.",
      derivation: "Proof: Opposite sides of a parallelogram are equal (AB=CD and BC=AD).\n\nIn parallelogram ABCD, draw diagonal AC.\n\nIn △ABC and △CDA:\n  ∠BAC = ∠DCA (alternate interior, AB∥CD, transversal AC)\n  ∠BCA = ∠DAC (alternate interior, BC∥AD, transversal AC)\n  AC = CA (common)\n\nBy ASA: △ABC ≅ △CDA.\nBy CPCT: AB=CD and BC=DA. □\n\nProof: Diagonals bisect each other.\nDraw diagonals AC and BD intersecting at O.\nIn △AOB and △COD:\n  AB=CD (proved above)\n  ∠OAB = ∠OCD (alternate, AB∥CD)\n  ∠OBA = ∠ODC (alternate, AB∥CD)\nBy AAS: △AOB ≅ △COD.\nBy CPCT: AO=OC and BO=OD. □",
      worked_example: "ABCD is a parallelogram. ∠A = 65°.\n\n(i) Find all four angles.\n    ∠C = ∠A = 65° (opposite angles)\n    ∠B = 180° − 65° = 115° (co-interior/consecutive, ∠A+∠B=180°)\n    ∠D = ∠B = 115° (opposite angles)\n    Check: 65+115+65+115 = 360° ✓\n\n(ii) Diagonal AC = 10 cm. Find AO.\n    Diagonals bisect each other → AO = AC/2 = 5 cm.\n\n(iii) PQRS is a quadrilateral where PQ=SR=6cm and PQ∥SR. Show it is a parallelogram.\n    One pair of opposite sides both equal and parallel → parallelogram (Converse 4).",
      visual_description: "Draw parallelogram ABCD with AB∥CD and BC∥AD. Mark opposite sides with equal tick marks (AB=CD, BC=AD). Mark the diagonals AC and BD crossing at O. Mark equal segments AO=OC and BO=OD with tick marks. Use arc marks to show ∠A=∠C and ∠B=∠D. Show co-interior angle pairs adding to 180°.",
      svg_diagrams: [
        {
          title: "Parallelogram ABCD: opposite sides equal, diagonals bisecting each other",
          svg_code: "<svg viewBox='0 0 300 180' xmlns='http://www.w3.org/2000/svg'><polygon points='60,30 230,30 270,150 20,150' fill='#E8F5E9' stroke='#2E7D32' stroke-width='2'/><line x1='60' y1='30' x2='270' y2='150' stroke='#E91E63' stroke-width='1.5' stroke-dasharray='5,3'/><line x1='230' y1='30' x2='20' y2='150' stroke='#E91E63' stroke-width='1.5' stroke-dasharray='5,3'/><circle cx='145' cy='90' r='4' fill='#E91E63'/><text x='149' y='87' font-size='10' fill='#E91E63'>O</text><text x='48' y='24' font-size='11' fill='#2E7D32'>A</text><text x='230' y='24' font-size='11' fill='#2E7D32'>B</text><text x='270' y='162' font-size='11' fill='#2E7D32'>C</text><text x='8' y='162' font-size='11' fill='#2E7D32'>D</text><line x1='130' y1='30' x2='140' y2='34' stroke='#1565C0' stroke-width='2'/><line x1='90' y1='150' x2='100' y2='146' stroke='#1565C0' stroke-width='2'/><line x1='42' y1='93' x2='50' y2='87' stroke='#FF9800' stroke-width='2'/><line x1='238' y1='93' x2='246' y2='87' stroke='#FF9800' stroke-width='2'/><text x='60' y='170' font-size='9' fill='#333'>AB∥DC, AB=DC; AD∥BC, AD=BC; AO=OC, BO=OD</text></svg>"
        }
      ],
      common_misconceptions: [
        "Assuming all parallelograms are rectangles — rectangles have right angles (additional condition). A general parallelogram has no right angles.",
        "Diagonals of a parallelogram are equal — FALSE in general. Equal diagonals is a property of rectangles (special parallelogram). In a general parallelogram diagonals are unequal.",
        "Diagonals bisect each other at right angles — FALSE for general parallelograms. Right-angle bisection is a property of rhombuses.",
        "Thinking consecutive angles in a parallelogram are equal — they are supplementary (add to 180°), not equal. Equal consecutive angles would force 90° each → rectangle."
      ],
      shortcuts_and_tricks: [
        "Opposite angles equal is the fastest check in any parallelogram problem — find one opposite-angle pair and equate.",
        "Diagonal midpoint: if diagonals intersect at O, then O is the midpoint of BOTH diagonals simultaneously. Use this to find missing diagonal lengths.",
        "Converse shortcut: to prove a quadrilateral is a parallelogram, show one pair of sides is BOTH equal AND parallel — just one pair is sufficient (Converse 4).",
        "Parallelogram area shortcut: base × height (perpendicular height, not slant side)."
      ],
      when_to_use_this_method: "Invoke parallelogram properties whenever ABCD is stated or proved to be a parallelogram. Use converses to prove that a quadrilateral IS a parallelogram. The most efficient converse is usually Converse 4 (one pair of sides both parallel and equal).",
      edge_cases: [
        "Rectangle: parallelogram + right angles. All four properties of parallelogram hold, PLUS diagonals are equal.",
        "Rhombus: parallelogram + all sides equal. All four properties hold, PLUS diagonals bisect each other at right angles AND bisect the vertex angles.",
        "Square: parallelogram + right angles + all sides equal. All properties of rectangle AND rhombus hold simultaneously.",
        "Trapezium: only ONE pair of opposite sides parallel (not a parallelogram). Properties above do NOT apply."
      ],
      key_takeaway: "A parallelogram has: (1) opposite sides equal, (2) opposite angles equal, (3) consecutive angles supplementary, (4) diagonals bisect each other. All four are proved using triangle congruence on the diagonal. The four converses allow proving a shape is a parallelogram from any one of these properties.",
      video_script_hooks: [
        "Opening: 'Two pairs of parallel sides — that is all a parallelogram is. But from that one definition, four strong properties flow automatically: equal opposite sides, equal opposite angles, supplementary consecutive angles, bisecting diagonals. All from two pairs of parallels.'",
        "Mid-lesson: 'Diagonals of a parallelogram bisect each other. Not at right angles — just bisect. If AO=OC and BO=OD, the job is done. This is the key property for coordinate proofs.'",
        "Closing: 'To prove a parallelogram: pick the easiest converse. One pair of sides — both equal AND parallel — is usually fastest. Two lines of proof, done.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     8-C  Mid-Point Theorem
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Mid-Point Theorem",
    prerequisite_knowledge: [
      "Properties of a parallelogram (opposite sides equal and parallel)",
      "Triangle congruence criteria",
      "Concept of midpoint of a line segment",
      "Alternate interior angles with parallel lines"
    ],
    key_formulas: [
      "Mid-Point Theorem: The line segment joining the midpoints of two sides of a triangle is parallel to the third side and equal to half of it",
      "If E and F are midpoints of AB and AC respectively, then EF ∥ BC and EF = BC/2",
      "Converse: A line through the midpoint of one side of a triangle, parallel to another side, bisects the third side",
      "Application: In a trapezium, the line joining midpoints of the non-parallel sides (median of trapezium) is parallel to the parallel sides and equals half their sum"
    ],
    teaching_content: {
      intuition: "The mid-point theorem says: connect the midpoints of any two sides of a triangle, and that connector is automatically parallel to the third side and exactly half as long. It's as if the triangle has a 'shadow' that is similar to itself at half the scale, sitting inside the triangle. This theorem is elegant because it links midpoints (about sides) to parallelism (about directions) — two seemingly different concepts become the same statement.",
      derivation: "Proof of Mid-Point Theorem:\nGiven △ABC with E and F midpoints of AB and AC respectively. Prove EF ∥ BC and EF = BC/2.\n\nExtend EF to G such that FG = EF. Join CG.\n\nIn △AEF and △CGF:\n  EF = GF (construction, F is midpoint of EG)\n  AF = CF (F is midpoint of AC)\n  ∠AFE = ∠CFG (vertically opposite)\n\nBy SAS: △AEF ≅ △CGF.\nBy CPCT: AE = CG and ∠EAF = ∠GCF.\n\nSince ∠EAF = ∠GCF (alternate interior angles), we get AE ∥ CG.\nAlso AE = BE (E is midpoint of AB) and AE = CG (CPCT). So BE = CG.\n\nIn quadrilateral BCGE: BC∥GE (since AE∥CG extends to BE∥CG) and BE = CG.\n→ BCGE is a parallelogram.\n→ EG ∥ BC and EG = BC.\nSince EF = EG/2 (F is midpoint of EG by construction), EF = BC/2 and EF ∥ BC. □",
      worked_example: "(i) In △ABC, D and E are midpoints of AB and BC. DE = 6 cm. Find AC.\n    By Mid-Point Theorem: DE ∥ AC and DE = AC/2.\n    AC = 2×DE = 2×6 = 12 cm.\n\n(ii) P, Q, R are midpoints of sides AB, BC, CA of △ABC with AB=8, BC=10, CA=6.\n    PQ (midpoint of AB and BC) = CA/2 = 3 cm\n    QR (midpoint of BC and CA) = AB/2 = 4 cm\n    PR (midpoint of AB and CA) = BC/2 = 5 cm\n    The medial triangle PQR has sides 3, 4, 5 — a right triangle!\n\n(iii) Show that the line joining midpoints of two sides of a triangle divides it into four congruent triangles.\n    Connecting all three midpoints creates four triangles, each similar to the original at scale 1/2.",
      visual_description: "Draw triangle ABC. Mark E as midpoint of AB and F as midpoint of AC. Draw EF and BC with equal-parallel arrows. Label EF = BC/2. Extend EF to G such that FG = EF, and draw the construction. Alternatively, show the medial triangle: connect all three midpoints P, Q, R to divide △ABC into four congruent triangles.",
      svg_diagrams: [
        {
          title: "Mid-Point Theorem: EF joins midpoints of AB and AC, EF∥BC and EF=BC/2",
          svg_code: "<svg viewBox='0 0 280 180' xmlns='http://www.w3.org/2000/svg'><polygon points='140,15 30,160 250,160' fill='none' stroke='#1565C0' stroke-width='2'/><circle cx='85' cy='87' r='4' fill='#E91E63'/><circle cx='195' cy='87' r='4' fill='#E91E63'/><line x1='85' y1='87' x2='195' y2='87' stroke='#E91E63' stroke-width='2.5'/><text x='132' y='22' font-size='11' fill='#1565C0'>A</text><text x='18' y='165' font-size='11' fill='#1565C0'>B</text><text x='250' y='165' font-size='11' fill='#1565C0'>C</text><text x='68' y='84' font-size='11' fill='#E91E63'>E</text><text x='198' y='84' font-size='11' fill='#E91E63'>F</text><text x='110' y='82' font-size='10' fill='#E91E63'>EF ∥ BC</text><text x='100' y='96' font-size='10' fill='#E91E63'>EF = BC/2</text><line x1='30' y1='160' x2='250' y2='160' stroke='#1565C0' stroke-width='2'/><line x1='110' y1='160' x2='120' y2='155' stroke='#4CAF50' stroke-width='2'/><line x1='165' y1='160' x2='175' y2='155' stroke='#4CAF50' stroke-width='2'/><line x1='115' y1='87' x2='125' y2='82' stroke='#FF9800' stroke-width='2'/></svg>"
        }
      ],
      common_misconceptions: [
        "Applying the theorem to medians (vertex to midpoint of opposite side) — the mid-point theorem is about the line joining midpoints of TWO SIDES, not a median.",
        "Thinking EF = BC (not half) — the mid-point joining segment is half the third side, not equal to it.",
        "Assuming the result for only one pair of sides — it applies to all three pairs of sides in the same triangle, giving three separate mid-point joins.",
        "Forgetting the direction of EF: EF is parallel to the third side BC, not to AB or AC."
      ],
      shortcuts_and_tricks: [
        "Mid-point theorem gives BC instantly from EF: BC = 2×EF. No computation needed beyond doubling.",
        "Medial triangle (joining all three midpoints): perimeter = half the perimeter of the original triangle. Each side of the medial triangle = half the opposite side of the original.",
        "Converse: if a line is drawn through the midpoint of one side parallel to another side, it WILL bisect the third side — use this to prove midpoints when parallel lines are given.",
        "In coordinate geometry: midpoint of (x₁,y₁) and (x₂,y₂) is ((x₁+x₂)/2, (y₁+y₂)/2) — pairs with the mid-point theorem naturally."
      ],
      when_to_use_this_method: "Apply the mid-point theorem whenever midpoints of two sides of a triangle are given. Apply the converse when a parallel line through a midpoint is given and you need to prove the third side is bisected. Use in trapezium problems to find the median length.",
      edge_cases: [
        "If the triangle is right-angled: the mid-point of the hypotenuse is equidistant from all three vertices (property of right triangles).",
        "The medial triangle divides the original into 4 congruent triangles — each is similar to the original at scale 1:2.",
        "For a degenerate triangle (collinear vertices): EF and BC become the same line — the theorem holds trivially but degenerate cases have no geometric interest.",
        "Trapezium median: if ABCD is a trapezium with AB∥CD, midpoints E (of AD) and F (of BC): EF ∥ AB ∥ CD and EF = (AB+CD)/2."
      ],
      key_takeaway: "The line joining midpoints of two sides of a triangle is parallel to the third side and half its length. Converse: a line through a midpoint parallel to one side bisects the other side. These two theorems are used together to prove midpoints and parallelism in triangles and quadrilaterals.",
      video_script_hooks: [
        "Opening: 'Connect the midpoints of two sides of any triangle. What do you get? A line that is perfectly parallel to the third side and exactly half its length. Every single time. Geometry's most compact surprise.'",
        "Mid-lesson: 'The medial triangle: connect all three midpoints. You slice the original into four identical triangles — each a perfect scaled copy at half size. The whole family nested inside one figure.'",
        "Closing: 'Mid-point theorem = two outputs from one construction: parallel AND half length. Converse = if you already know parallel, you get midpoint for free. These two directions cover almost every problem in this chapter.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 8: Quadrilaterals…");
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
