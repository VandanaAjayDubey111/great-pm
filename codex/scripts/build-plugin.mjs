import { packagePlugin } from '../lib/package-plugin.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { renderParityDoc } from '../lib/parity-doc.mjs';

const result = await packagePlugin({
  sourceRoot: new URL('../../', import.meta.url),
  outputRoot: new URL('../../plugins/great-pm/', import.meta.url)
});
const parity = JSON.parse(
  await readFile(new URL('../../plugins/great-pm/codex/parity.json', import.meta.url), 'utf8')
);
await writeFile(
  new URL('../../docs/CODEX-PARITY.md', import.meta.url),
  renderParityDoc(parity),
  'utf8'
);
process.stdout.write(`${JSON.stringify(result)}\n`);
