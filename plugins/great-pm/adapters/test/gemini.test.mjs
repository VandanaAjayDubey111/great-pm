// adapters/test/gemini.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { name, toolSpec, capabilityGrants, handleFunctionCall } from '../gemini/adapter.mjs';

function project(config) {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  if (config) writeFileSync(join(dir, '.great-pm', 'connectors.json'), JSON.stringify(config));
  return dir;
}

test('adapter identifies as gemini', () => assert.equal(name, 'gemini'));

test('toolSpec is a valid Gemini function declaration', () => {
  const t = toolSpec();
  assert.equal(t.name, 'great_pm_connect');
  assert.equal(t.parameters.type, 'OBJECT');
  assert.ok(t.parameters.properties.capability.enum.includes('docs'));
  assert.deepEqual(t.parameters.required, ['capability', 'verb']);
});

test('capabilityGrants returns a function_declarations group for non-empty capabilities', () => {
  const grants = capabilityGrants(['docs', 'tracker']);
  assert.equal(grants.length, 1);
  assert.equal(grants[0].function_declarations[0].name, 'great_pm_connect');
  assert.deepEqual(capabilityGrants([]), []);
});

test('handleFunctionCall routes a functionCall into the engine and returns a structured object', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'auto' } });
  const out = await handleFunctionCall(
    { name: 'great_pm_connect', args: { capability: 'docs', verb: 'write', payload: { title: 'X' } } },
    { projectDir: dir },
  );
  assert.equal(typeof out, 'object'); // structured, not a JSON string
  assert.equal(out.status, 'done');
  assert.equal(out.result.echo.title, 'X');
});

test('handleFunctionCall reaches the real notion connector path (fails loud without token)', async () => {
  const dir = project({ docs: { tool: 'notion', write: 'auto', parent: 'p' } });
  await assert.rejects(
    () => handleFunctionCall(
      { name: 'great_pm_connect', args: { capability: 'docs', verb: 'write', payload: { title: 'X' } } },
      { projectDir: dir },
    ),
    /missing required secret: NOTION_TOKEN/,
  );
});

test('handleFunctionCall rejects an unknown tool', async () => {
  await assert.rejects(() => handleFunctionCall({ name: 'other', args: {} }), /unknown tool/);
});
