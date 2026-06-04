/**
 * auditIdioms.mjs — conformance audit for GAP #7 (Java idioms catalog).
 * Imports the live data file and asserts every idiom is well-formed, ids are
 * unique, and reports counts per category. Malformed/duplicate count must be 0.
 *
 * Usage: node scripts/auditIdioms.mjs   (from ai-learning-frontend/frontend)
 */
import IDIOMS from "../src/data/javaIdioms.js";

const REQUIRED = ["id", "title", "category", "code", "explanation", "whenToUse"];

function problems(d) {
  const p = [];
  for (const f of REQUIRED) if (!d?.[f] || typeof d[f] !== "string" || !d[f].trim()) p.push(`missing/empty ${f}`);
  if (!Array.isArray(d?.tags) || d.tags.length === 0) p.push("no tags");
  if ((d?.explanation || "").length < 20) p.push("explanation too short");
  return p;
}

const byCat = {};
const malformed = [];
const seen = new Set();
const dupes = [];
for (const d of IDIOMS) {
  byCat[d?.category] = (byCat[d?.category] || 0) + 1;
  if (seen.has(d?.id)) dupes.push(d.id); else seen.add(d?.id);
  const p = problems(d);
  if (p.length) malformed.push({ id: d?.id || "(no id)", p });
}

console.log(`\n=== JAVA IDIOMS CATALOG AUDIT ===`);
console.log(`total idioms = ${IDIOMS.length}`);
console.log(`categories:`);
Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a]).forEach((c) => console.log(`  ${String(c).padEnd(16)} ${byCat[c]}`));
console.log(`integrity: malformed = ${malformed.length}${malformed.length ? "" : " ✓"}, duplicate ids = ${dupes.length}${dupes.length ? " → " + dupes.join(",") : " ✓"}`);
if (malformed.length) { malformed.slice(0, 20).forEach((m) => console.log(`  ✗ ${m.id}: ${m.p.join("; ")}`)); }
if (malformed.length || dupes.length) process.exit(1);
