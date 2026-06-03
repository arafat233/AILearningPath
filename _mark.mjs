import fs from "fs";
const p = "JAVA_VISUAL_AID_AUDIT.md";
let md = fs.readFileSync(p, "utf8");
const done = process.argv.slice(2);
for (const id of done) {
  md = md.replace(new RegExp(`- \\[ \\] (❌|🔎|🔶|✅) \\*\\*${id}\\*\\*`), `- [x] ✅(fixed) **${id}**`);
}
fs.writeFileSync(p, md);
const left = (md.match(/- \[ \] ❌/g) || []).length;
console.log(`checked off ${done.length} · remaining ❌ MISMATCH: ${left}`);
