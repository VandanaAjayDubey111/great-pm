# GreatPM MCP: Codex compatibility and launch evidence

Checked: 2026-09-20. Server source baseline: `2ab233b` on
`codex/greatpm-mcp`. Live identity: `greatpm-mcp@1.0.0`.

## Result

**Release preparation update:** the local `codex/greatpm-release-review` branch
now reconciles both native-plugin and MCP work. See
[the release review](release/REVIEW.md) for current branch/PR details, combined
test results, and prepared environment settings. The observations below are
the earlier standalone MCP check; the branch-integration item is now prepared
locally. No push or publication has occurred. Cloudflare authentication was
rechecked during release preparation and has expired.

The existing remote MCP works with Codex CLI 0.153.4. No server transport
rewrite was necessary. The local Codex connection has been registered and its
configuration verified. Public release completion remains pending.

The full native GreatPM Codex plugin is separate, on
`codex/greatpm-codex-plugin`. Its release must precede the MCP public release,
per the owner's agreed order. This check does not certify the full plugin or
merge those branches.

## Verified checks

| Check | Evidence/result |
|---|---|
| Fresh dependencies | `npm ci --ignore-scripts --no-audit --no-fund` succeeded against the committed lockfile |
| Catalog freshness | `npm run catalog:check` passed |
| MCP suite | 47 tests across 9 files passed |
| Types | `npm run typecheck` passed |
| Worker bundle | `npm run deploy:dry` passed; 1322.71 KiB uncompressed, 286.01 KiB gzip, no bindings |
| Shared regressions | 112 connector/adapter tests passed |
| Live health | `/health` returned HTTP 200 with `status: ok` |
| Live protocol | Existing `smoke:remote` script succeeded against the public `/mcp` endpoint |
| Live capabilities | 3 tools, 2 static resources, 3 resource templates, 11 prompts |
| Live method/resource | `prd-authoring` retrieved successfully |
| Live prompt | `write-prd` retrieved successfully |
| Origin protection | POST with `Origin: https://untrusted.example` returned HTTP 403 |
| Actual Codex tool execution | Codex CLI 0.153.4 completed all three tool calls against the live endpoint |
| Saved local connection | `codex mcp get great-pm --json` reports enabled, `streamable_http`, correct URL, no bearer/header credentials |

The Codex test ran with temporary per-invocation server configuration,
`--ephemeral`, `--ignore-user-config`, a read-only sandbox, and no private
product input. Tool-call events, not just the final generated answer, showed:

- `greatpm_list_methods` with `query: pricing`, `limit: 5`: returned
  `pricing-models`.
- `greatpm_get_method` with `id: prd-authoring`: returned PRD guidance.
- `greatpm_prepare_workflow` with `initiative: Codex compatibility smoke test`:
  returned six stages and `gate:strategy`, `gate:spec`, `gate:launch`.

The Worker was already deployed before this check. No production deployment
was performed, and this check does not establish the deployed Git commit's
identity. Tests prove the observed release contract, not a byte-for-byte
comparison between local source and the deployed artifact.

## Remaining release work

| Item | Observed status / action |
|---|---|
| Native Codex plugin release | Still separate; complete its release before announcing the MCP |
| MCP pull request | GitHub returned no PR for `codex/greatpm-mcp`; push the verified changes and open/review a PR |
| Branch integration | Reconcile README, privacy/security docs, and shared source content with the Codex plugin branch before merging; rebuild catalog if source content changes |
| CI on integrated commit | Local checks pass; run GitHub Actions against the actual release commit |
| Deployment credentials | Repository secret names list was empty; add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for automated deployment |
| Production environment | GitHub environments list was empty, checked with repository admin access; configure the `production` environment used by the deployment workflow |
| Hosting operations | Cloudflare dashboard quotas, account logging, rollback and deployed revision provenance were not verified in this check |
| Desktop/client sign-off | Actual Codex CLI passed; fresh desktop task and another advertised client remain to be tested |
| Release tag | GitHub returned no tags; select an unused version only after final verification |
| MCP Registry | Exact server lookup returned HTTP 404 / Server not found; publish validated metadata after release and recheck the Registry API |

No passwords, API tokens, private project content, or secret values were read
or included in this record. Publication and production configuration were not
changed. No public-launch completion claim is justified until the release
items above are resolved.

## Reproduce

From `mcp/`:

```bash
npm ci
npm run catalog:check
npm test -- --run
npm run typecheck
npm run deploy:dry
npm run smoke:remote -- https://greatpm-mcp.vandana424-s.workers.dev/mcp
```

From the repository root:

```bash
node --test connectors/test/*.test.mjs adapters/test/*.test.mjs
```

Follow [the Codex installation and verification steps](MCP.md#install-in-codex)
for the actual client check. The desktop confirmation requires a new task
after refreshing the client; this document does not claim it was performed.

Official reference checked on the verification date:
[Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).
It supports Streamable HTTP, public servers without credentials, and shared
configuration across local Codex clients.
