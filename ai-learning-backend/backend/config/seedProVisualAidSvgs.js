/**
 * seedProVisualAidSvgs.js — author real inline SVGs for ProTopic visual_aids whose
 * concept is spatial (not an arrow-flow the <VisualAid> auto-renderer can build).
 * Sets teaching.visual_aid.svg (the new field <VisualAid> renders first). Idempotent
 * ($set the nested path, leaving description/alt_text intact). DSA_ANIMATOR Track-2.
 *
 * SVGs use fill="currentColor" so text/strokes adapt to light/dark theme; box tints
 * use rgba apple-palette colours that read on both.
 *
 * Usage: node config/seedProVisualAidSvgs.js
 */
import "dotenv/config";
import mongoose from "mongoose";

// ── m1_t2 — 8 primitive types as labelled memory boxes ──
function primitivesSvg() {
  const prims = [
    ["byte", "8-bit", "-128 .. 127"], ["short", "16-bit", "-32768 .. 32767"],
    ["int", "32-bit", "+/- 2.1 billion"], ["long", "64-bit", "+/- 9.2e18"],
    ["float", "32-bit", "~7 sig digits"], ["double", "64-bit", "~15 sig digits"],
    ["char", "16-bit", "0 .. 65535"], ["boolean", "1-bit*", "true / false"],
  ];
  let boxes = "";
  prims.forEach((p, i) => {
    const x = 10 + (i % 4) * 180, y = 10 + Math.floor(i / 4) * 105;
    boxes += `<g transform="translate(${x},${y})">`
      + `<rect width="168" height="92" rx="10" fill="rgba(10,132,255,0.10)" stroke="rgba(10,132,255,0.45)"/>`
      + `<text x="12" y="28" font-weight="700" font-size="15">${p[0]}</text>`
      + `<text x="12" y="52" opacity="0.65" font-size="12">${p[1]}</text>`
      + `<text x="12" y="74" opacity="0.65" font-size="11">${p[2]}</text></g>`;
  });
  return `<svg viewBox="0 0 740 220" width="100%" style="max-width:740px;font-family:ui-sans-serif,system-ui" fill="currentColor">${boxes}</svg>`;
}

// ── m1_t3 — operator precedence pyramid (top = evaluated first) ──
function precedenceSvg() {
  const bands = ["( )  grouping", "!  ++  --  (unary)", "*  /  %", "+  -", "<  >  <=  >=  ==  !=", "&&   ||", "=  +=  -=  (assignment)"];
  const H = 36, top = 26, cx = 260;
  let py = "";
  bands.forEach((b, i) => {
    const y = top + i * H;
    const wTop = 90 + i * 58, wBot = 90 + (i + 1) * 58;
    py += `<polygon points="${cx - wTop / 2},${y} ${cx + wTop / 2},${y} ${cx + wBot / 2},${y + H} ${cx - wBot / 2},${y + H}" `
      + `fill="rgba(191,90,242,${(0.07 + i * 0.03).toFixed(2)})" stroke="rgba(191,90,242,0.4)"/>`
      + `<text x="${cx}" y="${y + H / 2 + 4}" text-anchor="middle" font-size="12" font-weight="600">${b}</text>`;
  });
  return `<svg viewBox="0 0 520 ${top + bands.length * H + 26}" width="100%" style="max-width:520px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
    + `<text x="${cx}" y="16" text-anchor="middle" font-size="11" opacity="0.7">evaluated FIRST (highest precedence)</text>${py}`
    + `<text x="${cx}" y="${top + bands.length * H + 18}" text-anchor="middle" font-size="11" opacity="0.7">evaluated LAST</text></svg>`;
}

// ── m2_t5 — factorial(4) call stack (top frame returns first) ──
function callStackSvg() {
  const frames = [["factorial(1)", "returns 1  (base case)"], ["factorial(2)", "2 x 1 = 2"], ["factorial(3)", "3 x 2 = 6"], ["factorial(4)", "4 x 6 = 24"]];
  let st = "";
  frames.forEach((f, i) => {
    const y = 34 + i * 56;
    st += `<g transform="translate(110,${y})">`
      + `<rect width="250" height="46" rx="8" fill="rgba(48,209,88,0.10)" stroke="rgba(48,209,88,0.45)"/>`
      + `<text x="14" y="20" font-weight="700" font-size="13">${f[0]}</text>`
      + `<text x="14" y="38" opacity="0.65" font-size="11">${f[1]}</text></g>`;
  });
  return `<svg viewBox="0 0 430 ${34 + frames.length * 56 + 30}" width="100%" style="max-width:430px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
    + `<text x="14" y="22" font-size="11" opacity="0.7">push down (call) ↓</text>`
    + `<text x="416" y="22" font-size="11" opacity="0.7" text-anchor="end">↑ pop up (return)</text>${st}`
    + `<text x="110" y="${34 + frames.length * 56 + 20}" font-size="11" opacity="0.6">Each frame waits for the one above to return.</text></svg>`;
}

const SVGS = {
  java_m1_t2: primitivesSvg(),
  java_m1_t3: precedenceSvg(),
  java_m2_t5: callStackSvg(),
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0, missing = 0;
  for (const [topicId, svg] of Object.entries(SVGS)) {
    const r = await T.updateOne({ topicId, "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": svg } });
    if (r.matchedCount === 0) { console.error(`✗ ${topicId}: no topic / no visual_aid`); missing++; }
    else { console.log(`✓ ${topicId}: SVG set (${svg.length} chars)`); n++; }
  }
  console.log(`\n✅ visual_aid SVGs: ${n} set${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
