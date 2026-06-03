/**
 * AP SSC Class 8 Mathematics — Chapter 5: Data Handling
 * 4 topics. topicId: ap_ssc_math8_ch5_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch05.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch5_grouped_data",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Organising Data & Grouped Frequency Distribution",
    prerequisite_knowledge: [
      "Raw data and tally marks",
      "Reading a simple frequency table",
      "Range = highest − lowest value",
      "Counting and basic division",
    ],
    key_formulas: [
      "Range = maximum value − minimum value",
      "Class size (width) = upper limit − lower limit of a class",
      "Class mark (midpoint) = (lower limit + upper limit) / 2",
      "Frequency of a class = number of observations falling in it",
    ],
    teaching_content: {
      intuition: "When you have just a few numbers you can list them. But with hundreds of marks or heights, a raw list is useless. So we BUCKET the data into intervals (classes) like 0–10, 10–20, … and count how many fall in each. That grouped table reveals the shape of the data at a glance — where most values cluster and where they thin out.",
      derivation: "Building a grouped frequency table:\n1. Find the range = max − min.\n2. Decide a convenient class size (often 5 or 10) and number of classes (usually 5–10).\n3. Form continuous classes (e.g. 0–10, 10–20). In the 'exclusive' method an upper boundary like 10 belongs to the NEXT class (10–20), so no value is double-counted.\n4. Tally each observation into its class and count the frequency.\nThe class mark (midpoint) represents the whole class for further calculations and for plotting.",
      worked_example: "Marks of 10 students: 12, 25, 7, 33, 41, 19, 28, 22, 35, 16. Make a grouped table with class size 10.\n\nRange = 41 − 7 = 34. Use classes 0–10, 10–20, 20–30, 30–40, 40–50.\nTally: 0–10 → {7} = 1; 10–20 → {12,19,16} = 3; 20–30 → {25,28,22} = 3; 30–40 → {33,35} = 2; 40–50 → {41} = 1.\nTotal frequency = 1+3+3+2+1 = 10 ✓ (matches the number of students).",
      visual_description: "A two-column grouped frequency table (Class Interval | Frequency) for marks 0–50 in steps of 10, with a tally column. The middle classes (10–20, 20–30) have the tallest tallies, hinting at where data clusters.",
      svg_diagrams: [
        { title: "Grouped frequency table",
          svg_code: "<svg viewBox='0 0 240 130' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='10' y='15' font-weight='bold'>Class</text><text x='120' y='15' font-weight='bold'>Freq</text><text x='10' y='38'>0–10</text><text x='130' y='38'>1</text><text x='10' y='58'>10–20</text><text x='130' y='58'>3</text><text x='10' y='78'>20–30</text><text x='130' y='78'>3</text><text x='10' y='98'>30–40</text><text x='130' y='98'>2</text><text x='10' y='118'>40–50</text><text x='130' y='118'>1</text><line x1='5' y1='22' x2='180' y2='22' stroke='#333'/></svg>" }
      ],
      common_misconceptions: [
        "Double-counting a boundary value — in the exclusive method, 20 goes into 20–30, NOT 10–20.",
        "Making classes of unequal width without reason — usually keep class size constant.",
        "Confusing class size (width) with class mark (midpoint).",
        "Frequencies not adding up to the total number of observations — a sign of a tally error.",
      ],
      shortcuts_and_tricks: [
        "Class mark = average of the two limits; quick to compute for plotting.",
        "Pick class size so you get 5–10 classes — too few hides detail, too many is cluttered.",
        "Always check Σ(frequencies) = total observations before moving on.",
      ],
      when_to_use_this_method: "Use grouped frequency tables when data has many values or a wide range, before drawing a histogram or computing grouped statistics. Use a simple (ungrouped) table for small, discrete data sets.",
      edge_cases: [
        "If two adjacent classes touch (e.g. 0–10, 10–20), state the convention (upper limit excluded) to avoid overlap.",
        "Discrete data (e.g. number of children) may use ungrouped frequency instead of intervals.",
        "An open-ended class ('50 and above') has no defined class mark.",
      ],
      key_takeaway: "Group large data into equal-width classes and count frequencies. Range = max − min sets the spread; class mark = (lower + upper)/2 represents each class. Use the exclusive convention so boundary values aren't double-counted, and verify frequencies sum to the total.",
      video_script_hooks: [
        "Opening: 'A hundred test scores in a jumbled list tell you nothing. Bucket them into intervals and the story jumps out.'",
        "Mid: 'Watch the boundary: does 20 go in 10–20 or 20–30? Pick a rule and stick to it, or you'll count it twice.'",
        "Closing: 'Add up your frequencies — if they don't equal the number of students, you've miscounted somewhere.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch5_histograms",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Histograms",
    prerequisite_knowledge: [
      "Grouped frequency distribution and class intervals",
      "Reading a bar graph",
      "Plotting on a numbered axis",
      "Class marks and class boundaries",
    ],
    key_formulas: [
      "Histogram: bars over continuous class intervals, heights = frequencies",
      "Bars touch (no gaps) because the classes are continuous",
      "Bar width = class size; bar height = frequency of that class",
    ],
    teaching_content: {
      intuition: "A histogram is a bar graph for GROUPED data. Unlike an ordinary bar graph (separate categories with gaps), a histogram's bars touch — because the classes form a continuous number line with no gaps between them. The taller the bar, the more observations in that interval. The picture instantly shows the shape of the distribution.",
      derivation: "To draw a histogram from a grouped table:\n1. Put the class intervals on the horizontal axis (continuous scale, e.g. 0,10,20,…).\n2. Put frequency on the vertical axis with a suitable scale.\n3. Over each class draw a bar whose width spans the class and whose height equals the frequency.\n4. Because classes are continuous, ADJACENT BARS TOUCH (no gaps). If data starts far from 0, use a kink (zig-zag) on the axis to skip the empty range.",
      worked_example: "From the table {10–20:3, 20–30:5, 30–40:2}, describe the histogram.\n\nHorizontal axis marked 10, 20, 30, 40. Vertical axis frequency 0–5.\nBar over 10–20 of height 3, over 20–30 of height 5 (tallest), over 30–40 of height 2. The three bars touch. The peak at 20–30 shows most values lie there.",
      visual_description: "Three touching vertical bars on a continuous axis labelled 10,20,30,40 with heights 3, 5, 2. No gaps between bars. The middle bar is tallest, forming a simple peak.",
      svg_diagrams: [
        { title: "Histogram (bars touch, continuous classes)",
          svg_code: "<svg viewBox='0 0 220 140' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><line x1='30' y1='115' x2='200' y2='115' stroke='#333'/><line x1='30' y1='15' x2='30' y2='115' stroke='#333'/><rect x='30' y='65' width='50' height='50' fill='#bfdbfe' stroke='#2563eb'/><rect x='80' y='30' width='50' height='85' fill='#93c5fd' stroke='#2563eb'/><rect x='130' y='80' width='50' height='35' fill='#bfdbfe' stroke='#2563eb'/><text x='40' y='128'>10</text><text x='75' y='128'>20</text><text x='125' y='128'>30</text><text x='175' y='128'>40</text></svg>" }
      ],
      common_misconceptions: [
        "Leaving GAPS between bars (that's a bar graph) — histogram bars touch.",
        "Plotting category names instead of a continuous number scale on the x-axis.",
        "Making bar widths unequal without adjusting — for equal class sizes, all bars are the same width.",
        "Starting the axis at a far-from-zero value without a kink, distorting the picture.",
      ],
      shortcuts_and_tricks: [
        "Bars touch ⟺ data is continuous/grouped; bars with gaps ⟺ separate categories.",
        "Use a kink (≈) on the axis when the first class is far from 0.",
        "Height = frequency; the tallest bar marks the modal class.",
      ],
      when_to_use_this_method: "Use a histogram to display GROUPED/continuous data (heights, weights, marks in intervals). Use a bar graph for discrete categories (favourite sport, blood group).",
      edge_cases: [
        "Unequal class widths require frequency-density bars (height = frequency/width) — beyond basic cases but worth knowing.",
        "A class with frequency 0 leaves a gap of zero height (the axis shows through), which is correct.",
      ],
      key_takeaway: "A histogram shows grouped data as touching bars over continuous class intervals; bar width = class size, height = frequency. Touching bars (no gaps) is the key difference from an ordinary bar graph. The tallest bar is the modal class.",
      video_script_hooks: [
        "Opening: 'What's the difference between a bar graph and a histogram? One has gaps; one doesn't — and that gap means everything.'",
        "Mid: 'The bars touch because the classes flow continuously — 10–20 ends exactly where 20–30 begins.'",
        "Closing: 'The tallest bar tells you where the crowd is. That's the modal class.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch5_pie_charts",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Pie Charts (Circle Graphs)",
    prerequisite_knowledge: [
      "A full circle has 360° at the centre",
      "Fractions and percentages of a whole",
      "Using a protractor to draw angles",
      "Total of all parts = the whole",
    ],
    key_formulas: [
      "Sector angle for a category = (category value / total) × 360°",
      "Sector angle = (percentage of category / 100) × 360°",
      "Sum of all sector angles = 360°",
    ],
    teaching_content: {
      intuition: "A pie chart shows how a whole is split into parts — like slicing a pizza so each slice's size matches its share. A category that's 25% of the total gets a quarter of the circle (90°). The whole circle (360°) represents 100% of the data, and each slice's central angle is its proportional share.",
      derivation: "Each category's slice angle is its FRACTION of the total, scaled up to the full 360° of a circle:\n  angle = (value of category / total of all categories) × 360°.\nBecause the fractions of all categories add to 1 (the whole), the angles add to 360°. To draw: compute each angle, then mark them off one after another from the centre with a protractor.",
      worked_example: "A family's monthly budget (₹): Food 6000, Rent 4500, Savings 3000, Others 1500 (total 15000). Find the sector angles.\n\nFood: (6000/15000)×360° = 144°.\nRent: (4500/15000)×360° = 108°.\nSavings: (3000/15000)×360° = 72°.\nOthers: (1500/15000)×360° = 36°.\nCheck: 144 + 108 + 72 + 36 = 360°. ✓",
      visual_description: "A circle divided into four sectors labelled Food (144°, largest), Rent (108°), Savings (72°), Others (36°, smallest), each sized in proportion to its budget share, with the central angles marked.",
      svg_diagrams: [
        { title: "Pie chart of a budget (angles sum to 360°)",
          svg_code: "<svg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><circle cx='80' cy='80' r='60' fill='#eff6ff' stroke='#333'/><path d='M80 80 L140 80 A60 60 0 0 1 31 115 Z' fill='#93c5fd'/><path d='M80 80 L31 115 A60 60 0 0 1 47 27 Z' fill='#fde68a'/><path d='M80 80 L47 27 A60 60 0 0 1 116 38 Z' fill='#bbf7d0'/><path d='M80 80 L116 38 A60 60 0 0 1 140 80 Z' fill='#fecaca'/><text x='95' y='100'>Food</text><text x='40' y='75'>Rent</text><text x='62' y='40'>Sav</text></svg>" }
      ],
      common_misconceptions: [
        "Using the raw value as the angle instead of (value/total)×360°.",
        "Angles not summing to 360° — a sign of an arithmetic slip.",
        "Confusing percentage with angle: 25% is 90°, not 25°.",
        "Drawing slices roughly without a protractor, so sizes don't match the data.",
      ],
      shortcuts_and_tricks: [
        "1% of the data = 3.6° of the circle (since 360°/100 = 3.6°). So angle = percentage × 3.6°.",
        "Half the data = 180°, a quarter = 90°, a tenth = 36° — handy mental checks.",
        "Compute all angles first and verify they total 360° before drawing.",
      ],
      when_to_use_this_method: "Use a pie chart to show how parts make up a whole (budget shares, vote shares, time spent). Avoid it for showing change over time or many tiny categories — a bar/line graph is clearer there.",
      edge_cases: [
        "If values are given as percentages, use angle = % × 3.6° directly.",
        "Very small categories make slivers hard to read — sometimes grouped as 'Others'.",
        "Reverse problems: given a slice's angle, value = (angle/360°) × total.",
      ],
      key_takeaway: "A pie chart represents a whole (360° = 100%) split into proportional slices; each sector angle = (value/total) × 360° (equivalently percentage × 3.6°). All angles must sum to 360°. Use a protractor to draw them accurately.",
      video_script_hooks: [
        "Opening: 'Where does your pocket money go? A pie chart turns those amounts into slices you can see at a glance.'",
        "Mid: 'The trick is one formula: a category's slice = its share of the total, times 360 degrees.'",
        "Closing: '1% is 3.6 degrees. So 50% is 180, a quarter is 90 — and they'd better add up to a full 360.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch5_probability",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Chance and Probability",
    prerequisite_knowledge: [
      "Fractions between 0 and 1",
      "Listing all possible outcomes of a simple experiment",
      "Idea of 'equally likely' outcomes",
      "Counting favourable cases",
    ],
    key_formulas: [
      "P(event) = (number of favourable outcomes) / (total number of equally likely outcomes)",
      "0 ≤ P(event) ≤ 1  (0 = impossible, 1 = certain)",
      "P(event does NOT happen) = 1 − P(event)",
      "Sum of probabilities of all outcomes = 1",
    ],
    teaching_content: {
      intuition: "Probability measures how likely something is, on a scale from 0 (will never happen) to 1 (certain). For a fair experiment where every outcome is equally likely — a coin, a die, a well-shuffled deck — you just count: how many outcomes give you what you want, divided by how many outcomes there are in total.",
      derivation: "For an experiment with equally likely outcomes, define:\n  P(event) = favourable outcomes / total outcomes.\nExample basis: a die has 6 equally likely faces. The total is always the full list of possible outcomes (the sample space). Since favourable ≤ total, P lies between 0 and 1. If you list EVERY outcome's probability they sum to 1, which gives the complement rule: P(not E) = 1 − P(E).",
      worked_example: "A die is rolled once. Find P(getting an even number) and P(not getting a 6).\n\nSample space = {1,2,3,4,5,6}, total = 6.\nEven numbers = {2,4,6}, favourable = 3 ⟹ P(even) = 3/6 = 1/2.\nP(getting 6) = 1/6, so P(not 6) = 1 − 1/6 = 5/6.",
      visual_description: "A probability number line from 0 to 1 with markers: 0 = impossible, 1/6 ≈ unlikely (one die face), 1/2 = even chance (heads), 1 = certain. A die graphic shows the 3 even faces shaded out of 6.",
      svg_diagrams: [
        { title: "Probability scale from 0 (impossible) to 1 (certain)",
          svg_code: "<svg viewBox='0 0 300 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><line x1='20' y1='35' x2='280' y2='35' stroke='#333' stroke-width='2'/><line x1='20' y1='30' x2='20' y2='40' stroke='#333'/><line x1='150' y1='30' x2='150' y2='40' stroke='#333'/><line x1='280' y1='30' x2='280' y2='40' stroke='#333'/><text x='8' y='55'>0</text><text x='138' y='55'>1/2</text><text x='276' y='55'>1</text><text x='2' y='20' font-size='8'>impossible</text><text x='130' y='20' font-size='8'>even chance</text><text x='258' y='20' font-size='8'>certain</text></svg>" }
      ],
      common_misconceptions: [
        "Giving a probability greater than 1 or negative — impossible; P always lies in [0, 1].",
        "Forgetting outcomes must be EQUALLY LIKELY for the count formula to apply.",
        "Miscounting the sample space (e.g. thinking a coin has 3 outcomes).",
        "Confusing 'odds' with 'probability' — probability is favourable/total, not favourable:unfavourable.",
      ],
      shortcuts_and_tricks: [
        "Hard to count favourable cases? Count the complement and use P(E) = 1 − P(not E).",
        "Probability of a CERTAIN event is 1; of an IMPOSSIBLE event is 0 — quick sanity anchors.",
        "Always simplify the fraction (3/6 → 1/2).",
      ],
      when_to_use_this_method: "Use the favourable/total formula for any single simple experiment with equally likely outcomes (coins, dice, cards, coloured balls). Use the complement rule when 'not happening' is easier to count.",
      edge_cases: [
        "An impossible event (e.g. rolling a 7 on a normal die) has probability 0.",
        "A sure event (rolling a number ≤ 6) has probability 1.",
        "If outcomes are NOT equally likely (a loaded die), the simple count formula doesn't apply.",
      ],
      key_takeaway: "For equally likely outcomes, P(event) = favourable/total, always between 0 and 1. The probabilities of all outcomes sum to 1, giving P(not E) = 1 − P(E). Count the sample space carefully and simplify the answer.",
      video_script_hooks: [
        "Opening: 'Will it rain? Will the coin land heads? Probability turns 'maybe' into a number between 0 and 1.'",
        "Mid: 'For a fair die, just count: three even faces out of six. That's it — 1/2.'",
        "Closing: 'Can't easily count what you want? Count what you DON'T want and subtract from 1.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch5 (Data Handling): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
