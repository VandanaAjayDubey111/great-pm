---
name: eu-gdpr
description: Playbook for GDPR compliance from a product perspective — lawful basis, consent UX, DPIA triggers, Article 22 (automated decisions), DSARs, data residency, GDPR-K (children), DPO requirements.
when_to_use: |
  Use when an initiative serves EU customers OR processes EU resident data.
  Primarily for fintech-pm-reviewer, edtech-pm-reviewer (GDPR-K),
  data-strategist, ai-ethics-pm, spec-writer for consent UX.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# EU GDPR — product-side playbook

GDPR isn't legal-only homework — it shapes product. Lawful basis dictates
data flows, Article 22 affects AI-decision UX, DPIA is mandatory for
high-risk processing. Treating GDPR as a Phase 2 retrofit produces
unshippable products in the EU.

## 1. The 6 lawful bases — pick exactly one per processing activity

| Basis | When to use | Risk |
|---|---|---|
| Consent | User actively agrees; freely-given, specific, informed | Easy to do wrong; consent fatigue |
| Contract | Necessary to perform the contract user requested | Misused for "we want to" |
| Legal obligation | Required by law | Narrow; cite the specific law |
| Vital interests | Life-or-death | Very narrow |
| Public task | Public-sector only | N/A for most fintechs |
| Legitimate interests | Your interest, balanced against user's rights | The "we have a good reason" basis; needs balancing test (LIA) |

**Common PM mistake**: using "consent" for processing the user can't
reasonably refuse (i.e. core product). That's not freely-given consent;
use contract or LI instead.

## 2. Consent UX — what passes

- **Granular**: separate consent per processing purpose (no bundling).
- **Pre-ticked boxes**: forbidden.
- **Cookie banners**: NOT a substitute for valid consent.
- **Withdrawal must be as easy as giving**: one click in, one click out.
- **Specific to purpose**: "We use your data to provide the service" =
  too vague.

**PM rule**: design the consent UX once for GDPR. CCPA/DPDP can ride on
the same architecture.

## 3. DPIA (Data Protection Impact Assessment)

**Mandatory when processing is high-risk**:
- Systematic monitoring at scale (e.g. employee surveillance, public-space
  tracking).
- Sensitive data at scale (health, biometrics, criminal).
- AI / automated decision-making with legal/significant effect.
- New tech that hasn't been DPIA'd before.

**DPIA isn't a one-time form** — it's a process: describe processing,
assess necessity / proportionality, identify risks, identify mitigations,
consult DPO. Document.

## 4. Article 22 — automated decision-making

If a decision is:
1. Solely automated (no meaningful human involvement), AND
2. Produces legal or similarly significant effects on the user

…then the user has rights to:
- Object to the decision
- Have a human review
- Express their point of view

**PM implication**: pure-AI decisions on credit, employment, insurance,
healthcare access — Article 22 applies. Either add meaningful human
review OR get explicit consent OR establish necessity for the contract.

## 5. Data subject rights (DSARs) — operational reality

| Right | What it means | SLA |
|---|---|---|
| Access | Copy of their data | 1 month (extendable to 3 with reason) |
| Rectification | Correct inaccurate data | 1 month |
| Erasure ("right to be forgotten") | Delete | 1 month; exceptions for legal obligation |
| Restriction | Pause processing | 1 month |
| Portability | Get data in machine-readable format | 1 month |
| Object | Stop processing | 1 month |

**PM implication**: design the DSAR ingress at launch. Manual ops models
collapse at scale. Self-service portal saves the team.

## 6. Data residency / cross-border transfers

Post-Schrems II + EU-US Data Privacy Framework (2023):
- **EU→US**: covered by DPF (for certified companies); otherwise SCCs +
  TIA (Transfer Impact Assessment).
- **EU→other**: SCCs + TIA.
- **Adequacy decisions**: certain countries (UK, Japan, etc.) are
  pre-approved.

**PM implication**: if your strategy says "EU customers, US-hosted", you
need DPF certification (Microsoft, Google, AWS, etc. cover infrastructure
side, but your application is your responsibility).

## 7. GDPR-K — children (under 16, default; varies 13-16 by member state)

- **Verifiable parental consent** for under-16 (16 default; lower in some
  states like UK at 13, IT at 14, FR at 15).
- **Profiling restrictions** stricter for children.
- **Marketing to children**: heavily restricted.

**PM implication**: if any chance of under-16 users, design age gate
+ parental consent flow. Default the assumption to strict.

## 8. DPO (Data Protection Officer) — when required

Mandatory if:
- Public authority.
- Core activities require regular systematic monitoring of subjects at
  large scale.
- Core activities involve large-scale processing of special-category data.

Most fintechs and AI products that operate at scale: yes. Plan for it.

## 9. Breach notification

- **72 hours** to notify the supervisory authority once aware.
- **Notify users without undue delay** if high risk to their rights.
- **Document every breach** even when not notified.

**PM implication**: incident-response runbook must include the 72-hour
clock. The clock starts when you BECOME AWARE, not when you confirm.

## 10. Penalties — the enforcement reality

- Up to **€20M or 4% of global turnover**, whichever is higher.
- Recent enforcement has been substantial (Meta, Amazon, Google).
- DPAs vary in aggression (Ireland slow, France/Germany/Italy active).

## 11. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| fintech-pm-reviewer | EU MTL alternatives; PSD2 overlap |
| edtech-pm-reviewer | GDPR-K (age of digital consent matrix) |
| ai-ethics-pm | Article 22; automated decision UX |
| data-strategist | Lawful basis selection; data residency |
| spec-writer | Consent UX; DSAR self-service |
| ai-product-strategist | Cross-border transfer choice (architectural) |

## 12. References (verify currency)

- GDPR text: gdpr-info.eu
- EDPB guidelines: edpb.europa.eu
- DPF (Data Privacy Framework): dataprivacyframework.gov
- National DPA guidance varies (CNIL, ICO, AEPD, etc.)

## 13. The honesty filter

If a strategy says "we're GDPR compliant" without naming the lawful basis
per processing activity, it's not. Demand specifics.
