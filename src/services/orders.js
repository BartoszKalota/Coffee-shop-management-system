import Joi from '@hapi/joi';

import { VALIDATION_ERROR } from '../constants/error.js';
import {
  getOrder as dbGetOrder,
  addOrder as dbAddOrder,
  updateOrder as dbUpdateOrder,
  deleteOrder as dbDeleteOrder
} from '../db/orders.js';

export default class Orders {
  orderedProductSchema = Joi.object().keys({
    // prodId = Joi.string().length(24).required(),
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