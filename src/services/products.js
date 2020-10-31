import mongoose from 'mongoose';

import { VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllProducts as dbGetAllProducts,
  getProduct as dbGetProduct,
  addProduct as dbAddProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct
} from '../models/products.js';

export default class Products {
  // productUpdateSchema = Joi.object().keys({
  //   _id: Joi.string().length(24).required(),
  //   name: Joi.string(),
  //   brand: Joi.string(),
  //   lastOrderDate: Joi.date(),
  //   unitPrice: Joi.number(),
  //   supplierName: Joi.string(),
  //   available: Joi.number(),
  //   expirationDate: Joi.date(),
  //   categories: Joi.array().items(
  //     Joi.string().valid('coffee'),
  //     Joi.string().valid('food'),
  //     Joi.string().valid('accessories'),
  //     Joi.string().valid('equipment'),
  //     Joi.string().valid('premium')
  //   )
  // });

  // productSchema = this.productUpdateSchema.options({ presence: 'required' });

  // addProductSchema = this.productSchema.keys({
  //   _id: Joi.any().strip().optional()
  // });

  async getAllProducts() {
    // db connection
    return await dbGetAllProducts();
  }
  
  async getProduct(productId) {
    // db connection
    return await dbGetProduct(productId);
  }

  async addProduct(productData) {
    // validation & db connection
    try {
      return await dbAddProduct(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async updateProduct(productData) {
    // validation & db connection
    try {
      return await dbUpdateProduct(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async deleteProduct(productId) {
    // validation & db connection
    try {
      return await dbDeleteProduct(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }
}