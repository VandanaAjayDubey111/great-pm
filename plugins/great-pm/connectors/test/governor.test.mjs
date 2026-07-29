// connectors/test/governor.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { decide, audit } from '../governor.mjs';

const base = { capability: 'docs', verb: 'write', payload: {}, projectDir: '/tmp' };

test('reads always allow regardless of mode', () => {
  assert.equal(decide({ ...base, verb: 'read', mode: 'ask' }).decision, 'allow');
});

test('auto allows a normal write', () => {
  assert.equal(decide({ ...base, mode: 'auto' }).decision, 'allow');
});

test('ask and gate propose (defer) a write', () => {
  assert.equal(decide({ ...base, mode: 'ask' }).decision, 'propose');
  assert.equal(decide({ ...base, mode: 'gate' }).decision, 'propose');
});

test('kill-switch forces propose even in auto', () => {
  process.env.GREATPM_WRITES = 'off';
  assert.equal(decide({ ...base, mode: 'auto' }).decision, 'propose');
  delete process.env.GREATPM_WRITES;
});

test('destructive write always proposes even in auto', () => {
  const v = decide({ ...base, mode: 'auto', payload: { destructive: true } });
  assert.equal(v.decision, 'propose');
  assert.match(v.reason, /destructive/);
});

test('repo commit to protected branch always proposes even in auto', () => {
  const onMain = decide({ capability: 'repo', verb: 'commit', mode: 'auto', payload: { branch: 'main' } });
  assert.equal(onMain.decision, 'propose');
  const onFeature = decide({ capability: 'repo', verb: 'commit', mode: 'auto', payload: { branch: 'gpm/work' } });
  assert.equal(onFeature.decision, 'allow');
});

test('audit appends a JSON line to .great-pm/connectors/audit.log', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  audit({ capability: 'docs', verb: 'write', decision: 'allow' }, dir);
  const logPath = join(dir, '.great-pm', 'connectors', 'audit.log');
  assert.equal(existsSync(logPath), true);
  const line = JSON.parse(readFileSync(logPath, 'utf8').trim());
  assert.equal(line.capability, 'docs');
});

test('an always-destructive op asks even in auto (governed, not caller-trusted)', () => {
  assert.equal(decide({ capability: 'tracker', verb: 'delete', mode: 'auto' }).decision, 'propose');
  assert.equal(decide({ capability: 'repo', verb: 'force-push', mode: 'auto' }).decision, 'propose');
});

test('audit redacts token-like secrets from the log', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  audit({ capability: 'docs', verb: 'write', result: { leaked: 'ntn_ABCDEFGHIJ0123456789' } }, dir);
  const txt = readFileSync(join(dir, '.great-pm', 'connectors', 'audit.log'), 'utf8');
  assert.match(txt, /\[REDACTED\]/);
  assert.doesNotMatch(txt, /ntn_ABCDEFGHIJ/);
});
