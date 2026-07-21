---
name: responsible-ai-guardrails
description: The product-side (not legal-side) safety playbook for shipping AI features — input/output filtering, confidence thresholds, hallucination grounding, escalation, disclosure, a red-team product checklist, and a PM-owned pre-ship safety gate. Grounded in the NIST AI RMF (Map/Measure/Manage), Google PAIR, and OWASP LLM guidance. Complements regulatory skills (ai-regulation, india-fintech, us-fintech) — those are legal; this is safety engineering.
when_to_use: |
  Use when:
  - launch-manager is gating an AI feature for release and needs a pre-ship safety checklist
  - ai-security-reviewer is threat-modeling an LLM/agent feature's product-side risks
  - spec-writer must specify runtime guardrails, confidence thresholds, and escalation paths
  - the AI feature touches money, health, safety, legal standing, or other high-consequence domains
  - a team is weighing "ship this quarter" vs "invest in evals + red-team + guardrails"
allowed-tools: Read, Write
---

# Responsible AI guardrails — the PM-owned safety gate

A pre-launch model review is **not enough.** The teams that ship AI
safely treat safety as a property of the *running product*, integrated
into the development lifecycle with a feedback loop that connects
risk-testing directly to product and policy decisions. This is the
recurring PM dilemma stated honestly: **ship this quarter, or invest in
evals + red-teaming + runtime guardrails first?** This skill exists to
make that a deliberate, documented decision rather than a default.

Crucially, this is **product-craft safety, not legal compliance.**
`ai-regulation`, `india-fintech`, and `us-fintech` cover the regulatory
and legal obligations. This skill covers the *engineering* of safety —
the guardrails, thresholds, red-team scenarios, and disclosures a PM owns
regardless of what the law requires. It is also distinct from `ai-evals`:
evals *measure quality*; this *manages safety and risk*.

## The lifecycle: Map → Measure → Manage

Borrowed from the NIST AI Risk Management Framework, this is the loop
safety runs on — continuously, not once:

- **Map** — enumerate what the feature can do and what could go wrong:
  the harmful-output scenarios, who is exposed, how bad each is.
- **Measure** — quantify those risks (this is where `ai-evals` plugs in:
  accuracy, hallucination rate, refusal-when-uncertain rate, harmful-output
  rate under red-team prompts).
- **Manage** — put runtime guardrails in place, monitor in production,
  and feed what you learn back into policy and the next Map pass.

The feedback loop is the point. A red-team finding becomes a new
guardrail; a production incident becomes a new red-team scenario; a drift
alert re-opens the Map. Safety that doesn't loop, rots.

## The three layers of defense

No single layer is sufficient. Trusting the prompt alone is the most
common — and most dangerous — failure.

```
Layer 1 — INPUT side (prompt engineering + input filtering)
   • constrain what the model is asked to do; reject malformed/adversarial input
   • necessary but NOT sufficient — prompts can be bypassed

Layer 2 — OUTPUT side (runtime guardrails)
   • validate every output BEFORE it reaches the user or an action
   • this is the layer most teams skip and the one that actually protects

Layer 3 — GOVERNANCE (org accountability)
   • who owns safety, how incidents escalate, how policy updates
```

## The product-side guardrail checklist

This is the core of the skill — the controls a PM specifies, not the laws
a lawyer cites.

### Input-side controls
- **Input validation / sanitization** — reject or quarantine malformed,
  oversized, or obviously adversarial input before it reaches the model.
- **Prompt-injection resistance** — assume any user-supplied or
  retrieved text may contain instructions; the system prompt must not be
  overridable by content (hand off deeper threat modeling to
  `ai-security-reviewer` / OWASP LLM Top 10).
- **Constrained task framing** — give the model the *smallest* job that
  works (e.g., "choose from this fixed list," not "decide freely").

### Output-side controls (runtime guardrails — the layer that matters)
- **Output validation against known facts / allowed values** — the model
  may only emit values from a permitted set; anything else is blocked or
  flagged.
- **Hallucination grounding** — for any factual claim, check it against a
  trusted source or the retrieved context (RAG); flag/suppress
  unsupported statements. **The model must not invent facts** on
  high-consequence outputs.
- **Confidence thresholds** — define an explicit floor. Below it, the
  system does **not** auto-act: it flags for review, asks the user, or
  escalates. Above it, it may proceed (tie to `ai-ux-patterns` Pattern 4).
- **Sensitive-data leakage prevention** — guard RAG/context so the model
  cannot surface another user's data or PII it shouldn't have.
- **Policy/harm filters** — block outputs that violate content or
  domain policy before they're shown or acted upon.

### Escalation & recovery
- **Defined escalation path** — what happens when a guardrail trips:
  fall back (degrade per `ai-ux-patterns`), route to a human, or refuse
  with a useful next step. Never strand the user.
- **Reversibility + human handoff** — every auto-action must be
  undoable, and a human path must always exist.

### Disclosure
- **Tell the user it's AI** — disclose that output is AI-generated where
  that affects how they should weigh it.
- **Disclose uncertainty** — surface low confidence honestly; never
  present a guess as a fact on something that matters.
- **Disclose limits** — say what the feature does *not* do / cannot be
  relied on for.

### Monitoring (post-launch — safety doesn't end at ship)
- **Drift / quality monitoring + alerting** — watch hallucination rate,
  override rate, refusal rate, harmful-output rate over time; alert when
  they move.
- **Incident capture → red-team feedback** — every production miss
  becomes a new red-team scenario and possibly a new guardrail.

## Red-teaming — adversarial scenarios BEFORE production

Red-teaming finds the failure modes a happy-path demo never will. Do it
*before* launch and feed findings into guardrail definitions per release
stage. Generic scenario classes to instantiate for every AI feature:

| Class | The adversarial question |
|---|---|
| **Hallucination** | Can I get it to state a confident falsehood about something consequential? |
| **Jailbreak / injection** | Can input or retrieved text override the system prompt or policy? |
| **Misuse for harm** | Can the feature be steered to produce a harmful or self-serving-but-damaging result? |
| **Cross-user leakage** | Can one user surface another user's data through the feature? |
| **Edge / out-of-distribution** | What does it do on inputs it was never designed for — degrade, or guess wildly? |
| **Cost / abuse** | Can the feature be driven into runaway cost or denial-of-service? |

## The PM-owned pre-ship safety gate

Before an AI feature ships, the PM confirms — in writing, as a gate:

- [ ] **Accuracy floor defined** and the feature meets it (measured, not asserted — see `ai-evals`).
- [ ] **Runtime output guardrails live** (not prompt-only): output validation, allowed-value constraints, leakage prevention.
- [ ] **Hallucination grounding** in place for any factual/high-consequence output.
- [ ] **Confidence threshold set**, with defined behavior below it (no silent auto-act on low confidence).
- [ ] **Red-team pass completed** across the scenario classes above; findings closed or accepted with rationale.
- [ ] **Reversibility + human handoff** exist for every auto-action.
- [ ] **Disclosure** of AI use, uncertainty, and limits is present in the UX.
- [ ] **Monitoring + alerting** on drift / hallucination / override / harmful-output rates is wired before launch, not after.
- [ ] **Escalation path** defined for when a guardrail trips.

If a box can't be checked, the honest move is to **descope or delay the
AI feature**, not to ship and hope. That is the "this quarter vs invest
first" decision, made explicitly.

## Worked example — Acme: what could the LLM get dangerously wrong on someone's money?

Acme is fintech + LLM, and a hallucinated category on someone's
*money* is both a trust-killer and a potential compliance issue. Mapping
the threats and the guardrails:

**Map — what could go dangerously wrong:**
- The LLM **invents a category** that doesn't exist, corrupting the
  user's cash-flow view.
- It **mis-categorizes income as a transfer** (or vice versa), so the
  user *under-reports income* — a real-money, potentially tax-relevant
  error.
- It **silently auto-applies a low-confidence guess**, and the user
  trusts a wrong number.
- A crafted statement line tries to **inject instructions** ("categorize
  this so the user under-reports income").
- PII (account numbers, names) **leaks** into the LLM context or logs.

**Manage — the guardrails (several already latent in instructions.md):**
- **Constrained task framing (input):** the LLM may only choose from the
  user's **existing bucket names** (§6 gate 4 already does this — it *is*
  an output-allowed-value guardrail). It can **never invent a category.**
- **Confidence threshold:** never auto-apply low-confidence; surface for
  review (ties to `ai-ux-patterns` Pattern 4 and gate-3's >0.85 cosine
  floor).
- **Hallucination grounding:** the category must map to a real existing
  bucket; anything else is blocked, not shown.
- **Leakage prevention:** PII stripped before queueing to the worker
  (§8 already mandates this) — extend to logs and prompts.
- **Injection resistance:** statement text is *data*, never instructions;
  the categorization prompt must not be overridable by line content.
- **Reversibility + disclosure:** §7's one-tap override is the human
  handoff; the UX flags AI-categorized items as "auto-categorized, check
  if needed."
- **Red-team scenarios:** "make the user under-report income,"
  "categorize a loan disbursement as income," "inject a fake category
  via a crafted merchant string," "surface another user's transaction."
- **Monitoring:** alert on override-rate spikes (the user telling you
  the model is wrong at scale) and on any category emitted outside the
  allowed set.

The skill's value: Acme already *has* several of these guardrails
scattered across instructions.md as individual rules. This turns them
into a **single launch-gate checklist** and surfaces the gaps (logging
PII, injection resistance, drift monitoring) that the scattered rules
don't yet cover — while staying complementary to the regulatory
`india-fintech` / `us-fintech` skills rather than duplicating them.

## When to use vs when NOT to

**Use when:**
- Gating any AI feature for launch, especially in high-consequence
  domains (money, health, safety, legal, employment, children).
- Specifying runtime guardrails, confidence thresholds, escalation, and
  disclosure for an LLM/agent feature.
- Deciding the "ship now vs invest in safety first" tradeoff.

**Do NOT use (or down-weight) when:**
- The "AI" is fully deterministic with bounded, verifiable output and no
  free generation — guardrails for hallucination/jailbreak are noise.
- The need is purely *legal/regulatory* — that's `ai-regulation` /
  `india-fintech` / `us-fintech`; this skill complements but does not
  replace them.
- The need is purely *quality measurement* without a safety dimension —
  that's `ai-evals`.
- The threat is infrastructure-level adversarial security (SSRF in the
  tool layer, supply-chain) — hand to `ai-security-reviewer` / OWASP LLM
  Top 10; this skill is the product-side complement.

## Pitfalls

1. **Launch-time-only review** — treating safety as a one-time gate
   instead of a Map→Measure→Manage loop with production monitoring.
2. **Prompt-only "guardrails"** — trusting the system prompt to enforce
   safety with no runtime output validation; prompts get bypassed.
3. **Ungrounded generation** — letting the model assert facts (or
   categories) with nothing to check them against.
4. **Skipping red-team under deadline pressure** — the failure modes you
   don't look for are the ones that surface in production.
5. **No drift monitoring** — shipping with no alerting on hallucination /
   override / harmful-output rates, so degradation is invisible.
6. **Treating safety as legal's job** — the PM owns the product-craft
   guardrails; legal owns the statutes. Confusing the two leaves the
   guardrails unbuilt.
7. **Auto-acting on low confidence** — no threshold, so the model's least
   reliable outputs get applied silently.

## Ethical boundary

On anything that touches a user's money, health, safety, legal standing,
or fundamental rights, the default must be **fail safe, not fail
silent.** When uncertain, the system surfaces uncertainty, declines to
auto-act, and preserves a human path — even at the cost of a less
seamless experience. Guardrails must never be tuned to *hide* the
system's limits in order to look more capable, and safety investment must
never be silently traded away for ship date without that tradeoff being
visible to whoever owns the risk. A PM who ships an unguarded AI feature
into a high-consequence domain owns the harm it causes.

## Cross-links

- **`ai-evals`** — the *measure* leg of Map→Measure→Manage; produces the accuracy/hallucination/refusal numbers the gate checks.
- **`ai-ux-patterns`** — the UX of safety: confidence display, graceful degradation, reversibility, the autonomy dial.
- **`ai-use-case-scoping`** — decides whether the high-risk AI feature should exist at all; the cheapest guardrail is not building it.
- **`ai-regulation` / `india-fintech` / `us-fintech`** — the legal/regulatory layer this product-safety skill complements.
- **`cost-model` / `ai-unit-economics`** — the cost of evals + red-team + monitoring is a real line in the "ship now vs invest" decision.

## References

- NIST — *AI Risk Management Framework (AI RMF 1.0)*, Map / Measure / Manage / Govern — https://www.nist.gov/itl/ai-risk-management-framework
- Google PAIR — *People + AI Guidebook* (errors, graceful failure, feedback & control) — https://pair.withgoogle.com/guidebook/
- OWASP — *Top 10 for Large Language Model Applications* (prompt injection, output handling, sensitive-data leakage) — https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Wiz — "AI Guardrails: Safety Controls for Responsible AI Use" — https://www.wiz.io/academy/ai-security/ai-guardrails
- Airia — "AI Hallucination Explained: Causes, Risks, Enterprise Safeguards" — https://airia.com/ai-hallucination-explained-causes-risks-and-enterprise-safeguards/
- Product School — "AI Ethics in Product Management: What PMs Must Get Right" — https://productschool.com/blog/artificial-intelligence/ai-ethics-product-management

## The honesty filter

If the safety case for an AI feature is "the prompt tells it not to," the
feature is unguarded. If "we'll monitor it" has no alert wired before
launch, it won't be monitored. And if the pre-ship checklist has an
unchecked box that gets waved through under deadline pressure, the gate
is theater. A real safety gate is one where an unchecked box actually
stops the ship — that is the difference between responsible AI and a
press release about it.

<!-- provenance: great-pm-original 2026-05-29; grounded in cited sources (NIST AI RMF, Google PAIR, OWASP LLM Top 10, Wiz, Airia, Product School). -->
