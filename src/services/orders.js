import mongoose from 'mongoose';
// remember to import Employee model later

import { PEER_ERROR, VALIDATION_ERROR } from '../constants/error.js';
import {
  getOrder as dbGetOrder,
  addOrder as dbAddOrder,
  updateOrder as dbUpdateOrder,
  deleteOrder as dbDeleteOrder
} from '../db/orders.js';
import { getEmployee } from '../db/staff.js';
import { getSelectedProducts } from '../db/products.js';

const mOrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  paidIn: {
    type: String,
    required: true,
    enum: ['cash', 'card']
  },
  staffId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: Employee
  },
  products: [{
    _id: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0.01
  }
});

const Order = mongoose.model('Order', mOrderSchema, 'orders');

export default class Orders {
  orderedProductSchema = Joi.object().keys({
    _id = Joi.string().length(24).required(),
    name: Joi.string().required(),
    amount: Joi.number().greater(0).required(),
    unitPrice: Joi.number().greater(0).required()
  });

  orderUpdateSchema = Joi.object().keys({
    _id: Joi.string().length(24).required(),
    date: Joi.date(),
    location: Joi.string(),
    paidIn: Joi.string().valid('cash', 'card'),
    staffId: Joi.string().length(24),
    products: Joi.array().items(this.orderedProductSchema),
    total: Joi.number().greater(0)
  });

  orderSchema = this.orderUpdateSchema.options({ presence: 'required' });

  addOrderSchema = this.orderSchema.keys({
    _id: Joi.any().strip().optional()
  });

  static async _checkIfEmployeeExists(employeeId) {
    const existingEmployee = await getEmployee(employeeId);
    if (!existingEmployee) throw new Error(PEER_ERROR);
  }

  static async _checkIfProductsExist(products) {
    const productIds = products.map(product => product._id);
    const dbProducts = await getSelectedProducts(productIds);
    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        productId => dbProducts.findIndex(product => product._id === productId) === -1
      );
      console.log(`Missing products: ${missingIds.join(', ')}`);
      throw new Error(PEER_ERROR);
    }
  }

  async getOrder(orderId) {
    // db connection
    return await dbGetOrder(orderId);
  }

  async addOrder(orderData) {
    // validation
    try {
      await this.addOrderSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // check peer resources
    await Orders._checkIfEmployeeExists(orderData.staffId);
    await Orders._checkIfProductsExist(orderData.products);
    // db connection
    return await dbAddOrder(orderData);
  }

  async updateOrder(orderData) {
    // validation
    try {
      await this.orderUpdateSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // check peer resources
    if (orderData.staffId) {
      await Orders._checkIfEmployeeExists(orderData.staffId);
    }
    if (orderData.products) {
      await Orders._checkIfProductsExist(orderData.products);
    }
    // db connection
    return await dbUpdateOrder(orderData);
  }

  async deleteOrder(orderId) {
    // validation
    try {
      await Joi.string().length(24).validateAsync(orderId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbDeleteOrder(orderId);
  }
}