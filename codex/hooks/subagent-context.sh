#!/usr/bin/env bash
set -u

[ -f .great-pm/PROJECT.md ] && {
  echo "=== PROJECT.md ==="
  head -25 .great-pm/PROJECT.md
}
[ -f .great-pm/brain.md ] && {
  echo "=== brain.md ==="
  tail -40 .great-pm/brain.md
}
[ -f .great-pm/HANDOFF.md ] && {
  echo "=== HANDOFF.md ==="
  tail -20 .great-pm/HANDOFF.md
}
if [ -d .great-pm/verdicts ]; then
  find .great-pm/verdicts -type f -name '*.log' -print0 2>/dev/null \
    | xargs -0 ls -t 2>/dev/null \
    | head -3 \
    | xargs tail -2 2>/dev/null \
    | head -10
fi
exit 0
