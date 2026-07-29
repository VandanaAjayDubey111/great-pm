export function splitFrontmatter(text, source) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${source}: missing YAML frontmatter`);
  return { yaml: match[1], body: match[2] };
}

export function scalar(yaml, key, source) {
  const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(yaml);
  if (!match) throw new Error(`${source}: missing ${key}`);
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}
