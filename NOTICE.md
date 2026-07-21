# Attribution & Derivation Chain

`great-pm` is the product-management counterpart to `great_cto`. It reuses
`great_cto`'s plugin structure, agent-orchestration engine, board, memory
layers, gate mechanism, archetype + pack-overlay system, and selected skills
(`done-blocked`, `skeptical-triage`). Per the MIT License, the original
copyright is preserved (see `LICENSE`) and the derivation chain is
acknowledged below.

## Upstream — original work

**`great_cto`** by **avelikiy**
- Upstream: https://github.com/avelikiy/great_cto
- License: MIT
- Adopted from `great_cto`:
  - Plugin manifest structure (`.claude-plugin/plugin.json`).
  - Agent file format and conventions (rich frontmatter, mandatory Phase Task
    tracking via Beads, embedded operating procedures, DONE/BLOCKED reporting
    contract, verdict log).
  - Memory layers (`brain.md`, `lessons.md`, cross-project decisions,
    verdicts/).
  - Gate mechanism via Beads (gates as labelled `gate` issues).
  - Archetype + pack-overlay design pattern.
  - Skills system architecture.
  - The following skills, lightly adapted: `done-blocked`, `skeptical-triage`.

## Intermediate fork — improvements adopted

**`ajayd942/great_cto`** by **Ajay Dubey (ajayd942)**
- Fork: https://github.com/ajayd942/great_cto
- License: MIT (inherited from upstream)
- Improvements visible in this derivation:
  - The `code-reviewer` agent design.
  - `performance-engineer` activation for `web-service`.
  - Memory-system fixes (`brain.md` / `lessons.md` seeding).
  - Plugin hook-validation fixes; configurable agent-model override.

`great-pm` was seeded from `VandanaAjayDubey111/great_cto`, which is a fork of
`ajayd942/great_cto`.

## This work — what great-pm adds

**`great-pm`** by **Vandana Dubey**
- Repository: https://github.com/VandanaAjayDubey111/great-pm
- License: MIT
- New for great-pm (not derived from upstream):
  - The 6-stage product loop (Discover → Strategize → Prioritize → Define →
    Launch → Measure & Learn) — adapted from great_cto's linear SDLC into a
    continuous PM loop.
  - 3 PM gates: `gate:strategy`, `gate:spec`, `gate:launch`.
  - 48 PM agents (the 6-stage loop team + critical quartet + AI-PM pack +
    archetype PM reviewers), each authored fresh for product-management work.
  - `great-pm` foundational skill (the operating model).
  - Agent-specific skills: `user-research`, `competitive-analysis`,
    `pricing-models`, `prioritization-methods`, `prd-authoring`,
    `metrics-design`, `launch-readiness`, `experiment-design`.
  - The parallel multi-initiative orchestration model.
  - The mandatory `pm-reviewer` pre-gate check (verdict travels unedited).
  - The self-improvement flywheel (`continuous-learner` + `skill-scout`),
    with the autonomous skill-swap carve-out.

## Pattern inspiration — grill-me

The `grill-me` agent's name and two of its mechanics (a recommended answer
attached to each question; inspect-the-repo-before-asking) are inspired by
**Matt Pocock's** viral `grill-me` skill (https://www.aihero.dev/my-grill-me-skill-has-gone-viral),
which interrogates a plan's design tree. great-pm's grill-me is an
independent implementation that extends the pattern upstream into PM
discovery: situation-level interrogation before a plan exists, mom-test
question craft, bounded-by-default sessions, and a governed unknowns
register (advisory / gate-blocking) so unanswered questions cannot be
silently forgotten.

## License terms

All three works are MIT-licensed. The MIT license requires that the original
copyright notice and the permission notice be retained in all copies or
substantial portions of the software — both are preserved in `LICENSE`. This
`NOTICE.md` provides the derivation chain so the lineage is clear.

Per MIT, this software is provided "as is", without warranty of any kind. See
`LICENSE` for the full terms.
