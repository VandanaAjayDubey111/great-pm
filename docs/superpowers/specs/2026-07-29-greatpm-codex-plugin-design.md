# GreatPM Codex Plugin — Full-Parity Design

| Field | Value |
|---|---|
| Date | 2026-07-29 |
| Status | Approved |
| Product | GreatPM product-management operating system |
| Target hosts | Codex desktop and Codex CLI |
| Release standard | Full functional parity with the existing Claude Code experience |

## 1. Outcome

Make the complete GreatPM product-management operating system installable and
usable in Codex desktop and Codex CLI from the public GreatPM Git repository.

GreatPM is not a reduced methodology library or a starter workflow. The Codex
release must preserve the complete product loop, specialist roles, human
authority, local product context, integrations, safety controls, templates, and
board.

The existing Claude Code experience must continue to work. Claude and Codex
must share one canonical GreatPM core, with only thin host-specific packaging
and lifecycle bindings.

## 2. Settled product requirements

These decisions are fixed and must not be re-asked during implementation:

1. GreatPM is for product management, not project management.
2. Codex desktop and Codex CLI are both release targets.
3. The release requires full capability parity; there is no reduced edition.
4. The shared GreatPM core remains canonical.
5. Claude-specific behavior is adapted, not copied into a drifting fork.
6. The existing Claude Code plugin remains supported.
7. The plugin is published in the current GreatPM Git repository.
8. User-visible syntax may follow Codex conventions, but capability and
   governance behavior must remain equivalent.
9. Previously settled requirements must be recovered from repository
   documentation and conversation context before asking the human.

## 3. Current repository baseline

The current repository contains:

- 48 specialist agent definitions under `agents/`;
- 79 product-management skills under `skills/`;
- 34 Claude command workflows under `commands/`;
- 26 templates;
- the six-stage product loop and three human gates;
- `.great-pm/` product context, handoff, verdict, draft, log, and decision
  conventions;
- connector engine and write-governance controls;
- local product board;
- lifecycle and safety hooks in `.claude-plugin/plugin.json`;
- an OpenAI-shaped connector adapter that proves connector portability but
  does not provide full Codex workflow parity.

## 4. Architecture

### 4.1 Shared core

The following remain canonical and host-independent wherever possible:

- agent role instructions;
- product-management skills and methods;
- workflow logic;
- human-gate policy;
- templates;
- `.great-pm/` state contract;
- board;
- connector engine;
- reporting contracts;
- safety policy.

Host-specific tool names, model aliases, path variables, command syntax, and
lifecycle bindings must be isolated in adapters or wrappers.

### 4.2 Native Codex package

Add a Codex plugin entry point at:

```text
.codex-plugin/plugin.json
```

The manifest provides:

- stable plugin identity and version;
- GreatPM product-management description;
- bundled Codex skill path;
- lifecycle hook path;
- install-surface metadata;
- repository, author, license, privacy, and security links;
- starter prompts for core GreatPM workflows.

Only the manifest belongs inside `.codex-plugin/`. Codex-specific skills,
hooks, tests, and marketplace metadata remain at documented plugin-root
locations.

### 4.3 Codex workflow layer

Convert each of the 34 Claude command workflows into a Codex-invocable skill.
The Codex entry skills:

- retain the original workflow intent and arguments;
- load the same shared agent and method instructions;
- use Codex-native tool and subagent behavior;
- preserve GreatPM reporting and artefact contracts;
- stop at the same human gates;
- write the same `.great-pm/` product state.

The expected invocation surface follows Codex skill conventions. Exact syntax
may differ from Claude slash commands, but each workflow must have a documented
one-to-one entry point.

### 4.4 Specialist-agent orchestration

All 48 existing specialist roles remain canonical under `agents/`.

The Codex orchestration layer:

1. Selects the same role the Claude workflow selects.
2. Loads that role's portable instructions and required skills.
3. Removes or translates Claude-only frontmatter such as model aliases, tool
   grants, turn limits, and memory declarations.
4. Spawns Codex subagents with explicit bounded tasks.
5. Preserves required parallel execution.
6. Collects role verdicts and artefacts into the parent workflow.
7. Keeps the human as the only gate-approval authority.

Plugin operation must not depend on 48 separately installed personal agents.
The installed plugin carries the role definitions and orchestrates them using
Codex's supported subagent facilities.

### 4.5 Lifecycle and safety hooks

Translate the existing lifecycle behavior into trusted Codex plugin hooks:

| GreatPM behavior | Codex event |
|---|---|
| Load GreatPM context | `SessionStart` |
| Inject product context into specialists | `SubagentStart` |
| Save a handoff before compaction | `PreCompact` |
| Save session record and learning marker | `SessionEnd` |
| Block dangerous commands | `PreToolUse` |
| Detect secrets in file changes | `PreToolUse` |

Hook commands use Codex plugin path variables, bounded timeouts, structured
input handling, and fail-safe behavior. Installation documentation must explain
that users review and trust plugin hooks before they run.

### 4.6 Product state

Both supported hosts read and write the same `.great-pm/` contract:

```text
.great-pm/
  PROJECT.md
  brain.md
  HANDOFF.md
  discover/
  drafts/
  gates/
  logs/
  refinements/
  verdicts/
  connectors.json
  secrets.env
```

Existing GreatPM work must remain resumable when the user changes supported
hosts. Host-specific cache or installation data must not become product truth.

### 4.7 Existing runtime capabilities

Reuse rather than replace:

- `scripts/great-pm` and related deterministic helpers;
- the connector engine and capability-governance rules;
- board server;
- templates;
- Beads integration with its documented fallback;
- audit logs and destructive-action protections.

Codex wrappers translate host calls into these existing neutral entry points.

## 5. User experience

### 5.1 Installation

The repository will provide:

- a repository-scoped plugin marketplace entry;
- Codex desktop installation instructions;
- Codex CLI marketplace and installation commands;
- local-development installation;
- enable, disable, upgrade, and uninstall instructions;
- hook-trust instructions;
- a first-run validation command.

### 5.2 First run

On first use, GreatPM:

1. Detects whether `.great-pm/PROJECT.md` exists.
2. Offers initialization from the existing template when absent.
3. Runs the doctor check.
4. Reports available workflows and optional integrations.
5. Does not make external writes without the configured governance level.

### 5.3 Daily use

Users can:

- start and resume initiatives;
- run discovery, strategy, prioritization, specification, launch, and
  measurement workflows;
- invoke specialist reviews;
- inspect pending gates and decisions;
- use the local board;
- preserve and resume product context across sessions.

## 6. Error handling and safety

The Codex package must:

- fail with an actionable message when required local dependencies are absent;
- degrade task tracking to `.great-pm/tasks.md` when Beads is unavailable;
- keep optional integrations optional;
- never expose secrets in prompts, logs, commits, or hook output;
- block dangerous shell and destructive repository actions using equivalent
  safety policy;
- require human approval at GreatPM gates;
- keep external write governance at `ask` by default;
- leave existing Claude functionality unchanged when Codex-specific components
  are disabled.

## 7. Parity contract

Create a machine-readable parity inventory mapping every current capability to
its Codex implementation and test.

The release cannot be marked complete until the inventory shows:

- 48 of 48 specialist roles reachable;
- 79 of 79 product-management skills discoverable or consumed by a reachable
  workflow;
- 34 of 34 workflow entry points available;
- six of six product-loop stages operational;
- three of three human gates enforced;
- all templates accessible;
- product state persists and resumes;
- board launches and reads current state;
- connector governance behaves consistently;
- lifecycle hooks execute at the intended events;
- dangerous-command and secret checks block representative violations.

Functional parity does not require identical host syntax. It requires the same
product-management outcome, governance, state, and reachable capability.

## 8. Testing strategy

### 8.1 Static validation

- Validate `.codex-plugin/plugin.json`.
- Validate every Codex skill frontmatter.
- Validate hook configuration and referenced paths.
- Validate the marketplace entry.
- Scan for Claude-only references in Codex wrappers.
- Verify the parity inventory has no missing or duplicate entries.

### 8.2 Unit and contract tests

- Test role translation and instruction loading.
- Test command-to-skill argument handling.
- Test product-state reads and writes.
- Test hook input parsing and decisions.
- Test reporting-contract output.
- Test connector and board wrappers without changing shared engines.

### 8.3 Integration tests

- Initialize a temporary GreatPM workspace.
- Start an initiative and stop at the expected human gate.
- Resume the initiative in a new session.
- Spawn representative sequential and parallel specialist roles.
- Produce and locate expected product artefacts.
- Exercise safe and blocked tool operations.
- Start and query the board.

### 8.4 Host smoke tests

- Install from the repository marketplace in Codex desktop.
- Install from the same source in Codex CLI.
- Start a fresh session after installation.
- Confirm skill discovery, hook trust, first-run doctor, a representative
  workflow, a human gate, and session resume.

### 8.5 Regression tests

Run all existing repository tests and validate the existing Claude manifest,
commands, agents, skills, hooks, board, and connectors remain operational.

## 9. Repository and commit strategy

Work proceeds on:

```text
codex/greatpm-codex-plugin
```

created from `main`.

Commits are intentionally staged:

1. approved design and implementation plan;
2. native manifest and marketplace packaging;
3. shared-core portability helpers;
4. workflow skill conversion;
5. specialist-agent orchestration;
6. lifecycle and safety hooks;
7. parity inventory and automated tests;
8. installation, usage, and release documentation;
9. final parity fixes and release readiness.

Unrelated work is not included in these commits.

## 10. Release criteria

The public Git release is ready only when:

1. The full parity contract passes.
2. Codex desktop installation is verified.
3. Codex CLI installation is verified.
4. Existing Claude behavior passes regression checks.
5. Documentation contains no starter-edition or partial-parity claim.
6. No secrets or machine-specific paths are committed.
7. The branch contains only GreatPM Codex-plugin changes.
8. The final release notes accurately describe supported surfaces and any
   host-syntax differences.

## 11. Non-goals

- Rewriting the GreatPM product-management methodology.
- Replacing the shared connector engine, board, or product-state model.
- Maintaining a separate drifting copy of GreatPM for Codex.
- Shipping a reduced capability edition.
- Changing the three human approval gates.
- Breaking the existing Claude Code plugin.

## 12. Approved implementation direction

Build one shared GreatPM core with native Codex packaging and thin
host-specific bindings. Implement in reviewable stages, but publish only after
the full parity contract succeeds.
