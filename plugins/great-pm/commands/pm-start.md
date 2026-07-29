---
description: Start a new great-pm initiative. Spawns the Discover stage (user-researcher + feedback-synthesizer + market-analyst in parallel) and runs the loop through to gate:strategy.
argument-hint: "[free-form problem or opportunity description]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-start` command. Begin a new initiative by kicking off
the Discover stage.

## Pre-flight

```bash
echo "cwd=$(pwd)"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
```

If `NO_PROJECT` → stop. Tell the user:
```
No .great-pm/PROJECT.md found in $(pwd).
Copy the template:  cp ~/great-pm/templates/PROJECT.md.template .great-pm/PROJECT.md
Then customize it, then re-run /pm-start.
```

If `PROJECT_OK` → proceed.

## Operating procedure

0a. **Offer the grill — ALWAYS, before anything else** (including before
   query-refiner, because grill-me needs the RAW framing). Ask exactly once:
   ```
   Before I start this initiative: want to grill it first? (~2 min)
   /pm-grill runs a short interrogation — it widens the brief and surfaces
   the unknowns you can't see, BEFORE the loop builds on them. [grill / skip]
   ```
   - **grill** → run the `/pm-grill` procedure inline on the raw `$ARGUMENTS`.
     When it completes, use the **sharpened problem statement** from the
     situation brief as the initiative input and SKIP step 0 below (the grill
     already did the refinement job, conversationally). Any P0 blocker it
     filed must be answered/overridden before gate:strategy can pass.
   - **skip** → proceed to step 0. Never nag; one offer only.

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

1. Parse the user's description from `$ARGUMENTS`. Build a kebab-case slug
   from the first 2–4 meaningful nouns.

2. Append the initiative to `.great-pm/PROJECT.md` under "Active initiatives"
   (or update if it exists), with `stage: discover`.

3. Spawn `pm-lead` as a subagent with this brief:
   - Initiative slug.
   - User's free-form description.
   - Instruction: open the Discover-stage phase task in Beads, then spawn the
     Discover-stage agents (user-researcher + feedback-synthesizer +
     market-analyst) **in parallel** — they are independent and should not
     serialise.
   - When all three return their drafts, advance the loop through Strategize
     and Prioritize, then assemble the **gate:strategy** package via the
     mandatory `pm-reviewer` pass.

4. Report a short status line and STOP at gate:strategy for human approval.

## Reporting

End with DONE or BLOCKED (per `done-blocked` skill):
- **DONE**: `DONE: initiative <slug> started — Discover stage in flight, gate:strategy pending after Prioritize.`
- **BLOCKED**: when PROJECT.md is missing, the description is too vague to slug, or pm-lead cannot spawn. Include `tried` + `failed_because` + `need`.

## Notes
- great-pm runs many initiatives in parallel. Starting a new one never blocks
  others in flight.
- Always-on agents (feedback-synthesizer, market-analyst, skill-scout,
  stakeholder-comms) continue regardless.
