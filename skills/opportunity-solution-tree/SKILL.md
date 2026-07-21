---
name: opportunity-solution-tree
description: Build an Opportunity Solution Tree (OST) to structure continuous product discovery — map one desired outcome to customer opportunities, candidate solutions, and validating experiments. Based on Teresa Torres' Continuous Discovery Habits. Use when structuring discovery, turning research into prioritized bets, or deciding what to build next without jumping to solutions.
when_to_use: |
  Use when there is a measurable outcome to pursue and research evidence to
  organize — to turn "what did users tell us" into "which opportunity, which
  solution, which experiment." Primarily for the user-researcher agent; pairs
  with prioritization-methods for ranking opportunities.
allowed-tools: Read, Write
---

> **Provenance.** Adapted from `phuryn/pm-skills@opportunity-solution-tree` (MIT
> License, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Framework
> is Teresa Torres, *Continuous Discovery Habits*. Vendored into great-pm
> 2026-05-29 with great-pm-convention frontmatter. MIT permits commercial use with
> attribution; this header is the attribution.

# Opportunity Solution Tree (OST)

A visual framework for structuring continuous product discovery. Connects a
desired **outcome** to customer **opportunities**, possible **solutions**, and
**experiments** to validate them — preventing the team from jumping to solutions
before mapping the opportunity space.

## Structure — 4 levels

1. **Desired Outcome** (top) — One measurable business/product outcome (e.g.
   "increase 7-day retention to 40%"). Comes from OKRs or strategy. Single metric.
2. **Opportunities** (second) — Customer needs/pains/desires from research. These
   are problems worth solving, NOT features. Frame from the customer's view:
   "I struggle to…", "I wish I could…". Prioritize with Opportunity Score =
   **Importance × (1 − Satisfaction)** (Dan Olsen), Importance/Satisfaction on 0–1.
3. **Solutions** (third) — Multiple ways to address each opportunity. Generate
   ≥3 per opportunity; don't commit to the first idea. Ideate as a Product Trio
   (PM + Designer + Engineer).
4. **Experiments** (bottom) — Fast, cheap tests of whether a solution actually
   addresses the opportunity. Use assumption testing across Value, Usability,
   Viability, Feasibility. Prefer "skin-in-the-game" tests over opinions.

## Key principles

- **One outcome at a time.** Focus the tree on a single desired outcome.
- **Opportunities, not features.** Never let customers design the solution.
- **Compare and contrast.** ≥3 solutions per opportunity before choosing — avoid
  the "first idea" trap.
- **Discovery is not linear.** Loop back when experiments fail; kill solutions
  that don't validate; open new branches.
- **Continuous, not periodic.** Update weekly from interviews, analytics, tests.

## Process

1. **Define the desired outcome** — confirm a single, measurable metric at the top.
2. **Map opportunities** — from research, surface 3-7 customer opportunities; group
   related ones; frame from the customer's perspective.
3. **Prioritize opportunities** — Opportunity Score or qualitative; focus on top 2-3.
4. **Generate solutions** — ≥3 per prioritized opportunity, across PM/Design/Eng.
5. **Design experiments** — 1-2 fast tests for the promising solutions; specify
   hypothesis, method, metric, success threshold.
6. **Visualize the tree** — present the full OST hierarchically.

Think step by step. Save as markdown if substantial.

## Worked example — one full OST, end to end

Built for Acme. Outcome → 4 opportunities → 12 solutions (3 per opportunity)
→ 3 experiments on the top-priority branch.

```
DESIRED OUTCOME: Raise 4-week retention of new users from 22% → 40% by Q3
│  (single metric, target, deadline — not "improve retention")
│
├─ OPPORTUNITY 1: "I can't tell where my money went last month"
│    Importance 0.9 × (1 − Satisfaction 0.2) = Score 0.72  ← TOP
│    ├─ SOLUTION 1a: Auto-categorize every transaction at ingestion
│    ├─ SOLUTION 1b: Month-end "where it went" digest (push + email)
│    └─ SOLUTION 1c: One-tap manual re-categorize that teaches the model
│
├─ OPPORTUNITY 2: "Tagging every transaction is a chore, so I quit"
│    Importance 0.8 × (1 − Satisfaction 0.3) = Score 0.56
│    ├─ SOLUTION 2a: Zero-tap default categories (no tagging required to get value)
│    ├─ SOLUTION 2b: Bulk re-tag by rule ("all SWIGGY → Food")
│    └─ SOLUTION 2c: Confidence-gated auto-apply (only ask when unsure)
│
├─ OPPORTUNITY 3: "I don't trust the numbers — duplicates and self-transfers inflate spend"
│    Importance 0.7 × (1 − Satisfaction 0.4) = Score 0.42
│    ├─ SOLUTION 3a: Dedup engine flags Gmail-alert + CSV overlaps
│    ├─ SOLUTION 3b: Auto-exclude self/family transfers from "spend"
│    └─ SOLUTION 3c: "Why is this counted?" explainer on each total
│
└─ OPPORTUNITY 4: "Connecting my accounts feels risky / too much setup"
     Importance 0.6 × (1 − Satisfaction 0.5) = Score 0.30
     ├─ SOLUTION 4a: Read-only Gmail OAuth with a plain-language scope screen
     ├─ SOLUTION 4b: Start-with-one-CSV onboarding (defer account linking)
     └─ SOLUTION 4c: Local-processing trust badge + data-handling explainer

EXPERIMENTS (on Opportunity 1 / Solution 1b — highest score, fastest test):
  E1  Fake-door digest: send a manual month-end "where it went" summary to 30
      users. Hypothesis: recipients return within 7 days at a higher rate.
      Metric: 7-day return rate. SUCCESS THRESHOLD: ≥ 50% vs ~30% control.
  E2  Wizard-of-Oz categorization: hand-categorize 20 users' last month, show
      the digest. Hypothesis: trust in the number drives a second session.
      Metric: % who open the app a 2nd time in 72h. THRESHOLD: ≥ 60%.
  E3  Copy test on the digest subject line (2 variants), n≥200 sends.
      Metric: open rate. THRESHOLD: winning variant ≥ 35% open, p<0.05.
```

Read the tree top-down: every solution defends itself against an opportunity, and
every experiment has a number it must beat. The bottom tier is where
`experiment-design` takes over (sample size, power, guardrails).

## Pitfalls / failure modes

1. **Outcome that's an activity, not a result.** "Ship the digest feature" or
   "run 10 interviews" at the top. Those are things you *do*; an outcome is a
   metric that *moves* ("4-week retention 22%→40%"). If the top of the tree can be
   completed by working hard regardless of customer behaviour, it's an activity.
   Rewrite as a measurable result.

2. **Opportunity that's a solution in disguise.** "Add a budgeting dashboard" or
   "users want push notifications" in the opportunity row. Those are answers, not
   needs. An opportunity is phrased from the customer's pain ("I can't tell where
   my money went"). Test: if it names a feature or UI, it's a solution — move it
   down a level and ask what *need* it serves.

3. **Single-solution branches.** An opportunity with exactly one solution under
   it means you committed to your first idea and back-filled the tree. The whole
   point is **compare and contrast** — force ≥3 genuinely different solutions per
   prioritized opportunity (a manual fix, an automated fix, and a no-build fix is
   a good starting spread).

4. **Experiments without success thresholds.** "Test the digest" with no number
   it must hit is theatre — any result can be spun as "promising." Every
   experiment states the metric AND the pass bar *before* it runs (E1: "≥50% vs
   30% control"). No threshold = no experiment, just an activity with a chart.

5. **False root outcome / boiling the ocean.** Either the top metric is so broad
   nothing clearly moves it ("increase engagement"), or the tree carries 5+
   outcomes at once. One outcome per tree; if leadership hands you three, build
   three trees or pick the one this cycle owns. A vanity metric at the root
   (page views, total signups) produces a tree of vanity solutions.

## Cross-links

- **Bottom tier → `experiment-design`.** Once a solution earns an experiment,
  `experiment-design` owns the rigor: hypothesis with mechanism, sample size,
  power, peeking/HARKing traps, guardrail metrics. The OST sets the *what* to
  test; `experiment-design` sets the *how to test it trustworthily*.
- **Cadence → `continuous-discovery`.** The OST is a snapshot; `continuous-discovery`
  (Torres) is the weekly habit that keeps it alive — interview cadence, the
  Product Trio, updating the tree from fresh evidence. An OST that isn't updated
  weekly has rotted into a static roadmap.
- **Opportunity ranking → `prioritization-methods`.** The Opportunity Score here
  is one method; for cross-opportunity tradeoffs use the broader scoring set.

## Further reading

- Product Compass: "The Extended Opportunity Solution Tree"
- Product Compass: "What Is Product Discovery? The Ultimate Guide"
- Teresa Torres, *Continuous Discovery Habits*
