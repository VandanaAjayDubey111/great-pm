// connectors/registry.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Safe-by-default for public adopters pointing great-pm at their real tools:
// every write starts in 'ask' — nothing reaches an external tool without explicit
// approval. Adopters raise a connector to 'gate' or 'auto' once they trust it
// (via the setup wizard or .great-pm/connectors.json). Reads are always free.
const DEFAULTS = {
  docs:      { tool: null,    write: 'ask' },
  comms:     { tool: null,    write: 'ask' },
  tracker:   { tool: 'beads', write: 'ask' },
  repo:      { tool: 'git',   write: 'ask' },
  analytics: { tool: null,    read: true },
};

export function loadConfig(projectDir) {
  const path = join(projectDir, '.great-pm', 'connectors.json');
  if (!existsSync(path)) return structuredClone(DEFAULTS);
  let parsed;
  try { parsed = JSON.parse(readFileSync(path, 'utf8')); }
  catch (e) { throw new Error(`invalid connectors.json: ${e.message}`); }
  const merged = structuredClone(DEFAULTS);
  for (const k of Object.keys(parsed)) merged[k] = { ...(merged[k] || {}), ...parsed[k] };
  return merged;
}

// Reads .great-pm/secrets.env (KEY=VALUE lines). Returns a plain object; does NOT
// mutate process.env. Lines starting with # and blank lines are ignored.
export function loadSecrets(projectDir) {
  const path = join(projectDir, '.great-pm', 'secrets.env');
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

// Fail-loud accessor. Checks the loaded secrets map, then process.env. Throws if absent.
export function requireSecret(secrets, key) {
  const v = secrets?.[key] ?? process.env[key];
  if (!v) throw new Error(`missing required secret: ${key} (set it in .great-pm/secrets.env)`);
  return v;
}
