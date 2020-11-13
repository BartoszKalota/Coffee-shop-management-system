import mongoose from 'mongoose';

import { PAGE_SIZE } from '../constants/db.js';

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

export const getAllProducts = async ({ amountAtLeast, brand, categories, page = 0 }) => {
  const query = {};
  // include searchFilters to query
  if (amountAtLeast) {
    query.available = {
      $gte: +amountAtLeast
    };
  }
  if (brand) {
    query.brand = brand;
  }
  if (categories) {
    query.categories = {
      $all: categories.split(',')
    }
  }

  // page = 1 results as skip(0) (really first page)
  const pageNumber = page > 0 ? (+page - 1) : 0;
  
  return await Product
    .find(query)
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * pageNumber)
    .exec();
};

export const getSelectedProductsForOrder = async (productIds) => {
  return await Product
    .find({
      _id: {
        '$in': productIds
      }
    })
    .exec();
};

export const getProduct = async (productId) => {
  return await Product
    .findById(productId)
    .exec();
};

export const addProduct = async (productData) => {
  const productInstance = new Product(productData);
  const result = await productInstance.save();
  return result._id;
};

export const updateProduct = async (productData) => {
  const dataToUpdate = { ...productData };
  delete dataToUpdate._id;  // need to delete _id for correct update procedure

  const result = await Product
    .updateOne(
      {
        _id: productData._id
      },
      {
        '$set': dataToUpdate
      },
      { upsert: false }
    )
    .exec();
  return result.nModified;
};

export const deleteProduct = async (productId) => {
  const result = await Product
    .deleteOne({
      _id: productId
    })
    .exec();
  return result.deletedCount;
};