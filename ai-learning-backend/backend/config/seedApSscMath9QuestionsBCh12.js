import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Data Collection and Presentation (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch12_data_b01",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics",
    subtopic: "Data Collection and Presentation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "The marks obtained by 30 students in a test are given below. Construct a frequency distribution table with class intervals of width 10, starting from 10.\n\n43 48 65 57 31 60 37 44 75 25 34 56 68 79 52 82 36 41 68 63 45 51 73 37 89 42 61 54 40 70",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "Arrange the class intervals starting from 10–20.",
      "10–20: 0 students.",
      "20–30: 25 → 1 student.",
      "30–40: 31, 34, 36, 37, 37 → 5 students.",
      "40–50: 43, 44, 40, 41, 48, 42, 45 → 7 students.",
      "50–60: 57, 56, 52, 51, 54 → 5 students.",
      "60–70: 65, 60, 68, 68, 63, 61 → 6 students.",
      "70–80: 75, 79, 73, 70 → 4 students.",
      "80–90: 82, 89 → 2 students.",
      "Total: 1+5+7+5+6+4+2 = 30. ✓",
    ],
    shortcut: "Tally each data point into its class interval. Total tallies must equal total observations.",
    bloomLevel: "apply",
    conceptTested: "Constructing grouped frequency distribution",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_data_b02",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics",
    subtopic: "Data Collection and Presentation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "Distinguish between: (i) primary and secondary data, (ii) raw data and grouped data, (iii) a bar graph and a histogram. Give one example of each.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 6,
    options: [],
    solutionSteps: [
      "(i) Primary data: collected directly by the investigator (e.g., survey of students' heights in class).",
      "    Secondary data: obtained from existing sources (e.g., census data from the government).",
      "(ii) Raw data: original, unorganised observations (e.g., list of marks: 45, 72, 38, 90, 55).",
      "    Grouped data: organised into class intervals (e.g., 30–40: 2, 40–50: 5, …).",
      "(iii) Bar graph: used for discrete or categorical data; bars have equal width and gaps between them.",
      "     Example: Number of students in each section A, B, C, D.",
      "     Histogram: used for continuous, grouped data; bars touch each other (no gaps).",
      "     Example: Frequency distribution of marks in the range 10–100.",
    ],
    shortcut: "Bar graph: discrete/categorical, gaps present. Histogram: continuous, no gaps.",
    bloomLevel: "understand",
    conceptTested: "Types of data and graphical representations",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_data_b03",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics",
    subtopic: "Data Collection and Presentation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "A frequency distribution of the ages of 50 patients is given below. Draw a frequency polygon (describe the steps to plot it).\n\nAge (years): 10–20, 20–30, 30–40, 40–50, 50–60, 60–70\nFrequency:       5,    15,    20,     8,     2",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "The table has 5 frequencies for 6 intervals listed — assuming 60–70 has 0 patients.",
      "Step 1: Find class marks (midpoints).",
      "10–20 → 15; 20–30 → 25; 30–40 → 35; 40–50 → 45; 50–60 → 55; 60–70 → 65.",
      "Step 2: Add imaginary classes with frequency 0 at each end.",
      "0–10 → (5, 0) and 70–80 → (75, 0).",
      "Step 3: Plot points (class mark, frequency): (5,0), (15,5), (25,15), (35,20), (45,8), (55,2), (65,0), (75,0).",
      "Step 4: Join consecutive points with straight line segments.",
      "Step 5: The figure formed (polygon) is the frequency polygon.",
    ],
    shortcut: "Frequency polygon uses class marks (not boundaries). Add zero-frequency classes at both ends to close the polygon.",
    bloomLevel: "apply",
    conceptTested: "Frequency polygon construction",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_data_b04",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics",
    subtopic: "Data Collection and Presentation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "Find the range of the following data and explain what it represents: 17, 5, 13, 25, 9, 41, 3, 28, 20, 8.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Maximum value = 41. Minimum value = 3.",
      "Range = Maximum − Minimum = 41 − 3 = 38.",
      "Range represents the spread of the data — how far apart the largest and smallest values are.",
      "A large range indicates high variability; a small range indicates data is closely clustered.",
    ],
    shortcut: "Range = max − min. It measures variability but is affected by outliers.",
    bloomLevel: "understand",
    conceptTested: "Range of a dataset",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Frequency Distributions (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch12_freq_b01",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics",
    subtopic: "Frequency Distributions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "The following is a cumulative frequency distribution. Convert it into a frequency distribution.\n\nClass interval: 0–10, 0–20, 0–30, 0–40, 0–50\nCumulative frequency: 5, 12, 22, 35, 50",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "0–10: cf = 5 → f = 5.",
      "10–20: cf = 12 → f = 12 − 5 = 7.",
      "20–30: cf = 22 → f = 22 − 12 = 10.",
      "30–40: cf = 35 → f = 35 − 22 = 13.",
      "40–50: cf = 50 → f = 50 − 35 = 15.",
      "Total: 5 + 7 + 10 + 13 + 15 = 50. ✓",
    ],
    shortcut: "Each class frequency = (current cumulative frequency) − (previous cumulative frequency).",
    bloomLevel: "apply",
    conceptTested: "Converting cumulative to regular frequency distribution",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_freq_b02",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics",
    subtopic: "Frequency Distributions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "The following are the runs scored by a batsman in 10 innings: 38, 70, 48, 34, 42, 55, 63, 46, 54, 44. Find the class mark of the class containing the maximum frequency if class width is 10.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Arrange data: 34, 38, 42, 44, 46, 48, 54, 55, 63, 70.",
      "Class intervals (width 10): 30–40, 40–50, 50–60, 60–70, 70–80.",
      "30–40: 34, 38 → f = 2.",
      "40–50: 42, 44, 46, 48 → f = 4 (maximum).",
      "50–60: 54, 55 → f = 2.",
      "60–70: 63 → f = 1.",
      "70–80: 70 → f = 1.",
      "Class with maximum frequency: 40–50.",
      "Class mark = (40 + 50)/2 = 45.",
    ],
    shortcut: "Class mark = (lower limit + upper limit)/2.",
    bloomLevel: "apply",
    conceptTested: "Class mark and modal class identification",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_freq_b03",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics",
    subtopic: "Frequency Distributions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "Draw an ogive for the following frequency distribution. What does an ogive represent?\n\nMarks: 0–20, 20–40, 40–60, 60–80, 80–100\nFrequency: 4, 8, 16, 12, 10",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Compute cumulative frequencies:",
      "0–20: cf = 4.",
      "0–40: cf = 4 + 8 = 12.",
      "0–60: cf = 12 + 16 = 28.",
      "0–80: cf = 28 + 12 = 40.",
      "0–100: cf = 40 + 10 = 50.",
      "Plot points using upper class boundary and cumulative frequency:",
      "(20, 4), (40, 12), (60, 28), (80, 40), (100, 50).",
      "Also start with (0, 0) as the ogive begins at the lower boundary of the first class.",
      "Join these points with a smooth curve (or straight lines).",
      "An ogive (cumulative frequency curve) shows how many observations fall below a given value. Used to find median, quartiles, and percentiles graphically.",
    ],
    shortcut: "Ogive points: (upper class boundary, cumulative frequency). Always starts at (lower boundary of first class, 0).",
    bloomLevel: "apply",
    conceptTested: "Ogive construction and interpretation",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_freq_b04",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics",
    subtopic: "Frequency Distributions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "Explain the difference between 'frequency' and 'relative frequency'. If the total number of observations is 200 and the frequency of a class is 50, what is its relative frequency?",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Frequency: the count of observations falling in a class interval.",
      "Relative frequency: the proportion (or fraction) of observations in a class = frequency / total observations.",
      "Relative frequency = 50/200 = 0.25 (or 25%).",
    ],
    shortcut: "Relative frequency = (class frequency) / (total). Sum of all relative frequencies = 1.",
    bloomLevel: "understand",
    conceptTested: "Frequency vs. relative frequency",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Measures of Central Tendency (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch12_central_b01",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics",
    subtopic: "Measures of Central Tendency",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "Find the mean, median, and mode of the following data: 4, 7, 4, 9, 2, 4, 6, 7, 3, 8.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "Arrange: 2, 3, 4, 4, 4, 6, 7, 7, 8, 9. n = 10.",
      "Mean = (2+3+4+4+4+6+7+7+8+9)/10 = 54/10 = 5.4.",
      "Median (n = 10, even): average of 5th and 6th terms = (4 + 6)/2 = 5.",
      "Mode = 4 (appears 3 times, most frequent).",
    ],
    shortcut: "Mean = sum/n. Median = middle value(s). Mode = most frequent.",
    bloomLevel: "apply",
    conceptTested: "Mean, median, mode — ungrouped data",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_central_b02",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics",
    subtopic: "Measures of Central Tendency",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "The mean of 10 numbers is 35. If one number 50 is removed and another number is added and the new mean becomes 33, find the added number.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "Sum of original 10 numbers = 10 × 35 = 350.",
      "After removing 50: sum of remaining 9 numbers = 350 − 50 = 300.",
      "After adding new number x: sum = 300 + x, and n = 10.",
      "New mean = (300 + x)/10 = 33 → 300 + x = 330 → x = 30.",
      "The added number is 30.",
    ],
    shortcut: "New sum = new mean × new n. Work backwards from sum changes.",
    bloomLevel: "apply",
    conceptTested: "Effect of adding/removing a number on the mean",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_central_b03",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics",
    subtopic: "Measures of Central Tendency",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "Find the mean of the following frequency distribution:\n\nClass: 10–30, 30–50, 50–70, 70–90, 90–110\nFrequency: 5, 8, 12, 6, 4",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Class marks (xᵢ): 20, 40, 60, 80, 100.",
      "fᵢ × xᵢ: 5×20=100, 8×40=320, 12×60=720, 6×80=480, 4×100=400.",
      "Σfᵢ = 5+8+12+6+4 = 35.",
      "Σfᵢxᵢ = 100+320+720+480+400 = 2020.",
      "Mean = Σfᵢxᵢ / Σfᵢ = 2020/35 = 57.71 (approx 57.7).",
    ],
    shortcut: "Mean = Σ(f × x) / Σf where x = class mark.",
    bloomLevel: "apply",
    conceptTested: "Mean of grouped frequency distribution",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch12_central_b04",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics",
    subtopic: "Measures of Central Tendency",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 12,
    questionText:
      "When is the median more appropriate than the mean as a measure of central tendency? Give two real-life examples.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "The median is more appropriate than the mean when the data contains extreme values (outliers) that would skew the mean.",
      "Example 1 — Salaries: If 9 employees earn ₹20,000 each but the CEO earns ₹10,00,000, the mean salary is much higher than what a typical employee earns. The median (₹20,000) better represents the central tendency.",
      "Example 2 — House prices: In a locality where most houses cost ₹50 lakh but one costs ₹5 crore, the mean is distorted. The median gives a better idea of the typical house price.",
    ],
    shortcut: "Use median when data is skewed or has outliers. Mean is sensitive to extreme values; median is not.",
    bloomLevel: "evaluate",
    conceptTested: "When to use median over mean",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 12 (Statistics)…");

  let upserted = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      await Question.findOneAndUpdate(
        { questionId: q.questionId },
        { $set: q },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${q.questionId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  — skip ${q.questionId}`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
