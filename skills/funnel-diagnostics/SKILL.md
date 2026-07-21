---
name: funnel-diagnostics
description: The step-by-step drop-off diagnostic workflow — define the funnel, measure each step's conversion, find the worst drop, diagnose WHY (segment-by-segment + qual), fix, and re-measure. Turns "the numbers dropped" into a located, explained, validated fix. The segmentation step is what separates diagnosis from description. Used by analytics-analyst.
when_to_use: |
  Use when conversion through a multi-step journey is the problem and you
  need to locate, explain, and fix the drop — onboarding→first-value,
  signup→paid, upload→insight, any ordered flow. Trigger on "users sign
  up but never finish," a sudden conversion drop, or a hand-off from
  activation-aha-moment (you know the aha; now find where users stall
  before it). Primarily for analytics-analyst.
allowed-tools: Read, Write
---

> **Provenance.** great-pm-original, authored 2026-05-29, grounded in the
> cited sources (Plane, FullSession, Datadog Product Analytics). Host
> agent: analytics-analyst.

# Funnel Diagnostics — locate, explain, fix, re-measure

A funnel is **diagnostic, not descriptive — but only once you segment
it.** An aggregate funnel tells you *where* users drop. That is necessary
and almost useless on its own: "60% drop at the upload step" prompts a
quarter of guesswork. The leap from *description* to *diagnosis* is
**segmentation + session review** — splitting the drop by device, source,
plan, cohort until the loss concentrates in a group, because the group
where the drop concentrates *is the diagnosis*. Then you prioritize the
drop that blocks value for the **largest group**, fix it, and **re-measure
the specific step** to confirm the curve moved.

The single biggest failure in funnel work is reading the aggregate
number, "fixing onboarding" generically, and shipping a change that moves
nothing because the real loss was a PDF-parser failure for one bank,
invisible in the average.

## 1. The 5-step workflow

### Step 1 — Define the journey

Write the *ordered* steps that constitute the conversion. Each step is a
discrete, instrumented event with an unambiguous fire condition (see
`metrics-design` §4 — event names, properties, triggers, dedup). Rules:
- **Order matters and must be real.** Steps should be sequential
  dependencies, not parallel activities lumped together.
- **Pick the right funnel scope.** A macro funnel (signup → retained) and
  a micro funnel (the upload sub-flow) answer different questions. Don't
  mix granularities in one funnel.
- **Define the conversion window.** "Reached step 4" *within 24h* vs *ever*
  are different funnels. State it.
- **Anchor the end on value, not a vanity event.** The funnel should end
  at the aha / first value (see `activation-aha-moment`), not at "clicked
  the final button."

### Step 2 — Measure step-to-step progression

For each transition compute **step conversion** (% who advanced) and
**drop-off** (% lost). Also track:
- **Overall conversion** (top to bottom) for the headline.
- **Time-between-steps** — a step with *high* conversion but a long,
  fat-tailed delay is a hidden friction point (users return days later,
  many never do).
- **Where the absolute volume is.** A 70% drop at a step only 50 users
  reach loses fewer users than a 20% drop at a step 50,000 reach. Rank by
  *users lost*, not *drop %*.

### Step 3 — Segment the story (the diagnosis leap)

This is the step that turns numbers into a cause. Re-run the funnel split
by the dimensions most likely to fork behavior:
- **Device / platform** — desktop vs mobile vs web routinely diverge hard
  at the *same* step (a form that works on desktop is unusable on a small
  screen).
- **Acquisition source / campaign** — paid-search traffic often converts
  differently than organic or referral; a bad-fit channel shows up as a
  top-of-funnel drop.
- **New vs returning**, **plan / trial vs paid**, **cohort / time period**
  (did the drop start on a specific release date?).
- **Product-specific dimensions** — the input type, the integration, the
  region, the data source.

The rule: **keep splitting until the drop concentrates.** If 60% drop at
"parsed" is actually 90% for one segment and 15% for the rest, you have
located the cause to a population. An undifferentiated drop spread evenly
across all segments is a different (usually UX/copy) problem than a drop
concentrated in one segment (usually a broken path for that segment).

### Step 4 — Explain the drop-off (quant + qual)

Segmentation tells you *where + who*; you still need *why*. Pair the
quantitative location with qualitative evidence:
- **Session replays / event traces** of droppers vs progressers *at the
  same step*. What did the people who stalled do — rage-clicks, repeated
  form submits, a back-button loop, a long idle, an error toast?
- **Funnel + error overlay** — correlate the drop with logged errors,
  latency spikes, validation failures at that step.
- **Targeted qual** — interview or survey users who dropped at that step
  (ties to `cohort-analysis` follow-up research). Five replays often beat
  five hypotheses.
- Output a **named friction**: not "users drop at upload" but "PDF uploads
  from Bank-X hit a layout-detection timeout and show a spinner that never
  resolves."

### Step 5 — Fix and re-measure (close the loop)

- Form the fix as a hypothesis tied to the named friction.
- Where the stakes/uncertainty warrant, ship it as an **experiment** (hand
  to `experiment-design`) so the lift is attributable; for an obvious
  bug-fix, a before/after on the specific step may suffice.
- **Re-measure the *specific* step**, segmented the same way, and confirm
  *that* transition's conversion moved — not just that overall conversion
  drifted (which could move for unrelated reasons).
- Watch for the **whack-a-mole**: fixing step 3 sometimes just relocates
  the drop to step 4 (users you let through were never going to convert).
  Confirm the *downstream* steps held.

## 2. When to use — and when NOT to

| Use it when… | Because… |
|---------------|----------|
| A multi-step conversion is leaking | This is the locate-and-explain workflow |
| Conversion dropped suddenly | Cohort/time segmentation pinpoints the release that broke it |
| "Users sign up but never finish X" | The micro-funnel for X surfaces the exact stall |
| Hand-off from activation-aha-moment | You know the aha; map and fix the pre-aha funnel |
| You're about to "improve onboarding" broadly | Locate the real drop first, or you'll fix the wrong thing |

**When NOT to use:**
- **No defined sequential journey.** If the behavior isn't an ordered
  flow (e.g., free-form exploration), a funnel imposes false structure —
  use engagement-depth / cohort analysis instead.
- **Retention-over-time questions.** "Do March users still come back in
  June?" is a cohort question, not a funnel. Use `cohort-analysis`.
- **Too little volume to segment.** Segmentation needs enough N per
  segment to be non-noise. With tiny numbers, go straight to qualitative
  session review; skip the splits.
- **You haven't defined *value*.** If the funnel's endpoint is a vanity
  event, fixing the funnel optimizes toward nothing. Define the aha first
  (`activation-aha-moment`).

## 3. Worked example — Acme onboarding → first-value funnel

**The funnel** (ends at the aha — first categorized insight):

```
1. open app / signup
2. add a source            (CSV / PDF / Gmail)
3. statement parsed        (transactions extracted)
4. transactions categorized (gates run)
5. first insight viewed    (the categorized cash-flow view)  ← value
6. returns within 7 days   (early retention)
```

**Step 2 — measure.** Aggregate shows the worst drop at **3 → 4 (parsed →
categorized): 60% lost.** Naive read: "categorization is broken, fix the
gates." That would be wrong.

**Step 3 — segment.** Split the 3 → 4 drop by **source type** and **bank /
issuer**:

| Segment | parsed → categorized conversion |
|---------|---------------------------------:|
| CSV (any bank) | 96% |
| PDF — Bank A, Bank B | 94% |
| **PDF — Bank X** | **8%** |
| Gmail-sync | 91% |

The 60% aggregate drop was an *average* hiding a near-total failure for
**PDF statements from Bank X**, washed out by healthy CSV/Gmail volume.
The diagnosis is now located to a population.

**Step 4 — explain.** Event traces for Bank-X PDF droppers show the file
parses (step 3 fires) but step 4 never fires — the transactions sit
uncategorized. Cross-referencing logs: Bank-X's layout produces a
layout-cache *miss*, the flow queues a layout-detection job, and the UI
shows "Categorizing…" indefinitely because the detect job is backlogged /
failing for that issuer's layout. **Named friction:** "Bank-X PDF layout
isn't in the cache; the detect-job path strands the user on a permanent
processing spinner." This is *not* a generic onboarding problem and *not*
a categorization-quality problem.

**Step 5 — fix + re-measure.** Two-part fix: (a) prioritize a layout
schema for Bank-X (cache hit on next upload); (b) UX fallback so a
detect-job miss surfaces a graceful state ("we're still learning this
bank's format — here's a partial view / try CSV") instead of an infinite
spinner. Ship behind a flag, re-measure the 3 → 4 transition *for the
Bank-X PDF segment specifically*. Target: 8% → 90%+. Confirm steps 4 → 5
→ 6 hold (the rescued users actually reach value and return), not just
that the immediate step moved.

**The lesson the skill enforces:** without §3 segmentation you'd have
"fixed onboarding" or "fixed the gates" and moved the aggregate barely at
all, because the loss was one bank's PDF layout the whole time.

## 4. Common pitfalls

| Pitfall | Why it fails | Fix |
|---------|--------------|-----|
| Reading the aggregate funnel only | Averages hide segment-specific failures (the Bank-X trap) | Always segment; keep splitting until the drop concentrates |
| No segmentation at all (the cardinal sin) | You "fix onboarding" generically and move nothing | Split by device, source, cohort, plan; find the population |
| Prioritizing the biggest **drop %** | A huge % on a tiny-volume step loses fewer users than a small % on a big-volume step | Rank by **users/value lost**, not drop rate |
| Quant without qual | You know *where + who*, never *why* — so the fix is a guess | Watch session replays of droppers vs progressers at that step |
| Vanity endpoint | Funnel "converts" to an event that isn't value; fixing it gains nothing | End the funnel on the aha (activation-aha-moment) |
| Not validating the specific step moved | Overall conversion drifts for many reasons; you claim a win that wasn't yours | Re-measure the exact transition, segmented identically |
| Whack-a-mole | Fixing step 3 just relocates the drop to step 4 | Confirm downstream steps held after the fix |
| Mixing funnel granularities / no window | Macro and micro steps in one funnel, or "ever" vs "in 24h" undefined, makes the numbers uninterpretable | Fix one scope + one conversion window per funnel |

## 5. Ethical boundary

A funnel measures whether users reach **genuine value**, not whether they
can be coerced past a step. "Fixing" a drop with a forced step, a
hard-to-dismiss interstitial, a hidden opt-out, or a fake-urgency nudge
raises the step conversion while harming the user — and typically just
relocates the loss downstream (or to churn after the value never
materializes). Fix friction by *removing obstacles to value*, not by
*adding pressure*. If your funnel "improvement" would embarrass you if a
user saw the reasoning, it's a dark pattern.

## 6. Quick diagnostic

| Question | If "no" → |
|----------|-----------|
| Is the funnel an *ordered* sequence ending on **value**? | Redefine steps; anchor the end on the aha |
| Did you measure each step's conversion *and* time-between-steps? | Add the per-transition + latency measurement |
| Did you **segment** the worst drop until it concentrated? | Split by device / source / cohort / plan — this is the diagnosis |
| Did you prioritize by **users/value lost**, not drop %? | Re-rank by absolute volume |
| Do you have **qual** (replays/errors) explaining *why* they dropped? | Watch droppers vs progressers at that step |
| After the fix, did the **specific segmented step** move, with downstream holding? | Re-measure; check for whack-a-mole |

## 7. Cross-links & boundary

- **`activation-aha-moment`** — defines the funnel's *endpoint* (the aha)
  and is the upstream sibling: that skill finds *what* value moment
  matters; this finds *where users stall before it*.
- **`cohort-analysis`** — answers retention-over-time and supplies the
  cohort splits you segment by; this skill is the *step-by-step drop
  workflow*, not the cohort retention curve.
- **`metrics-design`** — the event/instrumentation spec (names,
  properties, triggers, dedup) every funnel step depends on; define
  events there, build the funnel here.
- **`experiment-design`** — how you ship and attribute the Step-5 fix when
  the stakes/uncertainty warrant a controlled test.
- **`north-star-input-tree`** — funnel conversion rates are common input
  metrics under a North Star; a leaking funnel step is often the weakest
  input.
- **`improve-retention`** — step 6 (early return) bridges funnel into
  retention; deeper retention tactics live there.

**Differs from `cohort-analysis` because** that tracks a fixed group's
behavior *over time* (retention curves); this tracks a population's
progression *through ordered steps* and locates the drop. **Differs from
`metrics-design` because** that defines *what to measure*; this is the
diagnostic *workflow* once the numbers exist. **Differs from
`activation-aha-moment` because** that finds the *value moment*; this
finds and fixes the *path to it*.

## Sources

- Plane, "Conversion Funnel Analysis for PMs: How to Spot Drop-offs" — https://plane.so/blog/conversion-funnel-analysis-for-product-managers-how-to-spot-drop-offs
- FullSession, "Conversion Funnel Analysis Workflow to Diagnose Drop-offs" — https://www.fullsession.io/blog/conversion-funnel-analysis-workflow/
- Datadog, "Investigate funnel drop-offs with Product Analytics" — https://www.datadoghq.com/blog/product-analytics-funnels/
- Amplitude, "Funnel Analysis" (segmentation as diagnosis) — https://amplitude.com/blog/funnel-analysis
