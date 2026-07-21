---
name: ai-regulation
description: Playbook for AI-specific regulation — EU AI Act (high-risk + GPAI obligations), NIST AI RMF (US voluntary), Biden EO + agency actions, state AI laws (NY LL 144, CO SB 205, etc.), sector-specific overlays.
when_to_use: |
  Use for any AI / ML product. Especially for high-risk use cases —
  hiring, lending, healthcare, education, law enforcement, biometric.
  Primarily for ai-product-strategist, ai-ethics-pm, ai-safety-pm,
  fintech-pm-reviewer, healthcare-pm-reviewer.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# AI regulation — product-side playbook

AI regulation moved from theoretical to operational in 2024-2026. EU AI
Act phased in 2025-2026. NYC LL 144 (AI hiring) enforced. Colorado SB
205, NY DFS AI guidance, state AI bills proliferating. The classic
mistake: assuming "we're not high-risk" without doing the analysis.

## 1. EU AI Act — the most comprehensive frame

In force, phasing 2025-2027.

### Risk tiers

| Tier | Examples | Obligation |
|---|---|---|
| Unacceptable risk | Social scoring; emotion recognition in workplace/school; predictive policing on protected characteristics | PROHIBITED |
| High risk | AI in: hiring, lending, education access, healthcare diagnostics, law enforcement decisions, critical infrastructure | Conformity assessment, risk management, transparency, human oversight, accuracy + robustness, post-market monitoring |
| Limited risk | Chatbots, deepfakes | Transparency (disclose AI involvement) |
| Minimal risk | Spam filter, video game AI | No obligation |

### General-purpose AI (GPAI) — separate frame

Applies to foundation models (LLMs, multimodal). Obligations vary by
"systemic risk" threshold (compute, capability).

**Most products using third-party LLMs**: deploy-side obligations apply
(transparency, risk mgmt for high-risk use cases).

### Timeline

- Prohibited practices: Feb 2025
- GPAI rules: Aug 2025
- High-risk obligations: Aug 2026
- Full enforcement: 2027

## 2. US federal — non-binding but influential

### NIST AI RMF (Risk Management Framework)
- Voluntary; widely referenced as best practice.
- Four functions: Govern / Map / Measure / Manage.
- Increasingly cited in procurement + lawsuits.

### Biden EO (October 2023) + follow-up actions
- Mandates federal-agency action on AI safety.
- Reporting obligations for very large model trainers.
- Sector-specific guidance (health, hiring, financial).

### CFPB on AI in lending
- Explicit: ECOA adverse-action requirements apply to AI-based decisions.
- AI can't excuse opacity.

### EEOC on AI in hiring
- Disparate-impact analysis required (4/5 rule).
- ADA: AI must accommodate.

### FTC on AI marketing
- "AI-washing" enforcement (claims not backed by capability).
- Section 5: deceptive AI products.

## 3. US state — patchwork, mostly hiring + housing

| State / city | Law | Domain |
|---|---|---|
| New York City | Local Law 144 (AEDT) | AI in employment decisions; bias audit + candidate notice |
| Illinois | AI Video Interview Act | Video-AI interviews require consent + disclosure |
| Colorado | SB 205 (2024) | Comprehensive AI consumer-protection law; high-risk AI |
| Maryland | HB 1202 | Facial recognition in hiring restricted |
| California | Multiple bills (employment AI, automated decision-making) | Various |
| Tennessee | ELVIS Act | Deepfake protections (voice/likeness) |
| Texas, NJ, others | Pending | Watch space |

## 4. NYC LL 144 (AEDT) — operational template

Often the first US AI law a startup hits:

- **Bias audit** by independent third party, annual.
- **Public summary** of bias audit results.
- **Candidate notice** at least 10 business days before AEDT use.
- **Allow alternative** (request human review).
- **Selection rate disparities** measured per protected category.

**4/5 rule**: selection rate for any group < 4/5 of best group =
disparate impact = problem.

## 5. Sector-specific overlays

- **Healthcare AI**: FDA SaMD + EU AI Act high-risk + HIPAA.
- **Financial AI**: ECOA / Reg B adverse action + CFPB guidance + EU AI
  Act high-risk.
- **Hiring AI**: NYC LL 144 + EEOC + state-by-state + EU AI Act high-risk.
- **Education AI**: COPPA / FERPA + EU AI Act high-risk + state laws.
- **Law enforcement AI**: state restrictions; EU prohibitions; federal
  guidance.

## 6. Transparency obligations (EU AI Act, Art. 50)

For systems that interact with people:

- **Chatbots**: disclose AI involvement (unless obvious).
- **Deepfakes**: disclose synthetic content.
- **Synthetic voice**: disclose.
- **Emotion recognition / biometric categorization**: disclose to data
  subjects.

## 7. Model documentation — the model card + system card

Per Mitchell et al. (2019) "Model Cards":
- Intended use
- Out-of-scope use
- Performance metrics per relevant subgroup
- Ethical considerations
- Caveats and recommendations

**Plus system card** (for the product as a whole): how the model is used,
limits, guardrails, escalation paths.

## 8. Risk-management framework — what to do operationally

(Inspired by NIST AI RMF + EU AI Act conformity assessment)

1. **Map** — identify the AI system, its use, its impact.
2. **Measure** — assess capability, accuracy, fairness, robustness across
   subgroups.
3. **Manage** — control risks (human oversight, refusal, fallback).
4. **Govern** — accountability, documentation, audit, transparency.
5. **Monitor** — post-deployment surveillance for drift, harm, new risks.

## 9. PM checklist (for AI products)

- [ ] AI use-case classified per EU AI Act risk tier
- [ ] If high-risk: conformity assessment plan
- [ ] Model card published
- [ ] System card (product-level) published
- [ ] Bias audit per applicable law (NYC LL 144, EU, etc.)
- [ ] Transparency UX: AI involvement disclosed where required
- [ ] Human oversight + override path for high-stakes decisions
- [ ] Refusal / "don't know" UX for low-confidence cases
- [ ] Adverse action / explanation per ECOA / Article 22
- [ ] Sector-specific compliance (FDA, CFPB, EEOC, etc.)
- [ ] Post-deployment monitoring + incident response

## 10. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| ai-product-strategist | EU AI Act risk-tier classification; sector overlays |
| ai-ethics-pm | NIST AI RMF; bias audit requirements; transparency UX |
| ai-safety-pm | Risk management; refusal; human oversight |
| fintech-pm-reviewer | ECOA adverse-action for AI lending |
| healthcare-pm-reviewer | FDA SaMD + EU AI Act high-risk for clinical AI |
| edtech-pm-reviewer | Education AI restrictions + state overlay |

## 11. References

- EU AI Act: artificialintelligenceact.eu
- NIST AI RMF: nist.gov/itl/ai-risk-management-framework
- NYC LL 144: nyc.gov/site/dca/about/automated-employment-decision-tools
- CO SB 205 (AI Consumer Protection): leg.colorado.gov
- EEOC AI guidance: eeoc.gov/laws/guidance
- Model Cards (Mitchell et al.): arxiv.org/abs/1810.03993

## 12. The honesty filter

If an AI product strategy says "we're not high-risk" without classifying
the use case against EU AI Act Annex III, it hasn't done the work.
Demand the classification.
