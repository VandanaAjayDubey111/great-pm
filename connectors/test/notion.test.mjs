// connectors/test/notion.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notionConnector } from '../notion.mjs';

// Token-free fake of Notion's HTTP API. `handler({method,path,body})` returns
// { ok?, status?, headers?, json? }; all requests captured on f.calls.
function stub(handler) {
  const calls = [];
  const f = async (url, opts = {}) => {
    const method = opts.method || 'GET';
    const path = url.replace('https://api.notion.com/v1', '');
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    calls.push({ method, path, body });
    const r = handler({ method, path, body }) || {};
    return {
      ok: r.ok ?? true,
      status: r.status ?? 200,
      headers: { get: (k) => (r.headers || {})[k] ?? null },
      json: async () => r.json ?? {},
    };
  };
  f.calls = calls;
  return f;
}
const conn = (f) => notionConnector({ token: 't', parent: 'parent-1', fetch: f, sleep: () => {} });

test('write creates a child page with converted blocks', async () => {
  const f = stub(({ method, path }) => (method === 'POST' && path === '/pages') ? { json: { id: 'p1', url: 'http://x/p1' } } : {});
  const out = await conn(f).write({ title: 'Roadmap', body: '# Now\n- ship it' });
  assert.equal(out.id, 'p1');
  assert.equal(out.blocks, 2);
  assert.equal(f.calls[0].body.parent.page_id, 'parent-1');
  assert.equal(f.calls[0].body.children[0].type, 'heading_1');
});

test('write chunks >100 blocks into a create + append', async () => {
  const f = stub(({ method, path }) => {
    if (method === 'POST' && path === '/pages') return { json: { id: 'p1', url: 'u' } };
    if (method === 'PATCH') return { json: {} };
    return {};
  });
  const body = Array.from({ length: 150 }, (_, i) => `line ${i}`).join('\n');
  const out = await conn(f).write({ title: 'Big', body });
  assert.equal(out.blocks, 150);
  const posts = f.calls.filter((c) => c.method === 'POST' && c.path === '/pages');
  const patches = f.calls.filter((c) => c.method === 'PATCH');
  assert.equal(posts.length, 1);
  assert.equal(posts[0].body.children.length, 100); // first 100 land in the create
  assert.equal(patches.length, 1);
  assert.equal(patches[0].body.children.length, 50); // remaining 50 appended
});

test('write surfaces lossy-markdown warnings (never silently drops)', async () => {
  const f = stub(({ path }) => path === '/pages' ? { json: { id: 'p1', url: 'u' } } : {});
  const out = await conn(f).write({ title: 'T', body: '| a | b |\n| 1 | 2 |' });
  assert.ok(out.warnings?.some((w) => /tables/.test(w)));
});

test('read parses a realistic multi-block page into markdown (replay shape)', async () => {
  const f = stub(({ path }) => path === '/blocks/p1/children' ? {
    json: {
      results: [
        { type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Now' }] } },
        { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'ship the beta' }] } },
        { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ plain_text: 'composer' }] } },
      ],
      has_more: false,
    },
  } : {});
  const out = await conn(f).read({ id: 'p1' });
  assert.equal(out.body, '# Now\nship the beta\n- composer');
});

test('read paginates children across pages (follows next_cursor)', async () => {
  const f = stub(({ path }) => {
    if (path === '/blocks/p1/children') return { json: { results: [{ type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'A' }] } }], has_more: true, next_cursor: 'c2' } };
    if (path === '/blocks/p1/children?start_cursor=c2') return { json: { results: [{ type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'B' }] } }], has_more: false } };
    return {};
  });
  const out = await conn(f).read({ id: 'p1' });
  assert.equal(out.body, '# A\nB');
});

test('list returns only child pages', async () => {
  const f = stub(({ path }) => path === '/blocks/parent-1/children'
    ? { json: { results: [{ type: 'child_page', id: 'c1', child_page: { title: 'Spec' } }, { type: 'paragraph' }], has_more: false } } : {});
  const out = await conn(f).list();
  assert.deepEqual(out.items, [{ id: 'c1', title: 'Spec' }]);
});

test('retries on 429 then succeeds', async () => {
  let n = 0;
  const f = stub(({ path }) => {
    if (path === '/blocks/p1/children') { n++; return n === 1 ? { status: 429, headers: { 'retry-after': '0' } } : { json: { results: [], has_more: false } }; }
    return {};
  });
  const out = await conn(f).read({ id: 'p1' });
  assert.equal(out.id, 'p1');
  assert.equal(n, 2); // retried exactly once
});

test('api errors surface a clear message', async () => {
  const f = stub(() => ({ ok: false, status: 401, json: { message: 'unauthorized' } }));
  await assert.rejects(() => conn(f).write({ title: 'x' }), /notion POST \/pages failed: unauthorized/);
});

test('connector requires a token', () => {
  assert.throws(() => notionConnector({ parent: 'p' }), /requires a token/);
});
