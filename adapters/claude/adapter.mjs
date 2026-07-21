// adapters/claude/adapter.mjs
// The Claude Code platform adapter for the Seam. Claude is great-pm's native
// host, so this adapter is thin: it binds the neutral `great-pm connect`
// interface and maps capabilities to Claude tool grants. Reference implementation
// of the adapter contract (see ../README.md) — OpenAI/Gemini adapters copy this shape.
import { run } from '../../connectors/cli.mjs';

export const name = 'claude';

// job ① (translate agents): map capabilities -> Claude tool-grant strings.
// Every capability is reached through the one neutral command, so the grant is uniform.
export function capabilityGrants(capabilities = []) {
  return capabilities.length ? ['Bash(great-pm connect:*)'] : [];
}

// job ② (bind interface): route `great-pm <sub> ...` into the connector engine.
export async function dispatch(argv, opts = {}) {
  const [sub, ...rest] = argv;
  if (sub === 'connect') return run(rest, opts);
  if (sub === 'setup') return run(['setup', ...rest], opts);
  throw new Error(`unknown command '${sub || ''}' — try: great-pm connect <cap> <verb> | great-pm setup <tool>`);
}
