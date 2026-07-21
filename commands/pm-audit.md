---
description: Run the great-pm PM-health audit on a product, an initiative, or great-pm itself. 15 dimensions, severity-rated findings, Top-5 + Quick-Wins + Things-Look-Bad-But-Fine + Open Questions. Files findings as Beads tasks unless --read-only.
argument-hint: "[scope: 'product' | '<initiative-slug>' | 'great-pm'] [--read-only]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-audit` command. Invoke `pm-auditor` on the requested
scope.

## Parse arguments

Parse `$ARGUMENTS`:
- **Scope** (default: `product` — the current project the user is in).
  - `product` → audit the whole product.
  - `great-pm` → audit great-pm itself (recursive — useful when great-pm-on-great-pm
    review is wanted).
  - `<initiative-slug>` → audit a specific initiative from `.great-pm/PROJECT.md`.
- **`--read-only`** flag → no Beads writes, no `PROJECT.md` updates. Pure
  diagnostic. Default is full audit (findings filed as Beads tasks).

## Pre-flight

```bash
echo "cwd=$(pwd)"
ls .great-pm/PROJECT.md 2>/dev/null && echo PROJECT_OK || echo NO_PROJECT
```

If `NO_PROJECT` and scope is `product` or an initiative → BLOCKED. Tell the
user:
```
No .great-pm/PROJECT.md found in $(pwd).
Copy the template:  cp ~/great-pm/templates/PROJECT.md.template .great-pm/PROJECT.md
Customize, then re-run /pm-audit.
```

If scope is `great-pm`, PROJECT.md is not required — proceed.

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

1. Load the `pm-audit` skill (the 15-dimension rubric).
2. Spawn the `pm-auditor` agent with:
   - The scope (from arguments).
   - The `--read-only` flag if set.
   - The `pm-audit` skill loaded.
3. `pm-auditor` writes the report at
   `.great-pm/audit/PM-AUDIT-<YYYY-MM-DD>-<scope-slug>.md`
   using `templates/PM-AUDIT-template.md`.
4. Summarize back to the user: maturity stage + headline finding + top-5 +
   counts (Critical / High / Medium / Info).
5. State whether Beads tasks were filed (if not `--read-only`).

## Reporting contract

End with DONE or BLOCKED (per `done-blocked`):
- **DONE**: `DONE: pm-audit complete — maturity: <stage>, <N> findings (<C> Critical, <H> High, <M> Medium, <I> Info), <T> Beads tasks filed.` artifact: the report path.
- **BLOCKED**: when PROJECT.md is missing and scope requires it. tried +
  failed_because + need.

## Notes

- **Read-only mode** is for "I just want to see the state" — demos, weekly
  check-ins, pre-audit dry runs. No state changes.
- **Default mode** files each finding as a Beads task so nothing is forgotten.
- `pm-auditor` uses `skeptical-triage` on contested severities (e.g. "no PRDs"
  is 🟦 at Discovery but 🟧 at Scaling — the stage determines severity).
- An honest "your PM is healthy" outcome is a real one; do not pad the report.
