#!/usr/bin/env node
/**
 * previewLldDiagrams — dev-only visual check. Pulls every pro_lld
 * teaching.visual_aid SVG from the DB and writes a standalone HTML file showing
 * each in BOTH light and dark theme contexts (the SVGs use currentColor +
 * var(--bg), so this confirms theme-adaptivity and layout). Not committed.
 *
 * Usage: node scripts/previewLldDiagrams.mjs  →  writes ../../lld-diagrams-preview.html
 */
import "dotenv/config";
import mongoose from "mongoose";
import { writeFileSync } from "node:fs";
import { ProTopic } from "../models/proModels.js";

await mongoose.connect(process.env.MONGO_URI);
const topics = await ProTopic.find({ trackKey: "pro_lld", "teaching.visual_aid.svg": { $exists: true } })
  .select("topicId name teaching.visual_aid").sort({ topicId: 1 }).lean();
await mongoose.disconnect();

const card = (va) => `
  <div class="va">
    <p class="t">${va.type || "Visual aid"}</p>
    <div class="svgwrap">${va.svg}</div>
    <p class="d">${va.description || ""}</p>
  </div>`;

const block = (t) => `
  <section class="topic">
    <h3>${t.topicId} · ${t.name}</h3>
    <div class="themes">
      <div class="theme light">${card(t.teaching.visual_aid)}</div>
      <div class="theme dark">${card(t.teaching.visual_aid)}</div>
    </div>
  </section>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><title>LLD UML diagrams preview</title>
<style>
  body{font-family:system-ui,-apple-system,sans-serif;margin:24px;background:#e9e9ec;color:#111}
  h1{font-size:20px} h3{font-size:14px;margin:24px 0 8px}
  .themes{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .theme{border-radius:12px;padding:14px}
  .light{--bg:#ffffff;background:#ffffff;color:#1d1d1f}
  .dark{--bg:#1c1c1e;background:#1c1c1e;color:#f5f5f7}
  .va{border-left:4px solid #a44bd6;border-radius:10px;padding:14px;background:rgba(191,90,242,0.06)}
  .va .t{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#a44bd6;margin:0 0 10px}
  .svgwrap{display:flex;justify-content:center;overflow-x:auto}
  .va .d{font-size:12px;opacity:.7;margin:10px 0 0;line-height:1.5}
</style></head><body>
<h1>LLD UML class diagrams — ${topics.length} pattern topics (light vs dark)</h1>
${topics.map(block).join("")}
</body></html>`;

const out = new URL("../../../lld-diagrams-preview.html", import.meta.url);
writeFileSync(out, html);
console.log(`Wrote ${topics.length} diagrams → ${decodeURIComponent(out.pathname.replace(/^\//, ""))}`);
