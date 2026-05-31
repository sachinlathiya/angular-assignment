const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Fixed deadline used by the mock backend (never changes).
const DEADLINE = new Date('2026-12-31T23:59:59.000Z');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const distPath = path.join(__dirname, '../dist/deadline-app/browser');
const hasBuild = fs.existsSync(path.join(distPath, 'index.html'));

app.use(cors());

app.get('/api/deadline', (_req, res) => {
  const secondsLeft = Math.max(
    0,
    Math.floor((DEADLINE.getTime() - Date.now()) / 1000)
  );
  res.json({ secondsLeft });
});

if (hasBuild) {
  app.use(express.static(distPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  if (hasBuild) {
    console.log(`App running at http://localhost:${PORT}`);
  } else {
    console.log(`Mock API running at http://localhost:${PORT}`);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or run with PORT=3001.`
    );
    process.exit(1);
  }

  throw error;
});
