---
name: pm-crystallize
description: "Promote a project-local lesson to ~/.great-pm/decisions.md (cross-project memory) when it has 3+ hits with high confidence. Surfaces candidates as PROPOSALS — never auto-promotes; human approval required."
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


You are the great-pm `$pm-crystallize` command. Promote a battle-tested lesson to cross-project memory.

## Governance reminder

You PROPOSE; the human DECIDES. Never write to `~/.great-pm/decisions.md` without explicit human approval in this turn.

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

1. **Identify candidates**:
   - If `$ARGUMENTS` empty or `auto` → spawn `continuous-learner` to scan all of `.great-pm/lessons.md` for entries with `Hits: 3` (or higher) AND `Confidence: high`.
   - If `$ARGUMENTS` is a lesson slug → locate that specific entry.

2. **For each candidate, build a proposal**:
   ```
   Promotion proposal — <slug>

   Source lessons (N entries in .great-pm/lessons.md):
     - <YYYY-MM-DD>: <title>
     - ...

   Recommended cross-project rule (one line):
     <rule>

   Applies to archetypes:
     <list — e.g. b2b-saas, consumer-app, all>

   Status: PENDING HUMAN APPROVAL
   ```

3. **Present** the proposals to the human and **STOP**. Wait for an explicit "yes promote <slug>" or "promote all" before writing.

4. **On approval** for a specific slug:
   - Append the proposal text + `Crystallized: <YYYY-MM-DD>` to `~/.great-pm/decisions.md`.
   - Mark the source entries in `.great-pm/lessons.md` with `Promoted: yes` (Edit; not rewrite).

## Output shape

```
Crystallization candidates (Hits ≥3, Confidence: high)

[1] <slug>
    Sources: <N> lessons (<dates>)
    Rule: <one-line>
    Applies-to: <archetype(s)>

[2] <slug>
    ...

To promote: say "promote <slug>" or "promote all".
```

## Reporting
- **DONE**: `DONE: <N> crystallization candidates surfaced. <M> promoted on human approval.`
- **BLOCKED**: when no lessons.md exists or no ≥3-hit patterns found. Honest "no candidates yet" is fine.

## Notes
- This is the cross-project memory flywheel. Once a pattern is in `~/.great-pm/decisions.md`, every great-pm agent reads it before designing → less repeating of solved mistakes.
- Auto-promotion is **forbidden** — preserves human agency on the system's learned rules.
