import Joi from '@hapi/joi';

import { CONFLICT, NOT_FOUND, MISSING_DATA, VALIDATION_ERROR } from '../constants/error.js';

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
    _id: idSchema.required(),
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

  async getAllProducts() {
    // temporary mock
    return this.mockAllProducts;
  }
  
  async getProduct(productId) {
    if (!productId) throw new Error(MISSING_DATA);
    // temporary mock
    return this.mockProduct;
  }

  async addProduct(productData) {
    if (!productData) throw new Error(MISSING_DATA);
    if (productData._id === this.mockProduct._id) throw new Error(CONFLICT);
    try {
      await this.productSchema.validateAsync(productData);
      console.log('Product added!');
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // temporary mock
    return true;
  }

  async updateProduct(productId, productData) {
    if (!productId || !productData) throw new Error(MISSING_DATA);
    if (productId !== this.mockProduct._id) throw new Error(NOT_FOUND);
    try {
      await this.productUpdateSchema.validateAsync(productData);
      console.log('Product updated!');
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    // temporary mock
    return true;
  }

  async deleteProduct(productId) {
    if (!productId) throw new Error(MISSING_DATA);
    if (productId !== this.mockProduct._id) throw new Error(NOT_FOUND);
    // temporary mock
    return true;
    // console.log('Product deleted!');
  }
}