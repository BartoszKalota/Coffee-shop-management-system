import { db } from './index.js';

const getCollection = () => db.collection('staff');

export const getEmployee = async (employeeId) => {
  return await getCollection().findOne({
    _id: employeeId
  });
};

export const addEmployee = async (employeeData) => {
  return await getCollection().insertOne(employeeData);
};

export const updateEmployee = async (employeeData) => {
  const result = await getCollection().updateOne(
    {
      _id: employeeData._id
    },
    {
      '$set': employeeData
    },
    { upsert: false }
  );
  return result.modifiedCount;
};