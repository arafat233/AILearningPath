import { Note } from "../models/noteModels.js";
import { AppError } from "../utils/AppError.js";

// Normalise a tags array: trim, lowercase, dedupe, drop empties, cap at 12.
function cleanTags(tags) {
  if (!Array.isArray(tags)) return undefined;
  const seen = new Set();
  for (const t of tags) {
    if (typeof t !== "string") continue;
    const v = t.trim().toLowerCase().replace(/^#/, "").slice(0, 40);
    if (v) seen.add(v);
  }
  return [...seen].slice(0, 12);
}

// Create a note or highlight.
export async function createNote(userId, payload) {
  const { scope, kind, refId, type = "note" } = payload;
  if (type === "highlight" && !(payload.quote || "").trim()) {
    throw new AppError("A highlight needs a non-empty quote.", 400);
  }
  if (type === "note" && !(payload.body || "").trim()) {
    throw new AppError("A note needs a non-empty body.", 400);
  }
  const doc = await Note.create({
    userId, scope, kind, refId, type,
    trackKey: payload.trackKey ?? null,
    subject: payload.subject || "",
    title: payload.title || "",
    url: payload.url || "",
    body: payload.body || "",
    quote: payload.quote || "",
    prefix: payload.prefix || "",
    suffix: payload.suffix || "",
    sectionKey: payload.sectionKey || "",
    color: payload.color || "yellow",
    tags: cleanTags(payload.tags) || [],
    pinned: !!payload.pinned,
  });
  return doc.toObject();
}

// All notes + highlights for a single source item (to render on its page).
export async function listForItem(userId, kind, refId) {
  return Note.find({ userId, kind, refId }).sort({ createdAt: 1 }).lean();
}

// The Notebook: search + filter + paginate across everything the user saved.
export async function listNotebook(userId, opts = {}) {
  const { q, scope, kind, type, trackKey, subject, tag, pinned } = opts;
  const limit = Math.min(100, Math.max(1, parseInt(opts.limit, 10) || 50));
  const skip = Math.max(0, parseInt(opts.skip, 10) || 0);

  const filter = { userId };
  if (scope) filter.scope = scope;
  if (kind) filter.kind = kind;
  if (type) filter.type = type;
  if (trackKey) filter.trackKey = trackKey;
  if (subject) filter.subject = subject;
  if (tag) filter.tags = tag.trim().toLowerCase().replace(/^#/, "");
  if (pinned !== undefined) filter.pinned = pinned === true || pinned === "true";

  let query;
  if (q && q.trim()) {
    // Escape regex metachars; case-insensitive substring across the visible fields.
    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    query = Note.find({ ...filter, $or: [{ title: rx }, { body: rx }, { quote: rx }, { tags: rx }] });
  } else {
    query = Note.find(filter);
  }
  const [items, total] = await Promise.all([
    query.sort({ pinned: -1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
    (q && q.trim())
      ? Note.countDocuments({ ...filter, $or: [{ title: new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }] }).catch(() => undefined)
      : Note.countDocuments(filter),
  ]);
  return { items, total: total ?? items.length, limit, skip };
}

// Distinct tags for this user (for the filter UI).
export async function listTags(userId) {
  const tags = await Note.distinct("tags", { userId });
  return tags.filter(Boolean).sort();
}

// Counts for the Notebook header.
export async function getStats(userId) {
  const [notes, highlights, pinned] = await Promise.all([
    Note.countDocuments({ userId, type: "note" }),
    Note.countDocuments({ userId, type: "highlight" }),
    Note.countDocuments({ userId, pinned: true }),
  ]);
  return { notes, highlights, pinned, total: notes + highlights };
}

// Update editable fields of a note the user owns.
export async function updateNote(userId, id, patch) {
  const set = {};
  if (patch.body !== undefined) set.body = patch.body;
  if (patch.title !== undefined) set.title = patch.title;
  if (patch.color !== undefined) set.color = patch.color;
  if (patch.pinned !== undefined) set.pinned = !!patch.pinned;
  if (patch.tags !== undefined) set.tags = cleanTags(patch.tags) || [];
  const doc = await Note.findOneAndUpdate({ _id: id, userId }, { $set: set }, { new: true }).lean();
  if (!doc) throw new AppError("Note not found.", 404);
  return doc;
}

// Delete a note the user owns.
export async function deleteNote(userId, id) {
  const r = await Note.deleteOne({ _id: id, userId });
  if (r.deletedCount === 0) throw new AppError("Note not found.", 404);
  return { deleted: true };
}
