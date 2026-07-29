import { packagePlugin } from '../lib/package-plugin.mjs';

const result = await packagePlugin({
  sourceRoot: new URL('../../', import.meta.url),
  outputRoot: new URL('../../plugins/great-pm/', import.meta.url)
});
process.stdout.write(`${JSON.stringify(result)}\n`);
