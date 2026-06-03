import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
const svgs = JSON.parse(fs.readFileSync("_r.json", "utf8"));
// render twice: light and dark, side by side per topic, to catch theme issues
const block = (bg, fg) => Object.entries(svgs).map(([id, s]) =>
  `<div style="padding:12px 16px;border-bottom:1px solid ${fg}22"><div style="font-size:12px;font-weight:700;color:#a44bd6;margin-bottom:6px">${id}</div>${s}</div>`).join("");
fs.writeFileSync("_r.html", `<!doctype html><body style="margin:0;background:#fff;color:#1d1d1f;font-family:system-ui">${block("#fff", "#1d1d1f")}</body>`);
fs.writeFileSync("_rd.html", `<!doctype html><body style="margin:0;background:#1c1c1e;color:#f5f5f7;font-family:system-ui">${block("#1c1c1e", "#f5f5f7")}</body>`);
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 820, height: 1200 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(path.resolve("_r.html")).href);
await p.screenshot({ path: "_r.png", fullPage: true });
await p.goto(pathToFileURL(path.resolve("_rd.html")).href);
await p.screenshot({ path: "_rd.png", fullPage: true });
await b.close();
console.log("ok");
