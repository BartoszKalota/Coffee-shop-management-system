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