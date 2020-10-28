import Joi from '@hapi/joi';

import { CONFLICT, NOT_FOUND, MISSING_DATA, VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllProducts as dbGetAllProducts,
  getProduct as dbGetProduct,
  addProduct as dbAddProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct
} from '../db/products.js';

export default class Products {
  // temporary mock
  mockAllProducts = [
    {
      product: 1
    },
    {
      product: 2
    }
  ];
  // temporary mock
  mockProduct = {
    _id: '123',
    name: 'Mocha',
    brand: 'Bialetti',
    lastOrderDate: new Date(),
    unitPrice: 2,
    supplierName: 'EuroKawexpol',
    available: 10,
    expirationDate: new Date(),
    categories: ['coffee']
  };

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