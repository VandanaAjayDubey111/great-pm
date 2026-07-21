# AI Risk Register — <product / initiative>

> Tracked AI-specific risks. Living document. Owned by ai-safety-pm +
> ai-ethics-pm + harness-engineer-pm. Reviewed monthly.

**Owner:** ai-safety-pm
**Last reviewed:** <YYYY-MM-DD>
**Cadence:** monthly

---

## How to use this register

- Each risk gets a row.
- **Status**: OPEN | MITIGATED | ACCEPTED | RETIRED
- **Severity**: Critical | High | Medium | Low
- **Likelihood**: 1 (rare) → 5 (frequent)
- **Score**: severity × likelihood, used for prioritization.
- Review monthly. Don't let rows go stale.

---

## Active risks

| # | Risk | Category | Severity | Likelihood | Score | Mitigation | Status | Owner | Review date |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hallucinated category at scale → user trust collapse | Quality | High | 3 | 12 | Confidence threshold + one-tap correct + monitoring | OPEN | ai-safety-pm | <date> |
| 2 | Model provider raises prices 3× | Cost | Medium | 2 | 6 | Multi-provider routing; track quarterly | OPEN | ai-cost-optimizer | <date> |
| 3 | Subgroup quality gap (Tamil < Hindi) | Fairness | High | 4 | 16 | Source more Tamil training data; per-slice eval | OPEN | ai-ethics-pm | <date> |
| 4 | Single-sponsor-bank exit | Strategic | Critical | 1 | 5 | Identify backup sponsor; due diligence | OPEN | fintech-pm | <date> |
| 5 | DPDP "Significant Data Fiduciary" designation triggers new obligations | Compliance | Medium | 3 | 9 | Monitor designation criteria; legal review | OPEN | data-strategist | <date> |
| 6 | PII in production logs | Privacy | High | 2 | 8 | Log scrubbing; quarterly audit | MITIGATED | data-strategist | <date> |
| 7 | Adversarial prompt injection bypasses categorizer | Security | High | 2 | 8 | Input filter + LLM-judge fallback | OPEN | ai-security-reviewer | <date> |

---

## Risk categories

- **Quality**: model performance regression, hallucination, drift
- **Safety**: jailbreak, PII leak, harmful output
- **Fairness**: subgroup disparate impact, bias
- **Cost**: provider price changes, runaway inference, cache failure
- **Compliance**: regulatory change, audit failure, breach notification
- **Strategic**: vendor concentration, commoditization, competitive
- **Operational**: monitoring gap, on-call gap, rollback gap
- **Privacy**: PHI/PII leak, consent breach, cross-tenant data
- **Reputation**: viral failure, demo gap, trust erosion

---

## Retired risks (kept for audit)

| # | Risk | Retired | Reason |
|---|---|---|---|
| R1 | Model deprecation by vendor | 2026-04-12 | Switched to multi-provider |
| R2 | <…> | <…> | <…> |

---

## Monthly review checklist

- [ ] Every OPEN risk has been reviewed this month
- [ ] New risks added if discovered
- [ ] Mitigations updated based on new evidence
- [ ] Scores recalibrated if severity / likelihood changed
- [ ] Retired risks moved to retired section
- [ ] Top-3 risks summarized for stakeholder update

---

## Top-3 escalation

This month's top-3 by score:

1. **<risk>** (score X) — <one-line on action this month>
2. **<risk>** (score X) — <one-line on action this month>
3. **<risk>** (score X) — <one-line on action this month>

---

## Stakeholder summary (for monthly digest)

<One paragraph; surfaces to stakeholder-comms for the monthly update.>

---

> Linked to: ai-safety-<slug>.md, ai-ethics-<slug>.md, mlops-plan-<slug>.md.
> This register is the source of truth for "what we know could go wrong".
> If a risk isn't in here and it materializes, the register itself is a
> harness bug — file with harness-engineer-pm.
