# GreatPM Codex Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the complete GreatPM product-management operating system as an installable plugin for Codex desktop and Codex CLI with functional parity to the existing Claude Code experience.

**Architecture:** Keep the repository-root agents, skills, workflows, templates, board, scripts, and connectors canonical. A deterministic zero-dependency Node build packages that shared core into `plugins/great-pm/`, adds Codex-native workflow skills and hooks, and emits a parity inventory. Repository tests rebuild into a temporary directory and compare it with the committed package so generated content cannot drift.

**Tech Stack:** Node.js 20+ standard library, Bash, JSON, Markdown/YAML frontmatter, Codex plugin manifest and repository marketplace formats, Node's built-in test runner.

---

## File map

### Canonical source changes

- `README.md` — clarify 48 total agents, the 29-agent subset, and Codex installation.
- `.claude-plugin/marketplace.json` — correct stale skill count.
- `skills/great-pm/SKILL.md` — correct stale agent and skill counts.
- `commands/pm-help.md` — correct stale workflow count.
- `.gitignore` — ignore temporary package-build output only.

### Codex build system

- `codex/package.json` — zero-dependency build and test commands.
- `codex/lib/frontmatter.mjs` — parse the scalar metadata required by the packager.
- `codex/lib/inventory.mjs` — enumerate canonical agents, skills, workflows, and templates.
- `codex/lib/render.mjs` — render Codex-compatible skills, role files, metadata, and paths.
- `codex/lib/package-plugin.mjs` — copy shared runtime content and assemble the plugin.
- `codex/scripts/build-plugin.mjs` — deterministic package entry point.
- `codex/scripts/check-generated.mjs` — compare a fresh build with the committed package.
- `codex/runtime/doctor.mjs` — first-run and installation diagnostics.
- `codex/hooks/pre-tool-use.mjs` — dangerous-command and secret-write guard.
- `codex/hooks/pre-compact.sh` — persist `.great-pm/HANDOFF.md`.
- `codex/hooks/session-end.sh` — persist session log and learning marker.
- `codex/hooks/hooks.json` — Codex lifecycle configuration copied into the package.
- `codex/test/*.test.mjs` — unit, contract, parity, hook, doctor, and packaging tests.

### Generated public package

- `plugins/great-pm/.codex-plugin/plugin.json` — installable plugin manifest.
- `plugins/great-pm/skills/` — 79 shared product-management skills plus 34 Codex workflow entry skills and one host orchestration skill.
- `plugins/great-pm/agents/` — 48 portable specialist role definitions.
- `plugins/great-pm/templates/` — 26 product artefact templates.
- `plugins/great-pm/commands/` — canonical workflow sources for traceability.
- `plugins/great-pm/scripts/` — CLI, doctor, and session helpers.
- `plugins/great-pm/hooks/` — lifecycle and safety hooks.
- `plugins/great-pm/board/` — local product board.
- `plugins/great-pm/connectors/` — shared connector engine.
- `plugins/great-pm/adapters/` — shared host-neutral and Codex adapter code.
- `plugins/great-pm/codex/parity.json` — machine-readable capability inventory.
- `plugins/great-pm/LICENSE`, `NOTICE.md`, `PRIVACY.md`, `SECURITY.md` — release and trust metadata.

### Distribution, CI, and documentation

- `.agents/plugins/marketplace.json` — repository marketplace entry.
- `.github/workflows/codex-plugin-ci.yml` — package, parity, regression, and drift checks.
- `docs/CODEX.md` — desktop and CLI install, use, upgrade, uninstall, trust, and troubleshooting.
- `docs/CODEX-PARITY.md` — human-readable 48/79/34/26 parity matrix and smoke-test record.

---

### Task 1: Lock the canonical inventory and correct stale counts

**Files:**
- Create: `codex/package.json`
- Create: `codex/lib/frontmatter.mjs`
- Create: `codex/lib/inventory.mjs`
- Create: `codex/test/inventory.test.mjs`
- Modify: `README.md`
- Modify: `.claude-plugin/marketplace.json`
- Modify: `skills/great-pm/SKILL.md`
- Modify: `commands/pm-help.md`

- [ ] **Step 1: Add a failing inventory test**

```js
// codex/test/inventory.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { inventory } from '../lib/inventory.mjs';

test('canonical GreatPM inventory is complete', async () => {
  const result = await inventory(new URL('../../', import.meta.url));
  assert.equal(result.agents.length, 48);
  assert.equal(result.skills.length, 79);
  assert.equal(result.workflows.length, 34);
  assert.equal(result.templates.length, 26);
  assert.equal(new Set(result.agents).size, 48);
  assert.equal(new Set(result.skills).size, 79);
  assert.equal(new Set(result.workflows).size, 34);
});

test('supporting files are not counted as skills', async () => {
  const result = await inventory(new URL('../../', import.meta.url));
  assert.equal(result.skills.includes('WORKFLOW'), false);
});
```

- [ ] **Step 2: Add the zero-dependency package scripts**

```json
{
  "name": "greatpm-codex-build",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/build-plugin.mjs",
    "check:generated": "node scripts/check-generated.mjs",
    "test": "node --test test/*.test.mjs"
  }
}
```

- [ ] **Step 3: Run the test and verify it fails because the inventory module is absent**

Run:

```bash
cd codex
npm test -- --test-name-pattern="canonical GreatPM inventory"
```

Expected: non-zero exit with `ERR_MODULE_NOT_FOUND` for `lib/inventory.mjs`.

- [ ] **Step 4: Implement focused frontmatter and inventory readers**

```js
// codex/lib/frontmatter.mjs
export function splitFrontmatter(text, source) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${source}: missing YAML frontmatter`);
  return { yaml: match[1], body: match[2] };
}

export function scalar(yaml, key, source) {
  const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(yaml);
  if (!match) throw new Error(`${source}: missing ${key}`);
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}
```

```js
// codex/lib/inventory.mjs
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { splitFrontmatter, scalar } from './frontmatter.mjs';

async function files(dir, predicate) {
  return (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && predicate(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function skillNames(root) {
  const dir = path.join(root, 'skills');
  const entries = await readdir(dir, { withFileTypes: true });
  const names = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(dir, entry.name, 'SKILL.md');
    try {
      const text = await readFile(skillPath, 'utf8');
      const { yaml } = splitFrontmatter(text, skillPath);
      names.push(scalar(yaml, 'name', skillPath));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return names;
}

export async function inventory(rootUrl) {
  const root = fileURLToPath(rootUrl);
  return {
    agents: (await files(path.join(root, 'agents'), (name) => name.endsWith('.md')))
      .map((name) => name.slice(0, -3)),
    skills: await skillNames(root),
    workflows: (await files(path.join(root, 'commands'), (name) => name.endsWith('.md')))
      .map((name) => name.slice(0, -3)),
    templates: await files(path.join(root, 'templates'), () => true)
  };
}
```

- [ ] **Step 5: Run the inventory tests**

Run:

```bash
cd codex
npm test -- --test-name-pattern="inventory|supporting"
```

Expected: 2 tests pass.

- [ ] **Step 6: Correct all stale count claims**

Make these exact content corrections:

- `README.md`: say `48 total agents`; change the subset sentence to `29 additional specialist agents (48 agents total)`.
- `.claude-plugin/marketplace.json`: change `75 skills` to `79 skills`.
- `skills/great-pm/SKILL.md`: change `47 agents installed` to `48 agents installed`; change `75-skill library` to `79-skill library`.
- `commands/pm-help.md`: change the terminal report from `33 total` to `34 total`.

- [ ] **Step 7: Add and run a metadata regression assertion**

Append to `codex/test/inventory.test.mjs`:

```js
test('published metadata uses canonical counts', async () => {
  const root = new URL('../../', import.meta.url);
  const read = async (relative) => readFile(new URL(relative, root), 'utf8');
  const readme = await read('README.md');
  const marketplace = await read('.claude-plugin/marketplace.json');
  const operatingModel = await read('skills/great-pm/SKILL.md');
  const help = await read('commands/pm-help.md');
  assert.match(readme, /48 agents · 79 skills · 34 commands/);
  assert.match(marketplace, /48 specialist PM agents, 79 skills/);
  assert.match(operatingModel, /48 agents installed/);
  assert.match(operatingModel, /79-skill library/);
  assert.match(help, /commands listed \(34 total\)/);
});
```

Run:

```bash
cd codex
npm test
```

Expected: all inventory tests pass.

- [ ] **Step 8: Commit the canonical inventory**

```bash
git add codex/package.json codex/lib/frontmatter.mjs codex/lib/inventory.mjs codex/test/inventory.test.mjs README.md .claude-plugin/marketplace.json skills/great-pm/SKILL.md commands/pm-help.md
git commit -m "fix(core): lock GreatPM capability inventory"
```

---

### Task 2: Build the deterministic plugin packager

**Files:**
- Create: `codex/lib/render.mjs`
- Create: `codex/lib/package-plugin.mjs`
- Create: `codex/scripts/build-plugin.mjs`
- Create: `codex/test/package-plugin.test.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: Write the failing temporary-package test**

```js
// codex/test/package-plugin.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('packager emits a complete GreatPM plugin', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-codex-'));
  try {
    const result = await packagePlugin({
      sourceRoot: new URL('../../', import.meta.url),
      outputRoot: temp
    });
    assert.deepEqual(result.counts, {
      agents: 48,
      productSkills: 79,
      workflows: 34,
      templates: 26
    });
    const parity = JSON.parse(await readFile(path.join(temp, 'codex/parity.json'), 'utf8'));
    assert.equal(parity.agents.length, 48);
    assert.equal(parity.productSkills.length, 79);
    assert.equal(parity.workflows.length, 34);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the package test and verify it fails**

Run:

```bash
cd codex
npm test -- --test-name-pattern="packager emits"
```

Expected: non-zero exit with `ERR_MODULE_NOT_FOUND` for `lib/package-plugin.mjs`.

- [ ] **Step 3: Implement Codex host text rendering**

```js
// codex/lib/render.mjs
import { splitFrontmatter, scalar } from './frontmatter.mjs';

export const HOST_BINDING = `## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Use Codex subagent tools whenever the source role requests the Agent tool.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.
`;

const yamlString = (value) => JSON.stringify(value);

export function renderProductSkill(text, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const name = scalar(yaml, 'name', source);
  const description = scalar(yaml, 'description', source);
  const packagedName = name === 'pm-audit' ? 'method-pm-audit' : name;
  return `---\nname: ${packagedName}\ndescription: ${yamlString(description)}\n---\n\n${HOST_BINDING}\n${body}`;
}

export function renderWorkflowSkill(text, workflowName, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const description = scalar(yaml, 'description', source);
  const converted = body
    .replaceAll('${CLAUDE_PLUGIN_ROOT}', '${PLUGIN_ROOT}')
    .replace(/\\/pm-([a-z-]+)/g, '$pm-$1')
    .replaceAll('`pm-audit` skill', '`method-pm-audit` skill')
    .replaceAll('Agent tool', 'Codex subagent tools');
  return `---\nname: ${workflowName}\ndescription: ${yamlString(description)}\n---\n\n${HOST_BINDING}\n${converted}`;
}
```

- [ ] **Step 4: Implement package assembly**

`codex/lib/package-plugin.mjs` must:

1. remove only the explicit `outputRoot`;
2. recreate it;
3. copy `agents`, `templates`, `board`, `connectors`, `adapters`, and approved runtime scripts;
4. render 79 product skills into `outputRoot/skills`;
5. render 34 workflows into distinct skill folders under `outputRoot/skills`;
6. copy license and security documents;
7. write sorted `codex/parity.json`;
8. return the four canonical counts.

Use this public contract:

```js
export async function packagePlugin({ sourceRoot, outputRoot }) {
  const source = fileURLToPath(sourceRoot);
  const output = outputRoot instanceof URL
    ? fileURLToPath(outputRoot)
    : path.resolve(outputRoot);
  const counts = await inventory(sourceRoot);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await copyPortableRuntime(source, output);
  await renderSkills(source, output, counts);
  await writeParity(output, counts);
  await writeManifest(output);
  await writeHooks(output);
  return {
    counts: {
      agents: counts.agents.length,
      productSkills: counts.skills.length,
      workflows: counts.workflows.length,
      templates: counts.templates.length
    }
  };
}
```

The copy allowlist is:

```js
const PORTABLE_DIRECTORIES = [
  'agents',
  'adapters',
  'board',
  'connectors',
  'templates'
];
const PORTABLE_FILES = [
  'LICENSE',
  'NOTICE.md',
  'PRIVACY.md',
  'SECURITY.md'
];
```

- [ ] **Step 5: Add the build entry point**

```js
// codex/scripts/build-plugin.mjs
import { packagePlugin } from '../lib/package-plugin.mjs';

const result = await packagePlugin({
  sourceRoot: new URL('../../', import.meta.url),
  outputRoot: new URL('../../plugins/great-pm/', import.meta.url)
});
process.stdout.write(`${JSON.stringify(result)}\n`);
```

- [ ] **Step 6: Run the package test**

Run:

```bash
cd codex
npm test -- --test-name-pattern="packager emits"
```

Expected: 1 package test passes.

- [ ] **Step 7: Ignore only temporary comparison output**

Append to `.gitignore`:

```gitignore
# deterministic Codex plugin comparison output
.codex-build-check/
```

- [ ] **Step 8: Commit the packager**

```bash
git add codex/lib/render.mjs codex/lib/package-plugin.mjs codex/scripts/build-plugin.mjs codex/test/package-plugin.test.mjs .gitignore
git commit -m "feat(codex): add deterministic plugin packager"
```

---

### Task 3: Generate and validate the native manifest and marketplace

**Files:**
- Modify: `codex/lib/package-plugin.mjs`
- Create: `.agents/plugins/marketplace.json`
- Create: `codex/test/manifest.test.mjs`
- Generate: `plugins/great-pm/.codex-plugin/plugin.json`

- [ ] **Step 1: Write failing manifest tests**

```js
// codex/test/manifest.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('manifest exposes GreatPM as a Codex plugin', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-manifest-'));
  try {
    await packagePlugin({ sourceRoot: new URL('../../', import.meta.url), outputRoot: temp });
    const manifest = JSON.parse(
      await readFile(path.join(temp, '.codex-plugin/plugin.json'), 'utf8')
    );
    assert.equal(manifest.name, 'great-pm');
    assert.equal(manifest.version, '1.1.0');
    assert.equal(manifest.skills, './skills/');
    assert.equal(manifest.interface.displayName, 'GreatPM');
    assert.deepEqual(manifest.interface.capabilities, [
      'Interactive',
      'Read',
      'Write',
      'Subagents',
      'Hooks'
    ]);
    assert.equal('apps' in manifest, false);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the manifest test and verify it fails**

Run:

```bash
cd codex
npm test -- --test-name-pattern="manifest exposes"
```

Expected: failure because `.codex-plugin/plugin.json` is absent.

- [ ] **Step 3: Generate the exact manifest**

Have `writeManifest()` emit:

```json
{
  "name": "great-pm",
  "version": "1.1.0",
  "description": "The complete GreatPM product-management operating system for Codex.",
  "author": {
    "name": "Vandana Dubey",
    "url": "https://github.com/VandanaAjayDubey111"
  },
  "homepage": "https://github.com/VandanaAjayDubey111/great-pm",
  "repository": "https://github.com/VandanaAjayDubey111/great-pm",
  "license": "MIT",
  "keywords": ["product-management", "ai-pm", "multi-agent", "codex"],
  "skills": "./skills/",
  "interface": {
    "displayName": "GreatPM",
    "shortDescription": "Your complete product team in Codex",
    "longDescription": "Run discovery, strategy, prioritization, specification, launch, and measurement with specialist agents and human decision gates.",
    "developerName": "Vandana Dubey",
    "category": "Productivity",
    "capabilities": ["Interactive", "Read", "Write", "Subagents", "Hooks"],
    "websiteURL": "https://github.com/VandanaAjayDubey111/great-pm",
    "privacyPolicyURL": "https://github.com/VandanaAjayDubey111/great-pm/blob/main/PRIVACY.md",
    "defaultPrompt": [
      "Start a GreatPM product initiative.",
      "Show my pending product decisions.",
      "Resume my GreatPM product loop."
    ],
    "brandColor": "#10A37F"
  }
}
```

- [ ] **Step 4: Add the repository marketplace entry**

```json
{
  "name": "great-pm",
  "interface": {
    "displayName": "GreatPM"
  },
  "plugins": [
    {
      "name": "great-pm",
      "source": {
        "source": "local",
        "path": "./plugins/great-pm"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

- [ ] **Step 5: Build and validate**

Run:

```bash
cd codex
npm run build
npm test -- --test-name-pattern="manifest exposes"
python3 /Users/vandandubey/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py ../plugins/great-pm
```

Expected: build exits 0, manifest test passes, validator prints `Plugin validation passed`.

- [ ] **Step 6: Commit manifest, marketplace, and generated baseline**

```bash
git add codex/lib/package-plugin.mjs codex/test/manifest.test.mjs .agents/plugins/marketplace.json plugins/great-pm
git commit -m "feat(codex): package GreatPM for Codex"
```

---

### Task 4: Convert all 34 workflows into Codex entry skills

**Files:**
- Modify: `codex/lib/render.mjs`
- Modify: `codex/lib/package-plugin.mjs`
- Create: `codex/test/workflows.test.mjs`
- Generate: `plugins/great-pm/skills/pm-*/SKILL.md`

- [ ] **Step 1: Write the failing workflow parity test**

```js
// codex/test/workflows.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('all 34 workflows are installable Codex skills', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-workflows-'));
  try {
    await packagePlugin({ sourceRoot: new URL('../../', import.meta.url), outputRoot: temp });
    const parity = JSON.parse(await readFile(path.join(temp, 'codex/parity.json'), 'utf8'));
    assert.equal(parity.workflows.length, 34);
    for (const name of parity.workflows) {
      const text = await readFile(path.join(temp, 'skills', name, 'SKILL.md'), 'utf8');
      assert.match(text, new RegExp(`^---\\nname: ${name}\\n`, 'm'));
      assert.match(text, /## Codex host binding/);
      assert.doesNotMatch(text, /model: opus/);
      assert.doesNotMatch(text, /allowed-tools:/);
    }
    const skillDirs = await readdir(path.join(temp, 'skills'));
    assert.equal(skillDirs.filter((name) => name.startsWith('pm-')).length, 34);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run and verify the workflow test fails**

Run:

```bash
cd codex
npm test -- --test-name-pattern="all 34 workflows"
```

Expected: failure on the first missing generated workflow skill.

- [ ] **Step 3: Render workflow skills from canonical commands**

For each name returned by `inventory().workflows`:

1. read `commands/${name}.md`;
2. call `renderWorkflowSkill(text, name, sourcePath)`;
3. write `skills/${name}/SKILL.md`;
4. add a UI metadata file with implicit invocation enabled;
5. package the canonical `pm-audit` method as `method-pm-audit` so the
   `$pm-audit` workflow keeps the user-facing name without a skill-name
   collision.

Use this exact UI metadata:

```yaml
interface:
  display_name: "GreatPM workflow"
  short_description: "Run a GreatPM product-management workflow"
  default_prompt: "Use $pm-start on my current product initiative."
policy:
  allow_implicit_invocation: true
```

Generate `display_name` and `default_prompt` from each workflow name; the
`pm-start` values above are the exact output for that workflow.

- [ ] **Step 4: Run the workflow tests and inspect generated help**

Run:

```bash
cd codex
npm run build
npm test -- --test-name-pattern="all 34 workflows"
sed -n '1,80p' ../plugins/great-pm/skills/pm-help/SKILL.md
```

Expected: workflow test passes; generated help has `name: pm-help` and Codex host binding.

- [ ] **Step 5: Commit workflow conversion**

```bash
git add codex/lib/render.mjs codex/lib/package-plugin.mjs codex/test/workflows.test.mjs plugins/great-pm/skills
git commit -m "feat(codex): expose all GreatPM workflows"
```

---

### Task 5: Package 48 roles and Codex subagent orchestration

**Files:**
- Modify: `codex/lib/render.mjs`
- Modify: `codex/lib/package-plugin.mjs`
- Create: `codex/test/agents.test.mjs`
- Create: `codex/source-skills/great-pm-runtime/SKILL.md`
- Generate: `plugins/great-pm/agents/*.md`
- Generate: `plugins/great-pm/skills/great-pm-runtime/SKILL.md`

- [ ] **Step 1: Write failing agent parity tests**

```js
// codex/test/agents.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('all 48 specialist roles are packaged for Codex subagents', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-agents-'));
  try {
    await packagePlugin({ sourceRoot: new URL('../../', import.meta.url), outputRoot: temp });
    const parity = JSON.parse(await readFile(path.join(temp, 'codex/parity.json'), 'utf8'));
    assert.equal(parity.agents.length, 48);
    for (const name of parity.agents) {
      const text = await readFile(path.join(temp, 'agents', `${name}.md`), 'utf8');
      assert.match(text, new RegExp(`^---\\nname: ${name}\\n`, 'm'));
      assert.match(text, /## Codex role binding/);
      assert.doesNotMatch(text, /^model:/m);
      assert.doesNotMatch(text, /^tools:/m);
    }
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run and verify the agent test fails**

Run:

```bash
cd codex
npm test -- --test-name-pattern="all 48 specialist"
```

Expected: failure because copied agent files still contain Claude-only frontmatter.

- [ ] **Step 3: Add portable role rendering**

Add to `codex/lib/render.mjs`:

```js
export function renderAgent(text, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const name = scalar(yaml, 'name', source);
  const description = scalar(yaml, 'description', source);
  const converted = body
    .replaceAll('${CLAUDE_PLUGIN_ROOT}', '${PLUGIN_ROOT}')
    .replace(/\\/pm-([a-z-]+)/g, '$pm-$1')
    .replaceAll('`pm-audit` skill', '`method-pm-audit` skill')
    .replaceAll('Agent tool', 'Codex subagent tools');
  return `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n\n## Codex role binding

- Run this role as a Codex subagent with a bounded, self-contained assignment.
- Inherit the parent session permissions; request no broader authority.
- Use the product skills named in the canonical role when they are packaged.
- Preserve DONE/BLOCKED reporting, artefact paths, and human gates.
- Return a concise verdict to the parent GreatPM workflow.

${converted}`;
}
```

- [ ] **Step 4: Add the host orchestration skill**

```md
---
name: great-pm-runtime
description: Use when a GreatPM workflow needs to select, spawn, coordinate, or collect results from its specialist product-management roles in Codex.
---

# GreatPM Codex Runtime

1. Resolve the selected role under `../../agents/`; for example, the
   orchestrator role is `../../agents/pm-lead.md`.
2. Spawn the role with the initiative, expected artefact, dependencies, human-gate boundary, and DONE/BLOCKED contract.
3. Spawn independent roles concurrently.
4. Never impersonate a role when subagent tools are unavailable; report BLOCKED and name the missing capability.
5. Collect each verdict without rewriting it.
6. Persist role verdicts under `.great-pm/verdicts/`.
7. Only the human may approve `gate:strategy`, `gate:spec`, or `gate:launch`.
```

- [ ] **Step 5: Package and test all roles**

Run:

```bash
cd codex
npm run build
npm test -- --test-name-pattern="all 48 specialist"
```

Expected: agent test passes with 48 role files.

- [ ] **Step 6: Commit role orchestration**

```bash
git add codex/lib/render.mjs codex/lib/package-plugin.mjs codex/source-skills/great-pm-runtime/SKILL.md codex/test/agents.test.mjs plugins/great-pm/agents plugins/great-pm/skills/great-pm-runtime
git commit -m "feat(codex): orchestrate all GreatPM specialists"
```

---

### Task 6: Port lifecycle, handoff, and safety hooks

**Files:**
- Create: `codex/hooks/hooks.json`
- Create: `codex/hooks/pre-tool-use.mjs`
- Create: `codex/hooks/pre-compact.sh`
- Create: `codex/hooks/session-end.sh`
- Create: `codex/hooks/subagent-context.sh`
- Create: `codex/test/hooks.test.mjs`
- Modify: `codex/lib/package-plugin.mjs`
- Generate: `plugins/great-pm/hooks/*`

- [ ] **Step 1: Write failing safety-hook tests**

```js
// codex/test/hooks.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const hook = new URL('../hooks/pre-tool-use.mjs', import.meta.url);

function run(input) {
  return spawnSync(process.execPath, [hook], {
    input: JSON.stringify(input),
    encoding: 'utf8'
  });
}

test('dangerous shell commands are blocked', () => {
  const result = run({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'git reset --hard' }
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Dangerous command pattern/);
});

test('secret-looking file content is blocked', () => {
  const result = run({
    hook_event_name: 'PreToolUse',
    tool_name: 'apply_patch',
    tool_input: { patch: 'token=ghp_12345678901234567890' }
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Potential API key or token/);
});

test('safe commands pass', () => {
  const result = run({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'npm test' }
  });
  assert.equal(result.status, 0);
});
```

- [ ] **Step 2: Run and verify hook tests fail**

Run:

```bash
cd codex
npm test -- --test-name-pattern="blocked|safe commands"
```

Expected: failure because `pre-tool-use.mjs` is absent.

- [ ] **Step 3: Implement the safety hook**

`codex/hooks/pre-tool-use.mjs` reads one JSON object from stdin, extracts
`tool_name` and `tool_input`, and exits 2 for:

```js
const DANGEROUS = [
  /(^|[;&|\s])rm\s+(-[A-Za-z]*r[A-Za-z]*f|-[A-Za-z]*f[A-Za-z]*r|--recursive)/i,
  /(^|[;&|\s])git\s+push\s+.*(--force(?:-with-lease)?|-f(?:\s|$))/i,
  /(^|[;&|\s])git\s+reset\s+--hard/i,
  /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i,
  /(^|[;&|\s])(mkfs|dd)\s+/i,
  /curl\s+.*\|\s*(sudo|sh|bash|zsh|python[23]?|perl|ruby)/i
];
const SECRET = [
  /sk-[A-Za-z0-9]{20}/,
  /gh[po]_[A-Za-z0-9]{20}/,
  /AIza[0-9A-Za-z_-]{30}/,
  /AKIA[0-9A-Z]{16}/
];
```

For a match, write the established GreatPM block reason to stderr and exit 2.
For all other input, exit 0. Malformed JSON fails open with a diagnostic on
stderr so a parser issue cannot make Codex unusable.

- [ ] **Step 4: Add lifecycle hook configuration**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${PLUGIN_ROOT}/scripts/great-pm-session-start.sh\"",
            "timeout": 20,
            "statusMessage": "Loading GreatPM product context"
          }
        ]
      }
    ],
    "SubagentStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${PLUGIN_ROOT}/hooks/subagent-context.sh\"",
            "timeout": 5,
            "statusMessage": "Loading GreatPM specialist context"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${PLUGIN_ROOT}/hooks/pre-compact.sh\"",
            "timeout": 15,
            "statusMessage": "Saving GreatPM handoff"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${PLUGIN_ROOT}/hooks/session-end.sh\"",
            "timeout": 3,
            "statusMessage": "Saving GreatPM session"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash|apply_patch",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${PLUGIN_ROOT}/hooks/pre-tool-use.mjs\"",
            "timeout": 5,
            "statusMessage": "Running GreatPM safety check"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 5: Implement handoff and session scripts**

```bash
#!/usr/bin/env bash
# codex/hooks/subagent-context.sh
set -u
[ -f .great-pm/PROJECT.md ] && {
  echo "=== PROJECT.md ==="
  head -25 .great-pm/PROJECT.md
}
[ -f .great-pm/brain.md ] && {
  echo "=== brain.md ==="
  tail -40 .great-pm/brain.md
}
[ -f .great-pm/HANDOFF.md ] && {
  echo "=== HANDOFF.md ==="
  tail -20 .great-pm/HANDOFF.md
}
if [ -d .great-pm/verdicts ]; then
  find .great-pm/verdicts -type f -name '*.log' -print0 2>/dev/null \
    | xargs -0 ls -t 2>/dev/null \
    | head -3 \
    | xargs tail -2 2>/dev/null \
    | head -10
fi
exit 0
```

```bash
#!/usr/bin/env bash
# codex/hooks/pre-compact.sh
set -u
mkdir -p .great-pm
branch=$(git branch --show-current 2>/dev/null || echo unknown)
last_commit=$(git log --oneline -1 2>/dev/null || echo none)
uncommitted=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
{
  echo "# GreatPM Auto-Handoff"
  echo
  echo "Date: $(date '+%Y-%m-%d %H:%M')"
  echo "Branch: $branch"
  echo "Last commit: $last_commit"
  echo "Uncommitted: $uncommitted files"
  echo
  echo "## Open gates"
  bd list --label gate --status open 2>/dev/null | head -10 || echo none
  echo
  echo "## Latest agent verdict"
  find .great-pm/verdicts -type f -name '*.log' -print0 2>/dev/null \
    | xargs -0 ls -t 2>/dev/null \
    | head -1 \
    | xargs tail -1 2>/dev/null || echo none
  echo
  echo "## Latest drafts"
  find .great-pm/drafts -type f -name '*.md' -print 2>/dev/null \
    | head -3 || echo none
  echo
  echo "## Resume"
  echo "Run the pm-inbox skill, then continue the product loop."
} > .great-pm/HANDOFF.md
```

```bash
#!/usr/bin/env bash
# codex/hooks/session-end.sh
set -u
mkdir -p .great-pm/logs
log_date=$(date +%Y-%m-%d)
log_time=$(date +%H-%M-%S)
branch=$(git branch --show-current 2>/dev/null || echo unknown)
last_commit=$(git log --oneline -1 2>/dev/null || echo none)
{
  echo "---"
  echo "date: $log_date"
  echo "time: $log_time"
  echo "---"
  echo
  echo "# Session $log_date $log_time"
  echo
  echo "Branch: $branch"
  echo "Last commit: $last_commit"
  echo
  echo "Run the pm-save skill next session to capture lessons."
} > ".great-pm/logs/session-${log_date}-${log_time}.md"
touch .great-pm/.learn-pending
```

The packager must copy these scripts with executable mode.

- [ ] **Step 6: Run hook tests and package validation**

Run:

```bash
cd codex
npm test -- --test-name-pattern="blocked|safe commands"
npm run build
test -f ../plugins/great-pm/hooks/hooks.json
test -x ../plugins/great-pm/hooks/pre-compact.sh
```

Expected: hook tests pass and generated hook files exist.

- [ ] **Step 7: Commit hooks**

```bash
git add codex/hooks codex/test/hooks.test.mjs codex/lib/package-plugin.mjs plugins/great-pm/hooks plugins/great-pm/scripts
git commit -m "feat(codex): port GreatPM lifecycle and safety hooks"
```

---

### Task 7: Add first-run doctor and state compatibility checks

**Files:**
- Create: `codex/runtime/doctor.mjs`
- Create: `codex/test/doctor.test.mjs`
- Modify: `codex/lib/package-plugin.mjs`
- Generate: `plugins/great-pm/scripts/great-pm-codex-doctor.mjs`

- [ ] **Step 1: Write failing doctor tests**

```js
// codex/test/doctor.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { diagnose } from '../runtime/doctor.mjs';

test('doctor reports an uninitialized product workspace', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-doctor-'));
  try {
    const result = await diagnose(temp);
    assert.equal(result.ok, false);
    assert.deepEqual(result.missing, ['.great-pm/PROJECT.md']);
    assert.match(result.next, /templates\\/PROJECT\\.md\\.template/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('doctor accepts an initialized product workspace', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-doctor-'));
  try {
    await mkdir(path.join(temp, '.great-pm'), { recursive: true });
    await writeFile(path.join(temp, '.great-pm/PROJECT.md'), '# Product\\n');
    const result = await diagnose(temp);
    assert.equal(result.ok, true);
    assert.deepEqual(result.missing, []);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run and verify doctor tests fail**

Run:

```bash
cd codex
npm test -- --test-name-pattern="doctor"
```

Expected: non-zero exit with `ERR_MODULE_NOT_FOUND` for `runtime/doctor.mjs`.

- [ ] **Step 3: Implement doctor diagnostics**

```js
// codex/runtime/doctor.mjs
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function diagnose(cwd) {
  const project = path.join(cwd, '.great-pm/PROJECT.md');
  const missing = [];
  if (!(await exists(project))) missing.push('.great-pm/PROJECT.md');
  return {
    ok: missing.length === 0,
    missing,
    next: missing.length
      ? 'Copy templates/PROJECT.md.template to .great-pm/PROJECT.md and customize it.'
      : 'Run the pm-help skill or start a GreatPM initiative.'
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await diagnose(process.cwd());
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.ok ? 0 : 1;
}
```

- [ ] **Step 4: Package the doctor and link it from the runtime skill**

Copy the doctor to `plugins/great-pm/scripts/great-pm-codex-doctor.mjs`. Add to
the generated `great-pm-runtime` skill:

```md
Before starting a workflow, run:

`node ../../scripts/great-pm-codex-doctor.mjs`

If it reports an uninitialized workspace, stop and present its exact next step.
```

- [ ] **Step 5: Run doctor and state tests**

Run:

```bash
cd codex
npm test -- --test-name-pattern="doctor"
npm run build
node ../plugins/great-pm/scripts/great-pm-codex-doctor.mjs
```

Expected: tests pass; running at the repository root reports the expected
uninitialized-workspace diagnostic without modifying files.

- [ ] **Step 6: Commit doctor support**

```bash
git add codex/runtime/doctor.mjs codex/test/doctor.test.mjs codex/lib/package-plugin.mjs codex/source-skills/great-pm-runtime/SKILL.md plugins/great-pm
git commit -m "feat(codex): add GreatPM first-run diagnostics"
```

---

### Task 8: Prove board, connector, and shared-runtime packaging

**Files:**
- Create: `codex/test/runtime-assets.test.mjs`
- Modify: `codex/lib/package-plugin.mjs`
- Generate: `plugins/great-pm/board/*`
- Generate: `plugins/great-pm/connectors/*`
- Generate: `plugins/great-pm/adapters/*`
- Generate: `plugins/great-pm/scripts/*`

- [ ] **Step 1: Write failing runtime-asset tests**

```js
// codex/test/runtime-assets.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, access, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('shared runtime assets are packaged', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-runtime-'));
  try {
    await packagePlugin({ sourceRoot: new URL('../../', import.meta.url), outputRoot: temp });
    for (const relative of [
      'board/server.mjs',
      'connectors/cli.mjs',
      'connectors/governor.mjs',
      'adapters/openai/adapter.mjs',
      'scripts/great-pm',
      'templates/PROJECT.md.template'
    ]) {
      await assert.doesNotReject(() => access(path.join(temp, relative)));
    }
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run and verify the runtime test fails**

Run:

```bash
cd codex
npm test -- --test-name-pattern="shared runtime assets"
```

Expected: failure identifying the first missing runtime file.

- [ ] **Step 3: Expand the explicit package allowlist**

Copy these source paths:

```js
const PORTABLE_DIRECTORIES = [
  'agents',
  'adapters',
  'board',
  'connectors',
  'templates'
];
const PORTABLE_SCRIPTS = [
  'great-pm',
  'great-pm-connect',
  'great-pm-session-start.sh',
  'great-pm-skill-doctor.sh'
];
```

Do not copy test fixtures, local state, secrets, caches, or machine-specific
files.

- [ ] **Step 4: Run all shared-runtime tests**

Run:

```bash
cd codex
npm test -- --test-name-pattern="shared runtime assets"
npm run build
node --test ../plugins/great-pm/adapters/test/*.test.mjs
node --test ../plugins/great-pm/connectors/test/*.test.mjs
```

Expected: runtime-asset test and existing adapter/connector tests pass.

- [ ] **Step 5: Commit shared runtime packaging**

```bash
git add codex/lib/package-plugin.mjs codex/test/runtime-assets.test.mjs plugins/great-pm
git commit -m "feat(codex): package GreatPM board and shared runtime"
```

---

### Task 9: Add parity, generated-drift, and integration tests

**Files:**
- Create: `codex/scripts/check-generated.mjs`
- Create: `codex/test/parity.test.mjs`
- Create: `codex/test/integration.test.mjs`
- Create: `codex/test/helpers/tree-digest.mjs`
- Create: `docs/CODEX-PARITY.md`

- [ ] **Step 1: Write failing parity tests**

```js
// codex/test/parity.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('committed package satisfies full parity counts', async () => {
  const parity = JSON.parse(
    await readFile(new URL('../../plugins/great-pm/codex/parity.json', import.meta.url), 'utf8')
  );
  assert.equal(parity.agents.length, 48);
  assert.equal(parity.productSkills.length, 79);
  assert.equal(parity.workflows.length, 34);
  assert.equal(parity.templates.length, 26);
  assert.deepEqual(parity.gates, ['gate:launch', 'gate:spec', 'gate:strategy']);
  assert.deepEqual(parity.stages, [
    'discover',
    'strategize',
    'prioritize',
    'define',
    'launch',
    'measure'
  ]);
});
```

- [ ] **Step 2: Run and verify parity fails on missing stages and gates**

Run:

```bash
cd codex
npm test -- --test-name-pattern="full parity counts"
```

Expected: failure because generated parity metadata does not yet include stages and gates.

- [ ] **Step 3: Extend parity metadata**

Emit:

```json
{
  "stages": ["discover", "strategize", "prioritize", "define", "launch", "measure"],
  "gates": ["gate:launch", "gate:spec", "gate:strategy"]
}
```

alongside the sorted agent, product-skill, workflow, and template arrays.

- [ ] **Step 4: Add deterministic tree comparison**

`codex/scripts/check-generated.mjs` must:

1. build into a `mkdtemp()` directory;
2. hash every relative file path and file content in sorted order;
3. compare that digest with `plugins/great-pm`;
4. print the differing paths;
5. exit 1 when the committed package is stale;
6. always remove the temporary directory.

The helper contract is:

```js
export async function treeDigest(root) {
  return {
    digest: 'sha256-hex',
    files: ['sorted/relative/path']
  };
}
```

- [ ] **Step 5: Add a temporary-workspace integration test**

`codex/test/integration.test.mjs` creates a temporary directory, copies
`templates/PROJECT.md.template` to `.great-pm/PROJECT.md`, runs the doctor, and
asserts:

```js
assert.equal(doctor.ok, true);
assert.equal(parity.stages.length, 6);
assert.equal(parity.gates.length, 3);
assert.match(startSkill, /gate:strategy/);
assert.match(startSkill, /user-researcher/);
assert.match(startSkill, /feedback-synthesizer/);
assert.match(startSkill, /market-analyst/);
assert.match(runtimeSkill, /Only the human may approve/);
```

- [ ] **Step 6: Write the human-readable parity record**

`docs/CODEX-PARITY.md` contains four tables:

1. all 48 roles and their packaged path;
2. all 79 product skills and their packaged path;
3. all 34 workflows and their invocation name;
4. six stages, three gates, hooks, board, state, connectors, templates, and
   test evidence.

Generate the list sections from `codex/parity.json`; do not hand-maintain
duplicate counts.

- [ ] **Step 7: Run parity, integration, and drift checks**

Run:

```bash
cd codex
npm run build
npm test
npm run check:generated
```

Expected: all tests pass and generated package is current.

- [ ] **Step 8: Commit parity proof**

```bash
git add codex/scripts/check-generated.mjs codex/test/parity.test.mjs codex/test/integration.test.mjs codex/test/helpers/tree-digest.mjs codex/lib/package-plugin.mjs docs/CODEX-PARITY.md plugins/great-pm
git commit -m "test(codex): enforce full GreatPM parity"
```

---

### Task 10: Add CI and public installation documentation

**Files:**
- Create: `.github/workflows/codex-plugin-ci.yml`
- Create: `docs/CODEX.md`
- Modify: `README.md`
- Modify: `plugins/great-pm/.codex-plugin/plugin.json`

- [ ] **Step 1: Add the CI workflow**

```yaml
name: GreatPM Codex Plugin

on:
  pull_request:
  push:
    branches: [main, "codex/**"]

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Build package
        working-directory: codex
        run: npm run build
      - name: Test package and parity
        working-directory: codex
        run: npm test
      - name: Check generated package
        working-directory: codex
        run: npm run check:generated
      - name: Test shared adapters
        run: node --test adapters/test/*.test.mjs
      - name: Test shared connectors
        run: node --test connectors/test/*.test.mjs
      - name: Run GreatPM skill doctor
        run: bash scripts/great-pm-skill-doctor.sh
```

- [ ] **Step 2: Write installation documentation**

`docs/CODEX.md` must include these verified flows:

```bash
# Add the public repository marketplace
codex plugin marketplace add VandanaAjayDubey111/great-pm

# Install GreatPM
codex plugin add great-pm@great-pm

# Verify configured marketplaces and installation
codex plugin marketplace list
```

Also document:

- Codex desktop Plugins-directory installation;
- starting a new session after install or upgrade;
- hook review and trust;
- first-run project initialization;
- `$pm-help`, `$pm-start`, `$pm-resume`, `$pm-inbox`, and `$pm-board`;
- local marketplace testing;
- `codex plugin marketplace upgrade great-pm` for source refresh;
- `codex plugin remove great-pm@great-pm` for uninstall;
- reinstalling with `codex plugin add great-pm@great-pm` after an upgrade;
- troubleshooting for missing Node, untrusted hooks, missing `PROJECT.md`, and
  unavailable Beads.

- [ ] **Step 3: Update the README without weakening existing installation**

Add a Codex section that:

- identifies desktop and CLI as supported;
- links to `docs/CODEX.md`;
- states 48 agents, 79 product skills, and 34 workflows;
- explains that host invocation syntax differs while product behavior and
  human gates remain equivalent;
- preserves the existing Claude instructions.

- [ ] **Step 4: Run documentation and CI static checks**

Run:

```bash
rg -n "48 agents|79 product|34 workflows" README.md docs/CODEX.md docs/CODEX-PARITY.md
rg -n "codex plugin marketplace add|codex plugin add" docs/CODEX.md
git diff --check
```

Expected: every required phrase is present and `git diff --check` exits 0.

- [ ] **Step 5: Commit CI and documentation**

```bash
git add .github/workflows/codex-plugin-ci.yml docs/CODEX.md README.md plugins/great-pm/.codex-plugin/plugin.json
git commit -m "docs(codex): publish install and operations guide"
```

---

### Task 11: Verify local installation in Codex CLI and desktop

**Files:**
- Modify: `docs/CODEX-PARITY.md`
- Modify: `docs/CODEX.md` only if smoke testing reveals an inaccurate step

- [ ] **Step 1: Inspect the installed CLI commands**

Run:

```bash
codex plugin --help
codex plugin marketplace --help
codex plugin marketplace add --help
```

Expected: the documented marketplace, install, upgrade, and removal subcommands
match the installed CLI.

- [ ] **Step 2: Add the local repository marketplace**

Run:

```bash
codex plugin marketplace add "$(pwd)"
codex plugin marketplace list
```

Expected: `great-pm` marketplace resolves to this repository.

- [ ] **Step 3: Install the local plugin**

Run:

```bash
codex plugin add great-pm@great-pm
```

Then start a new Codex CLI session.

Expected:

- GreatPM appears in the plugin list;
- `$pm-help` is discoverable;
- `$pm-start` loads;
- hooks request trust rather than running silently.

- [ ] **Step 4: Run CLI functional smoke tests**

In a temporary product repository:

1. initialize `.great-pm/PROJECT.md`;
2. invoke `$pm-help`;
3. invoke `$pm-doctor`;
4. invoke `$pm-start` with a test product problem;
5. confirm specialist delegation begins;
6. stop at `gate:strategy`;
7. end and restart the session;
8. invoke `$pm-resume`;
9. verify `.great-pm/HANDOFF.md` and verdict state were preserved;
10. invoke `$pm-board` and verify the local board responds.

- [ ] **Step 5: Verify Codex desktop**

Using the same local marketplace:

1. install GreatPM from the Plugins directory;
2. start a new Codex task;
3. verify the same five core skills are discoverable;
4. review and trust hooks;
5. run `$pm-doctor`;
6. resume the temporary initiative;
7. confirm visible specialist activity and the human gate.

- [ ] **Step 6: Record evidence**

Update `docs/CODEX-PARITY.md` with:

- date and platform;
- CLI version;
- desktop app version;
- installation result;
- workflow result;
- hook result;
- subagent result;
- state-resume result;
- board result;
- any documented host-syntax difference.

- [ ] **Step 7: Commit smoke evidence**

```bash
git add docs/CODEX-PARITY.md docs/CODEX.md
git commit -m "test(codex): record desktop and CLI smoke results"
```

---

### Task 12: Run the release gate and commit final parity fixes

**Files:**
- Modify only files implicated by failing verification

- [ ] **Step 1: Rebuild from canonical source**

Run:

```bash
cd codex
npm run build
```

Expected: JSON reports 48 agents, 79 product skills, 34 workflows, and 26 templates.

- [ ] **Step 2: Run the complete automated suite**

Run:

```bash
cd codex
npm test
npm run check:generated
cd ..
node --test adapters/test/*.test.mjs
node --test connectors/test/*.test.mjs
bash scripts/great-pm-skill-doctor.sh
python3 /Users/vandandubey/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/great-pm
git diff --check
```

Expected:

- all Codex tests pass;
- generated package matches canonical source;
- all adapter and connector tests pass;
- skill doctor exits 0;
- plugin validation passes;
- no whitespace errors.

- [ ] **Step 3: Verify parity inventory mechanically**

Run:

```bash
node -e '
const p=require("./plugins/great-pm/codex/parity.json");
if(p.agents.length!==48) process.exit(1);
if(p.productSkills.length!==79) process.exit(1);
if(p.workflows.length!==34) process.exit(1);
if(p.templates.length!==26) process.exit(1);
if(p.stages.length!==6) process.exit(1);
if(p.gates.length!==3) process.exit(1);
console.log("FULL_PARITY_VERIFIED");
'
```

Expected: `FULL_PARITY_VERIFIED`.

- [ ] **Step 4: Confirm commit scope**

Run:

```bash
git status --short
git diff --stat main...HEAD
git log --oneline main..HEAD
```

Expected: only the design, plan, Codex plugin, shared portability corrections,
tests, CI, and documentation are present. Unrelated untracked files remain
unstaged.

- [ ] **Step 5: Commit any verification-driven corrections**

When Step 2 or Step 3 required a correction, stage the approved release
surfaces and commit:

```bash
git add codex plugins/great-pm .agents/plugins/marketplace.json .github/workflows/codex-plugin-ci.yml docs/CODEX.md docs/CODEX-PARITY.md README.md .claude-plugin/marketplace.json skills/great-pm/SKILL.md commands/pm-help.md
git commit -m "fix(codex): close full-parity release gaps"
```

When no correction was required, do not create an empty commit.

- [ ] **Step 6: Request final code review**

Invoke `requesting-code-review` against the specification and this plan. Resolve
all high-confidence functional, safety, installation, or parity findings, then
rerun Steps 1–4.

- [ ] **Step 7: Hand off the completed branch**

Report:

- branch name;
- commit list;
- automated verification totals;
- desktop and CLI smoke evidence;
- exact public Git publishing commands;
- any user action still required.
