import { mkdir, readFile, writeFile } from 'node:fs/promises';
const guides = JSON.parse(await readFile('src/content/guides.json', 'utf8'));
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const style = (await readFile('dist/index.html', 'utf8')).match(/<link[^>]+href="(\/assets\/[^"]+\.css)"/)?.[1];
if (!style) throw Error('Missing built stylesheet');
for (const guide of guides)
  for (const lang of ['it', 'en']) {
    const title = escape(guide.title[lang]);
    const dir = 'dist/learn/' + lang + '/' + guide.slug;
    const other = lang === 'en' ? 'it' : 'en';
    await mkdir(dir, { recursive: true });
    const contents = guide.sections.map((p) => '<p>' + escape(p[lang]) + '</p>').join('');
    await writeFile(
      dir + '/index.html',
      '<!doctype html><html lang="' +
        lang +
        '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
        title +
        ' · BiteRadar</title><meta name="description" content="' +
        escape(guide.sections[0][lang]) +
        '"><link rel="stylesheet" href="' +
        style +
        '"></head><body><main><header class="intro"><a href="/#guide">BiteRadar</a><h1>' +
        title +
        '</h1></header><article class="card">' +
        contents +
        '<a href="' +
        escape(guide.source) +
        '" rel="noreferrer">' +
        (lang === 'it' ? 'Fonte' : 'Source') +
        '</a></article><a href="/#analyzer">' +
        (lang === 'it' ? 'Apri analizzatore' : 'Open analyzer') +
        '</a> · <a hreflang="' +
        other +
        '" href="/learn/' +
        other +
        '/' +
        guide.slug +
        '/">' +
        other.toUpperCase() +
        '</a></main></body></html>'
    );
  }
