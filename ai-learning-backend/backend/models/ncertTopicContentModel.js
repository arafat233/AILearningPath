import mongoose from "mongoose";

const ncertTopicContentSchema = new mongoose.Schema({
  topicId:                { type: String, required: true, unique: true }, // e.g. "cbse_math10_ch1_euclid_division_lemma" or "sci_ch1_signs_and_types"
  subject:                { type: String, default: "Mathematics" },       // "Mathematics" | "Science" | etc.
  chapterNumber:          { type: Number, required: true },
  name:                   { type: String, required: true },
  prerequisite_knowledge: [String],
  key_formulas:           [mongoose.Schema.Types.Mixed],
  teaching_content:       { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const NcertTopicContent = mongoose.model("NcertTopicContent", ncertTopicContentSchema);
