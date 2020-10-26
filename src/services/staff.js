import Joi from '@hapi/joi';

import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default class Staff {
  // temporary mock
  mockEmployee = {
    _id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    startedAt: new Date(),
    rating: 4.5,
    position: ['waiter'],
    monthlySalary: 4000
  };

  employeeUpdateSchema = Joi.object().keys({
    _id: idSchema.required(),
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

  async getEmployee(employeeId) {
    if (!employeeId) throw new Error(MISSING_DATA);
    // temporary mock
    return this.mockEmployee;
  }

  async addEmployee(employeeData) {
    if (!employeeData) throw new Error(MISSING_DATA);
    if (employeeData._id === this.mockEmployee._id) throw new Error(CONFLICT);
    try {
      await this.employeeSchema.validateAsync(employeeData);
      console.log('Employee added!');
    } catch (err) {
      throw new Error(err);
    }
    // temporary mock
    return true;
  }

  async updateEmployee(employeeId, employeeData) {
    if (!employeeId || !employeeData) throw new Error(MISSING_DATA);
    if (employeeId !== this.mockEmployee._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Employee updated!');
  }

  async deleteEmployee(employeeId) {
    if (!employeeId) throw new Error(MISSING_DATA);
    if (employeeId !== this.mockEmployee._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Employee deleted!');
  }
}