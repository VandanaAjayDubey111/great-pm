---
description: Kick off the Strategize stage. Spawns product-strategist (lead) with optional pricing-strategist support. Reads discovery + competitive briefs, outputs a strategy doc with falsifiable bets.
argument-hint: "<initiative-slug> [--with-pricing]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-strategize` command. Stage 2 of the 6-stage loop.

## Parse arguments

- **`<initiative-slug>`** (required).
- **`--with-pricing`** (optional) → also spawn pricing-strategist for a
  monetization angle.

## Pre-flight

```bash
SLUG="${1:?usage: /pm-strategize <initiative-slug> [--with-pricing]}"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
ls .great-pm/drafts/discovery-brief-${SLUG}.md 2>/dev/null && echo "DISC_OK" || echo "NO_DISC"
ls .great-pm/drafts/competitive-brief-${SLUG}.md 2>/dev/null && echo "COMP_OK" || echo "NO_COMP"
mkdir -p .great-pm/drafts
```

If `NO_DISC` or `NO_COMP` → BLOCKED. Tell the user to run `/pm-discover` first.

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

1. **product-strategist** (always)
   - Brief: read the discovery + competitive briefs. Author a strategy
     doc with:
     - The bet (one sentence, falsifiable).
     - Why now (timing argument).
     - The mechanism (how the bet works).
     - The 3 strongest counter-arguments and the rebuttal.
     - The "we are wrong if" condition (kill criterion).
   - Output: `.great-pm/drafts/strategy-<slug>.md` using
     `templates/STRATEGY-template.md`.

2. **pricing-strategist** (if `--with-pricing`)
   - Brief: propose 2–3 monetization models, with willingness-to-pay
     rationale per audience.
   - Output: `.great-pm/drafts/pricing-plan-<slug>.md` using
     `templates/PRICING-PLAN-template.md`.

3. Update PROJECT.md: stage `strategize` → complete. Next: `prioritize`.

4. **Suggest a /pm-review** on the strategy doc before /pm-prioritize:
   ```
   Recommended: /pm-review .great-pm/drafts/strategy-<slug>.md --lens=strategy
   ```
   (The strategy lens applies skeptical-triage — the bet must be
   falsifiable and the strongest counter rebutted.)

## Reporting

- **DONE**: `DONE: /pm-strategize — strategy-<slug>.md ready[, pricing-plan-<slug>.md ready]. Suggested next: /pm-review --lens=strategy, then /pm-prioritize.`
- **BLOCKED**: missing discovery prereqs. tried + failed_because + need.

## Notes

- A strategy that can't fail isn't a strategy — it's a slogan. The
  template forces the "we are wrong if" line.
- `pm-reviewer` is called explicitly here, not auto-invoked. Strategy
  drafts often need 1–2 user-edit rounds before they're worth reviewing.
