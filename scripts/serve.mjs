import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { render } from './render.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.json':'application/json', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    if (rel.split('/').includes('..')) { res.writeHead(403).end(); return; }
    const folder = rel.startsWith('assets/') ? 'public' : 'src';
    const file = path.resolve(root, folder, rel);
    if (!file.startsWith(path.resolve(root, folder) + path.sep)) { res.writeHead(403).end(); return; }
    await stat(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Robots-Tag':'noindex, nofollow' });
    res.end(rel === 'index.html' ? await render() : await readFile(file));
  } catch { res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }).end('Stránka nebyla nalezena.'); }
}).listen(5186, '127.0.0.1', () => console.log('JSPD local preview: http://127.0.0.1:5186'));
