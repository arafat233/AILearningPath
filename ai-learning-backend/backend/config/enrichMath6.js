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

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 3 — Number Play
  // ───────────────────────────────────────────────────────────────────────────
  math6_ch3_number_properties: {
    key_formulas: [
      { formula: "Even numbers end in 0, 2, 4, 6, 8 · odd numbers end in 1, 3, 5, 7, 9", explanation: "The last digit decides parity." },
      { formula: "even + even = even · odd + odd = even · even + odd = odd", explanation: "Parity rules for sums." },
      { formula: "A 'supercell' is a cell whose number is larger than all its neighbours", explanation: "From the Number Play grids." },
    ],
    prerequisite_knowledge: ["place value", "comparing numbers", "the number line"],
    visual_description: "A row of grid cells with numbers; the cells larger than both neighbours are shaded as 'supercells', alongside even/odd numbers marked on a number line.",
    svg_diagrams: [svg("math6_ch3_number_properties", "Supercells and parity",
      `<text x="20" y="35" font-weight="bold">Supercells (bigger than neighbours):</text>
       ${[35,82,41,90,57].map((n,i)=>`<rect x="${30+i*70}" y="50" width="60" height="40" fill="${(n===82||n===90)?'#fde68a':'#fff'}" stroke="#475569"/><text x="${48+i*70}" y="76">${n}</text>`).join("")}
       <text x="20" y="135">even: 0 2 4 6 8     odd: 1 3 5 7 9</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Sorting numbers by parity (even/odd)", "Comparing numbers in a grid or sequence"],
      use_other_when: ["You need the exact value of an operation, not just its parity"],
    },
    edge_cases: [
      { case: "0", value: "is even", reasoning: "It ends in 0 and fits the even pattern.", where_it_appears: "Parity of zero." },
      { case: "Smallest number in a grid", value: "can never be a supercell", reasoning: "It isn't larger than its neighbours.", where_it_appears: "Supercell puzzles." },
    ],
    video_script_hooks: {
      opening_hook: "In a row of numbers, which ones are 'kings' — bigger than both neighbours? Hunting these supercells turns number properties into a game.",
      concept_reveal: "Numbers carry properties — even or odd, bigger or smaller — and spotting them quickly is the heart of number play.",
    },
  },

  math6_ch3_divisibility_rules: {
    key_formulas: [
      { formula: "÷2: last digit even · ÷5: last digit 0 or 5 · ÷10: last digit 0", explanation: "Read the last digit." },
      { formula: "÷3 (and ÷9): the digit sum is divisible by 3 (or 9)", explanation: "Add all the digits." },
    ],
    prerequisite_knowledge: ["multiples", "adding digits", "even and odd numbers"],
    visual_description: "The number 4,530 run through quick checks: last digit 0 → ÷2, ÷5, ÷10 ✓; digit sum 12 → ÷3 ✓.",
    svg_diagrams: [svg("math6_ch3_divisibility", "Divisibility checks on 4,530",
      `<text x="20" y="35" font-weight="bold">Is 4,530 divisible by …?</text>
       <text x="30" y="70">÷2  last digit 0       ✓</text>
       <text x="30" y="98">÷5  last digit 0       ✓</text>
       <text x="30" y="126">÷10 last digit 0       ✓</text>
       <text x="30" y="154">÷3  digit sum 12       ✓</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Checking divisibility without doing the full division", "Finding factors quickly"],
      use_other_when: ["You need the actual quotient → do the division"],
    },
    edge_cases: [
      { case: "Divisible by 3 but not 9: 12 (digit sum 3)", value: "÷3 ✓, ÷9 ✗", reasoning: "3 is a multiple of 3 but not 9.", where_it_appears: "Telling the two rules apart." },
      { case: "Divisible by both 2 and 3", value: "also divisible by 6", reasoning: "6 = 2 × 3.", where_it_appears: "Combining rules." },
    ],
    video_script_hooks: {
      opening_hook: "Is 4,530 divisible by 3? Don't divide — add the digits: 4+5+3+0 = 12. Yes! The digits are whispering the answer.",
      concept_reveal: "Divisibility rules read clues from the digits — last digit for 2, 5, 10; the digit sum for 3 and 9.",
    },
  },

  math6_ch3_factors_multiples: {
    key_formulas: [
      { formula: "A factor of a number divides it exactly (no remainder)", explanation: "Factors of 12: 1, 2, 3, 4, 6, 12." },
      { formula: "A multiple is what you get by multiplying: multiples of 4 are 4, 8, 12, 16, …", explanation: "Every number is a factor of its multiples." },
    ],
    prerequisite_knowledge: ["multiplication tables", "division", "divisibility rules"],
    visual_description: "12 dots arranged as 1×12, 2×6 and 3×4 rectangles, showing each factor pair, beside a ladder of the multiples of 4.",
    svg_diagrams: [svg("math6_ch3_factors_multiples", "Factor pairs of 12",
      `<text x="20" y="35" font-weight="bold">12 = 1×12 = 2×6 = 3×4</text>
       <text x="30" y="75">Factors of 12: 1, 2, 3, 4, 6, 12</text>
       <text x="30" y="115" fill="#2563eb">Multiples of 4: 4, 8, 12, 16, 20 …</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Listing what divides a number (factors)", "Listing what a number divides into (multiples)"],
      use_other_when: ["Don't confuse the two: factors are FINITE, multiples are ENDLESS"],
    },
    edge_cases: [
      { case: "1 and the number itself", value: "always factors", reasoning: "1 divides everything; every number divides itself.", where_it_appears: "Smallest and largest factor." },
      { case: "Factors vs multiples of 12", value: "12 is both a factor and a multiple of itself", reasoning: "12 ÷ 12 = 1 and 12 × 1 = 12.", where_it_appears: "Overlap point." },
    ],
    video_script_hooks: {
      opening_hook: "Factors fit INTO a number; multiples are built FROM it. Mix them up and 'factors of 12' suddenly becomes an endless list — it isn't.",
      concept_reveal: "A factor divides a number exactly; a multiple is the number times something. Factors stop; multiples go on forever.",
    },
  },

  math6_ch3_number_games: {
    key_formulas: [
      { formula: "A palindrome reads the same forwards and backwards (e.g. 121, 1331)", explanation: "Reverse the digits and you get the same number." },
      { formula: "Reverse-and-add often reaches a palindrome (e.g. 59 → 59+95 = 154 → 154+451 = 605 → …)", explanation: "A classic number game." },
    ],
    prerequisite_knowledge: ["place value", "addition", "number properties"],
    visual_description: "The number 121 with a mirror line showing it reads the same both ways, beside a reverse-and-add chain reaching a palindrome.",
    svg_diagrams: [svg("math6_ch3_number_games", "Palindromes and reverse-and-add",
      `<text x="60" y="50" font-size="22">1 2 1</text><line x1="110" y1="30" x2="110" y2="70" stroke="#dc2626" stroke-dasharray="3 3"/><text x="160" y="50" fill="#dc2626">same both ways</text>
       <text x="40" y="110">59 + 95 = 154</text>
       <text x="40" y="140">154 + 451 = 605  →  605 + 506 = 1111 ✓</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Exploring digit puzzles and palindromes", "Practising place value and addition through play"],
      use_other_when: ["A straightforward calculation — games are for exploring patterns, not routine sums"],
    },
    edge_cases: [
      { case: "A single-digit number", value: "is already a palindrome", reasoning: "One digit reversed is itself.", where_it_appears: "Trivial palindromes." },
      { case: "Numbers ending in 0 reversed", value: "lose the leading zero", reasoning: "120 reversed is 021 = 21, changing the value.", where_it_appears: "Reverse-and-add care." },
    ],
    video_script_hooks: {
      opening_hook: "Pick any number, reverse it, add the two. Repeat. Astonishingly often you crash into a palindrome like 1111. Try to find one that doesn't!",
      concept_reveal: "Number games like palindromes and reverse-and-add turn place value into a playground — and hide real mathematical mysteries.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 4 — Data Handling and Presentation
  // ───────────────────────────────────────────────────────────────────────────
  math6_ch4_collecting_data: {
    key_formulas: [
      { formula: "Data = any collection of facts, numbers, measures or observations", explanation: "Favourite colours, heights, scores — all data." },
      { formula: "Organise data with a tally table: |||| = 4, |||| crossed = 5", explanation: "Group tallies in fives to count fast." },
    ],
    prerequisite_knowledge: ["counting", "making a table", "sorting into categories"],
    visual_description: "A messy list of favourite-fruit responses turned into a neat tally table with counts per fruit.",
    svg_diagrams: [svg("math6_ch4_collecting_data", "Raw data → tally table",
      `<text x="30" y="40" font-weight="bold">Favourite fruit</text>
       <text x="30" y="75">Apple   |||| ||      7</text>
       <text x="30" y="105">Mango   |||| ||||    9</text>
       <text x="30" y="135">Banana  ||||         4</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Gathering and organising raw information", "Counting how often each category occurs"],
      use_other_when: ["The data is already summarised — you can go straight to a graph"],
    },
    edge_cases: [
      { case: "A single tally group of 5", value: "shown as |||| with a slash across", reasoning: "Grouping in fives makes totals quick to read.", where_it_appears: "Tally convention." },
      { case: "An answer that fits no category", value: "needs an 'Other' row", reasoning: "Every response must land somewhere.", where_it_appears: "Survey design." },
    ],
    video_script_hooks: {
      opening_hook: "Ask 30 friends their favourite fruit and you get chaos. Tally marks turn that chaos into a clean count in seconds.",
      concept_reveal: "Data starts messy; a tally table organises it into neat counts you can actually read and compare.",
    },
  },

  math6_ch4_pictographs: {
    key_formulas: [
      { formula: "A pictograph shows data using a repeated symbol", explanation: "e.g. 🍎 = 2 apples." },
      { formula: "Count = number of symbols × the symbol's value (the key)", explanation: "Half a symbol = half the value." },
    ],
    prerequisite_knowledge: ["collecting data", "multiplication", "reading a key/legend"],
    visual_description: "Rows of fruit symbols, one row per fruit, with a key stating each symbol equals 2 units; a half-symbol shows an odd count.",
    svg_diagrams: [svg("math6_ch4_pictographs", "Pictograph (key: ◉ = 2)",
      `<text x="20" y="35">Apple   ◉ ◉ ◉ ◉      = 8</text>
       <text x="20" y="70">Mango   ◉ ◉ ◉ ◉ ◑   = 9</text>
       <text x="20" y="105">Banana  ◉ ◉            = 4</text>
       <text x="20" y="150" fill="#dc2626">Key: ◉ = 2,  ◑ = 1</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Presenting data in a friendly, visual way", "Comparing categories at a glance"],
      use_other_when: ["Values are large or precise → a bar graph with a number scale is clearer"],
    },
    edge_cases: [
      { case: "An odd count when the key is 2", value: "use a half-symbol", reasoning: "9 apples = 4 full + 1 half symbol.", where_it_appears: "Fractional symbols." },
      { case: "Forgetting the key", value: "graph is unreadable", reasoning: "Without the key you can't tell what one symbol is worth.", where_it_appears: "Common omission." },
    ],
    video_script_hooks: {
      opening_hook: "One little apple picture stands for two real apples. Pictographs make data feel like a story — as long as you read the key.",
      concept_reveal: "A pictograph swaps numbers for symbols; multiply the symbols by the key's value to get the real count.",
    },
  },

  math6_ch4_bar_graphs: {
    key_formulas: [
      { formula: "Bar height = the value of that category", explanation: "Bars have equal width and equal gaps." },
      { formula: "Read the value off the numbered axis (the scale)", explanation: "Each step on the axis is a fixed amount." },
    ],
    prerequisite_knowledge: ["collecting data", "reading a number scale", "categories"],
    visual_description: "A bar graph with a numbered vertical axis, equal-width bars of different heights for each fruit, and gaps between bars.",
    svg_diagrams: [svg("math6_ch4_bar_graphs", "Bar graph with a scale",
      `<line x1="50" y1="40" x2="50" y2="160" stroke="#475569"/><line x1="50" y1="160" x2="320" y2="160" stroke="#475569"/>
       ${[[70,70,"#2563eb"],[140,40,"#2563eb"],[210,100,"#2563eb"]].map(([x,h,c])=>`<rect x="${x}" y="${160-h}" width="40" height="${h}" fill="${c}"/>`).join("")}
       <text x="78" y="178">Apple</text><text x="148" y="178">Mango</text><text x="215" y="178">Banana</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Comparing amounts across categories precisely", "Showing larger numbers clearly"],
      use_other_when: ["A playful, symbol-based picture is enough → use a pictograph"],
    },
    edge_cases: [
      { case: "Axis not starting at 0", value: "misleading bars", reasoning: "A chopped axis exaggerates differences.", where_it_appears: "Misleading graphs." },
      { case: "Unequal bar widths", value: "incorrect bar graph", reasoning: "Only height should carry meaning, so widths must match.", where_it_appears: "Drawing rules." },
    ],
    video_script_hooks: {
      opening_hook: "Which fruit won the class vote? With a bar graph you don't count — you just see which bar shoots up highest.",
      concept_reveal: "Bar graphs map each category to a bar whose height you read off a number scale — equal widths, clear comparisons.",
    },
  },

  math6_ch4_data_interpretation: {
    key_formulas: [
      { formula: "Interpreting data = reading off values AND drawing conclusions", explanation: "Most/least, total, difference, 'how many more'." },
      { formula: "Total = add all the category values", explanation: "e.g. total fruit = 7 + 9 + 4 = 20." },
    ],
    prerequisite_knowledge: ["reading bar graphs and pictographs", "addition and subtraction", "comparing numbers"],
    visual_description: "A bar graph annotated with callouts: tallest bar = 'most popular', a subtraction bracket = 'how many more', and a running total.",
    svg_diagrams: [svg("math6_ch4_data_interpretation", "Asking questions of a graph",
      `<line x1="50" y1="40" x2="50" y2="150" stroke="#475569"/><line x1="50" y1="150" x2="300" y2="150" stroke="#475569"/>
       ${[[70,70],[140,100],[210,40]].map(([x,h])=>`<rect x="${x}" y="${150-h}" width="40" height="${h}" fill="#2563eb"/>`).join("")}
       <text x="150" y="35" fill="#dc2626">↑ most popular</text>
       <text x="30" y="180">Most? Least? How many more? Total?</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Answering questions FROM a graph or table", "Drawing conclusions like most/least/total"],
      use_other_when: ["You still need to gather the data — interpretation comes after collection"],
    },
    edge_cases: [
      { case: "'How many more mangoes than bananas?'", value: "subtract: 9 − 4 = 5", reasoning: "Comparison questions need a difference, not a single value.", where_it_appears: "Comparison questions." },
      { case: "Reading a value between gridlines", value: "estimate carefully", reasoning: "A bar landing mid-step needs judgement against the scale.", where_it_appears: "Imprecise reads." },
    ],
    video_script_hooks: {
      opening_hook: "A graph isn't the answer — it's the start of questions. Most popular? How many more? Total votes? The graph holds all of them.",
      concept_reveal: "Interpreting data means asking it questions: read off the bars, then add or subtract to reach a conclusion.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 5 — Prime Time
  // ───────────────────────────────────────────────────────────────────────────
  math6_ch5_prime_numbers: {
    key_formulas: [
      { formula: "A prime number has exactly TWO factors: 1 and itself", explanation: "2, 3, 5, 7, 11, 13, … " },
      { formula: "2 is the only even prime", explanation: "Every other even number is divisible by 2, so it has more factors." },
    ],
    prerequisite_knowledge: ["factors and multiples", "divisibility rules", "division"],
    visual_description: "A small number grid with primes 2, 3, 5, 7, 11, 13 circled, and a note that each has only two factors.",
    svg_diagrams: [svg("math6_ch5_prime_numbers", "Primes have exactly two factors",
      `<text x="20" y="35" font-weight="bold">Primes up to 20:</text>
       ${[2,3,5,7,11,13,17,19].map((n,i)=>`<circle cx="${50+i*55}" cy="70" r="20" fill="#dbeafe" stroke="#2563eb"/><text x="${42+i*55}" y="76">${n}</text>`).join("")}
       <text x="20" y="125">7 → factors are only 1 and 7</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding if a number is prime", "Breaking a number into prime building blocks"],
      use_other_when: ["A number with more than two factors → it's composite, not prime"],
    },
    edge_cases: [
      { case: "1", value: "is NOT prime", reasoning: "It has only one factor (itself), not two.", where_it_appears: "The classic exception." },
      { case: "2", value: "prime, and the only even one", reasoning: "Its only factors are 1 and 2.", where_it_appears: "Even-prime trick question." },
    ],
    video_script_hooks: {
      opening_hook: "Why isn't 1 a prime number? It feels like it should be — but primes need EXACTLY two factors, and 1 only has one.",
      concept_reveal: "A prime has only two factors — 1 and itself — making primes the indivisible atoms that build every other number.",
    },
  },

  math6_ch5_composite_numbers: {
    key_formulas: [
      { formula: "A composite number has MORE than two factors", explanation: "4, 6, 8, 9, 10, 12, … can be split further." },
      { formula: "Every whole number > 1 is either prime or composite", explanation: "1 is neither." },
    ],
    prerequisite_knowledge: ["factors", "prime numbers", "divisibility"],
    visual_description: "The number 12 shown with all its factors 1, 2, 3, 4, 6, 12 (six factors → composite), contrasted with prime 7's two factors.",
    svg_diagrams: [svg("math6_ch5_composite_numbers", "Composite = more than two factors",
      `<text x="20" y="40">12 → 1, 2, 3, 4, 6, 12   (6 factors → composite)</text>
       <text x="20" y="80" fill="#2563eb">7 → 1, 7   (2 factors → prime)</text>
       <text x="20" y="125" fill="#dc2626">1 → just 1   (neither)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Classifying a number as prime or composite", "Knowing a number can be factorised further"],
      use_other_when: ["The number is 1 — it's neither prime nor composite"],
    },
    edge_cases: [
      { case: "4", value: "smallest composite", reasoning: "Factors 1, 2, 4 — three of them.", where_it_appears: "First composite." },
      { case: "1", value: "neither prime nor composite", reasoning: "Only one factor, so it fits neither definition.", where_it_appears: "Boundary case." },
    ],
    video_script_hooks: {
      opening_hook: "12 can be split as 2×6, 3×4, 2×2×3 … it's bursting with factors. That's what makes it composite, not prime.",
      concept_reveal: "Composite numbers have more than two factors — they can always be broken into smaller pieces, unlike primes.",
    },
  },

  math6_ch5_prime_factorization: {
    key_formulas: [
      { formula: "Every composite number = a product of primes", explanation: "12 = 2 × 2 × 3 = 2² × 3." },
      { formula: "The prime factorisation is unique (order aside)", explanation: "There's only one prime 'recipe' for each number." },
    ],
    prerequisite_knowledge: ["prime numbers", "composite numbers", "division and factors"],
    visual_description: "A factor tree for 12: 12 branches to 2 and 6, then 6 branches to 2 and 3, leaving primes 2, 2, 3 at the leaves.",
    svg_diagrams: [svg("math6_ch5_prime_factorization", "Factor tree of 12",
      `<text x="120" y="35" font-weight="bold">12</text>
       <line x1="125" y1="42" x2="80" y2="75" stroke="#475569"/><line x1="135" y1="42" x2="180" y2="75" stroke="#475569"/>
       <text x="70" y="90" fill="#2563eb">2</text><text x="175" y="90">6</text>
       <line x1="180" y1="98" x2="150" y2="130" stroke="#475569"/><line x1="185" y1="98" x2="215" y2="130" stroke="#475569"/>
       <text x="145" y="145" fill="#2563eb">2</text><text x="212" y="145" fill="#2563eb">3</text>
       <text x="280" y="100" fill="#dc2626">12 = 2 × 2 × 3</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Breaking a number into its prime building blocks", "Finding HCF/LCM via shared primes"],
      use_other_when: ["The number is already prime — its factorisation is just itself"],
    },
    edge_cases: [
      { case: "A prime like 13", value: "factorisation is just 13", reasoning: "It can't be broken down further.", where_it_appears: "Prime inputs." },
      { case: "Order of the primes", value: "doesn't matter", reasoning: "2×2×3 = 3×2×2 — same factorisation.", where_it_appears: "Uniqueness." },
    ],
    video_script_hooks: {
      opening_hook: "Every number has a secret recipe made only of primes — and astonishingly, each number has exactly ONE recipe. 12 is always 2×2×3.",
      concept_reveal: "A factor tree keeps splitting until only primes remain; that prime product is the number's unique fingerprint.",
    },
  },

  math6_ch5_co_prime: {
    key_formulas: [
      { formula: "Two numbers are co-prime if their only common factor is 1", explanation: "e.g. 8 and 15 share no factor except 1." },
      { formula: "Co-prime numbers need NOT be prime themselves", explanation: "8 and 15 are both composite, yet co-prime." },
    ],
    prerequisite_knowledge: ["factors", "common factors / HCF", "prime numbers"],
    visual_description: "Factor lists for 8 (1,2,4,8) and 15 (1,3,5,15) side by side, with only the shared factor 1 highlighted.",
    svg_diagrams: [svg("math6_ch5_co_prime", "8 and 15 are co-prime",
      `<text x="30" y="50">8:  1  2  4  8</text>
       <text x="30" y="90">15: 1  3  5  15</text>
       <text x="30" y="135" fill="#dc2626">only common factor = 1 → co-prime</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Checking if two numbers share any factor beyond 1", "Simplifying fractions to lowest terms (co-prime numerator & denominator)"],
      use_other_when: ["You need the actual HCF value, not just 'is it 1?'"],
    },
    edge_cases: [
      { case: "8 and 15", value: "co-prime though both composite", reasoning: "Being co-prime is about SHARED factors, not being prime.", where_it_appears: "Common misconception." },
      { case: "Any two different primes, e.g. 5 and 7", value: "always co-prime", reasoning: "Distinct primes share no factor but 1.", where_it_appears: "Prime pairs." },
    ],
    video_script_hooks: {
      opening_hook: "8 and 15 — neither is prime, yet they're 'co-prime'. How? They simply share nothing but the number 1.",
      concept_reveal: "Co-prime numbers have 1 as their only common factor; they don't have to be prime themselves, just strangers to each other's factors.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 6 — Perimeter and Area
  // ───────────────────────────────────────────────────────────────────────────
  math6_ch6_perimeter_basics: {
    key_formulas: [
      { formula: "Perimeter of any polygon = sum of all its side lengths", explanation: "The total distance once around the boundary." },
      { formula: "Rectangle: P = 2 × (length + breadth) · Square: P = 4 × side", explanation: "Shortcuts for the common shapes." },
    ],
    prerequisite_knowledge: ["measuring lengths", "addition and multiplication", "naming shapes and their sides"],
    visual_description: "A 12 cm × 8 cm rectangle with all four sides labelled and the boundary traced, giving P = 2×(12+8) = 40 cm.",
    svg_diagrams: [svg("math6_ch6_perimeter_basics", "Perimeter of a rectangle",
      `<rect x="80" y="50" width="200" height="100" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
       <text x="160" y="45">12 cm</text><text x="160" y="170">12 cm</text><text x="40" y="105">8 cm</text><text x="285" y="105">8 cm</text>
       <text x="340" y="105" font-weight="bold">P = 2(12+8) = 40 cm</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the distance around a shape (fencing, border, framing)", "Any boundary-length problem"],
      use_other_when: ["You need the space INSIDE → that's area, not perimeter"],
    },
    edge_cases: [
      { case: "Perimeter unit", value: "a length unit (cm, m)", reasoning: "It's a distance, so never squared.", where_it_appears: "Unit choice." },
      { case: "Irregular polygon", value: "no shortcut — add every side", reasoning: "Only regular shapes have a formula.", where_it_appears: "Odd shapes." },
    ],
    video_script_hooks: {
      opening_hook: "How much fencing to go round a garden? Walk the boundary and add up every side — that total is the perimeter.",
      concept_reveal: "Perimeter is just the distance once around; for rectangles and squares, handy shortcuts save you adding each side.",
    },
  },

  math6_ch6_area_rectangles: {
    key_formulas: [
      { formula: "Area of a rectangle = length × breadth", explanation: "Counts the unit squares that fit inside." },
      { formula: "Area of a square = side × side = side²", explanation: "A rectangle with all sides equal." },
    ],
    prerequisite_knowledge: ["multiplication", "the idea of a unit square", "perimeter (for contrast)"],
    visual_description: "A 5×3 rectangle tiled into 15 unit squares, showing area = 5 × 3 = 15 square units.",
    svg_diagrams: [svg("math6_ch6_area_rectangles", "Area = length × breadth",
      `${[0,1,2].map(r=>[0,1,2,3,4].map(c=>`<rect x="${70+c*40}" y="${50+r*40}" width="40" height="40" fill="#dbeafe" stroke="#2563eb"/>`).join("")).join("")}
       <text x="120" y="180">5 × 3 = 15 sq units</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the space covered by a rectangle/square (floor, wall, field)", "Counting unit squares inside a shape"],
      use_other_when: ["You need the boundary length → use perimeter"],
    },
    edge_cases: [
      { case: "Area unit", value: "a SQUARE unit (cm², m²)", reasoning: "It counts squares, so it's always squared.", where_it_appears: "Distinguishing from perimeter." },
      { case: "Same perimeter, different area", value: "possible!", reasoning: "A 1×5 and a 2×4 rectangle (P=12) have areas 5 and 8.", where_it_appears: "Perimeter ≠ area." },
    ],
    video_script_hooks: {
      opening_hook: "Two gardens with the SAME fence length can hold very different amounts of grass. Perimeter and area are not the same thing.",
      concept_reveal: "Area counts the unit squares inside; for a rectangle that's simply length × breadth — measured in square units.",
    },
  },

  math6_ch6_area_triangles: {
    key_formulas: [
      { formula: "Area of a triangle = ½ × base × height", explanation: "A triangle is half of a rectangle around it." },
      { formula: "Height is the perpendicular distance from the base to the opposite vertex", explanation: "Not the slanted side." },
    ],
    prerequisite_knowledge: ["area of a rectangle", "perpendicular (height)", "multiplication and halving"],
    visual_description: "A triangle drawn inside a rectangle of the same base and height, shaded to show the triangle is exactly half the rectangle.",
    svg_diagrams: [svg("math6_ch6_area_triangles", "Triangle = ½ of its rectangle",
      `<rect x="80" y="50" width="160" height="100" fill="none" stroke="#94a3b8" stroke-dasharray="4 4"/>
       <polygon points="80,150 240,150 140,50" fill="#dbeafe" stroke="#2563eb"/>
       <line x1="140" y1="50" x2="140" y2="150" stroke="#dc2626" stroke-dasharray="3 3"/>
       <text x="150" y="105" fill="#dc2626">height</text><text x="140" y="170">base</text>
       <text x="300" y="105" font-weight="bold">½ × base × height</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the area of any triangle given base and height", "Splitting a shape into triangles"],
      use_other_when: ["You're given the slant side instead of the perpendicular height → find the height first"],
    },
    edge_cases: [
      { case: "Using the slanted side as 'height'", value: "wrong", reasoning: "Height must be perpendicular to the base.", where_it_appears: "Most common triangle-area error." },
      { case: "Right-angled triangle", value: "the two legs are base and height", reasoning: "They're already perpendicular.", where_it_appears: "Easy case." },
    ],
    video_script_hooks: {
      opening_hook: "Draw any triangle, then box it in a rectangle. The triangle fills exactly half. That's where the ½ in the formula comes from.",
      concept_reveal: "A triangle is half the rectangle on the same base and height, so its area is ½ × base × height — with height measured straight, not slanted.",
    },
  },

  math6_ch6_real_problems: {
    key_formulas: [
      { formula: "Perimeter for boundary length, area for surface covered", explanation: "Choose by what the problem asks." },
      { formula: "Cost = rate × quantity (× perimeter for fencing, × area for tiling)", explanation: "e.g. fencing cost = rate per metre × perimeter." },
    ],
    prerequisite_knowledge: ["perimeter formulas", "area formulas", "multiplication and money"],
    visual_description: "A rectangular plot with two callouts: 'fencing → perimeter × rate' around the edge, and 'turfing → area × rate' across the inside.",
    svg_diagrams: [svg("math6_ch6_real_problems", "Perimeter vs area in real life",
      `<rect x="90" y="50" width="180" height="100" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
       <text x="100" y="40" fill="#dc2626">fence → perimeter × rate</text>
       <text x="120" y="105">grass → area × rate</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding whether a word problem needs perimeter or area", "Costing fencing, tiling, painting, turfing"],
      use_other_when: ["The problem is pure measurement with no real-world quantity to compute"],
    },
    edge_cases: [
      { case: "'Cost to fence a field'", value: "use perimeter", reasoning: "Fencing follows the boundary.", where_it_appears: "Fencing problems." },
      { case: "'Cost to tile a floor'", value: "use area", reasoning: "Tiles cover the surface inside.", where_it_appears: "Tiling problems." },
    ],
    video_script_hooks: {
      opening_hook: "Fencing a field or laying its grass? One needs perimeter, the other needs area — pick wrong and your bill is completely off.",
      concept_reveal: "Real problems hinge on one choice: boundary (perimeter) or surface (area). Get that right and it's just multiply-by-the-rate.",
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
