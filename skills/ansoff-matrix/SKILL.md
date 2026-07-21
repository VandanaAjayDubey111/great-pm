---
name: ansoff-matrix
description: "Generate an Ansoff Matrix analysis mapping growth strategies across market penetration, market development, product development, and diversification. Use when considering growth options, planning market expansion, or evaluating strategic growth paths."
---

> **Provenance.** Vendored from `phuryn/pm-skills@ansoff-matrix` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: product-strategist.
# Ansoff Matrix

## Metadata
- **Name**: ansoff-matrix
- **Description**: Generate an Ansoff Matrix analysis mapping growth strategies across market penetration, market development, product development, and diversification.
- **Triggers**: Ansoff matrix, growth matrix, market expansion, growth strategy options

## Instructions

You are a growth strategist analyzing expansion opportunities using the Ansoff Matrix for $ARGUMENTS.

Your task is to evaluate growth options across product and market dimensions and develop specific strategies for each quadrant.

## Input Requirements
- Current product(s) and market definition
- Current market penetration and performance
- Customer insights and market opportunities
- Company capabilities and constraints
- Growth targets and timelines
- Competitive dynamics

## Ansoff Matrix Framework

### 2x2 Matrix: Products vs. Markets

|  | Current Market | New Market |
|---|---|---|
| **Current Product** | Market Penetration | Market Development |
| **New Product** | Product Development | Diversification |

---

### 1. Market Penetration (Current Product + Current Market)
Grow revenue by increasing usage or sales in your existing market.

**Strategies:**
- Increase frequency of product usage
- Expand use cases within existing customer base
- Acquire competitors' customers
- Reduce churn and improve retention
- Upsell and cross-sell existing customers
- Lower prices to capture price-sensitive segments
- Increase marketing and brand awareness
- Improve customer experience to drive referrals

**Examples:**
- Netflix adding games to increase engagement
- Starbucks encouraging multiple visits per week
- Adobe expanding Adobe Creative Cloud subscriptions

**Risk Level:** Low (familiar market, product, capabilities)

**Typical Timeline:** 6-12 months

---

### 2. Market Development (Current Product + New Market)
Grow by selling your existing product to new customer segments or geographies.

**Strategies:**
- Expand into new geographies or regions
- Target new customer segments or personas
- Sell through new channels or partnerships
- Adapt product for new use cases
- Partner with complementary companies
- Localize product for new markets
- Build brand awareness in new markets

**Examples:**
- Facebook expanding internationally
- Uber moving into new cities and countries
- Slack selling to non-tech industries

**Risk Level:** Medium (new market dynamics, but proven product)

**Typical Timeline:** 12-24 months

---

### 3. Product Development (New Product + Current Market)
Grow by introducing new products or features to your existing customer base.

**Strategies:**
- Add new features to existing product
- Create adjacent product lines
- Bundle products for greater value
- Develop premium/lite versions
- Integrate adjacent capabilities
- Create complementary products
- Upgrade product experience or performance

**Examples:**
- Spotify adding podcasts
- Amazon Prime expanding services (video, music, grocery)
- Figma adding prototyping and FigJam

**Risk Level:** Medium (existing customers but new product)

**Typical Timeline:** 12-18 months

---

### 4. Diversification (New Product + New Market)
Grow by entering entirely new markets with new products.

**Strategies:**
- Related diversification: leveraging existing competencies
- Unrelated diversification: entering new domains
- Acquire companies in new markets/products
- Strategic partnerships or joint ventures
- Build new business units
- Apply capabilities to adjacent problems

**Examples:**
- Amazon expanding from books to cloud services (AWS)
- Apple expanding from computers to phones, wearables, services
- Microsoft moving from software to cloud (Azure) and gaming (Xbox)

**Risk Level:** High (new market, new product, new capabilities)

**Typical Timeline:** 24+ months, requires significant investment

---

## Output Process
1. Define current market and product clearly
2. Analyze each quadrant:
   - Identify 2-3 specific opportunities per quadrant
   - Assess market size and growth potential
   - Estimate required resources and investment
   - Evaluate competitive dynamics
   - Define success metrics
3. Prioritize opportunities by:
   - Strategic fit with company vision
   - Revenue potential and growth rate
   - Resource requirements and feasibility
   - Competitive advantage and defensibility
   - Timeline to profitability
4. Develop go-to-market strategy for top 2-3 opportunities
5. Create phased roadmap and milestones
6. Identify risks and mitigation plans
7. Define success metrics and leading indicators

## Strategic Questions
- Which quadrant offers the best risk-reward profile?
- Where do our capabilities give us competitive advantage?
- Which opportunities align best with our vision and values?
- What partnerships or acquisitions would accelerate growth?
- How does each option impact our brand and positioning?

## Notes
- Market penetration is lowest risk; diversification is highest risk
- Most companies should excel in one quadrant before expanding
- Avoid spreading too thin across all four quadrants simultaneously
- Consider sequential strategy: penetration first, then market development
- Reassess Ansoff Matrix annually or when market conditions shift

## Worked Example — Acme (personal-finance app)

**Current position:** personal expense-tracking app, sold to individual Indian consumers via app stores. ~50k MAU, the product auto-categorizes spending from uploaded bank statements.

| Quadrant | A concrete Acme move | Risk | Verdict |
|---|---|---|---|
| **Market Penetration** (same product, same market) | Improve categorization accuracy + add bill reminders to lift retention and referrals among existing Indian consumers | Low | **Do first.** Cheapest growth; retention compounds every other quadrant. |
| **Market Development** (same product, new market) | Same app, new segment: small-business owners who need expense tracking for GST; or new geography (Southeast Asia) | Medium | **Second.** Product is proven; the unknown is whether the *new* segment has the same burning pain (validate as a beachhead first). |
| **Product Development** (new product, same market) | New product for the *same* Indian consumers: a savings-goals/investing-nudge feature, or a credit-score tracker | Medium | **Third.** Trusted relationship + existing distribution, but a genuinely new build with its own adoption curve. |
| **Diversification** (new product, new market) | A lending product (BNPL) sold to SMBs — new product *and* new buyer, new regulatory regime, new sales motion | High | **Avoid for now.** This is the diversification trap dressed as ambition. |

**The honest read:** with 50k MAU and unproven retention, Acme belongs almost entirely in **Penetration**. Everything to the right and below is a *future* sequence, not a *parallel* program. A roadmap that puts one bet in all four quadrants this year is the "we're doing all four" failure mode below.

## When NOT to use the Ansoff Matrix

- **Pre-PMF.** If you have not yet won your current product in your current market, "growth options" is the wrong question — Penetration is the only honest quadrant, and the real work is finding fit (see `lean-startup`, `crossing-the-chasm`). Ansoff is a *growth* tool, not a *fit-finding* tool.
- **When the real question is "should this market exist?"** Ansoff assumes you grow within or adjacent to a known market. If you suspect the winning move is to make the competition irrelevant by creating uncontested space, that is a `blue-ocean-strategy` question — Ansoff's four boxes will herd you into existing-market thinking and miss it.
- **For prioritizing features inside one product.** Ansoff is a portfolio/expansion lens, not a backlog-ranking tool. Use `prioritization-methods` (RICE/WSJF) for that.

## Pitfalls / Failure modes

1. **The diversification trap.** Diversification (new product + new market) feels like the most ambitious, "transformational" play, so leaders over-weight it. It is the quadrant with the *highest* failure rate because you are simultaneously learning a new product, a new buyer, a new channel, and often a new regulatory regime — with none of your existing advantages transferring. Most "bold pivots" that die are unforced diversification. Require an explicit answer to "what existing competency actually transfers?" before greenlighting.
2. **"We're doing all four."** A growth deck with one initiative in every quadrant is not a strategy — it is the absence of one. The whole point of Ansoff is *sequencing under finite resources*. Spreading thin guarantees you dominate no quadrant. Force a rank, fund the top one or two, and explicitly defer the rest.
3. **Mislabeling the quadrant to feel safer.** Teams routinely file a genuinely-new product as "Product Development" (medium risk) when the buyer is also new — making it actually Diversification (high risk). The risk label drives the investment case, so an honest quadrant assignment is load-bearing. Test it: *is the buyer the same person/budget as today?* If no, you are at least one column to the right of where you claimed.
4. **Treating "new market" as just a new geography.** A new *segment* in the same geography (consumer → SMB) is often a harder market shift than a new *country* in the same segment, because the job, the buying process, and the willingness-to-pay all change. Don't assume "Market Development" is automatically low-medium risk; size the *behavioral* distance, not the map distance.
5. **Annual-only reassessment in a fast market.** The note says "reassess annually," but a competitor launch, a regulatory change, or a failed quadrant bet should trigger an immediate re-map. A stale Ansoff matrix justifies last year's commitments against this year's reality.

## Cross-links

- **`crossing-the-chasm`** (Geoffrey Moore) — when a quadrant move means reaching a *new* customer type (especially Market Development or Diversification), the chasm between early adopters and the mainstream is the dominant risk. Pair Ansoff's *where to grow* with Crossing the Chasm's *how to cross into that segment*, and pick a **beachhead** (see `beachhead-segment`) inside the new market rather than attacking it broadly.
- **`blue-ocean-strategy`** — Ansoff operates inside *existing* market boundaries (red ocean). When the strongest move is to redraw the boundary and create uncontested demand, Blue Ocean is the complementary lens; use it to pressure-test whether you are competing in a crowded box when you could be making a new one.
- **`porters-five-forces`** — before committing to any new-market quadrant, run Five Forces on that target market's structure; an attractive-looking quadrant can sit in a structurally brutal industry.
- **`prioritization-methods`** — once you have 2-3 candidate moves across quadrants, score them (RICE / WSJF) to make the sequencing decision defensible rather than political.

---

### Further Reading

- [The Product Management Frameworks Compendium + Templates](https://www.productcompass.pm/p/the-product-frameworks-compendium)
