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

  async getOrder(orderId) {
    if (!orderId) throw new Error(MISSING_DATA);
    // temporary mock
    return this.mockOrder;
  }

  async addOrder(orderData) {
    if (!orderData) throw new Error(MISSING_DATA);
    if (orderData._id === this.mockOrder._id) throw new Error(CONFLICT);
    // temporary mock
    return true;
    // console.log('Order added!');
  }

  async updateOrder(orderId, orderData) {
    if (!orderId || !orderData) throw new Error(MISSING_DATA);
    if (orderId !== this.mockOrder._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Order updated!');
  }

  async deleteOrder(orderId) {
    if (!orderId) throw new Error(MISSING_DATA);
    if (orderId !== this.mockOrder._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Order deleted!');
  }
}