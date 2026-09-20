# GreatPM release completion plan

> Execute the existing approved release route; no new product architecture or paid services. User confirmed “proceed unchanged” on 2026-09-20. Use debugging, test-driven development, review and verification before each release transition.

**Goal:** Fix release-blocking packaging defects, publish the full Codex plugin first, then deploy and verify the optional read-only MCP.

**Architecture:** Retain the canonical Claude source, generated Codex package, internal spawn identifier mapping and human gates. Retain the existing Cloudflare Worker and manually gated GitHub release workflows.

**Tech Stack:** Node.js packager/test runner, Codex plugin/runtime, GitHub Actions, TypeScript MCP SDK, Cloudflare Workers.

**2026-09-20 update:** Owner requested skipping optional hosting after repeated OAuth callback failures. Pause Cloudflare login, deployment and Registry publication; continue independent plugin verification and GitHub updates. This does not waive native-plugin live checks or authorize a different hosting provider. See `codex/live-check-2026-09-20.md` for observed evidence and remaining gaps.

**Continuous execution:** Owner then requested "do everything . don't wait after every step". Continue all authorized independent work without step approvals. Required security trust and product gates remain intact. Subsequent 1.1.6 correction adds the also-referenced harness guide and corrects hook-permission documentation; 134 Codex/shared tests pass.

## 1. Preserve supporting skill files

- [x] Add a regression test that builds into a temporary directory and compares packaged `skills/great-pm/WORKFLOW.md` to the canonical file; traverse every canonical skill's non-SKILL.md files recursively. Current inventory has no nested supporting-file fixtures; that extra coverage remains a non-blocking improvement.
- [x] Run `node --test codex/test/runtime-assets.test.mjs` and confirm the missing-file failure.
- [x] In `codex/lib/package-plugin.mjs`, copy each canonical skill directory recursively into its resolved output directory before rendering the host-specific SKILL.md. Preserve the pm-audit → method-pm-audit output mapping and workflow overlay order.
- [x] Bump the candidate to 1.1.5 so an already-installed 1.1.4 is not reused. Rebuild using `npm --prefix codex run build`.
- [x] Verify Codex/shared tests, generated freshness, canonical source preservation, and local reinstall containing WORKFLOW.md.

## 2. Verify release prerequisites

- [x] Retain the observed 1.1.4 real delegation/resume evidence. Do not mislabel a synthetic discovery stop as successful strategy-gate traversal.
- [ ] Verify desktop hook review and actual lifecycle operation, without bypassing trust. CLI reports five hooks awaiting review and zero active; desktop screen control is prohibited by the host.
- [ ] Complete strategy-gate traversal with appropriate evidence; do not weaken production validation requirements or falsely label synthetic interviews.
- [ ] Deferred by owner: check Cloudflare identity, deployment permissions, limits, logs and rollback. Do not restart login until hosting is resumed; never put secrets in chat or git.

## 3. Update and release

- [x] Commit initial reviewed fixes/docs/generated package on the existing plugin branch; preserve unrelated untracked files. Initial fix commit: `2cbc56d`.
- [x] Merge initial fixes into the stacked release-review branch without force pushes; rerun all tests. Integrated initial candidate: 180 passing.
- [x] Push initial fixes on both branches; verify both GitHub CI results. All checks passed at plugin `2cbc56d` and integrated `b861c41`.
- [ ] Push and verify subsequent 1.1.6 documentation/reference fixes on both branches.
- [ ] After prerequisites pass, merge plugin PR #2 first. Retarget PR #3 to main and rerun checks before its merge.
- [ ] Apply prepared GitHub environment review/branch restrictions and securely configure deployment credentials.
- [ ] Run manual deployment from main, verify exact deployed revision plus live clients, and confirm rollback.
- [ ] Publish Registry metadata only after deployment verification and check the public listing/installation instructions.

No PR merge, deployment or release claim is allowed while its prerequisite remains unverified. Record concrete blockers and continue independent safe work.
