import mongoose from 'mongoose';

import { Employee } from './staff.js';

const orderSchema = new mongoose.Schema({
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

export const Order = mongoose.model('Order', orderSchema, 'orders');

export const addOrder = async (orderData) => {
  const orderInstance = await new Order(orderData);
  const result = await orderInstance.save();
  return result._id;
};