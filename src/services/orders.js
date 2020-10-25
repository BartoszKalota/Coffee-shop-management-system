import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default class Orders {
  async getOrder(orderId) {
    if (!orderId) throw new Error(MISSING_DATA);

  }

  async addOrder(orderData) {
    if (!orderData) throw new Error(MISSING_DATA);
    if (orderData._id === this.mockOrder._id) throw new Error(CONFLICT);

  }

  async updateOrder(orderId, orderData) {
    if (!orderId || !orderData) throw new Error(MISSING_DATA);
    if (orderId !== this.mockOrder._id) throw new Error(NOT_FOUND);

  }

  async deleteOrder(orderId) {
    if (!orderId) throw new Error(MISSING_DATA);
    if (orderId !== this.mockOrder._id) throw new Error(NOT_FOUND);

  }
}