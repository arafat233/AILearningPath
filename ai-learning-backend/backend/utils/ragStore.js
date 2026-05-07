// ============================================================
// RAG STORE — NCERT knowledge retrieval for Claude context
//
// Queries the NcertChunk collection using MongoDB full-text
// search. Returns top-N matching chunks as a formatted string
// ready to inject into a Claude system prompt.
//
// Best-effort: any error returns null so Claude calls never block.
// ============================================================

import { NcertChunk } from "../models/index.js";
import logger from "./logger.js";

// Stellar uses short subject names; MongoDB stores full names
const SUBJECT_MAP = {
  Math:            "Mathematics",
  Mathematics:     "Mathematics",
  Science:         "Science",
  English:         "English",
  "Social Science":"Social Science",
  Hindi:           "Hindi",
};

/**
 * Retrieve the most relevant NCERT chunks for a given question.
 * @param {string} questionText  - the question the student got wrong
 * @param {string} subject       - e.g. "Math"
 * @param {number} topN          - how many chunks to return (default 3)
 * @returns {string|null}        - formatted context block, or null if nothing found
 */
export async function retrieveContext(questionText, subject = "Math", topN = 3) {
  try {
    const storedSubject = SUBJECT_MAP[subject] || subject;

    // Build a clean search query: strip special chars, keep meaningful words
    const searchTerms = questionText
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 12)                   // limit to 12 terms to avoid query bloat
      .join(" ");

    if (!searchTerms) return null;

    const chunks = await NcertChunk.find(
      {
        $text: { $search: searchTerms },
        subject: storedSubject,
      },
      { score: { $meta: "textScore" }, text: 1, chapterTitle: 1, conceptName: 1, source: 1, chunkType: 1 }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(topN)
      .lean();

    if (!chunks.length) return null;

    const formatted = chunks
      .map((c) => {
        const label = [c.chapterTitle, c.conceptName].filter(Boolean).join(" — ");
        return `[${label || "NCERT"}]\n${c.text}`;
      })
      .join("\n\n---\n\n");

    logger.info("RAG context retrieved", { subject, chunks: chunks.length, searchTerms: searchTerms.slice(0, 60) });
    return formatted;
  } catch (err) {
    logger.warn("RAG retrieval failed — proceeding without context", { err: err.message });
    return null;
  }
}
