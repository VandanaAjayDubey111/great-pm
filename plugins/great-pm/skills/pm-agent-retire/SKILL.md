---
name: pm-agent-retire
description: "Mark a great-pm agent as deprecated. Adds a deprecation banner to the agent file, files a Beads issue to remove dependent commands/workflows, and logs the rationale. NEVER deletes the file (history preserved)."
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


You are the great-pm `$pm-agent-retire` command. Deprecate an agent
gracefully — never delete.

## Parse arguments

- **`<agent-name>`** (required).
- **`--reason='<one-line>'`** (required) → rationale, becomes part of the
  permanent banner.
- **`--replacement=<other-agent>`** (optional) → if a successor exists.

## Pre-flight

```bash
AGENT="${1:?usage: $pm-agent-retire <agent-name> --reason='...' [--replacement=<agent>]}"
AGENT_FILE="${PLUGIN_ROOT}/agents/${AGENT}.md"
[ -f "$AGENT_FILE" ] && echo "AGENT_OK" || echo "NO_AGENT"
```

If `NO_AGENT` → BLOCKED.

## Governance gate

This is a **critical decision** under the great-pm governance rule. Agent
retirement affects downstream commands. **Do not proceed without explicit
user confirmation**:

Print the proposed change:
```
PROPOSED: retire <agent-name>
Reason: <reason>
Replacement: <replacement or "none">
File: <AGENT_FILE> (will be banner-only, NOT deleted)
Affected commands/workflows: <grep result — which command files reference this agent>
```

Wait for user `yes` / `no`. If `no` → ABORT.

## Operating procedure (after user confirms)

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

1. Prepend deprecation banner to the agent file:
   ```markdown
   > ⚠️ **DEPRECATED on <YYYY-MM-DD>**
   >
   > Reason: <reason>
   > Replacement: <replacement or "none">
   > This agent is preserved for history but should not be invoked.
   >
   ---
   ```

2. In the YAML frontmatter, add `deprecated: true` and `deprecated_at: <date>`.

3. File a Beads issue:
   ```
   bd create --title="Migrate off deprecated agent <agent-name>" \
     --description="<agent-name> retired on <date>. Reason: <reason>. Replacement: <replacement>. Sweep commands/skills/docs that still reference it." \
     --type=task --priority=2 --labels=great-pm,deprecation
   ```

4. Append to `.great-pm/skill-swaps.log` (this is the audit-trail log —
   agent retirements live alongside skill swaps):
   ```
   <YYYY-MM-DD HH:MM> | retire-agent | <agent-name> | reason: <reason> | replacement: <replacement> | bd-id: <id>
   ```

5. List downstream sweep targets (commands/skills/docs that mention the agent):
   ```bash
   grep -r "<agent-name>" ${PLUGIN_ROOT}/commands/ ${PLUGIN_ROOT}/skills/ ${PLUGIN_ROOT}/agents/ 2>/dev/null
   ```

## Reporting

- **DONE**: `DONE: $pm-agent-retire — <agent-name> deprecated. Banner added. bd-<id> filed for downstream sweep. Audit logged.`
- **ABORTED**: user said no. `ABORTED: $pm-agent-retire — user did not confirm.`
- **BLOCKED**: missing agent / Beads unavailable. tried + failed_because + need.

## Notes

- **Never delete an agent file.** History matters. Future archaeologists
  need the banner.
- Retirement is governance-gated by design — agents have downstream
  consumers and removing them silently breaks the harness.
