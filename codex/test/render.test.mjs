import test from 'node:test';
import assert from 'node:assert/strict';
import { renderWorkflowSkill } from '../lib/render.mjs';

test('host conversion preserves filesystem paths and URLs while converting workflow invocations', () => {
  const result = renderWorkflowSkill(`---
description: Test workflow
---
Invoke /pm-help and /grill-me.
Read \`\${CLAUDE_PLUGIN_ROOT}/agents/pm-reviewer.md\`.
Write to .great-pm/verdicts/pm-gate.log and .great-pm/verdicts/grill-me.log.
Keep /pm-reviewer.md, https://pm-help.example and https://example.org/pm-help intact.
`, 'pm-help', 'test.md');

  assert.ok(result.includes('Invoke $pm-help and $grill-me.'));
  assert.ok(result.includes('${PLUGIN_ROOT}/agents/pm-reviewer.md'));
  assert.ok(result.includes('.great-pm/verdicts/pm-gate.log'));
  assert.ok(result.includes('.great-pm/verdicts/grill-me.log'));
  assert.ok(result.includes('/pm-reviewer.md'));
  assert.ok(result.includes('https://pm-help.example'));
  assert.ok(result.includes('https://example.org/pm-help'));
});
