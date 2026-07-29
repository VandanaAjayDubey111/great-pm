// connectors/test/ports.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAPABILITIES, classify, isWrite, assertImplements } from '../ports.mjs';

test('classify identifies reads and writes', () => {
  assert.equal(classify('docs', 'read'), 'read');
  assert.equal(classify('docs', 'write'), 'write');
  assert.equal(isWrite('comms', 'post'), true);
  assert.equal(isWrite('analytics', 'query'), false);
});

test('classify throws on unknown capability or verb', () => {
  assert.throws(() => classify('nope', 'read'), /unknown capability/);
  assert.throws(() => classify('docs', 'frobnicate'), /unknown verb/);
});

test('assertImplements passes for a complete connector and fails for a partial one', () => {
  const complete = { read: () => {}, list: () => {}, write: () => {} };
  assert.equal(assertImplements('docs', complete), true);
  const partial = { read: () => {} }; // missing list, write
  assert.throws(() => assertImplements('docs', partial), /missing verb/);
});

test('every capability declares at least one verb', () => {
  for (const [name, cap] of Object.entries(CAPABILITIES)) {
    assert.ok([...cap.read, ...cap.write].length > 0, `${name} has no verbs`);
  }
});
