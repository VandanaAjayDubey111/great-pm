// connectors/test/setup.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { tokenUrl, writeSecret } from '../setup.mjs';

test('tokenUrl returns the create-token page for a known tool', () => {
  assert.match(tokenUrl('notion'), /notion\.so/);
  assert.throws(() => tokenUrl('unknown-tool'), /no setup guide/);
});

test('writeSecret appends KEY=VALUE to .great-pm/secrets.env', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  writeSecret(dir, 'NOTION_TOKEN', 'secret-xyz');
  const txt = readFileSync(join(dir, '.great-pm', 'secrets.env'), 'utf8');
  assert.match(txt, /NOTION_TOKEN=secret-xyz/);
});
