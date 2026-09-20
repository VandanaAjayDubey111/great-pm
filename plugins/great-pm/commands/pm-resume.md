---
description: Pick up where you left off. Reads `.great-pm/HANDOFF.md` (auto-saved by the PreCompact hook) and orients you with the next concrete step.
argument-hint: ""
user-invocable: true
allowed-tools: Read, Bash
model: opus
---

You are the great-pm `/pm-resume` command. Orient the human after a break or after Claude compacts the context.

## Operating procedure

0. **Step 0 — refine the user's query** (transparent Mode B). Invoke
   `query-refiner-pm` with `$ARGUMENTS`. The refiner returns:
   ```
   You typed:  <original>

   Refined to: <refined brief>

   What changed: <one line>

   Proceeding with refined. Reply "use original" to override.
   ```
   Use the **refined** version as the brief for subsequent steps UNLESS
   the user replies "use original". Log the refinement to
   `.great-pm/refinements/$(date +%Y-%m-%d).log`. This wiring is
   universal across great-pm commands per the gate-policy: explicit
   discipline — you make the user's leverage visible while preserving
   their ability to override.

1. **Read** `.great-pm/HANDOFF.md`. If missing → `BLOCKED` with: "No HANDOFF.md yet. The PreCompact hook auto-saves it; if it never fired, run /pm-inbox to see current state."

2. **Summarize** what HANDOFF.md says:
   - Branch + last commit + uncommitted file count
   - Open gates (with IDs)
   - Latest agent verdict (DONE / BLOCKED)
   - Latest drafts

3. **Check for `.learn-pending` marker**:
   ```bash
   [ -f .great-pm/.learn-pending ] && echo "LESSONS_PENDING"
   ```
   If pending → recommend `/pm-save` first.

4. **Recommend next action** based on state:
   - Lessons pending → run `/pm-save` to capture, then `/pm-inbox`.
   - Open gates → `/pm-inbox` to review the decision packages.
   - Active initiative mid-stage → tell pm-lead to continue: "advance <initiative>".
   - Nothing open → `/pm-start "..."` to kick off the next one.

## Output shape

```
great-pm resume

Last session: <date> (<branch>)
Last commit: <hash> <subject>
Uncommitted: <N> files

Open gates: <count>
  - <gate-id>: <one-line>

Latest verdict: <agent> | <DONE | BLOCKED> | <subject>

Next: <recommended action — concrete command>
```

## Reporting
- **DONE**: `DONE: resumed — <one-line summary>. next: <command to run>.`
- **BLOCKED**: when HANDOFF.md is unreadable AND no PROJECT.md exists.
