---
name: metrics-design
description: Playbook for designing product metrics — North Star, leading vs lagging KPIs, event instrumentation, success thresholds, and the vanity-metric traps. Used by metrics-architect.
when_to_use: |
  Use when defining what success looks like before a build, designing
  instrumentation, or sanity-checking a metrics plan. Primarily for
  metrics-architect.
allowed-tools: Read, Write
---

# Metrics Design — playbook

Metrics designed AFTER the build are too late. Metrics that cannot drop are
vanity. The goal: ONE North Star, a few leading and lagging KPIs around it,
and an instrumentation spec engineering can implement without ambiguity.

## 1. The North Star — one number

The North Star is the SINGLE number that, if it improves, the strategy is
working.
- **Tied to a strategy bet**, not to vague "engagement".
- **Measurable** in a defined unit and period (e.g., "weekly active payers").
- **Honest** — it has an up direction AND a credible down direction. If it
  cannot drop, it is vanity.

Examples by archetype:
- B2B SaaS — weekly active accounts using a key feature.
- Consumer app — 7-day retained users.
- Marketplace — matched transactions per week.
- Dev tool — weekly active projects.

## 2. Leading vs Lagging KPIs

Around the North Star, pick 2–3 of each:

**Leading** — predictors. They move FIRST. If they improve, the North Star
will likely improve later.
- Sign-ups, activation rate, onboarding completion, time-to-first-value.

**Lagging** — outcomes. They CONFIRM. They follow leading by days or weeks.
- Retention cohort curves, revenue, NPS.

A KPI set with no leading indicators is rear-view-only. A KPI set with no
lagging indicators is "we are doing things" without "are they working?"

## 3. A common frame: AARRR (Pirate Metrics)

- **A**cquisition — how do users find us?
- **A**ctivation — do they have the first valuable experience?
- **R**etention — do they come back?
- **R**eferral — do they bring others?
- **R**evenue — do they pay?

Useful for spotting metric gaps; not the only frame. Adopt or skip based on
strategy.

## 4. Event / instrumentation spec

For every metric, engineers need to know:

- **Event name** — `signup_completed`, `feature_x_used` — never "user_action".
- **Properties** — `user_id`, `plan_tier`, `source`, `timestamp`, etc.
- **Trigger condition** — exactly when it fires (server-side after DB write,
  client-side on confirmation, etc.).
- **Idempotency / dedup** — can the same event fire twice? If yes, how is
  it deduplicated?

Ambiguous events produce useless data. Engineers cannot guess intent.

## 5. Success thresholds — set a number

A KPI without a threshold is a thermometer with no fever line.
- Set a target: "weekly active accounts > 30% of paid accounts."
- Set a floor: "retention day-7 not below 25%."
- Numbers, dates, percentages — not "improve" or "increase."

## 6. Vanity-metric traps to avoid

- **Total counts** without a denominator (total users, total events).
- **"Engagement"** as a single number — mash-up of unrelated signals.
- **Pageviews** for products that aren't ad-supported.
- **Sign-ups without activation** — "we got 1000 sign-ups, 12 ever used it."
- Any metric that **cannot credibly drop**.

## 7. Output shape

A metrics plan that shows: the North Star (with strategy-bet link), leading +
lagging KPIs (with the logic), the event/instrumentation spec (exact names,
properties, triggers, dedup), success thresholds (numbers), and baselines
(or "no baseline — first measurement").
