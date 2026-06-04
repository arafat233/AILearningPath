import mongoose from "mongoose";

// ==================== Note ====================
// App-wide notes & highlights (GAP #3 — Notes / Highlights / Notebook).
// One document per note OR highlight. Works across Pro track AND K-12 content;
// the source context is denormalized (title/url/subject) so the Notebook page
// can list and link everything without cross-collection joins.
//
// type "note"      → freeform markdown in `body`.
// type "highlight" → a selected snippet in `quote` (+ prefix/suffix for
//                    re-anchoring) with an optional annotation in `body`.
const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },

  // ── where it's anchored ──
  scope: { type: String, enum: ["pro", "k12"], required: true },
  kind:  { type: String, enum: ["exercise", "topic", "lesson", "question", "project"], required: true },
  refId: { type: String, required: true },            // exerciseId | topicId | lessonId | questionId | projectId

  // ── denormalized context (for the Notebook list, no joins needed) ──
  trackKey: { type: String, default: null },          // "pro_java" for pro; null for k12
  subject:  { type: String, default: "" },            // k12 subject (e.g. "Science")
  title:    { type: String, default: "", maxlength: 300 }, // cached display title of the source
  url:      { type: String, default: "", maxlength: 500 }, // deep link back to the source

  // ── content ──
  type: { type: String, enum: ["note", "highlight"], default: "note", required: true },
  body: { type: String, default: "", maxlength: 8000 }, // note markdown, or highlight annotation

  // ── highlight-only re-anchoring data (text-quote anchor) ──
  quote:      { type: String, default: "", maxlength: 2000 }, // the exact highlighted text
  prefix:     { type: String, default: "", maxlength: 60 },   // ~text just before, disambiguates
  suffix:     { type: String, default: "", maxlength: 60 },   // ~text just after
  sectionKey: { type: String, default: "" },                 // which content section it lives in
  color:      { type: String, default: "yellow", maxlength: 16 },

  // ── organisation ──
  tags:   [{ type: String, maxlength: 40 }],
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

// Notebook list / filters
noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, scope: 1, kind: 1, refId: 1 }); // fetch all for one item
noteSchema.index({ userId: 1, pinned: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, tags: 1 });
// Full-text search across the notebook
noteSchema.index({ title: "text", body: "text", quote: "text", tags: "text" });

export const Note = mongoose.model("Note", noteSchema);
