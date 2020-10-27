import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { APP_PORT } from './config/app.js';
import { mainRouter as apiRouter } from './api';
import { connectToDb } from './db';

(async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('combined'));

  await connectToDb();

  app.use('/', apiRouter);

  app.listen(APP_PORT, () => console.log(`Server is listening on port ${APP_PORT}...`));
})();