// connectors/test/confluence-storage.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mdToStorage, storageToText } from '../confluence-storage.mjs';

test('mdToStorage maps headings, paragraphs, and bullet lists', () => {
  const s = mdToStorage('# A\nintro\n- one\n- two');
  assert.match(s, /<h1>A<\/h1>/);
  assert.match(s, /<p>intro<\/p>/);
  assert.match(s, /<ul><li>one<\/li><li>two<\/li><\/ul>/);
});

test('storageToText recovers a readable structure', () => {
  assert.equal(storageToText('<h1>A</h1><p>b</p><ul><li>c</li></ul>'), '# A\nb\n- c');
});

test('mdToStorage escapes HTML special characters', () => {
  assert.match(mdToStorage('a < b & c'), /a &lt; b &amp; c/);
});
