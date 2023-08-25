import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

sequelize.addModels([User, Post]);
