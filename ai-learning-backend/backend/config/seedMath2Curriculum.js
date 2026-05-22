/**
 * CBSE Class 2 Mathematics — Chapter seed
 * "Math Magic Grade 2" (NCERT) — 15 chapters. Safe to re-run.
 * Usage: node config/seedMath2Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    grade: "2", subject: "Mathematics", chapterNumber: 1,
    title: "What is Long, What is Round?",
    description: "Exploring basic shapes in everyday objects — identifying long, short, round, and flat shapes.",
    sections: [
      { sectionNumber: "1.1", title: "Long and Short Objects",   microConcepts: [{ title: "comparing lengths visually" }, { title: "taller and shorter" }] },
      { sectionNumber: "1.2", title: "Round Objects",            microConcepts: [{ title: "circular shapes in daily life" }, { title: "rolling vs sliding" }] },
      { sectionNumber: "1.3", title: "Comparing Shapes",         microConcepts: [{ title: "flat vs round" }, { title: "shape sorting" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify long, short, round, and flat objects", "Compare shapes and sizes visually"],
    prerequisiteChapters: [],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 2,
    title: "Counting in Groups",
    description: "Grouping objects and skip counting by 2s, 5s, and 10s to make counting faster.",
    sections: [
      { sectionNumber: "2.1", title: "Making Equal Groups",  microConcepts: [{ title: "equal groups of objects" }, { title: "grouping to count faster" }] },
      { sectionNumber: "2.2", title: "Skip Counting",        microConcepts: [{ title: "counting by 2s" }, { title: "counting by 5s and 10s" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Group objects equally", "Skip count by 2, 5, and 10"],
    prerequisiteChapters: [],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 3,
    title: "How Much Can You Carry?",
    description: "Comparing weights of everyday objects informally using terms heavy, light, heavier, and lighter.",
    sections: [
      { sectionNumber: "3.1", title: "Heavy and Light",       microConcepts: [{ title: "heavy vs light" }, { title: "guessing weight by feel" }] },
      { sectionNumber: "3.2", title: "Comparing Weights",     microConcepts: [{ title: "heavier and lighter" }, { title: "using a balance scale" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Use heavy/light/heavier/lighter correctly", "Compare weights of objects informally"],
    prerequisiteChapters: [],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 4,
    title: "Counting in Tens",
    description: "Building numbers up to 99 by grouping in tens and ones, laying the foundation for place value.",
    sections: [
      { sectionNumber: "4.1", title: "Groups of Ten",        microConcepts: [{ title: "bundling 10 objects" }, { title: "one ten = 10 ones" }] },
      { sectionNumber: "4.2", title: "Counting by Tens",     microConcepts: [{ title: "10, 20, 30 … 90" }, { title: "number names for tens" }] },
      { sectionNumber: "4.3", title: "Numbers to 99",        microConcepts: [{ title: "tens + ones = two-digit number" }, { title: "reading and writing to 99" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Bundle objects into tens", "Read and write numbers to 99"],
    prerequisiteChapters: [2],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 5,
    title: "Patterns",
    description: "Recognising, extending, and creating repeating patterns using colours, shapes, and numbers.",
    sections: [
      { sectionNumber: "5.1", title: "Colour Patterns",   microConcepts: [{ title: "ABAB colour patterns" }, { title: "extending colour sequences" }] },
      { sectionNumber: "5.2", title: "Shape Patterns",    microConcepts: [{ title: "repeating shape units" }, { title: "what comes next?" }] },
      { sectionNumber: "5.3", title: "Number Patterns",   microConcepts: [{ title: "skip-count patterns" }, { title: "odd-even patterns" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify the rule in a repeating pattern", "Extend and create patterns"],
    prerequisiteChapters: [],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 6,
    title: "Footprints",
    description: "Measuring length using non-standard units such as handspans, footprints, and pencils.",
    sections: [
      { sectionNumber: "6.1", title: "Measuring with Body Parts",  microConcepts: [{ title: "handspan as a unit" }, { title: "footprint as a unit" }] },
      { sectionNumber: "6.2", title: "Comparing Lengths",          microConcepts: [{ title: "longer and shorter" }, { title: "measuring the same object with different units" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Measure length using non-standard units", "Compare lengths of objects"],
    prerequisiteChapters: [1],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 7,
    title: "Jugs and Mugs",
    description: "Exploring capacity informally — full, half-full, and empty; comparing more and less.",
    sections: [
      { sectionNumber: "7.1", title: "Full and Empty",         microConcepts: [{ title: "full, half-full, empty" }, { title: "pouring and comparing" }] },
      { sectionNumber: "7.2", title: "Comparing Capacity",     microConcepts: [{ title: "holds more, holds less" }, { title: "same capacity" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Use vocabulary full/empty/more/less for capacity", "Compare the capacity of containers"],
    prerequisiteChapters: [],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 8,
    title: "Tens and Ones",
    description: "Understanding the place value of two-digit numbers and ordering them up to 99.",
    sections: [
      { sectionNumber: "8.1", title: "Two-Digit Numbers",    microConcepts: [{ title: "tens digit and ones digit" }, { title: "number names to 99" }] },
      { sectionNumber: "8.2", title: "Place Value Chart",    microConcepts: [{ title: "abacus representation" }, { title: "expanded form" }] },
      { sectionNumber: "8.3", title: "Ordering Numbers",     microConcepts: [{ title: "greater than and less than" }, { title: "ordering 2-digit numbers" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify the tens and ones digit", "Write expanded form", "Order two-digit numbers"],
    prerequisiteChapters: [4],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 9,
    title: "My Funbook",
    description: "Creative number stories, number sequences, and fun puzzles to build number fluency.",
    sections: [
      { sectionNumber: "9.1", title: "Number Sequences",   microConcepts: [{ title: "before and after a number" }, { title: "fill in the missing number" }] },
      { sectionNumber: "9.2", title: "Story Sums",         microConcepts: [{ title: "reading number stories" }, { title: "writing your own number story" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify numbers before and after", "Solve simple number-story problems"],
    prerequisiteChapters: [4],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 10,
    title: "Add our Points",
    description: "Adding two-digit numbers with and without carrying, using games and real-life contexts.",
    sections: [
      { sectionNumber: "10.1", title: "Adding Ones",           microConcepts: [{ title: "single-digit addition facts" }, { title: "number bonds to 10" }] },
      { sectionNumber: "10.2", title: "Adding Tens and Ones",  microConcepts: [{ title: "column addition" }, { title: "carrying to tens" }] },
      { sectionNumber: "10.3", title: "Word Problems",         microConcepts: [{ title: "choosing to add" }, { title: "total and sum" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Add two-digit numbers with and without carrying", "Solve addition word problems"],
    prerequisiteChapters: [8],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 11,
    title: "Lines and Lines",
    description: "Distinguishing straight and curved lines; identifying open and closed shapes.",
    sections: [
      { sectionNumber: "11.1", title: "Straight Lines",            microConcepts: [{ title: "drawing straight lines" }, { title: "horizontal, vertical, slanting" }] },
      { sectionNumber: "11.2", title: "Curved Lines",              microConcepts: [{ title: "curved vs straight" }, { title: "wavy and zigzag lines" }] },
      { sectionNumber: "11.3", title: "Open and Closed Shapes",    microConcepts: [{ title: "closed shape: all sides joined" }, { title: "open shape: gap in boundary" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Distinguish straight and curved lines", "Identify open and closed shapes"],
    prerequisiteChapters: [1],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 12,
    title: "Give and Take",
    description: "Subtracting two-digit numbers with and without borrowing using real-life contexts.",
    sections: [
      { sectionNumber: "12.1", title: "Taking Away",                 microConcepts: [{ title: "subtraction as removal" }, { title: "subtraction notation" }] },
      { sectionNumber: "12.2", title: "Subtraction with Borrowing",  microConcepts: [{ title: "borrowing from tens" }, { title: "column subtraction" }] },
      { sectionNumber: "12.3", title: "Word Problems",               microConcepts: [{ title: "less and fewer keywords" }, { title: "how many more?" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Subtract two-digit numbers with and without borrowing", "Solve subtraction word problems"],
    prerequisiteChapters: [10],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 13,
    title: "The Longest Step",
    description: "Measuring and comparing lengths using rulers and non-standard units; estimating lengths.",
    sections: [
      { sectionNumber: "13.1", title: "Measuring with a Ruler",      microConcepts: [{ title: "reading a ruler from 0" }, { title: "measuring in cm" }] },
      { sectionNumber: "13.2", title: "Comparing Measurements",      microConcepts: [{ title: "longer, shorter, same" }, { title: "ordering by length" }] },
      { sectionNumber: "13.3", title: "Estimating Length",           microConcepts: [{ title: "guess then check" }, { title: "reasonable estimates" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Measure length using a ruler in cm", "Compare and order lengths", "Make reasonable length estimates"],
    prerequisiteChapters: [6],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 14,
    title: "Birds Come, Birds Go",
    description: "Combining addition and subtraction in two-step number stories.",
    sections: [
      { sectionNumber: "14.1", title: "Add and Subtract Together",  microConcepts: [{ title: "mixed operations" }, { title: "more birds, fewer birds" }] },
      { sectionNumber: "14.2", title: "Number Stories",             microConcepts: [{ title: "two-step problems" }, { title: "writing equations from stories" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Solve two-step problems using addition and subtraction", "Write equations from number stories"],
    prerequisiteChapters: [12],
  },
  {
    grade: "2", subject: "Mathematics", chapterNumber: 15,
    title: "How Many Ponytails?",
    description: "Collecting data, recording with tally marks, and reading simple pictographs.",
    sections: [
      { sectionNumber: "15.1", title: "Collecting Data",   microConcepts: [{ title: "asking a question, recording answers" }, { title: "categories and counts" }] },
      { sectionNumber: "15.2", title: "Tally Marks",       microConcepts: [{ title: "groups of 5 tally marks" }, { title: "counting tally marks" }] },
      { sectionNumber: "15.3", title: "Pictographs",       microConcepts: [{ title: "one picture = one item" }, { title: "most and least from a pictograph" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Record data using tally marks", "Read and interpret a simple pictograph"],
    prerequisiteChapters: [4],
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
  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 2 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
