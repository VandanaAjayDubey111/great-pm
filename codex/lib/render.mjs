import { splitFrontmatter, scalar } from './frontmatter.mjs';

export const HOST_BINDING = `## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Before delegating to any specialist, read the \`great-pm-runtime\` skill and the selected packaged role file.
- Treat "invoke", "assign", "delegate", "spawn", and source Agent-tool instructions as a required Codex \`spawn_agent\` call with that role and a bounded assignment.
- Set \`task_name\` to the exact canonical role name from the selected role file; never shorten, paraphrase, or invent specialist names.
- Store every returned agent identifier. Never call a wait tool until a spawn has returned an identifier, and wait only on identifiers returned by successful spawns.
- If \`spawn_agent\` is unavailable or a spawn fails, report BLOCKED; do not impersonate the specialist or wait on an empty agent set.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.
`;

const yamlString = (value) => JSON.stringify(value);

function convertHostText(text) {
  return text
    .replaceAll(
      '${CLAUDE_PLUGIN_ROOT:-$HOME/great-pm}',
      '${PLUGIN_ROOT}'
    )
    .replaceAll('${CLAUDE_PLUGIN_ROOT}', '${PLUGIN_ROOT}')
    .replaceAll('$HOME/great-pm/', '${PLUGIN_ROOT}/')
    .replaceAll('~/great-pm/', '${PLUGIN_ROOT}/')
    .replace(/\/pm-([a-z-]+)/g, '$pm-$1')
    .replaceAll('`pm-audit` skill', '`method-pm-audit` skill')
    .replaceAll('Agent tool', 'Codex subagent tools');
}

export function renderProductSkill(text, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const name = scalar(yaml, 'name', source);
  const description = scalar(yaml, 'description', source);
  const packagedName = name === 'pm-audit' ? 'method-pm-audit' : name;
  const converted = convertHostText(body);
  return `---
name: ${packagedName}
description: ${yamlString(description)}
---

${HOST_BINDING}
${converted}`;
}

export function renderWorkflowSkill(text, workflowName, source) {
  const { yaml, body } = splitFrontmatter(text, source);
  const description = scalar(yaml, 'description', source);
  const converted = convertHostText(body);
  return `---
name: ${workflowName}
description: ${yamlString(description)}
---

${HOST_BINDING}
${converted}`;
}

export function renderWorkflowUi(workflowName) {
  const displayName = workflowName === 'pm-grill'
    ? 'GreatPM: Grill Me'
    : 'GreatPM workflow';
  return `interface:
  display_name: "${displayName}"
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
  const converted = convertHostText(body);
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
