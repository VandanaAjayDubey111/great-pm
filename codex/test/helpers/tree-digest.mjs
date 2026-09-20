import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

async function relativeFiles(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await relativeFiles(root, absolute));
    } else if (entry.isFile()) {
      files.push(path.relative(root, absolute).split(path.sep).join('/'));
    }
  }

  return files;
}

export async function treeDigest(root) {
  const files = await relativeFiles(root);
  const aggregate = createHash('sha256');
  const hashes = {};

  for (const relative of files) {
    const content = await readFile(path.join(root, relative));
    const contentHash = createHash('sha256').update(content).digest('hex');
    hashes[relative] = contentHash;
    aggregate.update(relative);
    aggregate.update('\0');
    aggregate.update(content);
    aggregate.update('\0');
  }

  return {
    digest: aggregate.digest('hex'),
    files,
    hashes
  };
}
