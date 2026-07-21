// connectors/confluence-storage.mjs
// Minimal markdown <-> Confluence "storage format" (XHTML) converter for the
// Confluence docs connector. Supports headings, paragraphs, bullet lists, and code.
// Anything else degrades to a paragraph (the connector surfaces warnings).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function mdToStorage(md = '') {
  const out = [];
  let list = null;
  const flush = () => { if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; } };
  let code = null;
  for (const line of String(md).split('\n')) {
    if (line.trim().startsWith('```')) {
      if (code) { flush(); out.push(`<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[${code.join('\n')}]]></ac:plain-text-body></ac:structured-macro>`); code = null; }
      else { flush(); code = []; }
      continue;
    }
    if (code) { code.push(line); continue; }
    if (/^###\s+/.test(line)) { flush(); out.push(`<h3>${esc(line.replace(/^###\s+/, ''))}</h3>`); }
    else if (/^##\s+/.test(line)) { flush(); out.push(`<h2>${esc(line.replace(/^##\s+/, ''))}</h2>`); }
    else if (/^#\s+/.test(line)) { flush(); out.push(`<h1>${esc(line.replace(/^#\s+/, ''))}</h1>`); }
    else if (/^[-*]\s+/.test(line)) { (list = list || []).push(`<li>${esc(line.replace(/^[-*]\s+/, ''))}</li>`); }
    else if (line.trim() === '') { flush(); }
    else { flush(); out.push(`<p>${esc(line)}</p>`); }
  }
  flush();
  if (code) out.push(`<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[${code.join('\n')}]]></ac:plain-text-body></ac:structured-macro>`);
  return out.join('');
}

export function storageToText(html = '') {
  return String(html)
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<p>(.*?)<\/p>/g, '$1\n')
    .replace(/<\/?ul>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .split('\n').map((s) => s.trim()).filter(Boolean).join('\n');
}
