---
name: launch-readiness
description: Playbook for safe product launches — phased rollout strategies, beta cohort design, readiness checklists, rollback criteria, and post-launch watch periods. Used by launch-manager.
when_to_use: |
  Use when planning a launch — phased rollout, beta cohorts, readiness
  checklist, rollback criteria, watch period. Primarily for launch-manager.
allowed-tools: Read, Write
---

# Launch Readiness — playbook

A launch is a phased exposure, not a switch. Plan the cohorts, the gates,
and the rollback path before the first user sees the change.

## 1. Phased rollout — the four typical phases

1. **Internal** — team uses it on prod data, with full instrumentation.
2. **Beta cohort** — a curated, small group of real users (10–100).
3. **Canary** — a slice of the user base (1% → 10% → 50%).
4. **General availability (GA)** — all users.

Each phase has a **gate**. The gate is testable: "X is true OR pause."
Skipping a phase is fine if the risk is genuinely low — but say so out loud.

## 2. Beta cohort design

- **Who**: users who match the target audience AND will give feedback —
  heavy users, vocal users, design partners.
- **Size**: 10–100 typically. Below 10 is anecdotal; above 100 is hard to
  support.
- **Duration**: 1–4 weeks. Long enough to surface real usage; not so long
  users disengage.
- **Feedback loop**: a defined channel (a Slack room, a weekly call, an
  in-product survey). Without this it is just a small launch.
- **Exit criteria**: testable conditions to advance — usage frequency,
  satisfaction, defect rate, support volume.

## 3. Launch-readiness checklist — per phase

A readiness checklist is a list of **yes/no testable items**. Example for
internal → beta:

- [ ] All P0/P1 bugs from QA closed.
- [ ] Tracking events firing per the metrics plan (verified in staging).
- [ ] Onboarding flow tested end-to-end on a clean account.
- [ ] Support has the FAQ / runbook.
- [ ] Docs published for the new flow.
- [ ] Rollback procedure tested in staging.

"Feels ready" is not a checklist item.

## 4. Rollback criteria — be specific

A rollback plan that says "we'll roll back if it breaks" is not a plan.
Specific signals with thresholds:

- Error rate on the new flow > 1% over 5 minutes → rollback.
- North Star metric drops > 10% in 24h vs baseline → rollback.
- Support ticket volume > 3× normal for the affected area → rollback.
- A confirmed data-corruption incident → immediate rollback.

For each signal: who decides, how quickly, and the procedure. Test the
rollback procedure in staging before relying on it.

## 5. Post-launch watch period

Each phase has a **soak time** — how long it must be stable before advancing.
- Internal: a few days of real use.
- Beta: 1–2 weeks of normal usage.
- Canary 1%: 24–48h with no signal trip.
- Canary 10%: 2–3 days.
- Canary 50% → GA: 3–7 days.

Do not advance during a weekend or holiday unless someone is actively
watching.

## 6. Anti-patterns to avoid

- "Big bang" launches with no rollback path.
- Beta cohort with no feedback channel (it is just a small launch).
- Readiness checklists with non-testable items ("looks good", "feels right").
- Rollback "criteria" that are not specific signals.
- Advancing phases because the calendar says so, not because the signals do.
- No defined decision-maker for rollback — paralysis when it matters.

## 7. Output shape

A launch plan that shows: phased rollout with named phases and gates; beta
cohort spec; per-phase testable readiness checklists; specific rollback
criteria + procedure + decision-maker; per-phase watch period.
