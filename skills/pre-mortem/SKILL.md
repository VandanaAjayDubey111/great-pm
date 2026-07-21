---
name: pre-mortem
description: Imagine the initiative has already shipped and failed publicly — work backwards from the failure to identify the most likely product / PM causes BEFORE building. Forces concrete risk identification, not vague "what could go wrong" lists. Adapted from Gary Klein's MIT Sloan research; pairs with engineering's engineering-side pre-mortem.
when_to_use: |
  Apply BEFORE the build, at any of these moments:
  - ai-launch-strategist, before drafting the launch plan
  - product-strategist, after the strategy is drafted but before /pm-promote
  - pm-rfc author, when proposing a non-trivial product decision
  - harness-engineer-pm, when a class of mistake repeats
  - any time the initiative is irreversible OR has high blast radius
    (e.g. consequential AI decisions, monetary, healthcare, legal)
allowed-tools: Read, Write
---

# Pre-mortem — fail-it-before-you-build-it

A retrospective for a product / initiative that hasn't happened yet.
Surfaces real risks that "list every risk" prompts miss.

Originated in Gary Klein's research at MIT Sloan; standard now at AWS,
SpaceX, and ops-mature product teams. great-pm's PM-side version focuses
on product / launch / trust failures — not the engineering side
(which engineering's pre-mortem covers).

## The 5-step pre-mortem

### Step 1. Imagine you're 6 months in the future

The initiative shipped. It is a clear, public, painful failure. There's
a TechCrunch story. Users are tweeting screenshots. The team is in damage
control. Your investor / board is asking what went wrong.

### Step 2. Write the post-mortem headline

ONE sentence. Concrete. Specific. Name the failure mode by what it did
to users.

- ❌ Bad: "Adoption was lower than expected."
- ❌ Bad: "AI didn't work as well as we hoped."
- ✅ Good: "On 2026-09-14, Acme's categorizer mis-bucketed 18% of
  Tamil-language merchants as 'Other', and the support backlog grew to
  6,400 tickets before the bug was identified."
- ✅ Good: "By Q3 we'd lost the top 8 creators to a competitor offering
  10% take-rate — our 20% rate had been undefended."

The headline forces you to name the SPECIFIC failure mode.

### Step 3. List every individual reason this exact failure happened

Brainstorm 10–15 reasons. Be specific. Each item should reference:

- A real product surface, flow, or decision
- A real failure type (mis-spec, missed market signal, fragile
  assumption, dependency change, regulator action, competitor move)
- A real human factor (no one owned X, the team disagreed but shipped
  anyway, post-launch monitoring was absent)

**Reject hand-waves** like "we didn't talk to enough users." Replace with
"we didn't interview a single Tamil-speaking user before launching the
categorizer."

### Step 4. Rank by likelihood × severity

For each cause, score:

- **Likelihood**: 1–5 (1 = once-in-a-decade, 5 = monthly / very common)
- **Severity**: 1–5 (1 = cosmetic, 5 = trust collapse / regulatory
  consequence / business-ending)
- **Risk score**: likelihood × severity

Top 3 by risk score → these are your highest-priority mitigations BEFORE
launch.

### Step 5. For each top-3 cause, write a guardrail INTO the plan

Each guardrail is a concrete change to the plan / spec / launch:

- A specific test (eval-plan slice, user study, A/B)
- A feature flag / kill switch
- A monitoring signal with threshold (per mlops-pm)
- A rollback tier criterion (per ai-rollback-strategist)
- A pre-launch checklist item
- A trust-recovery scenario in launch plan

If a top-3 cause CANNOT be mitigated within the time/budget, escalate
explicitly: **"This plan accepts the risk of X with no mitigation."**
Surface to the human at gate:launch.

## Template — add to relevant doc

```markdown
## Pre-mortem

Six months from now, this initiative failed. Headline:

> <one-sentence specific failure headline>

### Top causes (likelihood × severity)

| Cause | L | S | Risk | Mitigation in plan |
|---|---|---|---|---|
| <specific cause> | 4 | 5 | 20 | <link to plan item: eval slice / guard / alert> |
| <specific cause> | 3 | 5 | 15 | <link> |
| <specific cause> | 4 | 3 | 12 | <link> |
| <specific cause> | 2 | 5 | 10 | <link> |
| <specific cause> | 3 | 3 | 9  | <link> |

### Accepted risks (no mitigation in this iteration)

- <risk> — accepted because <budget/scope reason>.
  Owner: <name>. Re-review at: <milestone>.

### Lessons that would have prevented this (link to lessons.md if present)

- <past lesson, if any>
```

## Common failure modes by PM archetype

Quick start — the most-common pre-mortem causes per archetype. Use these
to prime brainstorming. Not exhaustive.

| Archetype | Common failure modes |
|---|---|
| consumer-app | D7 retention cliff hidden by aggregate; viral mechanic that didn't fire; app-store review crash; push permission asked too early |
| b2b-saas | Activation event mis-defined; no expansion mechanic; churn concentrated in one segment unnoticed; PLG/sales-led incoherence |
| enterprise-saas | Security review failed at first POC; procurement timeline triple expected; reference customer in wrong tier; multi-tenant performance issue |
| marketplace | Cold-start never reached liquidity; leakage to direct after first transaction; T&S incident; one side outpaced the other |
| fintech | Jurisdictional license blocked launch; KYC tier mis-designed; chargeback rate triggered processor risk; partner-bank exit; UDAAP enforcement |
| healthcare | SaMD classification post-hoc; PHI in logs; clinical workflow rejection; reimbursement path broke; FDA action |
| edtech | Engagement up, outcomes flat; COPPA gap surfaced via complaint; district sales cycle missed; teacher abandonment |
| creator-platform | Top creators left; CSAM incident; take-rate raise broke trust; platform-risk lawsuit; safe-harbor at risk |
| AI-product (overlay) | Hallucination at scale; cost spike; subgroup quality gap; vendor model change; jailbreak success |

## Anti-patterns in pre-mortems

❌ **Vague risks.** "Users might not love it." Be specific: which segment,
on which surface, what behavior signals love-or-not.

❌ **Cosmic risks.** "What if AWS goes down" or "What if there's a
recession." Yes — but not actionable. Focus on what your team can
mitigate.

❌ **Defensive list.** Listing risks you've already mitigated to look
thorough. Only list risks the current plan does NOT yet address —
that's where the value is.

❌ **Skip the headline.** Without the specific headline, the team won't
believe the failure scenario is real, and mitigations stay generic.

❌ **Lone-author pre-mortem.** Best done with ≥3 people. Solo pre-mortems
miss what the author has blind spots about.

❌ **One-shot.** Pre-mortem at strategy stage AND at launch stage —
different things become visible at each.

## When to SKIP a pre-mortem

- **Trivial initiatives** (typo fixes, copy tweaks, small UI polish) —
  pre-mortem is overhead.
- **Pure reversible-in-an-hour changes** — risk well-bounded.
- **Bug fixes with one-line repro and small surface** — guardrails
  already exist.

## When to MANDATE a pre-mortem

- Any AI feature making consequential decisions (categorization,
  recommendation, decision-support with downstream effect).
- Any launch in a regulated context (fintech, healthcare, edtech-K12).
- Any pricing change that could break user trust (creator platforms,
  subscription).
- Any one-way-door decision (vendor lock-in, public commitment, data
  acquisition).

## When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| ai-launch-strategist | Headline framing for AI-specific failures; commodity-failure modes |
| product-strategist | Pre-launch failure scan before /pm-promote --gate=strategy |
| pm-rfc author | Forced specificity on the decision's downside |
| harness-engineer-pm | Convert recurring failure classes into harness fixes |
| any archetype reviewer | The "common failure modes" table is the priming material |

## References

- Gary Klein, "Performing a Project Premortem" (HBR, 2007)
- Daniel Kahneman, "Thinking, Fast and Slow" (premortem discussion)
- AWS internal practice ("working backwards")
- engineering's engineering-side pre-mortem (paired version)

## The honesty filter

If your pre-mortem produces a list of risks where the mitigation is
"we'll be careful" or "we'll watch closely" — you haven't done the
exercise. Either make mitigations concrete OR explicitly accept the
risk with the human at the gate.
