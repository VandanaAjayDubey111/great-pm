const table = (headers, rows) => {
  const heading = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  return `${heading}\n${divider}\n${body}`;
};

export function renderParityDoc(parity, smokeEvidence = null) {
  const roles = parity.agents.map((name) => [
    `\`${name}\``,
    `\`plugins/great-pm/agents/${name}.md\``
  ]);
  const skills = parity.productSkills.map((name) => {
    const packaged = name === 'pm-audit' ? 'method-pm-audit' : name;
    return [
      `\`${name}\``,
      `\`plugins/great-pm/skills/${packaged}/SKILL.md\``
    ];
  });
  const workflows = parity.workflows.map((name) => [
    `\`${name}\``,
    `\`$${name}\``,
    `\`plugins/great-pm/skills/${name}/SKILL.md\``
  ]);
  const runtime = [
    ['Product loop', parity.stages.map((stage) => `\`${stage}\``).join(', '), '6 stages'],
    ['Human gates', parity.gates.map((gate) => `\`${gate}\``).join(', '), 'Human approval only'],
    ['Lifecycle', '`SessionStart`, `SubagentStart`, `PreCompact`, `SessionEnd`', 'Packaged hooks'],
    ['Safety', '`PreToolUse`', 'Destructive-command and secret-write guard'],
    ['Board', '`plugins/great-pm/board/`', 'Local product board'],
    ['State', '`.great-pm/`', 'Project context, drafts, verdicts, logs, handoff'],
    ['Connectors', '`plugins/great-pm/connectors/`', 'Governed connector engine'],
    ['Adapters', '`plugins/great-pm/adapters/`', 'Shared host-neutral adapters'],
    ['Templates', `${parity.templates.length} packaged templates`, '`plugins/great-pm/templates/`'],
    ['Evidence', '`cd codex && npm test && npm run check:generated`', 'Parity and drift gates']
  ];

  const smoke = smokeEvidence
    ? `
## Local smoke evidence

- Date: ${smokeEvidence.date}
- Platform: ${smokeEvidence.platform}
- CLI: ${smokeEvidence.cliVersion}
- Desktop app: ${smokeEvidence.desktopVersion}

${table(
  ['Check', 'Result', 'Evidence'],
  smokeEvidence.results.map((result) => [
    result.check,
    result.status,
    result.evidence
  ])
)}
`
    : '';

  return `# GreatPM Codex Parity

This record is generated from \`plugins/great-pm/codex/parity.json\`. The
canonical source and the public Codex package contain ${parity.agents.length}
specialist roles, ${parity.productSkills.length} product-management skills,
${parity.workflows.length} workflow entry points, and
${parity.templates.length} templates.

## Specialist roles

${table(['Role', 'Packaged path'], roles)}

## Product-management skills

${table(['Canonical skill', 'Packaged path'], skills)}

## Workflow entry points

${table(['Workflow', 'Codex invocation', 'Packaged path'], workflows)}

## Operating-system capabilities and evidence

${table(['Capability', 'Contract', 'Evidence'], runtime)}
${smoke}
`.trimEnd() + '\n';
}
