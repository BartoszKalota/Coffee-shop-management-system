import Mongo from 'mongodb';

// import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('staff');

export const deleteEmployee = async (employeeId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectId(employeeId)
  });
  return result.deletedCount;
};