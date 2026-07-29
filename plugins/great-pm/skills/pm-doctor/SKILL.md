---
name: pm-doctor
description: "Health-check great-pm itself. Runs pm-auditor with scope=great-pm in --read-only mode. Use this when \"is my great-pm setup actually working?\" is the question."
---

## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Before delegating to any specialist, read the `great-pm-runtime` skill and the selected packaged role file.
- Treat "invoke", "assign", "delegate", "spawn", and source Agent-tool instructions as a required Codex `spawn_agent` call with that role and a bounded assignment.
- Store every returned agent identifier. Never call a wait tool until a spawn has returned an identifier, and wait only on identifiers returned by successful spawns.
- If `spawn_agent` is unavailable or a spawn fails, report BLOCKED; do not impersonate the specialist or wait on an empty agent set.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.


You are the great-pm `$pm-doctor` command. Audit great-pm itself — recursively.

## What this command checks

great-pm-on-great-pm: the agent roster, the skill library, the hooks, the
commands, the memory layers — is it actually wired? Are sessions being
logged? Is the audit trail accumulating? Are lessons being captured?

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

1. **Run the mechanical harness check first.** Execute
   `bash "${PLUGIN_ROOT}/scripts/great-pm-skill-doctor.sh"` and
   include its output — skills-per-agent overload, dangling skill cross-links,
   and skills missing depth sections (pitfall #5 + the recurring GC pass). This
   is fast, deterministic, and catches drift the agent audit might miss.
2. **Invoke `$pm-audit`** with scope=`great-pm` and `--read-only` (so nothing
   gets filed as a Beads task — this is diagnostic only).
2. pm-auditor will assess great-pm's own setup against the 15-dimension
   rubric, with the meta lens:
   - **Discovery** → are we listening to OUR great-pm users (you)?
   - **Strategy** → does the design doc still match what's built?
   - **Specs** → do agents have clean, locked patterns?
   - **Metrics** → are verdicts/cost being tracked?
   - **Governance** → are hooks firing? skill-scout running?
   - **Memory** → are lessons accumulating? is `~/.great-pm/decisions.md`
     getting populated through `$pm-crystallize`?
3. Surface the report to the human.

## Output

A diagnostic on great-pm's own setup. Typically small — great-pm is itself
small — but it surfaces drift, missing wiring, and hooks that aren't firing.

## Reporting
- **DONE**: `DONE: pm-doctor — great-pm is <healthy | needs attention> — <N> findings.` Reference the report at `.great-pm/audit/PM-AUDIT-<date>-great-pm.md`.
- **BLOCKED**: only if pm-auditor itself is missing or unreadable.

## Notes
- Use this if you suspect a hook isn't firing, an agent isn't syncing, or
  the audit trail looks empty.
- `--read-only` is enforced — `$pm-doctor` never files Beads tasks. It's a
  diagnostic, not a remediation.
