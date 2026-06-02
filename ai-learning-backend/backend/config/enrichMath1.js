/**
 * enrichMath1.js — v3 enrichment for CBSE Class 1 Math (CONTENT_STATUS Ph8).
 *
 * The 52 `math1_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (audit:math --board=CBSE --grade=1). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition/derivation/worked_example/...):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the standard CBSE Class 1 curriculum (NCERT "Joyful
 * Mathematics" Grade 1, PDFs aejm101–aejm113). The DB topic structure follows
 * the traditional Class 1 syllabus (shapes, counting, add/subtract, numbers to
 * 20/50/99, time, measurement, data, patterns, place value, money, counting),
 * so content is authored per topic by its concept, not by literal PDF-chapter
 * mapping. Pitched at age-6 level: tiny numbers, concrete pictures, no jargon.
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath1.js            # patch every topic present in ENRICH
 *         node config/enrichMath1.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math1
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math1_ch${args.ch}_` : null;

function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

const ENRICH = {
  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 1 — Shapes and Position
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch1_2d_shapes: {
    key_formulas: [
      { formula: "Four basic flat shapes: circle, triangle, square, rectangle", explanation: "We name a shape by how it looks." },
      { formula: "Count the straight sides to tell shapes apart", explanation: "Triangle = 3 sides, square = 4 equal sides, circle = no sides." },
    ],
    prerequisite_knowledge: ["looking carefully at objects", "the words 'round' and 'straight'", "counting to 4"],
    visual_description: "A circle, triangle, square and rectangle in a row, each with a happy-face label.",
    svg_diagrams: [svg("math1_ch1_2d_shapes", "The four basic shapes",
      `<circle cx="70" cy="90" r="35" fill="#dbeafe" stroke="#2563eb"/><text x="48" y="150">circle</text>
       <polygon points="170,125 220,125 195,60" fill="#bbf7d0" stroke="#16a34a"/><text x="165" y="150">triangle</text>
       <rect x="290" y="55" width="70" height="70" fill="#fde68a" stroke="#d97706"/><text x="300" y="150">square</text>
       <rect x="420" y="65" width="90" height="55" fill="#fbcfe8" stroke="#db2777"/><text x="425" y="150">rectangle</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Naming a flat shape", "Spotting shapes in everyday things (a clock is a circle)"],
      use_other_when: ["The object is solid (a ball, a box) → those are 3D shapes, learnt later"],
    },
    edge_cases: [
      { case: "A circle", value: "has no corners and no straight sides", reasoning: "It is one smooth round line.", where_it_appears: "Round shapes." },
      { case: "A square", value: "is a special rectangle (all 4 sides equal)", reasoning: "Both have 4 corners.", where_it_appears: "Square vs rectangle." },
    ],
    video_script_hooks: {
      opening_hook: "Look around the room — the clock is a circle, the door is a rectangle, the slice of pizza is a triangle. Shapes are everywhere!",
      concept_reveal: "We tell shapes apart by their sides and corners: a triangle has 3, a square has 4, and a circle has none.",
    },
  },

  math1_ch1_comparing_shapes: {
    key_formulas: [
      { formula: "Compare sizes with the words bigger / smaller", explanation: "Hold two shapes side by side to see which is larger." },
      { formula: "Same shape can come in many sizes", explanation: "A big circle and a small circle are both circles." },
    ],
    prerequisite_knowledge: ["identifying shapes", "the words big and small", "looking side by side"],
    visual_description: "A big circle next to a small circle, and a big square next to a small square, labelled bigger and smaller.",
    svg_diagrams: [svg("math1_ch1_comparing_shapes", "Bigger and smaller",
      `<circle cx="90" cy="100" r="50" fill="#dbeafe" stroke="#2563eb"/><circle cx="210" cy="110" r="22" fill="#dbeafe" stroke="#2563eb"/>
       <text x="60" y="175">bigger</text><text x="190" y="175">smaller</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which of two things is bigger or smaller", "Sorting things by size"],
      use_other_when: ["Sorting by shape or colour instead of size"],
    },
    edge_cases: [
      { case: "Two shapes the same size", value: "neither is bigger — they are equal", reasoning: "They match exactly.", where_it_appears: "Equal sizes." },
      { case: "A big triangle and a small circle", value: "different shape AND size", reasoning: "Compare one thing at a time — here, size.", where_it_appears: "Comparing carefully." },
    ],
    video_script_hooks: {
      opening_hook: "Which is bigger — the moon in the sky or this coin in my hand? They look the same size, but one is HUGE. Comparing is all about looking closely.",
      concept_reveal: "We compare shapes by size using 'bigger' and 'smaller' — and the same shape can be big or small.",
    },
  },

  math1_ch1_position_words: {
    key_formulas: [
      { formula: "Position words tell WHERE something is", explanation: "above / below, left / right, in front / behind, near / far, inside / outside." },
      { formula: "Position is always compared to something else", explanation: "The cat is ON the mat; the ball is UNDER the table." },
    ],
    prerequisite_knowledge: ["looking at where things are", "left and right", "everyday objects"],
    visual_description: "A ball shown above a box, below a box, and inside a box, with each position word labelled.",
    svg_diagrams: [svg("math1_ch1_position_words", "Above, below, inside",
      `<rect x="50" y="110" width="60" height="50" fill="#fde68a" stroke="#d97706"/><circle cx="80" cy="80" r="15" fill="#dc2626"/><text x="50" y="180">above</text>
       <rect x="200" y="60" width="60" height="50" fill="#fde68a" stroke="#d97706"/><circle cx="230" cy="135" r="15" fill="#dc2626"/><text x="205" y="180">below</text>
       <rect x="350" y="80" width="70" height="60" fill="#fde68a" stroke="#d97706"/><circle cx="385" cy="110" r="14" fill="#dc2626"/><text x="355" y="180">inside</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing where an object is", "Following directions like 'put it on the shelf'"],
      use_other_when: ["Describing what a thing IS (shape, size) rather than where it is"],
    },
    edge_cases: [
      { case: "Left and right", value: "depend on which way you face", reasoning: "Turn around and they swap.", where_it_appears: "Direction words." },
      { case: "'Near' the door vs 'far' from the door", value: "both compared to the door", reasoning: "Position always needs a reference object.", where_it_appears: "Comparing positions." },
    ],
    video_script_hooks: {
      opening_hook: "Where's the cat? ON the mat, UNDER the chair, BEHIND the door? Little position words tell you exactly where to look.",
      concept_reveal: "Position words — above, below, left, right, inside, near — say where something is compared to something else.",
    },
  },

  math1_ch1_sorting_shapes: {
    key_formulas: [
      { formula: "Sorting = putting things into groups by ONE rule", explanation: "All the circles together, all the squares together." },
      { formula: "You can sort by shape, size or colour", explanation: "Pick one rule and follow it for every object." },
    ],
    prerequisite_knowledge: ["identifying shapes", "comparing shapes", "the idea of a group"],
    visual_description: "A jumble of circles and triangles being split into a circle pile and a triangle pile.",
    svg_diagrams: [svg("math1_ch1_sorting_shapes", "Sort by shape",
      `<text x="40" y="40">mixed:</text><circle cx="120" cy="35" r="12" fill="#2563eb"/><polygon points="160,45 184,45 172,22" fill="#16a34a"/><circle cx="210" cy="35" r="12" fill="#2563eb"/>
       <text x="40" y="110">circles:</text><circle cx="130" cy="105" r="12" fill="#2563eb"/><circle cx="165" cy="105" r="12" fill="#2563eb"/>
       <text x="40" y="160">triangles:</text><polygon points="130,165 154,165 142,142" fill="#16a34a"/>`)],
    when_to_use_this_method: {
      use_this_when: ["Grouping objects that are alike", "Tidying things into matching sets"],
      use_other_when: ["You only need to name or count one object, not group many"],
    },
    edge_cases: [
      { case: "Sorting by two rules at once", value: "confusing — choose ONE rule", reasoning: "Sort by shape OR colour, not both together at first.", where_it_appears: "Keeping sorting simple." },
      { case: "An object that fits no group", value: "may need a new group", reasoning: "Every object must land somewhere.", where_it_appears: "Leftover objects." },
    ],
    video_script_hooks: {
      opening_hook: "Toys everywhere! Put all the cars in one box, all the blocks in another. That tidying-up is exactly what sorting means in maths.",
      concept_reveal: "Sorting groups objects by one rule — shape, size, or colour — so everything alike sits together.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 2 — Counting 1 to 9
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch2_counting_1_to_5: {
    key_formulas: [
      { formula: "Count by touching each object once and saying 1, 2, 3, 4, 5", explanation: "The last number you say is how many there are." },
      { formula: "Each number is one more than the one before", explanation: "2 is one more than 1." },
    ],
    prerequisite_knowledge: ["saying the number words 1 to 5", "pointing at objects", "the idea of 'how many'"],
    visual_description: "Five apples in a row, each touched in turn while counting 1, 2, 3, 4, 5.",
    svg_diagrams: [svg("math1_ch2_count_1_5", "Counting 1 to 5",
      `${[1,2,3,4,5].map((n,i)=>`<circle cx="${60+i*90}" cy="80" r="22" fill="#fca5a5" stroke="#dc2626"/><text x="${54+i*90}" y="130">${n}</text>`).join("")}`)],
    when_to_use_this_method: {
      use_this_when: ["Finding how many objects are in a small group", "Counting toys, fingers or steps up to 5"],
      use_other_when: ["More than 5 objects → keep counting on to 6, 7, 8, 9"],
    },
    edge_cases: [
      { case: "Counting one object twice", value: "wrong — too many", reasoning: "Touch each object exactly once.", where_it_appears: "The most common counting slip." },
      { case: "No objects at all", value: "that is 0 (zero)", reasoning: "Zero means none.", where_it_appears: "Counting nothing." },
    ],
    video_script_hooks: {
      opening_hook: "Hold up your hand — one, two, three, four, five fingers! The last number you say is how many you have.",
      concept_reveal: "Counting means touching each thing once and saying the next number; the final number tells you how many.",
    },
  },

  math1_ch2_counting_6_to_9: {
    key_formulas: [
      { formula: "Keep counting past 5: 6, 7, 8, 9", explanation: "Carry on from five without starting over." },
      { formula: "9 is the biggest one-digit number", explanation: "After 9 comes 10 (two digits)." },
    ],
    prerequisite_knowledge: ["counting 1 to 5", "the number words 6 to 9", "one more than"],
    visual_description: "A group of objects counted on from 5: 6, 7, 8, 9 with the ninth highlighted.",
    svg_diagrams: [svg("math1_ch2_count_6_9", "Counting on to 9",
      `${[1,2,3,4,5,6,7,8,9].map((n,i)=>`<circle cx="${45+i*55}" cy="80" r="18" fill="${n>5?'#bbf7d0':'#e2e8f0'}" stroke="#16a34a"/><text x="${40+i*55}" y="125" font-size="11">${n}</text>`).join("")}`)],
    when_to_use_this_method: {
      use_this_when: ["Counting groups of 6 to 9 objects", "Carrying on counting past five"],
      use_other_when: ["Groups of 10 or more → those use the teen numbers, learnt next"],
    },
    edge_cases: [
      { case: "Starting again at 1 after 5", value: "wrong — count ON (6, 7…)", reasoning: "Don't restart; continue from five.", where_it_appears: "Counting on." },
      { case: "After 9", value: "comes 10", reasoning: "9 is the last single-digit number.", where_it_appears: "Crossing into ten." },
    ],
    video_script_hooks: {
      opening_hook: "You already counted to 5 — now don't stop! Six, seven, eight, NINE. Nine is the biggest number that fits in one digit.",
      concept_reveal: "After five we count on — 6, 7, 8, 9 — without starting over, all the way to the last single-digit number.",
    },
  },

  math1_ch2_number_names: {
    key_formulas: [
      { formula: "Each number has a written word: 1=one, 2=two … 9=nine", explanation: "The digit and its name mean the same amount." },
      { formula: "Match the digit, the word, and the count of objects", explanation: "3, 'three', and ●●● are all the same." },
    ],
    prerequisite_knowledge: ["counting 1 to 9", "recognising digits", "early reading of words"],
    visual_description: "A matching chart: digit 3 ↔ the word 'three' ↔ three dots.",
    svg_diagrams: [svg("math1_ch2_number_names", "Digit, name, and count",
      `<text x="60" y="60" font-size="30">3</text><text x="150" y="60" font-size="22">three</text>
       <circle cx="300" cy="52" r="9" fill="#2563eb"/><circle cx="325" cy="52" r="9" fill="#2563eb"/><circle cx="350" cy="52" r="9" fill="#2563eb"/>
       <text x="60" y="120" font-size="30">5</text><text x="150" y="120" font-size="22">five</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and writing number words", "Linking a digit to its name and amount"],
      use_other_when: ["Just counting objects → you may not need the written word"],
    },
    edge_cases: [
      { case: "Mixing up 'six' and 'nine'", value: "check the digit (6 vs 9)", reasoning: "They sound a little alike but are different amounts.", where_it_appears: "Common mix-up." },
      { case: "Zero", value: "its name is 'zero', meaning none", reasoning: "0 still has a name.", where_it_appears: "Naming zero." },
    ],
    video_script_hooks: {
      opening_hook: "The number 3, the word 'three', and three jellybeans are all secret best friends — they all mean the same amount!",
      concept_reveal: "Every number has three faces: the digit, the written name, and the count of objects — and they all match.",
    },
  },

  math1_ch2_ordering_numbers: {
    key_formulas: [
      { formula: "Numbers have an order: 1, 2, 3, 4, 5, 6, 7, 8, 9", explanation: "Each one is bigger than the one before." },
      { formula: "Smallest comes first, biggest comes last", explanation: "We can also count backwards: 9, 8, 7 …" },
    ],
    prerequisite_knowledge: ["counting 1 to 9", "number names", "the idea of more and less"],
    visual_description: "Number cards 3, 1, 5, 2, 4 shuffled, then arranged in order 1, 2, 3, 4, 5.",
    svg_diagrams: [svg("math1_ch2_ordering", "Putting numbers in order",
      `<text x="30" y="50">mixed:  3  1  5  2  4</text>
       <text x="30" y="110" fill="#16a34a">in order:  1  2  3  4  5</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Putting numbers from smallest to biggest", "Finding which number comes before or after"],
      use_other_when: ["You only need to count, not arrange numbers"],
    },
    edge_cases: [
      { case: "The number before 1", value: "is 0", reasoning: "Zero comes before one.", where_it_appears: "Start of the count." },
      { case: "Ordering backwards (9 to 1)", value: "biggest first", reasoning: "Order can go either way.", where_it_appears: "Counting down." },
    ],
    video_script_hooks: {
      opening_hook: "These number cards got all jumbled up! Can you line them up smallest to biggest? 1, 2, 3 … putting numbers in order.",
      concept_reveal: "Numbers have a fixed order from 1 to 9; arranging them smallest-to-biggest (or backwards) is ordering.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 3 — Addition
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch3_joining_sets: {
    key_formulas: [
      { formula: "Addition means joining groups together", explanation: "Put 2 apples and 3 apples together → 5 apples." },
      { formula: "2 + 3 = 5 (the + sign means 'and')", explanation: "Count everything once it's joined." },
    ],
    prerequisite_knowledge: ["counting 1 to 9", "the idea of a group", "counting on"],
    visual_description: "Two apples and three apples sliding together into one group of five.",
    svg_diagrams: [svg("math1_ch3_joining", "2 + 3 = 5",
      `${[0,1].map(i=>`<circle cx="${50+i*35}" cy="80" r="15" fill="#fca5a5" stroke="#dc2626"/>`).join("")}
       <text x="120" y="86" font-size="22">+</text>
       ${[0,1,2].map(i=>`<circle cx="${155+i*35}" cy="80" r="15" fill="#fca5a5" stroke="#dc2626"/>`).join("")}
       <text x="275" y="86" font-size="22">=</text>
       <text x="310" y="86" font-size="22" fill="#16a34a">5</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Putting two groups together to find the total", "Any 'how many altogether' question"],
      use_other_when: ["Taking some away → that's subtraction"],
    },
    edge_cases: [
      { case: "Adding zero (3 + 0)", value: "= 3", reasoning: "Joining nothing changes nothing.", where_it_appears: "Adding zero." },
      { case: "2 + 3 and 3 + 2", value: "both = 5", reasoning: "Order doesn't matter when adding.", where_it_appears: "Swapping the groups." },
    ],
    video_script_hooks: {
      opening_hook: "You have 2 sweets, your friend gives you 3 more — slide them together and count: 5! That joining is addition.",
      concept_reveal: "Adding joins two groups into one; count the whole new group to find the total.",
    },
  },

  math1_ch3_addition_with_pictures: {
    key_formulas: [
      { formula: "Draw or count pictures to add", explanation: "Show each group as dots, then count them all." },
      { formula: "picture group 1 + picture group 2 = total picture", explanation: "Seeing it makes adding easy." },
    ],
    prerequisite_knowledge: ["joining sets", "counting to 9", "drawing simple marks"],
    visual_description: "A box of 4 stars and a box of 2 stars, with all 6 stars counted in a combined box.",
    svg_diagrams: [svg("math1_ch3_pictures", "4 + 2 = 6 with pictures",
      `${[0,1,2,3].map(i=>`<text x="${40+i*25}" y="60" font-size="18">★</text>`).join("")}<text x="150" y="60">+</text>
       ${[0,1].map(i=>`<text x="${175+i*25}" y="60" font-size="18">★</text>`).join("")}
       <text x="40" y="110" fill="#16a34a">= 6 stars</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Adding when you can draw or see the objects", "Checking an addition by counting pictures"],
      use_other_when: ["You already know the fact by heart → no need to draw"],
    },
    edge_cases: [
      { case: "Forgetting to count a picture", value: "total too small", reasoning: "Count every picture once.", where_it_appears: "Careful counting." },
      { case: "Adding two big groups (7 + 8)", value: "drawing gets slow", reasoning: "Pictures suit small numbers best.", where_it_appears: "When to switch to facts." },
    ],
    video_script_hooks: {
      opening_hook: "Not sure what 4 + 2 is? Just draw the stars! Four here, two there, then count them all — six twinkling stars.",
      concept_reveal: "Picture addition draws each group, then counts everything together — a way to SEE the answer.",
    },
  },

  math1_ch3_addition_facts: {
    key_formulas: [
      { formula: "Addition facts are sums you remember quickly", explanation: "Like 2 + 2 = 4, 5 + 5 = 10." },
      { formula: "Number bonds to 10: pairs that make ten (6 + 4, 7 + 3)", explanation: "Very handy to know by heart." },
    ],
    prerequisite_knowledge: ["joining sets", "counting on", "addition with pictures"],
    visual_description: "A ten-frame showing 6 + 4 filling all ten squares, illustrating a number bond to 10.",
    svg_diagrams: [svg("math1_ch3_facts", "Number bond: 6 + 4 = 10",
      `${[0,1,2,3,4].map(i=>`<rect x="${50+i*40}" y="50" width="38" height="38" fill="#bfdbfe" stroke="#475569"/>`).join("")}
       ${[0,1,2,3,4].map(i=>`<rect x="${50+i*40}" y="90" width="38" height="38" fill="${i<1?'#bfdbfe':'#fed7aa'}" stroke="#475569"/>`).join("")}
       <text x="270" y="95">6 + 4 = 10</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Recalling small sums instantly", "Making 10 quickly from a pair of numbers"],
      use_other_when: ["A sum you don't know yet → count on or draw pictures first"],
    },
    edge_cases: [
      { case: "5 + 5", value: "= 10 (a doubles fact)", reasoning: "Doubles are easy to remember.", where_it_appears: "Doubles." },
      { case: "Adding 0", value: "the number stays the same", reasoning: "0 + 7 = 7.", where_it_appears: "Zero facts." },
    ],
    video_script_hooks: {
      opening_hook: "Some sums you should know in a snap — like 5 + 5 = 10. Knowing these by heart makes you a maths superhero!",
      concept_reveal: "Addition facts are small sums we memorise — especially the pairs that make 10 — so we don't have to count every time.",
    },
  },

  math1_ch3_addition_word_problems: {
    key_formulas: [
      { formula: "Words like 'altogether', 'in all', 'and', 'more' → ADD", explanation: "Joining groups means addition." },
      { formula: "Find the two numbers, then add them", explanation: "3 birds and 2 more birds = 5 birds." },
    ],
    prerequisite_knowledge: ["joining sets", "addition facts", "listening to a short story"],
    visual_description: "A simple story 'Riya has 3 balloons, she gets 2 more — how many in all?' shown as 3 + 2 = 5.",
    svg_diagrams: [svg("math1_ch3_word", "Story → addition",
      `<text x="20" y="45">"3 balloons, 2 MORE, in all?"</text>
       <text x="20" y="90" fill="#2563eb">'more' / 'in all' → add</text>
       <text x="20" y="130" fill="#16a34a">3 + 2 = 5</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A little story about getting more or putting together", "Finding a total from a word problem"],
      use_other_when: ["The story is about losing or eating some → that's subtraction"],
    },
    edge_cases: [
      { case: "'How many more does she need?'", value: "might be subtraction", reasoning: "Understand the story, not just the words.", where_it_appears: "Tricky wording." },
      { case: "Three groups joined", value: "add all three", reasoning: "'Altogether' can join more than two.", where_it_appears: "Bigger stories." },
    ],
    video_script_hooks: {
      opening_hook: "Riya had 3 balloons and got 2 MORE. The word 'more' is a secret signal — it's telling you to add!",
      concept_reveal: "Addition word stories join groups; spot words like 'more' and 'altogether', then add the two numbers.",
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
