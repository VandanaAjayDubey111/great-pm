# GreatPM Public MCP Server Design

**Date:** 2026-07-28  
**Status:** Approved for implementation by the repository owner  
**Release target:** Public v1.0.0 on Cloudflare Workers

## 1. Outcome

Create a free-to-operate, public remote Model Context Protocol (MCP) server that
makes GreatPM's product-management methods available to MCP clients over
Streamable HTTP.

The first release is a read-only methodology and workflow server. It helps an
AI client discover a GreatPM method, retrieve its guidance, and prepare a
structured workflow. It does not run the local multi-agent harness, read a
user's project, call an LLM, or connect to third-party systems.

## 2. Existing system

GreatPM already contains:

- 48 product specialist agent definitions in `agents/`;
- 79 product methods and playbooks in `skills/`;
- 34 Claude Code commands in `commands/`;
- the Discover → Strategize → Prioritize → Define → Launch → Measure loop;
- three human approval gates: strategy, specification, and launch;
- templates for PRDs, research, roadmaps, metrics, launch, and other artifacts;
- local model adapters and a governed connector layer;
- a local project board that reads `.great-pm/` and beads data;
- MIT licensing and attribution.

None of the following exists yet:

- an MCP server package or remote transport;
- an MCP resource, prompt, or tool registry;
- a Cloudflare Worker;
- a public `/mcp` endpoint;
- an MCP Registry `server.json`;
- MCP-specific tests, CI, operational documentation, privacy notice, or
  security policy.

## 3. Scope

### In scope

- A stateless Streamable HTTP endpoint at `/mcp`.
- A health and discovery response at `/`.
- Three read-only tools:
  - `greatpm_list_methods`
  - `greatpm_get_method`
  - `greatpm_prepare_workflow`
- Static resources for the GreatPM catalog, workflow, methods, templates, and
  selected documentation.
- Curated prompts for the major product lifecycle jobs.
- A build-time catalog generated from repository-owned source material.
- Host and Origin validation, request-size limits, safe error responses, and
  no secrets.
- Automated unit, protocol, and Worker integration tests.
- Cloudflare Workers deployment configuration.
- Public installation and operating documentation.
- MCP Registry metadata for a remote-only server.

### Out of scope

- Reading or writing a user's local files.
- Running the 48-agent local orchestration harness.
- Running shell commands, Claude Code commands, beads, or the local board.
- Calling model APIs from the server.
- Notion, Slack, Linear, Jira, Amplitude, CSV, GitHub, or other connectors.
- User accounts, OAuth, API keys, payments, quotas, or persistent storage.
- Mutation tools or tools that can publish, ship, approve, or finalize work.
- Server-sent notifications, sampling, elicitation, resumability, or tasks.
- A custom domain for the first launch.

## 4. Product contract

### Users

- Product managers and founders using an MCP-capable AI client.
- AI agents that need a structured product-management method.
- Developers evaluating or integrating GreatPM.

### Jobs

1. Discover what GreatPM methods are available for a particular product job.
2. Retrieve an authoritative method without loading the whole repository.
3. Produce a structured, human-governed workflow for an initiative.
4. Start a common product task from a reusable prompt.

### Safety promise

The server only returns text and structured data already packaged with its
deployed artifact. Tool calls are read-only, deterministic, idempotent, and do
not contact other systems.

## 5. Architecture

```text
MCP client
    |
    | Streamable HTTP
    v
Cloudflare Worker
    |-- request guard: path, method, Host, Origin, content length
    |-- MCP Web Standard transport (stateless, JSON responses)
    |-- GreatPM MCP server factory
           |-- tools
           |-- prompts
           `-- resources
                    |
                    `-- generated static catalog

Repository sources
    |-- skills/
    |-- templates/
    |-- selected docs/
    `-- skills/great-pm/WORKFLOW.md
             |
             `-- build-catalog script --> mcp/src/generated/catalog.ts
```

The `mcp/` package is isolated from the existing Claude Code plugin. Its
package manager, build, tests, and deployment do not alter plugin loading.

### Runtime

- Cloudflare Workers free plan.
- Web Standard `Request` and `Response` APIs.
- `@modelcontextprotocol/server` 2.0.0.
- `@modelcontextprotocol/hono` 2.0.0 and Hono 4.x.
- Stateless `WebStandardStreamableHTTPServerTransport`.
- JSON response mode because v1 has no server-initiated notifications.

The Worker creates a fresh MCP server and transport per MCP request. This keeps
requests stateless and safe across isolates.

### Build time

Node.js generates a TypeScript catalog from an explicit allowlist of repository
content. The Worker bundle imports this generated file; it never accesses a
filesystem at runtime.

The generator:

- parses YAML front matter from selected skill files;
- preserves the Markdown body;
- normalizes IDs and metadata;
- rejects duplicate or missing IDs;
- rejects unsafe local-execution references from public descriptions;
- packages selected templates and documentation;
- produces deterministic output.

An allowlist avoids accidentally publishing secrets, local operational
instructions, connector setup, or Claude-specific tool calls.

## 6. Public MCP surface

### Tools

#### `greatpm_list_methods`

Lists methods without returning every method body.

Input:

- `query?: string` — case-insensitive search across ID, title, description,
  tags, and lifecycle stage.
- `stage?: "discover" | "strategize" | "prioritize" | "define" | "launch" |
  "measure" | "cross-functional"`
- `limit?: number` — integer from 1 to 50, default 20.

Output:

- count;
- matching method summaries;
- canonical resource URI for each result.

#### `greatpm_get_method`

Retrieves one complete method.

Input:

- `id: string` — exact GreatPM method ID.

Output:

- method metadata;
- Markdown guidance;
- canonical resource URI.

Unknown IDs return an MCP tool error with suggestions, not an HTTP 500.

#### `greatpm_prepare_workflow`

Builds a portable plan from GreatPM's six-stage loop.

Input:

- `initiative: string` — 3 to 300 characters.
- `currentStage?: lifecycle stage`
- `context?: string` — up to 4,000 characters.
- `includeStages?: lifecycle stage[]`

Output:

- initiative;
- ordered stages;
- recommended method IDs per stage;
- expected artifacts;
- human gates;
- governance reminder;
- suggested next action.

The tool does not execute the workflow or make product decisions.

All tools advertise:

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: false`

### Resources

- `greatpm://catalog`
- `greatpm://workflow`
- `greatpm://methods/{id}`
- `greatpm://templates/{id}`
- `greatpm://docs/{id}`

Resources return `text/markdown` or `application/json` with UTF-8 text.

### Prompts

- `start-initiative`
- `discover`
- `strategize`
- `prioritize`
- `write-prd`
- `plan-launch`
- `measure-and-learn`
- `review-artifact`
- `competitive-analysis`
- `metrics-plan`
- `pricing-plan`

Prompt results contain portable conversation messages. They must not instruct a
client to invoke Claude-specific `Agent`, `Bash`, slash-command, beads, or
filesystem operations.

## 7. HTTP behavior and security

### Routes

- `GET /` returns service metadata, public documentation links, and the MCP URL.
- `GET /health` returns a small JSON health response.
- `POST /mcp` handles MCP messages.
- Unsupported `/mcp` methods return the transport-defined status.
- Unknown paths return JSON `404`.

### Request controls

- Only `/mcp` accepts MCP traffic.
- Reject declared request bodies over 256 KiB with `413`.
- Validate `Host` against:
  - `localhost`;
  - `127.0.0.1`;
  - the deployed `*.workers.dev` hostname;
  - optional configured custom hostnames.
- When an `Origin` header is present:
  - parse it as a URL;
  - reject opaque, malformed, or non-HTTPS public origins;
  - allow localhost origins during local development;
  - allow configured production origin hostnames;
  - otherwise return `403`.
- Do not emit permissive wildcard CORS headers.
- Use fixed JSON errors without stack traces.
- Add `X-Content-Type-Options: nosniff`, a restrictive
  `Content-Security-Policy` on non-MCP routes, and `Referrer-Policy: no-referrer`.

Origin validation is a request-integrity control, not authentication. The v1
server is intentionally public because it exposes only static read-only
knowledge.

### Data handling

- No account data.
- No cookies.
- No durable storage.
- No connector credentials.
- No request body logging by application code.
- Cloudflare platform logs and analytics may process standard request metadata;
  the privacy notice must state this plainly.

## 8. Testing

### Unit tests

- Catalog schema, uniqueness, deterministic search, filters, and limits.
- Method retrieval and unknown-ID behavior.
- Workflow stage ordering, gates, artifacts, and input constraints.
- Prompt portability checks.
- Resource URI lookup.
- Request-guard Host, Origin, path, and size behavior.

### Protocol tests

Use the official MCP client package with a Web Standard client transport, or
send protocol-compliant initialization/list/read/call messages, to verify:

- initialization;
- tools/list and tools/call;
- resources/list and resources/read;
- prompts/list and prompts/get;
- error behavior and annotations.

### Worker tests

Run the Worker locally through Wrangler/Miniflare and verify:

- `/`, `/health`, `/mcp`, and unknown routes;
- production-like Host and Origin handling;
- no filesystem dependency at runtime;
- bundle and type-check success.

### Existing regression suite

The existing connector and adapter tests remain required and must pass unchanged.

## 9. Hosting and release

### Cloudflare

- Worker name: `greatpm-mcp`.
- Initial endpoint: `https://greatpm-mcp.<account-subdomain>.workers.dev/mcp`.
- No paid bindings, Durable Objects, D1, KV, R2, Queues, Workers AI, or custom
  domain.
- Free plan is sufficient for launch while traffic stays within its published
  limits.

### GitHub

- Keep source in this repository under `mcp/`.
- CI runs catalog verification, MCP tests, type checking, bundle dry-run, and
  the existing regression suite.
- Deployment workflow uses Cloudflare API token and account ID secrets only
  after the first manual deployment.
- Dependency update PRs may be added later; no automatic major upgrades.

### MCP Registry

Root `server.json` describes a remote server:

- name: `io.github.vandanaajaydubey111/great-pm`
- version: `1.0.0`
- transport type: `streamable-http`
- URL: the verified Workers URL
- repository: this GitHub repository

Registry publication happens only after the deployed endpoint and installation
instructions have been tested. Registry version metadata is immutable, so each
future release uses a new semantic version.

## 10. Public installation

Documentation provides:

- one-command Codex registration;
- VS Code `mcp.json`;
- Claude custom connector steps;
- a generic Streamable HTTP URL;
- verification by listing tools and calling `greatpm_list_methods`;
- removal instructions;
- clear distinction between the remote read-only MCP and the full local
  GreatPM Claude Code plugin.

## 11. Release acceptance criteria

- A public HTTPS `/mcp` endpoint initializes from at least two independent MCP
  clients.
- All three tools return deterministic, read-only results.
- Resources and prompts list and resolve correctly.
- Host, Origin, and request-size tests pass.
- The bundle contains no secrets and performs no outbound fetches.
- Existing repository tests still pass.
- Installation docs work from a clean client configuration.
- The deployed Worker stays within free-tier platform features.
- GitHub and Registry metadata point to the verified public endpoint.

## 12. Future phases

Future authenticated versions may add per-user project state or governed
connectors. Those require OAuth 2.1, explicit scopes, tenant isolation,
encrypted secret storage, audit logs, rate limiting, connector-specific tests,
and a new threat model. They are not extensions to silently enable in v1.
