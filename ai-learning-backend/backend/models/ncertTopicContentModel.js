import mongoose from "mongoose";

const ncertTopicContentSchema = new mongoose.Schema({
  topicId:                { type: String, required: true, unique: true }, // e.g. "ch1_s1_c1_t1"
  chapterNumber:          { type: Number, required: true },
  name:                   { type: String, required: true },
  prerequisite_knowledge: [String],
  key_formulas:           [mongoose.Schema.Types.Mixed],
  teaching_content:       { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const NcertTopicContent = mongoose.model("NcertTopicContent", ncertTopicContentSchema);
