import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { diagnose } from '../runtime/doctor.mjs';

test('doctor reports an uninitialized product workspace', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-doctor-'));
  try {
    const result = await diagnose(temp);
    assert.equal(result.ok, false);
    assert.deepEqual(result.missing, ['.great-pm/PROJECT.md']);
    assert.match(result.next, /templates\/PROJECT\.md\.template/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('doctor accepts an initialized product workspace', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-doctor-'));
  try {
    await mkdir(path.join(temp, '.great-pm'), { recursive: true });
    await writeFile(path.join(temp, '.great-pm/PROJECT.md'), '# Product\n');
    const result = await diagnose(temp);
    assert.equal(result.ok, true);
    assert.deepEqual(result.missing, []);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
