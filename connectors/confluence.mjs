// connectors/confluence.mjs
// The Confluence Cloud connector for the `docs` capability — two-way (read/list/write)
// against Confluence REST v2. Basic auth (email:token), storage-format bodies.
// Same hardening as the others: retry on 429/network, pagination on list, lossy
// markdown surfaced as warnings. An alternative `docs` tool to Notion.
import { mdToStorage, storageToText } from './confluence-storage.mjs';
import { markdownWarnings } from './notion-md.mjs';
import { withRetry } from './retry.mjs';

const MAX_PAGES = 20;

export function confluenceConnector({ site, email, token, space, fetch: f, sleep } = {}) {
  if (!token) throw new Error('confluence connector requires a token (CONFLUENCE_TOKEN)');
  if (!site || !email) throw new Error('confluence connector requires site + email (connectors.json docs.site, docs.email)');
  // v2 needs the NUMERIC space id, not the human space key — catch the common mistake early.
  if (space != null && !/^\d+$/.test(String(space))) {
    throw new Error(`confluence docs.space must be the numeric space id, not the space key '${space}' — fetch it via GET https://${site}.atlassian.net/wiki/api/v2/spaces?keys=${space}`);
  }
  const client = f || globalThis.fetch;
  const base = `https://${site}.atlassian.net/wiki/api/v2`;
  const auth = 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');

  const api = async (method, path, body) => {
    const res = await withRetry(
      () => client(`${base}${path}`, {
        method,
        headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      }),
      { sleep },
    );
    const text = await res.text();
    let json = {};
    if (text) { try { json = JSON.parse(text); } catch { json = {}; } }
    if (!res.ok) throw new Error(`confluence ${method} ${path} failed: ${json.errors?.[0]?.title || json.message || res.status}`);
    return json;
  };

  const webUrl = (page) => (page._links?.base || `https://${site}.atlassian.net/wiki`) + (page._links?.webui || '');

  return {
    async write({ title = 'Untitled', body = '' } = {}) {
      if (!space) throw new Error('confluence docs.write requires a space id (connectors.json docs.space)');
      const warnings = markdownWarnings(body);
      const page = await api('POST', '/pages', { spaceId: space, title, body: { representation: 'storage', value: mdToStorage(body) } });
      return { id: page.id, url: webUrl(page), ...(warnings.length ? { warnings } : {}), tool: 'confluence' };
    },

    async read({ id } = {}) {
      if (!id) throw new Error('confluence docs.read requires { id }');
      const d = await api('GET', `/pages/${id}?body-format=storage`);
      return { id: d.id, title: d.title, body: storageToText(d.body?.storage?.value || ''), tool: 'confluence' };
    },

    async list() {
      if (!space) throw new Error('confluence docs.list requires a space id');
      let results = [];
      let cursor;
      let pages = 0;
      do {
        const d = await api('GET', `/spaces/${space}/pages?limit=100${cursor ? `&cursor=${cursor}` : ''}`);
        results = results.concat(d.results || []);
        cursor = d._links?.next ? new URL(d._links.next, base).searchParams.get('cursor') : null;
      } while (cursor && ++pages < MAX_PAGES);
      return { items: results.map((p) => ({ id: p.id, title: p.title })), tool: 'confluence' };
    },
  };
}
