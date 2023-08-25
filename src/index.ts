import 'dotenv/config';
import express, { Express } from 'express';

import userRoutes from './user/routes';
import postRoutes from './post/routes';
import authRoutes from './auth/routes';
import jwtAuthMiddleware from './middlewares/auth.middleware';
import './config/db';

function main() {
  const app: Express = express();
  const port = process.env.API_PORT;

  app.use(express.json());
  app.use('/api/users', jwtAuthMiddleware, userRoutes);
  app.use(
    '/api/posts',
    jwtAuthMiddleware,

    postRoutes
  );
  app.use('/api/auth', authRoutes);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

void main();
