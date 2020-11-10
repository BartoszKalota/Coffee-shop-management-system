import { PEER_ERROR, VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllOrders as dbGetAllOrders,
  getOrder as dbGetOrder,
  addOrder as dbAddOrder,
  updateOrder as dbUpdateOrder,
  deleteOrder as dbDeleteOrder
} from '../models/orders.js';
import { getEmployee } from '../models/staff.js';
import { getSelectedProductsForOrder } from '../models/products.js';

export default class Orders {
  static async _checkIfEmployeeExists(employeeId) {
    const existingEmployee = await getEmployee(employeeId);
    if (!existingEmployee) throw new Error(PEER_ERROR);
  }

  static async _checkIfProductsExist(products) {
    const productIds = products.map(product => product._id);
    const dbProducts = await getSelectedProductsForOrder(productIds);
    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        productId => dbProducts.findIndex(product => product._id === productId) === -1
      );
      console.log(`Missing products: ${missingIds.join(', ')}`);
      throw new Error(PEER_ERROR);
    }
  }

  async getAllOrders(searchFilters) {
    // db connection
    return await dbGetAllOrders(searchFilters);
  }

  async getOrder(orderId) {
    // db connection
    return await dbGetOrder(orderId);
  }

  async addOrder(orderData) {
    try {
      // check peer resources
      await Orders._checkIfEmployeeExists(orderData.staffId);
      await Orders._checkIfProductsExist(orderData.products);
      // validation & db connection
      return await dbAddOrder(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async updateOrder(orderData) {
    try {
      // check peer resources
      if (orderData.staffId) {
        await Orders._checkIfEmployeeExists(orderData.staffId);
      }
      if (orderData.products) {
        await Orders._checkIfProductsExist(orderData.products);
      }
      // validation & db connection
      return await dbUpdateOrder(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      // validation & db connection
      return await dbDeleteOrder(orderId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }
}