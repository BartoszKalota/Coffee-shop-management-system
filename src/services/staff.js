import mongoose from 'mongoose';

import { VALIDATION_ERROR } from '../constants/error.js';
import {
  getEmployee as dbGetEmployee,
  addEmployee as dbAddEmployee,
  updateEmployee as dbUpdateEmployee,
  deleteEmployee as dbDeleteEmployee
} from '../db/staff.js';

const mEmployeeSchema = new mongoose.Schema({
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

const Employee = mongoose.model('Employee', mEmployeeSchema, 'staff');

export default class Staff {
  employeeUpdateSchema = Joi.object().keys({
    _id: Joi.string().length(24).required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    startedAt: Joi.date(),
    rating: Joi.number().min(0).max(10),
    position: Joi.array().items(
      Joi.string().valid('waiter'),
      Joi.string().valid('waitress'),
      Joi.string().valid('barista'),
      Joi.string().valid('cleaning'),
      Joi.string().valid('temp')
    ),
    monthlySalary: Joi.number().min(2000)
  });

  employeeSchema = this.employeeUpdateSchema.options({ presence: 'required' });

  addEmployeeSchema = this.employeeSchema.keys({
    _id: Joi.any().strip().optional()
  });

  async getEmployee(employeeId) {
    // db connection
    return await dbGetEmployee(employeeId);
  }

  async addEmployee(employeeData) {
    // validation
    try {
      await this.addEmployeeSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbAddEmployee(employeeData);
  }

  async updateEmployee(employeeData) {
    // validation
    try {
      await this.employeeUpdateSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbUpdateEmployee(employeeData);
  }

  async deleteEmployee(employeeId) {
    // validation
    try {
      await Joi.string().length(24).validateAsync(employeeId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbDeleteEmployee(employeeId);
  }
}