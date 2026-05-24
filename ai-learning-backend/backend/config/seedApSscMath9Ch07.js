/**
 * AP SSC Class 9 Mathematics — Chapter 7: Triangles
 * 3 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch07.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     7-A  Congruence of Triangles
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "Congruence of Triangles",
    prerequisite_knowledge: [
      "Basic properties of triangles: sides, angles, vertices",
      "Angle sum property of a triangle = 180°",
      "Concept of equality of line segments and angles",
      "Corresponding parts of geometric figures"
    ],
    key_formulas: [
      "Two triangles are congruent (△ABC ≅ △DEF) iff all six corresponding parts are equal: AB=DE, BC=EF, CA=FD and ∠A=∠D, ∠B=∠E, ∠C=∠F",
      "CPCT: Corresponding Parts of Congruent Triangles are equal",
      "Congruence is an equivalence relation: reflexive (△≅△), symmetric (△≅△' ⟹ △'≅△), transitive",
      "Order of vertices matters: △ABC ≅ △DEF means A↔D, B↔E, C↔F"
    ],
    teaching_content: {
      intuition: "Two triangles are congruent if they are the same shape and size — one is an exact copy of the other. Imagine cutting out triangle ABC from paper and placing it on triangle DEF. If they match perfectly (possibly after flipping), they are congruent. Every corresponding side is equal, every corresponding angle is equal. The abbreviation CPCT ('Corresponding Parts of Congruent Triangles are equal') is then used to state that once congruence is established, all six pairs of parts are automatically equal.",
      derivation: "Definition of congruence:\nTwo triangles △ABC and △DEF are congruent (written △ABC ≅ △DEF) if and only if:\n  • AB = DE  (corresponding sides)\n  • BC = EF\n  • CA = FD\n  • ∠A = ∠D  (corresponding angles)\n  • ∠B = ∠E\n  • ∠C = ∠F\n\nNote: The order of vertex labels in the congruence statement specifies the correspondence. △ABC ≅ △DEF means vertex A corresponds to D, B to E, C to F. Stating △ABC ≅ △EDF would mean a completely different correspondence.",
      worked_example: "Given △ABC ≅ △PQR where AB=3cm, BC=4cm, AC=5cm, ∠B=90°.\n\nState all corresponding parts:\n  PQ = AB = 3 cm\n  QR = BC = 4 cm\n  PR = AC = 5 cm\n  ∠Q = ∠B = 90°\n  ∠P = ∠A  (not given numerically, but equal)\n  ∠R = ∠C  (not given numerically, but equal)\n\nBy CPCT, all six parts are equal.\n\nVerify: Since ∠Q = 90° and PQ=3, QR=4, then by Pythagoras PR = 5. ✓ (Consistent with PR=AC=5.)\n\nIs it possible that △ABC ≅ △QPR? Only if A↔Q, B↔P, C↔R — check: AB=QP? 3=3 ✓, BC=PR? 4=5 ✗. No.",
      visual_description: "Draw two congruent triangles side by side, one possibly flipped. Mark corresponding sides with tick marks (one tick for shortest, two ticks for medium, three ticks for longest). Mark corresponding angles with arc marks (one arc, two arcs, three arcs). Draw arrows between corresponding vertices to show the matching.",
      svg_diagrams: [
        {
          title: "Two congruent triangles with corresponding parts marked",
          svg_code: "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><polygon points='30,130 80,30 130,130' fill='none' stroke='#1565C0' stroke-width='2'/><text x='22' y='145' font-size='12' fill='#1565C0'>B</text><text x='74' y='24' font-size='12' fill='#1565C0'>A</text><text x='130' y='145' font-size='12' fill='#1565C0'>C</text><line x1='50' y1='83' x2='60' y2='87' stroke='#E91E63' stroke-width='2'/><line x1='54' y1='77' x2='64' y2='81' stroke='#E91E63' stroke-width='2'/><line x1='80' y1='130' x2='80' y2='115' stroke='#4CAF50' stroke-width='2'/><line x1='90' y1='68' x2='100' y2='64' stroke='#FF9800' stroke-width='2'/><polygon points='190,130 240,30 290,130' fill='none' stroke='#1565C0' stroke-width='2'/><text x='182' y='145' font-size='12' fill='#1565C0'>Q</text><text x='234' y='24' font-size='12' fill='#1565C0'>P</text><text x='290' y='145' font-size='12' fill='#1565C0'>R</text><line x1='210' y1='83' x2='220' y2='87' stroke='#E91E63' stroke-width='2'/><line x1='214' y1='77' x2='224' y2='81' stroke='#E91E63' stroke-width='2'/><line x1='240' y1='130' x2='240' y2='115' stroke='#4CAF50' stroke-width='2'/><line x1='250' y1='68' x2='260' y2='64' stroke='#FF9800' stroke-width='2'/><text x='140' y='85' font-size='16' fill='#333'>≅</text></svg>"
        }
      ],
      common_misconceptions: [
        "Writing △ABC ≅ △FED and assuming A↔F, B↔E, C↔D — but then mixing up which sides are corresponding when computing. Always read vertex order carefully.",
        "Thinking congruent triangles must face the same direction — congruent triangles can be mirror images (reflections) of each other.",
        "Using CPCT before establishing congruence — CPCT can only be invoked AFTER proving the triangles are congruent. It is a consequence, not a starting point.",
        "Confusing congruence (same size AND shape) with similarity (same shape, possibly different size)."
      ],
      shortcuts_and_tricks: [
        "When writing a congruence statement, list vertices in order of correspondence. If A↔P, B↔Q, C↔R, write △ABC ≅ △PQR.",
        "After proving △ABC ≅ △DEF, immediately list all six CPCT consequences — even those not asked for. They often appear in part (ii) of the question.",
        "Check congruence quickly: if all three sides are equal (SSS), the triangles must be congruent. No need to check angles separately.",
        "When a diagram has a shared side or vertex, that is often the 'free' equal part in an SAS or ASA congruence proof."
      ],
      when_to_use_this_method: "Establish triangle congruence whenever a problem asks to prove two sides or angles equal in a geometric figure. Recognise which congruence criterion applies (SAS, ASA, SSS, AAS, RHS — next topic), prove congruence, then use CPCT.",
      edge_cases: [
        "A triangle is always congruent to itself (reflexive property) — useful when a shared side is involved.",
        "△ABC ≅ △ABC is trivially true (identity congruence).",
        "Congruence does not distinguish between a triangle and its mirror image — a reflected triangle is congruent to the original.",
        "Two right triangles with the same hypotenuse and one equal leg are congruent (RHS criterion — next topic)."
      ],
      key_takeaway: "Two triangles are congruent when all six corresponding parts (3 sides + 3 angles) are equal. Write congruence statements with matching vertex order. Use CPCT only after proving congruence. Congruence is the key tool for proving sides or angles equal in any geometric figure.",
      video_script_hooks: [
        "Opening: 'Cut out a triangle. Trace it on paper. The trace is congruent to the original — identical in every measurement. Six parts: three sides, three angles. All six match. That is what congruence means.'",
        "Mid-lesson: 'The order of the letters in △ABC ≅ △PQR is not decoration — it is a map. A goes to P, B goes to Q, C goes to R. Write it wrong and every CPCT step that follows is wrong.'",
        "Closing: 'Prove congruence first. Then CPCT unlocks every corresponding part. Two steps: congruence then consequence. Never reverse the order.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     7-B  Criteria for Congruence: SAS, ASA, SSS, AAS, RHS
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "Criteria for Congruence of Triangles",
    prerequisite_knowledge: [
      "Definition of congruence and CPCT",
      "Corresponding sides and angles of triangles",
      "Types of triangles: isosceles, equilateral, right-angled",
      "Basic properties: angle sum = 180°, Pythagoras theorem (for RHS)"
    ],
    key_formulas: [
      "SAS (Side-Angle-Side): two sides and the included angle equal → congruent",
      "ASA (Angle-Side-Angle): two angles and the included side equal → congruent",
      "AAS (Angle-Angle-Side): two angles and a non-included side equal → congruent",
      "SSS (Side-Side-Side): all three sides equal → congruent",
      "RHS (Right angle-Hypotenuse-Side): right angle + hypotenuse + one side equal → congruent",
      "NOT valid: AAA (three equal angles does NOT guarantee congruence — only similarity)",
      "NOT valid: SSA (two sides and a non-included angle does NOT guarantee congruence in general)"
    ],
    teaching_content: {
      intuition: "You do not need to check all six parts to confirm congruence. Just three parts — but the right three — are enough. Think of building a triangle: if you fix two sides and the angle between them, there is only one triangle possible (SAS). If you fix two angles and the side between them, there is only one triangle possible (ASA). That is why these criteria work: the fixed information completely determines the triangle, leaving no room for a different-sized copy.",
      derivation: "Why SSS works (intuitive argument):\nGiven △ABC and △DEF with AB=DE, BC=EF, CA=FD. Place AB along DE so that A coincides with D and B with E. Now C must be at distance CA from A (=FD from D) and distance CB from B (=FE from E). The two circles of those radii around A and B intersect in at most two points (on opposite sides of AB). Both positions give congruent triangles (mirror images). So the triangle is determined up to reflection — congruent in both cases.\n\nWhy AAA does NOT work:\nTwo triangles with all three angles equal can have different side lengths (e.g., a small and a large equilateral triangle both have three 60° angles but different sides). They are similar but not congruent.",
      worked_example: "State which criterion applies and prove congruence:\n\n(i) In quadrilateral ABCD, AB=CD and AB∥CD. Show △AOB ≅ △COD (O = diagonals' intersection).\n    ∠OAB = ∠OCD (alternate interior, AB∥CD)\n    ∠OBA = ∠ODC (alternate interior, AB∥CD)\n    AB = CD (given)\n    By AAS: △AOB ≅ △COD. ✓\n\n(ii) △ABC isosceles with AB=AC. AD⊥BC. Show △ABD ≅ △ACD.\n    AB = AC (given)\n    AD = AD (common)\n    ∠ADB = ∠ADC = 90° (AD⊥BC)\n    By RHS: △ABD ≅ △ACD. ✓\n    By CPCT: BD = CD → D is the midpoint of BC.\n\n(iii) △PQR: PQ=PR, S is midpoint of QR. Show △PQS ≅ △PRS.\n    PQ = PR, QS = RS, PS = PS (common)\n    By SSS: △PQS ≅ △PRS. ✓",
      visual_description: "Draw five diagrams, one per criterion. For SAS: mark two sides with tick marks and the included angle with an arc. For ASA: mark two angles and the included side. For SSS: mark all three sides. For AAS: two angles and a non-included side. For RHS: mark the right angle box, hypotenuse (double tick), and one leg (single tick). Label each diagram with its criterion name.",
      svg_diagrams: [
        {
          title: "Five congruence criteria: SAS, ASA, SSS, AAS, RHS with marked parts",
          svg_code: "<svg viewBox='0 0 340 180' xmlns='http://www.w3.org/2000/svg'><text x='170' y='16' text-anchor='middle' font-size='13' fill='#1565C0' font-weight='bold'>Congruence Criteria</text><polygon points='10,80 40,30 70,80' fill='none' stroke='#333' stroke-width='1.5'/><text x='40' y='100' text-anchor='middle' font-size='10' fill='#E91E63' font-weight='bold'>SAS</text><line x1='22' y1='58' x2='30' y2='54' stroke='#E91E63' stroke-width='2'/><line x1='56' y1='58' x2='50' y2='54' stroke='#E91E63' stroke-width='2'/><path d='M 34 38 A 8 8 0 0 1 46 38' fill='none' stroke='#4CAF50' stroke-width='1.5'/><polygon points='85,80 115,30 145,80' fill='none' stroke='#333' stroke-width='1.5'/><text x='115' y='100' text-anchor='middle' font-size='10' fill='#E91E63' font-weight='bold'>ASA</text><path d='M 92 70 A 8 8 0 0 1 104 66' fill='none' stroke='#4CAF50' stroke-width='1.5'/><path d='M 138 70 A 8 8 0 0 0 126 66' fill='none' stroke='#4CAF50' stroke-width='1.5'/><line x1='105' y1='80' x2='115' y2='80' stroke='#E91E63' stroke-width='2'/><polygon points='160,80 190,30 220,80' fill='none' stroke='#333' stroke-width='1.5'/><text x='190' y='100' text-anchor='middle' font-size='10' fill='#E91E63' font-weight='bold'>SSS</text><line x1='170' y1='58' x2='178' y2='54' stroke='#E91E63' stroke-width='2'/><line x1='206' y1='58' x2='200' y2='54' stroke='#E91E63' stroke-width='2'/><line x1='185' y1='80' x2='195' y2='80' stroke='#FF9800' stroke-width='2'/><polygon points='235,80 265,30 295,80' fill='none' stroke='#333' stroke-width='1.5'/><text x='265' y='100' text-anchor='middle' font-size='10' fill='#E91E63' font-weight='bold'>RHS</text><rect x='252' y='68' width='8' height='8' fill='none' stroke='#4CAF50' stroke-width='1.5'/><line x1='257' y1='57' x2='279' y2='57' stroke='#E91E63' stroke-width='2'/><line x1='262' y1='57' x2='265' y2='62' stroke='#E91E63' stroke-width='1.5'/></svg>"
        }
      ],
      common_misconceptions: [
        "Using AAA to prove congruence — three equal angles only proves similarity, not congruence. A small and large equilateral triangle have all 60° angles but are not congruent.",
        "Using SSA (Side-Side-Angle, non-included angle) — this is not a valid criterion in general. It can give two different triangles (the 'ambiguous case').",
        "Confusing 'included angle' in SAS: the angle must be BETWEEN the two given sides. If it's not the included angle, SAS does not apply.",
        "Applying RHS without first confirming there is a right angle — RHS only works for right-angled triangles."
      ],
      shortcuts_and_tricks: [
        "Common side or angle in a diagram: the shared side (e.g., AC in △ABC and △ACD) is automatically equal to itself — write it as 'AC is common' or 'AC = AC (common)'.",
        "Parallel lines → alternate angles: whenever you see parallel lines, immediately look for alternate interior angles as free equal parts.",
        "Isosceles triangle given: automatically write the two base angles equal, and the two equal sides equal.",
        "Right angle at the foot of a perpendicular: if PD⊥QR, then ∠PDQ = ∠PDR = 90° — free right angles for RHS."
      ],
      when_to_use_this_method: "Identify which criterion fits by counting what is given: three sides → SSS; two sides and included angle → SAS; two angles and included side → ASA; two angles and any side → AAS; right angle, hypotenuse, one side → RHS. Choose the criterion that matches the given information.",
      edge_cases: [
        "When a side is shared between two triangles in the same figure, it counts as an equal pair for any criterion.",
        "In a right triangle, if hypotenuse and one acute angle are given, the triangle is fully determined (AAS applies: right angle + acute angle + hypotenuse).",
        "SSA is invalid in general but valid in the specific case of RHS — the right angle eliminates the ambiguity.",
        "Two right triangles: if both hypotenuses AND both sets of legs are equal, use SSS or RHS (both work)."
      ],
      key_takeaway: "Five valid criteria: SAS, ASA, AAS, SSS, RHS. Use the criterion that matches what is given. Invalid: AAA (proves similarity only) and SSA (ambiguous). Shared sides or angles, parallel line angle pairs, and perpendicular feet provide 'free' equal parts. After proving congruence, use CPCT for all subsequent equal parts.",
      video_script_hooks: [
        "Opening: 'You need six equal parts to define two congruent triangles. But you only need to CHECK three of them — the right three. That economy of effort is the entire point of congruence criteria.'",
        "Mid-lesson: 'SAS: side, THEN angle, THEN side. The angle must be squeezed between the two sides. If the angle is not between them, SAS does not apply — that is the SSA trap.'",
        "Closing: 'AAA → similar, not congruent. SSA → not reliable. Everything else (SAS, ASA, AAS, SSS, RHS) → fully congruent. Five tools. Know which one fits the given information before you write a single line of proof.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     7-C  Properties and Inequalities in Triangles
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "Properties of Triangles and Triangle Inequalities",
    prerequisite_knowledge: [
      "Congruence criteria: SAS, ASA, SSS, AAS, RHS",
      "Angle sum of a triangle = 180°",
      "Isosceles triangle definition: two equal sides",
      "Linear pair and exterior angle theorem"
    ],
    key_formulas: [
      "Isosceles triangle theorem: AB=AC ⟹ ∠B=∠C (base angles equal)",
      "Converse: ∠B=∠C ⟹ AB=AC",
      "Equilateral triangle: all sides equal ⟺ all angles = 60°",
      "Triangle inequality: sum of any two sides > third side (a+b > c, b+c > a, c+a > b)",
      "Side-angle relationship: larger angle is opposite the longer side",
      "Converse: longer side is opposite the larger angle",
      "Exterior angle > either non-adjacent interior angle"
    ],
    teaching_content: {
      intuition: "Two beautiful symmetries govern triangles. First: equal sides produce equal angles opposite them (isosceles triangle theorem). Second: in any triangle, if one side is longer than another, the angle opposite the longer side is bigger. These two facts connect the geometry (shape, angles) to the measurement (side lengths) of triangles in a tight, logical way. The triangle inequality (any two sides sum to more than the third) is even more fundamental — it is literally the condition for a triangle to exist at all.",
      derivation: "Proof: Isosceles triangle theorem (AB = AC ⟹ ∠B = ∠C).\n\nGiven: △ABC with AB = AC.\nDraw AD, the bisector of ∠A (AD bisects ∠BAC).\n\nIn △ABD and △ACD:\n  AB = AC (given)\n  AD = AD (common)\n  ∠BAD = ∠CAD (AD bisects ∠A)\n\nBy SAS: △ABD ≅ △ACD.\nBy CPCT: ∠ABD = ∠ACD, i.e., ∠B = ∠C. □\n\nAlternatively: draw the perpendicular from A to BC meeting at M. Then △ABM ≅ △ACM by RHS (AB=AC, AM common, right angle at M), giving ∠B = ∠C directly.",
      worked_example: "Applications:\n\n(i) △ABC has AB=AC=8cm, ∠A=50°. Find ∠B and ∠C.\n    ∠B = ∠C (isosceles). ∠B+∠C = 180°−50° = 130°. ∠B = ∠C = 65°.\n\n(ii) In △PQR, ∠P=30°, ∠Q=80°, ∠R=70°. Order sides from smallest to largest.\n    Smallest angle is ∠P=30° → opposite side QR is smallest.\n    Largest angle is ∠Q=80° → opposite side PR is largest.\n    Order: QR < PQ < PR.\n\n(iii) Can a triangle have sides 5, 8, 14?\n    5+8=13 < 14. The triangle inequality fails. NOT possible.\n\n(iv) Can a triangle have sides 6, 8, 11?\n    6+8=14>11 ✓, 6+11=17>8 ✓, 8+11=19>6 ✓. Possible.",
      visual_description: "Draw an isosceles triangle ABC (AB=AC) with the apex at A and base BC. Mark equal sides with tick marks. Mark equal base angles (∠B=∠C) with arcs. Separately draw a scalene triangle with sides labelled a, b, c (a>b>c) and show ∠A>∠B>∠C opposite them. Below, show the triangle inequality geometrically: you cannot form a triangle if one side is too long.",
      svg_diagrams: [
        {
          title: "Isosceles triangle with equal base angles; side-angle inequality",
          svg_code: "<svg viewBox='0 0 300 180' xmlns='http://www.w3.org/2000/svg'><polygon points='80,20 20,150 140,150' fill='none' stroke='#1565C0' stroke-width='2'/><text x='74' y='14' font-size='11' fill='#1565C0'>A</text><text x='8' y='162' font-size='11' fill='#1565C0'>B</text><text x='140' y='162' font-size='11' fill='#1565C0'>C</text><line x1='44' y1='88' x2='52' y2='82' stroke='#E91E63' stroke-width='2'/><line x1='48' y1='93' x2='56' y2='87' stroke='#E91E63' stroke-width='2'/><line x1='108' y1='88' x2='102' y2='82' stroke='#E91E63' stroke-width='2'/><line x1='104' y1='93' x2='98' y2='87' stroke='#E91E63' stroke-width='2'/><path d='M 30 142 A 12 12 0 0 1 42 148' fill='none' stroke='#4CAF50' stroke-width='1.5'/><path d='M 130 142 A 12 12 0 0 0 118 148' fill='none' stroke='#4CAF50' stroke-width='1.5'/><text x='14' y='140' font-size='9' fill='#4CAF50'>∠B</text><text x='126' y='140' font-size='9' fill='#4CAF50'>∠C</text><text x='155' y='90' font-size='10' fill='#333'>AB=AC (✓✓)</text><text x='155' y='105' font-size='10' fill='#4CAF50'>⟹ ∠B=∠C</text><polygon points='220,20 185,150 285,150' fill='none' stroke='#E91E63' stroke-width='2'/><text x='214' y='14' font-size='11' fill='#E91E63'>A</text><text x='174' y='162' font-size='11' fill='#E91E63'>B</text><text x='284' y='162' font-size='11' fill='#E91E63'>C</text><text x='190' y='90' font-size='9' fill='#555'>a (long)</text><text x='248' y='90' font-size='9' fill='#555'>b</text><text x='228' y='160' font-size='9' fill='#555'>c (short)</text></svg>"
        }
      ],
      common_misconceptions: [
        "Assuming isosceles means right-angled — isosceles only means two equal sides. The apex angle can be anything.",
        "Triangle inequality: students check only one combination — must check all three: a+b>c AND b+c>a AND a+c>b.",
        "Thinking the side opposite the LARGEST angle is the SMALLEST side — it is the opposite: largest angle → longest side.",
        "Applying the isosceles theorem before checking that the triangle is indeed isosceles (sides given or proved equal)."
      ],
      shortcuts_and_tricks: [
        "For the triangle inequality exam shortcut: only check the sum of the two SMALLER sides against the largest side. If that holds, the other two automatically hold.",
        "Isosceles triangle: if you see AB = AC in a problem, IMMEDIATELY write ∠B = ∠C. It is a free equal pair every time.",
        "Ordering sides from angles: rank angles (largest to smallest), then the sides opposite them follow the same rank.",
        "Equilateral triangle: if three equal sides appear or three equal angles (60° each) appear, the other three are automatically determined."
      ],
      when_to_use_this_method: "Use the isosceles theorem whenever equal sides are given to get equal angles (or vice versa). Use triangle inequality to check if a triangle can exist, or to find range of a missing side. Use the side-angle relationship to order sides or angles given partial information.",
      edge_cases: [
        "Equilateral triangle is a special case of isosceles (all three sides equal, all three angles = 60°).",
        "A right isosceles triangle: legs equal, angles 45°-45°-90°.",
        "Triangle inequality gives range for unknown side c: |a−b| < c < a+b.",
        "Degenerate triangle (collinear points): a+b = c exactly. Not a triangle but the limiting case where triangle 'flattens' to a line segment."
      ],
      key_takeaway: "Isosceles → two equal sides ↔ two equal base angles (use SAS or RHS to prove). In any triangle, larger angle ↔ longer opposite side. Triangle inequality: any two sides must sum to more than the third — this is the condition for a triangle to exist. These properties are the workhorse theorems of triangle geometry.",
      video_script_hooks: [
        "Opening: 'Can you make a triangle with sticks of length 3, 4, and 10? Try it. The two shorter sticks (3+4=7) don't reach across the longest stick (10). Impossible. The triangle inequality is geometry's reality check.'",
        "Mid-lesson: 'Isosceles triangle — two sides equal, two angles equal. Always. No proof needed every time: just quote the theorem. Equal sides → equal opposite angles. Write it down and move on.'",
        "Closing: 'Larger angle faces the longer side. Smaller angle faces the shorter side. That one sentence lets you order all three sides from the angles, or all three angles from the sides, in any triangle instantly.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 7: Triangles…");
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
