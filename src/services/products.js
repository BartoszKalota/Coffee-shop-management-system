import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default class Products {
  async getAllProducts() {

  }
  
  async getProduct(productId) {
    if (!productId) throw new Error(MISSING_DATA);

  }

  async addProduct(productData) {
    if (!productData) throw new Error(MISSING_DATA);
    if (productData._id === this.mockProduct._id) throw new Error(CONFLICT);

  }

  async updateProduct(productId, productData) {
    if (!productId || !productData) throw new Error(MISSING_DATA);
    if (productId !== this.mockProduct._id) throw new Error(NOT_FOUND);

  }

  async deleteProduct(productId) {
    if (!productId) throw new Error(MISSING_DATA);
    if (productId !== this.mockProduct._id) throw new Error(NOT_FOUND);

  }
}