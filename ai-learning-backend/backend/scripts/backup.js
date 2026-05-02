#!/usr/bin/env node
/**
 * MongoDB backup script.
 *
 * Usage:
 *   node scripts/backup.js            # run a backup
 *   node scripts/backup.js --list     # list local backups
 *   node scripts/backup.js --dry-run  # show what would happen without doing it
 *
 * Env vars (all from .env or CI secrets):
 *   MONGO_URI          — required; mongodb connection string
 *   BACKUP_DIR         — optional; local directory (default: ./backups)
 *   BACKUP_RETAIN_DAYS — optional; how many daily backups to keep (default: 7)
 *   S3_BACKUP_BUCKET   — optional; if set, upload to s3://BUCKET/backups/ via aws CLI
 *   S3_BACKUP_PREFIX   — optional; S3 key prefix (default: "backups")
 */

import { execSync }        from "node:child_process";
import { existsSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { join, resolve }   from "node:path";
import { fileURLToPath }   from "node:url";
import { dirname }         from "node:path";

// Load .env when running locally (not in CI where env vars are injected)
try {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();
} catch { /* dotenv optional */ }

const __dirname   = dirname(fileURLToPath(import.meta.url));
const ROOT        = resolve(__dirname, "..");
const BACKUP_DIR  = resolve(process.env.BACKUP_DIR || join(ROOT, "backups"));
const RETAIN_DAYS = parseInt(process.env.BACKUP_RETAIN_DAYS || "7", 10);
const MONGO_URI   = process.env.MONGO_URI;
const S3_BUCKET   = process.env.S3_BACKUP_BUCKET;
const S3_PREFIX   = process.env.S3_BACKUP_PREFIX || "backups";
const DRY_RUN     = process.argv.includes("--dry-run");
const LIST_ONLY   = process.argv.includes("--list");

function log(msg) { process.stdout.write(`[backup] ${msg}\n`); }
function err(msg) { process.stderr.write(`[backup] ERROR: ${msg}\n`); }

// ─── list ─────────────────────────────────────────────────────────────────────
if (LIST_ONLY) {
  if (!existsSync(BACKUP_DIR)) { log("No backups directory found."); process.exit(0); }
  const files = readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".gz")).sort().reverse();
  if (!files.length) { log("No backups found."); process.exit(0); }
  log(`Backups in ${BACKUP_DIR}:`);
  files.forEach((f) => log(`  ${f}`));
  process.exit(0);
}

// ─── validate ─────────────────────────────────────────────────────────────────
if (!MONGO_URI) {
  err("MONGO_URI is not set. Cannot run backup.");
  process.exit(1);
}

// ─── backup ───────────────────────────────────────────────────────────────────
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19); // 2025-05-02T14-30-00
const filename  = `mongodb-backup-${timestamp}.gz`;
const dest      = join(BACKUP_DIR, filename);

log(`Starting backup → ${dest}`);
if (DRY_RUN) { log("Dry run — skipping actual dump."); process.exit(0); }

if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });

try {
  execSync(
    `mongodump --uri="${MONGO_URI}" --archive="${dest}" --gzip`,
    { stdio: "inherit" }
  );
  log(`Backup written: ${filename}`);
} catch (e) {
  err(`mongodump failed: ${e.message}`);
  process.exit(1);
}

// ─── optional S3 upload ───────────────────────────────────────────────────────
if (S3_BUCKET) {
  const s3Key = `s3://${S3_BUCKET}/${S3_PREFIX}/${filename}`;
  log(`Uploading to ${s3Key} …`);
  try {
    execSync(`aws s3 cp "${dest}" "${s3Key}" --storage-class STANDARD_IA`, { stdio: "inherit" });
    log("S3 upload complete.");
  } catch (e) {
    err(`S3 upload failed: ${e.message}`);
    // Don't exit 1 — local backup succeeded; alert is enough
  }
}

// ─── prune old local backups ──────────────────────────────────────────────────
const cutoff = Date.now() - RETAIN_DAYS * 24 * 60 * 60 * 1000;
const allFiles = readdirSync(BACKUP_DIR)
  .filter((f) => f.startsWith("mongodb-backup-") && f.endsWith(".gz"))
  .sort();

let pruned = 0;
for (const f of allFiles) {
  // Parse timestamp from filename: mongodb-backup-YYYY-MM-DDTHH-MM-SS.gz
  const ts = f.replace("mongodb-backup-", "").replace(".gz", "").replace(/T(\d{2})-(\d{2})-(\d{2})$/, "T$1:$2:$3");
  const age = new Date(ts).getTime();
  if (!isNaN(age) && age < cutoff) {
    rmSync(join(BACKUP_DIR, f));
    log(`Pruned old backup: ${f}`);
    pruned++;
  }
}
if (pruned === 0) log(`No backups to prune (retain ${RETAIN_DAYS} days).`);

log("Done.");
