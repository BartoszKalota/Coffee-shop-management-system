import { db } from './index.js';

const getCollection = () => db.collection('orders');

export const addOrder = async (orderData) => {
  const result = await getCollection().insertOne(orderData);
  return result.insertedId;
};