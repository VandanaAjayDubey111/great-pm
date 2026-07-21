---
description: Design an A/B test, holdout, multivariate, or switchback experiment. Spawns experiment-designer. Output is gate-quality: pre-registered hypothesis, MDE, guardrails, stopping rules.
argument-hint: "<hypothesis-slug> [--type=ab|multivariate|holdout|switchback]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-experiment` command. Author a pre-registered
experiment.

## Parse arguments

- **`<hypothesis-slug>`** (required) → kebab-case slug (e.g.
  `onboarding-shorter-flow`).
- **`--type=`** (optional, experiment-designer recommends if omitted).
  - `ab` — classic two-arm A/B.
  - `multivariate` — multiple factors.
  - `holdout` — one cohort doesn't get the change (for long-term effects).
  - `switchback` — time-sliced (for marketplace / two-sided experiments).

## Pre-flight

```bash
SLUG="${1:?usage: /pm-experiment <hypothesis-slug> [--type=...]}"
mkdir -p .great-pm/drafts
ls .great-pm/drafts/metrics-plan-*.md 2>/dev/null && echo "METRICS_EXISTS" || echo "NO_METRICS"
```

If `NO_METRICS` → WARN. Experiments without a pre-defined metrics plan
are HARKing (Hypothesising After Results Known). Recommend running
`/pm-metrics` first.

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

1. **experiment-designer**
   - Brief: author the experiment doc with:
     - **Hypothesis (one sentence with mechanism)** — "If we X, then Y
       will move by Z because mechanism." If the mechanism is hand-wavy,
       the result won't generalise.
     - **Primary metric** (must be pre-defined in metrics plan).
     - **MDE (minimum detectable effect)**.
     - **Guardrail metrics** (latency, errors, long-term retention).
     - **Test design** (type + justification + sample size + power + alpha).
     - **Pre-registered stopping rules** (no peeking before planned end).
     - **Risks** (novelty effect, seasonality, network effects).
     - Empty read-out section (DO NOT pre-fill).
   - Output: `.great-pm/drafts/experiment-<slug>.md` using
     `templates/EXPERIMENT-template.md`.

2. Status: `PLANNED` (not RUNNING, not COMPLETE).

3. Optional: file a Beads issue to track the experiment run:
   ```
   bd create --title="Run experiment: <hypothesis>" \
     --description="See .great-pm/drafts/experiment-<slug>.md" \
     --type=task --priority=2 --labels=experiment
   ```

## Reporting

- **DONE**: `DONE: /pm-experiment — experiment-<slug>.md (status: PLANNED). Type: <type>. Duration: <days>. Sample: <N> per arm.`
- **BLOCKED**: experiment-designer unavailable. tried + failed_because + need.

## Notes

- **Frame the hypothesis BEFORE running.** HARKing is forbidden.
- A "winning" primary with a broken guardrail is a regression in disguise.
- The read-out section stays empty until the experiment ends. Filling it
  early is a process violation.
