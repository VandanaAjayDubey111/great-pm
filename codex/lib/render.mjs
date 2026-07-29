import { splitFrontmatter, scalar } from './frontmatter.mjs';

export const HOST_BINDING = `## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Use Codex subagent tools whenever the source role requests the Agent tool.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.
`;

const yamlString = (value) => JSON.stringify(value);

export function renderProductSkill(text, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const name = scalar(yaml, 'name', source);
  const description = scalar(yaml, 'description', source);
  const packagedName = name === 'pm-audit' ? 'method-pm-audit' : name;
  return `---
name: ${packagedName}
description: ${yamlString(description)}
---

${HOST_BINDING}
${body}`;
}

export function renderWorkflowSkill(text, workflowName, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const description = scalar(yaml, 'description', source);
  const converted = body
    .replaceAll('${CLAUDE_PLUGIN_ROOT}', '${PLUGIN_ROOT}')
    .replace(/\/pm-([a-z-]+)/g, '$pm-$1')
    .replaceAll('`pm-audit` skill', '`method-pm-audit` skill')
    .replaceAll('Agent tool', 'Codex subagent tools');
  return `---
name: ${workflowName}
description: ${yamlString(description)}
---

${HOST_BINDING}
${converted}`;
}

export function renderWorkflowUi(workflowName) {
  return `interface:
  display_name: "GreatPM workflow"
  short_description: "Run a GreatPM product-management workflow"
  default_prompt: "Use $${workflowName} on my current product initiative."
policy:
  allow_implicit_invocation: true
`;
}

export function renderAgent(text, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const name = scalar(yaml, 'name', source);
  const description = scalar(yaml, 'description', source);
  const converted = body
    .replaceAll('${CLAUDE_PLUGIN_ROOT}', '${PLUGIN_ROOT}')
    .replace(/\/pm-([a-z-]+)/g, '$pm-$1')
    .replaceAll('`pm-audit` skill', '`method-pm-audit` skill')
    .replaceAll('Agent tool', 'Codex subagent tools');
  return `---
name: ${name}
description: ${JSON.stringify(description)}
---

## Codex role binding

- Run this role as a Codex subagent with a bounded, self-contained assignment.
- Inherit the parent session permissions; request no broader authority.
- Use the product skills named in the canonical role when they are packaged.
- Preserve DONE/BLOCKED reporting, artefact paths, and human gates.
- Return a concise verdict to the parent GreatPM workflow.

${converted}`;
}
