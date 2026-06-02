/**
 * enrichMath3.js — v3 enrichment for CBSE Class 3 Math (CONTENT_STATUS Ph8).
 *
 * The 56 `math3_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (audit:math --board=CBSE --grade=3). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition/derivation/worked_example/...):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the standard CBSE Class 3 curriculum (NCERT "Maths
 * Mela" Grade 3, PDFs cemm101–cemm114). NOTE: the DB topic structure follows
 * the traditional Class 3 syllabus (views, place value, operations, measure,
 * shapes, time, weight, multiplication, patterns, capacity, division, data,
 * money) rather than the Maths Mela chapter ORDER, so content is authored per
 * topic by its concept, not by literal PDF-chapter mapping.
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath3.js            # patch every topic present in ENRICH
 *         node config/enrichMath3.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math3
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math3_ch${args.ch}_` : null;

function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

const ENRICH = {
  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 1 — Views of Objects (top / front / side) and Mirror Images
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch1_top_view: {
    key_formulas: [
      { formula: "Top view = what you see looking straight DOWN on an object", explanation: "You see its length and width, but not its height." },
      { formula: "A round object (cup, ball) looks like a circle from the top", explanation: "A box looks like a rectangle." },
    ],
    prerequisite_knowledge: ["recognising everyday objects", "basic 2D shapes (circle, square, rectangle)", "looking from different directions"],
    visual_description: "A cup and a box on a table, with arrows pointing down; the cup's top view is a circle, the box's top view is a rectangle.",
    svg_diagrams: [svg("math3_ch1_top_view", "Top view of a cup and a box",
      `<text x="20" y="30" font-weight="bold">Looking down from above:</text>
       <circle cx="110" cy="110" r="45" fill="#dbeafe" stroke="#2563eb"/><text x="80" y="175">cup → circle</text>
       <rect x="300" y="70" width="120" height="80" fill="#fde68a" stroke="#d97706"/><text x="305" y="175">box → rectangle</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing how an object looks from directly above", "Matching objects to their top-down shapes"],
      use_other_when: ["You need to show height → use the front or side view instead"],
    },
    edge_cases: [
      { case: "A tall and a short cylinder", value: "same top view (a circle)", reasoning: "Top view hides height, so different heights can look identical.", where_it_appears: "Why one view isn't enough." },
      { case: "A ball", value: "top view is a circle", reasoning: "It looks round from every direction.", where_it_appears: "Spheres." },
    ],
    video_script_hooks: {
      opening_hook: "Look straight down at your cup of milk — it's a perfect circle! That bird's-eye shape is called the top view.",
      concept_reveal: "The top view is what you'd see hovering directly above an object — its outline from the sky, with height hidden.",
    },
  },

  math3_ch1_front_view: {
    key_formulas: [
      { formula: "Front view = what you see looking straight at the FRONT of an object", explanation: "You see its height and width." },
      { formula: "A glass from the front looks like a rectangle (or a tumbler shape)", explanation: "Now you CAN see how tall it is." },
    ],
    prerequisite_knowledge: ["everyday objects", "2D shapes", "top view (for contrast)"],
    visual_description: "A glass and a ball viewed from the front: the glass shows as a tall tumbler outline, the ball as a circle.",
    svg_diagrams: [svg("math3_ch1_front_view", "Front view shows height",
      `<text x="20" y="30" font-weight="bold">Looking from the front:</text>
       <path d="M70 60 L150 60 L140 160 L80 160 Z" fill="#dbeafe" stroke="#2563eb"/><text x="70" y="180">glass</text>
       <circle cx="350" cy="110" r="45" fill="#fecaca" stroke="#dc2626"/><text x="320" y="180">ball</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing how tall and wide an object looks from the front", "Drawing what you face directly"],
      use_other_when: ["You need the view from straight above → use the top view"],
    },
    edge_cases: [
      { case: "Front view of a ball", value: "still a circle", reasoning: "A sphere looks the same from any side.", where_it_appears: "Round objects." },
      { case: "A book standing up", value: "front view is a tall rectangle", reasoning: "You see its height and width.", where_it_appears: "Flat objects." },
    ],
    video_script_hooks: {
      opening_hook: "From the top your glass is a circle — but stand in front of it and suddenly you can see how TALL it is. That's the front view.",
      concept_reveal: "The front view is what you see facing an object head-on; unlike the top view, it reveals the object's height.",
    },
  },

  math3_ch1_side_view: {
    key_formulas: [
      { formula: "Side view = what you see looking from the SIDE of an object", explanation: "You see its height and depth (how deep it is)." },
      { formula: "The same object can look different from top, front and side", explanation: "Three views together describe its full shape." },
    ],
    prerequisite_knowledge: ["top view", "front view", "everyday objects"],
    visual_description: "A toy car shown from the front (short and wide) and from the side (long), making clear the two views differ.",
    svg_diagrams: [svg("math3_ch1_side_view", "Side view of a toy car",
      `<text x="20" y="30" font-weight="bold">Same car, different sides:</text>
       <rect x="50" y="90" width="60" height="40" fill="#dbeafe" stroke="#2563eb"/><text x="45" y="155">front (short)</text>
       <path d="M250 110 L260 90 L360 90 L380 110 L380 130 L250 130 Z" fill="#fde68a" stroke="#d97706"/><circle cx="285" cy="132" r="9"/><circle cx="355" cy="132" r="9"/><text x="270" y="160">side (long)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing an object from its side", "Combining all three views to picture a solid"],
      use_other_when: ["A round object — its side view matches its front view"],
    },
    edge_cases: [
      { case: "A car", value: "side view (long) differs from front view (short)", reasoning: "Length shows from the side, not the front.", where_it_appears: "Long objects." },
      { case: "A cube", value: "top, front and side views all look like a square", reasoning: "It's equal in every direction.", where_it_appears: "Symmetric solids." },
    ],
    video_script_hooks: {
      opening_hook: "From the front, a car looks small and boxy. Step to the side and it stretches out long. Same car — totally different view!",
      concept_reveal: "The side view shows an object from the side; top, front and side together give the full picture of any solid.",
    },
  },

  math3_ch1_mirror_images: {
    key_formulas: [
      { formula: "A mirror image is flipped LEFT–RIGHT", explanation: "Your right hand looks like a left hand in the mirror." },
      { formula: "The mirror line is where the reflection 'folds'", explanation: "Each point and its image are the same distance from the mirror." },
    ],
    prerequisite_knowledge: ["left and right", "looking at shapes", "the idea of a mirror"],
    visual_description: "The letter b and its mirror image d facing across a vertical mirror line, equal distances from the line.",
    svg_diagrams: [svg("math3_ch1_mirror_images", "A mirror flips left–right",
      `<line x1="280" y1="30" x2="280" y2="170" stroke="#475569" stroke-dasharray="5 4"/><text x="250" y="22">mirror</text>
       <text x="180" y="120" font-size="60" font-weight="bold" fill="#2563eb">b</text>
       <text x="330" y="120" font-size="60" font-weight="bold" fill="#16a34a">d</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Predicting how something looks in a mirror", "Recognising reflected shapes and letters"],
      use_other_when: ["The object only needs turning, not flipping → that's rotation, not reflection"],
    },
    edge_cases: [
      { case: "Letters like A, H, M, O", value: "look the SAME in a mirror", reasoning: "They are symmetric about a vertical line.", where_it_appears: "Symmetric letters." },
      { case: "The word AMBULANCE on a vehicle", value: "written reversed so it reads correctly in mirrors", reasoning: "Drivers ahead see it through their rear-view mirror.", where_it_appears: "Real-life mirror writing." },
    ],
    video_script_hooks: {
      opening_hook: "Wave your right hand at a mirror — the 'you' inside waves its LEFT. Mirrors swap left and right, and that trick is everywhere.",
      concept_reveal: "A mirror image flips an object left-to-right across the mirror line, keeping every point the same distance from the glass.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 2 — Three-Digit Numbers
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch2_three_digit_numbers: {
    key_formulas: [
      { formula: "Three-digit numbers run from 100 to 999", explanation: "They have a hundreds, a tens and a ones digit." },
      { formula: "Smallest 3-digit number = 100 · largest = 999", explanation: "Just before 100 is 99 (two digits); just after 999 is 1000 (four digits)." },
    ],
    prerequisite_knowledge: ["counting to 100", "tens and ones", "reading two-digit numbers"],
    visual_description: "The number 345 shown in a place-value chart with 3 hundred-blocks, 4 ten-rods and 5 unit-cubes.",
    svg_diagrams: [svg("math3_ch2_three_digit", "345 = 3 hundreds, 4 tens, 5 ones",
      `<text x="40" y="30" font-weight="bold">H   T   O</text>
       <rect x="40" y="45" width="60" height="60" fill="#bfdbfe" stroke="#2563eb"/><text x="62" y="82">3</text>
       <rect x="140" y="45" width="60" height="60" fill="#bbf7d0" stroke="#16a34a"/><text x="162" y="82">4</text>
       <rect x="240" y="45" width="60" height="60" fill="#fde68a" stroke="#d97706"/><text x="262" y="82">5</text>
       <text x="40" y="140" font-size="20">= 345</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading, writing and naming numbers up to 999", "Knowing how many hundreds, tens and ones a number has"],
      use_other_when: ["Numbers above 999 → those need a thousands place (four digits)"],
    },
    edge_cases: [
      { case: "Adding 1 to 999", value: "1000 (a four-digit number)", reasoning: "All three places are full, so a new place opens.", where_it_appears: "Rolling over." },
      { case: "A 0 in the middle, like 205", value: "valid — it means 0 tens", reasoning: "Zero holds the tens place so digits don't shift.", where_it_appears: "Zero as a placeholder." },
    ],
    video_script_hooks: {
      opening_hook: "What's the biggest number you can make with three digit-cards? 999 — and add just one more and the whole thing flips to 1000.",
      concept_reveal: "Every three-digit number is built from hundreds, tens and ones — that's what gives 345 its size.",
    },
  },

  math3_ch2_place_value: {
    key_formulas: [
      { formula: "A digit's value depends on its PLACE: hundreds, tens or ones", explanation: "In 345 the 3 means 300, the 4 means 40, the 5 means 5." },
      { formula: "Same digit, different place = different value", explanation: "The 3 in 345 is worth 300, but in 453 it's worth 3." },
    ],
    prerequisite_knowledge: ["three-digit numbers", "tens and ones", "skip counting by 10s and 100s"],
    visual_description: "The number 345 with arrows from each digit to its value: 3 → 300, 4 → 40, 5 → 5.",
    svg_diagrams: [svg("math3_ch2_place_value", "Place value of each digit in 345",
      `<text x="120" y="50" font-size="40" font-weight="bold">3 4 5</text>
       <text x="120" y="110" fill="#2563eb">300</text><text x="175" y="110" fill="#16a34a">40</text><text x="225" y="110" fill="#d97706">5</text>
       <text x="100" y="160">300 + 40 + 5 = 345</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Working out what each digit is worth", "Understanding why digit order matters"],
      use_other_when: ["You only need to count objects, not analyse a number's structure"],
    },
    edge_cases: [
      { case: "The two 5s in 552", value: "worth 500 and 50, not the same", reasoning: "Place decides value.", where_it_appears: "Repeated digits." },
      { case: "0 in 305", value: "0 tens, but it still holds the place", reasoning: "Removing it would make 35 — a different number.", where_it_appears: "Why zero matters." },
    ],
    video_script_hooks: {
      opening_hook: "The digit 3 can be worth 3, or 30, or 300 — all depends on WHERE it stands. That's the secret power of place value.",
      concept_reveal: "Each place is worth ten times the one to its right, so a digit's position — not the digit itself — sets its value.",
    },
  },

  math3_ch2_comparing_numbers: {
    key_formulas: [
      { formula: "Compare the leftmost (highest-place) digits first", explanation: "More hundreds → bigger number." },
      { formula: "If those are equal, compare the next place, and so on", explanation: "Use the symbols >, < and =." },
    ],
    prerequisite_knowledge: ["place value", "three-digit numbers", "greater than / less than idea"],
    visual_description: "452 vs 458 lined up by place: hundreds equal, tens equal, ones 2 < 8, so 452 < 458.",
    svg_diagrams: [svg("math3_ch2_comparing", "Comparing 452 and 458",
      `<text x="60" y="60" font-size="26">452</text><text x="220" y="60" font-size="26">458</text>
       <text x="150" y="60" font-size="26" fill="#dc2626">&lt;</text>
       <text x="40" y="110">same H, same T, then 2 &lt; 8</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Putting numbers in order", "Deciding which of two numbers is larger"],
      use_other_when: ["Numbers have different digit-counts → more digits = bigger (no need to compare digit by digit)"],
    },
    edge_cases: [
      { case: "99 vs 100", value: "100 is bigger", reasoning: "Three digits beat two digits.", where_it_appears: "Different lengths." },
      { case: "452 vs 458", value: "look beyond the first matching digits", reasoning: "Equal hundreds and tens, so the ones decide.", where_it_appears: "Close numbers." },
    ],
    video_script_hooks: {
      opening_hook: "Which is bigger, 452 or 458? Don't read the whole thing — start from the LEFT and stop at the first place where they differ.",
      concept_reveal: "Comparing numbers means checking the biggest place first; the first place that differs settles which number wins.",
    },
  },

  math3_ch2_expanded_form: {
    key_formulas: [
      { formula: "Expanded form splits a number into place values added together", explanation: "345 = 300 + 40 + 5." },
      { formula: "Standard form packs it back: 300 + 40 + 5 = 345", explanation: "Expanded and standard forms are two views of the same number." },
    ],
    prerequisite_knowledge: ["place value", "three-digit numbers", "addition"],
    visual_description: "345 unpacked into 300 + 40 + 5, with each part coloured to match its place.",
    svg_diagrams: [svg("math3_ch2_expanded_form", "345 in expanded form",
      `<text x="60" y="60" font-size="30">345</text>
       <text x="60" y="120" fill="#2563eb">300</text><text x="130" y="120">+</text><text x="150" y="120" fill="#16a34a">40</text><text x="200" y="120">+</text><text x="220" y="120" fill="#d97706">5</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Showing the place value of every digit clearly", "Understanding numbers before adding/subtracting"],
      use_other_when: ["Quick reading or writing — standard form is shorter"],
    },
    edge_cases: [
      { case: "A number with a zero, 305", value: "300 + 0 + 5 = 300 + 5", reasoning: "The zero-tens part adds nothing.", where_it_appears: "Zeros in expanded form." },
      { case: "707", value: "700 + 0 + 7", reasoning: "Both 7s expand by their place.", where_it_appears: "Repeated digits." },
    ],
    video_script_hooks: {
      opening_hook: "345 is hiding three numbers in a trench coat: 300, 40 and 5. Expanded form pulls them apart so you can see exactly what each digit means.",
      concept_reveal: "Expanded form writes a number as the sum of its place values, making the hidden hundreds, tens and ones visible.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 3 — Addition and Subtraction of 3-Digit Numbers
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch3_addition_3digit: {
    key_formulas: [
      { formula: "Line up ones under ones, tens under tens, hundreds under hundreds", explanation: "Then add each column from the right." },
      { formula: "Add right to left, carrying when a column reaches 10", explanation: "234 + 152 = 386." },
    ],
    prerequisite_knowledge: ["place value", "addition facts to 18", "writing numbers in columns"],
    visual_description: "A column sum of 234 + 152 with ones, tens and hundreds aligned, giving 386.",
    svg_diagrams: [svg("math3_ch3_addition", "Column addition 234 + 152",
      `<text x="120" y="50" font-family="monospace" font-size="20">  234</text>
       <text x="120" y="80" font-family="monospace" font-size="20">+ 152</text>
       <line x1="135" y1="90" x2="230" y2="90" stroke="#475569"/>
       <text x="120" y="115" font-family="monospace" font-size="20" fill="#16a34a">  386</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Adding numbers up to three digits", "Totalling quantities, scores or money"],
      use_other_when: ["Small friendly numbers you can add in your head → use mental math"],
    },
    edge_cases: [
      { case: "Columns not lined up", value: "wrong answer", reasoning: "Ones must sit under ones — misalignment mixes place values.", where_it_appears: "Setup error." },
      { case: "A column summing to 10 or more", value: "carry to the next column", reasoning: "Only one digit fits per place.", where_it_appears: "Leads into carrying." },
    ],
    video_script_hooks: {
      opening_hook: "Adding 234 and 152? Stack them so the ones, tens and hundreds line up — then it's just three easy little sums.",
      concept_reveal: "Column addition lines numbers up by place value and adds each column from the right, carrying when needed.",
    },
  },

  math3_ch3_carrying: {
    key_formulas: [
      { formula: "When a column adds to 10 or more, write the ones digit and CARRY the ten", explanation: "8 + 5 = 13 → write 3, carry 1 to the next column." },
      { formula: "Add the carried 1 into the next column's sum", explanation: "It joins the tens (or hundreds) being added." },
    ],
    prerequisite_knowledge: ["column addition", "place value", "addition facts to 18"],
    visual_description: "147 + 28: the ones column 7+8 = 15, writing 5 and carrying a small 1 above the tens column.",
    svg_diagrams: [svg("math3_ch3_carrying", "Carrying: 147 + 28",
      `<text x="120" y="35" font-family="monospace" font-size="14" fill="#dc2626">  1</text>
       <text x="120" y="58" font-family="monospace" font-size="20">  147</text>
       <text x="120" y="84" font-family="monospace" font-size="20">+  28</text>
       <line x1="135" y1="92" x2="230" y2="92" stroke="#475569"/>
       <text x="120" y="116" font-family="monospace" font-size="20" fill="#16a34a">  175</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A column's digits add to 10 or more", "Adding numbers where places 'overflow'"],
      use_other_when: ["Every column stays under 10 → no carrying needed"],
    },
    edge_cases: [
      { case: "Forgetting to add the carried 1", value: "answer too small", reasoning: "The carry must join the next column.", where_it_appears: "The classic carrying slip." },
      { case: "Carrying twice (e.g. 99 + 1)", value: "can ripple across places", reasoning: "Each full column carries on to the next.", where_it_appears: "Chained carries." },
    ],
    video_script_hooks: {
      opening_hook: "7 plus 8 is 15 — but only one digit fits in the ones place. So the 1 'carries' next door to the tens. That little 1 is easy to forget!",
      concept_reveal: "Carrying moves the extra ten into the next column whenever a column's sum spills past 9.",
    },
  },

  math3_ch3_subtraction_3digit: {
    key_formulas: [
      { formula: "Line up by place value, then subtract each column from the right", explanation: "Ones from ones, tens from tens." },
      { formula: "If the top digit is smaller, BORROW from the next column", explanation: "386 − 152 = 234." },
    ],
    prerequisite_knowledge: ["place value", "subtraction facts", "column setup"],
    visual_description: "A column subtraction 386 − 152 aligned by place, giving 234.",
    svg_diagrams: [svg("math3_ch3_subtraction", "Column subtraction 386 − 152",
      `<text x="120" y="50" font-family="monospace" font-size="20">  386</text>
       <text x="120" y="80" font-family="monospace" font-size="20">- 152</text>
       <line x1="135" y1="90" x2="230" y2="90" stroke="#475569"/>
       <text x="120" y="115" font-family="monospace" font-size="20" fill="#16a34a">  234</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the difference between numbers up to 999", "Working out change, how many left, or how many more"],
      use_other_when: ["Easy numbers you can take away mentally"],
    },
    edge_cases: [
      { case: "Top digit smaller than bottom (e.g. 3 − 7)", value: "borrow from the next column", reasoning: "You can't take 7 from 3 directly.", where_it_appears: "Leads into borrowing." },
      { case: "Check by adding back", value: "answer + smaller number = bigger number", reasoning: "234 + 152 = 386 confirms it.", where_it_appears: "Self-checking." },
    ],
    video_script_hooks: {
      opening_hook: "You had 386 marbles and gave away 152. Stack them by place value and subtract column by column to find what's left.",
      concept_reveal: "Column subtraction lines numbers up by place and takes away each column from the right, borrowing when the top is too small.",
    },
  },

  math3_ch3_borrowing: {
    key_formulas: [
      { formula: "When the top digit is smaller, borrow 1 from the next-left column", explanation: "It becomes 10 in the current column." },
      { formula: "The column you borrowed from drops by 1", explanation: "e.g. in 52 − 7, the 5 tens become 4 tens and the ones become 12." },
    ],
    prerequisite_knowledge: ["column subtraction", "place value", "subtraction facts to 18"],
    visual_description: "62 − 28: the ones 2 borrows from the 6 tens, becoming 12 − 8 = 4, with the tens now 5 − 2 = 3, giving 34.",
    svg_diagrams: [svg("math3_ch3_borrowing", "Borrowing: 62 − 28",
      `<text x="120" y="35" font-family="monospace" font-size="14" fill="#dc2626"> 5 12</text>
       <text x="120" y="58" font-family="monospace" font-size="20">  6 2</text>
       <text x="120" y="84" font-family="monospace" font-size="20">- 2 8</text>
       <line x1="135" y1="92" x2="235" y2="92" stroke="#475569"/>
       <text x="120" y="116" font-family="monospace" font-size="20" fill="#16a34a">  3 4</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A column's top digit is smaller than the bottom one", "Subtracting across places (regrouping)"],
      use_other_when: ["Every top digit is big enough → subtract straight, no borrowing"],
    },
    edge_cases: [
      { case: "Borrowing across a 0 (e.g. 503 − 47)", value: "borrow ripples through the zero", reasoning: "The 0 tens become 9 after passing the borrow along.", where_it_appears: "Zeros in the middle." },
      { case: "Forgetting to reduce the lent column", value: "answer too big", reasoning: "The column you borrowed from must drop by 1.", where_it_appears: "Common borrowing error." },
    ],
    video_script_hooks: {
      opening_hook: "You can't take 8 from 2 … so the 2 borrows a ten from next door and becomes 12. Now 12 − 8 is easy. That's borrowing.",
      concept_reveal: "Borrowing regroups one ten (or hundred) into the smaller place so you can subtract, and the lending column drops by one.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 4 — Length (cm and m)
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch4_units_cm_m: {
    key_formulas: [
      { formula: "1 metre (m) = 100 centimetres (cm)", explanation: "The metre is the bigger unit." },
      { formula: "Use cm for small things, m for big things", explanation: "A pencil in cm; a room in m." },
    ],
    prerequisite_knowledge: ["counting to 100", "the idea of length", "multiplication/division by 100"],
    visual_description: "A metre stick marked 0 to 100 cm, with a short pencil measured in cm beside a tall door measured in m.",
    svg_diagrams: [svg("math3_ch4_units", "1 m = 100 cm",
      `<line x1="40" y1="60" x2="460" y2="60" stroke="#475569" stroke-width="2"/><text x="35" y="50">0</text><text x="445" y="50">100 cm = 1 m</text>
       <text x="40" y="110">pencil → cm</text><text x="250" y="110">door → m</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Choosing the right unit for a length", "Converting between cm and m"],
      use_other_when: ["Very long distances (roads) → kilometres are better (learnt later)"],
    },
    edge_cases: [
      { case: "150 cm", value: "= 1 m 50 cm", reasoning: "100 cm makes 1 m, with 50 cm left over.", where_it_appears: "Mixed units." },
      { case: "Measuring a pencil in metres", value: "awkward (0.15 m)", reasoning: "cm fits small objects better.", where_it_appears: "Picking sensible units." },
    ],
    video_script_hooks: {
      opening_hook: "Would you measure your pencil in metres? That's like weighing a feather in kilograms. Small things want centimetres.",
      concept_reveal: "Length comes in units: 100 small centimetres make one big metre, and you pick the unit to fit the object.",
    },
  },

  math3_ch4_measuring_length: {
    key_formulas: [
      { formula: "Line the object's start with the 0 mark of the ruler", explanation: "Read the number at the other end." },
      { formula: "The length is the END reading minus the START reading", explanation: "If you start at 0, the end reading IS the length." },
    ],
    prerequisite_knowledge: ["reading a number scale", "units cm and m", "counting"],
    visual_description: "A crayon laid along a ruler with its left end at 0 and its right end at 8, reading 8 cm.",
    svg_diagrams: [svg("math3_ch4_measuring", "Measuring a crayon: 8 cm",
      `<rect x="40" y="80" width="420" height="30" fill="#fff" stroke="#475569"/>
       ${Array.from({length:11},(_,i)=>`<line x1="${50+i*40}" y1="80" x2="${50+i*40}" y2="95" stroke="#475569"/><text x="${46+i*40}" y="128" font-size="10">${i}</text>`).join("")}
       <rect x="50" y="55" width="320" height="18" fill="#fca5a5" stroke="#dc2626"/><text x="380" y="68" fill="#dc2626">8 cm</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the exact length of an object with a ruler", "Drawing a line of a given length"],
      use_other_when: ["You only need a rough idea → estimate instead of measuring"],
    },
    edge_cases: [
      { case: "Starting at the 1 mark, not 0", value: "subtract: end − 1", reasoning: "Length is the difference, so a non-zero start must be subtracted.", where_it_appears: "Broken-ruler problems." },
      { case: "Object end between two marks", value: "read to the nearest cm", reasoning: "Round to the closest mark.", where_it_appears: "In-between readings." },
    ],
    video_script_hooks: {
      opening_hook: "Put the crayon's end on ZERO, not on the edge of the ruler. Get that wrong and every measurement is off by a bit.",
      concept_reveal: "To measure, align one end with 0 and read the other end — that reading is the length in centimetres.",
    },
  },

  math3_ch4_comparing_lengths: {
    key_formulas: [
      { formula: "To compare, use the SAME unit for both lengths", explanation: "Change m to cm (or back) first if they differ." },
      { formula: "Longer = bigger number (in the same unit)", explanation: "Use >, < or =." },
    ],
    prerequisite_knowledge: ["measuring length", "cm and m conversion", "comparing numbers"],
    visual_description: "A 120 cm ribbon and a 1 m (100 cm) ribbon drawn to scale, showing the 120 cm one is longer.",
    svg_diagrams: [svg("math3_ch4_comparing", "120 cm vs 1 m",
      `<rect x="40" y="60" width="280" height="20" fill="#bfdbfe" stroke="#2563eb"/><text x="330" y="76">120 cm</text>
       <rect x="40" y="110" width="233" height="20" fill="#bbf7d0" stroke="#16a34a"/><text x="285" y="126">1 m = 100 cm</text>
       <text x="40" y="165" fill="#dc2626">120 cm &gt; 100 cm</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which of two objects is longer/shorter", "Ordering lengths"],
      use_other_when: ["Lengths are already in the same unit and obviously different"],
    },
    edge_cases: [
      { case: "Comparing 1 m and 90 cm", value: "1 m (100 cm) is longer", reasoning: "Convert to the same unit first.", where_it_appears: "Mixed-unit comparison." },
      { case: "Comparing without converting", value: "wrong (90 > 1?)", reasoning: "You must use one common unit.", where_it_appears: "The classic trap." },
    ],
    video_script_hooks: {
      opening_hook: "Is 90 cm longer than 1 m? The numbers say 90 is bigger than 1 — but that's a trick. Switch to the same unit first!",
      concept_reveal: "Before comparing lengths, put both in the same unit; then the bigger number is simply the longer one.",
    },
  },

  math3_ch4_estimating: {
    key_formulas: [
      { formula: "Estimating = a sensible guess of length without measuring", explanation: "Use known references (a fingernail ≈ 1 cm, a door ≈ 2 m)." },
      { formula: "Estimate first, then measure to check", explanation: "Good estimates get closer with practice." },
    ],
    prerequisite_knowledge: ["units cm and m", "measuring length", "everyday size sense"],
    visual_description: "A hand showing a fingernail (~1 cm) and a stride (~1 m) as reference lengths for estimating.",
    svg_diagrams: [svg("math3_ch4_estimating", "Reference lengths for estimating",
      `<text x="30" y="50">fingernail ≈ 1 cm</text>
       <text x="30" y="90">hand span ≈ 15 cm</text>
       <text x="30" y="130">one big step ≈ 1 m</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A rough size is enough (no ruler handy)", "Checking if a measured answer is reasonable"],
      use_other_when: ["You need the exact length → measure with a ruler"],
    },
    edge_cases: [
      { case: "Estimating a classroom in cm", value: "use m instead", reasoning: "Big lengths are easier to estimate in metres.", where_it_appears: "Choosing units to estimate." },
      { case: "An estimate far from the measurement", value: "re-check your reference", reasoning: "A wildly different result suggests the wrong benchmark.", where_it_appears: "Sense-checking." },
    ],
    video_script_hooks: {
      opening_hook: "How wide is your classroom? You don't always need a tape measure — your own footsteps make a surprisingly good ruler.",
      concept_reveal: "Estimating uses familiar lengths — a nail, a span, a step — to make a smart guess before (or instead of) measuring.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 5 — Shapes (2D, 3D, tiling, symmetry)
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch5_2d_shapes: {
    key_formulas: [
      { formula: "2D (flat) shapes have only length and width — no thickness", explanation: "Circle, triangle, square, rectangle." },
      { formula: "Count sides and corners to name a shape", explanation: "Triangle = 3 sides; square = 4 equal sides." },
    ],
    prerequisite_knowledge: ["recognising basic shapes", "counting", "straight vs curved lines"],
    visual_description: "A row of flat shapes — circle, triangle, square, rectangle — each labelled with its number of sides.",
    svg_diagrams: [svg("math3_ch5_2d_shapes", "Common 2D shapes",
      `<circle cx="70" cy="90" r="35" fill="#dbeafe" stroke="#2563eb"/><text x="50" y="150">circle</text>
       <polygon points="180,125 230,125 205,60" fill="#bbf7d0" stroke="#16a34a"/><text x="180" y="150">triangle</text>
       <rect x="290" y="55" width="70" height="70" fill="#fde68a" stroke="#d97706"/><text x="300" y="150">square</text>
       <rect x="420" y="65" width="90" height="55" fill="#fbcfe8" stroke="#db2777"/><text x="425" y="150">rectangle</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Naming flat shapes by sides and corners", "Sorting shapes into groups"],
      use_other_when: ["The object has thickness/depth → it's a 3D shape"],
    },
    edge_cases: [
      { case: "A square", value: "is a special rectangle (all sides equal)", reasoning: "Both have 4 right-angled corners.", where_it_appears: "Overlapping names." },
      { case: "A circle", value: "has no straight sides or corners", reasoning: "It's one curved line.", where_it_appears: "Curved shapes." },
    ],
    video_script_hooks: {
      opening_hook: "How do you tell a square from a triangle without even thinking? You count corners. Shapes wear their names in their sides.",
      concept_reveal: "2D shapes are flat — counting their sides and corners is all you need to name them.",
    },
  },

  math3_ch5_3d_shapes: {
    key_formulas: [
      { formula: "3D (solid) shapes have length, width AND height", explanation: "Cube, cuboid, sphere, cylinder, cone." },
      { formula: "They have faces (flat surfaces), edges and corners (vertices)", explanation: "A cube has 6 faces, 12 edges, 8 corners." },
    ],
    prerequisite_knowledge: ["2D shapes", "everyday solid objects", "counting"],
    visual_description: "A cube, sphere, cylinder and cone with everyday matches: dice, ball, can, ice-cream cone.",
    svg_diagrams: [svg("math3_ch5_3d_shapes", "Common 3D shapes",
      `<rect x="40" y="60" width="55" height="55" fill="#dbeafe" stroke="#2563eb"/><polygon points="40,60 60,45 115,45 95,60" fill="#bfdbfe" stroke="#2563eb"/><polygon points="95,60 115,45 115,100 95,115" fill="#93c5fd" stroke="#2563eb"/><text x="45" y="140">cube</text>
       <circle cx="200" cy="90" r="32" fill="#fecaca" stroke="#dc2626"/><text x="175" y="140">sphere</text>
       <ellipse cx="320" cy="60" rx="30" ry="10" fill="#fde68a" stroke="#d97706"/><rect x="290" y="60" width="60" height="55" fill="#fef08a" stroke="#d97706"/><ellipse cx="320" cy="115" rx="30" ry="10" fill="#fde68a" stroke="#d97706"/><text x="300" y="140">cylinder</text>
       <polygon points="430,115 470,115 450,55" fill="#bbf7d0" stroke="#16a34a"/><text x="435" y="140">cone</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Naming solid objects by their shape", "Counting faces, edges and corners"],
      use_other_when: ["The shape is flat (drawn on paper) → it's 2D"],
    },
    edge_cases: [
      { case: "A sphere", value: "has no flat faces, edges or corners", reasoning: "It's perfectly round.", where_it_appears: "Round solids." },
      { case: "A cylinder", value: "has 2 flat circular faces and 1 curved surface", reasoning: "Like a tin can.", where_it_appears: "Mixed surfaces." },
    ],
    video_script_hooks: {
      opening_hook: "A drawing of a box is flat — but a real dice you can hold. That extra dimension, height, is what makes a shape 3D.",
      concept_reveal: "3D shapes are solid — they have faces, edges and corners, and you meet them as dice, balls, cans and cones every day.",
    },
  },

  math3_ch5_tiling: {
    key_formulas: [
      { formula: "Tiling covers a surface with shapes leaving NO gaps and NO overlaps", explanation: "Like floor tiles fitting together." },
      { formula: "Squares, rectangles and triangles tile easily", explanation: "Circles leave gaps." },
    ],
    prerequisite_knowledge: ["2D shapes", "fitting shapes together", "the idea of covering a surface"],
    visual_description: "A floor neatly covered by identical square tiles with no gaps, beside circles that leave gaps between them.",
    svg_diagrams: [svg("math3_ch5_tiling", "Squares tile; circles leave gaps",
      `${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${40+c*40}" y="${50+r*40}" width="40" height="40" fill="${(r+c)%2?'#dbeafe':'#fff'}" stroke="#475569"/>`).join("")).join("")}
       <text x="55" y="185">tiles (no gaps)</text>
       ${[0,1,2].map(r=>[0,1,2].map(c=>`<circle cx="${330+c*40}" cy="${70+r*40}" r="18" fill="#fecaca" stroke="#dc2626"/>`).join("")).join("")}
       <text x="340" y="185">circles (gaps)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which shapes cover a surface without gaps", "Designing tile or brick patterns"],
      use_other_when: ["You only need to name a shape, not fit copies together"],
    },
    edge_cases: [
      { case: "Circles", value: "do NOT tile", reasoning: "Round edges leave gaps between them.", where_it_appears: "Why floors aren't round-tiled." },
      { case: "A regular hexagon", value: "tiles perfectly (honeycomb)", reasoning: "Its edges fit together with no gaps.", where_it_appears: "Honeycomb patterns." },
    ],
    video_script_hooks: {
      opening_hook: "Why are floor tiles square and never round? Lay circles down and you'll see — annoying little gaps everywhere.",
      concept_reveal: "Tiling fits copies of a shape together with no gaps or overlaps; squares and triangles do it, circles can't.",
    },
  },

  math3_ch5_symmetry: {
    key_formulas: [
      { formula: "A line of symmetry folds a shape into two matching halves", explanation: "The halves are mirror images." },
      { formula: "Some shapes have many lines of symmetry, some have none", explanation: "A square has 4; a scalene triangle has 0." },
    ],
    prerequisite_knowledge: ["2D shapes", "mirror images", "folding"],
    visual_description: "A butterfly and a square each with a dashed fold line showing the two halves match exactly.",
    svg_diagrams: [svg("math3_ch5_symmetry", "Lines of symmetry",
      `<line x1="110" y1="40" x2="110" y2="150" stroke="#dc2626" stroke-dasharray="4 3"/>
       <ellipse cx="80" cy="95" rx="28" ry="42" fill="#fde68a" stroke="#d97706"/><ellipse cx="140" cy="95" rx="28" ry="42" fill="#fde68a" stroke="#d97706"/><text x="70" y="175">butterfly: 1 line</text>
       <rect x="300" y="50" width="90" height="90" fill="#dbeafe" stroke="#2563eb"/><line x1="345" y1="50" x2="345" y2="140" stroke="#dc2626" stroke-dasharray="4 3"/><line x1="300" y1="95" x2="390" y2="95" stroke="#dc2626" stroke-dasharray="4 3"/><text x="305" y="175">square: 4 lines</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding fold lines that make matching halves", "Completing a shape from one half"],
      use_other_when: ["The shape only matches when turned → that's rotational symmetry (learnt later)"],
    },
    edge_cases: [
      { case: "A scalene triangle", value: "has no line of symmetry", reasoning: "No fold makes its halves match.", where_it_appears: "Asymmetric shapes." },
      { case: "A circle", value: "has endless lines of symmetry", reasoning: "Every line through the centre works.", where_it_appears: "Most symmetric shape." },
    ],
    video_script_hooks: {
      opening_hook: "Fold a butterfly down the middle and its wings land exactly on top of each other. That fold line is a line of symmetry.",
      concept_reveal: "A line of symmetry splits a shape into two mirror-matching halves; counting them shows how balanced the shape is.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 6 — Word Problems, Mental Math & Estimation
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch6_word_problems_add: {
    key_formulas: [
      { formula: "Words like 'altogether', 'in all', 'total', 'sum' → ADD", explanation: "Combining groups means addition." },
      { formula: "Find the numbers, decide the operation, then calculate", explanation: "Read carefully before computing." },
    ],
    prerequisite_knowledge: ["addition of 3-digit numbers", "reading sentences", "carrying"],
    visual_description: "A word problem 'Riya has 125 stamps and gets 48 more — how many in all?' mapped to 125 + 48 = 173.",
    svg_diagrams: [svg("math3_ch6_wp_add", "Words → addition",
      `<text x="20" y="40">"125 stamps + 48 more, how many in ALL?"</text>
       <text x="20" y="85" fill="#2563eb">'in all' → add</text>
       <text x="20" y="125" fill="#16a34a">125 + 48 = 173</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A story about combining or gaining amounts", "Finding a total from parts"],
      use_other_when: ["The story is about taking away or finding a difference → subtract"],
    },
    edge_cases: [
      { case: "'How many more does he NEED?'", value: "may be subtraction, not addition", reasoning: "Keywords help but you must understand the situation.", where_it_appears: "Tricky wording." },
      { case: "Three quantities to combine", value: "add all three", reasoning: "'Altogether' can join more than two amounts.", where_it_appears: "Multi-part totals." },
    ],
    video_script_hooks: {
      opening_hook: "'Altogether', 'in all', 'total' — these little words are secret signals telling you to add. Learn to spot them and word problems get easy.",
      concept_reveal: "Addition word problems combine amounts; find the numbers, notice the 'joining' words, then add.",
    },
  },

  math3_ch6_word_problems_sub: {
    key_formulas: [
      { formula: "Words like 'left', 'how many more', 'difference', 'remaining' → SUBTRACT", explanation: "Taking away or comparing means subtraction." },
      { formula: "Bigger amount − smaller amount = the answer", explanation: "e.g. 200 − 75 = 125 left." },
    ],
    prerequisite_knowledge: ["subtraction of 3-digit numbers", "borrowing", "reading sentences"],
    visual_description: "'A shop had 200 apples and sold 75 — how many left?' mapped to 200 − 75 = 125.",
    svg_diagrams: [svg("math3_ch6_wp_sub", "Words → subtraction",
      `<text x="20" y="40">"200 apples, sold 75, how many LEFT?"</text>
       <text x="20" y="85" fill="#2563eb">'left' → subtract</text>
       <text x="20" y="125" fill="#16a34a">200 − 75 = 125</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A story about taking away, spending, or comparing", "Finding 'how many more/fewer' or what remains"],
      use_other_when: ["The story combines amounts → that's addition"],
    },
    edge_cases: [
      { case: "'How many more apples than oranges?'", value: "subtract the two counts", reasoning: "Comparison = difference.", where_it_appears: "Compare problems." },
      { case: "Subtracting the wrong way round", value: "wrong (can't take big from small here)", reasoning: "Always take the smaller from the bigger.", where_it_appears: "Order matters." },
    ],
    video_script_hooks: {
      opening_hook: "'How many are LEFT?' 'How many MORE?' Those phrases are quietly asking you to subtract. The words tell you the maths.",
      concept_reveal: "Subtraction word problems take away or compare; spot the 'left/more/difference' words and subtract smaller from bigger.",
    },
  },

  math3_ch6_mental_math: {
    key_formulas: [
      { formula: "Break numbers into easy parts: 47 + 25 = 47 + 20 + 5", explanation: "Add the tens, then the ones." },
      { formula: "Round and adjust: 99 + 46 = 100 + 46 − 1", explanation: "Use friendly numbers, then fix up." },
    ],
    prerequisite_knowledge: ["place value", "addition and subtraction facts", "skip counting"],
    visual_description: "47 + 25 done mentally: 47 + 20 = 67, then 67 + 5 = 72, shown as two hops on a number line.",
    svg_diagrams: [svg("math3_ch6_mental_math", "47 + 25 in steps",
      `<text x="20" y="40">47 + 25</text>
       <text x="20" y="80" fill="#2563eb">47 + 20 = 67</text>
       <text x="20" y="120" fill="#16a34a">67 + 5 = 72</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Adding/subtracting small or friendly numbers quickly", "Checking a written answer"],
      use_other_when: ["Big or messy numbers → use column methods on paper"],
    },
    edge_cases: [
      { case: "Adding 9", value: "add 10 then take 1 away", reasoning: "Friendly-number shortcut.", where_it_appears: "Near-ten tricks." },
      { case: "Splitting wrongly (47 = 40 + 5)", value: "error", reasoning: "47 is 40 + 7, not 40 + 5 — split carefully.", where_it_appears: "Careless breaking." },
    ],
    video_script_hooks: {
      opening_hook: "47 + 25 in your head feels hard — until you add the 20 first, then the 5. Suddenly it's two baby steps, not one giant leap.",
      concept_reveal: "Mental math breaks numbers into friendly chunks — tens then ones, or round-and-adjust — so you can compute without writing.",
    },
  },

  math3_ch6_estimation: {
    key_formulas: [
      { formula: "Round each number to the nearest ten (or hundred), then add/subtract", explanation: "47 + 38 ≈ 50 + 40 = 90." },
      { formula: "An estimate is close, not exact", explanation: "It tells you the right 'ballpark'." },
    ],
    prerequisite_knowledge: ["rounding to nearest 10/100", "addition and subtraction", "place value"],
    visual_description: "47 + 38 estimated as 50 + 40 = 90, beside the exact answer 85, showing the estimate is close.",
    svg_diagrams: [svg("math3_ch6_estimation", "Estimate 47 + 38 ≈ 90",
      `<text x="20" y="45">47 → 50,   38 → 40</text>
       <text x="20" y="90" fill="#2563eb">estimate: 50 + 40 = 90</text>
       <text x="20" y="130" fill="#16a34a">exact: 85 (close!)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A quick approximate answer is enough", "Checking whether an exact answer is reasonable"],
      use_other_when: ["You need the precise total (money, counts) → calculate exactly"],
    },
    edge_cases: [
      { case: "Rounding both numbers up", value: "estimate is a bit high", reasoning: "Rounding direction nudges the estimate.", where_it_appears: "Why estimate ≠ exact." },
      { case: "An exact answer far from the estimate", value: "re-check your working", reasoning: "A big gap signals a calculation slip.", where_it_appears: "Using estimates to check." },
    ],
    video_script_hooks: {
      opening_hook: "Will ₹47 and ₹38 of shopping be under ₹100? Round to 50 and 40 — about 90. Yes! Estimating answers the question before you do the exact sum.",
      concept_reveal: "Estimation rounds numbers to friendly tens or hundreds for a fast, close answer — perfect for quick checks.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 7 — Time (clock, AM/PM, calendar, duration)
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch7_reading_clock: {
    key_formulas: [
      { formula: "Short hand = hours, long hand = minutes", explanation: "The clock face has 12 hours and 60 minutes." },
      { formula: "Each number-to-number gap = 5 minutes", explanation: "The long hand on 3 means 15 minutes." },
    ],
    prerequisite_knowledge: ["counting to 60", "skip counting by 5", "reading numbers 1–12"],
    visual_description: "A clock showing 3:15 — short hand just past 3, long hand on the 3 (15 minutes).",
    svg_diagrams: [svg("math3_ch7_clock", "Reading 3:15",
      `<circle cx="120" cy="100" r="70" fill="#fff" stroke="#475569" stroke-width="2"/>
       <text x="115" y="45">12</text><text x="183" y="105">3</text><text x="115" y="175">6</text><text x="48" y="105">9</text>
       <line x1="120" y1="100" x2="120" y2="55" stroke="#2563eb" stroke-width="4"/>
       <line x1="120" y1="100" x2="175" y2="105" stroke="#dc2626" stroke-width="3"/>
       <text x="230" y="105" font-weight="bold">3:15</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Telling the time from a clock face", "Reading hours and minutes"],
      use_other_when: ["A digital clock already shows the numbers"],
    },
    edge_cases: [
      { case: "Long hand on 6", value: "30 minutes (half past)", reasoning: "6 × 5 = 30.", where_it_appears: "Half-past times." },
      { case: "Short hand between 3 and 4", value: "the hour is still 3", reasoning: "It hasn't reached 4 yet.", where_it_appears: "Reading the hour." },
    ],
    video_script_hooks: {
      opening_hook: "Two hands, one clock — which is which? The short, lazy one tells the hour; the long, busy one counts the minutes.",
      concept_reveal: "Read the short hand for the hour and the long hand for minutes, counting 5 for every number it passes.",
    },
  },

  math3_ch7_am_pm: {
    key_formulas: [
      { formula: "AM = midnight to noon (morning) · PM = noon to midnight (afternoon/night)", explanation: "Each runs 12 hours." },
      { formula: "12 AM = midnight · 12 PM = noon", explanation: "The two tricky ones to remember." },
    ],
    prerequisite_knowledge: ["reading a clock", "parts of the day", "numbers to 12"],
    visual_description: "A day-strip from midnight to midnight split into AM (sunrise side) and PM (sunset side) at noon.",
    svg_diagrams: [svg("math3_ch7_am_pm", "AM and PM split the day",
      `<rect x="40" y="70" width="200" height="40" fill="#fef9c3" stroke="#d97706"/><text x="100" y="95">AM (morning)</text>
       <rect x="240" y="70" width="200" height="40" fill="#c7d2fe" stroke="#4f46e5"/><text x="300" y="95">PM (after noon)</text>
       <text x="220" y="135">noon (12 PM)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Saying whether a time is morning or afternoon/night", "Avoiding mix-ups like 7 AM vs 7 PM"],
      use_other_when: ["Using 24-hour time (learnt later) — no AM/PM needed"],
    },
    edge_cases: [
      { case: "12 AM", value: "midnight (start of the day)", reasoning: "Not noon — a common confusion.", where_it_appears: "The classic AM/PM trap." },
      { case: "12 PM", value: "noon (middle of the day)", reasoning: "Right after 11 AM.", where_it_appears: "Midday." },
    ],
    video_script_hooks: {
      opening_hook: "School at 8 o'clock — but morning or night?! AM and PM are the labels that stop 8 AM breakfast becoming 8 PM dinner.",
      concept_reveal: "AM covers midnight-to-noon, PM covers noon-to-midnight — and 12 AM is midnight while 12 PM is noon.",
    },
  },

  math3_ch7_calendar: {
    key_formulas: [
      { formula: "1 week = 7 days · 1 year = 12 months = 365 days", explanation: "366 in a leap year." },
      { formula: "Months have 30 or 31 days; February has 28 (29 in a leap year)", explanation: "'Thirty days hath September…'" },
    ],
    prerequisite_knowledge: ["counting", "days of the week", "reading a table/grid"],
    visual_description: "A month grid (Su–Sa columns, week rows) with a date circled, beside the list of 12 months.",
    svg_diagrams: [svg("math3_ch7_calendar", "A calendar month",
      `<text x="40" y="35" font-weight="bold">Su Mo Tu We Th Fr Sa</text>
       ${[0,1,2].map(r=>[0,1,2,3,4,5,6].map(c=>{const d=r*7+c+1;return d<=21?`<text x="${40+c*55}" y="${65+r*30}">${d}</text>`:""}).join("")).join("")}
       <circle cx="152" cy="60" r="13" fill="none" stroke="#dc2626"/>
       <text x="40" y="170">12 months: Jan … Dec</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding dates, days of the week, and months", "Planning across days, weeks or months"],
      use_other_when: ["Timing within a single day → use a clock"],
    },
    edge_cases: [
      { case: "February", value: "28 days (29 in a leap year)", reasoning: "The only short, variable month.", where_it_appears: "Leap years." },
      { case: "Day after Saturday", value: "Sunday (the week restarts)", reasoning: "Weeks cycle every 7 days.", where_it_appears: "Wrapping the week." },
    ],
    video_script_hooks: {
      opening_hook: "Why does February sometimes have 29 days? The calendar is full of these little rules — once you know them, you can find ANY day.",
      concept_reveal: "A calendar organises 7-day weeks into months and 12 months into a year, so we can pin down any date.",
    },
  },

  math3_ch7_duration: {
    key_formulas: [
      { formula: "Duration = end time − start time", explanation: "From 4:00 to 6:00 is 2 hours." },
      { formula: "1 hour = 60 minutes", explanation: "Count whole hours, then the extra minutes." },
    ],
    prerequisite_knowledge: ["reading a clock", "subtraction", "1 hour = 60 minutes"],
    visual_description: "A timeline from 4:00 to 6:30 with a 2 h 30 min bracket spanning it.",
    svg_diagrams: [svg("math3_ch7_duration", "From 4:00 to 6:30 = 2 h 30 min",
      `<line x1="40" y1="100" x2="460" y2="100" stroke="#475569" stroke-width="2"/>
       <line x1="70" y1="92" x2="70" y2="108" stroke="#475569"/><text x="55" y="128">4:00</text>
       <line x1="430" y1="92" x2="430" y2="108" stroke="#475569"/><text x="410" y="128">6:30</text>
       <path d="M70 75 H430" stroke="#dc2626"/><text x="200" y="68" fill="#dc2626">2 h 30 min</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding how long something lasts", "Working out finish times from start + duration"],
      use_other_when: ["You just need the current time, not an interval → read the clock"],
    },
    edge_cases: [
      { case: "Crossing the hour (4:50 to 5:10)", value: "20 minutes", reasoning: "10 min to 5:00, then 10 min more.", where_it_appears: "Spanning an hour." },
      { case: "Crossing noon (11 AM to 1 PM)", value: "2 hours", reasoning: "Count through 12:00 noon.", where_it_appears: "AM-to-PM durations." },
    ],
    video_script_hooks: {
      opening_hook: "The film starts at 4:00 and ends at 6:30. How long is it? Duration is just the gap between start and finish — 2 and a half hours.",
      concept_reveal: "Duration is end time minus start time; count whole hours first, then the leftover minutes.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 8 — Weight (grams, kilograms, balance)
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch8_heavier_lighter: {
    key_formulas: [
      { formula: "Heavier sinks down on a balance; lighter rises up", explanation: "The lower pan holds the heavier object." },
      { formula: "Size does NOT decide weight", explanation: "A big balloon is lighter than a small stone." },
    ],
    prerequisite_knowledge: ["comparing objects", "the idea of weight/heaviness", "up and down"],
    visual_description: "A balance with a stone pulling its pan down and a feather's pan up, labelled heavier and lighter.",
    svg_diagrams: [svg("math3_ch8_heavier_lighter", "Heavier pan goes down",
      `<line x1="60" y1="60" x2="320" y2="100" stroke="#475569" stroke-width="3"/>
       <line x1="190" y1="55" x2="190" y2="150" stroke="#475569" stroke-width="3"/>
       <circle cx="320" cy="110" r="14" fill="#94a3b8"/><text x="345" y="115">stone (heavier)</text>
       <text x="20" y="55">feather</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Comparing which of two objects is heavier", "Reading a simple balance"],
      use_other_when: ["You need the exact weight → use weighing scales with units"],
    },
    edge_cases: [
      { case: "A big sponge vs a small metal ball", value: "the small ball can be heavier", reasoning: "Weight isn't about size.", where_it_appears: "Size ≠ weight." },
      { case: "Balance level", value: "both sides weigh the same", reasoning: "Equal weights balance.", where_it_appears: "Equal weights." },
    ],
    video_script_hooks: {
      opening_hook: "A giant beach ball or a tiny stone — which is heavier? Trust the balance, not your eyes: big doesn't mean heavy.",
      concept_reveal: "On a balance the heavier object sinks and the lighter rises — and surprisingly, size has nothing to do with it.",
    },
  },

  math3_ch8_grams_kilograms: {
    key_formulas: [
      { formula: "1 kilogram (kg) = 1000 grams (g)", explanation: "The kilogram is the bigger unit." },
      { formula: "Use grams for light things, kilograms for heavy things", explanation: "A biscuit in g; a school bag in kg." },
    ],
    prerequisite_knowledge: ["the idea of weight", "counting to 1000", "multiply/divide by 1000"],
    visual_description: "A feather labelled grams beside a watermelon labelled kilograms, with 1 kg = 1000 g written between.",
    svg_diagrams: [svg("math3_ch8_grams_kg", "1 kg = 1000 g",
      `<text x="40" y="60">biscuit → grams (g)</text>
       <text x="40" y="100">watermelon → kilograms (kg)</text>
       <text x="40" y="150" fill="#dc2626">1 kg = 1000 g</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Choosing g or kg for an object", "Converting between grams and kilograms"],
      use_other_when: ["Very heavy loads (trucks) → bigger units used later"],
    },
    edge_cases: [
      { case: "1500 g", value: "= 1 kg 500 g", reasoning: "1000 g make 1 kg, with 500 g left.", where_it_appears: "Mixed units." },
      { case: "Weighing a feather in kg", value: "awkwardly tiny", reasoning: "Grams suit light objects.", where_it_appears: "Choosing units." },
    ],
    video_script_hooks: {
      opening_hook: "Would you buy 1000 grams of rice or 1 kilogram? Trick question — they're exactly the same! One's just a tidier way to say it.",
      concept_reveal: "Weight uses grams for light things and kilograms for heavy ones, with 1000 grams making one kilogram.",
    },
  },

  math3_ch8_balance_scale: {
    key_formulas: [
      { formula: "An object's weight = the total of the standard weights that balance it", explanation: "Add the weights placed on the other pan." },
      { formula: "When the pans level out, the two sides are equal", explanation: "That's how we read the weight." },
    ],
    prerequisite_knowledge: ["heavier and lighter", "grams and kilograms", "addition"],
    visual_description: "A balance with an apple on one pan and 100 g + 50 g weights on the other, levelled, reading 150 g.",
    svg_diagrams: [svg("math3_ch8_balance_scale", "Apple balances 150 g",
      `<line x1="80" y1="80" x2="320" y2="80" stroke="#475569" stroke-width="3"/>
       <line x1="200" y1="75" x2="200" y2="150" stroke="#475569" stroke-width="3"/>
       <circle cx="100" cy="100" r="16" fill="#fca5a5" stroke="#dc2626"/><text x="80" y="135">apple</text>
       <rect x="290" y="92" width="55" height="20" fill="#cbd5e1" stroke="#475569"/><text x="350" y="107">100g+50g</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding an object's weight using standard weights", "Understanding how scales work"],
      use_other_when: ["A digital scale shows the number directly"],
    },
    edge_cases: [
      { case: "Pans don't level", value: "add or remove weights until they do", reasoning: "Balance means equal weight.", where_it_appears: "Adjusting weights." },
      { case: "Weights 200 g + 200 g + 100 g", value: "object is 500 g", reasoning: "Add all the standard weights used.", where_it_appears: "Combining weights." },
    ],
    video_script_hooks: {
      opening_hook: "How heavy is an apple? Pop it on a balance and keep adding little weights to the other side until it levels — their total is your answer.",
      concept_reveal: "A balance reads weight by matching: when both pans level, the standard weights added up equal the object's weight.",
    },
  },

  math3_ch8_weight_word: {
    key_formulas: [
      { formula: "Add weights to combine, subtract to find 'how much more/left'", explanation: "Same operations as other word problems, with kg/g." },
      { formula: "Keep units the same before calculating", explanation: "Convert kg↔g if a problem mixes them." },
    ],
    prerequisite_knowledge: ["grams and kilograms", "addition and subtraction", "reading word problems"],
    visual_description: "'A bag holds 2 kg rice and 1 kg dal — total weight?' mapped to 2 kg + 1 kg = 3 kg.",
    svg_diagrams: [svg("math3_ch8_weight_word", "Weight word problem",
      `<text x="20" y="45">"2 kg rice + 1 kg dal = ?"</text>
       <text x="20" y="90" fill="#2563eb">'total' → add</text>
       <text x="20" y="130" fill="#16a34a">2 kg + 1 kg = 3 kg</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Story problems about combining or comparing weights", "Shopping/cooking weight questions"],
      use_other_when: ["No real quantity — just reading a scale → that's measuring"],
    },
    edge_cases: [
      { case: "Mixing 1 kg and 500 g", value: "convert to grams first (1000 g + 500 g)", reasoning: "Units must match to add.", where_it_appears: "Mixed-unit problems." },
      { case: "'How much heavier?'", value: "subtract the weights", reasoning: "Comparison → difference.", where_it_appears: "Compare problems." },
    ],
    video_script_hooks: {
      opening_hook: "Two kilos of rice, one of dal — how much to carry home? Weight word problems are just add-and-subtract wearing a kg label.",
      concept_reveal: "Weight word problems add or compare amounts; match the units first, then add or subtract as the story asks.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 9 — Multiplication
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch9_repeated_addition: {
    key_formulas: [
      { formula: "Multiplication is repeated addition of EQUAL groups", explanation: "4 × 3 = 3 + 3 + 3 + 3 = 12." },
      { formula: "'groups × size of group' = total", explanation: "4 bags of 3 apples = 12 apples." },
    ],
    prerequisite_knowledge: ["addition", "equal groups", "skip counting"],
    visual_description: "Four groups of 3 dots each, joined by '+' signs, with 4 × 3 = 12 written below.",
    svg_diagrams: [svg("math3_ch9_repeated_addition", "4 × 3 = 3+3+3+3 = 12",
      `${[0,1,2,3].map(g=>[0,1,2].map(d=>`<circle cx="${50+g*110+d*22}" cy="80" r="8" fill="#2563eb"/>`).join("")+`<text x="${85+g*110}" y="85">${g<3?'+':''}</text>`).join("")}
       <text x="50" y="140">4 groups of 3 = 12</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Understanding what multiplication means", "Adding the same number many times"],
      use_other_when: ["The groups are unequal → you must add them separately"],
    },
    edge_cases: [
      { case: "4 × 3 vs 3 × 4", value: "both = 12", reasoning: "Order doesn't change the total (commutative).", where_it_appears: "Why order is flexible." },
      { case: "Anything × 1", value: "= itself", reasoning: "One group of n is just n.", where_it_appears: "Multiplying by 1." },
    ],
    video_script_hooks: {
      opening_hook: "3 + 3 + 3 + 3 … writing that out is tiring. Multiplication is the shortcut: just '4 threes', or 4 × 3.",
      concept_reveal: "Multiplication is repeated addition of equal groups — 'how many groups' times 'how big each group is'.",
    },
  },

  math3_ch9_arrays: {
    key_formulas: [
      { formula: "An array arranges objects in equal rows and columns", explanation: "3 rows of 4 = 3 × 4 = 12." },
      { formula: "rows × columns = total", explanation: "The array shows the multiplication as a rectangle." },
    ],
    prerequisite_knowledge: ["repeated addition", "rows and columns", "counting"],
    visual_description: "A 3-by-4 grid of dots, with the rows and columns labelled, totalling 12.",
    svg_diagrams: [svg("math3_ch9_arrays", "3 × 4 array = 12",
      `${[0,1,2].map(r=>[0,1,2,3].map(c=>`<circle cx="${80+c*45}" cy="${50+r*40}" r="10" fill="#16a34a"/>`).join("")).join("")}
       <text x="80" y="180">3 rows × 4 = 12</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Picturing a multiplication as a rectangle of objects", "Seeing why a × b = b × a"],
      use_other_when: ["Groups aren't arranged in a neat grid → use repeated addition"],
    },
    edge_cases: [
      { case: "Turning a 3×4 array sideways", value: "becomes 4×3, still 12", reasoning: "Rotating swaps rows and columns but keeps the total.", where_it_appears: "Commutativity, visually." },
      { case: "A single row of 5", value: "1 × 5 = 5", reasoning: "One row is just the number itself.", where_it_appears: "Single-row arrays." },
    ],
    video_script_hooks: {
      opening_hook: "An egg tray, a chocolate bar, a window grid — they're all multiplication hiding in plain sight: rows times columns.",
      concept_reveal: "An array lays objects in equal rows and columns, so rows × columns instantly gives the total — and turning it shows why order doesn't matter.",
    },
  },

  math3_ch9_times_tables: {
    key_formulas: [
      { formula: "A times table lists the multiples of a number", explanation: "Table of 4: 4, 8, 12, 16, 20, …" },
      { formula: "Each step adds the number again", explanation: "Table of 4 goes up by 4 each time." },
    ],
    prerequisite_knowledge: ["repeated addition", "skip counting", "multiplication meaning"],
    visual_description: "The 4 times table written 4×1 to 4×10 with answers 4, 8, 12, … 40, each step up by 4.",
    svg_diagrams: [svg("math3_ch9_times_tables", "The 4 times table",
      `<text x="40" y="40">4×1=4   4×2=8   4×3=12</text>
       <text x="40" y="75">4×4=16  4×5=20  4×6=24</text>
       <text x="40" y="110">4×7=28  4×8=32  4×9=36</text>
       <text x="40" y="145" fill="#dc2626">4×10=40   (+4 each step)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Recalling multiplication facts quickly", "Skip counting and finding multiples"],
      use_other_when: ["Very large numbers → use written multiplication instead of recall"],
    },
    edge_cases: [
      { case: "Forgetting a fact like 4×7", value: "add 4 to 4×6 (24 + 4 = 28)", reasoning: "Each step is +4 from the previous.", where_it_appears: "Recovering a fact." },
      { case: "n × 10", value: "just add a 0 (4×10 = 40)", reasoning: "Tens-place shift.", where_it_appears: "The 10 times table." },
    ],
    video_script_hooks: {
      opening_hook: "Why memorise times tables? Because '4 sevens' should pop out instantly — like knowing your own name — and free your brain for harder stuff.",
      concept_reveal: "A times table is the ladder of a number's multiples; each rung adds the number once more, so 4×7 is just 4×6 plus 4.",
    },
  },

  math3_ch9_multiplication_word: {
    key_formulas: [
      { formula: "Words like 'each', 'every', 'per', 'times', 'rows of' → MULTIPLY", explanation: "Equal groups signal multiplication." },
      { formula: "groups × amount each = total", explanation: "6 boxes × 5 pens each = 30 pens." },
    ],
    prerequisite_knowledge: ["multiplication facts / times tables", "reading word problems", "equal groups"],
    visual_description: "'6 boxes with 5 pens EACH — total pens?' mapped to 6 × 5 = 30.",
    svg_diagrams: [svg("math3_ch9_mult_word", "Words → multiplication",
      `<text x="20" y="45">"6 boxes, 5 pens EACH = ?"</text>
       <text x="20" y="90" fill="#2563eb">'each' → multiply</text>
       <text x="20" y="130" fill="#16a34a">6 × 5 = 30 pens</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A story about equal groups, rows, or 'each'/'per'", "Finding a total of identical sets"],
      use_other_when: ["Groups are different sizes → add them; sharing equally → divide"],
    },
    edge_cases: [
      { case: "'Each' in a sharing question", value: "may be division, not multiplication", reasoning: "Understand the action, don't just hunt keywords.", where_it_appears: "Keyword caution." },
      { case: "5 rows of 6 vs 6 rows of 5", value: "both = 30", reasoning: "Order doesn't change the total.", where_it_appears: "Flexible setup." },
    ],
    video_script_hooks: {
      opening_hook: "6 boxes, 5 pens in EACH. You could add 5 six times … or just multiply. The word 'each' is begging you to use multiplication.",
      concept_reveal: "Multiplication word problems describe equal groups; spot 'each/per/rows of' and multiply groups by the amount in each.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 10 — Patterns
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch10_number_patterns: {
    key_formulas: [
      { formula: "A number pattern follows a rule, often 'add' or 'subtract' the same amount", explanation: "2, 4, 6, 8 … adds 2 each time." },
      { formula: "Find the gap between terms to spot the rule", explanation: "5, 10, 15 → +5." },
    ],
    prerequisite_knowledge: ["counting", "addition and subtraction", "skip counting"],
    visual_description: "The sequence 3, 6, 9, 12 with +3 arrows between each pair of terms.",
    svg_diagrams: [svg("math3_ch10_number_patterns", "Add-3 number pattern",
      `<text x="40" y="80" font-size="20">3   6   9   12   15</text>
       <path d="M50 90 Q70 120 95 90" fill="none" stroke="#dc2626"/><text x="55" y="135" fill="#dc2626">+3</text>
       <path d="M105 90 Q125 120 150 90" fill="none" stroke="#dc2626"/><text x="110" y="135" fill="#dc2626">+3</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Continuing a number sequence", "Finding the rule behind a list of numbers"],
      use_other_when: ["The 'pattern' is shapes or colours → that's a shape pattern"],
    },
    edge_cases: [
      { case: "Decreasing pattern 20, 16, 12", value: "rule is −4", reasoning: "Patterns can subtract, not just add.", where_it_appears: "Backward patterns." },
      { case: "Pattern that doubles (2, 4, 8, 16)", value: "rule is ×2, not +", reasoning: "Not every pattern adds a fixed amount.", where_it_appears: "Multiplying patterns." },
    ],
    video_script_hooks: {
      opening_hook: "3, 6, 9, 12 … what's next? Find the jump between numbers and the pattern hands you the answer: 15.",
      concept_reveal: "Number patterns follow a rule — usually adding or subtracting the same amount — and the gap between terms reveals it.",
    },
  },

  math3_ch10_shape_patterns: {
    key_formulas: [
      { formula: "A shape pattern repeats shapes, colours or sizes in a fixed order", explanation: "△ ○ △ ○ … repeats △ ○." },
      { formula: "Find the repeating UNIT to predict what comes next", explanation: "The unit here is △ ○." },
    ],
    prerequisite_knowledge: ["recognising shapes and colours", "left-to-right order", "the idea of repeating"],
    visual_description: "A row triangle-circle-triangle-circle-triangle, with the repeating unit (triangle, circle) boxed.",
    svg_diagrams: [svg("math3_ch10_shape_patterns", "Repeating shape pattern",
      `${[0,1,2,3,4].map(i=>i%2===0?`<polygon points="${50+i*90},90 ${85+i*90},90 ${67+i*90},50" fill="#bbf7d0" stroke="#16a34a"/>`:`<circle cx="${67+i*90}" cy="75" r="20" fill="#dbeafe" stroke="#2563eb"/>`).join("")}
       <rect x="40" y="40" width="115" height="70" fill="none" stroke="#dc2626" stroke-dasharray="4 3"/><text x="40" y="135" fill="#dc2626">repeating unit</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Continuing a pattern of shapes, colours or objects", "Spotting the repeating unit"],
      use_other_when: ["The pattern is numbers → use a number rule"],
    },
    edge_cases: [
      { case: "A 3-shape unit (△○□△○□)", value: "the unit is △○□", reasoning: "Units can be longer than two.", where_it_appears: "Longer repeats." },
      { case: "Pattern by size (big, small, big, small)", value: "size is the repeating feature", reasoning: "Patterns can repeat properties, not just shapes.", where_it_appears: "Size/colour patterns." },
    ],
    video_script_hooks: {
      opening_hook: "Triangle, circle, triangle, circle … your brain already knows what's next. Find the little unit that repeats and you've cracked it.",
      concept_reveal: "Shape patterns repeat a unit of shapes, colours or sizes; identify that unit and the rest of the pattern unfolds.",
    },
  },

  math3_ch10_growing_patterns: {
    key_formulas: [
      { formula: "In a growing pattern each step gets BIGGER by a rule", explanation: "1, 3, 5, 7 (add 2) or 1, 3, 6, 10 (add one more each time)." },
      { formula: "Look at how much it grows each step", explanation: "The growth may be steady or itself increasing." },
    ],
    prerequisite_knowledge: ["number patterns", "addition", "comparing amounts"],
    visual_description: "Dot staircases growing 1, 3, 6, 10 — each adds a longer row than the last.",
    svg_diagrams: [svg("math3_ch10_growing_patterns", "Growing dot pattern 1, 3, 6, 10",
      `<circle cx="50" cy="120" r="6" fill="#2563eb"/>
       ${[[0,0],[1,0],[0,1]].map(([c,r])=>`<circle cx="${110+c*16}" cy="${108+r*16}" r="6" fill="#16a34a"/>`).join("")}
       ${[[0,0],[1,0],[2,0],[0,1],[1,1],[0,2]].map(([c,r])=>`<circle cx="${190+c*16}" cy="${96+r*16}" r="6" fill="#d97706"/>`).join("")}
       <text x="40" y="170">1, 3, 6, 10 …</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Patterns that increase each step", "Predicting a larger later term"],
      use_other_when: ["The pattern just repeats without growing → it's a repeating pattern"],
    },
    edge_cases: [
      { case: "Growth increasing each step (1, 3, 6, 10)", value: "adds 2, then 3, then 4 …", reasoning: "The amount added itself grows.", where_it_appears: "Triangular-number growth." },
      { case: "Shrinking pattern", value: "a 'growing' rule can also decrease", reasoning: "The rule defines change, which may reduce.", where_it_appears: "Reverse growth." },
    ],
    video_script_hooks: {
      opening_hook: "1, 3, 6, 10 — these dots build bigger and bigger triangles. Patterns don't just repeat; some of them GROW.",
      concept_reveal: "Growing patterns increase each step by a rule — sometimes by a fixed amount, sometimes by an amount that itself grows.",
    },
  },

  math3_ch10_pattern_rules: {
    key_formulas: [
      { formula: "The rule tells you how to get the NEXT term", explanation: "e.g. 'add 5' or 'repeat △○'." },
      { formula: "Check the rule fits EVERY term given", explanation: "One match isn't enough." },
    ],
    prerequisite_knowledge: ["number patterns", "shape patterns", "growing patterns"],
    visual_description: "The sequence 4, 7, 10, 13 with the rule '+3' written, and an arrow predicting the next term 16.",
    svg_diagrams: [svg("math3_ch10_pattern_rules", "State the rule, predict the next",
      `<text x="40" y="70" font-size="20">4, 7, 10, 13, ?</text>
       <text x="40" y="115" fill="#dc2626">rule: add 3</text>
       <text x="40" y="150" fill="#16a34a">next = 16</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing a pattern in words", "Predicting the next term confidently"],
      use_other_when: ["You only need to copy a pattern, not explain it"],
    },
    edge_cases: [
      { case: "Two rules that fit the first terms", value: "test against ALL given terms", reasoning: "Only the rule fitting every term is correct.", where_it_appears: "Avoiding wrong rules." },
      { case: "A rule like 'add 1, then 2, then 3'", value: "the rule itself changes each step", reasoning: "Some patterns have a changing rule.", where_it_appears: "Growing patterns." },
    ],
    video_script_hooks: {
      opening_hook: "4, 7, 10, 13 … to nail the next number you don't guess — you find the RULE. Here it's 'add 3', so 16 comes next.",
      concept_reveal: "Finding the pattern rule means stating exactly how each term comes from the last, then checking it fits every term.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 11 — Capacity (millilitres and litres)
  // ───────────────────────────────────────────────────────────────────────────
  math3_ch11_ml_litres: {
    key_formulas: [
      { formula: "1 litre (L) = 1000 millilitres (mL)", explanation: "The litre is the bigger unit." },
      { formula: "Use mL for small amounts, L for large amounts", explanation: "A spoon of medicine in mL; a bucket in L." },
    ],
    prerequisite_knowledge: ["the idea of capacity (how much it holds)", "counting to 1000", "multiply/divide by 1000"],
    visual_description: "A medicine spoon labelled mL beside a water bottle labelled 1 L, with 1 L = 1000 mL written between.",
    svg_diagrams: [svg("math3_ch11_ml_litres", "1 L = 1000 mL",
      `<text x="40" y="60">spoon → millilitres (mL)</text>
       <text x="40" y="100">bottle → litres (L)</text>
       <text x="40" y="150" fill="#dc2626">1 L = 1000 mL</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Choosing mL or L for a liquid", "Converting between millilitres and litres"],
      use_other_when: ["Measuring length or weight → those use different units"],
    },
    edge_cases: [
      { case: "1500 mL", value: "= 1 L 500 mL", reasoning: "1000 mL make 1 L, with 500 mL over.", where_it_appears: "Mixed units." },
      { case: "Measuring a spoonful in litres", value: "awkwardly tiny", reasoning: "mL suits small amounts.", where_it_appears: "Choosing units." },
    ],
    video_script_hooks: {
      opening_hook: "A bottle says 1000 mL, another says 1 L — which holds more water? Neither! They're exactly equal.",
      concept_reveal: "Capacity is measured in millilitres for small amounts and litres for large, with 1000 mL making one litre.",
    },
  },

  math3_ch11_measuring_capacity: {
    key_formulas: [
      { formula: "Pour liquid into a marked measuring jar and read the level", explanation: "The mark at the surface gives the amount." },
      { formula: "Read at eye level for accuracy", explanation: "Looking from above or below misreads the level." },
    ],
    prerequisite_knowledge: ["mL and L", "reading a scale", "the idea of liquid level"],
    visual_description: "A measuring jug marked in 100 mL steps with water at the 300 mL line.",
    svg_diagrams: [svg("math3_ch11_measuring_capacity", "Reading a measuring jug: 300 mL",
      `<path d="M120 40 L200 40 L195 160 L125 160 Z" fill="none" stroke="#475569" stroke-width="2"/>
       <rect x="126" y="110" width="68" height="49" fill="#bae6fd"/>
       ${[0,1,2,3,4].map(i=>`<line x1="195" y1="${160-i*30}" x2="205" y2="${160-i*30}" stroke="#475569"/><text x="210" y="${164-i*30}" font-size="10">${i*100}</text>`).join("")}
       <text x="250" y="120" fill="#2563eb">reads 300 mL</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding exactly how much liquid is in a container", "Following a recipe amount"],
      use_other_when: ["A rough idea is enough → estimate by comparing to a known bottle"],
    },
    edge_cases: [
      { case: "Reading from above the jug", value: "misreads the level", reasoning: "Always read at eye level.", where_it_appears: "Reading errors." },
      { case: "Level between two marks", value: "read to the nearest mark", reasoning: "Round to the closest line.", where_it_appears: "In-between levels." },
    ],
    video_script_hooks: {
      opening_hook: "Pour juice into a measuring jug, then crouch down to read it at eye level — peek from the top and you'll get the wrong number every time.",
      concept_reveal: "To measure capacity, pour into a marked jug and read the liquid's level at eye level against the scale.",
    },
  },

  math3_ch11_comparing_capacity: {
    key_formulas: [
      { formula: "Use the SAME unit, then compare the numbers", explanation: "Convert L to mL (or back) if they differ." },
      { formula: "More capacity = bigger number (same unit)", explanation: "Use >, < or =." },
    ],
    prerequisite_knowledge: ["measuring capacity", "mL↔L conversion", "comparing numbers"],
    visual_description: "A 1 L bottle (1000 mL) beside a 750 mL bottle, showing 1 L holds more.",
    svg_diagrams: [svg("math3_ch11_comparing_capacity", "1 L vs 750 mL",
      `<rect x="70" y="50" width="50" height="110" fill="#bae6fd" stroke="#2563eb"/><text x="65" y="180">1 L</text>
       <rect x="220" y="80" width="50" height="80" fill="#bae6fd" stroke="#2563eb"/><text x="210" y="180">750 mL</text>
       <text x="320" y="120" fill="#dc2626">1000 &gt; 750</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which container holds more", "Ordering capacities"],
      use_other_when: ["Amounts already in the same unit and clearly different"],
    },
    edge_cases: [
      { case: "Comparing 1 L and 800 mL", value: "1 L (1000 mL) is more", reasoning: "Convert to one unit first.", where_it_appears: "Mixed-unit compare." },
      { case: "Comparing without converting", value: "wrong (1 < 800?)", reasoning: "Units must match.", where_it_appears: "The classic trap." },
    ],
    video_script_hooks: {
      opening_hook: "Is 800 mL more than 1 L? The numbers say 800 beats 1 — but switch to the same unit and the truth flips.",
      concept_reveal: "To compare capacities, first put both in the same unit; then the bigger number simply holds more.",
    },
  },

  math3_ch11_capacity_word: {
    key_formulas: [
      { formula: "Add to combine liquids, subtract for 'how much more/left'", explanation: "Same operations, measured in mL or L." },
      { formula: "Match units before calculating", explanation: "Convert L↔mL if a problem mixes them." },
    ],
    prerequisite_knowledge: ["mL and L", "addition and subtraction", "reading word problems"],
    visual_description: "'A jug has 2 L, 500 mL is poured out — how much left?' mapped to 2000 mL − 500 mL = 1500 mL.",
    svg_diagrams: [svg("math3_ch11_capacity_word", "Capacity word problem",
      `<text x="20" y="45">"2 L jug, pour out 500 mL, left?"</text>
       <text x="20" y="90" fill="#2563eb">2 L = 2000 mL; 'left' → subtract</text>
       <text x="20" y="130" fill="#16a34a">2000 − 500 = 1500 mL</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Story problems about pouring, filling or sharing liquids", "Recipe and drink quantity questions"],
      use_other_when: ["Just reading a level → that's measuring, not a word problem"],
    },
    edge_cases: [
      { case: "Mixing 2 L and 500 mL", value: "convert to mL first (2000 + 500)", reasoning: "Units must match.", where_it_appears: "Mixed-unit problems." },
      { case: "'How much more to fill?'", value: "subtract from the full capacity", reasoning: "Difference to the top.", where_it_appears: "Filling problems." },
    ],
    video_script_hooks: {
      opening_hook: "A 2-litre jug, half a litre poured out — how much remains? Capacity word problems are add-and-subtract, just measured in mL and L.",
      concept_reveal: "Capacity word problems add or compare liquid amounts; match the units first, then add or subtract.",
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
