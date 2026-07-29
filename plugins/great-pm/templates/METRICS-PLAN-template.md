# Metrics Plan — <initiative>

> Authored by `metrics-architect`. Defined BEFORE the build. Per `skills/metrics-design/SKILL.md`.

**Date:** <YYYY-MM-DD>

---

## North Star

**<metric name and unit>**

- **Tied to strategy bet:** <which bet>
- **How it's defined:** <precise unit and period — e.g., "weekly active payers", "matched transactions per week">
- **Can it credibly DROP?** <yes — explanation>  *(If no, it's vanity — kill it)*

## Leading KPIs (predictors)

| KPI | What it predicts | Lead time |
|---|---|---|
| <activation rate>           | <North Star> | <days> |
| <time-to-first-value>       | <North Star> | <days> |
| <onboarding completion>     | <North Star> | <days> |

## Lagging KPIs (outcomes)

| KPI | What it confirms |
|---|---|
| <day-7 retention> | <North Star> trend |
| <revenue per active user> | strategy bet <X> |
| <NPS> | satisfaction durability |

## Event / instrumentation spec

For engineering. Each event has: name, properties, trigger condition, dedup.

### Event: `<event_name>`
- **Properties:** `user_id`, `plan_tier`, `source`, `timestamp`, ...
- **Trigger:** <exactly when fires — server-side after DB write / client-side on confirmation>
- **Dedup:** <how duplicate fires are prevented>

### Event: `<event_name>`
*<repeat>*

## Success thresholds (numbers, never adjectives)

- **Target:** <metric> > <number>
- **Floor:** <metric> not below <number>
- **Window:** <30d / 90d / cumulative>

> "Improve" or "increase" is not a threshold. Set a number.

## Baselines

- <metric>: current value <X> (source: <>)
- <metric>: **no baseline yet — first measurement establishes**

---

> Linked: `.great-pm/drafts/prd-<slug>.md` (the PRD this measures).
> Engineering implements the events; QA verifies firing per spec.
