import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";

// ── replicate VisualAid.jsx auto-render logic ───────────────────────
function parseFlow(desc) {
  if (!desc) return null;
  const norm = desc.replace(/⟶|➜|➔|➝|⇒|->|=>/g, "→");
  if (!norm.includes("→")) return null;
  const parts = norm.split("→").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  parts[0] = parts[0].split(/:\s*/).pop().split(/(?<=[.!?])\s+/).pop().trim();
  const last = parts.length - 1;
  parts[last] = parts[last].split(/(?<=[.!?])\s/)[0].replace(/[.!?]+$/, "").trim();
  const stages = parts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (stages.length < 2 || stages.length > 8) return null;
  if (stages.some((s) => s.length > 40)) return null;
  return stages;
}
function parseParts(desc) {
  if (!desc) return null;
  if (/\(\s*1\s*\)/.test(desc) && /\(\s*2\s*\)/.test(desc)) {
    const raw = desc.split(/\(\s*\d+\s*\)/).map((s) => s.trim()).slice(1).filter(Boolean);
    if (raw.length >= 2) return raw.slice(0, 3);
  }
  const m = desc.match(/\bLeft\b([\s\S]*?)\bRight\b([\s\S]*)/i);
  if (m && m[1].trim() && m[2].trim()) return ["L", "R"];
  return null;
}

// ── profile an authored svg: is it a real diagram or just text-panels? ──
function svgProfile(svg) {
  const count = (re) => (svg.match(re) || []).length;
  const rects = count(/<rect/g), texts = count(/<text/g);
  const polys = count(/<polygon/g), circles = count(/<circle/g);
  const polylines = count(/<polyline/g), paths = count(/<path/g);
  // lines excluding marker arrowhead defs (those are <path> inside <marker>)
  const lines = count(/<line/g);
  const shapeyElems = polys + circles + polylines + lines + Math.max(0, paths - count(/<marker/g));
  // "panels": only rects + text, essentially no connectors/shapes
  const kind = shapeyElems === 0 ? "svg-PANELS(text-in-boxes)" : "svg-diagram";
  return { kind, rects, texts, polys, circles, polylines, lines, paths, shapeyElems };
}

// ── what shape does the DESCRIPTION call for? (priority order) ──
function requiredType(d) {
  const s = d.toLowerCase();
  if (/\bvenn\b/.test(s)) return "VENN";
  if (/flowchart|diamond|decision box|decision diamond/.test(s)) return "FLOWCHART";
  if (/state machine|state diagram|lifecycle|\bstates?\b.*(transition|arrow)|closed.*open.*half/.test(s)) return "STATE";
  if (/(x-axis|y-axis|axis:|growth.*curve|plot|\bcurve\b|graph showing|chart showing.*(vs|over time)|big-o.*graph)/.test(s)) return "CURVE";
  if (/\btree\b|hierarchy|root .* (child|leaf|node)|parent.*child|inheritance (tree|diagram)|throwable/.test(s)) return "TREE";
  if (/buffer|memory layout|stack frame|call stack|heap\b|array.*(cell|index|box)|\bpointer\b|nodes? linked|linked list/.test(s)) return "MEMORY";
  if (/timeline|over time\b|t=0|t = 0|sequence diagram|step-by-step timeline/.test(s)) return "TIMELINE";
  if (/keyboard|stdin/.test(s)) return "IO";
  if (/\bmatrix\b|grid of|table showing|columns?:|\bgrid\b.*(cell|dp)/.test(s)) return "TABLE/GRID";
  if (/⟶|➜|→|->|=>|pipeline|flows? (into|right|down|to)|arrow/.test(s)) return "FLOW/PIPELINE";
  return "PANELS/CONCEPT";
}

function currentRender(va) {
  if (va.svg) return svgProfile(va.svg).kind;
  if (parseFlow(va.description)) return "auto-FLOW";
  if (parseParts(va.description)) return "auto-PANELS";
  return "auto-TEXT(prose)";
}

// flag = does the required shape look unmet by the current render?
function flag(req, render) {
  const shapeReqs = ["VENN", "FLOWCHART", "STATE", "CURVE", "TREE", "MEMORY", "IO", "TABLE/GRID"];
  if (render === "svg-diagram") return shapeReqs.includes(req) ? "REVIEW(svg—verify shape)" : "ok";
  if (render === "svg-PANELS(text-in-boxes)") return shapeReqs.includes(req) ? "MISMATCH" : (req === "FLOW/PIPELINE" ? "REVIEW" : "ok-ish");
  if (render === "auto-FLOW") return req === "FLOW/PIPELINE" ? "ok" : (shapeReqs.includes(req) ? "MISMATCH" : "REVIEW");
  if (render === "auto-PANELS") return shapeReqs.includes(req) ? "MISMATCH" : "REVIEW";
  if (render === "auto-TEXT(prose)") return "MISMATCH(prose)";
  return "REVIEW";
}

const m = mongoose;
await m.connect(process.env.MONGO_URI);
const T = m.connection.collection("protopics");
const all = await T.find({ topicId: /^java_/, "teaching.visual_aid": { $exists: true } })
  .project({ topicId: 1, name: 1, "teaching.visual_aid": 1 }).toArray();
all.sort((a, b) => {
  const p = (id) => { const mm = id.match(/^java_m(\d+)(?:_(\d+))?_t(\d+)$/); return mm ? [parseInt(mm[1]), mm[2] ? parseInt(mm[2]) : 0, parseInt(mm[3])] : [999, 0, 0]; };
  const [a1, a2, a3] = p(a.topicId), [b1, b2, b3] = p(b.topicId);
  return a1 - b1 || a2 - b2 || a3 - b3;
});

const rows = all.map((t) => {
  const va = t.teaching.visual_aid;
  const req = requiredType(va.description || "");
  const render = currentRender(va);
  const f = flag(req, render);
  return { topicId: t.topicId, name: t.name, req, render, flag: f, description: va.description, hasSvg: !!va.svg };
});
fs.writeFileSync("_triage.json", JSON.stringify(rows, null, 1));

const tally = {};
rows.forEach((r) => { tally[r.flag] = (tally[r.flag] || 0) + 1; });
console.log("=== FLAG TALLY ===");
Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${v}\t${k}`));
console.log("\n=== PER-TOPIC (flag | req | render | topicId | name) ===");
rows.forEach((r) => console.log(`${r.flag.padEnd(24)} ${r.req.padEnd(14)} ${r.render.padEnd(26)} ${r.topicId.padEnd(16)} ${r.name}`));
await m.disconnect();
