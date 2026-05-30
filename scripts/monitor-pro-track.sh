#!/bin/bash
# Monitor Pro Track API for errors and issues
# Usage: ./monitor-pro-track.sh

CONTAINER="ailearningpath-api-1"
LOG_FILE="/tmp/pro-track-monitor.log"

echo "Starting Pro Track API Monitor..."
echo "Monitoring container: $CONTAINER"
echo "Log file: $LOG_FILE"
echo ""

# Tail container logs and filter for:
# - Pro track endpoint errors
# - Enrollment failures
# - Code execution failures
# - Authentication issues

docker logs -f "$CONTAINER" 2>&1 | while read line; do
  # Check for pro track related entries
  if echo "$line" | grep -E "(pro\.|pro_java|protrack|promodule|exercise|submission)" > /dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line" | tee -a "$LOG_FILE"
  fi

  # Alert on errors
  if echo "$line" | grep -iE "(error|failed|ERR!|❌)" > /dev/null; then
    if echo "$line" | grep -E "(pro\.|pro_java)" > /dev/null; then
      echo ""
      echo "🚨 ALERT: $(date)"
      echo "$line"
      echo ""
    fi
  fi
done
