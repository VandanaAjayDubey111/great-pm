# GreatPM MCP architecture

GreatPM's public MCP server is a separate, read-only distribution of the
project's product-management knowledge. It is intentionally smaller than the
local Claude Code plugin.

## What already existed

The repository already provided the source material:

- product specialist definitions in `agents/`;
- product methods and playbooks in `skills/`;
- artifact templates in `templates/`;
- the six-stage lifecycle and three human gates;
- local adapters, governed connectors, and a project board.

Those components remain the full local GreatPM product. The MCP implementation
does not replace or modify them.

## What the MCP package adds

`mcp/` adds:

- a deterministic build-time catalog of explicitly allowlisted content;
- three read-only tools;
- URI-addressable resources;
- portable prompts;
- a stateless MCP server factory;
- a Cloudflare Worker HTTP boundary;
- protocol, security, and integration tests;
- deployment configuration.

```text
Repository content
  skills/ + templates/ + selected docs/
                    |
                    | build-catalog.mjs
                    v
       generated static TypeScript catalog
                    |
                    v
       tools + resources + prompts
                    |
                    v
       fresh MCP server per request
                    |
                    v
       Streamable HTTP at /mcp
                    |
                    v
            Cloudflare Worker
```

## Runtime boundaries

The deployed Worker:

- has no filesystem access;
- has no durable storage bindings;
- has no secrets;
- makes no outbound requests;
- does not call a language model;
- does not read user projects;
- does not run shell commands;
- does not expose the local connectors or board;
- does not perform write operations.

Every request receives a fresh MCP server instance through the official
TypeScript SDK's stateless HTTP handler. The server supports both the current
MCP protocol and stateless compatibility for 2025-era Streamable HTTP clients.
It uses JSON responses because GreatPM v1 does not send progress, sampling,
elicitation, or other server-initiated messages.

## Catalog generation

`mcp/catalog.allowlist.json` is the publication boundary. Adding a repository
file does not publish it automatically.

`npm run catalog:build`:

1. reads only allowlisted method, template, and documentation paths;
2. parses method front matter;
3. validates unique public IDs;
4. embeds Markdown in `mcp/src/generated/catalog.ts`;
5. produces deterministic output.

`npm run catalog:check` generates a fresh copy and compares it with the
committed artifact. CI fails if content and generated output differ.

The allowlist protects against accidentally exposing local execution
instructions, connector credentials, project files, or repository content that
has not been reviewed for public use.

## MCP capabilities

### Tools

- `greatpm_list_methods` searches compact catalog metadata.
- `greatpm_get_method` returns one complete method.
- `greatpm_prepare_workflow` returns an ordered workflow, artifacts, and human
  gates.

All tools are annotated read-only, non-destructive, idempotent, and
closed-world.

### Resources

- `greatpm://catalog`
- `greatpm://workflow`
- `greatpm://methods/{id}`
- `greatpm://templates/{id}`
- `greatpm://docs/{id}`

### Prompts

Eleven prompts cover initiative framing, discovery, strategy, prioritization,
PRDs, launch, measurement, review, competition, metrics, and pricing. Their
messages refer to MCP resources and contain no host-specific commands.

## HTTP security

The Worker validates the target Host and any browser Origin before handing a
request to the protocol parser. Localhost, the exact deployed `workers.dev`
hostname, and explicitly configured custom hosts are allowed. Public browser Origins
must use HTTPS and match the request host or explicit allowlist. Invalid
Origins return HTTP 403 as required by the MCP transport specification.

Every POST body is counted while streaming and bodies over 256 KiB return HTTP
413, even if `Content-Length` is absent or incorrect. Application errors return
fixed JSON without stack traces. Responses add restrictive browser security
headers and do not enable wildcard CORS. The SDK subscription capacity is set
to zero, so the stateless JSON service cannot open SSE subscription streams.

These controls protect request integrity; they are not authentication. The
server is intentionally public because it serves static read-only knowledge.

## Future authenticated services

Project state, user accounts, or external connectors would form a different
security boundary. A future service must add OAuth 2.1, scopes, tenant
isolation, encrypted secret storage, connector-specific authorization, audit
logs, rate limits, and a new privacy review. It must not be enabled silently in
this public v1 Worker.

## Source references

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [Cloudflare remote MCP server guide](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/)
