# GreatPM Public MCP Server Implementation Plan

> **Execution:** Implement this plan inline with test-driven development. Run
> every red/green command at the task checkpoint and commit passing increments.

**Goal:** Launch a public, stateless, read-only GreatPM MCP server on Cloudflare
Workers and publish reproducible installation metadata.

**Architecture:** An isolated TypeScript package under `mcp/` builds an
allowlisted static catalog from existing GreatPM content. A Cloudflare Worker
creates a fresh MCP server and Web Standard Streamable HTTP transport per
request, exposing three deterministic tools plus resources and prompts. The
runtime has no storage, secrets, connector access, filesystem access, or
outbound model calls.

**Stable stack verified 2026-07-28:** `@modelcontextprotocol/server@2.0.0`,
`@modelcontextprotocol/client@2.0.0`, `@modelcontextprotocol/core@2.0.0`,
the official `@modelcontextprotocol/server@2.0.0` Worker handler, Wrangler 4.x,
TypeScript, Vitest,
and Cloudflare Workers types.

---

## Task 1: Scaffold the isolated package

**Files:**

- Create: `mcp/package.json`
- Create: `mcp/package-lock.json`
- Create: `mcp/tsconfig.json`
- Create: `mcp/vitest.config.ts`
- Create: `mcp/wrangler.jsonc`
- Create: `mcp/src/index.ts`
- Create: `mcp/test/smoke.test.ts`
- Modify: `.gitignore`

**Steps:**

1. Add a failing smoke test that imports the future Worker and expects it to
   expose a `fetch` handler.
2. Run `npm test -- --run test/smoke.test.ts` from `mcp/` and verify the import
   fails.
3. Add the minimum package configuration and Worker export.
4. Install exact stable MCP packages and compatible development dependencies.
5. Run the smoke test and `npm run typecheck`; verify both pass.
6. Commit: `build(mcp): scaffold Cloudflare Worker package`.

## Task 2: Build and validate the public catalog

**Files:**

- Create: `mcp/catalog.allowlist.json`
- Create: `mcp/scripts/build-catalog.mjs`
- Create: `mcp/src/catalog/types.ts`
- Create: `mcp/src/catalog/catalog.ts`
- Generate: `mcp/src/generated/catalog.ts`
- Create: `mcp/test/catalog.test.ts`
- Modify: `mcp/package.json`

**Allowlisted methods:**

- `continuous-discovery`
- `jobs-to-be-done`
- `user-research`
- `mom-test`
- `opportunity-solution-tree`
- `competitive-analysis`
- `porters-five-forces`
- `swot-analysis`
- `product-strategy-stack`
- `working-backwards`
- `pricing-models`
- `prioritization-methods`
- `impact-mapping`
- `outcome-roadmap`
- `brainstorm-okrs`
- `prd-authoring`
- `metrics-design`
- `experiment-design`
- `launch-readiness`
- `growth-loops`
- `cohort-analysis`
- `funnel-diagnostics`
- `pre-mortem`
- `stakeholder-map`
- `responsible-ai-guardrails`
- `ai-use-case-scoping`
- `ai-evals`
- `cost-model`

**Steps:**

1. Write failing tests for unique IDs, lifecycle-stage metadata, deterministic
   search, stage filtering, result limits, exact retrieval, and unknown IDs.
2. Run `npm test -- --run test/catalog.test.ts`; verify failure.
3. Define the catalog types and allowlist metadata.
4. Implement the generator using only Node built-ins. Parse front matter,
   normalize text, escape generated TypeScript safely, and write deterministic
   output.
5. Generate the catalog and implement `listMethods()` and `getMethod()`.
6. Add `catalog:build` and `catalog:check` scripts; the check regenerates to a
   temporary file and fails if committed output is stale.
7. Run the catalog tests and checks; verify pass.
8. Commit: `feat(mcp): generate curated GreatPM method catalog`.

## Task 3: Implement deterministic workflow preparation

**Files:**

- Create: `mcp/src/workflow.ts`
- Create: `mcp/test/workflow.test.ts`

**Steps:**

1. Write failing tests for the six lifecycle stages, three gates, expected
   artifacts, selected stages, current-stage next action, method references,
   governance language, and validation limits.
2. Run `npm test -- --run test/workflow.test.ts`; verify failure.
3. Implement pure workflow data and `prepareWorkflow()`.
4. Ensure the function returns structured data only and never mutates input.
5. Run the workflow tests; verify pass.
6. Commit: `feat(mcp): add GreatPM workflow planner`.

## Task 4: Register tools

**Files:**

- Create: `mcp/src/tools.ts`
- Create: `mcp/test/tools.test.ts`

**Steps:**

1. Write failing tests that create an in-memory MCP client/server transport,
   list the three tools, inspect schemas and annotations, call every success
   path, and assert useful MCP errors for invalid/unknown input.
2. Run `npm test -- --run test/tools.test.ts`; verify failure.
3. Register:
   - `greatpm_list_methods`
   - `greatpm_get_method`
   - `greatpm_prepare_workflow`
4. Use Zod input schemas with descriptions and hard bounds.
5. Return both human-readable text content and stable structured content.
6. Add read-only, non-destructive, idempotent, closed-world annotations.
7. Run the tool tests; verify pass.
8. Commit: `feat(mcp): expose read-only product workflow tools`.

## Task 5: Register resources

**Files:**

- Create: `mcp/src/resources.ts`
- Create: `mcp/test/resources.test.ts`

**Steps:**

1. Write failing protocol tests for resource listing, catalog/workflow reads,
   method URI-template reads, invalid IDs, templates, and selected docs.
2. Run `npm test -- --run test/resources.test.ts`; verify failure.
3. Register static and templated resources:
   - `greatpm://catalog`
   - `greatpm://workflow`
   - `greatpm://methods/{id}`
   - `greatpm://templates/{id}`
   - `greatpm://docs/{id}`
4. Return JSON for indexes and Markdown for full content.
5. Run resource tests; verify pass.
6. Commit: `feat(mcp): publish GreatPM resources`.

## Task 6: Register portable prompts

**Files:**

- Create: `mcp/src/prompts.ts`
- Create: `mcp/test/prompts.test.ts`

**Steps:**

1. Write failing tests for all 11 prompt names, required arguments, prompt
   retrieval, method/resource references, and banned local-execution tokens.
2. Run `npm test -- --run test/prompts.test.ts`; verify failure.
3. Register prompts using portable user messages and bounded arguments.
4. Add a static portability test that rejects `Agent(`, `Bash`, `/pm-`, `bd `,
   `.great-pm/`, and instructions to write or publish without approval.
5. Run prompt tests; verify pass.
6. Commit: `feat(mcp): add portable GreatPM prompts`.

## Task 7: Create the server factory and secured Worker transport

**Files:**

- Create: `mcp/src/server.ts`
- Create: `mcp/src/security.ts`
- Replace: `mcp/src/index.ts`
- Create: `mcp/test/security.test.ts`
- Create: `mcp/test/http.test.ts`

**Steps:**

1. Write failing tests for server metadata and for `/`, `/health`, `/mcp`,
   unknown paths, invalid Host, malformed/disallowed Origin, allowed local and
   Worker hosts, declared and undeclared bodies over 256 KiB, disabled
   subscriptions, and security headers.
2. Run `npm test -- --run test/security.test.ts test/http.test.ts`; verify
   failure.
3. Implement `createGreatPmServer()` and register tools, resources, and prompts.
4. Implement a request guard with environment-configurable exact host and
   origin allowlists plus safe Workers defaults.
5. For each `/mcp` request, create a fresh
   `WebStandardStreamableHTTPServerTransport` with no session ID and JSON
   response mode, connect a fresh server, and handle the Web Standard request.
6. Ensure transport errors produce safe responses and never expose stack
   traces.
7. Run HTTP/security tests, typecheck, and `wrangler deploy --dry-run`; verify
   pass.
8. Commit: `feat(mcp): serve secured stateless Streamable HTTP`.

## Task 8: Add public metadata and documentation

**Files:**

- Create: `docs/MCP.md`
- Create: `docs/MCP-ARCHITECTURE.md`
- Create: `docs/MCP-OPERATIONS.md`
- Create: `SECURITY.md`
- Create: `PRIVACY.md`
- Create: `server.json`
- Modify: `README.md`
- Create: `mcp/test/metadata.test.ts`

**Steps:**

1. Write a failing metadata test that validates required manifest fields,
   repository identity, version agreement, endpoint shape, and README/docs
   installation snippets.
2. Run `npm test -- --run test/metadata.test.ts`; verify failure.
3. Document scope, tools, resources, prompts, installation, verification,
   privacy, security reporting, release operations, rollback, and limitations.
4. Add a registry manifest using the current official schema and the verified
   production endpoint.
5. Clearly distinguish the public read-only MCP from the full local Claude Code
   plugin and connector layer.
6. Run metadata tests; verify pass.
7. Commit: `docs(mcp): add public installation and operations guides`.

## Task 9: Add CI and deployment automation

**Files:**

- Create: `.github/workflows/mcp-ci.yml`
- Create: `.github/workflows/mcp-deploy.yml`
- Create: `.github/workflows/mcp-publish.yml`

**Steps:**

1. Add CI for pull requests and pushes:
   - `npm ci`
   - catalog freshness
   - MCP tests
   - typecheck
   - Worker dry-run bundle
   - existing connector and adapter tests
2. Add a manually triggered production deploy using
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Add a tag-triggered Registry publication workflow using GitHub OIDC and the
   official MCP publisher after endpoint verification.
4. Validate workflow YAML and action versions.
5. Commit: `ci(mcp): test deploy and publish remote server`.

## Task 10: Verify locally

**Steps:**

1. Run `npm ci` in `mcp/`.
2. Run `npm run catalog:check`.
3. Run `npm test -- --run`.
4. Run `npm run typecheck`.
5. Run `npm run deploy:dry`.
6. Run existing tests:
   `node --test connectors/test/*.test.mjs adapters/test/*.test.mjs`.
7. Start a local Wrangler server and connect the official MCP client to
   initialize, list capabilities, read one resource, get one prompt, and call
   all three tools.
8. Inspect `git diff --check`, `git status`, and the Worker bundle for secrets.

## Task 11: Deploy and verify production

**User action required:** Sign in to a Cloudflare account or approve use of an
existing authenticated Wrangler session. No credentials are pasted into chat.

**Steps:**

1. Run `npx wrangler whoami`.
2. If unauthenticated, run `npx wrangler login` and let the user complete the
   browser authorization.
3. Run `npm run deploy` from `mcp/`.
4. Record the exact `workers.dev` hostname in `wrangler.jsonc`, `server.json`,
   and documentation.
5. Test the production health and MCP endpoints from a clean client.
6. Check Cloudflare deployment status and free-tier bindings.
7. Commit: `release(mcp): point metadata to production endpoint`.

## Task 12: Publish GitHub and MCP Registry release

**User action required:** Approve pushing the branch, creating the public pull
request/release, and publishing immutable Registry metadata.

**Steps:**

1. Run the entire verification suite again from a clean install.
2. Push `codex/greatpm-mcp` and open a pull request.
3. After merge, tag `v1.0.0-mcp.1` or the owner-approved repository release
   tag.
4. Run the MCP Registry publication workflow.
5. Verify the Registry entry resolves to the live endpoint.
6. Test public installation instructions in Codex and one additional client.
7. Announce the endpoint, supported capabilities, read-only scope, and support
   channel.
