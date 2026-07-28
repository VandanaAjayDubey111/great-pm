# Security policy

## Supported MCP release

Security fixes are applied to the current public GreatPM MCP release. Older
remote versions are not separately operated because the public URL serves the
current Worker deployment.

## Reporting a vulnerability

Do not open a public issue for a vulnerability, credential exposure, private
request data, or an exploit that affects users.

Report it privately through
[GitHub Security Advisories](https://github.com/VandanaAjayDubey111/great-pm/security/advisories/new).
Include:

- affected endpoint or source file;
- reproduction steps;
- expected and observed behavior;
- potential impact;
- any safe proof of concept;
- whether the issue is already public.

Do not include real user data, access tokens, passwords, or third-party
credentials. Allow the maintainers reasonable time to investigate and release
a fix before public disclosure.

For non-sensitive hardening suggestions, use a normal GitHub issue.

## Public MCP security model

The public v1 server is unauthenticated and read-only. It serves a static,
allowlisted catalog and has no user accounts, persistent storage, secrets,
outbound API calls, connector access, or mutation tools.

Security controls include:

- Host and Origin validation;
- HTTPS production deployment;
- a 256 KiB declared request-size limit;
- Zod validation and bounded tool inputs;
- fixed error responses without stack traces;
- no permissive wildcard CORS;
- restrictive browser security headers;
- automated protocol and request-guard tests;
- dependency lockfile and zero-vulnerability audit at initial release.

The local GreatPM connector layer has a different threat model. Never send
connector tokens or local project data to the public MCP endpoint.
