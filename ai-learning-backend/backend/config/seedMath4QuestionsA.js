/**
 * CBSE Class 4 Mathematics — MCQ seed (Part A: chapters 1–7)
 * 5 questions per chapter × 7 chapters = 35 questions
 * Usage: node config/seedMath4QuestionsA.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ─── Chapter 1: Building with Bricks ──────────────────────────────────────
  {
    questionId: "math4_ch1_q1", topicId: "math4_ch1",
    text: "A wall is 5 bricks long and 4 bricks tall. How many bricks are there in total?",
    options: [
      { text: "20", type: "correct",          logicTag: "5 × 4 = 20" },
      { text: "9",  type: "concept_error",    logicTag: "Added 5+4 instead of multiplying" },
      { text: "18", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "40", type: "concept_error",    logicTag: "Doubled the product" },
    ],
    explanation: "Total bricks = rows × columns = 4 × 5 = 20.",
    solutionSteps: ["Rows = 4, columns = 5.", "Total = 4 × 5 = 20 bricks."],
    shortcut: "Array: rows × columns = total.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Building with Bricks",
  },
  {
    questionId: "math4_ch2_q1", topicId: "math4_ch2",
    text: "How many centimetres are in 3 metres?",
    options: [
      { text: "300 cm", type: "correct",          logicTag: "3 × 100 = 300" },
      { text: "30 cm",  type: "concept_error",    logicTag: "Multiplied by 10 instead of 100" },
      { text: "3000 cm", type: "concept_error",   logicTag: "Confused metres with kilometres" },
      { text: "103 cm", type: "calculation_error", logicTag: "Added 100+3" },
    ],
    explanation: "1 m = 100 cm. So 3 m = 3 × 100 = 300 cm.",
    solutionSteps: ["1 m = 100 cm.", "3 m = 3 × 100 = 300 cm."],
    shortcut: "Metres to cm: multiply by 100.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Long and Short",
  },
  {
    questionId: "math4_ch1_q2", topicId: "math4_ch1",
    text: "A brick has how many faces?",
    options: [
      { text: "6", type: "correct",       logicTag: "A brick is a cuboid: 6 faces" },
      { text: "4", type: "concept_error", logicTag: "Counted only 4 sides" },
      { text: "8", type: "concept_error", logicTag: "Confused faces with vertices" },
      { text: "12", type: "concept_error", logicTag: "Confused faces with edges" },
    ],
    explanation: "A brick is a rectangular block (cuboid) with 6 faces: top, bottom, front, back, left, right.",
    solutionSteps: ["A cuboid has 6 faces.", "Brick = cuboid → 6 faces."],
    shortcut: "Cuboid: F=6, E=12, V=8.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Building with Bricks",
  },
  {
    questionId: "math4_ch1_q3", topicId: "math4_ch1",
    text: "How many bricks are needed to make 3 identical walls, each having 6 × 3 bricks?",
    options: [
      { text: "54", type: "correct",          logicTag: "6×3=18 per wall; 18×3=54" },
      { text: "18", type: "partial_logic",    logicTag: "Found one wall but forgot to multiply by 3" },
      { text: "27", type: "calculation_error", logicTag: "Multiplied 6+3=9 then ×3=27" },
      { text: "63", type: "calculation_error", logicTag: "Arithmetic error" },
    ],
    explanation: "One wall: 6 × 3 = 18 bricks. Three walls: 18 × 3 = 54 bricks.",
    solutionSteps: ["One wall = 6 × 3 = 18.", "Three walls = 18 × 3 = 54."],
    shortcut: "Multiply single-wall count by number of walls.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Building with Bricks",
  },
  {
    questionId: "math4_ch1_q4", topicId: "math4_ch1",
    text: "Bricks are stacked in a pattern: Row 1 has 4 bricks, Row 2 has 4 bricks, Row 3 has 4 bricks. Total bricks?",
    options: [
      { text: "12", type: "correct",       logicTag: "4 × 3 = 12" },
      { text: "7",  type: "concept_error", logicTag: "Added 4+3" },
      { text: "16", type: "calculation_error", logicTag: "Used 4 rows instead of 3" },
      { text: "9",  type: "calculation_error", logicTag: "Counted 3+3+3" },
    ],
    explanation: "3 rows × 4 bricks per row = 12 bricks.",
    solutionSteps: ["Rows = 3, bricks per row = 4.", "Total = 3 × 4 = 12."],
    shortcut: "Equal rows → multiply row count by bricks per row.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Building with Bricks",
  },
  {
    questionId: "math4_ch1_q5", topicId: "math4_ch1",
    text: "Which solid shape does a brick most resemble?",
    options: [
      { text: "Cuboid",   type: "correct",       logicTag: "A brick is a rectangular prism = cuboid" },
      { text: "Cube",     type: "concept_error", logicTag: "A cube has equal sides; a brick does not" },
      { text: "Cylinder", type: "concept_error", logicTag: "Cylinder is round" },
      { text: "Pyramid",  type: "concept_error", logicTag: "Pyramid has triangular faces" },
    ],
    explanation: "A brick is a cuboid (rectangular prism) — all faces are rectangles, and it has unequal dimensions.",
    solutionSteps: ["Brick: length ≠ width ≠ height.", "A cuboid has unequal rectangular faces.", "Answer: Cuboid."],
    shortcut: "Cube = all sides equal. Cuboid = sides can differ.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Building with Bricks",
  },

  // ─── Chapter 2: Long and Short ────────────────────────────────────────────
  {
    questionId: "math4_ch2_q2", topicId: "math4_ch2",
    text: "A rope is 2 m 50 cm long. What is this in centimetres?",
    options: [
      { text: "250 cm", type: "correct",          logicTag: "2×100+50=250" },
      { text: "52 cm",  type: "concept_error",    logicTag: "Added 2+50" },
      { text: "205 cm", type: "calculation_error", logicTag: "Used 2×100+5" },
      { text: "2050 cm", type: "concept_error",   logicTag: "Confused m with km" },
    ],
    explanation: "2 m = 200 cm. 200 + 50 = 250 cm.",
    solutionSteps: ["2 m = 2 × 100 = 200 cm.", "200 + 50 = 250 cm."],
    shortcut: "Mixed m and cm → convert m to cm by ×100, then add cm part.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Long and Short",
  },
  {
    questionId: "math4_ch2_q3", topicId: "math4_ch2",
    text: "How many metres are in 3 kilometres?",
    options: [
      { text: "3000 m", type: "correct",          logicTag: "3 × 1000 = 3000" },
      { text: "300 m",  type: "concept_error",    logicTag: "Multiplied by 100 instead of 1000" },
      { text: "30 m",   type: "concept_error",    logicTag: "Multiplied by 10" },
      { text: "3100 m", type: "calculation_error", logicTag: "Added 100 to 3000" },
    ],
    explanation: "1 km = 1000 m. So 3 km = 3 × 1000 = 3000 m.",
    solutionSteps: ["1 km = 1000 m.", "3 km = 3 × 1000 = 3000 m."],
    shortcut: "km to m: multiply by 1000.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Long and Short",
  },
  {
    questionId: "math4_ch2_q4", topicId: "math4_ch2",
    text: "A classroom is 8 m 40 cm long and 5 m 60 cm wide. What is the total of length + width in cm?",
    options: [
      { text: "1400 cm", type: "correct",          logicTag: "840+560=1400" },
      { text: "140 cm",  type: "concept_error",    logicTag: "Added without converting" },
      { text: "1360 cm", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "4704 cm", type: "concept_error",    logicTag: "Multiplied instead of added" },
    ],
    explanation: "8 m 40 cm = 840 cm. 5 m 60 cm = 560 cm. Total = 840 + 560 = 1400 cm.",
    solutionSteps: ["Convert: 8m 40cm = 840cm; 5m 60cm = 560cm.", "840 + 560 = 1400 cm."],
    shortcut: "Convert both to cm, then add.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Long and Short",
  },
  {
    questionId: "math4_ch2_q5", topicId: "math4_ch2",
    text: "Which is longer: 350 cm or 4 m?",
    options: [
      { text: "4 m (= 400 cm > 350 cm)", type: "correct",          logicTag: "4m=400cm > 350cm" },
      { text: "350 cm",                   type: "concept_error",    logicTag: "Did not convert to compare" },
      { text: "They are equal",           type: "concept_error",    logicTag: "350 ≠ 400" },
      { text: "Cannot compare",           type: "guessing",         logicTag: "Can be compared after conversion" },
    ],
    explanation: "4 m = 400 cm. Compare: 400 cm > 350 cm. So 4 m is longer.",
    solutionSteps: ["Convert 4 m: 4 × 100 = 400 cm.", "Compare: 400 > 350.", "4 m is longer."],
    shortcut: "Always convert to the same unit before comparing.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Long and Short",
  },

  // ─── Chapter 3: A Trip to Bhopal ──────────────────────────────────────────
  {
    questionId: "math4_ch3_q1", topicId: "math4_ch3",
    text: "Bus tickets cost ₹35 each. How much do 6 tickets cost?",
    options: [
      { text: "₹210", type: "correct",          logicTag: "35×6=210" },
      { text: "₹41",  type: "concept_error",    logicTag: "Added 35+6=41" },
      { text: "₹180", type: "calculation_error", logicTag: "Used 30×6=180" },
      { text: "₹420", type: "calculation_error", logicTag: "Used 35×12=420" },
    ],
    explanation: "Total cost = ₹35 × 6 = ₹210.",
    solutionSteps: ["Price per ticket = ₹35.", "Tickets = 6.", "Total = 35 × 6 = ₹210."],
    shortcut: "30×6=180; 5×6=30; 180+30=210.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "A Trip to Bhopal",
  },
  {
    questionId: "math4_ch3_q2", topicId: "math4_ch3",
    text: "Ramu pays ₹500 for tickets costing ₹340. How much change does he get?",
    options: [
      { text: "₹160", type: "correct",          logicTag: "500−340=160" },
      { text: "₹840", type: "concept_error",    logicTag: "Added instead of subtracted" },
      { text: "₹140", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "₹260", type: "calculation_error", logicTag: "Subtracted 240 instead of 340" },
    ],
    explanation: "Change = ₹500 − ₹340 = ₹160.",
    solutionSteps: ["Amount paid = ₹500.", "Total cost = ₹340.", "Change = 500 − 340 = ₹160."],
    shortcut: "Change = Amount paid − Total cost.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "A Trip to Bhopal",
  },
  {
    questionId: "math4_ch3_q3", topicId: "math4_ch3",
    text: "How many paise are in ₹4 and 75 paise?",
    options: [
      { text: "475 paise", type: "correct",          logicTag: "4×100+75=475" },
      { text: "479 paise", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "47 paise",  type: "concept_error",    logicTag: "Dropped a zero" },
      { text: "4075 paise", type: "concept_error",   logicTag: "Multiplied by 1000 instead of 100" },
    ],
    explanation: "₹4 = 400 paise. Total = 400 + 75 = 475 paise.",
    solutionSteps: ["1 rupee = 100 paise.", "₹4 = 400 paise.", "475 paise total."],
    shortcut: "Rupees to paise: multiply by 100.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "A Trip to Bhopal",
  },
  {
    questionId: "math4_ch3_q4", topicId: "math4_ch3",
    text: "Souvenirs cost ₹12 each. A family buys 5 souvenirs. How much do they spend?",
    options: [
      { text: "₹60", type: "correct",          logicTag: "12×5=60" },
      { text: "₹17", type: "concept_error",    logicTag: "Added 12+5=17" },
      { text: "₹50", type: "calculation_error", logicTag: "Used 10×5=50" },
      { text: "₹72", type: "calculation_error", logicTag: "Arithmetic error" },
    ],
    explanation: "₹12 × 5 = ₹60.",
    solutionSteps: ["10×5=50. 2×5=10. 50+10=60."],
    shortcut: "Split: 12×5 = (10+2)×5 = 50+10 = 60.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "A Trip to Bhopal",
  },
  {
    questionId: "math4_ch3_q5", topicId: "math4_ch3",
    text: "4 friends share the total cost of ₹200 equally. How much does each pay?",
    options: [
      { text: "₹50",  type: "correct",       logicTag: "200÷4=50" },
      { text: "₹40",  type: "calculation_error", logicTag: "200÷5=40" },
      { text: "₹800", type: "concept_error", logicTag: "Multiplied instead of divided" },
      { text: "₹196", type: "concept_error", logicTag: "Subtracted 4 from 200" },
    ],
    explanation: "₹200 ÷ 4 friends = ₹50 each.",
    solutionSteps: ["Total = ₹200. Friends = 4.", "Each pays = 200 ÷ 4 = ₹50."],
    shortcut: "Equal sharing → divide total by number of people.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "A Trip to Bhopal",
  },

  // ─── Chapter 4: Tick-Tick-Tick ────────────────────────────────────────────
  {
    questionId: "math4_ch4_q1", topicId: "math4_ch4",
    text: "How many minutes are in 2 hours?",
    options: [
      { text: "120 minutes", type: "correct",          logicTag: "2×60=120" },
      { text: "20 minutes",  type: "concept_error",    logicTag: "Subtracted instead" },
      { text: "200 minutes", type: "concept_error",    logicTag: "Used 1 hour = 100 minutes" },
      { text: "60 minutes",  type: "concept_error",    logicTag: "Gave 1 hour not 2" },
    ],
    explanation: "1 hour = 60 minutes. 2 hours = 2 × 60 = 120 minutes.",
    solutionSteps: ["1 hour = 60 min.", "2 hours = 2 × 60 = 120 min."],
    shortcut: "Hours to minutes: multiply by 60.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Tick-Tick-Tick",
  },
  {
    questionId: "math4_ch4_q2", topicId: "math4_ch4",
    text: "A movie starts at 3:15 PM and lasts 1 hour 45 minutes. When does it end?",
    options: [
      { text: "5:00 PM", type: "correct",          logicTag: "3:15 + 1h45m = 5:00 PM" },
      { text: "4:45 PM", type: "calculation_error", logicTag: "Added only 1h30m" },
      { text: "4:60 PM", type: "concept_error",    logicTag: "Did not convert 60min to 1h" },
      { text: "5:15 PM", type: "calculation_error", logicTag: "Added 2 hours instead of 1h45m" },
    ],
    explanation: "3:15 + 1h45m: minutes: 15+45=60 → carry 1 hour. Hours: 3+1+1=5. End time = 5:00 PM.",
    solutionSteps: ["Start: 3:15 PM.", "Add 1h: 4:15 PM.", "Add 45min: 15+45=60min = 1h → 5:00 PM."],
    shortcut: "If minutes ≥ 60, subtract 60 and add 1 hour.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Tick-Tick-Tick",
  },
  {
    questionId: "math4_ch4_q3", topicId: "math4_ch4",
    text: "School starts at 8:00 AM and ends at 1:30 PM. How long is the school day?",
    options: [
      { text: "5 hours 30 minutes", type: "correct",          logicTag: "1:30PM − 8:00AM = 5h30m" },
      { text: "6 hours 30 minutes", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "5 hours",            type: "partial_logic",    logicTag: "Ignored the 30 minutes" },
      { text: "6 hours",            type: "calculation_error", logicTag: "Counted to 2:00 PM" },
    ],
    explanation: "8:00 AM to 1:00 PM = 5 hours. Plus 30 minutes = 5 hours 30 minutes.",
    solutionSteps: ["8:00 AM → 1:00 PM = 5 hours.", "Plus 30 min = 5h 30min."],
    shortcut: "Count hours first, then add remaining minutes.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Tick-Tick-Tick",
  },
  {
    questionId: "math4_ch4_q4", topicId: "math4_ch4",
    text: "What time will it be 3 hours after 10:30 AM?",
    options: [
      { text: "1:30 PM", type: "correct",          logicTag: "10:30 + 3h = 13:30 = 1:30 PM" },
      { text: "13:30 AM", type: "concept_error",   logicTag: "Forgot AM/PM conversion at noon" },
      { text: "1:30 AM",  type: "concept_error",   logicTag: "Used wrong AM/PM" },
      { text: "2:30 PM",  type: "calculation_error", logicTag: "Added 4 hours instead of 3" },
    ],
    explanation: "10:30 AM + 3 hours = 13:30 = 1:30 PM (afternoon).",
    solutionSteps: ["10:30 + 3h = 13:30.", "13:30 in 12-hour clock = 1:30 PM."],
    shortcut: "Hours past noon: subtract 12 to get PM time.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Tick-Tick-Tick",
  },
  {
    questionId: "math4_ch4_q5", topicId: "math4_ch4",
    text: "Which hand on a clock is the minute hand?",
    options: [
      { text: "The longer hand",  type: "correct",       logicTag: "Minute hand is longer" },
      { text: "The shorter hand", type: "concept_error", logicTag: "Shorter hand is the hour hand" },
      { text: "Both hands",       type: "concept_error", logicTag: "Only one hand is the minute hand" },
      { text: "Neither hand",     type: "guessing",      logicTag: "Clock does have a minute hand" },
    ],
    explanation: "The longer hand completes one full circle in 60 minutes and is called the minute hand. The shorter hand shows the hour.",
    solutionSteps: ["Long hand = minute hand (1 round = 60 min).", "Short hand = hour hand (1 round = 12 hours)."],
    shortcut: "Long = minute (fast); Short = hour (slow).",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Tick-Tick-Tick",
  },

  // ─── Chapter 5: The Way The World Looks ───────────────────────────────────
  {
    questionId: "math4_ch5_q1", topicId: "math4_ch5",
    text: "What does the top view of a cylinder look like?",
    options: [
      { text: "Circle",    type: "correct",       logicTag: "Top view of cylinder = circle" },
      { text: "Rectangle", type: "concept_error", logicTag: "Rectangle is the front/side view" },
      { text: "Triangle",  type: "concept_error", logicTag: "Incorrect" },
      { text: "Square",    type: "concept_error", logicTag: "Square is the top view of a cube" },
    ],
    explanation: "Looking straight down at a cylinder, you see its circular top face — a circle.",
    solutionSteps: ["Cylinder: circular top and bottom, curved side.", "Top view = looking down = circle."],
    shortcut: "Top view of cylinder = circle. Front view = rectangle.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Way The World Looks",
  },
  {
    questionId: "math4_ch5_q2", topicId: "math4_ch5",
    text: "Which view of an object is used to draw a map?",
    options: [
      { text: "Top view (bird's-eye view)", type: "correct",       logicTag: "Maps show objects from above" },
      { text: "Front view",                 type: "concept_error", logicTag: "Front view shows height, not map position" },
      { text: "Side view",                  type: "concept_error", logicTag: "Side view shows depth" },
      { text: "No view — maps are invented", type: "guessing",     logicTag: "Maps are top views" },
    ],
    explanation: "A map is a top view — you imagine looking at the area from directly above (like a bird).",
    solutionSteps: ["Maps show relative positions of places.", "This is what you see looking straight down.", "Top view = bird's-eye view = map."],
    shortcut: "Map = top view. Blueprint = top view of a building.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Way The World Looks",
  },
  {
    questionId: "math4_ch5_q3", topicId: "math4_ch5",
    text: "What does the front view of a cube look like?",
    options: [
      { text: "Square",    type: "correct",       logicTag: "All views of a cube are squares" },
      { text: "Rectangle", type: "concept_error", logicTag: "Rectangle is for a cuboid, not cube" },
      { text: "Circle",    type: "concept_error", logicTag: "Circle = cylinder view" },
      { text: "Triangle",  type: "concept_error", logicTag: "Triangle is not a view of a cube" },
    ],
    explanation: "All six faces of a cube are identical squares. So every view (top, front, side) of a cube is a square.",
    solutionSteps: ["A cube has 6 equal square faces.", "Front view = one square face."],
    shortcut: "Cube → all views are squares. Cuboid → views are rectangles.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Way The World Looks",
  },
  {
    questionId: "math4_ch5_q4", topicId: "math4_ch5",
    text: "On a map, North is at the top. If you walk from a school to a park directly to the right, which direction are you walking?",
    options: [
      { text: "East",  type: "correct",       logicTag: "Right on a N-up map = East" },
      { text: "West",  type: "concept_error", logicTag: "Left on a N-up map = West" },
      { text: "North", type: "concept_error", logicTag: "Up on a N-up map = North" },
      { text: "South", type: "concept_error", logicTag: "Down on a N-up map = South" },
    ],
    explanation: "When North is up: Right = East, Left = West, Up = North, Down = South.",
    solutionSteps: ["Standard map orientation: N=up, S=down, E=right, W=left.", "Moving right = East."],
    shortcut: "Never Eat Shredded Wheat: N, E, S, W clockwise.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Way The World Looks",
  },
  {
    questionId: "math4_ch5_q5", topicId: "math4_ch5",
    text: "Which two views of a cone are different from each other?",
    options: [
      { text: "Top view = circle; Front view = triangle", type: "correct",       logicTag: "Classic cone views" },
      { text: "Top view = triangle; Front view = circle", type: "concept_error", logicTag: "Swapped the views" },
      { text: "Both views are circles",                   type: "concept_error", logicTag: "Only top is a circle" },
      { text: "Both views are triangles",                 type: "concept_error", logicTag: "Only front is a triangle" },
    ],
    explanation: "Looking at a cone from the top, you see its circular base = circle. From the front, you see a triangular silhouette.",
    solutionSteps: ["Cone: circular base, pointed apex.", "Top view = circle.", "Front view = triangle."],
    shortcut: "Cone: top=circle, side/front=triangle.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "The Way The World Looks",
  },

  // ─── Chapter 6: The Junk Seller ───────────────────────────────────────────
  {
    questionId: "math4_ch6_q1", topicId: "math4_ch6",
    text: "How many grams are in 2 kilograms?",
    options: [
      { text: "2000 g", type: "correct",          logicTag: "2×1000=2000" },
      { text: "200 g",  type: "concept_error",    logicTag: "Multiplied by 100 instead of 1000" },
      { text: "20 g",   type: "concept_error",    logicTag: "Multiplied by 10" },
      { text: "2100 g", type: "calculation_error", logicTag: "Added 100 to 2000" },
    ],
    explanation: "1 kg = 1000 g. 2 kg = 2 × 1000 = 2000 g.",
    solutionSteps: ["1 kg = 1000 g.", "2 kg = 2 × 1000 = 2000 g."],
    shortcut: "kg to g: multiply by 1000.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Junk Seller",
  },
  {
    questionId: "math4_ch6_q2", topicId: "math4_ch6",
    text: "A junk seller pays ₹3 per kg for scrap metal. Reena sells 8 kg. How much does she earn?",
    options: [
      { text: "₹24", type: "correct",          logicTag: "3×8=24" },
      { text: "₹11", type: "concept_error",    logicTag: "Added 3+8=11" },
      { text: "₹30", type: "calculation_error", logicTag: "Used 3×10=30" },
      { text: "₹18", type: "calculation_error", logicTag: "Used 3×6=18" },
    ],
    explanation: "Earnings = ₹3 × 8 kg = ₹24.",
    solutionSteps: ["Rate = ₹3/kg.", "Weight = 8 kg.", "Earnings = 3 × 8 = ₹24."],
    shortcut: "Earnings = rate × weight.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Junk Seller",
  },
  {
    questionId: "math4_ch6_q3", topicId: "math4_ch6",
    text: "Which is heavier: 1500 g or 1 kg 600 g?",
    options: [
      { text: "1 kg 600 g (= 1600 g > 1500 g)", type: "correct",          logicTag: "1600 > 1500" },
      { text: "1500 g",                          type: "concept_error",    logicTag: "Did not convert to compare" },
      { text: "They are equal",                  type: "concept_error",    logicTag: "1500 ≠ 1600" },
      { text: "Cannot compare",                  type: "guessing",         logicTag: "Can be compared after conversion" },
    ],
    explanation: "1 kg 600 g = 1000 + 600 = 1600 g. 1600 g > 1500 g. So 1 kg 600 g is heavier.",
    solutionSteps: ["1 kg 600 g = 1600 g.", "Compare: 1600 > 1500.", "1 kg 600 g is heavier."],
    shortcut: "Convert to grams, then compare.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Junk Seller",
  },
  {
    questionId: "math4_ch6_q4", topicId: "math4_ch6",
    text: "Rahul has 3 kg 500 g of newspapers and 2 kg 750 g of cardboard. What is the total weight in grams?",
    options: [
      { text: "6250 g", type: "correct",          logicTag: "3500+2750=6250" },
      { text: "5250 g", type: "calculation_error", logicTag: "3000+2750=5750 or other error" },
      { text: "6750 g", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "5 kg",   type: "partial_logic",    logicTag: "Rounded the kg but ignored g" },
    ],
    explanation: "3 kg 500 g = 3500 g. 2 kg 750 g = 2750 g. Total = 3500 + 2750 = 6250 g.",
    solutionSteps: ["3 kg 500 g = 3500 g.", "2 kg 750 g = 2750 g.", "Total = 3500 + 2750 = 6250 g."],
    shortcut: "Convert both to grams, then add.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "The Junk Seller",
  },
  {
    questionId: "math4_ch6_q5", topicId: "math4_ch6",
    text: "A junk seller has ₹50 and spends ₹32 on repairs. How much is left?",
    options: [
      { text: "₹18", type: "correct",          logicTag: "50−32=18" },
      { text: "₹82", type: "concept_error",    logicTag: "Added instead of subtracted" },
      { text: "₹28", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "₹20", type: "calculation_error", logicTag: "Used 50−30=20" },
    ],
    explanation: "₹50 − ₹32 = ₹18.",
    solutionSteps: ["₹50 − ₹32.", "50−30=20; 20−2=18. Answer: ₹18."],
    shortcut: "Remaining = total − spent.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "The Junk Seller",
  },

  // ─── Chapter 7: Jugs and Mugs ─────────────────────────────────────────────
  {
    questionId: "math4_ch7_q1", topicId: "math4_ch7",
    text: "How many millilitres are in 3 litres?",
    options: [
      { text: "3000 mL", type: "correct",          logicTag: "3×1000=3000" },
      { text: "300 mL",  type: "concept_error",    logicTag: "Multiplied by 100" },
      { text: "30 mL",   type: "concept_error",    logicTag: "Multiplied by 10" },
      { text: "3100 mL", type: "calculation_error", logicTag: "Added 100 to 3000" },
    ],
    explanation: "1 L = 1000 mL. 3 L = 3 × 1000 = 3000 mL.",
    solutionSteps: ["1 L = 1000 mL.", "3 L = 3 × 1000 = 3000 mL."],
    shortcut: "L to mL: multiply by 1000.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math4_ch7_q2", topicId: "math4_ch7",
    text: "A jug holds 2 L 500 mL. How many 500 mL mugs can be filled from it?",
    options: [
      { text: "5",  type: "correct",          logicTag: "2500÷500=5" },
      { text: "4",  type: "calculation_error", logicTag: "Used 2000÷500=4" },
      { text: "10", type: "calculation_error", logicTag: "Used 5000÷500=10" },
      { text: "2",  type: "concept_error",    logicTag: "Looked only at litres" },
    ],
    explanation: "2 L 500 mL = 2500 mL. 2500 ÷ 500 = 5 mugs.",
    solutionSteps: ["Convert: 2 L 500 mL = 2500 mL.", "2500 ÷ 500 = 5 mugs."],
    shortcut: "Convert to mL, then divide by mug capacity.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math4_ch7_q3", topicId: "math4_ch7",
    text: "A pot has 1 L 800 mL of milk. 600 mL is used for tea. How much milk remains?",
    options: [
      { text: "1 L 200 mL", type: "correct",          logicTag: "1800−600=1200 mL=1L 200mL" },
      { text: "1 L 400 mL", type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "800 mL",     type: "calculation_error", logicTag: "Subtracted 1000 instead of 600" },
      { text: "2 L 400 mL", type: "concept_error",    logicTag: "Added instead of subtracted" },
    ],
    explanation: "1800 mL − 600 mL = 1200 mL = 1 L 200 mL.",
    solutionSteps: ["1 L 800 mL = 1800 mL.", "1800 − 600 = 1200 mL.", "= 1 L 200 mL."],
    shortcut: "Convert to mL, subtract, convert back.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math4_ch7_q4", topicId: "math4_ch7",
    text: "Which is more: 2500 mL or 3 L?",
    options: [
      { text: "3 L (= 3000 mL > 2500 mL)", type: "correct",          logicTag: "3000 > 2500" },
      { text: "2500 mL",                    type: "concept_error",    logicTag: "Did not convert to compare" },
      { text: "They are equal",             type: "concept_error",    logicTag: "2500 ≠ 3000" },
      { text: "Cannot tell",                type: "guessing",         logicTag: "Can be compared after conversion" },
    ],
    explanation: "3 L = 3000 mL. 3000 mL > 2500 mL. So 3 L is more.",
    solutionSteps: ["3 L = 3000 mL.", "3000 > 2500.", "3 L is more."],
    shortcut: "Convert to mL, then compare.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math4_ch7_q5", topicId: "math4_ch7",
    text: "A recipe uses 250 mL of oil. How many recipes can be made from a 1 L bottle of oil?",
    options: [
      { text: "4",  type: "correct",          logicTag: "1000÷250=4" },
      { text: "5",  type: "calculation_error", logicTag: "Used 1250÷250=5" },
      { text: "40", type: "concept_error",    logicTag: "Placed decimal incorrectly" },
      { text: "2",  type: "calculation_error", logicTag: "Used 500÷250=2" },
    ],
    explanation: "1 L = 1000 mL. 1000 ÷ 250 = 4 recipes.",
    solutionSteps: ["1 L = 1000 mL.", "1000 ÷ 250 = 4."],
    shortcut: "250 × 4 = 1000. So 4 recipes per litre.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Jugs and Mugs",
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
  console.log(`\nSeeded ${questions.length} questions for Class 4 Math (Part A, Ch 1–7).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
