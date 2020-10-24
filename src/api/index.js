import express from 'express';

import { ordersRouter } from './orders.js';
import { productsRouter } from './products.js';
import { staffRouter } from './staff.js';

// Create routers
export const mainRouter = express.Router();
const groupingRouter = express.Router();
// Use routers
groupingRouter.use('/orders', ordersRouter);
groupingRouter.use('/products', productsRouter);
groupingRouter.use('/staff', staffRouter);

mainRouter.use('/main/1', groupingRouter);


// Main response - available paths info
mainRouter.get('/main/1', (req, res) => {
  res.json({
    availablePaths: ['/orders', '/products', '/staff']
  });
});


// Error 404 handling
mainRouter.use((req, res, next) => {
  res.status(404).send('Page not found');
});