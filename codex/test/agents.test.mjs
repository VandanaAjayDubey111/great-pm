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
    const taskNames = new Set();
    for (const name of parity.agents) {
      const text = await readFile(path.join(temp, 'agents', `${name}.md`), 'utf8');
      assert.match(text, new RegExp(`^---\\nname: ${name}\\n`, 'm'));
      assert.match(text, /## Codex role binding/);
      assert.doesNotMatch(text, /^model:/m);
      assert.doesNotMatch(text, /^tools:/m);
      const taskName = text.match(/Internal task identifier: `([^`]+)`/)?.[1];
      assert.ok(taskName, `Missing internal identifier for ${name}`);
      assert.match(taskName, /^[a-z0-9_]+$/);
      assert.equal(taskName, name.replaceAll('-', '_'));
      assert.equal(taskName.replaceAll('_', '-'), name);
      assert.ok(!taskNames.has(taskName), `Duplicate internal identifier: ${taskName}`);
      taskNames.add(taskName);
    }
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('Codex separates internal task identifiers from canonical specialist names', async () => {
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

    assert.match(runtime, /query-refiner-pm.*query_refiner_pm/);
    assert.match(runtime, /task_name.*agent_name/);
    assert.match(runtime, /filenames.*verdict logs/);
    assert.doesNotMatch(runtime, /Set `task_name` to the exact canonical role name/);
    assert.match(runtime, /`grill-me`, never `grill`/);
    assert.match(grillMe, /^name: grill-me$/m);
    assert.match(grillMe, /\.great-pm\/verdicts\/grill-me\.log/);
    assert.doesNotMatch(grillMe, /verdicts\$grill-me\.log/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
