// adapters/test/adapter.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { name, capabilityGrants, dispatch } from '../claude/adapter.mjs';

function project(config) {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  if (config) writeFileSync(join(dir, '.great-pm', 'connectors.json'), JSON.stringify(config));
  return dir;
}

test('adapter identifies as claude', () => {
  assert.equal(name, 'claude');
});

test('capabilityGrants returns the uniform connect grant for non-empty capabilities', () => {
  assert.deepEqual(capabilityGrants(['docs', 'tracker']), ['Bash(great-pm connect:*)']);
  assert.deepEqual(capabilityGrants([]), []);
});

test('dispatch routes connect into the engine (mock, auto)', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'auto' } });
  const out = await dispatch(['connect', 'docs', 'write', '--json', '{"t":1}'], { projectDir: dir });
  assert.equal(out.status, 'done');
  assert.equal(out.result.echo.t, 1);
});

test('dispatch routes setup', async () => {
  const out = await dispatch(['setup', 'notion'], { projectDir: project() });
  assert.equal(out.status, 'guide');
  assert.equal(out.tool, 'notion');
});

test('dispatch throws on an unknown subcommand', async () => {
  await assert.rejects(() => dispatch(['frobnicate'], { projectDir: project() }), /unknown command/);
});
