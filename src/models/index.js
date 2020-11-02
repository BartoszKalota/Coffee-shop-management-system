import mongoose from 'mongoose';

import { DB_HOST, DB_PORT, DB_NAME } from '../config/db.js';

export const connectToMongoose = async () => {
  const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  await mongoose.connect(url, { useNewUrlParser: true });
  return mongoose.connection.db;
};