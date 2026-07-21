---
name: outcome-roadmap
description: "Transform an output-focused roadmap into an outcome-focused one that communicates strategic intent. Rewrites initiatives as outcome statements reflecting user and business impacts. Use when shifting to outcome roadmaps, making a roadmap more strategic, or rewriting feature lists as outcomes."
when_to_use: |
  Use when you have enough evidence to know which user/business outcomes matter
  AND those outcomes are measurable today — then convert a feature list into
  outcome statements that survive change. Primarily for the roadmap-planner
  agent; pairs with impact-mapping (the goal→deliverable derivation),
  metrics-design (the outcome must be instrumented), and brainstorm-okrs
  (the outcome becomes the Objective).
allowed-tools: Read, Write, WebSearch, WebFetch
---

> **Provenance.** Vendored from `phuryn/pm-skills@outcome-roadmap` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: roadmap-planner.

# Transform Roadmap to Outcome-Focused Format

## Purpose

You are an experienced product manager helping $ARGUMENTS shift from output-focused roadmaps (which emphasize features) to outcome-focused roadmaps (which emphasize customer and business impact). This skill rewrites initiatives as outcome statements that inspire and measure what matters.

## Context

Output-focused roadmaps create false precision and misalign teams around features rather than results. Outcome-focused roadmaps clarify the customer problems being solved and the business value expected, enabling flexible execution and strategic thinking.

## Instructions

1. **Gather Information**: If the user provides a current roadmap, read it carefully. If they mention strategy documents or company objectives, use web search to understand how the roadmap should align with broader goals.

2. **Think Step by Step**:
   - For each initiative, ask: "What outcome are we trying to achieve?"
   - What customer problem are we solving?
   - What business metric will improve?
   - How will this impact the customer experience or business?
   - Is there a better, different way to achieve the same outcome?

3. **Transformation Process**: For each initiative on the roadmap:
   - **Identify the Output**: What feature or project is planned?
   - **Uncover the Outcome**: Why are we building it? What changes for customers or business?
   - **Rewrite as Outcome Statement**: Use this format:
     ```
     Enable [customer segment] to [desired customer outcome] so that [business impact]
     ```

4. **Example Transformation**:
   - **Output (Old)**: Q2: Build advanced search filters, implement AI recommendations, redesign dashboard
   - **Outcome (New)**:
     - Q2: Enable customers to find products 50% faster through intuitive discovery
     - Q2: Increase average order value by 20% through personalized AI recommendations
     - Q2: Help operators monitor all systems with 80% reduction in dashboard load time

5. **Structure Output**: Present the transformed roadmap with:
   - Original initiatives listed by quarter/phase
   - Outcome statements for each initiative
   - Key metrics that will indicate success
   - Dependencies or sequencing notes

6. **Include Strategic Context**: For the overall roadmap, add:
   - How outcomes align with company strategy
   - Key assumptions about customer needs
   - Flexible release windows (quarters, not specific dates)

7. **Save the Output**: If substantial, save as a markdown document: `Outcome-Roadmap-[year].md`

## Notes

- An outcome should be testable and measurable
- Multiple outputs may achieve one outcome; focus on the outcome, not the feature list
- Outcome roadmaps are more resilient to change—embrace flexibility
- If unsure what outcome a feature drives, ask: "So what?" until you reach real customer/business value

## Worked example — Acme.ai Q3 roadmap (failed vs good outcome)

**Output-focused starting point (what a feature list looks like):**

> Q3: Build SMS-parsing import, add multi-account sync, ship spending-insights tab.

**The naive "outcome" rewrite — which is still a fake outcome (DON'T ship this):**

> Q3: *Enable users to better manage their finances through smart insights.*

Why this fails the bar:
- **Unmeasurable.** "Better manage their finances" has no metric, no baseline, no
  target. You cannot tell at end-of-quarter whether you hit it.
- **Outcome theater.** It *sounds* outcome-y ("enable users to…") but it's an
  un-instrumented aspiration. It's a feature list wearing an outcome costume.
- **No instrumentation today.** Acme doesn't currently track "financial
  management quality," so this outcome can't be observed even if achieved.

**The real outcome version (ship this):**

> Q3: **Increase the share of new users who reach their first auto-categorized
> view within 3 minutes from 35% → 60%** — because that activation moment is the
> #1 predictor of week-1 retention.
>
> *Possible deliverables (options, not commitments):* SMS-parse pre-fill,
> faster PDF parse, WhatsApp-OTP fallback. Whichever moves activation fastest wins.

Why this passes:
- **Measurable today.** "% reaching first categorized view in <3 min" is an event
  Acme can instrument now (see `metrics-design`), with a real baseline (35%).
- **Decoupled from the feature.** Three different deliverables could hit it; the
  roadmap commits to the *number*, not the build.
- **Falsifiable.** At end-of-Q3 you know unambiguously whether 60% was reached.

The discipline: if you can't state the metric, the baseline, the target, and the
instrumentation that already exists, you don't have an outcome — you have a slogan.

## When NOT to use this skill

- **Pre-PMF / early discovery.** When you don't yet know *which* outcomes matter,
  forcing outcome statements produces confident fiction. At this stage a feature/
  experiment roadmap ("test these 3 bets") is the honest level — you're searching
  for the outcome, not optimizing it. Switch to outcomes once discovery names the
  metric that matters.
- **The outcome can't be measured yet.** An outcome with no instrumentation is
  unfalsifiable. Either build the tracking first (`metrics-design`) or roadmap the
  instrumentation itself as the deliverable — don't roadmap an outcome you can't observe.
- **Hard external commitments / dependencies.** Compliance deadlines, partner
  integrations, App Store requirements are genuinely output-shaped ("ship RBI
  e-mandate flow by date X"). Don't contort a deadline into an outcome; list it as
  the commitment it is.
- **Tiny team, one obvious next thing.** If there's a single forced next build,
  an outcome roadmap is overhead. Just build it.

## Pitfalls / failure modes

1. **Fake outcomes / outcome theater.** The headline trap. Statements that *sound*
   like outcomes ("delight users", "enable better decisions") but carry no metric,
   baseline, or target. Test: can you write the success number and read it off a
   dashboard? If not, it's a slogan. This is the single most common roadmap PM failure.
2. **Ghost outcomes (no instrumentation).** An outcome that's measurable in
   principle but not actually tracked in the product. You'll reach end-of-quarter
   with no way to know if you hit it. Pair every outcome with the event/metric that
   already exists, or roadmap the instrumentation first.
3. **Vanity-metric outcomes.** "Increase total signups by 40%" when signups don't
   tie to value or revenue. The number can move while the business doesn't. Tie
   outcomes to North Star / retention / revenue, not to flattering counts.
4. **"Enable users to…" padding.** Wrapping a feature in outcome grammar without
   doing the work. "Enable users to upload statements" is just "build upload" with
   a costume. The real outcome is what changes *because* they can upload.
5. **Output smuggled back in as the success metric.** Listing "shipped SMS-parse"
   as the KR. Shipping is an output; the outcome is what shipping caused (activation
   ↑). If your success criterion is "did we build it," you've reverted to an output roadmap.
6. **Date-precise outcome roadmaps.** Pinning outcomes to exact dates re-imports the
   false precision outcome roadmaps exist to escape. Use quarters / Now-Next-Later
   windows, not "Aug 14."

## Relationship to other great-pm skills

- **`impact-mapping`** — the upstream derivation. Impact mapping traces Goal →
  Actor → Impact → Deliverable; an outcome-roadmap outcome *is* the goal/impact
  layer, and the deliverables under it are exactly impact-mapping's bottom tier.
  When unsure which deliverables serve an outcome, run an impact map first.
- **`metrics-design`** — the gate that keeps outcomes honest. Every outcome must be
  measurable *today*; metrics-design defines the North Star, the instrumentation
  events, and the thresholds that turn a slogan into a falsifiable outcome.
- **`brainstorm-okrs`** — an outcome roadmap and an OKR set are two views of the
  same thing: the outcome becomes the Objective; its target metric becomes the Key
  Result. Use brainstorm-okrs to pressure-test for sandbagging and output-disguised-as-outcome.
- **`prioritization-methods`** — once outcomes are set, the candidate deliverables
  under each are ranked here to decide sequencing.

---

### Further Reading

- [Product Vision vs Strategy vs Objectives vs Roadmap: The Advanced Edition](https://www.productcompass.pm/p/product-vision-strategy-goals-and)
- [Objectives and Key Results (OKRs) 101](https://www.productcompass.pm/p/okrs-101-advanced-techniques)
- [Business Outcomes vs Product Outcomes vs Customer Outcomes](https://www.productcompass.pm/p/business-outcomes-vs-product-outcomes)
