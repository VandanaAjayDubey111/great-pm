import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, access, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from '../lib/package-plugin.mjs';

test('shared runtime assets are packaged', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-runtime-'));
  try {
    await packagePlugin({
      sourceRoot: new URL('../../', import.meta.url),
      outputRoot: temp
    });
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
