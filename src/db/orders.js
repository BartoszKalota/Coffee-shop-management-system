import Mongo from 'mongodb';

// import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('orders');

export const updateOrder = async (orderData) => {
  const dataToUpdate = { ...orderData };
  delete dataToUpdate._id;  // need to delete _id for correct update procedure

  const result = await getCollection().updateOne(
    {
      _id: new ObjectId(orderData._id)
    },
    {
      '$set': dataToUpdate
    },
    { upsert: false }
  );
  return result.modifiedCount;
};

export const deleteOrder = async (orderId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectId(orderId)
  });
  return result.deletedCount;
};