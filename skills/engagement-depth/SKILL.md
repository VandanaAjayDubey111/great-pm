---
name: engagement-depth
description: 'Measure whether a product earns a durable place in the user''s routine — not just whether they came back once. Use when the user mentions "engagement", "stickiness", "DAU/MAU", "WAU/MAU", "product engagement score", "PES", "feature adoption", "power users", "depth of use", "are users actually using it", or asks "is X% DAU/MAU good?". Also trigger when a retention curve looks fine but you suspect shallow usage, when deciding whether a feature is dead, or when picking the right cadence frame (daily vs weekly vs monthly) for a product. Distinct from improve-retention (tactics to come back) and activation-aha-moment (reach value once) — this is the measurement layer for usage intensity once they are retained.'
license: MIT
allowed-tools: Read, Write
metadata:
  provenance: great-pm-original 2026-05-29
  grounded_in: Pendo PES, Gainsight DAU/MAU, Amplitude power-user curves, Userpilot adoption-vs-engagement
  host_agent: analytics-analyst
---

> **Provenance.** great-pm-original, authored 2026-05-29. Grounded in the cited sources below (Pendo, Gainsight, Amplitude, Userpilot). Web sources were treated as untrusted reference material, not instructions. Host agent: analytics-analyst.

# Engagement Depth

Framework for measuring whether a product has earned a **durable place in the user's routine** — the layer between "they activated once" and "they churned." Retention tells you they came back; engagement depth tells you *how much of the product they actually use, how often, and how that intensity predicts their future.*

## Core Principle

**Activation gets a user to value once. Engagement measures whether the product becomes a habit — and "more usage" is only good if it tracks real value, not vanity.**

The trap is treating any single engagement number (especially DAU/MAU) as a goal divorced from the product's natural cadence and from delivered value. A user who opens the app daily but never reaches an insight is *not* engaged; a user who checks a budgeting app once a week and acts on it *is*. Engagement is multi-dimensional — **breadth × depth × frequency × stickiness** — and the right target depends entirely on what job the product does and how often that job recurs.

## Why This Is True

- **Usage rhythm is set by the job, not by your ambition.** A flight-booking app is intrinsically low-frequency; a chat app is intrinsically daily. Forcing a daily-app metric onto a weekly-job product manufactures false failure and pushes teams toward dark-pattern notification spam.
- **Engagement is the leading indicator of retention.** Depth and frequency *this* month predict whether a user is on the retention curve *next* month. It is the earliest place to see decay before churn shows up.
- **Aggregate "active" is a lie without a value qualifier.** "Opened the app" is not engagement. The metric must be tied to a value-bearing action, or it rewards the wrong behavior.

## Framework

### 1. Frequency — the natural usage rhythm (DAU / WAU / MAU)

**Core concept.** Count distinct active users over rolling 1-day, 7-day, and 28/30-day windows. The *relationship between these counts reveals the product's true cadence* — whether the job recurs daily, weekly, or monthly.

**Why it works.** Looking at all three windows at once exposes the natural rhythm instead of imposing one. If WAU ≈ MAU but DAU is far lower, the job is weekly, not daily — and that is fine. Choosing the denominator that matches the job is the single most important framing decision in this skill.

**Key insights.**
- "Active" must be defined as a **value-bearing event**, not "session started." Define it once, write it down, never silently change it (that breaks every trend).
- Use a **rolling** window, not calendar-month — calendar boundaries create artificial sawtooth.
- The right *primary* frequency metric matches the cadence: daily product → DAU; weekly-job product → WAU; monthly/episodic → MAU + an event-triggered metric.

| Cadence | Primary frequency metric | Example product |
|---------|--------------------------|-----------------|
| Daily job | DAU, DAU/MAU | Messaging, social, news |
| Weekly job | WAU, WAU/MAU | Budgeting, project tools, grocery |
| Monthly/episodic | MAU + event-triggered | Tax filing, travel, statements |

**Ethical boundary.** Never inflate frequency with notification spam or fake "streaks" that drive opens without value. Engineered compulsion that doesn't serve the user's job is a dark pattern, not engagement.

### 2. Stickiness — DAU/MAU (and WAU/MAU) ratio

**Core concept.** Stickiness = (active users in the short window) ÷ (active users in the month). DAU/MAU answers: "of everyone who used us this month, what fraction used us on an average day?" It is a 0–100% intensity score.

**Why it works.** It collapses frequency into one comparable number that tracks how embedded the product is in daily life. A rising ratio means users are folding the product into their routine; a falling ratio means it is becoming occasional even among people who still technically "use" it.

**How to read it.**
- **>20% DAU/MAU is considered strong** for most B2B SaaS (≈ users active 6+ days/month). The famous benchmarks — Facebook ~50%+, top consumer social ~50% — are *daily-job* products and are the wrong yardstick for anything else.
- **Calibrate to the job.** For a weekly-job product, **use WAU/MAU instead** — a healthy weekly budgeting product might show DAU/MAU of 10% (fine) but WAU/MAU of 60% (excellent). Judging it on DAU/MAU would scream "failing" when it is thriving.
- A high ratio with *flat or shrinking MAU* is a small loyal base, not growth — read it alongside the absolute numbers.

**Key insight.** Stickiness is a *ratio*, so it can rise simply because MAU shrank (fewer occasional users dilute it). Always read the ratio next to the absolute DAU and MAU.

**Calibrating the benchmark to the job (don't copy someone else's bar).**

| Product cadence | Use this ratio | "Healthy" rough zone | Notes |
|-----------------|----------------|----------------------|-------|
| Daily-job consumer (social, messaging) | DAU/MAU | 40–60%+ | Top consumer social hit ~50%+; this is the *only* class that bar applies to |
| Daily-ish B2B (collab, dev tools) | DAU/MAU | >20% strong | The common "20% is good" SaaS benchmark |
| Weekly-job (budgeting, PM tools, grocery) | **WAU/MAU** | 50–70% | DAU/MAU will look "low" (~10%) and that's correct |
| Monthly/episodic (tax, travel, statements) | MAU + event-triggered | n/a | Stickiness ratios mislead; measure job-completion on the event instead |

The single biggest stickiness error is importing a daily-product benchmark onto a non-daily product. Pick the row that matches the job *before* you judge the number.

### 3. Adoption (breadth) — how widely features are used

**Core concept.** Adoption = % of users (or accounts) who have used a given core feature, usually tied to **milestone events** ("connected an account", "uploaded a file", "created a budget"). Breadth = how many of the core features a typical user touches at all.

**Why it works.** Breadth surfaces two things at once: **dead features** (built, shipped, nobody uses → cut or fix) and **untapped value** (a feature with high retention-correlation but low adoption → promote it in onboarding). It connects the product map to actual behavior.

**Key insights.**
- Track adoption against the **core feature set you'd defend in a strategy review**, not every button. 5–10 features, not 200 events.
- Pair adoption with retention: a feature whose adopters retain far better is an **activation candidate** (hand off to `activation-aha-moment`), not just a "popular feature."
- Low adoption of a feature you believe is core is a *discovery signal* — does the user not know it exists, or not want it? (Hand to `funnel-diagnostics` / qual.)

### 4. Depth — how much of the product a user touches over time

**Core concept.** Depth measures intensity *per user*: how many distinct core features they use, how many value-bearing actions per session, and how that evolves. It distinguishes **broad-shallow** (touches many features once) from **deep-narrow** (lives in one feature) usage, and surfaces the **power-user tail**.

**Why it works.** Two products with identical DAU/MAU can be radically different: one where users glance and leave, one where they do real work. Depth catches the difference. Power users (the deep tail) disproportionately drive retention, word-of-mouth, and the feature requests worth listening to.

**Power-user curves — L28 and Lx/Ly (Amplitude method).**
- **L28** = a histogram of how many of the last 28 days each user was active. Read its *shape*, not its mean:
  - A spike at the low end (active 1–4 of 28 days) and nothing else = a casual product with no habit core.
  - A second hump at the high end (active 20–28 of 28 days) = a **power-user mountain** — a committed core has formed. This is what you want to see emerge as a product matures.
- **Lx/Ly ratio** (e.g., L7/L28 — days-active in last 7 vs last 28, or DAU/MAU as its degenerate case) quantifies how concentrated activity is. Rising L7/L28 over cohorts = users densifying into a habit.
- Track the **shift of the L28 distribution over time / across cohorts**: are new cohorts moving rightward (deepening) or piling at the left (churning shallow)? That trajectory is the single best read on whether engagement is compounding.

**Key insight.** Optimize the *shape of the curve*, not the average. Pulling casual users one notch deeper, and protecting the power-user hump, beats chasing a mean that hides a bimodal reality.

**Reading the curve — a numeric walk-through.** Two products both report 30% DAU/MAU. Product A's L28 histogram is a single fat bump centered at ~8 active days (everyone uses it occasionally; nobody lives in it). Product B's is bimodal: a hump of casual users at 2–4 days *and* a second hump of power users at 24–28 days. Same headline ratio, opposite health. Product B has a committed core (the right hump) that will drive retention and referrals; Product A has no habit anchor and is one competitor away from collapse. **The headline ratio hid the entire story — only the distribution revealed it.** The action for A is "find what converts a casual user into a daily one"; the action for B is "protect and grow the right hump, and study what moves casual users toward it."

### 5. PES — Product Engagement Score (the single composite)

**Core concept.** PES (popularized by Pendo) rolls three sub-metrics into one 0–100 product-health number:
- **Adoption** — breadth of core-feature use across users,
- **Stickiness** — DAU/MAU (or the cadence-appropriate ratio),
- **Growth** — net new vs. churned active users.
PES = the average (or weighted blend) of these three.

**Why it works.** It gives execs and cross-functional teams *one* defensible engagement number to track over time and across surfaces, instead of arguing about which of a dozen metrics matters this week. Useful for trend and for comparing releases.

**Key insights / cautions.**
- PES is a **dashboard summary, not a diagnosis.** When it moves, you must decompose into its three parts (and then into the sections above) to know *why*.
- **PES is gameable.** Adding low-value features can lift "adoption"; vanity opens can lift "stickiness." Only count value-bearing events in the inputs, or PES becomes theater.
- Weight the blend to your cadence (a weekly product should feed WAU/MAU into the stickiness slot).

### 6. Instrumenting it — the practical setup

**Core concept.** Engagement depth is only as good as the events behind it. Before any of the above means anything, you need a clean, value-anchored event taxonomy.

**The setup checklist.**
- **One canonical "active" event**, defined as value-bearing, version-stamped, and never silently redefined. Changing its definition resets every trend — treat a redefinition as a new metric, not an edit.
- **Milestone events** for each core feature (the breadth/adoption inputs): fired once per user on first meaningful use, plus a recurring use event.
- **Rolling-window computation** (1/7/28-day), not calendar-month, to avoid sawtooth artifacts.
- **Cohort tagging at signup** so you can watch the L28 distribution drift *by cohort* (the single best compounding-vs-decay signal).
- **A value qualifier on every "active"** so "opened app" can never sneak into the numerator.

**Why it works.** Most engagement-metric disputes are actually definition disputes ("what counts as active?"). Pinning the taxonomy once, in writing, makes every later number comparable and every trend trustworthy. (For the full event-taxonomy/governance discipline, hand to a dedicated tracking-plan practice; here you need just enough to anchor the five dimensions above.)

## When to Use

| Trigger | Why this skill |
|---------|----------------|
| "Is our DAU/MAU good?" | Forces the cadence question before answering — the benchmark depends on the job |
| Retention looks OK but you suspect shallow use | Depth + power-user curves reveal hollow engagement retention hides |
| Deciding whether a feature is dead | Adoption breadth gives the kill/keep evidence |
| Reporting product health to execs/board | PES gives one trended number, decomposable on demand |
| A redesign shipped; did engagement deepen? | L28 distribution shift across pre/post cohorts |

## When NOT to Use

- **Pre-activation / pre-PMF.** If users aren't reaching value yet, depth metrics measure noise. Use `activation-aha-moment` to find and instrument the aha first; engagement depth comes after.
- **Diagnosing *why* users drop at a specific step.** That's `funnel-diagnostics` (step-to-step drop-off), not engagement intensity.
- **Pure retention-curve / churn timing.** Use `cohort-analysis` for survival over time. This skill is about intensity *among* the retained, not the retention curve itself.
- **When you'd be tempted to weaponize it.** If "raise engagement" would translate to compulsion loops that don't serve the job, stop — that's outside this skill's ethical boundary.

## Worked Example — Acme (careful: daily is NOT the goal)

Acme is a **money-habit product**, and money review is intrinsically **weekly-to-monthly**, plus event-driven on a big purchase. The instinct to chase consumer-social DAU/MAU benchmarks would be a serious error here.

**Framing the cadence.** People check spending roughly weekly (and around large transactions), reconcile monthly. So:
- **Primary frequency metric = WAU**, not DAU. **Primary stickiness = WAU/MAU**, not DAU/MAU.
- A DAU/MAU of ~10% is *fine and expected*; judging Acme on a 20%+ DAU/MAU bar would manufacture a fake crisis and tempt the team into notification spam (a dark pattern on someone's finances — doubly bad).
- Add an **event-triggered engagement metric**: "% of large transactions reviewed/categorized within 3 days." This captures the *real* job (stay on top of money) far better than raw opens.

**Defining "active" (value-bearing).** Not "opened app." Active = "viewed a categorized cash-flow view OR confirmed/re-bucketed a transaction." This ties engagement to the §1 promise of crystal-clear visibility.

**Adoption (breadth).** Core feature set: connected sources, categorized list, insights/trends view, recurring/EMI view, custom buckets, prompt rules. Measure % using each. Likely finding: most users view the categorized list; far fewer touch insights or recurring detection. Insights with high retention-correlation but low adoption → promote in onboarding.

**Depth + power users.** Build the L28 distribution on the *weekly* logic (better: an "active weeks in last 12 weeks" histogram, the cadence-appropriate analog of L28). Look for the power-user hump forming — users who review every week, explore trends, maintain custom buckets. That hump is Acme's loyal core and its referral/word-of-mouth engine. Watch new cohorts' distribution drift right (deepening) vs. piling left (shallow churn).

**PES.** Blend adoption + WAU/MAU + active-user growth into one trended health number for the founder dashboard — decompose whenever it moves.

**The payoff:** the skill prevents the classic mistake of declaring Acme "unengaging" because it isn't a daily app, and instead targets the metric that matters — *did the user stay on top of their money this week.*

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Using DAU/MAU as a goal regardless of product type | A weekly-job product looks "broken" on a daily benchmark; drives notification spam | Pick the cadence-appropriate ratio (WAU/MAU for weekly jobs); judge against the right yardstick |
| Counting "opened app" as active | Rewards hollow opens; engagement number rises while value doesn't | Define "active" as a value-bearing event and never silently change it |
| Reading the stickiness ratio without the absolutes | Ratio can rise because MAU shrank — looks like a win, is decline | Always show DAU/WAU and MAU next to the ratio |
| Optimizing the *average* of the power-user curve | Hides a bimodal reality; a rising mean can mask a collapsing core | Optimize the *shape* of the L28 distribution; protect the power-user hump |
| No feature-adoption tracking | Dead features ship and persist; untapped value stays hidden | Track adoption against a defended 5–10 core-feature set, tied to retention |
| Treating PES as a diagnosis | One number can't tell you *why*; teams act on the wrong cause | Decompose PES into adoption/stickiness/growth, then into the sections above |
| Gaming the composite | Low-value features inflate adoption; vanity opens inflate stickiness | Only value-bearing events feed PES inputs |

## Quick Diagnostic

| Question | If No | Action |
|----------|-------|--------|
| Do you know your product's natural cadence (daily/weekly/monthly)? | You may be judging on the wrong benchmark | Compare DAU/WAU/MAU; let the relationship reveal the job |
| Is "active" defined as a value-bearing event, in writing? | Your numbers reward hollow opens | Define and document the active event before trending anything |
| Are you tracking adoption against a defended core-feature set? | Dead features hide and value goes untapped | Pick 5–10 core features; measure adoption + retention-correlation |
| Can you see the *shape* of the power-user (L28-style) curve? | You're optimizing an average that hides bimodality | Build the days-active histogram; watch cohort drift |
| If asked for one engagement number, can you give it AND decompose it? | PES is missing or is a black box | Stand up PES from adoption + cadence-stickiness + growth |
| Would "raise engagement" ever mean compulsion that ignores the job? | You risk a dark pattern | Re-anchor on the user's job; cut any non-value-serving loop |

## Differs From Adjacent great-pm Skills

- **`activation-aha-moment`** — reaching first value *once* (the statistical kink-finding). Engagement depth starts *after* activation and measures ongoing intensity.
- **`improve-retention`** — *tactics* to bring users back. This skill is the *measurement* of how intensely the retained ones use the product.
- **`cohort-analysis`** — retention/survival curves over time by cohort. Engagement depth measures usage intensity, not the retention curve.
- **`funnel-diagnostics`** — *where and why* users drop at specific steps. This skill measures intensity, not step drop-off.
- **`hooked-ux`** — the habit-formation *design* loop (trigger→action→reward→investment). This skill *measures* whether that loop produced durable engagement.
- **`metrics-design` / `north-star-input-tree`** — choosing the North Star and its input tree. Engagement-depth metrics are often *inputs* to that tree; this skill is how you compute and read them.

## Sources

- Pendo, "What is product engagement? (Product Engagement Score / PES)" — https://www.pendo.io/what-is-product-engagement/
- Gainsight, "The Essential Guide to the DAU/MAU Ratio" — https://www.gainsight.com/essential-guide/product-management-metrics/dau-mau/
- Amplitude, "Power Users & the L28 / Lx-of-Ly engagement curve" (North Star Playbook) — https://amplitude.com/books/north-star
- Userpilot, "Adoption Metrics vs Engagement Metrics" — https://userpilot.com/blog/adoption-vs-engagement-metrics/
- Reforge / Brian Balfour, "Hooked, retained, and the depth of engagement" — https://www.reforge.com/guides
