// adapters/test/openai.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { name, toolSpec, capabilityGrants, handleToolCall } from '../openai/adapter.mjs';

function project(config) {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  if (config) writeFileSync(join(dir, '.great-pm', 'connectors.json'), JSON.stringify(config));
  return dir;
}

test('adapter identifies as openai', () => assert.equal(name, 'openai'));

test('toolSpec is a valid OpenAI function tool', () => {
  const t = toolSpec();
  assert.equal(t.type, 'function');
  assert.equal(t.function.name, 'great_pm_connect');
  assert.ok(t.function.parameters.properties.capability.enum.includes('docs'));
  assert.deepEqual(t.function.parameters.required, ['capability', 'verb']);
});

test('capabilityGrants returns the tool for non-empty capabilities', () => {
  const grants = capabilityGrants(['docs', 'tracker']);
  assert.equal(grants.length, 1);
  assert.equal(grants[0].function.name, 'great_pm_connect');
  assert.deepEqual(capabilityGrants([]), []);
});

test('handleToolCall routes a function call into the engine (mock, auto)', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'auto' } });
  const out = await handleToolCall(
    { function: { name: 'great_pm_connect', arguments: JSON.stringify({ capability: 'docs', verb: 'write', payload: { title: 'X' } }) } },
    { projectDir: dir },
  );
  const parsed = JSON.parse(out);
  assert.equal(parsed.status, 'done');
  assert.equal(parsed.result.echo.title, 'X');
});

test('handleToolCall accepts already-parsed object arguments', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'auto' } });
  const out = await handleToolCall(
    { name: 'great_pm_connect', arguments: { capability: 'docs', verb: 'read', payload: {} } },
    { projectDir: dir },
  );
  assert.equal(JSON.parse(out).status, 'done');
});

test('handleToolCall reaches the real notion connector path (fails loud without token)', async () => {
  const dir = project({ docs: { tool: 'notion', write: 'auto', parent: 'p' } });
  await assert.rejects(
    () => handleToolCall(
      { function: { name: 'great_pm_connect', arguments: JSON.stringify({ capability: 'docs', verb: 'write', payload: { title: 'X' } }) } },
      { projectDir: dir },
    ),
    /missing required secret: NOTION_TOKEN/,
  );
});

test('handleToolCall rejects an unknown tool', async () => {
  await assert.rejects(() => handleToolCall({ function: { name: 'other', arguments: '{}' } }), /unknown tool/);
});
