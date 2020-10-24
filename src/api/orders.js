import express from 'express';

export const ordersRouter = express.Router();

ordersRouter.get('/', (req, res) => {
  res.send('Order router');
});