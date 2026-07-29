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
      assert.doesNotMatch(text, /model: opus/);
      assert.doesNotMatch(text, /allowed-tools:/);

      const ui = await readFile(path.join(directory, 'agents', 'openai.yaml'), 'utf8');
      assert.match(ui, /display_name: "GreatPM workflow"/);
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
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
