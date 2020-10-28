import express from 'express';

import Products from '../services/products.js';
import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import errorResponse from '../utils/errorResponse.js';

const products = new Products();

export const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /all', 'GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

productsRouter.get('/all', async (req, res) => {
  console.log('GET Products - All available products');
  try {
    res.json(await products.getAllProducts());
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.get('/:id', async (req, res) => {
  console.log(`GET Product id:${req.params.id}`);
  try {
    res.json(await products.getProduct(req.params.id));
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.post('/:id?', async (req, res) => {
  console.log(`POST Product`);
  console.log(req.body);
  try {
    if (!Object.keys(req.body).length) throw new Error(MISSING_DATA);
    const addResult = await products.addProduct( { _id: req.params.id, ...req.body } );
    if (addResult) {
      console.log('Product added!');
      res.json({
        ok: true
      });
    }
    throw new Error(CONFLICT);
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.put('/:id', async (req, res) => {
  console.log(`PUT Product id:${req.params.id}`);
  console.log(req.body);
  try {
    await products.updateProduct(req.params.id, req.body);
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.delete('/:id', async (req ,res) => {
  console.log(`DELETE Product id:${req.params.id}`);
  try {
    await products.deleteProduct(req.params.id);
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});