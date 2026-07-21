---
name: ai-ux-patterns
description: The UX patterns that don't exist in deterministic software — confidence display, graceful failure, reversibility, human-in-the-loop, and progressive disclosure — for designing trustworthy probabilistic features. Grounded in Google PAIR (People + AI Guidebook) and Apple HIG for ML. Turns "how should the AI feature behave when it's unsure or wrong" from ad-hoc choices into a checklist.
when_to_use: |
  Use when:
  - spec-writer is specifying any feature where an LLM/ML model produces user-facing output
  - the feature can be wrong, unsure, or slow, and the user must be able to trust, verify, or correct it
  - designing async "thinking/processing" states, confidence surfaces, or undo/override flows
  - user-researcher is testing whether users trust (or are misled by) an AI feature
  - an agent acts on the user's behalf and the autonomy/approval level must be decided
allowed-tools: Read, Write
---

# AI UX patterns — designing for non-determinism

Deterministic software gives the same output for the same input, every
time. UX assumes the system is right. **AI features are probabilistic:**
they are sometimes wrong, sometimes unsure, and sometimes slow — and the
UX must be designed *around that uncertainty*, not in spite of it.

Google's People + AI Research (PAIR) guidebook and Apple's Human
Interface Guidelines for machine learning converge on the same core: the
job of AI UX is **earning and calibrating trust under uncertainty.** Four
patterns do most of the work — **confidence signals, graceful failure,
reversibility, human-in-the-loop** — plus **progressive disclosure** to
keep control from becoming overwhelm.

This skill is the *trust & uncertainty* layer for probabilistic features.
It complements `hooked-ux` (the habit loop for any product); it does not
overlap it.

## The mental model: calibrated trust

The failure mode at both extremes:

- **Over-trust** — the UI projects false confidence, the user stops
  checking, the model is wrong, and the cost lands on the user. Erodes
  trust permanently the first time it bites.
- **Under-trust** — the UI hedges on everything, asks for approval
  constantly, surfaces uncertainty the user can't act on. The user
  concludes the feature is useless and turns it off.

Good AI UX **calibrates**: confident where the system has earned it,
honest where it hasn't, and always recoverable. Trust is built
*progressively* — start cautious, earn autonomy.

---

## Pattern 1 — Confidence signals

**What:** surface how reliable a given output is, so the user knows when
to lean on it and when to check.

**When/why:** any time output reliability varies meaningfully across
cases (extraction, categorization, recommendations, generated answers).
The user needs to allocate their attention to the cases that need it.

**How:**
- **Per-field, not just per-response** in extraction flows — mark the
  fields the system is sure about differently from the fields it guessed
  (e.g., a guessed merchant name visually flagged for review while a
  parsed amount is shown plainly).
- **Calibrate the signal** — "85% confident" must actually mean ~85%
  right over many cases, or the number is worse than none (this is where
  `ai-evals` calibration work feeds the UX).
- Prefer **plain-language or visual** confidence ("Looks right" /
  "Please check") over raw probabilities for consumer audiences; reserve
  numeric scores for expert users who can act on them.

**Anti-patterns:**
- **False precision** — "97.3% confident" from an uncalibrated model.
- **Hiding uncertainty entirely** — showing every guess as fact; the
  first wrong "fact" on something that matters costs disproportionate
  trust.
- **Uniform confidence** — one badge for the whole response when some
  fields are certain and others are guesses.

---

## Pattern 2 — Graceful failure (the degradation hierarchy)

**What:** when the best AI path fails or is low-confidence, fall back
*down a hierarchy* rather than dead-ending the user.

**When/why:** AI *will* fail — bad input, model unsure, service down,
timeout. PAIR's guidance: design for graceful failure and always give the
user a way forward.

**The degradation hierarchy:**

```
Full AI response
   ↓  (low confidence / partial failure)
Simplified AI response  (narrower, safer claim)
   ↓
Rule-based / deterministic response  (known-good fallback)
   ↓
Human handoff or manual control  (user does it themselves, with help)
```

Every failure should land the user on the next rung down — never on a
blank screen or a spinning wheel of death. Concretely: "Try rephrasing,"
"Choose from these options," "Edit it directly," "We left this for you to
categorize" are all valid landings.

**Anti-patterns:**
- **Dead-end errors** — "Something went wrong" with no next action.
- **Binary success/failure** — "AI did it" or "AI failed" with no middle
  tier, when a simplified or rule-based answer was available.
- **Silent wrong-guessing** — guessing confidently rather than degrading
  to "I'm not sure, here are options."

---

## Pattern 3 — Reversibility

**What:** every AI action must be trivially easy to undo or correct.

**When/why:** reversibility is *what makes occasional wrongness
tolerable.* If the user knows a mis-categorization or a bad edit is one
tap to fix, they will forgive the model being wrong sometimes — and they
will *use* the feature instead of fearing it. Irreversible AI actions
force the user to verify everything up front, which destroys the time
savings the AI was supposed to provide.

**How:**
- One-tap undo / re-edit on any AI-applied change.
- The correction should **teach the system** — a user override is the
  highest-quality training signal there is; capture it.
- Make the *current* AI decision visible and editable, not buried.

**Anti-patterns:**
- **Irreversible auto-apply** — the AI commits a change the user can't
  cleanly back out of.
- **Correction that doesn't stick** — the user fixes it, and the system
  re-overrides them next time (a trust-killer; see the Acme example).
- **Hidden state** — the user can't even see what the AI decided, so
  they can't correct it.

---

## Pattern 4 — Human-in-the-loop → human-on-the-loop (the autonomy dial)

**What:** how much the system does autonomously vs how much it asks the
user to approve — and the fact that this should *move over time*.

**When/why:** autonomy is not the absence of control; it is **control
applied sparingly and intelligently.** The right setting depends on two
things: how *proven* the system is on this task, and how *high* the
stakes are.

**The dial:**
- **Human-in-the-loop** (approve before acting) — when the system is
  unproven on this task, or the stakes/irreversibility are high. The
  user is in the path.
- **Human-on-the-loop** (act, but surface for review) — once the system
  has proven reliable on a task. The user supervises rather than
  approves each one.
- **Re-tighten** — if the system starts making questionable calls,
  move back toward in-the-loop. The dial turns both ways.

A clean way to set the initial position: map error **frequency × error
severity** on a 2×2. High-severity *or* high-frequency errors → keep the
human in the loop. Low-low → safe to automate and just surface for
review.

**Anti-patterns:**
- **Over-prompting** — asking approval for things the system is reliably
  right about; the user learns to rubber-stamp, which defeats the point.
- **Under-gating high stakes** — auto-acting on irreversible or
  high-cost decisions before earning the right to.
- **A fixed dial** — never loosening as trust is earned (feature feels
  tedious forever) or never tightening when quality drops.

---

## Pattern 5 — Progressive disclosure

**What:** reveal AI complexity, controls, and explanation *on demand*,
not all at once.

**When/why:** the patterns above add controls — confidence, overrides,
approvals, explanations. Dumped on screen together, they overwhelm. Show
the simple confident path by default; let the user *drill into* "why did
it say this?", "what else could it be?", and fine-grained controls only
when they want them.

**How:**
- Default view: the answer + a light confidence cue.
- One tap deeper: alternatives, the reason, the edit control.
- Power controls (rules, automation thresholds) behind settings, not in
  the main flow.

**Anti-patterns:**
- **Control overload** — every knob visible at once.
- **Zero disclosure** — a black box with no "why" available even on
  request (kills trust for the users who want to verify).

---

## Worked example — Acme's "Categorizing…" experience

Acme maps cleanly onto all five patterns, turning instructions.md
§3/§6/§7 from scattered rules into a coherent trust design:

1. **Confidence (Pattern 1).** Auto-categorized transactions surface
   their certainty. An exact-match (gate 1) or regex (gate 2) hit is
   shown **plainly, no fuss** — the system has earned it. A low-confidence
   LLM guess (gate 4–5) is **visually flagged "please check"** and
   batched into a review queue. Confidence comes straight from which gate
   decided it, plus the vector cosine score (>0.85 threshold).

2. **Graceful failure (Pattern 2).** The decision hierarchy *is* the
   degradation hierarchy: exact-match → regex → vector → LLM → **leave
   uncategorized for the user** rather than guess wildly. A failed PDF
   parse degrades to "we couldn't read this statement — try a CSV or
   review manually," never a dead end. The async "Categorizing…" state
   (the Mac Mini queue, §3) is itself graceful: the UI stays fully
   responsive while inference happens elsewhere, showing "Processing"
   instead of freezing.

3. **Reversibility (Pattern 3).** §7's "user override is absolute" is the
   reversibility pattern as product law: one-tap re-bucket, and the
   correction **instantly updates the exact-match table** so the system
   never re-overrides that user's decision again. The override is both
   the undo *and* the training signal.

4. **Human-in-the-loop (Pattern 4).** The autonomy dial is set by
   confidence: **high-confidence categorizations auto-apply**
   (human-on-the-loop — surfaced in the feed, not gated); **low-confidence
   ones wait for confirmation** (human-in-the-loop). As the user's
   exact-match table fills in, more transactions auto-apply — the dial
   loosens *as trust is earned*, exactly as the pattern prescribes.

5. **Progressive disclosure (Pattern 5).** Default feed shows the
   category + a light confidence cue. Tap a transaction to see why it was
   categorized, what else it might be, and the re-bucket control. The
   natural-language rule engine (§7, "put late-night food under ₹500 into
   Cravings") lives behind settings, not in the main feed.

The skill turns each of these from "someone's UX taste" into a
**checklist the spec must satisfy** before an AI feature is build-ready.

## When to use vs when NOT to

**Use when:**
- Any feature where a model's output is user-facing and can be wrong.
- Designing async "thinking" states, confidence surfaces, undo flows, or
  agent-approval flows.
- Researching whether users trust — or are misled by — an AI feature.

**Do NOT use (or down-weight) when:**
- The feature is deterministic — a normal calculation, a CRUD form, a
  hard-coded rule. Confidence badges on certain outputs are noise.
- The model output is never shown to or acted on by a user (purely
  internal scoring with no UX surface).
- You're choosing the habit/engagement loop — that's `hooked-ux`, not
  this skill (though they layer well together).

## Pitfalls

1. **Hiding uncertainty** — projecting false confidence; the first wrong
   "fact" on something that matters costs trust out of all proportion.
2. **Dead-end failures** — no next action when the AI can't deliver; the
   degradation hierarchy exists precisely to prevent this.
3. **Irreversible AI actions** — no easy undo, so users must verify
   everything up front, erasing the time savings.
4. **Correction that doesn't stick** — overriding the user's manual fix
   later; the single fastest way to lose a user's trust in an AI feature.
5. **Over-prompting for approval** — gating things the system is
   reliably right about; users learn to rubber-stamp.
6. **Control overload** — every knob and explanation on screen at once
   instead of progressive disclosure.
7. **Uncalibrated confidence** — a "92%" badge that isn't actually right
   92% of the time is worse than showing no number at all.

## Ethical boundary

Confidence display is an **honesty obligation, not a decoration.** A
product must not show high confidence it has not earned, must not hide
uncertainty to seem more capable, and must not make an AI action
irreversible to inflate engagement or lock the user in. On anything that
affects the user's money, health, safety, or legal standing, the bias
must be toward **surfacing uncertainty and preserving the user's
control**, even at the cost of a less "magical" demo. Dark patterns that
exploit trust in AI — fake certainty, buried undo, sticky auto-apply —
are out of bounds.

## Cross-links

- **`ai-evals`** — produces the calibrated confidence scores Pattern 1 displays; UX is only as honest as the eval underneath.
- **`responsible-ai-guardrails`** — the safety side of failure handling (block/escalate); this is the UX side (degrade/recover).
- **`ai-use-case-scoping`** — decides whether the feature should be AI at all; sets the stakes that tune the autonomy dial.
- **`accessibility`** — confidence cues and error states must not rely on color alone; degraded states need accessible affordances.
- **`hooked-ux`** — the habit loop these trust patterns sit inside; complementary, not overlapping.

## References

- Google PAIR — *People + AI Guidebook* (patterns for trust, mental models, feedback & control, errors & graceful failure) — https://pair.withgoogle.com/guidebook/
- Apple — *Human Interface Guidelines: Machine Learning* (mistakes, calibrating trust, multiple options, corrections) — https://developer.apple.com/design/human-interface-guidelines/machine-learning
- DesignKey Studio — "Designing for Trust: UX Patterns for AI Features" (PAIR-grounded) — https://www.designkey.studio/post/designing-for-trust-ux-ai-features
- Clearly Design — "Designing for AI Failures: Error States and Recovery Patterns" — https://clearly.design/articles/ai-design-4-designing-for-ai-failures
- CoCreate — "Probabilistic UX Design: Designing for AI Uncertainty and Confidence" — https://cocreate.consulting/field-notes/probabilistic-ux-design-patterns
- ByteBridge — "From Human-in-the-Loop to Human-on-the-Loop: Evolving AI Agent Autonomy" — https://bytebridge.medium.com/from-human-in-the-loop-to-human-on-the-loop-evolving-ai-agent-autonomy-c0ae62c3bf91

## The honesty filter

If the AI feature's UX assumes the model is always right, the spec is not
done — it is a demo script. A build-ready AI feature has answered, on
paper: *What does the user see when it's unsure? When it's wrong? How do
they fix it in one tap? When does it act without asking, and when does it
ask?* If those four questions have no answer, the feature is not ready,
no matter how good the happy path looks.

<!-- provenance: great-pm-original 2026-05-29; grounded in cited sources (Google PAIR, Apple HIG for ML, Clearly Design, CoCreate, ByteBridge). -->
