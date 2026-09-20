import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const read = (relative) => readFile(new URL(relative, root), 'utf8');

test('Codex public installation and operations are documented', async () => {
  const [guide, readme, parity, workflow] = await Promise.all([
    read('docs/CODEX.md'),
    read('README.md'),
    read('docs/CODEX-PARITY.md'),
    read('.github/workflows/codex-plugin-ci.yml')
  ]);

  assert.match(guide, /codex plugin marketplace add VandanaAjayDubey111\/great-pm/);
  assert.match(guide, /codex plugin add great-pm@great-pm/);
  assert.match(guide, /codex plugin remove great-pm@great-pm/);
  assert.match(guide, /48 agents/);
  assert.match(guide, /79 product-management skills/);
  assert.match(guide, /34 workflows/);
  assert.match(guide, /\$pm-help/);
  assert.match(guide, /hook review/i);
  assert.match(guide, /outside (?:the )?Codex.*sandbox/i);
  assert.match(guide, /\/hooks/);
  assert.doesNotMatch(guide, /Hooks operate only with the permissions available to the Codex\s+session/);
  assert.match(readme, /Codex desktop and Codex CLI/);
  assert.match(readme, /docs\/CODEX\.md/);
  assert.match(parity, /CLI smoke \| PASS/);
  assert.match(parity, /Desktop UI \| BLOCKED/);
  assert.match(workflow, /npm run check:generated/);
  assert.match(workflow, /great-pm-skill-doctor\.sh/);
});
