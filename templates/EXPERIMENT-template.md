# Experiment — <hypothesis-slug>

> Authored by `experiment-designer`. Per `skills/experiment-design/SKILL.md`.

**Date:** <YYYY-MM-DD>
**Status:** PLANNED | RUNNING | COMPLETE

---

## Hypothesis (one sentence with mechanism)

**If we** <change>, **then** <primary metric> **will move by** <effect size> **because** <mechanism>.

> If you can't articulate the mechanism, the result won't generalise.

## Primary metric

- **Name:** <metric — must be pre-defined in metrics plan>
- **Direction:** increase | decrease
- **MDE (minimum detectable effect):** <%>

## Guardrail metrics (must NOT regress)

- **Latency / performance:** < <baseline>
- **Error rate:** < <baseline>
- **Long-term retention:** not below <baseline>
- **<other>:** <criterion>

> A "winning" primary with a broken guardrail is a regression in disguise.

## Test design

| | |
|---|---|
| **Type**            | A/B \| multivariate \| holdout \| switchback |
| **Justification**   | <why this type fits the change> |
| **Sample size**     | <N per arm> (from power calc) |
| **Power**           | 80% |
| **Alpha**           | 5% |
| **Baseline rate**   | <p> |
| **Duration**        | <calendar days> |
| **Randomization**   | user \| session \| account \| other |

## Pre-registered stopping rules

- **Planned end:** <date>
- **No peeking** before the planned end (peeking inflates false-positive rate).
- **Early stop allowed ONLY if:** <guardrail breach signal>.

## Risks
- **Novelty effect:** <mitigation>
- **Seasonality:** <mitigation>
- **Network effects:** <mitigation>

---

## Read-out (fill at the end — DO NOT pre-fill)

### Results
- **Primary metric:** <result> ± <CI>; effect size = <%>; p = <>
- **Guardrails:** <each — held / broken>
- **Statistical significance:** yes | no
- **Practical significance:** yes | no | depends

### Verdict
**SHIP | DON'T SHIP | INCONCLUSIVE | EXTEND**

### Reasoning (one paragraph)
<honest read of what the data says — including limitations>

---

> Linked: `.great-pm/drafts/metrics-<slug>.md` (the metric this moves).
> Frame the hypothesis BEFORE the test. HARKing (Hypothesising After Results Known) is forbidden.
