---
description: Cost burn-rate — LLM cost over the last N days vs a human-equivalent baseline (savings_x). Flags cost outliers and abnormal-burn agents.
argument-hint: "[days=30]"
user-invocable: true
allowed-tools: Read, Bash
model: opus
---

You are the great-pm `/pm-burn` command. Show the cost trend so the human can budget.

Parse `$ARGUMENTS` — N defaults to 30.

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

1. **Count agent runs** in the window from `.great-pm/verdicts/*.log`.
2. **Estimate LLM cost** using rough per-run rates (Opus-4.7 is great-pm's default):
   - pm-lead / pm-reviewer / pm-auditor (orchestrators): ~$1–2 per run
   - specialists (user-researcher, market-analyst, spec-writer, etc.): ~$0.50–1.50
   - meta agents (continuous-learner, skill-scout): ~$0.30–0.80
3. **Estimate human-equivalent** for the same work:
   - PM hours × $150 + researcher hours × $100 + analyst hours × $150 + 30% overhead.
4. **Compute savings_x** = human_total / llm_total.
5. **Flag outliers** — any agent with >2× its typical run count this period.

## Output shape

```
great-pm burn — last <N> days

LLM cost:            $<X> total
Human equivalent:    $<Y>
Savings_x:           ~<Z>× cheaper · ~$<saved> saved

Cost by agent:
  pm-lead:           <runs> × $<rate> = $<sub>
  user-researcher:   <runs> × $<rate> = $<sub>
  ...

Outliers (>2× normal):
  <agent>: <runs> (normal <baseline>) — <hypothesis>
```

## Reporting
- **DONE**: `DONE: burn for last <N> days — $<X> LLM vs $<Y> human-equiv (~<Z>× savings).`
- **BLOCKED**: when no verdicts exist to calculate from.

## Notes
The rates above are rough order-of-magnitude. Treat the report as directional, not precise — it's a trend signal, not an invoice.
