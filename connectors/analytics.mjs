// connectors/analytics.mjs
// The analytics connectors for the `analytics` capability — read-only `query`.
// Canonical-metric model: query({ metric, window }). Two sources:
//   csv       — universal fallback; reads a metrics export (path-guarded, no network)
//   amplitude — Amplitude Dashboard REST API (injectable fetch + retry → token-free tests)
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute, sep } from 'node:path';
import { withRetry } from './retry.mjs';

const AMP_HOSTS = { us: 'https://amplitude.com', eu: 'https://analytics.eu.amplitude.com' };
const AMP_METRICS = {
  active_users: { path: '/api/2/users', m: 'active' },
  new_users: { path: '/api/2/users', m: 'new' },
};
const ymd = (iso) => iso.slice(0, 10).replace(/-/g, '');

export function csvAnalytics({ path, projectDir } = {}) {
  if (!path) throw new Error('csv analytics requires a file path (connectors.json analytics.path)');
  const base = projectDir ? resolve(projectDir) : null;
  const full = isAbsolute(path) ? path : resolve(base || process.cwd(), path);
  // security: a relative path must not escape the project dir (guards a shared/templated config)
  if (base && !isAbsolute(path) && full !== base && !full.startsWith(base + sep)) {
    throw new Error(`csv path '${path}' escapes the project directory`);
  }
  const query = async ({ metric, window } = {}) => {
    if (!metric) throw new Error('analytics.query requires { metric }');
    const lines = readFileSync(full, 'utf8').trim().split('\n');
    const header = lines[0].split(',').map((s) => s.trim());
    const di = header.indexOf('date');
    const mi = header.indexOf(metric);
    if (mi === -1) throw new Error(`csv has no column '${metric}' (have: ${header.join(', ')})`);
    let rows = lines.slice(1).map((l) => l.split(',').map((s) => s.trim()));
    if (window?.start) rows = rows.filter((r) => di === -1 || r[di] >= window.start);
    if (window?.end) rows = rows.filter((r) => di === -1 || r[di] <= window.end);
    return { metric, series: rows.map((r) => ({ date: di >= 0 ? r[di] : null, value: Number(r[mi]) })), source: 'csv' };
  };
  return { query };
}

export function amplitudeAnalytics({ apiKey, secretKey, dataCenter = 'us', fetch: f, sleep } = {}) {
  if (!apiKey || !secretKey) throw new Error('amplitude analytics requires AMPLITUDE_API_KEY + AMPLITUDE_SECRET_KEY');
  const host = AMP_HOSTS[dataCenter] || AMP_HOSTS.us; // 'eu' → analytics.eu.amplitude.com
  const client = f || globalThis.fetch;
  const auth = 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
  const query = async ({ metric, window } = {}) => {
    const m = AMP_METRICS[metric];
    if (!m) throw new Error(`unknown analytics metric '${metric}' (have: ${Object.keys(AMP_METRICS).join(', ')})`);
    const start = window?.start ? ymd(window.start) : '';
    const end = window?.end ? ymd(window.end) : '';
    const res = await withRetry(() => client(`${host}${m.path}?m=${m.m}&start=${start}&end=${end}`, { headers: { Authorization: auth } }), { sleep });
    const json = await res.json();
    if (res.ok === false) throw new Error(`amplitude query failed: ${json.message || 'unknown'}`);
    const xs = json.data?.xValues || [];
    const ys = json.data?.series?.[0] || [];
    return { metric, series: xs.map((d, i) => ({ date: d, value: ys[i] })), source: 'amplitude' };
  };
  return { query };
}
