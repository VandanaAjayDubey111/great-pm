---
name: circles-method
description: Lewis Lin's CIRCLES framework for structured product-design answers — Comprehend the situation, Identify the customer, Report customer needs, Cut through prioritization, List solutions, Evaluate trade-offs, Summarize the recommendation. Use when answering a "design a product/feature for X" question, structuring a product-sense decision, or making sure a design proposal didn't skip the customer or the prioritization step.
when_to_use: |
  Use when a design challenge is open-ended ("how would you design X?") and needs
  a complete, defensible structure rather than jumping to a solution. Primarily
  for the prioritization-analyst agent; complements prioritization-methods (CIRCLES'
  "Cut" step is where a prioritization method plugs in).
allowed-tools: Read, Write
---

# CIRCLES Method

A 7-step framework (Lewis C. Lin, *Decode and Conquer*) for answering product-
design questions completely instead of jumping to a solution. The discipline is
that you do not propose solutions until after you've understood the situation,
named a specific customer, and prioritized their needs.

CIRCLES = **C**omprehend · **I**dentify · **R**eport · **C**ut · **L**ist ·
**E**valuate · **S**ummarize.

## The seven steps

**C — Comprehend the situation**
Clarify the question before answering. What is the product/feature? Who's asking
and why now? What are the constraints (platform, timeline, business model)? What's
the goal — growth, revenue, retention, a new segment? State assumptions explicitly.
The classic mistake is answering a question you weren't asked.

**I — Identify the customer**
Pick a specific customer segment. Not "everyone" — a named persona with a context.
If multiple segments exist, list them, then choose ONE to design for this pass and
say why (size, strategic value, acuteness of pain).

**R — Report customer needs**
For the chosen customer, enumerate their needs / jobs / pain points. Frame as the
customer's goals, not features. Use user stories: "As a [customer], I want to
[need] so that [outcome]." Aim for 5-7; group related ones.

**C — Cut through / prioritize**
You can't build everything. Prioritize the needs against an explicit criterion —
goal-impact, reach, strategic fit, effort. *This is where a prioritization method
plugs in* (see `prioritization-methods`: RICE, value-vs-effort, etc.). Pick the
top 1-3 needs to address and state the criterion you used.

**L — List solutions**
For the prioritized needs, brainstorm solutions — at least 3, ideally divergent
(a minimal one, an ambitious one, a left-field one). Don't anchor on the first
idea. Describe each in a sentence or two.

**E — Evaluate trade-offs**
For each solution, weigh pros vs cons against axes that matter here: user value,
engineering effort, revenue impact, time-to-market, strategic risk, reversibility.
A small comparison table works well. Make the trade-offs visible, not hidden.

**S — Summarize / recommend**
State the recommendation crisply: which solution, for which need, for which
customer, and why it wins on the trade-offs. Tie it back to the goal from step C.
Name the metric you'd watch and the biggest assumption you'd validate first.

## Output shape

```
COMPREHEND: [restated question + goal + constraints + assumptions]
IDENTIFY:   [chosen segment + why this one]
REPORT:     [5-7 prioritizable needs as user stories]
CUT:        [top 1-3 needs + the prioritization criterion used]
LIST:       [≥3 candidate solutions, divergent]
EVALUATE:   [trade-off table: solution × {value, effort, risk, …}]
SUMMARIZE:  [the recommendation + success metric + riskiest assumption]
```

## Anti-patterns to call out

- **Skipping Comprehend** → answering the wrong question. Always clarify first.
- **"Everyone" as the customer** → no real design target. Force a segment.
- **Needs written as features** → "add dark mode" is a solution; the need is the
  goal behind it.
- **One solution only** → no trade-off to evaluate. Force ≥3 divergent options.
- **No prioritization criterion** → "Cut" becomes arbitrary. Name the criterion.
- **Recommendation untethered from the goal** → loop back to step C.

## Relationship to other great-pm skills

- The **Cut** step delegates to `prioritization-methods` for the scoring method.
- For the **Identify/Report** steps, `user-research` and `value-proposition-canvas`
  sharpen the segment and its needs.
- For **Evaluate**, `tradeoff-arbiter`'s lens (real cost of each option) applies.

## Further reading

- Lewis C. Lin, *Decode and Conquer: Answers to Product Management Interviews*
