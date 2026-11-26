import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const { headers } = JSON.parse(await readFile('vercel.json', 'utf8'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.md': 'text/plain; charset=utf-8'
};
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(root + sep)) throw Error('path');
    const bytes = await readFile(file);
    for (const { key, value } of headers[0].headers) res.setHeader(key, value);
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(bytes);
  } catch {
    res.statusCode = 404;
    res.end();
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1');
