---
description: Lightweight discovery mode for "I'm not sure this is worth investigating fully." Produces a 1-pager (Problem / Assumed solution / 3 risks) + pre-mortem-lite, skipping the full 6-stage loop until the PoC validates.
argument-hint: "<free-form idea>"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-poc` command. Run a lightweight discovery on a proposed idea — cheaper than full Discover, deeper than a thought experiment.

## When to use this vs `/pm-start`

| Situation | Use |
|---|---|
| "I'm confident this is worth investigating" | `/pm-start` (full 6-stage loop) |
| "I'm not sure — let me see if this passes a 5-minute sanity check" | `/pm-poc` (this command) |
| Building great-pm itself? See `/pm-doctor`. |

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

1. **Parse the idea** from `$ARGUMENTS`. Build a slug from 2–4 nouns.

2. **Activate poc-mode** in PROJECT.md:
   ```bash
   echo "poc-mode: <slug>" >> .great-pm/PROJECT.md 2>/dev/null
   ```

3. **Spawn `user-researcher` in 1-question mode** — just answer:
   - What is the assumed problem in one sentence?
   - What are the 3 quickest ways to test if it's real (e.g., 3 user interviews / 1 survey / a competitor check)?

4. **Spawn `market-analyst` in 1-question mode** — just answer:
   - Does any competitor solve this already? If yes — what gap remains?

5. **Compose a 1-pager** at `.great-pm/drafts/POC-<slug>.md`:
   ```markdown
   # PoC — <slug>
   Date: <YYYY-MM-DD>
   Status: POC

   ## Problem (one paragraph)
   <user-researcher's answer>

   ## Assumed solution (one paragraph)
   <the original idea, stated cleanly>

   ## 3 risks (pre-mortem-lite)
   1. <what's most likely to make this fail>
   2. <what we're assuming about users>
   3. <what we're assuming about the market>

   ## Decision
   ☐ Kill   ☐ Run a full /pm-start Discover   ☐ Build a quick PoC first

   Recommendation: <one-line> — <reason>.
   ```

6. **Surface to the user**. PoC mode means: NO PRD, NO formal strategy, NO formal metrics plan. Just this 1-pager and a kill/proceed call.

## Output

A 1-page PoC brief. The user decides next:
- **Kill** → close the PoC, no further work.
- **Full Discover** → switch from poc-mode to `/pm-start`.
- **Build a quick PoC** → small spec, small build (engineering can build it).

## Reporting
- **DONE**: `DONE: PoC brief for <slug> — <N> risks identified, recommendation: <kill | full-discover | build-poc>.`
- **BLOCKED**: when idea is too vague to frame even a problem statement.

## Notes
- PoC mode prevents over-investment in undervalidated ideas. It is the cheapest possible discovery checkpoint.
- A clean "kill" verdict here saves you the cost of running the full 6-stage loop on a bad idea.
