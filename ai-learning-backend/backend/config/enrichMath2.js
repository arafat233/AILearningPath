/**
 * enrichMath2.js — v3 enrichment for CBSE Class 2 Math (CONTENT_STATUS).
 *
 * The 60 `math2_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (auditMathChecklist --prefix=math2_). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition / derivation / process_explanation /
 * worked_example / common_misconceptions / shortcuts_and_tricks / key_takeaway):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the NCERT Class 2 "Joyful Mathematics" / Math-Magic
 * curriculum (Ch1 3D shapes … Ch15 data handling). Mirrors enrichMath4.js.
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath2.js            # patch every topic present in ENRICH
 *         node config/enrichMath2.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math2
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math2_ch${args.ch}_` : null;

// Compact, self-contained SVG helper (matches each topic's visual_description).
function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

const ENRICH = {
  // ── CHAPTER 1 — Shapes Around Us (3D shapes) ───────────────────────────────
  math2_ch1_3d_shapes: {
    key_formulas: [ { formula: "Rule: every solid object has a shape name — ball = sphere, box = cuboid, can = cylinder, party-hat = cone, dice = cube.", explanation: "We name a solid by what it looks like, just like we name animals." } ],
    prerequisite_knowledge: ["Knowing the names of everyday things like balls, boxes, and cans", "Telling one object apart from another by looking"],
    visual_description: "Five everyday objects in a row, each labeled with its 3D shape name: a ball (sphere), a box (cuboid), a can (cylinder), a party hat (cone), and a dice (cube).",
    svg_diagrams: [svg("math2_ch1_3d_shapes_diagram", "Solid Shapes Around Us", `<text x="20" y="26" font-weight="bold">Shapes Around Us</text><circle cx="70" cy="100" r="28" fill="#fde"/><text x="50" y="150">Sphere</text><rect x="140" y="78" width="56" height="44" fill="#dfe"/><text x="148" y="150">Cuboid</text><rect x="250" y="72" width="40" height="56" fill="#def" rx="18"/><text x="248" y="150">Cylinder</text><polygon points="370,72 350,128 390,128" fill="#ffd"/><text x="350" y="150">Cone</text><rect x="450" y="78" width="44" height="44" fill="#fed"/><text x="458" y="150">Cube</text>`)],
    when_to_use_this_method: { use_this_when: ["You hold a solid object and want to say its shape name", "Sorting toys or blocks into shape groups"], use_other_when: ["You only need to know if a face is flat or curved — use the flat vs curved idea", "You are drawing on paper — those are flat shapes, not solid ones"] },
    edge_cases: [ { case: "A cube and a cuboid look alike", value: "cube = all sides same; cuboid = some sides longer", reasoning: "A dice is a cube because every face is a square of the same size; a matchbox is a cuboid because it is longer one way.", where_it_appears: "Sorting a dice from a brick or book" } ],
    video_script_hooks: { opening_hook: "Look around your room — every toy, can, and box is secretly a shape in disguise!", concept_reveal: "A ball is a sphere, a box is a cuboid, a can is a cylinder. Each solid has its own special name." },
  },
  math2_ch1_flat_vs_curved: {
    key_formulas: [ { formula: "Rule: a flat surface is smooth and straight like a tabletop; a curved surface bends like the outside of a ball.", explanation: "Run your finger over it — flat goes straight, curved bends around." } ],
    prerequisite_knowledge: ["Knowing common 3D shapes (box, ball, can)", "Feeling the difference between straight and bendy with your hand"],
    visual_description: "A box with one flat face highlighted next to a ball with its whole curved surface highlighted, with arrows pointing to 'flat' and 'curved'.",
    svg_diagrams: [svg("math2_ch1_flat_vs_curved_diagram", "Flat and Curved", `<text x="20" y="26" font-weight="bold">Flat and Curved</text><rect x="60" y="70" width="70" height="60" fill="#dfe"/><text x="60" y="155">Box: flat faces</text><circle cx="380" cy="100" r="40" fill="#fde"/><text x="320" y="160">Ball: curved surface</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to describe what an object's surface feels like", "Deciding if a shape can stand flat without rolling"], use_other_when: ["You want the object's full shape name — use 3D shapes", "You want to know if it rolls or slides — use rolling and sliding"] },
    edge_cases: [ { case: "A can has both kinds of surface", value: "2 flat circles (top & bottom) + 1 curved side", reasoning: "A cylinder's round side is curved, but its top and bottom are flat, so it can stand or roll.", where_it_appears: "Looking at a tin or a drink can" } ],
    video_script_hooks: { opening_hook: "Close your eyes and rub a box, then a ball — one feels straight, one feels round!", concept_reveal: "Flat surfaces are smooth and straight; curved surfaces bend, like the skin of a ball." },
  },
  math2_ch1_long_vs_round: {
    key_formulas: [ { formula: "Rule: long objects stretch out in one direction (like a rolling pin); round objects are the same all around (like a ball).", explanation: "Long means stretched; round means the same shape from every side." } ],
    prerequisite_knowledge: ["Knowing flat and curved surfaces", "Comparing how things look from different sides"],
    visual_description: "A long rolling pin drawn beside a round ball, with the rolling pin labeled 'long' and the ball labeled 'round'.",
    svg_diagrams: [svg("math2_ch1_long_vs_round_diagram", "Long and Round", `<text x="20" y="26" font-weight="bold">Long and Round</text><rect x="60" y="92" width="200" height="22" fill="#def" rx="10"/><text x="110" y="150">Rolling pin: long</text><circle cx="430" cy="105" r="38" fill="#fde"/><text x="390" y="160">Ball: round</text>`)],
    when_to_use_this_method: { use_this_when: ["Describing whether a thing is stretched out or ball-like", "Sorting objects into long ones and round ones"], use_other_when: ["You need the exact shape name — use 3D shapes", "You want to know if it rolls — use rolling and sliding"] },
    edge_cases: [ { case: "A rolling pin is long but still round", value: "long shape with a curved (round) surface", reasoning: "Being long and being round are two different things — an object can be both stretched out and curved like a tube.", where_it_appears: "Describing a rolling pin, pencil, or bat" } ],
    video_script_hooks: { opening_hook: "Is your pencil more like a stretchy snake or a round marble?", concept_reveal: "Long things stretch out one way; round things look the same all the way around." },
  },
  math2_ch1_rolling_sliding: {
    key_formulas: [ { formula: "Rule: shapes with a curved surface roll (ball, cylinder); shapes with only flat faces slide (box, cube); a cone can do both.", explanation: "Curved sides let a shape roll; flat sides make it slide along the ground." } ],
    prerequisite_knowledge: ["Knowing flat and curved surfaces", "Pushing objects gently to watch what they do"],
    visual_description: "A ball rolling down a slope with a curved arrow, and a box sliding down with a straight arrow, plus a cone shown doing both.",
    svg_diagrams: [svg("math2_ch1_rolling_sliding_diagram", "Roll or Slide", `<text x="20" y="26" font-weight="bold">Roll or Slide</text><circle cx="90" cy="90" r="26" fill="#fde"/><text x="55" y="140">Ball rolls</text><rect x="220" y="70" width="50" height="44" fill="#dfe"/><text x="210" y="140">Box slides</text><polygon points="430,66 408,116 452,116" fill="#ffd"/><text x="385" y="140">Cone: both</text>`)],
    when_to_use_this_method: { use_this_when: ["Predicting if a shape will roll away or stay put", "Choosing a shape to roll, like a wheel"], use_other_when: ["You just want to name the surface — use flat vs curved", "You want the shape's full name — use 3D shapes"] },
    edge_cases: [ { case: "A cone both rolls and slides", value: "rolls in a circle on its curved side; slides on its flat bottom", reasoning: "A cone has one curved surface and one flat circle, so it can roll round and round or sit and slide.", where_it_appears: "Playing with an ice-cream cone or party hat" } ],
    video_script_hooks: { opening_hook: "Give a ball and a box a tiny push — which one runs away and which one just slides?", concept_reveal: "Curved shapes roll, flat-sided shapes slide, and a tricky cone can do both!" },
  },

  // ── CHAPTER 2 — Counting in Groups (skip counting, odd/even) ───────────────
  math2_ch2_counting_by_2s: {
    key_formulas: [ { formula: "2, 4, 6, 8, 10... — to skip count by 2s, add 2 each time.", explanation: "Instead of counting every single thing, jump 2 forward each step." } ],
    prerequisite_knowledge: ["Counting from 1 to 20 in order", "Knowing how to add 2 to a number"],
    visual_description: "A number line with hops of 2 drawn as arches landing on 2, 4, 6, 8, and 10.",
    svg_diagrams: [svg("math2_ch2_counting_by_2s_diagram", "Skip Count by 2s", `<text x="20" y="26" font-weight="bold">Count by 2s</text><line x1="40" y1="120" x2="520" y2="120" stroke="#333"/><text x="60" y="140">2</text><text x="160" y="140">4</text><text x="260" y="140">6</text><text x="360" y="140">8</text><text x="455" y="140">10</text><text x="80" y="95">+2</text><text x="180" y="95">+2</text><text x="280" y="95">+2</text><text x="380" y="95">+2</text>`)],
    when_to_use_this_method: { use_this_when: ["Counting things that come in pairs, like socks or shoes", "You want to count faster than one by one"], use_other_when: ["Things come in fives — count by 5s", "Things come in tens — count by 10s"] },
    edge_cases: [ { case: "Starting from an odd number", value: "1, 3, 5, 7... still jumps by 2", reasoning: "Skip counting by 2 always adds 2, so starting at 1 gives the odd numbers instead of the even ones.", where_it_appears: "Counting odd-numbered houses on a street" } ],
    video_script_hooks: { opening_hook: "Counting your socks one by one is slow — what if we count them two at a time?", concept_reveal: "Skip counting by 2s means we jump 2 forward each time: 2, 4, 6, 8!" },
  },
  math2_ch2_counting_by_5s: {
    key_formulas: [ { formula: "5, 10, 15, 20... — to skip count by 5s, add 5 each time.", explanation: "Make a jump of 5 forward each step instead of counting one by one." } ],
    prerequisite_knowledge: ["Counting up to 50 in order", "Skip counting by 2s"],
    visual_description: "Five fingers on a hand shown repeating, with the totals 5, 10, 15, 20 written under each hand.",
    svg_diagrams: [svg("math2_ch2_counting_by_5s_diagram", "Skip Count by 5s", `<text x="20" y="26" font-weight="bold">Count by 5s</text><line x1="40" y1="120" x2="520" y2="120" stroke="#333"/><text x="60" y="140">5</text><text x="155" y="140">10</text><text x="255" y="140">15</text><text x="355" y="140">20</text><text x="450" y="140">25</text><text x="80" y="95">+5</text><text x="180" y="95">+5</text><text x="280" y="95">+5</text><text x="380" y="95">+5</text>`)],
    when_to_use_this_method: { use_this_when: ["Counting things in fives, like fingers on hands", "Counting coins worth 5"], use_other_when: ["Things come in twos — count by 2s", "Things come in tens — count by 10s"] },
    edge_cases: [ { case: "Numbers counted by 5 end in 5 or 0", value: "5, 10, 15, 20, 25, 30...", reasoning: "Every jump of 5 lands on a number ending in 5 then 0, over and over.", where_it_appears: "Reading the minute marks on a clock face" } ],
    video_script_hooks: { opening_hook: "How many fingers are on 4 hands? Counting one by one takes forever!", concept_reveal: "Each hand has 5 fingers, so we jump by 5: 5, 10, 15, 20!" },
  },
  math2_ch2_counting_by_10s: {
    key_formulas: [ { formula: "10, 20, 30, 40... — to skip count by 10s, add 10 each time.", explanation: "Jump a whole ten forward each step — the fastest big counting jump." } ],
    prerequisite_knowledge: ["Counting up to 100 in order", "Knowing that ten ones make one ten"],
    visual_description: "Stacks of ten blocks each, with running totals 10, 20, 30, 40 written below the stacks.",
    svg_diagrams: [svg("math2_ch2_counting_by_10s_diagram", "Skip Count by 10s", `<text x="20" y="26" font-weight="bold">Count by 10s</text><rect x="60" y="60" width="22" height="70" fill="#def"/><text x="58" y="150">10</text><rect x="170" y="60" width="22" height="70" fill="#def"/><text x="165" y="150">20</text><rect x="280" y="60" width="22" height="70" fill="#def"/><text x="275" y="150">30</text><rect x="390" y="60" width="22" height="70" fill="#def"/><text x="385" y="150">40</text>`)],
    when_to_use_this_method: { use_this_when: ["Counting groups of ten, like bundles of ten sticks", "Counting big amounts quickly"], use_other_when: ["Things come in twos — count by 2s", "Things come in fives — count by 5s"] },
    edge_cases: [ { case: "Numbers counted by 10 always end in 0", value: "10, 20, 30, 40, 50...", reasoning: "Adding 10 keeps the ones place at 0 and only the tens grow by one.", where_it_appears: "Counting money in ten-rupee notes" } ],
    video_script_hooks: { opening_hook: "If you had bundles of ten pencils, could you count 50 pencils in just five jumps?", concept_reveal: "Counting by 10s makes us jump a whole ten each time: 10, 20, 30, 40!" },
  },
  math2_ch2_odd_and_even: {
    key_formulas: [ { formula: "Rule: even numbers make pairs with none left over (end in 0, 2, 4, 6, 8); odd numbers always have one left over (end in 1, 3, 5, 7, 9).", explanation: "Try to pair everything — if one is left alone, the number is odd." } ],
    prerequisite_knowledge: ["Counting objects one by one", "Making pairs of two"],
    visual_description: "Six dots grouped into three neat pairs labeled 'even', next to five dots making two pairs with one dot left over labeled 'odd'.",
    svg_diagrams: [svg("math2_ch2_odd_and_even_diagram", "Odd and Even", `<text x="20" y="26" font-weight="bold">Odd and Even</text><circle cx="60" cy="80" r="10" fill="#dfe"/><circle cx="90" cy="80" r="10" fill="#dfe"/><circle cx="60" cy="110" r="10" fill="#dfe"/><circle cx="90" cy="110" r="10" fill="#dfe"/><circle cx="60" cy="140" r="10" fill="#dfe"/><circle cx="90" cy="140" r="10" fill="#dfe"/><text x="40" y="175">6 = even</text><circle cx="320" cy="80" r="10" fill="#fde"/><circle cx="350" cy="80" r="10" fill="#fde"/><circle cx="320" cy="110" r="10" fill="#fde"/><circle cx="350" cy="110" r="10" fill="#fde"/><circle cx="335" cy="140" r="10" fill="#fdb"/><text x="300" y="175">5 = odd</text>`)],
    when_to_use_this_method: { use_this_when: ["Sharing things into two equal groups", "Checking if everyone can have a partner"], use_other_when: ["You only want to count faster — use skip counting", "You need the value of a digit — use place value"] },
    edge_cases: [ { case: "Zero is an even number", value: "0 is even", reasoning: "Zero things make zero pairs with nothing left over, so it counts as even.", where_it_appears: "Numbers like 10, 20, 30 ending in 0" } ],
    video_script_hooks: { opening_hook: "If every kid needs a partner, will anyone be left standing alone?", concept_reveal: "Even numbers pair up perfectly; odd numbers always leave one friend without a partner." },
  },

  // ── CHAPTER 3 — How Much Can You Carry? (weight) ───────────────────────────
  math2_ch3_heavy_vs_light: {
    key_formulas: [ { formula: "Rule: a heavy object is hard to lift and pulls down; a light object is easy to lift.", explanation: "Lift two things — the one that makes your arm work harder is heavier." } ],
    prerequisite_knowledge: ["Lifting and holding objects with your hands", "Comparing two things side by side"],
    visual_description: "A child holding a heavy rock in one hand (arm low) and a light feather in the other (arm high), showing the weight difference.",
    svg_diagrams: [svg("math2_ch3_heavy_vs_light_diagram", "Heavy and Light", `<text x="20" y="26" font-weight="bold">Heavy and Light</text><rect x="80" y="120" width="60" height="40" fill="#ccc"/><text x="70" y="180">Rock: heavy</text><polygon points="400,70 420,120 380,120" fill="#dfe"/><text x="360" y="150">Feather: light</text>`)],
    when_to_use_this_method: { use_this_when: ["Guessing which object is heavier just by holding it", "You have no scale, only your hands"], use_other_when: ["You need a fair, exact comparison — use a balance", "You need the weight in numbers — use grams and kilograms"] },
    edge_cases: [ { case: "Big does not always mean heavy", value: "a big balloon is lighter than a small stone", reasoning: "Size and weight are different — a large object can be very light if it is mostly air.", where_it_appears: "Comparing a balloon with a pebble" } ],
    video_script_hooks: { opening_hook: "Pick up your school bag, then a single crayon — which one makes your arm tired?", concept_reveal: "Heavy things are hard to lift; light things lift up easily." },
  },
  math2_ch3_comparing_weights: {
    key_formulas: [ { formula: "Rule: on a balance, the heavier pan goes DOWN and the lighter pan goes UP; if they stay level, the weights are equal.", explanation: "The pan that sinks is holding the heavier thing." } ],
    prerequisite_knowledge: ["Knowing heavy and light by feel", "Seeing a see-saw go up and down"],
    visual_description: "A balance scale with a heavier apple pulling its pan down and a lighter grape's pan tipping up.",
    svg_diagrams: [svg("math2_ch3_comparing_weights_diagram", "Balance Scale", `<text x="20" y="26" font-weight="bold">Heavier Pan Goes Down</text><line x1="120" y1="60" x2="440" y2="100" stroke="#333" stroke-width="3"/><line x1="280" y1="80" x2="280" y2="160" stroke="#333" stroke-width="3"/><rect x="90" y="60" width="60" height="14" fill="#fde"/><text x="80" y="55">Down: heavy</text><rect x="410" y="100" width="60" height="14" fill="#dfe"/><text x="400" y="135">Up: light</text>`)],
    when_to_use_this_method: { use_this_when: ["You want a fair test of which is heavier", "Two things feel almost the same in your hands"], use_other_when: ["A quick guess is enough — just lift them", "You need an exact number — use a scale with grams and kilograms"] },
    edge_cases: [ { case: "Both pans stay level", value: "the two objects weigh the same", reasoning: "When neither pan goes down, the weights are balanced and equal.", where_it_appears: "Balancing two identical blocks" } ],
    video_script_hooks: { opening_hook: "A balance is like a see-saw for objects — which side will sink down?", concept_reveal: "The heavier object pushes its pan down; the lighter one rises up." },
  },
  math2_ch3_standard_units_weight: {
    key_formulas: [ { formula: "1 kilogram (kg) = 1000 grams (g).", explanation: "A kilogram is a big unit made of 1000 little grams." } ],
    prerequisite_knowledge: ["Comparing weights with a balance", "Counting and knowing the number 1000 is very big"],
    visual_description: "A 1 kg bag of sugar on one side and 1000 tiny gram weights on the other, showing they balance equally.",
    svg_diagrams: [svg("math2_ch3_standard_units_weight_diagram", "Gram and Kilogram", `<text x="20" y="26" font-weight="bold">1 kg = 1000 g</text><rect x="80" y="80" width="90" height="60" fill="#dfe"/><text x="90" y="160">1 kg sugar</text><rect x="380" y="80" width="90" height="60" fill="#fde"/><text x="360" y="160">1000 grams</text><text x="250" y="115">=</text>`)],
    when_to_use_this_method: { use_this_when: ["You need to say exactly how heavy something is", "Buying things sold by weight, like fruit or rice"], use_other_when: ["You only need to compare two things — use a balance", "A rough guess is enough — just lift them"] },
    edge_cases: [ { case: "Grams for tiny things, kilograms for big things", value: "a feather is grams; a watermelon is kilograms", reasoning: "Light objects are measured in grams; heavy objects are measured in kilograms so the numbers stay easy.", where_it_appears: "A grocery shop weighing a feather vs a watermelon" } ],
    video_script_hooks: { opening_hook: "Would you measure a tiny feather and a giant watermelon the same way?", concept_reveal: "We weigh light things in grams and heavy things in kilograms — and 1 kilogram is 1000 grams!" },
  },
  math2_ch3_estimating_weight: {
    key_formulas: [ { formula: "Rule: estimate by comparing to a known weight — is it about 1 kg, lighter than 1 kg, or heavier than 1 kg?", explanation: "Use something you know (like a 1 kg bag) to guess how heavy a new thing is." } ],
    prerequisite_knowledge: ["Knowing grams and kilograms", "Holding a 1 kg object to feel its weight"],
    visual_description: "Three objects sorted into three labeled boxes: 'lighter than 1 kg' (apple), 'about 1 kg' (book), and 'heavier than 1 kg' (watermelon).",
    svg_diagrams: [svg("math2_ch3_estimating_weight_diagram", "Estimating Weight", `<text x="20" y="26" font-weight="bold">Guess: about 1 kg?</text><rect x="50" y="70" width="120" height="70" fill="#dfe"/><text x="55" y="160">Lighter: apple</text><rect x="220" y="70" width="120" height="70" fill="#ffd"/><text x="230" y="160">About 1 kg: book</text><rect x="390" y="70" width="120" height="70" fill="#fde"/><text x="390" y="160">Heavier: melon</text>`)],
    when_to_use_this_method: { use_this_when: ["You want a quick, smart guess before weighing", "Deciding if you can lift something on your own"], use_other_when: ["You need the exact weight — use a scale", "You only compare two things together — use a balance"] },
    edge_cases: [ { case: "Estimates are guesses, not exact", value: "your guess may be a little off", reasoning: "Estimating gives a close, helpful answer but a real scale gives the exact number.", where_it_appears: "Guessing a bag's weight before putting it on a scale" } ],
    video_script_hooks: { opening_hook: "Can you guess if your water bottle weighs about the same as a bag of sugar?", concept_reveal: "Estimating means making a smart guess by comparing to something you already know weighs 1 kilogram." },
  },

  // ── CHAPTER 4 — Place Value (two-digit numbers) ────────────────────────────
  math2_ch4_numbers_to_99: {
    key_formulas: [ { formula: "Rule: a two-digit number is made of tens and ones — for example, 47 means 4 tens and 7 ones.", explanation: "The left digit tells the tens, the right digit tells the ones." } ],
    prerequisite_knowledge: ["Counting and writing numbers up to 9", "Knowing that ten ones make one ten"],
    visual_description: "The number 47 shown as 4 bundles of ten sticks plus 7 single sticks.",
    svg_diagrams: [svg("math2_ch4_numbers_to_99_diagram", "Two-Digit Numbers", `<text x="20" y="26" font-weight="bold">47 = 4 tens + 7 ones</text><rect x="60" y="70" width="14" height="60" fill="#def"/><rect x="90" y="70" width="14" height="60" fill="#def"/><rect x="120" y="70" width="14" height="60" fill="#def"/><rect x="150" y="70" width="14" height="60" fill="#def"/><text x="70" y="150">4 tens</text><rect x="320" y="100" width="8" height="30" fill="#fde"/><rect x="335" y="100" width="8" height="30" fill="#fde"/><rect x="350" y="100" width="8" height="30" fill="#fde"/><rect x="365" y="100" width="8" height="30" fill="#fde"/><rect x="380" y="100" width="8" height="30" fill="#fde"/><rect x="395" y="100" width="8" height="30" fill="#fde"/><rect x="410" y="100" width="8" height="30" fill="#fde"/><text x="330" y="150">7 ones</text>`)],
    when_to_use_this_method: { use_this_when: ["Reading or writing numbers from 10 up to 99", "Saying how many tens and ones a number has"], use_other_when: ["The number is just one digit (0 to 9) — there are no tens", "You want to break it into 30 + 4 — use expanded form"] },
    edge_cases: [ { case: "Numbers ending in 0 have zero ones", value: "50 = 5 tens and 0 ones", reasoning: "When there are no single ones left, we write 0 in the ones place.", where_it_appears: "Round numbers like 20, 50, 90" } ],
    video_script_hooks: { opening_hook: "Did you know the number 47 is really just bundles of ten with a few extra sticks?", concept_reveal: "Every two-digit number is some tens plus some ones — that is how we read big numbers up to 99!" },
  },
  math2_ch4_tens_place: {
    key_formulas: [ { formula: "Rule: the left digit of a two-digit number is the TENS place — it counts groups of ten. In 34, the 3 means 30.", explanation: "Each ten in the tens place is worth ten ones." } ],
    prerequisite_knowledge: ["Knowing two-digit numbers", "Skip counting by 10s"],
    visual_description: "The number 34 with its left digit '3' circled and an arrow showing it means 3 tens, which is 30.",
    svg_diagrams: [svg("math2_ch4_tens_place_diagram", "The Tens Place", `<text x="20" y="26" font-weight="bold">In 34, the 3 means 30</text><text x="120" y="110" font-size="48">3</text><text x="180" y="110" font-size="48">4</text><circle cx="135" cy="95" r="34" fill="none" stroke="#e33" stroke-width="3"/><text x="300" y="100">3 tens = 30</text><text x="300" y="130">tens place</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to know how many tens are in a number", "Finding the value of the left digit"], use_other_when: ["You want the single ones — use the ones place", "You want the whole number broken up — use expanded form"] },
    edge_cases: [ { case: "A 0 in the tens place", value: "in 7, there are 0 tens", reasoning: "A one-digit number has nothing in the tens place, so its tens value is zero.", where_it_appears: "Single-digit numbers like 5 or 8" } ],
    video_script_hooks: { opening_hook: "In the number 34, the little 3 is hiding a big secret — it is really worth 30!", concept_reveal: "The left digit lives in the tens place, where every step is worth ten." },
  },
  math2_ch4_ones_place: {
    key_formulas: [ { formula: "Rule: the right digit of a two-digit number is the ONES place — it counts single ones. In 34, the 4 means 4.", explanation: "The ones place counts the leftover single things, not groups." } ],
    prerequisite_knowledge: ["Knowing two-digit numbers", "Counting single objects from 0 to 9"],
    visual_description: "The number 34 with its right digit '4' circled and an arrow showing it means 4 single ones.",
    svg_diagrams: [svg("math2_ch4_ones_place_diagram", "The Ones Place", `<text x="20" y="26" font-weight="bold">In 34, the 4 means 4 ones</text><text x="120" y="110" font-size="48">3</text><text x="180" y="110" font-size="48">4</text><circle cx="195" cy="95" r="34" fill="none" stroke="#2a8" stroke-width="3"/><text x="300" y="100">4 ones = 4</text><text x="300" y="130">ones place</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to know how many single ones a number has", "Finding the value of the right digit"], use_other_when: ["You want the groups of ten — use the tens place", "You want the whole number split — use expanded form"] },
    edge_cases: [ { case: "A 0 in the ones place", value: "in 30, there are 0 ones", reasoning: "When a number ends in 0, there are no leftover single ones — it is a clean group of tens.", where_it_appears: "Round numbers like 20, 40, 60" } ],
    video_script_hooks: { opening_hook: "The last digit of a number is like the leftovers — the few that did not fit into a group of ten!", concept_reveal: "The right digit sits in the ones place and counts the single ones." },
  },
  math2_ch4_expanded_form: {
    key_formulas: [ { formula: "Rule: expanded form splits a number into its tens and ones added together — 34 = 30 + 4.", explanation: "Write the tens value, then a plus sign, then the ones value." } ],
    prerequisite_knowledge: ["Knowing the tens place and ones place", "Adding a tens number to a ones number"],
    visual_description: "The number 34 breaking apart into two boxes, 30 and 4, joined by a plus sign to show 34 = 30 + 4.",
    svg_diagrams: [svg("math2_ch4_expanded_form_diagram", "Expanded Form", `<text x="20" y="26" font-weight="bold">34 = 30 + 4</text><rect x="60" y="70" width="80" height="50" fill="#def"/><text x="80" y="102">34</text><text x="170" y="102" font-size="28">=</text><rect x="220" y="70" width="80" height="50" fill="#dfe"/><text x="240" y="102">30</text><text x="320" y="102" font-size="28">+</text><rect x="360" y="70" width="80" height="50" fill="#fde"/><text x="388" y="102">4</text>`)],
    when_to_use_this_method: { use_this_when: ["Showing what each digit is really worth", "Breaking a number into tens and ones to understand it"], use_other_when: ["You just need to read the number — use two-digit numbers", "You only want one digit's value — use the tens or ones place"] },
    edge_cases: [ { case: "A number ending in 0", value: "50 = 50 + 0, usually written just as 50", reasoning: "When the ones are 0, adding 0 changes nothing, so the expanded form is simply the tens value.", where_it_appears: "Round numbers like 20, 70, 90" } ],
    video_script_hooks: { opening_hook: "What if we could split the number 34 into two friendly pieces?", concept_reveal: "Expanded form pulls a number apart into its tens and ones: 34 becomes 30 + 4!" },
  },

  // ── CHAPTER 5 — Patterns ───────────────────────────────────────────────────
  math2_ch5_color_patterns: {
    key_formulas: [ { formula: "Find the repeating unit, then say it again and again", explanation: "In red, blue, red, blue... the unit that repeats is 'red, blue'. You keep saying that unit to grow the pattern." } ],
    prerequisite_knowledge: ["Naming colors like red and blue", "Naming basic shapes like circle and square"],
    visual_description: "A row of shapes coloured red, blue, red, blue, red, blue showing the same two-colour unit repeating.",
    svg_diagrams: [svg("math2_ch5_color_patterns_diagram", "Repeating color pattern", `<text x="20" y="26" font-weight="bold">Pattern: red, blue, red, blue ...</text><circle cx="70" cy="110" r="22" fill="red"/><circle cx="140" cy="110" r="22" fill="blue"/><circle cx="210" cy="110" r="22" fill="red"/><circle cx="280" cy="110" r="22" fill="blue"/><circle cx="350" cy="110" r="22" fill="red"/><circle cx="420" cy="110" r="22" fill="blue"/><text x="55" y="170">The unit "red, blue" repeats</text>`)],
    when_to_use_this_method: { use_this_when: ["The same colors or shapes come back again and again in the same order"], use_other_when: ["The numbers keep getting bigger or smaller, like 1, 2, 3 (that is a growing pattern)"] },
    edge_cases: [ { case: "What comes after red, blue, red, blue?", value: "red", reasoning: "The unit 'red, blue' repeats, so after blue we start the unit again with red", where_it_appears: "Filling in the next shape in a pattern" } ],
    video_script_hooks: { opening_hook: "Look at this party banner: red, blue, red, blue! Can you guess which color comes next?", concept_reveal: "A pattern is just a little group that repeats. Find the group, then keep saying it over and over." },
  },
  math2_ch5_growing_patterns: {
    key_formulas: [ { formula: "Each step adds (growing) or takes away (shrinking) the same amount", explanation: "In 1, 2, 3 dots the pattern grows by 1 each time. In 9, 8, 7 it shrinks by 1 each time. The change stays the same." } ],
    prerequisite_knowledge: ["Counting forward and backward to 10", "Knowing which number is bigger or smaller"],
    visual_description: "Three groups of dots showing 1 dot, then 2 dots, then 3 dots, getting bigger by one each time.",
    svg_diagrams: [svg("math2_ch5_growing_patterns_diagram", "Growing dot pattern", `<text x="20" y="26" font-weight="bold">Growing: 1, 2, 3 dots ...</text><circle cx="70" cy="110" r="10" fill="black"/><circle cx="170" cy="95" r="10" fill="black"/><circle cx="170" cy="125" r="10" fill="black"/><circle cx="290" cy="80" r="10" fill="black"/><circle cx="290" cy="110" r="10" fill="black"/><circle cx="290" cy="140" r="10" fill="black"/><text x="40" y="180">1 dot, then 2 dots, then 3 dots</text>`)],
    when_to_use_this_method: { use_this_when: ["Each step gets bigger or smaller by the same amount"], use_other_when: ["The same shapes or colors repeat in the same order (that is a repeating pattern)"] },
    edge_cases: [ { case: "Shrinking pattern 5, 4, 3, 2", value: "next is 1", reasoning: "The pattern goes down by 1 each time, so after 2 comes 1", where_it_appears: "Counting-down patterns like a rocket launch" } ],
    video_script_hooks: { opening_hook: "Watch these dots: one... two... three... they keep growing like a little tower!", concept_reveal: "In a growing pattern you add the same amount each time. In a shrinking one you take the same amount away." },
  },
  math2_ch5_number_patterns: {
    key_formulas: [ { formula: "Numbers follow a rule, like 'add 2' or 'add 5'", explanation: "In 2, 4, 6, 8 the rule is 'add 2'. You use the same rule to find the next number." } ],
    prerequisite_knowledge: ["Counting to 50", "Skip counting by 2s and 5s"],
    visual_description: "A number line showing 2, 4, 6, 8 with little hops of +2 between each number.",
    svg_diagrams: [svg("math2_ch5_number_patterns_diagram", "Add 2 number pattern", `<text x="20" y="26" font-weight="bold">2, 4, 6, 8 (rule: add 2)</text><line x1="40" y1="120" x2="520" y2="120" stroke="black"/><text x="90" y="140">2</text><text x="210" y="140">4</text><text x="330" y="140">6</text><text x="450" y="140">8</text><text x="140" y="95">+2</text><text x="260" y="95">+2</text><text x="380" y="95">+2</text>`)],
    when_to_use_this_method: { use_this_when: ["You see numbers that change by the same step each time"], use_other_when: ["You see colors or shapes repeating instead of numbers"] },
    edge_cases: [ { case: "Pattern 5, 10, 15, 20", value: "rule is add 5", reasoning: "Each number is 5 more than the one before, so the next is 25", where_it_appears: "Counting money in fives or skip counting" } ],
    video_script_hooks: { opening_hook: "2, 4, 6, 8... do you hear the secret jumping rule hiding in these numbers?", concept_reveal: "Number patterns have a rule. Find how much you add or take away, then keep doing it." },
  },
  math2_ch5_pattern_rules: {
    key_formulas: [ { formula: "Look at two parts next to each other to find the rule", explanation: "For shapes, find the smallest part that repeats (the unit). For numbers, find how much changes from one to the next (+ or - step)." } ],
    prerequisite_knowledge: ["Knowing what a repeating pattern is", "Knowing what a growing pattern is"],
    visual_description: "A pattern split with a box drawn around the smallest repeating unit to show the rule.",
    svg_diagrams: [svg("math2_ch5_pattern_rules_diagram", "Finding the repeating unit", `<text x="20" y="26" font-weight="bold">Box the part that repeats</text><rect x="50" y="80" width="120" height="60" fill="none" stroke="green" stroke-width="3"/><circle cx="80" cy="110" r="16" fill="red"/><rect x="120" y="94" width="32" height="32" fill="blue"/><circle cx="200" cy="110" r="16" fill="red"/><rect x="240" y="94" width="32" height="32" fill="blue"/><circle cx="320" cy="110" r="16" fill="red"/><text x="50" y="175">Unit = red circle, blue square</text>`)],
    when_to_use_this_method: { use_this_when: ["You need to say the rule before you can find what comes next"], use_other_when: ["You already know the rule and just need to continue the pattern"] },
    edge_cases: [ { case: "Pattern 1, 3, 5, 7", value: "rule is add 2", reasoning: "From 1 to 3 is +2, and it stays +2, so the rule is add 2", where_it_appears: "Working out odd-number patterns" } ],
    video_script_hooks: { opening_hook: "Every pattern has a secret rule. Let's be pattern detectives and find it!", concept_reveal: "To find the rule, look at one part and the next part, and ask: what changes? Then check it works all the way." },
  },

  // ── CHAPTER 6 — Shapes and Sizes (length intro, symmetry) ──────────────────
  math2_ch6_comparing_sizes: {
    key_formulas: [ { formula: "Line up the bottoms, then compare", explanation: "To compare sizes fairly, put objects on the same line at the bottom. The one that reaches highest is tallest; the one that reaches least is shortest." } ],
    prerequisite_knowledge: ["Words like big, small, tall, short", "Putting things in order from first to last"],
    visual_description: "Three pencils of different heights standing on the same line, ordered from shortest to tallest.",
    svg_diagrams: [svg("math2_ch6_comparing_sizes_diagram", "Ordering by height", `<text x="20" y="26" font-weight="bold">Short to tall</text><line x1="40" y1="170" x2="520" y2="170" stroke="black"/><rect x="90" y="120" width="30" height="50" fill="orange"/><rect x="240" y="90" width="30" height="80" fill="orange"/><rect x="390" y="55" width="30" height="115" fill="orange"/><text x="80" y="190">short</text><text x="225" y="190">taller</text><text x="375" y="190">tallest</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to say which thing is bigger, taller, or shorter, or put things in order"], use_other_when: ["You want a number for how long something is (then measure with units)"] },
    edge_cases: [ { case: "Objects start at different heights", value: "Line up the bottoms first", reasoning: "If feet are not on the same line, a short thing on a box can look taller, which is not fair", where_it_appears: "Comparing people or objects on uneven ground" } ],
    video_script_hooks: { opening_hook: "Who is taller, the giraffe or the dog? Easy! But how do we know for sure?", concept_reveal: "To compare sizes fairly, stand things on the same line. Then your eyes can see which is tallest and which is shortest." },
  },
  math2_ch6_footprint_shapes: {
    key_formulas: [ { formula: "A footprint is the flat shape an object leaves when it sits down", explanation: "Press the bottom of an object on paper and trace it. A ball makes a circle, a box bottom makes a square or rectangle." } ],
    prerequisite_knowledge: ["Naming flat shapes: circle, square, rectangle, triangle", "Knowing top and bottom of an object"],
    visual_description: "A cube and a ball above their flat outlines: the cube leaves a square, the ball leaves a circle.",
    svg_diagrams: [svg("math2_ch6_footprint_shapes_diagram", "Object and its footprint", `<text x="20" y="26" font-weight="bold">What flat shape does it leave?</text><rect x="70" y="55" width="50" height="50" fill="brown"/><rect x="70" y="125" width="50" height="50" fill="none" stroke="black" stroke-width="2"/><text x="55" y="195">square</text><circle cx="360" cy="80" r="28" fill="red"/><circle cx="360" cy="150" r="28" fill="none" stroke="black" stroke-width="2"/><text x="335" y="195">circle</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to know the flat shape an object makes when it stands or is traced"], use_other_when: ["You want to measure how long or tall the object is"] },
    edge_cases: [ { case: "A can (cylinder) standing up", value: "leaves a circle", reasoning: "The flat bottom of a can is a circle, so its footprint is a circle", where_it_appears: "Matching real objects to their outlines" } ],
    video_script_hooks: { opening_hook: "If you dip a block in paint and press it down, what shape do you think it leaves behind?", concept_reveal: "The footprint is the flat shape an object's bottom makes. Round things leave circles, box bottoms leave squares." },
  },
  math2_ch6_measuring_length: {
    key_formulas: [ { formula: "Length = how many same units fit end to end", explanation: "Lay the same unit (like paper clips) end to end with no gaps along the object. Count them. That number is the length in that unit." } ],
    prerequisite_knowledge: ["Counting objects one by one", "Knowing what longer and shorter mean"],
    visual_description: "A pencil with paper clips laid end to end underneath it, and the clips being counted: 1, 2, 3, 4.",
    svg_diagrams: [svg("math2_ch6_measuring_length_diagram", "Measuring with paper clips", `<text x="20" y="26" font-weight="bold">How many clips long?</text><rect x="70" y="70" width="320" height="18" fill="goldenrod"/><rect x="70" y="110" width="70" height="20" fill="none" stroke="black"/><rect x="150" y="110" width="70" height="20" fill="none" stroke="black"/><rect x="230" y="110" width="70" height="20" fill="none" stroke="black"/><rect x="310" y="110" width="70" height="20" fill="none" stroke="black"/><text x="95" y="125">1</text><text x="175" y="125">2</text><text x="255" y="125">3</text><text x="335" y="125">4</text><text x="70" y="165">The pencil is 4 clips long</text>`)],
    when_to_use_this_method: { use_this_when: ["You want a number for how long something is using small same-size objects"], use_other_when: ["You just want to say which is longer without a number (then just compare)"] },
    edge_cases: [ { case: "Clips have gaps between them", value: "Answer will be wrong (too few)", reasoning: "Units must touch end to end with no gaps and no overlaps, or the count is not fair", where_it_appears: "Measuring carefully with non-standard units" } ],
    video_script_hooks: { opening_hook: "How long is your pencil? Let's measure it with paper clips instead of a ruler!", concept_reveal: "Lay the same little units end to end with no gaps, count them, and that count is how long the thing is." },
  },
  math2_ch6_symmetry: {
    key_formulas: [ { formula: "A line of symmetry splits a shape into two matching halves", explanation: "If you fold a shape on the line and both halves cover each other exactly, that fold is a line of symmetry, like the middle of a butterfly." } ],
    prerequisite_knowledge: ["Knowing left and right", "Knowing when two things match or look the same"],
    visual_description: "A butterfly with a dashed vertical line down the middle showing the left wing matches the right wing.",
    svg_diagrams: [svg("math2_ch6_symmetry_diagram", "Line of symmetry", `<text x="20" y="26" font-weight="bold">Both halves match</text><line x1="280" y1="50" x2="280" y2="180" stroke="black" stroke-dasharray="6 6"/><ellipse cx="220" cy="110" rx="55" ry="40" fill="violet"/><ellipse cx="340" cy="110" rx="55" ry="40" fill="violet"/><rect x="277" y="60" width="6" height="100" fill="black"/><text x="180" y="195">Fold here: left = right</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to check if a shape has two halves that match when folded"], use_other_when: ["You want to know the size of a shape, not whether it matches"] },
    edge_cases: [ { case: "Letter S", value: "no line of symmetry", reasoning: "There is no fold line that makes both halves of an S match exactly", where_it_appears: "Sorting letters and shapes by symmetry" } ],
    video_script_hooks: { opening_hook: "Look at a butterfly. Its two wings look exactly the same. That's a magic matching line called symmetry!", concept_reveal: "A line of symmetry is a fold line. If both halves cover each other perfectly, the shape is symmetric." },
  },

  // ── CHAPTER 7 — How Much Does It Hold? (capacity) ──────────────────────────
  math2_ch7_full_and_empty: {
    key_formulas: [ { formula: "Empty = nothing inside, Half-full = filled to the middle, Full = filled to the top", explanation: "We describe how much liquid is in a container by where the top of the liquid reaches: bottom (empty), middle (half), or top (full)." } ],
    prerequisite_knowledge: ["Knowing top, middle, and bottom", "Knowing more and less"],
    visual_description: "Three identical glasses side by side: one empty, one filled to the middle, one filled to the top.",
    svg_diagrams: [svg("math2_ch7_full_and_empty_diagram", "Empty, half, full", `<text x="20" y="26" font-weight="bold">Empty, half-full, full</text><rect x="80" y="60" width="60" height="110" fill="none" stroke="black"/><rect x="240" y="60" width="60" height="110" fill="none" stroke="black"/><rect x="240" y="115" width="60" height="55" fill="deepskyblue"/><rect x="400" y="60" width="60" height="110" fill="none" stroke="black"/><rect x="400" y="62" width="60" height="108" fill="deepskyblue"/><text x="85" y="190">empty</text><text x="240" y="190">half-full</text><text x="408" y="190">full</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to describe how much liquid is in one container with words"], use_other_when: ["You want to compare two containers to see which holds more"] },
    edge_cases: [ { case: "A glass with just a few drops", value: "almost empty (not full)", reasoning: "Only the very bottom is covered, so it is close to empty, not half or full", where_it_appears: "Describing real glasses of water" } ],
    video_script_hooks: { opening_hook: "Look at these three glasses of juice. One has none, one has some, one is to the top!", concept_reveal: "Empty means nothing inside, half-full means up to the middle, and full means right to the top." },
  },
  math2_ch7_comparing_capacity: {
    key_formulas: [ { formula: "More capacity = holds more when both are full", explanation: "Capacity is how much a container can hold. Fill both to the top; the one that holds more liquid has the bigger capacity." } ],
    prerequisite_knowledge: ["Knowing more and less", "Knowing full and empty"],
    visual_description: "A big jug next to a small cup, showing the jug holds more water than the cup.",
    svg_diagrams: [svg("math2_ch7_comparing_capacity_diagram", "Which holds more?", `<text x="20" y="26" font-weight="bold">Bigger container holds more</text><rect x="90" y="60" width="110" height="120" fill="deepskyblue" stroke="black"/><text x="100" y="200">jug (more)</text><rect x="340" y="120" width="55" height="60" fill="deepskyblue" stroke="black"/><text x="330" y="200">cup (less)</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to say which of two containers holds more or less"], use_other_when: ["You want an actual number of cups or litres (then measure)"] },
    edge_cases: [ { case: "A tall thin glass vs a short wide bowl", value: "Cannot tell just by looking", reasoning: "Tall does not always mean more; you must fill them or pour from one to the other to be sure", where_it_appears: "Comparing oddly-shaped containers" } ],
    video_script_hooks: { opening_hook: "A big jug and a little cup. Which one do you think can hold more juice?", concept_reveal: "Capacity means how much a container can hold. The one that holds more liquid has the bigger capacity." },
  },
  math2_ch7_measuring_capacity: {
    key_formulas: [ { formula: "Capacity = how many same cups fill the container", explanation: "Use one cup as your unit. Pour full cups into the container and count how many it takes to fill it. That count is its capacity in cups." } ],
    prerequisite_knowledge: ["Counting objects one by one", "Knowing what full means"],
    visual_description: "A bucket being filled by counting cups of water poured in: 1, 2, 3 cups.",
    svg_diagrams: [svg("math2_ch7_measuring_capacity_diagram", "Filling with cups", `<text x="20" y="26" font-weight="bold">How many cups fill it?</text><rect x="330" y="70" width="140" height="110" fill="deepskyblue" stroke="black"/><rect x="70" y="120" width="40" height="45" fill="deepskyblue" stroke="black"/><rect x="140" y="120" width="40" height="45" fill="deepskyblue" stroke="black"/><rect x="210" y="120" width="40" height="45" fill="deepskyblue" stroke="black"/><text x="78" y="110">1</text><text x="148" y="110">2</text><text x="218" y="110">3</text><text x="330" y="195">3 cups fill the bucket</text>`)],
    when_to_use_this_method: { use_this_when: ["You want a number for how much a container holds using a same-size cup"], use_other_when: ["You just want to compare two containers without counting"] },
    edge_cases: [ { case: "Last cup is not full", value: "Use the same full cup each time", reasoning: "Every cup must be filled the same amount, or the count of cups is not fair", where_it_appears: "Measuring carefully with a unit cup" } ],
    video_script_hooks: { opening_hook: "How much water can this bucket hold? Let's find out by pouring cups in and counting!", concept_reveal: "Pick one cup as your unit. Count how many full cups it takes to fill the container, and that's its capacity." },
  },
  math2_ch7_litres_intro: {
    key_formulas: [ { formula: "A litre (L) is a standard unit for measuring liquids", explanation: "Everyone's litre is the same size, so a 1-litre bottle holds the same amount anywhere. We use litres to measure water, milk, and juice." } ],
    prerequisite_knowledge: ["Knowing what capacity means", "Knowing that we count to measure"],
    visual_description: "A 1-litre bottle and a 1-litre measuring jug shown side by side, both holding the same amount.",
    svg_diagrams: [svg("math2_ch7_litres_intro_diagram", "One litre", `<text x="20" y="26" font-weight="bold">1 litre (1 L)</text><rect x="110" y="60" width="60" height="120" fill="deepskyblue" stroke="black"/><text x="100" y="195">1 L bottle</text><rect x="350" y="70" width="90" height="110" fill="deepskyblue" stroke="black"/><line x1="350" y1="70" x2="440" y2="70" stroke="black"/><text x="350" y="195">1 L jug</text>`)],
    when_to_use_this_method: { use_this_when: ["You measure or talk about liquids like water, milk, or juice"], use_other_when: ["You measure how long or tall something is (use length units instead)"] },
    edge_cases: [ { case: "A small juice box", value: "less than 1 litre", reasoning: "Tiny drink boxes hold only part of a litre, so they are less than 1 L", where_it_appears: "Reading drink labels" } ],
    video_script_hooks: { opening_hook: "Look at a big milk bottle. It says 1 litre! What does litre mean?", concept_reveal: "A litre is a same-size unit we use to measure liquids, so a 1-litre bottle holds the same amount everywhere." },
  },

  // ── CHAPTER 8 — Adding and Subtracting (2-digit with regrouping) ───────────
  math2_ch8_addition_2digit: {
    key_formulas: [ { formula: "Add the ones first, then add the tens", explanation: "Line up tens under tens and ones under ones. Add the ones column first, then add the tens column. Example: 23 + 14 = 37." } ],
    prerequisite_knowledge: ["Knowing tens and ones (place value) in a 2-digit number", "Adding single-digit numbers"],
    visual_description: "23 + 14 written in two columns (tens and ones) with the ones added first to make 7, then tens to make 3, giving 37.",
    svg_diagrams: [svg("math2_ch8_addition_2digit_diagram", "Add ones then tens", `<text x="20" y="26" font-weight="bold">23 + 14 = 37</text><text x="120" y="60">Tens</text><text x="230" y="60">Ones</text><text x="150" y="100">2</text><text x="250" y="100">3</text><text x="120" y="140">+ 1</text><text x="250" y="140">4</text><line x1="110" y1="155" x2="280" y2="155" stroke="black"/><text x="150" y="190">3</text><text x="250" y="190">7</text>`)],
    when_to_use_this_method: { use_this_when: ["You add two 2-digit numbers and the ones do not make 10 or more"], use_other_when: ["The ones add up to 10 or more (then you must regroup and carry)"] },
    edge_cases: [ { case: "23 + 14", value: "37", reasoning: "Ones: 3 + 4 = 7; tens: 2 + 1 = 3; no carry needed", where_it_appears: "Simple 2-digit addition without carrying" } ],
    video_script_hooks: { opening_hook: "You have 23 stickers and a friend gives you 14 more. How many now? Let's stack them up!", concept_reveal: "Put tens under tens and ones under ones. Add the ones first, then the tens." },
  },
  math2_ch8_subtraction_2digit: {
    key_formulas: [ { formula: "Subtract the ones first, then subtract the tens", explanation: "Line up tens under tens and ones under ones. Take away the ones column first, then the tens column. Example: 38 - 14 = 24." } ],
    prerequisite_knowledge: ["Knowing tens and ones (place value)", "Subtracting single-digit numbers"],
    visual_description: "38 - 14 written in two columns with ones subtracted first (8-4=4), then tens (3-1=2), giving 24.",
    svg_diagrams: [svg("math2_ch8_subtraction_2digit_diagram", "Subtract ones then tens", `<text x="20" y="26" font-weight="bold">38 - 14 = 24</text><text x="120" y="60">Tens</text><text x="230" y="60">Ones</text><text x="150" y="100">3</text><text x="250" y="100">8</text><text x="120" y="140">- 1</text><text x="250" y="140">4</text><line x1="110" y1="155" x2="280" y2="155" stroke="black"/><text x="150" y="190">2</text><text x="250" y="190">4</text>`)],
    when_to_use_this_method: { use_this_when: ["You subtract two 2-digit numbers and the top ones digit is big enough"], use_other_when: ["The top ones digit is smaller than the bottom one (then you must borrow)"] },
    edge_cases: [ { case: "38 - 14", value: "24", reasoning: "Ones: 8 - 4 = 4; tens: 3 - 1 = 2; no borrowing needed", where_it_appears: "Simple 2-digit subtraction without borrowing" } ],
    video_script_hooks: { opening_hook: "You had 38 candies and ate 14. How many are left? Let's take them away step by step!", concept_reveal: "Put tens under tens and ones under ones. Take away the ones first, then the tens." },
  },
  math2_ch8_regrouping: {
    key_formulas: [ { formula: "10 ones = 1 ten, so carry the 1 to the tens column", explanation: "When the ones add up to 10 or more, swap 10 ones for 1 ten. Write the leftover ones below and carry the 1 to the tens. Example: 27 + 15 = 42." } ],
    prerequisite_knowledge: ["Knowing that 10 ones make 1 ten", "Adding 2-digit numbers without carrying"],
    visual_description: "27 + 15: the ones make 12, so 10 ones become 1 ten carried over the tens column, leaving 2 ones and 4 tens to make 42.",
    svg_diagrams: [svg("math2_ch8_regrouping_diagram", "Carry 1 ten", `<text x="20" y="26" font-weight="bold">27 + 15 = 42</text><text x="120" y="55">Tens</text><text x="230" y="55">Ones</text><text x="148" y="80" fill="red">1</text><text x="150" y="110">2</text><text x="250" y="110">7</text><text x="120" y="145">+ 1</text><text x="250" y="145">5</text><line x1="110" y1="158" x2="280" y2="158" stroke="black"/><text x="150" y="190">4</text><text x="250" y="190">2</text>`)],
    when_to_use_this_method: { use_this_when: ["The ones column adds up to 10 or more when adding"], use_other_when: ["The ones add up to less than 10 (then no carrying is needed)"] },
    edge_cases: [ { case: "27 + 15, ones make 12", value: "carry 1, write 2", reasoning: "12 ones = 1 ten and 2 ones; write 2 in ones and carry 1 to tens, then 1+2+1 = 4 tens", where_it_appears: "2-digit addition that needs carrying" } ],
    video_script_hooks: { opening_hook: "What if the ones get too crowded and there are more than 9? We make a trade!", concept_reveal: "When 10 ones get together they become 1 ten. We carry that 1 ten over to the tens column." },
  },
  math2_ch8_carrying_borrowing: {
    key_formulas: [ { formula: "Carry when ones reach 10; borrow 1 ten = 10 ones when ones are too small", explanation: "In addition, 10 ones become 1 ten you carry up. In subtraction, if the top ones are too small, borrow 1 ten and turn it into 10 extra ones." } ],
    prerequisite_knowledge: ["Knowing 1 ten = 10 ones", "Adding and subtracting 2-digit numbers"],
    visual_description: "A subtraction 42 - 17 where 1 ten is borrowed: 4 tens become 3 tens and the 2 ones become 12 ones, so 12-7=5 and 3-1=2 giving 25.",
    svg_diagrams: [svg("math2_ch8_carrying_borrowing_diagram", "Borrow 1 ten", `<text x="20" y="26" font-weight="bold">42 - 17 = 25</text><text x="120" y="55">Tens</text><text x="230" y="55">Ones</text><text x="148" y="82" fill="red">3</text><text x="245" y="82" fill="red">12</text><text x="150" y="110">4</text><text x="250" y="110">2</text><text x="120" y="145">- 1</text><text x="250" y="145">7</text><line x1="110" y1="158" x2="290" y2="158" stroke="black"/><text x="150" y="190">2</text><text x="250" y="190">5</text>`)],
    when_to_use_this_method: { use_this_when: ["Adding and ones make 10+ (carry), or subtracting and top ones are too small (borrow)"], use_other_when: ["Ones add to less than 10 and the top ones are big enough (no carry or borrow needed)"] },
    edge_cases: [ { case: "42 - 17, ones 2 - 7 not possible", value: "borrow: 12 - 7 = 5", reasoning: "Borrow 1 ten from the 4 tens (now 3 tens), giving 12 ones; 12-7=5 and 3-1=2", where_it_appears: "2-digit subtraction that needs borrowing" } ],
    video_script_hooks: { opening_hook: "Sometimes the ones are too small to take away. Don't worry, we can borrow from the tens next door!", concept_reveal: "Carry means 10 ones become 1 ten going up. Borrow means 1 ten becomes 10 ones coming down to help." },
  },

  // ── CHAPTER 9 — Fun with Numbers (puzzles) ─────────────────────────────────
  math2_ch9_number_puzzles: {
    key_formulas: [ { formula: "Missing number rule: look at the pattern, then find the number that fits", explanation: "If numbers go up by the same step each time (2, 4, 6, _), the blank follows the same step (8)." } ],
    prerequisite_knowledge: ["Counting from 1 to 100", "Counting by 2s, 5s, and 10s"],
    visual_description: "A row of number boxes 2, 4, 6, then an empty box, with a thinking arrow pointing to the blank.",
    svg_diagrams: [svg("math2_ch9_number_puzzles_diagram", "Find the missing number", `<text x="20" y="26" font-weight="bold">What number fills the box?</text><rect x="40" y="60" width="60" height="60" fill="#dbeafe" stroke="#1e3a8a"/><text x="62" y="98">2</text><rect x="120" y="60" width="60" height="60" fill="#dbeafe" stroke="#1e3a8a"/><text x="142" y="98">4</text><rect x="200" y="60" width="60" height="60" fill="#dbeafe" stroke="#1e3a8a"/><text x="222" y="98">6</text><rect x="280" y="60" width="60" height="60" fill="#fde68a" stroke="#92400e"/><text x="300" y="98">?</text><text x="40" y="160">Add 2 each time, so the box is 8.</text>`)],
    when_to_use_this_method: { use_this_when: ["You see a row of numbers with one blank", "The numbers grow by the same step"], use_other_when: ["The numbers jump around with no pattern", "You only need to count one group of things"] },
    edge_cases: [ { case: "Pattern goes down instead of up", value: "10, 8, 6, _ = 4", reasoning: "The step can be subtract 2 just as easily as add 2.", where_it_appears: "Counting-back puzzles" } ],
    video_script_hooks: { opening_hook: "A sneaky number ran away and left an empty box! Can you catch it?", concept_reveal: "Find the secret step between the numbers, then use the same step to fill the blank." },
  },
  math2_ch9_magic_squares: {
    key_formulas: [ { formula: "Magic rule: every row and every column add up to the same total", explanation: "In a 3x3 magic square using 1 to 9, each row and each column adds to 15." } ],
    prerequisite_knowledge: ["Adding three small numbers", "Reading a grid of rows and columns"],
    visual_description: "A 3 by 3 grid filled with numbers, with little sums on the side showing each row equals 15.",
    svg_diagrams: [svg("math2_ch9_magic_squares_diagram", "Magic square adds to 15", `<text x="20" y="26" font-weight="bold">Every row &amp; column = 15</text><rect x="60" y="50" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="80" y="82">2</text><rect x="110" y="50" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="130" y="82">7</text><rect x="160" y="50" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="180" y="82">6</text><rect x="60" y="100" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="80" y="132">9</text><rect x="110" y="100" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="130" y="132">5</text><rect x="160" y="100" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="180" y="132">1</text><rect x="60" y="150" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="80" y="182">4</text><rect x="110" y="150" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="130" y="182">3</text><rect x="160" y="150" width="50" height="50" fill="#fef9c3" stroke="#444"/><text x="180" y="182">8</text><text x="240" y="82">2+7+6 = 15</text><text x="240" y="132">9+5+1 = 15</text><text x="240" y="182">4+3+8 = 15</text>`)],
    when_to_use_this_method: { use_this_when: ["You must fill a grid so every line has the same total", "You know the magic total and one number is missing"], use_other_when: ["The grid has no equal-total rule", "You are just counting, not balancing sums"] },
    edge_cases: [ { case: "One cell is blank", value: "If a row needs 15 and shows 9 + _ + 1, the blank is 5", reasoning: "Subtract the two known numbers from the total to find the missing one.", where_it_appears: "Fill-the-square puzzles" } ],
    video_script_hooks: { opening_hook: "This square has a magic spell: add any line and you always get the same number!", concept_reveal: "Place the numbers so every row and every column add up to the same total." },
  },
  math2_ch9_math_games: {
    key_formulas: [ { formula: "Game rule: do the same maths step (add or count) on every turn", explanation: "Many number games ask you to add the dice or count on by a set amount each turn." } ],
    prerequisite_knowledge: ["Adding numbers up to 20", "Counting on from a number"],
    visual_description: "A snakes-and-ladders style path of numbered squares with a token and two dice showing 3 and 4.",
    svg_diagrams: [svg("math2_ch9_math_games_diagram", "Add the dice and move", `<text x="20" y="26" font-weight="bold">Roll, add, then move!</text><rect x="40" y="60" width="50" height="50" fill="#dcfce7" stroke="#166534"/><text x="58" y="92">5</text><rect x="90" y="60" width="50" height="50" fill="#dcfce7" stroke="#166534"/><text x="108" y="92">6</text><rect x="140" y="60" width="50" height="50" fill="#dcfce7" stroke="#166534"/><text x="158" y="92">7</text><rect x="190" y="60" width="50" height="50" fill="#fde68a" stroke="#166534"/><text x="208" y="92">8</text><circle cx="360" cy="85" r="22" fill="#fff" stroke="#444"/><text x="353" y="92">3</text><circle cx="420" cy="85" r="22" fill="#fff" stroke="#444"/><text x="413" y="92">4</text><text x="40" y="160">3 + 4 = 7, so move 7 steps.</text>`)],
    when_to_use_this_method: { use_this_when: ["You play a board or dice game that needs adding", "You score points by counting on each turn"], use_other_when: ["The game has no numbers to add", "You only need to compare who is bigger, not add"] },
    edge_cases: [ { case: "Rolling a double", value: "3 and 3 means move 6", reasoning: "Two equal dice still get added together.", where_it_appears: "Dice board games" } ],
    video_script_hooks: { opening_hook: "Roll the dice and let the numbers race your token to the finish!", concept_reveal: "In number games you add or count on the same way every single turn." },
  },
  math2_ch9_crossword_numbers: {
    key_formulas: [ { formula: "Number-name rule: each number has one matching word (3 = three, 12 = twelve)", explanation: "Writing the correct word for each number lets you fill the crossword grid." } ],
    prerequisite_knowledge: ["Knowing number names from one to twenty", "Spelling simple words letter by letter"],
    visual_description: "A small crossword grid where the clue 5 is filled in as the letters F-I-V-E going across.",
    svg_diagrams: [svg("math2_ch9_crossword_numbers_diagram", "Write the number name", `<text x="20" y="26" font-weight="bold">Clue: 5 -&gt; write the word</text><rect x="60" y="60" width="45" height="45" fill="#fff" stroke="#444"/><text x="76" y="90">F</text><rect x="105" y="60" width="45" height="45" fill="#fff" stroke="#444"/><text x="121" y="90">I</text><rect x="150" y="60" width="45" height="45" fill="#fff" stroke="#444"/><text x="166" y="90">V</text><rect x="195" y="60" width="45" height="45" fill="#fff" stroke="#444"/><text x="211" y="90">E</text><text x="60" y="150">5 is spelt F-I-V-E.</text>`)],
    when_to_use_this_method: { use_this_when: ["A clue gives a number and you must write its name", "You fill grid boxes with letters of a number word"], use_other_when: ["The clue wants a digit, not a word", "You are adding numbers instead of spelling them"] },
    edge_cases: [ { case: "Two-digit number name", value: "12 = twelve (not 'oneten')", reasoning: "Teen numbers have their own special words, not just joined parts.", where_it_appears: "Number-word crosswords" } ],
    video_script_hooks: { opening_hook: "Numbers love to wear word costumes. Can you spell out their disguises?", concept_reveal: "Every number has a name word, and you write that word into the grid." },
  },

  // ── CHAPTER 10 — Addition (bigger numbers, word problems) ──────────────────
  math2_ch10_addition_3digit: {
    key_formulas: [ { formula: "Add ones to ones, tens to tens, hundreds to hundreds", explanation: "Line up the columns: e.g. 234 + 152 = 386 by adding 4+2, 3+5, 2+1." } ],
    prerequisite_knowledge: ["Place value: ones, tens, hundreds", "Adding two-digit numbers"],
    visual_description: "Two 3-digit numbers stacked with labelled H, T, O columns and the sum written below.",
    svg_diagrams: [svg("math2_ch10_addition_3digit_diagram", "Add by place value", `<text x="20" y="26" font-weight="bold">Add each column: 234 + 152</text><text x="120" y="60" font-weight="bold">H</text><text x="170" y="60" font-weight="bold">T</text><text x="220" y="60" font-weight="bold">O</text><text x="120" y="95">2</text><text x="170" y="95">3</text><text x="220" y="95">4</text><text x="95" y="130">+ 1</text><text x="170" y="130">5</text><text x="220" y="130">2</text><line x1="100" y1="145" x2="240" y2="145" stroke="#444"/><text x="120" y="180">3</text><text x="170" y="180">8</text><text x="220" y="180">6</text>`)],
    when_to_use_this_method: { use_this_when: ["You add numbers up to 999", "The numbers are written in ones, tens and hundreds"], use_other_when: ["You only have one-digit numbers", "You are taking away instead of joining"] },
    edge_cases: [ { case: "A column adds past 9 (carry)", value: "6 + 7 = 13, write 3 and carry 1 to the next column", reasoning: "Ten ones make one ten, so the extra ten moves left.", where_it_appears: "Sums like 128 + 56" } ],
    video_script_hooks: { opening_hook: "Big numbers can be added too. We just take them one column at a time!", concept_reveal: "Add the ones first, then the tens, then the hundreds, keeping each in its own column." },
  },
  math2_ch10_word_problems_add: {
    key_formulas: [ { formula: "Total = part + part", explanation: "When a story puts groups together, add the parts to find how many in all." } ],
    prerequisite_knowledge: ["Knowing addition means 'putting together'", "Reading a short story for the numbers"],
    visual_description: "A picture of 5 red apples and 3 green apples joined into one basket with the sum 5 + 3 = 8.",
    svg_diagrams: [svg("math2_ch10_word_problems_add_diagram", "Put the groups together", `<text x="20" y="26" font-weight="bold">5 apples and 3 apples in all</text><circle cx="60" cy="80" r="14" fill="#ef4444"/><circle cx="95" cy="80" r="14" fill="#ef4444"/><circle cx="130" cy="80" r="14" fill="#ef4444"/><circle cx="165" cy="80" r="14" fill="#ef4444"/><circle cx="200" cy="80" r="14" fill="#ef4444"/><circle cx="280" cy="80" r="14" fill="#22c55e"/><circle cx="315" cy="80" r="14" fill="#22c55e"/><circle cx="350" cy="80" r="14" fill="#22c55e"/><text x="60" y="150">5 + 3 = 8 apples in all.</text>`)],
    when_to_use_this_method: { use_this_when: ["The story joins groups together", "Words like 'in all', 'altogether', or 'total' appear"], use_other_when: ["The story takes some away", "The story asks how many are left"] },
    edge_cases: [ { case: "Three groups in one story", value: "2 + 3 + 4 = 9", reasoning: "You can add more than two parts to find the total.", where_it_appears: "Stories with three baskets or boxes" } ],
    video_script_hooks: { opening_hook: "A story is hiding a maths sum inside it. Let's find the numbers!", concept_reveal: "When a story joins groups together, you add the parts to find the total." },
  },
  math2_ch10_mental_math_add: {
    key_formulas: [ { formula: "Make 10 first: 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13", explanation: "Break a number to reach a friendly 10, then add what is left." } ],
    prerequisite_knowledge: ["Number pairs that make 10", "Adding tens like 20 + 30"],
    visual_description: "A number line jumping from 8 to 10, then from 10 to 13 in a second hop.",
    svg_diagrams: [svg("math2_ch10_mental_math_add_diagram", "Make 10 then add", `<text x="20" y="26" font-weight="bold">8 + 5: jump to 10 first</text><line x1="40" y1="120" x2="520" y2="120" stroke="#444"/><circle cx="120" cy="120" r="6" fill="#1e3a8a"/><text x="112" y="150">8</text><circle cx="280" cy="120" r="6" fill="#166534"/><text x="272" y="150">10</text><circle cx="440" cy="120" r="6" fill="#b91c1c"/><text x="432" y="150">13</text><text x="160" y="100">+2</text><text x="340" y="100">+3</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to add quickly in your head", "One number is close to a ten"], use_other_when: ["The numbers are very large and need writing down", "You must show full column working on paper"] },
    edge_cases: [ { case: "Add tens then ones", value: "23 + 14 = (20+10) + (3+4) = 30 + 7 = 37", reasoning: "Splitting into tens and ones makes mental adding easier.", where_it_appears: "Adding two two-digit numbers in your head" } ],
    video_script_hooks: { opening_hook: "What if you could add in your head faster than writing it down?", concept_reveal: "Jump to a friendly 10 first, then add the rest. Easy!" },
  },
  math2_ch10_adding_scores: {
    key_formulas: [ { formula: "Final score = first points + next points + ...", explanation: "Add up every score a player gets to find their grand total." } ],
    prerequisite_knowledge: ["Adding two and three numbers", "Reading a simple score table"],
    visual_description: "A score table for a player with rounds 4, 6, and 5, and a total box showing 15.",
    svg_diagrams: [svg("math2_ch10_adding_scores_diagram", "Add up the scores", `<text x="20" y="26" font-weight="bold">Add the round scores</text><rect x="60" y="50" width="120" height="40" fill="#e0e7ff" stroke="#444"/><text x="80" y="76">Round 1: 4</text><rect x="60" y="90" width="120" height="40" fill="#e0e7ff" stroke="#444"/><text x="80" y="116">Round 2: 6</text><rect x="60" y="130" width="120" height="40" fill="#e0e7ff" stroke="#444"/><text x="80" y="156">Round 3: 5</text><rect x="220" y="90" width="140" height="40" fill="#fde68a" stroke="#92400e"/><text x="238" y="116">Total: 15</text><text x="60" y="195">4 + 6 + 5 = 15 points.</text>`)],
    when_to_use_this_method: { use_this_when: ["You add points from many rounds of a game", "You find a player's grand total"], use_other_when: ["You compare who won (that is bigger/smaller)", "You take points away as a penalty"] },
    edge_cases: [ { case: "A round scores zero", value: "4 + 0 + 5 = 9", reasoning: "Adding zero does not change the total.", where_it_appears: "A missed turn in a game" } ],
    video_script_hooks: { opening_hook: "Who is winning? Let's add up everyone's points and find out!", concept_reveal: "Add all the points a player earns to get their final score." },
  },

  // ── CHAPTER 11 — Lines and Shapes ──────────────────────────────────────────
  math2_ch11_straight_curved: {
    key_formulas: [ { formula: "Rule: a straight line goes the same way without bending; a curved line bends", explanation: "A ruler draws straight lines; a bendy path like a smile is a curved line." } ],
    prerequisite_knowledge: ["Holding a pencil to draw a line", "Telling apart bent and not-bent shapes"],
    visual_description: "Two lines side by side: one perfectly straight and one curved like a smile, each labelled.",
    svg_diagrams: [svg("math2_ch11_straight_curved_diagram", "Straight vs curved", `<text x="20" y="26" font-weight="bold">Straight line and curved line</text><line x1="60" y1="100" x2="240" y2="100" stroke="#1e3a8a" stroke-width="4"/><text x="110" y="140">straight</text><polyline points="320,100 360,140 420,140 460,100" fill="none" stroke="#b91c1c" stroke-width="4"/><text x="360" y="170">curved</text>`)],
    when_to_use_this_method: { use_this_when: ["You sort lines into straight or curved", "You describe the edge of a shape"], use_other_when: ["You are measuring how long a line is", "You are counting how many lines there are"] },
    edge_cases: [ { case: "A circle's edge", value: "It is all curved, with no straight part", reasoning: "A round edge never goes straight, so it is fully curved.", where_it_appears: "Wheels, plates, and balls" } ],
    video_script_hooks: { opening_hook: "Some lines stand up straight like a soldier, and some bend like a smile!", concept_reveal: "A straight line never bends; a curved line bends as it goes." },
  },
  math2_ch11_horizontal_vertical: {
    key_formulas: [ { formula: "Rule: horizontal lines lie flat (sleeping); vertical lines stand up (standing)", explanation: "A line lying left-to-right is horizontal; a line going up-and-down is vertical." } ],
    prerequisite_knowledge: ["Knowing what a straight line is", "Knowing up/down and left/right"],
    visual_description: "A flat sleeping line drawn left to right and an upright standing line drawn top to bottom, each labelled.",
    svg_diagrams: [svg("math2_ch11_horizontal_vertical_diagram", "Sleeping and standing lines", `<text x="20" y="26" font-weight="bold">Horizontal (sleeping) &amp; vertical (standing)</text><line x1="50" y1="120" x2="230" y2="120" stroke="#166534" stroke-width="4"/><text x="80" y="155">horizontal</text><line x1="380" y1="60" x2="380" y2="180" stroke="#b91c1c" stroke-width="4"/><text x="400" y="125">vertical</text>`)],
    when_to_use_this_method: { use_this_when: ["You sort lines as flat or upright", "You describe which way a line points"], use_other_when: ["You sort lines as straight or curved instead", "You are counting corners of a shape"] },
    edge_cases: [ { case: "A slanted line", value: "It is neither horizontal nor vertical", reasoning: "A tilted line is not flat and not upright, so it is slanting.", where_it_appears: "The sloping side of a roof or a ramp" } ],
    video_script_hooks: { opening_hook: "Is the line sleeping flat or standing up tall? Let's find out!", concept_reveal: "Horizontal lines lie flat side to side; vertical lines stand straight up and down." },
  },
  math2_ch11_parallel_lines: {
    key_formulas: [ { formula: "Rule: parallel lines stay the same distance apart and never meet", explanation: "Like railway tracks, two parallel lines run side by side and never touch." } ],
    prerequisite_knowledge: ["Knowing what a straight line is", "Comparing distances (near and far)"],
    visual_description: "Two straight railway-track lines running across the page, always the same gap apart.",
    svg_diagrams: [svg("math2_ch11_parallel_lines_diagram", "Parallel lines never meet", `<text x="20" y="26" font-weight="bold">Like rail tracks: never meet</text><line x1="40" y1="90" x2="520" y2="90" stroke="#1e3a8a" stroke-width="4"/><line x1="40" y1="150" x2="520" y2="150" stroke="#1e3a8a" stroke-width="4"/><line x1="100" y1="90" x2="100" y2="150" stroke="#9ca3af" stroke-width="3"/><line x1="220" y1="90" x2="220" y2="150" stroke="#9ca3af" stroke-width="3"/><line x1="340" y1="90" x2="340" y2="150" stroke="#9ca3af" stroke-width="3"/><line x1="460" y1="90" x2="460" y2="150" stroke="#9ca3af" stroke-width="3"/><text x="200" y="185">always the same gap apart</text>`)],
    when_to_use_this_method: { use_this_when: ["You spot two lines that never touch", "Lines stay the same distance apart"], use_other_when: ["The lines cross or meet at a point", "You only have one line"] },
    edge_cases: [ { case: "Lines that meet at a corner", value: "Not parallel", reasoning: "If lines touch or cross, the gap is not the same, so they are not parallel.", where_it_appears: "The two sides of a triangle" } ],
    video_script_hooks: { opening_hook: "Railway tracks run forever side by side and never bump into each other!", concept_reveal: "Parallel lines stay the same distance apart and never meet." },
  },
  math2_ch11_shapes_from_lines: {
    key_formulas: [ { formula: "Rule: join straight lines end to end to close a shape (4 lines = square, 3 lines = triangle)", explanation: "When straight lines meet at corners and close up, they make a flat shape." } ],
    prerequisite_knowledge: ["Drawing straight lines", "Counting sides and corners"],
    visual_description: "A triangle made of 3 straight lines and a square made of 4 straight lines, with corners marked.",
    svg_diagrams: [svg("math2_ch11_shapes_from_lines_diagram", "Lines make shapes", `<text x="20" y="26" font-weight="bold">3 lines = triangle, 4 lines = square</text><polygon points="120,170 60,70 180,70" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/><text x="95" y="195">triangle</text><rect x="320" y="70" width="100" height="100" fill="#dcfce7" stroke="#166534" stroke-width="3"/><text x="345" y="195">square</text>`)],
    when_to_use_this_method: { use_this_when: ["You build a shape by joining straight lines", "You count how many lines a shape needs"], use_other_when: ["The shape has a curved edge like a circle", "You only need to sort lines, not make a shape"] },
    edge_cases: [ { case: "Lines that do not close up", value: "No shape is made", reasoning: "Lines must meet at corners and close the gap, or it stays an open path.", where_it_appears: "An open zig-zag line" } ],
    video_script_hooks: { opening_hook: "Snap straight sticks together and watch a shape pop out!", concept_reveal: "Join straight lines at their corners to close them up into a shape." },
  },

  // ── CHAPTER 12 — Subtraction (meaning, mental, link to addition) ───────────
  math2_ch12_subtraction_meaning: {
    key_formulas: [ { formula: "Left = whole - taken away", explanation: "Subtraction means taking some away and counting how many are left, e.g. 7 - 3 = 4." } ],
    prerequisite_knowledge: ["Counting a group of objects", "Knowing the minus sign means take away"],
    visual_description: "7 balloons with 3 crossed out, leaving 4 balloons and the sum 7 - 3 = 4.",
    svg_diagrams: [svg("math2_ch12_subtraction_meaning_diagram", "Take away to find what is left", `<text x="20" y="26" font-weight="bold">7 take away 3 leaves 4</text><circle cx="60" cy="90" r="14" fill="#60a5fa"/><circle cx="100" cy="90" r="14" fill="#60a5fa"/><circle cx="140" cy="90" r="14" fill="#60a5fa"/><circle cx="180" cy="90" r="14" fill="#60a5fa"/><circle cx="240" cy="90" r="14" fill="#fca5a5"/><line x1="228" y1="78" x2="252" y2="102" stroke="#b91c1c" stroke-width="3"/><circle cx="280" cy="90" r="14" fill="#fca5a5"/><line x1="268" y1="78" x2="292" y2="102" stroke="#b91c1c" stroke-width="3"/><circle cx="320" cy="90" r="14" fill="#fca5a5"/><line x1="308" y1="78" x2="332" y2="102" stroke="#b91c1c" stroke-width="3"/><text x="60" y="150">7 - 3 = 4 are left.</text>`)],
    when_to_use_this_method: { use_this_when: ["Some things are taken away from a group", "You need to know how many are left"], use_other_when: ["You are putting groups together (that is adding)", "Nothing is removed from the group"] },
    edge_cases: [ { case: "Take away all of them", value: "5 - 5 = 0", reasoning: "If you remove the whole group, none are left.", where_it_appears: "Eating all the sweets in a bag" } ],
    video_script_hooks: { opening_hook: "Three balloons floated away! How many are still in your hand?", concept_reveal: "Subtraction means taking some away and counting how many are left." },
  },
  math2_ch12_mental_math_subtract: {
    key_formulas: [ { formula: "Count back: 9 - 3 means say 8, 7, 6", explanation: "Step backwards once for each number you take away to land on the answer." } ],
    prerequisite_knowledge: ["Counting backwards from 20", "Knowing tens like 30 - 10"],
    visual_description: "A number line with three backward hops from 9 to 8 to 7 to 6.",
    svg_diagrams: [svg("math2_ch12_mental_math_subtract_diagram", "Count back to subtract", `<text x="20" y="26" font-weight="bold">9 - 3: hop back to 6</text><line x1="40" y1="120" x2="520" y2="120" stroke="#444"/><circle cx="460" cy="120" r="6" fill="#1e3a8a"/><text x="452" y="150">9</text><circle cx="380" cy="120" r="6" fill="#444"/><text x="372" y="150">8</text><circle cx="300" cy="120" r="6" fill="#444"/><text x="292" y="150">7</text><circle cx="220" cy="120" r="6" fill="#b91c1c"/><text x="212" y="150">6</text><text x="395" y="100">-1</text><text x="315" y="100">-1</text><text x="235" y="100">-1</text>`)],
    when_to_use_this_method: { use_this_when: ["You take away a small number in your head", "The number you subtract is just a few steps"], use_other_when: ["The numbers are large and need column working", "You are adding instead of taking away"] },
    edge_cases: [ { case: "Subtract tens then ones", value: "45 - 23 = (45-20) - 3 = 25 - 3 = 22", reasoning: "Take away the tens first, then the ones, to make it easier.", where_it_appears: "Subtracting two two-digit numbers in your head" } ],
    video_script_hooks: { opening_hook: "Walk your finger backwards along the number line and watch the number shrink!", concept_reveal: "To subtract, count backwards one step for each number you take away." },
  },
  math2_ch12_addition_subtraction_link: {
    key_formulas: [ { formula: "Fact family: 4 + 3 = 7, 3 + 4 = 7, 7 - 3 = 4, 7 - 4 = 3", explanation: "Adding and subtracting undo each other, so the same three numbers make four facts." } ],
    prerequisite_knowledge: ["Basic addition facts to 10", "Meaning of take away"],
    visual_description: "A triangle with 7 at the top and 4 and 3 at the bottom, showing the four linked facts beside it.",
    svg_diagrams: [svg("math2_ch12_addition_subtraction_link_diagram", "A fact family", `<text x="20" y="26" font-weight="bold">One family: 7, 4, 3</text><polygon points="150,60 90,160 210,160" fill="#fef9c3" stroke="#444" stroke-width="2"/><text x="142" y="90">7</text><text x="92" y="150">4</text><text x="195" y="150">3</text><text x="280" y="80">4 + 3 = 7</text><text x="280" y="110">3 + 4 = 7</text><text x="280" y="140">7 - 3 = 4</text><text x="280" y="170">7 - 4 = 3</text>`)],
    when_to_use_this_method: { use_this_when: ["You check a subtraction by adding back", "You write all facts from three numbers"], use_other_when: ["The three numbers do not belong together", "You only need one single sum"] },
    edge_cases: [ { case: "A doubles family", value: "5 + 5 = 10 and 10 - 5 = 5", reasoning: "When both parts are equal, the family has fewer different facts.", where_it_appears: "Doubles like 5 + 5" } ],
    video_script_hooks: { opening_hook: "Add and subtract are best friends who undo each other's tricks!", concept_reveal: "The same three numbers make a fact family of two adding and two taking-away sums." },
  },
  math2_ch12_subtraction_word_problems: {
    key_formulas: [ { formula: "Left = start - taken away; Difference = bigger - smaller", explanation: "Take-away stories subtract what is gone; 'how many more' stories subtract the smaller from the bigger." } ],
    prerequisite_knowledge: ["Meaning of subtraction", "Reading a short story for the numbers"],
    visual_description: "A picture showing 8 cookies with 3 eaten, leaving 5, and the sum 8 - 3 = 5.",
    svg_diagrams: [svg("math2_ch12_subtraction_word_problems_diagram", "Take away in a story", `<text x="20" y="26" font-weight="bold">8 cookies, 3 eaten, how many left?</text><circle cx="60" cy="90" r="14" fill="#d97706"/><circle cx="100" cy="90" r="14" fill="#d97706"/><circle cx="140" cy="90" r="14" fill="#d97706"/><circle cx="180" cy="90" r="14" fill="#d97706"/><circle cx="220" cy="90" r="14" fill="#d97706"/><circle cx="280" cy="90" r="14" fill="#fca5a5"/><line x1="268" y1="78" x2="292" y2="102" stroke="#b91c1c" stroke-width="3"/><circle cx="320" cy="90" r="14" fill="#fca5a5"/><line x1="308" y1="78" x2="332" y2="102" stroke="#b91c1c" stroke-width="3"/><circle cx="360" cy="90" r="14" fill="#fca5a5"/><line x1="348" y1="78" x2="372" y2="102" stroke="#b91c1c" stroke-width="3"/><text x="60" y="150">8 - 3 = 5 cookies left.</text>`)],
    when_to_use_this_method: { use_this_when: ["A story takes some away from a group", "A story asks 'how many more' or 'how many fewer'"], use_other_when: ["The story joins groups together (that is adding)", "Words like 'in all' or 'total' appear"] },
    edge_cases: [ { case: "How many more comparison", value: "Asha has 9, Ravi has 6, so 9 - 6 = 3 more", reasoning: "To compare two amounts, subtract the smaller from the bigger.", where_it_appears: "Stories comparing two children's things" } ],
    video_script_hooks: { opening_hook: "Someone nibbled the cookies! Can you work out how many are left?", concept_reveal: "In take-away stories you subtract what is gone; in 'how many more' stories you subtract the smaller from the bigger." },
  },

  // ── CHAPTER 13 — Measuring Length (standard units) ─────────────────────────
  math2_ch13_measuring_length: {
    key_formulas: [ { formula: "Length in centimetres = number of cm from the 0 mark to the end of the object", explanation: "We use centimetres (written cm) to measure how long small things are, like a pencil or a leaf." } ],
    prerequisite_knowledge: ["Counting numbers up to 100", "Knowing longer and shorter"],
    visual_description: "A pencil lying along a ruler with its tip at 0 cm and its end at 9 cm.",
    svg_diagrams: [svg("math2_ch13_measuring_length_diagram", "Measuring in cm", `<text x="20" y="26" font-weight="bold">A pencil is 9 cm long</text><line x1="40" y1="120" x2="440" y2="120" stroke="black" stroke-width="2"/><line x1="40" y1="110" x2="40" y2="130" stroke="black"/><line x1="440" y1="110" x2="440" y2="130" stroke="black"/><text x="34" y="150">0</text><text x="430" y="150">9</text><rect x="40" y="80" width="400" height="14" fill="orange" stroke="black"/><polygon points="440,80 460,87 440,94" fill="brown"/><text x="180" y="180">cm = centimetre</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to know how long a small object is", "Measuring a pencil, crayon, or your hand"], use_other_when: ["The thing is very long, like a room — then use metres"] },
    edge_cases: [ { case: "Object does not start at 0", value: "Wrong reading", reasoning: "If the object starts at 1 and ends at 8, its length is 8 - 1 = 7 cm, not 8 cm.", where_it_appears: "When the object is not lined up at the 0 mark." } ],
    video_script_hooks: { opening_hook: "How long is your pencil? Let's find out using a ruler!", concept_reveal: "We count the centimetres from 0 to the end of the object. That number is its length." },
  },
  math2_ch13_ruler_use: {
    key_formulas: [ { formula: "Rule: Put the 0 mark at one end of the object, then read the number at the other end.", explanation: "Always start at 0, not at the edge of the ruler, because the 0 is where measuring begins." } ],
    prerequisite_knowledge: ["Reading numbers on a ruler", "Knowing what a centimetre is"],
    visual_description: "A ruler with an arrow pointing to the 0 mark where the object must start.",
    svg_diagrams: [svg("math2_ch13_ruler_use_diagram", "Start at 0", `<text x="20" y="26" font-weight="bold">Always start at the 0 mark</text><line x1="40" y1="110" x2="500" y2="110" stroke="black" stroke-width="2"/><line x1="40" y1="100" x2="40" y2="120" stroke="black"/><text x="34" y="140">0</text><line x1="500" y1="100" x2="500" y2="120" stroke="black"/><text x="490" y="140">10</text><rect x="40" y="78" width="320" height="16" fill="green" stroke="black"/><text x="20" y="170">Object end is at 8, so it is 8 cm long.</text><line x1="40" y1="60" x2="40" y2="78" stroke="red" stroke-width="2"/><polygon points="40,60 34,70 46,70" fill="red"/>`)],
    when_to_use_this_method: { use_this_when: ["Every time you measure with a ruler", "When lining up an object to read its length"], use_other_when: ["You only want to guess the length by looking — then no ruler is needed"] },
    edge_cases: [ { case: "Starting at the ruler's edge instead of 0", value: "Wrong length", reasoning: "Many rulers have a small gap before the 0 mark, so starting at the edge gives a length that is too big.", where_it_appears: "When children line the object with the ruler's edge instead of the 0 line." } ],
    video_script_hooks: { opening_hook: "Where do we start when we measure? At the very edge? No — at the 0!", concept_reveal: "Line up one end of the object with 0, then read the number at the other end." },
  },
  math2_ch13_cm_and_m: {
    key_formulas: [ { formula: "1 m = 100 cm", explanation: "One metre is the same as 100 centimetres. A metre is much longer than a centimetre." } ],
    prerequisite_knowledge: ["Counting in tens up to 100", "Knowing what a centimetre is"],
    visual_description: "A short 1 cm line next to a long bar labelled 1 m = 100 cm.",
    svg_diagrams: [svg("math2_ch13_cm_and_m_diagram", "cm and m", `<text x="20" y="26" font-weight="bold">1 m = 100 cm</text><line x1="40" y1="70" x2="60" y2="70" stroke="black" stroke-width="4"/><text x="65" y="75">1 cm (small)</text><rect x="40" y="110" width="480" height="18" fill="skyblue" stroke="black"/><text x="40" y="160">1 m (big) = 100 cm</text><text x="20" y="185">cm for small things, m for big things</text>`)],
    when_to_use_this_method: { use_this_when: ["Choosing the right unit for what you measure", "Changing a measurement between cm and m"], use_other_when: ["Both lengths use the same unit already — then no changing is needed"] },
    edge_cases: [ { case: "Using cm for a very long thing", value: "Hard to count", reasoning: "A room is about 500 cm long, which is a big number; saying 5 m is easier.", where_it_appears: "When measuring big things like a room or a playground." } ],
    video_script_hooks: { opening_hook: "Would you measure your classroom in tiny centimetres? That would take forever!", concept_reveal: "We use cm for small things and m for big things. And 1 m is 100 cm." },
  },
  math2_ch13_comparing_lengths: {
    key_formulas: [ { formula: "Rule: The object with the bigger length number is longer; the smaller number is shorter.", explanation: "When lengths use the same unit, just compare the numbers to see which is longer or shorter." } ],
    prerequisite_knowledge: ["Comparing numbers (bigger and smaller)", "Measuring length in cm"],
    visual_description: "Three bars of different lengths arranged from shortest to longest.",
    svg_diagrams: [svg("math2_ch13_comparing_lengths_diagram", "Order by length", `<text x="20" y="26" font-weight="bold">Shortest to longest</text><rect x="40" y="50" width="120" height="16" fill="pink" stroke="black"/><text x="170" y="63">3 cm</text><rect x="40" y="90" width="240" height="16" fill="violet" stroke="black"/><text x="290" y="103">6 cm</text><rect x="40" y="130" width="360" height="16" fill="purple" stroke="black"/><text x="410" y="143">9 cm</text><text x="20" y="180">3 cm &lt; 6 cm &lt; 9 cm</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to find which thing is longer or shorter", "Putting things in order by length"], use_other_when: ["The lengths use different units — first make them the same unit"] },
    edge_cases: [ { case: "Comparing cm with m", value: "Confusing", reasoning: "2 m is longer than 50 cm even though 50 is a bigger number, because 2 m = 200 cm.", where_it_appears: "When two lengths use different units." } ],
    video_script_hooks: { opening_hook: "Whose pencil is the longest in class? Let's line them up and see!", concept_reveal: "With the same unit, the bigger number is the longer one. Order them from small to big." },
  },

  // ── CHAPTER 14 — Data Handling (collecting & reading) ──────────────────────
  math2_ch14_data_collection: {
    key_formulas: [ { formula: "Rule: To collect data, ask or count, then write down what you find.", explanation: "Data means little bits of information, like how many friends like each fruit. We gather it by asking or counting." } ],
    prerequisite_knowledge: ["Counting objects", "Writing numbers"],
    visual_description: "A child asking friends their favourite fruit while writing the answers in a list.",
    svg_diagrams: [svg("math2_ch14_data_collection_diagram", "Collecting data", `<text x="20" y="26" font-weight="bold">Ask and write it down</text><text x="40" y="70">Apple .... 4</text><text x="40" y="100">Banana ... 3</text><text x="40" y="130">Mango .... 5</text><circle cx="420" cy="90" r="20" fill="peachpuff" stroke="black"/><text x="380" y="140">a friend</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to find out something from many people", "Counting how many of each kind there are"], use_other_when: ["You already have the numbers written down — then just read them"] },
    edge_cases: [ { case: "Forgetting to write an answer", value: "Wrong total", reasoning: "If you miss one friend's answer, your counts will be too small.", where_it_appears: "When collecting data from many people quickly." } ],
    video_script_hooks: { opening_hook: "Want to know which fruit your class loves most? You become a detective!", concept_reveal: "We collect data by asking everyone and writing down each answer carefully." },
  },
  math2_ch14_tally_marks: {
    key_formulas: [ { formula: "Rule: Draw one line for each item; the 5th line crosses the first four, making a bundle of 5.", explanation: "Tally marks help us count by making groups of 5, which are easy to count quickly." } ],
    prerequisite_knowledge: ["Counting in fives", "One-to-one counting"],
    visual_description: "A group of four upright lines with a fifth line crossing them to show five.",
    svg_diagrams: [svg("math2_ch14_tally_marks_diagram", "Tally marks", `<text x="20" y="26" font-weight="bold">A bundle of 5</text><line x1="60" y1="60" x2="60" y2="120" stroke="black" stroke-width="3"/><line x1="80" y1="60" x2="80" y2="120" stroke="black" stroke-width="3"/><line x1="100" y1="60" x2="100" y2="120" stroke="black" stroke-width="3"/><line x1="120" y1="60" x2="120" y2="120" stroke="black" stroke-width="3"/><line x1="50" y1="120" x2="130" y2="60" stroke="black" stroke-width="3"/><text x="60" y="150">= 5</text><text x="200" y="95">The 5th line crosses the first four.</text>`)],
    when_to_use_this_method: { use_this_when: ["Counting things one by one as they happen", "Keeping a quick count without numbers"], use_other_when: ["You already know the total number — then just write the number"] },
    edge_cases: [ { case: "Six items", value: "One bundle of 5 and 1 extra line", reasoning: "After five (the crossed bundle), the sixth starts a new line, so it looks like a bundle plus one.", where_it_appears: "When the count goes past five." } ],
    video_script_hooks: { opening_hook: "Counting lots of things? Make them into neat little bundles of five!", concept_reveal: "One line for each thing, and the fifth line crosses the others to make a group of 5." },
  },
  math2_ch14_pictographs: {
    key_formulas: [ { formula: "Rule: Count the pictures; if one picture stands for 1, the number of pictures is the amount.", explanation: "A pictograph uses pictures to show data. Each picture can stand for one item (or more, if it says so)." } ],
    prerequisite_knowledge: ["Counting pictures", "Reading a simple key"],
    visual_description: "Rows of apple pictures, one row per fruit, where each apple stands for one fruit.",
    svg_diagrams: [svg("math2_ch14_pictographs_diagram", "Reading a pictograph", `<text x="20" y="26" font-weight="bold">Each circle = 1 fruit</text><text x="20" y="70">Apple</text><circle cx="120" cy="65" r="10" fill="red"/><circle cx="150" cy="65" r="10" fill="red"/><circle cx="180" cy="65" r="10" fill="red"/><text x="20" y="110">Mango</text><circle cx="120" cy="105" r="10" fill="orange"/><circle cx="150" cy="105" r="10" fill="orange"/><text x="20" y="150">Apple = 3, Mango = 2</text>`)],
    when_to_use_this_method: { use_this_when: ["A graph shows data using pictures", "You need to count how many of each kind"], use_other_when: ["The graph uses bars instead of pictures — then read the bar graph"] },
    edge_cases: [ { case: "One picture stands for more than 1", value: "Multiply, do not just count", reasoning: "If the key says one picture = 2, then 3 pictures mean 6, not 3.", where_it_appears: "When the pictograph key gives a value bigger than 1." } ],
    video_script_hooks: { opening_hook: "What if pictures could tell you a number? They can — that's a pictograph!", concept_reveal: "Each picture stands for items. Count the pictures to find how many there are." },
  },
  math2_ch14_bar_graphs: {
    key_formulas: [ { formula: "Rule: The taller (or longer) the bar, the more it stands for.", explanation: "A bar graph uses bars of different heights to show data. A taller bar means a bigger number." } ],
    prerequisite_knowledge: ["Comparing heights (taller and shorter)", "Reading numbers on a scale"],
    visual_description: "Three vertical bars of different heights, with the tallest bar showing the most.",
    svg_diagrams: [svg("math2_ch14_bar_graphs_diagram", "Reading a bar graph", `<text x="20" y="26" font-weight="bold">Taller bar = more</text><line x1="60" y1="40" x2="60" y2="160" stroke="black" stroke-width="2"/><line x1="60" y1="160" x2="500" y2="160" stroke="black" stroke-width="2"/><rect x="90" y="100" width="60" height="60" fill="skyblue" stroke="black"/><text x="100" y="180">Cat 3</text><rect x="200" y="60" width="60" height="100" fill="lightgreen" stroke="black"/><text x="205" y="180">Dog 5</text><rect x="310" y="120" width="60" height="40" fill="pink" stroke="black"/><text x="315" y="180">Fish 2</text>`)],
    when_to_use_this_method: { use_this_when: ["A graph shows data with bars", "You want to quickly see which has the most"], use_other_when: ["The graph uses pictures — then read the pictograph"] },
    edge_cases: [ { case: "Two bars the same height", value: "Equal amounts", reasoning: "If two bars are exactly as tall, those two things have the same number.", where_it_appears: "When two groups have the same count." } ],
    video_script_hooks: { opening_hook: "Which is taller — and which has more? In a bar graph, that's the same question!", concept_reveal: "Each bar's height shows the number. The taller the bar, the more there is." },
  },

  // ── CHAPTER 15 — Working with Data (sorting, making, interpreting) ─────────
  math2_ch15_sorting_data: {
    key_formulas: [ { formula: "Rule: Put things that are alike into the same group.", explanation: "Sorting means grouping things by something they share, like colour, size, or type." } ],
    prerequisite_knowledge: ["Knowing colours, shapes, and sizes", "Telling things apart"],
    visual_description: "Mixed shapes being separated into a circle group and a square group.",
    svg_diagrams: [svg("math2_ch15_sorting_data_diagram", "Sorting by shape", `<text x="20" y="26" font-weight="bold">Group the same shapes</text><text x="60" y="60">Circles</text><circle cx="70" cy="100" r="12" fill="yellow" stroke="black"/><circle cx="110" cy="100" r="12" fill="yellow" stroke="black"/><circle cx="150" cy="100" r="12" fill="yellow" stroke="black"/><text x="320" y="60">Squares</text><rect x="320" y="88" width="24" height="24" fill="lightblue" stroke="black"/><rect x="360" y="88" width="24" height="24" fill="lightblue" stroke="black"/>`)],
    when_to_use_this_method: { use_this_when: ["Things are mixed up and need grouping", "Before counting how many of each kind"], use_other_when: ["The things are already in groups — then just count them"] },
    edge_cases: [ { case: "A thing fits two groups", value: "Pick one clear rule", reasoning: "A red circle could go with red things or with circles; decide one sorting rule first.", where_it_appears: "When objects share more than one feature." } ],
    video_script_hooks: { opening_hook: "All your toys in one big pile? Let's sort them into neat groups!", concept_reveal: "Sorting means putting things that are alike together, like all the circles in one group." },
  },
  math2_ch15_making_graphs: {
    key_formulas: [ { formula: "Rule: Draw one picture (or one block of bar) for each thing you counted.", explanation: "To make a graph, turn your counts into pictures or bars so others can see the data easily." } ],
    prerequisite_knowledge: ["Counting each group", "Drawing simple pictures or bars"],
    visual_description: "A count of fruits being turned into a small bar graph, one block per fruit.",
    svg_diagrams: [svg("math2_ch15_making_graphs_diagram", "Making a graph", `<text x="20" y="26" font-weight="bold">Turn counts into bars</text><text x="20" y="60">Apple = 4, Mango = 2</text><line x1="60" y1="80" x2="60" y2="170" stroke="black" stroke-width="2"/><line x1="60" y1="170" x2="420" y2="170" stroke="black" stroke-width="2"/><rect x="90" y="90" width="50" height="80" fill="red" stroke="black"/><text x="95" y="188">Apple</text><rect x="190" y="130" width="50" height="40" fill="orange" stroke="black"/><text x="195" y="188">Mango</text>`)],
    when_to_use_this_method: { use_this_when: ["You have counts and want to show them clearly", "Making your own pictograph or bar graph"], use_other_when: ["A graph is already drawn for you — then just read it"] },
    edge_cases: [ { case: "Bars not the right height", value: "Wrong picture", reasoning: "If a count of 4 is drawn shorter than a count of 2, the graph fools the reader.", where_it_appears: "When drawing bars without matching them to the counts." } ],
    video_script_hooks: { opening_hook: "You counted everyone's favourite fruit — now let's draw it so everyone can see!", concept_reveal: "We make a graph by drawing one picture or one bar block for each thing counted." },
  },
  math2_ch15_interpreting_data: {
    key_formulas: [ { formula: "Rule: Read the table — the biggest number is the most, the smallest number is the least.", explanation: "A table shows data in rows. To answer questions, find the row with the most, least, or add for the total." } ],
    prerequisite_knowledge: ["Reading rows in a table", "Comparing and adding numbers"],
    visual_description: "A small table with fruit names and counts, with the biggest count circled as the most.",
    svg_diagrams: [svg("math2_ch15_interpreting_data_diagram", "Reading a table", `<text x="20" y="26" font-weight="bold">Most and least</text><rect x="40" y="40" width="200" height="100" fill="none" stroke="black"/><line x1="40" y1="73" x2="240" y2="73" stroke="black"/><line x1="40" y1="106" x2="240" y2="106" stroke="black"/><line x1="140" y1="40" x2="140" y2="140" stroke="black"/><text x="55" y="63">Apple</text><text x="180" y="63">4</text><text x="55" y="96">Mango</text><text x="180" y="96">7</text><text x="55" y="129">Pear</text><text x="180" y="129">2</text><circle cx="185" cy="91" r="15" fill="none" stroke="red" stroke-width="2"/><text x="270" y="96">7 is the most</text>`)],
    when_to_use_this_method: { use_this_when: ["A table of data is given to read", "You must answer most, least, or total questions"], use_other_when: ["You still need to collect the data — then go and count it first"] },
    edge_cases: [ { case: "Finding the total", value: "Add all the rows", reasoning: "The total is not the biggest number; you must add every count together, like 4 + 7 + 2 = 13.", where_it_appears: "When asked how many there are altogether." } ],
    video_script_hooks: { opening_hook: "A table is like a treasure map of numbers. Can you find the most?", concept_reveal: "We read each row to find the biggest, the smallest, or add them all for the total." },
  },
  math2_ch15_survey_data: {
    key_formulas: [ { formula: "Survey steps: ask a question, collect each answer with a tally, then count the totals", explanation: "A survey is a way to gather data — you ask everyone the same question and keep a tally of their answers, then count up each group." } ],
    prerequisite_knowledge: ["Using tally marks to keep a count", "Counting and comparing numbers"],
    visual_description: "A child asking 'Which fruit do you like?' with a tally table filling up: Apple, Mango, Banana, each with tally marks beside it.",
    svg_diagrams: [svg("math2_ch15_survey_data_diagram", "Doing a survey", `<text x="20" y="26" font-weight="bold">Ask, tally, then count</text><text x="40" y="65">Question: favourite fruit?</text><text x="60" y="100">Apple</text><text x="180" y="100">|||| = 4</text><text x="60" y="135">Mango</text><text x="180" y="135">|||| || = 7</text><text x="60" y="170">Banana</text><text x="180" y="170">||| = 3</text>`)],
    when_to_use_this_method: { use_this_when: ["You want to find out what a whole group likes or thinks", "You ask the same question to many people and record answers"], use_other_when: ["The data is already collected — then just read or sort it", "You only have one person's answer, not a group"] },
    edge_cases: [ { case: "Everyone must be asked once", value: "ask each person a single time", reasoning: "If you ask one friend twice, that answer is counted too many times and the survey is unfair.", where_it_appears: "Surveying a class about favourite fruits or games" } ],
    video_script_hooks: { opening_hook: "Want to know what your whole class loves most? Be a survey star and ask everyone!", concept_reveal: "A survey means asking everyone the same question, keeping a tally of answers, then counting up each group." },
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
run().catch((e) => { console.error("enrichMath2 failed:", e.message); process.exit(1); });
