/**
 * AP SSC Class 9 Mathematics — Chapter 5: Introduction to Euclid's Geometry
 * 2 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch05.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     5-A  Euclid's Definitions, Axioms and Postulates
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch5_euclid_definitions_axioms",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Euclid's Definitions, Axioms and Postulates",
    prerequisite_knowledge: [
      "Basic geometric shapes: point, line, line segment, ray, angle",
      "Concept of a mathematical proof",
      "Understanding definitions as precise descriptions",
      "Familiarity with basic plane geometry from earlier classes"
    ],
    key_formulas: [
      "Euclid's Postulate 1: A straight line can be drawn from any one point to any other point",
      "Euclid's Postulate 2: A terminated line (segment) can be produced indefinitely",
      "Euclid's Postulate 3: A circle can be drawn with any centre and any radius",
      "Euclid's Postulate 4: All right angles are equal to one another",
      "Euclid's Postulate 5 (Parallel Postulate): see next topic",
      "Euclid's Axiom 1: Things which are equal to the same thing are equal to one another",
      "Euclid's Axiom 6: Things which are double of the same things are equal to one another"
    ],
    teaching_content: {
      intuition: "Euclid (around 300 BCE) did something revolutionary: he decided to build all of geometry from scratch using only a few starting assumptions that everyone could agree on. He called his basic assumptions 'postulates' (specific to geometry) and 'axioms' (common to all mathematics). From these, he derived hundreds of theorems using pure logical reasoning — not measurements, not experiments. His book 'Elements' is the most successful textbook in history, used for over 2000 years.",
      derivation: "Euclid's system structure:\n\n1. DEFINITIONS — descriptions of geometric objects (not proved):\n   • A point has no part (no dimension)\n   • A line has length but no breadth (one dimension)\n   • A straight line lies evenly with itself\n   • A surface has length and breadth only (two dimensions)\n   • A boundary of a surface is a line\n\n2. AXIOMS (common notions) — self-evident truths about all mathematics:\n   • If A = B and B = C, then A = C (transitivity)\n   • If equals are added to equals, the wholes are equal (a=b → a+c = b+c)\n   • If equals are subtracted from equals, the remainders are equal\n   • Things which coincide with one another are equal\n   • The whole is greater than the part\n\n3. POSTULATES — geometry-specific assumptions:\n   Five postulates (see key formulas). Everything else is proved.",
      worked_example: "Using Euclid's axioms to prove:\n\nProve: If AC = BD and AC = 10, then BD = 10.\nBy Axiom 1 (things equal to the same thing are equal), if AC = BD and AC = 10, then BD = 10. ✓\n\nProve: Two distinct points determine exactly one line.\nBy Postulate 1, a line can be drawn through any two points. Euclid assumed this line is unique (the 'straight' in 'straight line' implies uniqueness). Hence two distinct points determine exactly one line.\n\nProve: An equilateral triangle can be constructed on any line segment AB.\nStep 1: Draw circle with centre A, radius AB (Postulate 3).\nStep 2: Draw circle with centre B, radius BA (Postulate 3).\nStep 3: Let C be an intersection of the two circles.\nStep 4: AC = AB (radii of first circle); BC = BA (radii of second circle).\nStep 5: AC = BC = AB → triangle ABC is equilateral. (This is Proposition 1 of Euclid's Elements.)",
      visual_description: "Draw a hierarchy diagram: at the top 'Euclid's System'. Three branches: 'Definitions' (point, line, plane, circle — described but not proved), 'Axioms/Common Notions' (equality properties — universal), 'Postulates' (5 geometric assumptions). Arrow from these pointing down to 'Theorems — proved by logical deduction'.",
      svg_diagrams: [
        {
          title: "Euclid's axiomatic system: definitions → axioms/postulates → theorems",
          svg_code: "<svg viewBox='0 0 320 180' xmlns='http://www.w3.org/2000/svg'><rect x='100' y='5' width='120' height='28' rx='6' fill='#1565C0'/><text x='160' y='24' text-anchor='middle' font-size='11' fill='white' font-weight='bold'>Euclid's System</text><line x1='160' y1='33' x2='60' y2='65' stroke='#555' stroke-width='1.5'/><line x1='160' y1='33' x2='160' y2='65' stroke='#555' stroke-width='1.5'/><line x1='160' y1='33' x2='265' y2='65' stroke='#555' stroke-width='1.5'/><rect x='5' y='65' width='110' height='30' rx='5' fill='#4CAF50'/><text x='60' y='84' text-anchor='middle' font-size='10' fill='white'>Definitions</text><rect x='105' y='65' width='110' height='30' rx='5' fill='#FF9800'/><text x='160' y='81' text-anchor='middle' font-size='10' fill='white'>Axioms /</text><text x='160' y='92' text-anchor='middle' font-size='10' fill='white'>Common Notions</text><rect x='220' y='65' width='95' height='30' rx='5' fill='#E91E63'/><text x='267' y='84' text-anchor='middle' font-size='10' fill='white'>Postulates</text><line x1='60' y1='95' x2='160' y2='135' stroke='#555' stroke-width='1.2'/><line x1='160' y1='95' x2='160' y2='135' stroke='#555' stroke-width='1.2'/><line x1='267' y1='95' x2='160' y2='135' stroke='#555' stroke-width='1.2'/><rect x='70' y='135' width='180' height='35' rx='6' fill='#7B1FA2'/><text x='160' y='151' text-anchor='middle' font-size='11' fill='white'>Theorems</text><text x='160' y='165' text-anchor='middle' font-size='9' fill='#CE93D8'>(proved by logic)</text></svg>"
        }
      ],
      common_misconceptions: [
        "Confusing 'axiom' and 'postulate': axioms are universal mathematical truths; postulates are geometry-specific assumptions. Both are accepted without proof.",
        "Thinking definitions prove properties — definitions only name/describe. Proofs come from postulates and axioms.",
        "Assuming Euclid's geometry is the only geometry — Non-Euclidean geometries (spherical, hyperbolic) replace Postulate 5, giving different but internally consistent systems.",
        "Thinking 'a point has no part' means points don't exist — it is a mathematical idealisation, like frictionless surfaces in physics."
      ],
      shortcuts_and_tricks: [
        "Axiom 1 (transitivity of equality) is used in almost every proof: if a = b and b = c, then a = c.",
        "Postulates 1-4 are almost obvious. Postulate 5 (parallel postulate) is the interesting one — it cannot be derived from 1-4.",
        "Remember: 5 postulates, 7 common notions. Postulates are specific; axioms are universal.",
        "For exam questions about Euclid: identify whether the statement is a definition, axiom, or postulate. If self-evident and geometric → postulate. If about equality/quantity → axiom."
      ],
      when_to_use_this_method: "Reference Euclid's axioms whenever a geometry proof requires justifying a step involving equality, addition/subtraction of equals, or the relation 'whole > part'. Reference postulates when constructing lines, circles, or right angles.",
      edge_cases: [
        "Euclid's definition of a 'point' is circular — he defines it but uses undefined terms. Modern mathematics starts from undefined primitives (point, line, plane) and lists their properties as axioms.",
        "Postulate 2 says a line segment can be extended — but not infinitely in the modern sense; Euclid meant 'as far as needed'.",
        "Axiom 5 ('The whole is greater than the part') does not hold for infinite sets — an infinite set can be put in 1-1 correspondence with a proper subset of itself."
      ],
      key_takeaway: "Euclid built geometry on definitions (descriptions), axioms (universal equalities), and 5 postulates (geometric assumptions). Everything else is proved by logical deduction. This axiomatic method is the foundation of all modern mathematics.",
      video_script_hooks: [
        "Opening: 'In 300 BCE, one man decided to prove every geometric fact from scratch. No measurements. No experiments. Just logic. Euclid's Elements was the world's most used mathematics textbook for 2000 years.'",
        "Mid-lesson: 'Five postulates. That is all. Five statements accepted without proof. From those five, Euclid derived 465 propositions. Five assumptions → 465 results. That is the power of axiomatic mathematics.'",
        "Closing: 'Every step in a geometry proof must be justified by a definition, axiom, or a previously proved theorem. That discipline — justifying every step — is what separates mathematics from guessing.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     5-B  Euclid's Fifth Postulate and Equivalent Versions
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch5_fifth_postulate",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Euclid's Fifth Postulate and Parallel Lines",
    prerequisite_knowledge: [
      "Euclid's first four postulates",
      "Concept of parallel lines: lines that never meet",
      "Interior angles formed when a transversal cuts two lines",
      "Sum of angles on a straight line = 180°"
    ],
    key_formulas: [
      "Euclid's Postulate 5: If a straight line falling on two straight lines makes the interior angles on the same side less than two right angles (180°), the two straight lines, if produced indefinitely, meet on that side",
      "Equivalent (Playfair's Axiom): For a given line l and a point P not on l, there exists exactly one line through P parallel to l",
      "Parallel lines: two lines are parallel ⟺ they do not meet (in Euclidean geometry)",
      "Corollary: If a transversal makes equal alternate interior angles with two lines, those lines are parallel"
    ],
    teaching_content: {
      intuition: "Euclid's fifth postulate is different from the other four — it is long, complicated, and not obviously self-evident. For 2000 years, mathematicians tried to prove it from the other four postulates, believing it shouldn't need to be assumed. They all failed. Eventually (19th century), mathematicians discovered why: you can build perfectly consistent geometries WITHOUT the fifth postulate. On the surface of a sphere, two lines (great circles) always meet — parallel lines don't exist! The fifth postulate is what makes geometry 'flat' (Euclidean).",
      derivation: "Playfair's Axiom (modern equivalent of Postulate 5):\n\n'Through a given point P not on a line l, there is exactly one line parallel to l.'\n\nThis is simpler to state than Euclid's original and equivalent to it.\n\nWhy does this matter?\n• 'Exactly one' → Euclidean (flat) geometry\n• 'None' → Spherical geometry (surface of a globe; all 'straight lines' = great circles that must meet)\n• 'More than one' → Hyperbolic geometry (saddle-shaped; multiple parallels exist)\n\nEach choice gives a different, self-consistent geometry. The fifth postulate decides which world you live in.",
      worked_example: "Using Postulate 5 / Playfair's Axiom:\n\n(i) Given line l: y = 0 (x-axis). Point P = (3, 4). Find the unique parallel through P.\n    The x-axis is horizontal (slope 0). The unique parallel through P with slope 0 is y = 4.\n\n(ii) Two lines are cut by a transversal. Interior angles on the same side = 70° and 100°.\n    Sum = 170° < 180°. By Postulate 5, the lines meet on the side with 70°+100° = 170°.\n\n(iii) Two lines are cut by a transversal. Interior angles on same side = 90° and 90°.\n    Sum = 180°. By the contrapositive of Postulate 5, the lines do not meet → they are parallel.\n    (This is the standard result: co-interior angles supplementary → parallel lines.)",
      visual_description: "Draw a line l and a point P above it. Show three lines through P: one meeting l to the left, one meeting l to the right, and the unique one that is parallel (never meeting). Label the parallel line as 'the one and only parallel through P (Playfair's Axiom)'. Separately draw a transversal cutting two parallel lines, showing co-interior angles summing to 180°.",
      svg_diagrams: [
        {
          title: "Playfair's Axiom: unique parallel through external point P",
          svg_code: "<svg viewBox='0 0 300 160' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='130' x2='280' y2='130' stroke='#1565C0' stroke-width='2'/><text x='230' y='145' font-size='11' fill='#1565C0'>line l</text><circle cx='150' cy='50' r='4' fill='#E91E63'/><text x='155' y='48' font-size='11' fill='#E91E63'>P</text><line x1='20' y1='50' x2='280' y2='50' stroke='#4CAF50' stroke-width='2.5'/><text x='215' y='44' font-size='10' fill='#4CAF50'>unique parallel</text><line x1='100' y1='20' x2='180' y2='140' stroke='#FF9800' stroke-width='1.5' stroke-dasharray='5,3'/><line x1='200' y1='20' x2='120' y2='140' stroke='#FF9800' stroke-width='1.5' stroke-dasharray='5,3'/><text x='165' y='30' font-size='9' fill='#FF9800'>lines that</text><text x='158' y='42' font-size='9' fill='#FF9800'>meet l</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking the fifth postulate is obviously true — it took 2000 years of failure to prove it (or replace it) before mathematicians accepted it as an independent assumption.",
        "Confusing 'parallel lines never meet' with a theorem — in Euclidean geometry, this is a consequence of Postulate 5, not separately provable without it.",
        "Thinking non-Euclidean geometry is wrong — it is simply geometry on a curved surface (sphere, saddle). GPS and general relativity use non-Euclidean geometry.",
        "Mixing up Euclid's original Postulate 5 (interior angles < 180°) with Playfair's Axiom (unique parallel). Both are equivalent but stated very differently."
      ],
      shortcuts_and_tricks: [
        "For Class 9 exams: 'Postulate 5' means 'lines meet if co-interior angles sum < 180°; parallel if they sum = 180°'. This is what boards test.",
        "Playfair's version is easier to apply: through P parallel to l, there is exactly one parallel line.",
        "Remember: Postulates 1-4 survived non-Euclidean geometry. Only Postulate 5 was changed. It is the 'special' postulate.",
        "Alternate interior angles equal ↔ lines parallel. Co-interior angles supplementary ↔ lines parallel. These are direct consequences of Postulate 5."
      ],
      when_to_use_this_method: "Invoke Postulate 5 / Playfair's Axiom whenever a proof requires asserting the existence or uniqueness of a parallel line through an external point. Use co-interior angle sum = 180° as the practical test for parallel lines.",
      edge_cases: [
        "On a sphere (non-Euclidean): every pair of great circles meets in two antipodal points. No parallels exist.",
        "In hyperbolic geometry: through P there are infinitely many lines 'parallel' to l (they don't meet l when extended).",
        "In Euclidean geometry, two distinct lines are either parallel (never meet) or intersecting (meet at exactly one point). There is no third option.",
        "A line is parallel to itself — trivially, by definition. Uniqueness in Playfair's Axiom refers to lines other than l itself."
      ],
      key_takeaway: "Postulate 5 (Playfair's version): through a given external point, exactly one line is parallel to a given line. This postulate defines Euclidean (flat) geometry. Without it, spherical and hyperbolic geometries arise. In practice, it gives us: co-interior angles supplementary ↔ parallel lines.",
      video_script_hooks: [
        "Opening: 'For 2000 years, the greatest mathematicians in the world tried to prove Postulate 5 from the other four. They all failed. Then in the 1800s, someone finally understood why: it cannot be proved. It is a fundamental choice about what kind of universe you want.'",
        "Mid-lesson: 'Flat earth? One parallel through any point. Round earth? Zero parallels — great circles always meet. Saddle-shaped universe? Infinite parallels. One postulate. Three different geometries.'",
        "Closing: 'In Class 9, Euclidean is the default. One parallel, flat space. But knowing other options exist changes how you think about geometry — and about mathematics itself.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 5: Introduction to Euclid's Geometry…");
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
