---
description: Author or refresh a pricing plan — 2–3 monetization models with willingness-to-pay rationale per audience. Spawns pricing-strategist.
argument-hint: "<initiative-slug-or-product> [--refresh]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-pricing` command. Author a defensible pricing
plan.

## Parse arguments

- **`<initiative-slug-or-product>`** (required) — initiative slug OR the
  word `product` (whole product pricing).
- **`--refresh`** → read existing pricing plan and update; surface what
  changed.

## Pre-flight

```bash
SCOPE="${1:?usage: /pm-pricing <slug-or-product> [--refresh]}"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
ls .great-pm/drafts/competitive-brief-*.md 2>/dev/null && echo "COMP_OK" || echo "NO_COMP"
mkdir -p .great-pm/drafts
```

If `NO_COMP` → WARN. Pricing without a competitive view is guesswork.
Recommend running `/pm-competitive` first.

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

1. **pricing-strategist**
   - Brief: author 2–3 candidate models. For each:
     - **Model name** (e.g. "Per-seat", "Per-user + usage", "Freemium with
       paid tier", "Outcome-based").
     - **Audience fit** — who it works for, who it doesn't.
     - **Willingness-to-pay rationale** — what evidence supports the
       price point (competitor pricing, value-based estimate, conjoint,
       user research).
     - **Funnel implications** — what does it do to acquisition /
       conversion / expansion.
     - **Failure modes** — when this model would lose.
     - **Recommended price points** with anchors.
   - Conclude with a **pick** and the explicit reason ("we pick model B
     because…").
   - Output: `.great-pm/drafts/pricing-plan-<scope>.md` using
     `templates/PRICING-PLAN-template.md`.

2. If `--refresh`, surface **What Changed**:
   - Price points moved? (and why)
   - Models added or dropped?
   - Audience definitions tightened?

3. Suggest the next move:
   - If you're early → run `/pm-experiment --type=ab` on price points.
   - If you're late → run `/pm-measure` after rollout to validate.

## Reporting

- **DONE**: `DONE: /pm-pricing — pricing-plan-<scope>.md ready. <M> models considered, pick: <name>. Anchor price: <amount>.`
- **BLOCKED**: missing prereqs. tried + failed_because + need.

## Notes

- Pricing is **never** purely competitor-anchored. Willingness-to-pay
  evidence per audience is what makes the plan defensible.
- The honesty filter: which audience would walk away at this price? If
  the answer is "none", the price is too low.
