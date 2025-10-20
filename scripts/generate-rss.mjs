import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const cwd = process.cwd();
const outDir = resolve(cwd, 'public');
mkdirSync(outDir, { recursive: true });

const siteMeta = JSON.parse(readFileSync(resolve(cwd, 'data/site-meta.json'), 'utf8'));
const posts = JSON.parse(readFileSync(resolve(cwd, 'data/blog.json'), 'utf8'));

const baseUrlEnv = process.env.SITE_BASE_URL || siteMeta.baseUrl || 'https://example.com';
const baseUrl = String(baseUrlEnv).replace(/\/$/, '');

const title = siteMeta.title || 'Portfolio';
const description = siteMeta.description || 'Personal site';
const language = 'en';

const published = posts
  .filter((p) => p.published !== false)
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

const itemsXml = published
  .map((p) => {
    const url = `${baseUrl}/blog/${p.slug}`;
    const desc = p.summary || '';
    const pubDate = new Date(p.date).toUTCString();
    return [
      '<item>',
      `<title>${esc(p.title)}</title>`,
      `<link>${esc(url)}</link>`,
      `<guid isPermaLink="true">${esc(url)}</guid>`,
      `<pubDate>${esc(pubDate)}</pubDate>`,
      `<description><![CDATA[${desc}]]></description>`,
      '</item>',
    ].join('');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(title)}</title>
<link>${esc(baseUrl)}</link>
<description>${esc(description)}</description>
<language>${language}</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
</channel>
</rss>
`;

writeFileSync(resolve(outDir, 'feed.xml'), xml, 'utf8');
console.log('feed.xml generated with', published.length, 'items');