# Data Card — <dataset name>

> Per Gebru et al. (2018) "Datasheets for Datasets". Documents a dataset
> used for training, fine-tuning, or evaluation. Authored by data-strategist.

**Dataset name:** <name>
**Version:** <e.g. v1.2-2026-05-22>
**Owner:** <team / individual>
**Last updated:** <YYYY-MM-DD>
**Use:** training | fine-tuning | evaluation | RAG corpus

---

## 1. Motivation

- **Purpose**: <why this dataset was created>
- **Funded by**: <if applicable>
- **Created by**: <person / team / vendor>

## 2. Composition

- **What does an instance represent?** <e.g. "one transaction string + ground-truth category">
- **How many instances?** <count>
- **Coverage**:
  - Time range: <start → end>
  - Geographic coverage: <regions>
  - Language coverage: <languages>
  - Demographic coverage (where applicable + permissible): <groups>
- **Per-class counts** (for classification):
  | Class | Count | % |
  |---|---|---|
  | <class> | <N> | <%> |

- **Splits**: train / val / test ratio: <e.g. 70/15/15>
- **Real vs synthetic**: <ratio; synthetic explicitly flagged>

## 3. Collection process

- **How collected?** <method>
- **Sources**: <named sources>
- **Sampling**: <random / stratified / convenience>
- **Time of collection**: <when>
- **Who collected it**: <internal / vendor / crowd>

## 4. Preprocessing / cleaning

- **Cleaning steps applied**: <list, with rationale>
- **Records dropped + why**: <count + categories>
- **Anonymization applied**: <yes / no, method>
- **Saved raw data?** <yes / no, where stored>

## 5. Labeling

- **Labelers**: <internal / vendor / crowd>
- **Guidelines**: <link to rubric>
- **Inter-rater agreement**: <Cohen's kappa or equivalent>
- **Quality audits**: <cadence + results>

## 6. Privacy + consent

- **Personal data included?** <yes / no — types>
- **Consent basis** (per applicable law):
  - GDPR lawful basis: <consent / contract / LI / etc.>
  - DPDP consent: <if Indian data>
  - HIPAA (if PHI): <Authorization / de-identified>
  - COPPA (if minor data): <VPC obtained>
- **PII scrubbing applied**: <yes / no, method>
- **De-identification per Safe Harbor or Expert Determination**: <if applicable>

## 7. Distribution + usage

- **Internal-use only?** <yes / no>
- **Vendor licenses?** <if data is licensed>
- **Restrictions on use**: <e.g. "may not train models for X">
- **Data sharing agreements**: <list>

## 8. Maintenance

- **Refresh cadence**: <e.g. quarterly>
- **Trigger for re-collection**: <conditions>
- **Update lifecycle**: <how new versions are released>
- **Retention period**: <X years; deletion procedure>
- **Audit trail**: <where stored>

## 9. Limitations + known biases

- **Demographic imbalances**: <honestly named>
- **Coverage gaps**: <what's missing>
- **Quality variation**: <which subsets are higher / lower quality>
- **Recommended uses**: <what this dataset is good for>
- **NOT-recommended uses**: <what it shouldn't be used for>

## 10. Ethical considerations

- **Harm risks**: <what could go wrong>
- **Stakeholder consultation**: <who was consulted in collection>
- **Compensation** (for human labelers): <fair rate; transparency>

## 11. Changelog

| Version | Date | Change | Approver |
|---|---|---|---|
| v1.0 | <YYYY-MM-DD> | Initial | <name> |

---

> This card is reviewed quarterly. Material data shifts trigger a new version.
> Linked to model-card-<slug>.md (the model trained on this dataset).
