// Entry point for cPanel / LiteSpeed / Phusion Passenger (ESM compatible)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

if (fs.existsSync(path.join(__dirname, 'server.cjs'))) {
  require('./server.cjs');
} else if (fs.existsSync(path.join(__dirname, 'dist', 'server.cjs'))) {
  require('./dist/server.cjs');
} else {
  const http = require('node:http');
  const server = http.createServer((_req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>server.cjs blev ikke fundet</h2><p>Serverfilen mangler i rodmappen.</p>');
  });
  const port = process.env.PORT || 3000;
  server.listen(port);
}
