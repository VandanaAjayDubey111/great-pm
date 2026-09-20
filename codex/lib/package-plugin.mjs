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
import {
  renderProductSkill,
  renderAgent,
  renderWorkflowSkill,
  renderWorkflowUi
} from './render.mjs';
import { splitFrontmatter, scalar } from './frontmatter.mjs';

const PORTABLE_DIRECTORIES = [
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

const PORTABLE_SCRIPTS = [
  'great-pm',
  'great-pm-connect',
  'great-pm-session-start.sh',
  'great-pm-skill-doctor.sh'
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

  await cp(
    path.join(source, 'codex', 'hooks'),
    path.join(output, 'hooks'),
    { recursive: true }
  );
  const outputScripts = path.join(output, 'scripts');
  await mkdir(outputScripts, { recursive: true });
  for (const script of PORTABLE_SCRIPTS) {
    await copyFile(
      path.join(source, 'scripts', script),
      path.join(outputScripts, script)
    );
  }
  await copyFile(
    path.join(source, 'codex', 'runtime', 'doctor.mjs'),
    path.join(outputScripts, 'great-pm-codex-doctor.mjs')
  );
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
    const uiDirectory = path.join(outputDirectory, 'agents');
    await mkdir(uiDirectory, { recursive: true });
    await writeFile(
      path.join(uiDirectory, 'openai.yaml'),
      renderWorkflowUi(workflowName),
      'utf8'
    );
  }
}

async function renderSkills(source, output, counts) {
  await mkdir(path.join(output, 'skills'), { recursive: true });
  await renderProductSkills(source, output);
  await renderWorkflowSkills(source, output, counts.workflows);
  await cp(
    path.join(source, 'codex', 'source-skills', 'great-pm-runtime'),
    path.join(output, 'skills', 'great-pm-runtime'),
    { recursive: true }
  );
}

async function renderAgents(source, output, agentNames) {
  const outputDirectory = path.join(output, 'agents');
  await mkdir(outputDirectory, { recursive: true });
  for (const agentName of agentNames) {
    const sourceFile = path.join(source, 'agents', `${agentName}.md`);
    const text = await readFile(sourceFile, 'utf8');
    await writeFile(
      path.join(outputDirectory, `${agentName}.md`),
      renderAgent(text, sourceFile),
      'utf8'
    );
  }
}

async function writeParity(output, counts) {
  await mkdir(path.join(output, 'codex'), { recursive: true });
  const parity = {
    agents: [...counts.agents].sort(),
    gates: ['gate:launch', 'gate:spec', 'gate:strategy'],
    productSkills: [...counts.skills].sort(),
    stages: [
      'discover',
      'strategize',
      'prioritize',
      'define',
      'launch',
      'measure'
    ],
    templates: [...counts.templates].sort(),
    workflows: [...counts.workflows].sort()
  };
  await writeFile(
    path.join(output, 'codex', 'parity.json'),
    `${JSON.stringify(parity, null, 2)}\n`,
    'utf8'
  );
}

async function writeManifest(output) {
  const manifest = {
    name: 'great-pm',
    version: '1.1.3',
    description: 'The complete GreatPM product-management operating system for Codex.',
    author: {
      name: 'Vandana Dubey',
      url: 'https://github.com/VandanaAjayDubey111'
    },
    homepage: 'https://github.com/VandanaAjayDubey111/great-pm',
    repository: 'https://github.com/VandanaAjayDubey111/great-pm',
    license: 'MIT',
    keywords: ['product-management', 'ai-pm', 'multi-agent', 'codex'],
    skills: './skills/',
    interface: {
      displayName: 'GreatPM',
      shortDescription: 'Your complete product team in Codex',
      longDescription: 'Run discovery, strategy, prioritization, specification, launch, and measurement with specialist agents and human decision gates.',
      developerName: 'Vandana Dubey',
      category: 'Productivity',
      capabilities: ['Interactive', 'Read', 'Write', 'Subagents', 'Hooks'],
      websiteURL: 'https://github.com/VandanaAjayDubey111/great-pm',
      privacyPolicyURL: 'https://github.com/VandanaAjayDubey111/great-pm/blob/main/PRIVACY.md',
      defaultPrompt: [
        'Start a GreatPM product initiative.',
        'Show my pending product decisions.',
        'Resume my GreatPM product loop.'
      ],
      brandColor: '#10A37F'
    }
  };
  const directory = path.join(output, '.codex-plugin');
  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, 'plugin.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
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
  await renderAgents(source, output, counts.agents);
  await writeParity(output, counts);
  await writeManifest(output);

  return {
    counts: {
      agents: counts.agents.length,
      productSkills: counts.skills.length,
      workflows: counts.workflows.length,
      templates: counts.templates.length
    }
  };
}
