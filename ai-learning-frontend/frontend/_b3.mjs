import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
const svgs = JSON.parse(fs.readFileSync("_b3.json", "utf8"));
const html = `<!doctype html><body style="margin:0;background:#fff;color:#1d1d1f;font-family:system-ui">
${Object.entries(svgs).map(([id, s]) => `<div style="padding:14px 18px;border-bottom:1px solid #eee"><div style="font-size:12px;font-weight:700;color:#a44bd6;margin-bottom:6px">${id}</div>${s}</div>`).join("")}
</body>`;
fs.writeFileSync("_b3.html", html);
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 820, height: 1200 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(path.resolve("_b3.html")).href);
await p.screenshot({ path: "_b3.png", fullPage: true });
await b.close();
console.log("ok");
