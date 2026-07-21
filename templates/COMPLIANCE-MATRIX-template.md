# Compliance Matrix — <product>

> Maps product features → applicable regulations → status. Lives in repo,
> not in chat. Reviewed quarterly. Owned by data-strategist with input
> from relevant archetype reviewers.

**Product:** <name>
**Owner:** <name>
**Last reviewed:** <YYYY-MM-DD>
**Status:** DRAFT | REVIEWED | APPROVED

---

## How to use this matrix

- One row per feature (or per data flow if more granular needed).
- Columns: applicable regulations per jurisdiction.
- Cell value: APPLIES (red), PARTIAL (yellow), CONFIRMED COMPLIANT
  (green), N/A (gray).
- Each cell links to evidence (consent UX, audit log, BAA, etc.).
- Review quarterly minimum.

---

## Jurisdictional scope

- [ ] US (federal)
- [ ] US states: <list>
- [ ] EU
- [ ] UK
- [ ] India
- [ ] Other: <list>

---

## Feature × Regulation matrix

| Feature | DPDP (IN) | GDPR (EU) | CCPA / state (US) | HIPAA (US) | PCI-DSS | EU AI Act | Other |
|---|---|---|---|---|---|---|---|
| User signup + profile | APPLIES (link) | APPLIES (link) | APPLIES (link) | N/A | N/A | N/A | — |
| Transaction ingestion (Gmail) | APPLIES — read-only consent | APPLIES — contract basis | APPLIES — sensitive opt-in | N/A | N/A | N/A | — |
| AI categorization | APPLIES — sensitive | PARTIAL — Art. 22 | APPLIES — profiling opt-out | N/A | N/A | APPLIES (high-risk? assess) | — |
| Payment processing | N/A | APPLIES — PSD2 SCA | APPLIES | N/A | APPLIES — SAQ-A | N/A | — |
| User-correction → training | APPLIES — consent | APPLIES — explicit consent | APPLIES — sensitive opt-in | N/A | N/A | APPLIES — Article 22 | — |
| Aggregate analytics (de-identified) | APPLIES — DPDP de-id std | APPLIES — pseudonymized | APPLIES | (if PHI: SH or ED) | N/A | N/A | — |
| Support / customer service | APPLIES | APPLIES | APPLIES | (if PHI: BAA) | N/A | N/A | — |

---

## Per-cell evidence index

### DPDP (IN)
- User signup + profile: <link to consent UX>; <link to data-strategy section on DPDP>
- AI categorization: <link to sensitive-data flow>
- *(etc.)*

### GDPR (EU)
- User signup + profile: <link to consent UX>; <link to data-strategy>
- *(etc.)*

### CCPA / state (US)
- User signup + profile: <link to privacy notice>; <link to opt-out UX>
- *(etc.)*

---

## Vendor / subprocessor compliance

| Vendor | Service | DPA signed | BAA signed (if PHI) | SCCs (cross-border) | Notes |
|---|---|---|---|---|---|
| AWS | Hosting | ✓ | ✓ | ✓ | EU region for EU users |
| Anthropic | LLM inference | ✓ | ✓ | DPF + SCC | Multi-region |
| Sentry | Error tracking | ✓ | (PII scrubbed) | ✓ | — |
| <…> | <…> | | | | |

---

## Pending compliance work

| Item | Owner | Target date | Status |
|---|---|---|---|
| EU AI Act risk-tier formal assessment | ai-product-strategist | <date> | TODO |
| DPDP "Significant Data Fiduciary" monitoring | data-strategist | ongoing | TRACKING |
| Annual NYC LL 144 bias audit (if hiring AI) | ai-ethics-pm | <date> | N/A — not in scope |
| <…> | <…> | <date> | <…> |

---

## Audit log

| Date | Change | Approver |
|---|---|---|
| <YYYY-MM-DD> | Initial matrix | <name> |
| <YYYY-MM-DD> | Added DPDP rows after India launch | <name> |
| <YYYY-MM-DD> | Updated EU AI Act assessment | <name> |

---

## Recommendations from latest review

1. <one finding + proposed action>
2. <one finding + proposed action>
3. <one finding + proposed action>

---

> Quarterly review involves: data-strategist + relevant archetype
> reviewers (fintech-pm-reviewer, healthcare-pm-reviewer, etc.) +
> legal counsel.
> Linked from: ai-strategy, prd, data-strategy.
> A row missing means the matrix isn't done — not that the regulation
> doesn't apply.
