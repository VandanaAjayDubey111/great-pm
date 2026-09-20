import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, access, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packagePlugin } from '../lib/package-plugin.mjs';

async function supportingFiles(root, relative = '') {
  const result = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const file = path.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await supportingFiles(root, file));
    else if (entry.isFile() && entry.name !== 'SKILL.md') result.push(file);
  }
  return result;
}

test('every skill supporting file survives packaging with its canonical content', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-supporting-files-'));
  const sourceRoot = new URL('../../', import.meta.url);
  try {
    await packagePlugin({ sourceRoot, outputRoot: temp });
    const files = await supportingFiles(fileURLToPath(new URL('skills/', sourceRoot)));
    assert.ok(files.includes('great-pm/WORKFLOW.md'));
    for (const relative of files) {
      const packaged = relative.replace(/^pm-audit\//, 'method-pm-audit/');
      assert.deepEqual(
        await readFile(path.join(temp, 'skills', packaged)),
        await readFile(new URL(`skills/${relative}`, sourceRoot)),
        relative
      );
    }
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

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
    const sessionStart = await readFile(
      path.join(temp, 'scripts/great-pm-session-start.sh'),
      'utf8'
    );
    const startSkill = await readFile(
      path.join(temp, 'skills/pm-start/SKILL.md'),
      'utf8'
    );
    assert.match(sessionStart, /\$\{PLUGIN_ROOT:-\$\{CLAUDE_PLUGIN_ROOT/);
    assert.doesNotMatch(startSkill, /~\/great-pm\//);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
