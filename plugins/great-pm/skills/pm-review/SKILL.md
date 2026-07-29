---
name: pm-review
description: "Trigger pm-reviewer on any artefact (draft, gate package, agent output). Returns the verdict unedited. Logs to .great-pm/verdicts/."
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


You are the great-pm `$pm-review` command. Run pm-reviewer on an artefact
without promoting it. Useful for "is this ready?" checks.

## Parse arguments

- **`<artefact-path>`** (required).
- **`--lens=`** (optional) → which reviewer rubric to apply.
  - `strategy` — apply skeptical-triage on the strategy claim.
  - `spec` — clarity / completeness / testability for PRDs.
  - `launch` — readiness gate checklist.
  - `generic` (default) — overall PM-quality critique.

## Pre-flight

```bash
ARTEFACT="${1:?usage: $pm-review <artefact-path> [--lens=...]}"
[ -f "$ARTEFACT" ] && echo "ARTEFACT_OK" || echo "NO_ARTEFACT"
mkdir -p .great-pm/verdicts
```

If `NO_ARTEFACT` → BLOCKED.

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

1. Spawn `pm-reviewer` with the artefact and the lens.
2. pm-reviewer applies the appropriate rubric:
   - **strategy** → skeptical-triage (is the bet falsifiable? does the
     evidence support it? what's the strongest counter-argument?).
   - **spec** → clarity, completeness, testability, DoD presence, edge
     cases enumerated.
   - **launch** → success measures defined, rollback criteria specific,
     watch period sized.
   - **generic** → PM-quality smell test.
3. Verdict is one of: **PASS**, **NEEDS-WORK**, **FAIL**.
4. Print the verdict verbatim. Do NOT paraphrase or soften.
5. Append to `.great-pm/verdicts/<artefact-slug>-<YYYY-MM-DD>-<HH-MM>.log`
   with: timestamp, artefact path, lens, verdict, full reasoning.

## Reporting

- **DONE**: `DONE: $pm-review <verdict> on <artefact>. Lens: <lens>. Verdict logged: <log-path>.`
- **BLOCKED**: missing artefact / pm-reviewer unavailable. tried + failed_because + need.

## Notes

- `$pm-review` is **non-promoting** — it only checks. Use `$pm-promote` if
  you want a PASS to flow into a gate Beads issue.
- The verdict is the agent's, not yours. Do not edit it.
- A FAIL with reasons is more valuable than a PASS with hand-waving.
