import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default class Staff {
  async getEmployee(employeeId) {
    if (!employeeId) throw new Error(MISSING_DATA);

  }

  async addEmployee(employeeData) {
    if (!employeeData) throw new Error(MISSING_DATA);
    if (employeeData._id === this.mockEmployee._id) throw new Error(CONFLICT);

  }

  async updateEmployee(employeeId, employeeData) {
    if (!employeeId || !employeeData) throw new Error(MISSING_DATA);
    if (employeeId !== this.mockEmployee._id) throw new Error(NOT_FOUND);

  }

  async deleteEmployee(employeeId) {
    if (!employeeId) throw new Error(MISSING_DATA);
    if (employeeId !== this.mockEmployee._id) throw new Error(NOT_FOUND);

  }
}