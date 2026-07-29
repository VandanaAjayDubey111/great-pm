import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inventory } from '../lib/inventory.mjs';

test('canonical GreatPM inventory is complete', async () => {
  const result = await inventory(new URL('../../', import.meta.url));
  assert.equal(result.agents.length, 48);
  assert.equal(result.skills.length, 79);
  assert.equal(result.workflows.length, 34);
  assert.equal(result.templates.length, 26);
  assert.equal(new Set(result.agents).size, 48);
  assert.equal(new Set(result.skills).size, 79);
  assert.equal(new Set(result.workflows).size, 34);
});

test('supporting files are not counted as skills', async () => {
  const result = await inventory(new URL('../../', import.meta.url));
  assert.equal(result.skills.includes('WORKFLOW'), false);
});

test('published metadata uses canonical counts', async () => {
  const root = new URL('../../', import.meta.url);
  const read = async (relative) => readFile(new URL(relative, root), 'utf8');
  const readme = await read('README.md');
  const marketplace = await read('.claude-plugin/marketplace.json');
  const operatingModel = await read('skills/great-pm/SKILL.md');
  const help = await read('commands/pm-help.md');
  assert.match(readme, /48 agents · 79 skills · 34 commands/);
  assert.match(marketplace, /48 specialist PM agents, 79 skills/);
  assert.match(operatingModel, /48 agents installed/);
  assert.match(operatingModel, /79-skill library/);
  assert.match(help, /commands listed \(34 total\)/);
});
