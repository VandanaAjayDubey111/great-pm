#!/usr/bin/env node
/**
 * great-pm board — self-contained Node-stdlib server (zero dependencies).
 * Serves a hybrid stage×status Kanban + artifact panels + verdict metrics on
 * localhost:3142, reading the SAME beads store + .great-pm/ state the agents use.
 *
 * Data source: `bd list --all --include-gates --limit 0 --json` (cwd=project),
 *              .great-pm/{gates,drafts,verdicts,brain.md}.
 * Write path : POST /api/mutate -> `bd update` / `bd create` (human-initiated only).
 * Usage      : node server.mjs [--port 3142] [--no-open]
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync, spawnSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');
const REGISTRY = path.join(os.homedir(), '.great-pm', 'projects.json');

const argv = process.argv.slice(2);
const PORT = parseInt(valOf('--port') || process.env.BOARD_PORT || '3142', 10);
const NO_OPEN = argv.includes('--no-open');

const STAGES = ['discover', 'strategize', 'prioritize', 'define', 'launch', 'measure'];
const STAGE_LABELS = STAGES.map(s => `stage-${s}`);
const COLUMN_OF = (status) =>
  status === 'closed' ? 'done'
  : (status === 'in_progress' || status === 'blocked') ? 'inprogress'
  : 'backlog';
const STATUS_OF_COLUMN = { backlog: 'open', inprogress: 'in_progress', done: 'closed' };

function valOf(flag) { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : null; }

// ── registry ────────────────────────────────────────────────────────────────
function readRegistry() {
  try { return JSON.parse(fs.readFileSync(REGISTRY, 'utf8')).projects || []; }
  catch { return []; }
}
function isRegistered(p) {
  if (!p) return false;
  const abs = path.resolve(p);
  return readRegistry().some(r => path.resolve(r.path) === abs)
    // also accept any path that actually holds a .great-pm/ (covers first run)
    || (fs.existsSync(path.join(abs, '.great-pm')) || fs.existsSync(path.join(abs, '.beads')));
}

// ── beads helpers ─────────────────────────────────────────────────────────────
function bdList(cwd) {
  try {
    const out = execFileSync('bd', ['list', '--all', '--include-gates', '--limit', '0', '--json'],
      { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return { issues: JSON.parse(out || '[]') };
  } catch (e) {
    return { error: e.code === 'ENOENT' ? 'bd not found on PATH' : String(e.stderr || e.message).slice(0, 400) };
  }
}
function stageOf(labels) {
  const l = (labels || []).find(x => STAGE_LABELS.includes(x));
  return l ? l.slice('stage-'.length) : null;
}
function normalize(raw) {
  const labels = raw.labels || [];
  return {
    id: raw.id, title: raw.title || '', status: raw.status,
    column: COLUMN_OF(raw.status), stage: stageOf(labels), labels,
    priority: raw.priority, type: raw.issue_type,
    isGate: labels.includes('gate'),
    description: (raw.description || '').slice(0, 4000),
    assignee: raw.assignee || null,
    updated_at: raw.updated_at, created_at: raw.created_at, closed_at: raw.closed_at || null,
  };
}

// ── artifacts + metrics ───────────────────────────────────────────────────────
function listDir(dir, ext) {
  try { return fs.readdirSync(dir).filter(f => !ext || f.endsWith(ext)).sort(); }
  catch { return []; }
}
function artifacts(cwd) {
  const g = path.join(cwd, '.great-pm');
  const gates = listDir(path.join(g, 'gates'), '.md').map(f => ({ name: f }));
  const drafts = listDir(path.join(g, 'drafts'), '.md').map(f => ({ name: f }));
  // newest 6 verdict lines across per-agent logs
  let verdicts = [];
  for (const f of listDir(path.join(g, 'verdicts'), '.log')) {
    try {
      const lines = fs.readFileSync(path.join(g, 'verdicts', f), 'utf8').trim().split('\n').filter(Boolean);
      verdicts.push(...lines.slice(-3).map(line => ({ file: f, line })));
    } catch {}
  }
  verdicts = verdicts.sort((a, b) => (a.line < b.line ? 1 : -1)).slice(0, 8);
  let brain = '';
  try { brain = fs.readFileSync(path.join(g, 'brain.md'), 'utf8').trim().split('\n').slice(-6).join('\n'); } catch {}
  return { gates, drafts, verdicts, brain };
}
function metrics(cwd) {
  const vdir = path.join(cwd, '.great-pm', 'verdicts');
  const perAgent = {}; let done = 0, blocked = 0; const recent = [];
  for (const f of listDir(vdir, '.log')) {
    if (/^\d{4}-\d{2}-\d{2}\.log$/.test(f)) continue; // skip date-rollup logs (dedupe with per-agent)
    const agent = f.replace('.log', '');
    try {
      const lines = fs.readFileSync(path.join(vdir, f), 'utf8').trim().split('\n').filter(Boolean);
      for (const line of lines) {
        const parts = line.split('|').map(s => s.trim());
        const verdict = parts[2] || '';
        if (verdict.startsWith('DONE')) done++; else if (verdict.startsWith('BLOCKED')) blocked++;
        perAgent[agent] = perAgent[agent] || { runs: 0, last: '' };
        perAgent[agent].runs++; perAgent[agent].last = verdict;
        recent.push({ ts: parts[0] || '', agent, verdict });
      }
    } catch {}
  }
  recent.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return { agents: perAgent, done, blocked, recent: recent.slice(0, 10), cost: null /* not instrumented */ };
}

function memory(cwd) {
  const g = path.join(cwd, '.great-pm');
  const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return ''; } };
  return {
    brain: read(path.join(g, 'brain.md')),
    lessons: read(path.join(g, 'lessons.md')),
    decisions: read(path.join(os.homedir(), '.great-pm', 'decisions.md')),
  };
}
function logs(cwd) {
  const vdir = path.join(cwd, '.great-pm', 'verdicts');
  const lines = [];
  for (const f of listDir(vdir, '.log')) {
    if (/^\d{4}-\d{2}-\d{2}\.log$/.test(f)) continue; // dedupe date-rollups with per-agent logs
    try {
      for (const line of fs.readFileSync(path.join(vdir, f), 'utf8').trim().split('\n').filter(Boolean)) {
        const p = line.split('|').map(s => s.trim());
        lines.push({ ts: p[0] || '', agent: p[1] || f.replace('.log', ''), verdict: (p[2] || '').split(' ')[0], detail: p[3] || '' });
      }
    } catch {}
  }
  lines.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return { lines, sessions: listDir(path.join(cwd, '.great-pm', 'logs'), '.md').reverse() };
}

function safeSize(p) { try { return fs.statSync(p).size; } catch { return 0; } }
// The full product-knowledge trail under .great-pm/, grouped for a PM/stakeholder.
function docs(cwd) {
  const g = path.join(cwd, '.great-pm'); const out = [];
  const named = [
    ['Contract', 'PROJECT.md', 'The initiative contract — scope, audience, constraints'],
    ['Operating memory', 'brain.md', 'Shared synthesis injected into every agent'],
    ['Operating memory', 'lessons.md', 'Lessons extracted across cycles'],
    ['Operating memory', 'HANDOFF.md', 'Auto-handoff written on context compaction'],
  ];
  for (const [cat, f, desc] of named) { const p = path.join(g, f); out.push({ category: cat, name: f, path: f, desc, exists: fs.existsSync(p), size: safeSize(p) }); }
  const dirs = [['Discovery', 'discover'], ['Strategy', 'strategize'], ['Prioritize', 'prioritize'], ['Define', 'define'], ['Launch', 'launch'], ['Measure', 'measure'], ['Decisions', 'gates'], ['Decisions', 'reviews'], ['Advisor reads', 'advisor'], ['Research', 'research'], ['Drafts', 'drafts']];
  for (const [cat, d] of dirs) { for (const f of listDir(path.join(g, d), '.md')) { const p = path.join(g, d, f); out.push({ category: cat, name: f, path: d + '/' + f, desc: '', exists: true, size: safeSize(p) }); } }
  const dec = path.join(os.homedir(), '.great-pm', 'decisions.md');
  out.push({ category: 'Decisions', name: 'decisions.md · cross-project', path: '~decisions', desc: 'Durable cross-project decisions', exists: fs.existsSync(dec), size: safeSize(dec) });
  return { docs: out };
}
function readDoc(cwd, rel) {
  if (rel === '~decisions') { try { return { content: fs.readFileSync(path.join(os.homedir(), '.great-pm', 'decisions.md'), 'utf8').slice(0, 200000) }; } catch { return { content: '' }; } }
  const g = path.join(cwd, '.great-pm'); const f = path.resolve(g, rel || '');
  if (f !== g && !f.startsWith(g + path.sep)) return { error: 'forbidden' };
  try { return { content: fs.readFileSync(f, 'utf8').slice(0, 200000) }; } catch { return { content: '' }; }
}

// Self-documenting Help — reads the REAL agent/command descriptions from the
// plugin so the in-board guide never drifts from what's actually installed.
function guide() {
  const root = path.join(__dirname, '..');
  const fm = (dir) => listDir(path.join(root, dir), '.md').map(f => {
    let t = ''; try { t = fs.readFileSync(path.join(root, dir, f), 'utf8'); } catch {}
    const block = (t.match(/^---\n([\s\S]*?)\n---/) || [])[1] || t.slice(0, 800);
    const name = ((block.match(/^name:\s*(.+)$/m) || [])[1] || f.replace(/\.md$/, '')).trim();
    const desc = ((block.match(/^description:\s*(.+)$/m) || [])[1] || '').trim();
    return { name, desc };
  });
  return {
    agents: fm('agents'),
    commands: fm('commands').map(c => ({ name: '/' + c.name.replace(/^\//, ''), desc: c.desc })),
    skills: listDir(path.join(root, 'skills'), '').length,
  };
}

// Cost model — estimated from real agent runs (verdicts) × tunable rates.
// Override any of these in .great-pm/PROJECT.md (e.g. "llm-cost-per-run: 0.40").
function costModel(cwd) {
  let txt = ''; try { txt = fs.readFileSync(path.join(cwd, '.great-pm', 'PROJECT.md'), 'utf8'); } catch {}
  const num = (k, d) => { const m = txt.match(new RegExp('^\\s*' + k + ':\\s*\\$?([0-9.]+)', 'im')); return m ? parseFloat(m[1]) : d; };
  return { llmPerRun: num('llm-cost-per-run', 0.40), pmRate: num('pm-rate-per-hr', 80), pmHours: num('pm-hours-per-run', 3) };
}
function cost(cwd) {
  const lines = logs(cwd).lines; const m = costModel(cwd); const runs = lines.length;
  const llmSpend = runs * m.llmPerRun;
  const humanEquiv = runs * m.pmHours * m.pmRate;
  const byday = {};
  for (const l of lines) { const d = (l.ts || '').slice(0, 10); if (!d) continue; byday[d] = (byday[d] || 0) + 1; }
  const perDay = Object.entries(byday).sort().map(([date, r]) => ({ date, runs: r, llm: r * m.llmPerRun, human: r * m.pmHours * m.pmRate }));
  // If a real cost log exists, prefer it for the headline LLM spend.
  let logged = null;
  try {
    const cl = fs.readFileSync(path.join(cwd, '.great-pm', 'cost-history.log'), 'utf8').trim().split('\n').filter(Boolean);
    logged = cl.reduce((s, ln) => { const m2 = ln.match(/\$([0-9.]+)/); return s + (m2 ? parseFloat(m2[1]) : 0); }, 0);
  } catch {}
  return { runs, llmSpend: logged != null ? logged : llmSpend, humanEquiv, savingsX: (logged ?? llmSpend) > 0 ? humanEquiv / (logged ?? llmSpend) : 0, perDay, model: m, source: logged != null ? 'logged' : 'estimated' };
}

// ── mutate (write path) ───────────────────────────────────────────────────────
function bdRun(cwd, args) {
  const env = { ...process.env };
  const r = spawnSync('bd', args, { cwd, encoding: 'utf8', env, maxBuffer: 16 * 1024 * 1024 });
  if (r.error) return { ok: false, error: r.error.code === 'ENOENT' ? 'bd not found' : String(r.error.message) };
  if (r.status !== 0) return { ok: false, error: (r.stderr || r.stdout || `bd exited ${r.status}`).trim().slice(0, 400) };
  return { ok: true, out: (r.stdout || '').trim() };
}
function mutate(body) {
  const { action, project, id } = body;
  if (!isRegistered(project)) return { ok: false, error: 'unknown project' };
  const cwd = path.resolve(project);
  if (action === 'set-status') {
    const status = STATUS_OF_COLUMN[body.column];
    if (!status) return { ok: false, error: 'bad column' };
    if (!id) return { ok: false, error: 'missing id' };
    return bdRun(cwd, ['update', id, '--status', status]);
  }
  if (action === 'set-stage') {
    if (!id) return { ok: false, error: 'missing id' };
    if (body.newStage && !STAGES.includes(body.newStage)) return { ok: false, error: 'bad stage' };
    const args = ['update', id];
    if (body.oldStage && STAGES.includes(body.oldStage)) args.push('--remove-label', `stage-${body.oldStage}`);
    if (body.newStage) args.push('--add-label', `stage-${body.newStage}`);
    if (args.length === 2) return { ok: false, error: 'no stage change' };
    return bdRun(cwd, args);
  }
  if (action === 'set-gate') {
    if (!id) return { ok: false, error: 'missing id' };
    return bdRun(cwd, ['update', id, body.gate ? '--add-label' : '--remove-label', 'gate']);
  }
  if (action === 'create') {
    const title = (body.title || '').trim();
    if (!title) return { ok: false, error: 'title required' };
    const type = ['task', 'bug', 'feature'].includes(body.type) ? body.type : 'task';
    const prio = String(body.priority ?? '2').replace(/[^0-4]/g, '') || '2';
    const args = ['create', title, '--type', type, '-p', prio];
    if (body.stage && STAGES.includes(body.stage)) args.push('-l', `stage-${body.stage}`);
    return bdRun(cwd, args);
  }
  return { ok: false, error: 'unknown action' };
}

// ── http ──────────────────────────────────────────────────────────────────────
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
function sendJSON(res, code, obj) { const b = JSON.stringify(obj); res.writeHead(code, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }); res.end(b); }
function serveStatic(res, rel) {
  const file = path.join(PUBLIC, rel === '/' ? 'index.html' : rel.replace(/^\/+/, ''));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const project = u.searchParams.get('project');
  const guard = () => { if (!isRegistered(project)) { sendJSON(res, 400, { error: 'unknown or unregistered project' }); return false; } return true; };

  if (req.method === 'GET' && u.pathname === '/api/projects') return sendJSON(res, 200, { projects: readRegistry() });
  if (req.method === 'GET' && u.pathname === '/api/board') {
    if (!guard()) return; const r = bdList(path.resolve(project));
    if (r.error) return sendJSON(res, 200, { error: r.error, issues: [] });
    return sendJSON(res, 200, { issues: r.issues.map(normalize), stages: STAGES });
  }
  if (req.method === 'GET' && u.pathname === '/api/artifacts') { if (!guard()) return; return sendJSON(res, 200, artifacts(path.resolve(project))); }
  if (req.method === 'GET' && u.pathname === '/api/metrics') { if (!guard()) return; return sendJSON(res, 200, metrics(path.resolve(project))); }
  if (req.method === 'GET' && u.pathname === '/api/memory') { if (!guard()) return; return sendJSON(res, 200, memory(path.resolve(project))); }
  if (req.method === 'GET' && u.pathname === '/api/logs') { if (!guard()) return; return sendJSON(res, 200, logs(path.resolve(project))); }
  if (req.method === 'GET' && u.pathname === '/api/docs') { if (!guard()) return; return sendJSON(res, 200, docs(path.resolve(project))); }
  if (req.method === 'GET' && u.pathname === '/api/file') { if (!guard()) return; return sendJSON(res, 200, readDoc(path.resolve(project), u.searchParams.get('path'))); }
  if (req.method === 'GET' && u.pathname === '/api/cost') { if (!guard()) return; return sendJSON(res, 200, cost(path.resolve(project))); }
  if (req.method === 'GET' && u.pathname === '/api/guide') return sendJSON(res, 200, guide());
  if (req.method === 'POST' && u.pathname === '/api/mutate') {
    let raw = ''; req.on('data', c => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => { let body; try { body = JSON.parse(raw); } catch { return sendJSON(res, 400, { ok: false, error: 'bad json' }); } sendJSON(res, 200, mutate(body)); });
    return;
  }
  if (req.method === 'POST' && u.pathname === '/api/connect') {
    let raw = ''; req.on('data', c => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', async () => {
      let body; try { body = JSON.parse(raw); } catch { return sendJSON(res, 400, { status: 'error', error: 'bad json' }); }
      try {
        const { run } = await import('../connectors/cli.mjs');
        const { capability, verb, payload = {} } = body;
        const projectDir = body.projectDir || (project ? path.resolve(project) : process.cwd());
        sendJSON(res, 200, await run([capability, verb, '--json', JSON.stringify(payload)], { projectDir }));
      } catch (e) { sendJSON(res, 400, { status: 'error', error: e.message }); }
    });
    return;
  }
  if (req.method === 'GET') return serveStatic(res, u.pathname);
  res.writeHead(405); res.end('method not allowed');
});

server.listen(PORT, () => {
  console.log(`great-pm board → http://localhost:${PORT}`);
  if (!NO_OPEN) { const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'; try { spawn(opener, [`http://localhost:${PORT}`], { detached: true, stdio: 'ignore' }).unref(); } catch {} }
});
server.on('error', (e) => { console.error(e.code === 'EADDRINUSE' ? `port ${PORT} in use` : String(e)); process.exit(1); });
