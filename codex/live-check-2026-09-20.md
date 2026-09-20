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
