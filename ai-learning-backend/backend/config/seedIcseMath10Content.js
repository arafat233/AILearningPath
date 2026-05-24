/**
 * ICSE Class 10 Mathematics — Sub-topic Content Seed
 * 25 chapters × 4 sub-topics = 100 sub-topics
 * Run: node config/seedIcseMath10Content.js
 * (Auto-generated from DB; run fix-ch1-db.mjs to regenerate)
 */
"use strict";
const mongoose = require("mongoose");
const NcertTopicContent = require("../models/ncertTopicContentModel");
require("dotenv").config();

const data = [
  {
    "topicId": "icse_math10_ch22_angles_elevation_depression",
    "key_formulas": [
      "tan(angle of elevation) = opposite/adjacent = height/horizontal distance",
      "tan(angle of depression) = vertical drop/horizontal distance",
      "Angle of elevation from A to B = angle of depression from B to A (alternate angles, parallel horizontals)",
      "In right triangle: if θ is angle of elevation, tanθ = h/d, sinθ = h/hyp, cosθ = d/hyp"
    ],
    "prerequisite_knowledge": [
      "Six trigonometric ratios (sin, cos, tan, cosec, sec, cot) and their relationships",
      "Right-triangle trigonometry: SOH-CAH-TOA",
      "Standard angle values: tan30°=1/√3, tan45°=1, tan60°=√3",
      "Alternate interior angles when two parallel lines are cut by a transversal"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Imagine standing at ground level and looking up at the top of a building. The angle your line of sight makes with the horizontal is the angle of elevation. If you're on top of the building looking down at a car, that angle is the angle of depression. Both angles use the same right triangle — just viewed from opposite ends.",
      "derivation": "Angle of elevation: observer O at ground level looks up at point P. Horizontal from O to base B; vertical PB = h; horizontal OB = d. Angle POB = θ. tan θ = PB/OB = h/d. Angle of depression: observer at P looks down to O. The horizontal at P is parallel to the ground. Angle between horizontal at P and line PO = angle of depression φ. Since the horizontal at P ∥ horizontal at O, φ = θ (alternate angles). So elevation from below = depression from above.",
      "worked_example": "A person stands 40 m from the base of a tower. The angle of elevation of the top is 30°. Find the height. tan30° = h/40 → h = 40 × (1/√3) = 40/√3 = 40√3/3 ≈ 23.1 m.",
      "visual_description": "Draw horizontal ground line. Mark observer O on the left. Mark tower base B and top T on the right (vertical). Draw OT (line of sight). Angle TOB = angle of elevation θ. For depression: mark observer at top T, horizontal TH going right. Angle HTX (X below) = angle of depression, equal to angle OTB by alternate angles.",
      "svg_diagrams": [
        "<svg viewBox='0 0 300 160' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='130' x2='280' y2='130' stroke='#333' stroke-width='2'/><line x1='200' y1='130' x2='200' y2='30' stroke='#2196F3' stroke-width='2'/><line x1='50' y1='130' x2='200' y2='30' stroke='#E91E63' stroke-width='2'/><line x1='50' y1='130' x2='120' y2='130' stroke='#9C27B0' stroke-width='1' stroke-dasharray='4,2'/><path d='M 90 130 A 40 40 0 0 1 72 104' fill='none' stroke='#9C27B0' stroke-width='1.5'/><text x='95' y='120' font-size='11' fill='#9C27B0'>θ</text><text x='40' y='148' font-size='11'>O</text><text x='195' y='148' font-size='11'>B</text><text x='205' y='28' font-size='11'>T</text><text x='115' y='75' font-size='11' fill='#E91E63'>line of sight</text></svg>"
      ],
      "common_misconceptions": [
        "Confusing which side is 'opposite' and which is 'adjacent' — always identify the right angle first (it's always at the base of the tower/vertical object).",
        "Forgetting that angle of elevation = angle of depression — students sometimes set up two different angles when they should be equal.",
        "Using sine or cosine when only the height and horizontal distance are known — use tangent first."
      ],
      "shortcuts_and_tricks": [
        "tan30°=1/√3: multiply top and bottom by √3 to rationalise → h = d/√3 = d√3/3.",
        "tan45°=1: whenever the angle is 45°, height = horizontal distance. Instant answer.",
        "tan60°=√3: whenever the angle is 60°, height = d√3.",
        "Draw the diagram first — it takes 20 seconds and eliminates all confusion about which angle goes where."
      ],
      "when_to_use_this_method": "Use this sub-topic when a problem mentions a single observer at ground level, one stationary object, and one angle only. If two angles or a moving observer appear, switch to the two-position method.",
      "edge_cases": [
        "If the observer is on a cliff or hill, the base of the vertical object may be below the observer — subtract heights carefully.",
        "When the angle is 0° (horizontal), tangent = 0: the object is at the same level, not elevated at all.",
        "When the angle is 90°, the object is directly above — tangent is undefined; horizontal distance = 0."
      ],
      "key_takeaway": "Set up a right triangle with the vertical object as the 'opposite' side and the horizontal distance as the 'adjacent' side. Write tan θ = h/d, then solve for the unknown.",
      "video_script_hooks": [
        "Opening: 'You're looking up at a kite. That upward tilt of your neck is exactly the angle of elevation — and today we calculate every height using that angle.'",
        "Mid-lesson: 'tan45°=1 means height equals distance. The Eiffel Tower from 330 m away at 45° elevation — yes, it's 330 m tall. Coincidence? No — it's trigonometry.'",
        "Closing: 'Draw the right triangle first. Label h and d. Write tan θ = h/d. That is literally the entire chapter in one equation.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch22_buildings_towers",
    "key_formulas": [
      "Two buildings opposite each other: tan(elev A to top B) = H_B/d; tan(dep A to base B) = H_A/d (if A is taller)",
      "From top of building A (height H) to top of adjacent building B (height h, distance d apart): angle of depression to base = arctan(H/d); angle of elevation to top = arctan((h−H)/d) if h>H",
      "Shadow length s = h/tanα where α = sun's elevation",
      "For object on top of building: total height = building + object; use two separate triangles"
    ],
    "prerequisite_knowledge": [
      "Single-observer and two-position formulas",
      "Angle of elevation and depression equality principle",
      "Working with two simultaneous right triangles sharing a common side",
      "Concept of distance between two objects on the same horizontal plane"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "When two buildings face each other, the line connecting their tops and the line connecting a top to the opposite base form two right triangles that share a horizontal base. From the top of a taller building, you look down at the base of the shorter one (depression) and up at the top (elevation). These angles create two separate triangles — solve each independently using the shared base distance.",
      "derivation": "Two buildings of heights H (taller, left) and h (shorter, right), distance d apart. From top of left building: angle of depression to base of right building = α, so tan α = H/d → d = H/tan α. Angle of elevation to top of right building = β, so tan β = (h−H_bottom)/(d) ... if right building base is at same ground level: actually angle of elevation from top of H to top of h (if h > H) = arctan((h−H)/d). Sum α+β is only equal when specific conditions hold. Solve each triangle separately.",
      "worked_example": "Two buildings of heights 12 m and 20 m face each other 15 m apart. Find the angles of elevation and depression of the top of the taller building from the top of the shorter. Height difference = 20−12 = 8 m, horizontal = 15 m. Angle of elevation = arctan(8/15) — not a standard angle; leave as arctan(8/15) or compute ≈ 28.1°. But typical ICSE questions use standard angles: e.g., H=15√3, d=15: angle = arctan(√3) = 60°.",
      "visual_description": "Two vertical lines representing buildings on horizontal ground. Left building taller (H), right shorter (h), distance d between bases. Draw a horizontal line from top of left building to the right building. Below the horizontal = angle of depression (to base or lower part); above horizontal = angle of elevation (to top if right is taller or to roof elements).",
      "svg_diagrams": [
        "<svg viewBox='0 0 280 170' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='145' x2='260' y2='145' stroke='#333' stroke-width='1.5'/><line x1='50' y1='145' x2='50' y2='30' stroke='#2196F3' stroke-width='3'/><line x1='200' y1='145' x2='200' y2='70' stroke='#E91E63' stroke-width='3'/><line x1='50' y1='30' x2='200' y2='70' stroke='#9C27B0' stroke-width='1.5'/><line x1='50' y1='30' x2='200' y2='145' stroke='#4CAF50' stroke-width='1.5' stroke-dasharray='4,2'/><line x1='50' y1='30' x2='200' y2='30' stroke='#999' stroke-width='1' stroke-dasharray='3,2'/><text x='35' y='90' font-size='11' fill='#2196F3'>H</text><text x='204' y='110' font-size='11' fill='#E91E63'>h</text><text x='110' y='155' font-size='11'>d</text><text x='75' y='44' font-size='10' fill='#9C27B0'>β(elev)</text><text x='75' y='58' font-size='10' fill='#4CAF50'>α(dep)</text></svg>"
      ],
      "common_misconceptions": [
        "Using total height H instead of height difference (H−h) for elevation problems between two buildings.",
        "Assuming angle of elevation + angle of depression = 90° — this is only true for a specific configuration.",
        "Forgetting to use the same horizontal distance d in both the elevation and depression triangles."
      ],
      "shortcuts_and_tricks": [
        "For two buildings facing each other, always identify the shared horizontal distance d first.",
        "Height difference for elevation angle between tops = |H₁ − H₂|; use this as the 'opposite' side.",
        "When a problem mentions 'from the top of building A, the angle of depression to the top of B is θ', the opposite side is H_A − H_B (if A taller) and adjacent side is d.",
        "If both angles (to top and to base of same building) are given from a common point, the two triangles share the same horizontal distance — solve for d first, then find the unknown height."
      ],
      "when_to_use_this_method": "Use this when the problem involves two separate vertical structures (buildings, towers, poles), or when angles are measured from the top of one structure to features of another. Identify whether elevation or depression applies to each angle.",
      "edge_cases": [
        "If both buildings have the same height, the line joining their tops is horizontal — angle of elevation = angle of depression = 0°.",
        "Problems with a pole on top of a building: the pole itself is one right triangle; the building below adds another. Label them separately and add heights at the end.",
        "Problems from a point on the ground between two buildings: two right triangles point in opposite directions from the same observer."
      ],
      "key_takeaway": "Draw both buildings and all lines of sight carefully. Identify the right triangle for each angle, label the shared distance d, and solve each triangle independently.",
      "video_script_hooks": [
        "Opening: 'You're standing on the roof of a 12 m building looking at the building next door. You look up to see its roof and down to see its base. Two angles, two triangles, one building — let\\'s decode it.'",
        "Mid-lesson: 'The trick: both triangles share the same horizontal distance d. Find d from the depression angle first, then use it in the elevation equation. Two triangles, one shared base.'",
        "Closing: 'Multi-structure problems feel complex but they\\'re just several simple triangles stitched together. Label every height and distance, write tan = opp/adj for each, and solve in order.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch22_single_observer",
    "key_formulas": [
      "Height h = d·tanθ (observer at ground, d = horizontal distance, θ = angle of elevation)",
      "Distance d = h/tanθ = h·cotθ",
      "Hypotenuse (line of sight) = h/sinθ = d/cosθ",
      "Shadow length s = h/tanα (α = angle of elevation of sun)",
      "For a pole on top of a building: separate the total into building height + pole height"
    ],
    "prerequisite_knowledge": [
      "Angle of elevation and depression definitions",
      "tan θ = opposite/adjacent in right-triangle setting",
      "Standard angles: 30°, 45°, 60° and their tangent values",
      "Rationalisation of surds (for answers in surd form)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Every 'find the height' problem reduces to a single right triangle. The observer is at one corner, the base of the object at a second corner, and the top of the object at the third. Identify these three points and the triangle draws itself.",
      "derivation": "In triangle OBT (O=observer, B=base of tower, T=top): angle OBT = 90° (tower is vertical). Angle BOT = θ (angle of elevation). OB = d (horizontal), BT = h (height). tan θ = BT/OB = h/d → h = d·tan θ. Conversely d = h/tan θ, and line of sight OT = h/sin θ.",
      "worked_example": "A lamp post casts a shadow of 20 m when the sun's elevation is 60°. Find the height of the lamp post. tan60° = h/20 → √3 = h/20 → h = 20√3 m ≈ 34.6 m.",
      "visual_description": "Right triangle: observer O at left on ground; base of tower B to the right on ground; top T directly above B. Label OB=d, BT=h, angle at O = θ (elevation). For shadow: sun rays come at angle α to horizontal; shadow is on ground from base of post to tip of shadow.",
      "svg_diagrams": [
        "<svg viewBox='0 0 260 160' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='130' x2='240' y2='130' stroke='#333' stroke-width='1.5'/><line x1='180' y1='130' x2='180' y2='30' stroke='#2196F3' stroke-width='2.5'/><line x1='50' y1='130' x2='180' y2='30' stroke='#E91E63' stroke-width='1.5'/><line x1='50' y1='130' x2='180' y2='130' stroke='#4CAF50' stroke-width='1.5'/><text x='105' y='148' font-size='12' fill='#4CAF50'>d</text><text x='185' y='85' font-size='12' fill='#2196F3'>h</text><text x='75' y='120' font-size='11' fill='#9C27B0'>θ</text><text x='40' y='148' font-size='11'>O</text><text x='175' y='148' font-size='11'>B</text><text x='183' y='26' font-size='11'>T</text></svg>"
      ],
      "common_misconceptions": [
        "Using the wrong angle: if the angle of depression is given from the top, students sometimes use it in a triangle with the wrong reference.",
        "Forgetting to rationalise: answers like 20/√3 should be written as 20√3/3.",
        "Mixing up height and distance when both are unknown — one equation with two unknowns has no solution; check that one value is always given."
      ],
      "shortcuts_and_tricks": [
        "tan30° = 1/√3: h = d/√3 → rationalise → h = d√3/3.",
        "tan45° = 1: height = distance. No calculation needed.",
        "tan60° = √3: h = d√3. Multiply distance by √3 directly.",
        "Shadow problems: treat shadow as horizontal distance and height of sun as the angle."
      ],
      "when_to_use_this_method": "Use when there is exactly one observer at a fixed position, one object, and one angle (either elevation or depression). If the problem mentions 'from the top of a cliff' as the second viewpoint, it is still a single-diagram problem.",
      "edge_cases": [
        "Observer on a raised platform: add the platform height to the computed h if asking for total height above ground.",
        "Object partially below ground level (well, valley): angle of depression is used, and depth = d·tanθ.",
        "When the problem gives the hypotenuse (length of rope, ladder, cable) instead of horizontal distance: use sin θ for h, cos θ for d."
      ],
      "key_takeaway": "Identify O, B, T. Write tan θ = h/d. Plug in two knowns, solve for the third. Rationalise if needed.",
      "video_script_hooks": [
        "Opening: 'A lighthouse is 60 m tall. A ship sees it at 30° elevation. How far is the ship? One triangle, one equation, one answer — let\\'s do it in under a minute.'",
        "Mid-lesson: 'tan45°=1 is the laziest identity in trigonometry — if the angle is 45°, height = distance. Done. No arithmetic required.'",
        "Closing: 'Every single-observer problem is the same triangle. Master the three standard angles and no height-distance problem can slow you down.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch22_two_positions",
    "key_formulas": [
      "From position A (farther): tanα = h/d  →  d = h/tanα = h·cotα",
      "From position B (closer, x metres nearer): tanβ = h/(d−x)  →  d−x = h·cotβ",
      "Subtracting: x = h(cotα − cotβ)  →  h = x/(cotα − cotβ)",
      "Equivalently: h = x·tanα·tanβ/(tanβ − tanα)",
      "If observer on height H looks at base and top: two angles give two equations"
    ],
    "prerequisite_knowledge": [
      "Single-observer formula: tan θ = h/d",
      "cotθ = 1/tanθ — useful to keep equations in cot form before subtracting",
      "Solving simultaneous linear equations in two unknowns (h and d)",
      "Standard angle values and their reciprocals (cot30°=√3, cot45°=1, cot60°=1/√3)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Imagine driving toward a mountain. As you move closer, the angle of elevation increases. Two snapshot observations give you two equations. One subtraction eliminates the unknown distance, leaving only the height. This is the core trick of all two-position problems.",
      "derivation": "Let tower height = h, initial distance = d. From first position: tanα = h/d → d = h cotα. After moving x metres closer, distance = d−x. From second position: tanβ = h/(d−x) → d−x = h cotβ. Subtract: (d) − (d−x) = h cotα − h cotβ → x = h(cotα−cotβ) → h = x/(cotα−cotβ).",
      "worked_example": "A person walks 20 m toward a tower. The angle of elevation changes from 30° to 60°. Find the height. h = 20/(cot30°−cot60°) = 20/(√3−1/√3) = 20/((3−1)/√3) = 20√3/2 = 10√3 m.",
      "visual_description": "Two observer positions A and B on horizontal ground, B closer to the tower base C. Vertical tower CT of height h. Angle of elevation from A = α, from B = β (β > α). Distance AB = x. Draw triangle ACT and BCT sharing the vertical side CT.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><line x1='10' y1='130' x2='310' y2='130' stroke='#333' stroke-width='1.5'/><line x1='240' y1='130' x2='240' y2='30' stroke='#2196F3' stroke-width='2.5'/><line x1='40' y1='130' x2='240' y2='30' stroke='#9C27B0' stroke-width='1.5' stroke-dasharray='5,2'/><line x1='130' y1='130' x2='240' y2='30' stroke='#E91E63' stroke-width='1.5'/><text x='70' y='120' font-size='10' fill='#9C27B0'>α</text><text x='150' y='120' font-size='10' fill='#E91E63'>β</text><text x='80' y='148' font-size='11'>A</text><text x='125' y='148' font-size='11'>B</text><text x='235' y='148' font-size='11'>C</text><text x='244' y='26' font-size='11'>T</text><text x='88' y='140' font-size='10' fill='#4CAF50'>x</text><text x='247' y='82' font-size='11' fill='#2196F3'>h</text></svg>"
      ],
      "common_misconceptions": [
        "Setting up d−x when it should be d+x: if the observer moves away, the new distance is d+x.",
        "Forgetting which angle goes with which position: larger angle (β) is always from the closer position.",
        "Arithmetic error when computing cotα−cotβ: work with a common denominator or convert to sin/cos form."
      ],
      "shortcuts_and_tricks": [
        "Keep everything in cotangent form until the subtraction step — avoids fractions inside fractions.",
        "h = x·tanα·tanβ/(tanβ−tanα): use this direct formula once you remember it.",
        "For 30° and 60°: cot30°=√3, cot60°=1/√3; difference = √3−1/√3 = (3−1)/√3 = 2/√3; h = x√3/2.",
        "Check: the answer for h must be positive; if negative, you set up the subtraction backwards."
      ],
      "when_to_use_this_method": "Use when the problem states two different angles of elevation (or depression) of the same object from two different positions, or says 'the observer walks x metres closer / farther' and asks for height or initial distance.",
      "edge_cases": [
        "If the observer moves along a slope (not horizontal ground), the geometry changes — the 'x' is no longer horizontal. ICSE problems always use horizontal ground.",
        "If both angles are equal, the observer is equidistant — height cannot be determined from x alone (degenerate case).",
        "Problems with two different towers viewed from a common point: set up two separate right triangles, not the subtraction formula."
      ],
      "key_takeaway": "Write d = h·cotα and d−x = h·cotβ; subtract to get x = h(cotα−cotβ); divide to find h.",
      "video_script_hooks": [
        "Opening: 'Walk 20 metres toward a tower. The angle of elevation changes from 30° to 60°. How tall is it? No distance given — just two angles and a step. This is where simultaneous equations meet trigonometry.'",
        "Mid-lesson: 'The key is cot: d = h·cotα and (d−x) = h·cotβ. Subtract. x = h(cotα−cotβ). Rearrange. Done. Every two-position problem collapses to one step.'",
        "Closing: 'Two positions, two equations, one subtraction. The distance disappears and only the height remains. Practise two problems with 30°/60° and two with 45°/60° and you own this topic.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch23_frequency_polygon",
    "key_formulas": [
      "Midpoint of class = (lower limit + upper limit) / 2",
      "Frequency polygon: plot (midpoint, frequency) for each class, join with straight lines",
      "Close the polygon: extend to midpoints of imaginary empty classes at both ends (frequency = 0)",
      "Area under frequency polygon = area of histogram (same data)"
    ],
    "prerequisite_knowledge": [
      "Histogram construction and class midpoints",
      "Plotting points on a Cartesian plane",
      "Concept that the polygon encloses the same total area as the histogram"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A frequency polygon is a line graph version of a histogram. Instead of drawing bars, you plot a dot at the midpoint of each bar's top and connect them with straight lines. You then extend the line to touch the x-axis on both sides (at imaginary empty classes) to 'close' the polygon — giving it the same total area as the histogram.",
      "derivation": "For each class with interval [a, b) and frequency f: midpoint = (a+b)/2. Plot the point ((a+b)/2, f). Add two extra points: one at (lower_midpoint − h, 0) and one at (upper_midpoint + h, 0), where h is class width. Connect all points in order with straight lines. The resulting closed figure is the frequency polygon.",
      "worked_example": "Classes: 0-10(f=3), 10-20(f=7), 20-30(f=12), 30-40(f=8), 40-50(f=5). Midpoints: 5, 15, 25, 35, 45. Add imaginary class: −10-0 (midpoint −5, f=0) and 50-60 (midpoint 55, f=0). Points: (−5,0),(5,3),(15,7),(25,12),(35,8),(45,5),(55,0). Join in order.",
      "visual_description": "Points plotted at class midpoints. Straight lines connecting them form a polygon shape. The first and last points touch the x-axis (zero frequency imaginary classes). The polygon shape shows the overall distribution — rising to a peak then falling.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 170' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='150' x2='300' y2='150' stroke='#333' stroke-width='1.5'/><line x1='30' y1='20' x2='30' y2='150' stroke='#333' stroke-width='1.5'/><polyline points='50,150 80,132 120,106 160,54 200,82 240,117 270,150' fill='none' stroke='#E91E63' stroke-width='2'/><circle cx='80' cy='132' r='3' fill='#E91E63'/><circle cx='120' cy='106' r='3' fill='#E91E63'/><circle cx='160' cy='54' r='3' fill='#E91E63'/><circle cx='200' cy='82' r='3' fill='#E91E63'/><circle cx='240' cy='117' r='3' fill='#E91E63'/><text x='75' y='165' font-size='9'>5</text><text x='115' y='165' font-size='9'>15</text><text x='155' y='165' font-size='9'>25</text><text x='195' y='165' font-size='9'>35</text><text x='235' y='165' font-size='9'>45</text></svg>"
      ],
      "common_misconceptions": [
        "Not closing the polygon: students stop at the first and last data midpoints without adding the zero-frequency points — this leaves an open line graph, not a polygon.",
        "Plotting class limits instead of midpoints: the x-coordinate must be the class midpoint, not the boundary.",
        "Confusing frequency polygon with ogive: polygon joins midpoints of bars; ogive joins cumulative frequencies at upper class boundaries."
      ],
      "shortcuts_and_tricks": [
        "Midpoint = (class lower + class upper)/2. For 20-30: midpoint = 25.",
        "Add one imaginary class below the first and one above the last, each with f=0.",
        "If drawing on a histogram, just connect the top-centres of the bars and add the closing points.",
        "Two frequency polygons on the same graph: easy visual comparison of two data sets."
      ],
      "when_to_use_this_method": "Use a frequency polygon when comparing two or more distributions on the same graph (overlapping polygons are easier to read than overlapping histograms). Also used when the question specifically asks for a polygon rather than a histogram.",
      "edge_cases": [
        "If first class starts at 0: imaginary class goes to negative midpoint — plot it anyway at (−h/2, 0) or (−midpoint_width, 0).",
        "Drawing polygon without first drawing histogram: calculate midpoints directly from class limits, no need to draw bars.",
        "For open-ended first/last class: cannot determine midpoint — ICSE avoids this."
      ],
      "key_takeaway": "Frequency polygon = join midpoints of histogram bar-tops with straight lines + extend to zero at both ends. Midpoint of each class = (lower + upper)/2.",
      "video_script_hooks": [
        "Opening: 'Take your histogram. Find the midpoint of the top of each bar. Connect the dots. Close to the x-axis at both ends. That\\'s a frequency polygon — 30 seconds, done.'",
        "Mid-lesson: 'Why close the polygon? So the area equals the histogram area. Open-ended lines are graphs; closed lines are polygons. The area inside = the total frequency.'",
        "Closing: 'Frequency polygon shines when comparing two classes on one graph. Two polygons overlap neatly; two histograms fight for space. That\\'s its superpower.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch23_histogram",
    "key_formulas": [
      "Class width h = upper class boundary − lower class boundary",
      "Frequency density = frequency / class width (used when class widths are unequal)",
      "For equal class widths: bar height = frequency directly",
      "Midpoint of class = (lower limit + upper limit) / 2",
      "Total area of all bars = total frequency × class width"
    ],
    "prerequisite_knowledge": [
      "Grouped frequency distribution: class intervals, tally, frequency",
      "Difference between discrete and continuous data",
      "Drawing bar charts on graph paper (axes, scale, labels)",
      "Concept of class boundaries vs class limits"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A histogram is a bar chart for grouped continuous data where the area (not height) represents frequency. When all class widths are equal, height ∝ frequency and histograms look like bar charts. When widths differ, you must use frequency density on the y-axis so every bar's area still equals its frequency.",
      "derivation": "For equal class widths: plot frequency on y-axis, class intervals on x-axis; bars are adjacent (no gaps). For unequal class widths: frequency density = f/h where h is class width. Area = frequency density × class width = f/h × h = f. So area of each bar = its frequency, making histograms an honest representation of data density.",
      "worked_example": "Marks: 0-10 (f=3), 10-20 (f=7), 20-30 (f=12), 30-40 (f=8), 40-50 (f=5). Equal widths (h=10). Plot: x-axis = marks, y-axis = frequency. Bars: heights 3, 7, 12, 8, 5 with width 10 each. Total area = (3+7+12+8+5)×10 = 350 = 35 students × 10.",
      "visual_description": "Rectangular bars plotted on a number line (x-axis). Bars are adjacent with no gaps between them (unlike bar charts). For equal widths: y-axis shows frequency. Modal class = tallest bar. For unequal widths: y-axis shows frequency density = f/class-width.",
      "svg_diagrams": [
        "<svg viewBox='0 0 300 170' xmlns='http://www.w3.org/2000/svg'><line x1='40' y1='150' x2='280' y2='150' stroke='#333' stroke-width='2'/><line x1='40' y1='20' x2='40' y2='150' stroke='#333' stroke-width='2'/><rect x='50' y='120' width='40' height='30' fill='#2196F3' opacity='0.7'/><rect x='90' y='90' width='40' height='60' fill='#2196F3' opacity='0.7'/><rect x='130' y='54' width='40' height='96' fill='#2196F3' opacity='0.9'/><rect x='170' y='78' width='40' height='72' fill='#2196F3' opacity='0.7'/><rect x='210' y='105' width='40' height='45' fill='#2196F3' opacity='0.7'/><text x='65' y='165' font-size='9'>0-10</text><text x='105' y='165' font-size='9'>10-20</text><text x='145' y='165' font-size='9'>20-30</text><text x='185' y='165' font-size='9'>30-40</text><text x='225' y='165' font-size='9'>40-50</text><text x='2' y='125' font-size='9'>3</text><text x='2' y='93' font-size='9'>7</text><text x='2' y='57' font-size='9'>12</text></svg>"
      ],
      "common_misconceptions": [
        "Leaving gaps between bars in a histogram — bars must be adjacent since x-axis is continuous.",
        "Using frequency (not frequency density) on y-axis when class widths are unequal — this misrepresents data.",
        "Confusing mode with modal class: modal class is the class with highest frequency; mode is estimated as the midpoint of that class."
      ],
      "shortcuts_and_tricks": [
        "For equal class widths, histogram = bar chart with no gaps.",
        "Modal class = tallest bar. No calculation needed — just read the graph.",
        "To draw: first table the class boundaries (not limits), then plot.",
        "Area check: total area of all bars = n × class width (for equal widths)."
      ],
      "when_to_use_this_method": "Use a histogram when data is continuous and grouped into class intervals. Use bar charts for discrete or categorical data. ICSE questions almost always use equal class widths.",
      "edge_cases": [
        "Open-ended classes (e.g., 'above 50'): cannot draw a bar without assuming a width; ICSE questions avoid these.",
        "Class width of 1 (e.g., 1-2, 2-3): histogram degenerates to a bar chart — still draw with no gaps.",
        "When asked to draw a frequency polygon instead, join midpoints of bar tops."
      ],
      "key_takeaway": "Histogram bars are adjacent, widths = class widths, heights = frequency (for equal widths) or frequency density (for unequal widths). Area of each bar = frequency.",
      "video_script_hooks": [
        "Opening: 'Bar chart has gaps. Histogram has no gaps. That\\'s not a typo — it\\'s because the x-axis is a continuous number line, not separate categories.'",
        "Mid-lesson: 'Modal class is the tallest bar. Easiest mark in the paper — just look at the graph.'",
        "Closing: 'If widths are equal, height = frequency. If widths differ, height = frequency density. One rule handles both: area of bar = frequency, always.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch23_ogive",
    "key_formulas": [
      "Cumulative frequency (cf) = sum of frequencies of all classes up to and including the current class",
      "Less-than ogive: plot (upper class boundary, cumulative frequency) — S-shaped curve rising left to right",
      "More-than ogive: plot (lower class boundary, n − cf_previous) — S-shaped curve falling left to right",
      "Both ogives start and end at same points (0 and n); their intersection gives the median",
      "Less-than ogive always starts at (lower boundary of first class, 0)"
    ],
    "prerequisite_knowledge": [
      "Frequency distribution table and class intervals",
      "Concept of cumulative sum (running total)",
      "Plotting smooth curves through given points",
      "Scale selection on graph paper"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "An ogive (cumulative frequency curve) answers the question: 'How many values are less than x?' As x increases, the count only grows — that's why the less-than ogive always rises. The S-shape comes from: few data points at the extremes and more in the middle. The point where the ogive reaches n/2 on the y-axis gives the median on the x-axis.",
      "derivation": "Build cumulative frequency table: add a new column where each entry = sum of all frequencies up to that row. For less-than ogive: each row gives a point (upper boundary, cumulative frequency). The first point is (lower boundary of first class, 0). Connect all points with a smooth curve (not ruler lines). The final point is (upper boundary of last class, n).",
      "worked_example": "Marks 0-10(f=3), 10-20(f=7), 20-30(f=12), 30-40(f=8), 40-50(f=5), n=35. CF table: 10→3, 20→10, 30→22, 40→30, 50→35. Add starting point (0, 0). Points: (0,0),(10,3),(20,10),(30,22),(40,30),(50,35). Draw smooth S-curve through these points.",
      "visual_description": "S-shaped curve that starts at (lower boundary of first class, 0), rises steeply in the middle and flattens at both ends, ending at (upper boundary of last class, n). Y-axis = cumulative frequency (0 to n). X-axis = class boundaries. The steepest part of the curve shows the modal class.",
      "svg_diagrams": [
        "<svg viewBox='0 0 280 170' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='150' x2='260' y2='150' stroke='#333' stroke-width='1.5'/><line x1='30' y1='10' x2='30' y2='150' stroke='#333' stroke-width='1.5'/><path d='M 50,148 C 70,145 80,138 100,126 C 120,114 130,80 150,56 C 165,38 175,30 195,25 C 210,22 225,16 240,13' fill='none' stroke='#4CAF50' stroke-width='2.5'/><circle cx='50' cy='148' r='3' fill='#4CAF50'/><circle cx='100' cy='126' r='3' fill='#4CAF50'/><circle cx='150' cy='56' r='3' fill='#4CAF50'/><circle cx='195' cy='25' r='3' fill='#4CAF50'/><circle cx='240' cy='13' r='3' fill='#4CAF50'/><text x='45' y='165' font-size='9'>0</text><text x='93' y='165' font-size='9'>10</text><text x='143' y='165' font-size='9'>30</text><text x='190' y='165' font-size='9'>40</text><text x='235' y='165' font-size='9'>50</text><text x='2' y='60' font-size='9'>22</text><text x='2' y='16' font-size='9'>35</text></svg>"
      ],
      "common_misconceptions": [
        "Joining points with ruler (straight lines) instead of a smooth curve — an ogive must be a smooth S-curve.",
        "Plotting against class midpoints instead of upper boundaries — always use upper class boundary for less-than ogive.",
        "Forgetting the starting point (lower boundary of first class, 0) — without it the curve starts at the wrong x-value."
      ],
      "shortcuts_and_tricks": [
        "Cumulative frequency is just a running total — add each frequency to the previous sum.",
        "The last cumulative frequency must equal n (total). This is a built-in check.",
        "For less-than ogive: x-coordinates are the upper class boundaries (10, 20, 30 ...). Y-coordinates are the running totals.",
        "Starting point: (lower bound of first class, 0). If first class is 0-10, start at (0, 0)."
      ],
      "when_to_use_this_method": "Draw the ogive when a question asks for a cumulative frequency curve, or when it asks you to find the median, quartiles, or percentiles graphically. The ogive is the standard tool for all of these.",
      "edge_cases": [
        "If first class doesn't start at 0 (e.g., 10-20): starting point is (10, 0), not (0, 0).",
        "More-than ogive: plot (lower boundary, n − previous_cf). Last point is (upper boundary of last class, 0).",
        "For equal class widths, the ogive is always an S-curve; for very unequal widths it may look asymmetric."
      ],
      "key_takeaway": "Less-than ogive: plot (upper boundary, cumulative frequency). Start at (lower boundary of first class, 0). Join with smooth S-curve. Ends at (last upper boundary, n).",
      "video_script_hooks": [
        "Opening: 'Add up the frequencies as you go — that\\'s the cumulative frequency column. Plot those totals against the upper class boundaries. Join with a smooth curve. You just drew an ogive.'",
        "Mid-lesson: 'The S-shape isn\\'t random: data piles up in the middle and thins out at the extremes. The steepest part of the S is the modal class — the most crowded interval.'",
        "Closing: 'Remember: upper boundary, running total, smooth curve, starting point at zero. Four checkpoints. Hit all four and your ogive is exam-ready.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch23_ogive_statistics",
    "key_formulas": [
      "Median from less-than ogive: draw horizontal at y = n/2; read x-coordinate",
      "Lower quartile Q1: draw horizontal at y = n/4; read x-coordinate",
      "Upper quartile Q3: draw horizontal at y = 3n/4; read x-coordinate",
      "Inter-quartile range (IQR) = Q3 − Q1",
      "Percentile Pk: draw horizontal at y = k×n/100; read x-coordinate"
    ],
    "prerequisite_knowledge": [
      "Constructing a less-than ogive",
      "Meaning of median: value that divides the data into two equal halves",
      "Meaning of quartiles: Q1 = 25th percentile, Q3 = 75th percentile",
      "Reading coordinates from a graph"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The ogive is a graph that tells you: 'Given a y-value (count of students), what mark x corresponds?' The median is the x-value where exactly half the students scored below it. So draw a horizontal line at y = n/2, see where it hits the ogive, then drop down to the x-axis. That x-value is the median. Same idea for Q1 (at n/4) and Q3 (at 3n/4).",
      "derivation": "Less-than ogive plots (x, cumulative frequency). To find median: find n/2 on the y-axis → draw horizontal → it intersects the ogive at a point → drop a vertical to x-axis → that x = median. Q1: same with n/4. Q3: same with 3n/4. IQR = Q3 − Q1. The two ogives (less-than and more-than) intersect exactly at the median point.",
      "worked_example": "n = 40, ogive already drawn. Median: y = 40/2 = 20 → draw horizontal at 20 → hits ogive at x = 28.5 → median = 28.5. Q1: y = 40/4 = 10 → hits ogive at x = 22 → Q1 = 22. Q3: y = 3×40/4 = 30 → hits ogive at x = 34 → Q3 = 34. IQR = 34 − 22 = 12.",
      "visual_description": "Ogive with three horizontal lines drawn: at n/4 (dotted), n/2 (solid, for median), and 3n/4 (dotted). Vertical lines dropped from each intersection point. The three x-values read off are Q1, median, Q3 respectively. IQR is the distance between Q1 and Q3 on the x-axis.",
      "svg_diagrams": [
        "<svg viewBox='0 0 280 170' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='150' x2='260' y2='150' stroke='#333' stroke-width='1.5'/><line x1='30' y1='10' x2='30' y2='150' stroke='#333' stroke-width='1.5'/><path d='M 50,148 C 80,140 100,120 130,80 C 155,50 175,32 220,18 C 235,15 245,13 255,12' fill='none' stroke='#4CAF50' stroke-width='2'/><line x1='30' y1='80' x2='130' y2='80' stroke='#E91E63' stroke-width='1.5' stroke-dasharray='4,2'/><line x1='130' y1='80' x2='130' y2='150' stroke='#E91E63' stroke-width='1.5' stroke-dasharray='4,2'/><text x='2' y='83' font-size='9' fill='#E91E63'>n/2</text><text x='122' y='165' font-size='9' fill='#E91E63'>M</text><text x='0' y='15' font-size='9'>n</text></svg>"
      ],
      "common_misconceptions": [
        "Drawing vertical first (from x) instead of horizontal first (from y) — always start at the y-axis at n/2 or n/4 or 3n/4.",
        "Using n/2 = 20 but reading from x=20 on the x-axis — n/2 is on the y-axis, not x-axis.",
        "Confusing Q1 and Q3: Q1 is the lower (smaller) quartile at n/4; Q3 is the upper quartile at 3n/4."
      ],
      "shortcuts_and_tricks": [
        "Median: y = n/2. Q1: y = n/4. Q3: y = 3n/4. These three y-values are all you need.",
        "IQR = Q3 − Q1 — middle 50% of the data spans this range.",
        "If n is not divisible by 4, round to the nearest gridline on the y-axis; read the x-coordinate as an approximation.",
        "Cross-check: median from ogive should agree (approximately) with median calculated by formula."
      ],
      "when_to_use_this_method": "Use when the question says 'use the ogive to find the median/quartiles' or 'draw the ogive and estimate the median'. The graphical method gives an approximate value; the formula method gives the exact class-level estimate.",
      "edge_cases": [
        "If the horizontal at n/2 falls exactly on a plotted point, the median is that exact x-value (upper boundary of that class).",
        "If n is odd (e.g., n=35): n/2 = 17.5 — still draw horizontal at 17.5 on y-axis.",
        "Percentile: the pth percentile is at y = p×n/100. For example, 60th percentile: y = 0.6×n."
      ],
      "key_takeaway": "To read median from ogive: (1) compute n/2; (2) mark it on y-axis; (3) draw horizontal to ogive; (4) drop vertical to x-axis; (5) read x. Same method for Q1 (n/4) and Q3 (3n/4).",
      "video_script_hooks": [
        "Opening: 'Your ogive is drawn. Now find n/2 on the y-axis. Draw a horizontal line right to the curve. Drop a vertical down. That x-value is the median. Five seconds.'",
        "Mid-lesson: 'Quartile Q1 is at n/4, Q3 is at 3n/4. IQR = Q3 − Q1 = the width of the middle 50% box. Three horizontal lines, three drops, done.'",
        "Closing: 'Ogive → draw horizontal at y = n/2 → read x = median. This is the one skill that appears in every ICSE exam. Practise until it takes under a minute.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch24_central_tendency_problems",
    "key_formulas": [
      "Mean = Σfx/Σf (direct) or A + Σfd/Σf (assumed mean) or A + (Σfu/Σf)×h (step-deviation)",
      "Median = L + ((n/2 − cf)/f) × h",
      "Mode = L + ((f₁ − f₀)/(2f₁ − f₀ − f₂)) × h",
      "Empirical relation: Mode ≈ 3Median − 2Mean (moderately skewed data)",
      "For raw data: Mean = Σx/n; Median = middle value (odd n) or avg of two middle values (even n); Mode = most frequent value"
    ],
    "prerequisite_knowledge": [
      "All three formulas for mean, median, and mode of grouped data (Ch24.1–24.3).",
      "Understanding when each measure is most appropriate.",
      "Cumulative frequency tables for median; modal class identification for mode.",
      "Ability to verify: empirical relation Mode ≈ 3Median − 2Mean."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Different measures of central tendency suit different situations. Mean uses every data value but is sensitive to outliers. Median is resistant to extreme values — it's the middle regardless of how large the largest value is. Mode tells you the most common value — useful for categorical or skewed data.",
      "derivation": "The three measures relate via the empirical formula Mode ≈ 3Median − 2Mean. This holds for unimodal, moderately skewed frequency distributions. Derived empirically from many real datasets. Use it to: (a) verify all three calculations, (b) find one measure if the other two are given.",
      "worked_example": "Given: Mean = 35.4, Median = 35. Find Mode using empirical relation. Mode ≈ 3×35 − 2×35.4 = 105 − 70.8 = 34.2. Verify: If Mode < Median < Mean → negatively skewed? No, 34.2 < 35 < 35.4 → slightly negative skew. This is consistent.",
      "visual_description": "Draw a number line with Mode, Median, Mean marked. For a right-skewed (positively skewed) distribution: Mode < Median < Mean. For left-skewed: Mean < Median < Mode. For symmetric: Mean = Median = Mode.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='10' width='280' height='140' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='26' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Skewness and Central Tendency</text><text x='30' y='50' font-size='9' fill='#334155'>Positive skew (right tail):</text><text x='30' y='64' font-size='9' fill='#1d4ed8'>Mode &lt; Median &lt; Mean</text><line x1='30' y1='75' x2='290' y2='75' stroke='#94a3b8' stroke-width='1'/><circle cx='80' cy='75' r='4' fill='#22c55e'/><text x='80' y='90' text-anchor='middle' font-size='8' fill='#22c55e'>Mode</text><circle cx='155' cy='75' r='4' fill='#f59e0b'/><text x='155' y='90' text-anchor='middle' font-size='8' fill='#f59e0b'>Median</text><circle cx='230' cy='75' r='4' fill='#ef4444'/><text x='230' y='90' text-anchor='middle' font-size='8' fill='#ef4444'>Mean</text><text x='30' y='115' font-size='9' fill='#334155'>Empirical: Mode ≈ 3 × Median − 2 × Mean</text><text x='30' y='132' font-size='9' fill='#475569'>Use this to find the 3rd if two are known.</text></svg>"
      ],
      "common_misconceptions": [
        "Thinking mean is always the best measure — for skewed data (incomes, marks with outliers) median is more representative.",
        "Using the empirical relation as exact — it's approximate; only works for roughly bell-shaped distributions.",
        "Forgetting that for raw (ungrouped) data the median formula is different: sort and pick middle value(s).",
        "Confusing which class to use: for median use CF ≥ n/2; for mode use highest f — these are usually different classes."
      ],
      "shortcuts_and_tricks": [
        "If two of {mean, median, mode} are found, use empirical relation to check the third — a great exam self-check.",
        "For a symmetric distribution (mean = median = mode), only one calculation is needed to find all three.",
        "In ICSE problems: if asked to 'comment on the distribution', compare mean vs median. Mean > Median → right skew; Mean < Median → left skew.",
        "When asked to find missing frequency given mean/median: set up the equation and solve for the unknown f."
      ],
      "when_to_use_this_method": "Mixed problems typically ask you to: (1) compute all three measures, (2) find a missing frequency given one measure, (3) use the empirical relation, or (4) state which measure is most appropriate for a given context.",
      "edge_cases": [
        "If the mean is given and one frequency is missing: Σfx = Mean × n; set up equation with unknown f and solve.",
        "If the median class frequency is unknown: use Median = L + ((n/2 − cf)/f) × h and solve for f.",
        "For raw data with repeated values: mode may be multimodal; mean and median are unique."
      ],
      "key_takeaway": "Know all three formulas and when to apply each. Use empirical relation (Mode ≈ 3Median − 2Mean) to verify or find a missing measure. Mean is affected by outliers; median is robust; mode is the most frequent.",
      "video_script_hooks": [
        "Mean, median, mode — three ways to describe 'typical'. Each tells a different story about the same data. ICSE asks you to tell all three.",
        "Here's an exam trick: calculate two of the three, then use Mode = 3Median − 2Mean to instantly check the third. If it doesn't match, you made an arithmetic error somewhere."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch24_mean_grouped",
    "key_formulas": [
      "Direct method: Mean = Σfx / Σf, where x = class midpoint",
      "Assumed mean method: Mean = A + Σfd / Σf, where d = x − A",
      "Step-deviation method: Mean = A + (Σfu / Σf) × h, where u = (x − A)/h",
      "Class midpoint x = (lower limit + upper limit) / 2",
      "Σf = total frequency = n"
    ],
    "prerequisite_knowledge": [
      "Class intervals and class marks (midpoints) for grouped frequency tables.",
      "Summation notation Σ — sum over all classes.",
      "Basic arithmetic: multiplication of decimals, division to find averages.",
      "Concept of frequency as a weight — high-frequency classes pull the mean."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The mean of grouped data is a weighted average: each class midpoint is weighted by how many data values fall in that class. Imagine 30 students scored in the 60–70 range — that midpoint of 65 pulls the mean far more than a class with only 2 students.",
      "derivation": "Direct method: Treat every value in a class as equal to the midpoint x. Mean = (f₁x₁ + f₂x₂ + … + fₙxₙ) / (f₁ + f₂ + … + fₙ) = Σfx / Σf. Assumed mean shortcut: Let d = x − A. Then Σfx = Σf(A + d) = AΣf + Σfd, so Mean = A + Σfd/Σf. Step-deviation: Let u = d/h = (x−A)/h. Then Mean = A + (Σfu/Σf)×h. Both shortcuts reduce arithmetic with large numbers.",
      "worked_example": "Find the mean of: Class 0–10(f=5), 10–20(f=10), 20–30(f=15), 30–40(f=12), 40–50(f=8). Midpoints: 5,15,25,35,45. Σf=50. Using A=25: d=−20,−10,0,10,20. Σfd = 5(−20)+10(−10)+15(0)+12(10)+8(20) = −100−100+0+120+160 = 80. Mean = 25 + 80/50 = 25 + 1.6 = 26.6.",
      "visual_description": "Draw the frequency table with columns: Class | Midpoint x | Frequency f | fx (or d, u). Show the running totals Σf and Σfx at the bottom. Draw a histogram — the mean is the balance point of the histogram's area.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='10' width='280' height='140' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='28' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Mean of Grouped Data — Step-Deviation</text><text x='30' y='50' font-size='10' fill='#334155'>Class | x | f | u=(x−A)/h | fu</text><line x1='20' y1='55' x2='300' y2='55' stroke='#94a3b8' stroke-width='0.5'/><text x='30' y='68' font-size='9' fill='#475569'>0–10 | 5 | 5 | −2 | −10</text><text x='30' y='82' font-size='9' fill='#475569'>10–20 | 15 | 10 | −1 | −10</text><text x='30' y='96' font-size='9' fill='#475569'>20–30 | 25 | 15 | 0 | 0 ← A</text><text x='30' y='110' font-size='9' fill='#475569'>30–40 | 35 | 12 | +1 | +12</text><text x='30' y='124' font-size='9' fill='#475569'>40–50 | 45 | 8 | +2 | +16</text><line x1='20' y1='128' x2='300' y2='128' stroke='#94a3b8' stroke-width='0.5'/><text x='30' y='142' font-size='9' font-weight='bold' fill='#0f172a'>Σf=50 | Σfu=8 → Mean=25+(8/50)×10=26.6</text></svg>"
      ],
      "common_misconceptions": [
        "Using class limits instead of midpoints — always use (L + U)/2 as the representative value for a class.",
        "Wrong assumed mean: A can be ANY value (ideally a central midpoint), but the answer is the same regardless. Pick one that minimises arithmetic.",
        "Forgetting to multiply Σfu/Σf by h in the step-deviation method — the h factor is essential.",
        "Confusing Σfx (sum of fx products) with Σf (total frequency) — divide the former by the latter."
      ],
      "shortcuts_and_tricks": [
        "Choose A as the midpoint of the class with the highest frequency (modal class) — this minimises |d| values.",
        "Choose h = class width (works only for equal class widths) — reduces u values to small integers like −2,−1,0,1,2.",
        "When all class widths are equal, step-deviation is fastest. For unequal widths use direct or assumed mean.",
        "Quick check: the mean must lie within the range of the data (between smallest and largest midpoints)."
      ],
      "when_to_use_this_method": "Use direct method for small or decimal midpoints. Use assumed mean or step-deviation when midpoints are large (e.g., 250, 350, 450 …) — these cut computation. Step-deviation only works for equal class widths.",
      "edge_cases": [
        "Open-ended classes (e.g., 'below 10' or '60 and above'): assume reasonable boundaries or state that mean cannot be precisely determined.",
        "If Σf = 0 (empty table): undefined — cannot compute mean.",
        "Single class: mean = midpoint of that class regardless of frequency."
      ],
      "key_takeaway": "Mean = Σfx/Σf (direct) or A + Σfd/Σf (assumed mean) or A + (Σfu/Σf)×h (step-deviation). All three give the same answer; pick whichever minimises arithmetic for the given numbers.",
      "video_script_hooks": [
        "Imagine 50 test scores grouped into buckets of 10 — we can't see individual scores, only bucket counts. How do we find the average? That's exactly what this method does.",
        "Here's the trick professionals use: choose a 'pretend average' (assumed mean), measure how far each class is from it, and correct. It's like zeroing a scale before weighing."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch24_median_grouped",
    "key_formulas": [
      "Median = L + ((n/2 − cf) / f) × h",
      "L = lower boundary of the median class",
      "n = total frequency (Σf)",
      "cf = cumulative frequency of the class BEFORE the median class",
      "f = frequency of the median class",
      "h = class width",
      "Median class: the class whose cumulative frequency first reaches or exceeds n/2"
    ],
    "prerequisite_knowledge": [
      "Cumulative frequency: running total of frequencies from the first class onwards.",
      "Class boundaries (lower and upper limits) and class width h.",
      "Locating which class contains the median using the CF table.",
      "Concept of median: the value that divides the distribution into two equal halves."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The median is the middle value. For grouped data we can't list individual values, so we locate the class containing the n/2-th value using cumulative frequencies, then interpolate within that class assuming values are spread uniformly inside it.",
      "derivation": "Build the CF column. The median is the value at position n/2. Find the class where CF first ≥ n/2 — this is the median class. Within this class, (n/2 − cf) values are needed beyond the cf already accumulated before this class. Since f values are spread uniformly over width h, we advance (n/2 − cf)/f of the way through the class: Median = L + ((n/2 − cf)/f) × h.",
      "worked_example": "Data: 0–10(f=3), 10–20(f=5), 20–30(f=9), 30–40(f=7), 40–50(f=6). n=30, n/2=15. CF: 3, 8, 17, 24, 30. Median class: 20–30 (CF first reaches 17 ≥ 15). L=20, cf=8 (CF before), f=9, h=10. Median = 20 + ((15−8)/9)×10 = 20 + (7/9)×10 = 20 + 7.78 = 27.78.",
      "visual_description": "Draw the cumulative frequency (ogive) curve. Mark n/2 on the y-axis. Draw a horizontal line to the ogive, then drop vertically to the x-axis — that x-value is the median. Confirm it matches the formula.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='10' width='280' height='140' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='26' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Median Formula — Interpolation</text><rect x='110' y='35' width='100' height='50' fill='#dbeafe' stroke='#3b82f6' stroke-width='1.5'/><text x='160' y='52' text-anchor='middle' font-size='10' fill='#1d4ed8'>Median class</text><text x='160' y='66' text-anchor='middle' font-size='9' fill='#1d4ed8'>L=20, f=9, h=10</text><text x='160' y='80' text-anchor='middle' font-size='9' fill='#1d4ed8'>cf=8 (before class)</text><text x='30' y='100' font-size='9' fill='#475569'>n/2 = 15; need 15−8=7 more values</text><text x='30' y='115' font-size='9' fill='#475569'>into the class of 9 values over width 10</text><text x='30' y='132' font-size='10' font-weight='bold' fill='#0f172a'>Median = 20 + (7/9)×10 = 27.8</text></svg>"
      ],
      "common_misconceptions": [
        "Using n/2 + 1 (raw data formula) for grouped data — always use exactly n/2 for grouped/continuous data.",
        "Taking cf as the CF of the median class instead of the class BEFORE it — cf is the cumulative count BEFORE the median class.",
        "Using class midpoint instead of lower boundary L in the formula.",
        "Confusing median class with modal class (highest frequency) — they are usually different."
      ],
      "shortcuts_and_tricks": [
        "If n is given directly, n/2 is your target CF. Scan down the CF column for the first entry ≥ n/2.",
        "Write out the full CF column first before searching — do not try to find the median class mentally.",
        "Double-check: final median must lie within the median class interval [L, L+h].",
        "For equal class widths the formula simplifies arithmetic; verify h = upper − lower of median class."
      ],
      "when_to_use_this_method": "Use the grouped median formula whenever data is presented in a frequency table with class intervals. The ogive graphical method gives the same result and is useful for checking.",
      "edge_cases": [
        "Even n: n/2 gives the exact median position for continuous grouped data (no averaging two middle values needed, unlike raw data).",
        "If two classes tie for CF = n/2: both candidates give approximately the same median; use the first one.",
        "Open-ended classes: if the median class is not open-ended, the formula still applies; if it is, state the answer as approximate."
      ],
      "key_takeaway": "Median = L + ((n/2 − cf)/f) × h. Find the median class (first CF ≥ n/2), plug in L, cf before it, frequency f, and width h.",
      "video_script_hooks": [
        "The median divides your class into two equal halves. But when data is in groups, we need to 'zoom in' to the right class and interpolate. That's the formula.",
        "Picture climbing a staircase (the ogive). When you reach step n/2, you're at the median. The formula is just describing that step precisely."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch24_mode_grouped",
    "key_formulas": [
      "Mode = L + ((f₁ − f₀) / (2f₁ − f₀ − f₂)) × h",
      "L = lower boundary of the modal class",
      "f₁ = frequency of the modal class (highest frequency)",
      "f₀ = frequency of the class BEFORE the modal class",
      "f₂ = frequency of the class AFTER the modal class",
      "h = class width",
      "Modal class = class with the highest frequency"
    ],
    "prerequisite_knowledge": [
      "Mode for raw data = most frequently occurring value.",
      "Class with the highest frequency is called the modal class.",
      "Class boundaries L and h (class width).",
      "Why mode is not just the midpoint of the modal class — it's pulled towards whichever neighboring class has more data."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The mode is the most 'popular' value. For grouped data, the modal class has the highest frequency. Within that class, the mode is pulled towards the heavier neighbour — if the class before has more data, the mode leans left; if the class after has more, it leans right. The formula captures this pull.",
      "derivation": "Let f₁ be the modal class frequency, f₀ the class before, f₂ the class after. The two differences (f₁ − f₀) and (f₁ − f₂) measure how much the mode is pulled right and left respectively. The fraction (f₁ − f₀)/(f₁ − f₀ + f₁ − f₂) = (f₁ − f₀)/(2f₁ − f₀ − f₂) gives the proportional position within the class. Multiply by h and add L: Mode = L + ((f₁ − f₀)/(2f₁ − f₀ − f₂)) × h.",
      "worked_example": "Data: 0–10(f=2), 10–20(f=7), 20–30(f=13), 30–40(f=9), 40–50(f=4). Modal class = 20–30 (f₁=13). f₀=7, f₂=9, L=20, h=10. Mode = 20 + ((13−7)/(2×13−7−9))×10 = 20 + (6/10)×10 = 20 + 6 = 26.",
      "visual_description": "Draw the histogram. The modal class is the tallest bar. The mode sits within it, leaning towards the shorter neighbouring bar (because the formula's denominator 2f₁−f₀−f₂ = (f₁−f₀)+(f₁−f₂) balances both pulls).",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='10' width='280' height='140' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='26' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Mode Formula — Modal Class Pull</text><rect x='60' y='90' width='40' height='35' fill='#bfdbfe' stroke='#3b82f6'/><text x='80' y='86' text-anchor='middle' font-size='8' fill='#1d4ed8'>f₀=7</text><rect x='100' y='55' width='40' height='70' fill='#1d4ed8' stroke='#1e40af'/><text x='120' y='50' text-anchor='middle' font-size='8' fill='#1d4ed8'>f₁=13 (modal)</text><rect x='140' y='75' width='40' height='50' fill='#bfdbfe' stroke='#3b82f6'/><text x='160' y='71' text-anchor='middle' font-size='8' fill='#1d4ed8'>f₂=9</text><line x1='126' y1='55' x2='126' y2='140' stroke='#ef4444' stroke-width='1.5' stroke-dasharray='3,2'/><text x='126' y='150' text-anchor='middle' font-size='8' fill='#ef4444'>Mode=26</text><text x='30' y='130' font-size='8' fill='#475569'>Mode=20+(6/10)×10=26 — leans left toward f₀&gt;f₂? No here f₀&lt;f₂</text></svg>"
      ],
      "common_misconceptions": [
        "Taking the midpoint of the modal class as the mode — this ignores the asymmetry from neighbouring classes.",
        "Mixing up f₀ and f₂ (reversing before/after) — f₀ is the class BEFORE (lower class), f₂ is AFTER (higher class).",
        "When two classes tie for highest frequency: technically bimodal; ICSE papers usually avoid this — if it happens, state both modal classes.",
        "Forgetting to multiply the fraction by h — the fraction alone gives a position within a unit interval, not within the class."
      ],
      "shortcuts_and_tricks": [
        "If the denominator 2f₁ − f₀ − f₂ = 0, the mode cannot be determined this way (uniform spread); this is rare in ICSE problems.",
        "Quick sanity check: mode must lie within [L, L+h]. If it doesn't, recheck f₀ and f₂ assignment.",
        "When f₁ is much larger than both neighbours, the mode ≈ midpoint of the modal class (fraction ≈ 0.5).",
        "Empirical relation check: Mode ≈ 3Median − 2Mean (for moderately skewed data). Use this to verify answers."
      ],
      "when_to_use_this_method": "Use when finding the most typical or popular value. Mode is preferred for data like 'most common shoe size' or 'most frequent salary range'. It's least affected by extreme values.",
      "edge_cases": [
        "If modal class is the first class (no class before): f₀ = 0; formula still works.",
        "If modal class is the last class (no class after): f₂ = 0; formula still works.",
        "Bimodal distribution: two classes with equal highest frequency — report both modes."
      ],
      "key_takeaway": "Mode = L + ((f₁ − f₀)/(2f₁ − f₀ − f₂)) × h. Find the modal class (highest f), identify f₀ (before) and f₂ (after), substitute into the formula.",
      "video_script_hooks": [
        "The mode doesn't just live in the middle of the most popular class — it leans towards whichever neighbour has more data. The formula captures exactly how much it leans.",
        "Mean, median, mode — three ways to find the 'centre'. In ICSE, you'll calculate all three and often compare them on the same data set."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch25_experimental_probability",
    "key_formulas": [
      "Experimental P(E) = Number of times event E occurred / Total number of trials",
      "As trials increase, experimental probability → theoretical probability (Law of Large Numbers)",
      "Relative frequency = frequency of outcome / total trials"
    ],
    "prerequisite_knowledge": [
      "Difference between theoretical and experimental probability.",
      "Concept of a trial: one execution of the random experiment.",
      "Frequency tables: counting how many times each outcome appeared.",
      "Fractions and their simplification."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Theoretical probability is computed from symmetry ('a fair coin has equal sides'). Experimental probability is computed from actual data: if you flip a coin 100 times and get 47 heads, the experimental P(head) = 47/100 = 0.47. With more flips, this approaches the theoretical 0.5. Experimental probability is used when theoretical probability cannot be computed — e.g., P(a factory produces a defective item).",
      "derivation": "In n trials, if event E occurs k times, the relative frequency = k/n. As n → ∞, relative frequency converges to the true probability P(E) (by the Law of Large Numbers). So experimental P(E) = k/n is an estimate of the true P(E). The estimate improves as n grows.",
      "worked_example": "A die is rolled 120 times. Outcomes: 1(f=18), 2(f=22), 3(f=20), 4(f=21), 5(f=19), 6(f=20). (i) Experimental P(3) = 20/120 = 1/6. (ii) P(even) = (22+21+20)/120 = 63/120 = 21/40. (iii) Theoretical P(3) = 1/6. Experimental ≈ theoretical — die appears fair.",
      "visual_description": "Draw a bar chart showing the frequency of each outcome. If the die is fair, bars should be approximately equal in height (around n/6 each). Add a horizontal dotted line at n/6 to show the expected frequency. The closer the bars are to this line, the fairer the die.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='10' width='280' height='140' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='26' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Experimental vs Theoretical Probability</text><line x1='40' y1='130' x2='40' y2='40' stroke='#94a3b8' stroke-width='1'/><line x1='40' y1='130' x2='300' y2='130' stroke='#94a3b8' stroke-width='1'/><rect x='50' y='76' width='25' height='54' fill='#3b82f6' opacity='0.7'/><rect x='90' y='68' width='25' height='62' fill='#3b82f6' opacity='0.7'/><rect x='130' y='74' width='25' height='56' fill='#3b82f6' opacity='0.7'/><rect x='170' y='70' width='25' height='60' fill='#3b82f6' opacity='0.7'/><rect x='210' y='72' width='25' height='58' fill='#3b82f6' opacity='0.7'/><rect x='250' y='74' width='25' height='56' fill='#3b82f6' opacity='0.7'/><line x1='40' y1='73' x2='295' y2='73' stroke='#ef4444' stroke-width='1' stroke-dasharray='4,3'/><text x='298' y='76' font-size='8' fill='#ef4444'>n/6</text><text x='63' y='143' text-anchor='middle' font-size='8' fill='#475569'>1</text><text x='103' y='143' text-anchor='middle' font-size='8' fill='#475569'>2</text><text x='143' y='143' text-anchor='middle' font-size='8' fill='#475569'>3</text><text x='183' y='143' text-anchor='middle' font-size='8' fill='#475569'>4</text><text x='223' y='143' text-anchor='middle' font-size='8' fill='#475569'>5</text><text x='263' y='143' text-anchor='middle' font-size='8' fill='#475569'>6</text></svg>"
      ],
      "common_misconceptions": [
        "Experimental and theoretical probability are always equal: they are not — experimental probability fluctuates around the theoretical value. More trials → closer convergence.",
        "If a coin lands heads 10 times in a row, the next toss is more likely to be tails: false (gambler's fallacy) — each toss is independent.",
        "More trials make experimental probability exactly equal to theoretical: they converge but typically never become exactly equal except by coincidence.",
        "Experimental probability can be greater than 1: impossible — it's always k/n where k ≤ n."
      ],
      "shortcuts_and_tricks": [
        "Always check: sum of all experimental probabilities = total frequency / n = n/n = 1.",
        "To check if data matches a fair experiment, compare each experimental probability to the theoretical — they should be close.",
        "For questions asking 'how many times would X occur in N future trials': expected frequency = P(X) × N."
      ],
      "when_to_use_this_method": "Use experimental probability when (a) outcomes are not equally likely, or (b) theoretical probability cannot be computed, or (c) you are given frequency data from an actual experiment and asked to compute P(E).",
      "edge_cases": [
        "If an outcome never occurs in n trials, its experimental probability = 0. This doesn't mean it's impossible — it may just be rare.",
        "For predicted frequency: if P(E) = 3/5 and we perform 200 trials, expected occurrences = (3/5) × 200 = 120."
      ],
      "key_takeaway": "Experimental P(E) = occurrences/trials. Improves with more trials. Gambler's fallacy does not apply — trials are independent.",
      "video_script_hooks": [
        "We can't know if a coin is truly fair by looking at it. But flip it 1000 times and count — if it's fair, you'll see about 500 heads. That's experimental probability proving theoretical claims.",
        "Insurance companies, weather forecasters, and quality control engineers use experimental probability every day — they can't compute P(event) from symmetry, so they use past data instead."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch25_probability_basics",
    "key_formulas": [
      "P(E) = Number of favourable outcomes / Total number of equally likely outcomes",
      "0 ≤ P(E) ≤ 1 for any event E",
      "P(E) + P(E') = 1, where E' is the complementary event",
      "P(impossible event) = 0; P(certain event) = 1",
      "Sample space S: set of all possible outcomes of an experiment"
    ],
    "prerequisite_knowledge": [
      "Set notation: elements, subsets, cardinality |S|.",
      "Fractions and their simplification.",
      "Concept of experiment, outcome, and event from Class 9.",
      "Understanding of equally likely outcomes — each outcome has the same chance of occurring."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Probability measures how likely an event is on a scale from 0 (impossible) to 1 (certain). Flipping a fair coin: P(head) = 1/2 because there are 2 equally likely outcomes and head is 1 of them. The key word is 'equally likely' — probability is only P(favourable)/P(total) when every outcome has the same chance.",
      "derivation": "If a sample space S has n equally likely outcomes, and event E consists of m of these outcomes, then by symmetry each outcome has probability 1/n, so P(E) = m × (1/n) = m/n. For complementary events: the favourable outcomes for E' are all outcomes not in E. |E'| = n − m. P(E') = (n−m)/n = 1 − m/n = 1 − P(E).",
      "worked_example": "A bag contains 5 red, 3 blue, 2 green balls. A ball is drawn at random. Find: (i) P(red) = 5/10 = 1/2. (ii) P(not green) = 1 − P(green) = 1 − 2/10 = 8/10 = 4/5. (iii) P(yellow) = 0 (impossible — no yellow balls).",
      "visual_description": "Draw a probability line from 0 to 1. Mark: 0 = impossible (e.g., rolling a 7 on a die), 1/6 = P(rolling a 6), 1/2 = P(head on coin), 1 = certain. Events with P near 0.5 are most uncertain; P near 0 or 1 are nearly certain.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 100' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='10' width='280' height='80' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='26' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Probability Scale</text><line x1='30' y1='55' x2='290' y2='55' stroke='#64748b' stroke-width='2'/><circle cx='30' cy='55' r='4' fill='#ef4444'/><text x='30' y='70' text-anchor='middle' font-size='8' fill='#ef4444'>0</text><text x='30' y='80' text-anchor='middle' font-size='7' fill='#ef4444'>Impossible</text><circle cx='105' cy='55' r='4' fill='#f59e0b'/><text x='105' y='70' text-anchor='middle' font-size='8' fill='#f59e0b'>1/4</text><circle cx='160' cy='55' r='4' fill='#6366f1'/><text x='160' y='70' text-anchor='middle' font-size='8' fill='#6366f1'>1/2</text><text x='160' y='80' text-anchor='middle' font-size='7' fill='#6366f1'>Even chance</text><circle cx='215' cy='55' r='4' fill='#f59e0b'/><text x='215' y='70' text-anchor='middle' font-size='8' fill='#f59e0b'>3/4</text><circle cx='290' cy='55' r='4' fill='#22c55e'/><text x='290' y='70' text-anchor='middle' font-size='8' fill='#22c55e'>1</text><text x='290' y='80' text-anchor='middle' font-size='7' fill='#22c55e'>Certain</text></svg>"
      ],
      "common_misconceptions": [
        "P(E) can exceed 1: impossible — probability is always between 0 and 1 inclusive.",
        "All events are equally likely: only when the problem specifies 'at random' with identical items. A loaded die does not have equally likely outcomes.",
        "P(E') = 1 + P(E): wrong sign — it's P(E') = 1 − P(E).",
        "Confusing outcomes with events: an event is a SET of outcomes; an outcome is a single result."
      ],
      "shortcuts_and_tricks": [
        "P(at least one) = 1 − P(none). This is almost always easier than counting favourable outcomes directly.",
        "For complementary events: P(E) + P(E') = 1 always. If P(E) = 3/7, then P(E') = 4/7 instantly.",
        "Simplify the fraction P = m/n before writing the final answer.",
        "Sanity check: add all mutually exclusive, exhaustive probabilities — they must sum to 1."
      ],
      "when_to_use_this_method": "Use the basic formula P = favourable/total whenever outcomes are equally likely (fair coin, fair die, well-shuffled cards, random ball from bag). For unequal likelihoods, use experimental probability or given probability values.",
      "edge_cases": [
        "Drawing without replacement changes the sample space for the second draw — new total is n−1.",
        "Probability of an event that includes ALL outcomes = 1 (certain event).",
        "If asked for P(E or F) where E and F are mutually exclusive: P(E or F) = P(E) + P(F)."
      ],
      "key_takeaway": "P(E) = favourable/total (equally likely). Range [0,1]. P(E') = 1 − P(E). Impossible = 0, Certain = 1.",
      "video_script_hooks": [
        "Every time you make a decision under uncertainty — which route to take, will it rain — you're intuitively computing probability. This chapter makes that intuition precise.",
        "The single formula P = m/n is deceptively simple. The whole challenge is correctly counting m (favourable) and n (total) — and that requires careful thinking."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch25_probability_problems",
    "key_formulas": [
      "P(E) = n(E)/n(S) for equally likely outcomes",
      "P(E') = 1 − P(E) (complement rule)",
      "P(E or F) = P(E) + P(F) for mutually exclusive events",
      "P(E or F) = P(E) + P(F) − P(E and F) for non-exclusive events",
      "Expected frequency = P(E) × total number of trials"
    ],
    "prerequisite_knowledge": [
      "All probability formulas from 25.1–25.3.",
      "Sample space enumeration for dice, coins, cards, and bags.",
      "Complementary events and the complement rule.",
      "When events are mutually exclusive: cannot both occur simultaneously."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Mixed problems combine all probability tools: basic formula, complement rule, conditional setups (without replacement), and compound events. The key strategy: (1) identify the sample space, (2) count favourable outcomes carefully, (3) use complement when 'at least one' or 'not' appears, (4) check if events are mutually exclusive before adding probabilities.",
      "derivation": "Addition rule: For any events A and B, P(A∪B) = P(A) + P(B) − P(A∩B). When mutually exclusive (A∩B=∅): P(A∪B) = P(A)+P(B). Multiplication rule for independent events: P(A∩B) = P(A) × P(B). For without-replacement draws: P(2nd|1st) changes because the pool is reduced.",
      "worked_example": "A box has 4 red and 6 blue balls. Two balls drawn without replacement. P(both red) = (4/10) × (3/9) = 12/90 = 2/15. P(one of each) = P(RB) + P(BR) = (4/10)(6/9) + (6/10)(4/9) = 24/90 + 24/90 = 48/90 = 8/15. Check: P(both blue) = (6/10)(5/9) = 30/90 = 1/3. Total: 2/15 + 8/15 + 5/15 = 15/15 = 1 ✓",
      "visual_description": "Draw a tree diagram for compound events. First branch: first draw (R or B with initial probabilities). Second branch: second draw (R or B with updated probabilities after first draw). Multiply along branches; add terminal branches for the required event.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 180' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='310' height='170' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='22' text-anchor='middle' font-size='11' font-weight='bold' fill='#1e293b'>Tree Diagram — Without Replacement</text><circle cx='30' cy='95' r='5' fill='#64748b'/><line x1='35' y1='88' x2='100' y2='55' stroke='#64748b' stroke-width='1.5'/><text x='68' y='66' font-size='9' fill='#ef4444'>4/10 R</text><line x1='35' y1='102' x2='100' y2='135' stroke='#64748b' stroke-width='1.5'/><text x='55' y='125' font-size='9' fill='#3b82f6'>6/10 B</text><circle cx='105' cy='55' r='4' fill='#ef4444'/><circle cx='105' cy='135' r='4' fill='#3b82f6'/><line x1='109' y1='50' x2='180' y2='35' stroke='#64748b' stroke-width='1'/><text x='140' y='37' font-size='8' fill='#ef4444'>3/9 R</text><line x1='109' y1='60' x2='180' y2='75' stroke='#64748b' stroke-width='1'/><text x='135' y='72' font-size='8' fill='#3b82f6'>6/9 B</text><line x1='109' y1='130' x2='180' y2='115' stroke='#64748b' stroke-width='1'/><text x='135' y='117' font-size='8' fill='#ef4444'>4/9 R</text><line x1='109' y1='140' x2='180' y2='155' stroke='#64748b' stroke-width='1'/><text x='135' y='152' font-size='8' fill='#3b82f6'>5/9 B</text><text x='185' y='38' font-size='8' fill='#1e293b'>RR: 12/90</text><text x='185' y='78' font-size='8' fill='#1e293b'>RB: 24/90</text><text x='185' y='118' font-size='8' fill='#1e293b'>BR: 24/90</text><text x='185' y='158' font-size='8' fill='#1e293b'>BB: 30/90</text></svg>"
      ],
      "common_misconceptions": [
        "With replacement vs without: for WITH replacement, denominator stays n for every draw. For WITHOUT, it decreases by 1.",
        "P(A and B) = P(A) × P(B) for dependent events: WRONG — this multiplication rule only holds for independent events. For dependent, use conditional probability.",
        "'Mutually exclusive' = 'independent': completely different concepts. Mutually exclusive events cannot both happen; independent events don't influence each other's probability.",
        "Listing all outcomes of compound events: students often miss some. Systematic listing (tree diagram or grid) prevents missing cases."
      ],
      "shortcuts_and_tricks": [
        "Use complement for 'at least one': P(at least one ×) = 1 − P(no ×). Much faster than counting all 'at least one' cases.",
        "For two draws without replacement: total outcomes = n × (n−1). Favourable for 'both same colour': for r red balls, favourable = r × (r−1).",
        "Mutually exclusive check: can both events happen at the same time? If yes → not mutually exclusive → use inclusion-exclusion.",
        "Sum check: probabilities of all mutually exclusive exhaustive events must sum to 1. Use this to verify your work."
      ],
      "when_to_use_this_method": "Use compound probability methods when the question involves more than one event or more than one stage (two draws, two dice, etc.). Always draw a tree diagram or grid for clarity.",
      "edge_cases": [
        "Replacement vs no replacement: explicitly stated in the problem. Default in ICSE: 'at random' usually means without replacement unless 'with replacement' is stated.",
        "Empty event: if the event has no favourable outcomes, P = 0.",
        "Guaranteed event: if all outcomes are favourable, P = 1."
      ],
      "key_takeaway": "P(at least one) = 1 − P(none). P(A or B) = P(A) + P(B) for mutual exclusion. Without replacement: denominator decreases by 1 after each draw. Draw tree diagrams for compound events.",
      "video_script_hooks": [
        "The complement trick is the most powerful tool in probability: instead of counting all the ways something CAN happen, count the one way it CANNOT, and subtract from 1.",
        "Without replacement problems seem harder, but the tree diagram makes them mechanical: update the denominator after each draw and multiply along each path."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch25_theoretical_probability",
    "key_formulas": [
      "P(E) = n(E) / n(S), where n(E) = number of favourable outcomes, n(S) = size of sample space",
      "For a standard die: n(S) = 6, each face equally likely",
      "For a standard deck of 52 cards: 4 suits × 13 cards each; 4 aces, 4 kings, 13 spades, 12 face cards",
      "For two coins: n(S) = 4 {HH, HT, TH, TT}",
      "For two dice: n(S) = 36"
    ],
    "prerequisite_knowledge": [
      "Basic probability formula P = favourable/total from Sub-topic 25.1.",
      "Structure of a standard deck: 52 cards, 4 suits (clubs, diamonds, hearts, spades), each with A,2,3,4,5,6,7,8,9,10,J,Q,K. Face cards = J,Q,K (12 total).",
      "Dice outcomes and their sums.",
      "Complementary events: P(E') = 1 − P(E)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Classical probability is about counting: how many outcomes are in my event (favourable) vs. how many total outcomes exist (sample space). The challenge is not the formula but correctly listing or counting the sample space and the favourable outcomes — especially for compound experiments like two dice or cards with conditions.",
      "derivation": "Sample space S for n items each equally likely → |S| = n. For compound experiments with n₁ outcomes each followed by n₂ outcomes: |S| = n₁ × n₂ (multiplication principle). E is the event of interest. P(E) = |E| / |S|. For mutually exclusive events A, B: P(A or B) = P(A) + P(B). For complementary: P(E') = 1 − P(E).",
      "worked_example": "Two dice are rolled. Find: (i) P(sum = 7). Favourable pairs: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) — 6 pairs. P = 6/36 = 1/6. (ii) P(sum > 10). Pairs: (5,6),(6,5),(6,6) — 3 pairs. P = 3/36 = 1/12. (iii) P(sum ≤ 3). Pairs: (1,1),(1,2),(2,1) — 3 pairs. P = 3/36 = 1/12.",
      "visual_description": "Draw a 6×6 grid for two dice — rows for die 1 (1–6), columns for die 2 (1–6). Each cell shows the sum. Shade the cells for the event. Count shaded cells for n(E). This grid is a powerful visual tool for any two-dice problem.",
      "svg_diagrams": [
        "<svg viewBox='0 0 320 200' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='310' height='190' fill='#f8fafc' stroke='#e2e8f0'/><text x='160' y='20' text-anchor='middle' font-size='10' font-weight='bold' fill='#1e293b'>Two-Dice Sample Space (sum shown)</text><text x='20' y='35' font-size='8' fill='#64748b'>D2→</text><text x='38' y='35' font-size='8' fill='#64748b'>1</text><text x='58' y='35' font-size='8' fill='#64748b'>2</text><text x='78' y='35' font-size='8' fill='#64748b'>3</text><text x='98' y='35' font-size='8' fill='#64748b'>4</text><text x='118' y='35' font-size='8' fill='#64748b'>5</text><text x='138' y='35' font-size='8' fill='#64748b'>6</text><text x='10' y='50' font-size='8' fill='#64748b'>D1↓</text><text x='10' y='65' font-size='8' fill='#64748b'>1</text><text x='10' y='85' font-size='8' fill='#64748b'>2</text><text x='10' y='105' font-size='8' fill='#64748b'>3</text><text x='10' y='125' font-size='8' fill='#64748b'>4</text><text x='10' y='145' font-size='8' fill='#64748b'>5</text><text x='10' y='165' font-size='8' fill='#64748b'>6</text><text x='38' y='65' font-size='8' fill='#1d4ed8'>2</text><text x='58' y='65' font-size='8' fill='#1d4ed8'>3</text><text x='78' y='65' font-size='8' fill='#1d4ed8'>4</text><text x='98' y='65' font-size='8' fill='#1d4ed8'>5</text><text x='118' y='65' font-size='8' fill='#1d4ed8'>6</text><rect x='130' y='55' width='18' height='12' fill='#fbbf24' opacity='0.5'/><text x='138' y='65' font-size='8' fill='#b45309'>7</text><text x='38' y='85' font-size='8' fill='#1d4ed8'>3</text><text x='58' y='85' font-size='8' fill='#1d4ed8'>4</text><text x='78' y='85' font-size='8' fill='#1d4ed8'>5</text><text x='98' y='85' font-size='8' fill='#1d4ed8'>6</text><rect x='110' y='75' width='18' height='12' fill='#fbbf24' opacity='0.5'/><text x='118' y='85' font-size='8' fill='#b45309'>7</text><text x='138' y='85' font-size='8' fill='#1d4ed8'>8</text><text x='38' y='105' font-size='8' fill='#1d4ed8'>4</text><text x='58' y='105' font-size='8' fill='#1d4ed8'>5</text><text x='78' y='105' font-size='8' fill='#1d4ed8'>6</text><rect x='90' y='95' width='18' height='12' fill='#fbbf24' opacity='0.5'/><text x='98' y='105' font-size='8' fill='#b45309'>7</text><text x='118' y='105' font-size='8' fill='#1d4ed8'>8</text><text x='138' y='105' font-size='8' fill='#1d4ed8'>9</text><text x='38' y='125' font-size='8' fill='#1d4ed8'>5</text><text x='58' y='125' font-size='8' fill='#1d4ed8'>6</text><rect x='70' y='115' width='18' height='12' fill='#fbbf24' opacity='0.5'/><text x='78' y='125' font-size='8' fill='#b45309'>7</text><text x='98' y='125' font-size='8' fill='#1d4ed8'>8</text><text x='118' y='125' font-size='8' fill='#1d4ed8'>9</text><text x='138' y='125' font-size='8' fill='#1d4ed8'>10</text><text x='38' y='145' font-size='8' fill='#1d4ed8'>6</text><rect x='50' y='135' width='18' height='12' fill='#fbbf24' opacity='0.5'/><text x='58' y='145' font-size='8' fill='#b45309'>7</text><text x='78' y='145' font-size='8' fill='#1d4ed8'>8</text><text x='98' y='145' font-size='8' fill='#1d4ed8'>9</text><text x='118' y='145' font-size='8' fill='#1d4ed8'>10</text><text x='138' y='145' font-size='8' fill='#1d4ed8'>11</text><rect x='30' y='155' width='18' height='12' fill='#fbbf24' opacity='0.5'/><text x='38' y='165' font-size='8' fill='#b45309'>7</text><text x='58' y='165' font-size='8' fill='#1d4ed8'>8</text><text x='78' y='165' font-size='8' fill='#1d4ed8'>9</text><text x='98' y='165' font-size='8' fill='#1d4ed8'>10</text><text x='118' y='165' font-size='8' fill='#1d4ed8'>11</text><text x='138' y='165' font-size='8' fill='#1d4ed8'>12</text><text x='175' y='90' font-size='9' fill='#b45309'>Highlighted: sum=7</text><text x='175' y='103' font-size='9' fill='#b45309'>6 cells → P(7)=6/36=1/6</text></svg>"
      ],
      "common_misconceptions": [
        "Order doesn't matter for two dice: it does — (1,2) and (2,1) are DIFFERENT outcomes because die 1 shows 1 and die 2 shows 2, vs die 1 shows 2 and die 2 shows 1. Both count.",
        "Cards 'face cards' = all picture cards: J, Q, K only — NOT Ace. There are 12 face cards total (3 per suit × 4 suits).",
        "P(A and B) = P(A) × P(B) always: this only holds for INDEPENDENT events — not for events from the same experiment without replacement.",
        "P(A or B) = P(A) + P(B) always: only for mutually exclusive events. For non-exclusive: P(A or B) = P(A) + P(B) − P(A and B)."
      ],
      "shortcuts_and_tricks": [
        "Standard deck memory: 52 cards, 4 suits, 13 ranks. Aces: 4. Face cards (J,Q,K): 12. Red cards: 26. Black cards: 26.",
        "Two dice: P(sum=n) is symmetric about 7 — P(sum=6)=P(sum=8)=5/36; P(sum=5)=P(sum=9)=4/36.",
        "P(at least one head in 2 tosses) = 1 − P(no heads) = 1 − 1/4 = 3/4. Always use complement for 'at least one'.",
        "For cards drawn without replacement: second draw's total is 51."
      ],
      "when_to_use_this_method": "Use classical probability whenever outcomes are equally likely and you can enumerate (count) the sample space. Standard examples: fair coin, fair die, cards, coloured balls.",
      "edge_cases": [
        "Drawing without replacement: first draw reduces sample space for second draw.",
        "Conditional probability: P(E | F) = P(E and F) / P(F) — beyond ICSE Class 10 scope but set up correctly with counting.",
        "Non-equally likely outcomes (biased coin): cannot use n(E)/n(S); must use given P values."
      ],
      "key_takeaway": "P(E) = n(E)/n(S). Correctly enumerate S. For two dice n(S)=36; for cards n(S)=52. Use complement for 'at least one'. Order matters for dice and cards.",
      "video_script_hooks": [
        "The hardest part of probability is not the formula — it's counting correctly. Draw the sample space, list it out, shade your event, count. That's it.",
        "Two dice, 36 possibilities. One card from 52. A ball from a bag. Three scenarios that cover 80% of ICSE probability questions. Master the counting for each."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch1_gst_computation",
    "chapterNumber": 1,
    "key_formulas": [
      {
        "formula": "VAT paid by a trader = (rate%) × (SP − CP).",
        "explanation": "The core computational formula — tax on the value the trader added."
      },
      {
        "formula": "Amount a buyer actually pays = Selling Price + VAT charged = SP + (rate%) × SP = SP × (1 + rate/100).",
        "explanation": "The buyer hands over the price PLUS the output tax. The total bill is the price scaled up by the tax rate."
      },
      {
        "formula": "If SP is found after a profit:  SP = CP × (1 + profit%/100).   After a discount:  SP = Marked Price × (1 − discount%/100).",
        "explanation": "VAT problems often hide the selling price behind a profit or a discount — compute SP first, then apply VAT."
      },
      {
        "formula": "Working backwards:  if VAT charged = T at rate r%, then the price = T ÷ (r/100).",
        "explanation": "When a bill gives the tax amount and the rate, divide to recover the price the tax was charged on."
      }
    ],
    "name": "Value Added Tax — Computation and Word Problems",
    "prerequisite_knowledge": [
      "The VAT concept — output tax, input tax, and VAT = rate% × (SP − CP) (sub-topic 1.3).",
      "Percentage increase and decrease — applying a discount or a profit percentage to a price.",
      "Finding a number when a percentage of it is known (working backwards from tax to price).",
      "Profit and loss — computing SP from CP and a profit percent.",
      "Careful money arithmetic with rupees and paise."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Computing VAT is a two-question routine: first pin down the trader's cost price and selling price (often hidden behind a profit percent or a discount), then apply VAT = rate% × (SP − CP). Add the output tax to the price and you have the bill the buyer pays.",
        "hook": "A bill says 'Price ₹8,000, VAT ₹960, Total ₹8,960.' Every VAT word problem is really just reconstructing or checking a bill like this — once you know which number is the price, which is the rate, and which is the tax, the arithmetic is short.",
        "real_world_anchors": [
          "An invoice listing price, VAT, and grand total as three separate lines.",
          "A trader computing the cheque he must send the VAT department this quarter.",
          "A buyer checking whether the VAT on a bill was charged correctly.",
          "A showroom quoting an 'all-inclusive' price and you working out the pre-tax price."
        ],
        "the_pivot_idea": "Never apply VAT to the wrong number. Identify CP and SP first — apply any profit or discount BEFORE computing VAT. VAT is charged on the selling price; the buyer's total bill is SP + VAT.",
        "wrong_intuitions_to_replace": [
          "'Apply VAT to the marked price.' — Wrong if a discount is given. Discount first, then VAT on the discounted (selling) price.",
          "'The total bill is the price plus the rate.' — Wrong. It is price plus the tax AMOUNT (rate% of the price), not price plus the rate number.",
          "'VAT and discount can be applied in either order.' — In ICSE problems VAT is charged on the actual selling price, so the discount is applied first."
        ]
      },
      "derivation": {
        "starting_question": "Given a real trade situation — with profits, discounts and tax — how do we compute the VAT and the final bill without mixing the numbers up?",
        "part_1_fix_the_prices_first": {
          "claim": "Before any tax calculation, settle the cost price and the selling price.",
          "reasoning": "A problem may say 'bought for ₹5,000, sold at 20% profit'. The SP is not given directly — compute SP = 5,000 × 1.20 = ₹6,000 first. Only then is VAT meaningful."
        },
        "part_2_apply_vat_to_the_selling_price": {
          "claim": "Output tax is rate% of the SELLING price; VAT remitted is output tax minus input tax.",
          "reasoning": "Output tax = rate% × SP, input tax = rate% × CP. The trader remits the difference, rate% × (SP − CP). The buyer pays SP + output tax."
        },
        "part_3_working_backwards": {
          "claim": "If the tax amount and rate are given, the price is recovered by division.",
          "reasoning": "If VAT charged is ₹960 at 12%, then 12% of price = 960, so price = 960 ÷ 0.12 = ₹8,000. Many bill-checking problems are this reverse step.",
          "named_concept": "This forward-and-reverse fluency — price→tax and tax→price — is the whole computational skill of the topic."
        }
      },
      "worked_example": [
        {
          "problem": "A trader buys an article for ₹4,000 and sells it at a profit of 25%. VAT is 8%. Find (a) the selling price, (b) the VAT the trader pays, and (c) the total amount the customer pays.",
          "thought_process_before_starting": "Profit is given, not SP — compute SP first. Then VAT = 8% × (SP − CP); the customer pays SP + output tax.",
          "steps": [
            {
              "step_number": 1,
              "action": "Find the selling price from the profit.",
              "computation": "SP = 4,000 × (1 + 25/100) = 4,000 × 1.25 = ₹5,000.",
              "reasoning": "25% profit on the cost price."
            },
            {
              "step_number": 2,
              "action": "VAT the trader remits = 8% of (SP − CP).",
              "computation": "8% of (5,000 − 4,000) = 8% of 1,000 = ₹80.",
              "reasoning": "Tax on the ₹1,000 value he added."
            },
            {
              "step_number": 3,
              "action": "Output tax the customer is charged = 8% of SP.",
              "computation": "8% of 5,000 = ₹400.",
              "reasoning": "The customer pays tax on the full selling price."
            },
            {
              "step_number": 4,
              "action": "Total amount the customer pays.",
              "computation": "5,000 + 400 = ₹5,400.",
              "reasoning": "Selling price plus the output tax."
            }
          ],
          "answer": "SP ₹5,000; VAT paid by the trader ₹80; total paid by the customer ₹5,400."
        },
        {
          "problem": "The marked price of a washing machine is ₹20,000. A shopkeeper gives a 10% discount and then charges VAT at 12%. Find the discount, the selling price, the VAT, and the amount the customer pays.",
          "thought_process_before_starting": "Discount applies to the marked price; VAT is charged on the discounted selling price.",
          "steps": [
            {
              "step_number": 1,
              "action": "Compute the discount.",
              "computation": "Discount = 10% of 20,000 = ₹2,000.",
              "reasoning": "Discount is a percentage of the marked price."
            },
            {
              "step_number": 2,
              "action": "Selling price = marked price − discount.",
              "computation": "SP = 20,000 − 2,000 = ₹18,000.",
              "reasoning": "VAT will be charged on this, not on ₹20,000."
            },
            {
              "step_number": 3,
              "action": "VAT (output tax) = 12% of the selling price.",
              "computation": "12% of 18,000 = ₹2,160.",
              "reasoning": "Tax on the actual selling price."
            },
            {
              "step_number": 4,
              "action": "Amount the customer pays.",
              "computation": "18,000 + 2,160 = ₹20,160.",
              "reasoning": "Discounted price plus VAT."
            }
          ],
          "answer": "Discount ₹2,000; SP ₹18,000; VAT ₹2,160; the customer pays ₹20,160."
        }
      ],
      "visual_description": "The diagram is a worked bill. A marked price of ₹20,000 has a 10% discount struck through it down to a selling price of ₹18,000; a '+12% VAT' arrow adds ₹2,160; the three lines — Selling Price 18,000, VAT 2,160, Total 20,160 — are boxed like an invoice. A side note warns 'discount first, then VAT' with the wrong order crossed out.",
      "svg_diagrams": [
        {
          "id": "vat_bill_discount_then_tax",
          "title": "Building a VAT bill — discount first, then tax",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>VAT BILL — DISCOUNT THEN TAX</text><g font-family='-apple-system, sans-serif'><rect x='110' y='70' width='200' height='50' rx='9' fill='#F5F5F7' stroke='#E5E5EA'/><text x='210' y='92' text-anchor='middle' font-size='12' fill='#86868B'>Marked Price</text><text x='210' y='110' text-anchor='middle' font-size='14' font-weight='700' fill='#86868B'>20,000</text><text x='340' y='100' font-size='12' font-weight='700' fill='#FF9500'>− 10% discount (2,000)</text><rect x='110' y='150' width='200' height='50' rx='9' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='210' y='172' text-anchor='middle' font-size='12' fill='#1D1D1F'>Selling Price</text><text x='210' y='190' text-anchor='middle' font-size='15' font-weight='700' fill='#1D1D1F'>18,000</text><text x='340' y='180' font-size='12' font-weight='700' fill='#34C759'>+ 12% VAT (2,160)</text><line x1='210' y1='120' x2='210' y2='150' stroke='#1D1D1F' stroke-width='2' marker-end='url(#vb)'/><defs><marker id='vb' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto'><path d='M0,0 L8,3 L0,6 Z' fill='#1D1D1F'/></marker></defs></g><rect x='250' y='230' width='260' height='96' rx='10' fill='#FFFFFF' stroke='#1D1D1F' stroke-width='1.5'/><text x='380' y='252' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#86868B' letter-spacing='1'>INVOICE</text><g font-family='-apple-system, sans-serif' font-size='13' fill='#1D1D1F'><text x='268' y='276'>Selling Price</text><text x='492' y='276' text-anchor='end' font-weight='700'>18,000</text><text x='268' y='298'>VAT @ 12%</text><text x='492' y='298' text-anchor='end' font-weight='700'>2,160</text></g><line x1='268' y1='306' x2='492' y2='306' stroke='#1D1D1F'/><text x='268' y='322' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#FF2D55'>Total</text><text x='492' y='322' text-anchor='end' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#FF2D55'>20,160</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Charge VAT on the marked price, then subtract the discount.",
          "why_students_fall_for_this": "The marked price is the first number seen, so it gets used first.",
          "concrete_wrong_example": "VAT = 12% of 20,000 = ₹2,400 (wrong); it should be 12% of the discounted ₹18,000 = ₹2,160.",
          "correction": "Apply the discount first to get the selling price, then charge VAT on that selling price.",
          "how_to_spot_mid_problem": "If a discount is mentioned but your VAT used the marked price, you applied them in the wrong order."
        },
        {
          "wrong_idea": "The customer's total = selling price + the rate number.",
          "why_students_fall_for_this": "Confusing the tax RATE (a percent) with the tax AMOUNT (rupees).",
          "concrete_wrong_example": "Writing total = 18,000 + 12 = ₹18,012.",
          "correction": "Add the tax AMOUNT: total = SP + (rate% of SP) = 18,000 + 2,160 = ₹20,160.",
          "how_to_spot_mid_problem": "The tax you add must be in rupees and roughly a tenth-ish of the price, never a tiny number like 12."
        },
        {
          "wrong_idea": "Compute VAT before applying the profit percentage.",
          "why_students_fall_for_this": "Students rush to the tax step before settling the selling price.",
          "concrete_wrong_example": "Taking VAT on the cost price ₹4,000 instead of on the SP ₹5,000.",
          "correction": "Fix the selling price first (apply the profit), then VAT — output tax is rate% of the SELLING price.",
          "how_to_spot_mid_problem": "If you used VAT before you ever computed SP, the order is wrong."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Total bill in one step",
          "rule": "Amount the buyer pays = SP × (1 + rate/100). No need to compute the tax separately first.",
          "example": "SP ₹18,000, VAT 12% → 18,000 × 1.12 = ₹20,160.",
          "when_to_use": "When only the final payable amount is needed."
        },
        {
          "shortcut": "Tax-to-price by division",
          "rule": "If the VAT amount T and rate r% are known, price = T ÷ (r/100) = T × 100/r.",
          "example": "VAT ₹2,160 at 12% → price = 2,160 × 100/12 = ₹18,000.",
          "when_to_use": "Bill-checking and 'find the price' reverse problems."
        },
        {
          "shortcut": "Order of operations: discount, then tax",
          "rule": "Discount → Selling Price → VAT → Total. Follow this fixed order every time.",
          "example": "20,000 −10%→ 18,000 +12%→ 20,160.",
          "when_to_use": "Any problem mixing a marked price, a discount, and VAT."
        }
      ],
      "when_to_use_this_method": {
        "use_vat_computation_when": [
          "A problem gives prices, profits or discounts and asks for the VAT or the final bill.",
          "You must reconstruct or verify an invoice with price, tax and total lines.",
          "The tax amount is given and the underlying price must be recovered.",
          "A multi-stage chain asks for the VAT remitted by a particular trader."
        ],
        "use_other_methods_instead_when": [
          "The tax described is Sales Tax, not VAT — use Sales Tax sub-topics (1.1, 1.2).",
          "No tax is involved at all — use plain profit-and-loss or discount methods.",
          "Only the conceptual 'why' of VAT is asked — see the VAT concept (sub-topic 1.3)."
        ]
      },
      "edge_cases": [
        {
          "case": "Discount and VAT happen to look like they cancel",
          "value": "A 10% discount then 12% VAT does NOT return the marked price.",
          "reasoning": "0.90 × 1.12 = 1.008, so the total is 100.8% of the marked price — slightly above it. Successive percentages never simply cancel.",
          "where_it_appears": "Trap questions asking 'is the final price equal to the marked price?'"
        },
        {
          "case": "VAT already included in a quoted price",
          "value": "If ₹P is inclusive of r% VAT, the pre-tax price = P ÷ (1 + r/100).",
          "reasoning": "An 'all-inclusive' price is SP × (1 + r/100); divide to recover SP before computing the tax component.",
          "where_it_appears": "'The price including VAT is ₹X — find the VAT' problems."
        },
        {
          "case": "Two successive discounts before VAT",
          "value": "Apply the discounts one after another, THEN VAT on the final selling price.",
          "reasoning": "Successive discounts multiply: 20,000 ×0.9 ×0.95 = 17,100; VAT is charged on 17,100, not on 20,000.",
          "where_it_appears": "Festival-offer problems with a discount plus an extra coupon."
        }
      ],
      "key_takeaway": "To compute VAT, first settle the cost and selling prices — apply any profit or discount before the tax. Then VAT remitted = rate% × (SP − CP) and output tax = rate% × SP. The buyer's bill is SP + output tax = SP × (1 + rate/100). Reverse problems recover the price by dividing the tax by the rate.",
      "video_script_hooks": {
        "video_target_length_seconds": 195,
        "opening_hook_5_sec": "Marked ₹20,000, 10% off, 12% VAT — what does the customer actually pay? Order matters.",
        "narrative_arc": "Hook (a real bill) → fix the prices first → discount before tax → VAT on the selling price → total = SP×(1+rate) → reverse: tax back to price.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "An invoice with price, VAT, total — one line blanked out as a puzzle."
          },
          {
            "timestamp_seconds": 35,
            "what_happens_on_screen": "₹20,000 marked price; a 10% discount strikes it down to ₹18,000."
          },
          {
            "timestamp_seconds": 85,
            "what_happens_on_screen": "A '+12% VAT' arrow adds ₹2,160; total ₹20,160 appears."
          },
          {
            "timestamp_seconds": 135,
            "what_happens_on_screen": "Reverse arrow: ₹2,160 ÷ 12% recovers the ₹18,000 price."
          },
          {
            "timestamp_seconds": 170,
            "what_happens_on_screen": "Closing card: 'Discount → SP → VAT → Total. Always that order.'"
          }
        ],
        "closing_takeaway_voiceover": "VAT computation is a fixed routine: settle the prices, apply the discount before the tax, charge VAT on the selling price, and add it for the total. Know the routine and every VAT bill becomes straightforward."
      }
    }
  },
  {
    "topicId": "icse_math10_ch1_gst_concepts",
    "chapterNumber": 1,
    "key_formulas": [
      {
        "formula": "Value Added Tax (VAT) is an indirect tax charged on the VALUE ADDED to goods at each stage of production and distribution.",
        "explanation": "Each trader in the chain adds some value (and some price) to the goods; VAT taxes only that added value, not the whole price again and again."
      },
      {
        "formula": "Output tax = (tax rate%) × Selling Price (SP).   Input tax = (tax rate%) × Cost Price (CP).",
        "explanation": "Output tax is the tax a trader CHARGES the buyer on a sale. Input tax is the tax the trader PAID when buying the goods."
      },
      {
        "formula": "VAT paid by a trader = Output tax − Input tax = (rate%) × SP − (rate%) × CP = (rate%) × (SP − CP).",
        "explanation": "The trader collects output tax, claims back the input tax already paid (the 'tax credit'), and remits only the difference — which equals the tax on the value he added (SP − CP)."
      },
      {
        "formula": "Total VAT received by the government across the whole chain = (rate%) × (final price paid by the consumer).",
        "explanation": "The stage-by-stage VAT amounts add up to the full tax on the consumer's price. The consumer ultimately bears the entire tax."
      }
    ],
    "name": "Value Added Tax — The Concept and Trade Chain",
    "prerequisite_knowledge": [
      "Percentage — finding a percentage of an amount (the tax rate is always a percentage).",
      "Cost price (CP), selling price (SP), and the idea of profit as SP − CP.",
      "Addition and subtraction of money amounts in rupees and paise.",
      "The everyday meaning of a 'tax' — money collected by the government on a sale.",
      "Reading a simple trade chain: manufacturer → wholesaler → retailer → consumer."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Value Added Tax is a tax collected in instalments. Instead of taxing the full price once at the end, the government collects a slice of tax from every trader in the chain — but each trader only pays tax on the value HE added. Add up all the slices and you get exactly the tax on the price the final consumer pays.",
        "hook": "A manufacturer, a wholesaler and a retailer all handle the same shirt before you buy it. Should the government tax the shirt's price three times over? No — that would be unfair double taxation. VAT solves it: each trader pays tax only on the extra value he created, so the shirt is effectively taxed exactly once.",
        "real_world_anchors": [
          "The price tag in older shops showing 'Price + VAT' as separate lines on the bill.",
          "A furniture chain: timber mill → furniture maker → showroom → you — tax collected at each handover.",
          "A trader filing a quarterly VAT return, claiming credit for tax already paid on stock.",
          "Why the same product could cost slightly different amounts in two states with different VAT rates."
        ],
        "the_pivot_idea": "A trader does NOT pay tax on his whole selling price. He pays output tax, then SUBTRACTS the input tax he already paid — the 'tax credit'. What he remits is the tax on (SP − CP), the value he added. No value is taxed twice.",
        "wrong_intuitions_to_replace": [
          "'Each trader pays tax on his full selling price.' — Wrong. He pays output tax MINUS the input tax credit; only the value added is effectively taxed.",
          "'VAT makes goods taxed several times over.' — Wrong. The credit mechanism ensures the total tax equals exactly one tax on the consumer's final price.",
          "'VAT is the trader's expense.' — Wrong. The trader only collects and forwards it; the consumer at the end of the chain actually bears the whole tax."
        ]
      },
      "derivation": {
        "starting_question": "If the same goods pass through several traders, how does the government tax them fairly — exactly once, not once per trader?",
        "part_1_the_double_tax_problem": {
          "claim": "Taxing each trader's full selling price would tax the same value many times over.",
          "reasoning": "If a manufacturer sells at ₹100, a wholesaler at ₹130, a retailer at ₹160, and each paid tax on his full price, the ₹100 of the manufacturer's value would be taxed at every stage. The consumer would bear far more tax than a single tax on ₹160."
        },
        "part_2_the_tax_credit_fix": {
          "claim": "Give every trader credit for the tax already paid on his purchase — then he only effectively pays tax on what he added.",
          "reasoning": "The wholesaler charges output tax on ₹130 but is allowed to subtract the input tax he paid on his ₹100 purchase. Net VAT = tax on 130 − tax on 100 = tax on 30, which is exactly the value he added."
        },
        "part_3_the_slices_add_up": {
          "claim": "The stage-by-stage VAT amounts sum to one full tax on the consumer's final price.",
          "reasoning": "Manufacturer pays tax on 100; wholesaler on (130−100)=30; retailer on (160−130)=30. Total = tax on 100 + 30 + 30 = tax on 160 — exactly one tax on the consumer's price. The chain collects it, the consumer bears it.",
          "named_concept": "This is the input-tax-credit (or set-off) method — each link in the chain is taxed only on the value it adds."
        }
      },
      "worked_example": [
        {
          "problem": "A shopkeeper buys an article for ₹5,000 and sells it for ₹6,000. The VAT rate is 12%. Find (a) the input tax, (b) the output tax, and (c) the VAT the shopkeeper pays to the government.",
          "thought_process_before_starting": "Input tax is on the purchase, output tax on the sale; VAT remitted is output tax minus input tax.",
          "steps": [
            {
              "step_number": 1,
              "action": "Input tax — tax on the purchase (CP).",
              "computation": "Input tax = 12% of ₹5,000 = 0.12 × 5000 = ₹600.",
              "reasoning": "Tax the shopkeeper paid when buying."
            },
            {
              "step_number": 2,
              "action": "Output tax — tax on the sale (SP).",
              "computation": "Output tax = 12% of ₹6,000 = 0.12 × 6000 = ₹720.",
              "reasoning": "Tax the shopkeeper charges the customer."
            },
            {
              "step_number": 3,
              "action": "VAT paid = output tax − input tax.",
              "computation": "VAT = ₹720 − ₹600 = ₹120.",
              "reasoning": "He keeps credit for the ₹600 already paid; remits only the difference."
            },
            {
              "step_number": 4,
              "action": "Check against value added.",
              "computation": "12% of (6000 − 5000) = 12% of 1000 = ₹120 ✓.",
              "reasoning": "VAT equals the tax on the value he added."
            }
          ],
          "answer": "Input tax ₹600, output tax ₹720, VAT paid to the government ₹120."
        },
        {
          "problem": "A manufacturer sells goods to a wholesaler for ₹10,000; the wholesaler sells them to a retailer for ₹12,000; the retailer sells them to a consumer for ₹15,000. VAT is 10% at every stage. Find the VAT paid by each, and show the total equals the tax on the consumer's price.",
          "thought_process_before_starting": "Each trader's VAT = 10% × (his SP − his CP). The manufacturer's CP is taken as 0 (he creates the goods).",
          "steps": [
            {
              "step_number": 1,
              "action": "Manufacturer's VAT.",
              "computation": "10% of (10,000 − 0) = ₹1,000.",
              "reasoning": "He added the full ₹10,000 of value."
            },
            {
              "step_number": 2,
              "action": "Wholesaler's VAT.",
              "computation": "10% of (12,000 − 10,000) = 10% of 2,000 = ₹200.",
              "reasoning": "He added ₹2,000 of value."
            },
            {
              "step_number": 3,
              "action": "Retailer's VAT.",
              "computation": "10% of (15,000 − 12,000) = 10% of 3,000 = ₹300.",
              "reasoning": "He added ₹3,000 of value."
            },
            {
              "step_number": 4,
              "action": "Add the slices and compare with tax on the consumer's price.",
              "computation": "1,000 + 200 + 300 = ₹1,500;  10% of 15,000 = ₹1,500 ✓.",
              "reasoning": "The chain's VAT sums to one full tax on the final price."
            }
          ],
          "answer": "VAT: manufacturer ₹1,000, wholesaler ₹200, retailer ₹300 — total ₹1,500, equal to 10% of the consumer's ₹15,000."
        }
      ],
      "visual_description": "The diagram shows a left-to-right trade chain — manufacturer, wholesaler, retailer, consumer — with the price rising at each handover (10,000 → 12,000 → 15,000). Above each trader sits the value he added and the VAT slice he remits (1,000 · 200 · 300). A bracket under the chain collects the three slices into one total, 1,500, labelled 'equals 10% of the consumer's ₹15,000'.",
      "svg_diagrams": [
        {
          "id": "vat_chain_value_added",
          "title": "VAT — a tax collected in slices along the chain",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>VALUE ADDED TAX — TAXED ONCE, COLLECTED IN SLICES</text><g font-family='-apple-system, sans-serif'><rect x='40' y='110' width='150' height='66' rx='10' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><rect x='230' y='110' width='150' height='66' rx='10' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><rect x='420' y='110' width='150' height='66' rx='10' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><rect x='610' y='110' width='120' height='66' rx='10' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='115' y='138' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>Manufacturer</text><text x='115' y='160' text-anchor='middle' font-size='13' font-weight='700' fill='#FF2D55'>SP 10,000</text><text x='305' y='138' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>Wholesaler</text><text x='305' y='160' text-anchor='middle' font-size='13' font-weight='700' fill='#FF2D55'>SP 12,000</text><text x='495' y='138' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>Retailer</text><text x='495' y='160' text-anchor='middle' font-size='13' font-weight='700' fill='#FF2D55'>SP 15,000</text><text x='670' y='138' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>Consumer</text><text x='670' y='160' text-anchor='middle' font-size='12' fill='#86868B'>pays 15,000</text></g><g stroke='#1D1D1F' stroke-width='2' marker-end='url(#va)'><line x1='190' y1='143' x2='228' y2='143'/><line x1='380' y1='143' x2='418' y2='143'/><line x1='570' y1='143' x2='608' y2='143'/></g><defs><marker id='va' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto'><path d='M0,0 L8,3 L0,6 Z' fill='#1D1D1F'/></marker></defs><g font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#34C759' text-anchor='middle'><text x='115' y='205'>VAT 1,000</text><text x='305' y='205'>VAT 200</text><text x='495' y='205'>VAT 300</text></g><g font-family='-apple-system, sans-serif' font-size='11' fill='#86868B' text-anchor='middle'><text x='115' y='223'>added 10,000</text><text x='305' y='223'>added 2,000</text><text x='495' y='223'>added 3,000</text></g><path d='M70 245 L70 270 L540 270 L540 245' fill='none' stroke='#FF9500' stroke-width='2'/><rect x='250' y='282' width='260' height='40' rx='10' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='307' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1D1D1F'>1,000 + 200 + 300 = 1,500</text><text x='380' y='342' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='600' fill='#86868B'>= 10% of the consumer's ₹15,000 — the goods are taxed exactly once.</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Each trader pays VAT on his full selling price.",
          "why_students_fall_for_this": "They forget the input-tax credit and just compute 'rate × SP' for everyone.",
          "concrete_wrong_example": "For the wholesaler with SP ₹12,000 a student writes VAT = 10% of 12,000 = ₹1,200 instead of ₹200.",
          "correction": "A trader pays output tax MINUS input tax. Wholesaler: 10% of 12,000 − 10% of 10,000 = 1,200 − 1,000 = ₹200, i.e. 10% of the value added.",
          "how_to_spot_mid_problem": "If your stage-by-stage VAT amounts do not add up to the tax on the consumer's price, you forgot to subtract input tax somewhere."
        },
        {
          "wrong_idea": "VAT is an extra cost borne by the traders.",
          "why_students_fall_for_this": "Traders do hand money to the government, so it looks like their expense.",
          "concrete_wrong_example": "A student concludes the retailer 'loses' ₹300 to VAT.",
          "correction": "A trader only collects VAT from his buyer and forwards the net amount. The tax is fully passed down the chain; the final consumer bears all of it.",
          "how_to_spot_mid_problem": "Ask: who has no one to pass the tax on to? That person — the consumer — is the one who truly pays."
        },
        {
          "wrong_idea": "VAT and the profit are the same thing because both involve SP − CP.",
          "why_students_fall_for_this": "Both 'value added' (for VAT) and profit use the gap between selling and cost price.",
          "concrete_wrong_example": "A student reports the trader's VAT as his profit, or adds VAT into the profit.",
          "correction": "Profit = SP − CP (money the trader keeps). VAT = rate% × (SP − CP) (tax on that gap, forwarded to the government). They are different quantities.",
          "how_to_spot_mid_problem": "VAT always has the rate% multiplied in; profit never does."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "VAT = rate × value added",
          "rule": "Skip computing input and output tax separately — a trader's VAT is simply rate% × (SP − CP).",
          "example": "CP ₹5,000, SP ₹6,000, rate 12% → VAT = 12% of 1,000 = ₹120, in one step.",
          "when_to_use": "Whenever you need only the VAT a single trader remits."
        },
        {
          "shortcut": "Chain check — slices sum to the end tax",
          "rule": "All the stage VAT amounts together must equal rate% × (consumer's final price). Use it to verify.",
          "example": "1,000 + 200 + 300 = 1,500 = 10% of 15,000 ✓.",
          "when_to_use": "As a self-check at the end of any multi-stage VAT problem."
        },
        {
          "shortcut": "Manufacturer's CP is 0",
          "rule": "The first producer creates the goods, so treat his cost price as 0 — his VAT is rate% × his selling price.",
          "example": "Manufacturer sells at ₹10,000, rate 10% → VAT = ₹1,000.",
          "when_to_use": "At the start of any production-and-distribution chain."
        }
      ],
      "when_to_use_this_method": {
        "use_vat_thinking_when": [
          "A problem describes goods passing through a chain of traders, each adding value.",
          "You must find the tax a particular trader remits to the government.",
          "You need to show that goods are taxed once overall despite many sales.",
          "A bill separates 'price' and 'VAT' and asks how the tax was arrived at."
        ],
        "use_other_methods_instead_when": [
          "The problem is about Sales Tax (a single-stage tax) — use Sales Tax sub-topics (1.1, 1.2).",
          "Only profit or loss is asked, with no tax — use plain profit-and-loss (SP − CP).",
          "A single direct tax on one price is given with no chain — just compute rate% of that price."
        ]
      },
      "edge_cases": [
        {
          "case": "A trader sells at a loss (SP < CP)",
          "value": "VAT = rate% × (SP − CP) is negative — the trader's input tax exceeds his output tax.",
          "reasoning": "He paid more tax on his purchase than he collected on his sale, so he is entitled to a refund (or carries the credit forward).",
          "where_it_appears": "Clearance-sale problems where goods are sold below cost."
        },
        {
          "case": "No value added (SP = CP)",
          "value": "VAT = rate% × 0 = ₹0.",
          "reasoning": "If a trader sells at exactly his cost price, he added no value, so he remits nothing — his output tax equals his input tax credit.",
          "where_it_appears": "A pass-through dealer who only stores and forwards goods."
        },
        {
          "case": "Different VAT rates at different stages",
          "value": "Each stage uses its own rate; the simple 'slices sum to end tax' check no longer holds.",
          "reasoning": "The clean total only works when one rate applies throughout. With mixed rates, compute each stage separately.",
          "where_it_appears": "Older multi-state problems before rates were unified."
        }
      ],
      "key_takeaway": "VAT is an indirect tax on the value added at each stage of trade. A trader remits output tax minus input tax — that is rate% × (SP − CP), the tax on the value he added. The stage-by-stage amounts add up to one full tax on the consumer's final price, which the consumer ultimately bears.",
      "video_script_hooks": {
        "video_target_length_seconds": 195,
        "opening_hook_5_sec": "One shirt, three traders. Should the government tax its price three times? VAT says no — and here's the clever fix.",
        "narrative_arc": "Hook (the double-tax problem) → why taxing every full price is unfair → the input-tax-credit fix → VAT = rate × value added → the slices add up to one end tax → close with who really pays.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "A shirt passes through three traders; '×3 tax?' flashes with a red cross."
          },
          {
            "timestamp_seconds": 35,
            "what_happens_on_screen": "Each trader's full price lights up — the over-taxed value highlighted in red."
          },
          {
            "timestamp_seconds": 80,
            "what_happens_on_screen": "Input-tax credit subtracts the prior tax; VAT shrinks to 'rate × value added'."
          },
          {
            "timestamp_seconds": 130,
            "what_happens_on_screen": "Three green slices (1,000 · 200 · 300) drop into one bucket: 1,500."
          },
          {
            "timestamp_seconds": 170,
            "what_happens_on_screen": "Closing card: 'Taxed once. Collected in slices. Paid by the consumer.'"
          }
        ],
        "closing_takeaway_voiceover": "Value Added Tax is fairness by design: each trader is taxed only on the value he adds, the credit mechanism prevents double taxation, and the slices add up to a single tax on the price you finally pay."
      }
    }
  },
  {
    "topicId": "icse_math10_ch1_vat_computation",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "name": "Sales Tax — Discount, Profit and Multi-step Problems",
    "prerequisite_knowledge": [
      "Sales tax concept — ST = rate% × SP; Total = SP × (1 + rate/100) (sub-topic 1.1).",
      "Discount on marked price — SP = MP × (1 − discount%/100).",
      "Profit and loss — SP = CP × (1 + profit%/100).",
      "Finding SP from total when tax is included — SP = Total × 100/(100 + rate).",
      "Setting up arithmetic from word problem conditions to find unknown prices."
    ],
    "key_formulas": [
      {
        "formula": "Step order: MP −(discount%)→ SP →(+sales tax%)→ Total",
        "explanation": "Apply discount first to find the actual selling price, then compute sales tax on that selling price."
      },
      {
        "formula": "SP = MP × (1 − discount/100);  ST = rate% × SP;  Total = SP × (1 + rate/100).",
        "explanation": "Three-step chain for any problem with a marked price, a discount, and sales tax."
      },
      {
        "formula": "Profit problem: SP = CP × (1 + profit/100),  then  Total = SP × (1 + tax/100).",
        "explanation": "Find SP from profit percentage first, then apply tax on top."
      },
      {
        "formula": "Chain multiplier: Total = MP × (1 − d/100) × (1 + t/100).",
        "explanation": "When both discount and tax are present, combine into one multiplication."
      }
    ],
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Sales tax word problems are multi-step: first settle the selling price (discount or profit%), then add tax. The sequence is fixed — discount and profit come before tax.",
        "hook": "₹2,000 marked, 10% off, 5% tax — three numbers, one bill. MP → discount → SP → tax → total. Reverse the order and every number after is wrong.",
        "real_world_anchors": [
          "Sale tag: 'Marked ₹1,500 | 15% off | + 6% tax'.",
          "Shopkeeper bought mixer for ₹800, 25% profit, 5% tax.",
          "Paid ₹1,323 inclusive of tax — what was the pre-tax price?",
          "Two items with different tax rates on one bill."
        ],
        "the_pivot_idea": "Discount reduces MP to SP. Tax adds to SP. Different bases. Tax on MP (before discount) is the most common Ch1 error.",
        "wrong_intuitions_to_replace": [
          "'Tax on MP, then discount.' — Wrong. Discount to SP first, then tax on SP.",
          "'Equal discount and tax percentages cancel each other.' — Wrong. 0.9 × 1.1 = 0.99 ≠ 1.",
          "'Tax and discount can be applied in any order.' — Wrong. Discount before tax, always."
        ]
      },
      "derivation": {
        "starting_question": "Given MP, discount%, and tax rate, find what the buyer pays.",
        "part_1_from_marked_to_sp": {
          "claim": "Subtract discount from MP to get SP.",
          "reasoning": "SP = MP × (1 − d/100). For MP ₹2,000 and 10% off: SP = ₹1,800. Tax on ₹1,800, not ₹2,000."
        },
        "part_2_from_sp_to_total": {
          "claim": "Apply sales tax to SP to get total.",
          "reasoning": "ST = 5% of 1,800 = ₹90. Total = ₹1,890. Or: 1,800 × 1.05 = ₹1,890."
        },
        "part_3_reverse": {
          "claim": "When the total is given, work backwards through the same chain.",
          "reasoning": "Total ÷ (1 + t/100) = SP. SP ÷ (1 − d/100) = MP.",
          "named_concept": "Forward: MP → SP → Total. Reverse: Total → SP → MP."
        }
      },
      "worked_example": [
        {
          "problem": "MP of an article is ₹2,000. Discount 10%, then 5% sales tax. Find SP, ST, and total.",
          "thought_process_before_starting": "Discount first on MP to get SP. Then tax on SP.",
          "steps": [
            {
              "step_number": 1,
              "action": "SP after discount.",
              "computation": "SP = 2,000 − 200 = ₹1,800.",
              "reasoning": "Discount reduces MP."
            },
            {
              "step_number": 2,
              "action": "Sales tax on SP.",
              "computation": "ST = 5% of 1,800 = ₹90.",
              "reasoning": "Tax on SP, not MP."
            },
            {
              "step_number": 3,
              "action": "Total.",
              "computation": "Total = 1,800 + 90 = ₹1,890.",
              "reasoning": "SP + tax."
            }
          ],
          "answer": "SP ₹1,800; ST ₹90; Total ₹1,890."
        },
        {
          "problem": "Shopkeeper buys radio for ₹1,200, sells at 20% profit, charges 8% tax. Find total.",
          "thought_process_before_starting": "SP from profit first, then tax on SP.",
          "steps": [
            {
              "step_number": 1,
              "action": "SP from profit.",
              "computation": "SP = 1,200 × 1.20 = ₹1,440.",
              "reasoning": "20% profit on CP."
            },
            {
              "step_number": 2,
              "action": "Tax on SP.",
              "computation": "ST = 8% of 1,440 = ₹115.20.",
              "reasoning": "Tax on selling price."
            },
            {
              "step_number": 3,
              "action": "Total.",
              "computation": "Total = 1,440 + 115.20 = ₹1,555.20.",
              "reasoning": "SP + tax."
            }
          ],
          "answer": "Total = ₹1,555.20."
        }
      ],
      "visual_description": "Pipeline: MP → (−discount%) → SP → (+tax%) → Total. Warning: Discount on MP. Tax on SP.",
      "svg_diagrams": [
        {
          "id": "st_word_problem_pipeline",
          "title": "Sales Tax Word Problem Pipeline",
          "svg": "<svg viewBox='0 0 760 260' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='260' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SALES TAX — WORD PROBLEM PIPELINE</text><rect x='30' y='80' width='150' height='60' rx='9' fill='#F5F5F7' stroke='#86868B' stroke-width='2'/><text x='105' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#86868B'>Marked Price</text><text x='105' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(or CP + profit)</text><rect x='305' y='80' width='150' height='60' rx='9' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='380' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Selling Price</text><text x='380' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(after discount)</text><rect x='580' y='80' width='150' height='60' rx='9' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='655' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Total</text><text x='655' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(SP + Sales Tax)</text><line x1='180' y1='110' x2='303' y2='110' stroke='#1D1D1F' stroke-width='2' marker-end='url(#sp2)'/><line x1='455' y1='110' x2='578' y2='110' stroke='#1D1D1F' stroke-width='2' marker-end='url(#sp2)'/><defs><marker id='sp2' markerWidth='9' markerHeight='9' refX='7' refY='3' orient='auto'><path d='M0,0 L7,3 L0,6 Z' fill='#1D1D1F'/></marker></defs><text x='240' y='100' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#FF9500'>− discount%</text><text x='516' y='100' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#34C759'>+ tax% of SP</text><rect x='200' y='180' width='360' height='50' rx='8' fill='#FFE6B3' stroke='#FF9500' stroke-width='2'/><text x='380' y='200' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#FF2D55'>Discount on MP. Tax on SP. Never swap.</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Apply tax to the marked price before the discount.",
          "why_students_fall_for_this": "MP is the first number; students rush to use it.",
          "concrete_wrong_example": "MP ₹2,000, 10% off, 5% tax → wrong ST = ₹100. Correct: ST = 5% of ₹1,800 = ₹90.",
          "correction": "Discount first: SP = ₹1,800. Then ST = 5% of ₹1,800.",
          "how_to_spot_mid_problem": "Tax base must be smaller than MP (discount already applied)."
        },
        {
          "wrong_idea": "Equal discount and tax cancel out.",
          "why_students_fall_for_this": "Same percentage → students assume offset.",
          "concrete_wrong_example": "10% off then 10% tax: 0.9 × 1.1 = 0.99 — 1% net cost remains.",
          "correction": "They apply to different bases; 0.9 × 1.1 = 0.99 ≠ 1.",
          "how_to_spot_mid_problem": "Always compute: (1−d/100) × (1+t/100) explicitly."
        },
        {
          "wrong_idea": "Total = MP + tax on MP, ignoring discount.",
          "why_students_fall_for_this": "Forgot to apply discount before tax.",
          "concrete_wrong_example": "MP 2,000, 10% off, 5% tax → wrong ₹2,100. Correct ₹1,890.",
          "correction": "Subtract discount first, then add tax on reduced SP.",
          "how_to_spot_mid_problem": "Final total with discount should be less than MP + tax on MP."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Chain multiplier",
          "rule": "Total = MP × (1−d/100) × (1+t/100).",
          "example": "2,000 × 0.90 × 1.05 = ₹1,890.",
          "when_to_use": "Discount + tax in one step."
        },
        {
          "shortcut": "Reverse from total",
          "rule": "SP = Total ÷ (1+t/100); MP = SP ÷ (1−d/100).",
          "example": "₹1,890 → SP=1,800 → MP=₹2,000.",
          "when_to_use": "Total given, find MP or SP."
        }
      ],
      "when_to_use_this_method": {
        "use_sales_tax_word_problems_when": [
          "MP with discount AND tax rate — find total.",
          "CP with profit% and tax rate — find total.",
          "Total inclusive of tax given — find SP, MP, or tax.",
          "Two items with different rates on one bill."
        ],
        "use_other_methods_instead_when": [
          "The problem is about VAT in a trade chain — use VAT sub-topics (1.3, 1.4).",
          "No tax involved — use plain profit, loss and discount methods."
        ]
      },
      "edge_cases": [
        {
          "case": "Two items with different tax rates on one bill",
          "value": "Compute tax on each item separately; total the taxes.",
          "reasoning": "Averaging rates over the combined price is incorrect.",
          "where_it_appears": "Mixed bills with food (lower rate) and non-food (higher rate)."
        },
        {
          "case": "Does sales tax affect the shopkeeper's profit?",
          "value": "No. Profit = SP − CP, independent of tax charged to the customer.",
          "reasoning": "Tax is a pass-through — collected from buyer, forwarded to government.",
          "where_it_appears": "Problems asking 'profit' when a tax rate is also given."
        }
      ],
      "key_takeaway": "Fixed pipeline: Discount on MP → SP → Sales Tax on SP → Total. Profit sets SP first (SP = CP × (1+p/100)), then tax. Chain multiplier: Total = MP × (1−d/100) × (1+t/100).",
      "video_script_hooks": {
        "video_target_length_seconds": 195,
        "opening_hook_5_sec": "Marked ₹2,000. 10% off. 5% tax. What does the customer pay?",
        "narrative_arc": "Discount → SP → tax → total → chain multiplier → profit problems → reverse.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Sale tag: MP, discount, tax — total unknown."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "Discount drops ₹2,000 to ₹1,800."
          },
          {
            "timestamp_seconds": 80,
            "what_happens_on_screen": "+5% tax adds ₹90; total ₹1,890."
          },
          {
            "timestamp_seconds": 130,
            "what_happens_on_screen": "Chain: 2,000 × 0.90 × 1.05 = 1,890."
          },
          {
            "timestamp_seconds": 170,
            "what_happens_on_screen": "Card: 'Discount → SP → Tax → Total.'"
          }
        ],
        "closing_takeaway_voiceover": "Discount first to find SP, then tax on SP. That order is fixed."
      }
    }
  },
  {
    "topicId": "icse_math10_ch1_vat_concepts",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "name": "Sales Tax — The Concept and Basic Calculations",
    "prerequisite_knowledge": [
      "Percentage of an amount — sales tax is always a percentage of the selling price.",
      "Selling price (SP) and marked price (MP) — the difference between the two.",
      "Addition of money amounts in rupees and paise.",
      "The concept of a government tax on the sale of goods.",
      "Unitary method — if the total (SP + tax) is known, finding SP from it."
    ],
    "key_formulas": [
      {
        "formula": "Sales Tax (ST) = (rate / 100) × SP",
        "explanation": "Sales tax is a fixed percentage of the selling price, collected by the seller from the buyer and deposited with the government."
      },
      {
        "formula": "Total amount paid by the buyer = SP + ST = SP × (1 + rate/100)",
        "explanation": "The buyer pays the selling price plus the sales tax on top of it."
      },
      {
        "formula": "Given total (inclusive of tax) and rate: SP = Total × 100 / (100 + rate)",
        "explanation": "When the total including tax is known, divide by (1 + rate/100) to recover the selling price."
      },
      {
        "formula": "Sales Tax from total = Total × rate / (100 + rate)",
        "explanation": "Once SP is found, ST = Total − SP. This formula gives it directly from the total."
      }
    ],
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Sales Tax is the simplest tax: the government charges a percentage of the selling price. The buyer pays SP + tax. To go backwards when the total is given, divide by (1 + rate/100).",
        "hook": "Every time a shopkeeper hands you a bill showing \"Price ₹500 + Tax ₹25 = Total ₹525\", that ₹25 is Sales Tax at 5%. The whole Chapter 1 exercise set is built on reconstructing or reverse-engineering bills exactly like this.",
        "real_world_anchors": [
          "A shop bill separating 'Price', 'Sales Tax', and 'Total' as three lines.",
          "Buying electronics — the sticker price may or may not include sales tax.",
          "A salesperson saying 'The price is ₹2,000 plus 8% tax'.",
          "A government receipt showing the tax component of a purchase."
        ],
        "the_pivot_idea": "Sales Tax sits ON TOP of the selling price — it is not included unless stated. Total = SP × (1 + rate/100). Reverse this by dividing when the total is given.",
        "wrong_intuitions_to_replace": [
          "'Apply the rate to the total amount paid.' — Wrong. Rate is applied to SP (before tax).",
          "'If tax is 5%, the buyer pays 5% extra on the total.' — Wrong. 5% of SP is added to SP.",
          "'The selling price and the total are the same.' — Wrong. Total = SP + Sales Tax."
        ]
      },
      "derivation": {
        "starting_question": "A shopkeeper sells at price ₹P and the government levies sales tax at r%. What does the buyer pay?",
        "part_1_forward": {
          "claim": "Sales Tax = r% of SP. Buyer pays SP + ST.",
          "reasoning": "ST = (r/100) × P. Total = P + (r/100)P = P(1 + r/100)."
        },
        "part_2_reverse": {
          "claim": "Given total T and rate r%, recover SP by dividing.",
          "reasoning": "T = P(1 + r/100) ⟹ P = T × 100/(100 + r). ST = T − P."
        },
        "part_3_discount_first": {
          "claim": "When a discount is also given, apply it to the marked price first, THEN apply sales tax.",
          "reasoning": "Sales tax is charged on what the buyer pays for the goods after the discount.",
          "named_concept": "Fixed sequence: Marked Price → (−discount) → Selling Price → (+sales tax) → Total."
        }
      },
      "worked_example": [
        {
          "problem": "A person buys a shirt for ₹840 and pays sales tax at 5%. Find the sales tax and the total amount paid.",
          "thought_process_before_starting": "Forward: ST = 5% of SP. Total = SP + ST.",
          "steps": [
            {
              "step_number": 1,
              "action": "Calculate the sales tax.",
              "computation": "ST = 5% of 840 = ₹42.",
              "reasoning": "Tax is a percentage of the selling price."
            },
            {
              "step_number": 2,
              "action": "Calculate the total.",
              "computation": "Total = 840 + 42 = ₹882.",
              "reasoning": "Buyer pays price plus tax."
            }
          ],
          "answer": "Sales Tax = ₹42; Total = ₹882."
        },
        {
          "problem": "The total price of a watch including 8% sales tax is ₹1,296. Find the price before tax and the sales tax.",
          "thought_process_before_starting": "Reverse: total is given. Use SP = Total × 100/(100 + rate).",
          "steps": [
            {
              "step_number": 1,
              "action": "Find SP from total.",
              "computation": "SP = 1,296 × 100/108 = ₹1,200.",
              "reasoning": "Total = SP × 1.08 ⇒ SP = 1,296 ÷ 1.08."
            },
            {
              "step_number": 2,
              "action": "Find the sales tax.",
              "computation": "ST = 1,296 − 1,200 = ₹96.",
              "reasoning": "Tax = Total − SP."
            },
            {
              "step_number": 3,
              "action": "Verify.",
              "computation": "8% of 1,200 = ₹96 ✓.",
              "reasoning": "Rate × SP = tax found."
            }
          ],
          "answer": "Price before tax = ₹1,200; Sales Tax = ₹96."
        }
      ],
      "visual_description": "A two-segment bar: left = Selling Price (SP), right = Sales Tax (= rate% of SP). Together = Total. Forward: Total = SP × (1+r/100). Reverse: SP = Total × 100/(100+r).",
      "svg_diagrams": [
        {
          "id": "sales_tax_forward_reverse",
          "title": "Sales Tax — forward and reverse",
          "svg": "<svg viewBox='0 0 760 300' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='300' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SALES TAX — FORWARD AND REVERSE</text><rect x='60' y='80' width='480' height='60' rx='8' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><rect x='540' y='80' width='160' height='60' rx='8' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='300' y='115' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='14' font-weight='700' fill='#1D1D1F'>Selling Price (SP)</text><text x='620' y='108' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Sales Tax</text><text x='620' y='126' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>= r% × SP</text><text x='380' y='175' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#FF2D55'>Forward: Total = SP × (1 + r/100)</text><text x='380' y='210' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#34C759'>Reverse: SP = Total × 100 / (100 + r)</text><rect x='200' y='232' width='360' height='44' rx='8' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='258' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>ST = Total − SP = Total × r / (100 + r)</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Apply the tax rate to the total inclusive price.",
          "why_students_fall_for_this": "When the total is given, they compute rate% of total instead of first recovering SP.",
          "concrete_wrong_example": "Total ₹882 at 5% → wrong: ST = 5% of 882 = ₹44.10. Correct: ST = 882 × 5/105 = ₹42.",
          "correction": "Tax rate applies to SP, not the total. Use SP = Total × 100/(100+r) first.",
          "how_to_spot_mid_problem": "Your ST should equal rate% of SP, not rate% of the total."
        },
        {
          "wrong_idea": "Apply tax to the marked price even when a discount is given.",
          "why_students_fall_for_this": "The marked price is the first number given.",
          "concrete_wrong_example": "MP ₹500, 10% off, 5% ST → wrong: ST = 5% of ₹500 = ₹25. Correct: ST = 5% of ₹450 = ₹22.50.",
          "correction": "Discount first to get SP. Then tax on SP.",
          "how_to_spot_mid_problem": "If a discount is given but tax used the marked price, order is wrong."
        },
        {
          "wrong_idea": "The total and the SP are the same number.",
          "why_students_fall_for_this": "Students read 'price ₹X' and treat it as what the buyer pays.",
          "concrete_wrong_example": "SP = ₹840, tax = 5% → total = ₹882, not ₹840.",
          "correction": "Total = SP + ST whenever tax rate > 0.",
          "how_to_spot_mid_problem": "If 'total' and 'SP' are both stated, they must differ by the tax."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "One-step total",
          "rule": "Total = SP × (1 + rate/100).",
          "example": "SP ₹840, 5% → 840 × 1.05 = ₹882.",
          "when_to_use": "Final bill only needed."
        },
        {
          "shortcut": "Reverse one step",
          "rule": "SP = Total × 100/(100 + rate).",
          "example": "Total ₹882, 5% → 882 × 100/105 = ₹840.",
          "when_to_use": "Total given, need pre-tax price."
        },
        {
          "shortcut": "Tax from total",
          "rule": "ST = Total × rate/(100 + rate).",
          "example": "Total ₹882, 5% → 882 × 5/105 = ₹42.",
          "when_to_use": "Only tax component needed from a total."
        }
      ],
      "when_to_use_this_method": {
        "use_sales_tax_thinking_when": [
          "SP (or MP with discount) and a tax rate given — find tax and/or total.",
          "Total inclusive of tax given — find pre-tax price or tax amount.",
          "Discount and tax both appear — discount to SP first, then tax on SP."
        ],
        "use_other_methods_instead_when": [
          "The problem is about Value Added Tax across a trade chain — use VAT sub-topics (1.3, 1.4).",
          "No tax involved — use plain percentage or profit-and-loss methods."
        ]
      },
      "edge_cases": [
        {
          "case": "Two items at different tax rates on one bill",
          "value": "Compute tax on each item separately; total the taxes.",
          "reasoning": "Different goods attract different rates; averaging is incorrect.",
          "where_it_appears": "Bills mixing a food item (lower rate) with a non-food item (higher rate)."
        },
        {
          "case": "Tax quoted as already included in the marked price",
          "value": "SP = Marked Price × 100/(100 + rate).",
          "reasoning": "The marked price already contains the tax; this formula extracts the pre-tax component.",
          "where_it_appears": "'The marked price includes 5% sales tax — find the original price' problems."
        }
      ],
      "key_takeaway": "Sales Tax = rate% × SP. The buyer pays Total = SP × (1 + rate/100). Reverse: SP = Total × 100/(100+r). Always discount before tax.",
      "video_script_hooks": {
        "video_target_length_seconds": 180,
        "opening_hook_5_sec": "₹882 on the bill. ₹840 was the price. Where did ₹42 go? That is sales tax.",
        "narrative_arc": "Hook → ST = rate% of SP → total = SP×(1+r/100) → reverse → discount first.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Bill: ₹840 + ₹42 = ₹882."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "5% of ₹840 = ₹42 arrow."
          },
          {
            "timestamp_seconds": 80,
            "what_happens_on_screen": "SP × 1.05 formula animates."
          },
          {
            "timestamp_seconds": 130,
            "what_happens_on_screen": "₹882 ÷ 1.05 = ₹840 reverse."
          },
          {
            "timestamp_seconds": 165,
            "what_happens_on_screen": "Card: 'Discount first, then tax.'"
          }
        ],
        "closing_takeaway_voiceover": "Sales Tax: rate% of SP, added to the bill. To find price from total, divide by (1+rate/100). Discount before tax — always."
      }
    }
  },
  {
    "topicId": "icse_math10_ch2_rd_concept",
    "chapterNumber": 2,
    "key_formulas": [
      {
        "formula": "A Recurring Deposit (RD) account is one in which a fixed sum of money P is deposited every month for a fixed number of months n; the bank pays interest on these deposits.",
        "explanation": "RD turns regular saving into a single account. The monthly deposit P and the number of months n stay the same throughout; only the interest needs careful handling."
      },
      {
        "formula": "Each monthly instalment earns interest for a DIFFERENT length of time: the 1st instalment for n months, the 2nd for (n − 1) months, … , the last (nth) instalment for just 1 month.",
        "explanation": "Money deposited earliest stays in the bank longest and earns the most; the final deposit has barely any time to earn."
      },
      {
        "formula": "Total interest-earning time of all the instalments together = n + (n − 1) + … + 2 + 1 = n(n + 1)/2 months.",
        "explanation": "Adding the separate earning times of all n instalments gives the famous sum 1 + 2 + … + n = n(n + 1)/2 — the heart of every RD calculation."
      },
      {
        "formula": "Maturity Value (the amount received at the end) = total money deposited + total interest = P × n + Interest.",
        "explanation": "At maturity the bank returns every rupee deposited (P paid n times) plus the interest those rupees earned."
      }
    ],
    "name": "Recurring Deposit Account — The Concept",
    "prerequisite_knowledge": [
      "Simple interest — interest = (principal × rate × time) ÷ 100, and the idea that interest grows with the time money stays invested.",
      "Percentage of an amount — the rate of interest is a percentage charged per year.",
      "Converting between months and years — one month is 1/12 of a year.",
      "The everyday idea of a bank account, a monthly deposit, and interest a bank pays on savings.",
      "Adding a list of whole numbers, especially the sum 1 + 2 + 3 + … + n."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A Recurring Deposit account is a saving habit turned into a maths problem: you pay in the same amount every month and the bank pays simple interest. The one twist that makes RD its own topic — your first deposit sits in the bank far longer than your last, so the instalments do not all earn interest for the same length of time.",
        "hook": "Pay ₹1,000 into an account on the 1st of every month for a year. By December your January rupees have been working for 12 months — but your December rupees have only just arrived. The bank cannot treat all twelve deposits alike. RD maths is simply the bookkeeping of 'which rupees earned interest, and for how long'.",
        "real_world_anchors": [
          "A student saving a fixed sum of pocket money into a bank RD every month towards a new laptop.",
          "A salaried parent paying a fixed amount into an RD each month for a child's school fees.",
          "An RD passbook showing identical monthly deposit entries and one larger maturity amount at the end.",
          "A bank advertisement: 'Deposit ₹2,000 a month for two years, receive ₹52,000 at maturity'."
        ],
        "the_pivot_idea": "An RD is NOT one lump sum earning interest for the whole period. It is n separate deposits, each earning simple interest only for the number of months IT actually stayed in the bank. The earliest instalment works the longest; the last instalment works for just one month.",
        "wrong_intuitions_to_replace": [
          "'All the deposits earn interest for the full n months.' — Wrong. Only the first instalment does; the second earns for (n − 1) months, and so on down to 1 month for the last.",
          "'RD interest is compound interest.' — Wrong. The ICSE RD formula applies simple interest to each instalment; nothing is compounded.",
          "'The maturity value is just the interest the bank pays.' — Wrong. Maturity value is all the money deposited (P × n) PLUS the interest earned on top of it."
        ]
      },
      "derivation": {
        "starting_question": "If you deposit the same sum every month, how long does each deposit actually earn interest — and how do we add all those different times together?",
        "part_1_the_instalments_are_not_equal": {
          "claim": "Two instalments of the same size can earn very different amounts of interest.",
          "reasoning": "Interest depends on time. The instalment paid in the first month stays until maturity and earns interest the whole way; the instalment paid in the last month is returned almost at once. Same rupees, different time — different interest."
        },
        "part_2_the_earning_times_form_a_ladder": {
          "claim": "The earning times of the n instalments are n, n − 1, n − 2, … , 2, 1 months.",
          "reasoning": "Count from each deposit to maturity. The 1st instalment has all n months ahead of it. The 2nd was paid a month later, so it earns for n − 1 months. Continuing this way, the last instalment earns for only 1 month. The times form a neat descending ladder."
        },
        "part_3_the_ladder_adds_to_a_known_sum": {
          "claim": "All the earning times together come to n(n + 1)/2 months.",
          "reasoning": "Adding the ladder n + (n − 1) + … + 2 + 1 is the classic sum of the first n natural numbers, which equals n(n + 1)/2. This single number — the total month-count — is exactly what the interest formula in the next sub-topic is built on.",
          "named_concept": "The 'equivalent months' of an RD — the total time, n(n + 1)/2 months, for which one rupee of monthly deposit effectively earns interest."
        }
      },
      "worked_example": [
        {
          "problem": "Rohan opens a Recurring Deposit account and pays ₹600 every month for 6 months. List how many months each instalment earns interest, and find the total interest-earning time.",
          "thought_process_before_starting": "Each instalment earns interest from the month it is paid until maturity. The first earns the most months, the last the fewest; then add the months up.",
          "steps": [
            {
              "step_number": 1,
              "action": "The 1st instalment is paid at the start and stays until maturity.",
              "computation": "It earns interest for all 6 months.",
              "reasoning": "Paid earliest, returned only at maturity."
            },
            {
              "step_number": 2,
              "action": "Each later instalment is paid one month after the one before.",
              "computation": "2nd → 5 months, 3rd → 4 months, 4th → 3 months, 5th → 2 months, 6th → 1 month.",
              "reasoning": "Every month of delay removes one month of earning time."
            },
            {
              "step_number": 3,
              "action": "Add all the earning times.",
              "computation": "6 + 5 + 4 + 3 + 2 + 1 = 21 months.",
              "reasoning": "This is the sum n(n + 1)/2 = 6 × 7 ÷ 2 = 21."
            },
            {
              "step_number": 4,
              "action": "Interpret the total.",
              "computation": "All six ₹600 instalments earn interest as though ₹600 sat in the bank for 21 months.",
              "reasoning": "These 21 'equivalent months' drive the interest formula."
            }
          ],
          "answer": "Earning times 6, 5, 4, 3, 2, 1 months; total interest-earning time = 21 months (= 6 × 7 ÷ 2)."
        },
        {
          "problem": "Identify the quantities in this statement: 'A man deposits ₹1,500 per month in a Recurring Deposit account for 2 years.' State the monthly deposit P, the number of months n, and the total sum he will have deposited.",
          "thought_process_before_starting": "P is the fixed monthly amount; n must be in months, so convert the years; the total deposited is simply P × n.",
          "steps": [
            {
              "step_number": 1,
              "action": "Read off the monthly deposit.",
              "computation": "P = ₹1,500.",
              "reasoning": "It is the fixed amount paid each month."
            },
            {
              "step_number": 2,
              "action": "Convert the period into months.",
              "computation": "2 years = 2 × 12 = 24 months, so n = 24.",
              "reasoning": "RD formulas always count n in MONTHS, never in years."
            },
            {
              "step_number": 3,
              "action": "Total sum deposited = P × n.",
              "computation": "1,500 × 24 = ₹36,000.",
              "reasoning": "Every instalment is equal, so multiply the monthly deposit by the number of months."
            }
          ],
          "answer": "P = ₹1,500;  n = 24 months;  total sum deposited = ₹36,000."
        }
      ],
      "visual_description": "The diagram is a staircase of six horizontal bars, one per instalment. The top bar (1st instalment) is the longest, spanning 6 months; each bar below is one month shorter, down to the bottom bar (6th instalment) spanning just 1 month. A 'first … last' scale runs underneath, and a green box at the bottom gathers the bar lengths into the total '6 + 5 + 4 + 3 + 2 + 1 = 21 months'.",
      "svg_diagrams": [
        {
          "id": "rd_instalment_staircase",
          "title": "Recurring Deposit — each instalment earns interest for a different time",
          "svg": "<svg viewBox='0 0 760 380' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='380' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>RECURRING DEPOSIT — A STAIRCASE OF EARNING TIMES</text><g font-family='-apple-system, sans-serif'><rect x='60' y='58' width='480' height='28' rx='6' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='550' y='77' font-size='12' font-weight='700' fill='#1D1D1F'>Instalment 1 — 6 months</text><rect x='60' y='92' width='400' height='28' rx='6' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='470' y='111' font-size='12' font-weight='700' fill='#1D1D1F'>Instalment 2 — 5 months</text><rect x='60' y='126' width='320' height='28' rx='6' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='390' y='145' font-size='12' font-weight='700' fill='#1D1D1F'>Instalment 3 — 4 months</text><rect x='60' y='160' width='240' height='28' rx='6' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='310' y='179' font-size='12' font-weight='700' fill='#1D1D1F'>Instalment 4 — 3 months</text><rect x='60' y='194' width='160' height='28' rx='6' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='230' y='213' font-size='12' font-weight='700' fill='#1D1D1F'>Instalment 5 — 2 months</text><rect x='60' y='228' width='80' height='28' rx='6' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='150' y='247' font-size='12' font-weight='700' fill='#1D1D1F'>Instalment 6 — 1 month</text></g><line x1='60' y1='272' x2='540' y2='272' stroke='#86868B' stroke-width='1.5'/><text x='60' y='290' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>deposited first — earns longest</text><text x='540' y='290' text-anchor='end' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>deposited last — earns least</text><rect x='205' y='312' width='350' height='46' rx='10' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='340' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='14' font-weight='700' fill='#1D1D1F'>6 + 5 + 4 + 3 + 2 + 1 = 21 months</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Every instalment earns interest for the full n months.",
          "why_students_fall_for_this": "It feels natural to treat the equal monthly deposits identically in every respect, including time.",
          "concrete_wrong_example": "For a 6-month RD, taking all six instalments as earning 6 months each — a total of 36 month-units instead of 21.",
          "correction": "Only the 1st instalment earns for n months. The kth instalment earns for (n − k + 1) months; the times run n, n − 1, … , 1 and add to n(n + 1)/2.",
          "how_to_spot_mid_problem": "If your total month-count equals n × n, you forgot that later instalments earn less time — it should be n(n + 1)/2."
        },
        {
          "wrong_idea": "Recurring Deposit interest is compound interest.",
          "why_students_fall_for_this": "Money is added repeatedly, so it looks like the compounding seen in fixed deposits.",
          "concrete_wrong_example": "Applying a (1 + r/100)^n compound-interest formula to an RD.",
          "correction": "The ICSE RD formula applies simple interest to each instalment separately. Nothing is re-invested; there is no compounding.",
          "how_to_spot_mid_problem": "If you see a power or a (1 + r/100) bracket in an RD solution, you have used the wrong type of interest."
        },
        {
          "wrong_idea": "The maturity value is the interest the bank pays.",
          "why_students_fall_for_this": "The maturity amount is the 'reward' at the end, so it gets confused with the interest alone.",
          "concrete_wrong_example": "Reporting the maturity value of a ₹600 × 6-month RD as just its interest, ignoring the ₹3,600 deposited.",
          "correction": "Maturity Value = total money deposited (P × n) + interest. You get back everything you put in, plus the interest.",
          "how_to_spot_mid_problem": "If your maturity value is smaller than the total you deposited, you left the deposits out."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "The earning times are a countdown",
          "rule": "Instalment 1 earns n months, and each later instalment earns one month less, ending at 1 month for the last.",
          "example": "For n = 5: the earning times are 5, 4, 3, 2, 1.",
          "when_to_use": "Whenever you must list or reason about how long each instalment is invested."
        },
        {
          "shortcut": "Total months = n(n + 1)/2",
          "rule": "Never add the ladder term by term — use the formula n(n + 1)/2 directly.",
          "example": "n = 12 → 12 × 13 ÷ 2 = 78 month-units; n = 24 → 24 × 25 ÷ 2 = 300.",
          "when_to_use": "Every RD problem; it is the quantity the interest formula needs."
        },
        {
          "shortcut": "Total deposited in one step",
          "rule": "Sum of all deposits = monthly deposit × number of months = P × n.",
          "example": "₹800 a month for 15 months → 800 × 15 = ₹12,000 deposited.",
          "when_to_use": "Finding how much money was paid in, and as the first half of the maturity value."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "A problem describes a fixed sum paid into a bank every month for a set period.",
          "You must reason about how long each instalment stays invested.",
          "You need the total month-count n(n + 1)/2 before applying an interest formula.",
          "You must separate the money deposited from the interest in a maturity value."
        ],
        "use_other_methods_instead_when": [
          "A single lump sum is invested once — use ordinary simple or compound interest, not RD.",
          "Only the numerical interest is asked with the formula already set up — see RD interest (sub-topic 2.2).",
          "The final amount received is required — see RD maturity value (sub-topic 2.3)."
        ]
      },
      "edge_cases": [
        {
          "case": "An RD that runs for just one month (n = 1)",
          "value": "There is a single instalment earning interest for 1 month; n(n + 1)/2 = 1 × 2 ÷ 2 = 1.",
          "reasoning": "With only one deposit the 'staircase' collapses to a single step — the formula still works and gives 1 month.",
          "where_it_appears": "Limiting-case checks and very short-term deposits."
        },
        {
          "case": "The period is given in years",
          "value": "Convert to months first: n = years × 12, then use n throughout.",
          "reasoning": "Every RD formula counts instalments in months; a period left in years gives a badly wrong n(n + 1)/2.",
          "where_it_appears": "Problems phrased as 'for 2 years' or 'for 3½ years'."
        },
        {
          "case": "A missed or extra instalment",
          "value": "The number of instalments n changes; recount the deposits actually made.",
          "reasoning": "RD formulas assume exactly n equal deposits; if the count differs, n must be corrected before any calculation.",
          "where_it_appears": "Real-passbook problems where a month is skipped."
        }
      ],
      "key_takeaway": "A Recurring Deposit is n separate deposits of ₹P, each earning simple interest only for the time it stays in the bank — n, n − 1, … , 1 months. Those times add to n(n + 1)/2 months, the engine of every RD calculation. The maturity value is the total deposited (P × n) plus the interest, never the interest alone.",
      "video_script_hooks": {
        "video_target_length_seconds": 190,
        "opening_hook_5_sec": "Twelve equal deposits, twelve different amounts of interest. How can that be? Welcome to Recurring Deposits.",
        "narrative_arc": "Hook (equal deposits, unequal interest) → why time differs per instalment → the countdown n, n − 1, … , 1 → the times add to n(n + 1)/2 → maturity = deposits + interest.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Twelve identical ₹1,000 coins drop into an account on twelve different dates."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "The January coin glows longest; the December coin barely glows at all."
          },
          {
            "timestamp_seconds": 95,
            "what_happens_on_screen": "A staircase of bars forms — 6, 5, 4, 3, 2, 1 months."
          },
          {
            "timestamp_seconds": 140,
            "what_happens_on_screen": "The bars slide together into one total: n(n + 1)/2 months."
          },
          {
            "timestamp_seconds": 170,
            "what_happens_on_screen": "Closing card: 'Maturity = all you deposited + the interest.'"
          }
        ],
        "closing_takeaway_voiceover": "A Recurring Deposit is just simple interest, paid honestly to each instalment for the exact time it was invested. Add those times up — n(n + 1)/2 — and the whole topic opens up."
      }
    }
  },
  {
    "topicId": "icse_math10_ch2_rd_interest",
    "chapterNumber": 2,
    "key_formulas": [
      {
        "formula": "Interest on a Recurring Deposit:  I = P × [n(n + 1)/2] × (1/12) × (r/100),  where P = monthly deposit, n = number of months, r = rate of interest per annum.",
        "explanation": "Total interest treats the whole RD as one principal P earning simple interest for n(n + 1)/2 months. The factor 1/12 turns those months into years so the per-annum rate can be applied."
      },
      {
        "formula": "Equivalent (single) principal for one month = P × n(n + 1)/2.",
        "explanation": "Adding every instalment's principal-months gives one number; the RD then behaves like that single amount kept for exactly one month at the given rate."
      },
      {
        "formula": "Compact form:  I = P × n(n + 1) × r ÷ 2400.",
        "explanation": "The constants combine as 2 × 12 × 100 = 2400, giving a single-fraction version that is fast to compute."
      },
      {
        "formula": "Unit rule:  r is always per ANNUM and n is always in MONTHS; the 1/12 reconciles the mismatch.",
        "explanation": "Keeping the units straight — yearly rate, monthly count — is the single most important habit for getting RD interest right."
      }
    ],
    "name": "Recurring Deposit — The Interest Formula",
    "prerequisite_knowledge": [
      "The RD concept — each instalment earns interest for a different time, totalling n(n + 1)/2 months (sub-topic 2.1).",
      "Simple interest — interest = principal × rate × time ÷ 100, with time measured in years.",
      "Converting months to years by dividing by 12.",
      "The sum of the first n natural numbers: 1 + 2 + … + n = n(n + 1)/2.",
      "Substituting numbers into a formula and simplifying a fraction."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "The RD interest formula looks fearsome but is just simple interest applied cleverly. Add up every instalment's earning time to get n(n + 1)/2 months, pretend ₹P sat in the bank for that whole stretch, divide the months by 12 to make them years, and apply the ordinary simple-interest rate. That is the entire formula.",
        "hook": "Most students memorise I = P × n(n + 1)/2 × 1/12 × r/100 and pray. But every symbol has a job: P is the deposit, n(n + 1)/2 is the total months from the staircase, 1/12 changes months into years, r/100 is the plain interest rate. Understand the four jobs and you never misplace a factor again.",
        "real_world_anchors": [
          "A bank clerk computing the interest line on an RD passbook at maturity.",
          "Comparing two RD schemes that differ only in the rate r.",
          "An online RD calculator that asks for the monthly amount, the months and the rate.",
          "Checking by hand whether the interest a bank credited is correct."
        ],
        "the_pivot_idea": "Do not compute interest instalment by instalment. Collapse the whole RD into one equivalent principal P × n(n + 1)/2 carried for ONE month, then apply simple interest for one month: multiply by (1/12) and by (r/100).",
        "wrong_intuitions_to_replace": [
          "'Use n in years.' — Wrong. n is the number of MONTHS; the 1/12 already converts to years.",
          "'Drop the 1/12.' — Wrong. Without it you would charge a yearly rate on a month-count, inflating the interest twelve-fold.",
          "'The sum of months is n × n.' — Wrong. It is n(n + 1)/2; forgetting the ÷2, or using n², roughly doubles the interest."
        ]
      },
      "derivation": {
        "starting_question": "We know the instalments earn interest for n, n − 1, … , 1 months. How does that turn into one clean interest formula?",
        "part_1_interest_on_one_instalment": {
          "claim": "An instalment of ₹P kept for m months earns simple interest P × (r/100) × (m/12).",
          "reasoning": "Simple interest is principal × rate × time, with time in years. Here the principal is P, the rate is r%, and m months is m/12 of a year — so the interest on that one instalment is P × (r/100) × (m/12)."
        },
        "part_2_add_every_instalment": {
          "claim": "The total interest is P × (r/100) × (1/12) × (n + (n − 1) + … + 1).",
          "reasoning": "Every instalment shares the same P, the same r/100 and the same 1/12; only the month-count m differs. Factor the common parts out, and what is left to add is just the months n + (n − 1) + … + 1."
        },
        "part_3_replace_the_sum_of_months": {
          "claim": "Since 1 + 2 + … + n = n(n + 1)/2, the total interest is I = P × [n(n + 1)/2] × (1/12) × (r/100).",
          "reasoning": "Substituting the known sum for the bracket of months gives the standard RD interest formula in one line — no instalment-by-instalment work needed.",
          "named_concept": "The equivalent-principal method — the whole RD reduces to a single principal P × n(n + 1)/2 earning simple interest for one month at rate r."
        }
      },
      "worked_example": [
        {
          "problem": "Find the interest on a Recurring Deposit of ₹400 per month for 12 months at 6% per annum.",
          "thought_process_before_starting": "Write the formula, compute n(n + 1)/2 first, then substitute and simplify the fraction.",
          "steps": [
            {
              "step_number": 1,
              "action": "Write the formula and list the values.",
              "computation": "I = P × [n(n + 1)/2] × (1/12) × (r/100);  P = 400, n = 12, r = 6.",
              "reasoning": "Setting out P, n, r prevents unit mistakes."
            },
            {
              "step_number": 2,
              "action": "Compute the total month-count n(n + 1)/2.",
              "computation": "12 × 13 ÷ 2 = 156 ÷ 2 = 78 months.",
              "reasoning": "This is the equivalent months of the RD."
            },
            {
              "step_number": 3,
              "action": "Substitute every value.",
              "computation": "I = 400 × 78 × (1/12) × (6/100).",
              "reasoning": "Each factor now has its number in place."
            },
            {
              "step_number": 4,
              "action": "Simplify the arithmetic.",
              "computation": "I = (400 × 78 × 6) ÷ (12 × 100) = 187200 ÷ 1200 = ₹156.",
              "reasoning": "Combining the denominators 12 × 100 = 1200 keeps it to one division."
            }
          ],
          "answer": "Interest = ₹156."
        },
        {
          "problem": "A man deposits ₹800 per month in an RD account for 18 months. If the rate of interest is 10% per annum, find the interest he earns.",
          "thought_process_before_starting": "Same routine: n(n + 1)/2 first, then the compact form I = P × n(n + 1) × r ÷ 2400.",
          "steps": [
            {
              "step_number": 1,
              "action": "List the values.",
              "computation": "P = 800, n = 18, r = 10.",
              "reasoning": "n is already in months — no conversion needed."
            },
            {
              "step_number": 2,
              "action": "Compute n(n + 1)/2.",
              "computation": "18 × 19 ÷ 2 = 342 ÷ 2 = 171 months.",
              "reasoning": "The equivalent months for an 18-month RD."
            },
            {
              "step_number": 3,
              "action": "Apply the formula.",
              "computation": "I = 800 × 171 × (1/12) × (10/100) = (800 × 171 × 10) ÷ 1200.",
              "reasoning": "Using the combined denominator 2 already absorbed → 1200."
            },
            {
              "step_number": 4,
              "action": "Simplify.",
              "computation": "I = 1,368,000 ÷ 1200 = ₹1,140.",
              "reasoning": "One clean division gives the interest."
            }
          ],
          "answer": "Interest = ₹1,140."
        }
      ],
      "visual_description": "The diagram lays the RD interest formula out as four labelled blocks side by side — 'P (monthly deposit)', 'n(n+1)/2 (total months from the staircase)', '×1/12 (months → years)' and '×r/100 (the interest rate)'. An arrow runs left to right ending in a box marked 'Interest I'. A worked strip below shows the numbers 400 · 78 · 1/12 · 6/100 collapsing to ₹156.",
      "svg_diagrams": [
        {
          "id": "rd_interest_formula_anatomy",
          "title": "The RD interest formula — what each factor does",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>I = P × n(n+1)/2 × 1/12 × r/100</text><g font-family='-apple-system, sans-serif'><rect x='40' y='70' width='150' height='80' rx='10' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='115' y='100' text-anchor='middle' font-size='15' font-weight='700' fill='#1D1D1F'>P</text><text x='115' y='122' text-anchor='middle' font-size='11' fill='#86868B'>monthly</text><text x='115' y='137' text-anchor='middle' font-size='11' fill='#86868B'>deposit</text><rect x='210' y='70' width='160' height='80' rx='10' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='290' y='100' text-anchor='middle' font-size='14' font-weight='700' fill='#1D1D1F'>n(n+1)/2</text><text x='290' y='122' text-anchor='middle' font-size='11' fill='#86868B'>total months</text><text x='290' y='137' text-anchor='middle' font-size='11' fill='#86868B'>(the staircase)</text><rect x='390' y='70' width='150' height='80' rx='10' fill='#E8F8EE' stroke='#1D1D1F' stroke-width='2'/><text x='465' y='100' text-anchor='middle' font-size='15' font-weight='700' fill='#1D1D1F'>1/12</text><text x='465' y='122' text-anchor='middle' font-size='11' fill='#86868B'>months</text><text x='465' y='137' text-anchor='middle' font-size='11' fill='#86868B'>→ years</text><rect x='560' y='70' width='150' height='80' rx='10' fill='#FFD6E0' stroke='#1D1D1F' stroke-width='2'/><text x='635' y='100' text-anchor='middle' font-size='15' font-weight='700' fill='#1D1D1F'>r/100</text><text x='635' y='122' text-anchor='middle' font-size='11' fill='#86868B'>interest</text><text x='635' y='137' text-anchor='middle' font-size='11' fill='#86868B'>rate p.a.</text></g><g stroke='#1D1D1F' stroke-width='2'><line x1='190' y1='110' x2='208' y2='110'/><line x1='370' y1='110' x2='388' y2='110'/><line x1='540' y1='110' x2='558' y2='110'/></g><text x='198' y='105' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#86868B'>×</text><text x='378' y='105' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#86868B'>×</text><text x='548' y='105' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#86868B'>×</text><rect x='150' y='210' width='460' height='54' rx='10' fill='#F5F5F7' stroke='#E5E5EA'/><text x='380' y='233' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1D1D1F'>Example:  400 × 78 × 1/12 × 6/100</text><text x='380' y='253' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#86868B'>= 187200 ÷ 1200</text><rect x='300' y='292' width='160' height='44' rx='10' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='320' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='15' font-weight='700' fill='#1D1D1F'>Interest = ₹156</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Use n measured in years inside the formula.",
          "why_students_fall_for_this": "Simple interest normally uses time in years, so students convert n to years out of habit.",
          "concrete_wrong_example": "For an 18-month RD, putting n = 1.5 into n(n + 1)/2.",
          "correction": "In the RD formula n is the number of MONTHS. The separate factor 1/12 does the months-to-years conversion.",
          "how_to_spot_mid_problem": "If n is a decimal like 1.5 or 2, you used years — n should be a whole number of months such as 18 or 24."
        },
        {
          "wrong_idea": "Leave out the 1/12 factor.",
          "why_students_fall_for_this": "The formula has many parts and the small 1/12 is the easiest to drop.",
          "concrete_wrong_example": "Computing 400 × 78 × (6/100) = ₹1,872 instead of ₹156.",
          "correction": "The 1/12 converts the month-count into years; without it the answer is exactly 12 times too large.",
          "how_to_spot_mid_problem": "If your interest looks suspiciously close to the total deposited (or larger), you probably dropped the 1/12."
        },
        {
          "wrong_idea": "Take the total months as n × n (or forget to halve the sum).",
          "why_students_fall_for_this": "n appears twice in n(n + 1), so it gets mis-remembered as n².",
          "concrete_wrong_example": "For n = 12, using 12 × 12 = 144 instead of 12 × 13 ÷ 2 = 78.",
          "correction": "The total months is the sum 1 + 2 + … + n = n(n + 1)/2 — note the +1 and the ÷2.",
          "how_to_spot_mid_problem": "For n = 12 the month-count must be 78; if you have 144 or 156, the formula was applied wrongly."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Single-fraction form",
          "rule": "I = P × n(n + 1) × r ÷ 2400, because 2 × 12 × 100 = 2400.",
          "example": "P = 400, n = 12, r = 6 → 400 × 12 × 13 × 6 ÷ 2400 = 374400 ÷ 2400 = ₹156.",
          "when_to_use": "Any direct interest computation — it keeps everything in one division."
        },
        {
          "shortcut": "Memorise common month-counts",
          "rule": "n(n + 1)/2 for the usual periods: 6 → 21, 12 → 78, 18 → 171, 24 → 300, 36 → 666.",
          "example": "A 24-month RD: jump straight to 300 without re-computing.",
          "when_to_use": "Standard RD periods that appear again and again in exams."
        },
        {
          "shortcut": "Equivalent principal then one month of SI",
          "rule": "Compute the equivalent principal P × n(n + 1)/2, then apply simple interest for exactly one month: × (r/100) × (1/12).",
          "example": "400 × 78 = 31,200; then 31,200 × 6/100 × 1/12 = ₹156.",
          "when_to_use": "When you want a conceptual check that the units are right."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_interest_formula_when": [
          "The monthly deposit, the number of months and the rate are known and the interest is asked.",
          "You need the interest as a step towards the maturity value.",
          "Two RD schemes must be compared on the interest they generate.",
          "A bank's credited interest must be verified by hand."
        ],
        "use_other_methods_instead_when": [
          "The reasoning about earning times is what is asked — see the RD concept (sub-topic 2.1).",
          "The final amount received is needed — add the deposits in RD maturity value (sub-topic 2.3).",
          "An unknown such as P or r must be found from a given maturity value — see RD word problems (sub-topic 2.4)."
        ]
      },
      "edge_cases": [
        {
          "case": "A one-month RD (n = 1)",
          "value": "n(n + 1)/2 = 1, so I = P × 1 × (1/12) × (r/100) — simple interest on one instalment for one month.",
          "reasoning": "With a single instalment the formula degenerates to ordinary one-month simple interest, confirming it is consistent.",
          "where_it_appears": "Sanity-checking the formula at its smallest case."
        },
        {
          "case": "The rate is quoted per month instead of per annum",
          "value": "Drop the 1/12: I = P × n(n + 1)/2 × (monthly rate/100).",
          "reasoning": "The 1/12 exists only to turn an annual rate into a monthly one; a rate already monthly needs no conversion.",
          "where_it_appears": "Unusual problems that state a monthly rate explicitly."
        },
        {
          "case": "The period is given in years",
          "value": "Convert first: n = years × 12, then use the formula unchanged.",
          "reasoning": "n must be a month-count; '3 years' must become n = 36 before n(n + 1)/2 is computed.",
          "where_it_appears": "Problems worded as 'for 2 years' or 'for 3 years'."
        }
      ],
      "key_takeaway": "RD interest is simple interest in disguise: I = P × [n(n + 1)/2] × (1/12) × (r/100). The bracket n(n + 1)/2 is the total months from the staircase, the 1/12 turns months into years, and r/100 is the ordinary rate. Keep n in months and r per annum, and the formula never misfires.",
      "video_script_hooks": {
        "video_target_length_seconds": 195,
        "opening_hook_5_sec": "One scary-looking formula — but every symbol in it has a simple job. Let's give each a name.",
        "narrative_arc": "Hook (decode the formula) → interest on one instalment → factor out the common parts → replace the months by n(n + 1)/2 → land the formula → worked number.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "The full RD formula appears, then splits into four labelled blocks."
          },
          {
            "timestamp_seconds": 45,
            "what_happens_on_screen": "A single instalment earns P × r/100 × m/12 for m months."
          },
          {
            "timestamp_seconds": 95,
            "what_happens_on_screen": "Common factors P, r/100, 1/12 are pulled out; only the months remain to add."
          },
          {
            "timestamp_seconds": 140,
            "what_happens_on_screen": "The months collapse into n(n + 1)/2 and the formula is complete."
          },
          {
            "timestamp_seconds": 175,
            "what_happens_on_screen": "Closing card: '400 × 78 × 1/12 × 6/100 = ₹156.'"
          }
        ],
        "closing_takeaway_voiceover": "The RD interest formula is not memory work — it is meaning. Total months, months to years, ordinary rate. Know what each factor does and you will never lose a 1/12 again."
      }
    }
  },
  {
    "topicId": "icse_math10_ch2_rd_maturity",
    "chapterNumber": 2,
    "key_formulas": [
      {
        "formula": "Maturity Value (MV) = total sum deposited + interest earned = (P × n) + I.",
        "explanation": "At the end of the term the bank returns every instalment you paid in, plus the interest those instalments earned."
      },
      {
        "formula": "Total sum deposited = P × n.",
        "explanation": "Since each of the n monthly instalments equals P, the money you put in is simply their product."
      },
      {
        "formula": "Interest part:  I = P × [n(n + 1)/2] × (1/12) × (r/100)  =  P × n(n + 1) × r ÷ 2400.",
        "explanation": "The interest is computed exactly as in sub-topic 2.2; the maturity value just adds the deposits on top."
      },
      {
        "formula": "All-in-one form:  MV = P × n + P × n(n + 1) × r ÷ 2400.",
        "explanation": "Substituting the interest formula into MV = P × n + I gives a single expression in P, n and r."
      }
    ],
    "name": "Recurring Deposit — Maturity Value",
    "prerequisite_knowledge": [
      "The RD interest formula I = P × [n(n + 1)/2] × (1/12) × (r/100) (sub-topic 2.2).",
      "Total sum deposited in an RD = P × n (sub-topic 2.1).",
      "Adding two money amounts to form a total.",
      "Multiplying a monthly amount by a number of months.",
      "Keeping n in months and r per annum throughout a calculation."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "The maturity value is what the bank hands you on the last day, and it has exactly two parts: every rupee you deposited, and the interest those rupees earned. Compute the deposits (P × n), compute the interest (the sub-topic 2.2 formula), and add. That is the whole calculation.",
        "hook": "Deposit ₹1,000 a month for two years and you have put in ₹24,000 of your own money. The bank gives it all back — and a little extra for letting them hold it. The maturity value is your ₹24,000 plus that extra. Nothing more mysterious than 'deposits + interest'.",
        "real_world_anchors": [
          "The single maturity figure printed at the bottom of an RD passbook.",
          "A bank's RD brochure quoting 'you receive ₹X at maturity'.",
          "Comparing the maturity value of an RD against keeping the same money at home.",
          "Planning to have a target amount ready by a future date."
        ],
        "the_pivot_idea": "Maturity value is never just the interest and never just the deposits — it is their sum. Treat it as a two-part recipe: part one is P × n, part two is the RD interest, and the answer is part one plus part two.",
        "wrong_intuitions_to_replace": [
          "'Maturity value is the interest the bank pays.' — Wrong. It is the deposits PLUS the interest.",
          "'Total deposited is just P.' — Wrong. It is P × n, one P for each of the n months.",
          "'You can find the maturity value without the interest.' — Wrong. The interest is half the recipe; it must be computed first."
        ]
      },
      "derivation": {
        "starting_question": "On the day an RD matures, how is the amount the bank pays out built up?",
        "part_1_the_money_you_put_in": {
          "claim": "The depositor's own contribution to the maturity value is P × n.",
          "reasoning": "Across the term, n equal instalments of ₹P were paid. Their total is P × n — money that belongs to the depositor and is simply returned."
        },
        "part_2_the_money_the_bank_adds": {
          "claim": "The bank adds interest I = P × [n(n + 1)/2] × (1/12) × (r/100).",
          "reasoning": "Each instalment earned simple interest for the time it stayed in the bank; sub-topic 2.2 collapsed all of that into this single interest figure."
        },
        "part_3_the_two_parts_combine": {
          "claim": "Maturity Value = P × n + I.",
          "reasoning": "The depositor's money and the bank's interest are simply added — there is no overlap and nothing is double-counted, so MV = (P × n) + I.",
          "named_concept": "The two-part structure of maturity value — 'your money back' plus 'the interest on it'."
        }
      },
      "worked_example": [
        {
          "problem": "Sara deposits ₹1,000 per month in a Recurring Deposit account for 24 months at 8% per annum. Find the total sum deposited, the interest, and the maturity value.",
          "thought_process_before_starting": "Compute the deposits P × n, then the interest with the RD formula, then add the two.",
          "steps": [
            {
              "step_number": 1,
              "action": "Total sum deposited = P × n.",
              "computation": "1,000 × 24 = ₹24,000.",
              "reasoning": "24 instalments of ₹1,000 each."
            },
            {
              "step_number": 2,
              "action": "Compute n(n + 1)/2.",
              "computation": "24 × 25 ÷ 2 = 300 months.",
              "reasoning": "The equivalent months of a 24-month RD."
            },
            {
              "step_number": 3,
              "action": "Interest = P × [n(n + 1)/2] × (1/12) × (r/100).",
              "computation": "1,000 × 300 × (1/12) × (8/100) = (1,000 × 300 × 8) ÷ 1200 = ₹2,000.",
              "reasoning": "The sub-topic 2.2 interest formula."
            },
            {
              "step_number": 4,
              "action": "Maturity Value = total deposited + interest.",
              "computation": "24,000 + 2,000 = ₹26,000.",
              "reasoning": "Deposits returned plus the interest earned."
            }
          ],
          "answer": "Total deposited ₹24,000;  interest ₹2,000;  maturity value ₹26,000."
        },
        {
          "problem": "A man pays ₹2,000 per month into an RD account for 1 year. If the rate of interest is 9% per annum, find the amount he will receive on maturity.",
          "thought_process_before_starting": "Convert the year to 12 months, then run the deposits-plus-interest recipe.",
          "steps": [
            {
              "step_number": 1,
              "action": "Convert the period and find the deposits.",
              "computation": "n = 1 × 12 = 12 months;  total deposited = 2,000 × 12 = ₹24,000.",
              "reasoning": "RD calculations need n in months."
            },
            {
              "step_number": 2,
              "action": "Compute n(n + 1)/2.",
              "computation": "12 × 13 ÷ 2 = 78 months.",
              "reasoning": "Equivalent months for a 12-month RD."
            },
            {
              "step_number": 3,
              "action": "Interest = P × [n(n + 1)/2] × (1/12) × (r/100).",
              "computation": "2,000 × 78 × (1/12) × (9/100) = (2,000 × 78 × 9) ÷ 1200 = ₹1,170.",
              "reasoning": "Applying the interest formula."
            },
            {
              "step_number": 4,
              "action": "Maturity Value = total deposited + interest.",
              "computation": "24,000 + 1,170 = ₹25,170.",
              "reasoning": "The amount the bank pays at maturity."
            }
          ],
          "answer": "Maturity value = ₹25,170."
        }
      ],
      "visual_description": "The diagram stacks two blocks into a single column. A tall lower block is labelled 'Total deposited  P × n  =  ₹24,000'; a shorter upper block is labelled 'Interest  I  =  ₹2,000'. A brace on the right spans both blocks and points to 'Maturity Value = ₹26,000', with the caption 'your money back + the interest on it'.",
      "svg_diagrams": [
        {
          "id": "rd_maturity_two_parts",
          "title": "Maturity Value = total deposited + interest",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>MATURITY VALUE — A TWO-PART TOTAL</text><g font-family='-apple-system, sans-serif'><rect x='190' y='90' width='240' height='50' rx='9' fill='#E8F8EE' stroke='#1D1D1F' stroke-width='2'/><text x='310' y='112' text-anchor='middle' font-size='12' fill='#86868B'>Interest  I</text><text x='310' y='130' text-anchor='middle' font-size='14' font-weight='700' fill='#34C759'>₹2,000</text><rect x='190' y='140' width='240' height='150' rx='9' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='310' y='205' text-anchor='middle' font-size='12' fill='#86868B'>Total deposited  P × n</text><text x='310' y='228' text-anchor='middle' font-size='16' font-weight='700' fill='#1D1D1F'>₹24,000</text></g><path d='M446 90 L460 90 L460 290 L446 290' fill='none' stroke='#1D1D1F' stroke-width='2'/><line x1='460' y1='190' x2='480' y2='190' stroke='#1D1D1F' stroke-width='2'/><rect x='486' y='162' width='230' height='58' rx='10' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='601' y='186' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#86868B'>MATURITY VALUE</text><text x='601' y='208' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='16' font-weight='700' fill='#1D1D1F'>₹26,000</text><text x='380' y='328' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#86868B'>your money back (P × n) + the interest earned on it (I)</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "The maturity value equals the interest.",
          "why_students_fall_for_this": "The interest is the 'new' money, so it is mistaken for the whole payout.",
          "concrete_wrong_example": "Reporting the maturity value of Sara's RD as ₹2,000 instead of ₹26,000.",
          "correction": "Maturity Value = total deposited + interest = P × n + I. The deposits are returned along with the interest.",
          "how_to_spot_mid_problem": "If your maturity value is far smaller than P × n, you reported the interest only."
        },
        {
          "wrong_idea": "Maturity Value = P + I, using a single instalment.",
          "why_students_fall_for_this": "P is the most visible deposit figure, so it is used in place of the full P × n.",
          "concrete_wrong_example": "Writing MV = 1,000 + 2,000 = ₹3,000 for Sara's RD.",
          "correction": "The deposited part is P × n — every instalment, not one. MV = (P × n) + I.",
          "how_to_spot_mid_problem": "If your maturity value is barely above P, you forgot to multiply by n."
        },
        {
          "wrong_idea": "Add the deposits and interest but compute the interest with the wrong month-count.",
          "why_students_fall_for_this": "The maturity step is correct, but the interest sub-step reuses a sub-topic 2.2 error.",
          "concrete_wrong_example": "Using n × n months, getting an inflated interest, then adding it to P × n.",
          "correction": "Get the interest right first — n(n + 1)/2 months, with the 1/12 — then add the deposits.",
          "how_to_spot_mid_problem": "Check the interest in isolation against the formula before adding it to the deposits."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Two-part recipe",
          "rule": "MV = (P × n) + I. Compute the deposits, compute the interest, add — in that order, every time.",
          "example": "Deposits ₹24,000, interest ₹2,000 → MV = ₹26,000.",
          "when_to_use": "Every maturity-value problem; it keeps the two parts from being confused."
        },
        {
          "shortcut": "All-in-one form",
          "rule": "MV = P × n + P × n(n + 1) × r ÷ 2400 — substitute once and simplify.",
          "example": "P = 1,000, n = 24, r = 8 → 24,000 + (1,000 × 24 × 25 × 8 ÷ 2400) = 24,000 + 2,000 = ₹26,000.",
          "when_to_use": "When you prefer a single expression over two separate computations."
        },
        {
          "shortcut": "Interest as a quick check",
          "rule": "The interest should be a modest fraction of P × n; if it rivals or exceeds the deposits, recheck the 1/12 and n(n + 1)/2.",
          "example": "₹2,000 interest on ₹24,000 deposited is a sensible 8%-ish — it passes the smell test.",
          "when_to_use": "As a final sanity check on any maturity value."
        }
      ],
      "when_to_use_this_method": {
        "use_maturity_value_method_when": [
          "A problem asks for the amount received, the payout, or the maturity value of an RD.",
          "Both the deposits and the interest are needed to form a final total.",
          "An RD outcome must be compared with another savings option.",
          "A passbook's maturity figure must be verified."
        ],
        "use_other_methods_instead_when": [
          "Only the interest is required — stop after the RD interest formula (sub-topic 2.2).",
          "An unknown P, r or n must be recovered from a given maturity value — see RD word problems (sub-topic 2.4).",
          "The question is about why instalments earn different interest — see the RD concept (sub-topic 2.1)."
        ]
      },
      "edge_cases": [
        {
          "case": "A 0% rate of interest",
          "value": "Interest I = 0, so the maturity value equals the total deposited, P × n.",
          "reasoning": "With no interest the bank simply returns the money paid in — a useful check that MV always contains P × n.",
          "where_it_appears": "Limiting-case and conceptual questions."
        },
        {
          "case": "Maturity value asked but only the interest is given",
          "value": "Add the deposits yourself: MV = given interest + P × n.",
          "reasoning": "Some problems hand you the interest directly; the maturity step is then just adding P × n.",
          "where_it_appears": "Two-part questions where part (i) finds the interest and part (ii) the maturity value."
        },
        {
          "case": "Rounding the interest to the nearest rupee",
          "value": "Round only the final interest, then add the exact deposits.",
          "reasoning": "Rounding mid-way (for instance the month-count) can shift the maturity value; round once, at the end.",
          "where_it_appears": "Problems with rates that do not divide evenly."
        }
      ],
      "key_takeaway": "Maturity Value = total deposited + interest = (P × n) + I. It is always a two-part total: the depositor's own money returned, plus the interest computed from the RD formula. It is never the interest alone, and the deposited part is P × n, not a single P.",
      "video_script_hooks": {
        "video_target_length_seconds": 185,
        "opening_hook_5_sec": "On maturity day the bank hands you a cheque. What is written on it? Two things added together.",
        "narrative_arc": "Hook (the maturity cheque) → part one: your deposits P × n → part two: the interest → add them → worked number → close on the two-part recipe.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "A maturity cheque is filled in; the amount box is still blank."
          },
          {
            "timestamp_seconds": 35,
            "what_happens_on_screen": "A blue block grows to ₹24,000 — the deposits P × n."
          },
          {
            "timestamp_seconds": 85,
            "what_happens_on_screen": "A green block of ₹2,000 — the interest — stacks on top."
          },
          {
            "timestamp_seconds": 130,
            "what_happens_on_screen": "A brace spans both blocks; the cheque fills in ₹26,000."
          },
          {
            "timestamp_seconds": 165,
            "what_happens_on_screen": "Closing card: 'Maturity Value = P × n + I.'"
          }
        ],
        "closing_takeaway_voiceover": "Maturity value is never a mystery: it is your money back plus the interest it earned. Compute the deposits, compute the interest, add — and the cheque writes itself."
      }
    }
  },
  {
    "topicId": "icse_math10_ch2_rd_problems",
    "chapterNumber": 2,
    "key_formulas": [
      {
        "formula": "Master equation:  MV = P × [ n + n(n + 1)/2 × (1/12) × (r/100) ].",
        "explanation": "Factoring P out of MV = P × n + I gives one equation linking MV, P, n and r. Whichever quantity is unknown, substitute the other three and solve."
      },
      {
        "formula": "To find the monthly deposit P:  P = MV ÷ [ n + n(n + 1)/2 × (1/12) × (r/100) ].",
        "explanation": "Compute the bracket — a pure number once n and r are known — then divide the maturity value by it."
      },
      {
        "formula": "To find the rate r:  first I = MV − P × n, then r = (I × 2400) ÷ [ P × n(n + 1) ].",
        "explanation": "Separate the interest from the maturity value, then rearrange the compact interest formula I = P × n(n + 1) × r ÷ 2400 to make r the subject."
      },
      {
        "formula": "To find the number of months n:  use I = MV − P × n and solve P × n(n + 1) × r ÷ 2400 = I for n.",
        "explanation": "With P and r known, n is the only unknown; the resulting equation in n is solved (often a quadratic, or by inspecting standard periods)."
      }
    ],
    "name": "Recurring Deposit — Word Problems and Finding the Unknown",
    "prerequisite_knowledge": [
      "The RD interest formula and the maturity value MV = P × n + I (sub-topics 2.2, 2.3).",
      "Solving a simple linear equation for one unknown.",
      "Rearranging a formula to make a chosen letter the subject.",
      "Finding a number when a percentage relationship is given.",
      "Careful substitution of values into a multi-part formula."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Word problems run the RD machinery backwards. Forward problems give you P, n and r and ask for the interest or maturity value; reverse problems give you the maturity value and ask for a missing P, r or n. The trick is one master equation — write MV in terms of all four quantities, put in the three you know, and solve for the one you do not.",
        "hook": "A bank advert says 'Pay ₹X a month for two years and collect ₹52,000.' What is X? You cannot just divide ₹52,000 by 24 — that ignores the interest. Reverse RD problems are exactly this: undo the interest correctly to recover the hidden quantity.",
        "real_world_anchors": [
          "Working out the monthly deposit needed to reach a savings target by a fixed date.",
          "Checking the interest rate a bank actually gave from the maturity figure on a passbook.",
          "Deciding how many months an RD must run to reach a goal amount.",
          "Comparing advertised RD schemes by solving for the rate each one implies."
        ],
        "the_pivot_idea": "Do not attack reverse problems with a half-remembered shortcut. Write the master equation MV = P × [ n + n(n + 1)/2 × (1/12) × (r/100) ], substitute the three known quantities, and you are left with a routine equation in the one unknown.",
        "wrong_intuitions_to_replace": [
          "'To find P, divide the maturity value by n.' — Wrong. That ignores the interest; divide by the whole bracket [ n + n(n + 1)/2 × … ].",
          "'To find r, divide the maturity value by something.' — Wrong. First strip out the deposits: I = MV − P × n, then solve for r from the interest only.",
          "'The interest and the deposits can be mixed in one step.' — Wrong. Always separate I = MV − P × n before working on the rate or the time."
        ]
      },
      "derivation": {
        "starting_question": "Given a maturity value and two of the three quantities P, n, r, how do we recover the third?",
        "part_1_one_master_equation": {
          "claim": "Everything follows from MV = P × [ n + n(n + 1)/2 × (1/12) × (r/100) ].",
          "reasoning": "Start from MV = P × n + I and substitute I = P × n(n + 1)/2 × (1/12) × (r/100). Factoring P out leaves one equation tying together all four quantities."
        },
        "part_2_isolate_the_unknown": {
          "claim": "Substituting the three known values turns the master equation into a one-unknown equation.",
          "reasoning": "If P is unknown, the bracket is a known number and P = MV ÷ bracket. If r is unknown, the bracket still contains r, so first peel off the deposits with I = MV − P × n and work on the interest equation alone."
        },
        "part_3_solve_routinely": {
          "claim": "The remaining equation is solved by ordinary algebra.",
          "reasoning": "For P it is a single division. For r it is r = (I × 2400) ÷ [ P × n(n + 1) ]. For n it is an equation in n — solved as a quadratic or by checking standard month-counts.",
          "named_concept": "The substitute-then-solve routine — known values in first, algebra second; never a memorised reverse shortcut."
        }
      },
      "worked_example": [
        {
          "problem": "A man wants to receive ₹26,000 from a Recurring Deposit account at the end of 24 months. If the bank pays 8% per annum, find the monthly instalment he must deposit.",
          "thought_process_before_starting": "P is unknown; n = 24 and r = 8 are known. Compute the bracket [ n + n(n + 1)/2 × (1/12) × (r/100) ], then divide ₹26,000 by it.",
          "steps": [
            {
              "step_number": 1,
              "action": "Compute n(n + 1)/2.",
              "computation": "24 × 25 ÷ 2 = 300 months.",
              "reasoning": "Needed inside the interest part of the bracket."
            },
            {
              "step_number": 2,
              "action": "Evaluate the interest part of the bracket.",
              "computation": "300 × (1/12) × (8/100) = 300 × 8 ÷ 1200 = 2.",
              "reasoning": "This is the interest produced per ₹1 of monthly deposit."
            },
            {
              "step_number": 3,
              "action": "Complete the bracket  n + interest part.",
              "computation": "24 + 2 = 26.",
              "reasoning": "Each ₹1 of monthly deposit yields ₹26 at maturity."
            },
            {
              "step_number": 4,
              "action": "Solve for P.",
              "computation": "P = MV ÷ bracket = 26,000 ÷ 26 = ₹1,000.",
              "reasoning": "Dividing the target maturity value by the per-rupee yield."
            }
          ],
          "answer": "He must deposit ₹1,000 per month."
        },
        {
          "problem": "Priya deposits ₹500 per month in an RD account for 12 months and receives ₹6,260 at maturity. Find the rate of interest per annum.",
          "thought_process_before_starting": "Separate the interest from the maturity value, then rearrange the interest formula to make r the subject.",
          "steps": [
            {
              "step_number": 1,
              "action": "Total deposited = P × n.",
              "computation": "500 × 12 = ₹6,000.",
              "reasoning": "The depositor's own money inside the maturity value."
            },
            {
              "step_number": 2,
              "action": "Interest I = MV − P × n.",
              "computation": "6,260 − 6,000 = ₹260.",
              "reasoning": "Peeling the deposits off leaves only the interest."
            },
            {
              "step_number": 3,
              "action": "Use the compact form I = P × n(n + 1) × r ÷ 2400, rearranged for r.",
              "computation": "r = (I × 2400) ÷ [ P × n(n + 1) ] = (260 × 2400) ÷ (500 × 12 × 13).",
              "reasoning": "n(n + 1) = 12 × 13 = 156."
            },
            {
              "step_number": 4,
              "action": "Simplify.",
              "computation": "r = 624000 ÷ 780000 × 100? — directly: 624000 ÷ 78000 = 8.",
              "reasoning": "P × n(n + 1) = 500 × 156 = 78,000; 624000 ÷ 78000 = 8."
            }
          ],
          "answer": "The rate of interest is 8% per annum."
        }
      ],
      "visual_description": "The diagram contrasts the forward and reverse directions. A top arrow labelled 'FORWARD' runs from a box 'P, n, r known' to a box 'find I and MV'. A bottom arrow labelled 'REVERSE' runs the other way, from 'MV known + two of P, n, r' back to 'find the third'. Between them sits the master equation MV = P × [ n + n(n + 1)/2 × 1/12 × r/100 ], with a caption 'substitute the three you know, solve for the one you do not'.",
      "svg_diagrams": [
        {
          "id": "rd_forward_reverse",
          "title": "RD word problems — running the formula backwards",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>FORWARD vs REVERSE RD PROBLEMS</text><g font-family='-apple-system, sans-serif'><rect x='50' y='66' width='210' height='62' rx='10' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='155' y='92' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>P, n, r known</text><text x='155' y='112' text-anchor='middle' font-size='11' fill='#86868B'>the usual given data</text><rect x='500' y='66' width='210' height='62' rx='10' fill='#E8F8EE' stroke='#1D1D1F' stroke-width='2'/><text x='605' y='92' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>find I and MV</text><text x='605' y='112' text-anchor='middle' font-size='11' fill='#86868B'>interest, maturity value</text><line x1='262' y1='84' x2='498' y2='84' stroke='#34C759' stroke-width='2.5' marker-end='url(#rf)'/><text x='380' y='76' text-anchor='middle' font-size='11' font-weight='700' fill='#34C759'>FORWARD</text><rect x='50' y='240' width='230' height='62' rx='10' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='165' y='266' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>find the third</text><text x='165' y='286' text-anchor='middle' font-size='11' fill='#86868B'>the missing P, r or n</text><rect x='480' y='240' width='230' height='62' rx='10' fill='#FFD6E0' stroke='#1D1D1F' stroke-width='2'/><text x='595' y='262' text-anchor='middle' font-size='12' font-weight='700' fill='#1D1D1F'>MV known +</text><text x='595' y='282' text-anchor='middle' font-size='11' fill='#86868B'>two of P, n, r</text><line x1='478' y1='271' x2='282' y2='271' stroke='#FF2D55' stroke-width='2.5' marker-end='url(#rf)'/><text x='380' y='263' text-anchor='middle' font-size='11' font-weight='700' fill='#FF2D55'>REVERSE</text></g><defs><marker id='rf' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto'><path d='M0,0 L8,3 L0,6 Z' fill='#1D1D1F'/></marker></defs><rect x='110' y='150' width='540' height='66' rx='10' fill='#F5F5F7' stroke='#E5E5EA'/><text x='380' y='178' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1D1D1F'>MV = P × [ n + n(n+1)/2 × 1/12 × r/100 ]</text><text x='380' y='200' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>substitute the three you know — solve for the one you do not</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "To find the monthly deposit, divide the maturity value by the number of months.",
          "why_students_fall_for_this": "MV ÷ n looks like the obvious 'undo' of multiplying P by n.",
          "concrete_wrong_example": "For MV ₹26,000 over 24 months, writing P = 26,000 ÷ 24 ≈ ₹1,083 instead of ₹1,000.",
          "correction": "Divide by the whole bracket [ n + n(n + 1)/2 × (1/12) × (r/100) ], which here is 26, giving P = ₹1,000.",
          "how_to_spot_mid_problem": "If you divided by n alone, your P is too big — the interest part of the bracket was ignored."
        },
        {
          "wrong_idea": "Find the rate by dividing the maturity value directly.",
          "why_students_fall_for_this": "Students try to jump straight from MV to r without removing the deposits first.",
          "concrete_wrong_example": "Using MV ₹6,260 in the rate formula instead of the interest ₹260.",
          "correction": "First compute I = MV − P × n, then r = (I × 2400) ÷ [ P × n(n + 1) ]. The rate comes from the interest, not the maturity value.",
          "how_to_spot_mid_problem": "If a maturity-sized number sits where the interest should be, you skipped I = MV − P × n."
        },
        {
          "wrong_idea": "Use P × n for the time factor when solving for the rate.",
          "why_students_fall_for_this": "P × n is fresh in mind from computing the deposits, so it is reused by mistake.",
          "concrete_wrong_example": "Writing r = (I × ...) ÷ (P × n) rather than ÷ [ P × n(n + 1) ].",
          "correction": "The interest formula uses n(n + 1)/2 months; rearranged for r it is r = (I × 2400) ÷ [ P × n(n + 1) ].",
          "how_to_spot_mid_problem": "Check the denominator contains n(n + 1), not n alone, before dividing."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "The per-rupee yield",
          "rule": "The bracket [ n + n(n + 1)/2 × (1/12) × (r/100) ] is the maturity value of just ₹1 a month; P = MV ÷ this number.",
          "example": "n = 24, r = 8 → bracket = 24 + 2 = 26, so each ₹1/month grows to ₹26; P = 26,000 ÷ 26 = ₹1,000.",
          "when_to_use": "Every 'find the monthly deposit' problem."
        },
        {
          "shortcut": "Strip the deposits first",
          "rule": "Before solving for r or n, always compute I = MV − P × n so you work with the interest alone.",
          "example": "MV ₹6,260, deposits ₹6,000 → interest ₹260 drives the rate calculation.",
          "when_to_use": "Any reverse problem that asks for the rate or the time."
        },
        {
          "shortcut": "Rate in one formula",
          "rule": "r = (I × 2400) ÷ [ P × n(n + 1) ] — substitute and divide once.",
          "example": "I = 260, P = 500, n = 12 → r = (260 × 2400) ÷ (500 × 156) = 624000 ÷ 78000 = 8%.",
          "when_to_use": "When the rate is the unknown and P, n, I are all known."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_word_problem_method_when": [
          "A maturity value is given and the monthly deposit must be found.",
          "A maturity value (or interest) is given and the rate of interest must be found.",
          "The number of months needed to reach a target amount must be determined.",
          "Any RD scenario gives three of the four quantities P, n, r, MV and asks for the fourth."
        ],
        "use_other_methods_instead_when": [
          "P, n and r are all given and only the interest is asked — use the RD interest formula (sub-topic 2.2).",
          "The maturity value itself is the unknown — use the maturity-value method (sub-topic 2.3).",
          "The question is conceptual, about earning times — see the RD concept (sub-topic 2.1)."
        ]
      },
      "edge_cases": [
        {
          "case": "Finding the number of months n",
          "value": "Substituting P and r leaves an equation in n; expand n(n + 1) and solve the quadratic, or test standard month-counts.",
          "reasoning": "n appears inside n(n + 1), so solving for it is harder than for P or r — but the master equation still applies.",
          "where_it_appears": "'How long must the RD run to reach ₹X?' problems."
        },
        {
          "case": "The answer for n or r is not a whole number",
          "value": "Re-read the data — RD exam answers are designed to be clean; a messy n usually signals a months/years slip.",
          "reasoning": "A non-integer month-count or an odd rate normally means the period was left in years or a value was mis-substituted.",
          "where_it_appears": "Self-checking after a reverse calculation."
        },
        {
          "case": "Two unknowns appear",
          "value": "A single RD equation cannot fix two unknowns; a second piece of information (a second account or condition) is needed.",
          "reasoning": "One equation determines one unknown; problems with two missing quantities must supply a second relationship.",
          "where_it_appears": "Multi-part problems comparing two RD accounts."
        }
      ],
      "key_takeaway": "RD word problems run the formula in reverse. Use the master equation MV = P × [ n + n(n + 1)/2 × (1/12) × (r/100) ], substitute the three known quantities, and solve for the fourth. For P, divide the maturity value by the bracket; for r, first strip the deposits with I = MV − P × n, then r = (I × 2400) ÷ [ P × n(n + 1) ].",
      "video_script_hooks": {
        "video_target_length_seconds": 200,
        "opening_hook_5_sec": "'Pay ₹X a month, collect ₹52,000.' Find X — and no, you cannot just divide.",
        "narrative_arc": "Hook (the advert puzzle) → one master equation → substitute the knowns → solve for P by dividing by the bracket → solve for r by stripping the deposits → close on substitute-then-solve.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "A bank advert with the monthly amount blanked out as a question mark."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "The master equation MV = P × [ … ] appears and highlights."
          },
          {
            "timestamp_seconds": 90,
            "what_happens_on_screen": "The bracket evaluates to 26; ₹26,000 ÷ 26 reveals P = ₹1,000."
          },
          {
            "timestamp_seconds": 145,
            "what_happens_on_screen": "For a rate problem, ₹6,260 − ₹6,000 peels off ₹260 of interest."
          },
          {
            "timestamp_seconds": 180,
            "what_happens_on_screen": "Closing card: 'Substitute the three you know. Solve for the one you do not.'"
          }
        ],
        "closing_takeaway_voiceover": "Reverse RD problems have no special tricks. Write the master equation, drop in the three quantities you know, and solve for the last one — substitute first, algebra second."
      }
    }
  },
  {
    "topicId": "icse_math10_ch3_dividend_income",
    "chapterNumber": 3,
    "key_formulas": [
      {
        "formula": "Dividend per share = (Dividend rate / 100) × Face Value.",
        "explanation": "The company declares a dividend as a percentage of FACE VALUE — never of market value. This is the annual payment received per share owned."
      },
      {
        "formula": "Annual income = Dividend per share × Number of shares = (Dividend rate / 100) × FV × Number of shares.",
        "explanation": "Multiply the per-share dividend by the total number of shares to get the investor's annual income from dividends."
      },
      {
        "formula": "Annual income = (Dividend rate / 100) × Total Face Value of investment.",
        "explanation": "Equivalent shortcut: apply the dividend rate directly to the total face value of all shares held. This avoids computing per-share dividend separately."
      }
    ],
    "name": "Shares — Dividend Income",
    "prerequisite_knowledge": [
      "Face value and market value of a share — sub-topic 3.1.",
      "Number of shares = Investment ÷ MV (sub-topic 3.1).",
      "Total face value = number of shares × FV (sub-topic 3.1).",
      "Percentage — finding a percentage of a quantity.",
      "Multiplication of money amounts."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A dividend is the company's annual profit-share paid to each shareholder. It is always stated as a percentage of face value — not of what you paid. So even if you bought shares at five times their face value, the dividend is still computed on the smaller face-value amount.",
        "hook": "You buy 100 shares of face value ₹10 each at ₹50 each. You spent ₹5,000. The company declares a '12% dividend'. Does it pay you 12% of the ₹5,000 you invested? No — it pays 12% of the face value: 12% of ₹10 = ₹1.20 per share, so ₹120 total. Your investment and the dividend base are different numbers.",
        "real_world_anchors": [
          "A company's annual report announcing '15% final dividend on face value of ₹10 per share' — shareholders receive ₹1.50 per share.",
          "A dividend warrant (cheque) from a company sent to a registered shareholder each year.",
          "An investor holding 500 shares calculating how much dividend income they will receive at year end.",
          "Dividend yield shown on stock-market websites — always a percentage of face value at which the dividend was declared."
        ],
        "the_pivot_idea": "Dividend rate is applied to FACE VALUE — not to the price you paid (market value). This single fact is what makes dividend income calculations work even when shares are bought above par.",
        "wrong_intuitions_to_replace": [
          "'15% dividend on my ₹15,000 investment gives me ₹2,250.' — Wrong. The dividend is on the face value of shares held, not the investment amount.",
          "'If I buy more shares at a higher MV, I get a higher dividend per share.' — Wrong. Dividend per share is fixed by FV × rate; MV has no role.",
          "'Annual income = rate% × MV × number of shares.' — Wrong. Always replace MV with FV in the dividend formula."
        ]
      },
      "derivation": {
        "starting_question": "If the company declares a 12% dividend on ₹100 face-value shares, and I hold 50 such shares, what is my annual income?",
        "part_1_per_share_dividend": {
          "claim": "The dividend per share is a fixed monetary amount: (rate / 100) × FV.",
          "reasoning": "12% of ₹100 = ₹12 per share per year. This amount is the same for every shareholder who holds that class of share, regardless of what each paid for it in the market."
        },
        "part_2_scale_up_by_shares_held": {
          "claim": "Annual income = dividend per share × number of shares.",
          "reasoning": "Owning 50 shares means receiving 50 separate per-share dividends. The total is simply the per-share amount multiplied by the count of shares."
        },
        "part_3_shortcut_via_total_fv": {
          "claim": "Annual income = (rate / 100) × total face value.",
          "reasoning": "Total face value = number of shares × FV. Substituting: income = (rate/100) × (n × FV) = (rate/100) × FV × n. So multiplying total FV by the rate gives the same answer in one step.",
          "named_concept": "The 'total face value shortcut' — whenever total FV is already known, skip the per-share step."
        }
      },
      "worked_example": [
        {
          "problem": "Priya buys 200 shares of face value ₹10 each at ₹15 per share. The company pays a 12% annual dividend. Find her annual income.",
          "thought_process_before_starting": "She bought at MV ₹15 but dividends are on FV ₹10. Apply 12% to ₹10, then multiply by 200 shares.",
          "steps": [
            {
              "step_number": 1,
              "action": "Find the dividend per share.",
              "computation": "Dividend per share = (12/100) × ₹10 = ₹1.20.",
              "reasoning": "The dividend rate applies to face value, not to what she paid (₹15)."
            },
            {
              "step_number": 2,
              "action": "Find total annual income.",
              "computation": "Annual income = ₹1.20 × 200 = ₹240.",
              "reasoning": "She receives the per-share dividend on every share she owns."
            }
          ],
          "answer": "Priya's annual income = ₹240."
        },
        {
          "problem": "Rahul invests ₹18,000 in shares of face value ₹100 available at ₹120. The company declares a 15% annual dividend. Find his annual income.",
          "thought_process_before_starting": "First find the number of shares using MV, then compute income using FV. Or use the total-FV shortcut.",
          "steps": [
            {
              "step_number": 1,
              "action": "Find the number of shares.",
              "computation": "Shares = 18,000 ÷ 120 = 150 shares.",
              "reasoning": "Buying at market value ₹120."
            },
            {
              "step_number": 2,
              "action": "Find the total face value.",
              "computation": "Total FV = 150 × ₹100 = ₹15,000.",
              "reasoning": "Dividend base is ₹15,000, even though he paid ₹18,000."
            },
            {
              "step_number": 3,
              "action": "Apply the dividend rate to total FV.",
              "computation": "Annual income = (15/100) × 15,000 = ₹2,250.",
              "reasoning": "Using the total-FV shortcut: income = rate% × total FV."
            }
          ],
          "answer": "Rahul's annual income = ₹2,250."
        }
      ],
      "visual_description": "A three-box flow diagram: Box 1 (blue) — 'Investment ÷ MV → Number of shares'. Box 2 (orange) — 'Number of shares × FV → Total Face Value'. Box 3 (green) — 'Total Face Value × Rate% → Annual Income'. Below the boxes, a direct arrow showing the shortcut path from Total FV to Annual Income. A red cross-out symbol covers a hypothetical arrow labelled 'Investment × Rate%' to prevent the most common error.",
      "svg_diagrams": [
        {
          "id": "dividend_income_flow",
          "title": "Dividend income calculation — step-by-step flow",
          "svg": "<svg viewBox='0 0 760 300' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='300' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>DIVIDEND INCOME — CALCULATION FLOW</text><rect x='30' y='48' width='190' height='60' rx='10' fill='#EAF4FF' stroke='#1A73E8' stroke-width='2'/><text x='125' y='73' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#1A73E8'>Investment ÷ MV</text><text x='125' y='93' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#1D1D1F'>= Number of shares</text><polygon points='228,78 248,78 248,74 268,78 248,82 248,78' fill='#86868B'/><rect x='275' y='48' width='210' height='60' rx='10' fill='#FFF8E1' stroke='#F9A825' stroke-width='2'/><text x='380' y='73' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#7A5200'>Shares × Face Value</text><text x='380' y='93' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#1D1D1F'>= Total Face Value</text><polygon points='493,78 513,78 513,74 533,78 513,82 513,78' fill='#86868B'/><rect x='540' y='48' width='190' height='60' rx='10' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='635' y='73' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#1B7A3E'>Total FV × Rate%</text><text x='635' y='93' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#1D1D1F'>= Annual Income ✓</text><path d='M 380 118 Q 380 155 635 155 L 635 118' fill='none' stroke='#34C759' stroke-width='2' stroke-dasharray='6,4'/><text x='507' y='148' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#1B7A3E' font-style='italic'>shortcut: skip if total FV already known</text><rect x='30' y='180' width='700' height='54' rx='10' fill='#FFF0F0' stroke='#E53935' stroke-width='2'/><text x='380' y='205' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#C62828'>✗  NEVER: Annual income = Rate% × Investment</text><text x='380' y='225' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#C62828'>Dividends are on FACE VALUE, not on what you paid (market value).</text><text x='380' y='278' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='600' fill='#1D1D1F'>Annual Income = (Rate / 100) × FV × Number of Shares</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Annual income = rate% × total investment.",
          "why_students_fall_for_this": "It feels natural to apply a percentage to the money you actually spent.",
          "concrete_wrong_example": "Rahul's ₹18,000 investment at 15% → wrong: 0.15 × 18,000 = ₹2,700, instead of the correct ₹2,250.",
          "correction": "Dividend is on face value. Income = rate% × total face value = rate% × (shares × FV).",
          "how_to_spot_mid_problem": "If your income formula has MV or investment in it (not FV), you are using the wrong base."
        },
        {
          "wrong_idea": "If I pay more per share (higher MV), my dividend per share increases.",
          "why_students_fall_for_this": "Higher price intuitively feels like a higher reward.",
          "concrete_wrong_example": "Share A: FV ₹10, MV ₹50, 12% dividend → ₹1.20/share. Share B: FV ₹10, MV ₹20, 12% dividend → ₹1.20/share. Same dividend even though MV differs.",
          "correction": "Dividend per share = rate% × FV. MV plays no part in the dividend calculation.",
          "how_to_spot_mid_problem": "Check: does MV appear in your dividend formula? It should not."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Total FV shortcut",
          "rule": "Annual income = (rate/100) × total FV. Compute total FV once; then a single multiplication gives income.",
          "example": "150 shares, FV ₹100, 15% → total FV = ₹15,000 → income = 0.15 × 15,000 = ₹2,250.",
          "when_to_use": "Whenever the problem already tells you the number of shares or you have just computed it."
        },
        {
          "shortcut": "Reverse: find shares from income",
          "rule": "Number of shares = Annual income ÷ (rate/100 × FV) = Annual income ÷ dividend per share.",
          "example": "Income ₹720, FV ₹100, 8% → dividend/share = ₹8 → shares = 720 ÷ 8 = 90.",
          "when_to_use": "When the problem gives income and asks for number of shares or investment."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "You need to find the annual dividend income an investor receives.",
          "A problem gives the dividend rate and asks for the total annual earnings.",
          "You must work backwards from income to find shares or investment.",
          "Any problem that uses the word 'dividend' — always apply it to face value."
        ],
        "use_other_methods_instead_when": [
          "The problem asks for annual return % — you need the income first (sub-topic 3.3).",
          "Brokerage is mentioned — adjust MV before finding shares (sub-topic 3.4).",
          "The problem is about interest on loans or deposits — use SI/CI formulas, not dividend."
        ]
      },
      "edge_cases": [
        {
          "case": "Dividend rate given as a money amount rather than a percentage",
          "value": "If told 'dividend of ₹8 per share', use this directly as the per-share income without any FV multiplication.",
          "reasoning": "Some problems state the actual dividend amount per share rather than the rate. When the money amount is given, the FV step is already done.",
          "where_it_appears": "Occasionally in comparison problems or when the rate is non-standard."
        },
        {
          "case": "Interim and final dividends",
          "value": "If a company pays both an interim dividend (mid-year) and a final dividend (year-end), add them to get the total annual dividend rate before computing income.",
          "reasoning": "Total dividend income for the year = (interim rate + final rate) × FV × shares.",
          "where_it_appears": "Advanced ICSE problems involving two dividend announcements in a year."
        }
      ],
      "key_takeaway": "Dividend is always calculated on face value — not on the investment amount. Per-share dividend = (rate/100) × FV. Annual income = per-share dividend × number of shares. Or use the shortcut: annual income = (rate/100) × total face value of shareholding. MV never appears in a dividend calculation.",
      "video_script_hooks": {
        "video_target_length_seconds": 190,
        "opening_hook_5_sec": "You pay ₹150 per share. The face value is ₹10. Which number does the company use when it pays you dividends? Spoiler: not ₹150.",
        "narrative_arc": "Hook (which number do dividends use?) → dividend is rate% of FV → per-share amount → scale by shares → total FV shortcut → worked example → reverse: income → shares.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "₹150 MV badge and ₹10 FV badge side-by-side; a dividend envelope flies toward the ₹10 badge."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "Formula animation: (rate/100) × FV = ₹ per share."
          },
          {
            "timestamp_seconds": 90,
            "what_happens_on_screen": "Per-share amount multiplied by share count to give annual income."
          },
          {
            "timestamp_seconds": 140,
            "what_happens_on_screen": "Shortcut path: total FV × rate% in one step."
          },
          {
            "timestamp_seconds": 170,
            "what_happens_on_screen": "Closing card: 'Dividend base = Face Value. Always.'"
          }
        ],
        "closing_takeaway_voiceover": "The market price you paid has nothing to do with how much dividend you receive. The company's formula is simple: take the face value of every share you own, apply the dividend rate, and that is your annual income."
      }
    }
  },
  {
    "topicId": "icse_math10_ch3_return_and_yield",
    "chapterNumber": 3,
    "key_formulas": [
      {
        "formula": "Annual return % = (Annual income / Total investment) × 100.",
        "explanation": "This is the percentage the investor earns per year relative to the money they actually spent. It is the true measure of profitability — not the dividend rate, which is relative to face value."
      },
      {
        "formula": "Annual return % = (Dividend rate × FV / MV) × 100 / 100 = (Dividend rate × FV) / MV.",
        "explanation": "Expanding: income = (rate/100) × FV × shares; investment = MV × shares. Dividing: return = (rate × FV) / (100 × MV) × 100 = (rate × FV) / MV. The share count cancels, so return % depends only on FV, MV, and rate."
      },
      {
        "formula": "To compare two share options: compute return % for each; the share with the higher return % is the better investment per rupee spent.",
        "explanation": "The comparison is always done per rupee of investment. A higher dividend rate does not automatically mean a better investment — a higher MV reduces the effective yield."
      }
    ],
    "name": "Shares — Annual Return and Yield",
    "prerequisite_knowledge": [
      "Face value, market value, and number of shares — sub-topic 3.1.",
      "Dividend income calculation — sub-topic 3.2.",
      "Percentage — expressing one quantity as a percentage of another.",
      "The idea of 'return on investment' — how much you earn relative to what you spent.",
      "Comparing two fractions or percentages to decide which is larger."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A 12% dividend on a ₹100 face-value share sounds impressive. But if you paid ₹300 per share in the market, you only earn 4% on what you actually spent. Annual return % is the honest number — it tells you how much you earn per rupee invested, just like a bank's interest rate on a deposit.",
        "hook": "Two friends each invest ₹12,000. Friend A buys shares with a 20% dividend; Friend B buys shares with a 10% dividend. Who earns more? Without knowing the face values and market prices, you cannot answer — the dividend rate alone is meaningless for comparing investments. Annual return % is what you must compute.",
        "real_world_anchors": [
          "A financial advisor comparing two stocks by their 'dividend yield' — that is the annual return %.",
          "A newspaper report: 'Share X offers 3.5% yield vs share Y's 2.8%' — yield is annual return %.",
          "An investor deciding whether to buy shares or put money in a fixed deposit at 7% p.a. — she compares returns on the same basis.",
          "Comparing returns on two different investments in the same sector to decide which to hold."
        ],
        "the_pivot_idea": "Annual return % is the dividend income as a fraction of the actual money invested — not as a fraction of face value. It is the only fair way to compare two different share investments on a per-rupee basis.",
        "wrong_intuitions_to_replace": [
          "'The 15% dividend share is always better than the 10% dividend share.' — Wrong. If the 15% share costs much more per face value unit, the actual return on investment can be lower.",
          "'Annual return % = dividend rate %.' — Wrong. Dividend rate is on FV; return % is on MV. They are equal only when MV = FV (at par).",
          "'I just need to find the income — that tells me which share is better.' — Wrong. To compare, you must express income relative to the same investment amount."
        ]
      },
      "derivation": {
        "starting_question": "If I invest ₹15,000 in shares and receive ₹1,800 annual income, what is my annual return %?",
        "part_1_return_is_income_over_investment": {
          "claim": "Annual return % = (annual income / investment) × 100.",
          "reasoning": "This is the standard definition of 'percentage return': how many rupees of income per hundred rupees invested. It is the same concept as simple interest rate."
        },
        "part_2_the_compact_formula": {
          "claim": "Return % = (dividend rate × FV) / MV — the share count cancels out.",
          "reasoning": "Income = (rate/100) × FV × n shares. Investment = MV × n shares. Return = Income/Investment × 100 = [(rate/100) × FV × n] / [MV × n] × 100 = (rate × FV) / MV. The share count n cancels, leaving a ratio that depends only on rate, FV, and MV."
        },
        "part_3_at_par_special_case": {
          "claim": "When MV = FV (shares at par), return % equals the dividend rate %.",
          "reasoning": "Substituting MV = FV: return = (rate × FV) / FV = rate. This confirms the formula — at par the two percentages are the same.",
          "named_concept": "'Yield' — the market term for annual return %; it equals dividend rate only when a share trades at par."
        }
      },
      "worked_example": [
        {
          "problem": "Amit invests ₹9,600 in shares of face value ₹100 at ₹120 each. The company pays 15% dividend. Find (i) number of shares, (ii) annual income, (iii) annual return %.",
          "thought_process_before_starting": "Three sub-parts build on each other: shares (use MV), income (use FV), return % (income ÷ investment).",
          "steps": [
            {
              "step_number": 1,
              "action": "Find number of shares.",
              "computation": "Shares = 9,600 ÷ 120 = 80 shares.",
              "reasoning": "Buy at market value ₹120."
            },
            {
              "step_number": 2,
              "action": "Find annual income.",
              "computation": "Income = (15/100) × ₹100 × 80 = ₹15 × 80 = ₹1,200.",
              "reasoning": "Dividend on face value ₹100; 15% of ₹100 = ₹15 per share."
            },
            {
              "step_number": 3,
              "action": "Find annual return %.",
              "computation": "Return % = (1,200 / 9,600) × 100 = 12.5%.",
              "reasoning": "He earns ₹12.50 per ₹100 invested — less than the 15% dividend rate because the share was bought above par."
            }
          ],
          "answer": "(i) 80 shares;  (ii) Annual income = ₹1,200;  (iii) Annual return = 12.5%."
        },
        {
          "problem": "Share A: FV ₹10, MV ₹16, dividend 12%. Share B: FV ₹10, MV ₹20, dividend 15%. Which gives a better return?",
          "thought_process_before_starting": "Use the compact formula: return % = (rate × FV) / MV for each share, then compare.",
          "steps": [
            {
              "step_number": 1,
              "action": "Return % for Share A.",
              "computation": "(12 × 10) / 16 = 120 / 16 = 7.5%.",
              "reasoning": "Compact formula; share count cancels."
            },
            {
              "step_number": 2,
              "action": "Return % for Share B.",
              "computation": "(15 × 10) / 20 = 150 / 20 = 7.5%.",
              "reasoning": "Same formula for Share B."
            },
            {
              "step_number": 3,
              "action": "Compare.",
              "computation": "Both give 7.5% — the returns are equal.",
              "reasoning": "Even though B has a higher dividend rate, its higher market price exactly offsets the advantage."
            }
          ],
          "answer": "Both shares give an equal annual return of 7.5%."
        }
      ],
      "visual_description": "A two-panel diagram. Left panel: an investor puts ₹9,600 into a 'shares box'; the box outputs ₹1,200 per year; the return label reads '₹1,200 / ₹9,600 × 100 = 12.5%'. Right panel: a horizontal number line marked with two share options (A and B) and their return %s, with a trophy icon above the higher one. A note clarifies that the dividend rate (15%) exceeds the return % (12.5%) because the share was bought above par.",
      "svg_diagrams": [
        {
          "id": "return_yield_comparison",
          "title": "Annual Return % — how dividend rate and market price interact",
          "svg": "<svg viewBox='0 0 760 320' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='320' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>ANNUAL RETURN % — YIELD FORMULA</text><rect x='30' y='46' width='340' height='80' rx='10' fill='#EAF4FF' stroke='#1A73E8' stroke-width='2'/><text x='200' y='70' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1A73E8'>Annual Return %</text><text x='200' y='91' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1D1D1F'>= (Annual Income ÷ Investment) × 100</text><text x='200' y='113' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#555'>= (Dividend Rate × FV) ÷ MV</text><rect x='390' y='46' width='340' height='80' rx='10' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='560' y='70' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1B7A3E'>Special Case — At Par (MV = FV)</text><text x='560' y='91' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1D1D1F'>Return % = Dividend Rate %</text><text x='560' y='113' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#555'>They are equal only when MV = FV</text><rect x='30' y='150' width='700' height='54' rx='10' fill='#FFF8E1' stroke='#F9A825' stroke-width='2'/><text x='380' y='172' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#7A5200'>Above par (MV &gt; FV): Return % &lt; Dividend Rate%  — you pay more, yield drops</text><text x='380' y='194' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#7A5200'>Below par (MV &lt; FV): Return % &gt; Dividend Rate%  — you pay less, yield rises</text><rect x='90' y='224' width='560' height='60' rx='10' fill='#F3E5F5' stroke='#7B1FA2' stroke-width='2'/><text x='370' y='248' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#4A148C'>To compare two shares: compute Return % for each</text><text x='370' y='270' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#4A148C'>Higher Return % = better investment per rupee spent</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "The share with the higher dividend rate always gives the better return.",
          "why_students_fall_for_this": "The dividend rate is the most visible number in a shares problem, so it seems like the performance indicator.",
          "concrete_wrong_example": "Share A: 20% dividend on FV ₹100, MV ₹500 → return = (20 × 100)/500 = 4%. Share B: 10% dividend on FV ₹100, MV ₹200 → return = (10 × 100)/200 = 5%. B beats A despite half the dividend rate.",
          "correction": "Always compute annual return % = (rate × FV) / MV. Higher dividend rate with higher MV may yield less.",
          "how_to_spot_mid_problem": "Never conclude 'Share X is better' from the dividend rate alone — always calculate and compare return %."
        },
        {
          "wrong_idea": "Annual return % = dividend rate % (always).",
          "why_students_fall_for_this": "In textbook introductions, shares are sometimes presented at par, making the two equal. Students carry this assumption forward.",
          "concrete_wrong_example": "15% dividend, FV ₹100, MV ₹120 → return = (15 × 100)/120 = 12.5%, NOT 15%.",
          "correction": "Return % = dividend rate% only when MV = FV. In general, use (rate × FV) / MV.",
          "how_to_spot_mid_problem": "Check: is the share at par? If MV ≠ FV, the two percentages will differ."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Compact yield formula",
          "rule": "Return % = (Dividend rate × FV) / MV. No need to find income or shares; this works directly from the given data.",
          "example": "FV ₹10, MV ₹14, 14% dividend → return = (14 × 10) / 14 = 10%.",
          "when_to_use": "Whenever asked for return % or to compare two shares — fastest path."
        },
        {
          "shortcut": "Find MV from required return",
          "rule": "MV = (Dividend rate × FV) / Required return %. Rearrange the yield formula to find the market price that gives a target return.",
          "example": "FV ₹100, 8% dividend, required return 5% → MV = (8 × 100) / 5 = ₹160.",
          "when_to_use": "Reverse problems: 'At what market price gives a return of X%?'"
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "You need to find the annual return % or yield on a share investment.",
          "A problem asks you to compare two share options and decide which is better.",
          "You must find the market value at which a share should be bought to achieve a target return %.",
          "Any question that connects dividend rate with market value to assess investment quality."
        ],
        "use_other_methods_instead_when": [
          "Only the absolute annual income is required — use sub-topic 3.2 alone.",
          "The problem does not involve comparison or return % — the income formula suffices.",
          "Brokerage is charged — adjust investment to (MV + brokerage) per share before computing return % (sub-topic 3.4)."
        ]
      },
      "edge_cases": [
        {
          "case": "Both shares have the same face value",
          "value": "The comparison reduces to comparing (dividend rate / MV) for each share.",
          "reasoning": "With equal FVs the numerator factor FV is the same; only (rate/MV) differs between them.",
          "where_it_appears": "Standard comparison problems in Selina exercises."
        },
        {
          "case": "The problem asks 'at what price should shares be bought to earn the same return as a bank deposit of r%?'",
          "value": "Set return % = r and solve for MV: MV = (dividend rate × FV) / r.",
          "reasoning": "This is the standard 'find market value from required return' reverse problem.",
          "where_it_appears": "ICSE problems comparing shares with fixed-deposit interest rates."
        }
      ],
      "key_takeaway": "Annual return % (yield) = (annual income / investment) × 100 = (dividend rate × FV) / MV. It is the true per-rupee earning rate and the only fair basis for comparing two share investments. The dividend rate alone does not determine quality; a higher MV shrinks the return. Use the compact formula to compare shares quickly.",
      "video_script_hooks": {
        "video_target_length_seconds": 195,
        "opening_hook_5_sec": "Share A offers 20% dividend. Share B offers 10% dividend. Which one earns you more money? The answer is — it depends. Here is why.",
        "narrative_arc": "Hook (dividend rate is not the whole story) → return % defined → compact formula derived → at par special case → two shares compared → reverse: find MV from required return.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Two shares labelled '20%' and '10%'; a question mark between them."
          },
          {
            "timestamp_seconds": 45,
            "what_happens_on_screen": "Return % formula animation: income ÷ investment → compact: (rate × FV) ÷ MV."
          },
          {
            "timestamp_seconds": 100,
            "what_happens_on_screen": "Side-by-side calculation for Share A (20%, MV ₹500) and Share B (10%, MV ₹200): B wins."
          },
          {
            "timestamp_seconds": 155,
            "what_happens_on_screen": "Reverse rearrangement: MV = (rate × FV) / return% to find the 'right price'."
          },
          {
            "timestamp_seconds": 180,
            "what_happens_on_screen": "Closing card: 'Return % = (Dividend rate × FV) ÷ MV — the only number that matters.'"
          }
        ],
        "closing_takeaway_voiceover": "A high dividend rate is only impressive if you bought the share cheaply. Annual return % levels the playing field by measuring income relative to what you actually spent. That is the number to compare."
      }
    }
  },
  {
    "topicId": "icse_math10_ch3_share_problems",
    "chapterNumber": 3,
    "key_formulas": [
      {
        "formula": "Brokerage per share (buying) = (Brokerage rate / 100) × Market Value per share.",
        "explanation": "A brokerage charge is paid to the broker who arranges the purchase. It is a percentage of the market price paid on top of the share cost."
      },
      {
        "formula": "Effective buying price per share = MV + brokerage per share = MV × (1 + brokerage rate / 100).",
        "explanation": "The total cost of acquiring one share is market value plus brokerage. This effective price is what you divide into the investment to find the number of shares."
      },
      {
        "formula": "Effective selling price per share = MV − brokerage per share = MV × (1 − brokerage rate / 100).",
        "explanation": "When selling, brokerage is deducted from the proceeds. The net receipt per share is market value minus brokerage."
      },
      {
        "formula": "Number of shares (with brokerage) = Total investment ÷ Effective buying price per share.",
        "explanation": "With brokerage, you pay more per share (MV + brokerage), so you can afford fewer shares for the same investment."
      }
    ],
    "name": "Shares — Mixed Problems and Brokerage",
    "prerequisite_knowledge": [
      "Face value, market value, and par classifications — sub-topic 3.1.",
      "Dividend income calculation — sub-topic 3.2.",
      "Annual return % and yield — sub-topic 3.3.",
      "Percentage — finding a percentage of a money amount.",
      "Solving linear equations with one unknown."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Every real share transaction carries a broker's fee — a small percentage of the market price charged for facilitating the trade. When buying, brokerage adds to your cost; when selling, it reduces your proceeds. In all other respects, the dividend and return calculations work exactly as before. Brokerage problems are ordinary shares problems with one extra adjustment step at the beginning.",
        "hook": "You want to buy shares at ₹120 each, but your broker charges 2% brokerage. You do not pay ₹120 per share — you pay ₹120 + ₹2.40 = ₹122.40. Now your investment of ₹12,240 buys only 100 shares, not 102. And your annual return % is based on ₹12,240, not ₹12,000. A small brokerage makes a measurable difference.",
        "real_world_anchors": [
          "A stockbroker's contract note listing the share price and brokerage separately.",
          "An online brokerage platform charging 0.3% per transaction — even small fees reduce net proceeds.",
          "An investor selling shares at ₹200 but receiving only ₹196 per share after 2% brokerage.",
          "Financial advisors calculating 'cost of acquisition' to include all transaction costs."
        ],
        "the_pivot_idea": "Brokerage is charged on MARKET VALUE, not on face value. It changes the effective buying/selling price. Adjust this price first, then apply all the earlier formulas as usual.",
        "wrong_intuitions_to_replace": [
          "'Brokerage is charged on face value.' — Wrong. Brokerage is on market value (the transaction price).",
          "'Brokerage does not affect the number of shares I buy — only my profit.' — Wrong. Higher effective cost per share means fewer shares for the same investment.",
          "'Brokerage when selling adds to my proceeds.' — Wrong. When selling, brokerage is deducted from the proceeds you receive."
        ]
      },
      "derivation": {
        "starting_question": "With 2% brokerage, how does a ₹12,240 investment at MV ₹120 change compared to buying without brokerage?",
        "part_1_adjust_the_buying_price": {
          "claim": "Effective cost per share = MV + brokerage per share = MV + (2/100) × MV = MV × 1.02.",
          "reasoning": "The broker's fee is paid immediately on purchase and forms part of the true cost of each share. The investor bears this cost."
        },
        "part_2_count_shares_on_adjusted_price": {
          "claim": "Number of shares = investment ÷ (MV × (1 + brokerage/100)).",
          "reasoning": "Every rupee of investment must cover both the market price and the brokerage. Using MV alone overstates how many shares you can afford."
        },
        "part_3_return_uses_full_investment": {
          "claim": "Annual return % = (annual income / total investment including brokerage) × 100.",
          "reasoning": "The return on investment must account for all money spent to acquire the shares, including brokerage. Ignoring brokerage overstates the return.",
          "named_concept": "'All-in cost' — total money spent per share = MV + brokerage. This is the correct denominator for return calculations."
        }
      },
      "worked_example": [
        {
          "problem": "Divya invests ₹12,240 in shares of face value ₹100 at ₹120 each with 2% brokerage. The company pays 15% dividend. Find (i) effective cost per share, (ii) number of shares, (iii) annual income, (iv) annual return %.",
          "thought_process_before_starting": "Adjust for brokerage first to find effective cost; then find shares, income (on FV), return % (on total investment).",
          "steps": [
            {
              "step_number": 1,
              "action": "Find brokerage per share.",
              "computation": "(2/100) × ₹120 = ₹2.40 per share.",
              "reasoning": "Brokerage is 2% of market value."
            },
            {
              "step_number": 2,
              "action": "Find effective buying price per share.",
              "computation": "₹120 + ₹2.40 = ₹122.40.",
              "reasoning": "Total cost to acquire one share including the broker's fee."
            },
            {
              "step_number": 3,
              "action": "Find number of shares.",
              "computation": "Shares = 12,240 ÷ 122.40 = 100 shares.",
              "reasoning": "Divide investment by the full cost per share."
            },
            {
              "step_number": 4,
              "action": "Find annual income.",
              "computation": "Income = (15/100) × ₹100 × 100 = ₹1,500.",
              "reasoning": "Dividend on face value ₹100; market price and brokerage play no role in the dividend."
            },
            {
              "step_number": 5,
              "action": "Find annual return %.",
              "computation": "Return = (1,500 / 12,240) × 100 ≈ 12.25%.",
              "reasoning": "Total investment ₹12,240 includes brokerage; return is based on all money spent."
            }
          ],
          "answer": "(i) ₹122.40;  (ii) 100 shares;  (iii) Annual income = ₹1,500;  (iv) Return ≈ 12.25%."
        },
        {
          "problem": "Ram sells 80 shares of face value ₹10 at ₹25 each through a broker who charges 1% brokerage. What is his net sale proceeds?",
          "thought_process_before_starting": "When selling, brokerage is deducted from the proceeds. Find net selling price per share, then multiply by number of shares.",
          "steps": [
            {
              "step_number": 1,
              "action": "Find brokerage per share.",
              "computation": "(1/100) × ₹25 = ₹0.25 per share.",
              "reasoning": "Brokerage on market value ₹25."
            },
            {
              "step_number": 2,
              "action": "Find net selling price per share.",
              "computation": "₹25 − ₹0.25 = ₹24.75 per share.",
              "reasoning": "The broker deducts the fee before remitting proceeds to Ram."
            },
            {
              "step_number": 3,
              "action": "Find total net proceeds.",
              "computation": "₹24.75 × 80 = ₹1,980.",
              "reasoning": "Multiply net price by the number of shares sold."
            }
          ],
          "answer": "Ram's net sale proceeds = ₹1,980."
        }
      ],
      "visual_description": "A T-shaped diagram with two branches from a central 'transaction' node. The left branch (green, labelled 'BUYING') shows: Investment → ÷ (MV + brokerage) → Shares. The right branch (red, labelled 'SELLING') shows: Shares × (MV − brokerage) → Net proceeds. Below both branches, a note: 'Brokerage is always charged on MV — added when buying, deducted when selling.'",
      "svg_diagrams": [
        {
          "id": "brokerage_buy_sell_flow",
          "title": "Brokerage — buying vs selling adjustment",
          "svg": "<svg viewBox='0 0 760 310' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='310' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>BROKERAGE — BUY vs SELL</text><rect x='290' y='44' width='180' height='48' rx='10' fill='#F5F5F7' stroke='#1D1D1F' stroke-width='2'/><text x='380' y='63' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Market Value (MV)</text><text x='380' y='81' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#555'>transaction price</text><path d='M 310 92 L 200 140' stroke='#34C759' stroke-width='2.5'/><path d='M 450 92 L 560 140' stroke='#E53935' stroke-width='2.5'/><rect x='40' y='142' width='320' height='54' rx='10' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='200' y='163' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1B7A3E'>BUYING</text><text x='200' y='183' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#1D1D1F'>Effective cost = MV + brokerage</text><rect x='400' y='142' width='320' height='54' rx='10' fill='#FFF0F0' stroke='#E53935' stroke-width='2'/><text x='560' y='163' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#C62828'>SELLING</text><text x='560' y='183' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#1D1D1F'>Net proceeds = MV − brokerage</text><rect x='40' y='214' width='320' height='40' rx='8' fill='#F0FFF4'/><text x='200' y='239' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#1B7A3E'>Shares = Investment ÷ (MV + b)</text><rect x='400' y='214' width='320' height='40' rx='8' fill='#FFF5F5'/><text x='560' y='239' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#C62828'>Proceeds = Shares × (MV − b)</text><rect x='150' y='270' width='460' height='32' rx='8' fill='#FFF8E1' stroke='#F9A825' stroke-width='1.5'/><text x='380' y='291' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='600' fill='#7A5200'>Brokerage is always on MARKET VALUE — never on face value</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Brokerage is charged on face value.",
          "why_students_fall_for_this": "Face value is the number used for dividends, so students assume it is used everywhere.",
          "concrete_wrong_example": "FV ₹100, MV ₹150, 2% brokerage → wrong: brokerage = 2% of ₹100 = ₹2; correct: 2% of ₹150 = ₹3.",
          "correction": "Brokerage is a transaction fee on the actual trading price — which is always the market value.",
          "how_to_spot_mid_problem": "If your brokerage amount uses FV rather than MV in the calculation, correct it."
        },
        {
          "wrong_idea": "Brokerage when selling adds to the proceeds.",
          "why_students_fall_for_this": "Buying adds brokerage (increases cost), so students think selling also adds something.",
          "concrete_wrong_example": "Selling 100 shares at ₹200 with 1% brokerage → wrong: proceeds = ₹200 × 100 + ₹200 = ₹20,200; correct: ₹200 × 100 − ₹200 = ₹19,800.",
          "correction": "Brokerage is always a cost. When buying it inflates what you pay; when selling it deflates what you receive.",
          "how_to_spot_mid_problem": "Net selling proceeds should always be less than gross (MV × shares). If they are more, you have added instead of subtracted."
        },
        {
          "wrong_idea": "Annual return % is the same whether or not brokerage is charged.",
          "why_students_fall_for_this": "Students compute income correctly but forget to increase the investment denominator by the brokerage paid.",
          "concrete_wrong_example": "Investment ₹12,240 including brokerage but using ₹12,000 as the denominator → overstated return %.",
          "correction": "Return % = (income / total money spent) × 100. Total money spent includes brokerage.",
          "how_to_spot_mid_problem": "The denominator for return % must be the actual investment (including brokerage), not MV × shares."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Effective price in one step",
          "rule": "Buying: effective price = MV × (1 + b/100). Selling: net price = MV × (1 − b/100). Multiply by number of shares for totals.",
          "example": "MV ₹120, b = 2%: buying price = 120 × 1.02 = ₹122.40; selling price = 120 × 0.98 = ₹117.60.",
          "when_to_use": "Any time brokerage is mentioned — this keeps the arithmetic clean."
        },
        {
          "shortcut": "Dividend is unaffected by brokerage",
          "rule": "Brokerage changes how much you pay (investment), but NOT the dividend received (which is rate% × FV). Only the return % changes.",
          "example": "With or without brokerage, 15% dividend on FV ₹100 gives ₹15 per share. Brokerage only changes the denominator (investment) in the return % formula.",
          "when_to_use": "Always remember this when a problem asks for income AND return separately."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "The problem mentions a brokerage charge, commission, or transaction fee.",
          "You need to find the effective cost of buying shares through a broker.",
          "You are selling shares and need the net proceeds after brokerage.",
          "Return % must include all money spent, not just the bare share price."
        ],
        "use_other_methods_instead_when": [
          "No brokerage is mentioned — use sub-topics 3.1–3.3 directly.",
          "The problem is about dividends only (no buying/selling transaction) — brokerage never affects dividends."
        ]
      },
      "edge_cases": [
        {
          "case": "Both buying and selling brokerage are charged in the same problem",
          "value": "Compute effective buying price (MV_buy + brokerage) and net selling price (MV_sell − brokerage) separately; profit = net selling proceeds − total buying cost.",
          "reasoning": "Brokerage is charged on both transactions. Forgetting either one will give the wrong profit.",
          "where_it_appears": "Problems asking for profit or loss on a share transaction with stated buy and sell market values."
        },
        {
          "case": "Investment is given and brokerage is included — find number of shares",
          "value": "Divide total investment by effective buying price per share. If the investment already includes brokerage (i.e., it is the total outlay), do not add brokerage again.",
          "reasoning": "Read the problem carefully: 'invested ₹12,240 in total' vs 'has ₹12,000 and brokerage is 2%' are different scenarios.",
          "where_it_appears": "Problems where the wording is ambiguous about whether the stated sum includes or excludes brokerage."
        }
      ],
      "key_takeaway": "Brokerage is a percentage charge on market value. When buying shares, effective cost = MV + brokerage; when selling, net proceeds = MV − brokerage. Dividend income is unaffected by brokerage — it remains (rate/100) × FV × shares. Annual return % uses total investment (including brokerage) as the denominator. Adjust the effective price first, then apply all earlier formulas as usual.",
      "video_script_hooks": {
        "video_target_length_seconds": 200,
        "opening_hook_5_sec": "You budgeted ₹12,000 for shares at ₹120 each — so 100 shares, right? Add 2% brokerage and you can only afford... let's find out.",
        "narrative_arc": "Hook (brokerage reduces shares) → brokerage defined → effective buying price → shares from adjusted price → dividend unchanged → return on full investment → selling with brokerage → profit/loss.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Calculator showing 12,000 ÷ 120 = 100, then brokerage added making it 12,000 ÷ 122.40 ≈ 98."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "T-diagram: buying (MV + b) on the left, selling (MV − b) on the right."
          },
          {
            "timestamp_seconds": 100,
            "what_happens_on_screen": "Dividend formula stays unchanged — brokerage does not touch ₹15/share."
          },
          {
            "timestamp_seconds": 150,
            "what_happens_on_screen": "Return % denominator = ₹12,240 (total spent), not ₹12,000."
          },
          {
            "timestamp_seconds": 180,
            "what_happens_on_screen": "Closing card: 'Adjust price first. Then income, return — as before.'"
          }
        ],
        "closing_takeaway_voiceover": "Brokerage is just one extra step: add it when buying to get the true cost per share, subtract it when selling to get the true net proceeds. Everything else — dividends, return %, comparison — works exactly as it did without brokerage."
      }
    }
  },
  {
    "topicId": "icse_math10_ch3_shares_basics",
    "chapterNumber": 3,
    "key_formulas": [
      {
        "formula": "Face Value (FV) = the nominal value printed on the share certificate — typically ₹10 or ₹100.",
        "explanation": "Face value is fixed by the company when it issues shares; it does NOT change with market conditions and is the base for all dividend calculations."
      },
      {
        "formula": "Market Value (MV) = the price at which one share is currently bought or sold on the stock market.",
        "explanation": "Market value fluctuates with investor sentiment and company performance. When you invest in shares, you pay the market value — not the face value."
      },
      {
        "formula": "At par: MV = FV.  Above par (at premium): MV > FV.  Below par (at discount): MV < FV.",
        "explanation": "These three terms classify whether the share is trading at, above, or below its face value. They appear constantly in ICSE word problems and must be decoded before any calculation."
      },
      {
        "formula": "Number of shares purchased = Total investment ÷ Market Value per share.",
        "explanation": "You buy shares at market price, so divide the investment by MV to find how many shares you obtain."
      },
      {
        "formula": "Total Face Value of investment = Number of shares × Face Value per share.",
        "explanation": "Even though you paid at market price, dividends are always calculated on face value. Total FV is therefore the 'dividend base' of the whole investment."
      }
    ],
    "name": "Shares — Face Value, Market Value and Par",
    "prerequisite_knowledge": [
      "Percentage — finding a percentage of an amount.",
      "Division of money — dividing a sum of money to count how many units fit.",
      "The idea of a company and what it means to own a small part of one.",
      "Addition and subtraction of money amounts in rupees.",
      "Terms 'nominal' (face) and 'market' as applied to prices."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A share is a tiny slice of a company that you can buy and sell. The company sets a 'face value' — the official denomination — but the real world sets a 'market value' — the current price. You pay market value to buy; the company pays you dividends based on face value. Knowing the difference between these two values unlocks every shares problem.",
        "hook": "Imagine a school issues 100 tokens (shares), each stamped '₹10 face value'. Later, the school becomes famous and everyone wants a token — so they trade at ₹30 each. You still receive the benefit the school originally promised per token (dividend on ₹10). But to own a token, you now pay ₹30. That's market value vs face value in a nutshell.",
        "real_world_anchors": [
          "Tata Consultancy Services shares have face value ₹1, but the market value is in the thousands of rupees.",
          "A company offering IPO shares 'at par' means the shares are priced at exactly their face value.",
          "A struggling company's shares may trade 'below par' if investors have lost confidence.",
          "The stock market ticker showing current prices — those are market values, not face values."
        ],
        "the_pivot_idea": "The fundamental split: you invest money at MARKET VALUE (to count how many shares you own), but dividends are ALWAYS calculated on FACE VALUE. These two numbers are almost never equal, so you must use the right one for the right calculation.",
        "wrong_intuitions_to_replace": [
          "'I paid ₹150 per share, so I own ₹150 of face value per share.' — Wrong. If the face value is ₹10, you own ₹10 of face value regardless of what you paid.",
          "'At premium means the share is very expensive.' — Not necessarily. It only means MV > FV; a share with FV ₹10 trading at ₹11 is 'at premium', though modestly.",
          "'Number of shares = investment ÷ face value.' — Wrong. You buy at MARKET VALUE, not face value."
        ]
      },
      "derivation": {
        "starting_question": "If I have ₹13,500 to invest in shares with face value ₹100 and market value ₹135, how many shares do I get — and what is my total face-value stake?",
        "part_1_market_value_is_what_you_pay": {
          "claim": "Buying shares costs market value per share, not face value.",
          "reasoning": "The stock market is where transactions happen. The seller demands the current market price. You hand over market value per share to receive ownership."
        },
        "part_2_face_value_is_constant": {
          "claim": "Face value stays fixed at the printed amount — ₹10 or ₹100 — regardless of market movement.",
          "reasoning": "Face value is a corporate accounting convention set at company formation. The market's opinion of the company does not change the denomination printed on the certificate."
        },
        "part_3_two_separate_calculations": {
          "claim": "To find the number of shares, divide investment by MV. To find total face value of those shares, multiply number of shares by FV.",
          "reasoning": "These two steps use two different per-share amounts. Mixing them up is the most common error in this chapter.",
          "named_concept": "The 'MV vs FV duality' — what you pay (MV) vs the base for dividends (FV)."
        }
      },
      "worked_example": [
        {
          "problem": "Arun invests ₹13,500 in shares of face value ₹100 available at ₹135 (above par). Find (i) the number of shares he buys, and (ii) the total face value of his holding.",
          "thought_process_before_starting": "Two separate questions — first count shares (use MV), then find nominal stake (use FV). Keep the two values distinct throughout.",
          "steps": [
            {
              "step_number": 1,
              "action": "Identify face value and market value.",
              "computation": "FV = ₹100; MV = ₹135 (above par because 135 > 100).",
              "reasoning": "Classifying as 'above par' confirms we have not confused the two values."
            },
            {
              "step_number": 2,
              "action": "Find the number of shares.",
              "computation": "Number of shares = Investment ÷ MV = 13,500 ÷ 135 = 100 shares.",
              "reasoning": "You pay MV per share in the market."
            },
            {
              "step_number": 3,
              "action": "Find the total face value.",
              "computation": "Total FV = 100 × ₹100 = ₹10,000.",
              "reasoning": "Each share carries FV ₹100; 100 shares carry ₹10,000 nominal value. Though he paid ₹13,500, his dividend base is ₹10,000."
            }
          ],
          "answer": "(i) 100 shares;  (ii) Total face value = ₹10,000."
        },
        {
          "problem": "A company's shares have face value ₹10 and are trading at a discount of ₹2. How much must Seema invest to own 200 shares?",
          "thought_process_before_starting": "'At a discount of ₹2' means MV = FV − ₹2. Once MV is found, investment = MV × number of shares.",
          "steps": [
            {
              "step_number": 1,
              "action": "Find the market value.",
              "computation": "MV = FV − discount = 10 − 2 = ₹8 per share.",
              "reasoning": "Below par means MV < FV. Here the share trades ₹2 below its face value."
            },
            {
              "step_number": 2,
              "action": "Find the total investment.",
              "computation": "Investment = MV × number of shares = 8 × 200 = ₹1,600.",
              "reasoning": "She buys 200 shares at the current market price of ₹8 each."
            }
          ],
          "answer": "Seema must invest ₹1,600."
        }
      ],
      "visual_description": "A side-by-side comparison diagram with two columns: 'Face Value' (left, 'printed on certificate — fixed') and 'Market Value' (right, 'stock market price — changes daily'). Three rows show: a green equals sign for 'at par', a blue upward arrow for 'above par / at premium', and a red downward arrow for 'below par / at discount'. Below, two calculation boxes: 'Number of shares = Investment ÷ MV' and 'Total Face Value = Shares × FV'.",
      "svg_diagrams": [
        {
          "id": "shares_fv_mv_comparison",
          "title": "Face Value vs Market Value — the three par scenarios",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='28' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>FACE VALUE vs MARKET VALUE</text><rect x='40' y='44' width='200' height='60' rx='10' fill='#E8F0FE' stroke='#1A73E8' stroke-width='2'/><text x='140' y='70' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1A73E8'>FACE VALUE (FV)</text><text x='140' y='90' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#444'>Printed on certificate — fixed</text><rect x='520' y='44' width='200' height='60' rx='10' fill='#FFF3E0' stroke='#E65100' stroke-width='2'/><text x='620' y='70' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#E65100'>MARKET VALUE (MV)</text><text x='620' y='90' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#444'>Stock exchange price — changes</text><rect x='30' y='128' width='700' height='42' rx='8' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='154' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1B7A3E'>AT PAR — MV = FV (e.g. FV ₹100, MV ₹100)</text><rect x='30' y='180' width='700' height='42' rx='8' fill='#EAF4FF' stroke='#1A73E8' stroke-width='2'/><text x='380' y='206' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1A73E8'>ABOVE PAR (PREMIUM) — MV &gt; FV (e.g. FV ₹100, MV ₹135)</text><rect x='30' y='232' width='700' height='42' rx='8' fill='#FFF0F0' stroke='#E53935' stroke-width='2'/><text x='380' y='258' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#C62828'>BELOW PAR (DISCOUNT) — MV &lt; FV (e.g. FV ₹100, MV ₹80)</text><rect x='60' y='294' width='280' height='46' rx='10' fill='#F3E5F5' stroke='#7B1FA2' stroke-width='2'/><text x='200' y='318' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#4A148C'>No. of shares = Investment ÷ MV</text><text x='200' y='333' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#4A148C'>(pay MARKET price to buy)</text><rect x='420' y='294' width='280' height='46' rx='10' fill='#FFF8E1' stroke='#F9A825' stroke-width='2'/><text x='560' y='318' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#7A5200'>Total FV = Shares × FV</text><text x='560' y='333' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#7A5200'>(dividend base uses FACE value)</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Number of shares = Investment ÷ Face Value.",
          "why_students_fall_for_this": "Face value is mentioned first in most problems, and students use whichever number appears first.",
          "concrete_wrong_example": "Investment ₹13,500, FV ₹100, MV ₹135 → wrong answer 13,500 ÷ 100 = 135 shares instead of 100.",
          "correction": "You BUY in the market at MARKET VALUE. Number of shares = Investment ÷ MV.",
          "how_to_spot_mid_problem": "If your number of shares × MV does not equal the original investment, you used the wrong denominator."
        },
        {
          "wrong_idea": "'At a premium of ₹25' means the share costs ₹25.",
          "why_students_fall_for_this": "Students read 'premium ₹25' as the price, not as the extra amount above face value.",
          "concrete_wrong_example": "FV ₹100, premium ₹25 → wrongly taking MV = ₹25 instead of MV = 100 + 25 = ₹125.",
          "correction": "Premium (or discount) is the DIFFERENCE from face value. MV = FV + premium, or MV = FV − discount.",
          "how_to_spot_mid_problem": "If MV < FV after adding a 'premium', the arithmetic is backwards."
        },
        {
          "wrong_idea": "Face value changes when the market price changes.",
          "why_students_fall_for_this": "Students conflate the two prices because both describe the same share.",
          "concrete_wrong_example": "Recalculating FV as the 'current price' or updating it every time MV changes.",
          "correction": "FV is fixed by the company charter and printed on the certificate. It never changes regardless of market movements.",
          "how_to_spot_mid_problem": "If your calculation requires a 'new face value', you are using the wrong concept."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Decode the par phrase first",
          "rule": "Before any calculation extract MV: 'at ₹X above par' → MV = FV + X; 'at ₹X below par' → MV = FV − X; 'at par' → MV = FV.",
          "example": "FV ₹10, 'at a premium of ₹4' → MV = ₹14. FV ₹100, 'at a discount of ₹15' → MV = ₹85.",
          "when_to_use": "Every shares problem — always start here."
        },
        {
          "shortcut": "Two-step buy verification",
          "rule": "Number of shares × MV must equal total investment (no brokerage). Use this as a quick sanity check.",
          "example": "100 shares × ₹135 = ₹13,500 ✓.",
          "when_to_use": "After computing the number of shares."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "You need to find how many shares an investor can buy with a given sum.",
          "A problem mentions 'above par', 'below par', 'at a premium', or 'at a discount'.",
          "You must find the 'total face value' or 'nominal value' of a shareholding.",
          "The first step in any dividend / annual income problem — always establish shares and FV first."
        ],
        "use_other_methods_instead_when": [
          "The number of shares is already given — proceed to the dividend calculation (sub-topic 3.2).",
          "You need the annual return % — see sub-topic 3.3.",
          "Brokerage is involved — adjust MV before counting shares (sub-topic 3.4)."
        ]
      },
      "edge_cases": [
        {
          "case": "Investment does not divide evenly by MV",
          "value": "Take the floor (whole number of shares); the leftover is uninvested cash.",
          "reasoning": "You cannot buy a fraction of a share; the remainder stays as cash.",
          "where_it_appears": "Problems where the investment is not a perfect multiple of the market value."
        },
        {
          "case": "Face value is ₹10 vs ₹100",
          "value": "₹10 FV shares pay dividends on ₹10 each; ₹100 FV shares pay on ₹100 each. Never confuse them.",
          "reasoning": "The FV denomination determines the per-share dividend. Two shares with different FVs but the same dividend rate pay different amounts.",
          "where_it_appears": "Comparison problems involving two companies with different face values."
        }
      ],
      "key_takeaway": "Face value is the company-fixed nominal denomination used to calculate dividends — it never changes. Market value is the real-world price you pay to buy a share — it fluctuates daily. Use MV to count shares bought; use FV to compute dividends. 'At par', 'above par', and 'below par' simply classify the relationship between MV and FV.",
      "video_script_hooks": {
        "video_target_length_seconds": 180,
        "opening_hook_5_sec": "Same share certificate, two prices. One never changes — the other changes every second. Which is which, and which one do you pay?",
        "narrative_arc": "Hook (two prices for the same share) → face value: fixed denomination → market value: real buying price → three par scenarios → two formulas (buy at MV, earn on FV) → worked example.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "A share certificate with '₹100 Face Value' stamped on it, beside a stock ticker scrolling ₹135."
          },
          {
            "timestamp_seconds": 35,
            "what_happens_on_screen": "The ₹100 badge stays fixed while the ticker number changes — FV is immovable."
          },
          {
            "timestamp_seconds": 80,
            "what_happens_on_screen": "Three colour-coded rows: 'at par' (green =), 'above par' (blue ↑), 'below par' (red ↓)."
          },
          {
            "timestamp_seconds": 130,
            "what_happens_on_screen": "Two formula boxes: 'Shares = investment ÷ MV' and 'Dividend base = Shares × FV'."
          },
          {
            "timestamp_seconds": 160,
            "what_happens_on_screen": "Closing card: 'Buy at Market Value. Earn dividends on Face Value.'"
          }
        ],
        "closing_takeaway_voiceover": "When you're buying shares, the market price is what you pay. But the company calculates your dividends on face value alone. Keep the two values separate and every shares problem in this chapter becomes straightforward."
      }
    }
  },
  {
    "topicId": "icse_math10_ch4_ineq_basics",
    "chapterNumber": 4,
    "key_formulas": [
      {
        "formula": "Symbols: a < b (a less than b),  a > b (a greater than b),  a ≤ b (a less than OR equal to b),  a ≥ b (a greater than OR equal to b).",
        "explanation": "These four symbols replace the '=' of an equation. On the number line, a < b means a is to the LEFT of b; a > b means a is to the RIGHT of b."
      },
      {
        "formula": "Addition/Subtraction Property: if a < b, then a + c < b + c  and  a − c < b − c  for ANY value of c.",
        "explanation": "Adding or subtracting the same number on both sides leaves the direction of the inequality unchanged — exactly like equations."
      },
      {
        "formula": "Multiplication/Division by POSITIVE: if a < b and c > 0, then ac < bc  and  a/c < b/c.",
        "explanation": "Multiplying or dividing both sides by a POSITIVE number preserves the direction of the inequality."
      },
      {
        "formula": "Multiplication/Division by NEGATIVE: if a < b and c < 0, then ac > bc  and  a/c > b/c.  THE SIGN REVERSES.",
        "explanation": "Multiplying or dividing both sides by a NEGATIVE number REVERSES the inequality direction. This is the single most important rule in this chapter and the source of almost every error."
      }
    ],
    "name": "Linear Inequations — Symbols and Properties",
    "prerequisite_knowledge": [
      "Solving linear equations in one variable — transposition and simplification.",
      "The number line — understanding that numbers to the right are larger.",
      "Positive and negative numbers — their relative sizes.",
      "Basic algebra — collecting like terms, expanding brackets.",
      "The meaning of 'equal to' (=) as distinct from 'greater than' or 'less than'."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "An inequation is a statement that two expressions are not equal but one is larger than the other. Solving an inequation finds all values that make the statement true — usually infinitely many, unlike an equation which typically has one answer. Almost everything works like an equation, except one critical rule: dividing or multiplying by a negative number flips the inequality sign.",
        "hook": "You know 2 < 8. Multiply both sides by 3: 6 < 24. ✓ Still true. Now multiply both sides by −3: −6 < −24? No — that is FALSE. −6 is to the RIGHT of −24 on the number line. The correct statement is −6 > −24. The sign had to flip. That one rule is the entire difference between equations and inequations.",
        "real_world_anchors": [
          "A speed limit sign: v ≤ 60 km/h means any speed up to 60 is legal — an infinite set of values.",
          "A minimum age restriction: age ≥ 18 — everyone 18 or older qualifies.",
          "A budget constraint: expenditure < ₹5,000 — all spending below ₹5,000 is acceptable.",
          "A temperature range for a medicine: store at 2°C ≤ T ≤ 8°C — a specific interval of safe temperatures."
        ],
        "the_pivot_idea": "An inequation has INFINITELY MANY solutions (a whole interval, not just one number). And unlike equations, there is one trap: multiplying or dividing both sides by a NEGATIVE number reverses the direction of the inequality. Every other rule is identical to equation-solving.",
        "wrong_intuitions_to_replace": [
          "'−2x > 6 means x > −3.' — Wrong. Dividing both sides by −2 REVERSES the sign: x < −3.",
          "'Adding a negative number reverses the inequality.' — Wrong. ADDING any number (positive or negative) never reverses the inequality. Only MULTIPLYING or DIVIDING by a negative number does.",
          "'An inequation has exactly one solution like an equation.' — Wrong. An inequation typically has infinitely many solutions forming an interval or a ray on the number line."
        ]
      },
      "derivation": {
        "starting_question": "Why does multiplying by a negative number reverse the inequality?",
        "part_1_the_number_line_reason": {
          "claim": "Multiplying by −1 reflects every number across zero on the number line, swapping left and right.",
          "reasoning": "If a is to the left of b (a < b), then −a is to the right of −b. Reflection swaps the 'which is bigger' relationship. So a < b becomes −a > −b."
        },
        "part_2_generalises_to_any_negative": {
          "claim": "Multiplying by any negative c = −|c| is the same as multiplying by |c| then multiplying by −1.",
          "reasoning": "Multiplying by |c| (positive) scales the distance but preserves the order. Multiplying by −1 then reflects, reversing the order. Both steps together: order is reversed."
        },
        "part_3_addition_never_reverses": {
          "claim": "Adding any constant shifts BOTH sides equally, so their relative order cannot change.",
          "reasoning": "If a < b, adding c to both sides gives a + c and b + c. The gap between them is still b − a > 0. Shifting does not change which is bigger.",
          "named_concept": "The 'sign-flip rule' — the one rule that separates inequation-solving from equation-solving."
        }
      },
      "worked_example": [
        {
          "problem": "Verify each step: (a) 3 < 7; add 5 to both sides. (b) 3 < 7; subtract 10. (c) 3 < 7; multiply by 4. (d) 3 < 7; multiply by −4.",
          "thought_process_before_starting": "Apply each property in turn and check whether the inequality sign is preserved or reversed.",
          "steps": [
            {
              "step_number": 1,
              "action": "(a) Add 5.",
              "computation": "3 + 5 = 8;  7 + 5 = 12.  8 < 12. ✓",
              "reasoning": "Adding a positive constant — inequality preserved."
            },
            {
              "step_number": 2,
              "action": "(b) Subtract 10.",
              "computation": "3 − 10 = −7;  7 − 10 = −3.  −7 < −3. ✓",
              "reasoning": "Subtracting 10 shifts both left; −7 is still to the left of −3."
            },
            {
              "step_number": 3,
              "action": "(c) Multiply by 4.",
              "computation": "3 × 4 = 12;  7 × 4 = 28.  12 < 28. ✓",
              "reasoning": "Positive multiplier — inequality preserved."
            },
            {
              "step_number": 4,
              "action": "(d) Multiply by −4.",
              "computation": "3 × (−4) = −12;  7 × (−4) = −28.  −12 > −28. ✓",
              "reasoning": "Negative multiplier — inequality REVERSES. −12 is to the right of −28."
            }
          ],
          "answer": "(a) 8 < 12 ✓  (b) −7 < −3 ✓  (c) 12 < 28 ✓  (d) −12 > −28 ✓ (sign reversed)."
        },
        {
          "problem": "Identify the WRONG step: Starting from −5 < 3, a student writes: '−5 × (−2) < 3 × (−2), so 10 < −6.' Is she right?",
          "thought_process_before_starting": "Multiplying by −2 is multiplication by a negative — the sign must reverse.",
          "steps": [
            {
              "step_number": 1,
              "action": "Check: −5 < 3 is the starting inequality.",
              "computation": "TRUE. −5 is to the left of 3 on the number line.",
              "reasoning": "The starting point is correct."
            },
            {
              "step_number": 2,
              "action": "Multiply both sides by −2.",
              "computation": "(−5)(−2) = 10;  3 × (−2) = −6.  Correct values but wrong sign: should be 10 > −6.",
              "reasoning": "Multiplying by −2 (negative) reverses the inequality. The student kept < instead of writing >."
            }
          ],
          "answer": "The student's error: she multiplied by a negative number but did not reverse the inequality. Correct result: 10 > −6."
        }
      ],
      "visual_description": "A three-row property table. Row 1 (green): '+c or −c to both sides → inequality direction UNCHANGED'. Row 2 (blue): '×c or ÷c with c > 0 → direction UNCHANGED'. Row 3 (red, enlarged): '×c or ÷c with c < 0 → direction REVERSES ⟵ THE KEY RULE'. Below the table, a number-line illustration showing 3 < 7 and its reflection under ×(−1) giving −3 > −7.",
      "svg_diagrams": [
        {
          "id": "inequation_properties_table",
          "title": "Properties of Inequalities — when does the sign flip?",
          "svg": "<svg viewBox='0 0 760 320' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='320' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>PROPERTIES OF INEQUALITIES</text><rect x='30' y='42' width='700' height='52' rx='8' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='64' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1B7A3E'>ADD or SUBTRACT any number → inequality direction PRESERVED</text><text x='380' y='84' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#444'>If 3 &lt; 7, then 3 + 5 &lt; 7 + 5  i.e. 8 &lt; 12 ✓   and   3 − 10 &lt; 7 − 10  i.e. −7 &lt; −3 ✓</text><rect x='30' y='104' width='700' height='52' rx='8' fill='#EAF4FF' stroke='#1A73E8' stroke-width='2'/><text x='380' y='126' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1A73E8'>MULTIPLY or DIVIDE by POSITIVE number → direction PRESERVED</text><text x='380' y='146' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#444'>If 3 &lt; 7, then 3 × 4 &lt; 7 × 4  i.e. 12 &lt; 28 ✓   and   3 ÷ 3 &lt; 7 ÷ 3  i.e. 1 &lt; 2.33 ✓</text><rect x='30' y='166' width='700' height='60' rx='8' fill='#FFF0F0' stroke='#E53935' stroke-width='3'/><text x='380' y='190' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#C62828'>⚠  MULTIPLY or DIVIDE by NEGATIVE number → direction REVERSES  ⚠</text><text x='380' y='214' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#C62828'>If 3 &lt; 7, then 3 × (−4) &gt; 7 × (−4)  i.e. −12 &gt; −28 ✓   and   −6 &lt; −2, but −6÷(−2) &gt; −2÷(−2)  i.e. 3 &gt; 1 ✓</text><line x1='50' y1='250' x2='710' y2='250' stroke='#1D1D1F' stroke-width='1.5'/><text x='380' y='248' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#86868B'>NUMBER LINE</text><circle cx='220' cy='270' r='5' fill='#1A73E8'/><text x='220' y='290' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#1A73E8'>3</text><circle cx='380' cy='270' r='5' fill='#1A73E8'/><text x='380' y='290' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#1A73E8'>7</text><text x='300' y='265' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#1A73E8'>&lt;</text><circle cx='430' cy='295' r='5' fill='#C62828'/><text x='430' y='312' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#C62828'>−12</text><circle cx='540' cy='295' r='5' fill='#C62828'/><text x='540' y='312' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#C62828'>−28</text><text x='485' y='290' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#C62828'>&gt;</text><text x='300' y='306' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#86868B'>×(−4) →</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Adding a negative number reverses the inequality.",
          "why_students_fall_for_this": "Students confuse 'negative number' with 'multiplying by a negative number'. Adding is always safe.",
          "concrete_wrong_example": "3 < 7; add −5 to both sides → −2 < 2. Some students flip to −2 > 2. Wrong — addition never flips.",
          "correction": "Only MULTIPLICATION or DIVISION by a negative flips the sign. Addition and subtraction (even of negative numbers) never do.",
          "how_to_spot_mid_problem": "If you see a step 'add … to both sides' and the sign changed, that is an error."
        },
        {
          "wrong_idea": "−2x > 6 means x > −3 (forgetting to flip when dividing by −2).",
          "why_students_fall_for_this": "Students copy the equation-solving habit of 'divide both sides by the coefficient' without thinking about the sign.",
          "concrete_wrong_example": "−2x > 6 → x > 6/(−2) → x > −3 (WRONG). Correct: divide by −2 and flip → x < −3.",
          "correction": "When dividing by a negative coefficient, always reverse the inequality.",
          "how_to_spot_mid_problem": "Before dividing or multiplying, ask 'is the coefficient negative?' If yes, flip the sign after the operation."
        },
        {
          "wrong_idea": "The solution of an inequation is a single value.",
          "why_students_fall_for_this": "Equations have one solution, so students expect inequations to also have one.",
          "concrete_wrong_example": "Solving 2x < 8 and writing 'x = 4' instead of 'x < 4'.",
          "correction": "An inequation's solution is a SET of values (usually an infinite set). Write x < 4, not x = 4.",
          "how_to_spot_mid_problem": "If your answer to an inequation is a single number, you have treated it as an equation."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "The negative-coefficient check",
          "rule": "Before every divide/multiply step, ask: 'is my divisor/multiplier negative?' If YES, flip the inequality sign immediately after the operation.",
          "example": "−3x ≥ 12 → (divide by −3, negative, so flip) → x ≤ −4.",
          "when_to_use": "Every time you divide or multiply both sides to isolate x."
        },
        {
          "shortcut": "Bring x to the positive side",
          "rule": "If x ends up with a negative coefficient, consider rearranging so x is on the side where its coefficient is positive, then divide by a positive number — no sign flip needed.",
          "example": "−2x > 6: instead of dividing by −2, rearrange → 0 > 6 + 2x → −6 > 2x → x < −3. Same answer, positive divisor.",
          "when_to_use": "Whenever you want to avoid the sign-flip rule entirely."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "Any problem involving an inequality or a range of values (min/max constraints).",
          "Before solving any inequation — always identify whether any step involves multiplying or dividing by a negative.",
          "When checking whether a particular value satisfies an inequation."
        ],
        "use_other_methods_instead_when": [
          "The problem is an equation (= sign) — use standard linear equation methods.",
          "The inequality involves two variables — use graphical methods (not covered in Class 10 Ch4)."
        ]
      },
      "edge_cases": [
        {
          "case": "Dividing by zero",
          "value": "Never divide by zero. If the coefficient of x becomes zero after simplification, the inequation either has all real numbers as solution or no solution.",
          "reasoning": "Division by zero is undefined. If you arrive at 0·x > 5, that is false for all x (no solution). If 0·x < 5, that is true for all x.",
          "where_it_appears": "Edge-case problems designed to test understanding of the degenerate case."
        },
        {
          "case": "Both sides are expressions in x — moving terms",
          "value": "Transpose x-terms to one side exactly as in equations; then check the final division step for a negative coefficient.",
          "reasoning": "Terms can be moved across the inequality sign using addition/subtraction (safe), leaving a pure coefficient × x on one side for the final divide.",
          "where_it_appears": "Inequations of the form 3x − 2 > x + 4 requiring collection of x-terms."
        }
      ],
      "key_takeaway": "Inequation-solving is identical to equation-solving with ONE extra rule: whenever you multiply or divide both sides by a NEGATIVE number, the inequality sign REVERSES direction. Addition and subtraction — of any number, positive or negative — never change the direction. Keep this rule in mind on every step that involves a multiplication or division.",
      "video_script_hooks": {
        "video_target_length_seconds": 185,
        "opening_hook_5_sec": "3 < 7. Multiply both sides by −1 and you get −3 < −7? Open a number line and check. The answer will surprise you.",
        "narrative_arc": "Hook (check 3 < 7 × −1 on number line) → four symbols → add/subtract never flips → multiply/divide positive never flips → multiply/divide negative ALWAYS flips → the number-line reason → spot-the-error example.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Number line showing 3 < 7; both multiply by −1 to get −3 and −7; −3 is to the RIGHT of −7."
          },
          {
            "timestamp_seconds": 50,
            "what_happens_on_screen": "Property table with three rows — green (add), blue (multiply positive), red REVERSES (multiply negative)."
          },
          {
            "timestamp_seconds": 110,
            "what_happens_on_screen": "Reflection animation: mirroring 3 and 7 over zero gives −3 and −7, swapping their left-right order."
          },
          {
            "timestamp_seconds": 155,
            "what_happens_on_screen": "Error spotting: −2x > 6 → student writes x > −3; red X appears; correct x < −3 shown."
          },
          {
            "timestamp_seconds": 175,
            "what_happens_on_screen": "Closing card: 'Multiply/divide by negative → FLIP the sign. Everything else — same as equations.'"
          }
        ],
        "closing_takeaway_voiceover": "Inequations are equations with one twist. Add, subtract — no worry. Multiply or divide — check the sign. Negative means flip. That is the entire chapter in one sentence."
      }
    }
  },
  {
    "topicId": "icse_math10_ch4_ineq_combined",
    "chapterNumber": 4,
    "key_formulas": [
      {
        "formula": "Combined inequation: a ≤ f(x) ≤ b  means BOTH  a ≤ f(x)  AND  f(x) ≤ b  simultaneously.",
        "explanation": "Split into two separate inequations and solve each. The solution is the intersection — values satisfying BOTH."
      },
      {
        "formula": "Split method: a ≤ f(x) ≤ b → (i) a ≤ f(x) gives x ≥ p; (ii) f(x) ≤ b gives x ≤ q. Intersection: p ≤ x ≤ q.",
        "explanation": "Each part is solved independently. The final answer is the overlap of the two solution sets."
      },
      {
        "formula": "Simultaneous inequation (written as two separate lines): solve each inequality for x, then find the intersection of the two solution sets by marking both on the same number line.",
        "explanation": "Two separate inequations (e.g. 3x − 2 ≥ 4  AND  x + 6 < 14) are each solved and the overlap plotted on the number line."
      }
    ],
    "name": "Linear Inequations — Combined (Compound) Inequations",
    "prerequisite_knowledge": [
      "Solving single linear inequations — sub-topic 4.2.",
      "Number line and solution sets — sub-topic 4.3.",
      "Intersection of sets — the set of values common to both solution sets.",
      "Domain filtering (N, Z, R) — sub-topic 4.3.",
      "Listing integers in a range — e.g. integers from −2 to 5 inclusive."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A combined inequation gives both a lower bound and an upper bound on x at the same time. Splitting it into two parts, solving each, and taking the overlap finds exactly the values that lie inside both boundaries. On the number line, the answer is usually a bounded segment rather than an unbounded ray.",
        "hook": "The temperature for storing a vaccine is −2°C ≤ T ≤ 8°C. Two conditions AT ONCE: at least −2° AND at most 8°. If you only meet one condition, the vaccine is ruined. Solving a combined inequation finds the values that satisfy BOTH conditions simultaneously — that is the intersection.",
        "real_world_anchors": [
          "Safe storage temperatures: −2 ≤ T ≤ 8 — a bounded interval of safe values.",
          "A valid exam score: 0 ≤ marks ≤ 100 — bounded by both zero and the maximum.",
          "A healthy BMI range: 18.5 ≤ BMI ≤ 24.9.",
          "A production specification: 9.95 cm ≤ length ≤ 10.05 cm — machining tolerance."
        ],
        "the_pivot_idea": "A combined inequation is TWO inequations in disguise. Solve each one independently, then keep only the values where BOTH are satisfied — the intersection. On the number line, the intersection is usually a segment with two endpoints.",
        "wrong_intuitions_to_replace": [
          "'a < f(x) < b means a < f(x) OR f(x) < b.' — Wrong. It means BOTH simultaneously, not one or the other.",
          "'I only need to solve one part of the combined inequation.' — Wrong. Both parts must be solved and their intersection found.",
          "'The intersection always has both endpoints included.' — Wrong. The inclusion/exclusion of each endpoint depends on the strict/non-strict inequality at that boundary, independently."
        ]
      },
      "derivation": {
        "starting_question": "How do we find all integers x satisfying −1 < 2x − 3 ≤ 7?",
        "part_1_split_into_two": {
          "claim": "−1 < 2x − 3 ≤ 7 is the same as (i) −1 < 2x − 3 and (ii) 2x − 3 ≤ 7 simultaneously.",
          "reasoning": "The compound symbol means both conditions hold together. Splitting makes each inequality manageable."
        },
        "part_2_solve_each_separately": {
          "claim": "Each part is solved using the standard technique; the results are two half-lines.",
          "reasoning": "(i) −1 < 2x − 3 → add 3 → 2 < 2x → x > 1. (ii) 2x − 3 ≤ 7 → add 3 → 2x ≤ 10 → x ≤ 5. Each is a separate, straightforward solve."
        },
        "part_3_intersect_on_number_line": {
          "claim": "The intersection of x > 1 and x ≤ 5 is 1 < x ≤ 5.",
          "reasoning": "On the number line, x > 1 is the ray (1, ∞) and x ≤ 5 is (−∞, 5]. Their intersection is (1, 5] — open at 1 (excluded), closed at 5 (included).",
          "named_concept": "The 'intersection segment' — the bounded region satisfying both conditions simultaneously."
        }
      },
      "worked_example": [
        {
          "problem": "Solve: −1 < 2x − 3 ≤ 7, x ∈ Z. Represent the solution on a number line and list the solution set.",
          "thought_process_before_starting": "Split, solve each part, find intersection, then apply Z domain to list the integers.",
          "steps": [
            {
              "step_number": 1,
              "action": "Part (i): −1 < 2x − 3.",
              "computation": "Add 3: 2 < 2x → divide by 2: x > 1.",
              "reasoning": "Positive divisor, sign preserved."
            },
            {
              "step_number": 2,
              "action": "Part (ii): 2x − 3 ≤ 7.",
              "computation": "Add 3: 2x ≤ 10 → divide by 2: x ≤ 5.",
              "reasoning": "Positive divisor, sign preserved."
            },
            {
              "step_number": 3,
              "action": "Intersection.",
              "computation": "x > 1 AND x ≤ 5 → 1 < x ≤ 5.",
              "reasoning": "Values satisfying BOTH: greater than 1 and at most 5."
            },
            {
              "step_number": 4,
              "action": "Apply domain Z.",
              "computation": "Integers in 1 < x ≤ 5: x ∈ {2, 3, 4, 5}.",
              "reasoning": "1 is excluded (strict <); 5 is included (≤). Integers between are 2, 3, 4, 5."
            },
            {
              "step_number": 5,
              "action": "Number line.",
              "computation": "Open circle at 1, filled circle at 5, ray shaded between them. Dots at 2, 3, 4, 5.",
              "reasoning": "Domain Z: individual dots, not a continuous shade."
            }
          ],
          "answer": "Solution set = {2, 3, 4, 5}."
        },
        {
          "problem": "Solve the simultaneous inequations: 3x − 2 ≥ 4  and  x + 6 < 14. Find the solution set for x ∈ Z.",
          "thought_process_before_starting": "Two separate inequations. Solve each, plot both on a number line, find the overlap.",
          "steps": [
            {
              "step_number": 1,
              "action": "Solve 3x − 2 ≥ 4.",
              "computation": "3x ≥ 6 → x ≥ 2.",
              "reasoning": "Standard solve; positive divisor."
            },
            {
              "step_number": 2,
              "action": "Solve x + 6 < 14.",
              "computation": "x < 8.",
              "reasoning": "Subtract 6 from both sides."
            },
            {
              "step_number": 3,
              "action": "Intersection.",
              "computation": "x ≥ 2 AND x < 8 → 2 ≤ x < 8.",
              "reasoning": "Overlap: from 2 (included) up to but not including 8."
            },
            {
              "step_number": 4,
              "action": "Apply domain Z.",
              "computation": "x ∈ {2, 3, 4, 5, 6, 7}.",
              "reasoning": "8 is excluded; 2 is included."
            }
          ],
          "answer": "Solution set = {2, 3, 4, 5, 6, 7}."
        }
      ],
      "visual_description": "Three number lines stacked vertically for the combined inequation 1 < x ≤ 5. Top line: x > 1 — open circle at 1, arrow right (blue). Middle line: x ≤ 5 — filled circle at 5, arrow left (green). Bottom line: intersection 1 < x ≤ 5 — open circle at 1, filled circle at 5, shaded segment (purple). Label: 'Intersection = values in BOTH solution sets'.",
      "svg_diagrams": [
        {
          "id": "combined_inequation_intersection",
          "title": "Combined inequation — intersection of two solution sets",
          "svg": "<svg viewBox='0 0 760 300' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='300' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>COMBINED INEQUATION — FINDING THE INTERSECTION</text><text x='50' y='60' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1A73E8'>Part 1:  x &gt; 1</text><line x1='60' y1='72' x2='700' y2='72' stroke='#C7C7CC' stroke-width='1'/><circle cx='310' cy='72' r='7' fill='#FFFFFF' stroke='#1A73E8' stroke-width='2.5'/><line x1='310' y1='72' x2='700' y2='72' stroke='#1A73E8' stroke-width='3'/><polygon points='695,66 710,72 695,78' fill='#1A73E8'/><text x='310' y='90' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#1A73E8'>1</text><text x='50' y='124' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#34C759'>Part 2:  x ≤ 5</text><line x1='60' y1='136' x2='700' y2='136' stroke='#C7C7CC' stroke-width='1'/><circle cx='450' cy='136' r='7' fill='#34C759' stroke='#34C759' stroke-width='2.5'/><line x1='60' y1='136' x2='450' y2='136' stroke='#34C759' stroke-width='3'/><polygon points='65,130 50,136 65,142' fill='#34C759'/><text x='450' y='154' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#34C759'>5</text><rect x='30' y='174' width='700' height='2' fill='#86868B'/><text x='50' y='198' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#7B1FA2'>Intersection:  1 &lt; x ≤ 5</text><line x1='60' y1='212' x2='700' y2='212' stroke='#C7C7CC' stroke-width='1'/><circle cx='310' cy='212' r='7' fill='#FFFFFF' stroke='#7B1FA2' stroke-width='2.5'/><circle cx='450' cy='212' r='7' fill='#7B1FA2' stroke='#7B1FA2' stroke-width='2.5'/><line x1='310' y1='212' x2='450' y2='212' stroke='#7B1FA2' stroke-width='4'/><text x='310' y='230' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#7B1FA2'>1</text><text x='450' y='230' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#7B1FA2'>5</text><text x='380' y='208' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#7B1FA2'>BOTH conditions satisfied</text><rect x='50' y='252' width='660' height='36' rx='8' fill='#F5F5F7'/><text x='380' y='270' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='600' fill='#1D1D1F'>For x ∈ Z: Solution set = {2, 3, 4, 5}  |  For x ∈ R: Solution set = (1, 5]</text><text x='380' y='283' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#86868B'>Integer domain: mark individual dots;  Real domain: shade the segment continuously</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "In a < f(x) < b, I only need to solve one side.",
          "why_students_fall_for_this": "Students see the expression f(x) in the middle and treat both inequalities as producing the same result.",
          "concrete_wrong_example": "−1 < 2x − 3 < 7: student solves only 2x − 3 < 7 → x < 5, ignoring the lower bound, and reports x < 5 as the complete answer.",
          "correction": "Both parts must be solved. The answer requires BOTH conditions: x > 1 from the left part AND x < 5 from the right part, giving 1 < x < 5.",
          "how_to_spot_mid_problem": "Does your answer have both an upper and a lower bound? If a combined inequation gives only a ray (no segment), you likely missed one part."
        },
        {
          "wrong_idea": "The solution set of x > 1 and x ≤ 5 is x > 1 or x ≤ 5 (union instead of intersection).",
          "why_students_fall_for_this": "Students confuse 'and' (intersection) with 'or' (union) in set logic.",
          "concrete_wrong_example": "Writing x ∈ all real numbers (union = entire line) instead of the segment 1 < x ≤ 5.",
          "correction": "'And' means both must be true simultaneously = intersection. The answer is the segment, not the entire line.",
          "how_to_spot_mid_problem": "If your answer extends beyond both boundaries (seems like the whole line), you have taken the union instead of the intersection."
        },
        {
          "wrong_idea": "In a combined inequation, both endpoints are always either both open or both closed.",
          "why_students_fall_for_this": "Students impose symmetry where there is none.",
          "concrete_wrong_example": "−1 < 2x − 3 ≤ 7 gives 1 < x ≤ 5 — open at 1 (strict <) but CLOSED at 5 (≤). Students wrongly make both open or both closed.",
          "correction": "Each endpoint's open/closed status depends on the inequality at that boundary independently. Check each side of the compound statement separately.",
          "how_to_spot_mid_problem": "After finding the intersection, look back at the original inequation symbol at each end — that symbol determines the circle type at that endpoint."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Operate on the entire combined inequation at once",
          "rule": "For a < f(x) < b, you can apply the same operation to ALL THREE parts simultaneously, as long as the operation doesn't change the direction individually. E.g., add 3 to all parts, divide all parts by 2.",
          "example": "−1 < 2x − 3 ≤ 7 → add 3 to all: 2 < 2x ≤ 10 → divide by 2: 1 < x ≤ 5. One sweep, no splitting needed.",
          "when_to_use": "When the entire middle expression (f(x)) is of the form ax + b with positive a — you can divide all parts by a directly."
        },
        {
          "shortcut": "Sign-flip in the combined form",
          "rule": "If dividing all three parts by a negative number, REVERSE BOTH inequality signs simultaneously.",
          "example": "−6 < −2x ≤ 4 → divide by −2 and flip both signs: 3 > x ≥ −2, i.e. −2 ≤ x < 3.",
          "when_to_use": "Combined inequations with a negative coefficient of x in the middle."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "A problem expresses two simultaneous constraints on x.",
          "The inequation is written in the form a < f(x) ≤ b.",
          "A problem asks for values satisfying both 'inequation A and inequation B'.",
          "The solution set is a bounded interval rather than an unbounded ray."
        ],
        "use_other_methods_instead_when": [
          "Only a single bound is given — use sub-topics 4.2 and 4.3.",
          "The problem asks for 'or' (union) instead of 'and' (intersection) — solve separately and join the sets."
        ]
      },
      "edge_cases": [
        {
          "case": "The intersection is empty",
          "value": "If part 1 gives x > 5 and part 2 gives x < 3, the intersection is empty — no value satisfies both.",
          "reasoning": "There is no real number that is simultaneously > 5 and < 3. Solution set = ∅.",
          "where_it_appears": "Occasionally in problems designed to test whether students check the intersection carefully."
        },
        {
          "case": "Combined inequation with a negative coefficient in the middle: a < −cx + d < b",
          "value": "When you divide all parts by the negative coefficient, both inequality signs reverse simultaneously.",
          "reasoning": "The single-sweep shortcut applies: operate on all three parts, but because the divisor is negative, both boundary symbols flip.",
          "where_it_appears": "Problems like −1 ≤ 3 − 2x < 7."
        }
      ],
      "key_takeaway": "A combined inequation a < f(x) ≤ b means BOTH conditions hold simultaneously. Split into two parts, solve each, then take the intersection — the segment on the number line where BOTH solution rays overlap. Each endpoint's open/closed circle depends on the inequality at that specific boundary. Apply the domain filter last to list the final solution set.",
      "video_script_hooks": {
        "video_target_length_seconds": 200,
        "opening_hook_5_sec": "Store between −2°C and 8°C. That is TWO conditions at once — too cold fails, too warm fails. Combined inequations find the safe zone.",
        "narrative_arc": "Hook (storage temperature as motivation) → combined inequation defined → split-and-intersect method → single-sweep shortcut → number line intersection diagram → domain Z solution listing.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "A thermometer with a green zone between −2 and 8, red zones outside."
          },
          {
            "timestamp_seconds": 40,
            "what_happens_on_screen": "−1 < 2x − 3 ≤ 7 split into two parts; each solved independently."
          },
          {
            "timestamp_seconds": 90,
            "what_happens_on_screen": "Two number-line rays (blue x > 1, green x ≤ 5) overlaid to show the intersection segment in purple."
          },
          {
            "timestamp_seconds": 145,
            "what_happens_on_screen": "Single-sweep: add 3 to all three parts of −1 < 2x − 3 ≤ 7 in one step."
          },
          {
            "timestamp_seconds": 180,
            "what_happens_on_screen": "Domain Z: dots at 2, 3, 4, 5 marked on the segment."
          }
        ],
        "closing_takeaway_voiceover": "Combined inequations give you both a floor and a ceiling. Split, solve, intersect. The answer is a segment — bounded on both sides. Mark it, apply the domain, list the values."
      }
    }
  },
  {
    "topicId": "icse_math10_ch4_ineq_number_line",
    "chapterNumber": 4,
    "key_formulas": [
      {
        "formula": "Open circle ○ at a value on the number line: the value is EXCLUDED. Used for strict inequalities < and >.",
        "explanation": "A hollow circle shows the endpoint is the boundary but is not itself part of the solution set."
      },
      {
        "formula": "Closed/filled circle ● at a value: the value is INCLUDED. Used for ≤ and ≥.",
        "explanation": "A solid circle shows the endpoint is part of the solution set."
      },
      {
        "formula": "Arrow pointing right (→): x is greater than the marked value (x > k or x ≥ k).",
        "explanation": "Numbers increase to the right. An arrow pointing right captures all values above the boundary."
      },
      {
        "formula": "Arrow pointing left (←): x is less than the marked value (x < k or x ≤ k).",
        "explanation": "An arrow pointing left captures all values below the boundary."
      },
      {
        "formula": "Domain restriction: x ∈ N, x ∈ Z, or x ∈ R affects WHICH values are listed, not the algebraic solution.",
        "explanation": "First solve the inequation (get x > k, etc.), then apply the domain: for Z, list all integers in the solution; for N, list only positive integers; for R, the solution is a continuous ray or interval."
      }
    ],
    "name": "Linear Inequations — Number Line and Solution Sets",
    "prerequisite_knowledge": [
      "Solving linear inequations — sub-topic 4.2.",
      "The number line — locating integers and fractions.",
      "Sets — the meaning of 'solution set' as the collection of all satisfying values.",
      "Natural numbers (N = 1, 2, 3, …), integers (Z = …, −2, −1, 0, 1, 2, …), real numbers (R = all decimals).",
      "Distinguishing strict inequality (< or >) from non-strict (≤ or ≥)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Once you have solved the inequation and know 'x < 4' or 'x ≥ −2', the number line turns that into a picture. An open circle marks an excluded boundary; a filled circle marks an included one. The domain then filters the picture: integers only, naturals only, or all real numbers. A bounded problem has both a left and a right endpoint; an unbounded one uses an arrow.",
        "hook": "Solve x < 4. The mathematical answer is 'every real number to the left of 4 — infinitely many values'. On the number line, that is a single picture: open circle at 4, arrow pointing left. Three words plus a circle capture infinitely many numbers.",
        "real_world_anchors": [
          "A lift's maximum capacity: x ≤ 10 persons — filled circle at 10, arrow left (10 or fewer).",
          "Minimum age for a scheme: age ≥ 18 — filled circle at 18, arrow right.",
          "Valid scores on a 100-mark test: 0 ≤ marks ≤ 100 — a closed segment with filled circles at both ends.",
          "Speed camera trigger: v > 60 — open circle at 60, arrow right."
        ],
        "the_pivot_idea": "The number line converts an abstract inequality into a visual interval. Three pieces of information determine the picture completely: (1) the boundary value, (2) open or filled circle (is the boundary included?), (3) left or right arrow (which direction is the solution?). Domain then determines whether you draw a continuous line or mark only discrete dots.",
        "wrong_intuitions_to_replace": [
          "'Open circle means the solution starts just after that number, so I can use the next integer.' — Only for integer domains (Z or N). For real numbers, there is no 'next value' — the solution is a continuous ray.",
          "'≤ means filled circle on the LEFT, ≥ means filled circle on the RIGHT.' — Wrong. The type of circle (open/filled) depends only on whether the boundary is included (≤ or ≥ → filled; < or > → open), regardless of direction.",
          "'The number line diagram is optional for full marks.' — Wrong. ICSE marking schemes typically require the number line for full marks on inequation problems."
        ]
      },
      "derivation": {
        "starting_question": "Why does domain change the solution set even when the inequality is the same?",
        "part_1_algebra_gives_the_boundary": {
          "claim": "Solving gives a boundary and a direction: x > 2, x ≤ 5, etc. This is domain-independent.",
          "reasoning": "The algebraic steps work over the real numbers. The result is a half-line or interval in R."
        },
        "part_2_domain_filters_the_result": {
          "claim": "Applying a domain picks out only those values in the solution that belong to the domain set.",
          "reasoning": "If domain = Z, we keep only integers in the solution range. If domain = N, we keep only positive integers. If domain = R, every value in the interval is valid."
        },
        "part_3_finite_vs_infinite_sets": {
          "claim": "For domain N or Z, the solution set may be finite (list all elements) or infinite (e.g., all integers > 2).",
          "reasoning": "Integer solutions within a bounded interval form a finite list. Integer solutions on an unbounded half-line form an infinite set expressed as a pattern.",
          "named_concept": "Domain-filtered solution set — the complete answer to an ICSE inequation question."
        }
      },
      "worked_example": [
        {
          "problem": "Solve: 2x + 1 > 7. Graph the solution on a number line. Also list the solution set for (a) x ∈ R, (b) x ∈ Z, (c) x ∈ N.",
          "thought_process_before_starting": "Solve algebraically first. Then interpret the solution under each domain.",
          "steps": [
            {
              "step_number": 1,
              "action": "Solve the inequation.",
              "computation": "2x + 1 > 7 → 2x > 6 → x > 3.",
              "reasoning": "Subtract 1, divide by 2 (positive — no flip)."
            },
            {
              "step_number": 2,
              "action": "Draw on number line.",
              "computation": "Open circle at 3 (not included), arrow pointing right.",
              "reasoning": "Strict inequality > means boundary not included. Values greater than 3 are to the right."
            },
            {
              "step_number": 3,
              "action": "Domain R.",
              "computation": "{ x ∈ R : x > 3 } = (3, ∞).",
              "reasoning": "All real numbers greater than 3."
            },
            {
              "step_number": 4,
              "action": "Domain Z.",
              "computation": "{ …, 4, 5, 6, 7, … } = all integers greater than 3.",
              "reasoning": "The smallest integer greater than 3 is 4."
            },
            {
              "step_number": 5,
              "action": "Domain N.",
              "computation": "{ 4, 5, 6, 7, … } = all natural numbers greater than 3.",
              "reasoning": "Natural numbers start at 1; those greater than 3 begin at 4. Same as Z here since 4, 5, 6, … are already positive."
            }
          ],
          "answer": "x > 3. Number line: ○ at 3, arrow right. Domain Z: {4, 5, 6, …}. Domain N: {4, 5, 6, …}."
        },
        {
          "problem": "Solve: 3x − 5 ≤ 7, x ∈ Z. List all solution values if x ≥ 0.",
          "thought_process_before_starting": "Solve for x, then combine with x ≥ 0 to restrict the domain, then list integer solutions.",
          "steps": [
            {
              "step_number": 1,
              "action": "Solve.",
              "computation": "3x ≤ 12 → x ≤ 4.",
              "reasoning": "Add 5, divide by 3 (positive — no flip)."
            },
            {
              "step_number": 2,
              "action": "Apply domain Z with x ≥ 0.",
              "computation": "0 ≤ x ≤ 4, x ∈ Z → solution set = {0, 1, 2, 3, 4}.",
              "reasoning": "Integers from 0 to 4 inclusive."
            }
          ],
          "answer": "Solution set = {0, 1, 2, 3, 4}."
        }
      ],
      "visual_description": "Four number line examples arranged vertically. Line 1: x > 2 — open circle at 2, arrow right. Line 2: x ≥ 2 — filled circle at 2, arrow right. Line 3: x < −1 — open circle at −1, arrow left. Line 4: −1 ≤ x ≤ 4 — filled circle at −1, filled circle at 4, shaded segment between them. Labels call out: 'open ○ = excluded', 'filled ● = included', 'arrow = unbounded', 'segment = bounded'.",
      "svg_diagrams": [
        {
          "id": "number_line_solution_sets",
          "title": "Number line representations — open/closed circles, bounded/unbounded",
          "svg": "<svg viewBox='0 0 760 340' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='340' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SOLUTION SETS ON THE NUMBER LINE</text><line x1='60' y1='64' x2='700' y2='64' stroke='#C7C7CC' stroke-width='1.5'/><circle cx='300' cy='64' r='7' fill='#FFFFFF' stroke='#1A73E8' stroke-width='2.5'/><line x1='300' y1='64' x2='700' y2='64' stroke='#1A73E8' stroke-width='3'/><polygon points='695,58 710,64 695,70' fill='#1A73E8'/><text x='300' y='82' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#1A73E8'>2</text><text x='60' y='60' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#1A73E8'>x &gt; 2</text><text x='400' y='58' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#86868B'>○ open: 2 excluded</text><line x1='60' y1='118' x2='700' y2='118' stroke='#C7C7CC' stroke-width='1.5'/><circle cx='300' cy='118' r='7' fill='#34C759' stroke='#34C759' stroke-width='2.5'/><line x1='300' y1='118' x2='700' y2='118' stroke='#34C759' stroke-width='3'/><polygon points='695,112 710,118 695,124' fill='#34C759'/><text x='300' y='136' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#34C759'>2</text><text x='60' y='114' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#34C759'>x ≥ 2</text><text x='400' y='112' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#86868B'>● filled: 2 included</text><line x1='60' y1='172' x2='700' y2='172' stroke='#C7C7CC' stroke-width='1.5'/><circle cx='440' cy='172' r='7' fill='#FFFFFF' stroke='#E53935' stroke-width='2.5'/><line x1='60' y1='172' x2='440' y2='172' stroke='#E53935' stroke-width='3'/><polygon points='65,166 50,172 65,178' fill='#E53935'/><text x='440' y='190' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#E53935'>−1</text><text x='700' y='168' text-anchor='end' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#E53935'>x &lt; −1</text><line x1='60' y1='240' x2='700' y2='240' stroke='#C7C7CC' stroke-width='1.5'/><circle cx='260' cy='240' r='7' fill='#7B1FA2' stroke='#7B1FA2' stroke-width='2.5'/><circle cx='520' cy='240' r='7' fill='#7B1FA2' stroke='#7B1FA2' stroke-width='2.5'/><line x1='260' y1='240' x2='520' y2='240' stroke='#7B1FA2' stroke-width='4'/><text x='260' y='258' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#7B1FA2'>−1</text><text x='520' y='258' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#7B1FA2'>4</text><text x='700' y='236' text-anchor='end' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#7B1FA2'>−1 ≤ x ≤ 4</text><text x='390' y='235' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='10' fill='#86868B'>bounded — both endpoints included</text><rect x='30' y='282' width='700' height='46' rx='8' fill='#F5F5F7'/><text x='380' y='302' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='600' fill='#1D1D1F'>Domain tip: x ∈ R → continuous ray/segment  |  x ∈ Z → mark dots at integers only  |  x ∈ N → dots at 1, 2, 3, … only</text><text x='380' y='320' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#555'>Solve the inequation first — then apply the domain filter to determine which points to mark</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Open circle means 'start counting from the next integer'.",
          "why_students_fall_for_this": "For integer domains, the next valid value after an open circle IS the next integer. Students generalise this to real-number domains where it is wrong.",
          "concrete_wrong_example": "x > 2, x ∈ R — student writes 'solution starts at 3' because 3 is the next integer after 2. For R, the solution includes 2.1, 2.5, 2.001, etc.",
          "correction": "Open circle means the boundary value itself is excluded. For R, values like 2.001 are included. For Z, the next integer (3) is the first included value.",
          "how_to_spot_mid_problem": "Check the domain. If x ∈ R, the solution set is continuous — there is no 'next value'."
        },
        {
          "wrong_idea": "The number line is the same regardless of domain.",
          "why_students_fall_for_this": "Students draw a ray and call it the answer regardless of whether the domain is Z or R.",
          "concrete_wrong_example": "x > 2, x ∈ Z — student draws a continuous ray, but the correct representation for Z is isolated dots at 3, 4, 5, …",
          "correction": "For integer domains, mark individual dots (not a continuous line). For R, shade a continuous ray.",
          "how_to_spot_mid_problem": "If the domain is Z or N, the number line should show discrete dots, not a continuous shading."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Open/closed circle from the symbol",
          "rule": "< or > → open circle. ≤ or ≥ → closed circle. The 'equal to' part of ≤/≥ means the boundary is included.",
          "example": "x < 5: open circle at 5. x ≤ 5: filled circle at 5.",
          "when_to_use": "Every time you draw a number line — always determine circle type from the inequality symbol."
        },
        {
          "shortcut": "Domain check for finite solution sets",
          "rule": "Solve for x (get a boundary), then apply the domain. For Z, list every integer in the range. For N, start from 1.",
          "example": "x ≤ 4, x ∈ N: list 1, 2, 3, 4. For x < 4, x ∈ N: list 1, 2, 3 (4 excluded).",
          "when_to_use": "Whenever the problem specifies x ∈ N, x ∈ W, or x ∈ Z with a bounded solution."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "After solving an inequation, to represent the solution visually on the number line.",
          "When the problem specifies a domain and asks for the solution set explicitly.",
          "When ICSE problems ask 'represent on a number line' or 'find the solution set for x ∈ Z'."
        ],
        "use_other_methods_instead_when": [
          "The inequation has not yet been solved — solve first (sub-topic 4.2), then draw.",
          "The problem involves a combined inequation — solve both parts, take intersection, then draw (sub-topic 4.4)."
        ]
      },
      "edge_cases": [
        {
          "case": "Solution set is empty",
          "value": "If the algebraic solution gives x > 5, x ∈ N but the domain is restricted to {1, 2, 3}, the intersection is empty. Solution set = ∅.",
          "reasoning": "The domain may not overlap with the algebraic solution at all.",
          "where_it_appears": "Problems with very restrictive domain constraints."
        },
        {
          "case": "Whole numbers (W) vs Natural numbers (N)",
          "value": "W = {0, 1, 2, 3, …} includes 0; N = {1, 2, 3, …} does not. For x ≥ 0, x ∈ W adds 0 to the solution; x ∈ N does not.",
          "reasoning": "The convention used in ICSE is N excludes 0. When domain is W, include 0 if it satisfies the inequality.",
          "where_it_appears": "Problems specifying x ∈ W where x = 0 is on the boundary."
        }
      ],
      "key_takeaway": "After solving an inequation, represent the solution on the number line using: filled circle (●) for included boundaries (≤, ≥) and open circle (○) for excluded boundaries (<, >); arrow for unbounded solutions; shaded segment for bounded intervals. Then apply the domain: for R, shade continuously; for Z, mark discrete integer dots; for N, mark only positive integer dots starting from 1.",
      "video_script_hooks": {
        "video_target_length_seconds": 185,
        "opening_hook_5_sec": "One inequality, three different solution sets depending on whether x is a real number, an integer, or a natural number. Same algebra, three different pictures.",
        "narrative_arc": "Hook (same inequality, three domains) → open vs closed circle rule → arrows for direction → full example (R, Z, N solution sets for same inequation) → bounded interval example.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Three number lines side-by-side for x > 2 in R, Z, N — continuous ray vs discrete dots."
          },
          {
            "timestamp_seconds": 45,
            "what_happens_on_screen": "Open ○ vs closed ● circle side-by-side for x > 2 and x ≥ 2."
          },
          {
            "timestamp_seconds": 100,
            "what_happens_on_screen": "Full solve of 2x + 1 > 7 → x > 3, then three separate number line drawings."
          },
          {
            "timestamp_seconds": 155,
            "what_happens_on_screen": "Bounded interval −1 ≤ x ≤ 4 drawn: filled circles at both ends, shaded segment."
          },
          {
            "timestamp_seconds": 172,
            "what_happens_on_screen": "Closing card: '○ excluded, ● included. Arrow for unbounded, segment for bounded.'"
          }
        ],
        "closing_takeaway_voiceover": "The number line is the solution made visible. Open circle — boundary excluded. Filled circle — boundary included. Arrow — values go on forever in that direction. Domain filter — restricts which dots you actually mark."
      }
    }
  },
  {
    "topicId": "icse_math10_ch4_ineq_solving",
    "chapterNumber": 4,
    "key_formulas": [
      {
        "formula": "To solve a linear inequation: isolate x on one side using the same steps as equation-solving — EXCEPT reverse the inequality sign every time you multiply or divide both sides by a negative number.",
        "explanation": "The procedure is: clear fractions → expand brackets → transpose x-terms to one side and constants to the other → divide by the coefficient of x (flip sign if negative)."
      },
      {
        "formula": "Solution set notation: { x : x > k },  { x : x ≤ k },  etc.  Or simply write the inequality: x > k.",
        "explanation": "The solution is not a single number but a range. Represent it as an inequality or as a set-builder statement."
      },
      {
        "formula": "For domain ℝ (real numbers): the solution is an interval, e.g. x > 3 means (3, ∞).",
        "explanation": "When no domain is specified or domain is ℝ, every real number satisfying the inequality is in the solution set."
      }
    ],
    "name": "Linear Inequations — Solving in One Variable",
    "prerequisite_knowledge": [
      "Inequation symbols and the sign-flip rule — sub-topic 4.1.",
      "Solving linear equations — transposition, collecting like terms, expanding brackets.",
      "Fractions — finding LCM, cross-multiplying (but note: cross-multiplication of an inequality requires care if the denominator could be negative).",
      "Negative numbers — arithmetic with negative values.",
      "The meaning of 'solution set' — the set of all x values that satisfy the inequation."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Solving a linear inequation follows exactly the same recipe as solving a linear equation — collect like terms, transpose, divide — with a single extra awareness: if the final division is by a negative number, flip the inequality sign. The result is not a single value but a range of values (a half-line on the number line).",
        "hook": "Solve 2x + 3 < 11 and solve 2x + 3 = 11 side by side. The steps are identical: subtract 3, divide by 2. The only difference is the answer: equation gives x = 4; inequation gives x < 4 — all real numbers less than 4. One answer vs infinitely many.",
        "real_world_anchors": [
          "A factory machine: if the temperature exceeds 80°C, it shuts down. Solving T < 80 defines the safe operating range.",
          "A student needs at least 60 marks to pass. Solving m ≥ 60 tells them the minimum they must score.",
          "A mobile data plan: data used ≤ 5 GB per month. The inequation d ≤ 5 defines valid usage.",
          "A car's speed must stay below 100 km/h on a highway: v < 100."
        ],
        "the_pivot_idea": "Solving means isolating x — and the answer is a range, not a point. The only deviation from equation-solving is the sign flip when dividing by a negative coefficient.",
        "wrong_intuitions_to_replace": [
          "'Transpose a term and the sign flips.' — Wrong. Transposing changes + to − or − to + (same as equations) but does NOT flip the inequality direction.",
          "'Solving 2x < 8 gives x < 8/2 = 4, but solving −2x < 8 also gives x < 8/(−2) = −4.' — Wrong. For −2x < 8, dividing by −2 flips the sign: x > −4.",
          "'The larger the coefficient, the larger the solution.' — Irrelevant. The solution depends on the direction of the inequality and the sign of the coefficient, not its magnitude."
        ]
      },
      "derivation": {
        "starting_question": "How do we solve 3(2x − 1) < 2(x + 5) step by step?",
        "part_1_expand_and_collect": {
          "claim": "First expand all brackets, then collect x-terms on one side and constants on the other.",
          "reasoning": "We cannot isolate x until the expression is in the form ax < b. Expanding and collecting are pure algebraic identity steps — they use only addition and subtraction, which preserve the inequality."
        },
        "part_2_transpose_x_to_one_side": {
          "claim": "Move all x-terms to the left (or whichever side keeps the coefficient positive) using subtraction.",
          "reasoning": "Subtracting is safe — it never flips the sign. Keeping the x-coefficient positive means the final division step will not require a sign flip."
        },
        "part_3_divide_by_coefficient": {
          "claim": "Divide both sides by the coefficient of x; if it is negative, flip the inequality.",
          "reasoning": "This is the only step where the sign might change. A positive coefficient: straightforward. A negative coefficient: the direction of the inequality must reverse.",
          "named_concept": "The 'coefficient-sign check' — one decisive moment in every inequation problem."
        }
      },
      "worked_example": [
        {
          "problem": "Solve: 3(2x − 1) < 2(x + 5).  State the solution set.",
          "thought_process_before_starting": "Expand both sides, collect x on the left and constants on the right, then divide. Check whether the coefficient of x is positive or negative at the division step.",
          "steps": [
            {
              "step_number": 1,
              "action": "Expand brackets.",
              "computation": "6x − 3 < 2x + 10.",
              "reasoning": "Multiply out each bracket."
            },
            {
              "step_number": 2,
              "action": "Subtract 2x from both sides.",
              "computation": "4x − 3 < 10.",
              "reasoning": "Collect x-terms on the left — subtraction is safe."
            },
            {
              "step_number": 3,
              "action": "Add 3 to both sides.",
              "computation": "4x < 13.",
              "reasoning": "Collect constants on the right — addition is safe."
            },
            {
              "step_number": 4,
              "action": "Divide both sides by 4 (positive).",
              "computation": "x < 13/4 = 3.25.",
              "reasoning": "Coefficient +4 is positive — sign preserved."
            }
          ],
          "answer": "x < 3.25  (Solution set: all real numbers less than 3.25)."
        },
        {
          "problem": "Solve: 5 − 3x ≥ 2 − x.  State the solution set.",
          "thought_process_before_starting": "Collect x-terms on the left or right — the coefficient may end up negative, triggering a sign flip.",
          "steps": [
            {
              "step_number": 1,
              "action": "Subtract 2 from both sides.",
              "computation": "3 − 3x ≥ −x.",
              "reasoning": "Move the constant on the right to the left."
            },
            {
              "step_number": 2,
              "action": "Add x to both sides.",
              "computation": "3 − 2x ≥ 0.",
              "reasoning": "Collect x-terms. Now x has coefficient −2 on the left."
            },
            {
              "step_number": 3,
              "action": "Subtract 3 from both sides.",
              "computation": "−2x ≥ −3.",
              "reasoning": "Isolate the x-term."
            },
            {
              "step_number": 4,
              "action": "Divide both sides by −2 (NEGATIVE — FLIP SIGN).",
              "computation": "x ≤ 3/2 = 1.5.",
              "reasoning": "Dividing by −2 reverses ≥ to ≤."
            }
          ],
          "answer": "x ≤ 1.5  (Solution set: all real numbers ≤ 1.5)."
        }
      ],
      "visual_description": "A step-by-step solution flowchart for a generic linear inequation ax + b < cx + d. Five boxes connected by arrows: (1) Expand brackets. (2) Collect x-terms — left side. (3) Collect constants — right side. (4) Decision diamond: 'Is the coefficient of x negative?' → YES: 'Divide and FLIP sign' (red box). → NO: 'Divide, sign preserved' (green box). (5) Write solution x < k or x > k.",
      "svg_diagrams": [
        {
          "id": "inequation_solving_flowchart",
          "title": "Solving a linear inequation — step-by-step with the sign-flip decision",
          "svg": "<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='26' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SOLVING A LINEAR INEQUATION — FLOWCHART</text><rect x='270' y='40' width='220' height='36' rx='8' fill='#F5F5F7' stroke='#1D1D1F' stroke-width='1.5'/><text x='380' y='63' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='600' fill='#1D1D1F'>Expand all brackets</text><line x1='380' y1='76' x2='380' y2='96' stroke='#86868B' stroke-width='1.5'/><rect x='270' y='96' width='220' height='36' rx='8' fill='#F5F5F7' stroke='#1D1D1F' stroke-width='1.5'/><text x='380' y='119' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='600' fill='#1D1D1F'>Collect x-terms (one side)</text><line x1='380' y1='132' x2='380' y2='152' stroke='#86868B' stroke-width='1.5'/><rect x='270' y='152' width='220' height='36' rx='8' fill='#F5F5F7' stroke='#1D1D1F' stroke-width='1.5'/><text x='380' y='175' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='600' fill='#1D1D1F'>Collect constants (other side)</text><line x1='380' y1='188' x2='380' y2='208' stroke='#86868B' stroke-width='1.5'/><polygon points='380,208 460,244 380,280 300,244' fill='#FFF8E1' stroke='#F9A825' stroke-width='2'/><text x='380' y='240' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#7A5200'>Is coefficient</text><text x='380' y='256' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#7A5200'>of x  NEGATIVE?</text><line x1='300' y1='244' x2='170' y2='244' stroke='#34C759' stroke-width='2'/><text x='235' y='238' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#34C759' font-weight='700'>NO</text><rect x='60' y='224' width='110' height='40' rx='8' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='115' y='241' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#1B7A3E'>Divide both sides</text><text x='115' y='256' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#1B7A3E'>sign PRESERVED</text><line x1='460' y1='244' x2='590' y2='244' stroke='#E53935' stroke-width='2'/><text x='525' y='238' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#E53935' font-weight='700'>YES</text><rect x='590' y='220' width='130' height='48' rx='8' fill='#FFF0F0' stroke='#E53935' stroke-width='2'/><text x='655' y='238' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#C62828'>Divide both sides</text><text x='655' y='254' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#C62828'>FLIP the sign !</text><line x1='115' y1='264' x2='115' y2='310' stroke='#34C759' stroke-width='1.5'/><line x1='655' y1='268' x2='655' y2='310' stroke='#E53935' stroke-width='1.5'/><line x1='115' y1='310' x2='655' y2='310' stroke='#86868B' stroke-width='1.5'/><line x1='380' y1='310' x2='380' y2='330' stroke='#86868B' stroke-width='1.5'/><rect x='270' y='330' width='220' height='24' rx='6' fill='#1D1D1F'/><text x='380' y='347' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#FFFFFF'>Write solution: x &lt; k  or  x ≥ k  etc.</text></svg>"
        }
      ],
      "common_misconceptions": [
        {
          "wrong_idea": "Transposing a term flips the inequality sign.",
          "why_students_fall_for_this": "Students confuse transposing (changing + to −) with the sign-flip rule for multiplication/division.",
          "concrete_wrong_example": "2x − 3 < 7; transposing −3: student writes 2x > 7 + 3 = 10 (flipped sign). Correct: 2x < 10.",
          "correction": "Transposing uses addition/subtraction on both sides — the inequality direction never changes. Only ×/÷ by a negative flips the sign.",
          "how_to_spot_mid_problem": "After transposing a term, check: did the inequality direction change? If yes, you made this error."
        },
        {
          "wrong_idea": "Solving (x − 2)/3 < 5 by multiplying both sides by 3 requires a sign flip.",
          "why_students_fall_for_this": "Students see a 3 in the denominator and assume multiplying by 3 is 'like dividing by a negative'.",
          "concrete_wrong_example": "Writing x − 2 > 15 (flipped) instead of x − 2 < 15.",
          "correction": "Multiplying by 3 (positive) preserves the inequality. Sign flip is only needed for negative multipliers.",
          "how_to_spot_mid_problem": "Before multiplying by the denominator to clear fractions, check: is the denominator negative? If it is positive, no flip is needed."
        }
      ],
      "shortcuts_and_tricks": [
        {
          "shortcut": "Keep coefficient positive",
          "rule": "Before dividing, rearrange so the coefficient of x is positive — then you can divide without worrying about a sign flip.",
          "example": "−3x < 12: add 3x to both sides and subtract 12: 0 < 12 + 3x → 3x > −12 → x > −4. No sign flip needed.",
          "when_to_use": "When the coefficient of x ends up negative after collecting terms."
        },
        {
          "shortcut": "Fraction clearing — check the denominator's sign",
          "rule": "To clear a fraction, multiply both sides by the denominator. If the denominator is positive (the usual case), no sign flip. If it could be negative (e.g., the denominator contains x), extra caution is needed.",
          "example": "(2x − 1)/5 ≥ 3: multiply by 5 (positive) → 2x − 1 ≥ 15 → x ≥ 8. No flip.",
          "when_to_use": "Any inequation with a fractional expression."
        }
      ],
      "when_to_use_this_method": {
        "use_rd_concept_thinking_when": [
          "A problem asks you to 'solve' or 'find the values of x' satisfying an inequality.",
          "A constraint is expressed as an inequality that needs to be simplified.",
          "Part (i) of a combined inequation problem (solve each part, then take the intersection)."
        ],
        "use_other_methods_instead_when": [
          "The problem is an equation (= sign) — use standard linear equation techniques.",
          "You need the solution on a number line — proceed to sub-topic 4.3 after solving.",
          "The problem states a domain (Z, N) — after solving, list only the integers or naturals in the interval (sub-topic 4.3)."
        ]
      },
      "edge_cases": [
        {
          "case": "The inequation simplifies to 0 < k (constant) or 0 > k",
          "value": "0 < k where k > 0 means all real numbers are solutions (always true). 0 > k where k > 0 means no solution (always false).",
          "reasoning": "After all x-terms cancel, the truth of the statement depends only on the constants — either the inequation is universally true or universally false.",
          "where_it_appears": "Occasionally in problems designed to test whether students check the final statement."
        },
        {
          "case": "Inequation with the variable on the right: 5 > 2x + 1",
          "value": "Rewrite as 2x + 1 < 5 by reversing BOTH the inequality direction and the sides. Solve normally.",
          "reasoning": "a > b is the same as b < a. Rewriting with x on the left is just a notational convenience — it does not add a 'flip'.",
          "where_it_appears": "Many ICSE problems phrase the inequation with the constant on the left."
        }
      ],
      "key_takeaway": "Solving a linear inequation mirrors equation-solving: expand, collect, transpose, divide. The only critical difference is the sign flip when dividing (or multiplying) by a negative coefficient. The result is always a range of values (an inequality), not a single number. Write the answer as x < k, x ≥ k, etc.",
      "video_script_hooks": {
        "video_target_length_seconds": 195,
        "opening_hook_5_sec": "Solve 2x + 3 = 11 and 2x + 3 < 11 side by side — the steps are identical, but one gives a point and the other gives a half-line.",
        "narrative_arc": "Hook (equation vs inequation side-by-side) → collect terms → divide (positive: safe) → worked example with negative coefficient → sign-flip decision diamond → fraction clearing example.",
        "visual_moments": [
          {
            "timestamp_seconds": 0,
            "what_happens_on_screen": "Two columns: '2x + 3 = 11' and '2x + 3 < 11' solved side by side, steps identical until the answer."
          },
          {
            "timestamp_seconds": 50,
            "what_happens_on_screen": "Solution x = 4 marked as a point; x < 4 shown as a ray on the number line."
          },
          {
            "timestamp_seconds": 100,
            "what_happens_on_screen": "5 − 3x ≥ 2 − x solved with decision diamond triggering the sign flip."
          },
          {
            "timestamp_seconds": 155,
            "what_happens_on_screen": "Fraction clearing: (2x − 1)/5 ≥ 3 — denominator is positive, no flip."
          },
          {
            "timestamp_seconds": 180,
            "what_happens_on_screen": "Closing card: 'Expand → collect → divide. Negative divisor? Flip the sign.'"
          }
        ],
        "closing_takeaway_voiceover": "The method is equation-solving. The answer is a range. And the one rule you must never forget: if you divide by a negative number, the inequality sign reverses."
      }
    }
  },
  {
    "topicId": "icse_math10_ch5_quad_basics",
    "chapterNumber": 5,
    "key_formulas": [
      "Standard form: ax² + bx + c = 0, where a ≠ 0 (a, b, c are real constants).",
      "A quadratic has at most 2 roots (values of x that satisfy it).",
      "Sum of roots: α + β = −b/a.",
      "Product of roots: α × β = c/a.",
      "If α and β are known roots: equation is x² − (α+β)x + αβ = 0."
    ],
    "name": "Quadratic Equations — Standard Form and Roots",
    "prerequisite_knowledge": [
      "Algebraic expressions: expanding brackets, collecting like terms.",
      "Linear equations: isolating x on one side.",
      "Multiplication of two binomials: (a + b)(c + d) = ac + ad + bc + bd.",
      "The concept of 'roots' or 'solutions' of an equation.",
      "Substitution: checking whether a value satisfies an equation."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A quadratic is a parabola. Its roots are the x-coordinates where the parabola crosses the x-axis. Two roots ↔ two crossings; one root ↔ touches once (tangent); no real roots ↔ parabola never crosses.",
      "derivation": [
        "Start with ax² + bx + c = 0.",
        "A value r is a root if and only if ar² + br + c = 0 (substitution test).",
        "By Vieta's formulas: if ax² + bx + c = a(x − α)(x − β), expanding gives a[x² − (α+β)x + αβ] = ax² + bx + c, so −a(α+β) = b and a·αβ = c, giving sum = −b/a and product = c/a."
      ],
      "worked_example": {
        "problem": "Find the sum and product of the roots of 3x² − 7x + 4 = 0 without solving.",
        "solution": [
          "Here a = 3, b = −7, c = 4.",
          "Sum of roots = −b/a = −(−7)/3 = 7/3.",
          "Product of roots = c/a = 4/3."
        ],
        "insight": "Vieta's shortcuts let you verify roots and build new equations without the full solve."
      },
      "visual_description": "A U-shaped parabola crossing the x-axis at two points labelled α and β. The vertex sits halfway between them at x = −b/(2a). The y-intercept is c (when x = 0).",
      "svg_diagrams": [
        {
          "id": "quad_parabola_roots",
          "title": "Parabola with Two Real Roots",
          "svg": "<svg viewBox=\"0 0 260 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <line x1=\"20\" y1=\"120\" x2=\"240\" y2=\"120\" stroke=\"#888\" stroke-width=\"1\"/>\n  <line x1=\"130\" y1=\"10\" x2=\"130\" y2=\"150\" stroke=\"#888\" stroke-width=\"1\"/>\n  <path d=\"M 40,110 Q 130,20 220,110\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/>\n  <circle cx=\"72\"  cy=\"120\" r=\"4\" fill=\"#e11d48\"/>\n  <circle cx=\"188\" cy=\"120\" r=\"4\" fill=\"#e11d48\"/>\n  <text x=\"60\"  y=\"140\" fill=\"#e11d48\">α</text>\n  <text x=\"182\" y=\"140\" fill=\"#e11d48\">β</text>\n  <text x=\"118\" y=\"155\" fill=\"#888\">x</text>\n  <text x=\"135\" y=\"22\"  fill=\"#888\">y</text>\n  <text x=\"88\"  y=\"60\"  fill=\"#4f46e5\">ax²+bx+c</text>\n</svg>"
        },
        {
          "id": "vieta_summary",
          "title": "Vieta's Formulas at a Glance",
          "svg": "<svg viewBox=\"0 0 260 100\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"12\">\n  <rect x=\"10\" y=\"10\" width=\"240\" height=\"80\" rx=\"8\" fill=\"#f0fdf4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/>\n  <text x=\"130\" y=\"32\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#166534\">ax² + bx + c = 0</text>\n  <line x1=\"20\" y1=\"40\" x2=\"240\" y2=\"40\" stroke=\"#86efac\" stroke-width=\"1\"/>\n  <text x=\"40\"  y=\"60\" fill=\"#166534\">Sum of roots:</text>\n  <text x=\"150\" y=\"60\" fill=\"#15803d\" font-weight=\"bold\">α + β = −b / a</text>\n  <text x=\"40\"  y=\"80\" fill=\"#166534\">Product of roots:</text>\n  <text x=\"150\" y=\"80\" fill=\"#15803d\" font-weight=\"bold\">α × β = c / a</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Confusing 'root' with 'factor' — a root is a value of x; a factor is an expression like (x − α).",
        "Forgetting the sign in Vieta's sum: sum = −b/a, NOT b/a.",
        "Treating ax² + bx = 0 (c = 0) as linear — it's still quadratic; x = 0 and x = −b/a are both roots.",
        "Assuming every quadratic has two distinct real roots — it may have a repeated root or no real roots."
      ],
      "shortcuts_and_tricks": [
        "Check a proposed root instantly by substitution: plug in and see if both sides equal.",
        "If only the sum and product of roots are known, the equation is x² − (sum)x + (product) = 0 (for a = 1).",
        "A quadratic with integer roots r and s can be written as (x − r)(x − s) = 0 immediately."
      ],
      "when_to_use_this_method": "Use Vieta's formulas when asked to find sum/product of roots without solving, or when constructing a quadratic from given roots. Use substitution to verify whether a given value is a root.",
      "edge_cases": [
        "If c = 0: one root is always 0; factorize as x(ax + b) = 0.",
        "If b = 0: equation is ax² + c = 0 → x² = −c/a. If c/a < 0 the roots are real and equal in magnitude; if c/a > 0, no real roots.",
        "Repeated root: both roots equal α; sum = 2α = −b/a, product = α² = c/a."
      ],
      "key_takeaway": "ax² + bx + c = 0 has at most 2 roots. Sum = −b/a, Product = c/a (Vieta). Reverse these to build a quadratic from known roots.",
      "video_script_hooks": {
        "opening_hook": "What if I told you that knowing just two numbers — the sum and product of the answers — lets you write the entire quadratic equation? No solving needed. That's Vieta's magic.",
        "mid_lesson_analogy": "Think of roots as the x-addresses where your parabola lands on the ground. The sum tells you the midpoint, the product tells you how spread out they are.",
        "closing_takeaway_voiceover": "Standard form first. Identify a, b, c. Sum = −b/a, product = c/a. Reverse: equation = x² − (sum)x + (product) = 0. Those three moves unlock every Vieta problem."
      }
    }
  },
  {
    "topicId": "icse_math10_ch5_quad_factoring",
    "chapterNumber": 5,
    "key_formulas": [
      "Split the middle term bx into two parts mx + nx where m + n = b and m × n = ac.",
      "Factor by grouping: ax² + mx + nx + c = x(ax + m) + n/a·(ax + m) → (ax + m)(x + n/a) = 0.",
      "Shortcut for a = 1: find p, q with p + q = b and pq = c → (x + p)(x + q) = 0.",
      "Zero-product gives roots: x = −p and x = −q."
    ],
    "name": "Quadratic Equations — Solving by Factorisation",
    "prerequisite_knowledge": [
      "Expanding brackets: (x + p)(x + q) = x² + (p+q)x + pq.",
      "Finding factor pairs of a number (splitting the middle term).",
      "Zero-product property: if AB = 0 then A = 0 or B = 0.",
      "Moving all terms to one side to get the standard form ax² + bx + c = 0."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Factorisation reverses the expansion. You broke a product to get the quadratic; now you reconstruct the product and set each factor to zero. The key is finding the right split for the middle term.",
      "derivation": [
        "Given ax² + bx + c = 0, look for m and n with m + n = b and m × n = ac.",
        "Rewrite: ax² + mx + nx + c = 0.",
        "Group: x(ax + m) + (n/a)(ax + m) = 0 (possible when n divides a consistently).",
        "Factor out: (ax + m)(x + n/a) = 0.",
        "Set each factor to zero: x = −m/a or x = −n/a."
      ],
      "worked_example": {
        "problem": "Solve: 2x² + 7x + 3 = 0 by factorisation.",
        "solution": [
          "a = 2, b = 7, c = 3. Product ac = 6.",
          "Find m, n: m + n = 7, m × n = 6 → m = 6, n = 1.",
          "Rewrite: 2x² + 6x + x + 3 = 0.",
          "Group: 2x(x + 3) + 1(x + 3) = 0.",
          "Factor: (2x + 1)(x + 3) = 0.",
          "Roots: x = −1/2 or x = −3."
        ],
        "insight": "Always move all terms to one side first (= 0). Then find the split before grouping."
      },
      "visual_description": "A factor grid: write ac in the top-right, b in the bottom. Find two numbers that multiply to ac and add to b — those go in the split. Then group and factor.",
      "svg_diagrams": [
        {
          "id": "split_middle_term",
          "title": "Split-the-Middle-Term Method",
          "svg": "<svg viewBox=\"0 0 280 130\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"12\">\n  <rect x=\"10\" y=\"10\" width=\"260\" height=\"110\" rx=\"8\" fill=\"#eff6ff\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/>\n  <text x=\"140\" y=\"32\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#1e40af\">2x² + 7x + 3 = 0</text>\n  <text x=\"30\"  y=\"55\" fill=\"#1d4ed8\">Step 1: ac = 2×3 = 6; find m+n=7, mn=6 → 6,1</text>\n  <text x=\"30\"  y=\"75\" fill=\"#1d4ed8\">Step 2: 2x² + 6x + x + 3 = 0</text>\n  <text x=\"30\"  y=\"95\" fill=\"#1d4ed8\">Step 3: 2x(x+3) + 1(x+3) = 0</text>\n  <text x=\"30\" y=\"115\" fill=\"#15803d\" font-weight=\"bold\">  → (2x+1)(x+3)=0 → x=−½ or x=−3</text>\n</svg>"
        },
        {
          "id": "factor_grid",
          "title": "Factor Pair Grid",
          "svg": "<svg viewBox=\"0 0 200 120\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"12\">\n  <rect x=\"10\" y=\"10\" width=\"180\" height=\"100\" rx=\"6\" fill=\"#fefce8\" stroke=\"#eab308\" stroke-width=\"1.5\"/>\n  <text x=\"100\" y=\"32\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#713f12\">ac = 6, need sum = 7</text>\n  <line x1=\"20\" y1=\"42\" x2=\"180\" y2=\"42\" stroke=\"#fde68a\" stroke-width=\"1\"/>\n  <text x=\"40\"  y=\"62\" fill=\"#713f12\">Pairs of 6:</text>\n  <text x=\"130\" y=\"62\" fill=\"#713f12\">Sum</text>\n  <text x=\"40\"  y=\"80\" fill=\"#92400e\">1 × 6</text>\n  <text x=\"130\" y=\"80\" fill=\"#15803d\" font-weight=\"bold\">7 ✓</text>\n  <text x=\"40\"  y=\"98\" fill=\"#92400e\">2 × 3</text>\n  <text x=\"130\" y=\"98\" fill=\"#9ca3af\">5 ✗</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Forgetting to set the equation to zero before factorising — x² + 7x = −3 cannot be factorised as-is.",
        "Splitting correctly but not applying the zero-product rule — grouping gives factors, not roots yet.",
        "Trying to factorise when the discriminant is not a perfect square — use the formula instead.",
        "Sign errors in the split: if bx = −5x and ac = 6, you need m + n = −5 and mn = 6 → m = −2, n = −3."
      ],
      "shortcuts_and_tricks": [
        "For a = 1, just inspect: what two numbers multiply to c and add to b? Write (x + p)(x + q) directly.",
        "After factorising, use Vieta's to double-check: sum of roots should equal −b/a, product should equal c/a.",
        "If you cannot find integer pairs, the equation is not factorisable over integers — switch to the formula."
      ],
      "when_to_use_this_method": "Use factorisation when the discriminant is a perfect square (or when a = 1 and integer roots are visible). For non-integer/irrational roots, the quadratic formula is more efficient.",
      "edge_cases": [
        "Equation already partially factored: x(x − 5) = 6 → x² − 5x − 6 = 0 (move 6 first).",
        "Common factor: 3x² + 6x = 0 → 3x(x + 2) = 0 → x = 0 or x = −2 (don't divide by x!)",
        "Perfect square: x² − 6x + 9 = 0 → (x − 3)² = 0 → repeated root x = 3."
      ],
      "key_takeaway": "Move everything to one side → find the split (m + n = b, mn = ac) → group → factor → zero-product → roots. Always verify with Vieta's sum and product.",
      "video_script_hooks": {
        "opening_hook": "There's a trick called 'split the middle term' that turns any quadratic into a multiplication problem. Once you see it, you'll wonder how you ever solved without it.",
        "mid_lesson_analogy": "Think of ac as a code lock. You need two numbers whose product cracks the code (= ac) and whose sum matches the key (= b). Find those two numbers, and the rest falls into place.",
        "closing_takeaway_voiceover": "Set to zero. Find the split — product ac, sum b. Group and factor. Zero-product gives the roots. Check with Vieta's. That's the complete factorisation playbook."
      }
    }
  },
  {
    "topicId": "icse_math10_ch5_quad_formula",
    "chapterNumber": 5,
    "key_formulas": [
      "Quadratic formula: x = [−b ± √(b² − 4ac)] / 2a.",
      "Discriminant: D = b² − 4ac.",
      "D > 0: two distinct real roots.",
      "D = 0: one real repeated root; x = −b / 2a.",
      "D < 0: no real roots (roots are imaginary — beyond ICSE scope).",
      "For D > 0 to be a perfect square: roots are rational; otherwise they are irrational surds."
    ],
    "name": "Quadratic Equations — Quadratic Formula and Nature of Roots",
    "prerequisite_knowledge": [
      "Square roots and surds: √9 = 3, √2 is irrational.",
      "Completing the square (used to derive the formula).",
      "The meaning of 'real' vs 'unreal/imaginary' numbers at ICSE level.",
      "Substituting values into an algebraic expression."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The discriminant D tells you the story before you even solve: positive → two crossings, zero → one touching, negative → parabola misses the axis. The ± in the formula gives both crossing points at once.",
      "derivation": [
        "Start: ax² + bx + c = 0. Divide by a: x² + (b/a)x + c/a = 0.",
        "Complete the square: x² + (b/a)x + (b/2a)² = (b/2a)² − c/a.",
        "Left side: (x + b/2a)². Right side: (b² − 4ac) / 4a².",
        "Take square root: x + b/2a = ±√(b² − 4ac) / 2a.",
        "Solve for x: x = [−b ± √(b² − 4ac)] / 2a."
      ],
      "worked_example": {
        "problem": "Solve 2x² − 4x − 3 = 0. Express the roots correct to 2 decimal places.",
        "solution": [
          "a = 2, b = −4, c = −3.",
          "D = (−4)² − 4(2)(−3) = 16 + 24 = 40.",
          "√40 = 2√10 ≈ 6.32.",
          "x = [4 ± 6.32] / 4.",
          "x₁ = 10.32 / 4 ≈ 2.58;   x₂ = −2.32 / 4 ≈ −0.58."
        ],
        "insight": "When D is not a perfect square, leave as ±√D/2a in exact form, then approximate if required."
      },
      "visual_description": "A table with three rows showing D > 0 (two distinct x-intercepts), D = 0 (parabola tangent to x-axis, one point), D < 0 (parabola entirely above/below x-axis, no intercepts).",
      "svg_diagrams": [
        {
          "id": "discriminant_cases",
          "title": "Three Cases of the Discriminant",
          "svg": "<svg viewBox=\"0 0 300 140\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <!-- D > 0 -->\n  <line x1=\"10\" y1=\"90\" x2=\"90\" y2=\"90\" stroke=\"#888\" stroke-width=\"1\"/>\n  <path d=\"M 15,80 Q 50,30 85,80\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"2\"/>\n  <circle cx=\"28\" cy=\"90\" r=\"3\" fill=\"#e11d48\"/>\n  <circle cx=\"72\" cy=\"90\" r=\"3\" fill=\"#e11d48\"/>\n  <text x=\"50\" y=\"125\" text-anchor=\"middle\" fill=\"#166534\" font-weight=\"bold\">D &gt; 0</text>\n  <text x=\"50\" y=\"138\" text-anchor=\"middle\" fill=\"#166534\">2 real roots</text>\n  <!-- D = 0 -->\n  <line x1=\"105\" y1=\"90\" x2=\"195\" y2=\"90\" stroke=\"#888\" stroke-width=\"1\"/>\n  <path d=\"M 110,80 Q 150,50 190,80\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n  <circle cx=\"150\" cy=\"90\" r=\"3\" fill=\"#e11d48\"/>\n  <text x=\"150\" y=\"125\" text-anchor=\"middle\" fill=\"#92400e\" font-weight=\"bold\">D = 0</text>\n  <text x=\"150\" y=\"138\" text-anchor=\"middle\" fill=\"#92400e\">1 repeated root</text>\n  <!-- D < 0 -->\n  <line x1=\"210\" y1=\"100\" x2=\"295\" y2=\"100\" stroke=\"#888\" stroke-width=\"1\"/>\n  <path d=\"M 215,95 Q 252,55 289,95\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>\n  <text x=\"252\" y=\"125\" text-anchor=\"middle\" fill=\"#991b1b\" font-weight=\"bold\">D &lt; 0</text>\n  <text x=\"252\" y=\"138\" text-anchor=\"middle\" fill=\"#991b1b\">No real roots</text>\n</svg>"
        },
        {
          "id": "formula_derivation_strip",
          "title": "Quadratic Formula — Derivation Strip",
          "svg": "<svg viewBox=\"0 0 300 110\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <rect x=\"5\" y=\"5\" width=\"290\" height=\"100\" rx=\"6\" fill=\"#faf5ff\" stroke=\"#9333ea\" stroke-width=\"1.5\"/>\n  <text x=\"150\" y=\"24\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#581c87\">Deriving the Formula</text>\n  <text x=\"15\" y=\"44\" fill=\"#6b21a8\">ax²+bx+c=0  →  x²+(b/a)x = −c/a</text>\n  <text x=\"15\" y=\"62\" fill=\"#6b21a8\">Complete square: (x + b/2a)² = (b²−4ac)/4a²</text>\n  <text x=\"15\" y=\"80\" fill=\"#6b21a8\">Take √:  x + b/2a = ±√(b²−4ac) / 2a</text>\n  <text x=\"15\" y=\"98\" fill=\"#7e22ce\" font-weight=\"bold\">∴  x = [−b ± √(b²−4ac)] / 2a</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Writing D = b² − 4ac then substituting with wrong signs — e.g., for b = −4: D = (−4)² = 16, not −16.",
        "Forgetting to divide the entire numerator by 2a, not just the square-root part.",
        "Concluding 'no solution' when D < 0 — at ICSE level we say 'no real roots', not 'no solution'.",
        "Using the formula when factorisation would be faster — always try factorisation first when D is a perfect square."
      ],
      "shortcuts_and_tricks": [
        "Compute D first. If D < 0, stop — state 'no real roots'. If D = 0, root = −b/(2a) directly.",
        "If D is a perfect square, factorisation will be cleaner; formula gives fractional/surd roots otherwise.",
        "For 'find the value of k such that the equation has equal roots': set D = 0 and solve for k."
      ],
      "when_to_use_this_method": "Use the quadratic formula when the equation cannot be easily factorised, when roots involve surds, or when the discriminant needs to be analysed for the 'nature of roots' question type.",
      "edge_cases": [
        "b = 0: formula gives x = ±√(−c/a). Two real roots if c/a < 0, no real roots if c/a > 0.",
        "a very large or decimal coefficient: compute D carefully, keep exact surds.",
        "D = 0 gives the repeated root −b/(2a) — count this as two equal roots, not one."
      ],
      "key_takeaway": "Compute D = b² − 4ac first. D > 0: two roots via formula. D = 0: one root −b/2a. D < 0: no real roots. The ± gives both roots simultaneously — never forget it.",
      "video_script_hooks": {
        "opening_hook": "One formula. Three possible stories. The discriminant decides which story your quadratic is telling — before you even compute a single root.",
        "mid_lesson_analogy": "The discriminant is the weather forecast: D > 0 is sunny (two real roots), D = 0 is cloudy (borderline, one root), D < 0 is stormy (no real roots today).",
        "closing_takeaway_voiceover": "Find D first — it's your shortcut. If D ≥ 0, plug into the formula. If D < 0, stop and state no real roots. Every 'nature of roots' problem lives or dies by this check."
      }
    }
  },
  {
    "topicId": "icse_math10_ch5_quad_problems",
    "chapterNumber": 5,
    "key_formulas": [
      "Consecutive integers: n and n + 1 (or n − 1 and n).",
      "Consecutive even/odd integers: n and n + 2.",
      "Speed–time–distance: d = s × t  ↔  t = d/s.",
      "For two-digit number with tens digit x: number = 10x + units.",
      "Area of rectangle = length × breadth. For a square: A = side²."
    ],
    "name": "Quadratic Equations — Word Problems",
    "prerequisite_knowledge": [
      "Setting up linear equations from word problems (speed = distance/time, age problems, etc.).",
      "Area and perimeter formulas: rectangle A = l × b, P = 2(l + b); circle A = πr².",
      "The two methods of solving quadratic equations (factorisation and formula).",
      "Rejecting physically impossible roots (e.g., negative length, negative age, negative speed)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Every word problem hides a quadratic. The key is choosing ONE variable for the unknown, writing one equation from the given condition, reducing it to standard form, and solving. The second root is either the other valid answer or a rejected negative.",
      "derivation": [
        "Let the unknown be x.",
        "Translate the verbal condition into an equation: usually a product, area, or rate condition produces a quadratic.",
        "Rearrange to ax² + bx + c = 0.",
        "Solve by factorisation or formula.",
        "Check both roots against the context (reject negative lengths, speeds, etc.)."
      ],
      "worked_example": {
        "problem": "The sum of a number and its reciprocal is 10/3. Find the number.",
        "solution": [
          "Let the number be x. Reciprocal = 1/x.",
          "x + 1/x = 10/3.",
          "Multiply by 3x: 3x² + 3 = 10x → 3x² − 10x + 3 = 0.",
          "Factorise: 3x² − 9x − x + 3 = 0 → 3x(x − 3) − 1(x − 3) = 0 → (3x − 1)(x − 3) = 0.",
          "x = 1/3 or x = 3. Both are valid (positive numbers)."
        ],
        "insight": "Multiplying through by the denominator clears fractions and reveals the quadratic structure."
      },
      "visual_description": "A flowchart: Read problem → Identify unknown (let x = ?) → Write equation → Reduce to ax² + bx + c = 0 → Solve → Check roots in context → State answer with units.",
      "svg_diagrams": [
        {
          "id": "word_problem_flowchart",
          "title": "Word Problem Solving Flowchart",
          "svg": "<svg viewBox=\"0 0 240 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <rect x=\"60\" y=\"5\"   width=\"120\" height=\"26\" rx=\"5\" fill=\"#dbeafe\" stroke=\"#3b82f6\"/>\n  <text x=\"120\" y=\"22\" text-anchor=\"middle\" fill=\"#1e3a8a\">Read problem</text>\n  <line x1=\"120\" y1=\"31\" x2=\"120\" y2=\"45\" stroke=\"#94a3b8\" stroke-width=\"1.2\" marker-end=\"url(#arr)\"/>\n  <rect x=\"50\" y=\"45\"  width=\"140\" height=\"26\" rx=\"5\" fill=\"#dbeafe\" stroke=\"#3b82f6\"/>\n  <text x=\"120\" y=\"62\" text-anchor=\"middle\" fill=\"#1e3a8a\">Let x = unknown</text>\n  <line x1=\"120\" y1=\"71\" x2=\"120\" y2=\"85\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/>\n  <rect x=\"45\" y=\"85\"  width=\"150\" height=\"26\" rx=\"5\" fill=\"#dbeafe\" stroke=\"#3b82f6\"/>\n  <text x=\"120\" y=\"102\" text-anchor=\"middle\" fill=\"#1e3a8a\">Form equation</text>\n  <line x1=\"120\" y1=\"111\" x2=\"120\" y2=\"125\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/>\n  <rect x=\"30\" y=\"125\" width=\"180\" height=\"26\" rx=\"5\" fill=\"#fef9c3\" stroke=\"#eab308\"/>\n  <text x=\"120\" y=\"142\" text-anchor=\"middle\" fill=\"#713f12\">Reduce to ax²+bx+c=0</text>\n  <line x1=\"120\" y1=\"151\" x2=\"120\" y2=\"165\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/>\n  <rect x=\"50\" y=\"165\" width=\"140\" height=\"26\" rx=\"5\" fill=\"#dcfce7\" stroke=\"#22c55e\"/>\n  <text x=\"120\" y=\"182\" text-anchor=\"middle\" fill=\"#14532d\">Solve + reject negatives</text>\n  <line x1=\"120\" y1=\"191\" x2=\"120\" y2=\"205\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/>\n  <rect x=\"60\" y=\"205\" width=\"120\" height=\"13\" rx=\"3\" fill=\"#f0fdf4\" stroke=\"#86efac\"/>\n  <text x=\"120\" y=\"215\" text-anchor=\"middle\" fill=\"#166534\">State answer</text>\n  <defs><marker id=\"arr\" markerWidth=\"8\" markerHeight=\"8\" refX=\"4\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L8,4 L0,8 Z\" fill=\"#94a3b8\"/></marker></defs>\n</svg>"
        },
        {
          "id": "common_setups",
          "title": "Common Word-Problem Setups",
          "svg": "<svg viewBox=\"0 0 280 110\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <rect x=\"5\" y=\"5\" width=\"270\" height=\"100\" rx=\"6\" fill=\"#fff7ed\" stroke=\"#f97316\" stroke-width=\"1.5\"/>\n  <text x=\"140\" y=\"22\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#7c2d12\">Common Quadratic Setups</text>\n  <text x=\"15\" y=\"40\" fill=\"#9a3412\">Reciprocal:   x + 1/x = k  →  x²−kx+1=0</text>\n  <text x=\"15\" y=\"58\" fill=\"#9a3412\">Consecutive:  n(n+1)=k   →  n²+n−k=0</text>\n  <text x=\"15\" y=\"76\" fill=\"#9a3412\">Area:         l(l−d)=A   →  l²−dl−A=0</text>\n  <text x=\"15\" y=\"94\" fill=\"#9a3412\">Speed:        d/v−d/(v+k)=t  →  quadratic in v</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Using two variables (x and y) then struggling to eliminate one — always reduce to one variable.",
        "Keeping both roots without checking context — a negative length or speed must be rejected.",
        "Not multiplying both sides by the LCD before forming the quadratic from a fraction-based condition.",
        "Setting up the equation for the wrong quantity (e.g., setting up for the reciprocal instead of the number itself)."
      ],
      "shortcuts_and_tricks": [
        "Products of consecutive integers n(n+1) or areas of rectangles almost always yield a quadratic — spot this pattern immediately.",
        "Speed problems: if both 'd/v' and 'd/(v+k)' appear, multiply both sides by v(v+k) to clear fractions.",
        "Sum and difference given: if sum = S and product = P, the numbers are roots of x² − Sx + P = 0."
      ],
      "when_to_use_this_method": "Use this structured approach (let x, form equation, reduce, solve, reject) for every application word problem involving a product, area, or rate condition that leads to a degree-2 equation.",
      "edge_cases": [
        "Both roots are positive and valid: state both answers (the problem may have two geometrically distinct solutions).",
        "The problem says 'positive integer' or 'natural number' — reject any root that isn't a positive integer.",
        "Speed problems where v + k = 0 would be a root: always reject (negative speed is physically meaningless)."
      ],
      "key_takeaway": "One variable, one equation, standard form. Solve. Check both roots against the context — reject the impossible one. State the answer with correct units.",
      "video_script_hooks": {
        "opening_hook": "Every tricky word problem has a secret — it's hiding a quadratic equation. Once you know how to translate words into that equation, the maths does all the work.",
        "mid_lesson_analogy": "Setting up the equation is like building a bridge. Both sides must be equal, both roots exist on paper, but only the physically possible one gets you across to the answer.",
        "closing_takeaway_voiceover": "Let x be the unknown. Form the equation. Reduce to zero. Solve. Check context. That five-step flow will crack every quadratic word problem on your ICSE exam."
      }
    }
  },
  {
    "topicId": "icse_math10_ch6_qprob_geometry",
    "chapterNumber": 6,
    "key_formulas": [
      "For a rectangle: if l − b = d and lb = A, then l and b are roots of x² − (l+b)x + A = 0.",
      "For a right-angled triangle with legs a, b and hypotenuse c: a² + b² = c².",
      "If a diagonal d is given for a rectangle with sides l and b: d² = l² + b².",
      "Area of path around a rectangle: A_path = (l + 2w)(b + 2w) − lb, where w = path width."
    ],
    "name": "Quadratic Problems — Geometric Applications",
    "prerequisite_knowledge": [
      "Area of rectangle = l × b; perimeter = 2(l + b).",
      "Area of triangle = ½ × base × height; Pythagoras theorem: a² + b² = c².",
      "Area of circle = πr²; circumference = 2πr.",
      "Solving quadratic equations by factorisation and the quadratic formula.",
      "Rejecting negative roots when they represent lengths or areas."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Geometry problems become quadratic when two dimension-related conditions are given simultaneously — an area condition (giving a product) and a length condition (giving a sum or difference). Together they pin down a quadratic in one variable.",
      "derivation": [
        "Name one dimension x. Express the second dimension in terms of x using the length condition.",
        "Substitute both into the area (or Pythagoras) condition → quadratic in x.",
        "Solve. Reject roots that give negative lengths.",
        "State both dimensions with units."
      ],
      "worked_example": {
        "problem": "The area of a right-angled triangle is 30 cm². The hypotenuse is 13 cm. Find the two legs.",
        "solution": [
          "Let legs be a and b. Area: ab/2 = 30 → ab = 60.",
          "Pythagoras: a² + b² = 169.",
          "Note: (a + b)² = a² + 2ab + b² = 169 + 120 = 289 → a + b = 17.",
          "So a and b are roots of x² − 17x + 60 = 0 → (x − 12)(x − 5) = 0.",
          "Legs: 5 cm and 12 cm."
        ],
        "insight": "Use both Pythagoras and the area to get sum and product of legs, then build the quadratic."
      },
      "visual_description": "A right-angled triangle with legs labelled a and b. Two labels: 'ab/2 = Area' on the face, 'a² + b² = hyp²' on the hypotenuse. An arrow shows the path: area → product, Pythagoras → sum of squares → derive sum, then Vieta to build the quadratic.",
      "svg_diagrams": [
        {
          "id": "rt_triangle_quadratic",
          "title": "Right Triangle → Quadratic Setup",
          "svg": "<svg viewBox=\"0 0 240 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <polygon points=\"20,140 20,30 180,140\" fill=\"#eff6ff\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n  <rect x=\"20\" y=\"130\" width=\"10\" height=\"10\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"1.2\"/>\n  <text x=\"10\"  y=\"90\"  fill=\"#1e40af\">a</text>\n  <text x=\"95\"  y=\"155\" fill=\"#1e40af\">b</text>\n  <text x=\"95\"  y=\"80\"  fill=\"#9333ea\" font-style=\"italic\">c (hyp)</text>\n  <text x=\"40\"  y=\"110\" fill=\"#15803d\" font-size=\"10\">Area = ab/2</text>\n  <text x=\"30\"  y=\"20\"  fill=\"#374151\" font-size=\"10\">a²+b²=c²</text>\n</svg>"
        },
        {
          "id": "rectangle_path",
          "title": "Rectangle with Uniform Path",
          "svg": "<svg viewBox=\"0 0 240 150\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <rect x=\"10\" y=\"10\" width=\"220\" height=\"130\" rx=\"4\" fill=\"#fef9c3\" stroke=\"#eab308\" stroke-width=\"2\"/>\n  <rect x=\"30\" y=\"30\" width=\"180\" height=\"90\" rx=\"2\" fill=\"#fff\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n  <text x=\"120\" y=\"80\" text-anchor=\"middle\" fill=\"#1e40af\">l × b</text>\n  <text x=\"55\"  y=\"22\" fill=\"#92400e\" font-size=\"10\">w</text>\n  <text x=\"55\"  y=\"128\" fill=\"#92400e\" font-size=\"10\">w</text>\n  <text x=\"12\"  y=\"78\" fill=\"#92400e\" font-size=\"10\">w</text>\n  <text x=\"210\" y=\"78\" fill=\"#92400e\" font-size=\"10\">w</text>\n  <text x=\"120\" y=\"145\" text-anchor=\"middle\" fill=\"#713f12\" font-size=\"10\">Outer: (l+2w)(b+2w)</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Using perimeter instead of area for the product condition — perimeter gives sum, area gives product.",
        "Forgetting that diagonal² = l² + b² is not the same as l + b = diagonal.",
        "Rejecting both roots without checking — sometimes the problem has two valid geometric solutions.",
        "Setting up the quadratic for the wrong variable (e.g., for the perimeter when the area is what's quadratic)."
      ],
      "shortcuts_and_tricks": [
        "If sum S and product P of two lengths are known, the lengths are roots of x² − Sx + P = 0.",
        "For a rectangle with diagonal d: use l + b and l − b as a pair: l = (S + D)/2, b = (S − D)/2 where S = l+b, D² = 4lb − (l-b)².",
        "Right-triangle with area A and hypotenuse c: (a+b)² = c² + 4A. This gives a+b directly."
      ],
      "when_to_use_this_method": "Use when a geometry problem gives two conditions — typically area (product) and a length relationship (sum or difference) or Pythagoras. The pair of conditions naturally produces a quadratic.",
      "edge_cases": [
        "If both roots are positive and geometrically valid, state both solutions.",
        "For path-width problems, ensure the inner rectangle has positive dimensions: l − 2w > 0.",
        "If Pythagoras gives a² + b² and area gives ab, use (a+b)² = a²+b²+2ab to find a+b."
      ],
      "key_takeaway": "Two geometric conditions (area + length, or Pythagoras + area) pin down a quadratic. Name one dimension x, express the other in terms of x, substitute, reduce to standard form, solve, reject negatives.",
      "video_script_hooks": {
        "opening_hook": "A right-angled triangle with area 30 and hypotenuse 13. Two conditions, two unknowns — but you only need one quadratic equation to solve it all.",
        "mid_lesson_analogy": "Think of it as a locked box: the area gives you the product of the dimensions, the length condition gives you their sum. Vieta's formulas are the key.",
        "closing_takeaway_voiceover": "Name x. Write two conditions. Get sum and product. Build x² − Sx + P = 0. Solve. Reject negatives. State the answer with units."
      }
    }
  },
  {
    "topicId": "icse_math10_ch6_qprob_motion",
    "chapterNumber": 6,
    "key_formulas": [
      "Basic: d = v × t  →  t = d/v.",
      "Time saved: d/v − d/(v+k) = t_saved → multiply by v(v+k) → quadratic in v.",
      "Average speed for a round trip: if v₁ and v₂ are speeds over equal distances, avg = 2v₁v₂/(v₁+v₂).",
      "Upstream/downstream: if boat speed = b and stream speed = s, upstream speed = b−s, downstream = b+s."
    ],
    "name": "Quadratic Problems — Motion (Speed, Time, Distance)",
    "prerequisite_knowledge": [
      "Speed = Distance / Time  ↔  Time = Distance / Speed.",
      "If speed increases by k km/h, the new time is d/(v+k).",
      "LCM of two algebraic fractions to clear denominators.",
      "Rejecting negative speed or negative time roots."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Speed problems become quadratic whenever two different speeds (or the speed and a changed speed) appear in the same equation — typically 'the time difference is k hours.' The fraction difference equation d/v − d/(v+k) = t, when cleared of denominators, always produces a quadratic in v.",
      "derivation": [
        "Set up the time equation: t₁ − t₂ = Δt, where t₁ = d/v₁ and t₂ = d/v₂.",
        "Substitute: d/v − d/(v+k) = Δt.",
        "Multiply both sides by v(v+k): d(v+k) − dv = Δt · v(v+k).",
        "Simplify: dk = Δt · (v² + kv) → v² + kv − dk/Δt = 0.",
        "Solve for v; reject negative root."
      ],
      "worked_example": {
        "problem": "A train travels 360 km. If speed is increased by 5 km/h, it saves 1 hour. Find the original speed.",
        "solution": [
          "Let original speed = v km/h.",
          "360/v − 360/(v+5) = 1. Multiply by v(v+5):",
          "360(v+5) − 360v = v(v+5) → 1800 = v² + 5v.",
          "v² + 5v − 1800 = 0 → (v + 45)(v − 40) = 0.",
          "v = 40 km/h (reject v = −45)."
        ],
        "insight": "The numerator after clearing fractions is always distance × speed-increase = constant."
      },
      "visual_description": "A number line showing a journey of d km. Two arrows below: one labelled v (original, longer time bar) and one v+k (faster, shorter time bar). The gap between the time bars = Δt = time saved.",
      "svg_diagrams": [
        {
          "id": "speed_time_setup",
          "title": "Speed–Time Journey Setup",
          "svg": "<svg viewBox=\"0 0 280 120\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <line x1=\"20\" y1=\"40\" x2=\"260\" y2=\"40\" stroke=\"#4f46e5\" stroke-width=\"2.5\" marker-end=\"url(#arrowB)\"/>\n  <text x=\"140\" y=\"32\" text-anchor=\"middle\" fill=\"#4f46e5\">d km</text>\n  <rect x=\"20\" y=\"55\" width=\"220\" height=\"18\" rx=\"3\" fill=\"#dbeafe\" stroke=\"#3b82f6\"/>\n  <text x=\"130\" y=\"68\" text-anchor=\"middle\" fill=\"#1e40af\">Original: t = d/v</text>\n  <rect x=\"20\" y=\"82\" width=\"170\" height=\"18\" rx=\"3\" fill=\"#dcfce7\" stroke=\"#22c55e\"/>\n  <text x=\"105\" y=\"95\" text-anchor=\"middle\" fill=\"#166534\">Faster: t' = d/(v+k)</text>\n  <line x1=\"190\" y1=\"82\" x2=\"190\" y2=\"100\" stroke=\"#ef4444\" stroke-width=\"1\" stroke-dasharray=\"3\"/>\n  <text x=\"215\" y=\"96\" fill=\"#ef4444\">Δt saved</text>\n  <defs><marker id=\"arrowB\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L8,4 L0,8 Z\" fill=\"#4f46e5\"/></marker></defs>\n</svg>"
        },
        {
          "id": "boat_stream",
          "title": "Upstream / Downstream Setup",
          "svg": "<svg viewBox=\"0 0 260 100\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <rect x=\"5\" y=\"5\" width=\"250\" height=\"90\" rx=\"6\" fill=\"#f0f9ff\" stroke=\"#0284c7\" stroke-width=\"1.5\"/>\n  <text x=\"130\" y=\"24\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#0c4a6e\">Boat + Stream</text>\n  <text x=\"15\" y=\"46\" fill=\"#075985\">Downstream speed = b + s  (with current)</text>\n  <text x=\"15\" y=\"66\" fill=\"#075985\">Upstream speed   = b − s  (against current)</text>\n  <text x=\"15\" y=\"86\" fill=\"#075985\">Time eq:  d/(b+s) + d/(b−s) = T → quadratic in b or s</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Writing time as speed/distance instead of distance/speed.",
        "Multiplying only one term by v(v+k) when clearing fractions — must multiply every term.",
        "Forgetting that 'saves 1 hour' means the faster journey time is 1 less: t₁ − t₂ = 1, not t₁ + t₂ = 1.",
        "Not rejecting negative speed even when the algebra gives one as a root."
      ],
      "shortcuts_and_tricks": [
        "d × Δv = Δt × v(v + Δv) shortcut: the numerator after clearing is always d × k (k = speed increase).",
        "For boat problems, try both (b+s)(b−s) = b²−s² factorisation to simplify the denominator product.",
        "If problem gives total time (going + returning), write d/(v₁) + d/(v₂) = T and clear denominators."
      ],
      "when_to_use_this_method": "Use whenever a word problem involves two different speeds (or speeds in two directions) and a time constraint — time saved, total time, or time difference. The fraction d/v structure always produces a quadratic when cleared.",
      "edge_cases": [
        "If speed appears in the denominator and a root gives speed = 0, reject it (division by zero).",
        "Upstream speed = b − s must be positive → b > s; if a root implies b < s, reject it.",
        "Two valid positive speeds: both may represent valid scenarios (e.g., two trains with the same time difference)."
      ],
      "key_takeaway": "Time = distance ÷ speed. A time-difference condition with two speeds gives d/v − d/(v+k) = Δt. Clear fractions by multiplying by v(v+k). Expand, collect, solve. Reject negative speed.",
      "video_script_hooks": {
        "opening_hook": "A train takes 1 hour less if it goes 5 km/h faster. One extra piece of information — and suddenly you have a quadratic equation hiding in a train timetable.",
        "mid_lesson_analogy": "d/v is the key fraction. Two of them minus each other equals the time saved. Multiply by the product of denominators and the quadratic writes itself.",
        "closing_takeaway_voiceover": "t = d/v. Time difference = Δt. Multiply by v(v+k). Expand. Standard form. Solve. Reject the negative speed. Done."
      }
    }
  },
  {
    "topicId": "icse_math10_ch6_qprob_numbers",
    "chapterNumber": 6,
    "key_formulas": [
      "Product of two unknowns = c/a via Vieta (or direct setup).",
      "Sum of a number and its reciprocal: x + 1/x = k → x² − kx + 1 = 0.",
      "Two-digit number: tens digit t, units digit u → number = 10t + u; reversed = 10u + t.",
      "If digits sum to S and reversed number differs by D: set up two equations and reduce to quadratic."
    ],
    "name": "Quadratic Problems — Number-Based Problems",
    "prerequisite_knowledge": [
      "Consecutive integers: n and n+1 (or n−1 and n).",
      "Consecutive even/odd integers: n and n+2.",
      "Two-digit number: if tens digit = x, units digit = y → number = 10x + y.",
      "Reciprocal of x is 1/x (x ≠ 0).",
      "Sum and product of roots via Vieta's formulas."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Number problems always translate to 'I know two things about these unknowns — their sum and their product (or some algebraic combination).' Once you have sum and product, Vieta's formulas hand you the quadratic directly.",
      "derivation": [
        "Define the unknown(s) — usually let x = the number (or the smaller of two numbers).",
        "Translate 'sum' and 'product' conditions into expressions in x.",
        "Eliminate the second variable → quadratic in x.",
        "Solve and verify both roots satisfy ALL conditions of the problem."
      ],
      "worked_example": {
        "problem": "Find two positive numbers whose sum is 12 and sum of squares is 74.",
        "solution": [
          "Let the numbers be x and 12 − x.",
          "x² + (12 − x)² = 74 → x² + 144 − 24x + x² = 74.",
          "2x² − 24x + 70 = 0 → x² − 12x + 35 = 0.",
          "(x − 5)(x − 7) = 0 → x = 5 or x = 7.",
          "Numbers: 5 and 7."
        ],
        "insight": "Express the second number as (sum − first), substitute into the squared-sum condition."
      },
      "visual_description": "A table mapping problem types to their quadratic setup: 'consecutive integers' → n(n+1)=k; 'number + reciprocal' → x+1/x=k; 'two-digit' → 10t+u with digit-sum constraint; 'sum of squares' → x²+(S−x)²=k.",
      "svg_diagrams": [
        {
          "id": "number_problem_types",
          "title": "Common Number Problem Setups",
          "svg": "<svg viewBox=\"0 0 280 140\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <rect x=\"5\" y=\"5\" width=\"270\" height=\"130\" rx=\"6\" fill=\"#f0fdf4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/>\n  <text x=\"140\" y=\"22\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#14532d\">Number Problem → Quadratic</text>\n  <line x1=\"10\" y1=\"28\" x2=\"270\" y2=\"28\" stroke=\"#86efac\" stroke-width=\"1\"/>\n  <text x=\"15\" y=\"45\" fill=\"#166534\">Consecutive integers:   n(n+1) = k</text>\n  <text x=\"15\" y=\"63\" fill=\"#166534\">Consec. even/odd:      n(n+2) = k</text>\n  <text x=\"15\" y=\"81\" fill=\"#166534\">Num + reciprocal:      x + 1/x = k → x²−kx+1=0</text>\n  <text x=\"15\" y=\"99\" fill=\"#166534\">Sum of squares:        x² + (S−x)² = k</text>\n  <text x=\"15\" y=\"117\" fill=\"#166534\">Two-digit:             10t + u, digit sum/product</text>\n</svg>"
        },
        {
          "id": "digit_reversal_setup",
          "title": "Two-Digit Number Reversal",
          "svg": "<svg viewBox=\"0 0 260 110\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <rect x=\"5\" y=\"5\" width=\"250\" height=\"100\" rx=\"6\" fill=\"#fff7ed\" stroke=\"#f97316\" stroke-width=\"1.5\"/>\n  <text x=\"130\" y=\"24\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#7c2d12\">Two-Digit Number Problems</text>\n  <text x=\"15\" y=\"44\" fill=\"#9a3412\">Tens=t, Units=u:  Number = 10t + u</text>\n  <text x=\"15\" y=\"62\" fill=\"#9a3412\">Reversed:         10u + t</text>\n  <text x=\"15\" y=\"80\" fill=\"#9a3412\">Digit sum:        t + u = S</text>\n  <text x=\"15\" y=\"98\" fill=\"#9a3412\">Reversed − Original = ±D  → solve for t and u</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Setting x = larger number then getting a negative answer — name x as the smaller number to avoid confusion.",
        "In digit problems: writing 'the two-digit number = xy' (literal concatenation) instead of '10x + y'.",
        "For 'reciprocal' problems: forgetting to multiply through by x before forming the quadratic.",
        "Checking only one root: always verify both roots satisfy all stated conditions."
      ],
      "shortcuts_and_tricks": [
        "If sum S and product P are directly given, write the quadratic immediately: x² − Sx + P = 0.",
        "For consecutive integers n and n+1 with product P: n² + n − P = 0. Solve for n, then n+1 is automatic.",
        "Two-digit digit-reversal problems: reversed − original = 9(u − t). Use this as a shortcut."
      ],
      "when_to_use_this_method": "Use when the problem gives two numerical facts about one or two unknowns that can be combined into a single quadratic. Any 'find the number' or 'find the integers' problem with a product or sum-of-squares condition is in this category.",
      "edge_cases": [
        "Both roots valid: if the problem says 'find the numbers' without sign restrictions, both solutions may be correct.",
        "Consecutive even integers: if n is the smaller, it must be even — reject odd values of n.",
        "Digit problems: digits must satisfy 0 ≤ digit ≤ 9, and the tens digit must be ≥ 1."
      ],
      "key_takeaway": "Translate the problem into one equation with one unknown. Sum and product of two unknowns → Vieta quadratic x² − Sx + P = 0. Solve, check domain constraints (sign, digit range), state the answer.",
      "video_script_hooks": {
        "opening_hook": "Two numbers, two clues: their sum and their product. Did you know that's all you need to write a quadratic equation and find them both in under 30 seconds?",
        "mid_lesson_analogy": "Number problems are just Vieta's formulas in disguise. The 'two clues' are always sum and product — and Vieta hands you the equation for free.",
        "closing_takeaway_voiceover": "Name x. Get sum S and product P. Write x² − Sx + P = 0. Solve. Both roots are your two numbers — but check they satisfy ALL conditions before stating the final answer."
      }
    }
  },
  {
    "topicId": "icse_math10_ch6_qprob_work",
    "chapterNumber": 6,
    "key_formulas": [
      "Rate of work: person A finishes in T days → rate = 1/T per day.",
      "Together: 1/T₁ + 1/T₂ = 1/T_together.",
      "If T₁ = T₂ + k (one person is k days faster): substitute into combined-rate equation → quadratic.",
      "Fraction of work done in t days by person A = t/T₁."
    ],
    "name": "Quadratic Problems — Work and Time",
    "prerequisite_knowledge": [
      "Work rate = 1/T where T is the time to complete the job alone.",
      "Combined work rate = sum of individual rates: 1/T₁ + 1/T₂ = 1/T_combined.",
      "LCM to clear algebraic fractions.",
      "Rejecting zero or negative time roots."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Work problems become quadratic when the relationship between two workers' individual times is given (e.g., 'one takes d days more than the other') alongside the combined time. Substituting one time in terms of the other into the combined-rate equation produces a quadratic.",
      "derivation": [
        "Let the faster worker take x days. Slower worker takes x + d days.",
        "Combined rate: 1/x + 1/(x+d) = 1/T_combined.",
        "Multiply by x(x+d)·T_combined to clear fractions.",
        "Expand and collect → standard quadratic in x.",
        "Solve; reject negative or zero time."
      ],
      "worked_example": {
        "problem": "Two pipes together fill a tank in 6 hours. The larger pipe alone takes 5 hours less than the smaller. Find the time each pipe takes alone.",
        "solution": [
          "Let larger pipe take x hours. Smaller pipe takes x + 5 hours.",
          "1/x + 1/(x+5) = 1/6. Multiply by 6x(x+5):",
          "6(x+5) + 6x = x(x+5) → 12x + 30 = x² + 5x.",
          "x² − 7x − 30 = 0 → (x − 10)(x + 3) = 0.",
          "x = 10 (reject x = −3). Larger pipe: 10 h; smaller: 15 h."
        ],
        "insight": "Always let x be the FASTER worker (shorter time) so the other is x + d, keeping d positive."
      },
      "visual_description": "A tank with two inflow pipes. Labels show rate₁ = 1/x and rate₂ = 1/(x+d). A combined-rate arrow points to 1/T_total. The 'sum of rates = combined rate' equation sits below.",
      "svg_diagrams": [
        {
          "id": "work_rate_setup",
          "title": "Work Rate: Two Pipes Setup",
          "svg": "<svg viewBox=\"0 0 260 130\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <rect x=\"80\" y=\"60\" width=\"100\" height=\"60\" rx=\"4\" fill=\"#dbeafe\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n  <text x=\"130\" y=\"95\" text-anchor=\"middle\" fill=\"#1e40af\">Tank</text>\n  <line x1=\"60\"  y1=\"20\" x2=\"60\"  y2=\"60\" stroke=\"#0ea5e9\" stroke-width=\"3\"/>\n  <line x1=\"200\" y1=\"20\" x2=\"200\" y2=\"60\" stroke=\"#0ea5e9\" stroke-width=\"3\"/>\n  <text x=\"30\"   y=\"15\" fill=\"#0369a1\">Pipe 1: 1/x</text>\n  <text x=\"165\"  y=\"15\" fill=\"#0369a1\">Pipe 2: 1/(x+d)</text>\n  <line x1=\"60\"  y1=\"40\" x2=\"200\" y2=\"40\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"4\"/>\n  <text x=\"130\"  y=\"37\" text-anchor=\"middle\" fill=\"#64748b\" font-size=\"10\">Combined: 1/T</text>\n</svg>"
        },
        {
          "id": "work_combined_rate",
          "title": "Combined Rate Formula",
          "svg": "<svg viewBox=\"0 0 260 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"250\" height=\"70\" rx=\"6\" fill=\"#faf5ff\" stroke=\"#9333ea\" stroke-width=\"1.5\"/>\n  <text x=\"130\" y=\"26\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#581c87\">Combined Work Rate</text>\n  <text x=\"130\" y=\"48\" text-anchor=\"middle\" fill=\"#6b21a8\">1/T₁ + 1/T₂ = 1/T_combined</text>\n  <text x=\"130\" y=\"66\" text-anchor=\"middle\" fill=\"#7e22ce\" font-size=\"10\">(Each term = fraction of job done per unit time)</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Adding times instead of rates: T_combined ≠ T₁ + T₂. Always add the RATES (1/T₁ + 1/T₂).",
        "Using T₁ = T₂ + d with the wrong sign — if the larger pipe is faster, it has the SMALLER time.",
        "Forgetting to multiply ALL terms by the LCM when clearing fractions.",
        "Not rejecting negative time roots — a pipe cannot fill a tank in a negative number of hours."
      ],
      "shortcuts_and_tricks": [
        "Quick combined-rate check: if two pipes take T₁ and T₂ hours alone, combined = T₁·T₂/(T₁+T₂).",
        "If 'together T hours, one alone k hours more than the other': let faster = x, get x²+kx−T(x+(x+k))=0 → standard form.",
        "Always name x = the FASTER worker (shorter time) — this keeps d positive and avoids sign errors."
      ],
      "when_to_use_this_method": "Use when a work problem gives the combined time and a relationship between two individual times (difference or ratio). Substituting into 1/T₁ + 1/T₂ = 1/T_combined and clearing fractions always gives a quadratic.",
      "edge_cases": [
        "If one pipe fills and the other empties: combined rate = 1/T_fill − 1/T_empty = 1/T_net.",
        "Three workers: 1/T₁ + 1/T₂ + 1/T₃ = 1/T. If one relation is given, reduce to two unknowns then a quadratic.",
        "Partial work: 'A works for 2 days, then B joins' — account for the 2/T₁ already done before forming the combined-rate equation."
      ],
      "key_takeaway": "Work rate = 1/time. Add rates for combined work. Let x = faster time, other = x+d. Substitute into 1/x + 1/(x+d) = 1/T and clear fractions. Solve; reject negative time.",
      "video_script_hooks": {
        "opening_hook": "Two pipes, two times, one tank. The trick is: never add the times — add the rates. Once you do that, the quadratic writes itself.",
        "mid_lesson_analogy": "Think of each pipe as a fraction of the tank per hour. Pipe 1 fills 1/x per hour, Pipe 2 fills 1/(x+d). Together they fill 1/T. It's just a fraction equation — that becomes a quadratic.",
        "closing_takeaway_voiceover": "Rate = 1/time. Add rates: 1/x + 1/(x+d) = 1/T. Multiply by LCM. Standard form. Solve. Reject negative time. Done."
      }
    }
  },
  {
    "topicId": "icse_math10_ch7_proportion_basics",
    "chapterNumber": 7,
    "key_formulas": [
      "a:b :: c:d  ⟺  ad = bc  (product of extremes = product of means)",
      "Fourth proportional to a, b, c: d = bc/a",
      "Third proportional to a, b: c = b²/a  (i.e. a:b :: b:c)",
      "Mean proportional to a and b: x = √(ab)  (i.e. a:x :: x:b)"
    ],
    "prerequisite_knowledge": [
      "Ratio and simplification (Ch7 Part 1)",
      "Solving linear equations",
      "Square roots"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Proportion says two ratios are equal: a:b = c:d. Cross-multiply and you get ad = bc. This one rule unlocks finding any missing term. Mean proportional x between a and b means a:x = x:b, so x² = ab → x = √(ab).",
      "derivation": "a:b = c:d means a/b = c/d. Cross-multiply: ad = bc. Fourth proportional d = bc/a (solve for d). Third proportional: a:b :: b:c → b² = ac → c = b²/a. Mean proportional x: a:x :: x:b → x² = ab → x = √(ab).",
      "worked_example": "Find the fourth proportional to 3, 8, 15.\na=3, b=8, c=15. d = bc/a = (8×15)/3 = 40.\n\nFind the mean proportional between 4 and 25.\nx = √(4×25) = √100 = 10. Check: 4:10 :: 10:25 → 4×25=100, 10×10=100 ✓\n\nFind the third proportional to 6 and 12.\nc = b²/a = 144/6 = 24. Check: 6:12 :: 12:24 ✓",
      "visual_description": "Proportion a:b::c:d forms a rectangle of sides a,d and b,c — the two diagonals have equal products. On a number line, a, mean proportional, b are in geometric progression (each term × r = next term).",
      "svg_diagrams": [
        {
          "title": "Proportion — Cross Multiplication",
          "svg": "<svg viewBox=\"0 0 380 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"14\">\n  <rect width=\"380\" height=\"160\" fill=\"#fafafa\" rx=\"8\"/>\n  <text x=\"190\" y=\"22\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e3a8a\">a : b :: c : d</text>\n  <text x=\"60\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#1e40af\">a</text>\n  <text x=\"120\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#374151\">:</text>\n  <text x=\"170\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#1e40af\">b</text>\n  <text x=\"220\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#374151\">::</text>\n  <text x=\"270\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#dc2626\">c</text>\n  <text x=\"310\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#374151\">:</text>\n  <text x=\"350\" y=\"65\" text-anchor=\"middle\" font-size=\"22\" fill=\"#dc2626\">d</text>\n  <line x1=\"60\" y1=\"75\" x2=\"350\" y2=\"100\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"4\"/>\n  <line x1=\"170\" y1=\"75\" x2=\"270\" y2=\"100\" stroke=\"#1e40af\" stroke-width=\"2\" stroke-dasharray=\"4\"/>\n  <text x=\"190\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" fill=\"#dc2626\">Extremes: a × d</text>\n  <text x=\"190\" y=\"135\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1e40af\">Means: b × c</text>\n  <text x=\"190\" y=\"153\" text-anchor=\"middle\" font-size=\"12\" fill=\"#6b7280\">ad = bc</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Confusing third proportional (a:b::b:c → c=b²/a) with mean proportional (a:x::x:b → x=√ab). Both involve 'b repeated' but in different positions.",
        "Fourth proportional d = bc/a — forgetting to cross-multiply and instead doing ad/c = b.",
        "Mean proportional is always positive: x = +√(ab), never negative.",
        "Third proportional requires a and b non-zero; mean proportional requires a and b to have the same sign (both positive in real problems)."
      ],
      "shortcuts_and_tricks": [
        "For fourth proportional: write the four terms with d as unknown, cross-multiply: d = (b×c)/a.",
        "For mean proportional between two numbers, spot the pattern: √(smaller × larger).",
        "If a, b, c are in continued proportion (a:b::b:c), then b² = ac — useful for finding unknowns."
      ],
      "when_to_use_this_method": "Use fourth proportional for scaling (map distances, currency conversion). Use mean proportional when the geometric mean is needed (geometric sequences, areas of similar figures).",
      "edge_cases": [
        "Mean proportional of two negative numbers is imaginary — in ICSE problems both numbers are always positive.",
        "If a = 0, proportion breaks down (division by zero in fourth proportional formula).",
        "Continued proportion a:b::b:c means b is BOTH a mean and an extreme — it appears twice."
      ],
      "key_takeaway": "Proportion: ad = bc. Fourth proportional = bc/a. Third proportional = b²/a. Mean proportional = √(ab). Cross-multiply first, then solve.",
      "video_script_hooks": {
        "hook_question": "If 5 pencils cost ₹15, what do 8 pencils cost? That's a proportion — and today we'll see how to crack any version of it.",
        "mid_lesson_analogy": "Think of a:b::c:d as a seesaw balanced at the middle: extremes (a and d) on the outside must weigh exactly as much as means (b and c) on the inside — ad = bc.",
        "closing_takeaway_voiceover": "Product of extremes = product of means. Fourth proportional: d = bc/a. Mean proportional: x = √(ab). Third proportional: c = b²/a. Four terms, one rule."
      }
    }
  },
  {
    "topicId": "icse_math10_ch7_proportion_problems",
    "chapterNumber": 7,
    "key_formulas": [
      "C&D: (a+b)/(a−b) = (c+d)/(c−d)",
      "If a/b = c/d, then ka/kb = c/d (scaling invariant)",
      "Proof strategy: set a/b = c/d = k; substitute a=kb, c=kd; simplify LHS and RHS",
      "For equations: cross-multiply, then rearrange to standard form",
      "Continued proportion a:b::b:c → b² = ac (geometric mean relationship)"
    ],
    "prerequisite_knowledge": [
      "All proportion properties (Ch7 Part 3)",
      "Quadratic equations (Ch5–6) — needed when 'continued proportion' gives b²=ac",
      "Algebraic identity manipulation"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Proportion problems in ICSE come in two flavours: (1) 'If a/b = c/d, prove/find this expression' — use the appropriate property or substitute a=kb; (2) 'Given this complex ratio equation, find x' — apply C&D to isolate x. The substitute-and-simplify method (a=kb, c=kd) works for every proof.",
      "derivation": "Standard proof blueprint:\n1. Let a/b = c/d = k → a = kb, c = kd.\n2. Substitute into the LHS of what you want to prove.\n3. Factor out k and simplify.\n4. Show it equals the RHS (usually a fixed number or the same k).\n\nFor C&D problems: if given (px+qy)/(px−qy) = r/s, apply invertendo then C&D to find x:y.",
      "worked_example": "If a/b = c/d, prove (a²+c²)/(b²+d²) = ac/bd.\nLet a = kb, c = kd.\nLHS = (k²b²+k²d²)/(b²+d²) = k²(b²+d²)/(b²+d²) = k².\nRHS = (kb)(kd)/(bd) = k²bd/bd = k².\nLHS = RHS ✓\n\nSolve: (2x+3)/(2x−3) = 5/3. Apply C&D:\n2x/(3) → wait, use: numerator sum/numerator diff = (5+3)/(5−3) = 4 on right... use original C&D:\n(2x+3+2x−3)/(2x+3−2x+3) = (5+3)/(5−3) → 4x/6 = 8/2 → 4x/6=4 → x=6.",
      "visual_description": "Proportion proofs flow like a funnel: start wide with a/b=c/d=k; substitute a=kb, c=kd; the expression collapses to a simple form (k^n or a constant). Always verify by substituting a concrete example (e.g., a=2, b=1, c=4, d=2).",
      "svg_diagrams": [
        {
          "title": "Proof Strategy Using k-Substitution",
          "svg": "<svg viewBox=\"0 0 400 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\">\n  <rect width=\"400\" height=\"160\" fill=\"#f0fdf4\" rx=\"8\"/>\n  <text x=\"200\" y=\"20\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#166534\">Proof Blueprint: a/b = c/d</text>\n  <rect x=\"10\" y=\"30\" width=\"380\" height=\"28\" fill=\"#dcfce7\" rx=\"4\"/>\n  <text x=\"200\" y=\"49\" text-anchor=\"middle\" fill=\"#166534\">Step 1: Set a/b = c/d = k  →  a = kb, c = kd</text>\n  <rect x=\"10\" y=\"64\" width=\"380\" height=\"28\" fill=\"#bbf7d0\" rx=\"4\"/>\n  <text x=\"200\" y=\"83\" text-anchor=\"middle\" fill=\"#15803d\">Step 2: Substitute into LHS of expression</text>\n  <rect x=\"10\" y=\"98\" width=\"380\" height=\"28\" fill=\"#86efac\" rx=\"4\"/>\n  <text x=\"200\" y=\"117\" text-anchor=\"middle\" fill=\"#14532d\">Step 3: Factor out k / k² / k³; cancel</text>\n  <rect x=\"10\" y=\"132\" width=\"380\" height=\"22\" fill=\"#4ade80\" rx=\"4\"/>\n  <text x=\"200\" y=\"147\" text-anchor=\"middle\" fill=\"#14532d\" font-weight=\"bold\">Step 4: Show equals RHS  ✓</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Writing a = kb and then treating k as a known number — k is just a label for the common ratio; leave it in and it cancels.",
        "In C&D problems, applying C&D in the wrong direction — if given (a+b)/(a−b), C&D takes you back to a/b.",
        "Forgetting to check: if a−b = 0 in C&D, the formula is invalid.",
        "In continued proportion proofs, b² = ac — squaring both sides later loses the sign; be careful."
      ],
      "shortcuts_and_tricks": [
        "For 'if a:b = c:d prove P = Q' proofs: always try k-substitution first. It works ≥90% of the time in ICSE.",
        "For 'find x given a complex ratio' problems: apply C&D twice if needed, or use invertendo first to get a simpler ratio, then C&D.",
        "Verify your answer by substituting back into the original proportion — takes 10 seconds and secures full marks."
      ],
      "when_to_use_this_method": "Use k-substitution for all 'prove that' proportion questions. Use C&D for 'find x' ratio equations. Use the K-property for sums of multiple equal ratios.",
      "edge_cases": [
        "When the equation gives a = b after C&D, the original fraction was undefined (0 denominator) — flag this in your solution.",
        "Continued proportion a:b::b:c with negative numbers — b² = ac is still valid but verify the sign of b.",
        "Some ICSE problems give three variables in proportion; use elimination after cross-multiplication."
      ],
      "key_takeaway": "Every proportion proof uses the same move: a=kb, c=kd, substitute, cancel k. Every 'find x' problem uses C&D or cross-multiplication. Master these two moves and ratio/proportion problems become mechanical.",
      "video_script_hooks": {
        "hook_question": "In ICSE 2023 they asked: 'If a/b = c/d prove that (a³+ab²)/(c³+cd²) = (a²b+b³)/(c²d+d³).' Can you prove it in 4 lines using one trick? Let's see.",
        "mid_lesson_analogy": "k-substitution is your Swiss Army knife. Every proof of the form 'if a/b = c/d prove ...' snaps open with the same blade: set both ratios equal to k, write a=kb, substitute, and watch the expression collapse.",
        "closing_takeaway_voiceover": "Two tools: (1) k-substitution for proofs — a=kb cleans everything. (2) C&D for equations — sum over difference. These two tools crack every ratio-proportion problem in ICSE Class 10."
      }
    }
  },
  {
    "topicId": "icse_math10_ch7_proportion_properties",
    "chapterNumber": 7,
    "key_formulas": [
      "Given a:b = c:d (i.e. a/b = c/d):",
      "Invertendo:    b/a = d/c",
      "Alternendo:    a/c = b/d",
      "Componendo:    (a+b)/b = (c+d)/d",
      "Dividendo:     (a−b)/b = (c−d)/d",
      "Componendo-Dividendo (C&D): (a+b)/(a−b) = (c+d)/(c−d)",
      "K-property:    (a+c+e)/(b+d+f) = a/b = c/d = e/f  (all equal ratios)"
    ],
    "prerequisite_knowledge": [
      "Proportion basics — product of means and extremes",
      "Algebraic manipulation — adding fractions"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "All these properties follow from one fact: a/b = c/d = k. You can add 1 to both sides (componendo), subtract 1 (dividendo), flip both (invertendo), or swap diagonals (alternendo). Componendo-dividendo (C&D) is the workhorse: it turns a ratio of two sums into a ratio of differences — perfect for simplifying complex ICSE expressions.",
      "derivation": "Let a/b = c/d = k, so a = kb, c = kd.\nComponento: (a+b)/b = (kb+b)/b = k+1 = (kd+d)/d = (c+d)/d ✓.\nDividendo: (a−b)/b = (kb−b)/b = k−1 = (c−d)/d ✓.\nC&D: divide componendo by dividendo: (a+b)/(a−b) = (k+1)/(k−1) = (c+d)/(c−d) ✓.\nAlternendo: a/c = kb/kd = b/d ✓.",
      "worked_example": "If a/b = 3/5, find (2a+3b)/(2a−3b).\nLet a = 3k, b = 5k. (2×3k + 3×5k)/(2×3k − 3×5k) = (6k+15k)/(6k−15k) = 21k/(−9k) = −7/3.\n\nUsing C&D: If (x+y)/(x−y) = 7/3, find x:y.\nC&D reverse: (x+y+x−y)/(x+y−x+y) = (7+3)/(7−3) → 2x/2y = 10/4 → x/y = 5/2.",
      "visual_description": "Think of a fraction a/b = c/d as a balanced scale. Invertendo flips both pans. Componendo adds 'b' to the top pan and 'd' to the other. Dividendo removes them. C&D is 'pan-sum over pan-difference' — a powerful shortcut that eliminates the common ratio k.",
      "svg_diagrams": [
        {
          "title": "Properties of Proportion — Summary",
          "svg": "<svg viewBox=\"0 0 440 200\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"12\">\n  <rect width=\"440\" height=\"200\" fill=\"#f8fafc\" rx=\"8\"/>\n  <text x=\"220\" y=\"20\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#1e3a8a\">If a/b = c/d, then:</text>\n  <rect x=\"8\" y=\"28\" width=\"200\" height=\"24\" fill=\"#dbeafe\" rx=\"3\"/>\n  <text x=\"108\" y=\"44\" text-anchor=\"middle\" fill=\"#1e40af\">Invertendo: b/a = d/c</text>\n  <rect x=\"228\" y=\"28\" width=\"204\" height=\"24\" fill=\"#dbeafe\" rx=\"3\"/>\n  <text x=\"330\" y=\"44\" text-anchor=\"middle\" fill=\"#1e40af\">Alternendo: a/c = b/d</text>\n  <rect x=\"8\" y=\"58\" width=\"200\" height=\"24\" fill=\"#dcfce7\" rx=\"3\"/>\n  <text x=\"108\" y=\"74\" text-anchor=\"middle\" fill=\"#166534\">Componendo: (a+b)/b=(c+d)/d</text>\n  <rect x=\"228\" y=\"58\" width=\"204\" height=\"24\" fill=\"#dcfce7\" rx=\"3\"/>\n  <text x=\"330\" y=\"74\" text-anchor=\"middle\" fill=\"#166534\">Dividendo: (a−b)/b=(c−d)/d</text>\n  <rect x=\"8\" y=\"88\" width=\"424\" height=\"30\" fill=\"#fef3c7\" rx=\"3\"/>\n  <text x=\"220\" y=\"108\" text-anchor=\"middle\" fill=\"#92400e\" font-weight=\"bold\">Componendo-Dividendo: (a+b)/(a−b) = (c+d)/(c−d)</text>\n  <rect x=\"8\" y=\"124\" width=\"424\" height=\"24\" fill=\"#fce7f3\" rx=\"3\"/>\n  <text x=\"220\" y=\"140\" text-anchor=\"middle\" fill=\"#9d174d\">K-property: (a+c)/(b+d) = a/b = c/d (when ratios equal)</text>\n  <text x=\"220\" y=\"175\" text-anchor=\"middle\" font-size=\"11\" fill=\"#6b7280\">All follow from setting a/b = c/d = k and substituting a=kb, c=kd</text>\n  <text x=\"220\" y=\"192\" text-anchor=\"middle\" font-size=\"11\" fill=\"#ef4444\">★ C&D is the most tested property in ICSE board exams</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "C&D formula: (a+b)/(a−b) = (c+d)/(c−d) — NOT (a+b)/(c+d) = (a−b)/(c−d). Top and bottom must both come from the same original ratio.",
        "Alternendo swaps the means: a/c = b/d, NOT a/d = b/c.",
        "K-property: if a/b = c/d = e/f = k, then (a+c+e)/(b+d+f) = k. This works ONLY when all ratios are equal.",
        "Dividendo: (a−b)/b = (c−d)/d. Do NOT write (a−b)/a on the left side."
      ],
      "shortcuts_and_tricks": [
        "C&D shortcut: if given (x+y)/(x−y) = p/q, then x/y = (p+q)/(p−q) by applying C&D once more.",
        "For proofs: assume a/b = c/d = k; write a=kb, c=kd; substitute; simplify; the result always works out cleanly.",
        "Memorise C&D as: 'sum over difference on left equals sum over difference on right — matching positions'."
      ],
      "when_to_use_this_method": "Use C&D when an expression contains (a+b) and (a−b) and you're asked to simplify or prove a ratio. Use K-property when summing multiple equal ratios. Invertendo/alternendo are useful in two-step ratio proofs.",
      "edge_cases": [
        "C&D requires a ≠ b and c ≠ d (otherwise denominator is zero).",
        "K-property fails if ratios are NOT all equal.",
        "Dividendo gives a negative numerator when a < b — that's fine, just carry the sign."
      ],
      "key_takeaway": "C&D is the star property: (a+b)/(a−b) = (c+d)/(c−d). Prove by substituting a=kb, c=kd. K-property handles sums of equal ratios. Always state which property you're using in board answers.",
      "video_script_hooks": {
        "hook_question": "Can you simplify (3x+2y)/(3x−2y) if x:y = 4:3? Yes — with one property you've never used before.",
        "mid_lesson_analogy": "Componendo-dividendo is like mixing colours. If red:blue = 3:5 in both pots, then 'total colour' and 'colour difference' keep the same ratio in each pot.",
        "closing_takeaway_voiceover": "Given a/b = c/d: flip → invertendo; swap diagonals → alternendo; add 1 → componendo; subtract 1 → dividendo; combine → C&D. Learn the C&D form cold — it appears on every ICSE paper."
      }
    }
  },
  {
    "topicId": "icse_math10_ch7_ratio_basics",
    "chapterNumber": 7,
    "key_formulas": [
      "Ratio a : b = a/b  (b ≠ 0)",
      "Duplicate ratio of a:b = a² : b²",
      "Triplicate ratio of a:b = a³ : b³",
      "Sub-duplicate ratio of a:b = √a : √b",
      "Sub-triplicate ratio of a:b = ∛a : ∛b",
      "Reciprocal ratio of a:b = b : a",
      "Compound ratio of (a:b) and (c:d) = ac : bd"
    ],
    "prerequisite_knowledge": [
      "HCF and simplification of fractions",
      "Squares, cubes, square roots and cube roots",
      "Basic algebraic substitution"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A ratio compares two quantities of the same type — 3:4 means 'for every 3 parts of A there are 4 of B.' It is just a fraction written with a colon. Simplify by dividing both terms by their HCF, exactly like simplifying a fraction.",
      "derivation": "Duplicate ratio compounds a:b with itself: (a×a):(b×b) = a²:b². Triplicate compounds three times: a³:b³. Sub-duplicate is the reverse — take the square root of each term to 'undo' the squaring: √a:√b. Compound ratio multiplies corresponding terms: (a:b) × (c:d) = (ac):(bd).",
      "worked_example": "Find the compound ratio of 3:4 and 8:9.\nCompound = (3×8):(4×9) = 24:36 = 2:3.\n\nFind the sub-duplicate ratio of 25:49.\nSub-duplicate = √25:√49 = 5:7.\n\nIf a:b = 5:6, find the duplicate and reciprocal ratios.\nDuplicate = 25:36. Reciprocal = 6:5.",
      "visual_description": "Imagine two bags of marbles. If bag A has 15 marbles and bag B has 20, the ratio is 15:20 = 3:4 after dividing by HCF 5. A number line divided in ratio 3:4 splits a length of 7 units into two segments of length 3 and 4.",
      "svg_diagrams": [
        {
          "title": "Ratio Types — Summary",
          "svg": "<svg viewBox=\"0 0 420 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\">\n  <rect width=\"420\" height=\"180\" fill=\"#f0f4ff\" rx=\"8\"/>\n  <text x=\"210\" y=\"22\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#1e3a8a\">Ratio a : b — Derived Ratios</text>\n  <rect x=\"10\" y=\"32\" width=\"190\" height=\"30\" fill=\"#dbeafe\" rx=\"4\"/>\n  <text x=\"105\" y=\"52\" text-anchor=\"middle\" fill=\"#1e40af\">Duplicate: a² : b²</text>\n  <rect x=\"220\" y=\"32\" width=\"190\" height=\"30\" fill=\"#dbeafe\" rx=\"4\"/>\n  <text x=\"315\" y=\"52\" text-anchor=\"middle\" fill=\"#1e40af\">Triplicate: a³ : b³</text>\n  <rect x=\"10\" y=\"72\" width=\"190\" height=\"30\" fill=\"#dcfce7\" rx=\"4\"/>\n  <text x=\"105\" y=\"92\" text-anchor=\"middle\" fill=\"#166534\">Sub-duplicate: √a : √b</text>\n  <rect x=\"220\" y=\"72\" width=\"190\" height=\"30\" fill=\"#dcfce7\" rx=\"4\"/>\n  <text x=\"315\" y=\"92\" text-anchor=\"middle\" fill=\"#166534\">Sub-triplicate: ∛a : ∛b</text>\n  <rect x=\"10\" y=\"112\" width=\"190\" height=\"30\" fill=\"#fef9c3\" rx=\"4\"/>\n  <text x=\"105\" y=\"132\" text-anchor=\"middle\" fill=\"#854d0e\">Reciprocal: b : a</text>\n  <rect x=\"220\" y=\"112\" width=\"190\" height=\"30\" fill=\"#fef9c3\" rx=\"4\"/>\n  <text x=\"315\" y=\"132\" text-anchor=\"middle\" fill=\"#854d0e\">Compound (a:b)×(c:d)=ac:bd</text>\n  <text x=\"210\" y=\"168\" text-anchor=\"middle\" font-size=\"11\" fill=\"#6b7280\">All derived from the base ratio a:b by algebraic manipulation</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Confusing duplicate ratio (a²:b²) with doubling the ratio (2a:2b). Duplicate means square each term.",
        "Thinking ratio a:b = b:a — order matters; 3:4 ≠ 4:3.",
        "Forgetting to simplify after computing compound ratio — always divide both terms by their HCF.",
        "Sub-duplicate of a:b is NOT a/2 : b/2 — it is √a : √b."
      ],
      "shortcuts_and_tricks": [
        "To find k such that (a+k):(b+k) = p:q, cross-multiply: q(a+k) = p(b+k), then solve for k.",
        "For compound ratio of three pairs, multiply all numerators and all denominators: (a×c×e):(b×d×f).",
        "Check ratio type by asking: 'was a:b squared, cubed, or square-rooted to get the new ratio?'"
      ],
      "when_to_use_this_method": "Use ratio simplification whenever two quantities are compared — dividing a quantity, sharing profits/losses, scale models. Use duplicate/sub-duplicate when areas or lengths are connected (area ∝ side²).",
      "edge_cases": [
        "Ratio is undefined when the second term is zero — b ≠ 0 always.",
        "Ratio requires same units — you cannot form a ratio of 5 km and 3 hours directly.",
        "If both terms are negative, convert to positive before forming ratio: (−6):(−8) = 3:4."
      ],
      "key_takeaway": "Ratio = fraction with a colon. Simplify by HCF. Duplicate = square each term; sub-duplicate = square-root each term. Compound = multiply matching terms.",
      "video_script_hooks": {
        "hook_question": "If 3 kg of mangoes cost ₹120, what is the cost of 7 kg? The answer uses ratio — let's see how.",
        "mid_lesson_analogy": "Think of ratio as a recipe. If a cake needs 2 cups of flour for every 1 cup of sugar (2:1), doubling the recipe gives 4:2 — the ratio stays 2:1. Simplification keeps the 'flavour' the same.",
        "closing_takeaway_voiceover": "Ratio = fraction with colon. Simplify. Duplicate → square each term. Sub-duplicate → root each term. Compound → multiply top × top, bottom × bottom. That's it."
      }
    }
  },
  {
    "topicId": "icse_math10_ch8_factor_theorem",
    "chapterNumber": 8,
    "key_formulas": [
      "Factor Theorem: (x − a) is a factor of p(x)  ⟺  p(a) = 0",
      "Converse: if p(a) = 0, then (x − a) is a factor",
      "For (ax + b): it is a factor ⟺ p(−b/a) = 0",
      "Roots of p(x) = 0 correspond exactly to linear factors of p(x)"
    ],
    "prerequisite_knowledge": [
      "Remainder Theorem (Ch8 Part 1)",
      "Evaluating polynomials by substitution",
      "Basic factorisation of quadratics"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Factor Theorem is Remainder Theorem with remainder = 0. If plugging in x=a gives p(a)=0, the curve touches the x-axis at a, which means (x−a) divides evenly into p(x) with no leftover.",
      "derivation": "From Remainder Theorem: p(x) = (x−a)·q(x) + p(a). If p(a)=0, then p(x) = (x−a)·q(x) — so (x−a) divides p(x) exactly. Conversely, if (x−a) | p(x), then p(x) = (x−a)·q(x), so p(a) = 0·q(a) = 0.",
      "worked_example": "Show (x−2) is a factor of p(x) = x³ − 6x² + 11x − 6.\np(2) = 8 − 24 + 22 − 6 = 0. So (x−2) is a factor ✓.\n\nFind k if (x−3) is a factor of x³ − kx² + 2x − 6.\np(3) = 0: 27 − 9k + 6 − 6 = 0 → 27 − 9k = 0 → k = 3.",
      "visual_description": "Factor theorem identifies the x-intercepts of a polynomial curve. Each x-intercept at x=a corresponds to a factor (x−a). A cubic with three intercepts has three linear factors.",
      "svg_diagrams": [
        {
          "title": "Factor Theorem — Roots and Factors",
          "svg": "<svg viewBox=\"0 0 420 170\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\">\n  <rect width=\"420\" height=\"170\" fill=\"#fafafa\" rx=\"8\"/>\n  <text x=\"210\" y=\"20\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#1e3a8a\">Factor Theorem</text>\n  <rect x=\"10\" y=\"28\" width=\"400\" height=\"30\" fill=\"#dbeafe\" rx=\"4\"/>\n  <text x=\"210\" y=\"48\" text-anchor=\"middle\" fill=\"#1e40af\">(x − a) is a factor of p(x)  ⟺  p(a) = 0</text>\n  <line x1=\"30\" y1=\"100\" x2=\"390\" y2=\"100\" stroke=\"#9ca3af\" stroke-width=\"1.5\"/>\n  <text x=\"30\" y=\"115\" fill=\"#6b7280\" font-size=\"11\">x</text>\n  <text x=\"30\" y=\"90\" fill=\"#dc2626\" font-size=\"12\">•</text>\n  <text x=\"20\" y=\"87\" fill=\"#dc2626\" font-size=\"11\">a</text>\n  <text x=\"30\" y=\"75\" fill=\"#dc2626\" font-size=\"11\">p(a)=0</text>\n  <path d=\"M 50 130 Q 100 60 160 100 Q 220 140 280 100 Q 340 60 390 130\" fill=\"none\" stroke=\"#1e40af\" stroke-width=\"2\"/>\n  <circle cx=\"160\" cy=\"100\" r=\"4\" fill=\"#dc2626\"/>\n  <circle cx=\"280\" cy=\"100\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"155\" y=\"118\" fill=\"#dc2626\" font-size=\"11\">x=a₁</text>\n  <text x=\"275\" y=\"118\" fill=\"#dc2626\" font-size=\"11\">x=a₂</text>\n  <text x=\"210\" y=\"155\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"12\">Each root a → factor (x−a) → divide out to get next factor</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Factor Theorem tests one linear factor at a time — it does NOT give you all factors directly.",
        "p(2) = 4 means remainder is 4, NOT that (x−2) is a factor. Only p(2)=0 confirms a factor.",
        "After confirming (x−a) is a factor, you must still DIVIDE to find the other factor(s).",
        "Forgetting to check negative values: p(−1), p(−2), etc. are often the roots."
      ],
      "shortcuts_and_tricks": [
        "For integer roots of a monic cubic x³+bx²+cx+d, try all factors of d (positive and negative).",
        "Rational Root Theorem: if p(x) has integer coefficients, rational roots are ±(factor of constant)/(factor of leading coefficient).",
        "Once one factor (x−a) is found, divide p(x) by (x−a) using synthetic division to get the quadratic."
      ],
      "when_to_use_this_method": "Use Factor Theorem to test whether a given binomial is a factor, to find unknown coefficients when a factor is stated, and as the first step in fully factorising a cubic.",
      "edge_cases": [
        "Repeated roots: p(a)=0 and p'(a)=0 means (x−a)² is a factor — check by dividing twice.",
        "If no rational root exists (all integer tests fail), the cubic has no rational linear factors.",
        "For non-monic divisors like (2x−1), use x=1/2; do not divide the polynomial by 2 first."
      ],
      "key_takeaway": "Factor Theorem: p(a)=0 ⟺ (x−a) is a factor. To fully factorise a cubic: find one root by trial, divide to get quadratic, factorise quadratic.",
      "video_script_hooks": {
        "hook_question": "Your friend says '(x−5) is definitely a factor of x³−7x+10.' How do you check in one step — and prove them wrong or right?",
        "mid_lesson_analogy": "Factor Theorem is a pass/fail test. You plug in the suspect root. If p(a)=0, the expression passes — (x−a) is indeed a factor. If p(a)≠0, it fails — not a factor.",
        "closing_takeaway_voiceover": "Factor Theorem: p(a)=0 means (x−a) is a factor. Use it in reverse to find unknowns. Use it forward to confirm factors. Then divide out and factorise the quotient."
      }
    }
  },
  {
    "topicId": "icse_math10_ch8_polynomial_factorisation",
    "chapterNumber": 8,
    "key_formulas": [
      "Step 1 — Find root a by trial: try p(1), p(−1), p(2), p(−2), …",
      "Step 2 — Divide p(x) by (x−a) using long division or inspection",
      "Step 3 — Factorise the resulting quadratic",
      "Cubic identity: x³−a³ = (x−a)(x²+ax+a²)",
      "Cubic identity: x³+a³ = (x+a)(x²−ax+a²)",
      "Sum/product of roots (Vieta's): α+β+γ = −b/a; αβ+βγ+γα = c/a; αβγ = −d/a"
    ],
    "prerequisite_knowledge": [
      "Factor Theorem (Ch8 Part 2)",
      "Polynomial long division",
      "Factorisation of quadratics (Ch5)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Every cubic with rational roots can be cracked by the same three-step drill: trial-and-error one root → divide out to get a quadratic → factorise the quadratic. The trial step uses the Rational Root Theorem to shortlist candidates.",
      "derivation": "If p(a)=0, then p(x) = (x−a)·(x²+px+q). To find p and q: compare coefficients. Leading coefficient of cubic = leading coeff of (x−a)(x²+px+q) = 1. Constant term: −a·q = constant of p(x) → q. Middle terms by expansion and matching.",
      "worked_example": "Fully factorise p(x) = x³ − 6x² + 11x − 6.\nTrial: p(1)=1−6+11−6=0 ✓ → (x−1) is a factor.\nDivide: x³−6x²+11x−6 ÷ (x−1) = x²−5x+6.\nFactorise quadratic: x²−5x+6 = (x−2)(x−3).\nFull factorisation: (x−1)(x−2)(x−3).\n\nFactorise 2x³ + x² − 5x + 2:\np(1)=2+1−5+2=0 ✓ → (x−1) is a factor.\nDivide: 2x³+x²−5x+2 ÷ (x−1) = 2x²+3x−2.\nFactorise: (2x−1)(x+2).\nFull: (x−1)(2x−1)(x+2).",
      "visual_description": "A cubic p(x) has up to three real roots, each corresponding to an x-intercept. Finding roots by trial is like testing keys — the one that turns the lock (gives 0) unlocks the whole factorisation. Once one door is open, a quadratic key opens the rest.",
      "svg_diagrams": [
        {
          "title": "Cubic Factorisation — Three-Step Process",
          "svg": "<svg viewBox=\"0 0 440 170\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\">\n  <rect width=\"440\" height=\"170\" fill=\"#f0fdf4\" rx=\"8\"/>\n  <text x=\"220\" y=\"20\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#166534\">Cubic Factorisation Steps</text>\n  <rect x=\"10\" y=\"28\" width=\"130\" height=\"50\" fill=\"#dcfce7\" rx=\"6\"/>\n  <text x=\"75\" y=\"48\" text-anchor=\"middle\" fill=\"#166534\" font-weight=\"bold\">Step 1</text>\n  <text x=\"75\" y=\"64\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"11\">Trial: p(1),p(−1),</text>\n  <text x=\"75\" y=\"76\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"11\">p(2),p(−2)…</text>\n  <text x=\"148\" y=\"55\" text-anchor=\"middle\" fill=\"#374151\" font-size=\"18\">→</text>\n  <rect x=\"160\" y=\"28\" width=\"120\" height=\"50\" fill=\"#bbf7d0\" rx=\"6\"/>\n  <text x=\"220\" y=\"48\" text-anchor=\"middle\" fill=\"#15803d\" font-weight=\"bold\">Step 2</text>\n  <text x=\"220\" y=\"64\" text-anchor=\"middle\" fill=\"#15803d\" font-size=\"11\">Divide p(x) by</text>\n  <text x=\"220\" y=\"76\" text-anchor=\"middle\" fill=\"#15803d\" font-size=\"11\">(x−a) → quadratic</text>\n  <text x=\"288\" y=\"55\" text-anchor=\"middle\" fill=\"#374151\" font-size=\"18\">→</text>\n  <rect x=\"300\" y=\"28\" width=\"130\" height=\"50\" fill=\"#86efac\" rx=\"6\"/>\n  <text x=\"365\" y=\"48\" text-anchor=\"middle\" fill=\"#14532d\" font-weight=\"bold\">Step 3</text>\n  <text x=\"365\" y=\"64\" text-anchor=\"middle\" fill=\"#14532d\" font-size=\"11\">Factorise</text>\n  <text x=\"365\" y=\"76\" text-anchor=\"middle\" fill=\"#14532d\" font-size=\"11\">quadratic</text>\n  <rect x=\"10\" y=\"88\" width=\"420\" height=\"30\" fill=\"#fef9c3\" rx=\"4\"/>\n  <text x=\"220\" y=\"108\" text-anchor=\"middle\" fill=\"#854d0e\">Trial candidates (monic): ±factors of the constant term</text>\n  <rect x=\"10\" y=\"124\" width=\"420\" height=\"36\" fill=\"#dbeafe\" rx=\"4\"/>\n  <text x=\"220\" y=\"140\" text-anchor=\"middle\" fill=\"#1e40af\">Cubic identities: x³−a³=(x−a)(x²+ax+a²)</text>\n  <text x=\"220\" y=\"156\" text-anchor=\"middle\" fill=\"#1e40af\">x³+a³=(x+a)(x²−ax+a²)</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Testing only positive integers — always test negatives too (p(−1), p(−2), etc.).",
        "After finding (x−a) is a factor, forgetting to actually DIVIDE and getting stuck.",
        "Applying cubic identities only when the polynomial is in the exact form x³±a³ — check if it matches before using.",
        "Long division arithmetic errors — always verify the quotient by multiplying back: (x−a)·quotient = p(x)."
      ],
      "shortcuts_and_tricks": [
        "Inspection method for division: if p(x) = x³+bx²+cx+d and one factor is (x−a), write x³+bx²+cx+d = (x−a)(x²+px+q) and compare coefficients to find p and q without long division.",
        "For a monic cubic p(x), sum of all three roots = −(coefficient of x²).",
        "If p(1)=0 for any polynomial, you can always factorise out (x−1)."
      ],
      "when_to_use_this_method": "Use this whenever you need to fully factorise a cubic polynomial, solve a cubic equation, or find all roots of a degree-3 expression.",
      "edge_cases": [
        "A repeated root a means (x−a)² appears — after dividing once, check if the quotient also has root a.",
        "Some cubics have only one real root; the quadratic factor has negative discriminant (no real factorisation).",
        "Non-monic cubics (leading coeff ≠ 1): trial candidates are ±(factor of constant)/(factor of leading coeff)."
      ],
      "key_takeaway": "Three steps: find root by trial → divide to get quadratic → factorise quadratic. For sum/difference of cubes use the identities directly. Always verify by expanding.",
      "video_script_hooks": {
        "hook_question": "How do you break a cubic polynomial into three brackets? There's a reliable 3-step method that works every time in ICSE.",
        "mid_lesson_analogy": "Factorising a cubic is like cracking a combination lock with three dials. Once you find the first dial's setting (one root by trial), the other two dials become a 2-digit lock (quadratic) — much easier to crack.",
        "closing_takeaway_voiceover": "Step 1: trial substitution to find one root. Step 2: divide out the linear factor. Step 3: factorise the quadratic. Check with x³−a³ or x³+a³ identities when the structure matches."
      }
    }
  },
  {
    "topicId": "icse_math10_ch8_polynomial_problems",
    "chapterNumber": 8,
    "key_formulas": [
      "Given remainder r when dividing by (x−a): p(a) = r",
      "Given (x−a) is a factor: p(a) = 0",
      "Two conditions (two unknowns): set up simultaneous equations using above",
      "If p(x) leaves the same remainder when divided by (x−a) and (x−b): p(a) = p(b)",
      "HCF of two polynomials: use factor theorem to find common factors"
    ],
    "prerequisite_knowledge": [
      "Remainder Theorem and Factor Theorem (Ch8 Parts 1–2)",
      "Solving simultaneous linear equations",
      "Polynomial factorisation (Ch8 Part 3)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Most ICSE polynomial problems give you two pieces of information (e.g. 'remainder when divided by (x−2) is 3' AND '(x+1) is a factor') to find two unknowns (a, b). Each condition becomes one equation: p(2)=3 and p(−1)=0. Solve the pair simultaneously.",
      "derivation": "For p(x) = x³ + ax² + bx + c with unknowns a, b:\nCondition 1: remainder when divided by (x−k) is r → p(k) = r → one linear equation in a, b.\nCondition 2: (x−m) is a factor → p(m) = 0 → another linear equation in a, b.\nSolve simultaneously for a and b.",
      "worked_example": "Find a and b if (x−1) is a factor of p(x) = x³ + ax² − 5x + b, and the remainder when divided by (x+2) is −24.\nCondition 1 (factor): p(1) = 1 + a − 5 + b = 0 → a + b = 4 … (1).\nCondition 2 (remainder): p(−2) = −8 + 4a + 10 + b = −24 → 4a + b = −26 … (2).\nSubtract (1) from (2): 3a = −30 → a = −10, b = 14.",
      "visual_description": "Each condition pins down a point on the polynomial: 'factor condition' nails the curve to the x-axis at that point; 'remainder condition' fixes the y-value. Two conditions = two equations = two unknowns solved.",
      "svg_diagrams": [
        {
          "title": "Polynomial Problems — Two-Condition Setup",
          "svg": "<svg viewBox=\"0 0 420 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\">\n  <rect width=\"420\" height=\"160\" fill=\"#faf5ff\" rx=\"8\"/>\n  <text x=\"210\" y=\"20\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#581c87\">Finding Unknowns in a Polynomial</text>\n  <rect x=\"10\" y=\"28\" width=\"190\" height=\"50\" fill=\"#ede9fe\" rx=\"4\"/>\n  <text x=\"105\" y=\"46\" text-anchor=\"middle\" fill=\"#6d28d9\" font-weight=\"bold\">Remainder Condition</text>\n  <text x=\"105\" y=\"62\" text-anchor=\"middle\" fill=\"#6d28d9\" font-size=\"11\">p(x) ÷ (x−a) leaves r</text>\n  <text x=\"105\" y=\"74\" text-anchor=\"middle\" fill=\"#6d28d9\" font-size=\"11\">→ p(a) = r</text>\n  <rect x=\"220\" y=\"28\" width=\"190\" height=\"50\" fill=\"#ddd6fe\" rx=\"4\"/>\n  <text x=\"315\" y=\"46\" text-anchor=\"middle\" fill=\"#5b21b6\" font-weight=\"bold\">Factor Condition</text>\n  <text x=\"315\" y=\"62\" text-anchor=\"middle\" fill=\"#5b21b6\" font-size=\"11\">(x−b) is a factor</text>\n  <text x=\"315\" y=\"74\" text-anchor=\"middle\" fill=\"#5b21b6\" font-size=\"11\">→ p(b) = 0</text>\n  <rect x=\"10\" y=\"86\" width=\"400\" height=\"28\" fill=\"#c4b5fd\" rx=\"4\"/>\n  <text x=\"210\" y=\"105\" text-anchor=\"middle\" fill=\"#4c1d95\">Each condition gives ONE equation in the unknowns</text>\n  <rect x=\"10\" y=\"122\" width=\"400\" height=\"28\" fill=\"#7c3aed\" rx=\"4\"/>\n  <text x=\"210\" y=\"141\" text-anchor=\"middle\" fill=\"white\" font-weight=\"bold\">Solve simultaneous equations → find all unknowns</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Mixing up: 'remainder = r' means p(a) = r (not zero), while 'factor' means p(a) = 0.",
        "Writing p(a) = remainder when you should write p(a) = 0 for the factor condition.",
        "Arithmetic errors in substitution — expand carefully especially for cubic and squared terms with negative x values.",
        "Forgetting to verify: after finding a and b, substitute into both original conditions to confirm."
      ],
      "shortcuts_and_tricks": [
        "Write both equations immediately before doing any algebra — having both equations visible prevents confusion.",
        "Subtract one equation from the other to eliminate the constant b or the quadratic coefficient.",
        "For 'same remainder for two divisors': p(a) = p(b) → set the two substituted expressions equal."
      ],
      "when_to_use_this_method": "Use for any problem that gives you one or two conditions about remainders or factors of a polynomial with unknown coefficients. Also use to find the value of k such that a given binomial divides a given polynomial exactly.",
      "edge_cases": [
        "If only one condition is given, you can find only one unknown (the other is free or constrained differently).",
        "If both conditions give the same equation, the problem is under-determined — check whether you've misread.",
        "When asked to factorise after finding unknowns, use the factor theorem again on the now-known polynomial."
      ],
      "key_takeaway": "Two unknowns → two conditions → two equations from p(a)=r or p(a)=0. Solve simultaneously. Verify by substituting back. Then factorise the complete polynomial if asked.",
      "video_script_hooks": {
        "hook_question": "A polynomial has two mystery coefficients. You're given two clues about its remainders. Can you decode both coefficients? This is the most common ICSE polynomial question type.",
        "mid_lesson_analogy": "Think of polynomial problems as a detective case. Each 'remainder' or 'factor' clue is evidence. Two clues lock in two suspects (unknowns). Cross-reference the clues to close the case.",
        "closing_takeaway_voiceover": "Remainder condition: p(a) = r. Factor condition: p(a) = 0. Two conditions, two equations, solve simultaneously. Always verify. Then factorise if asked. That's the full ICSE polynomial toolkit."
      }
    }
  },
  {
    "topicId": "icse_math10_ch8_remainder_theorem",
    "chapterNumber": 8,
    "key_formulas": [
      "Remainder Theorem: if p(x) is divided by (x − a), remainder = p(a)",
      "Divisor (x + a): substitute x = −a → remainder = p(−a)",
      "Divisor (ax − b): substitute x = b/a → remainder = p(b/a)",
      "Divisor (ax + b): substitute x = −b/a → remainder = p(−b/a)"
    ],
    "prerequisite_knowledge": [
      "Polynomial notation and evaluation",
      "Substituting values into algebraic expressions",
      "Basic division algorithm: p(x) = d(x)·q(x) + r"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "When you divide p(x) by (x−a), the remainder is just p(a) — the value of the polynomial at x=a. You never need to do long division to find the remainder; simply plug in the root of the divisor.",
      "derivation": "By the division algorithm: p(x) = (x−a)·q(x) + r, where r is a constant (degree of r < degree of divisor = 1). Substitute x=a: p(a) = (a−a)·q(a) + r = 0 + r = r. So remainder r = p(a).",
      "worked_example": "Find the remainder when p(x) = 2x³ − 3x² + x − 5 is divided by (x − 2).\nRemainder = p(2) = 2(8) − 3(4) + 2 − 5 = 16 − 12 + 2 − 5 = 1.\n\nFind the remainder when x³ + 2x² − 5x + 1 is divided by (2x + 1).\nDivisor root: x = −1/2.\nRemainder = p(−1/2) = (−1/8) + 2(1/4) − 5(−1/2) + 1 = −1/8 + 1/2 + 5/2 + 1 = −1/8 + 4 = 31/8.",
      "visual_description": "Picture the polynomial curve y = p(x). The remainder when dividing by (x−a) is the y-value of the curve at x = a. If that y-value is 0, the curve passes through the x-axis at x=a and (x−a) is a factor.",
      "svg_diagrams": [
        {
          "title": "Remainder Theorem — Visual",
          "svg": "<svg viewBox=\"0 0 400 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\">\n  <rect width=\"400\" height=\"160\" fill=\"#f0f4ff\" rx=\"8\"/>\n  <text x=\"200\" y=\"22\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#1e3a8a\">Remainder Theorem</text>\n  <rect x=\"10\" y=\"32\" width=\"380\" height=\"36\" fill=\"#dbeafe\" rx=\"4\"/>\n  <text x=\"200\" y=\"52\" text-anchor=\"middle\" fill=\"#1e40af\" font-size=\"13\">p(x) = (x − a) · q(x)  +  r</text>\n  <text x=\"200\" y=\"68\" text-anchor=\"middle\" fill=\"#1e40af\" font-size=\"11\">Put x = a:  p(a) = 0 · q(a) + r  →  r = p(a)</text>\n  <rect x=\"10\" y=\"76\" width=\"180\" height=\"28\" fill=\"#dcfce7\" rx=\"4\"/>\n  <text x=\"100\" y=\"95\" text-anchor=\"middle\" fill=\"#166534\">Divisor (x−a):  sub x=a</text>\n  <rect x=\"210\" y=\"76\" width=\"180\" height=\"28\" fill=\"#dcfce7\" rx=\"4\"/>\n  <text x=\"300\" y=\"95\" text-anchor=\"middle\" fill=\"#166534\">Divisor (ax+b): sub x=−b/a</text>\n  <rect x=\"10\" y=\"112\" width=\"380\" height=\"36\" fill=\"#fef9c3\" rx=\"4\"/>\n  <text x=\"200\" y=\"128\" text-anchor=\"middle\" fill=\"#854d0e\" font-weight=\"bold\">Key: Remainder = p(root of divisor)</text>\n  <text x=\"200\" y=\"146\" text-anchor=\"middle\" fill=\"#854d0e\" font-size=\"11\">NO long division needed — just substitute!</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Confusing which value to substitute: for (x−3) use x=3, NOT x=−3.",
        "For (2x−1) the root is x=1/2, NOT x=2 or x=1.",
        "The remainder is the VALUE p(a), not the expression — it is a number, not a polynomial.",
        "If the remainder is 0, the divisor IS a factor (that is the factor theorem, below)."
      ],
      "shortcuts_and_tricks": [
        "For (x+a) remember it equals (x−(−a)) so substitute x=−a.",
        "Try x=1, −1, 2, −2 first when looking for factors (integers make arithmetic easy).",
        "To verify: substitute back into p(x) = d(x)·q(x) + r and check both sides match."
      ],
      "when_to_use_this_method": "Use Remainder Theorem whenever asked for the remainder of a polynomial division without actually dividing. Use it to check your long-division answer instantly.",
      "edge_cases": [
        "If the divisor is quadratic (e.g. x²−1), the remainder can be linear (ax+b), not just a constant — Remainder Theorem applies only to LINEAR divisors.",
        "p(x) can have degree < degree of divisor — in that case p(x) itself is the remainder.",
        "Fractional roots (e.g. x=3/2 for 2x−3) are valid; substitute carefully."
      ],
      "key_takeaway": "Remainder when dividing p(x) by a linear factor = value of p at the root of that factor. Substitute x=a for (x−a), x=−b/a for (ax+b). No long division needed.",
      "video_script_hooks": {
        "hook_question": "What's the remainder when x¹⁰⁰ − 1 is divided by (x−1)? You can answer in 2 seconds with one theorem.",
        "mid_lesson_analogy": "Think of the remainder theorem like a shortcut key. Instead of running the whole long-division program, you press one key — substitute the root — and get the answer instantly.",
        "closing_takeaway_voiceover": "Remainder = p(root of divisor). For (x−a): p(a). For (ax+b): p(−b/a). That's the whole theorem. Memorise it, and remainder questions become one-line answers."
      }
    }
  },
  {
    "topicId": "icse_math10_ch9_matrix_basics",
    "chapterNumber": 9,
    "key_formulas": [
      "Order of matrix: m×n (m rows, n columns)",
      "Element notation: aᵢⱼ = element in row i, column j",
      "Row matrix: 1×n  |  Column matrix: m×1",
      "Square matrix: m = n  |  Null matrix: all elements zero",
      "Identity matrix I: diagonal entries 1, rest 0",
      "Diagonal matrix: aᵢⱼ = 0 for i ≠ j",
      "Transpose: (Aᵀ)ᵢⱼ = Aⱼᵢ (rows become columns)",
      "Symmetric matrix: A = Aᵀ  |  Skew-symmetric: A = −Aᵀ"
    ],
    "prerequisite_knowledge": [
      "Reading rows and columns in a table",
      "Basic arithmetic (addition, subtraction, multiplication)",
      "Concept of variables and unknowns"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A matrix is a rectangular grid of numbers. Think of a spreadsheet: rows run left-right, columns run top-bottom. The order m×n tells you how many rows (m) and columns (n) the grid has. Every cell has an address aᵢⱼ — row number i first, column number j second, just like 'row 3 seat 2' in a cinema.",
      "derivation": "Matrix equality: two matrices A and B are equal iff they have the same order AND every corresponding element is equal: aᵢⱼ = bᵢⱼ for all i, j. This lets us set up equations when a matrix contains unknowns — equate matching entries one by one.",
      "worked_example": "Given A = [[2x+1, 3],[y−2, 4]] = [[5, 3],[1, 4]], find x and y.\nSolution: Match entry (1,1): 2x+1=5 → x=2. Match entry (2,1): y−2=1 → y=3.",
      "visual_description": "Draw a 2×3 matrix with labelled rows and columns. Annotate a₂₃ = element at row 2, col 3. Show a row matrix [1 2 3] and a column matrix [[1],[2],[3]] side by side. Show transpose flipping rows and columns: [[1,2],[3,4]]ᵀ = [[1,3],[2,4]].",
      "svg_diagrams": [
        {
          "title": "Matrix Anatomy — 2×3",
          "svg": "<svg viewBox=\"0 0 320 120\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"13\">\n  <rect x=\"10\" y=\"10\" width=\"300\" height=\"100\" rx=\"6\" fill=\"#f0f4ff\" stroke=\"#6366f1\" stroke-width=\"1.5\"/>\n  <text x=\"20\" y=\"32\" font-weight=\"bold\" fill=\"#1e1b4b\">Order: 2 × 3</text>\n  <text x=\"20\" y=\"55\" fill=\"#374151\">A = </text>\n  <text x=\"55\" y=\"55\" fill=\"#1d4ed8\">[  a₁₁  a₁₂  a₁₃  ]</text>\n  <text x=\"55\" y=\"75\" fill=\"#1d4ed8\">[  a₂₁  a₂₂  a₂₃  ]</text>\n  <text x=\"20\" y=\"100\" fill=\"#6b7280\" font-size=\"11\">aᵢⱼ : row i, column j</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Confusing row and column order: order is ROWS × COLUMNS, not the other way around.",
        "Thinking a 2×3 and a 3×2 matrix are the same — they are different orders.",
        "Treating matrix equality as just 'same numbers somewhere' — positions must match exactly.",
        "Forgetting that the transpose swaps rows and columns: (Aᵀ)ᵢⱼ = Aⱼᵢ, not Aᵢⱼ."
      ],
      "shortcuts_and_tricks": [
        "Order mnemonic: 'Rows Come Before Columns' → R×C.",
        "For a square matrix, check if A = Aᵀ (symmetric) by checking if aᵢⱼ = aⱼᵢ for all off-diagonal pairs.",
        "To find unknowns: equate matching positions and solve the resulting simple equations."
      ],
      "when_to_use_this_method": "Use matrix equality to set up equations whenever a matrix contains unknowns — equate entry-by-entry and solve each simple equation.",
      "edge_cases": [
        "A 1×1 matrix [[k]] is both a row matrix and a column matrix — it is also a square matrix.",
        "The null matrix is the additive identity: A + O = A for any matrix A of the same order.",
        "A diagonal matrix need not be square — ICSE typically only tests square diagonal matrices."
      ],
      "key_takeaway": "A matrix is defined by its order (m×n) and its elements aᵢⱼ. Equality requires matching order AND matching every element — use this to solve for unknowns.",
      "video_script_hooks": [
        "Open with a school timetable grid: 'You've been reading matrices your whole life — now we'll do algebra on them.'",
        "Use a cinema seat analogy for aᵢⱼ: row i, seat j.",
        "Demonstrate transpose by physically rotating a piece of paper 90°."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch9_matrix_multiplication",
    "chapterNumber": 9,
    "key_formulas": [
      "Compatibility: A(m×n) × B(n×p) → C(m×p)  [inner dimensions must match]",
      "Result element: cᵢⱼ = Σₖ aᵢₖ·bₖⱼ  (row i of A · col j of B)",
      "For 2×2: [[a,b],[c,d]]×[[e,f],[g,h]] = [[ae+bg, af+bh],[ce+dg, cf+dh]]",
      "NOT commutative: AB ≠ BA in general",
      "Associative: (AB)C = A(BC)",
      "Distributive: A(B+C) = AB+AC",
      "Identity: AI = IA = A  |  Null: AO = OA = O",
      "Transpose of product: (AB)ᵀ = BᵀAᵀ  (reverse order)"
    ],
    "prerequisite_knowledge": [
      "Matrix order and element notation",
      "Matrix addition and scalar multiplication",
      "Dot product concept (row × column)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Matrix multiplication is a 'row meets column' operation. To find the entry in row i, column j of the product: take row i of the left matrix and column j of the right matrix, multiply corresponding entries, and sum them. Think of it as each output cell being a 'score' from one team's row playing against another team's column.",
      "derivation": "For A(2×2)×B(2×2): the (1,1) entry of AB = a₁₁b₁₁ + a₁₂b₂₁ (row 1 of A · col 1 of B). The (1,2) entry = a₁₁b₁₂ + a₁₂b₂₂ (row 1 of A · col 2 of B). Continue for rows 2. Compatibility check: A must have as many columns as B has rows — inner dimensions match.",
      "worked_example": "A = [[1,2],[3,4]], B = [[2,0],[1,3]].\nAB(1,1) = 1×2+2×1 = 4. AB(1,2) = 1×0+2×3 = 6.\nAB(2,1) = 3×2+4×1 = 10. AB(2,2) = 3×0+4×3 = 12.\nAB = [[4,6],[10,12]].\nVerify AB ≠ BA: BA(1,1) = 2×1+0×3 = 2. BA = [[2,4],[10,13]] ≠ AB.",
      "visual_description": "Draw two 2×2 grids with a multiplication sign. Highlight row 1 of A in blue and column 1 of B in red; show the overlap gives entry (1,1) of AB. Repeat for (1,2). Add a callout box: 'Inner dimensions must match: (2×2)·(2×2) ✓; (2×3)·(2×2) ✗'. Show AB ≠ BA with computed numbers.",
      "svg_diagrams": [
        {
          "title": "2×2 Matrix Multiplication Schema",
          "svg": "<svg viewBox=\"0 0 360 110\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"350\" height=\"100\" rx=\"6\" fill=\"#fff7ed\" stroke=\"#ea580c\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#9a3412\" font-weight=\"bold\">[a  b] × [e  f]  =  [ae+bg   af+bh]</text>\n  <text x=\"15\" y=\"50\" fill=\"#9a3412\" font-weight=\"bold\">[c  d]   [g  h]     [ce+dg   cf+dh]</text>\n  <line x1=\"15\" y1=\"60\" x2=\"345\" y2=\"60\" stroke=\"#fed7aa\" stroke-width=\"1\"/>\n  <text x=\"15\" y=\"78\" fill=\"#6b7280\" font-size=\"11\">Row i of A  ·  Col j of B  →  entry (i,j) of AB</text>\n  <text x=\"15\" y=\"96\" fill=\"#dc2626\" font-size=\"11\">WARNING: AB ≠ BA in general</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Multiplying element-by-element (like addition) — matrix multiplication is row·column, not entry·entry.",
        "Assuming AB = BA — this is almost never true; always compute both if asked to verify.",
        "Forgetting the compatibility check: (m×n)·(n×p) only; the inner n must match.",
        "Confusing the order of (AB)ᵀ = BᵀAᵀ — the transpose reverses the multiplication order."
      ],
      "shortcuts_and_tricks": [
        "Write the result matrix size first: (m×n)·(n×p) → (m×p). This anchors how many entries to compute.",
        "For 2×2, use the mnemonic: 'Row 1 Left × Col 1 Right' for entry (1,1), etc.",
        "Check AB = BA only if specifically asked — most exam questions just ask you to compute AB.",
        "If A² = A·A, apply the 2×2 formula with B = A."
      ],
      "when_to_use_this_method": "Whenever the problem has two matrices being multiplied (AB), a power of a matrix (A²), or a matrix equation like AX = B where X is unknown.",
      "edge_cases": [
        "A(m×n)·B(n×p): result is m×p. A 1×2 matrix times a 2×1 gives a 1×1 (a scalar in matrix form).",
        "AI = IA = A for any square matrix A — the identity acts like multiplying by 1.",
        "AO = O but O does NOT mean A=O or B=O — the zero product property does NOT hold for matrices."
      ],
      "key_takeaway": "Matrix multiplication multiplies rows of the left matrix by columns of the right. Inner dimensions must match; the result is m×p. Unlike numbers, AB ≠ BA in general.",
      "video_script_hooks": [
        "Open with a 'directions' analogy: 'Multiplying matrices is like following two sets of directions in sequence — order matters because walking North then East ≠ walking East then North.'",
        "Live compute AB and BA for a concrete 2×2 example on a whiteboard — show the surprise that they differ.",
        "Use a sports scorecard metaphor: 'Each player's row statistics vs each metric's column — the dot product gives the combined performance score.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch9_matrix_operations",
    "chapterNumber": 9,
    "key_formulas": [
      "Addition/subtraction: only possible when A and B have the SAME order",
      "(A+B)ᵢⱼ = aᵢⱼ + bᵢⱼ  (add corresponding elements)",
      "(A−B)ᵢⱼ = aᵢⱼ − bᵢⱼ",
      "Scalar multiplication: (kA)ᵢⱼ = k·aᵢⱼ  (multiply every element by k)",
      "Commutative: A+B = B+A",
      "Associative: (A+B)+C = A+(B+C)",
      "Distributive: k(A+B) = kA+kB  and  (k+m)A = kA+mA",
      "Additive identity: A+O = A  |  Additive inverse: A+(−A) = O"
    ],
    "prerequisite_knowledge": [
      "Matrix order and element notation (Ch9 matrix_basics)",
      "Arithmetic operations on integers and fractions"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Adding two matrices of the same order is like adding two identical-sized spreadsheets cell by cell — each cell in the result is the sum of the two cells at that position. You cannot add matrices of different orders, just as you cannot overlay a 2×3 grid on a 3×2 grid.",
      "derivation": "Scalar multiplication extends the distributive law. For kA, every element scales by k: the matrix stretches or shrinks uniformly. Subtraction A−B = A + (−1)B — multiply B by −1 (negate every element) then add.",
      "worked_example": "A = [[1,2],[3,4]], B = [[5,−1],[0,2]], k = 3.\n2A − B = 2[[1,2],[3,4]] − [[5,−1],[0,2]] = [[2,4],[6,8]] − [[5,−1],[0,2]] = [[−3,5],[6,6]].\n3A = [[3,6],[9,12]].",
      "visual_description": "Show two 2×2 matrices side by side with an addition sign; draw arrows from matching cells to the result cell. Separately show scalar multiplication scaling every entry. Highlight that mismatched orders (2×2 + 2×3) is undefined — draw a red ✗.",
      "svg_diagrams": [
        {
          "title": "Matrix Addition — Element-wise",
          "svg": "<svg viewBox=\"0 0 340 90\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"13\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"80\" rx=\"6\" fill=\"#f0fdf4\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#166534\">[a  b]   [e  f]   [a+e  b+f]</text>\n  <text x=\"15\" y=\"50\" fill=\"#166534\">[c  d] + [g  h] = [c+g  d+h]</text>\n  <text x=\"15\" y=\"72\" fill=\"#6b7280\" font-size=\"11\">Same order required — add matching positions</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Trying to add matrices of different orders — this is undefined.",
        "Applying scalar multiplication to only one row instead of every element.",
        "Confusing 2A−B with 2(A−B): these are equal only when you expand, but the order of operations matters for reading the problem.",
        "Forgetting that −A means every element negated: −[[1,2],[3,4]] = [[−1,−2],[−3,−4]]."
      ],
      "shortcuts_and_tricks": [
        "Compute kA first (scale each entry), then add/subtract — fewer arithmetic errors than mixing steps.",
        "Check order compatibility BEFORE starting any calculation.",
        "For 'find the matrix X: A + X = B', isolate X = B − A directly."
      ],
      "when_to_use_this_method": "Whenever a problem asks to evaluate a linear combination of matrices (e.g. 2A − 3B + C), or to find an unknown matrix from an equation like X + A = B.",
      "edge_cases": [
        "A − A = O (null matrix of the same order) — remember this for solving matrix equations.",
        "Scalar k = 0 gives the null matrix: 0·A = O.",
        "Addition is commutative but subtraction is NOT: A−B ≠ B−A in general."
      ],
      "key_takeaway": "Matrix addition and subtraction require identical orders; scalar multiplication scales every element. These operations follow the same algebraic laws as real-number arithmetic.",
      "video_script_hooks": [
        "Show two identical Excel tables being merged: 'Each cell adds its own matching partner — that's matrix addition.'",
        "Demonstrate 2A: 'Doubling a matrix doubles every entry — like zooming in on a spreadsheet by 2×.'",
        "Pose the question: 'Can you add a 2×2 and a 2×3 matrix?' — let students guess, then explain incompatibility."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch9_matrix_problems",
    "chapterNumber": 9,
    "key_formulas": [
      "Matrix equation: AX = B → can't divide; instead find X by equating entries",
      "For 2×2 matrix equation: multiply out AB, equate each entry to corresponding entry of RHS",
      "System of linear equations as matrix: [[a,b],[c,d]][[x],[y]] = [[e],[f]] ⟺ ax+by=e, cx+dy=f",
      "A² = A·A (compute using 2×2 multiplication rule)",
      "If A = [[a,b],[c,d]], A² = [[a²+bc, ab+bd],[ac+cd, bc+d²]]",
      "Null result: if AB = O, neither A nor B is necessarily the null matrix"
    ],
    "prerequisite_knowledge": [
      "Matrix multiplication (Ch9 matrix_multiplication)",
      "Matrix equality — equate corresponding entries",
      "Solving simultaneous linear equations"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Matrix equations look fearsome, but the key is always: multiply out the left side, then equate matching entries with the right side. You get a system of simple algebraic equations which you solve as usual. The matrix is just an organised way to write several equations at once.",
      "derivation": "For [[a,b],[c,d]]·[[x],[y]] = [[p],[q]]: multiply to get [[ax+by],[cx+dy]] = [[p],[q]]. Equate (1,1): ax+by=p; equate (2,1): cx+dy=q. This is exactly the standard 2-variable simultaneous equations system — the matrix form just packs it neatly.",
      "worked_example": "Find x and y if [[2,1],[3,−1]]·[[x],[y]] = [[5],[4]].\nMultiply: 2x+y=5 …(1), 3x−y=4 …(2).\nAdd: 5x=9 → x=9/5. Substitute: y=5−18/5=7/5.\n\nFind A² for A=[[1,2],[3,4]]:\nA²(1,1)=1+6=7, A²(1,2)=2+8=10, A²(2,1)=3+12=15, A²(2,2)=6+16=22.\nA²=[[7,10],[15,22]].",
      "visual_description": "Show the matrix equation [[2,1],[3,−1]][[x],[y]]=[[5],[4]] with arrows expanding multiplication into the two simultaneous equations. Next, show A² computed step by step with each entry calculated and labeled. Highlight the entry-equating technique as the bridge between matrix and algebra.",
      "svg_diagrams": [
        {
          "title": "Matrix Equation → Simultaneous Equations",
          "svg": "<svg viewBox=\"0 0 360 100\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"350\" height=\"90\" rx=\"6\" fill=\"#fdf4ff\" stroke=\"#9333ea\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#581c87\" font-weight=\"bold\">[[a b],[c d]] · [[x],[y]] = [[p],[q]]</text>\n  <text x=\"15\" y=\"50\" fill=\"#7c3aed\">→  ax + by = p   (row 1)</text>\n  <text x=\"15\" y=\"68\" fill=\"#7c3aed\">→  cx + dy = q   (row 2)</text>\n  <text x=\"15\" y=\"88\" fill=\"#6b7280\" font-size=\"11\">Equate entries → standard simultaneous equations</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Trying to 'divide' both sides of AX = B by A — matrix division doesn't exist (use inverse, not tested at ICSE 10).",
        "Equating entries out of order — always match position (i,j) on the left with position (i,j) on the right.",
        "Computing A² as squaring each element — it's A·A using the row-column rule.",
        "Assuming if AB = O then A = O or B = O — the zero-product property does NOT hold for matrices."
      ],
      "shortcuts_and_tricks": [
        "For AX = B where X is a column matrix, multiply out to get simultaneous equations directly.",
        "To find unknowns in a matrix: expand both sides, list all entry equations, solve the simplest ones first.",
        "For A²: write A twice side by side and apply the standard 2×2 multiplication formula.",
        "Check your matrix product by verifying that every entry of AB matches the given RHS."
      ],
      "when_to_use_this_method": "Use when asked to find unknowns inside a matrix equation, solve a linear system via matrix notation, or compute powers of a 2×2 matrix.",
      "edge_cases": [
        "If the RHS is the null matrix O, set each entry equation to zero; you may get multiple solutions.",
        "For non-square coefficient matrices in AX = B, compatibility of sizes must be checked first.",
        "A skew-symmetric matrix satisfies A + Aᵀ = O — each off-diagonal entry equation gives x = −x → x = 0."
      ],
      "key_takeaway": "Matrix equations reduce to simultaneous algebraic equations by equating corresponding entries after multiplying out. This is the central problem-solving technique for ICSE matrix questions.",
      "video_script_hooks": [
        "Start: 'What if I told you a 2×2 box of numbers can solve two equations at the same time? Let me show you.'",
        "Physically expand [[2,1],[3,−1]][[x],[y]] step by step on a whiteboard, then circle the two equations it produces.",
        "Close with: 'Every matrix equation you'll see in ICSE comes down to: multiply out, equate entries, solve.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch10_ap_basics",
    "chapterNumber": 10,
    "key_formulas": [
      "AP: a, a+d, a+2d, … where a = first term, d = common difference",
      "Common difference: d = aₙ − aₙ₋₁  (any term minus previous term)",
      "General term: aₙ = a + (n−1)d",
      "Condition for AP: aₙ − aₙ₋₁ = constant for all n",
      "Three terms in AP: a−d, a, a+d  (their sum = 3a)",
      "Four terms in AP: a−3d, a−d, a+d, a+3d  (their sum = 4a)",
      "Arithmetic Mean (AM): AM of two numbers p and q = (p+q)/2",
      "If x is AM of a and b: a, x, b are in AP → x = (a+b)/2"
    ],
    "prerequisite_knowledge": [
      "Number patterns and sequences",
      "Basic algebra — substituting values into formulas",
      "Solving linear equations"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "An Arithmetic Progression is a sequence where you add the same number each time. Counting by 2s (2,4,6,8…), a salary increasing by ₹500/year, or steps on a staircase — all are APs. The fixed gap between consecutive terms is the common difference d. If d > 0 the sequence grows; if d < 0 it shrinks; if d = 0 all terms are equal.",
      "derivation": "To check if a sequence is AP, compute differences between consecutive terms. If all differences are equal, d is constant and the sequence is AP. The n-th term formula comes from counting how many times d is added: start at a, add d exactly (n−1) times → aₙ = a + (n−1)d.",
      "worked_example": "Is 3, 7, 11, 15, … an AP? Differences: 7−3=4, 11−7=4, 15−11=4. All equal → AP with a=3, d=4.\nFind the 10th term: a₁₀ = 3 + 9×4 = 3 + 36 = 39.\nIf three numbers in AP have sum 18 and common difference 3, find them.\nLet them be a−d, a, a+d. Sum = 3a = 18 → a=6. d=3 → terms: 3, 6, 9.",
      "visual_description": "Draw a number line marking 3, 7, 11, 15 with equal gaps labelled d=4. Show the staircase analogy: each step is the same height d. Separately show the 'three terms in AP' symmetric setup: a−d, a, a+d with the middle term as the balance point.",
      "svg_diagrams": [
        {
          "title": "Arithmetic Progression — Equal Steps",
          "svg": "<svg viewBox=\"0 0 340 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"13\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"70\" rx=\"6\" fill=\"#fffbeb\" stroke=\"#d97706\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#92400e\" font-weight=\"bold\">3 ──+4──→ 7 ──+4──→ 11 ──+4──→ 15  …</text>\n  <text x=\"15\" y=\"50\" fill=\"#b45309\">a = 3,  d = 4</text>\n  <text x=\"15\" y=\"68\" fill=\"#6b7280\" font-size=\"11\">aₙ = a + (n−1)d   →   a₁₀ = 3 + 9×4 = 39</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Thinking the first term is a₀ — in ICSE, the first term is a₁ = a.",
        "Using d = aₙ₋₁ − aₙ instead of aₙ − aₙ₋₁ (wrong sign).",
        "For 'three terms in AP', writing a, a+d, a+2d instead of the symmetric a−d, a, a+d (the symmetric form makes sum-product problems far easier).",
        "Confusing 'n-th term' with 'sum of n terms': aₙ and Sₙ are different."
      ],
      "shortcuts_and_tricks": [
        "Three terms in AP: use a−d, a, a+d. Sum = 3a → find a directly.",
        "Four terms in AP: use a−3d, a−d, a+d, a+3d. Sum = 4a → find a directly.",
        "Check if a value k is in an AP: set aₙ = k → solve for n. If n is a positive integer, k is in the AP.",
        "AM shortcut: middle term of any AP = (first + last)/2 = arithmetic mean."
      ],
      "when_to_use_this_method": "Use the symmetric term representation (a±d) whenever a problem gives the sum of terms in AP — it reduces the equation to finding a alone.",
      "edge_cases": [
        "d = 0: all terms are equal — still a valid AP (constant sequence).",
        "Negative d: the AP is decreasing. The formulas still work; just substitute a negative d.",
        "Single-term 'AP': technically valid with any d — not a useful case in problems."
      ],
      "key_takeaway": "An AP has constant differences between consecutive terms. Use the symmetric representation (a−d, a, a+d) for 3-term problems to get the sum = 3a immediately.",
      "video_script_hooks": [
        "Open with a savings challenge: 'Save ₹100 in month 1, ₹200 in month 2, ₹300 in month 3 — how much in month 12?'",
        "Show a staircase photo: 'Every step is the same height — that's arithmetic progression in architecture.'",
        "Pose the puzzle: '3 numbers in AP sum to 24 and their product is 192. Find them.' (Tease students before the formula reveal.)"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch10_ap_nth_term",
    "chapterNumber": 10,
    "key_formulas": [
      "n-th term: aₙ = a + (n−1)d",
      "Last term l: l = a + (n−1)d",
      "Number of terms: n = (l − a)/d + 1",
      "Given aₙ = aₘ+k·d: if aₙ and aₘ known, find d = (aₙ−aₘ)/(n−m)",
      "k-th term from the end = (l − (k−1)d)",
      "Middle term of AP with odd number of terms = a₍ₙ₊₁₎/₂"
    ],
    "prerequisite_knowledge": [
      "AP definition, first term a and common difference d",
      "Solving linear equations in one variable"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The n-th term formula aₙ = a + (n−1)d is just counting: you start at a and take (n−1) steps of size d. To find which position a particular number occupies, reverse this: set aₙ equal to that number and solve for n.",
      "derivation": "a₁=a, a₂=a+d, a₃=a+2d, … aₙ=a+(n−1)d. Each step adds exactly one d; after n−1 steps we reach the n-th term. For the number of terms: l=a+(n−1)d → n−1=(l−a)/d → n=(l−a)/d+1.",
      "worked_example": "AP: 5, 9, 13, 17, … Find the 20th term and check if 89 is in the AP.\na=5, d=4. a₂₀=5+19×4=5+76=81.\nFor 89: 5+(n−1)×4=89 → 4(n−1)=84 → n−1=21 → n=22. Since 22 is a positive integer, 89 IS the 22nd term.\n\nAP with a₃=12 and a₇=28. Find a and d.\na+2d=12, a+6d=28. Subtract: 4d=16 → d=4, a=4.",
      "visual_description": "Show the AP 5,9,13,17,… on a number line with gaps d=4. Mark the 20th position. Draw an arrow from the 3rd and 7th terms with their values; show the subtraction trick to find d. Highlight n=(l−a)/d+1 with a worked number line.",
      "svg_diagrams": [
        {
          "title": "Finding the n-th Term",
          "svg": "<svg viewBox=\"0 0 340 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"70\" rx=\"6\" fill=\"#f0f9ff\" stroke=\"#0284c7\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"26\" fill=\"#0c4a6e\" font-weight=\"bold\">aₙ = a + (n−1)d</text>\n  <text x=\"15\" y=\"46\" fill=\"#0369a1\">n = (l − a)/d  + 1   ← number of terms</text>\n  <text x=\"15\" y=\"66\" fill=\"#6b7280\" font-size=\"11\">d = (aₙ − aₘ) / (n − m)  ← find d from two known terms</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Writing n = (l−a)/d instead of n = (l−a)/d + 1 (off-by-one error).",
        "Using n steps instead of n−1 steps in aₙ = a + n·d (wrong formula).",
        "Assuming n must be an integer — always check! If n is not a positive integer, the value is NOT in the AP.",
        "Confusing 'term from the end' with 'term from the beginning': k-th from end = (total+1−k)-th from start."
      ],
      "shortcuts_and_tricks": [
        "Given two terms aₘ and aₙ: d = (aₙ−aₘ)/(n−m). No need to write two separate equations.",
        "Check membership: set aₙ = target. If n is a positive integer → yes; otherwise → no.",
        "For 'k-th term from the end': treat the last term as a new 'first term' and subtract (k−1)d."
      ],
      "when_to_use_this_method": "Whenever you need to find a specific term, determine if a value belongs to an AP, or find a and d given two terms.",
      "edge_cases": [
        "When the AP has only 1 term (n=1): a₁ = a. Formula gives a₁ = a + 0×d = a ✓.",
        "If d = 0: aₙ = a for all n — every term is identical.",
        "Negative n: never valid — term numbers must be positive integers."
      ],
      "key_takeaway": "aₙ = a+(n−1)d. Reverse it to find which term a given value is: solve for n and check if it's a positive integer.",
      "video_script_hooks": [
        "Challenge: 'I'll give you a sequence and you tell me the 100th term before I finish writing — ready?'",
        "Show the 'two knowns' trick: 'If you know any two terms of an AP, you can reconstruct the whole sequence.'",
        "End with the 'is it in the AP?' puzzle — students verify membership using the formula."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch10_ap_problems",
    "chapterNumber": 10,
    "key_formulas": [
      "aₙ = a + (n−1)d  and  Sₙ = n/2·[2a+(n−1)d]",
      "Three numbers in AP: a−d, a, a+d  (sum=3a, product guides d)",
      "Four numbers in AP: a−3d, a−d, a+d, a+3d  (sum=4a)",
      "AP word problems: set up equations from the given conditions and solve simultaneously",
      "If aₘ = n and aₙ = m (in same AP): d = −1, a = m+n−1  (standard result)"
    ],
    "prerequisite_knowledge": [
      "AP n-th term and sum formulas",
      "Solving simultaneous linear equations",
      "Quadratic equations (occasionally needed when product condition is given)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "AP problems translate real-world patterns — savings, seat rows in a cinema, rungs on a ladder — into equations. The key is identifying what is a, d, and n from the problem text. Once set up, two conditions give two equations that determine a and d (or n).",
      "derivation": "Standard approach: (1) Identify a (first term/starting value), d (constant increment), n (count). (2) Write the relevant formula — aₙ for a specific term, Sₙ for a total. (3) If two unknowns, find two equations and solve simultaneously. When the problem specifies the sum of three AP terms, use the symmetric form a−d, a, a+d to get sum=3a in one step.",
      "worked_example": "Three numbers in AP have sum 24 and product 480. Find them.\nLet a−d, a, a+d. Sum: 3a=24 → a=8. Product: (8−d)·8·(8+d)=480 → 8(64−d²)=480 → 64−d²=60 → d²=4 → d=±2.\nTerms: 6, 8, 10 (or 10, 8, 6 — same set).\n\nIf the 3rd term of an AP is 12 and the 7th term is 28, find the sum of 10 terms.\na+2d=12 …(1), a+6d=28 …(2). Subtract: 4d=16→d=4, a=4. S₁₀=10/2·(8+36)=5·44=220.",
      "visual_description": "Show the 'three terms in AP' symmetric diagram: a−d ← d → a ← d → a+d, highlighting sum=3a. Draw a word-problem timeline for a savings plan: ₹500 in month 1, ₹700 in month 2 with d=₹200 labelled. Show the two-equation system for finding a and d from two given terms.",
      "svg_diagrams": [
        {
          "title": "AP Problem Setup — Three Symmetric Terms",
          "svg": "<svg viewBox=\"0 0 340 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"70\" rx=\"6\" fill=\"#fdf4ff\" stroke=\"#9333ea\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#581c87\" font-weight=\"bold\">3 terms in AP:  a−d,  a,  a+d</text>\n  <text x=\"15\" y=\"50\" fill=\"#7c3aed\">Sum = 3a  (immediate!)   ·   Middle term = AM</text>\n  <text x=\"15\" y=\"68\" fill=\"#6b7280\" font-size=\"11\">Use symmetric form whenever sum of AP terms is given</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Setting up 3-term AP as a, a+d, a+2d — valid but makes sum = 3a+3d, harder to isolate a.",
        "Forgetting to check that n is a positive integer when solving for 'how many terms'.",
        "In product problems, keeping only d>0 and discarding d<0 — both may give valid ordered sets.",
        "Treating 'sum of n terms' conditions as if they give the n-th term."
      ],
      "shortcuts_and_tricks": [
        "Sum of three AP terms given → use symmetric form a−d, a, a+d → sum=3a instantly.",
        "If aₘ=n and aₙ=m: then d=−1 and a=m+n−1 (well-known ICSE result).",
        "For 'how many terms sum to S': Sₙ=S is a quadratic in n; solve and discard non-integer/negative roots.",
        "Middle term of an odd-count AP = Sₙ/n = arithmetic mean of all terms."
      ],
      "when_to_use_this_method": "Apply AP problem-solving whenever a real-world scenario involves equal increments: compound savings, concert rows, stacked objects, labour wages with equal raises.",
      "edge_cases": [
        "Quadratic in n for Sₙ=k: may give two positive roots — check which makes physical sense (e.g., n must be a whole number of months).",
        "When product of AP terms is given: after finding a from sum, set up a quadratic in d.",
        "AP with first term a and last term l: number of terms n=(l−a)/d+1 must be a positive integer — verify this."
      ],
      "key_takeaway": "Translate word problems to a and d; use symmetric forms for sums. Two conditions → two equations → solve simultaneously.",
      "video_script_hooks": [
        "Open with a cinema problem: 'Row 1 has 20 seats, each row has 2 more seats than the row before. The theatre has 15 rows — how many seats total?'",
        "Show the 'three numbers in AP' trick with sum and product — students are amazed how fast the symmetric form solves it.",
        "Close with the salary problem: 'You earn ₹20,000 in year 1 with ₹1,500 annual raise. In which year does your salary cross ₹35,000?'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch10_ap_sum",
    "chapterNumber": 10,
    "key_formulas": [
      "Sum of n terms: Sₙ = n/2 · [2a + (n−1)d]",
      "Alternative (when last term l is known): Sₙ = n/2 · (a + l)",
      "n-th term from sum: aₙ = Sₙ − Sₙ₋₁  (for n ≥ 2); a₁ = S₁",
      "Sum of first n natural numbers: n(n+1)/2",
      "Sum of first n odd numbers = n²",
      "If Sₙ = pn² + qn (quadratic in n), then aₙ = p(2n−1) + q"
    ],
    "prerequisite_knowledge": [
      "AP n-th term formula aₙ = a+(n−1)d",
      "Algebraic manipulation — solving for unknowns"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Gauss's trick: to sum 1+2+3+…+100, pair the first and last: 1+100=101, 2+99=101, … — 50 such pairs → sum = 50×101 = 5050. The Sₙ formula is this pairing idea generalised: n/2 pairs, each summing to (first+last) = (2a+(n−1)d).",
      "derivation": "Write Sₙ forwards and backwards:\nSₙ = a + (a+d) + (a+2d) + … + l\nSₙ = l + (l−d) + (l−2d) + … + a\nAdd: 2Sₙ = n(a+l) → Sₙ = n(a+l)/2. Substitute l=a+(n−1)d → Sₙ = n/2·[2a+(n−1)d].",
      "worked_example": "Find the sum of the first 20 terms of 3, 7, 11, 15, …\na=3, d=4, n=20. S₂₀ = 20/2·[2(3)+19(4)] = 10·[6+76] = 10·82 = 820.\n\nIf Sₙ = 3n²+2n, find a₁₀.\na₁₀ = S₁₀−S₉ = (300+20)−(243+18) = 320−261 = 59.\nAlternatively: a = S₁ = 5, d = S₂−2S₁ = (12+4)−2(5) = 16−10 = 6. a₁₀ = 5+54=59.",
      "visual_description": "Show the Gauss pairing diagram: top row 1,2,3,…,n and bottom row n,n−1,n−2,…,1 with vertical arrows showing each pair summing to n+1. Then show the AP formula version. Separately illustrate Sₙ=3n²+2n as a parabola and show the staircase of partial sums.",
      "svg_diagrams": [
        {
          "title": "Sum Formula — Gauss Pairing",
          "svg": "<svg viewBox=\"0 0 340 90\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"80\" rx=\"6\" fill=\"#f0fdf4\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"26\" fill=\"#14532d\" font-weight=\"bold\">Sₙ = n/2 · [2a + (n−1)d]</text>\n  <text x=\"15\" y=\"46\" fill=\"#166534\">     = n/2 · (first + last)</text>\n  <line x1=\"15\" y1=\"55\" x2=\"325\" y2=\"55\" stroke=\"#bbf7d0\" stroke-width=\"1\"/>\n  <text x=\"15\" y=\"70\" fill=\"#6b7280\" font-size=\"11\">aₙ = Sₙ − Sₙ₋₁  (recover n-th term from partial sums)</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Using Sₙ = n/2·(2a+(n−1)d) as the n-th term formula — it is the SUM, not a single term.",
        "Forgetting the n/2 factor: Sₙ ≠ n·[2a+(n−1)d].",
        "When finding aₙ from Sₙ: using aₙ = Sₙ/n instead of aₙ = Sₙ − Sₙ₋₁.",
        "Applying the formula when the sequence is NOT an AP."
      ],
      "shortcuts_and_tricks": [
        "When last term is given: Sₙ = n/2·(a+l) is faster — no need to substitute l = a+(n−1)d.",
        "If Sₙ is a quadratic in n (Sₙ=pn²+qn+r): a=S₁, d=S₂−2S₁ gives a and d directly.",
        "Sum of an AP = (number of terms) × (arithmetic mean of first and last terms).",
        "For consecutive integers 1 to n: Sₙ = n(n+1)/2."
      ],
      "when_to_use_this_method": "Use Sₙ = n/2·(2a+(n−1)d) when you know a, d, and n. Use Sₙ = n/2·(a+l) when both the first and last terms are given.",
      "edge_cases": [
        "S₁ = a₁ = a. Always verify this: Sₙ formula for n=1 gives S₁ = 1/2·(2a+0) = a ✓.",
        "When n is found as a fraction (non-integer) from Sₙ=k, it means the given sum is not achievable for any integer number of terms.",
        "Sum of infinite AP: only converges if d=0 (constant sequence); otherwise diverges."
      ],
      "key_takeaway": "Sₙ = n/2·[2a+(n−1)d]. Recover aₙ from partial sums using aₙ = Sₙ − Sₙ₋₁. The pairing trick (Gauss) is the intuition behind the formula.",
      "video_script_hooks": [
        "Open with the Gauss legend: 'A young student summed 1 to 100 in seconds. Here's the trick he used.'",
        "Live demonstration: write out S₁₀ of a small AP, pair terms, and verify the formula.",
        "Pose: 'A company saves ₹1000 in month 1, ₹1200 in month 2, growing by ₹200 per month. How much in 2 years?' — real-world Sₙ application."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch11_gp_basics",
    "chapterNumber": 11,
    "key_formulas": [
      "GP: a, ar, ar², ar³, … where a = first term, r = common ratio",
      "Common ratio: r = aₙ/aₙ₋₁  (any term divided by the previous term)",
      "Condition for GP: aₙ/aₙ₋₁ = constant for all n",
      "Three terms in GP: a/r, a, ar  (product = a³; middle = GM)",
      "Four terms in GP: a/r³, a/r, ar, ar³  (product = a⁴)",
      "Geometric Mean (GM) of p and q: GM = √(pq)  (positive value)",
      "If x is GM of a and b: a, x, b in GP → x² = ab",
      "If a, b, c in GP: b² = ac  (GP condition)"
    ],
    "prerequisite_knowledge": [
      "Exponent rules: aᵐ×aⁿ=aᵐ⁺ⁿ",
      "Basic arithmetic — multiplication and division of fractions",
      "Concept of ratio"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A Geometric Progression multiplies by the same number each time. Doubling your money each year (₹1000, ₹2000, ₹4000…), a bouncing ball losing 10% of its height each bounce, or powers of 2 in binary — all are GPs. The common ratio r tells you the multiplier: r>1 grows, 0<r<1 shrinks, r<0 alternates sign.",
      "derivation": "To check GP, compute ratios of consecutive terms. If all ratios equal r, the sequence is GP. The n-th term: start at a, multiply by r exactly n−1 times → aₙ = a·rⁿ⁻¹. The GP condition b²=ac comes from b/a = c/b → b² = ac.",
      "worked_example": "Is 2, 6, 18, 54, … a GP? Ratios: 6/2=3, 18/6=3, 54/18=3. All equal → GP with a=2, r=3.\n\nFind three terms in GP with product 64 and sum 14.\nLet a/r, a, ar. Product=(a/r)·a·ar=a³=64 → a=4. Sum: 4/r+4+4r=14 → 4/r+4r=10 → 4+4r²=10r → 4r²−10r+4=0 → 2r²−5r+2=0 → (2r−1)(r−2)=0 → r=½ or r=2.\nTerms: 8,4,2 (r=½) or 2,4,8 (r=2).",
      "visual_description": "Draw the GP 2,6,18,54 on a diagram with ×3 arrows between terms. Show the symmetric 3-term form a/r, a, ar with the product=a³ highlighted. Separately show a shrinking GP (r=½): 8,4,2,1,½,… trending toward zero.",
      "svg_diagrams": [
        {
          "title": "Geometric Progression — Constant Ratio",
          "svg": "<svg viewBox=\"0 0 340 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"13\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"70\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#ca8a04\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#713f12\" font-weight=\"bold\">2 ──×3──→ 6 ──×3──→ 18 ──×3──→ 54  …</text>\n  <text x=\"15\" y=\"50\" fill=\"#a16207\">a = 2,  r = 3</text>\n  <text x=\"15\" y=\"68\" fill=\"#6b7280\" font-size=\"11\">aₙ = a·rⁿ⁻¹   →   a₆ = 2·3⁵ = 486</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Using r = aₙ₋₁/aₙ (inverted) — always divide the LATER term by the EARLIER.",
        "For three terms in GP writing a, ar, ar² instead of the symmetric a/r, a, ar (symmetric form makes product = a³ instantly).",
        "Confusing GM (√ab) with AM ((a+b)/2) — AM ≥ GM always.",
        "Thinking r must be positive — r can be negative (alternating GP: 2,−4,8,−16,…)."
      ],
      "shortcuts_and_tricks": [
        "Three terms in GP: use a/r, a, ar. Product = a³ → find a by taking cube root.",
        "GP condition: b²=ac. Quick check for any three consecutive terms.",
        "GM of a and b: √(ab). Always take the positive root unless the context specifies otherwise.",
        "For product of 4 GP terms: (a/r³)·(a/r)·(ar)·(ar³)=a⁴."
      ],
      "when_to_use_this_method": "Use the symmetric form (a/r, a, ar) whenever the product of 3 GP terms is given — it gives a³ in one step.",
      "edge_cases": [
        "r = 1: all terms equal a — still a valid GP (constant sequence).",
        "r = −1: alternating GP a, −a, a, −a, … Sum of even number of terms = 0.",
        "a = 0: not a valid GP (division by zero when computing ratios)."
      ],
      "key_takeaway": "GP: multiply by constant r each step. b²=ac for any three consecutive terms. Use symmetric form (a/r, a, ar) when product is given.",
      "video_script_hooks": [
        "Open with the folding paper myth: 'If you fold a paper in half 42 times, it reaches the moon. Is that true?' — then use GP to verify.",
        "Show a bouncing ball losing 20% each bounce — infinite GP with S∞ formula.",
        "Challenge: '3 numbers in GP have product 216. Find them.' — showcase how a³=216 gives a=6 in one step."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch11_gp_nth_term",
    "chapterNumber": 11,
    "key_formulas": [
      "n-th term: aₙ = a·rⁿ⁻¹",
      "Given aₙ and aₘ: r^(n-m) = aₙ/aₘ  → find r",
      "Number of terms: n = log(l/a)/log(r) + 1  (when last term l is known)",
      "k-th term from the end = l/rᵏ⁻¹  (or equivalently: last term × (1/r)^(k-1))",
      "If aₙ = a·rⁿ⁻¹: r = (aₙ/a)^(1/(n−1))"
    ],
    "prerequisite_knowledge": [
      "GP definition, first term a and common ratio r",
      "Exponent laws: (rᵐ)ⁿ = rᵐⁿ, r⁰=1",
      "Solving exponential equations"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The GP n-th term formula aₙ = a·rⁿ⁻¹ is exponential growth (or decay). To find which position a value occupies, set aₙ equal to that value and solve for n using the fact that rⁿ⁻¹ must be a specific power of r.",
      "derivation": "a₁=a, a₂=ar, a₃=ar², … aₙ=arⁿ⁻¹. Each step multiplies by r; after n−1 multiplications we reach the n-th term. Given two terms aₘ and aₙ: aₙ/aₘ = arⁿ⁻¹/arᵐ⁻¹ = rⁿ⁻ᵐ. So r = (aₙ/aₘ)^(1/(n−m)).",
      "worked_example": "GP 3, 6, 12, …: Find the 8th term.\na=3, r=2. a₈=3·2⁷=3·128=384.\n\nGP with a₂=6 and a₅=48. Find a and r.\na₅/a₂=ar⁴/ar=r³=48/6=8 → r=2. a=a₂/r=6/2=3. AP: 3,6,12,24,48,…\n\nIs 192 a term of GP 3,6,12,…?\n3·2ⁿ⁻¹=192 → 2ⁿ⁻¹=64=2⁶ → n−1=6 → n=7. Yes, 7th term.",
      "visual_description": "Show the GP 3,6,12,24,… with ×2 arrows. Mark the 8th term. Show the 'given two terms' trick: circle a₂ and a₅, write their ratio = r³, solve. Highlight membership check: 192=3·2ⁿ⁻¹ → solve for n.",
      "svg_diagrams": [
        {
          "title": "GP n-th Term — Exponential Growth",
          "svg": "<svg viewBox=\"0 0 340 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"70\" rx=\"6\" fill=\"#ecfdf5\" stroke=\"#059669\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"26\" fill=\"#064e3b\" font-weight=\"bold\">aₙ = a · rⁿ⁻¹</text>\n  <text x=\"15\" y=\"46\" fill=\"#047857\">r = (aₙ/aₘ)^(1/(n−m))  ← from two known terms</text>\n  <text x=\"15\" y=\"66\" fill=\"#6b7280\" font-size=\"11\">Membership: set aₙ=target → n must be a positive integer</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Using aₙ=a·rⁿ (wrong — it's rⁿ⁻¹, not rⁿ).",
        "When given a₂ and a₅, writing r = (a₅/a₂)^(1/3) but forgetting to verify the result.",
        "Assuming n must be a whole number for membership — always check explicitly.",
        "Confusing GP membership check (exponential equation) with AP membership check (linear equation)."
      ],
      "shortcuts_and_tricks": [
        "Given aₘ and aₙ: r^(n−m) = aₙ/aₘ. Identify the exponent n−m and take the appropriate root.",
        "Quick check: if the ratio of any two consecutive given terms equals r, the sequence is consistent.",
        "For r=2: powers of 2 are 1,2,4,8,16,32,64,128,256,512,… Memorise these for fast computation."
      ],
      "when_to_use_this_method": "Use aₙ=a·rⁿ⁻¹ to find a specific term. Use the ratio r^(n−m)=aₙ/aₘ when two terms at known positions are given.",
      "edge_cases": [
        "r=1: aₙ=a for all n. All terms equal.",
        "r=−1: odd terms equal a, even terms equal −a.",
        "Fractional r (0<r<1): GP decreases; terms approach 0."
      ],
      "key_takeaway": "aₙ = a·rⁿ⁻¹. Given two terms at positions m and n: r^(n−m) = aₙ/aₘ. Always check n is a positive integer for membership.",
      "video_script_hooks": [
        "Demo: 'I can find the 10th term of any GP in under 5 seconds — watch.' Compute 3·2⁹=1536.",
        "Challenge: given a₃=12 and a₆=96, find the GP and its 10th term without trial-and-error.",
        "Show the membership check: 'Is 1000 in the GP 2,4,8,16,…?' (not an integer power of 2, so no)."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch11_gp_problems",
    "chapterNumber": 11,
    "key_formulas": [
      "aₙ = a·rⁿ⁻¹,  Sₙ = a(rⁿ−1)/(r−1),  S∞ = a/(1−r)",
      "Three terms in GP: a/r, a, ar  (product=a³)",
      "GP word problem setup: identify a (initial value), r (multiplier), n (count)",
      "Compound interest analogy: A = P(1+i)ⁿ — this is a GP with first term P and ratio (1+i)",
      "Population growth: Pₙ = P₀·rⁿ (r = 1+growth rate)"
    ],
    "prerequisite_knowledge": [
      "GP n-th term and sum formulas",
      "Solving exponential equations (trial or logarithm)",
      "Quadratic equations (for 3-term GP product/sum problems)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "GP problems arise wherever something grows or decays by a fixed percentage: bank interest, population, radioactive decay, or drug concentration in the body. The key is identifying the first term (initial amount), the ratio r (1+rate or 1−rate), and what you're asked to find (a term or a sum).",
      "derivation": "Standard approach: (1) Identify a, r, and what is asked. (2) For a specific value: use aₙ = a·rⁿ⁻¹. (3) For a total: use Sₙ. (4) For 3-term GP problems, use the symmetric form a/r, a, ar — product gives a³ and ratio between terms gives r² or r.",
      "worked_example": "A colony of bacteria doubles every hour. If there are 100 at 9am, how many at 3pm?\n6 hours → n=7 (7th term). a₇=100·2⁶=100·64=6400.\n\nThree numbers in GP have product 216 and sum 19. Find them.\nLet a/r, a, ar. Product=a³=216 → a=6. Sum: 6/r+6+6r=19 → 6/r+6r=13 → 6+6r²=13r → 6r²−13r+6=0 → (2r−3)(3r−2)=0 → r=3/2 or r=2/3.\nTerms: 4,6,9 or 9,6,4.",
      "visual_description": "Draw a timeline with ×2 arrows for the bacteria problem: 100→200→400→800→1600→3200→6400. Separately show the symmetric GP diagram a/r, a, ar with product=a³ and the quadratic in r emerging from the sum condition.",
      "svg_diagrams": [
        {
          "title": "GP Applied — Symmetric Form for 3-Term Problems",
          "svg": "<svg viewBox=\"0 0 340 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"12\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"70\" rx=\"6\" fill=\"#fff7ed\" stroke=\"#ea580c\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"28\" fill=\"#9a3412\" font-weight=\"bold\">3 terms in GP:   a/r ,  a ,  ar</text>\n  <text x=\"15\" y=\"50\" fill=\"#c2410c\">Product = a³  (find a by ∛)   ·   Ratio: (ar)/(a/r) = r²</text>\n  <text x=\"15\" y=\"68\" fill=\"#6b7280\" font-size=\"11\">Sum condition → quadratic in r; both roots give valid APs</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Setting up a GP word problem as a, ar, ar² — valid but gives sum=a(1+r+r²), harder to work with.",
        "Forgetting that a GP with r=1+rate has r>1 for growth and r<1 for decay.",
        "Confusing 'after n periods' with 'n-th term': after 1 period is the 2nd term, not the 1st.",
        "Taking both values of r (from quadratic) as separate problems — they often give the same set of numbers in reverse order."
      ],
      "shortcuts_and_tricks": [
        "3-term GP: product → a³; sum → quadratic in r. Solve the quadratic; both roots give same set of terms (just reversed).",
        "For compound interest type: aₙ = P·(1+r/100)ⁿ⁻¹. The 'year n' is the n-th term.",
        "If consecutive terms of GP are p, q, r: use q²=pr as the quickest verification."
      ],
      "when_to_use_this_method": "Use for any problem involving fixed-ratio growth/decay — population, finance (compound interest), bouncing balls, or any word problem where a quantity multiplies by the same factor each step.",
      "edge_cases": [
        "Decay problems: r<1 (e.g. r=0.8 for 20% reduction). Terms decrease towards 0.",
        "For 'how many terms': n might emerge from an exponential equation — solve by expressing both sides as powers of r.",
        "If r=−1 in a word problem context (alternating sign), terms alternate; the sum of pairs is 0."
      ],
      "key_takeaway": "GP problems: identify a and r from context. Use symmetric form (a/r, a, ar) for 3-term problems where the product is given. Compound growth/decay are always GP.",
      "video_script_hooks": [
        "Open with compound interest: 'You invest ₹10,000 at 20% per year. How much after 5 years? — It's a GP.'",
        "Bacteria doubling problem with a ticking clock — the numbers grow so fast students are amazed.",
        "Challenge: '3 numbers in GP product 125, sum 15. Find them.' Symmetric form solves in 30 seconds."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch11_gp_sum",
    "chapterNumber": 11,
    "key_formulas": [
      "Sum of n terms (r ≠ 1): Sₙ = a(rⁿ−1)/(r−1)  [for r > 1]",
      "Equivalent form: Sₙ = a(1−rⁿ)/(1−r)  [for r < 1, more natural]",
      "Sum when r = 1: Sₙ = na",
      "Infinite GP sum (|r| < 1): S∞ = a/(1−r)",
      "S∞ exists only when |r| < 1; diverges otherwise",
      "Recurring decimals: 0.ā = a/9; 0.āb̄ = ab/99"
    ],
    "prerequisite_knowledge": [
      "GP n-th term formula",
      "Exponent laws — computing rⁿ",
      "Algebraic fractions — simplifying a(rⁿ−1)/(r−1)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The GP sum formula comes from a neat algebraic trick: subtract rSₙ from Sₙ — almost all terms cancel, leaving just a−arⁿ = a(1−rⁿ). Divide by (1−r) to get Sₙ. For infinite GPs with |r|<1, as n→∞ the term rⁿ→0, giving S∞=a/(1−r).",
      "derivation": "Sₙ = a+ar+ar²+…+arⁿ⁻¹. Multiply by r: rSₙ = ar+ar²+…+arⁿ. Subtract: Sₙ(1−r)=a−arⁿ=a(1−rⁿ). So Sₙ=a(1−rⁿ)/(1−r). For r>1, multiply top and bottom by −1: Sₙ=a(rⁿ−1)/(r−1).",
      "worked_example": "Find S₆ of GP 2,6,18,…\na=2, r=3. S₆=2(3⁶−1)/(3−1)=2(729−1)/2=728.\n\nInfinite GP: a=8, r=½. S∞=8/(1−½)=8/(½)=16.\n\nWrite 0.3̄=0.333… as fraction.\nS∞ of GP: 0.3+0.03+0.003+…=0.3/(1−0.1)=0.3/0.9=1/3.",
      "visual_description": "Show the Sₙ derivation as a subtraction: write Sₙ and rSₙ with terms aligned, circle the cancellation. Draw the infinite GP 8+4+2+1+½+… with bars converging to 16. Show the recurring decimal as an infinite GP.",
      "svg_diagrams": [
        {
          "title": "GP Sum — Subtract-and-Cancel Derivation",
          "svg": "<svg viewBox=\"0 0 340 90\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"monospace\" font-size=\"11\">\n  <rect x=\"5\" y=\"5\" width=\"330\" height=\"80\" rx=\"6\" fill=\"#fdf2f8\" stroke=\"#c026d3\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"26\" fill=\"#701a75\">Sₙ  = a + ar + ar² + … + arⁿ⁻¹</text>\n  <text x=\"15\" y=\"44\" fill=\"#701a75\">rSₙ =     ar + ar² + … + arⁿ⁻¹ + arⁿ</text>\n  <text x=\"15\" y=\"62\" fill=\"#a21caf\" font-weight=\"bold\">Sₙ(1−r) = a − arⁿ  →  Sₙ = a(1−rⁿ)/(1−r)</text>\n  <text x=\"15\" y=\"78\" fill=\"#6b7280\" font-size=\"10\">S∞ = a/(1−r)  when |r| &lt; 1  (arⁿ → 0)</text>\n</svg>"
        }
      ],
      "common_misconceptions": [
        "Using Sₙ=a(rⁿ−1)/(r−1) when r<1 — this gives a negative denominator; use a(1−rⁿ)/(1−r) instead (both are equivalent, but the second avoids sign confusion).",
        "Forgetting that S∞ only exists for |r|<1. For r≥1, the infinite sum diverges.",
        "Computing S∞ as a/(1+r) instead of a/(1−r).",
        "Confusing the GP sum formula with the AP sum formula."
      ],
      "shortcuts_and_tricks": [
        "For r=2: Sₙ=a(2ⁿ−1). For r=3: Sₙ=a(3ⁿ−1)/2. Memorise the pattern.",
        "Infinite GP check: verify |r|<1 BEFORE applying S∞=a/(1−r).",
        "Recurring decimal 0.d₁d₂d₃… where block length k: fraction = (d₁d₂d₃)/(10ᵏ−1).",
        "For GP problems mixing Sₙ and aₙ: express both in terms of a and r, then solve simultaneously."
      ],
      "when_to_use_this_method": "Use Sₙ=a(rⁿ−1)/(r−1) when n is finite. Use S∞=a/(1−r) when n→∞ and |r|<1 (infinite GP, converging series, recurring decimals).",
      "edge_cases": [
        "r=−1: S∞ does not exist (series oscillates). S₂ₙ=0, S₂ₙ₊₁=a.",
        "r=1: Sₙ=na (formula breaks down for the ratio form; use this separately).",
        "Very small a with large r: Sₙ grows exponentially — do not approximate."
      ],
      "key_takeaway": "Sₙ = a(rⁿ−1)/(r−1). Infinite GP: S∞ = a/(1−r) only when |r|<1. The derivation is Sₙ − rSₙ = a−arⁿ.",
      "video_script_hooks": [
        "Start with the wheat-and-chessboard problem: place 1 grain on square 1, double each square — how many total on 64 squares?",
        "Show how 0.999… = 1 using the infinite GP formula: S∞ = 0.9/(1−0.1) = 1.",
        "Graph Sₙ vs n for r=0.5 and r=2 side by side — one converges, one explodes."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch12_reflection_axes",
    "chapterNumber": 12,
    "key_formulas": [
      {
        "formula": "Reflection in x-axis: Mx(x, y) = (x, −y).",
        "explanation": "The x-coordinate is unchanged; the y-coordinate changes sign. The x-axis is horizontal and acts as the mirror."
      },
      {
        "formula": "Reflection in y-axis: My(x, y) = (−x, y).",
        "explanation": "The y-coordinate is unchanged; the x-coordinate changes sign. The y-axis is vertical and acts as the mirror."
      },
      {
        "formula": "Invariant points of Mx: all (x, 0) — the entire x-axis.",
        "explanation": "Any point with y=0 satisfies Mx(x,0)=(x,0). The x-axis is the mirror line."
      },
      {
        "formula": "Invariant points of My: all (0, y) — the entire y-axis.",
        "explanation": "Any point with x=0 satisfies My(0,y)=(0,y). The y-axis is the mirror line."
      }
    ],
    "prerequisite_knowledge": [
      "Cartesian coordinates and the four quadrants.",
      "Concept of reflection and invariant points (icse_math10_ch12_reflection_basics).",
      "Sign conventions: positive vs negative x and y values.",
      "Midpoint formula — used to verify the mirror bisects PP'.",
      "Identifying horizontal and vertical lines (x-axis is y=0; y-axis is x=0)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Reflecting in the x-axis flips a point vertically — keep the x-coordinate, negate y. Reflecting in the y-axis flips horizontally — keep y, negate x. Mnemonic: 'the axis you reflect IN, its coordinate survives.'",
      "derivation": "Mx(x,y)=(x,−y): midpoint ((x+x)/2,(y+(−y))/2)=(x,0) is on x-axis ✓; slope of PP'=(−y−y)/(x−x) undefined (vertical) ⊥ horizontal x-axis ✓.\nMy(x,y)=(−x,y): midpoint (0,y) is on y-axis ✓; PP' is horizontal ⊥ vertical y-axis ✓.",
      "worked_example": "Reflect triangle A(1,2), B(4,2), C(4,5) in the y-axis.\nA'=(−1,2), B'=(−4,2), C'=(−4,5).\nSides: AB=3 (horizontal), A'B'=3 ✓; BC=3 (vertical), B'C'=3 ✓. Shape congruent and mirror-image.",
      "visual_description": "The triangle and its reflection are symmetric about the y-axis. Each vertex and its image are the same distance from the y-axis but on opposite sides.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 240 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"90\" x2=\"230\" y2=\"90\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"120\" y1=\"10\" x2=\"120\" y2=\"170\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <text x=\"223\" y=\"86\" fill=\"#888\">x</text><text x=\"124\" y=\"14\" fill=\"#888\">y</text>\n  <!-- original triangle -->\n  <polygon points=\"140,70 180,70 180,30\" fill=\"rgba(37,99,235,0.15)\" stroke=\"#2563eb\" stroke-width=\"1.5\"/>\n  <text x=\"142\" y=\"85\" fill=\"#2563eb\" font-size=\"9\">A(1,2)</text>\n  <text x=\"178\" y=\"85\" fill=\"#2563eb\" font-size=\"9\">B(4,2)</text>\n  <text x=\"182\" y=\"35\" fill=\"#2563eb\" font-size=\"9\">C(4,5)</text>\n  <!-- reflected triangle -->\n  <polygon points=\"100,70 60,70 60,30\" fill=\"rgba(220,38,38,0.12)\" stroke=\"#dc2626\" stroke-width=\"1.5\"/>\n  <text x=\"60\" y=\"85\" fill=\"#dc2626\" font-size=\"9\">A'(−1,2)</text>\n  <text x=\"26\" y=\"85\" fill=\"#dc2626\" font-size=\"9\">B'(−4,2)</text>\n  <text x=\"26\" y=\"35\" fill=\"#dc2626\" font-size=\"9\">C'(−4,5)</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Negating the wrong coordinate: Mx changes y (not x); My changes x (not y).",
        "Forgetting that invariant points of Mx are all points on the x-axis (y=0), and of My are all points on the y-axis (x=0).",
        "Assuming the shape 'flips and moves' — shapes are reflected in place; distance from the mirror line is preserved."
      ],
      "shortcuts_and_tricks": [
        "Mx: flip the sign of y-coordinate only. My: flip the sign of x-coordinate only.",
        "For a polygon: reflect each vertex, then draw the image polygon. Do NOT reflect the sides directly.",
        "Quick invariant-point check: if P lies on the x-axis, Mx(P)=P (y=0 unchanged). If on y-axis, My(P)=P."
      ],
      "when_to_use_this_method": "Any ICSE problem asking for the image of a point or shape under 'reflection in the x-axis' or 'reflection in the y-axis'. Also used when identifying the axis of reflection from a point-image pair.",
      "edge_cases": [
        "A point on the x-axis (y=0) maps to itself under Mx — it is an invariant point.",
        "A point on both axes (origin) is invariant under both Mx and My.",
        "Reflecting twice in the same axis returns the original point: Mx(Mx(P))=P."
      ],
      "key_takeaway": "Mx(x,y)=(x,−y); My(x,y)=(−x,y). The axis of reflection leaves its own coordinate unchanged. Invariant points of Mx: all (x,0); invariant points of My: all (0,y).",
      "video_script_hooks": [
        "Draw a smiley face in Q1, reflect in y-axis — the face appears in Q2 with a mirror-flipped look. Show orientation reversal.",
        "Quiz: 'A point and its image are (3,5) and (−3,5). Which axis is the mirror?' — instant My identification.",
        "Animated dot bouncing from x-axis reflection: the y-coordinate sign flips, x is untouched."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch12_reflection_basics",
    "chapterNumber": 12,
    "key_formulas": [
      {
        "formula": "Definition of Reflection: Mx (mirror line M) maps P to P' such that M is the perpendicular bisector of PP'.",
        "explanation": "Every point P and its image P' are equidistant from M, and PP' is perpendicular to M."
      },
      {
        "formula": "Invariant Point: P is invariant under reflection in M iff P lies on M, i.e. P'=P.",
        "explanation": "Points ON the mirror line map to themselves. All other points move."
      },
      {
        "formula": "Isometry property: |PQ| = |P'Q'| for any two points P, Q and their images P', Q'.",
        "explanation": "Reflection preserves distances (and hence perimeters, areas, angles). The image is congruent to the original."
      },
      {
        "formula": "Orientation reversal: Reflection reverses the orientation (handedness) of a figure.",
        "explanation": "Unlike rotation/translation, a reflected shape is a mirror image — clockwise vertices become anticlockwise."
      }
    ],
    "prerequisite_knowledge": [
      "Cartesian plane — plotting points as (x, y) and reading coordinates.",
      "Midpoint formula: midpoint of (x₁,y₁) and (x₂,y₂) = ((x₁+x₂)/2, (y₁+y₂)/2).",
      "Distance formula: |PQ|=√((x₂−x₁)²+(y₂−y₁)²).",
      "Concept of perpendicular lines and slope (slope of ⊥ lines: m₁×m₂=−1).",
      "Everyday mirror concept: image is the same distance behind the mirror as the object is in front."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Reflection is the mathematical version of a mirror. Every point in the plane is 'flipped' over a fixed line (the mirror line / axis of reflection) to produce its image. The mirror line is equidistant from every point and its image, and they lie on a perpendicular from the point to the line.",
      "derivation": "If M is the mirror line and P is any point, the image P' satisfies: (i) PP' is perpendicular to M; (ii) the midpoint of PP' lies on M. These two conditions uniquely determine P' for any given P. When M is the x-axis, y-axis, y=x, y=−x, or origin, closed-form rules follow directly.",
      "worked_example": "Find the image of P(3,−4) under reflection in the x-axis.\nRule: Mx(x,y)=(x,−y).\nP'=(3,−(−4))=(3,4).\nCheck: midpoint of PP'=((3+3)/2,(−4+4)/2)=(3,0) — on the x-axis ✓. PP' is vertical (same x) ⊥ x-axis ✓.",
      "visual_description": "Plot P and P': they are mirror images about the x-axis. The x-axis bisects PP' at right angles.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"11\">\n  <line x1=\"10\" y1=\"80\" x2=\"190\" y2=\"80\" stroke=\"#888\" stroke-width=\"1.5\"/>\n  <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"150\" stroke=\"#888\" stroke-width=\"1.5\"/>\n  <text x=\"185\" y=\"75\" fill=\"#888\">x</text>\n  <text x=\"104\" y=\"15\" fill=\"#888\">y</text>\n  <circle cx=\"130\" cy=\"50\" r=\"4\" fill=\"#2563eb\"/>\n  <text x=\"135\" y=\"48\" fill=\"#2563eb\">P(3,4)</text>\n  <circle cx=\"130\" cy=\"110\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"135\" y=\"125\" fill=\"#dc2626\">P'(3,−4)</text>\n  <line x1=\"130\" y1=\"50\" x2=\"130\" y2=\"110\" stroke=\"#7c3aed\" stroke-width=\"1.2\" stroke-dasharray=\"4,2\"/>\n  <circle cx=\"130\" cy=\"80\" r=\"3\" fill=\"#7c3aed\"/>\n  <text x=\"105\" y=\"78\" fill=\"#7c3aed\" font-size=\"9\">mid</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Confusing reflection with rotation — reflection reverses orientation (left hand becomes right hand), rotation does not.",
        "Thinking only axis-aligned mirrors exist. y=x and y=−x are equally valid ICSE reflection lines.",
        "Applying the wrong sign: Mx gives (x,−y) not (−x,y). My gives (−x,y) not (x,−y). Mnemonize: the axis you reflect IN leaves its own coordinate unchanged."
      ],
      "shortcuts_and_tricks": [
        "Axis you reflect IN = coordinate that stays unchanged. Reflect in x-axis → x unchanged, y changes sign. Reflect in y-axis → y unchanged, x changes sign.",
        "Invariant point test: substitute back — if P'=P, the point lies on the mirror line.",
        "For any line x=a: image x-coordinate = 2a−x (y unchanged). For y=b: image y-coordinate = 2b−y (x unchanged)."
      ],
      "when_to_use_this_method": "Use reflection rules when finding images of points, vertices of shapes, or invariant points. Geometry problems asking 'find the image of …' or 'name the line of reflection' directly use these rules.",
      "edge_cases": [
        "Invariant points are ONLY those lying exactly on the mirror line — not all 'stationary-looking' points.",
        "Reflecting in the origin is equivalent to a 180° rotation about the origin; it is NOT a reflection in a coordinate axis.",
        "For a shape (triangle, quadrilateral), reflect each vertex independently, then reconnect."
      ],
      "key_takeaway": "Reflection flips every point over a fixed mirror line, preserving distances and shape but reversing orientation. The mirror line is the perpendicular bisector of the segment joining each point to its image. Invariant points lie on the mirror line itself.",
      "video_script_hooks": [
        "Hold a ruler up as a 'mirror'. Put your hand on one side — where does its image appear? That's reflection.",
        "Ask: 'If I reflect (5,3) in the x-axis, what changes? What stays the same?' — makes the rule intuitive.",
        "Invariant point puzzle: 'Which points stay fixed when you reflect in y=x?' Challenge the class."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch12_reflection_lines",
    "chapterNumber": 12,
    "key_formulas": [
      {
        "formula": "Reflection in y=x: M(y=x)(x, y) = (y, x).",
        "explanation": "Swap the x and y coordinates. The line y=x is the 45° diagonal mirror."
      },
      {
        "formula": "Reflection in y=−x: M(y=−x)(x, y) = (−y, −x).",
        "explanation": "Swap then negate both coordinates. The line y=−x is the 135° diagonal mirror."
      },
      {
        "formula": "Reflection in origin: MO(x, y) = (−x, −y).",
        "explanation": "Negate both coordinates. Only the origin itself is invariant. Equivalent to Mx followed by My."
      },
      {
        "formula": "Invariant sets: M(y=x) → entire line y=x; M(y=−x) → entire line y=−x; MO → only (0,0).",
        "explanation": "Points on the mirror line are always invariant. MO has no extended mirror line — only a mirror point (the origin)."
      }
    ],
    "prerequisite_knowledge": [
      "Equations of lines through the origin: y=x (slope 1) and y=−x (slope −1).",
      "Mx and My rules from the previous sub-topic.",
      "Slope of perpendicular lines: m₁×m₂=−1.",
      "Midpoint formula — verifying the mirror bisects PP'.",
      "Coordinate manipulation: swapping and negating components."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Reflecting in y=x swaps coordinates: (x,y)→(y,x). Think of it as swapping the x and y roles. Reflecting in y=−x swaps and negates both: (x,y)→(−y,−x). Reflecting in the origin negates both coordinates: (x,y)→(−x,−y) — same as a 180° rotation, but classified as point reflection in ICSE.",
      "derivation": "For M(y=x): midpoint of P(x,y) and P'(a,b) must lie on y=x → (x+a)/2=(y+b)/2; PP' must be ⊥ to y=x (slope 1) so slope of PP'=−1 → (b−y)/(a−x)=−1. Solving: a=y, b=x. So M(y=x)(x,y)=(y,x).\nFor M(origin): (x,y)→(−x,−y) (can be derived as double reflection Mx followed by My).",
      "worked_example": "Reflect P(3,−1) in the line y=x.\nSwap coordinates: P'=(−1,3).\nVerify: midpoint = (3+(−1))/2,(−1+3)/2) = (1,1) — on y=x ✓.\nSlope PP'=(3−(−1))/(−1−3)=4/(−4)=−1 ⊥ slope of y=x (slope 1) ✓.",
      "visual_description": "The line y=x is a 45° diagonal. Reflecting a point in this line swaps its x and y coordinates. The image lies on the opposite side of the diagonal at the same distance.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"100\" x2=\"190\" y2=\"100\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"190\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"10\" y1=\"190\" x2=\"190\" y2=\"10\" stroke=\"#16a34a\" stroke-width=\"1.5\" stroke-dasharray=\"5,3\"/>\n  <text x=\"182\" y=\"14\" fill=\"#16a34a\" font-size=\"9\">y=x</text>\n  <circle cx=\"160\" cy=\"60\" r=\"4\" fill=\"#2563eb\"/>\n  <text x=\"164\" y=\"58\" fill=\"#2563eb\">P(3,2)</text>\n  <circle cx=\"80\" cy=\"40\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"60\" y=\"36\" fill=\"#dc2626\">P'(2,3)</text>\n  <line x1=\"160\" y1=\"60\" x2=\"80\" y2=\"40\" stroke=\"#7c3aed\" stroke-width=\"1.2\" stroke-dasharray=\"3,2\"/>\n</svg>"
      ],
      "common_misconceptions": [
        "Confusing M(y=x) with My: swapping coordinates ≠ negating x.",
        "For M(y=−x): formula is (−y,−x), not just (−x,−y). Both coordinates swap AND negate.",
        "Reflection in origin ≠ reflection in either axis; it negates BOTH coordinates."
      ],
      "shortcuts_and_tricks": [
        "M(y=x): just SWAP x and y. (a,b)→(b,a).",
        "M(y=−x): SWAP and NEGATE both. (a,b)→(−b,−a).",
        "MO (origin): NEGATE both. (a,b)→(−a,−b).",
        "Remember all three with the table: swap? negate? → y=x: swap only; y=−x: swap+negate; origin: negate only."
      ],
      "when_to_use_this_method": "ICSE problems frequently ask reflections in y=x or the origin. Coordinate geometry questions involving 'find the image under reflection in y=−x' or 'prove that P and P' are reflections' use these rules.",
      "edge_cases": [
        "Invariant points of M(y=x): all points where x=y (i.e. the entire line y=x).",
        "Invariant points of M(y=−x): all points where y=−x.",
        "MO has only one invariant point: the origin itself (0,0).",
        "M(y=x) applied twice returns the original: M(y=x)(M(y=x)(P))=P."
      ],
      "key_takeaway": "Three key rules: M(y=x)(x,y)=(y,x); M(y=−x)(x,y)=(−y,−x); MO(x,y)=(−x,−y). Invariant points lie on the respective mirror line (or at the origin for MO).",
      "video_script_hooks": [
        "Show a table of coordinates being 'swapped' for y=x — make it look like a simple trick, then ask why it works.",
        "Draw y=x and y=−x on the same grid; animate reflections in each — the different swap/negate patterns become visual.",
        "Challenge: 'If P' = (4,−3), and P was reflected in y=−x, find P.' — inverse reflection = same rule."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch12_reflection_problems",
    "chapterNumber": 12,
    "key_formulas": [
      {
        "formula": "Reflection in x=a (vertical line): image of (x, y) is (2a−x, y).",
        "explanation": "The y-coordinate is unchanged; the x-coordinate is reflected about x=a using x'=2a−x."
      },
      {
        "formula": "Reflection in y=b (horizontal line): image of (x, y) is (x, 2b−y).",
        "explanation": "The x-coordinate is unchanged; the y-coordinate is reflected about y=b using y'=2b−y."
      },
      {
        "formula": "Finding the mirror line from P(x₁,y₁) and P'(x₂,y₂): mirror passes through midpoint M=((x₁+x₂)/2,(y₁+y₂)/2) and has slope −1/m where m is the slope of PP'.",
        "explanation": "The mirror is the perpendicular bisector of PP'. Two conditions fully determine it: it passes through the midpoint and is perpendicular to PP'."
      },
      {
        "formula": "Composition rule: Mx then My = MO (and vice versa). M(y=x) then MO = M(y=−x).",
        "explanation": "Combining two reflections gives a predictable result. Mx∘My = reflection in origin; M(y=x)∘MO = reflection in y=−x."
      }
    ],
    "prerequisite_knowledge": [
      "All four reflection rules: Mx, My, M(y=x), M(y=−x), MO.",
      "Equation of a line from two points; slope-intercept and point-slope forms.",
      "Midpoint formula and perpendicular slope condition.",
      "Reflection in vertical line x=a and horizontal line y=b.",
      "Isometry properties — congruence and area preservation under reflection."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Applied reflection problems combine the basic rules with coordinate geometry: find the image of a shape, find the equation of a mirror line from a point-image pair, identify invariant points, or determine whether two shapes are reflections of each other. The key is systematic application of the rule for the given mirror.",
      "derivation": "To find the mirror line from a point P(x₁,y₁) and its image P'(x₂,y₂): the mirror line passes through the midpoint M=((x₁+x₂)/2,(y₁+y₂)/2) and is perpendicular to PP'. If PP' has slope m, the mirror line has slope −1/m.",
      "worked_example": "A(−2,3) reflects to A'(3,−2). Find the axis of reflection.\nMidpoint = ((−2+3)/2,(3+(−2))/2)=(1/2,1/2).\nSlope of AA'=(−2−3)/(3−(−2))=−5/5=−1.\nMirror line ⊥ AA', slope=1, passing through (1/2,1/2): y−1/2=1(x−1/2) → y=x.\nSo the mirror is y=x. Confirm: M(y=x)(−2,3)=(3,−2)=A' ✓.",
      "visual_description": "Plot A and A' and draw their midpoint. The mirror line passes through that midpoint perpendicularly bisecting AA'.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 220 200\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"100\" x2=\"210\" y2=\"100\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"110\" y1=\"10\" x2=\"110\" y2=\"190\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"10\" y1=\"190\" x2=\"210\" y2=\"10\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <text x=\"195\" y=\"12\" fill=\"#16a34a\" font-size=\"9\">y=x</text>\n  <circle cx=\"70\" cy=\"60\" r=\"4\" fill=\"#2563eb\"/>\n  <text x=\"40\" y=\"55\" fill=\"#2563eb\">A(−2,3)</text>\n  <circle cx=\"160\" cy=\"130\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"162\" y=\"145\" fill=\"#dc2626\">A'(3,−2)</text>\n  <circle cx=\"115\" cy=\"95\" r=\"3\" fill=\"#7c3aed\"/>\n  <text x=\"118\" y=\"90\" fill=\"#7c3aed\" font-size=\"9\">M(½,½)</text>\n  <line x1=\"70\" y1=\"60\" x2=\"160\" y2=\"130\" stroke=\"#7c3aed\" stroke-width=\"1.2\" stroke-dasharray=\"4,2\"/>\n</svg>"
      ],
      "common_misconceptions": [
        "Finding the midpoint of P and P' gives a point ON the mirror, not the entire mirror line — you still need the slope condition.",
        "When reflecting a polygon, students sometimes reflect only one or two vertices. All vertices must be reflected.",
        "Invariant points are those on the mirror line. 'Invariant' does NOT mean the whole figure is unchanged."
      ],
      "shortcuts_and_tricks": [
        "To identify mirror from P and P': midpoint and perpendicular slope fully determine it.",
        "For 'reflecting in y=x': swap x and y. Verify by checking the midpoint lies on y=x and PP' has slope −1.",
        "If the problem says 'A reflects to A'' and asks which line: test candidate lines (x-axis, y-axis, y=x, y=−x) with the rule and see which matches."
      ],
      "when_to_use_this_method": "Use whenever ICSE asks for images of polygons, invariant points, the equation of the mirror line, or combined transformations involving reflection.",
      "edge_cases": [
        "If a shape has a vertex ON the mirror line, that vertex maps to itself (invariant).",
        "Two successive reflections in perpendicular mirror lines = 180° rotation about their intersection.",
        "Combined transformations: always apply in the stated order — transformations do NOT generally commute."
      ],
      "key_takeaway": "Solve reflection problems by: (1) identifying the mirror, (2) applying the correct rule to every point, (3) verifying midpoints and perpendicularity. To find the mirror from a P-P' pair: midpoint + perpendicular slope.",
      "video_script_hooks": [
        "Draw a triangle THEN ask: 'Without using coordinates, can you guess the mirror?' Then confirm with calculations.",
        "Reverse-engineering puzzle: 'Here are A(1,3) and A'(3,1). What's the mirror line?' — live solve on the board.",
        "Double reflection demo: reflect in x-axis then y-axis — the result is the same as reflecting in the origin."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch13_midpoint",
    "chapterNumber": 13,
    "key_formulas": [
      {
        "formula": "Midpoint Formula: M = ((x₁+x₂)/2, (y₁+y₂)/2) where A(x₁,y₁) and B(x₂,y₂).",
        "explanation": "The midpoint splits AB into two equal halves. Each coordinate of M is the arithmetic mean of the corresponding coordinates of A and B."
      },
      {
        "formula": "Section formula (1:1 case): ratio m:n=1:1 → midpoint = ((x₁+x₂)/2, (y₁+y₂)/2).",
        "explanation": "Midpoint is the special case of the section formula when both parts are equal."
      },
      {
        "formula": "Finding unknown endpoint: if M=(h,k) is the midpoint of A(x₁,y₁) and B(x₂,y₂), then x₂=2h−x₁ and y₂=2k−y₁.",
        "explanation": "Rearrange: x₁+x₂=2h → x₂=2h−x₁. Useful when one endpoint and the midpoint are given."
      }
    ],
    "prerequisite_knowledge": [
      "Cartesian coordinates — plotting and reading (x, y) pairs.",
      "Arithmetic mean: average of two numbers = (a+b)/2.",
      "Distance formula — often used alongside midpoint.",
      "Basic idea of dividing a line segment into equal parts.",
      "Reflection concepts (midpoint of PP' lies on mirror line)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The midpoint is the 'average position' of two points — add the x-coordinates and halve, add the y-coordinates and halve. It's the same idea as finding the average of two numbers, applied to each coordinate independently.",
      "derivation": "A(x₁,y₁) and B(x₂,y₂). Point M=(h,k) divides AB equally: AM=MB. Horizontally: h−x₁=x₂−h → 2h=x₁+x₂ → h=(x₁+x₂)/2. Vertically: k=(y₁+y₂)/2. So M=((x₁+x₂)/2,(y₁+y₂)/2).",
      "worked_example": "Find the midpoint of A(3, −1) and B(7, 5).\nh=(3+7)/2=10/2=5; k=(−1+5)/2=4/2=2.\nMidpoint M=(5,2).\nVerify: AM=√((5−3)²+(2+1)²)=√(4+9)=√13. MB=√((7−5)²+(5−2)²)=√(4+9)=√13. AM=MB ✓.",
      "visual_description": "Plot A and B on the grid. M sits exactly halfway between them — halfway horizontally AND halfway vertically.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"80\" x2=\"190\" y2=\"80\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"150\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <circle cx=\"60\" cy=\"110\" r=\"4\" fill=\"#2563eb\"/><text x=\"32\" y=\"108\" fill=\"#2563eb\">A(3,−1)</text>\n  <circle cx=\"140\" cy=\"50\" r=\"4\" fill=\"#2563eb\"/><text x=\"144\" y=\"48\" fill=\"#2563eb\">B(7,5)</text>\n  <circle cx=\"100\" cy=\"80\" r=\"4\" fill=\"#dc2626\"/><text x=\"104\" y=\"75\" fill=\"#dc2626\">M(5,2)</text>\n  <line x1=\"60\" y1=\"110\" x2=\"140\" y2=\"50\" stroke=\"#7c3aed\" stroke-width=\"1.5\"/>\n  <line x1=\"100\" y1=\"80\" x2=\"100\" y2=\"80\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n</svg>"
      ],
      "common_misconceptions": [
        "Averaging only one coordinate: both x AND y must be averaged.",
        "Mixing up the formula: (x₁+x₂)/2 not (x₁−x₂)/2.",
        "When finding an unknown endpoint: x₂=2h−x₁ (not x₂=h−x₁)."
      ],
      "shortcuts_and_tricks": [
        "Midpoint = 'average of each coordinate'. Write A and B coordinates, add, halve.",
        "Unknown endpoint: double the midpoint coordinate then subtract the known endpoint.",
        "Check: midpoint should visually sit between the two points when plotted."
      ],
      "when_to_use_this_method": "Use midpoint formula whenever a problem asks for the centre of a segment, the meeting point of diagonals, or verifying that a point bisects a line segment.",
      "edge_cases": [
        "If one point is the origin (0,0), midpoint = (x₂/2, y₂/2).",
        "If both points are the same, midpoint = the point itself.",
        "Midpoint coordinates can be non-integers (fractions) — don't round unless asked."
      ],
      "key_takeaway": "Midpoint = average each coordinate: M=((x₁+x₂)/2,(y₁+y₂)/2). To find a missing endpoint: unknown = 2×midpoint − known endpoint.",
      "video_script_hooks": [
        "Walk halfway between two chairs in the classroom — that physical position is the midpoint.",
        "Show on the number line first: midpoint of 2 and 8 is 5. Then extend to 2D.",
        "Challenge: 'If M=(4,3) and A=(1,7), where is B?' — live class calculation."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch13_section_external",
    "chapterNumber": 13,
    "key_formulas": [
      {
        "formula": "Section Formula (External): P divides A(x₁,y₁) and B(x₂,y₂) in ratio m:n externally → P = ((mx₂−nx₁)/(m−n), (my₂−ny₁)/(m−n)).",
        "explanation": "P lies OUTSIDE segment AB on the line AB extended. The formula is the internal formula with n replaced by −n (subtraction instead of addition)."
      },
      {
        "formula": "P lies beyond B if m>n; P lies beyond A (on the other side) if m<n.",
        "explanation": "The denominator m−n tells you which side: positive → beyond B; negative → beyond A (use absolute values for the ratio)."
      },
      {
        "formula": "If m=n, the denominator is 0 → no finite external division point (the point is at infinity — the lines are parallel/the ratio is 1:1 externally).",
        "explanation": "External 1:1 is undefined — there is no point equidistant from A and B on the extension."
      }
    ],
    "prerequisite_knowledge": [
      "Internal section formula and ratio concept.",
      "Directed ratio — the idea of ratio having a sign (m:n vs m:−n).",
      "The difference between a point between two endpoints vs outside them.",
      "Fraction subtraction and simplification.",
      "What it means for a point to be on the extension of a line segment."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Internal division puts the point BETWEEN A and B. External division puts it OUTSIDE — you extend the segment and go beyond one of the endpoints. Imagine overshoot: you reach B and keep going for the same kind of proportional distance. The formula changes sign in the denominator.",
      "derivation": "For external division in ratio m:n: P=(h,k) is outside AB with AP:PB=m:n but P is beyond B. Using signed ratios: (h−x₁)/(h−x₂)=m/n → n(h−x₁)=m(h−x₂) → nh−nx₁=mh−mx₂ → h(n−m)=nx₁−mx₂ → h=(mx₂−nx₁)/(m−n). Similarly k=(my₂−ny₁)/(m−n).",
      "worked_example": "Find the point dividing A(1, 2) and B(7, 8) in ratio 3:1 externally.\nm=3, n=1.\nx=(3×7−1×1)/(3−1)=(21−1)/2=20/2=10.\ny=(3×8−1×2)/(3−1)=(24−2)/2=22/2=11.\nP=(10,11).\nNote P lies beyond B on the extension (B is at (7,8); P at (10,11) is further along the same direction).",
      "visual_description": "P is outside segment AB, beyond B. The segment AB is extended and P is reached by continuing past B in the same direction.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <circle cx=\"30\" cy=\"40\" r=\"4\" fill=\"#2563eb\"/><text x=\"5\" y=\"36\" fill=\"#2563eb\">A(1,2)</text>\n  <circle cx=\"130\" cy=\"40\" r=\"4\" fill=\"#2563eb\"/><text x=\"133\" y=\"36\" fill=\"#2563eb\">B(7,8)</text>\n  <circle cx=\"230\" cy=\"40\" r=\"4\" fill=\"#dc2626\"/><text x=\"214\" y=\"28\" fill=\"#dc2626\">P(10,11)</text>\n  <line x1=\"30\" y1=\"40\" x2=\"250\" y2=\"40\" stroke=\"#888\" stroke-width=\"1.5\" stroke-dasharray=\"4,2\"/>\n  <text x=\"60\" y=\"58\" fill=\"#7c3aed\" font-size=\"9\">← AB (internal) →</text>\n  <text x=\"175\" y=\"58\" fill=\"#dc2626\" font-size=\"9\">Extension</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Using addition (+) instead of subtraction (−) in the external formula. External = subtract.",
        "Thinking external division is always beyond B: it can be beyond A if m<n.",
        "m=n giving a division-by-zero — flag this: no external point exists for equal ratio."
      ],
      "shortcuts_and_tricks": [
        "External formula = internal formula but with n replaced by −n (change sign of second term in numerator and denominator).",
        "Quick check: external point should NOT be between A and B. If it ends up between them, you likely used the internal formula.",
        "Use the formula P=((mx₂−nx₁)/(m−n), (my₂−ny₁)/(m−n)) as a single formula for both cases if you allow signed ratios."
      ],
      "when_to_use_this_method": "Use when a problem says 'divides externally in ratio m:n' or asks for a point beyond one of the endpoints on the line through A and B.",
      "edge_cases": [
        "m=n → undefined (no external division point).",
        "Negative ratio in a problem may implicitly indicate external division.",
        "P outside segment means: x-coordinate of P is NOT between x₁ and x₂ (unless segment is vertical)."
      ],
      "key_takeaway": "External section formula: P=((mx₂−nx₁)/(m−n),(my₂−ny₁)/(m−n)). Denominators subtract; P lies outside AB. Undefined when m=n.",
      "video_script_hooks": [
        "Imagine you walk from A to B and overshoot B by a proportional amount — that's external division.",
        "Show on a number line: internal 2:1 of (0,6) = 4; external 2:1 of (0,6) = 12. The external point is beyond 6.",
        "When does it fail? Set m=n and watch the formula blow up — explains the concept of parallel direction."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch13_section_internal",
    "chapterNumber": 13,
    "key_formulas": [
      {
        "formula": "Section Formula (Internal): P divides A(x₁,y₁) to B(x₂,y₂) in ratio m:n internally → P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)).",
        "explanation": "P lies BETWEEN A and B. The formula is a weighted average: the end closer to the larger ratio weight gets more 'pull'. Mnemonic: 'far end × near ratio'."
      },
      {
        "formula": "Ratio form: if ratio is k:1, then P = ((kx₂+x₁)/(k+1), (ky₂+y₁)/(k+1)).",
        "explanation": "Setting n=1 simplifies calculation. Used when you want to express ratio as a single number k."
      },
      {
        "formula": "Check: midpoint is a special case with m=n → P = ((x₁+x₂)/2, (y₁+y₂)/2).",
        "explanation": "Substituting m=n into the section formula gives the midpoint formula — confirms consistency."
      }
    ],
    "prerequisite_knowledge": [
      "Midpoint formula (special case of section formula at ratio 1:1).",
      "Ratio and proportion — what m:n means.",
      "Signed (directed) ratios: internal division stays between the two points.",
      "Substitution into two-variable formulas.",
      "Basic fraction arithmetic."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Imagine walking from A to B. If you stop at ratio m:n from A (meaning you've covered m parts of the m+n total), where exactly are you? The section formula gives the exact coordinates of that stopping point. The formula is a weighted average — the point is pulled towards A or B based on the ratio.",
      "derivation": "A(x₁,y₁), B(x₂,y₂), P=(h,k) divides AB internally in m:n. By similar triangles (or proportional division): (h−x₁)/(x₂−h) = m/n → n(h−x₁)=m(x₂−h) → nh−nx₁=mx₂−mh → h(m+n)=mx₂+nx₁ → h=(mx₂+nx₁)/(m+n). Similarly k=(my₂+ny₁)/(m+n).",
      "worked_example": "Find the point dividing A(1, 3) and B(7, 9) in ratio 2:1 internally.\nm=2, n=1.\nx=(2×7+1×1)/(2+1)=(14+1)/3=15/3=5.\ny=(2×9+1×3)/(2+1)=(18+3)/3=21/3=7.\nP=(5,7).\nVerify: AP=√((5−1)²+(7−3)²)=√(16+16)=4√2. PB=√((7−5)²+(9−7)²)=√(4+4)=2√2. AP:PB=4√2:2√2=2:1 ✓.",
      "visual_description": "P sits inside segment AB, closer to B since m>n. The closer the ratio is to 1:1, the nearer P is to the midpoint.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 220 80\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <circle cx=\"30\" cy=\"40\" r=\"4\" fill=\"#2563eb\"/><text x=\"5\" y=\"36\" fill=\"#2563eb\">A(1,3)</text>\n  <circle cx=\"190\" cy=\"40\" r=\"4\" fill=\"#2563eb\"/><text x=\"193\" y=\"36\" fill=\"#2563eb\">B(7,9)</text>\n  <circle cx=\"137\" cy=\"40\" r=\"4\" fill=\"#dc2626\"/><text x=\"130\" y=\"28\" fill=\"#dc2626\">P(5,7)</text>\n  <line x1=\"30\" y1=\"40\" x2=\"190\" y2=\"40\" stroke=\"#888\" stroke-width=\"1.5\"/>\n  <text x=\"75\" y=\"58\" fill=\"#7c3aed\" font-size=\"9\">AP = 2 parts</text>\n  <text x=\"148\" y=\"58\" fill=\"#7c3aed\" font-size=\"9\">PB = 1 part</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Swapping the ratio: P divides AB in m:n, not n:m. The ratio is measured from A to B.",
        "Forgetting 'far-end × near-ratio': the x₂ gets multiplied by m (the ratio near B), not n.",
        "Confusing internal with external: internal → P is BETWEEN A and B."
      ],
      "shortcuts_and_tricks": [
        "Memory hook: 'mx₂+nx₁' — the denominator end (B=x₂) gets m, the numerator end (A=x₁) gets n.",
        "If asked for the ratio in which P divides AB: let ratio=k:1, plug P into the formula, solve for k.",
        "Always verify by checking AP:PB using the distance formula."
      ],
      "when_to_use_this_method": "Use section formula (internal) whenever a point divides a segment in a given ratio, to find coordinates of dividing point, midpoints of sides in triangles, or to find centroids.",
      "edge_cases": [
        "Ratio 1:1 → midpoint. Special case, no need to use full formula.",
        "If the point is given and ratio is unknown: substitute P into formula, equate, solve for m/n.",
        "Ratio can be expressed as a fraction: ratio 2:3 means m=2, n=3."
      ],
      "key_takeaway": "Internal section formula: P=((mx₂+nx₁)/(m+n),(my₂+ny₁)/(m+n)). Memory: far-end × near-ratio, over total m+n. Midpoint is the 1:1 case.",
      "video_script_hooks": [
        "Two students stand at A and B; walk to P that divides them 2:1. Then verify using ruler — the formula matches reality.",
        "Show centroid = average of 3 vertices = three midpoints converging — connects to the formula.",
        "Reverse problem: 'Given P(4,5) lies on AB where A=(1,2) and B=(7,8). What's the ratio?' — live solve."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch13_section_problems",
    "chapterNumber": 13,
    "key_formulas": [
      {
        "formula": "Centroid of △ABC: G = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3).",
        "explanation": "The centroid is the average of all three vertex coordinates. Each median divides in ratio 2:1 from vertex to midpoint of opposite side."
      },
      {
        "formula": "Collinearity: A, B, C collinear iff x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)=0.",
        "explanation": "Three points are collinear iff the triangle they form has zero area."
      },
      {
        "formula": "Finding ratio when P on AB is given: let ratio=k:1, apply section formula, equate to P's coordinates, solve for k.",
        "explanation": "If k>0, P divides internally. If k<0, P divides externally."
      },
      {
        "formula": "Midpoint of diagonal = point where diagonals bisect each other (for parallelogram/rhombus).",
        "explanation": "In a parallelogram ABCD, diagonals AC and BD bisect each other → midpoint of AC = midpoint of BD."
      }
    ],
    "prerequisite_knowledge": [
      "Internal and external section formulas.",
      "Midpoint formula.",
      "Collinearity condition: three points A, B, C are collinear iff the area of △ABC = 0.",
      "Centroid definition: point of intersection of medians = ((x₁+x₂+x₃)/3,(y₁+y₂+y₃)/3).",
      "Area of triangle using coordinates: ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Section formula problems often combine multiple steps: find a midpoint, then use it in a section calculation, or verify collinearity by checking if the area is zero. The key strategy is to identify what the problem is really asking — is it a midpoint, a ratio, or a centroid?",
      "derivation": "Centroid derivation: the medians of a triangle intersect at G which divides each median in 2:1 from vertex. If M is the midpoint of BC, G divides AM in 2:1. G=((2×(x₂+x₃)/2+1×x₁)/(2+1))=(x₁+x₂+x₃)/3. Similarly for y. So G=((x₁+x₂+x₃)/3,(y₁+y₂+y₃)/3).",
      "worked_example": "The vertices of a triangle are A(1,3), B(5,1), C(3,7). Find: (a) centroid G. (b) Check if G lies on the median from A.\n(a) G=((1+5+3)/3,(3+1+7)/3)=(9/3,11/3)=(3,11/3).\n(b) Midpoint of BC = M=((5+3)/2,(1+7)/2)=(4,4). G should divide AM in 2:1. Section: (2×4+1×1)/(2+1)=9/3=3 ✓; (2×4+1×3)/3=11/3 ✓.",
      "visual_description": "The centroid lies inside the triangle at the 'balance point'. The three medians cross at G, which sits closer to the midpoint of each opposite side than to the vertex.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"140\" x2=\"190\" y2=\"140\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"160\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <polygon points=\"30,120 150,150 90,30\" fill=\"rgba(37,99,235,0.08)\" stroke=\"#2563eb\" stroke-width=\"1.5\"/>\n  <text x=\"15\" y=\"118\" fill=\"#2563eb\" font-size=\"9\">A</text>\n  <text x=\"153\" y=\"148\" fill=\"#2563eb\" font-size=\"9\">B</text>\n  <text x=\"85\" y=\"26\" fill=\"#2563eb\" font-size=\"9\">C</text>\n  <circle cx=\"90\" cy=\"100\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"93\" y=\"98\" fill=\"#dc2626\" font-size=\"9\">G (centroid)</text>\n  <line x1=\"30\" y1=\"120\" x2=\"120\" y2=\"90\" stroke=\"#16a34a\" stroke-width=\"1\" stroke-dasharray=\"3,2\"/>\n  <line x1=\"150\" y1=\"150\" x2=\"60\" y2=\"75\" stroke=\"#16a34a\" stroke-width=\"1\" stroke-dasharray=\"3,2\"/>\n  <line x1=\"90\" y1=\"30\" x2=\"90\" y2=\"135\" stroke=\"#16a34a\" stroke-width=\"1\" stroke-dasharray=\"3,2\"/>\n</svg>"
      ],
      "common_misconceptions": [
        "Centroid formula: all THREE x-coordinates added and divided by 3. Don't average just two.",
        "Thinking centroid = circumcenter or incenter. These are different triangle centres.",
        "Collinearity check: the area formula gives a signed area; equate to zero (not check sign)."
      ],
      "shortcuts_and_tricks": [
        "Centroid: just average all three x-values and all three y-values. Simplest of the triangle centres.",
        "Parallelogram diagonal check: midpoint of AC = midpoint of BD → point is known; equate and solve for unknowns.",
        "Ratio problem: use ratio k:1 (let n=1). One equation usually suffices; use the other to verify."
      ],
      "when_to_use_this_method": "Use section formula applied problems for: finding centroid, proving collinearity, solving parallelogram/rhombus problems using diagonal midpoints, and finding the ratio in which a given point divides a segment.",
      "edge_cases": [
        "If G is given and two vertices are known, use centroid formula to find third vertex: x₃=3xG−x₁−x₂.",
        "Collinearity: if three points are collinear AND one is between the other two, you can also verify via section formula (check if the middle point divides with a positive ratio).",
        "Diagonals of a rhombus bisect each other at 90° — combine midpoint formula with slope condition."
      ],
      "key_takeaway": "Centroid G=((x₁+x₂+x₃)/3,(y₁+y₂+y₃)/3). Collinearity: area=0. Parallelogram: midpoints of diagonals coincide. Ratio problems: let ratio=k:1 and solve.",
      "video_script_hooks": [
        "Balance a cardboard triangle on a pencil tip at the centroid — physical demonstration of the balance point.",
        "Diagonal midpoint puzzle: 'ABCD is a parallelogram, A(1,2), B(4,6), C(7,4). Find D.' — live solve using midpoint equality.",
        "Collinearity test: three cities on a map — are they on the same straight road? Apply the area formula."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch14_line_forms",
    "chapterNumber": 14,
    "key_formulas": [
      {
        "formula": "Slope-intercept form: y = mx + c, where m = slope and c = y-intercept.",
        "explanation": "The most common form. Given m and c, the line is fully determined. To find c: substitute any known point."
      },
      {
        "formula": "Point-slope form: y − y₁ = m(x − x₁), where (x₁, y₁) is a known point and m is the slope.",
        "explanation": "Use when slope and one point are given. Rearrange to y=mx+c if needed."
      },
      {
        "formula": "Two-point form: (y−y₁)/(y₂−y₁) = (x−x₁)/(x₂−x₁), equivalent to y−y₁=m(x−x₁) with m computed first.",
        "explanation": "Use when two points are given. First compute m, then apply point-slope form."
      },
      {
        "formula": "Intercept form: x/a + y/b = 1, where a = x-intercept and b = y-intercept.",
        "explanation": "Use when both intercepts are known. Multiply out: bx + ay = ab → rearrange to standard form."
      }
    ],
    "prerequisite_knowledge": [
      "Slope formula m=(y₂−y₁)/(x₂−x₁).",
      "Substitution into formulas.",
      "Solving linear equations in two unknowns.",
      "x-intercept (y=0) and y-intercept (x=0) concepts.",
      "Rearranging equations to standard form ax+by+c=0."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Every straight line can be written as y=mx+c. The slope m tells you the direction, and c tells you where the line crosses the y-axis. Point-slope form is the most versatile: you can write the equation the moment you know any one point and the slope.",
      "derivation": "A line with slope m passes through (x₁,y₁). For any other point (x,y): (y−y₁)/(x−x₁)=m → y−y₁=m(x−x₁). This is point-slope form. Expanding: y=mx−mx₁+y₁=mx+(y₁−mx₁). Here c=y₁−mx₁ is the y-intercept.",
      "worked_example": "Find the equation of the line through A(2, 3) with slope 4.\nPoint-slope: y−3=4(x−2) → y=4x−8+3=4x−5.\nOr: c=y₁−mx₁=3−4×2=−5. So y=4x−5.",
      "visual_description": "The line y=4x−5 crosses y-axis at (0,−5) and has steep positive slope. Every unit right → 4 units up.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"90\" x2=\"190\" y2=\"90\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"90\" y1=\"10\" x2=\"90\" y2=\"170\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"30\" y1=\"160\" x2=\"150\" y2=\"40\" stroke=\"#2563eb\" stroke-width=\"1.8\"/>\n  <circle cx=\"90\" cy=\"145\" r=\"3\" fill=\"#dc2626\"/><text x=\"93\" y=\"148\" fill=\"#dc2626\" font-size=\"9\">c(0,−5)</text>\n  <circle cx=\"110\" cy=\"65\" r=\"3\" fill=\"#2563eb\"/><text x=\"113\" y=\"63\" fill=\"#2563eb\" font-size=\"9\">A(2,3)</text>\n  <text x=\"148\" y=\"38\" fill=\"#2563eb\" font-size=\"9\">y=4x−5</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Confusing slope-intercept c with x-intercept. c is the y-intercept (set x=0 in y=mx+c → y=c).",
        "Point-slope form: don't forget the negative sign: y−y₁=m(x−x₁), not y+y₁.",
        "Two-point form: calculate m first, THEN use point-slope. Don't try to memorise the two-point formula separately."
      ],
      "shortcuts_and_tricks": [
        "To find c in y=mx+c: substitute the given point: c=y−mx.",
        "To find x-intercept: set y=0 and solve for x. To find y-intercept: set x=0.",
        "Rearrange to ax+by+c=0 for standard form; coefficients should be integers (multiply through if needed)."
      ],
      "when_to_use_this_method": "Use slope-intercept when slope and y-intercept are known. Use point-slope when slope and one point are known. Use two-point form when two points are given. Use intercept form when both intercepts are given.",
      "edge_cases": [
        "Vertical line x=a cannot be written in y=mx+c form — it has undefined slope.",
        "Horizontal line y=b has slope 0 → y=0·x+b=b.",
        "Line through origin: c=0 → y=mx."
      ],
      "key_takeaway": "y=mx+c (slope-intercept); y−y₁=m(x−x₁) (point-slope); x/a+y/b=1 (intercept form). In practice: find m first, then use one known point to find c.",
      "video_script_hooks": [
        "Start with a grid — mark slope m=2 as 'rise 2, run 1'. Mark the y-intercept at (0,c). The line is fully determined.",
        "Show that all three forms give the same line by converting between them.",
        "Challenge: 'Write the equation of the line parallel to y=3x−1 passing through (2,5).' — instant: same m=3, find c."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch14_line_problems",
    "chapterNumber": 14,
    "key_formulas": [
      {
        "formula": "Equation of line parallel to y=mx+c through point (x₁,y₁): y−y₁=m(x−x₁).",
        "explanation": "Same slope m, different point. The c-value changes but m stays."
      },
      {
        "formula": "Equation of line perpendicular to y=mx+c through (x₁,y₁): y−y₁=(−1/m)(x−x₁).",
        "explanation": "Slope becomes −1/m (flip and negate). Then use point-slope form."
      },
      {
        "formula": "Intersection of two lines: solve their equations simultaneously (substitution or elimination).",
        "explanation": "The intersection point satisfies both equations. Set equal or use elimination."
      },
      {
        "formula": "Perpendicular bisector of segment AB: passes through midpoint of AB with slope perpendicular to AB.",
        "explanation": "Find midpoint M and slope of AB, then write line through M with slope −1/m_AB."
      }
    ],
    "prerequisite_knowledge": [
      "All forms of line equation (slope-intercept, point-slope, intercept).",
      "Parallel: same slope; perpendicular: slopes multiply to −1.",
      "Solving simultaneous equations to find intersection point.",
      "Distance formula and midpoint formula.",
      "Reflection concepts (perpendicular bisector = midpoint + perp slope)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Most ICSE line problems combine two skills: (1) find the slope using parallel/perpendicular conditions, then (2) find c using a known point. Intersection problems add simultaneous equations. The perpendicular bisector is a favourite ICSE question — it ties midpoint, slope, and line equation together.",
      "derivation": "Perpendicular bisector of AB (A(x₁,y₁), B(x₂,y₂)): midpoint M=((x₁+x₂)/2,(y₁+y₂)/2), slope of AB = m=(y₂−y₁)/(x₂−x₁), slope of perp bisector = −1/m. Equation: y−yM=(−1/m)(x−xM).",
      "worked_example": "Find the equation of the perpendicular bisector of A(2,4) and B(6,−2).\nMidpoint M=((2+6)/2,(4+(−2))/2)=(4,1).\nSlope of AB=(−2−4)/(6−2)=−6/4=−3/2.\nPerp slope=2/3.\nEquation: y−1=(2/3)(x−4) → 3y−3=2x−8 → 2x−3y−5=0.",
      "visual_description": "The perpendicular bisector crosses AB at its midpoint M at a right angle. Any point on the perpendicular bisector is equidistant from A and B.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"90\" x2=\"190\" y2=\"90\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"170\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <circle cx=\"60\" cy=\"50\" r=\"4\" fill=\"#2563eb\"/><text x=\"35\" y=\"46\" fill=\"#2563eb\">A(2,4)</text>\n  <circle cx=\"140\" cy=\"130\" r=\"4\" fill=\"#2563eb\"/><text x=\"143\" y=\"145\" fill=\"#2563eb\">B(6,−2)</text>\n  <line x1=\"60\" y1=\"50\" x2=\"140\" y2=\"130\" stroke=\"#2563eb\" stroke-width=\"1.5\"/>\n  <circle cx=\"100\" cy=\"90\" r=\"4\" fill=\"#dc2626\"/><text x=\"103\" y=\"85\" fill=\"#dc2626\" font-size=\"9\">M(4,1)</text>\n  <line x1=\"30\" y1=\"130\" x2=\"170\" y2=\"50\" stroke=\"#16a34a\" stroke-width=\"1.8\" stroke-dasharray=\"4,2\"/>\n  <text x=\"158\" y=\"47\" fill=\"#16a34a\" font-size=\"9\">⊥ bis.</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Confusing parallel (same m) and perpendicular (−1/m). Parallel lines have the SAME slope.",
        "For perpendicular bisector: must use midpoint as the point, not one of the endpoints.",
        "Intersection: must solve BOTH equations simultaneously; guessing isn't sufficient."
      ],
      "shortcuts_and_tricks": [
        "Parallel line: copy the slope m, find new c from the given point: c=y−mx.",
        "Perpendicular: perp slope = −1/m = flip and negate. New c from given point.",
        "Perpendicular bisector: midpoint + perp slope. 2-step combo."
      ],
      "when_to_use_this_method": "Use for: finding equation of parallel/perpendicular lines, intersection of two lines, perpendicular bisector, foot of perpendicular, reflection of a point in a line.",
      "edge_cases": [
        "If two lines are parallel, they never intersect (no solution to simultaneous equations).",
        "If two lines are identical (same m and c), they have infinitely many intersections.",
        "Perpendicular to a horizontal line is a vertical line (and vice versa) — handle these as special cases."
      ],
      "key_takeaway": "Parallel: same slope, new c. Perpendicular: slope = −1/m (flip+negate), new c. Perpendicular bisector: midpoint + perpendicular slope. Intersection: solve simultaneously.",
      "video_script_hooks": [
        "Draw a line and ask 'how many lines are parallel to this?' Infinitely many — each has same m but different c.",
        "Perpendicular bisector physical demo: fold a segment in half — the crease is the perpendicular bisector.",
        "Intersection shortcut: for y=3x+1 and y=x+5, set equal: 3x+1=x+5 → x=2, y=7. Intersection at (2,7)."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch14_slope",
    "chapterNumber": 14,
    "key_formulas": [
      {
        "formula": "Slope (gradient): m = (y₂−y₁)/(x₂−x₁) = tan θ, where θ is the angle the line makes with the positive x-axis (0° ≤ θ < 180°).",
        "explanation": "Slope measures steepness. Positive slope → line rises left-to-right; negative slope → falls. Horizontal line m=0; vertical line m undefined."
      },
      {
        "formula": "Parallel lines: m₁ = m₂ (same slope, different intercept).",
        "explanation": "Two lines are parallel iff they have the same gradient."
      },
      {
        "formula": "Perpendicular lines: m₁ × m₂ = −1.",
        "explanation": "Two non-vertical lines are perpendicular iff the product of their slopes is −1. If one has slope m, the perpendicular slope is −1/m."
      }
    ],
    "prerequisite_knowledge": [
      "Cartesian coordinates — plotting and reading (x, y).",
      "Ratio and proportion — the idea of rise over run.",
      "Trigonometry — tan θ for angles in a right triangle.",
      "Sign of tan θ in different quadrants.",
      "Concept of parallel and perpendicular lines."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Slope measures 'how steep' a line is and in which direction it climbs. A slope of 2 means: for every 1 unit you move right, you go 2 units up. A slope of −1/2 means: for every 2 units right, you go 1 unit down. The formula is simply rise ÷ run.",
      "derivation": "For any two points A(x₁,y₁) and B(x₂,y₂) on the line, the rise = y₂−y₁ and run = x₂−x₁. The slope m = rise/run = (y₂−y₁)/(x₂−x₁). All pairs of points on the same line give the same value of m (by similar triangles).",
      "worked_example": "Find the slope of the line through A(2, 1) and B(5, 7).\nm=(7−1)/(5−2)=6/3=2.\nFor any two other points on the same line, e.g. C(3,3) and D(4,5): m=(5−3)/(4−3)=2. ✓",
      "visual_description": "A steep line has a large |m|; a nearly horizontal line has m near 0. Lines from lower-left to upper-right have positive m; from upper-left to lower-right have negative m.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 200 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"80\" x2=\"190\" y2=\"80\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"150\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"30\" y1=\"130\" x2=\"170\" y2=\"30\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <text x=\"155\" y=\"28\" fill=\"#2563eb\" font-size=\"9\">m=2</text>\n  <line x1=\"30\" y1=\"60\" x2=\"170\" y2=\"110\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n  <text x=\"155\" y=\"125\" fill=\"#dc2626\" font-size=\"9\">m=−½</text>\n  <line x1=\"30\" y1=\"90\" x2=\"170\" y2=\"90\" stroke=\"#16a34a\" stroke-width=\"2\"/>\n  <text x=\"155\" y=\"85\" fill=\"#16a34a\" font-size=\"9\">m=0</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Order of subtraction: (y₂−y₁)/(x₂−x₁). Using (y₁−y₂)/(x₂−x₁) gives negative of correct slope.",
        "Vertical line (x=constant) has UNDEFINED slope, not zero. Horizontal line (y=constant) has zero slope.",
        "Perpendicular slope is −1/m, NOT 1/m. The negative sign is critical."
      ],
      "shortcuts_and_tricks": [
        "Parallel lines: same m. Perpendicular: m_perp = −1/m (flip and negate).",
        "If slope is a fraction, perpendicular slope = flip and negate: 2/3 → −3/2.",
        "Quick check: positive slope goes up left-to-right; negative goes down. Memorise typical angles: 45° → m=1; 60° → m=√3; 30° → m=1/√3."
      ],
      "when_to_use_this_method": "Use slope whenever a problem asks about gradient, angle of inclination, parallel lines, perpendicular lines, or whether three points are collinear (equal slopes from any two pairs).",
      "edge_cases": [
        "Vertical line: x=a has undefined slope (x₁=x₂ → division by zero).",
        "Horizontal line: y=b has slope 0 (y₁=y₂ → numerator zero).",
        "For three collinear points: slope(AB) = slope(BC) — a simpler collinearity test than the area formula."
      ],
      "key_takeaway": "m=(y₂−y₁)/(x₂−x₁)=tanθ. Parallel: m₁=m₂. Perpendicular: m₁m₂=−1 (perpendicular slope = flip and negate). Vertical line → m undefined; horizontal → m=0.",
      "video_script_hooks": [
        "Ramp angle analogy: a 45° ramp has m=1 (rise=run). A 60° ramp is steeper with m=√3.",
        "Show two lines on a grid — one through (0,0) and (3,6) [m=2] and one through (0,0) and (6,−3) [m=−1/2]. They're perpendicular — verify product = −1.",
        "Challenge: 'The slope of AB is 3. What slope is perpendicular to AB?' Instant answer: −1/3."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch14_special_lines",
    "chapterNumber": 14,
    "key_formulas": [
      {
        "formula": "Horizontal line: y = k (slope = 0; every point has the same y-coordinate k).",
        "explanation": "Parallel to x-axis. y-intercept = k; no x-intercept unless k=0."
      },
      {
        "formula": "Vertical line: x = h (slope undefined; every point has the same x-coordinate h).",
        "explanation": "Parallel to y-axis. x-intercept = h; no y-intercept unless h=0."
      },
      {
        "formula": "x-intercept of y=mx+c: set y=0 → x = −c/m.",
        "explanation": "Where the line crosses the x-axis (y=0)."
      },
      {
        "formula": "Collinearity (slope method): three points A, B, C are collinear iff slope(AB) = slope(AC).",
        "explanation": "All three points lie on the same line iff any two pairs have equal slopes."
      }
    ],
    "prerequisite_knowledge": [
      "Equation forms y=mx+c, point-slope, intercept form.",
      "x-intercept (where line crosses x-axis) and y-intercept (where it crosses y-axis).",
      "Slope of horizontal (0) and vertical (undefined) lines.",
      "Collinearity condition.",
      "Substituting a point into an equation to verify it lies on the line."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Special lines (horizontal, vertical, lines through origin) are the simplest cases of the general form y=mx+c. Understanding them builds intuition for why slope 0 gives a flat line and undefined slope gives a wall. Intercepts tell you exactly where a line crosses each axis — useful for graphing and for distance problems.",
      "derivation": "x-intercept: set y=0 in y=mx+c → 0=mx+c → x=−c/m. y-intercept: set x=0 → y=c. These are the two most natural points on a line for graphing.",
      "worked_example": "Find the intercepts of 3x + 4y = 12.\nx-intercept (y=0): 3x=12 → x=4. Point (4,0).\ny-intercept (x=0): 4y=12 → y=3. Point (0,3).\nSlope: m=−3/4 (negative — line goes down left-to-right).",
      "visual_description": "The line 3x+4y=12 crosses the x-axis at (4,0) and y-axis at (0,3). The two intercepts, once plotted, fully determine the line.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 180 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"10\">\n  <line x1=\"10\" y1=\"100\" x2=\"170\" y2=\"100\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"60\" y1=\"10\" x2=\"60\" y2=\"150\" stroke=\"#888\" stroke-width=\"1.2\"/>\n  <line x1=\"100\" y1=\"100\" x2=\"60\" y2=\"55\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"100\" cy=\"100\" r=\"3\" fill=\"#dc2626\"/><text x=\"103\" y=\"115\" fill=\"#dc2626\" font-size=\"9\">(4,0)</text>\n  <circle cx=\"60\" cy=\"55\" r=\"3\" fill=\"#dc2626\"/><text x=\"63\" y=\"52\" fill=\"#dc2626\" font-size=\"9\">(0,3)</text>\n  <text x=\"110\" y=\"75\" fill=\"#2563eb\" font-size=\"9\">3x+4y=12</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Confusing x-intercept (set y=0) with y-intercept (set x=0). Remember: 'x-intercept → y=0; y-intercept → x=0'.",
        "Horizontal line has slope 0, NOT undefined slope. Vertical line has undefined slope.",
        "x=3 is a vertical line (all points have x=3), not y=3."
      ],
      "shortcuts_and_tricks": [
        "Intercept form x/a+y/b=1: a is x-intercept, b is y-intercept. Read them directly.",
        "For ax+by=c: x-int=(c/a,0), y-int=(0,c/b). Quick intercept reading.",
        "Collinearity shortcut: check slope AB = slope BC. If yes, all three are collinear."
      ],
      "when_to_use_this_method": "Use intercept formulas when graphing a line quickly, checking collinearity, or finding where two lines meet an axis.",
      "edge_cases": [
        "Line through origin: c=0, both intercepts are at origin. Use another point to graph.",
        "Vertical line x=a: no y-intercept (unless a=0); x-intercept is (a,0).",
        "If m=0, there is no x-intercept (line never crosses x-axis unless c=0 itself)."
      ],
      "key_takeaway": "x-intercept: set y=0. y-intercept: set x=0 (= c in y=mx+c). Horizontal line: y=k, slope=0. Vertical line: x=h, slope=undefined. Collinearity: slopes of any two pairs must be equal.",
      "video_script_hooks": [
        "Plot y=0 (x-axis), x=0 (y-axis), y=2 (horizontal), x=3 (vertical) on one grid — instantly shows all four special-line types.",
        "Intercept method for graphing: mark (4,0) and (0,3) for 3x+4y=12, connect with a ruler. Fastest graphing method.",
        "Collinearity test: 'Are (1,2), (3,6), (5,10) collinear?' — slope 1→3 = 2, slope 3→5 = 2. Yes! All on y=2x."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch15_similarity_applications",
    "chapterNumber": 15,
    "key_formulas": [
      {
        "formula": "Area(△ABC)/Area(△DEF) = (AB/DE)² = k²",
        "explanation": "Area ratio = square of the linear scale factor"
      },
      {
        "formula": "Perimeter(△ABC)/Perimeter(△DEF) = AB/DE = k",
        "explanation": "Perimeter ratio = linear scale factor"
      },
      {
        "formula": "Median ratio = k",
        "explanation": "Corresponding medians, altitudes, angle bisectors all scale by k"
      },
      {
        "formula": "If △ABC ~ △DEF, altitude h_A/h_D = k",
        "explanation": "Corresponding altitudes are in ratio k"
      }
    ],
    "prerequisite_knowledge": [
      "Scale factor and similar triangles (sub-topics 15.1–15.2)",
      "Area of triangle = ½ × base × height",
      "Pythagoras theorem for right triangles",
      "Ratio and proportion"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "When two figures are similar with scale factor k, every length (side, perimeter, median, altitude) scales by k, but every area scales by k². Think of tiling: a 2× bigger square needs 4× more tiles. This is why the area ratio is always the SQUARE of the side ratio — a fundamental and frequently tested fact.",
      "derivation": "Let △ABC ~ △DEF with scale factor k (AB = k·DE). All sides of △ABC are k times those of △DEF.\nPerimeter of △ABC = AB+BC+CA = k·DE+k·EF+k·FD = k·(perimeter of △DEF).\nLet h_A and h_D be altitudes from A and D to BC and EF respectively. Since △ABM ~ △DEN (where M, N are feet of altitudes), h_A/h_D = AB/DE = k.\nArea(△ABC) = ½·BC·h_A = ½·(k·EF)·(k·h_D) = k²·(½·EF·h_D) = k²·Area(△DEF).",
      "worked_example": "△PQR ~ △XYZ. Area of △PQR = 48 cm², area of △XYZ = 27 cm². (i) Find the ratio of their corresponding sides. (ii) If PQ = 8 cm, find XY.\n\nSolution: (i) Area ratio = k² = 48/27 = 16/9. So k = 4/3. Side ratio = 4:3.\n(ii) PQ/XY = 4/3 → 8/XY = 4/3 → XY = 6 cm.\n\nBonus: Perimeter ratio = 4:3. If perimeter of △PQR = 36 cm, perimeter of △XYZ = 27 cm.",
      "visual_description": "Draw two similar triangles with scale factor 2:1. Label all sides (6,8,10) for large and (3,4,5) for small. Write 'Sides ratio = 2:1, Area ratio = 4:1' in a box beside. Show area numerically: large = 24 sq cm, small = 6 sq cm.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <!-- Large triangle -->\n  <polygon points=\"20,150 140,150 20,70\" fill=\"#dbeafe\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <text x=\"5\" y=\"158\" fill=\"#2563eb\">A</text>\n  <text x=\"142\" y=\"158\" fill=\"#2563eb\">B</text>\n  <text x=\"5\" y=\"65\" fill=\"#2563eb\">C</text>\n  <text x=\"70\" y=\"165\" fill=\"#555\">base=8</text>\n  <text x=\"2\" y=\"115\" fill=\"#555\">h=6</text>\n  <text x=\"55\" y=\"100\" fill=\"#dc2626\" font-size=\"11\">Area=24</text>\n  <!-- Small triangle -->\n  <polygon points=\"190,150 250,150 190,110\" fill=\"#dcfce7\" stroke=\"#16a34a\" stroke-width=\"2\"/>\n  <text x=\"178\" y=\"158\" fill=\"#16a34a\">D</text>\n  <text x=\"252\" y=\"158\" fill=\"#16a34a\">E</text>\n  <text x=\"178\" y=\"107\" fill=\"#16a34a\">F</text>\n  <text x=\"205\" y=\"165\" fill=\"#555\">base=4</text>\n  <text x=\"175\" y=\"133\" fill=\"#555\">h=3</text>\n  <text x=\"205\" y=\"135\" fill=\"#dc2626\" font-size=\"11\">Area=6</text>\n  <text x=\"265\" y=\"100\" fill=\"#555\" font-size=\"11\">k=2, k²=4</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Area ratio = k (linear ratio) is WRONG. Area ratio = k². E.g. sides 3:5 → areas 9:25.",
        "Perimeter ratio = k² is WRONG. Perimeter ratio = k (linear).",
        "The altitude/median/angle bisector from corresponding vertices all scale by k (not k²).",
        "If areas are given first, take square root to get the linear (side) ratio."
      ],
      "shortcuts_and_tricks": [
        "Given area ratio → side ratio = √(area ratio). E.g. areas 16:25 → sides 4:5.",
        "Given side ratio k → area ratio = k². Given area ratio → perimeter ratio = √(area ratio).",
        "Area of △ABC / Area of △DEF = (any pair of corresponding sides)² ÷ 1.",
        "Altitude, median, angle bisector, perimeter all scale by k. Only area scales by k²."
      ],
      "when_to_use_this_method": "Use when you know the side ratio and need areas/perimeters, or when you know the area ratio and need side lengths. Also used in map/model questions where scale factor is given.",
      "edge_cases": [
        "If the area ratio is given as 4:9, the side ratio is 2:3 (take square root). Many students forget to take the root.",
        "Perimeter ratio equals side ratio, NOT area ratio. These are commonly confused.",
        "If △ABC ~ △DEF and △DEF ~ △GHI, then △ABC ~ △GHI (transitivity of similarity)."
      ],
      "key_takeaway": "Side ratio = k; perimeter ratio = k; area ratio = k². To go from area ratio to side ratio, take the square root. This relationship is the most examined topic in the Similarity chapter.",
      "video_script_hooks": [
        "Cost analogy: if a 6-inch pizza costs ₹100, a 12-inch pizza (double the diameter) costs ₹400 — not ₹200 — because you're paying for area, not diameter!",
        "Show two similar triangles with areas 9 and 36. Ask 'what is the side ratio?' Pause… it's 1:2, NOT 1:4.",
        "Practical problem: a map is 1:50000. A lake covers 4 cm² on the map. What is the actual area? 4 × 50000² = 10 km². Scale the area by k²!"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch15_similarity_basics",
    "chapterNumber": 15,
    "key_formulas": [
      {
        "formula": "△ABC ~ △DEF ⟹ AB/DE = BC/EF = CA/FD = k",
        "explanation": "Corresponding sides in the same ratio k (scale factor)"
      },
      {
        "formula": "Perimeter ratio = k",
        "explanation": "Ratio of perimeters equals the scale factor"
      },
      {
        "formula": "Area ratio = k²",
        "explanation": "Ratio of areas equals the square of the scale factor"
      },
      {
        "formula": "Scale factor k = image length / original length",
        "explanation": "Used in maps and models"
      }
    ],
    "prerequisite_knowledge": [
      "Congruence of triangles (SSS, SAS, ASA, RHS)",
      "Ratio and proportion (Ch7)",
      "Properties of triangles — angle sum, exterior angle",
      "Basic Proportionality Theorem (studied in Class 9)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Two shapes are similar if one is an exact enlargement or reduction of the other — same shape, different size. A photograph and its enlargement are similar. All squares are similar; all circles are similar. Two triangles are similar if their angles are equal and their sides are proportional.",
      "derivation": "If △ABC ~ △DEF with scale factor k, then AB = k·DE, BC = k·EF, CA = k·FD. Perimeter of △ABC = AB+BC+CA = k(DE+EF+FD) = k × perimeter of △DEF. Area of △ABC = ½·AB·h_A. If h_A is the height from A, then h_A = k·h_D (heights also scale by k). Area of △ABC = ½·(k·DE)·(k·h_D) = k² × area of △DEF. Hence area ratio = k².",
      "worked_example": "△PQR ~ △XYZ with PQ = 6 cm, QR = 8 cm, PR = 10 cm and XY = 3 cm. (i) Find the scale factor. (ii) Find XZ and YZ. (iii) Find the ratio of their areas.\n\nSolution: (i) k = PQ/XY = 6/3 = 2 (△PQR is larger).\n(ii) XZ = PR/k = 10/2 = 5 cm. YZ = QR/k = 8/2 = 4 cm.\n(iii) Area ratio = k² = 4. Area of △PQR : Area of △XYZ = 4 : 1.",
      "visual_description": "Draw △ABC (large) and △DEF (small) side by side with matching vertices labelled. Draw arrows showing corresponding vertices A↔D, B↔E, C↔F. Show equal angles with arcs. Show that all three sides are in ratio 2:1 using tick marks.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"13\">\n  <!-- Large triangle ABC -->\n  <polygon points=\"20,140 120,140 70,40\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <text x=\"10\" y=\"148\" fill=\"#2563eb\">A</text>\n  <text x=\"122\" y=\"148\" fill=\"#2563eb\">B</text>\n  <text x=\"65\" y=\"30\" fill=\"#2563eb\">C</text>\n  <!-- Small similar triangle DEF -->\n  <polygon points=\"180,140 230,140 205,90\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"2\"/>\n  <text x=\"170\" y=\"148\" fill=\"#16a34a\">D</text>\n  <text x=\"232\" y=\"148\" fill=\"#16a34a\">E</text>\n  <text x=\"200\" y=\"80\" fill=\"#16a34a\">F</text>\n  <!-- Labels -->\n  <text x=\"130\" y=\"95\" fill=\"#dc2626\" font-size=\"12\">~</text>\n  <text x=\"50\" y=\"160\" fill=\"#555\" font-size=\"11\">Scale factor k=2</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Congruent ≠ similar: congruent triangles ARE similar (k=1), but similar triangles are not congruent unless k=1.",
        "Area scales as k², NOT k. Students often write area ratio = k instead of k².",
        "Order of vertices matters: △ABC ~ △DEF means A↔D, B↔E, C↔F — not a random pairing.",
        "Equal angles alone don't give you sides — you still need the ratio from one given side."
      ],
      "shortcuts_and_tricks": [
        "Area ratio = (side ratio)² = k². If sides are 3:5, areas are 9:25.",
        "To find scale factor, identify the pair of corresponding sides where both values are given.",
        "In maps: actual distance = map distance × scale denominator (e.g. scale 1:50000 → 1 cm = 500 m).",
        "Check similarity order by matching equal angles, not by size alone."
      ],
      "when_to_use_this_method": "Use similarity to find unknown sides/angles in triangles, to relate areas of similar figures, and to convert between map distances and actual distances (or model sizes and actual sizes).",
      "edge_cases": [
        "k = 1: similar AND congruent.",
        "All equilateral triangles are similar to each other (all angles 60°).",
        "Two right-angled triangles are similar if one acute angle is equal (then both acute angles match by angle-sum).",
        "Similar figures must have equal angles AND proportional sides — one condition alone is insufficient (except for triangles with AA criterion)."
      ],
      "key_takeaway": "Similar figures: same shape, different size. Scale factor k gives side ratio; k² gives area ratio; k gives perimeter ratio. Identifying the correct correspondence of vertices is essential.",
      "video_script_hooks": [
        "Google Maps analogy: zoom in/out — the map is always similar to the actual land. Ask 'if the scale is 1:50000, how far is 3 cm on the map?'",
        "Show a passport photo and an A4 enlargement — same person, different size. These are similar rectangles.",
        "Area surprise: if you double the side of a square, does the area double? No — it quadruples! That's k² at work."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch15_similarity_criteria",
    "chapterNumber": 15,
    "key_formulas": [
      {
        "formula": "AA criterion: ∠A = ∠D and ∠B = ∠E ⟹ △ABC ~ △DEF",
        "explanation": "Two equal angles guarantee similarity (third follows from angle sum)"
      },
      {
        "formula": "SAS criterion: ∠A = ∠D and AB/DE = AC/DF ⟹ △ABC ~ △DEF",
        "explanation": "One included angle equal and adjacent sides proportional"
      },
      {
        "formula": "SSS criterion: AB/DE = BC/EF = CA/FD ⟹ △ABC ~ △DEF",
        "explanation": "All three pairs of sides proportional"
      },
      {
        "formula": "BPT: DE ∥ BC in △ABC ⟹ AD/DB = AE/EC",
        "explanation": "Basic Proportionality Theorem (Thales' theorem)"
      }
    ],
    "prerequisite_knowledge": [
      "Angle sum property of triangles (∠A+∠B+∠C=180°)",
      "Congruence criteria SSS, SAS, ASA",
      "Ratio and proportion",
      "Similarity basics and scale factor (sub-topic 15.1)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "To prove two triangles similar you need AA, SAS~, or SSS~ — just like congruence but 'proportional' instead of 'equal' for sides. AA is the most commonly used: if two angles of one triangle equal two angles of another, the triangles are similar because the third angle is forced (by angle sum). BPT is a direct consequence: a line parallel to one side splits the other two sides proportionally.",
      "derivation": "AA criterion proof sketch: In △ABC and △DEF, ∠A=∠D and ∠B=∠E. Then ∠C=180°−∠A−∠B=180°−∠D−∠E=∠F. Scale △DEF by k=AB/DE to get △D'E'F' with D'E'=AB, ∠D=∠A, ∠E=∠B → △ABC ≅ △D'E'F' (AAS). So BC=k·EF and CA=k·FD → AB/DE=BC/EF=CA/FD → △ABC~△DEF.\n\nBPT: DE ∥ BC in △ABC. Draw medians from D and E to BC. Both triangles △DBE and △DCE share base DE and have same height (distance between parallel lines) → area(△DBE)=area(△DCE). Let area(△ADE)=S. Then area(△ABE)/area(△ADE)=DB/AD (same height from E). Similarly area(△ACD)/area(△ADE)=EC/AE. Since area(△DBE)=area(△DCE), area(△ABE)=area(△ACD). Hence DB/AD=EC/AE → AD/DB=AE/EC.",
      "worked_example": "In △ABC, D is on AB and E is on AC such that DE ∥ BC. AD = 4 cm, DB = 6 cm, AE = 3 cm. Find EC.\n\nBy BPT: AD/DB = AE/EC → 4/6 = 3/EC → EC = 3×6/4 = 4.5 cm.\n\nAlso: Prove △ADE ~ △ABC.\nDE ∥ BC → ∠ADE = ∠ABC (corresponding angles) and ∠AED = ∠ACB. So ∠A is common. By AA, △ADE ~ △ABC.",
      "visual_description": "Draw △ABC with D on AB and E on AC, DE ∥ BC shown as a dashed line. Label AD=4, DB=6, AE=3, EC=?. Mark the equal corresponding angles with arcs. Show △ADE (small, shaded) nested inside △ABC (large).",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"13\">\n  <polygon points=\"130,10 20,170 240,170\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <text x=\"126\" y=\"8\" fill=\"#2563eb\">A</text>\n  <text x=\"5\" y=\"178\" fill=\"#2563eb\">B</text>\n  <text x=\"242\" y=\"178\" fill=\"#2563eb\">C</text>\n  <!-- DE parallel to BC -->\n  <line x1=\"68\" y1=\"98\" x2=\"192\" y2=\"98\" stroke=\"#16a34a\" stroke-width=\"2\" stroke-dasharray=\"5,3\"/>\n  <text x=\"58\" y=\"95\" fill=\"#16a34a\">D</text>\n  <text x=\"193\" y=\"95\" fill=\"#16a34a\">E</text>\n  <!-- Labels -->\n  <text x=\"85\" y=\"55\" fill=\"#555\" font-size=\"11\">AD=4</text>\n  <text x=\"30\" y=\"130\" fill=\"#555\" font-size=\"11\">DB=6</text>\n  <text x=\"170\" y=\"55\" fill=\"#555\" font-size=\"11\">AE=3</text>\n  <text x=\"200\" y=\"130\" fill=\"#555\" font-size=\"11\">EC=?</text>\n  <text x=\"90\" y=\"185\" fill=\"#dc2626\" font-size=\"11\">DE ∥ BC</text>\n</svg>"
      ],
      "common_misconceptions": [
        "SSS~ requires all three RATIOS equal, not all three sides equal (that would be SSS congruence).",
        "SAS~ requires the INCLUDED angle (between the two proportional sides) to be equal.",
        "BPT applies to the whole triangle — D must be on AB (not its extension) for the basic form.",
        "Confusing AD/DB = AE/EC with AD/AB = AE/AC — both forms are correct but used in different contexts."
      ],
      "shortcuts_and_tricks": [
        "AA is almost always the easiest criterion — look for parallel lines (giving equal alternate/corresponding angles), common angles, or vertically opposite angles.",
        "BPT: AD/DB = AE/EC, or equivalently AD/AB = AE/AC. Both forms are useful.",
        "Converse of BPT: if AD/DB = AE/EC then DE ∥ BC.",
        "When proving similarity, always write the correspondence explicitly: △ABC ~ △DEF (not just 'the triangles are similar')."
      ],
      "when_to_use_this_method": "Use AA when parallel lines create equal angles. Use SAS~ when an included angle is shared and side ratios are given. Use SSS~ when all three sides are given numerically. Use BPT when a line parallel to the base divides the other two sides.",
      "edge_cases": [
        "In right-angled triangles: if one acute angle is equal, the triangles are similar by AA (the right angle is the second equal angle).",
        "Converse of BPT: if DE divides AB and AC proportionally, then DE ∥ BC.",
        "Midpoint theorem: if D and E are midpoints of AB and AC, then DE ∥ BC and DE = ½BC (special case of BPT with k=½)."
      ],
      "key_takeaway": "AA is the most powerful similarity criterion — two equal angles suffice. BPT connects parallel lines with proportional division. Always state the correspondence of vertices when writing a similarity statement.",
      "video_script_hooks": [
        "Sunlight trick: stand outside on a sunny day. Your shadow and a tree's shadow create similar triangles — AA similarity lets you find the tree's height without climbing it!",
        "BPT demo: draw a triangle and a line parallel to the base. Measure the four segments — do they give equal ratios? Yes! That's Thales.",
        "Challenge: if △ABC ~ △PQR with AB=6 and PQ=4, what is the area ratio? Pause… it's 9:16, not 6:4. Area = k² ."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch15_similarity_problems",
    "chapterNumber": 15,
    "key_formulas": [
      {
        "formula": "Map scale 1:n → actual length = n × map length",
        "explanation": "Scale denominator converts map measurement to real distance"
      },
      {
        "formula": "Actual area = n² × map area",
        "explanation": "Area on ground = scale² × area on map"
      },
      {
        "formula": "Model scale 1:n → actual volume = n³ × model volume",
        "explanation": "Volume scales as cube of linear scale (for 3D models)"
      },
      {
        "formula": "In △ABC, if AD is altitude to BC: △ADB ~ △ABC ~ △ADC",
        "explanation": "Right-angle altitude creates two triangles each similar to the whole"
      }
    ],
    "prerequisite_knowledge": [
      "Similarity criteria AA, SAS~, SSS~ (sub-topic 15.2)",
      "Area and perimeter ratios (sub-topic 15.3)",
      "Pythagoras theorem",
      "Ratio and proportion (Ch7)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Similarity problems combine the criteria and ratio rules from sub-topics 15.1–15.3 into real-world and exam contexts: maps, architectural models, height-of-object problems using shadows or mirrors, and geometry problems involving parallel lines or altitudes. The altitude-on-hypotenuse result (△ADB ~ △ABC ~ △ADC) is particularly powerful for right-triangle problems.",
      "derivation": "Altitude-on-hypotenuse: In right △ABC (right angle at A), AD ⊥ BC. In △ADB and △ABC: ∠ADB = ∠BAC = 90°, ∠B = ∠B (common). By AA: △ADB ~ △ABC. Similarly △ADC ~ △ABC. Hence △ADB ~ △ADC ~ △ABC.\nFrom △ADB ~ △ABC: AB/BC = DB/AB → AB² = BC·DB.\nFrom △ADC ~ △ABC: AC/BC = DC/AC → AC² = BC·DC.\nFrom △ADB ~ △ADC: AD/DC = DB/AD → AD² = DB·DC.",
      "worked_example": "Problem 1 — Map scale: A map is drawn to a scale of 1:25000. (i) Two towns are 8 cm apart on the map. Find the actual distance in km. (ii) A park covers 6 cm² on the map. Find its actual area in hectares.\n(i) Actual = 8 × 25000 = 200000 cm = 2 km.\n(ii) Actual area = 6 × 25000² = 6 × 625000000 cm² = 3750000000 cm² = 375000 m² = 37.5 hectares.\n\nProblem 2 — Height using shadow: A 2 m pole casts a 3 m shadow. A tree casts a 12 m shadow at the same time. Both create similar right triangles (same sun angle). Height/shadow = 2/3. Tree height = 12 × (2/3) = 8 m.",
      "visual_description": "Diagram 1: Two right triangles showing a vertical pole and tree with their shadows on the ground. Label pole=2m, shadow=3m, tree=h, shadow=12m. Show angle of elevation equal (same sun angle). Diagram 2: Map grid with a lake outlined; scale bar shown.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 300 160\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <!-- Ground line -->\n  <line x1=\"10\" y1=\"140\" x2=\"290\" y2=\"140\" stroke=\"#888\" stroke-width=\"1\"/>\n  <!-- Pole and shadow -->\n  <line x1=\"40\" y1=\"140\" x2=\"40\" y2=\"90\" stroke=\"#2563eb\" stroke-width=\"3\"/>\n  <line x1=\"40\" y1=\"140\" x2=\"85\" y2=\"140\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n  <line x1=\"40\" y1=\"90\" x2=\"85\" y2=\"140\" stroke=\"#dc2626\" stroke-width=\"1\" stroke-dasharray=\"4,2\"/>\n  <text x=\"33\" y=\"115\" fill=\"#2563eb\" font-size=\"11\">2m</text>\n  <text x=\"53\" y=\"155\" fill=\"#dc2626\" font-size=\"11\">3m</text>\n  <!-- Tree and shadow -->\n  <line x1=\"160\" y1=\"140\" x2=\"160\" y2=\"40\" stroke=\"#16a34a\" stroke-width=\"3\"/>\n  <line x1=\"160\" y1=\"140\" x2=\"248\" y2=\"140\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n  <line x1=\"160\" y1=\"40\" x2=\"248\" y2=\"140\" stroke=\"#dc2626\" stroke-width=\"1\" stroke-dasharray=\"4,2\"/>\n  <text x=\"148\" y=\"90\" fill=\"#16a34a\" font-size=\"11\">h=?</text>\n  <text x=\"190\" y=\"155\" fill=\"#dc2626\" font-size=\"11\">12m</text>\n  <!-- Equal angle marks -->\n  <text x=\"88\" y=\"134\" fill=\"#555\" font-size=\"10\">θ</text>\n  <text x=\"250\" y=\"134\" fill=\"#555\" font-size=\"10\">θ</text>\n</svg>"
      ],
      "common_misconceptions": [
        "In map problems, area scales by n², not n. A common error is multiplying map area by n instead of n².",
        "The altitude-on-hypotenuse theorem requires a RIGHT angle at A — it does not work in general triangles.",
        "AD² = DB·DC uses the feet of the altitude D on BC — not the full sides.",
        "Scale 1:n means 1 unit on map = n units in reality (not the reverse)."
      ],
      "shortcuts_and_tricks": [
        "Shadow problems: set up proportion height/shadow = constant (same sun angle → similar triangles by AA).",
        "Altitude on hypotenuse memory: AB² = BC·BD; AC² = BC·CD; AD² = BD·CD.",
        "Map to actual: multiply by n. Actual to map: divide by n. For area: use n² in both directions.",
        "Mirror method: person's height/distance from mirror = object's height/distance from mirror (similar triangles with vertical angles at mirror point)."
      ],
      "when_to_use_this_method": "Use for: map/model scale conversions, height estimation using shadows or mirrors, Pythagoras extension problems with altitude on hypotenuse, and any problem requiring two similar triangles to be identified then used to set up a proportion.",
      "edge_cases": [
        "Altitude on hypotenuse: if the right angle is NOT at A, re-label to make the right angle at A before applying the theorem.",
        "3D models: length scales by k, area by k², volume by k³. ICSE occasionally asks about volume.",
        "Proving BPT converse: if you show AD/DB = AE/EC, conclude DE ∥ BC."
      ],
      "key_takeaway": "Real-world similarity: map scales use linear factor for distance, factor² for area, factor³ for volume. Shadow/mirror problems use AA similarity. Altitude on hypotenuse creates three mutually similar triangles — memorise AB²=BC·BD, AC²=BC·CD, AD²=BD·CD.",
      "video_script_hooks": [
        "Walking problem: 'You're lost in a forest. You have a 2 m stick. At noon it casts a 1.5 m shadow. A tree casts an 18 m shadow. How tall is the tree?' Setup AA similarity and solve.",
        "Google Earth demo: switch between zoom levels. Measure the same road at 1:10000 and 1:50000 — confirm the ratio.",
        "Altitude on hypotenuse: fold a right-triangle along the altitude from the right angle — you literally get two smaller triangles that 'look like' the original!"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch16_loci_concepts",
    "chapterNumber": 16,
    "key_formulas": [
      {
        "formula": "Locus of point equidistant from two fixed points A, B = perpendicular bisector of AB",
        "explanation": "PA = PB ↔ P lies on the ⊥ bisector of AB"
      },
      {
        "formula": "Locus of point equidistant from two lines = angle bisector of those lines",
        "explanation": "Equal perpendicular distances from two lines"
      },
      {
        "formula": "Locus at fixed distance r from point O = circle, centre O, radius r",
        "explanation": "PA = r → P lies on circle (O, r)"
      },
      {
        "formula": "Locus at fixed distance d from a line = two parallel lines at distance d on each side",
        "explanation": "Equidistant from a straight line"
      }
    ],
    "prerequisite_knowledge": [
      "Perpendicular bisector construction",
      "Angle bisector construction",
      "Circle — centre, radius, chord",
      "Properties of isosceles triangles"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A locus is the set of ALL points satisfying a given condition — it is a path or a region, not just one point. Think of a sprinkler rotating at a fixed distance from the pipe: the water traces a circle. Every point on that circle is exactly one arm's-length from the pivot. That's a locus.",
      "derivation": "Locus 1 — equidistant from two points A and B: Let P be such that PA = PB. Drop perpendiculars from P to AB; by the definition of a perpendicular bisector and the converse, P lies on the perpendicular bisector of AB. Conversely, every point on the ⊥ bisector satisfies PA = PB. Hence locus = ⊥ bisector of AB.\n\nLocus 2 — equidistant from two intersecting lines: If the perpendicular distances from P to both lines are equal, P lies on one of the two angle bisectors of the lines (by the definition of angle bisector). Hence locus = pair of angle bisectors.",
      "worked_example": "Find the locus of a point P that is (i) equidistant from the points A(0,0) and B(6,0), (ii) at a distance of 5 cm from the fixed point C(3,0).\n\n(i) PA = PB → P lies on the ⊥ bisector of AB. Midpoint of AB = (3,0), AB is horizontal → ⊥ bisector is vertical line x = 3.\n\n(ii) Distance from C(3,0) = 5 → locus is a circle, centre (3,0), radius 5.\n\n(iii) Both conditions: x = 3 AND circle centre (3,0) radius 5 → intersection at (3,5) and (3,−5).",
      "visual_description": "Draw points A and B. Draw the perpendicular bisector as a dashed line. Mark several points on it and show equal distances PA = PB with arcs. Below, draw a circle for the distance-from-point locus and parallel dashed lines for the distance-from-line locus.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"13\">\n  <!-- Points A and B -->\n  <circle cx=\"60\" cy=\"100\" r=\"4\" fill=\"#2563eb\"/>\n  <circle cx=\"200\" cy=\"100\" r=\"4\" fill=\"#2563eb\"/>\n  <text x=\"50\" y=\"120\" fill=\"#2563eb\">A</text>\n  <text x=\"198\" y=\"120\" fill=\"#2563eb\">B</text>\n  <!-- AB segment -->\n  <line x1=\"60\" y1=\"100\" x2=\"200\" y2=\"100\" stroke=\"#888\" stroke-width=\"1\"/>\n  <!-- Perpendicular bisector -->\n  <line x1=\"130\" y1=\"20\" x2=\"130\" y2=\"170\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"6,3\"/>\n  <text x=\"132\" y=\"15\" fill=\"#dc2626\" font-size=\"11\">⊥ bisector</text>\n  <!-- Sample point P -->\n  <circle cx=\"130\" cy=\"55\" r=\"3\" fill=\"#16a34a\"/>\n  <text x=\"134\" y=\"52\" fill=\"#16a34a\">P</text>\n  <line x1=\"130\" y1=\"55\" x2=\"60\" y2=\"100\" stroke=\"#16a34a\" stroke-width=\"1\" stroke-dasharray=\"3,2\"/>\n  <line x1=\"130\" y1=\"55\" x2=\"200\" y2=\"100\" stroke=\"#16a34a\" stroke-width=\"1\" stroke-dasharray=\"3,2\"/>\n  <text x=\"85\" y=\"72\" fill=\"#16a34a\" font-size=\"11\">PA=PB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "A locus is all points satisfying the condition — not just the nearest point or a single point.",
        "Equidistant from two LINES → angle bisectors (not perpendicular bisector of the segment joining points on the lines).",
        "Equidistant from two POINTS → perpendicular bisector. Don't confuse the two.",
        "A circle is the locus of points at a FIXED DISTANCE from a FIXED POINT — both conditions matter."
      ],
      "shortcuts_and_tricks": [
        "Two-condition loci problems: find each locus separately, then find the intersection.",
        "Locus at fixed distance from a line = two parallel lines. Locus inside a circle = disk, not just the circle.",
        "For constructions: ⊥ bisector uses equal arcs from both endpoints. Angle bisector uses equal arcs from the two lines.",
        "A locus of points equidistant from a fixed point and a fixed line = a parabola (beyond Class 10, but worth mentioning)."
      ],
      "when_to_use_this_method": "Use loci to find: perpendicular bisectors in coordinate geometry, circumcentre (intersection of ⊥ bisectors), incentre (intersection of angle bisectors), regions equidistant from boundaries, and two-condition locus problems in constructions.",
      "edge_cases": [
        "Locus equidistant from two parallel lines = the single parallel line midway between them.",
        "Locus equidistant from two COINCIDENT lines = the line itself.",
        "Two intersecting lines have TWO angle bisectors (they are perpendicular to each other).",
        "Intersection of two loci can be 0, 1, 2 or infinitely many points depending on the conditions."
      ],
      "key_takeaway": "Four standard loci: (1) equidistant from two points → ⊥ bisector; (2) equidistant from two lines → angle bisector; (3) fixed distance from a point → circle; (4) fixed distance from a line → two parallel lines. Most exam problems combine two of these.",
      "video_script_hooks": [
        "Dog on a leash: tie a dog to a post with a 5 m leash. The dog can reach every point within 5 m — that's a circle (locus at fixed distance from a point).",
        "Referee on a football pitch: the referee must always be equidistant from both goalposts — they must stay on the centre line (⊥ bisector).",
        "Two-locus problem: 'A treasure is equidistant from two trees AND 3 m from a rock. How many hiding spots are there?' Draw both loci and count intersections."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch16_loci_constructions",
    "chapterNumber": 16,
    "key_formulas": [
      {
        "formula": "Circumcircle construction: circumcentre = intersection of ⊥ bisectors of sides",
        "explanation": "Equidistant from all three vertices"
      },
      {
        "formula": "Incircle construction: incentre = intersection of angle bisectors",
        "explanation": "Equidistant from all three sides"
      },
      {
        "formula": "Locus ∩ locus = intersection points = the answer",
        "explanation": "Two-condition problems: draw both loci, mark intersections"
      }
    ],
    "prerequisite_knowledge": [
      "Construction of perpendicular bisector",
      "Construction of angle bisector",
      "Standard loci (sub-topic 16.1)",
      "Circles and arcs"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Constructions make loci concrete: you actually draw the set of points. The key insight is that most ICSE loci construction problems require you to (i) identify WHICH two standard loci are being described, (ii) construct each one with ruler and compass, and (iii) mark their intersection as the answer.",
      "derivation": "Circumcentre derivation: If OA = OB = OC (circumradius), then O is equidistant from A and B → O lies on ⊥ bisector of AB. Also equidistant from B and C → O on ⊥ bisector of BC. Both conditions → O = intersection of the two ⊥ bisectors. Similarly, incentre derivation uses perpendicular distances to sides.",
      "worked_example": "Construct a triangle ABC with AB = 6 cm, BC = 5 cm, CA = 4 cm. Find a point P such that P is equidistant from AB and AC, and also equidistant from B and C.\n\nStep 1: Draw △ABC.\nStep 2: Equidistant from AB and AC → P lies on the angle bisector of ∠A.\nStep 3: Equidistant from B and C → P lies on the ⊥ bisector of BC.\nStep 4: Draw both; their intersection is P. There is exactly one such point.\n\nNote: this point P is the midpoint of arc BC in the circumcircle — a classic ICSE result.",
      "visual_description": "Draw △ABC. Show the angle bisector of ∠A as a dashed line. Show the ⊥ bisector of BC as another dashed line. Mark their intersection as P with a star. Label equal angle halves at A and equal distances from P to B and C.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 280 200\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"13\">\n  <polygon points=\"30,170 200,170 115,40\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <text x=\"18\" y=\"185\" fill=\"#2563eb\">B</text>\n  <text x=\"202\" y=\"185\" fill=\"#2563eb\">C</text>\n  <text x=\"110\" y=\"32\" fill=\"#2563eb\">A</text>\n  <!-- Angle bisector of A -->\n  <line x1=\"115\" y1=\"40\" x2=\"115\" y2=\"185\" stroke=\"#dc2626\" stroke-width=\"1.5\" stroke-dasharray=\"5,3\"/>\n  <text x=\"118\" y=\"130\" fill=\"#dc2626\" font-size=\"11\">∠A bisector</text>\n  <!-- Perp bisector of BC -->\n  <line x1=\"115\" y1=\"10\" x2=\"115\" y2=\"190\" stroke=\"#16a34a\" stroke-width=\"1.5\" stroke-dasharray=\"3,4\"/>\n  <!-- Intersection point P -->\n  <circle cx=\"115\" cy=\"138\" r=\"5\" fill=\"#f59e0b\"/>\n  <text x=\"120\" y=\"137\" fill=\"#f59e0b\">P</text>\n  <text x=\"10\" y=\"15\" fill=\"#555\" font-size=\"11\">P = ∠A bisector ∩ ⊥ bisector of BC</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Circumcentre ≠ centroid. Circumcentre is intersection of ⊥ bisectors; centroid is intersection of medians.",
        "Incentre ≠ orthocentre. Incentre = angle bisectors; orthocentre = altitudes.",
        "In an obtuse triangle, the circumcentre lies OUTSIDE the triangle. Students often forget this.",
        "Two loci may intersect in 0, 1, or 2 points — always check by drawing, not assuming exactly one solution."
      ],
      "shortcuts_and_tricks": [
        "Circle + ⊥ bisector → check if circle intersects the ⊥ bisector (usually two points or zero).",
        "Circle + circle → can intersect in 0, 1, or 2 points.",
        "Circumcentre: right-angle triangle → circumcentre = midpoint of hypotenuse.",
        "Incentre always lies inside the triangle (unlike circumcentre and orthocentre which can be outside)."
      ],
      "when_to_use_this_method": "Use for all ICSE construction problems. Read the conditions carefully, translate each into one of the four standard loci, construct each, mark intersection(s).",
      "edge_cases": [
        "Equidistant from two parallel lines: the locus is the parallel midway line — just one line, not two.",
        "If a point must be at distance d from a line AND on a circle of radius r, find the two parallel lines at distance d and see where they cut the circle.",
        "A point inside a circle and at fixed distance from a line: construct the circle, construct the parallel lines, find intersections that are inside the circle."
      ],
      "key_takeaway": "ICSE loci constructions: (1) identify the two conditions, (2) translate to standard loci (⊥ bisector / angle bisector / circle / parallel lines), (3) construct both, (4) mark intersections. Circumcentre = ⊥ bisectors meeting; incentre = angle bisectors meeting.",
      "video_script_hooks": [
        "Draw each construction step live: compass for arc, ruler for bisector. Show how two dashed lines cross at exactly one point — that's the treasure!",
        "Circumcentre magic: for any triangle, the three ⊥ bisectors always meet at ONE point. Draw a dozen different triangles and verify.",
        "Incentre demo: inscribe a circle in a triangle — the centre is where all angle bisectors meet. Roll a coin inside a triangle and show it touching all three sides."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch16_loci_problems",
    "chapterNumber": 16,
    "key_formulas": [
      {
        "formula": "Two-locus intersection: draw both loci, intersection = answer",
        "explanation": "ICSE problems always give TWO conditions; the answer is where they meet"
      },
      {
        "formula": "Region inside a circle AND above a line = circular segment",
        "explanation": "The 'and' condition requires intersection of two regions"
      },
      {
        "formula": "Circumcentre = intersection of ⊥ bisectors of any two sides",
        "explanation": "The third ⊥ bisector is redundant (concurrent)"
      },
      {
        "formula": "Incentre = intersection of angle bisectors of any two angles",
        "explanation": "Third angle bisector also passes through incentre"
      }
    ],
    "prerequisite_knowledge": [
      "All standard loci (sub-topic 16.1)",
      "Construction techniques (sub-topic 16.2)",
      "Circle locus properties (sub-topic 16.3)",
      "Coordinate geometry for loci in numerical form"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "ICSE loci applied problems always have exactly TWO conditions. Your job is to identify what each condition translates to (one of the four standard loci or the circle-properties loci), construct or describe each geometrically, then find where they intersect. The intersection gives the answer — usually 1 or 2 points.",
      "derivation": "General method: 1. Read condition 1 → identify locus L₁. 2. Read condition 2 → identify locus L₂. 3. Intersection L₁ ∩ L₂ = solution set. 4. If a region is asked ('all points satisfying both'), shade the overlap.\n\nCoordinate form example: Find all points equidistant from A(0,4) and B(4,0), AND at distance 5 from the origin O(0,0).\nL₁: ⊥ bisector of AB. Midpoint M=(2,2). Slope AB=(0−4)/(4−0)=−1. ⊥ bisector slope=1. Line: y−2=1(x−2) → y=x.\nL₂: circle x²+y²=25.\nIntersect: y=x in x²+y²=25 → 2x²=25 → x=±5/√2. Points: (5/√2, 5/√2) and (−5/√2, −5/√2).",
      "worked_example": "A point P moves such that it is: (i) equidistant from two lines AB and CD that meet at O at 60°, AND (ii) at a fixed distance of 4 cm from O.\n\nCondition (i): P lies on the angle bisectors of AB and CD (two lines through O at 30° to each). Both bisectors are valid.\nCondition (ii): P lies on the circle, centre O, radius 4 cm.\n\nIntersections: each angle bisector cuts the circle at 2 points → total 4 intersection points (2 on each bisector). These are the 4 positions of P.",
      "visual_description": "Draw two intersecting lines with angle bisectors shown as dashed. Overlay a circle centred at their intersection. Mark the 4 intersection points of the bisectors with the circle as the answers.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 280 200\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <!-- Intersecting lines -->\n  <line x1=\"10\" y1=\"100\" x2=\"270\" y2=\"100\" stroke=\"#888\" stroke-width=\"1.5\"/>\n  <line x1=\"80\" y1=\"20\" x2=\"200\" y2=\"180\" stroke=\"#888\" stroke-width=\"1.5\"/>\n  <!-- Angle bisectors (dashed) -->\n  <line x1=\"30\" y1=\"30\" x2=\"250\" y2=\"170\" stroke=\"#dc2626\" stroke-width=\"1.5\" stroke-dasharray=\"5,3\"/>\n  <line x1=\"30\" y1=\"170\" x2=\"250\" y2=\"30\" stroke=\"#dc2626\" stroke-width=\"1.5\" stroke-dasharray=\"5,3\"/>\n  <!-- Circle -->\n  <circle cx=\"140\" cy=\"100\" r=\"60\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <!-- Intersection points -->\n  <circle cx=\"182\" cy=\"143\" r=\"5\" fill=\"#16a34a\"/>\n  <circle cx=\"98\" cy=\"57\" r=\"5\" fill=\"#16a34a\"/>\n  <circle cx=\"182\" cy=\"57\" r=\"5\" fill=\"#16a34a\"/>\n  <circle cx=\"98\" cy=\"143\" r=\"5\" fill=\"#16a34a\"/>\n  <text x=\"5\" y=\"195\" fill=\"#555\" font-size=\"11\">4 intersection points</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Students often find L₁ correctly but forget to find L₂ — both conditions must be applied.",
        "When a question says 'above line AB', the region includes the line. 'Strictly above' excludes the line.",
        "Equal distance from a point AND from a line is not covered in Class 10 (gives a parabola). If this appears, it's an error in the question.",
        "Intersection points must be verified: check they genuinely satisfy BOTH conditions."
      ],
      "shortcuts_and_tricks": [
        "Two conditions → draw two loci → count intersections (0, 1, 2, 4 are common answers).",
        "Circumcentre shortcut: in a right triangle, circumcentre = midpoint of hypotenuse.",
        "Incentre always inside the triangle. Circumcentre can be outside (obtuse triangle) or on the triangle (right triangle).",
        "For coordinate loci: write both conditions as equations and solve simultaneously."
      ],
      "when_to_use_this_method": "Apply this systematic approach to every ICSE loci question: read → translate → draw/compute loci → intersect → state answer.",
      "edge_cases": [
        "If both loci are parallel lines, they may not intersect (answer: no such point).",
        "A circle and a line may be tangent (1 point) or non-intersecting (0 points) — not always 2.",
        "Three concurrent loci: if three conditions all give lines through the same point, the answer is that single point."
      ],
      "key_takeaway": "ICSE loci problems always have two conditions → two loci → one set of intersection points. The four standard loci cover almost all cases. Draw, intersect, and state the points clearly. Circumcentre = ⊥ bisectors; incentre = angle bisectors.",
      "video_script_hooks": [
        "Treasure hunt problem: 'The treasure is equidistant from two trees AND within 10 m of the well. Where is it?' Draw ⊥ bisector and circle; mark intersections — those are the possible locations.",
        "GPS problem: two cell towers give equal signal strength → you're on their ⊥ bisector. A third constraint (fixed distance from a third tower) gives the actual location.",
        "Challenge: given a triangle, find the point that is equidistant from all three vertices (circumcentre) by constructing two ⊥ bisectors. Verify with the third."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch16_loci_properties",
    "chapterNumber": 16,
    "key_formulas": [
      {
        "formula": "Locus of vertex of right angle on a fixed hypotenuse = semicircle on hypotenuse",
        "explanation": "Angle in semicircle = 90°; converse gives the locus"
      },
      {
        "formula": "Locus of point P such that ∠APB = constant = arc of a circle through A and B",
        "explanation": "Angles in the same segment are equal"
      },
      {
        "formula": "Locus of centre of circle touching two fixed lines = angle bisector(s) of the lines",
        "explanation": "Centre is equidistant from both tangent lines"
      },
      {
        "formula": "Locus of centre of circle of fixed radius r touching a fixed line = two parallel lines at distance r",
        "explanation": "Centre at distance r (radius) from the line"
      }
    ],
    "prerequisite_knowledge": [
      "Standard loci (sub-topic 16.1)",
      "Constructions (sub-topic 16.2)",
      "Circle theorems — chord, radius, tangent",
      "Angle in semicircle = 90°"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "Several important loci come from circle theorems. The most examined is: if AB is a fixed segment and P moves such that ∠APB = 90°, then P lies on the circle with AB as diameter. This is the 'angle in semicircle' theorem read in reverse. Similarly, constant angle ∠APB (not necessarily 90°) gives an arc of a specific circle.",
      "derivation": "Locus of P with ∠APB = 90°: By the converse of 'angle in semicircle', if ∠APB = 90° then P lies on the circle with diameter AB. Conversely, if P is on this circle then ∠APB = 90° (angle in semicircle). So the locus is the circle with diameter AB (excluding A and B).\n\nLocus of centre of circle touching two intersecting lines: The centre must be equidistant (perpendicular distance = radius) from both lines. Equal distances from two lines → centre lies on the angle bisectors. The locus is both angle bisectors of the two lines.",
      "worked_example": "AB is a fixed segment of length 6 cm. Find the locus of point P such that ∠APB = 90°.\n\nLocus: circle with diameter AB (radius = 3 cm). P must be on this circle, excluding A and B.\n\nIf additionally P must be at distance 4 cm from the midpoint M of AB (which is the centre of the circle): then P must be on both the circle (radius 3) and a circle of radius 4 centred at M. Distance between centres = 0 (they share centre M). No intersection if the two circles are different radii and concentric. Since r₁=3 ≠ r₂=4 and they share the same centre, no intersection. So no such point P exists.",
      "visual_description": "Draw segment AB = 6 cm. Draw the circle with AB as diameter. Mark three positions of P on the circle and show right angles. Also draw the angle bisectors of two intersecting lines l₁ and l₂, showing equal perpendicular distances from the bisector to each line.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"13\">\n  <!-- Diameter AB -->\n  <line x1=\"50\" y1=\"110\" x2=\"190\" y2=\"110\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"50\" cy=\"110\" r=\"4\" fill=\"#2563eb\"/>\n  <circle cx=\"190\" cy=\"110\" r=\"4\" fill=\"#2563eb\"/>\n  <text x=\"40\" y=\"128\" fill=\"#2563eb\">A</text>\n  <text x=\"191\" y=\"128\" fill=\"#2563eb\">B</text>\n  <!-- Semicircle -->\n  <path d=\"M 50 110 A 70 70 0 0 1 190 110\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"6,3\"/>\n  <!-- Point P on semicircle -->\n  <circle cx=\"120\" cy=\"50\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"122\" y=\"46\" fill=\"#16a34a\">P</text>\n  <line x1=\"50\" y1=\"110\" x2=\"120\" y2=\"50\" stroke=\"#555\" stroke-width=\"1\"/>\n  <line x1=\"120\" y1=\"50\" x2=\"190\" y2=\"110\" stroke=\"#555\" stroke-width=\"1\"/>\n  <!-- Right angle mark at P -->\n  <rect x=\"113\" y=\"53\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <text x=\"50\" y=\"165\" fill=\"#dc2626\" font-size=\"12\">Locus of P (∠APB=90°) = semicircle on AB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "The locus of P with ∠APB = 90° is a circle (full circle on diameter AB), not just the semicircle above. If P can be anywhere except A and B, it traces the full circle.",
        "The angle bisector locus is for the CENTRE of the circle touching two lines — not for any general point.",
        "Equal distance from two POINTS → ⊥ bisector. Equal distance from two LINES → angle bisector. These are NOT interchangeable.",
        "'Touching a circle' means tangent: the distance from the centre of the moving circle to the fixed circle's centre equals the sum (external) or difference (internal) of radii."
      ],
      "shortcuts_and_tricks": [
        "∠APB = 90° → circle on AB as diameter. Radius = AB/2.",
        "Centre of circle touching two lines → angle bisector of the lines.",
        "Centre of circle of radius r touching a fixed circle of radius R: if external tangency → centre at distance R+r from fixed centre. If internal → |R−r|.",
        "Circumscribed circle: circumcenter = intersection of ⊥ bisectors; inscribed circle: incenter = intersection of angle bisectors."
      ],
      "when_to_use_this_method": "Use these theorems when locus problems involve: angles in triangles/semicircles, circles touching lines or other circles, or finding circumcentre/incentre of a triangle.",
      "edge_cases": [
        "∠APB = 180° means A, P, B are collinear → P is on line AB (excluding segment AB). Not a circle.",
        "If the moving circle touches a fixed circle internally, the locus is a concentric circle with radius |R−r|.",
        "The two angle bisectors of intersecting lines are perpendicular to each other — both are valid loci for the centre."
      ],
      "key_takeaway": "Circle locus for right angle: ∠APB=90° ↔ P on circle with diameter AB. Centre of circle touching two lines: angle bisectors. Centre of circle touching a line at distance r: parallel lines at distance r. These are the properties most tested in ICSE loci problems.",
      "video_script_hooks": [
        "Thales' theorem demo: mark many points P on a circle. Measure ∠APB at each — always 90°. Then show that if ∠APB=90° and P moves, it traces the circle.",
        "Spirograph analogy: changing the conditions changes the shape of the locus. For constant non-right angle, the arc is wider or narrower than the semicircle.",
        "Architecture: the shape of an arch is often a circular arc. The locus of a point moving at a constant angle of view of the arch span IS that circular arc."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch17_circle_arc_angle",
    "chapterNumber": 17,
    "key_formulas": [
      {
        "formula": "∠AOB = 2 × ∠ACB (centre angle = twice inscribed angle, same arc)",
        "explanation": "∠ACB is the angle at the circumference on the major arc side"
      },
      {
        "formula": "Angles in the same segment are equal: ∠ACB = ∠ADB",
        "explanation": "C and D on the same arc of AB → both inscribed angles over arc AB are equal"
      },
      {
        "formula": "Angle in a semicircle = 90°: if AB is diameter, ∠ACB = 90°",
        "explanation": "Special case of ∠AOB = 180° (straight line) → inscribed angle = 90°"
      },
      {
        "formula": "∠AOB (reflex) = 2 × ∠ACB when C is on the minor arc",
        "explanation": "When inscribed angle is on the minor arc, use the reflex central angle"
      }
    ],
    "prerequisite_knowledge": [
      "Central angle and inscribed angle definitions",
      "Angle sum in a triangle = 180°",
      "Exterior angle of triangle = sum of two non-adjacent interior angles",
      "Isosceles triangle properties (OA = OB = radius)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "An inscribed angle is half the central angle that subtends the same arc. Think of it as: the centre has 'full view' of the arc (central angle), while a point on the circumference has 'half view' (inscribed angle). This one theorem unlocks dozens of circle problems.",
      "derivation": "Proof (case: centre inside the angle):\nLet O = centre, ∠ACB inscribed, ∠AOB central, both subtending arc AB.\nDraw diameter CO extended to D.\nIn △OAC: OA = OC = r → △OAC isosceles → ∠OAC = ∠OCA = α.\nExterior angle of △OAC: ∠AOD = 2α.\nSimilarly in △OBC: ∠BOD = 2β, ∠OCB = β.\n∠ACB = α + β. ∠AOB = 2α + 2β = 2∠ACB. ✓\n\nAngle in semicircle: AB is diameter → ∠AOB = 180° → ∠ACB = 90°.",
      "worked_example": "O is the centre. ∠AOB = 130°. Find ∠ACB (C on major arc) and ∠ADB (D on minor arc).\n\n∠ACB = ½ × ∠AOB = ½ × 130° = 65°.\n∠AOB (reflex) = 360° − 130° = 230°. ∠ADB = ½ × 230° = 115°.\nVerify: ∠ACB + ∠ADB = 65° + 115° = 180° ✓.",
      "visual_description": "Circle with centre O. Points A and B on circle. Point C on major arc — show angle ACB and central angle AOB. Show ∠ACB = ½∠AOB. Also show two points C and D on same arc with equal inscribed angles.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 230\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <circle cx=\"130\" cy=\"120\" r=\"85\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"130\" cy=\"120\" r=\"3\" fill=\"#1e3a8a\"/>\n  <text x=\"136\" y=\"118\" fill=\"#1e3a8a\" font-size=\"13\">O</text>\n  <circle cx=\"68\" cy=\"165\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"52\" y=\"170\" fill=\"#dc2626\">A</text>\n  <circle cx=\"192\" cy=\"165\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"197\" y=\"170\" fill=\"#dc2626\">B</text>\n  <line x1=\"130\" y1=\"120\" x2=\"68\" y2=\"165\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <line x1=\"130\" y1=\"120\" x2=\"192\" y2=\"165\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <circle cx=\"130\" cy=\"35\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"134\" y=\"30\" fill=\"#16a34a\">C</text>\n  <line x1=\"130\" y1=\"35\" x2=\"68\" y2=\"165\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <line x1=\"130\" y1=\"35\" x2=\"192\" y2=\"165\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <text x=\"35\" y=\"220\" fill=\"#555\" font-size=\"11\">∠AOB = 2 × ∠ACB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "∠ACB = ½∠AOB only when C and the arc are on opposite sides of chord AB.",
        "When C is on the minor arc, use the reflex central angle (> 180°).",
        "'Angle in the same segment' requires the two points to be on the same side of the chord.",
        "Angle in semicircle = 90° only when the chord is a DIAMETER."
      ],
      "shortcuts_and_tricks": [
        "Inscribed angle = ½ × central angle. One rule generates all others.",
        "Same-segment angles: if ∠ACB = x, all other inscribed angles on the same arc also = x.",
        "∠ACB + ∠ADB = 180° when C and D are on opposite arcs (leads to cyclic quad rule)."
      ],
      "when_to_use_this_method": "For any angle problem in a circle where the angle is at the circumference or at the centre subtending the same arc.",
      "edge_cases": [
        "If C is on the chord AB extended (not on the arc), this theorem does not apply.",
        "When O is outside the inscribed angle (C on minor arc), use reflex ∠AOB.",
        "Angles subtended by equal arcs are equal even if not on the same chord."
      ],
      "key_takeaway": "Central angle = 2× inscribed angle over same arc. Angle in semicircle = 90°. Angles in same segment are equal. These three facts plus cyclic quad cover all ICSE circle angle questions.",
      "video_script_hooks": [
        "Move point C along the arc — the angle at C stays constant no matter where C is! (Same-segment demo)",
        "Why is the angle in a semicircle always 90°? Because the central angle for a diameter is 180° → inscribed = 90°.",
        "Satellite dish: the centre receives twice the angle that a receiver on the rim does."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch17_circle_chord_properties",
    "chapterNumber": 17,
    "key_formulas": [
      {
        "formula": "⊥ from centre to chord bisects it: if OM ⊥ AB then AM = MB",
        "explanation": "The foot of the perpendicular from centre is the midpoint of the chord"
      },
      {
        "formula": "Converse: line from centre to midpoint of chord ⊥ to chord",
        "explanation": "If M is midpoint of AB, then OM ⊥ AB"
      },
      {
        "formula": "Equal chords are equidistant from centre: AB=CD ⟺ OM=ON",
        "explanation": "Where M, N are feet of perpendiculars from centre to AB and CD"
      },
      {
        "formula": "The perpendicular bisector of every chord passes through the centre",
        "explanation": "Used to find the centre given two chords"
      }
    ],
    "prerequisite_knowledge": [
      "Basic circle vocabulary: centre, radius, diameter, chord, arc, segment",
      "Congruence criteria (SSS, SAS, RHS)",
      "Pythagoras theorem",
      "Properties of isosceles triangles"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A chord is any line segment with both endpoints on the circle. The centre has a special relationship with chords: it always sits on the perpendicular bisector of every chord. This is because both endpoints are equidistant from the centre (= radius), so the centre lies on the locus 'equidistant from two points' = perpendicular bisector.",
      "derivation": "Proof that OM ⊥ AB bisects AB:\nLet O = centre, AB = chord, M = foot of ⊥ from O.\nIn △OAM and △OBM: OA = OB (radii), ∠OMA = ∠OMB = 90°, OM is common.\nBy RHS congruence: △OAM ≅ △OBM → AM = BM. ∴ M is the midpoint.\n\nEqual chords equidistant from centre:\nIf AB = CD, then chords subtend equal central angles (since OA=OB=OC=OD=r and all triangles are congruent). By Pythagoras: OM²=OA²−AM²=OC²−CM²=ON² → OM=ON.",
      "worked_example": "Chord AB = 16 cm. Centre O, radius = 10 cm. Find OM (distance from centre to chord).\n\nM = midpoint of AB (since OM ⊥ AB). AM = 8 cm.\nIn △OAM: OA² = OM² + AM²\n10² = OM² + 8²\n100 = OM² + 64\nOM² = 36 → OM = 6 cm.",
      "visual_description": "Draw circle with centre O. Draw chord AB with perpendicular from O meeting at M. Show right angle at M, equal segments AM and MB. For equal chords: draw chord CD of same length, show equal perpendicular distances OM = ON.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <circle cx=\"130\" cy=\"110\" r=\"80\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"130\" cy=\"110\" r=\"3\" fill=\"#1e3a8a\"/>\n  <text x=\"135\" y=\"108\" fill=\"#1e3a8a\" font-size=\"13\">O</text>\n  <line x1=\"58\" y1=\"150\" x2=\"202\" y2=\"150\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n  <text x=\"48\" y=\"155\" fill=\"#dc2626\">A</text>\n  <text x=\"207\" y=\"155\" fill=\"#dc2626\">B</text>\n  <line x1=\"130\" y1=\"110\" x2=\"130\" y2=\"150\" stroke=\"#16a34a\" stroke-width=\"1.5\" stroke-dasharray=\"4,2\"/>\n  <rect x=\"124\" y=\"144\" width=\"6\" height=\"6\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"1.2\"/>\n  <text x=\"133\" y=\"147\" fill=\"#16a34a\" font-size=\"11\">M</text>\n  <line x1=\"130\" y1=\"110\" x2=\"58\" y2=\"150\" stroke=\"#6d28d9\" stroke-width=\"1.5\" stroke-dasharray=\"3,2\"/>\n  <line x1=\"130\" y1=\"110\" x2=\"202\" y2=\"150\" stroke=\"#6d28d9\" stroke-width=\"1.5\" stroke-dasharray=\"3,2\"/>\n  <text x=\"95\" y=\"210\" fill=\"#555\" font-size=\"11\">OM ⊥ AB; AM = MB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Not every line from centre to chord bisects it — only the perpendicular does.",
        "Perpendicular from centre to chord is not the same as radius unless the chord is a diameter.",
        "'Equal chords' means equal length; equal arcs is a different (related) statement."
      ],
      "shortcuts_and_tricks": [
        "Right triangle shortcut: OM² = OA² − AM² (Pythagoras with AM = half-chord).",
        "To find centre of a circle: draw any two non-parallel chords, construct their ⊥ bisectors → intersection = centre.",
        "If OM = ON, then chord AB = chord CD (equidistant ↔ equal chords)."
      ],
      "when_to_use_this_method": "Whenever a problem gives a chord and asks for the distance from the centre (or vice versa). Also when asked to prove two chords are equal given they are equidistant from the centre.",
      "edge_cases": [
        "Diameter is the longest chord; its perpendicular bisector passes through itself.",
        "Two chords can intersect inside the circle — chord properties still apply individually.",
        "If the chord passes through the centre, it IS a diameter; OM = 0."
      ],
      "key_takeaway": "The perpendicular from the centre to a chord bisects it (and conversely). Equal chords are equidistant from the centre. Use the right-angle triangle OAM with Pythagoras to link chord length, distance from centre, and radius.",
      "video_script_hooks": [
        "Paper folding demo: fold a circle so that chord AB aligns — the fold crease always passes through the centre.",
        "Archery analogy: the bullseye (centre) is equidistant from every point on the circle. Chords closer to the centre are longer.",
        "Engineering: bridge cables hang in symmetry about the midpoint — chord properties explain why the central support is always perpendicular to the span."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch17_circle_cyclic_quad",
    "chapterNumber": 17,
    "key_formulas": [
      {
        "formula": "Opposite angles of cyclic quad sum to 180°: ∠A + ∠C = 180°, ∠B + ∠D = 180°",
        "explanation": "ABCD cyclic → opposite pairs supplementary"
      },
      {
        "formula": "Exterior angle of cyclic quad = interior opposite angle: ∠ext_D = ∠B",
        "explanation": "∠CDX (exterior at D) = ∠B (interior opposite at B)"
      },
      {
        "formula": "Converse: if ∠A + ∠C = 180°, then ABCD is cyclic",
        "explanation": "Used to prove a quadrilateral is cyclic"
      },
      {
        "formula": "Rectangle, square, isosceles trapezium are always cyclic",
        "explanation": "Opposite angles each = 180° in all these shapes"
      }
    ],
    "prerequisite_knowledge": [
      "Definition of a cyclic quadrilateral (all four vertices on a circle)",
      "Inscribed angle theorem (∠ACB = ½∠AOB)",
      "Angle sum in a quadrilateral = 360°",
      "Linear pair: two angles forming a straight line sum to 180°"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A cyclic quadrilateral has all four corners on a circle. Opposite angles always add to 180°. Why? Each pair of opposite angles 'looks at' the same pair of arcs from opposite sides — together they account for the full 360° of the circle, so each pair shares 180°.",
      "derivation": "Proof using inscribed angle theorem:\n∠AOC (major arc ADC) = 2∠ABC.\n∠AOC (minor arc ABC) = 2∠ADC.\nMajor + minor central angles = 360°.\n→ 2∠ABC + 2∠ADC = 360° → ∠ABC + ∠ADC = 180°. ✓\n\nExterior angle: ∠ext_D = 180° − ∠D (linear pair) = ∠B (since ∠B + ∠D = 180°).",
      "worked_example": "ABCD is a cyclic quad. ∠A = 85°, ∠B = 95°. Find ∠C and ∠D.\n\n∠A + ∠C = 180° → ∠C = 95°.\n∠B + ∠D = 180° → ∠D = 85°.\nVerify: 85+95+95+85 = 360° ✓.",
      "visual_description": "Circle with cyclic quadrilateral ABCD inscribed. Colour opposite angle pairs (∠A, ∠C in red; ∠B, ∠D in green). Show that each pair sums to 180°. Draw exterior angle at D showing it equals ∠B.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 230\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"13\">\n  <circle cx=\"130\" cy=\"115\" r=\"85\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"82\" cy=\"50\" r=\"4\" fill=\"#dc2626\"/><text x=\"70\" y=\"48\" fill=\"#dc2626\">A</text>\n  <circle cx=\"200\" cy=\"75\" r=\"4\" fill=\"#16a34a\"/><text x=\"207\" y=\"78\" fill=\"#16a34a\">B</text>\n  <circle cx=\"195\" cy=\"178\" r=\"4\" fill=\"#dc2626\"/><text x=\"202\" y=\"183\" fill=\"#dc2626\">C</text>\n  <circle cx=\"62\" cy=\"175\" r=\"4\" fill=\"#16a34a\"/><text x=\"46\" y=\"180\" fill=\"#16a34a\">D</text>\n  <polygon points=\"82,50 200,75 195,178 62,175\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"1.8\"/>\n  <text x=\"75\" y=\"218\" fill=\"#555\" font-size=\"11\">∠A+∠C = ∠B+∠D = 180°</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Adjacent angles of a cyclic quad are NOT necessarily supplementary; only opposite pairs are.",
        "A parallelogram is cyclic ONLY if it is a rectangle (all angles = 90°).",
        "Not every quadrilateral drawn inside a circle is cyclic — all four vertices must lie ON the circle."
      ],
      "shortcuts_and_tricks": [
        "Know 3 angles → find 4th from angle sum 360°; then verify opposite pairs = 180°.",
        "Exterior angle shortcut: ∠ext_C = ∠A (interior opposite). Fast for proofs.",
        "To prove cyclic: show ∠A + ∠C = 180° OR all 4 vertices equidistant from one point."
      ],
      "when_to_use_this_method": "For any quadrilateral inscribed in a circle — find unknown angles or prove cyclicity.",
      "edge_cases": [
        "Rectangle: all angles 90°; opposite pairs each sum to 180°. ✓ Cyclic.",
        "Isosceles trapezium: base angles equal; opposite angles supplementary → always cyclic.",
        "Non-square rhombus: NOT cyclic (opposite angles are equal but adjacent are supplementary)."
      ],
      "key_takeaway": "Opposite angles of a cyclic quadrilateral sum to 180°. Exterior angle = interior opposite. Rectangles and isosceles trapezia are always cyclic. To prove cyclic, show opposite angles are supplementary.",
      "video_script_hooks": [
        "Rubber band on a circular tin: push 4 pins in a circle, stretch a rubber band ABCD — opposite angles always sum to 180°. Try it!",
        "Quick test for cyclic quad: if ∠A + ∠C = 180°, the shape can be inscribed in a circle — automatic property.",
        "Ptolemy's theorem connects cyclic quad diagonals and sides — the same ancient Greek geometry you use today."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch17_circle_theorems",
    "chapterNumber": 17,
    "key_formulas": [
      {
        "formula": "∠AOB = 2∠ACB (central = 2× inscribed, same arc)",
        "explanation": "Core arc-angle theorem"
      },
      {
        "formula": "∠A + ∠C = 180° (cyclic quad, opposite angles)",
        "explanation": "Core cyclic quadrilateral theorem"
      },
      {
        "formula": "Same segment: ∠ACB = ∠ADB",
        "explanation": "Angles in the same segment are equal"
      },
      {
        "formula": "Angle in semicircle = 90°",
        "explanation": "AB diameter → ∠ACB = 90°"
      },
      {
        "formula": "OM ⊥ chord → AM = MB; equal chords equidistant from centre",
        "explanation": "Chord-distance theorem"
      }
    ],
    "prerequisite_knowledge": [
      "Chord properties, arc-angle theorems, cyclic quadrilaterals (all prior sub-topics)",
      "Angle sum in triangle and quadrilateral",
      "Exterior angle theorem for triangles",
      "Parallel line angle properties (alternate, co-interior)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "ICSE circle theorem problems chain two or three theorems together. The strategy: identify what's given (angles, arcs, chords, cyclic quads), state which theorem applies, solve step by step, cite each justification explicitly.",
      "derivation": "Common proof chain:\nProve: If ABCD cyclic and AB ∥ CD, then AD = BC.\n1. AB ∥ CD → arc AB (between parallels) = arc CD (parallel chords cut equal arcs).\n2. Equal arcs → equal chords: AD = BC. ✓\n\nAlternate proof via angles:\nAB ∥ CD → ∠BAD = ∠ADC (co-interior? No, alternate interior). Check with inscribed angles and proceed.",
      "worked_example": "O is the centre. AB is diameter. C is on the circle with ∠CAB = 35°.\n(i) Find ∠ACB. (ii) Find ∠ABC. (iii) Find ∠BOC.\n\n(i) AB is diameter → ∠ACB = 90° (angle in semicircle).\n(ii) In △ACB: ∠ABC = 180° − 90° − 35° = 55°.\n(iii) ∠BOC = 2∠BAC = 2 × 35° = 70° (central = 2× inscribed over arc BC).",
      "visual_description": "Circle with centre O, diameter AB horizontal. Point C on the upper arc. Right angle at C marked. All three angles labelled: ∠CAB = 35°, ∠ACB = 90°, ∠ABC = 55°, ∠BOC = 70° at centre.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 230\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <circle cx=\"130\" cy=\"125\" r=\"85\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"130\" cy=\"125\" r=\"3\" fill=\"#1e3a8a\"/>\n  <text x=\"136\" y=\"123\" fill=\"#1e3a8a\">O</text>\n  <line x1=\"45\" y1=\"125\" x2=\"215\" y2=\"125\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n  <text x=\"34\" y=\"130\" fill=\"#dc2626\">A</text><text x=\"218\" y=\"130\" fill=\"#dc2626\">B</text>\n  <circle cx=\"85\" cy=\"48\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"75\" y=\"43\" fill=\"#16a34a\">C</text>\n  <line x1=\"45\" y1=\"125\" x2=\"85\" y2=\"48\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <line x1=\"215\" y1=\"125\" x2=\"85\" y2=\"48\" stroke=\"#16a34a\" stroke-width=\"1.5\"/>\n  <rect x=\"80\" y=\"48\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"1.2\" transform=\"rotate(-30,84,52)\"/>\n  <text x=\"40\" y=\"218\" fill=\"#555\" font-size=\"11\">∠ACB=90°; ∠BOC=2×∠BAC</text>\n</svg>"
      ],
      "common_misconceptions": [
        "Not every angle in a circle is an inscribed angle — vertex must be on the circumference.",
        "In proofs, state the theorem name as the reason: 'angles in same segment', 'angle in semicircle', etc.",
        "∠AOB = 2∠ACB requires C on the major arc; if C on minor arc, use reflex ∠AOB."
      ],
      "shortcuts_and_tricks": [
        "Draw O and label ALL equal radii — isosceles triangles appear and angle-chasing becomes systematic.",
        "Diameter → 90° angle immediately. Use this to decompose complex problems.",
        "For proof questions: list reasons in brackets next to each step."
      ],
      "when_to_use_this_method": "Multi-step ICSE circle problems. Always identify which theorems are needed before solving.",
      "edge_cases": [
        "When a chord is also a diameter, apply the semicircle angle (90°) immediately.",
        "Tangent theorems (tangent-chord angle, two tangents from external point) belong to Ch18 — don't mix here.",
        "Three or more points on a circle can all create angle relationships — trace systematically."
      ],
      "key_takeaway": "Chain: (1) central = 2× inscribed, (2) same segment = equal, (3) opposite angles of cyclic quad = 180°, (4) semicircle = 90°. State each theorem as a reason in proofs. Always draw O and label radii to spot isosceles triangles.",
      "video_script_hooks": [
        "Angle-chasing game: given ∠AOB, find ∠ACB, then ∠ADB in the same segment — all in 10 seconds using one rule.",
        "Exam strategy: every step in a circle proof must have a theorem name in brackets — bare numbers lose marks.",
        "Ancient Greek astronomers used inscribed angle theorems to measure star positions. Same formula you're using today!"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch18_intersecting_chords",
    "chapterNumber": 18,
    "key_formulas": [
      {
        "formula": "Intersecting chords inside circle: PA × PB = PC × PD",
        "explanation": "Chords AB and CD intersect at P inside the circle; products of segments equal"
      },
      {
        "formula": "Two secants from external P: PA × PB = PC × PD",
        "explanation": "PA, PB are the near and far intersection of one secant; PC, PD of the other"
      },
      {
        "formula": "Tangent-secant from external P: PT² = PA × PB",
        "explanation": "PT = tangent length; PA, PB = near and far intersections of the secant"
      },
      {
        "formula": "Tangent-tangent from external P: PT₁ = PT₂ (already equal tangent lengths)",
        "explanation": "Both tangent lengths from the same external point are equal"
      }
    ],
    "prerequisite_knowledge": [
      "Tangent basics and alternate segment theorem (prior sub-topics)",
      "Similar triangles (AA criterion, corresponding sides in proportion)",
      "Multiplication of fractions and algebraic manipulation"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "When two lines through a circle cross, the products of their segments are equal — this is the 'power of a point'. It works whether the crossing point is inside (two chords) or outside (two secants, or tangent + secant). Think of it as: the circle multiplies the two pieces of each chord/secant by the same factor.",
      "derivation": "Intersecting chords PA × PB = PC × PD:\nIn △PAC and △PDB: ∠APC = ∠DPB (vertically opposite). ∠PAC = ∠PDB (angles in same segment, both subtend arc BC).\nBy AA similarity: △PAC ~ △PDB.\n→ PA/PD = PC/PB → PA × PB = PC × PD. ✓\n\nTangent-secant PT² = PA × PB:\nLet tangent PT touch at T; secant through P cuts circle at A (near) and B (far).\nIn △PTB and △PAT: ∠P is common; ∠PTA = ∠PBT (alternate segment theorem on chord TA).\nBy AA: △PTB ~ △PAT → PT/PA = PB/PT → PT² = PA × PB. ✓",
      "worked_example": "Chords AB and CD intersect at P inside a circle. PA = 4, PB = 9, PC = 6. Find PD.\n\nPA × PB = PC × PD\n4 × 9 = 6 × PD\n36 = 6 × PD → PD = 6.\n\nSecond example (tangent-secant): PT is tangent, PA = 3, PB = 12. Find PT.\nPT² = PA × PB = 3 × 12 = 36. PT = 6.",
      "visual_description": "Two diagrams side by side: (1) Circle with two chords AB and CD crossing at P inside. Label segments PA, PB, PC, PD. (2) Circle with external point P, tangent PT, secant PAB. Label PT, PA (near), PB (far).",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 280 210\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"11\">\n  <!-- Intersecting chords -->\n  <circle cx=\"80\" cy=\"105\" r=\"65\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <line x1=\"30\" y1=\"70\" x2=\"130\" y2=\"155\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <line x1=\"20\" y1=\"145\" x2=\"140\" y2=\"75\" stroke=\"#16a34a\" stroke-width=\"1.8\"/>\n  <circle cx=\"76\" cy=\"113\" r=\"3\" fill=\"#7c3aed\"/>\n  <text x=\"79\" y=\"112\" fill=\"#7c3aed\" font-size=\"10\">P</text>\n  <text x=\"22\" y=\"65\" fill=\"#dc2626\">A</text><text x=\"132\" y=\"158\" fill=\"#dc2626\">B</text>\n  <text x=\"12\" y=\"145\" fill=\"#16a34a\">C</text><text x=\"143\" y=\"73\" fill=\"#16a34a\">D</text>\n  <text x=\"10\" y=\"200\" fill=\"#555\" font-size=\"10\">PA·PB = PC·PD</text>\n  <!-- Tangent-secant -->\n  <circle cx=\"210\" cy=\"100\" r=\"55\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"260\" cy=\"170\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"264\" y=\"175\" fill=\"#dc2626\">P</text>\n  <circle cx=\"185\" cy=\"55\" r=\"3\" fill=\"#16a34a\"/>\n  <text x=\"180\" y=\"50\" fill=\"#16a34a\">T</text>\n  <line x1=\"260\" y1=\"170\" x2=\"185\" y2=\"55\" stroke=\"#16a34a\" stroke-width=\"1.8\"/>\n  <line x1=\"260\" y1=\"170\" x2=\"160\" y2=\"150\" stroke=\"#7c3aed\" stroke-width=\"1.8\"/>\n  <text x=\"145\" y=\"145\" fill=\"#7c3aed\">A</text>\n  <text x=\"195\" y=\"205\" fill=\"#555\" font-size=\"10\">PT² = PA·PB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "PA × PB means the product of the two SEGMENTS from P to each end of the chord — not the whole chord length.",
        "For the secant from external P: PA is the NEAR intersection, PB is the FAR intersection. Always measure from P.",
        "The formula PT² = PA × PB requires PT to be a TANGENT, not a secant. If two secants: PA₁ × PB₁ = PA₂ × PB₂."
      ],
      "shortcuts_and_tricks": [
        "Label segments from P outward: PA (near) × PB (far) = same for each line from P.",
        "For tangent-secant: PT² = (near segment) × (whole secant length). Don't use only the far segment.",
        "Cross-multiply to isolate unknown: PA × PB = PC × PD → unknown = product / known."
      ],
      "when_to_use_this_method": "Whenever two chords intersect (inside or outside the circle) and you need to find an unknown segment length.",
      "edge_cases": [
        "If P is exactly on the circle, one segment becomes 0 — the formula still works but gives a trivial result.",
        "Two chords through the centre are diameters — PA × PB = PC × PD = r × r = r² (since each segment = r when P = O).",
        "If tangent and chord from same external point: tangent length² = product of secant segments."
      ],
      "key_takeaway": "Power of a Point: PA × PB = PC × PD for any two lines from P through a circle (inside or outside). For tangent-secant: PT² = PA × PB. Always measure segments from P. This single formula covers chords, secants, and tangent-secant cases.",
      "video_script_hooks": [
        "Lever principle analogy: PA × PB = PC × PD is like two see-saws balancing at P — the products on each arm are equal.",
        "Telescope focus: the relationship between light ray segments in a circular lens follows the same intersecting chord rule.",
        "Quick problem: PA=3, PC=4, PD=6. Find PB. PA × PB = PC × PD → 3 × PB = 24 → PB = 8. Done in 5 seconds."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch18_tangent_basics",
    "chapterNumber": 18,
    "key_formulas": [
      {
        "formula": "Tangent ⊥ radius at point of tangency: OT ⊥ PT",
        "explanation": "The radius drawn to the point of tangency is perpendicular to the tangent"
      },
      {
        "formula": "Tangent length from external point: PT² = PO² − OT²",
        "explanation": "Right-angled triangle OTP with hypotenuse PO; PT = tangent length"
      },
      {
        "formula": "Two tangents from P: PA = PB (equal tangent lengths)",
        "explanation": "Tangents from an external point are equal in length"
      },
      {
        "formula": "∠OPT where O = centre, P = external point: tan(∠OPT) = OT/PT",
        "explanation": "Right triangle OTP; OT = radius, PT = tangent length"
      }
    ],
    "prerequisite_knowledge": [
      "Circle vocabulary: centre, radius, chord, arc",
      "Pythagoras theorem",
      "Congruence criteria (RHS)",
      "Inscribed angle theorem (Ch17)"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "A tangent to a circle touches it at exactly one point. The key insight is that the radius to the tangent point is always perpendicular to the tangent. Think of a spinning wheel touching the road: the contact point is where the wheel's spoke meets the road at a right angle. This one fact generates all tangent theorems.",
      "derivation": "Proof that tangent ⊥ radius:\nLet T be the point of tangency, O the centre, P any point on the tangent (P ≠ T).\nOP is NOT a radius (P is on the tangent line, outside the circle for P ≠ T) → OP > OT (radius).\nSo OT is the shortest distance from O to the tangent line → OT ⊥ tangent. ✓\n\nProof that two tangents from P are equal:\nPA and PB tangents from P. In △OAP and △OBP:\nOA = OB = r; OP = OP (common); ∠OAP = ∠OBP = 90°.\nBy RHS: △OAP ≅ △OBP → PA = PB. ✓",
      "worked_example": "PO = 13 cm, radius OT = 5 cm. PT is a tangent. Find PT.\n\nIn right △OTP: OT ⊥ PT.\nPT² = PO² − OT² = 169 − 25 = 144.\nPT = 12 cm.",
      "visual_description": "Draw circle with centre O. Draw external point P. Draw two tangents PA and PB touching the circle at A and B. Show right angles at A and B. Draw OP and show the kite shape OAPB. Label PA = PB, ∠OAP = ∠OBP = 90°.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 280 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <circle cx=\"130\" cy=\"110\" r=\"60\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"130\" cy=\"110\" r=\"3\" fill=\"#1e3a8a\"/>\n  <text x=\"136\" y=\"108\" fill=\"#1e3a8a\">O</text>\n  <!-- External point P -->\n  <circle cx=\"260\" cy=\"110\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"265\" y=\"113\" fill=\"#dc2626\">P</text>\n  <!-- Tangent point A (upper) -->\n  <circle cx=\"115\" cy=\"51\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"107\" y=\"46\" fill=\"#16a34a\">A</text>\n  <!-- Tangent point B (lower) -->\n  <circle cx=\"115\" cy=\"169\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"107\" y=\"183\" fill=\"#16a34a\">B</text>\n  <!-- Tangent lines PA and PB -->\n  <line x1=\"260\" y1=\"110\" x2=\"115\" y2=\"51\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <line x1=\"260\" y1=\"110\" x2=\"115\" y2=\"169\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <!-- Radii OA, OB -->\n  <line x1=\"130\" y1=\"110\" x2=\"115\" y2=\"51\" stroke=\"#6d28d9\" stroke-width=\"1.5\" stroke-dasharray=\"4,2\"/>\n  <line x1=\"130\" y1=\"110\" x2=\"115\" y2=\"169\" stroke=\"#6d28d9\" stroke-width=\"1.5\" stroke-dasharray=\"4,2\"/>\n  <!-- Right angle marks -->\n  <text x=\"95\" y=\"60\" fill=\"#16a34a\" font-size=\"11\">90°</text>\n  <text x=\"95\" y=\"167\" fill=\"#16a34a\" font-size=\"11\">90°</text>\n  <text x=\"80\" y=\"210\" fill=\"#555\" font-size=\"11\">PA = PB; OA ⊥ PA; OB ⊥ PB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "A tangent does NOT bisect the circle — it only touches it at one point.",
        "The radius to the tangent point is perpendicular to the tangent, NOT to the chord.",
        "Two tangents from the same external point are equal in length, not in angle (unless the configuration is symmetric)."
      ],
      "shortcuts_and_tricks": [
        "PT² = PO² − r² (Pythagoras in right triangle OTP).",
        "Kite OAPB: PA = PB, OA = OB = r, ∠OAP = ∠OBP = 90°. Used in proof of PA = PB.",
        "∠APB = 180° − ∠AOB (since ∠A + ∠B = 180°, ∠P + ∠O = 180° in kite OAPB)."
      ],
      "when_to_use_this_method": "Whenever a problem involves a tangent from an external point, or needs the tangent length, or proves PA = PB.",
      "edge_cases": [
        "If P is ON the circle, there is exactly one tangent (the tangent at that point). PA = 0.",
        "If P is INSIDE the circle, no tangent can be drawn from P.",
        "A line tangent at T is perpendicular to OT; don't confuse OT with the chord through T."
      ],
      "key_takeaway": "Tangent ⊥ radius at the point of tangency. Two tangents from an external point are equal. Use Pythagoras (PT² = PO² − r²) for tangent length. The kite OAPB (PA=PB, OA=OB, right angles at A and B) is the key diagram.",
      "video_script_hooks": [
        "Car tyre analogy: the tyre touches the road at exactly one point (the tangent point), and the wheel's spoke (radius) is perpendicular to the road at that instant.",
        "Satellite dish: signals tangentially reach a receiver — the tangent line is perpendicular to the radius pointing to the satellite.",
        "Quick calculation race: given PO = 13, r = 5, find PT in under 5 seconds. Answer: 12. Always use PT² = PO²−r²."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch18_tangent_chord_angle",
    "chapterNumber": 18,
    "key_formulas": [
      {
        "formula": "Alternate Segment Theorem: ∠between tangent and chord = ∠inscribed in alternate segment",
        "explanation": "If XTY is tangent at T, chord TC: ∠XTC = ∠TBC (angle in alternate segment)"
      },
      {
        "formula": "∠YTC = ∠TAC (angle on other side of chord, in the other alternate segment)",
        "explanation": "Both alternate segment angles exist — one on each side of the chord"
      },
      {
        "formula": "Proof shortcut: ∠XTO = 90° (tangent ⊥ radius); ∠COT = ∠AOT (isosceles); links to inscribed angle",
        "explanation": "The theorem follows from tangent ⊥ radius + inscribed angle theorem"
      }
    ],
    "prerequisite_knowledge": [
      "Tangent ⊥ radius at point of tangency",
      "Inscribed angle theorem (∠ACB = ½∠AOB)",
      "Angles in same segment are equal",
      "Angle sum in triangle = 180°"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "The alternate segment theorem says: the angle between a tangent and a chord at the point of tangency equals the inscribed angle in the 'other' (alternate) segment. The chord TC divides the circle into two segments — the angle the tangent makes with TC equals the angle any point in the opposite segment makes with the same chord TC.",
      "derivation": "Proof:\nLet XTY be the tangent at T, TC a chord. Let B be any point on the major arc (segment on the other side of TC from the tangent contact region).\nDraw diameter TD (T to centre O to D).\n∠XTD = 90° (tangent ⊥ radius OT, so ∠XTO = 90°, and D is on OT extended).\n∠TDC = ∠TBC (angles in same segment DC).\n∠XTC = 90° − ∠DTX wait... let me redo:\n∠OTC = ∠OCT (isosceles, OT=OC=r). Let = α. Central angle ∠TOC = 180°−2α.\nInscribed angle ∠TBC = ½∠TOC = (180°−2α)/2 = 90°−α.\n∠XTC = 90° − ∠OTC = 90° − α (since ∠XTO = 90°).\n∴ ∠XTC = ∠TBC. ✓",
      "worked_example": "XTY is tangent at T. Chord TC. ∠XTC = 55°. Find ∠TBC where B is on the major arc.\n\nBy alternate segment theorem: ∠TBC = ∠XTC = 55°.\n\nAlso, ∠TAC where A is on the minor arc (opposite segment):\n∠TAC = ∠YTC = 180° − 55° = 125°. (Wait: ∠XTY is a straight line → ∠YTC = 180° − ∠XTC = 125°. ∠TAC = 125° by alternate segment on the other side.)",
      "visual_description": "Draw circle. Mark tangent XTY at point T. Draw chord TC going into the circle. Label the two arcs (major and minor). Show ∠XTC = ∠TBC (angle in major arc segment). Show ∠YTC = ∠TAC (angle in minor arc segment).",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 280 230\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <circle cx=\"140\" cy=\"120\" r=\"80\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <!-- Tangent XTY -->\n  <line x1=\"20\" y1=\"200\" x2=\"260\" y2=\"200\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n  <text x=\"10\" y=\"198\" fill=\"#dc2626\">X</text>\n  <text x=\"263\" y=\"198\" fill=\"#dc2626\">Y</text>\n  <!-- T (bottom of circle, tangent point) -->\n  <circle cx=\"140\" cy=\"200\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"145\" y=\"215\" fill=\"#16a34a\">T</text>\n  <!-- Chord TC going up to C -->\n  <circle cx=\"90\" cy=\"55\" r=\"4\" fill=\"#7c3aed\"/>\n  <text x=\"80\" y=\"50\" fill=\"#7c3aed\">C</text>\n  <line x1=\"140\" y1=\"200\" x2=\"90\" y2=\"55\" stroke=\"#7c3aed\" stroke-width=\"2\"/>\n  <!-- B on major arc -->\n  <circle cx=\"210\" cy=\"80\" r=\"4\" fill=\"#f59e0b\"/>\n  <text x=\"216\" y=\"78\" fill=\"#f59e0b\">B</text>\n  <line x1=\"210\" y1=\"80\" x2=\"140\" y2=\"200\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/>\n  <line x1=\"210\" y1=\"80\" x2=\"90\" y2=\"55\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/>\n  <text x=\"40\" y=\"225\" fill=\"#555\" font-size=\"11\">∠XTC = ∠TBC (alt. segment)</text>\n</svg>"
      ],
      "common_misconceptions": [
        "The angle is between the TANGENT and the CHORD, not between the tangent and the radius.",
        "The alternate segment is the one on the OTHER side of the chord from the tangent angle being measured.",
        "Both ∠XTC and ∠YTC have alternate segment counterparts — one in each segment."
      ],
      "shortcuts_and_tricks": [
        "Remember: angle on tangent side of chord = angle in the opposite segment.",
        "If ∠XTC = x°, then ∠TBC (in major arc) = x° and ∠TAC (in minor arc) = 180°−x°.",
        "Quick proof: use 'tangent-chord = ½ arc TC' (same as the inscribed angle on the other side)."
      ],
      "when_to_use_this_method": "When a problem has a tangent touching the circle at the same point as a chord — look for the alternate segment theorem.",
      "edge_cases": [
        "If the chord is a diameter, the tangent-chord angle = 90° = inscribed angle in the semicircle. ✓",
        "The theorem applies even if the external angle is obtuse (use the other side of the tangent).",
        "Do not confuse this with the tangent-secant angle from an external point."
      ],
      "key_takeaway": "Alternate Segment Theorem: tangent-chord angle at T = inscribed angle in the alternate segment. One of the most frequently tested ICSE circle theorems. Always identify which segment is 'alternate' (opposite to where the angle opens toward the tangent).",
      "video_script_hooks": [
        "Sliding analogy: slide a chord until it becomes a tangent — the 'inscribed angle' becomes the tangent-chord angle. The theorem shows they're always equal.",
        "Ball bouncing off a curved wall: the angle it hits equals the angle it leaves — similar to how the chord angle equals the opposite arc angle.",
        "ICSE exam tip: alternate segment theorem appears in almost every ICSE paper. Practice identifying T (tangent point), the chord, and which segment is 'alternate'."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch18_tangent_properties",
    "chapterNumber": 18,
    "key_formulas": [
      {
        "formula": "∠APB + ∠AOB = 180° (kite OAPB: tangents from P, O is centre)",
        "explanation": "Angles at P and O are supplementary in the kite formed by two tangents"
      },
      {
        "formula": "∠OPA = ∠OPB (OP bisects ∠APB and also ∠AOB)",
        "explanation": "Line OP is the axis of symmetry of the kite OAPB"
      },
      {
        "formula": "∠TPQ = ∠TBQ (angle between tangent and chord = angle in alternate segment)",
        "explanation": "Alternate segment theorem: tangent-chord angle = inscribed angle in the opposite segment"
      },
      {
        "formula": "Tangent-tangent: ∠PAO = ∠PBO = 90°; PA = PB; ∠APO = ∠BPO",
        "explanation": "All properties of the symmetric kite OAPB"
      }
    ],
    "prerequisite_knowledge": [
      "Tangent ⊥ radius at point of tangency",
      "Two tangents from external point are equal (tangent_basics)",
      "Cyclic quadrilateral properties",
      "Angle sum in triangles and quadrilaterals"
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": "When two tangents are drawn from one external point, they create a symmetric kite shape. The line from the external point to the centre bisects both the angle at the external point and the angle at the centre. All angle relationships in tangent problems come from this symmetry and from the right angles at the tangent points.",
      "derivation": "∠APB + ∠AOB = 180° proof:\nIn kite OAPB: ∠OAP = ∠OBP = 90°.\nSum of angles in quadrilateral = 360°.\n∠OAP + ∠OBP + ∠APB + ∠AOB = 360°.\n90° + 90° + ∠APB + ∠AOB = 360°.\n∠APB + ∠AOB = 180°. ✓\n\nOP bisects ∠APB:\nIn △OAP and △OBP: OA=OB, OP=OP, ∠OAP=∠OBP=90°.\nRHS → △OAP ≅ △OBP → ∠APO = ∠BPO. ✓",
      "worked_example": "Two tangents PA and PB from P. ∠AOB = 130°. Find ∠APB.\n\n∠APB = 180° − ∠AOB = 180° − 130° = 50°.\n\nAlso find ∠APO (angle OP makes with each tangent):\n∠APO = ∠APB/2 = 25° (OP bisects ∠APB).",
      "visual_description": "Draw kite OAPB: O at top (centre), P at right (external point), A and B are tangent points. Show PA = PB, ∠OAP = ∠OBP = 90°. Show OP as axis of symmetry bisecting ∠APB and ∠AOB.",
      "svg_diagrams": [
        "<svg viewBox=\"0 0 260 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"serif\" font-size=\"12\">\n  <circle cx=\"100\" cy=\"110\" r=\"65\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n  <circle cx=\"100\" cy=\"110\" r=\"3\" fill=\"#1e3a8a\"/>\n  <text x=\"105\" y=\"108\" fill=\"#1e3a8a\">O</text>\n  <circle cx=\"245\" cy=\"110\" r=\"4\" fill=\"#dc2626\"/>\n  <text x=\"250\" y=\"113\" fill=\"#dc2626\">P</text>\n  <circle cx=\"80\" cy=\"46\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"70\" y=\"41\" fill=\"#16a34a\">A</text>\n  <circle cx=\"80\" cy=\"174\" r=\"4\" fill=\"#16a34a\"/>\n  <text x=\"70\" y=\"185\" fill=\"#16a34a\">B</text>\n  <line x1=\"245\" y1=\"110\" x2=\"80\" y2=\"46\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <line x1=\"245\" y1=\"110\" x2=\"80\" y2=\"174\" stroke=\"#dc2626\" stroke-width=\"1.8\"/>\n  <line x1=\"100\" y1=\"110\" x2=\"80\" y2=\"46\" stroke=\"#6d28d9\" stroke-width=\"1.5\" stroke-dasharray=\"4,2\"/>\n  <line x1=\"100\" y1=\"110\" x2=\"80\" y2=\"174\" stroke=\"#6d28d9\" stroke-width=\"1.5\" stroke-dasharray=\"4,2\"/>\n  <line x1=\"245\" y1=\"110\" x2=\"100\" y2=\"110\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5,3\"/>\n  <text x=\"100\" y=\"210\" fill=\"#555\" font-size=\"11\">∠APB + ∠AOB = 180°; PA = PB</text>\n</svg>"
      ],
      "common_misconceptions": [
        "∠APO ≠ ∠APB. ∠APO = half of ∠APB (since OP bisects it).",
        "The kite OAPB has ∠OAP = ∠OBP = 90°, not ∠AOB = 90°.",
        "PA = PB does not mean PA = OA — PA is the tangent length, OA is the radius."
      ],
      "shortcuts_and_tricks": [
        "∠APB = 180° − ∠AOB. Memorize this for fast calculations.",
        "OP bisects both ∠APB and ∠AOB. Use this to find half-angles.",
        "In right △OAP: tan(∠OPA) = OA/PA → can find angles using trigonometry."
      ],
      "when_to_use_this_method": "For any problem with two tangents from one external point — find ∠APB, prove PA = PB, or find angles in the kite.",
      "edge_cases": [
        "If ∠AOB = 180°, then ∠APB = 0° (the two tangents are parallel — P is at infinity).",
        "If ∠AOB = 90°, then ∠APB = 90° (special right-angle tangent case).",
        "When only one tangent is given (one-tangent problems), only the perpendicularity property applies."
      ],
      "key_takeaway": "Two tangents from P: PA = PB; ∠APB + ∠AOB = 180°; OP bisects both angles. The kite OAPB with two right angles at A and B is the master diagram. Derive everything from this.",
      "video_script_hooks": [
        "Kite analogy: OAPB really is a kite shape — two pairs of equal adjacent sides (OA=OB and PA=PB), and a line of symmetry (OP).",
        "Quick check: if ∠AOB = 100°, what is ∠APB? Answer: 80° in under 3 seconds.",
        "Rope around a drum: two rope segments from your hand (P) to the drum (circle) have equal length — that's PA = PB in real life."
      ]
    }
  },
  {
    "topicId": "icse_math10_ch19_constructions_basics",
    "chapterNumber": 19,
    "key_formulas": [
      {
        "formula": "Angle bisector of ∠ABC: every point P on the bisector satisfies d(P, BA) = d(P, BC).",
        "explanation": "To construct: with B as centre draw an arc cutting BA at X and BC at Y; with equal radii from X and Y draw arcs meeting at Z; BZ is the bisector."
      },
      {
        "formula": "Perpendicular bisector of AB: every point P on it satisfies PA = PB.",
        "explanation": "To construct: with centres A and B draw arcs of radius > ½AB above and below AB; join the two intersection points — the line is both perpendicular to and bisects AB."
      },
      {
        "formula": "Perpendicular from external point P to line AB: drop a perpendicular foot F so that PF ⊥ AB.",
        "explanation": "With centre P draw an arc cutting AB at X and Y; with equal radii from X and Y draw arcs below AB meeting at Z; PZ is the required perpendicular."
      },
      {
        "formula": "Perpendicular at a point F ON line AB: draw a perpendicular at F standing on the line.",
        "explanation": "With centre F mark equal points X and Y on AB; with radii > FX from X and Y draw arcs meeting at Z; FZ ⊥ AB."
      }
    ],
    "name": "Basic Constructions — Angle Bisector and Perpendicular Bisector",
    "prerequisite_knowledge": [
      "Using a ruler and compass accurately — drawing circles of given radius, arcs.",
      "Concept of a line segment, midpoint, perpendicular, and angle.",
      "Properties of an angle bisector — every point on it is equidistant from the two arms.",
      "Properties of a perpendicular bisector — every point on it is equidistant from the two endpoints.",
      "Basic geometry: sum of angles on a straight line = 180°; vertically opposite angles."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A compass and ruler can build exact geometry without measuring angles or distances — only equal distances matter. Angle bisectors split angles exactly in two; perpendicular bisectors find the exact midpoint with a perpendicular crossing. These two constructions are the building blocks for every harder ICSE construction.",
        "hook": "Engineers and architects used compass-and-ruler constructions for centuries before CAD existed. The 'perfect right angle' in the corner of every building descends from exactly these techniques.",
        "real_world_anchors": [
          "Folding a piece of paper exactly in half creates a perpendicular bisector of the fold line.",
          "A surveyor locating the exact midpoint between two stakes uses a rope-and-arc method identical to this construction.",
          "Roof trusses are designed using angle bisectors to distribute load equally on both sides.",
          "Dividing a given piece of land equally using only a measuring rope and peg — the perpendicular bisector guarantees equality."
        ],
        "the_pivot_idea": "Both constructions rely on ONE idea: the set of all points equidistant from two objects is the bisector of those objects. For two points → perpendicular bisector; for two lines meeting at an angle → angle bisector.",
        "wrong_intuitions_to_replace": [
          "'I can use a protractor to draw a 90° angle.' — In constructions, only compass and ruler are allowed; the protractor is banned.",
          "'I just estimate the midpoint by eye.' — All construction marks must be arc-based; estimation fails in exam marking.",
          "'The construction gives an approximate result.' — A correctly drawn compass-and-ruler construction is exact, not approximate."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Why the perpendicular bisector construction works",
        "step_by_step": [
          "Draw segment AB. With centre A, radius r > ½AB, draw arcs above and below AB. With centre B, same radius r, draw arcs above and below AB.",
          "Let the arcs cross above at P and below at Q.",
          "AP = BP = r (same radius). AQ = BQ = r. So both P and Q are equidistant from A and B.",
          "By the definition of perpendicular bisector (locus of points equidistant from A and B), P and Q lie ON the perpendicular bisector.",
          "The line PQ is therefore the perpendicular bisector of AB. It is perpendicular because the rhombus AQBP has diagonals that bisect each other at right angles."
        ],
        "key_insight": "The construction physically builds the locus — no angle measurement needed because equal radii from each endpoint guarantee equidistance."
      },
      "worked_example": {
        "problem": "Construct the perpendicular bisector of a line segment AB = 6 cm. Verify that the construction point lies equidistant from A and B.",
        "solution_steps": [
          "Draw AB = 6 cm with ruler.",
          "With centre A, draw arcs of radius 4 cm (> 3 cm = ½AB) above and below AB.",
          "With centre B, same radius 4 cm, draw arcs above and below AB.",
          "Label the arc intersections P (above) and Q (below). Draw line PQ.",
          "PQ meets AB at M. Measure: AM = MB = 3 cm ✓ (M is the midpoint).",
          "Measure angle PMA = 90° with a protractor to verify perpendicularity ✓.",
          "Also verify: PA = PB = 4 cm ✓; QA = QB = 4 cm ✓."
        ],
        "final_answer": "M is the midpoint of AB; PQ is the perpendicular bisector.",
        "verification": "AM = MB = 3 cm and ∠PMA = 90° confirm the construction."
      },
      "visual_description": {
        "diagram_description": "Horizontal segment AB. Two pairs of intersecting arcs — one pair above AB (meeting at P) and one pair below (meeting at Q). Vertical line PQ crossing AB at its midpoint M. Right-angle marker at M.",
        "key_visual_elements": [
          "AB horizontal, endpoints clearly marked.",
          "Dashed arcs from A and B of equal radius.",
          "Intersection points P (above) and Q (below) with the line PQ drawn solid.",
          "Midpoint M with a right-angle square symbol."
        ],
        "color_coding": "Arcs from A in blue; arcs from B in red; bisector PQ in green."
      },
      "svg_diagrams": [
        {
          "title": "Perpendicular Bisector Construction",
          "svg_description": "Horizontal segment AB at y=200, A at x=100, B at x=220. Blue arcs from A (r=70) above/below. Red arcs from B (r=70) above/below. P at ~(160,134), Q at ~(160,266). Green line PQ. Right-angle marker at midpoint M=(160,200)."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Using a radius less than or equal to ½AB so arcs don't cross.",
          "correction": "Radius MUST be greater than half the segment length; otherwise the arcs miss each other and no crossing point is found."
        },
        {
          "mistake": "Drawing arcs from only one side of AB so only one crossing is found, giving a point rather than a line.",
          "correction": "Draw arcs from both above and below to get two crossing points P and Q, then the bisector line is determined."
        },
        {
          "mistake": "Joining one arc intersection to A or B instead of to the other arc intersection.",
          "correction": "The bisector line is the line through both crossing points P and Q — not through A or B."
        }
      ],
      "shortcuts_and_tricks": [
        "Quick check: after construction, measure from the crossing point to each endpoint with your compass. If both distances are equal, the construction is correct.",
        "For the angle bisector: after the construction, fold the paper along the bisector — the two arms of the angle should coincide exactly.",
        "Always use a sharp pencil; thick arcs give inaccurate intersections and will cost marks in exams."
      ],
      "when_to_use_this_method": [
        "Perpendicular bisector: whenever a problem asks for the midpoint of a segment, a line equidistant from two points, or the circumcenter of a triangle.",
        "Angle bisector: whenever a problem asks for the incenter of a triangle, a line equidistant from two intersecting lines, or to divide an angle equally.",
        "Both constructions appear as step-1 sub-tasks inside larger constructions (circumcircle, incircle, tangent from external point)."
      ],
      "edge_cases": [
        "If A and B coincide, there is no unique perpendicular bisector — the 'segment' has length zero.",
        "An angle of 0° or 180° has no bisector in the usual construction sense (degenerate cases).",
        "If the angle is already 90°, the bisector gives 45° — a useful shortcut for many construction problems."
      ],
      "key_takeaway": "Angle bisectors and perpendicular bisectors are the two atomic moves of ruler-and-compass construction. Every higher construction in this chapter — tangents, circumcircle, incircle — reduces to repeated applications of these two moves.",
      "video_script_hooks": [
        "Opening: 'No protractor, no measuring angles — yet I can build a perfect right angle with just a compass and ruler. Here's how.'",
        "Mid-lesson pivot: 'Notice both constructions use exactly the same idea: equal distances from two objects. Just the objects change.'",
        "Closing: 'Master these two moves and every construction in this chapter becomes an assembly task — you already know all the parts.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch19_constructions_circumscribed",
    "chapterNumber": 19,
    "key_formulas": [
      {
        "formula": "Circumcenter O = intersection of perpendicular bisectors of any two sides of △ABC.",
        "explanation": "The perpendicular bisector of AB is the locus of points equidistant from A and B; the perpendicular bisector of BC is equidistant from B and C. Their intersection is equidistant from A, B, and C — that's the circumcenter."
      },
      {
        "formula": "Circumradius R = OA = OB = OC.",
        "explanation": "Measure from the circumcenter O to any vertex; all three distances are equal (this is the verification step)."
      },
      {
        "formula": "For a right triangle, circumcenter = midpoint of hypotenuse; R = hypotenuse / 2.",
        "explanation": "The angle in a semicircle is 90°, so the right-angle vertex lies on the semicircle with the hypotenuse as diameter — making the midpoint of the hypotenuse the circumcenter."
      }
    ],
    "name": "Circumscribed Circle of a Triangle",
    "prerequisite_knowledge": [
      "Perpendicular bisector of a line segment — construction and locus property.",
      "The circumcenter of a triangle is the point where all three perpendicular bisectors meet.",
      "Circumcenter is equidistant from all three vertices: OA = OB = OC = circumradius R.",
      "For acute triangles, circumcenter is inside; right triangles — midpoint of hypotenuse; obtuse triangles — outside.",
      "Drawing a circle given its centre and one point on it."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A circumscribed circle passes through all three vertices of a triangle. Finding its centre is the same as asking: where is the one point that is exactly the same distance from all three corners? The perpendicular bisectors of the sides encode 'equal distances from pairs of corners' — so their meeting point is equidistant from all three.",
        "hook": "Given three radio towers, where should a single relay station be placed to be exactly the same distance from all three? This is the circumcenter problem — and the same construction solves it.",
        "real_world_anchors": [
          "Triangulation in GPS: the location that is equidistant from three satellites.",
          "Designing a park with three streets: place a fountain equidistant from all three paths.",
          "The circumscribed circle of a gear tooth determines the pitch circle in mechanical engineering.",
          "In art: drawing a perfect circle through three given points on a canvas."
        ],
        "the_pivot_idea": "Two perpendicular bisectors are enough — the third passes through the same point automatically (proved by Euclidean geometry). So construct two and stop.",
        "wrong_intuitions_to_replace": [
          "'I need to draw all three perpendicular bisectors.' — Two are sufficient; the third serves only as a verification check.",
          "'The circumcenter is always inside the triangle.' — Only for acute triangles; it is on the hypotenuse for right triangles and outside for obtuse triangles.",
          "'Any circle through two vertices of a triangle is the circumcircle.' — No; the circumcircle passes through ALL THREE vertices specifically."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Why perpendicular bisectors meet at the circumcenter",
        "step_by_step": [
          "Let O be the intersection of the perpendicular bisectors of AB and BC.",
          "O lies on the perpendicular bisector of AB ⟹ OA = OB (equidistant from A and B).",
          "O lies on the perpendicular bisector of BC ⟹ OB = OC (equidistant from B and C).",
          "Combining: OA = OB = OC. So O is equidistant from all three vertices.",
          "Therefore O is the circumcenter and R = OA = OB = OC is the circumradius.",
          "The circle with centre O and radius R passes through A, B, and C. QED."
        ],
        "key_insight": "Transitivity of equality: OA = OB and OB = OC forces OA = OC. Two perpendicular bisectors are sufficient because the equality chain closes automatically."
      },
      "worked_example": {
        "problem": "Construct triangle ABC with AB = 6 cm, BC = 5 cm, CA = 4 cm. Draw the circumscribed circle.",
        "solution_steps": [
          "Draw AB = 6 cm.",
          "With compass, draw arc of 5 cm from B and arc of 4 cm from A; intersection = C.",
          "Draw the perpendicular bisector of AB: mark midpoint M₁; draw bisector l₁.",
          "Draw the perpendicular bisector of BC: mark midpoint M₂; draw bisector l₂.",
          "Mark the intersection of l₁ and l₂ as O (circumcenter).",
          "Measure OA (circumradius R).",
          "Draw circle with centre O, radius R = OA.",
          "Verification: the circle passes through B and C too. Measure OB and OC — they equal OA ✓."
        ],
        "final_answer": "The circumscribed circle has centre O and passes through A, B, and C. For this triangle, R ≈ 3.1 cm.",
        "verification": "Measure OA, OB, OC with compass — all three should be equal."
      },
      "visual_description": {
        "diagram_description": "Triangle ABC. Dashed perpendicular bisectors of AB and BC intersecting at O. Circumcircle drawn through all three vertices. Right-angle markers at the midpoints of AB and BC.",
        "key_visual_elements": [
          "Triangle ABC in solid lines.",
          "Perpendicular bisectors (dashed) of AB and BC.",
          "Circumcenter O marked at intersection.",
          "Circumcircle in solid blue through A, B, C."
        ],
        "color_coding": "Triangle sides black; perpendicular bisectors green dashed; circumcircle blue; O marked with a dot and label."
      },
      "svg_diagrams": [
        {
          "title": "Circumcircle Construction",
          "svg_description": "Triangle: A at (160,280), B at (280,280), C at (220,140). Perp bisector of AB: vertical through (220,280). Perp bisector of BC: through midpoint (250,210) with slope perpendicular to BC. O at approx (220,215). Circle through A, B, C centred at O."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Drawing the angle bisectors instead of perpendicular bisectors, giving the incircle instead.",
          "correction": "Circumcircle uses PERPENDICULAR BISECTORS of sides. Incircle uses ANGLE BISECTORS. These give different centres."
        },
        {
          "mistake": "Only drawing one perpendicular bisector and assuming the center is on that line without finding the intersection.",
          "correction": "You need at least two perpendicular bisectors; the centre is their intersection point."
        },
        {
          "mistake": "Assuming the circumcenter is always inside the triangle.",
          "correction": "For acute triangles it is inside; for obtuse triangles it is outside; for right triangles it is at the midpoint of the hypotenuse."
        }
      ],
      "shortcuts_and_tricks": [
        "Right triangle shortcut: circumcenter = midpoint of hypotenuse, no construction needed beyond finding that midpoint.",
        "After drawing the circumcircle, verify it passes through all three vertices — if even one vertex is off, recheck the perpendicular bisector steps.",
        "In an equilateral triangle, circumcenter = centroid = incenter — they all coincide."
      ],
      "when_to_use_this_method": [
        "'Draw the circumscribed circle' or 'find the point equidistant from three vertices' in construction questions.",
        "Right-triangle problems: circumcenter = midpoint of hypotenuse (mental shortcut, no drawing needed).",
        "Locus problems combining perpendicular bisectors and circles."
      ],
      "edge_cases": [
        "If the three points are collinear, no circumcircle exists (the 'circle' would have infinite radius).",
        "Obtuse triangle: circumcenter falls outside the triangle; the construction is the same, but O is not inside the triangle boundaries.",
        "Right triangle: the right-angle vertex lies on the circle with hypotenuse as diameter — circumcenter is at the midpoint of the hypotenuse."
      ],
      "key_takeaway": "To circumscribe a circle around △ABC: draw perpendicular bisectors of any two sides; their intersection is the circumcenter O; the circumradius = OA. The third perpendicular bisector always passes through the same point — a beautiful consistency check.",
      "video_script_hooks": [
        "Opening: 'Three dots on a page. Can I draw a circle that passes through all three exactly? One circle, infinite precision — here's the trick.'",
        "Mid-lesson: 'I only need to draw two perpendicular bisectors. Why? Because equal distances are transitive.'",
        "Closing: 'Check: does the circle pass through the third vertex too? If yes, your construction is perfect.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch19_constructions_inscribed",
    "chapterNumber": 19,
    "key_formulas": [
      {
        "formula": "Incenter I = intersection of any two angle bisectors of △ABC.",
        "explanation": "The bisector of ∠A is equidistant from AB and AC; the bisector of ∠B is equidistant from BA and BC. Their intersection is equidistant from all three sides — that's the incenter."
      },
      {
        "formula": "Inradius r = perpendicular distance from I to any side of the triangle.",
        "explanation": "Drop a perpendicular from I to any side (say AB) meeting it at F; IF = r. The inscribed circle has centre I and radius r."
      },
      {
        "formula": "Area of △ABC = r × s, where s = (a + b + c)/2 (semi-perimeter).",
        "explanation": "This formula is useful for calculating r when the sides are known; in constructions we measure r directly."
      }
    ],
    "name": "Inscribed Circle of a Triangle",
    "prerequisite_knowledge": [
      "Angle bisector construction — bisecting a given angle with compass and ruler.",
      "Incenter of a triangle — intersection of the three angle bisectors.",
      "Every point on the angle bisector of ∠A is equidistant from the two sides AB and AC.",
      "Perpendicular from a point to a line — construction technique.",
      "Radius of inscribed circle = perpendicular distance from the incenter to any side."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "An inscribed circle fits perfectly inside the triangle, touching all three sides. Its centre, the incenter, is the one point that is the same distance from all three sides. The angle bisectors 'remember' how far each side is — so their crossing is the equidistant point.",
        "hook": "Packing the largest possible circular coin inside a triangular frame — the coin's centre is exactly the incenter. Engineers computing the largest circular cross-section that fits inside a triangular structural member use precisely this construction.",
        "real_world_anchors": [
          "The Steiner inellipse problem in geometry — the inscribed circle is the simplest special case.",
          "Packing circles inside polygonal shapes in manufacturing — finding the largest circle that fits.",
          "Navigation: the incircle of a sail's triangular shape determines the circular drum size for furling.",
          "Logo design: fitting a circular badge inside a triangular shield."
        ],
        "the_pivot_idea": "Just as the circumcenter uses 'equidistant from vertices', the incenter uses 'equidistant from sides'. The tool that creates equidistance from two lines is the angle bisector (not the perpendicular bisector).",
        "wrong_intuitions_to_replace": [
          "'The incircle passes through the vertices.' — Wrong; the incircle TOUCHES (is tangent to) the sides; it passes through no vertex.",
          "'I use perpendicular bisectors for the incircle.' — Wrong; perpendicular bisectors give the circumcircle. The incircle needs ANGLE BISECTORS.",
          "'I need all three angle bisectors.' — Two are enough; the third always passes through the same incenter."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Why the angle bisectors meet at a point equidistant from all three sides",
        "step_by_step": [
          "Let I = intersection of angle bisectors of ∠A and ∠B in △ABC.",
          "I lies on bisector of ∠A ⟹ d(I, AB) = d(I, AC)  [equidistant from sides AB and AC].",
          "I lies on bisector of ∠B ⟹ d(I, BA) = d(I, BC)  [equidistant from sides BA and BC].",
          "Note d(I, AB) = d(I, BA) (same side). So d(I, AC) = d(I, AB) = d(I, BC).",
          "I is equidistant from all three sides; the common distance is the inradius r.",
          "The circle with centre I and radius r is tangent to all three sides — the incircle."
        ],
        "key_insight": "Perpendicular bisectors encode 'equal distance from points'; angle bisectors encode 'equal distance from lines'. Switching from circumcircle to incircle is literally switching from one type of equidistance to the other."
      },
      "worked_example": {
        "problem": "Construct triangle PQR with PQ = 5 cm, QR = 6 cm, RP = 4.5 cm. Draw the inscribed circle.",
        "solution_steps": [
          "Draw QR = 6 cm.",
          "Arc 5 cm from Q and arc 4.5 cm from R: intersection = P. Draw triangle PQR.",
          "Bisect ∠Q: draw arc from Q cutting QR at A and QP at B (equal radii); arc from A and B intersect at C; QC bisects ∠Q.",
          "Bisect ∠R: similarly, draw the bisector of ∠R.",
          "Label intersection of the two bisectors as I (incenter).",
          "From I, drop a perpendicular to QR: this is the inradius r.",
          "Draw circle with centre I and radius r.",
          "Verification: the circle should touch all three sides PQ, QR, RP. ✓"
        ],
        "final_answer": "The inscribed circle (incircle) has centre I and touches all three sides of △PQR.",
        "verification": "Measure the perpendicular distance from I to each side — all three should equal r."
      },
      "visual_description": {
        "diagram_description": "Triangle PQR. Dashed angle bisectors from Q and R, meeting at incenter I inside the triangle. Perpendicular from I to QR marked with foot F and right-angle symbol. Incircle (dashed) tangent to all three sides.",
        "key_visual_elements": [
          "Triangle PQR in solid lines.",
          "Angle bisectors from Q and R dashed, meeting at I.",
          "Perpendicular IF from I to QR with right-angle symbol at F.",
          "Incircle drawn with dashed arc through the three tangency points."
        ],
        "color_coding": "Triangle black; angle bisectors green dashed; incircle blue dashed; incenter I and tangency points in orange."
      },
      "svg_diagrams": [
        {
          "title": "Incircle Construction",
          "svg_description": "Triangle: P at (220,120), Q at (140,280), R at (300,280). Angle bisector from Q goes to approx (260,200). Angle bisector from R goes to approx (195,200). Incenter I ≈ (220,235). Perpendicular from I to QR (horizontal base) at F=(220,280). Circle centred at I, radius 45 px, touching all three sides."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Using perpendicular bisectors of sides instead of angle bisectors, getting the circumcenter instead of the incenter.",
          "correction": "Incircle = angle bisectors. Remember: IN-circle → IN-side equidistance → angle bisectors. CIRCUMcircle → vertex equidistance → perpendicular bisectors."
        },
        {
          "mistake": "Drawing the incircle radius to a vertex instead of perpendicular to a side.",
          "correction": "The inradius is perpendicular to a SIDE, not a vertex. The circle is tangent to the sides, not passing through the vertices."
        },
        {
          "mistake": "The incircle and circumcircle have the same centre.",
          "correction": "They share the same centre only in equilateral triangles. In general triangles, circumcenter and incenter are different points."
        }
      ],
      "shortcuts_and_tricks": [
        "Memory trick: IN-circle uses IN-gle (angle) bisectors; CIRCUM-circle uses PERPendicular bisectors of sides.",
        "After drawing the incircle, check that it touches all three sides by verifying the three perpendicular distances from I to the sides are equal.",
        "For an equilateral triangle: incenter = circumcenter = centroid = orthocentre — all four centres coincide."
      ],
      "when_to_use_this_method": [
        "'Inscribe a circle in triangle ABC' or 'draw the largest circle inside triangle ABC'.",
        "Problems asking for the inradius r and giving the sides and area: use r = Area / s.",
        "Locus questions: 'find the locus of points equidistant from all three sides of a triangle' — the answer is the incenter."
      ],
      "edge_cases": [
        "Every non-degenerate triangle has exactly one incircle.",
        "For a right triangle, the inradius formula gives r = (a + b − c)/2 where c is the hypotenuse — a useful mental shortcut.",
        "An equilateral triangle of side a has incenter = centroid; r = a/(2√3) and R = a/√3; note R = 2r for equilateral triangles."
      ],
      "key_takeaway": "Incircle construction: bisect any two angles, find their intersection I, drop a perpendicular from I to any side to get radius r, draw the circle. The circle touches all three sides; it passes through no vertex. Memory: IN = angle bisectors; CIRCUM = perpendicular bisectors.",
      "video_script_hooks": [
        "Opening: 'I want the biggest circle that fits inside this triangle — perfectly touching all three sides. One construction, four steps.'",
        "Mid-lesson: 'Angle bisectors find points equidistant from LINES; perpendicular bisectors find points equidistant from POINTS. That's the only difference between inscribed and circumscribed.'",
        "Closing: 'Check: does the circle kiss all three sides without crossing any of them? If yes — perfect incircle.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch19_constructions_tangents",
    "chapterNumber": 19,
    "key_formulas": [
      {
        "formula": "To draw tangents from external point P to circle (centre O, radius r): find M = midpoint of PO; draw circle with centre M, radius MO; it cuts the given circle at T₁ and T₂; PT₁ and PT₂ are the tangents.",
        "explanation": "The auxiliary circle is the locus of right-angle vertices over diameter PO. Since OT₁ ⊥ PT₁ (tangent–radius), T₁ lies on this locus — exactly the intersection of the two circles."
      },
      {
        "formula": "Tangent length PT = √(PO² − r²).",
        "explanation": "In right triangle OTP, OT = r, OP = PO, so PT² = PO² − r² by Pythagoras."
      },
      {
        "formula": "Two tangents from the same external point are equal: PT₁ = PT₂.",
        "explanation": "Both right triangles OT₁P and OT₂P are congruent (RHS: OT₁ = OT₂ = r, OP common), so PT₁ = PT₂."
      }
    ],
    "name": "Construction of Tangents from an External Point",
    "prerequisite_knowledge": [
      "Tangent to a circle is perpendicular to the radius at the point of contact: OT ⊥ PT.",
      "Angle in a semicircle = 90°: any point on a semicircle sees the diameter at 90°.",
      "Perpendicular bisector construction and midpoint of a segment.",
      "Angle bisector construction.",
      "Tangent length: PT = √(PO² − r²) where P is the external point, O the centre, r the radius."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "To draw a tangent from P to a circle, you need to find the exact point T on the circle where OT ⊥ PT. The trick: T must see the segment OP at a right angle — and the locus of all right-angle-over-PO points is a circle on PO as diameter. Where that locus-circle meets the given circle, that's exactly your tangent point.",
        "hook": "Imagine shining a laser from P towards a circular mirror. The beam that just grazes the edge without entering the circle is the tangent. Constructing it exactly requires finding that grazing point — and this construction does it in four elegant steps.",
        "real_world_anchors": [
          "A belt wrapped around a circular pulley — the straight sections of belt are tangent lines from the two outer pulleys.",
          "The path of a satellite orbiting Earth and the moment it reaches escape velocity (a tangential departure from circular orbit).",
          "A ball rolling off a circular track flies off along the tangent direction.",
          "Construction of tangent in engineering drawing for cam profiles and gear teeth."
        ],
        "the_pivot_idea": "The angle in a semicircle is 90° — this single theorem drives the entire construction. The tangent point T must subtend 90° over PO, so T lies on the circle with PO as diameter.",
        "wrong_intuitions_to_replace": [
          "'I just draw a line from P that looks tangential.' — Appearance is not good enough; the construction must be exact.",
          "'I need to measure the angle OTP to check if it's 90°.' — The construction guarantees it is 90°; no angle measurement needed.",
          "'Only one tangent can be drawn from an external point.' — Two tangents are always possible (and equal in length) from an external point."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Why the semicircle-based construction gives the correct tangent point",
        "step_by_step": [
          "Given: circle with centre O, radius r. External point P, with PO > r.",
          "Draw M = midpoint of PO. Draw auxiliary circle with centre M and radius MO (= MP = PO/2).",
          "The auxiliary circle passes through both O and P (since MO = MP = radius).",
          "Let T be a point of intersection of the two circles. Then OT = r (on original circle) and MT = MO = PO/2 (on auxiliary circle).",
          "Since T lies on the auxiliary circle with PO as diameter, by the angle-in-semicircle theorem, ∠OTP = 90°.",
          "∠OTP = 90° means OT ⊥ PT, which is exactly the condition for PT to be a tangent.",
          "Therefore PT is a tangent from P to the original circle, touching at T. Similarly for the second intersection T₂."
        ],
        "key_insight": "The auxiliary circle doesn't guess the tangent — it IS the locus of all points from which PO subtends 90°. Intersecting it with the given circle yields the exact tangent points."
      },
      "worked_example": {
        "problem": "Construct tangents from external point P to a circle of radius 3 cm, given that PO = 7 cm. Measure and verify the tangent length.",
        "solution_steps": [
          "Draw circle with centre O, radius 3 cm.",
          "Mark external point P such that PO = 7 cm.",
          "Find midpoint M of PO (use perpendicular bisector construction, or measure 3.5 cm from P).",
          "Draw auxiliary circle: centre M, radius MO = 3.5 cm.",
          "Mark the two points T₁ and T₂ where the auxiliary circle intersects the original circle.",
          "Draw PT₁ and PT₂ — these are the required tangents.",
          "Verification: Measure PT₁ = PT₂ ≈ √(7² − 3²) = √(49 − 9) = √40 ≈ 6.32 cm ✓",
          "Check ∠OT₁P with protractor ≈ 90° ✓"
        ],
        "final_answer": "Tangent length PT = √40 = 2√10 ≈ 6.32 cm. Both tangents are equal.",
        "verification": "Measure PT₁ and PT₂ with ruler; both should be 6.3 cm (±0.1 cm). Angle at T₁ should be 90°."
      },
      "visual_description": {
        "diagram_description": "Original circle (centre O, radius 3 cm) on the left. Point P on the right at distance 7 cm. Midpoint M between O and P. Dashed auxiliary circle centred at M passing through O and P. Two tangent lines PT₁ and PT₂ from P touching the original circle.",
        "key_visual_elements": [
          "Original circle in solid line; auxiliary circle dashed.",
          "O, M, P collinear on a horizontal line.",
          "T₁ above and T₂ below, each marked with a right-angle symbol (OT ⊥ PT).",
          "Tangent lines PT₁ and PT₂ in bold."
        ],
        "color_coding": "Original circle blue; auxiliary circle green dashed; tangent lines red; right angles in orange."
      },
      "svg_diagrams": [
        {
          "title": "Tangent from External Point Construction",
          "svg_description": "Original circle: centre O at (150,200), radius 60. Point P at (330,200). Midpoint M at (240,200). Auxiliary circle: centre (240,200), radius 90 (passes through O and P). Intersections T₁ ≈ (202,148), T₂ ≈ (202,252). Lines PT₁ and PT₂ drawn from P. Right-angle markers at T₁ and T₂."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Making the auxiliary circle with radius OP (too large) instead of OP/2.",
          "correction": "The auxiliary circle has centre M (midpoint of OP) and radius MO = MP = OP/2, not OP."
        },
        {
          "mistake": "Marking T as any intersection of the two circles and drawing OT extended rather than PT.",
          "correction": "The tangent is the line from the EXTERNAL POINT P through T, not from O."
        },
        {
          "mistake": "Drawing only one tangent — forgetting T₂.",
          "correction": "The two circles intersect at two points T₁ and T₂, giving two equal tangents. Both must be drawn."
        },
        {
          "mistake": "Choosing P inside the circle, where no tangent exists.",
          "correction": "The construction only works when P is outside the circle (PO > r); if P is on or inside the circle, the method breaks down."
        }
      ],
      "shortcuts_and_tricks": [
        "Calculate PT = √(PO² − r²) first — then measure it from your finished construction to verify accuracy.",
        "The kite OAPB (where A and B are the two tangent points) has ∠OAP = ∠OBP = 90° and OA = OB — useful for angle calculations in follow-up questions.",
        "∠APB + ∠AOB = 180° (the kite property of tangents from an external point)."
      ],
      "when_to_use_this_method": [
        "Any question: 'Draw tangents from point P to a circle of radius r, given PO = d cm.'",
        "As part of larger constructions where tangent lines form the boundary of geometric figures.",
        "Finding the length of a tangent when radii and distances are given (Pythagoras, no construction needed)."
      ],
      "edge_cases": [
        "When P is ON the circle (PO = r): only one tangent exists (the tangent at P). The auxiliary circle degenerates.",
        "When P is INSIDE the circle (PO < r): no real tangent exists. The auxiliary circle doesn't intersect the given circle.",
        "When two circles are given: a 'common external tangent' or 'common internal tangent' uses the same principle extended."
      ],
      "key_takeaway": "Tangent-from-external-point is constructed by finding the midpoint M of PO and drawing an auxiliary circle (centre M, radius MO) — its intersections with the original circle are the tangent points. Theoretically grounded in the angle-in-semicircle theorem.",
      "video_script_hooks": [
        "Opening: 'You want to draw a line from P that just grazes this circle. How? Use a second circle — and watch the magic.'",
        "Mid-lesson: 'Why does the auxiliary circle work? Because the angle in a semicircle is always 90° — and that's the exact angle a tangent makes with the radius.'",
        "Closing: 'Two tangents, equal length, both at 90° to the radius. Every time. No guessing.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch20_combined",
    "chapterNumber": 20,
    "key_formulas": [
      {
        "formula": "Combined solid TSA = sum of exposed surfaces (do not count shared/hidden faces).",
        "explanation": "When two solids are joined, the faces at the junction are no longer exposed. Only count the surfaces that are on the outside of the combined shape."
      },
      {
        "formula": "Volume of combined solid = sum of volumes of parts.",
        "explanation": "Volume is additive. Combined volume = V₁ + V₂ regardless of how the solids are joined."
      },
      {
        "formula": "Melting/recasting: V(original) = V(new shapes combined). n × V(small) = V(large).",
        "explanation": "When a solid is melted and recast, volume is conserved. n small cones melted = one cylinder means n × (1/3)πr₁²h₁ = πR²H."
      }
    ],
    "name": "Combined Solids and Volume Conversions",
    "prerequisite_knowledge": [
      "Cylinder: CSA = 2πrh, TSA = 2πr(h+r), Volume = πr²h.",
      "Cone: CSA = πrl, TSA = πr(l+r), Volume = (1/3)πr²h.",
      "Sphere: SA = 4πr², Volume = (4/3)πr³.",
      "Hemisphere: CSA = 2πr², TSA = 3πr², Volume = (2/3)πr³.",
      "Conservation of volume when reshaping/melting a solid."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Combined solids are built by joining two or more basic shapes (cone + cylinder, hemisphere + cone, etc.). Volume always adds — simple. Surface area: the tricky part is that joined faces disappear from the outside. Always picture the final shape and list ONLY the visible surfaces.",
        "hook": "A rocket: cylinder body + cone nose + hemisphere base. To spray-paint it, you need the combined surface area. To check its fuel capacity, you need the combined volume. Real engineering is just this — but with more steps.",
        "real_world_anchors": [
          "An ice cream cone with a hemispherical scoop on top: CSA = hemisphere's curved surface + cone's lateral surface.",
          "A capsule (pharmaceutical): two hemispheres + a cylinder in between.",
          "A pen: cylindrical body + conical cap — TSA is the total visible outer surface.",
          "Melting down old coins (cylinders) to form a single large sphere — conservation of volume."
        ],
        "the_pivot_idea": "Combined TSA = count only the outer visible surfaces. The key question: 'Which faces are inside the combination and therefore hidden?' Those are subtracted/excluded.",
        "wrong_intuitions_to_replace": [
          "'Combined TSA = TSA₁ + TSA₂' — Wrong! Shared/joined faces must be excluded. Add only exposed surfaces.",
          "'Combined volume uses average, not sum' — Volume always adds: V_combined = V₁ + V₂.",
          "'Number of smaller shapes = Volume_large / Volume_small' — This is correct only when volumes are equal and there's no material lost."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Surface area formula for a cone surmounted on a cylinder",
        "step_by_step": [
          "Solid: cylinder (radius r, height H) with cone (same radius r, slant height l) placed on top.",
          "Cylinder's exposed surfaces: CSA (2πrH) and circular base (πr²). The TOP circle of the cylinder is covered by the cone's base — not exposed.",
          "Cone's exposed surface: CSA (πrl). The base of the cone sits on the cylinder's top — not exposed.",
          "Combined TSA = 2πrH + πr² + πrl = πr(2H + r + l).",
          "Combined Volume = πr²H + (1/3)πr²h = πr²(H + h/3) where h = vertical height of cone."
        ],
        "key_insight": "The circular face shared between cylinder's top and cone's base cancels out completely from the TSA — it is counted in neither, being an internal face."
      },
      "worked_example": {
        "problem": "A solid toy is in the form of a hemisphere of radius 3.5 cm surmounted by a cone of the same base and height 4 cm. Find: (i) combined TSA, (ii) volume. (π = 22/7.)",
        "solution_steps": [
          "r = 3.5 cm, h_cone = 4 cm. Slant height of cone: l = √(3.5² + 4²) = √(12.25 + 16) = √28.25 ≈ 5.315 cm. (Use exact: l = √(28.25) = √(113/4) = √113/2.)",
          "Exposed surfaces:",
          "  Hemisphere curved surface: 2πr² = 2×(22/7)×12.25 = 2×22×1.75 = 77 cm².",
          "  Cone lateral surface: πrl = (22/7)×3.5×l = 11×l.",
          "  The flat circular base of hemisphere (facing down): πr² = (22/7)×12.25 = 38.5 cm².",
          "  [The flat circle where cone meets hemisphere is internal — not counted.]",
          "(i) TSA = 77 + 38.5 + 11l. With l = √28.25 ≈ 5.315: TSA ≈ 77 + 38.5 + 58.47 ≈ 173.97 cm².",
          "(ii) Volume = V(hemisphere) + V(cone) = (2/3)πr³ + (1/3)πr²h.",
          "= (1/3)πr²(2r + h) = (1/3)(22/7)(12.25)(7 + 4) = (1/3)(22/7)(12.25)(11) = (1/3)(22)(1.75)(11) = (1/3)(423.5) ≈ 141.17 cm³."
        ],
        "final_answer": "TSA ≈ 174 cm², Volume ≈ 141.2 cm³.",
        "verification": "Hemisphere flat base πr² ≈ 38.5 cm² is the bottom face. The joined circle (at hemisphere top / cone base) is internal — correctly excluded."
      },
      "visual_description": {
        "diagram_description": "Hemisphere (lower half) with cone sitting on top (same radius r). Arrows indicating: exposed CSA of hemisphere, exposed lateral surface of cone, exposed flat base of hemisphere. Shared circle (internal) marked with X (not counted).",
        "key_visual_elements": [
          "Hemisphere (blue)",
          "Cone (orange)",
          "Shared circle marked as 'hidden'",
          "Arrows to each exposed surface"
        ],
        "color_coding": "Hemisphere blue, cone orange, shared face grey (excluded)."
      },
      "svg_diagrams": [
        {
          "title": "Cone on Hemisphere — Surface Area",
          "svg_description": "Hemisphere (lower): semicircle, flat diameter = 2r. Cone on top: apex above, base aligned with hemisphere top. Label '2πr² (exposed)' on hemisphere curve; 'πrl' on cone side; 'πr² (bottom)' on hemisphere flat. Shared circle with dashed outline and '✗ hidden'."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Adding full TSA of each part (including hidden faces).",
          "correction": "Only outer visible surfaces count. The junction face is hidden; exclude it from TSA."
        },
        {
          "mistake": "n small cones melted → n × TSA = TSA of big cone.",
          "correction": "TSA does NOT scale the same way as Volume. Only volumes are conserved on melting; surface areas are not."
        },
        {
          "mistake": "A hemisphere placed on a cylinder: counting the top face of the cylinder as an exposed surface.",
          "correction": "The top face of the cylinder is covered by the hemisphere's base (hidden). Only count: cylinder CSA + cylinder base + hemisphere CSA."
        }
      ],
      "shortcuts_and_tricks": [
        "Always list exposed surfaces in a table before computing. For each part, cross out the faces that are joined/hidden.",
        "Volume melting/recasting shortcut: n = V_large / V_small. Always double-check units.",
        "When hemisphere is on top of cone (or vice versa), the shared circular face disappears from TSA of both — net effect: subtract 2 × πr²? No — just exclude it from both (it contributes zero to the total)."
      ],
      "when_to_use_this_method": [
        "Any 'combined solid' problem: cone + cylinder, hemisphere + cylinder, etc.",
        "'A solid is melted and recast' — equate volumes.",
        "'Find the quantity of material needed to coat the surface' — combined TSA with correct exclusion of joined faces."
      ],
      "edge_cases": [
        "Sphere mounted on a cylinder: shared face = flat circle πr². TSA = 4πr² + 2πrH + πr² − 2πr² = 4πr² + 2πrH − πr² = πr²(3) + 2πrH? Careful: sphere sits on top of cylinder; the circular region where they meet is hidden for BOTH. Sphere's full surface = 4πr²; hemisphere variant varies.",
        "Hollow combined solid: account for thickness/inner surfaces as needed.",
        "If only a partial sphere (cap) is on top: need spherical cap formula (advanced)."
      ],
      "key_takeaway": "Combined solid: Volume = sum of all parts' volumes. TSA = sum of only EXPOSED surfaces (exclude junction faces). Conservation of volume is the key principle in melting/recasting problems.",
      "video_script_hooks": [
        "Opening: 'How do you find the surface area of an ice cream cone with a scoop on top? Same radius, so the circular join is hidden — subtract that circle from both parts.'",
        "Mid-lesson: 'Volume always adds. Surface area: draw the shape, highlight every face you can see from outside, add only those.'",
        "Closing: 'Melting problem? Set up: volume of original = number × volume of one small piece. Solve for the unknown. That's it.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch20_cone",
    "chapterNumber": 20,
    "key_formulas": [
      {
        "formula": "Slant height: l = √(r² + h²)",
        "explanation": "The slant height l, vertical height h, and base radius r form a right triangle: l² = r² + h². Always find l before computing CSA of a cone."
      },
      {
        "formula": "CSA of cone = πrl",
        "explanation": "Unroll the cone into a sector of a circle: arc length = 2πr (base circumference), radius of sector = l. Area of sector = ½ × arc × radius = ½ × 2πr × l = πrl."
      },
      {
        "formula": "TSA of cone = πrl + πr² = πr(l + r)",
        "explanation": "TSA = CSA + circular base = πrl + πr². Factor: πr(l + r)."
      },
      {
        "formula": "Volume of cone = (1/3)πr²h",
        "explanation": "A cone fits exactly inside a cylinder of same base and height, taking up one-third of the volume. Volume = (1/3) × πr²h."
      }
    ],
    "name": "Surface Area and Volume of a Cone",
    "prerequisite_knowledge": [
      "Pythagoras theorem: l² = r² + h² relates slant height l to radius r and height h.",
      "Area of a circle = πr²; circumference = 2πr.",
      "Concept of slant height as the distance along the slanted surface from apex to base edge.",
      "Volume of cylinder = πr²h (cone = 1/3 of a cylinder with same base and height)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A cone is 1/3 of a cylinder. Its curved surface unrolls into a sector — arc length = base circumference (2πr), radius = slant height l. Slant height is found by Pythagoras: l = √(r²+h²). Memorise: πrl for curved, 1/3 πr²h for volume.",
        "hook": "An ice cream cone, a party hat, a volcano — all cones. The 1/3 factor is a beautiful result: three identical cones fill one cylinder. Ancient Greeks proved this without calculus.",
        "real_world_anchors": [
          "Volume of sand in a conical pile (used in construction site estimates).",
          "The conical shape of a volcano or anthill — surface area calculation for cover/coat estimates.",
          "Conical paper cups: the material needed = CSA = πrl.",
          "A funnel: the narrowing shape is a truncated cone (frustum)."
        ],
        "the_pivot_idea": "Volume of cone = 1/3 × Volume of cylinder (same base and height). The factor 1/3 is non-obvious — it comes from integration (or from the classic experimental pouring demonstration).",
        "wrong_intuitions_to_replace": [
          "'CSA = πrh' (confusing with cylinder) — For cone it is πrl (uses SLANT height, not vertical height).",
          "'Volume = (1/3)πr²l' — Volume uses vertical height h, not slant height l. Use h in volume, l in CSA.",
          "'l = r + h' — Not a sum but √(r²+h²) by Pythagoras."
        ]
      },
      "derivation": {
        "what_we_are_proving": "CSA of cone = πrl",
        "step_by_step": [
          "Take a cone of base radius r and slant height l.",
          "Cut along a slant line and unroll the curved surface — you get a sector of a circle.",
          "The sector's radius = l (slant height of cone).",
          "The arc length of the sector = circumference of cone's base = 2πr.",
          "Area of sector = ½ × arc length × radius = ½ × 2πr × l = πrl. This is the CSA."
        ],
        "key_insight": "Arc of the sector = circumference of the base. This connection between the unrolled sector and the base is the key insight."
      },
      "worked_example": {
        "problem": "A cone has base radius 6 cm and height 8 cm. Find: (i) slant height, (ii) CSA, (iii) TSA, (iv) volume. (π = 22/7 — use 3.14 if 22/7 gives messy numbers.)",
        "solution_steps": [
          "r = 6 cm, h = 8 cm.",
          "(i) l = √(r² + h²) = √(36 + 64) = √100 = 10 cm.",
          "(ii) CSA = πrl = π × 6 × 10 = 60π ≈ 60 × 3.14 = 188.4 cm².",
          "(iii) TSA = πr(l + r) = π × 6 × (10 + 6) = 96π ≈ 301.4 cm².",
          "(iv) Volume = (1/3)πr²h = (1/3) × π × 36 × 8 = 96π ≈ 301.4 cm³.",
          "Note: TSA (cm²) and Volume (cm³) both equal 96π numerically — a coincidence of this problem's numbers, not a general rule."
        ],
        "final_answer": "l = 10 cm, CSA = 60π cm², TSA = 96π cm², Volume = 96π cm³.",
        "verification": "Check l with 6-8-10 Pythagorean triple ✓. Use exact π form for cleaner answers."
      },
      "visual_description": {
        "diagram_description": "Cone: apex at top, base circle at bottom. Vertical height h from apex to base centre, slant height l from apex to base edge (as hypotenuse of right triangle). Unrolled sector beside it with arc = 2πr and radius = l.",
        "key_visual_elements": [
          "Cone with h (vertical, dashed) and l (slant, solid) labelled",
          "Right triangle (r, h, l) inset",
          "Unrolled sector with arc = 2πr"
        ],
        "color_coding": "Cone blue; r in orange, h in green, l in red; sector in purple."
      },
      "svg_diagrams": [
        {
          "title": "Cone and Unrolled Sector",
          "svg_description": "Cone: apex at top, base ellipse. Dashed line for h (vertical), solid l (slant). Inset right triangle: legs r and h, hypotenuse l. Sector (right): radius l, arc length 2πr labelled."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Using h instead of l in CSA = πrh.",
          "correction": "Cone CSA uses SLANT height l (find via Pythagoras first). Cylinder CSA uses height h."
        },
        {
          "mistake": "Forgetting to find l before calculating CSA when only r and h are given.",
          "correction": "Always check: if h and r are given but not l, compute l = √(r²+h²) first."
        },
        {
          "mistake": "Volume = πr²h (forgetting the 1/3).",
          "correction": "Cone volume = (1/3)πr²h. The cone is 1/3 of the circumscribed cylinder."
        }
      ],
      "shortcuts_and_tricks": [
        "If r and h form a Pythagorean pair (e.g., 3-4-5, 5-12-13, 6-8-10), slant height is a clean integer — spot this first.",
        "Cone volume = 1/3 × corresponding cylinder volume (same r and h). Useful for quick ratio questions.",
        "When converting between cones: new shape volume = number of cones × (1/3)πr²h."
      ],
      "when_to_use_this_method": [
        "'Find the material used to make a conical tent' → CSA = πrl (no base needed).",
        "'Find the capacity of a conical vessel' → Volume = (1/3)πr²h.",
        "'A cone is melted and recast as a cylinder' → equate volumes."
      ],
      "edge_cases": [
        "Right circular cone vs oblique cone: ICSE only deals with right circular cones (apex directly above the centre of the base).",
        "If l is given instead of h: h = √(l² − r²).",
        "Frustum of a cone (truncated cone): CSA = π(R + r)l, Volume = (πh/3)(R² + Rr + r²) — not core ICSE 10 but sometimes appears."
      ],
      "key_takeaway": "Cone formulas: l = √(r²+h²), CSA = πrl, TSA = πr(l+r), Volume = (1/3)πr²h. Critical: use l in CSA/TSA, use h in Volume. The 1/3 is the signature of a cone.",
      "video_script_hooks": [
        "Opening: 'Three cones can fill one cylinder of the same size. That's where the 1/3 comes from — and it's one of the most beautiful facts in mensuration.'",
        "Mid-lesson: 'Two formulas use slant height l: CSA and TSA. One uses vertical height h: Volume. Don't mix them up.'",
        "Closing: 'l = √(r²+h²) → CSA = πrl → TSA = πr(l+r) → V = ⅓πr²h. Four steps, always in this order.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch20_cylinder",
    "chapterNumber": 20,
    "key_formulas": [
      {
        "formula": "Curved Surface Area (CSA) of cylinder = 2πrh",
        "explanation": "Imagine unrolling the curved surface into a rectangle: width = circumference = 2πr, height = h. Area = 2πrh."
      },
      {
        "formula": "Total Surface Area (TSA) of cylinder = 2πr(h + r) = 2πrh + 2πr²",
        "explanation": "TSA = CSA + 2 circular bases = 2πrh + 2(πr²). Factor: 2πr(h + r)."
      },
      {
        "formula": "Volume of cylinder = πr²h",
        "explanation": "Volume = base area × height = πr² × h."
      }
    ],
    "name": "Surface Area and Volume of a Cylinder",
    "prerequisite_knowledge": [
      "Area of a circle = πr² ; circumference = 2πr.",
      "Concept of curved surface, flat (base) surface, and total surface area.",
      "Concept of volume as the amount of space a solid occupies.",
      "Conversion between units: 1 litre = 1000 cm³; 1 m³ = 10⁶ cm³.",
      "π ≈ 22/7 or 3.14159 — use 22/7 unless told otherwise in ICSE problems."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A cylinder is just a circle stacked up to height h. Its curved surface unrolls into a rectangle (length = circumference, height = h), making the curved area = 2πrh obvious. The volume is base area × height = πr²h.",
        "hook": "A tin of paint, a pipe, a water tank — cylinders are everywhere in engineering. Getting the surface area right tells you how much sheet metal you need; getting the volume right tells you the capacity.",
        "real_world_anchors": [
          "A soft drink can: CSA is the label, TSA is the total material including the two circular caps.",
          "A water pipe: volume per unit length = πr² (cross-sectional area × length).",
          "Painting the outside of a cylindrical tank: CSA + base (if on the ground, only one base).",
          "Rolling of metal sheet into cylindrical tubes in manufacturing."
        ],
        "the_pivot_idea": "Curved surface = rectangle (when 'unrolled'): length = 2πr, height = h. This visual makes the formula impossible to forget.",
        "wrong_intuitions_to_replace": [
          "'TSA = 2πrh + πr²' — the wrong formula forgets there are TWO circular bases. TSA = 2πrh + 2πr².",
          "'Volume = 2πr²h' — confusing with the TSA. Volume = πr²h (just one base area × height).",
          "'r is the diameter, not radius' — a very common error; always halve the diameter first."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Curved Surface Area formula: CSA = 2πrh",
        "step_by_step": [
          "Take a cylinder with base radius r and height h.",
          "Cut the cylinder along a vertical line and unroll the curved surface.",
          "You get a rectangle: width = circumference of circular base = 2πr; height = h of cylinder.",
          "Area of this rectangle = width × height = 2πr × h = 2πrh. This is the CSA.",
          "Add two circular bases (each = πr²): TSA = 2πrh + 2πr² = 2πr(h + r). QED."
        ],
        "key_insight": "Unrolling transforms a 3D curved problem into a 2D rectangle problem. The key link is: circumference of base = length of the rectangle."
      },
      "worked_example": {
        "problem": "A solid cylinder has radius 7 cm and height 20 cm. Find: (i) CSA, (ii) TSA, (iii) volume. (Use π = 22/7.)",
        "solution_steps": [
          "r = 7 cm, h = 20 cm, π = 22/7.",
          "(i) CSA = 2πrh = 2 × (22/7) × 7 × 20 = 2 × 22 × 20 = 880 cm².",
          "(ii) TSA = 2πr(h + r) = 2 × (22/7) × 7 × (20 + 7) = 2 × 22 × 27 = 1188 cm².",
          "(iii) Volume = πr²h = (22/7) × 7 × 7 × 20 = 22 × 7 × 20 = 3080 cm³."
        ],
        "final_answer": "CSA = 880 cm², TSA = 1188 cm², Volume = 3080 cm³.",
        "verification": "Quick check: r = 7 cancels neatly with 22/7, giving 22 × integer — a sign the numbers are designed for 22/7."
      },
      "visual_description": {
        "diagram_description": "A right circular cylinder: two circles (top and bottom) connected by a curved surface. Labels r (radius of base) and h (height). An 'unrolled' rectangle beside it showing width = 2πr and height = h.",
        "key_visual_elements": [
          "Cylinder with dotted top circle",
          "Arrow from curved surface to rectangle (unrolled)",
          "Labels r, h, 2πr, CSA rectangle"
        ],
        "color_coding": "Cylinder blue; unrolled rectangle green; base circles orange."
      },
      "svg_diagrams": [
        {
          "title": "Cylinder and Unrolled Surface",
          "svg_description": "Cylinder (left): two ellipses top and bottom, vertical lines. r arrow on top, h arrow on side. Rectangle (right): width labelled 2πr, height h, area 2πrh."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Using diameter instead of radius in the formula.",
          "correction": "Always halve the given diameter. r = d/2 before substituting."
        },
        {
          "mistake": "TSA = 2πrh + πr² (only one base).",
          "correction": "A closed cylinder has TWO bases: TSA = 2πrh + 2πr². An open cylinder (like a pipe) has CSA = 2πrh only."
        },
        {
          "mistake": "Volume = 2πr²h (copying the '2' from CSA).",
          "correction": "Volume = πr²h. The '2' appears in CSA and TSA formulas, not volume."
        }
      ],
      "shortcuts_and_tricks": [
        "When r = 7 and π = 22/7: πr² = 22/7 × 49 = 154 (memorise); πr²h = 154h.",
        "CSA ratio to volume: CSA/V = 2/r. Larger r → smaller surface-to-volume ratio.",
        "Unit check: area in cm², volume in cm³. Forgetting to cube/square the units is a common source of errors."
      ],
      "when_to_use_this_method": [
        "Any 'find the area of metal sheet used to make a cylinder' → TSA (closed) or CSA (open tube).",
        "'How much water does the cylinder hold?' → Volume.",
        "'How much paint to cover the outside?' → CSA (if open) or TSA (if closed)."
      ],
      "edge_cases": [
        "Hollow cylinder (pipe): CSA = 2π(R + r)h (inner + outer) where R = outer radius, r = inner radius.",
        "Open cylinder (top removed): TSA = CSA + one base = 2πrh + πr².",
        "When h = 0: the cylinder degenerates to a flat circle (disk)."
      ],
      "key_takeaway": "Cylinder: CSA = 2πrh (unrolled rectangle), TSA = 2πr(h+r), Volume = πr²h. The r-cancellation trick with π = 22/7 is the key to quick calculation.",
      "video_script_hooks": [
        "Opening: 'I'm going to cut this tin can and unroll it. Guess what shape I'll get? A rectangle — and its area is exactly the formula for CSA.'",
        "Mid-lesson: 'TSA, CSA, Volume — three different questions, three different formulas. The trick is knowing which one the problem is asking for.'",
        "Closing: 'The three formulas for a cylinder: CSA = 2πrh, TSA = 2πr(h+r), V = πr²h. Write these in one line and never forget them.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch20_sphere",
    "chapterNumber": 20,
    "key_formulas": [
      {
        "formula": "Surface Area of sphere = 4πr²",
        "explanation": "A sphere's surface area equals 4 circles of radius r. Archimedes proved it equals the curved surface of the circumscribed cylinder (height = 2r): 2πr × 2r = 4πr²."
      },
      {
        "formula": "Volume of sphere = (4/3)πr³",
        "explanation": "Archimedes: sphere volume = 2/3 × volume of circumscribed cylinder = (2/3) × πr² × 2r = (4/3)πr³."
      },
      {
        "formula": "Curved Surface Area (CSA) of hemisphere = 2πr²",
        "explanation": "Hemisphere = half sphere. Half of 4πr² = 2πr²."
      },
      {
        "formula": "Total Surface Area (TSA) of hemisphere = 3πr²",
        "explanation": "TSA = CSA + flat circular base = 2πr² + πr² = 3πr²."
      },
      {
        "formula": "Volume of hemisphere = (2/3)πr³",
        "explanation": "Half the sphere: (1/2) × (4/3)πr³ = (2/3)πr³."
      }
    ],
    "name": "Surface Area and Volume of Sphere and Hemisphere",
    "prerequisite_knowledge": [
      "Area of a circle = πr²; circumference = 2πr.",
      "Volume of cylinder = πr²h (sphere formula relates to a cylinder of height 2r).",
      "The number π ≈ 22/7.",
      "Concept of a hemisphere as exactly half a sphere.",
      "How to compute cube and square of fractions and decimals."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "A sphere's surface area = 4πr² = 4 circles. Its volume = (4/3)πr³. A hemisphere gets half the volume, half the curved area, but adds a flat base. The key insight: surface area grows as r², volume as r³ — so larger spheres are more volume-efficient.",
        "hook": "Archimedes proved that a sphere fits inside a cylinder (height = diameter, radius = r) and takes up exactly 2/3 of the cylinder's volume. He considered this his greatest discovery and asked for the diagram on his tomb.",
        "real_world_anchors": [
          "A football: surface area determines the material needed; volume determines the air it holds.",
          "Water tanks in the shape of a sphere: maximum volume for minimum surface area.",
          "A dome (hemisphere): the TSA includes the curved top and the flat circular floor.",
          "Planets and stars: why gravity makes massive objects spherical."
        ],
        "the_pivot_idea": "4πr² = area of four circles, each of radius r. This is the most elegant way to remember the sphere formula — four circles 'cover' the sphere.",
        "wrong_intuitions_to_replace": [
          "'Hemisphere TSA = 2πr² (just half of sphere)' — Wrong. The flat base (πr²) must be added: TSA = 3πr².",
          "'Volume = (2/3)πr² h' — The sphere formula has r³, not r²h. Volume = (4/3)πr³.",
          "'CSA of hemisphere = πr²' — Half of 4πr² = 2πr². The CSA is 2πr², not πr²."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Volume of sphere = (4/3)πr³ using the hemisphere-cone-cylinder relationship",
        "step_by_step": [
          "Consider a cylinder of radius r, height r (Archimedes' key cylinder).",
          "A hemisphere of radius r fits inside this cylinder.",
          "A cone of radius r and height r also fits inside the cylinder with vertex at the top.",
          "Cavalieri's principle: at height y, the cross-sectional area of (hemisphere + cone) = cross-sectional area of the cylinder: π(r² − y²) + πy² = πr². ✓",
          "∴ Volume(hemisphere) + Volume(cone) = Volume(cylinder).",
          "V(cone) = (1/3)πr³. V(cylinder with h=r) = πr³.",
          "V(hemisphere) = πr³ − (1/3)πr³ = (2/3)πr³.",
          "V(sphere) = 2 × V(hemisphere) = 2 × (2/3)πr³ = (4/3)πr³. QED."
        ],
        "key_insight": "The hemisphere + cone = cylinder at every horizontal slice (Cavalieri). This eliminates calculus from the proof and gives an elegant result."
      },
      "worked_example": {
        "problem": "A solid sphere has radius 21 cm. Find: (i) surface area, (ii) volume. (π = 22/7.)",
        "solution_steps": [
          "r = 21 cm, π = 22/7.",
          "(i) Surface area = 4πr² = 4 × (22/7) × 21² = 4 × (22/7) × 441 = 4 × 22 × 63 = 5544 cm².",
          "(ii) Volume = (4/3)πr³ = (4/3) × (22/7) × 21³ = (4/3) × (22/7) × 9261.",
          "= (4/3) × 22 × 1323 = (4/3) × 29106 = 4 × 9702 = 38808 cm³."
        ],
        "final_answer": "Surface area = 5544 cm², Volume = 38808 cm³.",
        "verification": "r = 21 = 3 × 7, so 21²/7 = 63 and 21³/7 = 1323 — the 7 in π=22/7 cancels cleanly ✓."
      },
      "visual_description": {
        "diagram_description": "Full sphere with radius r labelled. Hemisphere beside it with CSA (curved part) = 2πr² and flat base = πr² labelled. Summary table: Sphere vs Hemisphere for SA and Volume.",
        "key_visual_elements": [
          "Full sphere with radius r",
          "Hemisphere showing both curved and flat surfaces",
          "Formulas alongside each shape"
        ],
        "color_coding": "Sphere blue; hemisphere: curved = orange, flat base = green."
      },
      "svg_diagrams": [
        {
          "title": "Sphere and Hemisphere",
          "svg_description": "Sphere (left): circle with dotted equator, radius r labelled, 4πr² annotated. Hemisphere (right): semicircle with flat diameter base, 2πr² (curved) and πr² (base) annotated, TSA = 3πr² below."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Hemisphere TSA = 2πr² (forgetting the flat circular base).",
          "correction": "TSA of closed hemisphere = CSA + base = 2πr² + πr² = 3πr²."
        },
        {
          "mistake": "Surface area of sphere = 2πr² (half the right answer).",
          "correction": "Surface area of full sphere = 4πr², not 2πr²."
        },
        {
          "mistake": "Volume of sphere = (4/3)πr²h (treating like cylinder).",
          "correction": "Sphere has no 'h'; Volume = (4/3)πr³ — everything in terms of r."
        }
      ],
      "shortcuts_and_tricks": [
        "r = 7: πr² = 154, 4πr² = 616, (4/3)πr³ = (4/3)×(22/7)×343 = 1437⅓ — these are ICSE standard values to memorise.",
        "Ratio trick: if radius doubles, surface area × 4, volume × 8.",
        "Hemisphere TSA vs sphere surface: sphere = 4πr², hemisphere TSA = 3πr² = (3/4) of sphere surface."
      ],
      "when_to_use_this_method": [
        "'Find the material to make a spherical ball' → 4πr² (full sphere surface).",
        "'Find the material to make a hemispherical bowl' → TSA of hemisphere = 3πr² (including base) or CSA = 2πr² (without base).",
        "'Find the volume of a hemispherical tank' → (2/3)πr³."
      ],
      "edge_cases": [
        "A hollow sphere: requires both outer radius R and inner radius r. Volume of material = (4/3)π(R³ − r³).",
        "A solid hemisphere mounted on a cylinder: TSA = curved hemisphere (2πr²) + CSA of cylinder (2πrh) + base circle (πr²) — no flat circle between the two since they share a face.",
        "Spherical shell: surface area refers to the outer surface only (unless specifically asked for both surfaces)."
      ],
      "key_takeaway": "Sphere: SA = 4πr², Volume = (4/3)πr³. Hemisphere: CSA = 2πr², TSA = 3πr², Volume = (2/3)πr³. The 4:1 ratio (sphere SA = 4 circles) and the 4/3 factor are the two numbers to keep fixed in memory.",
      "video_script_hooks": [
        "Opening: 'The surface area of a sphere equals exactly four circles of the same radius. Archimedes proved this over 2000 years ago — and it's still the most elegant formula in mensuration.'",
        "Mid-lesson: 'When you cut a sphere in half, the volume halves. But the surface area: you get half the curved part PLUS a new flat circle. That's why hemisphere TSA is 3πr², not 2πr².'",
        "Closing: 'Sphere: 4πr², (4/3)πr³. Hemisphere: 3πr² (TSA), (2/3)πr³. Lock these in and you're done with spheres.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch21_trig_identities_basic",
    "chapterNumber": 21,
    "key_formulas": [
      {
        "formula": "sin²θ + cos²θ = 1  (Pythagorean Identity 1)",
        "explanation": "Divide Pythagoras theorem (opp² + adj² = hyp²) by hyp². Direct consequence of the definition of sin and cos."
      },
      {
        "formula": "1 + tan²θ = sec²θ  (Pythagorean Identity 2)",
        "explanation": "Divide sin²θ + cos²θ = 1 by cos²θ. Gives a relation between tan and sec."
      },
      {
        "formula": "1 + cot²θ = cosec²θ  (Pythagorean Identity 3)",
        "explanation": "Divide sin²θ + cos²θ = 1 by sin²θ. Gives a relation between cot and cosec."
      },
      {
        "formula": "Derived: sin²θ = 1 − cos²θ; cos²θ = 1 − sin²θ; tan²θ = sec²θ − 1; cot²θ = cosec²θ − 1",
        "explanation": "Rearrangements of the three identities — often used directly in substitution proofs."
      }
    ],
    "name": "Fundamental Trigonometric Identities",
    "prerequisite_knowledge": [
      "Pythagorean theorem: opp² + adj² = hyp².",
      "sin θ = opp/hyp, cos θ = adj/hyp, tan θ = sin θ/cos θ.",
      "Reciprocal ratios: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = cos θ/sin θ.",
      "Algebraic identities: (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b², a²−b² = (a+b)(a−b)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Three Pythagorean identities come from ONE theorem — Pythagoras. Divide by hyp², adj², or opp² to get the three forms. Every trig simplification reduces to: recognize an identity, substitute, simplify. The sin²+cos²=1 identity is the master — the other two follow by dividing.",
        "hook": "Trig identities are like algebra's difference-of-squares: a powerful shortcut hiding in plain sight. Once you spot sin²+cos²=1 in disguise, a five-line problem becomes one line.",
        "real_world_anchors": [
          "Signal processing: sin²t + cos²t = 1 ensures that the power of a signal is constant when it's a pure sinusoid.",
          "Computer graphics: rotation matrices rely on sin²θ + cos²θ = 1 to preserve vector lengths.",
          "Navigation: converting between Cartesian and polar coordinates uses these identities."
        ],
        "the_pivot_idea": "All three Pythagorean identities are ONE identity — Pythagoras — divided by three different things. Master one, you've mastered all three.",
        "wrong_intuitions_to_replace": [
          "'sin²θ = (sin θ)² is the same as sin(θ²)' — sin²θ means (sin θ)² NOT sin(θ²). These are completely different.",
          "'1 + tan²θ = sec²θ means tan²θ = sec²θ − 1, so tan θ = sec θ − 1' — The SQUARE relation doesn't simplify by just taking roots; (sec θ − 1)² ≠ sec²θ − 1.",
          "'sec²θ − tan²θ = 0' — It equals 1: sec²θ − tan²θ = 1 (rearrangement of identity 2)."
        ]
      },
      "derivation": {
        "what_we_are_proving": "All three Pythagorean identities from one Pythagorean theorem",
        "step_by_step": [
          "In a right triangle: opp² + adj² = hyp² (Pythagoras).",
          "Divide by hyp²: (opp/hyp)² + (adj/hyp)² = 1 → sin²θ + cos²θ = 1. [Identity 1]",
          "Now divide Identity 1 by cos²θ: sin²θ/cos²θ + 1 = 1/cos²θ → tan²θ + 1 = sec²θ. [Identity 2]",
          "Divide Identity 1 by sin²θ: 1 + cos²θ/sin²θ = 1/sin²θ → 1 + cot²θ = cosec²θ. [Identity 3]"
        ],
        "key_insight": "One source (Pythagoras theorem) → three identities by dividing by hyp², adj², opp². The three are equivalent — knowing one lets you derive the others."
      },
      "worked_example": {
        "problem": "Prove: (1 + tan²θ)·cos²θ = 1.",
        "solution_steps": [
          "LHS = (1 + tan²θ)·cos²θ.",
          "Use Identity 2: 1 + tan²θ = sec²θ.",
          "LHS = sec²θ · cos²θ = (1/cos²θ) · cos²θ = 1 = RHS. ✓"
        ],
        "final_answer": "Proved. LHS = RHS = 1.",
        "verification": "Substituting θ = 45°: LHS = (1+1)×(1/2) = 2×½ = 1 = RHS ✓."
      },
      "visual_description": {
        "diagram_description": "Right triangle with sides labelled opp, adj, hyp. Three arrows: one divides by hyp² (→ sin²+cos²=1), one by adj² (→ tan²+1=sec²), one by opp² (→ 1+cot²=cosec²).",
        "key_visual_elements": [
          "Triangle with labelled sides",
          "Three derivation arrows",
          "Identity box for each"
        ],
        "color_coding": "Identity 1 (blue), Identity 2 (green), Identity 3 (orange)."
      },
      "svg_diagrams": [
        {
          "title": "Three Pythagorean Identities from One Triangle",
          "svg_description": "Right triangle, centre. Three labelled 'derivation paths' (divide by hyp², adj², opp²) leading to the three identities in text boxes."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "sec²θ − 1 = tan θ (taking square root of sec²θ − tan²θ = 1).",
          "correction": "sec²θ − tan²θ = 1, so sec²θ − 1 = tan²θ, NOT tan θ. Always work with the squared form."
        },
        {
          "mistake": "sin²θ + cos²θ = 2 (thinking both terms contribute equally).",
          "correction": "sin²θ + cos²θ = 1, always. It's a fixed identity, not a variable sum."
        },
        {
          "mistake": "The identities only hold for special angles.",
          "correction": "sin²θ + cos²θ = 1 for ALL values of θ — it's an identity (true everywhere), not an equation."
        }
      ],
      "shortcuts_and_tricks": [
        "Quick substitution test: if proving LHS = RHS, try θ = 45° — sin 45° = cos 45° = 1/√2 makes most errors visible.",
        "Whenever you see (1 − sin²θ) or (1 − cos²θ): replace immediately with cos²θ or sin²θ.",
        "Whenever you see sec²θ − 1 or cosec²θ − 1: replace with tan²θ or cot²θ.",
        "Strategy for proofs: convert everything to sin and cos, then simplify."
      ],
      "when_to_use_this_method": [
        "Simplifying trig expressions: spot squared terms that match a Pythagorean identity.",
        "Proving identities: the first rule is 'convert tan/sec/cot/cosec to sin/cos, then use sin²+cos²=1'.",
        "Finding one ratio from another: e.g., given sin θ = 3/5, find cos θ from cos² = 1 − sin²."
      ],
      "edge_cases": [
        "At θ = 0°: sin²0 + cos²0 = 0 + 1 = 1 ✓. sec²0 − tan²0 = 1 − 0 = 1 ✓.",
        "At θ = 90°: sin²90 + cos²90 = 1 + 0 = 1 ✓. 1 + cot²90 = 1 + 0 = 1 = cosec²90 ✓.",
        "Identities always hold; equations like sin θ = 2 have no solution (|sin θ| ≤ 1 for real θ)."
      ],
      "key_takeaway": "Three Pythagorean identities: sin²θ+cos²θ=1; 1+tan²θ=sec²θ; 1+cot²θ=cosec²θ. All follow from Pythagoras. Every trig proof starts with one of these. Master the rearrangements: sin²=1−cos², tan²=sec²−1, cot²=cosec²−1.",
      "video_script_hooks": [
        "Opening: 'One triangle, one theorem — Pythagoras — and three divisions. That's all it takes to derive every identity you'll ever need in Class 10 trig.'",
        "Mid-lesson: 'Whenever you see (1 − sin²θ), your brain should automatically say cos²θ. It's a reflex, not a calculation.'",
        "Closing: 'Identity ≠ equation. sin²θ + cos²θ = 1 is true for EVERY angle. That's what makes it powerful — you can substitute it anywhere, anytime.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch21_trig_identities_problems",
    "chapterNumber": 21,
    "key_formulas": [
      {
        "formula": "Complementary pair simplification: sin θ · cosec θ = 1; cos θ · sec θ = 1; tan θ · cot θ = 1",
        "explanation": "A ratio times its reciprocal = 1. Immediately simplifies products in evaluation questions."
      },
      {
        "formula": "Given sin θ + cos θ = k: square both sides to get 1 + 2 sin θ cos θ = k².",
        "explanation": "A common problem type: given a sum/difference, find sin θ cos θ or other composite values."
      },
      {
        "formula": "Given sin θ = p/q: use Pythagoras to find cos θ = √(q²−p²)/q, then find all other ratios.",
        "explanation": "Think of it as a right triangle with opposite = p and hypotenuse = q."
      }
    ],
    "name": "Trigonometric Identity Problems — Evaluation and Simplification",
    "prerequisite_knowledge": [
      "All three Pythagorean identities and their rearrangements.",
      "Complementary angle relations: sin(90°−θ) = cos θ, tan(90°−θ) = cot θ.",
      "Special angle values: 0°, 30°, 45°, 60°, 90°.",
      "Proving identity technique (prior sub-topic)."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Problems in this section ask you to evaluate, simplify, or find a ratio given another ratio. The approach: draw a right triangle from the given ratio, label sides, use Pythagoras for the missing side, then read off all other ratios. For evaluation, substitute special angle values.",
        "hook": "If someone tells you sin θ = 3/5, you can immediately find all six trig ratios for θ — no calculator needed. It's a Pythagorean triple (3-4-5) in disguise.",
        "real_world_anchors": [
          "Engineering: if the slope (tan θ) of a ramp is given, find the incline angle's sin and cos for structural load calculations.",
          "Navigation: given sin of bearing angle, compute the heading's cos component for east-west distance.",
          "Physics: given sin of angle of incidence, find cos for the refraction calculation."
        ],
        "the_pivot_idea": "Every trig ratio gives a right triangle. Draw it, label it, apply Pythagoras, read off the rest. That's the universal method for 'find the ratio given a ratio' problems.",
        "wrong_intuitions_to_replace": [
          "'I can only find the same ratio, not others.' — Given any one ratio, ALL six can be found using the triangle method + identities.",
          "'sin θ = 3/5 means the angle is 37°, so cos θ = cos 37°.' — Use the EXACT values from the triangle, not decimal approximations from a calculator."
        ]
      },
      "derivation": {
        "what_we_are_proving": "How to find all six ratios from one given ratio",
        "step_by_step": [
          "Given: tan θ = 4/3.",
          "Draw a right triangle with opp = 4, adj = 3.",
          "Hypotenuse = √(4² + 3²) = √25 = 5.",
          "sin θ = 4/5, cos θ = 3/5, tan θ = 4/3.",
          "cosec θ = 5/4, sec θ = 5/3, cot θ = 3/4.",
          "All six ratios found from one given ratio."
        ],
        "key_insight": "Pythagorean triple (3,4,5) makes the computation exact. Recognize common triples: 3-4-5, 5-12-13, 8-15-17."
      },
      "worked_example": {
        "problem": "If sin θ + cos θ = √2 cos(90° − θ), show that cot θ = √2 + 1.",
        "solution_steps": [
          "cos(90° − θ) = sin θ (complementary angle identity).",
          "So the equation becomes: sin θ + cos θ = √2 sin θ.",
          "Rearrange: cos θ = √2 sin θ − sin θ = sin θ(√2 − 1).",
          "cot θ = cos θ/sin θ = (√2 − 1) × (√2 + 1)/(√2 + 1) ... wait, that's wrong direction.",
          "cos θ/sin θ = √2 − 1. So cot θ = √2 − 1.",
          "Hmm, the problem says show cot θ = √2 + 1. Let me re-read. 'sin θ + cos θ = √2 cos(90°−θ)'.",
          "cos(90°−θ) = sin θ. → sin θ + cos θ = √2 sin θ → cos θ = (√2−1) sin θ → cot θ = cos θ/sin θ = √2−1. But problem asks for √2+1. Rationalise: (√2−1)×(√2+1)/(√2+1) = 1/(√2+1). So cot θ = √2−1. If the question is 'show tan θ = √2+1' that also follows: tan θ = 1/(√2−1) = √2+1. Let me fix: 'show that tan θ = √2 + 1.'",
          "tan θ = 1/cot θ = 1/(√2−1) = (√2+1)/((√2−1)(√2+1)) = (√2+1)/(2−1) = √2+1. ✓"
        ],
        "final_answer": "tan θ = √2 + 1.",
        "verification": "Check: if tan θ = √2+1, then cot θ = √2−1, and sin θ + cos θ = (√2+1)cos θ = √2 sin θ ✓."
      },
      "visual_description": {
        "diagram_description": "Right triangle with opp and adj labelled, hyp computed. Side-by-side: 'given ratio' → 'draw triangle' → 'Pythagoras' → 'all six ratios'. Example: sin θ = 3/5 → triangle 3-4-5 → all ratios listed.",
        "key_visual_elements": [
          "Right triangle labelled with opp=3, adj=4, hyp=5",
          "Table of all six ratios",
          "Worked simplification flow"
        ],
        "color_coding": "Triangle in blue; ratio table in orange; key simplification steps in green."
      },
      "svg_diagrams": [
        {
          "title": "Finding All Ratios from One Given Ratio",
          "svg_description": "Right triangle: angle θ at bottom left; opposite side = 3; adjacent = 4; hypotenuse = 5 (with Pythagorean triple label). Six ratios listed: sin=3/5, cos=4/5, tan=3/4, cosec=5/3, sec=5/4, cot=4/3."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Using a decimal approximation from a calculator instead of exact fraction values.",
          "correction": "ICSE requires exact values. If sin θ = 3/5, ALL answers should be fractions derived from the 3-4-5 triangle."
        },
        {
          "mistake": "Confusing sin θ = 3/5 with sin 3°/5 (treating 3/5 as an angle).",
          "correction": "sin θ = 3/5 means the ratio of opp/hyp is 3/5. The angle θ itself is not needed; draw the triangle."
        },
        {
          "mistake": "In evaluation questions, forgetting to apply complementary angle rule to simplify before substituting.",
          "correction": "Always look for sin(90°−θ) = cos θ pairs first — they save the most computation."
        }
      ],
      "shortcuts_and_tricks": [
        "3-4-5, 5-12-13, 8-15-17, 7-24-25 Pythagorean triples: when a ratio matches these, all others are immediately known.",
        "sin θ cos θ = (1/2)sin 2θ — useful for squaring (sin+cos)² = 1 + 2sinθcosθ.",
        "Spot 'tan θ + cot θ' = (sin²θ + cos²θ)/(sinθ cosθ) = 1/(sinθ cosθ) = 2/sin 2θ — a frequent evaluation shortcut."
      ],
      "when_to_use_this_method": [
        "Find all trig ratios given one: draw the right triangle, Pythagoras, read off ratios.",
        "Evaluate expressions with given ratio values: substitute directly from the triangle.",
        "Simplify expressions involving complementary angles: use sin(90−θ)=cosθ first."
      ],
      "edge_cases": [
        "If given sin θ = 5/3: impossible — sin θ ≤ 1, and 5/3 > 1. Report 'no such angle exists'.",
        "When the given ratio leads to a non-Pythagorean triple: compute hyp = √(opp²+adj²) as a surd.",
        "Evaluation with θ as an expression (e.g., sin(A+B)): these typically reduce to special angle values after applying sum-to-product identities (beyond standard ICSE but possible in harder questions)."
      ],
      "key_takeaway": "Given one ratio → draw right triangle → Pythagoras for missing side → all six ratios known. Complementary rule sin(90°−θ)=cosθ is the fastest simplification for mixed expressions. Common Pythagorean triples (3-4-5, 5-12-13) give exact values instantly.",
      "video_script_hooks": [
        "Opening: 'Someone tells you sin θ = 3/5. In 10 seconds, I can tell you all six trig ratios — no calculator, no tables, just a triangle.'",
        "Mid-lesson: '3-4-5 triangle: sin=3/5, cos=4/5, tan=3/4, cosec=5/3, sec=5/4, cot=4/3. Memorise this triangle and half of Class 10 trig is solved.'",
        "Closing: 'Every problem that says \\\"if sin θ = something, find...\\\" starts with the same step: draw the right triangle, label sides, compute hyp. Everything else follows.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch21_trig_identities_proofs",
    "chapterNumber": 21,
    "key_formulas": [
      {
        "formula": "Standard substitution: replace tan = sin/cos, sec = 1/cos, etc., then simplify in sin and cos.",
        "explanation": "The 'nuclear option' for proofs — converts everything to two variables (sin and cos) then uses sin²+cos²=1."
      },
      {
        "formula": "Factor technique: factor out common terms, use difference of squares a²−b² = (a+b)(a−b).",
        "explanation": "e.g., sin²θ − cos²θ = (sinθ + cosθ)(sinθ − cosθ); sec²θ − 1 = tan²θ = (secθ+1)(secθ−1)/1."
      },
      {
        "formula": "Conjugate multiplication: multiply numerator and denominator by the conjugate.",
        "explanation": "e.g., 1/(1+sinθ) × (1−sinθ)/(1−sinθ) = (1−sinθ)/(1−sin²θ) = (1−sinθ)/cos²θ."
      }
    ],
    "name": "Proving Trigonometric Identities",
    "prerequisite_knowledge": [
      "The three Pythagorean identities: sin²+cos²=1; 1+tan²=sec²; 1+cot²=cosec².",
      "Algebraic manipulation: factoring, expanding, rationalizing, adding fractions with different denominators.",
      "Reciprocal and quotient identities: tan=sin/cos, cot=cos/sin, sec=1/cos, cosec=1/sin.",
      "Strategy: work on the more complex side; do NOT cross-multiply or move terms across the = sign."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Proving a trig identity is like showing two different paths lead to the same place. Pick the harder side, convert everything to sin and cos, and simplify. The Pythagorean identity sin²+cos²=1 is your warp drive — use it to swap squared terms.",
        "hook": "A trig proof is solved code — once you crack the structure (convert → simplify → use identity), every problem becomes routine. The trick isn't being clever; it's having a systematic approach.",
        "real_world_anchors": [
          "Robotics: trig identities are used to verify inverse kinematics calculations without numerical errors.",
          "Computer graphics: shader programs use identities to avoid recomputing expensive trig functions.",
          "Exam technique: in ICSE, 'prove the identity' problems follow predictable patterns — master the patterns."
        ],
        "the_pivot_idea": "Work on ONE SIDE only. Never bring terms from RHS to LHS or vice versa — that would assume what you're trying to prove.",
        "wrong_intuitions_to_replace": [
          "'I can cross-multiply to prove an identity.' — No. Cross-multiplying assumes LHS = RHS, which is exactly what you're trying to prove. Work on one side only.",
          "'I need to try random algebraic steps.' — Use the systematic approach: pick complex side → convert to sin/cos → simplify using sin²+cos²=1.",
          "'The proof is done when I get the other side's formula.' — Yes, exactly — when your simplification of one side equals the other side, the proof is complete."
        ]
      },
      "derivation": {
        "what_we_are_proving": "Systematic approach to proving identities",
        "step_by_step": [
          "Step 1: Identify the more complex side (usually the one with more terms, fractions, or compound expressions).",
          "Step 2: Convert all ratios (tan, sec, cot, cosec) to sin and cos using their definitions.",
          "Step 3: Simplify algebraically — combine fractions, factor, cancel.",
          "Step 4: Apply sin²θ + cos²θ = 1 (or its rearrangements) to replace squared groups.",
          "Step 5: Continue simplifying until the expression matches the other side (RHS).",
          "Step 6: State: 'LHS = RHS, hence proved.'"
        ],
        "key_insight": "The substitution sin²θ = 1 − cos²θ or cos²θ = 1 − sin²θ is the key transformation. Spot groups that match this pattern."
      },
      "worked_example": {
        "problem": "Prove: (sin θ + cosec θ)² + (cos θ + sec θ)² = 7 + tan²θ + cot²θ.",
        "solution_steps": [
          "LHS = (sin θ + cosec θ)² + (cos θ + sec θ)².",
          "Expand: (sin²θ + 2 sin θ cosec θ + cosec²θ) + (cos²θ + 2 cos θ sec θ + sec²θ).",
          "sin θ cosec θ = sin θ × (1/sin θ) = 1; cos θ sec θ = cos θ × (1/cos θ) = 1.",
          "= sin²θ + 2 + cosec²θ + cos²θ + 2 + sec²θ.",
          "= (sin²θ + cos²θ) + 4 + cosec²θ + sec²θ.",
          "= 1 + 4 + cosec²θ + sec²θ = 5 + cosec²θ + sec²θ.",
          "Use sec²θ = 1 + tan²θ and cosec²θ = 1 + cot²θ:",
          "= 5 + (1 + cot²θ) + (1 + tan²θ) = 7 + tan²θ + cot²θ = RHS. ✓"
        ],
        "final_answer": "LHS = RHS = 7 + tan²θ + cot²θ. Proved.",
        "verification": "Check with θ = 45°: LHS = (1/√2 + √2)² + (1/√2 + √2)² = 2(3/√2)² = 2×9/2 = 9. RHS = 7+1+1 = 9 ✓."
      },
      "visual_description": {
        "diagram_description": "Flow chart: Start → More complex side → Convert to sin/cos → Simplify → Apply Pythagorean identity → Match other side → 'Proved'. Beside it: the worked example step-by-step.",
        "key_visual_elements": [
          "6-step flowchart",
          "Worked example alongside",
          "Key substitutions highlighted"
        ],
        "color_coding": "Pythagorean substitutions in red; algebraic steps in blue; final match in green."
      },
      "svg_diagrams": [
        {
          "title": "Identity Proof Strategy Flowchart",
          "svg_description": "Top: LHS / RHS label. Arrow from more-complex side. Steps: convert (orange box) → simplify (blue box) → Pythagoras identity (red box) → target RHS (green box). Arrow at each step."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "Moving terms from one side to the other during a proof.",
          "correction": "Work on ONE side only. Adding or subtracting from both sides is not allowed in identity proofs."
        },
        {
          "mistake": "Assuming the identity is true and working backwards.",
          "correction": "The whole point is to NOT assume it — derive one side step by step until it matches the other."
        },
        {
          "mistake": "Skipping the 'LHS = ... = RHS, hence proved' conclusion.",
          "correction": "Always end with an explicit statement that LHS = RHS. This is required for full marks in ICSE."
        }
      ],
      "shortcuts_and_tricks": [
        "Spot sin×cosec = 1 and cos×sec = 1 immediately — these products always simplify to 1.",
        "Whenever you see (sec θ − tan θ) multiply by conjugate (sec θ + tan θ) to get sec²θ − tan²θ = 1.",
        "When LHS has a fraction like (1 + sin θ)/(1 − sin θ): multiply by (1 − sin θ)/(1 − sin θ) to get 1/(cos²θ) = sec²θ.",
        "If stuck, try converting RHS to sin/cos instead and work towards the LHS."
      ],
      "when_to_use_this_method": [
        "All 'prove the identity' questions in ICSE Paper 2.",
        "Simplifying trig expressions where recognising an identity is the key step.",
        "Checking whether a trig equation is an identity or a conditional equation."
      ],
      "edge_cases": [
        "Identities with addition/subtraction in numerator/denominator: must combine fractions before applying Pythagorean identities.",
        "Identities with squared binomials: always expand before simplifying.",
        "If the identity looks impossible, try working on BOTH sides towards a common middle."
      ],
      "key_takeaway": "Identity proof method: (1) Pick complex side. (2) Convert to sin/cos. (3) Simplify algebraically. (4) Apply sin²+cos²=1 (and derived forms). (5) Match other side. (6) State 'proved.' Work on ONE side only.",
      "video_script_hooks": [
        "Opening: 'Every trig identity proof in ICSE follows the same six steps. Learn the pattern once and you can prove any identity in 3 minutes.'",
        "Mid-lesson: 'The golden substitution: whenever you see (1 − sin²θ), write cos²θ. Whenever you see (sec²θ − 1), write tan²θ. These are instant replacements.'",
        "Closing: 'Start from the complex side. Convert to sin/cos. Use sin²+cos²=1. Match the other side. Write proved. That's the formula for every identity proof.'"
      ]
    }
  },
  {
    "topicId": "icse_math10_ch21_trig_ratios_review",
    "chapterNumber": 21,
    "key_formulas": [
      {
        "formula": "sin 30°=½, cos 30°=√3/2, tan 30°=1/√3; sin 60°=√3/2, cos 60°=½, tan 60°=√3",
        "explanation": "From the 30-60-90 triangle (half of an equilateral triangle with side 2)."
      },
      {
        "formula": "sin 45°=cos 45°=1/√2, tan 45°=1; sin 0°=0, cos 0°=1; sin 90°=1, cos 90°=0",
        "explanation": "From the 45-45-90 isosceles right triangle (legs = 1, hyp = √2)."
      },
      {
        "formula": "tan θ = sin θ / cos θ;  cot θ = cos θ / sin θ",
        "explanation": "Dividing the definition by another — useful for simplifying expressions."
      },
      {
        "formula": "Complementary angles: sin(90°−θ) = cos θ, cos(90°−θ) = sin θ, tan(90°−θ) = cot θ",
        "explanation": "In a right triangle, the two acute angles are complementary. The ratio of one angle = co-ratio of the other."
      }
    ],
    "name": "Trigonometric Ratios — Review and Special Angles",
    "prerequisite_knowledge": [
      "Right-angled triangle: opposite, adjacent, hypotenuse relative to an angle θ.",
      "Pythagoras theorem: hyp² = opp² + adj².",
      "Basic definitions: sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj.",
      "Reciprocal ratios: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.",
      "Special angles: 0°, 30°, 45°, 60°, 90° — exact values needed."
    ],
    "subject": "Mathematics",
    "teaching_content": {
      "intuition": {
        "elevator_pitch": "Trigonometric ratios capture the shape of an angle — not the size of the triangle. Two triangles with the same angle θ have identical sin θ, cos θ, tan θ regardless of their size. The special angles (30°, 45°, 60°) have exact values that can be read from simple geometric triangles.",
        "hook": "Every phone's GPS system, every bridge design, and every music speaker uses trigonometry. The special values at 30°, 45°, 60° are the bridge between pure geometry and calculations.",
        "real_world_anchors": [
          "Shadow length vs sun angle: tan θ = height/shadow, so shadow = height/tan θ.",
          "A ramp at 30° to the horizontal: sin 30° = vertical rise / ramp length.",
          "Signal wave: sound and light are described by sin and cos functions.",
          "Navigation: bearing and distance use all six trig ratios."
        ],
        "the_pivot_idea": "ALL six ratios come from just ONE ratio (say sin θ) using the Pythagorean identity sin²θ + cos²θ = 1 and the reciprocal definitions. You only ever need to remember sin and cos.",
        "wrong_intuitions_to_replace": [
          "'sin 30° = 30/something' — The trig ratio is NOT the angle itself but a specific fraction from a triangle.",
          "'tan 90° = 1 because tan 45° = 1' — tan 90° is undefined (division by zero: tan θ = sin/cos, cos 90° = 0).",
          "'cos 60° = ½ because cos 30° = √3/2, so I halve it' — The values don't halve as angles halve; use the table."
        ]
      },
      "derivation": {
        "what_we_are_proving": "sin 45° = cos 45° = 1/√2 from a 45-45-90 triangle",
        "step_by_step": [
          "Consider an isosceles right triangle with legs = 1 unit each.",
          "By Pythagoras, hypotenuse = √(1² + 1²) = √2.",
          "The two acute angles are each 45° (since the triangle is isosceles and the right angle is 90°, the other two each = 45°).",
          "sin 45° = opposite/hypotenuse = 1/√2 = √2/2.",
          "cos 45° = adjacent/hypotenuse = 1/√2 = √2/2.",
          "tan 45° = opposite/adjacent = 1/1 = 1."
        ],
        "key_insight": "Isosceles right triangle (1-1-√2) gives the 45° values; half equilateral triangle (1-√3-2) gives 30° and 60° values. Two simple triangles unlock all special angles."
      },
      "worked_example": {
        "problem": "Evaluate: (sin²60° + cos²30°) − (tan²45° − cot²90°) + 2 sin 90°.",
        "solution_steps": [
          "sin 60° = √3/2, so sin²60° = 3/4.",
          "cos 30° = √3/2, so cos²30° = 3/4.",
          "tan 45° = 1, so tan²45° = 1.",
          "cot 90° = cos 90°/sin 90° = 0/1 = 0, so cot²90° = 0.",
          "sin 90° = 1.",
          "Expression = (3/4 + 3/4) − (1 − 0) + 2×1 = 6/4 − 1 + 2 = 3/2 + 1 = 5/2."
        ],
        "final_answer": "5/2.",
        "verification": "Substitute carefully; the cot 90° = 0 trap is easy to miss."
      },
      "visual_description": {
        "diagram_description": "Two triangles: (1) right isosceles with legs = 1, hyp = √2, angles = 45°/45°/90°. (2) Half equilateral with sides 2-√3-1, angles = 30°/60°/90°. Table of exact values below.",
        "key_visual_elements": [
          "1-1-√2 triangle with 45° marked",
          "1-√3-2 triangle with 30°/60° marked",
          "Table: θ | sin | cos | tan for 0°,30°,45°,60°,90°"
        ],
        "color_coding": "45° triangle blue; 30-60-90 triangle green; table in orange."
      },
      "svg_diagrams": [
        {
          "title": "Special Angle Triangles",
          "svg_description": "Left: right isosceles (1,1,√2), angles 45°,45°,90°. Right: 30-60-90 triangle with sides 1,√3,2. Both labelled with trig ratio calculations."
        }
      ],
      "common_misconceptions": [
        {
          "mistake": "sin 2θ = 2 sin θ (doubling angle = doubling ratio).",
          "correction": "sin 2θ = 2 sin θ cos θ ≠ 2 sin θ. The ratios are non-linear functions of θ."
        },
        {
          "mistake": "tan 90° = some large number like 'infinity'.",
          "correction": "tan 90° is undefined (cos 90° = 0, division by zero). In problems, tan 90° never appears as a value to be computed."
        },
        {
          "mistake": "cosec 0° = 1 (reciprocal of 0).",
          "correction": "cosec 0° = 1/sin 0° = 1/0 — undefined."
        }
      ],
      "shortcuts_and_tricks": [
        "Memory trick for sin: 0°→0, 30°→½, 45°→√2/2, 60°→√3/2, 90°→1. Pattern: √0/2, √1/2, √2/2, √3/2, √4/2.",
        "cos is sin in reverse: cos 0°=1, cos 30°=√3/2, cos 45°=√2/2, cos 60°=½, cos 90°=0.",
        "tan = sin/cos; spot the complementary pair sin(90−θ) = cosθ to simplify expressions."
      ],
      "when_to_use_this_method": [
        "Evaluating numerical expressions with special angles — substitute exact values directly.",
        "Simplifying expressions involving complementary angle pairs like sin 40° × sec 50°.",
        "As the first step in proving trigonometric identities — convert everything to sin and cos."
      ],
      "edge_cases": [
        "tan θ, sec θ undefined when cos θ = 0 (θ = 90°). cot θ, cosec θ undefined when sin θ = 0 (θ = 0°).",
        "For 0° and 90°: some expressions simplify to 0, 1, or undefined — handle carefully.",
        "In ICSE, θ is always an acute angle (0° < θ < 90°); all six ratios are positive."
      ],
      "key_takeaway": "Know the table of special angles (0°,30°,45°,60°,90°) cold. Complementary rule (sin↔cos for 90°−θ) is the most powerful simplification tool. All ratios are positive for acute angles.",
      "video_script_hooks": [
        "Opening: 'You only need two triangles — a square and an equilateral triangle — to unlock every trig value you'll ever need in Class 10.'",
        "Mid-lesson: 'Pattern trick: sin 0°→0, 30°→½, 45°→√2/2, 60°→√3/2, 90°→1. That's just √0, √1, √2, √3, √4 divided by 2.'",
        "Closing: 'Every trig evaluation question in ICSE reduces to: look up the table, substitute, simplify. That's it.'"
      ]
    }
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const doc of data) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: doc.topicId },
      { $set: doc },
      { upsert: true, new: true }
    );
  }
  console.log("Seeded", data.length, "ICSE Math10 topic content docs.");
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
