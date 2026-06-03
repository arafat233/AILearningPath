/**
 * AP SSC Class 8 Mathematics — Chapter 10: Visualising Solid Shapes
 * 3 topics. topicId: ap_ssc_math8_ch10_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch10.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch10_views_and_nets",
    subject: "Mathematics",
    chapterNumber: 10,
    name: "Views and Nets of 3D Shapes",
    prerequisite_knowledge: [
      "Recognising cubes, cuboids, cylinders, cones, spheres, pyramids",
      "2D shapes (square, rectangle, circle, triangle)",
      "Top, front and side viewpoints",
      "Faces of a solid",
    ],
    key_formulas: [
      "Top view = looking straight down; Front view = looking from the front; Side view = from the side",
      "A NET is a 2D pattern that folds up into the 3D solid",
      "A cube has 11 distinct nets",
      "Different solids can share a view; three views together pin down the solid",
    ],
    teaching_content: {
      intuition: "A solid object looks different depending on where you stand — from the top a cylinder is a circle, from the front it's a rectangle. These are its VIEWS. A NET is the opposite idea: unfold the solid flat like a flattened cardboard box, and you get a 2D pattern that folds back into the shape. Views and nets are two ways of moving between 2D and 3D.",
      derivation: "Views: imagine shining a torch and tracing the outline. Looking DOWN gives the top view, looking FORWARD the front view, from the SIDE the side view. A single view can be ambiguous (a circle could be a cylinder, cone or sphere), so engineers draw three views to specify a shape uniquely. \nNets: cut a hollow solid along enough edges and unfold it flat. A cube unfolds into 6 connected squares — and there are exactly 11 different square-arrangements that fold back into a cube (and many that don't).",
      worked_example: "Give the top, front and side views of a cylinder standing upright, and name the faces in a cube's net.\n\nCylinder upright: top view = circle; front view = rectangle; side view = rectangle.\nCube's net: 6 squares (the 6 faces). A valid net folds so that opposite faces never end up adjacent.",
      visual_description: "An upright cylinder with three projected views: a circle (top), a rectangle (front), a rectangle (side). Beside it, a cross-shaped arrangement of 6 squares labelled as one of the 11 nets of a cube, with fold lines dashed.",
      svg_diagrams: [
        { title: "Views of a cylinder + a cube net",
          svg_code: "<svg viewBox='0 0 240 110' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><circle cx='30' cy='25' r='15' fill='#dbeafe' stroke='#2563eb'/><text x='12' y='52'>top</text><rect x='15' y='62' width='30' height='40' fill='#dbeafe' stroke='#2563eb'/><text x='10' y='112' font-size='8'>front/side</text><g stroke='#333' fill='#fde68a'><rect x='120' y='40' width='24' height='24'/><rect x='96' y='64' width='24' height='24'/><rect x='120' y='64' width='24' height='24'/><rect x='144' y='64' width='24' height='24'/><rect x='168' y='64' width='24' height='24'/><rect x='120' y='88' width='24' height='24'/></g><text x='120' y='30' font-size='8'>cube net (6 squares)</text></svg>" }
      ],
      common_misconceptions: [
        "Thinking ANY arrangement of 6 squares folds into a cube — only 11 of them do.",
        "Confusing top view with front view — top is from ABOVE, front is straight on.",
        "Believing one view identifies a solid — a circle could be a sphere, cone or cylinder.",
        "Forgetting a net must have the correct number of faces (a cube net needs exactly 6 squares).",
      ],
      shortcuts_and_tricks: [
        "Round-from-top solids (cylinder, cone, sphere) all show a CIRCLE from the top.",
        "To test a net: mentally fold it; opposite faces of a cube must NOT be adjacent in the net.",
        "Three standard views (top, front, side) uniquely describe most everyday solids.",
      ],
      when_to_use_this_method: "Use views to represent or identify 3D objects on paper (and read engineering-style drawings); use nets to find surface area, build models, and match folded shapes to flat patterns.",
      edge_cases: [
        "A cube has 11 nets; a cuboid and other solids have their own counts.",
        "A sphere looks like a circle from EVERY direction.",
        "Some flat patterns of 6 squares overlap when folded — those are NOT valid nets.",
      ],
      key_takeaway: "Views (top/front/side) flatten a solid by looking at it from a direction; nets unfold a solid into a 2D pattern that folds back. A single view can be ambiguous, so three are used; a cube has exactly 11 valid nets. Nets are the bridge to surface-area calculations.",
      video_script_hooks: [
        "Opening: 'From the top a can is a circle; from the front it's a rectangle. Same object, different views.'",
        "Mid: 'Unfold a cube and you get six squares — but only 11 of the ways to arrange them fold back into a cube.'",
        "Closing: 'One view can fool you. A circle from the top could be a ball, a cone or a can — that's why we draw three.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch10_polyhedra_euler",
    subject: "Mathematics",
    chapterNumber: 10,
    name: "Polyhedra and Euler's Formula",
    prerequisite_knowledge: [
      "Faces, edges and vertices of a solid",
      "Recognising prisms and pyramids",
      "Counting carefully without missing or double-counting",
      "Polygons (flat faces)",
    ],
    key_formulas: [
      "Polyhedron = a solid with flat polygonal faces, straight edges and vertices",
      "Euler's formula: F + V − E = 2  (F faces, V vertices, E edges)",
      "Prism: 2 parallel congruent bases + rectangular sides",
      "Pyramid: 1 polygon base + triangular faces meeting at an apex",
    ],
    teaching_content: {
      intuition: "A polyhedron is a solid whose surface is made entirely of FLAT polygon faces — like a cube, a prism or a pyramid (a sphere or cylinder is NOT a polyhedron because of its curved surface). Count its faces, vertices (corners) and edges, and a beautiful pattern always holds: F + V − E = 2. This relationship, found by Euler, works for every convex polyhedron.",
      derivation: "For any convex polyhedron, Euler discovered a fixed relationship between the counts of faces (F), vertices (V) and edges (E): F + V − E = 2. \nVerify on a cube: F = 6 (faces), V = 8 (corners), E = 12 (edges). Then F + V − E = 6 + 8 − 12 = 2. ✓ \nOn a triangular prism: F = 5, V = 6, E = 9 → 5 + 6 − 9 = 2. ✓ \nThe '2' never changes for a convex polyhedron, which lets you find a missing count if two are known.",
      worked_example: "A polyhedron has 8 faces and 12 vertices. How many edges does it have?\n\nEuler: F + V − E = 2 ⟹ 8 + 12 − E = 2 ⟹ 20 − E = 2 ⟹ E = 18.\nSo it has 18 edges. (This is an octahedron-like count; the formula finds the missing value instantly.)",
      visual_description: "A cube with its 6 faces, 8 vertices and 12 edges labelled, alongside the equation 6 + 8 − 12 = 2. A triangular prism beside it shows 5 + 6 − 9 = 2, demonstrating the formula's consistency.",
      svg_diagrams: [
        { title: "Euler's formula on a cube: 6 + 8 − 12 = 2",
          svg_code: "<svg viewBox='0 0 180 130' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><rect x='30' y='45' width='70' height='70' fill='none' stroke='#2563eb'/><rect x='60' y='20' width='70' height='70' fill='none' stroke='#2563eb'/><line x1='30' y1='45' x2='60' y2='20' stroke='#2563eb'/><line x1='100' y1='45' x2='130' y2='20' stroke='#2563eb'/><line x1='30' y1='115' x2='60' y2='90' stroke='#2563eb'/><line x1='100' y1='115' x2='130' y2='90' stroke='#2563eb'/><text x='20' y='128' fill='#16a34a'>F+V−E = 6+8−12 = 2</text></svg>" }
      ],
      common_misconceptions: [
        "Calling a cylinder or cone a polyhedron — curved surfaces disqualify them.",
        "Miscounting edges (a cube has 12, not 8) — count systematically.",
        "Writing Euler's formula as F + V + E = 2 (it is F + V − E = 2).",
        "Confusing faces with vertices when counting.",
      ],
      shortcuts_and_tricks: [
        "Memorise the cube: F=6, V=8, E=12 — a quick anchor for the formula.",
        "Know two of F, V, E? Euler gives the third: E = F + V − 2.",
        "Prism with an n-gon base: F = n+2, V = 2n, E = 3n. Pyramid: F = n+1, V = n+1, E = 2n.",
      ],
      when_to_use_this_method: "Use Euler's formula to find a missing face/vertex/edge count for a convex polyhedron and to check whether given counts are consistent with a real polyhedron.",
      edge_cases: [
        "Euler's formula holds for CONVEX polyhedra; certain non-convex shapes can break it.",
        "Spheres, cylinders and cones are not polyhedra (curved surfaces), so the formula doesn't apply.",
        "A tetrahedron: F=4, V=4, E=6 → 4+4−6 = 2 ✓ (the simplest polyhedron).",
      ],
      key_takeaway: "A polyhedron has only flat polygon faces (no curves). For every convex polyhedron, Euler's formula F + V − E = 2 holds — use it to find a missing count (E = F + V − 2) or to check consistency. Prisms and pyramids have predictable F, V, E from their base.",
      video_script_hooks: [
        "Opening: 'Count the faces, corners and edges of ANY convex solid, combine them as F + V − E, and you ALWAYS get 2. Euler's magic.'",
        "Mid: 'A cube: 6 faces, 8 corners, 12 edges. 6 + 8 − 12 = 2. Try a prism — same answer.'",
        "Closing: 'Curved surfaces don't count — a cylinder isn't a polyhedron, so the formula sits this one out.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch10_prisms_pyramids",
    subject: "Mathematics",
    chapterNumber: 10,
    name: "Prisms, Pyramids and Solid Classification",
    prerequisite_knowledge: [
      "Polyhedra and Euler's formula",
      "Polygons and their names",
      "Faces, edges, vertices",
      "Difference between flat and curved surfaces",
    ],
    key_formulas: [
      "Prism: 2 congruent parallel polygon bases joined by rectangles; named by its base",
      "Pyramid: 1 polygon base + triangular faces meeting at one apex; named by its base",
      "n-gon prism: F = n+2, V = 2n, E = 3n",
      "n-gon pyramid: F = n+1, V = n+1, E = 2n",
    ],
    teaching_content: {
      intuition: "Two big families of polyhedra: PRISMS and PYRAMIDS. A prism is like a polygon extruded straight out — two identical ends joined by rectangles (a box is a square prism; a Toblerone is a triangular prism). A pyramid has ONE polygon base and sides that rise to a single point (apex), like the Egyptian pyramids. Both are named after the polygon at their base.",
      derivation: "Prism (n-gon base): it has the 2 bases plus n rectangular side faces → F = n + 2. Each base has n vertices, two bases → V = 2n. Each base has n edges (2n total) plus n vertical edges joining them → E = 3n. Check with Euler: (n+2) + 2n − 3n = 2 ✓. \nPyramid (n-gon base): 1 base + n triangular faces → F = n + 1. n base vertices + 1 apex → V = n + 1. n base edges + n slant edges → E = 2n. Euler: (n+1) + (n+1) − 2n = 2 ✓.",
      worked_example: "Find F, V, E for a pentagonal prism and a square pyramid.\n\nPentagonal prism (n=5): F = 5+2 = 7, V = 2·5 = 10, E = 3·5 = 15. (Euler: 7+10−15 = 2 ✓)\nSquare pyramid (n=4): F = 4+1 = 5, V = 4+1 = 5, E = 2·4 = 8. (Euler: 5+5−8 = 2 ✓)",
      visual_description: "Side-by-side: a triangular prism (two triangle ends joined by 3 rectangles) and a square pyramid (square base with 4 triangles meeting at an apex), each labelled with its F, V, E counts.",
      svg_diagrams: [
        { title: "Triangular prism vs square pyramid",
          svg_code: "<svg viewBox='0 0 230 110' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><polygon points='20,80 60,80 40,40' fill='none' stroke='#2563eb'/><polygon points='50,90 90,90 70,50' fill='none' stroke='#2563eb'/><line x1='20' y1='80' x2='50' y2='90' stroke='#2563eb'/><line x1='60' y1='80' x2='90' y2='90' stroke='#2563eb'/><line x1='40' y1='40' x2='70' y2='50' stroke='#2563eb'/><text x='25' y='105'>prism</text><polygon points='150,90 210,90 195,70 165,70' fill='none' stroke='#16a34a'/><line x1='150' y1='90' x2='180' y2='35' stroke='#16a34a'/><line x1='210' y1='90' x2='180' y2='35' stroke='#16a34a'/><line x1='165' y1='70' x2='180' y2='35' stroke='#16a34a'/><line x1='195' y1='70' x2='180' y2='35' stroke='#16a34a'/><text x='160' y='105'>pyramid</text></svg>" }
      ],
      common_misconceptions: [
        "Confusing a prism (two bases, rectangular sides) with a pyramid (one base, triangular sides, apex).",
        "Naming a solid by its side faces instead of its BASE (a 'triangular prism' has triangular BASES).",
        "Forgetting a pyramid's apex when counting vertices.",
        "Thinking a cylinder is a prism — a prism has FLAT polygon bases, not circular ones.",
      ],
      shortcuts_and_tricks: [
        "Prism formulas (n-gon): F = n+2, V = 2n, E = 3n. Pyramid: F = n+1, V = n+1, E = 2n.",
        "Name by the base: pentagonal prism, hexagonal pyramid, etc.",
        "Cross-check any count with Euler's F + V − E = 2.",
      ],
      when_to_use_this_method: "Use to classify and name solids, count their F/V/E from the base polygon, and (later) compute surface areas and volumes which depend on the prism/pyramid type.",
      edge_cases: [
        "A cube is a square prism (and a cuboid is a rectangular prism).",
        "A tetrahedron is a triangular pyramid (n=3): F=4, V=4, E=6.",
        "A cylinder/cone are the 'curved cousins' of prism/pyramid but are NOT polyhedra.",
      ],
      key_takeaway: "Prisms have two congruent polygon bases joined by rectangles (n-gon: F=n+2, V=2n, E=3n); pyramids have one polygon base and triangular faces meeting at an apex (n-gon: F=n+1, V=n+1, E=2n). Both are named by the base polygon and satisfy Euler's formula.",
      video_script_hooks: [
        "Opening: 'A Toblerone bar and an Egyptian pyramid — one's a prism, one's a pyramid. The base tells you which.'",
        "Mid: 'Prism: two identical ends joined by rectangles. Pyramid: one base rising to a single point.'",
        "Closing: 'Name it by its base — pentagonal prism, square pyramid — and the F, V, E counts follow a simple formula.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch10 (Visualising Solid Shapes): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
