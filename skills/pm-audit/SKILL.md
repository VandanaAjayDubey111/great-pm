---
name: pm-audit
description: Playbook for auditing PM-health across 15 dimensions (Discovery, Strategy, Prioritization, Roadmap, Specs, Metrics, Launch, Measure, Comms, Decisions, Pricing, Competitive, Feedback, AI-PM, Governance) and producing a structured report. The brain behind pm-auditor.
when_to_use: |
  Use when running /pm-audit on a product, an initiative, or the whole great-pm
  setup. The rubric is also useful for any agent reviewing PM maturity
  generally.
allowed-tools: Read, Write, Glob, Grep, WebFetch, WebSearch, Bash
---

# PM-Audit — the 15-dimension rubric

Assess PM maturity honestly. False alarms are not insights. A clean "this is
healthy" verdict is a real outcome.

## Severity scale

| | Meaning |
|---|---|
| 🟥 **Critical** | Actively breaks product quality, security, or commitments. Fix now. |
| 🟧 **High** | Material gap that compounds — fix this cycle. |
| 🟨 **Medium** | Worth fixing but not blocking. Quick-win or scheduled. |
| 🟦 **Info** | Context for the founder. No action required. |

Reserve 🟥 for genuine emergencies — misuse poisons future audits.

## PM-maturity fingerprint — set the stage FIRST

| Stage | Markers |
|---|---|
| **Discovery** | No PMF yet; pre-paid users; multiple pivots in play. PRDs and tight metrics are inappropriate now. |
| **Pre-PMF** | Some paid users / strong intent; product still finding its shape. Lightweight PRDs OK. |
| **Scaling** | PMF reached; growth pressure. Full PRDs, A/B tests, OKRs expected. |
| **Optimization** | Mature product. Heavy metrics, tight launch hygiene, ADR discipline. |

Set the stage FIRST. Then judge dimensions against that stage's expectations.
A "no PRDs" finding is 🟦 in Discovery but 🟧 in Scaling. Severity is
stage-relative.

## The 15 dimensions

### 1. Discovery
- Real user interviews documented? When was the last one?
- JTBD named (job + trigger + current alternative)?
- Problem validated or assumed?
- Personas based on data or imagination?

🟥 Building without ever talking to a user. 🟧 No interviews in 3+ months at
Scaling. 🟨 JTBD undocumented. 🟦 Light at Discovery stage.

### 2. Strategy
- Vision in one honest sentence?
- Differentiation thesis is structural (not a feature list)?
- 2–3 multi-quarter bets named?
- Build-vs-buy direction stated?

🟥 No strategy at Scaling+. 🟧 Strategy that says "everything to everyone".
🟨 Differentiation is a feature list. 🟦 Strategy in flux at Discovery.

### 3. Prioritization
- Scoring method used (RICE / ICE / Kano / WSJF / etc.)?
- Inputs to scores sourced (data) or guessed (assumption)?
- Ranked backlog exists?

🟧 Backlog ordered by gut. 🟨 Mixed sourced/guessed without labels. 🟦
Method-light at Discovery.

### 4. Roadmap
- Now / Next / Later structure?
- OKRs tied to strategy?
- Themes (not just feature lists)?
- Capacity check done?

🟧 Overstuffed "Now" with no capacity reality. 🟨 OKRs without measurable
KRs ("increase delight"). 🟦 Roadmap fluid at Discovery.

### 5. Specs / PRDs
- For shipped features, do PRDs exist?
- Non-goals listed? Acceptance criteria testable?

🟧 Major features shipped without a spec. 🟨 PRDs exist but have TBDs / vague
adjectives. 🟦 Light at Discovery.

### 6. Metrics
- North Star defined and tied to a strategy bet?
- Leading + lagging KPIs?
- Events instrumented and verified firing?
- Success thresholds set as NUMBERS (not "improve")?

🟥 No instrumentation in a Scaling product. 🟧 No North Star. 🟧 Thresholds
are aspirations, not numbers. 🟨 Some KPIs missing.

### 7. Launch
- Phased rollouts or big-bang?
- Rollback criteria as specific signals (numbers)?
- Beta cohorts with feedback loops?

🟥 No rollback path for a high-traffic feature. 🟧 Big-bang launches with no
canary. 🟨 Beta cohort without a feedback channel.

### 8. Measure / Learn
- Post-launch read-outs happening?
- Funnels + retention cohorts reviewed?
- NPS verbatims read (not just scores)?

🟧 Ship-and-forget pattern. 🟨 Read-out happens but no next-Discover
questions surfaced.

### 9. Stakeholder comms
- Regular exec / team / investor updates?
- Same facts in every framing (not different facts)?

🟧 Long silences between updates. 🟨 Updates skip risks. 🟦 Solo founder
context allows lighter cadence.

### 10. Decision history
- ADR / decision log / lessons.md present?
- Critical calls have a written rationale?

🟧 Architectural decisions made invisibly. 🟨 No log of why things were
chosen.

### 11. Pricing
- Model documented (subscription / usage / freemium / one-time / hybrid)?
- Willingness-to-pay rationale cites a method (not just a number)?

🟧 No pricing model defined post-PMF. 🟨 WTP is a guess unlabelled as one.
🟦 Pricing TBD at Discovery.

### 12. Competitive
- Recent teardown of competitors?
- Market sized with a stated method?

🟨 No teardown in 6+ months. 🟨 Market size cited without method. 🟦 Light
at Discovery.

### 13. Feedback intake
- Support / review / survey channels exist?
- Themes synthesized regularly?

🟧 Feedback pile unread. 🟨 Themes identified but no action loop.

### 14. AI-PM (if `ai_pm_pack: true`)

Six additional sub-dimensions:
- Eval set defined, with golden examples?
- Reliability guardrails (hallucination mitigation, grounding)?
- Cost-per-inference tracked?
- Hallucination rate measured?
- Responsible-AI audit (bias, EU AI Act if applicable)?
- Human-in-the-loop design — confidence thresholds, escalation, review queues?

🟥 Shipping an AI feature with no evals. 🟧 No hallucination rate measured.
🟧 No cost-per-inference tracking. 🟨 Eval set thin.

### 15. Governance
- Critical-decision review cadence?
- Gates honoured (pm-reviewer's verdict travels to the human)?
- Read-only audits run regularly?

🟧 Gates routinely passed without pm-reviewer attention. 🟨 No quarterly
strategy review.

## Output sections — every audit has all of these

1. **Executive summary** (1 paragraph).
2. **PM-maturity fingerprint** (the stage).
3. **15-dimension status table** (🟩 / 🟨 / 🟧 / 🟥 per dimension).
4. **Findings** sorted by severity, each with source + fix + cost.
5. **Top 5 if-you-fix-nothing-else** — genuinely top 5, not "everything is top".
6. **Quick wins** — each under 1 hour.
7. **Things-that-look-bad-but-fine** — honest false-positive list. Trust-builder.
8. **Open questions for the founder** — unknowns only they can answer.
9. **Remediation plan** — concrete next steps (filed as Beads tasks unless
   `--read-only`).

## Anti-patterns — never do these

- Inflating severity to sound impactful.
- Padding sections with manufactured concerns.
- Judging Discovery-stage products against Scaling-stage expectations.
- Inventing findings without a source.
- Skipping the "things-look-bad-but-fine" section (it's the trust-builder).
- Re-doing PM work in the audit (you assess; you do not replace).

## Output shape

The report uses `templates/PM-AUDIT-template.md`. Fill it; do not invent your
own structure. Consistency across audits matters more than creativity.
