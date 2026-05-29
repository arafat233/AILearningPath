#!/usr/bin/env bash
# Post-deploy smoke tests. Hits every critical public endpoint and asserts
# expected HTTP status. Exits non-zero if any fail → triggers auto-rollback.
#
# Usage:
#   bash scripts/smoke-test.sh https://stellaredu.in
#   bash scripts/smoke-test.sh http://staging.stellaredu.in
# Defaults to production URL if no arg.

set -uo pipefail

BASE="${1:-https://stellaredu.in}"

# "method|path|expected_status|description"
tests=(
  "GET|/|200|Site root (index.html)"
  "GET|/assets/|403|Static assets dir (directory listing disabled)"
  "GET|/sw.js|200|Service worker"
  "GET|/api/topics?grade=10|200|Topics (public, optionalAuth)"
  "GET|/api/v1/ncert/chapters?subject=Mathematics|401|NCERT chapters (auth required)"
  "GET|/api/auth/me|401|Auth check (unauthenticated → 401)"
  "GET|/api/v1/ncert/studied|401|Studied topics (auth-protected)"
  "GET|/api/v1/ncert/topics/ch1_s1_c1_t1/mastery-test|401|Mastery test (auth-protected)"
  "POST|/api/v1/ncert/topics/ch1_s1_c1_t1/mastery-test/submit|401|Mastery submit (auth-protected)"
)

failed=0
echo "Smoke testing $BASE ..."
echo ""
for t in "${tests[@]}"; do
  IFS='|' read -r method path expected desc <<< "$t"
  actual=$(curl -s -o /dev/null -w "%{http_code}" -m 8 -k -X "$method" "$BASE$path")
  if [ "$actual" = "$expected" ]; then
    printf "  ✅ %-50s HTTP %s\n" "$desc" "$actual"
  else
    printf "  ❌ %-50s HTTP %s (expected %s)\n" "$desc" "$actual" "$expected"
    failed=$((failed + 1))
  fi
done

echo ""
if [ "$failed" -gt 0 ]; then
  echo "❌ $failed/${#tests[@]} smoke test(s) failed"
  exit 1
fi
echo "✅ All ${#tests[@]} smoke tests passed"
