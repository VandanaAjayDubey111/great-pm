import {
  copyFile,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile
} from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { inventory } from './inventory.mjs';
import { renderProductSkill, renderWorkflowSkill } from './render.mjs';
import { splitFrontmatter, scalar } from './frontmatter.mjs';

const PORTABLE_DIRECTORIES = [
  'agents',
  'adapters',
  'board',
  'connectors',
  'templates'
];

const PORTABLE_FILES = [
  'LICENSE',
  'NOTICE.md',
  'PRIVACY.md',
  'SECURITY.md'
];

async function copyPortableRuntime(source, output) {
  for (const directory of PORTABLE_DIRECTORIES) {
    await cp(path.join(source, directory), path.join(output, directory), {
      recursive: true
    });
  }

  await cp(path.join(source, 'commands'), path.join(output, 'commands'), {
    recursive: true
  });

  for (const file of PORTABLE_FILES) {
    await copyFile(path.join(source, file), path.join(output, file));
  }
}

async function renderProductSkills(source, output) {
  const sourceSkills = path.join(source, 'skills');
  const entries = await readdir(sourceSkills, { withFileTypes: true });

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const sourceFile = path.join(sourceSkills, entry.name, 'SKILL.md');
    let text;
    try {
      text = await readFile(sourceFile, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    const { yaml } = splitFrontmatter(text, sourceFile);
    const canonicalName = scalar(yaml, 'name', sourceFile);
    const packagedName = canonicalName === 'pm-audit'
      ? 'method-pm-audit'
      : canonicalName;
    const outputDirectory = path.join(output, 'skills', packagedName);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(
      path.join(outputDirectory, 'SKILL.md'),
      renderProductSkill(text, sourceFile),
      'utf8'
    );
  }
}

async function renderWorkflowSkills(source, output, workflowNames) {
  for (const workflowName of workflowNames) {
    const sourceFile = path.join(source, 'commands', `${workflowName}.md`);
    const text = await readFile(sourceFile, 'utf8');
    const outputDirectory = path.join(output, 'skills', workflowName);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(
      path.join(outputDirectory, 'SKILL.md'),
      renderWorkflowSkill(text, workflowName, sourceFile),
      'utf8'
    );
  }
}

async function renderSkills(source, output, counts) {
  await mkdir(path.join(output, 'skills'), { recursive: true });
  await renderProductSkills(source, output);
  await renderWorkflowSkills(source, output, counts.workflows);
}

async function writeParity(output, counts) {
  await mkdir(path.join(output, 'codex'), { recursive: true });
  const parity = {
    agents: [...counts.agents].sort(),
    productSkills: [...counts.skills].sort(),
    templates: [...counts.templates].sort(),
    workflows: [...counts.workflows].sort()
  };
  await writeFile(
    path.join(output, 'codex', 'parity.json'),
    `${JSON.stringify(parity, null, 2)}\n`,
    'utf8'
  );
}

export async function packagePlugin({ sourceRoot, outputRoot }) {
  const source = sourceRoot instanceof URL
    ? fileURLToPath(sourceRoot)
    : path.resolve(sourceRoot);
  const output = outputRoot instanceof URL
    ? fileURLToPath(outputRoot)
    : path.resolve(outputRoot);
  const sourceUrl = sourceRoot instanceof URL
    ? sourceRoot
    : new URL(`file://${path.resolve(sourceRoot)}/`);
  const counts = await inventory(sourceUrl);

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await copyPortableRuntime(source, output);
  await renderSkills(source, output, counts);
  await writeParity(output, counts);

  return {
    counts: {
      agents: counts.agents.length,
      productSkills: counts.skills.length,
      workflows: counts.workflows.length,
      templates: counts.templates.length
    }
  };
}
