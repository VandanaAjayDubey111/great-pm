#!/usr/bin/env bash
set -u

mkdir -p .great-pm/logs
log_date=$(date +%Y-%m-%d)
log_time=$(date +%H-%M-%S)
branch=$(git branch --show-current 2>/dev/null || echo unknown)
last_commit=$(git log --oneline -1 2>/dev/null || echo none)
{
  echo "---"
  echo "date: $log_date"
  echo "time: $log_time"
  echo "---"
  echo
  echo "# Session $log_date $log_time"
  echo
  echo "Branch: $branch"
  echo "Last commit: $last_commit"
  echo
  echo "Run the pm-save skill next session to capture lessons."
} > ".great-pm/logs/session-${log_date}-${log_time}.md"
touch .great-pm/.learn-pending
