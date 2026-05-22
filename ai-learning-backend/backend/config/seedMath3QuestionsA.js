/**
 * CBSE Class 3 Mathematics — MCQ seed (Part A: Ch 1–7)
 * 5 questions per chapter = 35 total. Safe to re-run.
 * Usage: node config/seedMath3QuestionsA.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Chapter 1: Where to Look From ─────────────────────────────────────────
  {
    questionId: "math3_ch1_q1", topicId: "math3_ch1",
    text: "You look at a round ball from directly above. What shape do you see?",
    options: [
      { text: "Circle",    type: "correct",       logicTag: "top view of a sphere is a circle" },
      { text: "Triangle",  type: "concept_error", logicTag: "triangles are not related to sphere top views" },
      { text: "Rectangle", type: "concept_error", logicTag: "rectangles appear in box top views, not spheres" },
      { text: "Oval",      type: "concept_error", logicTag: "an oval appears when viewing at an angle, not from directly above" },
    ],
    explanation: "Looking straight down at a sphere gives a perfect circle. An oval would appear only if you viewed from a slight angle.",
    solutionSteps: ["Stand directly above the ball.", "Look straight down — the outline is circular.", "Top view of a sphere = circle."],
    shortcut: "When looking straight down at any round object, the outline is always a circle.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Where to Look From",
  },
  {
    questionId: "math3_ch1_q2", topicId: "math3_ch1",
    text: "A book is placed flat on a table. What does it look like from the side?",
    options: [
      { text: "A thin rectangle",  type: "correct",       logicTag: "side view shows the book's length and thin thickness" },
      { text: "A square",          type: "concept_error", logicTag: "a square requires equal sides; a book's length ≠ thickness" },
      { text: "A circle",          type: "concept_error", logicTag: "circles don't appear in the side view of a rectangular book" },
      { text: "A wide rectangle",  type: "concept_error", logicTag: "the wide rectangle is the top view, not the side view" },
    ],
    explanation: "From the side, you see the book's length and its thin thickness — a very thin, wide rectangle.",
    solutionSteps: ["A flat book is a thin rectangular object.", "From the side, you see its long dimension and thin height.", "This gives a thin rectangle."],
    shortcut: "Side view of a flat object always reveals its thinnest dimension.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Where to Look From",
  },
  {
    questionId: "math3_ch1_q3", topicId: "math3_ch1",
    text: "From which viewpoint does a cylinder look like a rectangle?",
    options: [
      { text: "Side view",   type: "correct",       logicTag: "from the side a cylinder shows its height and diameter as a rectangle" },
      { text: "Top view",    type: "concept_error", logicTag: "top view of a cylinder is a circle" },
      { text: "Bottom view", type: "concept_error", logicTag: "bottom view of a cylinder is also a circle" },
      { text: "All views",   type: "concept_error", logicTag: "only the side view gives a rectangle" },
    ],
    explanation: "The side view of a cylinder shows a rectangle (width = diameter, height = cylinder's height). Top and bottom views show circles.",
    solutionSteps: ["Top view → circle.", "Side view → rectangle.", "Side view gives a rectangle."],
    shortcut: "Cylinder: top = circle, side = rectangle. Always.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Where to Look From",
  },
  {
    questionId: "math3_ch1_q4", topicId: "math3_ch1",
    text: "A cone viewed from the top looks like:",
    options: [
      { text: "A circle",    type: "correct",       logicTag: "top view of a cone shows the circular base" },
      { text: "A triangle",  type: "concept_error", logicTag: "a triangle is the side view of a cone, not the top view" },
      { text: "A rectangle", type: "concept_error", logicTag: "rectangles come from box views, not cone top views" },
      { text: "A pentagon",  type: "guessing",      logicTag: "pentagons are not related to cones" },
    ],
    explanation: "Looking straight down at a cone you see its circular base. Top view of a cone = circle (with a dot at centre for the tip).",
    solutionSteps: ["Look down at the cone from above.", "You see the wide circular base.", "Top view = circle."],
    shortcut: "Top view of cone = circle. Side view of cone = triangle.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Where to Look From",
  },
  {
    questionId: "math3_ch1_q5", topicId: "math3_ch1",
    text: "When you look at a cube from the front, the shape you see is:",
    options: [
      { text: "A square",    type: "correct",       logicTag: "all faces of a cube are equal squares" },
      { text: "A rectangle", type: "concept_error", logicTag: "rectangles appear in cuboid (not cube) views" },
      { text: "A triangle",  type: "concept_error", logicTag: "triangles are not a face shape of a cube" },
      { text: "A hexagon",   type: "concept_error", logicTag: "hexagons appear in some 3D projections but not basic front views" },
    ],
    explanation: "A cube has six identical square faces. Looking at any face directly gives a square.",
    solutionSteps: ["A cube has all equal sides.", "Each face is a perfect square.", "Front view = square."],
    shortcut: "Cube → square from every direction. Cuboid → rectangles.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Where to Look From",
  },

  // ── Chapter 2: Fun with Numbers ────────────────────────────────────────────
  {
    questionId: "math3_ch2_q1", topicId: "math3_ch2",
    text: "What is the place value of 5 in the number 537?",
    options: [
      { text: "500",  type: "correct",           logicTag: "5 is in the hundreds place: 5 × 100 = 500" },
      { text: "5",    type: "concept_error",     logicTag: "5 is the face value; the place value in hundreds = 500" },
      { text: "50",   type: "calculation_error", logicTag: "50 is the place value when 5 is in the tens position" },
      { text: "5000", type: "concept_error",     logicTag: "5000 would require 5 in a 4-digit number's thousands place" },
    ],
    explanation: "In 537, digit 5 is in the hundreds place. Place value = 5 × 100 = 500.",
    solutionSteps: ["537: H=5, T=3, O=7.", "Digit 5 is in the hundreds place.", "Place value = 5 × 100 = 500."],
    shortcut: "Hundreds digit × 100, tens digit × 10, ones digit × 1.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Fun with Numbers",
  },
  {
    questionId: "math3_ch2_q2", topicId: "math3_ch2",
    text: "Which number is the greatest among 709, 790, 907, and 970?",
    options: [
      { text: "970", type: "correct",           logicTag: "970 has 9 hundreds and 7 tens — largest" },
      { text: "907", type: "calculation_error", logicTag: "907 also has 9 hundreds but only 0 tens: less than 970" },
      { text: "790", type: "calculation_error", logicTag: "790 has only 7 hundreds — smaller than 9__ numbers" },
      { text: "709", type: "calculation_error", logicTag: "709 is the smallest here" },
    ],
    explanation: "Compare hundreds: 907 and 970 both have 9 hundreds. Compare tens: 970 (7 tens) > 907 (0 tens). Greatest = 970.",
    solutionSteps: ["Hundreds: 907=9, 970=9, 790=7, 709=7.", "Among 9XX: tens: 970(7) > 907(0).", "Greatest = 970."],
    shortcut: "Compare left to right, one digit at a time.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Fun with Numbers",
  },
  {
    questionId: "math3_ch2_q3", topicId: "math3_ch2",
    text: "What number is the same as 400 + 60 + 3?",
    options: [
      { text: "463",  type: "correct",       logicTag: "400+60+3 = 463 in standard form" },
      { text: "4063", type: "concept_error", logicTag: "placing zeros incorrectly gives a 4-digit number" },
      { text: "406",  type: "concept_error", logicTag: "406 would be 400+0+6, wrong placement" },
      { text: "4603", type: "concept_error", logicTag: "4603 is a 4-digit number — too large" },
    ],
    explanation: "Expanded form: 4 hundreds, 6 tens, 3 ones → 463.",
    solutionSteps: ["400 → hundreds digit = 4.", "60 → tens digit = 6.", "3 → ones digit = 3.", "Combined: 463."],
    shortcut: "Number of zeros in each term tells you the place: 400 has 2 zeros → hundreds.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Fun with Numbers",
  },
  {
    questionId: "math3_ch2_q4", topicId: "math3_ch2",
    text: "How many hundreds are in the number 850?",
    options: [
      { text: "8",  type: "correct",       logicTag: "8 is in the hundreds place of 850" },
      { text: "85", type: "concept_error", logicTag: "85 is the number formed by first two digits, not the hundreds count" },
      { text: "5",  type: "concept_error", logicTag: "5 is the tens digit, not the hundreds digit" },
      { text: "80", type: "concept_error", logicTag: "80 would be the tens count" },
    ],
    explanation: "In 850: H=8, T=5, O=0. There are 8 hundreds in 850.",
    solutionSteps: ["Place-value chart: H=8, T=5, O=0.", "Hundreds digit = 8."],
    shortcut: "The hundreds digit is always the leftmost digit in a 3-digit number.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Fun with Numbers",
  },
  {
    questionId: "math3_ch2_q5", topicId: "math3_ch2",
    text: "What number comes just before 400?",
    options: [
      { text: "399", type: "correct",           logicTag: "399 is exactly one less than 400" },
      { text: "401", type: "concept_error",     logicTag: "401 comes just AFTER 400" },
      { text: "390", type: "calculation_error", logicTag: "390 is 10 before 400, not 1 before" },
      { text: "300", type: "concept_error",     logicTag: "300 is 100 before 400" },
    ],
    explanation: "Just before N = N − 1. Before 400 = 399.",
    solutionSteps: ["Just before = subtract 1.", "400 − 1 = 399."],
    shortcut: "Just before = −1. Just after = +1.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Fun with Numbers",
  },

  // ── Chapter 3: Give and Take ───────────────────────────────────────────────
  {
    questionId: "math3_ch3_q1", topicId: "math3_ch3",
    text: "What is 256 + 138?",
    options: [
      { text: "394", type: "correct",           logicTag: "ones 6+8=14 write 4 carry 1; tens 5+3+1=9; hundreds 2+1=3 → 394" },
      { text: "384", type: "calculation_error", logicTag: "forgot to carry the 1 from the ones column" },
      { text: "494", type: "calculation_error", logicTag: "carried incorrectly into the hundreds" },
      { text: "364", type: "calculation_error", logicTag: "error in the ones column sum" },
    ],
    explanation: "Ones: 6+8=14, write 4 carry 1. Tens: 5+3+1=9. Hundreds: 2+1=3. Answer: 394.",
    solutionSteps: ["Ones: 6+8=14 → write 4, carry 1.", "Tens: 5+3+1=9.", "Hundreds: 2+1=3.", "Answer: 394."],
    shortcut: "Always add from right to left and remember to include the carry.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Give and Take",
  },
  {
    questionId: "math3_ch3_q2", topicId: "math3_ch3",
    text: "What is 500 − 237?",
    options: [
      { text: "263", type: "correct",           logicTag: "borrow chain from hundreds gives 263" },
      { text: "273", type: "calculation_error", logicTag: "error in the ones column after borrowing" },
      { text: "363", type: "calculation_error", logicTag: "forgot to reduce hundreds after borrowing" },
      { text: "237", type: "concept_error",     logicTag: "copied the subtrahend instead of computing" },
    ],
    explanation: "Borrow chain: hundreds→tens→ones. Ones=10−7=3, Tens=9−3=6, Hundreds=4−2=2. Answer: 263.",
    solutionSteps: ["Ones: 0<7, borrow chain. After borrowing: ones=10, tens=9, hundreds=4.", "Ones: 10−7=3. Tens: 9−3=6. Hundreds: 4−2=2.", "Answer: 263."],
    shortcut: "Verify: 263+237=500 ✓",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Give and Take",
  },
  {
    questionId: "math3_ch3_q3", topicId: "math3_ch3",
    text: "Ravi had 435 stamps and gave away 162. How many stamps does he have now?",
    options: [
      { text: "273", type: "correct",           logicTag: "435−162=273" },
      { text: "597", type: "concept_error",     logicTag: "added instead of subtracted" },
      { text: "283", type: "calculation_error", logicTag: "error in the tens column" },
      { text: "263", type: "calculation_error", logicTag: "error in the ones or hundreds column" },
    ],
    explanation: "Gave away → subtract. 435−162: ones 5−2=3, tens 3<6 borrow: 13−6=7, hundreds 3−1=2. Answer: 273.",
    solutionSteps: ["Operation: subtract (gave away).", "Ones: 5−2=3. Tens: 3<6→borrow: 13−6=7. Hundreds: 3−1=2.", "Answer: 273."],
    shortcut: "Gave away/spent/lost → subtract.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Give and Take",
  },
  {
    questionId: "math3_ch3_q4", topicId: "math3_ch3",
    text: "What is 178 + 246?",
    options: [
      { text: "424", type: "correct",           logicTag: "ones 8+6=14 carry 1; tens 7+4+1=12 carry 1; hundreds 1+2+1=4 → 424" },
      { text: "414", type: "calculation_error", logicTag: "forgot carry into hundreds" },
      { text: "434", type: "calculation_error", logicTag: "error in tens column" },
      { text: "324", type: "calculation_error", logicTag: "error in hundreds column" },
    ],
    explanation: "Ones: 8+6=14, write 4 carry 1. Tens: 7+4+1=12, write 2 carry 1. Hundreds: 1+2+1=4. Answer: 424.",
    solutionSteps: ["Ones: 8+6=14 → write 4, carry 1.", "Tens: 7+4+1=12 → write 2, carry 1.", "Hundreds: 1+2+1=4.", "Answer: 424."],
    shortcut: "Double-carry: carry from ones to tens, then from tens to hundreds.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Give and Take",
  },
  {
    questionId: "math3_ch3_q5", topicId: "math3_ch3",
    text: "What is 700 − 358?",
    options: [
      { text: "342", type: "correct",           logicTag: "700−358=342" },
      { text: "352", type: "calculation_error", logicTag: "error in ones after borrowing" },
      { text: "432", type: "calculation_error", logicTag: "error in tens column" },
      { text: "442", type: "calculation_error", logicTag: "error in borrowing chain" },
    ],
    explanation: "Borrow chain: ones=10−8=2, tens=9−5=4, hundreds=6−3=3. Answer: 342.",
    solutionSteps: ["Ones: 0<8, borrow chain from hundreds.", "Ones: 10−8=2. Tens: 9−5=4. Hundreds: 6−3=3.", "Answer: 342."],
    shortcut: "Verify: 342+358=700 ✓",
    difficulty: "hard", subject: "Mathematics", grade: "3", chapter: "Give and Take",
  },

  // ── Chapter 4: Long and Short ─────────────────────────────────────────────
  {
    questionId: "math3_ch4_q1", topicId: "math3_ch4",
    text: "1 metre = _____ centimetres",
    options: [
      { text: "100",  type: "correct",       logicTag: "1 m = 100 cm by definition" },
      { text: "10",   type: "concept_error", logicTag: "1 dm = 10 cm; 1 m = 100 cm" },
      { text: "1000", type: "concept_error", logicTag: "1000 cm = 10 m, not 1 m" },
      { text: "12",   type: "guessing",      logicTag: "12 inches = 1 foot (imperial, not metric)" },
    ],
    explanation: "1 metre = 100 centimetres. 'Centi' means one-hundredth, so 100 centimetres = 1 metre.",
    solutionSteps: ["1 m = 100 cm (standard metric)."],
    shortcut: "m × 100 = cm.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Long and Short",
  },
  {
    questionId: "math3_ch4_q2", topicId: "math3_ch4",
    text: "3 m 25 cm = _____ cm",
    options: [
      { text: "325",  type: "correct",           logicTag: "3×100 + 25 = 325 cm" },
      { text: "3025", type: "concept_error",     logicTag: "concatenated digits without converting" },
      { text: "3250", type: "calculation_error", logicTag: "multiplied by 1000 instead of 100" },
      { text: "35",   type: "calculation_error", logicTag: "added digits without unit conversion" },
    ],
    explanation: "3 m = 300 cm. Add 25 cm: 300+25 = 325 cm.",
    solutionSteps: ["3 m = 3 × 100 = 300 cm.", "300 + 25 = 325 cm."],
    shortcut: "m to cm: multiply by 100, then add remaining cm.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Long and Short",
  },
  {
    questionId: "math3_ch4_q3", topicId: "math3_ch4",
    text: "Where should you place the ruler when measuring an object?",
    options: [
      { text: "0 mark aligned with one end of the object",  type: "correct",       logicTag: "0 mark is the starting point" },
      { text: "1 mark aligned with one end of the object",  type: "concept_error", logicTag: "starting from 1 gives a reading 1 cm too short" },
      { text: "Middle of the ruler",                        type: "concept_error", logicTag: "the middle gives a meaningless reading" },
      { text: "Edge of the ruler (not the 0 mark)",         type: "concept_error", logicTag: "the edge may not be at 0; always use the 0 mark" },
    ],
    explanation: "Always align the 0 mark with one end of the object. Read the number at the other end.",
    solutionSteps: ["Place 0 mark at one end.", "Read the number at the other end.", "That is the length."],
    shortcut: "0 mark = start. Any other start gives a wrong answer.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Long and Short",
  },
  {
    questionId: "math3_ch4_q4", topicId: "math3_ch4",
    text: "Which is longer — 2 m 50 cm or 240 cm?",
    options: [
      { text: "2 m 50 cm",      type: "correct",       logicTag: "2 m 50 cm = 250 cm > 240 cm" },
      { text: "240 cm",         type: "concept_error", logicTag: "240 cm < 250 cm" },
      { text: "They are equal", type: "concept_error", logicTag: "250 ≠ 240" },
      { text: "Cannot compare", type: "concept_error", logicTag: "both can be converted to cm" },
    ],
    explanation: "2 m 50 cm = 200+50 = 250 cm. Compare 250 vs 240: 250 > 240, so 2 m 50 cm is longer.",
    solutionSteps: ["2 m 50 cm = 200+50 = 250 cm.", "250 vs 240.", "250 > 240 → 2 m 50 cm is longer."],
    shortcut: "Convert to same unit before comparing.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Long and Short",
  },
  {
    questionId: "math3_ch4_q5", topicId: "math3_ch4",
    text: "A classroom door is about 2 metres tall. In centimetres that is:",
    options: [
      { text: "200 cm",  type: "correct",           logicTag: "2 m = 2 × 100 = 200 cm" },
      { text: "20 cm",   type: "calculation_error", logicTag: "multiplied by 10 instead of 100" },
      { text: "2 cm",    type: "concept_error",     logicTag: "confused m and cm with no conversion" },
      { text: "2000 cm", type: "calculation_error", logicTag: "multiplied by 1000 instead of 100" },
    ],
    explanation: "1 m = 100 cm, so 2 m = 2 × 100 = 200 cm.",
    solutionSteps: ["1 m = 100 cm.", "2 m = 2 × 100 = 200 cm."],
    shortcut: "m × 100 = cm.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Long and Short",
  },

  // ── Chapter 5: Shapes and Designs ─────────────────────────────────────────
  {
    questionId: "math3_ch5_q1", topicId: "math3_ch5",
    text: "How many corners does a hexagon have?",
    options: [
      { text: "6", type: "correct",       logicTag: "hexa = six; hexagon has 6 sides and 6 corners" },
      { text: "5", type: "concept_error", logicTag: "5 corners = pentagon" },
      { text: "8", type: "concept_error", logicTag: "8 corners = octagon" },
      { text: "4", type: "concept_error", logicTag: "4 corners = quadrilateral" },
    ],
    explanation: "Hexagon: 'hexa' means six. 6 sides and 6 corners. Sides always equal corners in a polygon.",
    solutionSteps: ["Hexa = 6.", "Hexagon has 6 sides and 6 corners."],
    shortcut: "Tri=3, Quad=4, Penta=5, Hexa=6, Hepta=7, Octa=8.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Shapes and Designs",
  },
  {
    questionId: "math3_ch5_q2", topicId: "math3_ch5",
    text: "A square has how many lines of symmetry?",
    options: [
      { text: "4", type: "correct",           logicTag: "square: 2 through midpoints + 2 through corners = 4 lines" },
      { text: "2", type: "calculation_error", logicTag: "a rectangle has only 2 lines of symmetry (not a square)" },
      { text: "1", type: "calculation_error", logicTag: "1 line is typical of isosceles triangles" },
      { text: "0", type: "concept_error",     logicTag: "a square is highly symmetric — it has 4 lines" },
    ],
    explanation: "A square has 4 lines of symmetry: 2 through midpoints of opposite sides and 2 through opposite corners.",
    solutionSteps: ["Fold through horizontal midpoints ✓.", "Fold through vertical midpoints ✓.", "Fold through each diagonal ✓.", "Total: 4 lines."],
    shortcut: "Square has more symmetry than a rectangle (2 lines).",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Shapes and Designs",
  },
  {
    questionId: "math3_ch5_q3", topicId: "math3_ch5",
    text: "Which shape can tile a floor with no gaps or overlaps?",
    options: [
      { text: "Square",           type: "correct",       logicTag: "squares tessellate perfectly — like floor tiles" },
      { text: "Circle",           type: "concept_error", logicTag: "circles always leave curved gaps" },
      { text: "Regular pentagon", type: "concept_error", logicTag: "regular pentagons do not tessellate alone" },
      { text: "Semicircle",       type: "concept_error", logicTag: "semicircles leave gaps when placed together" },
    ],
    explanation: "Squares tessellate perfectly with no gaps (like floor tiles). Circles always leave gaps between them.",
    solutionSteps: ["Think of floor tiles.", "Squares fit with no gaps.", "Circles leave gaps."],
    shortcut: "Tessellating shapes: squares, rectangles, equilateral triangles, regular hexagons.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Shapes and Designs",
  },
  {
    questionId: "math3_ch5_q4", topicId: "math3_ch5",
    text: "A shape has 3 sides and 3 corners. It is a:",
    options: [
      { text: "Triangle",  type: "correct",       logicTag: "tri = three; 3 sides, 3 corners" },
      { text: "Square",    type: "concept_error", logicTag: "square has 4 sides" },
      { text: "Pentagon",  type: "concept_error", logicTag: "pentagon has 5 sides" },
      { text: "Hexagon",   type: "concept_error", logicTag: "hexagon has 6 sides" },
    ],
    explanation: "3 sides and 3 corners → triangle. 'Tri' means three.",
    solutionSteps: ["3 sides, 3 corners.", "Name: triangle."],
    shortcut: "Sides = corners in any polygon. Count sides to name the shape.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Shapes and Designs",
  },
  {
    questionId: "math3_ch5_q5", topicId: "math3_ch5",
    text: "You fold a shape along a line and both halves match exactly. What did you find?",
    options: [
      { text: "A line of symmetry", type: "correct",       logicTag: "matching halves = line of symmetry" },
      { text: "A diagonal",         type: "concept_error", logicTag: "a diagonal connects corners but may not be a symmetry line" },
      { text: "A tessellation",     type: "concept_error", logicTag: "tessellation is about tiling, not folding" },
      { text: "A perimeter",        type: "concept_error", logicTag: "perimeter is the total boundary length" },
    ],
    explanation: "When you fold a shape and both halves match perfectly (mirror images), the fold line is a line of symmetry.",
    solutionSteps: ["Fold the shape.", "Halves match exactly → line of symmetry found."],
    shortcut: "Fold test: matching halves = symmetry line.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Shapes and Designs",
  },

  // ── Chapter 6: Fun with Give and Take ─────────────────────────────────────
  {
    questionId: "math3_ch6_q1", topicId: "math3_ch6",
    text: "What is 124 + 235 + 318?",
    options: [
      { text: "677", type: "correct",           logicTag: "ones 4+5+8=17 carry 1; tens 2+3+1+1=7; hundreds 1+2+3=6 → 677" },
      { text: "667", type: "calculation_error", logicTag: "error in ones column sum" },
      { text: "687", type: "calculation_error", logicTag: "error in tens column" },
      { text: "557", type: "calculation_error", logicTag: "error in hundreds column" },
    ],
    explanation: "Ones: 4+5+8=17, write 7 carry 1. Tens: 2+3+1+1=7. Hundreds: 1+2+3=6. Answer: 677.",
    solutionSteps: ["Ones: 4+5+8=17 → write 7, carry 1.", "Tens: 2+3+1+1=7.", "Hundreds: 1+2+3=6.", "Answer: 677."],
    shortcut: "Add all three digits column by column right to left; carry when sum > 9.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Fun with Give and Take",
  },
  {
    questionId: "math3_ch6_q2", topicId: "math3_ch6",
    text: "Priya had ₹450. She spent ₹186. How much is left?",
    options: [
      { text: "₹264", type: "correct",           logicTag: "450−186=264" },
      { text: "₹636", type: "concept_error",     logicTag: "added instead of subtracted" },
      { text: "₹274", type: "calculation_error", logicTag: "error in ones column" },
      { text: "₹244", type: "calculation_error", logicTag: "error in tens column" },
    ],
    explanation: "Spent → subtract. 450−186 = 264.",
    solutionSteps: ["Subtract (spent).", "Ones: 0<6 borrow → 10−6=4. Tens: 4−1=3<8 borrow → 13−8=5. Hundreds: 4−1−1=2.", "Answer: ₹264."],
    shortcut: "Spent/bought/paid → subtract from what you had.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Fun with Give and Take",
  },
  {
    questionId: "math3_ch6_q3", topicId: "math3_ch6",
    text: "Which word in a problem tells you to subtract?",
    options: [
      { text: "gave away",  type: "correct",       logicTag: "gave away = removing items → subtract" },
      { text: "altogether", type: "concept_error", logicTag: "altogether signals addition/total" },
      { text: "in all",     type: "concept_error", logicTag: "in all signals addition" },
      { text: "collected",  type: "concept_error", logicTag: "collected often signals adding to a total" },
    ],
    explanation: "Subtraction keywords: gave away, spent, lost, left, remaining. Addition keywords: altogether, in all, total, combined.",
    solutionSteps: ["'Gave away' = removing from a total.", "Removing = subtract."],
    shortcut: "Removed/lost/spent/gone = subtract. Combined/total/all = add.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Fun with Give and Take",
  },
  {
    questionId: "math3_ch6_q4", topicId: "math3_ch6",
    text: "Estimate 398 + 205 by rounding each number to the nearest hundred:",
    options: [
      { text: "600", type: "correct",           logicTag: "398≈400, 205≈200; 400+200=600" },
      { text: "500", type: "calculation_error", logicTag: "incorrectly rounded 398 down to 300" },
      { text: "700", type: "calculation_error", logicTag: "incorrectly rounded 205 up to 300" },
      { text: "400", type: "calculation_error", logicTag: "only rounded one number" },
    ],
    explanation: "Round 398→400, 205→200. Estimate: 400+200=600.",
    solutionSteps: ["398 → nearest hundred: 400.", "205 → nearest hundred: 200.", "Estimate: 400+200=600."],
    shortcut: "Tens digit ≥ 5 → round up hundreds; < 5 → round down.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Fun with Give and Take",
  },
  {
    questionId: "math3_ch6_q5", topicId: "math3_ch6",
    text: "What is 500 − 125 − 138?",
    options: [
      { text: "237", type: "correct",           logicTag: "500−125=375; 375−138=237" },
      { text: "263", type: "calculation_error", logicTag: "error in the second subtraction" },
      { text: "375", type: "partial_logic",     logicTag: "only did the first subtraction" },
      { text: "227", type: "calculation_error", logicTag: "arithmetic error in final subtraction" },
    ],
    explanation: "Step 1: 500−125=375. Step 2: 375−138=237.",
    solutionSteps: ["500−125=375.", "375−138=237.", "Answer: 237."],
    shortcut: "Multi-step subtraction: do one step at a time from left to right.",
    difficulty: "hard", subject: "Mathematics", grade: "3", chapter: "Fun with Give and Take",
  },

  // ── Chapter 7: Time Goes On ────────────────────────────────────────────────
  {
    questionId: "math3_ch7_q1", topicId: "math3_ch7",
    text: "The minute hand is on 12 and the hour hand is on 7. What time is it?",
    options: [
      { text: "7:00",  type: "correct",       logicTag: "minute hand on 12 = 0 minutes; hour hand on 7 = 7 o'clock" },
      { text: "12:07", type: "concept_error", logicTag: "confused which hand shows hours and which shows minutes" },
      { text: "12:35", type: "concept_error", logicTag: "ignored the hour hand position" },
      { text: "7:12",  type: "concept_error", logicTag: "switched hour and minute hand readings" },
    ],
    explanation: "Minute hand on 12 = 0 minutes. Hour hand on 7 = 7 o'clock. Time = 7:00.",
    solutionSteps: ["Minute hand on 12 → 00 minutes.", "Hour hand on 7 → 7 o'clock.", "Time = 7:00."],
    shortcut: "Minute hand on 12 always means exact o'clock.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Time Goes On",
  },
  {
    questionId: "math3_ch7_q2", topicId: "math3_ch7",
    text: "Half-past 4 means:",
    options: [
      { text: "4:30", type: "correct",       logicTag: "half-past = 30 minutes past the hour" },
      { text: "4:15", type: "concept_error", logicTag: "4:15 is quarter-past 4, not half-past" },
      { text: "4:45", type: "concept_error", logicTag: "4:45 is quarter-to-5" },
      { text: "5:00", type: "concept_error", logicTag: "5:00 is the next full hour" },
    ],
    explanation: "Half-past = 30 minutes past the stated hour. Half-past 4 = 4:30.",
    solutionSteps: ["Half = 30 minutes.", "Half-past 4 = 4:30."],
    shortcut: "Half-past = :30. Quarter-past = :15. Quarter-to = :45.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Time Goes On",
  },
  {
    questionId: "math3_ch7_q3", topicId: "math3_ch7",
    text: "How many days are in a week?",
    options: [
      { text: "7",  type: "correct",           logicTag: "one week = 7 days" },
      { text: "5",  type: "concept_error",     logicTag: "5 is school/working days, not a full week" },
      { text: "6",  type: "calculation_error", logicTag: "off by one" },
      { text: "30", type: "concept_error",     logicTag: "30 ≈ days in a month, not a week" },
    ],
    explanation: "One week = 7 days: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
    solutionSteps: ["Count: Sun, Mon, Tue, Wed, Thu, Fri, Sat = 7 days."],
    shortcut: "Week = 7 days. Year = 12 months = 365 days.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Time Goes On",
  },
  {
    questionId: "math3_ch7_q4", topicId: "math3_ch7",
    text: "1 hour = _____ minutes",
    options: [
      { text: "60",  type: "correct",       logicTag: "1 hour = 60 minutes by definition" },
      { text: "100", type: "concept_error", logicTag: "100 minutes would be in a decimal time system" },
      { text: "30",  type: "concept_error", logicTag: "30 minutes is half an hour" },
      { text: "24",  type: "concept_error", logicTag: "24 is the number of hours in a day" },
    ],
    explanation: "1 hour = 60 minutes. The minute hand makes one full circle in exactly 60 minutes.",
    solutionSteps: ["1 hour = 60 minutes (standard)."],
    shortcut: "60 sec=1 min, 60 min=1 hour, 24 hours=1 day.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Time Goes On",
  },
  {
    questionId: "math3_ch7_q5", topicId: "math3_ch7",
    text: "School starts at 9:00 AM and ends at 3:00 PM. How long is the school day?",
    options: [
      { text: "6 hours", type: "correct",           logicTag: "3 PM − 9 AM = 6 hours" },
      { text: "9 hours", type: "calculation_error", logicTag: "added incorrectly using 12 PM as reference" },
      { text: "4 hours", type: "calculation_error", logicTag: "subtracted incorrectly" },
      { text: "3 hours", type: "concept_error",     logicTag: "confused PM end time with duration" },
    ],
    explanation: "9 AM to 12 noon = 3 hours. Noon to 3 PM = 3 hours. Total = 6 hours.",
    solutionSteps: ["9 AM → noon = 3 hours.", "Noon → 3 PM = 3 hours.", "Total = 6 hours."],
    shortcut: "Count hours from AM to noon, then noon to PM, add both.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Time Goes On",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  for (const q of questions) {
    await Question.findOneAndUpdate(
      { questionId: q.questionId },
      q,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${q.questionId}`);
  }
  console.log(`\nSeeded ${questions.length} questions for Class 3 Math (Part A, Ch 1–7).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
