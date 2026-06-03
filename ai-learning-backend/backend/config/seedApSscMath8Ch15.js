/**
 * AP SSC Class 8 Mathematics — Chapter 15: Introduction to Graphs
 * 3 topics. topicId: ap_ssc_math8_ch15_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch15.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch15_types_of_graphs",
    subject: "Mathematics",
    chapterNumber: 15,
    name: "Types of Graphs: Bar, Pie, Histogram, Line",
    prerequisite_knowledge: ["Reading a bar graph and a pie chart", "Frequency tables and histograms", "Percentages (for pie charts)", "Continuous vs categorical data"],
    key_formulas: ["Bar graph: categorical data, separated bars, height = value", "Histogram: grouped/continuous data, touching bars", "Pie chart: parts of a whole, sector angle = (value/total)×360°", "Line graph: shows CHANGE over time (points joined by line segments)"],
    teaching_content: {
      intuition: "Different data needs different pictures. Use a BAR graph to compare separate categories, a HISTOGRAM for grouped continuous data (bars touch), a PIE chart to show parts of a whole, and a LINE graph to show how something CHANGES over time. Picking the right graph is half the skill; reading values off it is the other half.",
      derivation: "Each graph matches a data type: \n• Bar graph — discrete categories (favourite sport): equal-width bars with GAPS, height = value. \n• Histogram — continuous grouped data (heights in intervals): bars TOUCH because classes are continuous. \n• Pie chart — proportions of a whole: each slice angle = (value/total)×360°. \n• Line graph — a quantity tracked over time (temperature by hour): plot points and join them; the slope shows rate of change.",
      worked_example: "Which graph fits each? (a) Number of students per favourite fruit; (b) Daily temperature over a week; (c) Marks grouped 0–10, 10–20, …; (d) How a budget is divided.\n\n(a) Bar graph (categories). (b) Line graph (change over time). (c) Histogram (continuous groups). (d) Pie chart (parts of a whole).",
      visual_description: "A 2×2 chart-type gallery: a bar graph (gapped bars), a histogram (touching bars), a pie chart (slices), and a line graph (rising/falling line over time), each captioned with its data type.",
      svg_diagrams: [{ title: "Four graph types and their uses", svg_code: "<svg viewBox='0 0 230 90' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='8'><rect x='10' y='30' width='8' height='30' fill='#2563eb'/><rect x='22' y='20' width='8' height='40' fill='#2563eb'/><text x='8' y='75'>bar</text><rect x='60' y='30' width='12' height='30' fill='#16a34a'/><rect x='72' y='15' width='12' height='45' fill='#16a34a'/><text x='58' y='75'>histogram</text><circle cx='130' cy='40' r='18' fill='#fde68a' stroke='#333'/><path d='M130 40 L148 40 A18 18 0 0 1 130 58 Z' fill='#fecaca'/><text x='120' y='75'>pie</text><polyline points='185,55 200,35 215,45 225,25' fill='none' stroke='#dc2626'/><text x='190' y='75'>line</text></svg>" }],
      common_misconceptions: ["Using a bar graph with gaps for continuous data (should be a touching-bar histogram).", "Using a pie chart to show change over time (use a line graph).", "Confusing histogram and bar graph (gaps vs touching).", "Reading a line graph as separate points instead of a trend."],
      shortcuts_and_tricks: ["Categories → bar; grouped/continuous → histogram; parts of a whole → pie; over time → line.", "Pie slice = (value/total)×360° = percentage×3.6°.", "Line graph slope up = increasing, down = decreasing, flat = no change."],
      when_to_use_this_method: "Use to CHOOSE the right graph for a data set and to READ values, comparisons, totals and trends from each type in exams and real reports.",
      edge_cases: ["A double bar graph compares two data sets side by side per category.", "A line graph can show multiple lines for comparison.", "Some data suits more than one graph; pick the one that answers the question best."],
      key_takeaway: "Match the graph to the data: bar (categories, gaps), histogram (continuous groups, touching), pie (parts of a whole, angle=value/total×360°), line (change over time). Read values, comparisons and trends appropriately for each.",
      video_script_hooks: ["Opening: 'Same numbers, four different pictures. Choosing the RIGHT graph is where most marks are won or lost.'", "Mid: 'Bars with gaps compare categories; bars that TOUCH show continuous data. One letter of difference, totally different graph.'", "Closing: 'Tracking something over time? Only a line graph shows the trend at a glance.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch15_coordinate_plane",
    subject: "Mathematics",
    chapterNumber: 15,
    name: "The Coordinate Plane and Plotting Points",
    prerequisite_knowledge: ["Number line (positive direction)", "Ordered pairs", "Horizontal and vertical directions", "Reading a grid reference"],
    key_formulas: ["A point is located by an ordered pair (x, y)", "x-coordinate (abscissa) = horizontal distance from the y-axis", "y-coordinate (ordinate) = vertical distance from the x-axis", "Origin = (0, 0); axes meet there"],
    teaching_content: {
      intuition: "The coordinate plane is a map made of two number lines crossing at right angles: the horizontal x-axis and the vertical y-axis. Every point gets an address — an ordered pair (x, y) — telling you how far ACROSS (x) and how far UP (y) to go from the origin. Order matters: (3, 5) and (5, 3) are different places.",
      derivation: "Start at the origin (0,0) where the axes cross. To plot (x, y): move x units horizontally (right if positive) along the x-axis, then y units vertically (up if positive). The first number is always the horizontal (x), the second the vertical (y) — remember 'along the corridor, then up the stairs'. At Class 8 we mainly use the first quadrant (both positive).",
      worked_example: "Plot A(3, 4) and B(5, 0), and state where B lies.\n\nA(3,4): from origin go 3 right, then 4 up — a point in the first quadrant.\nB(5,0): go 5 right, 0 up — B lies ON the x-axis (its y-coordinate is 0).",
      visual_description: "A first-quadrant grid with x- and y-axes labelled; point A plotted at (3,4) with dashed guide-lines 3 across and 4 up; point B at (5,0) sitting on the x-axis.",
      svg_diagrams: [{ title: "Plotting (3,4) on the coordinate plane", svg_code: "<svg viewBox='0 0 130 120' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><line x1='20' y1='100' x2='120' y2='100' stroke='#333'/><line x1='20' y1='10' x2='20' y2='100' stroke='#333'/><circle cx='80' cy='50' r='3' fill='#2563eb'/><line x1='20' y1='50' x2='80' y2='50' stroke='#999' stroke-dasharray='2 2'/><line x1='80' y1='100' x2='80' y2='50' stroke='#999' stroke-dasharray='2 2'/><text x='82' y='46' fill='#2563eb'>(3,4)</text><text x='10' y='108'>O</text></svg>" }],
      common_misconceptions: ["Swapping the coordinates — plotting (3,4) as 4 across and 3 up.", "Going up first then across (the x-coordinate comes FIRST).", "Confusing which axis is x (horizontal) and which is y (vertical).", "Misreading a point on an axis (a point on the x-axis has y = 0)."],
      shortcuts_and_tricks: ["'Along the corridor, then up the stairs' — x first (horizontal), y second (vertical).", "Point on the x-axis ⟹ y = 0; point on the y-axis ⟹ x = 0.", "The origin is (0,0); coordinates are written (x, y) in that order."],
      when_to_use_this_method: "Use to plot and read points, set up data for line/linear graphs, and locate positions on any coordinate grid (maps, charts).",
      edge_cases: ["A point on the y-axis has x = 0, e.g. (0, 4).", "The origin (0,0) is on both axes.", "Class 8 focuses on the first quadrant; negative coordinates come in Class 9."],
      key_takeaway: "The coordinate plane locates points by ordered pairs (x, y): x is the horizontal distance from the y-axis, y the vertical distance from the x-axis, measured from the origin (0,0). Order matters — x always first ('corridor then stairs').",
      video_script_hooks: ["Opening: 'Every point on this grid has an address — two numbers that tell you exactly where it lives.'", "Mid: 'Along the corridor, THEN up the stairs. x first, y second — never the other way.'", "Closing: '(3,4) and (4,3) are different spots. In coordinates, order is everything.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch15_linear_graphs",
    subject: "Mathematics",
    chapterNumber: 15,
    name: "Linear Graphs and Their Applications",
    prerequisite_knowledge: ["Plotting points (x, y)", "Direct proportion", "Tables of values", "Reading values off a graph"],
    key_formulas: ["A LINEAR graph is a straight line (points lie on one line)", "Make a table of (x, y) values, plot, then join with a straight line", "Direct proportion graphs are straight lines THROUGH the origin", "Read off: given x, go up to the line then across to y (and vice versa)"],
    teaching_content: {
      intuition: "When the relationship between two quantities is steady, their graph is a straight LINE. Distance covered at constant speed, cost for a fixed price per item, simple interest over years — all plot as lines. Once you have the line, you can READ OFF answers: pick any x, slide up to the line, across to the y-axis, and you have the value — no formula needed.",
      derivation: "To draw a linear graph: build a table of at least two (preferably three) (x, y) pairs from the relationship, plot them, and join with a ruler. Because the relationship is linear, the points line up; a third point is a useful CHECK (if it's off the line, recompute). To READ the graph, go vertically from a known x up to the line, then horizontally to the y-axis (or the reverse). Direct-proportion relationships give lines passing through the origin.",
      worked_example: "A car travels at 40 km/h. Draw distance vs time and read the distance after 2.5 hours.\n\nTable: (0,0), (1,40), (2,80), (3,120). Plot and join — a straight line through the origin.\nAt t = 2.5 h: go up to the line, across to read ≈ 100 km. (Check: 40×2.5 = 100 km ✓.)",
      visual_description: "A straight line through the origin on a distance(km)–time(h) grid passing through (1,40),(2,80),(3,120); a dashed read-off at t=2.5 meeting the line and projecting across to 100 km.",
      svg_diagrams: [{ title: "Distance–time linear graph (read-off at 2.5 h)", svg_code: "<svg viewBox='0 0 140 120' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='8'><line x1='20' y1='100' x2='130' y2='100' stroke='#333'/><line x1='20' y1='10' x2='20' y2='100' stroke='#333'/><line x1='20' y1='100' x2='120' y2='20' stroke='#2563eb' stroke-width='2'/><line x1='80' y1='100' x2='80' y2='52' stroke='#999' stroke-dasharray='2 2'/><line x1='20' y1='52' x2='80' y2='52' stroke='#999' stroke-dasharray='2 2'/><text x='60' y='112'>time (h)</text><text x='82' y='50' fill='#16a34a' font-size='7'>≈100km</text></svg>" }],
      common_misconceptions: ["Plotting points but joining them with a CURVE or zig-zag instead of a straight line.", "Reading the graph in the wrong direction (mixing up which axis is which).", "Plotting only one point (need at least two to draw a line, three to check).", "Assuming every graph is linear — only steady/constant-rate relationships are."],
      shortcuts_and_tricks: ["Two points define a line; plot a THIRD as a check.", "Direct proportion ⟹ line through the origin (0,0).", "To read: up from x to the line, across to y (or reverse). Use a ruler for accuracy."],
      when_to_use_this_method: "Use linear graphs for constant-rate relationships (distance–time at fixed speed, cost–quantity, simple interest) — to visualise, interpolate, and read off values without recomputing.",
      edge_cases: ["A non-constant rate gives a CURVE, not a straight line.", "If the line doesn't pass through the origin, there's a fixed starting amount (e.g. a base fee).", "Reading between plotted points (interpolation) is valid for a straight line."],
      key_takeaway: "Steady relationships plot as straight LINES. Build a small table of (x,y) values, plot and join with a ruler (a third point checks accuracy), and read off answers by going up to the line and across. Direct proportion gives a line through the origin.",
      video_script_hooks: ["Opening: 'Drive at a steady 40 km/h and your distance-vs-time graph is a perfectly straight line. Steady rate, straight line.'", "Mid: 'Two points make a line, but always plot a third — if it's off the line, you've made an error.'", "Closing: 'Need the distance at 2.5 hours? No formula — just slide up to the line and read it off.'"],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch15 (Introduction to Graphs): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
