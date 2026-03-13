import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './src/server/db.ts';
import { authRouter } from './src/server/routes/auth.ts';
import { newsRouter } from './src/server/routes/news.ts';
import { tournamentsRouter } from './src/server/routes/tournaments.ts';
import { partnersRouter } from './src/server/routes/partners.ts';
import { usersRouter } from './src/server/routes/users.ts';
import { storeRouter } from './src/server/routes/store.ts';
import { contactRouter } from './src/server/routes/contact.ts';
import { settingsRouter } from './src/server/routes/settings.ts';
import { notificationsRouter } from './src/server/routes/notifications.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/news', newsRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/users', usersRouter);
app.use('/api/store', storeRouter);
app.use('/api/contact', contactRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/notifications', notificationsRouter);

// Catch-all for API routes to prevent falling through to SPA fallback
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
