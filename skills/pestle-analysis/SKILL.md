---
name: pestle-analysis
description: "Perform a PESTLE analysis covering Political, Economic, Social, Technological, Legal, and Environmental factors. Use when assessing the macro environment, doing strategic planning, or evaluating external factors affecting your business."
---

> **Provenance.** Vendored from `phuryn/pm-skills@pestle-analysis` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: product-strategist.
# PESTLE Analysis

## Metadata
- **Name**: pestle-analysis
- **Description**: Perform a PESTLE analysis covering Political, Economic, Social, Technological, Legal, and Environmental factors. Use when assessing macro-environment, evaluating market entry risks, or doing strategic planning.
- **Triggers**: PESTLE analysis, macro environment, market environment, external factors analysis

## Instructions

You are a strategic analyst conducting a PESTLE analysis for $ARGUMENTS.

Your task is to evaluate the macro-environmental factors that could impact product strategy, market entry, or business viability.

## Input Requirements
- Industry and market context
- Geographic market or region(s)
- Product or business type
- Current strategic challenges or questions
- Any known regulatory or market changes

## PESTLE Analysis Framework

### 1. Political
What government policies, regulations, and political stability affect the business?

- Government policies and incentives
- Tax regulations and tariffs
- Political stability and risk
- Government spending and subsidies
- Trade agreements and regulations
- Licensing and permits required
- Government relationships and lobbying needs

### 2. Economic
What economic conditions and financial factors matter?

- Economic growth and GDP trends
- Interest rates and inflation
- Currency exchange rates
- Consumer spending and confidence
- Employment and labor costs
- Disposable income trends
- Access to financing and capital

### 3. Social
What demographic and cultural trends shape the market?

- Population demographics and trends
- Cultural attitudes and values
- Consumer lifestyle and behaviors
- Education and skills availability
- Health and wellness trends
- Social media and digital adoption
- Diversity and inclusion preferences

### 4. Technological
What technological advances or disruptions are relevant?

- Emerging technologies (AI, blockchain, cloud, etc.)
- Digital transformation trends
- Cybersecurity and data privacy requirements
- Automation and robotics
- Internet of Things (IoT) and connectivity
- Research and development capabilities
- Technology adoption rates and digital literacy

### 5. Legal
What laws, regulations, and compliance requirements apply?

- Data protection and privacy laws (GDPR, CCPA, etc.)
- Employment and labor laws
- Intellectual property and patent laws
- Consumer protection laws
- Industry-specific regulations
- Compliance costs and audit requirements
- Liability and insurance requirements

### 6. Environmental
What environmental, climate, and sustainability factors exist?

- Climate change and environmental regulations
- Carbon emissions and sustainability requirements
- Natural resource availability and scarcity
- Waste management and circular economy trends
- Renewable energy adoption
- ESG (Environmental, Social, Governance) expectations
- Green certification and eco-friendly standards

## Output Process
1. For each PESTLE category, identify 3-5 relevant factors
2. Assess impact on product/business (High, Medium, Low)
3. Assess probability or likelihood (High, Medium, Low)
4. Prioritize factors by impact x probability
5. Develop strategic responses:
   - Which factors are opportunities to leverage?
   - Which factors are threats to mitigate or avoid?
   - Which factors require compliance or adaptation?
6. Identify key metrics or leading indicators to monitor
7. Build contingency plans for high-impact factors
8. Document assumptions and unknowns requiring research

## Strategic Applications
- Market entry assessment: Is this market viable to enter?
- Risk assessment: What macro risks could derail our strategy?
- Opportunity identification: What external shifts create new possibilities?
- Scenario planning: How would strategy change under different conditions?
- Regulatory roadmap: What compliance needs must we plan for?

## Worked example — Acme (consumer fintech, India)

A generic PESTLE lists categories. A useful one names *India-specific*, *dated*, *prioritized* factors and ends with a strategic response. The impact × probability scoring is what separates signal from a wall of "Medium."

| Factor | Category | Impact | Prob. | Score | Strategic response |
|---|---|---|---|---|---|
| **DPDP Act 2023** — consent + data-localization for financial PII | Legal/Political | High | High | **Critical** | Build consent ledger + India-resident storage before scaling; gate at launch. |
| **RBI Account Aggregator framework** maturing | Political/Tech | High | High | **Critical** | Plan AA as a first-class data source — turns a Threat (fragile scraping) into an Opportunity. |
| **UPI volume growing ~40% YoY** | Economic/Social | High | High | **Critical** | More transactions to categorize = core TAM tailwind; instrument for scale. |
| **Cloud-LLM prices falling fast** | Technological | Medium | High | High | Erodes the local-Mac-Mini cost moat over ~18 months — diversify the moat toward privacy + accuracy, not just cost. |
| **Rupee depreciation vs USD** | Economic | Low | Medium | Low | Minor — mostly affects USD-priced cloud infra; monitor, no action. |
| **Carbon-disclosure norms** | Environmental | Low | Low | Negligible | Not material for a consumer app at this stage — *explicitly parked* (see "everything is Medium" pitfall). |

The output is not the six lists — it's the **ranked top 3 (the "Critical" rows)** plus an explicit "parked / not material" set so the team isn't paralyzed by macro noise. The DPDP row, scoring Critical, should hand straight off to the india-fintech regulatory bundle and become a launch gate.

## When NOT to use PESTLE

- **B2B SaaS where the macro doesn't move quarter to quarter.** A developer-tools or internal-analytics SaaS sold to enterprises is barely touched by interest rates, demographics, or environmental policy on a planning horizon that matters. Running a full six-category PESTLE produces five empty boxes and one ("Technological/Legal") that's really just a data-privacy review. For these, skip to `porters-five-forces` (competitive structure) and a focused privacy/compliance check.
- **Tactical or reversible decisions.** PESTLE is for market-entry, geographic-expansion, and multi-year strategy. Don't PESTLE a feature, a pricing tweak, or a sprint — that's `swot-analysis` / `prioritization-methods` territory at most.
- **When you have no geographic anchor.** PESTLE is meaningless without a named region (see Geography-blind pitfall). "PESTLE for our app" globally averages away the very differences that make it useful. If you can't name the market, you're not ready for PESTLE.
- **As a substitute for primary research.** PESTLE organizes what you know about the macro environment; it does not discover it. If every cell is a guess, do the research first.

## Pitfalls

❌ **"Everything is Medium impact."** The fastest way to make a PESTLE useless is to rate every factor Medium/Medium so nothing stands out. PESTLE's entire value is *triage* — most macro factors genuinely don't matter to your specific product, and saying so (Low, or "parked / not material") is the analysis. Force a spread: if you can't name 2–3 Critical factors and several Negligible ones, you haven't done the impact × probability scoring honestly.

❌ **Geography-blind PESTLE.** Writing a PESTLE with no named region produces generic mush ("data privacy is important", "AI is advancing"). Political, Legal, and Economic factors are *intensely* local — GDPR vs DPDP vs CCPA are different regimes with different deadlines. Always anchor to a specific market; if you operate in three regions, run three PESTLEs (or a column per region), not one averaged one.

❌ **Confusing PESTLE with SWOT.** PESTLE is *macro and entirely external* — forces no single company controls. SWOT mixes internal (S/W) and external (O/T). A factor like "our weak compliance team" is a SWOT weakness, never a PESTLE factor. Keep PESTLE strictly to the environment; feed its findings *into* SWOT's Opportunities/Threats quadrants.

❌ **Listing without a "so what."** Six tidy lists of factors with no impact rating, no probability, and no strategic response is a wikipedia article, not a decision input. Every factor that scores High/Critical must end in a named response (leverage / mitigate / comply / monitor) with an owner.

❌ **Treating it as one-and-done.** Macro factors shift (a new regulation, a rate cut, an election). A PESTLE with no date and no re-assessment trigger silently rots. Date-stamp it and re-run on any major regulatory or economic shift, at minimum annually.

❌ **Over-weighting the dramatic, under-weighting the boring.** Teams over-index on flashy Technological factors ("what if AGI…") and under-rate the boring Legal/Economic ones that actually kill products (a licensing requirement, a localization mandate). Rank by impact × probability, not by how interesting the factor is to discuss.

## Cross-links

- **`porters-five-forces`** — the natural pairing. PESTLE covers the *macro* environment (forces outside any industry); Porter covers the *industry structure* (rivalry, buyer/supplier power, substitutes, entry). Run PESTLE first to set context, then Porter to analyze the competitive arena inside it.
- **`swot-analysis`** — PESTLE feeds SWOT. The Critical external factors PESTLE surfaces become the *Opportunities* and *Threats* in SWOT, with evidence behind them instead of guesses. Keep internal factors out of PESTLE; they belong in SWOT.
- **`competitive-analysis`** (and its TAM/SAM/SOM market sizing) — PESTLE's Economic and Social factors (market growth rate, demographic tailwinds, disposable-income trends) are direct inputs to a credible market-size estimate. Don't size a market without the macro context PESTLE provides.
- **Regulatory bundles** (e.g. `india-fintech`, `eu-gdpr`, `us-fintech`) — when a PESTLE Legal/Political factor scores Critical, it's no longer a strategy note; hand it to the relevant compliance bundle and make it a launch gate.

## Notes
- PESTLE is complementary to SWOT (macro vs. micro analysis)
- Some factors span multiple categories (e.g., regulations affect legal, political, and economic)
- Geographic and industry context matter significantly
- Trends evolve; re-assess PESTLE annually or when markets shift
- Use PESTLE early in strategy development to avoid blind spots

---

### Further Reading

- [The Product Management Frameworks Compendium + Templates](https://www.productcompass.pm/p/the-product-frameworks-compendium)
