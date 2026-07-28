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
codex mcp list
```

Restart the Codex client if it was already open. In the Codex TUI, use `/mcp`
to see the connection. The ChatGPT desktop app, Codex CLI, and Codex IDE
extension share MCP configuration for the same Codex host.

Equivalent `~/.codex/config.toml` configuration:

```toml
[mcp_servers.great-pm]
url = "https://greatpm-mcp.vandana424-s.workers.dev/mcp"
```

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

The full local Claude Code plugin additionally provides 48 agents, 34 slash
commands, lifecycle hooks, a live local project board, project memory, and
governed connectors. Install the plugin from this repository when you need
that complete local product-team workflow.

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
