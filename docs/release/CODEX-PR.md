The repository's GreatPM workflows are packaged for Codex desktop and CLI so
users can install the full product-management operating system as a native
plugin. Claude Code packaging remains supported.

The package includes 48 specialist definitions, 79 product-management skills,
34 workflow skills, 26 templates, lifecycle and safety hooks, a local board,
governed connectors, durable project state, and the three human gates. Workflow
and specialist names retain their canonical forms, including `$grill-me`.

Installation, hook trust, setup and troubleshooting are documented in
`docs/CODEX.md`. CI verifies packaging, inventory and generated-file drift.

The v1.1.3 package also fixes host conversion so specialist verdict paths,
relative skill links and URLs remain valid while workflow invocations use `$`.

Validation: 20 Codex tests and 112 shared connector/adapter tests pass; the
generated package is current. The recorded full live `$pm-start` to strategy
gate and desktop hook-trust checks remain pending. This should remain a draft
release candidate until those checks are completed; packaged inventory parity
is not proof that every live workflow has been exercised.
