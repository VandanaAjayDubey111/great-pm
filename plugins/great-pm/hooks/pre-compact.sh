#!/usr/bin/env bash
set -u

mkdir -p .great-pm
branch=$(git branch --show-current 2>/dev/null || echo unknown)
last_commit=$(git log --oneline -1 2>/dev/null || echo none)
uncommitted=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
{
  echo "# GreatPM Auto-Handoff"
  echo
  echo "Date: $(date '+%Y-%m-%d %H:%M')"
  echo "Branch: $branch"
  echo "Last commit: $last_commit"
  echo "Uncommitted: $uncommitted files"
  echo
  echo "## Open gates"
  bd list --label gate --status open 2>/dev/null | head -10 || echo none
  echo
  echo "## Latest agent verdict"
  if [ -d .great-pm/verdicts ]; then
    find .great-pm/verdicts -type f -name '*.log' -print0 2>/dev/null \
      | xargs -0 ls -t 2>/dev/null \
      | head -1 \
      | xargs tail -1 2>/dev/null || echo none
  else
    echo none
  fi
  echo
  echo "## Latest drafts"
  find .great-pm/drafts -type f -name '*.md' -print 2>/dev/null \
    | head -3 || echo none
  echo
  echo "## Resume"
  echo "Run the pm-inbox skill, then continue the product loop."
} > .great-pm/HANDOFF.md
