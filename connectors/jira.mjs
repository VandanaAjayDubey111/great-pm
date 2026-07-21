// connectors/jira.mjs
// The Jira Cloud connector for the `tracker` capability — two-way (get/list/upsert)
// against Jira REST v3. Basic auth (email:token), Atlassian Document Format for
// descriptions. Hardened: every call retries on 429/network; list uses POST
// /search/jql with nextPageToken cursor pagination (the legacy GET /search +
// startAt was removed from Jira Cloud in 2025). Same no-overwrite conflict rule as Linear.
import { checkConflict } from './tracker-conflict.mjs';
import { withRetry } from './retry.mjs';

const MAX_PAGES = 20;
const toADF = (text = '') => ({ type: 'doc', version: 1, content: [{ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] }] });
const fromADF = (adf) => (!adf || !adf.content ? '' : adf.content.flatMap((b) => (b.content || []).map((t) => t.text || '')).join('\n'));

export function jiraConnector({ site, email, token, project, issuetype = 'Task', fetch: f, sleep } = {}) {
  if (!token) throw new Error('jira connector requires a token (JIRA_TOKEN)');
  if (!site || !email) throw new Error('jira connector requires site + email (connectors.json tracker.site, tracker.email)');
  const client = f || globalThis.fetch;
  const base = `https://${site}.atlassian.net/rest/api/3`;
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
    if (!res.ok) throw new Error(`jira ${method} ${path} failed: ${json.errorMessages?.[0] || res.status}`);
    return json;
  };

  const get = async ({ id } = {}) => {
    if (!id) throw new Error('jira tracker.get requires { id } (the issue key, e.g. PROJ-12)');
    const d = await api('GET', `/issue/${id}?fields=summary,description,updated,status`);
    if (!d.fields) return { id: null, tool: 'jira' };
    return { id: d.key, title: d.fields.summary, body: fromADF(d.fields.description), status: d.fields.status?.name, updatedAt: d.fields.updated, tool: 'jira' };
  };

  const list = async ({ jql } = {}) => {
    const q = jql || (project ? `project=${project}` : '');
    let issues = [];
    let nextPageToken;
    let pages = 0;
    for (;;) {
      const body = { jql: q, fields: ['summary', 'status', 'updated'], maxResults: 50 };
      if (nextPageToken) body.nextPageToken = nextPageToken;
      const d = await api('POST', '/search/jql', body);
      issues = issues.concat(d.issues || []);
      nextPageToken = d.nextPageToken;
      if (!nextPageToken || ++pages >= MAX_PAGES) break;
    }
    return { items: issues.map((i) => ({ id: i.key, title: i.fields?.summary, status: i.fields?.status?.name, updatedAt: i.fields?.updated })), tool: 'jira' };
  };

  const upsert = async ({ id, title, body, baseUpdatedAt } = {}) => {
    if (!id) {
      if (!project) throw new Error('jira tracker.upsert (create) requires a project key (connectors.json tracker.project)');
      const d = await api('POST', '/issue', { fields: { project: { key: project }, summary: title, description: toADF(body), issuetype: { name: issuetype } } });
      return { id: d.key, url: `https://${site}.atlassian.net/browse/${d.key}`, created: true, tool: 'jira' };
    }
    const remote = await get({ id });
    const conflict = checkConflict({ local: { id, title, body }, remote, baseUpdatedAt });
    if (conflict) return { ...conflict, tool: 'jira' };
    await api('PUT', `/issue/${id}`, { fields: { summary: title, description: toADF(body) } });
    return { id, updated: true, tool: 'jira' };
  };

  return { get, list, upsert };
}
