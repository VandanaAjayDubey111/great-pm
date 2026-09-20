import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function diagnose(cwd) {
  const project = path.join(cwd, '.great-pm/PROJECT.md');
  const missing = [];
  if (!(await exists(project))) missing.push('.great-pm/PROJECT.md');
  return {
    ok: missing.length === 0,
    missing,
    next: missing.length
      ? 'Copy templates/PROJECT.md.template to .great-pm/PROJECT.md and customize it.'
      : 'Run the pm-help skill or start a GreatPM initiative.'
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await diagnose(process.cwd());
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.ok ? 0 : 1;
}
