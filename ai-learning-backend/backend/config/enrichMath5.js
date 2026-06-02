/**
 * enrichMath5.js — v3 enrichment for CBSE Class 5 Math (CONTENT_STATUS).
 *
 * The 56 `math5_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (auditMathChecklist --prefix=math5_). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition / derivation / process_explanation /
 * worked_example / common_misconceptions / shortcuts_and_tricks / key_takeaway):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the NCERT Class 5 "Math-Magic" textbook
 * (Ch1 The Fish Tale … Ch14 How Big? How Heavy?). Mirrors enrichMath7.js.
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath5.js            # patch every topic present in ENRICH
 *         node config/enrichMath5.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math5
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math5_ch${args.ch}_` : null;

// Compact, self-contained SVG helper (matches each topic's visual_description).
function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

const ENRICH = {
  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 1 — The Fish Tale (large numbers, money, distance, weight)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch1_large_numbers: {
    key_formulas: [
      { formula: "1 lakh = 1,00,000 = 100 × 1,000", explanation: "A hundred thousand — the smallest 6-digit number (1 followed by 5 zeros)." },
      { formula: "Indian grouping (right→left): Ones, Thousands, Lakhs, Crores with commas as 3-2-2", explanation: "Commas after every 3 digits, then every 2: e.g. 12,34,567." },
    ],
    prerequisite_knowledge: ["place value up to thousands", "reading and writing 4- and 5-digit numbers", "multiplying by 10, 100, 1000"],
    visual_description: "An Indian place-value chart with the groups Lakhs | Thousands | Ones, showing 1,50,000 (one lakh fifty thousand) with commas placed in the 2-3 pattern from the right and each digit sitting under its place name.",
    svg_diagrams: [svg("math5_ch1_large_numbers_chart", "Indian place-value grouping",
      `<text x="20" y="28" font-weight="bold">1,50,000 — one lakh fifty thousand</text>
       <rect x="20" y="50" width="120" height="40" fill="#fef9c3" stroke="#a16207"/><text x="50" y="75">Lakhs</text>
       <rect x="150" y="50" width="160" height="40" fill="#dcfce7" stroke="#15803d"/><text x="190" y="75">Thousands</text>
       <rect x="320" y="50" width="120" height="40" fill="#fae8ff" stroke="#a21caf"/><text x="358" y="75">Ones</text>
       <text x="20" y="135" font-size="18" font-family="monospace">1 , 5 0 , 0 0 0</text>
       <text x="20" y="165" font-size="12">comma after 3 digits, then after 2 (3-2-2 from the right)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading or writing large counts and prices (fish catches, ₹ amounts, populations)", "Putting commas correctly in Indian figures"],
      use_other_when: ["Only a rough size is needed → round/estimate instead of exact place value"],
    },
    edge_cases: [
      { case: "99,999 + 1", value: "1,00,000 (one lakh)", reasoning: "The largest 5-digit number rolls over into the smallest 6-digit number.", where_it_appears: "Thousands → lakhs boundary." },
      { case: "Zero as a place-holder, e.g. 1,05,007", value: "the 0s hold places", reasoning: "Dropping the zeros changes every other digit's value.", where_it_appears: "Numbers with empty middle places." },
    ],
    video_script_hooks: {
      opening_hook: "A single fishing harbour can sell more than a LAKH fish in one morning. How do you even write that number — and where do the commas go?",
      concept_reveal: "One lakh is 1 followed by five zeros (1,00,000). In the Indian system you group from the right: three digits, then twos.",
    },
  },

  math5_ch1_money_fish: {
    key_formulas: [
      { formula: "Total cost = rate × quantity", explanation: "e.g. 8 kg of fish at ₹60/kg = 8 × 60 = ₹480." },
      { formula: "₹1 = 100 paise", explanation: "Rupees and paise are written with a decimal point: ₹12.50 = 12 rupees 50 paise." },
      { formula: "Change = amount paid − total cost", explanation: "What the seller returns to the buyer." },
    ],
    prerequisite_knowledge: ["multiplication of 2-3 digit numbers", "addition and subtraction of money", "decimal point for rupees and paise"],
    visual_description: "A simple shop bill listing fish items with rate × quantity = amount for each row, the amounts added to a total at the bottom, and a 'paid − total = change' line below it.",
    svg_diagrams: [svg("math5_ch1_money_bill", "A fish-market bill",
      `<text x="20" y="26" font-weight="bold">Fish market bill</text>
       <line x1="20" y1="38" x2="400" y2="38" stroke="#475569"/>
       <text x="20" y="60">Rohu   8 kg × ₹60  = ₹480</text>
       <text x="20" y="84">Prawns 2 kg × ₹150 = ₹300</text>
       <line x1="20" y1="96" x2="400" y2="96" stroke="#475569"/>
       <text x="20" y="120" font-weight="bold">Total = ₹780</text>
       <text x="20" y="150">Paid ₹1000 → Change = 1000 − 780 = ₹220</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Working out the cost of several items", "Calculating change", "Comparing prices per kg"],
      use_other_when: ["Comparing without buying → just compare rates, no totals needed"],
    },
    edge_cases: [
      { case: "₹12.5 vs ₹12.50", value: "same amount", reasoning: "Trailing zeros after the decimal don't change the value (50 paise).", where_it_appears: "Writing money amounts." },
      { case: "75 paise added to ₹4.50", value: "₹5.25", reasoning: "Convert to paise (450 + 75 = 525) then back to rupees.", where_it_appears: "Mixing rupees and paise." },
    ],
    video_script_hooks: {
      opening_hook: "The fish-seller shouts '₹60 a kilo!' You buy 8 kilos and hand over a ₹500 note plus more. How much, and what's your change?",
      concept_reveal: "Cost is just rate × quantity; change is what you paid minus that cost. Keep rupees and paise lined up at the decimal point.",
    },
  },

  math5_ch1_scale_distance: {
    key_formulas: [
      { formula: "Distance = speed × time", explanation: "A boat at 20 km/h for 3 h covers 20 × 3 = 60 km." },
      { formula: "1 km = 1000 m", explanation: "Convert kilometres to metres by multiplying by 1000." },
    ],
    prerequisite_knowledge: ["multiplication", "units of length (m, km)", "reading a number line / scale"],
    visual_description: "A horizontal distance line marked 0 km to 60 km with a boat icon at 0 and a harbour at 60; a label shows speed 20 km/h × time 3 h = 60 km, illustrating distance as repeated speed.",
    svg_diagrams: [svg("math5_ch1_scale_distance_line", "Distance = speed × time",
      `<text x="20" y="26" font-weight="bold">Boat: 20 km/h for 3 hours</text>
       <line x1="30" y1="100" x2="520" y2="100" stroke="#475569" stroke-width="2"/>
       ${[0,1,2,3].map(i=>`<line x1="${30+i*163}" y1="92" x2="${30+i*163}" y2="108" stroke="#475569"/><text x="${30+i*163}" y="130" text-anchor="middle">${i*20} km</text>`).join("")}
       <text x="20" y="165">20 × 3 = 60 km total</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding how far something travels in a given time", "Converting between km and m"],
      use_other_when: ["Speed changes during the trip → break it into parts and add the distances"],
    },
    edge_cases: [
      { case: "Time given in half-hours, e.g. 2½ h at 20 km/h", value: "50 km", reasoning: "20 × 2.5 = 50; convert the fraction of time before multiplying.", where_it_appears: "Mixed-unit time." },
      { case: "Answer asked in metres", value: "× 1000", reasoning: "60 km = 60,000 m — match the unit the question wants.", where_it_appears: "Unit mismatch traps." },
    ],
    video_script_hooks: {
      opening_hook: "A fishing boat chugs along at 20 km every hour. Leave at sunrise, sail for 3 hours — how far out to sea are you?",
      concept_reveal: "Distance is just speed added up over time: speed × time. And remember, 1 km is 1000 m when the units must match.",
    },
  },

  math5_ch1_weight_fish: {
    key_formulas: [
      { formula: "1 kg = 1000 g", explanation: "Convert kilograms to grams by multiplying by 1000." },
      { formula: "1 quintal = 100 kg", explanation: "A quintal is used for medium bulk loads like a catch of fish." },
      { formula: "1 tonne = 1000 kg = 10 quintals", explanation: "A tonne is for very heavy loads (a whale shark, a truckload)." },
    ],
    prerequisite_knowledge: ["multiplication and division by 10/100/1000", "units of weight (g, kg)", "addition of measures"],
    visual_description: "A weight ladder showing 1000 g = 1 kg, 100 kg = 1 quintal, 1000 kg = 1 tonne, with a fish icon beside kg, a basket beside quintal, and a large fish beside tonne to give a sense of scale.",
    svg_diagrams: [svg("math5_ch1_weight_ladder", "Units of weight",
      `<text x="20" y="26" font-weight="bold">Weight units</text>
       <rect x="20" y="44" width="180" height="34" fill="#dbeafe" stroke="#1d4ed8"/><text x="32" y="66">1 kg = 1000 g</text>
       <rect x="20" y="86" width="180" height="34" fill="#fef9c3" stroke="#a16207"/><text x="32" y="108">1 quintal = 100 kg</text>
       <rect x="20" y="128" width="180" height="34" fill="#fee2e2" stroke="#b91c1c"/><text x="32" y="150">1 tonne = 1000 kg</text>
       <text x="230" y="108">a catch of fish ≈ 1 quintal</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Totalling weights of a catch", "Converting between g, kg, quintal and tonne", "Comparing heavy loads"],
      use_other_when: ["Very light items (a single prawn) → grams alone are enough; no conversion needed"],
    },
    edge_cases: [
      { case: "2500 g expressed in kg", value: "2.5 kg", reasoning: "Divide grams by 1000; the remainder becomes the decimal part.", where_it_appears: "g → kg conversion." },
      { case: "Adding 1 quintal 50 kg + 70 kg", value: "2 quintals 20 kg", reasoning: "Carry into the next unit once you cross 100 kg.", where_it_appears: "Mixed-unit addition." },
    ],
    video_script_hooks: {
      opening_hook: "One boat lands 250 kg of fish, another lands 1 quintal 80 kg. Who caught more — and how do you even add those?",
      concept_reveal: "Climb the weight ladder: 1000 g make a kg, 100 kg make a quintal, 1000 kg make a tonne. Convert to the same rung, then compare or add.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 2 — Shapes and Angles
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch2_angles_intro: {
    key_formulas: [
      { formula: "Angle = two rays sharing one endpoint (the vertex)", explanation: "An angle is the amount of turn between two rays that start from the same point." },
      { formula: "Bigger opening = bigger angle (arm length does NOT matter)", explanation: "Stretching the arms longer does not change the angle; only the spread between them counts." },
    ],
    prerequisite_knowledge: ["points, lines and rays", "the idea of a corner or turn", "left/right and clockwise turning"],
    visual_description: "Two rays starting from a single vertex point, with a small arc drawn between them to mark the angle and the opening labelled.",
    svg_diagrams: [svg("math5_ch2_angles_intro_diagram", "Two rays from a vertex", `<text x="20" y="26" font-weight="bold">An angle = turn between 2 rays</text><circle cx="80" cy="150" r="4" fill="#a16207"/><text x="40" y="170">vertex</text><line x1="80" y1="150" x2="320" y2="150" stroke="#1d4ed8" stroke-width="3"/><line x1="80" y1="150" x2="280" y2="50" stroke="#1d4ed8" stroke-width="3"/><path d="M150 150 A70 70 0 0 0 130 110" fill="none" stroke="#dc2626" stroke-width="2"/><text x="160" y="120">angle</text>`)],
    when_to_use_this_method: { use_this_when: ["Describing a corner, a turn, or how wide something opens"], use_other_when: ["You need the exact size in degrees → measure with a protractor"] },
    edge_cases: [{ case: "Same opening, longer arms", value: "Same angle", reasoning: "The angle depends only on the turn, not on how long the rays are drawn.", where_it_appears: "Comparing a small clock hand to a long one." }],
    video_script_hooks: { opening_hook: "Open a pair of scissors a little, then a lot — that growing gap between the blades IS an angle!", concept_reveal: "An angle is the amount of turn between two rays that share one corner point called the vertex." },
  },
  math5_ch2_measuring_angles: {
    key_formulas: [
      { formula: "Measure with a protractor: place centre on the vertex, 0° line on one ray, read where the other ray crosses", explanation: "Line up the protractor's midpoint with the corner and read the scale the other arm points to." },
      { formula: "A protractor reads from 0° to 180°", explanation: "Half a full turn is 180°; a full turn around a point is 360°." },
    ],
    prerequisite_knowledge: ["what an angle and a vertex are", "reading a number scale", "the unit 'degree' (°)"],
    visual_description: "A semicircular protractor placed on an angle with its centre on the vertex and its baseline along one ray, the other ray crossing the curved scale.",
    svg_diagrams: [svg("math5_ch2_measuring_angles_diagram", "Reading a protractor", `<text x="20" y="26" font-weight="bold">Centre on vertex, 0 on one arm</text><path d="M120 150 A130 130 0 0 1 380 150" fill="#eff6ff" stroke="#1d4ed8" stroke-width="2"/><line x1="120" y1="150" x2="380" y2="150" stroke="#1d4ed8" stroke-width="2"/><circle cx="250" cy="150" r="4" fill="#a16207"/><line x1="250" y1="150" x2="380" y2="150" stroke="#15803d" stroke-width="3"/><line x1="250" y1="150" x2="330" y2="40" stroke="#15803d" stroke-width="3"/><text x="300" y="120">read here</text>`)],
    when_to_use_this_method: { use_this_when: ["You need the exact size of an angle in degrees"], use_other_when: ["You only need to name it acute/right/obtuse → compare to 90°"] },
    edge_cases: [{ case: "Reading the wrong scale", value: "e.g. 130° vs 50°", reasoning: "Protractors have two scales; start from the 0° that sits on your ray.", where_it_appears: "Acute angle accidentally read as obtuse." }],
    video_script_hooks: { opening_hook: "A protractor is like a half-pizza ruler — it tells you EXACTLY how wide your angle opens!", concept_reveal: "Put the protractor's centre dot on the vertex, line up 0° with one arm, and read where the other arm crosses the scale." },
  },
  math5_ch2_shapes_angles: {
    key_formulas: [
      { formula: "Square / rectangle: all 4 corners are right angles = 90° each", explanation: "Every corner of a square or rectangle is a perfect right angle." },
      { formula: "Triangle: the 3 angles add up to 180°", explanation: "The three corners of any triangle always total 180°." },
    ],
    prerequisite_knowledge: ["naming basic shapes", "what a right angle (90°) is", "measuring angles with a protractor"],
    visual_description: "A square with a small right-angle box in each corner beside a triangle with its three corner angles marked.",
    svg_diagrams: [svg("math5_ch2_shapes_angles_diagram", "Angles inside shapes", `<text x="20" y="26" font-weight="bold">Square: 90° corners | Triangle: 180° total</text><rect x="40" y="60" width="110" height="110" fill="#fef9c3" stroke="#a16207" stroke-width="2"/><rect x="40" y="60" width="16" height="16" fill="none" stroke="#dc2626"/><polygon points="280,170 420,170 350,60" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/><text x="300" y="162">60</text><text x="395" y="162">60</text><text x="345" y="95">60</text>`)],
    when_to_use_this_method: { use_this_when: ["Finding a missing angle inside a known shape"], use_other_when: ["The shape is irregular → measure each angle with a protractor"] },
    edge_cases: [{ case: "Triangle with two known angles 90° and 50°", value: "Third = 40°", reasoning: "180 − 90 − 50 = 40 because the three angles total 180°.", where_it_appears: "Finding a missing triangle angle." }],
    video_script_hooks: { opening_hook: "Why does a window frame never wobble? Every corner is a perfect 90° right angle!", concept_reveal: "Shapes hide angles inside them: squares have four 90° corners, and a triangle's three corners always add up to 180°." },
  },
  math5_ch2_types_angles: {
    key_formulas: [
      { formula: "Acute < 90°, Right = 90°, Obtuse between 90° and 180°, Straight = 180°", explanation: "Sort angles by comparing their size to a right angle (90°) and a straight line (180°)." },
      { formula: "Right angle = a perfect square corner = 90°", explanation: "A right angle looks like the corner of a book or tile." },
    ],
    prerequisite_knowledge: ["what an angle is", "the number 90 and 180", "comparing sizes (more than / less than)"],
    visual_description: "Four angles side by side: a narrow acute angle, a square-cornered right angle, a wide obtuse angle, and a flat straight angle.",
    svg_diagrams: [svg("math5_ch2_types_angles_diagram", "Acute, Right, Obtuse, Straight", `<text x="20" y="26" font-weight="bold">&lt;90 acute | =90 right | &gt;90 obtuse | 180 straight</text><line x1="40" y1="150" x2="110" y2="150" stroke="#1d4ed8" stroke-width="3"/><line x1="40" y1="150" x2="95" y2="100" stroke="#1d4ed8" stroke-width="3"/><text x="50" y="175">acute</text><line x1="160" y1="150" x2="220" y2="150" stroke="#15803d" stroke-width="3"/><line x1="160" y1="150" x2="160" y2="90" stroke="#15803d" stroke-width="3"/><rect x="160" y="135" width="15" height="15" fill="none" stroke="#dc2626"/><text x="165" y="175">right</text><line x1="280" y1="150" x2="350" y2="150" stroke="#b45309" stroke-width="3"/><line x1="280" y1="150" x2="240" y2="105" stroke="#b45309" stroke-width="3"/><text x="285" y="175">obtuse</text><line x1="400" y1="150" x2="520" y2="150" stroke="#7c3aed" stroke-width="3"/><text x="430" y="175">straight</text>`)],
    when_to_use_this_method: { use_this_when: ["Naming or sorting angles by their size"], use_other_when: ["You need the exact degree value → use a protractor"] },
    edge_cases: [{ case: "Angle measured as exactly 90°", value: "Right angle", reasoning: "Not acute and not obtuse — 90° is the dividing line.", where_it_appears: "Corner of a book, tile, or window." }],
    video_script_hooks: { opening_hook: "Angles have personalities: tiny and sharp, perfectly square, lazy and wide, or totally flat — which is which?", concept_reveal: "Compare every angle to 90°: smaller is acute, exactly 90° is right, bigger is obtuse, and a flat 180° line is straight." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 3 — How Many Squares? (area & perimeter on grids)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch3_area_grids: {
    key_formulas: [
      { formula: "Area = number of unit squares that cover a shape", explanation: "Count how many whole squares fit inside; each square is 1 square unit." },
      { formula: "Area unit = square units (e.g. square cm)", explanation: "Area is always measured in squares, not in straight lengths." },
    ],
    prerequisite_knowledge: ["counting", "what a square is", "the idea of covering a surface"],
    visual_description: "A shape drawn on a grid with each unit square inside it shaded and numbered to show the total count.",
    svg_diagrams: [svg("math5_ch3_area_grids_diagram", "Counting unit squares", `<text x="20" y="26" font-weight="bold">Area = count the squares inside</text><rect x="60" y="50" width="160" height="120" fill="#dcfce7" stroke="#15803d" stroke-width="2"/><line x1="100" y1="50" x2="100" y2="170" stroke="#15803d"/><line x1="140" y1="50" x2="140" y2="170" stroke="#15803d"/><line x1="180" y1="50" x2="180" y2="170" stroke="#15803d"/><line x1="60" y1="90" x2="220" y2="90" stroke="#15803d"/><line x1="60" y1="130" x2="220" y2="130" stroke="#15803d"/><text x="250" y="115">12 squares</text>`)],
    when_to_use_this_method: { use_this_when: ["Finding area of any shape drawn on a grid"], use_other_when: ["It is a plain rectangle → use length × breadth"] },
    edge_cases: [{ case: "Square partly covered", value: "Count as part, not whole", reasoning: "Only fully covered squares count as 1; partial squares are handled separately.", where_it_appears: "Edges of curved or slanted shapes." }],
    video_script_hooks: { opening_hook: "How many floor tiles cover your bedroom? Counting those tiles is exactly how we find area!", concept_reveal: "Area is just how many unit squares it takes to completely cover a shape — so we count the squares." },
  },
  math5_ch3_area_irregular: {
    key_formulas: [
      { formula: "Area ≈ full squares + (half squares ÷ 2)", explanation: "Add up the whole squares, then pair up two half-squares to make one whole." },
      { formula: "Two halves = 1 whole square", explanation: "Combine matching half-squares to count them as complete units." },
    ],
    prerequisite_knowledge: ["counting unit squares for area", "the idea of one half (½)", "adding numbers"],
    visual_description: "An irregular blob on a grid where whole squares are marked W and half-covered edge squares are marked H to be paired up.",
    svg_diagrams: [svg("math5_ch3_area_irregular_diagram", "Whole and half squares", `<text x="20" y="26" font-weight="bold">Full squares + pairs of halves</text><rect x="60" y="50" width="200" height="120" fill="none" stroke="#94a3b8"/><line x1="100" y1="50" x2="100" y2="170" stroke="#94a3b8"/><line x1="140" y1="50" x2="140" y2="170" stroke="#94a3b8"/><line x1="180" y1="50" x2="180" y2="170" stroke="#94a3b8"/><line x1="220" y1="50" x2="220" y2="170" stroke="#94a3b8"/><line x1="60" y1="90" x2="260" y2="90" stroke="#94a3b8"/><line x1="60" y1="130" x2="260" y2="130" stroke="#94a3b8"/><path d="M70 90 L150 60 L240 100 L210 160 L90 150 Z" fill="#fde68a" fill-opacity="0.6" stroke="#b45309" stroke-width="2"/><text x="300" y="115">count W + ½ + ½</text>`)],
    when_to_use_this_method: { use_this_when: ["A shape on a grid has bumpy or slanted edges"], use_other_when: ["Every square is fully whole → just count them"] },
    edge_cases: [{ case: "More than half a square covered", value: "Count as 1 whole", reasoning: "A common rule: round up squares that are more than half filled and ignore those less than half.", where_it_appears: "Tracing a leaf or footprint on grid paper." }],
    video_script_hooks: { opening_hook: "Trace your own hand on grid paper — how do you count the squares the curvy edge only half-covers?", concept_reveal: "Count all the whole squares, then join two half-squares together to make one more whole square." },
  },
  math5_ch3_area_rectangles: {
    key_formulas: [
      { formula: "Area of rectangle = length × breadth", explanation: "Multiply the two side lengths; the rows × columns of squares give the total." },
      { formula: "Area of square = side × side", explanation: "A square is a rectangle with equal sides, so multiply a side by itself." },
    ],
    prerequisite_knowledge: ["multiplication facts", "counting unit squares as area", "measuring length and breadth"],
    visual_description: "A rectangle split into a grid of rows and columns showing that length × breadth equals the total unit squares.",
    svg_diagrams: [svg("math5_ch3_area_rectangles_diagram", "Length × breadth", `<text x="20" y="26" font-weight="bold">5 × 3 = 15 squares</text><rect x="60" y="60" width="250" height="120" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/><line x1="110" y1="60" x2="110" y2="180" stroke="#1d4ed8"/><line x1="160" y1="60" x2="160" y2="180" stroke="#1d4ed8"/><line x1="210" y1="60" x2="210" y2="180" stroke="#1d4ed8"/><line x1="260" y1="60" x2="260" y2="180" stroke="#1d4ed8"/><line x1="60" y1="100" x2="310" y2="100" stroke="#1d4ed8"/><line x1="60" y1="140" x2="310" y2="140" stroke="#1d4ed8"/><text x="150" y="200">length = 5</text><text x="330" y="125">breadth = 3</text>`)],
    when_to_use_this_method: { use_this_when: ["Finding area of a rectangle or square when sides are known"], use_other_when: ["Shape is irregular → count squares on a grid"] },
    edge_cases: [{ case: "Length 6 cm, breadth 4 cm", value: "24 sq cm", reasoning: "6 × 4 = 24; the answer is in square units, not cm.", where_it_appears: "Area of a tabletop or notebook cover." }],
    video_script_hooks: { opening_hook: "Instead of counting 24 floor tiles one by one, what if you could find the answer in ONE multiplication?", concept_reveal: "A rectangle's area is just rows times columns of squares — that is length × breadth." },
  },
  math5_ch3_perimeter_area: {
    key_formulas: [
      { formula: "Perimeter = total distance around the edge (add all sides)", explanation: "Walk around the boundary and add up every side length." },
      { formula: "Same perimeter ≠ same area", explanation: "Two shapes can have the same fence length but cover different amounts of space." },
    ],
    prerequisite_knowledge: ["adding side lengths", "area as counting squares", "what 'around' versus 'inside' means"],
    visual_description: "Two rectangles with the same perimeter but different shapes, one long-thin and one near-square, showing different square counts inside.",
    svg_diagrams: [svg("math5_ch3_perimeter_area_diagram", "Same perimeter, different area", `<text x="20" y="26" font-weight="bold">Perimeter 12, but areas differ</text><rect x="40" y="60" width="200" height="40" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/><text x="60" y="125">5×1 = area 5</text><rect x="320" y="60" width="120" height="80" fill="#dcfce7" stroke="#15803d" stroke-width="2"/><text x="320" y="165">4×2 = area 8</text>`)],
    when_to_use_this_method: { use_this_when: ["Comparing the boundary length (fence) with the space inside (floor)"], use_other_when: ["You only need space covered → find area alone"] },
    edge_cases: [{ case: "5×1 vs 3×3 rectangles", value: "Perimeter 12 each; areas 5 vs 9", reasoning: "Equal perimeters can give very different areas; the squarer shape holds more.", where_it_appears: "Fencing the same length around different fields." }],
    video_script_hooks: { opening_hook: "Two farmers use the exact same length of fence — but one grows way more crops. How?", concept_reveal: "Perimeter is the distance around the edge; area is the squares inside — and equal perimeters do NOT mean equal areas." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 4 — Parts and Wholes (fractions)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch4_comparing_fractions: {
    key_formulas: [
      { formula: "Same denominator: bigger numerator = bigger fraction", explanation: "If the bottoms match, the fraction with the larger top is greater (3/5 > 2/5)." },
      { formula: "Different denominators: rewrite with a common denominator, then compare numerators", explanation: "Make the bottoms equal first, then compare the tops." },
    ],
    prerequisite_knowledge: ["what numerator and denominator mean", "equivalent fractions", "multiplication tables"],
    visual_description: "Two equal bars split into different numbers of parts with shaded portions lined up to show which fraction is larger.",
    svg_diagrams: [svg("math5_ch4_comparing_fractions_diagram", "Comparing 1/2 and 1/3", `<text x="20" y="26" font-weight="bold">1/2 &gt; 1/3</text><rect x="40" y="60" width="240" height="40" fill="none" stroke="#1d4ed8" stroke-width="2"/><rect x="40" y="60" width="120" height="40" fill="#bfdbfe"/><line x1="160" y1="60" x2="160" y2="100" stroke="#1d4ed8"/><text x="120" y="125">1/2</text><rect x="40" y="140" width="240" height="40" fill="none" stroke="#15803d" stroke-width="2"/><rect x="40" y="140" width="80" height="40" fill="#bbf7d0"/><line x1="120" y1="140" x2="120" y2="180" stroke="#15803d"/><line x1="200" y1="140" x2="200" y2="180" stroke="#15803d"/><text x="120" y="205">1/3</text>`)],
    when_to_use_this_method: { use_this_when: ["Deciding which of two fractions is greater or smaller"], use_other_when: ["Fractions are already equal in value → check equivalence instead"] },
    edge_cases: [{ case: "Compare 2/3 and 3/4", value: "3/4 is greater", reasoning: "Common denominator 12: 2/3 = 8/12, 3/4 = 9/12, and 9 > 8.", where_it_appears: "Sharing pizza slices of different sizes." }],
    video_script_hooks: { opening_hook: "Would you rather have 1/2 of a chocolate bar or 1/3? Bigger bottom number, smaller piece — surprised?", concept_reveal: "If the bottoms match, the bigger top wins; if not, make the bottoms the same first, then compare the tops." },
  },
  math5_ch4_equivalent_fractions: {
    key_formulas: [
      { formula: "Multiply OR divide top and bottom by the same number → equivalent fraction", explanation: "1/2 = 2/4 = 3/6 because both parts changed by the same factor." },
      { formula: "Simplest form: divide top and bottom by their common factor", explanation: "Reduce until no number divides both, e.g. 4/8 = 1/2." },
    ],
    prerequisite_knowledge: ["numerator and denominator", "multiplication and division facts", "factors of a number"],
    visual_description: "Two same-size bars: one split into 2 parts with 1 shaded, the other into 4 parts with 2 shaded, covering the same amount.",
    svg_diagrams: [svg("math5_ch4_equivalent_fractions_diagram", "1/2 = 2/4", `<text x="20" y="26" font-weight="bold">1/2 = 2/4 (same shaded part)</text><rect x="40" y="60" width="240" height="40" fill="none" stroke="#1d4ed8" stroke-width="2"/><rect x="40" y="60" width="120" height="40" fill="#bfdbfe"/><line x1="160" y1="60" x2="160" y2="100" stroke="#1d4ed8"/><text x="120" y="125">1/2</text><rect x="40" y="140" width="240" height="40" fill="none" stroke="#15803d" stroke-width="2"/><rect x="40" y="140" width="120" height="40" fill="#bbf7d0"/><line x1="100" y1="140" x2="100" y2="180" stroke="#15803d"/><line x1="160" y1="140" x2="160" y2="180" stroke="#15803d"/><line x1="220" y1="140" x2="220" y2="180" stroke="#15803d"/><text x="120" y="205">2/4</text>`)],
    when_to_use_this_method: { use_this_when: ["Making fractions match for comparing or adding, or simplifying an answer"], use_other_when: ["Bottoms already match → just compare or add the tops"] },
    edge_cases: [{ case: "6/8 in simplest form", value: "3/4", reasoning: "Divide top and bottom by their common factor 2.", where_it_appears: "Writing a final fraction answer neatly." }],
    video_script_hooks: { opening_hook: "Cut a pizza into 2 or into 4 — eat the same amount and you've found two names for the SAME slice!", concept_reveal: "Multiply or divide the top and bottom by the same number and the fraction's value stays exactly the same." },
  },
  math5_ch4_fraction_operations: {
    key_formulas: [
      { formula: "Like denominators: add/subtract numerators, keep the denominator", explanation: "2/5 + 1/5 = 3/5; the bottom stays the same because the pieces are the same size." },
      { formula: "Fraction of a quantity = (fraction) × quantity", explanation: "1/3 of 12 = 12 ÷ 3 = 4." },
    ],
    prerequisite_knowledge: ["meaning of a fraction", "like denominators", "division and multiplication facts"],
    visual_description: "A bar divided into fifths with 2 parts then 1 more part shaded to show 2/5 + 1/5 = 3/5.",
    svg_diagrams: [svg("math5_ch4_fraction_operations_diagram", "2/5 + 1/5 = 3/5", `<text x="20" y="26" font-weight="bold">2/5 + 1/5 = 3/5</text><rect x="40" y="70" width="250" height="50" fill="none" stroke="#1d4ed8" stroke-width="2"/><rect x="40" y="70" width="100" height="50" fill="#bfdbfe"/><rect x="140" y="70" width="50" height="50" fill="#93c5fd"/><line x1="90" y1="70" x2="90" y2="120" stroke="#1d4ed8"/><line x1="140" y1="70" x2="140" y2="120" stroke="#1d4ed8"/><line x1="190" y1="70" x2="190" y2="120" stroke="#1d4ed8"/><line x1="240" y1="70" x2="240" y2="120" stroke="#1d4ed8"/><text x="120" y="150">2 shaded + 1 more = 3 of 5</text>`)],
    when_to_use_this_method: { use_this_when: ["Adding/subtracting fractions with equal bottoms, or finding a fraction of a number"], use_other_when: ["Denominators differ → make them equal first (common denominator)"] },
    edge_cases: [{ case: "1/2 + 1/4 (unlike)", value: "3/4", reasoning: "Rewrite 1/2 as 2/4, then 2/4 + 1/4 = 3/4; you must match denominators first.", where_it_appears: "Adding half a cup and a quarter cup." }],
    video_script_hooks: { opening_hook: "You eat 2 slices, your friend eats 1 more — all from the same 5-slice pizza. How much is gone?", concept_reveal: "When the bottoms match, just add or subtract the tops; to take a fraction OF a number, multiply (or divide into equal groups)." },
  },
  math5_ch4_fractions_review: {
    key_formulas: [
      { formula: "Proper fraction: numerator < denominator (less than 1, e.g. 3/4)", explanation: "The top is smaller than the bottom, so it is part of one whole." },
      { formula: "Improper fraction: numerator ≥ denominator (1 or more, e.g. 5/4)", explanation: "The top is equal to or bigger than the bottom, so it is one whole or more." },
    ],
    prerequisite_knowledge: ["numerator and denominator", "the number line", "the idea of one whole"],
    visual_description: "A number line from 0 to 2 marked in quarters with 3/4 shown before 1 and 5/4 shown just after 1.",
    svg_diagrams: [svg("math5_ch4_fractions_review_diagram", "Fractions on a number line", `<text x="20" y="26" font-weight="bold">Proper &lt;1 (3/4) | Improper &ge;1 (5/4)</text><line x1="40" y1="120" x2="520" y2="120" stroke="#334155" stroke-width="2"/><line x1="40" y1="112" x2="40" y2="128" stroke="#334155" stroke-width="2"/><text x="35" y="150">0</text><line x1="280" y1="112" x2="280" y2="128" stroke="#334155" stroke-width="2"/><text x="275" y="150">1</text><line x1="520" y1="112" x2="520" y2="128" stroke="#334155" stroke-width="2"/><text x="515" y="150">2</text><circle cx="220" cy="120" r="5" fill="#1d4ed8"/><text x="200" y="105">3/4</text><circle cx="340" cy="120" r="5" fill="#dc2626"/><text x="325" y="105">5/4</text>`)],
    when_to_use_this_method: { use_this_when: ["Naming a fraction's type or placing it on a number line"], use_other_when: ["You need to combine fractions → use fraction operations"] },
    edge_cases: [{ case: "4/4", value: "Equals 1 whole", reasoning: "Numerator equals denominator, so all parts make exactly one whole.", where_it_appears: "Boundary between proper and improper fractions." }],
    video_script_hooks: { opening_hook: "Can a fraction be BIGGER than a whole pizza? Meet 5/4 — that's one whole pizza plus an extra slice!", concept_reveal: "A proper fraction is less than one whole; an improper fraction is one whole or more, and every fraction has its own spot on the number line." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 5 — Does it Look the Same? (symmetry)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch5_symmetry_intro: {
    key_formulas: [ { formula: "A figure has line (mirror) symmetry if a fold along a line maps the figure exactly onto itself", explanation: "The fold line is the line of symmetry; the two halves match perfectly like an object and its mirror image." } ],
    prerequisite_knowledge: ["Recognising basic 2D shapes (square, rectangle, triangle, circle)", "Understanding left and right halves of a picture"],
    visual_description: "A butterfly with a vertical dashed line down its middle showing the left and right wings as mirror images.",
    svg_diagrams: [svg("math5_ch5_symmetry_intro_diagram", "Mirror line", `<text x="20" y="26" font-weight="bold">Line of symmetry: two halves match</text><line x1="280" y1="50" x2="280" y2="180" stroke="red" stroke-dasharray="6 5"/><polygon points="280,90 230,60 220,120 280,140" fill="#cfe8ff" stroke="#333"/><polygon points="280,90 330,60 340,120 280,140" fill="#cfe8ff" stroke="#333"/><text x="200" y="195">left half</text><text x="340" y="195">right half</text>`)],
    when_to_use_this_method: { use_this_when: ["Checking if a shape can be folded so both halves coincide", "Identifying mirror images in pictures, letters or objects"], use_other_when: ["The shape only looks the same after a turn, not a fold (use rotational symmetry)", "You are measuring lengths or angles instead of matching halves"] },
    edge_cases: [ { case: "Letter S looks symmetric but is not by folding", value: "0 lines of symmetry", reasoning: "No fold line makes the two halves match; it matches only under a half-turn.", where_it_appears: "Sorting letters by line symmetry" } ],
    video_script_hooks: { opening_hook: "Fold a butterfly right down the middle and POOF - both wings land perfectly on top of each other!", concept_reveal: "A shape has line symmetry when one fold makes the two halves match exactly, like a shape and its mirror." },
  },
  math5_ch5_line_symmetry: {
    key_formulas: [ { formula: "Number of lines of symmetry = number of distinct fold lines that map a figure onto itself", explanation: "Some figures have 0, some 1, some many; a circle has infinitely many." } ],
    prerequisite_knowledge: ["Idea of a line of symmetry as a fold line", "Names and shapes of common polygons"],
    visual_description: "A square with its 4 lines of symmetry (2 diagonals and 2 mid-lines) drawn as dashed lines.",
    svg_diagrams: [svg("math5_ch5_line_symmetry_diagram", "Lines of symmetry of a square", `<text x="20" y="26" font-weight="bold">A square has 4 lines of symmetry</text><rect x="220" y="60" width="120" height="120" fill="#eef" stroke="#333"/><line x1="280" y1="60" x2="280" y2="180" stroke="red" stroke-dasharray="5 4"/><line x1="220" y1="120" x2="340" y2="120" stroke="red" stroke-dasharray="5 4"/><line x1="220" y1="60" x2="340" y2="180" stroke="red" stroke-dasharray="5 4"/><line x1="340" y1="60" x2="220" y2="180" stroke="red" stroke-dasharray="5 4"/>`)],
    when_to_use_this_method: { use_this_when: ["Counting how many fold lines a figure has", "Comparing shapes by how symmetric they are"], use_other_when: ["The figure has no fold line but repeats after a turn (rotational symmetry)", "You only need to know it has symmetry, not how many lines"] },
    edge_cases: [ { case: "Scalene triangle", value: "0 lines of symmetry", reasoning: "All three sides differ, so no fold maps it onto itself.", where_it_appears: "Sorting triangles by symmetry" }, { case: "Circle", value: "Infinitely many lines of symmetry", reasoning: "Any line through the centre is a line of symmetry.", where_it_appears: "Discussing the most symmetric shape" } ],
    video_script_hooks: { opening_hook: "How many ways can you fold a square so it matches itself? Bet you guess too low!", concept_reveal: "A square has 4 lines of symmetry, a rectangle has 2, and a circle has more than you can count." },
  },
  math5_ch5_rotational_symmetry: {
    key_formulas: [ { formula: "A figure has rotational symmetry if it looks exactly the same after a turn of less than a full circle about its centre", explanation: "The number of matching positions in one full 360 degree turn is the order of rotational symmetry." } ],
    prerequisite_knowledge: ["Idea of turning/rotating about a point", "Recognising when a shape looks the same as before"],
    visual_description: "A pinwheel-like four-blade motif that looks identical after a quarter turn about its centre point.",
    svg_diagrams: [svg("math5_ch5_rotational_symmetry_diagram", "Looks same after a turn", `<text x="20" y="26" font-weight="bold">Same after a 90 deg turn (order 4)</text><circle cx="280" cy="120" r="4" fill="#333"/><polygon points="280,120 280,65 305,80" fill="#9cf" stroke="#333"/><polygon points="280,120 335,120 320,95" fill="#9cf" stroke="#333"/><polygon points="280,120 280,175 255,160" fill="#9cf" stroke="#333"/><polygon points="280,120 225,120 240,145" fill="#9cf" stroke="#333"/><text x="200" y="195">centre = turn point</text>`)],
    when_to_use_this_method: { use_this_when: ["A shape repeats after a turn but cannot be folded to match", "Describing windmills, fan blades or rangoli that spin into themselves"], use_other_when: ["The shape matches by folding along a line (line symmetry)", "The shape never looks the same until a full 360 degree turn (no rotational symmetry)"] },
    edge_cases: [ { case: "Letter S", value: "Rotational symmetry of order 2", reasoning: "A half-turn (180 degrees) about its centre leaves it looking the same, even though it has no line symmetry.", where_it_appears: "Showing a shape can have rotational but not line symmetry" } ],
    video_script_hooks: { opening_hook: "Spin a pinwheel a quarter turn - it looks like nothing happened. That's a secret kind of symmetry!", concept_reveal: "Rotational symmetry means a shape looks the same after a turn about its centre, without any folding." },
  },
  math5_ch5_symmetry_designs: {
    key_formulas: [ { formula: "To make a symmetric design, draw on one side of a line and copy the mirror image on the other side", explanation: "Every point's reflection sits the same distance on the opposite side of the line of symmetry." } ],
    prerequisite_knowledge: ["Knowing what a line of symmetry is", "Reflecting a simple shape across a line"],
    visual_description: "A half-flower drawn on the left of a vertical mirror line with its reflected copy completing the flower on the right.",
    svg_diagrams: [svg("math5_ch5_symmetry_designs_diagram", "Make a mirror design", `<text x="20" y="26" font-weight="bold">Draw half, then mirror it</text><line x1="280" y1="50" x2="280" y2="180" stroke="red" stroke-dasharray="6 5"/><circle cx="250" cy="110" r="22" fill="#ffd" stroke="#333"/><circle cx="310" cy="110" r="22" fill="#ffd" stroke="#333"/><polygon points="250,132 245,170 255,170" fill="#7c5" stroke="#333"/><polygon points="310,132 305,170 315,170" fill="#7c5" stroke="#333"/><text x="210" y="60">drawn</text><text x="300" y="60">mirror</text>`)],
    when_to_use_this_method: { use_this_when: ["Creating rangoli, borders or patterns that must look balanced", "Completing the missing half of a symmetric picture"], use_other_when: ["The design repeats by turning rather than reflecting (use rotational designs)", "There is no mirror line and the design is random"] },
    edge_cases: [ { case: "Point lying on the mirror line", value: "Stays in place", reasoning: "Its distance from the line is zero, so its reflection is itself.", where_it_appears: "Drawing motifs that touch the fold line" } ],
    video_script_hooks: { opening_hook: "Want to draw a perfect rangoli? Do only half the work - a mirror does the rest!", concept_reveal: "If you draw one half and copy its mirror image across the line, your design is perfectly symmetric." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 6 — Be My Multiple, I'll be Your Factor (factors & multiples)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch6_factors: {
    key_formulas: [ { formula: "b is a factor of a if a divided by b leaves remainder 0", explanation: "Factors are the numbers that divide a number exactly; 1 and the number itself are always factors." } ],
    prerequisite_knowledge: ["Division with and without remainder", "Multiplication tables"],
    visual_description: "The number 12 with its factors 1, 2, 3, 4, 6, 12 shown as pairs of dots arranged in equal rows.",
    svg_diagrams: [svg("math5_ch6_factors_diagram", "Factors of 12", `<text x="20" y="26" font-weight="bold">Factors of 12: 1, 2, 3, 4, 6, 12</text><text x="30" y="70">12 = 1 x 12</text><text x="30" y="100">12 = 2 x 6</text><text x="30" y="130">12 = 3 x 4</text><text x="30" y="170">Each divides 12 with no remainder</text>`)],
    when_to_use_this_method: { use_this_when: ["Splitting a number into equal groups with nothing left over", "Listing all numbers that divide a given number exactly"], use_other_when: ["You want numbers you reach by counting up (use multiples)", "Division leaves a remainder, so it is not a factor"] },
    edge_cases: [ { case: "Factors of 1", value: "Only 1", reasoning: "1 is divided exactly only by itself.", where_it_appears: "Smallest factor lists" }, { case: "A prime number like 7", value: "Exactly two factors, 1 and 7", reasoning: "No other number divides 7 exactly.", where_it_appears: "Introducing prime numbers" } ],
    video_script_hooks: { opening_hook: "Can you share 12 sweets equally? The ways you can do it ARE the factors of 12!", concept_reveal: "A factor of a number divides it exactly with no remainder, and 1 and the number itself always count." },
  },
  math5_ch6_multiples: {
    key_formulas: [ { formula: "Multiples of n = n x 1, n x 2, n x 3, ... ", explanation: "You get multiples by skip counting; every number is a multiple of itself and of 1." } ],
    prerequisite_knowledge: ["Skip counting", "Multiplication tables"],
    visual_description: "A number line with jumps of 4 landing on 4, 8, 12, 16, 20 to show the multiples of 4.",
    svg_diagrams: [svg("math5_ch6_multiples_diagram", "Multiples of 4", `<text x="20" y="26" font-weight="bold">Multiples of 4: 4, 8, 12, 16, 20...</text><line x1="30" y1="120" x2="530" y2="120" stroke="#333"/><circle cx="120" cy="120" r="5" fill="#36c"/><text x="110" y="145">4</text><circle cx="220" cy="120" r="5" fill="#36c"/><text x="210" y="145">8</text><circle cx="320" cy="120" r="5" fill="#36c"/><text x="305" y="145">12</text><circle cx="420" cy="120" r="5" fill="#36c"/><text x="405" y="145">16</text><circle cx="520" cy="120" r="5" fill="#36c"/><text x="505" y="145">20</text>`)],
    when_to_use_this_method: { use_this_when: ["Listing numbers reached by repeated addition or a times table", "Finding when an event repeats (every 4th day, etc.)"], use_other_when: ["You want numbers that divide a number exactly (use factors)", "You need a finite list - multiples never end"] },
    edge_cases: [ { case: "Is 0 a multiple of any number?", value: "Yes, n x 0 = 0", reasoning: "Zero times any number is zero, so 0 is technically a multiple, though class lists usually start at n.", where_it_appears: "Careful listing of multiples" }, { case: "Smallest multiple of n (other than 0)", value: "n itself", reasoning: "n x 1 = n is the first counting multiple.", where_it_appears: "Finding the least multiple" } ],
    video_script_hooks: { opening_hook: "Hop, hop, hop along the number line in steps of 4 - every spot you land on is a multiple of 4!", concept_reveal: "Multiples of a number are what you get by skip counting it, and the list goes on forever." },
  },
  math5_ch6_common_factors: {
    key_formulas: [ { formula: "Common factors of a and b are numbers that divide both a and b exactly; the largest is the HCF", explanation: "Find each number's factors, then pick the ones that appear in both lists." } ],
    prerequisite_knowledge: ["Listing factors of a number", "Comparing two lists of numbers"],
    visual_description: "Two factor lists for 12 and 18 with their shared factors 1, 2, 3, 6 highlighted as the common factors.",
    svg_diagrams: [svg("math5_ch6_common_factors_diagram", "Common factors of 12 and 18", `<text x="20" y="26" font-weight="bold">Common factors of 12 and 18</text><text x="30" y="70">12: 1, 2, 3, 4, 6, 12</text><text x="30" y="100">18: 1, 2, 3, 6, 9, 18</text><text x="30" y="140" fill="#c00">Common: 1, 2, 3, 6</text><text x="30" y="175" fill="#070">Highest common factor (HCF) = 6</text>`)],
    when_to_use_this_method: { use_this_when: ["Finding a number that divides two quantities equally", "Working out the largest equal group size for two amounts (HCF)"], use_other_when: ["You need a number both counts reach (use common multiples / LCM)", "You only have one number to factorise"] },
    edge_cases: [ { case: "Common factor of any two numbers", value: "1 is always common", reasoning: "1 divides every number, so it is a common factor of every pair.", where_it_appears: "Numbers with no other common factor (co-prime, e.g. 8 and 9)" } ],
    video_script_hooks: { opening_hook: "Two piles of sweets, 12 and 18 - what's the biggest equal share you can make from both?", concept_reveal: "Common factors divide both numbers, and the biggest one is called the highest common factor, the HCF." },
  },
  math5_ch6_common_multiples: {
    key_formulas: [ { formula: "Common multiples of a and b appear in both their multiple lists; the smallest is the LCM", explanation: "List multiples of each number and find the ones they share; the first shared one is the least common multiple." } ],
    prerequisite_knowledge: ["Listing multiples of a number", "Comparing two lists of numbers"],
    visual_description: "Multiple lists of 4 and 6 with 12 and 24 circled as the common multiples and 12 marked as the smallest.",
    svg_diagrams: [svg("math5_ch6_common_multiples_diagram", "Common multiples of 4 and 6", `<text x="20" y="26" font-weight="bold">Common multiples of 4 and 6</text><text x="30" y="70">4: 4, 8, 12, 16, 20, 24...</text><text x="30" y="100">6: 6, 12, 18, 24, 30...</text><text x="30" y="140" fill="#c00">Common: 12, 24, 36...</text><text x="30" y="175" fill="#070">Least common multiple (LCM) = 12</text>`)],
    when_to_use_this_method: { use_this_when: ["Finding when two repeating events happen together again", "Working out the smallest amount both numbers count into (LCM)"], use_other_when: ["You need a number that divides both (use common factors / HCF)", "Only one number is involved"] },
    edge_cases: [ { case: "First common multiple of 4 and 6", value: "12", reasoning: "12 is the smallest number in both the 4-times and 6-times tables.", where_it_appears: "Finding the LCM" }, { case: "Common multiples never end", value: "12, 24, 36, ...", reasoning: "Each number has infinitely many multiples, so they keep sharing more.", where_it_appears: "Listing more than one common multiple" } ],
    video_script_hooks: { opening_hook: "One bell rings every 4 minutes, another every 6 - when do they ring together? Math knows!", concept_reveal: "Common multiples sit in both times tables, and the smallest one is the least common multiple, the LCM." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 7 — Can You See the Pattern? (patterns)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch7_number_patterns: {
    key_formulas: [ { formula: "Next term = previous term + rule (where the rule is a fixed add or multiply step)", explanation: "Spot the constant change between terms; apply the same rule to extend the sequence." } ],
    prerequisite_knowledge: ["Addition, subtraction and multiplication", "Comparing consecutive numbers"],
    visual_description: "The sequence 3, 6, 9, 12, 15 with +3 arrows between each pair of terms showing the constant rule.",
    svg_diagrams: [svg("math5_ch7_number_patterns_diagram", "Find the rule", `<text x="20" y="26" font-weight="bold">3, 6, 9, 12, 15  (rule: +3)</text><text x="40" y="90">3</text><text x="140" y="90">6</text><text x="240" y="90">9</text><text x="330" y="90">12</text><text x="430" y="90">15</text><text x="75" y="130">+3</text><text x="175" y="130">+3</text><text x="275" y="130">+3</text><text x="375" y="130">+3</text>`)],
    when_to_use_this_method: { use_this_when: ["A list of numbers changes by the same step each time", "You must predict the next number in a sequence"], use_other_when: ["The pattern is shapes or colours, not numbers (use shape patterns)", "The change between terms is not constant (look for a growing rule)"] },
    edge_cases: [ { case: "Multiplying rule like 2, 4, 8, 16", value: "Rule is x2, not +", reasoning: "The difference grows, but the ratio is constant, so the rule is multiply.", where_it_appears: "Distinguishing add-rules from multiply-rules" } ],
    video_script_hooks: { opening_hook: "3, 6, 9, 12... what comes next? Crack the secret rule and you can predict forever!", concept_reveal: "Number patterns follow one rule, like adding 3 each time, so finding the rule lets you continue the sequence." },
  },
  math5_ch7_shape_patterns: {
    key_formulas: [ { formula: "Find the repeating unit, then continue it to get the next term", explanation: "A repeating pattern is built from a core block that repeats; once you spot the block you can predict any term." } ],
    prerequisite_knowledge: ["Recognising shapes and colours", "Counting positions in a sequence"],
    visual_description: "A row of shapes circle, square, triangle, circle, square, triangle showing a repeating unit of three.",
    svg_diagrams: [svg("math5_ch7_shape_patterns_diagram", "Repeating unit", `<text x="20" y="26" font-weight="bold">Pattern repeats: circle, square, triangle</text><circle cx="70" cy="110" r="18" fill="#9cf" stroke="#333"/><rect x="120" y="92" width="36" height="36" fill="#fc9" stroke="#333"/><polygon points="210,92 192,128 228,128" fill="#9f9" stroke="#333"/><circle cx="290" cy="110" r="18" fill="#9cf" stroke="#333"/><rect x="340" y="92" width="36" height="36" fill="#fc9" stroke="#333"/><polygon points="430,92 412,128 448,128" fill="#9f9" stroke="#333"/><text x="470" y="115">?</text>`)],
    when_to_use_this_method: { use_this_when: ["A pattern uses repeating shapes or colours", "You must name the next item in a picture sequence"], use_other_when: ["The pattern is numbers with a calculation rule (use number patterns)", "Each term grows in size rather than repeating (use growing patterns)"] },
    edge_cases: [ { case: "Find the 10th term of a 3-shape repeat", value: "Same as the 1st (10 = 3x3 + 1)", reasoning: "Position 10 leaves remainder 1 when divided by the unit length 3, so it matches the first shape.", where_it_appears: "Predicting a far-away term without drawing all of them" } ],
    video_script_hooks: { opening_hook: "Circle, square, triangle, circle, square... your brain already wants to fill in the next one!", concept_reveal: "Repeating patterns are built from a small block that repeats, so spotting the block tells you what comes next." },
  },
  math5_ch7_growing_patterns: {
    key_formulas: [ { formula: "In a growing pattern each term increases by a rule, e.g. square numbers: 1, 4, 9, 16 (n x n)", explanation: "The amount added can itself grow; square numbers add the next odd number each time (+3, +5, +7...)." } ],
    prerequisite_knowledge: ["Number patterns with a fixed step", "Multiplying a number by itself"],
    visual_description: "Dot squares of sizes 1x1, 2x2, 3x3 giving 1, 4, 9 dots to show a growing square-number pattern.",
    svg_diagrams: [svg("math5_ch7_growing_patterns_diagram", "Square numbers grow", `<text x="20" y="26" font-weight="bold">1, 4, 9, 16  (square numbers)</text><rect x="40" y="120" width="16" height="16" fill="#36c"/><rect x="120" y="104" width="16" height="16" fill="#36c"/><rect x="138" y="104" width="16" height="16" fill="#36c"/><rect x="120" y="122" width="16" height="16" fill="#36c"/><rect x="138" y="122" width="16" height="16" fill="#36c"/><text x="40" y="170">1</text><text x="130" y="170">4</text><text x="250" y="170">9</text><text x="380" y="170">16</text>`)],
    when_to_use_this_method: { use_this_when: ["Each term gets bigger by a growing amount", "Building square or triangular number patterns from dots"], use_other_when: ["The step between terms stays the same (use a simple number pattern)", "Shapes or colours simply repeat (use shape patterns)"] },
    edge_cases: [ { case: "Differences in 1, 4, 9, 16", value: "+3, +5, +7", reasoning: "Square numbers grow by the next odd number, so the gaps themselves increase.", where_it_appears: "Explaining why the pattern is growing, not constant" } ],
    video_script_hooks: { opening_hook: "Stack dots into bigger and bigger squares - 1, then 4, then 9 - watch the pattern GROW!", concept_reveal: "Growing patterns get bigger by a changing amount, like square numbers that add the next odd number each step." },
  },
  math5_ch7_rotational_patterns: {
    key_formulas: [ { formula: "Turn angle for n copies around a centre = 360 degrees divided by n", explanation: "Rotating a motif by equal angles around a point makes a balanced rotational pattern; 4 copies means a 90 degree turn each." } ],
    prerequisite_knowledge: ["Idea of rotating a shape about a point", "Dividing 360 by a small number"],
    visual_description: "A single leaf motif copied four times around a centre point, each turned 90 degrees from the last.",
    svg_diagrams: [svg("math5_ch7_rotational_patterns_diagram", "Rotate a motif", `<text x="20" y="26" font-weight="bold">4 copies, turned 90 deg each (360/4)</text><circle cx="280" cy="120" r="3" fill="#333"/><polygon points="280,120 295,70 265,70" fill="#9f9" stroke="#333"/><polygon points="280,120 330,135 330,105" fill="#9f9" stroke="#333"/><polygon points="280,120 295,170 265,170" fill="#9f9" stroke="#333"/><polygon points="280,120 230,135 230,105" fill="#9f9" stroke="#333"/><text x="200" y="195">centre of rotation</text>`)],
    when_to_use_this_method: { use_this_when: ["Making a balanced design by turning a motif around a centre", "Deciding the turn angle for a given number of repeats"], use_other_when: ["The motif repeats in a straight line (use shape patterns)", "The design is made by reflecting across a line (use symmetry designs)"] },
    edge_cases: [ { case: "6 copies around a centre", value: "60 degrees each", reasoning: "360 divided by 6 equals 60, so each copy is turned 60 degrees.", where_it_appears: "Designing a 6-petal flower or rangoli" } ],
    video_script_hooks: { opening_hook: "Take one leaf, spin it a quarter turn, copy, repeat - suddenly you have a whole flower!", concept_reveal: "Rotational patterns repeat a motif by turning it the same angle around a centre, where the angle is 360 divided by the number of copies." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 8 — Mapping Your Way (maps & directions)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch8_maps_reading: {
    key_formulas: [ { formula: "On most maps: top = North, bottom = South, right = East, left = West", explanation: "Unless a map shows its own North arrow, you read the top of the page as North so everyone agrees on directions." } ],
    prerequisite_knowledge: ["Knowing left, right, up and down", "Understanding that a picture can stand for a real place"],
    visual_description: "A simple street map with a North arrow at the top, a key showing a school, park and house symbols, and labelled roads.",
    svg_diagrams: [svg("math5_ch8_maps_reading_diagram", "Reading a simple map", `<text x="20" y="26" font-weight="bold">Simple Map (top = North)</text><line x1="60" y1="60" x2="60" y2="170" stroke="#888" stroke-width="6"/><line x1="60" y1="115" x2="520" y2="115" stroke="#888" stroke-width="6"/><line x1="80" y1="50" x2="80" y2="40" stroke="#333"/><polygon points="80,38 76,50 84,50" fill="#333"/><text x="92" y="48">N</text><rect x="100" y="70" width="34" height="24" fill="#cfe8ff" stroke="#333"/><text x="100" y="110" font-size="11">School</text><circle cx="300" cy="90" r="16" fill="#bdf0c4" stroke="#2a7"/><text x="280" y="130" font-size="11">Park</text><rect x="430" y="130" width="30" height="26" fill="#ffe0b3" stroke="#333"/><text x="425" y="172" font-size="11">House</text>`)],
    when_to_use_this_method: { use_this_when: ["You need to find a place or describe where something is on a map", "A map has a key/legend with symbols to look up"], use_other_when: ["You need the real-world distance — then use the map scale", "You are giving exact directions — then use the compass directions"] },
    edge_cases: [ { case: "Map has its own North arrow that does not point up", value: "Follow the arrow, not the page", reasoning: "The arrow is the real reference; some maps are rotated to fit the page.", where_it_appears: "Tourist maps and mall floor plans" } ],
    video_script_hooks: { opening_hook: "Imagine you are a treasure hunter and X marks the spot — but first you have to read the map! Which way is North?", concept_reveal: "A map is a tiny drawing of a real place. The top is usually North, and the key tells you what each little symbol means." },
  },
  math5_ch8_directions_compass: {
    key_formulas: [ { formula: "4 main directions: N, E, S, W (clockwise). 4 in-between: NE, SE, SW, NW", explanation: "Each in-between direction sits exactly halfway between two main ones, e.g. NE is halfway between North and East." } ],
    prerequisite_knowledge: ["Knowing top = North on a map", "Understanding clockwise order"],
    visual_description: "An 8-point compass rose with N at top, E right, S bottom, W left, and NE, SE, SW, NW between them.",
    svg_diagrams: [svg("math5_ch8_directions_compass_diagram", "8-point compass rose", `<text x="20" y="26" font-weight="bold">Compass Directions</text><circle cx="280" cy="115" r="70" fill="none" stroke="#888"/><line x1="280" y1="45" x2="280" y2="185" stroke="#333"/><line x1="210" y1="115" x2="350" y2="115" stroke="#333"/><line x1="230" y1="65" x2="330" y2="165" stroke="#bbb"/><line x1="330" y1="65" x2="230" y2="165" stroke="#bbb"/><text x="273" y="42" font-weight="bold">N</text><text x="356" y="120" font-weight="bold">E</text><text x="273" y="200" font-weight="bold">S</text><text x="196" y="120" font-weight="bold">W</text><text x="332" y="62" font-size="11">NE</text><text x="332" y="178" font-size="11">SE</text><text x="206" y="178" font-size="11">SW</text><text x="206" y="62" font-size="11">NW</text>`)],
    when_to_use_this_method: { use_this_when: ["You give or follow directions like 'go North then turn East'", "You describe where one place is relative to another"], use_other_when: ["You just need to read symbols — use map reading", "You need real distance — use the map scale"] },
    edge_cases: [ { case: "Turning right from facing North", value: "You now face East", reasoning: "Directions go clockwise N → E → S → W, so a right turn moves you one step clockwise.", where_it_appears: "Following step-by-step route directions" } ],
    video_script_hooks: { opening_hook: "Never Eat Soggy Worms! That silly phrase is a secret code for finding your way anywhere.", concept_reveal: "There are 4 main directions — North, East, South, West — and 4 in-between ones like North-East that sit exactly halfway between them." },
  },
  math5_ch8_map_scale: {
    key_formulas: [ { formula: "real distance = map distance × scale (e.g. 1 cm on map = 100 m on ground)", explanation: "Measure the map distance in cm, then multiply by how much real distance each cm stands for." } ],
    prerequisite_knowledge: ["Measuring length in centimetres with a ruler", "Multiplication by 10s and 100s"],
    visual_description: "A ruler measuring a line on a map next to a scale bar reading '1 cm = 100 m', showing a 3 cm road equals 300 m.",
    svg_diagrams: [svg("math5_ch8_map_scale_diagram", "Using a map scale", `<text x="20" y="26" font-weight="bold">Map Scale: 1 cm = 100 m</text><line x1="40" y1="80" x2="220" y2="80" stroke="#36c" stroke-width="6"/><text x="40" y="105" font-size="12">map road = 3 cm</text><rect x="40" y="130" width="60" height="14" fill="#333"/><rect x="100" y="130" width="60" height="14" fill="#fff" stroke="#333"/><rect x="160" y="130" width="60" height="14" fill="#333"/><text x="40" y="165" font-size="11">0      100m   200m   300m</text><text x="300" y="100" font-weight="bold">3 × 100 = 300 m</text>`)],
    when_to_use_this_method: { use_this_when: ["You know the map distance and need the real distance", "A map gives a scale like '1 cm = 100 m'"], use_other_when: ["You only need direction, not distance — use the compass", "You are counting blocks on a grid — use route planning"] },
    edge_cases: [ { case: "Half a centimetre on the map", value: "0.5 cm = 50 m (if 1 cm = 100 m)", reasoning: "Scale works for parts too: half of 100 m is 50 m.", where_it_appears: "Measuring short paths that are not whole centimetres" } ],
    video_script_hooks: { opening_hook: "How can a whole city fit on one little page? With a magic shrinking rule called a scale!", concept_reveal: "A scale tells you how much real distance one centimetre on the map stands for, so you multiply to find the true distance." },
  },
  math5_ch8_route_planning: {
    key_formulas: [ { formula: "total blocks travelled = blocks going across + blocks going up/down", explanation: "On a grid of streets, count the side-to-side blocks and add the up-and-down blocks to get the whole journey." } ],
    prerequisite_knowledge: ["Reading a simple map and its grid of streets", "Knowing the compass directions for turns"],
    visual_description: "A grid of city blocks with a start dot and end dot, and an arrow path going right 3 blocks then up 2 blocks with the turn marked.",
    svg_diagrams: [svg("math5_ch8_route_planning_diagram", "Planning a route on a grid", `<text x="20" y="26" font-weight="bold">Shortest Route on a Grid</text><line x1="60" y1="50" x2="60" y2="170" stroke="#ddd"/><line x1="120" y1="50" x2="120" y2="170" stroke="#ddd"/><line x1="180" y1="50" x2="180" y2="170" stroke="#ddd"/><line x1="240" y1="50" x2="240" y2="170" stroke="#ddd"/><line x1="60" y1="50" x2="240" y2="50" stroke="#ddd"/><line x1="60" y1="110" x2="240" y2="110" stroke="#ddd"/><line x1="60" y1="170" x2="240" y2="170" stroke="#ddd"/><line x1="60" y1="170" x2="240" y2="170" stroke="#e33" stroke-width="4"/><line x1="240" y1="170" x2="240" y2="50" stroke="#e33" stroke-width="4"/><circle cx="60" cy="170" r="6" fill="#2a7"/><text x="40" y="190" font-size="11">Start</text><circle cx="240" cy="50" r="6" fill="#e33"/><text x="250" y="48" font-size="11">End</text><text x="300" y="110">3 across + 2 up = 5 blocks</text>`)],
    when_to_use_this_method: { use_this_when: ["You need to count blocks or turns to get from start to end", "You want the shortest path on a grid of streets"], use_other_when: ["You need the distance in metres — use the map scale", "You only need to name a direction — use the compass"] },
    edge_cases: [ { case: "Two routes have the same number of blocks", value: "Both are shortest", reasoning: "On a grid, any path that only moves toward the goal has the same block count.", where_it_appears: "Choosing between two equally short ways to school" } ],
    video_script_hooks: { opening_hook: "You're late for the bus! Which way gets you there fastest — and how many turns will it take?", concept_reveal: "Planning a route means counting the blocks across and up, then choosing the path with the fewest blocks." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 9 — Boxes and Sketches (3D shapes, nets, views)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch9_3d_shapes: {
    key_formulas: [ { formula: "Cube: 6 faces, 12 edges, 8 vertices; Cuboid: 6 faces, 12 edges, 8 vertices; Cylinder: 2 flat faces + 1 curved; Cone: 1 flat face, 1 curved, 1 vertex; Sphere: 1 curved surface", explanation: "A face is a flat surface, an edge is where two faces meet, and a vertex is a corner point." } ],
    prerequisite_knowledge: ["Recognising 2D shapes like squares and circles", "Understanding flat vs curved surfaces"],
    visual_description: "A row of five solids — cube, cuboid, cylinder, cone, sphere — each labelled with its name.",
    svg_diagrams: [svg("math5_ch9_3d_shapes_diagram", "Common 3D shapes", `<text x="20" y="26" font-weight="bold">3D Shapes</text><rect x="40" y="70" width="40" height="40" fill="#cfe8ff" stroke="#333"/><polygon points="40,70 55,55 95,55 80,70" fill="#aaccee" stroke="#333"/><polygon points="80,70 95,55 95,95 80,110" fill="#9bd" stroke="#333"/><text x="42" y="135" font-size="11">Cube</text><rect x="150" y="75" width="60" height="35" fill="#cfe8ff" stroke="#333"/><polygon points="150,75 165,60 225,60 210,75" fill="#aaccee" stroke="#333"/><polygon points="210,75 225,60 225,95 210,110" fill="#9bd" stroke="#333"/><text x="155" y="135" font-size="11">Cuboid</text><rect x="280" y="70" width="40" height="45" fill="#bdf0c4" stroke="#2a7"/><ellipse cx="300" cy="70" rx="20" ry="7" fill="#9ed" stroke="#2a7"/><ellipse cx="300" cy="115" rx="20" ry="7" fill="#bdf0c4" stroke="#2a7"/><text x="282" y="135" font-size="11">Cylinder</text><polygon points="400,115 380,70 420,70" fill="#ffe0b3" stroke="#333"/><ellipse cx="400" cy="70" rx="20" ry="7" fill="#ffd08a" stroke="#333"/><text x="385" y="135" font-size="11">Cone</text><circle cx="490" cy="95" r="22" fill="#ffc9d6" stroke="#c36"/><text x="468" y="135" font-size="11">Sphere</text>`)],
    when_to_use_this_method: { use_this_when: ["You need to name a solid or count its faces, edges and vertices", "You compare flat-faced shapes with curved ones"], use_other_when: ["You are folding a flat shape into a solid — use nets", "You are drawing what a solid looks like from one side — use views"] },
    edge_cases: [ { case: "A sphere's edges and vertices", value: "0 edges, 0 vertices", reasoning: "A sphere is one smooth curved surface with no flat faces meeting and no corners.", where_it_appears: "Comparing a ball to a box in a faces/edges/vertices table" } ],
    video_script_hooks: { opening_hook: "Look around your room — a dice, a tin of beans, an ice-cream cone, a football. Every one is a 3D shape with secrets!", concept_reveal: "Solids are made of faces (flat surfaces), edges (where faces meet) and vertices (corners). A cube has 6 faces, 12 edges and 8 vertices." },
  },
  math5_ch9_nets_cube: {
    key_formulas: [ { formula: "A cube net = 6 squares arranged so they fold into a cube; there are 11 different nets of a cube", explanation: "A net is the flat 'unfolded' version of a solid; folding it along the lines makes the closed box." } ],
    prerequisite_knowledge: ["Knowing a cube has 6 equal square faces", "Recognising squares and how shapes fold"],
    visual_description: "A cross-shaped arrangement of six squares with fold lines, shown next to the cube it folds into.",
    svg_diagrams: [svg("math5_ch9_nets_cube_diagram", "Net of a cube", `<text x="20" y="26" font-weight="bold">Net of a Cube (6 squares)</text><rect x="120" y="50" width="40" height="40" fill="#cfe8ff" stroke="#333"/><rect x="80" y="90" width="40" height="40" fill="#cfe8ff" stroke="#333"/><rect x="120" y="90" width="40" height="40" fill="#cfe8ff" stroke="#333"/><rect x="160" y="90" width="40" height="40" fill="#cfe8ff" stroke="#333"/><rect x="200" y="90" width="40" height="40" fill="#cfe8ff" stroke="#333"/><rect x="120" y="130" width="40" height="40" fill="#cfe8ff" stroke="#333"/><text x="300" y="80">folds into</text><rect x="420" y="80" width="50" height="50" fill="#aaccee" stroke="#333"/><polygon points="420,80 440,60 490,60 470,80" fill="#9bd" stroke="#333"/><polygon points="470,80 490,60 490,110 470,130" fill="#8ac" stroke="#333"/>`)],
    when_to_use_this_method: { use_this_when: ["You unfold a box flat or fold a flat shape into a solid", "You check whether a flat shape will form a cube"], use_other_when: ["You only need to count faces/edges/vertices — use 3D shapes", "You are drawing the solid from one side — use views"] },
    edge_cases: [ { case: "Six squares in one straight row", value: "Does NOT fold into a cube", reasoning: "When you fold a 1×6 strip, faces overlap and gaps are left, so not every 6-square arrangement is a valid net.", where_it_appears: "Tick-or-cross 'is this a cube net?' questions" } ],
    video_script_hooks: { opening_hook: "Ever flattened a cardboard box? You just made a net — and you can fold it right back into a box!", concept_reveal: "A net is a flat shape that folds up into a solid. A cube needs 6 squares, and there are 11 different ways to arrange them into a working net." },
  },
  math5_ch9_views_objects: {
    key_formulas: [ { formula: "Top view = looking straight down; Front view = looking from the front; Side view = looking from the side", explanation: "Each view is a flat 2D picture of the solid seen from one direction, with no depth shown." } ],
    prerequisite_knowledge: ["Recognising basic 3D shapes", "Understanding looking at something from different sides"],
    visual_description: "A small block model in the middle with arrows to its top view, front view and side view drawn as flat outlines.",
    svg_diagrams: [svg("math5_ch9_views_objects_diagram", "Top, front and side views", `<text x="20" y="26" font-weight="bold">Views of an Object</text><rect x="60" y="80" width="50" height="40" fill="#cfe8ff" stroke="#333"/><polygon points="60,80 78,62 128,62 110,80" fill="#aaccee" stroke="#333"/><polygon points="110,80 128,62 128,102 110,120" fill="#9bd" stroke="#333"/><text x="60" y="140" font-size="11">Object</text><rect x="230" y="70" width="40" height="30" fill="#eee" stroke="#333"/><text x="225" y="120" font-size="11">Top view</text><rect x="330" y="70" width="40" height="40" fill="#eee" stroke="#333"/><text x="325" y="128" font-size="11">Front view</text><rect x="440" y="70" width="30" height="40" fill="#eee" stroke="#333"/><text x="430" y="128" font-size="11">Side view</text>`)],
    when_to_use_this_method: { use_this_when: ["You draw what a solid looks like from above, front or side", "You match a flat picture to the solid it came from"], use_other_when: ["You are folding a flat shape into a solid — use nets", "You count cubes in a model — use building models"] },
    edge_cases: [ { case: "A cylinder seen from the top", value: "Top view is a circle", reasoning: "Looking straight down a cylinder you see only the round face, even though the front view is a rectangle.", where_it_appears: "Matching tins and pipes to their top-view circles" } ],
    video_script_hooks: { opening_hook: "A robot looks at your toy from the top, the front and the side — and sees three totally different shapes. How?", concept_reveal: "A view is a flat picture of a solid from one direction. The same object can look like a circle from the top and a rectangle from the front." },
  },
  math5_ch9_building_models: {
    key_formulas: [ { formula: "total cubes = cubes in each layer added together (or rows × columns × layers for a full block)", explanation: "Count the unit cubes layer by layer, remembering to include hidden cubes you cannot see." } ],
    prerequisite_knowledge: ["Knowing a cube is one unit", "Multiplication and addition for counting"],
    visual_description: "A small staircase model made of unit cubes with the count of cubes in each layer labelled.",
    svg_diagrams: [svg("math5_ch9_building_models_diagram", "Building with unit cubes", `<text x="20" y="26" font-weight="bold">Counting Unit Cubes</text><rect x="60" y="120" width="30" height="30" fill="#cfe8ff" stroke="#333"/><rect x="90" y="120" width="30" height="30" fill="#cfe8ff" stroke="#333"/><rect x="120" y="120" width="30" height="30" fill="#cfe8ff" stroke="#333"/><rect x="60" y="90" width="30" height="30" fill="#aaccee" stroke="#333"/><rect x="90" y="90" width="30" height="30" fill="#aaccee" stroke="#333"/><rect x="60" y="60" width="30" height="30" fill="#9bd" stroke="#333"/><text x="180" y="80">top layer = 1</text><text x="180" y="108">middle = 2</text><text x="180" y="138">bottom = 3</text><text x="180" y="168" font-weight="bold">total = 6 cubes</text>`)],
    when_to_use_this_method: { use_this_when: ["You build a model from unit cubes and count them", "You find how many small cubes make up a larger block"], use_other_when: ["You only name the solid — use 3D shapes", "You draw it from one side — use views"] },
    edge_cases: [ { case: "Hidden cubes at the back or inside", value: "Must still be counted", reasoning: "A drawing hides some cubes; the count includes every cube even if you cannot see it.", where_it_appears: "Counting cubes in a solid block from a picture" } ],
    video_script_hooks: { opening_hook: "Give a builder a pile of identical little cubes — how many does it take to build a tiny tower or a staircase?", concept_reveal: "Models are built from unit cubes. To count them, add up the cubes in each layer, including the ones hidden at the back." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 10 — Tenths and Hundredths (decimals)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch10_decimals_intro: {
    key_formulas: [ { formula: "A decimal point separates the whole-number part from the part less than one: 3.5 = 3 wholes + 5 tenths", explanation: "Digits left of the point are whole units; digits right of the point show parts of one whole." } ],
    prerequisite_knowledge: ["Understanding fractions like 1/10", "Place value of ones and tens"],
    visual_description: "A number 3.5 with the whole part '3' and decimal part '5' labelled, and a strip split into 10 parts with 5 shaded.",
    svg_diagrams: [svg("math5_ch10_decimals_intro_diagram", "What a decimal point means", `<text x="20" y="26" font-weight="bold">Decimal Point: 3.5</text><text x="120" y="80" font-size="34" font-weight="bold">3 . 5</text><text x="105" y="105" font-size="11">whole</text><text x="190" y="105" font-size="11">tenths</text><rect x="40" y="130" width="200" height="26" fill="none" stroke="#333"/><rect x="40" y="130" width="100" height="26" fill="#cfe8ff" stroke="#333"/><line x1="60" y1="130" x2="60" y2="156" stroke="#333"/><line x1="80" y1="130" x2="80" y2="156" stroke="#333"/><line x1="100" y1="130" x2="100" y2="156" stroke="#333"/><line x1="120" y1="130" x2="120" y2="156" stroke="#333"/><line x1="140" y1="130" x2="140" y2="156" stroke="#333"/><line x1="160" y1="130" x2="160" y2="156" stroke="#333"/><line x1="180" y1="130" x2="180" y2="156" stroke="#333"/><line x1="200" y1="130" x2="200" y2="156" stroke="#333"/><line x1="220" y1="130" x2="220" y2="156" stroke="#333"/><text x="300" y="148">5 out of 10 parts = 0.5</text>`)],
    when_to_use_this_method: { use_this_when: ["You read or write a number that has a whole part and a part less than one", "You connect a fraction like 5/10 to a decimal"], use_other_when: ["The part is in hundredths — use hundredths", "You are adding or subtracting decimals — use decimal operations"] },
    edge_cases: [ { case: "A whole number written as a decimal", value: "4 = 4.0", reasoning: "Zero tenths after the point does not change the value; it just shows there is no fractional part.", where_it_appears: "Lining up whole numbers with decimals in a list" } ],
    video_script_hooks: { opening_hook: "What lives between 3 and 4 on the number line? A whole secret world of decimals!", concept_reveal: "The decimal point is a tiny fence: numbers on the left are whole, and numbers on the right are parts of one whole, like tenths." },
  },
  math5_ch10_tenths: {
    key_formulas: [ { formula: "1/10 = 0.1 (one tenth); a number with one digit after the point is in tenths, e.g. 0.7 = 7/10", explanation: "Splitting one whole into 10 equal parts gives tenths; each part is written as 0.1." } ],
    prerequisite_knowledge: ["Knowing what a decimal point separates", "Understanding fractions with denominator 10"],
    visual_description: "A strip divided into 10 equal parts with 7 shaded, labelled '7/10 = 0.7'.",
    svg_diagrams: [svg("math5_ch10_tenths_diagram", "Tenths on a strip", `<text x="20" y="26" font-weight="bold">Tenths: 7/10 = 0.7</text><rect x="40" y="70" width="400" height="40" fill="none" stroke="#333"/><rect x="40" y="70" width="280" height="40" fill="#bdf0c4" stroke="#333"/><line x1="80" y1="70" x2="80" y2="110" stroke="#333"/><line x1="120" y1="70" x2="120" y2="110" stroke="#333"/><line x1="160" y1="70" x2="160" y2="110" stroke="#333"/><line x1="200" y1="70" x2="200" y2="110" stroke="#333"/><line x1="240" y1="70" x2="240" y2="110" stroke="#333"/><line x1="280" y1="70" x2="280" y2="110" stroke="#333"/><line x1="320" y1="70" x2="320" y2="110" stroke="#333"/><line x1="360" y1="70" x2="360" y2="110" stroke="#333"/><line x1="400" y1="70" x2="400" y2="110" stroke="#333"/><text x="150" y="140" font-size="12">7 parts shaded out of 10</text>`)],
    when_to_use_this_method: { use_this_when: ["A whole is split into 10 equal parts", "You write a number with exactly one digit after the decimal point"], use_other_when: ["The whole is split into 100 parts — use hundredths", "You are combining decimals — use decimal operations"] },
    edge_cases: [ { case: "Ten tenths", value: "10/10 = 1.0 = 1 whole", reasoning: "Collecting all ten tenths rebuilds one complete whole.", where_it_appears: "Showing that 0.9 + 0.1 makes a whole one" } ],
    video_script_hooks: { opening_hook: "Cut a chocolate bar into 10 equal pieces and grab 7 — how do you write that with a decimal?", concept_reveal: "One tenth is one of ten equal parts, written 0.1. A number like 0.7 just means 7 of those tenths." },
  },
  math5_ch10_hundredths: {
    key_formulas: [ { formula: "1/100 = 0.01 (one hundredth); two digits after the point = hundredths, e.g. 0.25 = 25/100; ₹0.75 = 75 paise", explanation: "Splitting one whole into 100 equal parts gives hundredths; money uses them since 100 paise = ₹1." } ],
    prerequisite_knowledge: ["Understanding tenths and the decimal point", "Knowing 100 paise make 1 rupee"],
    visual_description: "A 10×10 grid (100 small squares) with 25 squares shaded, labelled '25/100 = 0.25'.",
    svg_diagrams: [svg("math5_ch10_hundredths_diagram", "Hundredths grid", `<text x="20" y="26" font-weight="bold">Hundredths: 25/100 = 0.25</text><rect x="60" y="50" width="120" height="120" fill="none" stroke="#333"/><rect x="60" y="50" width="120" height="24" fill="#cfe8ff" stroke="none"/><rect x="60" y="74" width="60" height="24" fill="#cfe8ff" stroke="none"/><line x1="72" y1="50" x2="72" y2="170" stroke="#bbb"/><line x1="84" y1="50" x2="84" y2="170" stroke="#bbb"/><line x1="96" y1="50" x2="96" y2="170" stroke="#bbb"/><line x1="108" y1="50" x2="108" y2="170" stroke="#bbb"/><line x1="120" y1="50" x2="120" y2="170" stroke="#bbb"/><line x1="132" y1="50" x2="132" y2="170" stroke="#bbb"/><line x1="144" y1="50" x2="144" y2="170" stroke="#bbb"/><line x1="156" y1="50" x2="156" y2="170" stroke="#bbb"/><line x1="168" y1="50" x2="168" y2="170" stroke="#bbb"/><line x1="60" y1="62" x2="180" y2="62" stroke="#bbb"/><line x1="60" y1="74" x2="180" y2="74" stroke="#bbb"/><line x1="60" y1="86" x2="180" y2="86" stroke="#bbb"/><line x1="60" y1="98" x2="180" y2="98" stroke="#bbb"/><line x1="60" y1="110" x2="180" y2="110" stroke="#bbb"/><line x1="60" y1="122" x2="180" y2="122" stroke="#bbb"/><line x1="60" y1="134" x2="180" y2="134" stroke="#bbb"/><line x1="60" y1="146" x2="180" y2="146" stroke="#bbb"/><line x1="60" y1="158" x2="180" y2="158" stroke="#bbb"/><text x="220" y="115">25 of 100 squares = 0.25</text>`)],
    when_to_use_this_method: { use_this_when: ["A whole is split into 100 equal parts", "You write money or a number with two digits after the point"], use_other_when: ["The whole is split into only 10 parts — use tenths", "You are adding or subtracting decimals — use decimal operations"] },
    edge_cases: [ { case: "Writing tenths as hundredths", value: "0.3 = 0.30 = 30/100", reasoning: "Adding a zero in the hundredths place keeps the value the same, useful for comparing.", where_it_appears: "Comparing 0.3 with 0.25 by writing both as hundredths" } ],
    video_script_hooks: { opening_hook: "A 1-rupee coin can be split into 100 tiny paise — and that's exactly how hundredths work!", concept_reveal: "One hundredth is one of 100 equal parts, written 0.01. Two digits after the point, like 0.25, means 25 hundredths." },
  },
  math5_ch10_decimal_operations: {
    key_formulas: [ { formula: "To add or subtract decimals, line up the decimal points (and digits by place value), then add/subtract as usual: 2.5 + 1.3 = 3.8", explanation: "Keeping the points in a column makes sure tenths add to tenths and ones add to ones." } ],
    prerequisite_knowledge: ["Understanding tenths and hundredths", "Column addition and subtraction of whole numbers"],
    visual_description: "Two decimals written in a column with their decimal points lined up vertically and the answer below the line.",
    svg_diagrams: [svg("math5_ch10_decimal_operations_diagram", "Line up the decimal points", `<text x="20" y="26" font-weight="bold">Adding Decimals: line up the points</text><text x="200" y="70" font-size="26" font-family="monospace">2.5</text><text x="186" y="105" font-size="26" font-family="monospace">+1.3</text><line x1="180" y1="118" x2="260" y2="118" stroke="#333" stroke-width="2"/><text x="200" y="150" font-size="26" font-family="monospace">3.8</text><line x1="227" y1="55" x2="227" y2="155" stroke="#e33" stroke-dasharray="4 3"/><text x="290" y="120" font-size="12">points stay in one column</text>`)],
    when_to_use_this_method: { use_this_when: ["You add or subtract numbers that have decimal points", "You total money amounts like ₹2.50 + ₹1.30"], use_other_when: ["You only need to read a single decimal — use decimals intro", "You are converting a fraction to a decimal — use tenths or hundredths"] },
    edge_cases: [ { case: "Adding numbers with different decimal places", value: "2.5 + 1.30 → write 2.50 + 1.30 = 3.80", reasoning: "Add a zero so both numbers have the same places; the points still line up neatly.", where_it_appears: "Adding ₹2.50 and ₹1.30 in money sums" } ],
    video_script_hooks: { opening_hook: "Adding decimals is easy if you remember one golden rule — keep those points stacked like a tower!", concept_reveal: "Line up the decimal points so tenths sit under tenths and ones under ones, then add or subtract just like normal numbers." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 11 — Area & Perimeter (real-world)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch11_perimeter_calculation: {
    key_formulas: [
      { formula: "Perimeter = sum of all sides", explanation: "Add the lengths of every side of the shape to find the total distance around it." },
      { formula: "Perimeter of rectangle = 2 × (length + breadth)", explanation: "A rectangle has two equal lengths and two equal breadths, so add length and breadth then double it." },
      { formula: "Perimeter of square = 4 × side", explanation: "All four sides of a square are equal, so multiply one side by 4." },
    ],
    prerequisite_knowledge: ["Adding numbers", "Knowing a rectangle has 2 lengths and 2 breadths", "Multiplication by small numbers"],
    visual_description: "A rectangle labelled length 8 cm and breadth 5 cm with arrows tracing all four sides around the border.",
    svg_diagrams: [svg("math5_ch11_perimeter_calculation_diagram", "Rectangle perimeter", `<text x="20" y="26" font-weight="bold">Perimeter = 2 x (8 + 5) = 26 cm</text><rect x="80" y="60" width="240" height="110" fill="none" stroke="#333" stroke-width="2"/><text x="180" y="55" font-size="13">8 cm</text><text x="40" y="120" font-size="13">5 cm</text><text x="180" y="190" font-size="13">8 cm</text><text x="330" y="120" font-size="13">5 cm</text>`)],
    when_to_use_this_method: { use_this_when: ["You need the distance around a shape", "You are putting a fence, lace, or border around something"], use_other_when: ["You need how much surface is covered — that is area", "The shape is a single straight line, not a closed figure"] },
    edge_cases: [ { case: "Square treated as rectangle", value: "Perimeter = 4 × side", reasoning: "A square is a rectangle with length = breadth, so 2×(s+s) = 4s.", where_it_appears: "Finding the perimeter of a square tile or photo frame" } ],
    video_script_hooks: { opening_hook: "Imagine an ant walking ALL the way around your maths book — how far does it travel? That trip is the perimeter!", concept_reveal: "Perimeter is just the total length of the boundary. Add up every side, and for a rectangle there's a shortcut: 2 times (length plus breadth)." },
  },
  math5_ch11_area_calculation: {
    key_formulas: [
      { formula: "Area of rectangle = length × breadth", explanation: "Multiply the two side lengths to find how many unit squares fit inside." },
      { formula: "Area of square = side × side", explanation: "All sides are equal, so multiply one side by itself." },
    ],
    prerequisite_knowledge: ["Multiplication tables", "Knowing length and breadth of a shape", "Idea of a unit square (1 cm × 1 cm)"],
    visual_description: "A rectangle 6 cm by 4 cm divided into a grid of small 1 cm squares, with the 24 squares counted to show the area.",
    svg_diagrams: [svg("math5_ch11_area_calculation_diagram", "Rectangle area grid", `<text x="20" y="26" font-weight="bold">Area = 6 x 4 = 24 sq cm</text><rect x="80" y="50" width="300" height="120" fill="none" stroke="#333" stroke-width="2"/><line x1="130" y1="50" x2="130" y2="170" stroke="#bbb"/><line x1="180" y1="50" x2="180" y2="170" stroke="#bbb"/><line x1="230" y1="50" x2="230" y2="170" stroke="#bbb"/><line x1="280" y1="50" x2="280" y2="170" stroke="#bbb"/><line x1="330" y1="50" x2="330" y2="170" stroke="#bbb"/><line x1="80" y1="80" x2="380" y2="80" stroke="#bbb"/><line x1="80" y1="110" x2="380" y2="110" stroke="#bbb"/><line x1="80" y1="140" x2="380" y2="140" stroke="#bbb"/>`)],
    when_to_use_this_method: { use_this_when: ["You need how much surface a shape covers", "You are tiling, painting, or carpeting a flat region"], use_other_when: ["You need the distance around the edge — that is perimeter", "The region is not a rectangle or square (use a different method)"] },
    edge_cases: [ { case: "Mixed units", value: "Convert first", reasoning: "Length and breadth must be in the SAME unit before multiplying, e.g. both in cm.", where_it_appears: "A problem giving length in m and breadth in cm" } ],
    video_script_hooks: { opening_hook: "How many tiny 1 cm squares can you hide inside a chocolate bar? Count them and you've found the area!", concept_reveal: "Area is the amount of flat surface inside a shape. For a rectangle, just multiply length by breadth — and the answer is in square units." },
  },
  math5_ch11_area_vs_perimeter: {
    key_formulas: [
      { formula: "Perimeter = length around (units like cm, m)", explanation: "Perimeter measures the boundary and is reported in length units." },
      { formula: "Area = surface inside (square units like sq cm, sq m)", explanation: "Area measures the flat space covered and is reported in square units." },
    ],
    prerequisite_knowledge: ["How to find perimeter of a rectangle", "How to find area of a rectangle", "Difference between a line measure and a surface measure"],
    visual_description: "Two identical rectangles side by side: the left one has its border highlighted (perimeter) and the right one has its inside shaded (area).",
    svg_diagrams: [svg("math5_ch11_area_vs_perimeter_diagram", "Border vs inside", `<text x="20" y="26" font-weight="bold">Perimeter = border   Area = inside</text><rect x="40" y="60" width="180" height="110" fill="none" stroke="#e63946" stroke-width="4"/><text x="70" y="190" font-size="13">Perimeter (border)</text><rect x="320" y="60" width="180" height="110" fill="#a8dadc" stroke="#333" stroke-width="2"/><text x="360" y="190" font-size="13">Area (inside)</text>`)],
    when_to_use_this_method: { use_this_when: ["A question asks which measure to use", "You must decide between 'around' and 'cover'"], use_other_when: ["You only need one specific value — then apply that single formula directly"] },
    edge_cases: [ { case: "Same number, different meaning", value: "Units differ", reasoning: "A shape's area and perimeter can be the same number (e.g. 16) but one is sq units and the other is length units — they are not equal quantities.", where_it_appears: "Tricky comparison questions about a 4×4 square" } ],
    video_script_hooks: { opening_hook: "Fencing your garden or covering it with grass — which one needs perimeter and which needs area? Easy to mix up!", concept_reveal: "Perimeter is the length around the edge (cm, m). Area is the surface inside (square units). Border versus cover — never the same job." },
  },
  math5_ch11_real_problems: {
    key_formulas: [
      { formula: "Fencing cost = perimeter × cost per unit length", explanation: "Fencing follows the boundary, so first find the perimeter then multiply by the rate." },
      { formula: "Tiling/painting amount = area ÷ size of one tile (or area × cost per sq unit)", explanation: "Covering a surface uses area, so work out the area first then divide or multiply by the rate." },
    ],
    prerequisite_knowledge: ["Perimeter and area formulas", "Multiplication and division", "Knowing fencing uses perimeter and covering uses area"],
    visual_description: "A rectangular garden with a fence drawn around its boundary and grass tiles filling its inside, labelled to show fencing (perimeter) and tiling (area).",
    svg_diagrams: [svg("math5_ch11_real_problems_diagram", "Fence vs tiles", `<text x="20" y="26" font-weight="bold">Fence = perimeter, Tiles = area</text><rect x="120" y="55" width="220" height="120" fill="#c7f0c7" stroke="#2a7" stroke-width="4"/><text x="150" y="50" font-size="12">fence around the border</text><line x1="170" y1="55" x2="170" y2="175" stroke="#999"/><line x1="220" y1="55" x2="220" y2="175" stroke="#999"/><line x1="270" y1="55" x2="270" y2="175" stroke="#999"/><line x1="320" y1="55" x2="320" y2="175" stroke="#999"/><text x="180" y="120" font-size="12">tiles inside</text>`)],
    when_to_use_this_method: { use_this_when: ["A word problem mentions fence, railing, lace, or border", "A word problem mentions tiles, paint, carpet, or grass to cover"], use_other_when: ["The problem only asks for a length or only for a number of squares without context"] },
    edge_cases: [ { case: "One gate left open in fence", value: "Subtract gate width", reasoning: "If a gate has no fence, subtract its width from the perimeter before costing.", where_it_appears: "Fencing a field with a 2 m gate opening" } ],
    video_script_hooks: { opening_hook: "Your dad wants to fence the garden AND lay grass inside. Which sum is which? Pick wrong and you'll buy way too much!", concept_reveal: "Fencing follows the boundary, so use perimeter. Covering the ground fills the inside, so use area. Match the job to the measure, then multiply by the cost." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 12 — Smart Charts (data handling)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch12_tables_data: {
    key_formulas: [
      { formula: "Frequency = number of tally marks for an item", explanation: "Count the tally marks in a row to get how many times that item occurred." },
      { formula: "Tally bundle = 4 vertical lines crossed by 1 = 5", explanation: "Group counts in fives to make them quick to total." },
    ],
    prerequisite_knowledge: ["Counting", "Skip counting by 5", "Reading rows and columns of a table"],
    visual_description: "A two-column table listing fruits with tally marks beside each and a frequency number written for each row.",
    svg_diagrams: [svg("math5_ch12_tables_data_diagram", "Tally table", `<text x="20" y="26" font-weight="bold">Tally / Frequency table</text><line x1="40" y1="50" x2="40" y2="180" stroke="#333"/><line x1="220" y1="50" x2="220" y2="180" stroke="#333"/><line x1="360" y1="50" x2="360" y2="180" stroke="#333"/><line x1="40" y1="50" x2="360" y2="50" stroke="#333"/><line x1="40" y1="85" x2="360" y2="85" stroke="#333"/><line x1="40" y1="120" x2="360" y2="120" stroke="#333"/><text x="55" y="73" font-size="13">Fruit</text><text x="240" y="73" font-size="13">Tally</text><text x="55" y="108" font-size="13">Apple</text><text x="240" y="108" font-size="13">|||| ||  = 7</text>`)],
    when_to_use_this_method: { use_this_when: ["You have raw, scattered data to organise", "You are counting how often each item appears"], use_other_when: ["The data is already summarised and you only need to read it", "You want a picture comparison — use a bar graph instead"] },
    edge_cases: [ { case: "Total check", value: "Sum of frequencies = total items", reasoning: "All the frequencies added together must equal the number of data values collected.", where_it_appears: "Checking a survey of 30 students adds back to 30" } ],
    video_script_hooks: { opening_hook: "You asked 30 friends their favourite fruit and now you have a messy pile of answers. How do you tidy it up fast?", concept_reveal: "A tally table sorts data neatly: one row per item, a tally mark for each answer, grouped in fives. The count in each row is its frequency." },
  },
  math5_ch12_bar_graphs: {
    key_formulas: [
      { formula: "Bar height = value × (1 / scale step) on the axis", explanation: "Each square or step on the axis stands for a fixed amount (the scale); the bar's height shows the value using that scale." },
      { formula: "Value read = number of steps up × scale", explanation: "To read a bar, count its steps on the axis and multiply by what one step is worth." },
    ],
    prerequisite_knowledge: ["Reading a number line / axis", "Multiplication", "Frequency tables"],
    visual_description: "A bar graph with four vertical bars of different heights, a labelled value axis numbered 0, 5, 10, 15, 20 and a category axis along the bottom.",
    svg_diagrams: [svg("math5_ch12_bar_graphs_diagram", "Bar graph", `<text x="20" y="26" font-weight="bold">Bar graph (scale: 1 step = 5)</text><line x1="60" y1="40" x2="60" y2="180" stroke="#333"/><line x1="60" y1="180" x2="420" y2="180" stroke="#333"/><rect x="90" y="120" width="40" height="60" fill="#457b9d"/><rect x="160" y="80" width="40" height="100" fill="#457b9d"/><rect x="230" y="140" width="40" height="40" fill="#457b9d"/><rect x="300" y="60" width="40" height="120" fill="#457b9d"/><text x="35" y="184" font-size="11">0</text><text x="30" y="124" font-size="11">10</text><text x="30" y="64" font-size="11">20</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to compare amounts at a glance", "You are showing how many of each category there are"], use_other_when: ["You want to show parts of a whole — use a pie chart", "You only need the raw counts — a table is enough"] },
    edge_cases: [ { case: "Bar between two marks", value: "Read using the scale", reasoning: "If a bar ends halfway between marks worth 5 each, its value is the in-between amount, not just the lower mark.", where_it_appears: "Reading a bar that stops at 12 on a scale marked in 5s" } ],
    video_script_hooks: { opening_hook: "Which after-school club is the most popular? One quick look at the tallest bar tells you instantly!", concept_reveal: "A bar graph turns numbers into bars — taller means more. The secret is the scale: each step on the axis is worth a fixed amount, so multiply steps by the scale to read any bar." },
  },
  math5_ch12_pie_charts: {
    key_formulas: [
      { formula: "Whole circle = all the data (the total)", explanation: "The full pie stands for 100% of the data, i.e. every item together." },
      { formula: "Bigger slice = larger share of the total", explanation: "Compare slices by size: the larger the slice, the bigger that part's share." },
    ],
    prerequisite_knowledge: ["Idea of a whole and its parts", "Comparing sizes (bigger/smaller)", "Simple fractions like half and quarter"],
    visual_description: "A circle divided into coloured slices of different sizes, each labelled with what it represents, showing one large slice and several smaller ones.",
    svg_diagrams: [svg("math5_ch12_pie_charts_diagram", "Pie chart", `<text x="20" y="26" font-weight="bold">Pie chart: whole = all data</text><circle cx="200" cy="120" r="60" fill="#f1faee" stroke="#333" stroke-width="2"/><line x1="200" y1="120" x2="200" y2="60" stroke="#333"/><line x1="200" y1="120" x2="260" y2="120" stroke="#333"/><line x1="200" y1="120" x2="150" y2="155" stroke="#333"/><text x="215" y="95" font-size="11">big</text><text x="225" y="140" font-size="11">small</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to show how a whole is split into parts", "You are comparing each part's share of the total"], use_other_when: ["You want exact amounts to compare — a bar graph is clearer", "There are very many tiny categories that make slices too thin to read"] },
    edge_cases: [ { case: "Half the circle", value: "= 50% of total", reasoning: "A slice that is half the pie represents exactly half of all the data.", where_it_appears: "A pie where one colour fills half the circle" } ],
    video_script_hooks: { opening_hook: "Cut a pizza into slices — the biggest slice goes to whoever's hungriest. A pie chart works exactly the same way!", concept_reveal: "In a pie chart the whole circle is all the data. Each slice is a part of it, and a bigger slice simply means a bigger share." },
  },
  math5_ch12_data_analysis: {
    key_formulas: [
      { formula: "Total = sum of all the values", explanation: "Add every frequency to get the overall total." },
      { formula: "Most = largest value; Least = smallest value", explanation: "The biggest number in the data is the most common; the smallest is the least common." },
      { formula: "Difference = larger value − smaller value", explanation: "Subtract to compare how much more one category has than another." },
    ],
    prerequisite_knowledge: ["Reading tables and bar graphs", "Addition and subtraction", "Comparing numbers (greater / smaller)"],
    visual_description: "A small bar graph with the tallest and shortest bars highlighted, and an arrow showing the difference between two bars.",
    svg_diagrams: [svg("math5_ch12_data_analysis_diagram", "Most and least", `<text x="20" y="26" font-weight="bold">Find most, least, total</text><line x1="60" y1="40" x2="60" y2="180" stroke="#333"/><line x1="60" y1="180" x2="420" y2="180" stroke="#333"/><rect x="90" y="100" width="40" height="80" fill="#999"/><rect x="160" y="60" width="40" height="120" fill="#2a9d8f"/><rect x="230" y="140" width="40" height="40" fill="#e63946"/><rect x="300" y="110" width="40" height="70" fill="#999"/><text x="155" y="55" font-size="11">most</text><text x="225" y="135" font-size="11">least</text>`)],
    when_to_use_this_method: { use_this_when: ["A question asks for the most, least, total, or how many more", "You must draw a conclusion from a table or graph"], use_other_when: ["You only need to organise raw data — make a table first", "You only need to display data — draw a graph first"] },
    edge_cases: [ { case: "Two categories tied", value: "Both are 'most'", reasoning: "If two bars are equally tallest, both share the title of most common — there can be a tie.", where_it_appears: "A survey where two fruits both got 8 votes" } ],
    video_script_hooks: { opening_hook: "The graph is drawn — now be a detective! Who won, who lost, and how many turned up in total?", concept_reveal: "Analysing data means answering questions from it: the tallest bar is the most, the shortest is the least, adding all bars gives the total, and subtracting compares two." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 13 — Multiplication & Division (strategies)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch13_multiplication_strategies: {
    key_formulas: [
      { formula: "a × b = (split a into parts) × b, then add", explanation: "Break a big number into easy parts (like 34 = 30 + 4), multiply each part, then add — the area/column method." },
      { formula: "× 10 adds one zero; × 100 adds two zeros", explanation: "Multiplying a whole number by 10 or 100 shifts digits and puts zeros at the end." },
    ],
    prerequisite_knowledge: ["Multiplication tables up to 10", "Place value (ones, tens, hundreds)", "Addition of multi-digit numbers"],
    visual_description: "A rectangle split into parts showing 34 × 6 broken as (30 × 6) + (4 × 6) = 180 + 24 = 204.",
    svg_diagrams: [svg("math5_ch13_multiplication_strategies_diagram", "Area method", `<text x="20" y="26" font-weight="bold">34 x 6 = (30x6) + (4x6) = 204</text><rect x="60" y="60" width="200" height="90" fill="#e9f5db" stroke="#333"/><rect x="260" y="60" width="60" height="90" fill="#cfe8c0" stroke="#333"/><text x="130" y="110" font-size="13">30 x 6 = 180</text><text x="268" y="110" font-size="12">4x6=24</text><text x="150" y="55" font-size="12">30</text><text x="280" y="55" font-size="12">4</text>`)],
    when_to_use_this_method: { use_this_when: ["You are multiplying a large number that is hard to do in one step", "One factor is a tidy 10, 100, or a round number"], use_other_when: ["Both numbers are in your tables — just recall the fact", "You actually need to share or group equally — that is division"] },
    edge_cases: [ { case: "Multiplying by 100", value: "Add two zeros", reasoning: "23 × 100 = 2300; each ×10 shifts the number one place left, so ×100 adds two zeros.", where_it_appears: "Finding the cost of 100 identical items" } ],
    video_script_hooks: { opening_hook: "Multiplying 34 by 6 in your head feels scary — until you chop it into bite-sized pieces!", concept_reveal: "Big multiplications get easy when you split a number into tens and ones, multiply each part, and add. And multiplying by 10 or 100 just tacks zeros on the end." },
  },
  math5_ch13_long_division: {
    key_formulas: [
      { formula: "Dividend = (Divisor × Quotient) + Remainder", explanation: "This check links all four parts; the remainder must always be smaller than the divisor." },
      { formula: "Steps: Divide → Multiply → Subtract → Bring down (repeat)", explanation: "Work digit by digit from the left, repeating the four steps until no digits remain." },
    ],
    prerequisite_knowledge: ["Multiplication tables", "Subtraction", "Place value of 3-4 digit numbers"],
    visual_description: "A long-division layout showing 856 ÷ 4 worked step by step with quotient 214 on top and remainder 0.",
    svg_diagrams: [svg("math5_ch13_long_division_diagram", "Long division", `<text x="20" y="26" font-weight="bold">856 / 4 = 214 r 0</text><text x="120" y="70" font-size="16">4 ) 856</text><text x="150" y="50" font-size="16">214</text><text x="120" y="100" font-size="12">8 -> 2,  5 -> 1,  16 -> 4</text><text x="120" y="130" font-size="12">Check: 4 x 214 + 0 = 856</text>`)],
    when_to_use_this_method: { use_this_when: ["You divide a 3-4 digit number by a 1-2 digit number", "The division is too big to do mentally"], use_other_when: ["The fact is in your tables (e.g. 24 ÷ 6) — just recall it", "You are joining equal groups together — that is multiplication"] },
    edge_cases: [ { case: "Remainder larger than divisor", value: "Impossible — keep dividing", reasoning: "If your remainder is as big as or bigger than the divisor, the quotient digit was too small; the remainder must be less than the divisor.", where_it_appears: "Self-checking a long-division answer" } ],
    video_script_hooks: { opening_hook: "Sharing 856 stickers among 4 friends fairly? Long division is your sticker-splitting superpower!", concept_reveal: "Long division repeats four steps — divide, multiply, subtract, bring down — one digit at a time. The leftover at the end is the remainder, and it's always smaller than the divisor." },
  },
  math5_ch13_word_problems_mul: {
    key_formulas: [
      { formula: "Total = number of groups × amount in each group", explanation: "When equal groups are joined, multiply how many groups by how many in each." },
      { formula: "Total cost = quantity × rate (price per item)", explanation: "For rates, multiply how many you buy by the price of one." },
    ],
    prerequisite_knowledge: ["Multiplication of multi-digit numbers", "Reading a word problem for key numbers", "Idea of equal groups and rates"],
    visual_description: "Five baskets each holding 12 apples, with the total 5 × 12 = 60 apples written below.",
    svg_diagrams: [svg("math5_ch13_word_problems_mul_diagram", "Equal groups", `<text x="20" y="26" font-weight="bold">5 baskets x 12 = 60 apples</text><rect x="50" y="70" width="50" height="50" fill="#ffd6a5" stroke="#333"/><rect x="120" y="70" width="50" height="50" fill="#ffd6a5" stroke="#333"/><rect x="190" y="70" width="50" height="50" fill="#ffd6a5" stroke="#333"/><rect x="260" y="70" width="50" height="50" fill="#ffd6a5" stroke="#333"/><rect x="330" y="70" width="50" height="50" fill="#ffd6a5" stroke="#333"/><text x="60" y="100" font-size="12">12</text><text x="130" y="100" font-size="12">12</text><text x="200" y="100" font-size="12">12</text><text x="270" y="100" font-size="12">12</text><text x="340" y="100" font-size="12">12</text>`)],
    when_to_use_this_method: { use_this_when: ["Equal groups are being combined", "A 'per', 'each', or 'every' rate is multiplied by a quantity"], use_other_when: ["You are splitting a total into equal parts — that is division", "You are simply adding two different amounts together"] },
    edge_cases: [ { case: "Two-step problem", value: "Multiply then add/subtract", reasoning: "Some problems need a multiplication first, then a further step, e.g. buy 5 boxes of 12 then give 3 away.", where_it_appears: "Buying several packs and then removing some" } ],
    video_script_hooks: { opening_hook: "Five baskets, twelve apples in each — counting one by one would take ages. There's a faster way!", concept_reveal: "When equal groups join up, you multiply. Number of groups times the amount in each, or quantity times price, gives the total in one quick step." },
  },
  math5_ch13_word_problems_div: {
    key_formulas: [
      { formula: "Each share = total ÷ number of shares", explanation: "To share equally, divide the total by how many people or groups." },
      { formula: "Number of groups = total ÷ size of each group", explanation: "To group, divide the total by how many go in each group; the leftover is the remainder." },
    ],
    prerequisite_knowledge: ["Long division", "Reading a word problem for the total and the parts", "Meaning of a remainder"],
    visual_description: "Twenty sweets being shared into 4 equal cups with 5 sweets in each, and a separate example showing 23 sweets giving 5 each with 3 left over.",
    svg_diagrams: [svg("math5_ch13_word_problems_div_diagram", "Sharing equally", `<text x="20" y="26" font-weight="bold">20 sweets / 4 cups = 5 each</text><circle cx="90" cy="110" r="28" fill="#cdb4db" stroke="#333"/><circle cx="180" cy="110" r="28" fill="#cdb4db" stroke="#333"/><circle cx="270" cy="110" r="28" fill="#cdb4db" stroke="#333"/><circle cx="360" cy="110" r="28" fill="#cdb4db" stroke="#333"/><text x="82" y="115" font-size="13">5</text><text x="172" y="115" font-size="13">5</text><text x="262" y="115" font-size="13">5</text><text x="352" y="115" font-size="13">5</text>`)],
    when_to_use_this_method: { use_this_when: ["A total is shared equally among people or groups", "You are finding how many equal groups fit, or interpreting a leftover"], use_other_when: ["Equal groups are being joined to find a total — that is multiplication", "Two different amounts are simply combined — that is addition"] },
    edge_cases: [ { case: "Remainder must be handled", value: "Round up, down, or keep", reasoning: "Context decides: 23 children into vans of 5 needs 5 vans (round up), but 23 sweets shared give 4 each with 3 left (keep the remainder).", where_it_appears: "Problems where the answer must fit real life, like buses or leftover sweets" } ],
    video_script_hooks: { opening_hook: "Twenty sweets, four friends, and NO arguing — how do you split them perfectly fairly?", concept_reveal: "Division shares a total into equal parts or makes equal groups. Sometimes there's a leftover — the remainder — and the question decides what to do with it." },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 14 — How Big? How Heavy? (volume, capacity, weight)
  // ───────────────────────────────────────────────────────────────────────────
  math5_ch14_volume_intro: {
    key_formulas: [
      { formula: "Volume = number of unit cubes that fill the solid", explanation: "Volume measures the space inside a solid; counting how many 1-unit cubes fit gives it." },
      { formula: "Volume of cuboid = length × breadth × height", explanation: "Multiply the three dimensions to get the total number of unit cubes, measured in cubic units." },
    ],
    prerequisite_knowledge: ["Multiplication of three numbers", "Area of a rectangle", "Idea of a 3-D solid having length, breadth and height"],
    visual_description: "A cuboid drawn in 3-D made of small unit cubes, 4 long, 2 wide and 3 high, with the count 4 × 2 × 3 = 24 cubes labelled.",
    svg_diagrams: [svg("math5_ch14_volume_intro_diagram", "Cuboid of unit cubes", `<text x="20" y="26" font-weight="bold">Volume = 4 x 2 x 3 = 24 cubic units</text><rect x="120" y="80" width="160" height="80" fill="#bde0fe" stroke="#333" stroke-width="2"/><line x1="120" y1="80" x2="160" y2="50" stroke="#333"/><line x1="280" y1="80" x2="320" y2="50" stroke="#333"/><line x1="160" y1="50" x2="320" y2="50" stroke="#333"/><line x1="280" y1="160" x2="320" y2="130" stroke="#333"/><line x1="320" y1="50" x2="320" y2="130" stroke="#333"/><text x="170" y="125" font-size="12">l x b x h</text>`)],
    when_to_use_this_method: { use_this_when: ["You need how much space a solid (3-D) object takes up", "A box or cuboid's length, breadth and height are given"], use_other_when: ["The shape is flat (2-D) — use area instead", "You only need the distance around an edge — use perimeter"] },
    edge_cases: [ { case: "Cube (all sides equal)", value: "Volume = side × side × side", reasoning: "A cube is a cuboid with equal length, breadth and height, so volume = side³.", where_it_appears: "Finding the volume of a dice or sugar cube" } ],
    video_script_hooks: { opening_hook: "How many tiny sugar cubes can you pack into a matchbox? That count is its volume!", concept_reveal: "Volume is the space inside a solid, measured in cubic units. For a cuboid, just multiply length by breadth by height to count all the cubes at once." },
  },
  math5_ch14_capacity_review: {
    key_formulas: [
      { formula: "1 litre (L) = 1000 millilitres (mL)", explanation: "Capacity is how much liquid a container holds; litres and millilitres are linked by 1000." },
      { formula: "mL → L: divide by 1000;  L → mL: multiply by 1000", explanation: "Convert between the units by multiplying or dividing by 1000." },
    ],
    prerequisite_knowledge: ["Multiplying and dividing by 1000", "Idea of litres and millilitres", "Addition of measurements"],
    visual_description: "A 1-litre jug beside ten 100 mL cups, showing that the cups together fill the litre jug.",
    svg_diagrams: [svg("math5_ch14_capacity_review_diagram", "Litres and millilitres", `<text x="20" y="26" font-weight="bold">1 L = 1000 mL</text><rect x="60" y="60" width="70" height="110" fill="#a2d2ff" stroke="#333"/><text x="70" y="190" font-size="12">1 L jug</text><rect x="200" y="120" width="28" height="50" fill="#a2d2ff" stroke="#333"/><rect x="240" y="120" width="28" height="50" fill="#a2d2ff" stroke="#333"/><rect x="280" y="120" width="28" height="50" fill="#a2d2ff" stroke="#333"/><text x="200" y="190" font-size="12">100 mL cups</text>`)],
    when_to_use_this_method: { use_this_when: ["A problem talks about liquid in litres or millilitres", "You must convert between L and mL or add capacities"], use_other_when: ["The quantity is a solid's space — use volume (cubic units)", "The quantity is how heavy something is — use weight (g/kg)"] },
    edge_cases: [ { case: "Mixed L and mL", value: "Convert to one unit first", reasoning: "To add 2 L and 500 mL, change 2 L to 2000 mL first, then add to get 2500 mL.", where_it_appears: "Totalling water from a 2 L bottle and a 500 mL glass" } ],
    video_script_hooks: { opening_hook: "How many small juice glasses can you pour from one big bottle? It all comes down to one magic number: 1000!", concept_reveal: "Capacity is how much a container holds. One litre is 1000 millilitres, so multiply by 1000 to go from L to mL and divide by 1000 to go back." },
  },
  math5_ch14_weight_review: {
    key_formulas: [
      { formula: "1 kilogram (kg) = 1000 grams (g)", explanation: "Weight tells how heavy something is; kilograms and grams are linked by 1000." },
      { formula: "g → kg: divide by 1000;  kg → g: multiply by 1000", explanation: "Convert between the units by multiplying or dividing by 1000." },
    ],
    prerequisite_knowledge: ["Multiplying and dividing by 1000", "Idea of grams and kilograms", "Addition of measurements"],
    visual_description: "A balance scale with a 1 kg weight on one side balanced by two 500 g weights on the other.",
    svg_diagrams: [svg("math5_ch14_weight_review_diagram", "Grams and kilograms", `<text x="20" y="26" font-weight="bold">1 kg = 1000 g</text><line x1="280" y1="50" x2="280" y2="170" stroke="#333" stroke-width="2"/><line x1="160" y1="80" x2="400" y2="80" stroke="#333" stroke-width="2"/><rect x="140" y="80" width="60" height="40" fill="#ffafcc" stroke="#333"/><text x="148" y="105" font-size="11">1 kg</text><rect x="360" y="80" width="30" height="40" fill="#ffc8dd" stroke="#333"/><rect x="395" y="80" width="30" height="40" fill="#ffc8dd" stroke="#333"/><text x="356" y="140" font-size="10">500g + 500g</text>`)],
    when_to_use_this_method: { use_this_when: ["A problem talks about how heavy something is in g or kg", "You must convert between g and kg or total weights"], use_other_when: ["The quantity is liquid a container holds — use capacity (L/mL)", "The quantity is space a solid fills — use volume (cubic units)"] },
    edge_cases: [ { case: "Mixed kg and g", value: "Convert to one unit first", reasoning: "To add 3 kg and 250 g, change 3 kg to 3000 g, then add to get 3250 g.", where_it_appears: "Totalling the weight of a 3 kg bag and a 250 g packet" } ],
    video_script_hooks: { opening_hook: "Why does one feather-light packet of chips weigh almost nothing while a bag of rice weighs a tonne? Grams and kilograms tell the story!", concept_reveal: "Weight is how heavy something is. One kilogram is 1000 grams, so multiply by 1000 to turn kg into g and divide by 1000 to go back." },
  },
  math5_ch14_measurement_problems: {
    key_formulas: [
      { formula: "Convert to the same unit, then add or subtract", explanation: "Before combining measurements, change them all to one unit (mL, g, or cubic units) so they can be added or subtracted." },
      { formula: "1 L = 1000 mL  and  1 kg = 1000 g", explanation: "These two conversion facts power most mixed measurement word problems." },
    ],
    prerequisite_knowledge: ["Capacity (L/mL) and weight (g/kg) conversions", "Volume of a cuboid", "Addition, subtraction and multiplication of measurements"],
    visual_description: "A shopping scene with a 2 L milk bottle, a 1.5 kg flour bag and a small box, each labelled, ready to be combined in word problems.",
    svg_diagrams: [svg("math5_ch14_measurement_problems_diagram", "Mixed measures", `<text x="20" y="26" font-weight="bold">Convert, then add or subtract</text><rect x="60" y="70" width="60" height="100" fill="#a2d2ff" stroke="#333"/><text x="62" y="190" font-size="11">2 L milk</text><rect x="180" y="90" width="80" height="80" fill="#ffd6a5" stroke="#333"/><text x="182" y="190" font-size="11">1500 g flour</text><rect x="320" y="100" width="70" height="70" fill="#caffbf" stroke="#333"/><text x="322" y="190" font-size="11">box (l x b x h)</text>`)],
    when_to_use_this_method: { use_this_when: ["A word problem mixes litres with millilitres, or kg with grams", "Several measurements must be combined and the units differ"], use_other_when: ["All values are already in the same unit — just add directly", "Only one quantity is involved with no conversion needed"] },
    edge_cases: [ { case: "Subtracting after converting", value: "Borrow correctly", reasoning: "From 2 L (2000 mL) pour out 750 mL: convert first, then subtract to get 1250 mL — don't subtract litres from millilitres.", where_it_appears: "How much juice is left after pouring some out" } ],
    video_script_hooks: { opening_hook: "Milk in litres, flour in grams, a box to fill — your shopping bag is a maths puzzle waiting to be solved!", concept_reveal: "Mixed measurement problems work in two moves: first convert everything to the same unit using 1 L = 1000 mL or 1 kg = 1000 g, then add or subtract." },
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
run().catch((e) => { console.error("enrichMath5 failed:", e.message); process.exit(1); });
