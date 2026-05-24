import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch11_surface_area_solids  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch11_surface_a01",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The total surface area of a cuboid with length l, breadth b, height h is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "2(lb + bh + hl)",   type: "correct",       logicTag: "cuboid_tsa" },
      { text: "lb + bh + hl",      type: "concept_error", logicTag: "missing_factor_2" },
      { text: "2lbh",              type: "concept_error", logicTag: "volume_not_area" },
      { text: "6l²",               type: "concept_error", logicTag: "cube_formula" },
    ],
    solutionSteps: [
      "A cuboid has 3 pairs of rectangular faces.",
      "TSA = 2(lb + bh + hl).",
    ],
    shortcut: "TSA of cuboid = 2(lb + bh + hl).",
    bloomLevel: "remember", conceptTested: "Total surface area of a cuboid",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a02",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The lateral surface area of a cylinder with radius r and height h is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "πr²h",    type: "concept_error", logicTag: "volume" },
      { text: "2πr²",    type: "concept_error", logicTag: "two_bases" },
      { text: "2πrh",    type: "correct",       logicTag: "lateral_area_cylinder" },
      { text: "2πr(r+h)", type: "concept_error", logicTag: "total_not_lateral" },
    ],
    solutionSteps: [
      "Lateral (curved) surface area of cylinder = 2πrh.",
      "TSA = 2πrh + 2πr² = 2πr(h+r).",
    ],
    shortcut: "LSA cylinder = 2πrh; TSA = 2πr(r+h).",
    bloomLevel: "remember", conceptTested: "Lateral surface area of cylinder",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a03",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The total surface area of a sphere of radius r is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "πr²",     type: "concept_error", logicTag: "circle_area" },
      { text: "2πr²",    type: "concept_error", logicTag: "hemisphere_curved" },
      { text: "4πr²",    type: "correct",       logicTag: "sphere_surface_area" },
      { text: "(4/3)πr³", type: "concept_error", logicTag: "sphere_volume" },
    ],
    solutionSteps: [
      "Surface area of sphere = 4πr².",
    ],
    shortcut: "Sphere SA = 4πr² (4 times the area of a great circle).",
    bloomLevel: "remember", conceptTested: "Surface area of a sphere",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a04",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The curved surface area of a cone with radius r and slant height l is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "πrl",      type: "correct",       logicTag: "cone_csa" },
      { text: "πr²",      type: "concept_error", logicTag: "base_area" },
      { text: "πr(r+l)",  type: "concept_error", logicTag: "tsa_cone" },
      { text: "(1/3)πr²h", type: "concept_error", logicTag: "cone_volume" },
    ],
    solutionSteps: [
      "Curved Surface Area of cone = πrl, where l = slant height.",
    ],
    shortcut: "CSA cone = πrl; TSA cone = πr(r+l).",
    bloomLevel: "remember", conceptTested: "Curved surface area of a cone",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a05",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cube has side 5 cm. Its total surface area is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "25 cm²",   type: "concept_error", logicTag: "one_face" },
      { text: "150 cm²",  type: "correct",       logicTag: "6_times_25" },
      { text: "125 cm²",  type: "concept_error", logicTag: "volume" },
      { text: "100 cm²",  type: "concept_error", logicTag: "4_faces" },
    ],
    solutionSteps: [
      "TSA of cube = 6a² = 6 × 25 = 150 cm².",
    ],
    shortcut: "TSA cube = 6a².",
    bloomLevel: "apply", conceptTested: "TSA of a cube",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a06",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cylinder has radius 7 cm and height 10 cm. Its lateral surface area (use π = 22/7) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "220 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "440 cm²",  type: "correct",       logicTag: "2_x_22_x_10" },
      { text: "880 cm²",  type: "concept_error", logicTag: "doubled" },
      { text: "154 cm²",  type: "concept_error", logicTag: "base_area" },
    ],
    solutionSteps: [
      "LSA = 2πrh = 2 × (22/7) × 7 × 10 = 2 × 22 × 10 = 440 cm².",
    ],
    shortcut: "2πrh; the 7 in r and 7 in π cancel.",
    bloomLevel: "apply", conceptTested: "LSA of cylinder with given dimensions",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a07",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cone has radius 6 cm and height 8 cm. The slant height is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "8 cm",   type: "concept_error", logicTag: "height" },
      { text: "10 cm",  type: "correct",       logicTag: "pythagoras_6_8_10" },
      { text: "12 cm",  type: "concept_error", logicTag: "double_radius" },
      { text: "14 cm",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "l = √(r²+h²) = √(36+64) = √100 = 10 cm.",
    ],
    shortcut: "Slant height l = √(r²+h²). Recognise 6-8-10 Pythagorean triple.",
    bloomLevel: "apply", conceptTested: "Finding slant height of a cone",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a08",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The total surface area of a hemisphere of radius r is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "2πr²",   type: "concept_error", logicTag: "curved_only" },
      { text: "3πr²",   type: "correct",       logicTag: "curved_plus_base" },
      { text: "4πr²",   type: "concept_error", logicTag: "full_sphere" },
      { text: "πr²",    type: "concept_error", logicTag: "only_base" },
    ],
    solutionSteps: [
      "TSA hemisphere = curved surface + base circle = 2πr² + πr² = 3πr².",
    ],
    shortcut: "TSA hemisphere = 3πr² (2 curved + 1 base).",
    bloomLevel: "apply", conceptTested: "TSA of a hemisphere",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a09",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A sphere and a cube have the same surface area. If cube side is a, the sphere radius r is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "r = a",               type: "concept_error", logicTag: "wrong" },
      { text: "r = a√(6/π)/2",       type: "correct",       logicTag: "4pi_r_sq_equals_6a_sq" },
      { text: "r = a/√π",            type: "concept_error", logicTag: "wrong" },
      { text: "r = a²/4π",           type: "concept_error", logicTag: "wrong_dimension" },
    ],
    solutionSteps: [
      "4πr² = 6a² → r² = 6a²/(4π) = 3a²/(2π).",
      "r = a√(3/(2π)) = a√(6/π)/2. (Both forms are equivalent.)",
    ],
    shortcut: "Set 4πr² = 6a², isolate r.",
    bloomLevel: "analyse", conceptTested: "Comparing sphere and cube surface areas",
  },
  {
    questionId: "ap_ssc9_ch11_surface_a10",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes", subtopic: "Surface Areas of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A metallic sphere of radius 6 cm is melted and recast into small spheres of radius 2 cm. How many small spheres are formed?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "3",    type: "concept_error", logicTag: "ratio_radii" },
      { text: "9",    type: "concept_error", logicTag: "ratio_radii_squared" },
      { text: "27",   type: "correct",       logicTag: "ratio_radii_cubed" },
      { text: "18",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Volume of large sphere = (4/3)π×6³ = (4/3)π×216.",
      "Volume of small sphere = (4/3)π×2³ = (4/3)π×8.",
      "Number = 216/8 = 27.",
    ],
    shortcut: "Number = (R/r)³ = (6/2)³ = 3³ = 27.",
    bloomLevel: "apply", conceptTested: "Recasting sphere into smaller spheres",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch11_volume_of_solids  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch11_volume_a01",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The volume of a cylinder with radius r and height h is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "2πrh",      type: "concept_error", logicTag: "lateral_surface" },
      { text: "πr²h",      type: "correct",       logicTag: "cylinder_volume" },
      { text: "(4/3)πr³",  type: "concept_error", logicTag: "sphere_volume" },
      { text: "πrl",       type: "concept_error", logicTag: "cone_surface" },
    ],
    solutionSteps: [
      "Volume of cylinder = πr²h (base area × height).",
    ],
    shortcut: "V = πr²h.",
    bloomLevel: "remember", conceptTested: "Volume of a cylinder",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a02",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The volume of a cone with radius r and height h is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "πr²h",       type: "concept_error", logicTag: "cylinder_volume" },
      { text: "(1/2)πr²h",  type: "concept_error", logicTag: "wrong_fraction" },
      { text: "(1/3)πr²h",  type: "correct",       logicTag: "cone_volume" },
      { text: "(2/3)πr³",   type: "concept_error", logicTag: "hemisphere_volume" },
    ],
    solutionSteps: [
      "Volume of cone = (1/3)πr²h — one-third of the corresponding cylinder.",
    ],
    shortcut: "V cone = (1/3) × V cylinder = (1/3)πr²h.",
    bloomLevel: "remember", conceptTested: "Volume of a cone",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a03",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "The volume of a sphere of radius r is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "4πr²",       type: "concept_error", logicTag: "surface_area" },
      { text: "(1/3)πr²h",  type: "concept_error", logicTag: "cone_volume" },
      { text: "(4/3)πr³",   type: "correct",       logicTag: "sphere_volume" },
      { text: "2πr³",       type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Volume of sphere = (4/3)πr³.",
    ],
    shortcut: "V sphere = (4/3)πr³.",
    bloomLevel: "remember", conceptTested: "Volume of a sphere",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a04",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cube of side 4 cm has volume:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "16 cm³",   type: "concept_error", logicTag: "squared" },
      { text: "48 cm³",   type: "concept_error", logicTag: "three_times_side" },
      { text: "64 cm³",   type: "correct",       logicTag: "a_cubed" },
      { text: "96 cm³",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Volume of cube = a³ = 4³ = 64 cm³.",
    ],
    shortcut: "V cube = a³.",
    bloomLevel: "apply", conceptTested: "Volume of a cube",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a05",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cylinder has radius 3.5 cm and height 10 cm. Volume (π = 22/7) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "385 cm³",   type: "correct",       logicTag: "22_7_x_3.5_sq_x_10" },
      { text: "770 cm³",   type: "concept_error", logicTag: "doubled" },
      { text: "192.5 cm³", type: "concept_error", logicTag: "halved" },
      { text: "440 cm³",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "V = πr²h = (22/7) × 3.5² × 10 = (22/7) × 12.25 × 10 = 22 × 1.75 × 10 = 385 cm³.",
    ],
    shortcut: "3.5 = 7/2; (22/7)×(7/2)²×10 = (22/7)×(49/4)×10 = 22×(7/4)×10 = 385.",
    bloomLevel: "apply", conceptTested: "Volume of cylinder with fractional radius",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a06",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "Three cones have the same base radius and height as a cylinder. The total volume of the cones is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Half the cylinder",      type: "concept_error", logicTag: "wrong" },
      { text: "Equal to the cylinder",  type: "correct",       logicTag: "3_cones_eq_cylinder" },
      { text: "Double the cylinder",    type: "concept_error", logicTag: "wrong" },
      { text: "One-third cylinder",     type: "concept_error", logicTag: "only_one_cone" },
    ],
    solutionSteps: [
      "Volume of 3 cones = 3 × (1/3)πr²h = πr²h = Volume of cylinder.",
    ],
    shortcut: "3 cones = 1 cylinder (same base and height).",
    bloomLevel: "understand", conceptTested: "Relationship between cone and cylinder volumes",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a07",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A sphere of radius 6 cm is melted and cast into a cylinder of radius 6 cm. The height of the cylinder is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "4 cm",   type: "correct",       logicTag: "4_3_r" },
      { text: "6 cm",   type: "concept_error", logicTag: "radius" },
      { text: "8 cm",   type: "concept_error", logicTag: "diameter" },
      { text: "12 cm",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Volume sphere = (4/3)πr³ = (4/3)π×216 = 288π cm³.",
      "Volume cylinder = πr²h = π×36×h.",
      "288π = 36πh → h = 8 cm.",
    ],
    shortcut: "(4/3)r³ = r²h → h = (4/3)r = (4/3)×6 = 8 cm.",
    bloomLevel: "apply", conceptTested: "Volume conservation: sphere to cylinder",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a08",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "If the radius of a sphere is doubled, its volume becomes:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "2 times",  type: "concept_error", logicTag: "linear_scaling" },
      { text: "4 times",  type: "concept_error", logicTag: "area_scaling" },
      { text: "8 times",  type: "correct",       logicTag: "cubic_scaling" },
      { text: "16 times", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "V ∝ r³. When r doubles: V → (2r)³ = 8r³ → 8 times.",
    ],
    shortcut: "Volume scales as cube of linear dimension: 2³ = 8.",
    bloomLevel: "apply", conceptTested: "Effect of doubling radius on sphere volume",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a09",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cone and a hemisphere have equal base and equal volumes. The height of the cone is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "r",    type: "concept_error", logicTag: "radius" },
      { text: "2r",   type: "correct",       logicTag: "volume_equation" },
      { text: "3r",   type: "concept_error", logicTag: "wrong" },
      { text: "r/2",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "V cone = (1/3)πr²h. V hemisphere = (2/3)πr³.",
      "(1/3)πr²h = (2/3)πr³ → h = 2r.",
    ],
    shortcut: "Set cone volume = hemisphere volume, simplify.",
    bloomLevel: "analyse", conceptTested: "Equal volumes: cone and hemisphere",
  },
  {
    questionId: "ap_ssc9_ch11_volume_a10",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes", subtopic: "Volumes of Solids",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 11,
    questionText: "A cuboid tank (3 m × 2 m × 1.5 m) is filled with water. The volume of water is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "6 m³",    type: "concept_error", logicTag: "2x3_only" },
      { text: "9 m³",    type: "correct",       logicTag: "3x2x1.5" },
      { text: "12 m³",   type: "concept_error", logicTag: "3x2x2" },
      { text: "4.5 m³",  type: "concept_error", logicTag: "2x1.5_only" },
    ],
    solutionSteps: [
      "Volume = l × b × h = 3 × 2 × 1.5 = 9 m³.",
      "1 m³ = 1000 litres → 9000 litres.",
    ],
    shortcut: "V cuboid = l×b×h.",
    bloomLevel: "apply", conceptTested: "Volume of a cuboid (real-world application)",
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
