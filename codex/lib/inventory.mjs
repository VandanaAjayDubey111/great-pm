import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { splitFrontmatter, scalar } from './frontmatter.mjs';

async function files(dir, predicate) {
  return (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && predicate(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function skillNames(root) {
  const dir = path.join(root, 'skills');
  const entries = await readdir(dir, { withFileTypes: true });
  const names = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(dir, entry.name, 'SKILL.md');
    try {
      const text = await readFile(skillPath, 'utf8');
      const { yaml } = splitFrontmatter(text, skillPath);
      names.push(scalar(yaml, 'name', skillPath));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  return names;
}

export async function inventory(rootUrl) {
  const root = fileURLToPath(rootUrl);
  return {
    agents: (await files(path.join(root, 'agents'), (name) => name.endsWith('.md')))
      .map((name) => name.slice(0, -3)),
    skills: await skillNames(root),
    workflows: (await files(path.join(root, 'commands'), (name) => name.endsWith('.md')))
      .map((name) => name.slice(0, -3)),
    templates: await files(path.join(root, 'templates'), () => true)
  };
}
