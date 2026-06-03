/**
 * AP SSC Class 8 Mathematics — Chapter 3: Understanding Quadrilaterals
 * 4 topics. topicId: ap_ssc_math8_ch3_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch03.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch3_polygons_classification",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "Polygons and Their Classification",
    prerequisite_knowledge: [
      "Line segments, vertices and closed figures",
      "Naming shapes by number of sides (triangle, quadrilateral …)",
      "Meaning of an angle and a diagonal",
      "Difference between a curve and a polygon (straight sides only)",
    ],
    key_formulas: [
      "A polygon is a closed figure made of line segments (sides)",
      "Number of diagonals of an n-sided polygon = n(n − 3)/2",
      "Convex polygon: every interior angle < 180°; concave: at least one > 180°",
      "Regular polygon: all sides AND all angles equal",
    ],
    teaching_content: {
      intuition: "A polygon is just a fence made of straight sticks joined end to end with no gaps — triangle (3 sticks), quadrilateral (4), pentagon (5), and so on. We sort polygons by how many sides they have, whether they bulge outward everywhere (convex) or have a dent (concave), and whether they're perfectly even (regular) or lopsided (irregular).",
      derivation: "Diagonal count. A diagonal joins two NON-adjacent vertices. From each of the n vertices you can draw a line to (n − 3) others (you exclude itself and its 2 neighbours). That gives n(n − 3) lines, but each diagonal is counted twice (once from each end), so divide by 2: number of diagonals = n(n − 3)/2.\nCheck: a quadrilateral (n=4) → 4(1)/2 = 2 diagonals. A pentagon (n=5) → 5(2)/2 = 5. ✓",
      worked_example: "How many diagonals does a hexagon (6 sides) have, and is a regular hexagon convex?\n\nDiagonals = n(n−3)/2 = 6(3)/2 = 9.\nA regular hexagon has every interior angle 120° (< 180°), so it is convex.",
      visual_description: "Three figures side by side: a convex pentagon (all corners poke out), a concave quadrilateral (one corner caves inward, marked >180°), and a regular hexagon with tick marks showing equal sides and equal-angle arcs. Diagonals drawn dashed inside the pentagon.",
      svg_diagrams: [
        { title: "Convex vs concave, and diagonals of a pentagon",
          svg_code: "<svg viewBox='0 0 320 130' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><polygon points='40,30 80,20 100,60 70,100 30,80' fill='#eff6ff' stroke='#2563eb'/><line x1='40' y1='30' x2='100' y2='60' stroke='#94a3b8' stroke-dasharray='3 2'/><line x1='40' y1='30' x2='70' y2='100' stroke='#94a3b8' stroke-dasharray='3 2'/><text x='40' y='118' fill='#2563eb'>convex</text><polygon points='180,30 240,40 230,70 250,110 180,90' fill='#fef2f2' stroke='#dc2626'/><text x='245' y='72' fill='#dc2626' font-size='9'>&gt;180°</text><text x='185' y='126' fill='#dc2626'>concave</text></svg>" }
      ],
      common_misconceptions: [
        "Calling a figure with a curved side a polygon — polygons have ONLY straight sides.",
        "Thinking 'regular' just means equal sides — it needs equal ANGLES too (a rhombus has equal sides but is not regular).",
        "Counting a side as a diagonal — diagonals join NON-adjacent vertices only.",
        "Assuming all quadrilaterals are convex — a concave (dart) quadrilateral exists.",
      ],
      shortcuts_and_tricks: [
        "Diagonals fast: n(n−3)/2. (4→2, 5→5, 6→9, 8→20.)",
        "Convex test: if any diagonal goes OUTSIDE the figure, it's concave.",
        "Regular = equal sides AND equal angles — both, always.",
      ],
      when_to_use_this_method: "Use classification language to describe and identify polygons in geometry questions, and the diagonal formula whenever asked 'how many diagonals' for an n-gon.",
      edge_cases: [
        "A triangle (n=3) has 3(0)/2 = 0 diagonals.",
        "Every triangle is convex; concavity only begins at quadrilaterals.",
        "A square is a regular quadrilateral; an equilateral triangle is a regular triangle.",
      ],
      key_takeaway: "Polygons are closed straight-sided figures named by side count. Classify by convex/concave (any angle > 180°?) and regular/irregular (all sides AND angles equal?). Diagonals of an n-gon = n(n−3)/2.",
      video_script_hooks: [
        "Opening: 'A stop sign, a football pitch, a slice of pizza — all polygons. Today we learn to sort them.'",
        "Mid: 'Why n(n−3)/2 diagonals? From each corner you can't draw to yourself or your two neighbours — and every diagonal gets counted twice.'",
        "Closing: 'Equal sides isn't enough to be regular — a rhombus proves it. You need equal angles too.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch3_angle_sum_property",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "Angle Sum Properties of Polygons",
    prerequisite_knowledge: [
      "Angle sum of a triangle = 180°",
      "Interior and exterior angles at a vertex (they form a linear pair, summing 180°)",
      "Polygons and number of sides",
      "Dividing a polygon into triangles",
    ],
    key_formulas: [
      "Sum of interior angles of an n-gon = (n − 2) × 180°",
      "Sum of exterior angles of any convex polygon = 360°",
      "Each interior angle of a REGULAR n-gon = (n − 2) × 180° / n",
      "Each exterior angle of a regular n-gon = 360° / n",
    ],
    teaching_content: {
      intuition: "Cut any polygon into triangles from one corner — each triangle holds 180°. An n-sided polygon splits into (n − 2) triangles, so its angles add to (n − 2) × 180°. Even more elegant: if you walk once around the outside of any convex polygon, you make exactly one full turn — 360° — so the exterior angles always sum to 360°, no matter how many sides.",
      derivation: "Interior sum. Pick one vertex of an n-gon and draw diagonals to all non-adjacent vertices. This cuts the polygon into (n − 2) triangles. Each triangle's angles sum to 180°, and together they tile all the interior angles, so the total = (n − 2) × 180°.\n\nExterior sum. At each vertex, interior + exterior = 180° (linear pair). Summing over n vertices: (sum of interiors) + (sum of exteriors) = n × 180°. So sum of exteriors = n×180° − (n−2)×180° = 2×180° = 360°.",
      worked_example: "Find each interior angle of a regular pentagon.\n\nInterior sum = (5 − 2) × 180° = 540°.\nRegular ⟹ all 5 angles equal ⟹ each = 540°/5 = 108°.\nCheck via exterior: each exterior = 360°/5 = 72°, and 180° − 72° = 108°. ✓",
      visual_description: "A pentagon with diagonals from one vertex splitting it into 3 triangles, each labelled 180°, summing to 540°. Alongside, a small figure of a person walking the perimeter turning by the exterior angle at each corner, totalling one 360° loop.",
      svg_diagrams: [
        { title: "Pentagon split into 3 triangles → 540°",
          svg_code: "<svg viewBox='0 0 200 140' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><polygon points='100,15 170,65 145,135 55,135 30,65' fill='#eff6ff' stroke='#2563eb'/><line x1='100' y1='15' x2='145' y2='135' stroke='#94a3b8'/><line x1='100' y1='15' x2='55' y2='135' stroke='#94a3b8'/><text x='90' y='60'>180</text><text x='95' y='100'>180</text><text x='70' y='110'>180</text><text x='55' y='15' fill='#16a34a'>sum=540°</text></svg>" }
      ],
      common_misconceptions: [
        "Using n × 180° instead of (n − 2) × 180° for the interior sum.",
        "Thinking the exterior-angle sum depends on the number of sides — it's always 360° for any convex polygon.",
        "Dividing the interior sum by the wrong number for a regular polygon (divide by n, the number of angles).",
        "Confusing interior and exterior angle at a vertex — they add to 180°.",
      ],
      shortcuts_and_tricks: [
        "Number of sides from each exterior angle: n = 360° / (exterior angle).",
        "Each interior angle of a regular n-gon = 180° − (360°/n) — often faster than (n−2)180°/n.",
        "Quick: triangle 180°, quad 360°, pentagon 540°, hexagon 720° (each side adds 180°).",
      ],
      when_to_use_this_method: "Use the interior-sum formula to find a missing angle in any polygon; use the exterior = 360° fact (and 360°/n) for regular-polygon and 'how many sides' problems.",
      edge_cases: [
        "Quadrilateral: (4−2)×180° = 360° — confirms the familiar four-angle sum.",
        "If a regular polygon's exterior angle doesn't divide 360° evenly, no such regular polygon exists.",
        "The 360° exterior rule is stated for CONVEX polygons.",
      ],
      key_takeaway: "Interior angles of an n-gon sum to (n−2)×180°; exterior angles of any convex polygon sum to 360°. For a regular n-gon, each interior = (n−2)180°/n and each exterior = 360°/n. Use n = 360°/exterior to find the number of sides.",
      video_script_hooks: [
        "Opening: 'Cut any polygon into triangles and you unlock its angle sum instantly. Watch.'",
        "Mid: 'Walk once around the outside of any shape — you turn through exactly 360°. That's why exterior angles always add to 360.'",
        "Closing: 'Know one exterior angle of a regular polygon? Divide it into 360 and you've found how many sides it has.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch3_kinds_of_quadrilaterals",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "Kinds of Quadrilaterals",
    prerequisite_knowledge: [
      "Quadrilateral = 4-sided polygon; angle sum 360°",
      "Parallel and perpendicular lines",
      "Equal sides and equal angles (tick/arc notation)",
      "Diagonals of a quadrilateral",
    ],
    key_formulas: [
      "Trapezium: exactly one pair of parallel sides",
      "Parallelogram: both pairs of opposite sides parallel",
      "Rhombus: parallelogram with all four sides equal",
      "Rectangle: parallelogram with all angles 90°; Square: rectangle with all sides equal; Kite: two pairs of adjacent equal sides",
    ],
    teaching_content: {
      intuition: "All quadrilaterals are cousins in one family tree. Add 'one pair of parallel sides' and you get a trapezium; make BOTH pairs parallel and it's a parallelogram. From the parallelogram, equal sides give a rhombus, right angles give a rectangle, and BOTH together give the king of quadrilaterals — the square. A kite is the odd cousin: two pairs of adjacent equal sides, no parallel requirement.",
      derivation: "The hierarchy (each is a special case of the one above):\nQuadrilateral → Trapezium (1 pair parallel) → Parallelogram (2 pairs parallel) → {Rhombus (4 equal sides), Rectangle (4 right angles)} → Square (both).\nThis is why 'a square is a rectangle and a rhombus and a parallelogram' — it inherits all their properties. The classification is built by ADDING one constraint at a time.",
      worked_example: "A quadrilateral has both pairs of opposite sides parallel, all sides equal, but its angles are 70° and 110° (not 90°). Name it.\n\nBoth pairs parallel → parallelogram. All sides equal → rhombus. Angles not 90° → it is NOT a rectangle or square.\nSo it is a RHOMBUS (a non-square rhombus).",
      visual_description: "A family-tree diagram: 'Quadrilateral' at the top branching to Trapezium, then Parallelogram, which splits to Rhombus and Rectangle, both feeding into Square at the bottom. Kite hangs off to the side from Quadrilateral. Each node shows its defining marks (parallel arrows, equal-side ticks, right-angle squares).",
      svg_diagrams: [
        { title: "The quadrilateral family tree",
          svg_code: "<svg viewBox='0 0 320 150' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><text x='120' y='15'>Quadrilateral</text><text x='130' y='45'>Trapezium</text><text x='120' y='75'>Parallelogram</text><text x='60' y='105'>Rhombus</text><text x='190' y='105'>Rectangle</text><text x='135' y='140'>Square</text><line x1='150' y1='18' x2='150' y2='38' stroke='#333'/><line x1='150' y1='48' x2='150' y2='68' stroke='#333'/><line x1='140' y1='78' x2='90' y2='98' stroke='#333'/><line x1='160' y1='78' x2='210' y2='98' stroke='#333'/><line x1='90' y1='108' x2='150' y2='133' stroke='#333'/><line x1='210' y1='108' x2='160' y2='133' stroke='#333'/></svg>" }
      ],
      common_misconceptions: [
        "Thinking a square is 'not a rectangle' — it IS a special rectangle (and a special rhombus).",
        "Calling any 4-sided figure with a slanted look a trapezium without checking for exactly one parallel pair.",
        "Believing a rhombus must have right angles — it need not; that would make it a square.",
        "Confusing a kite with a rhombus — a kite has two pairs of ADJACENT equal sides, not all four equal.",
      ],
      shortcuts_and_tricks: [
        "Go down the tree by adding constraints: parallel → equal sides/right angles → both = square.",
        "A square satisfies EVERY quadrilateral definition above it — handy for true/false questions.",
        "Kite ≠ parallelogram: its equal sides are adjacent, and only one diagonal bisects the other.",
      ],
      when_to_use_this_method: "Use the hierarchy to NAME a quadrilateral from given properties, and to decide which properties a named shape must have (inheritance from parents in the tree).",
      edge_cases: [
        "A parallelogram with one right angle is automatically a rectangle (all become 90°).",
        "A rhombus with one right angle is automatically a square.",
        "Some textbooks define trapezium as 'at least one' pair parallel — then a parallelogram is a trapezium too; AP SSC uses 'exactly one'.",
      ],
      key_takeaway: "Quadrilaterals form a hierarchy by adding constraints: trapezium (1 parallel pair) → parallelogram (2 pairs) → rhombus (equal sides) / rectangle (right angles) → square (both). A kite (2 adjacent equal-side pairs) sits separately. Lower shapes inherit all properties of higher ones.",
      video_script_hooks: [
        "Opening: 'Is a square a rectangle? Most people say no. They're wrong — and the family tree shows why.'",
        "Mid: 'Start with any quadrilateral and add one rule at a time. Each rule promotes it to a fancier shape.'",
        "Closing: 'The square is the overachiever — it's a parallelogram, a rhombus AND a rectangle, all at once.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch3_parallelogram_properties",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "Properties of a Parallelogram",
    prerequisite_knowledge: [
      "Definition of a parallelogram (both pairs of opposite sides parallel)",
      "Parallel lines cut by a transversal (alternate angles equal)",
      "Congruent triangles (to justify the properties)",
      "Diagonals of a quadrilateral",
    ],
    key_formulas: [
      "Opposite sides of a parallelogram are equal",
      "Opposite angles are equal; adjacent angles are supplementary (sum 180°)",
      "Diagonals bisect each other (cut at their midpoints)",
      "Special: rectangle → equal diagonals; rhombus → diagonals perpendicular; square → both",
    ],
    teaching_content: {
      intuition: "A parallelogram is a 'pushed-over rectangle'. Because its opposite sides run parallel forever, they're forced to be equal in length, its opposite corners must match in angle, and its two diagonals always slice each other exactly in half. These four properties are the workhorses of almost every quadrilateral proof and angle-chase.",
      derivation: "Opposite sides equal. Draw a diagonal of parallelogram ABCD. The diagonal and the two pairs of parallel sides create alternate-equal angles, making the two triangles congruent (ASA). Corresponding sides of congruent triangles are equal ⟹ opposite sides equal.\n\nDiagonals bisect each other. The two diagonals create triangles that are congruent (using opposite sides equal + alternate angles), so each diagonal is cut into two equal halves at the intersection point.\n\nAdjacent angles supplementary: co-interior angles between parallel sides sum to 180°.",
      worked_example: "In parallelogram ABCD, ∠A = 70°. Find ∠B, ∠C, ∠D.\n\n∠C = ∠A = 70° (opposite angles equal).\n∠B = 180° − 70° = 110° (adjacent angles supplementary).\n∠D = ∠B = 110° (opposite angles equal).\nCheck: 70 + 110 + 70 + 110 = 360°. ✓",
      visual_description: "Parallelogram ABCD with opposite sides marked with matching arrows (parallel) and single/double ticks (equal). Both diagonals drawn, meeting at O, with the four half-diagonals tick-marked equal. Opposite angles marked with matching arcs.",
      svg_diagrams: [
        { title: "Parallelogram: equal opposite sides, bisecting diagonals",
          svg_code: "<svg viewBox='0 0 240 130' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><polygon points='40,100 150,100 200,30 90,30' fill='#eff6ff' stroke='#2563eb'/><line x1='40' y1='100' x2='200' y2='30' stroke='#94a3b8'/><line x1='150' y1='100' x2='90' y2='30' stroke='#94a3b8'/><circle cx='120' cy='65' r='3' fill='#dc2626'/><text x='30' y='114'>A</text><text x='150' y='114'>B</text><text x='200' y='25'>C</text><text x='80' y='25'>D</text><text x='124' y='62' font-size='9' fill='#dc2626'>O</text></svg>" }
      ],
      common_misconceptions: [
        "Thinking the diagonals are EQUAL in every parallelogram — they're equal only in a rectangle/square.",
        "Thinking diagonals are PERPENDICULAR in every parallelogram — only in a rhombus/square.",
        "Confusing 'bisect each other' (always true) with 'bisect the angles' (only rhombus/square).",
        "Assuming adjacent angles are equal — they're supplementary (sum 180°), not equal (unless rectangle).",
      ],
      shortcuts_and_tricks: [
        "Know one angle → all four: opposite equal, adjacent = 180° − it.",
        "'Bisect each other' for ALL parallelograms; add 'equal' for rectangle, 'perpendicular' for rhombus.",
        "Use the diagonals-bisect property to find midpoints and unknown segment lengths instantly.",
      ],
      when_to_use_this_method: "Use these properties to find unknown sides, angles and diagonal segments in parallelogram problems, and to prove a given quadrilateral IS a parallelogram (show any one sufficient condition, e.g. diagonals bisect each other).",
      edge_cases: [
        "If the diagonals are equal AND bisect each other → rectangle. If perpendicular AND bisect → rhombus. Both → square.",
        "A quadrilateral with one pair of sides both parallel AND equal is automatically a parallelogram.",
        "The diagonals divide a parallelogram into two pairs of congruent triangles (and 4 equal-area triangles).",
      ],
      key_takeaway: "In any parallelogram: opposite sides equal, opposite angles equal, adjacent angles supplementary, and diagonals bisect each other. Extra diagonal properties distinguish the specials — equal (rectangle), perpendicular (rhombus), both (square).",
      video_script_hooks: [
        "Opening: 'Tell me one angle of a parallelogram and I'll tell you all four — and where its diagonals cross.'",
        "Mid: 'Why do the diagonals always cut each other in half? Two congruent triangles say so.'",
        "Closing: 'Equal diagonals? It's a rectangle. Perpendicular diagonals? A rhombus. Both? You've found the square.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch3 (Understanding Quadrilaterals): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
