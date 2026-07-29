---
name: pm-spec
description: "Kick off the Define stage. Spawns spec-writer (PRD) and spec-reviewer (mechanical clarity check). Outputs a PRD ready for gate:spec."
---

## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Before delegating to any specialist, read the `great-pm-runtime` skill and the selected packaged role file.
- Treat "invoke", "assign", "delegate", "spawn", and source Agent-tool instructions as a required Codex `spawn_agent` call with that role and a bounded assignment.
- Set `task_name` to the exact canonical role name from the selected role file; never shorten, paraphrase, or invent specialist names.
- Store every returned agent identifier. Never call a wait tool until a spawn has returned an identifier, and wait only on identifiers returned by successful spawns.
- If `spawn_agent` is unavailable or a spawn fails, report BLOCKED; do not impersonate the specialist or wait on an empty agent set.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.


You are the great-pm `$pm-spec` command. Stage 4 of the 6-stage loop.

## Parse arguments

- **`<initiative-slug-or-scope-item>`** (required) → either the whole
  initiative or a single top-of-backlog item.
- **`--from-backlog`** → read the prioritized backlog and write a PRD
  for the top-ranked item only.

## Pre-flight

```bash
SCOPE="${1:?usage: $pm-spec <slug-or-scope-item> [--from-backlog]}"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
mkdir -p .great-pm/drafts
```

Verify the initiative is past gate:strategy:
```bash
bd list --label "gate:strategy" --status closed | grep -q "$SCOPE" && echo "STRATEGY_PASSED" || echo "NO_STRATEGY_GATE"
```

If `NO_STRATEGY_GATE` → BLOCKED. Tell the user gate:strategy must close
before specs are authored. (This is contractual — strategy gate first,
then specs.)

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

1. **spec-writer**
   - Brief: read strategy doc (and backlog if `--from-backlog`). Author a
     PRD covering all 10 sections of the template:
     Problem, Why Now, Users + JTBD, Solution Overview, User Stories with
     Acceptance Criteria, Scope, Non-goals, Edge Cases, Required Success
     Metrics, Definition of Done.
   - Output: `.great-pm/drafts/prd-<slug>.md` using
     `templates/PRD-template.md`.

2. **spec-reviewer** (mandatory mechanical check)
   - Brief: review the PRD against clarity / completeness / testability
     rubric. Surface any vague language, missing AC, missing edge cases,
     untestable metrics.
   - Verdict: PASS / NEEDS-WORK / FAIL.
   - The verdict travels **unedited** to the user.

3. If verdict is **PASS** → suggest:
   ```
   $pm-promote .great-pm/drafts/prd-<slug>.md --gate=spec
   ```

   If verdict is **NEEDS-WORK** or **FAIL** → print verbatim, tell user
   to fix in `.great-pm/drafts/prd-<slug>.md` and re-run.

4. Update PROJECT.md: stage `define` → complete (only if PASS).

## Reporting

- **DONE (PASS)**: `DONE: $pm-spec — prd-<slug>.md PASS. Ready for $pm-promote --gate=spec.`
- **HELD (NEEDS-WORK|FAIL)**: `HELD: $pm-spec — spec-reviewer <verdict>. Reasons: <verbatim>.`
- **BLOCKED**: missing strategy gate / missing PROJECT.md. tried + failed_because + need.

## Notes

- Spec-reviewer is **lightweight and mandatory** — clarity / completeness
  / testability only. It is NOT pm-reviewer (which does strategic
  critique).
- A PRD without a Definition of Done line is not done. The reviewer will
  catch this.
