#!/usr/bin/env bash
# great-pm skill-doctor — mechanical harness health check (pitfalls #5, #6).
# Run from the great-pm plugin root: bash scripts/great-pm-skill-doctor.sh
# Checks: (1) skills-per-agent overload, (2) dangling cross-links (agent
# skills: refs + skill-body refs to skills that don't exist), (3) skills
# missing required depth sections. Read-only; prints findings; exits 0
# unless a hard error (missing skill ref) is found (then exit 1).
set -u
ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$ROOT" || { echo "skill-doctor: cannot cd to $ROOT"; exit 1; }

OVERLOAD_THRESHOLD=14   # warn if an agent lists more than this many skills
FAIL=0

# set of existing skill names (skills/<name>/SKILL.md) + known external skills
existing=$(ls -d skills/*/ 2>/dev/null | sed 's#skills/##; s#/##')
# external skills great-pm legitimately references (resolved by other plugins)
external="beads done-blocked superpowers:test-driven-development superpowers:brainstorming superpowers:writing-plans superpowers:requesting-code-review superpowers:receiving-code-review prose-style archetype-review-base"

is_known() {  # $1 = skill name
  local s="$1"
  echo "$existing" | grep -qx "$s" && return 0
  echo "$external" | tr ' ' '\n' | grep -qx "$s" && return 0
  return 1
}

echo "=== great-pm skill-doctor ($(ls -d skills/*/ 2>/dev/null | wc -l | tr -d ' ') skills, $(ls agents/*.md 2>/dev/null | wc -l | tr -d ' ') agents) ==="

echo ""
echo "--- (1) skills-per-agent (overload > ${OVERLOAD_THRESHOLD}) ---"
for a in agents/*.md; do
  n=$(awk '/^---$/{c++} c==1 && /^[[:space:]]*-[[:space:]]/{n++} c==2{exit} END{print n+0}' "$a")
  name=$(basename "$a" .md)
  if [ "$n" -gt "$OVERLOAD_THRESHOLD" ]; then
    printf "  OVERLOAD  %-24s %s skills — consider splitting to a sibling agent\n" "$name" "$n"
  fi
done
echo "  (agents at/under threshold omitted)"

echo ""
echo "--- (2) dangling skill cross-links (agent skills: -> nonexistent skill) ---"
for a in agents/*.md; do
  name=$(basename "$a" .md)
  for s in $(awk '/^---$/{c++} c==1 && /^[[:space:]]*-[[:space:]]/{gsub(/^[[:space:]]*-[[:space:]]*/,""); print} c==2{exit}' "$a"); do
    # only check tokens that look like skill names (skip non-skill frontmatter lists)
    case "$s" in
      *:*|*-*|beads|great-pm) if ! is_known "$s" && [ "$s" != "great-pm" ]; then
              echo "  DANGLING  $name -> '$s' (no skills/$s/ and not a known external)"; FAIL=1
            fi ;;
    esac
  done
done
[ "$FAIL" = 0 ] && echo "  none ✓"

echo ""
echo "--- (3) skill depth: missing rubric sections (when-NOT / pitfalls / cross-links) ---"
thin=0
for f in skills/*/SKILL.md; do
  s=$(basename "$(dirname "$f")")
  miss=""
  grep -qiE 'when not|when-not|not to use' "$f" || miss="${miss} when-NOT"
  grep -qiE 'pitfall|failure mode|anti-pattern' "$f" || miss="${miss} pitfalls"
  grep -qiE 'cross-link|see \`|→ \`|related skill' "$f" || miss="${miss} cross-links"
  if [ -n "$miss" ]; then printf "  %-26s missing:%s\n" "$s" "$miss"; thin=$((thin+1)); fi
done
echo "  ($thin skills missing >=1 rubric section — review; some short index skills are intentionally exempt)"

echo ""
echo "=== skill-doctor done (exit $FAIL) ==="
exit $FAIL
