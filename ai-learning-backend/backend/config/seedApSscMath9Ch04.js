/**
 * AP SSC Class 9 Mathematics — Chapter 4: Linear Equations in Two Variables
 * 3 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch04.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     4-A  Solution of a Linear Equation
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Solution of a Linear Equation in Two Variables",
    prerequisite_knowledge: [
      "Linear equations in one variable: ax + b = 0",
      "Substituting values into expressions",
      "Cartesian coordinate system: ordered pairs (x, y)",
      "Concept of infinite solutions vs unique solution"
    ],
    key_formulas: [
      "Standard form: ax + by + c = 0  where a, b, c are real numbers, a and b not both zero",
      "A solution is an ordered pair (x₀, y₀) such that ax₀ + by₀ + c = 0",
      "Infinitely many solutions: for each value of x there is exactly one corresponding y (and vice versa)",
      "Finding y given x: y = (−ax − c)/b  (when b ≠ 0)"
    ],
    teaching_content: {
      intuition: "A linear equation in one variable like 2x = 6 has exactly one solution (x = 3). But a linear equation in two variables like 2x + y = 6 has infinitely many solutions — for every value of x you choose, there is a matching y. Pick x = 0 → y = 6. Pick x = 1 → y = 4. Pick x = 3 → y = 0. Each of these ordered pairs is a solution. There is no single answer; the set of all solutions forms a straight line on the coordinate plane.",
      derivation: "Why does ax + by + c = 0 have infinitely many solutions?\n\nRearrange (assuming b ≠ 0): y = (−ax − c)/b.\n\nFor every real number x, this formula gives exactly one y. Since x can take infinitely many values, there are infinitely many ordered pairs (x, y) satisfying the equation.\n\nIf b = 0 (and a ≠ 0): ax + c = 0 → x = −c/a, a fixed value. Then y can be anything → still infinitely many solutions, all of the form (−c/a, y).",
      worked_example: "Find three solutions of 3x + 2y = 12:\n\nRearranging: y = (12 − 3x)/2\n\nx = 0: y = 12/2 = 6 → solution (0, 6)\nx = 2: y = (12−6)/2 = 3 → solution (2, 3)\nx = 4: y = (12−12)/2 = 0 → solution (4, 0)\nx = −2: y = (12+6)/2 = 9 → solution (−2, 9)\n\nVerify (2, 3): 3(2) + 2(3) = 6 + 6 = 12 ✓\n\nFor the equation y = 7:\nThis is 0·x + 1·y − 7 = 0 → a=0, b=1, c=−7.\nSolutions: (0,7), (1,7), (−3,7), (100,7) — all points with y=7.",
      visual_description: "Draw a number line for x. For each x value, show the computed y value using the formula y = (12−3x)/2. Then show these (x, y) pairs as points on a coordinate plane. Notice all points lie on a straight line — this previews the next topic (graphing).",
      svg_diagrams: [
        {
          title: "Solution table for 3x + 2y = 12 and points approaching a line",
          svg_code: "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='150' height='150' rx='4' fill='#F3F4F6'/><text x='80' y='22' text-anchor='middle' font-size='12' fill='#1565C0' font-weight='bold'>3x + 2y = 12</text><line x1='5' y1='28' x2='155' y2='28' stroke='#aaa' stroke-width='1'/><text x='40' y='44' text-anchor='middle' font-size='11' fill='#333' font-weight='bold'>x</text><text x='110' y='44' text-anchor='middle' font-size='11' fill='#333' font-weight='bold'>y</text><line x1='75' y1='28' x2='75' y2='155' stroke='#aaa' stroke-width='1'/><text x='40' y='62' text-anchor='middle' font-size='11' fill='#333'>0</text><text x='110' y='62' text-anchor='middle' font-size='11' fill='#333'>6</text><text x='40' y='80' text-anchor='middle' font-size='11' fill='#333'>2</text><text x='110' y='80' text-anchor='middle' font-size='11' fill='#333'>3</text><text x='40' y='98' text-anchor='middle' font-size='11' fill='#333'>4</text><text x='110' y='98' text-anchor='middle' font-size='11' fill='#333'>0</text><text x='40' y='116' text-anchor='middle' font-size='11' fill='#555'>−2</text><text x='110' y='116' text-anchor='middle' font-size='11' fill='#555'>9</text><line x1='170' y1='10' x2='315' y2='10' stroke='#bbb' stroke-width='1'/><line x1='240' y1='10' x2='240' y2='155' stroke='#bbb' stroke-width='1'/><line x1='170' y1='80' x2='315' y2='80' stroke='#bbb' stroke-width='1'/><circle cx='240' cy='20' r='4' fill='#E91E63'/><circle cx='264' cy='46' r='4' fill='#E91E63'/><circle cx='288' cy='80' r='4' fill='#E91E63'/><circle cx='216' cy='2' r='4' fill='#E91E63'/><line x1='216' y1='2' x2='288' y2='80' stroke='#E91E63' stroke-width='1.5'/></svg>"
        }
      ],
      common_misconceptions: [
        "A linear equation in two variables has only one solution — FALSE. It has infinitely many solutions (a whole line of them).",
        "Only integer solutions count — any real number pair (x, y) satisfying the equation is a valid solution, including fractions and decimals.",
        "Thinking ax + by = c must have both a ≠ 0 and b ≠ 0 — one of them can be zero. If a = 0: by = c is a horizontal line. If b = 0: ax = c is a vertical line.",
        "Confusing 'solution of the equation' with 'solution of the system' — a single linear equation has infinitely many solutions; only two equations together can give a unique solution."
      ],
      shortcuts_and_tricks: [
        "Always find the x-intercept (y=0) and y-intercept (x=0) as two easy solutions. These are often enough to draw the graph.",
        "Check your solution instantly: substitute back into the original equation. If LHS = RHS, it is correct.",
        "Rearrange to y = mx + c form to generate solutions quickly: for each x, multiply by m and add c.",
        "If the equation has large coefficients, choose x values that cancel nicely — e.g., for 3x + 2y = 12, choose x = 0, 2, 4 to get integer y values."
      ],
      when_to_use_this_method: "Use this method to find, verify, and tabulate solutions of any linear equation in two variables. This is the foundation for graphing, checking whether a point lies on a line, and setting up systems of equations.",
      edge_cases: [
        "x = 0 always gives the y-intercept; y = 0 always gives the x-intercept — these are the two 'free' solutions.",
        "If a = b = 0 but c ≠ 0: the equation 0 = c has no solutions.",
        "If a = b = c = 0: the equation 0 = 0 is satisfied by every (x, y) — every point is a solution.",
        "Equation like 2x + 0·y = 6 → x = 3. Solutions: (3, 0), (3, 1), (3, 5), … — a vertical line."
      ],
      key_takeaway: "ax + by + c = 0 has infinitely many ordered-pair solutions. Find solutions by fixing one variable and computing the other. Verify by substitution. The set of all solutions is a straight line in the Cartesian plane.",
      video_script_hooks: [
        "Opening: 'One equation, two unknowns. In Class 8 that seemed impossible to solve. In Class 9 we discover it has infinitely many solutions — and they all live on a line.'",
        "Mid-lesson: 'Set x = 0, find y. Set y = 0, find x. Two solutions, zero effort. Plot those two points. The line through them IS the equation.'",
        "Closing: 'Every solution is a point on the line. Every point on the line is a solution. Equation and line — same object, two languages.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     4-B  Graph of a Linear Equation in Two Variables
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Graph of a Linear Equation in Two Variables",
    prerequisite_knowledge: [
      "Plotting ordered pairs on the Cartesian plane",
      "Finding solutions of ax + by + c = 0",
      "Concept of a straight line through two points",
      "x-intercept and y-intercept"
    ],
    key_formulas: [
      "Graph of ax + by + c = 0 is always a straight line",
      "Two points uniquely determine a straight line — find two solutions, plot them, draw the line",
      "x-intercept: set y = 0, solve for x → point (x, 0)",
      "y-intercept: set x = 0, solve for y → point (0, y)",
      "Slope-intercept form: y = mx + c  where m = slope, c = y-intercept"
    ],
    teaching_content: {
      intuition: "Every solution of a linear equation is a point (x, y). When you plot all such points, they fall perfectly on a straight line — no curves, no zigzags. That is why these equations are called 'linear'. The amazing fact: just two points are enough to draw the entire infinite line. Find the x-intercept and y-intercept (the two easiest points), plot them, and connect. You have graphed the equation.",
      derivation: "Why is the graph always a straight line?\n\ny = (−ax − c)/b (assuming b ≠ 0)\n\nThis is of the form y = mx + k where m = −a/b and k = −c/b.\n\nThis is the equation of a straight line with slope m and y-intercept k. Any equation of this form (linear in x) traces a straight line on the Cartesian plane.\n\nAlternatively, the two-point form: if P₁=(x₁,y₁) and P₂=(x₂,y₂) both satisfy the equation, then every point on segment P₁P₂ (and its extension) also satisfies it — because linear combinations of solutions are solutions.",
      worked_example: "Draw the graph of 2x + y = 6:\n\nStep 1: Find x-intercept: set y = 0 → 2x = 6 → x = 3 → point A = (3, 0)\nStep 2: Find y-intercept: set x = 0 → y = 6 → point B = (0, 6)\nStep 3: Find a third point as check: x = 1 → y = 4 → point C = (1, 4)\nStep 4: Plot A, B, C. All should be collinear. Draw the line through them.\n\nDraw the graph of x − 2y + 4 = 0:\nRearrange: y = (x+4)/2\nPoints: (0, 2), (−4, 0), (2, 3). Plot and join.",
      visual_description: "Draw a Cartesian grid. For y = 2x + 1: mark y-intercept at (0,1), then go right 1 unit, up 2 units (slope 2) to reach (1,3). Draw a line through all points. Label it y=2x+1. Separately show the x and y intercepts of 2x+y=6 as (3,0) and (0,6), with the straight line through them.",
      svg_diagrams: [
        {
          title: "Graph of 2x + y = 6 showing x-intercept (3,0) and y-intercept (0,6)",
          svg_code: "<svg viewBox='0 0 260 220' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='110' x2='240' y2='110' stroke='#aaa' stroke-width='1.5'/><line x1='80' y1='15' x2='80' y2='205' stroke='#aaa' stroke-width='1.5'/><text x='242' y='115' font-size='11'>x</text><text x='82' y='12' font-size='11'>y</text><text x='72' y='123' font-size='10' fill='#555'>O</text><line x1='20' y1='195' x2='220' y2='28' stroke='#E91E63' stroke-width='2.5'/><circle cx='170' cy='110' r='5' fill='#1565C0'/><text x='174' y='108' font-size='10' fill='#1565C0'>(3,0)</text><circle cx='80' cy='28' r='5' fill='#1565C0'/><text x='84' y='26' font-size='10' fill='#1565C0'>(0,6)</text><text x='185' y='50' font-size='11' fill='#E91E63'>2x+y=6</text></svg>"
        }
      ],
      common_misconceptions: [
        "Needing more than two points to draw a line — exactly two non-coincident points uniquely determine a line. A third point only verifies.",
        "Thinking the graph only shows the part between the two plotted points — the graph is the entire infinite line, not just the segment.",
        "If the line doesn't pass through the origin, the student sometimes forces it through. The y-intercept is only (0,0) if the constant term c = 0.",
        "Plotting points correctly but then drawing a curved line through them — for a linear equation, the connecting line must be straight."
      ],
      shortcuts_and_tricks: [
        "Intercept method (fastest): set y=0 to get x-intercept, set x=0 to get y-intercept. Two points → draw line. Works unless the line passes through the origin (both intercepts are origin).",
        "If the line passes through the origin (c=0 in ax+by=0): use x=1 and x=−1 to find two other points.",
        "For y = mx + c form: start at (0,c), then use slope m = rise/run — e.g., slope 2/3 means go 3 right, 2 up.",
        "Always draw a third point as a check — if all three are collinear, your arithmetic is correct."
      ],
      when_to_use_this_method: "Graph any linear equation to visualise its solution set. Use the intercept method when the equation has a non-zero constant. Use slope-intercept form when you need to compare slopes of multiple lines (parallel, perpendicular, intersecting).",
      edge_cases: [
        "Equation x = 3 (vertical line): all solutions have x = 3 regardless of y. Graph is a vertical line, slope is undefined.",
        "Equation y = 5 (horizontal line): slope = 0. Graph is a horizontal line.",
        "Both intercepts at origin (e.g., 3x − 2y = 0): line passes through (0,0). Need a second point like (2, 3).",
        "Negative slope: line goes from upper-left to lower-right. Positive slope: lower-left to upper-right."
      ],
      key_takeaway: "The graph of ax + by + c = 0 is a straight line. Find two solutions (best: x-intercept and y-intercept), plot them, draw the line. Use a third point to verify. The entire line represents all infinitely many solutions of the equation.",
      video_script_hooks: [
        "Opening: 'Every solution of 2x + y = 6 is a point. (0,6), (1,4), (2,2), (3,0)… plot them all and a perfect straight line appears. That line IS the equation — geometrically.'",
        "Mid-lesson: 'Intercept method: two moves. Set y=0, find x. Set x=0, find y. Plot two points, draw one line. The whole graph in 30 seconds.'",
        "Closing: 'Linear = straight line. Always. No exceptions. If your graph is curved, you made an arithmetic error. Recheck your two points.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     4-C  Equations of Lines Parallel to Axes
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Equations of Lines Parallel to the Axes",
    prerequisite_knowledge: [
      "Graph of a linear equation: straight line on Cartesian plane",
      "Horizontal and vertical lines: concept and direction",
      "x-axis and y-axis as special lines",
      "Meaning of slope and zero/undefined slope"
    ],
    key_formulas: [
      "Equation of a horizontal line at height k: y = k  (parallel to x-axis)",
      "Equation of a vertical line at position h: x = h  (parallel to y-axis)",
      "x-axis itself: y = 0",
      "y-axis itself: x = 0",
      "Horizontal line slope = 0; Vertical line slope = undefined (infinite)"
    ],
    teaching_content: {
      intuition: "A horizontal line is one where every point has the same y-coordinate but x can be anything. On a map, every city at the same latitude lies on a horizontal line — they all have the same north-south position. The equation of this line is just y = (that fixed value). Similarly, a vertical line has every point at the same x-coordinate, with y varying freely. Its equation is just x = (that fixed value). These are the simplest possible linear equations — just one variable equals a constant.",
      derivation: "From ax + by + c = 0:\n\nCase 1: a = 0 (horizontal line)\n  0·x + by + c = 0 → y = −c/b = constant k.\n  Every point (x, k) satisfies this for any x.\n  Graph: horizontal line at height k.\n\nCase 2: b = 0 (vertical line)\n  ax + 0·y + c = 0 → x = −c/a = constant h.\n  Every point (h, y) satisfies this for any y.\n  Graph: vertical line at x = h.\n\nThese are special cases of the general linear equation with one coefficient zero.",
      worked_example: "Draw and describe:\n\n(i)  y = 4:\n     Horizontal line. All points (x, 4): (0,4), (3,4), (−5,4), …\n     Crosses y-axis at (0,4). Never crosses x-axis (unless k=0).\n\n(ii) x = −3:\n     Vertical line. All points (−3, y): (−3,0), (−3,2), (−3,−7), …\n     Crosses x-axis at (−3,0). Parallel to y-axis.\n\n(iii) The x-axis: y = 0. The y-axis: x = 0.\n\n(iv) What is the equation of a line parallel to the x-axis passing through (5, −2)?\n     y = −2  (it passes through y = −2 for all x).\n\n(v)  What is the equation of a line parallel to the y-axis and at distance 7 from it?\n     Two answers: x = 7 or x = −7.",
      visual_description: "Draw a Cartesian plane. Draw two horizontal lines: y = 3 (above x-axis) and y = −2 (below x-axis). Draw two vertical lines: x = 4 (right of y-axis) and x = −1 (left of y-axis). Label each with its equation. Mark example points on each line. Note the x-axis (y=0) and y-axis (x=0) as the 'home' horizontal and vertical lines.",
      svg_diagrams: [
        {
          title: "Horizontal (y=k) and vertical (x=h) lines on the Cartesian plane",
          svg_code: "<svg viewBox='0 0 280 240' xmlns='http://www.w3.org/2000/svg'><line x1='15' y1='120' x2='265' y2='120' stroke='#999' stroke-width='1.5'/><line x1='140' y1='15' x2='140' y2='225' stroke='#999' stroke-width='1.5'/><line x1='15' y1='60' x2='265' y2='60' stroke='#2196F3' stroke-width='2.5'/><text x='220' y='54' font-size='12' fill='#2196F3' font-weight='bold'>y = 3</text><line x1='15' y1='180' x2='265' y2='180' stroke='#E91E63' stroke-width='2.5'/><text x='220' y='196' font-size='12' fill='#E91E63' font-weight='bold'>y = −2</text><line x1='200' y1='15' x2='200' y2='225' stroke='#4CAF50' stroke-width='2.5'/><text x='204' y='30' font-size='12' fill='#4CAF50' font-weight='bold'>x = 3</text><line x1='80' y1='15' x2='80' y2='225' stroke='#FF9800' stroke-width='2.5'/><text x='18' y='30' font-size='12' fill='#FF9800' font-weight='bold'>x = −2</text><text x='134' y='133' font-size='10' fill='#555'>O</text></svg>"
        }
      ],
      common_misconceptions: [
        "y = 4 is graphed as x = 4 by mistake — remember: y = k means EVERY point has that y-value, making it horizontal.",
        "Thinking x = 3 has a slope of 3 — vertical lines have undefined (infinite) slope, not 3.",
        "Assuming y = 0 and x = 0 are the same line — y = 0 is the x-axis (horizontal); x = 0 is the y-axis (vertical). Completely different lines.",
        "Writing the equation of 'a horizontal line through (2, 5)' as x = 2 — it should be y = 5 (constant y defines horizontal)."
      ],
      shortcuts_and_tricks: [
        "Horizontal line through point (a, b): equation is y = b. Just use the y-coordinate.",
        "Vertical line through point (a, b): equation is x = a. Just use the x-coordinate.",
        "Distance from x-axis to line y = k: |k| units. Distance from y-axis to line x = h: |h| units.",
        "Two horizontal lines y = 3 and y = 7 are always parallel (both horizontal, never meet). Distance between them = |7−3| = 4 units."
      ],
      when_to_use_this_method: "Identify horizontal/vertical lines immediately when a problem says 'parallel to x-axis' or 'parallel to y-axis'. These are the simplest lines to draw and equation-write — no slope needed.",
      edge_cases: [
        "Lines x = 0 and y = 0 are perpendicular to each other (the axes) — not parallel.",
        "A line parallel to the x-axis at y = 0 IS the x-axis itself.",
        "Two vertical lines (e.g., x = 2 and x = 5) are parallel and never intersect.",
        "A horizontal and a vertical line always intersect at exactly one point: y = 3 and x = 4 intersect at (4, 3)."
      ],
      key_takeaway: "y = k: horizontal line (parallel to x-axis), slope = 0. x = h: vertical line (parallel to y-axis), slope = undefined. To find the equation: horizontal → use the y-coordinate; vertical → use the x-coordinate. The axes themselves are y = 0 and x = 0.",
      video_script_hooks: [
        "Opening: 'What is the equation of every point that is exactly 4 units above the x-axis? They all have y = 4. One equation, infinitely many points — all in a perfect horizontal line.'",
        "Mid-lesson: 'Horizontal line through (7, −3): y = −3. Done. Two seconds. Vertical line through (7, −3): x = 7. Done. Two more seconds. These are the fastest equations in coordinate geometry.'",
        "Closing: 'Horizontal = y is fixed. Vertical = x is fixed. In every problem about lines parallel to the axes, ask: which coordinate stays constant? Write that as the equation.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 4: Linear Equations in Two Variables…");
  let upserted = 0, skipped = 0;
  for (const t of TOPICS) {
    try {
      await NcertTopicContent.findOneAndUpdate(
        { topicId: t.topicId },
        { $set: t },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${t.topicId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  ↩ ${t.topicId} (already exists, skipped)`);
        skipped++;
      } else {
        throw err;
      }
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}  Total: ${TOPICS.length}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
