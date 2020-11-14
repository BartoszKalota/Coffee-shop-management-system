import mongoose from 'mongoose';

import { PAGE_SIZE } from '../constants/db.js';
import { PRODUCT_NOT_AVAILABLE } from '../constants/error.js';

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
    required: true,
    min: [1, 'Must be at least one available product']
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

export const updateProductsAmountDueToOrder = async (productsData) => {
  // 'for' loop approach since map/forEach methods did not finish Promises
  const updateResultsArr = [];
  const missingProducts = [];
  for (let i = 0; i < productsData.length; i++) {
    const { _id, amount } = productsData[i];
    const result = await Product
      .updateOne(
        {
          _id: mongoose.Types.ObjectId(_id),
          available: { '$gte': 0 } // it prevents to receive negative product amount when '$inc'
        },
        {
          '$inc': {
            'available': amount
          }
        },
        { upsert: false }
      )
      .exec();

    updateResultsArr.push(result.nModified);

    // Build error info: product amount is going to be < 0
    if (result.nModified === 0) {
      missingProducts.push(productsData[i].name);
    }
  }

  // Error: product amount is going to be < 0
  if (missingProducts.length) {
    missingProducts.forEach(missingProduct => {
      console.log(`Ordered product - ${missingProduct} - is not available (amount 0)`);
    });
    throw new Error(PRODUCT_NOT_AVAILABLE);
  }
};

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
    .lean()
    .exec();
};

export const getProduct = async (productId) => {
  return await Product
    .findById(productId)
    .lean()
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