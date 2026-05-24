import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch12_data_collection_presentation  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch12_datacollect_a01",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Data collected directly from the source (e.g., by conducting surveys) is called:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Secondary data",  type: "concept_error", logicTag: "collected_from_others" },
      { text: "Grouped data",    type: "concept_error", logicTag: "organisation_not_source" },
      { text: "Primary data",    type: "correct",       logicTag: "first_hand_collection" },
      { text: "Raw data",        type: "concept_error", logicTag: "refers_to_unprocessed" },
    ],
    solutionSteps: [
      "Primary data: collected directly by the investigator for a specific purpose.",
      "Secondary data: collected from already-published sources.",
    ],
    shortcut: "Primary = first hand; Secondary = already exists elsewhere.",
    bloomLevel: "remember", conceptTested: "Types of data: primary vs. secondary",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a02",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The difference between the maximum and minimum observations in a data set is called:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Mean",      type: "concept_error", logicTag: "average" },
      { text: "Range",     type: "correct",       logicTag: "max_minus_min" },
      { text: "Median",    type: "concept_error", logicTag: "middle_value" },
      { text: "Mode",      type: "concept_error", logicTag: "most_frequent" },
    ],
    solutionSteps: [
      "Range = Maximum value − Minimum value.",
    ],
    shortcut: "Range = Max − Min.",
    bloomLevel: "remember", conceptTested: "Definition of range",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a03",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "A tally mark //// represents:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "4",   type: "concept_error", logicTag: "four_marks" },
      { text: "5",   type: "correct",       logicTag: "four_plus_cross" },
      { text: "6",   type: "concept_error", logicTag: "wrong" },
      { text: "3",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Four vertical strokes and one diagonal cross = 5.",
      "This grouping makes counting in fives easier.",
    ],
    shortcut: "|||| = 5 (four strokes crossed by one diagonal).",
    bloomLevel: "remember", conceptTested: "Tally marks",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a04",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "A bar graph uses _____ to represent data.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Points connected by lines",     type: "concept_error", logicTag: "line_graph" },
      { text: "Rectangles (bars) of equal width", type: "correct",   logicTag: "bar_graph" },
      { text: "Sectors of a circle",           type: "concept_error", logicTag: "pie_chart" },
      { text: "Dots on a number line",         type: "concept_error", logicTag: "dot_plot" },
    ],
    solutionSteps: [
      "Bar graphs use bars (rectangles) of equal width, with heights representing values.",
    ],
    shortcut: "Bar graph = equal-width bars, height = frequency.",
    bloomLevel: "remember", conceptTested: "Definition of a bar graph",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a05",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Data: 5, 3, 8, 2, 7, 1, 9, 4, 6, 2. The range is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "7",   type: "concept_error", logicTag: "max_minus_median" },
      { text: "8",   type: "correct",       logicTag: "9_minus_1" },
      { text: "9",   type: "concept_error", logicTag: "maximum_itself" },
      { text: "6",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Max = 9, Min = 1. Range = 9 − 1 = 8.",
    ],
    shortcut: "Scan for max and min, subtract.",
    bloomLevel: "apply", conceptTested: "Calculating range from raw data",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a06",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "In a frequency distribution, the class width (class size) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Upper limit of class",                       type: "concept_error", logicTag: "wrong" },
      { text: "Upper limit − Lower limit",                  type: "correct",       logicTag: "class_width" },
      { text: "Lower limit + Upper limit",                  type: "concept_error", logicTag: "wrong" },
      { text: "Frequency of the class",                     type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Class width = Upper class limit − Lower class limit.",
    ],
    shortcut: "Class size = Upper − Lower boundary.",
    bloomLevel: "remember", conceptTested: "Class width in frequency distribution",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a07",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The class mark (mid-value) of the class 20–30 is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "20",   type: "concept_error", logicTag: "lower_limit" },
      { text: "30",   type: "concept_error", logicTag: "upper_limit" },
      { text: "25",   type: "correct",       logicTag: "average_limits" },
      { text: "10",   type: "concept_error", logicTag: "class_width" },
    ],
    solutionSteps: [
      "Class mark = (Lower limit + Upper limit)/2 = (20+30)/2 = 25.",
    ],
    shortcut: "Class mark = midpoint of class interval.",
    bloomLevel: "apply", conceptTested: "Class mark of a class interval",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a08",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "A histogram differs from a bar graph in that:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Histogram uses pie-shaped bars",             type: "concept_error", logicTag: "wrong" },
      { text: "In a histogram, bars have no gaps between them", type: "correct",  logicTag: "continuous_data" },
      { text: "A histogram shows only discrete data",      type: "concept_error", logicTag: "inverted" },
      { text: "Bar graph bars have no gaps",               type: "concept_error", logicTag: "inverted" },
    ],
    solutionSteps: [
      "Histogram: bars are adjacent (no gaps) — used for continuous data.",
      "Bar graph: gaps between bars — used for discrete/categorical data.",
    ],
    shortcut: "Histogram = no gaps (continuous); Bar graph = gaps (discrete).",
    bloomLevel: "understand", conceptTested: "Difference between histogram and bar graph",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a09",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "In a frequency distribution with classes 0–10, 10–20, 20–30, the observation 10 is counted in:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "0–10 only",        type: "concept_error", logicTag: "lower_class" },
      { text: "10–20 only",       type: "correct",       logicTag: "convention_upper_excluded" },
      { text: "Both 0–10 and 10–20", type: "concept_error", logicTag: "double_counted" },
      { text: "Neither class",    type: "concept_error", logicTag: "boundary_ignored" },
    ],
    solutionSteps: [
      "Convention: in continuous class intervals, the lower limit is included, upper limit excluded.",
      "10 belongs to 10–20 (lower limit included in the new class).",
    ],
    shortcut: "Class [10,20) includes 10 but not 20.",
    bloomLevel: "apply", conceptTested: "Class boundary convention in frequency distribution",
  },
  {
    questionId: "ap_ssc9_ch12_datacollect_a10",
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    topic: "Statistics", subtopic: "Data Collection and Presentation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "A frequency polygon is obtained by joining:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "The tops of the bars of a histogram",              type: "concept_error", logicTag: "histogram_only" },
      { text: "The midpoints of the tops of the histogram bars",  type: "correct",       logicTag: "frequency_polygon" },
      { text: "The class boundaries",                             type: "concept_error", logicTag: "wrong" },
      { text: "The frequencies plotted on y-axis",                type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Frequency polygon: plot frequencies at class marks, connect midpoints of tops of histogram bars.",
      "Extend to zero frequency at either end.",
    ],
    shortcut: "Frequency polygon = connect class mark vs. frequency points.",
    bloomLevel: "understand", conceptTested: "Construction of frequency polygon",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch12_frequency_distributions  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch12_freqdist_a01",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The sum of all frequencies in a frequency distribution equals:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "The mean",                    type: "concept_error", logicTag: "average" },
      { text: "The number of classes",       type: "concept_error", logicTag: "wrong" },
      { text: "The total number of observations", type: "correct", logicTag: "sum_frequencies" },
      { text: "The range",                   type: "concept_error", logicTag: "spread" },
    ],
    solutionSteps: [
      "Sum of all frequencies = total number of data values (n).",
    ],
    shortcut: "Σf = n (total observations).",
    bloomLevel: "remember", conceptTested: "Sum of frequencies",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a02",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Cumulative frequency of a class is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Frequency of only that class",                     type: "concept_error", logicTag: "simple_frequency" },
      { text: "Sum of frequencies up to and including that class", type: "correct",      logicTag: "cumulative_frequency" },
      { text: "Frequency divided by total",                       type: "concept_error", logicTag: "relative_frequency" },
      { text: "Frequency minus the previous class frequency",     type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Cumulative frequency = sum of frequencies of all classes up to and including the given class.",
    ],
    shortcut: "CF = running total of frequencies.",
    bloomLevel: "remember", conceptTested: "Definition of cumulative frequency",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a03",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "A frequency table shows: 10–20: 5, 20–30: 8, 30–40: 12, 40–50: 7. The cumulative frequency up to 40 is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "20",   type: "concept_error", logicTag: "wrong" },
      { text: "25",   type: "correct",       logicTag: "5+8+12" },
      { text: "32",   type: "concept_error", logicTag: "all_four" },
      { text: "13",   type: "concept_error", logicTag: "only_first_two" },
    ],
    solutionSteps: [
      "Cumulative frequency up to 40 = 5 + 8 + 12 = 25.",
    ],
    shortcut: "Add frequencies of all classes up to (and including) the stated class.",
    bloomLevel: "apply", conceptTested: "Computing cumulative frequency",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a04",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "For the data: 2, 3, 5, 3, 7, 3, 5, 8, the frequency of 3 is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1",   type: "concept_error", logicTag: "only_one" },
      { text: "2",   type: "concept_error", logicTag: "wrong" },
      { text: "3",   type: "correct",       logicTag: "appears_3_times" },
      { text: "4",   type: "concept_error", logicTag: "overcounted" },
    ],
    solutionSteps: [
      "3 appears at positions 2, 4, 6 → frequency = 3.",
    ],
    shortcut: "Count each occurrence of the value.",
    bloomLevel: "apply", conceptTested: "Finding frequency of a value",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a05",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "A class interval 20–30 has frequency 15. The relative frequency is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "15",      type: "concept_error", logicTag: "absolute_not_relative" },
      { text: "0.25",    type: "correct",       logicTag: "15_divided_by_60" },
      { text: "0.50",    type: "concept_error", logicTag: "wrong" },
      { text: "25%",     type: "concept_error", logicTag: "percentage_not_decimal" },
    ],
    solutionSteps: [
      "Given total n = 60 (assumed from context): relative frequency = 15/60 = 0.25.",
    ],
    shortcut: "Relative frequency = class frequency / total frequency.",
    bloomLevel: "apply", conceptTested: "Relative frequency",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a06",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The modal class in the frequency table (10–20: 8, 20–30: 15, 30–40: 12, 40–50: 6) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "10–20",  type: "concept_error", logicTag: "wrong" },
      { text: "20–30",  type: "correct",       logicTag: "highest_frequency" },
      { text: "30–40",  type: "concept_error", logicTag: "second_highest" },
      { text: "40–50",  type: "concept_error", logicTag: "lowest" },
    ],
    solutionSteps: [
      "Modal class = class with highest frequency.",
      "20–30 has frequency 15 — the highest.",
    ],
    shortcut: "Modal class = class with greatest frequency.",
    bloomLevel: "apply", conceptTested: "Finding modal class",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a07",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "For the grouped data 10–20: f₁, 20–30: f₂, 30–40: f₃, the class marks are:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "10, 20, 30",   type: "concept_error", logicTag: "lower_limits" },
      { text: "20, 30, 40",   type: "concept_error", logicTag: "upper_limits" },
      { text: "15, 25, 35",   type: "correct",       logicTag: "midpoints" },
      { text: "10, 25, 40",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Class marks = midpoints: (10+20)/2=15, (20+30)/2=25, (30+40)/2=35.",
    ],
    shortcut: "Class mark = (lower + upper)/2.",
    bloomLevel: "apply", conceptTested: "Class marks from class intervals",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a08",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Which graphical representation is suitable for showing cumulative frequencies?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Bar chart",           type: "concept_error", logicTag: "discrete_data" },
      { text: "Pie chart",           type: "concept_error", logicTag: "proportions" },
      { text: "Ogive (cumulative frequency curve)", type: "correct", logicTag: "ogive" },
      { text: "Pictogram",           type: "concept_error", logicTag: "pictorial" },
    ],
    solutionSteps: [
      "Ogive (or cumulative frequency curve) is used to represent cumulative frequencies.",
    ],
    shortcut: "Cumulative frequency → Ogive.",
    bloomLevel: "understand", conceptTested: "Graph for cumulative frequencies (Ogive)",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a09",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Data: 0–10: 5, 10–20: 10, 20–30: 15, 30–40: 10, 40–50: 5. Total observations =",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "40",  type: "concept_error", logicTag: "wrong" },
      { text: "45",  type: "correct",       logicTag: "5+10+15+10+5" },
      { text: "50",  type: "concept_error", logicTag: "close_but_wrong" },
      { text: "35",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Total = 5+10+15+10+5 = 45.",
    ],
    shortcut: "Sum all frequencies to get total n.",
    bloomLevel: "apply", conceptTested: "Summing frequencies in a table",
  },
  {
    questionId: "ap_ssc9_ch12_freqdist_a10",
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    topic: "Statistics", subtopic: "Frequency Distributions",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "In constructing a frequency distribution, we choose class intervals such that:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Each class has the same frequency",              type: "concept_error", logicTag: "not_required" },
      { text: "All observations are covered without overlapping", type: "correct",    logicTag: "exhaustive_mutually_exclusive" },
      { text: "Only integer values are used as limits",         type: "concept_error", logicTag: "wrong" },
      { text: "Exactly 5 classes are used always",             type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Good class intervals must: cover all data (exhaustive) and be non-overlapping (mutually exclusive).",
    ],
    shortcut: "Classes must be MECE: Mutually Exclusive and Collectively Exhaustive.",
    bloomLevel: "evaluate", conceptTested: "Principles of class interval construction",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 3: ap_ssc_math9_ch12_central_tendency  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch12_central_a01",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The arithmetic mean of 5 numbers is 12. Their sum is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "12",   type: "concept_error", logicTag: "mean_not_sum" },
      { text: "60",   type: "correct",       logicTag: "5_times_12" },
      { text: "17",   type: "concept_error", logicTag: "sum_of_count_and_mean" },
      { text: "2.4",  type: "concept_error", logicTag: "divided" },
    ],
    solutionSteps: [
      "Mean = Sum/n → Sum = Mean × n = 12 × 5 = 60.",
    ],
    shortcut: "Sum = Mean × n.",
    bloomLevel: "apply", conceptTested: "Relation between mean, sum, and count",
  },
  {
    questionId: "ap_ssc9_ch12_central_a02",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The median of the data 3, 5, 7, 9, 11 is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "5",   type: "concept_error", logicTag: "second_value" },
      { text: "9",   type: "concept_error", logicTag: "fourth_value" },
      { text: "7",   type: "correct",       logicTag: "middle_value" },
      { text: "35",  type: "concept_error", logicTag: "sum" },
    ],
    solutionSteps: [
      "Data already sorted. n=5 (odd). Median = (5+1)/2 th = 3rd value = 7.",
    ],
    shortcut: "Odd n: median is the middle value at position (n+1)/2.",
    bloomLevel: "apply", conceptTested: "Median of odd-count sorted data",
  },
  {
    questionId: "ap_ssc9_ch12_central_a03",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The mode of the data 4, 5, 6, 6, 7, 8, 6 is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "5",   type: "concept_error", logicTag: "second_value" },
      { text: "7",   type: "concept_error", logicTag: "fourth_last" },
      { text: "6",   type: "correct",       logicTag: "most_frequent" },
      { text: "8",   type: "concept_error", logicTag: "maximum" },
    ],
    solutionSteps: [
      "6 appears 3 times (most frequent) → mode = 6.",
    ],
    shortcut: "Mode = value that appears most often.",
    bloomLevel: "apply", conceptTested: "Finding the mode",
  },
  {
    questionId: "ap_ssc9_ch12_central_a04",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The median of 2, 4, 6, 8 is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "4",   type: "concept_error", logicTag: "second_value_only" },
      { text: "6",   type: "concept_error", logicTag: "third_value_only" },
      { text: "5",   type: "correct",       logicTag: "average_of_middle_two" },
      { text: "4.5", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "n=4 (even). Median = average of 2nd and 3rd values = (4+6)/2 = 5.",
    ],
    shortcut: "Even n: median = average of n/2 th and (n/2+1)th values.",
    bloomLevel: "apply", conceptTested: "Median of even-count data",
  },
  {
    questionId: "ap_ssc9_ch12_central_a05",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The mean of 10 numbers is 15. If each number is increased by 5, the new mean is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "15",   type: "concept_error", logicTag: "mean_unchanged" },
      { text: "75",   type: "concept_error", logicTag: "wrong" },
      { text: "20",   type: "correct",       logicTag: "mean_shifted_by_5" },
      { text: "150",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "When all values increase by c, the mean also increases by c.",
      "New mean = 15 + 5 = 20.",
    ],
    shortcut: "Adding constant c to all values → mean increases by c.",
    bloomLevel: "apply", conceptTested: "Effect of adding constant on mean",
  },
  {
    questionId: "ap_ssc9_ch12_central_a06",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Which measure is most affected by extreme values (outliers)?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Median",  type: "concept_error", logicTag: "robust_to_outliers" },
      { text: "Mode",    type: "concept_error", logicTag: "robust_to_outliers" },
      { text: "Mean",    type: "correct",       logicTag: "affected_by_outliers" },
      { text: "Range",   type: "concept_error", logicTag: "not_central_tendency" },
    ],
    solutionSteps: [
      "The mean uses all values in its calculation → heavily affected by outliers.",
      "Median and mode are more robust to extreme values.",
    ],
    shortcut: "Mean is most sensitive to outliers.",
    bloomLevel: "understand", conceptTested: "Sensitivity of mean to outliers",
  },
  {
    questionId: "ap_ssc9_ch12_central_a07",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "Find the mean of 10, 20, 30, 40, 50.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "25",  type: "concept_error", logicTag: "wrong" },
      { text: "30",  type: "correct",       logicTag: "150_div_5" },
      { text: "35",  type: "concept_error", logicTag: "wrong" },
      { text: "40",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Sum = 10+20+30+40+50 = 150. n=5. Mean = 150/5 = 30.",
    ],
    shortcut: "Mean of arithmetic sequence = middle term = 30.",
    bloomLevel: "apply", conceptTested: "Computing arithmetic mean",
  },
  {
    questionId: "ap_ssc9_ch12_central_a08",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The data 3, 5, 7, 9, 11, 13 has median:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "7",    type: "concept_error", logicTag: "third_value" },
      { text: "9",    type: "concept_error", logicTag: "fourth_value" },
      { text: "8",    type: "correct",       logicTag: "average_7_and_9" },
      { text: "10",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "n=6 (even). Middle two = 3rd and 4th values = 7 and 9.",
      "Median = (7+9)/2 = 8.",
    ],
    shortcut: "Even n: average of two middle values.",
    bloomLevel: "apply", conceptTested: "Median of even-count data (6 values)",
  },
  {
    questionId: "ap_ssc9_ch12_central_a09",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "The mean of n numbers is x̄. If one number equal to x̄ is added, the new mean is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "x̄ + 1",          type: "concept_error", logicTag: "wrong" },
      { text: "x̄ × (n+1)/n",    type: "concept_error", logicTag: "wrong" },
      { text: "x̄",              type: "correct",       logicTag: "mean_unchanged" },
      { text: "x̄/2",            type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "New sum = nx̄ + x̄ = (n+1)x̄.",
      "New mean = (n+1)x̄ / (n+1) = x̄.",
      "Mean is unchanged.",
    ],
    shortcut: "Adding a value equal to the mean doesn't change the mean.",
    bloomLevel: "analyse", conceptTested: "Effect of adding the mean value on mean",
  },
  {
    questionId: "ap_ssc9_ch12_central_a10",
    topicId: "ap_ssc_math9_ch12_central_tendency",
    topic: "Statistics", subtopic: "Measures of Central Tendency",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 12,
    questionText: "For the data 2, 4, 6, 8, 10: which statement is TRUE?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Mean > Median > Mode",          type: "concept_error", logicTag: "skewed" },
      { text: "Mean = Median = 6, no unique mode", type: "correct",  logicTag: "symmetric_no_mode" },
      { text: "Mode = 6",                      type: "concept_error", logicTag: "wrong" },
      { text: "Median = 5",                    type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Mean = (2+4+6+8+10)/5 = 30/5 = 6.",
      "Median: n=5, middle value = 3rd = 6.",
      "Mode: all values appear once → no unique mode.",
      "Mean = Median = 6; no mode.",
    ],
    shortcut: "Symmetric evenly spaced data → Mean = Median; no unique mode if all frequencies equal.",
    bloomLevel: "evaluate", conceptTested: "Comparing mean, median, mode for symmetric data",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  let upserted = 0, skipped = 0;
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
      if (err.code === 11000) { console.log(`  — skip ${q.questionId}`); skipped++; }
      else throw err;
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
