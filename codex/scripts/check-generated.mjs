import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packagePlugin } from '../lib/package-plugin.mjs';
import { renderParityDoc } from '../lib/parity-doc.mjs';
import { treeDigest } from '../test/helpers/tree-digest.mjs';

const temp = await mkdtemp(path.join(os.tmpdir(), 'greatpm-generated-'));
const committed = fileURLToPath(
  new URL('../../plugins/great-pm/', import.meta.url)
);

try {
  await packagePlugin({
    sourceRoot: new URL('../../', import.meta.url),
    outputRoot: temp
  });
  const expected = await treeDigest(temp);
  const actual = await treeDigest(committed);
  const parity = JSON.parse(
    await readFile(path.join(temp, 'codex', 'parity.json'), 'utf8')
  );
  const smokeEvidence = JSON.parse(
    await readFile(new URL('../smoke-evidence.json', import.meta.url), 'utf8')
  );
  const expectedDoc = renderParityDoc(parity, smokeEvidence);
  const actualDoc = await readFile(
    new URL('../../docs/CODEX-PARITY.md', import.meta.url),
    'utf8'
  );

  if (expected.digest !== actual.digest || expectedDoc !== actualDoc) {
    const paths = [...new Set([...expected.files, ...actual.files])].sort();
    process.stderr.write('Committed GreatPM Codex package is stale:\n');
    for (const relative of paths) {
      if (expected.hashes[relative] !== actual.hashes[relative]) {
        const state = !(relative in actual.hashes)
          ? 'missing'
          : !(relative in expected.hashes)
            ? 'unexpected'
            : 'changed';
        process.stderr.write(`- ${state}: ${relative}\n`);
      }
    }
    if (expectedDoc !== actualDoc) {
      process.stderr.write('- changed: docs/CODEX-PARITY.md\n');
    }
    process.exitCode = 1;
  } else {
    process.stdout.write(
      `Generated GreatPM package is current (${actual.files.length} files).\n`
    );
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}
