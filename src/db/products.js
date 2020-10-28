import Mongo from 'mongodb';

import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('products');

export const getAllProducts = async () => {
  return await getCollection().find({}).toArray();
};

export const getProduct = async (productId) => {
  return await getCollection().findOne({
    _id: new ObjectId(productId)
  });
};

export const addProduct = async (productData) => {
  const result = await getCollection().insertOne(productData);
  return result.insertedId;
};

export const updateProduct = async (productData) => {
  const dataToUpdate = { ...productData };
  delete dataToUpdate._id;  // need to delete _id for correct update procedure

  const result = await getCollection().updateOne(
    {
      _id: new ObjectId(productData._id)
    },
    {
      '$set': dataToUpdate
    },
    { upsert: false }
  );
  return result.modifiedCount;
};