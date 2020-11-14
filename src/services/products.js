import { VALIDATION_ERROR } from '../constants/error.js';
import {
  getAllProducts as dbGetAllProducts,
  getProduct as dbGetProduct,
  addProduct as dbAddProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct
} from '../models/products.js';

export default class Products {
  async getAllProducts(searchFilters) {
    // db connection
    return await dbGetAllProducts(searchFilters);
  }
  
  async getProduct(productId) {
    // db connection
    return await dbGetProduct(productId);
  }

  async addProduct(productData) {
    try {
      // validation & db connection
      return await dbAddProduct(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async updateProduct(productData) {
    try {
      // validation & db connection
      return await dbUpdateProduct(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      // validation & db connection
      return await dbDeleteProduct(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
  }
}