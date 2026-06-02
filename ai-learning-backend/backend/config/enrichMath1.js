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
