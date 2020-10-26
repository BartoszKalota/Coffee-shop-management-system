import express from 'express';

import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import Orders from '../services/orders.js';

export const ordersRouter = express.Router();

ordersRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

ordersRouter.get('/:id', async (req, res) => {
  console.log(`GET Order id:${req.params.id}`);
  try {
    res.json(await Orders.getOrder(req.params.id));
  } catch (err) {
    res.status(500).send(`Server error: ${err.message}`);
  }
});

ordersRouter.post('/:id?', async (req, res) => {
  console.log(`POST Order`);
  console.log(req.body);
  try {
    await Orders.addOrder( { _id: req.params.id , ...req.body } )
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

ordersRouter.put('/:id', async (req, res) => {
  console.log(`PUT Order id:${req.params.id}`);
  console.log(req.body);
  try {
    await Orders.updateOrder(req.params.id, req.body);
    res.json({
      ok: true
    });
  } catch (err) {
    if (err.message === MISSING_DATA) {
      res.status(400).send('Missing input data');
    }
    if (err.message === NOT_FOUND) {
      res.status(404).send('Item not found');
    }
    res.status(500).send(`Server error: ${err.message}`);
  }
});

ordersRouter.delete('/:id', async (req ,res) => {
  console.log(`DELETE Order id:${req.params.id}`);
  try {
    await Orders.deleteOrder(req.params.id);
    res.json({
      ok: true
    });
  } catch (err) {
    if (err.message === MISSING_DATA) {
      res.status(400).send('Missing input data');
    }
    if (err.message === NOT_FOUND) {
      res.status(404).send('Item not found');
    }
    res.status(500).send(`Server error: ${err.message}`);
  }
});