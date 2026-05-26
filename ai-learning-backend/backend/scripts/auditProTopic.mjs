#!/usr/bin/env node
/**
 * auditProTopic.mjs — verifies generated topic content is coherent.
 *
 * For each exercise in <topic-dir>/exercises.json, asks Claude (Haiku — cheap)
 * to score 0-10 on three axes:
 *   1. alignment   — does the topic's teaching cover what this exercise tests?
 *   2. difficulty  — is the declared level (warmup/easy/medium/hard) accurate?
 *   3. correctness — do the test cases actually verify the expected_solution?
 *                    (e.g. expected_stdout = what the expected_solution prints?)
 *
 * Flags anything <7 on any axis as "needs review" with a one-line reason.
 *
 * Usage:
 *   node scripts/auditProTopic.mjs --topic-dir content/pro/java/m2_variables/topics/t1_primitives
 *   node scripts/auditProTopic.mjs --topic-dir <path> --dry-run
 *
 * Output: prints a per-exercise table + a JSON report to stdout, plus writes
 * <topic-dir>/audit-report.json so the operator can diff between runs.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, "..");

// Haiku pricing (claude-haiku-4-5-20251001): $1/M input, $5/M output.
const PRICE = { input: 1 / 1_000_000, output: 5 / 1_000_000 };

function parseArgs(argv) {
  const args = { dryRun: false, model: "claude-haiku-4-5-20251001", threshold: 7 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--topic-dir") args.topicDir = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--model")   args.model = argv[++i];
    else if (a === "--threshold") args.threshold = Number(argv[++i]);
    else if (a === "--help" || a === "-h") {
      console.log("Usage: node scripts/auditProTopic.mjs --topic-dir <path> [--threshold 7] [--model <id>] [--dry-run]");
      process.exit(0);
    }
  }
  if (!args.topicDir) { console.error("Required: --topic-dir <path>"); process.exit(1); }
  return args;
}

async function readJson(p) { return JSON.parse(await fs.readFile(p, "utf8")); }

function auditPrompt(topic, exercise) {
  // Summarise the teaching content concisely so we don't blow input tokens.
  const teachingSummary = (() => {
    const t = topic.teaching || {};
    const parts = [];
    if (t.concept_explanation) {
      const ce = t.concept_explanation;
      if (typeof ce === "string") parts.push(`Concept: ${ce.slice(0, 800)}`);
      else parts.push(`Concept: intro=${(ce.intro || "").slice(0, 500)} | why=${(ce.why_it_matters || "").slice(0, 300)}`);
    }
    for (const [k, v] of Object.entries(t)) {
      if (v && typeof v === "object" && v.code) parts.push(`Code sample (${k}):\n${v.code}`);
    }
    return parts.join("\n\n");
  })();

  const concepts = (topic.metadata?.concepts_taught || []).join(", ");
  const ex = exercise;

  return `You are auditing a Java pro-track exercise for content quality.
Score it 0-10 on each of three axes. Output ONLY raw JSON (no markdown fence).

The topic this exercise belongs to teaches: ${concepts || "(unspecified)"}

Teaching content the topic shows the student BEFORE this exercise:
---
${teachingSummary.slice(0, 4000)}
---

Exercise to audit:
  id:            ${ex.id}
  level:         ${ex.level}
  type:          ${ex.type}
  difficulty:    ${ex.difficulty} (1=warmup, 5=hard)
  title:         ${ex.title}
  scenario:      ${ex.scenario || "(none)"}
  instructions:  ${ex.instructions || "(none)"}
  starter_code:
${(ex.starter_code || "(none)").split("\n").map((l) => "    " + l).join("\n")}
  expected_solution:
${(ex.expected_solution || "(none)").split("\n").map((l) => "    " + l).join("\n")}
  test_cases:    ${JSON.stringify(ex.test_cases || [])}
  hints:         ${JSON.stringify(ex.hints || [])}

Score each axis 0-10 (10 = perfect, 7 = acceptable, <7 = needs review):

  alignment   — Does the teaching content above actually teach what this exercise
                tests? Penalise if the exercise uses a concept (Scanner, arrays,
                ifs, etc.) that never appears in teaching. Reward if it directly
                practises a code sample shown in teaching.

  difficulty  — Is the declared level accurate? warmup must be solvable in <60s
                by someone who just read the teaching. hard should require
                combining multiple concepts. Penalise warmups that are actually
                medium, and hards that are actually easy.

  correctness — Do the test_cases actually verify the expected_solution?
                For "execution" with expected_stdout: mentally trace
                expected_solution — does it print exactly that?
                For "code_analysis" with must_contain: does expected_solution
                contain every required substring?
                For "text_match": is the expected value a plausible answer to
                the question being asked?

Output shape (strict — no extra keys, no markdown):
{
  "exercise_id": "${ex.id}",
  "alignment":   { "score": <0-10>, "reason": "one short sentence" },
  "difficulty":  { "score": <0-10>, "reason": "one short sentence" },
  "correctness": { "score": <0-10>, "reason": "one short sentence" }
}`;
}

async function auditOne(client, topic, exercise, model, dryRun) {
  if (dryRun) {
    const inT = Math.ceil(auditPrompt(topic, exercise).length / 4);
    return { result: null, usage: { input_tokens: inT, output_tokens: 200 } };
  }
  const resp = await client.messages.create({
    model,
    max_tokens: 600,
    messages: [{ role: "user", content: auditPrompt(topic, exercise) }],
  });
  const text = resp.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();
  let result;
  try { result = JSON.parse(cleaned); }
  catch (e) { result = { exercise_id: exercise.id, parse_error: e.message, raw: text.slice(0, 500) }; }
  return { result, usage: resp.usage };
}

function fmtScore(s) {
  if (typeof s?.score !== "number") return "  ?";
  const v = s.score;
  const color = v >= 9 ? "\x1b[32m" : v >= 7 ? "\x1b[33m" : "\x1b[31m";
  return `${color}${v.toFixed(0).padStart(3)}\x1b[0m`;
}

async function run() {
  const args = parseArgs(process.argv);
  const topicDir = path.resolve(BACKEND_ROOT, args.topicDir);
  const topic     = await readJson(path.join(topicDir, "topic.json"));
  const exercisesFile = await readJson(path.join(topicDir, "exercises.json"));
  const exercises = exercisesFile.exercises || [];

  console.log(`\nAuditing ${exercises.length} exercises in ${topicDir}`);
  console.log(`Topic: ${topic.name} (${topic.topic_id})`);
  console.log(`Model: ${args.model}\n`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const results = [];
  let totalInput = 0, totalOutput = 0;

  console.log("ID                          ALN DIF COR  FLAGS");
  console.log("──────────────────────────────────────────────");
  for (const ex of exercises) {
    const t0 = Date.now();
    const { result, usage } = await auditOne(client, topic, ex, args.model, args.dryRun);
    totalInput += usage.input_tokens; totalOutput += usage.output_tokens;
    if (!result || result.parse_error) {
      console.log(`${ex.id.padEnd(28)}  ?   ?   ?   parse error`);
      results.push({ exercise_id: ex.id, error: result?.parse_error || "no result" });
      continue;
    }
    const aln = result.alignment?.score   ?? 0;
    const dif = result.difficulty?.score  ?? 0;
    const cor = result.correctness?.score ?? 0;
    const flags = [];
    if (aln < args.threshold) flags.push(`aln:${result.alignment?.reason}`);
    if (dif < args.threshold) flags.push(`dif:${result.difficulty?.reason}`);
    if (cor < args.threshold) flags.push(`cor:${result.correctness?.reason}`);
    const flagsSummary = flags.length ? `\n   ⚠ ${flags.join(" | ")}` : "";
    console.log(`${ex.id.padEnd(28)} ${fmtScore(result.alignment)} ${fmtScore(result.difficulty)} ${fmtScore(result.correctness)}${flagsSummary}`);
    results.push(result);
  }

  const cost = totalInput * PRICE.input + totalOutput * PRICE.output;
  const summary = {
    topic_id: topic.topic_id,
    audited_at: new Date().toISOString(),
    threshold: args.threshold,
    total_exercises: exercises.length,
    flagged: results.filter((r) =>
      [r.alignment?.score, r.difficulty?.score, r.correctness?.score].some((s) => typeof s === "number" && s < args.threshold)
    ).length,
    results,
    usage: { input_tokens: totalInput, output_tokens: totalOutput, est_usd: Number(cost.toFixed(4)) },
  };

  const reportPath = path.join(topicDir, "audit-report.json");
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2) + "\n");

  console.log(`\nFlagged ${summary.flagged} / ${summary.total_exercises} exercises (threshold ${args.threshold}).`);
  console.log(`Report: ${reportPath}`);
  console.log(`Cost: ${totalInput} input / ${totalOutput} output tokens · $${cost.toFixed(4)}\n`);
}

run().catch((err) => { console.error(err); process.exit(1); });
