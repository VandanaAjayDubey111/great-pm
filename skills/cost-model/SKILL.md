---
name: cost-model
description: Standardized cost-estimation framework for great-pm initiatives. Forces explicit LLM cost (across great-pm pipelines), human-equivalent comparison, infra delta, and time-to-ship. Output is parsable by /pm-burn and /pm-cost. great-pm version covers PM-side cost.
when_to_use: |
  Apply when:
  - /pm-cost is invoked to estimate a proposed initiative's cost
  - /pm-burn is invoked to show great-pm's burn rate vs human-equivalent
  - ai-product-strategist drafts a strategy with a cost claim
  - ai-cost-optimizer authors a cost plan
  - any great-pm report claims a savings ratio — must show methodology
allowed-tools: Read, Write
---

# Cost model — make great-pm cost claims defensible

great-pm reports cost numbers on the board (via /pm-cost, /pm-burn,
/pm-digest). Those numbers MUST be auditable. The classic mistake: a
shiny "1000× human equivalent" claim that doesn't survive scrutiny.
This skill defines the format and the discipline.

## The 4-line cost section

Every great-pm initiative's cost section follows this exact template:

```markdown
## Cost estimate

**LLM**: $<low>–<high> (<N> agent invocations × $<per-call avg>)
**Human equiv**: $<low>–<high> (<hours> × $<rate>/h)
**Infra delta**: $<low>–<high>/month
**Time to ship**: <hours> agent-time, <hours/days> wall-clock

> Methodology: <one-sentence rationale for each range>
```

### Why this exact format?

Board parsers anchor on **line-start** "LLM" and "Human" labels. Mid-line
references are ignored. Stick to the template — drift breaks the board.

## How to estimate each line

### LLM cost

For each great-pm agent that runs in the initiative, estimate:
- **Prompt tokens** = system prompt + injected context (PROJECT.md +
  brain.md tail + HANDOFF.md, per SubagentStart hook) + agent-specific input
- **Completion tokens** = typical output for that agent type

Quick reference for the **`opus` alias** — great-pm's default model, which
always resolves to the newest Opus (Opus 4.8 at time of writing):
**$5/M input, $25/M output** (verified 2026-07-21 against Anthropic's price
sheet — re-verify at each model release; the alias tracks new Opus versions
automatically but pricing can change).

| Agent | Typical prompt | Typical output | Per-call cost |
|---|---|---|---|
| pm-lead | 12k | 1.2k | ~$0.09 |
| pm-reviewer | 14k | 1.5k | ~$0.11 |
| user-researcher | 10k | 1.5k | ~$0.09 |
| product-strategist | 12k | 2.0k | ~$0.11 |
| spec-writer | 12k | 3.0k | ~$0.14 |
| metrics-architect | 10k | 1.5k | ~$0.09 |
| analytics-analyst | 14k | 2.0k | ~$0.12 |
| AI-PM specialists (avg) | 12k | 2.0k | ~$0.11 |
| archetype reviewer (avg) | 14k | 1.8k | ~$0.12 |
| query-refiner-pm | 4k | 0.4k | ~$0.03 |

For **claude-haiku-4-5** (lighter agents, $1/M in, $5/M out), divide by ~5.

Sum across the agents that actually fire for the initiative. Use
PROJECT.md → archetype → which agents apply.

### Human equiv

The human cost to do the SAME PM work without agents. "If I hired a
senior PM to do this, how long would it take, at what rate?"

| Role | Hourly rate |
|---|---|
| Junior PM | $80–120/hour |
| Senior PM | $150–220/hour |
| Principal / staff PM | $250–350/hour |
| Domain specialist (compliance, ML, fintech) | $250–450/hour |

**Estimate hours conservatively.** A discovery brief great-pm produces in
15 min might take a senior PM 4–8 hours (interviews, synthesis, write-up).
A pricing plan great-pm drafts in 20 min might take a pricing consultant
20–40 hours of work spread over 2 weeks.

### Infra delta

Only count what's **new** for this initiative. Examples:
- New event tracking in product analytics → cost of analytics platform incremental usage
- New AI inference for a feature → tied to ai-cost-optimizer's per-action cost
- New monitoring dashboards → typically noise (don't list)
- New domain (e.g. compliance audit) → if it triggers a new pen-test or
  SOC2 review cost, list it

If it's < $50/month of incremental infra, write "infra delta: ~$0".

### Time to ship

Two numbers — both useful:

- **Agent-time**: wall-clock of LLM calls in aggregate. Typically
  30 min – 4 hours across a full initiative loop.
- **Wall-clock**: actual elapsed including human gates. Typically days
  to weeks because of `gate:strategy` / `gate:spec` / `gate:launch`
  approval waits.

## Sanity check before writing

Before committing the section, verify:

```
ratio = human_equiv / llm_cost
```

If `ratio > 3000`, something is wrong. (Threshold recalibrated 2026-07-21:
earlier drafts used 3x-inflated Opus pricing; at the correct $5/$25 the same
honest work legitimately shows ~3x higher ratios.) Common bugs:

| Bug | How to detect | Fix |
|---|---|---|
| Wrong unit ($ vs ¢) | LLM cost looks impossibly small | Convert: tokens / 1M × price |
| Counting time-saved as cost | Used "PM time saved" not "PM cost to do it" | Use cost of DOING it, not value of skipping |
| Single-call vs full-initiative | Costed one agent invocation, not the whole loop | Sum across agents that actually fire |
| Forecast vs actual mixed | Confusing pre-launch forecast with realized cost | Label clearly; separate sections if both |

**Plausible range**: 150× to 1,500× human equivalent is real at current
Opus pricing. Beyond 1,500×, double-check the methodology.

## Initiative-level cost gate (for high-burn initiatives)

For initiatives projected to cost > $50 of great-pm LLM spend, open a
cost-aware gate. Use the template:

```markdown
## /pm-cost forecast

| Stage | Agents fired | LLM cost | Human equiv |
|---|---|---|---|
| Discover | user-researcher + feedback-synth + market-analyst | $X | $Y |
| Strategize | product-strategist + pm-reviewer | $X | $Y |
| Prioritize | prioritization-analyst (+ tradeoff-arbiter) | $X | $Y |
| Define | spec-writer + spec-reviewer + metrics-architect | $X | $Y |
| Launch | launch-manager + gtm-strategist | $X | $Y |
| Measure | analytics-analyst + experiment-designer | $X | $Y |
| **Total** | | **$<sum>** | **$<sum>** |

Recommended cap per initiative loop: $<cap>
Cap-breach trigger: pause loop; route to human for approval.
```

## Anti-patterns

❌ **Round-number theatre.** "$1 LLM | $10,000 human" — looks
suspicious. Use realistic ranges: "$0.80–2.40 | $450–900".

❌ **Single point estimates.** Always a range. Single numbers hide
uncertainty.

❌ **No methodology line.** Numbers without rationale are unverifiable.

❌ **Hand-waved infra.** "Some cost" is not a number. Either give $,
or "infra: ~$0".

❌ **Inflated savings ratio.** A 5000× claim makes the whole report
look like marketing. Stick to defensible math.

❌ **Counting agent calls you didn't actually make.** Cost forecasts
should reflect agents that ACTUALLY fire, not all agents in the roster.

## Example — good

```markdown
## Cost estimate

**LLM**: $0.60–1.20 (full Discover→Strategy loop, ~8 agent calls @ $0.08–0.15)
**Human equiv**: $1,200–2,400 (8–16h × $150/h, senior PM)
**Infra delta**: ~$0 (uses existing Beads + great-pm; no new infra)
**Time to ship**: ~35min agent-time, ~3 days wall-clock (2 human gates)

> Methodology: 8 calls = user-researcher + feedback-synth + market-analyst
> + product-strategist + prioritization-analyst + pm-reviewer + spec-writer
> + spec-reviewer. Per-call cost from the Opus quick reference above. Human
> equivalent benchmarked against a 1-FTE senior PM doing equivalent
> discovery+strategy+spec work over 1 week.
```

Ratio = 1800 / 1.2 = **1,500×**. High but defensible at current Opus pricing — the math is shown.

## When great-pm agents consume this skill

| Agent / command | What it pulls |
|---|---|
| ai-cost-optimizer | Per-call reference; pipeline summation |
| /pm-cost | Format + methodology guidance |
| /pm-burn | Cost tracking + savings ratio rules |
| ai-product-strategist | Cost-as-strategic-input (when modeling moat) |
| harness-engineer-pm | Audit when claims look implausibly high |

## References

- engineering's cost-model skill (engineering-side; this is the PM parallel)
- Anthropic Opus pricing via the `opus` alias (re-verify at each release)
- Standard PM-rate benchmarks: levels.fyi, RippleMatch, PM salary surveys

## The honesty filter

If your cost claim says "1000× cheaper" without showing the math, it's
marketing. If your math survives 5 minutes of scrutiny, it's analysis.
great-pm's credibility depends on the latter.
