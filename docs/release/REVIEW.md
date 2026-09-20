# GreatPM release review — 2026-09-20

**State: draft PRs #2 and #3 are open. Plugin fixes are being synchronized; hosting is paused at the owner's request. No public-release completion is claimed.**

## Destination and releases

| Field | Filled value |
|---|---|
| Owner | VandanaAjayDubey111 |
| Repository | https://github.com/VandanaAjayDubey111/great-pm |
| Visibility / access verified | Public / owner has ADMIN access |
| Default branch | `main` |
| First PR head | `codex/greatpm-codex-plugin` |
| First PR base | `main` |
| First PR title | Add the full GreatPM product-management plugin for Codex |
| First PR description | [CODEX-PR.md](CODEX-PR.md) |
| Second PR head | `codex/greatpm-release-review` |
| Second PR initial base | `codex/greatpm-codex-plugin` (stacked on the first PR) |
| Second PR title | Add the public GreatPM MCP with verified Codex compatibility |
| Second PR description | [MCP-PR.md](MCP-PR.md) |
| Codex plugin candidate | `1.1.5` |
| Claude plugin candidate | `1.0.1` |
| MCP candidate / future tag | `1.0.0` / `mcp-v1.0.0` |
| MCP URL | https://greatpm-mcp.vandana424-s.workers.dev/mcp |
| Health URL | https://greatpm-mcp.vandana424-s.workers.dev/health |
| Registry name | `io.github.vandanaajaydubey111/great-pm` |
| Cloudflare Worker | `greatpm-mcp` |
| Deployment branch/environment | `main` / `production` |
| Registry environment | `mcp-registry` |
| Required deployment/Registry reviewer | VandanaAjayDubey111, GitHub user ID `277480974` |

The Codex plugin is the full product-management operating system. MCP is an
optional public knowledge channel. The full plugin must be signed off and
merged first. Both PRs should start as drafts. After the first PR merges,
change the second PR's base to `main`, inspect its diff, and rerun checks.
Prefer a normal merge commit for the first PR so stacked history is preserved.

## Changes prepared

- Reconciled the plugin and MCP branches, preserving both native plugin
  packages and the remote server.
- Combined the privacy/security notices and regenerated the plugin's bundled
  copies; clarified each product's data handling and capability limits.
- Fixed Codex host conversion so paths such as
  `.great-pm/verdicts/pm-reviewer.log` and upstream attribution URLs retain their
  slashes; workflow invocations still become `$pm-help` / `$grill-me`.
- Bumped Codex to 1.1.3 so the corrected package has a distinct cache version.
- Subsequent 1.1.5 candidate fixes internal specialist spawn identifiers and
  includes supporting skill files such as `skills/great-pm/WORKFLOW.md`.
  Public workflow and specialist names, including `$grill-me`, are unchanged.
- Added a regression test that reproduces the path/URL corruption before the
  fix and passes after it.
- Kept deployment manual and restricted to `main`; added serialized jobs and
  a clear missing-secret check.
- Prepared owner-reviewed GitHub environments for deployment and Registry
  publishing. Configuration files are proposals until applied after review.
- Pinned MCP publisher v1.8.1 and its official Linux SHA-256 checksum.
- Filled PR descriptions, public endpoint, versions, Registry metadata and
  Codex installation/verification instructions.

## Verification

- 21 Codex tests, 47 MCP tests, 112 shared tests: **180 passing** on the
  integrated 1.1.5 candidate.
- Codex generated package: current, 316 files.
- MCP catalog freshness, TypeScript and Worker dry-run bundle: pass.
- MCP Registry's official validator: `server.json is valid`; no publication.
- Workflow YAML, embedded shell blocks and review JSON: parse successfully.
- Live MCP SDK checks: all tools, static/resource-template counts, PRD resource
  and `write-prd` prompt pass.
- Actual Codex CLI 0.153.4 called all three tools successfully on 2026-09-20;
  the response includes six stages and three explicit human gates.
- Global `great-pm` MCP connection is enabled with the correct URL.

Automated tests do not substitute for the remaining live native-plugin and
desktop checks recorded in `codex/smoke-evidence.json`. The full live
`$pm-start` to strategy gate was previously blocked by host stream resets.
That historical check has not been silently marked passed. The new
`codex/live-check-2026-09-20.md` records the 1.1.4 live delegation/resume
verification and the 1.1.5 packaging checks separately. Discovery correctly
stopped on insufficient synthetic evidence; full strategy-gate traversal and
desktop hook trust/event delivery remain open.

## Account setup prepared for after review

**Deferred:** on 2026-09-20, after repeated local OAuth callback failures, the
owner requested skipping optional hosting and moving forward. Do not restart
login, deploy, or publish Registry metadata as part of the plugin-only progress.
Cloudflare authentication is not required to install the native plugin or push
GitHub branches. It remains required for the chosen hosted deployment route.

The repository had no environment or repository secrets when checked. The
Cloudflare login is expired and cannot be refreshed non-interactively. No
credentials are included in these files. The account ID must be verified
after signing in; an API token must be created/stored securely by the owner.

The following commands change GitHub settings; **they have not been run**.
Run from the reviewed checkout only after approval:

```bash
gh api --method PUT repos/VandanaAjayDubey111/great-pm/environments/production --input .github/release/environment.json
gh api --method POST repos/VandanaAjayDubey111/great-pm/environments/production/deployment-branch-policies --input .github/release/production-branch.json
gh api --method PUT repos/VandanaAjayDubey111/great-pm/environments/mcp-registry --input .github/release/environment.json
gh api --method POST repos/VandanaAjayDubey111/great-pm/environments/mcp-registry/deployment-branch-policies --input .github/release/registry-tag.json
```

The owner is allowed to approve their own deployment because this is a solo
maintainer repository. `production` permits only the `main` branch;
`mcp-registry` permits only `mcp-v*` tags. GitHub must have these settings
applied before a deploy or release tag; merely checking in JSON does not
create or enforce them. If settings already exist by then, inspect them before
applying changes or adding duplicate policies.

Restore Cloudflare access from `mcp/` in an interactive terminal:

```bash
npx wrangler login
npx wrangler whoami
```

Create a Cloudflare API token with only the account permissions needed for
Worker deployment. GitHub Actions needs its own token; a local Wrangler OAuth
login does not configure Actions. Store the token and verified account ID via
the secure prompts below (no literal secret in shell history or git):

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo VandanaAjayDubey111/great-pm --env production
gh secret set CLOUDFLARE_ACCOUNT_ID --repo VandanaAjayDubey111/great-pm --env production
```

Never paste tokens into chat, PR descriptions, or these review files. Before
deployment, confirm account limits/logging and the current Worker revision.
The release workflow uses GitHub OIDC for Registry login and needs no static
Registry password.

## Remaining release steps

The owner reviewed both PRs and approved the unchanged release route before
subsequently pausing hosting. Branch pushes and the scoped bug fixes are
authorized; no force push or bypass of release checks is needed.

1. Synchronize the reviewed 1.1.5 fixes to both branches and verify fresh CI.
2. Finish native-plugin live/desktop sign-off; merge PR #2 first only after
   those prerequisites pass.
3. When hosting is resumed, apply reviewed GitHub settings and securely supply
   deployment credentials. Complete second-client and hosting/rollback checks.
4. Retarget PR #3 to `main`, inspect its diff and rerun CI before its merge.
5. Verify deployment and the unused Registry version before publishing.

Authentication and the remaining host checks are explicitly open. This
document does not claim that the reviewed candidate is publicly launched.
