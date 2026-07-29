# AI Launch Checklist — <initiative>

> Authored by ai-launch-strategist. Pre-launch checklist for AI-heavy
> products. Augments launch-manager's standard rollout with AI-specific
> verifications.

**Initiative:** <slug>
**Launch date target:** <YYYY-MM-DD>
**Owner:** <name>
**Status:** PLANNING | DRILL | READY-TO-LAUNCH | LAUNCHED

---

## Pre-launch: Quality

- [ ] **Eval-plan suite passes** on production model + production prompts
      (per model-evaluator-pm)
- [ ] **Subgroup quality** within bands on every slice (per ai-ethics-pm)
- [ ] **Adversarial set** — 0 failures on hard-block categories
- [ ] **Regression test** — no degradation vs current champion
- [ ] **Human-judge spot-check** — sample 50+ production-like cases, manual
      review by domain expert

## Pre-launch: Cost + capacity

- [ ] **Inference capacity provisioned** for 2-3× predicted peak
      (per ai-cost-optimizer)
- [ ] **Routing tier distribution** verified (cheap-first hits >X%)
- [ ] **Cache hit rate** at predicted level
- [ ] **Load test** in staging at predicted peak — p99 latency holds
- [ ] **Cost projection** ≤ budget envelope at predicted volume

## Pre-launch: Safety

- [ ] **Safety plan** (ai-safety-pm) verified in staging
- [ ] **Refusal patterns** firing correctly — sample 20 known-out-of-scope inputs
- [ ] **Citation grounding** (if RAG) — verified non-grounded outputs blocked
- [ ] **PII-in-output rate** — 0 in staging across 1000+ test cases
- [ ] **Jailbreak resistance** — top 10 known prompts tested
- [ ] **Hallucination playbook** integrated

## Pre-launch: Rollback

- [ ] **Tier A drill** (model-version rollback) — < 5 min RTO verified
- [ ] **Tier B drill** (cheap-model fallback) — cost cap respected
- [ ] **Tier C drill** (non-AI fallback) — rules respond correctly
- [ ] **Tier D drill** (graceful refuse) — UX clear, not crashed
- [ ] **Authority chain tested** — right people get pinged

## Pre-launch: UX

### Expectation management
- [ ] **First-run experience** explicitly sets the bar (not "magic")
- [ ] **Example of likely-correct case** in onboarding
- [ ] **Example of likely-wrong case** in onboarding (manages expectation)
- [ ] **"You stay in control"** promise visible

### Hallucination disclaimers
- [ ] **Per-output confidence** indicator (when below threshold)
- [ ] **"How this works"** link in footer or settings
- [ ] **First-correction acknowledgment** ("Thanks — system learns from this")

### Recourse
- [ ] **One-tap correction** wired
- [ ] **Settings → opt out of personalization** path exists
- [ ] **Feedback channel** open (for systemic complaints)

## Pre-launch: Demo discipline

- [ ] **Demo dataset cleaned** — real, randomized, representative
- [ ] **No cherry-picked "great results"** in any public demo
- [ ] **At least 1 imperfect example** shown in demo (manages expectation)
- [ ] **Live-demo failure mode** pre-prepared (don't pretend it worked)

## Pre-launch: Monitoring + on-call

- [ ] **Monitoring signals** active (per mlops-pm runbook)
- [ ] **Alert thresholds** calibrated to baseline
- [ ] **On-call schedule** set for launch + first week
- [ ] **Escalation chain** named with phone numbers
- [ ] **Postmortem template** ready
- [ ] **War-room channel** created

## Pre-launch: Compliance

- [ ] **EU AI Act risk-tier classified** (per ai-regulation skill)
- [ ] **Sector-specific compliance** verified
  - [ ] HIPAA (if health PHI)
  - [ ] DPDP (if Indian users)
  - [ ] GDPR (if EU users)
  - [ ] FCRA / ECOA (if US lending decisions)
  - [ ] COPPA / FERPA (if minors)
  - [ ] Other: <list>
- [ ] **Privacy notice updated** with AI use disclosure
- [ ] **Consent UX** updated if training data scope changed
- [ ] **Transparency disclosure** per EU AI Act Art. 50 (if applicable)

## Pre-launch: Comms

- [ ] **Internal launch post** (team / stakeholders) — stakeholder-comms
- [ ] **External announcement** (gtm-strategist's GTM plan)
- [ ] **Customer-facing changelog** updated
- [ ] **FAQ / support runbook** updated for new AI surface
- [ ] **Support team trained** on common AI failure modes

## Pre-launch: Trust-recovery playbook

If day 1 goes wrong, scenarios A/B/C ready:

- [ ] **Scenario A** (viral "AI got it wrong") — comms template ready
- [ ] **Scenario B** (quality regression at scale) — Tier A/B rollback rehearsed
- [ ] **Scenario C** (safety event) — incident response + disclosure path ready

## Launch decision (`/pm-gate approve gate:launch`)

ALL above checked → file gate:launch with this checklist as evidence →
human runs `/pm-gate approve <id>` to formally approve launch.

## Post-launch: First 24 hours

- [ ] **Watch dashboards** — Tier 1 signals first
- [ ] **Sample audit** — 50+ real-user outputs, human review
- [ ] **Support volume** — within predicted band
- [ ] **No P0 incidents**

## Post-launch: First week

- [ ] **Full eval-plan re-run** on production data sample
- [ ] **User feedback synthesis** (feedback-synthesizer)
- [ ] **Cost tracking** — within envelope
- [ ] **Plan canary advancement** if hit GA target

## Post-launch: First month

- [ ] **/pm-measure** read-out (analytics-analyst)
- [ ] **Next-cycle questions** captured for next /pm-discover
- [ ] **Postmortem on any incidents**
- [ ] **Lessons captured** in `.great-pm/lessons.md`

---

> Owner runs this checklist BEFORE filing gate:launch via /pm-promote.
> Evidence (links to each verification) attached to the gate package.
> pm-reviewer reviews. Human approves via /pm-gate approve <id>.
