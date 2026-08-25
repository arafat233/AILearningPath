import mongoose from "mongoose";

// ── Chat-with-own-uploads (Open-Notebook "U" track) ─────────────────────────
// A UserSource is one uploaded document (PDF / txt / md / pasted text).
// Its text is split into UserChunks — the per-user mirror of NcertChunk —
// retrieved via the same Mongo $text mechanism ragStore uses, always
// filtered by userId (uploads are private to their owner).

const userSourceSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name:       { type: String, required: true, trim: true, maxlength: 200 },
  mime:       { type: String, enum: ["application/pdf", "text/plain", "text/markdown"], required: true },
  bytes:      { type: Number, default: 0 },
  pages:      { type: Number, default: 0 },       // PDFs only
  chunkCount: { type: Number, default: 0 },
  subject:    { type: String, default: "" },       // optional user-assigned subject
  status:     { type: String, enum: ["ready", "failed"], default: "ready" },
}, { timestamps: true });

const userChunkSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sourceId:   { type: mongoose.Schema.Types.ObjectId, ref: "UserSource", required: true, index: true },
  sourceName: { type: String, default: "" },       // denormalized for citation labels
  chunkIndex: { type: Number, required: true },
  text:       { type: String, required: true },
  subject:    { type: String, default: "" },
}, { timestamps: true });

// Same retrieval mechanism as NcertChunk: full-text index; queries always
// add { userId } so the index serves only the owner's material.
userChunkSchema.index({ text: "text" });
userChunkSchema.index({ userId: 1, sourceId: 1, chunkIndex: 1 }, { unique: true });

export const UserSource = mongoose.model("UserSource", userSourceSchema);
export const UserChunk  = mongoose.model("UserChunk", userChunkSchema);
