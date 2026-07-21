---
name: cohort-analysis
description: "Read retention curves and adoption trends by cohort and decide what is real signal vs noise. Use when analyzing retention by cohort, studying feature adoption over time, investigating churn, or comparing cohorts — to reach a defensible PM judgement, not just a chart."
---

> **Provenance.** Vendored from `phuryn/pm-skills@cohort-analysis` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution; reframed 2026-06-17 from a data-engineering recipe into a PM interpretation playbook. Host agent: analytics-analyst.

# Cohort Analysis — interpretation playbook

A cohort is a group of users bucketed by a shared starting event (signup
month, first-purchase week, feature-launch exposure) and then tracked over
the same elapsed time. The chart is the easy part. **The skill is the
judgement: deciding what is a real difference between cohorts, what is
noise, and what is an artefact of how you drew the cohort.** This skill is a
decision playbook, not a pandas recipe — you produce an insight and a
recommendation, not a script (generate code only if the human explicitly
asks).

## 1. Define the cohort — and freeze the definition

Before any number, pin down three things and write them down:

- **Grouping event** — what makes someone a member? (signup week, first
  paid transaction, first exposure to feature X). One event, stated once.
- **Elapsed-time axis** — week 0, 1, 2… measured from the grouping event,
  NOT calendar time. A user who signed up in March and one who signed up in
  May are both "week 4" at four weeks after their own signup.
- **The action that counts as "retained"** — opened the app? completed a
  core action? paid? "Retention" with no defined action is meaningless.

If you cannot state all three in one sentence, you do not yet have a cohort.

## 2. Read the retention curve — what counts as a real difference

The PM job is to look at two or more curves and answer: *is this a real
difference, or am I reading tea leaves?* Discipline before you conclude:

- **The curve shape matters more than any single point.** A healthy
  retention curve drops then *flattens* (a stable "smile" or plateau). A
  curve that keeps declining toward zero means no retained core — the
  product has no habit. Flattening height is the headline number.
- **Compare the same elapsed week, never calendar dates.** "May cohort is
  worse than March" is only valid if you compare both at week-4-since-signup,
  not March-at-week-8 vs May-at-week-2.
- **Size the difference against the cohort, not in absolute points.** A
  5-point retention gap between a 2,000-user cohort and a 1,800-user cohort
  is likely real. The same 5-point gap between two 40-user cohorts is almost
  certainly noise (see §4 pitfalls).
- **One surprising cohort is a hypothesis, not a finding.** Before you brief
  anyone, ask: what *changed* for that cohort? A launch, a pricing change, a
  marketing channel shift, a seasonal effect, an instrumentation change. If
  you cannot name a candidate cause, treat the swing as unexplained and say
  so.

State your read as: *"Week-4 retention for the alpha cohort plateaus at X%
(n=N). That is [above/below/indistinguishable from] the prior cohort's Y%
(n=M). I attribute the gap to Z / I cannot yet explain it."*

## 3. Feature-adoption trend across cohorts

Same discipline applied to adoption: bucket users by when they were first
*eligible* for the feature, then track the share who adopt by elapsed week.
The question is whether *newer cohorts adopt faster* (the onboarding /
discovery for the feature is improving) or whether adoption is flat across
cohorts (the feature is found by the same fraction regardless of when they
joined — usually a discoverability ceiling, not a value problem).

## 4. Pitfalls — the four ways cohort analysis lies to you

These are the failure modes that turn a cohort chart into a wrong decision.
Check every one before you brief a number.

1. **Cohort-definition drift.** The grouping event silently changes between
   analyses — "signup" meant *account created* last quarter and *email
   verified* this quarter. Now the cohorts are not comparable and the
   "improvement" is a definition change. Freeze the definition (§1) and
   re-state it in every read-out. If the definition must change, re-baseline
   and say the old numbers are not comparable.

2. **Survivorship in the retention curve.** Late-week retention looks like
   it *rises* ("week 12 is higher than week 8!"). It is not loyalty
   returning — it is survivorship: only the stickiest users are left, and
   recent cohorts have not *reached* week 12 yet so they are excluded from
   that column. Never read an upward tail as good news; check how many
   cohorts actually contribute to each elapsed-week column. A column fed by
   one old cohort is not a trend.

3. **Noise read as signal in small cohorts.** With small n, week-to-week
   retention bounces purely from sampling. A 40-user cohort losing 2 extra
   users reads as a 5-point "drop." Rule of thumb: be very skeptical of
   differences in cohorts under ~100, and treat single-digit user counts as
   anecdote, not rate. Quote the n next to every rate, always.

4. **Comparing unequal-size or unequal-maturity cohorts.** A 2,000-user
   acquisition-spike cohort and a 200-user organic cohort are not
   like-for-like — the big one likely pulled in lower-intent users from a
   paid channel and will retain worse for reasons that have nothing to do
   with the product. Likewise, a cohort that is only 3 weeks old cannot be
   compared on week-8 retention. Compare cohorts of similar size, similar
   acquisition source, and equal elapsed maturity — or explicitly flag the
   mismatch as a confound.

A fifth, quieter trap: **mistaking a one-time event for a trend.** A single
cohort dip aligned to an outage or a holiday is an event, not a pattern.
Require the pattern to repeat across ≥2 cohorts before calling it a trend.

## 5. From read to recommendation

A cohort read is only useful if it changes a decision. Close every analysis
with: (a) the one-sentence finding with n and confidence, (b) the most
likely cause (or "unexplained"), (c) the recommended next move —
usually one of: a targeted experiment to test the cause (→ `experiment-design`),
a retention intervention if the curve never flattens (→ `improve-retention`),
a funnel teardown if the drop is at a specific step (→ `funnel-diagnostics`),
or an activation fix if early-week retention is the problem
(→ `activation-aha-moment`).

## 6. Worked example — Acme alpha cohort retention read

**Setup.** Acme (AI expense tracker, Indian consumers) ran a closed
alpha. Cohort = *users who completed first statement upload*, in weekly
buckets. Retained = *opened the app AND viewed a categorized transaction* in
the elapsed week.

| Cohort (first upload) | n | wk0 | wk1 | wk2 | wk3 | wk4 |
|---|---|---|---|---|---|---|
| Week of Apr 7 | 120 | 100% | 54% | 41% | 38% | 37% |
| Week of Apr 14 | 95 | 100% | 49% | 36% | 31% | 30% |
| Week of Apr 21 | 38 | 100% | 61% | 50% | 47% | — |
| Week of Apr 28 | 180 | 100% | 47% | 33% | — | — |

**The naive read (wrong).** "Apr 21 is our best cohort — 47% at week 3! And
the Apr 28 cohort is collapsing." A PM who briefs this gets two things
wrong.

**The disciplined read.**
- The **Apr 7 and Apr 14 curves both flatten around 30–37% at week 3–4**
  (the plateau). That flattening is the real headline: roughly a third of
  users who upload a statement form a habit. The curve has a floor — there
  is a retained core. Good sign for an alpha.
- **Apr 21 (47% at wk3) is noise, not the best cohort.** n=38. A handful of
  extra-engaged early invitees swing a small cohort by double digits.
  Pitfall #3. Do not declare it a winner; do not go hunting for "what we did
  right that week."
- **Apr 28 is NOT collapsing.** Its wk2 (33%) sits right on the Apr 7/Apr 14
  trend line at wk2 (41% / 36%). It only *looks* worse because it is
  immature — it has not reached wk3/wk4 yet (pitfall #2/#4: unequal
  maturity). Comparing its wk2 to others' wk4 is the error.
- **One real, cautious signal:** Apr 14 plateaus ~7pts below Apr 7 at equal
  weeks across wk1–wk4. Two cohorts of comparable size (95 vs 120), same
  source, same maturity — that is more likely real than the Apr 21 spike.
  Candidate cause worth checking: an onboarding copy change shipped Apr 12.

**The recommendation.** Headline: *week-3 retention plateaus at ~33% of
uploaders (alpha) — there is a retained core.* Flag the Apr 14 dip as a
test-worthy hypothesis tied to the Apr 12 onboarding change (→ run a clean
`experiment-design` on the onboarding copy). Do not act on Apr 21. Re-read
Apr 28 once it reaches wk4 before drawing any conclusion.

## When NOT to use this skill

- **Before you have ≥2 cohorts with enough users and enough elapsed time.**
  One cohort is a single retention curve, not a comparison — and a cohort
  under ~50–100 users, or under a few weeks old, cannot support a confident
  read. Wait, or report it as directional-only.
- **For "what happened overall" questions** — total active users, aggregate
  revenue. That is a trend/dashboard question; cohorting adds confusion, not
  insight, when no per-bucket comparison is intended.
- **When the metric has no repeated-action meaning** (a one-time onboarding
  step that nobody is expected to repeat). Retention curves only make sense
  for actions users *can* do again.
- **To diagnose a specific step-level drop** — that is a funnel question.
  Reach for `funnel-diagnostics` instead.

## Cross-links

- **`experiment-design`** — when a cohort difference suggests a cause, that
  cause is a hypothesis. Test it cleanly rather than acting on the
  observational gap.
- **`improve-retention`** — when the curve never flattens (no retained
  core), the intervention playbook lives here.
- **`funnel-diagnostics`** — when the drop is concentrated at one step
  rather than spread across the curve, switch to a funnel teardown.
- **`activation-aha-moment`** — when week-0→week-1 is where you bleed users,
  the problem is activation, not long-run retention.
- **`metrics-design`** — the retained-action definition (§1) must match an
  instrumented event; design it there before you can cohort on it.

## Output shape

A cohort read-out that shows: the cohort definition (grouping event,
elapsed-time axis, retained-action) stated in one sentence; the retention or
adoption table with **n quoted for every cohort**; the one-sentence finding
with confidence; the most-likely cause or an explicit "unexplained"; and the
recommended next move with the cross-linked skill. No chart without a
written interpretation; no rate without its n.

---

### Further Reading

- [Cohort Analysis 101: How to Reduce Churn and Make Better Product Decisions](https://www.productcompass.pm/p/cohort-analysis)
- [The Product Analytics Playbook: AARRR, HEART, Cohorts & Funnels for PMs](https://www.productcompass.pm/p/the-product-analytics-playbook-aarrr)
- [Are You Tracking the Right Metrics?](https://www.productcompass.pm/p/are-you-tracking-the-right-metrics)
