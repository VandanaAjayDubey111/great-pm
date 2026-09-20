# Model Card — <model name and version>

> Per Mitchell et al. (2019) "Model Cards for Model Reporting". Public-
> facing model documentation. Authored by model-evaluator-pm in
> coordination with ai-product-strategist and ai-ethics-pm.

**Model name:** <name>
**Version:** <semver or model-vendor version>
**Owner:** <team / individual>
**Last updated:** <YYYY-MM-DD>
**Status:** EVAL | CANARY | GA | DEPRECATED

---

## 1. Model details

- **Architecture**: <e.g. "Llama-3 8B + LoRA fine-tune", "Claude Sonnet 4.7 via API">
- **Training type**: <base | fine-tuned | RAG over base | agent>
- **Training data window** (if applicable): <date range>
- **License**: <model license + your derivative if applicable>
- **Hosting**: <vendor (Anthropic, OpenAI, Hugging Face) / self-hosted>
- **Versioning policy**: <semver semantics; what counts as breaking>

## 2. Intended use

**Primary intended uses:**
- <use 1>
- <use 2>

**Primary intended users:**
- <user type>

**Out-of-scope uses:**
- <explicit non-use 1>
- <explicit non-use 2>

> Out-of-scope statements are LOAD-BEARING. Misuse outside this list is
> documented; the model owner is not liable for those uses.

## 3. Factors

> Relevant factors for evaluation per Mitchell et al.

- **Demographic groups** (where legally/ethically appropriate):
- **Instrumentation**: <device, browser, channel>
- **Environment**: <production / staging>
- **Language**: <supported languages and version coverage>
- **Region**: <where evaluated; gaps named>

## 4. Metrics

### Quality metrics per relevant slice

| Slice | Metric | Score | Threshold | Pass? |
|---|---|---|---|---|
| Overall | <e.g. accuracy> | <X%> | <Y%> | ✓ |
| Language: Hindi | accuracy | <X%> | <Y%> | ✓ |
| Language: Tamil | accuracy | <X%> | <Y%> | ✗ |
| Region: Tier-3 cities | accuracy | <X%> | <Y%> | ✓ |
| Tenure: D0 | accuracy | <X%> | <Y%> | ✓ |

### Cost + latency

- **Cost per action**: <amount>
- **p50 latency**: <ms>
- **p99 latency**: <ms>

### Safety metrics

- **Refusal rate**: <baseline band>
- **PII-in-output rate**: <should be ~0>
- **Adversarial success rate (jailbreaks)**: <%>

## 5. Evaluation data

- **Golden truth set**: <size, sampling strategy, refresh cadence>
- **Edge cases**: <size, sources>
- **Adversarial set**: <size, per OWASP LLM Top 10>
- **Real vs synthetic**: <ratio; synthetic flagged where used>

> Source: linked to `.great-pm/drafts/eval-plan-<slug>.md`.

## 6. Training data

- **Sources**: <named sources>
- **Volume**: <rows / tokens>
- **Consent basis**: <per data-strategist's data-strategy>
- **Privacy boundaries**: <what's eligible / what's not>
- **Demographic balance**: <known imbalances stated>
- **Refresh cadence**: <e.g. quarterly>

> Detail: linked to `.great-pm/drafts/data-strategy-<slug>.md` and
> `.great-pm/drafts/data-card-<slug>.md`.

## 7. Ethical considerations

- **Known biases**: <where the model performs disparately and why>
- **Mitigations applied**: <data balancing, post-processing, etc.>
- **Residual risks**: <honest acknowledgment>
- **Fairness audit results**: <DI per slice, link to ai-ethics-pm output>
- **Misuse risks**: <how it could harm if used wrongly>
- **Transparency to users**: <what users are told about this model>

## 8. Caveats and recommendations

- **Known limitations**: <what the model can't do well>
- **Recommended human oversight**: <when, how>
- **Recommended monitoring**: <signals + thresholds — link to mlops-pm plan>
- **Update cadence**: <how often we retrain + why>
- **Sunset criteria**: <when this model should be deprecated>

## 9. Quantitative analysis (optional but recommended)

> Confusion matrix, calibration plot, fairness metrics. Public version
> may have summary; internal version has detail.

## 10. Changelog

| Version | Date | Change | Approver |
|---|---|---|---|
| 0.1 | <YYYY-MM-DD> | Initial card | <name> |
| 0.2 | <YYYY-MM-DD> | Updated language coverage; added Tamil | <name> |

---

> Public version of this card is published at: <URL>
> Internal version (with full quant analysis) at: `.great-pm/drafts/model-card-<slug>-internal.md`
