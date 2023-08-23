import 'dotenv/config';
import express, { Express } from 'express';
import sequelize from './config/db';
import userRoutes from './user/routes';
import postRoutes from './post/routes';
import authRoutes from './auth/routes';
import jwtAuthMiddleware from './middlewares/auth.middleware';

async function main() {
  const app: Express = express();
  const port = process.env.API_PORT;

  await sequelize
    .sync({ alter: true })
    .then(() => {
      console.log('Database synced successfully.');
    })
    .catch((error) => {
      console.error('Error syncing database:', error);
    });
  app.use(express.json());
  app.use('/api/users', userRoutes);
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
