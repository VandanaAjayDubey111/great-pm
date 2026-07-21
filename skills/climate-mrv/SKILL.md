---
name: climate-mrv
description: Playbook for climate / carbon Measurement-Reporting-Verification — GHG Protocol Scope 1/2/3, SBTi targets, CDP disclosure, EU CBAM, EPA GHGRP, ISO 14064, double-counting prevention, attestation.
when_to_use: |
  Use for any climate / carbon / sustainability initiative — emissions
  reporting, offset platforms, carbon-accounting software, ESG reporting,
  CBAM-affected products. Primarily for any sector-aware reviewer if the
  product touches sustainability claims.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Climate MRV — product-side playbook

MRV = Measurement, Reporting, Verification. Climate / carbon claims must
be measurable, reportable, and verifiable — increasingly required by
regulation (CSRD in EU, SEC climate disclosure in US) and audited.
Greenwashing penalties have arrived. PMs building climate products need
this frame.

## 1. The three scopes (GHG Protocol)

| Scope | What | Example |
|---|---|---|
| 1 | Direct emissions from owned/controlled sources | Company-owned vehicles, on-site fuel combustion |
| 2 | Indirect emissions from purchased energy | Electricity from grid |
| 3 | All other indirect emissions in value chain | Supply chain (upstream), product use (downstream), employee commuting, business travel |

Scope 3 is usually the largest AND hardest to measure. Methodology choice
(spend-based vs activity-based vs supplier-specific) matters hugely.

## 2. Standards landscape

### GHG Protocol (foundational)
- Corporate Accounting and Reporting Standard
- Scope 2 Guidance
- Scope 3 Guidance
- Sector-specific guidance

### ISO 14064-1 / 14064-2 / 14064-3
- 14064-1: org-level GHG inventory
- 14064-2: project-level GHG accounting (offsets)
- 14064-3: verification + validation

### SBTi (Science Based Targets initiative)
- Sets near-term (5-10 yr) and net-zero (~2050) targets.
- Aligned with 1.5°C trajectory.
- Validation required (cost + 6-12 months).

### CDP
- Disclosure platform (climate, water, forests).
- Scored A-D-.
- Increasingly required by customers.

## 3. Regulatory frame

### EU
- **CSRD (Corporate Sustainability Reporting Directive)**: phased in;
  most large companies must report by 2025-2026.
- **CBAM (Carbon Border Adjustment Mechanism)**: tariff on carbon-intensive
  imports (steel, cement, aluminum, fertilizers, electricity, hydrogen).
  Transition 2023-2025; full enforcement 2026.
- **Green Claims Directive**: bans vague green claims; substantiation
  required.

### US
- **SEC Climate Rule (2024)**: Scope 1+2 disclosure for large registrants;
  Scope 3 only if material (and litigated).
- **EPA GHGRP (Greenhouse Gas Reporting Program)**: facility-level for
  large emitters.
- **California SB 253 + SB 261**: full Scope 1+2+3 disclosure for
  large companies doing business in CA.

### Voluntary carbon markets
- **Verra (VCS)**, **Gold Standard**, **Puro.earth**, etc.
- Quality crisis 2022-2024 led to standards tightening.
- ICVCM Core Carbon Principles emerging as quality bar.

## 4. The verification chain

For credible MRV:

```
Activity data → Emission factor → Calculated emissions →
Documented methodology → Internal review → Third-party verification →
Public disclosure
```

Every step must be traceable. "Black-box" calculation = uncredible.

## 5. Carbon-accounting software requirements

If building a carbon-accounting platform:

- **Activity data ingestion**: utility bills, fuel receipts, travel data,
  supplier invoices. Must handle structured + unstructured + variable
  quality.
- **Emission factor library**: maintained, region-specific, time-versioned.
  Sources: EPA, DEFRA, IPCC, ecoinvent.
- **Methodology transparency**: every number traceable to a method.
- **Double-counting prevention**: especially for Scope 2 (location-based
  vs market-based) and offsets.
- **Audit trail**: immutable, exportable (verifiers need it).
- **Multi-standard output**: GHG Protocol, ISO 14064, CDP format, CSRD
  ESRS-E1 format.

## 6. Carbon offset / removal platforms

If building an offset / removal marketplace:

- **Methodology validation**: registered with Verra / GS / Puro / etc.
- **Project-level audit**: independent verification per credit issuance.
- **Vintage tracking**: when was the credit generated; which compliance
  period it covers.
- **Retirement**: credits are single-use; once retired, must be
  permanently retired in the registry.
- **Double-counting prevention**: corresponding adjustments under
  Article 6 (Paris Agreement) if international.
- **Permanence**: nature-based vs engineered; different risk profiles.

## 7. Common greenwashing risks (now actionable under Green Claims Directive)

- "Carbon neutral" without substantiation
- "Sustainable" without measurement
- "Plastic-free" when packaging contains plastic
- "100% renewable" via market-based REC (Scope 2) without disclosing
  it's not actually 100% locational
- Offset claims for unverified credits
- Net-zero claim without science-aligned target

## 8. PM checklist for sustainability claims

- [ ] Claim grounded in measurement (not aspiration)
- [ ] Scope (1 / 2 / 3) explicit
- [ ] Methodology disclosed
- [ ] Verification status disclosed (verified / pending / unverified)
- [ ] Boundary defined (operational, financial, equity)
- [ ] Reporting period explicit
- [ ] Baselines + comparison year stated
- [ ] Offset use disclosed separately from reductions
- [ ] Third-party verification for material claims
- [ ] Disclosure aligned with relevant standard (CDP, CSRD ESRS E1, TCFD)

## 9. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| ai-product-strategist | Methodology lock-in as moat; standard-shift risk |
| data-strategist | Activity data ingestion + emission factor library |
| spec-writer | Audit trail; verification UX |
| ai-ethics-pm | Greenwashing risk; disclosure UX |
| ai-launch-strategist | Substantiation requirements before claims go public |

## 10. References

- GHG Protocol: ghgprotocol.org
- SBTi: sciencebasedtargets.org
- CDP: cdp.net
- ISO 14064: iso.org
- CSRD ESRS: efrag.org
- CBAM: ec.europa.eu/info/business-economy-euro/banking-and-finance/
- SEC Climate Rule: sec.gov
- ICVCM: icvcm.org
- Verra: verra.org

## 11. The honesty filter

If a sustainability claim doesn't name (a) the scope, (b) the
methodology, (c) the verification status, it's probably greenwashing.
Build the product to make claims that survive scrutiny.
