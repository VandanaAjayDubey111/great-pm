// connectors/test/confluence.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { confluenceConnector } from '../confluence.mjs';

// Token-free fake of Confluence REST v2. `handler({method,path,body})` returns
// { ok?, status?, headers?, body? }; serialized via res.text().
function stub(handler) {
  const calls = [];
  const f = async (url, opts = {}) => {
    const method = opts.method || 'GET';
    const path = url.replace(/^https:\/\/[^/]+\/wiki\/api\/v2/, '');
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    calls.push({ method, path, body });
    const r = handler({ method, path, body }) || {};
    return { ok: r.ok ?? true, status: r.status ?? 200, headers: { get: (k) => (r.headers || {})[k] ?? null }, text: async () => (r.body != null ? JSON.stringify(r.body) : '') };
  };
  f.calls = calls;
  return f;
}
const conn = (f) => confluenceConnector({ site: 'acme', email: 'me@acme.co', token: 't', space: '12345', fetch: f, sleep: () => {} });

test('write creates a page in the space with a storage-format body', async () => {
  const f = stub(({ method, path }) => method === 'POST' && path === '/pages'
    ? { body: { id: 'P1', _links: { base: 'https://acme.atlassian.net/wiki', webui: '/pages/P1' } } } : {});
  const out = await conn(f).write({ title: 'Spec', body: '# Goal\n- ship' });
  assert.equal(out.id, 'P1');
  assert.match(out.url, /\/pages\/P1/);
  assert.equal(f.calls[0].body.spaceId, '12345');
  assert.match(f.calls[0].body.body.value, /<h1>Goal<\/h1>/);
});

test('write surfaces lossy-markdown warnings', async () => {
  const f = stub(({ path }) => path === '/pages' ? { body: { id: 'P1', _links: {} } } : {});
  const out = await conn(f).write({ title: 'T', body: '| a | b |\n| 1 | 2 |' });
  assert.ok(out.warnings?.some((w) => /tables/.test(w)));
});

test('read returns the page body as text', async () => {
  const f = stub(({ method, path }) => method === 'GET' && path.startsWith('/pages/P1')
    ? { body: { id: 'P1', title: 'Spec', body: { storage: { value: '<h1>Goal</h1><p>ship</p>' } } } } : {});
  const out = await conn(f).read({ id: 'P1' });
  assert.equal(out.body, '# Goal\nship');
});

test('list returns pages in the space', async () => {
  const f = stub(({ path }) => path.startsWith('/spaces/12345/pages') ? { body: { results: [{ id: 'P1', title: 'Spec' }], _links: {} } } : {});
  const out = await conn(f).list();
  assert.deepEqual(out.items, [{ id: 'P1', title: 'Spec' }]);
});

test('retries on 429 then succeeds', async () => {
  let n = 0;
  const f = stub(({ method, path }) => {
    if (method === 'GET' && path.startsWith('/pages/P1')) { n++; return n === 1 ? { status: 429, headers: { 'retry-after': '0' } } : { body: { id: 'P1', title: 'X', body: { storage: { value: '<p>x</p>' } } } }; }
    return {};
  });
  const out = await conn(f).read({ id: 'P1' });
  assert.equal(out.id, 'P1');
  assert.equal(n, 2);
});

test('requires token + site/email', () => {
  assert.throws(() => confluenceConnector({ site: 'a', email: 'e@a.co', space: '1' }), /requires a token/);
  assert.throws(() => confluenceConnector({ token: 't', space: '1' }), /requires site \+ email/);
});

test('rejects a non-numeric space (space key mistaken for the numeric id)', () => {
  assert.throws(() => confluenceConnector({ site: 'acme', email: 'm@a.co', token: 't', space: 'ENG' }), /numeric space id/);
});
