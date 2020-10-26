import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

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
  }

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