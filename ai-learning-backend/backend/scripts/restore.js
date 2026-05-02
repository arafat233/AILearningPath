#!/usr/bin/env node
/**
 * MongoDB restore script.
 *
 * Usage:
 *   node scripts/restore.js                        # restore latest local backup
 *   node scripts/restore.js ./backups/file.gz      # restore specific file
 *   node scripts/restore.js s3://BUCKET/key.gz     # download from S3 then restore
 *
 * WARNING: --drop is passed to mongorestore, which drops each collection before
 * restoring it. Use only on a staging/recovery instance, never on live production
 * without first taking a fresh backup.
 *
 * Env vars:
 *   MONGO_URI    — required
 *   BACKUP_DIR   — optional (default: ./backups)
 */

import { execSync }      from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname }       from "node:path";
import { tmpdir }        from "node:os";

try {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();
} catch { /* dotenv optional */ }

const __dirname  = dirname(fileURLToPath(import.meta.url));
const ROOT       = resolve(__dirname, "..");
const BACKUP_DIR = resolve(process.env.BACKUP_DIR || join(ROOT, "backups"));
const MONGO_URI  = process.env.MONGO_URI;

function log(msg) { process.stdout.write(`[restore] ${msg}\n`); }
function err(msg) { process.stderr.write(`[restore] ERROR: ${msg}\n`); }

if (!MONGO_URI) { err("MONGO_URI is not set."); process.exit(1); }

let archivePath = process.argv[2];

// ─── resolve archive path ─────────────────────────────────────────────────────
if (!archivePath) {
  // Use latest local backup
  if (!existsSync(BACKUP_DIR)) { err("No backups directory found. Pass a file path explicitly."); process.exit(1); }
  const files = readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("mongodb-backup-") && f.endsWith(".gz"))
    .sort();
  if (!files.length) { err("No local backups found."); process.exit(1); }
  archivePath = join(BACKUP_DIR, files[files.length - 1]);
  log(`No file specified — using latest backup: ${archivePath}`);
}

// ─── download from S3 if needed ───────────────────────────────────────────────
let localPath = archivePath;
if (archivePath.startsWith("s3://")) {
  localPath = join(tmpdir(), `restore-${Date.now()}.gz`);
  log(`Downloading ${archivePath} → ${localPath} …`);
  try {
    execSync(`aws s3 cp "${archivePath}" "${localPath}"`, { stdio: "inherit" });
  } catch (e) { err(`S3 download failed: ${e.message}`); process.exit(1); }
}

if (!existsSync(localPath)) { err(`File not found: ${localPath}`); process.exit(1); }

// ─── restore ──────────────────────────────────────────────────────────────────
log(`Restoring from ${localPath} into ${MONGO_URI} (--drop) …`);
log("This will DROP each collection before restoring. Ctrl-C within 5s to abort.");
await new Promise((r) => setTimeout(r, 5000));

try {
  execSync(
    `mongorestore --uri="${MONGO_URI}" --archive="${localPath}" --gzip --drop`,
    { stdio: "inherit" }
  );
  log("Restore complete.");
} catch (e) {
  err(`mongorestore failed: ${e.message}`);
  process.exit(1);
}
