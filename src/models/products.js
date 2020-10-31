import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  lastOrderDate: {
    type: Date,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  available: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  categories: {
    type: [String],
    required: true,
    enum: ['coffee', 'food', 'accessories', 'equipment', 'premium']
  }
});

export const Product = mongoose.model('Product', productSchema, 'products');