// connectors/test/jira.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jiraConnector } from '../jira.mjs';

// Token-free fake of Jira REST v3. `handler({method,path,body})` returns
// { ok?, status?, headers?, body? }; serialized via res.text() (Jira PUT is 204/empty).
function stub(handler) {
  const calls = [];
  const f = async (url, opts = {}) => {
    const method = opts.method || 'GET';
    const path = url.replace(/^https:\/\/[^/]+\/rest\/api\/3/, '');
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    calls.push({ method, path, body });
    const r = handler({ method, path, body }) || {};
    return { ok: r.ok ?? true, status: r.status ?? 200, headers: { get: (k) => (r.headers || {})[k] ?? null }, text: async () => (r.body != null ? JSON.stringify(r.body) : '') };
  };
  f.calls = calls;
  return f;
}
const conn = (f) => jiraConnector({ site: 'acme', email: 'me@acme.co', token: 't', project: 'PM', fetch: f, sleep: () => {} });

test('upsert without id creates an issue in the project (ADF body)', async () => {
  const f = stub(({ method, path }) => method === 'POST' && path === '/issue' ? { body: { id: '1', key: 'PM-1' } } : {});
  const out = await conn(f).upsert({ title: 'New', body: 'desc' });
  assert.equal(out.created, true);
  assert.equal(out.id, 'PM-1');
  assert.equal(f.calls[0].body.fields.project.key, 'PM');
  assert.equal(f.calls[0].body.fields.description.type, 'doc');
});

test('upsert with id and unchanged remote updates the issue', async () => {
  const f = stub(({ method, path }) => {
    if (method === 'GET' && path.startsWith('/issue/PM-1')) return { body: { key: 'PM-1', fields: { summary: 'Old', description: null, updated: '2026-01-01T00:00:00Z', status: { name: 'To Do' } } } };
    if (method === 'PUT' && path === '/issue/PM-1') return { status: 204 };
    return {};
  });
  const out = await conn(f).upsert({ id: 'PM-1', title: 'New', baseUpdatedAt: '2026-01-01T00:00:00Z' });
  assert.equal(out.updated, true);
});

test('upsert surfaces a conflict (no PUT) when remote changed since base', async () => {
  const f = stub(({ method, path }) => method === 'GET' && path.startsWith('/issue/PM-1')
    ? { body: { key: 'PM-1', fields: { summary: 'Theirs', description: null, updated: '2026-05-01T00:00:00Z', status: { name: 'Doing' } } } } : {});
  const out = await conn(f).upsert({ id: 'PM-1', title: 'Mine', baseUpdatedAt: '2026-01-01T00:00:00Z' });
  assert.equal(out.conflict, true);
  assert.equal(out.remote.title, 'Theirs');
  assert.ok(!f.calls.some((c) => c.method === 'PUT'), 'must not PUT on conflict');
});

test('list paginates via nextPageToken (POST /search/jql)', async () => {
  const f = stub(({ method, path, body }) => {
    if (!(method === 'POST' && path === '/search/jql')) return {};
    return body.nextPageToken === 'p2'
      ? { body: { issues: [{ key: 'PM-2', fields: { summary: 'B', status: { name: 'Done' }, updated: '2026-01-02' } }] } }
      : { body: { issues: [{ key: 'PM-1', fields: { summary: 'A', status: { name: 'To Do' }, updated: '2026-01-01' } }], nextPageToken: 'p2' } };
  });
  const out = await conn(f).list({});
  assert.deepEqual(out.items.map((i) => i.id), ['PM-1', 'PM-2']);
});

test('create uses the configured issue type (default Task)', async () => {
  const f = stub(({ method, path }) => method === 'POST' && path === '/issue' ? { body: { key: 'PM-9' } } : {});
  await jiraConnector({ site: 'acme', email: 'm@a.co', token: 't', project: 'PM', issuetype: 'Story', fetch: f, sleep: () => {} }).upsert({ title: 'X' });
  assert.equal(f.calls[0].body.fields.issuetype.name, 'Story');
});

test('retries on 429 then succeeds', async () => {
  let n = 0;
  const f = stub(({ method, path }) => {
    if (method === 'GET' && path.startsWith('/issue/PM-1')) { n++; return n === 1 ? { status: 429, headers: { 'retry-after': '0' } } : { body: { key: 'PM-1', fields: { summary: 'X', description: null, updated: '2026-01-01', status: { name: 'To Do' } } } }; }
    return {};
  });
  const out = await conn(f).get({ id: 'PM-1' });
  assert.equal(out.id, 'PM-1');
  assert.equal(n, 2);
});

test('connector requires a token and site/email', () => {
  assert.throws(() => jiraConnector({ site: 'acme', email: 'm@a.co', project: 'PM' }), /requires a token/);
  assert.throws(() => jiraConnector({ token: 't', project: 'PM' }), /requires site \+ email/);
});
