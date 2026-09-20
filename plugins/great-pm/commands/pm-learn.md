---
description: Auto-extract repeatable patterns, decisions, and cost outliers from the current session and append to .great-pm/lessons.md. Promotes ≥3-occurrence patterns to ~/.great-pm/decisions.md. Runs continuous-learner.
argument-hint: "[--dry-run]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-learn` command. Capture session learnings without
requiring a full `/pm-save`.

## Parse arguments

- `--dry-run` → continuous-learner produces the lessons block but does NOT
  write it to disk. Print preview only.
- (no flag) → write to `.great-pm/lessons.md` and promote ≥3-occurrence
  patterns to `~/.great-pm/decisions.md`.

## Pre-flight

```bash
echo "cwd=$(pwd)"
mkdir -p .great-pm
ls .great-pm/lessons.md 2>/dev/null && echo "LESSONS_OK" || echo "FIRST_RUN"
ls .great-pm/.learn-pending 2>/dev/null && echo "PENDING_MARKER" || echo "NO_MARKER"
```

If `PENDING_MARKER` exists → this is the recommended path (SessionEnd hook
flagged something worth capturing).

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

1. Spawn `continuous-learner` as a subagent with:
   - Mode: `auto-extract` (no manual prompt).
   - Read the session history available to you.
   - `--dry-run` flag if set.

2. The agent identifies:
   - Repeatable patterns (≥2 occurrences in this session).
   - Decisions worth promoting (architectural, governance, naming).
   - Cost outliers (long-running agent invocations, repeated tool failures).

3. Output format (appended to `.great-pm/lessons.md`):
   ```
   ## <YYYY-MM-DD HH:MM> session
   - pattern: <one-line>  (count: N)
   - decision: <one-line>  (rationale: <one-line>)
   - cost outlier: <one-line>
   ```

4. If any pattern hits its 3rd occurrence in `lessons.md`, promote it to
   `~/.great-pm/decisions.md` with a back-reference to the 3 sources.

5. Clear `.great-pm/.learn-pending` if it exists.

## Reporting

- **DONE**: `DONE: /pm-learn captured <P> patterns, <D> decisions, <C> cost outliers. Promoted <M> to ~/.great-pm/decisions.md.`
- **DRY-RUN**: `DRY-RUN: would capture <P>/<D>/<C> — preview above.`
- **BLOCKED**: `BLOCKED: continuous-learner failed.` tried + failed_because + need.

## Notes

- This is the lightweight version. `/pm-save` is the full end-of-session
  hand-off (session log + status + lessons + open gates).
- Run `/pm-learn` mid-session whenever you notice the model just learned
  something worth remembering.
