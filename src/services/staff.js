import mongoose from 'mongoose';

import { VALIDATION_ERROR } from '../constants/error.js';
import {
  addEmployee as dbAddEmployee
} from '../models/staff.js';
import {
  getEmployee as dbGetEmployee,
  updateEmployee as dbUpdateEmployee,
  deleteEmployee as dbDeleteEmployee
} from '../db/staff.js';

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
    try {
      // validation & db connection
      return await dbAddEmployee(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
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