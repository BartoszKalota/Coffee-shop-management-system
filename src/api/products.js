import express from 'express';

import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import Products from '../services/products.js';

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
    res.status(500).send(`Server error: ${err.message}`);
  }
});

productsRouter.get('/:id', (req, res) => {
  console.log(`GET Product id:${req.params.id}`);
  // temporary mock
  res.json({
    _id: '123',
    name: 'Mocha',
    brand: 'Bialetti',
    lastOrderDate: new Date(),
    unitPrice: 2,
    supplierName: 'EuroKawexpol',
    available: 10,
    expirationDate: new Date(),
    categories: ['coffee']
  });
});

productsRouter.post('/:id?', (req, res) => {
  console.log(`POST Product`);
  console.log(req.body);
  // temporary mock
  res.json({
    ok: true
  });
});

productsRouter.put('/:id', (req, res) => {
  console.log(`PUT Product id:${req.params.id}`);
  console.log(req.body);
  // temporary mock
  res.json({
    ok: true
  });
});

productsRouter.delete('/:id', (req ,res) => {
  console.log(`DELETE Product id:${req.params.id}`);
  // temporary mock
  res.json({
    ok: true
  });
});