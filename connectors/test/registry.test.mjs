// connectors/test/registry.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadConfig, loadSecrets, requireSecret } from '../registry.mjs';

function tmpProject() {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  return dir;
}

test('loadConfig returns safe defaults when no file exists (writes start in ask)', () => {
  const cfg = loadConfig(tmpProject());
  assert.equal(cfg.docs.write, 'ask');
  assert.equal(cfg.tracker.tool, 'beads');
});

test('loadConfig merges user file over defaults', () => {
  const dir = tmpProject();
  writeFileSync(join(dir, '.great-pm', 'connectors.json'),
    JSON.stringify({ docs: { tool: 'notion', write: 'gate' } }));
  const cfg = loadConfig(dir);
  assert.equal(cfg.docs.tool, 'notion');
  assert.equal(cfg.docs.write, 'gate');
  assert.equal(cfg.repo.write, 'ask'); // safe default preserved
});

test('loadConfig throws on malformed JSON', () => {
  const dir = tmpProject();
  writeFileSync(join(dir, '.great-pm', 'connectors.json'), '{ not json');
  assert.throws(() => loadConfig(dir), /invalid connectors.json/);
});

test('loadSecrets parses KEY=VALUE and ignores comments/blanks', () => {
  const dir = tmpProject();
  writeFileSync(join(dir, '.great-pm', 'secrets.env'), '# comment\n\nNOTION_TOKEN=abc123\n');
  const s = loadSecrets(dir);
  assert.equal(s.NOTION_TOKEN, 'abc123');
});

test('requireSecret throws fail-loud when absent', () => {
  assert.throws(() => requireSecret({}, 'NOTION_TOKEN'), /missing required secret: NOTION_TOKEN/);
  assert.equal(requireSecret({ NOTION_TOKEN: 'x' }, 'NOTION_TOKEN'), 'x');
});
