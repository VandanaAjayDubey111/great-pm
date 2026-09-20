# GreatPM for Codex

GreatPM is the complete product-management operating system for Codex desktop
and Codex CLI: 48 agents, 79 product-management skills, 34 workflows, the
six-stage product loop, three human decision gates, the local board, governed
connectors, durable `.great-pm/` state, and lifecycle hooks.

Codex invokes workflows as skills (for example, `$pm-start`) rather than Claude
slash commands (for example, `/pm-start`). The product behavior, artefacts,
specialist roles, governance, and human gates are equivalent.

## Install from the public repository

Requirements:

- Codex desktop or a Codex CLI version with `codex plugin`;
- Node.js 20 or newer for the board, connectors, doctor, and build checks;
- Git access to GitHub.

Add the public repository as a marketplace, install GreatPM, and verify that
Codex sees the source:

```bash
codex plugin marketplace add VandanaAjayDubey111/great-pm
codex plugin add great-pm@great-pm
codex plugin marketplace list
```

Start a new Codex session after installation. Skills and hooks are discovered
at session start; an already-open session does not reliably pick up a newly
installed or upgraded package.

## Install in Codex desktop

1. Add the repository marketplace with the CLI command above.
2. Restart the ChatGPT desktop app.
3. Select Codex, open **Plugins**, and choose the **GreatPM** marketplace.
4. Open **GreatPM** and install it.
5. Complete the hook review. Installing a plugin does not automatically trust
   its non-managed hooks.
6. Start a new Codex task and invoke `$pm-help`.

Workspace policy can restrict third-party marketplace sources or plugin
installation. If GreatPM does not appear, ask the workspace administrator to
allow this GitHub marketplace.

## Review and trust the hooks

GreatPM packages these local hooks:

- `SessionStart` loads product context;
- `SubagentStart` gives each specialist the current project, brain, handoff,
  and recent verdicts;
- `PreCompact` writes `.great-pm/HANDOFF.md`;
- `SessionEnd` writes a local session marker and log;
- `PreToolUse` blocks common destructive shell commands and secret-looking
  writes.

Review `plugins/great-pm/hooks/hooks.json` and the referenced scripts before
trusting them. Hooks operate only with the permissions available to the Codex
session. The safety hook is a guardrail, not a replacement for backups, access
controls, or human review.

## Initialize a product workspace

GreatPM keeps project-specific context in `.great-pm/`. From the product
repository, create the initial file from the bundled template:

```bash
mkdir -p .great-pm
cp /path/to/installed/great-pm/templates/PROJECT.md.template .great-pm/PROJECT.md
```

Customize the product name, problem, users, constraints, and active
initiatives. Then run:

```text
$pm-help
$pm-start "the product problem or opportunity"
```

The packaged doctor checks this prerequisite without modifying the project:

```bash
node /path/to/installed/great-pm/scripts/great-pm-codex-doctor.mjs
```

If you are working from a clone of this repository, replace the installed path
with `plugins/great-pm`.

## Everyday use

- `$pm-help` lists all 34 workflows.
- `$pm-start "<problem>"` begins a new initiative and runs discovery.
- `$pm-resume <initiative>` resumes the product loop from durable state.
- `$pm-inbox` shows decisions and human gates waiting for you.
- `$pm-board` opens the local product board.

Only the human may approve `gate:strategy`, `gate:spec`, or `gate:launch`.
Specialist agents draft and propose; they do not silently make final product
decisions.

### Specialist names and internal identifiers

GreatPM preserves the Claude role names, workflow names, filenames, and verdict
logs. Codex's spawn tool requires an internal identifier containing only lowercase
letters, digits, and underscores, so `query-refiner-pm` runs as `query_refiner_pm`
and `pm-lead` as `pm_lead`. This mapping is internal only: continue to use
`$grill-me`, not `$grill_me`. The runtime records the canonical role alongside
the internal identifier and returned agent ID. Version 1.1.4 introduced this
mapping; the 1.1.5 candidate also includes the supporting workflow guide that
earlier packages omitted. Start a new Codex session after installing the update.

## Test a local checkout

Use an absolute path to a checkout whose `.agents/plugins/marketplace.json` and
`plugins/great-pm/` package are current:

```bash
cd /absolute/path/to/great-pm/codex
npm run build
npm test
npm run check:generated
codex plugin marketplace add /absolute/path/to/great-pm
codex plugin add great-pm@great-pm
```

Restart Codex desktop or start a fresh CLI session after installing. Run
`codex plugin marketplace list` to confirm which local or Git snapshot is in
use.

## Upgrade

Refresh the Git marketplace and reinstall the package:

```bash
codex plugin marketplace upgrade great-pm
codex plugin add great-pm@great-pm
```

Then start a new session. If the CLI reports that the old install must be
removed first, run `codex plugin remove great-pm@great-pm`, followed by the add
command.

## Uninstall

```bash
codex plugin remove great-pm@great-pm
```

Removing the plugin does not delete a product repository's `.great-pm/`
directory. That state belongs to the project; archive or remove it separately
only when you intentionally want to discard the product history.

## Troubleshooting

### `node` is missing

Install Node.js 20 or newer, confirm `node --version`, and start a new Codex
session. Product skills are text, but the board, connectors, hook guard, and
doctor require Node.

### Hooks are installed but do not run

Open GreatPM in **Plugins**, perform the hook review, and trust the current hook
definitions. Re-review is expected when hook definitions change.

### The doctor reports missing `.great-pm/PROJECT.md`

Create `.great-pm/`, copy `templates/PROJECT.md.template` from the installed
plugin, customize it, and rerun the doctor. GreatPM intentionally stops before
inventing core product context.

### `bd` or Beads is unavailable

GreatPM remains installable, and file-based skills and templates still work.
Beads supplies richer task, gate, decision, and board tracking. Workflows that
require those records must report `BLOCKED` rather than silently dropping
state. Install Beads and start a fresh session for the complete tracking
experience.

### GreatPM does not appear

Run `codex plugin marketplace list`, confirm the `great-pm` marketplace root,
refresh it with `codex plugin marketplace upgrade great-pm`, and restart the
desktop app. Workspace marketplace restrictions may require administrator
approval.

### A workflow is not selected automatically

Invoke it explicitly with its `$` name, such as `$pm-start` or `$pm-inbox`.
Explicit invocation remains available even when implicit skill selection is
disabled by host policy.
