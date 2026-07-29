---
description: Competitive teardown — for a given competitor or for the whole landscape around a JTBD. Spawns market-analyst. Outputs structured brief with positioning gaps.
argument-hint: "<competitor-name | jtbd-slug> [--depth=quick|deep]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-competitive` command. Build a competitive view.

## Parse arguments

- **`<competitor-name | jtbd-slug>`** (required) → either a single
  competitor or a JTBD slug (in which case the agent enumerates the
  landscape).
- **`--depth=`** (default: `quick`).
  - `quick` — public surface (site, docs, pricing page, recent
    announcements).
  - `deep` — quick + user reviews + g2/capterra + estimated funnel +
    inferred metric movements.

## Pre-flight

```bash
TARGET="${1:?usage: /pm-competitive <competitor-or-jtbd> [--depth=...]}"
mkdir -p .great-pm/drafts
```

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

1. **market-analyst**
   - Brief: per target, gather:
     - **Positioning statement** (theirs, in their words).
     - **Pricing model** + tier shape.
     - **Core JTBD covered** + where they fall short.
     - **Recent moves** (last 90 days — launches, partnerships, pricing
       changes).
     - **Gaps we can exploit** (this is the punchline).
     - **Things they do better than we do** (the honesty section).
   - If JTBD-slug, enumerate the top 3–5 competitors and apply the above
     per competitor, plus a comparison table at the end.
   - Output: `.great-pm/drafts/competitive-brief-<target-slug>.md` using
     `templates/COMPETITIVE-BRIEF-template.md`.

2. Surface the **3 positioning gaps we should consider** as the
   one-screen summary.

## Reporting

- **DONE**: `DONE: /pm-competitive — competitive-brief-<target-slug>.md ready (depth: <depth>). <C> competitors covered. Top gap: <one-line>.`
- **BLOCKED**: market-analyst unavailable / sources blocked. tried + failed_because + need.

## Notes

- The **honesty section** (things they do better) is the most valuable
  output. Skipping it produces a flattering report that doesn't help.
- Public surface only — no scraping of paywalled / private data.
