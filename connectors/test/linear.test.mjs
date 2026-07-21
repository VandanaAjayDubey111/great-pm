// connectors/test/linear.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearConnector } from '../linear.mjs';

// Token-free fake of Linear's GraphQL endpoint. `handler(body)` (body={query,variables})
// returns { status?, headers?, json }. All requests captured on f.calls.
function stub(handler) {
  const calls = [];
  const f = async (url, opts = {}) => {
    const body = JSON.parse(opts.body);
    calls.push(body);
    const r = handler(body) || {};
    return { ok: r.ok ?? true, status: r.status ?? 200, headers: { get: (k) => (r.headers || {})[k] ?? null }, json: async () => r.json ?? { data: {} } };
  };
  f.calls = calls;
  return f;
}
const conn = (f) => linearConnector({ token: 't', team: 'TEAM1', fetch: f, sleep: () => {} });

test('upsert without id creates a new issue under the team', async () => {
  const f = stub((b) => /issueCreate/.test(b.query) ? { json: { data: { issueCreate: { issue: { id: 'I1', url: 'http://x/I1', updatedAt: '2026-01-01' } } } } } : {});
  const out = await conn(f).upsert({ title: 'New' });
  assert.equal(out.created, true);
  assert.equal(out.id, 'I1');
  assert.equal(f.calls[0].variables.input.teamId, 'TEAM1');
});

test('upsert with id and unchanged remote updates the issue', async () => {
  const f = stub((b) => {
    if (/issue\(id/.test(b.query)) return { json: { data: { issue: { id: 'I1', title: 'Old', description: '', updatedAt: '2026-01-01T00:00:00Z', state: { name: 'Todo' } } } } };
    if (/issueUpdate/.test(b.query)) return { json: { data: { issueUpdate: { issue: { id: 'I1', updatedAt: '2026-02-01T00:00:00Z' } } } } };
    return {};
  });
  const out = await conn(f).upsert({ id: 'I1', title: 'New', baseUpdatedAt: '2026-01-01T00:00:00Z' });
  assert.equal(out.updated, true);
});

test('upsert surfaces a conflict (no overwrite) when remote changed since base', async () => {
  const f = stub((b) => /issue\(id/.test(b.query)
    ? { json: { data: { issue: { id: 'I1', title: 'Remote edit', description: 'r', updatedAt: '2026-03-01T00:00:00Z', state: { name: 'Doing' } } } } } : {});
  const out = await conn(f).upsert({ id: 'I1', title: 'My edit', baseUpdatedAt: '2026-01-01T00:00:00Z' });
  assert.equal(out.conflict, true);
  assert.equal(out.remote.title, 'Remote edit');
  assert.ok(!f.calls.some((c) => /issueUpdate/.test(c.query)), 'must not call issueUpdate on conflict');
});

test('list paginates via GraphQL cursors', async () => {
  const f = stub((b) => {
    if (!/issues\(/.test(b.query)) return {};
    return b.variables.after === 'c2'
      ? { json: { data: { issues: { nodes: [{ id: 'I2', title: 'B', updatedAt: '2026-01-02', state: { name: 'Done' } }], pageInfo: { hasNextPage: false } } } } }
      : { json: { data: { issues: { nodes: [{ id: 'I1', title: 'A', updatedAt: '2026-01-01', state: { name: 'Todo' } }], pageInfo: { hasNextPage: true, endCursor: 'c2' } } } } };
  });
  const out = await conn(f).list({});
  assert.deepEqual(out.items.map((i) => i.title), ['A', 'B']);
});

test('retries on 429 then succeeds', async () => {
  let n = 0;
  const f = stub((b) => {
    if (/issue\(id/.test(b.query)) { n++; return n === 1 ? { status: 429, headers: { 'retry-after': '0' } } : { json: { data: { issue: { id: 'I1', title: 'X', description: '', updatedAt: '2026-01-01', state: { name: 'Todo' } } } } }; }
    return {};
  });
  const out = await conn(f).get({ id: 'I1' });
  assert.equal(out.id, 'I1');
  assert.equal(n, 2);
});

test('retries on Linear GraphQL RATELIMITED (400 + extensions.code) then succeeds', async () => {
  let n = 0;
  const f = stub((b) => {
    if (/issue\(id/.test(b.query)) { n++; return n === 1 ? { json: { errors: [{ message: 'rate limited', extensions: { code: 'RATELIMITED' } }] } } : { json: { data: { issue: { id: 'I1', title: 'X', description: '', updatedAt: '2026-01-01', state: { name: 'Todo' } } } } }; }
    return {};
  });
  const out = await conn(f).get({ id: 'I1' });
  assert.equal(out.id, 'I1');
  assert.equal(n, 2);
});

test('connector requires a token', () => {
  assert.throws(() => linearConnector({ team: 'T' }), /requires a token/);
});
