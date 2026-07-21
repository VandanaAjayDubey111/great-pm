# Prompt Registry — <product>

> Authored / maintained by prompt-engineer-pm. Single source of truth for
> every prompt the product sends to a model. Versioned, named, reviewable.

**Owner:** prompt-engineer-pm
**Last reviewed:** <YYYY-MM-DD>

---

## 1. Naming convention

```
<product>.<feature>.<purpose>.<version>

Examples:
  acme.categorize.system_prompt.v0_3
  acme.categorize.few_shot.v0_3
  acme.explain.user_prompt.v0_1
  acme.refusal.copy.v0_2
```

Semver semantics:
- **Major** (v1, v2): output schema or contract change. Breaking.
- **Minor** (v0_3, v0_4): wording / scope change; same output schema.
- **Patch** (typo fix): no version bump; tracked in git only.

## 2. Storage convention

```
prompts/
  acme/
    categorize/
      system_prompt.v0_3.md
      few_shot.v0_3.md
    explain/
      user_prompt.v0_1.md
    refusal/
      copy.v0_2.md
```

- One file per prompt (no concatenation in code).
- Markdown for readability.
- Front-matter contains metadata (model, max_tokens, temperature, etc.).
- Version in filename AND in front-matter.

## 3. Prompt file template

```markdown
---
name: acme.categorize.system_prompt
version: 0_3
model_required: gpt-4o-mini or equivalent
max_tokens: 200
temperature: 0.1
expected_output: JSON {category, confidence, reasoning}
last_reviewed: 2026-05-22
reviewer: <name>
related_eval_set: eval-set-categorize.md
---

# Categorization system prompt

<the actual prompt text — clear, no hidden cleverness>

## Few-shot examples (if applicable)

<examples block — each labeled "✓ correct" or "✗ avoid">

## Refusal triggers

<when this prompt should produce a refusal — see refusal.copy.v0_2.md>
```

## 4. PR review checklist (every prompt PR)

Reviewer (PM + eng, minimum):
- [ ] Diff is clear; what changed and why is in the PR description
- [ ] Eval-plan suite passes on the new version
- [ ] No regression on any subgroup
- [ ] Cost impact stated (token-count delta × volume × rate)
- [ ] Latency impact considered
- [ ] New failure modes considered (jailbreaks, refusals, etc.)
- [ ] Linked to AI-experiment if A/B planned
- [ ] Backward-compatibility statement (or breaking-change flag)

## 5. Auto-blocks (CI prevents merge)

- Eval regression > 3% on any slice → blocked
- Cost increase > 20% without explicit justification → blocked
- New adversarial-set failure → blocked
- Format / schema mismatch → blocked

## 6. Active prompts inventory

| Name | Version | Model | Last review | Owner |
|---|---|---|---|---|
| acme.categorize.system_prompt | 0_3 | gpt-4o-mini | 2026-05-15 | <name> |
| acme.categorize.few_shot | 0_3 | gpt-4o-mini | 2026-05-15 | <name> |
| acme.explain.user_prompt | 0_1 | gpt-4o-mini | 2026-05-10 | <name> |
| acme.refusal.copy | 0_2 | n/a (template) | 2026-05-01 | <name> |

## 7. Retired prompts (kept for audit)

| Name | Version | Retired | Reason |
|---|---|---|---|
| acme.categorize.system_prompt | 0_2 | 2026-05-15 | Replaced by v0_3 (better refusal handling) |

## 8. Prompt-vs-fine-tune decision log

Document when you chose prompt vs fine-tune AND why.

| Decision | Date | Path chosen | Reasoning |
|---|---|---|---|
| Initial categorizer | 2026-03-15 | Prompt + few-shot | <5KB; categories change monthly |
| Refusal style | 2026-04-01 | Prompt | Cheap; few-shot stable |
| Indian-vernacular handling | <future> | <to evaluate> | If perf gap, consider fine-tune |

## 9. Operational rules

- **No DB-side prompt editing.** Prompts ship via deploy.
- **No string concatenation in code.** Always template-substitute with
  named variables.
- **No "let's try this in prod" prompt experiments.** Use the experiment
  framework (ai-experimentation-pm) for any prompt change.
- **Prompt + model = pair.** Versioning the prompt assumes the model is
  pinned; document the model version too.

## 10. Annual review

Every prompt reviewed annually for:
- Continued relevance
- Cost optimization opportunities
- New failure modes discovered in the wild
- Whether prompt → fine-tune crossover makes sense

---

> Linked to: model-card per active model, eval-plan per capability.
