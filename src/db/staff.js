import Mongo from 'mongodb';

// import { db } from './index.js';

const { ObjectId } = Mongo;

const getCollection = () => db.collection('staff');

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