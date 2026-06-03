/**
 * seedProVisualAidM1t2.js — re-author java_m1_t2 (Variables & Data Types).
 * Brief asks for 8 primitive boxes GROUPED by category (integers / decimals /
 * other) with type, size, range AND an example value, plus a String box on the
 * right labeled "reference type — points to memory elsewhere". The old SVG was
 * a flat grid with no grouping, no examples, and no String box.
 * Idempotent. Usage: node config/seedProVisualAidM1t2.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.13)", "rgba(255,159,10,0.14)", "rgba(191,90,242,0.11)"];
const STRK = ["rgba(10,132,255,0.5)", "rgba(48,209,88,0.55)", "rgba(255,159,10,0.6)", "rgba(191,90,242,0.5)"];
const FG = ["#0a84ff", "#1f9f4a", "#d68a00", "#a44bd6"];
const ARR = "rgba(140,140,148,0.95)";

const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 400}" text-anchor="${o.a || "start"}" opacity="${o.o ?? 1}"${o.fill ? ` fill="${o.fill}"` : ""}${o.mono ? ' font-family="ui-monospace,Menlo,monospace"' : ""}>${esc(t)}</text>`;
const box = (x, y, w, h, ci, rx = 10) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`;

// primitive box: name / size / range / example
const prim = (x, y, name, size, range, ex, ci) =>
  box(x, y, 132, 80, ci)
  + txt(x + 12, y + 23, name, { w: 700, s: 14 })
  + txt(x + 12, y + 40, size, { s: 10.5, o: 0.6 })
  + txt(x + 12, y + 56, range, { s: 9.5, o: 0.8 })
  + txt(x + 12, y + 73, "e.g. " + ex, { mono: true, s: 9.5, fill: FG[ci] });

function build() {
  let g = "";
  // category: Integers (blue)
  g += txt(14, 24, "Integers", { w: 700, s: 12, fill: FG[0] });
  const ints = [["byte", "8-bit", "−128 .. 127", "100"], ["short", "16-bit", "−32768 .. 32767", "30000"], ["int", "32-bit", "± 2.1 billion", "2_000_000"], ["long", "64-bit", "± 9.2e18", "9_000_000_000L"]];
  ints.forEach((p, i) => g += prim(14 + i * 146, 32, p[0], p[1], p[2], p[3], 0));
  // category: Decimals (green)
  g += txt(14, 142, "Decimals", { w: 700, s: 12, fill: FG[1] });
  const decs = [["float", "32-bit", "~7 sig digits", "3.14f"], ["double", "64-bit", "~15 sig digits", "3.14159"]];
  decs.forEach((p, i) => g += prim(14 + i * 146, 150, p[0], p[1], p[2], p[3], 1));
  // category: Other (orange)
  g += txt(306, 142, "Other", { w: 700, s: 12, fill: FG[2] });
  const oth = [["char", "16-bit", "0 .. 65535", "'A'"], ["boolean", "1-bit*", "true / false", "true"]];
  oth.forEach((p, i) => g += prim(306 + i * 146, 150, p[0], p[1], p[2], p[3], 2));
  g += txt(306, 244, "*boolean's true size is JVM-dependent", { s: 8.5, o: 0.55 });
  // String reference type (purple, right)
  g += box(602, 32, 146, 116, 3);
  g += txt(675, 56, "String", { a: "middle", w: 700, s: 15 });
  g += txt(675, 76, "reference type", { a: "middle", s: 10, o: 0.75 });
  g += txt(614, 100, "the variable holds a", { s: 9, o: 0.8 });
  g += txt(614, 114, "POINTER, not the data", { s: 9, o: 0.8 });
  g += txt(675, 138, '"Aisha"', { a: "middle", mono: true, s: 11, fill: FG[3] });
  // pointer arrow to a heap object box
  g += `<line x1="675" y1="148" x2="675" y2="176" stroke="${ARR}" marker-end="url(#ah)"/>`;
  g += box(602, 178, 146, 46, 3);
  g += txt(675, 198, "heap object", { a: "middle", s: 9.5, o: 0.7 });
  g += txt(675, 215, 'char[]{A,i,s,h,a}', { a: "middle", mono: true, s: 9 });
  g += txt(675, 246, "primitives store the value directly", { a: "middle", s: 8, o: 0 });

  return `<svg viewBox="0 0 762 252" width="100%" style="max-width:762px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
    + `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker></defs>${g}</svg>`;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  const s = build();
  const r = await T.updateOne({ topicId: "java_m1_t2", "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": s } });
  console.log(r.matchedCount ? `✅ java_m1_t2 set (${s.length}b).` : "✗ java_m1_t2 missing");
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
