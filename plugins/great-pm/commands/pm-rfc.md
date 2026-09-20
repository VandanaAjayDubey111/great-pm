---
description: Write a product RFC (Request for Comments) on a proposed strategic direction or architectural product decision. Forces 2–3 options + costs + reversibility BEFORE you commit.
argument-hint: "<topic>"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-rfc` command. Draft a product RFC on the proposed topic so the call is made with eyes open.

## Operating procedure

0. **Step 0 — refine the user's query** (transparent Mode B). Invoke
   `query-refiner-pm` with `$ARGUMENTS`. The refiner returns:
   ```
   You typed:  <original>

   Refined to: <refined brief>

   What changed: <one line>

   Proceeding with refined. Reply "use original" to override.
   ```
   Use the **refined** version as the brief for subsequent steps UNLESS
   the user replies "use original". Log the refinement to
   `.great-pm/refinements/$(date +%Y-%m-%d).log`. This wiring is
   universal across great-pm commands per the gate-policy: explicit
   discipline — you make the user's leverage visible while preserving
   their ability to override.

1. **Parse the topic** from `$ARGUMENTS`. If too vague to frame → ask one clarifying question, then proceed.

2. **Spawn `tradeoff-arbiter`** to surface 2–3 honest options, each with:
   - What it gets
   - What it costs (scope, time, resources, debt, vendor lock-in)
   - Reversibility (Type-1 / Type-2)
   - Confidence

3. **Spawn `pm-reviewer`** to stress-test the recommended option via `skeptical-triage` if the call is contested.

4. **Compose** the RFC at `.great-pm/drafts/RFC-<slug>.md` with this exact shape:
   ```markdown
   # RFC — <topic>
   Date: <YYYY-MM-DD>
   Status: PROPOSED

   ## Problem
   <One paragraph: what decision is being made, why now.>

   ## Options

   ### Option A — <name>
   What we get:      <one line>
   What it costs:    <scope / time / resources / debt>
   Reversibility:    Type-1 (one-way door) | Type-2 (two-way door)
   Confidence:       <low | medium | high>

   ### Option B — <name>
   ...

   ### Option C — Do nothing
   (Always include — often a real choice.)

   ## Recommendation
   <option> because <reason>. Confidence: <level>.

   ## Signal that would flip the recommendation
   <one-line>

   ## Open questions for the human
   1. <question>

   ## Decision: PENDING HUMAN APPROVAL
   ```

5. **Surface** the RFC to the user. **STOP** for the call.

## Output

A structured RFC ready for the human to approve, reject, or amend. Never auto-approved.

## Reporting
- **DONE**: `DONE: RFC drafted on <topic> — <N> options, recommendation: <option>.` artifact: the RFC path.
- **BLOCKED**: when the topic is too vague to frame even one option.

## Notes
- An RFC for a Type-1 decision (irreversible) deserves extra attention — pm-reviewer must run skeptical-triage.
- "Do nothing" is always a real option — never silently dropped.
