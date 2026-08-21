import fs from "fs";
import path from "path";

const roots = [
  "ai-learning-backend/backend",
  "ai-learning-frontend/frontend/src",
];
const sourceExts = new Set([".js", ".jsx", ".mjs", ".cjs"]);
const resolveExts = ["", ".js", ".jsx", ".mjs", ".cjs", ".json"];
const importPattern =
  /(?:import\s+(?:[^'"]*?\s+from\s+)?|import\s*\(|export\s+[^'"]*?\s+from\s+|require\()\s*['"]([^'"]+)['"]/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (sourceExts.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function canResolve(basePath) {
  for (const ext of resolveExts) {
    if (fs.existsSync(basePath + ext) && fs.statSync(basePath + ext).isFile()) {
      return true;
    }
  }
  if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
    for (const ext of resolveExts.slice(1, -1)) {
      const indexPath = path.join(basePath, `index${ext}`);
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return true;
      }
    }
  }
  return false;
}

const missing = [];

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    let match;
    while ((match = importPattern.exec(text))) {
      const specifier = match[1];
      if (!specifier.startsWith(".")) continue;
      const basePath = path.resolve(path.dirname(file), specifier);
      if (!canResolve(basePath)) {
        missing.push(`${file}: ${specifier}`);
      }
    }
  }
}

if (missing.length) {
  console.error("Missing relative imports:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log("No missing relative JS imports found.");
