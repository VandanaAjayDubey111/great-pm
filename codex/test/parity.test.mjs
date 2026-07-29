import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderParityDoc } from '../lib/parity-doc.mjs';

test('committed package satisfies full parity counts', async () => {
  const parity = JSON.parse(
    await readFile(
      new URL('../../plugins/great-pm/codex/parity.json', import.meta.url),
      'utf8'
    )
  );
  assert.equal(parity.agents.length, 48);
  assert.equal(parity.productSkills.length, 79);
  assert.equal(parity.workflows.length, 34);
  assert.equal(parity.templates.length, 26);
  assert.deepEqual(parity.gates, ['gate:launch', 'gate:spec', 'gate:strategy']);
  assert.deepEqual(parity.stages, [
    'discover',
    'strategize',
    'prioritize',
    'define',
    'launch',
    'measure'
  ]);
});

test('human-readable parity record is generated from parity metadata', async () => {
  const parity = JSON.parse(
    await readFile(
      new URL('../../plugins/great-pm/codex/parity.json', import.meta.url),
      'utf8'
    )
  );
  const record = await readFile(
    new URL('../../docs/CODEX-PARITY.md', import.meta.url),
    'utf8'
  );
  assert.equal(record, renderParityDoc(parity));
});
