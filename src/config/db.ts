import { Sequelize } from 'sequelize-typescript';
import { User} from '../models/User'; 
import { Post} from '../models/Post'; 

const sequelize = new Sequelize({

  dialect: 'postgres',
  host: process.env.HOST, 
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port : 3020,
});
  
sequelize.addModels([User, Post]);
  
export default sequelize;