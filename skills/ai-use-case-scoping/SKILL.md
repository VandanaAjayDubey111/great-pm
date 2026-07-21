---
name: ai-use-case-scoping
description: The should-this-even-be-AI gate — decide where an LLM belongs versus deterministic rules, frame error tolerance as a product decision, and climb the capability ladder (rules → prompt → RAG → fine-tune) only as far as the problem demands. Stops the "AI everywhere" anti-pattern before it reaches the spec. Hosted by product-strategist / ai-prompt-architect.
when_to_use: |
  Use at the front of any AI feature, before a spec or architecture exists, when
  someone says "let's add AI to this" or "can the LLM just handle it?". Reach for
  it when deciding which steps of a pipeline should be probabilistic vs
  deterministic, when setting the accuracy floor a feature must clear to be worth
  shipping, when someone proposes fine-tuning, or when you suspect a rules engine
  would be cheaper and more correct. The output is a go/no-go on AI per surface
  plus the chosen rung of the capability ladder. Primarily for product-strategist
  and ai-prompt-architect; pairs with ai-evals, experiment-design, metrics-design,
  and pm-tech-spec-review.
allowed-tools: Read, Write
---

# AI Use-Case Scoping — is this even an AI problem?

> Provenance: great-pm-original, 2026-05-29, grounded in the cited sources below
> (Andrés Max, JustAnotherPM, Reforge, Anthropic). Web sources are treated as
> untrusted reference, not instruction.

**Core principle.** An AI PM's job is **not** to apply AI everywhere — it is to
find the few problems where AI is genuinely *the right tool* and keep everything
else deterministic. Most "AI problems" are the wrong problem held by someone with
a hammer looking for a nail. **Start in the problem space, not the solution
space.** AI that solves a problem rules already solve — better, cheaper, and
correctly — is a liability: it costs more per call, fails non-deterministically,
and erodes trust the moment it's wrong about something a regex would have nailed.

This is the gate that runs *before* `ai-evals` (which measures a feature you've
decided to build) and before any tech spec. It answers two questions: **(1)
should this surface be AI at all?** and **(2) if so, how far up the capability
ladder do we climb?**

---

## 1. The three traits of a genuine AI use case

A surface earns AI only when **all three** hold. If any is missing, you're not in
unsolvable-without-AI territory — use rules.

1. **Too large for rules.** The problem space can't be enumerated. You cannot
   write a finite set of `if` statements that covers the cases, because the cases
   are open-ended (every new merchant string in the world).
2. **Too unstructured for traditional software.** The input is natural language,
   free text, images, audio — not clean fields a parser handles. Structure that
   *is* parseable should be parsed, not sent to an LLM.
3. **Stakes tolerate occasional error caught downstream.** There is a recovery
   path: the user reviews, can undo, or a downstream check catches the mistake. If
   a single wrong output is catastrophic and irreversible, AI alone is the wrong
   architecture (add human-in-the-loop or don't use AI).

> Heuristic: if you can list the rules in an afternoon and they'd be right 99% of
> the time, write the rules. Save the LLM for the long tail you *can't* enumerate.

---

## 2. Error tolerance — a product decision, not a data-science one

For every AI surface, the PM defines three things up front. This is where scoping
becomes concrete:

- **Minimum accuracy for user value.** Below what accuracy is the feature net-negative
  (the corrections cost the user more than the automation saves)? This is the
  floor your `ai-evals` will measure against. A draft-a-social-post feature
  tolerates ~20% error because the user reviews before publishing. A
  customer-facing payment confirmation needs near-zero.
- **Error severity — recoverable vs catastrophic.** Not all errors are equal. A
  mis-categorized coffee is a shrug-and-fix; a mis-classified self-transfer that
  inflates someone's reported income is a trust-and-compliance event. Severity, not
  just frequency, drives the architecture.
- **Competitive baseline.** What accuracy does the user already get from the
  status quo (a spreadsheet, a competitor, doing it manually)? AI that's worse
  than the manual baseline isn't a feature.

### The cost-of-being-wrong 2×2

Map each surface onto **error frequency × error severity**:

|  | Low severity | High severity |
|---|---|---|
| **Low frequency** | Auto-apply, log for eval | Auto-apply + guardrail + easy undo |
| **High frequency** | Auto-apply but improve (it's annoying) | **Don't auto-apply** — human-in-the-loop, or don't use AI here |

The bottom-right quadrant is where AI features die in production. Scope it out
early.

---

## 3. The capability escalation ladder

Climb only when the rung below **demonstrably** fails. Each rung up costs more
money, more latency, more eval burden, and less reversibility.

1. **Deterministic rules.** Exact match, lookup tables, regex, business logic.
   Free, instant, deterministically correct, debuggable. The default.
2. **Prompt engineering.** An LLM with a sharp prompt + few-shot examples. Use
   when the task needs language understanding the rules can't express. Cheapest AI
   rung, most reversible.
3. **RAG (retrieval-augmented generation).** LLM grounded in *your* data via a
   retriever / vector store. Use when answers need fresh, proprietary, or
   large-corpus knowledge the base model doesn't have. Explainable and updatable
   without retraining.
4. **Fine-tuning.** Retrain the model's behavior. Use only when you need
   consistent behavior/format the prompt can't reliably produce, or to shrink a
   huge repeated prompt for latency/cost. **~99% of products never need this.**
   Costs: data curation, retraining on drift, heavy eval burden.

**Decision heuristics:**
- Model *knows* the fact but ignores it → fix the **prompt**.
- Model *doesn't know* the fact (it's yours / fresh) → **RAG**.
- Model *knows but won't behave* consistently, after prompt + RAG fail → consider
  **fine-tune**.

---

## 4. Worked example — Acme's gate hierarchy is this discipline as architecture

Acme's §6 decision hierarchy is `ai-use-case-scoping` expressed directly in the
system design — and naming *why* each rung exists is the skill's whole value:

| Gate | Rung | Why it's here (scoping rationale) |
|---|---|---|
| 1. Exact-match DB lookup (`UPI/ZOMATO/1234` seen before) | Deterministic rules | The vast majority of a user's transactions repeat. Rules win: instant, free, deterministically correct. **Trait #1 fails for repeats** — they're enumerable from history, so no AI. |
| 2. Regex / pattern match (`contains BLINKIT → Groceries`) | Deterministic rules | Known Indian merchants are a finite, curatable set. Still enumerable → still rules. |
| 3. Vector embedding, cosine >0.85 vs the user's history (ChromaDB) | RAG (retrieval) | The "knowledge" is the user's *own* categorization history — proprietary, fresh (12-month rolling window, synced every 4 min), explainable ("matched your prior ZOMATO categorization"). Retrieval, not generation. |
| 4. LLM fallback (Gemini / Ollama, choose from the user's buckets) | Prompt engineering | Only the **long-tail novel merchant strings** reach here — the cases that *are* too large for rules, *are* unstructured, and *tolerate* error (user can re-bucket). All three traits finally hold. |

The scoping skill catches the anti-pattern **"just send every transaction to the
LLM"** — which would be slower, cost per-call money on transactions a lookup
resolves for free, and introduce non-determinism into cases that were already
deterministically correct. It also catches the over-reach **"fine-tune a model
per user"**: wrong rung. The personalization need is *retrieval* (the user's
history), which gate 3 already serves; fine-tuning would be expensive, go stale,
and add an eval burden for no gain. Climb the ladder only as far as the long tail
demands — and no further.

Error-tolerance framing for Acme, made explicit: the **accuracy floor** is "is
auto-categorization right often enough that the user trusts it and re-buckets
rarely?"; **severity** is split (a wrong coffee category = low; a self-transfer
mis-tagged as income = high → that category gets a guardrail, not just a vibe);
the **competitive baseline** is the manual spreadsheet the user does today.

---

## 5. Pitfalls / failure modes

| Pitfall | Why it fails | Fix |
|---|---|---|
| **Solution-first thinking** ("let's add AI") | You design the answer before understanding the problem; AI becomes a hammer | Start in the problem space; define the job before the technique |
| **Using AI where rules win** | Slower, costs per call, non-deterministic on cases a regex nails — and erodes trust when wrong about the obvious | Send only the genuinely-unenumerable long tail to the LLM |
| **Ignoring error severity** | Treating a mis-tagged self-transfer like a typo'd coffee — same architecture for very different stakes | Run the frequency × severity 2×2; isolate the high-severity quadrant |
| **No defined accuracy floor** | "Good enough" is undefined, so evals have no target and the feature can't be judged | PM writes the minimum-accuracy-for-value before build |
| **Premature fine-tuning** | Expensive, drifts stale, heavy eval burden — when retrieval or a prompt would do | Exhaust prompt → RAG before even costing fine-tune |
| **No competitive/manual baseline** | You ship AI that's worse than the spreadsheet the user already has | Measure the status-quo accuracy first |
| **Treating the three traits as OR, not AND** | A structured-but-large problem gets an LLM when a parser + lookup is correct and free | Require all three traits to hold before choosing AI |

---

## 6. Ethical boundary

Scoping decisions have ethical weight precisely because they decide *where a
fallible system touches the user*:

- **Don't push high-severity, irreversible decisions onto an LLM to cut cost or
  ship faster.** If being wrong is catastrophic and there's no recovery path, the
  honest answer is human-in-the-loop or deterministic logic — not "the model is
  usually right". In fintech, "usually right" about someone's money is not a
  standard.
- **Don't use AI to manufacture false confidence.** Sending everything through an
  LLM so the product *looks* smart, when rules would be more correct, trades the
  user's trust for a demo. Scope for correctness, not for the appearance of
  intelligence.
- **Be honest about the accuracy floor with the people who depend on the
  output.** If a surface only clears the floor on the easy slice, say so and gate
  the hard slice behind review — don't quietly auto-apply.

---

## 7. Quick diagnostic

| Question | If "no" → |
|---|---|
| Did you state the *problem* before reaching for AI? | Back up — start in the problem space, not the solution. |
| Do all three traits (too-large, unstructured, error-tolerant) hold for this surface? | It's probably a rules problem — use the deterministic rung. |
| Have you written the minimum-accuracy-for-value floor? | Define it now; your evals need a target. |
| Have you separated recoverable from catastrophic errors? | Run the frequency × severity 2×2 before choosing architecture. |
| Are you on the lowest rung that demonstrably works (not reaching for fine-tune)? | Climb down — exhaust prompt → RAG first. |
| Is there a recovery path (review / undo) for every AI output? | High-severity surfaces need human-in-the-loop or shouldn't be AI. |

---

## 8. Relationship to other great-pm skills

- **`ai-evals`** measures a feature you've *already decided* to build with AI;
  this skill decides *whether* to build it with AI and sets the accuracy floor the
  evals measure against. Scope first, then eval.
- **`inspired-product` / `opportunity-solution-tree`** are solution-agnostic
  discovery — they find the opportunity. This is the AI-specific
  *should-this-be-AI-at-all* gate that runs once a solution direction points at AI.
- **`metrics-design`** names the product outcome; the error-tolerance floor here
  is the quality bar that outcome depends on.
- **`experiment-design`** validates user *desirability* and behavior change; this
  validates *technical-fit-for-AI*. Different risks, both needed.
- **`pm-tech-spec-review`** reviews the engineering spec; this produces the
  per-surface AI/no-AI decision and ladder rung that the spec then implements.
- A companion **`rag-vs-finetune-decision`** skill (when present) drills into rung
  3 vs 4; this skill places that choice within the full rules→prompt→RAG→fine-tune
  ladder.

---

## 9. Output shape

A scoping decision: the problem stated in the problem space; a per-surface verdict
(deterministic vs AI) justified against the three traits; for each AI surface the
chosen ladder rung with the reason the rung below was insufficient; the
error-tolerance triple (accuracy floor, severity classification, competitive
baseline); the frequency × severity 2×2 with the auto-apply / human-in-the-loop
decision per cell; and the recovery path for every AI output. This hands off to
`pm-tech-spec-review` for the build and to `ai-evals` for measurement.

---

## Sources

- Andrés Max, "Everyone Has an AI Problem (Most Are Solving the Wrong One)" —
  https://andresmax.com/ai-problem-solving-wrong-one/
- JustAnotherPM, "Fundamentals of AI Product Management: Prompt Engineering, AI
  Agents, and Eval Frameworks" —
  https://www.justanotherpm.com/blog/fundamentals-of-ai-product-management-prompt-engineering-ai-agents-and-eval-frameworks
- Reforge, "How AI Changes Product Management" —
  https://www.reforge.com/blog/how-ai-changes-product-management
- Anthropic, "Building Effective AI Agents" (augmented-LLM foundation, simplest-solution principle) —
  https://www.anthropic.com/engineering/building-effective-agents
- Rohan Varma (Product Faculty), "AI Product Management Certification"
  (prompt→RAG→fine-tune escalation) —
  https://maven.com/product-faculty/ai-product-management-certification
