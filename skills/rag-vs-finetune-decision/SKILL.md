---
name: rag-vs-finetune-decision
description: The model-capability decision tree — prompt-engineering first, then RAG for missing knowledge, then fine-tuning for missing behavior/format or cost/latency, climbing only as far as needed. Covers the cost/latency/maintenance tradeoffs of each rung and when each is the wrong choice (especially the premature-fine-tune trap). Gives the PM the framework to decide where an AI feature's knowledge and behavior should come from. Used by ai-prompt-architect and architect.
when_to_use: |
  Use when deciding how an AI feature should source its knowledge and behavior:
  is the missing capability an instruction problem (fix the prompt), a knowledge/
  freshness problem (RAG), or a behavior/format/cost problem (fine-tune)? Run
  AFTER ai-use-case-scoping confirms the feature should use an LLM, alongside
  agent-product-patterns (which decides control flow). Primarily for
  ai-prompt-architect and architect; informs the PRD and the tech spec. NOT a
  control-flow decision and NOT a vendor/model-size pick.
allowed-tools: Read, Write
---

# RAG vs Fine-tune Decision — the model-capability ladder

When an AI feature isn't good enough, teams reach for the most expensive,
least reversible fix — fine-tuning — far too early. The discipline this skill
enforces: **climb the capability ladder prompt → RAG → fine-tune only as far as
the problem actually requires.** Roughly **99% of products never need
fine-tuning.** The decision is not "which is most powerful" — it is *where the
missing capability actually lives,* and the cheapest rung that closes that
specific gap.

The diagnosing question for every gap: **does the model lack instructions,
knowledge, or behavior?**

- Missing **instructions** (it *can* do it, but you asked badly) → **prompt
  engineering.**
- Missing **knowledge** (it doesn't *know* your facts, or they go stale) →
  **RAG.**
- Missing **behavior / format at scale**, or a **latency/cost** problem from
  huge repeated prompts → **fine-tuning** (only after prompt + RAG fail).

## 1. Rung 1 — Prompt engineering (always first)

The cheapest, fastest, most reversible lever. Before anything else, exhaust the
prompt. The seven components of a strong prompt:

1. **Role / objective** — who the model is and what success looks like.
2. **Instructions** — explicit, unambiguous task directives.
3. **Context** — the relevant facts inlined for *this* request.
4. **Few-shot examples** — 2–5 worked examples that demonstrate the pattern
   (the single highest-leverage fix for format/behavior gaps short of
   fine-tuning).
5. **Reasoning steps** — chain-of-thought / "think step by step" where the task
   needs it.
6. **Output format** — the exact shape (JSON schema, fields, constraints).
7. **Delimiters / structure** — clear separation of instruction vs data
   (also a prompt-injection defense).

*Why it's first:* near-zero cost, instant iteration, no infrastructure, fully
reversible, and it frequently closes the gap on its own. *When it's the right
final answer:* the base model already *knows* the relevant facts and *can*
produce the behavior — it was just asked imprecisely. **If the model knows the
fact but ignores it, the problem is the prompt, not the model.**

## 2. Rung 2 — RAG (for missing knowledge)

**Retrieval-Augmented Generation:** pair a **retriever** (embeddings + a vector
store, or any search over your corpus) with the LLM, so the model answers
**grounded in retrieved context** rather than its frozen training data.

*When RAG is the right rung:*
- The answer needs **fresh** facts (today's data, not the training cutoff).
- The answer needs **proprietary / private** knowledge the base model never saw.
- The corpus is **too large to inline** in every prompt.
- You need outputs to be **explainable and updatable** — you can cite the
  retrieved source, and you update knowledge by updating the corpus, *not* by
  retraining.

*Why it works:* it injects the *right* knowledge at inference time, keeping the
model's behavior fixed while making its information current and grounded.
Updating knowledge is a data operation (add/remove documents), not an ML
operation (retrain) — cheap, fast, low-risk.

*The internal tradeoff — one-shot vs iterative retrieval:* a single retrieval
pass is cheap and low-latency but may miss relevant context; iterative
retrieval (retrieve → reason → retrieve again) improves recall at the cost of
more calls, more latency, and more tokens. Pick based on how much recall the
task actually needs.

*RAG quality is mostly retrieval quality:* bad chunking, weak embeddings, or a
low recall rate means the model is grounded in *garbage context* — and a
fluent, confident wrong answer is worse than an obvious failure. Measure
retrieval recall, not just end-to-end vibes.

## 3. Rung 3 — Fine-tuning (rare; for behavior/format/cost)

Fine-tuning adjusts the model's *weights* on your examples. It is the right
rung for only two reasons:

1. **Consistent behavior/format that prompting can't reliably produce** — a
   very specific output style, tone, or structure you need *every time*, at
   scale, that few-shot prompting still gets wrong too often.
2. **Latency / cost from a huge repeated prompt** — if every request carries a
   giant system prompt of instructions and examples, fine-tuning that behavior
   *into* the model can shrink the prompt, cutting per-call tokens, latency, and
   cost at high volume.

*The costs you are signing up for:*
- **Data curation** — you need a clean, labeled, representative dataset (this is
  usually the real bottleneck).
- **Retraining on drift** — when the world or your task changes, the fine-tuned
  model goes stale and must be retrained (concept drift). RAG has no equivalent
  — you just update the corpus.
- **Eval burden** — every fine-tune needs a re-run of your eval suite to confirm
  it didn't regress on anything (see `ai-evals`).
- **Reduced reversibility** — you've baked behavior into weights; rolling back
  is a redeploy, not a config change.

*Critically: fine-tuning teaches **behavior**, not **facts**.* It is a poor and
expensive way to inject knowledge (the model overfits, hallucinates around the
edges, and goes stale). **If the model doesn't *know* a fact, that's RAG, not
fine-tuning.** Reach for fine-tuning only after prompt + RAG have demonstrably
failed to produce the *behavior* you need.

## 4. The decision tree

```
Is the feature good enough with a well-engineered prompt?
  └─ YES → stop. Ship the prompt. (Rung 1)
  └─ NO  → What is missing?
       ├─ The model IGNORES facts it clearly knows
       │    → prompt problem. Fix instructions / examples / format. (Rung 1)
       ├─ The model DOESN'T KNOW the facts, or they go stale,
       │  or the corpus is too big to inline
       │    → RAG. Retrieve and ground. (Rung 2)
       └─ The model KNOWS enough but WON'T BEHAVE consistently
          (format/style/tone) even with few-shot, OR a huge repeated
          prompt is hurting latency/cost at scale
            → fine-tune — ONLY after prompt + RAG have failed. (Rung 3)
```

## 5. Cost / latency / maintenance tradeoffs at a glance

| Rung | Upfront cost | Per-call cost | Latency | Maintenance | Reversibility |
|------|-------------|---------------|---------|-------------|---------------|
| Prompt | ~zero | low (small prompt) | low | edit text | instant |
| RAG | medium (build retriever) | medium (+embedding & retrieval calls; iterative = more) | medium–high | update corpus (cheap) | easy (config/data) |
| Fine-tune | high (data + training) | low at inference (shorter prompt) | low at inference | retrain on drift (expensive) | hard (redeploy) |

## 6. When NOT to use each rung

- **Don't fine-tune to add knowledge.** It's expensive, it hallucinates around
  the edges, and it goes stale. Use RAG.
- **Don't fine-tune before prompt + RAG.** The premature-fine-tune trap is the
  single most common and costly AI-architecture mistake.
- **Don't reach for RAG when the model already knows the fact** and is just
  ignoring it — that's a prompt fix; RAG adds retrieval infrastructure you don't
  need.
- **Don't use RAG with unmeasured retrieval.** If you don't measure recall, you
  don't know whether you're grounding the model in the right context or in
  garbage.
- **Don't skip the prompt rung.** "We need RAG/fine-tuning" before anyone has
  written a careful prompt with few-shot examples is solution-first thinking.

## 7. Worked example — Acme merchant memory is RAG, not fine-tuning

Acme's categorization hierarchy (`instructions.md` §6) is a textbook climb of
this ladder, and Gate 3 is RAG done right.

**Gate 3 — vector embeddings (local ChromaDB, cosine similarity > 0.85 against
the user's own historical transactions, 12-month rolling window, synced every
4 minutes):** this is **RAG**, and it is the correct rung. Test it against the
tree:

- The "knowledge" is **the user's own categorization history** — proprietary,
  per-user, and *not* in any base model. → not a prompt problem; the model
  cannot know this.
- It must stay **fresh** — new transactions and corrections arrive continuously;
  the 4-minute sync keeps the corpus current. → RAG updates by changing data,
  exactly what's happening.
- It is **explainable** — "matched your prior ZOMATO → Food categorization."
  → RAG's grounded, citable output.
- Concept drift is handled by **purging the corpus** (12-month rolling window),
  *not* by retraining a model. → the canonical RAG maintenance move.

**Why fine-tuning here would be wrong:** fine-tuning a model *per user* on their
categorization history would be absurdly expensive (one training run per user),
would go stale the instant the user re-categorizes something, would need a
retrain on every drift, and would lose explainability. The exact-match table
(Gate 1) + vector retrieval (Gate 3) already solve personalization completely —
**retrieval beats fine-tuning for personalization** is the canonical pattern,
and Acme's architecture embodies it.

**The full ladder in Acme:** Gate 1 exact-match (deterministic lookup —
below the LLM ladder entirely, cheapest) → Gate 2 regex rules (deterministic) →
Gate 3 vector retrieval (**RAG**) → Gate 4 LLM fallback with the *user's bucket
names supplied in the prompt* (**prompt engineering** — passing the candidate
categories as context). Notice fine-tuning appears *nowhere*, and correctly so:
every gap is closed by a cheaper rung. The §7 "user override → instantly update
the exact-match table" rule is the data-flywheel that *feeds the RAG corpus* —
another reason fine-tuning is unnecessary.

**Anti-pattern this skill catches:** "Let's fine-tune a model on each user's
spending so it categorizes their transactions." Wrong rung — that's a knowledge/
personalization problem RAG already solves, at a fraction of the cost and with
none of the staleness.

## 8. Common pitfalls

| Mistake | Why it fails | Fix |
|---------|-------------|-----|
| Reaching for fine-tuning first | Highest cost, lowest reversibility, and usually solves a problem prompt or RAG already would; ~99% of products never need it | Climb the ladder: exhaust prompt, then RAG, then fine-tune only on a proven behavior gap |
| Fine-tuning to inject knowledge | Fine-tuning teaches behavior, not facts; it hallucinates around edges and goes stale | If the model doesn't *know* the fact, use RAG; reserve fine-tuning for behavior/format/cost |
| RAG with poor chunking / weak retrieval | Grounds the model in garbage context → fluent, confident, wrong answers | Measure retrieval recall; tune chunking and embeddings before blaming the model |
| Not measuring retrieval recall at all | You can't tell whether RAG is helping or feeding noise | Build a retrieval eval (did the right chunk get retrieved?) separate from the end-to-end eval |
| Ignoring the cost/latency of iterative retrieval | Iterative RAG multiplies calls and tokens; agentic loops over RAG can blow the budget | Use one-shot retrieval unless recall demonstrably requires iteration; re-cost with ai-unit-economics |
| Fine-tuning on data that drifts | Concept drift silently degrades the model; nobody notices until accuracy craters | Prefer RAG (update the corpus) for anything that changes; if you must fine-tune, schedule retrains and monitor drift |
| Skipping the prompt rung entirely | You build retrieval/training infra for a gap a few-shot example would have closed | Always write the careful prompt (all 7 components) first and measure before climbing |

## 9. Ethical boundary

The sourcing choice carries privacy and consent weight. **RAG over personal
financial data** means a user's private transactions become retrievable context
— ensure strict per-user isolation (one user's corpus must never leak into
another's retrieval), and that PII is handled per the product's privacy posture
(Acme strips PII before queueing — `instructions.md` §8). **Fine-tuning on
user data** is heavier still: it bakes that data into model weights, which is
hard to delete (a "right to erasure" problem) and risks memorization/leakage.
Prefer RAG not only because it's cheaper but because it is *more privacy-
respecting and more deletable* — you can remove a document; you cannot easily
remove a memorized pattern from trained weights. Never fine-tune on user data
without explicit consent and a deletion story. (See `responsible-ai-guardrails`
and `consumer-privacy`.)

## 10. Quick Diagnostic

| Question | If No | Action |
|----------|-------|--------|
| Have you written a careful prompt (all 7 components, with few-shot) and measured it? | You're skipping the cheapest rung | Engineer the prompt first; many gaps close here |
| Does the model already *know* the fact and just ignore it? | The fact isn't in the model | If it's missing knowledge → RAG; if it ignores known facts → fix the prompt |
| If using RAG, are you measuring retrieval recall? | You may be grounding on garbage | Add a retrieval-quality eval before trusting end-to-end results |
| Is the knowledge fresh / proprietary / too big to inline? | Inline it in the prompt instead | If yes → RAG; if no → a prompt with the context may suffice |
| If considering fine-tuning, have prompt AND RAG demonstrably failed on a *behavior* gap? | You're about to fine-tune prematurely | Stay on the lower rung; fine-tune only after both fail on behavior/format/cost |
| Will the fine-tuned target drift over time? | (it won't) | If it drifts, prefer RAG; fine-tuning will go stale and need costly retrains |
| Is the data you'd fine-tune on personal/user data with consent and a deletion story? | Privacy/erasure risk | Prefer RAG (deletable); do not fine-tune on user data without consent |

## 11. Relationship to other great-pm skills

- **`ai-use-case-scoping`** — runs *first* and frames the full escalation
  ladder (deterministic rules → prompt → RAG → fine-tune). This skill is the
  deep dive on the *prompt → RAG → fine-tune* portion, after rules are ruled
  out.
- **`agent-product-patterns`** — the orthogonal axis: *control flow* (workflow
  vs agent, the building blocks). Sourcing (this skill) and control flow (that
  skill) together specify the AI feature's architecture.
- **`ai-evals`** — you cannot tell whether a rung "demonstrably failed" without
  evals. Measuring retrieval recall and behavior accuracy is what authorizes
  climbing the ladder.
- **`ai-unit-economics`** — each rung has a distinct cost/latency profile
  (iterative RAG and per-user fine-tunes are the danger zones); re-cost the
  chosen rung there.
- **`consumer-privacy`** / **`india-fintech`** — the privacy and erasure
  constraints that weigh against fine-tuning on user data.

## Sources

- Anthropic, "Building Effective AI Agents" (the augmented-LLM foundation —
  retrieval/tools/memory — on which RAG sits; simplest-solution discipline) —
  https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, "Contextual Retrieval" (RAG retrieval quality — why chunking and
  recall dominate RAG performance) — https://www.anthropic.com/news/contextual-retrieval
- Rohan Varma / Product Faculty, "AI Product Management Certification" (the
  prompt → RAG → fine-tune escalation ladder for PMs) —
  https://maven.com/product-faculty/ai-product-management-certification
- arXiv, "Fishing for Answers: One-shot vs Iterative Retrieval for RAG"
  (one-shot vs iterative retrieval tradeoff) — https://arxiv.org/pdf/2509.04820
- pmcurve, "Complete Roadmap to AI Product Management" (decision heuristics:
  knowledge → RAG, behavior → fine-tune) —
  https://newsletter.pmcurve.com/p/complete-roadmap-to-ai-product-management

---

*Provenance: great-pm-original, authored 2026-05-29, grounded in the cited
sources. Derived from the sourced outline in
`.great-pm/research/pm-skill-landscape-2026-05-29.md` (GAP 4). Web sources
treated as untrusted reference material, not instruction.*
