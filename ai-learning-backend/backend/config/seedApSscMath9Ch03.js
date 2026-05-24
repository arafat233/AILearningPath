/**
 * AP SSC Class 9 Mathematics — Chapter 3: Coordinate Geometry
 * 2 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch03.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     3-A  Cartesian System
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "Cartesian System",
    prerequisite_knowledge: [
      "Number line: positive and negative integers",
      "Concept of perpendicular lines",
      "Basic directions: left/right, up/down",
      "Ordered pairs (a, b) as a way to specify two values"
    ],
    key_formulas: [
      "Point in 2D: ordered pair (x, y) where x = x-coordinate (abscissa), y = y-coordinate (ordinate)",
      "Origin: (0, 0) — intersection of the two axes",
      "Quadrant I: x>0, y>0 | Quadrant II: x<0, y>0 | Quadrant III: x<0, y<0 | Quadrant IV: x>0, y<0",
      "Points on x-axis: (x, 0) for any x | Points on y-axis: (0, y) for any y"
    ],
    teaching_content: {
      intuition: "René Descartes (1596–1650) had a brilliant idea while watching a fly on his ceiling: any point on the ceiling could be precisely described by its distance from two walls. One measurement → horizontal wall distance (x). Another → side wall distance (y). Two numbers pin down any point exactly. This is the entire Cartesian system: draw two perpendicular number lines through a common origin, and every point in the plane gets a unique address (x, y).",
      derivation: "Setup of the Cartesian plane:\n1. Draw a horizontal number line — this is the x-axis. Right = positive, left = negative.\n2. Draw a vertical number line through 0 on the x-axis — this is the y-axis. Up = positive, down = negative.\n3. The point where they cross is the origin O = (0, 0).\n4. To plot point P = (a, b): start at origin, move a units horizontally (right if a>0, left if a<0), then move b units vertically (up if b>0, down if b<0). Mark P.\n5. The plane is divided into four quadrants by the axes. Going anticlockwise from top-right: Q1, Q2, Q3, Q4.",
      worked_example: "Plot and identify:\n(i)   A = (3, 2): move 3 right, 2 up → Quadrant I\n(ii)  B = (−4, 1): move 4 left, 1 up → Quadrant II\n(iii) C = (−2, −3): move 2 left, 3 down → Quadrant III\n(iv)  D = (5, −1): move 5 right, 1 down → Quadrant IV\n(v)   E = (4, 0): on the x-axis\n(vi)  F = (0, −3): on the y-axis\n\nWhich quadrant is (−7, 2)? x < 0, y > 0 → Quadrant II.\nWhich quadrant is (0, 5)? On y-axis — not in any quadrant.",
      visual_description: "Draw two perpendicular number lines intersecting at O. Label x-axis horizontally, y-axis vertically. Mark integers on both. Label the four quadrants (I, II, III, IV). Plot several example points as dots with coordinates labelled. Draw dashed lines from each point to both axes to show how the two coordinates are read off.",
      svg_diagrams: [
        {
          title: "Cartesian plane with four quadrants and example points",
          svg_code: "<svg viewBox='0 0 300 280' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='280' y2='140' stroke='#333' stroke-width='2' marker-end='url(#arr)'/><line x1='150' y1='260' x2='150' y2='20' stroke='#333' stroke-width='2' marker-end='url(#arr)'/><defs><marker id='arr' markerWidth='8' markerHeight='8' refX='8' refY='4' orient='auto'><path d='M0,0 L8,4 L0,8 Z' fill='#333'/></marker></defs><text x='282' y='145' font-size='12' fill='#333'>x</text><text x='153' y='18' font-size='12' fill='#333'>y</text><text x='142' y='155' font-size='12' fill='#555'>O</text><text x='200' y='60' font-size='11' fill='#2E7D32'>I</text><text x='80' y='60' font-size='11' fill='#2E7D32'>II</text><text x='80' y='220' font-size='11' fill='#2E7D32'>III</text><text x='200' y='220' font-size='11' fill='#2E7D32'>IV</text><circle cx='210' cy='90' r='4' fill='#E91E63'/><text x='214' y='87' font-size='10' fill='#E91E63'>(4,2)</text><circle cx='90' cy='90' r='4' fill='#2196F3'/><text x='56' y='87' font-size='10' fill='#2196F3'>(−3,2)</text><circle cx='90' cy='200' r='4' fill='#FF9800'/><text x='50' y='208' font-size='10' fill='#FF9800'>(−3,−2)</text><circle cx='210' cy='200' r='4' fill='#9C27B0'/><text x='214' y='208' font-size='10' fill='#9C27B0'>(4,−2)</text></svg>"
        }
      ],
      common_misconceptions: [
        "Writing (y, x) instead of (x, y) — the x-coordinate (abscissa) ALWAYS comes first in an ordered pair.",
        "Thinking point (0, 5) is in Quadrant I or II — points on the axes are NOT in any quadrant.",
        "Plotting (3, −2) as moving 3 up and 2 left instead of 3 right and 2 down — x comes first (horizontal), then y (vertical).",
        "Assuming the x-axis is always positive — both axes extend in both directions; negative x goes left, negative y goes down."
      ],
      shortcuts_and_tricks: [
        "Quadrant memory trick: All Students Take Calculus — Q1 (All positive), Q2 (Sin/y positive), Q3 (Tan positive = both negative), Q4 (Cos/x positive).",
        "Abscissa = x-coordinate = horizontal; Ordinate = y-coordinate = vertical. 'Abscissa' starts with A like 'Across' (horizontal).",
        "Sign check for quadrant: just check signs of x and y. (+,+)→I, (−,+)→II, (−,−)→III, (+,−)→IV.",
        "On x-axis: y=0. On y-axis: x=0. At origin: both = 0."
      ],
      when_to_use_this_method: "Use the Cartesian system whenever a problem requires locating a point, plotting a graph, or describing a geometric figure analytically. It underpins all of coordinate geometry, graphs of equations, and distance/section formulas.",
      edge_cases: [
        "Point (0, 0) is the origin — it lies on both axes and belongs to no quadrant.",
        "A point like (−3, 0) lies on the x-axis in the negative direction — not in Quadrant III.",
        "Reflection of (a, b) in the x-axis is (a, −b); in the y-axis is (−a, b); in the origin is (−a, −b).",
        "The Cartesian system can extend to 3D with a third axis z, but Class 9 covers only 2D."
      ],
      key_takeaway: "The Cartesian plane uses two perpendicular number lines (x-axis horizontal, y-axis vertical) crossing at origin O. Every point is an ordered pair (x, y): x measured horizontally, y vertically. Four quadrants based on signs. Points on axes have one coordinate equal to zero.",
      video_script_hooks: [
        "Opening: 'Descartes invented this while lying in bed, watching a fly. Where is the fly? Two measurements: distance from the side wall and distance from the front wall. That is literally the x and y coordinates — born in a bedroom ceiling.'",
        "Mid-lesson: 'Ordered pair: x first, always. (3, 5) means 3 across, 5 up. (5, 3) is a completely different point — 5 across, 3 up. Order matters enormously.'",
        "Closing: 'Every problem in coordinate geometry starts with one question: where is the point? The answer is always two numbers in brackets. Get the order right and the rest follows.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     3-B  Plotting Points in the Plane
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch3_plotting_points",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "Plotting Points in the Cartesian Plane",
    prerequisite_knowledge: [
      "Cartesian system: x-axis, y-axis, origin, quadrants",
      "Reading ordered pairs (x, y)",
      "Positive and negative numbers on number lines",
      "Basic ruler and graph-paper skills"
    ],
    key_formulas: [
      "To plot (a, b): start at O, move |a| units right (if a>0) or left (if a<0), then |b| units up (if b>0) or down (if b<0)",
      "To read a plotted point: x = horizontal distance from y-axis (with sign), y = vertical distance from x-axis (with sign)",
      "Mirror image in x-axis: (a, b) ↔ (a, −b)",
      "Mirror image in y-axis: (a, b) ↔ (−a, b)",
      "Mirror image in origin: (a, b) ↔ (−a, −b)"
    ],
    teaching_content: {
      intuition: "Plotting a point is like following two GPS instructions at once: 'Go 4 km east and 3 km north'. East = positive x, North = positive y. West = negative x, South = negative y. Once you internalize directions as signs, every coordinate pair becomes a simple two-step journey from the origin. Reading a point off a graph is just the reverse: count how far east/west, then how far north/south.",
      derivation: "Why do we need an ordered pair and not just two numbers?\nTwo numbers in a list {3, 4} don't specify which is horizontal and which is vertical. The ordered pair (3, 4) has a rule: first number = x (horizontal), second = y (vertical). Swapping them gives (4, 3) — a different point. The ordered pair notation (with round brackets and a comma) carries both the values and their roles.",
      worked_example: "On a grid with unit spacing:\n\nPlot:\n  A = (2, 5): right 2, up 5\n  B = (−3, 4): left 3, up 4\n  C = (0, −2): stay on y-axis, down 2\n  D = (−4, −1): left 4, down 1\n  E = (6, 0): right 6, on x-axis\n\nRead back points from a graph:\n  Point at 3 right, 2 down → (3, −2)\n  Point at 5 left, 0 vertical → (−5, 0)\n\nReflections:\n  Reflect (3, −4) in x-axis → (3, 4)\n  Reflect (−2, 5) in y-axis → (2, 5)\n  Reflect (4, −1) in origin → (−4, 1)",
      visual_description: "Draw a Cartesian grid (graph paper style) with integers −5 to 5 on both axes. Plot five points: one in each quadrant plus one on an axis. Draw dashed guide lines from each point to both axes, and label the coordinates. Use a different colour for each point to make them distinguishable.",
      svg_diagrams: [
        {
          title: "Five points plotted across all four quadrants with guide lines",
          svg_code: "<svg viewBox='0 0 300 280' xmlns='http://www.w3.org/2000/svg'><line x1='10' y1='140' x2='290' y2='140' stroke='#bbb' stroke-width='1.5'/><line x1='150' y1='10' x2='150' y2='270' stroke='#bbb' stroke-width='1.5'/><line x1='90' y1='140' x2='90' y2='270' stroke='#aaa' stroke-width='0.5' stroke-dasharray='2,3'/><line x1='10' y1='200' x2='90' y2='200' stroke='#aaa' stroke-width='0.5' stroke-dasharray='2,3'/><circle cx='90' cy='200' r='5' fill='#2196F3'/><text x='50' y='215' font-size='10' fill='#2196F3'>(−2,−2)</text><line x1='210' y1='140' x2='210' y2='80' stroke='#aaa' stroke-width='0.5' stroke-dasharray='2,3'/><line x1='150' y1='80' x2='210' y2='80' stroke='#aaa' stroke-width='0.5' stroke-dasharray='2,3'/><circle cx='210' cy='80' r='5' fill='#E91E63'/><text x='215' y='77' font-size='10' fill='#E91E63'>(2,2)</text><circle cx='150' cy='200' r='5' fill='#FF9800'/><text x='155' y='210' font-size='10' fill='#FF9800'>(0,−2)</text><circle cx='90' cy='80' r='5' fill='#4CAF50'/><text x='50' y='77' font-size='10' fill='#4CAF50'>(−2,2)</text><circle cx='240' cy='180' r='5' fill='#9C27B0'/><text x='244' y='194' font-size='10' fill='#9C27B0'>(3,−1)</text><text x='154' y='136' font-size='10' fill='#555'>O</text></svg>"
        }
      ],
      common_misconceptions: [
        "Reading the y-axis value first when looking at a graph — always read x (horizontal) first, then y (vertical).",
        "Thinking (−3, 4) and (3, −4) are related by a simple sign flip — they are reflections of each other (in origin), not the same point.",
        "Points on the axes are plotted with one zero coordinate — e.g., (5, 0) is on the x-axis, not floating in Q1.",
        "Plotting fractions/decimals: (1.5, 2) is halfway between x=1 and x=2 grid lines — students often round to the nearest integer."
      ],
      shortcuts_and_tricks: [
        "Use the sign of x to decide left/right first; sign of y to decide up/down. Separate the two moves — do them sequentially.",
        "Grid check: after plotting, trace back to both axes and read the coordinates. If they match what you intended, you're correct.",
        "Reflections: flipping y-sign reflects in x-axis; flipping x-sign reflects in y-axis; flipping both reflects in origin.",
        "For exam questions: always draw a grid with enough range to accommodate all points — check the largest |x| and |y| values first."
      ],
      when_to_use_this_method: "Use coordinate plotting whenever a problem gives ordered pairs and asks you to graph them, identify shapes, or check geometric properties (collinearity, distance, midpoint).",
      edge_cases: [
        "All three points collinear check: plot all three; if they lie on a straight line, they are collinear. Later (Ch7, distance formula) this can be verified algebraically.",
        "Plotting non-integer coordinates: (√2, 1) — mark approximately at 1.41 on x-axis.",
        "Scale matters: if axes are scaled differently (e.g., x in steps of 2, y in steps of 5), adjust each step size before plotting.",
        "Points with very large coordinates: rescale axes (e.g., 1 unit = 10) to fit on paper."
      ],
      key_takeaway: "Plot (a, b) by moving horizontally |a| units (right if positive, left if negative) then vertically |b| units (up if positive, down if negative). Read off points by counting grid squares from origin. x first, y second — always. Reflections: change the sign of the relevant coordinate.",
      video_script_hooks: [
        "Opening: 'Two instructions. First one: go left or right. Second: go up or down. That is all it takes to reach any point in the entire infinite plane. Two numbers. That's coordinate geometry.'",
        "Mid-lesson: 'The order in the pair is a law, not a suggestion. (3, 4) and (4, 3) are different points on different parts of the grid. Swap the numbers and you teleport to a new location.'",
        "Closing: 'Practice plotting until it becomes instinct. In every problem that follows — distance, section, equations of lines — you will start by plotting. Get this right and everything else is easier.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 3: Coordinate Geometry…");
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
