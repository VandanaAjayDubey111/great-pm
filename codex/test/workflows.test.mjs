import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('all 34 workflows are installable Codex skills', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-workflows-'));
  try {
    await packagePlugin({
      sourceRoot: new URL('../../', import.meta.url),
      outputRoot: temp
    });
    const parity = JSON.parse(
      await readFile(path.join(temp, 'codex/parity.json'), 'utf8')
    );
    assert.equal(parity.workflows.length, 34);
    assert.ok(parity.workflows.includes('grill-me'));
    assert.ok(!parity.workflows.includes('pm-grill'));
    for (const name of parity.workflows) {
      const directory = path.join(temp, 'skills', name);
      const text = await readFile(path.join(directory, 'SKILL.md'), 'utf8');
      assert.match(text, new RegExp(`^---\\nname: ${name}\\n`, 'm'));
      assert.match(text, /## Codex host binding/);
      assert.match(text, /read the `great-pm-runtime` skill/);
      assert.match(text, /Never call a wait tool until a spawn has returned/);
      assert.match(text, /task_name.*agent_name/);
      assert.match(text, /hyphens with underscores/);
      assert.doesNotMatch(text, /Set `task_name` to the exact canonical role name/);
      assert.doesNotMatch(text, /model: opus/);
      assert.doesNotMatch(text, /allowed-tools:/);
      assert.doesNotMatch(text, /CLAUDE_PLUGIN_ROOT/);
      assert.doesNotMatch(text, /\$HOME\/great-pm\//);

      const ui = await readFile(path.join(directory, 'agents', 'openai.yaml'), 'utf8');
      const displayName = name === 'grill-me'
        ? 'GreatPM: Grill Me'
        : 'GreatPM workflow';
      assert.ok(ui.includes(`display_name: "${displayName}"`));
      assert.ok(
        ui.includes(
          `default_prompt: "Use $${name} on my current product initiative."`
        )
      );
      assert.match(ui, /allow_implicit_invocation: true/);
    }
    const skillDirs = await readdir(path.join(temp, 'skills'));
    assert.deepEqual(
      parity.workflows.filter((name) => skillDirs.includes(name)),
      parity.workflows
    );

    const grillUi = await readFile(
      path.join(temp, 'skills', 'grill-me', 'agents', 'openai.yaml'),
      'utf8'
    );
    assert.match(grillUi, /display_name: "GreatPM: Grill Me"/);
    assert.match(grillUi, /default_prompt: "Use \$grill-me/);

    for (const workflow of ['grill-me', 'pm-help', 'pm-start']) {
      const text = await readFile(
        path.join(temp, 'skills', workflow, 'SKILL.md'),
        'utf8'
      );
      assert.match(text, /\$grill-me/);
      assert.doesNotMatch(text, /(?<![A-Za-z0-9_-])\/grill-me\b/);
    }

    const grillSkill = await readFile(
      path.join(temp, 'skills', 'grill-me', 'SKILL.md'),
      'utf8'
    );
    assert.match(grillSkill, /\$\{PLUGIN_ROOT\}\/agents\/grill-me\.md/);
    assert.doesNotMatch(grillSkill, /agents\$grill-me\.md/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('Claude and Codex use grill-me as the workflow name', async () => {
  const root = new URL('../../', import.meta.url);
  const commandNames = (await readdir(new URL('commands/', root)))
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -3));

  assert.ok(commandNames.includes('grill-me'));
  assert.ok(!commandNames.includes('pm-grill'));

  const references = await Promise.all([
    readFile(new URL('commands/grill-me.md', root), 'utf8'),
    readFile(new URL('commands/pm-help.md', root), 'utf8'),
    readFile(new URL('commands/pm-start.md', root), 'utf8'),
    readFile(new URL('agents/grill-me.md', root), 'utf8')
  ]);
  for (const text of references) {
    assert.doesNotMatch(text, /pm-grill/);
  }
});
