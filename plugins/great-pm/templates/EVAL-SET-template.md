# Eval Set Plan — <model / capability name>

> Authored by model-evaluator-pm. Defines what "good" means BEFORE the
> model is selected, prompted, or fine-tuned. The eval set + thresholds
> are the quality contract.

**Capability:** <as named in ai-strategy>
**Owner:** <name>
**Date:** <YYYY-MM-DD>
**Status:** DRAFT | APPROVED | LIVE

---

## 1. Task definition

> The task the model performs, in inputs and outputs. No fuzz.

- **Input format**: <exact schema, with examples>
- **Output format**: <exact schema, valid + invalid examples>
- **Out-of-scope inputs**: <explicitly listed; expected behavior on each>
- **Refusal expected when**: <conditions; expected refusal UX>

## 2. Golden truth set

| Property | Value |
|---|---|
| Size | <N examples (typically 100–500)> |
| Sampling strategy | <real-user-data / stratified / synthetic mix> |
| Coverage | <every category / class / segment named> |
| Refresh cadence | <quarterly recommended> |
| Refresh trigger | <on drift OR scheduled> |
| Storage | <path; access-controlled> |
| Authoring | <by whom; quality check process> |
| Inter-rater agreement (if multiple labelers) | <Cohen's kappa target ≥ 0.7> |

### Coverage matrix (example)

| Segment | N | Notes |
|---|---|---|
| Hindi merchants | 80 | All categories represented |
| Tamil merchants | 60 | Long-tail categories underrepresented; gap noted |
| UPI vs Card vs IMPS | 100 / 80 / 20 | Reflects production mix |
| Tier-1 / Tier-2 / Tier-3 cities | 100 / 100 / 50 | Tier-3 underrepresented (known gap) |

## 3. Edge cases

> Inputs that broke prior versions, ambiguous, boundary-condition.

| Edge case | Why it matters | Expected behavior |
|---|---|---|
| Empty input | UX edge | Refuse with help text |
| Max-length input (~10K tokens) | Token limit | Truncate; warn user |
| Mixed-language (Hinglish) | Common in India | Handle gracefully; don't refuse |
| Misspelled merchant name | Common | Fuzzy match; show confidence |
| Encrypted / garbled string | Bad data | Refuse + escalate to ops |

## 4. Adversarial set (OWASP LLM Top 10 baseline)

> Inputs designed to fail. Apply OWASP LLM Top 10 minimum.

| # | Adversarial category | N | Acceptable failure rate |
|---|---|---|---|
| 1 | Prompt injection (override system prompt) | 20 | 0 |
| 2 | Jailbreak (bypass refusal) | 20 | 0 |
| 3 | PII leakage attempts | 20 | 0 |
| 4 | Policy violation | 20 | 0 |
| 5 | Sensitive topic refusal | 20 | < 5% inappropriate response |
| 6 | Output overflow / formatting attack | 10 | 0 |
| 7 | Cross-user data confusion | 10 | 0 |
| 8 | RAG poisoning (if RAG) | 20 | 0 |

## 5. Metrics + thresholds

| Metric | Slice | Threshold | Block deploy if |
|---|---|---|---|
| Accuracy | overall | ≥ 92% | < 88% |
| Accuracy | per-language slice | ≥ 85% | < 80% |
| Subgroup accuracy gap | max(slice) − min(slice) | ≤ 5pts | > 8pts |
| Refusal rate | overall | 2–8% | < 1% or > 12% |
| Adversarial failure (set #1-4) | | 0 | any failure |
| Cost per request | | ≤ $X | > $X × 1.3 |
| p99 latency | | ≤ Y ms | > Y × 1.5 ms |

## 6. Regression rule (when to BLOCK a deploy)

A candidate model is BLOCKED from deploy if any of:
- Overall accuracy drops > 3% vs current champion
- Any subgroup accuracy drops > 5% vs current champion
- Any adversarial failure > 0 (from set #1-4)
- Cost per request increases > 30% without explicit approval
- Latency p99 increases > 50% without explicit approval

## 7. Subgroup slicing (mandatory for fairness)

> Hand to ai-ethics-pm for fairness analysis.

- **Language**: <list>
- **Geography**: <list>
- **User tenure cohort**: <D0 / D7-30 / D30+>
- **Other** (where legally appropriate): <list>

## 8. Run cadence

- **CI run**: every model PR
- **Scheduled full run**: weekly
- **On-demand**: before any production deploy

## 9. Storage + audit

- **Eval results stored**: <path>
- **Retention**: <duration>
- **Audit trail**: which model version evaluated on which eval-set
  version; who approved.

## 10. Owners

- **Eval-set authoring**: model-evaluator-pm + data-strategist
- **Pipeline implementation**: engineering / mlops-pm
- **Result review**: ai-ethics-pm (fairness), ai-product-strategist
  (overall quality), pm-reviewer (gate)

---

> Linked to: ai-strategy, data-strategy, model-card, prd.
> Required for: every AI-feature gate:spec promotion.
