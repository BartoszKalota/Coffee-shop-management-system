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

productsRouter.get('/:id', async (req, res) => {
  console.log(`GET Product id:${req.params.id}`);
  try {
    res.json(await products.getProduct(req.params.id));
  } catch (err) {
    if (err.message === MISSING_DATA) {
      res.status(400).send('Missing input data');
    }
    res.status(500).send(`Server error: ${err.message}`);
  }
});

productsRouter.post('/:id?', async (req, res) => {
  console.log(`POST Product`);
  console.log(req.body);
  try {
    await products.addProduct( { _id: req.params.id, ...req.body } );
    res.json({
      ok: true
    });
  } catch (err) {
    if (err.message === MISSING_DATA) {
      res.status(400).send('Missing input data');
    }
    if (err.message === CONFLICT) {
      res.status(409).send('Item already exists');
    }
    res.status(500).send(`Server error: ${err.message}`);
  }
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