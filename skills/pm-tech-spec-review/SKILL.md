---
name: pm-tech-spec-review
description: Review an engineering technical spec through a PM lens — does it cover every PRD requirement, does it preserve user/UX intent, does it quietly add or drop scope, what are the product risks, what's missing for launch. Produces a priority-tagged findings list + clarifying questions for engineering. Use after eng drafts a tech spec / design doc / architecture proposal and before code lands.
when_to_use: |
  Use when an engineering spec, design doc, API shape, or architecture proposal
  exists and needs a product-intent check BEFORE implementation. This is NOT a
  code review and NOT a mechanical PRD-clarity check — it audits whether the
  technical plan still delivers what the PRD promised the user. Primarily for the
  spec-reviewer agent; complements prd-authoring (which checks the PRD itself).
allowed-tools: Read, Write
---

# PM-lens Technical Spec Review

Engineers write specs to answer "how do we build it?" A PM-lens review answers a
different question the spec rarely asks itself: **"does this build still deliver
what we promised the user, all of it, and nothing we didn't agree to?"** This sits
between PRD sign-off and implementation — the cheapest place to catch a scope
drift or a lost requirement.

This is distinct from:
- **Code review** (does the code work / is it well-built) — that's `code-reviewer`.
- **PRD clarity check** (is the PRD itself complete/testable) — that's `prd-authoring` / spec-reviewer's mechanical pass.
- This skill: **does the engineering plan honour the PRD's product intent.**

## Inputs

- The technical spec / design doc / architecture proposal / API shape.
- The original PRD or requirements it claims to implement.
- The success metrics the feature is meant to move (if defined).

## The review lenses

Run the spec against each lens. Every finding gets a **priority tag**:
`P0` (blocks build — a requirement is lost or intent is broken), `P1` (must
resolve before launch), `P2` (worth raising, not blocking).

**1. Requirements coverage matrix**
Walk every PRD requirement / acceptance criterion. For each, mark:
`covered` / `partially covered` / `missing` / `can't tell from spec`. Missing or
partial coverage of a stated requirement is a P0. Produce the matrix explicitly —
this is the heart of the review.

**2. Scope drift — additions**
Does the spec build things the PRD didn't ask for? "Scope creep" disguised as
engineering thoroughness. Each addition is at least P1 — it costs time the launch
may not have. Name it and ask whether it's in or out.

**3. Scope drift — silent reductions**
Does the spec quietly narrow a requirement? ("PRD says all banks; spec handles 3.")
The most dangerous finding because it's invisible until a user hits it. P0 if it
breaks a stated acceptance criterion.

**4. UX / product-intent preservation**
Does the technical approach degrade the experience the PRD specified? E.g. a sync
flow the PRD wanted made async without a loading state; an instant action made
multi-step; an error path that dead-ends. Map each to the affected PRD flow.

**5. Edge cases & failure modes**
Does the spec handle the failure modes the PRD's user would hit — empty states,
errors, partial data, the unhappy paths? Missing failure handling for a primary
flow is P1.

**6. Data / privacy / trust implications**
Does the spec introduce data handling, retention, or third-party calls the PRD's
privacy posture didn't account for? For a privacy-positioned product this is P0.

**7. Metric instrumentation**
Can the success metrics actually be measured given this design? If the spec
doesn't emit the events the metrics need, the feature ships blind. P1.

**8. Launch-readiness flags**
Dependencies, migrations, rollout/rollback story, review/submission timelines
(e.g. app-store review) implied by the spec that the PM needs to plan around.

## Output shape

```
SUMMARY: [one paragraph — does this spec deliver the PRD's intent? overall verdict]

COVERAGE MATRIX:
| PRD requirement | Spec coverage | Note |
|---|---|---|
| … | covered / partial / missing | … |

FINDINGS (priority-tagged):
- [P0] [lens] [finding] → [what to change / decide]
- [P1] …
- [P2] …

QUESTIONS FOR ENGINEERING:
- [the things the spec doesn't let you judge — ask, don't assume]

SCOPE LEDGER:
- Added vs PRD: [list] → [keep / cut decision needed]
- Reduced vs PRD: [list] → [accept / restore decision needed]
```

## Governance

This skill PROPOSES findings; it does not approve or block on its own authority.
The findings go to the human + engineering to resolve. Frame findings as
questions and trade-offs, not verdicts — the engineer often has context the spec
didn't capture (see `receiving-code-review` discipline: verify, don't assume the
spec is wrong).

## Relationship to other great-pm skills

- Reads the PRD produced via `prd-authoring`.
- Hands launch-readiness flags to `launch-readiness`.
- Trade-off framing borrows from `tradeoff-arbiter`.
