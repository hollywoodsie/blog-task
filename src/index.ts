import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import sequelize from './config/db';



async function main (){

const app: Express = express();
const port = process.env.API_PORT;

await sequelize.sync({ force: true }).then(() => {
  console.log('Database synced successfully.');
}).catch((error) => {
  console.error('Error syncing database:', error);
});


app.get('/', (req: Request, res: Response) => {
  res.send('hi people');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
}

main();