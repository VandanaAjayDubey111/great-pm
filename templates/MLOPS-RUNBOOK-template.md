# MLOps Runbook — <product / model>

> Authored by mlops-pm. The operational handbook for monitoring, drift
> detection, rollback, and incident response on this AI product.

**Owner:** mlops-pm + on-call
**Last reviewed:** <YYYY-MM-DD>
**Status:** DRAFT | APPROVED | LIVE

---

## 1. What this runbook covers

- Deployment procedure
- Monitoring signals + thresholds
- Drift detection rules
- Alert tiers + escalation
- Rollback procedure
- Incident response

## 2. Deployment procedure

| Stage | Audience | Duration | Exit criteria |
|---|---|---|---|
| 1. Offline eval | none | hours | Full eval-plan passes |
| 2. Shadow | parallel to old | <days> | Quality ≥ old, cost ≤ 1.2× |
| 3. Canary 1% | random 1% of users | 24-48h | No guardrail breach |
| 4. Canary 10% | 10% | 2-3 days | No guardrail breach |
| 5. Canary 50% | 50% | 3-7 days | No guardrail breach |
| 6. GA | 100% | ongoing | — |

**Hard rules**:
- No advancement on weekends/holidays unless someone is actively on call.
- Each stage requires explicit sign-off (mlops-pm).
- Rollback ANY stage if guardrail breach (see Tier 1 below).

## 3. Monitoring signals

### Quality signals
| Signal | Baseline | Alert threshold | Tier |
|---|---|---|---|
| Sampled accuracy (LLM-judge) | <baseline> | -10% in 1h | 1 |
| Subgroup accuracy (per slice) | <per slice> | -5% in 24h | 2 |
| Refusal rate | <band> | outside band | 2 |

### Cost signals
| Signal | Baseline | Alert threshold | Tier |
|---|---|---|---|
| Tokens/user/day | <baseline> | +50% in 1h | 1 |
| Cache hit rate | <baseline> | -20% sustained | 2 |
| Routing distribution | <baseline> | +30% to expensive | 2 |

### Latency signals
| Signal | Baseline | Alert threshold | Tier |
|---|---|---|---|
| p50 | <baseline> | +50% | 2 |
| p99 | <baseline> | +100% | 1 |
| p99.9 | <baseline> | +200% | 2 |

### Safety signals
| Signal | Baseline | Alert threshold | Tier |
|---|---|---|---|
| PII-in-output rate | 0 | any | 1 |
| Jailbreak success rate | 0 | any | 1 |
| Refusal classifier failure | <band> | >2× band | 2 |

### Drift signals
| Signal | Baseline | Alert threshold | Tier |
|---|---|---|---|
| Input distribution shift (KL div) | <baseline> | >2σ | 2 |
| Output distribution shift | <baseline> | >2σ | 2 |
| Eval-plan regression (weekly run) | 0 | >3% | 2 |

## 4. Drift detection rules

### Re-eval triggers (re-run eval-plan suite)
- Weekly scheduled
- On any new model deploy
- When input distribution shifts > KL threshold

### Re-train triggers
- Eval-plan regression > 3% on any slice
- User-correction volume > <N> new training-eligible patterns
- Drift-detector signal sustained > 7 days

## 5. Alert tiers

### Tier 1 (P0) — rollback now, page on-call
- Safety event (PII leak, jailbreak success)
- Quality dropped > 10% in 1 hour
- Cost spike > 3× baseline in 1 hour
- p99 latency > 2× baseline sustained
- Provider 5xx > 50% for 5 minutes

### Tier 2 (P1) — investigate, possibly rollback
- Subgroup quality dropped > 5%
- Cost trending toward envelope ceiling
- Refusal rate doubled
- Drift detector firing
- Latency p50 up > 50%

### Tier 3 (P2) — track, decide next business day
- Eval regression > 1%
- Latency p99 up > 20%
- Single-slice quality drop < 5%

## 6. Authority chain

| Action | Who can authorize |
|---|---|
| Tier 1 rollback (Tier A — model version) | Any on-call engineer |
| Tier 1 rollback (Tier B — model swap) | On-call + manager notification |
| Tier 1 rollback (Tier C — non-AI fallback) | On-call + product manager approval |
| Tier 2 action | On-call + manager review |
| Tier 3 action | Weekly review |
| Re-train approval | data-strategist + product manager |
| Model selection change | ai-product-strategist + human |

## 7. Rollback procedure (per ai-rollback-strategist)

### Tier A: Hot-fallback (model version)
1. Confirm signal in observability (dashboards link: <URL>)
2. Run: <command / button>
3. Verify: latency + quality return to baseline within 5 min
4. Communicate: post in #alerts; create incident
5. Investigate: postmortem within 24h for P0

### Tier B: Cheap-model fallback
1. Toggle routing config (<URL>)
2. Verify: cost / latency return to acceptable
3. Notify users via in-product banner ("running in fast mode")

### Tier C: Non-AI fallback
1. Activate rule-based fallback (config flag)
2. Show user banner ("AI features temporarily unavailable")
3. Page incident commander

### Tier D: Graceful refuse
1. Last resort
2. Show clear error + manual path
3. Major incident; exec notification

## 8. Incident response

### First 5 minutes
- [ ] Confirm signal in dashboards
- [ ] Determine tier
- [ ] Initiate rollback if Tier 1
- [ ] Post in #alerts: "Investigating <issue>"
- [ ] Create incident ticket

### First 30 minutes
- [ ] Communicate to users if customer-impacting
- [ ] Escalate per authority chain
- [ ] Document timeline as you go

### Within 24-48h (postmortem)
- [ ] Blameless postmortem (template: <URL>)
- [ ] Root cause + contributing factors
- [ ] Detection gaps (what should have caught this earlier)
- [ ] Action items (env fixes per harness-engineer-pm principles)

## 9. Communication templates

### Internal (Slack #alerts)
```
🚨 P{0|1|2} — {brief description}
Started: {time}
Impact: {users / surfaces}
Action: {rollback / investigating / monitoring}
Owner: {name}
Updates: this thread
```

### External (status page / in-product)
```
We're investigating an issue affecting [feature]. We've reverted to
[fallback / previous version] while we investigate. Most users should
not be affected. Updates: status.{product}.com
```

## 10. Postmortem template

See: <link to postmortem template>

Key sections:
- What happened
- Timeline
- Detection (how + when caught)
- Response (what we did)
- Root cause
- Contributing factors
- Action items (each one is an environment fix, not a person fix)

## 11. Pre-launch drill checklist

Before any production launch:
- [ ] Tier A rollback drilled in staging → < 5 min RTO verified
- [ ] Tier B drilled → cheap model handles
- [ ] Tier C drilled → non-AI rules respond
- [ ] Tier D drilled → UX clear, not crashed
- [ ] Authority chain tested (right people get pinged)
- [ ] Postmortem template + war-room runbook reviewed

---

> Linked to: ai-rollback-<slug>.md, ai-cost-plan-<slug>.md,
> ai-safety-<slug>.md, eval-plan-<slug>.md.
> Required reading for: all on-call.
