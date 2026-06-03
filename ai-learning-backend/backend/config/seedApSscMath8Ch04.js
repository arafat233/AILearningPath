/**
 * AP SSC Class 8 Mathematics — Chapter 4: Practical Geometry (Construction of Quadrilaterals)
 * 3 topics. topicId: ap_ssc_math8_ch4_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch04.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch4_five_measurements",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Why a Quadrilateral Needs Five Measurements",
    prerequisite_knowledge: [
      "Using a ruler, compass and protractor",
      "Constructing a triangle from 3 measurements (SSS, SAS, ASA)",
      "Sides, diagonals and angles of a quadrilateral",
      "Drawing arcs to locate a point at a given distance",
    ],
    key_formulas: [
      "A quadrilateral is fixed (uniquely constructible) by exactly 5 independent measurements",
      "A diagonal splits a quadrilateral into 2 triangles; each triangle needs 3 measurements",
      "5 = 3 (first triangle) + 2 more (the second triangle shares the diagonal)",
    ],
    teaching_content: {
      intuition: "A triangle is rigid — three sticks of fixed length can only make one shape. A quadrilateral is floppy: four sticks hinged at the corners can be squashed into many shapes. To pin it down you must add information. It turns out FIVE well-chosen measurements always fix a quadrilateral exactly — no more, no less.",
      derivation: "Draw a diagonal of the quadrilateral. It cuts the quadrilateral into TWO triangles. To build the first triangle you need 3 measurements (e.g. its 3 sides). The diagonal is shared, so the second triangle already has one side known; it needs only 2 more measurements. Total = 3 + 2 = 5. That's why every standard construction question gives you exactly five data: e.g. '4 sides + 1 diagonal', '3 sides + 2 diagonals', '2 adjacent sides + 3 angles', '3 sides + 2 included angles', or '4 sides + 1 angle'.",
      worked_example: "Identify the 5 measurements in: 'Construct quadrilateral PQRS with PQ = 4 cm, QR = 6 cm, RS = 5 cm, PS = 5.5 cm and diagonal PR = 7 cm.'\n\nThat is 4 sides (PQ, QR, RS, PS) + 1 diagonal (PR) = 5 measurements.\nPlan: PR splits PQRS into △PQR (sides PQ, QR, PR — all known → build first) and △PRS (sides PR, RS, PS — all known → build second on the other side of PR).",
      visual_description: "A quadrilateral PQRS with diagonal PR drawn, shading the two triangles △PQR and △PRS in different colours. The shared diagonal PR is highlighted to show why only 2 extra measurements are needed for the second triangle.",
      svg_diagrams: [
        { title: "Diagonal splits quadrilateral into two triangles",
          svg_code: "<svg viewBox='0 0 220 140' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><polygon points='30,110 110,120 190,60 80,30' fill='none' stroke='#333'/><line x1='30' y1='110' x2='190' y2='60' stroke='#dc2626' stroke-width='2'/><polygon points='30,110 110,120 190,60' fill='#dbeafe' opacity='0.6'/><polygon points='30,110 190,60 80,30' fill='#dcfce7' opacity='0.6'/><text x='20' y='124'>P</text><text x='110' y='134'>Q</text><text x='192' y='56'>R</text><text x='72' y='26'>S</text><text x='95' y='95' fill='#dc2626' font-size='9'>diagonal</text></svg>" }
      ],
      common_misconceptions: [
        "Thinking 4 measurements (just the sides) fix a quadrilateral — they don't; the shape can still flex.",
        "Trying to use MORE than 5 measurements and finding they conflict (over-determined).",
        "Forgetting the diagonal is shared and double-counting measurements for the second triangle.",
        "Believing any 5 measurements work — they must be a valid, independent set that actually determines the figure.",
      ],
      shortcuts_and_tricks: [
        "Always look for the triangle you can build FIRST (one with all 3 of its parts given), then attach the second.",
        "Count the data: a well-posed construction question gives exactly 5 measurements.",
        "Rough sketch first, labelling all given values — it reveals which triangle to start with.",
      ],
      when_to_use_this_method: "Use this reasoning to PLAN any quadrilateral construction: pick the diagonal, identify the first fully-known triangle, then the second. It underlies all the specific constructions in this chapter.",
      edge_cases: [
        "If the two short sides of a triangle can't reach across the diagonal (triangle inequality fails), the quadrilateral can't be constructed.",
        "Some data sets (e.g. 4 angles only) do NOT fix a quadrilateral — angles alone leave the size free.",
        "A square needs only its side (1 measurement) because its many right-angle/equal constraints supply the rest.",
      ],
      key_takeaway: "A quadrilateral needs FIVE independent measurements to be uniquely constructed, because a diagonal splits it into two triangles (3 + 2 measurements). Plan every construction by finding the first fully-determined triangle, then building the second on the shared diagonal.",
      video_script_hooks: [
        "Opening: 'A triangle can't be bent out of shape — but a quadrilateral wobbles. So how many facts do you need to lock it down? Exactly five.'",
        "Mid: 'Draw one diagonal and the floppy quadrilateral becomes two rigid triangles. That's the whole secret.'",
        "Closing: 'Three measurements for the first triangle, two for the second — the shared diagonal does the rest.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch4_construct_quadrilaterals",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Constructing Quadrilaterals (Standard Cases)",
    prerequisite_knowledge: [
      "Why five measurements fix a quadrilateral",
      "Compass-and-ruler triangle construction (SSS, SAS, ASA)",
      "Drawing an angle of given size with a protractor",
      "Locating a point by intersecting two arcs",
    ],
    key_formulas: [
      "Case 1: 4 sides + 1 diagonal → build two SSS triangles across the diagonal",
      "Case 2: 3 sides + 2 diagonals → use the diagonals as triangle sides",
      "Case 3: 2 adjacent sides + 3 angles → ASA-style, angle by angle",
      "Case 4: 3 sides + 2 included angles → SAS chain along the boundary",
    ],
    teaching_content: {
      intuition: "Every quadrilateral construction is really just 'build a triangle, then build a second triangle (or extend with an angle)'. Once you spot which triangle has all three parts handed to you, you draw it; then you swing arcs or set protractor angles to place the last vertex. The five measurements always slot into this two-step rhythm.",
      derivation: "General procedure (Case 1: four sides + a diagonal, quad ABCD with diagonal AC):\n1. Draw the diagonal AC to its given length.\n2. With centre A and radius AB, draw an arc; with centre C and radius CB, draw another arc; they cross at B (this builds △ABC by SSS).\n3. On the OTHER side of AC, with centre A radius AD and centre C radius CD, cross arcs to locate D.\n4. Join AB, BC, CD, DA. ABCD is the required quadrilateral.\nOther cases swap arcs for protractor angles (when angles are given) but keep the same triangle-then-triangle logic.",
      worked_example: "Construct quad ABCD: AB = 4.5 cm, BC = 5.5 cm, CD = 4 cm, AD = 6 cm, diagonal AC = 7 cm.\n\n1. Draw AC = 7 cm.\n2. Arc from A radius 4.5 (for B) and arc from C radius 5.5 (for B) — intersection = B (△ABC by SSS).\n3. On the opposite side of AC: arc from A radius 6 (for D) and arc from C radius 4 (for D) — intersection = D.\n4. Join AB, BC, CD, DA. Done.\n(Always check arcs actually intersect — they do here since each triangle satisfies the triangle inequality.)",
      visual_description: "Step strip: (1) segment AC drawn; (2) two arcs from A and C meeting above at B; (3) two arcs from A and C meeting below at D; (4) the finished quadrilateral ABCD with all four sides inked and the diagonal AC shown dashed.",
      svg_diagrams: [
        { title: "Constructing ABCD from 4 sides + diagonal AC",
          svg_code: "<svg viewBox='0 0 240 150' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><line x1='40' y1='80' x2='200' y2='80' stroke='#333' stroke-dasharray='4 3'/><text x='30' y='84'>A</text><text x='202' y='84'>C</text><circle cx='110' cy='35' r='3' fill='#2563eb'/><text x='114' y='32' fill='#2563eb'>B</text><line x1='40' y1='80' x2='110' y2='35' stroke='#333'/><line x1='200' y1='80' x2='110' y2='35' stroke='#333'/><circle cx='100' cy='130' r='3' fill='#16a34a'/><text x='104' y='142' fill='#16a34a'>D</text><line x1='40' y1='80' x2='100' y2='130' stroke='#333'/><line x1='200' y1='80' x2='100' y2='130' stroke='#333'/><path d='M70 50 A40 40 0 0 1 95 30' fill='none' stroke='#999' stroke-dasharray='2 2'/></svg>" }
      ],
      common_misconceptions: [
        "Placing both extra vertices on the SAME side of the diagonal — B and D must be on OPPOSITE sides.",
        "Measuring arcs from the wrong centres — each arc radius is the side joining that vertex.",
        "Using a protractor when only sides/diagonals are given (no angles) — arcs alone suffice.",
        "Not checking that arcs intersect; if they don't, the data is inconsistent (no such quadrilateral).",
      ],
      shortcuts_and_tricks: [
        "Start with the diagonal (Cases 1–2) or the side with a known angle at each end (Cases 3–4).",
        "Keep a light rough sketch labelled with all 5 values to avoid mixing up which radius goes where.",
        "Sides → arcs; angles → protractor. Match the tool to the given data.",
      ],
      when_to_use_this_method: "Use these step sequences whenever asked to 'construct' a quadrilateral from 5 measurements. Identify the case (which 5 are given) and follow the matching triangle-then-triangle build.",
      edge_cases: [
        "If a triangle's two arc-radii sum to less than the diagonal, the arcs miss — construction impossible.",
        "Given angles must be feasible (e.g. their partial sums can't exceed 360° for the quadrilateral).",
        "When 3 angles are given, the 4th is forced = 360° − (sum of the three).",
      ],
      key_takeaway: "Construct a quadrilateral by building one fully-known triangle first (ruler + arcs for sides, protractor for angles), then locating the remaining vertex on the opposite side of the shared diagonal. Match the method to the given case (sides+diagonal, sides+diagonals, sides+angles).",
      video_script_hooks: [
        "Opening: 'Give me five measurements and a compass, and I'll draw your quadrilateral — exactly, every time.'",
        "Mid: 'Watch the two arcs cross. That intersection point IS the vertex. No guessing.'",
        "Closing: 'B above the diagonal, D below it — opposite sides. Put them on the same side and you've drawn a different shape entirely.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch4_special_quadrilaterals",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Constructing Special Quadrilaterals",
    prerequisite_knowledge: [
      "Properties of square, rectangle, rhombus, parallelogram",
      "Standard quadrilateral construction steps",
      "Constructing perpendiculars and parallel lines",
      "That special shapes need FEWER given measurements (their properties supply the rest)",
    ],
    key_formulas: [
      "Square: only 1 measurement needed (the side) — all angles 90°, all sides equal",
      "Rectangle: 2 measurements (length, breadth) — angles all 90°",
      "Rhombus: 2 measurements (e.g. the two diagonals, which meet at 90°)",
      "Parallelogram: 3 measurements (two adjacent sides + included angle, or sides + a diagonal)",
    ],
    teaching_content: {
      intuition: "Special quadrilaterals come with built-in rules (equal sides, right angles, parallel sides), and each rule is a free measurement you DON'T have to be told. So a square needs only its side; a rectangle needs length and breadth; a rhombus is fixed by its two diagonals (which cross at right angles). The properties do the heavy lifting.",
      derivation: "A general quadrilateral needs 5 measurements. Each property of a special shape replaces a measurement:\n• Square: 'all sides equal' + 'all angles 90°' remove 4 of the 5 → just 1 (the side) remains.\n• Rectangle: 'all angles 90°' + 'opposite sides equal' → 2 (length, breadth).\n• Rhombus: 'all sides equal' + 'diagonals perpendicular bisectors' → 2 (the diagonals).\n• Parallelogram: 'opposite sides equal & parallel' → 3 (2 adjacent sides + included angle).",
      worked_example: "Construct a rhombus with diagonals 6 cm and 8 cm.\n\nThe diagonals of a rhombus bisect each other at right angles.\n1. Draw diagonal AC = 8 cm. Find its midpoint O.\n2. At O, construct a perpendicular to AC.\n3. On that perpendicular, mark B and D each at 3 cm from O (half of the 6 cm diagonal) on opposite sides.\n4. Join AB, BC, CD, DA. ABCD is the rhombus.\n(Only 2 measurements were needed — the perpendicular-bisector property supplied the rest.)",
      visual_description: "A rhombus with its two diagonals drawn, crossing at centre O at a marked right angle. Diagonal AC = 8 cm horizontal, BD = 6 cm vertical, with O the midpoint of both (half-lengths 4 cm and 3 cm tick-marked).",
      svg_diagrams: [
        { title: "Rhombus from its two perpendicular diagonals",
          svg_code: "<svg viewBox='0 0 200 150' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><polygon points='20,75 100,25 180,75 100,125' fill='#eff6ff' stroke='#2563eb'/><line x1='20' y1='75' x2='180' y2='75' stroke='#dc2626'/><line x1='100' y1='25' x2='100' y2='125' stroke='#16a34a'/><rect x='100' y='67' width='8' height='8' fill='none' stroke='#333'/><text x='10' y='79'>A</text><text x='182' y='79'>C</text><text x='96' y='20'>B</text><text x='96' y='140'>D</text><text x='102' y='64' font-size='9'>O</text></svg>" }
      ],
      common_misconceptions: [
        "Asking for all 5 measurements of a square — only the side is needed.",
        "Forgetting a rhombus's diagonals cross at 90° (and bisect each other) — that's what makes 2 diagonals enough.",
        "Constructing a rectangle without ensuring the angles are exactly 90° (use a perpendicular, not a guess).",
        "Confusing 'rhombus from 2 diagonals' with 'parallelogram' — only a rhombus guarantees perpendicular diagonals.",
      ],
      shortcuts_and_tricks: [
        "Count the properties: each equal-side/right-angle/parallel rule saves you one measurement.",
        "Rhombus → start from the perpendicular bisector of one diagonal; square/rectangle → start from a right angle.",
        "For a parallelogram, build it like a triangle (SAS with the two sides and included angle), then complete by parallels.",
      ],
      when_to_use_this_method: "Use when asked to construct a NAMED special quadrilateral with minimal data — exploit its defining properties to supply the missing measurements rather than expecting all five.",
      edge_cases: [
        "A square given only its diagonal: half-diagonal + perpendicular at the centre also works (like a special rhombus).",
        "A parallelogram given two sides but NO angle isn't fixed — it can flex; an angle or diagonal is required.",
        "If a rectangle's given 'angle' isn't 90°, it isn't a rectangle — the data must be consistent with the name.",
      ],
      key_takeaway: "Special quadrilaterals need fewer measurements because their properties replace data: square (1 side), rectangle (length+breadth), rhombus (two perpendicular-bisecting diagonals), parallelogram (2 sides + included angle). Start the construction from the property that fixes the shape (right angle or perpendicular bisector).",
      video_script_hooks: [
        "Opening: 'A normal quadrilateral needs five facts. A square needs just ONE. Where did the other four go?'",
        "Mid: 'A rhombus's diagonals cross at a perfect right angle and cut each other in half — give me their lengths and I'll draw the whole shape.'",
        "Closing: 'Every property of a special shape is a measurement you get for free. Use them.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch4 (Practical Geometry): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
