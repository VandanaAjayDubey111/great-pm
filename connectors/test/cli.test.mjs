// connectors/test/cli.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../cli.mjs';

function project(config) {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  mkdirSync(join(dir, '.great-pm'), { recursive: true });
  if (config) writeFileSync(join(dir, '.great-pm', 'connectors.json'), JSON.stringify(config));
  return dir;
}

test('a write in auto mode executes against the mock and returns done', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'auto' } });
  const out = await run(['docs', 'write', '--json', '{"title":"X"}'], { projectDir: dir });
  assert.equal(out.status, 'done');
  assert.equal(out.result.echo.title, 'X');
  assert.equal(existsSync(join(dir, '.great-pm', 'connectors', 'audit.log')), true);
});

test('a write in ask mode is proposed, not executed', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'ask' } });
  const out = await run(['docs', 'write', '--json', '{"title":"X"}'], { projectDir: dir });
  assert.equal(out.status, 'proposed');
});

test('a read always executes', async () => {
  const dir = project({ docs: { tool: 'mock', write: 'ask' } });
  const out = await run(['docs', 'read', '--json', '{"q":"hi"}'], { projectDir: dir });
  assert.equal(out.status, 'done');
});

test('missing capability/verb throws a usage error', async () => {
  await assert.rejects(() => run(['docs'], { projectDir: project() }), /usage:/);
});

test('a docs write routed to notion fails loud without a token', async () => {
  const dir = project({ docs: { tool: 'notion', write: 'auto', parent: 'p1' } });
  await assert.rejects(
    () => run(['docs', 'write', '--json', '{"title":"X"}'], { projectDir: dir }),
    /missing required secret: NOTION_TOKEN/,
  );
});

test('a comms post routed to slack fails loud without a token', async () => {
  const dir = project({ comms: { tool: 'slack', write: 'auto', channel: 'C1' } });
  await assert.rejects(
    () => run(['comms', 'post', '--json', '{"text":"hi"}'], { projectDir: dir }),
    /missing required secret: SLACK_TOKEN/,
  );
});

test('a tracker upsert routed to linear fails loud without a token', async () => {
  const dir = project({ tracker: { tool: 'linear', write: 'auto', team: 'T' } });
  await assert.rejects(
    () => run(['tracker', 'upsert', '--json', '{"title":"X"}'], { projectDir: dir }),
    /missing required secret: LINEAR_TOKEN/,
  );
});

test('an analytics query routed to csv works end-to-end (read-only, no token)', async () => {
  const dir = project();
  const csv = join(dir, 'm.csv');
  writeFileSync(csv, 'date,active_users\n2026-01-01,42\n');
  writeFileSync(join(dir, '.great-pm', 'connectors.json'), JSON.stringify({ analytics: { tool: 'csv', path: csv } }));
  const out = await run(['analytics', 'query', '--json', '{"metric":"active_users"}'], { projectDir: dir });
  assert.equal(out.status, 'done');
  assert.equal(out.result.series[0].value, 42);
});
