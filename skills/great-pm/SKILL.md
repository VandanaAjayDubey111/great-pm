---
name: great-pm
description: The great-pm operating model — the 6-stage product loop, the 3 human gates, the governance rule, and the beads tracking conventions every great-pm agent runs on. Every agent draws on this skill.
when_to_use: |
  Read at the start of any great-pm work. pm-lead reads it to run the loop;
  every specialist agent reads it to know which stage it serves, what its gate
  is, and the governance rule it operates under.
allowed-tools: Read, Bash
paths:
  - ".great-pm/**"
  - "skills/great-pm/**"
---

# great-pm — Operating Model

great-pm gives a solo PM or founder a full product team. Specialist agents run a
continuous product loop; the human confirms a small number of gates.

## Governance (MANDATORY — overrides everything)

Agents DRAFT and PROPOSE. They never ship, build, commit, publish, or finalize
on their own. No critical or final decision is made without explicit human
approval. ONE carve-out: skill-scout may swap a skill autonomously when the
change is isolated to one agent, non-critical, and touches nothing else —
otherwise it proposes. Every autonomous swap is logged and reversible.

## The loop (6 stages)

1. DISCOVER      — user research, feedback, market intelligence
2. STRATEGIZE    — vision, differentiation, pricing
3. PRIORITIZE    — scoring, roadmap, OKRs            -> gate:strategy
4. DEFINE        — PRD, success metrics              -> gate:spec
   (handoff: the approved PRD goes to engineering /start for the build)
5. LAUNCH        — rollout, GTM                      -> gate:launch
6. MEASURE&LEARN — analytics, experiments — feeds the next DISCOVER

Full loop detail: `skills/great-pm/WORKFLOW.md`.

The loop is the lifecycle of ONE initiative. great-pm runs MANY at once — each
at its own stage — plus always-on agents. pm-lead orchestrates by dependency:
unrelated work never blocks unrelated work; everything not blocked by a genuine
dependency runs in parallel.

## The 3 gates (the human decides)

- gate:strategy — problem validated, earns a roadmap slot
- gate:spec     — PRD clear and build-ready (lightweight review)
- gate:launch   — built and launch-ready

A gate is a Beads issue labelled `gate`. Only the human passes it; agents
prepare the decision package. Every gate package passes through pm-reviewer
before the human sees it — mandatory; its verdict travels with the package,
unedited.

## Feedback loops & harness guards (MANDATORY — keep the loop self-correcting)

The loop only improves over time if these close. Hooks cannot run agents, so
the mechanism is: a hook FLAGS at session boundaries, and the agent EXECUTES the
directive at the next session start (it is injected into context). See
`docs/HARNESS-LOOPS.md` for the full design.

- **Learning loop (close every cycle).** Measure & Learn is NOT done until
  `continuous-learner` has run and written to `.great-pm/lessons.md`. SessionEnd
  drops `.great-pm/.learn-pending`; the next SessionStart injects an ACTION-REQUIRED
  directive — run the learning pass (or `/pm-learn`) and `rm .great-pm/.learn-pending`
  before advancing. A cycle that skips learning is incomplete.
- **Build-feedback loop (close before the next Define).** After a build, capture
  what the spec got wrong into `.great-pm/build-feedback/<initiative>.md`.
  `spec-writer` and `pm-tech-spec-review` MUST read pending build-feedback before
  the next spec; after ingesting, rename it `<name>.ingested.md`. SessionStart
  flags unprocessed feedback.
- **brain.md is shared truth — keep it fresh.** SubagentStart injects `brain.md`
  into EVERY subagent, so a stale brain poisons the whole loop. pm-lead refreshes
  `.great-pm/brain.md` at cycle close. SessionStart warns when brain is older than
  the latest verdict.
- **Gates stay human (do not "fix" the bottleneck by auto-approving).** The human
  approving the few gates IS the product. Batch decisions via `/pm-inbox`; never
  auto-pass a gate.
- **Orchestrator self-check.** pm-lead MUST verify it has the Agent tool before
  delegating. If it cannot spawn specialists, it states so loudly and does not
  silently impersonate them.
- **Recurring GC.** Run `bash scripts/great-pm-skill-doctor.sh` (skill overload +
  dangling cross-links + depth gaps) and periodically re-run `skill-scout` so the
  75-skill library does not rot. `/pm-doctor` wraps these checks.

## Open decisions — never lose a question (MANDATORY)

The failure this prevents: a question is raised, the work moves on, and later
work silently builds on a stale assumption nobody confirmed ("open-decision
drift"). Questions live in beads, not in prose, so they cannot scroll away.

- **CAPTURE (every agent).** When you surface a question that needs a HUMAN
  answer — or you proceed past one on an assumption — you MUST file it, not bury
  it in prose:
  ```bash
  bd create "DECISION NEEDED: <question>" --type task --label open-decision \
    --priority 0 \   # 0 = blocking (gate can't pass), 2 = advisory (surface only)
    --description "Blocks: <gate/stage/work>. Default-if-unanswered: <explicit default>. Raised-by: <agent>."
  ```
- **BLOCK (the teeth).** A blocking (P0) open-decision must block its gate: make
  the gate issue depend on it (`bd dep add <gate-id> <decision-id>` — gate is
  blocked-by the decision). A gate with an open blocking decision CANNOT be
  marked ready; pm-reviewer auto-returns such a package NEEDS-WORK.
- **PROCEED ONLY ON AN EXPLICIT, LOGGED DEFAULT.** If work genuinely cannot wait,
  it may proceed — but the artefact must say "proceeding on assumption X because
  decision <id> is open," and the same line goes in the decision's bd notes.
  Silent defaults are forbidden. When the human answers, if the answer differs
  from the assumed default, the dependent artefact is flagged for revision.
- **SURFACE.** SessionStart injects open decisions as an ACTION-REQUIRED
  directive; `/pm-inbox` lists them; pm-lead re-surfaces before advancing a stage.
- **RESOLVE + REMEMBER.** When answered: record the answer in the bd issue,
  promote durable ones to `~/.great-pm/decisions.md` (via `/pm-crystallize`),
  close the issue (unblocks the gate), and revise any artefact built on a now-
  wrong default.

The rule of thumb: **if a human needs to decide it, it is a beads `open-decision`
— never only a sentence in a doc.**

## Tracking & memory — beads

Every cycle, stage, and agent assignment is a Beads (bd) issue. Each agent
opens a phase task at start and closes it at end, so the board always shows
live work. beads persists across sessions — `bd ready` / `bd prime` restore
loop state. If beads is unavailable, agents fall back to `.great-pm/tasks.md`
and never let a beads error block the work.

## Memory layers (read before acting)

- `.great-pm/PROJECT.md`     — archetype, active packs, current loop stage
- `.great-pm/brain.md`       — compiled project knowledge / synthesis
- `.great-pm/lessons.md`     — project-local lessons
- `~/.great-pm/decisions.md` — cross-project decisions
- `.great-pm/verdicts/`      — per-agent DONE/BLOCKED audit trail

## Reporting contract

Every agent ends its run with a DONE or BLOCKED line — see the `done-blocked`
skill.

## Agent roster

47 agents installed: the 6-stage loop team (pm-lead orchestrator + Discover/
Strategize/Prioritize/Define/Launch/Measure specialists), the critical trio
(pm-reviewer — reviews packages; pm-advisor — outside opinion on the bet;
devils-advocate — interrogates assumptions + the human's framing, feeds the
Open-Decision Register), pm-auditor (process health), strategy-analyst
(situation-analysis frameworks feeding product-strategist), cross-cutting agents
(stakeholder-comms, tradeoff-arbiter, continuous-learner, skill-scout), plus
product-archetype and domain reviewers. See the great-pm design doc for the full
roster. (Count verified against ~/great-pm/agents/ on 2026-05-29.)
