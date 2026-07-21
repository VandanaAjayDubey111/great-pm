---
description: Author a metrics plan BEFORE the build. Defines North Star, leading + lagging KPIs, instrumentation events, success thresholds, and baselines. Runs metrics-architect.
argument-hint: "<initiative-slug>"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-metrics` command. Force the metrics question to
the front of the build, not the back.

## Parse arguments

- **`<initiative-slug>`** (required).

## Pre-flight

```bash
SLUG="${1:?usage: /pm-metrics <initiative-slug>}"
ls .great-pm/drafts/prd-${SLUG}.md 2>/dev/null && echo "PRD_OK" || echo "NO_PRD"
ls .great-pm/drafts/strategy-${SLUG}.md 2>/dev/null && echo "STRAT_OK" || echo "NO_STRAT"
mkdir -p .great-pm/drafts
```

At least one of PRD or strategy doc must exist (you can't define metrics
for nothing). If both are missing → BLOCKED.

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

1. **metrics-architect**
   - Brief: read strategy + PRD. Define:
     - **North Star** — name + unit + period. Must be able to **drop**
       credibly (if it can only go up, it's vanity).
     - **Leading KPIs** (predictors) — with lead time.
     - **Lagging KPIs** (outcomes) — confirms North Star trend.
     - **Event / instrumentation spec** — for engineering. Each event:
       name, properties, trigger condition, dedup strategy.
     - **Success thresholds** — numbers (NOT "improve" / "increase").
     - **Baselines** — current values, or `no baseline yet`.
   - Output: `.great-pm/drafts/metrics-plan-<slug>.md` using
     `templates/METRICS-PLAN-template.md`.

2. Reminder for the user:
   - Engineering implements the events.
   - QA verifies events fire per spec in staging BEFORE launch.
   - Without this plan and verification, the read-out at /pm-measure will
     be guesswork.

## Reporting

- **DONE**: `DONE: /pm-metrics — metrics-plan-<slug>.md ready. North Star: <name>. <L> leading + <G> lagging KPIs. <E> events specced.`
- **BLOCKED**: nothing to measure (no strategy + no PRD). tried + failed_because + need.

## Notes

- Metrics plan **precedes the build**. If you're running this AFTER
  engineering started, that's a process bug — flag it.
- A metric that can't credibly drop is a vanity metric. Kill it.
- "Improve" is not a threshold. Set a number.
