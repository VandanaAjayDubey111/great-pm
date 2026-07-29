// connectors/test/analytics.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { csvAnalytics, amplitudeAnalytics } from '../analytics.mjs';

function csvFile(content) {
  const dir = mkdtempSync(join(tmpdir(), 'gpm-'));
  const p = join(dir, 'metrics.csv');
  writeFileSync(p, content);
  return { p, dir };
}

test('csv query returns a metric series', async () => {
  const { p } = csvFile('date,active_users,new_users\n2026-01-01,100,10\n2026-01-02,120,15\n');
  const out = await csvAnalytics({ path: p }).query({ metric: 'active_users' });
  assert.equal(out.source, 'csv');
  assert.deepEqual(out.series, [{ date: '2026-01-01', value: 100 }, { date: '2026-01-02', value: 120 }]);
});

test('csv query filters by window', async () => {
  const { p } = csvFile('date,active_users\n2026-01-01,100\n2026-02-01,200\n2026-03-01,300\n');
  const out = await csvAnalytics({ path: p }).query({ metric: 'active_users', window: { start: '2026-02-01', end: '2026-02-28' } });
  assert.deepEqual(out.series, [{ date: '2026-02-01', value: 200 }]);
});

test('csv query errors on an unknown column', async () => {
  const { p } = csvFile('date,active_users\n2026-01-01,100\n');
  await assert.rejects(() => csvAnalytics({ path: p }).query({ metric: 'revenue' }), /no column 'revenue'/);
});

test('csv rejects a relative path that escapes the project dir (traversal guard)', () => {
  const { dir } = csvFile('date,active_users\n2026-01-01,1\n');
  assert.throws(() => csvAnalytics({ path: '../../../../etc/passwd', projectDir: dir }), /escapes the project directory/);
});

test('amplitude query maps a canonical metric to the API and parses the series', async () => {
  const calls = [];
  const f = async (url) => { calls.push(url); return { ok: true, json: async () => ({ data: { xValues: ['2026-01-01'], series: [[100]] } }) }; };
  const out = await amplitudeAnalytics({ apiKey: 'k', secretKey: 's', fetch: f }).query({ metric: 'active_users', window: { start: '2026-01-01', end: '2026-01-31' } });
  assert.equal(out.source, 'amplitude');
  assert.deepEqual(out.series, [{ date: '2026-01-01', value: 100 }]);
  assert.match(calls[0], /m=active/);
  assert.match(calls[0], /start=20260101/);
});

test('amplitude retries on 429 then succeeds', async () => {
  let n = 0;
  const f = async () => {
    n++;
    return n === 1
      ? { status: 429, headers: { get: () => '0' }, json: async () => ({}) }
      : { ok: true, json: async () => ({ data: { xValues: ['2026-01-01'], series: [[5]] } }) };
  };
  const out = await amplitudeAnalytics({ apiKey: 'k', secretKey: 's', fetch: f, sleep: () => {} }).query({ metric: 'active_users' });
  assert.equal(out.series[0].value, 5);
  assert.equal(n, 2);
});

test('amplitude query errors on an unknown metric', async () => {
  await assert.rejects(() => amplitudeAnalytics({ apiKey: 'k', secretKey: 's', fetch: async () => ({}) }).query({ metric: 'foo' }), /unknown analytics metric/);
});

test('amplitude uses the EU host when dataCenter is eu', async () => {
  const calls = [];
  const f = async (url) => { calls.push(url); return { ok: true, json: async () => ({ data: { xValues: [], series: [[]] } }) }; };
  await amplitudeAnalytics({ apiKey: 'k', secretKey: 's', dataCenter: 'eu', fetch: f }).query({ metric: 'active_users' });
  assert.match(calls[0], /analytics\.eu\.amplitude\.com/);
});

test('amplitude requires both keys', () => {
  assert.throws(() => amplitudeAnalytics({ apiKey: 'k' }), /requires AMPLITUDE_API_KEY/);
});
