import mongoose from 'mongoose';

import { PAGE_SIZE } from '../constants/db.js';

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  position: {
    type: [String],
    required: true,
    enum: ['waiter', 'waitress', 'barista', 'cleaning', 'temp']
  },
  monthlySalary: {
    type: Number,
    required: true,
    min: 2000
  }
});

export const Employee = mongoose.model('Employee', employeeSchema, 'staff');

export const getAllEmployees = async ({ ratingAbove, ratingBelow, position, page }) => {
  const query = {};
  // include searchFilters to query
  if (ratingAbove || ratingBelow) {
    query.$and = [];
    if (ratingAbove) {
      query.$and.push({
        rating: {
          $gte: +ratingAbove
        }
      });
    }
    if (ratingBelow) {
      query.$and.push({
        rating: {
          $lte: +ratingBelow
        }
      });
    }
  }
  if (position) {
    query.position = position;
  }
  
  return await Employee
    .find(query)
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * (+page - 1))  // page = 1 results as skip(0) (really first page)
    .exec();
};

export const getEmployee = async (employeeId) => {
  return await Employee
    .findById(employeeId)
    .exec();
};

export const addEmployee = async (employeeData) => {
  const employeeInstance = new Employee(employeeData);
  const result = await employeeInstance.save();
  return result._id;
};

export const updateEmployee = async (employeeData) => {
  const dataToUpdate = { ...employeeData };
  delete dataToUpdate._id;  // need to delete _id for correct update procedure

  const result = await Employee
    .updateOne(
      {
        _id: employeeData._id
      },
      {
        '$set': dataToUpdate
      },
      { upsert: false }
    )
    .exec();
  return result.nModified;
};

export const deleteEmployee = async (employeeId) => {
  const result = await Employee
    .deleteOne({
      _id: employeeId
    })
    .exec();
  return result.deletedCount;
};