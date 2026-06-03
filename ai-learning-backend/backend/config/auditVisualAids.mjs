/**
 * auditVisualAids.mjs — ground-truth audit for pro_java teaching.visual_aid.
 * Verifies, from the live DB, that every topic's visual aid is a REAL diagram
 * (not a text-in-boxes panel) when its brief describes one. This is the check
 * that surfaced the m2_t1 / Scanner "panel instead of diagram" bug.
 *
 * Usage: node config/auditVisualAids.mjs
 *   prod: docker exec ailearningpath-api-1 node config/auditVisualAids.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const C = (s, re) => (s.match(re) || []).length;
const isRealDiagram = (svg) => /<marker/.test(svg) || (C(svg, /<line/g) + C(svg, /<polyline/g) + C(svg, /<polygon/g) + C(svg, /<circle/g)) > 0;
const briefWantsDiagram = (d) => /arrow|flow|→|->|points to|leads to|diagram show|before.*after|comparison diagram|branches|connect|venn|state machine|timeline|tree|hierarchy|table|graph|curve|matrix|grid/i.test(d || "");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  const all = await T.find({ topicId: /^java_/ }).project({ topicId: 1, name: 1, "teaching.visual_aid": 1 }).toArray();
  const withVA = all.filter((t) => t.teaching && t.teaching.visual_aid);
  const withSvg = withVA.filter((t) => t.teaching.visual_aid.svg);
  const realDiagram = withSvg.filter((t) => isRealDiagram(t.teaching.visual_aid.svg));
  const textPanel = withSvg.filter((t) => !isRealDiagram(t.teaching.visual_aid.svg));
  const mismatch = textPanel.filter((t) => briefWantsDiagram(t.teaching.visual_aid.description));

  console.log(`\n=== VISUAL AID AUDIT (pro_java) ===`);
  console.log(`topics=${all.length}  with visual_aid=${withVA.length}  with svg=${withSvg.length}`);
  console.log(`  real diagrams (shapes/arrows): ${realDiagram.length}`);
  console.log(`  text-panel svgs (rect+text only): ${textPanel.length}`);
  console.log(`  ⬅ MISMATCH (text-panel but brief describes a diagram): ${mismatch.length}`);
  if (mismatch.length) mismatch.forEach((t) => console.log(`     ${t.topicId} — ${t.name}`));
  const noVA = all.filter((t) => !(t.teaching && t.teaching.visual_aid));
  console.log(`  topics with NO visual_aid: ${noVA.length}${noVA.length ? " (e.g. " + noVA.slice(0, 3).map((t) => t.topicId).join(", ") + " …)" : ""}`);
  console.log(mismatch.length === 0 ? "\n✅ no panel-instead-of-diagram cases" : "\n❌ fix the MISMATCH topics above");
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
