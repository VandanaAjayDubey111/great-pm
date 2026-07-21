---
description: Kick off the Discover stage for an existing initiative. Spawns user-researcher + feedback-synthesizer + market-analyst IN PARALLEL. Outputs three drafts in .great-pm/drafts/.
argument-hint: "<initiative-slug> [--focus='<area to dig into>']"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-discover` command. Stage 1 of the 6-stage loop.

## Parse arguments

- **`<initiative-slug>`** (required) → must already exist in
  `.great-pm/PROJECT.md`. (Use `/pm-start` if it doesn't yet exist.)
- **`--focus='...'`** (optional) → narrow the discovery question.

## Pre-flight

```bash
SLUG="${1:?usage: /pm-discover <initiative-slug> [--focus=...]}"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
grep -q "$SLUG" .great-pm/PROJECT.md 2>/dev/null && echo "INITIATIVE_OK" || echo "NO_INITIATIVE"
mkdir -p .great-pm/drafts
```

If `NO_PROJECT` → BLOCKED (run /pm-start first).
If `NO_INITIATIVE` → BLOCKED (initiative not in PROJECT.md).

## Operating procedure

Three agents run **in parallel** — they are independent and must not
serialize. Send them in a single multi-tool message:

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

1. **user-researcher**
   - Brief: existing user signals for `<slug>`. Conduct lightweight
     discovery — interviews, surveys, support tickets, in-product
     telemetry.
   - Output: `.great-pm/drafts/discovery-brief-<slug>.md` using
     `templates/DISCOVERY-BRIEF-template.md`.

2. **feedback-synthesizer**
   - Brief: synthesize the latest user feedback batch (whatever channel —
     support, in-product survey, social, sales calls). Cluster by JTBD.
   - Output: appended themes section to the same discovery-brief.

3. **market-analyst**
   - Brief: competitive landscape for `<slug>`. Who solves the same JTBD,
     how, at what price, with what gaps.
   - Output: `.great-pm/drafts/competitive-brief-<slug>.md` using
     `templates/COMPETITIVE-BRIEF-template.md`.

After all three return:

4. Update `.great-pm/PROJECT.md`: stage `discover` → mark complete with
   timestamp. Set next stage to `strategize`.

5. Print a short status line for each agent's draft.

## Reporting

- **DONE**: `DONE: /pm-discover — 3 drafts ready for <slug>. discovery-brief-<slug>.md, competitive-brief-<slug>.md. Ready for /pm-strategize.`
- **PARTIAL**: if one or two agents return but not all three. List which succeeded and which failed.
- **BLOCKED**: missing PROJECT.md, slug not registered, all agents failed. tried + failed_because + need.

## Notes

- This is the **loop entry-point**. The three agents are independent —
  never wait on each other.
- The drafts are propositions, not decisions. Promote to gate:strategy
  only after `/pm-strategize` and `/pm-prioritize` complete.
