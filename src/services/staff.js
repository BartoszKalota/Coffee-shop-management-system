import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default class Staff {
  mockEmployee = {
    _id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    startedAt: new Date(),
    rating: 4.5,
    position: ['waiter'],
    monthlySalary: 4000
  };

  async getEmployee(employeeId) {
    if (!employeeId) throw new Error(MISSING_DATA);
    // temporary mock
    return this.mockEmployee;
  }

  async addEmployee(employeeData) {
    if (!employeeData) throw new Error(MISSING_DATA);
    if (employeeData._id === this.mockEmployee._id) throw new Error(CONFLICT);
    // temporary mock
    return true;
    // console.log('Employee added!');
  }

  async updateEmployee(employeeId, employeeData) {
    if (!employeeId || !employeeData) throw new Error(MISSING_DATA);
    if (employeeId !== this.mockEmployee._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Order updated!');
  }

  async deleteEmployee(employeeId) {
    if (!employeeId) throw new Error(MISSING_DATA);
    if (employeeId !== this.mockEmployee._id) throw new Error(NOT_FOUND);

  }
}