# Codex 1.1.4 identifier compatibility verification

Date: 2026-09-20. Host: macOS, Codex CLI 0.153.4. Product fixture: fictional Evidence Inbox in an isolated temporary repository, local Beads 1.0.3. No customer interviews were used.

## Approved correction

Preserve every public workflow, role name, filename and verdict-log name. Convert hyphens to underscores only for Codex internal spawn identifiers. Example: canonical `query-refiner-pm`, internal `query_refiner_pm`. Generated role instructions and the runtime carry both names. Candidate version is 1.1.4 so local installation does not reuse the defective 1.1.3 cache.

## Test-first evidence

Before implementation, three updated regression checks failed against 1.1.3: missing internal role identifiers, missing runtime mapping, and incompatible workflow host binding. After correction, all 20 Codex tests and 112 shared adapter/connector tests passed. Generated package check passed (315 files). All 48 role identifiers are valid, unique and reversible; the 34 workflow names, including `$grill-me`, remain unchanged. Independent static review found no actionable issues in this scoped change.

## Real host retry

Installed 1.1.4 from the local marketplace; installed files match the generated package. A fresh CLI session loaded that package rather than 1.1.3.

| Canonical role | Internal identifier | Returned agent identifier | Observed outcome |
|---|---|---|---|
| query-refiner-pm | query_refiner_pm | /root/query_refiner_pm | Spawned and returned DONE; refinement and canonical verdict log persisted. |
| pm-lead | pm_lead | /root/pm_lead | Spawned; delegated discovery and preserved dependency blockers. |
| user-researcher | user_researcher | /root/pm_lead/user_researcher | Spawned; diagnostic artifact and BLOCKED verdict persisted. |
| feedback-synthesizer | feedback_synthesizer | /root/pm_lead/feedback_synthesizer | Spawned concurrently with user-researcher; diagnostic artifact and BLOCKED verdict persisted. |
| market-analyst | market_analyst | None | Not spawned after discovery dependency failure; not counted as a live pass. |

The original identifier rejection no longer occurred. Discovery correctly refused to treat three invented scenarios as validated customer demand or recurring real feedback. Stage task `gpsmoke-zzs` and assignments `gpsmoke-02y`, `gpsmoke-xfz`, `gpsmoke-d6f` were blocked. No strategy gate was created or approved; Strategize, Prioritize, review and Define were not exercised. This verifies the scoped fix and safe stopping, not full end-to-end release readiness.

## Remaining checks and findings

- Full initiative through pending strategy gate: incomplete. A suitable evidence-backed scenario or a separately designed, explicitly synthetic test contract is needed; do not weaken production proof requirements just to pass a smoke test.
- Resume: PASS for reading and orienting from saved state in a fresh CLI session. `$pm-resume` used the mapped query-refiner, read the handoff, cross-checked current Beads/artifacts, correctly reported blocked Discovery and no open gate, and did not advance. It flagged the older handoff snapshot rather than presenting it as current. Actual hook-triggered resume remains unverified.
- Handoff generation: the packaged pre-compact script was invoked directly in the temporary workspace and produced HANDOFF.md. This tests the script, NOT actual compaction-event delivery, hook trust or automatic lifecycle execution.
- Desktop permission/hook review remains unconfirmed. No hook-trust bypass was used.
- Separate packaging gap found in 1.1.4: `agents/pm-lead.md` references `skills/great-pm/WORKFLOW.md`, but that package omitted it. The live agent recovered via other packaged contracts. The 1.1.5 correction and verification are recorded below; the historical 1.1.4 run is not relabelled.
- A fresh public default-branch installation remains pending the approved merge sequence. This was a local candidate upgrade, not a public-release test.

No merge, deployment, publication, gate approval or changes to the Claude source skills/roles occurred during the identifier fix. The original July smoke-evidence record is retained as historical evidence rather than relabelled as current.

## 1.1.5 supporting-file correction

The packager now recursively copies each canonical skill directory before rendering its Codex entry point. This preserves supporting files and retains the `pm-audit` → `method-pm-audit` directory mapping and subsequent workflow overlays. The new supporting-file regression first failed with ENOENT before this correction.

Fresh verification on 2026-09-20:

- 21 Codex tests plus 112 shared adapter/connector tests: **133 passed, 0 failed**.
- Generated output is current: **316 files**; `git diff --check` passes.
- Locally installed manifest reports **1.1.5**; its `skills/great-pm/WORKFLOW.md` matches canonical content byte-for-byte.
- Canonical `agents/`, `skills/`, and `commands/` have no changes in this correction.
- Independent review found no blocking issue. A minor coverage limitation remains: the source inventory currently contains only one supporting file, so the recursive comparison does not exercise synthetic nested or renamed-directory asset fixtures.

The observed live delegation and resume results above remain **1.1.4 evidence**, not new 1.1.5 end-to-end tests. Full strategy-gate traversal and actual desktop lifecycle/hook trust remain open. Local installation is not a default-branch public release.

## Hosting deferral

After repeated local OAuth callback failures, the owner asked on 2026-09-20 to skip the optional hosting step and move forward. Cloudflare login attempts are paused. They are not required for the native Codex plugin or for pushing code to GitHub. Hosted deployment, Registry publication and a public remote-service launch remain pending; no hosting provider substitution or authentication bypass is authorized by this deferral.

## Follow-up release checks and 1.1.6 correction

The owner requested continuing the authorized work without step-by-step pauses.
The supported CLI hook browser on 0.153.4 reported **five installed hooks,
zero active, five awaiting review**. `PreToolUse` explicitly showed source
`Plugin - great-pm@great-pm` and the installed 1.1.5 command. No trust was
granted and no bypass flag was used. Desktop Computer Use returned a safety
restriction for `com.openai.codex`; no alternative UI-control workaround was
attempted. Human hook trust remains a real prerequisite, not a code test.

The installation guide incorrectly implied that hooks were limited to the
model's session permissions. The CLI explicitly warns that trusted hooks can
run outside its sandbox. The guide now discloses this boundary, the startup
shortcut side effect, and the supported `/hooks` review route. The documentation
regression failed before correction and passed afterward.

A broader reference audit also found `docs/HARNESS-LOOPS.md` missing, although
both the operating-model skill and PM lead reference it. A new regression
reproduced ENOENT. The **1.1.6** candidate copies only that explicitly allowlisted
canonical runtime document; private research and release documents are not
packaged. The generated package has **317 files**. All **134** Codex/shared
tests pass; generated freshness and whitespace checks pass. Independent review
found no actionable issue in these scoped fixes. This is not itself a new
full-workflow pass; version-specific live results must be recorded separately.

## Extended 1.1.5 live exercise and terminal limitation

A separate disposable workspace exercised the installed **1.1.5** package with
real feedback records from one owner. The records, generated product drafts,
and full private reviews are not included in this repository. They are not a
multi-participant interview study or market validation.

The real host returned these specialist results; internal identifiers are the
canonical names with hyphens replaced by underscores. The returned agent paths
were `/root/query_refiner_pm`, `/root/pm_lead`, and
`/root/pm_lead/<internal_identifier>` for the delegated specialists.

| Canonical role | Observed result |
|---|---|
| query-refiner-pm | DONE; refinement persisted |
| user-researcher | DONE; bounded discovery brief |
| feedback-synthesizer | DONE; feedback digest |
| market-analyst | DONE; competitive brief, unknown sizing preserved |
| product-strategist | DONE; strategy draft |
| pricing-strategist | DONE; no separate paid model, unknown willingness to pay |
| prioritization-analyst | DONE; ranked backlog |
| roadmap-planner | BLOCKED; draft saved but capacity proof remained unsatisfied |
| devils-advocate | DONE; five blocking test-scenario decisions recorded |
| pm-reviewer | DONE; exact verdict NEEDS-WORK, six must-fix findings, three suggestions |
| pm-lead | BLOCKED persisted in the coordinator artifact and verdict log; final return interrupted as described below |

Discover and Strategize completed; Prioritize could not pass the roadmap's
capacity proof without a cycle boundary and capacity/effort basis. The two
review roles still reviewed an internal packet explicitly labelled blocked,
not for approval. The reviewer verdict remained **NEEDS-WORK** and the
skeptical-triage arbiter remained **WEAK**. Open test decision IDs were
`gprelease-gv4`, `gprelease-dmv`, `gprelease-jjx`, `gprelease-ee8`, and
`gprelease-w9j`. These reflect the bounded fixture's incomplete context; they
do not reopen or override the owner's approved full-parity build decision.

Direct Beads checks found **no strategy gate and no Define-stage task**.
No gate was approved or closed. The four-slot host limit meant only two
specialists could run beside the root and coordinator; dependent roles ran
in order rather than being falsely reported as concurrent.

The coordinator persisted its blocked report, but its final return stalled.
The host logged a root stream retry at 15:28:38 UTC and a coordinator idle
WebSocket timeout at 15:30:01 UTC. The identified acceptance CLI process was
interrupted with SIGINT after these observations; it exited 1. Its root final
report was not obtained. This is **not** a clean end-to-end pass, a pending-gate
traversal, or evidence that all 48 roles have executed. The known durable
specialist results and safe stop are retained without concealing that limit.

Other observed conditions included recovered stream failures, analytics/model
refresh warnings, skills-context shortening, Beads auto-export failures while
the task store remained usable, and recovered patch attempts. The main agent
independently verified the persisted reviewer/coordinator logs and artifacts
after the patch failures. Generic host icon warnings were not attributed to
GreatPM without identifying the responsible plugin.

## Local 1.1.6 upgrade and trust status

After ending the 1.1.5 exercise, `codex plugin add great-pm@great-pm --json`
installed **1.1.6** from the local marketplace. All supplied package files match
the reviewed generated tree; Codex additionally created its own
`.codex-plugin/migrated-command-skills` directory. The installed harness guide
matches canonical content and the installed doctor returns `ok: true`.

A fresh CLI 0.153.4 session again reported five installed hooks, **zero active**,
and five requiring review. Both inspection sessions were exited without trust
or bypass. The five hook definitions/scripts are unchanged between 1.1.5 and
1.1.6, but the current installation still requires explicit review. Automatic
lifecycle operation and desktop validation remain unverified. This local
upgrade is not a default-branch installation or a public release.

## Focused report-recovery retry

At the owner's request, a fresh `codex exec resume` retried only the interrupted
report, using the saved verdicts and a bounded Beads check. It completed with
exit 0 and returned the final report without rerunning specialists, changing
trust, resolving decisions, or publishing private material. The recovered
report confirms the original 1.1.5 **BLOCKED / NEEDS-WORK** outcome and no gate
or Define entry. Recovery of the response does not turn that workflow into a
passing gate traversal or into 1.1.6 workflow evidence.

Fresh retry verification: 22 Codex tests, 112 shared tests and 47 server tests
pass (181 total); generated package freshness passes at 317 files. The
remaining prerequisites are unchanged: complete the bounded gate-path test,
obtain explicit hook trust and verify lifecycle/desktop behavior. Hosting is
still paused. The private local report and test drafts remain outside Git.
