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
