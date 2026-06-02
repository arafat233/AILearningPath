/**
 * enrichMath6.js — v3 enrichment for CBSE Class 6 Math (CONTENT_STATUS Ph8).
 *
 * The 40 `math6_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (audit:math --board=CBSE --grade=6). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition/derivation/worked_example/...):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the NCERT "Ganita Prakash" Grade 6 textbook
 * (C:\...\CBSE 6th class math, fegp101–fegp110 = Ch1–10).
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath6.js            # patch every topic present in ENRICH
 *         node config/enrichMath6.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math6
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math6_ch${args.ch}_` : null;

// Small helper to keep SVGs compact + valid. Each is a clean, self-contained
// diagram matching the topic's visual_description.
function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

const ENRICH = {
  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 1 — Patterns in Mathematics
  // ───────────────────────────────────────────────────────────────────────────
  math6_ch1_number_patterns: {
    key_formulas: [
      { formula: "Odd numbers: 1, 3, 5, 7, … the nth odd number is 2n − 1", explanation: "Each term jumps by 2." },
      { formula: "Triangular numbers: 1, 3, 6, 10, … = n(n+1)/2", explanation: "Add 1, then 2, then 3, …" },
      { formula: "Squares n² and cubes n³: 1, 4, 9, 16 … and 1, 8, 27, 64 …", explanation: "n multiplied by itself (twice, for cubes)." },
    ],
    prerequisite_knowledge: ["counting numbers", "addition", "multiplication"],
    visual_description: "A column of famous number sequences — counting, odd, triangular, squares, cubes, powers of 2 — each with its first few terms and the rule that generates it.",
    svg_diagrams: [svg("math6_ch1_number_patterns", "Famous number sequences",
      `<text x="20" y="35">Counting:    1  2  3  4  5 …</text>
       <text x="20" y="65">Odd:         1  3  5  7  9 …</text>
       <text x="20" y="95">Triangular:  1  3  6  10  15 …</text>
       <text x="20" y="125">Squares:     1  4  9  16  25 …</text>
       <text x="20" y="155">Powers of 2: 1  2  4  8  16 …</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Recognising a famous sequence from its first terms", "Predicting the next number in a list"],
      use_other_when: ["The numbers have no rule connecting them — then it isn't a pattern"],
    },
    edge_cases: [
      { case: "Sum of the first n odd numbers", value: "= n² (a square!)", reasoning: "1+3+5+…+(2n−1) builds an n×n square of dots.", where_it_appears: "Link between odd and square numbers." },
      { case: "The nth triangular number", value: "n(n+1)/2", reasoning: "Two copies of the triangle make an n×(n+1) rectangle.", where_it_appears: "Counting handshakes / dots." },
    ],
    video_script_hooks: {
      opening_hook: "1, 3, 6, 10, 15 … what comes next? These are the 'triangular numbers', and once you see why they're called that, you'll never forget the next term.",
      concept_reveal: "Number patterns each have a rule: odd numbers step by 2, triangular numbers add one more each time, squares are n×n.",
    },
  },

  math6_ch1_shape_patterns: {
    key_formulas: [
      { formula: "Triangular numbers make triangles of dots; square numbers make squares", explanation: "The shape explains the name." },
      { formula: "Regular shape sequence: triangle, square, pentagon, hexagon … (3, 4, 5, 6 sides)", explanation: "Each adds one side." },
    ],
    prerequisite_knowledge: ["number patterns", "counting dots", "basic shapes"],
    visual_description: "Dots arranged to show 1, 3, 6, 10 as growing triangles, and 1, 4, 9, 16 as growing squares.",
    svg_diagrams: [svg("math6_ch1_shape_patterns", "Numbers drawn as shapes",
      `<text x="20" y="22" font-weight="bold">Triangular: 1, 3, 6, 10</text>
       <circle cx="60" cy="45" r="5" fill="#0369a1"/>
       <circle cx="120" cy="40" r="5" fill="#0369a1"/><circle cx="110" cy="58" r="5" fill="#0369a1"/><circle cx="130" cy="58" r="5" fill="#0369a1"/>
       <text x="20" y="105" font-weight="bold">Square: 1, 4, 9</text>
       ${[[0,0],[1,0],[0,1],[1,1]].map(([c,r])=>`<circle cx="${60+c*18}" cy="${125+r*18}" r="5" fill="#15803d"/>`).join("")}
       ${[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]].map(([c,r])=>`<circle cx="${150+c*18}" cy="${125+r*18}" r="5" fill="#15803d"/>`).join("")}`)],
    when_to_use_this_method: {
      use_this_when: ["Explaining WHY a number sequence has its name", "Seeing the geometry behind a number pattern"],
      use_other_when: ["A purely numeric rule with no natural picture"],
    },
    edge_cases: [
      { case: "Why 1, 3, 6, 10 are 'triangular'", value: "the dots form triangles", reasoning: "Each new row adds one more dot.", where_it_appears: "Naming sequences." },
      { case: "Why 1, 4, 9, 16 are 'squares'", value: "the dots form squares", reasoning: "n rows of n dots = n×n.", where_it_appears: "Naming sequences." },
    ],
    video_script_hooks: {
      opening_hook: "Why do we call 1, 3, 6, 10 'triangular' numbers? Draw them as dots — and a little triangle pops out every time.",
      concept_reveal: "Shape patterns turn numbers into pictures: triangles, squares and polygons that show exactly why each sequence grows as it does.",
    },
  },

  math6_ch1_fibonacci: {
    key_formulas: [
      { formula: "Virahanka–Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, …", explanation: "Each term is the sum of the previous two." },
      { formula: "F(n) = F(n−1) + F(n−2)", explanation: "8 = 5 + 3, 13 = 8 + 5, and so on." },
    ],
    prerequisite_knowledge: ["addition", "number patterns", "reading a sequence"],
    visual_description: "The sequence 1, 1, 2, 3, 5, 8, 13 with curved arrows showing each pair of terms adding to give the next.",
    svg_diagrams: [svg("math6_ch1_fibonacci", "Each term = sum of the previous two",
      `<text x="30" y="80" font-size="18">1  1  2  3  5  8  13  21</text>
       <path d="M40 90 Q70 130 100 90" fill="none" stroke="#dc2626"/><text x="60" y="150" fill="#dc2626">1+1=2</text>
       <path d="M150 90 Q185 130 220 90" fill="none" stroke="#2563eb"/><text x="165" y="150" fill="#2563eb">3+5=8</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Continuing a sequence where each term depends on the previous ones", "Spotting Fibonacci numbers in nature (petals, spirals)"],
      use_other_when: ["The rule depends only on the term's position, not earlier terms"],
    },
    edge_cases: [
      { case: "First two terms", value: "given as 1, 1 (the seeds)", reasoning: "You can't 'add the previous two' until two terms exist.", where_it_appears: "Starting the sequence." },
      { case: "Next after 13", value: "21 = 13 + 8", reasoning: "Always add the two terms just before.", where_it_appears: "Extending the list." },
    ],
    video_script_hooks: {
      opening_hook: "1, 1, 2, 3, 5, 8 … this sequence hides in sunflowers, pinecones and pineapples. Each number is just the two before it, added.",
      concept_reveal: "In a Virahanka–Fibonacci sequence every term is the sum of the previous two — a rule that builds the spirals we see all over nature.",
    },
  },

  math6_ch1_pattern_rules: {
    key_formulas: [
      { formula: "Term-to-term rule: how to get the NEXT term from the current one(s)", explanation: "e.g. 'add 2' for odd numbers." },
      { formula: "Position-to-term rule: a formula for the nth term directly", explanation: "e.g. nth square number = n²." },
    ],
    prerequisite_knowledge: ["number patterns", "the sequences from this chapter", "multiplication"],
    visual_description: "A table mapping position n = 1, 2, 3, 4 to the square numbers 1, 4, 9, 16, with the rule 'n × n' written beside it.",
    svg_diagrams: [svg("math6_ch1_pattern_rules", "Position-to-term rule for squares",
      `<text x="30" y="50">n:        1   2   3   4   5</text>
       <text x="30" y="90">term:     1   4   9   16  25</text>
       <text x="30" y="135" fill="#dc2626">rule: term = n × n</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Predicting a far-away term (e.g. the 100th) without listing them all", "Describing a pattern precisely"],
      use_other_when: ["You only need the very next term — a term-to-term rule is quicker"],
    },
    edge_cases: [
      { case: "100th odd number", value: "2×100 − 1 = 199", reasoning: "Position rule jumps straight there; counting by 2s would take ages.", where_it_appears: "Far-term prediction." },
      { case: "A pattern with two valid-looking rules", value: "check it fits ALL given terms", reasoning: "One matching term isn't enough to confirm a rule.", where_it_appears: "Avoiding wrong guesses." },
    ],
    video_script_hooks: {
      opening_hook: "What's the 100th square number? You could write out all 100 … or you could know the rule and answer in one second: 100 × 100.",
      concept_reveal: "Every pattern has a rule — either 'what to do to get the next term' or a direct formula for the nth term. The formula is the superpower.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 2 — Lines and Angles
  // ───────────────────────────────────────────────────────────────────────────
  math6_ch2_lines_types: {
    key_formulas: [
      { formula: "Line segment AB: a straight path with TWO endpoints", explanation: "It has a definite length." },
      { formula: "Ray AP: starts at one point and goes on endlessly in one direction", explanation: "One endpoint, no end." },
      { formula: "Line: extends endlessly in BOTH directions", explanation: "No endpoints at all." },
    ],
    prerequisite_knowledge: ["points", "drawing straight paths", "using a ruler"],
    visual_description: "Three stacked figures: a line segment with dots at both ends, a ray with one dot and an arrow, and a line with arrows on both ends.",
    svg_diagrams: [svg("math6_ch2_lines_types", "Segment, ray and line",
      `<circle cx="60" cy="45" r="4"/><circle cx="220" cy="45" r="4"/><line x1="60" y1="45" x2="220" y2="45" stroke="#475569" stroke-width="2"/><text x="300" y="50">segment (2 ends)</text>
       <circle cx="60" cy="95" r="4"/><line x1="60" y1="95" x2="230" y2="95" stroke="#475569" stroke-width="2"/><polygon points="230,90 240,95 230,100" fill="#475569"/><text x="300" y="100">ray (1 end)</text>
       <polygon points="50,140 60,135 60,145" fill="#475569"/><line x1="50" y1="140" x2="240" y2="140" stroke="#475569" stroke-width="2"/><polygon points="240,135 250,140 240,145" fill="#475569"/><text x="300" y="145">line (no ends)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Naming a straight figure by how it ends", "Describing geometric paths precisely"],
      use_other_when: ["The path is curved — these names are only for straight figures"],
    },
    edge_cases: [
      { case: "A line segment", value: "has a measurable length", reasoning: "Two endpoints fix where it starts and stops.", where_it_appears: "Measuring distances." },
      { case: "A ray or line", value: "has no length (infinite)", reasoning: "At least one end never stops.", where_it_appears: "Why you can't 'measure' a ray." },
    ],
    video_script_hooks: {
      opening_hook: "A torch beam, a stretched rubber band, a railway track to the horizon — segment, ray, or line? The difference is all in the ends.",
      concept_reveal: "Two endpoints make a segment, one makes a ray, none makes a line — that's the whole vocabulary of straight figures.",
    },
  },

  math6_ch2_angles_types: {
    key_formulas: [
      { formula: "Acute < 90° · Right = 90° · Obtuse between 90° and 180°", explanation: "Classify by size compared to a right angle." },
      { formula: "Straight = 180° · Reflex between 180° and 360° · Complete = 360°", explanation: "The bigger angles." },
    ],
    prerequisite_knowledge: ["rays sharing a vertex", "the degree as a unit", "a right angle (corner)"],
    visual_description: "A fan of angles at one vertex: a small acute angle, a square-marked right angle, a wide obtuse angle and a flat straight angle, each labelled.",
    svg_diagrams: [svg("math6_ch2_angles_types", "Types of angles",
      `<line x1="60" y1="150" x2="60" y2="60" stroke="#2563eb"/><line x1="60" y1="150" x2="120" y2="90" stroke="#2563eb"/><text x="55" y="170">acute</text>
       <line x1="200" y1="150" x2="200" y2="60" stroke="#16a34a"/><line x1="200" y1="150" x2="280" y2="150" stroke="#16a34a"/><rect x="200" y="138" width="12" height="12" fill="none" stroke="#16a34a"/><text x="200" y="170">right 90°</text>
       <line x1="380" y1="150" x2="320" y2="80" stroke="#dc2626"/><line x1="380" y1="150" x2="470" y2="150" stroke="#dc2626"/><text x="380" y="170">obtuse</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Naming an angle from its size", "Checking if a corner is more or less than a right angle"],
      use_other_when: ["You need the exact size → measure it with a protractor"],
    },
    edge_cases: [
      { case: "Exactly 90°", value: "right angle (not acute or obtuse)", reasoning: "The boundary belongs to its own name.", where_it_appears: "Corners of squares." },
      { case: "Exactly 180°", value: "straight angle (a straight line)", reasoning: "The two rays point opposite ways.", where_it_appears: "Angles on a line." },
    ],
    video_script_hooks: {
      opening_hook: "Open a book a little, then wide, then flat on the table. You just made an acute, an obtuse and a straight angle without trying.",
      concept_reveal: "Every angle gets a name from its size: under 90° acute, exactly 90° right, past 90° obtuse, flat at 180° straight.",
    },
  },

  math6_ch2_measuring_angles: {
    key_formulas: [
      { formula: "A protractor measures angles in degrees from 0° to 180°", explanation: "Half a turn is 180°; a full turn is 360°." },
      { formula: "Centre on the vertex, 0° line along one arm, read where the other arm crosses", explanation: "Use the scale that starts at 0° on your baseline arm." },
    ],
    prerequisite_knowledge: ["angle types", "the degree unit", "reading a scale"],
    visual_description: "A protractor placed with its centre on an angle's vertex and baseline along one arm; the second arm crosses the scale at 50°.",
    svg_diagrams: [svg("math6_ch2_measuring_angles", "Reading an angle on a protractor",
      `<path d="M120 150 A90 90 0 0 1 300 150" fill="none" stroke="#94a3b8"/>
       <line x1="120" y1="150" x2="300" y2="150" stroke="#475569"/>
       <line x1="210" y1="150" x2="210" y2="60" stroke="#94a3b8" stroke-dasharray="3 3"/>
       <line x1="210" y1="150" x2="295" y2="95" stroke="#2563eb" stroke-width="2"/>
       <text x="320" y="110" fill="#2563eb">reads 50°</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the exact size of a drawn angle", "Checking a constructed angle is correct"],
      use_other_when: ["You only need 'bigger or smaller than 90°' → just compare to a right angle"],
    },
    edge_cases: [
      { case: "Reading the wrong scale", value: "common error (e.g. 130° instead of 50°)", reasoning: "Use the scale whose 0° is on your baseline arm.", where_it_appears: "Most protractor mistakes." },
      { case: "Vertex not on the centre dot", value: "measurement is wrong", reasoning: "The protractor's centre MUST sit exactly on the vertex.", where_it_appears: "Setup error." },
    ],
    video_script_hooks: {
      opening_hook: "Two students measure the same angle and get 50° and 130°. Only one is right — and the trick is knowing which scale to read.",
      concept_reveal: "Line up the protractor's centre on the vertex and 0° on one arm; the other arm points straight at the answer.",
    },
  },

  math6_ch2_parallel_perpendicular: {
    key_formulas: [
      { formula: "Parallel lines (∥) never meet, however far they go", explanation: "They stay the same distance apart." },
      { formula: "Perpendicular lines (⊥) meet at a right angle (90°)", explanation: "Like the corner of a page." },
    ],
    prerequisite_knowledge: ["lines and rays", "right angles", "measuring angles"],
    visual_description: "Two horizontal rails (parallel) beside a pair of lines crossing at a square-marked 90° (perpendicular).",
    svg_diagrams: [svg("math6_ch2_parallel_perpendicular", "Parallel vs perpendicular",
      `<line x1="40" y1="70" x2="200" y2="70" stroke="#2563eb" stroke-width="2"/><line x1="40" y1="120" x2="200" y2="120" stroke="#2563eb" stroke-width="2"/><text x="70" y="160" fill="#2563eb">parallel (∥)</text>
       <line x1="330" y1="50" x2="330" y2="150" stroke="#dc2626" stroke-width="2"/><line x1="280" y1="100" x2="430" y2="100" stroke="#dc2626" stroke-width="2"/><rect x="330" y="88" width="12" height="12" fill="none" stroke="#dc2626"/><text x="320" y="170" fill="#dc2626">perpendicular (⊥)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing how two lines relate", "Spotting right-angle and never-meeting relationships in shapes"],
      use_other_when: ["Lines that cross at some other angle — they're just 'intersecting', neither term applies"],
    },
    edge_cases: [
      { case: "Parallel lines", value: "never intersect", reasoning: "Constant gap means they can't meet.", where_it_appears: "Rails, ruled paper." },
      { case: "Perpendicular", value: "a special case of intersecting (at 90°)", reasoning: "They DO meet, but exactly at a right angle.", where_it_appears: "Corners, plus signs." },
    ],
    video_script_hooks: {
      opening_hook: "Railway tracks run side by side forever and never touch. The corner of this page meets at a perfect square. That's parallel vs perpendicular.",
      concept_reveal: "Parallel lines keep an unchanging gap and never meet; perpendicular lines cross at a clean 90° right angle.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const entries = Object.entries(ENRICH).filter(([id]) => !chFilter || id.startsWith(chFilter));
  if (!entries.length) { console.log(`Nothing to enrich for filter ${chFilter || "(all)"}.`); await mongoose.disconnect(); return; }

  let patched = 0, missing = 0;
  for (const [topicId, f] of entries) {
    const set = {
      key_formulas:           f.key_formulas,
      prerequisite_knowledge: f.prerequisite_knowledge,
      "teaching_content.visual_description":      f.visual_description,
      "teaching_content.svg_diagrams":            f.svg_diagrams,
      "teaching_content.when_to_use_this_method": f.when_to_use_this_method,
      "teaching_content.edge_cases":              f.edge_cases,
      "teaching_content.video_script_hooks":      f.video_script_hooks,
    };
    const r = await NcertTopicContent.updateOne({ topicId }, { $set: set });
    if (r.matchedCount === 0) { console.log(`  ✗ MISSING in DB: ${topicId}`); missing++; }
    else { console.log(`  ✓ enriched ${topicId}`); patched++; }
  }
  console.log(`\nDone — ${patched} enriched, ${missing} missing (of ${entries.length}).`);
  await mongoose.disconnect();
  process.exit(missing ? 1 : 0);
}

run().catch((err) => { console.error(err); process.exit(1); });
