# GreatPM public MCP server

The public GreatPM MCP server gives any compatible AI client access to curated
product-management methods, templates, prompts, and the GreatPM six-stage
workflow.

**MCP URL:** `https://greatpm-mcp.vandana424-s.workers.dev/mcp`

**Health:** `https://greatpm-mcp.vandana424-s.workers.dev/health`

It is public, authless, stateless, and read-only. It does not access your local
files, projects, accounts, connectors, or API keys. Do not send confidential or
personal data in tool or prompt arguments.

## Install in Codex

Run:

```bash
codex mcp add great-pm --url https://greatpm-mcp.vandana424-s.workers.dev/mcp
```

Then:

```bash
codex mcp get great-pm --json
```

Confirm the entry is enabled, uses `streamable_http`, and points to the `/mcp`
URL above. This command verifies configuration, not a successful tool call.
Restart the Codex client and start a new task. In the Codex TUI, use `/mcp`
to inspect the connection. Local Codex clients share MCP configuration on the
same host; configuring the CLI does not install a connector in ChatGPT web.

In the desktop MCP settings, the equivalent setup is a server named `great-pm`,
transport **Streamable HTTP**, with the same URL. No API key or OAuth login is
needed for this public read-only server.

Equivalent `~/.codex/config.toml` configuration:

```toml
[mcp_servers.great-pm]
url = "https://greatpm-mcp.vandana424-s.workers.dev/mcp"
```

Then ask in a new task:

> Use the GreatPM MCP tools. Find pricing methods, retrieve `prd-authoring`,
> and prepare a workflow for "Improve onboarding activation". Report which
> tools you called and the human approval gates. Do not publish anything.

Expected: `pricing-models`, PRD guidance, and six stages with `gate:strategy`,
`gate:spec`, and `gate:launch`. The remote tool names are
`greatpm_list_methods`, `greatpm_get_method`, and `greatpm_prepare_workflow`.
Codex may display them with a server prefix. `$pm-start` and `$grill-me` belong
to the full local plugin and are not MCP tool names. Both can be installed.

If the connection is missing, check the saved URL includes `/mcp`, the server
is enabled, and the task was opened after adding it. If startup times out on a
slow connection, add `startup_timeout_sec = 30` to the server's configuration
table and retry. A healthy `/health` response alone does not verify MCP calls.
Prompt menus and resource browsing depend on the host; the three tools are the
verified Codex entry points.

Remove it with:

```bash
codex mcp remove great-pm
```

## Install in VS Code

Run **MCP: Add Server** from the Command Palette and choose HTTP, or add this to
your user MCP configuration or workspace `.vscode/mcp.json`:

```json
{
  "servers": {
    "great-pm": {
      "type": "http",
      "url": "https://greatpm-mcp.vandana424-s.workers.dev/mcp"
    }
  }
}
```

Use **MCP: List Servers** to inspect, start, stop, or remove the connection.

## Install in Claude

Remote custom connectors currently require a Claude Pro, Max, Team, or
Enterprise plan.

1. Open **Settings → Connectors** in Claude or Claude Desktop.
2. For Team or Enterprise, an Owner or Primary Owner first enables it under
   **Organization connectors**.
3. Select **Add custom connector**.
4. Name it `GreatPM`.
5. Enter `https://greatpm-mcp.vandana424-s.workers.dev/mcp`.
6. Select **Add**, then enable GreatPM from **Search and tools** in a chat.

No authentication step is expected because GreatPM v1 is public and read-only.

## Generic MCP clients

Configure a Streamable HTTP server with:

```text
Name: GreatPM
Transport: Streamable HTTP
URL: https://greatpm-mcp.vandana424-s.workers.dev/mcp
Authentication: none
```

The server supports the current MCP revision and stateless compatibility for
2025-era Streamable HTTP clients.

## Verify the connection

Ask the client to list GreatPM tools. It should show exactly:

- `greatpm_list_methods`
- `greatpm_get_method`
- `greatpm_prepare_workflow`

Try:

> Use `greatpm_list_methods` to find methods for product discovery.

Then:

> Use `greatpm_get_method` with `prd-authoring`.

The server also exposes:

- 2 static resources;
- 3 resource URI templates;
- 11 reusable prompts;
- 28 curated methods;
- 10 artifact templates.

## Tools

### `greatpm_list_methods`

Searches compact method metadata by query and lifecycle stage. It does not
return every Markdown body, which keeps client context small.

### `greatpm_get_method`

Returns the complete Markdown for one exact method ID.

### `greatpm_prepare_workflow`

Prepares a deterministic workflow with recommended methods, expected
artifacts, the six lifecycle stages, and the three human approval gates. It
does not execute, ship, publish, or approve the plan.

All three advertise the MCP safety annotations:

- read-only;
- non-destructive;
- idempotent;
- closed-world.

## Resources

- `greatpm://catalog`
- `greatpm://workflow`
- `greatpm://methods/{id}`
- `greatpm://templates/{id}`
- `greatpm://docs/{id}`

## Prompts

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

Prompts are portable MCP messages. They do not invoke host-specific slash
commands, shell tools, local agents, or files.

## Public MCP versus the full plugin

The remote MCP is the easiest way to make GreatPM methods available in many AI
clients. It only serves static knowledge and prepares plans.

The full GreatPM product-management operating system provides 48 specialists,
79 product skills, 34 workflows, lifecycle hooks, a local product board,
project memory, and governed connectors. Claude Code and Codex have separate
native plugin packaging. This review branch includes the Codex package in
`plugins/great-pm/`; its public release is staged ahead of the MCP release.
The MCP is an optional public distribution channel for selected knowledge and
does not provide full plugin parity.

See [Codex compatibility and launch evidence](MCP-READINESS.md) for the dated
verification record and remaining release steps.

## Privacy and security

- [Privacy notice](../PRIVACY.md)
- [Security policy](../SECURITY.md)
- [Architecture](MCP-ARCHITECTURE.md)
- [Operations](MCP-OPERATIONS.md)

Report sensitive vulnerabilities privately through GitHub Security Advisories.

## Official client references

- [Codex MCP manual](https://learn.chatgpt.com/docs/extend/mcp)
- [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [Claude remote custom connectors](https://support.anthropic.com/en/articles/11175166-about-custom-integrations-using-remote-mcp)
