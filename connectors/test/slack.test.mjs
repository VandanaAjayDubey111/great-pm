// connectors/test/slack.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slackConnector } from '../slack.mjs';

// Token-free fake of Slack's Web API. Slack always returns HTTP 200 unless rate-limited
// (429); success is signalled by the JSON `ok` field. `handler({method,body})` → { json }.
function stub(handler) {
  const calls = [];
  const f = async (url, opts = {}) => {
    const [method, qs] = url.replace('https://slack.com/api/', '').split('?');
    // POST → JSON body; GET (conversations.history) → query params
    const body = opts.body ? JSON.parse(opts.body) : Object.fromEntries(new URLSearchParams(qs || ''));
    calls.push({ method, body, httpMethod: opts.method });
    const r = handler({ method, body }) || {};
    return { ok: r.ok ?? true, status: r.status ?? 200, headers: { get: (k) => (r.headers || {})[k] ?? null }, json: async () => r.json ?? { ok: true } };
  };
  f.calls = calls;
  return f;
}
const conn = (f) => slackConnector({ token: 't', channel: 'C123', fetch: f, sleep: () => {} });

test('post sends chat.postMessage with channel + text', async () => {
  const f = stub(({ method }) => method === 'chat.postMessage' ? { json: { ok: true, ts: '171.1', channel: 'C123' } } : {});
  const out = await conn(f).post({ text: 'hello' });
  assert.equal(out.id, '171.1');
  assert.equal(f.calls[0].body.channel, 'C123');
  assert.equal(f.calls[0].body.text, 'hello');
});

test('post honors an explicit channel in the payload over the configured default', async () => {
  const f = stub(() => ({ json: { ok: true, ts: '1', channel: 'C999' } }));
  await conn(f).post({ text: 'x', channel: 'C999' });
  assert.equal(f.calls[0].body.channel, 'C999');
});

test('listen reads conversations.history into {ts,user,text}', async () => {
  const f = stub(({ method }) => method === 'conversations.history'
    ? { json: { ok: true, messages: [{ ts: '1', user: 'U1', text: 'hi' }, { ts: '2', user: 'U2', text: 'blocked' }] } } : {});
  const out = await conn(f).listen({});
  assert.equal(out.messages.length, 2);
  assert.equal(out.messages[1].text, 'blocked');
});

test('listen paginates via response_metadata.next_cursor', async () => {
  const f = stub(({ body }) => body.cursor === 'c2'
    ? { json: { ok: true, messages: [{ ts: '3', user: 'U3', text: 'page2' }], has_more: false } }
    : { json: { ok: true, messages: [{ ts: '1', user: 'U1', text: 'page1' }], has_more: true, response_metadata: { next_cursor: 'c2' } } });
  const out = await conn(f).listen({});
  assert.deepEqual(out.messages.map((m) => m.text), ['page1', 'page2']);
});

test('retries on 429 then succeeds', async () => {
  let n = 0;
  const f = stub(({ method }) => {
    if (method === 'chat.postMessage') { n++; return n === 1 ? { status: 429, headers: { 'retry-after': '0' } } : { json: { ok: true, ts: '9', channel: 'C123' } }; }
    return {};
  });
  const out = await conn(f).post({ text: 'x' });
  assert.equal(out.id, '9');
  assert.equal(n, 2);
});

test('slack errors (ok:false) surface a clear message', async () => {
  const f = stub(() => ({ json: { ok: false, error: 'channel_not_found' } }));
  await assert.rejects(() => conn(f).post({ text: 'x' }), /slack chat.postMessage failed: channel_not_found/);
});

test('connector requires a token', () => {
  assert.throws(() => slackConnector({ channel: 'C1' }), /requires a token/);
});
