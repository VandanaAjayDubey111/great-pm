# GreatPM MCP operations

This runbook covers the public Cloudflare Worker in `mcp/`.

## Local verification

```bash
cd mcp
npm ci
npm run catalog:check
npm test -- --run
npm run typecheck
npm run deploy:dry
```

Then run the existing repository regression suite from the repository root:

```bash
node --test connectors/test/*.test.mjs adapters/test/*.test.mjs
```

## Local server

```bash
cd mcp
npx wrangler dev
```

Wrangler prints a local URL. The MCP endpoint is `/mcp`; `/health` is the
health check.

## First deployment

The repository owner performs the first deployment interactively:

```bash
cd mcp
npx wrangler login
npx wrangler whoami
npm run deploy
```

Use a Cloudflare free account. This Worker has no paid bindings. Record the
exact `workers.dev` URL from Wrangler, then verify `/health` and connect an
independent MCP client before publishing installation instructions.

Do not paste Cloudflare passwords, OAuth codes, API tokens, or account
credentials into issues, pull requests, chat, or repository files.

## Automated deployment

The manual GitHub workflow requires:

- repository secret `CLOUDFLARE_API_TOKEN`, scoped to edit this Worker;
- repository secret `CLOUDFLARE_ACCOUNT_ID`.

Create the least-privileged API token in Cloudflare after the first deployment.
The workflow installs the lockfile-pinned dependencies, verifies the server,
and deploys from `mcp/`.

## Production verification

After every deployment:

1. `GET /health` returns HTTP 200 and `{"status":"ok","service":"greatpm-mcp"}`.
2. An MCP client initializes over `/mcp`.
3. `tools/list` returns exactly the three GreatPM tools.
4. `greatpm_list_methods` returns a result.
5. `resources/read` resolves `greatpm://methods/prd-authoring`.
6. `prompts/get` resolves `write-prd`.
7. A request with a disallowed Origin returns HTTP 403.
8. Cloudflare shows no unexpected bindings or secrets.

## Logs and privacy

Application logging records only error class names. It does not intentionally
log MCP request bodies or prompt arguments. Cloudflare may retain standard
platform request metadata under the account's logging and analytics settings.

Use `npx wrangler tail` only during an incident or deployment check. Avoid
copying live logs into public issues when they contain IP addresses, URLs, or
other request metadata.

## Rollback

Cloudflare retains Worker versions. For a production regression:

1. stop automated deployments;
2. use the Cloudflare dashboard or Wrangler version commands to identify the
   last verified version;
3. roll back that exact version;
4. repeat the production verification checklist;
5. open a private security advisory if confidentiality or integrity was
   affected.

Do not delete the Worker as a first response. A version rollback preserves the
stable public URL and is easier for clients to recover from.

## Catalog release

When an allowlisted method or template changes:

```bash
cd mcp
npm run catalog:build
npm run catalog:check
npm test -- --run
```

Review the generated diff. Generated content is public server payload, so the
same licensing, security, and content review applies as for hand-written code.

## Registry release

The official MCP Registry is in preview and published versions are immutable.
For a Registry update:

1. increment the semantic version in `server.json` and `mcp/package.json`;
2. verify the public endpoint;
3. merge the exact metadata;
4. create the corresponding `mcp-v<version>` tag;
5. let `.github/workflows/mcp-publish.yml` authenticate with GitHub OIDC and
   publish;
6. confirm the version through the Registry API.

Never reuse a published version number.
