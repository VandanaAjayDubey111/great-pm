# GreatPM release review — 2026-09-20

**State: prepared locally for Vandana's review; nothing pushed in this task.**

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
| Codex plugin candidate | `1.1.3` |
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

- 20 Codex tests, 47 MCP tests, 112 shared tests: **179 passing**.
- Codex generated package: current, 315 files.
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
That historical check has not been silently marked passed.

## Account setup prepared for after review

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

## Actions awaiting approval

1. Approve the two branch pushes and creation of the two draft PRs described
   above. No force push is needed. This does not include a merge, deployment,
   release tag, Registry publication, or public announcement.
2. Apply the reviewed GitHub settings and supply the Cloudflare credentials.
3. Finish native plugin live/desktop sign-off; merge that PR first.
4. Complete second-client and hosting/rollback checks, then review and merge
   the MCP PR. Run CI again against the final release commit.
5. Separately approve the production deployment and Registry release tag after
   verifying the deployed version and unused Registry version number.

Your original instruction to review before pushing is the reason this task
stops here. Authentication and the remaining host checks are explicitly open;
this document does not claim that public launch is complete.
