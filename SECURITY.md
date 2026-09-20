# GreatPM security policy

## Reporting a vulnerability

Do not open a public issue for a vulnerability, credential exposure, private
request data, or an exploit affecting users. Report it privately through
[GitHub Security Advisories](https://github.com/VandanaAjayDubey111/great-pm/security/advisories/new).

Include the affected version, endpoint or file, reproduction steps, expected
and observed behavior, potential impact, and a safe proof of concept. Do not
include real user data, tokens, passwords, or third-party credentials. Allow
the maintainers time to investigate and coordinate disclosure. Non-sensitive
hardening suggestions can use normal GitHub issues.

## Local Claude Code and Codex plugins

The local plugins can read/write files, run approved scripts, delegate work
to specialists, and use explicitly configured connectors. Review their source
and hook definitions before trusting them. Grant only the repository and
connector permissions needed for the work.

Keep tokens in the host's secret storage or the connector's gitignored secret
file, never in product artifacts, prompts, templates, or committed files.
Review destructive commands and external writes. Keep the host, plugin, and
dependencies updated. Safety hooks reduce common mistakes but are not a
sandbox and do not replace backups, access controls, or human review.

## Public MCP security model

The public v1 MCP server is unauthenticated and read-only. It serves a static,
allowlisted catalog with no user accounts, persistent storage, secrets,
outbound API calls, connector access, or mutation tools.

Controls include:

- Host and Origin validation and HTTPS production deployment;
- a 256 KiB request-body limit, including streamed bodies;
- Zod validation and bounded tool inputs;
- fixed transport errors without stack traces;
- no permissive wildcard CORS and restrictive browser security headers;
- automated protocol/request-guard tests and lockfile-pinned dependencies.

Do not send connector tokens or confidential project data to the public MCP.
The client host controls whether it invokes a tool; server annotations are
descriptive and do not replace authorization for other local plugin actions.

## Supported releases

Plugin security fixes target the latest released version on the default
branch. Remote MCP security fixes target the current Worker deployment;
older remote versions are not separately operated at the public URL.
