import Mongo from 'mongodb';

import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('staff');

export const getEmployee = async (employeeId) => {
  return await getCollection().findOne({
    _id: new ObjectId(employeeId)
  });
};

export const addEmployee = async (employeeData) => {
  const result = await getCollection().insertOne(employeeData);
  return result.insertedId;
};

export const updateEmployee = async (employeeData) => {
  const dataToUpdate = { ...employeeData };
  delete dataToUpdate._id;  // need to delete _id for correct update procedure

  const result = await getCollection().updateOne(
    {
      _id: new ObjectId(employeeData._id)
    },
    {
      '$set': dataToUpdate
    },
    { upsert: false }
  );
  return result.modifiedCount;
};

export const deleteEmployee = async (employeeId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectId(employeeId)
  });
  return result.deletedCount;
};