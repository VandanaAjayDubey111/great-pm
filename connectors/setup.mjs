// connectors/setup.mjs
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Where each tool's API token is created. Used by the BYOT wizard to deep-link
// the user. Real per-tool token validation lands with each connector (C/D/E).
const TOKEN_URLS = {
  notion: 'https://www.notion.so/my-integrations',
  slack:  'https://api.slack.com/apps',
  linear: 'https://linear.app/settings/api',
  jira:   'https://id.atlassian.com/manage-profile/security/api-tokens',
  confluence: 'https://id.atlassian.com/manage-profile/security/api-tokens',
  amplitude: 'https://amplitude.com/settings/projects',
};

export function tokenUrl(tool) {
  const u = TOKEN_URLS[tool];
  if (!u) throw new Error(`no setup guide for tool '${tool}'`);
  return u;
}

export function writeSecret(projectDir, key, value) {
  const dir = join(projectDir, '.great-pm');
  mkdirSync(dir, { recursive: true });
  appendFileSync(join(dir, 'secrets.env'), `${key}=${value}\n`);
}

// setup(tool) — the wizard text. Returns the guidance string (printed by the CLI).
export function setup(tool) {
  return [
    `Connect ${tool} to great-pm:`,
    `  1. Create a token here: ${tokenUrl(tool)}`,
    `  2. Run: great-pm connect setup ${tool} --token <YOUR_TOKEN>`,
    `     (stored in .great-pm/secrets.env — gitignored)`,
  ].join('\n');
}
