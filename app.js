// Entry point for cPanel / Phusion Passenger
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(__dirname, 'dist', 'server.cjs'))) {
  require('./dist/server.cjs');
} else if (fs.existsSync(path.join(__dirname, 'server.cjs'))) {
  require('./server.cjs');
} else {
  const http = require('http');
  const server = http.createServer((_req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>dist/server.cjs blev ikke fundet</h2><p>Serveren mangler <code>dist</code> mappen. Overfør venligst mappen med de færdigbyggede filer.</p>');
  });
  const port = process.env.PORT || 3000;
  server.listen(port);
}
