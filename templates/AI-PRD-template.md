# AI PRD — <initiative name>

> AI-product PRD. Extends the standard PRD with model-card, eval-criteria,
> safety-envelope, and rollback sections. Authored by spec-writer with
> support from ai-product-strategist, model-evaluator-pm, ai-safety-pm,
> ai-cost-optimizer, and (for the model layer) prompt-engineer-pm.

**Owner:** <name>
**Date:** <YYYY-MM-DD>
**Status:** DRAFT | IN-REVIEW | APPROVED
**Linked:** strategy / data-strategy / eval-plan / ai-safety / cost-plan / rollback

---

## 1. Problem

<What user problem this PRD addresses. One paragraph.>

## 2. Why now

<Why this matters now and not 6 months ago or 6 months later.>

## 3. Users + JTBD

- **Primary user**: <who, with role>
- **Secondary user**: <who>
- **Jobs to be done**: <one-line per JTBD>

## 4. AI capability claim (the bet)

> The claim that lets this feature work. Phrased so it can be falsified.

**Capability**: <e.g. "classify Indian merchant strings at ≥95% accuracy
across 22 vernaculars, ≥80% confidence at ≤200ms p99">

**Mechanism**: <why the model does this — not just "AI is good">

**Source**: pre-prompted base model | fine-tuned | RAG | agent | hybrid

**Fallback if capability fails**: <what user sees if model is wrong /
unavailable>

## 5. Solution overview

<3-5 paragraphs describing the experience. Include screenshots / wireframes.>

## 6. User stories with acceptance criteria

### Story 1: <one-line>
**As a** <user>, **I want to** <action>, **so that** <outcome>.

**Acceptance criteria**:
- [ ] <criterion>
- [ ] <criterion>

### Story 2: <one-line>
*<repeat>*

## 7. Scope (this release)

- <in-scope item>
- <in-scope item>

## 8. Non-goals

- <explicit non-goal>

## 9. Edge cases

- <edge case + expected behavior>
- <edge case + expected behavior>

## 10. AI-specific behaviors

### Confidence + refusal
- **Confidence shown to user**: <yes / no / per output>
- **Refusal threshold**: <below X% confidence → refuse>
- **Refusal UX copy**: "<exact text>"

### Citation / grounding
- **Required**: <yes / no, per output type>
- **Trust scoring**: <how sources are scored>
- **Behavior when no source meets threshold**: <refuse / proceed with disclaimer>

### Hallucination handling
- **Detection mechanism**: <see HALLUCINATION-PLAYBOOK>
- **User recovery path**: <how user fixes / overrides>

### Subgroup performance
- **Slicing**: <dimensions per ai-ethics-pm>
- **Per-slice quality bar**: <no slice below population − X%>

## 11. Required success metrics

- **North Star metric**: <name, unit, target>
- **Leading KPIs**: <list>
- **Lagging KPIs**: <list>
- **AI quality metric**: <name, target — per eval-plan>
- **AI cost metric**: <per-action $ budget — per ai-cost-plan>
- **AI safety metric**: <e.g. refusal rate within band, 0 PII leaks>

## 12. Definition of Done

- [ ] All user stories pass acceptance criteria
- [ ] Eval-plan suite passes per model-evaluator-pm's plan
- [ ] Cost stays within ai-cost-optimizer's envelope under launch load
- [ ] Safety plan (ai-safety-pm) verified in staging
- [ ] Rollback (ai-rollback-strategist) drill passed
- [ ] Subgroup fairness verified per ai-ethics-pm's plan
- [ ] Hallucination playbook integrated
- [ ] Tracking events specced (metrics-architect) firing in staging
- [ ] Docs updated (user-facing + internal runbook)
- [ ] No P0/P1 bugs open

## 13. Out-of-scope (won't do this release)

- <explicit deferred item with rationale>

## 14. Linked artefacts

- AI strategy: `.great-pm/drafts/ai-strategy-<slug>.md`
- Data strategy: `.great-pm/drafts/data-strategy-<slug>.md`
- Eval plan: `.great-pm/drafts/eval-plan-<slug>.md`
- Safety plan: `.great-pm/drafts/ai-safety-<slug>.md`
- Cost plan: `.great-pm/drafts/ai-cost-plan-<slug>.md`
- Rollback plan: `.great-pm/drafts/ai-rollback-<slug>.md`
- Model card: `.great-pm/drafts/model-card-<slug>.md`
- Feedback loop: `.great-pm/drafts/feedback-loop-<slug>.md`

---

> Reviewed by spec-reviewer (clarity / completeness / testability).
> Promoted to gate:spec via /pm-promote.
> Approved by human via /pm-gate approve <id>.
