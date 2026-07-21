---
name: prioritization-methods
description: Playbook for 12 proven prioritization methods. Helps prioritization-analyst pick the right method for the decision at hand — not the most familiar. Covers RICE, ICE, MoSCoW, Kano, Weighted Scoring, Value-vs-Effort, WSJF / Cost of Delay, Opportunity Solution Trees, Story Mapping, Impact Mapping, Buy-a-Feature, Eisenhower.
when_to_use: |
  Use when ranking candidate work, choosing a scoring method, or sanity-
  checking a prioritization call. Primarily for the prioritization-analyst
  agent.
allowed-tools: Read, Write
---

# Prioritization Methods — playbook

No single method fits every decision. The first job is picking the right
method; the second is applying it honestly with sourced inputs.

## Choosing a method

Match the method to the decision shape:

| Decision shape | Use |
|---|---|
| Compare many features by value | RICE, ICE, Weighted Scoring |
| Customer satisfaction / delight | Kano |
| Must-have vs nice-to-have for a release | MoSCoW |
| Time-pressured / Agile flow | WSJF / Cost of Delay |
| Solving a known user outcome | Opportunity Solution Trees |
| Map a user journey end-to-end | Story Mapping |
| Tie features to outcomes & actors | Impact Mapping |
| Stakeholder priorities, fixed budget | Buy-a-Feature |
| Quick task triage | Eisenhower |
| Trade off value vs effort visually | Value-vs-Effort matrix |

## 1. RICE
**Score = Reach x Impact x Confidence / Effort.**
- Reach: people / period affected. Source: analytics or honest estimate.
- Impact: 0.25 / 0.5 / 1 / 2 / 3 (minimal → massive).
- Confidence: 0–100% — how sure are you of the other inputs?
- Effort: person-months.
**Use** for comparing many features.
**Limit**: tempting to fudge Confidence to justify the favourite.

## 2. ICE
**Score = Impact x Confidence x Ease.** Each 1–10.
**Use** for a quick first pass.
**Limit**: less rigorous than RICE; do not use for the final call.

## 3. MoSCoW
**Must-have, Should-have, Could-have, Won't-have.**
**Use** for deciding what is IN a release vs out.
**Limit**: easy to declare everything Must-have — requires discipline.

## 4. Kano Model
Categorize features: Must-be, Performance, Attractive (delighter), Indifferent.
Run a Kano survey for honest categorization.
**Use** when deciding which delighters earn investment and which Must-bes are
table-stakes.
**Limit**: requires real user input; do not Kano-categorize from gut.

## 5. Weighted Scoring
Pick 3-6 criteria (Strategic fit, Customer value, Effort, Risk, etc.), weight
each, score every item, sum.
**Use** when criteria are clear and trade-offs are subtle.
**Limit**: weight choice = political choice — be explicit about why each
weight is what it is.

## 6. Value-vs-Effort matrix
2x2: Quick wins (high V, low E), Big bets (high V, high E), Fill-ins (low V,
low E), Time-sinks (low V, high E). Do Quick wins first, schedule Big bets,
avoid Time-sinks.
**Use** for visual triage with a small team.
**Limit**: subjective unless V and E are scored.

## 7. WSJF / Cost of Delay
**WSJF = Cost of Delay / Job Size.**
Cost of Delay = Business Value + Time Criticality + Risk Reduction.
**Use** in agile flow / SAFe / time-pressured calls.
**Limit**: easy to inflate Time Criticality; require evidence.

## 8. Opportunity Solution Tree
Outcome → Opportunities (user pains) → Solutions → Experiments. Keeps
solutions tied to outcomes; allows many candidate solutions per opportunity.
**Use** for continuous-discovery contexts (Teresa Torres).
**Limit**: needs ongoing user research to stay honest.
**Full playbook**: see the `opportunity-solution-tree` skill (Opportunity Score
= Importance × (1 − Satisfaction), 4-level build process). Owned by user-researcher.

## 9. Story Mapping
Map the user journey horizontally (steps); break each step into stories
vertically (variants). Slice horizontally for the MVP.
**Use** when a release touches multiple user-journey steps.
**Limit**: needs a real, observed journey — do not story-map without one.

## 10. Impact Mapping
Goal → Actors → Impacts (behaviour changes) → Deliverables.
**Use** to ensure every deliverable changes a real actor's behaviour.
**Limit**: requires clear actors and behaviour goals.
**Full playbook**: see the `impact-mapping` skill (Gojko Adzic — per-branch
assumption + confidence + cost annotation, anti-patterns). Owned by product-strategist.

## 11. Buy-a-Feature
Give stakeholders a fixed "budget" of points; they spend points on the
features they want.
**Use** in stakeholder workshops, B2B customer prioritization.
**Limit**: biased by who is in the room.

## 12. Eisenhower matrix
Urgent vs Important. Do (urgent + important), Decide (important not urgent),
Delegate (urgent not important), Delete (neither).
**Use** for quick task triage.
**Limit**: too coarse for feature prioritization.

## Honesty rules — apply to any method
- Every input cites a source or is labelled an assumption.
- Confidence / weight choices are explicit — no hidden weights.
- "We cannot rank these honestly without X more data" is an acceptable output.
- The chosen method is justified — not "the one I always use."

## Output shape
A ranked backlog showing: chosen method + justification; every item with
scored inputs and their sources; cut lines (top / mid / low / killed); items
tied back to strategy bets where applicable.
