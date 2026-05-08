/**
 * Seed: CBSE Class 10 Science — Complete seed runner
 * Runs all Science content seeds in the correct order.
 *
 * Order:
 *   1. seedScienceCurriculum.js       — Chapter model (13 chapters, already seeded)
 *   2. seedScienceTopicDAG.js         — Topic prerequisite graph (50 nodes)
 *   3. seedScienceChemistryContent.js — NcertTopicContent: Ch1-4 (16 topics)
 *   4. seedScienceBiologyContent.js   — NcertTopicContent: Ch5-8,13 (19 topics)
 *   5. seedSciencePhysicsContent.js   — NcertTopicContent: Ch9-12 (15 topics)
 *   6. seedScienceQuestions.js        — 30 original Science MCQs
 *   7. seedScienceChemistryQuestions.js — 60 Chemistry MCQs (Ch1-4)
 *   8. seedScienceBiologyQuestions.js   — 75 Biology MCQs (Ch5-8,13)
 *   9. seedSciencePhysicsQuestions.js   — 60 Physics MCQs (Ch9-12)
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedScienceAll.js
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SCRIPTS = [
  "seedScienceTopicDAG.js",
  "seedScienceChemistryContent.js",
  "seedScienceBiologyContent.js",
  "seedSciencePhysicsContent.js",
  "seedScienceQuestions.js",
  "seedScienceChemistryQuestions.js",
  "seedScienceBiologyQuestions.js",
  "seedSciencePhysicsQuestions.js",
];

async function runScript(name) {
  return new Promise((resolve, reject) => {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`▶ Running: ${name}`);
    console.log("─".repeat(60));

    const child = spawn(process.execPath, [join(__dirname, name)], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✓ ${name} completed`);
        resolve();
      } else {
        reject(new Error(`${name} exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

async function main() {
  console.log("═".repeat(60));
  console.log("  CBSE Class 10 Science — Complete Seed");
  console.log("═".repeat(60));

  for (const script of SCRIPTS) {
    await runScript(script);
  }

  console.log("\n" + "═".repeat(60));
  console.log("  ✓ All Science seeds completed successfully");
  console.log("═".repeat(60));
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
