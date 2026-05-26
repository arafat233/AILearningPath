#!/usr/bin/env node
/**
 * generateProTopic.mjs — bulk content generation for the Java pro-track.
 *
 * Reads:
 *   - content/pro/java/module_specs.json    (module + topic outlines)
 *   - content/pro/java/m1_fundamentals/topics/t1_hello_world/{topic,exercises,project}.json
 *     (the reference example — Claude matches this shape and style)
 *
 * Calls Claude (Anthropic SDK) once per artifact (topic, exercises, project)
 * and writes the resulting JSON to
 *   content/pro/java/<module>/topics/<topic>/{topic,exercises,project}.json
 *
 * Idempotency: refuses to overwrite an existing file unless --force is passed.
 *
 * Usage:
 *   node scripts/generateProTopic.mjs --module m2_variables --topic java_m2_t1
 *   node scripts/generateProTopic.mjs --module m2_variables --topic java_m2_t1 --force
 *   node scripts/generateProTopic.mjs --module m2_variables --topic java_m2_t1 --only topic
 *
 * Flags:
 *   --only <topic|exercises|project>   restrict to a single artifact
 *   --force                            overwrite existing files
 *   --dry-run                          print token estimate + cost, no API call
 *   --model <id>                       override the model (default claude-opus-4-7)
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(BACKEND_ROOT, "content", "pro", "java");
const REFERENCE_DIR = path.join(CONTENT_ROOT, "m1_fundamentals", "topics", "t1_hello_world");

// Anthropic Opus 4.7 pricing (as of 2026-05): $15/M input, $75/M output.
// We track usage and report at the end so the operator sees real cost.
const PRICE = { input: 15 / 1_000_000, output: 75 / 1_000_000 };

function parseArgs(argv) {
  const args = { only: null, force: false, dryRun: false, model: "claude-opus-4-7" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--module")  args.module = argv[++i];
    else if (a === "--topic")   args.topic = argv[++i];
    else if (a === "--only")    args.only = argv[++i];
    else if (a === "--force")   args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--model")   args.model = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log("Usage: node scripts/generateProTopic.mjs --module <id> --topic <id> [--only topic|exercises|project] [--force] [--dry-run] [--model <id>]");
      process.exit(0);
    }
  }
  if (!args.module || !args.topic) {
    console.error("Required: --module <id> --topic <id>");
    process.exit(1);
  }
  return args;
}

async function readJson(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

// ─── Prompts ──────────────────────────────────────────────────────────────────
// Each prompt:
//   1. Names the artifact we want.
//   2. Pastes the Module 1 reference verbatim so Claude matches every field.
//   3. Pastes the module + topic spec so Claude knows what to actually cover.
//   4. Tells Claude to output ONLY raw JSON (no markdown fences, no preface).
const STYLE_GUIDANCE = `Style & pedagogy guardrails (these MUST hold):
- Write fresh material. Do NOT copy phrases verbatim from the reference example
  except where there is a single correct technical term ("public static void main",
  Scanner class name, etc.).
- Pedagogical level: a smart adult learning to program who has just completed
  the previous module. Concrete > abstract. Real example > formal definition.
- Tone: confident, friendly, occasional dry humour, never patronising. Match
  the reference voice: practical, "here's why this matters in real jobs."
- Test cases MUST match what the teaching covers. If the teaching never shows
  Scanner, do not write a Scanner exercise. If you write a code_analysis test
  with must_contain: ["public class Foo"], the starter_code and instructions
  must make "Foo" the obvious class name. Misalignment between teaching and
  test is the #1 bug we are trying to avoid; verify before you finalize.
- Difficulty progression in exercises.json: 3 warmup (fill_blank), 3 easy
  (code_scratch + one predict_output), 3 medium (code_scratch / predict_output
  / debug), 3 hard (code_scratch with multi-part requirements), 3 interview
  (hard difficulty, scenario framed as a real interview question). Exactly 15.
- Exercise ids: java_m<MODULE_NUM>_t<TOPIC_NUM>_ex_<1..15>. Match the topic_id
  prefix exactly.
- Hints: 3-4 per exercise, ordered from gentle nudge → near-spoiler. Never spoil
  in hint 1.
- All snake_case keys, no camelCase in JSON (the seed mapper handles the swap).
- Output ONLY the raw JSON value. No \`\`\`json fence, no preface, no trailing prose.
- Output must be valid JSON the Node JSON.parse() accepts on first try.`;

function topicPrompt(refTopic, moduleSpec, topicSpec) {
  return `You are generating a Java pro-track topic page in JSON form.

The target module is "${moduleSpec.name}" (module_number=${moduleSpec.module_number}).
The target topic is "${topicSpec.name}" (topic_number=${topicSpec.topic_number}, topic_id="${topicSpec.topic_id}").

Concepts the topic MUST cover (these are the assessment-bearing items):
${topicSpec.concepts.map((c, i) => `  ${i + 1}. ${c}`).join("\n")}

Required JSON shape (match every key in the reference EXACTLY — same structure, same nesting):

\`\`\`json
${JSON.stringify(refTopic, null, 2)}
\`\`\`

In particular include these top-level keys: schema_version, topic_id, language ("java"),
module_id ("${moduleSpec.module_number === 1 ? "m1" : `m${moduleSpec.module_number}`}"),
module_name ("${moduleSpec.name}"), topic_number, name, slug, metadata, hook, teaching
(with concept_explanation + syntax_breakdown + optionally print_vs_println-style sub-blocks
+ visual_aid), worked_example, applications (industry_examples + interview_relevance +
real_world_workflow), common_gaps (array of 4-6 items), reflection (key_takeaways +
self_check_questions + next_topic_preview).

For metadata.concepts_taught, list 5-7 snake_case identifiers covering the topic.
For metadata.skills_developed, list 3-5 snake_case identifiers.
For metadata.career_relevance, write 2-3 sentences on where this shows up in a real job.

${STYLE_GUIDANCE}`;
}

function exercisesPrompt(refExercises, moduleSpec, topicSpec, generatedTopic) {
  return `You are generating the exercises file for a Java pro-track topic.

The target topic is "${topicSpec.name}" (topic_id="${topicSpec.topic_id}"). You have
just generated its topic.json (paraphrased teaching summary follows). Generate
exactly 15 exercises that practise exactly the concepts that topic teaches.

Teaching summary you must align tests to:
- Concept explanation:
${(typeof generatedTopic.teaching?.concept_explanation === "object"
    ? Object.values(generatedTopic.teaching.concept_explanation).join("\n  ")
    : String(generatedTopic.teaching?.concept_explanation || "")).slice(0, 2000)}
- Code samples shown:
${Object.entries(generatedTopic.teaching || {})
    .filter(([_, v]) => v && typeof v === "object" && v.code)
    .map(([k, v]) => `  [${k}] ${String(v.code).slice(0, 400)}`)
    .join("\n")}
- Common gaps to test for (these become great "debug" or "predict_output" exercises):
${(generatedTopic.common_gaps || []).map((g, i) => `  ${i + 1}. ${g.gap_id || g.what_students_get_wrong?.slice(0, 80)}`).join("\n")}

Required JSON shape (match the reference EXACTLY):

\`\`\`json
${JSON.stringify(refExercises, null, 2)}
\`\`\`

Concepts the exercises MUST cover, distributed across the 15 items (no concept untested):
${topicSpec.concepts.map((c, i) => `  ${i + 1}. ${c}`).join("\n")}

${STYLE_GUIDANCE}

Exercise distribution requirement:
  ex_1..ex_3   warmup  · fill_blank      · difficulty 1   · xp_reward 10
  ex_4..ex_5   easy    · code_scratch    · difficulty 2   · xp_reward 25
  ex_6         easy    · predict_output  · difficulty 2   · xp_reward 25
  ex_7         easy    · debug           · difficulty 3   · xp_reward 25
  ex_8..ex_9   medium  · code_scratch    · difficulty 3   · xp_reward 40
  ex_10        medium  · predict_output  · difficulty 4   · xp_reward 40
  ex_11        medium  · debug           · difficulty 4   · xp_reward 40
  ex_12..ex_13 hard    · code_scratch    · difficulty 5   · xp_reward 60
  ex_14        hard    · code_scratch    · difficulty 5   · xp_reward 60  (interview-style scenario)
  ex_15        hard    · code_scratch    · difficulty 5   · xp_reward 60  (multi-step / project-light)

Test case rules:
  - fill_blank → code_analysis (must_contain[] + must_compile:true) — at least one must_contain string per blank
  - code_scratch → execution (expected_stdout + must_compile:true) + optional code_analysis
  - predict_output → text_match (expected + normalize_whitespace:false)
  - debug → execution (expected_stdout + must_compile:true)
  - NEVER use test types other than these four.

Exercise IDs:
  java_${moduleSpec.module_number === 1 ? "m1" : `m${moduleSpec.module_number}`}_t${topicSpec.topic_number}_ex_<1..15>

Output: ONLY the raw JSON object with top-level "exercises" array. No markdown fence.`;
}

function projectPrompt(refProject, moduleSpec, topicSpec, generatedTopic) {
  return `You are generating the capstone project for a Java pro-track topic.

The target topic is "${topicSpec.name}" (topic_id="${topicSpec.topic_id}").

The project must:
  - Use ONLY concepts taught in this topic and earlier ones (no forward references)
  - Be solvable in 30-90 minutes by a learner who just finished the topic's 15 exercises
  - Have a real-world scenario (small CLI app, data formatter, calculator-style tool)
  - Include 5-8 numbered requirements; each MUST be testable by inspection or by
    running the program with sample inputs

Required JSON shape (match the reference EXACTLY):

\`\`\`json
${JSON.stringify(refProject, null, 2)}
\`\`\`

Concepts this topic teaches (project must exercise at least 4 of these):
${topicSpec.concepts.map((c, i) => `  ${i + 1}. ${c}`).join("\n")}

${STYLE_GUIDANCE}

Output: ONLY the raw JSON object. No markdown fence.`;
}

// ─── Generation core ──────────────────────────────────────────────────────────
async function generateOne(client, label, prompt, model, dryRun) {
  if (dryRun) {
    const approxInputTokens = Math.ceil(prompt.length / 4);
    console.log(`[dry-run] ${label}: ~${approxInputTokens} input tokens, est cost $${(approxInputTokens * PRICE.input + 4000 * PRICE.output).toFixed(3)}`);
    return { json: null, usage: { input_tokens: approxInputTokens, output_tokens: 0 } };
  }
  const resp = await client.messages.create({
    model,
    max_tokens: 16000,
    messages: [{ role: "user", content: prompt }],
  });
  const text = resp.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  // Strip any accidental markdown fence around the JSON (Claude sometimes wraps).
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
  let json;
  try {
    json = JSON.parse(cleaned);
  } catch (err) {
    const dumpFile = `/tmp/generate-fail-${label}-${Date.now()}.txt`;
    await fs.writeFile(dumpFile, text);
    throw new Error(`${label}: response was not valid JSON (${err.message}). Raw saved to ${dumpFile}`);
  }
  return { json, usage: resp.usage };
}

async function run() {
  const args = parseArgs(process.argv);

  // Load specs and reference
  const specs = await readJson(path.join(CONTENT_ROOT, "module_specs.json"));
  const moduleSpec = specs.modules[args.module];
  if (!moduleSpec) {
    console.error(`Unknown module: ${args.module}. Available: ${Object.keys(specs.modules).join(", ")}`);
    process.exit(1);
  }
  const topicSpec = moduleSpec.topics.find((t) => t.topic_id === args.topic);
  if (!topicSpec) {
    console.error(`Unknown topic: ${args.topic}. Available in ${args.module}: ${moduleSpec.topics.map((t) => t.topic_id).join(", ")}`);
    process.exit(1);
  }

  const [refTopic, refExercises, refProject] = await Promise.all([
    readJson(path.join(REFERENCE_DIR, "topic.json")),
    readJson(path.join(REFERENCE_DIR, "exercises.json")),
    readJson(path.join(REFERENCE_DIR, "project.json")),
  ]);

  const outputDir = path.join(CONTENT_ROOT, args.module, "topics", args.topic.replace(/^java_m\d+_/, ""));
  await fs.mkdir(outputDir, { recursive: true });

  const targets = args.only ? [args.only] : ["topic", "exercises", "project"];
  console.log(`\nGenerating ${targets.join(" + ")} for ${args.module} / ${args.topic}`);
  console.log(`Output dir: ${outputDir}`);
  console.log(`Model: ${args.model}\n`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let totalInput = 0, totalOutput = 0;
  let generatedTopic = null;

  // 1. topic.json
  if (targets.includes("topic")) {
    const outPath = path.join(outputDir, "topic.json");
    if (!args.force && (await exists(outPath))) {
      console.log(`✗ topic.json exists at ${outPath} (pass --force to overwrite)`);
    } else {
      console.log("→ generating topic.json…");
      const t0 = Date.now();
      const { json, usage } = await generateOne(
        client, "topic", topicPrompt(refTopic, moduleSpec, topicSpec), args.model, args.dryRun
      );
      totalInput += usage.input_tokens; totalOutput += usage.output_tokens;
      if (json) {
        await fs.writeFile(outPath, JSON.stringify(json, null, 2) + "\n");
        console.log(`  ✓ wrote topic.json (${usage.input_tokens} in / ${usage.output_tokens} out tokens, ${Date.now() - t0} ms)`);
        generatedTopic = json;
      }
    }
  }

  // exercises + project need the topic content for context. Re-read if we
  // didn't just generate it.
  if (!generatedTopic && (targets.includes("exercises") || targets.includes("project"))) {
    try {
      generatedTopic = await readJson(path.join(outputDir, "topic.json"));
    } catch {
      generatedTopic = refTopic; // fallback to reference
    }
  }

  // 2. exercises.json
  if (targets.includes("exercises")) {
    const outPath = path.join(outputDir, "exercises.json");
    if (!args.force && (await exists(outPath))) {
      console.log(`✗ exercises.json exists at ${outPath} (pass --force to overwrite)`);
    } else {
      console.log("→ generating exercises.json…");
      const t0 = Date.now();
      const { json, usage } = await generateOne(
        client, "exercises", exercisesPrompt(refExercises, moduleSpec, topicSpec, generatedTopic), args.model, args.dryRun
      );
      totalInput += usage.input_tokens; totalOutput += usage.output_tokens;
      if (json) {
        const count = json.exercises?.length || 0;
        await fs.writeFile(outPath, JSON.stringify(json, null, 2) + "\n");
        console.log(`  ✓ wrote exercises.json — ${count} exercises (${usage.input_tokens} in / ${usage.output_tokens} out tokens, ${Date.now() - t0} ms)`);
      }
    }
  }

  // 3. project.json
  if (targets.includes("project")) {
    const outPath = path.join(outputDir, "project.json");
    if (!args.force && (await exists(outPath))) {
      console.log(`✗ project.json exists at ${outPath} (pass --force to overwrite)`);
    } else {
      console.log("→ generating project.json…");
      const t0 = Date.now();
      const { json, usage } = await generateOne(
        client, "project", projectPrompt(refProject, moduleSpec, topicSpec, generatedTopic), args.model, args.dryRun
      );
      totalInput += usage.input_tokens; totalOutput += usage.output_tokens;
      if (json) {
        await fs.writeFile(outPath, JSON.stringify(json, null, 2) + "\n");
        console.log(`  ✓ wrote project.json (${usage.input_tokens} in / ${usage.output_tokens} out tokens, ${Date.now() - t0} ms)`);
      }
    }
  }

  const cost = totalInput * PRICE.input + totalOutput * PRICE.output;
  console.log(`\nDone. Total: ${totalInput} input / ${totalOutput} output tokens · est cost $${cost.toFixed(3)}\n`);
}

run().catch((err) => { console.error(err); process.exit(1); });
