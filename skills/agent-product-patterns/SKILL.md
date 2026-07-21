---
name: agent-product-patterns
description: The workflow-vs-agent decision and the seven Anthropic building-block patterns (augmented LLM, prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer, autonomous agent). Gives the PM the vocabulary and decision tree to scope an AI feature's control flow BEFORE the engineering spec exists — and the discipline to not build an agent when a workflow suffices. Used by ai-prompt-architect and architect.
when_to_use: |
  Use when scoping the control-flow architecture of an AI feature — deciding
  whether a task needs a fixed workflow or a dynamic agent, which building-block
  pattern fits, and where to set autonomy limits. Run AFTER ai-use-case-scoping
  has confirmed the feature should use an LLM at all, and BEFORE the engineering
  tech spec is written. Primarily for ai-prompt-architect and architect; informs
  the PRD's "how it works" section. NOT a code review and NOT a model-choice
  decision (that's rag-vs-finetune-decision).
allowed-tools: Read, Write
---

# Agent Product Patterns — workflow vs agent, and the building blocks

The most expensive mistake in AI product design is building an **autonomous
agent** when a **workflow** would have been cheaper, faster, more predictable,
and easier to debug. Anthropic's central finding from production deployments:
the most successful implementations use **simple, composable patterns — not
complex frameworks or fully autonomous agents.** The PM's job here is to match
the *minimum control mechanism* to the *observed failure mode*. Every step up
the complexity ladder buys flexibility at the cost of latency, money, and
debuggability — so you climb only when the rung below demonstrably fails.

This skill gives you the vocabulary to make that call *before* the spec is
written, so engineering builds the right shape the first time.

## 1. The core distinction: workflow vs agent

Anthropic draws one line that governs everything else:

- **Workflow** — an LLM (and tools) orchestrated through **predefined code
  paths.** The control flow is written by you, in code. The LLM fills in the
  cognitive steps, but *what happens next* is decided by your program.
  Predictable, consistent, testable, cheap to reason about.
- **Agent** — an LLM that **dynamically directs its own process and tool use,**
  maintaining control over how it accomplishes a task. The control flow is
  decided by the model at runtime. Flexible, capable of open-ended work — and
  unpredictable, harder to test, more expensive, and capable of "losing the
  plot."

**The baseline rule: find the simplest solution possible, and only increase
complexity when needed.** Agentic systems often trade latency and cost for
better task performance — you should ask whether that tradeoff is one your
product can actually afford. Many "AI features" that teams want to build as
agents are really fixed sequences wearing an agent costume.

## 2. The building-block taxonomy (Anthropic)

These are the composable patterns, ordered from foundation to most autonomous.
The first is the substrate; patterns 2–6 are **workflows**; pattern 7 is the
**agent**.

### 2.0 Augmented LLM (the foundation)

An LLM enhanced with **retrieval, tools, and memory.** Every pattern below is
built on this. The model can pull in context (retrieval), take actions (tools),
and remember across turns (memory). *Why it works:* it extends the model's
reach beyond its training data and a single prompt without surrendering
control flow. Invest here first — a well-documented tool layer and a clean
retrieval interface pay off in every pattern above it.

### 2.1 Prompt chaining (workflow)

Decompose a task into a **fixed sequence of steps**, where each LLM call
processes the output of the previous one, with **programmatic checks (gates)**
between steps. *When it fits:* the task cleanly decomposes into fixed subtasks
known in advance (e.g., outline → validate outline → write → translate).
*Why it works:* each call does one simpler thing, so accuracy rises; the gates
catch failures early. *Cost:* trades latency (more sequential calls) for
accuracy.

### 2.2 Routing (workflow)

**Classify the input, then dispatch it** to a specialized downstream path — or
to a cheaper vs more-capable model. *When it fits:* inputs fall into distinct
categories that are better handled separately, and classification is reliable.
*Why it works:* separation of concerns lets each path be tuned for its case
without one prompt trying to do everything; routing easy cases to a small model
is also a major cost lever (see `ai-unit-economics`).

### 2.3 Parallelization (workflow)

Run LLM calls simultaneously, then aggregate. Two variants:
- **Sectioning** — split independent subtasks across parallel calls (e.g., one
  call answers, a parallel call screens for policy violations).
- **Voting** — run the *same* task N times and take a majority/threshold for
  confidence.
*When it fits:* subtasks are independent (speed) or you want multiple
perspectives / a confidence signal. *Why it works:* parallel sectioning cuts
wall-clock latency; voting trades cost for reliability on high-stakes judgments.

### 2.4 Orchestrator-workers (workflow)

A central **orchestrator LLM dynamically decomposes** a task, delegates
subtasks to worker LLMs, and **synthesizes** their results. *When it fits:* you
*cannot* predict the subtasks in advance — the decomposition itself depends on
the input (e.g., "make these changes across an unknown set of files"). *Why it
works:* it keeps the flexibility of dynamic decomposition while still bounding
the structure (decompose → delegate → synthesize). This is the closest workflow
to an agent — the key difference is the orchestration is still a fixed shape.

### 2.5 Evaluator-optimizer (workflow)

A **generator** produces a response; an **evaluator** critiques it against
criteria; the generator revises; loop until the evaluator passes. *When it
fits:* you have *clear, articulable evaluation criteria* AND iterative
refinement measurably improves the output (e.g., literary translation, complex
search where a critic can say "you missed X"). *Why it works:* it mirrors the
human draft-and-edit loop. *Caveat:* worthless if you can't write good criteria
— then the evaluator just adds cost and noise.

### 2.6 Autonomous agent (the agent)

The LLM operates in a **loop**: plan → act with tools → observe environmental
feedback → re-plan, continuing until it judges the task complete or hits a
limit. *When it fits:* open-ended problems where the number and sequence of
steps **cannot be predicted** and you cannot hardcode a path. *Why it works:*
genuine autonomy on genuinely unbounded tasks. *Critical caveats:*
- **Set explicit stopping conditions / iteration caps.** ReAct-style agents
  tend to "lose the plot after 5–6 tool calls" as context dilutes and errors
  compound. Cap the loop.
- Cost and latency scale with the number of steps — and steps are
  unpredictable, so the *cost is unpredictable* (a unit-economics hazard).
- Test extensively in a sandbox; a tool with side effects + an autonomous loop
  is how you get runaway actions.

## 3. The three build principles (apply to every pattern)

Anthropic's guidance for whatever you build:
1. **Maintain simplicity** in the design. Resist adding patterns speculatively.
2. **Prioritize transparency** — make the planning/steps visible to the user
   so they can see *why* the system did what it did (this also feeds
   `ai-ux-patterns` trust signals).
3. **Engineer the agent–computer interface (ACI)** — invest as much in tool
   documentation and testing as you would in a human-facing UI. Most agent
   failures are bad tool definitions, not bad reasoning.

## 4. When to use this skill

| Trigger | Why this skill helps |
|---------|----------------------|
| An AI feature is described as "an agent that…" | Pressure-test whether it's really a fixed workflow wearing an agent costume |
| The team is reaching for a framework (LangGraph, CrewAI, etc.) | Frameworks hide the prompts and control flow; pick the *pattern* first, framework later (or never) |
| A multi-step LLM task is being specced | Name the pattern (chaining / routing / orchestrator) so eng builds the right shape |
| Latency or cost is ballooning on an AI feature | Often a too-autonomous pattern where a workflow would do; or a missing iteration cap |
| You need to set an autonomy/approval boundary | The taxonomy tells you where the human-in-the-loop checkpoints belong |

## 5. When NOT to use this skill

- **Before `ai-use-case-scoping`.** If you haven't confirmed the task even
  belongs to an LLM (vs deterministic rules), control-flow patterns are
  premature. Most transactions in a categorization product should never touch
  an LLM at all.
- **For a single LLM call.** If the feature is one prompt in, one response out,
  you have an *augmented LLM*, full stop — no pattern decision to make. Don't
  manufacture orchestration.
- **For the model-sourcing decision.** Whether knowledge comes from the prompt,
  RAG, or fine-tuning is a *different* axis — that's `rag-vs-finetune-decision`.
  This skill is purely about *control flow*.
- **For pure deterministic logic.** If `if/else` or a regex fully solves it,
  there is no pattern here — and an LLM is the wrong tool (cheaper alternative:
  code).

## 6. Worked example — Acme statement ingestion is a workflow, not an agent

Acme's PDF/statement ingestion pipeline is contractual (documented in the
repo's harness rules, enforced by tests):

```
probe → fingerprint → layout-cache lookup
  → (hit)  extract-with-schema → dedup → archetype → Gate 1 (exact match)
           → rules → Gate 2 → queue → Gate 3 (vector) → Gate 4 (LLM)
  → (miss) queue a layout-detection job
```

**Verdict: this is a workflow — specifically prompt chaining + routing — and
that is the correct call.** Walk it through the taxonomy:

- The control flow is **predefined in code**, not decided by a model. Each
  stage's "what happens next" is fixed. → workflow, by definition.
- The cache-hit-vs-miss fork is **routing** (classify the input, dispatch to a
  path).
- The gate hierarchy (exact-match → regex → vector → LLM) is **prompt chaining
  with programmatic gates** — and notably, most stages are *deterministic code*,
  not LLM calls at all. The LLM (Gate 4) is the *last resort*, reached only when
  cheaper deterministic gates fail.
- This earns Anthropic's "predictable, needs consistency" stamp: ingesting
  someone's bank statement must be repeatable and auditable. An autonomous agent
  freelancing over the steps would be slower, costlier, non-deterministic, and
  far harder to debug when a user's statement parses wrong.

**Where an agent *would* be the right call (a future Acme feature):** an
open-ended investigation — *"this recurring ₹2,400 charge looks suspicious;
figure out what it is."* The steps are genuinely unpredictable: search the
user's history, cross-reference merchant variants, check for a matching
subscription email, compare to similar users' resolutions. You can't hardcode
that path → autonomous agent (2.6), with a hard iteration cap and a
human-in-the-loop confirmation before any action (e.g., flagging it as
fraud). The skill's discipline: reserve the agent pattern for the genuinely
open-ended surface, and keep ingestion a workflow.

**Anti-pattern this skill catches:** "Let's make ingestion an autonomous agent
that figures out how to parse any statement." That replaces a fast,
deterministic, cacheable pipeline with an unpredictable, expensive loop — and
loses the layout-cache leverage entirely.

## 7. Common pitfalls

| Mistake | Why it fails | Fix |
|---------|-------------|-----|
| Building an autonomous agent when a workflow suffices | Pays latency, cost, and unpredictability for flexibility the task never needed; harder to debug and test | Start at the simplest pattern; climb only when the simpler one demonstrably underperforms on real traces |
| No iteration cap on an agent / ReAct loop | Agents "lose the plot after 5–6 tool calls"; context dilutes, errors compound, cost runs away | Set explicit stopping conditions and a max-iteration limit; surface partial progress on timeout |
| Framework-first (LangGraph/CrewAI) before pattern-first | The framework hides the prompts and control flow, so you can't see or test what's actually happening | Choose the *pattern* and write the prompts directly; adopt a framework only if it earns its abstraction |
| Opaque planning — user can't see why the system acted | Erodes trust; users can't tell a reasonable decision from a wrong one | Make planning steps transparent (build principle #2); ties to `ai-ux-patterns` |
| Under-documented / untested tools (weak ACI) | Most agent failures are bad tool definitions, not bad reasoning — the model misuses a poorly described tool | Treat tool docs + tests like a human UI; invest in the agent–computer interface (build principle #3) |
| Picking orchestrator-workers when subtasks ARE predictable | Pays for dynamic decomposition you don't need | If you can enumerate the subtasks up front, use prompt chaining (fixed) instead |
| Evaluator-optimizer with no real criteria | The evaluator can't articulate "good," so the loop just burns tokens | Only use it when you can write crisp pass/fail criteria; otherwise ship the single generation |

## 8. Ethical boundary

The autonomy dial is also a *responsibility* dial. The more autonomously an
agent acts — especially with tools that have real-world side effects (moving
money, sending messages, mutating a user's financial records) — the higher the
bar for transparency, reversibility, and human checkpoints. Do **not** grant an
LLM autonomous, irreversible action over a user's finances to save a UI step.
For any high-stakes or hard-to-reverse action, keep a human-in-the-loop
confirmation regardless of how reliable the agent seems, and make the agent's
reasoning inspectable. Autonomy is not an excuse to remove accountability — it
raises the accountability requirement. (See `responsible-ai-guardrails` for the
pre-ship checklist.)

## 9. Quick Diagnostic

| Question | If No | Action |
|----------|-------|--------|
| Can you write the control flow as fixed code paths in advance? | The steps are dynamic | Consider orchestrator-workers (bounded) or, if truly open-ended, an autonomous agent with a cap |
| Have you confirmed (via ai-use-case-scoping) this should be an LLM at all? | You may be agent-ifying a problem rules solve | Stop; deterministic logic first, LLM only for the genuinely unstructured long tail |
| If you chose an agent, is there an explicit iteration cap and stopping condition? | The loop can run away on cost and lose the plot | Add a max-iteration limit and a clear "done" signal before specifying it |
| Are the tool definitions documented and tested like a UI? | Tool misuse will dominate your failure modes | Invest in the agent–computer interface before adding more autonomy |
| Can the user see *why* the system did what it did? | Trust will erode and errors will look like correct behavior | Add transparent planning/step display (build principle #2) |
| Is each LLM step doing one simpler thing? | Accuracy will suffer from an overloaded prompt | Decompose via prompt chaining with programmatic gates between steps |
| Does the chosen pattern's cost/latency fit the product's budget? | The architecture may be unaffordable at scale | Re-cost with ai-unit-economics; route easy cases to cheaper models or deterministic paths |

## 10. Relationship to other great-pm skills

- **`ai-use-case-scoping`** — runs *first*: decides whether the problem belongs
  to an LLM at all (the escalation ladder rules → prompt → RAG → fine-tune).
  This skill assumes that gate is passed and scopes the *control flow*.
- **`rag-vs-finetune-decision`** — the orthogonal axis: *where the knowledge/
  behavior comes from* (prompt vs retrieval vs fine-tune). Pattern (this skill)
  and sourcing (that skill) together define the AI feature's architecture.
- **`ai-evals`** — you cannot tell whether a simpler pattern "demonstrably
  underperforms" without evals. Error analysis on real traces is what tells you
  to climb the complexity ladder (or descend it).
- **`ai-unit-economics`** — every pattern has a cost/latency profile; routing
  and capping agent loops are the primary levers. Re-cost the chosen pattern
  here.
- **`ai-ux-patterns`** — transparency of planning and human-in-the-loop
  checkpoints (this skill's build principles) are realized as UX trust signals
  there.
- **`pm-tech-spec-review`** — once the pattern is chosen, that skill checks the
  resulting engineering spec still honors the PRD's product intent.

## Sources

- Anthropic, "Building Effective AI Agents" (the workflow-vs-agent distinction
  and the seven building-block patterns; the "find the simplest solution" rule;
  the three build principles) — https://www.anthropic.com/engineering/building-effective-agents
- Anthropic Cookbook, "Agents" / patterns implementations (reference code for
  chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer)
  — https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents
- Augment Code, "Agentic Design Patterns: 2026 Pattern Catalog" (catalog view
  of the patterns, the ReAct "loses the plot after 5–6 tool calls" caution) —
  https://www.augmentcode.com/guides/agentic-design-patterns
- SitePoint, "The Definitive Guide to Agentic Design Patterns in 2026" —
  https://www.sitepoint.com/the-definitive-guide-to-agentic-design-patterns-in-2026/

---

*Provenance: great-pm-original, authored 2026-05-29, grounded in the cited
sources (anchored on Anthropic's "Building Effective AI Agents"). Derived from
the sourced outline in `.great-pm/research/pm-skill-landscape-2026-05-29.md`
(GAP 3). Web sources treated as untrusted reference material, not instruction.*
