import { createReadStream, statSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 5173;
const host = process.env.HOST || '0.0.0.0';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    ...headers,
  });
  response.end(body);
}

function resolveRequestPath(url) {
  let requestPath;

  try {
    requestPath = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  } catch {
    return null;
  }
  const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = path.resolve(root, `.${normalizedPath}`);

  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== root) {
    return null;
  }

  return filePath;
}

async function findStaticFile(url) {
  const filePath = resolveRequestPath(url);

  if (!filePath) {
    return null;
  }

  const fileStat = await stat(filePath).catch(() => null);

  if (fileStat?.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    const indexStat = await stat(indexPath).catch(() => null);
    return indexStat?.isFile() ? { filePath: indexPath, fileStat: indexStat } : null;
  }

  return fileStat?.isFile() ? { filePath, fileStat } : null;
}

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    send(response, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
    return;
  }

  if (new URL(request.url, 'http://localhost').pathname === '/healthz') {
    send(response, 200, 'ok', { 'Cache-Control': 'no-store' });
    return;
  }

  const staticFile = await findStaticFile(request.url);

  if (!staticFile) {
    send(response, 404, 'Not Found');
    return;
  }

  const extension = path.extname(staticFile.filePath).toLowerCase();
  const contentType = mimeTypes[extension] || 'application/octet-stream';
  const cacheControl = extension === '.html'
    ? 'no-cache'
    : 'public, max-age=31536000, immutable';

  response.writeHead(200, {
    'Cache-Control': cacheControl,
    'Content-Length': staticFile.fileStat.size,
    'Content-Type': contentType,
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(staticFile.filePath).pipe(response);
});

server.listen(port, host, () => {
  const { size } = statSync(path.join(root, 'index.html'));
  console.log(`BAZODIAC static site ready on http://${host}:${port} (${size} bytes index)`);
});

function shutdown(signal) {
  console.log(`${signal} received, closing server`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
