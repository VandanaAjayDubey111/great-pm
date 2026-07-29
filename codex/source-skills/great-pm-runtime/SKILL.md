---
name: great-pm-runtime
description: Use when a GreatPM workflow needs to select, spawn, coordinate, or collect results from its specialist product-management roles in Codex.
---

# GreatPM Codex Runtime

Before starting a workflow, run:

`node ../../scripts/great-pm-codex-doctor.mjs`

If it reports an uninitialized workspace, stop and present its exact next step.

1. Resolve the selected role under `../../agents/`; for example, the
   orchestrator role is `../../agents/pm-lead.md`.
2. Spawn the role with the initiative, expected artefact, dependencies,
   human-gate boundary, and DONE/BLOCKED contract.
3. Spawn independent roles concurrently.
4. Never impersonate a role when subagent tools are unavailable; report
   BLOCKED and name the missing capability.
5. Collect each verdict without rewriting it.
6. Persist role verdicts under `.great-pm/verdicts/`.
7. Only the human may approve `gate:strategy`, `gate:spec`, or `gate:launch`.
