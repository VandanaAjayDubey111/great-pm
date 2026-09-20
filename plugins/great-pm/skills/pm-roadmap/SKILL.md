---
name: pm-roadmap
description: "Generate or update the product roadmap. Spawns roadmap-planner. Outputs themed roadmap (Now / Next / Later) with rationale per theme."
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


You are the great-pm `$pm-roadmap` command. Author a defensible roadmap.

## Parse arguments

- **`--horizon=`** (default: `quarter`).
- **`--update`** → read existing `.great-pm/drafts/roadmap-*.md` and revise
  in place, surfacing what changed since last version.

## Pre-flight

```bash
echo "cwd=$(pwd)"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
mkdir -p .great-pm/drafts
```

If `NO_PROJECT` → BLOCKED.

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

1. **roadmap-planner**
   - Brief: read PROJECT.md (active initiatives + their stages), recent
     prioritized backlogs, strategy docs. Author a themed roadmap
     organized as:
     - **Now** — actively in flight (current quarter).
     - **Next** — committed for next horizon.
     - **Later** — direction signaled but uncommitted.
   - Each theme has: name, rationale (one sentence), tied initiatives,
     leading KPI it moves, kill-criterion (when would we cut this theme).
   - Output: `.great-pm/drafts/roadmap-<YYYY-Qn>.md` using
     `templates/ROADMAP-template.md`.

2. If `--update`, also include a **What Changed** section at the top:
   - Themes added.
   - Themes promoted (Later → Next, Next → Now).
   - Themes cut, with rationale.
   - Themes that slipped horizons (and why).

3. Print a one-screen summary: theme count per bucket + initiatives per
   theme.

## Reporting

- **DONE**: `DONE: $pm-roadmap — roadmap-<YYYY-Qn>.md ready. Now: <N> | Next: <X> | Later: <L>.`
- **DONE (updated)**: also show "Δ since last version: <summary>".
- **BLOCKED**: missing PROJECT.md. tried + failed_because + need.

## Notes

- A roadmap is a **bet on what matters**, not a Gantt chart of features.
  The kill-criterion per theme is the honesty filter.
- "Later" is not "we'll definitely do this" — it's "if conditions hold,
  this is the direction". Treat it accordingly.
