import Mongo from 'mongodb';

// import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('products');

export const getSelectedProducts = async (productIds) => {
  return await getCollection().find({
    _id: {
      '$in': productIds.map(productId => new ObjectId(productId))
    }
  }).toArray();
};

export const deleteProduct = async (productId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectId(productId)
  });
  return result.deletedCount;
};