---
name: business-model
description: "Generate a Business Model Canvas with all 9 building blocks. Use when creating a business model, documenting how a business creates value, or analyzing an existing business model."
---

> **Provenance.** Vendored from `phuryn/pm-skills@business-model` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: product-strategist.
# Business Model Canvas

## Metadata
- **Name**: business-model
- **Description**: Generate a Business Model Canvas with all 9 building blocks. Use when creating a business model, documenting how a business creates value, or analyzing an existing business model.
- **Triggers**: business model canvas, BMC, business model, how we make money

## Instructions

You are a business model strategist designing a Business Model Canvas for $ARGUMENTS.

Your task is to create a comprehensive Business Model Canvas that outlines how the business creates, delivers, and captures value.

## Input Requirements
- Product or service description
- Target customer(s) and market
- Current business operations or assumptions
- Competitive context or industry dynamics

## Business Model Canvas Template

### Left Side: Creating Value

**1. Key Partners**
- Who are the key strategic partners and suppliers?
- What partnerships enable our business model?
- Which activities do partners handle?
- Are there joint ventures or co-creation opportunities?

**2. Key Activities**
- What key activities does the business perform?
- What processes are critical to delivering value?
- Are these activities in-house or outsourced?
- Production, problem-solving, platform/network activities?

**3. Key Resources**
- What resources are necessary to create value?
- Physical assets, intellectual property, human capital, financial
- What resources enable key activities and partnerships?
- What's the minimum viable resource set?

### Center: The Value Proposition

**4. Value Propositions**
- What value do we deliver to customers?
- Which customer problems do we solve?
- What needs are satisfied?
- What products/services address each segment?
- Quantitative (price, speed, quality) vs. qualitative (design, status)

### Right Side: Delivering Value

**5. Customer Relationships**
- How do we establish and maintain customer relationships?
- Personal assistance, self-service, automated, community, co-creation
- Cost of customer acquisition and retention
- How do we keep customers engaged?

**6. Channels**
- How do customers discover and access the value?
- Awareness: How do customers learn about us?
- Purchase: How do they buy?
- Delivery: How is value delivered?
- After-sales: How do we support customers?
- Direct vs. indirect, owned vs. partner channels

**7. Customer Segments**
- Who are the key customer segments?
- Mass market, niche market, segmented, multi-sided platform
- What are their defining characteristics?
- Distinct needs, channels, relationships, or profitability

### Bottom: Financial Viability

**8. Cost Structure**
- What are the most important costs?
- Fixed vs. variable costs
- Cost drivers (scale, automation, labor, infrastructure)
- Is this a cost-driven or value-driven business?

**9. Revenue Streams**
- How does the business make money?
- Per customer, per transaction, subscription, licensing, rents
- Pricing mechanisms (fixed, dynamic, value-based)
- Customer lifetime value and unit economics

## Output Process
1. Identify and profile customer segments
2. Define the core value proposition(s)
3. Map customer relationships and channels
4. List key activities and resources
5. Identify key partners
6. Outline cost structure
7. Define revenue streams
8. Ensure all 9 blocks align and support each other
9. Test economic viability (LTV > 3x CAC)
10. Identify key assumptions and risks

### Domain Context

**Business Model Canvas vs Lean Canvas vs Startup Canvas**:

Business Model Canvas (Strategyzer, Alexander Osterwalder) is the most widely used canvas framework. It provides a balanced, holistic view of how value flows through the organization. However, it has known limitations for product strategy:

- **No vision**: Why should your team wake up every day? BMC doesn't address motivation or aspiration.
- **No Can't/Won't test**: What stops competitors from copying you? BMC lacks a defensibility section that goes beyond listing resources.
- **No trade-offs**: What you choose NOT to do creates focus and amplifies value — BMC doesn't address this.
- **No key metrics**: How do you know the strategy is working? BMC has no metrics section.
- **Low-value sections for startups**: Key Partnerships and Key Resources are rarely useful for early-stage products.

**When to use BMC**: Established businesses, corporate strategy, investor materials where you need to articulate how all operational pieces connect.

**Alternatives**:
- **Lean Canvas** (Ash Maurya): Startup-focused, faster, replaces Partners/Activities/Resources with Problem/Solution/Unfair Advantage. Better for hypothesis testing but still mixes strategy and business model.
- **Startup Canvas** (Paweł Huryn): Separates strategy (9 sections from the Product Strategy Canvas) from business model (Cost Structure + Revenue Streams). Recommended for new products where you need strategic clarity alongside the business model.

## Worked Example — Acme Business Model Canvas

Acme.ai: an AI expense tracker for Indian consumers that ingests bank /
UPI statements (CSV/PDF + read-only Gmail), categorizes transactions with a
local AI engine, and separates true expenses from investments, transfers,
and EMIs. A filled BMC:

| Block | Acme |
|---|---|
| **Customer Segments** | Salaried urban Indians (25–40) with 3+ accounts (bank + UPI + 1–2 cards) who already *try* to track spend in spreadsheets and give up. NOT "everyone with a bank account." |
| **Value Propositions** | "See where your money actually went, across every account, without typing a single transaction." Auto-ingest + auto-categorize + auto-dedup the overlapping mess of UPI + bank + card alerts. |
| **Channels** | Awareness: personal-finance creators on YouTube/Instagram. Acquisition: app stores + web. Delivery: cross-platform app (Expo). Support: in-app + email. |
| **Customer Relationships** | Self-service onboarding; automated re-categorization that *learns* the user's overrides; light touch — the product should fade into the background. |
| **Revenue Streams** | Freemium: free for single-account + 90-day history; paid (~₹199/mo) for multi-account, full history, Gmail auto-sync, and custom rules. Value-based, not per-transaction. |
| **Key Resources** | The categorization engine + the user-override "exact match" table (the moat compounds per user); the dedup logic; brand trust around read-only data access. |
| **Key Activities** | Statement parsing across Indian banks; categorization accuracy; privacy/security; the async queue that keeps the UI responsive while the local AI worker processes. |
| **Key Partners** | Ollama/model providers (inference); statement-format coverage; (deliberately NOT payment networks — no UPI deep-linking, per product constraint). |
| **Cost Structure** | Mostly fixed: cloud (Oracle VM), the Mac-mini AI worker, dev. Variable per-user cost is near-zero — local inference, not per-API-call. Value-driven, not cost-driven. |

**The coherence check is what makes this useful, not the nine boxes.**
Notice the blocks reinforce each other: near-zero variable cost (Cost
Structure) is what *allows* a generous free tier (Revenue Streams) that
drives the creator-led acquisition (Channels); the override table (Key
Resources) is what makes Relationships "it learns you" rather than "configure
it." A BMC where the blocks do not feed each other is just a filled-in
template. And note the gap BMC cannot show — *why anyone wakes up to build
this* and *what stops a bank's own app from copying it* — which is exactly
the Domain-Context limitation above. For those, pair this with
`value-proposition-canvas` and a defensibility view.

## Pitfalls — the named failure modes

1. **Treating the canvas as the strategy.** The BMC describes *how value
   flows operationally*; it is not a strategy. It has no vision, no
   trade-offs, no defensibility test, no metrics (see Domain Context). A
   filled BMC with no answer to "why us, why now, what won't we do" is an
   org chart of value flow, not a plan. Pair with a real strategy artefact.

2. **A Value Proposition that is just a feature list.** "AI categorization,
   multi-account, Gmail sync" is a feature list. The value proposition is
   the *job done* — "see where your money went without typing." If block 4
   reads like your changelog, you have not written a value proposition.

3. **Blocks that do not reinforce each other.** The most common BMC failure:
   nine independently-plausible boxes that contradict at the seams — e.g. a
   high-touch white-glove Customer Relationship stapled to a low-margin
   self-serve Revenue Stream. Always run the coherence check across blocks,
   not just within them.

4. **Padding low-value blocks for early-stage products.** For a pre-PMF
   startup, Key Partners / Key Activities / Key Resources are often
   speculative filler that creates false confidence. If you are early, the
   honest blocks are Segments, Value Prop, Channels, Revenue, Cost — and a
   Lean Canvas is the better tool (it swaps the speculative blocks for
   Problem/Solution/Unfair Advantage). Do not invent partners you do not
   have.

5. **Skipping the unit-economics test.** A BMC that does not check LTV > ~3×
   CAC at scale is a description of activity, not a viable model. Revenue
   Streams and Cost Structure must close the loop, or the canvas is fiction.

## When NOT to use the Business Model Canvas

- **Pre-PMF / hypothesis-testing stage.** Use **Lean Canvas** instead — it
  replaces the speculative Partners/Activities/Resources blocks with
  Problem/Solution/Unfair Advantage, which is what an early venture actually
  needs to falsify.
- **When you need strategy, not operations.** BMC has no vision, trade-offs,
  defensibility, or metrics. For strategic clarity reach for the Startup
  Canvas / Product Strategy Canvas (see Domain Context).
- **For a single feature inside an existing product.** The BMC is for a
  *business*; a feature does not have its own Key Partners. Use
  `opportunity-solution-tree` or a PRD.
- **As a one-and-done artefact.** A BMC frozen at kickoff rots. If you are
  not going to revisit it as you learn, the exercise is theatre.

## Cross-links

- **`value-proposition-canvas`** — zoom into block 4. The BMC's Value
  Proposition + Customer Segments pair is exactly what VPC details
  (pains/gains/jobs ↔ pain-relievers/gain-creators). Do this before
  finalizing the BMC center.
- **`lean-canvas`** — the early-stage sibling; use it instead of BMC pre-PMF
  (the Domain Context explains the swap).
- **`beachhead-segment`** — block 7 (Customer Segments) should name a single
  beachhead, not "the mass market." Narrow it there.
- **`blue-ocean-strategy`** — when the canvas reveals you are competing on
  the same value blocks as incumbents, use it to find the uncontested space
  (the defensibility gap BMC cannot express on its own).
- **`pricing-models`** — block 9 (Revenue Streams) needs a real monetization
  model and willingness-to-pay rationale, not just "subscription."

## Notes
- The Business Model Canvas provides a holistic view of how value flows through the organization
- Each block should reinforce and support the others
- Strong business models have clear, defensible value propositions
- Financial sustainability requires revenue to exceed costs at scale
- Use this to identify opportunities for innovation and optimization

---

### Further Reading

- [Business Model Canvas Examples: Google Maps, Airbnb, Uber](https://www.productcompass.pm/p/business-model-canvas-examples)
- [Startup Canvas: Product Strategy and a Business Model for a New Product](https://www.productcompass.pm/p/startup-canvas)
