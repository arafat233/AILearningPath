/**
 * Seed: Mock paper answer keys (14 files → enrich Question.stepByStep + solutionSteps)
 *
 * For each question referenced in an answer key, if the Question document has
 * no stepByStep data yet, update it from the answer key solution.
 * Existing stepByStep data is NOT overwritten (answer keys are supplementary).
 *
 * Safe to re-run — uses $set only where stepByStep is empty.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedMockPaperAnswerKeys.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { Question } from "../models/index.js";

const DATA_DIR = process.env.QUESTIONS_DIR || "C:\\Users\\LENOVO\\Downloads\\Algo for question";

function cleanAnswer(str) {
  if (!str && str !== 0) return "";
  const s = String(str).trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");

  const files = readdirSync(DATA_DIR)
    .filter((f) => f.match(/^mock_paper_ch\d+_answer_key\.json$/))
    .sort();

  console.log(`Found ${files.length} answer-key files`);

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
    let updated = 0;
    let skipped = 0;

    for (const entry of raw.answers ?? []) {
      if (!entry.q_id) continue;

      const solution     = entry.solution ?? [];
      const solutionText = solution.map((s) => s.clean).filter(Boolean);
      const stepByStep   = solution.map((s) => ({
        stepNumber: s.step_number,
        clean:      s.clean,
        voice:      s.voice || "",
      }));

      if (!solutionText.length) { skipped++; continue; }

      // Only update if stepByStep is currently empty on the document
      const result = await Question.updateOne(
        {
          questionId: entry.q_id,
          $or: [
            { stepByStep: { $size: 0 } },
            { stepByStep: { $exists: false } },
            { solutionSteps: { $size: 0 } },
          ],
        },
        {
          $set: {
            stepByStep,
            solutionSteps: solutionText,
            ...(entry.correct_answer ? { correctAnswer: cleanAnswer(entry.correct_answer) } : {}),
          },
        }
      );

      if (result.modifiedCount > 0) { updated++; }
      else { skipped++; }
    }

    totalUpdated += updated;
    totalSkipped += skipped;
    console.log(`  ${file}: ${updated} updated, ${skipped} already had solutions`);
  }

  console.log(`\nAnswer keys: ${totalUpdated} questions enriched, ${totalSkipped} already had data`);
  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
