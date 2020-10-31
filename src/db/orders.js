import Mongo from 'mongodb';

// import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('orders');

export const deleteOrder = async (orderId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectId(orderId)
  });
  return result.deletedCount;
};