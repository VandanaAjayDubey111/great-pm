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
