// connectors/slack.mjs
// The Slack connector for the `comms` capability — two-way: post (write a message
// to a channel) and listen (read recent channel messages, e.g. for feedback-synthesizer).
// post() = POST + JSON (chat.postMessage); listen() = GET + query params
// (conversations.history — a read method documented as GET; JSON body is unsupported there).
// Hardened: retries on 429/network (withRetry); listen paginates via
// response_metadata.next_cursor (bounded). Slack signals failure with json.ok:false.
import { withRetry } from './retry.mjs';

const API = 'https://slack.com/api';
const MAX_PAGES = 20; // safety bound on listen pagination

export function slackConnector({ token, channel, fetch: f, sleep } = {}) {
  if (!token) throw new Error('slack connector requires a token (SLACK_TOKEN)');
  const client = f || globalThis.fetch;

  const api = async (method, payload = {}, httpMethod = 'POST') => {
    const url = httpMethod === 'GET' ? `${API}/${method}?${new URLSearchParams(payload)}` : `${API}/${method}`;
    const res = await withRetry(
      () => client(url, {
        method: httpMethod,
        headers: httpMethod === 'GET'
          ? { Authorization: `Bearer ${token}` }
          : { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
        body: httpMethod === 'GET' ? undefined : JSON.stringify(payload),
      }),
      { sleep },
    );
    const json = await res.json();
    if (!json.ok) throw new Error(`slack ${method} failed: ${json.error || 'unknown'}`);
    return json;
  };

  return {
    async post({ text = '', channel: ch } = {}) {
      const target = ch || channel;
      if (!target) throw new Error('slack comms.post requires a channel (connectors.json comms.channel or payload.channel)');
      const r = await api('chat.postMessage', { channel: target, text });
      return { id: r.ts, channel: r.channel, tool: 'slack' };
    },

    async listen({ channel: ch, limit = 100 } = {}) {
      const target = ch || channel;
      if (!target) throw new Error('slack comms.listen requires a channel');
      let messages = [];
      let cursor;
      let pages = 0;
      do {
        const r = await api('conversations.history', { channel: target, limit, ...(cursor ? { cursor } : {}) }, 'GET');
        messages = messages.concat((r.messages || []).map((m) => ({ ts: m.ts, user: m.user, text: m.text })));
        cursor = r.has_more ? r.response_metadata?.next_cursor : null;
      } while (cursor && ++pages < MAX_PAGES);
      return { messages, tool: 'slack' };
    },
  };
}
