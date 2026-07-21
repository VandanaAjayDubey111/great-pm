---
name: experiment-design
description: Playbook for trustworthy experiments — hypothesis framing, test types, sample size and power, statistical vs practical significance, stopping rules, and the traps (peeking, multiple comparisons, novelty effects). Used by experiment-designer.
when_to_use: |
  Use when designing an A/B test, multivariate test, holdout, or switchback;
  computing sample size; or deciding when a result is real. Primarily for
  experiment-designer.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Experiment Design — playbook

Experiments produce useful answers only when they are honestly designed.
Underpowered tests produce noise; peeking produces false positives;
guardrail-blind tests produce shipped regressions.

## 1. Hypothesis — one sentence with a mechanism

`If we do <change>, <primary metric> will move by <effect size> because <mechanism>.`

- The metric is real and pre-defined (it is in the metrics plan).
- The effect size is the MDE — the minimum effect that would matter for the
  business. Smaller MDE = bigger sample required.
- The mechanism is why this should work. If you cannot articulate the
  mechanism, the result will not generalise.

## 2. Test types — pick by what you can randomize

- **A/B test** — randomize users into control vs treatment. Default for
  feature changes.
- **Multivariate** — multiple variants at once (A/B/C/D). Beware: inflates
  multiple-comparison risk; correct alpha or use one decision metric.
- **Holdout** — keep a slice of users in pure control long-term, even after
  launch. Useful for measuring cumulative effect.
- **Switchback** — for marketplace / two-sided contexts where user-level
  randomization leaks. Alternate the treatment in time windows by region or
  segment.

If randomization is impossible (a regulator change, an architecture change
that touches everyone), do not pretend — declare it observational and label
the result co-movement, not effect.

## 3. Sample size & statistical power

A test that cannot detect the effect you care about is a noise generator.

- **Power** = probability of detecting a real effect. Default: 80%.
- **Alpha** = false-positive rate. Default: 5%.
- **MDE** (minimum detectable effect) = the smallest effect that would matter.
- **N** depends on baseline rate, MDE, power, alpha.

A simple rule of thumb (for binary metrics, two-arm test, 80% power, 5%
alpha): `N per arm ≈ 16 × p × (1−p) / MDE²` where p is the baseline rate.
Use a proper power calculator for non-trivial cases.

If the sample is unreachable in a reasonable window: shrink the MDE
honestly, segment more carefully, or accept that this question cannot be
answered by an experiment.

## 4. Statistical significance vs practical significance

- **Statistical significance** — p < alpha. Says the effect is unlikely to be
  random.
- **Practical significance** — the effect is big enough to matter.

A statistically significant 0.2% lift on a flagship metric is real but maybe
not worth shipping. State both.

## 5. Stopping rules — pre-register them, no peeking

Before you start, write down:
- Planned duration (calendar days).
- Planned sample size (per arm).
- Primary decision metric.
- Guardrail metrics (what must NOT regress).
- The rule for early stop (often: don't, unless sequential testing is
  pre-planned with corrected alpha).

**Peeking at unplanned interim results inflates the false-positive rate.**
If you must look early, use sequential testing methods (mSPRT, Bayesian
group-sequential) with explicit corrections.

## 6. Guardrails — what must NOT regress

For every experiment, name the metrics that must NOT get worse:
- Latency / performance.
- Error rate.
- Long-term retention (if the test is short).
- A core engagement signal in an adjacent area.

A "winning" primary metric with a broken guardrail is not a win — it is a
regression in disguise.

## 7. Common traps

- **Peeking** — looking at results before the planned end. Inflates false
  positives.
- **Multiple comparisons** — running 10 sub-metric tests, finding one
  "winner". Correct alpha (Bonferroni) or pre-register one decision metric.
- **Novelty effects** — early uplift fades as the new wears off. Run long
  enough; consider a long-hold cohort.
- **Survivorship** — looking only at users who completed the funnel.
- **Simpson's paradox** — aggregate result flips when segmented. Pre-declare
  the primary cut.
- **HARKing** — Hypothesising After the Results are Known. Frame the
  hypothesis BEFORE the test, in writing.

## 8. Output shape

An experiment plan: hypothesis (one sentence with mechanism), primary +
guardrail metrics, test type with justification, sample size from a power
calc, duration, pre-registered stopping rules, risks (novelty / seasonality /
network effects), and a read-out template to be filled at the end.
