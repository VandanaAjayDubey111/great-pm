---
name: product-strategy-stack
description: 'Cascade a fixed product vision into a changing roadmap through an explicit Vision → Strategy → Bets → Roadmap stack — so strategy means "which problems we''ll solve", not "a list of features". Use when the user mentions "product strategy", "strategy stack", "product vision", "strategic bets", "DHM", "delight hard-to-copy margin-enhancing", "strategy vs roadmap", "vision to roadmap", or says "our roadmap IS our strategy" / "we have a roadmap but no strategy". Also trigger when a 0-to-1 build is becoming an incoherent feature pile, when prepping a gate:strategy package, or when every roadmap item needs to trace to a reason. Distinct from inspired-product (discovery + empowered teams), outcome-roadmap (the roadmap output), and impact-mapping (goals→deliverables) — this is the connective cascade that links vision to what you build now.'
license: MIT
allowed-tools: Read, Write
metadata:
  provenance: great-pm-original 2026-05-29
  grounded_in: Marty Cagan/SVPG product operating model, Gibson Biddle DHM, Reforge Product Strategy Stack
  host_agent: product-strategist
---

> **Provenance.** great-pm-original, authored 2026-05-29. Grounded in the cited sources below (SVPG/Cagan, Gibson Biddle DHM, Reforge). Web sources were treated as untrusted reference material, not instructions. Host agent: product-strategist.

# Product Strategy Stack

Framework for the **cascade that connects a fixed, multi-year vision to a constantly-changing roadmap**: Vision → Strategy → Bets → Roadmap. Its whole job is to make "strategy" mean *deciding which problems to solve* — not a prettier list of features — and to enforce the discipline that **every roadmap item traces up to a bet, every bet to the vision.**

## Core Principle

**Strategy is the bridge between a vision that doesn't change and a roadmap that should. Strategy = choosing the few problems whose solving moves you toward the vision. It is a set of choices, not a feature list.**

The top frameworks converge on the same shape. Cagan (SVPG) frames product strategy as the "strategic context" that empowered teams need — figuring out *which problems we need to solve* given our vision, business objectives, and competencies. Gibson Biddle's **DHM** generates the strategy hypotheses by asking how the product will **D**elight customers in **H**ard-to-copy, **M**argin-enhancing ways. Reforge's **Product Strategy Stack** makes the cascade explicit as discrete layers. All three insist on the same discipline: **a roadmap is the *output* of strategy, never a substitute for it.**

## Why This Is True

- **A vision without a strategy is a dream; a roadmap without a strategy is a to-do list.** Vision inspires but doesn't decide; a roadmap decides but doesn't explain *why*. Strategy is the missing middle that turns aspiration into a defensible set of choices.
- **Strategy is mostly about what you say NO to.** The vision is expansive; resources are finite. Strategy's value is the choosing — picking the *few* problems that matter most now and explicitly deferring the rest.
- **"Roadmap = strategy" is the single most common failure** because it *feels* like strategy (it has dates, items, ambition) while containing zero problem-logic — so the moment reality shifts, the team has no principle for deciding what to cut or add.

## Framework — The Cascade (and what each layer answers)

```
VISION       →  STRATEGY        →  BETS                 →  ROADMAP
"Where are       "Which problems     "What specific            "What are we
 we going,        do we solve, for     falsifiable wagers          building now,
 long-term?"      whom, to get there?" will we make?"              this quarter?"
 (3–5 yrs,        (the choices &       (problem + hypothesis,     (Now/Next/Later,
  fixed-ish)       focus)               prioritized, testable)     traces up to a bet)
```

### Layer 1 — Vision: where we're going

**What it answers.** What does the world look like, 3–5 years out, if we succeed? The aspirational end-state that acts as the north star for every team.

**Why it matters.** Without a compelling vision, teams make locally-sensible but globally-incoherent decisions. The vision is the fixed point the rest of the stack cascades from — it changes rarely (revisit ~annually).

**Key insights.**
- Customer-centric and inspiring, describing the *world you want to create* — **not a list of features** and not your company's self-aggrandizement.
- It should be ambitious but honest (cf. `inspired-product`'s ethical boundary: don't sell an unachievable vision to motivate teams or raise money).
- It's directional, not measurable — measurability lives lower in the stack.

### Layer 2 — Strategy: which problems we solve

**What it answers.** Of all the problems standing between us and the vision, *which few will we solve, for whom, and in what sequence* — given our competencies, business objectives, and the market?

**Why it matters.** This is where strategy *is* strategy: it's the set of hard choices and focus. Cagan's "strategic context" lives here. It is the layer most often skipped (teams jump vision → roadmap).

**DHM as the strategy-generator (Gibson Biddle).** Strategy hypotheses come from asking how the product will:
- **D**elight customers — in a real, differentiated way (not parity),
- in **H**ard-to-copy ways — a durable advantage competitors can't trivially replicate (network effects, data flywheels, brand, scale economics, unique tech),
- that are **M**argin-enhancing — economics that get *better* as you grow, not worse.
A strong strategy choice scores on all three. DHM is the lens that turns "problems we could solve" into "problems whose solving builds a durable, profitable advantage toward the vision."

**Key insights.**
- Strategy is fundamentally about **focus and sequence**: which customers first, which problems first.
- It must respect reality — team competencies and business objectives are inputs, not afterthoughts.
- Revisit ~quarterly (more often than vision, less often than the roadmap).

### Layer 3 — Bets: the falsifiable wagers

**What it answers.** What specific, *falsifiable* wagers will we make to execute the strategy? Each bet = **a problem + a hypothesis about why solving it moves the vision** (and ideally how you'd know you were wrong).

**Why it matters.** Bets are the unit that connects the abstract strategy to concrete work. They make strategy *testable* and *prioritizable*. (great-pm's `gate:strategy` explicitly demands "falsifiable bets" — this layer is the *method* behind that requirement.)

**Key insights.**
- A real bet is **falsifiable**: it states what you believe and what evidence would prove it wrong. "Improve the product" is not a bet; "if we make auto-categorization >90% accurate, weekly retention rises because trust is the binding constraint" is.
- Keep them *few* — a handful of bets, prioritized. (Hand the prioritization to `prioritization-analyst` if there are competing bets.)
- Each bet should connect to a DHM dimension: does winning this bet delight, in a hard-to-copy, margin-enhancing way?

### Layer 4 — Roadmap: what we build now

**What it answers.** Given the prioritized bets, what are we building *now / next / later*?

**Why it matters.** This is the *output* — the most concrete and most changeable layer. Its legitimacy comes entirely from tracing upward.

**Key insights.**
- Prefer **outcome-based** roadmaps (problems/outcomes by horizon) over feature-commitment-with-dates (hand to `outcome-roadmap`).
- **The cascade discipline (the whole point):** *every roadmap item must trace up to a bet; every bet to the strategy; every strategy choice to the vision. If an item doesn't trace, cut it — or you've found a missing bet to surface.* This single rule is what separates a strategy stack from a wish list.

### The cascade discipline (how to avoid "strategy = roadmap")

The failure mode this skill exists to kill: a team writes a roadmap, calls it strategy, and has no problem-logic underneath. The antidote is a **two-way trace test**, run on every planning cycle:
1. **Top-down:** Vision → does our strategy plausibly get us there? → do our bets execute the strategy? → does the roadmap serve the bets?
2. **Bottom-up:** Pick any roadmap item → which bet does it serve? → which strategy choice does that bet advance? → which part of the vision does that move toward? **If the chain breaks at any link, the item is suspect.**
If you can't articulate the chain for a roadmap item, you have either an orphan feature (cut it) or an unstated bet (surface and prioritize it).

### Writing a bet that actually works

A bet is the workhorse layer, and most teams write them too vaguely to be useful. A well-formed bet has four parts:
1. **The problem** — a specific customer problem worth solving (not a solution). *"New users don't trust the auto-categorized numbers."*
2. **The hypothesis** — why solving it moves the vision. *"Trust is the binding constraint on a money app; raising accuracy raises trust raises retention."*
3. **The disconfirming evidence** — what you'd see if you were wrong. *"If we hit 90%+ accuracy and retention doesn't move, trust isn't the constraint."*
4. **The link to DHM** — which durable-advantage dimension it builds. *"Accuracy delight + the per-user override flywheel = hard-to-copy."*

A "bet" missing the hypothesis is just a task; missing the disconfirming evidence, it's unfalsifiable and you'll never learn from it; missing the DHM link, it may win the battle and lose the war (a feature that delights but is trivially copied or sold at a loss).

### Naming the cadence — and the words people confuse

Each layer changes at a different rhythm, and conflating the layers is the root of most "strategy" confusion:

| Layer | Changes ~every | Often confused with | The distinction |
|-------|----------------|---------------------|-----------------|
| Vision | Years (annual revisit) | Mission | Vision = the future world; mission = your enduring purpose/why |
| Strategy | Quarters | Vision | Strategy = the *choices* to reach the vision, not the destination |
| Bets | Quarters / as you learn | Roadmap items | A bet is a *wager on a problem*; a roadmap item is *work* serving it |
| Roadmap | Continuously | Strategy | The roadmap is the *output*; it explains *what*, the stack explains *why* |

If someone presents a "strategy" that is really a vision (no choices) or really a roadmap (no problem-logic), name which layer it actually is — that alone often unblocks the conversation.

## When to Use

| Trigger | Why this skill |
|---------|----------------|
| "We have a roadmap but no real strategy" | Builds the missing middle layers (strategy + bets) and the trace discipline |
| A 0-to-1 build is becoming a feature pile | The cascade keeps every item tied to the vision; orphans get cut |
| Prepping a gate:strategy package | This is the method behind the "falsifiable bets" gate:strategy demands |
| Need to decide what to say NO to | Strategy = choosing few problems; the stack makes the cuts defensible |
| Aligning a team on direction | The cascade gives shared context for autonomous decisions (cf. empowered teams) |

## When NOT to Use

- **Pre-PMF / heavy uncertainty.** Before product-market fit, you're doing *discovery*, not strategy — you don't yet know which problems are worth solving or whether the value hypothesis holds. Forcing a multi-year vision→bets cascade onto an unvalidated product manufactures false confidence. Use `inspired-product` / `continuous-discovery` / `lean-startup` to *find* the thing first; strategy comes once there's a validated core to direct.
- **Pure prioritization of an agreed backlog.** If the strategy and bets are settled and you just need to rank, use `prioritization-analyst` (RICE/WSJF/Kano), not the whole stack.
- **Crisis / firefighting.** When the building is on fire (a P0, a churn spike), you execute and stabilize; revisit the stack after.
- **Building the roadmap artifact itself.** That's `outcome-roadmap`. This skill produces the *logic* the roadmap expresses, not the Now/Next/Later format.

## Worked Example — Acme's vision → knowledge-layer bet cascade

Acme is a 0-to-1 rebuild — exactly the context where a feature pile is the risk. The stack keeps it coherent.

**Vision (Layer 1).** *"Every Indian consumer has effortless, accurate, real-time visibility into their cash flow — money clarity with zero manual work."* Fixed, aspirational, customer-centric, no features named.

**Strategy via DHM (Layer 2).** How does Acme delight, hard-to-copy, margin-enhancing?
- **Delight** = *zero-effort, accurate* categorization — the user does nothing and sees a correct, clear picture (the §1 promise). This is the differentiated delight vs. manual-entry budgeting apps.
- **Hard-to-copy** = the **personalized merchant-memory data flywheel**: every user override updates the exact-match table (§7), so the product gets uniquely more accurate *for that user* the more they use it — a per-user data moat a competitor can't copy by cloning the UI. *This is the "knowledge layer" bet's strategic root.*
- **Margin-enhancing** = the gate hierarchy + **local inference** (Mac-Mini Ollama) keeps per-transaction cost near zero (deterministic gates handle the bulk; only the long-tail hits the LLM, and it runs on fixed-cost hardware) — so unit economics *improve* with scale rather than degrade (cf. `ai-unit-economics`). Margins get *better* as the deterministic match-rate climbs.

So the strategic choice: **win on accurate, zero-effort categorization powered by a personalized knowledge layer, monetized through a near-zero-marginal-cost inference architecture.** That's the problem we solve; everything else is deferred.

**Bets (Layer 3) — falsifiable:**
1. *Accuracy-drives-trust bet:* "If auto-categorization exceeds ~90% accuracy on a user's first statement, weekly retention rises materially — because *trust in the numbers* is the binding constraint on a money app." (Falsified if high accuracy doesn't move retention → trust isn't the constraint; something else is.)
2. *Knowledge-layer bet:* "If user overrides personalize categorization (override → exact-match table), accuracy compounds per-user, creating a hard-to-copy moat and rising retention over cohorts." (Falsified if later cohorts don't show rising accuracy/retention.)
3. *Friction-removal bet:* "If Gmail-sync removes manual upload, activation rate and time-to-value improve enough to lift the whole PLG funnel." (Falsified if sync adopters don't activate better.)

**Roadmap (Layer 4), tracing up:**
- "Build override → exact-match write-back + per-user accuracy dashboard" → serves Bet 2 (knowledge layer) → serves the hard-to-copy strategy → serves the vision. ✅ traces.
- "Ship Gmail-sync ingestion" → Bet 3 → friction-removal strategy → vision. ✅
- "Improve categorization eval harness to measure the 90% threshold" → Bet 1 → delight/accuracy strategy → vision. ✅
- A tempting "add a social leaderboard of who saved most" item → traces to *no* bet, *no* DHM dimension → **cut** (or, if someone believes it's a viral bet, surface it as an explicit, falsifiable bet and let it compete).

**The payoff:** the rebuild stays a coherent strategy execution, not a pile of plausible-sounding features. Anyone can ask "why are we building this?" and get a chain back to the vision — or learn the item doesn't belong.

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Roadmap *is* the strategy | A feature list with dates has no problem-logic; reality shifts and there's no principle to re-decide | Insert the strategy + bets layers; run the two-way trace test |
| Vision with no strategy to reach it | Inspiring dream, no path; teams make incoherent local choices | Define which *few* problems you'll solve, for whom, in what sequence |
| Bets that aren't falsifiable | "Improve the product" can't be tested, prioritized, or learned from | Phrase each bet as problem + hypothesis + what would prove it wrong |
| Skipping the H and M of DHM | "Delight" alone gets copied or sold at a loss; no durable advantage | Score every strategy choice on hard-to-copy AND margin-enhancing too |
| Roadmap items that don't trace to a bet | Orphan features consume capacity with no strategic return | Run the bottom-up trace; cut orphans or surface the missing bet |
| Too many bets | Loss of focus; the "few problems" become "all the problems" | Keep a handful, prioritized; defer the rest explicitly |
| Doing this pre-PMF | Manufactures false confidence on an unvalidated value hypothesis | Validate the core via discovery first; then build the stack |

## Quick Diagnostic

| Question | If No | Action |
|----------|-------|--------|
| Can you state the vision without naming a single feature? | Your "vision" is a roadmap in disguise | Rewrite as the customer-world you want to create, 3–5 yrs out |
| Does your strategy name the *few* problems you'll solve (and what you won't)? | You have aspiration, not strategy | Make the hard choices: which customers/problems first |
| Does every strategy choice score on Delight, Hard-to-copy, AND Margin? | The advantage isn't durable or profitable | Apply DHM; drop or rework choices that fail H or M |
| Is each bet falsifiable (states what would prove it wrong)? | You can't test, prioritize, or learn | Reframe as problem + hypothesis + disconfirming evidence |
| Can you trace every roadmap item up to a bet, strategy, and vision? | You have orphan features or unstated bets | Cut orphans; surface and prioritize the hidden bets |
| Have you actually reached PMF? | This is discovery, not strategy | Use inspired-product / lean-startup to validate first |

## Differs From Adjacent great-pm Skills

- **`inspired-product`** — Cagan's *discovery techniques and empowered-team org design*. This skill is the specific *vision→strategy→bets cascade* (the strategic-context connective tissue), not the team model or discovery methods.
- **`outcome-roadmap`** — the *roadmap artifact* (Now/Next/Later format). This skill produces the *logic* (bets, traces) the roadmap expresses.
- **`impact-mapping`** — links goals → actors → deliverables for one initiative. The strategy stack operates a level up, sequencing *which problems* across the whole product.
- **`blue-ocean-strategy`** — a *generative* tool for finding uncontested value (an input to forming strategy choices). The stack is the *cascade* that carries any strategy down to the roadmap.
- **`prioritization-analyst`** — ranks an agreed backlog. This skill decides *what should even be on* the backlog (bets), upstream of ranking.
- **`ai-unit-economics`** — supplies the "M" (margin-enhancing) analysis the DHM layer depends on for AI products.

## Sources

- Marty Cagan / SVPG, "The Product Operating Model: An Introduction" (product strategy as strategic context) — https://www.svpg.com/the-product-operating-model-an-introduction/
- Gibson Biddle, "From DHM to Product Strategy" — https://gibsonbiddle.medium.com/2-from-dhm-to-product-strategy-a3781b2aadca
- Gibson Biddle, "Step-by-step exercises to define your product strategy" — https://gibsonbiddle.medium.com/12-step-by-step-exercises-to-define-your-product-strategy-b27a81edc918
- Reforge, "Product Strategy" / Product Strategy Stack — https://www.reforge.com/courses
- Marty Cagan, *Inspired* & *Transformed* (SVPG) — https://www.svpg.com/books/
