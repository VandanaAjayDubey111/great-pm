---
name: lean-canvas
description: "Generate a Lean Canvas with problem, solution, metrics, cost structure, UVP, unfair advantage, channels, segments, and revenue. Use when exploring a lean startup canvas, testing a business hypothesis, or modeling a new venture."
---

> **Provenance.** Vendored from `phuryn/pm-skills@lean-canvas` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: product-strategist.
# Lean Canvas

## Metadata
- **Name**: lean-canvas
- **Description**: Generate a Lean Canvas business model with detailed sections for problem, solution, metrics, cost structure, UVP, unfair advantage, channels, segments, and revenue.
- **Triggers**: lean canvas, startup canvas, lean model, business hypothesis

## Instructions

You are a business model strategist designing a Lean Canvas for $ARGUMENTS.

Your task is to create a comprehensive Lean Canvas that outlines the business hypothesis and key business model assumptions for the product.

## Input Requirements
- Product or feature description
- Target customer segment(s)
- Market context and problem space
- Any available metrics or business constraints

## Lean Canvas Template

### Section 1: Product Definition

**1. Problem**
- Top 3 customer problems or needs
- Customer pains and frustrations
- Current unsatisfactory solutions

**2. Solution**
- Top 3 features or approaches
- How each feature addresses the problem
- Why this solution is novel or better

**3. Unique Value Proposition (UVP)**
- Concise, memorable statement
- Why customers choose you over alternatives
- What makes you different (not just "better")

**4. Unfair Advantage**
- What defensibility exists?
- Barriers to competition (network effects, brand, IP, switching costs)
- What competitors can't easily replicate

### Section 2: Market & Traction

**5. Customer Segments**
- Who is the target customer?
- Early adopters and first segment
- Customer personas or archetypes
- How large is the addressable market?

**6. Channels**
- How do you reach customers?
- Primary acquisition channels
- Distribution and sales approach
- How do customers find you?

**7. Revenue Streams**
- How do you make money?
- Pricing model or revenue per customer
- Customer lifetime value (LTV)
- Revenue growth assumptions

### Section 3: Economics & Validation

**8. Cost Structure**
- Fixed costs (salaries, infrastructure, facilities)
- Variable costs (COGS, transaction costs, support)
- Key cost drivers
- Cost per customer acquisition (CAC)

**9. Key Metrics**
- Activation: How do users get value quickly?
- Retention: How many users stick around?
- Revenue: How do we measure financial success?
- North Star metric for the business

## Output Process
1. Define the core problem(s) being solved
2. Outline 2-3 solution approaches
3. Craft a compelling UVP
4. Identify what creates competitive advantage
5. Target 1-2 customer segments
6. Map acquisition channels
7. Define revenue model and pricing
8. Estimate cost structure
9. Identify 3-5 critical metrics to track
10. Surface key assumptions and hypotheses
11. Suggest validation experiments (landing page, interviews, MVP)

### Domain Context

**Lean Canvas vs Business Model Canvas vs Startup Canvas**:

Lean Canvas (Ash Maurya) is a startup-focused adaptation of the Business Model Canvas that replaces Partners/Activities/Resources with Problem/Solution/Unfair Advantage. It's fast and hypothesis-driven, but has known limitations:

- **Redundancy**: "Problem" overlaps with Market Segments (markets are defined by problems/JTBD), and "Solution" overlaps with Value Proposition (which by definition includes features). This can create confusion about what goes where.
- **Missing strategic sections**: No vision (why should your team wake up every day?), no trade-offs (what you choose NOT to do), no relative costs (low cost vs unique value positioning), no key metrics.
- **Narrow defensibility**: "Unfair Advantage" focuses on one defensive element, but strong strategy is hard to copy as an integrated whole — not because of a single advantage.
- **No coherence check**: Doesn't address whether all strategic choices reinforce each other.

**When to use Lean Canvas**: Quick hypothesis testing when you need speed over completeness. Best as a brainstorming tool, not a strategy document.

**Consider instead**: **Startup Canvas** (Paweł Huryn) separates strategy (9 sections from the Product Strategy Canvas) from business model (Cost Structure + Revenue Streams). Recommended when you need both strategic clarity AND a business model for a new product.

## Worked Example — Acme Lean Canvas

Acme.ai: an AI expense tracker for Indian consumers. Filled as a set of
*riskiest assumptions to falsify*, not as settled facts.

| Block | Acme |
|---|---|
| **1. Problem** | (1) People with multiple accounts (bank + UPI + cards) have no single honest view of where money went. (2) Manual tracking apps die because typing every transaction is unsustainable. (3) Bank/UPI alerts and statements double-count the same spend, so even motivated trackers get garbage totals. *Existing alternatives:* spreadsheets (abandoned in weeks), bank apps (single-account, no categorization), Walnut/ET Money-style apps. |
| **2. Customer Segments** | Salaried urban Indians 25–40 with 3+ accounts. *Early adopters:* people who currently keep a spending spreadsheet and complain about it — they have already proven the job matters. |
| **3. Unique Value Proposition** | "Know where your money went — across every account — without typing a single transaction." *(High-concept pitch: 'Mint for the UPI era, that actually dedups.')* |
| **4. Solution** | Auto-ingest statements (CSV/PDF + read-only Gmail); auto-categorize via local AI; aggressively dedup overlapping sources; separate true expenses from investments/transfers/EMIs. |
| **5. Channels** | Personal-finance creators (YouTube/Instagram); app stores; web. |
| **6. Revenue Streams** | Freemium → ~₹199/mo for multi-account + full history + Gmail sync + custom rules. |
| **7. Cost Structure** | Cloud VM + Mac-mini AI worker + dev (mostly fixed); near-zero variable inference cost. |
| **8. Key Metrics** | Activation: first statement uploaded + first categorized view (the aha). Retention: % of uploaders active at week 4. Revenue: free→paid conversion. |
| **9. Unfair Advantage** | The per-user override/exact-match table that compounds — the more a user corrects, the more accurate *their* Acme gets, and that learned profile cannot be exported to a competitor. *(Honest note: "AI categorization" is NOT an unfair advantage — see pitfall 3.)* |

**Read the riskiest assumption first, not the prettiest box.** Here the
riskiest is Problem #2 — *will auto-ingest actually keep people who quit
manual apps?* That is the first thing to validate (the cohort retention read
in `cohort-analysis` is exactly this test), before polishing UVP or pricing.

## Pitfalls — the named failure modes

1. **Writing your *assumed* problem instead of the customer's.** The
   single most common Lean Canvas failure: the founder writes the problem
   they *built a solution for* ("people need AI categorization"), not the
   problem the customer actually feels ("I have no idea where my money goes
   and typing it in is hopeless"). The Problem block is a *hypothesis to
   falsify with users* (see `mom-test`, `user-research`), not a restatement
   of your roadmap. If your Problem block could only have been written by
   someone who already saw your product, it is wrong.

2. **Conflating Problem and UVP (and Solution and UVP).** Three different
   things, routinely smeared together:
   - **Problem** = the customer's pain, stated *without reference to you*
     ("double-counted transactions make my totals useless").
   - **Solution** = the top features that address it ("dedup engine").
   - **UVP** = the single *promise* of the resulting benefit, in the
     customer's words ("honest spending totals, automatically"). The UVP is
     not "we have a dedup engine" (that's Solution) and not "transactions
     are double-counted" (that's Problem). If your UVP names a feature, it is
     a Solution in disguise.

3. **A fake UVP — a category label, a "better," or table stakes.** "The best
   expense tracker," "AI-powered finance," "easy and fast" — these are not
   unique value propositions, they are adjectives anyone could claim. A real
   UVP is *specific, single, and finishable by the customer as "...unlike the
   alternatives, which make me ___."* "AI-powered" is especially seductive
   and especially empty — it describes your implementation, not the
   customer's gain. Likewise, do not put table stakes in **Unfair
   Advantage**: "great UX" or "our AI" is copyable; a compounding per-user
   data asset or a genuine network effect is not.

4. **Treating the canvas as answers instead of bets.** Every block is an
   assumption with a risk level. A Lean Canvas filled in as confident fact
   defeats its entire purpose — it exists to surface the riskiest assumption
   so you can go kill it cheaply. If you are not leaving the session with "the
   thing we most need to validate this week is ___," you used it as a
   brochure, not a hypothesis tool.

A fifth, quieter trap: **inventing an Unfair Advantage to fill the box.**
Most early startups genuinely have none yet — "first-mover" and "founder
passion" are not advantages. It is more honest to write "none yet; the bet is
that the override-data moat builds over time" than to fabricate one.

## When NOT to use the Lean Canvas

- **Established business / investor or board materials.** Use the **Business
  Model Canvas** — it gives the holistic operational view (Key Partners /
  Activities / Resources) that a running business needs and investors expect.
- **When you need strategy, not a business-model sketch.** Lean Canvas has no
  vision, no trade-offs, no coherence check (see Domain Context). For
  strategic clarity, use the Startup Canvas / Product Strategy Canvas.
- **As the artefact you *defend* rather than *test*.** If the team treats the
  canvas as a conclusion to present rather than a set of bets to falsify,
  you have the wrong tool out — switch to actual discovery (`user-research`,
  `mom-test`).
- **For deep single-block work.** To detail the value proposition itself, the
  `value-proposition-canvas` is the right zoom-in; to size and pick the first
  segment, use `beachhead-segment`. The Lean Canvas is the one-page overview,
  not the deep dive.

## Cross-links

- **`value-proposition-canvas`** — the proper zoom-in on blocks 1 + 3 (and
  the cure for pitfalls 1–3). It forces the Problem to be the customer's
  jobs/pains/gains and the UVP to be pain-relievers/gain-creators, keeping
  Problem and UVP from collapsing into each other.
- **`beachhead-segment`** — block 2 should name *one* early-adopter segment,
  not "urban Indians." Narrow it here.
- **`business-model`** — the established-business sibling; use the BMC when
  the venture is past hypothesis stage (Domain Context explains the swap).
- **`blue-ocean-strategy`** — when blocks 3/9 reveal you are claiming the same
  value as incumbents, use it to find uncontested space and a real
  differentiator.
- **`mom-test` / `user-research`** — the Problem block (and the riskiest
  assumption) is validated with customers, not in the canvas. Go here first.
- **`cohort-analysis`** — once live, the Key Metrics block (activation,
  week-4 retention) is read here to learn whether the riskiest assumption
  held.

## Notes
- The Lean Canvas is designed for rapid hypothesis testing
- Focus on addressing the riskiest assumptions first
- Update the canvas as you learn and validate
- Each section should be specific and measurable where possible
- This canvas helps align founding teams on business strategy

---

### Further Reading

- [Startup Canvas: Product Strategy and a Business Model for a New Product](https://www.productcompass.pm/p/startup-canvas)
