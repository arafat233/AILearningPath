/**
 * CBSE Class 3 Mathematics — Chapter seed
 * "Math Magic Grade 3" (NCERT) — 14 chapters. Safe to re-run.
 * Usage: node config/seedMath3Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    grade: "3", subject: "Mathematics", chapterNumber: 1,
    title: "Where to Look From",
    description: "Understanding spatial perspective — how the same object looks different from top, front, and side viewpoints.",
    sections: [
      { sectionNumber: "1.1", title: "Looking From Above",      microConcepts: [{ title: "top view of objects" }, { title: "what a circle looks like from above" }] },
      { sectionNumber: "1.2", title: "Different Viewpoints",    microConcepts: [{ title: "front view vs side view" }, { title: "spatial reasoning" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify top, front, and side views of objects", "Understand that viewpoint changes the apparent shape"],
    prerequisiteChapters: [],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 2,
    title: "Fun with Numbers",
    description: "Reading, writing, and comparing numbers up to 1000 using place value.",
    sections: [
      { sectionNumber: "2.1", title: "Numbers Up to 1000",      microConcepts: [{ title: "hundreds, tens, ones" }, { title: "number names" }] },
      { sectionNumber: "2.2", title: "Place Value",             microConcepts: [{ title: "expanded form" }, { title: "place-value chart" }] },
      { sectionNumber: "2.3", title: "Comparing and Ordering",  microConcepts: [{ title: "greater than and less than" }, { title: "ordering numbers" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Read and write numbers to 1000", "Use place value to compare and order numbers"],
    prerequisiteChapters: [],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 3,
    title: "Give and Take",
    description: "Addition and subtraction of 3-digit numbers with and without regrouping.",
    sections: [
      { sectionNumber: "3.1", title: "Adding 3-Digit Numbers",    microConcepts: [{ title: "carrying in addition" }, { title: "column addition" }] },
      { sectionNumber: "3.2", title: "Subtracting 3-Digit Numbers", microConcepts: [{ title: "borrowing in subtraction" }, { title: "checking by adding" }] },
      { sectionNumber: "3.3", title: "Word Problems",              microConcepts: [{ title: "choosing the right operation" }, { title: "add vs subtract keywords" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Add and subtract 3-digit numbers with regrouping", "Solve word problems using addition and subtraction"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 4,
    title: "Long and Short",
    description: "Measuring length using standard units — centimetres and metres.",
    sections: [
      { sectionNumber: "4.1", title: "Centimetres",          microConcepts: [{ title: "using a ruler from 0" }, { title: "measuring in cm" }] },
      { sectionNumber: "4.2", title: "Metres",               microConcepts: [{ title: "1 m = 100 cm" }, { title: "measuring large objects" }] },
      { sectionNumber: "4.3", title: "Comparing Lengths",    microConcepts: [{ title: "converting to same unit" }, { title: "estimating length" }] },
    ],
    keyFormulas: ["1 m = 100 cm"],
    learningObjectives: ["Measure lengths in cm and m", "Convert between cm and m", "Compare lengths after converting to the same unit"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 5,
    title: "Shapes and Designs",
    description: "Exploring 2D shapes, creating patterns, and understanding symmetry and tiling.",
    sections: [
      { sectionNumber: "5.1", title: "2D Shapes",           microConcepts: [{ title: "sides and corners" }, { title: "naming shapes by sides" }] },
      { sectionNumber: "5.2", title: "Patterns and Designs",microConcepts: [{ title: "tessellation" }, { title: "repeating patterns" }] },
      { sectionNumber: "5.3", title: "Symmetry",            microConcepts: [{ title: "line of symmetry" }, { title: "fold test" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Name 2D shapes by their sides and corners", "Find lines of symmetry", "Identify shapes that tessellate"],
    prerequisiteChapters: [],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 6,
    title: "Fun with Give and Take",
    description: "More practice with addition and subtraction through multi-step problems and estimation.",
    sections: [
      { sectionNumber: "6.1", title: "Adding Multiple Numbers", microConcepts: [{ title: "adding three numbers" }, { title: "column addition" }] },
      { sectionNumber: "6.2", title: "Mixed Operations",        microConcepts: [{ title: "choosing add or subtract" }, { title: "estimation" }] },
      { sectionNumber: "6.3", title: "Story Problems",          microConcepts: [{ title: "keywords for operations" }, { title: "multi-step problems" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Add three or more numbers", "Solve multi-step word problems", "Estimate to check answers"],
    prerequisiteChapters: [3],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 7,
    title: "Time Goes On",
    description: "Reading analogue clocks, understanding calendars, and calculating durations.",
    sections: [
      { sectionNumber: "7.1", title: "Reading the Clock",    microConcepts: [{ title: "hour and minute hand" }, { title: "half-past and quarter-past" }] },
      { sectionNumber: "7.2", title: "Calendar and Days",    microConcepts: [{ title: "days of the week" }, { title: "months of the year" }] },
      { sectionNumber: "7.3", title: "Duration of Time",     microConcepts: [{ title: "calculating elapsed time" }, { title: "AM and PM" }] },
    ],
    keyFormulas: ["1 hour = 60 minutes", "1 day = 24 hours", "1 week = 7 days", "1 year = 12 months"],
    learningObjectives: ["Read analogue clocks to the half and quarter hour", "Use a calendar", "Calculate time durations"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 8,
    title: "Who is Heavier?",
    description: "Comparing weights and measuring mass using standard units — grams and kilograms.",
    sections: [
      { sectionNumber: "8.1", title: "Grams and Kilograms", microConcepts: [{ title: "1 kg = 1000 g" }, { title: "choosing the right unit" }] },
      { sectionNumber: "8.2", title: "Weighing Objects",    microConcepts: [{ title: "reading a weighing scale" }, { title: "estimating weight" }] },
      { sectionNumber: "8.3", title: "Comparing Weights",   microConcepts: [{ title: "converting to same unit" }, { title: "balance scale" }] },
    ],
    keyFormulas: ["1 kg = 1000 g"],
    learningObjectives: ["Measure mass in grams and kilograms", "Convert between g and kg", "Compare weights"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 9,
    title: "How Many Times?",
    description: "Understanding multiplication as repeated addition and learning multiplication tables.",
    sections: [
      { sectionNumber: "9.1", title: "Repeated Addition",       microConcepts: [{ title: "multiplication as groups" }, { title: "array model" }] },
      { sectionNumber: "9.2", title: "Multiplication Tables",   microConcepts: [{ title: "tables 2 through 5" }, { title: "commutativity" }] },
      { sectionNumber: "9.3", title: "Solving Problems",        microConcepts: [{ title: "equal groups problems" }, { title: "zero and one rules" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Understand multiplication as repeated addition", "Recall tables 2–5", "Apply commutativity"],
    prerequisiteChapters: [3],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 10,
    title: "Play with Patterns",
    description: "Recognising, extending, and creating number and shape patterns.",
    sections: [
      { sectionNumber: "10.1", title: "Shape Patterns",   microConcepts: [{ title: "repeating unit" }, { title: "alternating patterns" }] },
      { sectionNumber: "10.2", title: "Number Patterns",  microConcepts: [{ title: "finding the rule" }, { title: "growing patterns" }] },
      { sectionNumber: "10.3", title: "Creating Patterns",microConcepts: [{ title: "odd and even patterns" }, { title: "skip counting patterns" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify the rule in a pattern", "Extend number and shape patterns", "Create own patterns"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 11,
    title: "Jugs and Mugs",
    description: "Measuring capacity and volume using litres and millilitres.",
    sections: [
      { sectionNumber: "11.1", title: "Litres and Millilitres", microConcepts: [{ title: "1 L = 1000 mL" }, { title: "choosing the right unit" }] },
      { sectionNumber: "11.2", title: "Measuring Capacity",     microConcepts: [{ title: "reading a measuring jug" }, { title: "estimating capacity" }] },
      { sectionNumber: "11.3", title: "Comparing Volumes",      microConcepts: [{ title: "converting to same unit" }, { title: "capacity vs height" }] },
    ],
    keyFormulas: ["1 L = 1000 mL"],
    learningObjectives: ["Measure capacity in mL and L", "Convert between mL and L", "Compare volumes"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 12,
    title: "Can We Share?",
    description: "Understanding division as equal sharing and equal grouping, with simple remainders.",
    sections: [
      { sectionNumber: "12.1", title: "Sharing Equally",   microConcepts: [{ title: "equal sharing" }, { title: "division notation" }] },
      { sectionNumber: "12.2", title: "Grouping",          microConcepts: [{ title: "equal grouping" }, { title: "number of groups" }] },
      { sectionNumber: "12.3", title: "Division Problems",  microConcepts: [{ title: "remainders" }, { title: "verify with multiplication" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Understand division as sharing and grouping", "Find quotient and remainder", "Verify division with multiplication"],
    prerequisiteChapters: [9],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 13,
    title: "Smart Charts!",
    description: "Collecting and organising data using tally marks and reading pictographs.",
    sections: [
      { sectionNumber: "13.1", title: "Tally Marks",       microConcepts: [{ title: "groups of five" }, { title: "counting tally marks" }] },
      { sectionNumber: "13.2", title: "Pictographs",       microConcepts: [{ title: "reading the key" }, { title: "symbols × value" }] },
      { sectionNumber: "13.3", title: "Interpreting Data", microConcepts: [{ title: "most and least popular" }, { title: "asking questions from data" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Record data using tally marks", "Read and interpret pictographs", "Answer questions from charts"],
    prerequisiteChapters: [2],
  },
  {
    grade: "3", subject: "Mathematics", chapterNumber: 14,
    title: "Rupees and Paise",
    description: "Understanding Indian currency — coins and notes, and simple money calculations including change.",
    sections: [
      { sectionNumber: "14.1", title: "Currency: Coins and Notes", microConcepts: [{ title: "1 rupee = 100 paise" }, { title: "denominations" }] },
      { sectionNumber: "14.2", title: "Adding Money",              microConcepts: [{ title: "carrying from paise to rupees" }, { title: "total cost" }] },
      { sectionNumber: "14.3", title: "Calculating Change",        microConcepts: [{ title: "change = given − cost" }, { title: "convert to paise" }] },
    ],
    keyFormulas: ["1 ₹ = 100 paise", "Change = Amount paid − Cost"],
    learningObjectives: ["Identify Indian coins and notes", "Add money amounts", "Calculate change"],
    prerequisiteChapters: [3],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  for (const ch of chapters) {
    await Chapter.findOneAndUpdate(
      { grade: ch.grade, subject: ch.subject, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ Ch${ch.chapterNumber}: ${ch.title}`);
  }
  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 3 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
