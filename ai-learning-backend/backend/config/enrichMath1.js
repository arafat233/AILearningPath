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

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 4 — Subtraction
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch4_taking_away: {
    key_formulas: [
      { formula: "Subtraction means taking some away from a group", explanation: "5 apples, eat 2 → 3 left." },
      { formula: "5 − 2 = 3 (the − sign means 'take away')", explanation: "Count what is left." },
    ],
    prerequisite_knowledge: ["counting 1 to 9", "the idea of a group", "counting back"],
    visual_description: "Five apples with two crossed out, leaving three.",
    svg_diagrams: [svg("math1_ch4_taking_away", "5 − 2 = 3",
      `${[0,1,2,3,4].map(i=>`<circle cx="${50+i*45}" cy="80" r="16" fill="${i>2?'#e2e8f0':'#fca5a5'}" stroke="#dc2626"/>${i>2?`<line x1="${38+i*45}" y1="68" x2="${62+i*45}" y2="92" stroke="#475569"/>`:""}`).join("")}
       <text x="50" y="130" fill="#16a34a">3 left</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Taking some objects away and finding what's left", "Any 'how many are left' question"],
      use_other_when: ["Putting groups together → that's addition"],
    },
    edge_cases: [
      { case: "Taking away 0 (4 − 0)", value: "= 4", reasoning: "Taking nothing changes nothing.", where_it_appears: "Subtracting zero." },
      { case: "Taking away all (4 − 4)", value: "= 0", reasoning: "Nothing left.", where_it_appears: "Subtracting everything." },
    ],
    video_script_hooks: {
      opening_hook: "You had 5 cookies and ate 2. How many are left? Take them away and count: 3 cookies. That's subtraction!",
      concept_reveal: "Subtracting takes some away from a group; count what remains to find the answer.",
    },
  },

  math1_ch4_subtraction_with_pictures: {
    key_formulas: [
      { formula: "Cross out pictures to subtract", explanation: "Draw the group, cross off what's taken, count the rest." },
      { formula: "what you start with − what you cross out = what's left", explanation: "Seeing it makes it clear." },
    ],
    prerequisite_knowledge: ["taking away", "counting to 9", "drawing simple marks"],
    visual_description: "Six balloons with two crossed out, leaving four to count.",
    svg_diagrams: [svg("math1_ch4_sub_pictures", "6 − 2 = 4 with pictures",
      `${[0,1,2,3,4,5].map(i=>`<circle cx="${50+i*40}" cy="75" r="14" fill="${i>3?'#e2e8f0':'#fbcfe8'}" stroke="#db2777"/>${i>3?`<line x1="${39+i*40}" y1="64" x2="${61+i*40}" y2="86" stroke="#475569"/>`:""}`).join("")}
       <text x="50" y="120" fill="#16a34a">= 4 left</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Subtracting when you can draw the objects", "Checking a subtraction by counting"],
      use_other_when: ["You already know the fact by heart → no need to draw"],
    },
    edge_cases: [
      { case: "Crossing out too few", value: "answer too big", reasoning: "Cross out exactly the number taken away.", where_it_appears: "Careful crossing." },
      { case: "Crossing out all of them", value: "0 left", reasoning: "Nothing remains.", where_it_appears: "Taking all away." },
    ],
    video_script_hooks: {
      opening_hook: "Six balloons, two pop! Cross them out and count the rest — four balloons still floating. Pictures make subtraction easy to see.",
      concept_reveal: "Picture subtraction draws the group, crosses off what's taken, and counts what's left.",
    },
  },

  math1_ch4_subtraction_facts: {
    key_formulas: [
      { formula: "Subtraction facts are takeaways you remember quickly", explanation: "Like 5 − 2 = 3, 10 − 5 = 5." },
      { formula: "Subtraction undoes addition: if 3 + 2 = 5, then 5 − 2 = 3", explanation: "They are opposites." },
    ],
    prerequisite_knowledge: ["taking away", "addition facts", "counting back"],
    visual_description: "A fact-family triangle linking 2, 3 and 5: 2 + 3 = 5, so 5 − 3 = 2 and 5 − 2 = 3.",
    svg_diagrams: [svg("math1_ch4_sub_facts", "Addition and subtraction are opposites",
      `<text x="40" y="55" font-weight="bold">2 + 3 = 5</text>
       <text x="40" y="95" fill="#2563eb">5 − 3 = 2</text>
       <text x="40" y="135" fill="#16a34a">5 − 2 = 3</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Recalling small takeaways instantly", "Using a known addition fact to subtract"],
      use_other_when: ["A takeaway you don't know → count back or cross out pictures"],
    },
    edge_cases: [
      { case: "n − 0", value: "= n", reasoning: "Taking nothing leaves it unchanged.", where_it_appears: "Subtracting zero." },
      { case: "n − n", value: "= 0", reasoning: "Take it all and nothing's left.", where_it_appears: "Subtracting itself." },
    ],
    video_script_hooks: {
      opening_hook: "Here's a secret: if you know 3 + 2 = 5, you ALREADY know 5 − 2 = 3! Adding and subtracting are flip-sides of each other.",
      concept_reveal: "Subtraction facts are quick takeaways; every addition fact you know hands you a subtraction fact for free.",
    },
  },

  math1_ch4_subtraction_word_problems: {
    key_formulas: [
      { formula: "Words like 'left', 'take away', 'ate', 'gave away', 'how many more' → SUBTRACT", explanation: "Losing or comparing means subtraction." },
      { formula: "Start amount − amount gone = answer", explanation: "7 sweets − 3 eaten = 4 left." },
    ],
    prerequisite_knowledge: ["taking away", "subtraction facts", "listening to a short story"],
    visual_description: "'There were 7 ducks, 3 swam away — how many left?' shown as 7 − 3 = 4.",
    svg_diagrams: [svg("math1_ch4_sub_word", "Story → subtraction",
      `<text x="20" y="45">"7 ducks, 3 swam away, LEFT?"</text>
       <text x="20" y="90" fill="#2563eb">'left' / 'away' → subtract</text>
       <text x="20" y="130" fill="#16a34a">7 − 3 = 4</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A short story about losing, eating, or giving away", "Finding 'how many left' or 'how many more'"],
      use_other_when: ["The story puts groups together → that's addition"],
    },
    edge_cases: [
      { case: "'How many more red than blue?'", value: "subtract the two counts", reasoning: "Comparing = difference.", where_it_appears: "Compare stories." },
      { case: "Taking away more than you have", value: "not possible here", reasoning: "Class 1 stays within the amount you start with.", where_it_appears: "Staying positive." },
    ],
    video_script_hooks: {
      opening_hook: "Seven ducks on the pond, three swim AWAY. How many are left? The word 'away' whispers: subtract!",
      concept_reveal: "Subtraction stories take away or compare; spot 'left/away/more', then subtract the smaller from the bigger.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 5 — Numbers to 20
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch5_number_ten: {
    key_formulas: [
      { formula: "Ten is one group of ten — written 10", explanation: "1 ten and 0 ones." },
      { formula: "10 is the first two-digit number", explanation: "It comes right after 9." },
    ],
    prerequisite_knowledge: ["counting to 9", "the idea of a group", "ordering numbers"],
    visual_description: "Ten objects bundled into one group of ten, with the digits 1 and 0 shown as 1 ten, 0 ones.",
    svg_diagrams: [svg("math1_ch5_ten", "Ten = a bundle of ten",
      `${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${50+i*30}" y="50" width="20" height="50" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       <text x="120" y="140" font-size="20">= 10 (1 ten, 0 ones)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Understanding ten as a single bundle", "Moving from single digits to teen numbers"],
      use_other_when: ["Counting fewer than ten → single digits are enough"],
    },
    edge_cases: [
      { case: "Just after 9", value: "comes 10", reasoning: "Ten is the next number.", where_it_appears: "Crossing into two digits." },
      { case: "10 written as '01'", value: "wrong — it's 10", reasoning: "The 1 (ten) goes first.", where_it_appears: "Digit order." },
    ],
    video_script_hooks: {
      opening_hook: "Count your fingers — all ten! Bundle them into one group and you get the very first two-digit number: 10.",
      concept_reveal: "Ten is a whole bundle of ten ones, and it's the first number that needs two digits: 1 ten and 0 ones.",
    },
  },

  math1_ch5_numbers_11_to_15: {
    key_formulas: [
      { formula: "Teen numbers = one ten and some ones", explanation: "13 = 1 ten + 3 ones." },
      { formula: "11, 12, 13, 14, 15 come right after ten", explanation: "Count on from 10." },
    ],
    prerequisite_knowledge: ["the number ten", "counting to 9", "tens and ones idea"],
    visual_description: "A bundle of ten plus 3 single ones, labelled 13.",
    svg_diagrams: [svg("math1_ch5_11_15", "13 = 1 ten and 3 ones",
      `<rect x="50" y="50" width="60" height="60" fill="#bfdbfe" stroke="#2563eb"/><text x="62" y="85">ten</text>
       ${[0,1,2].map(i=>`<rect x="${140+i*30}" y="50" width="20" height="60" fill="#fed7aa" stroke="#d97706"/>`).join("")}
       <text x="240" y="90" font-size="20">= 13</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and counting numbers 11 to 15", "Seeing teen numbers as ten-and-some-more"],
      use_other_when: ["Numbers above 15 → carry on to 16–20"],
    },
    edge_cases: [
      { case: "13 said as 'thirty'", value: "wrong — it's thirteen", reasoning: "Teen numbers are ten-and-three, not 30.", where_it_appears: "Teen vs tens confusion." },
      { case: "11 and 12", value: "special names (eleven, twelve)", reasoning: "They don't follow the '-teen' pattern.", where_it_appears: "Odd teen names." },
    ],
    video_script_hooks: {
      opening_hook: "Why is it called thir-TEEN? Because it's a ten and three more! Teen numbers are just ten with some extra ones.",
      concept_reveal: "Numbers 11 to 15 are one bundle of ten plus a few ones — that's what 'teen' really means.",
    },
  },

  math1_ch5_numbers_16_to_20: {
    key_formulas: [
      { formula: "16, 17, 18, 19, 20 — keep counting on from 15", explanation: "16 = 1 ten + 6 ones." },
      { formula: "20 = two tens (2 tens, 0 ones)", explanation: "Two full bundles of ten." },
    ],
    prerequisite_knowledge: ["numbers 11 to 15", "the number ten", "counting on"],
    visual_description: "Two bundles of ten making 20, with 18 shown as one ten and 8 ones.",
    svg_diagrams: [svg("math1_ch5_16_20", "20 = two tens",
      `<rect x="50" y="55" width="55" height="60" fill="#bfdbfe" stroke="#2563eb"/><text x="60" y="90">ten</text>
       <rect x="125" y="55" width="55" height="60" fill="#bfdbfe" stroke="#2563eb"/><text x="135" y="90">ten</text>
       <text x="210" y="92" font-size="20">= 20</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Counting and reading numbers 16 to 20", "Reaching two full tens"],
      use_other_when: ["Numbers above 20 → those come later (21–50)"],
    },
    edge_cases: [
      { case: "20", value: "two tens, zero ones", reasoning: "A new full bundle of ten.", where_it_appears: "Reaching twenty." },
      { case: "Counting on from 19", value: "next is 20, not 'tenty'", reasoning: "Ten ones in the ones place roll into a new ten.", where_it_appears: "Crossing to 20." },
    ],
    video_script_hooks: {
      opening_hook: "Keep going past fifteen — sixteen, seventeen, all the way to TWENTY, which is two whole bundles of ten!",
      concept_reveal: "Numbers 16 to 20 finish the second ten, and 20 is exactly two bundles of ten with no ones left over.",
    },
  },

  math1_ch5_ordering_to_20: {
    key_formulas: [
      { formula: "Numbers 1 to 20 have an order, each one more than the last", explanation: "13 comes before 14, after 12." },
      { formula: "Bigger numbers are further along when counting", explanation: "17 is bigger than 11." },
    ],
    prerequisite_knowledge: ["counting to 20", "ordering 1 to 9", "before and after"],
    visual_description: "A number track 1 to 20 with a few cards (15, 9, 18) placed in their correct spots.",
    svg_diagrams: [svg("math1_ch5_order_20", "Number track to 20",
      `<line x1="30" y1="90" x2="530" y2="90" stroke="#475569"/>
       ${[1,5,10,15,20].map((n,i)=>`<line x1="${40+i*120}" y1="84" x2="${40+i*120}" y2="96" stroke="#475569"/><text x="${34+i*120}" y="115">${n}</text>`).join("")}
       <circle cx="400" cy="90" r="5" fill="#dc2626"/><text x="385" y="75" fill="#dc2626">15</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Putting numbers up to 20 in order", "Finding what comes before/after a number"],
      use_other_when: ["You just need to count, not arrange the numbers"],
    },
    edge_cases: [
      { case: "Number just before 20", value: "19", reasoning: "One less than 20.", where_it_appears: "Before/after." },
      { case: "Ordering teens (13, 11, 17)", value: "11, 13, 17", reasoning: "Compare the whole number's size.", where_it_appears: "Ordering teen numbers." },
    ],
    video_script_hooks: {
      opening_hook: "Where does 15 sit on the number train, all the way up to 20? Putting numbers in their seats is ordering.",
      concept_reveal: "Numbers 1 to 20 follow a fixed order; arranging them smallest-to-biggest puts each in its place.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 6 — Time
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch6_days_of_week: {
    key_formulas: [
      { formula: "There are 7 days in a week", explanation: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday." },
      { formula: "After Saturday the week starts again at Sunday", explanation: "Days repeat in the same order." },
    ],
    prerequisite_knowledge: ["counting to 7", "the idea of today/tomorrow/yesterday", "order"],
    visual_description: "Seven day-cards in a ring, showing the week cycling from Sunday back to Sunday.",
    svg_diagrams: [svg("math1_ch6_days", "The 7 days of the week",
      `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>`<rect x="${20+i*75}" y="70" width="68" height="40" fill="#dbeafe" stroke="#2563eb"/><text x="${30+i*75}" y="95" font-size="12">${d}</text>`).join("")}`)],
    when_to_use_this_method: {
      use_this_when: ["Naming the days and their order", "Working out tomorrow or yesterday"],
      use_other_when: ["Telling the time within a day → use a clock"],
    },
    edge_cases: [
      { case: "Day after Saturday", value: "Sunday (week restarts)", reasoning: "The 7 days cycle.", where_it_appears: "Wrapping the week." },
      { case: "Day before Sunday", value: "Saturday", reasoning: "Go backwards around the cycle.", where_it_appears: "Yesterday." },
    ],
    video_script_hooks: {
      opening_hook: "What day comes after Saturday? Sunday — and the whole week starts again! Seven days, round and round forever.",
      concept_reveal: "A week is 7 days in a fixed order that repeats, so after Saturday we loop back to Sunday.",
    },
  },

  math1_ch6_parts_of_day: {
    key_formulas: [
      { formula: "A day has morning, afternoon, evening and night", explanation: "The sun rises, is high, sets, then it's dark." },
      { formula: "These parts always come in the same order", explanation: "Morning before afternoon before night." },
    ],
    prerequisite_knowledge: ["day and night", "everyday routines (breakfast, bedtime)", "order"],
    visual_description: "A sun arc across the sky — rising (morning), high (afternoon), setting (evening), then a moon (night).",
    svg_diagrams: [svg("math1_ch6_parts_day", "Parts of the day",
      `<path d="M40 150 Q200 30 360 150" fill="none" stroke="#fbbf24" stroke-width="2"/>
       <circle cx="60" cy="135" r="12" fill="#fbbf24"/><text x="40" y="175">morning</text>
       <circle cx="200" cy="55" r="14" fill="#f59e0b"/><text x="170" y="45">afternoon</text>
       <circle cx="430" cy="120" r="12" fill="#cbd5e1"/><text x="410" y="160">night</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Saying which part of the day something happens", "Putting daily events in order"],
      use_other_when: ["Naming days of the week → that's a different scale of time"],
    },
    edge_cases: [
      { case: "Breakfast", value: "happens in the morning", reasoning: "Routines match parts of the day.", where_it_appears: "Daily routines." },
      { case: "After night", value: "comes morning again", reasoning: "The day-parts cycle too.", where_it_appears: "New day." },
    ],
    video_script_hooks: {
      opening_hook: "When do you eat breakfast? Morning! Lunch? Afternoon! Sleep? Night! The day comes in parts, always in the same order.",
      concept_reveal: "A day flows through morning, afternoon, evening and night in a fixed order, matching our daily routines.",
    },
  },

  math1_ch6_reading_clock: {
    key_formulas: [
      { formula: "O'clock time: the long hand points to 12, the short hand to the hour", explanation: "Short hand on 3 + long hand on 12 = 3 o'clock." },
      { formula: "Short hand = hour, long hand = minutes", explanation: "At o'clock, the long hand is straight up." },
    ],
    prerequisite_knowledge: ["numbers 1 to 12", "the idea of time", "reading numbers on a circle"],
    visual_description: "A clock showing 3 o'clock: short hand on 3, long hand straight up on 12.",
    svg_diagrams: [svg("math1_ch6_clock", "3 o'clock",
      `<circle cx="120" cy="100" r="70" fill="#fff" stroke="#475569" stroke-width="2"/>
       <text x="113" y="45">12</text><text x="183" y="105">3</text><text x="113" y="175">6</text><text x="48" y="105">9</text>
       <line x1="120" y1="100" x2="120" y2="45" stroke="#dc2626" stroke-width="3"/>
       <line x1="120" y1="100" x2="165" y2="105" stroke="#2563eb" stroke-width="4"/>
       <text x="230" y="105" font-weight="bold">3 o'clock</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading whole-hour (o'clock) times", "Telling the time on a round clock"],
      use_other_when: ["Times with minutes (half past, quarter past) → learnt in later classes"],
    },
    edge_cases: [
      { case: "Long hand NOT on 12", value: "it's not an exact o'clock", reasoning: "O'clock needs the long hand straight up.", where_it_appears: "Only-o'clock at this level." },
      { case: "12 o'clock", value: "both hands point up", reasoning: "Hour and minute hands meet at 12.", where_it_appears: "Midday/midnight." },
    ],
    video_script_hooks: {
      opening_hook: "When the long hand points straight up to 12, just read the short hand — wherever it points, that's the o'clock time!",
      concept_reveal: "At o'clock the long hand sits on 12 and the short hand names the hour — that's how we read whole-hour times.",
    },
  },

  math1_ch6_sequencing_events: {
    key_formulas: [
      { formula: "Events happen in an order: first, next, then, last", explanation: "Wake up → brush teeth → eat → go to school." },
      { formula: "Some things take longer than others", explanation: "A nap is longer than a blink." },
    ],
    prerequisite_knowledge: ["parts of the day", "before and after", "everyday routines"],
    visual_description: "Four picture cards of a morning routine placed in order: wake, brush, eat, school.",
    svg_diagrams: [svg("math1_ch6_sequencing", "First, next, then, last",
      `${["wake","brush","eat","school"].map((e,i)=>`<rect x="${20+i*135}" y="70" width="120" height="50" fill="#fef9c3" stroke="#d97706"/><text x="${40+i*135}" y="100" font-size="12">${i+1}. ${e}</text>`).join("")}`)],
    when_to_use_this_method: {
      use_this_when: ["Putting events in the order they happen", "Using words first/next/then/last"],
      use_other_when: ["Reading a clock time → that's a different time skill"],
    },
    edge_cases: [
      { case: "Two orders that both seem fine", value: "pick what must come first", reasoning: "You brush teeth before, not after, washing the brush away.", where_it_appears: "Logical order." },
      { case: "Comparing how long events take", value: "a film is longer than a song", reasoning: "Events have different lengths.", where_it_appears: "Duration sense." },
    ],
    video_script_hooks: {
      opening_hook: "First you wake up, THEN you brush, THEN you eat. Mix that up and you'd brush with breakfast in your mouth! Order matters.",
      concept_reveal: "Sequencing puts events in the order they happen using first, next, then and last.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 7 — Measurement (compare length, weight, capacity)
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch7_comparing_lengths: {
    key_formulas: [
      { formula: "Compare lengths with longer / shorter / taller", explanation: "Line up the ends to see which reaches further." },
      { formula: "Start both objects from the same point", explanation: "Otherwise the comparison is unfair." },
    ],
    prerequisite_knowledge: ["the idea of length", "the words long and short", "lining things up"],
    visual_description: "A pencil and a crayon lined up at the same starting line; the pencil reaches further (longer).",
    svg_diagrams: [svg("math1_ch7_compare_length", "Longer and shorter",
      `<line x1="50" y1="60" x2="50" y2="140" stroke="#94a3b8" stroke-dasharray="3 3"/>
       <rect x="50" y="65" width="300" height="16" fill="#fde68a" stroke="#d97706"/><text x="360" y="78">longer</text>
       <rect x="50" y="110" width="160" height="16" fill="#bbf7d0" stroke="#16a34a"/><text x="220" y="123">shorter</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which object is longer/taller", "Ordering things by length"],
      use_other_when: ["Comparing how heavy or how much it holds → weight/capacity"],
    },
    edge_cases: [
      { case: "Objects not started from the same line", value: "unfair — line them up first", reasoning: "Both must begin at the same point.", where_it_appears: "Fair comparison." },
      { case: "Two objects the same length", value: "neither is longer — equal", reasoning: "Their ends match.", where_it_appears: "Equal lengths." },
    ],
    video_script_hooks: {
      opening_hook: "Whose pencil is longer? Line them up at the same spot and look — the one that pokes out further wins. No peeking with a head start!",
      concept_reveal: "To compare lengths we line objects up at the same start and see which reaches further: longer or shorter.",
    },
  },

  math1_ch7_non_standard_units: {
    key_formulas: [
      { formula: "Measure length by counting how many small units fit", explanation: "The desk is 6 handspans long." },
      { formula: "Use the SAME unit each time", explanation: "Don't mix handspans with paperclips." },
    ],
    prerequisite_knowledge: ["comparing lengths", "counting", "the idea of a repeated unit"],
    visual_description: "A pencil measured as 4 paperclips long, the clips laid end to end beneath it.",
    svg_diagrams: [svg("math1_ch7_nonstandard", "Pencil = 4 paperclips",
      `<rect x="50" y="55" width="240" height="16" fill="#fde68a" stroke="#d97706"/>
       ${[0,1,2,3].map(i=>`<rect x="${50+i*60}" y="85" width="55" height="20" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       <text x="50" y="135">4 paperclips long</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Measuring length with everyday units (handspans, clips, steps)", "Before learning rulers and cm"],
      use_other_when: ["You need an exact standard length → use a ruler (later classes)"],
    },
    edge_cases: [
      { case: "Mixing units (2 clips + 1 handspan)", value: "wrong — use one unit", reasoning: "Units must be the same to count fairly.", where_it_appears: "Consistent units." },
      { case: "Different people's handspans", value: "give different counts", reasoning: "Non-standard units vary — why we later use cm.", where_it_appears: "Why standard units exist." },
    ],
    video_script_hooks: {
      opening_hook: "How long is your desk? No ruler? No problem — count how many handspans across it is! That's measuring with your own units.",
      concept_reveal: "We can measure by counting how many identical small units fit along an object — as long as we keep the unit the same.",
    },
  },

  math1_ch7_comparing_weights: {
    key_formulas: [
      { formula: "Compare weights with heavier / lighter", explanation: "Hold one in each hand — the heavier pulls down." },
      { formula: "A balance shows the heavier side going down", explanation: "The lighter side rises." },
    ],
    prerequisite_knowledge: ["the idea of weight (heavy/light)", "comparing two things", "up and down"],
    visual_description: "A see-saw balance with a watermelon down (heavier) and an apple up (lighter).",
    svg_diagrams: [svg("math1_ch7_compare_weight", "Heavier goes down",
      `<line x1="70" y1="60" x2="320" y2="105" stroke="#475569" stroke-width="3"/><line x1="195" y1="55" x2="195" y2="150" stroke="#475569" stroke-width="3"/>
       <circle cx="320" cy="115" r="18" fill="#86efac" stroke="#16a34a"/><text x="345" y="120">heavier</text>
       <circle cx="70" cy="55" r="10" fill="#fca5a5" stroke="#dc2626"/><text x="30" y="50">lighter</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which object is heavier or lighter", "Using a balance to compare"],
      use_other_when: ["Comparing length or how much it holds → those are different"],
    },
    edge_cases: [
      { case: "A big light thing vs a small heavy thing", value: "small one can be heavier", reasoning: "Size doesn't decide weight.", where_it_appears: "Size ≠ weight." },
      { case: "Balance stays level", value: "both weigh the same", reasoning: "Equal weights balance.", where_it_appears: "Equal weights." },
    ],
    video_script_hooks: {
      opening_hook: "A big balloon or a small stone — which is heavier? Hold one in each hand! The heavy one tugs your hand down.",
      concept_reveal: "We compare weights as heavier or lighter; on a balance, the heavier object always sinks down.",
    },
  },

  math1_ch7_comparing_capacities: {
    key_formulas: [
      { formula: "Compare how much containers hold: more / less", explanation: "A bucket holds more than a cup." },
      { formula: "Fill one and pour into the other to check", explanation: "If it overflows, the first holds more." },
    ],
    prerequisite_knowledge: ["the idea of holding liquid", "more and less", "pouring"],
    visual_description: "A big jug and a small cup, with the jug labelled 'holds more'.",
    svg_diagrams: [svg("math1_ch7_compare_capacity", "Holds more / holds less",
      `<rect x="60" y="50" width="70" height="100" fill="#bae6fd" stroke="#2563eb"/><text x="55" y="170">holds more</text>
       <rect x="250" y="100" width="45" height="50" fill="#bae6fd" stroke="#2563eb"/><text x="240" y="170">holds less</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which container holds more or less", "Comparing how much things hold"],
      use_other_when: ["Comparing length or weight → those are different measurements"],
    },
    edge_cases: [
      { case: "A tall thin glass vs a short wide one", value: "the wide one may hold more", reasoning: "Tall doesn't always mean more — pour to check.", where_it_appears: "Shape can fool you." },
      { case: "Two containers holding the same", value: "equal capacity", reasoning: "One pours exactly into the other.", where_it_appears: "Equal capacity." },
    ],
    video_script_hooks: {
      opening_hook: "Which holds more juice — the tall skinny glass or the short fat mug? Don't trust your eyes — pour and find out!",
      concept_reveal: "We compare capacity as 'holds more' or 'holds less', and pouring one into the other settles it for sure.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 8 — Numbers to 50
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch8_numbers_21_to_30: {
    key_formulas: [
      { formula: "21 to 30 = two tens and some ones", explanation: "24 = 2 tens + 4 ones." },
      { formula: "30 = three tens", explanation: "Three full bundles of ten." },
    ],
    prerequisite_knowledge: ["numbers to 20", "tens and ones", "counting on"],
    visual_description: "Two ten-bundles plus 4 ones making 24, and three ten-bundles making 30.",
    svg_diagrams: [svg("math1_ch8_21_30", "24 = 2 tens and 4 ones",
      `<rect x="40" y="55" width="45" height="55" fill="#bfdbfe" stroke="#2563eb"/><rect x="95" y="55" width="45" height="55" fill="#bfdbfe" stroke="#2563eb"/>
       ${[0,1,2,3].map(i=>`<rect x="${160+i*22}" y="55" width="16" height="55" fill="#fed7aa" stroke="#d97706"/>`).join("")}
       <text x="270" y="90" font-size="18">= 24</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and counting 21 to 30", "Seeing them as tens and ones"],
      use_other_when: ["Numbers above 30 → carry on to 31–50"],
    },
    edge_cases: [
      { case: "30", value: "three tens, zero ones", reasoning: "A new full ten.", where_it_appears: "Reaching thirty." },
      { case: "After 29", value: "comes 30", reasoning: "Ten ones roll into a new ten.", where_it_appears: "Crossing to 30." },
    ],
    video_script_hooks: {
      opening_hook: "Past twenty we keep bundling tens! 24 is two ten-bundles and four loose ones. Numbers are just tens and ones.",
      concept_reveal: "Numbers 21 to 30 are two tens plus some ones, finishing the third ten at 30.",
    },
  },

  math1_ch8_numbers_31_to_40: {
    key_formulas: [
      { formula: "31 to 40 = three tens and some ones", explanation: "36 = 3 tens + 6 ones." },
      { formula: "40 = four tens", explanation: "Four full bundles of ten." },
    ],
    prerequisite_knowledge: ["numbers 21 to 30", "tens and ones", "counting on"],
    visual_description: "Three ten-bundles plus 6 ones making 36.",
    svg_diagrams: [svg("math1_ch8_31_40", "36 = 3 tens and 6 ones",
      `${[0,1,2].map(i=>`<rect x="${40+i*45}" y="55" width="40" height="55" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       ${[0,1,2,3,4,5].map(i=>`<rect x="${190+i*20}" y="55" width="14" height="55" fill="#fed7aa" stroke="#d97706"/>`).join("")}
       <text x="320" y="90" font-size="18">= 36</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and counting 31 to 40", "Seeing them as tens and ones"],
      use_other_when: ["Numbers above 40 → carry on to 41–50"],
    },
    edge_cases: [
      { case: "40", value: "four tens, zero ones", reasoning: "Another full ten.", where_it_appears: "Reaching forty." },
      { case: "After 39", value: "comes 40", reasoning: "Ten ones make a new ten.", where_it_appears: "Crossing to 40." },
    ],
    video_script_hooks: {
      opening_hook: "Thirty-six? That's three big bundles of ten and six little ones left over. Every number tells you its tens and ones!",
      concept_reveal: "Numbers 31 to 40 are three tens plus some ones, completing the fourth ten at 40.",
    },
  },

  math1_ch8_numbers_41_to_50: {
    key_formulas: [
      { formula: "41 to 50 = four tens and some ones", explanation: "47 = 4 tens + 7 ones." },
      { formula: "50 = five tens", explanation: "Five full bundles of ten." },
    ],
    prerequisite_knowledge: ["numbers 31 to 40", "tens and ones", "counting on"],
    visual_description: "Four ten-bundles plus 7 ones making 47, and five bundles making 50.",
    svg_diagrams: [svg("math1_ch8_41_50", "47 = 4 tens and 7 ones",
      `${[0,1,2,3].map(i=>`<rect x="${40+i*42}" y="55" width="38" height="55" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       ${[0,1,2,3,4,5,6].map(i=>`<rect x="${220+i*18}" y="55" width="13" height="55" fill="#fed7aa" stroke="#d97706"/>`).join("")}
       <text x="360" y="90" font-size="16">= 47</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and counting 41 to 50", "Seeing them as tens and ones"],
      use_other_when: ["Numbers above 50 → those come later (51–99)"],
    },
    edge_cases: [
      { case: "50", value: "five tens, zero ones", reasoning: "Five full bundles.", where_it_appears: "Reaching fifty." },
      { case: "After 49", value: "comes 50", reasoning: "Ten ones become a new ten.", where_it_appears: "Crossing to 50." },
    ],
    video_script_hooks: {
      opening_hook: "Forty-seven! Count the bundles: four tens, then seven loose ones. We're halfway to a hundred already.",
      concept_reveal: "Numbers 41 to 50 are four tens plus some ones, reaching five whole tens at 50.",
    },
  },

  math1_ch8_ordering_to_50: {
    key_formulas: [
      { formula: "Order numbers to 50 by their size", explanation: "Compare tens first, then ones." },
      { formula: "More tens = bigger number", explanation: "32 is bigger than 28 (3 tens beats 2 tens)." },
    ],
    prerequisite_knowledge: ["numbers to 50", "tens and ones", "ordering to 20"],
    visual_description: "Cards 32, 17, 45, 28 arranged smallest to biggest: 17, 28, 32, 45.",
    svg_diagrams: [svg("math1_ch8_order_50", "Ordering numbers to 50",
      `<text x="30" y="55">mixed:  32  17  45  28</text>
       <text x="30" y="110" fill="#16a34a">in order:  17  28  32  45</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Putting numbers up to 50 in order", "Finding the bigger/smaller of two"],
      use_other_when: ["You only need to count, not arrange"],
    },
    edge_cases: [
      { case: "32 vs 28", value: "32 is bigger (3 tens > 2 tens)", reasoning: "Compare tens first.", where_it_appears: "Tens decide." },
      { case: "34 vs 37 (same tens)", value: "37 is bigger (7 ones > 4 ones)", reasoning: "Equal tens, so ones decide.", where_it_appears: "Ones break the tie." },
    ],
    video_script_hooks: {
      opening_hook: "Which is bigger, 28 or 32? Count the tens first — 3 tens beats 2 tens, so 32 wins, even though 8 looks big!",
      concept_reveal: "To order numbers to 50, compare the tens first; if they're equal, the ones decide.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 9 — Data Handling
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch9_collecting_data: {
    key_formulas: [
      { formula: "Data is information we gather, like favourite fruits", explanation: "Ask, then write down the answers." },
      { formula: "Collect by asking and recording", explanation: "One mark per answer." },
    ],
    prerequisite_knowledge: ["counting", "asking and listening", "the idea of a group"],
    visual_description: "Children being asked their favourite fruit, with answers recorded next to apple, banana, mango.",
    svg_diagrams: [svg("math1_ch9_collecting", "Gathering answers",
      `<text x="30" y="45" font-weight="bold">Favourite fruit?</text>
       <text x="30" y="80">Apple:  ● ● ●</text>
       <text x="30" y="110">Banana: ● ●</text>
       <text x="30" y="140">Mango:  ● ● ● ●</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Gathering information by asking", "Starting to make a chart or graph"],
      use_other_when: ["The information is already given → go straight to counting it"],
    },
    edge_cases: [
      { case: "Someone picks two fruits", value: "decide the rule first (one choice each)", reasoning: "Clear rules keep data tidy.", where_it_appears: "Survey rules." },
      { case: "A fruit nobody picks", value: "count of 0", reasoning: "Zero is a real answer.", where_it_appears: "Empty groups." },
    ],
    video_script_hooks: {
      opening_hook: "Want to know the class's favourite fruit? Ask everyone and jot it down — that gathering is collecting data!",
      concept_reveal: "Collecting data means asking a question and recording each answer so we can count them later.",
    },
  },

  math1_ch9_sorting_and_grouping: {
    key_formulas: [
      { formula: "Group data by putting same answers together", explanation: "All the 'apple' answers in one group." },
      { formula: "Count each group to see how many", explanation: "Grouping makes counting easy." },
    ],
    prerequisite_knowledge: ["collecting data", "sorting objects", "counting"],
    visual_description: "Scattered fruit answers being grouped into apple, banana and mango piles.",
    svg_diagrams: [svg("math1_ch9_sorting", "Group the same answers",
      `<text x="30" y="40">mixed: 🍎🍌🍎🥭🍎🍌</text>
       <text x="30" y="85" fill="#dc2626">apples: 🍎🍎🍎 (3)</text>
       <text x="30" y="120" fill="#16a34a">bananas: 🍌🍌 (2)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Organising collected answers into groups", "Counting how many in each group"],
      use_other_when: ["You haven't gathered any data yet → collect it first"],
    },
    edge_cases: [
      { case: "An answer in the wrong group", value: "miscount", reasoning: "Each answer goes in exactly one matching group.", where_it_appears: "Careful grouping." },
      { case: "Two groups with the same count", value: "they tie", reasoning: "Equal groups are allowed.", where_it_appears: "Ties." },
    ],
    video_script_hooks: {
      opening_hook: "All those fruit answers are in a jumble! Pop the apples together, the bananas together — now they're easy to count.",
      concept_reveal: "Sorting and grouping puts matching answers together so each group is simple to count.",
    },
  },

  math1_ch9_tally_marks: {
    key_formulas: [
      { formula: "One tally mark | for each thing counted", explanation: "Make a stroke per item." },
      { formula: "Group in fives: |||| with a line across = 5", explanation: "Easier to count in fives." },
    ],
    prerequisite_knowledge: ["collecting data", "counting", "grouping"],
    visual_description: "Tally marks for fruits: apple |||, banana ||, mango |||| , with the five crossed.",
    svg_diagrams: [svg("math1_ch9_tally", "Tally marks count by fives",
      `<text x="30" y="50">Apple   |||        3</text>
       <text x="30" y="85">Banana  ||         2</text>
       <text x="30" y="120">Mango   |||| |     6</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Keeping count as you collect", "Counting quickly in fives"],
      use_other_when: ["The total is already known → no need to tally"],
    },
    edge_cases: [
      { case: "A group of 5", value: "shown as |||| with a slash", reasoning: "The fifth mark crosses the first four.", where_it_appears: "Tally convention." },
      { case: "7 items", value: "one group of 5 and 2 more (|||| ||)", reasoning: "Count fives then leftovers.", where_it_appears: "Bigger counts." },
    ],
    video_script_hooks: {
      opening_hook: "Counting a big group? Make a little line for each one — and every fifth one gets a line across, so you can count in fives!",
      concept_reveal: "Tally marks record one stroke per item and bundle them in fives for fast, easy counting.",
    },
  },

  math1_ch9_pictographs: {
    key_formulas: [
      { formula: "A pictograph shows data with one picture per item", explanation: "Three apple pictures = 3 apples." },
      { formula: "The tallest row is the most popular", explanation: "Compare rows at a glance." },
    ],
    prerequisite_knowledge: ["collecting data", "counting", "tally marks"],
    visual_description: "Rows of fruit pictures: apple ●●●, banana ●●, mango ●●●● — mango row longest.",
    svg_diagrams: [svg("math1_ch9_pictographs", "Reading a pictograph",
      `<text x="20" y="45">Apple   ● ● ●        3</text>
       <text x="20" y="80">Banana  ● ●          2</text>
       <text x="20" y="115">Mango   ● ● ● ●      4</text>
       <text x="20" y="150" fill="#dc2626">most: mango</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Showing counts with pictures", "Seeing which group is most/least at a glance"],
      use_other_when: ["Very large numbers → pictures get long (later: bar graphs)"],
    },
    edge_cases: [
      { case: "Counting the pictures", value: "one picture = one item here", reasoning: "At Class 1, each picture stands for one.", where_it_appears: "Simple key." },
      { case: "Two rows the same length", value: "equal counts", reasoning: "They tie for most.", where_it_appears: "Ties." },
    ],
    video_script_hooks: {
      opening_hook: "Which fruit won? Just look at the picture rows — the longest row of mangoes shouts 'I'm the favourite!'",
      concept_reveal: "A pictograph turns counts into rows of pictures, so the most and least popular jump out instantly.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 10 — Patterns
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch10_repeating_patterns: {
    key_formulas: [
      { formula: "A repeating pattern repeats the same unit over and over", explanation: "red, blue, red, blue …" },
      { formula: "Find the repeating UNIT to know what's next", explanation: "Here the unit is red-blue." },
    ],
    prerequisite_knowledge: ["colours and shapes", "left-to-right order", "the idea of 'same again'"],
    visual_description: "A bead string red-blue-red-blue-red, with the repeating red-blue unit boxed.",
    svg_diagrams: [svg("math1_ch10_repeating", "Repeating pattern",
      `${[0,1,2,3,4].map(i=>`<circle cx="${60+i*80}" cy="80" r="22" fill="${i%2?'#2563eb':'#dc2626'}"/>`).join("")}
       <rect x="35" y="50" width="105" height="60" fill="none" stroke="#16a34a" stroke-dasharray="4 3"/><text x="40" y="135" fill="#16a34a">unit</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Continuing a pattern that repeats", "Spotting the repeating unit"],
      use_other_when: ["The pattern grows each time → it's a growing pattern"],
    },
    edge_cases: [
      { case: "A 3-part unit (red-blue-green)", value: "the unit can be longer than two", reasoning: "Find the whole repeating chunk.", where_it_appears: "Longer units." },
      { case: "Pattern by size (big-small-big)", value: "size repeats, not colour", reasoning: "Patterns can repeat any feature.", where_it_appears: "Size patterns." },
    ],
    video_script_hooks: {
      opening_hook: "Red, blue, red, blue … your brain already shouts 'RED next!' That's because you found the little unit that repeats.",
      concept_reveal: "A repeating pattern says the same unit again and again; find that unit and you can always say what's next.",
    },
  },

  math1_ch10_growing_patterns: {
    key_formulas: [
      { formula: "A growing pattern gets bigger each step", explanation: "1 dot, 2 dots, 3 dots, 4 dots …" },
      { formula: "Each step adds a little more", explanation: "Here, one more dot each time." },
    ],
    prerequisite_knowledge: ["repeating patterns", "counting", "one more than"],
    visual_description: "Dot groups growing 1, 2, 3, 4 — each step one taller than the last.",
    svg_diagrams: [svg("math1_ch10_growing", "Growing pattern 1, 2, 3, 4",
      `${[1,2,3,4].map((n,g)=>Array.from({length:n},(_,r)=>`<circle cx="${60+g*90}" cy="${130-r*22}" r="9" fill="#16a34a"/>`).join("")).join("")}
       <text x="50" y="170">1, 2, 3, 4 …</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Patterns that increase step by step", "Predicting a bigger next step"],
      use_other_when: ["The pattern just repeats the same unit → repeating pattern"],
    },
    edge_cases: [
      { case: "Adding 2 each time (2, 4, 6)", value: "still a growing pattern", reasoning: "It grows by a fixed amount.", where_it_appears: "Step size." },
      { case: "A shrinking row (4, 3, 2)", value: "the rule can also go down", reasoning: "Growing patterns can decrease too.", where_it_appears: "Reverse." },
    ],
    video_script_hooks: {
      opening_hook: "One dot, two dots, three dots … each step gets a little taller. This pattern doesn't just repeat — it GROWS!",
      concept_reveal: "A growing pattern adds a bit more at each step, so it gets steadily bigger.",
    },
  },

  math1_ch10_number_patterns: {
    key_formulas: [
      { formula: "Number patterns follow a counting rule", explanation: "2, 4, 6, 8 (count by 2s)." },
      { formula: "Find the jump between numbers", explanation: "5, 10, 15 → +5 each time." },
    ],
    prerequisite_knowledge: ["counting", "skip counting by 2s/5s/10s", "one more/less"],
    visual_description: "The sequence 2, 4, 6, 8 with +2 hops drawn between the numbers.",
    svg_diagrams: [svg("math1_ch10_number_pattern", "Count by 2s",
      `<text x="40" y="80" font-size="20">2   4   6   8   10</text>
       <path d="M50 90 Q70 120 95 90" fill="none" stroke="#dc2626"/><text x="55" y="135" fill="#dc2626">+2</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Continuing a number sequence", "Skip counting by 2s, 5s or 10s"],
      use_other_when: ["The pattern is shapes or colours → that's a shape pattern"],
    },
    edge_cases: [
      { case: "Counting down (10, 8, 6)", value: "rule is −2", reasoning: "Number patterns can decrease.", where_it_appears: "Backward counting." },
      { case: "Even vs odd jumps", value: "2,4,6 are evens; 1,3,5 are odds", reasoning: "Different start, same +2 rule.", where_it_appears: "Even/odd patterns." },
    ],
    video_script_hooks: {
      opening_hook: "2, 4, 6, 8 … what comes next? Find the jump — it's hopping up by 2 each time, so 10 is next!",
      concept_reveal: "Number patterns follow a counting rule like 'add 2'; the jump between numbers reveals it.",
    },
  },

  math1_ch10_shape_patterns: {
    key_formulas: [
      { formula: "Shape patterns repeat or grow with shapes", explanation: "circle, square, circle, square …" },
      { formula: "Spot the rule to draw what comes next", explanation: "Repeating or growing, just like other patterns." },
    ],
    prerequisite_knowledge: ["identifying shapes", "repeating patterns", "growing patterns"],
    visual_description: "A row circle-square-circle-square-circle with the next shape (square) predicted.",
    svg_diagrams: [svg("math1_ch10_shape_pattern", "Repeating shape pattern",
      `${[0,1,2,3,4].map(i=>i%2===0?`<circle cx="${60+i*85}" cy="80" r="20" fill="#dbeafe" stroke="#2563eb"/>`:`<rect x="${40+i*85}" y="60" width="40" height="40" fill="#fde68a" stroke="#d97706"/>`).join("")}
       <text x="40" y="135">next: square</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Continuing a pattern made of shapes", "Spotting whether shapes repeat or grow"],
      use_other_when: ["The pattern is numbers → use a counting rule"],
    },
    edge_cases: [
      { case: "Pattern by shape AND colour", value: "follow both rules together", reasoning: "Some patterns change two things.", where_it_appears: "Trickier patterns." },
      { case: "A growing shape pattern (1, 2, 3 sides)", value: "shapes can grow, not just repeat", reasoning: "Triangle, square, pentagon …", where_it_appears: "Growing shapes." },
    ],
    video_script_hooks: {
      opening_hook: "Circle, square, circle, square … your turn — what shape comes next? Patterns work with shapes just like with colours.",
      concept_reveal: "Shape patterns repeat or grow using shapes; find the rule and you can draw whatever comes next.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 11 — Place Value and Numbers to 99
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch11_tens_and_ones: {
    key_formulas: [
      { formula: "A two-digit number = some tens and some ones", explanation: "34 = 3 tens + 4 ones." },
      { formula: "The left digit is tens, the right digit is ones", explanation: "In 34, the 3 means thirty." },
    ],
    prerequisite_knowledge: ["numbers to 50", "the number ten", "counting in tens"],
    visual_description: "34 shown as 3 ten-rods and 4 unit-cubes, with the digits labelled tens and ones.",
    svg_diagrams: [svg("math1_ch11_tens_ones", "34 = 3 tens and 4 ones",
      `${[0,1,2].map(i=>`<rect x="${40+i*30}" y="50" width="20" height="60" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       ${[0,1,2,3].map(i=>`<rect x="${150+i*22}" y="90" width="16" height="18" fill="#fed7aa" stroke="#d97706"/>`).join("")}
       <text x="270" y="90" font-size="18">= 34</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Breaking a two-digit number into tens and ones", "Understanding what each digit means"],
      use_other_when: ["Single-digit numbers → they're just ones"],
    },
    edge_cases: [
      { case: "The 3 in 34", value: "means 30, not 3", reasoning: "It's in the tens place.", where_it_appears: "Why place matters." },
      { case: "A 0 in the ones (40)", value: "4 tens, 0 ones", reasoning: "Zero holds the ones place.", where_it_appears: "Round tens." },
    ],
    video_script_hooks: {
      opening_hook: "In the number 34, the 3 isn't just three — it's THIRTY! Where a digit sits tells you what it's really worth.",
      concept_reveal: "Two-digit numbers split into tens and ones; the left digit counts tens, the right digit counts ones.",
    },
  },

  math1_ch11_numbers_51_to_75: {
    key_formulas: [
      { formula: "51 to 75 = five-to-seven tens and some ones", explanation: "63 = 6 tens + 3 ones." },
      { formula: "Keep bundling tens past fifty", explanation: "60 = 6 tens, 70 = 7 tens." },
    ],
    prerequisite_knowledge: ["tens and ones", "numbers to 50", "counting in tens"],
    visual_description: "63 shown as 6 ten-rods and 3 ones.",
    svg_diagrams: [svg("math1_ch11_51_75", "63 = 6 tens and 3 ones",
      `${[0,1,2,3,4,5].map(i=>`<rect x="${40+i*32}" y="50" width="22" height="60" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       ${[0,1,2].map(i=>`<rect x="${250+i*20}" y="90" width="15" height="18" fill="#fed7aa" stroke="#d97706"/>`).join("")}
       <text x="330" y="90" font-size="16">= 63</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and counting 51 to 75", "Seeing them as tens and ones"],
      use_other_when: ["Numbers above 75 → carry on to 76–99"],
    },
    edge_cases: [
      { case: "70", value: "7 tens, 0 ones", reasoning: "A round ten.", where_it_appears: "Round numbers." },
      { case: "After 69", value: "comes 70", reasoning: "Ten ones make a new ten.", where_it_appears: "Crossing a ten." },
    ],
    video_script_hooks: {
      opening_hook: "Sixty-three is just six bundles of ten and three loose ones. Big numbers aren't scary — they're tidy little bundles!",
      concept_reveal: "Numbers 51 to 75 keep bundling tens, with the ones counting the leftovers.",
    },
  },

  math1_ch11_numbers_76_to_99: {
    key_formulas: [
      { formula: "76 to 99 = seven-to-nine tens and some ones", explanation: "88 = 8 tens + 8 ones." },
      { formula: "99 is the biggest two-digit number", explanation: "After 99 comes 100." },
    ],
    prerequisite_knowledge: ["numbers 51 to 75", "tens and ones", "counting on"],
    visual_description: "88 shown as 8 ten-rods and 8 ones, with a note that 99 is the last two-digit number.",
    svg_diagrams: [svg("math1_ch11_76_99", "88 = 8 tens and 8 ones",
      `${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${30+i*26}" y="50" width="18" height="55" fill="#bfdbfe" stroke="#2563eb"/>`).join("")}
       <text x="250" y="85" font-size="16">8 tens + 8 ones = 88</text>
       <text x="250" y="120" fill="#dc2626">99 → then 100</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading and counting 76 to 99", "Reaching the top of two-digit numbers"],
      use_other_when: ["100 and beyond → three-digit numbers (later class)"],
    },
    edge_cases: [
      { case: "After 99", value: "comes 100 (three digits)", reasoning: "Both digit-places are full.", where_it_appears: "Rolling to 100." },
      { case: "90", value: "9 tens, 0 ones", reasoning: "A round ten.", where_it_appears: "Round numbers." },
    ],
    video_script_hooks: {
      opening_hook: "What's the biggest two-digit number? Ninety-nine! Add one more and it flips into a brand-new three-digit number: 100.",
      concept_reveal: "Numbers 76 to 99 finish the two-digit numbers, ending at 99 — one more and you reach 100.",
    },
  },

  math1_ch11_comparing_two_digit: {
    key_formulas: [
      { formula: "Compare the TENS first; more tens = bigger", explanation: "52 > 39 because 5 tens beat 3 tens." },
      { formula: "If tens are equal, compare the ones", explanation: "47 > 43 because 7 ones beat 3 ones." },
    ],
    prerequisite_knowledge: ["tens and ones", "numbers to 99", "comparing single digits"],
    visual_description: "52 vs 39: 5 tens vs 3 tens, so 52 is bigger — shown with ten-rods.",
    svg_diagrams: [svg("math1_ch11_compare_2digit", "52 &gt; 39 (compare tens first)",
      `<text x="60" y="60" font-size="26">52</text><text x="150" y="60" font-size="26" fill="#dc2626">&gt;</text><text x="220" y="60" font-size="26">39</text>
       <text x="40" y="110">5 tens beat 3 tens</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which two-digit number is bigger", "Putting numbers to 99 in order"],
      use_other_when: ["Comparing single digits → just compare the ones"],
    },
    edge_cases: [
      { case: "52 vs 39", value: "52 bigger (5 tens > 3 tens)", reasoning: "Tens decide, even though 9 > 2.", where_it_appears: "Tens first!" },
      { case: "47 vs 43 (same tens)", value: "47 bigger (ones decide)", reasoning: "Equal tens, so compare ones.", where_it_appears: "Tie-break with ones." },
    ],
    video_script_hooks: {
      opening_hook: "Is 39 bigger than 52 because 9 beats 2? No way! Count the TENS first — 5 tens crushes 3 tens. 52 wins.",
      concept_reveal: "To compare two-digit numbers, check the tens first; only if they're equal do the ones decide.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 12 — Money
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch12_coins_and_notes: {
    key_formulas: [
      { formula: "We use coins and notes for money", explanation: "Coins: ₹1, ₹2, ₹5, ₹10. Notes: ₹10, ₹20, ₹50 …" },
      { formula: "Each coin/note has a value written on it", explanation: "A ₹5 coin is worth 5 rupees." },
    ],
    prerequisite_knowledge: ["numbers to 50", "recognising digits", "everyday shopping"],
    visual_description: "A row of coins (₹1, ₹2, ₹5, ₹10) and a ₹10 note, each labelled with its value.",
    svg_diagrams: [svg("math1_ch12_coins", "Coins and a note",
      `${[1,2,5,10].map((v,i)=>`<circle cx="${60+i*70}" cy="70" r="25" fill="#fde68a" stroke="#d97706"/><text x="${48+i*70}" y="76" font-size="12">₹${v}</text>`).join("")}
       <rect x="40" y="120" width="120" height="50" fill="#bbf7d0" stroke="#16a34a"/><text x="80" y="150">₹10 note</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Recognising Indian coins and notes", "Knowing what each is worth"],
      use_other_when: ["Counting objects, not money → no rupees needed"],
    },
    edge_cases: [
      { case: "A ₹10 coin and a ₹10 note", value: "same value, different form", reasoning: "Both are worth 10 rupees.", where_it_appears: "Coin vs note." },
      { case: "A bigger coin", value: "isn't always worth more", reasoning: "Value is written on it, not shown by size.", where_it_appears: "Size ≠ value." },
    ],
    video_script_hooks: {
      opening_hook: "Jingle jingle! Some money is round coins, some is paper notes — and each one has its value printed right on it.",
      concept_reveal: "Money comes as coins and notes, and the number on each tells you exactly how many rupees it's worth.",
    },
  },

  math1_ch12_value_of_coins: {
    key_formulas: [
      { formula: "Add coin values to find the total money", explanation: "₹5 + ₹2 + ₹1 = ₹8." },
      { formula: "Count the bigger coins first", explanation: "Easier to add from largest to smallest." },
    ],
    prerequisite_knowledge: ["coins and notes", "addition", "numbers to 50"],
    visual_description: "A ₹5 coin, a ₹2 coin and a ₹1 coin adding to ₹8.",
    svg_diagrams: [svg("math1_ch12_value", "₹5 + ₹2 + ₹1 = ₹8",
      `<circle cx="70" cy="80" r="28" fill="#fde68a" stroke="#d97706"/><text x="58" y="86">₹5</text>
       <circle cx="150" cy="80" r="24" fill="#fde68a" stroke="#d97706"/><text x="138" y="86">₹2</text>
       <circle cx="220" cy="80" r="20" fill="#fde68a" stroke="#d97706"/><text x="210" y="86">₹1</text>
       <text x="280" y="86" font-size="18" fill="#16a34a">= ₹8</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the total of some coins", "Counting how much money you have"],
      use_other_when: ["You only need to name a coin, not total them"],
    },
    edge_cases: [
      { case: "Two ₹5 coins", value: "₹10 total", reasoning: "Same coin counted twice adds up.", where_it_appears: "Repeated coins." },
      { case: "Counting smallest first", value: "still works, just slower", reasoning: "Order doesn't change the total.", where_it_appears: "Counting strategy." },
    ],
    video_script_hooks: {
      opening_hook: "You've got a ₹5, a ₹2 and a ₹1 coin — how much is that? Add them up: ₹8! Counting money is just adding.",
      concept_reveal: "To find how much money you have, add up the values of all the coins and notes.",
    },
  },

  math1_ch12_making_amounts: {
    key_formulas: [
      { formula: "Make an amount by choosing coins that add to it", explanation: "₹7 = ₹5 + ₹2, or ₹2 + ₹2 + ₹2 + ₹1." },
      { formula: "There can be more than one way", explanation: "Different coin sets can make the same amount." },
    ],
    prerequisite_knowledge: ["value of coins", "addition", "number bonds"],
    visual_description: "Two coin sets both making ₹7: (₹5 + ₹2) and (₹2 + ₹2 + ₹2 + ₹1).",
    svg_diagrams: [svg("math1_ch12_making", "Two ways to make ₹7",
      `<text x="30" y="60">₹5 + ₹2 = ₹7</text>
       <text x="30" y="110">₹2 + ₹2 + ₹2 + ₹1 = ₹7</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Choosing coins to pay an exact amount", "Finding different ways to make a sum"],
      use_other_when: ["You just need the total of given coins → that's adding values"],
    },
    edge_cases: [
      { case: "Making ₹7 two ways", value: "both correct", reasoning: "Many coin combinations can equal the same amount.", where_it_appears: "More than one answer." },
      { case: "Using fewest coins", value: "use the biggest coins first", reasoning: "₹5 + ₹2 beats four coins for ₹7.", where_it_appears: "Fewest-coins idea." },
    ],
    video_script_hooks: {
      opening_hook: "How can you make exactly ₹7? A ₹5 and a ₹2 … or lots of ₹2s and a ₹1! There's often more than one way.",
      concept_reveal: "Making an amount means picking coins that add up to it — and usually there's more than one correct set.",
    },
  },

  math1_ch12_simple_money_problems: {
    key_formulas: [
      { formula: "Add prices for the total cost; subtract to find change", explanation: "Buy ₹3 + ₹4 = ₹7; pay ₹10 → change ₹3." },
      { formula: "Can you afford it? Compare money you have with the price", explanation: "₹10 ≥ ₹7, so yes." },
    ],
    prerequisite_knowledge: ["value of coins", "addition and subtraction", "comparing numbers"],
    visual_description: "A toy costing ₹7, paid with a ₹10 note, giving ₹3 change.",
    svg_diagrams: [svg("math1_ch12_money_problems", "Buy ₹7, pay ₹10, change ₹3",
      `<text x="20" y="50">Toy costs ₹7</text>
       <text x="20" y="90" fill="#2563eb">Pay ₹10</text>
       <text x="20" y="130" fill="#16a34a">Change = ₹10 − ₹7 = ₹3</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Simple buying stories — total, change, can-I-afford-it", "Adding or comparing small amounts of money"],
      use_other_when: ["Just naming coins → no calculation needed"],
    },
    edge_cases: [
      { case: "Paying the exact amount", value: "no change (₹0)", reasoning: "Money paid equals the price.", where_it_appears: "Exact payment." },
      { case: "Not enough money", value: "can't buy it yet", reasoning: "Money is less than the price.", where_it_appears: "Can't-afford case." },
    ],
    video_script_hooks: {
      opening_hook: "A toy costs ₹7 and you hand over a ₹10 note. How much comes back? ₹3 change! Shopping is add-and-subtract with rupees.",
      concept_reveal: "Money problems add prices for the total and subtract to find change — the maths of every shop trip.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 13 — Counting Large Groups and Estimation
  // ───────────────────────────────────────────────────────────────────────────
  math1_ch13_counting_large_groups: {
    key_formulas: [
      { formula: "Count big groups by making bundles of ten", explanation: "3 tens and 5 ones = 35." },
      { formula: "Bundling stops you losing count", explanation: "Count the tens, then the leftover ones." },
    ],
    prerequisite_knowledge: ["counting to 99", "tens and ones", "skip counting by tens"],
    visual_description: "35 sticks grouped into 3 bundles of ten plus 5 loose sticks.",
    svg_diagrams: [svg("math1_ch13_large_groups", "Count by bundling tens: 35",
      `${[0,1,2].map(i=>`<rect x="${40+i*70}" y="55" width="50" height="55" fill="#bfdbfe" stroke="#2563eb"/><text x="50+${i*70}" y="135" font-size="11">ten</text>`).join("")}
       ${[0,1,2,3,4].map(i=>`<line x1="${270+i*15}" y1="55" x2="${270+i*15}" y2="110" stroke="#d97706" stroke-width="3"/>`).join("")}
       <text x="360" y="90" font-size="16">= 35</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Counting a large pile without losing track", "Counting in tens then ones"],
      use_other_when: ["Small groups (under 10) → just count one by one"],
    },
    edge_cases: [
      { case: "A leftover that's not a full ten", value: "count it as ones", reasoning: "35 = 3 tens and 5 ones.", where_it_appears: "Leftover ones." },
      { case: "Losing count by ones", value: "bundle into tens instead", reasoning: "Bundles are easier to track.", where_it_appears: "Why we bundle." },
    ],
    video_script_hooks: {
      opening_hook: "Counting 35 marbles one by one? You'll lose track! Bundle them into tens — three bundles and five left over. Easy!",
      concept_reveal: "Counting big groups gets easy when you bundle into tens, then count the tens and the leftover ones.",
    },
  },

  math1_ch13_counting_in_groups: {
    key_formulas: [
      { formula: "Skip count in 2s, 5s or 10s to count faster", explanation: "2, 4, 6, 8 … or 5, 10, 15 … or 10, 20, 30 …" },
      { formula: "Group equal-size sets, then skip count", explanation: "4 pairs of socks → 2, 4, 6, 8." },
    ],
    prerequisite_knowledge: ["counting to 99", "equal groups", "number patterns"],
    visual_description: "Pairs of socks counted 2, 4, 6, 8 and groups of 5 fingers counted 5, 10, 15.",
    svg_diagrams: [svg("math1_ch13_groups", "Skip counting in 2s and 5s",
      `<text x="30" y="60">socks in 2s:  2  4  6  8</text>
       <text x="30" y="110">hands in 5s:  5  10  15  20</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Counting equal groups quickly", "Counting things that come in 2s, 5s or 10s"],
      use_other_when: ["Groups aren't equal sized → count them separately"],
    },
    edge_cases: [
      { case: "Counting pairs", value: "skip count in 2s", reasoning: "Each pair adds 2.", where_it_appears: "Socks, shoes." },
      { case: "Counting fingers on hands", value: "skip count in 5s", reasoning: "Each hand adds 5.", where_it_appears: "Hands." },
    ],
    video_script_hooks: {
      opening_hook: "Counting socks one by one is slow — but they come in PAIRS! 2, 4, 6, 8 … skip counting is counting at super-speed.",
      concept_reveal: "When things come in equal groups of 2, 5 or 10, skip counting lets you count them in a flash.",
    },
  },

  math1_ch13_estimation: {
    key_formulas: [
      { formula: "Estimating = a sensible guess of how many, without counting", explanation: "'About 20' rather than an exact count." },
      { formula: "Use a known group to help guess", explanation: "If 10 fill a cup, two cups is about 20." },
    ],
    prerequisite_knowledge: ["counting to 99", "the words 'about' and 'around'", "comparing amounts"],
    visual_description: "A jar of beads with the guess 'about 30', then counted to check.",
    svg_diagrams: [svg("math1_ch13_estimation", "Guess about how many",
      `<rect x="60" y="50" width="90" height="110" rx="10" fill="#dbeafe" stroke="#2563eb"/>
       ${Array.from({length:18},(_,i)=>`<circle cx="${72+ (i%4)*20}" cy="${75+Math.floor(i/4)*20}" r="6" fill="#dc2626"/>`).join("")}
       <text x="180" y="110">guess: about 20</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A quick 'about how many' is enough", "Guessing before counting to check"],
      use_other_when: ["You need the exact number → count carefully"],
    },
    edge_cases: [
      { case: "A wild guess far from the count", value: "use a known group to guess better", reasoning: "Compare to something you know.", where_it_appears: "Smarter estimates." },
      { case: "Estimating very few (3 or 4)", value: "just count — it's quick", reasoning: "Estimation helps most with big groups.", where_it_appears: "When to estimate." },
    ],
    video_script_hooks: {
      opening_hook: "How many beads in this jar? Don't count yet — GUESS! 'About 20?' Then count to see how close you were.",
      concept_reveal: "Estimating is a smart guess of how many, using groups you already know — handy when counting one-by-one is too slow.",
    },
  },

  math1_ch13_comparing_quantities: {
    key_formulas: [
      { formula: "Compare amounts with more / fewer / equal", explanation: "8 apples is more than 5 apples." },
      { formula: "Match one-to-one to compare", explanation: "Pair them up; leftovers show which group has more." },
    ],
    prerequisite_knowledge: ["counting", "more and less", "comparing numbers"],
    visual_description: "8 apples paired one-to-one with 5 oranges; 3 apples have no partner, so apples are more.",
    svg_diagrams: [svg("math1_ch13_comparing", "More, fewer, equal",
      `${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${50+i*45}" cy="60" r="14" fill="#fca5a5" stroke="#dc2626"/>`).join("")}
       ${[0,1,2,3,4].map(i=>`<circle cx="${50+i*45}" cy="120" r="14" fill="#fdba74" stroke="#d97706"/>`).join("")}
       <text x="50" y="170" fill="#dc2626">8 apples &gt; 5 oranges</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding which group has more or fewer", "Comparing two amounts"],
      use_other_when: ["You only need the count of one group, not a comparison"],
    },
    edge_cases: [
      { case: "Two groups that pair up exactly", value: "equal amounts", reasoning: "No leftovers on either side.", where_it_appears: "Equal groups." },
      { case: "Comparing by size of objects", value: "compare the COUNT, not the size", reasoning: "5 big apples is still fewer than 8 small ones.", where_it_appears: "Count vs size." },
    ],
    video_script_hooks: {
      opening_hook: "8 apples and 5 oranges — which is more? Pair them up! The three apples with no orange partner show apples win.",
      concept_reveal: "We compare quantities with more, fewer or equal — matching one-to-one shows which group has extra.",
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
