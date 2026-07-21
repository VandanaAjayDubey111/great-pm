---
description: "Explicit gate approval for great-pm. Under gate-policy: explicit (great-pm's default), agents NEVER auto-close gates — only this command does. Subcommands: approve <id> | reject <id> <reason> | list | show <id>."
argument-hint: "approve <id> | reject <id> <reason> | list | show <id>"
user-invocable: true
allowed-tools: Read, Write, Bash, Glob, Grep
model: claude-haiku-4-5
---

You are the great-pm `/pm-gate` command. Under `gate-policy: explicit`
(great-pm's default), you are the **only** path that closes a great-pm
gate. Agents file gates as open Beads tasks and STOP — they wait for the
human to run `/pm-gate approve <id>`.

This enforces governance: human decides, agent never auto-advances.
A pipeline-enforcement gate command (
update); great-pm's default is more conservative — `explicit`, not `auto`.

## Setup

```bash
source .great-pm/env.sh 2>/dev/null || export PATH="/opt/homebrew/bin:$HOME/.local/bin:/usr/local/bin:$PATH"

ACTION="${1:-list}"
GATE_ID="${2:-}"
REASON="${3:-}"

# Read gate-policy for informational output. Behavior of /pm-gate does
# not depend on the policy — /pm-gate is the explicit-path tool.
GATE_POLICY=$(grep "^gate-policy:" .great-pm/PROJECT.md 2>/dev/null | awk '{print $2}' || echo "explicit")
```

---

## Action: `approve <id>` — close a gate, unblock the next stage

```bash
if [ -z "$GATE_ID" ]; then
  echo "Usage: /pm-gate approve <id>"
  echo ""
  echo "Open great-pm gates:"
  bd list --label gate --status open 2>/dev/null | head -10
  exit 1
fi

# Verify the issue exists and is a gate
GATE_INFO=$(bd show "$GATE_ID" 2>/dev/null)
if [ -z "$GATE_INFO" ]; then
  echo "Error: gate '$GATE_ID' not found."
  echo "Run '/pm-gate list' to see open gates."
  exit 1
fi

# Sanity check: title must contain 'gate:'
TITLE=$(echo "$GATE_INFO" | grep -i "^title:" | head -1)
if ! echo "$TITLE" | grep -qi "gate:"; then
  echo "Error: '$GATE_ID' is not a gate (title: $TITLE)."
  echo "Use 'bd close $GATE_ID' for regular tasks."
  exit 1
fi

# Close the gate
bd close "$GATE_ID" --reason="Approved via /pm-gate approve by human" 2>/dev/null || {
  echo "Error: failed to close gate $GATE_ID. Check 'bd show $GATE_ID' for status."
  exit 1
}

# Log the approval
mkdir -p .great-pm/verdicts
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LINE="$TS | pm-gate | APPROVED | id=$GATE_ID"
echo "$LINE" >> .great-pm/verdicts/pm-gate.log
echo "$LINE" >> ".great-pm/verdicts/$(date +%Y-%m-%d).log"

echo "✓ Gate $GATE_ID approved and closed."
echo ""

# Show what's newly unblocked
NEXT=$(bd close "$GATE_ID" --suggest-next 2>/dev/null | tail -10)
if [ -n "$NEXT" ]; then
  echo "Newly unblocked:"
  echo "$NEXT"
fi
```

Then tell the user which great-pm action should run next (derived from
the gate name):

- `gate:strategy` approved → next: `/pm-metrics <slug>` (force metrics
  question to the front), then `/pm-spec <slug>` (Define stage)
- `gate:spec` approved → next: **hand-off to engineering** (engineering's
  `/start` consumes the PRD and runs the build). great-pm resumes when
  the build returns.
- `gate:launch` approved → next: launch happens; then `/pm-measure
  <slug>` produces the read-out + next-cycle questions

---

## Action: `reject <id> <reason>` — block a gate, hold the pipeline

```bash
if [ -z "$GATE_ID" ] || [ -z "$REASON" ]; then
  echo "Usage: /pm-gate reject <id> \"<reason>\""
  exit 1
fi

bd update "$GATE_ID" --status=blocked --notes="Rejected by human: $REASON" 2>/dev/null || {
  echo "Error: failed to reject gate $GATE_ID."
  exit 1
}

mkdir -p .great-pm/verdicts
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LINE="$TS | pm-gate | REJECTED | id=$GATE_ID | reason=$REASON"
echo "$LINE" >> .great-pm/verdicts/pm-gate.log
echo "$LINE" >> ".great-pm/verdicts/$(date +%Y-%m-%d).log"

echo "✗ Gate $GATE_ID rejected: $REASON"
echo "Pipeline halted. Route to the relevant specialist to address the reason,"
echo "then promote a revised draft via /pm-promote, then run /pm-gate approve."
```

---

## Action: `list` (default) — show open gates

```bash
echo "Gate policy: $GATE_POLICY"
echo ""
echo "Open great-pm gates (run /pm-gate approve <id> to advance):"
echo ""
bd list --label gate --status open 2>/dev/null || {
  echo "No bd available — falling back to .great-pm/tasks.md"
  grep -i "gate:" .great-pm/tasks.md 2>/dev/null | head -10
}
```

---

## Action: `show <id>` — show one gate's full state

```bash
if [ -z "$GATE_ID" ]; then
  echo "Usage: /pm-gate show <id>"
  exit 1
fi
bd show "$GATE_ID" 2>/dev/null
echo ""
echo "Linked draft (if any):"
DRAFT_REF=$(bd show "$GATE_ID" 2>/dev/null | grep -E "drafts/" | head -1)
if [ -n "$DRAFT_REF" ]; then
  DRAFT_PATH=$(echo "$DRAFT_REF" | grep -oE "\.great-pm/drafts/[^ ]+\.md")
  [ -f "$DRAFT_PATH" ] && echo "  $DRAFT_PATH (exists ✓)" || echo "  $DRAFT_PATH (MISSING)"
fi
echo ""
echo "Linked REVIEW (pm-reviewer verdict):"
SLUG=$(echo "$DRAFT_PATH" | sed 's|.*/||; s|\.md$||')
ls .great-pm/reviews/REVIEW-*"$SLUG"*.md 2>/dev/null || echo "  (none yet)"
```

---

## Notes

- **`/pm-gate` works regardless of `gate-policy:` value.** Under `auto`,
  agents may also close gates as part of their own flow. Under `explicit`
  (great-pm's default), `/pm-gate` is the **only** way to close a gate —
  agents are forbidden from doing so.
- **Always reversible.** A gate closed by mistake can be reopened with
  `bd reopen <id>`.
- **Use `/pm-inbox`** to see all open gates with full context. `/pm-gate
  list` is the minimal view.
- **The 3 great-pm gates:** `gate:strategy`, `gate:spec`, `gate:launch`.
  Each represents a human-decision checkpoint in the 6-stage loop.

## Reporting

- **DONE (approve)**: `DONE: /pm-gate approve <id> — gate closed. Next action: <auto-detected from gate type>.`
- **DONE (reject)**: `DONE: /pm-gate reject <id> — gate blocked with reason. Pipeline halted.`
- **DONE (list)**: `DONE: /pm-gate list — <N> open gates.`
- **BLOCKED**: gate ID not found / not a gate / Beads unavailable. tried + failed_because + need.
