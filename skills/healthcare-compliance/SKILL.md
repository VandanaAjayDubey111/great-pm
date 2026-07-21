---
name: healthcare-compliance
description: Playbook for healthcare product compliance — FDA SaMD classification, IEC 62304 software lifecycle, ISO 14971 risk, IRB (clinical research), 21 CFR Part 11 (regulated records), HIPAA overlay.
when_to_use: |
  Use when an initiative involves clinical decision-support, diagnosis,
  treatment recommendation, monitoring, clinical trial software, or
  regulated health-data processing. Primarily for healthcare-pm-reviewer,
  ai-product-strategist (SaMD class drives architecture), ai-safety-pm.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Healthcare compliance — product-side playbook

Healthcare-compliance is wider than HIPAA. FDA regulates software that
makes clinical claims (SaMD). IEC 62304 governs medical-software
lifecycle. ISO 14971 covers risk management. 21 CFR Part 11 governs
electronic records in regulated environments. IRB governs human research.
PMs in healthcare need this map.

## 1. SaMD (Software as Medical Device) — the FDA frame

Per IMDRF, SaMD is classified by:
1. **Significance of information** (treat/diagnose vs inform vs drive
   decision support).
2. **Healthcare situation** (critical, serious, non-serious).

| Category | Significance | Situation | Examples |
|---|---|---|---|
| Class I | Inform | Non-serious | Wellness app; calorie counter |
| Class II (a) | Drive decision-support | Serious | Symptom-checker; risk-score app |
| Class II (b) | Drive decision-support | Critical | ICU dashboard with alarms |
| Class III | Treat/diagnose | Serious | Glucose monitoring with closed-loop |
| Class IV | Treat/diagnose | Critical | Closed-loop insulin delivery |

**PM rule of thumb**: if your product makes a clinical CLAIM (diagnose,
treat, monitor a specific condition), SaMD scope likely applies.
Wellness / general-fitness usually escapes — but the UI text matters.

## 2. FDA pathway (if SaMD)

- **510(k)**: substantial equivalence to an existing device. Most common
  path. 3-9 months typical.
- **De Novo**: novel device with no predicate; lower risk. 12+ months.
- **PMA (Premarket Approval)**: high-risk Class III/IV. Multi-year,
  expensive, clinical trials.
- **Exempt**: certain Class I devices.

**Predetermined Change Control Plan (PCCP)** is the modern path for AI
SaMD — lets you update models within a pre-cleared envelope without new
clearance.

## 3. IEC 62304 — medical software lifecycle

Mandatory for SaMD class B+ in most jurisdictions.

Required:
- Software development plan
- Requirements analysis
- Architectural design
- Detailed design (where applicable)
- Unit implementation + verification
- Software integration + testing
- Software system testing
- Software release
- Problem resolution
- Maintenance plan
- Configuration management
- Risk management (per ISO 14971)

**PM implication**: this isn't a checklist; it's a development discipline.
Building "fast and ship" doesn't survive IEC 62304 review.

## 4. ISO 14971 — risk management

Required for any medical device. Process:
1. Identify hazards.
2. Estimate risk (severity × probability).
3. Evaluate acceptability.
4. Control measures.
5. Residual risk evaluation.
6. Risk-benefit analysis.
7. Production + post-production information (post-market surveillance).

**Maintained throughout product life** — not a one-time exercise.

## 5. 21 CFR Part 11 — electronic records (FDA regulated)

Applies to electronic records used in FDA-regulated workflows:
- **Validation** of systems used for regulated records.
- **Audit trail**: secure, computer-generated, time-stamped, immutable.
- **Electronic signatures**: equivalent to handwritten.
- **Access controls**: unique IDs, password complexity, authority checks.

**Common context**: clinical trials, pharma manufacturing, lab data
(GLP/GMP), regulated submissions.

## 6. IRB (Institutional Review Board) — for human research

Required if your product involves:
- Research on humans (data collection or interaction).
- Even retrospective database research can require IRB.

**PM implication**: any user study that crosses into "research" needs
IRB review. Quick UX tests typically don't; structured comparative
studies often do.

## 7. ICH-GCP E6(R3) — clinical trials

Good Clinical Practice standard. Required for clinical trial software:
- Informed consent (versioned, traceable).
- AE/SAE reporting (24-hour window for serious).
- Audit trail per 21 CFR Part 11.
- Data integrity (ALCOA+).
- Source data verification.

## 8. EU regulatory frame

- **MDR (Medical Device Regulation 2017/745)**: EU's SaMD frame; in force.
- **IVDR (In Vitro Diagnostic Regulation)**: for diagnostics.
- **EU AI Act**: high-risk AI (including medical AI) has overlay
  obligations starting 2026.

## 9. HIPAA overlay

HIPAA is separate from FDA. They run in parallel:
- FDA cares about safety + efficacy of device.
- HIPAA cares about privacy + security of PHI.

You typically need BOTH for clinical software handling PHI.

## 10. SaMD-PM decision tree

```
Does the product touch PHI?
  YES → HIPAA applies (use hipaa-bundle skill)
  NO → HIPAA does not apply

Does the product make a clinical claim (diagnose/treat/monitor)?
  NO → Wellness path. Be careful with UI text; review claims.
  YES → SaMD scope likely. Continue:

    What's the significance + situation? (Class I-IV per IMDRF table)
    What's the FDA pathway? (510(k), De Novo, PMA, exempt)
    IEC 62304 + ISO 14971 apply.
    PCCP for AI model updates.
    Engage regulatory consultant early.
```

## 11. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| healthcare-pm-reviewer | SaMD classification triage; FDA pathway |
| ai-product-strategist | SaMD class → architectural constraints + timeline |
| ai-safety-pm | ISO 14971 risk management framing |
| spec-writer | Audit-trail spec (Part 11); consent UX (IRB) |
| ai-experimentation-pm | PCCP for AI model changes within FDA envelope |

## 12. References

- IMDRF SaMD: imdrf.org
- FDA Digital Health: fda.gov/medical-devices/digital-health-center-excellence
- IEC 62304: iec.ch
- ISO 14971: iso.org
- 21 CFR Part 11: fda.gov/regulatory-information/search-fda-guidance-documents
- EU MDR: ec.europa.eu/health/md_sector

## 13. The honesty filter

If a healthcare AI strategy says "we don't need FDA" without quoting the
exact UI text and arguing it doesn't claim clinical use, it probably does
need FDA. Get a regulatory opinion early; don't ship-then-fix.
