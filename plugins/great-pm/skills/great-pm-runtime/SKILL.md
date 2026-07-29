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
2. Call the Codex `spawn_agent` collaboration tool with the role, initiative,
   expected artefact, dependencies, human-gate boundary, and DONE/BLOCKED
   contract. A prose promise to delegate is not a spawn.
3. Store the agent identifier returned by every successful spawn. Never call
   `wait_agent` or another wait tool with an empty target set, and never wait
   before at least one spawn has returned an identifier.
4. Spawn independent roles concurrently.
5. Never impersonate a role when subagent tools are unavailable or a spawn
   fails; report BLOCKED and name the missing capability.
6. Collect each verdict without rewriting it.
7. Persist role verdicts under `.great-pm/verdicts/`.
8. Only the human may approve `gate:strategy`, `gate:spec`, or `gate:launch`.
