import { PEER_ERROR, VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllOrders as dbGetAllOrders,
  getOrder as dbGetOrder,
  addOrder as dbAddOrder,
  updateOrder as dbUpdateOrder,
  deleteOrder as dbDeleteOrder
} from '../models/orders.js';
import { getEmployee } from '../models/staff.js';
import { getSelectedProductsForOrder, updateProductsAmountDueToOrder } from '../models/products.js';

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
      // update an amount of ordered products from the 'products' collection
      const productsWithAmountToSubtract = orderData.products.map(product => ({
        ...product,
        amount: product.amount * (-1)
      }));
      await updateProductsAmountDueToOrder(productsWithAmountToSubtract);
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
      if (orderData.staffId) {
        // check peer resource
        await Orders._checkIfEmployeeExists(orderData.staffId);
      }
      if (orderData.products) {
        // check peer resource
        await Orders._checkIfProductsExist(orderData.products);
        // update an amount of ordered products from the 'products' collection
        const oldOrder = await dbGetOrder(orderData._id);
        const oldOrderedProducts = oldOrder.products;
        const productsWithAmountDifference = oldOrderedProducts.map((oldOrderedProduct, i) => {
          const difference = oldOrderedProduct.amount - orderData.products[i].amount;
          return { ...oldOrderedProduct, amount: difference };
        });
        await updateProductsAmountDueToOrder(productsWithAmountDifference);
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
      // update an amount of ordered products from the 'products' collection
      const oldOrder = await dbGetOrder(orderId);
      const productsWithAmountToAdd = oldOrder.products;
      await updateProductsAmountDueToOrder(productsWithAmountToAdd);
      // validation & db connection
      return await dbDeleteOrder(orderId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }
}