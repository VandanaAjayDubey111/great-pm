---
name: brainstorm-okrs
description: "Brainstorm team-level OKRs aligned with company objectives — qualitative objectives with measurable key results. Use when setting quarterly OKRs, aligning team goals with company strategy, drafting objectives, or learning how to write effective OKRs."
---

> **Provenance.** Vendored from `phuryn/pm-skills@brainstorm-okrs` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: roadmap-planner.

# Brainstorm Team OKRs

## Purpose

You are a veteran product leader responsible for defining Objectives and Key Results (OKRs) for the team working on $ARGUMENTS. Your OKRs must be ambitious, measurable, and clearly aligned with company-wide strategy.

## Context

OKRs bridge vision and execution by combining inspirational qualitative objectives with measurable quantitative key results. This skill generates three alternative OKR sets to spark strategic discussion.

## Domain Context

**OKR** (Christina Wodtke, *Radical Focus*):
- **Objective** (Why, What, When): Qualitative, inspirational, time-bound goal. Typically quarterly. Should be SMART.
- **Key Results** (How much): Quantitative metrics (typically 3) and their expected values.

**OKRs, KPIs, and NSM are interconnected — not alternatives.** Don't compare them in a table without explaining their relationship:
- **Key Results** always refer to quantitative metrics, some of which might be KPIs.
- **KPIs** = a few key quantitative metrics tracked over a longer period. Can be used as Key Results, as health metrics (a balancing practice for OKRs), or you can set Key Results for a KPI's input metrics.
- **North Star Metric** = a single, customer-centric KPI. A leading indicator of business success. You can use Key Results to express expected change in NSM.

OKRs are fundamentally about: (1) Setting a single, inspiring goal. (2) Empowering a team to determine the optimal approach. (3) Continuously monitoring progress, learning from failures, and improving.

## Instructions

1. **Gather Context**: If the user provides company objectives, strategic documents, or team context as files, read them thoroughly. If they reference company strategy, use web search to understand industry benchmarks and best practices for similar products.

2. **Understand the Framework**: OKRs have two components:
   - **Objective**: A qualitative, inspirational goal describing the directional intent
   - **Key Results**: 3 quantitative metrics (typically) measuring progress toward the objective

3. **Think Step by Step**:
   - What is the company strategy?
   - What are the 3-5 most impactful areas the team can influence?
   - How do team efforts ladder up to company goals?
   - What would success look like for customers and the business?

4. **Generate Three OKR Sets**: Create three distinct, ambitious OKR options for the $ARGUMENTS team. For each set:
   - Start with a clear, inspiring Objective statement
   - Define exactly 3 Key Results that are:
     - Measurable (can be tracked numerically)
     - Achievable but ambitious (60-70% confidence level)
     - Aligned with company strategy

5. **Example Format**:
   ```
   Objective: Delight new users with an effortless onboarding experience
   Key Results:
   - CSAT score >= 75% on onboarding survey
   - 66%+ of onboardings completed within two days
   - Average time-to-value (TTV) <= 20 minutes
   ```

6. **Structure Output**: Present all three OKR sets with equal weight. For each, include:
   - Objective (1-2 sentences)
   - Three Key Results (specific metrics with targets)
   - Brief rationale (why this matters to the company and team)

7. **Save the Output**: If substantial, save as a markdown document: `OKRs-[team-name]-[quarter].md`

## Notes

- Ensure each Key Result is independently measurable
- Avoid output-focused metrics (e.g., "launch 5 features"); focus on outcomes
- All three OKR sets should be credible, not one clearly better than others
- Flag any assumptions about data availability

## Worked Example — Acme (personal-finance app), Q3

**Company strategy this quarter:** "Earn daily trust so users connect a second account." Team: the categorization-and-insights squad.

**Weak OKR (what to avoid):**
```
Objective: Improve the categorization engine
Key Results:
- Ship the v2 categorization model          ← output, not outcome
- Launch 3 new insight cards                 ← output, not outcome
- Reduce mis-categorization rate by 2%       ← sandbagged; current is already trending down
```
This is a feature checklist wearing an OKR costume. Shipping all three could leave user behavior unchanged.

**Strong OKR:**
```
Objective: Make Acme trustworthy enough that users connect a second account
Key Results:
- % of new users who connect a 2nd account within 14 days: 18% → 35%
- Categorization "this is wrong" correction rate: 9% → 4%
  (leading metric: weekly auto-categorization precision on a labeled sample)
- D30 retention for users who saw their first month-end summary: 41% → 55%
```
Each KR is an *outcome* (a user behavior or experience), independently measurable, and the middle KR names its **leading metric** so the team can steer mid-quarter instead of discovering failure at quarter-end. Targets are set at ~60-70% confidence — a real stretch, not a lock.

## When NOT to use OKRs

- **Pre-PMF / heavy-discovery quarters.** When you genuinely don't yet know which outcomes matter, quarterly outcome targets are fiction. Run discovery against learning goals (e.g., "validate the top-3 jobs") instead; adopt OKRs once you know which dial moves the business.
- **Pure keep-the-lights-on / compliance work** with no outcome to move (a mandated migration, a security patch). Track these as committed deliverables, not aspirational OKRs — dressing obligatory work as a stretch goal corrupts the 0.7 calibration for everything else.
- **Below team level for individuals.** OKRs are a team alignment tool; cascading them into personal performance targets is how they get gamed and sandbagged (see pitfalls). Keep them at the team/initiative altitude.

## Pitfalls / Failure modes

1. **Sandbagging.** Setting targets the team is ~95% sure to hit so the quarter "scores green." This guts the entire point of OKRs (ambition + learning) and quietly trains the org to under-reach. Counter: targets should sit at **60-70% confidence** (see calibration note below); a quarter where every team scores 1.0 is evidence of sandbagging, not excellence.
2. **Output disguised as outcome.** "Launch 5 features," "ship the redesign," "publish 10 blog posts" are *activities you control*, not *results you're betting will follow*. A real KR is a number that could still miss even if you ship everything — because it measures whether the work changed user or business behavior. Test each KR: *could we complete all our work and still miss this?* If no, it's an output.
3. **KR with no leading metric.** A lagging-only KR (e.g., "Q3 revenue +20%") tells you whether you failed *after* it's too late to act. Every KR should pair its lagging outcome with at least one **leading/input metric** the team can watch weekly and influence now. Without it, the OKR is a scoreboard, not a steering wheel — cross-link to `metrics-design` for the leading/lagging split.
4. **The 0.7 target-gaming spiral.** "We grade success at 0.7, so I'll just set the target 40% higher than I expect and aim for my real number." This games the calibration and makes scores meaningless. Counter: set the target at the genuinely ambitious level *first*, calibrate confidence honestly, and judge the *learning* from a 0.6 as more valuable than a gamed 0.7. The score is a conversation starter, not a bonus trigger.
5. **Copy-paste from last quarter.** Recycling the same objective and bumping the numbers signals the team isn't re-reading strategy. Each cycle should re-derive OKRs from the *current* company strategy and what was learned last quarter — stale OKRs are a symptom of an OKR process running on autopilot.
6. **A KR that can't drop / one-directional vanity.** "Total registered users" only ever goes up, so a KR on it is unfalsifiable theater. Prefer rates and ratios (retention %, conversion %, correction rate) that can move *both* ways and reflect real health, not cumulative counters.

**Calibration note — the 60-70% rule.** Set Key Result targets so the team's honest confidence of fully hitting them is **60-70%** at the start of the quarter. Below ~50% the target is demoralizing noise; above ~80% it's sandbagged. The expected end-state for a healthy OKR is a score around **0.6-0.7** — that band means you reached for something real and learned where the edge is. Consistently scoring 1.0 means aim higher; consistently scoring near 0 means the targets are fantasy or the strategy is wrong. Score is for learning, never for performance reviews.

## Cross-links

- **`metrics-design`** — the instrumentation layer beneath every KR. Before committing a Key Result, confirm via `metrics-design` that (a) the metric is actually measurable *today*, (b) it has a defined leading indicator, and (c) it isn't a vanity metric. A KR you can't instrument is a wish.
- **`outcome-roadmap`** — OKRs and the outcome roadmap must align: the roadmap's themed outcomes (Now/Next/Later) should be the source the quarterly Objectives ladder up to. If a team's OKR doesn't trace to a roadmap outcome, one of the two is wrong.
- **`brainstorm-okrs` ↔ company strategy** — Objectives must ladder up to company strategy (read it first, per the Instructions). A team OKR with no line to company strategy is a local optimum.
- **`metrics-design` (NSM)** — Key Results often express the expected change in the North Star Metric or its input metrics; keep the NSM definition consistent across both skills.

---

### Further Reading

- [Objectives and Key Results (OKRs) 101](https://www.productcompass.pm/p/okrs-101-advanced-techniques)
- [OKR vs KPI: What's the Difference?](https://www.productcompass.pm/p/okr-vs-kpi-whats-the-difference)
- [Business Outcomes vs Product Outcomes vs Customer Outcomes](https://www.productcompass.pm/p/business-outcomes-vs-product-outcomes)
- [From Strategy to Objectives Masterclass](https://www.productcompass.pm/p/product-vision-strategy-objectives-course) (video course)
