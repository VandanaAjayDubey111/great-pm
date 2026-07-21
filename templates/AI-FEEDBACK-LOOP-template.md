# AI Feedback Loop — <product / feature>

> Design doc for the user-correction → model-improvement loop. Authored
> by ai-feedback-loop-designer. The compound-interest engine of the AI
> product.

**Owner:** <name>
**Date:** <YYYY-MM-DD>
**Status:** DRAFT | APPROVED | LIVE

---

## 1. The moment of correction

Be specific. When and how does a user correct the model?

- **Trigger**: <e.g. "user taps 'change category' on a transaction">
- **UX flow**: <step-by-step what user sees + does>
- **Estimated frequency**: <X corrections / user / month>
- **Time-to-correct (typical)**: <seconds; affects signal classification>

## 2. Signal capture event

Hand to metrics-architect for inclusion in metrics plan.

```
Event: ai_correction_made
Properties:
  - model_version
  - prediction_id (joins to original prediction)
  - predicted_value
  - corrected_value
  - raw_input (anonymized if needed)
  - user_id (or hash, per privacy)
  - latency_to_correction (ms — how long between prediction shown and user correcting)
  - session_context_size
  - product_surface (which screen)
  - confidence_at_prediction
  - timestamp
```

## 3. Signal classifier — real vs noise

### Real-correction signals (training-eligible candidates)
- Correction within <5 seconds of seeing prediction (immediate, decisive).
- Same correction applied >2 times by same user.
- Correction "sticks": no further changes within 7 days.

### Noise signals (exclude from training)
- Correction made and reversed within 60 seconds.
- First-day-of-use corrections (user still learning the product).
- Corrections from known-noisy users (high churn of recategorizations).
- Bulk corrections (mass apply suggests user adapting rules, not labels).

### Boundary cases (flag for human review)
- Correction with high latency (>30s): user thought about it
- Correction that contradicts the user's previous correction for similar input

## 4. Aggregation thresholds

Per pattern (e.g. "merchant string X → category Y"):
- **Training-eligible when**:
  - ≥ <N=3> distinct users have made the same correction
  - Time span: ≥ <2 weeks> (not a flash-in-the-pan)
  - No reversal pattern emerging

Per user:
- **Cap contributions**: ≤ <50> per user per month
  (prevents power-user bias)
- **Geographic balance**: minimum <3> distinct regions in training data

## 5. Re-training trigger

### Scheduled
- Quarterly minimum
- Monthly if domain is fast-moving

### On-demand
- Drift detected by mlops-pm (eval-plan regression > 3% week-over-week)
- Volume threshold: ≥ <N> new training-eligible corrections
- High-priority pattern detected (e.g. new fraud signature in finance)

## 6. Champion-challenger verification

> Before retrained model deploys.

```
1. Eval challenger on full eval-plan suite.
2. Compare to current champion:
   - Quality ≥ champion on EVERY subgroup slice (not just average)
   - Cost ≤ 1.2 × champion (no silent cost regression)
   - Latency p99 ≤ 1.2 × champion
   - Safety metrics within bands
3. If all pass → deploy via canary (1% → 10% → 100%).
4. If any subgroup regresses → reject; surface to data-strategist + ai-ethics-pm.
5. If specific failure mode emerges → ai-safety-pm reviews; might require
   targeted training data, not just more data.
```

## 7. Privacy bridge

> The boundary between user correction and training-data eligibility.

### Default (most restrictive)
- All corrections are local-only — improve the user's own personalization.
- No cross-user training without explicit consent OR de-identification.

### Cross-user training (when permitted)
- Per data-strategist's data-strategy.
- User consent surfaced clearly.
- De-identification meets standards (Safe Harbor / Expert Determination
  / DPDP / GDPR per applicable regime).
- Audit trail per training-data row.

### Sensitive patterns (extra care)
- Health, finance, education, employment data: stricter consent.
- Anonymization may not be sufficient — review with ai-ethics-pm.

## 8. Closing the loop — verification

Quarterly check:
- **Did the loop actually improve quality?**
  - Eval-plan score cycle over cycle.
  - User-correction rate per segment trending DOWN over time.
- **Are subgroups improving evenly?** (Per ai-ethics-pm.)
- **Are we collecting the right signals?**
  - Coverage gaps: where do users NOT correct (because they don't notice
    or don't care)?

## 9. UX patterns that maximize correction quality

- **One-tap correct**: friction kills the loop.
- **Acknowledge correction**: "Thanks. Future suggestions will improve."
- **Don't ask "are you sure"**: trust the user; reversal handles mistakes.
- **Don't punish correction with re-onboarding tutorials**.
- **Periodic celebration**: "You've corrected 12 categories — your
  classifications are 8% more accurate than baseline."

## 10. Failure modes to design for

- **Adversarial correction**: user maliciously labels wrong. Aggregation
  threshold + per-user caps + outlier detection.
- **Drift in user behavior** (new categories emerge): re-training picks
  it up; surface to product team.
- **Over-fitting to power users**: per-user caps protect against this.
- **Cold-start for new users**: their first weeks aren't training-eligible
  but they get personalized quickly.

---

> Linked to: data-strategy-<slug>.md, eval-plan-<slug>.md,
> mlops-plan-<slug>.md, ai-safety-<slug>.md.
> Required reading for: any AI feature shipping to real users.
