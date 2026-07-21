---
name: ai-unit-economics
description: The unit-economics model that governs whether an AI product is viable. Forces explicit cost-per-action (token + orchestration overhead), gross-margin-per-query math, the "every feature use costs money" mental model, the cost levers (caching, model tiering, batching, local inference), and break-even analysis. The AI extension of cost-model and pricing-models — those are general; this models per-query variable cost.
when_to_use: |
  Use when:
  - pricing-strategist is pricing an AI feature and must prove the margin survives power users
  - ai-product-strategist claims an AI capability is a moat or a cost advantage
  - cost-model needs the per-action token structure that classic SaaS cost models lack
  - a strategy doc assumes "near-zero marginal cost" for an LLM-driven feature (it is wrong)
  - deciding model tiering, caching, batching, or cloud-vs-local inference
  - modeling break-even for a fixed-cost inference investment (local GPU / Mac Mini) vs per-token cloud
allowed-tools: Read, Write
---

# AI unit economics — every feature use costs money

Classic SaaS has near-zero marginal cost: once the code is written, the
millionth user costs almost nothing to serve. **AI products break this
assumption.** Every query, every feature use, every agent loop spends
real tokens that scale linearly (or worse) with usage. Margin is no
longer managed per-account at signup — it is managed **per-query, every
single time the feature fires.**

If a PM cannot state the fully-loaded cost of one AI action and the
revenue that covers it, the product does not have a business model — it
has a demo with a credit card attached to an LLM API.

This skill is the AI extension of `cost-model` (general initiative cost)
and `pricing-models` (how you charge). It models the thing those two do
not: **per-query variable cost and its margin consequences.**

## 1. The core equation

```
gross margin per query = revenue per query − fully-loaded cost per query
```

A product is viable only if this is positive **across the realistic
usage distribution**, not just at the median. Power users sit in the
right tail and can be margin-negative while the average looks fine.

## 2. Cost-per-action math (the part teams get wrong)

The naive estimate uses only raw token price:

```
naive cost = (input_tokens × input_price) + (output_tokens × output_price)
```

The honest estimate adds **orchestration overhead — typically 30–60%**
on top — because a real AI action is rarely one clean call:

```
fully-loaded cost per action =
    Σ over all model calls in the action:
        (input_tokens × input_price + output_tokens × output_price)
  + embedding cost (vectorization of the query + any documents)
  + vector-DB / retrieval query cost
  + pre-processing (OCR, parsing, chunking) and post-processing (validation, reformat)
  + retry cost (failed calls, guardrail re-runs, schema-repair passes)
  + fixed infra amortized per action (serving, queue, storage)
```

Worked numbers (illustrative; verify current prices before quoting):

| Component | Tokens / unit | Unit price | Cost |
|---|---|---|---|
| LLM input | 1,200 tok | $0.10 / M (Flash-Lite class) | $0.00012 |
| LLM output | 200 tok | $0.40 / M | $0.00008 |
| Embedding | 300 tok | $0.02 / M | $0.000006 |
| Vector query | 1 query | amortized | $0.00001 |
| **Subtotal** | | | **~$0.00022** |
| **+45% orchestration** | | | **~$0.00032 / action** |

The orchestration multiplier is the single most-skipped line. A team
that quotes $0.00012 is off by 2–3× before the feature even ships.

## 3. The margin reality check — estimate vs actual

Two cautionary data points worth remembering:

- A SaaS team priced an AI copilot at **$15/user/mo**, estimated **$3/user**
  of LLM cost (planning 80% gross margin). Month-one actual landed at
  **$4.20/user** — a 14-point margin miss — because power users ran the
  feature far more than the median assumption.
- **Notion** disclosed a roughly **10-point gross-margin decline** from
  embedding AI into the product. AI does not arrive margin-neutral.

The lesson: **estimate from the usage distribution, not the median user,
and instrument actual per-user cost from day one.** The gap between
forecast and actual is where AI businesses quietly bleed.

## 4. The "token cost illusion"

API prices have fallen sharply (roughly ~80% across 2025, e.g. a flagship
model's input price dropping from ~$5 to ~$2.50 per million tokens). It is
tempting to assume margins fix themselves over time. **They do not**,
because the same period saw the rise of agentic and iterative flows that
consume **far more tokens per task** — multi-step reasoning, tool loops,
re-tries, large retrieved contexts. Cheaper tokens × many more tokens can
leave you flat or worse. Never model margin on falling unit price while
simultaneously adding token-hungry loops.

## 5. The cost levers (ranked by typical leverage)

| Lever | Mechanism | Typical saving | Trade-off |
|---|---|---|---|
| **Deterministic pre-filter** | Handle the easy cases with rules/cache before any LLM call | 50–90% of calls eliminated | Coverage limited to known patterns |
| **Model tiering / routing** | Small cheap model for easy inputs, large model only for hard ones | 40–80% on routed share | Routing logic + a misroute quality risk |
| **Caching** | Exact-match and semantic cache of prior answers | High for repeated queries | Staleness; cache-invalidation discipline |
| **Prompt compression** | Trim system prompt + retrieved context to what's needed | 10–40% input tokens | Over-trimming hurts quality |
| **Batching** | Group requests; many providers price batch ~50% off | ~50% on batchable, latency-tolerant work | Not for real-time UX |
| **Local / fixed-cost inference** | Move inference to owned hardware: variable per-token → fixed monthly | Approaches $0 marginal at scale | Capex + ops + utilization risk (see §7) |

Levers compound: a deterministic pre-filter that drops 70% of calls,
plus routing the remaining 30% so only 10% hits the large model, can cut
fully-loaded cost by an order of magnitude versus "send everything to the
big model."

## 6. Price-to-usage alignment

Flat subscription + variable per-query cost = **margin risk from power
users** (the right tail eats the profit of the median). Mitigations, in
rough order of how cleanly they align cost to revenue:

- **Usage-based pricing** — charge per query / per action; cost and
  revenue move together (cleanest, but friction for consumers).
- **Per-feature metering / credits** — meter the expensive AI features,
  keep cheap stuff flat.
- **Caps / fair-use limits** — flat price up to N actions, then throttle
  or charge.
- **Tier the model by plan** — free/cheap tiers get the small model;
  premium gets the large one (aligns cost to willingness-to-pay).

See `pricing-models` for the packaging mechanics; this skill supplies the
**cost floor** every pricing decision must clear.

## 7. Break-even: cloud per-token vs fixed-cost local inference

When inference moves to owned hardware, the question becomes a classic
fixed-vs-variable break-even:

```
break-even volume (actions/month) = monthly_fixed_cost / cloud_cost_per_action

  where monthly_fixed_cost = amortized hardware + power + maintenance + ops
```

Above break-even volume, local wins; below it, you are paying for idle
silicon. Always sanity-check **utilization** — fixed cost only pays off
if the hardware is actually busy. A local engine that sits idle 90% of
the time is more expensive per action than cloud.

## 8. Worked example — Acme per categorized transaction

Acme's architecture is a **unit-economics strategy disguised as
infrastructure.** Walk the decision hierarchy (instructions.md §6) as a
cost cascade:

| Gate | What handles it | Marginal cost / txn | Share of volume (illustrative) |
|---|---|---|---|
| 1. Exact-match DB lookup | Postgres query | ~$0 | ~45% |
| 2. Regex / pattern match | In-process rules | ~$0 | ~20% |
| 3. Vector embedding (local ChromaDB) | Local embedding + cosine | ~$0 marginal (fixed local) | ~20% |
| 4–5. LLM fallback (local Ollama, qwen2.5-coder:14b) | Local GPU inference | ~$0 marginal (fixed local) | ~15% |

The genius of the design: **the long tail that would normally cost the
most (the LLM calls) runs on a fixed-cost local Mac Mini, not per-token
cloud.** The PM's job with this skill is to make the cost arbitrage
explicit and defensible.

**Counterfactual cloud cost.** Suppose Acme instead sent that 15%
LLM-tail to a cloud model like Gemini Flash-Lite. Per categorized
transaction routed to the LLM, with a ~1,500-token bucket-list prompt and
a ~50-token category answer, fully loaded with ~45% orchestration:

```
raw    ≈ (1,500 × $0.10/M) + (50 × $0.40/M) ≈ $0.00015 + $0.00002 = $0.00017
loaded ≈ $0.00017 × 1.45 ≈ ~$0.00025 per LLM-routed transaction
```

At **1,000,000 transactions/month** with 15% hitting the LLM = 150,000
LLM calls:

```
cloud LLM cost avoided ≈ 150,000 × $0.00025 ≈ ~$37 / month
```

That is the cloud cost the local engine **avoids per million
transactions** — modest at this volume, which is itself the finding:
**at low-to-moderate volume the Mac Mini is not justified by cost savings
alone** (≈$37/mo of avoided cloud spend cannot pay for hardware + power +
ops, which run far higher). The fixed-cost local engine wins on
**privacy, control, and the absence of per-token cloud risk as token use
grows** — not on early-stage dollar savings. Per §7, the break-even
arrives only as the LLM-tail volume climbs. **This is exactly the kind of
honest finding the skill exists to surface** — it stops a strategy doc
from claiming "local inference saves us a fortune" when at current volume
it does not.

**Gross-margin framing.** If Acme monetizes at, say, ₹199/mo premium,
the per-user fully-loaded categorization cost (mostly amortized local
infra, near-zero cloud) is a tiny fraction of revenue — a structurally
healthy AI margin **because the architecture pushed 85% of volume to ~$0
marginal cost.** The deterministic gates are not just a latency
optimization; they are the margin.

## 9. When to use vs when NOT to

**Use when:**
- Pricing or repricing any feature that calls an LLM at usage time.
- A strategy claims an AI feature is cheap, a moat, or margin-neutral.
- Choosing model tiers, caching, batching, or cloud-vs-local inference.
- Power-user / right-tail cost is plausibly margin-threatening.

**Do NOT use (or down-weight) when:**
- The AI cost is a one-time or build-time cost (a model trained once,
  content generated once and cached forever) — that is a `cost-model`
  capex question, not per-query unit economics.
- The feature is pre-revenue exploratory and cost is rounding error at
  current volume — note the future cliff, don't over-model it now.
- The decision is purely about *what to charge* with cost already known
  — that is `pricing-models`. This skill sets the floor, not the price.

## 10. Pitfalls

1. **Estimating from raw token price only** — skipping the 30–60%
   orchestration overhead (embeddings, retrieval, retries,
   pre/post-processing). The most common and most expensive error.
2. **Modeling the median user, ignoring the right tail** — power users
   in a flat-price plan can be individually margin-negative while the
   average looks healthy. Always model the usage distribution.
3. **Assuming "software = near-zero marginal cost"** — the classic SaaS
   reflex applied to AI. Every query costs money, forever.
4. **Trusting falling token prices to fix margin** — the token-cost
   illusion; agentic/iterative flows add tokens faster than prices fall.
5. **Flat pricing with uncapped usage** — no cap, no metering, no
   model-tiering by plan = unbounded margin risk.
6. **Local-inference cargo-culting** — assuming owned hardware is
   "free" without checking utilization and break-even volume (§7).
7. **Forecast never reconciled to actual** — not instrumenting real
   per-user cost from day one, so the Notion-style margin decline is
   discovered in the quarterly, not the dashboard.

## 11. Ethical boundary

Unit economics must never be optimized in ways that **degrade the user's
financial reality without disclosure.** Routing a user's transaction to a
cheaper, less-accurate model to protect margin is acceptable *only* if
accuracy stays above the product's stated floor and the user is never
silently given worse results on something that matters (their money,
their health, their legal standing). "Cheaper for us" can never quietly
become "wrong for them." When a cost lever trades accuracy for margin,
that trade is a product decision with a disclosure obligation — not a
silent infra tweak. See `responsible-ai-guardrails` for the accuracy
floor and `ai-ux-patterns` for surfacing degraded/low-confidence results.

## 12. Cross-links

- **`cost-model`** — general initiative cost; this is its per-query AI extension.
- **`pricing-models`** — how you charge; this skill is the cost floor underneath the price.
- **`ai-use-case-scoping`** — decides whether the AI feature should exist; pairs with cost to kill negative-margin ideas early.
- **`ai-evals`** — quality measurement; the accuracy floor a cost lever must not breach.
- **`responsible-ai-guardrails`** — the safety floor that cost levers cannot trade away.
- **`ai-ux-patterns`** — how degraded/cheaper-model results are honestly surfaced.

## 13. References

- Drivetrain — "Unit Economics for AI SaaS: managing token-based costs and margins" — https://www.drivetrain.ai/post/unit-economics-of-ai-saas-companies-cfo-guide-for-managing-token-based-costs-and-margins
- Cycles — "AI Agent Unit Economics: Cost per Conversation / per User / Margin" — https://runcycles.io/blog/ai-agent-unit-economics-cost-per-conversation-per-user-margin
- CloudZero — "Inference Cost Explained" — https://www.cloudzero.com/blog/inference-cost/
- Artefact — "Is AI really getting cheaper? The token cost illusion" — https://www.artefact.com/blog/is-ai-really-getting-cheaper-the-token-cost-illusion/

## 14. The honesty filter

If a margin claim cannot survive being recomputed across the *usage
distribution* — not the median — it is marketing, not analysis. If the
cost-per-action math omits orchestration overhead, it is wrong by 2–3×.
And if "local inference saves money" is asserted without a break-even
volume and a utilization check, it is a hope, not a number. great-pm's AI
cost claims must be the kind that survive a CFO's five minutes.

<!-- provenance: great-pm-original 2026-05-29; grounded in cited sources (Drivetrain, Cycles, CloudZero, Artefact). -->
