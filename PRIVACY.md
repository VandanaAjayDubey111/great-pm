# GreatPM privacy notice

**Updated:** 2026-09-20

GreatPM provides local product-management plugins for Claude Code and Codex,
plus an optional public, read-only MCP knowledge service. Their data handling
differs as described below.

## Local plugins

The plugins read product context from the repository where you use them and
write working state to that repository's `.great-pm/` directory. Skills,
workflows, templates, the local board, scripts, and hooks run in the host
environment under its permissions. The plugins do not create a GreatPM
account or send telemetry to GreatPM maintainers.

Prompts, repository content, and tool results used in a Claude Code or Codex
session are processed under that provider's terms and privacy controls. When
you explicitly configure a connector, its service receives the data needed
for that action and its own privacy policy applies. Review connector settings
and hooks before approving them. Keep credentials out of product artifacts
and committed configuration.

## Public MCP service

The public GreatPM MCP server provides product-management methods, templates,
prompts, and workflow preparation. It has no user accounts, login, cookies,
database, durable objects, project-file access, connector credentials,
advertising/analytics SDK, or server-side language-model calls.

Application code does not intentionally log MCP request bodies, tool arguments,
prompt arguments, or resource contents. The local plugins do not automatically
send their project state to this service. A host configured with the MCP can
send arguments when you use its tools.

### Request processing and retention

Cloudflare Workers processes HTTPS requests to return MCP responses. Cloudflare
may process standard metadata such as IP address, timestamp, URL, response
status, and diagnostics according to the account settings and its policies.
GreatPM application code does not persist requests. Platform metadata
retention is controlled by the hosting account and Cloudflare configuration.

Do not send secrets, personal data, confidential customer information, or
regulated data in `initiative`, `context`, or `artifact` arguments. They are
not needed to retrieve public GreatPM guidance. Your MCP host or AI provider
may retain prompts, arguments, and responses under its own terms.

## Questions and changes

For privacy questions, open a repository issue without including confidential
information. Report sensitive concerns privately through
[GitHub Security Advisories](https://github.com/VandanaAjayDubey111/great-pm/security/advisories/new).

Material changes to data collection, authentication, storage, or external
connections require updating this notice before deployment.
