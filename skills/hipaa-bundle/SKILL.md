---
name: hipaa-bundle
description: Playbook for HIPAA compliance from a product perspective — PHI scope, Covered Entity vs Business Associate, BAA chain, Privacy Rule, Security Rule, Breach Notification, minimum necessary, de-identification.
when_to_use: |
  Use when an initiative handles US PHI (Protected Health Information) —
  patient apps, provider tools, EHR integrations, anything healthcare with
  identifiable health data. Primarily for healthcare-pm-reviewer, spec-writer,
  data-strategist, ai-safety-pm.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# HIPAA — product-side playbook

HIPAA is product-shaping, not just legal. It dictates architecture (BAA
chain), UX (minimum necessary), data handling (PHI definition), and
incident response (breach notification). PMs who treat HIPAA as legal-only
ship products that fail audit and lose enterprise deals.

## 1. Is the product in scope?

You're in scope if you handle **Protected Health Information (PHI)** —
which is INDIVIDUALLY IDENTIFIABLE health information held by a:

- **Covered Entity (CE)**: health plans, healthcare clearinghouses,
  healthcare providers conducting electronic transactions.
- **Business Associate (BA)**: anyone processing PHI on behalf of a CE.

**Common PM trap**: "we don't store PHI" — but your logs do. Or your
support tool. Or your analytics. PHI in any system means HIPAA in that
system.

## 2. What counts as PHI — the 18 identifiers

PHI = health info + ANY of these identifiers:

Names · geographic subdivisions smaller than state · dates (except year)
related to individual · phone · fax · email · SSN · medical record number
· health plan beneficiary number · account number · certificate/license
number · vehicle identifiers · device identifiers · URLs · IPs ·
biometrics · full-face photos · any other unique identifying number/code/
characteristic.

**De-identification**: removing all 18 identifiers per Safe Harbor, OR
expert determination of statistical de-identification (≤0.04 re-id risk).

## 3. The three rules

### Privacy Rule
- **Minimum necessary**: only use/disclose the PHI needed for the purpose.
- **Patient rights**: access, accounting of disclosures, amendments,
  restrictions.
- **Notice of Privacy Practices (NPP)**: required.

### Security Rule (45 CFR 164.308-318)
- **Administrative safeguards**: policies, training, access management.
- **Physical safeguards**: facility access, workstation security.
- **Technical safeguards**: access control (unique IDs), audit logs
  (immutable), integrity, transmission security (encryption).

### Breach Notification Rule
- **Patients notified** within 60 days.
- **HHS notified** within 60 days (or annually for <500 affected).
- **Media notified** if >500 affected in a state.

## 4. Business Associate Agreement (BAA) chain

Every entity touching PHI on your behalf needs a BAA. Examples:
- Cloud provider (AWS, GCP, Azure all offer BAAs)
- Email provider for transactional emails
- Analytics provider (most don't sign BAAs — find one that does)
- Customer-support tooling
- AI inference provider (OpenAI, Anthropic — both offer BAAs)
- Any subcontractor down the chain

**Subprocessor without a BAA = HIPAA violation.** Audit the full chain
at launch.

## 5. Architectural patterns that respect HIPAA

- **PHI compartmentalization**: keep PHI in a HIPAA-eligible environment
  (BAA-covered cloud account, encrypted at rest + in transit). Non-PHI
  in regular environment.
- **De-identified analytics**: aggregate counters, not row-level PHI.
- **Logs**: scrub PHI from logs or treat log storage as PHI storage
  (BAA-covered).
- **Email**: transactional emails about PHI go through a BAA-covered
  service (SendGrid, Mailgun, AWS SES all have BAA tiers).
- **AI inference**: route PHI to BAA-covered model providers only.

## 6. Audit log requirements

- **Immutable** (append-only).
- **Per-user, per-record access**.
- **Retain** at least 6 years.
- **Reviewable** by privacy officer.

**Common PM oversight**: existing internal logs are not "audit logs".
Audit logs are designed for HIPAA from the start.

## 7. The 6-year retention rule

HIPAA mandates 6 years for most records. Document retention policy
explicitly; build the deletion path.

## 8. Patient access right

- Patient can request copy of their PHI.
- 30 days to fulfill (60 with extension).
- Electronic format if they request it.
- Reasonable fee allowed (not punitive).

## 9. State law overlay — sometimes stricter than HIPAA

- **California Confidentiality of Medical Information Act (CMIA)**:
  stricter than HIPAA in some respects.
- **NY SHIELD Act**: data security overlay.
- **42 CFR Part 2**: substance-use disorder data — STRICTER than HIPAA;
  separate consent required for each disclosure.
- **Mental health data**: varies by state; often stricter.

**Don't assume HIPAA is the ceiling** — sometimes it's the floor.

## 10. PM checklist (apply when scope confirmed)

- [ ] PHI inventory (what, where, who accesses)
- [ ] BAA inventory (every subprocessor with a BAA signed)
- [ ] Minimum necessary review per UX surface
- [ ] Audit log specced (immutable, 6yr retention)
- [ ] Encryption: at rest AND in transit, current standards
- [ ] Access control: unique IDs, MFA, automatic logoff
- [ ] Incident response runbook (60-day notification clock)
- [ ] Privacy officer + security officer designated
- [ ] NPP drafted, reviewed by counsel
- [ ] Patient rights UX (access, amend, restrict, accounting)
- [ ] De-identification pipeline if using PHI for analytics/ML
- [ ] Training plan for all team members touching PHI
- [ ] Annual risk assessment scheduled

## 11. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| healthcare-pm-reviewer | The PHI screen + BAA chain + 6-year retention |
| data-strategist | PHI scope; minimum necessary; de-identification rules |
| ai-safety-pm | BAA chain for AI providers; PHI in logs |
| spec-writer | Patient access UX; audit log requirements |
| ai-product-strategist | HIPAA-eligible infra constraints |

## 12. References

- HHS HIPAA rules: hhs.gov/hipaa
- OCR enforcement actions: hhs.gov/hipaa/for-professionals/compliance-enforcement
- BAA template (from HHS): hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions
- 42 CFR Part 2: samhsa.gov

## 13. The honesty filter

If a healthcare product strategy says "HIPAA compliant" without naming
the PHI inventory + BAA chain + audit log architecture, it's not.
Demand the inventory.
