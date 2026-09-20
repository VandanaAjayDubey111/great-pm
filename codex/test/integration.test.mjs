import test from 'node:test';
import assert from 'node:assert/strict';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { diagnose } from '../runtime/doctor.mjs';

const plugin = new URL('../../plugins/great-pm/', import.meta.url);

test('packaged GreatPM starts from a compatible product workspace', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-integration-'));
  try {
    await mkdir(path.join(temp, '.great-pm'), { recursive: true });
    await copyFile(
      new URL('templates/PROJECT.md.template', plugin),
      path.join(temp, '.great-pm/PROJECT.md')
    );

    const doctor = await diagnose(temp);
    const parity = JSON.parse(
      await readFile(new URL('codex/parity.json', plugin), 'utf8')
    );
    const startSkill = await readFile(
      new URL('skills/pm-start/SKILL.md', plugin),
      'utf8'
    );
    const runtimeSkill = await readFile(
      new URL('skills/great-pm-runtime/SKILL.md', plugin),
      'utf8'
    );

    assert.equal(doctor.ok, true);
    assert.equal(parity.stages.length, 6);
    assert.equal(parity.gates.length, 3);
    assert.match(startSkill, /gate:strategy/);
    assert.match(startSkill, /user-researcher/);
    assert.match(startSkill, /feedback-synthesizer/);
    assert.match(startSkill, /market-analyst/);
    assert.match(runtimeSkill, /Only the human may approve/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
