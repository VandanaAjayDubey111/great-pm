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
    for (const name of parity.workflows) {
      const directory = path.join(temp, 'skills', name);
      const text = await readFile(path.join(directory, 'SKILL.md'), 'utf8');
      assert.match(text, new RegExp(`^---\\nname: ${name}\\n`, 'm'));
      assert.match(text, /## Codex host binding/);
      assert.match(text, /read the `great-pm-runtime` skill/);
      assert.match(text, /Never call a wait tool until a spawn has returned/);
      assert.match(text, /task_name.*exact canonical role name/i);
      assert.doesNotMatch(text, /model: opus/);
      assert.doesNotMatch(text, /allowed-tools:/);
      assert.doesNotMatch(text, /CLAUDE_PLUGIN_ROOT/);
      assert.doesNotMatch(text, /\$HOME\/great-pm\//);

      const ui = await readFile(path.join(directory, 'agents', 'openai.yaml'), 'utf8');
      const displayName = name === 'pm-grill'
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
      path.join(temp, 'skills', 'pm-grill', 'agents', 'openai.yaml'),
      'utf8'
    );
    assert.match(grillUi, /display_name: "GreatPM: Grill Me"/);
    assert.match(grillUi, /default_prompt: "Use \$pm-grill/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
