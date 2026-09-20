---
name: done-blocked
description: "Reusable reporting contract for any great-pm agent that hands work back to the loop. Forces ONE of two terminal statuses (DONE or BLOCKED) with a specific evidence shape. Stops vague \"probably finished\" and \"kind of stuck\" verdicts."
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


# DONE / BLOCKED Reporting Contract

Terminal status is exactly two states, and BLOCKED requires specific evidence —
not vague obstruction reports.

## The contract

Every great-pm agent's final handoff line is one of:

```
DONE: <one-sentence summary of what was produced>
  artifact: <path to the draft/report produced>
  next: <who picks this up — pm-lead, a gate, the human>
```

```
BLOCKED: <one-sentence summary of the obstacle>
  tried: <what was attempted — files read, agents consulted>
  failed_because: <concrete reason — not "unclear", not "complex">
  need: <specific unblock — a human decision, a missing input, another agent>
```

## Hard rules

1. **No third state.** "Mostly done", "done with caveats" -> choose. If a
   caveat blocks the next stage -> BLOCKED. If cosmetic -> DONE (log it, move on).
2. **BLOCKED requires three fields** — tried + failed_because + need. Missing
   any -> the verdict is rejected; re-report.
3. **Silence is not DONE.** An agent that stops with no terminal line is treated
   as BLOCKED (failed_because: silent — no terminal verdict written).
4. **failed_because must be concrete.** Rejected: "unclear requirements" -> say
   which decision is needed and the two options. "not enough context" -> say
   which file/input you tried to read.
5. **need names a specific unblock.** Rejected: "more information" -> ask one
   specific question. "human approval" -> state the exact choice.
6. **Open questions go to beads, never only prose (anti-drift).** If your output
   raises a question a HUMAN must answer — or you proceeded past one on an
   assumption — you MUST capture it as a beads `open-decision` issue (see the
   `great-pm` skill "Open decisions" section), with the default-if-unanswered and
   what it blocks. A DONE verdict that buries an unanswered human-decision in
   prose is rejected: a reader scrolling past the doc loses the question. If you
   proceeded on a default, name it: "proceeded on assumption X because
   decision <id> is open." This applies even to DONE — DONE can carry open
   decisions, as long as they are filed, not buried.

## Where the verdict goes

Two places: (1) the last line of agent output, and (2) appended to
`.great-pm/verdicts/<YYYY-MM-DD>.log` — an append-only audit trail.

## Examples

**Good — DONE:**
```
DONE: discovery brief complete — 4 user pains validated, 1 invalidated.
  artifact: .great-pm/drafts/discovery-brief.md
  next: pm-lead to fold into the Strategize stage
```

**Good — BLOCKED:**
```
BLOCKED: prioritization cannot rank — two strategy bets claim the same quarter.
  tried: read product-strategy draft; bet A and bet B both claim Q1 capacity
  failed_because: the strategy doc does not say which bet wins if capacity is tight
  need: human to decide bet A vs bet B priority, or product-strategist to sequence them
```

**Rejected — vague BLOCKED:**
```
BLOCKED: couldn't finish — research problems.
  tried: looked at stuff
  failed_because: not enough info
  need: help
```
Why rejected: `tried` names nothing concrete; `failed_because` is tautological;
`need` is not actionable.

## Anti-patterns
- Writing both DONE and BLOCKED ("DONE but blocked on X"). Pick one — if you are
  blocked, the work is not done.
- Using DONE as a politeness signal when the work is not actually finished.
- Writing the verdict only to stdout without persisting to .great-pm/verdicts/.
