import { db } from './index.js';

const getCollection = () => db.collection('staff');

export const addEmployee = async (employeeData) => {
  return await getCollection().insertOne(employeeData);
};