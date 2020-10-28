import { db } from './index.js';

const getCollection = () => db.collection('products');

export const addProduct = async (productData) => {
  const result = await getCollection().insertOne(productData);
  return result.insertedId;
};