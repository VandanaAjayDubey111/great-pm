// connectors/linear.mjs
// The Linear connector for the `tracker` capability — two-way (get/list/upsert)
// against Linear's GraphQL API. Hardened: retries on network/429 AND on Linear's
// own rate-limit signal (HTTP 400 + errors[].extensions.code === 'RATELIMITED',
// which has no 429 status and no Retry-After); list follows GraphQL cursor
// pagination (bounded). upsert never overwrites on conflict — returns both versions.
import { checkConflict } from './tracker-conflict.mjs';
import { withRetry } from './retry.mjs';

const API = 'https://api.linear.app/graphql';
const MAX_PAGES = 20;

export function linearConnector({ token, team, fetch: f, sleep } = {}) {
  if (!token) throw new Error('linear connector requires a token (LINEAR_TOKEN)');
  const client = f || globalThis.fetch;
  const sleepFn = sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));

  const gql = async (query, variables, attempt = 0) => {
    const res = await withRetry(
      () => client(API, { method: 'POST', headers: { Authorization: token, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) }),
      { sleep },
    );
    const json = await res.json();
    if (json.errors) {
      // Linear throttling = HTTP 400 + extensions.code 'RATELIMITED' (no 429), which
      // withRetry's status check can't see — back off and retry here.
      if (json.errors.some((e) => e.extensions?.code === 'RATELIMITED') && attempt < 3) {
        await sleepFn(2 ** (attempt + 1) * 1000);
        return gql(query, variables, attempt + 1);
      }
      throw new Error(`linear failed: ${json.errors[0]?.message || 'unknown'}`);
    }
    return json.data;
  };

  const get = async ({ id } = {}) => {
    if (!id) throw new Error('linear tracker.get requires { id }');
    const d = await gql('query($id:String!){issue(id:$id){id title description updatedAt state{name}}}', { id });
    const i = d.issue;
    return i
      ? { id: i.id, title: i.title, body: i.description, status: i.state?.name, updatedAt: i.updatedAt, tool: 'linear' }
      : { id: null, tool: 'linear' };
  };

  const list = async ({ first = 50 } = {}) => {
    let nodes = [];
    let after;
    let pages = 0;
    do {
      const d = await gql(
        'query($first:Int,$after:String){issues(first:$first,after:$after){nodes{id title updatedAt state{name}} pageInfo{hasNextPage endCursor}}}',
        { first, after },
      );
      nodes = nodes.concat(d.issues?.nodes || []);
      const pi = d.issues?.pageInfo;
      after = pi?.hasNextPage ? pi.endCursor : null;
    } while (after && ++pages < MAX_PAGES);
    return { items: nodes.map((i) => ({ id: i.id, title: i.title, status: i.state?.name, updatedAt: i.updatedAt })), tool: 'linear' };
  };

  const upsert = async ({ id, title, body, baseUpdatedAt } = {}) => {
    if (!id) {
      if (!team) throw new Error('linear tracker.upsert (create) requires a team id (connectors.json tracker.team)');
      const d = await gql(
        'mutation($input:IssueCreateInput!){issueCreate(input:$input){issue{id identifier url updatedAt}}}',
        { input: { teamId: team, title, description: body } },
      );
      const i = d.issueCreate.issue;
      return { id: i.id, url: i.url, created: true, tool: 'linear' };
    }
    const remote = await get({ id });
    const conflict = checkConflict({ local: { id, title, body }, remote, baseUpdatedAt });
    if (conflict) return { ...conflict, tool: 'linear' };
    const d = await gql(
      'mutation($id:String!,$input:IssueUpdateInput!){issueUpdate(id:$id,input:$input){issue{id updatedAt}}}',
      { id, input: { title, description: body } },
    );
    return { id, updated: true, updatedAt: d.issueUpdate.issue.updatedAt, tool: 'linear' };
  };

  return { get, list, upsert };
}
