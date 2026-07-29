import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('manifest exposes GreatPM as a Codex plugin', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-manifest-'));
  try {
    await packagePlugin({
      sourceRoot: new URL('../../', import.meta.url),
      outputRoot: temp
    });
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
