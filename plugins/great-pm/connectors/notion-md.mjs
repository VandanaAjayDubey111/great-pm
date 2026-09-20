// connectors/notion-md.mjs
// Minimal markdown <-> Notion blocks converter for the docs connector.
// Supports headings (#, ##, ###), paragraphs, bullet list items, and code fences.
// Anything else degrades to a paragraph — good enough for great-pm artifacts.

const RT_MAX = 2000; // Notion caps a single rich_text object's content at 2000 chars
const rt = (content = '') => {
  const s = String(content);
  if (s.length <= RT_MAX) return [{ type: 'text', text: { content: s } }];
  const parts = [];
  for (let i = 0; i < s.length; i += RT_MAX) parts.push({ type: 'text', text: { content: s.slice(i, i + RT_MAX) } });
  return parts; // split long lines across multiple rich_text objects so the API doesn't reject
};
const textOf = (block) => (block?.[block.type]?.rich_text || [])
  .map((t) => t.plain_text ?? t.text?.content ?? '').join('');

function block(type, content) {
  return { object: 'block', type, [type]: { rich_text: rt(content) } };
}
function codeBlock(content) {
  return { object: 'block', type: 'code', code: { rich_text: rt(content), language: 'plain text' } };
}

export function markdownToBlocks(md = '') {
  const blocks = [];
  let code = null; // accumulating lines while inside a ``` fence
  for (const line of String(md).split('\n')) {
    if (line.trim().startsWith('```')) {
      if (code) { blocks.push(codeBlock(code.join('\n'))); code = null; } else { code = []; }
      continue;
    }
    if (code) { code.push(line); continue; }
    if (/^###\s+/.test(line)) blocks.push(block('heading_3', line.replace(/^###\s+/, '')));
    else if (/^##\s+/.test(line)) blocks.push(block('heading_2', line.replace(/^##\s+/, '')));
    else if (/^#\s+/.test(line)) blocks.push(block('heading_1', line.replace(/^#\s+/, '')));
    else if (/^[-*]\s+/.test(line)) blocks.push(block('bulleted_list_item', line.replace(/^[-*]\s+/, '')));
    else if (line.trim() === '') continue;
    else blocks.push(block('paragraph', line));
  }
  if (code) blocks.push(codeBlock(code.join('\n')));
  return blocks;
}

// Detect markdown features this minimal converter does NOT preserve, so the
// connector can warn the human that the doc landed simplified (never silently lossy).
const UNSUPPORTED = [
  [/(^|\n)[ \t]*\|.*\|/, 'tables (rendered as plain lines)'],
  [/\[[^\]]+\]\([^)]+\)/, 'links (link target dropped)'],
  [/(\*\*|__)\S/, 'bold/italic (markers kept literally)'],
  [/(^|\n)[ \t]*\d+\.[ \t]/, 'numbered lists (rendered as paragraphs)'],
  [/(^|\n)[ \t]{2,}[-*][ \t]/, 'nested lists (flattened)'],
  [/(^|\n)>[ \t]/, 'blockquotes (rendered as paragraphs)'],
];
export function markdownWarnings(md = '') {
  const s = String(md);
  return UNSUPPORTED.filter(([re]) => re.test(s)).map(([, msg]) => msg);
}

export function blocksToMarkdown(blocks = []) {
  return blocks.map((b) => {
    const t = textOf(b);
    switch (b.type) {
      case 'heading_1': return `# ${t}`;
      case 'heading_2': return `## ${t}`;
      case 'heading_3': return `### ${t}`;
      case 'bulleted_list_item': return `- ${t}`;
      case 'code': return '```\n' + t + '\n```';
      default: return t;
    }
  }).join('\n');
}
