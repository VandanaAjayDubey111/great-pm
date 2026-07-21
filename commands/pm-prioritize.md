---
description: Kick off the Prioritize stage. Spawns prioritization-analyst (RICE/WSJF/Kano/MoSCoW), then tradeoff-arbiter if conflicts surface. Outputs a ranked backlog feeding gate:strategy.
argument-hint: "<initiative-slug> [--method=rice|wsjf|kano|moscow]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-prioritize` command. Stage 3 of the 6-stage loop.

## Parse arguments

- **`<initiative-slug>`** (required).
- **`--method=`** (optional, default: prioritization-analyst picks).
  - `rice` — Reach × Impact × Confidence / Effort.
  - `wsjf` — Weighted Shortest Job First.
  - `kano` — Must-have / Performance / Delighter classification.
  - `moscow` — Must / Should / Could / Won't.

## Pre-flight

```bash
SLUG="${1:?usage: /pm-prioritize <initiative-slug> [--method=...]}"
ls .great-pm/drafts/strategy-${SLUG}.md 2>/dev/null && echo "STRAT_OK" || echo "NO_STRAT"
mkdir -p .great-pm/drafts
```

If `NO_STRAT` → BLOCKED. Run /pm-strategize first.

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

1. **prioritization-analyst**
   - Brief: read strategy doc. Enumerate candidate scope items. Apply the
     chosen method (or recommend one if user didn't specify).
   - Output: `.great-pm/drafts/prioritized-backlog-<slug>.md` —
     a ranked list with the score per row, plus the rationale for the
     top 5 and the cuts.

2. If two items tie at the top, or the method produces conflicting
   signals, spawn **tradeoff-arbiter** with the contested items. Their
   verdict goes verbatim into the backlog doc.

3. Update PROJECT.md: stage `prioritize` → complete. Initiative is now
   **ready for gate:strategy**.

4. **Promote to gate:strategy** is the next move. Suggest:
   ```
   /pm-promote .great-pm/drafts/strategy-<slug>.md --gate=strategy
   ```
   (This routes through pm-reviewer; PASS → Beads gate issue → human
   approval.)

## Reporting

- **DONE**: `DONE: /pm-prioritize — prioritized-backlog-<slug>.md ready (<method>). <N> items ranked. Top 5: <names>. Suggested next: /pm-promote --gate=strategy.`
- **BLOCKED**: missing strategy. tried + failed_because + need.

## Notes

- The method matters less than the discipline of applying ONE method
  consistently. Don't average across methods — that's how false consensus
  is manufactured.
- The cuts (bottom of the list, with rationale) are as important as the
  picks. Future-you needs to know why something was deferred.
