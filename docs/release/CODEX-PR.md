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

The current 1.1.5 candidate also maps canonical specialist names to
Codex-compatible internal identifiers and preserves supporting skill files,
including WORKFLOW.md. `$grill-me` and all public role names remain unchanged.

Validation: 21 Codex tests and 112 shared connector/adapter tests pass; the
generated package is current. The recorded full live `$pm-start` to strategy
gate and desktop hook-trust checks remain pending. This should remain a draft
release candidate until those checks are completed; packaged inventory parity
is not proof that every live workflow has been exercised.

Live 1.1.4 checks verified real specialist delegation and bounded resume, and
correctly stopped discovery on insufficient synthetic evidence. 1.1.5 has
fresh packaging tests and installed-file verification, not a newly completed
end-to-end run. See `codex/live-check-2026-09-20.md` for the distinctions.

Cloudflare setup is paused at the owner's request; it is not needed to install
the native plugin or push this PR.
