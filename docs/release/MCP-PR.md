Add an optional public GreatPM MCP service for clients that need portable
product-management guidance. The server provides 28 methods, 10 templates,
11 prompts, resources and three read-only tools over Streamable HTTP. It has
no project access, model calls, connector credentials, or mutation tools.

The native Codex plugin remains the full product-management operating system.
This branch integrates both packages, reconciles shared privacy/security
documentation, and documents separate installation paths.

Release configuration includes CI, manual deployment from `main`, an owner
approval environment for Registry publication, serialized release jobs, and a
version/checksum-pinned MCP publisher. Environment settings and the exact
setup sequence are prepared under `.github/release/` and `docs/release/REVIEW.md`.
These files do not automatically apply GitHub account settings or store secrets.

Validation: all 180 tests pass (21 Codex, 47 MCP, 112 shared), both generated
outputs are current, TypeScript and the Worker dry-run build pass. Live MCP
tools/resources/prompts pass, Codex CLI 0.153.4 called all three tools, and the
official Registry accepted `server.json` validation without publication.

Before release: merge and sign off the native Codex plugin first, apply the
reviewed GitHub environment settings, restore Cloudflare authentication and
add the deployment secrets, confirm the deployed revision, and complete the
remaining desktop/second-client and operations checks. No production deploy,
Registry publish, or release tag is part of opening this draft PR.

The integrated plugin candidate is now 1.1.5, including corrected internal
specialist identifiers and supporting skill files. Cloudflare login and
hosted release are paused at the owner's request after callback failures.
This PR preserves the work; it does not represent a new production deployment
or completed native-plugin live sign-off.
