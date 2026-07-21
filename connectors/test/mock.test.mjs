// connectors/test/mock.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConnector } from '../mock.mjs';
import { assertImplements } from '../ports.mjs';

test('mockConnector implements every verb of its capability', () => {
  assert.equal(assertImplements('docs', mockConnector('docs')), true);
  assert.equal(assertImplements('tracker', mockConnector('tracker')), true);
});

test('mock verbs echo the payload', async () => {
  const conn = mockConnector('docs');
  const out = await conn.write({ title: 'Roadmap' });
  assert.deepEqual(out, { ok: true, capability: 'docs', verb: 'write', echo: { title: 'Roadmap' }, tool: 'mock' });
});

test('mockConnector throws on unknown capability', () => {
  assert.throws(() => mockConnector('nope'), /unknown capability/);
});
