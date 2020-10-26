import Joi from '@hapi/joi';

import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default class Orders {
  // temporary mock
  mockOrder = {
    _id: '1',
    date: new Date(),
    location: '2',
    paidIn: 'cash',
    staffId: '2',
    products: [
      {
        productId: '3',
        name: 'Mocha',
        amount: 2,
        unitPrice: 2,
      },
    ],
    total: 4
  };

  orderedProductSchema = Joi.object().keys({
    prodId = idSchema.required(),
    name: Joi.string().required(),
    amount: Joi.number().greater(0).required(),
    unitPrice: Joi.number().greater(0).required()
  });

  orderUpdateSchema = Joi.object().keys({
    _id: idSchema.required(),
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
    if (!orderId) throw new Error(MISSING_DATA);
    // temporary mock
    return this.mockOrder;
  }

  async addOrder(orderData) {
    if (!orderData) throw new Error(MISSING_DATA);
    if (orderData._id === this.mockOrder._id) throw new Error(CONFLICT);
    try {
      await this.addOrderSchema.validateAsync(orderData);
      console.log('Order added!');
    } catch (err) {
      throw new Error(err);
    }
    // temporary mock
    return true;
  }

  async updateOrder(orderId, orderData) {
    if (!orderId || !orderData) throw new Error(MISSING_DATA);
    if (orderId !== this.mockOrder._id) throw new Error(NOT_FOUND);
    try {
      await this.orderUpdateSchema.validateAsync(orderData);
      console.log('Order updated!');
    } catch (err) {
      throw new Error(err);
    }
    // temporary mock
    return true;
  }

  async deleteOrder(orderId) {
    if (!orderId) throw new Error(MISSING_DATA);
    if (orderId !== this.mockOrder._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Order deleted!');
  }
}