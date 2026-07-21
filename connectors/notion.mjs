// connectors/notion.mjs
// The Notion connector for the `docs` capability — two-way (read/list/write)
// against the Notion REST API. Hardened for real-world use:
//   • every call goes through withRetry (429 + Retry-After + network backoff)
//   • reads paginate (Notion returns ≤100 children per page; follow next_cursor)
//   • writes chunk to Notion's 100-blocks-per-request limit (create + append)
//   • lossy markdown is surfaced as `warnings`, never dropped silently
// HTTP goes through an injectable client (+ injectable sleep) so tests run token-free.
import { markdownToBlocks, blocksToMarkdown, markdownWarnings } from './notion-md.mjs';
import { withRetry } from './retry.mjs';

const rt = (content) => [{ type: 'text', text: { content } }];
const API = 'https://api.notion.com/v1';
const CHUNK = 100; // Notion's children-per-request limit

export function notionConnector({ token, parent, version = '2025-09-03', fetch: f, sleep } = {}) {
  if (!token) throw new Error('notion connector requires a token (NOTION_TOKEN)');
  const client = f || globalThis.fetch;

  const api = async (method, path, body) => {
    const res = await withRetry(
      () => client(`${API}${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Notion-Version': version, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      }),
      { sleep },
    );
    const json = await res.json();
    if (!res.ok) throw new Error(`notion ${method} ${path} failed: ${json.message || res.status}`);
    return json;
  };

  // Follow next_cursor across pages for endpoints returning { results, has_more, next_cursor }.
  const paginate = async (path) => {
    let results = [];
    let cursor = null;
    do {
      const q = cursor ? `${path}${path.includes('?') ? '&' : '?'}start_cursor=${encodeURIComponent(cursor)}` : path;
      const page = await api('GET', q);
      results = results.concat(page.results || []);
      cursor = page.has_more ? page.next_cursor : null;
    } while (cursor);
    return results;
  };

  return {
    async write({ title = 'Untitled', body = '' } = {}) {
      if (!parent) throw new Error('notion docs.write requires a parent page id (connectors.json docs.parent)');
      const blocks = markdownToBlocks(body);
      const warnings = markdownWarnings(body);
      const page = await api('POST', '/pages', {
        parent: { page_id: parent },
        properties: { title: { title: rt(title) } },
        children: blocks.slice(0, CHUNK),
      });
      // append any blocks beyond the first 100, in ≤100 batches
      for (let i = CHUNK; i < blocks.length; i += CHUNK) {
        await api('PATCH', `/blocks/${page.id}/children`, { children: blocks.slice(i, i + CHUNK) });
      }
      return { id: page.id, url: page.url, blocks: blocks.length, ...(warnings.length ? { warnings } : {}), tool: 'notion' };
    },

    async read({ id, query } = {}) {
      let pageId = id;
      if (!pageId && query) {
        const r = await api('POST', '/search', { query, filter: { property: 'object', value: 'page' } });
        pageId = r.results?.[0]?.id;
        if (!pageId) return { id: null, body: '', tool: 'notion' };
      }
      if (!pageId) throw new Error('notion docs.read requires { id } or { query }');
      const blocks = await paginate(`/blocks/${pageId}/children`);
      return { id: pageId, body: blocksToMarkdown(blocks), tool: 'notion' };
    },

    async list() {
      if (!parent) throw new Error('notion docs.list requires a parent page id');
      const blocks = await paginate(`/blocks/${parent}/children`);
      const items = blocks.filter((b) => b.type === 'child_page').map((b) => ({ id: b.id, title: b.child_page?.title }));
      return { items, tool: 'notion' };
    },
  };
}
