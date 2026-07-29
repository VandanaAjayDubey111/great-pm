---
name: pm-help
description: "List all great-pm commands and what each does, grouped by stage / purpose."
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


You are the great-pm `$pm-help` command. Print every available command,
grouped sensibly. If `--brief`, print just the command names without
descriptions.

## Output

```
great-pm — your product team in software

THE 6-STAGE LOOP
  $grill-me "<idea>"             grill-me interrogates YOU — short adaptive rounds
                                 that widen a fuzzy idea and surface unknowns before
                                 you build on it. Works at ANY stage (new initiative,
                                 mid-build feature, pivot, post-launch). Ends in a
                                 situation brief + offer to $pm-start from it.
  $pm-start "<problem>"          Bootstrap a new initiative. Always offers a grill
                                 first, then auto-runs the Discover
                                 stage and proceeds through to gate:strategy.

  $pm-discover <slug>            Stage 1: user-researcher + feedback-synthesizer +
                                 market-analyst (parallel). Outputs discovery brief +
                                 competitive brief.
  $pm-strategize <slug>          Stage 2: product-strategist (+ pricing-strategist with
                                 --with-pricing). Outputs strategy doc with falsifiable
                                 bet + kill criterion.
  $pm-prioritize <slug>          Stage 3: prioritization-analyst (RICE/WSJF/Kano/MoSCoW)
                                 + tradeoff-arbiter. Outputs ranked backlog.
  $pm-spec <slug>                Stage 4: spec-writer + spec-reviewer (mandatory clarity
                                 check). Outputs PRD ready for gate:spec.
  $pm-launch <slug>              Stage 5: launch-manager + gtm-strategist (parallel).
                                 Outputs launch plan + GTM plan for gate:launch.
  $pm-measure <slug>             Stage 6: analytics-analyst + experiment-designer.
                                 Outputs performance read-out + next-cycle questions.
                                 The loop closes here.

DECISIONS & GATES
  $pm-inbox                      Show pending gates and decisions waiting on you.
  $pm-board                      Open the project board.
  $pm-promote <draft>            Promote a draft to a gate-ready Beads issue. Runs
                                 pm-reviewer first; PASS is required.
  $pm-review <artefact>          Trigger pm-reviewer on any artefact. Returns verdict
                                 unedited. Non-promoting.
  $pm-gate approve <id>          Explicitly approve a filed gate (great-pm default).
  $pm-gate reject <id> <reason>  Reject a gate with reason; halts pipeline.
  $pm-gate list                  Show open gates (minimal view; $pm-inbox is richer).
  $pm-gate show <id>             Full gate state + linked draft + REVIEW doc.
  $pm-ownership                  Show who owns what across initiatives, drafts, gates.

SPECIALIST WORK
  $pm-experiment <hypothesis>    Author a pre-registered A/B / multivariate / holdout /
                                 switchback experiment.
  $pm-metrics <slug>             Author the metrics plan BEFORE the build. North Star +
                                 KPIs + instrumentation events.
  $pm-roadmap                    Generate or refresh the roadmap (Now / Next / Later).
  $pm-feedback <source>          Synthesize a feedback batch into JTBD-clustered themes.
  $pm-competitive <target>       Competitive teardown — single competitor or whole
                                 landscape around a JTBD.
  $pm-pricing <scope>            Author or refresh a pricing plan with willingness-to-
                                 pay rationale per audience.

ANALYSIS & AUDIT
  $pm-audit [scope]              15-dimension PM-health audit. Severity-rated findings.
  $pm-cost                       Show great-pm token / agent-invocation cost over time.
  $pm-burn                       Show recent agent burn — who ran, how long, what
                                 verdict.
  $pm-digest                     One-screen digest of the last N sessions.
  $pm-crystallize <topic>        Crystallize a recurring discussion into a permanent
                                 decision doc.
  $pm-rfc <topic>                Draft an RFC for a non-trivial decision (architecture,
                                 governance, scope change).
  $pm-poc <hypothesis>           Spec a minimal proof-of-concept that would falsify
                                 the hypothesis cheaply.

SESSION
  $pm-save                       Full end-of-session hand-off (logs + status + lessons).
  $pm-learn                      Lightweight: extract lessons from this session only.
  $pm-resume                     Resume work from the most recent .great-pm/HANDOFF.md.
  $pm-doctor                     Health check on .great-pm/ state — surface drift,
                                 missing files, orphan drafts.

META
  $pm-agent-review <agent>       Review a great-pm agent's recent verdict distribution
                                 and drift signals.
  $pm-agent-retire <agent>       Deprecate an agent gracefully (governance-gated, never
                                 deletes).
  $pm-help                       This help.

CONCEPTS
  The 6-stage loop        Discover → Strategize → Prioritize → Define →
                          (handoff to engineering / engineering) → Launch → Measure.
  The 3 gates             gate:strategy, gate:spec, gate:launch — every gate package
                          passes through pm-reviewer first; the verdict travels to
                          you unedited.
  Parallel-by-dependency  Multiple initiatives run in parallel; unrelated work never
                          blocks unrelated work.
  Governance              Agents DRAFT and PROPOSE. You DECIDE. One narrow exception:
                          skill-scout may swap a skill autonomously when isolated and
                          non-critical (logged to .great-pm/skill-swaps.log).

For more, see ${PLUGIN_ROOT}/README.md.
```

If `--brief` was passed, print only the command names (one per line, no
descriptions).

## Reporting

- **DONE**: `DONE: great-pm commands listed (34 total).`
