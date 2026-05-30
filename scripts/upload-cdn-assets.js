#!/usr/bin/env node

/**
 * Upload built chunks to S3 CDN
 * Usage: npm run upload-cdn
 *
 * Requires:
 * - AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
 * - Or: AWS credentials configured in ~/.aws/credentials
 *
 * Assets uploaded:
 * - DiagramLibrary chunk
 * - MathText chunk
 * - AnalyticsProView chunk
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const DIST_DIR = path.join(__dirname, "../ai-learning-frontend/frontend/dist/assets");
const S3_BUCKET = process.env.CDN_S3_BUCKET || "stellar-cdn-assets";
const S3_REGION = process.env.AWS_REGION || "us-east-1";
const CDN_CLOUDFRONT_ID = process.env.CDN_CLOUDFRONT_ID || "XXXXXXXXXX";

// Asset patterns to upload to CDN
const ASSETS_TO_CDN = [
  "DiagramLibrary-*.js",  // 664 KB uncompressed, 111 KB gzipped
  "MathText-*.js",        // 261 KB uncompressed, 78 KB gzipped
  "AnalyticsProView-*.js", // 7.7 KB
];

console.log("📤 CDN Asset Upload\n");
console.log(`S3 Bucket: ${S3_BUCKET}`);
console.log(`CloudFront ID: ${CDN_CLOUDFRONT_ID}`);
console.log(`Region: ${S3_REGION}\n`);

// Check if AWS CLI is available
try {
  execSync("aws --version", { stdio: "ignore" });
} catch (e) {
  console.error("❌ AWS CLI not found. Install with: pip install awscli");
  process.exit(1);
}

// Check credentials
try {
  execSync("aws sts get-caller-identity --region " + S3_REGION, { stdio: "ignore" });
} catch (e) {
  console.error("❌ AWS credentials not configured");
  console.error("   Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY");
  process.exit(1);
}

// Find and upload assets
let uploaded = 0;
let failed = 0;

ASSETS_TO_CDN.forEach((pattern) => {
  const files = fs.readdirSync(DIST_DIR).filter((f) => {
    const regex = new RegExp("^" + pattern.replace("*", "[^.]+") + "$");
    return regex.test(f);
  });

  files.forEach((file) => {
    const filePath = path.join(DIST_DIR, file);
    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(1);

    try {
      console.log(`⬆️  Uploading ${file} (${fileSize} KB)...`);

      // Upload with cache-busting headers
      // Hash in filename means we can set cache-control to infinite (immutable)
      execSync(
        `aws s3 cp "${filePath}" "s3://${S3_BUCKET}/assets/${file}" ` +
        `--region ${S3_REGION} ` +
        `--cache-control "public, max-age=31536000, immutable" ` +
        `--content-type "application/javascript; charset=utf-8" ` +
        `--metadata "uploaded-at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"`,
        { stdio: "pipe" }
      );

      console.log(`   ✓ Uploaded`);
      uploaded++;
    } catch (err) {
      console.error(`   ✗ Failed: ${err.message}`);
      failed++;
    }
  });
});

console.log(`\n📊 Results: ${uploaded} uploaded, ${failed} failed\n`);

if (uploaded > 0) {
  console.log("🔄 Invalidating CloudFront cache...");
  try {
    execSync(
      `aws cloudfront create-invalidation ` +
      `--distribution-id ${CDN_CLOUDFRONT_ID} ` +
      `--paths "/assets/*" ` +
      `--region ${S3_REGION}`,
      { stdio: "pipe" }
    );
    console.log("✓ CloudFront cache invalidated\n");
  } catch (err) {
    console.warn("⚠️  CloudFront invalidation failed (non-critical)\n");
  }
}

if (failed === 0 && uploaded > 0) {
  console.log("✅ CDN upload complete!");
  console.log("\nNext: Update .env with:");
  console.log(`  REACT_APP_CDN_BASE=https://cdn.stellarlearn.com/assets`);
  console.log(`  REACT_APP_CDN_ENABLED=true`);
  process.exit(0);
} else if (failed > 0) {
  console.error("❌ Upload failed");
  process.exit(1);
} else {
  console.warn("⚠️  No assets found to upload");
  process.exit(0);
}
