# great-pm — Feedback Loops & Harness Guards

How great-pm stays self-correcting across cycles, the pitfalls that break that,
and the mechanism each mitigation uses. great-pm is a general-purpose product —
these guards apply to **every** instance it runs in, not any one product.

## The hard constraint that shapes everything

**Claude Code hooks run shell commands, not agents.** A hook cannot autonomously
run an LLM agent (continuous-learner, spec-writer, …) in the background. So every
"automatic" loop here uses the only mechanism the harness allows:

> **A hook FLAGS at a session boundary → the next SessionStart hook INJECTS a
> directive into context → the agent EXECUTES it at session start.**

That is "automatic on next session open," not "unattended background." Designing
for this honestly (rather than pretending hooks self-run) is why the loops below
actually close.

## The loop (recap)

`Discover → Strategize → Prioritize →[gate:strategy]→ Define →[gate:spec]→
Launch →[gate:launch]→ Measure&Learn →` (back to Discover). pm-lead orchestrates;
the human passes 3 gates; pm-reviewer reviews every gate package first.

## The 6 pitfalls and their mitigations (all shipped)

| # | Pitfall | Mitigation | Where it lives |
|---|---|---|---|
| 1 | **Human-gate bottleneck** | Ergonomics only — batch decisions via `/pm-inbox`. The human stays (it's the product); gates are NEVER auto-passed. | `great-pm` skill, `/pm-inbox` |
| 2 | **brain.md is shared-truth SPOF** — injected into every subagent; stale brain poisons the whole loop | SessionStart flags brain older than the latest verdict; pm-lead refreshes brain.md at cycle close | `scripts/great-pm-session-start.sh`, `pm-lead` |
| 3 | **Learning loop is manual** — lessons never captured, system never learns | SessionEnd flags `.learn-pending`; SessionStart injects an ACTION-REQUIRED directive to run continuous-learner before advancing; cycle isn't "done" until lessons land | session-start script, `pm-lead`, `great-pm` skill |
| 4 | **Build-feedback loop missing** — spec mistakes repeat | `.great-pm/build-feedback/<initiative>.md` intake; spec-writer + pm-tech-spec-review ingest pending feedback before the next spec, then rename `*.ingested.md`; SessionStart flags unprocessed | session-start script, `spec-writer`, `pm-tech-spec-review` |
| 5 | **Skill overload / dangling cross-links** | `scripts/great-pm-skill-doctor.sh` — flags agents over the skill threshold, dangling skill refs, and depth-gap skills | `scripts/great-pm-skill-doctor.sh`, `/pm-doctor` |
| 6 | **Skill staleness (no GC) + orchestrator-can't-spawn** | Documented recurring `skill-doctor` + `skill-scout` cadence; pm-lead self-checks for the Agent tool and refuses to silently impersonate specialists | `great-pm` skill, `pm-lead` |

## Conventions introduced

- **`.great-pm/.learn-pending`** — touch-file dropped at SessionEnd; its presence
  means "a learning pass is owed." Removed once continuous-learner has run.
- **`.great-pm/build-feedback/<initiative>.md`** — written after a build (by the
  human or engineering) capturing what the spec got wrong. Ingested by spec-writer,
  then renamed `<initiative>.ingested.md`.
- **brain.md freshness** = brain.md must be newer than the latest
  `.great-pm/verdicts/*.log`. Older ⇒ stale ⇒ refresh.

## Running the checks

```bash
# mechanical harness health (skill overload, dangling links, depth gaps)
bash scripts/great-pm-skill-doctor.sh
# session context + loop directives (runs automatically at SessionStart)
bash scripts/great-pm-session-start.sh
```

`/pm-doctor` wraps the skill-doctor in an agent-level audit.

## Open-Decision Register (anti-drift — never lose a question)

**Pitfall:** a question is raised, the work moves on, and later work silently
builds on a stale assumption nobody confirmed. Prose questions scroll away.

**Mechanism — questions live in beads, not prose:**
- **Capture:** any agent surfacing a human-decision files
  `bd create "DECISION NEEDED: …" --label open-decision --priority {0=blocking|2=advisory}`
  with `Blocks:`, `Default-if-unanswered:`, `Raised-by:` in the description.
  Enforced by the `done-blocked` contract (rule 6) — burying it in prose is rejected.
- **Block (teeth):** a P0 decision blocks its gate (`bd dep add <gate> <decision>`).
  pm-lead can't present that gate; pm-reviewer auto-returns the package NEEDS-WORK.
- **Proceed only on a logged default:** if work can't wait, the artefact says
  "proceeding on assumption X because decision <id> is open," mirrored in the bd
  notes. Silent defaults are forbidden; a differing answer flags the artefact for revision.
- **Surface:** SessionStart injects open decisions as ACTION-REQUIRED; `/pm-inbox`
  heads with them; pm-lead re-surfaces before each stage advance.
- **Resolve + remember:** answer → record in the issue → `/pm-crystallize` durable
  ones to `~/.great-pm/decisions.md` → close (unblocks the gate) → revise wrong-default work.

**Honest limit:** the register catches drift at every *boundary* (session start,
stage advance, gate). A single marathon conversation that never hits a boundary
still leans on pm-lead re-surfacing — but a decision can never pass a *gate* unseen.

## Harness principles these encode (from harness-principles.md Part B)

- **Repo-local or it doesn't exist** — every loop's state is a file under
  `.great-pm/`, versioned with the project.
- **Mechanical enforcement over convention** — skill-doctor + the SessionStart
  freshness/pending checks are scripts, not reminders-by-hope.
- **Every mistake becomes a harness fix** — the build-feedback loop turns a
  shipped-spec mistake into an input the next spec must consume.
- **Small continuous payments** — skill-doctor + skill-scout as a recurring GC
  keep the 75-skill library from rotting, rather than a periodic big cleanup.
- **Known limit (honest):** truly unattended automation is impossible (hooks ≠
  agents). These loops are "automatic on next session," and the human-gate
  bottleneck is deliberate, not a defect.
