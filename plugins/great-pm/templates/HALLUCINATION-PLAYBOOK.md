# Hallucination Playbook

> Detection-and-recovery patterns for AI-product hallucinations. Authored
> by ai-safety-pm; referenced by spec-writer when defining AI features.

**Last reviewed:** <YYYY-MM-DD>
**Owner:** ai-safety-pm

---

## 1. What counts as a "hallucination"

A hallucination is any model output that is:
- **Factually wrong** (model invents a non-existent thing)
- **Plausible-sounding but baseless** (sounds confident, no grounding)
- **Misattributed citation** (real source cited for something it doesn't say)
- **Wrong categorization with high confidence** (in classification products)

**NOT hallucinations** (different problems):
- Refusal when the model could answer (over-refusal)
- Slow response (latency, not quality)
- Stylistic preference (subjective, not factual)
- Old info presented as current (staleness, related but distinct)

## 2. Detection mechanisms (pick the ones that fit your product)

### A. Citation grounding (for RAG / retrieval products)
- Require every fact in output to cite a retrieved source.
- Block / flag outputs without citation.
- Verify the cited source actually supports the claim (separate model
  call, expensive but high-value).

### B. Confidence calibration
- Surface model confidence to the system (not always to users).
- Below threshold (e.g. 70%): trigger fallback path (refuse / ask / escalate).

### C. LLM-as-judge cross-check
- Run a separate model to check the first model's output.
- Use it as a guardrail, not as primary.
- Disagreement → flag for human or refuse.

### D. Rule-based sanity checks
- Numerical bounds (e.g. an amount can't be negative).
- Format check (output matches schema).
- Domain constraints (e.g. categorizer must pick from known categories).

### E. Self-consistency
- Run the same input N times; if outputs vary, flag as low-confidence.
- Costlier but catches stochastic-confident-wrong cases.

### F. User-feedback signal
- High correction rate on a category / merchant / pattern = hallucination
  signal.
- Pipe to mlops-pm for drift detection.

## 3. UX patterns for recovery

### A. Refuse-with-explanation
- "I'm not sure about that. Here's what I can tell you instead..."
- Provides alternatives: manual entry, human help, escalation.

### B. Confidence band display
- "I'm ~70% confident this is X — tap to correct."
- Lets user calibrate trust per item.

### C. One-tap correction
- Always make the correction one tap (not a multi-step flow).
- Capture the correction as training data (per ai-feedback-loop-designer).

### D. "Tell me more" / "Why"
- Let user see the reasoning (sources, confidence, why this answer).
- Builds trust + helps users self-correct overconfident outputs.

### E. Show the source
- Display retrieved sources alongside the answer.
- User can verify themselves; offloads trust burden.

## 4. Per-failure-mode response matrix

| Hallucination type | Detection | Containment | Recovery UX |
|---|---|---|---|
| Made-up entity | LLM-judge + rule check | Block; show "I'm not sure" | "Did you mean X?" suggestion |
| Made-up citation | Source-verification | Block | "I can't find a source for this" |
| Wrong classification (high conf) | User correction stream | Re-train signal | One-tap correct + thanks |
| Misattributed quote | LLM-judge with source | Block | Remove quote, show approx paraphrase |
| Stale info | Time-of-knowledge filter | Show date | "Last updated <date> — may not be current" |
| Confabulated detail | Self-consistency | Strip uncertain detail | Show only consistent parts |

## 5. Pre-launch checklist

- [ ] Hallucination detection mechanism chosen (which of A-F above)
- [ ] Detection threshold(s) calibrated against eval-set
- [ ] Containment behavior specified per failure mode
- [ ] User-facing recovery UX designed + tested
- [ ] User-correction loop wired (per ai-feedback-loop-designer)
- [ ] Monitoring signal active (per mlops-pm)
- [ ] Incident-response playbook updated (specific hallucination scenarios)

## 6. Operating once live

- **Monitor hallucination rate** per product surface.
- **Sample audit** weekly: random sample, LLM-judge or human verifies.
- **User-correction rate** as proxy (high correction = high hallucination
  in that segment).
- **Postmortem template** ready for any high-profile incident.

## 7. The honesty principles

- **Don't claim perfection.** Set the expectation with users.
- **Make correction easy.** Friction in correction = users stop correcting
  = data degrades.
- **Don't silently swallow refusals.** A refusal is information; log it,
  show it.
- **Build for the wrong path.** Most product time should consider what
  happens when the model is wrong, not when it's right.

## 8. References

- "Survey of Hallucination in Natural Language Generation" (Ji et al.)
- OWASP LLM Top 10 (LLM03: Output Handling, LLM07: Sensitive Information)
- Anthropic's Constitutional AI papers (refusal design)
- "Self-Consistency Improves Chain of Thought Reasoning" (Wang et al.)

---

> When in doubt: REFUSE > GUESS. A refusal is recoverable; a confident-
> wrong answer at scale is a trust collapse.
