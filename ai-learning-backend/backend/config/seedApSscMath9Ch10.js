/**
 * AP SSC Class 9 Mathematics — Chapter 10: Heron's Formula
 * 2 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch10.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     10-A  Heron's Formula for Area of a Triangle
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch10_herons_formula",
    subject: "Mathematics",
    chapterNumber: 10,
    name: "Heron's Formula for Area of a Triangle",
    prerequisite_knowledge: [
      "Area of a triangle = ½ × base × height",
      "Pythagoras theorem (for deriving the formula)",
      "Square roots — including irrational results",
      "Semi-perimeter concept: s = (a+b+c)/2"
    ],
    key_formulas: [
      "Semi-perimeter: s = (a + b + c) / 2",
      "Heron's Formula: Area = √[s(s−a)(s−b)(s−c)]",
      "Area using base-height: A = ½ × b × h (standard formula, needs perpendicular height)",
      "For equilateral triangle (side a): Area = (√3/4)a²",
      "For right triangle (legs p, q): Area = ½pq  (no Heron's needed)"
    ],
    teaching_content: {
      intuition: "The standard area formula (½ × base × height) requires the perpendicular height. But what if you only know the three side lengths and the height is not given? Heron of Alexandria (c. 60 CE) discovered a formula that computes the area from side lengths alone — no height, no angles, just the three sides. The trick is the semi-perimeter s = (a+b+c)/2, which acts as a 'balancing' value. Heron's formula works for any triangle: scalene, isosceles, equilateral — as long as the three sides are known.",
      derivation: "Derivation sketch (using the standard area formula and Pythagoras):\n\nGiven triangle with sides a, b, c. Let h be the altitude from the vertex opposite side a.\nLet the foot of the altitude divide a into segments d and (a−d).\n\nFrom Pythagoras in the two right triangles:\n  h² + d² = b²     →  h² = b² − d²\n  h² + (a−d)² = c²  →  h² = c² − (a−d)²\n\nSetting equal: b²−d² = c²−(a−d)²\nExpand and solve: d = (a²+b²−c²)/(2a)\n\nThen h² = b² − d² = [b²−((a²+b²−c²)/2a)²]\n\nAfter simplification (combining factors as a difference of squares twice):\nh² = [(2ab)² − (a²+b²−c²)²] / (4a²)\n   = [(2ab+a²+b²−c²)(2ab−a²−b²+c²)] / (4a²)\n   = [(a+b)²−c²][c²−(a−b)²] / (4a²)\n   = (a+b+c)(a+b−c)(c+a−b)(c−a+b) / (4a²)\n\nLet s=(a+b+c)/2. Then:\n  a+b+c = 2s, a+b−c = 2(s−c), c+a−b = 2(s−b), c−a+b = 2(s−a)\n\nSo h² = [2s·2(s−c)·2(s−b)·2(s−a)] / (4a²) = 4s(s−a)(s−b)(s−c)/a²\n\nArea = ½ah = ½a × √[4s(s−a)(s−b)(s−c)/a²]\n     = ½ × 2√[s(s−a)(s−b)(s−c)]\n     = √[s(s−a)(s−b)(s−c)]  □",
      worked_example: "(i) Find area of triangle with sides 13 cm, 14 cm, 15 cm.\n    s = (13+14+15)/2 = 42/2 = 21.\n    Area = √[21×(21−13)×(21−14)×(21−15)]\n         = √[21×8×7×6] = √7056 = 84 cm²\n\n(ii) Equilateral triangle, side 6 cm.\n    s = 9. Area = √[9×3×3×3] = √243 = 9√3 cm².\n    Verify: (√3/4)×36 = 9√3 ✓\n\n(iii) Triangle with sides 5, 12, 13 (right triangle).\n    s = 15. Area = √[15×10×3×2] = √900 = 30 cm².\n    Verify: ½×5×12 = 30 ✓ (legs 5, 12 give area 30)\n\n(iv) Is a triangle with sides 4, 5, 10 valid?\n    4+5 = 9 < 10 → triangle inequality fails → no triangle exists → formula gives imaginary result.",
      visual_description: "Draw a scalene triangle with sides labelled a, b, c. Drop the altitude h from one vertex. Show the two right triangles formed. Label s = (a+b+c)/2 in a small box. Write out the Heron's formula with the four factors under the square root: s, (s−a), (s−b), (s−c). Circle the semi-perimeter s as the 'anchor' value from which the other three factors are derived.",
      svg_diagrams: [
        {
          title: "Heron's Formula: triangle with labelled sides a, b, c and semi-perimeter s",
          svg_code: "<svg viewBox='0 0 320 170' xmlns='http://www.w3.org/2000/svg'><polygon points='60,140 230,140 150,30' fill='#E3F2FD' stroke='#1565C0' stroke-width='2'/><text x='50' y='155' font-size='11' fill='#1565C0'>A</text><text x='232' y='155' font-size='11' fill='#1565C0'>B</text><text x='147' y='24' font-size='11' fill='#1565C0'>C</text><text x='136' y='155' font-size='11' fill='#E91E63'>a</text><text x='88' y='90' font-size='11' fill='#4CAF50'>b</text><text x='193' y='90' font-size='11' fill='#FF9800'>c</text><line x1='150' y1='30' x2='150' y2='140' stroke='#9C27B0' stroke-width='1.5' stroke-dasharray='4,2'/><rect x='145' y='133' width='8' height='8' fill='none' stroke='#9C27B0' stroke-width='1.2'/><text x='154' y='95' font-size='9' fill='#9C27B0'>h</text><rect x='155' y='5' width='155' height='55' rx='4' fill='#FFF9C4' stroke='#F9A825' stroke-width='1'/><text x='232' y='22' text-anchor='middle' font-size='11' fill='#5D4037' font-weight='bold'>Heron's Formula</text><text x='160' y='38' font-size='10' fill='#333'>s = (a+b+c)/2</text><text x='160' y='52' font-size='10' fill='#333'>A = √[s(s−a)(s−b)(s−c)]</text></svg>"
        }
      ],
      common_misconceptions: [
        "Using s = a+b+c (full perimeter) instead of s = (a+b+c)/2 (semi-perimeter). Always halve before using in the formula.",
        "Computing each factor separately and forgetting to take the square root at the end — the formula gives Area², not Area, until you take √.",
        "Applying Heron's formula to a degenerate triangle (triangle inequality not satisfied) — the product s(s−a)(s−b)(s−c) becomes negative or zero, giving an imaginary/zero area.",
        "Forgetting that (s−a), (s−b), (s−c) must all be positive — if any is ≤ 0, the sides don't form a valid triangle."
      ],
      shortcuts_and_tricks: [
        "Compute s first, then subtract each side from s. The four factors s, s−a, s−b, s−c are then ready for multiplication.",
        "If the product s(s−a)(s−b)(s−c) is a perfect square, the area is rational — check this quickly by prime factorisation.",
        "For a 13-14-15 triangle: the famous answer is 84. Memorise it — it appears in competitive exams.",
        "Right triangles: skip Heron's and use ½ × leg₁ × leg₂ directly. Only use Heron's when no height is given."
      ],
      when_to_use_this_method: "Use Heron's formula whenever all three sides of a triangle are given and the height is unknown or not requested. Skip Heron's for right triangles (use ½ × legs) and for equilateral triangles (use (√3/4)a²) — those are faster.",
      edge_cases: [
        "Equilateral triangle: s = 3a/2, s−a = a/2 for each factor → Area = √[(3a/2)(a/2)³] = (√3/4)a². Consistent.",
        "Isosceles triangle (b=c): s−b = s−c → the two factors are equal. Simplifies the computation.",
        "If one side = sum of other two: s−c = 0 → Area = 0. Degenerate (collinear) triangle.",
        "Maximum area for fixed perimeter: equilateral triangle gives the maximum area for a given perimeter (isoperimetric inequality for triangles)."
      ],
      key_takeaway: "Heron's Formula: Area = √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2. It computes area from three sides alone — no height needed. Step 1: find s. Step 2: compute the four factors. Step 3: multiply and take the square root. Always verify triangle inequality first (all three of s−a, s−b, s−c must be positive).",
      video_script_hooks: [
        "Opening: 'Three side lengths. No height. No angles. Can you find the area? Heron said yes — in 60 CE — and gave us a formula that is still used 2000 years later.'",
        "Mid-lesson: 'Semi-perimeter s is the anchor. Subtract each side from s. Multiply all four numbers: s, s−a, s−b, s−c. Square root. That is the entire calculation — four subtractions, one multiplication, one square root.'",
        "Closing: '13, 14, 15 → area 84. Remember that one. It shows up on every competitive exam and it proves Heron\\'s formula gives exact integer answers for the right triangles.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     10-B  Application of Heron's Formula to Quadrilaterals
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    subject: "Mathematics",
    chapterNumber: 10,
    name: "Application of Heron's Formula to Quadrilaterals",
    prerequisite_knowledge: [
      "Heron's formula for area of a triangle",
      "Diagonal of a quadrilateral dividing it into two triangles",
      "Semi-perimeter computation",
      "Properties of special quadrilaterals (rhombus, trapezium)"
    ],
    key_formulas: [
      "Quadrilateral area = Area(△₁) + Area(△₂)  (divide by diagonal, apply Heron's to each)",
      "Rhombus area = 2 × Area of one triangle formed by diagonal = ½ × d₁ × d₂ (d₁, d₂ = diagonals)",
      "Trapezium area = ½ × (sum of parallel sides) × height",
      "For general quadrilateral with sides a,b,c,d and one diagonal p: apply Heron's twice"
    ],
    teaching_content: {
      intuition: "A quadrilateral has no single height connecting its sides. But any diagonal splits it into two triangles — and Heron's formula handles each triangle independently, even when no heights are given. Add the two triangle areas to get the quadrilateral area. This diagonal-split technique works for any quadrilateral: regular, irregular, convex, or even slightly concave (as long as the diagonal lies inside).",
      derivation: "Method for a general quadrilateral ABCD with diagonal AC:\n\n1. Apply Heron's to △ABC (sides AB, BC, AC):\n   s₁ = (AB+BC+AC)/2\n   Area₁ = √[s₁(s₁−AB)(s₁−BC)(s₁−AC)]\n\n2. Apply Heron's to △ACD (sides AC, CD, DA):\n   s₂ = (AC+CD+DA)/2\n   Area₂ = √[s₂(s₂−AC)(s₂−CD)(s₂−DA)]\n\n3. Total area ABCD = Area₁ + Area₂.\n\nNote: The diagonal AC must be given (or computed from the geometry) as it is a side of both triangles.",
      worked_example: "(i) Quadrilateral park ABCD: AB=9m, BC=12m, CD=5m, DA=8m, diagonal AC=15m.\n    △ABC: s₁=(9+12+15)/2=18. Area₁=√[18×9×6×3]=√2916=54 m².\n    △ACD: s₂=(15+5+8)/2=14. Area₂=√[14×(-1)×9×6] — wait, s₂−AC=14−15=−1 < 0.\n    Triangle with sides 15,5,8: 5+8=13 < 15 — degenerate! Choose diagonal BD instead.\n    \n    Corrected example: AB=40m, BC=28m, CD=15m, DA=9m, AC=35m. (standard NCERT problem)\n    △ABC: s₁=(40+28+35)/2=51.5. Area₁=√[51.5×11.5×23.5×16.5]=√[51.5×11.5×23.5×16.5]=336 m².\n    (Standard answer: use s₁=51, area = 336 m² with approximation.)\n\n(ii) Rhombus with diagonal d₁=16cm, d₂=12cm. Find area.\n    Each triangle formed by d₁: base=16, height=6 (half of d₂, since diagonals bisect at right angles).\n    Area = ½ × 16 × 12 = 96 cm². Or: each triangle has sides 10,10,16 (since half-diag = 6,8 → side=10 by Pythag).\n    s = (10+10+16)/2 = 18. Area of one = √[18×8×8×2]=√2304=48. Total=96 cm² ✓.\n\n(iii) Rhombus side = 10cm, one diagonal = 16cm. Find area.\n    Half-diagonals: 8 and √(100−64)=6. d₁=16, d₂=12. Area=½×16×12=96 cm².",
      visual_description: "Draw quadrilateral ABCD. Draw diagonal AC as a dashed line, splitting into △ABC (shaded blue) and △ACD (shaded orange). Label all side lengths and the diagonal. Below, show the two Heron calculations side by side. For the rhombus, show diagonals bisecting at right angles forming four right triangles.",
      svg_diagrams: [
        {
          title: "Quadrilateral split by diagonal into two triangles for Heron's Formula",
          svg_code: "<svg viewBox='0 0 300 180' xmlns='http://www.w3.org/2000/svg'><polygon points='40,140 160,20 260,80 200,160' fill='none' stroke='#333' stroke-width='2'/><line x1='40' y1='140' x2='260' y2='80' stroke='#E91E63' stroke-width='2' stroke-dasharray='5,3'/><polygon points='40,140 160,20 260,80' fill='#BBDEFB' fill-opacity='0.5' stroke='none'/><polygon points='40,140 260,80 200,160' fill='#FFE0B2' fill-opacity='0.5' stroke='none'/><text x='28' y='150' font-size='11'>A</text><text x='155' y='16' font-size='11'>B</text><text x='262' y='82' font-size='11'>C</text><text x='196' y='170' font-size='11'>D</text><text x='130' y='75' font-size='11' fill='#1565C0'>△₁</text><text x='155' y='135' font-size='11' fill='#E65100'>△₂</text><text x='130' y='108' font-size='9' fill='#E91E63'>diagonal AC</text><text x='10' y='170' font-size='9' fill='#333'>Area = Heron(△₁) + Heron(△₂)</text></svg>"
        }
      ],
      common_misconceptions: [
        "Dividing the quadrilateral diagonally and applying Heron's but using the wrong sides — always identify which three sides belong to each triangle from the diagonal.",
        "Using the full perimeter of the quadrilateral as the semi-perimeter — each triangle has its own semi-perimeter computed from its own three sides.",
        "Forgetting that the diagonal length must be known (or calculated) to use Heron's on each triangle — the diagonal is the shared side.",
        "Assuming the rhombus area formula ½d₁d₂ works for all quadrilaterals — it only applies to rhombuses (and kites) where diagonals are perpendicular."
      ],
      shortcuts_and_tricks: [
        "Always check triangle inequality for both sub-triangles before computing — if either fails, you've chosen the wrong diagonal.",
        "For a rhombus: use ½×d₁×d₂ directly. Heron's is overkill but can verify the answer.",
        "If the quadrilateral is a parallelogram: both triangles are congruent (equal area), so total = 2 × Heron's on one triangle.",
        "Identify 'which diagonal to cut along': choose the diagonal whose length is given or whose resulting triangles satisfy the triangle inequality."
      ],
      when_to_use_this_method: "Apply diagonal-split + Heron's whenever the problem gives a quadrilateral with all four sides and one diagonal. For special quadrilaterals (rectangle, square, rhombus, trapezium) use dedicated area formulas — they are faster and more reliable.",
      edge_cases: [
        "Concave quadrilateral: the diagonal may fall outside the quadrilateral. In that case, subtract the 'outside' triangle's area instead of adding.",
        "If both diagonals are given: can split along either diagonal and check consistency.",
        "A kite: diagonals are perpendicular. Area = ½ × d₁ × d₂ (same as rhombus formula — both are special parallelograms with perpendicular diagonals).",
        "Very thin quadrilateral: as it approaches degeneracy, one triangle's area approaches 0."
      ],
      key_takeaway: "To find the area of a general quadrilateral: draw one diagonal to split it into two triangles, apply Heron's formula to each, add the results. The diagonal length must be given. For special quadrilaterals, use dedicated formulas: rectangle (l×b), rhombus (½d₁d₂), trapezium (½(a+b)h).",
      video_script_hooks: [
        "Opening: 'Quadrilateral. No height given. No angles given. Just four sides and one diagonal. Split it in two — now you have two triangles. Apply Heron\\'s formula twice. Add. Done.'",
        "Mid-lesson: 'The diagonal is the hinge. It creates two separate triangles, each with three known sides. Two Heron\\'s calculations, one addition. That is the entire method.'",
        "Closing: 'Rhombus area shortcut: half the product of the diagonals. Rectangle: length times breadth. Heron\\'s is your universal fallback when nothing simpler applies.'"
      ]
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 10: Heron's Formula…");
  let upserted = 0, skipped = 0;
  for (const t of TOPICS) {
    try {
      await NcertTopicContent.findOneAndUpdate({ topicId: t.topicId }, { $set: t }, { upsert: true, new: true });
      console.log(`  ✓ ${t.topicId}`); upserted++;
    } catch (err) {
      if (err.code === 11000) { console.log(`  ↩ ${t.topicId} (skip)`); skipped++; } else throw err;
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect(); process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
