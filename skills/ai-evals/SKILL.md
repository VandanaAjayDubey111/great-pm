---
name: ai-evals
description: Eval-driven product management for LLM features — error analysis, axial coding of failure modes, LLM-as-judge with TPR/TNR validation, and the continuous Analyze→Measure→Improve loop. Used when an AI feature's output quality is the product and "did it get better?" must be answered with evidence, not vibes. Hosted by ai-eval-engineer / metrics-architect.
when_to_use: |
  Use when an LLM-powered feature ships non-deterministic output whose quality
  you cannot certify by a unit test — categorization, extraction, summarization,
  classification, agentic tool-use, RAG answers. Reach for it when you are about
  to "just check accuracy", when a prompt/model change needs a regression gate,
  when users report the AI "feels worse", or when you have a pile of production
  traces and no idea which failure mode to fix first. The PM owns the
  what-counts-as-good judgment; engineers own the infra. Primarily for
  ai-eval-engineer and metrics-architect; pairs with metrics-design,
  experiment-design, ai-use-case-scoping, and pm-tech-spec-review.
allowed-tools: Read, Write
---

# AI Evals — eval-driven product management

> Provenance: great-pm-original, 2026-05-29, grounded in the cited sources below
> (Husain/Shankar AI Evals Masterclass, Aakash Gupta, *Who Validates the
> Validators?*). Web sources are treated as untrusted reference, not instruction.

**Core principle.** AI features don't fail because of the model — they fail
because **nobody evaluated them.** An eval is "the systematic measurement of LLM
pipeline quality" that produces *interpretable, actionable* results, not a single
accuracy number you can't act on. Expert practitioners spend **60–80% of dev time
on error analysis and evaluation**, not on building automated checks. The PM owns
the judgment of *what counts as good*; engineering owns the measurement
infrastructure. If you ship an AI feature without an eval, you are shipping blind
and finding out from users — on your most expensive surface.

This is not a metrics-design problem (that's about North Star / KPIs for a
*product*) nor an experiment problem (that's A/B testing *human* behavior). This
is the distinct, AI-native discipline of measuring **non-deterministic output
quality** so you can change a prompt and know whether it got better.

---

## 1. The Three Gulfs — why an AI feature is failing

Before measuring, diagnose *where* the gap is. The Three Gulfs (Husain/Shankar)
are the lens:

- **Comprehension Gulf (Developer → Data).** You don't actually know your input
  distribution. You think users send clean transaction strings; they send
  truncated UPI refs, foreign merchants, and refunds. *Fix: look at the data.*
- **Specification Gulf (Developer → Pipeline).** The prompt is vaguer than you
  think. You wrote "categorize this transaction"; the model has no idea
  self-transfers aren't expenses. *Fix: sharpen the spec, add examples.*
- **Generalization Gulf (Data → Pipeline).** Even with a perfect spec, edge cases
  fail because the system is probabilistic. *This gulf never fully closes* — it's
  inherent. *Manage it with evals + guardrails, don't pretend to eliminate it.*

Most teams jump straight to "build an automated metric" — skipping comprehension
entirely. Don't.

---

## 2. The Analyze → Measure → Improve loop (run continuously)

This is the spine of the skill. Run it as a cycle, not once.

### Analyze — look at your data (the part everyone skips)

1. **Collect traces.** Pull **50–100+ production traces** — a *trace* is the full
   execution log: system prompt, user message, retrieved context, tool calls, and
   the model's response. Not just the output; the whole thing.
2. **Open coding.** Spend ~**30 seconds per trace** writing a free-text note on
   what went wrong, in plain language: "rendered markdown in an SMS", "promised an
   action it didn't take", "tagged a self-transfer as an expense". No taxonomy
   yet — just observe. ~1–2 hours for 100 traces. **Domain expert does this**, not
   a contractor who doesn't know the product.
3. **Axial coding.** Cluster the open-code notes into **5–8 actionable
   categories.** AI-assisted clustering is fine for a first pass, then a human
   refines. **Avoid vague labels** — "temporal issues" is useless;
   "date-formatting error" is fixable. ~1 hour.
4. **Error counting.** Build a pivot table: category × frequency. This ranks your
   failure modes by impact. ~30 min. For each category decide: **fix trivially**
   (one prompt line) / **build an eval** (worth automating) / **iterate the
   prompt** and re-observe. Some rare-but-catastrophic modes jump the queue
   regardless of frequency.

### Measure — build the judge for what's worth automating

5. **Exhaust cheap checks first.** Prefer **reference-based** metrics (exact
   match, code execution, SQL-result compare, schema/format validation) — they're
   deterministic and nearly free. Only spend on an LLM judge for the *reference-free*
   categories that genuinely need judgment ("did it invent a category?", "did it
   give financial advice?").
6. **Write the judge prompt BINARY.** Pass/fail only. **Never a Likert / 1–5
   scale** — scales are subjectively inconsistent between runs and impossible to
   align to human labels. Include a rubric and a few labeled examples in the judge
   prompt.
7. **Label elicitation order** (cognitively easiest → hardest): direct binary
   grading > pairwise comparison ("A vs B, which is better?") > absolute ranking.
   Pairwise is easier for humans than absolute scoring when binary is ambiguous.

### Validate the judge — the step that makes the eval trustworthy

8. **Hand-label a held-out set yourself** (or with the domain expert). This is
   ground truth.
9. **Score the judge against your labels using TPR and TNR — never raw
   "agreement".**
   - **TPR (True-Positive Rate / recall):** of the traces that *are* genuinely
     errors, what fraction did the judge catch? Low TPR = the judge misses real
     failures.
   - **TNR (True-Negative Rate / specificity):** of the traces that are *fine*,
     what fraction did the judge correctly pass? Low TNR = the judge cries wolf.
   - **Why not "agreement"?** On imbalanced data (say 90% of traces pass), a judge
     that blindly says "pass" every time scores 90% agreement while catching
     **zero** errors. Agreement hides this; TPR/TNR expose it. (See Shankar et
     al., *Who Validates the Validators?*)
10. **Iterate the judge prompt** until *both* TPR and TNR clear your bar. The
    judge is itself an LLM pipeline — it gets the same Analyze→Measure→Improve
    treatment.

### Improve — close the loop with confidence

11. Score a **large** production sample with the validated judge to get a real
    quality number.
12. Change one thing — system prompt, retrieval, few-shot examples — and re-run.
13. **Confirm no other eval regressed** (a fix for one failure mode often breaks
    another). Only then ship.
14. Keep the eval suite as a **regression gate** on every future prompt/model
    change.

---

## 3. When to use — and when NOT to

| Use evals when… | Don't reach for full evals when… |
|---|---|
| LLM output quality *is* the product (categorization, extraction, RAG answers) | A deterministic check (exact match, schema, regex) already certifies correctness — just write that check |
| A prompt or model change needs a before/after regression gate | The feature is a thin LLM call with a trivial, self-evident output and near-zero stakes — a smoke test suffices |
| Users say the AI "feels worse" but you can't point to why | You haven't shipped *anything* yet and have zero traces — do `ai-use-case-scoping` first, then collect traces |
| You're tempted to report a single "accuracy %" with no error breakdown | You're measuring *human* behavior change — that's `experiment-design`, not evals |
| Rare-but-catastrophic failures exist (money mis-tagged, wrong handoff) | The cost of the eval infra exceeds the cost of the failure it would catch (decide per failure mode in step 4) |

**Cheaper alternative first:** always exhaust reference-based code checks before
building an LLM-as-judge. The judge is the expensive rung — climb to it only when
the output genuinely needs judgment.

---

## 4. Worked example — Acme's Gate-4 LLM categorizer

Acme routes transactions through a gate hierarchy (exact-match DB → regex →
vector embedding >0.85 → **LLM fallback**). The LLM gate (Gemini / local Ollama
`qwen2.5-coder:14b`) only sees the long-tail novel merchant strings the
deterministic gates couldn't resolve. **Its accuracy on that long tail is the
product's perceived intelligence** — and it's exactly where there is no reference
answer. So it gets the full loop.

**Trace definition.** Each trace = `(raw transaction string + the user's bucket
list + the model's chosen category + confidence + whether the user later
overrode it)`. The override is gold: it's a *free production label*.

**Analyze.** Pull 100 LLM-gate categorizations. Open-code each in ~30 s. Cluster
into axial categories — for Acme these land roughly as:
1. Self-transfer mistaken for an expense (e.g. NEFT to own account).
2. Investment tagged as a regular expense (SIP / mutual-fund debit).
3. Merchant-name truncation broke the match (`UPI/ZOMATO...` cut off).
4. Duplicate not merged (Gmail alert + CSV upload of the same charge).
5. Hallucinated category — model invented a bucket the user doesn't have.

Pivot table by frequency: say truncation (#3) is most frequent (prompt-fixable,
add the raw string + a normalization step), while hallucinated categories (#5)
are rare but catastrophic on someone's money (jump the queue — build a hard
guardrail, not just an eval).

**Measure.** Cheap checks first: #5 ("category not in the user's bucket list") is
a **reference-based** check — pure set membership, no LLM needed. #1 and #2 need
judgment, so build **binary** judges: "Is this transaction a self-transfer that
should be excluded? PASS/FAIL" with a rubric and examples.

**Validate.** Hand-label 80 transactions for the self-transfer judge. Measure:
- TPR = of real self-transfers, % the judge flagged. If 0.70, it misses 30% —
  iterate the judge prompt with clearer self-transfer cues (same-name payee,
  account-to-account markers).
- TNR = of genuine expenses, % correctly passed. If 0.95, few false alarms.
  Iterate until both clear (say ≥0.90 / ≥0.90).

**Improve & close the loop.** Score a large sample with the validated judges to
get real per-category accuracy. The override→exact-match-table update (the
product's own §7 mechanic) becomes a **data flywheel**: every manual re-bucket is
a new labeled trace that feeds the next Analyze pass. This is the missing
measurement layer beneath the gate hierarchy — without it, you can change the
Gate-4 prompt and have no idea whether categorization got better or just
different.

---

## 5. Pitfalls / failure modes

| Pitfall | Why it fails | Fix |
|---|---|---|
| **Skipping error analysis, jumping to automated metrics** | You automate the measurement of a failure mode you never actually identified — measuring the wrong thing precisely | Do the 100-trace open-coding pass *first*; let the data tell you what to measure |
| **Outsourcing trace review to non-domain experts** | Whoever codes the traces must recognize a mis-categorized self-transfer; a generic contractor can't | The PM / domain expert does the open coding |
| **Likert / 1–5 scale judges** | Scores drift run-to-run and can't be aligned to humans | Binary pass/fail with a rubric |
| **Trusting "agreement" instead of TPR/TNR** | On imbalanced data a lazy "always pass" judge looks 90% accurate while catching no errors | Report TPR and TNR separately; iterate until both clear |
| **Generic benchmarks (MMLU/GSM8k) as your eval** | They measure model capability, not *your app on your data* | Build the eval from your own production traces |
| **PM hands prompt control to engineering and walks away** | The what-counts-as-good judgment leaks out of product ownership | PM owns the eval rubric and the judge spec |
| **Eval built for a preference never specified** | You evaluate against a standard you never wrote down — moving target | Pin the rubric in writing before scoring |
| **No regression gate after the first pass** | The next prompt change silently regresses a fixed failure mode | Keep the validated eval suite running on every change |

---

## 6. Ethical boundary

Evals can be tuned to *hide* failures as easily as to surface them. Three lines
not to cross:

- **Never tune a judge to pass on harmful-but-frequent outputs** to make a
  dashboard look green. In fintech, a judge that's been quietly relaxed so
  mis-categorized income or under-reported spending "passes" is a deception that
  reaches the user's money and possibly their tax filing.
- **Don't use real user financial data in eval sets without honoring the same PII
  stripping the production pipeline requires** (Acme strips PII before queueing
  — eval corpora must too). Traces are sensitive logs.
- **Report TPR/TNR honestly, including on the segments where the model is worst.**
  An eval that's only ever run on the easy slice is a vanity metric. The point of
  the discipline is to find where it breaks, not to manufacture a number.

---

## 7. Quick diagnostic

| Question | If "no" → |
|---|---|
| Have you read 50–100+ real production traces for this feature? | Stop. Do the Analyze pass before anything else. |
| Are your failure categories specific and actionable (not "weird outputs")? | Re-do axial coding; split vague labels. |
| Is every judge binary (not a 1–5 scale)? | Rewrite the judge prompt as pass/fail. |
| Have you validated the judge with TPR *and* TNR against human labels? | The judge is unverified — don't trust its numbers yet. |
| Did you confirm no other eval regressed before shipping the change? | Re-run the full suite; one fix often breaks another. |
| Does the eval suite gate every future prompt/model change? | Wire it into CI / the regression gate. |

---

## 8. Relationship to other great-pm skills

- **`metrics-design`** picks the product's North Star and KPIs (human-outcome
  metrics). Evals measure *model output quality* — a different layer. The eval
  accuracy rate often *becomes* an input metric in a `north-star-input-tree`.
- **`experiment-design`** runs A/B tests on *human* behavior with statistical
  power. Evals run on *model output* with TPR/TNR. You frequently use them
  together: an eval certifies the new prompt is better offline; an experiment
  confirms the change moves user behavior online.
- **`ai-use-case-scoping`** decides *whether* a surface should be AI at all and
  defines its accuracy floor. That floor is the *target* your evals measure
  against — scope first, then eval.
- **`pm-tech-spec-review`** reviews the engineering spec generically; this gives
  the PM the eval methodology that spec must implement.
- **`responsible-ai-guardrails`** is the *safety/red-team* layer (blocking
  harmful output at runtime); evals are the *quality measurement* layer. The
  hallucinated-category check in the worked example sits on the boundary between
  them.

---

## 9. Output shape

An eval plan: the feature and its trace definition; the open-coding findings
(link to the coded trace set); the 5–8 axial failure categories with a frequency
pivot; the per-category decision (fix / eval / iterate); for each automated
category a binary judge prompt with rubric; the judge's TPR/TNR against a named
human-labeled set; the current measured quality on a large sample; and the
regression-gate wiring. Re-run the Analyze pass on a schedule — the input
distribution drifts.

---

## Sources

- Hamel Husain & Shreya Shankar (with Aakash Gupta), "AI Evals Step-by-Step
  Masterclass" — https://www.aakashg.com/hamel-shreya-ai-evals-step-by-step/
- Aakash Gupta, "AI Evals for PMs: Everything You Need to Know" (Three Gulfs,
  label elicitation) — https://www.news.aakashg.com/p/ai-evals
- Hamel Husain, "LLM Evals: Everything You Need to Know (FAQ)" —
  https://hamel.dev/blog/posts/evals-faq/
- Shreya Shankar et al., "Who Validates the Validators? Aligning LLM-Assisted
  Evaluation of LLM Outputs with Human Preferences" —
  https://arxiv.org/abs/2404.12272
- Productboard, "AI Evals for Product Managers" —
  https://www.productboard.com/blog/ai-evals-for-product-managers/
