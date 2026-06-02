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
