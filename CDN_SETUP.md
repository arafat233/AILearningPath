# Phase 4: DiagramLibrary → S3 CDN Setup

**Status**: Code-ready (infrastructure pending)  
**Expected Savings**: -100 KB gzipped across all users  
**Timeline**: 1-2 hours for AWS setup

---

## Architecture

```
User Browser
    ↓
CloudFront CDN (edge locations worldwide)
    ↓
S3 Bucket (stellar-cdn-assets)
    ├─ assets/DiagramLibrary-*.js (111 KB gzipped)
    ├─ assets/MathText-*.js (78 KB gzipped)
    └─ assets/AnalyticsProView-*.js (7.7 KB)
```

**Benefit**: DiagramLibrary chunk served from edge location near user (faster + reduces origin load)

---

## Prerequisites

- AWS account with S3 + CloudFront access
- AWS CLI v2 installed: `pip install awscli`
- AWS credentials configured: `aws configure`

---

## Setup Steps

### 1. Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://stellar-cdn-assets --region us-east-1

# Enable versioning (for rollback)
aws s3api put-bucket-versioning \
  --bucket stellar-cdn-assets \
  --versioning-configuration Status=Enabled

# Block public access except CloudFront
aws s3api put-bucket-public-access-block \
  --bucket stellar-cdn-assets \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. Create CloudFront Distribution

```bash
# Create OAI (Origin Access Identity) for CloudFront → S3
aws cloudfront create-cloud-front-origin-access-identity \
  --cloud-front-origin-access-identity-config CallerReference=stellar-cdn,Comment="Stellar CDN OAI"
```

**Then in AWS Console**:
1. CloudFront → Create distribution
2. Origin: `stellar-cdn-assets.s3.us-east-1.amazonaws.com`
3. Origin Access Identity: (created above)
4. Compress objects automatically: ✓
5. Cache policy: CachingOptimized (30 days for immutable assets)
6. CNAME: `cdn.stellarlearn.com`
7. SSL: Request certificate via ACM
8. Review and create

**Save the CloudFront ID** (e.g., `XXXXXXXXXX`)

### 3. Point DNS to CloudFront

```bash
# Add CNAME record to your DNS provider
# Name: cdn.stellarlearn.com
# Value: d1234567890abc.cloudfront.net (from CloudFront)
```

### 4. Configure Environment Variables

```bash
# .env.production
REACT_APP_CDN_BASE=https://cdn.stellarlearn.com/assets
REACT_APP_CDN_ENABLED=true

# For deployment script
export CDN_S3_BUCKET=stellar-cdn-assets
export CDN_CLOUDFRONT_ID=XXXXXXXXXX
export AWS_REGION=us-east-1
```

### 5. Upload Assets to CDN

```bash
# Automatic (requires AWS credentials)
npm run upload-cdn

# Manual (if needed)
aws s3 cp dist/assets/DiagramLibrary-*.js \
  s3://stellar-cdn-assets/assets/ \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata "uploaded-at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

### 6. Verify CDN

```bash
# Check if assets are accessible
curl -I https://cdn.stellarlearn.com/assets/DiagramLibrary-DYYqxPik.js

# Should return:
# HTTP/2 200
# Cache-Control: public, max-age=31536000, immutable
# Content-Type: application/javascript; charset=utf-8
```

---

## Enable CDN in Code

Once verified:

```bash
# Update cdn.js to return CDN URLs
export function getCdnUrl(assetKey) {
  const asset = CDN_ASSETS[assetKey];
  if (!asset) return null;
  return `${CDN_BASE}/${asset.path}`; // ← enable this
}
```

---

## Rollback

If CDN fails:
1. Set `REACT_APP_CDN_ENABLED=false` in .env
2. App automatically falls back to bundled chunks
3. Zero downtime

---

## Monitoring

```bash
# CloudFront metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=XXXXXXXXXX \
  --start-time 2026-05-30T00:00:00Z \
  --end-time 2026-05-31T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

---

## Cost Estimate

- S3 Storage: ~1 MB × $0.023/GB = < $1/month
- CloudFront: ~1 million requests × $0.0075 = ~$7.50/month
- Total: ~$10/month

---

## Next: Phase 5 Optimizations

See `OPTIMIZATION_POLISH.md` for additional improvements.
