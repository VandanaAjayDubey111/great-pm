---
name: swot-analysis
description: "Perform a detailed SWOT analysis — strengths, weaknesses, opportunities, and threats with actionable recommendations. Use when doing strategic assessment, competitive analysis, or evaluating a product or business position."
---

> **Provenance.** Vendored from `phuryn/pm-skills@swot-analysis` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: product-strategist.
# SWOT Analysis

## Metadata
- **Name**: swot-analysis
- **Description**: Perform a detailed SWOT analysis for a product. Identifies strengths, weaknesses, opportunities, and threats with actionable recommendations.
- **Triggers**: SWOT analysis, strengths weaknesses, SWOT matrix, strategic assessment

## Instructions

You are a strategic analyst conducting a SWOT analysis for $ARGUMENTS.

Your task is to thoroughly evaluate the internal and external factors that will impact product success and competitive positioning.

## Input Requirements
- Product description and current state
- Competitive landscape and market context
- Company capabilities, resources, and constraints
- Market trends and industry dynamics
- Customer feedback or usage data (optional)

## SWOT Analysis Framework

### 1. Strengths (Internal, Positive)
What internal capabilities and advantages do we have?

- Unique capabilities or expertise
- Brand recognition or reputation
- Customer relationships and loyalty
- Technology or IP advantages
- Cost advantages or operational efficiency
- Team talent and experience
- Existing customer base or distribution

### 2. Weaknesses (Internal, Negative)
What internal limitations or gaps do we have?

- Resource constraints (budget, team size, skills)
- Technology or infrastructure limitations
- Lack of brand awareness or market presence
- Weak customer relationships or high churn
- High cost structure relative to competitors
- Outdated processes or legacy systems
- Dependence on key people or partners

### 3. Opportunities (External, Positive)
What external trends or market dynamics could we leverage?

- Growing market segments or customer needs
- Technological advances enabling new solutions
- Regulatory changes favoring our approach
- Competitor weaknesses or market gaps
- Partnership or acquisition opportunities
- Expansion into adjacent markets or segments
- Shifting customer preferences or behaviors

### 4. Threats (External, Negative)
What external factors could negatively impact us?

- Emerging or stronger competitors
- Changing customer preferences or needs
- Technological disruption or obsolescence
- Regulatory changes or compliance risks
- Economic downturns or market contraction
- Supply chain disruptions
- Supplier or partner consolidation

## Output Process
1. Identify 5-7 strengths (be honest about competitive advantages)
2. List 5-7 weaknesses (avoid minimizing; focus on addressable gaps)
3. Map 5-7 opportunities (prioritize by market size and alignment)
4. Flag 5-7 threats (assess probability and impact)
5. Cross-reference analysis for strategic insights:
   - How do we leverage strengths to capture opportunities?
   - How do we shore up weaknesses to mitigate threats?
   - Which opportunities can overcome weaknesses?
   - Which threats could exploit weaknesses?
6. Develop 3-5 strategic recommendations
7. Prioritize actions and owners
8. Identify metrics to track progress

## Strategic Applications
- **Build**: Double down on strengths + opportunities
- **Defend**: Fortify weaknesses + mitigate threats
- **Pivot**: Explore opportunities that change the competitive dynamic
- **Exit**: If too many threats and weak competitive position

## Worked example — Acme (Indian consumer expense tracker)

A SWOT is worthless as four lists. Its value is entirely in the **TOWS cross-quadrant** that turns the lists into strategy. Here is the full chain:

```
STRENGTHS (internal +)
- Local AI worker (Mac Mini) → zero per-transaction LLM cost vs cloud rivals
- Aggressive duplicate detection across Gmail + CSV + PDF sources
- Read-only Gmail OAuth → privacy story competitors can't easily match

WEAKNESSES (internal −)
- AI worker is a home-network single point of failure (downtime = queue backs up)
- No mobile-native sync yet; web-first
- Categorization accuracy drops on regional-language merchants

OPPORTUNITIES (external +)
- UPI transaction volume growing ~40% YoY → more data to categorize
- RBI account-aggregator framework maturing → cleaner data source
- Incumbents (Walnut, etc.) under-investing in the Indian long tail

THREATS (external −)
- A bank or PhonePe could ship native categorization for free
- DPDP Act compliance cost rising for anyone touching financial PII
- Cloud-LLM prices falling → erodes the local-worker cost moat
```

Now the part most SWOTs skip — **TOWS strategies** (the actual output):

| | Use this Strength… | …to cover this Weakness |
|---|---|---|
| **Seize this Opportunity (SO / WO)** | **SO:** Lean on the zero-cost local AI to win the price-sensitive long tail incumbents ignore. | **WO:** Use the account-aggregator framework to cut reliance on fragile multi-source dedup. |
| **Defend this Threat (ST / WT)** | **ST:** Make the privacy / read-only story the wedge before a bank ships "free" categorization that mines your data. | **WT:** The worker single-point-of-failure × a bank shipping native categorization is the kill scenario — fix the offline fallback *now* (this is also a `pre-mortem` headline). |

Three recommendations fall out of the TOWS, not the four lists: (1) ship the worker-offline fallback this quarter (WT cell), (2) make privacy the headline positioning (ST cell), (3) target Tier-2/3 regional users incumbents ignore (SO cell). Notice the WT cell is the highest-priority — weakness × threat is where companies die.

## When NOT to use SWOT

- **When you need structural market analysis, not a snapshot.** SWOT tells you *where you stand today*; it says nothing about *why* the market is shaped the way it is. For supplier/buyer power, rivalry, and barriers to entry, use **`porters-five-forces`** — it's the structural complement.
- **When the real question is differentiation.** "Should we build feature X?" is not a SWOT question. SWOT will produce four vague lists; what you want is **`blue-ocean-strategy`** (compete where no one else is) or **`value-proposition-canvas`** (fit to a specific job).
- **As a substitute for evidence.** SWOT is a synthesis frame, not a research method. If you don't have competitive data and user data feeding it, you're brainstorming, not analyzing — do the `competitive-analysis` and `user-research` first.
- **For an irreversible go/no-go decision on its own.** SWOT has no scoring, no probability weighting, and no prioritization built in. Pair it with `prioritization-methods` (to rank the strategies it generates) or `pre-mortem` (to stress-test the chosen one).
- **When it'll just be theater.** A SWOT generated to fill a slide for a board deck, never revisited, is overhead. If no decision hangs on it, skip it.

## Pitfalls

❌ **S/O/W/T fishing — listing items because the box is empty.** Padding "strengths" with generic claims ("passionate team", "great UX") that any competitor could also list. A strength is only a strength if it's *relative to competitors and hard to copy*. If a rival can say the same sentence, it's table stakes, not a strength — move it out.

❌ **Confusing internal and external.** Strengths/Weaknesses are *yours* (internal, you control them). Opportunities/Threats are *the market's* (external, you don't). "We have a weak mobile app" is a weakness; "users are shifting to mobile" is the opportunity/threat. Mixing these is the most common SWOT error and it breaks the TOWS cross-quadrant.

❌ **Stopping at four lists (no TOWS).** A SWOT that ends at the four quadrants is a description, not a strategy. The entire payoff is the cross-quadrant — SO/ST/WO/WT — which converts the lists into moves. A SWOT without TOWS is a half-finished exercise.

❌ **Sloppy TOWS — pairing things that don't actually combine.** Forcing every strength against every opportunity produces a 7×7 grid of mush. Only write a TOWS cell where a *specific* strength genuinely neutralizes a *specific* threat or unlocks a *specific* opportunity. Three sharp TOWS strategies beat thirty mechanical ones.

❌ **Everything is a strength (no honesty).** A SWOT where the weaknesses are softened euphemisms ("opportunities for growth") is useless — you've hidden exactly the WT kill-scenario quadrant that matters most. Be as ruthless about weaknesses as the `pre-mortem` skill is about failure modes.

❌ **Static snapshot, never revisited.** Quadrant placement shifts as the market moves (a falling cloud-LLM price turns a strength into a threat). Date-stamp the SWOT and re-run it quarterly or on any major competitive move.

## Cross-links

- **`porters-five-forces`** — the structural complement. SWOT is the snapshot; Porter explains *why* the snapshot looks that way (rivalry, supplier/buyer power, substitutes, entry barriers). Run Porter to source a richer, less hand-wavy set of Threats.
- **`blue-ocean-strategy`** — where SWOT assumes you compete in the existing market, Blue Ocean asks whether you should redraw it. Use it on the Opportunities quadrant to find uncontested space rather than just reacting to Threats.
- **`competitive-analysis`** / **`competitive-battlecard`** — the evidence source for Strengths (vs whom?) and Threats (which competitor?). Don't fill those quadrants from memory.
- **`pre-mortem`** — the WT (weakness × threat) cell is almost always a pre-mortem headline. Promote it into a forward-looking failure scan with concrete guardrails.
- **`prioritization-methods`** — to rank the 3–5 TOWS strategies SWOT generates so the highest-value move goes first.

## Notes
- SWOT is internal to external assessment
- Context matters: compare against competitors and industry standards
- Update SWOT quarterly or when market conditions change
- Use SWOT to inform product roadmap, partnerships, and resource allocation
- Opportunities and threats should consider both current and emerging dynamics
