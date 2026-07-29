# GreatPM Security

## Reporting a vulnerability

Please report suspected vulnerabilities through a private GitHub security
advisory for this repository. Do not disclose credentials, customer data, or an
unpatched exploit in a public issue.

Include the affected version, reproduction steps, expected impact, and any
suggested mitigation. The maintainers will acknowledge the report, investigate
it, and coordinate disclosure after a fix is available.

## Security model

GreatPM is a local-first Codex plugin. It can read and write files, run approved
scripts, delegate work to Codex subagents, and use connectors that the user
explicitly configures. Those capabilities make the following controls
important:

- Review the plugin source and hook definitions before trusting them.
- Grant only the repository and connector permissions needed for the work.
- Keep API keys and access tokens in the host's secret storage, never in
  `.great-pm/`, prompts, templates, or committed files.
- Review proposed destructive shell commands and external writes before
  approving them.
- Keep GreatPM, Codex, and connector dependencies updated.

GreatPM's safety hooks reduce common command and secret-handling mistakes, but
they are not a sandbox and do not replace repository backups, access controls,
or human review.

## Supported version

Security fixes are applied to the latest release on the repository's default
branch.
