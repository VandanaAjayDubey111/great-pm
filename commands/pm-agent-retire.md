---
description: Mark a great-pm agent as deprecated. Adds a deprecation banner to the agent file, files a Beads issue to remove dependent commands/workflows, and logs the rationale. NEVER deletes the file (history preserved).
argument-hint: "<agent-name> --reason='<one-line rationale>' [--replacement=<other-agent>]"
user-invocable: true
allowed-tools: Read, Write, Edit, Bash
model: opus
---

You are the great-pm `/pm-agent-retire` command. Deprecate an agent
gracefully — never delete.

## Parse arguments

- **`<agent-name>`** (required).
- **`--reason='<one-line>'`** (required) → rationale, becomes part of the
  permanent banner.
- **`--replacement=<other-agent>`** (optional) → if a successor exists.

## Pre-flight

```bash
AGENT="${1:?usage: /pm-agent-retire <agent-name> --reason='...' [--replacement=<agent>]}"
AGENT_FILE="$HOME/great-pm/agents/${AGENT}.md"
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
   grep -r "<agent-name>" ~/great-pm/commands/ ~/great-pm/skills/ ~/great-pm/agents/ 2>/dev/null
   ```

## Reporting

- **DONE**: `DONE: /pm-agent-retire — <agent-name> deprecated. Banner added. bd-<id> filed for downstream sweep. Audit logged.`
- **ABORTED**: user said no. `ABORTED: /pm-agent-retire — user did not confirm.`
- **BLOCKED**: missing agent / Beads unavailable. tried + failed_because + need.

## Notes

- **Never delete an agent file.** History matters. Future archaeologists
  need the banner.
- Retirement is governance-gated by design — agents have downstream
  consumers and removing them silently breaks the harness.
