/* เซิร์ฟเวอร์ไฟล์สแตติกขนาดเล็ก สำหรับรันบน Railway (ไม่ต้องติดตั้ง dependency) */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let rel = url === '/' ? 'index.html' : url.replace(/^\/+/, '');

  // กันการอ่านไฟล์นอกโฟลเดอร์โปรเจกต์
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(ROOT, 'index.html'), (e2, fallback) => {
        if (e2) { res.writeHead(404).end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': TYPES['.html'] }).end(fallback);
      });
      return;
    }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const cache = /\.(css|js)$/.test(file) ? 'public, max-age=3600' : 'public, max-age=300';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache }).end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`JeedFood running on port ${PORT}`);
});
