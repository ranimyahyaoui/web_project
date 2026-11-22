import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './lib/prisma.js';
import { loadUser } from './middlewares/auth.middleware.js';
import activityRoutes from './routes/activity.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import memberRoutes from './routes/member.routes.js';
import { seed } from './prisma/seed.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));
  app.use(loadUser);

  app.use('/api', activityRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api', memberRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', contactRoutes);

  app.use('/api', (_req, res) =>
    res.status(404).json({ error: 'Route inconnue.' }),
  );
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Requête mal formée.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  });

  return app;
}

async function start() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await seed();
    console.log('Base vide : données de démonstration insérées.');
  }

  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => {
    console.log(`API SC2 Connect sur http://localhost:${port}/api`);
  });
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  start().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
