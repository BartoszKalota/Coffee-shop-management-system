import express from 'express';

import Orders from '../services/orders.js';
import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import errorResponse from '../utils/errorResponse.js';

const orders = new Orders();

export const ordersRouter = express.Router();

ordersRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

ordersRouter.get('/:id', async (req, res) => {
  console.log(`GET Order id:${req.params.id}`);
  try {
    const foundItem = await orders.getOrder(req.params.id);
    if (foundItem) {
      res.json(foundItem);
    }
    throw new Error(NOT_FOUND);
  } catch (err) {
    errorResponse(err, res);
  }
});

ordersRouter.post('/:id?', async (req, res) => {
  console.log(`POST Order`);
  console.log(req.body);
  try {
    if (!Object.keys(req.body).length) throw new Error(MISSING_DATA);
    const addResult = await orders.addOrder( { _id: req.params.id , ...req.body } );
    if (addResult) {
      console.log('Order added!');
      res.json({
        ok: true
      });
    }
    throw new Error(CONFLICT);
  } catch (err) {
    errorResponse(err, res);
  }
});

ordersRouter.put('/:id', async (req, res) => {
  console.log(`PUT Order id:${req.params.id}`);
  console.log(req.body);
  try {
    await orders.updateOrder(req.params.id, req.body);
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

ordersRouter.delete('/:id', async (req ,res) => {
  console.log(`DELETE Order id:${req.params.id}`);
  try {
    await orders.deleteOrder(req.params.id);
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});