import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const hook = fileURLToPath(new URL('../hooks/pre-tool-use.mjs', import.meta.url));

function run(input) {
  return spawnSync(process.execPath, [hook], {
    input: JSON.stringify(input),
    encoding: 'utf8'
  });
}

test('dangerous shell commands are blocked', () => {
  const result = run({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'git reset --hard' }
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Dangerous command pattern/);
});

test('secret-looking file content is blocked', () => {
  const result = run({
    hook_event_name: 'PreToolUse',
    tool_name: 'apply_patch',
    tool_input: { patch: 'token=ghp_12345678901234567890' }
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Potential API key or token/);
});

test('safe commands pass', () => {
  const result = run({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'npm test' }
  });
  assert.equal(result.status, 0);
});
