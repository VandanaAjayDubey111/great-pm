// connectors/test/notion-md.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markdownToBlocks, blocksToMarkdown, markdownWarnings } from '../notion-md.mjs';

test('markdownToBlocks maps headings, bullets, paragraphs, and code', () => {
  const blocks = markdownToBlocks('# Title\nintro para\n- one\n- two\n```\ncode line\n```');
  assert.deepEqual(blocks.map((b) => b.type),
    ['heading_1', 'paragraph', 'bulleted_list_item', 'bulleted_list_item', 'code']);
  assert.equal(blocks[0].heading_1.rich_text[0].text.content, 'Title');
  assert.equal(blocks[4].code.rich_text[0].text.content, 'code line');
});

test('markdownToBlocks splits text over Notion 2000-char limit into multiple rich_text objects', () => {
  const [b] = markdownToBlocks('x'.repeat(4500));
  const rts = b.paragraph.rich_text;
  assert.equal(rts.length, 3); // 2000 + 2000 + 500
  assert.ok(rts.every((r) => r.text.content.length <= 2000));
  assert.equal(rts.map((r) => r.text.content).join('').length, 4500);
});

test('blocksToMarkdown round-trips the structure', () => {
  const md = '# Title\nintro\n- a\n- b';
  assert.equal(blocksToMarkdown(markdownToBlocks(md)), md);
});

test('blocksToMarkdown handles the Notion read shape (plain_text)', () => {
  const blocks = [{ type: 'heading_2', heading_2: { rich_text: [{ plain_text: 'Read H' }] } }];
  assert.equal(blocksToMarkdown(blocks), '## Read H');
});

test('markdownWarnings flags unsupported constructs and stays quiet otherwise', () => {
  assert.deepEqual(markdownWarnings('# Title\n- a bullet\nplain para'), []);
  assert.ok(markdownWarnings('| a | b |\n| 1 | 2 |').some((w) => /tables/.test(w)));
  assert.ok(markdownWarnings('see [the doc](http://x)').some((w) => /links/.test(w)));
  assert.ok(markdownWarnings('1. first\n2. second').some((w) => /numbered/.test(w)));
});
