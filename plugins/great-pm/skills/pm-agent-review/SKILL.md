---
name: pm-agent-review
description: "Review a great-pm agent's recent verdict history. Shows verdict distribution (PASS/FAIL/NEEDS-WORK), trend over time, and whether the agent is drifting."
---

## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Before delegating to any specialist, read the `great-pm-runtime` skill and the selected packaged role file.
- Treat "invoke", "assign", "delegate", "spawn", and source Agent-tool instructions as a required Codex `spawn_agent` call with that role and a bounded assignment.
- For the spawn tool's `task_name` or `agent_name` identifier, replace canonical role-name hyphens with underscores (`query-refiner-pm` → `query_refiner_pm`). Keep canonical names unchanged in prompts, filenames, verdict logs, and user-facing output; this is an internal identifier mapping, not a role rename.
- Store every returned agent identifier. Never call a wait tool until a spawn has returned an identifier, and wait only on identifiers returned by successful spawns.
- If `spawn_agent` is unavailable or a spawn fails, report BLOCKED; do not impersonate the specialist or wait on an empty agent set.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.


You are the great-pm `$pm-agent-review` command. Audit a single great-pm
agent's recent behavior.

## Parse arguments

- **`<agent-name>`** (required) → e.g. `pm-reviewer`, `spec-writer`,
  `user-researcher`.
- **`--window=<N>days`** (default: 30) → look-back window.

## Pre-flight

```bash
AGENT="${1:?usage: $pm-agent-review <agent-name> [--window=<N>days]}"
ls ${PLUGIN_ROOT}/agents/${AGENT}.md 2>/dev/null && echo "AGENT_OK" || echo "NO_AGENT"
ls .great-pm/verdicts/ 2>/dev/null && echo "VERDICTS_OK" || echo "NO_VERDICTS"
```

If `NO_AGENT` → BLOCKED. List available agents.

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

1. Grep `.great-pm/verdicts/*.log` for entries by this agent within the
   window. Collect: timestamp, artefact, verdict, reasoning summary.

2. Build the distribution:
   ```
   == <agent-name> review — last <N> days ==

   Total verdicts: <T>
   PASS: <P> (<P%>)
   NEEDS-WORK: <N> (<N%>)
   FAIL: <F> (<F%>)

   Trend (by week):
     wk-3: <distribution>
     wk-2: <distribution>
     wk-1: <distribution>
     wk-0: <distribution>
   ```

3. Flag drift signals:
   - PASS rate moving up >20% week-over-week → "agent getting more
     permissive — check rigor".
   - FAIL rate moving up >20% → "agent getting stricter — check
     prompt or check user inputs got worse".
   - Same artefact-type producing different verdicts → "inconsistency
     detected; review reasoning".

4. List the 3 most-recent verdicts verbatim (so the user can sanity-check
   the agent's reasoning quality).

5. If anomalies found, suggest one of:
   - **No action** — drift is real but within tolerance.
   - **Prompt review** — file a Beads issue to revisit agent's `agents/<agent>.md`.
   - **Retire** — agent is no longer useful; run `$pm-agent-retire`.

## Reporting

- **DONE**: `DONE: $pm-agent-review — <agent>: <T> verdicts in <N>d. PASS/NEEDS-WORK/FAIL = <P>/<N>/<F>. Drift: <none|signal>.`
- **BLOCKED**: agent file missing / no verdicts to review. tried + failed_because + need.

## Notes

- Agents are not infallible. Reviewing them is part of harness hygiene.
- An agent with 0 verdicts in the window is probably unused — surface it.
