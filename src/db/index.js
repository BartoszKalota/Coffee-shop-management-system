import MongoClient from 'mongodb';

import { DB_HOST, DB_PORT, DB_NAME } from '../config/db.js';

let connection;
let db;

const connectToDb = async () => {
  const url = `mongodb://${DB_HOST}:${DB_PORT}`;
  connection = await MongoClient.connect(url, { useUnifiedTopology: true });
  db = connection.db(DB_NAME);

  return connection;
};

export { connectToDb, connection, db };