/**
 * AP SSC Class 9 Mathematics — Chapter 12: Statistics
 * 3 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch12.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     12-A  Collection and Presentation of Data
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch12_data_collection_presentation",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Collection and Presentation of Data",
    prerequisite_knowledge: [
      "Basic tallying and counting",
      "Reading bar graphs and pictographs from primary classes",
      "Concept of a variable and observations",
      "Arranging numbers in ascending/descending order"
    ],
    key_formulas: [
      "Primary data: collected first-hand by the investigator",
      "Secondary data: collected by someone else, used by the investigator",
      "Raw data: data in its original, unorganised form",
      "Range = Maximum value − Minimum value",
      "Class width (class size) = Upper class limit − Lower class limit",
      "Tally marks: |||| = 5 (groups of 5 for easy counting)"
    ],
    teaching_content: {
      intuition: "Statistics begins with collecting information — called data. Raw data is messy: a long list of numbers that tells you nothing at a glance. Organising it (into tables, frequency distributions, or graphs) reveals patterns: where values cluster, what is typical, what is extreme. This organisation step — from chaos to clarity — is what presentation of data is all about. A well-drawn bar chart communicates in seconds what a table of 50 numbers cannot.",
      derivation: "Steps from raw data to frequency distribution:\n\n1. Collect raw data (list of observations).\n2. Find the range: max − min.\n3. Choose a suitable class width (class size) that divides the range into 5–10 classes.\n4. Set up class intervals: [lower, upper). Decide: inclusive or exclusive upper limit.\n5. Tally each observation into its class using tally marks.\n6. Count tallies to get frequency for each class.\n7. Result: frequency distribution table (FDT).\n\nClass intervals can be:\n• Exclusive (continuous): [0,10), [10,20), [20,30)… — upper limit not included in that class.\n• Inclusive: [0,9], [10,19], [20,29]… — both limits included.",
      worked_example: "Marks of 20 students: 45,67,72,38,55,91,63,48,76,82,57,44,69,74,88,51,60,73,39,66.\n\nRange = 91−38 = 53. Choose class width = 10. Classes: 30-40, 40-50, 50-60, 60-70, 70-80, 80-90, 90-100.\n\n| Class | Tally | Frequency |\n|-------|-------|-----------|\n| 30-40 | ||    | 2         |\n| 40-50 | |||   | 3         |\n| 50-60 | ||||  | 4         |\n| 60-70 | ||||  | 4         |\n| 70-80 | ||||  | 4         |\n| 80-90 | ||    | 2         |\n| 90-100| |     | 1         |\n| Total |       | 20        |\n\nPresent as a bar chart: x-axis = class intervals, y-axis = frequency. Bar heights: 2,3,4,4,4,2,1.",
      visual_description: "Draw a two-panel layout. Left: raw data as a jumbled list of numbers. Arrow pointing right labelled 'Organise'. Right: a clean frequency distribution table with class intervals, tally marks, and frequencies. Below the table, a bar graph with labelled axes showing the same data visually. Annotate 'Range = Max−Min' on the diagram.",
      svg_diagrams: [
        {
          title: "Frequency distribution table converted to bar chart",
          svg_code: "<svg viewBox='0 0 320 180' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='150' x2='300' y2='150' stroke='#333' stroke-width='1.5'/><line x1='30' y1='20' x2='30' y2='150' stroke='#333' stroke-width='1.5'/><rect x='40' y='110' width='30' height='40' fill='#BBDEFB' stroke='#1565C0' stroke-width='1'/><rect x='80' y='95' width='30' height='55' fill='#90CAF9' stroke='#1565C0' stroke-width='1'/><rect x='120' y='70' width='30' height='80' fill='#64B5F6' stroke='#1565C0' stroke-width='1'/><rect x='160' y='70' width='30' height='80' fill='#64B5F6' stroke='#1565C0' stroke-width='1'/><rect x='200' y='70' width='30' height='80' fill='#64B5F6' stroke='#1565C0' stroke-width='1'/><rect x='240' y='110' width='30' height='40' fill='#90CAF9' stroke='#1565C0' stroke-width='1'/><text x='52' y='163' font-size='7' fill='#333'>30-40</text><text x='92' y='163' font-size='7' fill='#333'>40-50</text><text x='132' y='163' font-size='7' fill='#333'>50-60</text><text x='172' y='163' font-size='7' fill='#333'>60-70</text><text x='212' y='163' font-size='7' fill='#333'>70-80</text><text x='252' y='163' font-size='7' fill='#333'>80-90</text><text x='52' y='107' font-size='8' fill='#333' text-anchor='middle'>2</text><text x='95' y='92' font-size='8' fill='#333' text-anchor='middle'>3</text><text x='135' y='67' font-size='8' fill='#333' text-anchor='middle'>4</text><text x='175' y='67' font-size='8' fill='#333' text-anchor='middle'>4</text><text x='215' y='67' font-size='8' fill='#333' text-anchor='middle'>4</text><text x='255' y='107' font-size='8' fill='#333' text-anchor='middle'>2</text><text x='5' y='155' font-size='8'>0</text><text x='5' y='120' font-size='8'>2</text><text x='5' y='90' font-size='8'>4</text><text x='155' y='175' font-size='9' fill='#555' text-anchor='middle'>Marks →</text><text x='12' y='90' font-size='8' fill='#555' transform='rotate(-90,12,90)'>Freq</text></svg>"
        }
      ],
      common_misconceptions: [
        "Including an observation in two classes (e.g., 40 going into both 30-40 and 40-50) — define class intervals clearly as exclusive: [30,40) means 30 ≤ x < 40. The upper limit belongs to the next class.",
        "Choosing class widths that are unequal — always use equal class widths in a standard frequency distribution for fair comparison.",
        "Confusing frequency with cumulative frequency — frequency is the count in one class; cumulative frequency is the running total.",
        "Omitting the tally stage for large datasets — tallying prevents double-counting and missed observations."
      ],
      shortcuts_and_tricks: [
        "Quick class-width choice: range ÷ 5 to 10. Choose a round number (5, 10, 20) close to this quotient.",
        "Class boundaries for continuous data: subtract 0.5 from lower limit and add 0.5 to upper limit to avoid gaps (true class boundaries).",
        "Total of all frequencies = total number of observations. Use this to check your tally.",
        "For tally: group in fives (||||) — makes counting rapid and error-free."
      ],
      when_to_use_this_method: "Use frequency distribution whenever you have a large dataset (>15 observations) and need to see the distribution pattern. Use bar graphs for categorical or grouped discrete data. Switch to histograms (next topic) for continuous grouped data.",
      edge_cases: [
        "If the class width is 1 (ungrouped discrete frequency distribution): each value gets its own row — common for small integers.",
        "Open-ended classes (e.g., '60 and above'): make computation of mean/median harder — avoid unless the data genuinely extends unboundedly.",
        "Skewed data: the frequency distribution will be lopsided — most values at one end. The shape of the bar chart reveals this immediately.",
        "Single outlier: a value very far from the rest appears in an isolated class with frequency 1 — consider whether it is an error."
      ],
      key_takeaway: "Data collection (primary vs secondary) → organisation (frequency distribution table using tally marks and class intervals) → presentation (bar chart, histogram). Range = max−min. Class width = (upper−lower limit). Total frequency = n (total observations). Always verify: sum of frequencies = n.",
      video_script_hooks: [
        "Opening: 'Fifty numbers on a page. What do they tell you? Nothing — until you organise them. Group them into classes. Count the groups. Draw the bars. Now the data speaks.'",
        "Mid-lesson: 'Tally marks: four verticals, one diagonal cross for the fifth. Groups of five. Count the groups, count the extras. Impossible to miscount with tally marks.'",
        "Closing: 'A frequency distribution table is the bridge between raw data and insight. Build it carefully — with correct class intervals and tally marks — and every analysis that follows becomes easy.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     12-B  Frequency Distributions and Graphical Representations
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch12_frequency_distributions",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Graphical Representation of Data",
    prerequisite_knowledge: [
      "Frequency distribution table: class intervals and frequencies",
      "Drawing bar graphs on graph paper",
      "Coordinate axes: x-axis (horizontal), y-axis (vertical)",
      "Class width and class boundaries"
    ],
    key_formulas: [
      "Bar graph: x-axis = categories/class intervals, y-axis = frequency; bars of equal width, gaps between bars (discrete)",
      "Histogram: same as bar graph but NO gaps between bars (used for continuous grouped data)",
      "Frequency polygon: join midpoints of tops of histogram bars (+ extended to x-axis at both ends)",
      "Class midpoint (class mark) = (lower limit + upper limit) / 2",
      "Frequency density (for unequal class widths) = frequency / class width"
    ],
    teaching_content: {
      intuition: "A histogram looks like a bar chart but the bars touch — because the data is continuous (no gaps between classes). The frequency polygon connects the midpoints of the histogram bars, smoothing the histogram into a line that shows the overall shape of the data distribution. Both graphs reveal the same information — which values are common, which are rare, and whether the data is symmetrical or skewed — but in different visual styles. The polygon is especially useful for comparing two datasets on the same graph.",
      derivation: "How to draw a histogram:\n1. Draw x-axis: mark class boundaries (not class limits) at equal intervals.\n2. Draw y-axis: mark frequency (or frequency density for unequal widths).\n3. Draw a bar for each class: height = frequency, width = class width, touching adjacent bars.\n4. Label both axes and give a title.\n\nHow to draw a frequency polygon:\n1. Find each class midpoint = (lower + upper limit)/2.\n2. Plot the point (midpoint, frequency) for each class.\n3. Extend to the midpoints of the imaginary classes before the first and after the last (frequency = 0).\n4. Join all points in order with straight lines.",
      worked_example: "Using the marks data from the previous topic:\n\nClass midpoints: 35, 45, 55, 65, 75, 85, 95.\nFrequencies:       2,  3,  4,  4,  4,  2,  1.\n\nFor histogram: bars at [30,40), [40,50), …, [90,100) with heights 2,3,4,4,4,2,1 — no gaps.\n\nFor frequency polygon:\n  Points: (25,0), (35,2), (45,3), (55,4), (65,4), (75,4), (85,2), (95,1), (105,0).\n  Connect in order with straight lines.\n\nNote: the polygon closes to zero on both sides, enclosing an area equal to the total frequency (20).",
      visual_description: "Draw a histogram with bars touching. Overlay the frequency polygon on the same axes: plot midpoints at the top of each bar and connect with straight lines extended to zero on both sides. Shade the histogram bars lightly. Show both clearly on the same graph so the relationship between histogram and polygon is visible.",
      svg_diagrams: [
        {
          title: "Histogram with frequency polygon overlay — marks data",
          svg_code: "<svg viewBox='0 0 310 170' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='145' x2='295' y2='145' stroke='#333' stroke-width='1.5'/><line x1='30' y1='15' x2='30' y2='145' stroke='#333' stroke-width='1.5'/><rect x='30' y='105' width='37' height='40' fill='#BBDEFB' stroke='#1565C0' stroke-width='1'/><rect x='67' y='85' width='37' height='60' fill='#90CAF9' stroke='#1565C0' stroke-width='1'/><rect x='104' y='65' width='37' height='80' fill='#64B5F6' stroke='#1565C0' stroke-width='1'/><rect x='141' y='65' width='37' height='80' fill='#64B5F6' stroke='#1565C0' stroke-width='1'/><rect x='178' y='65' width='37' height='80' fill='#64B5F6' stroke='#1565C0' stroke-width='1'/><rect x='215' y='105' width='37' height='40' fill='#90CAF9' stroke='#1565C0' stroke-width='1'/><rect x='252' y='125' width='37' height='20' fill='#BBDEFB' stroke='#1565C0' stroke-width='1'/><polyline points='11,145 48,105 85,85 122,65 159,65 196,65 233,105 270,125 295,145' fill='none' stroke='#E91E63' stroke-width='2'/><circle cx='48' cy='105' r='3' fill='#E91E63'/><circle cx='85' cy='85' r='3' fill='#E91E63'/><circle cx='122' cy='65' r='3' fill='#E91E63'/><circle cx='159' cy='65' r='3' fill='#E91E63'/><circle cx='196' cy='65' r='3' fill='#E91E63'/><circle cx='233' cy='105' r='3' fill='#E91E63'/><circle cx='270' cy='125' r='3' fill='#E91E63'/><text x='163' y='160' font-size='8' fill='#1565C0'>Histogram</text><text x='200' y='75' font-size='8' fill='#E91E63'>Freq. Polygon</text></svg>"
        }
      ],
      common_misconceptions: [
        "Drawing a bar graph with gaps for continuous data — histograms have NO gaps; gaps are only for discrete/categorical bar graphs.",
        "Using class limits instead of class boundaries on the x-axis of a histogram — for continuous exclusive intervals [30,40), the class boundaries are 30 and 40 directly.",
        "Frequency polygon: starting and ending at the first and last class midpoints instead of extending to zero — the polygon must close to zero to represent the distribution properly.",
        "Class midpoint calculated as (f₁+f₂)/2 using frequencies instead of (L+U)/2 using limits — midpoint uses the class boundaries, not the frequencies."
      ],
      shortcuts_and_tricks: [
        "Class midpoint shortcut: for class [30, 40), midpoint = (30+40)/2 = 35. Always average the two boundaries.",
        "Frequency polygon: plot (midpoint, frequency) pairs. Do not plot (class boundary, frequency) — that gives the histogram shape, not the polygon.",
        "Checking polygon closure: the first and last points should be at (midpoint of imaginary previous class, 0) and (midpoint of imaginary next class, 0). The area under the polygon equals total frequency.",
        "For comparing two datasets: draw two frequency polygons on the same axes. They can overlap and cross, making comparison easy."
      ],
      when_to_use_this_method: "Draw a histogram for grouped continuous data where class width matters. Draw a frequency polygon to show the trend and compare distributions. Use bar graphs for discrete/categorical data. Use histograms + polygons for continuous grouped data (marks, heights, weights, temperatures).",
      edge_cases: [
        "Unequal class widths: use frequency density (= frequency/class width) on the y-axis so that bar areas are proportional to frequencies.",
        "Frequency polygon for comparing: if one dataset has more classes than another, extend the shorter polygon's baseline to cover the same x-range.",
        "Cumulative frequency polygon (ogive): plots cumulative frequency vs upper class boundary — used to find median, quartiles. Covered in Class 10 in more detail.",
        "Very large class width: few tall bars — misses detail. Very small class width: many short bars — hides overall pattern. Choose judiciously."
      ],
      key_takeaway: "Histogram: bars for continuous grouped data, no gaps, bars touch. Frequency polygon: connect midpoints of bar tops, extend to zero on both sides. Class midpoint = (L+U)/2. Both show the distribution shape — histogram emphasises individual classes; polygon emphasises the overall trend and is used for comparison.",
      video_script_hooks: [
        "Opening: 'Bar graph: gaps between bars — discrete data. Histogram: no gaps — continuous data. One rule, one difference. The presence or absence of gaps tells you which type of data you have.'",
        "Mid-lesson: 'Frequency polygon: mark the top-centre of each bar. Connect the dots. Extend to zero on both sides. You have smoothed the histogram into a curve — the shape of the distribution made visible.'",
        "Closing: 'Two datasets, two frequency polygons, same graph. Where they cross, the frequencies are equal. Where one is higher, that dataset dominates. Visual comparison without a single number.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     12-C  Measures of Central Tendency
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch12_central_tendency",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Measures of Central Tendency: Mean, Median, Mode",
    prerequisite_knowledge: [
      "Frequency distribution table",
      "Arranging data in ascending order",
      "Fractions and division for averages",
      "Basic algebra for finding unknown values from a known mean"
    ],
    key_formulas: [
      "Arithmetic Mean (ungrouped): x̄ = (Σxᵢ) / n  = sum of all observations / number of observations",
      "Mean (frequency distribution): x̄ = Σ(fᵢxᵢ) / Σfᵢ  where xᵢ = class midpoint",
      "Median (odd n): middle value after sorting = ((n+1)/2)th term",
      "Median (even n): average of (n/2)th and (n/2+1)th terms after sorting",
      "Mode: the observation with the highest frequency",
      "Empirical relationship: Mode ≈ 3 Median − 2 Mean  (for moderately skewed data)"
    ],
    teaching_content: {
      intuition: "Three ways to describe the 'centre' of a dataset: Mean (the mathematical average — add all, divide by n), Median (the middle value when sorted — half above, half below), Mode (the most common value — the peak of the distribution). Each captures a different aspect of 'typical'. The mean is sensitive to extremes (outliers pull it away). The median is resistant to outliers (it only cares about position). The mode describes the most popular value. For a perfectly symmetric dataset all three are equal; for skewed data they diverge, revealing the direction of skew.",
      derivation: "Why the mean formula works:\nIf all n values were replaced by a single value x̄, the sum should remain the same:\nn × x̄ = x₁ + x₂ + … + xₙ = Σxᵢ\n∴ x̄ = Σxᵢ/n.\n\nFor frequency distribution:\nEach class midpoint xᵢ appears fᵢ times.\nTotal sum = Σ(fᵢ × xᵢ). Total count = Σfᵢ = n.\nx̄ = Σ(fᵢxᵢ) / n.\n\nMedian derivation:\nSort data. Locate the middle position.\nOdd n = 2k+1: middle is at position k+1 → median = (k+1)th value.\nEven n = 2k: two middle values at positions k and k+1 → median = average of the two.",
      worked_example: "Dataset: 3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29.\n\nMean: Sum = 3+7+5+13+20+23+39+23+40+23+14+12+56+23+29 = 330. n=15. Mean = 330/15 = 22.\n\nMedian: Sort: 3,5,7,12,13,14,20,23,23,23,23,29,39,40,56. n=15 (odd). Middle = 8th term = 23.\n\nMode: 23 appears 4 times (most frequent). Mode = 23.\n\nFor grouped data (marks table from earlier):\n  Class:  35,45,55,65,75,85,95  (midpoints)\n  Freq:    2, 3, 4, 4, 4, 2, 1\n  Σ(fx) = 2×35+3×45+4×55+4×65+4×75+2×85+1×95\n        = 70+135+220+260+300+170+95 = 1250\n  n = 20. Mean = 1250/20 = 62.5 marks.",
      visual_description: "Draw a number line with the sorted dataset. Mark the mean (x̄) with a blue triangle — it is the 'balance point'. Mark the median with a green line — exactly half the data on each side. Mark the mode with a red star — the value that appears most often. For skewed data, show mean pulled toward the long tail while median stays near the centre.",
      svg_diagrams: [
        {
          title: "Mean (balance point), Median (middle), Mode (peak) on a number line",
          svg_code: "<svg viewBox='0 0 320 140' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='80' x2='300' y2='80' stroke='#333' stroke-width='2'/><circle cx='50' cy='80' r='4' fill='#555'/><circle cx='70' cy='80' r='4' fill='#555'/><circle cx='90' cy='80' r='4' fill='#555'/><circle cx='130' cy='80' r='4' fill='#555'/><circle cx='150' cy='80' r='4' fill='#555'/><circle cx='155' cy='80' r='4' fill='#555'/><circle cx='160' cy='80' r='4' fill='#555'/><circle cx='200' cy='80' r='4' fill='#555'/><circle cx='240' cy='80' r='4' fill='#555'/><circle cx='280' cy='80' r='4' fill='#555'/><polygon points='155,55 148,68 162,68' fill='#4CAF50'/><text x='140' y='50' font-size='9' fill='#4CAF50'>Median</text><polygon points='175,55 168,68 182,68' fill='#1565C0'/><text x='158' y='45' font-size='9' fill='#1565C0'>Mean</text><circle cx='160' cy='80' r='7' fill='none' stroke='#E91E63' stroke-width='2'/><text x='142' y='108' font-size='9' fill='#E91E63'>Mode</text><text x='10' y='130' font-size='8' fill='#555'>Mean = balance point | Median = middle | Mode = most frequent</text></svg>"
        }
      ],
      common_misconceptions: [
        "Mean = middle value — FALSE. The mean is the arithmetic average (sum/n). The middle value is the median.",
        "Mode = mean when all values are equal — TRUE, but this doesn't mean they are always equal. They coincide only for symmetric distributions.",
        "Median is unaffected by every change in data — only the middle values matter. Changing an extreme value does not change the median (as long as it stays extreme).",
        "For grouped data, the mean is computed using class MIDPOINTS, not class limits — use (L+U)/2 for each class before multiplying by frequency."
      ],
      shortcuts_and_tricks: [
        "For sorted odd-n data: count (n+1)/2 from the left to find the median term. For n=15: (15+1)/2 = 8th term.",
        "For sorted even-n data: average the (n/2)th and (n/2+1)th terms. For n=16: average 8th and 9th terms.",
        "Mean shortcut (assumed mean): choose a convenient 'assumed mean' A, compute deviations d = x−A, then x̄ = A + Σ(fd)/n. Reduces arithmetic.",
        "Mode quick-find: in a frequency table, mode = value (or class) with the highest frequency. No formula needed for ungrouped discrete data."
      ],
      when_to_use_this_method: "Use the mean for symmetric data with no outliers — it uses all observations and is algebraically tractable. Use the median for skewed data or when outliers are present — it is robust. Use the mode for categorical data or to find the most popular item. All three together give a complete picture of the centre.",
      edge_cases: [
        "No mode: if all values appear equally often, there is no mode (or every value is a mode — depends on convention).",
        "Bimodal data: two values tie for highest frequency — both are modes. The distribution has two peaks.",
        "For n=1 (single observation): mean = median = mode = that one value.",
        "Extreme outlier impact: one very large value can pull the mean far above the median. e.g., salaries in a company where the CEO earns 1000× the workers — mean salary is misleading, median is more representative."
      ],
      key_takeaway: "Mean = Σx/n (sensitive to outliers). Median = middle value after sorting (resistant to outliers). Mode = most frequent value (describes the peak). For grouped data: use midpoints to compute mean. Empirical relation: Mode ≈ 3Median − 2Mean. All three measure the 'centre' of the data but from different perspectives.",
      video_script_hooks: [
        "Opening: 'Five friends earn ₹10,000, ₹12,000, ₹11,000, ₹13,000, and ₹1,00,000. Average salary? ₹29,200. Does that represent them? The median (₹12,000) does. The mean is fooled by one extreme value — the median never is.'",
        "Mid-lesson: 'Mean: add all, divide by n. One line. Median: sort, find the middle. Two lines. Mode: find the most repeated. One scan. The simplest measures are sometimes the most powerful.'",
        "Closing: 'Mean, median, mode. Three lenses on the same dataset. A skilled analyst uses all three — and knows which to trust when the data is messy.'"
      ]
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 12: Statistics…");
  let upserted = 0, skipped = 0;
  for (const t of TOPICS) {
    try {
      await NcertTopicContent.findOneAndUpdate({ topicId: t.topicId }, { $set: t }, { upsert: true, new: true });
      console.log(`  ✓ ${t.topicId}`); upserted++;
    } catch (err) {
      if (err.code === 11000) { console.log(`  ↩ ${t.topicId} (skip)`); skipped++; } else throw err;
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect(); process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
