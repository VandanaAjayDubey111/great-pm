import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('all 48 specialist roles are packaged for Codex subagents', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-agents-'));
  try {
    await packagePlugin({
      sourceRoot: new URL('../../', import.meta.url),
      outputRoot: temp
    });
    const parity = JSON.parse(
      await readFile(path.join(temp, 'codex/parity.json'), 'utf8')
    );
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

test('Codex uses exact Claude specialist names for spawned tasks', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-agent-names-'));
  try {
    await packagePlugin({
      sourceRoot: new URL('../../', import.meta.url),
      outputRoot: temp
    });
    const runtime = await readFile(
      path.join(temp, 'skills', 'great-pm-runtime', 'SKILL.md'),
      'utf8'
    );
    const grillMe = await readFile(
      path.join(temp, 'agents', 'grill-me.md'),
      'utf8'
    );

    assert.match(runtime, /task_name.*exact canonical role name/i);
    assert.match(runtime, /`grill-me`, never `grill`/);
    assert.match(grillMe, /^name: grill-me$/m);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
