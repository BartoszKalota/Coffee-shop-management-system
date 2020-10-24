import express from 'express';

export const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  res.send('Products router');
});