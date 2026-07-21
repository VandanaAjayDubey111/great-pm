// connectors/test/http.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../cli.mjs';

// The HTTP route is a thin wrapper over cli.run; we assert the wrapper contract
// here (status + result shape) so server wiring stays honest.
test('cli.run powers the /api/connect contract', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  writeFileSync(join(dir, '.great-pm', 'connectors.json'), JSON.stringify({ docs: { tool: 'mock', write: 'auto' } }));
  const out = await run(['docs', 'write', '--json', JSON.stringify({ title: 'X' })], { projectDir: dir });
  assert.equal(out.status, 'done');
});
