// ============================================================
// UPLOAD SERVICE — "chat with your own notes" (Open-Notebook U)
//
// Students upload coaching notes / PDFs / pasted text; we extract
// text, sanitize it (uploaded content is UNTRUSTED — it gets
// injected into Claude prompts), chunk it, and store per-user
// UserChunks retrievable alongside NCERT chunks.
// ============================================================

import { UserSource, UserChunk } from "../models/userChunkModels.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const LIMITS = {
  maxBytes: 8 * 1024 * 1024,   // raw file cap (route JSON cap is higher for base64)
  maxPages: 60,                // PDF page cap
  maxSources: 20,              // per user
  maxChunksPerSource: 400,
};

// ── U5: prompt-injection defense ────────────────────────────────────────────
// Uploaded text is untrusted and ends up inside a Claude system prompt.
// Neutralize instruction-hijack lines rather than rejecting the file —
// legit study notes can mention "instructions"; we only defang the
// classic hijack patterns by breaking their imperative form.
const INJECTION_PATTERNS = [
  /ignore\s+(previous|above|all|prior)\s+(instructions?|prompts?|rules?)/gi,
  /disregard\s+(previous|above|all|prior)/gi,
  /you\s+are\s+now\s+(?!expected)/gi,
  /system\s*prompt/gi,
  /act\s+as\s+(if\s+you|a\s+different)/gi,
  /\bdo\s+anything\s+now\b/gi,
  /pretend\s+(you|to)\s+/gi,
];
export function sanitizeUploadText(text) {
  let out = String(text || "");
  for (const p of INJECTION_PATTERNS) out = out.replace(p, (m) => `[${m.replace(/\s+/g, "-")}]`);
  // Strip control chars that can smuggle formatting into prompts
  return out.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ");
}

// ── Chunker — ~1200 chars with 150 overlap, split on paragraph/sentence ─────
export function chunkText(text, size = 1200, overlap = 150) {
  const clean = String(text || "").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!clean) return [];
  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    let end = Math.min(start + size, clean.length);
    if (end < clean.length) {
      // prefer to break at a paragraph, else sentence, else word boundary
      const para = clean.lastIndexOf("\n\n", end);
      const sent = clean.lastIndexOf(". ", end);
      const word = clean.lastIndexOf(" ", end);
      const cut = para > start + size / 2 ? para : sent > start + size / 2 ? sent + 1 : word > start ? word : end;
      end = cut;
    }
    const piece = clean.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= clean.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}

// ── Text extraction ─────────────────────────────────────────────────────────
async function extractText({ mime, buffer, text }) {
  if (mime === "application/pdf") {
    const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
    const parsed = await pdfParse(buffer, { max: LIMITS.maxPages });
    if (parsed.numpages > LIMITS.maxPages) {
      throw new AppError(`PDF too long — max ${LIMITS.maxPages} pages.`, 422);
    }
    return { text: parsed.text || "", pages: parsed.numpages || 0 };
  }
  return { text: String(text ?? buffer?.toString("utf8") ?? ""), pages: 0 };
}

// ── Create a source from an upload ──────────────────────────────────────────
// input: { name, mime, dataBase64? (pdf), text? (txt/md), subject? }
export async function createSource(userId, { name, mime, dataBase64, text, subject = "" }) {
  const count = await UserSource.countDocuments({ userId });
  if (count >= LIMITS.maxSources) {
    throw new AppError(`Upload limit reached (${LIMITS.maxSources} sources). Delete one first.`, 422);
  }

  let buffer = null;
  if (mime === "application/pdf") {
    if (!dataBase64) throw new AppError("PDF uploads need dataBase64.", 422);
    buffer = Buffer.from(dataBase64, "base64");
    if (buffer.length > LIMITS.maxBytes) throw new AppError("File too large (max 8MB).", 422);
  }

  const extracted = await extractText({ mime, buffer, text });
  const sanitized = sanitizeUploadText(extracted.text);
  const chunks = chunkText(sanitized).slice(0, LIMITS.maxChunksPerSource);
  if (!chunks.length) throw new AppError("No readable text found in this file.", 422);

  const source = await UserSource.create({
    userId, name, mime, subject,
    bytes: buffer ? buffer.length : (text || "").length,
    pages: extracted.pages,
    chunkCount: chunks.length,
  });
  try {
    await UserChunk.insertMany(chunks.map((c, i) => ({
      userId, sourceId: source._id, sourceName: name, chunkIndex: i, text: c, subject,
    })));
  } catch (err) {
    await UserSource.deleteOne({ _id: source._id });      // no orphan sources
    await UserChunk.deleteMany({ sourceId: source._id }); // no partial chunks
    throw err;
  }
  logger.info("User source uploaded", { userId, sourceId: source._id.toString(), chunks: chunks.length });
  return { id: source._id, name, chunkCount: chunks.length, pages: extracted.pages };
}

export async function listSources(userId) {
  return UserSource.find({ userId }).sort({ createdAt: -1 })
    .select("name mime bytes pages chunkCount subject status createdAt").lean();
}

export async function deleteSource(userId, sourceId) {
  const src = await UserSource.findOne({ _id: sourceId, userId });
  if (!src) throw new AppError("Source not found.", 404);
  await UserChunk.deleteMany({ sourceId: src._id, userId });
  await UserSource.deleteOne({ _id: src._id });
  return { deleted: true };
}

// ── U4: retrieval — the per-user mirror of ragStore.retrieveContext ────────
// Returns { context, sources } or null. Callers blend this with the NCERT
// block, labeled by origin, so citations can distinguish "your notes".
export async function retrieveUserContext(userId, questionText, topN = 3) {
  try {
    if (!userId) return null;
    const searchTerms = String(questionText || "")
      .replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 3).slice(0, 12).join(" ");
    if (!searchTerms) return null;

    const chunks = await UserChunk.find(
      { $text: { $search: searchTerms }, userId },
      { score: { $meta: "textScore" }, text: 1, sourceName: 1, chunkIndex: 1 }
    ).sort({ score: { $meta: "textScore" } }).limit(topN).lean();

    if (!chunks.length) return null;
    const context = chunks
      .map((c) => `[From the student's own notes: "${c.sourceName}"]\n${c.text}`)
      .join("\n\n---\n\n");
    return { context, sources: chunks.map((c) => ({ sourceName: c.sourceName, chunkIndex: c.chunkIndex })) };
  } catch (err) {
    logger.warn("retrieveUserContext failed (non-blocking)", { error: err.message });
    return null; // best-effort, mirrors ragStore
  }
}
