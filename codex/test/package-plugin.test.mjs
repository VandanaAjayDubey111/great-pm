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
