// connectors/cli.mjs
import { loadConfig, loadSecrets, requireSecret } from './registry.mjs';
import { decide, audit } from './governor.mjs';
import { mockConnector } from './mock.mjs';

// Resolve a connector module for capability+tool. Piece A wires only 'mock';
// real tools (notion/slack/linear/jira/amplitude) register here in pieces C/D/E.
async function resolveConnector(capability, cfg, projectDir) {
  const tool = cfg.tool;
  if (tool == null || tool === 'mock') return mockConnector(capability);
  if (tool === 'notion') {
    if (capability !== 'docs') throw new Error(`notion serves 'docs', not '${capability}'`);
    const { notionConnector } = await import('./notion.mjs');
    const secrets = loadSecrets(projectDir);
    return notionConnector({ token: requireSecret(secrets, 'NOTION_TOKEN'), parent: cfg.parent });
  }
  if (tool === 'confluence') {
    if (capability !== 'docs') throw new Error(`confluence serves 'docs', not '${capability}'`);
    const { confluenceConnector } = await import('./confluence.mjs');
    const secrets = loadSecrets(projectDir);
    return confluenceConnector({ token: requireSecret(secrets, 'CONFLUENCE_TOKEN'), site: cfg.site, email: cfg.email, space: cfg.space });
  }
  if (tool === 'slack') {
    if (capability !== 'comms') throw new Error(`slack serves 'comms', not '${capability}'`);
    const { slackConnector } = await import('./slack.mjs');
    const secrets = loadSecrets(projectDir);
    return slackConnector({ token: requireSecret(secrets, 'SLACK_TOKEN'), channel: cfg.channel });
  }
  if (tool === 'linear') {
    if (capability !== 'tracker') throw new Error(`linear serves 'tracker', not '${capability}'`);
    const { linearConnector } = await import('./linear.mjs');
    const secrets = loadSecrets(projectDir);
    return linearConnector({ token: requireSecret(secrets, 'LINEAR_TOKEN'), team: cfg.team });
  }
  if (tool === 'jira') {
    if (capability !== 'tracker') throw new Error(`jira serves 'tracker', not '${capability}'`);
    const { jiraConnector } = await import('./jira.mjs');
    const secrets = loadSecrets(projectDir);
    return jiraConnector({ token: requireSecret(secrets, 'JIRA_TOKEN'), site: cfg.site, email: cfg.email, project: cfg.project, issuetype: cfg.issuetype });
  }
  if (tool === 'csv') {
    if (capability !== 'analytics') throw new Error(`csv serves 'analytics', not '${capability}'`);
    const { csvAnalytics } = await import('./analytics.mjs');
    return csvAnalytics({ path: cfg.path, projectDir });
  }
  if (tool === 'amplitude') {
    if (capability !== 'analytics') throw new Error(`amplitude serves 'analytics', not '${capability}'`);
    const { amplitudeAnalytics } = await import('./analytics.mjs');
    const secrets = loadSecrets(projectDir);
    return amplitudeAnalytics({ apiKey: requireSecret(secrets, 'AMPLITUDE_API_KEY'), secretKey: requireSecret(secrets, 'AMPLITUDE_SECRET_KEY'), dataCenter: cfg.dataCenter });
  }
  throw new Error(`no connector for tool '${tool}' yet`);
}

// run(argv, opts) -> result object. argv e.g. ['docs','write','--json','{...}']
export async function run(argv, { projectDir = process.cwd() } = {}) {
  const [capability, verb, ...rest] = argv;

  if (capability === 'setup') {
    const { setup, writeSecret } = await import('./setup.mjs');
    const tool = verb; // 'great-pm connect setup notion'
    const ti = rest.indexOf('--token');
    if (ti !== -1 && rest[ti + 1]) {
      const envKey = `${tool.toUpperCase()}_TOKEN`;
      writeSecret(projectDir, envKey, rest[ti + 1]);
      return { status: 'connected', tool, stored: envKey };
    }
    return { status: 'guide', tool, message: setup(tool) };
  }

  if (!capability || !verb) throw new Error('usage: great-pm connect <capability> <verb> [--json <payload>]');

  let payload = {};
  const ji = rest.indexOf('--json');
  if (ji !== -1 && rest[ji + 1]) payload = JSON.parse(rest[ji + 1]);

  const cfg = loadConfig(projectDir)[capability] || {};
  const mode = cfg.write || 'auto';
  const connector = await resolveConnector(capability, cfg, projectDir);

  const verdict = decide({ capability, verb, payload, mode });
  const entry = { capability, verb, mode, decision: verdict.decision, reason: verdict.reason };

  if (verdict.decision === 'propose') {
    audit({ ...entry, executed: false }, projectDir);
    return { status: 'proposed', reason: verdict.reason, capability, verb, payload };
  }
  const result = await connector[verb](payload);
  // safety floor #2 (reversible) — record the write's result (id/url) so it can be reversed later
  audit({ ...entry, executed: true, result }, projectDir);
  return { status: 'done', capability, verb, result };
}
