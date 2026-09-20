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
2. Keep two distinct names: the canonical role from that file and the internal
   spawn identifier. For `task_name` or `agent_name` (whichever the exposed tool
   schema accepts), replace every hyphen with an underscore:
   `query-refiner-pm` → `query_refiner_pm`, `pm-lead` → `pm_lead`.
   Identifiers must match `^[a-z0-9_]+$`. Each packaged role lists its identifier.
   Preserve canonical names in prompts, filenames, verdict logs, and user-facing
   output: use `grill-me`, never `grill`. Do not rename skills or role files.
   Record canonical role, internal identifier, and returned agent ID together.
3. Call the Codex `spawn_agent` collaboration tool with the role, initiative,
   expected artefact, dependencies, human-gate boundary, and DONE/BLOCKED
   contract. A prose promise to delegate is not a spawn.
4. Store the agent identifier returned by every successful spawn. Never call
   `wait_agent` or another wait tool with an empty target set, and never wait
   before at least one spawn has returned an identifier.
5. Spawn independent roles concurrently.
6. Never impersonate a role when subagent tools are unavailable or a spawn
   fails; report BLOCKED and name the missing capability.
7. Collect each verdict without rewriting it.
8. Persist role verdicts under `.great-pm/verdicts/`.
9. Only the human may approve `gate:strategy`, `gate:spec`, or `gate:launch`.
