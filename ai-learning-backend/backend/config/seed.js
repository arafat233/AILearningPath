import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question, Topic, Exam } from "../models/index.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_learning");

// ── Topics ──────────────────────────────────────────────────────
await Topic.deleteMany({});
await Topic.insertMany([
  { name:"Algebra Basics",               subject:"Math", grade:"10", prerequisites:[],                                                        examFrequency:0.95, estimatedHours:2, examMarks:6,  realWorldUse:"Foundation for all math; used everywhere",                      whyMatters:"6 marks · needed for every other topic" },
  { name:"Real Numbers",                 subject:"Math", grade:"10", prerequisites:[],                                                        examFrequency:0.85, estimatedHours:2, examMarks:5,  realWorldUse:"Number theory used in cryptography and computing",                whyMatters:"5 marks · asked in Section A every year" },
  { name:"Polynomials",                  subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.8,  estimatedHours:2, examMarks:5,  realWorldUse:"Used in engineering, physics, and computer graphics",             whyMatters:"5 marks · standard MCQ and short-answer topic" },
  { name:"Linear Equations",             subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.85, estimatedHours:3, examMarks:6,  realWorldUse:"Used in finance, economics, and everyday problem-solving",        whyMatters:"6 marks · appears in Section B and word problems" },
  { name:"Quadratic Equations",          subject:"Math", grade:"10", prerequisites:["Linear Equations","Algebra Basics"],                     examFrequency:0.9,  estimatedHours:4, examMarks:8,  realWorldUse:"Used in physics (projectile motion), architecture, and design",    whyMatters:"8 marks · asked every year, often as a long answer" },
  { name:"Arithmetic Progressions",      subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.85, estimatedHours:3, examMarks:6,  realWorldUse:"Used in finance (loan schedules), architecture, and music",        whyMatters:"6 marks · reliable scoring topic with fixed formulas" },
  { name:"Triangles",                    subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.8,  estimatedHours:3, examMarks:6,  realWorldUse:"Foundation of geometry; used in construction and surveying",      whyMatters:"6 marks · proof questions appear every year" },
  { name:"Coordinate Geometry",          subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.75, estimatedHours:3, examMarks:6,  realWorldUse:"Used in GPS, maps, robotics, and computer graphics",               whyMatters:"6 marks · distance and section formula always tested" },
  { name:"Trigonometry",                 subject:"Math", grade:"10", prerequisites:["Algebra Basics","Triangles"],                            examFrequency:0.9,  estimatedHours:4, examMarks:8,  realWorldUse:"Used in physics, construction, navigation, and astronomy",         whyMatters:"8 marks · identities and standard values are must-know" },
  { name:"Applications of Trigonometry", subject:"Math", grade:"10", prerequisites:["Trigonometry"],                                          examFrequency:0.8,  estimatedHours:3, examMarks:5,  realWorldUse:"Used in surveying, architecture, and height/distance problems",    whyMatters:"5 marks · one word problem guaranteed in Section C" },
  { name:"Circles",                      subject:"Math", grade:"10", prerequisites:["Triangles"],                                             examFrequency:0.75, estimatedHours:3, examMarks:5,  realWorldUse:"Used in engineering design, gear systems, and optics",             whyMatters:"5 marks · tangent theorem proof is a high-value question" },
  { name:"Surface Areas & Volumes",      subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.85, estimatedHours:4, examMarks:8,  realWorldUse:"Used in manufacturing, packaging, and architecture",               whyMatters:"8 marks · combination solids question worth 4–5 marks alone" },
  { name:"Statistics",                   subject:"Math", grade:"10", prerequisites:["Algebra Basics"],                                        examFrequency:0.8,  estimatedHours:3, examMarks:6,  realWorldUse:"Used in data analysis, research, economics, and AI/ML",            whyMatters:"6 marks · mean, median, mode always in Section B" },
  { name:"Probability",                  subject:"Math", grade:"10", prerequisites:[],                                                        examFrequency:0.7,  estimatedHours:2, examMarks:4,  realWorldUse:"Used in games, insurance, medicine, and machine learning",         whyMatters:"4 marks · easy marks if formulas are clear" },
  { name:"Areas Related to Circles",     subject:"Math", grade:"10", prerequisites:["Circles","Trigonometry"],                               examFrequency:0.7,  estimatedHours:2, examMarks:4,  realWorldUse:"Used in design, architecture, and land measurement",               whyMatters:"4 marks · sector and segment area problems are predictable" },
]);

// ── Sample Questions ────────────────────────────────────────────
await Question.deleteMany({});
await Question.insertMany([
  { topic:"Algebra Basics", subtopic:"Simplification", questionText:"Simplify: 3a + 5b − a + 2b", difficulty:"easy", difficultyScore:0.25, expectedTime:15,
    options:[{text:"2a + 7b",type:"correct"},{text:"4a + 7b",type:"calculation_error"},{text:"3a + 7b",type:"partial_logic"},{text:"9ab",type:"concept_error"}],
    solutionSteps:["Group: (3a − a) + (5b + 2b)","= 2a + 7b"], shortcut:"Group like terms first (same variable), then add." },

  { topic:"Linear Equations", subtopic:"One variable", questionText:"Solve: 2x + 5 = 15", difficulty:"easy", difficultyScore:0.25, expectedTime:20,
    options:[{text:"x = 5",type:"correct"},{text:"x = 10",type:"concept_error",logicTag:"ignored_constant"},{text:"x = 7.5",type:"calculation_error"},{text:"x = 15",type:"guessing"}],
    solutionSteps:["2x = 15 − 5 = 10","x = 5"], shortcut:"Move constants right (flip sign), then divide by coefficient." },

  { topic:"Linear Equations", subtopic:"Fractions", questionText:"Solve: x/2 + x/3 = 10", difficulty:"hard", difficultyScore:0.75, expectedTime:40,
    options:[{text:"x = 12",type:"correct"},{text:"x = 60",type:"concept_error"},{text:"x = 10",type:"partial_logic"},{text:"x = 20",type:"calculation_error"}],
    solutionSteps:["LCM of 2 and 3 = 6","Multiply by 6: 3x + 2x = 60","5x = 60 → x = 12"], shortcut:"Multiply both sides by LCM to clear all fractions." },

  { topic:"Quadratic Equations", subtopic:"Factorization", questionText:"Solve: x² − 5x + 6 = 0", difficulty:"easy", difficultyScore:0.3, expectedTime:20,
    options:[{text:"x = 2, 3",type:"correct"},{text:"x = −2, −3",type:"calculation_error"},{text:"x = 1, 6",type:"concept_error"},{text:"x = 3 only",type:"partial_logic"}],
    solutionSteps:["(x − 2)(x − 3) = 0","x = 2 or x = 3"], shortcut:"Find factors of c that add to b (with signs)." },

  { topic:"Quadratic Equations", subtopic:"Discriminant", questionText:"Find nature of roots: x² + 4x + 5 = 0", difficulty:"medium", difficultyScore:0.6, expectedTime:25,
    options:[{text:"No real roots",type:"correct"},{text:"Two equal roots",type:"concept_error"},{text:"Two distinct roots",type:"calculation_error"},{text:"Cannot determine",type:"partial_logic"}],
    solutionSteps:["D = 4² − 4(1)(5) = 16 − 20 = −4","D < 0 → no real roots"], shortcut:"Calculate D first — it tells you everything." },

  { topic:"Trigonometry", subtopic:"Basic ratios", questionText:"Find sin(30°)", difficulty:"easy", difficultyScore:0.2, expectedTime:12,
    options:[{text:"1/2",type:"correct"},{text:"√3/2",type:"concept_error",logicTag:"gave_cos60"},{text:"1/√3",type:"calculation_error"},{text:"1",type:"partial_logic"}],
    solutionSteps:["sin(30°) = 1/2 (standard value)"], shortcut:"sin values: 0, 1/2, 1/√2, √3/2, 1 for 0°,30°,45°,60°,90°" },

  { topic:"Real Numbers", subtopic:"HCF and LCM", questionText:"Find HCF of 12 and 18", difficulty:"easy", difficultyScore:0.25, expectedTime:20,
    options:[{text:"6",type:"correct"},{text:"36",type:"concept_error",logicTag:"gave_lcm"},{text:"12",type:"calculation_error"},{text:"3",type:"partial_logic"}],
    solutionSteps:["12 = 2² × 3","18 = 2 × 3²","HCF = 2 × 3 = 6"], shortcut:"HCF × LCM = product of numbers" },

  { topic:"Arithmetic Progressions", subtopic:"nth term", questionText:"AP: a=3, d=4. Find 8th term.", difficulty:"easy", difficultyScore:0.3, expectedTime:20,
    options:[{text:"31",type:"correct"},{text:"35",type:"concept_error",logicTag:"used_n_not_n_minus_1"},{text:"32",type:"calculation_error"},{text:"28",type:"partial_logic"}],
    solutionSteps:["a₈ = 3 + (8−1)×4 = 3 + 28 = 31"], shortcut:"an = a + (n−1)d — always (n−1), never n!" },
]);

// ── Exams ────────────────────────────────────────────────────────
await Exam.deleteMany({});
await Exam.insertMany([
  { title:"Weekly Linear Equations Challenge", topic:"Linear Equations",     totalQuestions:8,  duration:20, questionDistribution:{ easy:3, medium:3, hard:2 }, negativeMarking:false },
  { title:"Quadratic Equations Sprint",         topic:"Quadratic Equations",  totalQuestions:8,  duration:20, questionDistribution:{ easy:3, medium:3, hard:2 }, negativeMarking:false },
  { title:"Trigonometry Showdown",              topic:"Trigonometry",          totalQuestions:8,  duration:20, questionDistribution:{ easy:3, medium:3, hard:2 }, negativeMarking:false },
  { title:"Full Mixed Paper (CBSE Style)",      topic:"Linear Equations",      totalQuestions:10, duration:30, questionDistribution:{ easy:4, medium:4, hard:2 }, negativeMarking:false },
]);

console.log("✅ Seed complete: 15 topics, sample questions, 4 exams");
await mongoose.disconnect();
