# great-pm — Workflow

## Governance (MANDATORY)
Agents DRAFT and PROPOSE. They never ship, build, commit, or finalize on their
own. Every critical/final/production decision needs explicit human approval.
ONE carve-out: skill-scout may swap a skill autonomously when the change is
isolated to one agent, non-critical, and touches nothing else — otherwise it
proposes. Every autonomous swap is logged and reversible.

## The loop (6 stages)
1. DISCOVER     -> user research, feedback, market intelligence
2. STRATEGIZE   -> vision, differentiation, pricing
3. PRIORITIZE   -> scoring, roadmap, OKRs        ==> gate:strategy
4. DEFINE       -> PRD, success metrics          ==> gate:spec
   | [handoff: PRD -> engineering /start builds it]
5. LAUNCH       -> rollout, GTM                  ==> gate:launch
6. MEASURE&LEARN-> analytics, experiments
                  feeds the next DISCOVER

## Parallel orchestration
The loop is the lifecycle of ONE initiative. great-pm runs MANY initiatives at
once, each at its own stage, plus always-on agents (feedback-synthesizer,
market-analyst, skill-scout, stakeholder-comms). pm-lead orchestrates by
dependency — unrelated work never blocks unrelated work; everything not blocked
by a genuine per-initiative dependency runs in parallel.

## The 3 gates (human decides)
- gate:strategy — problem validated, earns a roadmap slot
- gate:spec     — PRD is clear & build-ready (lightweight review)
- gate:launch   — built and launch-ready

Every gate package passes through pm-reviewer BEFORE the human sees it —
mandatory, not optional. pm-reviewer's verdict (STRONG / NEEDS-WORK / WEAK)
travels with the package, unedited; pm-lead cannot remove or soften it.

## Tracking & memory — beads
Every task, stage, and gate is a beads (bd) issue. pm-lead creates issues when
assigning agents; agents claim them (bd update --claim) and close them (bd
close). Gates are beads issues labelled `gate`. Each agent opens a phase task
at start and closes it at end, so the board always shows live work. beads
persists across sessions — bd ready / bd prime restore loop state. If beads is
unavailable, agents fall back to .great-pm/tasks.md and never let a beads
error block the work.

## Stage -> lead agent
Discover: user-researcher, feedback-synthesizer, market-analyst
Strategize: product-strategist, pricing-strategist
Prioritize: prioritization-analyst, roadmap-planner
Define: spec-writer, spec-reviewer, metrics-architect
Launch: launch-manager, gtm-strategist
Measure&Learn: experiment-designer, analytics-analyst
Always-on: stakeholder-comms, tradeoff-arbiter
Meta: pm-lead, pm-auditor, continuous-learner, skill-scout
