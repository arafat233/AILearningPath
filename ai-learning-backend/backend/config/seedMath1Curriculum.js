/**
 * CBSE Class 1 Mathematics — Chapter seed
 * "Math Magic Grade 1" (NCERT) — 13 chapters. Safe to re-run.
 * Usage: node config/seedMath1Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    grade: "1", subject: "Mathematics", chapterNumber: 1,
    title: "Shapes and Space",
    description: "Exploring basic 2D shapes (circle, triangle, square, rectangle) and spatial relationships (inside/outside, above/below, near/far, left/right).",
    sections: [
      { sectionNumber: "1.1", title: "Basic Shapes",       microConcepts: [{ title: "circle, square, triangle, rectangle" }, { title: "recognising shapes in real life" }] },
      { sectionNumber: "1.2", title: "Spatial Concepts",   microConcepts: [{ title: "inside and outside" }, { title: "above and below" }, { title: "near and far" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify circles, squares, triangles, and rectangles", "Use spatial words: inside, outside, above, below, near, far"],
    prerequisiteChapters: [],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 2,
    title: "Numbers from One to Nine",
    description: "Counting, reading, and writing numbers 1 to 9; understanding zero; one-to-one correspondence.",
    sections: [
      { sectionNumber: "2.1", title: "Counting 1 to 5",     microConcepts: [{ title: "one-to-one correspondence" }, { title: "number names one to five" }] },
      { sectionNumber: "2.2", title: "Counting 6 to 9",     microConcepts: [{ title: "number names six to nine" }, { title: "writing numerals 6–9" }] },
      { sectionNumber: "2.3", title: "Zero",                microConcepts: [{ title: "zero means none" }, { title: "the numeral 0" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Count objects up to 9", "Read and write numerals 0–9", "Match a number to a set of objects"],
    prerequisiteChapters: [],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 3,
    title: "Addition",
    description: "Understanding addition as combining two groups; addition facts up to 9; simple word problems.",
    sections: [
      { sectionNumber: "3.1", title: "Combining Groups",      microConcepts: [{ title: "putting two groups together" }, { title: "the plus sign" }] },
      { sectionNumber: "3.2", title: "Addition Facts to 9",   microConcepts: [{ title: "number bonds" }, { title: "addition table for small numbers" }] },
      { sectionNumber: "3.3", title: "Addition Word Problems", microConcepts: [{ title: "more, altogether, total" }, { title: "writing an addition sentence" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Add two single-digit numbers with sum ≤ 9", "Write addition sentences using + and =", "Solve simple addition word problems"],
    prerequisiteChapters: [2],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 4,
    title: "Subtraction",
    description: "Understanding subtraction as taking away; subtraction facts up to 9; simple word problems.",
    sections: [
      { sectionNumber: "4.1", title: "Taking Away",             microConcepts: [{ title: "removing from a group" }, { title: "the minus sign" }] },
      { sectionNumber: "4.2", title: "Subtraction Facts to 9",  microConcepts: [{ title: "how many are left" }, { title: "subtraction and addition are opposites" }] },
      { sectionNumber: "4.3", title: "Subtraction Word Problems",microConcepts: [{ title: "fewer, left, taken away" }, { title: "writing a subtraction sentence" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Subtract single-digit numbers from numbers ≤ 9", "Write subtraction sentences using − and =", "Solve simple subtraction word problems"],
    prerequisiteChapters: [3],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 5,
    title: "Numbers from Ten to Twenty",
    description: "Reading, writing, and ordering numbers 10 to 20; understanding teen numbers as 'ten and some more'.",
    sections: [
      { sectionNumber: "5.1", title: "Numbers 10 to 15",        microConcepts: [{ title: "ten and ones beyond ten" }, { title: "number names ten to fifteen" }] },
      { sectionNumber: "5.2", title: "Numbers 16 to 20",        microConcepts: [{ title: "number names sixteen to twenty" }, { title: "writing numerals 16–20" }] },
      { sectionNumber: "5.3", title: "Ordering Numbers to 20",  microConcepts: [{ title: "before and after" }, { title: "greater and smaller to 20" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Count, read, and write numbers 10–20", "Order numbers to 20", "Identify numbers just before and just after"],
    prerequisiteChapters: [2],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 6,
    title: "Time",
    description: "Relating daily activities to parts of the day; learning the days of the week; understanding yesterday, today, and tomorrow.",
    sections: [
      { sectionNumber: "6.1", title: "Parts of the Day",          microConcepts: [{ title: "morning, afternoon, evening, night" }, { title: "activities linked to parts of the day" }] },
      { sectionNumber: "6.2", title: "Days of the Week",          microConcepts: [{ title: "seven days: Monday through Sunday" }, { title: "order of days" }] },
      { sectionNumber: "6.3", title: "Yesterday, Today, Tomorrow", microConcepts: [{ title: "today is now" }, { title: "yesterday was before; tomorrow is next" }] },
    ],
    keyFormulas: ["1 week = 7 days"],
    learningObjectives: ["Name the parts of the day", "Say the days of the week in order", "Use yesterday/today/tomorrow correctly"],
    prerequisiteChapters: [],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 7,
    title: "Measurement",
    description: "Comparing lengths, heights, and weights of objects using direct comparison and everyday vocabulary.",
    sections: [
      { sectionNumber: "7.1", title: "Comparing Lengths",   microConcepts: [{ title: "longer and shorter" }, { title: "direct comparison by placing side by side" }] },
      { sectionNumber: "7.2", title: "Comparing Heights",   microConcepts: [{ title: "taller and shorter" }, { title: "tallest and shortest in a group" }] },
      { sectionNumber: "7.3", title: "Comparing Weights",   microConcepts: [{ title: "heavier and lighter" }, { title: "heaviest and lightest" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Compare lengths using longer/shorter", "Compare heights using taller/shorter", "Compare weights using heavier/lighter"],
    prerequisiteChapters: [],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 8,
    title: "Numbers from Twenty-one to Fifty",
    description: "Counting, reading, writing, and comparing numbers from 21 to 50.",
    sections: [
      { sectionNumber: "8.1", title: "Numbers 21 to 35",          microConcepts: [{ title: "number names twenty-one to thirty-five" }, { title: "skip counting by 1s" }] },
      { sectionNumber: "8.2", title: "Numbers 36 to 50",          microConcepts: [{ title: "number names thirty-six to fifty" }, { title: "tens and ones to 50" }] },
      { sectionNumber: "8.3", title: "Comparing and Ordering",    microConcepts: [{ title: "greater than and less than to 50" }, { title: "ordering a set of numbers" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Count, read, and write numbers 21–50", "Compare numbers up to 50", "Order numbers 21–50"],
    prerequisiteChapters: [5],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 9,
    title: "Data Handling",
    description: "Sorting objects by colour, shape, or size; counting objects in each group; reading simple charts.",
    sections: [
      { sectionNumber: "9.1", title: "Sorting Objects",    microConcepts: [{ title: "sorting by one attribute" }, { title: "colour, shape, size" }] },
      { sectionNumber: "9.2", title: "Making Groups",      microConcepts: [{ title: "grouping objects that are alike" }, { title: "how many in each group?" }] },
      { sectionNumber: "9.3", title: "Reading Simple Charts", microConcepts: [{ title: "most and least" }, { title: "comparing group sizes" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Sort objects by one attribute", "Count and compare groups", "Answer questions from a simple chart"],
    prerequisiteChapters: [2],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 10,
    title: "Patterns",
    description: "Recognising, describing, and extending repeating patterns using colours, shapes, and sizes.",
    sections: [
      { sectionNumber: "10.1", title: "Colour Patterns",  microConcepts: [{ title: "repeating colour sequence" }, { title: "what colour comes next?" }] },
      { sectionNumber: "10.2", title: "Shape Patterns",   microConcepts: [{ title: "repeating shape sequence" }, { title: "what shape comes next?" }] },
      { sectionNumber: "10.3", title: "Size Patterns",    microConcepts: [{ title: "big-small repeating patterns" }, { title: "pattern rule" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify and describe repeating patterns", "Extend a pattern by applying the rule", "Create simple patterns"],
    prerequisiteChapters: [],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 11,
    title: "Numbers",
    description: "Extending number knowledge from 51 to 99; reading, writing, comparing, and ordering larger numbers.",
    sections: [
      { sectionNumber: "11.1", title: "Numbers 51 to 75",         microConcepts: [{ title: "number names fifty-one to seventy-five" }, { title: "tens and ones" }] },
      { sectionNumber: "11.2", title: "Numbers 76 to 99",         microConcepts: [{ title: "number names seventy-six to ninety-nine" }, { title: "ordering to 99" }] },
      { sectionNumber: "11.3", title: "Comparing Numbers to 99",  microConcepts: [{ title: "which number is greater?" }, { title: "smallest and largest in a set" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Read and write numbers 51–99", "Compare numbers up to 99", "Order numbers up to 99"],
    prerequisiteChapters: [8],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 12,
    title: "Money",
    description: "Recognising Indian coins (1, 2, 5 rupee) and a 10-rupee note; combining coins to make small amounts.",
    sections: [
      { sectionNumber: "12.1", title: "Coins",                  microConcepts: [{ title: "1 rupee, 2 rupee, 5 rupee coins" }, { title: "matching coin value" }] },
      { sectionNumber: "12.2", title: "Notes",                  microConcepts: [{ title: "10-rupee note" }, { title: "note vs coin" }] },
      { sectionNumber: "12.3", title: "Making Small Amounts",   microConcepts: [{ title: "combining coins to get a total" }, { title: "enough or not enough?" }] },
    ],
    keyFormulas: ["1 ₹ = 100 paise"],
    learningObjectives: ["Recognise 1, 2, 5 rupee coins and 10-rupee note", "Combine coins to make given amounts", "Decide if a set of coins is enough to buy something"],
    prerequisiteChapters: [3],
  },
  {
    grade: "1", subject: "Mathematics", chapterNumber: 13,
    title: "How Many",
    description: "Counting sets of objects up to 20; one-to-one matching; comparing 'more', 'fewer', and 'same'.",
    sections: [
      { sectionNumber: "13.1", title: "Counting Objects",                    microConcepts: [{ title: "careful counting of a set" }, { title: "writing the number" }] },
      { sectionNumber: "13.2", title: "One-to-One Matching",                microConcepts: [{ title: "matching each item to one other" }, { title: "equal sets" }] },
      { sectionNumber: "13.3", title: "More, Fewer, and Same",              microConcepts: [{ title: "which set has more?" }, { title: "which set has fewer?" }, { title: "sets with the same number" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Count objects carefully up to 20", "Match two sets one-to-one", "Compare sets using more, fewer, same"],
    prerequisiteChapters: [2],
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
  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 1 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
