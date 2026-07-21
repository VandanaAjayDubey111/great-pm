# Launch Plan — <initiative>

> Authored by `launch-manager`. Per `skills/launch-readiness/SKILL.md`. Feeds `gate:launch`.

**Date:** <YYYY-MM-DD>

---

## Phased rollout

### Phase 1 — Internal
- **Audience:** team only, on prod data, full instrumentation
- **Duration:** <days>
- **Exit criteria (testable yes/no):**
  - [ ] All P0/P1 QA bugs closed
  - [ ] Tracking events firing per metrics plan (verified in staging)
  - [ ] Onboarding flow tested end-to-end on a clean account
  - [ ] Support team has FAQ / runbook
  - [ ] Docs published
  - [ ] Rollback procedure tested in staging

### Phase 2 — Beta cohort
- **Who:** <named cohort — heavy users / vocal users / design partners>
- **Size:** <10–100>
- **Duration:** <1–4 weeks>
- **Feedback channel:** <Slack room / weekly call / in-product survey>
- **Exit criteria:**
  - [ ] Usage frequency ≥ <target>
  - [ ] Satisfaction ≥ <target>
  - [ ] Defect rate < <target>
  - [ ] Support volume manageable

### Phase 3 — Canary
- Sequence: 1% → 10% → 50% (each with its soak time)

### Phase 4 — General Availability (GA)
- All users

## Rollback criteria — specific signals (numbers, NOT "if it breaks")

| Signal | Threshold | Decision-maker | Procedure |
|---|---|---|---|
| Error rate on new flow      | > 1% over 5 min      | <name> | <runbook ref> |
| North Star metric           | drops > 10% in 24h   | <name> | <runbook ref> |
| Support tickets             | > 3× normal          | <name> | <runbook ref> |
| Data corruption (any)       | confirmed            | <name> | immediate rollback |

## Watch period (soak time) per phase

| Phase | Soak | What to watch |
|---|---|---|
| Internal             | <days>      | <signals> |
| Beta                 | <1–2 weeks> | <signals> |
| Canary 1%            | 24–48h      | <signals> |
| Canary 10%           | 2–3 days    | <signals> |
| Canary 50% → GA      | 3–7 days    | <signals> |

> Do not advance during weekend/holiday unless someone is actively watching.

## Communication
- Team-side launch post: `stakeholder-comms`
- World-side launch announcement: `gtm-strategist`

---

> Verified: tracking from `metrics-architect`'s plan is firing in staging.
