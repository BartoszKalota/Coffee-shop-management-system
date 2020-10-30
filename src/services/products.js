import mongoose from 'mongoose';

import { VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllProducts as dbGetAllProducts,
  getProduct as dbGetProduct,
  addProduct as dbAddProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct
} from '../db/products.js';

const mProductSchema = new mongoose.Schema({
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

const Product = mongoose.model('Product', mProductSchema, 'products');

export default class Products {
  productUpdateSchema = Joi.object().keys({
    _id: Joi.string().length(24).required(),
    name: Joi.string(),
    brand: Joi.string(),
    lastOrderDate: Joi.date(),
    unitPrice: Joi.number(),
    supplierName: Joi.string(),
    available: Joi.number(),
    expirationDate: Joi.date(),
    categories: Joi.array().items(
      Joi.string().valid('coffee'),
      Joi.string().valid('food'),
      Joi.string().valid('accessories'),
      Joi.string().valid('equipment'),
      Joi.string().valid('premium')
    )
  });

  productSchema = this.productUpdateSchema.options({ presence: 'required' });

  addProductSchema = this.productSchema.keys({
    _id: Joi.any().strip().optional()
  });

  async getAllProducts() {
    // db connection
    return await dbGetAllProducts();
  }
  
  async getProduct(productId) {
    // db connection
    return await dbGetProduct(productId);
  }

  async addProduct(productData) {
    // validation
    try {
      await this.addProductSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbAddProduct(productData);
  }

  async updateProduct(productData) {
    // validation
    try {
      await this.productUpdateSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbUpdateProduct(productData);
  }

  async deleteProduct(productId) {
    // validation
    try {
      await Joi.string().length(24).validateAsync(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // db connection
    return await dbDeleteProduct(productId);
  }
}