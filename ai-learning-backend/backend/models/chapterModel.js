import mongoose from "mongoose";

const microConceptSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  explanation: { type: String, default: "" },
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  sectionNumber: { type: String, required: true }, // e.g. "1.1"
  title:         { type: String, required: true },
  microConcepts: [microConceptSchema],
}, { _id: false });

const theoremSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  statement: { type: String, default: "" },
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  exerciseNumber: { type: String, required: true }, // e.g. "Exercise 1.1"
  questionCount:  { type: Number, default: 0 },
  types:          [String], // ["MCQ", "Short Answer", "Long Answer"]
}, { _id: false });

const chapterSchema = new mongoose.Schema({
  chapterNumber:  { type: Number, required: true },
  title:          { type: String, required: true },
  subject:        { type: String, required: true, default: "Mathematics" },
  grade:          { type: String, required: true, default: "10" },
  board:          { type: String, default: "CBSE" },
  unit:           { type: String, default: "" },       // e.g. "Algebra"
  examMarks:      { type: Number, default: 0 },
  estimatedWeeks: { type: Number, default: 1 },
  overview:       { type: String, default: "" },
  sections:       [sectionSchema],
  theorems:       [theoremSchema],
  keyFormulas:    [String],
  examTips:       [String],
  exercises:      [exerciseSchema],
}, { timestamps: true });

// Fast lookup by subject + grade (e.g. all Class 10 Math chapters)
chapterSchema.index({ subject: 1, grade: 1, board: 1, chapterNumber: 1 }, { unique: true });

export const Chapter = mongoose.model("Chapter", chapterSchema);
