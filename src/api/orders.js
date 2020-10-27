import express from 'express';

import Orders from '../services/orders.js';
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
    res.json(await orders.getOrder(req.params.id));
  } catch (err) {
    errorResponse(err, res);
  }
});

ordersRouter.post('/:id?', async (req, res) => {
  console.log(`POST Order`);
  console.log(req.body);
  try {
    await orders.addOrder( { _id: req.params.id , ...req.body } )
    res.json({
      ok: true
    });
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