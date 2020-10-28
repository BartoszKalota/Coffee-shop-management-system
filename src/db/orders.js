import Mongo from 'mongodb';

import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('orders');

export const getOrder = async (orderId) => {
  return await getCollection().findOne({
    _id: new ObjectId(orderId)
  });
};

export const addOrder = async (orderData) => {
  const result = await getCollection().insertOne(orderData);
  return result.insertedId;
};