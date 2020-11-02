import { VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllEmployees as dbGetAllEmployees,
  getEmployee as dbGetEmployee,
  addEmployee as dbAddEmployee,
  updateEmployee as dbUpdateEmployee,
  deleteEmployee as dbDeleteEmployee
} from '../models/staff.js';

export default class Staff {
  async getAllEmployees() {
    // db connection
    return await dbGetAllEmployees();
  }

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
    // validation & db connection
    try {
      return await dbUpdateEmployee(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async deleteEmployee(employeeId) {
    // validation & db connection
    try {
      return await dbDeleteEmployee(employeeId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }
}