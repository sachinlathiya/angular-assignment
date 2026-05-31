const express = require('express');
const cors = require('cors');

// Fixed deadline used by the mock backend (never changes).
const DEADLINE = new Date('2026-12-31T23:59:59.000Z');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

app.get('/api/deadline', (_req, res) => {
  const secondsLeft = Math.max(
    0,
    Math.floor((DEADLINE.getTime() - Date.now()) / 1000)
  );
  res.json({ secondsLeft });
});

const server = app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
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
